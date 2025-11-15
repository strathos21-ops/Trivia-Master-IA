import React, { useState, useEffect } from 'react';
import SpecialModeButtons from './components/SpecialModeButtons';
import GameView from './components/GameView';
import GameSetupView from './components/GameSetupView';
import LeaderboardView from './components/LeaderboardView';
import TournamentView from './components/TournamentView';
import { Difficulty, GameMode, Theme } from './types';

export default function App() {
  const [viewState, setViewState] = useState<'menu' | 'setup' | 'game' | 'leaderboard' | 'tournament'>('menu');
  const [currentMode, setCurrentMode] = useState<GameMode | null>(null);
  const [gameConfig, setGameConfig] = useState<{ topic: string; difficulty: Difficulty }>({ topic: '', difficulty: Difficulty.MEDIUM });
  const [isIncomingChallenge, setIsIncomingChallenge] = useState(false);
  
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedMode = params.get('mode') as GameMode;
    const sharedTopic = params.get('topic');
    const sharedDiff = params.get('difficulty') as Difficulty;

    if (sharedMode && sharedTopic && sharedDiff) {
        window.history.replaceState({}, '', window.location.pathname);
        setCurrentMode(sharedMode);
        setGameConfig({ topic: sharedTopic, difficulty: sharedDiff });
        setIsIncomingChallenge(true);
        setViewState('setup');
    }
  }, []);

  const handleSelectMode = (mode: GameMode) => {
    setCurrentMode(mode);
    setIsIncomingChallenge(false);
    if (mode === 'Leaderboard') {
      setViewState('leaderboard');
    } else {
      setViewState('setup');
    }
  };

  const handleStartGame = (topic: string, difficulty: Difficulty) => {
    setGameConfig({ topic, difficulty });
    if (currentMode === 'Tournoi') {
        setViewState('tournament');
    } else {
        setViewState('game');
    }
  };

  const handleBackToMenu = () => {
    setViewState('menu');
    setCurrentMode(null);
    setIsIncomingChallenge(false);
  };

  const handleBackToSetup = () => {
      setViewState('setup');
  };

  const getThemeStyles = () => {
    switch (theme) {
        case 'light':
            return "bg-slate-50 text-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-100";
        case 'gamer':
            return "bg-[#0f0c29] text-white bg-[linear-gradient(to_bottom,_#0f0c29,_#302b63,_#24243e)] selection:bg-fuchsia-500";
        default:
            return "bg-gray-900 text-gray-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black";
    }
  };

  const renderContent = () => {
    switch (viewState) {
      case 'menu':
        return (
            <div className="flex flex-col items-center w-full max-w-4xl mx-auto relative">
              <div className="text-center mb-12 animate-fade-in">
                <h1 className={`text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r mb-4 drop-shadow-sm
                    ${theme === 'light' ? 'from-blue-600 via-indigo-500 to-blue-700' : 'from-yellow-300 via-amber-400 to-yellow-500'}
                    ${theme === 'gamer' ? 'from-fuchsia-500 via-purple-500 to-cyan-500' : ''}
                `}>
                  Trivia Master IA
                </h1>
                <p className={`text-lg max-w-lg mx-auto font-medium tracking-wide mb-4
                    ${theme === 'light' ? 'text-slate-600' : 'text-amber-200'}
                    ${theme === 'gamer' ? 'text-cyan-300' : ''}
                `}>
                  Le quiz innovant pour esprits brillants
                </p>
                <div className="space-y-1">
                  <p className={`text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-gray-200'}`}>
                    Prêt pour le défi ?
                  </p>
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                    Choisissez votre mode de jeu pour commencer
                  </p>
                </div>
              </div>

              <div className="w-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <SpecialModeButtons onSelectMode={handleSelectMode} />
              </div>
              
              <footer className={`mt-16 text-sm ${theme === 'light' ? 'text-slate-400' : 'text-gray-600'}`}>
                 Propulsé par Google Gemini 2.5 Flash
              </footer>
            </div>
        );

      case 'setup':
        if (!currentMode) return null;
        return (
            <GameSetupView 
                mode={currentMode}
                initialTopic={gameConfig.topic}
                initialDifficulty={gameConfig.difficulty}
                onStart={handleStartGame} 
                onBack={handleBackToMenu}
                theme={theme}
                isIncomingChallenge={isIncomingChallenge}
            />
        );

      case 'game':
        if (!currentMode) return null;
        return (
            <GameView 
                mode={currentMode} 
                topic={gameConfig.topic} 
                difficulty={gameConfig.difficulty}
                onExit={handleBackToSetup}
                theme={theme} 
            />
        );

      case 'leaderboard':
        return <LeaderboardView onBack={handleBackToMenu} />;

      case 'tournament':
        return <TournamentView topic={gameConfig.topic} onBack={handleBackToSetup} />;

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 flex items-center justify-center p-4 md:p-8 ${getThemeStyles()}`}>
      <div className="absolute top-2 right-2 flex gap-1.5 z-50">
        <button 
            onClick={() => setTheme('light')} 
            className={`p-1.5 rounded-full transition-all hover:scale-110 text-sm ${theme === 'light' ? 'bg-white shadow-lg text-yellow-500' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'}`}
            title="Mode Clair"
        >
            ☀️
        </button>
        <button 
            onClick={() => setTheme('dark')} 
            className={`p-1.5 rounded-full transition-all hover:scale-110 text-sm ${theme === 'dark' ? 'bg-gray-700 shadow-lg text-indigo-300' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'}`}
            title="Mode Sombre"
        >
            🌙
        </button>
        <button 
            onClick={() => setTheme('gamer')} 
            className={`p-1.5 rounded-full transition-all hover:scale-110 text-sm ${theme === 'gamer' ? 'bg-fuchsia-900 shadow-[0_0_15px_rgba(217,70,239,0.5)] text-white border border-fuchsia-500' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'}`}
            title="Mode Gamer"
        >
            🎮
        </button>
      </div>
      
      {renderContent()}
    </div>
  );
}