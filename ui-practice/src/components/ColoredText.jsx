import React from 'react';

const ColoredText = ({ text }) => {
    const parseText = (text) => {
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
