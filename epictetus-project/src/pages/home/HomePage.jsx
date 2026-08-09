import "./HomePage.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { useSavedCompetitions } from "../../context/SavedCompetitionsContext";
import { signOut } from "../../services/auth";
import { getCompetitions, getRecentGuideArticles } from "../../services/competitions";
import { getUserPreferences } from "../../services/preferences";
import OnboardingModal from "../../components/OnboardingModal";
import ProfileModal from "../../components/ProfileModal";
import BackToTop from "../../components/BackToTop";
import SiteFooter from "../../components/SiteFooter";
import SaveStarButton from "../../components/SaveStarButton";
import { formatDate } from "../../utils/dates";

export default function HomePage() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const { savedRows, savedIds } = useSavedCompetitions();

    const [preferences, setPreferences] = useState(null);
    const [competitions, setCompetitions] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (user) loadDashboard();
    }, [user]);

    async function loadDashboard() {
        setLoading(true);

        const [prefsRes, compsRes, articlesRes] = await Promise.all([
            getUserPreferences(user.id),
            getCompetitions(),
            getRecentGuideArticles(4)
        ]);

        setPreferences(prefsRes.data);
        setShowOnboarding(!prefsRes.data);
        setCompetitions(compsRes.data || []);
        setArticles(articlesRes.data || []);
        setLoading(false);
    }

    function handleOnboardingComplete() {
        setShowOnboarding(false);
        loadDashboard();
    }

    const interests = useMemo(() => preferences?.interests || [], [preferences]);

    const recommended = useMemo(() => {
        const byInterest = competitions.filter(
            (c) => interests.includes(c.category) && !savedIds.has(c.id)
        );
        const pool = byInterest.length > 0
            ? byInterest
            : competitions.filter((c) => !savedIds.has(c.id));
        return pool.slice(0, 3);
    }, [competitions, interests, savedIds]);

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
                    <Link to="/home">Dashboard</Link>
                    <Link to="/competitions">Competitions</Link>
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

                                {recommended.map((competition) => (

                                    <div className="recommendation-card" key={competition.id}>

                                        {competition.category && <span>{competition.category}</span>}

                                        <h3>{competition.name}</h3>

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

                                    {article.competitions?.slug && (
                                        <Link to={`/competitions/${article.competitions.slug}`}>
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
                                        {dayjs(competition.registration_end_date).diff(dayjs(), "day")}d
                                    </span>
                                </Link>

                            ))
                        )}

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
