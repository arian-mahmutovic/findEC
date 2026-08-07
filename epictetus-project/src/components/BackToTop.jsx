import { useEffect, useState } from "react";
import "./BackToTop.css";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function onScroll() {
            setVisible(window.scrollY > 500);
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (!visible) return null;

    return (
        <button
            type="button"
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            &#8593;
        </button>
    );
}
