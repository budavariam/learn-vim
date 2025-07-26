import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Trophy, Target, CheckCircle, XCircle, Sun, Moon } from 'lucide-react';
import ColoredText from './ColoredText';
import quizData from '../data.json';
import { QuizQuestion, GameState, GameStats } from '../types/quiz';
import { useTheme } from '../hooks/useTheme';

const QuizGame: React.FC = () => {
    const [gameData, setGameData] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [gameState, setGameState] = useState<GameState>('playing');
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    const theme = useTheme();

    useEffect(() => {
        shuffleQuestions();
    }, []);

    const shuffleQuestions = (): void => {
        const shuffled = [...(quizData as QuizQuestion[])].sort(() => Math.random() - 0.5);
        setGameData(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setGameState('playing');
        setGameStarted(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!userAnswer.trim()) return;

        const currentQuestion = gameData[currentIndex];
        const correct = currentQuestion.solution.includes(userAnswer.trim());

        setIsCorrect(correct);
        if (correct) {
            setScore(score + 1);
        }

        setShowAnswer(true);
        setGameState('answered');
    };

    const nextQuestion = (): void => {
        if (currentIndex + 1 >= gameData.length) {
            setGameState('finished');
        } else {
            setCurrentIndex(currentIndex + 1);
            setUserAnswer('');
            setShowAnswer(false);
            setGameState('playing');
        }
    };

    const resetGame = (): void => {
        shuffleQuestions();
        setUserAnswer('');
        setShowAnswer(false);
        setGameStarted(false);
    };

    const quitGame = (): void => {
        setGameState('finished');
    };

    if (!gameStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-8 fade-in">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            {theme === 'dark' ? (
                                <Moon className="w-8 h-8 color-cyan" />
                            ) : (
                                <Sun className="w-8 h-8 color-yellow" />
                            )}
                            <span className="text-sm color-cyan">
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'} (Auto-detected)
                            </span>
                        </div>
                        <h1 className="text-5xl font-bold color-cyan typing-animation">
                            Interactive Quiz Game
                        </h1>
                        <p className="text-xl color-yellow">
                            Test your knowledge with {quizData.length} questions
                        </p>
                    </div>

                    <div className="space-y-4 max-w-md mx-auto">
                        <p className="terminal-text color-green">
                            If there are some <span className="color-green font-semibold">color coded texts</span>,
                            those should be included in the answer.
                        </p>
                        <p className="terminal-text">
                            The game lasts until you finish all questions or click 'Quit'. Happy practicing!
                        </p>
                    </div>

                    <button
                        onClick={() => setGameStarted(true)}
                        className="terminal-button-primary text-xl px-8 py-4"
                    >
                        Start Game
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'finished') {
        const percentage = Math.round((score / (currentIndex + (showAnswer ? 1 : 0))) * 100);

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-8 fade-in">
                    <Trophy className="w-24 h-24 color-yellow mx-auto" />

                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold color-cyan">Game Finished!</h2>
                        <div className="text-6xl font-bold color-green">
                            {score}/{currentIndex + (showAnswer ? 1 : 0)}
                        </div>
                        <p className="text-2xl color-yellow">
                            {percentage}% Accuracy
                        </p>

                        <div className="terminal-text text-lg">
                            {percentage >= 80 ? (
                                <span className="color-green">Excellent work! 🎉</span>
                            ) : percentage >= 60 ? (
                                <span className="color-yellow">Good job! Keep practicing! 👍</span>
                            ) : (
                                <span className="color-red">Keep studying and try again! 📚</span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button onClick={resetGame} className="terminal-button-primary">
                            <RotateCcw className="w-5 h-5 inline mr-2" />
                            Play Again
                        </button>
                        <button onClick={shuffleQuestions} className="terminal-button-secondary">
                            <Shuffle className="w-5 h-5 inline mr-2" />
                            Shuffle & Restart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = gameData[currentIndex];
    if (!currentQuestion) return null;

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Target className="w-8 h-8 color-cyan" />
                        <h1 className="text-3xl font-bold color-cyan">Quiz Game</h1>
                        <div className="flex items-center gap-2 ml-4">
                            {theme === 'dark' ? (
                                <Moon className="w-5 h-5 color-cyan" />
                            ) : (
                                <Sun className="w-5 h-5 color-yellow" />
                            )}
                            <span className="text-sm color-cyan opacity-70">
                                {theme === 'dark' ? 'Dark' : 'Light'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="terminal-text">
                            <span className="color-yellow">Score: </span>
                            <span className="color-green font-bold text-xl">{score}</span>
                            <span className="color-cyan">/{currentIndex + (gameState === 'answered' ? 1 : 0)}</span>
                        </div>
                        <div className="terminal-text">
                            <span className="color-blue">Question: </span>
                            <span className="color-cyan font-bold">{currentIndex + 1}/{gameData.length}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-bg mb-8">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentIndex + 1) / gameData.length) * 100}%` }}
                    ></div>
                </div>

                {/* Question Card */}
                <div className="quiz-card fade-in">
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold color-yellow mb-2">
                                {currentQuestion.category}
                            </h2>
                            <div className="theme-divider"></div>
                        </div>

                        <div className="text-center text-xl terminal-text leading-relaxed">
                            <ColoredText text={currentQuestion.question} />
                        </div>

                        {!showAnswer ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        placeholder="Type your answer here..."
                                        className="terminal-input w-full text-lg"
                                        autoFocus
                                    />
                                </div>

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
                                        onClick={quitGame}
                                        className="terminal-button-danger"
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
                                        {currentQuestion.solution.join(', ')}
                                    </span>
                                </div>

                                <button
                                    onClick={nextQuestion}
                                    className="terminal-button-primary text-lg px-8 py-3"
                                >
                                    {currentIndex + 1 >= gameData.length ? 'Finish Game' : 'Next Question'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center terminal-text color-cyan opacity-60">
                    <p>Press Enter to submit • Type your answer exactly as shown</p>
                </div>
            </div>
        </div>
    );
};

export default QuizGame;
