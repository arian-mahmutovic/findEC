import { supabase } from "../supabase";

const SESSION_STARTED_KEY = "epictetus_session_started_at";
const MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function markSessionStart() {
    if (!localStorage.getItem(SESSION_STARTED_KEY)) {
        localStorage.setItem(SESSION_STARTED_KEY, String(Date.now()));
    }
}

function clearSessionStart() {
    localStorage.removeItem(SESSION_STARTED_KEY);
}

export function initSessionTracking() {
    supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN") markSessionStart();
        if (event === "SIGNED_OUT") clearSessionStart();
    });
}

export async function getValidSession() {

    const { data } = await supabase.auth.getSession();

    if (!data.session) return null;

    const startedAt = Number(localStorage.getItem(SESSION_STARTED_KEY));

    if (!startedAt) {
        markSessionStart();
        return data.session;
    }

    if (Date.now() - startedAt > MAX_SESSION_AGE_MS) {
        clearSessionStart();
        await supabase.auth.signOut();
        return null;
    }

    return data.session;

}
