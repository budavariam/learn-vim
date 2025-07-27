import React, { useState, useEffect, useRef } from 'react';

interface TypingTextProps {
    text: string;
    className?: string;
    speed?: number;
    startDelay?: number;
    onComplete?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({
    text,
    className = '',
    speed = 60,
    startDelay = 500,
    onComplete
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const elementRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const duration = text.length * speed;

        if (elementRef.current) {
            elementRef.current.style.setProperty('--char-count', text.length.toString());
            elementRef.current.style.setProperty('--typing-duration', `${duration}ms`);
        }

        const startTimer = setTimeout(() => {
            setShouldAnimate(true);
            setIsAnimating(true);
        }, startDelay);

        const endTimer = setTimeout(() => {
            setIsAnimating(false);
            onComplete?.();
        }, startDelay + duration + 100);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(endTimer);
        };
    }, [text, speed, startDelay, onComplete]);

    return (
        <div className="flex justify-center w-full">
            <h1
                ref={elementRef}
                className={`
          ${className} 
          ${shouldAnimate ? 'typing-animation animate' : 'typing-animation'}
          ${!isAnimating && shouldAnimate ? 'animation-complete' : ''}
        `}
            >
                {text}
            </h1>
        </div>
    );
};

export default TypingText;
