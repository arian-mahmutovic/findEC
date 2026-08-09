import { formatDate } from "../../utils/dates";

export default function StudentDetailPanel({ student, onClose }) {
    return (
        <div className="student-panel-overlay" onClick={onClose}>

            <aside className="student-panel" onClick={(e) => e.stopPropagation()}>

                <button type="button" className="student-panel-close" onClick={onClose} aria-label="Close">
                    &#10005;
                </button>

                <div className="student-panel-header">
                    <h2>{student.name}</h2>
                    <p>{student.grade} &middot; {student.school}</p>
                    <a href={`mailto:${student.email}`} className="student-panel-email">{student.email}</a>
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

            </aside>

        </div>
    );
}
