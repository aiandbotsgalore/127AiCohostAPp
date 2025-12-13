/**
 * ElevenLabs Text-to-Speech Service
 *
 * Provides custom voice synthesis for Dr. Snuggles using ElevenLabs API.
 * Uses custom voice: GuzPQFD9JSeGAgP09DOb (updated Dec 2025)
 *
 * Note: Gemini Live API now has native audio output with affective dialogue,
 * so this service is primarily used for fallback or custom voice scenarios.
 */

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import EventEmitter from 'eventemitter3';

interface TTSConfig {
    voiceId: string;
    modelId?: string;
    stability?: number;
    similarityBoost?: number;
    style?: number;
    useSpeakerBoost?: boolean;
}

export class ElevenLabsService extends EventEmitter {
    private client: ElevenLabsClient;
    private config: TTSConfig;
    private requestCount: number = 0;
    private characterCount: number = 0;

    constructor(apiKey: string, voiceId: string, modelId: string = 'eleven_monolingual_v1') {
        super();
        this.client = new ElevenLabsClient({ apiKey });
        this.config = {
            voiceId,
            modelId,
            stability: 0.5,
            similarityBoost: 0.75,
            style: 0.5,
            useSpeakerBoost: true
        };

        console.log(`[ElevenLabs] Initialized with voice: ${voiceId}, model: ${modelId}`);
    }

    /**
     * Convert text to speech using ElevenLabs API
     * Returns audio as Buffer (MP3 format)
     */
    async textToSpeech(text: string): Promise<Buffer> {
        const startTime = performance.now();
        this.characterCount += text.length;
        this.requestCount++;

        console.log(`[ElevenLabs] Synthesizing: "${text.substring(0, 50)}..." (${text.length} chars)`);

        try {
            // Use ElevenLabs text-to-speech API
            const audioStream = await this.client.textToSpeech.convert(this.config.voiceId, {
                optimizeStreamingLatency: 0,
                outputFormat: 'mp3_44100_128',
                text,
                modelId: this.config.modelId,
                voiceSettings: {
                    stability: this.config.stability,
                    similarityBoost: this.config.similarityBoost,
                    style: this.config.style,
                    useSpeakerBoost: this.config.useSpeakerBoost
                }
            });

            // Collect audio chunks from ReadableStream
            const chunks: Uint8Array[] = [];
            const reader = audioStream.getReader();

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                }
            } finally {
                reader.releaseLock();
            }

            // Combine chunks into single buffer
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const audioBuffer = Buffer.alloc(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                audioBuffer.set(chunk, offset);
                offset += chunk.length;
            }

            const latency = performance.now() - startTime;
            console.log(`[ElevenLabs] ✅ Synthesis complete (${latency.toFixed(0)}ms, ${audioBuffer.length} bytes)`);
            console.log(`[ElevenLabs] 📊 Session stats: ${this.requestCount} requests, ${this.characterCount} chars`);

            this.emit('synthesis-complete', { text, latency, audioLength: audioBuffer.length });

            return audioBuffer;
        } catch (error: any) {
            console.error('[ElevenLabs] ❌ Synthesis failed:', error.message);
            this.emit('synthesis-error', error);
            throw error;
        }
    }

    /**
     * Update voice settings
     */
    updateVoiceSettings(settings: Partial<TTSConfig>): void {
        this.config = { ...this.config, ...settings };
        console.log('[ElevenLabs] Voice settings updated:', this.config);
    }

    /**
     * Get usage statistics
     */
    getStats() {
        return {
            requests: this.requestCount,
            characters: this.characterCount,
            estimatedCost: (this.characterCount / 1000) * 0.30 // $0.30 per 1K chars
        };
    }

    /**
     * Reset statistics
     */
    resetStats(): void {
        this.requestCount = 0;
        this.characterCount = 0;
        console.log('[ElevenLabs] Stats reset');
    }
}
