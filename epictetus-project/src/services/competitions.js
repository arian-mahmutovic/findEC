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
        .select("id, title, slug, summary, order_index, competitions(name, slug)")
        .order("created_at", { ascending: false })
        .limit(limit);

    return {
        data,
        error
    };

}

export async function getArticleBySlug(slug) {

    const { data, error } = await supabase
        .from("guide_articles")
        .select("*, competitions(id, name, slug, category)")
        .eq("slug", slug)
        .maybeSingle();

    return {
        data,
        error
    };

}

export async function getRelatedArticles(competitionId, excludeId, limit = 3) {

    const { data, error } = await supabase
        .from("guide_articles")
        .select("id, title, summary, slug, order_index")
        .eq("competition_id", competitionId)
        .neq("id", excludeId)
        .order("order_index", { ascending: true })
        .limit(limit);

    return {
        data,
        error
    };

}

export async function getGeneralArticles(excludeId, limit = 3) {

    const { data, error } = await supabase
        .from("guide_articles")
        .select("id, title, summary, slug, order_index")
        .is("competition_id", null)
        .neq("id", excludeId)
        .order("order_index", { ascending: true })
        .limit(limit);

    return {
        data,
        error
    };

}