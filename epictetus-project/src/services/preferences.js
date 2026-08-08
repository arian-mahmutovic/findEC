import { supabase } from "../supabase";

export async function getUserProfile(userId) {

    const { data, error } = await supabase
        .from("users")
        .select("full_name, school, grade")
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

export async function saveUserPreferences(userId, { school, grade, interests }) {

    const { error: profileError } = await supabase
        .from("users")
        .update({
            school: school || null,
            grade: grade || null
        })
        .eq("id", userId);

    if (profileError) {
        return { error: profileError };
    }

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
