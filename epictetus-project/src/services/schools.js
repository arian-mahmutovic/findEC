import { supabase } from "../supabase";

export async function searchSchools(query, limit = 8) {

    const trimmed = query.trim();
    if (trimmed.length < 2) return { data: [], error: null };

    const { data, error } = await supabase
        .from("schools")
        .select("id, name, city, state")
        .ilike("name", `%${trimmed}%`)
        .order("name")
        .limit(limit);

    return { data: data || [], error };

}

export async function schoolExists(name) {

    if (!name) return false;

    const { data } = await supabase
        .from("schools")
        .select("id")
        .ilike("name", name)
        .limit(1)
        .maybeSingle();

    return !!data;

}
