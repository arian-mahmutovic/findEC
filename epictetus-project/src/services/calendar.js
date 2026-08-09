import dayjs from "dayjs";

function escapeIcsText(text) {
    return String(text || "")
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
}

function buildDescription(competition, registrationLink) {
    const lines = [competition.description || ""];

    if (registrationLink) lines.push(`Register: ${registrationLink}`);
    if (competition.website) lines.push(`Website: ${competition.website}`);

    return lines.filter(Boolean).join("\n\n");
}

export function buildGoogleCalendarUrl(competition, registrationLink) {
    const deadline = dayjs(competition.registration_end_date);
    const start = deadline.format("YYYYMMDD");
    const end = deadline.add(1, "day").format("YYYYMMDD");

    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: `${competition.name} — Registration Deadline`,
        dates: `${start}/${end}`,
        details: buildDescription(competition, registrationLink),
        location: competition.website || registrationLink || ""
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsContent(competition, registrationLink) {
    const deadline = dayjs(competition.registration_end_date);
    const start = deadline.format("YYYYMMDD");
    const end = deadline.add(1, "day").format("YYYYMMDD");
    const stamp = dayjs().format("YYYYMMDDTHHmmss[Z]");
    const uid = `${competition.id}@epictetusproject.com`;

    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Epictetus Project//Competition Deadlines//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:${escapeIcsText(`${competition.name} — Registration Deadline`)}`,
        `DESCRIPTION:${escapeIcsText(buildDescription(competition, registrationLink))}`,
        competition.website ? `LOCATION:${escapeIcsText(competition.website)}` : null,
        "END:VEVENT",
        "END:VCALENDAR"
    ].filter(Boolean);

    return lines.join("\r\n");
}

export function downloadIcsFile(competition, registrationLink) {
    const content = buildIcsContent(competition, registrationLink);
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${competition.slug || "competition"}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
