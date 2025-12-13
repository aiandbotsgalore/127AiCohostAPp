/**
 * MAIN PROCESS - December 2025 Modernized
 *
 * Wires up the complete Echosphere AI system with:
 * - New GeminiLiveClient (16kHz audio, native-audio model)
 * - AudioManager2025 (volume monitoring)
 * - Knowledge store (Orama)
 * - IPC handlers for audio streaming
 * - Latency tracking
 */

const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
import type { BrowserWindow as BrowserWindowType, IpcMainEvent } from 'electron';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GeminiLiveClient } from './llm/geminiLiveClient';
import { Modality } from '@google/genai';
import { GeminiDiagnostics } from './llm/geminiDiagnostics';
import { AudioManager2025 } from './audio/audioManager2025';
import { ElevenLabsService } from './tts/elevenlabsService';

// 🔍 DEBUG: Capture all logs to file for analysis
const LOG_FILE = path.join(app.getPath('userData'), 'snuggles_debug.log');
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'w' });

function fileLog(level: string, ...args: any[]) {
  const msg = args.map(a => {
    if (a instanceof Error) {
      return `[ERROR: ${a.message}]\nStack: ${a.stack}`;
    }
    if (typeof a === 'object') {
      try {
        const json = JSON.stringify(a);
        if (json === '{}' && a !== null) {
          // Handle non-enumerable properties (like custom Errors)
          const keys = Object.getOwnPropertyNames(a);
          if (keys.length > 0) {
            return `{ ${keys.map(k => `${k}: ${String((a as any)[k])}`).join(', ')} }`;
          }
        }
        return json;
      } catch {
        return String(a);
      }
    }
    return String(a);
  }).join(' ');
  logStream.write(`[${new Date().toISOString()}] [${level}] ${msg}\n`);
}

// Hook into console
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => { fileLog('INFO', ...args); originalLog(...args); };
console.error = (...args) => { fileLog('ERROR', ...args); originalError(...args); };
console.warn = (...args) => { fileLog('WARN', ...args); originalWarn(...args); };

console.log(`[Main] 📝 Logging validation to: ${LOG_FILE}`);
import { KnowledgeStore } from './knowledge/store';
import { SessionMemoryService } from './memory/database';
import { DrSnugglesBrain } from '../brain/DrSnugglesBrain';
import { IPC_CHANNELS, AppConfig, LatencyMetrics } from '../shared/types';

// Load environment variables from .env.local in project root
// Use process.cwd() instead of __dirname to avoid dist/ path issues
const envPath = path.join(process.cwd(), '.env.local');
console.log(`[ENV] Loading .env from: ${envPath}`);
console.log(`[ENV] File exists: ${fs.existsSync(envPath)}`);

// Force override to ensure .env.local takes precedence over system env vars
dotenv.config({ path: envPath, override: true });

// Unset GOOGLE_API_KEY if it exists (to avoid SDK conflicts)
if (process.env.GOOGLE_API_KEY) {
  console.log('⚠️  Unsetting GOOGLE_API_KEY to avoid conflicts with GEMINI_API_KEY');
  delete process.env.GOOGLE_API_KEY;
}

// Lazy initialization - app.getPath('userData') is only available after app is ready
let CONFIG_PATH: string | null = null;
function getConfigPath(): string {
  if (!CONFIG_PATH) {
    CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');
  }
  return CONFIG_PATH;
}

const API_KEY = process.env.GEMINI_API_KEY || '';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'GuzPQFD9JSeGAgP09DOb'; // Custom voice (updated Dec 2025)

// PROOF OF LIFE: Show first 10 chars of API key to verify it loaded correctly
if (API_KEY) {
  console.log(`[ENV] ✅ API Key loaded: ${API_KEY.substring(0, 10)}...`);

  // 🔍 PRE-FLIGHT DIAGNOSTIC: Validate API key format immediately
  const diagnostics = new GeminiDiagnostics(API_KEY);
  const formatCheck = diagnostics.validateApiKeyFormat();
  if (!formatCheck.passed) {
    console.error(`[ENV] ⚠️ API Key format issue: ${formatCheck.message}`);
    if (formatCheck.suggestion) {
      console.error(`[ENV] 💡 ${formatCheck.suggestion}`);
    }
  }
} else {
  console.error('[ENV] ❌ API Key is EMPTY! Check your .env.local file');
}

console.log('DEBUG: app is', app);

/**
 * Configuration constants for AI behavior
 */
const EMOTION_LEVEL_THRESHOLDS = {
  LOW: 33,
  MEDIUM: 66,
  HIGH: 100
} as const;

const EMOTION_DESCRIPTORS = {
  LOW: 'reserved and measured',
  MEDIUM: 'moderately expressive',
  HIGH: 'highly expressive and dynamic'
} as const;

const VAD_SENSITIVITY_CONFIG = {
  Low: { rmsThreshold: 0.02, minSpeechFrames: 5 },
  Medium: { rmsThreshold: 0.01, minSpeechFrames: 3 },
  High: { rmsThreshold: 0.005, minSpeechFrames: 2 }
} as const;

/**
 * The main application class for Dr. Snuggles (2025 Edition).
 *
 * This modernized version integrates the new Gemini Live Client, advanced audio management,
 * and enhanced knowledge storage features. It handles the complete lifecycle of the Electron
 * application and manages IPC communication between the main and renderer processes.
 */
class SnugglesApp2025 {
  private mainWindow: BrowserWindowType | null = null;
  private audioManager: AudioManager2025;
  private geminiLiveClient: GeminiLiveClient;
  private elevenLabsService: ElevenLabsService;
  private knowledgeStore: KnowledgeStore;
  private sessionMemory: SessionMemoryService;
  private brain: DrSnugglesBrain; // Brain integration
  private config: AppConfig;
  private latencyMetrics: LatencyMetrics[] = [];
  private useCustomVoice: boolean = true; // Toggle for ElevenLabs
  private voiceTestTimeout: NodeJS.Timeout | null = null; // Cleanup for voice test disconnect

  /**
   * Initializes the SnugglesApp2025.
   *
   * Sets up audio manager, Gemini client with brain, knowledge store.
   * IPC handlers and config are set up after app is ready.
   */
  constructor() {
    // Note: config is loaded in initialize() after app.whenReady()
    this.config = {
      inputDeviceId: null,
      outputDeviceId: null,
      apiKey: API_KEY,
      lastUsed: Date.now()
    };

    // Initialize brain FIRST
    console.log('🧠 Initializing Dr. Snuggles Brain...');
    this.brain = new DrSnugglesBrain({
      apiKey: API_KEY,
    });

    this.audioManager = new AudioManager2025();
    // Pass brain to Gemini Live Client
    this.geminiLiveClient = new GeminiLiveClient(API_KEY, this.brain);
    // Initialize ElevenLabs for custom voice
    this.elevenLabsService = new ElevenLabsService(ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, 'eleven_flash_v2_5');
    this.knowledgeStore = new KnowledgeStore();
    this.sessionMemory = new SessionMemoryService();

    // Note: setupIPC() and setupGeminiEventHandlers() are called in initialize() after app.whenReady()
  }

  /**
   * Loads the application configuration from the user data directory.
   *
   * @returns {AppConfig} The loaded configuration or default values.
   */
  private loadConfig(): AppConfig {
    try {
      const configPath = getConfigPath();
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }

    return {
      inputDeviceId: null,
      outputDeviceId: null,
      apiKey: API_KEY,
      lastUsed: Date.now()
    };
  }

  /**
   * Saves the current application configuration to the user data directory.
   */
  private saveConfig(): void {
    try {
      fs.writeFileSync(getConfigPath(), JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  /**
   * Safely send text to Gemini with error handling.
   * Wraps sendText() calls to prevent uncaught errors and notify the UI on failure.
   *
   * @param {string} text - The text to send to Gemini.
   * @param {string} [context=''] - Context description for logging.
   * @returns {Promise<boolean>} True if sent successfully, false otherwise.
   */
  private async safeSendText(text: string, context: string = ''): Promise<boolean> {
    try {
      await this.geminiLiveClient.sendText(text);
      return true;
    } catch (error) {
      const errorMsg = `Failed to send ${context || 'text'}`;
      console.error(`[Main] ❌ ${errorMsg}:`, error);
      this.mainWindow?.webContents.send(IPC_CHANNELS.CONNECTION_STATUS, {
        connected: false,
        connecting: false,
        error: `${errorMsg}. Check connection.`
      });
      return false;
    }
  }

  /**
   * Sets up event handlers for the Gemini Live Client.
   *
   * Handles connection events (connected, disconnected, reconnecting),
   * audio reception, and errors. Updates the renderer process via IPC.
   */
  private setupGeminiEventHandlers(): void {
    // Connected
    this.geminiLiveClient.on('connected', () => {
      console.log('[Main] ✅ Gemini connected');
      this.mainWindow?.webContents.send(IPC_CHANNELS.CONNECTION_STATUS, {
        connected: true,
        connecting: false,
        error: null
      });
    });

    // Disconnected
    this.geminiLiveClient.on('disconnected', (reason) => {
      console.log(`[Main] ❌ Gemini disconnected: ${reason}`);
      this.mainWindow?.webContents.send(IPC_CHANNELS.CONNECTION_STATUS, {
        connected: false,
        connecting: false,
        error: reason
      });
    });

    // Interruption (User started speaking)
    this.geminiLiveClient.on('interruption', () => {
      console.log('[Main] 🛑 Interruption detected. Signaling renderer to stop playback.');
      this.mainWindow?.webContents.send(IPC_CHANNELS.GENAI_INTERRUPTION);
    });

    // Audio received
    this.geminiLiveClient.on('audioReceived', (audioData, latencyMs) => {
      // Process audio (volume calculation)
      const processedAudio = this.audioManager.processOutputAudio(audioData);

      // Forward to renderer for playback
      // ONLY forward if using Gemini voice (native audio)
      // If using custom voice, we rely on ElevenLabs service to send audio
      if (!this.useCustomVoice) {
        this.mainWindow?.webContents.send(IPC_CHANNELS.GENAI_AUDIO_RECEIVED, processedAudio);
      }

      // Track latency
      const metrics: LatencyMetrics = {
        audioUpload: 0, // Set when sending
        geminiProcessing: latencyMs,
        audioDownload: 0, // Negligible
        totalRoundtrip: latencyMs,
        timestamp: Date.now()
      };
      this.latencyMetrics.push(metrics);
      this.mainWindow?.webContents.send(IPC_CHANNELS.GENAI_LATENCY_UPDATE, metrics);

      console.log(`[Main] 📊 Total latency: ${latencyMs.toFixed(2)}ms`);
      console.log(`[Main] 📊 Total latency: ${latencyMs.toFixed(2)}ms`);
    });

    // User Transcription (What the user said)
    this.geminiLiveClient.on('userTranscription', (transcription, timestamp) => {
      console.log(`[Main] 🎤 User said: ${transcription}`);
      this.mainWindow?.webContents.send(IPC_CHANNELS.MESSAGE_RECEIVED, {
        id: crypto.randomUUID(),
        timestamp: timestamp,
        role: 'user',
        text: transcription
      });
    });

    // Text message received
    this.geminiLiveClient.on('message', async (message) => {
      console.log(`[Main] 📝 Text received: ${message.text.substring(0, 50)}...`);
      this.mainWindow?.webContents.send(IPC_CHANNELS.MESSAGE_RECEIVED, message);

      // Use ElevenLabs for custom voice synthesis
      if (this.useCustomVoice && message.role === 'assistant') {
        try {
          console.log('[Main] 🎙️ Synthesizing with ElevenLabs custom voice...');
          const audioData = await this.elevenLabsService.textToSpeech(message.text);

          // Forward custom voice audio to renderer
          this.mainWindow?.webContents.send(IPC_CHANNELS.GENAI_AUDIO_RECEIVED, audioData);
          console.log('[Main] ✅ Custom voice audio sent to renderer');
        } catch (error) {
          console.error('[Main] ⚠️ ElevenLabs TTS failed, falling back to Gemini voice:', error);
          // Fallback handled automatically - Gemini will still speak if audio mode is enabled
        }
      }
    });

    // Error
    this.geminiLiveClient.on('error', (error) => {
      console.error('[Main] ⚠️ Gemini error:', error);
      this.mainWindow?.webContents.send(IPC_CHANNELS.CONNECTION_STATUS, {
        connected: false,
        connecting: false,
        error: error.message
      });
    });

    // Reconnecting
    this.geminiLiveClient.on('reconnecting', (attempt, delayMs) => {
      console.log(`[Main] 🔄 Reconnecting... (attempt ${attempt}, delay ${delayMs}ms)`);
      this.mainWindow?.webContents.send(IPC_CHANNELS.CONNECTION_STATUS, {
        connected: false,
        connecting: true,
        error: `Reconnecting (attempt ${attempt})...`
      });
    });

    // Text for TTS (ElevenLabs custom voice mode)
    this.geminiLiveClient.on('textForTTS', async (text) => {
      console.log('[Main] 🎙️ textForTTS received, converting with ElevenLabs...');
      try {
        const audioBuffer = await this.elevenLabsService.textToSpeech(text);
        // Convert MP3 buffer to format that renderer can play
        // The audioPlaybackService can handle MP3/encoded audio
        this.mainWindow?.webContents.send(IPC_CHANNELS.GENAI_AUDIO_RECEIVED, audioBuffer);
        console.log('[Main] ✅ ElevenLabs audio sent to renderer');
      } catch (error) {
        console.error('[Main] ❌ ElevenLabs TTS failed:', error);
      }
    });
  }

  /**
   * Sets up Inter-Process Communication (IPC) handlers.
   *
   * Registers handlers for audio device management, Gemini session control,
   * audio streaming, and legacy support.
   */
  private setupIPC(): void {
    // ===== Audio Device Management =====
    ipcMain.handle(IPC_CHANNELS.GET_AUDIO_DEVICES, async () => {
      return this.audioManager.getDevices();
    });

    ipcMain.handle(IPC_CHANNELS.SET_AUDIO_DEVICES, async (_: any, inputId: string, outputId: string) => {
      try {
        this.config.inputDeviceId = inputId;
        this.config.outputDeviceId = outputId;
        this.saveConfig();
        await this.audioManager.setDevices(inputId, outputId);
        return true;
      } catch (error: any) {
        console.error('[Main] ❌ Failed to set audio devices:', error);
        return false;
      }
    });

    // ===== December 2025 Gemini Live Streaming =====

    /**
     * Start Gemini Live session
     */
    ipcMain.handle(IPC_CHANNELS.GENAI_START_SESSION, async (_: any, config: any) => {
      try {
        console.log('[Main] 🎙️ Starting Gemini Live session...');

        const sessionSummaries = await this.getRecentSummaries(3);
        const knowledgeContext = await this.knowledgeStore.getSystemContext();

        await this.geminiLiveClient.connect({
          sessionSummaries,
          knowledgeContext,
          responseModalities: this.useCustomVoice ? [Modality.TEXT] : undefined,
          ...config
        });

        return { success: true };
      } catch (error: any) {
        console.error('[Main] ❌ Session start failed:', error);
        return { success: false, error: error.message };
      }
    });

    /**
     * Send audio chunk to Gemini
     * Renderer sends 48kHz Float32, we convert to 16kHz PCM16
     */
    ipcMain.handle(IPC_CHANNELS.GENAI_SEND_AUDIO_CHUNK, async (_: any, audioChunk: Float32Array) => {
      try {
        const startTime = performance.now();

        // Process input audio (volume monitoring)
        this.audioManager.processInputAudio(audioChunk);

        // Send to Gemini (handles 16kHz conversion internally)
        await this.geminiLiveClient.sendAudio(audioChunk);

        const totalTime = performance.now() - startTime;

        // Emit VAD state periodically
        const vadState = this.geminiLiveClient.getVADState();
        this.mainWindow?.webContents.send(IPC_CHANNELS.GENAI_VAD_STATE, vadState);

        return totalTime;
      } catch (error: any) {
        console.error('[Main] ❌ Send audio failed:', error);
        return -1;
      }
    });

    // ===== Legacy Handlers (for backward compatibility) =====

    ipcMain.handle(IPC_CHANNELS.CONNECT_GEMINI, async () => {
      try {
        const sessionSummaries = await this.getRecentSummaries(3);
        const knowledgeContext = await this.knowledgeStore.getSystemContext();
        await this.geminiLiveClient.connect({ sessionSummaries, knowledgeContext });
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle(IPC_CHANNELS.DISCONNECT_GEMINI, async () => {
      await this.geminiLiveClient.disconnect();
      return true;
    });

    ipcMain.handle(IPC_CHANNELS.SEND_MESSAGE, async (_event: any, text: string) => {
      // Note: GeminiLiveClient is audio-only, text messages are not supported
      console.log('[Main] Text message received (audio-only mode):', text);
      return true;
    });

    ipcMain.handle(IPC_CHANNELS.TOGGLE_MUTE, async () => {
      this.audioManager.toggleMute();
      return this.audioManager.isMuted();
    });

    ipcMain.handle(IPC_CHANNELS.GET_STATUS, async () => {
      return {
        connected: this.geminiLiveClient.connected,
        muted: this.audioManager.isMuted(),
        devices: await this.audioManager.getDevices()
      };
    });

    ipcMain.handle(IPC_CHANNELS.RESET_AGENT, async () => {
      try {
        await this.geminiLiveClient.disconnect();
        await new Promise(resolve => setTimeout(resolve, 1000));
        const sessionSummaries = await this.getRecentSummaries(3);
        const knowledgeContext = await this.knowledgeStore.getSystemContext();
        await this.geminiLiveClient.connect({ sessionSummaries, knowledgeContext });
        return true;
      } catch (error: any) {
        console.error('[Main] ❌ Failed to reset agent:', error);
        return false;
      }
    });

    ipcMain.handle(IPC_CHANNELS.SEARCH_KNOWLEDGE, async (_: any, query: string) => {
      try {
        return this.knowledgeStore.search(query);
      } catch (error: any) {
        console.error('[Main] ❌ Knowledge search failed:', error);
        return [];
      }
    });

    ipcMain.handle(IPC_CHANNELS.LOAD_KNOWLEDGE, async () => {
      try {
        const knowledgeDir = path.join(__dirname, '../../knowledge');
        await this.knowledgeStore.loadDocuments(knowledgeDir);
        return { success: true, count: await this.knowledgeStore.getDocumentCount() };
      } catch (error: any) {
        console.error('[Main] ❌ Failed to load knowledge:', error);
        return { success: false, count: 0, error: error.message };
      }
    });

    // ===== GUI Handlers (December 2025) =====

    ipcMain.on('stream:toggle', async (_event: IpcMainEvent, isLive: boolean) => {
      try {
        console.log(`[Main] 🎚️ stream:toggle: ${isLive}`);
        if (isLive) {
          const sessionSummaries = await this.getRecentSummaries(3);
          const knowledgeContext = await this.knowledgeStore.getSystemContext();
          await this.geminiLiveClient.connect({
            sessionSummaries,
            knowledgeContext,
            // If using custom voice, explicitly request TEXT modality only (saves bandwidth/avoids double-talk)
            // If using Gemini voice, default to AUDIO (managed by client)
            responseModalities: this.useCustomVoice ? [Modality.TEXT] : undefined
          });
        } else {
          await this.geminiLiveClient.disconnect();
        }
      } catch (error: any) {
        console.error('[Main] ❌ Stream toggle failed:', error);
      }
    });

    ipcMain.on('voice:select', async (_event: IpcMainEvent, voice: string) => {
      try {
        console.log(`[Main] 🗣️ voice:select: ${voice}`);
        this.geminiLiveClient.setVoice(voice);
        // Auto-reconnect if already connected to apply voice change
        if (this.geminiLiveClient.connected) {
          console.log(`[Main] 🔄 Reconnecting to apply voice change...`);
          await this.geminiLiveClient.disconnect();
          const sessionSummaries = await this.getRecentSummaries(3);
          const knowledgeContext = await this.knowledgeStore.getSystemContext();
          await this.geminiLiveClient.connect({ sessionSummaries, knowledgeContext });
        }
      } catch (error: any) {
        console.error('[Main] ❌ Voice select failed:', error);
      }
    });

    ipcMain.on('voice:test', async (_event: IpcMainEvent, voice: string) => {
      console.log(`[Main] 🗣️ voice:test: ${voice}`);
      // Set the voice
      this.geminiLiveClient.setVoice(voice);

      // Connect if not already connected, send test message, then disconnect
      const wasConnected = this.geminiLiveClient.connected;

      try {
        if (!wasConnected) {
          console.log(`[Main] 🔌 Connecting for voice test...`);
          await this.geminiLiveClient.connect({});
        }

        // Send a short test phrase
        await this.geminiLiveClient.sendText("Hello! This is a voice test. How do I sound?");

        // If we weren't connected before, disconnect after a delay to let the response play
        if (!wasConnected) {
          // Clear any existing voice test timeout
          if (this.voiceTestTimeout) {
            clearTimeout(this.voiceTestTimeout);
          }
          // Store timeout ID for cleanup
          this.voiceTestTimeout = setTimeout(async () => {
            console.log(`[Main] 🔌 Disconnecting after voice test...`);
            await this.geminiLiveClient.disconnect();
            this.voiceTestTimeout = null;
          }, 10000); // Wait 10 seconds for response
        }
      } catch (error) {
        console.error(`[Main] ❌ Voice test failed:`, error);
      }
    });

    // Voice mode switching (Gemini native vs ElevenLabs custom)
    ipcMain.handle(IPC_CHANNELS.SET_VOICE_MODE, async (_event: any, mode: 'gemini-native' | 'elevenlabs-custom') => {
      console.log(`[Main] 🎙️ SET_VOICE_MODE: ${mode}`);
      try {
        await this.geminiLiveClient.setVoiceMode(mode);
        return { success: true, mode };
      } catch (error: any) {
        console.error(`[Main] ❌ Failed to set voice mode:`, error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle(IPC_CHANNELS.GET_VOICE_MODE, async () => {
      const mode = this.geminiLiveClient.getVoiceMode();
      console.log(`[Main] 🎙️ GET_VOICE_MODE: ${mode}`);
      return { mode };
    });

    ipcMain.on('voice:style', async (_event: IpcMainEvent, styleConfig: { style: string, pace: string, tone: string, accent: string }) => {
      console.log(`[Main] 🎭 voice:style:`, styleConfig);
      // Build voice style instruction
      const styleInstruction = `[Voice Direction: Speak in a ${styleConfig.style} style, with a ${styleConfig.pace} pace, ${styleConfig.tone} tone, and ${styleConfig.accent} accent.]`;
      console.log(`[Main] 📝 Injecting style prompt: ${styleInstruction}`);
      // Send as context injection to influence the next response
      await this.safeSendText(styleInstruction, 'voice style directive');
    });

    ipcMain.on('audio:set-volume', (_event: IpcMainEvent, volumeRaw: number) => {
      this.audioManager.setOutputVolume(volumeRaw);
    });

    ipcMain.on('audio:mute', (_event: IpcMainEvent, muted: boolean) => {
      console.log(`[Main] 🔇 audio:mute: ${muted}`);
      if (muted !== this.audioManager.isMuted()) {
        this.audioManager.toggleMute();
      }
    });

    ipcMain.on('audio:mic-mute', (_event: IpcMainEvent, muted: boolean) => {
      console.log(`[Main] 🎤 audio:mic-mute: ${muted}`);
      this.audioManager.setInputMuted(muted);
    });

    ipcMain.on('audio:interrupt', async () => {
      console.log(`[Main] 🛑 audio:interrupt`);
      await this.safeSendText(" ", 'interrupt signal');
    });

    ipcMain.on('brain:thinking-mode', async (_event: IpcMainEvent, enabled: boolean) => {
      console.log(`[Main] 🧠 brain:thinking-mode: ${enabled}`);
      // Inject thinking mode directive to Gemini
      if (enabled) {
        const thinkingPrompt = '[DIRECTIVE] Take time to think through your response before speaking. Consider multiple perspectives and implications.';
        await this.safeSendText(thinkingPrompt, 'thinking mode directive');
      } else {
        const fastPrompt = '[DIRECTIVE] Respond quickly and naturally without overthinking. Be spontaneous.';
        await this.safeSendText(fastPrompt, 'fast response directive');
      }
    });

    ipcMain.on('brain:thinking-budget', async (_event: IpcMainEvent, budget: number) => {
      console.log(`[Main] 🧠 brain:thinking-budget: ${budget}`);
      // Inject token budget directive
      const budgetPrompt = `[DIRECTIVE] Aim for responses of approximately ${budget} tokens or ${Math.floor(budget / 2)} words.`;
      await this.safeSendText(budgetPrompt, 'thinking budget directive');
    });

    ipcMain.on('voice:emotion', async (_event: IpcMainEvent, value: number) => {
      console.log(`[Main] 🎭 voice:emotion: ${value}`);
      // Map value (0-100) to emotional range descriptor using config constants
      let emotionLevel: string;
      if (value < EMOTION_LEVEL_THRESHOLDS.LOW) {
        emotionLevel = EMOTION_DESCRIPTORS.LOW;
      } else if (value >= EMOTION_LEVEL_THRESHOLDS.MEDIUM) {
        emotionLevel = EMOTION_DESCRIPTORS.HIGH;
      } else {
        emotionLevel = EMOTION_DESCRIPTORS.MEDIUM;
      }

      const emotionPrompt = `[Voice Direction] Speak with ${emotionLevel} emotional range. ${value > 50 ? 'Use varied intonation and enthusiasm.' : 'Maintain professional composure.'}`;
      await this.safeSendText(emotionPrompt, 'emotion directive');
    });

    ipcMain.on('audio:vad-sensitivity', (_event: IpcMainEvent, sensitivity: string) => {
      console.log(`[Main] 🎚️ audio:vad-sensitivity: ${sensitivity}`);
      // Map sensitivity levels to VAD thresholds using config constants
      const config = VAD_SENSITIVITY_CONFIG[sensitivity as keyof typeof VAD_SENSITIVITY_CONFIG] || VAD_SENSITIVITY_CONFIG.Medium;

      try {
        // Apply the configuration to the VAD
        this.geminiLiveClient.updateVADConfig(config);
        console.log(`[Main] ✅ VAD config applied:`, config);
      } catch (error) {
        console.error(`[Main] ❌ Failed to update VAD config:`, error);
      }
    });

    ipcMain.on('audio:can-interrupt', async (_event: IpcMainEvent, canInterrupt: boolean) => {
      console.log(`[Main] 🛑 audio:can-interrupt: ${canInterrupt}`);
      // Control whether user can interrupt AI speech
      if (canInterrupt) {
        const interruptPrompt = '[DIRECTIVE] Allow natural conversation flow. If interrupted, stop speaking immediately and listen.';
        await this.safeSendText(interruptPrompt, 'can-interrupt directive');
      } else {
        const noInterruptPrompt = '[DIRECTIVE] Complete your thoughts fully before yielding the floor. Finish your responses.';
        await this.safeSendText(noInterruptPrompt, 'no-interrupt directive');
      }
    });

    ipcMain.on('audio:listening-sensitivity', (_event: IpcMainEvent, sensitivity: string) => {
      console.log(`[Main] 👂 audio:listening-sensitivity: ${sensitivity}`);
      // Adjust microphone gain threshold (conceptual - actual gain is handled by browser)
      // This could affect how we process input audio or VAD thresholds
      const sensitivityPrompt = `[DIRECTIVE] Microphone sensitivity set to ${sensitivity}. ${sensitivity === 'High' ? 'Listen carefully for quiet speech.' :
        sensitivity === 'Medium' ? 'Standard listening mode.' :
          'Focus on clear, strong audio signals.'
        }`;
      console.log(`[Main] 📝 ${sensitivityPrompt}`);
      // Note: This is primarily a UI indicator; actual audio processing happens in renderer
    });

    ipcMain.on('avatar:action', (_event: IpcMainEvent, action: string) => {
      console.log(`[Main] 🐻 avatar:action: ${action}`);
    });

    ipcMain.on('context:inject', async (_event: IpcMainEvent, text: string) => {
      console.log(`[Main] 💉 context:inject: ${text}`);
      await this.safeSendText(text, 'context injection');
    });

    ipcMain.on('log:message', (_event: IpcMainEvent, { level, args }: { level: string, args: any[] }) => {
      console.log(`[Renderer][${level.toUpperCase()}]`, ...args);
    });

    ipcMain.on('system:update-prompt', async (_event: IpcMainEvent, prompt: string) => {
      console.log(`[Main] 📝 system:update-prompt received`);
      console.log(`[Main] 📝 Updating Brain system instruction...`);

      // 1. Update the brain's persistent system instruction
      this.brain.updateSystemInstruction(prompt);

      // 2. Reconnect to apply the new persona silently (without it being a user message)
      if (this.geminiLiveClient.connected) {
        console.log(`[Main] 🔄 Reconnecting to apply new system prompt...`);

        // Notify user via UI log if possible (optional)
        // this.mainWindow?.webContents.send(IPC_CHANNELS.LOG_MESSAGE, { level: 'info', args: ['Applying new system prompt...'] });

        await this.geminiLiveClient.disconnect();

        // Short delay to ensure clean disconnect
        await new Promise(resolve => setTimeout(resolve, 500));

        const sessionSummaries = await this.getRecentSummaries(3);
        const knowledgeContext = await this.knowledgeStore.getSystemContext();

        await this.geminiLiveClient.connect({
          sessionSummaries,
          knowledgeContext,
          // Maintain the correct modality setting
          responseModalities: this.useCustomVoice ? [Modality.TEXT] : undefined
        });

        console.log(`[Main] ✅ System prompt applied and session restarted`);
      } else {
        console.log(`[Main] ✅ System prompt updated (will apply on next connection)`);
      }
    });

    // Forward volume updates
    this.audioManager.on('volumeUpdate', (data) => {
      this.mainWindow?.webContents.send(IPC_CHANNELS.VOLUME_UPDATE, data);
    });
  }

  /**
   * Retrieves recent session summaries.
   *
   * @param {number} count - The number of summaries to retrieve.
   * @returns {Promise<string[]>} A promise resolving to an array of summaries.
   */
  private async getRecentSummaries(count: number): Promise<string[]> {
    try {
      return await this.sessionMemory.getRecentSummaries(count);
    } catch (error) {
      console.error('[Main] Failed to retrieve summaries:', error);
      return [];
    }
  }

  /**
   * Creates the main browser window for the application.
   *
   * Configures window properties, loads the renderer (Vite dev server or built files),
   * and initializes the knowledge base.
   *
   * @returns {Promise<void>}
   */
  async createWindow(): Promise<void> {
    // Debug preload path
    const preloadPath = path.join(__dirname, 'preload.js');
    console.log('[Main] __dirname:', __dirname);
    console.log('[Main] Preload path:', preloadPath);
    console.log('[Main] Preload exists:', fs.existsSync(preloadPath));

    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: preloadPath
      },
      title: 'Dr. Snuggles - Echosphere AI (Dec 2025)',
      icon: path.join(__dirname, '../../public/icon.png')
    });

    // Load renderer
    // Check if Vite dev server is running (always in dev mode for npm run dev)
    const isDev = !app.isPackaged;
    const rendererIndex = path.join(__dirname, '../../renderer/index.html');

    if (isDev) {
      // Try multiple ports since Vite may use an alternate if 5173 is in use
      const ports = [5173, 5174, 5175, 5176];
      console.log('[Main] Loading from Vite dev server...');
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      const tryPort = async (port: number): Promise<boolean> => {
        try {
          await this.mainWindow?.loadURL(`http://localhost:${port}`);
          this.mainWindow?.webContents.openDevTools();

          // Forward renderer console logs to terminal
          this.mainWindow?.webContents.on('console-message', (_event, level, message, line, sourceId) => {
            const levelMap: { [key: number]: string } = { 0: 'LOG', 1: 'WARN', 2: 'ERROR' };
            const levelStr = levelMap[level] || 'INFO';
            console.log(`[RENDERER ${levelStr}] ${message} (${sourceId}:${line})`);
          });

          console.log(`[Main] ✅ Connected to Vite dev server on port ${port}`);
          return true;
        } catch (err: any) {
          return false;
        }
      };

      const loadWithRetry = async (retries = 5, delay = 2000): Promise<boolean> => {
        // Try each port
        for (const port of ports) {
          if (await tryPort(port)) return true;
        }

        if (retries > 0) {
          console.log(`[Main] ⏳ Waiting for Vite dev server... (${retries} retries left)`);
          await wait(delay);
          return loadWithRetry(retries - 1, delay);
        } else {
          console.error('[Main] ❌ Failed to load Vite dev server on any port');
          return false;
        }
      };

      const loadedDevServer = await loadWithRetry();

      if (!loadedDevServer && this.mainWindow) {
        console.log('[Main] Falling back to built renderer assets');
        try {
          await this.mainWindow.loadFile(rendererIndex);
        } catch (fallbackError: any) {
          console.error('[Main] ❌ Fallback to built renderer failed:', fallbackError.message);
        }
      }
    } else {
      console.log('[Main] Loading from built files');
      try {
        if (this.mainWindow) {
          await this.mainWindow.loadFile(rendererIndex);
        }
      } catch (e: any) {
        console.error('[Main] ❌ Failed to load built files:', e.message);
      }
    }

    if (this.mainWindow) {
      this.mainWindow.on('closed', () => {
        this.mainWindow = null;
      });
    }

    // Auto-load knowledge base
    const knowledgeDir = path.join(__dirname, '../../knowledge');
    try {
      await this.knowledgeStore.loadDocuments(knowledgeDir);
      console.log('[Main] ✅ Knowledge base loaded');
    } catch (error) {
      console.error('[Main] ⚠️ Knowledge base load failed:', error);
    }
  }

  /**
   * Initializes the application.
   *
   * Waits for the app to be ready, creates the window, and sets up global app event listeners.
   *
   * @returns {Promise<void>}
   */
  async initialize(): Promise<void> {
    await app.whenReady();

    // Initialize brain memory after app is ready
    console.log('🧠 Initializing brain memory...');
    await this.brain.initializeMemory();
    console.log('✅ Brain memory initialized');

    // Load config after app is ready (app.getPath requires app to be ready)
    this.config = this.loadConfig();

    // Set up IPC handlers after app is ready
    this.setupIPC();
    this.setupGeminiEventHandlers();

    console.log('='.repeat(60));
    console.log('🚀 ECHOSPHERE AI - DECEMBER 2025 EDITION');
    console.log('='.repeat(60));
    console.log('✅ New @google/genai SDK v1.30.0+');
    console.log('✅ Native-audio model: gemini-2.5-flash-native-audio-preview');
    console.log('✅ Audio: 16kHz upstream, 24kHz downstream');
    console.log('✅ Voice Activity Detection enabled');
    console.log('✅ Exponential backoff reconnection');
    console.log('✅ Latency tracking active');
    console.log('🧠 AI Brain: ACTIVE (RAG + Personality + Memory)');
    console.log('='.repeat(60));

    await this.createWindow();

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('before-quit', () => {
      // Clean up any pending timeouts
      if (this.voiceTestTimeout) {
        clearTimeout(this.voiceTestTimeout);
        this.voiceTestTimeout = null;
      }
    });

    app.on('activate', () => {
      if (this.mainWindow === null) {
        this.createWindow();
      }
    });
  }
}

// Bootstrap
const snugglesApp = new SnugglesApp2025();
snugglesApp.initialize().catch(console.error);
