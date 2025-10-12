import React from 'react';
import { gameModes, GameMode } from './QuizGame';
import type { QuizQuestion } from './QuizGame';
import ThemeToggle from './ThemeToggle';


interface ModeConfirmationProps {
    gameMode: GameMode;
    questions: QuizQuestion[];
    customQuestionCount: number | null;
    onStart: () => void;
    onReset: () => void;
    onSetQuestionCount: (count: number) => void;
}


const ModeConfirmation: React.FC<ModeConfirmationProps> = ({
    gameMode,
    questions,
    customQuestionCount,
    onStart,
    onReset,
    onSetQuestionCount
}) => {
    const config = gameModes[gameMode];
    const IconComponent = config.icon;
    const isFlashcardMode = gameMode.startsWith('flashcard');
    const isMCMode = gameMode.startsWith('mc-');

    const questionCountOptions = [10, 20, 30, 40, 50, 100];
    const currentCount = customQuestionCount || config.questionCount;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
            <div className="text-center space-y-6 md:space-y-8 fade-in w-full max-w-2xl">
                <ThemeToggle size="sm" className="mx-auto" />

                <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-r ${config.bgColor} flex items-center justify-center`}>
                    <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>

                <h2 className={`text-2xl md:text-4xl font-bold ${config.color} px-4`}>
                    {config.name}
                </h2>

                <div className="space-y-4 px-4">
                    <p className="text-lg md:text-xl terminal-text color-yellow">
                        {config.description}
                    </p>
                    
                    {isMCMode && (
                        <div className="space-y-4 max-w-md mx-auto">
                            <p className="text-base md:text-lg terminal-text color-cyan">Select number of questions:</p>
                            <div className="grid grid-cols-3 gap-2 md:gap-4">
                                {questionCountOptions.map(count => (
                                    <button
                                        key={count}
                                        onClick={() => onSetQuestionCount(count)}
                                        className={`px-3 py-3 md:px-6 md:py-4 rounded-lg border-2 transition-all duration-200 ${
                                            currentCount === count
                                                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                                                : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                                        }`}
                                    >
                                        <span className="text-xl md:text-2xl font-bold">{count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <p className="text-sm md:text-lg terminal-text color-cyan break-words">
                        {questions.length} {isFlashcardMode ? 'cards' : 'questions'} • {
                            isFlashcardMode ? 'Practice mode - apply changes at the end' :
                                gameMode?.startsWith('mc-') ? 'Multiple choice - Press 1-4 for quick answers' :
                                    'Type your answers'
                        }
                    </p>
                    {isFlashcardMode && (
                        <p className="text-xs md:text-sm terminal-text color-green">
                            ✓ Your responses are tracked but not saved until you finish
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
                    <button
                        onClick={onStart}
                        className="terminal-button-primary text-base md:text-xl px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto"
                    >
                        Begin {isFlashcardMode ? 'Practice' : 'Quiz'}
                    </button>
                    <button
                        onClick={onReset}
                        className="terminal-button-secondary text-base md:text-xl px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto"
                    >
                        Choose Different Mode
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ModeConfirmation;
