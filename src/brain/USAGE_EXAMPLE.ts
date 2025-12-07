/**
 * HOW TO USE THE BRAIN IN MAIN2025.TS
 * 
 * Example of how to initialize and use DrSnugglesBrain with GeminiLiveClient
 */

// === STEP 1: Add imports at the top of main2025.ts ===

import { DrSnugglesBrain } from './brain/DrSnugglesBrain';
import { GeminiLiveClient } from './llm/geminiLiveClient';

// === STEP 2: Initialize brain (in your initialization code) ===

async function initializeAI() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not found in environment');
    }

    // Create brain instance
    console.log('🧠 Initializing Dr. Snuggles Brain...');
    const brain = new DrSnugglesBrain({
        apiKey: apiKey,
        // Character file will be loaded automatically from dr_snuggles.character.json
    });

    // Initialize brain's memory system
    await brain.initializeMemory();
    console.log('✅ Brain initialized with memory');

    // Create Gemini Live client WITH brain
    const geminiClient = new GeminiLiveClient(apiKey, brain);

    return { brain, geminiClient };
}

// === STEP 3: Use in your application ===

// Later in your code when starting a session:
const { brain, geminiClient } = await initializeAI();

// Start Gemini Live session
await geminiClient.connect({
    sessionSummaries: [], // Optional: previous session context
    knowledgeContext: "Twitter Spaces host", // Optional: context hint for RAG search
});

// The brain is now ACTIVE!
// - Personality loaded from character.json
// - RAG memory retrieving relevant facts
// - Ready to save/recall memories autonomously

// === OPTIONAL: Manual memory operations ===

// Save a memory manually
if (brain) {
    await brain.executeTool("save_memory", {
        fact: "User prefers technical discussions about AI",
        category: "preference"
    });
}

// Recall memories manually
if (brain) {
    const result = await brain.executeTool("recall_memory", {
        query: "AI discussions"
    });
    console.log("Recalled memories:", result.memories);
}

// Add to conversation buffer
brain?.addToBuffer("user", "Tell me about machine learning");
brain?.addToBuffer("assistant", "Let me explain neural networks...");

// === CLEANUP on shutdown ===

// When your app closes:
await geminiClient.disconnect();
await brain?.shutdown();

console.log('✅ Brain and client shut down gracefully');

/**
 * WHAT HAPPENS AUTOMATICALLY:
 * 
 * 1. Brain loads dr_snuggles.character.json
 * 2. When geminiClient.connect() is called:
 *    - buildSystemInstruction() detects brain
 *    - Calls brain.prepareSessionContext()
 *    - Brain searches Orama for relevant memories
 *    - Returns enhanced system prompt
 * 3. Gemini Live session starts with:
 *    - Your character's personality
 *    - Relevant memories from past conversations
 *    - Tool definitions for autonomous memory operations
 * 
 * THE BRAIN IS TRANSPARENT - it just makes Dr. Snuggles smarter!
 */
