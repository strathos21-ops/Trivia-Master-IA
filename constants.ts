import { GameMode } from './types';

export const MODE_COLORS: Record<string, string> = {
  Solo: "bg-indigo-600 hover:bg-indigo-500 text-white ring-indigo-500/50",
  Multijoueur: "bg-pink-600 hover:bg-pink-500 text-white ring-pink-500/50",
  Battle: "bg-amber-500 hover:bg-amber-400 text-white ring-amber-500/50",
  Leaderboard: "bg-emerald-600 hover:bg-emerald-500 text-white ring-emerald-500/50",
  Tournoi: "bg-violet-600 hover:bg-violet-500 text-white ring-violet-500/50",
  Duel: "bg-blue-600 hover:bg-blue-500 text-white ring-blue-500/50",
  MortSubite: "bg-rose-700 hover:bg-rose-600 text-white ring-rose-500/50",
  VraiFaux: "bg-cyan-600 hover:bg-cyan-500 text-white ring-cyan-500/50",
  Custom: "bg-fuchsia-600 hover:bg-fuchsia-500 text-white ring-fuchsia-500/50",
};

export const MODE_DESCRIPTIONS: Record<string, string> = {
  Solo: "Défi classique en solo. Testez vos connaissances.",
  Multijoueur: "Défiez un ami en local. Chacun son tour.",
  Battle: "Affrontez l'IA Gemini. 10 questions pour vaincre la machine.",
  Leaderboard: "Consultez le classement mondial et les stats.",
  Tournoi: "Simulation de tournoi générée par l'IA.",
  Duel: "1v1 Intense contre l'IA. Soyez plus rapide et précis.",
  MortSubite: "Mort Subite. Une erreur et c'est fini.",
  VraiFaux: "Vrai ou Faux ? Répondez le plus vite possible.",
  Custom: "Créez un quiz unique sur le sujet de votre choix.",
};

export const CATEGORIES = [
  { id: 'history', name: 'Histoire', icon: '📜' },
  { id: 'geography', name: 'Géographie', icon: '🌍' },
  { id: 'science', name: 'Sciences', icon: '🔬' },
  { id: 'cinema', name: 'Cinéma', icon: '🎬' },
  { id: 'sport', name: 'Sport', icon: '⚽' },
  { id: 'music', name: 'Musique', icon: '🎵' },
  { id: 'tech', name: 'Tech', icon: '💻' },
  { id: 'arts', name: 'Arts', icon: '🎨' },
  { id: 'nature', name: 'Animaux', icon: '🦁' },
  { id: 'videogames', name: 'Jeux Vidéo', icon: '🎮' },
];