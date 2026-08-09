import '../../styles/modal-shell.css';
import './AuthModal.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signup, login, loginWithGoogle, sendPasswordReset, resendConfirmationEmail } from '../../services/auth';
import { subscribeToNewsletter } from '../../services/newsletter';
import { saveUserPreferences } from '../../services/preferences';

export default function AuthModal({ mode, setMode, closeForm }) {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [newsletterOptIn, setNewsletterOptIn] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [resending, setResending] = useState(false);
    const [showResend, setShowResend] = useState(false);

    const isSignup = mode === 'signup';

    function switchMode(nextMode) {
        setError('');
        setNotice('');
        setShowResend(false);
        setMode(nextMode);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setNotice('');
        setShowResend(false);
        setLoading(true);

        const result = isSignup
            ? await signup(fullName, email, password)
            : await login(email, password);

        setLoading(false);

        if (result.error) {
            setError(result.error.message);

            if (!isSignup && result.error.message?.toLowerCase().includes('email not confirmed')) {
                setShowResend(true);
            }
            return;
        }

        if (isSignup && newsletterOptIn && result.data.user) {
            await subscribeToNewsletter(email, { userId: result.data.user.id, source: 'signup' });
            await saveUserPreferences(result.data.user.id, { newsletterOptIn: true });
        }

        if (!result.data.session) {
            setNotice("Account created! Check your email to confirm it, then log in.");
            setMode('login');
            return;
        }

        closeForm();
        navigate('/home', { state: { user: result.data.user } });
    }

    async function handleGoogle() {
        setError('');
        const result = await loginWithGoogle();

        if (result.error) {
            setError(result.error.message);
        }
    }

    async function handleForgotPassword() {
        setError('');
        setNotice('');

        if (!email) {
            setError('Enter your email above first, then tap "Forgot password?" again.');
            return;
        }

        setResetting(true);
        const result = await sendPasswordReset(email);
        setResetting(false);

        if (result.error) {
            setError(result.error.message);
            return;
        }

        setNotice('Password reset link sent! Check your email.');
    }

    async function handleResendConfirmation() {
        setError('');
        setResending(true);
        const result = await resendConfirmationEmail(email);
        setResending(false);

        if (result.error) {
            setError(result.error.message);
            return;
        }

        setShowResend(false);
        setNotice('Confirmation email sent! Check your inbox.');
    }

    return (
        <div className="signup-overlay" onClick={closeForm}>

            <div className="signup-modal" onClick={(e) => e.stopPropagation()}>

                <button className="close-button" onClick={closeForm} aria-label="Close">
                    &#10005;
                </button>

                <span className="modal-eyebrow">
                    {isSignup ? 'Join the platform' : 'Welcome back'}
                </span>

                <h2>{isSignup ? 'Create your account' : 'Log in'}</h2>

                <p>
                    {isSignup
                        ? 'Save competitions, receive personalized recommendations, and unlock the full database.'
                        : 'Pick up right where you left off.'}
                </p>

                <form onSubmit={handleSubmit}>

                    {isSignup && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="password-field">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
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

                    {!isSignup && (
                        <button
                            type="button"
                            className="forgot-password-link"
                            onClick={handleForgotPassword}
                            disabled={resetting}
                        >
                            {resetting ? 'Sending reset link…' : 'Forgot password?'}
                        </button>
                    )}

                    {isSignup && (
                        <label className="newsletter-checkbox">
                            <input
                                type="checkbox"
                                checked={newsletterOptIn}
                                onChange={(e) => setNewsletterOptIn(e.target.checked)}
                            />
                            Email me new competitions and guides as they go live
                        </label>
                    )}

                    {notice && <p className="form-notice">{notice}</p>}

                    {error && <p className="form-error">{error}</p>}

                    {showResend && (
                        <button
                            type="button"
                            className="resend-confirmation-link"
                            onClick={handleResendConfirmation}
                            disabled={resending}
                        >
                            {resending ? 'Sending…' : 'Resend confirmation email'}
                        </button>
                    )}

                    <button type="submit" className="signup-button" disabled={loading}>
                        {loading
                            ? (isSignup ? 'Creating account…' : 'Logging in…')
                            : (isSignup ? 'Create Account' : 'Log In')}
                    </button>

                    {isSignup && (
                        <p className="modal-privacy-note">
                            We&rsquo;ll only use your email for your account and, if checked,
                            the newsletter&mdash;never shared, never sold.
                        </p>
                    )}

                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <button className="google-button" onClick={handleGoogle} type="button">
                    Continue with Google
                </button>

                <p className="login-link">
                    {isSignup ? 'Already have an account?' : "Don't have an account yet?"}
                    <button
                        type="button"
                        onClick={() => switchMode(isSignup ? 'login' : 'signup')}
                    >
                        {isSignup ? 'Log in' : 'Sign up'}
                    </button>
                </p>

            </div>

        </div>
    );
}
