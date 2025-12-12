/**
 * types.ts
 * 
 * TypeScript types for the Brain system
 */

export interface Character {
    name: string;
    bio: string | string[];
    username?: string;
    id?: string;
    system?: string;
    systemPrompt?: string;
    adjectives?: string[];
    topics?: string[];
    knowledge?: Array<string | { path: string; shared?: boolean }>;
    messageExamples?: any[][];
    postExamples?: string[];
    style?: {
        all?: string[];
        chat?: string[];
        post?: string[];
    };
    plugins?: string[];
    settings?: {
        secrets?: Record<string, any>;
        [key: string]: any;
    };
}

export interface Memory {
    id: string;
    content: string;
    category: string;
    timestamp: number;
    embedding?: number[];
}

export interface ToolCall {
    name: string;
    arguments: Record<string, any>;
}

export interface ToolResult {
    result?: any;
    error?: string;
    memories?: string[];
}
