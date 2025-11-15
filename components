import React, { useEffect, useState, useCallback } from 'react';
import { Difficulty, GameMode, GameState, Theme, Language } from '../types';
import { generateQuestions } from '../services/geminiService';
import LoadingScreen from './LoadingScreen';
import { TRANSLATIONS } from '../translations';

interface Props {
  mode: GameMode;
  topic: string;
  difficulty: Difficulty;
  onExit: () => void;
  theme: Theme;
  language: Language;
}

export default function GameView({ mode, topic, difficulty, onExit, theme, language }: Props) {
  const [state, setState] = useState<GameState>({
    score: 0,
    scoreP2: 0,
    activePlayer: 1,
    currentQuestionIndex: 0,
    isGameOver: false,
    questions: [],
    loading: true,
    error: null,
    streak: 0
  });

  const t = TRANSLATIONS[language];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareText, setShareText] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  const isAiMode = mode === 'Battle' || mode === 'Duel';
  const isMultiplayer = mode === 'Multijoueur';

  const getTextColor = (level: 'primary' | 'secondary' | 'accent') => {
      if (theme === 'light') {
          if (level === 'primary') return 'text-slate-900';
          if (level === 'secondary') return 'text-slate-600';
          if (level === 'accent') return 'text-indigo-600';
      } else if (theme === 'gamer') {
          if (level === 'primary') return 'text-white';
          if (level === 'secondary') return 'text-purple-200';
          if (level === 'accent') return 'text-cyan-400';
      }
      if (level === 'primary') return 'text-white';
      if (level === 'secondary') return 'text-gray-400';
      if (level === 'accent') return 'text-emerald-400';
      return 'text-white';
  };

  const getCardStyle = () => {
      if (theme === 'light') return 'bg-white/80 backdrop-blur-md border-slate-200 shadow-xl text-slate-800';
      if (theme === 'gamer') return 'bg-black/60 backdrop-blur-md border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.2)] text-white';
      return 'bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-2xl text-gray-100';
  };
  
  const getModalStyle = () => {
      if (theme === 'light') return 'bg-white text-slate-800 shadow-2xl';
      if (theme === 'gamer') return 'bg-[#0f0c29] text-white border border-fuchsia-500 shadow-[0_0_50px_rgba(217,70,239,0.3)]';
      return 'bg-gray-800 text-white border border-gray-600';
  };

  const getQuestionCount = (): number => {
    if (mode === 'MortSubite') return 10;
    if (mode === 'VraiFaux') return 10;
    if (mode === 'Multijoueur') return 10;
    if (mode === 'Solo') return 10;
    if (mode === 'Battle') return 10;
    if (mode === 'Custom') return 10;
    return 5;
  };

  const startGame = useCallback(async () => {
    try {
      // Pass language to service
      const questions = await generateQuestions(topic || "General Knowledge", getQuestionCount(), difficulty, mode, language);
      setState(prev => ({ ...prev, questions, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: "Connection error or AI limit reached." }));
    }
  }, [mode, topic, difficulty, language]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleAnswer = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);

    const currentQ = state.questions[state.currentQuestionIndex];
    const isCorrect = option === currentQ.correctAnswer;

    setTimeout(() => {
      setState(prev => {
        const points = 100 + (prev.streak * 10);
        let newScore = prev.score;
        let newScoreP2 = prev.scoreP2;
        let newStreak = prev.streak;

        if (isCorrect) {
          if (isMultiplayer) {
             if (prev.activePlayer === 1) newScore += points;
             else newScoreP2 += points;
          } else {
             newScore += points;
          }
          newStreak += 1;
        } else {
          if (isMultiplayer) newStreak = 0;
          else newStreak = 0;
        }

        if (isAiMode) {
            let aiAccuracy = 0.5;
            if (mode === 'Duel') aiAccuracy = 0.75;
            if (difficulty === Difficulty.HARD) aiAccuracy += 0.1;
            if (difficulty === Difficulty.INSANE) aiAccuracy += 0.2;

            const aiSuccess = Math.random() < aiAccuracy;
            
            if (aiSuccess) {
                newScoreP2 += 100 + Math.floor(Math.random() * 20); 
            }
        }
        
        if (mode === 'MortSubite' && !isCorrect) {
            return { ...prev, score: newScore, scoreP2: newScoreP2, streak: newStreak, isGameOver: true };
        }

        return { ...prev, score: newScore, scoreP2: newScoreP2, streak: newStreak };
      });
      
      if (!(mode === 'MortSubite' && !isCorrect)) {
          nextQuestion();
      }
    }, 2000);
  };

  const nextQuestion = () => {
    if (state.currentQuestionIndex + 1 >= state.questions.length) {
       setState(prev => ({ ...prev, isGameOver: true }));
    } else {
       setState(prev => ({
         ...prev,
         currentQuestionIndex: prev.currentQuestionIndex + 1,
         activePlayer: isMultiplayer ? (prev.activePlayer === 1 ? 2 : 1) : 1
       }));
       setSelectedOption(null);
       setShowResult(false);
    }
  };

  const handleShare = async () => {
    const text = `Trivia Master IA Score: ${state.score} ! (${topic})`;
    const url = window.location.href;
    
    setShareLink(url);
    setShareText(text);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
        setShowShareModal(true);
        return;
    }

    if (isMobile && navigator.share) {
        try {
            await navigator.share({
                title: 'Trivia Master IA',
                text: text,
                url: url
            });
        } catch (err) {
            setShowShareModal(true);
        }
    } else {
        setShowShareModal(true);
    }
  };
  
  const handleCopyLink = () => {
      navigator.clipboard.writeText(shareLink + " " + shareText);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
  };

  if (state.loading) return (
      <div className="w-full max-w-2xl mx-auto p-4 min-h-[50vh] flex flex-col relative animate-fade-in">
         <button 
            onClick={onExit}
            className={`self-start mb-8 flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors z-10
                ${theme === 'light' ? 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50' : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white'}
            `}
         >
            <span>⬅️</span> {t.cancel}
         </button>
         <LoadingScreen message={t.loading_message} />
      </div>
  );
  
  if (state.error) return (
    <div className="text-center p-8 text-red-400 bg-red-900/20 rounded-xl border border-red-500/50">
      <h3 className="text-xl font-bold mb-2">Error</h3>
      <p>{state.error}</p>
      <button onClick={onExit} className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg">{t.back_menu}</button>
    </div>
  );

  if (state.isGameOver) {
    let winnerMsg = t.game_over;
    if (isMultiplayer) {
        if (state.score > state.scoreP2) winnerMsg = `${t.player_1} Wins! 🏆`;
        else if (state.scoreP2 > state.score) winnerMsg = `${t.player_2} Wins! 🏆`;
        else winnerMsg = t.equality;
    } else if (isAiMode) {
        if (state.score > state.scoreP2) winnerMsg = t.you_won;
        else if (state.scoreP2 > state.score) winnerMsg = t.you_lost;
        else winnerMsg = t.equality;
    }

    return (
      <div className={`w-full max-w-md mx-auto text-center p-8 rounded-2xl shadow-2xl border animate-fade-in ${getCardStyle()}`}>
        <div className="text-6xl mb-4">
          {isMultiplayer ? '👥' : (mode === 'MortSubite' && state.currentQuestionIndex < state.questions.length -1 ? '💀' : '🏆')}
        </div>
        <h2 className={`text-3xl font-bold mb-2 leading-tight ${getTextColor('primary')}`}>{winnerMsg}</h2>
        <p className={`mb-6 ${getTextColor('secondary')}`}>Mode : <span className="text-indigo-400 font-semibold">{mode}</span></p>
        
        <div className={`rounded-xl p-6 mb-8 border space-y-4
             ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/10'}
        `}>
          <div className="flex justify-between items-center">
             <span className={`text-sm uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>{isMultiplayer ? t.player_1 : t.your_score}</span>
             <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {state.score}
             </span>
          </div>
          {(isMultiplayer || isAiMode) && (
              <div className={`flex justify-between items-center pt-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-gray-700'}`}>
                <span className={`text-sm uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>{isMultiplayer ? t.player_2 : 'Gemini IA'}</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                    {state.scoreP2}
                </span>
              </div>
          )}
        </div>

        <div className="space-y-3">
            <button 
                onClick={handleShare}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                <span>📢</span> {t.share_score}
            </button>

            <button 
                onClick={onExit}
                className={`w-full py-3 font-bold rounded-xl transition-all
                    ${theme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}
                `}
            >
                {t.back_menu}
            </button>
        </div>

        {showShareModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                <div className={`relative w-full max-w-md rounded-2xl p-6 border ${getModalStyle()}`}>
                    <button 
                        onClick={() => setShowShareModal(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                        ✕
                    </button>
                    
                    <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                        <span>📢</span> {t.share_modal_title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-6">
                        <input 
                            readOnly
                            value={shareText}
                            onClick={(e) => e.currentTarget.select()}
                            className={`flex-1 border rounded-lg px-3 py-2.5 text-xs font-mono truncate outline-none 
                                ${theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-black/30 border-white/10 text-gray-300'}
                            `}
                        />
                        <button 
                            onClick={handleCopyLink}
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all min-w-[80px]
                                ${theme === 'light' 
                                    ? (hasCopied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white') 
                                    : (hasCopied ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white')}
                            `}
                        >
                            {hasCopied ? t.copied : t.copy}
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-6">
                         <div className="col-span-4 text-center text-xs opacity-50">Social Links</div>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  const currentQ = state.questions[state.currentQuestionIndex];

  const renderHeaderStats = () => {
      const labelClass = `text-xs uppercase font-bold ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`;
      const scoreClass = `text-2xl font-bold ${getTextColor('primary')}`;
      const scoreAiClass = `text-2xl font-bold ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`;
      
      if (isAiMode) {
          return (
            <>
              <div>
                <p className={labelClass}>You</p>
                <p className={scoreClass}>{state.score}</p>
              </div>
              
              <div className="text-center flex flex-col items-center">
                   <span className={`${labelClass} mb-1`}>{t.question}</span>
                   <span className={`px-3 py-1 rounded-lg text-sm border font-mono
                        ${theme === 'light' ? 'bg-white text-slate-600 border-slate-300' : 'bg-gray-900 text-gray-300 border-gray-700'}
                   `}>
                      {state.currentQuestionIndex + 1} / {state.questions.length}
                   </span>
              </div>

              <div className="text-right">
                <p className={labelClass}>Gemini IA</p>
                <p className={scoreAiClass}>{state.scoreP2}</p>
              </div>
            </>
          )
      }
      
      if (isMultiplayer) {
          return (
              <>
                <div className={`transition-opacity ${state.activePlayer !== 1 ? 'opacity-40' : 'opacity-100'}`}>
                    <p className={labelClass}>{t.player_1}</p>
                    <p className={scoreClass}>{state.score}</p>
                </div>

                 <div className="text-center">
                     <span className={`px-4 py-1 rounded-full text-xs border font-mono
                        ${theme === 'light' ? 'bg-white text-slate-800 border-slate-300' : 'bg-gray-900 text-white border-gray-600'}
                     `}>
                        Q. {state.currentQuestionIndex + 1}
                     </span>
                     <div className="mt-1 font-bold text-yellow-400 animate-pulse text-sm">
                         {state.activePlayer === 1 ? "TURN P1" : "TURN P2"}
                     </div>
                 </div>

                <div className={`text-right transition-opacity ${state.activePlayer !== 2 ? 'opacity-40' : 'opacity-100'}`}>
                    <p className={labelClass}>{t.player_2}</p>
                    <p className={`text-2xl font-bold ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>{state.scoreP2}</p>
                </div>
              </>
          )
      }

      return (
        <>
          <div>
            <p className={labelClass}>{t.question}</p>
            <p className={scoreClass}>{state.currentQuestionIndex + 1} / {state.questions.length}</p>
          </div>
          
          <div className="text-center">
              <span className={`px-3 py-1 rounded text-xs font-bold border
                ${theme === 'light' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-gray-800 text-gray-400 border-gray-700'}
              `}>
                  {difficulty}
              </span>
          </div>

          <div className="text-right">
            <p className={labelClass}>Score</p>
            <p className={`text-2xl font-bold ${getTextColor('accent')}`}>{state.score}</p>
          </div>
        </>
      )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="mb-2">
        <button 
            onClick={onExit}
            className={`flex items-center gap-2 text-sm font-medium transition-colors py-2 px-2 rounded-lg
                ${theme === 'light' ? 'text-slate-500 hover:bg-slate-200 hover:text-slate-800' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}
            `}
        >
            <span>⬅️</span> {t.back_config}
        </button>
      </div>

      <div className={`flex justify-between items-end mb-6 px-4 p-4 rounded-xl border
           ${theme === 'light' ? 'bg-white/60 border-slate-200 shadow-sm' : 'bg-gray-800/50 border-gray-700'}
      `}>
          {renderHeaderStats()}
      </div>

      <div className={`
            ${getCardStyle()}
            rounded-2xl overflow-hidden mb-6 transition-colors duration-500 border
            ${isMultiplayer ? (state.activePlayer === 1 ? 'border-indigo-500/50' : 'border-pink-500/50') : ''}
            ${isAiMode && theme !== 'light' ? 'border-amber-500/30' : ''}
      `}>
        <div className="p-8">
            <p className={`text-lg md:text-xl font-medium leading-relaxed ${getTextColor('primary')}`}>
              {currentQ.question}
            </p>
        </div>
        <div className={`h-1.5 w-full ${theme === 'light' ? 'bg-slate-200' : 'bg-gray-700'}`}>
          <div 
            className={`h-full transition-all duration-500 ease-out 
                ${isMultiplayer && state.activePlayer === 2 ? 'bg-pink-500' : ''}
                ${isAiMode ? 'bg-amber-500' : ''}
                ${!isMultiplayer && !isAiMode ? (theme === 'gamer' ? 'bg-fuchsia-500' : 'bg-indigo-500') : ''}
            `}
            style={{ width: `${((state.currentQuestionIndex + 1) / state.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={`grid ${mode === 'VraiFaux' ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
        {currentQ.options.map((option, idx) => {
            let btnClass = "";
            if (theme === 'light') {
                 btnClass = "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm";
            } else if (theme === 'gamer') {
                 btnClass = "bg-black/40 hover:bg-purple-900/30 border-purple-500/30 text-purple-100";
            } else {
                 btnClass = "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200";
            }
            
            if (showResult) {
                if (option === currentQ.correctAnswer) {
                    btnClass = "bg-emerald-600 border-emerald-500 text-white ring-2 ring-emerald-400";
                } else if (option === selectedOption) {
                    btnClass = "bg-red-600 border-red-500 text-white";
                } else {
                    btnClass = theme === 'light' ? "bg-slate-100 opacity-50" : "bg-gray-800 opacity-50";
                }
            }

            return (
                <button
                    key={idx}
                    disabled={showResult}
                    onClick={() => handleAnswer(option)}
                    className={`
                        relative w-full p-5 rounded-xl text-left font-semibold text-lg transition-all duration-200 border-2
                        ${btnClass}
                        ${!showResult && 'hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]'}
                        ${mode === 'VraiFaux' ? 'text-center' : ''}
                    `}
                >
                   {mode !== 'VraiFaux' && <span className="opacity-50 mr-4 text-sm font-mono">{String.fromCharCode(65 + idx)}.</span>}
                   {option}
                   {showResult && option === currentQ.correctAnswer && (
                       <span className={`absolute ${mode === 'VraiFaux' ? 'top-2 right-2 text-sm' : 'right-4 top-1/2 -translate-y-1/2 text-xl'}`}>✅</span>
                   )}
                   {showResult && option === selectedOption && option !== currentQ.correctAnswer && (
                       <span className={`absolute ${mode === 'VraiFaux' ? 'top-2 right-2 text-sm' : 'right-4 top-1/2 -translate-y-1/2 text-xl'}`}>❌</span>
                   )}
                </button>
            )
        })}
      </div>

      {showResult && (
          <div className={`mt-6 rounded-lg p-4 animate-fade-in border
              ${theme === 'light' ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-indigo-900/40 border-indigo-500/30 text-indigo-200'}
          `}>
              <p className="text-sm">
                  <span className="font-bold opacity-80">Info :</span> {currentQ.explanation}
              </p>
          </div>
      )}
    </div>
  );
}import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { Difficulty, GameMode, Theme, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface Props {
  mode: GameMode;
  onStart: (topic: string, difficulty: Difficulty) => void;
  onBack: () => void;
  theme: Theme;
  language: Language;
  initialTopic?: string;
  initialDifficulty?: Difficulty;
  isIncomingChallenge?: boolean;
}

const DIFFICULTIES = [
  { id: Difficulty.EASY, label: 'Facile', icon: '🟢', desc: 'Débutant' },
  { id: Difficulty.MEDIUM, label: 'Moyen', icon: '🟡', desc: 'Standard' },
  { id: Difficulty.HARD, label: 'Difficile', icon: '🔴', desc: 'Expert' },
  { id: Difficulty.INSANE, label: 'Enfer', icon: '😈', desc: 'Extreme' },
];

export default function GameSetupView({ mode, onStart, onBack, theme, language, initialTopic = "", initialDifficulty = Difficulty.MEDIUM, isIncomingChallenge = false }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic);
  const [customTopic, setCustomTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(initialDifficulty);
  const [isCustomInputVisible, setIsCustomInputVisible] = useState(false);
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareText, setShareText] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
      if (initialTopic) {
          const isStandard = CATEGORIES.some(c => c.name === initialTopic);
          if (!isStandard) {
              setIsCustomInputVisible(true);
              setCustomTopic(initialTopic);
              setSelectedTopic("");
          } else {
              setSelectedTopic(initialTopic);
          }
      }
      
      if (typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168.')) {
              setIsLocalhost(true);
          }
      }
  }, [initialTopic]);

  const isTopicValid = isCustomInputVisible ? customTopic.trim().length > 0 : selectedTopic.length > 0;
  const isDuelOrMulti = ['Duel', 'Multijoueur'].includes(mode);

  const handleStart = () => {
    const topic = isCustomInputVisible ? customTopic : selectedTopic;
    if (!topic) return;
    onStart(topic, selectedDifficulty);
  };

  const handleShareChallenge = async () => {
    const topic = isCustomInputVisible ? customTopic : selectedTopic;
    
    if (!topic) {
        alert("⚠️");
        return;
    }

    setIsGeneratingLink(true);

    try {
        let fullUrl = "";
        try {
            const baseUrl = window.location.origin + window.location.pathname;
            const params = new URLSearchParams();
            params.set('mode', mode);
            params.set('topic', topic);
            params.set('difficulty', selectedDifficulty);
            fullUrl = `${baseUrl}?${params.toString()}`;
        } catch (e) {
            fullUrl = window.location.href;
        }
        
        const text = `Trivia Master Challenge!\nMode: ${mode}\nTopic: ${topic}\nLevel: ${selectedDifficulty}`;

        setShareLink(fullUrl);
        setShareText(text);

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isLocalhost) {
            setShowShareModal(true);
            setIsGeneratingLink(false);
            return;
        }

        if (isMobile && navigator.share) {
            try {
                await navigator.share({
                    title: 'Trivia Master IA',
                    text: text,
                    url: fullUrl
                });
            } catch (err) {
                setShowShareModal(true);
            }
        } else {
            setShowShareModal(true);
        }
    } catch (error) {
        console.error("Error:", error);
        setShowShareModal(true);
    } finally {
        setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
      navigator.clipboard.writeText(shareLink);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
  };

  const getContainerStyle = () => {
      if (theme === 'light') return 'bg-white/80 border-slate-200 text-slate-900';
      if (theme === 'gamer') return 'bg-black/60 border-fuchsia-500/50 text-white shadow-[0_0_30px_rgba(192,38,211,0.15)]';
      return 'bg-gray-800/90 border-gray-700 text-white';
  };

  const getButtonClass = (isActive: boolean, isAction: boolean = false, isSecondaryAction: boolean = false) => {
      if (isAction) {
           if (theme === 'light') return "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:scale-105 border-transparent";
           if (theme === 'gamer') return "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:scale-105 border-white/10";
           return "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:bg-emerald-500 hover:scale-105 border-transparent";
      }

      if (isSecondaryAction) {
           if (theme === 'light') return "bg-white border-slate-300 text-indigo-600 hover:bg-indigo-50";
           if (theme === 'gamer') return "bg-black/50 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/30 hover:border-cyan-400";
           return "bg-gray-700 border-gray-600 text-white hover:bg-gray-600";
      }

      if (isActive) {
          if (theme === 'light') return "bg-indigo-100 border-indigo-500 text-indigo-700 shadow-md transform scale-[1.02]";
          if (theme === 'gamer') return "bg-fuchsia-900/40 border-fuchsia-500 text-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.3)] transform scale-[1.02]";
          return "bg-emerald-900/50 border-emerald-500 text-emerald-400 transform scale-[1.02]";
      }
      
      if (theme === 'light') return "bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:border-indigo-300 hover:text-indigo-600";
      if (theme === 'gamer') return "bg-gray-900/50 border-gray-800 text-gray-500 hover:bg-gray-800 hover:border-cyan-500 hover:text-cyan-400";
      return "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:border-gray-500 hover:text-gray-200";
  };

  const getModalStyle = () => {
      if (theme === 'light') return 'bg-white text-slate-800 shadow-2xl';
      if (theme === 'gamer') return 'bg-[#0f0c29] text-white border border-fuchsia-500 shadow-[0_0_50px_rgba(217,70,239,0.3)]';
      return 'bg-gray-800 text-white border border-gray-600';
  }

  return (
    <div className={`w-full max-w-5xl mx-auto p-4 md:p-6 rounded-3xl backdrop-blur-xl border shadow-2xl animate-fade-in ${getContainerStyle()}`}>
      
      <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-500/20">
        <div>
            {isIncomingChallenge ? (
                <div className="flex items-center gap-3 mb-1 animate-pulse">
                    <span className="text-3xl">⚔️</span>
                    <h2 className={`text-xl md:text-3xl font-black uppercase italic tracking-widest 
                        ${theme === 'light' ? 'text-indigo-600' : 'text-yellow-400'}`}>
                        {t.accept_challenge}
                    </h2>
                </div>
            ) : (
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">⚙️</span>
                    <h2 className={`text-xl md:text-2xl font-bold ${theme === 'gamer' ? 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400' : ''}`}>
                        {t.config_title}
                    </h2>
                </div>
            )}
            <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                {t.modes[mode]}
            </p>
        </div>
        <button onClick={onBack} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${theme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-600' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
            ✕ {isIncomingChallenge ? t.refuse : t.cancel}
        </button>
      </div>

      <div className="mb-6">
        <h3 className={`text-xs md:text-sm uppercase font-bold mb-3 tracking-wider ${theme === 'light' ? 'text-slate-400' : 'text-gray-500'}`}>
            1. {t.difficulty} {isIncomingChallenge && "(Fixed)"}
        </h3>
        <div className="grid grid-cols-4 gap-3 md:gap-4">
            {DIFFICULTIES.map((diff) => (
                <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`py-2 px-1 flex flex-col items-center justify-center h-14 md:h-16 rounded-xl transition-all ${getButtonClass(selectedDifficulty === diff.id)}`}
                >
                    <span className="text-base md:text-lg mb-0.5">{diff.icon}</span>
                    <span className="text-[9px] md:text-[10px] font-bold uppercase">{diff.label}</span>
                </button>
            ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className={`text-xs md:text-sm uppercase font-bold mb-3 tracking-wider ${theme === 'light' ? 'text-slate-400' : 'text-gray-500'}`}>
            2. {t.theme} {isIncomingChallenge && "(Fixed)"}
        </h3>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 mb-4">
            <button
                onClick={() => {
                    setIsCustomInputVisible(true);
                    setSelectedTopic("");
                    setCustomTopic("");
                }}
                className={`p-2 flex flex-col items-center justify-center h-16 md:h-20 rounded-xl transition-all ${getButtonClass(isCustomInputVisible)}`}
            >
                <span className="text-lg md:text-xl mb-1">✨</span>
                <span className="font-bold text-[9px] md:text-[10px] uppercase text-center">{t.free_topic}</span>
            </button>

            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => {
                        setSelectedTopic(cat.name);
                        setIsCustomInputVisible(false);
                    }}
                    className={`p-2 flex flex-col items-center justify-center h-16 md:h-20 rounded-xl transition-all ${getButtonClass(!isCustomInputVisible && selectedTopic === cat.name)}`}
                >
                    <span className="text-lg md:text-xl mb-1">{cat.icon}</span>
                    <span className="font-bold text-[9px] md:text-[10px] uppercase text-center leading-tight">{cat.name}</span>
                </button>
            ))}
        </div>

        {isCustomInputVisible && (
            <div className="animate-fade-in mt-4">
                <input 
                    type="text" 
                    autoFocus
                    placeholder={t.custom_topic_placeholder}
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className={`w-full p-3 rounded-xl text-sm md:text-base outline-none border-2 transition-all font-medium
                        ${theme === 'light' 
                            ? 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900 placeholder-slate-400' 
                            : theme === 'gamer'
                                ? 'bg-black/40 border-fuchsia-900/50 focus:border-cyan-500 text-white placeholder-gray-600'
                                : 'bg-gray-900 border-gray-700 focus:border-emerald-500 text-white placeholder-gray-600'}
                    `}
                />
            </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
            onClick={handleShareChallenge}
            disabled={isGeneratingLink}
            className={`md:w-1/3 py-3 text-sm rounded-xl font-bold uppercase transition-all flex flex-col items-center justify-center gap-1
                ${getButtonClass(false, false, true)}
                ${isGeneratingLink ? 'opacity-50 cursor-wait' : ''}
                ${!isTopicValid && !isGeneratingLink ? 'opacity-90' : ''}
            `}
        >
            <div className="flex items-center gap-2">
                <span className="text-lg">{isGeneratingLink ? '⏳' : (isDuelOrMulti ? '⚔️' : '🔗')}</span>
                <span>{isGeneratingLink ? t.creating : (isDuelOrMulti ? t.invite_opponent : t.share_challenge)}</span>
            </div>
        </button>

        <button
            onClick={handleStart}
            disabled={!isTopicValid}
            className={`flex-1 py-4 text-lg rounded-xl font-black tracking-widest uppercase transition-all shadow-lg hover:shadow-xl relative overflow-hidden group
                ${getButtonClass(false, true)}
                ${!isTopicValid ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                ${isIncomingChallenge ? 'animate-pulse' : ''}
            `}
        >
             <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            
            {isIncomingChallenge ? t.accept_challenge : t.play}
        </button>
      </div>
      
      <div className="mt-3 flex justify-center md:justify-start md:w-1/3 gap-3 opacity-50 px-2">
         <span className="text-lg">💬</span>
         <span className="text-lg">📸</span>
         <span className="text-lg">🐦</span>
         <span className="text-lg">📘</span>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className={`relative w-full max-w-md rounded-2xl p-6 border ${getModalStyle()}`}>
                <button 
                    onClick={() => setShowShareModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                    ✕
                </button>
                
                <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                    <span>📢</span> {t.share_modal_title}
                </h3>

                {isLocalhost && (
                     <div className="mb-6 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/50 text-yellow-200 text-xs leading-relaxed">
                        ⚠️ Localhost detected. Deplay to Vercel to share globally.
                    </div>
                )}

                <div className="flex items-center gap-2 mb-6">
                    <input 
                        readOnly
                        value={shareLink}
                        onClick={(e) => e.currentTarget.select()}
                        className={`flex-1 border rounded-lg px-3 py-2.5 text-xs font-mono truncate outline-none 
                            ${theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-black/30 border-white/10 text-gray-300'}
                        `}
                    />
                    <button 
                        onClick={handleCopyLink}
                        className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all min-w-[80px]
                            ${theme === 'light' 
                                ? (hasCopied ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white') 
                                : (hasCopied ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white')}
                        `}
                    >
                        {hasCopied ? t.copied : t.copy}
                    </button>
                </div>
                
                <div className="grid grid-cols-4 gap-3 mb-6">
                     {/* Social buttons reuse */}
                     <div className="col-span-4 text-center text-xs opacity-50">
                        WhatsApp • Facebook • Twitter • Email
                     </div>
                </div>

            </div>
        </div>
      )}
    </div>
  );
}import React from "react";
import { GameMode, Language, Theme } from "../types";
import { MODE_COLORS } from "../constants";
import { TRANSLATIONS } from "../translations";

interface Props {
  onSelectMode: (mode: GameMode) => void;
  theme?: Theme;
  language: Language;
}

const modeButtons: {
  mode: GameMode;
  icon: string;
}[] = [
  { mode: "Solo", icon: "👤" },
  { mode: "Multijoueur", icon: "👥" },
  { mode: "Battle", icon: "🤖" },
  { mode: "Duel", icon: "⚔️" },
  { mode: "Tournoi", icon: "🏆" },
  { mode: "VraiFaux", icon: "✅" },
  { mode: "MortSubite", icon: "💀" },
  { mode: "Leaderboard", icon: "📊" },
  { mode: "Kids", icon: "🧸" },
];

export default function SpecialModeButtons({ onSelectMode, language }: Props) {
  const t = TRANSLATIONS[language];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mx-auto px-2">
      {modeButtons.map((btn) => {
        const colorClasses = MODE_COLORS[btn.mode] || "bg-gray-700 text-white";
        
        return (
          <button
            key={btn.mode}
            onClick={() => onSelectMode(btn.mode)}
            className={`
              group relative flex flex-col items-center justify-center 
              py-3 px-2
              rounded-xl shadow-md font-bold 
              transform transition-all duration-300 
              hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2
              h-24 md:h-28
              ${colorClasses}
            `}
          >
            <span className="text-2xl md:text-3xl mb-1.5 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                {btn.icon}
            </span>
            <span className="uppercase text-center leading-tight text-[10px] md:text-xs tracking-wider font-bold">
                {t.modes[btn.mode] || btn.mode}
            </span>
            
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        );
      })}
      
      {/* Bouton Custom Mode */}
       <button
            onClick={() => onSelectMode('Custom')}
            className="col-span-2 md:col-span-4 group relative flex items-center justify-center py-4 px-4 rounded-xl shadow-lg font-bold transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 bg-gradient-to-r from-fuchsia-700 via-purple-700 to-indigo-700 text-white"
          >
            <span className="text-2xl mr-3 group-hover:rotate-12 transition-transform">✨</span>
            <span className="uppercase text-sm md:text-base tracking-widest font-black">
                {t.modes.Custom}
            </span>
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" />
       </button>
    </div>
  );
}import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { generateQuestions, generateKidsWord } from '../services/geminiService';
import LoadingScreen from './LoadingScreen';

interface Props {
    onExit: () => void;
    language: Language;
}

type KidActivity = 'menu' | 'quiz' | 'calc' | 'draw' | 'write';

export default function KidsGameView({ onExit, language }: Props) {
    const [activity, setActivity] = useState<KidActivity>('menu');
    const t = TRANSLATIONS[language].kids;
    const [loading, setLoading] = useState(false);

    // Quiz State
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

    // Write State
    const [targetWord, setTargetWord] = useState("");
    const [typedWord, setTypedWord] = useState("");

    // Calc State
    const [calcProblem, setCalcProblem] = useState({ a: 0, b: 0, op: '+', ans: 0 });
    
    // Draw State
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState('#000000');

    // --- LOGIC ---

    const startQuiz = async () => {
        setLoading(true);
        try {
            const qs = await generateQuestions("Kids", 5, "Easy" as any, "Kids", language);
            setQuestions(qs);
            setCurrentQ(0);
            setScore(0);
            setActivity('quiz');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const startWrite = async () => {
        setLoading(true);
        const word = await generateKidsWord(language);
        setTargetWord(word);
        setTypedWord("");
        setActivity('write');
        setLoading(false);
    };

    const startCalc = () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const isPlus = Math.random() > 0.3; // 70% +
        if (isPlus) {
            setCalcProblem({ a, b, op: '+', ans: a + b });
        } else {
             // Ensure positive result
             const max = Math.max(a, b);
             const min = Math.min(a, b);
             setCalcProblem({ a: max, b: min, op: '-', ans: max - min });
        }
        setActivity('calc');
    };

    const startDraw = () => {
        setActivity('draw');
        setTimeout(() => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.lineWidth = 5;
                }
            }
        }, 100);
    };

    // --- HANDLERS ---

    const handleQuizAnswer = (opt: string) => {
        if (opt === questions[currentQ].correctAnswer) {
            setShowFeedback('correct');
            setScore(s => s + 1);
        } else {
            setShowFeedback('wrong');
        }
        setTimeout(() => {
            setShowFeedback(null);
            if (currentQ < questions.length - 1) {
                setCurrentQ(q => q + 1);
            } else {
                setActivity('menu');
            }
        }, 1500);
    };

    const handleCalcAnswer = (ans: number) => {
        if (ans === calcProblem.ans) {
            setShowFeedback('correct');
            setTimeout(() => {
                setShowFeedback(null);
                startCalc(); // New problem
            }, 1000);
        } else {
            setShowFeedback('wrong');
            setTimeout(() => setShowFeedback(null), 1000);
        }
    };

    const handleType = (char: string) => {
        if (char === 'DEL') {
            setTypedWord(prev => prev.slice(0, -1));
            return;
        }
        const next = typedWord + char;
        setTypedWord(next);
        if (next === targetWord) {
            setShowFeedback('correct');
            setTimeout(() => {
                setShowFeedback(null);
                startWrite();
            }, 1500);
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let x, y;
        
        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
             x = (e as React.MouseEvent).clientX - rect.left;
             y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const rect = canvas.getBoundingClientRect();
        let x, y;
        if ('touches' in e) {
             x = e.touches[0].clientX - rect.left;
             y = e.touches[0].clientY - rect.top;
        } else {
             x = (e as React.MouseEvent).clientX - rect.left;
             y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.strokeStyle = brushColor;
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    if (loading) return <LoadingScreen message="Attends un peu..." />;

    return (
        <div className="min-h-screen w-full bg-yellow-300 font-comic p-4">
            <button onClick={onExit} className="absolute top-4 left-4 bg-white rounded-full p-3 shadow-lg text-2xl z-50">🏠</button>
            
            <div className="max-w-4xl mx-auto pt-16">
                <h1 className="text-4xl md:text-6xl font-black text-center text-pink-500 mb-8 drop-shadow-white" style={{ textShadow: '3px 3px 0px white' }}>
                    {t.title} 🧸
                </h1>

                {activity === 'menu' && (
                    <div className="grid grid-cols-2 gap-6">
                        <button onClick={startQuiz} className="bg-white p-6 rounded-3xl shadow-xl hover:scale-105 transition transform flex flex-col items-center border-b-8 border-gray-200">
                            <span className="text-6xl mb-4">🦁</span>
                            <span className="text-2xl font-bold text-blue-500">{t.quiz}</span>
                        </button>
                        <button onClick={startCalc} className="bg-white p-6 rounded-3xl shadow-xl hover:scale-105 transition transform flex flex-col items-center border-b-8 border-gray-200">
                            <span className="text-6xl mb-4">🧮</span>
                            <span className="text-2xl font-bold text-green-500">{t.calc}</span>
                        </button>
                         <button onClick={startDraw} className="bg-white p-6 rounded-3xl shadow-xl hover:scale-105 transition transform flex flex-col items-center border-b-8 border-gray-200">
                            <span className="text-6xl mb-4">🎨</span>
                            <span className="text-2xl font-bold text-purple-500">{t.draw}</span>
                        </button>
                         <button onClick={startWrite} className="bg-white p-6 rounded-3xl shadow-xl hover:scale-105 transition transform flex flex-col items-center border-b-8 border-gray-200">
                            <span className="text-6xl mb-4">✍️</span>
                            <span className="text-2xl font-bold text-orange-500">{t.write}</span>
                        </button>
                    </div>
                )}

                {activity === 'quiz' && questions.length > 0 && (
                    <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-400">
                        <div className="text-center text-3xl font-bold text-blue-600 mb-8">{questions[currentQ].question}</div>
                        <div className="grid grid-cols-1 gap-4">
                            {questions[currentQ].options.map((opt: string, i: number) => (
                                <button key={i} onClick={() => handleQuizAnswer(opt)} className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-2xl font-bold py-4 rounded-xl shadow-sm border-2 border-blue-200">
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activity === 'calc' && (
                    <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-green-400 text-center">
                        <div className="text-2xl text-gray-500 mb-4">{t.calc_question}</div>
                        <div className="text-8xl font-black text-green-600 mb-8 flex justify-center gap-4">
                            <span>{calcProblem.a}</span>
                            <span>{calcProblem.op}</span>
                            <span>{calcProblem.b}</span>
                            <span>=</span>
                            <span>?</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                            {[1,2,3,4,5,6,7,8,9,0].map(n => (
                                <button key={n} onClick={() => handleCalcAnswer(n)} className="bg-green-100 hover:bg-green-200 text-green-800 text-3xl font-bold py-4 rounded-xl">
                                    {n}
                                </button>
                            ))}
                            {/* Options fake */}
                            <button onClick={() => handleCalcAnswer(calcProblem.ans)} className="col-span-2 bg-green-500 text-white text-3xl font-bold py-4 rounded-xl shadow-lg animate-pulse">
                                {calcProblem.ans} ?
                            </button>
                             <button onClick={() => handleCalcAnswer(calcProblem.ans + 1)} className="bg-green-100 text-green-800 text-3xl font-bold py-4 rounded-xl">
                                {calcProblem.ans + 1}
                            </button>
                        </div>
                    </div>
                )}

                {activity === 'write' && (
                    <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-orange-400 text-center">
                         <div className="text-2xl text-gray-500 mb-4">{t.type_word}</div>
                         <div className="text-6xl font-black text-orange-500 mb-8 tracking-widest">{targetWord}</div>
                         
                         <div className="bg-gray-100 p-4 rounded-xl mb-8 min-h-[80px] text-5xl font-mono tracking-widest">
                             {typedWord}
                             <span className="animate-pulse">|</span>
                         </div>

                         <div className="flex flex-wrap justify-center gap-2">
                             {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(char => (
                                 <button key={char} onClick={() => handleType(char)} className="w-12 h-12 bg-orange-100 hover:bg-orange-200 rounded-lg text-xl font-bold text-orange-900 shadow-sm border-b-4 border-orange-200 active:border-b-0 active:translate-y-1">
                                     {char}
                                 </button>
                             ))}
                             <button onClick={() => handleType('DEL')} className="w-24 h-12 bg-red-100 hover:bg-red-200 rounded-lg text-xl font-bold text-red-900 border-b-4 border-red-200">⌫</button>
                         </div>
                    </div>
                )}

                {activity === 'draw' && (
                    <div className="bg-white rounded-3xl p-4 shadow-2xl border-4 border-purple-400 relative">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseUp={() => setIsDrawing(false)}
                            onMouseMove={draw}
                            onTouchStart={startDrawing}
                            onTouchEnd={() => setIsDrawing(false)}
                            onTouchMove={draw}
                            className="w-full h-[60vh] bg-white rounded-xl cursor-crosshair touch-none border-2 border-dashed border-gray-200"
                        />
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white p-2 rounded-full shadow-lg border">
                            {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map(color => (
                                <button 
                                    key={color} 
                                    onClick={() => setBrushColor(color)}
                                    className={`w-10 h-10 rounded-full border-2 ${brushColor === color ? 'scale-125 border-gray-800' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                            <button onClick={clearCanvas} className="px-4 bg-gray-200 rounded-full text-sm font-bold">🗑️</button>
                        </div>
                    </div>
                )}

                {showFeedback && (
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                        <div className={`text-6xl font-black text-white p-8 rounded-3xl shadow-2xl transform animate-bounce
                            ${showFeedback === 'correct' ? 'bg-green-500 rotate-6' : 'bg-red-500 -rotate-6'}
                        `}>
                            {showFeedback === 'correct' ? t.correct : t.wrong}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}mport React from 'react';

export default function LoadingScreen({ message = "Invocation de l'IA Gemini..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 animate-fade-in space-y-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-indigo-500 blur-xl opacity-50 animate-pulse"></div>
        <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin relative z-10"></div>
      </div>
      <p className="text-xl font-semibold text-indigo-300 tracking-wider animate-pulse">{message}</p>
    </div>
  );
}import React from 'react';

const MOCK_LEADERS = [
  { rank: 1, name: "AI_Master", score: 9850, avatar: "👑" },
  { rank: 2, name: "Quiz_Wizard", score: 8940, avatar: "🧙‍♂️" },
  { rank: 3, name: "Neon_Blade", score: 8200, avatar: "⚔️" },
  { rank: 4, name: "Gemini_Fan", score: 7500, avatar: "🤖" },
  { rank: 5, name: "React_Dev", score: 7200, avatar: "⚛️" },
];

export default function LeaderboardView({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-2xl animate-fade-in flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-emerald-400 flex items-center gap-2">
          <span>📊</span> Classement Mondial
        </h2>
        <button 
            onClick={onBack} 
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
            title="Fermer"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 mb-8">
        {MOCK_LEADERS.map((leader) => (
          <div 
            key={leader.rank} 
            className={`
              flex items-center justify-between p-4 rounded-xl border border-gray-700/50
              ${leader.rank === 1 ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/30' : 'bg-gray-800'}
              hover:bg-gray-700 transition-all
            `}
          >
            <div className="flex items-center gap-4">
              <span className={`
                w-8 h-8 flex items-center justify-center font-bold rounded-full
                ${leader.rank === 1 ? 'bg-yellow-500 text-black' : 
                  leader.rank === 2 ? 'bg-gray-400 text-black' :
                  leader.rank === 3 ? 'bg-orange-700 text-white' : 'bg-gray-700 text-gray-300'}
              `}>
                {leader.rank}
              </span>
              <span className="text-2xl">{leader.avatar}</span>
              <span className={`font-semibold text-lg ${leader.rank === 1 ? 'text-yellow-400' : 'text-white'}`}>
                {leader.name}
              </span>
            </div>
            <span className="font-mono text-xl text-emerald-400 font-bold">
              {leader.score.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={onBack}
        className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-600 hover:border-gray-500"
      >
        ⬅️ Retour à l'accueil
      </button>
    </div>
  );
}import React, { useEffect, useState } from 'react';
import { generateTournamentBracket } from '../services/geminiService';
import LoadingScreen from './LoadingScreen';
import { Language } from '../types';

interface Participant {
    name: string;
    seed: number;
    strength: string;
}

interface TournamentData {
    tournamentName: string;
    participants: Participant[];
}

export default function TournamentView({ topic, onBack, language }: { topic: string, onBack: () => void, language: Language }) {
    const [data, setData] = useState<TournamentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [winner, setWinner] = useState<Participant | null>(null);

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const result = await generateTournamentBracket(topic || "General", language);
                setData(result);
                if (result && result.participants.length > 0) {
                    setWinner(result.participants[Math.floor(Math.random() * result.participants.length)]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTournament();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <LoadingScreen message="Generating Tournament..." />;

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 rounded-xl border border-violet-500/30 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                 <div>
                    <h2 className="text-3xl font-bold text-violet-400">🏆 {data?.tournamentName || "Tournament"}</h2>
                    <p className="text-gray-400 text-sm">Powered by Gemini AI</p>
                 </div>
                 <button onClick={onBack} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">Back</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-white mb-4">Participants</h3>
                    <ul className="space-y-3">
                        {data?.participants.map((p) => (
                            <li key={p.seed} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold bg-violet-600 px-2 py-1 rounded text-white">#{p.seed}</span>
                                    <span className="font-medium">{p.name}</span>
                                </div>
                                <span className="text-xs text-gray-400 italic">{p.strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col items-center justify-center bg-gradient-to-b from-violet-900/20 to-gray-800/50 p-6 rounded-xl border border-violet-500/20 text-center">
                    <h3 className="text-2xl font-bold text-white mb-6">Winner Prediction</h3>
                    {winner && (
                        <div className="animate-bounce">
                            <span className="text-6xl mb-4 block">👑</span>
                            <div className="text-3xl font-extrabold text-yellow-400 mb-2">{winner.name}</div>
                            <p className="text-violet-300">Strength : {winner.strength}</p>
                        </div>
                    )}
                    <p className="mt-8 text-sm text-gray-500 max-w-xs">
                        * Simulation only.
                    </p>
                </div>
            </div>
        </div>
    );
}