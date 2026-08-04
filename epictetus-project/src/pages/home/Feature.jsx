export default function Feature({ title, desc }) {
    return (
        <div className="feature-card">

            <h3>{title}</h3>

            <p>
                {desc}
            </p>

        </div>
    );
}