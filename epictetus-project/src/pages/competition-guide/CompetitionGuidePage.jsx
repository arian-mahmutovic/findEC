import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../../supabase";
import './CompetitionGuidePage.css';
export default function CompetitionGuidePage() {

    const { slug } = useParams();

    const [competition, setCompetition] = useState(null);
    const [guide, setGuide] = useState(null);
    const [articles, setArticles] = useState([]);
    const [videos, setVideos] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        loadCompetition();
    }, [slug]);


    async function loadCompetition() {

        setLoading(true);


        const { data: competitionData, error: competitionError } =
            await supabase
                .from("competitions")
                .select("*")
                .eq("slug", slug)
                .single();


        if (competitionError) {
            console.error(competitionError);
            setLoading(false);
            return;
        }


        setCompetition(competitionData);



        const { data: guideData, error: guideError } =
            await supabase
                .from("competition_guides")
                .select("*")
                .eq("competition_id", competitionData.id)
                .maybeSingle();


        if (guideError) {
            console.error(guideError);
        }


        setGuide(guideData);



        const { data: articleData, error: articleError } =
            await supabase
                .from("guide_articles")
                .select("*")
                .eq("competition_id", competitionData.id)
                .order("order_index");


        if (articleError) {
            console.error(articleError);
        }


        setArticles(articleData || []);




        const { data: videoData, error: videoError } =
            await supabase
                .from("guide_videos")
                .select("*")
                .eq("competition_id", competitionData.id)
                .order("order_index");


        if (videoError) {
            console.error(videoError);
        }


        setVideos(videoData || []);


        setLoading(false);

    }




    if (loading) {
        return (
            <div className="loading-page">
                Loading...
            </div>
        );
    }



    if (!competition) {
        return (
            <div className="error-page">
                Competition not found.
            </div>
        );
    }




    return (

        <div className="competition-guide-page">



            {/* HERO SECTION */}

            <section className="competition-banner">


                <div className="competition-banner-image-container">

                    <img
                        src={competition.banner_image_url}
                        alt={`${competition.name} banner`}
                        className="competition-banner-image"
                    />

                </div>



                <div className="competition-banner-content">

                    <h1 className="competition-title">
                        {competition.name}
                    </h1>


                    <p className="competition-description">
                        {competition.description}
                    </p>



                    <div className="competition-tags">

                        {competition.tags?.map(tag => (

                            <span
                                key={tag}
                                className="competition-tag"
                            >
                                {tag}
                            </span>

                        ))}

                    </div>



                    <div className="competition-actions">

                        <button className="bookmark-button">
                            Bookmark
                        </button>


                        <button className="notification-button">
                            Notify Me
                        </button>

                    </div>


                </div>


            </section>






            <main className="competition-guide-content">



                {/* OVERVIEW */}

                {guide?.overview && (

                    <section className="guide-section overview-section">

                        <h2 className="section-title">
                            Overview
                        </h2>


                        <p className="section-text">
                            {guide.overview}
                        </p>


                    </section>

                )}







                {/* REGISTRATION */}

                <section className="guide-section registration-section">

                    <h2 className="section-title">
                        Registration
                    </h2>



                    <div className="registration-card">


                        <p>
                            Status:
                            <strong>
                                {competition.registration_status}
                            </strong>
                        </p>



                        <p>
                            Deadline:
                            <strong>
                                {competition.deadline}
                            </strong>
                        </p>



                        {guide?.registration_link && (

                            <a
                                href={guide.registration_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="primary-button"
                            >
                                Register
                            </a>

                        )}


                    </div>


                </section>








                {/* TIMELINE */}

                {guide?.timeline?.length > 0 && (

                    <section className="guide-section timeline-section">


                        <h2 className="section-title">
                            Timeline
                        </h2>



                        <div className="timeline-container">


                            {guide.timeline.map(item => (

                                <div
                                    key={item.title}
                                    className="timeline-card"
                                >

                                    <h3 className="card-title">
                                        {item.title}
                                    </h3>


                                    <p className="card-text">
                                        {item.date}
                                    </p>


                                </div>

                            ))}


                        </div>


                    </section>

                )}








                {/* TIPS */}

                {guide?.tips?.length > 0 && (

                    <section className="guide-section tips-section">


                        <h2 className="section-title">
                            Tips
                        </h2>



                        {guide.tips.map(tip => (

                            <div
                                key={tip.title}
                                className="info-card"
                            >

                                <h3 className="card-title">
                                    {tip.title}
                                </h3>


                                <p className="card-text">
                                    {tip.description}
                                </p>


                            </div>

                        ))}


                    </section>

                )}








                {/* COMMON MISTAKES */}

                {guide?.common_mistakes?.length > 0 && (

                    <section className="guide-section mistakes-section">


                        <h2 className="section-title">
                            Common Mistakes
                        </h2>



                        {guide.common_mistakes.map(mistake => (

                            <div
                                key={mistake.title}
                                className="info-card mistake-card"
                            >

                                <h3 className="card-title">
                                    {mistake.title}
                                </h3>


                                <p className="card-text">
                                    {mistake.description}
                                </p>


                            </div>

                        ))}


                    </section>

                )}








                {/* ARTICLES */}

                {articles.length > 0 && (

                    <section className="guide-section resources-section">


                        <h2 className="section-title">
                            Guides
                        </h2>



                        {articles.map(article => (

                            <div
                                key={article.id}
                                className="resource-card"
                            >

                                <h3>
                                    {article.title}
                                </h3>


                                <p>
                                    {article.summary}
                                </p>



                                <button>
                                    Read Guide
                                </button>


                            </div>

                        ))}


                    </section>

                )}









                {/* VIDEOS */}

                {videos.length > 0 && (

                    <section className="guide-section resources-section">


                        <h2 className="section-title">
                            Videos
                        </h2>



                        {videos.map(video => (

                            <div
                                key={video.id}
                                className="resource-card"
                            >


                                {video.thumbnail_url && (

                                    <img
                                        src={video.thumbnail_url}
                                        alt={video.title}
                                    />

                                )}



                                <h3>
                                    {video.title}
                                </h3>



                                <p>
                                    {video.description}
                                </p>



                                <a
                                    href={video.youtube_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Watch Video
                                </a>


                            </div>

                        ))}


                    </section>

                )}








                {/* FAQ */}

                {guide?.faq?.length > 0 && (

                    <section className="guide-section faq-section">


                        <h2 className="section-title">
                            FAQ
                        </h2>



                        {guide.faq.map(item => (

                            <div
                                key={item.question}
                                className="faq-card"
                            >

                                <h3>
                                    {item.question}
                                </h3>


                                <p>
                                    {item.answer}
                                </p>


                            </div>

                        ))}


                    </section>

                )}







                {/* OFFICIAL SITE */}

                {competition.website && (

                    <section className="official-site-section">

                        <a
                            href={competition.website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Visit Official Competition Website
                        </a>

                    </section>

                )}



            </main>


        </div>

    );

}