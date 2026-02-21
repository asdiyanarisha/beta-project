/**
 * Generate a round-robin schedule using the circle method.
 * @param {string[]} teams - Array of team names
 * @param {boolean} doubleRound - If true, generates home & away legs
 * @returns {Array<{round: number, matches: Array<{home: string, away: string}>}>}
 */
export function generateRoundRobin(teams, doubleRound = false) {
  const teamList = [...teams];

  // If odd number of teams, add a BYE
  if (teamList.length % 2 !== 0) {
    teamList.push('BYE');
  }

  const n = teamList.length;
  const rounds = [];
  const fixed = teamList[0];
  const rotating = teamList.slice(1);

  for (let r = 0; r < n - 1; r++) {
    const currentTeams = [fixed, ...rotating];
    const roundMatches = [];

    for (let i = 0; i < n / 2; i++) {
      const home = currentTeams[i];
      const away = currentTeams[n - 1 - i];

      // Skip BYE matches
      if (home === 'BYE' || away === 'BYE') continue;

      // Alternate home/away for fairness
      if (r % 2 === 0) {
        roundMatches.push({ home, away });
      } else {
        roundMatches.push({ home: away, away: home });
      }
    }

    rounds.push({
      round: r + 1,
      matches: roundMatches,
    });

    // Rotate: move last element to front of rotating array
    rotating.unshift(rotating.pop());
  }

  if (doubleRound) {
    const secondLeg = rounds.map((round, idx) => ({
      round: rounds.length + idx + 1,
      matches: round.matches.map((m) => ({
        home: m.away,
        away: m.home,
      })),
    }));
    return [...rounds, ...secondLeg];
  }

  return rounds;
}

/**
 * Shuffle an array (Fisher-Yates)
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
