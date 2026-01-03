import React, { useMemo, useRef, useEffect } from 'react';
import { styles } from './styles';
import { CopyButton } from './CopyButton';

interface Message {
    id: string;
    role: string;
    text: string;
    timestamp: number;
    speaker?: string;
}

interface TranscriptWidgetProps {
    messages: Message[];
    searchQuery: string;
}

const TranscriptWidget: React.FC<TranscriptWidgetProps> = React.memo(({ messages, searchQuery }) => {
    const transcriptRef = useRef<HTMLDivElement>(null);

    // Filter messages logic moved here
    const filteredMessages = useMemo(() => messages.filter(msg =>
        !searchQuery ||
        (msg.text && msg.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (msg.speaker && msg.speaker.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (msg.role && msg.role.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [messages, searchQuery]);

    // Auto-scroll transcript
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [messages]); // Scroll on new messages (not just filtered ones, though effectively similar if displaying all)

    return (
        <div style={styles.transcript} ref={transcriptRef}>
            {messages.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyStateIcon}>💬</div>
                    <div style={styles.emptyStateText}>No transcript yet.</div>
                    <div style={styles.emptyStateSubtext}>Start voice mode or send a message to begin.</div>
                </div>
            ) : filteredMessages.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyStateIcon}>🔎</div>
                    <div style={styles.emptyStateText}>No messages match your search.</div>
                    <div style={styles.emptyStateSubtext}>Try a different keyword or clear the search.</div>
                </div>
            ) : (
                filteredMessages.map((msg, idx) => {
                    const isSequence = idx > 0 && filteredMessages[idx - 1].role === msg.role;
                    return (
                        <div
                            key={msg.id || idx}
                            style={{
                                ...styles.transcriptMessage,
                                marginTop: isSequence ? '2px' : '20px',
                                borderTopLeftRadius: msg.role === 'user' ? '12px' : (isSequence ? '4px' : '12px'),
                                borderTopRightRadius: msg.role === 'user' ? (isSequence ? '4px' : '12px') : '12px',
                                borderBottomLeftRadius: msg.role === 'user' ? '12px' : '4px',
                                borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                background: msg.role === 'user' ? 'rgba(0, 221, 255, 0.05)' : 'rgba(138, 43, 226, 0.05)',
                                border: msg.role === 'user' ? '1px solid rgba(0, 221, 255, 0.1)' : '1px solid rgba(138, 43, 226, 0.1)',
                                textAlign: 'left' // Keep text left aligned for readability even in right bubble
                            }}
                        >
                            {!isSequence && (
                                <div style={styles.transcriptHeader}>
                                    <span style={{
                                        ...styles.transcriptSpeaker,
                                        color: msg.role === 'assistant' ? '#8a2be2' : '#00ddff'
                                    }}>
                                        {msg.speaker || (msg.role === 'user' ? 'YOU' : 'DR. SNUGGLES')}
                                    </span>
                                    <div style={styles.transcriptActions}>
                                        <CopyButton text={msg.text} style={styles.copyBtn} />
                                        <span style={styles.transcriptTime}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div style={styles.transcriptText}>{msg.text}</div>
                        </div>
                    );
                })
            )}
        </div>
    );
});

export default TranscriptWidget;
