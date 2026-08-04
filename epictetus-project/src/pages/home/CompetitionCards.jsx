export default function CompetitionCard({ title, category, difficulty }) {
    return (
        <div className="competition-card">

            <span className="badge">
                {category}
            </span>

            <h3>{title}</h3>

            <p>
                Difficulty: {difficulty}
            </p>

            <button>
                Learn More
            </button>

        </div>
    );
}