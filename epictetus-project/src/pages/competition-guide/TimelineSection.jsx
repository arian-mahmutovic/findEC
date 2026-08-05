import TimelineCard from './TimelineCard'

export default function TimelineSection() {
    return (
        <section className="timeline-section">

            <h2>
                Preparation Timeline
            </h2>

            <div className="timeline">

                <TimelineCard week="1–2" activity="Build Team" />
                <TimelineCard week="3–4" activity="Research" />
                <TimelineCard week="5–7" activity="Portfolio" />
                <TimelineCard week="8" activity="Presentation" />

            </div>

        </section>
    );
};