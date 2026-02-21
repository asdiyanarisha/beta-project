/**
 * Build a single-elimination knockout bracket.
 * @param {string[]} teams - Teams that qualified (ordered by seeding)
 * @returns {{ rounds: Array<{name: string, matches: Array<{home: string, away: string|null}>}>, totalRounds: number }}
 */
export function generateKnockoutBracket(teams) {
    const teamList = [...teams];

    // Pad to next power of 2 with BYEs
    const nextPow2 = Math.pow(2, Math.ceil(Math.log2(teamList.length)));
    while (teamList.length < nextPow2) {
        teamList.push(null); // BYE slot
    }

    const rounds = [];
    const totalRounds = Math.log2(nextPow2);

    // Round names
    const roundNames = getRoundNames(totalRounds);

    // First round matchups
    const firstRoundMatches = [];
    for (let i = 0; i < teamList.length; i += 2) {
        firstRoundMatches.push({
            id: `r1-m${i / 2}`,
            home: teamList[i],
            away: teamList[i + 1],
            winner: null,
        });
    }

    rounds.push({
        name: roundNames[0],
        matches: firstRoundMatches,
    });

    // Subsequent rounds: empty slots (TBD)
    let prevMatchCount = firstRoundMatches.length;
    for (let r = 1; r < totalRounds; r++) {
        const matchCount = prevMatchCount / 2;
        const matches = [];
        for (let m = 0; m < matchCount; m++) {
            matches.push({
                id: `r${r + 1}-m${m}`,
                home: null,
                away: null,
                winner: null,
                sourceHome: `r${r}-m${m * 2}`,
                sourceAway: `r${r}-m${m * 2 + 1}`,
            });
        }
        rounds.push({
            name: roundNames[r],
            matches,
        });
        prevMatchCount = matchCount;
    }

    return { rounds, totalRounds };
}

/**
 * Get descriptive round names.
 */
function getRoundNames(totalRounds) {
    const names = [];
    for (let i = 0; i < totalRounds; i++) {
        const remaining = totalRounds - i;
        if (remaining === 1) names.push('Final');
        else if (remaining === 2) names.push('Semi-Final');
        else if (remaining === 3) names.push('Quarter-Final');
        else names.push(`Round of ${Math.pow(2, remaining)}`);
    }
    return names;
}

/**
 * Get the number of teams needed for a clean bracket from groups.
 */
export function getCleanBracketSize(qualifiedCount) {
    return Math.pow(2, Math.ceil(Math.log2(qualifiedCount)));
}
