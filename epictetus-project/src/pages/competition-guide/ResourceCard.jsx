export default function ResourceCard({ resource }) {
    return (
        <div
            className="resource-card"
        >

            <div className="resource-icon">

                {resource.icon}

            </div>

            <h3>
                {resource.title}
            </h3>

            <p>
                {resource.type}
            </p>

            <button>
                Open
            </button>

        </div>
    )
}