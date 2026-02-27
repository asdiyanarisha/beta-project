import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import TeamInput from '../components/TeamInput';
import { suggestGroupCount } from '../utils/groupDraw';
import './SetupPage.css';

export default function SetupPage({ onGenerate, activeTournament }) {
    const [competitionName, setCompetitionName] = useState('');
    const [sportType, setSportType] = useState('football'); // 'football' | 'basketball' | 'volleyball' | 'other'
    const [mode, setMode] = useState('league'); // 'league' | 'cup'
    const [teamCount, setTeamCount] = useState(4);
    const [teamNames, setTeamNames] = useState(
        Array.from({ length: 4 }, (_, i) => `Team ${i + 1}`)
    );
    const [numGroups, setNumGroups] = useState(2);
    const [qualifiersPerGroup, setQualifiersPerGroup] = useState(2);
    const [doubleRound, setDoubleRound] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleTeamCountChange = (val) => {
        const count = Math.max(2, Math.min(64, parseInt(val) || 2));
        setTeamCount(count);
        setTeamNames((prev) => {
            const newNames = [...prev];
            while (newNames.length < count) {
                newNames.push(`Team ${newNames.length + 1}`);
            }
            return newNames.slice(0, count);
        });
        // Auto-adjust groups
        const groupOptions = suggestGroupCount(count);
        if (!groupOptions.includes(numGroups)) {
            setNumGroups(groupOptions[0]);
        }
    };

    const handleTeamNameChange = (index, name) => {
        setTeamNames((prev) => {
            const updated = [...prev];
            updated[index] = name;
            return updated;
        });
    };

    const handleGenerate = () => {
        // Validate
        const names = teamNames.map((n) => n.trim()).filter(Boolean);
        if (names.length < 2) {
            setError('You need at least 2 teams');
            return;
        }
        const uniqueNames = new Set(names);
        if (uniqueNames.size !== names.length) {
            setError('Team names must be unique');
            return;
        }

        if (mode === 'cup') {
            if (numGroups < 2) {
                setError('Cup mode requires at least 2 groups');
                return;
            }
            if (names.length < numGroups * 2) {
                setError(`Need at least ${numGroups * 2} teams for ${numGroups} groups`);
                return;
            }
        }

        setError('');
        onGenerate({
            competitionName: competitionName.trim() || `${names.length} Teams ${mode === 'league' ? 'League' : 'Cup'}`,
            sportType,
            mode,
            teams: names,
            doubleRound,
            numGroups: mode === 'cup' ? numGroups : undefined,
            qualifiersPerGroup: mode === 'cup' ? qualifiersPerGroup : undefined,
        });

        navigate(mode === 'league' ? '/league' : '/cup');
    };

    const groupOptions = suggestGroupCount(teamCount);
    const teamsPerGroup = Math.ceil(teamCount / numGroups);

    return (
        <div className="setup-page">
            <div className="setup-page__header animate-fade-in-up">
                <div className="setup-page__logo">📊</div>
                <h1>Create Match Drawing</h1>
                <p className="setup-page__subtitle">Clean & modern competition fixture generator</p>
            </div>

            <Card className="setup-page__card" variant="highlight">
                {/* Competition Name */}
                <div className="setup-section">
                    <label className="setup-label">Competition Name</label>
                    <input
                        type="text"
                        className="setup-input"
                        placeholder="e.g. Champions League 2026"
                        value={competitionName}
                        onChange={(e) => setCompetitionName(e.target.value)}
                    />
                </div>

                {/* Sport Type */}
                <div className="setup-section">
                    <label className="setup-label">Sport Type</label>
                    <select
                        className="setup-input"
                        value={sportType}
                        onChange={(e) => setSportType(e.target.value)}
                        style={{ cursor: 'pointer', appearance: 'auto', padding: '12px 20px', fontSize: '1rem' }}
                    >
                        <option value="football">⚽ Football</option>
                        <option value="basketball">🏀 Basketball</option>
                        <option value="volleyball">🏐 Volleyball</option>
                        <option value="other">🏟️ Other</option>
                    </select>
                </div>

                {/* Mode Selection */}
                <div className="setup-section">
                    <label className="setup-label">Tournament Mode</label>
                    <div className="mode-selector">
                        <button
                            className={`mode-option ${mode === 'league' ? 'mode-option--active' : ''}`}
                            onClick={() => setMode('league')}
                        >
                            <span className="mode-option__icon">🔄</span>
                            <span className="mode-option__title">League</span>
                            <span className="mode-option__desc">Round-robin format</span>
                        </button>
                        <button
                            className={`mode-option ${mode === 'cup' ? 'mode-option--active' : ''}`}
                            onClick={() => setMode('cup')}
                        >
                            <span className="mode-option__icon">🎯</span>
                            <span className="mode-option__title">Cup</span>
                            <span className="mode-option__desc">Groups + Knockout</span>
                        </button>
                    </div>
                </div>

                {/* Team Count */}
                <div className="setup-section">
                    <label className="setup-label" htmlFor="team-count">
                        Number of Teams
                    </label>
                    <div className="count-input">
                        <button
                            className="count-btn"
                            onClick={() => handleTeamCountChange(teamCount - 1)}
                            disabled={teamCount <= 2}
                        >
                            −
                        </button>
                        <input
                            id="team-count"
                            type="number"
                            className="count-field"
                            value={teamCount}
                            onChange={(e) => handleTeamCountChange(e.target.value)}
                            min={2}
                            max={64}
                        />
                        <button
                            className="count-btn"
                            onClick={() => handleTeamCountChange(teamCount + 1)}
                            disabled={teamCount >= 64}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* League: Double round option */}
                {mode === 'league' && (
                    <div className="setup-section">
                        <label className="setup-label">Format</label>
                        <div className="toggle-row">
                            <button
                                className={`toggle-option ${!doubleRound ? 'toggle-option--active' : ''}`}
                                onClick={() => setDoubleRound(false)}
                            >
                                Single Round
                            </button>
                            <button
                                className={`toggle-option ${doubleRound ? 'toggle-option--active' : ''}`}
                                onClick={() => setDoubleRound(true)}
                            >
                                Double Round (Home & Away)
                            </button>
                        </div>
                    </div>
                )}

                {/* Cup: Group Settings */}
                {mode === 'cup' && (
                    <>
                        <div className="setup-section">
                            <label className="setup-label">Number of Groups</label>
                            <div className="toggle-row">
                                {groupOptions.map((g) => (
                                    <button
                                        key={g}
                                        className={`toggle-option ${numGroups === g ? 'toggle-option--active' : ''}`}
                                        onClick={() => setNumGroups(g)}
                                    >
                                        {g} Groups
                                    </button>
                                ))}
                            </div>
                            <span className="setup-hint">
                                ~{teamsPerGroup} teams per group
                            </span>
                        </div>
                        <div className="setup-section">
                            <label className="setup-label">Qualifiers per Group</label>
                            <div className="toggle-row">
                                {[1, 2, 3, 4].filter(q => q < teamsPerGroup).map((q) => (
                                    <button
                                        key={q}
                                        className={`toggle-option ${qualifiersPerGroup === q ? 'toggle-option--active' : ''}`}
                                        onClick={() => setQualifiersPerGroup(q)}
                                    >
                                        Top {q}
                                    </button>
                                ))}
                            </div>
                            <span className="setup-hint">
                                {qualifiersPerGroup * numGroups} teams advance to knockout
                            </span>
                        </div>
                    </>
                )}

                {/* Team Names */}
                <div className="setup-section">
                    <label className="setup-label">Team Names</label>
                    <div className="team-list stagger-children">
                        {teamNames.slice(0, teamCount).map((name, i) => (
                            <TeamInput
                                key={i}
                                index={i}
                                name={name}
                                onChange={handleTeamNameChange}
                            />
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && <div className="setup-error">{error}</div>}

                {/* Generate Button */}
                <div className="setup-actions">
                    <Button variant="primary" size="lg" onClick={handleGenerate}>
                        🚀 Generate Draw
                    </Button>
                    {activeTournament && (
                        <Button variant="secondary" size="lg" onClick={() => navigate('/matches')}>
                            📋 View Active Tournament
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
