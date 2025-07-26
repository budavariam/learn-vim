import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        // Check if user has a preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Set initial theme based on system preference
        setTheme(mediaQuery.matches ? 'dark' : 'light');

        // Listen for changes in system preference
        const handleChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);

        // Cleanup listener on unmount
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return theme;
};
