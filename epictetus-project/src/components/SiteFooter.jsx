import { Link } from "react-router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./SiteFooter.css";

const CONTACT_EMAIL = "hello@epictetusproject.com";
const YOUTUBE_URL = "https://www.youtube.com/results?search_query=Flamingo";

export default function SiteFooter() {
    const { user } = useAuth();
    const [shared, setShared] = useState(false);

    async function handleShare() {
        const shareData = {
            title: document.title,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // user cancelled the share sheet, nothing to do
            }
            return;
        }

        await navigator.clipboard.writeText(shareData.url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
    }

    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <Link to={user ? "/home" : "/"} className="site-footer-brand">Epictetus Project</Link>

                <span className="site-footer-copy">&copy; {new Date().getFullYear()}</span>

                <div className="site-footer-icons">
                    <button
                        type="button"
                        className="site-footer-icon-btn"
                        onClick={handleShare}
                        aria-label="Share this page"
                        title={shared ? "Link copied!" : "Share"}
                    >
                        {shared ? (
                            <span className="site-footer-icon-check" aria-hidden="true">&#10003;</span>
                        ) : (
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .05 2.06l-6.17 3.6a3 3 0 1 0 0 4.68l6.17 3.6A3 3 0 1 0 18 16a2.99 2.99 0 0 0-2.05.82l-6.17-3.6a3.02 3.02 0 0 0 0-2.44l6.17-3.6C16.5 7.7 17.22 8 18 8Z"/></svg>
                        )}
                    </button>

                    <a
                        href={YOUTUBE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="site-footer-icon-btn"
                        aria-label="Watch on YouTube"
                        title="YouTube"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.5v5l4.5-2.5Z" fill="#111111"/></svg>
                    </a>

                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="site-footer-icon-btn"
                        aria-label="Email us"
                        title="Email"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5" fill="none" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
