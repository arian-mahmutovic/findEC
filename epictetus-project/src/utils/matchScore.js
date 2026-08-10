export function getMatchTier(competition, interests) {

    if (!interests || interests.length === 0) return null;

    const tags = competition.tags || [];
    const tagOverlap = tags.filter((tag) => interests.includes(tag)).length;
    const categoryMatch = interests.includes(competition.category) ? 1 : 0;
    const score = tagOverlap + categoryMatch;

    if (score >= 2) return "Strong Match";
    if (score >= 1) return "Good Match";
    return null;

}

export function getMatchReason(competition, interests) {

    const tags = competition.tags || [];
    const matchedTags = tags.filter((tag) => interests.includes(tag));

    if (competition.category && interests.includes(competition.category)) {
        return `Matches your interest in ${competition.category}`;
    }

    if (matchedTags.length > 0) {
        return `Matches your interest in ${matchedTags[0]}`;
    }

    return null;

}

export function countNewMatches(competitions, interests, excludeIds) {

    if (!interests || interests.length === 0) return 0;

    const excluded = excludeIds instanceof Set ? excludeIds : new Set(excludeIds || []);

    return competitions.filter((competition) =>
        !excluded.has(competition.id) && getMatchTier(competition, interests) !== null
    ).length;

}
