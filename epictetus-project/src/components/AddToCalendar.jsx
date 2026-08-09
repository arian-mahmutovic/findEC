import { buildGoogleCalendarUrl, downloadIcsFile } from "../services/calendar";
import { trackEvent } from "../services/analytics";
import { useAuth } from "../context/AuthContext";

export default function AddToCalendar({ competition, registrationLink }) {
    const { user } = useAuth();

    if (!competition?.registration_end_date) return null;

    function handleGoogleClick() {
        trackEvent("calendar_added", {
            userId: user?.id,
            competitionId: competition.id,
            metadata: { provider: "google" }
        });
    }

    function handleAppleClick() {
        downloadIcsFile(competition, registrationLink);
        trackEvent("calendar_added", {
            userId: user?.id,
            competitionId: competition.id,
            metadata: { provider: "apple" }
        });
    }

    return (
        <div className="calendar-actions">
            <a
                href={buildGoogleCalendarUrl(competition, registrationLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-button"
                onClick={handleGoogleClick}
            >
                + Google Cal
            </a>
            <button type="button" className="calendar-button" onClick={handleAppleClick}>
                + Apple Cal
            </button>
        </div>
    );
}
