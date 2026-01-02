import React, { useState, useEffect, useRef } from 'react';

export const CopyButton: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    return (
        <button
            style={{ ...style, color: copied ? '#00ff88' : style?.color }}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy message'}
            aria-label={copied ? 'Copied' : 'Copy message'}
        >
            {copied ? '✓' : '📋'}
        </button>
    );
};
