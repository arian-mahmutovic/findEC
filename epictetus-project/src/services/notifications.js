import { supabase } from "../supabase";

export async function getNotificationSubscriptions(userId) {

    const { data, error } = await supabase
        .from("competition_notification_subscriptions")
        .select("competition_id")
        .eq("user_id", userId);

    return { data, error };

}

export async function isSubscribedToDeadlineReminder(userId, competitionId) {

    const { data, error } = await supabase
        .from("competition_notification_subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("competition_id", competitionId)
        .maybeSingle();

    return { subscribed: !!data, error };

}

export async function subscribeToDeadlineReminder(userId, competitionId) {

    const { error } = await supabase
        .from("competition_notification_subscriptions")
        .insert({ user_id: userId, competition_id: competitionId });

    return { error };

}

export async function unsubscribeFromDeadlineReminder(userId, competitionId) {

    const { error } = await supabase
        .from("competition_notification_subscriptions")
        .delete()
        .eq("user_id", userId)
        .eq("competition_id", competitionId);

    return { error };

}
