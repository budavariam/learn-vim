import React, { useReducer, FormEvent } from 'react';
import {
    Shuffle, RotateCcw, Trophy, Target,
    CheckCircle, XCircle, Zap, BookOpen, Database
} from 'lucide-react';
import quizData from '../data.json';
import ColoredText from './ColoredText';
import ThemeToggle from './ThemeToggle';
import TypingText from './TypingText';

/* ──────────────────── types ──────────────────── */

interface QuizQuestion {
    category: string;
    question: string;
    solution: string[];
}

type GameState = 'intro' | 'mode-select' | 'playing' | 'answered' | 'finished';
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
}

type Action =
    | { type: 'SELECT_MODE'; payload: GameMode }
    | { type: 'START_GAME' }
    | { type: 'ANSWER'; payload: { answer: string } }
    | { type: 'NEXT_QUESTION' }
    | { type: 'QUIT_GAME' }
    | { type: 'RESET' }
    | { type: 'SET_USER_ANSWER'; payload: string };

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
    showAnswer: false
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
                questions: modeQuestions
            };

        case 'START_GAME':
            return {
                ...state,
                gameState: 'playing',
                currentIndex: 0,
                score: 0,
                userAnswer: '',
                isCorrect: false,
                showAnswer: false
            };

        case 'SET_USER_ANSWER':
            return { ...state, userAnswer: action.payload };

        case 'ANSWER': {
            const currentQ = state.questions[state.currentIndex];
            const correct = currentQ.solution.includes(action.payload.answer.trim());

            return {
                ...state,
                isCorrect: correct,
                score: correct ? state.score + 1 : state.score,
                gameState: 'answered',
                showAnswer: true
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

    const {
        gameState, gameMode, questions, currentIndex,
        score, userAnswer, isCorrect, showAnswer
    } = state;

    /* ──────────────── handlers ─────────────── */

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim()) return;
        dispatch({ type: 'ANSWER', payload: { answer: userAnswer } });
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
                        speed={80} // Adjust speed as needed
                        startDelay={300}
                        onComplete={() => {
                            // Optional: Do something when typing completes
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
                                    className="group cursor-pointer h-full" // Add h-full here
                                >
                                    <div className="quiz-card hover:scale-105 transition-all duration-300 hover:shadow-2xl h-full flex flex-col"> {/* Add h-full and flex */}
                                        <div className="text-center space-y-4 flex-grow flex flex-col justify-between"> {/* Add flex styling */}
                                            <div className="space-y-4"> {/* Wrap top content */}
                                                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${config.bgColor} flex items-center justify-center`}>
                                                    <IconComponent className="w-8 h-8 text-white" />
                                                </div>

                                                <h3 className={`text-2xl font-bold ${config.color}`}>
                                                    {config.name}
                                                </h3>

                                                <p className="terminal-text color-cyan min-h-[3rem] flex items-center justify-center"> {/* Fixed height for description */}
                                                    {config.description}
                                                </p>

                                                <div className="text-lg font-mono color-yellow">
                                                    {config.questionCount} Questions
                                                </div>
                                            </div>

                                            <button className="terminal-button-primary w-full group-hover:shadow-lg mt-4"> {/* Add margin top */}
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
                            onClick={() => dispatch({ type: 'RESET' })}
                            className="terminal-button-primary"
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

                            <button
                                onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
                                className="terminal-button-primary text-lg px-8 py-3"
                            >
                                {currentIndex + 1 >= questions.length ? 'Finish Game' : 'Next Question'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizGame;
