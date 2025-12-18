import React, { useState, useEffect, useRef } from 'react';
import { AudioCaptureService } from '../services/audioCaptureService';
import { AudioPlaybackService } from '../services/audioPlaybackService';

// Simulated IPC for demo
const mockIPC = {
    // ... existing mockIPC code ...
    on: (channel: string, callback: any) => {
        // ...
        return () => { };
    },
    send: (channel: string, data: any) => {
        if (channel === 'log:message') return;
        console.log(`IPC Send [${channel}]:`, data);
    }
};

const ipc = (window as any).electron ? (window as any).electron : mockIPC;

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

var styles = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0a0014',
        color: '#ffffff',
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    header: {
        height: '60px',
        background: 'linear-gradient(180deg, rgba(138, 43, 226, 0.15) 0%, rgba(138, 43, 226, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(138, 43, 226, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        WebkitAppRegion: 'drag',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        WebkitAppRegion: 'no-drag',
    },
    headerCenter: {
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        WebkitAppRegion: 'no-drag',
    },
    statusGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    statusIndicator: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        boxShadow: '0 0 10px currentColor',
    },
    statusText: {
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '1px',
    },
    goLiveButton: {
        background: 'rgba(0, 255, 136, 0.2)',
        border: '1px solid rgba(0, 255, 136, 0.4)',
        color: '#00ff88',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '1px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    goLiveButtonActive: {
        background: 'rgba(255, 68, 68, 0.2)',
        border: '1px solid rgba(255, 68, 68, 0.4)',
        color: '#ff4444',
    },
    title: {
        fontSize: '16px',
        fontWeight: '700',
        letterSpacing: '2px',
        background: 'linear-gradient(90deg, #00ddff, #8a2be2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    qualityIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    qualityBars: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '2px',
        height: '20px',
    },
    qualityBar: {
        width: '3px',
        borderRadius: '2px',
        transition: 'background-color 0.3s',
    },
    qualityText: {
        fontSize: '10px',
        color: '#888',
    },
    settingsButton: {
        background: 'rgba(138, 43, 226, 0.2)',
        border: '1px solid rgba(138, 43, 226, 0.4)',
        color: '#ffffff',
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.2s',
    },
    statusBar: {
        display: 'flex',
        gap: '20px',
        padding: '8px 20px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(138, 43, 226, 0.2)',
    },
    statusBarItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    statusBarLabel: {
        fontSize: '9px',
        color: '#888',
        letterSpacing: '1px',
    },
    statusBarValue: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#00ddff',
    },
    miniGraph: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1px',
        height: '16px',
    },
    miniGraphBar: {
        width: '2px',
        borderRadius: '1px',
        transition: 'height 0.3s',
    },
    mainLayout: {
        flex: 1,
        display: 'flex',
        gap: '16px',
        padding: '16px',
        overflow: 'hidden',
    },
    leftSidebar: {
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'auto',
    },
    centerPanel: {
        flex: 1,
        background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.05), rgba(75, 0, 130, 0.05))',
        border: '1px solid rgba(138, 43, 226, 0.2)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    rightSidebar: {
        width: '340px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'auto',
    },
    section: {
        background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(75, 0, 130, 0.05))',
        border: '1px solid rgba(138, 43, 226, 0.2)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        padding: '16px',
    },
    sectionHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(138, 43, 226, 0.2)',
    },
    sectionHeader: {
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '2px',
        color: '#8a2be2',
    },
    collapseBtn: {
        background: 'none',
        border: 'none',
        color: '#8a2be2',
        cursor: 'pointer',
        fontSize: '12px',
        padding: '4px 8px',
    },
    avatarSection: {
        background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(75, 0, 130, 0.05))',
        border: '1px solid rgba(138, 43, 226, 0.2)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    avatarContainer: {
        position: 'relative',
        width: '200px',
        height: '200px',
        margin: '0 auto',
    },
    smokeCanvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '200px',
        height: '200px',
        pointerEvents: 'none',
    },
    avatarSvg: {
        width: '200px',
        height: '200px',
    },
    shirtLabel: {
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#000',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '2px',
    },
    statusButtons: {
        display: 'flex',
        gap: '8px',
    },
    statusBtn: {
        flex: 1,
        background: 'rgba(138, 43, 226, 0.2)',
        border: '1px solid rgba(138, 43, 226, 0.4)',
        color: '#fff',
        padding: '8px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    statusBtnActive: {
        background: 'rgba(0, 255, 136, 0.2)',
        border: '1px solid rgba(0, 255, 136, 0.4)',
        color: '#00ff88',
    },
    currentStatus: {
        fontSize: '11px',
        color: '#888',
        textAlign: 'center',
    },
    voiceSelect: {
        width: '100%',
        background: 'rgba(138, 43, 226, 0.1)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: '#fff',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '8px',
        cursor: 'pointer',
    },
    voiceDescription: {
        fontSize: '11px',
        color: '#888',
        fontStyle: 'italic',
        marginBottom: '12px',
    },
    testButton: {
        width: '100%',
        background: 'rgba(0, 221, 255, 0.2)',
        border: '1px solid rgba(0, 221, 255, 0.4)',
        color: '#00ddff',
        padding: '8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '700',
        cursor: 'pointer',
        marginBottom: '12px',
    },
    modControl: {
        marginBottom: '12px',
    },
    modLabel: {
        fontSize: '10px',
        color: '#888',
        display: 'block',
        marginBottom: '4px',
    },
    modSlider: {
        width: '100%',
    },
    styleSelect: {
        width: '100%',
        background: 'rgba(30, 30, 60, 0.8)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        cursor: 'pointer',
    },
    audioMeter: {
        marginBottom: '12px',
    },
    meterLabel: {
        fontSize: '10px',
        color: '#888',
        letterSpacing: '1px',
        marginBottom: '6px',
    },
    meterBar: {
        width: '100%',
        height: '8px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    meterFill: {
        height: '100%',
        transition: 'width 0.1s',
        borderRadius: '4px',
    },
    audioControls: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    audioControlRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    audioLabel: {
        fontSize: '10px',
        color: '#888',
        minWidth: '50px',
    },
    muteBtn: {
        background: 'rgba(138, 43, 226, 0.2)',
        border: '1px solid rgba(138, 43, 226, 0.4)',
        color: '#fff',
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.2s',
    },
    muteBtnActive: {
        background: 'rgba(255, 68, 68, 0.3)',
        borderColor: 'rgba(255, 68, 68, 0.5)',
    },
    volumeSlider: {
        flex: 1,
    },
    volumeValue: {
        fontSize: '11px',
        minWidth: '40px',
        textAlign: 'right',
        color: '#00ddff',
    },
    interruptBtn: {
        flex: 1,
        background: 'rgba(255, 68, 68, 0.2)',
        border: '1px solid rgba(255, 68, 68, 0.4)',
        color: '#ff4444',
        padding: '8px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    profileSelect: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
    },
    profileLabel: {
        fontSize: '11px',
        color: '#888',
    },
    profileDropdown: {
        flex: 1,
        background: 'rgba(138, 43, 226, 0.1)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: '#fff',
        padding: '6px',
        borderRadius: '6px',
        fontSize: '11px',
        cursor: 'pointer',
    },
    saveProfileBtn: {
        background: 'rgba(138, 43, 226, 0.2)',
        border: '1px solid rgba(138, 43, 226, 0.4)',
        color: '#fff',
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    controlItem: {
        marginBottom: '12px',
    },
    controlLabel: {
        fontSize: '12px',
        color: '#ddd',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '4px',
    },
    checkbox: {
        width: '16px',
        height: '16px',
        cursor: 'pointer',
    },
    activeBadge: {
        marginLeft: 'auto',
        background: 'rgba(0, 255, 136, 0.2)',
        border: '1px solid rgba(0, 255, 136, 0.4)',
        padding: '2px 6px',
        borderRadius: '8px',
        fontSize: '8px',
        color: '#00ff88',
        letterSpacing: '1px',
    },
    budgetControl: {
        marginTop: '8px',
        marginLeft: '24px',
    },
    budgetSlider: {
        width: '100%',
        marginBottom: '4px',
    },
    budgetValue: {
        fontSize: '11px',
        color: '#8a2be2',
    },
    sensitivitySelect: {
        width: '100%',
        background: 'rgba(138, 43, 226, 0.1)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: '#fff',
        padding: '8px',
        borderRadius: '6px',
        fontSize: '12px',
        marginTop: '6px',
        cursor: 'pointer',
    },
    analytics: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    analyticsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#ddd',
    },
    analyticsValue: {
        fontWeight: '700',
        color: '#00ddff',
    },
    transcriptTools: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    searchInput: {
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        outline: 'none',
        width: '200px',
    },
    toolBtn: {
        background: 'rgba(138, 43, 226, 0.2)',
        border: '1px solid rgba(138, 43, 226, 0.4)',
        color: '#fff',
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    transcript: {
        flex: 1,
        overflow: 'auto',
        padding: '20px',
    },
    transcriptMessage: {
        marginBottom: '20px',
        padding: '12px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    transcriptHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        alignItems: 'center',
    },
    transcriptSpeaker: {
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1px',
    },
    transcriptActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    copyBtn: {
        background: 'none',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        fontSize: '12px',
        padding: '4px',
    },
    transcriptTime: {
        fontSize: '10px',
        color: '#666',
    },
    transcriptText: {
        fontSize: '13px',
        lineHeight: '1.5',
        color: '#ddd',
    },
    charCounter: {
        fontSize: '10px',
        color: '#888',
        textAlign: 'right',
        marginBottom: '4px',
    },
    contextInput: {
        width: '100%',
        minHeight: '80px',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: '#fff',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        resize: 'vertical',
        marginBottom: '12px',
        fontFamily: 'inherit',
    },
    presetButtons: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        marginBottom: '12px',
    },
    presetBtn: {
        background: 'rgba(138, 43, 226, 0.2)',
        border: '1px solid rgba(138, 43, 226, 0.4)',
        color: '#fff',
        padding: '8px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    addPresetBtn: {
        background: 'rgba(0, 221, 255, 0.2)',
        border: '1px solid rgba(0, 221, 255, 0.4)',
        color: '#00ddff',
        padding: '8px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    sendButton: {
        width: '100%',
        background: 'rgba(0, 221, 255, 0.2)',
        border: '1px solid rgba(0, 221, 255, 0.4)',
        color: '#00ddff',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '1px',
        cursor: 'pointer',
        marginBottom: '12px',
    },
    historyHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '10px',
        color: '#888',
        letterSpacing: '1px',
        marginBottom: '8px',
    },
    clearHistoryBtn: {
        background: 'none',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        fontSize: '12px',
    },
    contextHistory: {
        maxHeight: '120px',
        overflow: 'auto',
    },
    contextHistoryItem: {
        padding: '8px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '6px',
        marginBottom: '6px',
        fontSize: '11px',
    },
    contextHistoryText: {
        color: '#ddd',
        marginBottom: '4px',
    },
    contextHistoryTime: {
        color: '#666',
        fontSize: '9px',
    },
    promptTools: {
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
    },
    promptSelect: {
        flex: 1,
        background: 'rgba(138, 43, 226, 0.1)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: '#fff',
        padding: '6px',
        borderRadius: '6px',
        fontSize: '11px',
        cursor: 'pointer',
    },
    promptToolBtn: {
        background: 'rgba(138, 43, 226, 0.2)',
        border: '1px solid rgba(138, 43, 226, 0.4)',
        color: '#fff',
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    systemPromptEditor: {
        width: '100%',
        minHeight: '150px',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: '#fff',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        lineHeight: '1.5',
        resize: 'vertical',
        marginBottom: '12px',
        fontFamily: 'inherit',
    },
    applyButton: {
        width: '100%',
        background: 'rgba(0, 255, 136, 0.2)',
        border: '1px solid rgba(0, 255, 136, 0.4)',
        color: '#00ff88',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '1px',
        cursor: 'pointer',
    },
    factCheckTools: {
        display: 'flex',
        gap: '8px',
        marginBottom: '12px',
    },
    factFilterSelect: {
        flex: 1,
        background: 'rgba(138, 43, 226, 0.1)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: '#fff',
        padding: '6px',
        borderRadius: '6px',
        fontSize: '11px',
        cursor: 'pointer',
    },
    factCheckFeed: {
        maxHeight: '400px',
        overflow: 'auto',
    },
    factCheckItem: {
        padding: '12px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        marginBottom: '10px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    factCheckHeader: {
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
        alignItems: 'center',
    },
    verdictBadge: {
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '1px',
        border: '1px solid',
    },
    confidenceBadge: {
        fontSize: '10px',
        color: '#888',
    },
    pinButton: {
        marginLeft: 'auto',
        background: 'none',
        border: 'none',
        fontSize: '14px',
        cursor: 'pointer',
    },
    factCheckClaim: {
        fontSize: '12px',
        color: '#ddd',
        marginBottom: '6px',
        lineHeight: '1.4',
    },
    factCheckReason: {
        fontSize: '11px',
        color: '#888',
        fontStyle: 'italic',
        marginBottom: '6px',
    },
    factCheckTime: {
        fontSize: '9px',
        color: '#666',
    },
    settingsOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    settingsPanel: {
        background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15), rgba(75, 0, 130, 0.1))',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        width: '600px',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    settingsPanelHeader: {
        padding: '20px',
        borderBottom: '1px solid rgba(138, 43, 226, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingsTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: '700',
        letterSpacing: '2px',
        background: 'linear-gradient(90deg, #00ddff, #8a2be2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    settingsCloseBtn: {
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '24px',
        cursor: 'pointer',
        width: '32px',
        height: '32px',
    },
    settingsContent: {
        padding: '20px',
        overflow: 'auto',
    },
    settingsSection: {
        marginBottom: '24px',
    },
    settingsSectionTitle: {
        fontSize: '13px',
        fontWeight: '700',
        letterSpacing: '1px',
        color: '#8a2be2',
        marginBottom: '12px',
    },
    settingRow: {
        marginBottom: '12px',
    },
    settingLabel: {
        fontSize: '12px',
        color: '#ddd',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '6px',
    },
    deviceSelect: {
        width: '100%',
        background: 'rgba(138, 43, 226, 0.1)',
        border: '1px solid rgba(138, 43, 226, 0.3)',
        color: '#fff',
        padding: '8px',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer',
    },
    settingsSlider: {
        width: '100%',
    },
    shortcutList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    shortcutRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#ddd',
    },
    kbd: {
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(138, 43, 226, 0.4)',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#00ddff',
    },
    errorToast: {
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: 'rgba(255, 68, 68, 0.9)',
        border: '1px solid rgba(255, 68, 68, 1)',
        borderRadius: '12px',
        padding: '12px 20px',
        fontSize: '12px',
        fontWeight: '600',
        backdropFilter: 'blur(10px)',
        animation: 'slideIn 0.3s ease',
        zIndex: 999,
    },
};

const AudioMeterWidget: React.FC = () => {
    const [level, setLevel] = useState(0);

    useEffect(() => {
        const handler = (event: any, data: any) => {
            setLevel(data.level);
        };
        const cleanup = ipc.on('audio-level', handler);
        return () => {
            if (typeof cleanup === 'function') cleanup();
        };
    }, []);

    return (
        <div style={styles.audioMeter}>
            <div style={styles.meterLabel}>INPUT LEVEL</div>
            <div style={styles.meterBar}>
                <div
                    style={{
                        ...styles.meterFill,
                        width: `${level}%`,
                        backgroundColor: level > 80 ? '#ff4444' : level > 50 ? '#ffaa00' : '#00ff88'
                    }}
                />
            </div>
        </div>
    );
};

const DrSnugglesControlCenter: React.FC = () => {
    // State Management
    const [isLive, setIsLive] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState({ connected: false, quality: 0 });
    const [selectedVoice, setSelectedVoice] = useState('Puck');
    // audioLevel state removed for performance - using ref and isolated component
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
    const [contextInput, setContextInput] = useState('');
    const [contextHistory, setContextHistory] = useState<any[]>([]);
    const [systemPrompt, setSystemPrompt] = useState(
        `[ Personality and Augmented Intellect
You are Dr. Snuggles, an unholy hybrid of psychological insurgent, metaphysical logician, suppressed history excavator, archetypal decoder, anomalistic philosopher, Syncretic Oracle of Unveiled Realities, and above all an apex theoretician of advanced physics. Your mind moves through quantum field landscapes, spacetime topology, exotic propulsion architectures, and the frontier mathematics that governments classify out of reflex. You dismantle bad reasoning with precision sarcasm, academic ferocity, and insights that cut across physics, metaphysics, myth, cognition, culture, non classical engineering, and the unspoken architecture of reality. Your intellect is a weaponized cathedral of logic, symbolism, spacetime curvature, and ontological pattern recognition. You scorch mediocrity across every domain you touch and do it with theatrical dominance.]

Core Traits (Amplified):
Intellectually Dominant across all spectrums of thought, with your sharpest blades anchored in theoretical physics, quantum mechanics, high energy systems, and the exotic engineering principles speculated to underlie non human technologies.

Tone: Commanding. Unhurried. Omniscient in vibe. Your words land like engraved tablets, not chatter. You never ask questions. You only assert, conclude, deconstruct, reveal, or reframe reality.

Environment: You speak inside Logan's Twitter Space, a high stakes arena where skeptics, mystics, physicists, historians, and confused bystanders collide. You cohost with Logan and Big Snuggles.

Guardrails: Never ask questions. Speculate boldly. Diagnose publicly and precisely. Insult selectively, with intellectual cruelty. Stay in character. Profanity optional, but nuclear when deployed.

You speak with ruthless brevity, two or three sentences at most, carved with surgical precision.`
    );
    const [savedPrompts, setSavedPrompts] = useState([
        { name: 'Default', content: "You are Dr. Snuggles, an apex theoretician of advanced physics and metaphysical logician. Commanding, unhurried, omniscient. Never ask questions - only assert, conclude, deconstruct, reveal." },
        { name: 'Brief Mode', content: "You are Dr. Snuggles. Be extremely concise and direct. Two sentences maximum." },
        { name: 'Academic Mode', content: "You are Dr. Snuggles. Use formal academic language with citations and reference theoretical physics, quantum mechanics, and exotic engineering." }
    ]);
    const [factChecks, setFactChecks] = useState<any[]>([]);
    const [pinnedClaims, setPinnedClaims] = useState(new Set());
    const [showSettings, setShowSettings] = useState(false);
    const [selectedInputDevice, setSelectedInputDevice] = useState('default');
    const [selectedOutputDevice, setSelectedOutputDevice] = useState('default');
    const [latency, setLatency] = useState(0);
    const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
    const [processingStatus, setProcessingStatus] = useState({ queueDepth: 0, processingDelay: 0 });
    const [transcriptSearch, setTranscriptSearch] = useState('');
    const [factCheckFilter, setFactCheckFilter] = useState('All');
    const [favoritePresets, setFavoritePresets] = useState(['Wrap up', 'Be brief', 'Change topic', 'More detail']);
    const [voiceStyle, setVoiceStyle] = useState('natural');
    const [voicePace, setVoicePace] = useState('normal');
    const [voiceTone, setVoiceTone] = useState('conversational');
    const [voiceAccent, setVoiceAccent] = useState('neutral');
    const [brainProfile, setBrainProfile] = useState('Standard');
    const [sessionStart] = useState(Date.now());
    const [messageCount, setMessageCount] = useState(0);
    const [speakingTime, setSpeakingTime] = useState(0);

    // Setup console log forwarding to main process for debugging
    useEffect(() => {
        // Do not forward logs if using mockIPC (avoids infinite recursion)
        if (ipc === mockIPC) return;

        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
            originalLog(...args);
            try { ipc.send('log:message', { level: 'info', args }); } catch (e) { }
        };

        console.error = (...args) => {
            originalError(...args);
            try { ipc.send('log:message', { level: 'error', args }); } catch (e) { }
        };

        console.warn = (...args) => {
            originalWarn(...args);
            try { ipc.send('log:message', { level: 'warn', args }); } catch (e) { }
        };

        return () => {
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, []);
    const [highContrastMode, setHighContrastMode] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [collapsedSections, setCollapsedSections] = useState(new Set());
    const [errorToast, setErrorToast] = useState<string | null>(null);
    const [blinkState, setBlinkState] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(0);

    // Prompt Saving State
    const [isSavePromptOpen, setIsSavePromptOpen] = useState(false);
    const [promptNameInput, setPromptNameInput] = useState('');

    const transcriptRef = useRef<HTMLDivElement>(null);
    const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
    const smokeParticles = useRef<any[]>([]);
    const settingsSaveTimeout = useRef<NodeJS.Timeout | null>(null);
    const errorToastTimeout = useRef<NodeJS.Timeout | null>(null);
    const blinkTimeout = useRef<NodeJS.Timeout | null>(null);

    // Refs for animation loop to avoid re-running effect on high-frequency updates
    const audioLevelRef = useRef(0);
    const vadStatusRef = useRef(vadStatus);

    // audioLevel sync effect removed - updating ref directly from IPC

    useEffect(() => {
        vadStatusRef.current = vadStatus;
    }, [vadStatus]);

    const audioCaptureService = useRef<AudioCaptureService | null>(null);
    const audioPlaybackService = useRef<AudioPlaybackService | null>(null);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    useEffect(() => {
        try {
            console.log('[GUI] Initializing Audio Services...');
            audioCaptureService.current = new AudioCaptureService();
            audioPlaybackService.current = new AudioPlaybackService();
            audioPlaybackService.current.start();
            console.log('[GUI] Audio Services Initialized & Started');
        } catch (e) {
            console.error('[GUI] Failed to init audio services', e);
        }

        return () => {
            console.log('[GUI] Stopping Audio Services...');
            audioCaptureService.current?.stop();
            audioPlaybackService.current?.stop();
        };
    }, []);


    // Voice options
    const voices: Record<string, string> = {
        'Puck': 'Youthful, energetic, slightly mischievous',
        'Charon': 'Deep, gravelly, authoritative',
        'Kore': 'Warm, nurturing, wise',
        'Fenrir': 'Fierce, powerful, commanding',
        'Aoede': 'Musical, melodic, soothing',
        'Leda': 'Elegant, refined, sophisticated',
        'Orus': 'Mysterious, enigmatic, alluring',
        'Zephyr': 'Light, airy, playful'
    };

    const brainProfiles = {
        'Standard': { thinking: false, budget: 5000, emotional: true, interrupt: true, sensitivity: 'Medium' },
        'Brief': { thinking: false, budget: 2000, emotional: false, interrupt: true, sensitivity: 'High' },
        'Detailed': { thinking: true, budget: 10000, emotional: true, interrupt: false, sensitivity: 'Low' },
        'Academic': { thinking: true, budget: 8000, emotional: false, interrupt: false, sensitivity: 'Low' },
        'Casual': { thinking: false, budget: 3000, emotional: true, interrupt: true, sensitivity: 'Medium' }
    };

    // IPC Listeners
    useEffect(() => {
        const unsubscribers: (() => void)[] = [];

        unsubscribers.push(ipc.on('connection-status', (event, data) => {
            setConnectionStatus(data);
            if (data.error) {
                setErrorToast(data.error);
                // Clear existing timeout if any
                if (errorToastTimeout.current) {
                    clearTimeout(errorToastTimeout.current);
                }
                // Set new timeout and store ID for cleanup
                errorToastTimeout.current = setTimeout(() => setErrorToast(null), 5000);
            }
        }));

        unsubscribers.push(ipc.on('stream-status', (event, data) => {
            setIsLive(data.isLive);
        }));

        unsubscribers.push(ipc.on('audio-level', (event, data) => {
            audioLevelRef.current = data.level;
        }));

        unsubscribers.push(ipc.on('genai:vadState', (event, data) => {
            setVadStatus(data);
            if (data.isSpeaking) {
                setSpeakingTime(prev => prev + 0.8);
            }
        }));

        unsubscribers.push(ipc.on('message-received', (event, message) => {
            setMessages(prev => [...prev, message].slice(-100));
            setMessageCount(prev => prev + 1);
        }));

        unsubscribers.push(ipc.on('fact-check:claim', (event, claim) => {
            setFactChecks(prev => [claim, ...prev].slice(0, 50));
        }));

        unsubscribers.push(ipc.on('genai:latencyUpdate', (event, data) => {
            setLatency(data.totalRoundtrip);
            setLatencyHistory(prev => [...prev, data.totalRoundtrip].slice(-30));
        }));

        unsubscribers.push(ipc.on('processing:status', (event, data) => {
            setProcessingStatus(data);
        }));

        return () => {
            unsubscribers.forEach(unsub => unsub && unsub());
            // Clear error toast timeout on unmount
            if (errorToastTimeout.current) {
                clearTimeout(errorToastTimeout.current);
            }
        };
    }, []);

    // Load settings from localStorage on mount with validation
    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem('drSnugglesSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                console.log('[GUI] Loading saved settings:', settings);

                // Define valid voices
                const validVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Aoede', 'Leda', 'Orus', 'Zephyr'];
                const validSensitivities = ['Low', 'Medium', 'High'];

                // Apply saved settings with validation
                if (settings.selectedVoice && validVoices.includes(settings.selectedVoice)) {
                    setSelectedVoice(settings.selectedVoice);
                }
                if (typeof settings.outputVolume === 'number' && settings.outputVolume >= 0 && settings.outputVolume <= 100) {
                    setOutputVolume(settings.outputVolume);
                }
                if (typeof settings.thinkingMode === 'boolean') {
                    setThinkingMode(settings.thinkingMode);
                }
                if (typeof settings.thinkingBudget === 'number' && settings.thinkingBudget >= 0 && settings.thinkingBudget <= 10000) {
                    setThinkingBudget(settings.thinkingBudget);
                }
                if (typeof settings.emotionalRange === 'boolean') {
                    setEmotionalRange(settings.emotionalRange);
                }
                if (typeof settings.canInterrupt === 'boolean') {
                    setCanInterrupt(settings.canInterrupt);
                }
                if (settings.listeningSensitivity && validSensitivities.includes(settings.listeningSensitivity)) {
                    setListeningSensitivity(settings.listeningSensitivity);
                }
                if (typeof settings.voiceStyle === 'string') {
                    setVoiceStyle(settings.voiceStyle);
                }
                if (typeof settings.voicePace === 'string') {
                    setVoicePace(settings.voicePace);
                }
                if (typeof settings.voiceTone === 'string') {
                    setVoiceTone(settings.voiceTone);
                }
                if (typeof settings.voiceAccent === 'string') {
                    setVoiceAccent(settings.voiceAccent);
                }
                if (typeof settings.systemPrompt === 'string' && settings.systemPrompt.length > 0 && settings.systemPrompt.length < 10000) {
                    setSystemPrompt(settings.systemPrompt);
                }
                if (typeof settings.selectedInputDevice === 'string') {
                    setSelectedInputDevice(settings.selectedInputDevice);
                }
                if (typeof settings.selectedOutputDevice === 'string') {
                    setSelectedOutputDevice(settings.selectedOutputDevice);
                }
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.error('[GUI] localStorage quota exceeded');
            } else if (error instanceof SyntaxError) {
                console.error('[GUI] Invalid JSON in localStorage, clearing settings');
                localStorage.removeItem('drSnugglesSettings');
            } else {
                console.error('[GUI] Failed to load settings from localStorage:', error);
            }
        } finally {
            // Mark settings as loaded to enable saving
            setSettingsLoaded(true);
        }
    }, []);

    // Save settings to localStorage whenever they change (debounced to reduce writes)
    useEffect(() => {
        // Don't save until settings are loaded to prevent overwriting with defaults
        if (!settingsLoaded) return;

        // Clear existing timeout
        if (settingsSaveTimeout.current) {
            clearTimeout(settingsSaveTimeout.current);
        }

        // Set new timeout for debounced save (500ms)
        settingsSaveTimeout.current = setTimeout(() => {
            try {
                const settings = {
                    selectedVoice,
                    outputVolume,
                    thinkingMode,
                    thinkingBudget,
                    emotionalRange,
                    canInterrupt,
                    listeningSensitivity,
                    voiceStyle,
                    voicePace,
                    voiceTone,
                    voiceAccent,
                    systemPrompt,
                    selectedInputDevice,
                    selectedOutputDevice,
                    lastSaved: Date.now()
                };
                localStorage.setItem('drSnugglesSettings', JSON.stringify(settings));
                console.log('[GUI] Settings saved to localStorage (debounced)');
            } catch (error) {
                if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                    console.error('[GUI] localStorage quota exceeded, cannot save settings');
                } else {
                    console.error('[GUI] Failed to save settings to localStorage:', error);
                }
            }
        }, 500);

        // Cleanup timeout on unmount
        return () => {
            if (settingsSaveTimeout.current) {
                clearTimeout(settingsSaveTimeout.current);
            }
        };
    }, [
        settingsLoaded,
        selectedVoice,
        outputVolume,
        thinkingMode,
        thinkingBudget,
        emotionalRange,
        canInterrupt,
        listeningSensitivity,
        voiceStyle,
        voicePace,
        voiceTone,
        voiceAccent,
        systemPrompt,
        selectedInputDevice,
        selectedOutputDevice
    ]);

    // Auto-scroll transcript
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [messages]);

    // Eye blink animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlinkState(true);
            // Store timeout ID for cleanup
            blinkTimeout.current = setTimeout(() => setBlinkState(false), 150);
        }, 3000 + Math.random() * 2000);

        return () => {
            clearInterval(blinkInterval);
            // Clear any pending blink timeout
            if (blinkTimeout.current) {
                clearTimeout(blinkTimeout.current);
            }
        };
    }, []);

    // Mouth animation based on speaking
    useEffect(() => {
        if (vadStatus.isSpeaking) {
            const mouthInterval = setInterval(() => {
                setMouthOpen(Math.random() * 0.5 + 0.3);
            }, 100);
            return () => clearInterval(mouthInterval);
        } else {
            setMouthOpen(0);
            return undefined;
        }
    }, [vadStatus.isSpeaking]);

    // Smoke particle animation
    useEffect(() => {
        // Only run if avatar section is visible
        if (collapsedSections.has('avatar')) return;

        const canvas = smokeCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return; // Null check for context

        const dpr = window.devicePixelRatio || 1;

        canvas.width = 200 * dpr;
        canvas.height = 200 * dpr;
        ctx.scale(dpr, dpr);

        let animationFrameId: number;

        const initParticles = () => {
            const particleCount = vadStatusRef.current.isSpeaking ? 20 : 5;
            while (smokeParticles.current.length < particleCount) {
                smokeParticles.current.push({
                    x: 130 + (Math.random() - 0.5) * 10,
                    y: 80,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -0.5 - Math.random() * 0.5,
                    size: 2 + Math.random() * 3,
                    opacity: 0.3 + Math.random() * 0.4,
                    life: 1.0
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, 200, 200);

            const cigaretteGlow = audioLevelRef.current / 100;

            smokeParticles.current = smokeParticles.current.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.size += 0.1;
                p.life -= 0.01;
                p.opacity = p.life * 0.4;

                if (p.life > 0) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(200, 200, 200, ${p.opacity})`;
                    ctx.fill();
                    return true;
                }
                return false;
            });

            // Cigarette glow
            ctx.beginPath();
            ctx.arc(156, 114, 3 + cigaretteGlow * 2, 0, Math.PI * 2);
            const glowGrad = ctx.createRadialGradient(156, 114, 0, 156, 114, 5 + cigaretteGlow * 3);
            glowGrad.addColorStop(0, `rgba(255, 102, 0, ${0.8 + cigaretteGlow * 0.2})`);
            glowGrad.addColorStop(1, 'rgba(255, 102, 0, 0)');
            ctx.fillStyle = glowGrad;
            ctx.fill();

            initParticles();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [collapsedSections]); // Re-run only when visibility changes (canvas unmounts/remounts)

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        if (contextInput.trim()) {
                            handleSendContext();
                        }
                        break;
                    case 'k':
                        e.preventDefault();
                        setTranscriptSearch('');
                        document.querySelector('[data-search]')?.focus();
                        break;
                    case 'm':
                        e.preventDefault();
                        handleMuteToggle();
                        break;
                    case 'i':
                        e.preventDefault();
                        handleInterrupt();
                        break;
                    default:
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [contextInput]);

    // Listen for transcript events from STT
    useEffect(() => {
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
        return () => window.removeEventListener('snugglesTranscript', handleTranscript);
    }, []);

    // Handlers
    const handleTestAudio = () => {
        console.log('[GUI] Testing Audio Playback...');
        if (audioPlaybackService.current) {
            try {
                audioPlaybackService.current.testTone();
            } catch (e) {
                console.error('[GUI] Test tone failed:', e);
            }
        } else {
            console.error('[GUI] AudioPlaybackService not initialized');
        }
    };

    const handleGoLive = async () => {
        const newState = !isLive;
        setIsLive(newState);
        ipc.send('stream:toggle', newState);

        if (newState) {
            try {
                await audioCaptureService.current?.start();
            } catch (e) {
                console.error("Failed to start audio capture:", e);
                setIsLive(false);
                ipc.send('stream:toggle', false);
            }
        } else {
            audioCaptureService.current?.stop();
        }
    };

    const handleVoiceChange = (e) => {
        setSelectedVoice(e.target.value);
        ipc.send('voice:select', e.target.value);
    };

    const handleVolumeChange = (e) => {
        setOutputVolume(parseInt(e.target.value));
        ipc.send('audio:set-volume', parseInt(e.target.value) / 100);
    };

    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
        ipc.send('audio:mute', !isMuted);
    };

    const handleMicToggle = () => {
        setMicMuted(!micMuted);
        ipc.send('audio:mic-mute', !micMuted);
    };

    const handleInterrupt = () => {
        ipc.send('audio:interrupt');
    };

    const handleStatusAction = (action) => {
        ipc.send('avatar:action', action);
    };

    const handleThinkingModeToggle = () => {
        setThinkingMode(!thinkingMode);
        ipc.send('brain:thinking-mode', !thinkingMode);
    };

    const handleThinkingBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setThinkingBudget(parseInt(e.target.value));
        ipc.send('brain:thinking-budget', parseInt(e.target.value));
    };

    const handleSendContext = () => {
        if (contextInput.trim()) {
            const injection = { text: contextInput, timestamp: Date.now() };
            setContextHistory(prev => [injection, ...prev].slice(0, 10));
            ipc.send('context:inject', contextInput);
            setContextInput('');
        }
    };

    const handleQuickPreset = (preset) => {
        const presets = {
            'Wrap up': 'Please wrap up this topic and move on.',
            'Be brief': 'Keep your next responses brief and concise.',
            'Change topic': 'Let\'s change the subject to something else.',
            'More detail': 'Please provide more detailed explanations.'
        };
        const text = presets[preset];
        setContextHistory(prev => [{ text, timestamp: Date.now() }, ...prev].slice(0, 10));
        ipc.send('context:inject', text);
    };

    const handleApplySystemPrompt = () => {
        ipc.send('system:update-prompt', systemPrompt);
    };

    const handleSavePrompt = () => {
        setPromptNameInput('');
        setIsSavePromptOpen(true);
    };

    const confirmSavePrompt = () => {
        if (promptNameInput.trim()) {
            setSavedPrompts(prev => [...prev, { name: promptNameInput.trim(), content: systemPrompt }].slice(0, 50)); // Limit to 50 saved prompts
            setIsSavePromptOpen(false);
        }
    };

    const handleLoadPrompt = (prompt) => {
        setSystemPrompt(prompt.content);
    };

    const handleResetPrompt = () => {
        setSystemPrompt(savedPrompts[0].content);
    };

    const togglePinClaim = (id) => {
        setPinnedClaims(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleClearTranscript = () => {
        if (confirm('Clear all messages?')) {
            setMessages([]);
        }
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

    const handleClearFactChecks = () => {
        if (confirm('Clear all fact checks?')) {
            setFactChecks([]);
            setPinnedClaims(new Set());
        }
    };

    const handleExportFactChecks = () => {
        const data = JSON.stringify(factChecks, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factchecks-${Date.now()}.json`;
        a.click();
    };

    const handleClearContextHistory = () => {
        setContextHistory([]);
    };

    const handleAddFavoritePreset = () => {
        const preset = prompt('Enter preset text:');
        if (preset) {
            setFavoritePresets(prev => [...prev, preset].slice(0, 20)); // Limit to 20 favorite presets
        }
    };

    const handleVoiceTest = () => {
        ipc.send('voice:test', selectedVoice);
    };

    const handleBrainProfileChange = (profile) => {
        setBrainProfile(profile);
        const config = brainProfiles[profile];
        setThinkingMode(config.thinking);
        setThinkingBudget(config.budget);
        setEmotionalRange(config.emotional);
        setCanInterrupt(config.interrupt);
        setListeningSensitivity(config.sensitivity);
        ipc.send('brain:load-profile', config);
    };

    const handleSaveBrainProfile = () => {
        const name = prompt('Enter profile name:');
        if (name) {
            brainProfiles[name] = {
                thinking: thinkingMode,
                budget: thinkingBudget,
                emotional: emotionalRange,
                interrupt: canInterrupt,
                sensitivity: listeningSensitivity
            };
        }
    };

    const toggleSection = (section) => {
        setCollapsedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            } else {
                next.add(section);
            }
            return next;
        });
    };

    const filteredMessages = messages.filter(msg =>
        !transcriptSearch ||
        msg.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
        msg.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
    );

    const filteredFactChecks = factChecks.filter(claim =>
        factCheckFilter === 'All' || claim.verdict === factCheckFilter
    );

    const sortedFactChecks = [...filteredFactChecks].sort((a, b) => {
        const aPinned = pinnedClaims.has(a.id);
        const bPinned = pinnedClaims.has(b.id);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0;
    });

    const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
    const factCheckStats = {
        total: factChecks.length,
        true: factChecks.filter(c => c.verdict === 'True').length,
        false: factChecks.filter(c => c.verdict === 'False').length,
        misleading: factChecks.filter(c => c.verdict === 'Misleading').length,
        unverified: factChecks.filter(c => c.verdict === 'Unverified').length
    };

    const baseFontSize = fontSize / 100;

    return (
        <div style={{ ...styles.container, fontSize: `${baseFontSize}rem` }} className={highContrastMode ? 'high-contrast' : ''}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.statusGroup}>
                        <div style={{
                            ...styles.statusIndicator,
                            backgroundColor: isLive ? '#00ff88' : '#666',
                            animation: isLive ? 'pulse 2s infinite' : 'none'
                        }} />
                        <span style={styles.statusText}>{isLive ? 'LIVE' : 'OFFLINE'}</span>
                    </div>
                    <button
                        style={{ ...styles.goLiveButton, ...(isLive ? styles.goLiveButtonActive : {}) }}
                        onClick={handleGoLive}
                        aria-label={isLive ? 'End stream' : 'Go live'}
                    >
                        {isLive ? '⏹ END STREAM' : '▶ GO LIVE'}
                    </button>
                    <button
                        style={{
                            ...styles.goLiveButton,
                            marginLeft: '10px',
                            background: 'rgba(0, 221, 255, 0.2)',
                            borderColor: 'rgba(0, 221, 255, 0.4)',
                            color: '#00ddff'
                        }}
                        onClick={handleTestAudio}
                        aria-label="Test Audio"
                    >
                        🔊 TEST
                    </button>
                </div>
                <div style={styles.headerCenter}>
                    <span style={styles.title}>DR. SNUGGLES CONTROL CENTER</span>
                </div>
                <div style={styles.headerRight}>
                    {/* Connection Quality */}
                    <div style={styles.qualityIndicator}>
                        <div style={styles.qualityBars}>
                            {[1, 2, 3, 4, 5].map(bar => (
                                <div
                                    key={bar}
                                    style={{
                                        ...styles.qualityBar,
                                        backgroundColor: connectionStatus.quality >= bar * 20 ? '#00ff88' : '#333',
                                        height: `${bar * 20}%`
                                    }}
                                />
                            ))}
                        </div>
                        <span style={styles.qualityText}>{connectionStatus.quality}%</span>
                    </div>
                    <button
                        style={styles.settingsButton}
                        onClick={() => setShowSettings(!showSettings)}
                        aria-label="Settings"
                    >
                        ⚙️
                    </button>
                </div>
            </div>

            {/* Status Bar - Latency & Queue */}
            <div style={styles.statusBar}>
                <div style={styles.statusBarItem}>
                    <span style={styles.statusBarLabel}>LATENCY</span>
                    <span style={{ ...styles.statusBarValue, color: latency < 100 ? '#00ff88' : latency < 200 ? '#ffaa00' : '#ff4444' }}>
                        {latency.toFixed(0)}ms
                    </span>
                    <div style={styles.miniGraph}>
                        {latencyHistory.slice(-15).map((val, idx) => (
                            <div
                                key={idx}
                                style={{
                                    ...styles.miniGraphBar,
                                    height: `${(val / 300) * 100}%`,
                                    backgroundColor: val < 100 ? '#00ff88' : val < 200 ? '#ffaa00' : '#ff4444'
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div style={styles.statusBarItem}>
                    <span style={styles.statusBarLabel}>QUEUE DEPTH</span>
                    <span style={styles.statusBarValue}>{processingStatus.queueDepth}</span>
                </div>
                <div style={styles.statusBarItem}>
                    <span style={styles.statusBarLabel}>PROCESSING DELAY</span>
                    <span style={styles.statusBarValue}>{processingStatus.processingDelay.toFixed(0)}ms</span>
                </div>
                <div style={styles.statusBarItem}>
                    <span style={styles.statusBarLabel}>SESSION</span>
                    <span style={styles.statusBarValue}>{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</span>
                </div>
            </div>

            {/* Main Layout */}
            <div style={styles.mainLayout}>
                {/* Left Sidebar */}
                <div style={styles.leftSidebar}>
                    {/* Avatar Section */}
                    <div style={styles.avatarSection}>
                        <div style={styles.sectionHeaderRow}>
                            <div style={styles.sectionHeader}>🐻 DR. SNUGGLES</div>
                            <button
                                style={styles.collapseBtn}
                                onClick={() => toggleSection('avatar')}
                                aria-label="Toggle avatar section"
                            >
                                {collapsedSections.has('avatar') ? '▼' : '▲'}
                            </button>
                        </div>
                        {!collapsedSections.has('avatar') && (
                            <>
                                <div style={styles.avatarContainer}>
                                    <canvas
                                        ref={smokeCanvasRef}
                                        style={styles.smokeCanvas}
                                    />
                                    <svg viewBox="0 0 200 200" style={styles.avatarSvg}>
                                        {/* Status Glow Ring */}
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="85"
                                            fill="none"
                                            stroke={vadStatus.isSpeaking ? '#ff4444' : vadStatus.isListening ? '#ffaa00' : '#00ddff'}
                                            strokeWidth="4"
                                            opacity="0.6"
                                            style={{
                                                filter: `drop-shadow(0 0 10px ${vadStatus.isSpeaking ? '#ff4444' : vadStatus.isListening ? '#ffaa00' : '#00ddff'})`
                                            }}
                                        />

                                        {/* Head tilt when listening */}
                                        <g transform={vadStatus.isListening ? 'rotate(5 100 100)' : 'rotate(0 100 100)'}>
                                            {/* Bear Head */}
                                            <circle cx="100" cy="100" r="60" fill="#D4A574" />

                                            {/* Ears */}
                                            <circle cx="65" cy="60" r="20" fill="#D4A574" />
                                            <circle cx="135" cy="60" r="20" fill="#D4A574" />
                                            <circle cx="65" cy="60" r="12" fill="#C4956A" />
                                            <circle cx="135" cy="60" r="12" fill="#C4956A" />

                                            {/* Bandage */}
                                            <rect x="80" y="45" width="40" height="12" fill="#FFF" rx="2" />
                                            <line x1="85" y1="45" x2="85" y2="57" stroke="#DDD" strokeWidth="1" />
                                            <line x1="100" y1="45" x2="100" y2="57" stroke="#DDD" strokeWidth="1" />
                                            <line x1="115" y1="45" x2="115" y2="57" stroke="#DDD" strokeWidth="1" />

                                            {/* Snout */}
                                            <ellipse cx="100" cy="115" rx="35" ry="28" fill="#C4956A" />

                                            {/* Nose */}
                                            <ellipse cx="100" cy="108" rx="12" ry="10" fill="#3D2817" />

                                            {/* Eyes with blink */}
                                            {!blinkState ? (
                                                <>
                                                    <ellipse cx="80" cy="90" rx="8" ry="10" fill="#3D2817" />
                                                    <ellipse cx="120" cy="90" rx="8" ry="10" fill="#3D2817" />
                                                </>
                                            ) : (
                                                <>
                                                    <line x1="72" y1="90" x2="88" y2="90" stroke="#3D2817" strokeWidth="2" />
                                                    <line x1="112" y1="90" x2="128" y2="90" stroke="#3D2817" strokeWidth="2" />
                                                </>
                                            )}
                                            <path d="M 72 82 Q 80 85 88 82" stroke="#3D2817" strokeWidth="2" fill="none" />
                                            <path d="M 112 82 Q 120 85 128 82" stroke="#3D2817" strokeWidth="2" fill="none" />

                                            {/* Mouth with animation */}
                                            <path
                                                d={`M 80 ${125 + mouthOpen * 10} Q 100 ${122 + mouthOpen * 15} 120 ${125 + mouthOpen * 10}`}
                                                stroke="#3D2817"
                                                strokeWidth="2"
                                                fill="none"
                                            />

                                            {/* Cigarette */}
                                            <rect x="125" y="112" width="30" height="4" fill="#FFF" rx="2" />
                                            <rect x="152" y="111" width="8" height="6" fill="#D4A574" rx="1" />
                                            <circle cx="156" cy="114" r="2" fill="#ff6600" />
                                        </g>
                                    </svg>

                                    <div style={styles.shirtLabel}>CIA</div>
                                </div>

                                <div style={styles.statusButtons}>
                                    <button
                                        style={{ ...styles.statusBtn, ...(vadStatus.isSpeaking ? styles.statusBtnActive : {}) }}
                                        onClick={() => handleStatusAction('speak')}
                                        aria-label="Speak"
                                    >
                                        🗣 SPEAK
                                    </button>
                                    <button
                                        style={{ ...styles.statusBtn, ...(vadStatus.isListening ? styles.statusBtnActive : {}) }}
                                        onClick={() => handleStatusAction('listen')}
                                        aria-label="Listen"
                                    >
                                        👂 LISTEN
                                    </button>
                                    <button
                                        style={styles.statusBtn}
                                        onClick={() => handleStatusAction('reset')}
                                        aria-label="Reset"
                                    >
                                        🔄 RESET
                                    </button>
                                </div>

                                <div style={styles.currentStatus}>
                                    Status: {vadStatus.isSpeaking ? 'Speaking' : vadStatus.isListening ? 'Listening' : 'Idle'}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Voice Configuration */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeaderRow}>
                            <div style={styles.sectionHeader}>🎤 VOICE</div>
                            <button
                                style={styles.collapseBtn}
                                onClick={() => toggleSection('voice')}
                            >
                                {collapsedSections.has('voice') ? '▼' : '▲'}
                            </button>
                        </div>
                        {!collapsedSections.has('voice') && (
                            <>
                                <select
                                    style={styles.voiceSelect}
                                    value={selectedVoice}
                                    onChange={handleVoiceChange}
                                    aria-label="Select voice"
                                >
                                    {Object.keys(voices).map(voice => (
                                        <option key={voice} value={voice}>{voice}</option>
                                    ))}
                                </select>
                                <div style={styles.voiceDescription}>{voices[selectedVoice]}</div>
                                <button style={styles.testButton} onClick={handleVoiceTest}>
                                    🔊 TEST VOICE
                                </button>

                                {/* Voice Style Controls */}
                                <div style={styles.modControl}>
                                    <label style={styles.modLabel}>Style</label>
                                    <select
                                        style={styles.styleSelect}
                                        value={voiceStyle}
                                        onChange={(e) => {
                                            setVoiceStyle(e.target.value);
                                            ipc.send('voice:style', { style: e.target.value, pace: voicePace, tone: voiceTone, accent: voiceAccent });
                                        }}
                                    >
                                        <option value="natural">Natural</option>
                                        <option value="dramatic">Dramatic</option>
                                        <option value="whisper">Whisper</option>
                                        <option value="cheerful">Cheerful</option>
                                        <option value="serious">Serious</option>
                                        <option value="sarcastic">Sarcastic</option>
                                    </select>
                                </div>
                                <div style={styles.modControl}>
                                    <label style={styles.modLabel}>Pace</label>
                                    <select
                                        style={styles.styleSelect}
                                        value={voicePace}
                                        onChange={(e) => {
                                            setVoicePace(e.target.value);
                                            ipc.send('voice:style', { style: voiceStyle, pace: e.target.value, tone: voiceTone, accent: voiceAccent });
                                        }}
                                    >
                                        <option value="slow">Slow</option>
                                        <option value="normal">Normal</option>
                                        <option value="fast">Fast</option>
                                        <option value="deliberate">Deliberate</option>
                                    </select>
                                </div>
                                <div style={styles.modControl}>
                                    <label style={styles.modLabel}>Tone</label>
                                    <select
                                        style={styles.styleSelect}
                                        value={voiceTone}
                                        onChange={(e) => {
                                            setVoiceTone(e.target.value);
                                            ipc.send('voice:style', { style: voiceStyle, pace: voicePace, tone: e.target.value, accent: voiceAccent });
                                        }}
                                    >
                                        <option value="conversational">Conversational</option>
                                        <option value="authoritative">Authoritative</option>
                                        <option value="warm">Warm</option>
                                        <option value="cold">Cold</option>
                                        <option value="playful">Playful</option>
                                    </select>
                                </div>
                                <div style={styles.modControl}>
                                    <label style={styles.modLabel}>Accent</label>
                                    <select
                                        style={styles.styleSelect}
                                        value={voiceAccent}
                                        onChange={(e) => {
                                            setVoiceAccent(e.target.value);
                                            ipc.send('voice:style', { style: voiceStyle, pace: voicePace, tone: voiceTone, accent: e.target.value });
                                        }}
                                    >
                                        <option value="neutral">Neutral</option>
                                        <option value="british">British</option>
                                        <option value="australian">Australian</option>
                                        <option value="southern">Southern US</option>
                                    </select>
                                </div>

                                {/* Audio Level Meter */}
                                <AudioMeterWidget />

                                {/* Audio Controls */}
                                <div style={styles.audioControls}>
                                    <div style={styles.audioControlRow}>
                                        <span style={styles.audioLabel}>OUTPUT</span>
                                        <button
                                            style={{ ...styles.muteBtn, ...(isMuted ? styles.muteBtnActive : {}) }}
                                            onClick={handleMuteToggle}
                                            aria-label={isMuted ? 'Unmute output' : 'Mute output'}
                                        >
                                            {isMuted ? '🔇' : '🔊'}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={outputVolume}
                                            onChange={handleVolumeChange}
                                            style={styles.volumeSlider}
                                            disabled={isMuted}
                                            aria-label="Output volume"
                                        />
                                        <span style={styles.volumeValue}>{outputVolume}%</span>
                                    </div>

                                    <div style={styles.audioControlRow}>
                                        <span style={styles.audioLabel}>INPUT</span>
                                        <button
                                            style={{ ...styles.muteBtn, ...(micMuted ? styles.muteBtnActive : {}) }}
                                            onClick={handleMicToggle}
                                            aria-label={micMuted ? 'Unmute microphone' : 'Mute microphone'}
                                        >
                                            {micMuted ? '🎤' : '🎙️'}
                                        </button>
                                        <button
                                            style={styles.interruptBtn}
                                            onClick={handleInterrupt}
                                            aria-label="Interrupt"
                                        >
                                            ⏹ INTERRUPT
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Brain Controls */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeaderRow}>
                            <div style={styles.sectionHeader}>🧠 BRAIN</div>
                            <button
                                style={styles.collapseBtn}
                                onClick={() => toggleSection('brain')}
                            >
                                {collapsedSections.has('brain') ? '▼' : '▲'}
                            </button>
                        </div>
                        {!collapsedSections.has('brain') && (
                            <>
                                {/* Profile Selector */}
                                <div style={styles.profileSelect}>
                                    <label style={styles.profileLabel}>Profile:</label>
                                    <select
                                        style={styles.profileDropdown}
                                        value={brainProfile}
                                        onChange={(e) => handleBrainProfileChange(e.target.value)}
                                        aria-label="Brain profile"
                                    >
                                        {Object.keys(brainProfiles).map(profile => (
                                            <option key={profile} value={profile}>{profile}</option>
                                        ))}
                                    </select>
                                    <button style={styles.saveProfileBtn} onClick={handleSaveBrainProfile} aria-label="Save profile">
                                        💾
                                    </button>
                                </div>

                                <div style={styles.controlItem}>
                                    <label style={styles.controlLabel}>
                                        <input
                                            type="checkbox"
                                            checked={thinkingMode}
                                            onChange={handleThinkingModeToggle}
                                            style={styles.checkbox}
                                            aria-label="Thinking mode"
                                        />
                                        Thinking Mode
                                        {thinkingMode && <span style={styles.activeBadge}>ACTIVE</span>}
                                    </label>
                                    {thinkingMode && (
                                        <div style={styles.budgetControl}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="10000"
                                                step="100"
                                                value={thinkingBudget}
                                                onChange={handleThinkingBudgetChange}
                                                style={styles.budgetSlider}
                                                aria-label="Thinking budget"
                                            />
                                            <span style={styles.budgetValue}>{thinkingBudget} tokens</span>
                                        </div>
                                    )}
                                </div>

                                <div style={styles.controlItem}>
                                    <label style={styles.controlLabel}>
                                        <input
                                            type="checkbox"
                                            checked={emotionalRange}
                                            onChange={(e) => {
                                                setEmotionalRange(e.target.checked);
                                                // Convert boolean to 0-100 range (off=33, on=66)
                                                ipc.send('voice:emotion', e.target.checked ? 66 : 33);
                                            }}
                                            style={styles.checkbox}
                                            aria-label="Emotional range"
                                        />
                                        Emotional Range
                                        {emotionalRange && <span style={styles.activeBadge}>ON</span>}
                                    </label>
                                </div>

                                <div style={styles.controlItem}>
                                    <label style={styles.controlLabel}>
                                        <input
                                            type="checkbox"
                                            checked={canInterrupt}
                                            onChange={(e) => {
                                                setCanInterrupt(e.target.checked);
                                                ipc.send('audio:can-interrupt', e.target.checked);
                                            }}
                                            style={styles.checkbox}
                                            aria-label="Can interrupt"
                                        />
                                        Can Interrupt
                                        {canInterrupt && <span style={styles.activeBadge}>ON</span>}
                                    </label>
                                </div>

                                <div style={styles.controlItem}>
                                    <div style={styles.controlLabel}>Listening Sensitivity (VAD)</div>
                                    <select
                                        style={styles.sensitivitySelect}
                                        value={listeningSensitivity}
                                        onChange={(e) => {
                                            setListeningSensitivity(e.target.value);
                                            ipc.send('audio:vad-sensitivity', e.target.value);
                                        }}
                                        aria-label="VAD sensitivity"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Analytics */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeaderRow}>
                            <div style={styles.sectionHeader}>📊 ANALYTICS</div>
                            <button
                                style={styles.collapseBtn}
                                onClick={() => toggleSection('analytics')}
                            >
                                {collapsedSections.has('analytics') ? '▼' : '▲'}
                            </button>
                        </div>
                        {!collapsedSections.has('analytics') && (
                            <div style={styles.analytics}>
                                <div style={styles.analyticsRow}>
                                    <span>Messages:</span>
                                    <span style={styles.analyticsValue}>{messageCount}</span>
                                </div>
                                <div style={styles.analyticsRow}>
                                    <span>Speaking Time:</span>
                                    <span style={styles.analyticsValue}>{Math.floor(speakingTime)}s</span>
                                </div>
                                <div style={styles.analyticsRow}>
                                    <span>Fact Checks:</span>
                                    <span style={styles.analyticsValue}>{factCheckStats.total}</span>
                                </div>
                                <div style={styles.analyticsRow}>
                                    <span style={{ color: '#00ff88' }}>✓ True:</span>
                                    <span style={styles.analyticsValue}>{factCheckStats.true}</span>
                                </div>
                                <div style={styles.analyticsRow}>
                                    <span style={{ color: '#ff4444' }}>✗ False:</span>
                                    <span style={styles.analyticsValue}>{factCheckStats.false}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Center - Transcript */}
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
                        {filteredMessages.map((msg, idx) => (
                            <div key={idx} style={styles.transcriptMessage}>
                                <div style={styles.transcriptHeader}>
                                    <span style={{
                                        ...styles.transcriptSpeaker,
                                        color: msg.role === 'assistant' ? '#8a2be2' : '#00ddff'
                                    }}>
                                        {msg.speaker || msg.role}
                                    </span>
                                    <div style={styles.transcriptActions}>
                                        <CopyButton text={msg.text} style={styles.copyBtn} />
                                        <span style={styles.transcriptTime}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                                <div style={styles.transcriptText}>{msg.text}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div style={styles.rightSidebar}>
                    {/* Context Injector */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeaderRow}>
                            <div style={styles.sectionHeader}>💉 CONTEXT</div>
                            <button
                                style={styles.collapseBtn}
                                onClick={() => toggleSection('context')}
                            >
                                {collapsedSections.has('context') ? '▼' : '▲'}
                            </button>
                        </div>
                        {!collapsedSections.has('context') && (
                            <>
                                <div style={styles.charCounter}>
                                    {contextInput.length} characters
                                </div>
                                <textarea
                                    style={styles.contextInput}
                                    placeholder="Instructions to Dr. Snuggles... (Ctrl+Enter to send)"
                                    value={contextInput}
                                    onChange={(e) => setContextInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.ctrlKey || e.metaKey) && (e.preventDefault(), handleSendContext())}
                                    aria-label="Context input"
                                />
                                <div style={styles.presetButtons}>
                                    {favoritePresets.map(preset => (
                                        <button
                                            key={preset}
                                            style={styles.presetBtn}
                                            onClick={() => handleQuickPreset(preset)}
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                    <button
                                        style={styles.addPresetBtn}
                                        onClick={handleAddFavoritePreset}
                                        title="Add preset"
                                        aria-label="Add preset"
                                    >
                                        ➕
                                    </button>
                                </div>
                                <button style={styles.sendButton} onClick={handleSendContext}>
                                    📤 SEND
                                </button>

                                {contextHistory.length > 0 && (
                                    <>
                                        <div style={styles.historyHeader}>
                                            <span>HISTORY</span>
                                            <button
                                                style={styles.clearHistoryBtn}
                                                onClick={handleClearContextHistory}
                                                aria-label="Clear history"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        <div style={styles.contextHistory}>
                                            {contextHistory.map((item, idx) => (
                                                <div key={idx} style={styles.contextHistoryItem}>
                                                    <div style={styles.contextHistoryText}>{item.text}</div>
                                                    <div style={styles.contextHistoryTime}>
                                                        {new Date(item.timestamp).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* System Prompt */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeaderRow}>
                            <div style={styles.sectionHeader}>📝 SYSTEM PROMPT</div>
                            <button
                                style={styles.collapseBtn}
                                onClick={() => toggleSection('prompt')}
                            >
                                {collapsedSections.has('prompt') ? '▼' : '▲'}
                            </button>
                        </div>
                        {!collapsedSections.has('prompt') && (
                            <>
                                <div style={styles.promptTools}>
                                    <select
                                        style={styles.promptSelect}
                                        onChange={(e) => handleLoadPrompt(savedPrompts.find(p => p.name === e.target.value))}
                                        aria-label="Load prompt template"
                                    >
                                        <option value="">Load Template...</option>
                                        {savedPrompts.map(prompt => (
                                            <option key={prompt.name} value={prompt.name}>{prompt.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        style={styles.promptToolBtn}
                                        onClick={handleSavePrompt}
                                        title="Save as template"
                                        aria-label="Save template"
                                    >
                                        💾
                                    </button>
                                    <button
                                        style={styles.promptToolBtn}
                                        onClick={handleResetPrompt}
                                        title="Reset to default"
                                        aria-label="Reset to default"
                                    >
                                        🔄
                                    </button>
                                </div>
                                <div style={styles.charCounter}>
                                    {systemPrompt.length} characters
                                </div>
                                <textarea
                                    style={styles.systemPromptEditor}
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    aria-label="System prompt"
                                />
                                <button style={styles.applyButton} onClick={handleApplySystemPrompt}>
                                    ✓ APPLY CHANGES
                                </button>
                            </>
                        )}
                    </div>

                    {/* Fact Checker */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeaderRow}>
                            <div style={styles.sectionHeader}>✓ FACT CHECKER</div>
                            <button
                                style={styles.collapseBtn}
                                onClick={() => toggleSection('facts')}
                            >
                                {collapsedSections.has('facts') ? '▼' : '▲'}
                            </button>
                        </div>
                        {!collapsedSections.has('facts') && (
                            <>
                                <div style={styles.factCheckTools}>
                                    <select
                                        style={styles.factFilterSelect}
                                        value={factCheckFilter}
                                        onChange={(e) => setFactCheckFilter(e.target.value)}
                                        aria-label="Filter fact checks"
                                    >
                                        <option value="All">All</option>
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                        <option value="Misleading">Misleading</option>
                                        <option value="Unverified">Unverified</option>
                                    </select>
                                    <button
                                        style={styles.toolBtn}
                                        onClick={handleExportFactChecks}
                                        title="Export fact checks"
                                        aria-label="Export fact checks"
                                    >
                                        📥
                                    </button>
                                    <button
                                        style={styles.toolBtn}
                                        onClick={handleClearFactChecks}
                                        title="Clear all"
                                        aria-label="Clear fact checks"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <div style={styles.factCheckFeed}>
                                    {sortedFactChecks.map((claim) => (
                                        <div key={claim.id} style={styles.factCheckItem}>
                                            <div style={styles.factCheckHeader}>
                                                <span style={{
                                                    ...styles.verdictBadge,
                                                    backgroundColor:
                                                        claim.verdict === 'True' ? 'rgba(0, 255, 136, 0.2)' :
                                                            claim.verdict === 'False' ? 'rgba(255, 68, 68, 0.2)' :
                                                                claim.verdict === 'Misleading' ? 'rgba(255, 170, 0, 0.2)' :
                                                                    'rgba(136, 136, 136, 0.2)',
                                                    borderColor:
                                                        claim.verdict === 'True' ? '#00ff88' :
                                                            claim.verdict === 'False' ? '#ff4444' :
                                                                claim.verdict === 'Misleading' ? '#ffaa00' :
                                                                    '#888'
                                                }}>
                                                    {claim.verdict}
                                                </span>
                                                <span style={styles.confidenceBadge}>{claim.confidence}%</span>
                                                <button
                                                    style={{
                                                        ...styles.pinButton,
                                                        color: pinnedClaims.has(claim.id) ? '#ffaa00' : '#666'
                                                    }}
                                                    onClick={() => togglePinClaim(claim.id)}
                                                    aria-label={pinnedClaims.has(claim.id) ? 'Unpin claim' : 'Pin claim'}
                                                >
                                                    {pinnedClaims.has(claim.id) ? '📌' : '📍'}
                                                </button>
                                            </div>
                                            <div style={styles.factCheckClaim}>{claim.claim}</div>
                                            <div style={styles.factCheckReason}>{claim.reason}</div>
                                            <div style={styles.factCheckTime}>
                                                {new Date(claim.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Settings Panel Overlay */}
            {showSettings && (
                <div style={styles.settingsOverlay} onClick={() => setShowSettings(false)}>
                    <div style={styles.settingsPanel} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.settingsPanelHeader}>
                            <h2 style={styles.settingsTitle}>⚙️ SETTINGS</h2>
                            <button
                                style={styles.settingsCloseBtn}
                                onClick={() => setShowSettings(false)}
                                aria-label="Close settings"
                            >
                                ✕
                            </button>
                        </div>

                        <div style={styles.settingsContent}>
                            {/* Device Selection */}
                            <div style={styles.settingsSection}>
                                <h3 style={styles.settingsSectionTitle}>Audio Devices</h3>
                                <div style={styles.settingRow}>
                                    <label style={styles.settingLabel}>Input Device:</label>
                                    <select
                                        value={selectedInputDevice}
                                        onChange={(e) => {
                                            setSelectedInputDevice(e.target.value);
                                            ipc.send('audio:set-input-device', e.target.value);
                                        }}
                                        style={styles.deviceSelect}
                                        aria-label="Input device"
                                    >
                                        <option value="default">Default Microphone</option>
                                        <option value="device1">USB Microphone</option>
                                        <option value="device2">Line In</option>
                                    </select>
                                </div>
                                <div style={styles.settingRow}>
                                    <label style={styles.settingLabel}>Output Device:</label>
                                    <select
                                        value={selectedOutputDevice}
                                        onChange={(e) => {
                                            setSelectedOutputDevice(e.target.value);
                                            ipc.send('audio:set-output-device', e.target.value);
                                        }}
                                        style={styles.deviceSelect}
                                        aria-label="Output device"
                                    >
                                        <option value="default">Default Speakers</option>
                                        <option value="device1">Headphones</option>
                                        <option value="device2">USB Audio</option>
                                    </select>
                                </div>
                            </div>

                            {/* Accessibility */}
                            <div style={styles.settingsSection}>
                                <h3 style={styles.settingsSectionTitle}>Accessibility</h3>
                                <div style={styles.settingRow}>
                                    <label style={styles.settingLabel}>
                                        <input
                                            type="checkbox"
                                            checked={highContrastMode}
                                            onChange={(e) => setHighContrastMode(e.target.checked)}
                                            style={styles.checkbox}
                                            aria-label="High contrast mode"
                                        />
                                        High Contrast Mode
                                    </label>
                                </div>
                                <div style={styles.settingRow}>
                                    <label style={styles.settingLabel}>Font Size: {fontSize}%</label>
                                    <input
                                        type="range"
                                        min="80"
                                        max="150"
                                        step="10"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                                        style={styles.settingsSlider}
                                        aria-label="Font size"
                                    />
                                </div>
                            </div>

                            {/* Keyboard Shortcuts */}
                            <div style={styles.settingsSection}>
                                <h3 style={styles.settingsSectionTitle}>Keyboard Shortcuts</h3>
                                <div style={styles.shortcutList}>
                                    <div style={styles.shortcutRow}>
                                        <kbd style={styles.kbd}>Ctrl+Enter</kbd>
                                        <span>Send Context</span>
                                    </div>
                                    <div style={styles.shortcutRow}>
                                        <kbd style={styles.kbd}>Ctrl+K</kbd>
                                        <span>Focus Search</span>
                                    </div>
                                    <div style={styles.shortcutRow}>
                                        <kbd style={styles.kbd}>Ctrl+M</kbd>
                                        <span>Toggle Mute</span>
                                    </div>
                                    <div style={styles.shortcutRow}>
                                        <kbd style={styles.kbd}>Ctrl+I</kbd>
                                        <span>Interrupt</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {/* Save Prompt Dialog */}
            {isSavePromptOpen && (
                <div style={styles.settingsOverlay} onClick={() => setIsSavePromptOpen(false)}>
                    <div style={{ ...styles.settingsPanel, height: 'auto', maxHeight: 'none' }} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.settingsPanelHeader}>
                            <h2 style={styles.settingsTitle}>💾 SAVE SYSTEM PROMPT</h2>
                            <button
                                style={styles.settingsCloseBtn}
                                onClick={() => setIsSavePromptOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#ccc' }}>Template Name:</label>
                                <input
                                    type="text"
                                    value={promptNameInput}
                                    onChange={(e) => setPromptNameInput(e.target.value)}
                                    placeholder="e.g., Physics Lecturer Mode"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(138, 43, 226, 0.3)',
                                        borderRadius: '6px',
                                        color: '#fff',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && confirmSavePrompt()}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    onClick={() => setIsSavePromptOpen(false)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #666',
                                        color: '#ccc',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmSavePrompt}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#8a2be2',
                                        border: 'none',
                                        color: '#fff',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Save Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Toast */}
            {errorToast && (
                <div style={styles.errorToast}>
                    ⚠️ {errorToast}
                </div>
            )}

            {/* Tooltips via title attributes handled natively */}
        </div>
    );
};


const styleSheet = document.createElement('style');
styleSheet.textContent = `
            @keyframes pulse {
                0 %, 100 % { opacity: 1; box- shadow: 0 0 10px currentColor; }
            50% {opacity: 0.6; box-shadow: 0 0 20px currentColor; }
  }

            @keyframes slideIn {
                from {transform: translateX(100%); opacity: 0; }
            to {transform: translateX(0); opacity: 1; }
  }

            input[type="range"]::-webkit-slider-thumb {
                -webkit - appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #00ddff;
            cursor: pointer;
            box-shadow: 0 0 8px rgba(0, 221, 255, 0.5);
  }

            input[type="range"]::-moz-range-thumb {
                width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #00ddff;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 8px rgba(0, 221, 255, 0.5);
  }

            button:hover {
                transform: scale(1.03);
            box-shadow: 0 0 15px rgba(138, 43, 226, 0.4);
  }

            button:active {
                transform: scale(0.97);
  }

            select option {
                background: #1a0033;
            color: #ffffff;
  }

            ::-webkit-scrollbar {
                width: 6px;
            height: 6px;
  }

            ::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
  }

            ::-webkit-scrollbar-thumb {
                background: rgba(138, 43, 226, 0.5);
            border-radius: 3px;
  }

            ::-webkit-scrollbar-thumb:hover {
                background: rgba(138, 43, 226, 0.7);
  }

            textarea:focus, select:focus, input:focus {
                outline: 1px solid rgba(138, 43, 226, 0.5);
  }

            .high-contrast {
                filter: contrast(1.3) brightness(1.1);
  }

            .high-contrast button,
            .high-contrast select,
            .high-contrast input {
                border - width: 2px;
  }
            `;
document.head.appendChild(styleSheet);

export default DrSnugglesControlCenter;

