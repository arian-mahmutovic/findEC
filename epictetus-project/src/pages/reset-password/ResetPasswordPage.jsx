import './ResetPasswordPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import SiteHeader from '../../components/SiteHeader';
import { updatePassword } from '../../services/auth';

export default function ResetPasswordPage() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await updatePassword(password);

        setLoading(false);

        if (result.error) {
            setError(result.error.message);
            return;
        }

        navigate('/home');
    }

    return (
        <>
        <SiteHeader />
        <main className="reset-password-page">

            <div className="reset-password-card">

                <span className="modal-eyebrow">Set a new password</span>

                <h1>Choose a new password</h1>

                <p>
                    You followed a password reset link&mdash;pick a new password
                    for your account below.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="password-field">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5M9.9 5.2A10.6 10.6 0 0 1 12 5c5 0 9 4 10.5 7-.6 1.2-1.5 2.5-2.7 3.6M6.2 6.6C4.3 8 2.9 9.9 1.5 12c1.5 3 5.5 7 10.5 7 1.3 0 2.6-.3 3.8-.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
                            )}
                        </button>
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="signup-button" disabled={loading}>
                        {loading ? 'Saving…' : 'Save new password'}
                    </button>

                </form>

            </div>

        </main>
        </>
    );
}
