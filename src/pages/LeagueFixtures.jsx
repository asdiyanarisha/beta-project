import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import MatchCard from '../components/MatchCard';
import { generateRoundRobin, shuffle } from '../utils/roundRobin';
import './LeagueFixtures.css';

export default function LeagueFixtures({ config, onStart }) {
    const navigate = useNavigate();
    const [activeRound, setActiveRound] = useState(0);
    const [drawKey, setDrawKey] = useState(0); // force re-draw

    const fixtures = useMemo(() => {
        if (!config || !config.teams) return [];
        const shuffled = shuffle(config.teams);
        return generateRoundRobin(shuffled, config.doubleRound);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, drawKey]);

    if (!config || !config.teams) {
        navigate('/');
        return null;
    }

    const handleReDraw = () => {
        setDrawKey((k) => k + 1);
        setActiveRound(0);
    };

    const handleReset = () => {
        navigate('/');
    };

    const handleStart = () => {
        const tournamentData = {
            id: Date.now(),
            name: config.competitionName || `${config.teams.length} Teams League`,
            type: 'league',
            rounds: fixtures.map(round => ({
                ...round,
                matches: round.matches.map(m => ({ ...m, status: 'inprogress' }))
            }))
        };
        onStart(tournamentData);
        navigate('/matches');
    };

    const totalMatches = fixtures.reduce((sum, r) => sum + r.matches.length, 0);

    let matchCounter = 0;

    return (
        <div className="league-page" style={{ paddingBottom: '110px' }}>
            <div className="league-page__header animate-fade-in-up">
                <h1>🔄 League Fixtures</h1>
                <p className="league-page__subtitle">
                    {config.teams.length} teams · {fixtures.length} rounds · {totalMatches} matches
                    {config.doubleRound && ' · Double Round-Robin'}
                </p>
            </div>



            {/* Round Tabs */}
            <div className="round-tabs animate-fade-in">
                <button
                    className={`round-tab ${activeRound === -1 ? 'round-tab--active' : ''}`}
                    onClick={() => setActiveRound(-1)}
                >
                    All
                </button>
                {fixtures.map((round, i) => (
                    <button
                        key={i}
                        className={`round-tab ${activeRound === i ? 'round-tab--active' : ''}`}
                        onClick={() => setActiveRound(i)}
                    >
                        R{round.round}
                    </button>
                ))}
            </div>

            {/* Fixtures */}
            <div className="league-fixtures">
                {(activeRound === -1 ? fixtures : [fixtures[activeRound]]).map((round) => {
                    return (
                        <Card key={round.round} className="round-card" variant="flat">
                            <h3 className="round-card__title">
                                <span className="round-card__badge">R{round.round}</span>
                                Round {round.round}
                            </h3>
                            <div className="round-card__matches stagger-children">
                                {round.matches.map((match, mIdx) => {
                                    matchCounter++;
                                    return (
                                        <MatchCard
                                            key={mIdx}
                                            home={match.home}
                                            away={match.away}
                                            matchNumber={activeRound === -1 ? matchCounter : mIdx + 1}
                                        />
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Floating Bottom Drawer */}
            <div className="bottom-drawer animate-fade-in">
                <div className="bottom-drawer__inner">
                    <div className="btn-cancel">
                        <Button variant="ghost" onClick={() => navigate('/create')} style={{ width: '100%' }}>
                            ✕ Cancel
                        </Button>
                    </div>
                    <div className="btn-start">
                        <Button variant="primary" onClick={handleStart} style={{ width: '100%' }}>
                            🚀 Start Tournament
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
