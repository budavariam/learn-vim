import React, { useReducer, FormEvent, useState, useEffect } from 'react';
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

const getQuestionsForMode = (mode: GameMode, allQuestions: QuizQuestion[]): QuizQuestion[] => {
    const knownItems = getKnownItems();

    let filteredQuestions = allQuestions;

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

    useEffect(() => {
        if (state.gameState === 'flashcard') {
            setShowFlashAnswer(false);
        }
    }, [state.currentIndex, state.gameState]);

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

        if (currentQ.id) {
            dispatch({
                type: 'RECORD_FLASHCARD_RESPONSE',
                payload: { questionId: currentQ.id, known }
            });
        }

        dispatch({ type: 'NEXT_QUESTION' });
    };

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

    /* ────────────────── Render ─────────────────── */

    if (gameState === 'intro') {
        return <IntroScreen onModeSelect={handleModeSelect} />;
    }

    if (gameState === 'mode-select' && gameMode) {
        return (
            <ModeConfirmation
                gameMode={gameMode}
                questions={questions}
                onStart={() => dispatch({ type: 'START_GAME' })}
                onReset={() => dispatch({ type: 'RESET' })}
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
                onShowAnswer={() => setShowFlashAnswer(true)}
                onFlashcardKnown={handleFlashcardKnown}
                onQuit={() => dispatch({ type: 'QUIT_GAME' })}
                flashcardResponse={state.flashcardResponses?.get(questions[currentIndex].id || '')}
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
                mcOptions={mcOptions || []}
                showAnswer={showAnswer}
                isCorrect={isCorrect}
                userAnswer={userAnswer}
                onMCAnswer={handleMCAnswer}
                onNext={handleNextQuestion}
                onQuit={() => dispatch({ type: 'QUIT_GAME' })}
            />
        );
    }

    if (gameState === 'review') {
        return (
            <ReviewScreen
                results={results}
                currentKnownItems={currentKnownItems}
                onBack={() => dispatch({ type: 'BACK_TO_RESULTS' })}
                onExport={exportKnownItems}
                onAddCorrect={addCorrectToKnownItems}
                onRemoveIncorrect={removeIncorrectFromKnownItems}
                onToggleKnown={toggleKnownItem}
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
                flashcardResponseCount={state.flashcardResponses?.size || 0}
                onReview={() => dispatch({ type: 'SHOW_REVIEW' })}
                onReset={() => dispatch({ type: 'RESET' })}
                onRetry={() => gameMode && handleModeSelect(gameMode)}
                onApplyFlashcard={applyFlashcardResponses}
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
            onQuit={() => dispatch({ type: 'QUIT_GAME' })}
        />
    );
};

export default QuizGame;
