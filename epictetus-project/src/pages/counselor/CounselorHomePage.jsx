import "./CounselorHomePage.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import dayjs from "dayjs";
import { useCounselorAuth } from "../../context/CounselorAuthContext";
import {
    getRoster,
    unlinkStudent,
    archiveStudent,
    getArchivedStudents,
    counselorSignOut
} from "../../services/counselors";
import StudentDetailPanel from "./StudentDetailPanel";
import CounselorAccountModal from "./CounselorAccountModal";
import ParticleBackground from "../../components/ParticleBackground";
import CounselorFooter from "../../components/CounselorFooter";
import { formatDate } from "../../utils/dates";
import { COUNSELOR_ARTICLES } from "./counselorArticles";

const SUGGESTION_WINDOW_DAYS = 21;

function joinWithAnd(items) {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function formatGrade(grade) {
    return grade ? `${grade}th` : "—";
}

function mapStudentRow(row) {
    const prefs = Array.isArray(row.user_preferences) ? row.user_preferences[0] : row.user_preferences;

    const savedCompetitions = (row.saved_competitions || [])
        .filter((sc) => sc.competitions)
        .map((sc) => ({
            id: sc.id,
            competitionId: sc.competition_id,
            name: sc.competitions.name,
            slug: sc.competitions.slug,
            category: sc.competitions.category,
            deadline: sc.competitions.registration_end_date,
            prize: sc.competitions.prize,
            description: sc.competitions.description,
            savedAt: sc.created_at
        }));

    const guidesDone = (row.guide_views || [])
        .filter((gv) => gv.competitions)
        .map((gv) => ({
            competitionId: gv.competition_id,
            name: gv.competitions.name,
            category: gv.competitions.category,
            lastViewedAt: gv.last_viewed_at
        }));

    const activityTimestamps = [
        ...(row.saved_competitions || []).map((sc) => sc.created_at),
        ...(row.guide_views || []).map((gv) => gv.last_viewed_at)
    ].filter(Boolean).sort();

    return {
        id: row.id,
        name: row.full_name || "Unnamed student",
        grade: row.grade || null,
        gradeLabel: formatGrade(row.grade),
        school: row.school,
        interests: prefs?.interests || [],
        savedCompetitions,
        guidesDone,
        lastActive: activityTimestamps.length ? activityTimestamps[activityTimestamps.length - 1] : null
    };
}

export default function CounselorHomePage() {
    const navigate = useNavigate();
    const { counselor } = useCounselorAuth();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAccount, setShowAccount] = useState(false);
    const [showArchive, setShowArchive] = useState(false);
    const [archivedStudents, setArchivedStudents] = useState([]);
    const [loadingArchive, setLoadingArchive] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);

    useEffect(() => {
        if (counselor) loadRoster();
    }, [counselor]);

    async function loadRoster() {
        setLoading(true);
        const result = await getRoster(counselor.id);
        setStudents((result.data || []).map(mapStudentRow));
        setLoading(false);
    }

    async function handleUnlink(studentId) {
        await unlinkStudent(studentId);
        setSelectedStudent(null);
        setStudents((current) => current.filter((s) => s.id !== studentId));
    }

    async function handleArchive(student, achievementsNote) {
        await archiveStudent(counselor.id, {
            studentId: student.id,
            studentName: student.name,
            studentSchool: student.school,
            studentGrade: student.grade,
            interests: student.interests,
            savedCompetitions: student.savedCompetitions,
            guidesDone: student.guidesDone,
            achievementsNote
        });
        setSelectedStudent(null);
        setStudents((current) => current.filter((s) => s.id !== student.id));
        setArchivedStudents([]);
    }

    async function handleToggleArchiveView() {
        const next = !showArchive;
        setShowArchive(next);

        if (next && archivedStudents.length === 0) {
            setLoadingArchive(true);
            const result = await getArchivedStudents(counselor.id);
            setArchivedStudents(result.data || []);
            setLoadingArchive(false);
        }
    }

    async function handleSignOut() {
        await counselorSignOut();
        navigate("/counselor");
    }

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
            activeThisWeek: students.filter((s) => s.lastActive && dayjs(s.lastActive).isAfter(weekAgo)).length,
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

        if (!student || student.savedCompetitions.length === 0) return null;

        const categoryCounts = new Map();
        student.savedCompetitions.forEach((competition) => {
            categoryCounts.set(competition.category, (categoryCounts.get(competition.category) || 0) + 1);
        });

        const topCategory = Array.from(categoryCounts.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0];

        const otherInterests = student.interests.filter((interest) => interest !== topCategory);

        return { ...student, topCategory, otherInterests };
    }, [students]);

    const suggestion = useMemo(() => {
        const now = dayjs();
        const cutoff = now.add(SUGGESTION_WINDOW_DAYS, "day");
        const byCompetition = new Map();

        students.forEach((student) => {
            student.savedCompetitions.forEach((competition) => {
                if (!competition.deadline) return;

                const deadline = dayjs(competition.deadline);
                if (deadline.isBefore(now, "day") || deadline.isAfter(cutoff)) return;

                if (!byCompetition.has(competition.competitionId)) {
                    byCompetition.set(competition.competitionId, { competition, students: [] });
                }
                byCompetition.get(competition.competitionId).students.push(student);
            });
        });

        const candidates = Array.from(byCompetition.values())
            .filter((entry) => entry.students.length > 1)
            .sort((a, b) => dayjs(a.competition.deadline).diff(dayjs(b.competition.deadline)));

        const best = candidates[0];
        if (!best) return null;

        return {
            studentNames: best.students.map((s) => s.name),
            competitionName: best.competition.name,
            deadline: best.competition.deadline,
            daysLeft: dayjs(best.competition.deadline).diff(now, "day"),
            incentive: best.competition.description || best.competition.prize
        };
    }, [students]);

    const inviteLink = counselor ? `${window.location.origin}/?counselor=${counselor.id}` : "";

    const inviteEmailBody = counselor
        ? `Hi,\n\nI'd like to help you find and prepare for competitions, scholarships, and other opportunities through Epictetus Project. It only takes a minute to set up:\n\n1. Create your free account: ${inviteLink}\n2. When asked for your school, select ${counselor.school}.\n3. Select "${counselor.name}" as your counselor.\n\nOnce you're set up, I'll be able to see what you're interested in and help point you toward the right next steps.\n\n${counselor.name}`
        : "";

    function copyInviteLink() {
        navigator.clipboard.writeText(inviteLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    }

    function copyInviteEmail() {
        navigator.clipboard.writeText(inviteEmailBody);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    }

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
                    <span>{counselor.school}</span>
                    <button type="button" onClick={() => setShowAccount(true)}>My Account</button>
                    <button type="button" onClick={handleSignOut}>Sign out</button>
                </div>

            </nav>

            <div className="counselor-content">

                <header className="counselor-page-header">
                    <h1>Your Students</h1>
                    <p>
                        {students.length} student{students.length === 1 ? "" : "s"} {students.length === 1 ? "has" : "have"} linked
                        their account to you, {counselor.name}.
                    </p>
                </header>

                {loading ? (
                    <div className="counselor-loading">
                        <span className="counselor-loading-dot" />
                    </div>
                ) : (
                    <>

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
                                    <p className="counselor-empty">
                                        {students.length === 0
                                            ? "No students yet — see below for how to get your first one linked."
                                            : `No students match “${search}”.`}
                                    </p>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <button
                                            type="button"
                                            className="counselor-table-row"
                                            key={student.id}
                                            onClick={() => setSelectedStudent(student)}
                                        >
                                            <span className="counselor-table-name">{student.name}</span>
                                            <span>{student.gradeLabel}</span>
                                            <span className="counselor-table-interests">
                                                {student.interests.slice(0, 2).join(", ")}
                                                {student.interests.length > 2 ? ` +${student.interests.length - 2}` : ""}
                                            </span>
                                            <span>{student.savedCompetitions.length}</span>
                                            <span>{student.lastActive ? formatDate(student.lastActive) : "No activity yet"}</span>
                                            <span className="counselor-table-chevron" aria-hidden="true">&rsaquo;</span>
                                        </button>
                                    ))
                                )}

                            </div>

                        </section>

                        {suggestion && (
                            <section className="counselor-panel-card counselor-suggestion">
                                <h2>Suggested Next Step</h2>

                                <p className="counselor-suggestion-lead">
                                    <strong>{joinWithAnd(suggestion.studentNames)}</strong> {suggestion.studentNames.length === 2 ? "are both" : "are all"} interested
                                    in <strong>{suggestion.competitionName}</strong>, and the application deadline is
                                    in {suggestion.daysLeft <= 0 ? "today" : `${suggestion.daysLeft} day${suggestion.daysLeft === 1 ? "" : "s"}`} ({formatDate(suggestion.deadline)}).
                                </p>

                                {suggestion.incentive && (
                                    <p className="counselor-suggestion-detail">{suggestion.incentive}</p>
                                )}

                                <p className="counselor-suggestion-cta">
                                    Have you considered bringing them together so they can find a team?
                                    See <Link to="/counselor/articles/how-to-create-teams">How to Create Teams</Link> and{" "}
                                    <Link to="/counselor/articles/finding-the-right-mentors">Finding the Right Mentors</Link>.
                                </p>
                            </section>
                        )}

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

                                {highlightedStudent ? (
                                    <button
                                        type="button"
                                        className="highlighted-student"
                                        onClick={() => setSelectedStudent(highlightedStudent)}
                                    >
                                        <div className="highlighted-student-top">
                                            <strong>{highlightedStudent.name}</strong>
                                            <span>{highlightedStudent.gradeLabel} &middot; {highlightedStudent.school}</span>
                                        </div>

                                        <p>
                                            Progressing through {highlightedStudent.topCategory} competitions rapidly
                                            {highlightedStudent.otherInterests.length > 0 && (
                                                <> &mdash; shows high interest in {joinWithAnd(highlightedStudent.otherInterests)} as well.</>
                                            )}
                                        </p>

                                        <span className="highlighted-student-cta">View profile &rsaquo;</span>
                                    </button>
                                ) : (
                                    <p className="counselor-empty-inline">No standout activity yet.</p>
                                )}
                            </div>

                        </section>

                        <section className={`counselor-panel-card counselor-getting-students ${students.length === 0 ? "is-prominent" : ""}`}>
                            <h2>How Students Find &amp; Add You</h2>
                            <p>
                                Students link to you themselves — there&rsquo;s nothing for you to approve. When a
                                student sets up their profile, they select their school, then choose your
                                name from the list of counselors at that school. Once they do, they show up
                                here automatically.
                            </p>
                            {students.length === 0 && (
                                <p className="counselor-getting-students-hint">
                                    Make sure students know your school is set correctly in their profile —
                                    or use the invite card below to send them straight to sign-up.
                                </p>
                            )}
                        </section>

                        <section className="counselor-panel-card counselor-invite">
                            <h2>Invite Students</h2>
                            <p>
                                Share this link directly, or copy the email template below and send it as-is.
                                Both automatically fill in your school and name during their sign-up.
                            </p>

                            <div className="counselor-invite-row">
                                <code className="counselor-invite-link">{inviteLink}</code>
                                <button type="button" onClick={copyInviteLink}>
                                    {linkCopied ? "Copied" : "Copy Link"}
                                </button>
                            </div>

                            <div className="counselor-invite-email">
                                <div className="counselor-invite-email-header">
                                    <span>Email template</span>
                                    <button type="button" onClick={copyInviteEmail}>
                                        {emailCopied ? "Copied" : "Copy Email"}
                                    </button>
                                </div>
                                <pre>{inviteEmailBody}</pre>
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

                        <section className="counselor-panel-card counselor-articles">
                            <h2>Counselor Guides</h2>

                            <div className="counselor-articles-grid">
                                {COUNSELOR_ARTICLES.map((article) => (
                                    <Link
                                        to={`/counselor/articles/${article.slug}`}
                                        className="counselor-article-card"
                                        key={article.slug}
                                    >
                                        <strong>{article.title}</strong>
                                        <p>{article.teaser}</p>
                                        <span>Read guide &rsaquo;</span>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section className="counselor-panel-card counselor-archive-section">
                            <div className="counselor-archive-header">
                                <h2>Archive</h2>
                                <button type="button" onClick={handleToggleArchiveView}>
                                    {showArchive ? "Hide Archive" : "View Archive"}
                                </button>
                            </div>

                            {!showArchive ? (
                                <p className="counselor-empty-inline">
                                    Archived students&rsquo; saved competitions, viewed guides, and achievements
                                    are kept here even after they&rsquo;re removed from your active roster.
                                </p>
                            ) : loadingArchive ? (
                                <p className="counselor-empty-inline">Loading archive…</p>
                            ) : archivedStudents.length === 0 ? (
                                <p className="counselor-empty-inline">No archived students yet.</p>
                            ) : (
                                <div className="counselor-archive-grid">
                                    {archivedStudents.map((entry) => (
                                        <div className="counselor-archive-card" key={entry.id}>
                                            <strong>{entry.student_name}</strong>
                                            <span className="counselor-archive-meta">
                                                {formatGrade(entry.student_grade)} &middot; {entry.student_school || "—"} &middot; Archived {formatDate(entry.archived_at)}
                                            </span>

                                            {entry.interests?.length > 0 && (
                                                <div className="student-panel-tags">
                                                    {entry.interests.map((interest) => (
                                                        <span key={interest}>{interest}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="counselor-archive-stat-line">
                                                {entry.saved_competitions?.length || 0} saved &middot; {entry.guides_done?.length || 0} guides viewed
                                            </p>

                                            {entry.achievements_note && (
                                                <p className="counselor-archive-note">{entry.achievements_note}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </>
                )}

            </div>

            {selectedStudent && (
                <StudentDetailPanel
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    onUnlink={handleUnlink}
                    onArchive={handleArchive}
                />
            )}

            {showAccount && (
                <CounselorAccountModal counselor={counselor} onClose={() => setShowAccount(false)} />
            )}

            <CounselorFooter />

        </main>
    );
}
