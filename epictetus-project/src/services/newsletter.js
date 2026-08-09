import { supabase } from "../supabase";

export async function subscribeToNewsletter(email, { userId, source } = {}) {

    // Plain insert, not upsert: under RLS, `ON CONFLICT` requires SELECT
    // visibility into the conflicting row to detect the conflict at all,
    // which anonymous subscribers correctly don't have. A duplicate email
    // (23505) just means they're already subscribed — not a real failure.
    const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, user_id: userId || null, source: source || "unknown" });

    if (error && error.code === "23505") {
        return { error: null };
    }

    return { error };

}

export async function getSubscriptionStatus(userId) {

    const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

    return { data, error };

}

export async function unsubscribeFromNewsletter(userId) {

    const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("user_id", userId);

    return { error };

}
