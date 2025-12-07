/**
 * AUDIO PLAYBACK SERVICE - Renderer
 *
 * Receives audio chunks from the main process (via IPC) and plays them back
 * using the Web Audio API. It buffers chunks to ensure smooth playback.
 * 
 * Features:
 * - STT fallback for transcript when text modality fails
 * - Visualizer support via analyser node
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
      this.nextStartTime = this._audioContext.currentTime;

      // Create gain node for visualizer chain
      this.gainNode = this._audioContext.createGain();
      this.gainNode.connect(this._audioContext.destination);

      this._isActive = true;

      // Listen for incoming audio
      window.snugglesAPI.onGenaiAudioReceived((audioData: Float32Array) => {
        this.queueAudio(audioData);
      });

      console.log('[AudioPlaybackService] Audio playback ready');
    } catch (error) {
      console.error('[AudioPlaybackService] Failed to start playback:', error);
    }
  }

  /**
   * Queues an audio chunk for playback.
   *
   * @param {Float32Array} audioData - The audio samples to play.
   */
  private queueAudio(audioData: Float32Array): void {
    if (!this._isActive || !this._audioContext || !this.gainNode) {
      console.warn('[AudioPlaybackService] Cannot queue audio - service not active or missing context');
      return;
    }

    try {
      // Ensure context is running (browser autoplay policy)
      if (this._audioContext.state === 'suspended') {
        console.log('[AudioPlaybackService] Resuming suspended AudioContext...');
        this._audioContext.resume().catch(e => {
          console.error('[AudioPlaybackService] Failed to resume context:', e);
          // Trigger error event for UI notification
          window.dispatchEvent(new CustomEvent('snugglesError', {
            detail: { message: 'Audio context suspended. Click to resume.', type: 'audio_playback' }
          }));
        });
        return; // Wait for next chunk after resume
      }

      // Verify AudioContext is in good state
      if (this._audioContext.state === 'closed') {
        console.error('[AudioPlaybackService] AudioContext is closed - restarting service');
        this.stop();
        this.start();
        return;
      }

      // 🔍 DEBUG: Log queued audio details (reduced frequency to avoid spam)
      if (this.debugAudioEnabled || this.audioLogCounter++ % 100 === 0) {
        console.log(`[AudioPlaybackService] Queueing ${audioData.length} samples. Type: ${audioData.constructor.name}, Sample[0]: ${audioData[0]}`);
      }

      // Validate audio data
      if (!audioData || audioData.length === 0) {
        console.warn('[AudioPlaybackService] Received empty audio data, skipping');
        return;
      }

      const buffer = this._audioContext.createBuffer(1, audioData.length, this.sampleRate);

      // Handle both Float32Array and regular Array
      if (audioData instanceof Float32Array) {
        buffer.getChannelData(0).set(audioData);
      } else if (Array.isArray(audioData)) {
        console.warn('[AudioPlaybackService] Received Array instead of Float32Array, converting...');
        buffer.getChannelData(0).set(new Float32Array(audioData));
      } else {
        // Fallback for object/map (e.g. {0: 0.1, ...})
        console.warn('[AudioPlaybackService] Received unknown type, attempting conversion...');
        try {
          const array = Float32Array.from(Object.values(audioData));
          buffer.getChannelData(0).set(array);
        } catch (e) {
          console.error('[AudioPlaybackService] Failed to convert audio data:', e);
          return;
        }
      }

      const source = this._audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.gainNode);

      // Add error handler for source
      source.onended = () => {
        // Clean up on successful completion
      };

      // Schedule playback
      // If nextStartTime is in the past, reset it to now to avoid massive catch-up speedups
      const currentTime = this._audioContext.currentTime;
      if (this.nextStartTime < currentTime) {
        console.log('[AudioPlaybackService] Resetting playback timeline (was behind by', currentTime - this.nextStartTime, 'seconds)');
        this.nextStartTime = currentTime;
      }

      try {
        source.start(this.nextStartTime);
      } catch (startError) {
        console.error('[AudioPlaybackService] Failed to start audio source:', startError);
        // Reset timeline and try immediate playback
        this.nextStartTime = currentTime;
        try {
          source.start(this.nextStartTime);
        } catch (retryError) {
          console.error('[AudioPlaybackService] Retry also failed:', retryError);
          return; // Give up on this chunk
        }
      }

      // STT fallback: Start recognition if text modality is not working
      if (this.recognition && !this.isTextModalityWorking && !this.recognitionActive) {
        try {
          this.recognition.start();
          this.recognitionActive = true;
          setTimeout(() => {
            if (this.recognition && this.recognitionActive) {
              try {
                this.recognition.stop();
                this.recognitionActive = false;
              } catch (e) { /* ignore */ }
            }
          }, buffer.duration * 1000 + 500);
        } catch (startError) {
          // Recognition might already be running or failed to start
          this.recognitionActive = false;
        }
      }

      // Advance time for the next chunk
      this.nextStartTime += buffer.duration;

    } catch (error) {
      console.error('[AudioPlaybackService] Error in queueAudio:', error);
      // Attempt recovery
      if (this._audioContext && this._audioContext.state === 'closed') {
        console.log('[AudioPlaybackService] Attempting to restart audio service...');
        this.stop();
        this.start();
      }
    }
  }

  /**
   * Stops playback and closes the audio context.
   */
  public stop(): void {
    this._isActive = false;

    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) { /* ignore */ }
    }

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
