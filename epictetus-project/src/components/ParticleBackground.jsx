import { useEffect, useRef } from "react";
import "./ParticleBackground.css";

const PARTICLE_COUNT = 2500;
const PARTICLE_COLOR = "167, 139, 250";
const HOVER_RADIUS = 100;
const MAX_PUSH = 16;

export default function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let width = 0;
        let height = 0;
        let particles = [];
        let frameId = null;
        const mouse = { x: -9999, y: -9999 };

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function createParticles() {
            particles = Array.from({ length: PARTICLE_COUNT }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.1 + 0.5,
                vx: (Math.random() - 0.5) * 0.12,
                vy: (Math.random() - 0.5) * 0.12,
                baseAlpha: Math.random() * 0.5 + 0.2,
                twinklePhase: Math.random() * Math.PI * 2
            }));
        }

        function draw(time) {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                if (!prefersReducedMotion) {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < -5) p.x = width + 5;
                    if (p.x > width + 5) p.x = -5;
                    if (p.y < -5) p.y = height + 5;
                    if (p.y > height + 5) p.y = -5;
                }

                const twinkle = prefersReducedMotion
                    ? 1
                    : (Math.sin(time / 1400 + p.twinklePhase) + 1) / 2;
                let alpha = p.baseAlpha * (0.5 + twinkle * 0.5);
                let drawX = p.x;
                let drawY = p.y;
                let drawR = p.r;

                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < HOVER_RADIUS) {
                    const force = (HOVER_RADIUS - dist) / HOVER_RADIUS;
                    const angle = Math.atan2(dy, dx);
                    drawX += Math.cos(angle) * force * MAX_PUSH;
                    drawY += Math.sin(angle) * force * MAX_PUSH;
                    alpha = Math.min(1, alpha + force * 0.45);
                    drawR = p.r * (1 + force * 0.35);
                }

                ctx.beginPath();
                ctx.arc(drawX, drawY, drawR, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${alpha})`;
                ctx.fill();
            });

            if (!prefersReducedMotion) {
                frameId = requestAnimationFrame(draw);
            }
        }

        function handleResize() {
            resize();
            createParticles();
        }

        function handlePointerMove(e) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }

        function handlePointerLeave() {
            mouse.x = -9999;
            mouse.y = -9999;
        }

        resize();
        createParticles();
        draw(0);

        window.addEventListener("resize", handleResize);

        if (!prefersReducedMotion) {
            window.addEventListener("mousemove", handlePointerMove);
            document.documentElement.addEventListener("mouseleave", handlePointerLeave);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handlePointerMove);
            document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="particle-background" aria-hidden="true" />;
}
