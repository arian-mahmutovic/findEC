import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../services/auth";
import NewsletterModal from "./NewsletterModal";
import ProfileModal from "./ProfileModal";
import "./SiteHeader.css";

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

    function handleAboutClick(e) {
        e.preventDefault();

        if (location.pathname === "/") {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate("/#about");
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
                    {user && <Link to="/competitions">Competitions</Link>}
                    <button type="button" className="site-header-nav-button" onClick={() => setShowNewsletter(true)}>
                        Newsletter
                    </button>
                    <a href="/#about" onClick={handleAboutClick}>About</a>
                </nav>

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
