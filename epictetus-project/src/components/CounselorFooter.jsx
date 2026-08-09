import { Link } from "react-router";
import "./CounselorFooter.css";

const CONTACT_EMAIL = "counselors@epictetusproject.com";

export default function CounselorFooter() {
    return (
        <footer className="counselor-footer">
            <div className="counselor-footer-inner">
                <Link to="/counselor/dashboard" className="counselor-footer-brand">Epictetus Project</Link>

                <span className="counselor-footer-copy">&copy; {new Date().getFullYear()} &middot; Counselor Portal</span>

                <a href={`mailto:${CONTACT_EMAIL}`} className="counselor-footer-contact">
                    {CONTACT_EMAIL}
                </a>
            </div>
        </footer>
    );
}
