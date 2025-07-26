import React from 'react';

interface ColoredTextProps {
  text: string;
}

const ColoredText: React.FC<ColoredTextProps> = ({ text }) => {
  // Parse text with backticks for coloring (like your original regex)
  const parseText = (text: string): React.ReactNode[] => {
    const parts = text.split(/(`[^`]*`)/);
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        // Remove backticks and apply green color
        const content = part.slice(1, -1);
        return (
          <span key={index} className="color-green font-semibold">
            {content}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return <>{parseText(text)}</>;
};

export default ColoredText;
