import "./HomePage.css";

export default function HomePage() {

    const continueLearning = [
        {
            title: "Wharton Investment Competition",
            lesson: "Lesson 4 • Building Your Portfolio",
            progress: 65
        },
        {
            title: "Blue Ocean Competition",
            lesson: "Lesson 2 • Customer Discovery",
            progress: 25
        }
    ];

    const recommendations = [
        {
            name: "MIT THINK Scholars",
            category: "STEM"
        },
        {
            name: "Regeneron STS",
            category: "Research"
        },
        {
            name: "Harvard Crimson Essay",
            category: "Writing"
        }
    ];

    const saved = [
        "Conrad Challenge",
        "FBLA National Awards",
        "ISEF",
        "Economics Challenge"
    ];

    const deadlines = [
        {
            event: "Wharton Registration",
            remaining: "12 days"
        },
        {
            event: "Blue Ocean Submission",
            remaining: "36 days"
        },
        {
            event: "MIT THINK",
            remaining: "82 days"
        }
    ];

    const resources = [
        "Investment Checklist",
        "Presentation Template",
        "Research Database",
        "College Portfolio Guide"
    ];

    return (

        <main className="dashboard-page">

            {/* ===========================
                NAVBAR
            =========================== */}

            <nav className="dashboard-nav">

                <h1>
                    Project Epictetus
                </h1>

                <div className="dashboard-nav-links">

                    <a href="#">Dashboard</a>
                    <a href="#">Competitions</a>
                    <a href="#">Learn</a>
                    <a href="#">Roadmaps</a>

                </div>

                <div className="dashboard-user">

                    🔔

                    <div className="profile-circle">
                        AM
                    </div>

                </div>

            </nav>


            {/* ===========================
                HERO
            =========================== */}

            <section className="dashboard-hero">

                <h1>
                    Good Afternoon.
                </h1>

                <p>
                    Continue building your portfolio.
                </p>

                <div className="dashboard-search">

                    <input
                        placeholder="Search competitions, scholarships, guides..."
                    />

                    <button>
                        Search
                    </button>

                </div>

            </section>


            {/* ===========================
                DASHBOARD STATS
            =========================== */}

            <section className="dashboard-stats">

                <div className="dashboard-stat-card">

                    <h3>
                        Saved
                    </h3>

                    <p>
                        18
                    </p>

                </div>

                <div className="dashboard-stat-card">

                    <h3>
                        Guides Finished
                    </h3>

                    <p>
                        12
                    </p>

                </div>

                <div className="dashboard-stat-card">

                    <h3>
                        Applications
                    </h3>

                    <p>
                        5
                    </p>

                </div>

                <div className="dashboard-stat-card">

                    <h3>
                        Hours Learned
                    </h3>

                    <p>
                        87
                    </p>

                </div>

            </section>


            {/* ===========================
                MAIN GRID
            =========================== */}

            <section className="dashboard-grid">

                {/* LEFT */}

                <div className="dashboard-main">

                    {/* Continue */}

                    <div className="dashboard-section">

                        <h2>
                            Continue Learning
                        </h2>

                        {continueLearning.map(course => (

                            <div
                                className="continue-card"
                                key={course.title}
                            >

                                <div>

                                    <h3>
                                        {course.title}
                                    </h3>

                                    <p>
                                        {course.lesson}
                                    </p>

                                </div>

                                <div className="progress-wrapper">

                                    <div className="progress-bar">

                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${course.progress}%`
                                            }}
                                        />

                                    </div>

                                    <span>

                                        {course.progress}%

                                    </span>

                                </div>

                                <button>

                                    Resume

                                </button>

                            </div>

                        ))}

                    </div>


                    {/* Recommended */}

                    <div className="dashboard-section">

                        <h2>
                            Recommended For You
                        </h2>

                        <div className="recommendation-grid">

                            {recommendations.map(item => (

                                <div
                                    className="recommendation-card"
                                    key={item.name}
                                >

                                    <span>
                                        {item.category}
                                    </span>

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <button>

                                        View Competition

                                    </button>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>


                {/* SIDEBAR */}

                <aside className="dashboard-sidebar">

                    <div className="dashboard-widget">

                        <h3>
                            Upcoming Deadlines
                        </h3>

                        {deadlines.map(deadline => (

                            <div
                                className="deadline-item"
                                key={deadline.event}
                            >

                                <div>

                                    <strong>

                                        {deadline.event}

                                    </strong>

                                    <p>

                                        {deadline.remaining}

                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>


                    <div className="dashboard-widget">

                        <h3>
                            Saved Competitions
                        </h3>

                        {saved.map(item => (

                            <div
                                className="saved-item"
                                key={item}
                            >

                                ★ {item}

                            </div>

                        ))}

                    </div>


                    <div className="dashboard-widget">

                        <h3>
                            Quick Resources
                        </h3>

                        {resources.map(resource => (

                            <button
                                className="resource-button"
                                key={resource}
                            >

                                {resource}

                            </button>

                        ))}

                    </div>

                </aside>

            </section>

        </main>

    );

}