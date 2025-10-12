import React from 'react';
import { Trophy, Eye, RotateCcw, Shuffle, Download } from 'lucide-react';
import { gameModes, GameMode } from './QuizGame';
import type { QuizResult } from './QuizGame';
import ThemeToggle from './ThemeToggle';

interface FinishedScreenProps {
    gameMode: GameMode | null;
    score: number;
    totalQuestions: number;
    results: QuizResult[];
    flashcardResponseCount: number;
    onReview: () => void;
    onReset: () => void;
    onRetry: () => void;
    onApplyFlashcard: () => void;
}

const FinishedScreen: React.FC<FinishedScreenProps> = ({
    gameMode,
    score,
    totalQuestions,
    results,
    flashcardResponseCount,
    onReview,
    onReset,
    onRetry,
    onApplyFlashcard
}) => {
    const config = gameMode ? gameModes[gameMode] : null;
    const isFlashcardMode = gameMode?.startsWith('flashcard');
    const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-8 fade-in">
                <ThemeToggle size="sm" className="mx-auto" />

                <Trophy className="w-24 h-24 color-yellow mx-auto" />

                <div className="space-y-4">
                    <h2 className="text-4xl font-bold color-cyan">
                        {config?.name} Complete!
                    </h2>

                    {!isFlashcardMode && (
                        <>
                            <div className="text-6xl font-bold color-green">
                                {score}/{totalQuestions}
                            </div>

                            <p className="text-2xl color-yellow">{accuracy}% Accuracy</p>

                            <div className="terminal-text text-lg">
                                {accuracy >= 90 ? (
                                    <span className="color-green">Outstanding! Perfect mastery! 🏆</span>
                                ) : accuracy >= 80 ? (
                                    <span className="color-green">Excellent work! 🎉</span>
                                ) : accuracy >= 60 ? (
                                    <span className="color-yellow">Good job! Keep practicing! 👍</span>
                                ) : (
                                    <span className="color-red">Keep studying and try again! 📚</span>
                                )}
                            </div>
                        </>
                    )}

                    {isFlashcardMode && (
                        <div className="space-y-4">
                            <p className="text-xl terminal-text color-cyan">
                                You've completed the flashcard practice session!
                            </p>
                            <p className="text-lg terminal-text color-yellow">
                                Reviewed {flashcardResponseCount} card{flashcardResponseCount !== 1 ? 's' : ''}
                            </p>
                            {flashcardResponseCount > 0 && (
                                <div className="quiz-card max-w-md mx-auto">
                                    <p className="text-sm color-cyan mb-4">
                                        Would you like to update your known items list based on this session?
                                    </p>
                                    <button
                                        onClick={onApplyFlashcard}
                                        className="terminal-button-success w-full flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Apply Changes to Known Items
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 justify-center flex-wrap">
                    {!isFlashcardMode && results.length > 0 && (
                        <button
                            onClick={onReview}
                            className="terminal-button-primary"
                        >
                            <Eye className="w-5 h-5 inline mr-2" />
                            Review Answers
                        </button>
                    )}
                    <button
                        onClick={onReset}
                        className="terminal-button-secondary"
                    >
                        <RotateCcw className="w-5 h-5 inline mr-2" />
                        Try Different Mode
                    </button>
                    <button
                        onClick={onRetry}
                        className="terminal-button-secondary"
                    >
                        <Shuffle className="w-5 h-5 inline mr-2" />
                        Retry {config?.name}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinishedScreen;
