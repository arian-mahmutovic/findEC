import CompetitionCard from "./CompetitionCard";
import './CompetitionListPage.css';

export default function CompetitionListPage() {


    const competitions = [

        {
            name: "Wharton Global High School Investment Competition",
            category: "Finance",
            registration: {
                isOpen: 'Open Soon',
                time: 'Aug 10th - Sep 11th',
            },
            deadline: "September",
            difficulty: "★★★★★",
            url: "https://globalyouth.wharton.upenn.edu/investment-competition/",
            description:
                "A global investment competition where student teams build and present an investment strategy for a hypothetical client."
        },

        {
            name: "Blue Ocean Entrepreneurship Competition",
            category: "Entrepreneurship",
            registration: {
                isOpen: 'Open Now',
                time: 'Always',
            },
            deadline: "January",
            difficulty: "★★★★☆",
            url: "https://blueoceancompetition.org/",
            description:
                "Students create innovative business ideas and pitch strategies using Blue Ocean Strategy principles."
        },

        {
            name: "Harvard Crimson Global Essay Competition",
            category: "Writing",
            registration: {
                isOpen: 'Open Soon',
                time: 'Oct 1st - Feb 10th',
            },
            deadline: "April",
            difficulty: "★★★★☆",
            url: "https://www.essaycomp.org/",
            description:
                "An international essay competition challenging students to write persuasive pieces on important issues."
        },

        {
            name: "Regeneron Science Talent Search",
            category: "Research",
            registration: {
                isOpen: 'Open Now',
                time: 'Jun 1st - Nov 5th',
            },
            deadline: "November",
            difficulty: "★★★★★",
            url: "https://www.societyforscience.org/regeneron-sts/",
            description:
                "One of the most prestigious science research competitions for high school students in the United States."
        },

        {
            name: "MIT THINK Scholars Program",
            category: "STEM",
            registration: {
                isOpen: 'Open Now',
                time: 'Nov 1st - Jan 1st',
            },
            deadline: "January",
            difficulty: "★★★★★",
            url: "https://think.mit.edu/",
            description:
                "A competition where students submit innovative STEM project proposals and receive support to develop them."
        }

    ];


    return (

        <main className="competition-page">


            <section className="competition-header">

                <h1>
                    Explore Competitions
                </h1>

                <p>
                    Find academic competitions, scholarships,
                    and opportunities built for ambitious students.
                </p>

            </section>


            <section className="competition-grid">

                {competitions.map((competition) => (

                    <CompetitionCard
                        key={competition.name}
                        {...competition}
                    />

                ))}

            </section>


        </main>

    );
}