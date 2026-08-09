import { supabase } from "../supabase";

const SOURCE_STORAGE_KEY = "epictetus_acquisition_source";

export function getStoredAcquisitionSource() {
    return localStorage.getItem(SOURCE_STORAGE_KEY);
}

export function setStoredAcquisitionSource(source) {
    if (source) localStorage.setItem(SOURCE_STORAGE_KEY, source);
}

export async function trackEvent(eventName, { userId, competitionId, metadata } = {}) {

    const source = getStoredAcquisitionSource();

    const { error } = await supabase
        .from("analytics_events")
        .insert({
            event_name: eventName,
            user_id: userId || null,
            competition_id: competitionId || null,
            source,
            metadata: metadata || null
        });

    if (error) {
        console.error(error);
    }

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", eventName, {
            competition_id: competitionId || undefined,
            source: source || undefined,
            ...metadata
        });
    }

}
