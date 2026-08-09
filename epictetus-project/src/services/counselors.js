import { supabase } from "../supabase";

const EMAIL_DOMAIN = "portal.epictetusproject.internal";

export function deriveCounselorEmail(accessKey) {

    const normalized = accessKey.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    return `counselor.${normalized}@${EMAIL_DOMAIN}`;

}

export async function counselorLogin(accessKey) {

    const { data, error } =
    await supabase.auth.signInWithPassword({
        email: deriveCounselorEmail(accessKey),
        password: accessKey
    });

    return { data, error };

}

export async function counselorSignOut() {

    const { error } = await supabase.auth.signOut();

    return { error };

}

export async function getCounselorProfile(counselorId) {

    const { data, error } = await supabase
        .from("counselors")
        .select("id, name, school, access_key, created_at")
        .eq("id", counselorId)
        .maybeSingle();

    return { data, error };

}

export async function getCounselorsForSchool(school) {

    if (!school) return { data: [], error: null };

    const { data, error } = await supabase
        .from("counselor_directory")
        .select("id, name, school")
        .eq("school", school)
        .order("name");

    return { data, error };

}

export async function getCounselorById(counselorId) {

    if (!counselorId) return { data: null, error: null };

    const { data, error } = await supabase
        .from("counselor_directory")
        .select("id, name, school")
        .eq("id", counselorId)
        .maybeSingle();

    return { data, error };

}

export async function getRoster(counselorId) {

    const { data, error } = await supabase
        .from("users")
        .select(`
            id,
            full_name,
            school,
            grade,
            created_at,
            user_preferences ( interests ),
            saved_competitions (
                id,
                competition_id,
                created_at,
                competitions ( id, name, slug, category, registration_end_date, prize, description )
            ),
            guide_views (
                competition_id,
                last_viewed_at,
                competitions ( name, category )
            ),
            competition_applications (
                id,
                competition_id,
                applied_at,
                result,
                result_status,
                result_submitted_at,
                competitions ( name, category )
            )
        `)
        .eq("counselor_id", counselorId);

    return { data, error };

}

export async function verifyApplicationResult(applicationId) {

    const { error } = await supabase
        .rpc("verify_application_result", { target_application_id: applicationId });

    return { error };

}

export async function dismissApplicationResult(applicationId) {

    const { error } = await supabase
        .rpc("dismiss_application_result", { target_application_id: applicationId });

    return { error };

}

export async function unlinkStudent(studentId) {

    const { error } = await supabase
        .rpc("unlink_student", { target_student_id: studentId });

    return { error };

}

export async function archiveStudent(counselorId, snapshot) {

    const { data, error } = await supabase
        .from("counselor_archived_students")
        .insert({
            counselor_id: counselorId,
            student_name: snapshot.studentName,
            student_school: snapshot.studentSchool,
            student_grade: snapshot.studentGrade,
            interests: snapshot.interests,
            saved_competitions: snapshot.savedCompetitions,
            guides_done: snapshot.guidesDone,
            achievements_note: snapshot.achievementsNote
        })
        .select()
        .maybeSingle();

    if (error) return { data: null, error };

    const unlinkResult = await unlinkStudent(snapshot.studentId);

    return { data, error: unlinkResult.error };

}

export async function getArchivedStudents(counselorId) {

    const { data, error } = await supabase
        .from("counselor_archived_students")
        .select("*")
        .eq("counselor_id", counselorId)
        .order("archived_at", { ascending: false });

    return { data, error };

}
