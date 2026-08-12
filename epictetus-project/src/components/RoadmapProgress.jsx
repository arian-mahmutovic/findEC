import { useState } from "react";

export default function RoadmapProgress({ completed, total, onClear }) {
    const [confirming, setConfirming] = useState(false);
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isComplete = total > 0 && completed === total;

    function handleConfirm() {
        onClear();
        setConfirming(false);
    }

    return (
        <div className="roadmap-progress">
            <div className="roadmap-progress-top">
                <span className="roadmap-progress-count">{completed} of {total} completed</span>
                <span className="roadmap-progress-pct">{pct}%</span>
            </div>

            <div
                className="roadmap-progress-track"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${completed} of ${total} roadmap tasks completed`}
            >
                <div className="roadmap-progress-fill" style={{ width: `${pct}%` }} />
            </div>

            {isComplete && (
                <div className="roadmap-complete-banner" role="status">
                    <span aria-hidden="true">✓</span> Competition Roadmap Complete
                </div>
            )}

            {completed > 0 && onClear && (
                confirming ? (
                    <div className="roadmap-clear-confirm">
                        <p>Clear all progress on this roadmap? This can&rsquo;t be undone.</p>
                        <div className="roadmap-clear-confirm-actions">
                            <button type="button" className="roadmap-clear-cancel" onClick={() => setConfirming(false)}>
                                Cancel
                            </button>
                            <button type="button" className="roadmap-clear-confirm-button" onClick={handleConfirm}>
                                Clear progress
                            </button>
                        </div>
                    </div>
                ) : (
                    <button type="button" className="roadmap-clear-link" onClick={() => setConfirming(true)}>
                        Clear progress
                    </button>
                )
            )}
        </div>
    );
}
