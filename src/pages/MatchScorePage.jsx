import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import './MatchScorePage.css';

export default function MatchScorePage({ tournaments, onUpdate }) {
    const { tournamentId, phase, idx0, idx1, idx2 } = useParams();
    const navigate = useNavigate();

    const tournament = tournaments.find(t => String(t.id) === tournamentId);

    if (!tournament) {
        return (
            <div className="score-page score-page--error">
                <p>Tournament not found.</p>
                <Button variant="primary" onClick={() => navigate('/matches')}>← Back</Button>
            </div>
        );
    }

    // Resolve match based on phase
    let match = null;
    if (phase === 'league') {
        const rIdx = Number(idx0);
        const mIdx = Number(idx1);
        match = { ...tournament.rounds[rIdx].matches[mIdx], rIdx, mIdx };
    } else if (phase === 'cup-group') {
        const gIdx = Number(idx0);
        const rIdx = Number(idx1);
        const mIdx = Number(idx2);
        match = { ...tournament.groups[gIdx].fixtures[rIdx].matches[mIdx], gIdx, rIdx, mIdx };
    } else if (phase === 'bracket') {
        const rIdx = Number(idx0);
        const mIdx = Number(idx1);
        match = { ...tournament.bracket.rounds[rIdx].matches[mIdx], rIdx, mIdx };
    }

    if (!match) {
        return (
            <div className="score-page score-page--error">
                <p>Match not found.</p>
                <Button variant="primary" onClick={() => navigate('/matches')}>← Back</Button>
            </div>
        );
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [homeScore, setHomeScore] = useState(match.scoreHome ?? '');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [awayScore, setAwayScore] = useState(match.scoreAway ?? '');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState('');

    const handleSave = () => {
        const home = parseInt(homeScore);
        const away = parseInt(awayScore);
        if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
            setError('Please enter valid scores (0 or more).');
            return;
        }
        setError('');

        const nextTournaments = tournaments.map(t => {
            if (String(t.id) !== tournamentId) return t;
            const updated = JSON.parse(JSON.stringify(t)); // deep clone
            if (phase === 'league') {
                const m = updated.rounds[match.rIdx].matches[match.mIdx];
                m.scoreHome = home;
                m.scoreAway = away;
                m.status = 'done';
            } else if (phase === 'cup-group') {
                const m = updated.groups[match.gIdx].fixtures[match.rIdx].matches[match.mIdx];
                m.scoreHome = home;
                m.scoreAway = away;
                m.status = 'done';
            } else if (phase === 'bracket') {
                const m = updated.bracket.rounds[match.rIdx].matches[match.mIdx];
                m.scoreHome = home;
                m.scoreAway = away;
                m.status = 'done';
            }
            return updated;
        });

        onUpdate(nextTournaments);
        navigate('/matches');
    };

    const isDone = match.status === 'done';

    return (
        <div className="score-page">
            <div className="score-page__header animate-fade-in-up">
                <button className="score-back-btn" onClick={() => navigate('/matches')}>
                    ← Back to Dashboard
                </button>
                <h1>Match Score</h1>
                <p className="score-subtitle">
                    {tournament.name}
                    {phase === 'cup-group' && ` · Group ${String.fromCharCode(65 + match.gIdx)}`}
                    {phase === 'bracket' && ` · Knockout`}
                </p>
            </div>

            <Card className="score-card animate-scale-in" variant="highlight">
                {isDone && (
                    <div className="score-done-badge">✅ Match Completed</div>
                )}

                <div className="score-matchup">
                    {/* Home Team */}
                    <div className="score-team score-team--home">
                        <div className="score-team__badge score-team__badge--home">H</div>
                        <div className="score-team__name">{match.home}</div>
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={homeScore}
                            onChange={e => setHomeScore(e.target.value)}
                            className="score-input"
                        />
                    </div>

                    {/* VS */}
                    <div className="score-vs">
                        <span>VS</span>
                        {isDone && (
                            <div className="score-result">
                                {match.scoreHome} – {match.scoreAway}
                            </div>
                        )}
                    </div>

                    {/* Away Team */}
                    <div className="score-team score-team--away">
                        <div className="score-team__badge score-team__badge--away">A</div>
                        <div className="score-team__name">{match.away}</div>
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={awayScore}
                            onChange={e => setAwayScore(e.target.value)}
                            className="score-input"
                        />
                    </div>
                </div>

                {error && <div className="score-error">{error}</div>}

                <div className="score-actions">
                    <Button variant="ghost" onClick={() => navigate('/matches')}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>
                        {isDone ? '✏️ Update Score' : '✅ Save Score'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
