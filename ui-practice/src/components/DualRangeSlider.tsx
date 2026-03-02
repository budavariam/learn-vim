import React, { useRef } from 'react';

const LEVEL_LABELS = ['Novice', 'Beginner', 'Basic', 'Familiar', 'Intermediate', 'Proficient', 'Advanced', 'Expert', 'Master', 'Wizard'];

interface DualRangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    className?: string;
}

const DualRangeSlider: React.FC<DualRangeSliderProps> = ({ min, max, value, onChange, className = '' }) => {
    const rangeRef = useRef<HTMLDivElement>(null);

    const [lo, hi] = value;
    const total = max - min;
    const loPercent = ((lo - min) / total) * 100;
    const hiPercent = ((hi - min) / total) * 100;

    const handleLo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = Math.min(Number(e.target.value), hi);
        onChange([v, hi]);
    };

    const handleHi = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = Math.max(Number(e.target.value), lo);
        onChange([lo, v]);
    };

    return (
        <div className={`dual-range-slider ${className}`}>
            {/* Labels */}
            <div className="flex justify-between text-xs terminal-text color-cyan opacity-80 mb-1">
                <span>{LEVEL_LABELS[lo]} ({lo})</span>
                <span>{LEVEL_LABELS[hi]} ({hi})</span>
            </div>

            {/* Track container */}
            <div ref={rangeRef} className="relative h-6 flex items-center">
                {/* Base track */}
                <div className="absolute w-full h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />

                {/* Active range highlight */}
                <div
                    className="absolute h-1.5 rounded-full bg-cyan-500"
                    style={{ left: `${loPercent}%`, width: `${hiPercent - loPercent}%` }}
                />

                {/* Min thumb */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={lo}
                    onChange={handleLo}
                    className="dual-range-input"
                />

                {/* Max thumb */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={hi}
                    onChange={handleHi}
                    className="dual-range-input"
                />
            </div>

            {/* Tick marks */}
            <div className="flex justify-between mt-1">
                {Array.from({ length: max - min + 1 }, (_, i) => (
                    <div
                        key={i}
                        className={`text-xs font-mono text-center ${i + min >= lo && i + min <= hi ? 'color-cyan font-bold' : 'text-gray-400 dark:text-gray-600'}`}
                        style={{ width: `${100 / (max - min + 1)}%` }}
                    >
                        {i + min}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DualRangeSlider;
