import { supabase } from "../supabase";

export async function getUserProfile(userId) {

    const { data, error } = await supabase
        .from("users")
        .select("full_name, school, grade, newsletter_opt_in, counselor_id")
        .eq("id", userId)
        .maybeSingle();

    return { data, error };

}

export async function getUserPreferences(userId) {

    const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    return { data, error };

}

export async function saveUserPreferences(userId, { fullName, school, grade, interests, newsletterOptIn, counselorId } = {}) {

    const profileUpdate = {};
    if (fullName !== undefined) profileUpdate.full_name = fullName || null;
    if (school !== undefined) profileUpdate.school = school || null;
    if (grade !== undefined) profileUpdate.grade = grade || null;
    if (newsletterOptIn !== undefined) profileUpdate.newsletter_opt_in = newsletterOptIn;
    if (counselorId !== undefined) profileUpdate.counselor_id = counselorId || null;

    if (Object.keys(profileUpdate).length > 0) {
        const { error: profileError } = await supabase
            .from("users")
            .update(profileUpdate)
            .eq("id", userId);

        if (profileError) {
            return { error: profileError };
        }
    }

    if (interests !== undefined) {
        const { data, error } = await supabase
            .from("user_preferences")
            .upsert(
                { user_id: userId, interests: interests || [] },
                { onConflict: "user_id" }
            )
            .select()
            .maybeSingle();

        return { data, error };
    }

    return { data: null, error: null };

}
