import { supabase } from "../supabase";

export async function getRoadmapTasks(competitionId) {

    const { data, error } = await supabase
        .from("roadmap_tasks")
        .select("*")
        .eq("competition_id", competitionId)
        .order("order_index", { ascending: true });

    return { data, error };

}

export async function getRoadmapProgress(userId, taskIds) {

    if (!taskIds || taskIds.length === 0) {
        return { data: [], error: null };
    }

    const { data, error } = await supabase
        .from("roadmap_progress")
        .select("task_id, completed_at")
        .eq("user_id", userId)
        .in("task_id", taskIds);

    return { data, error };

}

export async function completeTask(userId, taskId) {

    const { data, error } = await supabase
        .from("roadmap_progress")
        .upsert(
            { user_id: userId, task_id: taskId },
            { onConflict: "user_id,task_id" }
        )
        .select()
        .maybeSingle();

    return { data, error };

}

export async function uncompleteTask(userId, taskId) {

    const { error } = await supabase
        .from("roadmap_progress")
        .delete()
        .eq("user_id", userId)
        .eq("task_id", taskId);

    return { error };

}

export async function clearRoadmapProgress(userId, taskIds) {

    if (!taskIds || taskIds.length === 0) {
        return { error: null };
    }

    const { error } = await supabase
        .from("roadmap_progress")
        .delete()
        .eq("user_id", userId)
        .in("task_id", taskIds);

    return { error };

}
