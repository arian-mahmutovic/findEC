import { supabase } from "../supabase";

export async function resolveTrackableLink(slug) {

    const { data, error } = await supabase
        .from("trackable_links")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    return { data, error };

}

export async function getAllTrackableLinks() {

    const { data, error } = await supabase
        .from("trackable_links")
        .select("*")
        .order("created_at", { ascending: true });

    return { data, error };

}
