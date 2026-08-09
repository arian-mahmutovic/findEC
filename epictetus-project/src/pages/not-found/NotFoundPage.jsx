import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import "./NotFoundPage.css";

export default function NotFoundPage() {
    const { user } = useAuth();

    return (
        <main className="not-found-page">
            <div className="not-found-card">
                <span className="not-found-eyebrow">Error 404</span>
                <h1>This page wandered off.</h1>
                <p>
                    The page you&rsquo;re looking for doesn&rsquo;t exist, moved, or
                    the link was mistyped.
                </p>

                <Link to={user ? "/home" : "/"} className="not-found-link">
                    {user ? "Back to your dashboard" : "Back to home"}
                </Link>
            </div>
        </main>
    );
}
