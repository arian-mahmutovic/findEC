import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../services/auth";
import "./SiteHeader.css";

export default function SiteHeader({ actions }) {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const fullName = user?.user_metadata?.full_name?.trim();
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
                    {user && <Link to="/competitions">Competitions</Link>}
                    <a href="#">Guides</a>
                    <a href="#">Newsletter</a>
                    <a href="/#about" onClick={handleAboutClick}>About</a>
                </nav>

                {user ? (
                    <div className="site-header-actions">
                        <span className="site-header-avatar" aria-hidden="true">{initials}</span>
                        <button type="button" className="site-header-signout" onClick={handleSignOut}>
                            Sign out
                        </button>
                    </div>
                ) : (
                    actions && <div className="site-header-actions">{actions}</div>
                )}
            </div>
        </header>
    );
}
