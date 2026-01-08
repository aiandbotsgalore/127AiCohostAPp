import React, { useState, useEffect } from 'react';
import { ipc } from '../ipc';
import { styles } from './styles';

export const MessageCounterWidget: React.FC = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const unsubscribers: (() => void)[] = [];

        // Listen for incoming messages (chunks)
        unsubscribers.push(ipc.on('message-received', (event, message) => {
            void event;
            void message;
            setCount(prev => prev + 1);
        }));

        // Listen for user messages sent from TranscriptWidget
        const handleUserMessage = () => {
            setCount(prev => prev + 1);
        };
        window.addEventListener('snuggles-message-sent', handleUserMessage);

        return () => {
            unsubscribers.forEach(unsub => unsub());
            window.removeEventListener('snuggles-message-sent', handleUserMessage);
        };
    }, []);

    return (
        <span style={styles.analyticsValue}>{count}</span>
    );
};
