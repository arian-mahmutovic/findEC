import "./CounselorLoginPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const CONTACT_EMAIL = "counselors@epictetusproject.com";

export default function CounselorLoginPage() {
    const navigate = useNavigate();
    const [accessKey, setAccessKey] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        navigate("/counselor/dashboard");
    }

    return (
        <main className="counselor-login-page">

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

                    <button type="submit">Continue</button>

                </form>

                <p className="counselor-login-help">
                    Don&rsquo;t have a key? <a href={`mailto:${CONTACT_EMAIL}`}>Contact us</a>.
                </p>

            </div>

        </main>
    );
}
