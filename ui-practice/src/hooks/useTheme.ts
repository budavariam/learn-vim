import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';
export type ThemePreference = 'system' | 'light' | 'dark';

export const useTheme = () => {
    const [themePreference, setThemePreference] = useState<ThemePreference>('system');
    const [systemTheme, setSystemTheme] = useState<Theme>('dark');

    // Computed theme based on preference
    const theme: Theme = themePreference === 'system' ? systemTheme : themePreference;

    useEffect(() => {
        // Load saved preference from localStorage
        const savedPreference = localStorage.getItem('theme-preference') as ThemePreference;
        if (savedPreference && ['system', 'light', 'dark'].includes(savedPreference)) {
            setThemePreference(savedPreference);
        }

        // Check system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

        // Listen for changes in system preference
        const handleChange = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);

        // Cleanup listener on unmount
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // Apply dark class to document when theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        let newPreference: ThemePreference;

        if (themePreference === 'system') {
            // If currently on system, switch to the opposite of current system theme
            newPreference = systemTheme === 'dark' ? 'light' : 'dark';
        } else if (themePreference === 'light') {
            newPreference = 'dark';
        } else {
            // If dark, go back to system
            newPreference = 'system';
        }

        setThemePreference(newPreference);
        localStorage.setItem('theme-preference', newPreference);
    };

    const getThemeDisplayText = (): string => {
        if (themePreference === 'system') {
            return `Auto (${systemTheme})`;
        }
        return themePreference === 'light' ? 'Light' : 'Dark';
    };

    return {
        theme,
        themePreference,
        systemTheme,
        toggleTheme,
        getThemeDisplayText
    };
};
