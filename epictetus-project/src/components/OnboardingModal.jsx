import { useEffect, useState } from 'react';
import SchoolCombobox from './SchoolCombobox';
import { saveUserPreferences } from '../services/preferences';
import { getCounselorsForSchool, getCounselorById } from '../services/counselors';
import { INTEREST_TAGS } from '../data/interests';
import './OnboardingModal.css';

const COUNSELOR_EMAIL = 'counselors@epictetusproject.com';

function buildInviteEmail(school) {
    const subject = `Set up an Epictetus Project counselor account for ${school}`;
    const body = `Hi,\n\nI'm a student at ${school} using Epictetus Project (epictetusproject.com) to track competitions and scholarship deadlines. I noticed our school doesn't have a counselor account set up yet.\n\nWould you be able to email ${COUNSELOR_EMAIL} to get one set up? It only takes a minute, and it'll let you see which competitions your students are tracking.\n\nThanks!`;
    return { subject, body };
}

export default function OnboardingModal({ userId, onComplete }) {
    const [school, setSchool] = useState('');
    const [isKnownSchool, setIsKnownSchool] = useState(false);
    const [grade, setGrade] = useState('');
    const [interests, setInterests] = useState([]);
    const [counselorId, setCounselorId] = useState('');
    const [counselorOptions, setCounselorOptions] = useState([]);
    const [loadingCounselors, setLoadingCounselors] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [emailCopied, setEmailCopied] = useState(false);

    useEffect(() => {
        const pendingId = localStorage.getItem('epictetus_pending_counselor_id');
        if (!pendingId) return;

        getCounselorById(pendingId).then((result) => {
            if (result.data) {
                setSchool(result.data.school);
                setIsKnownSchool(true);
                setCounselorId(result.data.id);
            }
            localStorage.removeItem('epictetus_pending_counselor_id');
        });
    }, []);

    useEffect(() => {
        if (!isKnownSchool) {
            setCounselorOptions([]);
            setCounselorId('');
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

    async function submit(overrides = {}) {
        setError('');

        const skippingSchool = overrides.school !== undefined;

        if (!skippingSchool && counselorOptions.length > 0 && !counselorId) {
            setError('Select your counselor to continue.');
            return;
        }

        setSaving(true);

        const result = await saveUserPreferences(userId, {
            school,
            grade: grade ? Number(grade) : null,
            interests,
            counselorId: counselorId || null,
            ...overrides
        });

        setSaving(false);

        if (result.error) {
            setError(result.error.message);
            return;
        }

        onComplete();
    }

    function handleSubmit(e) {
        e.preventDefault();
        submit();
    }

    function handleSkip() {
        submit({ school: '', grade: null, interests: [], counselorId: null });
    }

    return (
        <div className="onboarding-overlay">

            <div className="onboarding-card">

                <span className="onboarding-eyebrow">One quick thing</span>
                <h2>Tell us a bit about you.</h2>
                <p>
                    This helps us recommend competitions worth your time.
                    Everything here is optional.
                </p>

                <form onSubmit={handleSubmit}>

                    <label className="onboarding-label" htmlFor="onboarding-school">
                        High school
                    </label>
                    <SchoolCombobox
                        id="onboarding-school"
                        value={school}
                        onChange={handleSchoolChange}
                        onPick={handleSchoolPick}
                        placeholder="Search for your school…"
                    />

                    {counselorOptions.length > 0 && (
                        <>
                            <label className="onboarding-label" htmlFor="onboarding-counselor">
                                Your counselor
                            </label>
                            <select
                                id="onboarding-counselor"
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

                    <label className="onboarding-label" htmlFor="onboarding-grade">
                        Grade <span>(optional)</span>
                    </label>
                    <select
                        id="onboarding-grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    >
                        <option value="">Prefer not to say</option>
                        <option value="9">9th grade</option>
                        <option value="10">10th grade</option>
                        <option value="11">11th grade</option>
                        <option value="12">12th grade</option>
                    </select>

                    <label className="onboarding-label">
                        What are you interested in?
                    </label>
                    <div className="onboarding-tags">
                        {INTEREST_TAGS.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                className={`onboarding-tag ${interests.includes(tag) ? 'is-active' : ''}`}
                                onClick={() => toggleInterest(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {error && <p className="onboarding-error">{error}</p>}

                    <div className="onboarding-actions">
                        <button type="button" className="onboarding-skip" onClick={handleSkip} disabled={saving}>
                            Skip for now
                        </button>

                        <button type="submit" className="onboarding-save" disabled={saving}>
                            {saving ? 'Saving…' : 'Save & Continue'}
                        </button>
                    </div>

                </form>

            </div>

        </div>
    );
}
