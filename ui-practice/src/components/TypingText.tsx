import React, { useState, useEffect, useRef } from 'react';
import styles from './TypingText.module.css';
import { useTheme } from '../hooks/useTheme';

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
    const [isReady, setIsReady] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const elementRef = useRef<HTMLHeadingElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        // Measure the actual text width and height
        if (measureRef.current && elementRef.current) {
            const textWidth = measureRef.current.offsetWidth;
            const textHeight = measureRef.current.offsetHeight;
            const duration = text.length * speed;

            // Set the exact target width and ensure height is preserved
            elementRef.current.style.setProperty('--target-width', `${textWidth}px`);
            elementRef.current.style.setProperty('--char-count', text.length.toString());
            elementRef.current.style.setProperty('--typing-duration', `${duration}ms`);
            elementRef.current.style.setProperty('height', `${textHeight}px`);

            setIsReady(true);

            const startTimer = setTimeout(() => {
                setShouldAnimate(true);
            }, startDelay);

            const endTimer = setTimeout(() => {
                onComplete?.();
            }, startDelay + duration + 100);

            return () => {
                clearTimeout(startTimer);
                clearTimeout(endTimer);
            };
        }
    }, [text, speed, startDelay, onComplete]);

    return (
        <div className={`w-full relative ${styles.container} ${theme === 'dark' ? styles.dark : ''}`}>
            {/* Hidden element to measure actual text dimensions */}
            <span
                ref={measureRef}
                className={`${className} ${styles.measureElement}`}
                aria-hidden="true"
            >
                {text}
            </span>

            {/* Actual typing element */}
            {isReady && (
                <h1
                    ref={elementRef}
                    className={`
            ${className} 
            ${styles.typingAnimationPrecise}
            ${shouldAnimate ? styles.animate : ''}
          `}
                >
                    {text}
                </h1>
            )}
        </div>
    );
};

export default TypingText;
