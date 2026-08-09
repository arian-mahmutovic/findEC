import { supabase } from "../supabase";

export async function trackGuideView(userId, competitionId) {

    const { error } = await supabase
        .from("guide_views")
        .upsert(
            { user_id: userId, competition_id: competitionId, last_viewed_at: new Date().toISOString() },
            { onConflict: "user_id,competition_id" }
        );

    return { error };

}
