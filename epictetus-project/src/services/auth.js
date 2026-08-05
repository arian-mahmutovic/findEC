import { supabase } from "../supabase";


export async function signup(email, password){

    const {data, error} =
    await supabase.auth.signUp({
        email,
        password
    });


    return {
        data,
        error
    };

}