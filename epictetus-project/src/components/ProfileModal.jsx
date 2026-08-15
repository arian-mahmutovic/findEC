import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { deleteAccount } from '../services/auth';
import { getUserPreferences, saveUserPreferences } from '../services/preferences';
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '../services/newsletter';
import { getCounselorsForSchool } from '../services/counselors';
import SchoolCombobox from './SchoolCombobox';
import { INTEREST_TAGS } from '../data/interests';
import '../styles/modal-shell.css';
import './ProfileModal.css';

const COUNSELOR_EMAIL = 'counselors@epictetusproject.com';

function buildInviteEmail(school) {
    const subject = `Set up an Epictetus Project counselor account for ${school}`;
    const body = `Hi,\n\nI'm a student at ${school} using Epictetus Project (epictetusproject.com) to track competitions and scholarship deadlines. I noticed our school doesn't have a counselor account set up yet.\n\nWould you be able to email ${COUNSELOR_EMAIL} to get one set up? It only takes a minute, and it'll let you see which competitions your students are tracking.\n\nThanks!`;
    return { subject, body };
}

export default function ProfileModal({ closeForm }) {
    const { user, profile, refreshProfile } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [school, setSchool] = useState('');
    const [isKnownSchool, setIsKnownSchool] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);
    const [grade, setGrade] = useState('');
    const [interests, setInterests] = useState([]);
    const [newsletterOptIn, setNewsletterOptIn] = useState(false);
    const [counselorId, setCounselorId] = useState('');
    const [counselorOptions, setCounselorOptions] = useState([]);
    const [loadingCounselors, setLoadingCounselors] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!user) return;

        setFullName(profile?.full_name || '');
        setSchool(profile?.school || '');
        setIsKnownSchool(!!profile?.school);
        setGrade(profile?.grade ? String(profile.grade) : '');
        setNewsletterOptIn(!!profile?.newsletter_opt_in);
        setCounselorId(profile?.counselor_id || '');

        getUserPreferences(user.id).then((result) => {
            setInterests(result.data?.interests || []);
            setLoadingData(false);
        });
    }, [user, profile]);

    useEffect(() => {
        if (!isKnownSchool) {
            setCounselorOptions([]);
            return;
        }

        let cancelled = false;
        setLoadingCounselors(true);

        getCounselorsForSchool(school).then((result) => {
            if (cancelled) return;
            const options = result.data || [];
            setCounselorOptions(options);
            setCounselorId((current) => (options.some((c) => c.id === current) ? current : ''));
            setLoadingCounselors(false);
        });

        return () => { cancelled = true; };
    }, [school, isKnownSchool]);

    function handleSchoolChange(value) {
        setSchool(value);
        setIsKnownSchool(false);
    }

    function handleSchoolPick(pickedSchool) {
        setSchool(pickedSchool.name);
        setIsKnownSchool(true);
    }

    async function handleCopyInviteEmail() {
        const { subject, body } = buildInviteEmail(school);
        await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    }

    function toggleInterest(tag) {
        setInterests((current) =>
            current.includes(tag)
                ? current.filter((t) => t !== tag)
                : [...current, tag]
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setNotice('');

        if (counselorOptions.length > 0 && !counselorId) {
            setError('Select your counselor to continue.');
            return;
        }

        setSaving(true);

        const result = await saveUserPreferences(user.id, {
            fullName,
            school,
            grade: grade ? Number(grade) : null,
            interests,
            newsletterOptIn,
            counselorId: counselorId || null
        });

        if (result.error) {
            setSaving(false);
            setError(result.error.message);
            return;
        }

        if (newsletterOptIn) {
            await subscribeToNewsletter(user.email, { userId: user.id, source: 'profile' });
        } else {
            await unsubscribeFromNewsletter(user.id);
        }

        await refreshProfile();

        setSaving(false);
        setNotice('Profile updated.');
    }

    async function handleDeleteAccount() {
        setDeleting(true);
        setError('');

        const result = await deleteAccount();

        setDeleting(false);

        if (result.error) {
            setError(result.error.message);
            return;
        }

        closeForm();
        navigate('/', { replace: true });
    }

    if (!user) return null;

    return (
        <div className="signup-overlay" onClick={closeForm}>

            <div className="signup-modal signup-modal-wide" onClick={(e) => e.stopPropagation()}>

                <button className="close-button" onClick={closeForm} aria-label="Close">
                    &#10005;
                </button>

                <span className="modal-eyebrow">Your profile</span>
                <h2>Account settings</h2>
                <p>Update your details, interests, and newsletter preference.</p>

                {loadingData ? (
                    <div className="profile-loading">
                        <span className="profile-loading-dot" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>

                        <label className="profile-label" htmlFor="profile-name">Full name</label>
                        <input
                            id="profile-name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full name"
                        />

                        <label className="profile-label" htmlFor="profile-school">High school</label>
                        <SchoolCombobox
                            id="profile-school"
                            value={school}
                            onChange={handleSchoolChange}
                            onPick={handleSchoolPick}
                            placeholder="Search for your school…"
                        />

                        {counselorOptions.length > 0 && (
                            <>
                                <label className="profile-label" htmlFor="profile-counselor">Your counselor</label>
                                <select
                                    id="profile-counselor"
                                    value={counselorId}
                                    onChange={(e) => setCounselorId(e.target.value)}
                                >
                                    <option value="">Select your counselor…</option>
                                    {counselorOptions.map((counselor) => (
                                        <option key={counselor.id} value={counselor.id}>
                                            {counselor.name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        {!loadingCounselors && isKnownSchool && counselorOptions.length === 0 && (
                            <div className="no-counselor-cta">
                                <p>
                                    No counselors registered for {school} yet. If you&rsquo;d like your
                                    counselor set up, send them this &mdash; they just need to email{' '}
                                    {COUNSELOR_EMAIL}.
                                </p>
                                <button type="button" onClick={handleCopyInviteEmail}>
                                    {emailCopied ? 'Copied!' : 'Copy invite email'}
                                </button>
                            </div>
                        )}

                        <label className="profile-label" htmlFor="profile-grade">
                            Grade <span>(optional)</span>
                        </label>
                        <select
                            id="profile-grade"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        >
                            <option value="">Prefer not to say</option>
                            <option value="9">9th grade</option>
                            <option value="10">10th grade</option>
                            <option value="11">11th grade</option>
                            <option value="12">12th grade</option>
                        </select>

                        <label className="profile-label">Interests</label>
                        <div className="profile-tags">
                            {INTEREST_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    className={`profile-tag ${interests.includes(tag) ? 'is-active' : ''}`}
                                    onClick={() => toggleInterest(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <label className="newsletter-checkbox profile-newsletter-row">
                            <input
                                type="checkbox"
                                checked={newsletterOptIn}
                                onChange={(e) => setNewsletterOptIn(e.target.checked)}
                            />
                            Email me a weekly roundup of new competitions and guides
                        </label>

                        {notice && <p className="form-notice">{notice}</p>}
                        {error && <p className="form-error">{error}</p>}

                        <button type="submit" className="signup-button" disabled={saving}>
                            {saving ? 'Saving…' : 'Save changes'}
                        </button>

                    </form>
                )}

                <div className="profile-danger-zone">
                    {!confirmingDelete ? (
                        <button
                            type="button"
                            className="profile-delete-link"
                            onClick={() => setConfirmingDelete(true)}
                        >
                            Delete account
                        </button>
                    ) : (
                        <div className="profile-delete-confirm">
                            <p>This permanently deletes your account and saved data. This can&rsquo;t be undone.</p>
                            <div className="profile-delete-confirm-actions">
                                <button
                                    type="button"
                                    className="profile-delete-cancel"
                                    onClick={() => setConfirmingDelete(false)}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="profile-delete-confirm-button"
                                    onClick={handleDeleteAccount}
                                    disabled={deleting}
                                >
                                    {deleting ? 'Deleting…' : 'Yes, delete my account'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
