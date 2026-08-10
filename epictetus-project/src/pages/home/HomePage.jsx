import "./HomePage.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { useSavedCompetitions } from "../../context/SavedCompetitionsContext";
import { signOut } from "../../services/auth";
import { getCompetitions, getRecentGuideArticles } from "../../services/competitions";
import { getUserPreferences } from "../../services/preferences";
import { getProgressCounts } from "../../services/applications";
import OnboardingModal from "../../components/OnboardingModal";
import ProfileModal from "../../components/ProfileModal";
import BackToTop from "../../components/BackToTop";
import SiteFooter from "../../components/SiteFooter";
import SaveStarButton from "../../components/SaveStarButton";
import ReminderBanner from "../../components/ReminderBanner";
import { formatDate } from "../../utils/dates";
import { getMatchTier, getMatchReason } from "../../utils/matchScore";

const CONTACT_EMAIL = "hello@epictetusproject.com";
const YOUTUBE_URL = "https://www.youtube.com/@EpictetusProject";

export default function HomePage() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { savedRows, savedIds } = useSavedCompetitions();

    const [preferences, setPreferences] = useState(null);
    const [competitions, setCompetitions] = useState([]);
    const [articles, setArticles] = useState([]);
    const [progressCounts, setProgressCounts] = useState({ registered: 0, applied: 0, resulted: 0 });
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [search, setSearch] = useState("");
    const [aboutOpen, setAboutOpen] = useState(false);

    useEffect(() => {
        if (user) loadDashboard();
    }, [user]);

    useEffect(() => {
        if (location.hash === "#about" && !loading) {
            setAboutOpen(true);
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }
    }, [location.hash, loading]);

    async function loadDashboard() {
        setLoading(true);

        const [prefsRes, compsRes, articlesRes, progressRes] = await Promise.all([
            getUserPreferences(user.id),
            getCompetitions(),
            getRecentGuideArticles(4),
            getProgressCounts(user.id)
        ]);

        setPreferences(prefsRes.data);
        setShowOnboarding(!prefsRes.data);
        setCompetitions(compsRes.data || []);
        setArticles(articlesRes.data || []);
        setProgressCounts(progressRes);
        setLoading(false);
    }

    function handleOnboardingComplete() {
        setShowOnboarding(false);
        loadDashboard();
    }

    const interests = useMemo(() => preferences?.interests || [], [preferences]);

    const recommended = useMemo(() => {
        const unsaved = competitions.filter((c) => !savedIds.has(c.id));

        const matched = unsaved
            .map((c) => ({ competition: c, tier: getMatchTier(c, interests) }))
            .filter((entry) => entry.tier !== null)
            .sort((a, b) => (a.tier === b.tier ? 0 : a.tier === "Strong Match" ? -1 : 1));

        const pool = matched.length > 0 ? matched : unsaved.map((c) => ({ competition: c, tier: null }));
        return pool.slice(0, 3);
    }, [competitions, interests, savedIds]);

    const nextMilestone = useMemo(() => {
        if (savedRows.length === 0) {
            return "Save a competition that matches your interests to get started.";
        }
        if (progressCounts.registered === 0) {
            return "Visit a saved competition's registration page to take the next step.";
        }
        if (progressCounts.applied === 0) {
            return "We'll check in a day or two after you register to confirm you applied.";
        }
        if (progressCounts.resulted === 0) {
            return "Report how it went once you hear back from a competition.";
        }
        return recommended.length > 0
            ? `Keep exploring — ${recommended.length} new opportunit${recommended.length === 1 ? "y" : "ies"} match your interests.`
            : "You're on track. Check back for new opportunities.";
    }, [savedRows, progressCounts, recommended]);

    const upcomingDeadlines = useMemo(() => {
        const today = dayjs();
        return competitions
            .filter((c) => c.registration_end_date && dayjs(c.registration_end_date).isAfter(today))
            .sort((a, b) => new Date(a.registration_end_date) - new Date(b.registration_end_date))
            .slice(0, 4);
    }, [competitions]);

    const stats = useMemo(() => ({
        saved: savedRows.length,
        open: competitions.filter((c) => c.registration_status === "Open").length,
        following: interests.length,
        total: competitions.length
    }), [competitions, savedRows, interests]);

    function handleSearchSubmit(e) {
        e.preventDefault();
        const query = search.trim();
        navigate(query ? `/competitions?q=${encodeURIComponent(query)}` : "/competitions");
    }

    async function handleSignOut() {
        await signOut();
        navigate("/", { replace: true });
    }

    const fullName = (profile?.full_name || user?.user_metadata?.full_name || "").trim();
    const firstName = fullName ? fullName.split(" ")[0] : null;
    const initials = fullName
        ? fullName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("")
        : "?";

    if (!user) return null;

    return (
        <>

        <main className="dashboard-page">

            {/* ===========================
                NAVBAR
            =========================== */}

            <nav className="dashboard-nav">

                <Link to="/home" className="dashboard-brand">
                    Epictetus Project
                </Link>

                <div className="dashboard-nav-links">
                    <Link to="/competitions">Competitions</Link>
                    <Link to="/home#about">About</Link>
                    <a href={`mailto:${CONTACT_EMAIL}`}>Contact Us</a>

                    <a
                        href={YOUTUBE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dashboard-icon-btn"
                        aria-label="Watch on YouTube"
                        title="YouTube"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9.5v5l4.5-2.5Z" fill="#111111"/></svg>
                    </a>
                </div>

                <div className="dashboard-user">
                    <button
                        type="button"
                        className="profile-circle"
                        onClick={() => setShowProfile(true)}
                        aria-label="Open your profile"
                    >
                        {initials}
                    </button>

                    <button type="button" className="dashboard-signout" onClick={handleSignOut}>
                        Sign out
                    </button>
                </div>

            </nav>


            {/* ===========================
                HERO
            =========================== */}

            <section className="dashboard-hero">

                <h1>
                    Good afternoon{firstName ? `, ${firstName}` : ""}.
                </h1>

                <p>
                    {profile?.school ? `${profile.school} — ` : ""}
                    Here&rsquo;s what&rsquo;s worth your time right now.
                </p>

                <form className="dashboard-search" onSubmit={handleSearchSubmit}>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search competitions, scholarships, guides…"
                    />
                    <button type="submit">Search</button>
                </form>

            </section>

            <ReminderBanner userId={user.id} />

            {/* ===========================
                DASHBOARD STATS
            =========================== */}

            <section className="dashboard-stats">

                <div className="dashboard-stat-card">
                    <h3>Saved</h3>
                    <p>{stats.saved}</p>
                </div>

                <div className="dashboard-stat-card">
                    <h3>Open Now</h3>
                    <p>{stats.open}</p>
                </div>

                <div className="dashboard-stat-card">
                    <h3>Following</h3>
                    <p>{stats.following}</p>
                </div>

                <div className="dashboard-stat-card">
                    <h3>Total Opportunities</h3>
                    <p>{stats.total}</p>
                </div>

            </section>


            {loading ? (
                <div className="dashboard-loading">
                    <span className="dashboard-loading-dot" />
                </div>
            ) : (

            /* ===========================
                MAIN GRID
            =========================== */

            <section className="dashboard-grid">

                {/* LEFT */}

                <div className="dashboard-main">

                    {/* Recommended */}

                    <div className="dashboard-section">

                        <h2>Recommended For You</h2>

                        {recommended.length === 0 ? (
                            <p className="dashboard-empty">
                                You&rsquo;ve saved everything we&rsquo;d recommend&mdash;nice work.
                            </p>
                        ) : (
                            <div className="recommendation-grid">

                                {recommended.map(({ competition, tier }) => (

                                    <div className="recommendation-card" key={competition.id}>

                                        <div className="recommendation-card-top">
                                            {competition.category && <span>{competition.category}</span>}
                                            {tier && <span className={`match-badge ${tier === "Strong Match" ? "is-strong" : ""}`}>{tier}</span>}
                                        </div>

                                        <h3>{competition.name}</h3>

                                        {tier && (
                                            <p className="recommendation-card-reason">
                                                {getMatchReason(competition, interests)}
                                            </p>
                                        )}

                                        <div className="recommendation-card-actions">
                                            <Link to={`/competitions/${competition.slug}`}>
                                                <button type="button">View guide</button>
                                            </Link>

                                            <SaveStarButton competitionId={competition.id} className="save-toggle" />
                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}

                    </div>


                    {/* Latest Guides */}

                    <div className="dashboard-section">

                        <h2>Latest Guides</h2>

                        {articles.length === 0 ? (
                            <p className="dashboard-empty">No guides published yet.</p>
                        ) : (
                            articles.map((article) => (

                                <div className="guide-row" key={article.id}>

                                    <div>
                                        <h3>{article.title}</h3>
                                        <p>{article.summary}</p>
                                    </div>

                                    {article.slug && (
                                        <Link to={`/articles/${article.slug}`}>
                                            <button type="button">Read</button>
                                        </Link>
                                    )}

                                </div>

                            ))
                        )}

                    </div>

                </div>


                {/* SIDEBAR */}

                <aside className="dashboard-sidebar">

                    <div className="dashboard-widget">

                        <h3>Upcoming Deadlines</h3>

                        {upcomingDeadlines.length === 0 ? (
                            <p className="dashboard-empty">No open deadlines right now.</p>
                        ) : (
                            upcomingDeadlines.map((competition) => (

                                <Link
                                    to={`/competitions/${competition.slug}`}
                                    className="deadline-item"
                                    key={competition.id}
                                >
                                    <div>
                                        <strong>{competition.name}</strong>
                                        <p>{formatDate(competition.registration_end_date)}</p>
                                    </div>

                                    <span className="deadline-days">
                                        {dayjs(competition.registration_end_date).diff(dayjs(), "day")}d left
                                    </span>
                                </Link>

                            ))
                        )}

                    </div>


                    <div className="dashboard-widget">

                        <h3>Your Progress</h3>

                        <div className="progress-funnel">
                            <div className="progress-funnel-step">
                                <strong>{savedRows.length}</strong>
                                <span>Saved</span>
                            </div>
                            <div className="progress-funnel-step">
                                <strong>{progressCounts.registered}</strong>
                                <span>Started</span>
                            </div>
                            <div className="progress-funnel-step">
                                <strong>{progressCounts.applied}</strong>
                                <span>Applied</span>
                            </div>
                            <div className="progress-funnel-step">
                                <strong>{progressCounts.resulted}</strong>
                                <span>Result</span>
                            </div>
                        </div>

                        <p className="progress-milestone">{nextMilestone}</p>

                    </div>


                    <div className="dashboard-widget">

                        <h3>Saved Competitions</h3>

                        {savedRows.length === 0 ? (
                            <p className="dashboard-empty">
                                Nothing saved yet&mdash;star a competition to keep it here.
                            </p>
                        ) : (
                            savedRows.map((row) => (

                                <div className="saved-item" key={row.id}>
                                    <Link to={`/competitions/${row.competitions?.slug}`}>
                                        {row.competitions?.name}
                                    </Link>

                                    <SaveStarButton competitionId={row.competition_id} />
                                </div>

                            ))
                        )}

                    </div>

                </aside>

            </section>

            )}


            {/* ===========================
                ABOUT
            =========================== */}

            <details
                id="about"
                className="dashboard-about"
                open={aboutOpen}
                onToggle={(e) => setAboutOpen(e.target.open)}
            >

                <summary className="dashboard-about-summary">
                    <span>
                        <span className="dashboard-about-eyebrow">About</span>
                        <h2>Why we built Epictetus Project</h2>
                    </span>
                    <span className="dashboard-about-chevron" aria-hidden="true">&#9660;</span>
                </summary>

                <div className="dashboard-about-body">

                    <p>
                        Epictetus Project started with a simple, frustrating realization: the opportunities
                        that actually move the needle for ambitious students&mdash;national competitions,
                        research programs, selective scholarships&mdash;are scattered across a hundred
                        disconnected websites, and almost none of them tell you how to actually compete for
                        them. Finding a competition&rsquo;s rules page is easy. Finding out what separates a
                        finalist from everyone else who read the same rules page is another matter entirely.
                    </p>

                    <p>
                        So we built the tool we wished existed: one organized database of high-value
                        opportunities, paired with guides written the way a knowledgeable upperclassman
                        would actually explain it to you&mdash;realistic timelines, the mistakes that
                        quietly sink most applicants, and the habits of people who&rsquo;ve actually won.
                        Not vague encouragement, and not a repost of the official rules page. An actual plan.
                    </p>

                    <p>
                        The name isn&rsquo;t an accident. Epictetus was a Stoic philosopher who taught that
                        we rarely control the outcome&mdash;a judge&rsquo;s taste, a competitor&rsquo;s
                        brilliance, plain luck&mdash;but we always control our preparation. That&rsquo;s the
                        whole premise here: nothing on this platform can guarantee a win, but it can make
                        sure you walk in more prepared than almost everyone else in the room.
                    </p>

                    <p>
                        This is a small, independent project built by students who got tired of learning
                        things the hard way and figured other students shouldn&rsquo;t have to. It isn&rsquo;t
                        run by a test-prep company or an admissions consultancy, and there&rsquo;s no
                        $2,000 package hiding behind a paywall. It stays honest, current, and free, because
                        the goal was never to build a business&mdash;it was to fix a genuinely annoying problem.
                    </p>

                    <p>
                        We&rsquo;re still adding competitions, rewriting guides, and fixing things as we
                        learn what&rsquo;s actually useful versus what just sounds good on a landing page.
                        If you spot something wrong or missing, Contact Us above goes straight to us&mdash;not
                        a support queue.
                    </p>

                </div>

            </details>

            {showOnboarding && (
                <OnboardingModal userId={user.id} onComplete={handleOnboardingComplete} />
            )}

            {showProfile && (
                <ProfileModal closeForm={() => setShowProfile(false)} />
            )}

            <BackToTop />

        </main>

        <SiteFooter />

        </>

    );

}
