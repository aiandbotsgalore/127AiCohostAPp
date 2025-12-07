
import React, { useState, useRef, useEffect } from 'react';
import { ConversationTurn } from '../../../shared/types';
import '../ControlCenter.css';

interface ChatPanelProps {
    messages: ConversationTurn[];
    recording: boolean;
    onSendMessage: (text: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, recording, onSendMessage }) => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText.trim());
            setInputText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="chat-panel">
            {/* Dr. Snuggles Header */}
            <div className="chat-header">
                <div className="snuggles-avatar-container">
                    <img src="/dr-snuggles.png" alt="Dr. Snuggles" className="snuggles-avatar" />
                    <div className={`avatar-status ${recording ? 'online' : 'offline'}`}></div>
                </div>
                <div className="snuggles-info">
                    <h2 className="snuggles-name">Dr. Snuggles</h2>
                    <span className={`snuggles-status ${recording ? 'active' : ''}`}>
                        {recording ? '● LIVE - Listening...' : '○ Offline'}
                    </span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <img src="/dr-snuggles.png" alt="Dr. Snuggles" className="empty-avatar" />
                        <p>I'm waiting. Speak... or type. Either way, I'll dissect your thoughts with surgical precision.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`chat-message ${msg.role}`}>
                            {msg.role === 'assistant' && (
                                <img src="/dr-snuggles.png" alt="Dr. Snuggles" className="message-avatar" />
                            )}
                            <div className="message-bubble">
                                <p className="message-text">{msg.text}</p>
                                <span className="message-time">{formatTime(msg.timestamp)}</span>
                            </div>
                            {msg.role === 'user' && (
                                <div className="user-avatar">YOU</div>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form className="chat-input-form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <textarea
                        className="chat-input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message to Dr. Snuggles..."
                        rows={1}
                    />
                    <button
                        type="submit"
                        className={`send-button ${inputText.trim() ? 'active' : ''}`}
                        disabled={!inputText.trim()}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
                <span className="input-hint">Press Enter to send, Shift+Enter for new line</span>
            </form>
        </div>
    );
};
