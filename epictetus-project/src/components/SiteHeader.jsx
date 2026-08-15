import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../services/auth";
import NewsletterModal from "./NewsletterModal";
import ProfileModal from "./ProfileModal";
import ThemeToggle from "./ThemeToggle";
import "./SiteHeader.css";

const YOUTUBE_URL = "https://www.youtube.com/@EpictetusProject";

export default function SiteHeader({ actions }) {
    const { user, profile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [showNewsletter, setShowNewsletter] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const fullName = (profile?.full_name || user?.user_metadata?.full_name || "").trim();
    const initials = fullName
        ? fullName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("")
        : "?";

    const aboutPath = user ? "/home" : "/";

    function handleAboutClick(e) {
        e.preventDefault();

        if (location.pathname === aboutPath) {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate(`${aboutPath}#about`);
        }
    }

    async function handleSignOut() {
        await signOut();
        navigate("/", { replace: true });
    }

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <Link to={user ? "/home" : "/"} className="site-header-brand">Epictetus Project</Link>

                <nav className="site-header-nav" aria-label="Primary">
                    {user && <Link to="/home">Dashboard</Link>}
                    {user && location.pathname !== "/competitions" && <Link to="/competitions">Competitions</Link>}
                    <button type="button" className="site-header-nav-button" onClick={() => setShowNewsletter(true)}>
                        Newsletter
                    </button>
                    <a href={`${aboutPath}#about`} onClick={handleAboutClick}>About</a>

                    <a
                        href={YOUTUBE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="site-header-icon-btn"
                        aria-label="Watch on YouTube"
                        title="YouTube"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.5v5l4.5-2.5Z" fill="#111111"/></svg>
                    </a>
                </nav>

                <ThemeToggle className="site-header-icon-btn site-header-theme-toggle" />

                {user ? (
                    <div className="site-header-actions">
                        <button
                            type="button"
                            className="site-header-avatar"
                            onClick={() => setShowProfile(true)}
                            aria-label="Open your profile"
                        >
                            {initials}
                        </button>
                        <button type="button" className="site-header-signout" onClick={handleSignOut}>
                            Sign out
                        </button>
                    </div>
                ) : (
                    actions && <div className="site-header-actions">{actions}</div>
                )}
            </div>

            {showNewsletter && <NewsletterModal closeForm={() => setShowNewsletter(false)} />}
            {showProfile && <ProfileModal closeForm={() => setShowProfile(false)} />}
        </header>
    );
}
