#!/usr/bin/env node
/**
 * verify-api - Standalone Gemini API Diagnostics
 * 
 * Run with: npm run verify-api
 * 
 * This script performs comprehensive diagnostics on your Gemini API
 * configuration without starting the full application.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { GeminiDiagnostics, KNOWN_LIVE_MODELS } from '../llm/geminiDiagnostics';

// Load environment
const envPath = path.join(process.cwd(), '../.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
} else {
    // Try local .env.local
    const localEnvPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(localEnvPath)) {
        dotenv.config({ path: localEnvPath, override: true });
    }
}

// Get API key
const apiKey = process.env.GEMINI_API_KEY || '';

// Current model configuration (keep in sync with geminiLiveClient.ts)
const CURRENT_MODEL = 'gemini-2.5-flash-preview-native-audio-dialog';

async function main() {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║         🔍 GEMINI API VERIFICATION TOOL                  ║');
    console.log('║         Dr. Snuggles Diagnostic Suite                    ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('\n');

    if (!apiKey) {
        console.error('❌ FATAL: No API key found!');
        console.error('   Please set GEMINI_API_KEY in your .env.local file');
        console.error('   Location: Snuggles_Audio_Node/.env.local');
        process.exit(1);
    }

    const diagnostics = new GeminiDiagnostics(apiKey);

    // Run basic diagnostics first
    console.log('Phase 1: Basic Checks');
    console.log('─────────────────────');

    const formatResult = diagnostics.validateApiKeyFormat();
    console.log(`   ${formatResult.passed ? '✅' : '❌'} API Key Format: ${formatResult.message}`);

    if (!formatResult.passed) {
        console.error('\n❌ API key format is invalid. Cannot proceed.\n');
        process.exit(1);
    }

    console.log('\n   Verifying API key with Gemini...');
    const keyResult = await diagnostics.verifyApiKey();
    console.log(`   ${keyResult.passed ? '✅' : '❌'} API Key Valid: ${keyResult.message}`);

    if (!keyResult.passed) {
        console.error('\n❌ API key verification failed. Cannot proceed.');
        if (keyResult.suggestion) console.error(`   💡 ${keyResult.suggestion}`);
        process.exit(1);
    }

    // 🔴 THE REAL TEST - Actually try to connect to Live API
    console.log('\n\nPhase 2: REAL Live API Connection Test');
    console.log('──────────────────────────────────────');
    console.log(`   Testing model: ${CURRENT_MODEL}`);

    const liveResult = await diagnostics.testLiveConnection(CURRENT_MODEL);

    console.log(`\n   ${liveResult.passed ? '✅' : '❌'} Live Connection: ${liveResult.message}`);
    if (liveResult.details) {
        console.log(`      Details: ${liveResult.details}`);
    }
    if (liveResult.suggestion) {
        console.log(`      💡 ${liveResult.suggestion}`);
    }

    // Print known models for reference
    console.log('\n\n📋 Known Live API Models (try these if connection fails):');
    KNOWN_LIVE_MODELS.forEach((model, i) => {
        const current = model === CURRENT_MODEL ? ' ← CURRENT' : '';
        console.log(`   ${i + 1}. ${model}${current}`);
    });

    // Exit with appropriate code
    if (liveResult.passed) {
        console.log('\n✅ SUCCESS! Live API connection works with this model.\n');
        process.exit(0);
    } else {
        console.log('\n❌ FAILED: Live API connection did not work.');
        console.log('   The model name is likely the issue. Try a different one from the list above.\n');
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
