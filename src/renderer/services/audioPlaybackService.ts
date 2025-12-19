/**
 * AUDIO PLAYBACK SERVICE - Renderer
 *
 * Receives audio chunks from the main process (via IPC) and plays them back
 * using the Web Audio API. It buffers chunks to ensure smooth playback.
 * 
 * Features:
 * - STT fallback for transcript when text modality fails
 * - Visualizer support via analyser node
 * - Encoded audio decoding (MP3 support)
 */

export class AudioPlaybackService {
  private _audioContext: AudioContext | null = null;
  private nextStartTime: number = 0;
  private _isActive: boolean = false;
  private sampleRate: number = 48000;

  // STT fallback
  private recognition: any = null; // Use any to avoid type errors
  private isTextModalityWorking: boolean = false;
  private recognitionActive: boolean = false; // Track if recognition is currently running

  // Debug logging control
  private debugAudioEnabled: boolean = false;
  private audioLogCounter: number = 0;

  // IPC listener cleanup functions
  private cleanupAudioReceived: (() => void) | null = null;
  private cleanupInterruption: (() => void) | null = null;

  public testTone(): void {
    if (!this._audioContext) this.start();
    if (!this._audioContext || !this.gainNode) return;

    console.log('[AudioPlaybackService] Playing test tone...');
    const oscillator = this._audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this._audioContext.currentTime); // A4
    oscillator.connect(this.gainNode);
    oscillator.start();
    oscillator.stop(this._audioContext.currentTime + 0.5); // 0.5s duration
  }

  // Visualizer support
  private gainNode: GainNode | null = null;
  private activeSources: Set<AudioBufferSourceNode> = new Set();

  constructor() {
    console.log('[AudioPlaybackService] Initialized');

    // Initialize STT if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          window.dispatchEvent(new CustomEvent('snugglesTranscript', {
            detail: { text: transcript, role: 'assistant' }
          }));
        }
      };

      this.recognition.onerror = (event: any) => {
        // STT is optional - Gemini handles voice, so just log quietly
        if (event.error !== 'network' && event.error !== 'aborted') {
          console.warn('[STT] Error:', event.error);
        }
      };

      this.recognition.onend = () => console.log('[STT] Ended');
      console.log('[AudioPlaybackService] STT fallback available');
    } else {
      console.warn('[AudioPlaybackService] SpeechRecognition not supported');
    }
  }

  /**
   * Public accessor for audioContext (for visualizer)
   */
  public get audioContext(): AudioContext | null {
    return this._audioContext;
  }

  /**
   * Public accessor for isActive
   */
  public get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Set whether text modality is working (disables STT fallback)
   */
  public setTextModalityWorking(working: boolean): void {
    this.isTextModalityWorking = working;
    console.log(`[AudioPlaybackService] Text modality working: ${working}`);
  }

  /**
   * Connect a visualizer analyser node to the audio chain
   */
  public connectVisualizer(analyser: AnalyserNode): void {
    if (this._audioContext && this.gainNode) {
      analyser.connect(this.gainNode);
      console.log('[AudioPlaybackService] Visualizer connected');
    } else {
      console.warn('[AudioPlaybackService] Cannot connect visualizer - no audio context');
    }
  }

  /**
   * Initializes the audio context for playback.
   */
  public start(): void {
    if (this._isActive) return;

    try {
      this._audioContext = new AudioContext({ sampleRate: this.sampleRate });
      console.log(`[AudioPlaybackService] 🎵 DIAGNOSTIC: AudioContext created. State: ${this._audioContext.state}, Sample rate: ${this._audioContext.sampleRate}`);
      this.nextStartTime = this._audioContext.currentTime;

      // Create gain node for visualizer chain
      this.gainNode = this._audioContext.createGain();
      this.gainNode.connect(this._audioContext.destination);

      this._isActive = true;

      // Defensive check: Only set up IPC listeners if running in Electron with snugglesAPI available
      if (window.snugglesAPI?.onGenaiAudioReceived) {
        console.log('[AudioPlaybackService] 🎵 DIAGNOSTIC: Setting up IPC listener for audio...');
        // Listen for incoming audio - store cleanup function
        this.cleanupAudioReceived = window.snugglesAPI.onGenaiAudioReceived((audioData: Float32Array | ArrayBuffer | Uint8Array) => {
          console.log(`[AudioPlaybackService] 🎵 DIAGNOSTIC: Received audio from IPC! Type: ${audioData.constructor.name}, Length: ${audioData.length}`);
          this.queueAudio(audioData);
        });

        // Listen for interruptions - store cleanup function
        if (window.snugglesAPI.onGenaiInterruption) {
          this.cleanupInterruption = window.snugglesAPI.onGenaiInterruption(() => {
            this.cancelPlayback();
          });
        }
        console.log('[AudioPlaybackService] Audio playback ready (Electron mode with IPC)');
      } else {
        // Browser-only mode - audio playback still works for test tones, but no Gemini audio
        console.warn('[AudioPlaybackService] ⚠️ DIAGNOSTIC: snugglesAPI not available! Running in browser-only mode.');
        console.log('[AudioPlaybackService] Audio playback ready (Browser-only mode - no Gemini IPC)');
      }
    } catch (error) {
      console.error('[AudioPlaybackService] Failed to start playback:', error);
    }
  }

  /**
   * Queues an audio chunk for playback.
   * Supports raw PCM (Float32Array) or encoded audio (ArrayBuffer/Uint8Array) which will be decoded.
   *
   * @param {Float32Array | ArrayBuffer | Uint8Array} audioData - The audio samples to play.
   */
  private async queueAudio(audioData: Float32Array | ArrayBuffer | Uint8Array): Promise<void> {
    console.log(`[AudioPlaybackService] 🎵 DIAGNOSTIC: queueAudio called. Active: ${this._isActive}, Context: ${!!this._audioContext}, GainNode: ${!!this.gainNode}`);
    
    if (!this._isActive || !this._audioContext || !this.gainNode) {
      console.warn('[AudioPlaybackService] ⚠️ DIAGNOSTIC: Cannot queue audio - service not active or missing context');
      return;
    }

    try {
      // Ensure context is running (browser autoplay policy)
      console.log(`[AudioPlaybackService] 🎵 DIAGNOSTIC: AudioContext state before: ${this._audioContext.state}`);
      if (this._audioContext.state === 'suspended') {
        console.log('[AudioPlaybackService] ⚠️ DIAGNOSTIC: AudioContext SUSPENDED - attempting to resume...');
        await this._audioContext.resume();
        console.log(`[AudioPlaybackService] 🎵 DIAGNOSTIC: AudioContext state after resume: ${this._audioContext.state}`);
      }

      let pcmData: Float32Array;

      // Handle encoded audio (MP3/WAV from ElevenLabs)
      if (audioData instanceof ArrayBuffer || audioData instanceof Uint8Array) {
        // Convert Uint8Array to ArrayBuffer if needed
        const arrayBuffer = audioData instanceof Uint8Array
          ? audioData.buffer.slice(audioData.byteOffset, audioData.byteOffset + audioData.byteLength) // Create copy
          : audioData;

        // Decode audio data using Web Audio API (async)
        try {
          const audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
          pcmData = audioBuffer.getChannelData(0); // Use first channel
        } catch (decodeError) {
          console.error('[AudioPlaybackService] MP3 decode failed:', decodeError);
          return;
        }
      }
      // Handle raw PCM (Float32Array from Gemini)
      else if (audioData instanceof Float32Array) {
        pcmData = audioData;
      } else if (Array.isArray(audioData)) {
        pcmData = new Float32Array(audioData);
      } else {
        // Fallback for serialized object/map
        pcmData = Float32Array.from(Object.values(audioData));
      }

      if (!pcmData || pcmData.length === 0) return;

      // RE-CHECK ACTIVE STATE: Service might have been stopped while decoding was in progress
      if (!this._isActive || !this._audioContext) return;

      // CRITICAL FIX: The audio coming from main process is ALWAYS 48kHz (upsampled in main).
      // We must tell the AudioContext that this buffer IS 48kHz, regardless of the system's hardware rate.
      // If system is 48kHz: 48->48 (perfect).
      // If system is 44.1kHz: 48->44.1 (browser handles resampling automatically).
      // If we used this._audioContext.sampleRate here (e.g. 44.1k), it would play 48k data at 44.1k speed (slow/drunk).
      const buffer = this._audioContext.createBuffer(1, pcmData.length, 48000);
      buffer.copyToChannel(pcmData, 0);
      console.log(`[AudioPlaybackService] 🎵 DIAGNOSTIC: Buffer created. Channels: ${buffer.numberOfChannels}, Length: ${buffer.length}, Duration: ${buffer.duration}s`);

      const source = this._audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.gainNode);

      // Track source for cancellation
      this.activeSources.add(source);

      // Schedule playback
      const currentTime = this._audioContext.currentTime;
      // Ensure we schedule in the future, with a small buffer
      const startTime = Math.max(currentTime + 0.05, this.nextStartTime);

      console.log(`[AudioPlaybackService] 🎵 DIAGNOSTIC: Scheduling playback. Current: ${currentTime.toFixed(3)}s, Start: ${startTime.toFixed(3)}s, Duration: ${buffer.duration.toFixed(3)}s`);
      source.start(startTime);
      this.nextStartTime = startTime + buffer.duration;
      console.log(`[AudioPlaybackService] ✅ DIAGNOSTIC: Audio source started successfully!`);

      // Clean up on ended
      source.onended = () => {
        this.activeSources.delete(source);
      };

    } catch (error) {
      console.error('[AudioPlaybackService] Playback/Decoding error:', error);
      // Attempt recovery if context is bad
      if (this._audioContext && this._audioContext.state === 'closed') {
        this.stop();
        this.start();
      }
    }
  }

  /**
   * Cancel all currently playing audio.
   * Used when user interrupts.
   */
  public cancelPlayback(): void {
    if (!this._isActive || !this._audioContext) return;

    if (this.activeSources.size > 0) {
      console.log(`[AudioPlaybackService] 🛑 Canceling playback (${this.activeSources.size} sources)`);

      // Stop all active sources
      this.activeSources.forEach(source => {
        try {
          source.stop();
        } catch (e) { /* ignore already stopped */ }
      });
      this.activeSources.clear();
    }

    // Reset timing to now
    this.nextStartTime = this._audioContext.currentTime;
  }

  /**
   * Stops playback and closes the audio context.
   */
  public stop(): void {
    this._isActive = false;

    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) { /* ignore */ }
    }

    // Clean up IPC listeners
    if (this.cleanupAudioReceived) {
      this.cleanupAudioReceived();
      this.cleanupAudioReceived = null;
    }
    if (this.cleanupInterruption) {
      this.cleanupInterruption();
      this.cleanupInterruption = null;
    }

    this.cancelPlayback();

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    if (this._audioContext) {
      this._audioContext.close();
      this._audioContext = null;
    }
    this.nextStartTime = 0;

    console.log('[AudioPlaybackService] Audio playback stopped');
  }
}