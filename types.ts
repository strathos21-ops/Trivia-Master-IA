export type GameMode = 'Battle' | 'Leaderboard' | 'Tournoi' | 'Duel' | 'MortSubite' | 'VraiFaux' | 'Solo' | 'Multijoueur' | 'Custom';
export type Theme = 'light' | 'dark' | 'gamer';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface GameState {
  score: number;
  scoreP2: number;
  activePlayer: 1 | 2;
  currentQuestionIndex: number;
  isGameOver: boolean;
  questions: Question[];
  loading: boolean;
  error: string | null;
  streak: number;
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  INSANE = 'Insane'
}
