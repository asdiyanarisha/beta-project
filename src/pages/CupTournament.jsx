import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import MatchCard from '../components/MatchCard';
import { drawGroups } from '../utils/groupDraw';
import { generateKnockoutBracket } from '../utils/knockout';
import './CupTournament.css';

export default function CupTournament({ config, onStart }) {
    const navigate = useNavigate();
    const [drawKey, setDrawKey] = useState(0);
    const [activeTab, setActiveTab] = useState('groups'); // 'groups' | 'knockout'
    const [expandedGroup, setExpandedGroup] = useState(null);

    const { groups, bracket } = useMemo(() => {
        if (!config || !config.teams) return { groups: [], bracket: null };

        const drawnGroups = drawGroups(config.teams, config.numGroups);

        // Generate placeholder knockout bracket with cross-group seeding
        const qualifiersPerGroup = config.qualifiersPerGroup || 2;

        // Build qualified teams per group: [[A1, A2], [B1, B2], ...]
        const qualifiedByGroup = drawnGroups.map((group) => {
            const slots = [];
            for (let q = 0; q < qualifiersPerGroup && q < group.teams.length; q++) {
                slots.push(`${group.name} #${q + 1}`);
            }
            return slots;
        });

        // Cross-group seeding: A1 vs B2, B1 vs A2, C1 vs D2, D1 vs C2, etc.
        const qualifiedTeams = [];
        const numGroups = qualifiedByGroup.length;
        for (let i = 0; i < numGroups; i += 2) {
            const gA = qualifiedByGroup[i];
            const gB = qualifiedByGroup[i + 1] || qualifiedByGroup[i]; // fallback for odd groups
            for (let q = 0; q < qualifiersPerGroup; q++) {
                // Winner of group A vs runner-up of group B, and vice versa
                if (q % 2 === 0) {
                    qualifiedTeams.push(gA[q]);
                    qualifiedTeams.push(gB[qualifiersPerGroup - 1 - q] || gB[0]);
                } else {
                    qualifiedTeams.push(gB[q]);
                    qualifiedTeams.push(gA[qualifiersPerGroup - 1 - q] || gA[0]);
                }
            }
        }

        const knockoutBracket = generateKnockoutBracket(qualifiedTeams);

        return { groups: drawnGroups, bracket: knockoutBracket };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, drawKey]);

    if (!config || !config.teams) {
        navigate('/');
        return null;
    }

    const handleReDraw = () => {
        setDrawKey((k) => k + 1);
        setExpandedGroup(null);
    };

    const handleReset = () => {
        navigate('/');
    };

    const handleStart = () => {
        const tournamentData = {
            id: Date.now(),
            name: config.competitionName || `${config.teams.length} Teams Cup`,
            type: 'cup',
            groups: groups.map(g => ({
                ...g,
                fixtures: g.fixtures.map(f => ({
                    ...f,
                    matches: f.matches.map(m => ({ ...m, status: 'inprogress' }))
                }))
            })),
            bracket: {
                ...bracket,
                rounds: bracket.rounds.map(r => ({
                    ...r,
                    matches: r.matches.map(m => ({ ...m, status: 'inprogress' }))
                }))
            }
        };
        onStart(tournamentData);
        navigate('/matches');
    };

    const toggleGroup = (idx) => {
        setExpandedGroup(expandedGroup === idx ? null : idx);
    };

    return (
        <div className="cup-page" style={{ paddingBottom: '110px' }}>
            <div className="cup-page__header animate-fade-in-up">
                <h1>🎯 Cup Tournament</h1>
                <p className="cup-page__subtitle">
                    {config.teams.length} teams · {config.numGroups} groups · Top {config.qualifiersPerGroup} advance
                </p>
            </div>



            {/* Phase Tabs */}
            <div className="phase-tabs animate-fade-in">
                <button
                    className={`phase-tab ${activeTab === 'groups' ? 'phase-tab--active' : ''}`}
                    onClick={() => setActiveTab('groups')}
                >
                    <span className="phase-tab__icon">📂</span>
                    Group Stage
                </button>
                <button
                    className={`phase-tab ${activeTab === 'knockout' ? 'phase-tab--active' : ''}`}
                    onClick={() => setActiveTab('knockout')}
                >
                    <span className="phase-tab__icon">⚔️</span>
                    Knockout
                </button>
            </div>

            {/* Group Stage */}
            {activeTab === 'groups' && (
                <div className="groups-container stagger-children">
                    {groups.map((group, gIdx) => (
                        <Card key={gIdx} className="group-card" variant="flat">
                            <div
                                className="group-card__header"
                                onClick={() => toggleGroup(gIdx)}
                            >
                                <div className="group-card__title">
                                    <span className="group-card__badge">
                                        {group.name.split(' ')[1]}
                                    </span>
                                    <h3>{group.name}</h3>
                                    <span className="group-card__count">{group.teams.length} teams</span>
                                </div>
                                <span className={`group-card__toggle ${expandedGroup === gIdx ? 'group-card__toggle--open' : ''}`}>
                                    ▼
                                </span>
                            </div>

                            {/* Team List */}
                            <div className="group-card__teams">
                                {group.teams.map((team, tIdx) => (
                                    <div key={tIdx} className="group-team">
                                        <span className="group-team__pos">{tIdx + 1}</span>
                                        <span className="group-team__name">{team}</span>
                                        {tIdx < config.qualifiersPerGroup && (
                                            <span className="group-team__badge">Q</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Group Fixtures */}
                            {expandedGroup === gIdx && (
                                <div className="group-card__fixtures animate-fade-in">
                                    <h4 className="group-fixtures__title">Group Fixtures</h4>
                                    {group.fixtures.map((round) => (
                                        <div key={round.round} className="group-round">
                                            <span className="group-round__label">Matchday {round.round}</span>
                                            <div className="group-round__matches">
                                                {round.matches.map((match, mIdx) => (
                                                    <MatchCard
                                                        key={mIdx}
                                                        home={match.home}
                                                        away={match.away}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Knockout Bracket */}
            {activeTab === 'knockout' && bracket && (
                <div className="bracket-container animate-fade-in">
                    <div className="bracket">
                        {bracket.rounds.map((round, rIdx) => (
                            <div key={rIdx} className="bracket-round">
                                <h4 className="bracket-round__title">{round.name}</h4>
                                <div className="bracket-round__matches">
                                    {round.matches.map((match, mIdx) => (
                                        <div key={mIdx} className="bracket-match">
                                            <div className="bracket-match__connector">
                                                {rIdx > 0 && <div className="bracket-line bracket-line--left" />}
                                                {rIdx < bracket.rounds.length - 1 && <div className="bracket-line bracket-line--right" />}
                                            </div>
                                            <div className="bracket-match__card">
                                                <div className={`bracket-slot ${match.home ? '' : 'bracket-slot--tbd'}`}>
                                                    <span className="bracket-slot__seed">{mIdx * 2 + 1}</span>
                                                    <span className="bracket-slot__name">
                                                        {match.home || 'TBD'}
                                                    </span>
                                                </div>
                                                <div className="bracket-match__divider" />
                                                <div className={`bracket-slot ${match.away ? '' : 'bracket-slot--tbd'}`}>
                                                    <span className="bracket-slot__seed">{mIdx * 2 + 2}</span>
                                                    <span className="bracket-slot__name">
                                                        {match.away || 'BYE'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Trophy */}
                        <div className="bracket-trophy">
                            <div className="bracket-trophy__icon">🏆</div>
                            <span>Champion</span>
                        </div>
                    </div>
                </div>
            )}
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
