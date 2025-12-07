# CLAUDE.md - AI Assistant Guide for Dr. Snuggles Audio Node

**Last Updated:** 2025-12-07
**Project Status:** 95% Complete - Production Ready

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Directory Structure](#directory-structure)
4. [Key Components](#key-components)
5. [Development Workflows](#development-workflows)
6. [Build & Deployment](#build--deployment)
7. [Environment Setup](#environment-setup)
8. [Code Conventions](#code-conventions)
9. [Testing & Debugging](#testing--debugging)
10. [Common AI Assistant Tasks](#common-ai-assistant-tasks)
11. [Important Files Reference](#important-files-reference)

---

## 🎯 Project Overview

**Dr. Snuggles Audio Node** is an Electron-based desktop application that serves as a local-first AI audio companion for Twitter Spaces and live streaming. It's part of the Echosphere AI system.

### Core Purpose
- Real-time AI voice interaction using Google Gemini Live API
- Low-latency audio processing for live broadcasts
- RAG-powered knowledge retrieval from local documents
- Session memory and conversation tracking
- Professional audio routing via VoiceMeeter integration

### Key Technologies
- **Runtime:** Electron (v33.2.0), Node.js v18+
- **Frontend:** React 18, TypeScript, Vite
- **AI/ML:** Google Gemini Live API (@google/genai)
- **Audio:** Web Audio API, custom resampling
- **Database:** Dexie.js (IndexedDB), Orama (vector search)
- **Build:** TypeScript, Vite bundler, Concurrently

### Technical Highlights
- **Zero-cost architecture** (Google Gemini free tier)
- **48GB RAM optimized** for local processing
- **Audio-only design** (no avatars/visuals)
- **Local-first storage** (no cloud dependencies)
- **2,205 lines of TypeScript/React code**

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│          ELECTRON MAIN PROCESS                  │
│                                                 │
│  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ AudioManager │  │ GeminiLiveClient        │ │
│  │ (2025)       │◄─┤ - WebSocket (16kHz)     │ │
│  │ - Resampler  │  │ - Charon voice          │ │
│  │ - Volume     │  │ - Dr. Snuggles prompt   │ │
│  │ - VAD        │  │ - Latency tracking      │ │
│  └──────────────┘  └─────────────────────────┘ │
│                                                 │
│  ┌──────────────┐  ┌─────────────────────────┐ │
│  │KnowledgeStore│  │ SessionMemoryService    │ │
│  │ - Orama RAG  │  │ - Dexie.js (IndexedDB)  │ │
│  │ - PDF parse  │  │ - Conversations         │ │
│  │ - Vector idx │  │ - Session summaries     │ │
│  └──────────────┘  └─────────────────────────┘ │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ DrSnugglesBrain                         │   │
│  │ - Character loading                     │   │
│  │ - System instruction generation         │   │
│  │ - RAG integration                       │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                       ▲
                       │ IPC (Context Bridge)
                       ▼
┌─────────────────────────────────────────────────┐
│       ELECTRON RENDERER (React)                 │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  DrSnugglesControlCenter (Main UI)      │   │
│  │   - Connection status                   │   │
│  │   - Audio device selection              │   │
│  │   - Volume meters                       │   │
│  │   - Live transcript                     │   │
│  │   - Analytics dashboard                 │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Services Layer                         │   │
│  │   - audioCaptureService                 │   │
│  │   - audioPlaybackService                │   │
│  │   - analyticsService                    │   │
│  │   - transcriptExporter                  │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Audio Pipeline

```
INPUT FLOW:
Microphone (48kHz Float32)
  → Web Audio API (Renderer)
  → IPC Send to Main
  → AudioResampler (48kHz → 16kHz PCM16)
  → VoiceActivityDetector
  → Gemini Live WebSocket

OUTPUT FLOW:
Gemini Live WebSocket (24kHz PCM16)
  → AudioResampler (24kHz → 48kHz Float32)
  → IPC Send to Renderer
  → Web Audio API
  → Speakers/VoiceMeeter
```

### IPC Communication Channels

Defined in `src/shared/types.ts` under `IPC_CHANNELS`:

**Audio Control:**
- `genai:startSession` - Initialize Gemini Live session
- `genai:sendAudioChunk` - Stream audio to Gemini
- `genai:audioReceived` - Receive audio from Gemini
- `genai:latencyUpdate` - Real-time latency metrics
- `genai:vadState` - Voice Activity Detection state

**Configuration:**
- `get-audio-devices` - Enumerate available devices
- `set-audio-devices` - Configure input/output
- `update-brain-config` - Modify AI personality
- `set-voice` - Change Gemini voice
- `update-system-prompt` - Customize AI behavior

**Knowledge & Memory:**
- `load-knowledge` - Import PDFs/TXT files
- `search-knowledge` - RAG query
- `get-session-memory` - Retrieve conversation history
- `get-analytics` - Fetch usage statistics

---

## 📁 Directory Structure

```
127AiCohostAPp/
├── .git/                       # Git repository
├── knowledge/                  # Place PDF/TXT files here for RAG
│   └── README.md              # Knowledge base documentation
├── src/
│   ├── main/                  # Electron Main Process
│   │   ├── audio/
│   │   │   ├── audioManager2025.ts    # Volume monitoring
│   │   │   ├── audioManager.ts        # Legacy audio manager
│   │   │   ├── resampler.ts           # Sample rate conversion
│   │   │   └── vad.ts                 # Voice Activity Detection
│   │   ├── llm/
│   │   │   ├── geminiLiveClient.ts    # WebSocket client (16kHz)
│   │   │   ├── geminiClient.ts        # Legacy client
│   │   │   └── geminiDiagnostics.ts   # API validation
│   │   ├── knowledge/
│   │   │   ├── ingestor.ts            # PDF/TXT parsing
│   │   │   └── store.ts               # Orama vector database
│   │   ├── memory/
│   │   │   └── database.ts            # Dexie.js conversations
│   │   ├── scripts/
│   │   │   └── verify-api.ts          # API key checker
│   │   ├── main2025.ts                # PRIMARY ENTRY POINT
│   │   ├── main.ts                    # Legacy entry point
│   │   └── preload.ts                 # Context bridge
│   ├── brain/
│   │   ├── memory/
│   │   │   └── OramaIntegration.ts    # RAG memory layer
│   │   ├── DrSnugglesBrain.ts         # Core AI personality
│   │   ├── types.ts                   # Brain type definitions
│   │   ├── test-brain.ts              # Brain testing utility
│   │   └── USAGE_EXAMPLE.ts           # Implementation examples
│   ├── renderer/                      # React Frontend
│   │   ├── components/
│   │   │   ├── panels/                # UI panels (11 components)
│   │   │   │   ├── AICohostPanel.tsx
│   │   │   │   ├── AudioInputPanel.tsx
│   │   │   │   ├── BrainControlsPanel.tsx
│   │   │   │   ├── ChatPanel.tsx
│   │   │   │   ├── DrSnugglesVisualizer.tsx
│   │   │   │   ├── LiveAnalyticsPanel.tsx
│   │   │   │   ├── LiveTranscriptPanel.tsx
│   │   │   │   ├── PersonalityPanel.tsx
│   │   │   │   ├── QuickCommandsPanel.tsx
│   │   │   │   ├── SessionMemoryPanel.tsx
│   │   │   │   └── SystemPromptPanel.tsx
│   │   │   ├── DrSnugglesControlCenter.tsx  # MAIN UI
│   │   │   ├── Dashboard.tsx                # Legacy dashboard
│   │   │   └── ControlCenter.tsx            # Alternative UI
│   │   ├── services/
│   │   │   ├── audioCaptureService.ts      # Microphone capture
│   │   │   ├── audioPlaybackService.ts     # Speaker output
│   │   │   ├── analyticsService.ts         # Usage tracking
│   │   │   ├── clipDetectionService.ts     # Highlight detection
│   │   │   ├── transcriptExporter.ts       # Export conversations
│   │   │   └── voicePreviewService.ts      # Voice testing
│   │   ├── public/
│   │   │   └── dr-snuggles.png            # App icon (331KB)
│   │   ├── App.tsx                        # Root React component
│   │   └── index.tsx                      # Renderer entry point
│   ├── shared/
│   │   ├── types.ts                       # Shared TypeScript types
│   │   └── pdf-parse.d.ts                 # PDF library types
│   └── lib/
│       └── audioResampler.ts              # Optimized resampling
├── dist/                                  # Build output (gitignored)
│   ├── main/                             # Compiled main process
│   └── renderer/                         # Bundled frontend
├── dr_snuggles.character.json            # AI personality definition
├── package.json                          # NPM dependencies
├── package-lock.json                     # Locked dependency tree
├── tsconfig.json                         # TypeScript config (renderer)
├── tsconfig.main.json                    # TypeScript config (main)
├── vite.config.ts                        # Vite bundler config
├── .gitignore                            # Git exclusions
├── .env.local                            # Environment variables (not in repo)
├── README.md                             # User documentation
├── IMPLEMENTATION_NOTES.md               # Development status
└── CLAUDE.md                             # This file
```

---

## 🔧 Key Components

### Main Process Components

#### 1. **GeminiLiveClient** (`src/main/llm/geminiLiveClient.ts`)
- **Purpose:** WebSocket connection to Gemini Live API
- **Features:**
  - Native audio model (16kHz PCM16 input)
  - Charon voice configuration
  - Dr. Snuggles system prompt injection
  - Latency tracking
  - Connection retry logic
- **Key Methods:**
  - `connect()` - Establish WebSocket
  - `sendAudio(chunk: Int16Array)` - Stream audio
  - `disconnect()` - Graceful shutdown

#### 2. **AudioManager2025** (`src/main/audio/audioManager2025.ts`)
- **Purpose:** Audio processing and monitoring
- **Features:**
  - Volume RMS calculation
  - Device configuration
  - Mute functionality
- **Note:** Actual capture/playback happens in renderer (Web Audio API)

#### 3. **AudioResampler** (`src/main/audio/resampler.ts`)
- **Purpose:** Sample rate conversion
- **Conversions:**
  - 48kHz Float32 → 16kHz Int16 (input)
  - 24kHz Int16 → 48kHz Float32 (output)
- **Algorithm:** Linear interpolation
- **Critical for:** Gemini API compatibility

#### 4. **VoiceActivityDetector** (`src/main/audio/vad.ts`)
- **Purpose:** Intelligent turn-taking
- **Features:**
  - Energy threshold detection
  - Silence/speech frame counting
  - Configurable sensitivity
- **Benefit:** Reduces bandwidth and prevents interruptions

#### 5. **KnowledgeStore** (`src/main/knowledge/store.ts`)
- **Purpose:** RAG (Retrieval-Augmented Generation)
- **Stack:**
  - Orama for vector indexing
  - pdf-parse for PDF extraction
  - File system for persistence (`snuggles-index.json`)
- **Features:**
  - Document chunking (500-2000 words)
  - Semantic search
  - Relevance scoring

#### 6. **SessionMemoryService** (`src/main/memory/database.ts`)
- **Purpose:** Conversation history
- **Stack:** Dexie.js (IndexedDB wrapper)
- **Storage:**
  - Individual conversation turns
  - Session summaries
  - Automatic pruning (30 days)
- **Schema:**
  - `conversationTurns` table
  - `sessionSummaries` table

#### 7. **DrSnugglesBrain** (`src/brain/DrSnugglesBrain.ts`)
- **Purpose:** AI personality core
- **Features:**
  - Loads `dr_snuggles.character.json`
  - Builds system instructions
  - Integrates RAG memory
  - Manages conversation buffer
- **Key Method:** `prepareSessionContext()` - Pre-session setup

### Renderer Components

#### 1. **DrSnugglesControlCenter** (`src/renderer/components/DrSnugglesControlCenter.tsx`)
- **Purpose:** Main UI dashboard
- **Panels:**
  - AI Cohost status
  - Audio input controls
  - Live transcript
  - Session memory
  - Analytics
  - Brain controls
  - Personality mixer
  - Quick commands
- **Layout:** Grid-based responsive design

#### 2. **audioCaptureService** (`src/renderer/services/audioCaptureService.ts`)
- **Purpose:** Microphone access
- **Stack:** Web Audio API
- **Process:**
  1. `navigator.mediaDevices.getUserMedia()`
  2. AudioContext creation
  3. AudioWorkletNode processing
  4. IPC streaming to main process

#### 3. **audioPlaybackService** (`src/renderer/services/audioPlaybackService.ts`)
- **Purpose:** Speaker output
- **Features:**
  - Audio queue management
  - Volume control
  - Device selection
  - Smooth playback transitions

#### 4. **analyticsService** (`src/renderer/services/analyticsService.ts`)
- **Metrics Tracked:**
  - Speaking time ratio (AI vs User)
  - Response latency
  - Interrupt count
  - Sentiment analysis
  - Clip-worthy moments

---

## 🔄 Development Workflows

### Starting Development

```bash
npm run dev
```

This runs **two concurrent processes**:
1. `dev:main` - TypeScript compilation + Electron launch
2. `dev:renderer` - Vite dev server (HMR disabled)

**How it works:**
- Vite serves React UI on `http://localhost:5173`
- Electron main process loads the dev server
- Changes trigger hot reload (HMR disabled to prevent loops)

### Building for Production

```bash
npm run build
```

**Steps:**
1. Compiles main process: `tsc -p tsconfig.main.json`
2. Bundles renderer: `vite build`

**Output:**
- `dist/main/` - Compiled main process (CommonJS)
- `dist/renderer/` - Bundled React app (static assets)

### Running Built Application

```bash
npm start
```

Launches Electron with production builds.

### Verifying API Configuration

```bash
npm run verify-api
```

Runs diagnostic checks on Gemini API key.

---

## 🛠️ Build & Deployment

### Build Configuration

**Main Process:**
- Config: `tsconfig.main.json`
- Target: ES2022 (CommonJS)
- Output: `dist/main/`
- Entry: `src/main/main2025.ts` → `dist/main/main/main2025.js`

**Renderer Process:**
- Config: `vite.config.ts`
- Target: ESNext (ESM)
- Output: `dist/renderer/`
- Entry: `src/renderer/index.tsx`
- Assets: Hashed filenames (cache busting)

### Package.json Entry Points

```json
{
  "main": "dist/main/main/main2025.js",
  "type": "commonjs"
}
```

### Environment Variables

**Location:** `../.env.local` (one directory above project root)

**Required:**
```env
GEMINI_API_KEY=your_api_key_here
```

**Note:** The main process loads `.env.local` from `process.cwd()/../.env.local` to avoid dist/ path issues.

### Deployment Checklist

1. ✅ Ensure `.env.local` exists with valid API key
2. ✅ Run `npm install` for dependencies
3. ✅ Add knowledge files to `knowledge/` directory
4. ✅ Run `npm run build` to compile
5. ✅ Test with `npm start`
6. ✅ Configure VoiceMeeter audio routing
7. ✅ Package with Electron Builder (not configured yet)

---

## ⚙️ Environment Setup

### Prerequisites

- **Node.js:** v18+ (tested on v18.x)
- **npm:** v9+ (comes with Node.js)
- **OS:** Windows, macOS, Linux
- **Audio:** VoiceMeeter Banana/Potato (recommended)
- **RAM:** 48GB optimized (works with less)

### Installation Steps

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd 127AiCohostAPp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Create in parent directory
   cd ..
   echo "GEMINI_API_KEY=your_key_here" > .env.local
   cd 127AiCohostAPp
   ```

4. **Add knowledge files:**
   ```bash
   cp your_documents.pdf knowledge/
   ```

5. **Start development:**
   ```bash
   npm run dev
   ```

### VoiceMeeter Setup

1. Install VoiceMeeter Banana or Potato
2. Configure virtual audio cables:
   - **Input:** Set "VoiceMeeter Output" as app microphone
   - **Output:** Set "VoiceMeeter Input" as app speaker
3. Route streaming software:
   - OBS/StreamYard → VoiceMeeter Input
   - VoiceMeeter Output → Streaming software

---

## 📝 Code Conventions

### TypeScript Style

- **Strict mode enabled:** All compiler strictness flags on
- **No unused variables:** `noUnusedLocals: true`
- **Explicit return types:** Required for public APIs
- **Interface over type:** Use `interface` for object shapes

### File Naming

- **Components:** PascalCase (`DrSnugglesControlCenter.tsx`)
- **Services:** camelCase (`audioCaptureService.ts`)
- **Types:** PascalCase for interfaces (`AudioDevice`)
- **Constants:** UPPER_SNAKE_CASE (`IPC_CHANNELS`)

### Import Organization

```typescript
// 1. Node.js built-ins
import fs from 'fs';
import path from 'path';

// 2. Third-party packages
import { app, BrowserWindow } from 'electron';
import dotenv from 'dotenv';

// 3. Internal modules
import { GeminiLiveClient } from './llm/geminiLiveClient';
import { IPC_CHANNELS } from '../shared/types';

// 4. Types
import type { BrainConfig } from './types';
```

### IPC Pattern

**Main process handler:**
```typescript
ipcMain.handle(IPC_CHANNELS.CONNECT_GEMINI, async (event, config) => {
  try {
    await geminiClient.connect();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

**Renderer invocation:**
```typescript
const result = await window.electronAPI.connectGemini(config);
if (result.success) {
  // Handle success
}
```

### Error Handling

- **Async/await with try-catch:** Standard pattern
- **Graceful degradation:** Continue on non-critical errors
- **User-facing errors:** Show in UI, log to file
- **Debug logging:** File log at `userData/snuggles_debug.log`

### Logging Convention

```typescript
console.log('[ComponentName] Message');       // Info
console.warn('[ComponentName] Warning');      // Warning
console.error('[ComponentName] Error:', err); // Error
```

**Example:**
```typescript
console.log('[GeminiLiveClient] 🔌 Connecting to WebSocket...');
console.error('[AudioManager] ❌ Failed to enumerate devices:', error);
```

---

## 🧪 Testing & Debugging

### Debug Log Location

```
Windows: C:\Users\<Username>\AppData\Roaming\snuggles-audio-node\snuggles_debug.log
macOS: ~/Library/Application Support/snuggles-audio-node/snuggles_debug.log
Linux: ~/.config/snuggles-audio-node/snuggles_debug.log
```

**All console.log/error/warn calls are captured to this file.**

### Chrome DevTools

**Open DevTools in Electron:**
- Press `Ctrl+Shift+I` (Windows/Linux)
- Press `Cmd+Option+I` (macOS)
- Or add to main process:
  ```typescript
  mainWindow.webContents.openDevTools();
  ```

### API Verification

```bash
npm run verify-api
```

**Checks:**
- API key format validation
- Network connectivity
- Gemini API endpoint access
- Model availability

### Common Issues

#### 1. API Key Not Loading
**Symptom:** "API key not found" error

**Solution:**
```bash
# Check .env.local location (should be in parent directory)
ls ../.env.local

# Verify key format (starts with AIza...)
cat ../.env.local

# Restart app after changes
```

#### 2. TypeScript Build Warnings
**Issue:** Unused variable warnings in `audioManager.ts` and `main.ts`

**Status:** Non-blocking (app runs fine)

**Fix (optional):**
```typescript
// Option 1: Prefix with underscore
const _unusedVar = value;

// Option 2: Use in debug log
console.log('[Debug]', unusedVar);
```

#### 3. Audio Not Streaming
**Check:**
1. Microphone permissions granted?
2. Correct input device selected?
3. VoiceMeeter configured?
4. Gemini connection established?

**Debug:**
```typescript
// In renderer console
window.electronAPI.getStatus(); // Check connection
```

---

## 🤖 Common AI Assistant Tasks

### Task 1: Add New Knowledge Source

**Steps:**
1. Place PDF/TXT in `knowledge/` directory
2. Delete `snuggles-index.json` (force re-index)
3. Restart application
4. Verify in logs: `[KnowledgeStore] Loaded N documents`

**Code location:** `src/main/knowledge/ingestor.ts`

### Task 2: Modify AI Personality

**Edit:** `dr_snuggles.character.json`

**Key fields:**
- `systemPrompt` - Core personality instructions
- `bio` - Background description
- `style.chat` - Conversation style rules
- `adjectives` - Personality traits

**Testing:**
```bash
npm run build
npm start
# Test via voice or text input
```

### Task 3: Change Gemini Voice

**File:** `src/main/llm/geminiLiveClient.ts`

**Location:** Line ~147 (voice configuration)

```typescript
// Current: Charon voice
const config = {
  model: 'models/gemini-2.0-flash-exp',
  generationConfig: {
    responseModalities: 'audio',
    speechConfig: {
      voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } }
      // Options: Puck, Charon, Kore, Fenrir, Aoede
    }
  }
};
```

### Task 4: Add New IPC Channel

**1. Define in types:**
```typescript
// src/shared/types.ts
export const IPC_CHANNELS = {
  // ... existing channels
  MY_NEW_CHANNEL: 'my-new-channel'
} as const;
```

**2. Add handler in main process:**
```typescript
// src/main/main2025.ts
ipcMain.handle(IPC_CHANNELS.MY_NEW_CHANNEL, async (event, data) => {
  // Handle request
  return { result: 'success' };
});
```

**3. Expose in preload:**
```typescript
// src/main/preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
  // ... existing methods
  myNewMethod: (data) => ipcRenderer.invoke(IPC_CHANNELS.MY_NEW_CHANNEL, data)
});
```

**4. Use in renderer:**
```typescript
// src/renderer/components/MyComponent.tsx
const result = await window.electronAPI.myNewMethod(data);
```

### Task 5: Add Analytics Metric

**File:** `src/renderer/services/analyticsService.ts`

**Example - Track new metric:**
```typescript
export class AnalyticsService {
  private metrics = {
    // ... existing metrics
    myNewMetric: 0
  };

  trackMyMetric(value: number) {
    this.metrics.myNewMetric += value;
  }

  getMetrics(): LiveAnalytics {
    return {
      // ... existing metrics
      myNewMetric: this.metrics.myNewMetric
    };
  }
}
```

### Task 6: Debug Audio Pipeline

**Enable verbose logging:**

```typescript
// src/main/audio/resampler.ts
console.log('[Resampler] Input length:', inputBuffer.length);
console.log('[Resampler] Output length:', outputBuffer.length);
console.log('[Resampler] Sample rate:', inputRate, '→', outputRate);
```

**Check flow:**
1. Renderer capture: `audioCaptureService.ts`
2. IPC send: `genai:sendAudioChunk`
3. Main resampling: `resampler.ts`
4. Gemini send: `geminiLiveClient.ts`
5. Gemini receive: `genai:audioReceived`
6. Main upsample: `resampler.ts`
7. IPC send: Renderer
8. Playback: `audioPlaybackService.ts`

### Task 7: Export Conversation

**File:** `src/renderer/services/transcriptExporter.ts`

**Usage:**
```typescript
import { TranscriptExporter } from './services/transcriptExporter';

const exporter = new TranscriptExporter();
const markdown = exporter.exportToMarkdown(conversationTurns);
// Save to file or clipboard
```

---

## 📚 Important Files Reference

### Critical Files (Do Not Delete)

| File | Purpose | Impact if Missing |
|------|---------|-------------------|
| `src/main/main2025.ts` | Application entry point | App won't start |
| `src/main/preload.ts` | IPC context bridge | No renderer ↔ main communication |
| `src/shared/types.ts` | Shared TypeScript types | Build fails |
| `dr_snuggles.character.json` | AI personality | Falls back to generic AI |
| `package.json` | Dependencies & scripts | Cannot install/build |
| `tsconfig.json` | TypeScript config | Build fails |
| `vite.config.ts` | Renderer bundler config | Frontend build fails |
| `.env.local` (parent dir) | API keys | Gemini connection fails |

### Configuration Files

| File | What It Configures |
|------|-------------------|
| `tsconfig.json` | Renderer TypeScript compilation |
| `tsconfig.main.json` | Main process TypeScript compilation |
| `vite.config.ts` | Vite bundler (dev server, build) |
| `package.json` | NPM scripts, dependencies, Electron entry |
| `dr_snuggles.character.json` | AI personality, voice, style |

### Generated Files (Safe to Delete)

| File/Directory | Regenerated By |
|----------------|----------------|
| `dist/` | `npm run build` |
| `node_modules/` | `npm install` |
| `snuggles-index.json` | Auto-created on startup (knowledge index) |
| `snuggles_debug.log` | Auto-created on startup |
| `config.json` (userData) | Auto-created on first run |

### Editable Without Breaking

- `README.md` - User documentation
- `IMPLEMENTATION_NOTES.md` - Development notes
- `CLAUDE.md` - This file
- `knowledge/*.pdf` - Knowledge base documents
- `knowledge/*.txt` - Knowledge base documents
- `src/renderer/components/panels/*` - UI panels (modular)
- `dr_snuggles.character.json` - Personality (safe to customize)

---

## 🎨 UI Component Architecture

### Panel System

All UI panels in `src/renderer/components/panels/` are **modular and independent**.

**Panel List:**
1. **AICohostPanel** - AI status indicator
2. **AudioInputPanel** - Microphone controls
3. **BrainControlsPanel** - AI configuration sliders
4. **ChatPanel** - Text message input
5. **DrSnugglesVisualizer** - Waveform visualization
6. **LiveAnalyticsPanel** - Usage statistics
7. **LiveTranscriptPanel** - Real-time conversation
8. **PersonalityPanel** - Comedy/research/energy mixer
9. **QuickCommandsPanel** - Keyboard shortcuts
10. **SessionMemoryPanel** - Conversation history
11. **SystemPromptPanel** - System instruction editor

**Adding a new panel:**
```typescript
// 1. Create file: src/renderer/components/panels/MyPanel.tsx
export function MyPanel() {
  return <div>My Panel Content</div>;
}

// 2. Import in DrSnugglesControlCenter.tsx
import { MyPanel } from './panels/MyPanel';

// 3. Add to layout
<div className="panel">
  <MyPanel />
</div>
```

---

## 🔐 Security Considerations

### API Key Storage

- **Location:** `../.env.local` (outside repo)
- **Access:** Main process only (not exposed to renderer)
- **Transmission:** Never logged or sent to third parties

### Electron Security

- **Context Isolation:** Enabled (preload script sandboxed)
- **Node Integration:** Disabled in renderer
- **Remote Module:** Disabled
- **IPC:** Whitelist pattern (only exposed methods callable)

### Data Privacy

- **Local-first:** All data stored on device
- **No telemetry:** No analytics sent to external servers
- **Knowledge base:** Never uploaded to Gemini (RAG results only)

---

## 🚀 Performance Optimization

### Memory Management

- **Conversation buffer:** Limited to 10 recent turns
- **Audio chunks:** Stream processing (no large buffers)
- **Vector index:** Disk-persisted (avoids re-indexing)

### Latency Optimization

- **Direct WebSocket:** No REST API overhead
- **VAD gating:** Only stream when speaking
- **16kHz audio:** Minimal bandwidth
- **Resampling:** Optimized linear interpolation

### Build Size

- **Tree shaking:** Vite removes unused code
- **Code splitting:** Lazy load components
- **Asset optimization:** Hashed filenames for caching

---

## 📖 Learning Resources

### Understanding Electron IPC

**Main Process ↔ Renderer Communication:**
- Main = Node.js environment (file system, APIs)
- Renderer = Chromium browser (React UI)
- Bridge = Preload script (contextBridge + ipcRenderer)

**Pattern:**
```typescript
// Renderer Request
window.electronAPI.someMethod(data)
  ↓ IPC Message
// Main Handler
ipcMain.handle('channel', async (event, data) => { ... })
  ↓ Return Value
// Renderer Receives
const result = await window.electronAPI.someMethod(data);
```

### Gemini Live API

**Key Concepts:**
- **Native audio model:** `gemini-2.0-flash-exp`
- **Input:** 16kHz PCM16 mono
- **Output:** 24kHz PCM16 mono
- **Protocol:** WebSocket (bidirectional streaming)
- **Voices:** Puck, Charon, Kore, Fenrir, Aoede

**Documentation:** https://ai.google.dev/api/multimodal-live

### Orama Vector Search

**Purpose:** Fast semantic search over documents

**How it works:**
1. Text → Vector embedding (TF-IDF or custom)
2. Query → Vector embedding
3. Similarity search (cosine similarity)
4. Return top-k results

**Implementation:** `src/main/knowledge/store.ts`

---

## 🎯 Roadmap & Known Limitations

### Current Status: 95% Complete

**What works:**
- ✅ Gemini Live WebSocket connection
- ✅ Audio resampling pipeline
- ✅ Voice Activity Detection
- ✅ RAG knowledge retrieval
- ✅ Session memory storage
- ✅ React dashboard UI
- ✅ IPC communication layer
- ✅ Dr. Snuggles personality
- ✅ Latency tracking
- ✅ Volume monitoring

**Known issues (5%):**
- ⚠️ TypeScript unused variable warnings (non-blocking)
- ⚠️ HMR disabled in dev mode (prevents loops)
- ⚠️ No Electron Builder config (manual packaging)

**Future enhancements:**
- 🔮 Multi-voice support (switch voices mid-session)
- 🔮 Cloud sync (optional backup)
- 🔮 Plugin system (extend functionality)
- 🔮 Mobile companion app (remote control)
- 🔮 Advanced clip detection (auto-highlight viral moments)

---

## 📞 Getting Help

### Debugging Checklist

1. ✅ Check `snuggles_debug.log` for errors
2. ✅ Verify `.env.local` exists with valid API key
3. ✅ Run `npm run verify-api` for diagnostics
4. ✅ Ensure Node.js version is 18+
5. ✅ Check Chrome DevTools console (Ctrl+Shift+I)
6. ✅ Verify VoiceMeeter is running (if using)
7. ✅ Test with simple text input first (fallback mode)

### Common Error Messages

**"API key not found"**
→ Create `../.env.local` with `GEMINI_API_KEY=...`

**"WebSocket connection failed"**
→ Check internet connection, firewall settings

**"No audio devices found"**
→ Grant microphone permissions in OS settings

**"Cannot find module 'dist/main/main/main2025.js'"**
→ Run `npm run build` before `npm start`

---

## 🏁 Quick Start for AI Assistants

**When asked to work on this codebase:**

1. **Understand current goal:** What is the user trying to achieve?
2. **Identify component:** Which file(s) need modification?
3. **Check dependencies:** What other components are affected?
4. **Read existing code:** Understand current implementation
5. **Make minimal changes:** Don't over-engineer
6. **Test locally:** Ensure build succeeds
7. **Verify functionality:** Check logs and UI

**Key principles:**
- 🎯 **Simplicity over cleverness**
- 🔍 **Read before writing**
- 🧪 **Test incrementally**
- 📝 **Document changes**
- 🚫 **Avoid breaking existing functionality**

---

**End of CLAUDE.md**

*This guide is maintained by AI assistants working on the Dr. Snuggles Audio Node project. Update this file whenever significant architectural changes occur.*
