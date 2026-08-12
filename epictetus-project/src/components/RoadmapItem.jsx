import { Link } from "react-router";

function ResourceLink({ link }) {
    if (link.type === "guide") {
        return (
            <Link to={`/articles/${link.slug}`} className="resource-link roadmap-item-link">
                {link.label} <span aria-hidden="true">↗</span>
            </Link>
        );
    }

    return (
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="resource-link roadmap-item-link">
            {link.label} <span aria-hidden="true">↗</span>
        </a>
    );
}

export default function RoadmapItem({ task, completed, onToggle, disabled = false }) {
    const inputId = `roadmap-task-${task.id}`;
    const hasBody = Boolean(task.description) || task.resource_links?.length > 0;

    return (
        <li className={`roadmap-item ${completed ? "is-complete" : ""} ${disabled ? "is-disabled" : ""}`}>
            <label className="roadmap-item-control" htmlFor={inputId}>
                <input
                    type="checkbox"
                    id={inputId}
                    className="roadmap-checkbox"
                    checked={completed}
                    disabled={disabled}
                    onChange={() => onToggle(task.id, !completed)}
                />
                <span className="roadmap-checkbox-box" aria-hidden="true">
                    <svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7" /></svg>
                </span>
                <span className="roadmap-item-title">{task.title}</span>
            </label>

            {hasBody && (
                <div className="roadmap-item-body">
                    {task.description && <p className="roadmap-item-desc">{task.description}</p>}

                    {task.resource_links?.length > 0 && (
                        <div className="roadmap-item-links">
                            {task.resource_links.map((link, index) => (
                                <ResourceLink key={index} link={link} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </li>
    );
}
