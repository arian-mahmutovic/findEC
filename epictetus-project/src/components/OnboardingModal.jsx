import { useState } from 'react';
import SchoolCombobox from './SchoolCombobox';
import { saveUserPreferences } from '../services/preferences';
import { INTEREST_TAGS } from '../data/interests';
import './OnboardingModal.css';

export default function OnboardingModal({ userId, onComplete }) {
    const [school, setSchool] = useState('');
    const [grade, setGrade] = useState('');
    const [interests, setInterests] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    function toggleInterest(tag) {
        setInterests((current) =>
            current.includes(tag)
                ? current.filter((t) => t !== tag)
                : [...current, tag]
        );
    }

    async function submit(overrides = {}) {
        setError('');
        setSaving(true);

        const result = await saveUserPreferences(userId, {
            school,
            grade: grade ? Number(grade) : null,
            interests,
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
        submit({ school: '', grade: null, interests: [] });
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
                        onChange={setSchool}
                        placeholder="Search for your school…"
                    />

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
