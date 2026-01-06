import React, { useState, useEffect } from 'react';
import { ipc } from '../ipc';
import { styles } from './styles';

export const SpeakingTimer: React.FC = () => {
    const [speakingTime, setSpeakingTime] = useState(0);

    useEffect(() => {
        const unsubscribe = ipc.on('genai:vadState', (_event, data) => {
            if (data.isSpeaking) {
                // Original logic: setSpeakingTime(prev => prev + 0.8);
                // Assuming this accumulates 0.8s per event.
                setSpeakingTime(prev => prev + 0.8);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <span style={styles.analyticsValue}>{Math.floor(speakingTime)}s</span>
    );
};
