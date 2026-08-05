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