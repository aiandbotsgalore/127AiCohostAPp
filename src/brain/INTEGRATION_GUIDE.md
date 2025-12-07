/**
 * BRAIN INTEGRATION GUIDE
 * 
 * How to wire DrSnugglesBrain into GeminiLiveClient
 * 
 * This guide shows you how to enhance your Gemini Live sessions with:
 * - RAG-powered memory
 * - Personality from character.json
 * - Autonomous tool calling
 */

## STEP 1: Import the Brain

Add this import at the top of `geminiLiveClient.ts`:

```typescript
import { DrSnugglesBrain } from '../brain/DrSnugglesBrain';
```

## STEP 2: Add Brain as a Class Property

In the `GeminiLiveClient` class, add:

```typescript
export class GeminiLiveClient extends EventEmitter<GeminiLiveClientEvents> {
  private genAI: GoogleGenAI;
  private session: any = null;
  private isConnected: boolean = false;
  
  // Add this:
  private brain: DrSnugglesBrain | null = null;
  
  // ... rest of properties
}
```

## STEP 3: Update Constructor to Accept Brain

```typescript
constructor(apiKey: string, brain?: DrSnugglesBrain) {
  super();
  this.genAI = new GoogleGenAI({ apiKey });
  this.vad = new VoiceActivityDetector({ sampleRate: 48000 });
  
  //  Add this:
  this.brain = brain || null;
  
  console.log('[GeminiLiveClient] Initialized with SDK v1.30.0+');
  console.log(`[GeminiLiveClient] Model: ${MODEL_NAME}`);
  console.log(`[GeminiLiveClient] Voice: ${VOICE_NAME}`);
  
  // Add this:
  if (this.brain) {
    console.log(`[GeminiLiveClient] 🧠 Brain integration ACTIVE`);
  }
}
```

## STEP 4: Modify buildSystemInstruction to Use Brain

Replace the entire `buildSystemInstruction` method with:

```typescript
private async buildSystemInstruction(config: SessionConfig): Promise<string> {
  // If brain is available, use it to prepare context
  if (this.brain) {
    console.log('[GeminiLiveClient] 🧠 Using Brain for system instruction');
    
    // Get brain-enhanced context
    const brainContext = await this.brain.prepareSessionContext(
      config.knowledgeContext || "conversation"
    );
    
    // Brain already includes personality + RAG memories
    let instruction = brainContext.systemInstruction;
    
    // Add current time
    const currentTime = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    });
    instruction += `\n\n**Current System Time:** ${currentTime}\n`;
    
    // Add session history if provided
    if (config.sessionSummaries?.length) {
      instruction += '\n**Previous Session Context:**\n';
      config.sessionSummaries.forEach((summary, i) => {
        instruction += `Session ${i + 1}: ${summary}\n`;
      });
    }
    
    // Add knowledge context (brain will have already searched Orama)
    if (config.knowledgeContext) {
      instruction += '\n**Additional Context:**\n';
      instruction += config.knowledgeContext;
    }
    
    return instruction;
  }
  
  // Fall back to original DR_SNUGGLES_PROMPT if no brain
  const currentTime = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long'
  });

  let instruction = DR_SNUGGLES_PROMPT;
  instruction += `\n\n**Current System Time:** ${currentTime}\n`;

  if (config.sessionSummaries?.length) {
    instruction += '\n**Previous Session Context:**\n';
    config.sessionSummaries.forEach((summary, i) => {
      instruction += `Session ${i + 1}: ${summary}\n`;
    });
  }

  if (config.knowledgeContext) {
    instruction += '\n**Available Knowledge:**\n';
    instruction += config.knowledgeContext;
  }

  if (config.personalityMix) {
    const { comedy, research, energy } = config.personalityMix;
    instruction += `\n**Personality Mix:** Comedy: ${comedy}%, Research: ${research}%, Energy: ${energy}%\n`;
  }

  return instruction;
}
```

## STEP 5: Update connect() to await buildSystemInstruction

Change line ~142 from:

```typescript
const systemInstruction = this.buildSystemInstruction(config);
```

To:

```typescript
const systemInstruction = await this.buildSystemInstruction(config);
```

## STEP 6: Initialize Brain in main2025.ts

In your main process file, initialize the brain:

```typescript
import { DrSnugglesBrain } from './brain/DrSnugglesBrain';
import { GeminiLiveClient } from './llm/geminiLiveClient';

// Load environment
const apiKey = process.env.GEMINI_API_KEY!;

// Initialize brain
const brain = new DrSnugglesBrain({
  apiKey: apiKey,
});

await brain.initializeMemory();

// Pass brain to Gemini Live Client
const geminiClient = new GeminiLiveClient(apiKey, brain);
```

## STEP 7: Handle Tool Calls (Optional - For Future)

When Gemini requests to use save_memory or recall_memory tools, 
you can intercept and execute via the brain:

```typescript
// In handleMessage, detect tool calls:
if (message.toolCall) {
  const result = await this.brain?.executeTool(
    message.toolCall.name,
    message.toolCall.arguments
  );
  // Send result back to Gemini
}
```

## BENEFITS YOU GET

✅ **Personality from character.json** - No more hardcoded DR_SNUGGLES_PROMPT  
✅ **RAG-Enhanced Context** - Relevant memories automatically retrieved from Orama  
✅ **Autonomous Memory** - Gemini can save/recall facts during conversation  
✅ **Zero New Dependencies** - Uses your existing stack  

## TESTING

1. Run the brain test first: `npx tsx src/brain/test-brain.ts`
2. Then start your app with brain integration
3. Check logs for "🧠 Brain integration ACTIVE"

That's it! Your Gemini Live sessions now have a brain! 🧠
