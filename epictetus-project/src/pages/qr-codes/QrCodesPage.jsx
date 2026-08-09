import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { getAllTrackableLinks } from "../../services/trackableLinks";
import "./QrCodesPage.css";

function QrCodeCard({ link }) {
    const canvasRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const url = `${window.location.origin}/go/${link.slug}`;

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, url, { width: 320, margin: 2 });
        }
    }, [url]);

    function handleDownload() {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${link.slug}-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function handleCopyLink() {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="qr-card">
            <canvas ref={canvasRef} className="qr-card-canvas" />
            <strong>{link.label || link.slug}</strong>
            <code>{url}</code>
            <div className="qr-card-actions">
                <button type="button" onClick={handleDownload}>Download PNG</button>
                <button type="button" onClick={handleCopyLink}>{copied ? "Copied" : "Copy Link"}</button>
            </div>
        </div>
    );
}

export default function QrCodesPage() {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllTrackableLinks().then((result) => {
            setLinks(result.data || []);
            setLoading(false);
        });
    }, []);

    return (
        <main className="qr-codes-page">
            <div className="qr-codes-content">
                <h1>Trackable Links &amp; QR Codes</h1>
                <p>
                    Print or share these. Each one records where a visit came from before
                    redirecting to the site, so you can see which channels actually work.
                </p>

                {loading ? (
                    <p className="qr-codes-loading">Loading…</p>
                ) : links.length === 0 ? (
                    <p className="qr-codes-loading">No trackable links yet.</p>
                ) : (
                    <div className="qr-grid">
                        {links.map((link) => (
                            <QrCodeCard link={link} key={link.id} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
