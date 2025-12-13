import { contextBridge, ipcRenderer } from 'electron';

// DEBUG: Confirm preload is loading
console.log('[Preload] ========== PRELOAD SCRIPT LOADING ==========');

// Duplicate the shared IPC constants locally to avoid any module resolution issues in preload
const IPC_CHANNELS = {
  GET_AUDIO_DEVICES: 'get-audio-devices',
  SET_AUDIO_DEVICES: 'set-audio-devices',
  CONNECT_GEMINI: 'connect-gemini',
  DISCONNECT_GEMINI: 'disconnect-gemini',
  SEND_MESSAGE: 'send-message',
  TOGGLE_MUTE: 'toggle-mute',
  GET_STATUS: 'get-status',
  VOLUME_UPDATE: 'volume-update',
  CONNECTION_STATUS: 'connection-status',
  MESSAGE_RECEIVED: 'message-received',
  RESET_AGENT: 'reset-agent',
  SEARCH_KNOWLEDGE: 'search-knowledge',
  LOAD_KNOWLEDGE: 'load-knowledge',
  GENAI_START_SESSION: 'genai:startSession',
  GENAI_SEND_AUDIO_CHUNK: 'genai:sendAudioChunk',
  GENAI_AUDIO_RECEIVED: 'genai:audioReceived',
  GENAI_LATENCY_UPDATE: 'genai:latencyUpdate',
  GENAI_VAD_STATE: 'genai:vadState',
  GENAI_INTERRUPTION: 'genai:interruption',
  SET_VOICE_MODE: 'set-voice-mode',
  GET_VOICE_MODE: 'get-voice-mode'
} as const;

// Lightweight local copies of the types needed for the preload bridge
type AudioDevice = { id: string; label: string; kind: 'audioinput' | 'audiooutput' };
type ConnectionStatus = { connected: boolean; connecting: boolean; error: string | null };
type VolumeData = { input: number; output: number };
type ConversationTurn = { id: string; timestamp: number; role: 'user' | 'assistant'; text: string; audioUrl?: string };


/**
 * Preload script - Exposes safe IPC APIs to renderer
 *
 * This script runs in the renderer process before other scripts. It exposes a
 * `snugglesAPI` object on the `window` global, providing safe access to
 * functionality in the main process via IPC.
 */

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('snugglesAPI', {
  /**
   * Retrieves the list of available audio devices.
   */
  getAudioDevices: () => ipcRenderer.invoke(IPC_CHANNELS.GET_AUDIO_DEVICES),
  /**
   * Sets the input and output audio devices.
   * @param inputId - The ID of the input device.
   * @param outputId - The ID of the output device.
   */
  setAudioDevices: (inputId: string, outputId: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_AUDIO_DEVICES, inputId, outputId),

  /**
   * Connects to the Gemini service.
   */
  connect: () => ipcRenderer.invoke(IPC_CHANNELS.CONNECT_GEMINI),
  /**
   * Disconnects from the Gemini service.
   */
  disconnect: () => ipcRenderer.invoke(IPC_CHANNELS.DISCONNECT_GEMINI),
  /**
   * Sends a text message to the Gemini service.
   * @param text - The text message to send.
   */
  sendMessage: (text: string) => ipcRenderer.invoke(IPC_CHANNELS.SEND_MESSAGE, text),

  /**
   * Toggles the mute status of the microphone.
   */
  toggleMute: () => ipcRenderer.invoke(IPC_CHANNELS.TOGGLE_MUTE),
  /**
   * Resets the agent's state and reconnects.
   */
  resetAgent: () => ipcRenderer.invoke(IPC_CHANNELS.RESET_AGENT),

  /**
   * Gets the current status of the application (connection, mute, devices).
   */
  getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.GET_STATUS),

  /**
   * Searches the knowledge base.
   * @param query - The search query.
   */
  searchKnowledge: (query: string) => ipcRenderer.invoke(IPC_CHANNELS.SEARCH_KNOWLEDGE, query),
  /**
   * Reloads the knowledge base from disk.
   */
  loadKnowledge: () => ipcRenderer.invoke(IPC_CHANNELS.LOAD_KNOWLEDGE),

  /**
   * Registers a callback for volume updates.
   * @param callback - The function to call with volume data.
   * @returns Cleanup function to remove listener
   */
  onVolumeUpdate: (callback: (data: VolumeData) => void) => {
    const handler = (_: any, data: VolumeData) => callback(data);
    ipcRenderer.on(IPC_CHANNELS.VOLUME_UPDATE, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.VOLUME_UPDATE, handler);
  },

  /**
   * Registers a callback for connection status updates.
   * @param callback - The function to call with status updates.
   * @returns Cleanup function to remove listener
   */
  onConnectionStatus: (callback: (status: ConnectionStatus) => void) => {
    const handler = (_: any, status: ConnectionStatus) => callback(status);
    ipcRenderer.on(IPC_CHANNELS.CONNECTION_STATUS, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.CONNECTION_STATUS, handler);
  },

  /**
   * Registers a callback for received messages.
   * @param callback - The function to call with the received message.
   * @returns Cleanup function to remove listener
   */
  onMessageReceived: (callback: (message: ConversationTurn) => void) => {
    const handler = (_: any, message: ConversationTurn) => callback(message);
    ipcRenderer.on(IPC_CHANNELS.MESSAGE_RECEIVED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.MESSAGE_RECEIVED, handler);
  },

  // ===== December 2025 Audio Streaming APIs =====

  /**
   * Start Gemini Live session with new SDK
   * @param config - Session configuration (optional)
   * @returns Promise<{ success: boolean; error?: string }>
   */
  genaiStartSession: (config?: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.GENAI_START_SESSION, config),

  /**
   * Send audio chunk to Gemini (48kHz Float32Array)
   * Main process handles conversion to 16kHz PCM16 base64
   * @param audioChunk - Float32Array audio data
   * @returns Promise<number> - Latency in milliseconds
   */
  genaiSendAudioChunk: (audioChunk: Float32Array) =>
    ipcRenderer.invoke(IPC_CHANNELS.GENAI_SEND_AUDIO_CHUNK, audioChunk),

  /**
   * Listen for audio received from Gemini (48kHz Float32Array)
   * Main process handles conversion from 24kHz PCM16 base64
   * @returns Cleanup function to remove listener
   */
  onGenaiAudioReceived: (callback: (audioData: Float32Array) => void) => {
    const handler = (_: any, audioData: Float32Array) => {
      console.log(`[Preload] 🎧 Audio received: ${audioData?.length || 'undefined'} samples, Type: ${audioData?.constructor?.name || typeof audioData}`);
      callback(audioData);
    };
    ipcRenderer.on(IPC_CHANNELS.GENAI_AUDIO_RECEIVED, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.GENAI_AUDIO_RECEIVED, handler);
  },

  /**
   * Listen for latency updates
   * @returns Cleanup function to remove listener
   */
  onGenaiLatencyUpdate: (callback: (metrics: any) => void) => {
    const handler = (_: any, metrics: any) => callback(metrics);
    ipcRenderer.on(IPC_CHANNELS.GENAI_LATENCY_UPDATE, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.GENAI_LATENCY_UPDATE, handler);
  },

  /**
   * Listen for VAD state changes
   * @returns Cleanup function to remove listener
   */
  onGenaiVADState: (callback: (state: any) => void) => {
    const handler = (_: any, state: any) => callback(state);
    ipcRenderer.on(IPC_CHANNELS.GENAI_VAD_STATE, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.GENAI_VAD_STATE, handler);
  },

  /**
   * Listen for interruption events (user started speaking)
   * @returns Cleanup function to remove listener
   */
  onGenaiInterruption: (callback: () => void) => {
    const handler = () => {
      console.log('[Preload] 🛑 Interruption received');
      callback();
    };
    ipcRenderer.on(IPC_CHANNELS.GENAI_INTERRUPTION, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.GENAI_INTERRUPTION, handler);
  },

  // Voice mode switching
  /**
   * Set voice generation mode (Gemini native or ElevenLabs custom)
   * @param mode - 'gemini-native' or 'elevenlabs-custom'
   * @returns Promise<{ success: boolean; mode?: string; error?: string }>
   */
  setVoiceMode: (mode: 'gemini-native' | 'elevenlabs-custom') =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_VOICE_MODE, mode),

  /**
   * Get current voice generation mode
   * @returns Promise<{ mode: 'gemini-native' | 'elevenlabs-custom' }>
   */
  getVoiceMode: () =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_VOICE_MODE)
});

contextBridge.exposeInMainWorld('electron', {
  on: (channel: string, callback: (event: any, data: any) => void) => {
    const subscription = (_event: any, data: any) => callback(_event, data);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  },
  send: (channel: string, data?: any) => {
    ipcRenderer.send(channel, data);
  }
});

/**
 * TypeScript type definitions for the global `window.snugglesAPI` object.
 */
declare global {
  interface Window {
    snugglesAPI: {
      getAudioDevices: () => Promise<AudioDevice[]>;
      setAudioDevices: (inputId: string, outputId: string) => Promise<boolean>;
      connect: () => Promise<{ success: boolean; error?: string }>;
      disconnect: () => Promise<boolean>;
      sendMessage: (text: string) => Promise<boolean>;
      toggleMute: () => Promise<boolean>;
      resetAgent: () => Promise<boolean>;
      getStatus: () => Promise<{ connected: boolean; muted: boolean; devices: AudioDevice[] }>;
      searchKnowledge: (query: string) => Promise<any[]>;
      loadKnowledge: () => Promise<{ success: boolean; count: number }>;
      onVolumeUpdate: (callback: (data: VolumeData) => void) => () => void;
      onConnectionStatus: (callback: (status: ConnectionStatus) => void) => () => void;
      onMessageReceived: (callback: (message: ConversationTurn) => void) => () => void;
      // December 2025 Audio Streaming APIs
      genaiStartSession: (config?: any) => Promise<{ success: boolean; error?: string }>;
      genaiSendAudioChunk: (audioChunk: Float32Array) => Promise<number>;
      onGenaiAudioReceived: (callback: (audioData: Float32Array) => void) => () => void;
      onGenaiLatencyUpdate: (callback: (metrics: any) => void) => () => void;
      onGenaiVADState: (callback: (state: any) => void) => () => void;
      onGenaiInterruption: (callback: () => void) => () => void;
      // Voice mode switching
      setVoiceMode: (mode: 'gemini-native' | 'elevenlabs-custom') => Promise<{ success: boolean; mode?: string; error?: string }>;
      getVoiceMode: () => Promise<{ mode: 'gemini-native' | 'elevenlabs-custom' }>;
    };
  }
}
