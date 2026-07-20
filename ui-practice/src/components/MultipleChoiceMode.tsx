import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Grid3x3, CheckCircle, XCircle } from 'lucide-react';
import { gameModes, GameMode } from './QuizGame';
import type { QuizQuestion } from './QuizGame';
import ColoredText from './ColoredText';
import ThemeToggle from './ThemeToggle';

interface MultipleChoiceModeProps {
    question: QuizQuestion;
    currentIndex: number;
    totalQuestions: number;
    score: number;
    gameMode: GameMode | null;
    mcOptions: string[];
    showAnswer: boolean;
    isCorrect: boolean;
    userAnswer: string;
    showLevelBadge: boolean;
    onMCAnswer: (answer: string) => void;
    onNext: (e: React.FormEvent) => void;
    onHome: () => void;
    onQuit: () => void;
    onToggleLevelBadge: () => void;
}

const MultipleChoiceMode: React.FC<MultipleChoiceModeProps> = ({
    question,
    currentIndex,
    totalQuestions,
    score,
    gameMode,
    mcOptions,
    showAnswer,
    isCorrect,
    userAnswer,
    showLevelBadge,
    onMCAnswer,
    onNext,
    onHome,
    onQuit,
    onToggleLevelBadge
}) => {
    const config = gameMode ? gameModes[gameMode] : null;
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Reset selection when question changes
    useEffect(() => {
        setSelectedAnswer(null);
        if (timerRef.current) clearTimeout(timerRef.current);
    }, [currentIndex]);

    const handleAnswer = useCallback((option: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(option);
        timerRef.current = setTimeout(() => {
            onMCAnswer(option);
        }, 1000);
    }, [selectedAnswer, onMCAnswer]);

    // Keyboard support for 1-4 keys
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!showAnswer && !selectedAnswer && mcOptions.length > 0) {
                const keyNum = parseInt(e.key);
                if (keyNum >= 1 && keyNum <= 4 && keyNum <= mcOptions.length) {
                    handleAnswer(mcOptions[keyNum - 1]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showAnswer, selectedAnswer, mcOptions, handleAnswer]);

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => onHome()}>
                        <Grid3x3 className="w-8 h-8 color-cyan" />
                        <h1 className="text-3xl font-bold color-cyan">
                            {config?.name || 'Multiple Choice Quiz'}
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
                    <div className="text-center">
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

                    <div className="text-center text-xl terminal-text leading-relaxed">
                        <ColoredText text={question.question} />
                    </div>

                    {!showAnswer ? (
                        <div className="space-y-3">
                            {mcOptions && mcOptions.length > 0 ? (
                                <>
                                    <p className="text-center text-sm terminal-text color-cyan opacity-70 mb-4">
                                        Press 1-4 or click to select
                                    </p>
                                    {mcOptions.map((option, index) => {
                                        const isCorrectOption = question.solution.includes(option);
                                        const isSelected = selectedAnswer === option;
                                        let btnClass = 'w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-300 ';
                                        if (selectedAnswer) {
                                            if (isCorrectOption) {
                                                btnClass += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100';
                                            } else if (isSelected) {
                                                btnClass += 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100';
                                            } else {
                                                btnClass += 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 opacity-50';
                                            }
                                        } else {
                                            btnClass += 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md text-gray-800 dark:text-gray-200';
                                        }
                                        return (
                                            <button
                                                key={`mc-${currentIndex}-${index}`}
                                                onClick={() => handleAnswer(option)}
                                                disabled={!!selectedAnswer}
                                                className={btnClass}
                                            >
                                                <span className="inline-flex items-center gap-3">
                                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors duration-300 ${
                                                        selectedAnswer
                                                            ? isCorrectOption
                                                                ? 'bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100'
                                                                : isSelected
                                                                    ? 'bg-red-200 dark:bg-red-700 text-red-900 dark:text-red-100'
                                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-lg">{option}</span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="terminal-text color-cyan">Loading options...</p>
                                </div>
                            )}
                            <button
                                onClick={onQuit}
                                className="terminal-button-danger w-full mt-6"
                            >
                                Quit Game
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 text-center">
                            <div className="flex items-center justify-center gap-3">
                                {isCorrect ? (
                                    <CheckCircle className="w-8 h-8 color-green" />
                                ) : (
                                    <XCircle className="w-8 h-8 color-red" />
                                )}
                                <span className={`text-2xl font-bold ${isCorrect ? 'color-green' : 'color-red'}`}>
                                    {isCorrect ? 'Correct!' : 'Incorrect'}
                                </span>
                            </div>

                            <div className="terminal-text">
                                <span className="color-cyan">Your answer: </span>
                                <span className={isCorrect ? 'color-green' : 'color-red'}>
                                    {userAnswer}
                                </span>
                            </div>

                            {!isCorrect && (
                                <div className="terminal-text">
                                    <span className="color-cyan">Correct answer: </span>
                                    <span className="color-yellow font-semibold">
                                        {question.solution.join(', ')}
                                    </span>
                                </div>
                            )}

                            <form onSubmit={onNext} className="space-y-6">
                                <button
                                    type="submit"
                                    className="terminal-button-primary text-lg px-8 py-3"
                                    autoFocus
                                >
                                    {currentIndex + 1 >= totalQuestions ? 'Finish Game' : 'Next Question'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultipleChoiceMode;
