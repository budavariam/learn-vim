import React from 'react';
import { Target, CheckCircle, XCircle } from 'lucide-react';
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
    onAnswerChange: (answer: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onNext: (e: React.FormEvent) => void;
    onQuit: () => void;
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
    onAnswerChange,
    onSubmit,
    onNext,
    onQuit
}) => {
    const config = gameMode ? gameModes[gameMode] : null;

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
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

                    <div className="text-center text-xl terminal-text leading-relaxed">
                        <ColoredText text={question.question} />
                    </div>

                    {!showAnswer ? (
                        <form onSubmit={onSubmit} className="space-y-6">
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={e => onAnswerChange(e.target.value)}
                                placeholder="Type your answer here..."
                                className="terminal-input w-full text-lg"
                                autoFocus
                            />
                            <div className="flex gap-4 justify-center">
                                <button
                                    type="submit"
                                    className="terminal-button-primary"
                                    disabled={!userAnswer.trim()}
                                >
                                    Submit Answer
                                </button>
                                <button
                                    type="button"
                                    className="terminal-button-danger"
                                    onClick={onQuit}
                                >
                                    Quit Game
                                </button>
                            </div>
                        </form>
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

                            <div className="terminal-text">
                                <span className="color-cyan">Correct answer(s): </span>
                                <span className="color-yellow font-semibold">
                                    {question.solution.join(', ')}
                                </span>
                            </div>

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

export default QuizPlayingMode;
