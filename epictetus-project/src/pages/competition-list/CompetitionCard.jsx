export default function CompetitionCard({
    name,
    category,
    deadline,
    registration,
    difficulty,
    description,
    url
}) {

    return (
        <div className="competition-card">

            <span className="badge">
                {category}
            </span>

            <h2>
                {name}
            </h2>

            <p>
                {description}
            </p>

            <div className="competition-info">

                <p>
                    <strong>Registration:</strong> {registration.isOpen}
                </p>
                <p>
                    {registration.time}
                </p>
                <p>
                    <strong>Deadline:</strong> {deadline}
                </p>

                <p>
                    <strong>Difficulty:</strong> {difficulty}
                </p>

            </div>

            <div class="competition-buttons-container">
                <a href="/competition">
                    <button>
                        View Competition
                    </button>
                </a>
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <button>
                        Go to Site
                    </button>
                </a>
            </div>
            

        </div>
    );
}