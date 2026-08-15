import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToNewsletter } from '../services/newsletter';
import { saveUserPreferences } from '../services/preferences';
import '../styles/modal-shell.css';

export default function NewsletterModal({ closeForm }) {
    const { user, refreshProfile } = useAuth();

    const [email, setEmail] = useState(user?.email || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await subscribeToNewsletter(email, {
            userId: user?.id,
            source: 'newsletter_modal'
        });

        if (result.error) {
            setLoading(false);
            setError(result.error.message);
            return;
        }

        if (user) {
            await saveUserPreferences(user.id, { newsletterOptIn: true });
            refreshProfile();
        }

        setLoading(false);
        setSuccess(true);
    }

    return (
        <div className="signup-overlay" onClick={closeForm}>

            <div className="signup-modal" onClick={(e) => e.stopPropagation()}>

                <button className="close-button" onClick={closeForm} aria-label="Close">
                    &#10005;
                </button>

                <span className="modal-eyebrow">Stay in the loop</span>

                <h2>Join the newsletter</h2>

                {success ? (
                    <>
                        <p>
                            You&rsquo;re in! We&rsquo;ll send a weekly roundup of new competitions
                            and guides to <strong>{email}</strong>.
                        </p>

                        <button type="button" className="signup-button" onClick={closeForm}>
                            Done
                        </button>
                    </>
                ) : (
                    <>
                        <p>
                            One weekly email with the best new competitions, scholarships,
                            and guides&mdash;no spam, unsubscribe any time.
                        </p>

                        <form onSubmit={handleSubmit}>

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            {error && <p className="form-error">{error}</p>}

                            <button type="submit" className="signup-button" disabled={loading}>
                                {loading ? 'Subscribing…' : 'Subscribe'}
                            </button>

                        </form>

                        <p className="modal-privacy-note">
                            We&rsquo;ll only use this to send the newsletter&mdash;never shared, never sold.
                        </p>
                    </>
                )}

            </div>

        </div>
    );
}
