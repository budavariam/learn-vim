import React, { useReducer, FormEvent } from 'react';
import {
    Shuffle, RotateCcw, Trophy, Target,
    CheckCircle, XCircle
} from 'lucide-react';
import quizData from '../data.json';
import ColoredText from './ColoredText';
import ThemeToggle from './ThemeToggle';

/* ──────────────────── types ──────────────────── */

interface QuizQuestion {
    category: string;
    question: string;
    solution: string[];
}

type GameState = 'intro' | 'playing' | 'answered' | 'finished';

interface State {
    gameState: GameState;
    questions: QuizQuestion[];
    currentIndex: number;
    score: number;
    userAnswer: string;
    isCorrect: boolean;
    showAnswer: boolean;
}

type Action =
    | { type: 'START_GAME' }
    | { type: 'ANSWER'; payload: { answer: string } }
    | { type: 'NEXT_QUESTION' }
    | { type: 'QUIT_GAME' }
    | { type: 'RESET' }
    | { type: 'SET_USER_ANSWER'; payload: string };


/* ────────────────── helpers ──────────────────── */

const shuffle = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

const initialQuestions = shuffle(quizData as QuizQuestion[]);

const initialState: State = {
    gameState: 'intro',
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
        case 'START_GAME':
            return {
                ...state,
                gameState: 'playing',
                currentIndex: 0,
                score: 0,
                userAnswer: '',
                isCorrect: false,
                showAnswer: false,
                questions: shuffle(state.questions)
            };

        case 'SET_USER_ANSWER':
            return { ...state, userAnswer: action.payload };

        case 'ANSWER': {
            const currentQ = state.questions[state.currentIndex];
            const correct = currentQ.solution.includes(
                action.payload.answer.trim()
            );

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
                questions: shuffle(state.questions)
            };

        default:
            return state;
    }
}


/* ───────────────── component ─────────────────── */

const QuizGame: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const {
        gameState, questions, currentIndex,
        score, userAnswer, isCorrect, showAnswer
    } = state;

    /* ──────────────── handlers ─────────────── */

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim()) return;
        dispatch({ type: 'ANSWER', payload: { answer: userAnswer } });
    };

    const accuracy = (() => {
        const totalAnswered = gameState === 'finished' && showAnswer
            ? currentIndex + 1  // If quit after answering current question
            : currentIndex;     // If quit before answering current question

        if (totalAnswered === 0) return 0;
        return Math.round((score / totalAnswered) * 100);
    })();


    /* ────────────────── UI ─────────────────── */

    if (gameState === 'intro') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-8 fade-in">
                    <ThemeToggle size="md" className="mx-auto mb-4" />

                    <h1 className="text-5xl font-bold color-cyan typing-animation">
                        Interactive Quiz Game
                    </h1>
                    <p className="text-xl color-yellow">
                        Test your knowledge with {questions.length} questions
                    </p>

                    <p className="terminal-text color-green">
                        If there are <span className="font-semibold">color coded texts</span>,
                        include them in the answer.
                    </p>

                    <button
                        className="terminal-button-primary text-xl px-8 py-4"
                        onClick={() => dispatch({ type: 'START_GAME' })}
                    >
                        Start Game
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-8 fade-in">
                    <ThemeToggle size="sm" className="mx-auto" />

                    <Trophy className="w-24 h-24 color-yellow mx-auto" />

                    <h2 className="text-4xl font-bold color-cyan">Game Finished!</h2>

                    <div className="text-6xl font-bold color-green">
                        {score}/{questions.length}
                    </div>

                    <p className="text-2xl color-yellow">{accuracy}% Accuracy</p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => dispatch({ type: 'RESET' })}
                            className="terminal-button-primary"
                        >
                            <RotateCcw className="w-5 h-5 inline mr-2" />
                            Play Again
                        </button>
                        <button
                            onClick={() => dispatch({ type: 'START_GAME' })}
                            className="terminal-button-secondary"
                        >
                            <Shuffle className="w-5 h-5 inline mr-2" />
                            Shuffle & Restart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Target className="w-8 h-8 color-cyan" />
                        <h1 className="text-3xl font-bold color-cyan">Quiz Game</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="terminal-text">
                            <span className="color-yellow">Score: </span>
                            <span className="color-green font-bold text-xl">{score}</span>
                            <span className="color-cyan">/{questions.length}</span>
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
