import "./CounselorHomePage.css";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import dayjs from "dayjs";
import { MOCK_STUDENTS } from "./mockStudents";
import StudentDetailPanel from "./StudentDetailPanel";
import { formatDate } from "../../utils/dates";
import ParticleBackground from "../../components/ParticleBackground";

function joinWithAnd(items) {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export default function CounselorHomePage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);

    const students = MOCK_STUDENTS;

    const filteredStudents = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return students;
        return students.filter((student) => student.name.toLowerCase().includes(query));
    }, [students, search]);

    const stats = useMemo(() => {
        const weekAgo = dayjs().subtract(7, "day");
        const totalSaved = students.reduce((sum, s) => sum + s.savedCompetitions.length, 0);

        return {
            total: students.length,
            activeThisWeek: students.filter((s) => dayjs(s.lastActive).isAfter(weekAgo)).length,
            totalSaved,
            avgSaved: students.length ? (totalSaved / students.length).toFixed(1) : "0"
        };
    }, [students]);

    const interestGroups = useMemo(() => {
        const groups = new Map();

        students.forEach((student) => {
            student.interests.forEach((interest) => {
                if (!groups.has(interest)) groups.set(interest, []);
                groups.get(interest).push(student);
            });
        });

        return Array.from(groups.entries())
            .filter(([, matchedStudents]) => matchedStudents.length > 1)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 4);
    }, [students]);

    const competitionGroups = useMemo(() => {
        const groups = new Map();

        students.forEach((student) => {
            student.savedCompetitions.forEach((competition) => {
                if (!groups.has(competition.name)) groups.set(competition.name, []);
                groups.get(competition.name).push(student);
            });
        });

        return Array.from(groups.entries())
            .filter(([, matchedStudents]) => matchedStudents.length > 1)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 4);
    }, [students]);

    const highlightedStudent = useMemo(() => {
        const student = [...students].sort(
            (a, b) => b.savedCompetitions.length - a.savedCompetitions.length
        )[0];

        if (!student) return null;

        const categoryCounts = new Map();
        student.savedCompetitions.forEach((competition) => {
            categoryCounts.set(competition.category, (categoryCounts.get(competition.category) || 0) + 1);
        });

        const topCategory = Array.from(categoryCounts.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0];

        const otherInterests = student.interests.filter((interest) => interest !== topCategory);

        return { ...student, topCategory, otherInterests };
    }, [students]);

    function handleSignOut() {
        navigate("/counselor");
    }

    return (
        <main className="counselor-page">

            <ParticleBackground />

            <nav className="counselor-nav">

                <div className="counselor-nav-brand">
                    <Link to="/counselor/dashboard">Epictetus Project</Link>
                    <span>Counselor Portal</span>
                </div>

                <div className="counselor-nav-user">
                    <span>Jacksonville Area Schools</span>
                    <button type="button" onClick={handleSignOut}>Sign out</button>
                </div>

            </nav>

            <div className="counselor-content">

                <header className="counselor-page-header">
                    <h1>Your Students</h1>
                    <p>{students.length} students have linked their account to your counselor key.</p>
                </header>

                <section className="counselor-stats">

                    <div className="counselor-stat">
                        <span>Students</span>
                        <strong>{stats.total}</strong>
                    </div>

                    <div className="counselor-stat">
                        <span>Active This Week</span>
                        <strong>{stats.activeThisWeek}</strong>
                    </div>

                    <div className="counselor-stat">
                        <span>Saved Competitions</span>
                        <strong>{stats.totalSaved}</strong>
                    </div>

                    <div className="counselor-stat">
                        <span>Avg. Saved / Student</span>
                        <strong>{stats.avgSaved}</strong>
                    </div>

                </section>

                <section className="counselor-roster">

                    <div className="counselor-roster-header">
                        <h2>Roster</h2>

                        <input
                            type="text"
                            placeholder="Search students…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="counselor-table">

                        <div className="counselor-table-row counselor-table-head">
                            <span>Name</span>
                            <span>Grade</span>
                            <span>Interests</span>
                            <span>Saved</span>
                            <span>Last Active</span>
                            <span></span>
                        </div>

                        {filteredStudents.length === 0 ? (
                            <p className="counselor-empty">No students match &ldquo;{search}&rdquo;.</p>
                        ) : (
                            filteredStudents.map((student) => (
                                <button
                                    type="button"
                                    className="counselor-table-row"
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student)}
                                >
                                    <span className="counselor-table-name">{student.name}</span>
                                    <span>{student.grade}</span>
                                    <span className="counselor-table-interests">
                                        {student.interests.slice(0, 2).join(", ")}
                                        {student.interests.length > 2 ? ` +${student.interests.length - 2}` : ""}
                                    </span>
                                    <span>{student.savedCompetitions.length}</span>
                                    <span>{formatDate(student.lastActive)}</span>
                                    <span className="counselor-table-chevron" aria-hidden="true">&rsaquo;</span>
                                </button>
                            ))
                        )}

                    </div>

                </section>

                <section className="counselor-insights">

                    <div className="counselor-panel-card">
                        <h2>Students With Matching Interests</h2>

                        <div className="match-subsection">
                            <h3>By Interest</h3>

                            {interestGroups.length === 0 ? (
                                <p className="counselor-empty-inline">No overlapping interests yet.</p>
                            ) : (
                                <div className="interest-group-list">
                                    {interestGroups.map(([interest, matchedStudents]) => (
                                        <div className="interest-group" key={interest}>
                                            <span className="interest-group-tag">{interest}</span>
                                            <p>{matchedStudents.map((s) => s.name).join(", ")}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="match-subsection">
                            <h3>By Competition</h3>

                            {competitionGroups.length === 0 ? (
                                <p className="counselor-empty-inline">No shared saved competitions yet.</p>
                            ) : (
                                <div className="interest-group-list">
                                    {competitionGroups.map(([competitionName, matchedStudents]) => (
                                        <div className="interest-group" key={competitionName}>
                                            <span className="interest-group-tag interest-group-tag-competition">
                                                {competitionName}
                                            </span>
                                            <p>{matchedStudents.map((s) => s.name).join(", ")}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="counselor-panel-card">
                        <h2>Highlighted Student</h2>

                        {highlightedStudent && (
                            <button
                                type="button"
                                className="highlighted-student"
                                onClick={() => setSelectedStudent(highlightedStudent)}
                            >
                                <div className="highlighted-student-top">
                                    <strong>{highlightedStudent.name}</strong>
                                    <span>{highlightedStudent.grade} &middot; {highlightedStudent.school}</span>
                                </div>

                                <p>
                                    Progressing through {highlightedStudent.topCategory} competitions rapidly
                                    {highlightedStudent.otherInterests.length > 0 && (
                                        <> &mdash; shows high interest in {joinWithAnd(highlightedStudent.otherInterests)} as well.</>
                                    )}
                                </p>

                                <span className="highlighted-student-cta">View profile &rsaquo;</span>
                            </button>
                        )}
                    </div>

                </section>

                <section className="counselor-panel-card counselor-tips">
                    <h2>How to Use This Page</h2>

                    <ul className="tips-list">
                        <li>
                            <strong>Shared interests or saved competitions</strong>
                            <p>
                                When two or more students save the same competition, consider connecting
                                them&mdash;many contests allow team entries, and peer accountability keeps
                                momentum going.
                            </p>
                        </li>

                        <li>
                            <strong>After a student shows interest</strong>
                            <p>
                                A saved competition is a good moment to check in. Ask what&rsquo;s drawing
                                them to it and help them map a timeline for requirements, recommendation
                                letters, or auditions.
                            </p>
                        </li>

                        <li>
                            <strong>Turning interest into a path</strong>
                            <p>
                                Use each student&rsquo;s interest tags to point them toward clubs, electives,
                                or local programs that build toward it&mdash;robotics team for STEM, Model UN
                                for Law &amp; Policy, a writing workshop for Arts.
                            </p>
                        </li>

                        <li>
                            <strong>Students with nothing saved yet</strong>
                            <p>
                                Not everyone dives in right away. A quick nudge toward two or three
                                competitions in their stated interests is often enough to get them started.
                            </p>
                        </li>
                    </ul>
                </section>

                <section className="counselor-panel-card counselor-tips">
                    <h2>Why This Matters For You</h2>

                    <ul className="tips-list">
                        <li>
                            <strong>Specific, provable outcomes</strong>
                            <p>
                                When students you support place in competitions or win scholarships, that&rsquo;s
                                concrete data for your director, your board, or your own year-end review&mdash;not
                                just a record of effort.
                            </p>
                        </li>

                        <li>
                            <strong>Time you don&rsquo;t have to spend chasing</strong>
                            <p>
                                Instead of tracking down a full caseload to ask what they&rsquo;re working on,
                                this page surfaces it for you, so your limited one-on-one time goes to the
                                conversations that actually need it.
                            </p>
                        </li>

                        <li>
                            <strong>Stronger letters, written faster</strong>
                            <p>
                                A specific, current detail&mdash;&ldquo;she spent the fall preparing for
                                Regeneron&rdquo;&mdash;makes a recommendation sharper than anything reconstructed
                                from memory months later.
                            </p>
                        </li>

                        <li>
                            <strong>Trust that compounds</strong>
                            <p>
                                A short, specific check-in tells a student and their parents you&rsquo;re
                                actually paying attention&mdash;the kind of thing that earns goodwill well
                                beyond graduation.
                            </p>
                        </li>
                    </ul>
                </section>

            </div>

            {selectedStudent && (
                <StudentDetailPanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />
            )}

        </main>
    );
}
