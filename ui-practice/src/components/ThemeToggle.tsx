import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const { theme, themePreference, toggleTheme, getThemeDisplayText } = useTheme();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getIcon = () => {
    if (themePreference === 'system') {
      return <Monitor className={sizeClasses[size]} />;
    }
    return themePreference === 'light' ? 
      <Sun className={sizeClasses[size]} /> : 
      <Moon className={sizeClasses[size]} />;
  };

  const getButtonClasses = () => {
    const baseClasses = `
      flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 
      hover:scale-105 active:scale-95 cursor-pointer
      bg-light-fg/10 hover:bg-light-fg/20 dark:bg-terminal-fg/10 dark:hover:bg-terminal-fg/20
      border border-light-cyan/30 dark:border-terminal-cyan/30
      hover:border-light-cyan/50 dark:hover:border-terminal-cyan/50
    `;
    return `${baseClasses} ${className}`;
  };

  return (
    <button
      onClick={toggleTheme}
      className={getButtonClasses()}
      title={`Current: ${getThemeDisplayText()}. Click to toggle theme`}
      aria-label={`Toggle theme. Current: ${getThemeDisplayText()}`}
    >
      <span className="color-cyan transition-colors duration-200">
        {getIcon()}
      </span>
      {showText && (
        <span className="text-sm color-cyan opacity-70 hover:opacity-100 transition-opacity duration-200">
          {getThemeDisplayText()}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
