import React from 'react';
import { gameModes, getKnownItems, GameMode } from './QuizGame';
import type { QuizQuestion } from './QuizGame';
import ThemeToggle from './ThemeToggle';
import TypingText from './TypingText';
import quizData from '../data.json';

interface IntroScreenProps {
    onModeSelect: (mode: GameMode) => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onModeSelect }) => {
    const quizModes = Object.entries(gameModes).filter(([_, config]) => config.category === 'quiz');
    const practiceModes = Object.entries(gameModes).filter(([_, config]) => config.category === 'practice');
    const testModes = Object.entries(gameModes).filter(([_, config]) => config.category === 'test');

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 overflow-x-hidden">
            <div className="text-center space-y-6 md:space-y-8 fade-in max-w-7xl w-full">
                <ThemeToggle size="md" className="mx-auto mb-4" />

                <TypingText
                    text="Interactive Quiz Game"
                    className="text-3xl sm:text-4xl md:text-5xl font-bold color-cyan px-2"
                    speed={80}
                    startDelay={300}
                    onComplete={() => {
                        console.log('Typing animation completed');
                    }}
                />
                <p className="text-lg md:text-xl color-yellow px-4">
                    Test your Vim knowledge with different challenge modes
                </p>

                <div className="space-y-4 max-w-md mx-auto px-4">
                    <p className="terminal-text color-green text-sm md:text-base">
                        If there are <span className="font-semibold">color coded texts</span>,
                        include them in the answer.
                    </p>
                </div>

                {/* Quiz Modes */}
                <div className="space-y-4 px-2">
                    <h2 className="text-xl md:text-2xl font-bold color-cyan">📝 Quiz Modes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                        {quizModes.map(([mode, config]) => {
                            const IconComponent = config.icon;
                            return (
                                <div
                                    key={mode}
                                    onClick={() => onModeSelect(mode as GameMode)}
                                    className="group cursor-pointer h-full"
                                >
                                    <div className="quiz-card hover:scale-105 transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
                                        <div className="text-center space-y-3 md:space-y-4 flex-grow flex flex-col justify-between p-4">
                                            <div className="space-y-3 md:space-y-4">
                                                <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-gradient-to-r ${config.bgColor} flex items-center justify-center`}>
                                                    <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                                </div>
                                                <h3 className={`text-lg md:text-2xl font-bold ${config.color} break-words`}>
                                                    {config.name}
                                                </h3>
                                                <p className="terminal-text color-cyan min-h-[3rem] flex items-center justify-center text-sm md:text-base px-2">
                                                    {config.description}
                                                </p>
                                                <div className="text-base md:text-lg font-mono color-yellow">
                                                    {config.questionCount} Questions
                                                </div>
                                            </div>
                                            <button className="terminal-button-primary w-full group-hover:shadow-lg mt-3 md:mt-4 text-sm md:text-base">
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
                <div className="space-y-4 px-2">
                    <h2 className="text-xl md:text-2xl font-bold color-purple">🎴 Flashcard Practice</h2>
                    <p className="text-xs md:text-sm terminal-text color-cyan opacity-80 px-4">Practice freely - update your known items when you're done</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
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
                                    onClick={() => !isEmpty && onModeSelect(mode as GameMode)}
                                    className={`group h-full ${isEmpty ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                >
                                    <div className={`quiz-card transition-all duration-300 h-full flex flex-col ${!isEmpty && 'hover:scale-105 hover:shadow-2xl'}`}>
                                        <div className="text-center space-y-3 md:space-y-4 flex-grow flex flex-col justify-between p-4">
                                            <div className="space-y-3 md:space-y-4">
                                                <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-gradient-to-r ${config.bgColor} flex items-center justify-center`}>
                                                    <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                                </div>
                                                <h3 className={`text-lg md:text-2xl font-bold ${config.color} break-words`}>
                                                    {config.name}
                                                </h3>
                                                <p className="terminal-text color-cyan min-h-[3rem] flex items-center justify-center text-sm md:text-base px-2">
                                                    {config.description}
                                                </p>
                                                <div className="text-base md:text-lg font-mono color-yellow">
                                                    {isEmpty ? 'No cards available' : `${displayCount} Cards`}
                                                </div>
                                            </div>
                                            <button
                                                className={`terminal-button-primary w-full mt-3 md:mt-4 text-sm md:text-base ${!isEmpty && 'group-hover:shadow-lg'}`}
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
                <div className="space-y-4 px-2">
                    <h2 className="text-xl md:text-2xl font-bold color-green">✅ Multiple Choice Tests</h2>
                    <p className="text-xs md:text-sm terminal-text color-cyan opacity-80 px-4">Use keys 1-4 to quickly select answers</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                        {testModes.map(([mode, config]) => {
                            const IconComponent = config.icon;
                            return (
                                <div
                                    key={mode}
                                    onClick={() => onModeSelect(mode as GameMode)}
                                    className="group cursor-pointer h-full"
                                >
                                    <div className="quiz-card hover:scale-105 transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
                                        <div className="text-center space-y-3 md:space-y-4 flex-grow flex flex-col justify-between p-4">
                                            <div className="space-y-3 md:space-y-4">
                                                <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-gradient-to-r ${config.bgColor} flex items-center justify-center`}>
                                                    <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                                </div>
                                                <h3 className={`text-lg md:text-2xl font-bold ${config.color} break-words`}>
                                                    {config.name}
                                                </h3>
                                                <p className="terminal-text color-cyan min-h-[3rem] flex items-center justify-center text-sm md:text-base px-2">
                                                    {config.description}
                                                </p>
                                                <div className="text-base md:text-lg font-mono color-yellow">
                                                    {config.questionCount} Questions
                                                </div>
                                            </div>
                                            <button className="terminal-button-primary w-full group-hover:shadow-lg mt-3 md:mt-4 text-sm md:text-base">
                                                Start {config.name}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="text-center terminal-text color-cyan opacity-60 mt-6 md:mt-8 px-4">
                    <p className="text-sm md:text-base">Choose your challenge level to begin</p>
                </div>
            </div>
        </div>
    );
};

export default IntroScreen;
