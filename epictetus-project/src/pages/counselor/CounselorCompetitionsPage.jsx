import "./CounselorHomePage.css";
import "./CounselorCompetitionsPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useCounselorAuth } from "../../context/CounselorAuthContext";
import { getRoster } from "../../services/counselors";
import { getCompetitions } from "../../services/competitions";
import { getMatchTier } from "../../utils/matchScore";
import ParticleBackground from "../../components/ParticleBackground";
import CounselorFooter from "../../components/CounselorFooter";
import { formatDate } from "../../utils/dates";

function mapStudentBasics(row) {
    const prefs = Array.isArray(row.user_preferences) ? row.user_preferences[0] : row.user_preferences;
    return {
        id: row.id,
        name: row.full_name || "Unnamed student",
        interests: prefs?.interests || []
    };
}

export default function CounselorCompetitionsPage() {
    const { counselor } = useCounselorAuth();

    const [competitions, setCompetitions] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeLocation, setActiveLocation] = useState("All");
    const [activeCost, setActiveCost] = useState("All");
    const [activeFormat, setActiveFormat] = useState("All");
    const [viewMode, setViewMode] = useState("cards");

    useEffect(() => {
        if (counselor) loadData();
    }, [counselor]);

    async function loadData() {
        setLoading(true);
        const [competitionsResult, rosterResult] = await Promise.all([
            getCompetitions(),
            getRoster(counselor.id)
        ]);
        setCompetitions(competitionsResult.data || []);
        setStudents((rosterResult.data || []).map(mapStudentBasics));
        setLoading(false);
    }

    const categories = useMemo(() => {
        const unique = new Set(competitions.map((c) => c.category).filter(Boolean));
        return ["All", ...unique];
    }, [competitions]);

    const locations = useMemo(() => {
        const unique = new Set(competitions.map((c) => c.location_type).filter(Boolean));
        return ["All", ...unique];
    }, [competitions]);

    const withMatches = useMemo(() => {
        return competitions.map((competition) => {
            const matches = students
                .map((student) => ({ student, tier: getMatchTier(competition, student.interests) }))
                .filter((entry) => entry.tier !== null)
                .sort((a, b) => (a.tier === b.tier ? 0 : a.tier === "Strong Match" ? -1 : 1));

            return { competition, matches };
        });
    }, [competitions, students]);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        const results = withMatches.filter(({ competition }) => {
            const matchesCategory = activeCategory === "All" || competition.category === activeCategory;

            const matchesLocation = activeLocation === "All" || competition.location_type === activeLocation;

            const costText = (competition.cost || "").toLowerCase();
            const isFree = costText.startsWith("free");
            const matchesCost = activeCost === "All" || (activeCost === "Free" ? isFree : !isFree);

            const teamText = (competition.team_requirement || "").toLowerCase();
            const matchesFormat =
                activeFormat === "All" ||
                (activeFormat === "Individual" && teamText.includes("individual")) ||
                (activeFormat === "Team" && teamText.includes("team"));

            const matchesSearch =
                !term ||
                [competition.name, competition.organization, competition.category]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term));

            return matchesCategory && matchesLocation && matchesCost && matchesFormat && matchesSearch;
        });

        return results.sort((a, b) => b.matches.length - a.matches.length);
    }, [withMatches, search, activeCategory, activeLocation, activeCost, activeFormat]);

    if (!counselor) return null;

    return (
        <main className="counselor-page">

            <ParticleBackground />

            <nav className="counselor-nav">

                <div className="counselor-nav-brand">
                    <Link to="/counselor/dashboard">Epictetus Project</Link>
                    <span>Counselor Portal</span>
                </div>

                <div className="counselor-nav-user">
                    <Link to="/counselor/dashboard" className="counselor-nav-link">Dashboard</Link>
                </div>

            </nav>

            <div className="counselor-content">

                <header className="counselor-page-header">
                    <h1>Competitions</h1>
                    <p>Browse every competition and see which of your students are a good match.</p>
                </header>

                <div className="cc-toolbar">
                    <input
                        type="search"
                        className="cc-search"
                        placeholder="Search by name, organization, or category…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search competitions"
                    />

                    {categories.length > 1 && (
                        <div className="cc-chip-row" role="group" aria-label="Filter by category">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    className={`cc-chip ${activeCategory === category ? "is-active" : ""}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="cc-chip-row-group">
                        {locations.length > 1 && (
                            <div className="cc-chip-row cc-chip-row-secondary" role="group" aria-label="Filter by format">
                                {locations.map((location) => (
                                    <button
                                        key={location}
                                        type="button"
                                        className={`cc-chip cc-chip-secondary ${activeLocation === location ? "is-active" : ""}`}
                                        onClick={() => setActiveLocation(location)}
                                    >
                                        {location}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="cc-chip-row cc-chip-row-secondary" role="group" aria-label="Filter by cost">
                            {["All", "Free", "Paid"].map((cost) => (
                                <button
                                    key={cost}
                                    type="button"
                                    className={`cc-chip cc-chip-secondary ${activeCost === cost ? "is-active" : ""}`}
                                    onClick={() => setActiveCost(cost)}
                                >
                                    {cost}
                                </button>
                            ))}
                        </div>

                        <div className="cc-chip-row cc-chip-row-secondary" role="group" aria-label="Filter by team size">
                            {["All", "Individual", "Team"].map((format) => (
                                <button
                                    key={format}
                                    type="button"
                                    className={`cc-chip cc-chip-secondary ${activeFormat === format ? "is-active" : ""}`}
                                    onClick={() => setActiveFormat(format)}
                                >
                                    {format}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="cc-toolbar-bottom">
                        <span className="cc-result-count">
                            <strong>{filtered.length}</strong> {filtered.length === 1 ? "result" : "results"}
                        </span>

                        <div className="cc-view-toggle" role="group" aria-label="Switch view">
                            <button
                                type="button"
                                className={viewMode === "cards" ? "is-active" : ""}
                                onClick={() => setViewMode("cards")}
                            >
                                Cards
                            </button>
                            <button
                                type="button"
                                className={viewMode === "list" ? "is-active" : ""}
                                onClick={() => setViewMode("list")}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="counselor-loading">
                        <span className="counselor-loading-dot" />
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="counselor-empty-inline">No competitions match your search.</p>
                ) : viewMode === "list" ? (
                    <div className="cc-list">
                        {filtered.map(({ competition, matches }) => (
                            <div className="cc-list-row" key={competition.id}>
                                <div className="cc-list-row-info">
                                    <div className="cc-card-top">
                                        {competition.category && <span className="cc-category">{competition.category}</span>}
                                        {competition.registration_end_date && (
                                            <span className="cc-deadline">Due {formatDate(competition.registration_end_date)}</span>
                                        )}
                                    </div>
                                    <h3>{competition.name}</h3>
                                    {competition.organization && <p className="cc-org">{competition.organization}</p>}
                                </div>

                                <div className="cc-list-row-matches">
                                    {matches.length === 0 ? (
                                        <p className="cc-no-match">No matches yet</p>
                                    ) : (
                                        <span className="cc-matches-label">
                                            {matches.length} match{matches.length === 1 ? "" : "es"}
                                        </span>
                                    )}
                                </div>

                                {competition.website_url && (
                                    <a
                                        href={competition.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cc-card-link cc-list-row-link"
                                    >
                                        Official website ↗
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="cc-grid">
                        {filtered.map(({ competition, matches }) => (
                            <div className="cc-card" key={competition.id}>

                                <div className="cc-card-top">
                                    {competition.category && <span className="cc-category">{competition.category}</span>}
                                    {competition.registration_end_date && (
                                        <span className="cc-deadline">Due {formatDate(competition.registration_end_date)}</span>
                                    )}
                                </div>

                                <h3>{competition.name}</h3>
                                {competition.organization && <p className="cc-org">{competition.organization}</p>}

                                <div className="cc-facts">
                                    {competition.team_requirement && <span>{competition.team_requirement}</span>}
                                    {competition.cost && <span>{competition.cost}</span>}
                                </div>

                                <div className="cc-matches">
                                    {matches.length === 0 ? (
                                        <p className="cc-no-match">No student matches yet</p>
                                    ) : (
                                        <>
                                            <span className="cc-matches-label">
                                                {matches.length} student match{matches.length === 1 ? "" : "es"}
                                            </span>
                                            <div className="cc-matches-list">
                                                {matches.map(({ student, tier }) => (
                                                    <span
                                                        key={student.id}
                                                        className={`cc-match-pill ${tier === "Strong Match" ? "is-strong" : ""}`}
                                                    >
                                                        {student.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {competition.website_url && (
                                    <a
                                        href={competition.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cc-card-link"
                                    >
                                        Official website ↗
                                    </a>
                                )}

                            </div>
                        ))}
                    </div>
                )}

            </div>

            <CounselorFooter />

        </main>
    );
}
