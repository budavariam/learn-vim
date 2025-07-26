export interface QuizQuestion {
  category: string;
  question: string;
  solution: string[];
}

export type GameState = 'playing' | 'answered' | 'finished';

export interface GameStats {
  score: number;
  totalQuestions: number;
  currentIndex: number;
  percentage: number;
}
