import React, { useRef, useEffect } from 'react';
import { Target, CheckCircle, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { gameModes, GameMode } from './QuizGame';
import type { QuizQuestion } from './QuizGame';
import ColoredText from './ColoredText';
import ThemeToggle from './ThemeToggle';

interface QuizPlayingModeProps {
    question: QuizQuestion;
    currentIndex: number;
    totalQuestions: number;
    score: number;
    gameMode: GameMode | null;
    userAnswer: string;
    showAnswer: boolean;
    isCorrect: boolean;
    knownItems: Set<string>;
    showLevelBadge: boolean;
    onAnswerChange: (answer: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onNext: (e: React.FormEvent) => void;
    onQuit: () => void;
    onHome: () => void;
    onToggleKnown: (questionId: string | undefined) => void;
    onToggleLevelBadge: () => void;
}

const QuizPlayingMode: React.FC<QuizPlayingModeProps> = ({
    question,
    currentIndex,
    totalQuestions,
    score,
    gameMode,
    userAnswer,
    showAnswer,
    isCorrect,
    knownItems,
    showLevelBadge,
    onAnswerChange,
    onSubmit,
    onNext,
    onHome,
    onQuit,
    onToggleKnown,
    onToggleLevelBadge
}) => {
    const config = gameMode ? gameModes[gameMode] : null;
    const isCurrentlyKnown = knownItems.has(question.id || '');
    const nextBtnRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Move focus to Next button after answer is revealed
    useEffect(() => {
        if (showAnswer) {
            nextBtnRef.current?.focus();
        } else {
            inputRef.current?.focus();
        }
    }, [showAnswer, currentIndex]);

    const inputBorderClass = !showAnswer
        ? 'terminal-input'
        : isCorrect
            ? 'terminal-input border-green-500 dark:border-green-500 color-green'
            : 'terminal-input border-red-500 dark:border-red-500 color-red';

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => onHome()}>
                        <Target className="w-8 h-8 color-cyan" />
                        <h1 className="text-3xl font-bold color-cyan">
                            {config?.name || 'Quiz Game'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="terminal-text">
                            <span className="color-yellow">Score: </span>
                            <span className="color-green font-bold text-xl">{score}</span>
                            <span className="color-cyan">/{totalQuestions}</span>
                        </div>
                        <div className="terminal-text">
                            <span className="color-blue">Question: </span>
                            <span className="color-cyan font-bold">{currentIndex + 1}/{totalQuestions}</span>
                        </div>
                        <button
                            onClick={onToggleLevelBadge}
                            title={showLevelBadge ? 'Hide difficulty level' : 'Show difficulty level'}
                            className={`text-xs font-mono px-2 py-1 rounded border transition-colors ${showLevelBadge ? 'border-cyan-500 color-cyan bg-cyan-500/10' : 'border-gray-400 dark:border-gray-600 text-gray-400 dark:text-gray-500'}`}
                        >
                            Lv
                        </button>
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
                    {/* Category row with known toggle anchored to the right */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <h2 className="text-2xl font-bold color-yellow">
                                    {question.category}
                                </h2>
                                {showLevelBadge && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 color-cyan font-mono border border-cyan-300 dark:border-cyan-700">
                                        Lv.{question.level}
                                    </span>
                                )}
                            </div>
                            <div className="theme-divider" />
                        </div>

                        {/* invisible until answered — holds layout space */}
                        <button
                            onClick={() => onToggleKnown(question.id)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 mt-1 ${
                                showAnswer
                                    ? isCurrentlyKnown
                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    : 'invisible pointer-events-none bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                            title={isCurrentlyKnown ? 'Mark as unknown' : 'Mark as known'}
                            tabIndex={showAnswer ? 0 : -1}
                        >
                            {isCurrentlyKnown ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                            <span className="hidden sm:inline">{isCurrentlyKnown ? 'Known' : 'Unknown'}</span>
                        </button>
                    </div>

                    <div className="text-center text-xl terminal-text leading-relaxed">
                        <ColoredText text={question.question} />
                    </div>

                    <form onSubmit={showAnswer ? onNext : onSubmit} className="space-y-4">
                        {/* Input — read-only + colored after submit */}
                        <input
                            ref={inputRef}
                            type="text"
                            value={userAnswer}
                            onChange={e => !showAnswer && onAnswerChange(e.target.value)}
                            readOnly={showAnswer}
                            placeholder="Type your answer here..."
                            className={`w-full text-lg transition-colors duration-300 ${inputBorderClass}`}
                        />

                        {/* Verdict + correct answer — expands in place after submit */}
                        <div className={`overflow-hidden transition-all duration-300 ${showAnswer ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 terminal-text text-sm">
                                <span className={`flex items-center gap-1.5 font-bold ${isCorrect ? 'color-green' : 'color-red'}`}>
                                    {isCorrect
                                        ? <CheckCircle className="w-4 h-4" />
                                        : <XCircle className="w-4 h-4" />
                                    }
                                    {isCorrect ? 'Correct!' : 'Incorrect'}
                                </span>
                                {!isCorrect && (
                                    <span>
                                        <span className="color-cyan">Answer: </span>
                                        <span className="color-yellow font-semibold">{question.solution.join(', ')}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                ref={nextBtnRef}
                                type="submit"
                                disabled={showAnswer ? false : !userAnswer.trim()}
                                className={`terminal-button-primary flex-1 text-lg py-3 transition-opacity duration-200 ${!showAnswer && !userAnswer.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                                {showAnswer
                                    ? (currentIndex + 1 >= totalQuestions ? 'Finish Game' : 'Next Question')
                                    : 'Submit Answer'
                                }
                            </button>
                            <button
                                type="button"
                                onClick={onQuit}
                                className="terminal-button-danger sm:w-auto"
                            >
                                Quit Game
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QuizPlayingMode;
