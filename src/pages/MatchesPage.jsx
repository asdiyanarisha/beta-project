import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import MatchCard from '../components/MatchCard';
import TournamentRow from '../components/TournamentRow';
import './MatchesPage.css';

export default function MatchesPage({ tournaments = [], onUpdate, onReset }) {
    const navigate = useNavigate();
    const [selectedTournamentId, setSelectedTournamentId] = useState(null);

    const tournament = tournaments.find(t => t.id === selectedTournamentId);

    if (tournaments.length === 0) {
        return (
            <div className="matches-page matches-page--empty">
                <Card className="empty-card animate-scale-in">
                    <div className="empty-icon">📅</div>
                    <h2>No active tournaments</h2>
                    <p>Go to the setup page to generate your first competition draw.</p>
                    <Button variant="primary" onClick={() => navigate('/create')}>
                        🚀 Create New Match
                    </Button>
                </Card>
            </div>
        );
    }

    const handleStatusChange = (roundIdx, matchIdx, newStatus, groupIdx = null) => {
        const nextTournaments = tournaments.map(t => {
            if (t.id !== selectedTournamentId) return t;

            const updated = { ...t };
            if (t.type === 'league') {
                updated.rounds[roundIdx].matches[matchIdx].status = newStatus;
            } else if (t.type === 'cup') {
                if (groupIdx !== null) {
                    updated.groups[groupIdx].fixtures[roundIdx].matches[matchIdx].status = newStatus;
                } else {
                    updated.bracket.rounds[roundIdx].matches[matchIdx].status = newStatus;
                }
            }
            return updated;
        });

        onUpdate(nextTournaments);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this tournament?')) {
            onUpdate(tournaments.filter(t => t.id !== id));
            if (selectedTournamentId === id) setSelectedTournamentId(null);
        }
    };

    return (
        <div className="matches-page">
            <div className="matches-header animate-fade-in-up">
                <div className="header-main">
                    <h1>{selectedTournamentId ? `📋 ${tournament?.name}` : '🏟️ Tournament Dashboard'}</h1>
                    {selectedTournamentId && (
                        <span className="type-badge">{tournament?.type === 'league' ? 'League' : 'Cup'}</span>
                    )}
                </div>
                <div className="header-actions">
                    <Button variant="primary" onClick={() => navigate('/create')}>
                        ✨ Create New
                    </Button>
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        🚪 Sign Out
                    </Button>
                </div>
            </div>

            <div className="matches-content">
                {!selectedTournamentId ? (
                    <div className="tournament-list stagger-children">
                        {tournaments.map(t => (
                            <TournamentRow
                                key={t.id}
                                tournament={t}
                                onClick={() => setSelectedTournamentId(t.id)}
                                onMenuClick={() => {
                                    if (window.confirm(`Delete ${t.name}?`)) handleDelete(t.id);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="back-btn"
                            onClick={() => setSelectedTournamentId(null)}
                        >
                            ← Back to List
                        </Button>

                        {tournament.type === 'league' && (
                            <div className="league-management stagger-children">
                                {tournament.rounds.map((round, rIdx) => (
                                    <Card key={rIdx} className="management-card" variant="flat">
                                        <h3 className="section-title">Round {round.round}</h3>
                                        <div className="match-list">
                                            {round.matches.map((match, mIdx) => (
                                                <MatchCard
                                                    key={mIdx}
                                                    home={match.home}
                                                    away={match.away}
                                                    status={match.status}
                                                    onStatusChange={(status) => handleStatusChange(rIdx, mIdx, status)}
                                                />
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {tournament.type === 'cup' && (
                            <div className="cup-management stagger-children">
                                <h2 className="phase-title">📂 Group Stage</h2>
                                {tournament.groups.map((group, gIdx) => (
                                    <Card key={gIdx} className="management-card" variant="flat">
                                        <h3 className="section-title">{group.name}</h3>
                                        {group.fixtures.map((round, rIdx) => (
                                            <div key={rIdx} className="round-section">
                                                <h4 className="round-title">Matchday {round.round}</h4>
                                                <div className="match-list">
                                                    {round.matches.map((match, mIdx) => (
                                                        <MatchCard
                                                            key={mIdx}
                                                            home={match.home}
                                                            away={match.away}
                                                            status={match.status}
                                                            onStatusChange={(status) => handleStatusChange(rIdx, mIdx, status, gIdx)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </Card>
                                ))}

                                <h2 className="phase-title phase-title--knockout">⚔️ Knockout Phase</h2>
                                {tournament.bracket.rounds.map((round, rIdx) => (
                                    <Card key={rIdx} className="management-card" variant="flat">
                                        <h3 className="section-title">{round.name}</h3>
                                        <div className="match-list">
                                            {round.matches.map((match, mIdx) => (
                                                <MatchCard
                                                    key={mIdx}
                                                    home={match.home || 'TBD'}
                                                    away={match.away || 'BYE'}
                                                    status={match.status}
                                                    onStatusChange={(status) => handleStatusChange(rIdx, mIdx, status)}
                                                />
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
