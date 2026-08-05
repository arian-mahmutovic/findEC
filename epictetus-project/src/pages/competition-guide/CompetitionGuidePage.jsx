import "./CompetitionGuidePage.css";
import GuideHero from './GuideHero';
import GuideStats from './GuideStats';
import LessonRoadMap from './LessonRoadMap';
import MistakesSection from "./MistakesSection";
import TimelineSection from "./TimelineSection";
import VideoSection from './VideoSection';
import ResourcesSection from './ResourceSection';
import GuideCTA from './GuideCTA';

export default function CompetitionGuidePage() {

    const roadmap = [
        {
            step: 1,
            title: "Build Your Winning Team",
            length: "10 min",
            complete: false
        },
        {
            step: 2,
            title: "Understand the Client",
            length: "20 min",
            complete: false
        },
        {
            step: 3,
            title: "Research Investments",
            length: "35 min",
            complete: false
        },
        {
            step: 4,
            title: "Build Your Portfolio",
            length: "45 min",
            complete: false
        },
        {
            step: 5,
            title: "Prepare Your Presentation",
            length: "25 min",
            complete: false
        }
    ];

    const videos = [
        "Competition Overview",
        "Building the Perfect Team",
        "Researching Companies",
        "Constructing Your Portfolio",
        "Presentation Tips"
    ];

    const mistakes = [
        "Treating it like a stock-picking contest instead of solving the client's problem.",
        "Using unnecessary financial jargon.",
        "Ignoring diversification.",
        "Starting the report too late.",
        "Practicing the presentation only once."
    ];

    const resources = [
        {
            icon: "📘",
            title: "Official Rulebook",
            type: "PDF"
        },
        {
            icon: "📈",
            title: "Portfolio Spreadsheet",
            type: "Template"
        },
        {
            icon: "🎥",
            title: "Winning Presentation",
            type: "Video"
        },
        {
            icon: "🧠",
            title: "Behavioral Finance Notes",
            type: "Guide"
        },
        {
            icon: "📊",
            title: "Investment Research Checklist",
            type: "Checklist"
        },
        {
            icon: "🌐",
            title: "Official Competition Website",
            type: "Website"
        }
    ];


    return (

        <main className="guide-page">

            <GuideHero />

            <GuideStats />

            <section className="start-section">

                <h2>
                    Start Here
                </h2>

                <p>
                    Follow these lessons in order. Each one builds
                    on the previous step.
                </p>

                <LessonRoadMap roadmap={roadmap} />
            </section>

            <VideoSection videos={videos} />

            <TimelineSection />

            <MistakesSection mistakes={mistakes} />

            <ResourcesSection resources={resources} />

            <GuideCTA />

        </main>

    );

}