/**
 * OramaIntegration.ts
 * 
 * Lightweight wrapper around Orama for RAG-powered long-term memory
 */

import { create, insert, search } from "@orama/orama";
import type { Orama, SearchParams } from "@orama/orama";

interface Memory {
    id: string;
    content: string;
    category: string;
    timestamp: number;
    embedding?: number[];
}

interface MemorySearchResult {
    id: string;
    content: string;
    score: number;
}

export class OramaMemory {
    private db: Orama<any> | null = null;
    private initialized: boolean = false;

    /**
     * Initialize the Orama database
     */
    async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            this.db = await create({
                schema: {
                    id: "string",
                    content: "string",
                    category: "string",
                    timestamp: "number",
                },
            });

            this.initialized = true;
            console.log("✅ Orama memory initialized");
        } catch (error) {
            console.error("❌ Failed to initialize Orama:", error);
            throw error;
        }
    }

    /**
     * Save a new memory
     */
    async saveMemory(content: string, category: string = "general"): Promise<void> {
        if (!this.db) {
            await this.initialize();
        }

        try {
            await insert(this.db!, {
                id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                content,
                category,
                timestamp: Date.now(),
            });

            console.log(`💾 Memory saved: ${content.substring(0, 50)}...`);
        } catch (error) {
            console.error("❌ Failed to save memory:", error);
        }
    }

    /**
     * Search for relevant memories
     */
    async search(query: string, limit: number = 5): Promise<MemorySearchResult[]> {
        if (!this.db) {
            await this.initialize();
        }

        try {
            const searchParams: SearchParams<Orama<any>> = {
                term: query,
                limit,
                properties: ["content", "category"],
            };

            const results = await search(this.db!, searchParams);

            return results.hits.map((hit: any) => ({
                id: hit.document.id,
                content: hit.document.content,
                score: hit.score,
            }));
        } catch (error) {
            console.error("❌ Failed to search memories:", error);
            return [];
        }
    }

    /**
     * Get recent memories by category
     */
    async getRecentByCategory(category: string, limit: number = 10): Promise<MemorySearchResult[]> {
        return this.search(category, limit);
    }

    /**
     * Get all memories (for debugging)
     */
    async getAllMemories(): Promise<Memory[]> {
        if (!this.db) return [];

        try {
            const results = await search(this.db, {
                term: "",
                limit: 1000,
            });

            return results.hits.map((hit: any) => hit.document as Memory);
        } catch (error) {
            console.error("❌ Failed to get all memories:", error);
            return [];
        }
    }

    /**
     * Clear all memories (use with caution!)
     */
    async clear(): Promise<void> {
        if (this.db) {
            // Reinitialize to clear
            this.initialized = false;
            await this.initialize();
            console.log("🗑️ Memory cleared");
        }
    }
}
