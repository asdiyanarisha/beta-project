import { useNavigate } from 'react-router-dom';
import Card from './Card';
import './TournamentRow.css';

const SPORT_ICONS = {
    football: '⚽',
    basketball: '🏀',
    volleyball: '🏐',
    other: '🏟️'
};

export default function TournamentRow({ tournament, onClick, onMenuClick }) {
    // Calculate progress (Done matches / Total matches)
    const calculateProgress = () => {
        let total = 0;
        let done = 0;

        if (tournament.type === 'league') {
            tournament.rounds.forEach(r => {
                r.matches.forEach(m => {
                    total++;
                    if (m.status === 'done') done++;
                });
            });
        } else if (tournament.type === 'cup') {
            tournament.groups.forEach(g => {
                g.fixtures.forEach(r => {
                    r.matches.forEach(m => {
                        total++;
                        if (m.status === 'done') done++;
                    });
                });
            });
            tournament.bracket.rounds.forEach(r => {
                r.matches.forEach(m => {
                    total++;
                    if (m.status === 'done') done++;
                });
            });
        }

        return total === 0 ? 0 : Math.round((done / total) * 100);
    };

    const progress = calculateProgress();

    return (
        <div className="tournament-row animate-fade-in" onClick={onClick}>
            <div className="tournament-row__icon" title={tournament.sportType}>
                {SPORT_ICONS[tournament.sportType?.toLowerCase()] || '🏟️'}
            </div>

            <div className="tournament-row__info">
                <h3>{tournament.name}</h3>
                <div className="tournament-row__meta">
                    <span className="meta-badge">{tournament.type === 'league' ? 'League' : 'Cup'}</span>
                    <span className="meta-text">
                        {tournament.sportType ? tournament.sportType.charAt(0).toUpperCase() + tournament.sportType.slice(1) : 'Other'}
                    </span>
                </div>
            </div>

            <div className="tournament-row__progress">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="progress-text">{progress}% Completed</span>
            </div>

            <button
                className="tournament-row__menu"
                onClick={(e) => {
                    e.stopPropagation();
                    onMenuClick(tournament);
                }}
            >
                ⋮
            </button>
        </div>
    );
}
