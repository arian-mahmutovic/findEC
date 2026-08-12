import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getRoadmapTasks,
    getRoadmapProgress,
    completeTask,
    uncompleteTask,
    clearRoadmapProgress
} from "../services/roadmapProgress";
import { trackEvent } from "../services/analytics";
import RoadmapProgress from "./RoadmapProgress";
import RoadmapItem from "./RoadmapItem";

const COMPLETION_COOLDOWN_MS = 4000;

export default function CompetitionRoadmap({ competitionId, sectionIndex = "02" }) {
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [completedIds, setCompletedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const [cooldownUntil, setCooldownUntil] = useState(0);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);

            const { data: taskData, error: taskError } = await getRoadmapTasks(competitionId);
            if (taskError) console.error(taskError);

            const loadedTasks = taskData || [];
            if (cancelled) return;
            setTasks(loadedTasks);

            if (user && loadedTasks.length > 0) {
                const { data: progressData, error: progressError } = await getRoadmapProgress(
                    user.id,
                    loadedTasks.map((task) => task.id)
                );
                if (progressError) console.error(progressError);

                if (cancelled) return;

                const rows = progressData || [];
                setCompletedIds(new Set(rows.map((row) => row.task_id)));

                // Seed the cooldown from the most recent completion so a page
                // refresh can't be used to bypass the pacing limit.
                const latestCompletedAt = rows.reduce((latest, row) => {
                    const t = new Date(row.completed_at).getTime();
                    return t > latest ? t : latest;
                }, 0);
                if (latestCompletedAt > 0) {
                    setCooldownUntil(latestCompletedAt + COMPLETION_COOLDOWN_MS);
                }
            }

            if (!cancelled) setLoading(false);
        }

        load();

        return () => { cancelled = true; };
    }, [competitionId, user]);

    useEffect(() => {
        if (cooldownUntil <= Date.now()) return;

        const interval = setInterval(() => setNow(Date.now()), 500);
        return () => clearInterval(interval);
    }, [cooldownUntil]);

    async function handleToggle(taskId, nextChecked) {
        if (!user) return;

        if (nextChecked && Date.now() < cooldownUntil) {
            return;
        }

        const task = tasks.find((t) => t.id === taskId);

        setCompletedIds((prev) => {
            const next = new Set(prev);
            if (nextChecked) next.add(taskId); else next.delete(taskId);
            return next;
        });

        if (nextChecked) {
            await completeTask(user.id, taskId);
            setCooldownUntil(Date.now() + COMPLETION_COOLDOWN_MS);

            trackEvent("roadmap_task_completed", {
                userId: user.id,
                competitionId,
                metadata: { task_id: taskId, task_title: task?.title }
            });

            if (completedIds.size + 1 === tasks.length) {
                trackEvent("roadmap_completed", {
                    userId: user.id,
                    competitionId,
                    metadata: { total_tasks: tasks.length }
                });
            }
        } else {
            await uncompleteTask(user.id, taskId);
            trackEvent("roadmap_task_uncompleted", {
                userId: user.id,
                competitionId,
                metadata: { task_id: taskId, task_title: task?.title }
            });
        }
    }

    async function handleClearProgress() {
        if (!user || completedIds.size === 0) return;

        const clearedCount = completedIds.size;
        const taskIds = tasks.map((t) => t.id);

        setCompletedIds(new Set());

        await clearRoadmapProgress(user.id, taskIds);

        trackEvent("roadmap_progress_cleared", {
            userId: user.id,
            competitionId,
            metadata: { cleared_count: clearedCount, total_tasks: tasks.length }
        });
    }

    if (loading || tasks.length === 0) return null;

    const nextTask = tasks.find((task) => !completedIds.has(task.id)) ?? tasks[tasks.length - 1];
    const visibleTasks = expanded ? tasks : [nextTask];
    const cooldownSecondsLeft = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));

    return (
        <section id="roadmap" className="guide-section roadmap-section">
            <div className="section-heading">
                <span className="section-index">{sectionIndex}</span>
                <div>
                    <span className="section-kicker">Your action plan</span>
                    <h2 className="section-title">Your Competition Roadmap</h2>
                </div>
            </div>

            <p className="section-text roadmap-intro">
                Work through this checklist from start to finish&mdash;each task builds toward
                actually competing, and the ones with a guide or video link show you exactly how to do it.
            </p>

            <div className="roadmap-card">
                <RoadmapProgress
                    completed={completedIds.size}
                    total={tasks.length}
                    onClear={handleClearProgress}
                />

                <ol className="roadmap-list" id="roadmap-list">
                    {visibleTasks.map((task) => (
                        <RoadmapItem
                            key={task.id}
                            task={task}
                            completed={completedIds.has(task.id)}
                            onToggle={handleToggle}
                            disabled={!completedIds.has(task.id) && cooldownSecondsLeft > 0}
                        />
                    ))}
                </ol>

                {cooldownSecondsLeft > 0 && (
                    <p className="roadmap-cooldown-note" role="status">
                        Take a moment before your next task&mdash;you can check one off again in {cooldownSecondsLeft}s.
                    </p>
                )}

                {tasks.length > 1 && (
                    <button
                        type="button"
                        className="roadmap-toggle"
                        onClick={() => setExpanded((prev) => !prev)}
                        aria-expanded={expanded}
                        aria-controls="roadmap-list"
                    >
                        {expanded ? "Show less" : `Show all ${tasks.length} tasks`}
                        <span className={`roadmap-toggle-chevron ${expanded ? "is-open" : ""}`} aria-hidden="true">
                            <svg viewBox="0 0 12 12"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>
                        </span>
                    </button>
                )}
            </div>
        </section>
    );
}
