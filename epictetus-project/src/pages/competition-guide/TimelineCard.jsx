export default function TimelineCard({ week, activity}) {
    return (
        <div className="timeline-card">
            Week {week}
            <span>
                {activity}
            </span>
        </div>
    )
}