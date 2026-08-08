import { supabase } from "../supabase";


export async function getCompetitions() {

    const { data, error } = await supabase
        .from("competitions")
        .select("*");


    return {
        data,
        error
    };

}

export async function getRecentGuideArticles(limit = 4) {

    const { data, error } = await supabase
        .from("guide_articles")
        .select("id, title, summary, order_index, competitions(name, slug)")
        .order("created_at", { ascending: false })
        .limit(limit);

    return {
        data,
        error
    };

}