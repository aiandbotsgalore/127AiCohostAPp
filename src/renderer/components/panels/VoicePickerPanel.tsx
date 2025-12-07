
import React from 'react';
import '../ControlCenter.css';

interface VoicePickerPanelProps {
    currentVoice: string;
    onVoiceChange: (voiceId: string) => void;
}

const VOICES = [
    { id: 'Kore', name: 'Kore', desc: 'Calm, soothing, feminine.' },
    { id: 'Puck', name: 'Puck', desc: 'Playful, mischievous, energetic.' },
    { id: 'Charon', name: 'Charon', desc: 'Deep, authoritative, grave.' },
    { id: 'Aoede', name: 'Aoede', desc: 'Melodic, artistic, expressive.' },
    { id: 'Fenrir', name: 'Fenrir', desc: 'Rough, intense, primal.' },
];

export const VoicePickerPanel: React.FC<VoicePickerPanelProps> = ({ currentVoice, onVoiceChange }) => {
    return (
        <div className="panel voice-panel">
            <div className="panel-header">
                <h3 className="panel-title">Voice Synthesis</h3>
            </div>

            <div className="voice-list">
                {VOICES.map(voice => (
                    <div
                        key={voice.id}
                        className={`voice-card ${currentVoice === voice.id ? 'active' : ''}`}
                        onClick={() => onVoiceChange(voice.id)}
                    >
                        <div className="voice-header">
                            <span className="voice-name">{voice.name}</span>
                            {currentVoice === voice.id && <span className="active-badge">Active</span>}
                        </div>
                        <p className="voice-desc">{voice.desc}</p>
                        {currentVoice === voice.id && <div className="voice-visualizer-mini"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};
