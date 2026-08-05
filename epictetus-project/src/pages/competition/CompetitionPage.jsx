import { Link } from "react-router";
import "./CompetitionPage.css";
// import CompetitionList from "../../components/CompetitionList";


export default function CompetitionPage() {


    const competition = {

        name: "Wharton Global High School Investment Competition",

        category: "Finance",

        deadline: "September 27, 2026",

        difficulty: "★★★★★",

        prestige: "IV League",

        description:
            "A global investment competition where high school students work in teams to create and present an investment strategy for a hypothetical client.",

        eligibility:
            "Open to high school students worldwide. Teams typically consist of 4-7 students with an adult advisor.",

        timeline: [
            "Register team",
            "Analyze client profile",
            "Build investment strategy",
            "Submit final report",
            "Present to judges"
        ],

        skills: [
            "Investing",
            "Financial Analysis",
            "Portfolio Construction",
            "Presentation"
        ],

        officialUrl:
            "https://globalyouth.wharton.upenn.edu/investment-competition/"

    };


    return (

        <main className="competition-page">


            {/* Header */}

            <section className="competition-hero">


                <span className="badge">
                    {competition.category}
                </span>


                <h1>
                    {competition.name}
                </h1>


                <p>
                    {competition.description}
                </p>


                <div className="competition-actions">

                    <a
                        href={competition.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <button className="primary-button">
                            Official Website
                        </button>

                    </a>


                    <button className="secondary-button">
                        Save Competition
                    </button>


                </div>


            </section>



            {/* Stats */}

            <section className="competition-stats">


                <div>
                    <h3>
                        Deadline
                    </h3>

                    <p>
                        {competition.deadline}
                    </p>
                </div>


                <div>
                    <h3>
                        Difficulty
                    </h3>

                    <p>
                        {competition.difficulty}
                    </p>
                </div>


                <div>
                    <h3>
                        Prestige
                    </h3>

                    <p>
                        {competition.prestige}
                    </p>
                </div>


            </section>



            {/* Details */}

            <section className="competition-content">


                <div className="content-card">

                    <h2>
                        Eligibility
                    </h2>

                    <p>
                        {competition.eligibility}
                    </p>

                </div>



                <div className="content-card">

                    <h2>
                        Competition Timeline
                    </h2>


                    <ol>

                        {competition.timeline.map((step, index) => (

                            <li key={index}>
                                {step}
                            </li>

                        ))}

                    </ol>


                </div>




                <div className="content-card">

                    <h2>
                        Skills Developed
                    </h2>


                    <div className="skill-list">

                        {competition.skills.map(skill => (

                            <span key={skill}>
                                {skill}
                            </span>

                        ))}

                    </div>


                </div>


            </section>



            {/* Preparation */}

            <section className="preparation">


                <h2>
                    How to Prepare
                </h2>


                <p>
                    Learn the fundamentals, study previous finalists,
                    practice your presentation, and build a strong team
                    before the deadline.
                </p>


                <Link to="/guides">
                    View Preparation Guides →
                </Link>

            </section>


        </main>

    );

}