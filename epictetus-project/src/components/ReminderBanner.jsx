import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
    getStudentReminders,
    confirmApplication,
    submitApplicationResult,
    requestResultReview,
    snoozeApplicationReminder
} from "../services/applications";
import { trackEvent } from "../services/analytics";
import { formatDate } from "../utils/dates";
import "./ReminderBanner.css";

const RESULT_OPTIONS = [
    { value: "participated", label: "Participated" },
    { value: "finalist", label: "Finalist" },
    { value: "winner", label: "Winner" },
    { value: "didnt_advance", label: "Didn't advance" },
    { value: "didnt_participate", label: "Didn't participate" },
    { value: "prefer_not_to_say", label: "Prefer not to say" }
];

export default function ReminderBanner({ userId }) {
    const [reminder, setReminder] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (userId) load();
    }, [userId]);

    async function load() {
        const result = await getStudentReminders(userId);
        setReminder(result);
        setExpanded(false);
    }

    async function handleYesApplied() {
        setSaving(true);
        await confirmApplication(reminder.competition.id);
        trackEvent("application_confirmed", { userId, competitionId: reminder.competition.id });
        setSaving(false);
        load();
    }

    async function handleNotYet() {
        setExpanded(true);
        snoozeApplicationReminder(userId, reminder.competition.id);
    }

    function handleReminderRegisterClick() {
        trackEvent("application_reminder_clicked", { userId, competitionId: reminder.competition.id });
    }

    async function handleSubmitResult(value) {
        setSaving(true);
        await submitApplicationResult(reminder.competition.id, value);
        trackEvent("result_submitted", { userId, competitionId: reminder.competition.id, metadata: { result: value } });
        setSaving(false);
        load();
    }

    async function handleRequestReview() {
        setSaving(true);
        await requestResultReview(reminder.competition.id);
        setSaving(false);
        load();
    }

    if (!reminder) return null;

    const { competition } = reminder;

    if (reminder.type === "application_prompt") {
        return (
            <section className="reminder-banner">
                <p className="reminder-banner-text">
                    Did you apply to <strong>{competition.name}</strong>?
                </p>

                {!expanded ? (
                    <div className="reminder-banner-actions">
                        <button type="button" className="reminder-banner-primary" onClick={handleYesApplied} disabled={saving}>
                            Yes, I applied
                        </button>
                        <button type="button" className="reminder-banner-secondary" onClick={handleNotYet} disabled={saving}>
                            Not yet
                        </button>
                    </div>
                ) : (
                    <div className="reminder-banner-expanded">
                        <p>
                            Deadline: <strong>{formatDate(competition.registration_end_date)}</strong>
                            {" "}({Math.max(dayjs(competition.registration_end_date).diff(dayjs(), "day"), 0)} days left)
                        </p>
                        <a
                            href={`/competitions/${competition.slug}`}
                            className="reminder-banner-link"
                            onClick={handleReminderRegisterClick}
                        >
                            View competition &rsaquo;
                        </a>
                    </div>
                )}
            </section>
        );
    }

    if (reminder.type === "result_prompt") {
        return (
            <section className="reminder-banner">
                <p className="reminder-banner-text">
                    How did you do in <strong>{competition.name}</strong>?
                </p>
                <div className="reminder-banner-results">
                    {RESULT_OPTIONS.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className="reminder-banner-secondary"
                            onClick={() => handleSubmitResult(option.value)}
                            disabled={saving}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </section>
        );
    }

    if (reminder.type === "result_dismissed") {
        return (
            <section className="reminder-banner">
                <p className="reminder-banner-text">
                    We couldn&rsquo;t verify your result for <strong>{competition.name}</strong>.
                </p>
                <p className="reminder-banner-subtext">
                    Your counselor wasn&rsquo;t able to confirm this from their side. If you have more
                    detail to share, you can ask for another look.
                </p>
                <div className="reminder-banner-actions">
                    <button type="button" className="reminder-banner-primary" onClick={handleRequestReview} disabled={saving}>
                        Request another review
                    </button>
                </div>
            </section>
        );
    }

    return null;
}
