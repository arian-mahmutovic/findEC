import { Link } from "react-router";
import "./SiteHeader.css";

export default function SiteHeader() {
    return (
        <header className="site-header">
            <div className="site-header-inner">
                <Link to="/" className="site-header-brand">Epictetus Project</Link>

                <nav className="site-header-nav" aria-label="Primary">
                    <Link to="/competitions">Competitions</Link>
                    <a href="#">Guides</a>
                    <a href="#">Newsletter</a>
                    <a href="#">About</a>
                </nav>
            </div>
        </header>
    );
}
