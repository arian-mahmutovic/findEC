export default function LessonCard({ lesson }) {
    return (
        <div
            className="roadmap-card"
            key={lesson}
        >

            <div className="roadmap-number">

                {lesson.complete ? "✓" : lesson.step}

            </div>

            <h3>
                {lesson.title}
            </h3>

            <p>
                {lesson.length}
            </p>

            <button>
                Open Lesson
            </button>

        </div>
    );
};