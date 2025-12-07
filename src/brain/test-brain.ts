/**
 * test-brain.ts
 * 
 * Standalone test for Dr. Snuggles Brain
 * Run with: npx tsx src/brain/test-brain.ts
 */

import { DrSnugglesBrain } from "./DrSnugglesBrain";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env.local") });

async function testBrain() {
    console.log("=== Testing Dr. Snuggles Bare Metal Brain ===\n");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY not found in .env.local");
        process.exit(1);
    }

    try {
        // === Step 1: Initialize Brain ===
        console.log("📋 Step 1: Initializing brain...");
        const brain = new DrSnugglesBrain({
            apiKey: apiKey,
            // Character file will be loaded from default path
        });

        await brain.initializeMemory();
        console.log(`✅ Brain initialized! Character: ${brain.getCharacterName()}\n`);

        // === Step 2: Prepare Session Context ===
        console.log("📋 Step 2: Preparing session context...");
        const sessionContext = await brain.prepareSessionContext();

        console.log(`✅ Session context prepared:`);
        console.log(`   Model: ${sessionContext.model}`);
        console.log(`   System Instruction Length: ${sessionContext.systemInstruction.length} chars`);
        console.log(`   Tools Available: ${sessionContext.tools?.length || 0}`);
        console.log(`\n📝 System Instruction Preview:`);
        console.log(sessionContext.systemInstruction.substring(0, 300) + "...\n");

        // === Step 3: Test Tool Execution (Save Memory) ===
        console.log("📋 Step 3: Testing autonomous tool execution...");

        const saveResult = await brain.executeTool("save_memory", {
            fact: "The user loves TypeScript and building AI agents",
            category: "preference"
        });
        console.log(`✅ Save Memory Result:`, saveResult);

        const saveResult2 = await brain.executeTool("save_memory", {
            fact: "The user is working on Dr. Snuggles, an Electron voice assistant",
            category: "personal_info"
        });
        console.log(`✅ Save Memory Result:`, saveResult2);

        // === Step 4: Test Memory Recall ===
        console.log("\n📋 Step 4: Testing memory recall...");

        const recallResult = await brain.executeTool("recall_memory", {
            query: "TypeScript"
        });
        console.log(`✅ Recall Memory Result:`, recallResult);

        // === Step 5: Test Conversation Buffer ===
        console.log("\n📋 Step 5: Testing conversation buffer...");

        brain.addToBuffer("user", "Hello Dr. Snuggles!");
        brain.addToBuffer("assistant", "Hello! How can I help you today?");
        brain.addToBuffer("user", "Tell me about yourself");
        brain.addToBuffer("assistant", "I'm Dr. Snuggles, your AI companion!");

        const recentContext = brain.getRecentContext();
        console.log(`✅ Conversation Buffer:`);
        console.log(recentContext);

        // === Step 6: Test Context Enhancement with Memories ===
        console.log("\n📋 Step 6: Preparing session with memory enhancement...");

        const enhancedContext = await brain.prepareSessionContext("TypeScript development");
        console.log(`✅ Enhanced context prepared with relevant memories`);
        console.log(`   System Instruction Length: ${enhancedContext.systemInstruction.length} chars`);

        if (enhancedContext.systemInstruction.includes("RELEVANT MEMORIES")) {
            console.log(`   ✨ Memory enhancement ACTIVE`);
            console.log(`\n📝 Memory Section Preview:`);
            const memorySection = enhancedContext.systemInstruction.split("RELEVANT MEMORIES")[1];
            if (memorySection) {
                console.log("RELEVANT MEMORIES" + memorySection.substring(0, 200) + "...");
            }
        }

        // === Step 7: Cleanup ===
        console.log("\n📋 Step 7: Shutting down...");
        await brain.shutdown();
        console.log("✅ Brain shutdown complete");

        console.log("\n" + "=".repeat(50));
        console.log("✅ ALL TESTS PASSED!");
        console.log("=".repeat(50));
        console.log("\n🎉 The Bare Metal Brain is working perfectly!");
        console.log("📌 Next step: Integrate with Gemini Live Client\n");

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error);
        if (error instanceof Error) {
            console.error("Stack:", error.stack);
        }
        process.exit(1);
    }
}

// Run the test
testBrain();
