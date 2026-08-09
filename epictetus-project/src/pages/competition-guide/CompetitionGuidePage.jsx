import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dates";
import { useAuth } from "../../context/AuthContext";
import { trackGuideView } from "../../services/guideViews";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import BackToTop from "../../components/BackToTop";
import SaveStarButton from "../../components/SaveStarButton";
import './CompetitionGuidePage.css';

export default function CompetitionGuidePage() {
    const { slug } = useParams();
    const { user } = useAuth();

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

        if (user) {
            trackGuideView(user.id, competitionData.id);
        }

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
            <>
            <SiteHeader />
            <div className="loading-page" aria-live="polite" aria-label="Loading competition guide">
                <div className="loading-orb" />
                <div className="loading-shell">
                    <div className="skeleton skeleton-kicker" />
                    <div className="skeleton skeleton-title" />
                    <div className="skeleton skeleton-copy" />
                    <div className="skeleton-grid">
                        <div className="skeleton skeleton-panel" />
                        <div className="skeleton skeleton-panel" />
                    </div>
                </div>
            </div>
            </>
        );
    }

    if (!competition) {
        return (
            <>
            <SiteHeader />
            <div className="error-page">
                <span className="eyebrow">Guide unavailable</span>
                <h1>Competition not found.</h1>
                <p>The competition you requested may have moved or is no longer available.</p>
            </div>
            </>
        );
    }

    return (
        <>
        <SiteHeader />
        <div className="competition-guide-page">
            <section className="competition-banner">
                <div className="hero-grid" />
                <div className="hero-glow hero-glow-cyan" />
                <div className="hero-glow hero-glow-violet" />

                <div className="competition-banner-image-container">
                    <img
                        src={competition.banner_image_url}
                        alt={`${competition.name} banner`}
                        className="competition-banner-image"
                    />
                </div>

                <div className="competition-banner-content">
                    <span className="eyebrow">Competition playbook</span>
                    <h1 className="competition-title">{competition.name}</h1>
                    <p className="competition-description">{competition.description}</p>

                    <div className="competition-tags">
                        {competition.tags?.map(tag => (
                            <span key={tag} className="competition-tag">{tag}</span>
                        ))}
                    </div>
                </div>

                <div className="hero-status" aria-label="Guide status">
                    <span className="status-pulse" />
                    Updated guide
                </div>
            </section>

            <main className="competition-guide-content">
                <div className="guide-main-column">
                    {guide?.overview && (
                        <section id="overview" className="guide-section overview-section">
                            <div className="section-heading">
                                <span className="section-index">01</span>
                                <div>
                                    <span className="section-kicker">The brief</span>
                                    <h2 className="section-title">Overview</h2>
                                </div>
                            </div>
                            <div className="overview-card">
                                <p className="section-text">{guide.overview}</p>
                            </div>
                        </section>
                    )}

                    {guide?.timeline?.length > 0 && (
                        <section id="timeline" className="guide-section timeline-section">
                            <div className="section-heading">
                                <span className="section-index">02</span>
                                <div>
                                    <span className="section-kicker">The runway</span>
                                    <h2 className="section-title">Timeline</h2>
                                </div>
                            </div>
                            <div className="timeline-container">
                                {guide.timeline.map((item, index) => (
                                    <div key={item.title} className="timeline-card">
                                        <div className="timeline-rail">
                                            <span className="timeline-node">{String(index + 1).padStart(2, '0')}</span>
                                        </div>
                                        <div className="timeline-card-content">
                                            <span className="timeline-date">{item.date}</span>
                                            <h3 className="card-title">{item.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(guide?.tips?.length > 0 || guide?.common_mistakes?.length > 0) && (
                        <section id="prepare" className="guide-section strategy-section">
                            <div className="section-heading">
                                <span className="section-index">03</span>
                                <div>
                                    <span className="section-kicker">Field notes</span>
                                    <h2 className="section-title">Prepare with intent</h2>
                                </div>
                            </div>
                            <div className="bento-grid">
                                {guide?.tips?.length > 0 && guide.tips.map((tip, index) => (
                                    <article key={tip.title} className={`info-card tip-card tip-card-${(index % 3) + 1}`}>
                                        <span className="bento-label">{index === 0 ? 'Pro tip' : 'Tactical edge'}</span>
                                        <h3 className="card-title">{tip.title}</h3>
                                        <p className="card-text">{tip.description}</p>
                                    </article>
                                ))}

                                {guide?.common_mistakes?.length > 0 && guide.common_mistakes.map(mistake => (
                                    <article key={mistake.title} className="info-card mistake-card">
                                        <span className="bento-label">Avoid this</span>
                                        <h3 className="card-title">{mistake.title}</h3>
                                        <p className="card-text">{mistake.description}</p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {articles.length > 0 && (
                        <section id="guides" className="guide-section resources-section">
                            <div className="section-heading">
                                <span className="section-index">04</span>
                                <div>
                                    <span className="section-kicker">Deep dives</span>
                                    <h2 className="section-title">Guides</h2>
                                </div>
                            </div>
                            <div className="resource-grid">
                                {articles.map((article, index) => (
                                    <article key={article.id} className="resource-card article-card">
                                        <span className="resource-number">{String(index + 1).padStart(2, '0')}</span>
                                        <h3>{article.title}</h3>
                                        <p>{article.summary}</p>
                                        <Link to={`/articles/${article.slug}`} className="resource-link">
                                            Read guide <span aria-hidden="true">↗</span>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {videos.length > 0 && (
                        <section id="videos" className="guide-section resources-section videos-section">
                            <div className="section-heading">
                                <span className="section-index">05</span>
                                <div>
                                    <span className="section-kicker">Watch and learn</span>
                                    <h2 className="section-title">Videos</h2>
                                </div>
                            </div>
                            <div className="video-grid">
                                {videos.map(video => (
                                    <article key={video.id} className="resource-card video-card">
                                        <div className="video-thumbnail">
                                            {video.thumbnail_url && (
                                                <img src={video.thumbnail_url} alt={video.title} />
                                            )}
                                            <span className="play-icon" aria-hidden="true">▶</span>
                                        </div>
                                        <div className="video-content">
                                            <h3>{video.title}</h3>
                                            <p>{video.description}</p>
                                            <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="resource-link">
                                                Watch video <span aria-hidden="true">↗</span>
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {guide?.faq?.length > 0 && (
                        <section id="faq" className="guide-section faq-section">
                            <div className="section-heading">
                                <span className="section-index">06</span>
                                <div>
                                    <span className="section-kicker">Clear the air</span>
                                    <h2 className="section-title">FAQ</h2>
                                </div>
                            </div>
                            <div className="faq-list">
                                {guide.faq.map(item => (
                                    <details key={item.question} className="faq-card">
                                        <summary>
                                            <span>{item.question}</span>
                                            <span className="faq-toggle" aria-hidden="true">
                                                <svg viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" /></svg>
                                            </span>
                                        </summary>
                                        <p>{item.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="guide-sidebar">
                    <div className="sidebar-sticky">
                    <div className="command-card">
                        <div className="command-card-topline">
                            <span>Registration</span>
                            <span className="command-dot" />
                        </div>
                        <div className="registration-state">
                            <span className="status-pulse" />
                            {competition.registration_status || 'Check status'}
                        </div>

                        <div className="command-divider" />

                        <div className="command-meta">
                            <span>Deadline</span>
                            <strong>{formatDate(competition.registration_end_date)}</strong>
                        </div>
                        <div className="command-meta">
                            <span>Guide status</span>
                            <strong>Ready to explore</strong>
                        </div>

                        {guide?.registration_link ? (
                            <a
                                href={guide.registration_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="primary-button"
                            >
                                Register now <span aria-hidden="true">↗</span>
                            </a>
                        ) : (
                            <button type="button" className="primary-button primary-button-disabled" disabled>
                                Registration link coming soon
                            </button>
                        )}

                        <div className="competition-actions">
                            <SaveStarButton competitionId={competition.id} variant="label" />
                            <button type="button" className="notification-button">Notify me</button>
                        </div>

                        {competition.website && (
                            <a href={competition.website} target="_blank" rel="noopener noreferrer" className="official-site-link">
                                Official website <span aria-hidden="true">↗</span>
                            </a>
                        )}
                    </div>

                    <nav className="section-nav" aria-label="Jump to section">
                        <a href="#overview">01</a>
                        <a href="#timeline">02</a>
                        <a href="#prepare">03</a>
                        <a href="#guides">04</a>
                        <a href="#videos">05</a>
                        <a href="#faq">06</a>
                    </nav>
                    </div>

                    <p className="sidebar-note">Your command center for every milestone, resource, and detail.</p>
                </aside>
            </main>
        </div>
        <SiteFooter />
        <BackToTop />
        </>
    );
}
