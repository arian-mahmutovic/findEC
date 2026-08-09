import { useState } from "react";
import { formatDate } from "../../utils/dates";

const RESULT_LABELS = {
    participated: "Participated",
    finalist: "Finalist",
    winner: "Winner",
    didnt_advance: "Didn't advance",
    didnt_participate: "Didn't participate",
    prefer_not_to_say: "Prefer not to say"
};

export default function StudentDetailPanel({ student, onClose, onUnlink, onArchive, onVerifyResult, onDismissResult }) {
    const [confirmingUnlink, setConfirmingUnlink] = useState(false);
    const [archiving, setArchiving] = useState(false);
    const [achievementsNote, setAchievementsNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [processingResultId, setProcessingResultId] = useState(null);

    async function handleUnlinkConfirm() {
        setSaving(true);
        await onUnlink(student.id);
        setSaving(false);
    }

    async function handleArchiveConfirm() {
        setSaving(true);
        await onArchive(student, achievementsNote);
        setSaving(false);
    }

    async function handleVerify(applicationId) {
        setProcessingResultId(applicationId);
        await onVerifyResult(applicationId);
        setProcessingResultId(null);
    }

    async function handleDismiss(applicationId) {
        setProcessingResultId(applicationId);
        await onDismissResult(applicationId);
        setProcessingResultId(null);
    }

    return (
        <div className="student-panel-overlay" onClick={onClose}>

            <aside className="student-panel" onClick={(e) => e.stopPropagation()}>

                <button type="button" className="student-panel-close" onClick={onClose} aria-label="Close">
                    &#10005;
                </button>

                <div className="student-panel-header">
                    <h2>{student.name}</h2>
                    <p>{student.gradeLabel} &middot; {student.school}</p>
                </div>

                <div className="student-panel-section">
                    <h3>Preferences</h3>

                    {student.interests.length === 0 ? (
                        <p className="student-panel-empty">No interests selected yet.</p>
                    ) : (
                        <div className="student-panel-tags">
                            {student.interests.map((interest) => (
                                <span key={interest}>{interest}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="student-panel-section">
                    <h3>Saved Competitions ({student.savedCompetitions.length})</h3>

                    {student.savedCompetitions.length === 0 ? (
                        <p className="student-panel-empty">This student hasn&rsquo;t saved any competitions yet.</p>
                    ) : (
                        <ul className="student-panel-list">
                            {student.savedCompetitions.map((competition) => (
                                <li key={competition.id}>
                                    <div>
                                        <strong>{competition.name}</strong>
                                        <span>{competition.category}</span>
                                    </div>
                                    <span className="student-panel-deadline">
                                        Due {formatDate(competition.deadline)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="student-panel-section">
                    <h3>Guides Viewed ({student.guidesDone.length})</h3>

                    {student.guidesDone.length === 0 ? (
                        <p className="student-panel-empty">This student hasn&rsquo;t opened a competition guide yet.</p>
                    ) : (
                        <ul className="student-panel-list">
                            {student.guidesDone.map((guide) => (
                                <li key={guide.competitionId}>
                                    <div>
                                        <strong>{guide.name}</strong>
                                        <span>{guide.category}</span>
                                    </div>
                                    <span className="student-panel-deadline">
                                        Viewed {formatDate(guide.lastViewedAt)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="student-panel-section">
                    <h3>Reported Results ({student.reportedResults.length})</h3>

                    {student.reportedResults.length === 0 ? (
                        <p className="student-panel-empty">No self-reported results yet.</p>
                    ) : (
                        <ul className="student-panel-list student-panel-results">
                            {student.reportedResults.map((result) => (
                                <li key={result.id} className="student-panel-result">
                                    <div className="student-panel-result-top">
                                        <div>
                                            <strong>{result.name}</strong>
                                            <span>{RESULT_LABELS[result.result] || result.result}</span>
                                        </div>
                                        <span className={`result-status-badge result-status-${result.resultStatus}`}>
                                            {result.resultStatus === "self_reported" && "Self-reported"}
                                            {result.resultStatus === "verified" && "Verified"}
                                            {result.resultStatus === "dismissed" && "Dismissed"}
                                        </span>
                                    </div>

                                    {result.resultStatus === "self_reported" && (
                                        <div className="student-panel-result-actions">
                                            <button
                                                type="button"
                                                onClick={() => handleVerify(result.id)}
                                                disabled={processingResultId === result.id}
                                            >
                                                Verify
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDismiss(result.id)}
                                                disabled={processingResultId === result.id}
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="student-panel-section student-panel-actions">

                    {!confirmingUnlink && !archiving && (
                        <div className="student-panel-action-row">
                            <button type="button" className="student-panel-action" onClick={() => setConfirmingUnlink(true)}>
                                Unlink student
                            </button>
                            <button type="button" className="student-panel-action" onClick={() => setArchiving(true)}>
                                Archive student
                            </button>
                        </div>
                    )}

                    {confirmingUnlink && (
                        <div className="student-panel-confirm">
                            <p>
                                Remove {student.name} from your roster? They can add you back as their
                                counselor later if needed.
                            </p>
                            <div className="student-panel-confirm-actions">
                                <button type="button" onClick={() => setConfirmingUnlink(false)} disabled={saving}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="student-panel-action-danger"
                                    onClick={handleUnlinkConfirm}
                                    disabled={saving}
                                >
                                    {saving ? "Unlinking…" : "Yes, unlink"}
                                </button>
                            </div>
                        </div>
                    )}

                    {archiving && (
                        <div className="student-panel-confirm">
                            <p>
                                Archiving saves a snapshot of {student.name}&rsquo;s interests, saved
                                competitions, and viewed guides, and removes them from your active roster.
                            </p>

                            <label htmlFor="archive-note">Achievements (optional)</label>
                            <textarea
                                id="archive-note"
                                value={achievementsNote}
                                onChange={(e) => setAchievementsNote(e.target.value)}
                                placeholder="e.g. Regional finalist, Conrad Challenge"
                                rows={3}
                            />

                            <div className="student-panel-confirm-actions">
                                <button type="button" onClick={() => setArchiving(false)} disabled={saving}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="student-panel-action-danger"
                                    onClick={handleArchiveConfirm}
                                    disabled={saving}
                                >
                                    {saving ? "Archiving…" : "Confirm archive"}
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            </aside>

        </div>
    );
}
