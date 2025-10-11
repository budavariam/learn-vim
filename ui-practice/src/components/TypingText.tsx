import React, { useState, useEffect, useRef } from 'react';
import "./TypingText.css"

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

        console.log('[TypingText] Animation config:', {
            text,
            textLength: text.length,
            speed,
            startDelay,
            calculatedDuration: duration,
            timestamp: new Date().toISOString()
        });

        if (elementRef.current) {
            try {
                // Set CSS custom properties
                elementRef.current.style.setProperty('--char-count', text.length.toString());
                elementRef.current.style.setProperty('--typing-duration', `${duration}ms`);
                
                // Critical: Set max-width to constrain the animation
                elementRef.current.style.setProperty('max-width', `${text.length}ch`);
                elementRef.current.style.setProperty('width', 'fit-content');
                
                console.log('[TypingText] CSS properties set:', {
                    charCount: text.length,
                    duration: `${duration}ms`,
                    maxWidth: `${text.length}ch`,
                    element: elementRef.current.tagName
                });
            } catch (error) {
                console.error('[TypingText] Error setting CSS properties:', error);
            }
        } else {
            console.warn('[TypingText] Element ref is null during setup');
        }

        const startTimer = setTimeout(() => {
            console.log('[TypingText] Starting animation', { timestamp: new Date().toISOString() });
            setShouldAnimate(true);
            setIsAnimating(true);
        }, startDelay);

        const endTimer = setTimeout(() => {
            console.log('[TypingText] Animation completed', { 
                timestamp: new Date().toISOString(),
                totalTime: startDelay + duration + 100
            });
            setIsAnimating(false);
            try {
                onComplete?.();
            } catch (error) {
                console.error('[TypingText] Error in onComplete callback:', error);
            }
        }, startDelay + duration + 100);

        return () => {
            console.log('[TypingText] Cleanup: clearing timers');
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
                style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                }}
            >
                {text}
            </h1>
        </div>
    );
};

export default TypingText;
