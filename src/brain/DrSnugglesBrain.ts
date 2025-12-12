/**
 * DrSnugglesBrain.ts
 * 
 * The "Bare Metal Brain" for Dr. Snuggles
 * - Zero framework overhead
 * - Direct Gemini SDK usage
 * - RAG-powered long-term memory via Orama
 * - Personality-driven system prompts
 */

import { OramaMemory } from "./memory/OramaIntegration";
import type { Character } from "./types";
import path from "path";
import fs from "fs";

interface BrainConfig {
    apiKey: string;
    characterPath?: string;
}

interface SessionContext {
    model: string;
    systemInstruction: string;
    tools?: any[];
}

export class DrSnugglesBrain {
    private apiKey: string;
    private memory: OramaMemory;
    private character: Character | null = null;
    private systemInstruction: string = "";
    private conversationBuffer: Array<{ role: string; text: string }> = [];
    private maxBufferSize: number = 10;

    constructor(config: BrainConfig) {
        this.apiKey = config.apiKey;
        this.memory = new OramaMemory();

        // Load character personality
        this.loadCharacter(config.characterPath);
    }

    /**
     * Load Dr. Snuggles' personality from character.json
     */
    private loadCharacter(characterPath?: string): void {
        try {
            const defaultPath = path.resolve(__dirname, "../../../dr_snuggles.character.json");
            const characterFile = characterPath || defaultPath;

            console.log(`[Brain] Loading character from: ${characterFile}`);

            // Read JSON file directly
            const fileContent = fs.readFileSync(characterFile, 'utf-8');
            const character = JSON.parse(fileContent) as Character;
            this.character = character;

            // Build base system instruction from character
            this.systemInstruction = this.buildSystemInstruction(character);

            console.log(`✅ Character loaded: ${character.name}`);
        } catch (error: any) {
            console.warn(`⚠️ Could not load character file: ${error.message}`);
            console.warn("Using default personality");
            this.systemInstruction = "You are Dr. Snuggles, a friendly AI assistant.";
        }
    }

    /**
     * Build system instruction from character definition
     */
    private buildSystemInstruction(character: Character): string {
        // Use explicit system prompt from JSON if available (priority)
        if (character.systemPrompt) {
            return character.systemPrompt;
        }

        const bioText = Array.isArray(character.bio)
            ? character.bio.join("\n")
            : character.bio;

        const styleAll = character.style?.all?.join("\n- ") || "";
        const styleChat = character.style?.chat?.join("\n- ") || "";

        return `You are ${character.name}.

BIO:
${bioText}

STYLE GUIDELINES:
- ${styleAll}
- ${styleChat}

PERSONALITY TRAITS:
${character.adjectives?.join(", ") || "friendly, helpful"}

Remember: Stay in character at all times. You are having a real-time voice conversation.`;
    }

    /**
     * Prepare session context with RAG-enhanced memory
     * Call this BEFORE starting a RealtimeSession
     */
    async prepareSessionContext(userContext?: string): Promise<SessionContext> {
        console.log("🧠 Preparing brain session context...");

        // 1. Fetch relevant long-term memories from Orama
        const relevantMemories = await this.memory.search(userContext || "recent conversation", 5);

        // 2. Build context-enhanced system prompt
        // 2. Build context-enhanced system prompt
        const memoryContext = relevantMemories.length > 0
            ? `\n\nRELEVANT MEMORIES FROM PAST CONVERSATIONS:\n${relevantMemories.map(m => `- ${m.content}`).join("\n")}`
            : "";

        const recentHistory = this.getRecentContext();
        const historyContext = recentHistory
            ? `\n\nRECENT CONVERSATION HISTORY:\n${recentHistory}`
            : "";

        const enhancedSystemInstruction = `${this.systemInstruction}${historyContext}${memoryContext}`;

        // 3. Define available tools (for autonomy)
        const tools = [
            {
                functionDeclarations: [
                    {
                        name: "save_memory",
                        description: "Save an important fact or detail about the user to long-term memory",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                fact: {
                                    type: "STRING",
                                    description: "The fact to remember"
                                },
                                category: {
                                    type: "STRING",
                                    description: "Category: preference, personal_info, or topic_interest"
                                }
                            },
                            required: ["fact"]
                        }
                    },
                    {
                        name: "recall_memory",
                        description: "Retrieve specific memories about a topic",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                query: {
                                    type: "STRING",
                                    description: "What to search for in memory"
                                }
                            },
                            required: ["query"]
                        }
                    }
                ]
            }
        ];

        return {
            model: "gemini-2.0-flash-exp",
            systemInstruction: enhancedSystemInstruction,
            tools: tools
        };
    }

    /**
     * Execute tool calls autonomously
     * This is called when Gemini requests to use a function
     */
    async executeTool(toolName: string, args: any): Promise<any> {
        console.log(`🔧 Executing tool: ${toolName}`, args);

        switch (toolName) {
            case "save_memory":
                await this.memory.saveMemory(args.fact, args.category || "general");
                return { result: "Memory saved successfully" };

            case "recall_memory":
                const memories = await this.memory.search(args.query, 3);
                return {
                    result: `Found ${memories.length} relevant memories`,
                    memories: memories.map(m => m.content)
                };

            default:
                return { error: `Unknown tool: ${toolName}` };
        }
    }

    /**
     * Add a message to the conversation buffer
     * This maintains short-term "working memory"
     */
    addToBuffer(role: "user" | "assistant", text: string): void {
        this.conversationBuffer.push({ role, text });

        // Prune old messages if buffer is too large
        if (this.conversationBuffer.length > this.maxBufferSize) {
            // Keep recent messages, but save the pruned ones to long-term memory
            const pruned = this.conversationBuffer.shift();
            if (pruned && pruned.role === "user") {
                // Optionally save important user messages to Orama
                // this.memory.saveMemory(pruned.text, "conversation");
            }
        }
    }

    /**
     * Get recent conversation history
     */
    getRecentContext(): string {
        return this.conversationBuffer
            .map(msg => `${msg.role}: ${msg.text}`)
            .join("\n");
    }

    /**
     * Clear conversation buffer (e.g., when starting new session)
     */
    clearBuffer(): void {
        this.conversationBuffer = [];
    }

    /**
     * Get character name
     */
    getCharacterName(): string {
        return this.character?.name || "Dr. Snuggles";
    }

    /**
     * Get API key (for use in Gemini Live sessions)
     */
    getApiKey(): string {
        return this.apiKey;
    }

    /**
     * Initialize memory system
     */
    async initializeMemory(): Promise<void> {
        await this.memory.initialize();
    }

    /**
     * Shutdown brain gracefully
     */
    async shutdown(): Promise<void> {
        console.log("🛑 Shutting down brain...");
        // Cleanup if needed
    }

    /**
     * Update system instruction dynamically
     */
    updateSystemInstruction(instruction: string): void {
        console.log(`[Brain] 📝 Updating system instruction (${instruction.length} chars)`);
        this.systemInstruction = instruction;
    }
}
