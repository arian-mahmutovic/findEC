export default function Feature({ title, desc }) {
    return (
        <div className="feature-card">
            <span className="feature-icon" aria-hidden="true" />
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    );
}
