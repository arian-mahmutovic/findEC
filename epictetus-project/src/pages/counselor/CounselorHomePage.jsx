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
    counselorSignOut,
    verifyApplicationResult,
    dismissApplicationResult
} from "../../services/counselors";
import { getCompetitions } from "../../services/competitions";
import { countNewMatches } from "../../utils/matchScore";
import StudentDetailPanel from "./StudentDetailPanel";
import CounselorAccountModal from "./CounselorAccountModal";
import ParticleBackground from "../../components/ParticleBackground";
import CounselorFooter from "../../components/CounselorFooter";
import ThemeToggle from "../../components/ThemeToggle";
import { formatDate } from "../../utils/dates";
import { COUNSELOR_ARTICLES } from "./counselorArticles";

const SUGGESTION_WINDOW_DAYS = 21;
const ATTENTION_DEADLINE_WINDOW_DAYS = 7;
const INACTIVITY_WINDOW_DAYS = 30;
const WIN_RESULTS = new Set(["winner", "finalist"]);
const RESULT_LABELS = {
    participated: "Participated",
    finalist: "Finalist",
    winner: "Winner",
    didnt_advance: "Didn't advance",
    didnt_participate: "Didn't participate",
    prefer_not_to_say: "Prefer not to say"
};

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

function AttentionIcon({ type }) {
    if (type === "deadline") {
        return (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    if (type === "inactive") {
        return (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="m12 3 1.8 4.9L19 9.5l-4.5 3 1.3 5.1L12 15l-3.8 2.6 1.3-5.1L5 9.5l5.2-1.6Z" fill="currentColor" />
        </svg>
    );
}

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

    const applications = (row.competition_applications || [])
        .filter((app) => app.competitions && app.applied_at)
        .map((app) => ({
            id: app.id,
            competitionId: app.competition_id,
            name: app.competitions.name,
            appliedAt: app.applied_at
        }));

    const reportedResults = (row.competition_applications || [])
        .filter((app) => app.competitions && app.result)
        .map((app) => ({
            id: app.id,
            competitionId: app.competition_id,
            name: app.competitions.name,
            category: app.competitions.category,
            result: app.result,
            resultStatus: app.result_status,
            submittedAt: app.result_submitted_at
        }));

    const activityTimestamps = [
        ...(row.saved_competitions || []).map((sc) => sc.created_at),
        ...(row.guide_views || []).map((gv) => gv.last_viewed_at),
        ...applications.map((app) => app.appliedAt),
        ...reportedResults.map((r) => r.submittedAt)
    ].filter(Boolean).sort();

    return {
        id: row.id,
        name: row.full_name || "Unnamed student",
        email: row.email || null,
        grade: row.grade || null,
        gradeLabel: formatGrade(row.grade),
        school: row.school,
        interests: prefs?.interests || [],
        savedCompetitions,
        guidesDone,
        applications,
        reportedResults,
        lastActive: activityTimestamps.length ? activityTimestamps[activityTimestamps.length - 1] : null
    };
}

export default function CounselorHomePage() {
    const navigate = useNavigate();
    const { counselor } = useCounselorAuth();

    const [students, setStudents] = useState([]);
    const [allCompetitions, setAllCompetitions] = useState([]);
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
        const [rosterResult, competitionsResult] = await Promise.all([
            getRoster(counselor.id),
            getCompetitions()
        ]);
        setStudents((rosterResult.data || []).map(mapStudentRow));
        setAllCompetitions(competitionsResult.data || []);
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

    async function handleVerifyResult(applicationId) {
        await verifyApplicationResult(applicationId);
        await refreshSelectedStudentResults();
    }

    async function handleDismissResult(applicationId) {
        await dismissApplicationResult(applicationId);
        await refreshSelectedStudentResults();
    }

    async function refreshSelectedStudentResults() {
        const result = await getRoster(counselor.id);
        const mapped = (result.data || []).map(mapStudentRow);
        setStudents(mapped);
        setSelectedStudent((current) => current && mapped.find((s) => s.id === current.id));
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

    const engagementPct = stats.total > 0 ? Math.round((stats.activeThisWeek / stats.total) * 100) : 0;

    const categoryBreakdown = useMemo(() => {
        const counts = new Map();
        students.forEach((s) => s.savedCompetitions.forEach((c) => {
            if (!c.category) return;
            counts.set(c.category, (counts.get(c.category) || 0) + 1);
        }));
        const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
        const max = entries.length ? entries[0][1] : 0;
        return { entries, max };
    }, [students]);

    const outcomeFunnel = useMemo(() => {
        const applied = students.reduce((sum, s) => sum + s.applications.length, 0);
        const resulted = students.reduce((sum, s) => sum + s.reportedResults.length, 0);
        const saved = stats.totalSaved;
        return { saved, applied, resulted, max: Math.max(saved, 1) };
    }, [students, stats.totalSaved]);

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

    const weekInReview = useMemo(() => {
        const weekAgo = dayjs().subtract(7, "day");
        const isRecent = (timestamp) => timestamp && dayjs(timestamp).isAfter(weekAgo);

        const newSaves = students.reduce(
            (sum, s) => sum + s.savedCompetitions.filter((c) => isRecent(c.savedAt)).length, 0
        );
        const newApplications = students.reduce(
            (sum, s) => sum + s.applications.filter((a) => isRecent(a.appliedAt)).length, 0
        );
        const newResults = students.reduce(
            (sum, s) => sum + s.reportedResults.filter((r) => isRecent(r.submittedAt)).length, 0
        );

        const parts = [];
        if (newSaves > 0) parts.push(`${newSaves} new competition${newSaves === 1 ? "" : "s"} saved`);
        if (newApplications > 0) parts.push(`${newApplications} application${newApplications === 1 ? "" : "s"} confirmed`);
        if (newResults > 0) parts.push(`${newResults} result${newResults === 1 ? "" : "s"} reported`);

        return parts;
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

    const attentionQueue = useMemo(() => {
        const now = dayjs();

        const items = students.map((student) => {
            const savedIds = student.savedCompetitions.map((c) => c.competitionId);

            const upcomingDeadline = student.savedCompetitions
                .filter((c) => c.deadline)
                .map((c) => ({ ...c, daysLeft: dayjs(c.deadline).diff(now, "day") }))
                .filter((c) => c.daysLeft >= 0 && c.daysLeft <= ATTENTION_DEADLINE_WINDOW_DAYS)
                .sort((a, b) => a.daysLeft - b.daysLeft)[0];

            if (upcomingDeadline) {
                return {
                    student,
                    priority: 0,
                    type: "deadline",
                    reason: `${upcomingDeadline.name} deadline in ${upcomingDeadline.daysLeft} day${upcomingDeadline.daysLeft === 1 ? "" : "s"}`,
                    context: `Deadline ${formatDate(upcomingDeadline.deadline)}`
                };
            }

            const isInactive = !student.lastActive || dayjs(student.lastActive).isBefore(now.subtract(INACTIVITY_WINDOW_DAYS, "day"));

            if (isInactive) {
                return {
                    student,
                    priority: 1,
                    type: "inactive",
                    reason: student.savedCompetitions.length === 0
                        ? "Hasn't saved any competitions yet"
                        : `No activity in over ${INACTIVITY_WINDOW_DAYS} days`,
                    context: null
                };
            }

            const newMatches = countNewMatches(allCompetitions, student.interests, savedIds);

            if (newMatches > 0) {
                return {
                    student,
                    priority: 2,
                    type: "match",
                    reason: `${newMatches} new matching opportunit${newMatches === 1 ? "y" : "ies"} found`,
                    context: null
                };
            }

            return null;
        }).filter(Boolean);

        return items
            .sort((a, b) => a.priority - b.priority)
            .slice(0, 6);
    }, [students, allCompetitions]);

    const attentionStudentIds = useMemo(
        () => new Set(attentionQueue.map((item) => item.student.id)),
        [attentionQueue]
    );

    const wins = useMemo(() => {
        return students
            .flatMap((student) => student.reportedResults
                .filter((r) => WIN_RESULTS.has(r.result))
                .map((r) => ({ ...r, studentName: student.name })))
            .sort((a, b) => dayjs(b.submittedAt).diff(dayjs(a.submittedAt)))
            .slice(0, 4);
    }, [students]);

    function buildReminderMailto(item) {
        const firstName = item.student.name.split(" ")[0];
        const subject = `Checking in — ${item.reason}`;
        const body = `Hi ${firstName},\n\nJust checking in — ${item.reason.charAt(0).toLowerCase() + item.reason.slice(1)}. Let me know if you want to talk through next steps.\n\n${counselor.name}`;
        return `mailto:${item.student.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

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
                    <Link to="/counselor/competitions" className="counselor-nav-link">Competitions</Link>
                    <ThemeToggle className="counselor-theme-toggle" />
                    <button type="button" onClick={() => setShowAccount(true)}>My Account</button>
                    <button type="button" onClick={handleSignOut}>Sign out</button>
                </div>

            </nav>

            <div className="counselor-content">

                <header className="counselor-page-header">
                    <h1>{getGreeting()}, {counselor.name.split(" ")[0]}.</h1>
                    <p>
                        {attentionQueue.length > 0
                            ? `${attentionQueue.length} student${attentionQueue.length === 1 ? "" : "s"} need${attentionQueue.length === 1 ? "s" : ""} your attention this week.`
                            : `You're caught up — nothing needs your attention today.`}
                    </p>
                </header>

                {loading ? (
                    <div className="counselor-loading">
                        <span className="counselor-loading-dot" />
                    </div>
                ) : (
                    <>

                        <section className="counselor-panel-card counselor-attention">
                            <h2>Needs Your Attention</h2>

                            {attentionQueue.length === 0 ? (
                                <p className="counselor-empty-inline">You&rsquo;re caught up. Nothing requires action today.</p>
                            ) : (
                                <div className="attention-grid">
                                    {attentionQueue.map((item) => (
                                        <div key={item.student.id} className={`attention-card attention-card-${item.type}`}>
                                            <button
                                                type="button"
                                                className="attention-card-main"
                                                onClick={() => setSelectedStudent(item.student)}
                                            >
                                                <span className="attention-card-icon">
                                                    <AttentionIcon type={item.type} />
                                                </span>
                                                <span className="attention-card-body">
                                                    <strong>{item.student.name}</strong>
                                                    <span>{item.reason}</span>
                                                </span>
                                            </button>
                                            {item.student.email ? (
                                                <a
                                                    href={buildReminderMailto(item)}
                                                    className="attention-card-reminder"
                                                >
                                                    Email {item.student.email}
                                                </a>
                                            ) : (
                                                <span className="attention-card-reminder is-disabled">
                                                    No email on file
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {wins.length > 0 && (
                            <section className="counselor-panel-card counselor-wins">
                                <h2>Wins</h2>
                                <ul className="wins-list">
                                    {wins.map((win) => (
                                        <li key={win.id}>
                                            <strong>{win.studentName}</strong> — {RESULT_LABELS[win.result] || win.result} at {win.name}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {weekInReview.length > 0 && (
                            <section className="counselor-panel-card counselor-week">
                                <h2>This Week</h2>
                                <p className="counselor-week-line">{weekInReview.join(" · ")}</p>
                            </section>
                        )}

                        <section className="counselor-impact">
                            <h2>Your Impact</h2>
                            <p className="counselor-impact-subhead">What Epictetus has actually done for your students.</p>

                            <div className="impact-grid">

                                <div className="impact-card impact-card-ring">
                                    <svg viewBox="0 0 100 100" width="112" height="112" className="impact-ring">
                                        <defs>
                                            <linearGradient id="impactRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="var(--accent)" />
                                                <stop offset="100%" stopColor="var(--accent-hover)" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                                        <circle
                                            cx="50" cy="50" r="40" fill="none" stroke="url(#impactRingGradient)" strokeWidth="8"
                                            strokeDasharray={2 * Math.PI * 40}
                                            strokeDashoffset={2 * Math.PI * 40 * (1 - engagementPct / 100)}
                                            strokeLinecap="round"
                                            transform="rotate(-90 50 50)"
                                            className="impact-ring-fill"
                                        />
                                        <text
                                            x="50" y="50" textAnchor="middle" dominantBaseline="central"
                                            fontSize="22" fontWeight="800" fill="var(--text)"
                                        >
                                            {engagementPct}%
                                        </text>
                                    </svg>
                                    <p>{stats.activeThisWeek} of {stats.total} students active this week</p>
                                </div>

                                <div className="impact-card">
                                    <h3>
                                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                                            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                                            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                                            <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8Z" fill="currentColor" />
                                        </svg>
                                        What They&rsquo;re Pursuing
                                    </h3>
                                    {categoryBreakdown.entries.length === 0 ? (
                                        <p className="counselor-empty-inline">No saved competitions yet.</p>
                                    ) : (
                                        <div className="impact-bars">
                                            {categoryBreakdown.entries.map(([category, count]) => (
                                                <div className="impact-bar-row" key={category}>
                                                    <span className="impact-bar-label">{category}</span>
                                                    <div className="impact-bar-track">
                                                        <div
                                                            className="impact-bar-fill"
                                                            style={{ width: `${(count / categoryBreakdown.max) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="impact-bar-value">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="impact-card">
                                    <h3>
                                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                                            <path d="M4 16 9.5 9l4 4.5L20 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14.5 6H20v5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        From Saved to Result
                                    </h3>
                                    <div className="impact-bars">
                                        <div className="impact-bar-row">
                                            <span className="impact-bar-label">Saved</span>
                                            <div className="impact-bar-track">
                                                <div className="impact-bar-fill" style={{ width: "100%" }} />
                                            </div>
                                            <span className="impact-bar-value">{outcomeFunnel.saved}</span>
                                        </div>
                                        <div className="impact-bar-row">
                                            <span className="impact-bar-label">Applied</span>
                                            <div className="impact-bar-track">
                                                <div
                                                    className="impact-bar-fill"
                                                    style={{ width: `${(outcomeFunnel.applied / outcomeFunnel.max) * 100}%` }}
                                                />
                                            </div>
                                            <span className="impact-bar-value">{outcomeFunnel.applied}</span>
                                        </div>
                                        <div className="impact-bar-row">
                                            <span className="impact-bar-label">Result</span>
                                            <div className="impact-bar-track">
                                                <div
                                                    className="impact-bar-fill"
                                                    style={{ width: `${(outcomeFunnel.resulted / outcomeFunnel.max) * 100}%` }}
                                                />
                                            </div>
                                            <span className="impact-bar-value">{outcomeFunnel.resulted}</span>
                                        </div>
                                    </div>
                                </div>

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
                                            <span className="counselor-table-name">
                                                {attentionStudentIds.has(student.id) && (
                                                    <span className="counselor-table-flag" title="Needs attention" aria-hidden="true" />
                                                )}
                                                {student.name}
                                            </span>
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

                            <div className="counselor-panel-card counselor-insights-full">
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

                        <details className="counselor-panel-card counselor-tips-collapsible">
                            <summary>Tips &amp; Why This Matters</summary>

                            <div className="counselor-tips-collapsible-body">

                                <h3>How to use this page</h3>
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

                                <h3>Why this matters for you</h3>
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

                            </div>
                        </details>

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
                    onVerifyResult={handleVerifyResult}
                    onDismissResult={handleDismissResult}
                />
            )}

            {showAccount && (
                <CounselorAccountModal counselor={counselor} onClose={() => setShowAccount(false)} />
            )}

            <CounselorFooter />

        </main>
    );
}
