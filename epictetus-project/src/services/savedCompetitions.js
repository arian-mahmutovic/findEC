import { supabase } from "../supabase";

export async function getSavedCompetitions(userId) {

    const { data, error } = await supabase
        .from("saved_competitions")
        .select("id, competition_id, competitions(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    return { data, error };

}

export async function saveCompetition(userId, competitionId) {

    const { data, error } = await supabase
        .from("saved_competitions")
        .upsert(
            { user_id: userId, competition_id: competitionId },
            { onConflict: "user_id,competition_id" }
        )
        .select()
        .maybeSingle();

    return { data, error };

}

export async function unsaveCompetition(userId, competitionId) {

    const { error } = await supabase
        .from("saved_competitions")
        .delete()
        .eq("user_id", userId)
        .eq("competition_id", competitionId);

    return { error };

}
