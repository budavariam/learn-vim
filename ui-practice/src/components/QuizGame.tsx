import React, { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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

export type GameState = 'intro' | 'mode-select' | 'playing' | 'flashcard' | 'multiple-choice' | 'finished' | 'review';
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

const getAvailableQuestionsForMode = (
    mode: GameMode,
    allQuestions: QuizQuestion[],
    knownItems: Set<string>
): QuizQuestion[] => {
    let filteredQuestions = allQuestions;
    // Only filter for flashcard-unknown and flashcard-repeat modes
    if (mode === 'flashcard-unknown') {
        filteredQuestions = allQuestions.filter(q => !knownItems.has(q.id || ''));
    } else if (mode === 'flashcard-repeat') {
        filteredQuestions = allQuestions.filter(q => knownItems.has(q.id || ''));
    }
    return shuffle(filteredQuestions);
};

const getQuestionsForMode = (
    mode: GameMode,
    allQuestions: QuizQuestion[],
    knownItems: Set<string>,
    customCount?: number
): QuizQuestion[] => {
    const availableQuestions = getAvailableQuestionsForMode(mode, allQuestions, knownItems);
    const configCount = gameModes[mode].questionCount;
    // Calculate effective count based on mode rules
    let effectiveCount: number;
    if (mode === 'flash' || mode === 'regular' || mode === 'all') {
        // Exact counts - no custom override
        effectiveCount = Math.min(configCount, availableQuestions.length);
    } else if (mode.startsWith('flashcard') || mode.startsWith('mc-')) {
        // Flashcard and MC modes - allow custom count
        effectiveCount = Math.min(customCount || configCount, availableQuestions.length);
    } else {
        // Fallback
        effectiveCount = Math.min(configCount, availableQuestions.length);
    }
    return availableQuestions.slice(0, effectiveCount);
};

// Session storage keys for maintaining state during game
const SESSION_KEYS = {
    questions: 'quiz_session_questions',
    results: 'quiz_session_results',
    currentIndex: 'quiz_session_currentIndex',
    score: 'quiz_session_score',
    flashcardResponses: 'quiz_session_flashcardResponses',
    sessionId: 'quiz_session_id',
    showFlashAnswer: 'quiz_session_showFlashAnswer',
    showAnswer: 'quiz_session_showAnswer',
    isCorrect: 'quiz_session_isCorrect',
    userAnswer: 'quiz_session_userAnswer'
};

const getSessionData = <T,>(key: string, defaultValue: T): T => {
    try {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const setSessionData = (key: string, value: any) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to session storage:', error);
    }
};

const clearSessionData = () => {
    Object.values(SESSION_KEYS).forEach(key => sessionStorage.removeItem(key));
};

/* ───────────────── component ─────────────────── */
const QuizGame: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{ gameMode?: string; questionCount?: string }>();

    // Derive state from URL
    const gameMode = params.gameMode as GameMode | undefined;
    const customQuestionCount = params.questionCount ? parseInt(params.questionCount, 10) : undefined;

    // Determine game state from path
    const gameState: GameState = useMemo(() => {
        const path = location.pathname;
        if (path === '/' || path === '') return 'intro';
        if (path.startsWith('/mode/')) return 'mode-select';
        if (path.startsWith('/play/')) {
            if (gameMode?.startsWith('flashcard')) return 'flashcard';
            if (gameMode?.startsWith('mc-')) return 'multiple-choice';
            return 'playing';
        }
        if (path.startsWith('/results/')) return 'finished';
        if (path.startsWith('/review/')) return 'review';
        return 'intro';
    }, [location.pathname, gameMode]);

    // Load known items
    const knownItems = useMemo(() => getKnownItems(), [gameState]);

    // Initialize or retrieve questions for the current game
    const questions = useMemo(() => {
        if (!gameMode) return [];

        // Check if we have an active session
        const sessionId = getSessionData<string>(SESSION_KEYS.sessionId, '');
        const currentSessionId = `${gameMode}_${customQuestionCount || 'default'}`;

        // If we're in the same session, retrieve existing questions
        if (sessionId === currentSessionId && gameState !== 'mode-select') {
            const savedQuestions = getSessionData<QuizQuestion[]>(SESSION_KEYS.questions, []);
            if (savedQuestions.length > 0) {
                return savedQuestions;
            }
        }

        // Generate new questions for mode-select or new session
        if (gameState === 'mode-select') {
            const availableQuestions = getAvailableQuestionsForMode(gameMode, quizData as QuizQuestion[], knownItems);
            return availableQuestions;
        }

        // Generate questions when starting game
        if (gameState === 'playing' || gameState === 'flashcard' || gameState === 'multiple-choice') {
            const newQuestions = getQuestionsForMode(gameMode, quizData as QuizQuestion[], knownItems, customQuestionCount);

            // Save to session
            setSessionData(SESSION_KEYS.sessionId, currentSessionId);
            setSessionData(SESSION_KEYS.questions, newQuestions);
            setSessionData(SESSION_KEYS.currentIndex, 0);
            setSessionData(SESSION_KEYS.score, 0);
            setSessionData(SESSION_KEYS.results, []);
            setSessionData(SESSION_KEYS.flashcardResponses, []);
            setSessionData(SESSION_KEYS.showFlashAnswer, false);
            setSessionData(SESSION_KEYS.showAnswer, false);

            return newQuestions;
        }

        // For finished/review, retrieve from session
        const savedQuestions = getSessionData<QuizQuestion[]>(SESSION_KEYS.questions, []);
        return savedQuestions;
    }, [gameMode, customQuestionCount, gameState, knownItems]);

    // Retrieve game progress from session
    const currentIndex = getSessionData<number>(SESSION_KEYS.currentIndex, 0);
    const score = getSessionData<number>(SESSION_KEYS.score, 0);
    const results = getSessionData<QuizResult[]>(SESSION_KEYS.results, []);
    const flashcardResponsesArray = getSessionData<Array<[string, boolean]>>(SESSION_KEYS.flashcardResponses, []);
    const flashcardResponses = useMemo(() => new Map(flashcardResponsesArray), [flashcardResponsesArray]);
    const showFlashAnswer = getSessionData<boolean>(SESSION_KEYS.showFlashAnswer, false);
    const showAnswer = getSessionData<boolean>(SESSION_KEYS.showAnswer, false);
    const isCorrect = getSessionData<boolean>(SESSION_KEYS.isCorrect, false);
    const userAnswer = getSessionData<string>(SESSION_KEYS.userAnswer, '');

    // Generate MC options for current question
    const mcOptions = useMemo(() => {
        if (!gameMode?.startsWith('mc-') || questions.length === 0 || currentIndex >= questions.length) {
            return [];
        }

        const currentQ = questions[currentIndex];
        const difficulty = gameMode === 'mc-easy' ? 'easy' : gameMode === 'mc-medium' ? 'medium' : 'hard';
        return generateMCOptions(currentQ.solution[0], quizData as QuizQuestion[], currentQ, difficulty);
    }, [gameMode, questions, currentIndex]);

    /* ──────────────── handlers ─────────────── */
    const handleModeSelect = useCallback((mode: GameMode) => {
        clearSessionData();
        navigate(`/mode/${mode}`);
    }, [navigate]);

    const handleSetQuestionCount = useCallback((count: number) => {
        if (gameMode) {
            navigate(`/mode/${gameMode}/${count}`);
        }
    }, [gameMode, navigate]);

    const handleStartGame = useCallback(() => {
        if (!gameMode) return;

        const path = customQuestionCount
            ? `/play/${gameMode}/${customQuestionCount}`
            : `/play/${gameMode}`;

        navigate(path);
    }, [gameMode, customQuestionCount, navigate]);

    const handleAnswer = useCallback((answer: string) => {
        if (!gameMode || questions.length === 0) return;

        const currentQ = questions[currentIndex];
        const correct = currentQ.solution.includes(answer.trim());
        const wasKnownBefore = knownItems.has(currentQ.id || '');

        const newResult: QuizResult = {
            question: currentQ,
            userAnswer: answer.trim(),
            isCorrect: correct,
            wasKnownBefore
        };

        const newResults = [...results, newResult];
        const newScore = correct ? score + 1 : score;
        const newIndex = currentIndex + 1;

        setSessionData(SESSION_KEYS.results, newResults);
        setSessionData(SESSION_KEYS.score, newScore);
        setSessionData(SESSION_KEYS.currentIndex, newIndex);

        // Navigate to next question or results
        if (newIndex >= questions.length) {
            navigate(`/results/${gameMode}`);
        }
    }, [gameMode, questions, currentIndex, results, score, knownItems, navigate]);

    const handleFlashcardResponse = useCallback((known: boolean) => {
        if (!gameMode || questions.length === 0) return;

        const currentQ = questions[currentIndex];
        if (currentQ.id) {
            const newResponses = [...flashcardResponsesArray, [currentQ.id, known]] as Array<[string, boolean]>;
            setSessionData(SESSION_KEYS.flashcardResponses, newResponses);
        }

        const newIndex = currentIndex + 1;
        setSessionData(SESSION_KEYS.currentIndex, newIndex);
        setSessionData(SESSION_KEYS.showFlashAnswer, false); // Reset for next card

        if (newIndex >= questions.length) {
            navigate(`/results/${gameMode}`);
        }
    }, [gameMode, questions, currentIndex, flashcardResponsesArray, navigate]);

    const handleShowFlashAnswer = useCallback(() => {
        setSessionData(SESSION_KEYS.showFlashAnswer, true);
    }, []);

    const handleQuitGame = useCallback(() => {
        if (gameMode) {
            navigate(`/results/${gameMode}`);
        }
    }, [gameMode, navigate]);

    const handleShowReview = useCallback(() => {
        if (gameMode) {
            navigate(`/review/${gameMode}`);
        }
    }, [gameMode, navigate]);

    const handleBackToResults = useCallback(() => {
        if (gameMode) {
            navigate(`/results/${gameMode}`);
        }
    }, [gameMode, navigate]);

    const handleHome = useCallback(() => {
        clearSessionData();
        navigate('/');
    }, [navigate]);

    const handleRetry = useCallback(() => {
        if (gameMode) {
            clearSessionData();
            navigate(`/mode/${gameMode}`);
        }
    }, [gameMode, navigate]);

    const handleToggleKnown = useCallback((id: string | undefined) => {
        if (!id) return;
        const newKnownItems = new Set(knownItems);
        if (newKnownItems.has(id)) {
            newKnownItems.delete(id);
        } else {
            newKnownItems.add(id);
        }
        saveKnownItems(newKnownItems);
    }, [knownItems]);

    const handleAddCorrectToKnown = useCallback(() => {
        const newKnownItems = new Set(knownItems);
        const correctResults = results.filter(result => result.isCorrect);
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
    }, [knownItems, results]);

    const handleRemoveIncorrectFromKnown = useCallback(() => {
        const newKnownItems = new Set(knownItems);
        const incorrectResults = results.filter(result => !result.isCorrect);
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
    }, [knownItems, results]);

    const handleApplyFlashcardResponses = useCallback(() => {
        const newKnownItems = new Set(knownItems);
        let addedCount = 0;
        let removedCount = 0;

        flashcardResponses.forEach((known, questionId) => {
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
            alert(`Updated known items!\n✓ Added: ${addedCount}\n✗ Removed: ${removedCount}`);
        }
    }, [knownItems, flashcardResponses]);

    const exportKnownItems = useCallback(() => {
        const knownItemsArray = [...knownItems];
        const dataStr = JSON.stringify(knownItemsArray, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'knownItems.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }, [knownItems]);

    const handleMCAnswer = useCallback((answer: string) => {
        if (!gameMode || questions.length === 0) return;

        const currentQ = questions[currentIndex];
        const correct = currentQ.solution.includes(answer.trim());

        setSessionData(SESSION_KEYS.userAnswer, answer.trim());
        setSessionData(SESSION_KEYS.isCorrect, correct);
        setSessionData(SESSION_KEYS.showAnswer, true);
    }, [gameMode, questions, currentIndex]);

    const handleNextQuestion = useCallback(() => {
        if (!gameMode || questions.length === 0) return;

        const currentQ = questions[currentIndex];
        const correct = isCorrect;
        const wasKnownBefore = knownItems.has(currentQ.id || '');

        const newResult: QuizResult = {
            question: currentQ,
            userAnswer: userAnswer,
            isCorrect: correct,
            wasKnownBefore
        };

        const newResults = [...results, newResult];
        const newScore = correct ? score + 1 : score;
        const newIndex = currentIndex + 1;

        setSessionData(SESSION_KEYS.results, newResults);
        setSessionData(SESSION_KEYS.score, newScore);
        setSessionData(SESSION_KEYS.currentIndex, newIndex);
        setSessionData(SESSION_KEYS.showAnswer, false);
        setSessionData(SESSION_KEYS.userAnswer, '');

        // Navigate to next question or results
        if (newIndex >= questions.length) {
            navigate(`/results/${gameMode}`);
        }
    }, [gameMode, questions, currentIndex, results, score, knownItems, navigate, isCorrect, userAnswer]);

    const handleAnswerChange = useCallback((answer: string) => {
        setSessionData(SESSION_KEYS.userAnswer, answer);
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim()) return;
        handleAnswer(userAnswer);
    }, [userAnswer, handleAnswer]);

    /* ────────────────── Render ─────────────────── */
    if (gameState === 'intro') {
        return <IntroScreen onModeSelect={handleModeSelect} />;
    }

    if (gameState === 'mode-select' && gameMode) {
        return (
            <ModeConfirmation
                gameMode={gameMode}
                questions={questions}
                customQuestionCount={customQuestionCount || gameModes[gameMode].questionCount}
                onStart={handleStartGame}
                onReset={handleHome}
                onSetQuestionCount={handleSetQuestionCount}
            />
        );
    }

    if (gameState === 'flashcard') {
        const currentQ = questions[currentIndex];
        const flashcardResponse = currentQ?.id ? flashcardResponses.get(currentQ.id) : undefined;

        return (
            <FlashcardMode
                question={currentQ}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                gameMode={gameMode!}
                showFlashAnswer={showFlashAnswer}
                onShowAnswer={handleShowFlashAnswer}
                onFlashcardKnown={handleFlashcardResponse}
                onQuit={handleQuitGame}
                flashcardResponse={flashcardResponse}
                onHome={handleHome}
            />
        );
    }

    if (gameState === 'multiple-choice') {
        const currentQ = questions[currentIndex];

        return (
            <MultipleChoiceMode
                question={currentQ}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                score={score}
                gameMode={gameMode!}
                mcOptions={mcOptions}
                showAnswer={showAnswer}
                isCorrect={isCorrect}
                userAnswer={userAnswer}
                onMCAnswer={handleMCAnswer}
                onNext={handleNextQuestion}
                onQuit={handleQuitGame}
                onHome={handleHome}
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
                onAddCorrect={handleAddCorrectToKnown}
                onRemoveIncorrect={handleRemoveIncorrectFromKnown}
                onToggleKnown={handleToggleKnown}
                onHome={handleHome}
            />
        );
    }

    if (gameState === 'finished') {
        const isFlashcardMode = gameMode?.startsWith('flashcard');

        return (
            <FinishedScreen
                gameMode={gameMode || null}
                score={score}
                totalQuestions={questions.length}
                results={results}
                flashcardResponseCount={flashcardResponses.size}
                onReview={handleShowReview}
                onReset={handleHome}
                onRetry={handleRetry}
                onApplyFlashcard={handleApplyFlashcardResponses}
            />
        );
    }

    // Default playing state
    const currentQ = questions[currentIndex];

    return (
        <QuizPlayingMode
            question={currentQ}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            score={score}
            gameMode={gameMode!}
            userAnswer={userAnswer}
            showAnswer={showAnswer}
            isCorrect={isCorrect}
            onHome={handleHome}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmit}
            onNext={handleNextQuestion}
            onQuit={handleQuitGame}
        />
    );
};

export default QuizGame;
