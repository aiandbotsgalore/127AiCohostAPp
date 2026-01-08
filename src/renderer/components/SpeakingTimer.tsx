import React, { useState, useEffect } from 'react';
import { ipc } from '../ipc';
import { styles } from './styles';

export const SpeakingTimer: React.FC = React.memo(() => {
    const [speakingTime, setSpeakingTime] = useState(0);

    useEffect(() => {
        const unsubscribe = ipc.on('genai:vadState', (_event: any, data: { isSpeaking: boolean }) => {
            if (data.isSpeaking) {
                setSpeakingTime(prev => prev + 0.8);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <span style={styles.analyticsValue}>{Math.floor(speakingTime)}s</span>
    );
});
