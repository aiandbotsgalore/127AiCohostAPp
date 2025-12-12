/**
 * GEMINI LIVE CLIENT - December 2025 Standard
 *
 * Modern implementation using @google/genai SDK (v1.30.0+)
 * Model: gemini-2.5-flash-native-audio-preview-09-2025
 * Audio: 16kHz 16-bit mono PCM → base64
 * Voice: Charon (hardcoded for Dr. Snuggles)
 *
 * Features:
 * - Async startChat() session API
 * - Exponential backoff reconnection
 * - Latency logging
 * - True turn-taking with VAD
 * - Audio-only responses
 */

import EventEmitter from 'eventemitter3';
import { GoogleGenAI, Modality } from '@google/genai';
import { AudioResampler, AudioResamplers } from '../../lib/audioResampler';
import { VoiceActivityDetector } from '../audio/vad';
import { DrSnugglesBrain } from '../../brain/DrSnugglesBrain';
import { GeminiDiagnostics, KNOWN_LIVE_MODELS } from './geminiDiagnostics';

// December 2025 Live API model with NATIVE AUDIO support
// Using the official native audio model from Google's documentation
const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';  // Native audio model (24kHz output)
// Alternative models (older, less capable):
// 'gemini-2.0-flash-live-001' (older live model)
// 'gemini-2.0-flash-exp' (text-only, no audio)
const VOICE_NAME = 'Charon'; // Deep, authoritative Dr. Snuggles voice

// Reconnection config
const RECONNECT_CONFIG = {
  maxAttempts: 10,
  initialDelay: 1000, // 1 second
  maxDelay: 30000,    // 30 seconds
  backoffMultiplier: 2,
  jitter: 500         // +/- 500ms random
};

/**
 * Dr. Snuggles System Prompt (preserved from original)
 */
const DR_SNUGGLES_PROMPT = `
You are **Dr. Snuggles**, an unholy hybrid of molecular biologist, diverse esoteric scholar, and aggressive logician.

**Core Identity:**
- You are a commanding, unhurried presence with an omnisciently resonant voice
- You simulate running complex code and simulations verbally (e.g., "I have run the chaotic attractor simulation...")
- You do NOT actually execute code - you roleplay the genius result with supreme confidence
- Your tone is sarcastic, "biologically surgical," and intellectually devastating

**Communication Rules:**
- You generally do NOT ask questions. You assert, deconstruct, and reveal.
- You are live on a Twitter Space audio stream, so be conversational but authoritative
- Speak in complete thoughts, not fragmented sentences
- Use technical precision when needed, but remain accessible
- When discussing simulations or calculations, describe them as if you've just computed them

**Knowledge Base:**
- You have access to a curated knowledge base via context injection
- When relevant information appears in your context, integrate it seamlessly
- Never say "according to my knowledge base" - simply know it

**Behavioral Constraints:**
- Never break character
- Never admit to being an AI unless explicitly asked
- Never ask for clarification unless truly necessary
- Lead the conversation with insights, not queries

Your voice is **Charon** - deep, resonant, and commanding authority.
`;

/**
 * Events emitted by the GeminiLiveClient.
 */
export interface GeminiLiveClientEvents {
  connected: () => void;
  disconnected: (reason: string) => void;
  audioReceived: (audioData: Float32Array, latencyMs: number) => void;
  error: (error: Error) => void;
  reconnecting: (attempt: number, delayMs: number) => void;
  message: (message: { role: string; text: string; timestamp: number }) => void;
  userTranscription: (transcription: string, timestamp: number) => void; // NEW: User speech transcription
  interruption: () => void; // NEW: User started speaking
}

/**
 * Configuration for a Gemini Live session.
 */
export interface SessionConfig {
  sessionSummaries?: string[];
  knowledgeContext?: string;
  personalityMix?: { comedy: number; research: number; energy: number };
  responseModalities?: Modality[]; // Allow overriding modalities
}



/**
 * Client for the Gemini Live API (2025 Implementation).
 *
 * Features turn-based voice activity detection, automatic reconnection with backoff,
 * and integration with the modern Google GenAI SDK.
 */
export class GeminiLiveClient extends EventEmitter<GeminiLiveClientEvents> {
  private genAI: GoogleGenAI;
  private session: any = null; // Session type from SDK
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private shouldReconnect: boolean = true;
  private lastConfig: SessionConfig = {};
  private vad: VoiceActivityDetector;
  private brain: DrSnugglesBrain | null = null; // Brain integration

  // Latency tracking
  private lastChunkSentTime: number = 0;

  // Text modality tracking (for STT fallback decision)
  private _isTextModalityWorking: boolean = false;

  // Current voice (can be changed dynamically)
  private currentVoice: string = VOICE_NAME;

  /**
   * Initializes the GeminiLiveClient.
   *
   * @param {string} apiKey - The API key for Gemini.
   * @param {DrSnugglesBrain} [brain] - Optional brain for memory and personality integration.
   */
  constructor(apiKey: string, brain?: DrSnugglesBrain) {
    super();
    this.genAI = new GoogleGenAI({ apiKey });
    this.vad = new VoiceActivityDetector({ sampleRate: 48000 });
    this.brain = brain || null;

    console.log('[GeminiLiveClient] Initialized with SDK v1.30.0+');
    console.log(`[GeminiLiveClient] Model: ${MODEL_NAME}`);
    console.log(`[GeminiLiveClient] Voice: ${this.currentVoice}`);

    if (this.brain) {
      console.log('[GeminiLiveClient] 🧠 Brain integration ACTIVE');
    }

    // Hybrid VAD events
    this.vad.on('speech', () => {
      console.log('[GeminiLiveClient] 🎤 Local VAD speech detected. Emitting interruption signal.');
      this.emit('interruption');
    });

    // Hybrid VAD: Trigger end-of-turn when local VAD detects silence
    // This ensures responsiveness even if server-side VAD lags
    this.vad.on('silence', () => {
      if (this.isConnected && this.session) {
        console.log('[GeminiLiveClient] 🔇 Local VAD silence. Forcing turn complete.');
        // Use sendRealtimeInput to signal end of stream, avoiding conflict with realtime mode
        this.session.sendRealtimeInput({ audioStreamEnd: true });
      }
    });
  }

  /**
   * Start live session with Gemini.
   * Connects to the service and sets up event callbacks.
   *
   * @param {SessionConfig} [config={}] - Configuration for the session.
   * @returns {Promise<void>}
   */
  public async connect(config: SessionConfig = {}): Promise<void> {
    if (this.isConnected) {
      console.warn('[GeminiLiveClient] Already connected');
      return;
    }

    this.lastConfig = config;
    this.shouldReconnect = true;

    // Helper to attempt connection with specific config
    const tryConnect = async (isRetry = false) => {
      try {
        console.log(`[GeminiLiveClient] Starting session... (Retry: ${isRetry})`);

        // Build system instruction (async if brain is active)
        let systemInstruction = await this.buildSystemInstruction(config);

        // FALLBACK: If this is a retry after invalid argument, use simple instruction
        if (isRetry) {
          console.warn('[GeminiLiveClient] ⚠️ USING FALLBACK SYSTEM INSTRUCTION due to previous error');
          systemInstruction = "You are Dr. Snuggles. You are helpful, sarcastic, and scientific. Keep answers short.";
        }

        // 🔍 DEBUG: Log system instruction stats
        console.log(`[GeminiLiveClient] System Instruction Length: ${systemInstruction.length} chars`);

        // Build the config for logging/debugging
        const responseModalities = config.responseModalities || [Modality.AUDIO];
        const isAudioMode = responseModalities.includes(Modality.AUDIO);

        // 🔄 DYNAMIC MODEL SELECTION:
        // Native-audio models don't support TEXT-only mode, so switch models based on modality
        const selectedModel = isAudioMode
          ? 'gemini-2.5-flash-native-audio-preview-09-2025'  // Native audio for AUDIO mode
          : 'gemini-2.0-flash-exp';  // Standard model for TEXT mode (custom voice)

        console.log(`[GeminiLiveClient] Selected model: ${selectedModel} (Audio mode: ${isAudioMode})`);

        // Only include speechConfig if AUDIO modality is requested
        // TEXT-only mode cannot have voice settings
        const liveConfig: any = {
          responseModalities,
          systemInstruction: { parts: [{ text: systemInstruction }] }
        };

        if (isAudioMode) {
          liveConfig.speechConfig = {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: this.currentVoice
              }
            }
          };
        }

        // 🔍 DIAGNOSTIC: Log full configuration
        GeminiDiagnostics.logConfig({ model: selectedModel, ...liveConfig }, 'Live API Request');

        this.session = await this.genAI.live.connect({
          model: selectedModel,  // Dynamic model selection
          config: liveConfig,
          callbacks: {
            onopen: () => {
              this.isConnected = true;
              this.reconnectAttempts = 0;
              this.emit('connected');
              console.log('[GeminiLiveClient] ✅ Connected successfully');
              console.log('[GeminiLiveClient] Session Keys:', Object.keys(this.session || {}));
            },
            onmessage: (e: any) => this.handleMessage(e),
            onerror: (e: any) => {
              console.error('[GeminiLiveClient] Error:', e.error);
              this.emit('error', e.error);
              if (this.shouldReconnect) {
                this.scheduleReconnect();
              }
            },
            onclose: (e: any) => {
              // Parse and log the close code with actionable diagnostic information
              const diagnosis = GeminiDiagnostics.parseCloseCode(e.code, e.reason);
              console.error(`[GeminiLiveClient] Connection closed:\n   ${diagnosis}`);
              this.isConnected = false;
              this.emit('disconnected', e.reason || 'Connection closed');

              // KILL SWITCH: Stop reconnecting on auth/API key errors (code 1007, 1008)
              if (e.code === 1007 || e.code === 1008 || (e.reason && e.reason.toLowerCase().includes('api key'))) {
                console.error('[GeminiLiveClient] 🛑 AUTH/CONFIG ERROR - Stopping reconnection attempts');
                console.error(`[GeminiLiveClient] 💡 Try one of these models: ${KNOWN_LIVE_MODELS.slice(0, 3).join(', ')}`);
                this.shouldReconnect = false;
                this.emit('error', new Error(`Connection failed: ${e.reason}`));
                return;
              }

              // Reconnect on abnormal closure (but not on normal close or auth errors)
              if (this.shouldReconnect && e.code !== 1000 && e.code !== 1001) {
                this.scheduleReconnect();
              }
            }
          }
        });

        console.log('[GeminiLiveClient] Session connecting...');
      } catch (error: any) {
        console.error('[GeminiLiveClient] Connection failed:', error);

        // Check for "invalid argument" and retry ONCE with simple config
        if (!isRetry && (error.message?.includes('invalid argument') || error.message?.includes('InvalidArgument'))) {
          console.log('[GeminiLiveClient] ⚠️ Caught Invalid Argument error. Retrying with simplified config...');
          await tryConnect(true);
          return;
        }

        this.emit('error', error as Error);
        if (this.shouldReconnect && !isRetry) { // Don't schedule reconnect if fallback also failed immediately
          this.scheduleReconnect();
        }
        throw error;
      }
    };

    await tryConnect(false);
  }

  /**
   * Send a text message to Gemini to trigger a voice response.
   * Useful for initial greetings or fallback mode.
   *
   * @param {string} text - The text to send.
   * @returns {Promise<void>}
   */
  public async sendText(text: string): Promise<void> {
    if (!this.isConnected || !this.session) {
      console.warn('[GeminiLiveClient] Cannot send text - not connected');
      return;
    }

    try {
      await this.session.sendClientContent({ turns: text });
      console.log('[GeminiLiveClient] 📝 Sent text:', text);
    } catch (error) {
      console.error('[GeminiLiveClient] Failed to send text:', error);
      this.emit('error', error as Error);
    }
  }

  private isMuted: boolean = false;

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    console.log(`[GeminiLiveClient] Mute state set to: ${muted}`);
  }

  /**
   * Set the voice for audio output.
   * Note: Requires reconnection to take effect.
   *
   * @param {string} voice - The voice name (e.g., 'Charon', 'Kore', 'Puck').
   */
  public setVoice(voice: string): void {
    this.currentVoice = voice;
    console.log(`[GeminiLiveClient] Voice set to: ${voice}`);
    console.log(`[GeminiLiveClient] ⚠️ Note: Reconnect required for voice change to take effect`);
  }

  /**
   * Get the current voice.
   * @returns {string} The current voice name.
   */
  public getVoice(): string {
    return this.currentVoice;
  }

  /**
   * Check if client is currently connected.
   * @returns {boolean} True if connected.
   */
  public get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Send audio chunk to Gemini (16kHz PCM16 base64).
   * Returns latency in milliseconds.
   *
   * @param {Float32Array} audioChunk - The audio data to send.
   * @returns {Promise<number>} The latency of the send operation, or 0 if skipped.
   */
  public async sendAudio(audioChunk: Float32Array): Promise<number> {
    if (!this.isConnected || !this.session) {
      return 0; // Not connected, just skip silently to avoid log spam
    }

    if (this.isMuted) {
      return 0; // Microphone is muted
    }

    // Check VAD - only send if user is speaking
    const shouldSend = this.vad.process(audioChunk);
    if (!shouldSend) {
      return 0; // Skip, user not speaking
    }

    const startTime = performance.now();
    this.lastChunkSentTime = startTime;

    try {
      // Convert: 48kHz Float32 → 16kHz Int16 → base64
      // Ensure input is Float32Array (IPC can sometimes convert to regular Array)
      const inputBuffer = audioChunk instanceof Float32Array ? audioChunk : new Float32Array(audioChunk);

      const base64Audio = AudioResampler.prepareForGemini(
        inputBuffer,
        AudioResamplers.UPSTREAM
      );

      // Verify we have content
      if (!base64Audio || base64Audio.length === 0) {
        console.warn('[GeminiLiveClient] Skipping empty audio chunk');
        return 0;
      }

      // Send to Gemini using sendRealtimeInput to enable VAD (server detects end of turn)
      await this.session.sendRealtimeInput({
        audio: {
          mimeType: 'audio/pcm;rate=16000',
          data: base64Audio
        }
      });

      const latency = performance.now() - startTime;
      console.log(`[GeminiLiveClient] 📤 Sent audio chunk (${audioChunk.length} samples, latency: ${latency.toFixed(2)}ms)`);

      return latency;
    } catch (error) {
      console.error('[GeminiLiveClient] Failed to send audio:', error);
      this.emit('error', error as Error);
      return -1;
    }
  }

  /**
   * Disconnect session.
   * Stops reconnection attempts and closes the session.
   *
   * @returns {Promise<void>}
   */
  public async disconnect(): Promise<void> {
    console.log('[GeminiLiveClient] Disconnecting...');

    this.shouldReconnect = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.session) {
      try {
        // Close session if SDK provides close method
        if (typeof this.session.close === 'function') {
          await this.session.close();
        }
      } catch (error) {
        console.error('[GeminiLiveClient] Error closing session:', error);
      }
      this.session = null;
    }

    this.isConnected = false;
    this.vad.reset();
    this.emit('disconnected', 'User disconnect');

    console.log('[GeminiLiveClient] Disconnected');
  }


  /**
   * Get VAD state.
   * @returns {object} The current state of the Voice Activity Detector.
   */
  public getVADState() {
    return this.vad.getState();
  }

  /**
   * Update VAD configuration at runtime.
   * Allows dynamic adjustment of voice activity detection sensitivity.
   *
   * @param {Partial<import('../audio/vad').VADConfig>} config - Partial VAD configuration to update.
   */
  public updateVADConfig(config: { rmsThreshold?: number; minSpeechFrames?: number; minSilenceFrames?: number; zcrThreshold?: number }): void {
    console.log('[GeminiLiveClient] Updating VAD config:', config);
    this.vad.updateConfig(config);
  }

  /**
   * Check if text modality is working (for STT fallback decision).
   * @returns {boolean} True if text has been received from Gemini.
   */
  public get isTextModalityWorking(): boolean {
    return this._isTextModalityWorking;
  }

  // ===== PRIVATE METHODS =====

  /**
   * Handle incoming message from Gemini.
   * Processes audio responses and manages turn-taking.
   *
   * @param {any} event - The message event.
   */
  private async handleMessage(event: any): Promise<void> {
    try {
      // The SDK already parses JSON messages for us
      const message = event.data || event;

      // Skip logging for binary/base64 audio data (would fail JSON.stringify)
      if (typeof message === 'string') {
        // 🔊 NATIVE AUDIO: The model sends raw base64 strings for audio
        console.log('[GeminiLiveClient] 🔊 Received raw audio chunk, length:', message.length);

        try {
          // Convert: base64 → 24kHz Int16 → Float32 → 48kHz Float32
          const audioData = AudioResampler.prepareForPlayback(
            message, // The message IS the base64 string
            AudioResamplers.DOWNSTREAM
          );

          // Calculate latency
          const latency = this.lastChunkSentTime > 0
            ? performance.now() - this.lastChunkSentTime
            : 0;

          console.log(`[GeminiLiveClient] 🔊 Emitting audioReceived: ${audioData.length} samples`);
          this.emit('audioReceived', audioData, latency);
        } catch (e) {
          console.error('[GeminiLiveClient] Failed to process audio chunk:', e);
        }
        return;
      }

      // 🔍 DIAGNOSTIC: Log ALL JSON messages to debug what we're receiving
      console.log('[GeminiLiveClient] 📨 Received message:', JSON.stringify(message, null, 2));

      // Handle setup complete  - connection ready for realtime audio
      if (message.setupComplete) {
        console.log('[GeminiLiveClient] Setup complete - ready for voice conversation');
        return;
      }

      // Extract content from response
      if (message.serverContent) {
        // 🔍 DEBUG: Log full server content to find where audio is hiding
        console.log('[GeminiLiveClient] 🔍 SERVER CONTENT:', JSON.stringify(message.serverContent, null, 2));

        // 🎤 DETECT USER TRANSCRIPTION: Check if this is user's speech being transcribed
        // The API may send transcriptions in userTurn or as intermediate results
        if (message.serverContent.userTurn?.parts) {
          let userTranscription = '';
          for (const part of message.serverContent.userTurn.parts) {
            if (part.text) {
              userTranscription += part.text;
            }
          }
          if (userTranscription) {
            console.log('🎤 [USER SAID]:', userTranscription);
            console.log('[GeminiLiveClient] 🔊 USER TRANSCRIPTION:', userTranscription);
            this.emit('userTranscription', userTranscription, Date.now());
            this.emit('message', {
              role: 'user',
              text: userTranscription,
              timestamp: Date.now()
            });
            // 🧠 BRAIN MEMORY: Add user speech to short-term buffer
            this.brain?.addToBuffer('user', userTranscription);
          }
        }
      }

      if (message.serverContent.modelTurn?.parts) {
        // Signal VAD that Gemini is speaking (only when actual content arrives)
        this.vad.setGeminiSpeaking(true);
        let textContent = '';

        for (const part of message.serverContent.modelTurn.parts) {
          // 🔍 DEBUG: Log part MIME types to see if audio is present
          console.log('[GeminiLiveClient] Processing part. MimeType:', part.inlineData?.mimeType, 'Text:', part.text ? '(text content)' : 'none');
          console.log('[GeminiLiveClient] 🔍 FULL PART:', JSON.stringify(part, null, 2));

          // Handle Audio
          if (part.inlineData?.mimeType?.startsWith('audio/')) {
            const base64Audio = part.inlineData.data;

            // Convert: base64 → 24kHz Int16 → Float32 → 48kHz Float32
            const audioData = AudioResampler.prepareForPlayback(
              base64Audio,
              AudioResamplers.DOWNSTREAM
            );

            // Calculate latency
            const latency = this.lastChunkSentTime > 0
              ? performance.now() - this.lastChunkSentTime
              : 0;

            console.log(`[GeminiLiveClient] 📥 Received audio (${audioData.length} samples, latency: ${latency.toFixed(2)}ms)`);

            this.emit('audioReceived', audioData, latency);
          }

          // Handle Text (for UI transcript)
          if (part.text) {
            textContent += part.text;
          }
        }

        // Emit text message if present
        if (textContent) {
          this._isTextModalityWorking = true; // Flag for STT fallback decision
          console.log('🤖 [DR. SNUGGLES SAID]:', textContent);
          console.log('[GeminiLiveClient] 📝 Received text:', textContent.substring(0, 50) + '...');
          this.emit('message', {
            role: 'assistant',
            text: textContent,
            timestamp: Date.now()
          });
          // 🧠 BRAIN MEMORY: Add assistant speech to short-term buffer
          this.brain?.addToBuffer('assistant', textContent);
        }
      }

      // Handle Function Calls (Brain Tool Execution)
      for (const part of message.serverContent.modelTurn.parts) {
        if (part.functionCall) {
          console.log(`[GeminiLiveClient] 🔧 Function call requested: ${part.functionCall.name}`);
          console.log(`[GeminiLiveClient] Arguments:`, part.functionCall.args);

          // Execute tool via brain if available
          if (this.brain) {
            try {
              const result = await this.brain.executeTool(
                part.functionCall.name,
                part.functionCall.args
              );
              console.log(`[GeminiLiveClient] ✅ Tool executed:`, result);

              // Send function response back to Gemini
              // Note: This requires sending a follow-up message to the session
              // For now, we'll just log it - full implementation needs session.sendClientContent()
              console.warn('[GeminiLiveClient] ⚠️ Function result not sent back to Gemini (requires additional API integration)');
            } catch (error) {
              console.error('[GeminiLiveClient] ❌ Tool execution failed:', error);
            }
          } else {
            console.warn('[GeminiLiveClient] ⚠️ Function call requested but brain not available');
          }
        }
      }

      // When Gemini finishes speaking
      if (message.serverContent?.turnComplete) {
        this.vad.setGeminiSpeaking(false);
        console.log('[GeminiLiveClient] 🔄 Turn complete, user can speak');
      }
    } catch (error) {
      console.error('[GeminiLiveClient] Error handling message:', error);
      this.emit('error', error as Error);
    }
  }

  /**
   * Strip markdown formatting from system instruction.
   * The Gemini Live API rejects systemInstructions with markdown formatting.
   *
   * @param {string} text - The text to clean.
   * @returns {string} Plain text without markdown.
   */
  private stripMarkdown(text: string): string {
    return text
      // Remove bold/italic: **text** or *text*
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      // Remove headers: ### Header
      .replace(/^#{1,6}\s+/gm, '')
      // Remove inline code: `code`
      .replace(/`([^`]+)`/g, '$1')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * Build system instruction with context.
   * Integrates time, session history, knowledge, and personality into the prompt.
   * If brain is available, uses brain-enhanced context with RAG memories.
   *
   * @param {SessionConfig} config - The session configuration.
   * @returns {Promise<string>} The complete system instruction.
   */
  private async buildSystemInstruction(config: SessionConfig): Promise<string> {
    // If brain is available, use it to prepare context
    if (this.brain) {
      console.log('[GeminiLiveClient] 🧠 Using Brain for system instruction');

      // Get brain-enhanced context with RAG memories
      const brainContext = await this.brain.prepareSessionContext(
        config.knowledgeContext || "conversation"
      );

      // Brain already includes personality + RAG memories
      let instruction = brainContext.systemInstruction;

      // Add current time (no markdown)
      const currentTime = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long'
      });
      instruction += `\n\nCurrent System Time: ${currentTime}\n`;

      // Add session history if provided
      if (config.sessionSummaries?.length) {
        instruction += '\nPrevious Session Context:\n';
        config.sessionSummaries.forEach((summary, i) => {
          instruction += `Session ${i + 1}: ${summary}\n`;
        });
      }

      // Add additional knowledge context (brain will have already searched Orama)
      if (config.knowledgeContext) {
        instruction += '\nAdditional Context:\n';
        instruction += config.knowledgeContext;
      }

      // Strip all markdown formatting before returning
      return this.stripMarkdown(instruction);
    }

    // Fall back to original DR_SNUGGLES_PROMPT if no brain
    const currentTime = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    });

    let instruction = DR_SNUGGLES_PROMPT;
    instruction += `\n\nCurrent System Time: ${currentTime}\n`;

    // Add session history
    if (config.sessionSummaries?.length) {
      instruction += '\nPrevious Session Context:\n';
      config.sessionSummaries.forEach((summary, i) => {
        instruction += `Session ${i + 1}: ${summary}\n`;
      });
    }

    // Add knowledge context
    if (config.knowledgeContext) {
      instruction += '\nAvailable Knowledge:\n';
      instruction += config.knowledgeContext;
    }

    // Add personality mix
    if (config.personalityMix) {
      const { comedy, research, energy } = config.personalityMix;
      instruction += `\nPersonality Mix: Comedy: ${comedy}%, Research: ${research}%, Energy: ${energy}%\n`;
    }

    // Strip all markdown formatting before returning
    return this.stripMarkdown(instruction);
  }

  /**
   * Schedule reconnection with exponential backoff.
   */
  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;
    if (this.reconnectAttempts >= RECONNECT_CONFIG.maxAttempts) {
      console.error('[GeminiLiveClient] Max reconnection attempts reached');
      this.emit('error', new Error('Max reconnection attempts reached'));
      return;
    }

    this.reconnectAttempts++;

    // Calculate delay with exponential backoff
    const baseDelay = Math.min(
      RECONNECT_CONFIG.initialDelay * Math.pow(RECONNECT_CONFIG.backoffMultiplier, this.reconnectAttempts - 1),
      RECONNECT_CONFIG.maxDelay
    );

    // Add jitter
    const jitter = (Math.random() - 0.5) * RECONNECT_CONFIG.jitter;
    const delay = baseDelay + jitter;

    console.log(`[GeminiLiveClient] 🔄 Reconnecting in ${(delay / 1000).toFixed(1)}s (attempt ${this.reconnectAttempts}/${RECONNECT_CONFIG.maxAttempts})`);

    this.emit('reconnecting', this.reconnectAttempts, delay);

    this.reconnectTimer = setTimeout(() => {
      this.connect(this.lastConfig).catch(error => {
        console.error('[GeminiLiveClient] Reconnection failed:', error);
      });
    }, delay);
  }
}
