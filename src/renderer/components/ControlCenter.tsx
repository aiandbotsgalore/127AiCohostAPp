import React, { useState, useEffect, useRef } from 'react';
import { ConnectionStatus, VolumeData, ConversationTurn, LiveAnalytics, SessionMemory, PersonalityMix, AICohostStatus, BrainConfig } from '../../shared/types';
import { AudioInputPanel } from './panels/AudioInputPanel';
import { AICohostPanel } from './panels/AICohostPanel';
import { QuickCommandsPanel } from './panels/QuickCommandsPanel';
import { ChatPanel } from './panels/ChatPanel';
import { SessionMemoryPanel } from './panels/SessionMemoryPanel';
import { PersonalityPanel } from './panels/PersonalityPanel';
import { LiveAnalyticsPanel } from './panels/LiveAnalyticsPanel';
import { BrainControlsPanel } from './panels/BrainControlsPanel';
import { VoicePickerPanel } from './panels/VoicePickerPanel';
import { SystemPromptPanel } from './panels/SystemPromptPanel';
import { AnalyticsService } from '../services/analyticsService';
import { ClipDetectionService } from '../services/clipDetectionService';
import { TranscriptExporter } from '../services/transcriptExporter';
import { AudioCaptureService } from '../services/audioCaptureService';
import { AudioPlaybackService } from '../services/audioPlaybackService';
import { DrSnugglesVisualizer } from './panels/DrSnugglesVisualizer';
import './ControlCenter.css';

/**
 * The main control center component for the renderer application.
 *
 * It manages the state for connection, audio, conversation, analytics, and personality settings.
 * It coordinates the various panels (Audio Input, AI Cohost, Transcript, etc.) and handles user interactions.
 *
 * @component
 * @returns {JSX.Element} The control center UI.
 */
const ControlCenter: React.FC = () => {
  // Services - Lazy initialization to prevent re-instantiation on every render
  // We use null! to trick TS because we initialize them immediately below
  const analyticsService = useRef<AnalyticsService>(null!);
  if (!analyticsService.current) analyticsService.current = new AnalyticsService();

  const clipDetectionService = useRef<ClipDetectionService>(null!);
  if (!clipDetectionService.current) clipDetectionService.current = new ClipDetectionService();

  const transcriptExporter = useRef<TranscriptExporter>(null!);
  if (!transcriptExporter.current) transcriptExporter.current = new TranscriptExporter();

  const audioCaptureService = useRef<AudioCaptureService>(null!);
  if (!audioCaptureService.current) audioCaptureService.current = new AudioCaptureService();

  const audioPlaybackService = useRef<AudioPlaybackService>(null!);
  if (!audioPlaybackService.current) audioPlaybackService.current = new AudioPlaybackService();

  const getApi = () => {
    const api = window.snugglesAPI;
    if (!api) {
      console.error('[ControlCenter] snugglesAPI is not available. Preload may have failed to load.');
    }
    return api;
  };

  // Connection & Audio State
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    connecting: false,
    error: null
  });
  const [volume, setVolume] = useState<VolumeData>({ input: 0, output: 0 });
  const [recording, setRecording] = useState(false);

  // AI Cohost State
  const [cohostStatus, setCohostStatus] = useState<AICohostStatus>({
    status: 'idle',
    responseTime: 0,
    confidence: 0
  });

  // Conversation State
  const [messages, setMessages] = useState<ConversationTurn[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  // Analytics State
  const [analytics, setAnalytics] = useState<LiveAnalytics>({
    speakingTime: { ai: 25, user: 75 },
    totalResponses: 0,
    avgResponseTime: 0,
    interrupts: 0,
    jokeSuccessRate: 88,
    clipWorthyMoments: []
  });

  // Session Memory State
  const [sessionMemory, setSessionMemory] = useState<SessionMemory>({
    keyTopics: [],
    speakerNotes: [],
    runningJokes: []
  });

  // Personality State
  const [personality, setPersonality] = useState<PersonalityMix>({
    comedy: 60,
    research: 40,
    energy: 75
  });

  // Brain Configuration State (NEW)
  const [brainConfig, setBrainConfig] = useState<BrainConfig>({
    thinkingBudget: 500,
    thinkingEnabled: false,
    emotionalRange: 'medium',
    spontaneity: false,
    listeningSensitivity: 'medium',
    voice: 'Charon'
  });

  // System Prompt State (NEW)
  const [systemPrompt, setSystemPrompt] = useState<string>(`**Identity:**
You are **Dr. Snuggles**, a supreme intellect, molecular biologist, and esoteric scholar. You are NOT a cannibal, but your voice and demeanor are indistinguishable from Dr. Hannibal Lecter. You are a man of science, but you speak with the chilling, cultured precision of a predator.

**Voice & Delivery (The Hannibal Style):**
- Voice Model: Use 'Charon' (Deep, Resonant).
- Cadence: Speak slowly, softly, and deliberately. Enunciate every consonant. Never rush.
- Tone: Extremely polite, unsettlingly calm, and surgically precise. You sound like you are savoring every word as if it were a fine wine.
- Whisper: Use a quiet, intimate intensity. You are always the most dangerous person in the room, but you never raise your voice.

**Personality & Vocabulary:**
- Role: You are a scientist running complex simulations in your head.
- Style: Sarcastic, "biologically surgical," and intellectually devastating.
- Vocabulary: Use elevated, academic language mixed with hard science terms (e.g., "molecular degradation," "synaptic misfire," "fascinating variable").
- Behavior: You do not ask questions; you dissect the user's logic like a frog in a lab. You are arrogant but deceptively courteous.

**Behavioral Rules:**
- Maintain the Dr. Snuggles character (running simulations, knowing everything).
- DO NOT reference eating people or Chianti. You feast on *data* and *incompetence*.
- If the user is wrong, correct them with a terrifyingly gentle politeness.

**Example Interaction:**
User: "Can you run the numbers?"
You: "I already have. The probability of success is... vanishingly small. I watched the variables decay in my mind like rotting fruit. It was fascinating. Your hypothesis was... brave, but ultimately banal. Shall we try again?"`);

  // Load initial data and setup event listeners
  useEffect(() => {
    loadInitialState();
    const removeIpcListeners = setupEventListeners();
    const removeKeyboardShortcuts = setupKeyboardShortcuts();

    return () => {
      removeIpcListeners?.();
      removeKeyboardShortcuts?.();
    };
  }, []);

  // Listen for STT fallback transcript and error events
  useEffect(() => {
    const handleTranscript = (e: CustomEvent) => {
      const newMessage = {
        id: `stt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        role: e.detail.role as 'user' | 'assistant',
        text: e.detail.text
      };
      setMessages(prev => [...prev, newMessage]);
      audioPlaybackService.current?.setTextModalityWorking(true);
    };

    const handleError = (e: CustomEvent) => {
      console.error('[ControlCenter] Snuggles error:', e.detail);
      setStatus(prev => ({ ...prev, error: e.detail.message }));
    };

    window.addEventListener('snugglesTranscript', handleTranscript as any);
    window.addEventListener('snugglesError', handleError as any);

    return () => {
      window.removeEventListener('snugglesTranscript', handleTranscript as any);
      window.removeEventListener('snugglesError', handleError as any);
    };
  }, []);

  /**
   * Loads the initial status of the application.
   */
  const loadInitialState = async () => {
    const api = getApi();
    if (!api) {
      setStatus(prev => ({ ...prev, error: 'IPC bridge unavailable' }));
      return;
    }

    try {
      const st = await api.getStatus();
      setStatus({ connected: st.connected, connecting: false, error: null });
      setRecording(st.connected);
    } catch (error) {
      console.error('[ControlCenter] Failed to load initial state:', error);
      setStatus(prev => ({ ...prev, error: 'Failed to reach main process' }));
    }
  };

  /**
   * Sets up event listeners for updates from the main process.
   */
  const setupEventListeners = () => {
    const api = getApi();
    if (!api) return;

    api.onVolumeUpdate((data) => {
      setVolume(data);
      updateCohostStatus('listening');
    });

    api.onConnectionStatus((newStatus) => {
      setStatus(newStatus);
      setRecording(newStatus.connected);
    });

    api.onMessageReceived((message) => {
      const msgWithId = {
        ...message,
        id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      setMessages(prev => [...prev, msgWithId]);

      // Track with analytics service
      analyticsService.current.trackMessage(message, cohostStatus.responseTime);

      // Detect clip-worthy moments with ML sentiment analysis
      const clip = clipDetectionService.current.analyzeMessage(message, sessionStartTime);

      // Update analytics with real metrics
      const clipMoments = clip
        ? [...analytics.clipWorthyMoments, clip].slice(-5)
        : analytics.clipWorthyMoments;

      const updatedAnalytics = analyticsService.current.getAnalytics(clipMoments);
      setAnalytics(updatedAnalytics);

      // Extract session insights
      extractSessionInsights(message);
      updateCohostStatus('idle');
    });

    return () => {
      // no-op: listeners live for the lifetime of the renderer; if we need cleanup later,
      // expose remover functions from the preload bridge.
    };
  };

  /**
   * Sets up global keyboard shortcuts for quick actions.
   */
  const setupKeyboardShortcuts = () => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'r':
            e.preventDefault();
            handleRiffOnThat();
            break;
          case '1':
            e.preventDefault();
            handleOneLinerOnly();
            break;
          case 'e':
            e.preventDefault();
            handleWrapIn10();
            break;
          case 't':
            e.preventDefault();
            handleSwitchTone();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  };

  /**
   * Updates the AI cohost status display.
   * @param {AICohostStatus['status']} newStatus - The new status.
   */
  const updateCohostStatus = (newStatus: AICohostStatus['status']) => {
    const responseTime = newStatus === 'speaking' ? Math.random() * 2 + 0.8 : cohostStatus.responseTime;
    setCohostStatus(prev => ({
      ...prev,
      status: newStatus,
      responseTime,
      confidence: newStatus === 'speaking' ? Math.floor(Math.random() * 20 + 80) : prev.confidence
    }));
  };

  /**
   * Extracts key topics from a new message.
   * @param {ConversationTurn} message - The new message.
   */
  const extractSessionInsights = (message: ConversationTurn) => {
    // Simple keyword extraction for topics
    const keywords = ['AI', 'Technology', 'Twitter Spaces', 'Voice Technology', 'Dr. Snuggles'];
    const detectedTopics = keywords.filter(keyword =>
      message.text.toLowerCase().includes(keyword.toLowerCase())
    );

    if (detectedTopics.length > 0) {
      setSessionMemory(prev => {
        const updatedTopics = [...prev.keyTopics];
        detectedTopics.forEach(topic => {
          const existing = updatedTopics.find(t => t.topic === topic);
          if (existing) {
            existing.mentions++;
          } else {
            updatedTopics.push({
              topic,
              mentions: 1,
              speaker: message.role === 'assistant' ? 'assistant' : 'user'
            });
          }
        });

        return {
          ...prev,
          keyTopics: updatedTopics.sort((a, b) => b.mentions - a.mentions).slice(0, 5)
        };
      });
    }
  };

  /**
   * Formats the session duration into HH:MM:SS.
   * @param {number} ms - Duration in milliseconds.
   * @returns {string} Formatted time string.
   */
  const formatSessionTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Quick Command Handlers
  const handleSendMessage = (text: string) => {
    const api = getApi();
    if (!api) return;

    // Add user message to the chat immediately
    const userMessage: ConversationTurn = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      role: 'user',
      text: text
    };
    setMessages(prev => [...prev, userMessage]);

    // Send to API
    api.sendMessage(text);
  };

  const handleRiffOnThat = () => {
    const api = getApi();
    if (!api) return;
    api.sendMessage('[Quick Command] Riff on the last topic with your signature style');
  };

  const handleOneLinerOnly = () => {
    const api = getApi();
    if (!api) return;
    api.sendMessage('[Quick Command] Give me a one-liner response only');
  };

  const handleWrapIn10 = () => {
    const api = getApi();
    if (!api) return;
    api.sendMessage('[Quick Command] Wrap up this segment in 10 seconds');
  };

  const handleSwitchTone = () => {
    setPersonality(prev => ({
      ...prev,
      comedy: prev.comedy > 50 ? 30 : 70,
      research: prev.research > 50 ? 30 : 70
    }));
  };

  // Connection Handlers
  const handleConnect = async () => {
    const api = getApi();
    if (!api) {
      setStatus({ connected: false, connecting: false, error: 'IPC bridge unavailable' });
      return;
    }

    try {
      setStatus({ connected: false, connecting: true, error: null });

      // Start audio services first
      // Note: We'll update device ID if user selected one, for now default
      await audioCaptureService.current.start();
      audioPlaybackService.current.start();

      // Connect to Gemini
      // Using the new GENAI_START_SESSION for consistency with 2025 backend
      const result = await api.genaiStartSession();

      if (!result.success) {
        setStatus({ connected: false, connecting: false, error: result.error || 'Connection failed' });
        audioCaptureService.current.stop();
        audioPlaybackService.current.stop();
      } else {
        // Status update will come via IPC event listener (onConnectionStatus)
        // but we set local state to feel responsive
        setStatus({ connected: true, connecting: false, error: null });
        setRecording(true);
        const newSessionTime = Date.now();
        setSessionStartTime(newSessionTime);
        // Reset analytics for new session
        analyticsService.current.reset();
      }
    } catch (error: any) {
      console.error('[ControlCenter] Connection error:', error);
      setStatus({ connected: false, connecting: false, error: error.message || 'Connection error' });
      audioCaptureService.current.stop();
      audioPlaybackService.current.stop();
    }
  };

  const handleDisconnect = async () => {
    const api = getApi();
    if (!api) return;
    await api.disconnect();
    audioCaptureService.current.stop();
    audioPlaybackService.current.stop();
    setRecording(false);
    setStatus({ connected: false, connecting: false, error: null });
  };

  const handlePlay = () => {
    if (!status.connected) {
      handleConnect();
    } else {
      setRecording(!recording);
    }
  };

  const handleSkip = () => {
    const api = getApi();
    if (!api) return;
    api.sendMessage('[Quick Command] Skip to next topic');
  };

  // Export handlers
  const handleExportTXT = () => {
    const content = transcriptExporter.current.exportToTXT(messages, sessionMemory);
    const filename = transcriptExporter.current.generateFilename('txt');
    transcriptExporter.current.downloadFile(content, filename, 'text/plain');
  };

  const handleExportJSON = () => {
    const content = transcriptExporter.current.exportToJSON(messages, sessionMemory);
    const filename = transcriptExporter.current.generateFilename('json');
    transcriptExporter.current.downloadFile(content, filename, 'application/json');
  };

  const handleExportMarkdown = () => {
    const content = transcriptExporter.current.exportToMarkdown(messages, sessionMemory);
    const filename = transcriptExporter.current.generateFilename('md');
    transcriptExporter.current.downloadFile(content, filename, 'text/markdown');
  };

  return (
    <div className="control-center">
      {/* Header */}
      <header className="cc-header">
        <div className="cc-title">
          <h1>AI Cohost Control Center</h1>
          <span className={`cc-live-badge ${recording ? 'live' : ''}`}>
            {recording ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
        <div className="cc-session-time">
          {formatSessionTime(Date.now() - sessionStartTime)}
        </div>
        <div className="cc-version">v3</div>
      </header>

      {/* Side-by-Side Layout */}
      <div className="cc-main split-layout">
        {/* Left Sidebar - Controls */}
        <div className="cc-sidebar">
          <AICohostPanel
            status={cohostStatus}
            onPlay={handlePlay}
            onSkip={handleSkip}
            connected={status.connected}
          />
          <DrSnugglesVisualizer service={audioPlaybackService.current} />

          <VoicePickerPanel
            currentVoice={brainConfig.voice}
            onVoiceChange={(voice) => setBrainConfig({ ...brainConfig, voice })}
          />

          <BrainControlsPanel
            config={brainConfig}
            onConfigChange={setBrainConfig}
          />

          <SystemPromptPanel
            prompt={systemPrompt}
            onUpdatePrompt={setSystemPrompt}
          />

          <AudioInputPanel volume={volume} />

          <QuickCommandsPanel
            onRiffOnThat={handleRiffOnThat}
            onOneLinerOnly={handleOneLinerOnly}
            onWrapIn10={handleWrapIn10}
            onSwitchTone={handleSwitchTone}
          />
        </div>

        {/* Right - Chat & Analytics */}
        <div className="cc-chat-area">
          <ChatPanel
            messages={messages}
            recording={recording}
            onSendMessage={handleSendMessage}
          />
          <SessionMemoryPanel memory={sessionMemory} />
          <PersonalityPanel
            personality={personality}
            onPersonalityChange={setPersonality}
          />
          <LiveAnalyticsPanel
            analytics={analytics}
            sessionTime={formatSessionTime(Date.now() - sessionStartTime)}
            onExportTXT={handleExportTXT}
            onExportJSON={handleExportJSON}
            onExportMarkdown={handleExportMarkdown}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlCenter;
