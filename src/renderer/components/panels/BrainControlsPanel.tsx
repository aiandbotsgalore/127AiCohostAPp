
import React from 'react';
import { BrainConfig } from '../../../shared/types';
import '../ControlCenter.css';

interface BrainControlsPanelProps {
    config: BrainConfig;
    onConfigChange: (newConfig: BrainConfig) => void;
}

export const BrainControlsPanel: React.FC<BrainControlsPanelProps> = ({ config, onConfigChange }) => {

    const handleToggle = (key: keyof BrainConfig) => {
        onConfigChange({
            ...config,
            [key]: !config[key as keyof BrainConfig]
        });
    };

    const handleChange = (key: keyof BrainConfig, value: any) => {
        onConfigChange({
            ...config,
            [key]: value
        });
    };

    return (
        <div className="panel brain-panel">
            <div className="panel-header">
                <h3 className="panel-title">Brain Configuration</h3>
                <div className="brain-status-dot"></div>
            </div>

            <div className="brain-controls-grid">
                {/* Thinking Mode */}
                <div className="control-group">
                    <div className="control-header">
                        <span className="control-label">Thinking Mode</span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={config.thinkingEnabled}
                                onChange={() => handleToggle('thinkingEnabled')}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    {config.thinkingEnabled && (
                        <div className="control-slider-container">
                            <span className="slider-value-label">Budget: {config.thinkingBudget}t</span>
                            <input
                                type="range"
                                min="100"
                                max="2000"
                                step="100"
                                value={config.thinkingBudget}
                                onChange={(e) => handleChange('thinkingBudget', parseInt(e.target.value))}
                                className="sci-fi-slider"
                            />
                        </div>
                    )}
                </div>

                {/* Emotional Range */}
                <div className="control-group">
                    <span className="control-label">Emotional Range</span>
                    <div className="segment-selector">
                        {(['low', 'medium', 'high'] as const).map((level) => (
                            <button
                                key={level}
                                className={`segment-btn ${config.emotionalRange === level ? 'active' : ''}`}
                                onClick={() => handleChange('emotionalRange', level)}
                            >
                                {level.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Spontaneity */}
                <div className="control-group">
                    <div className="control-header">
                        <span className="control-label">Spontaneity (Proactive)</span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={config.spontaneity}
                                onChange={() => handleToggle('spontaneity')}
                            />
                            <span className="slider round color-purple"></span>
                        </label>
                    </div>
                </div>

                {/* Listening Sensitivity */}
                <div className="control-group">
                    <span className="control-label">VAD Sensitivity</span>
                    <div className="segment-selector">
                        {(['low', 'medium', 'high'] as const).map((level) => (
                            <button
                                key={level}
                                className={`segment-btn ${config.listeningSensitivity === level ? 'active' : ''}`}
                                onClick={() => handleChange('listeningSensitivity', level)}
                            >
                                {level === 'low' ? 'LO' : level === 'medium' ? 'MED' : 'HI'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
