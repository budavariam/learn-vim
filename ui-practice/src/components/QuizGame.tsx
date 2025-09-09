import React, { useReducer, FormEvent, useState, useEffect } from 'react';
import {
    Shuffle, RotateCcw, Trophy, Target,
    CheckCircle, XCircle, Zap, BookOpen, Database,
    Download, Plus, Minus, Eye, ToggleLeft, ToggleRight
} from 'lucide-react';
import quizData from '../data.json';
import ColoredText from './ColoredText';
import ThemeToggle from './ThemeToggle';
import TypingText from './TypingText';

/* ──────────────────── types ──────────────────── */

interface QuizQuestion {
    id?: string;
    category: string;
    question: string;
    solution: string[];
}

interface QuizResult {
    question: QuizQuestion;
    userAnswer: string;
    isCorrect: boolean;
    wasKnownBefore: boolean;
}

type GameState = 'intro' | 'mode-select' | 'playing' | 'answered' | 'finished' | 'review';
type GameMode = 'flash' | 'regular' | 'all';

interface GameModeConfig {
    name: string;
    description: string;
    questionCount: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
}

interface State {
    gameState: GameState;
    gameMode: GameMode | null;
    questions: QuizQuestion[];
    currentIndex: number;
    score: number;
    userAnswer: string;
    isCorrect: boolean;
    showAnswer: boolean;
    results: QuizResult[];
}

type Action =
    | { type: 'SELECT_MODE'; payload: GameMode }
    | { type: 'START_GAME' }
    | { type: 'ANSWER'; payload: { answer: string } }
    | { type: 'NEXT_QUESTION' }
    | { type: 'QUIT_GAME' }
    | { type: 'RESET' }
    | { type: 'SET_USER_ANSWER'; payload: string }
    | { type: 'SHOW_REVIEW' }
    | { type: 'BACK_TO_RESULTS' };

/* ────────────────── helpers ──────────────────── */

const shuffle = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

const gameModes: Record<GameMode, GameModeConfig> = {
    flash: {
        name: "Flash Mode",
        description: "Quick 10-question challenge",
        questionCount: 10,
        icon: Zap,
        color: "color-yellow",
        bgColor: "from-yellow-500 to-orange-500"
    },
    regular: {
        name: "Regular Mode",
        description: "Standard 50-question practice",
        questionCount: 50,
        icon: BookOpen,
        color: "color-blue",
        bgColor: "from-blue-500 to-purple-500"
    },
    all: {
        name: "Master Mode",
        description: `All ${quizData.length} questions`,
        questionCount: quizData.length,
        icon: Database,
        color: "color-green",
        bgColor: "from-green-500 to-teal-500"
    }
};

// Helper function to get known items from localStorage
const getKnownItems = (): Set<string> => {
    try {
        const saved = JSON.parse(localStorage.getItem('knownItems') || '[]');
        return new Set(saved);
    } catch (error) {
        console.error('Error reading knownItems from localStorage:', error);
        return new Set();
    }
};

// Helper function to save known items to localStorage
const saveKnownItems = (knownItems: Set<string>) => {
    try {
        localStorage.setItem('knownItems', JSON.stringify([...knownItems]));
    } catch (error) {
        console.error('Error saving knownItems to localStorage:', error);
    }
};

// Helper function to calculate impact of add/remove operations
const calculateImpacts = (results: QuizResult[]) => {
    const knownItems = getKnownItems();
    const correctAnswers = results.filter(r => r.isCorrect);
    const incorrectAnswers = results.filter(r => !r.isCorrect);

    // Calculate how many correct items are NOT already known
    const correctToAdd = correctAnswers.filter(result =>
        result.question.id && !knownItems.has(result.question.id)
    ).length;

    // Calculate how many incorrect items ARE currently known
    const incorrectToRemove = incorrectAnswers.filter(result =>
        result.question.id && knownItems.has(result.question.id)
    ).length;

    return { correctToAdd, incorrectToRemove };
};

const getQuestionsForMode = (mode: GameMode, allQuestions: QuizQuestion[]): QuizQuestion[] => {
    const shuffled = shuffle(allQuestions);
    const { questionCount } = gameModes[mode];
    return shuffled.slice(0, Math.min(questionCount, shuffled.length));
};

const initialQuestions = shuffle(quizData as QuizQuestion[]);

const initialState: State = {
    gameState: 'intro',
    gameMode: null,
    questions: initialQuestions,
    currentIndex: 0,
    score: 0,
    userAnswer: '',
    isCorrect: false,
    showAnswer: false,
    results: []
};

/* ────────────────── reducer ──────────────────── */

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SELECT_MODE':
            const modeQuestions = getQuestionsForMode(action.payload, quizData as QuizQuestion[]);
            return {
                ...state,
                gameState: 'mode-select',
                gameMode: action.payload,
                questions: modeQuestions,
                results: []
            };

        case 'START_GAME':
            return {
                ...state,
                gameState: 'playing',
                currentIndex: 0,
                score: 0,
                userAnswer: '',
                isCorrect: false,
                showAnswer: false,
                results: []
            };

        case 'SET_USER_ANSWER':
            return { ...state, userAnswer: action.payload };

        case 'ANSWER': {
            const currentQ = state.questions[state.currentIndex];
            const correct = currentQ.solution.includes(action.payload.answer.trim());
            const knownItems = getKnownItems();
            const wasKnownBefore = knownItems.has(currentQ.id || '');

            const newResult: QuizResult = {
                question: currentQ,
                userAnswer: action.payload.answer.trim(),
                isCorrect: correct,
                wasKnownBefore
            };

            return {
                ...state,
                isCorrect: correct,
                score: correct ? state.score + 1 : state.score,
                gameState: 'answered',
                showAnswer: true,
                results: [...state.results, newResult]
            };
        }

        case 'NEXT_QUESTION': {
            const nextIndex = state.currentIndex + 1;
            if (nextIndex >= state.questions.length) {
                return {
                    ...state,
                    gameState: 'finished'
                };
            }
            return {
                ...state,
                currentIndex: nextIndex,
                gameState: 'playing',
                userAnswer: '',
                showAnswer: false
            };
        }

        case 'QUIT_GAME':
            return {
                ...state,
                gameState: 'finished'
            };

        case 'SHOW_REVIEW':
            return {
                ...state,
                gameState: 'review'
            };

        case 'BACK_TO_RESULTS':
            return {
                ...state,
                gameState: 'finished'
            };

        case 'RESET':
            return {
                ...initialState,
                questions: shuffle(quizData as QuizQuestion[])
            };

        default:
            return state;
    }
}

/* ───────────────── component ─────────────────── */

const QuizGame: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [currentKnownItems, setCurrentKnownItems] = useState<Set<string>>(new Set());

    // Update local known items state when entering review
    useEffect(() => {
        if (state.gameState === 'review') {
            setCurrentKnownItems(getKnownItems());
        }
    }, [state.gameState]);

    const {
        gameState, gameMode, questions, currentIndex,
        score, userAnswer, isCorrect, showAnswer, results
    } = state;

    /* ──────────────── handlers ─────────────── */

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim()) return;
        dispatch({ type: 'ANSWER', payload: { answer: userAnswer } });
    };

    const handleNextQuestion = (e: FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'NEXT_QUESTION' });
    };

    const handleModeSelect = (mode: GameMode) => {
        dispatch({ type: 'SELECT_MODE', payload: mode });
    };

    const accuracy = (() => {
        const totalAnswered = gameState === 'finished' && showAnswer
            ? currentIndex + 1
            : currentIndex;

        if (totalAnswered === 0) return 0;
        return Math.round((score / totalAnswered) * 100);
    })();

    // Export functions for review section
    const exportKnownItems = () => {
        const knownItems = getKnownItems();
        const knownItemsArray = [...knownItems];
        const dataStr = JSON.stringify(knownItemsArray, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'knownItems.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const addCorrectToKnownItems = () => {
        const knownItems = getKnownItems();
        const correctResults = results.filter(result => result.isCorrect);
        let addedCount = 0;

        correctResults.forEach(result => {
            if (result.question.id && !knownItems.has(result.question.id)) {
                knownItems.add(result.question.id);
                addedCount++;
            }
        });

        saveKnownItems(knownItems);
        setCurrentKnownItems(new Set(knownItems));
        if (addedCount === 0) {
            alert(`All ${correctResults.length} correctly answered items were already in known items!`);
        } else {
            alert(`Added ${addedCount} new items to known items! (${correctResults.length - addedCount} were already known)`);
        }
    };

    const removeIncorrectFromKnownItems = () => {
        const knownItems = getKnownItems();
        const incorrectResults = results.filter(result => !result.isCorrect);
        let removedCount = 0;

        incorrectResults.forEach(result => {
            if (result.question.id && knownItems.has(result.question.id)) {
                knownItems.delete(result.question.id);
                removedCount++;
            }
        });

        saveKnownItems(knownItems);
        setCurrentKnownItems(new Set(knownItems));
        if (removedCount === 0) {
            alert(`None of the ${incorrectResults.length} missed items were in known items!`);
        } else {
            alert(`Removed ${removedCount} items from known items! (${incorrectResults.length - removedCount} were not previously known)`);
        }
    };

    // Individual item toggle function
    const toggleKnownItem = (questionId: string | undefined) => {
        if (!questionId) return;

        const knownItems = getKnownItems();
        if (knownItems.has(questionId)) {
            knownItems.delete(questionId);
        } else {
            knownItems.add(questionId);
        }

        saveKnownItems(knownItems);
        setCurrentKnownItems(new Set(knownItems));
    };

    /* ────────────────── UI ─────────────────── */

    // Intro Page
    if (gameState === 'intro') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-8 fade-in">
                    <ThemeToggle size="md" className="mx-auto mb-4" />

                    <TypingText
                        text="Interactive Quiz Game"
                        className="text-5xl font-bold color-cyan"
                        speed={80}
                        startDelay={300}
                        onComplete={() => {
                            console.log('Typing animation completed');
                        }}
                    />
                    <p className="text-xl color-yellow">
                        Test your Vim knowledge with different challenge modes
                    </p>

                    <div className="space-y-4 max-w-md mx-auto">
                        <p className="terminal-text color-green">
                            If there are <span className="font-semibold">color coded texts</span>,
                            include them in the answer.
                        </p>
                    </div>

                    {/* Mode Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
                        {Object.entries(gameModes).map(([mode, config]) => {
                            const IconComponent = config.icon;
                            return (
                                <div
                                    key={mode}
                                    onClick={() => handleModeSelect(mode as GameMode)}
                                    className="group cursor-pointer h-full"
                                >
                                    <div className="quiz-card hover:scale-105 transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
                                        <div className="text-center space-y-4 flex-grow flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${config.bgColor} flex items-center justify-center`}>
                                                    <IconComponent className="w-8 h-8 text-white" />
                                                </div>

                                                <h3 className={`text-2xl font-bold ${config.color}`}>
                                                    {config.name}
                                                </h3>

                                                <p className="terminal-text color-cyan min-h-[3rem] flex items-center justify-center">
                                                    {config.description}
                                                </p>

                                                <div className="text-lg font-mono color-yellow">
                                                    {config.questionCount} Questions
                                                </div>
                                            </div>

                                            <button className="terminal-button-primary w-full group-hover:shadow-lg mt-4">
                                                Start {config.name}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center terminal-text color-cyan opacity-60 mt-8">
                        <p>Choose your challenge level to begin</p>
                    </div>
                </div>
            </div>
        );
    }

    // Mode Selected - Confirmation
    if (gameState === 'mode-select' && gameMode) {
        const config = gameModes[gameMode];
        const IconComponent = config.icon;

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-8 fade-in">
                    <ThemeToggle size="sm" className="mx-auto" />

                    <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${config.bgColor} flex items-center justify-center`}>
                        <IconComponent className="w-12 h-12 text-white" />
                    </div>

                    <h2 className={`text-4xl font-bold ${config.color}`}>
                        {config.name}
                    </h2>

                    <div className="space-y-4">
                        <p className="text-xl terminal-text color-yellow">
                            {config.description}
                        </p>
                        <p className="text-lg terminal-text color-cyan">
                            {config.questionCount} questions • Multiple choice answers
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => dispatch({ type: 'START_GAME' })}
                            className="terminal-button-primary text-xl px-8 py-4"
                        >
                            Begin Quiz
                        </button>
                        <button
                            onClick={() => dispatch({ type: 'RESET' })}
                            className="terminal-button-secondary text-xl px-8 py-4"
                        >
                            Choose Different Mode
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Review Section
    if (gameState === 'review') {
        const correctAnswers = results.filter(r => r.isCorrect);
        const incorrectAnswers = results.filter(r => !r.isCorrect);
        const knownButMissed = results.filter(r => !r.isCorrect && r.wasKnownBefore);
        const { correctToAdd, incorrectToRemove } = calculateImpacts(results);

        return (
            <div className="min-h-screen p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <Eye className="w-8 h-8 color-cyan" />
                            <h1 className="text-3xl font-bold color-cyan">Review Session</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle size="sm" showText={false} />
                            <button
                                onClick={() => dispatch({ type: 'BACK_TO_RESULTS' })}
                                className="terminal-button-secondary"
                            >
                                Back to Results
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <button
                            onClick={exportKnownItems}
                            className="terminal-button-primary flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export Known Items
                        </button>
                        <button
                            onClick={addCorrectToKnownItems}
                            className="terminal-button-success flex items-center justify-center gap-2"
                            disabled={correctToAdd === 0}
                            title={correctToAdd === 0 ? "All correct answers are already in known items" : `Will add ${correctToAdd} new items to known list`}
                        >
                            <Plus className="w-4 h-4" />
                            Add Correct (+{correctToAdd})
                        </button>
                        <button
                            onClick={removeIncorrectFromKnownItems}
                            className="terminal-button-danger flex items-center justify-center gap-2"
                            disabled={incorrectToRemove === 0}
                            title={incorrectToRemove === 0 ? "No incorrect answers are in known items" : `Will remove ${incorrectToRemove} items from known list`}
                        >
                            <Minus className="w-4 h-4" />
                            Remove Missed (-{incorrectToRemove})
                        </button>
                        <div className="terminal-text color-yellow text-center p-2 rounded">
                            Known but Missed: {knownButMissed.length}
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="quiz-card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <div className="text-center space-y-2">
                                <CheckCircle className="w-12 h-12 color-green mx-auto" />
                                <h3 className="text-2xl font-bold color-green">Correct</h3>
                                <p className="text-3xl font-mono color-green">{correctAnswers.length}</p>
                            </div>
                        </div>
                        <div className="quiz-card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                            <div className="text-center space-y-2">
                                <XCircle className="w-12 h-12 color-red mx-auto" />
                                <h3 className="text-2xl font-bold color-red">Incorrect</h3>
                                <p className="text-3xl font-mono color-red">{incorrectAnswers.length}</p>
                            </div>
                        </div>
                        <div className="quiz-card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                            <div className="text-center space-y-2">
                                <Target className="w-12 h-12 color-yellow mx-auto" />
                                <h3 className="text-2xl font-bold color-yellow">Accuracy</h3>
                                <p className="text-3xl font-mono color-yellow">{accuracy}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Review */}
                    <div className="space-y-6">
                        {results.length > 0 && (
                            <div className="quiz-card">
                                <h2 className="text-2xl font-bold color-cyan mb-6">Detailed Review</h2>
                                <div className="space-y-4">
                                    {results.map((result, index) => {
                                        const isCurrentlyKnown = currentKnownItems.has(result.question.id || '');
                                        return (
                                            <div
                                                key={index}
                                                className={`p-4 rounded-lg border-2 ${result.isCorrect
                                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 mt-1">
                                                        {result.isCorrect ? (
                                                            <CheckCircle className="w-6 h-6 color-green" />
                                                        ) : (
                                                            <XCircle className="w-6 h-6 color-red" />
                                                        )}
                                                    </div>
                                                    <div className="flex-grow space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-bold color-cyan">
                                                                    Q{index + 1}: {result.question.category}
                                                                </span>
                                                                {result.wasKnownBefore && !result.isCorrect && (
                                                                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded-full font-medium">
                                                                        Previously Known
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Individual Toggle Button */}
                                                            <button
                                                                onClick={() => toggleKnownItem(result.question.id)}
                                                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${isCurrentlyKnown
                                                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                                    }`}
                                                                title={isCurrentlyKnown ? "Mark as unknown" : "Mark as known"}
                                                            >
                                                                {isCurrentlyKnown ? (
                                                                    <ToggleRight className="w-4 h-4" />
                                                                ) : (
                                                                    <ToggleLeft className="w-4 h-4" />
                                                                )}
                                                                {isCurrentlyKnown ? 'Known' : 'Unknown'}
                                                            </button>
                                                        </div>

                                                        <div className="terminal-text">
                                                            <ColoredText text={result.question.question} />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="color-cyan font-semibold">Your Answer: </span>
                                                                <span className={result.isCorrect ? 'color-green' : 'color-red'}>
                                                                    {result.userAnswer || '(empty)'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="color-cyan font-semibold">Correct: </span>
                                                                <span className="color-yellow">
                                                                    {result.question.solution.join(', ')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Finished Game
    if (gameState === 'finished') {
        const config = gameMode ? gameModes[gameMode] : null;

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-8 fade-in">
                    <ThemeToggle size="sm" className="mx-auto" />

                    <Trophy className="w-24 h-24 color-yellow mx-auto" />

                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold color-cyan">
                            {config?.name} Complete!
                        </h2>

                        <div className="text-6xl font-bold color-green">
                            {score}/{questions.length}
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
                    </div>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            onClick={() => dispatch({ type: 'SHOW_REVIEW' })}
                            className="terminal-button-primary"
                        >
                            <Eye className="w-5 h-5 inline mr-2" />
                            Review Answers
                        </button>
                        <button
                            onClick={() => dispatch({ type: 'RESET' })}
                            className="terminal-button-secondary"
                        >
                            <RotateCcw className="w-5 h-5 inline mr-2" />
                            Try Different Mode
                        </button>
                        <button
                            onClick={() => gameMode && handleModeSelect(gameMode)}
                            className="terminal-button-secondary"
                        >
                            <Shuffle className="w-5 h-5 inline mr-2" />
                            Retry {config?.name}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Playing Game
    const currentQ = questions[currentIndex];
    const config = gameMode ? gameModes[gameMode] : null;

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
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
                            <span className="color-cyan">/{questions.length}</span>
                        </div>
                        <div className="terminal-text">
                            <span className="color-blue">Question: </span>
                            <span className="color-cyan font-bold">{currentIndex + 1}/{questions.length}</span>
                        </div>
                        <ThemeToggle size="sm" showText={false} />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-bg mb-8">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>

                {/* Question card */}
                <div className="quiz-card fade-in space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold color-yellow mb-2">
                            {currentQ.category}
                        </h2>
                        <div className="theme-divider" />
                    </div>

                    <div className="text-center text-xl terminal-text leading-relaxed">
                        <ColoredText text={currentQ.question} />
                    </div>

                    {!showAnswer ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={e =>
                                    dispatch({ type: 'SET_USER_ANSWER', payload: e.target.value })
                                }
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
                                    onClick={() => dispatch({ type: 'QUIT_GAME' })}
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
                                <span
                                    className={`text-2xl font-bold ${isCorrect ? 'color-green' : 'color-red'
                                        }`}
                                >
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
                                    {currentQ.solution.join(', ')}
                                </span>
                            </div>

                            <form onSubmit={handleNextQuestion} className="space-y-6">
                                <button
                                    type="submit"
                                    className="terminal-button-primary text-lg px-8 py-3"
                                    autoFocus
                                >
                                    {currentIndex + 1 >= questions.length ? 'Finish Game' : 'Next Question'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizGame;
