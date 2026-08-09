import { useState } from "react";

export default function CounselorAccountModal({ counselor, onClose }) {
    const [copied, setCopied] = useState(false);

    function copyKey() {
        navigator.clipboard.writeText(counselor.access_key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="student-panel-overlay" onClick={onClose}>

            <aside className="student-panel" onClick={(e) => e.stopPropagation()}>

                <button type="button" className="student-panel-close" onClick={onClose} aria-label="Close">
                    &#10005;
                </button>

                <div className="student-panel-header">
                    <h2>My Account</h2>
                    <p>{counselor.school}</p>
                </div>

                <div className="student-panel-section">
                    <h3>Name</h3>
                    <p className="account-modal-value">{counselor.name}</p>
                </div>

                <div className="student-panel-section">
                    <h3>School</h3>
                    <p className="account-modal-value">{counselor.school}</p>
                </div>

                <div className="student-panel-section">
                    <h3>Access Key</h3>
                    <div className="account-modal-key-row">
                        <code className="account-modal-key">{counselor.access_key}</code>
                        <button type="button" onClick={copyKey}>
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <p className="student-panel-empty">
                        This is your sign-in password. Keep it private — anyone with this key can view your students.
                    </p>
                </div>

            </aside>

        </div>
    );
}
