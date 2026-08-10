import dayjs from "dayjs";
import { supabase } from "../supabase";

const PROMPT_THROTTLE_DAYS = 3;
const REMINDER_DELAY_DAYS = 1;

const REMINDER_COMPETITION_FIELDS = "id, name, slug, registration_end_date, active_end_date";

export async function trackRegistrationClick(userId, competitionId) {

    const { error } = await supabase
        .from("registration_clicks")
        .upsert(
            { user_id: userId, competition_id: competitionId, clicked_at: new Date().toISOString() },
            { onConflict: "user_id,competition_id" }
        );

    return { error };

}

export async function confirmApplication(competitionId) {

    const { error } = await supabase.rpc("confirm_application", { target_competition_id: competitionId });

    return { error };

}

export async function submitApplicationResult(competitionId, result) {

    const { error } = await supabase.rpc("submit_application_result", {
        target_competition_id: competitionId,
        result_value: result
    });

    return { error };

}

export async function requestResultReview(competitionId) {

    const { error } = await supabase.rpc("request_result_review", { target_competition_id: competitionId });

    return { error };

}

export async function snoozeApplicationReminder(userId, competitionId) {

    const { error } = await supabase
        .from("registration_clicks")
        .update({ last_prompted_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("competition_id", competitionId);

    return { error };

}

export async function getProgressCounts(userId) {

    const [registeredResult, appliedResult, resultedResult] = await Promise.all([
        supabase
            .from("registration_clicks")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId),
        supabase
            .from("competition_applications")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .not("applied_at", "is", null),
        supabase
            .from("competition_applications")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .not("result", "is", null)
    ]);

    return {
        registered: registeredResult.count || 0,
        applied: appliedResult.count || 0,
        resulted: resultedResult.count || 0
    };

}

export async function getStudentReminders(userId) {

    const [clicksResult, applicationsResult] = await Promise.all([
        supabase
            .from("registration_clicks")
            .select(`competition_id, clicked_at, last_prompted_at, competitions ( ${REMINDER_COMPETITION_FIELDS} )`)
            .eq("user_id", userId),
        supabase
            .from("competition_applications")
            .select(`id, competition_id, applied_at, result, result_status, competitions ( ${REMINDER_COMPETITION_FIELDS} )`)
            .eq("user_id", userId)
    ]);

    const clicks = clicksResult.data || [];
    const applications = applicationsResult.data || [];
    const applicationsByCompetition = new Map(applications.map((a) => [a.competition_id, a]));

    const now = dayjs();

    const dismissed = applications.find((a) => a.result_status === "dismissed" && a.competitions);
    if (dismissed) {
        return { type: "result_dismissed", competition: dismissed.competitions, application: dismissed };
    }

    const awaitingResult = applications.find((a) => {
        if (!a.competitions || !a.applied_at || a.result) return false;
        const endDate = a.competitions.active_end_date || a.competitions.registration_end_date;
        return endDate && dayjs(endDate).isBefore(now);
    });
    if (awaitingResult) {
        return { type: "result_prompt", competition: awaitingResult.competitions, application: awaitingResult };
    }

    const awaitingApplication = clicks.find((c) => {
        if (!c.competitions) return false;
        if (applicationsByCompetition.get(c.competition_id)?.applied_at) return false;
        if (!dayjs(c.clicked_at).isBefore(now.subtract(REMINDER_DELAY_DAYS, "day"))) return false;
        if (c.last_prompted_at && !dayjs(c.last_prompted_at).isBefore(now.subtract(PROMPT_THROTTLE_DAYS, "day"))) return false;
        return true;
    });
    if (awaitingApplication) {
        return { type: "application_prompt", competition: awaitingApplication.competitions, click: awaitingApplication };
    }

    return null;

}
