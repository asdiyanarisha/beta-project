import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SetupPage from './pages/SetupPage';
import LeagueFixtures from './pages/LeagueFixtures';
import CupTournament from './pages/CupTournament';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

export default function App() {
  const [config, setConfig, clearConfig] = useLocalStorage('match-draw-config', null);

  const handleGenerate = (newConfig) => {
    setConfig(newConfig);
  };

  const handleReset = () => {
    clearConfig();
  };

  return (
    <BrowserRouter>
      <div className="app">
        <div className="field-bg" />
        <Routes>
          <Route
            path="/"
            element={<SetupPage onGenerate={handleGenerate} />}
          />
          <Route
            path="/league"
            element={<LeagueFixtures config={config} />}
          />
          <Route
            path="/cup"
            element={<CupTournament config={config} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
