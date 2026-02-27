import './LeagueStandings.css';

function computeStandings(tournament) {
    const teams = {};

    // Init all teams from rounds
    tournament.rounds.forEach(round => {
        round.matches.forEach(match => {
            [match.home, match.away].forEach(name => {
                if (name && !teams[name]) {
                    teams[name] = { name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0, last5: [] };
                }
            });
        });
    });

    // Process matches in order (round by round)
    tournament.rounds.forEach(round => {
        round.matches.forEach(match => {
            if (match.status !== 'done' || match.scoreHome === undefined || match.scoreAway === undefined) return;

            const h = teams[match.home];
            const a = teams[match.away];
            if (!h || !a) return;

            const sh = match.scoreHome;
            const sa = match.scoreAway;

            h.played++;
            a.played++;
            h.gf += sh; h.ga += sa;
            a.gf += sa; a.ga += sh;

            if (sh > sa) { // Home wins
                h.won++; h.pts += 3;
                a.lost++;
                h.last5.push('W'); a.last5.push('L');
            } else if (sh === sa) { // Draw
                h.drawn++; h.pts += 1;
                a.drawn++; a.pts += 1;
                h.last5.push('D'); a.last5.push('D');
            } else { // Away wins
                h.lost++;
                a.won++; a.pts += 3;
                h.last5.push('L'); a.last5.push('W');
            }
        });
    });

    return Object.values(teams).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        const gdA = a.gf - a.ga;
        const gdB = b.gf - b.ga;
        if (gdB !== gdA) return gdB - gdA;
        return b.gf - a.gf;
    });
}

export default function LeagueStandings({ tournament }) {
    const standings = computeStandings(tournament);
    const hasAnyResult = standings.some(t => t.played > 0);

    return (
        <div className="standings animate-fade-in">
            <div className="standings__header">
                <h3 className="standings__title">🏆 Klasemen</h3>
                <span className="standings__sub">{tournament.name}</span>
            </div>

            <div className="standings__table-wrap">
                <table className="standings__table">
                    <thead>
                        <tr>
                            <th className="col-rank">#</th>
                            <th className="col-team">Klub</th>
                            <th title="Total Dimainkan">T</th>
                            <th title="Menang">M</th>
                            <th title="Seri">S</th>
                            <th title="Kalah">K</th>
                            <th title="Goal Masuk">GM</th>
                            <th title="Goal Keluar">GK</th>
                            <th title="Selisih Goal">SG</th>
                            <th className="col-pts" title="Poin">Poin</th>
                            <th className="col-last5">5 Terakhir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((team, idx) => {
                            const gd = team.gf - team.ga;
                            const last5 = team.last5.slice(-5);
                            return (
                                <tr key={team.name} className={idx < 3 ? 'row--top' : ''}>
                                    <td className="col-rank">
                                        <span className={`rank-badge ${idx === 0 ? 'rank--1' : idx === 1 ? 'rank--2' : idx === 2 ? 'rank--3' : ''}`}>
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td className="col-team">
                                        <span className="team-avatar">{team.name.charAt(0).toUpperCase()}</span>
                                        <span className="team-name">{team.name}</span>
                                    </td>
                                    <td>{team.played}</td>
                                    <td>{team.won}</td>
                                    <td>{team.drawn}</td>
                                    <td>{team.lost}</td>
                                    <td>{team.gf}</td>
                                    <td>{team.ga}</td>
                                    <td className={gd > 0 ? 'gd--pos' : gd < 0 ? 'gd--neg' : ''}>
                                        {gd > 0 ? `+${gd}` : gd}
                                    </td>
                                    <td className="col-pts">
                                        <strong>{team.pts}</strong>
                                    </td>
                                    <td className="col-last5">
                                        <div className="last5">
                                            {last5.map((r, i) => (
                                                <span key={i} className={`last5__dot last5__dot--${r.toLowerCase()}`} title={r === 'W' ? 'Menang' : r === 'D' ? 'Seri' : 'Kalah'}>
                                                    {r}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {!hasAnyResult && (
                    <div className="standings__empty">Belum ada match yang selesai. Isi skor match untuk melihat klasemen.</div>
                )}
            </div>
        </div>
    );
}
