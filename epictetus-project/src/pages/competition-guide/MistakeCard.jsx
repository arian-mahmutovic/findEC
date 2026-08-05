export default function MistakeCard({ item }) {
    return (
        <div
            className="mistake-card"
            key={item}
        >

            ⚠️ {item}

        </div>
    )
}