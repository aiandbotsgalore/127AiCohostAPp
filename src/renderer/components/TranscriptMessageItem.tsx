import React, { memo } from 'react';
import { styles } from './styles';
import { CopyButton } from './CopyButton';

interface TranscriptMessageItemProps {
    msg: {
        id: string;
        role: string;
        text: string;
        timestamp: number;
        speaker?: string;
    };
    isSequence: boolean;
}

const TranscriptMessageItem: React.FC<TranscriptMessageItemProps> = ({ msg, isSequence }) => {
    return (
        <div
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
};

export default memo(TranscriptMessageItem);
