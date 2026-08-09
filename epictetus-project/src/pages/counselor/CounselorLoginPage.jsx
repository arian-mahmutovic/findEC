import "./CounselorLoginPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import ParticleBackground from "../../components/ParticleBackground";
import { counselorLogin } from "../../services/counselors";

const CONTACT_EMAIL = "counselors@epictetusproject.com";

export default function CounselorLoginPage() {
    const navigate = useNavigate();
    const [accessKey, setAccessKey] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await counselorLogin(accessKey);

        setLoading(false);

        if (result.error) {
            setError("That access key wasn't recognized. Double-check it and try again.");
            return;
        }

        navigate("/counselor/dashboard");
    }

    return (
        <main className="counselor-login-page">

            <ParticleBackground />

            <div className="counselor-login-card">

                <Link to="/" className="counselor-login-brand">Epictetus Project</Link>

                <span className="counselor-login-eyebrow">Counselor Portal</span>

                <h1>Sign in with your access key</h1>

                <p>
                    Enter the key provided by Epictetus Project to view the students
                    who&rsquo;ve linked their account to you.
                </p>

                <form onSubmit={handleSubmit}>

                    <label htmlFor="counselor-access-key">Access key</label>

                    <input
                        id="counselor-access-key"
                        type="text"
                        placeholder="e.g. CSL-4821-XQ"
                        autoComplete="off"
                        spellCheck="false"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        required
                    />

                    {error && <p className="counselor-login-error">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Checking…" : "Continue"}
                    </button>

                </form>

                <p className="counselor-login-help">
                    Don&rsquo;t have a key? <a href={`mailto:${CONTACT_EMAIL}`}>Contact us</a>.
                </p>

                <Link to="/" className="counselor-login-student-link">
                    Not a counselor? To student page
                </Link>

            </div>

        </main>
    );
}
