
import React, { useState, useEffect } from 'react';
import SpecialModeButtons from './components/SpecialModeButtons';
import GameView from './components/GameView';
import GameSetupView from './components/GameSetupView';
import LeaderboardView from './components/LeaderboardView';
import TournamentView from './components/TournamentView';
import KidsGameView from './components/KidsGameView';
import { Difficulty, GameMode, Theme, Language } from './types';
import { TRANSLATIONS } from './translations';

// --- CONFIGURATION SÉCURITÉ ---
const SITE_PASSWORD = "TRIVIA"; // <--- CHANGEZ LE MOT DE PASSE ICI
const ENABLE_PASSWORD = true;   // Mettre sur 'false' pour désactiver

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);

  const [viewState, setViewState] = useState<'menu' | 'setup' | 'game' | 'leaderboard' | 'tournament' | 'kids'>('menu');
  const [currentMode, setCurrentMode] = useState<GameMode | null>(null);
  const [gameConfig, setGameConfig] = useState<{ topic: string; difficulty: Difficulty }>({ topic: '', difficulty: Difficulty.MEDIUM });
  const [isIncomingChallenge, setIsIncomingChallenge] = useState(false);
  
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    // Auto-login sur localhost (pour vous faciliter la vie)
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('192.168.')) {
        setIsAuthenticated(true);
    }

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

  // Handle RTL for Arabic
  useEffect(() => {
      if (language === 'ar') {
          document.dir = 'rtl';
      } else {
          document.dir = 'ltr';
      }
  }, [language]);

  const t = TRANSLATIONS[language];

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordInput.toUpperCase() === SITE_PASSWORD) {
          setIsAuthenticated(true);
          setAuthError(false);
      } else {
          setAuthError(true);
          setPasswordInput("");
      }
  };

  const handleSelectMode = (mode: GameMode) => {
    setCurrentMode(mode);
    setIsIncomingChallenge(false);
    if (mode === 'Leaderboard') {
      setViewState('leaderboard');
    } else if (mode === 'Kids') {
      setViewState('kids');
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

  // --- ECRAN DE VERROUILLAGE ---
  if (ENABLE_PASSWORD && !isAuthenticated) {
      return (
          <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans text-gray-100">
              <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700 text-center animate-fade-in">
                  <div className="text-6xl mb-6 animate-bounce">🔒</div>
                  <h1 className="text-2xl font-bold mb-2">Accès Restreint</h1>
                  <p className="text-gray-400 mb-8 text-sm">
                      Ce site est privé. Veuillez entrer le code d'accès pour jouer.
                  </p>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                      <input 
                        type="password" 
                        value={passwordInput}
                        onChange={(e) => {
                            setPasswordInput(e.target.value);
                            setAuthError(false);
                        }}
                        placeholder="CODE PIN"
                        className={`w-full text-center bg-gray-900 border-2 rounded-xl py-4 text-2xl tracking-[0.5em] font-mono outline-none transition-all
                            ${authError ? 'border-red-500 text-red-500' : 'border-gray-600 focus:border-indigo-500 text-white'}
                        `}
                        maxLength={10}
                      />
                      {authError && <p className="text-red-400 text-xs font-bold animate-pulse">Code incorrect</p>}
                      
                      <button 
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-transform active:scale-95"
                      >
                          DÉVERROUILLER 🔑
                      </button>
                  </form>
                  <p className="mt-6 text-xs text-gray-600">Hint: TRIVIA</p>
              </div>
          </div>
      )
  }

  const renderContent = () => {
    switch (viewState) {
      case 'menu':
        return (
            <div className="flex flex-col items-center w-full max-w-4xl mx-auto relative">
              <div className="text-center mb-12 animate-fade-in">
                <h1 className={`text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r mb-4 drop-shadow-sm
                    ${theme === 'light' ? 'from-blue-600 via-indigo-500 to-blue-700' : 'from-yellow-300 via-amber-400 to-yellow-500'}
                    ${theme === 'gamer' ? 'from-fuchsia-500 via-purple-500 to-cyan-500' : ''}
                `}>
                  Trivia Master IA
                </h1>
                <p className={`text-lg max-w-lg mx-auto font-medium tracking-wide mb-4
                    ${theme === 'light' ? 'text-slate-600' : 'text-amber-200'}
                    ${theme === 'gamer' ? 'text-cyan-300' : ''}
                `}>
                  {t.subtitle}
                </p>
                <div className="space-y-1">
                  <p className={`text-base font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-gray-200'}`}>
                    {t.ready}
                  </p>
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                    {t.choose_mode}
                  </p>
                </div>
              </div>

              <div className="w-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <SpecialModeButtons onSelectMode={handleSelectMode} theme={theme} language={language} />
              </div>
              
              <div className="mt-16 flex flex-col items-center gap-4">
                 {/* Monetization Button */}
                 <a 
                    href="https://www.buymeacoffee.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg
                        ${theme === 'light' ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300' : 'bg-yellow-500 text-black hover:bg-yellow-400'}
                    `}
                 >
                    {t.support_me}
                 </a>

                 <footer className={`text-sm ${theme === 'light' ? 'text-slate-400' : 'text-gray-600'}`}>
                    {t.powered}
                 </footer>
              </div>
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
                language={language}
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
                language={language} 
            />
        );

      case 'leaderboard':
        return <LeaderboardView onBack={handleBackToMenu} />;

      case 'tournament':
        return <TournamentView topic={gameConfig.topic} onBack={handleBackToSetup} language={language} />;

      case 'kids':
        return <KidsGameView onExit={handleBackToMenu} language={language} />;

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 flex items-center justify-center p-4 md:p-8 ${getThemeStyles()}`}>
      
      {/* Top Right Controls */}
      <div className="absolute top-2 right-2 flex flex-col md:flex-row gap-2 z-50 items-end md:items-center">
        {/* Language Selector */}
        <div className={`flex flex-wrap justify-end max-w-[200px] md:max-w-none gap-1 p-1 rounded-lg border ${theme === 'light' ? 'border-slate-300 bg-white' : 'border-gray-700 bg-gray-800'}`}>
             {(['fr', 'en', 'es', 'de', 'ru', 'zh', 'ar', 'hi'] as Language[]).map((lang) => (
                 <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 text-xs font-bold rounded transition-colors
                        ${language === lang 
                            ? (theme === 'light' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-900 text-white') 
                            : (theme === 'light' ? 'text-slate-500 hover:bg-slate-50' : 'text-gray-500 hover:bg-gray-700')}
                    `}
                 >
                    {lang.toUpperCase()}
                 </button>
             ))}
        </div>

        {/* Theme Selector */}
        <div className="flex gap-1.5">
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
      </div>
      
      {renderContent()}
    </div>
  );
}