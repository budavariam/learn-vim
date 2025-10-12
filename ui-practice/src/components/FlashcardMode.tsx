import React from 'react';
import { Layers, CheckCircle, XCircle } from 'lucide-react';
import { gameModes, getKnownItems, GameMode } from './QuizGame';
import type { QuizQuestion } from './QuizGame';
import ColoredText from './ColoredText';
import ThemeToggle from './ThemeToggle';

interface FlashcardModeProps {
    question: QuizQuestion;
    currentIndex: number;
    totalQuestions: number;
    gameMode: GameMode | null;
    showFlashAnswer: boolean;
    onShowAnswer: () => void;
    onFlashcardKnown: (known: boolean) => void;
    onQuit: () => void;
    flashcardResponse?: boolean;
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({
    question,
    currentIndex,
    totalQuestions,
    gameMode,
    showFlashAnswer,
    onShowAnswer,
    onFlashcardKnown,
    onQuit,
    flashcardResponse
}) => {
    const config = gameMode ? gameModes[gameMode] : null;
    const knownItems = getKnownItems();
    const isKnown = knownItems.has(question.id || '');

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Layers className="w-8 h-8 color-purple" />
                        <h1 className="text-3xl font-bold color-purple">
                            {config?.name || 'Flashcard Practice'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="terminal-text">
                            <span className="color-blue">Card: </span>
                            <span className="color-cyan font-bold">{currentIndex + 1}/{totalQuestions}</span>
                        </div>
                        <ThemeToggle size="sm" showText={false} />
                    </div>
                </div>

                <div className="progress-bar-bg mb-8">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                    />
                </div>

                <div className="quiz-card fade-in space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold color-yellow mb-2">
                            {question.category}
                        </h2>
                        <div className="theme-divider" />
                    </div>

                    <div className="text-center text-xl terminal-text leading-relaxed min-h-[200px] flex items-center justify-center">
                        <ColoredText text={question.question} />
                    </div>

                    {showFlashAnswer && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                            <div className="text-center space-y-4">
                                <p className="text-lg font-bold color-cyan">Answer:</p>
                                <p className="text-2xl color-yellow font-semibold">
                                    {question.solution.join(', ')}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {!showFlashAnswer ? (
                            <button
                                onClick={onShowAnswer}
                                className="terminal-button-primary w-full text-lg px-8 py-4"
                            >
                                Show Answer
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-center terminal-text color-cyan">
                                    Do you know this command?
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => onFlashcardKnown(true)}
                                        className="terminal-button-success text-lg px-8 py-4 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        I Know This
                                    </button>
                                    <button
                                        onClick={() => onFlashcardKnown(false)}
                                        className="terminal-button-danger text-lg px-8 py-4 flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Still Learning
                                    </button>
                                </div>
                                {flashcardResponse !== undefined && (
                                    <p className="text-center text-xs terminal-text color-green opacity-70">
                                        ✓ Response recorded for this session
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            onClick={onQuit}
                            className="terminal-button-secondary w-full"
                        >
                            End Practice
                        </button>
                    </div>

                    {isKnown && (
                        <div className="text-center">
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full font-medium">
                                ✓ Currently in known items
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlashcardMode;
