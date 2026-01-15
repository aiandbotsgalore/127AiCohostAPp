import React, { useState, useEffect, useRef } from 'react';
import { styles } from './styles';

interface AvatarWidgetProps {
    isSpeaking: boolean;
    isListening: boolean;
}

export const AvatarWidget: React.FC<AvatarWidgetProps> = React.memo(({ isSpeaking, isListening }) => {
    const [blinkState, setBlinkState] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(0);
    const blinkTimeout = useRef<NodeJS.Timeout | null>(null);

    // Eye blink animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlinkState(true);
            // Store timeout ID for cleanup
            blinkTimeout.current = setTimeout(() => setBlinkState(false), 150);
        }, 3000 + Math.random() * 2000);

        return () => {
            clearInterval(blinkInterval);
            // Clear any pending blink timeout
            if (blinkTimeout.current) {
                clearTimeout(blinkTimeout.current);
            }
        };
    }, []);

    // Mouth animation based on speaking
    useEffect(() => {
        if (isSpeaking) {
            const mouthInterval = setInterval(() => {
                setMouthOpen(Math.random() * 0.5 + 0.3);
            }, 100);
            return () => clearInterval(mouthInterval);
        } else {
            setMouthOpen(0);
            return undefined;
        }
    }, [isSpeaking]);

    return (
        <svg viewBox="0 0 200 200" style={styles.avatarSvg}>
            {/* Status Glow Ring */}
            <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke={isSpeaking ? '#ff4444' : isListening ? '#ffaa00' : '#00ddff'}
                strokeWidth="4"
                opacity="0.6"
                style={{
                    filter: `drop-shadow(0 0 10px ${isSpeaking ? '#ff4444' : isListening ? '#ffaa00' : '#00ddff'})`
                }}
            />

            {/* Head tilt when listening */}
            <g transform={isListening ? 'rotate(5 100 100)' : 'rotate(0 100 100)'}>
                {/* Bear Head */}
                <circle cx="100" cy="100" r="60" fill="#D4A574" />

                {/* Ears */}
                <circle cx="65" cy="60" r="20" fill="#D4A574" />
                <circle cx="135" cy="60" r="20" fill="#D4A574" />
                <circle cx="65" cy="60" r="12" fill="#C4956A" />
                <circle cx="135" cy="60" r="12" fill="#C4956A" />

                {/* Bandage */}
                <rect x="80" y="45" width="40" height="12" fill="#FFF" rx="2" />
                <line x1="85" y1="45" x2="85" y2="57" stroke="#DDD" strokeWidth="1" />
                <line x1="100" y1="45" x2="100" y2="57" stroke="#DDD" strokeWidth="1" />
                <line x1="115" y1="45" x2="115" y2="57" stroke="#DDD" strokeWidth="1" />

                {/* Snout */}
                <ellipse cx="100" cy="115" rx="35" ry="28" fill="#C4956A" />

                {/* Nose */}
                <ellipse cx="100" cy="108" rx="12" ry="10" fill="#3D2817" />

                {/* Eyes with blink */}
                {!blinkState ? (
                    <>
                        <ellipse cx="80" cy="90" rx="8" ry="10" fill="#3D2817" />
                        <ellipse cx="120" cy="90" rx="8" ry="10" fill="#3D2817" />
                    </>
                ) : (
                    <>
                        <line x1="72" y1="90" x2="88" y2="90" stroke="#3D2817" strokeWidth="2" />
                        <line x1="112" y1="90" x2="128" y2="90" stroke="#3D2817" strokeWidth="2" />
                    </>
                )}
                <path d="M 72 82 Q 80 85 88 82" stroke="#3D2817" strokeWidth="2" fill="none" />
                <path d="M 112 82 Q 120 85 128 82" stroke="#3D2817" strokeWidth="2" fill="none" />

                {/* Mouth with animation */}
                <path
                    d={`M 80 ${125 + mouthOpen * 10} Q 100 ${122 + mouthOpen * 15} 120 ${125 + mouthOpen * 10}`}
                    stroke="#3D2817"
                    strokeWidth="2"
                    fill="none"
                />

                {/* Cigarette */}
                <rect x="125" y="112" width="30" height="4" fill="#FFF" rx="2" />
                <rect x="152" y="111" width="8" height="6" fill="#D4A574" rx="1" />
                <circle cx="156" cy="114" r="2" fill="#ff6600" />
            </g>
        </svg>
    );
});
