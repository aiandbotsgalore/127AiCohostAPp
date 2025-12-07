/**
 * GeminiDiagnostics - Comprehensive diagnostic utilities for Gemini Live API
 * 
 * This module provides validation, verification, and error parsing to eliminate
 * guesswork when debugging Gemini connection issues.
 */

import { GoogleGenAI, Modality } from '@google/genai';

// Known Gemini Live API models (updated December 2025)
export const KNOWN_LIVE_MODELS = [
    'gemini-2.0-flash-live-001',
    'gemini-2.0-flash-exp',
    'gemini-2.5-flash-preview-native-audio-dialog',
    'gemini-2.5-flash-native-audio-preview-09-2025',
    'gemini-live-2.5-flash-preview',
    'gemini-live-2.5-flash',
] as const;

// Known voice names for Gemini Live
export const KNOWN_VOICES = [
    'Puck',      // Default
    'Charon',    // Deep
    'Kore',      // Neutral/professional
    'Fenrir',    // Warm/excitable
    'Aoede',     // Melodic
    'Leda',
    'Orus',      // Firm
    'Zephyr',    // Bright
    'Callirrhoe',
] as const;

// WebSocket close code meanings
export const WS_CLOSE_CODES: Record<number, { meaning: string; action: string }> = {
    1000: { meaning: 'Normal closure', action: 'No action needed - clean disconnect' },
    1001: { meaning: 'Going away', action: 'Server is shutting down, retry later' },
    1002: { meaning: 'Protocol error', action: 'SDK/API version mismatch - update SDK' },
    1003: { meaning: 'Unsupported data', action: 'Check audio format and encoding' },
    1006: { meaning: 'Abnormal closure', action: 'Network issue - check internet connection' },
    1007: { meaning: 'Invalid frame payload', action: 'Invalid config - check model name, voice, or system instruction' },
    1008: { meaning: 'Policy violation', action: 'API key issue - verify key is valid and has Live API access' },
    1009: { meaning: 'Message too big', action: 'Audio chunk size too large - reduce buffer size' },
    1010: { meaning: 'Missing extension', action: 'Required feature not available on this model' },
    1011: { meaning: 'Internal server error', action: 'Gemini service issue - retry later' },
    1015: { meaning: 'TLS handshake failure', action: 'SSL/certificate issue - check network/firewall' },
};

// Diagnostic result types
export interface DiagnosticResult {
    passed: boolean;
    message: string;
    details?: string;
    suggestion?: string;
}

export interface DiagnosticReport {
    timestamp: Date;
    allPassed: boolean;
    results: {
        apiKeyFormat: DiagnosticResult;
        apiKeyValid: DiagnosticResult;
        modelAvailable: DiagnosticResult;
        configValid: DiagnosticResult;
    };
    failures: string[];
    summary: string;
}

export class GeminiDiagnostics {
    private apiKey: string;
    private genAI: GoogleGenAI | null = null;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Validate API key format without making a network call
     */
    validateApiKeyFormat(): DiagnosticResult {
        if (!this.apiKey) {
            return {
                passed: false,
                message: 'API key is missing',
                suggestion: 'Set GEMINI_API_KEY in your .env.local file',
            };
        }

        if (this.apiKey.length < 30) {
            return {
                passed: false,
                message: `API key too short (${this.apiKey.length} chars, expected 39+)`,
                suggestion: 'Check that you copied the full API key from Google AI Studio',
            };
        }

        if (!this.apiKey.startsWith('AIza')) {
            return {
                passed: false,
                message: 'API key has invalid prefix',
                details: `Expected prefix 'AIza', got '${this.apiKey.substring(0, 4)}'`,
                suggestion: 'Ensure you\'re using a Gemini API key (starts with AIza)',
            };
        }

        return {
            passed: true,
            message: `API key format valid (${this.apiKey.substring(0, 8)}...${this.apiKey.slice(-4)})`,
        };
    }

    /**
     * Verify API key is valid by making a simple API call
     */
    async verifyApiKey(): Promise<DiagnosticResult> {
        try {
            this.genAI = new GoogleGenAI({ apiKey: this.apiKey });

            // Make a minimal API call to verify the key works
            const model = this.genAI.models;
            // List models is a lightweight call to verify auth
            const response = await model.list({ config: { pageSize: 1 } });

            // Consume iterator to verify the call succeeded
            await response[Symbol.asyncIterator]().next();

            return {
                passed: true,
                message: 'API key verified successfully',
                details: 'Successfully connected to Gemini API',
            };
        } catch (error: any) {
            const errorMsg = error.message || String(error);

            if (errorMsg.includes('401') || errorMsg.includes('UNAUTHENTICATED')) {
                return {
                    passed: false,
                    message: 'API key is invalid or expired',
                    details: errorMsg,
                    suggestion: 'Generate a new API key at https://aistudio.google.com/app/apikey',
                };
            }

            if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
                return {
                    passed: false,
                    message: 'API key lacks required permissions',
                    details: errorMsg,
                    suggestion: 'Ensure your API key has access to Gemini Live API',
                };
            }

            if (errorMsg.includes('network') || errorMsg.includes('ENOTFOUND')) {
                return {
                    passed: false,
                    message: 'Network error - cannot reach Gemini API',
                    details: errorMsg,
                    suggestion: 'Check your internet connection and firewall settings',
                };
            }

            return {
                passed: false,
                message: 'API key verification failed',
                details: errorMsg,
                suggestion: 'Check the error details above',
            };
        }
    }

    /**
     * Check if a model name is known to support Live API
     */
    validateModelName(modelName: string): DiagnosticResult {
        const normalizedModel = modelName.toLowerCase().replace(/[^a-z0-9-]/g, '');
        const isKnown = KNOWN_LIVE_MODELS.some(
            known => known.toLowerCase().replace(/[^a-z0-9-]/g, '') === normalizedModel
        );

        if (isKnown) {
            return {
                passed: true,
                message: `Model '${modelName}' is a known Live API model`,
            };
        }

        // Check if it looks like a Live model
        const looksLikeAudio = modelName.includes('live') ||
            modelName.includes('audio') ||
            modelName.includes('dialog');

        if (looksLikeAudio) {
            return {
                passed: true,
                message: `Model '${modelName}' appears to be a Live API model (unverified)`,
                details: 'Model name contains audio/live keywords but is not in our known list',
                suggestion: 'If connection fails, try one of the known models',
            };
        }

        return {
            passed: false,
            message: `Model '${modelName}' may not support Live API`,
            details: `Known Live API models: ${KNOWN_LIVE_MODELS.join(', ')}`,
            suggestion: `Try using '${KNOWN_LIVE_MODELS[0]}' instead`,
        };
    }

    /**
     * Validate voice name
     */
    validateVoiceName(voiceName: string): DiagnosticResult {
        const isKnown = KNOWN_VOICES.some(
            known => known.toLowerCase() === voiceName.toLowerCase()
        );

        if (isKnown) {
            return {
                passed: true,
                message: `Voice '${voiceName}' is valid`,
            };
        }

        return {
            passed: false,
            message: `Voice '${voiceName}' is not recognized`,
            details: `Known voices: ${KNOWN_VOICES.join(', ')}`,
            suggestion: `Try using 'Puck' (default) or 'Charon' (deep)`,
        };
    }

    /**
     * Validate Live API configuration structure
     */
    validateLiveConfig(config: any): DiagnosticResult {
        const errors: string[] = [];

        // Check responseModalities
        if (!config.responseModalities) {
            errors.push('Missing responseModalities');
        } else if (!Array.isArray(config.responseModalities)) {
            errors.push('responseModalities must be an array');
        }

        // Check systemInstruction format
        if (config.systemInstruction !== undefined) {
            if (typeof config.systemInstruction === 'object' && config.systemInstruction.parts) {
                // Old format - might cause issues
                errors.push('systemInstruction should be a string, not {parts: [...]}');
            }
        }

        // Check speechConfig structure
        if (config.speechConfig) {
            if (config.speechConfig.voiceConfig?.prebuiltVoiceConfig?.voiceName) {
                const voiceResult = this.validateVoiceName(
                    config.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName
                );
                if (!voiceResult.passed) {
                    errors.push(voiceResult.message);
                }
            }
        }

        if (errors.length > 0) {
            return {
                passed: false,
                message: 'Configuration validation failed',
                details: errors.join('; '),
                suggestion: 'Check the configuration structure against the Gemini Live API docs',
            };
        }

        return {
            passed: true,
            message: 'Configuration structure is valid',
        };
    }

    /**
     * 🔴 THE REAL TEST: Actually try to connect to Live API
     * This is the only way to know if the config will work
     */
    async testLiveConnection(modelName: string): Promise<DiagnosticResult> {
        if (!this.genAI) {
            this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
        }

        return new Promise((resolve) => {
            let resolved = false;
            const timeoutMs = 10000; // 10 second timeout

            const cleanup = () => {
                resolved = true;
            };

            // Set timeout
            const timeout = setTimeout(() => {
                if (!resolved) {
                    cleanup();
                    resolve({
                        passed: false,
                        message: 'Connection timed out after 10 seconds',
                        details: `Model: ${modelName}`,
                        suggestion: 'The model may not exist or the Live API may be unavailable',
                    });
                }
            }, timeoutMs);

            console.log(`\n🔌 Attempting REAL connection to Live API with model: ${modelName}...`);

            // Actually try to connect!
            const sessionPromise = this.genAI!.live.connect({
                model: modelName,
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: 'Test connection - respond with a short greeting.'
                },
                callbacks: {
                    onopen: async () => {
                        if (!resolved) {
                            console.log('   ✅ Live connection opened successfully!');

                            // TEST PHASE 2: Send Audio
                            console.log('   🎙️ Testing audio transmission (sending silence)...');
                            try {
                                // Create 1 second of silence at 16kHz
                                const silence = new Int16Array(16000).fill(0);
                                const base64Audio = Buffer.from(silence.buffer).toString('base64');

                                const session: any = await sessionPromise;

                                console.log('   🔍 Session type:', typeof session);
                                console.log('   🔍 Session keys:', Object.keys(session || {}));
                                console.log('   🔍 Session prototype:', Object.getPrototypeOf(session));

                                if (!session) {
                                    throw new Error('Failed to create session object');
                                }

                                // Send using the same format as the app
                                await session.send({
                                    data: base64Audio,
                                    mimeType: 'audio/pcm'
                                });

                                console.log('   ✅ Audio chunk sent successfully!');

                                clearTimeout(timeout);
                                cleanup();
                                resolve({
                                    passed: true,
                                    message: `Successfully connected AND sent audio to model '${modelName}'`,
                                    details: 'Connection + Audio Send established - config is valid',
                                });
                            } catch (sendErr: any) {
                                console.error('   ❌ Audio send failed:', sendErr);
                                clearTimeout(timeout);
                                cleanup();
                                resolve({
                                    passed: false,
                                    message: 'Connected but failed to send audio',
                                    details: sendErr.message || String(sendErr),
                                });
                            }
                        }
                    },
                    onmessage: () => {
                        // Ignore messages during test
                    },
                    onerror: (e: any) => {
                        if (!resolved) {
                            clearTimeout(timeout);
                            cleanup();
                            const errorMsg = e?.error?.message || e?.message || String(e);
                            console.error(`   ❌ Live connection error: ${errorMsg}`);
                            resolve({
                                passed: false,
                                message: 'Live API connection error',
                                details: errorMsg,
                                suggestion: this.getErrorSuggestion(errorMsg),
                            });
                        }
                    },
                    onclose: (e: any) => {
                        if (!resolved) {
                            clearTimeout(timeout);
                            cleanup();
                            const code = e?.code || 0;
                            const reason = e?.reason || 'Unknown reason';
                            console.error(`   ❌ Live connection closed: code=${code}, reason=${reason}`);

                            resolve({
                                passed: false,
                                message: `Live API connection rejected (code ${code})`,
                                details: reason,
                                suggestion: this.getCloseCodeSuggestion(code, reason),
                            });
                        }
                    },
                },
            }).catch((err: any) => {
                if (!resolved) {
                    clearTimeout(timeout);
                    cleanup();
                    const errorMsg = err?.message || String(err);
                    console.error(`   ❌ Live connection failed: ${errorMsg}`);
                    resolve({
                        passed: false,
                        message: 'Failed to initiate Live connection',
                        details: errorMsg,
                        suggestion: this.getErrorSuggestion(errorMsg),
                    });
                }
            });
        });
    }

    /**
     * Get actionable suggestion based on error message
     */
    private getErrorSuggestion(errorMsg: string): string {
        const lower = errorMsg.toLowerCase();

        if (lower.includes('invalid') && lower.includes('argument')) {
            return 'The model name may be wrong. Try: gemini-2.0-flash-live-001';
        }
        if (lower.includes('not found') || lower.includes('404')) {
            return 'Model does not exist. Check Google AI documentation for current Live API models.';
        }
        if (lower.includes('permission') || lower.includes('403')) {
            return 'Your API key may not have Live API access. Check your API key permissions.';
        }
        if (lower.includes('quota') || lower.includes('429')) {
            return 'Rate limited. Wait a moment and try again.';
        }
        return 'Check the error details and try a different model name.';
    }

    /**
     * Get suggestion based on WebSocket close code
     */
    private getCloseCodeSuggestion(code: number, reason: string): string {
        switch (code) {
            case 1007:
                if (reason.toLowerCase().includes('invalid argument')) {
                    return '🎯 The model name is likely wrong. Try these models:\n' +
                        '   • gemini-2.0-flash-live-001\n' +
                        '   • gemini-2.0-flash-exp\n' +
                        '   Visit: https://ai.google.dev/gemini-api/docs/models/gemini';
                }
                return 'Invalid configuration. Check model name and config structure.';
            case 1008:
                return 'API key issue. Regenerate your key at https://aistudio.google.com/app/apikey';
            case 1006:
                return 'Network issue. Check your internet connection.';
            default:
                return `WebSocket error code ${code}. Check Gemini API documentation.`;
        }
    }

    /**
     * Parse WebSocket close code into actionable message
     */
    static parseCloseCode(code: number, reason: string): string {
        const info = WS_CLOSE_CODES[code];

        if (info) {
            let message = `[Code ${code}] ${info.meaning}`;
            if (reason) {
                message += ` - "${reason}"`;
            }
            message += `\n   → Action: ${info.action}`;
            return message;
        }

        return `[Code ${code}] Unknown error${reason ? ` - "${reason}"` : ''}\n   → Check Gemini API documentation for this error code`;
    }

    /**
     * Run all diagnostics and return comprehensive report
     */
    async runFullDiagnostics(modelName?: string, config?: any): Promise<DiagnosticReport> {
        console.log('\n🔍 ═══════════════════════════════════════════════════════');
        console.log('   GEMINI API DIAGNOSTICS');
        console.log('═══════════════════════════════════════════════════════\n');

        const results = {
            apiKeyFormat: { passed: false, message: '' } as DiagnosticResult,
            apiKeyValid: { passed: false, message: '' } as DiagnosticResult,
            modelAvailable: { passed: true, message: 'No model specified' } as DiagnosticResult,
            configValid: { passed: true, message: 'No config specified' } as DiagnosticResult,
        };

        const failures: string[] = [];

        // 1. API Key Format
        console.log('📋 Checking API key format...');
        results.apiKeyFormat = this.validateApiKeyFormat();
        this.logResult('API Key Format', results.apiKeyFormat);
        if (!results.apiKeyFormat.passed) {
            failures.push(`API Key Format: ${results.apiKeyFormat.message}`);
        }

        // 2. API Key Verification (only if format is valid)
        if (results.apiKeyFormat.passed) {
            console.log('\n🔐 Verifying API key with Gemini...');
            results.apiKeyValid = await this.verifyApiKey();
            this.logResult('API Key Valid', results.apiKeyValid);
            if (!results.apiKeyValid.passed) {
                failures.push(`API Key Verification: ${results.apiKeyValid.message}`);
            }
        } else {
            results.apiKeyValid = { passed: false, message: 'Skipped - format invalid' };
            console.log('\n🔐 Skipping API key verification (format invalid)');
        }

        // 3. Model Check
        if (modelName) {
            console.log(`\n🤖 Checking model '${modelName}'...`);
            results.modelAvailable = this.validateModelName(modelName);
            this.logResult('Model Check', results.modelAvailable);
            if (!results.modelAvailable.passed) {
                failures.push(`Model: ${results.modelAvailable.message}`);
            }
        }

        // 4. Config Validation
        if (config) {
            console.log('\n⚙️ Validating configuration...');
            results.configValid = this.validateLiveConfig(config);
            this.logResult('Config Valid', results.configValid);
            if (!results.configValid.passed) {
                failures.push(`Config: ${results.configValid.message}`);
            }
        }

        // Summary
        const allPassed = Object.values(results).every(r => r.passed);

        console.log('\n═══════════════════════════════════════════════════════');
        if (allPassed) {
            console.log('✅ ALL DIAGNOSTICS PASSED');
        } else {
            console.log('❌ DIAGNOSTICS FAILED:');
            failures.forEach(f => console.log(`   • ${f}`));
        }
        console.log('═══════════════════════════════════════════════════════\n');

        return {
            timestamp: new Date(),
            allPassed,
            results,
            failures,
            summary: allPassed ? 'All checks passed' : `${failures.length} check(s) failed`,
        };
    }

    private logResult(name: string, result: DiagnosticResult): void {
        const icon = result.passed ? '✅' : '❌';
        console.log(`   ${icon} ${name}: ${result.message}`);
        if (result.details) {
            console.log(`      Details: ${result.details}`);
        }
        if (result.suggestion) {
            console.log(`      💡 ${result.suggestion}`);
        }
    }

    /**
     * Log full configuration for debugging (with sensitive data masked)
     */
    static logConfig(config: any, label: string = 'Config'): void {
        const safeCopy = JSON.parse(JSON.stringify(config));

        // Mask any potential API keys in the config
        const maskSensitive = (obj: any): void => {
            for (const key in obj) {
                if (typeof obj[key] === 'string' && obj[key].startsWith('AIza')) {
                    obj[key] = obj[key].substring(0, 8) + '...' + obj[key].slice(-4);
                } else if (typeof obj[key] === 'object') {
                    maskSensitive(obj[key]);
                }
            }
        };

        maskSensitive(safeCopy);

        console.log(`\n📤 ${label}:`);
        console.log(JSON.stringify(safeCopy, null, 2));
    }
}

// Export singleton helper
let diagnosticsInstance: GeminiDiagnostics | null = null;

export function getDiagnostics(apiKey?: string): GeminiDiagnostics {
    if (!diagnosticsInstance && apiKey) {
        diagnosticsInstance = new GeminiDiagnostics(apiKey);
    }
    if (!diagnosticsInstance) {
        throw new Error('Diagnostics not initialized - call with API key first');
    }
    return diagnosticsInstance;
}
