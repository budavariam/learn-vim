import React, { useReducer, FormEvent, useState, useEffect } from 'react';
import {
    Shuffle, RotateCcw, Trophy, Target,
    CheckCircle, XCircle, Zap, BookOpen, Database,
    Download, Plus, Minus, Eye, ToggleLeft, ToggleRight,
    Layers, Grid3x3, Brain, Repeat
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

type GameState = 'intro' | 'mode-select' | 'playing' | 'answered' | 'finished' | 'review' | 'flashcard' | 'multiple-choice';
type GameMode = 'flash' | 'regular' | 'all' | 'flashcard' | 'flashcard-unknown' | 'flashcard-repeat' | 'mc-easy' | 'mc-medium' | 'mc-hard';

interface GameModeConfig {
    name: string;
    description: string;
    questionCount: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    category?: 'quiz' | 'practice' | 'test';
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
    mcOptions?: string[];
    flashcardResponses?: Map<string, boolean>;
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
    | { type: 'BACK_TO_RESULTS' }
    | { type: 'SET_MC_OPTIONS'; payload: string[] }
    | { type: 'RECORD_FLASHCARD_RESPONSE'; payload: { questionId: string; known: boolean } };

/* ────────────────── helpers ──────────────────── */

const shuffle = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

// Calculate Levenshtein distance for string similarity
const levenshteinDistance = (str1: string, str2: string): number => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[len1][len2];
};

const calculateSimilarity = (str1: string, str2: string): number => {
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLen = Math.max(str1.length, str2.length);
    return maxLen === 0 ? 1 : 1 - distance / maxLen;
};

// Generate multiple choice options with varying difficulty
const generateMCOptions = (
    correctAnswer: string,
    allQuestions: QuizQuestion[],
    currentQuestion: QuizQuestion,
    difficulty: 'easy' | 'medium' | 'hard'
): string[] => {
    const allAnswers = allQuestions.flatMap(q => q.solution);
    const uniqueAnswers = Array.from(new Set(allAnswers)).filter(
        ans => ans !== correctAnswer
    );

    let candidates: { answer: string; similarity: number }[] = [];

    if (difficulty === 'hard') {
        const sameCategoryAnswers = allQuestions
            .filter(q => q.category === currentQuestion.category && q !== currentQuestion)
            .flatMap(q => q.solution)
            .filter(ans => ans !== correctAnswer);

        candidates = sameCategoryAnswers.map(ans => ({
            answer: ans,
            similarity: calculateSimilarity(correctAnswer, ans)
        }));

        candidates.sort((a, b) => b.similarity - a.similarity);
    } else if (difficulty === 'medium') {
        const sameCategoryAnswers = allQuestions
            .filter(q => q.category === currentQuestion.category && q !== currentQuestion)
            .flatMap(q => q.solution)
            .filter(ans => ans !== correctAnswer);

        const mixedAnswers = [...sameCategoryAnswers, ...shuffle(uniqueAnswers)];
        candidates = Array.from(new Set(mixedAnswers)).map(ans => ({
            answer: ans,
            similarity: calculateSimilarity(correctAnswer, ans)
        }));

        candidates.sort((a, b) => Math.abs(b.similarity - 0.5) - Math.abs(a.similarity - 0.5));
    } else {
        const differentCategoryAnswers = allQuestions
            .filter(q => q.category !== currentQuestion.category)
            .flatMap(q => q.solution)
            .filter(ans => ans !== correctAnswer);

        candidates = shuffle(differentCategoryAnswers).map(ans => ({
            answer: ans,
            similarity: calculateSimilarity(correctAnswer, ans)
        }));
    }

    const distractors = candidates
        .slice(0, 3)
        .map(c => c.answer);

    while (distractors.length < 3 && uniqueAnswers.length > 0) {
        const randomAnswer = uniqueAnswers[Math.floor(Math.random() * uniqueAnswers.length)];
        if (!distractors.includes(randomAnswer)) {
            distractors.push(randomAnswer);
        }
    }

    const options = shuffle([correctAnswer, ...distractors.slice(0, 3)]);
    return options;
};

const gameModes: Record<GameMode, GameModeConfig> = {
    flash: {
        name: "Flash Mode",
        description: "Quick 10-question challenge",
        questionCount: 10,
        icon: Zap,
        color: "color-yellow",
        bgColor: "from-yellow-500 to-orange-500",
        category: 'quiz'
    },
    regular: {
        name: "Regular Mode",
        description: "Standard 50-question practice",
        questionCount: 50,
        icon: BookOpen,
        color: "color-blue",
        bgColor: "from-blue-500 to-purple-500",
        category: 'quiz'
    },
    all: {
        name: "Master Mode",
        description: `All ${quizData.length} questions`,
        questionCount: quizData.length,
        icon: Database,
        color: "color-green",
        bgColor: "from-green-500 to-teal-500",
        category: 'quiz'
    },
    flashcard: {
        name: "Flashcard - All",
        description: "Study all commands",
        questionCount: 50,
        icon: Layers,
        color: "color-purple",
        bgColor: "from-purple-500 to-pink-500",
        category: 'practice'
    },
    'flashcard-unknown': {
        name: "Flashcard - Unknown",
        description: "Practice only unknown commands",
        questionCount: 9999,
        icon: Brain,
        color: "color-orange",
        bgColor: "from-orange-500 to-red-500",
        category: 'practice'
    },
    'flashcard-repeat': {
        name: "Flashcard - Review",
        description: "Review all known commands",
        questionCount: 9999,
        icon: Repeat,
        color: "color-teal",
        bgColor: "from-teal-500 to-cyan-500",
        category: 'practice'
    },
    'mc-easy': {
        name: "MC Easy",
        description: "Multiple choice - random options",
        questionCount: 20,
        icon: Grid3x3,
        color: "color-green",
        bgColor: "from-green-400 to-emerald-500",
        category: 'test'
    },
    'mc-medium': {
        name: "MC Medium",
        description: "Multiple choice - mixed difficulty",
        questionCount: 30,
        icon: Grid3x3,
        color: "color-yellow",
        bgColor: "from-yellow-400 to-orange-500",
        category: 'test'
    },
    'mc-hard': {
        name: "MC Hard",
        description: "Multiple choice - similar answers",
        questionCount: 40,
        icon: Grid3x3,
        color: "color-red",
        bgColor: "from-red-500 to-rose-600",
        category: 'test'
    }
};

const getKnownItems = (): Set<string> => {
    try {
        const saved = JSON.parse(localStorage.getItem('knownItems') || '[]');
        return new Set(saved);
    } catch (error) {
        console.error('Error reading knownItems from localStorage:', error);
        return new Set();
    }
};

const saveKnownItems = (knownItems: Set<string>) => {
    try {
        localStorage.setItem('knownItems', JSON.stringify([...knownItems]));
    } catch (error) {
        console.error('Error saving knownItems to localStorage:', error);
    }
};

const calculateImpacts = (results: QuizResult[]) => {
    const knownItems = getKnownItems();
    const correctAnswers = results.filter(r => r.isCorrect);
    const incorrectAnswers = results.filter(r => !r.isCorrect);

    const correctToAdd = correctAnswers.filter(result =>
        result.question.id && !knownItems.has(result.question.id)
    ).length;

    const incorrectToRemove = incorrectAnswers.filter(result =>
        result.question.id && knownItems.has(result.question.id)
    ).length;

    return { correctToAdd, incorrectToRemove };
};

const getQuestionsForMode = (mode: GameMode, allQuestions: QuizQuestion[]): QuizQuestion[] => {
    const knownItems = getKnownItems();
    
    let filteredQuestions = allQuestions;
    
    // Filter based on flashcard mode
    if (mode === 'flashcard-unknown') {
        filteredQuestions = allQuestions.filter(q => !knownItems.has(q.id || ''));
    } else if (mode === 'flashcard-repeat') {
        filteredQuestions = allQuestions.filter(q => knownItems.has(q.id || ''));
    }
    
    const shuffled = shuffle(filteredQuestions);
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
    results: [],
    mcOptions: [],
    flashcardResponses: new Map()
};

/* ────────────────── reducer ──────────────────── */

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SELECT_MODE':
            const modeQuestions = getQuestionsForMode(action.payload, quizData as QuizQuestion[]);
            const isMCMode = action.payload.startsWith('mc-');

            return {
                ...state,
                gameState: 'mode-select',
                gameMode: action.payload,
                questions: modeQuestions,
                results: [],
                mcOptions: isMCMode ? [] : undefined
            };

        case 'START_GAME':
            const isFlashcardMode = state.gameMode?.startsWith('flashcard');
            const startGameState = isFlashcardMode ? 'flashcard' :
                state.gameMode?.startsWith('mc-') ? 'multiple-choice' : 'playing';
            return {
                ...state,
                gameState: startGameState,
                currentIndex: 0,
                score: 0,
                userAnswer: '',
                isCorrect: false,
                showAnswer: false,
                results: [],
                flashcardResponses: new Map()
            };

        case 'SET_USER_ANSWER':
            return { ...state, userAnswer: action.payload };

        case 'SET_MC_OPTIONS':
            return { ...state, mcOptions: action.payload };

        case 'RECORD_FLASHCARD_RESPONSE': {
            const newResponses = new Map(state.flashcardResponses);
            newResponses.set(action.payload.questionId, action.payload.known);
            return {
                ...state,
                flashcardResponses: newResponses
            };
        }

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

            const isFlashcardMode = state.gameMode?.startsWith('flashcard');
            const nextGameState = isFlashcardMode ? 'flashcard' :
                state.gameMode?.startsWith('mc-') ? 'multiple-choice' : 'playing';

            return {
                ...state,
                currentIndex: nextIndex,
                gameState: nextGameState,
                userAnswer: '',
                showAnswer: false,
                mcOptions: state.gameMode?.startsWith('mc-') ? [] : undefined
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
                questions: shuffle(quizData as QuizQuestion[]),
                flashcardResponses: new Map()
            };

        default:
            return state;
    }
}

/* ───────────────── component ─────────────────── */

const QuizGame: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [currentKnownItems, setCurrentKnownItems] = useState<Set<string>>(new Set());
    const [showFlashAnswer, setShowFlashAnswer] = useState(false);

    useEffect(() => {
        if (state.gameState === 'review') {
            setCurrentKnownItems(getKnownItems());
        }
    }, [state.gameState]);

    // Generate MC options when entering multiple-choice mode
    useEffect(() => {
        if (state.gameState === 'multiple-choice' && state.gameMode?.startsWith('mc-') && state.mcOptions?.length === 0) {
            const currentQ = state.questions[state.currentIndex];
            const difficulty = state.gameMode === 'mc-easy' ? 'easy' :
                state.gameMode === 'mc-medium' ? 'medium' : 'hard';
            const options = generateMCOptions(
                currentQ.solution[0],
                quizData as QuizQuestion[],
                currentQ,
                difficulty
            );
            dispatch({ type: 'SET_MC_OPTIONS', payload: options });
        }
    }, [state.gameState, state.currentIndex, state.gameMode, state.mcOptions, state.questions]);

    // Reset flash answer visibility when moving to next card
    useEffect(() => {
        if (state.gameState === 'flashcard') {
            setShowFlashAnswer(false);
        }
    }, [state.currentIndex, state.gameState]);

    // Keyboard support for multiple choice (1-4 keys)
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (state.gameState === 'multiple-choice' && !state.showAnswer && state.mcOptions) {
                const keyNum = parseInt(e.key);
                if (keyNum >= 1 && keyNum <= 4 && keyNum <= state.mcOptions.length) {
                    const selectedOption = state.mcOptions[keyNum - 1];
                    handleMCAnswer(selectedOption);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [state.gameState, state.showAnswer, state.mcOptions]);

    const {
        gameState, gameMode, questions, currentIndex,
        score, userAnswer, isCorrect, showAnswer, results, mcOptions
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

    const handleMCAnswer = (answer: string) => {
        dispatch({ type: 'SET_USER_ANSWER', payload: answer });
        dispatch({ type: 'ANSWER', payload: { answer } });
    };

    const handleFlashcardKnown = (known: boolean) => {
        const currentQ = questions[currentIndex];
        
        // Just record the response, don't update localStorage
        if (currentQ.id) {
            dispatch({ 
                type: 'RECORD_FLASHCARD_RESPONSE', 
                payload: { questionId: currentQ.id, known } 
            });
        }
        
        dispatch({ type: 'NEXT_QUESTION' });
    };

    // New function to apply flashcard responses to known items
    const applyFlashcardResponses = () => {
        const knownItems = getKnownItems();
        let addedCount = 0;
        let removedCount = 0;

        state.flashcardResponses?.forEach((known, questionId) => {
            if (known && !knownItems.has(questionId)) {
                knownItems.add(questionId);
                addedCount++;
            } else if (!known && knownItems.has(questionId)) {
                knownItems.delete(questionId);
                removedCount++;
            }
        });

        saveKnownItems(knownItems);
        
        const totalChanges = addedCount + removedCount;
        if (totalChanges === 0) {
            alert('No changes to apply - all items already match your responses!');
        } else {
            alert(`Updated known items!\n✓ Added: ${addedCount}\n✗ Removed: ${removedCount}`);
        }
    };

    const accuracy = (() => {
        const totalAnswered = gameState === 'finished' && showAnswer
            ? currentIndex + 1
            : currentIndex;

        if (totalAnswered === 0) return 0;
        return Math.round((score / totalAnswered) * 100);
    })();

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
        const quizModes = Object.entries(gameModes).filter(([_, config]) => config.category === 'quiz');
        const practiceModes = Object.entries(gameModes).filter(([_, config]) => config.category === 'practice');
        const testModes = Object.entries(gameModes).filter(([_, config]) => config.category === 'test');

        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center space-y-8 fade-in max-w-7xl">
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

                    {/* Quiz Modes */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold color-cyan">📝 Quiz Modes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {quizModes.map(([mode, config]) => {
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
                    </div>

                    {/* Practice Modes */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold color-purple">🎴 Flashcard Practice</h2>
                        <p className="text-sm terminal-text color-cyan opacity-80">Practice freely - update your known items when you're done</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {practiceModes.map(([mode, config]) => {
                                const IconComponent = config.icon;
                                const knownItems = getKnownItems();
                                const unknownCount = (quizData as QuizQuestion[]).filter(q => !knownItems.has(q.id || '')).length;
                                const knownCount = (quizData as QuizQuestion[]).filter(q => knownItems.has(q.id || '')).length;
                                
                                let displayCount = config.questionCount;
                                if (mode === 'flashcard-unknown') displayCount = unknownCount;
                                if (mode === 'flashcard-repeat') displayCount = knownCount;
                                
                                const isEmpty = (mode === 'flashcard-unknown' && unknownCount === 0) || 
                                              (mode === 'flashcard-repeat' && knownCount === 0);
                                
                                return (
                                    <div
                                        key={mode}
                                        onClick={() => !isEmpty && handleModeSelect(mode as GameMode)}
                                        className={`group h-full ${isEmpty ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    >
                                        <div className={`quiz-card transition-all duration-300 h-full flex flex-col ${!isEmpty && 'hover:scale-105 hover:shadow-2xl'}`}>
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
                                                        {isEmpty ? 'No cards available' : `${displayCount} Cards`}
                                                    </div>
                                                </div>
                                                <button 
                                                    className={`terminal-button-primary w-full mt-4 ${!isEmpty && 'group-hover:shadow-lg'}`}
                                                    disabled={isEmpty}
                                                >
                                                    {isEmpty ? 'Empty' : `Start ${config.name}`}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Multiple Choice Tests */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold color-green">✅ Multiple Choice Tests</h2>
                        <p className="text-sm terminal-text color-cyan opacity-80">Use keys 1-4 to quickly select answers</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {testModes.map(([mode, config]) => {
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
                    </div>

                    <div className="text-center terminal-text color-cyan opacity-60 mt-8">
                        <p>Choose your challenge level to begin</p>
                    </div>
                </div>
            </div>
        );
    }

    // Mode confirmation
    if (gameState === 'mode-select' && gameMode) {
        const config = gameModes[gameMode];
        const IconComponent = config.icon;
        const isFlashcardMode = gameMode.startsWith('flashcard');

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
                            {questions.length} {isFlashcardMode ? 'cards' : 'questions'} • {
                                isFlashcardMode ? 'Practice mode - apply changes at the end' :
                                    gameMode?.startsWith('mc-') ? 'Multiple choice - Press 1-4 for quick answers' :
                                        'Type your answers'
                            }
                        </p>
                        {isFlashcardMode && (
                            <p className="text-sm terminal-text color-green">
                                ✓ Your responses are tracked but not saved until you finish
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => dispatch({ type: 'START_GAME' })}
                            className="terminal-button-primary text-xl px-8 py-4"
                        >
                            Begin {isFlashcardMode ? 'Practice' : 'Quiz'}
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

    // Flashcard Mode
    if (gameState === 'flashcard') {
        const currentQ = questions[currentIndex];
        const config = gameMode ? gameModes[gameMode] : null;
        const knownItems = getKnownItems();
        const isKnown = knownItems.has(currentQ.id || '');
        const currentResponse = state.flashcardResponses?.get(currentQ.id || '');

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
                                <span className="color-cyan font-bold">{currentIndex + 1}/{questions.length}</span>
                            </div>
                            <ThemeToggle size="sm" showText={false} />
                        </div>
                    </div>

                    <div className="progress-bar-bg mb-8">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>

                    <div className="quiz-card fade-in space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold color-yellow mb-2">
                                {currentQ.category}
                            </h2>
                            <div className="theme-divider" />
                        </div>

                        <div className="text-center text-xl terminal-text leading-relaxed min-h-[200px] flex items-center justify-center">
                            <ColoredText text={currentQ.question} />
                        </div>

                        {showFlashAnswer && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                                <div className="text-center space-y-4">
                                    <p className="text-lg font-bold color-cyan">Answer:</p>
                                    <p className="text-2xl color-yellow font-semibold">
                                        {currentQ.solution.join(', ')}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {!showFlashAnswer ? (
                                <button
                                    onClick={() => setShowFlashAnswer(true)}
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
                                            onClick={() => handleFlashcardKnown(true)}
                                            className="terminal-button-success text-lg px-8 py-4 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            I Know This
                                        </button>
                                        <button
                                            onClick={() => handleFlashcardKnown(false)}
                                            className="terminal-button-danger text-lg px-8 py-4 flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Still Learning
                                        </button>
                                    </div>
                                    {currentResponse !== undefined && (
                                        <p className="text-center text-xs terminal-text color-green opacity-70">
                                            ✓ Response recorded for this session
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={() => dispatch({ type: 'QUIT_GAME' })}
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
    }

    // Multiple Choice Mode
    if (gameState === 'multiple-choice') {
        const currentQ = questions[currentIndex];
        const config = gameMode ? gameModes[gameMode] : null;

        return (
            <div className="min-h-screen p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <Grid3x3 className="w-8 h-8 color-cyan" />
                            <h1 className="text-3xl font-bold color-cyan">
                                {config?.name || 'Multiple Choice Quiz'}
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

                    <div className="progress-bar-bg mb-8">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>

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
                            <div className="space-y-3">
                                <p className="text-center text-sm terminal-text color-cyan opacity-70 mb-4">
                                    Press 1-4 or click to select
                                </p>
                                {mcOptions && mcOptions.map((option, index) => (
                                    <button
                                        key={option}
                                        onClick={() => handleMCAnswer(option)}
                                        className="w-full text-left px-6 py-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md text-gray-800 dark:text-gray-200"
                                    >
                                        <span className="inline-flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm">
                                                {index + 1}
                                            </span>
                                            <span className="text-lg">{option}</span>
                                        </span>
                                    </button>
                                ))}
                                <button
                                    onClick={() => dispatch({ type: 'QUIT_GAME' })}
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
                                            {currentQ.solution.join(', ')}
                                        </span>
                                    </div>
                                )}

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

                    <div className="space-y-6">
                        {results.length > 0 && (
                            <div className="quiz-card">
                                <h2 className="text-2xl font-bold color-cyan mb-6">Detailed Review</h2>
                                <div className="space-y-4">
                                    {results.map((result, index) => {
                                        const isCurrentlyKnown = currentKnownItems.has(result.question.id || '');
                                        return (
                                            <div
                                                key={result.question.id}
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
        const isFlashcardMode = gameMode?.startsWith('flashcard');
        const flashcardCount = state.flashcardResponses?.size || 0;

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
                            </>
                        )}

                        {isFlashcardMode && (
                            <div className="space-y-4">
                                <p className="text-xl terminal-text color-cyan">
                                    You've completed the flashcard practice session!
                                </p>
                                <p className="text-lg terminal-text color-yellow">
                                    Reviewed {flashcardCount} card{flashcardCount !== 1 ? 's' : ''}
                                </p>
                                {flashcardCount > 0 && (
                                    <div className="quiz-card max-w-md mx-auto">
                                        <p className="text-sm color-cyan mb-4">
                                            Would you like to update your known items list based on this session?
                                        </p>
                                        <button
                                            onClick={applyFlashcardResponses}
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
                                onClick={() => dispatch({ type: 'SHOW_REVIEW' })}
                                className="terminal-button-primary"
                            >
                                <Eye className="w-5 h-5 inline mr-2" />
                                Review Answers
                            </button>
                        )}
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

                <div className="progress-bar-bg mb-8">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>

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
