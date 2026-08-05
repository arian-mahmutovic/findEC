import MistakeCard from "./MistakeCard";

export default function MistakesSection({ mistakes }) {
    return (
        <section className="mistakes-section">

            <h2>
                Common Mistakes
            </h2>

            <div className="mistake-grid">

                {mistakes.map(item => (

                    <MistakeCard
                        item={item}
                        key={item}
                    />
                ))}

            </div>

        </section>
    )
}