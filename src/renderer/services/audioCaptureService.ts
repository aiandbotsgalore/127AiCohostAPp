/**
 * AUDIO CAPTURE SERVICE - Renderer
 *
 * Captures audio from the user's microphone using the Web Audio API.
 * Buffers the audio and sends it to the main process via IPC.
 */

export class AudioCaptureService {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private isActive: boolean = false;
  private sampleRate: number = 48000;

  constructor() {
    console.log('[AudioCaptureService] Initialized');
  }

  /**
   * Starts audio capture.
   *
   * @param {string} [deviceId] - Optional specific device ID to use.
   * @returns {Promise<void>}
   */
  public async start(deviceId?: string): Promise<void> {
    if (this.isActive) return;

    try {
      this.audioContext = new AudioContext({ sampleRate: this.sampleRate });

      // Load the AudioWorklet processor using fetch + Blob (works in Electron/Vite)
      // Vite serves public/ at root, so fetch from /audioProcessor.js
      const response = await fetch('/audioProcessor.js');
      if (!response.ok) {
        throw new Error(`Failed to fetch audioProcessor.js: ${response.status}`);
      }
      const script = await response.text();
      const blob = new Blob([script], { type: 'application/javascript' });
      const workletUrl = URL.createObjectURL(blob);
      console.log('[AudioCaptureService] Worklet loaded via Blob URL');

      await this.audioContext.audioWorklet.addModule(workletUrl);
      console.log('[AudioCaptureService] Worklet module loaded successfully');

      // Try exact device first, fallback to default if it fails
      let constraints: MediaStreamConstraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        video: false
      };

      console.log(`[AudioCaptureService] Requesting microphone access (${deviceId || 'default'})...`);

      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (deviceError: any) {
        if (deviceId && deviceError.name === 'NotFoundError') {
          console.warn(`[AudioCaptureService] Device ${deviceId} not found, falling back to default device`);
          constraints = { audio: true, video: false };
          this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        } else {
          throw deviceError;
        }
      }

      // Log available devices for debugging
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(d => d.kind === 'audioinput');
        console.log('[AudioCaptureService] Available audio input devices:', audioInputs.map(d => ({
          id: d.deviceId,
          label: d.label || 'Unknown Device'
        })));
      } catch (enumError) {
        console.warn('[AudioCaptureService] Could not enumerate devices:', enumError);
      }

      // Ensure AudioContext and MediaStream are ready
      if (!this.audioContext) {
        throw new Error('AudioContext failed to initialize');
      }
      if (!this.mediaStream) {
        throw new Error('MediaStream not available');
      }

      // Resume AudioContext if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('[AudioCaptureService] AudioContext resumed');
      }

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Use AudioWorkletNode to access raw audio data
      this.workletNode = new AudioWorkletNode(this.audioContext, 'audio-processor');

      this.workletNode.port.onmessage = (e) => {
        if (!this.isActive) return;
        const inputData = e.data; // Float32Array from the processor
        window.snugglesAPI.genaiSendAudioChunk(inputData);
      };

      source.connect(this.workletNode);
      this.workletNode.connect(this.audioContext.destination);

      this.isActive = true;
      console.log('[AudioCaptureService] Audio capture started (AudioWorklet)');

    } catch (error: any) {
      const errMsg = `Audio capture failed: ${error.message}`;
      console.error('[AudioCaptureService]', errMsg);
      window.dispatchEvent(new CustomEvent('snugglesError', { detail: { message: errMsg, type: 'audio_capture' } }));
      this.stop();
      throw error;
    }
  }

  /**
   * Stops audio capture and cleans up resources.
   */
  public stop(): void {
    this.isActive = false;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    console.log('[AudioCaptureService] Audio capture stopped');
  }

  /**
   * Checks if capture is currently active.
   */
  public isCapturing(): boolean {
    return this.isActive;
  }
}
