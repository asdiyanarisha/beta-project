import { shuffle, generateRoundRobin } from './roundRobin';

/**
 * Draw teams into groups randomly.
 * @param {string[]} teams - Array of team names
 * @param {number} numGroups - Number of groups
 * @returns {Array<{name: string, teams: string[], fixtures: Array}>}
 */
export function drawGroups(teams, numGroups) {
    const shuffled = shuffle(teams);
    const groups = [];

    for (let i = 0; i < numGroups; i++) {
        groups.push({
            name: `Group ${String.fromCharCode(65 + i)}`, // A, B, C, ...
            teams: [],
            fixtures: [],
        });
    }

    // Distribute teams round-robin style into groups
    shuffled.forEach((team, idx) => {
        groups[idx % numGroups].teams.push(team);
    });

    // Generate round-robin fixtures within each group
    groups.forEach((group) => {
        group.fixtures = generateRoundRobin(group.teams);
    });

    return groups;
}

/**
 * Get suggested number of groups based on team count.
 * @param {number} teamCount
 * @returns {number[]} Array of valid group options
 */
export function suggestGroupCount(teamCount) {
    const options = [];
    for (let g = 2; g <= Math.min(teamCount / 2, 8); g++) {
        if (teamCount >= g * 2) {
            options.push(g);
        }
    }
    return options.length > 0 ? options : [2];
}

/**
 * Determine how many teams advance from each group.
 * @param {number} numGroups
 * @param {number} teamsPerGroup
 * @returns {number[]} Options for qualifiers per group
 */
export function suggestQualifiers(numGroups, teamsPerGroup) {
    const options = [];
    for (let q = 1; q <= Math.min(teamsPerGroup - 1, 4); q++) {
        const total = q * numGroups;
        // Must be a power of 2 for clean bracket, or at least >= 2
        if (total >= 2) {
            options.push(q);
        }
    }
    return options.length > 0 ? options : [1];
}
