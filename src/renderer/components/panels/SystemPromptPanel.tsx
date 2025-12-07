
import React, { useState, useEffect } from 'react';
import '../ControlCenter.css';

interface SystemPromptPanelProps {
    prompt: string;
    onUpdatePrompt: (newPrompt: string) => void;
}

export const SystemPromptPanel: React.FC<SystemPromptPanelProps> = ({ prompt, onUpdatePrompt }) => {
    const [localPrompt, setLocalPrompt] = useState(prompt);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setLocalPrompt(prompt);
        setIsDirty(false);
    }, [prompt]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalPrompt(e.target.value);
        setIsDirty(true);
    };

    const handleUpdate = () => {
        onUpdatePrompt(localPrompt);
        setIsDirty(false);
    };

    return (
        <div className="panel prompt-panel">
            <div className="panel-header">
                <h3 className="panel-title">System Persona</h3>
                <button
                    className={`btn-update ${isDirty ? 'visible' : ''}`}
                    onClick={handleUpdate}
                    disabled={!isDirty}
                >
                    UPDATE LIVE
                </button>
            </div>
            <textarea
                className="prompt-textarea"
                value={localPrompt}
                onChange={handleChange}
                spellCheck={false}
            />
        </div>
    );
};
