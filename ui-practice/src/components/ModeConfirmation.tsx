import React from 'react';
import { gameModes, GameMode } from './QuizGame';
import type { QuizQuestion } from './QuizGame';
import ThemeToggle from './ThemeToggle';

interface ModeConfirmationProps {
    gameMode: GameMode;
    questions: QuizQuestion[];
    onStart: () => void;
    onReset: () => void;
}

const ModeConfirmation: React.FC<ModeConfirmationProps> = ({
    gameMode,
    questions,
    onStart,
    onReset
}) => {
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
                        onClick={onStart}
                        className="terminal-button-primary text-xl px-8 py-4"
                    >
                        Begin {isFlashcardMode ? 'Practice' : 'Quiz'}
                    </button>
                    <button
                        onClick={onReset}
                        className="terminal-button-secondary text-xl px-8 py-4"
                    >
                        Choose Different Mode
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModeConfirmation;
