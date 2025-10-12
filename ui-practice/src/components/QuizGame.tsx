import React, { useReducer, FormEvent, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Zap, BookOpen, Database, Layers, Brain, Repeat, Grid3x3
} from 'lucide-react';
import quizData from '../data.json';
import IntroScreen from './IntroScreen';
import ModeConfirmation from './ModeConfirmation';
import FlashcardMode from './FlashcardMode';
import MultipleChoiceMode from './MultipleChoiceMode';
import QuizPlayingMode from './QuizPlayingMode';
import FinishedScreen from './FinishedScreen';
import ReviewScreen from './ReviewScreen';

/* ──────────────────── types ──────────────────── */

export interface QuizQuestion {
    id?: string;
    category: string;
    question: string;
    solution: string[];
}

export interface QuizResult {
    question: QuizQuestion;
    userAnswer: string;
    isCorrect: boolean;
    wasKnownBefore: boolean;
}

export type GameState = 'intro' | 'mode-select' | 'playing' | 'answered' | 'finished' | 'review' | 'flashcard' | 'multiple-choice';
export type GameMode = 'flash' | 'regular' | 'all' | 'flashcard' | 'flashcard-unknown' | 'flashcard-repeat' | 'mc-easy' | 'mc-medium' | 'mc-hard';

export interface GameModeConfig {
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
    mcOptions: string[];
    flashcardResponses: Map<string, boolean>;
    showFlashAnswer: boolean;
    knownItems: Set<string>;
    customQuestionCount: number | null;
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
    | { type: 'RECORD_FLASHCARD_RESPONSE'; payload: { questionId: string; known: boolean } }
    | { type: 'TOGGLE_KNOWN_ITEM'; payload: string }
    | { type: 'ADD_CORRECT_TO_KNOWN' }
    | { type: 'REMOVE_INCORRECT_FROM_KNOWN' }
    | { type: 'APPLY_FLASHCARD_RESPONSES' }
    | { type: 'SHOW_FLASH_ANSWER' }
    | { type: 'RELOAD_KNOWN_ITEMS' }
    | { type: 'SET_CUSTOM_QUESTION_COUNT'; payload: number };

/* ────────────────── helpers ──────────────────── */

export const shuffle = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

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

export const generateMCOptions = (
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

export const gameModes: Record<GameMode, GameModeConfig> = {
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
        questionCount: 50,
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
        questionCount: 10,
        icon: Grid3x3,
        color: "color-red",
        bgColor: "from-red-500 to-rose-600",
        category: 'test'
    }
};

export const getKnownItems = (): Set<string> => {
    try {
        const saved = JSON.parse(localStorage.getItem('knownItems') || '[]');
        return new Set(saved);
    } catch (error) {
        console.error('Error reading knownItems from localStorage:', error);
        return new Set();
    }
};

export const saveKnownItems = (knownItems: Set<string>) => {
    try {
        localStorage.setItem('knownItems', JSON.stringify([...knownItems]));
    } catch (error) {
        console.error('Error saving knownItems to localStorage:', error);
    }
};

export const calculateImpacts = (results: QuizResult[]) => {
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

const getQuestionsForMode = (mode: GameMode, allQuestions: QuizQuestion[], knownItems: Set<string>, customCount?: number): QuizQuestion[] => {
    let filteredQuestions = allQuestions;

    if (mode === 'flashcard-unknown') {
        filteredQuestions = allQuestions.filter(q => !knownItems.has(q.id || ''));
    } else if (mode === 'flashcard-repeat') {
        filteredQuestions = allQuestions.filter(q => knownItems.has(q.id || ''));
    }

    const shuffled = shuffle(filteredQuestions);
    const questionCount = customCount || gameModes[mode].questionCount;
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
    flashcardResponses: new Map(),
    showFlashAnswer: false,
    knownItems: getKnownItems(),
    customQuestionCount: null
};

/* ────────────────── reducer ──────────────────── */

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SELECT_MODE': {
            const modeQuestions = getQuestionsForMode(
                action.payload, 
                quizData as QuizQuestion[], 
                state.knownItems,
                state.customQuestionCount || undefined
            );
            const isMCMode = action.payload.startsWith('mc-');

            return {
                ...state,
                gameState: 'mode-select',
                gameMode: action.payload,
                questions: modeQuestions,
                results: [],
                mcOptions: isMCMode ? [] : state.mcOptions
            };
        }
        
        case 'SET_CUSTOM_QUESTION_COUNT': {
            const newQuestions = state.gameMode 
                ? getQuestionsForMode(
                    state.gameMode,
                    quizData as QuizQuestion[],
                    state.knownItems,
                    action.payload
                )
                : state.questions;
            return {
                ...state,
                customQuestionCount: action.payload,
                questions: newQuestions
            };
        }

        case 'START_GAME': {
            const isFlashcardMode = state.gameMode?.startsWith('flashcard');
            const isMCMode = state.gameMode?.startsWith('mc-');
            
            let startGameState: GameState = 'playing';
            let mcOptions = state.mcOptions;
            
            if (isFlashcardMode) {
                startGameState = 'flashcard';
            } else if (isMCMode) {
                startGameState = 'multiple-choice';
                const currentQ = state.questions[0];
                const difficulty = state.gameMode === 'mc-easy' ? 'easy' :
                    state.gameMode === 'mc-medium' ? 'medium' : 'hard';
                mcOptions = generateMCOptions(
                    currentQ.solution[0],
                    quizData as QuizQuestion[],
                    currentQ,
                    difficulty
                );
            }
            
            return {
                ...state,
                gameState: startGameState,
                currentIndex: 0,
                score: 0,
                userAnswer: '',
                isCorrect: false,
                showAnswer: false,
                results: [],
                flashcardResponses: new Map(),
                showFlashAnswer: false,
                mcOptions
            };
        }

        case 'SET_USER_ANSWER':
            return { ...state, userAnswer: action.payload };

        case 'SHOW_FLASH_ANSWER':
            return { ...state, showFlashAnswer: true };

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
            const wasKnownBefore = state.knownItems.has(currentQ.id || '');

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
            const isMCMode = state.gameMode?.startsWith('mc-');
            
            let nextGameState: GameState = 'playing';
            let mcOptions = state.mcOptions;
            
            if (isFlashcardMode) {
                nextGameState = 'flashcard';
            } else if (isMCMode) {
                nextGameState = 'multiple-choice';
                const nextQ = state.questions[nextIndex];
                const difficulty = state.gameMode === 'mc-easy' ? 'easy' :
                    state.gameMode === 'mc-medium' ? 'medium' : 'hard';
                mcOptions = generateMCOptions(
                    nextQ.solution[0],
                    quizData as QuizQuestion[],
                    nextQ,
                    difficulty
                );
            }

            return {
                ...state,
                currentIndex: nextIndex,
                gameState: nextGameState,
                userAnswer: '',
                showAnswer: false,
                showFlashAnswer: false,
                mcOptions
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

        case 'TOGGLE_KNOWN_ITEM': {
            const newKnownItems = new Set(state.knownItems);
            if (newKnownItems.has(action.payload)) {
                newKnownItems.delete(action.payload);
            } else {
                newKnownItems.add(action.payload);
            }
            saveKnownItems(newKnownItems);
            return {
                ...state,
                knownItems: newKnownItems
            };
        }

        case 'ADD_CORRECT_TO_KNOWN': {
            const newKnownItems = new Set(state.knownItems);
            const correctResults = state.results.filter(result => result.isCorrect);
            let addedCount = 0;

            correctResults.forEach(result => {
                if (result.question.id && !newKnownItems.has(result.question.id)) {
                    newKnownItems.add(result.question.id);
                    addedCount++;
                }
            });

            saveKnownItems(newKnownItems);
            
            if (addedCount === 0) {
                alert(`All ${correctResults.length} correctly answered items were already in known items!`);
            } else {
                alert(`Added ${addedCount} new items to known items! (${correctResults.length - addedCount} were already known)`);
            }

            return {
                ...state,
                knownItems: newKnownItems
            };
        }

        case 'REMOVE_INCORRECT_FROM_KNOWN': {
            const newKnownItems = new Set(state.knownItems);
            const incorrectResults = state.results.filter(result => !result.isCorrect);
            let removedCount = 0;

            incorrectResults.forEach(result => {
                if (result.question.id && newKnownItems.has(result.question.id)) {
                    newKnownItems.delete(result.question.id);
                    removedCount++;
                }
            });

            saveKnownItems(newKnownItems);
            
            if (removedCount === 0) {
                alert(`None of the ${incorrectResults.length} missed items were in known items!`);
            } else {
                alert(`Removed ${removedCount} items from known items! (${incorrectResults.length - removedCount} were not previously known)`);
            }

            return {
                ...state,
                knownItems: newKnownItems
            };
        }

        case 'APPLY_FLASHCARD_RESPONSES': {
            const newKnownItems = new Set(state.knownItems);
            let addedCount = 0;
            let removedCount = 0;

            state.flashcardResponses.forEach((known, questionId) => {
                if (known && !newKnownItems.has(questionId)) {
                    newKnownItems.add(questionId);
                    addedCount++;
                } else if (!known && newKnownItems.has(questionId)) {
                    newKnownItems.delete(questionId);
                    removedCount++;
                }
            });

            saveKnownItems(newKnownItems);

            const totalChanges = addedCount + removedCount;
            if (totalChanges === 0) {
                alert('No changes to apply - all items already match your responses!');
            } else {
                alert(`Updated known items!
✓ Added: ${addedCount}
✗ Removed: ${removedCount}`);
            }

            return {
                ...state,
                knownItems: newKnownItems
            };
        }

        case 'RELOAD_KNOWN_ITEMS':
            return {
                ...state,
                knownItems: getKnownItems()
            };

        case 'RESET':
            return {
                ...initialState,
                questions: shuffle(quizData as QuizQuestion[]),
                flashcardResponses: new Map(),
                knownItems: getKnownItems()
            };

        default:
            return state;
    }
}

/* ───────────────── component ─────────────────── */

const QuizGame: React.FC = () => {
    const navigate = useNavigate();
    //const location = useLocation();
    const { mode } = useParams<{ mode?: string }>();
    
    const [state, dispatch] = useReducer(reducer, initialState);
    
    const {
        gameState, gameMode, questions, currentIndex,
        score, userAnswer, isCorrect, showAnswer, results, mcOptions,
        showFlashAnswer, knownItems, customQuestionCount
    } = state;

    // Sync URL mode on mount
    useEffect(() => {
        if (mode && mode !== gameMode && Object.keys(gameModes).includes(mode)) {
            dispatch({ type: 'SELECT_MODE', payload: mode as GameMode });
        }
    }, [mode, gameMode]);

    // REMOVED the problematic useEffect that was causing redirects
    // The navigation is now handled entirely by the handlers

    /* ──────────────── handlers ─────────────── */

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim()) return;
        dispatch({ type: 'ANSWER', payload: { answer: userAnswer } });
    };

    const handleNextQuestion = (e: FormEvent) => {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        
        dispatch({ type: 'NEXT_QUESTION' });
        
        if (nextIndex >= questions.length && gameMode) {
            navigate(`/results/${gameMode}`, { replace: false });
        }
    };

    const handleModeSelect = useCallback((mode: GameMode) => {
        dispatch({ type: 'SELECT_MODE', payload: mode });
        navigate(`/mode/${mode}`, { replace: false });
    }, [navigate]);

    const handleStartGame = useCallback(() => {
        dispatch({ type: 'START_GAME' });
        if (gameMode) {
            navigate(`/play/${gameMode}`, { replace: false });
        }
    }, [gameMode, navigate]);
    
    const handleSetQuestionCount = useCallback((count: number) => {
        dispatch({ type: 'SET_CUSTOM_QUESTION_COUNT', payload: count });
    }, []);

    const handleMCAnswer = (answer: string) => {
        dispatch({ type: 'SET_USER_ANSWER', payload: answer });
        dispatch({ type: 'ANSWER', payload: { answer } });
    };

    const handleFlashcardKnown = (known: boolean) => {
        const currentQ = questions[currentIndex];
        const nextIndex = currentIndex + 1;

        if (currentQ.id) {
            dispatch({
                type: 'RECORD_FLASHCARD_RESPONSE',
                payload: { questionId: currentQ.id, known }
            });
        }

        dispatch({ type: 'NEXT_QUESTION' });
        
        if (nextIndex >= questions.length && gameMode) {
            navigate(`/results/${gameMode}`, { replace: false });
        }
    };

    const handleQuitGame = useCallback(() => {
        dispatch({ type: 'QUIT_GAME' });
        if (gameMode) {
            navigate(`/results/${gameMode}`, { replace: false });
        }
    }, [gameMode, navigate]);

    const handleShowReview = useCallback(() => {
        dispatch({ type: 'SHOW_REVIEW' });
        if (gameMode) {
            navigate(`/review/${gameMode}`, { replace: false });
        }
    }, [gameMode, navigate]);

    const handleBackToResults = useCallback(() => {
        dispatch({ type: 'BACK_TO_RESULTS' });
        if (gameMode) {
            navigate(`/results/${gameMode}`, { replace: false });
        }
    }, [gameMode, navigate]);

    const handleReset = useCallback(() => {
        dispatch({ type: 'RESET' });
        navigate('/', { replace: false });
    }, [navigate]);

    const handleRetry = useCallback(() => {
        if (gameMode) {
            handleModeSelect(gameMode);
        }
    }, [gameMode, handleModeSelect]);

    const exportKnownItems = () => {
        const knownItemsArray = [...knownItems];
        const dataStr = JSON.stringify(knownItemsArray, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'knownItems.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    /* ────────────────── Render ─────────────────── */

    if (gameState === 'intro') {
        return <IntroScreen onModeSelect={handleModeSelect} />;
    }

    if (gameState === 'mode-select' && gameMode) {
        return (
            <ModeConfirmation
                gameMode={gameMode}
                questions={questions}
                customQuestionCount={customQuestionCount}
                onStart={handleStartGame}
                onReset={handleReset}
                onSetQuestionCount={handleSetQuestionCount}
            />
        );
    }

    if (gameState === 'flashcard') {
        return (
            <FlashcardMode
                question={questions[currentIndex]}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                gameMode={gameMode}
                showFlashAnswer={showFlashAnswer}
                onShowAnswer={() => dispatch({ type: 'SHOW_FLASH_ANSWER' })}
                onFlashcardKnown={handleFlashcardKnown}
                onQuit={handleQuitGame}
                flashcardResponse={state.flashcardResponses.get(questions[currentIndex].id || '')}
            />
        );
    }

    if (gameState === 'multiple-choice') {
        return (
            <MultipleChoiceMode
                question={questions[currentIndex]}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                score={score}
                gameMode={gameMode}
                mcOptions={mcOptions}
                showAnswer={showAnswer}
                isCorrect={isCorrect}
                userAnswer={userAnswer}
                onMCAnswer={handleMCAnswer}
                onNext={handleNextQuestion}
                onQuit={handleQuitGame}
            />
        );
    }

    if (gameState === 'review') {
        return (
            <ReviewScreen
                results={results}
                currentKnownItems={knownItems}
                onBack={handleBackToResults}
                onExport={exportKnownItems}
                onAddCorrect={() => dispatch({ type: 'ADD_CORRECT_TO_KNOWN' })}
                onRemoveIncorrect={() => dispatch({ type: 'REMOVE_INCORRECT_FROM_KNOWN' })}
                onToggleKnown={(id) => id && dispatch({ type: 'TOGGLE_KNOWN_ITEM', payload: id })}
            />
        );
    }

    if (gameState === 'finished') {
        return (
            <FinishedScreen
                gameMode={gameMode}
                score={score}
                totalQuestions={questions.length}
                results={results}
                flashcardResponseCount={state.flashcardResponses.size}
                onReview={handleShowReview}
                onReset={handleReset}
                onRetry={handleRetry}
                onApplyFlashcard={() => dispatch({ type: 'APPLY_FLASHCARD_RESPONSES' })}
            />
        );
    }

    return (
        <QuizPlayingMode
            question={questions[currentIndex]}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            score={score}
            gameMode={gameMode}
            userAnswer={userAnswer}
            showAnswer={showAnswer}
            isCorrect={isCorrect}
            onAnswerChange={(answer) => dispatch({ type: 'SET_USER_ANSWER', payload: answer })}
            onSubmit={handleSubmit}
            onNext={handleNextQuestion}
            onQuit={handleQuitGame}
        />
    );
};

export default QuizGame;
