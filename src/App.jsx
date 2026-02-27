import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SetupPage from './pages/SetupPage';
import LeagueFixtures from './pages/LeagueFixtures';
import CupTournament from './pages/CupTournament';
import MatchesPage from './pages/MatchesPage';
import LandingPage from './pages/LandingPage';
import MatchScorePage from './pages/MatchScorePage';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

export default function App() {
  const [config, setConfig, clearConfig] = useLocalStorage('match-draw-config', null);
  const [tournaments, setTournaments, clearTournaments] = useLocalStorage('tournaments', []);

  const handleGenerate = (newConfig) => {
    setConfig(newConfig);
  };

  const handleStartTournament = (tournamentData) => {
    setTournaments((prev) => [...prev, {
      ...tournamentData,
      sportType: tournamentData.sportType || config?.sportType || 'other'
    }]);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <div className="field-bg" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/create"
            element={<SetupPage onGenerate={handleGenerate} hasActive={tournaments.length > 0} />}
          />
          <Route
            path="/league"
            element={<LeagueFixtures config={config} onStart={handleStartTournament} />}
          />
          <Route
            path="/cup"
            element={<CupTournament config={config} onStart={handleStartTournament} />}
          />
          <Route
            path="/matches"
            element={<MatchesPage tournaments={tournaments} onUpdate={setTournaments} onReset={clearTournaments} />}
          />
          <Route
            path="/score/:tournamentId/:phase/:idx0/:idx1"
            element={<MatchScorePage tournaments={tournaments} onUpdate={setTournaments} />}
          />
          <Route
            path="/score/:tournamentId/:phase/:idx0/:idx1/:idx2"
            element={<MatchScorePage tournaments={tournaments} onUpdate={setTournaments} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
