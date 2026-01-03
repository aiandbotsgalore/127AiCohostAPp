import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AudioCaptureService } from '../services/audioCaptureService';
import { AudioPlaybackService } from '../services/audioPlaybackService';
import { ipc } from '../ipc';
import { AudioMeterWidget } from './AudioMeterWidget';
import { AvatarWidget } from './AvatarWidget';
import { StatusBarWidget } from './StatusBarWidget';
import { InputModal } from './InputModal';
import TranscriptWidget from './TranscriptWidget';
import { styles } from './styles';

// Voice options
const voices: Record<string, string> = {
  Puck: 'Youthful, energetic, slightly mischievous',
  Charon: 'Deep, gravelly, authoritative',
  Kore: 'Warm, nurturing, wise',
  Fenrir: 'Fierce, powerful, commanding',
  Aoede: 'Musical, melodic, soothing',
  Leda: 'Elegant, refined, sophisticated',
  Orus: 'Mysterious, enigmatic, alluring',
  Zephyr: 'Light, airy, playful'
};

const DrSnugglesControlCenter: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, quality: 0 });
  const [selectedVoice, setSelectedVoice] = useState('Charon');
  const [useCustomVoice, setUseCustomVoice] = useState(false);
  const [outputVolume, setOutputVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [vadStatus, setVadStatus] = useState({ isSpeaking: false, isListening: false });

  const [thinkingMode, setThinkingMode] = useState(false);
  const [thinkingBudget, setThinkingBudget] = useState(5000);
  const [emotionalRange, setEmotionalRange] = useState(true);
  const [canInterrupt, setCanInterrupt] = useState(true);
  const [listeningSensitivity, setListeningSensitivity] = useState('Medium');

  const [messages, setMessages] = useState<any[]>([]);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const [contextInput, setContextInput] = useState('');
  const [contextHistory, setContextHistory] = useState<any[]>([]);

  const [systemPrompt, setSystemPrompt] = useState(
    'You are Dr. Snuggles. You are helpful, sarcastic, and scientific. Keep answers short.'
  );

  const [promptApplied, setPromptApplied] = useState(false);
  const [factChecks, setFactChecks] = useState<any[]>([]);
  const [pinnedClaims, setPinnedClaims] = useState<Set<string>>(new Set());

  const [showSettings, setShowSettings] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  const audioCaptureService = useRef<AudioCaptureService | null>(null);
  const audioPlaybackService = useRef<AudioPlaybackService | null>(null);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role: 'user',
      text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage].slice(-100));
    ipc.send('send-message', text);
  };

  const handleExportTranscript = () => {
    const data = JSON.stringify(messages, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${Date.now()}.json`;
    a.click();
  };

  const handleClearTranscript = () => {
    setMessages([]);
  };

  useEffect(() => {
    audioCaptureService.current = new AudioCaptureService();
    audioPlaybackService.current = new AudioPlaybackService();
    audioPlaybackService.current.start();

    return () => {
      audioCaptureService.current?.stop();
      audioPlaybackService.current?.stop();
    };
  }, []);

  const baseFontSize = fontSize / 100;

  return (
    <div
      style={{ ...styles.container, fontSize: `${baseFontSize}rem` }}
      className={highContrastMode ? 'high-contrast' : ''}
    >
      <StatusBarWidget />

      <div style={styles.mainLayout}>
        <div style={styles.centerPanel}>
          <div style={styles.sectionHeaderRow}>
            <div style={styles.sectionHeader}>💬 TRANSCRIPT</div>
            <div style={styles.transcriptTools}>
              <input
                type="text"
                placeholder="Search…"
                value={transcriptSearch}
                onChange={e => setTranscriptSearch(e.target.value)}
                style={styles.searchInput}
              />
              <button style={styles.toolBtn} onClick={handleExportTranscript}>📥</button>
              <button style={styles.toolBtn} onClick={handleClearTranscript}>🗑️</button>
            </div>
          </div>

          <TranscriptWidget messages={messages} searchQuery={transcriptSearch} />

          <div style={{ padding: '15px', borderTop: '1px solid #333', background: '#13131f' }}>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!messageInput.trim()) return;
                handleSendMessage(messageInput);
                setMessageInput('');
              }}
              style={{ display: 'flex', gap: '10px' }}
            >
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Type a message to Dr. Snuggles…"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #444',
                  background: '#1a1a2e',
                  color: '#fff'
                }}
              />
              <button
                type="submit"
                disabled={!connectionStatus.connected}
                style={{
                  padding: '0 20px',
                  borderRadius: '8px',
                  background: connectionStatus.connected ? '#8a2be2' : '#444',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              >
                SEND
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes pulse {
  0%,100% { opacity:1; box-shadow:0 0 10px currentColor; }
  50% { opacity:.6; box-shadow:0 0 20px currentColor; }
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance:none;
  width:14px;
  height:14px;
  border-radius:50%;
  background:#00ddff;
}

.high-contrast {
  filter:contrast(1.3) brightness(1.1);
}

.high-contrast button,
.high-contrast select,
.high-contrast input {
  border-width:2px;
}
`;
document.head.appendChild(styleSheet);

export default DrSnugglesControlCenter;
