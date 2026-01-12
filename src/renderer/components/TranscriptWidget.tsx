import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ipc } from '../ipc';
import { styles } from './styles';
import { CopyButton } from './CopyButton';
import { InputModal } from './InputModal';

interface TranscriptWidgetProps {
    connectionStatus: { connected: boolean; quality: number };
    onShowToast: (message: string, type?: 'error' | 'success') => void;
}

export const TranscriptWidget: React.FC<TranscriptWidgetProps> = React.memo(({ connectionStatus, onShowToast }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [transcriptSearch, setTranscriptSearch] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        placeholder: undefined as string | undefined,
        description: undefined as string | undefined,
        confirmText: 'Confirm',
        confirmVariant: 'primary' as 'primary' | 'danger',
        type: '' as '' | 'clearTranscript',
    });

    const transcriptRef = useRef<HTMLDivElement>(null);

    // Auto-scroll transcript
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [messages]);

    // IPC Listeners
    useEffect(() => {
        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(ipc.on('message-received', (event, message) => {
            void event;
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                // Check if last message is from same role and recent (within 5 seconds)
                // If so, append text instead of new bubble
                // Added 5s timeout check to prevent merging messages from different turns that just happened to be sequential
                if (lastMsg && lastMsg.role === message.role && (Date.now() - lastMsg.timestamp < 5000)) {
                    // Create new array with replaced last item
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = {
                        ...lastMsg,
                        text: lastMsg.text + message.text
                    };
                    return newHistory;
                }
                // Otherwise new message
                return [...prev, message].slice(-100);
            });
        }));

        const handleTranscript = (event: any) => {
            const { text, role } = event.detail;
            console.log(`[GUI] Transcript received (${role}):`, text);

            const newMessage = {
                id: `msg-${Date.now()}-${Math.random()}`,
                role: role,
                text: text,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, newMessage].slice(-100)); // Limit to 100 messages
        };

        window.addEventListener('snugglesTranscript', handleTranscript);

        return () => {
            unsubscribers.forEach(unsub => unsub && unsub());
            window.removeEventListener('snugglesTranscript', handleTranscript);
        };
    }, []);

    // Filter messages
    const filteredMessages = useMemo(() => messages.filter(msg =>
        !transcriptSearch ||
        (msg.text && msg.text.toLowerCase().includes(transcriptSearch.toLowerCase())) ||
        (msg.speaker && msg.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())) ||
        (msg.role && msg.role.toLowerCase().includes(transcriptSearch.toLowerCase()))
    ), [messages, transcriptSearch]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        // Optimistically add user message to UI
        const text = messageInput.trim();

        const newMessage = {
            id: `msg-${Date.now()}-${Math.random()}`,
            role: 'user',
            text: text,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, newMessage].slice(-100));

        // Trigger generic message event for parent counter (if needed via window event since IPC is one-way from main)
        // Actually parent listens to IPC 'message-received'. This is outgoing.
        // Parent does NOT update counter on outgoing messages in the original code?
        // Wait, original:
        /*
        const handleSendMessage = async (e: React.FormEvent) => {
            // ...
            setMessages(prev => [...prev, newMessage].slice(-100));
            setMessageCount(prev => prev + 1);
            // ...
        */
        // So outgoing messages DO increment count.
        // I need to notify parent. I can use a custom event or callback.
        // But since I'm strict on performance, I'll use a window event so I don't need to pass a callback that might break memoization if not careful?
        // No, passing `onMessageSent` callback is fine if parent memoizes it.
        // But let's check if parent memoizes it. Parent is `DrSnugglesControlCenter`.
        // I'll emit a window event 'snuggles-message-sent' or just let parent handle it?
        // The parent has `messageCount` state.
        // I'll dispatch a custom event for the parent to listen to, or pass a callback.
        // Passing a callback is cleaner. But to avoid parent re-render breaking this widget's memo, the callback must be stable.

        // Actually, let's just emit a window event for simplicity and decoupling.
        window.dispatchEvent(new CustomEvent('snuggles-message-sent'));

        setMessageInput(''); // Clear input immediately

        // Send to backend via IPC
        ipc.send('send-message', text);
    };

    const handleClearTranscript = () => {
        setModalConfig({
            isOpen: true,
            title: 'Clear Transcript',
            placeholder: undefined,
            description: 'Are you sure you want to clear all messages? This action cannot be undone.',
            confirmText: 'Clear Messages',
            confirmVariant: 'danger',
            type: 'clearTranscript',
        });
    };

    const handleExportTranscript = () => {
        const data = JSON.stringify(messages, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript-${Date.now()}.json`;
        a.click();
        onShowToast('Transcript exported to file');
    };

    const handleModalSubmit = (_value: string) => {
        if (modalConfig.type === 'clearTranscript') {
            setMessages([]);
            onShowToast('Transcript cleared');
        }
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    // Keyboard shortcuts for search
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setTranscriptSearch('');
                (document.querySelector('[data-search]') as HTMLElement)?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

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
                        data-search
                        aria-label="Search transcript"
                    />
                    <button
                        style={styles.toolBtn}
                        onClick={handleExportTranscript}
                        title="Export transcript"
                        aria-label="Export transcript"
                    >
                        📥
                    </button>
                    <button
                        style={styles.toolBtn}
                        onClick={handleClearTranscript}
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
            {/* NEW: Text Input Area */}
            <div style={{
                padding: '15px',
                borderTop: '1px solid #333',
                background: '#13131f'
            }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message to Dr. Snuggles..."
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

            <InputModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                placeholder={modalConfig.placeholder}
                description={modalConfig.description}
                confirmText={modalConfig.confirmText}
                confirmVariant={modalConfig.confirmVariant}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
});

TranscriptWidget.displayName = 'TranscriptWidget';
