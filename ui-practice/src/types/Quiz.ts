export interface QuizQuestion {
    category: string;
    question: string;
    solution: string[];
}

export type GameState = 'intro' | 'playing' | 'answered' | 'finished';

export type GameMode = 'flash' | 'regular' | 'all';

export interface GameModeConfig {
    name: string;
    description: string;
    questionCount: number;
    icon: string;
}

export interface GameStats {
    score: number;
    totalQuestions: number;
    currentIndex: number;
    percentage: number;
}
