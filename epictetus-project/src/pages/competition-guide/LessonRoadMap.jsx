import LessonCard from './LessonCard'

export default function LessonRoadMap({ roadmap }) {
    return (
        <div className="roadmap-grid">

            {roadmap.map(item => (

                <LessonCard lesson={item} key={item.step} />

            ))}

        </div>

    );
};