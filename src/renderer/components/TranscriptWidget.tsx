import React, { useState, useEffect, useRef, useMemo } from 'react';
import { styles } from './styles';

interface Message {
    id: string;
    role: string;
    text: string;
    timestamp: number;
    speaker?: string;
}

interface TranscriptWidgetProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    onClear: () => void;
    onExport: () => void;
    connectionStatus: { connected: boolean };
    // We can accept styles or import them. Since they are imported in parent, we can import them here too.
}

const CopyButton: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => {
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

export const TranscriptWidget: React.FC<TranscriptWidgetProps> = React.memo(({
    messages,
    onSendMessage,
    onClear,
    onExport,
    connectionStatus
}) => {
    const [transcriptSearch, setTranscriptSearch] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const transcriptRef = useRef<HTMLDivElement>(null);

    // Auto-scroll transcript
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [messages]);

    // Keyboard shortcuts (Ctrl+K for search)
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'k') {
                    e.preventDefault();
                    setTranscriptSearch('');
                    const searchInput = document.querySelector('[data-search-transcript]') as HTMLElement;
                    searchInput?.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Filter messages with defensive null checks to prevent errors when msg.speaker is undefined
    const filteredMessages = useMemo(() => messages.filter(msg =>
        !transcriptSearch ||
        (msg.text && msg.text.toLowerCase().includes(transcriptSearch.toLowerCase())) ||
        (msg.speaker && msg.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())) ||
        (msg.role && msg.role.toLowerCase().includes(transcriptSearch.toLowerCase()))
    ), [messages, transcriptSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        onSendMessage(messageInput.trim());
        setMessageInput('');
    };

    return (
        <div style={styles.centerPanel}>
            <div style={styles.sectionHeaderRow}>
                <div style={styles.sectionHeader}>💬 TRANSCRIPT</div>
                <div style={styles.transcriptTools}>
                    <input
                        type="text"
                        placeholder="Search... (Ctrl+K)"
                        value={transcriptSearch}
                        onChange={(e) => setTranscriptSearch(e.target.value)}
                        style={styles.searchInput}
                        data-search-transcript
                        aria-label="Search transcript"
                    />
                    <button
                        style={styles.toolBtn}
                        onClick={onExport}
                        title="Export transcript"
                        aria-label="Export transcript"
                    >
                        📥
                    </button>
                    <button
                        style={styles.toolBtn}
                        onClick={onClear}
                        title="Clear transcript"
                        aria-label="Clear transcript"
                    >
                        🗑️
                    </button>
                </div>
            </div>
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
            {/* Text Input Area */}
            <div style={{
                padding: '15px',
                borderTop: '1px solid #333',
                background: '#13131f'
            }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message to Dr. Snuggles..."
                        aria-label="Message to Dr. Snuggles"
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #444',
                            background: '#1a1a2e',
                            color: '#fff',
                            outline: 'none',
                            fontFamily: 'inherit'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!connectionStatus.connected}
                        style={{
                            padding: '0 20px',
                            borderRadius: '8px',
                            border: 'none',
                            background: connectionStatus.connected ? '#8a2be2' : '#444',
                            color: '#fff',
                            cursor: connectionStatus.connected ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold'
                        }}
                    >
                        SEND
                    </button>
                </form>
            </div>
        </div>
    );
});
