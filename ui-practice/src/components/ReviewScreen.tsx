import React from 'react';
import { Eye, Download, Plus, Minus, CheckCircle, XCircle, Target, ToggleLeft, ToggleRight } from 'lucide-react';
import { calculateImpacts } from './QuizGame';
import type { QuizResult } from './QuizGame';
import ColoredText from './ColoredText';
import ThemeToggle from './ThemeToggle';

interface ReviewScreenProps {
    results: QuizResult[];
    currentKnownItems: Set<string>;
    onBack: () => void;
    onExport: () => void;
    onAddCorrect: () => void;
    onRemoveIncorrect: () => void;
    onHome: () => void;
    onToggleKnown: (questionId: string | undefined) => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({
    results,
    currentKnownItems,
    onBack,
    onExport,
    onAddCorrect,
    onRemoveIncorrect,
    onHome,
    onToggleKnown
}) => {
    const correctAnswers = results.filter(r => r.isCorrect);
    const incorrectAnswers = results.filter(r => !r.isCorrect);
    const knownButMissed = results.filter(r => !r.isCorrect && r.wasKnownBefore);
    const { correctToAdd, incorrectToRemove } = calculateImpacts(results);

    const totalAnswered = results.length;
    const accuracy = totalAnswered > 0 ? Math.round((correctAnswers.length / totalAnswered) * 100) : 0;

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => onHome()}>
                        <Eye className="w-8 h-8 color-cyan" />
                        <h1 className="text-3xl font-bold color-cyan">Review Session</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle size="sm" showText={false} />
                        <button
                            onClick={onBack}
                            className="terminal-button-secondary"
                        >
                            Back to Results
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <button
                        onClick={onExport}
                        className="terminal-button-primary flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export Known Items
                    </button>
                    <button
                        onClick={onAddCorrect}
                        className="terminal-button-success flex items-center justify-center gap-2"
                        disabled={correctToAdd === 0}
                        title={correctToAdd === 0 ? "All correct answers are already in known items" : `Will add ${correctToAdd} new items to known list`}
                    >
                        <Plus className="w-4 h-4" />
                        Add Correct (+{correctToAdd})
                    </button>
                    <button
                        onClick={onRemoveIncorrect}
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
                                                            onClick={() => onToggleKnown(result.question.id)}
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
};

export default ReviewScreen;
