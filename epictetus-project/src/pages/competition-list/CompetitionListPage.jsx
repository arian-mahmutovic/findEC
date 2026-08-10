import CompetitionCard from "./CompetitionCard";
import './CompetitionListPage.css';
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { getCompetitions } from "../../services/competitions";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import BackToTop from "../../components/BackToTop";

export default function CompetitionListPage() {
    const [searchParams] = useSearchParams();

    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeLocation, setActiveLocation] = useState("All");
    const [activeCost, setActiveCost] = useState("All");
    const [activeFormat, setActiveFormat] = useState("All");

    useEffect(() => {
        loadCompetitionsData();
    }, []);

    async function loadCompetitionsData() {
        setLoading(true);
        setError(false);

        const result = await getCompetitions();

        if (result.error) {
            console.error(result.error);
            setError(true);
            setLoading(false);
            return;
        }

        setCompetitions(result.data || []);
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

    const filteredCompetitions = useMemo(() => {
        const term = search.trim().toLowerCase();

        return competitions.filter((competition) => {
            const matchesCategory =
                activeCategory === "All" || competition.category === activeCategory;

            const matchesLocation =
                activeLocation === "All" || competition.location_type === activeLocation;

            const costText = (competition.cost || "").toLowerCase();
            const isFree = costText.startsWith("free");
            const matchesCost =
                activeCost === "All" || (activeCost === "Free" ? isFree : !isFree);

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
    }, [competitions, search, activeCategory, activeLocation, activeCost, activeFormat]);

    const hasActiveFilters =
        search.trim() !== "" ||
        activeCategory !== "All" ||
        activeLocation !== "All" ||
        activeCost !== "All" ||
        activeFormat !== "All";

    function clearFilters() {
        setSearch("");
        setActiveCategory("All");
        setActiveLocation("All");
        setActiveCost("All");
        setActiveFormat("All");
    }

    return (
        <>
        <SiteHeader />
        <main className="competition-list-page">

            <section className="list-hero">
                <span className="list-eyebrow">Academic competitions &amp; opportunities</span>

                <h1 className="list-headline">
                    Discover what&rsquo;s <span className="hl">worth competing for.</span>
                </h1>

                <p className="list-subhead">
                    Real competitions, scholarships, and research programs&mdash;each paired
                    with a guide built to help you actually win.
                </p>

                <div className="list-search-shell">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, organization, or category&hellip;"
                        aria-label="Search competitions"
                    />
                </div>

                {categories.length > 1 && (
                    <div className="list-chip-row" role="group" aria-label="Filter by category">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={`list-chip ${activeCategory === category ? "is-active" : ""}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                <div className="list-filter-groups">

                    {locations.length > 1 && (
                        <div className="list-chip-row list-chip-row-secondary" role="group" aria-label="Filter by format">
                            {locations.map((location) => (
                                <button
                                    key={location}
                                    type="button"
                                    className={`list-chip list-chip-secondary ${activeLocation === location ? "is-active" : ""}`}
                                    onClick={() => setActiveLocation(location)}
                                >
                                    {location}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="list-chip-row list-chip-row-secondary" role="group" aria-label="Filter by cost">
                        {["All", "Free", "Paid"].map((cost) => (
                            <button
                                key={cost}
                                type="button"
                                className={`list-chip list-chip-secondary ${activeCost === cost ? "is-active" : ""}`}
                                onClick={() => setActiveCost(cost)}
                            >
                                {cost}
                            </button>
                        ))}
                    </div>

                    <div className="list-chip-row list-chip-row-secondary" role="group" aria-label="Filter by team size">
                        {["All", "Individual", "Team"].map((format) => (
                            <button
                                key={format}
                                type="button"
                                className={`list-chip list-chip-secondary ${activeFormat === format ? "is-active" : ""}`}
                                onClick={() => setActiveFormat(format)}
                            >
                                {format}
                            </button>
                        ))}
                    </div>

                </div>
            </section>

            {!loading && !error && competitions.length > 0 && (
                <div className="list-filter-bar">
                    <span className="list-result-count">
                        <strong>{filteredCompetitions.length}</strong>{" "}
                        {filteredCompetitions.length === 1 ? "result" : "results"}
                        {activeCategory !== "All" && <> in {activeCategory}</>}
                    </span>

                    {hasActiveFilters && (
                        <button type="button" className="list-clear-btn" onClick={clearFilters}>
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {loading && (
                <section className="competition-grid" aria-busy="true" aria-label="Loading competitions">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div className="skeleton-card" key={index}>
                            <div className="skeleton-line skeleton-badge" />
                            <div className="skeleton-line skeleton-title" />
                            <div className="skeleton-line skeleton-text" />
                            <div className="skeleton-line skeleton-text short" />
                        </div>
                    ))}
                </section>
            )}

            {!loading && error && (
                <div className="list-state-card list-error-card" role="alert">
                    <h2>Couldn&rsquo;t load competitions.</h2>
                    <p>Something went wrong reaching the database. Check your connection and try again.</p>
                    <button type="button" className="list-retry-btn" onClick={loadCompetitionsData}>
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && competitions.length === 0 && (
                <div className="list-state-card">
                    <h2>No competitions yet.</h2>
                    <p>Check back soon&mdash;new opportunities are added regularly.</p>
                </div>
            )}

            {!loading && !error && competitions.length > 0 && filteredCompetitions.length === 0 && (
                <div className="list-state-card">
                    <h2>Nothing matches yet.</h2>
                    <p>Try a different search term, or clear your filters to see everything available.</p>
                    <button type="button" className="list-retry-btn" onClick={clearFilters}>
                        Clear filters
                    </button>
                </div>
            )}

            {!loading && !error && filteredCompetitions.length > 0 && (
                <section className="competition-grid">
                    {filteredCompetitions.map((competition) => (
                        <CompetitionCard
                            key={competition.id ?? competition.slug ?? competition.name}
                            {...competition}
                        />
                    ))}
                </section>
            )}

        </main>
        <SiteFooter />
        <BackToTop />
        </>
    );
}
