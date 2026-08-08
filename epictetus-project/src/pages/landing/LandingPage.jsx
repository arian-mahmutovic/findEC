import './LandingPage.css';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import BackToTop from '../../components/BackToTop';
import CompetitionCard from '../competition-list/CompetitionCard';
import Feature from './Feature';
import AuthModal from './AuthModal';
import { getCompetitions } from '../../services/competitions';
import { useAuth } from '../../context/AuthContext';

const FALLBACK_CATEGORIES = [
    "Business",
    "STEM",
    "Research",
    "Finance",
    "Writing",
    "Entrepreneurship"
];

export default function LandingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading } = useAuth();

    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState('signup');

    const [search, setSearch] = useState('');
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        loadCompetitions();
    }, []);

    useEffect(() => {
        if (!loading && user) navigate('/home', { replace: true });
    }, [user, loading]);

    useEffect(() => {
        if (location.hash === '#about') {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.hash]);

    async function loadCompetitions() {
        const result = await getCompetitions();

        if (result.error) {
            console.error(result.error);
            return;
        }

        setCompetitions(result.data || []);
    }

    const categories = useMemo(() => {
        const unique = [...new Set(competitions.map((c) => c.category).filter(Boolean))];
        return unique.length > 0 ? unique : FALLBACK_CATEGORIES;
    }, [competitions]);

    function openAuth(mode) {
        setAuthMode(mode);
        setShowAuth(true);
    }

    function closeAuth() {
        setShowAuth(false);
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        openAuth('signup');
    }

    return (
        <>
        <SiteHeader
            actions={
                <>
                    <button
                        type="button"
                        className="site-header-login"
                        onClick={() => openAuth('login')}
                    >
                        Log in
                    </button>
                    <button
                        type="button"
                        className="site-header-signup"
                        onClick={() => openAuth('signup')}
                    >
                        Sign up
                    </button>
                </>
            }
        />

        {showAuth && (
            <AuthModal mode={authMode} setMode={setAuthMode} closeForm={closeAuth} />
        )}

        <main className="landing-page">

            {/* Hero */}

            <section className="lp-hero">

                <span className="lp-eyebrow">
                    Your Competition Guidance Platform
                </span>

                <h1 className="lp-headline">
                    Discover opportunities.
                    <br />
                    <span className="hl">Learn how to win them.</span>
                </h1>

                <p className="lp-subhead">
                    Search for the best academic competitions, scholarships,
                    research programs, and summer opportunities&mdash;with guides,
                    timelines, and winning strategies built specifically
                    to help you excel in them.
                </p>

                <form className="lp-search-shell" onSubmit={handleSearchSubmit}>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search 'investment', 'engineering', 'business'…"
                        aria-label="Search competitions"
                    />
                    <button type="submit">Search</button>
                </form>

                <div className="lp-categories">
                    {categories.map((tag) => (
                        <button key={tag} type="button" onClick={() => openAuth('signup')}>
                            {tag}
                        </button>
                    ))}
                </div>

            </section>

            {/* Stats */}

            <section className="lp-stats">

                <div className="lp-stat-tile">
                    <h2>High Value</h2>
                    <p>Opportunities</p>
                </div>

                <div className="lp-stat-tile">
                    <h2>In Depth</h2>
                    <p>Step-by-Step Guides</p>
                </div>

                <div className="lp-stat-tile">
                    <h2>All Major</h2>
                    <p>Categories</p>
                </div>

                <div className="lp-stat-tile">
                    <h2>Growing</h2>
                    <p>Student Community</p>
                </div>

            </section>

            {/* Features */}

            <section className="lp-features">

                <span className="lp-section-eyebrow">Why Epictetus</span>
                <h2>Everything you need to compete.</h2>

                <div className="feature-grid">

                    <Feature
                        title="Competition Database"
                        desc="Search competitions by subject, grade level, deadlines, prizes, prestige, and eligibility."
                    />

                    <Feature
                        title="Winning Guides"
                        desc="Learn what successful competitors actually did, common mistakes, timelines, and preparation resources."
                    />

                    <Feature
                        title="Personal Recommendations"
                        desc="Receive opportunities based on your interests, experience, goals, and grade level."
                    />

                    <Feature
                        title="College Value"
                        desc="Understand which opportunities carry the most weight for selective admissions."
                    />

                    <Feature
                        title="Resources"
                        desc="Books, courses, practice material, previous prompts, and official links—all in one place."
                    />

                    <Feature
                        title="Community"
                        desc="Connect with ambitious students looking for teammates, advice, and accountability."
                    />

                </div>

            </section>

            {/* Competitions */}

            {competitions.length > 0 && (
                <section className="lp-competitions">

                    <span className="lp-section-eyebrow">Live in the database</span>
                    <h2>Explore Opportunities</h2>

                    <div className="competition-grid">
                        {competitions.slice(0, 3).map((competition) => (
                            <CompetitionCard
                                key={competition.id ?? competition.slug ?? competition.name}
                                {...competition}
                            />
                        ))}
                    </div>

                    <Link to="/competitions" className="lp-see-all">
                        See all competitions <span>&rarr;</span>
                    </Link>

                </section>
            )}

            {/* About */}

            <section id="about" className="lp-about">

                <div className="lp-about-text">
                    <span className="lp-section-eyebrow lp-about-eyebrow">About the project</span>
                    <h2>Built by students, for students.</h2>

                    <p>
                        Epictetus Project started as a simple frustration: the best
                        academic competitions, scholarships, and research programs
                        are scattered across a hundred different websites, and
                        nobody tells you how to actually win them.
                    </p>

                    <p>
                        So we built one place to find them&mdash;and paired every
                        listing with a real guide: timelines, common mistakes,
                        and the strategies past finalists actually used.
                    </p>
                </div>

                <div className="lp-about-card">
                    <span className="lp-about-card-eyebrow">Why it exists</span>

                    <ul>
                        <li>One database instead of a hundred bookmarked tabs.</li>
                        <li>Guides written for winning, not just applying.</li>
                        <li>Built for ambitious students, kept free to use.</li>
                    </ul>
                </div>

            </section>

            {/* CTA */}

            <section className="lp-cta">

                <h2>
                    Stop searching.
                    <br />
                    <span className="hl">Start preparing.</span>
                </h2>

                <p>
                    Join ambitious students discovering opportunities
                    before everyone else.
                </p>

                <button type="button" onClick={() => openAuth('signup')}>
                    Create Free Account
                </button>

                <p className="lp-cta-login">
                    Already have an account?{' '}
                    <button type="button" className="lp-cta-login-link" onClick={() => openAuth('login')}>
                        Log in
                    </button>
                </p>

            </section>

        </main>

        <SiteFooter />
        <BackToTop />
        </>
    );
}
