import { supabase } from "../supabase";


export async function signup(name, email, password) {

    const { data, error } =
    await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name
            }
        }
    });

    return {
        data,
        error
    };

}

export async function login(email, password) {

    const { data, error } =
    await supabase.auth.signInWithPassword({
        email,
        password
    });

    return {
        data,
        error
    };

}

export async function loginWithGoogle() {

    const { data, error } =
    await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/home`
        }
    });

    return {
        data,
        error
    };

}

export async function getCurrentUser() {

    const { data, error } =
    await supabase.auth.getUser();

    return {
        data,
        error
    };

}

export async function sendPasswordReset(email) {

    const { data, error } =
    await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
    });

    return {
        data,
        error
    };

}

export async function updatePassword(password) {

    const { data, error } =
    await supabase.auth.updateUser({ password });

    return {
        data,
        error
    };

}

export async function signOut() {

    const { error } =
    await supabase.auth.signOut();

    return { error };

}
