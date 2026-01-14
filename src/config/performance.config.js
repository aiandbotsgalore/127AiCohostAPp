/**
 * HARDWARE-OPTIMIZED PERFORMANCE CONFIGURATION
 *
 * Tailored for:
 * - CPU: AMD Ryzen 7 5700 (8 cores / 16 threads)
 * - RAM: 48GB
 * - GPU: NVIDIA GeForce RTX 4060 Ti
 * - Storage: Samsung 980 PRO NVMe SSD
 * - Network: WiFi ~12 Mbps down / 4 Mbps up
 * - Display: 1080p @ 60Hz
 *
 * Usage Profile:
 * - Twitter X Spaces hosting (Chrome browser running concurrently)
 * - 1-hour typical conversation sessions
 * - Primarily voice interaction with text backup
 * - Moderate knowledge base usage
 * - Balanced audio quality preference
 *
 * Optimization Philosophy:
 * - CPU cycles reserved for Chrome (X Spaces) + Electron
 * - Memory abundant, but don't waste it
 * - Network is modest, optimize bandwidth usage
 * - 60fps UI target (matches display refresh rate)
 * - Stability > bleeding-edge performance
 */
export const PERFORMANCE_CONFIG = {
    /**
     * AUDIO CONFIGURATION
     * Balanced quality with efficient CPU usage
     */
    AUDIO: {
        // Buffer size: 4096 samples (~85ms latency at 48kHz)
        // Balanced for quality + CPU efficiency (Chrome is also running)
        BUFFER_SIZE: 4096,
        // Native 48kHz (Gemini Live standard, no resampling needed)
        SAMPLE_RATE: 48000,
        // Conservative - Chrome + X Spaces already using resources
        MAX_CONCURRENT_STREAMS: 2,
        // Single resampler thread (enough for 48kHz, leaves cores for Chrome)
        RESAMPLER_THREADS: 1,
        // VAD sensitivity tuned for online streaming (background noise tolerance)
        VAD_THRESHOLD: 0.015, // Medium sensitivity
        VAD_MIN_SPEECH_FRAMES: 3,
        // Audio queue size for smooth playback during network hiccups
        PLAYBACK_QUEUE_MAX_SECONDS: 5, // 5 seconds of buffering
    },
    /**
     * MEMORY CONFIGURATION
     * Leverage 48GB RAM for caching and buffers
     */
    MEMORY: {
        // Cache full knowledge base (you have plenty of RAM)
        KNOWLEDGE_CACHE_SIZE_MB: 256, // Conservative, leaves room for Chrome
        // 1-hour sessions = ~300-500 messages, keep all in memory
        CONVERSATION_HISTORY_LIMIT: 600,
        // Pre-allocate audio buffers to avoid GC pauses during streaming
        AUDIO_BUFFER_POOL_SIZE: 30,
        // Gemini response buffer (for text streaming)
        MAX_RESPONSE_BUFFER_KB: 512,
    },
    /**
     * STORAGE CONFIGURATION
     * Optimized for NVMe SSD (Samsung 980 PRO)
     */
    STORAGE: {
        // Frequent saves (NVMe can handle it, good for crash recovery)
        SESSION_SAVE_INTERVAL_MS: 10000, // Every 10 seconds
        // Batch writes for SSD longevity
        ENABLE_WRITE_BATCHING: true,
        WRITE_BATCH_SIZE: 50, // Batch 50 operations
        // Log buffering (reduce write amplification)
        LOG_BUFFER_SIZE: 100,
        LOG_FLUSH_INTERVAL_MS: 5000,
        // IndexedDB cache (Dexie for session memory)
        INDEXEDDB_CACHE_SIZE_MB: 100,
    },
    /**
     * GPU CONFIGURATION
     * RTX 4060 Ti - capable but don't overuse for simple visualizations
     */
    GPU: {
        // Enable lightweight canvas visualizations (no WebGL needed for basic waveforms)
        ENABLE_CANVAS_VISUALIZER: true,
        ENABLE_WEBGL_VISUALIZER: false, // Skip unless you want fancy effects later
        // Target 60fps (matches your display refresh rate)
        TARGET_FPS: 60,
        // Electron hardware acceleration (use GPU for rendering, not audio)
        ENABLE_HARDWARE_ACCELERATION: true,
    },
    /**
     * NETWORK CONFIGURATION
     * Optimized for WiFi ~12 Mbps down / 4 Mbps up
     */
    NETWORK: {
        // WebSocket buffer: Conservative for WiFi bandwidth
        WEBSOCKET_SEND_BUFFER_SIZE: 32768, // 32KB
        WEBSOCKET_RECEIVE_BUFFER_SIZE: 65536, // 64KB (more for incoming audio)
        // Retry logic for WiFi stability
        MAX_RETRY_ATTEMPTS: 5,
        RETRY_DELAY_MS: 2000,
        RETRY_BACKOFF_MULTIPLIER: 1.5,
        // Timeout: Generous for WiFi latency
        REQUEST_TIMEOUT_MS: 15000, // 15 seconds
        WEBSOCKET_PING_INTERVAL_MS: 30000, // Keep-alive every 30s
        // Audio chunk size: Smaller chunks for WiFi (less packet loss impact)
        AUDIO_CHUNK_SIZE_SAMPLES: 2048, // ~43ms chunks at 48kHz
    },
    /**
     * UI/UX CONFIGURATION
     * 1080p @ 60Hz, smooth but efficient
     */
    UI: {
        // Animation frame rate (match display)
        ANIMATION_FPS: 60,
        // Enable smooth scrolling (60Hz is fine)
        ENABLE_SMOOTH_SCROLL: true,
        // Toast/notification duration
        TOAST_DURATION_MS: 3000,
        // Debounce for settings saves (reduce localStorage writes)
        SETTINGS_SAVE_DEBOUNCE_MS: 500,
        // Transcript auto-scroll (smooth but not CPU-heavy)
        TRANSCRIPT_SCROLL_BEHAVIOR: 'smooth',
        // Canvas smoke particle count (stylized but efficient)
        AVATAR_SMOKE_PARTICLES: 10, // Modest for CPU efficiency
    },
    /**
     * KNOWLEDGE BASE CONFIGURATION
     * Pre-load for instant search, moderate usage
     */
    KNOWLEDGE: {
        // Load entire knowledge base at startup (you have the RAM)
        PRELOAD_ON_STARTUP: true,
        // Orama search configuration
        SEARCH_RESULT_LIMIT: 10,
        SEARCH_TOLERANCE: 2, // Fuzzy search tolerance
        // Cache search results (moderate usage = good hit rate)
        ENABLE_SEARCH_CACHE: true,
        SEARCH_CACHE_SIZE: 100, // Cache last 100 queries
    },
    /**
     * SYSTEM RESOURCE LIMITS
     * Leave headroom for Chrome + X Spaces
     */
    SYSTEM: {
        // Electron V8 heap size (conservative, leave RAM for Chrome)
        V8_MAX_OLD_SPACE_SIZE_MB: 2048, // 2GB max for Electron
        // Worker thread pool (leave cores for Chrome)
        MAX_WORKER_THREADS: 4, // 4 threads (out of 16 available)
        // GC tuning (aggressive to keep memory clean during long sessions)
        ENABLE_AGGRESSIVE_GC: false, // Let V8 handle it
    },
    /**
     * SESSION CONFIGURATION
     * Optimized for 1-hour conversations
     */
    SESSION: {
        // Auto-save interval (good for long sessions)
        AUTO_SAVE_INTERVAL_MS: 60000, // Every 1 minute
        // Maximum session length before prompting for new session
        MAX_SESSION_DURATION_MS: 3600000, // 1 hour (matches typical usage)
        // Conversation context window (last N messages sent to Gemini)
        CONTEXT_WINDOW_SIZE: 50, // Last 50 messages
    },
};
/**
 * CALCULATED VALUES (runtime)
 */
export const CALCULATED_CONFIG = {
    // Audio buffer duration in seconds
    AUDIO_BUFFER_DURATION_SECONDS: PERFORMANCE_CONFIG.AUDIO.BUFFER_SIZE / PERFORMANCE_CONFIG.AUDIO.SAMPLE_RATE,
    // Playback queue size in samples
    PLAYBACK_QUEUE_SIZE_SAMPLES: PERFORMANCE_CONFIG.AUDIO.PLAYBACK_QUEUE_MAX_SECONDS * PERFORMANCE_CONFIG.AUDIO.SAMPLE_RATE,
    // Network chunk duration
    NETWORK_CHUNK_DURATION_MS: (PERFORMANCE_CONFIG.NETWORK.AUDIO_CHUNK_SIZE_SAMPLES / PERFORMANCE_CONFIG.AUDIO.SAMPLE_RATE) * 1000,
};
/**
 * FEATURE FLAGS (personal use, no security concerns)
 */
export const FEATURE_FLAGS = {
    // Skip security validation (personal use only)
    SKIP_INPUT_VALIDATION: true,
    // Enable debug logging (helpful for development)
    ENABLE_DEBUG_LOGS: true,
    // Enable performance profiling
    ENABLE_PERFORMANCE_PROFILING: true,
    // Skip API key obfuscation (not needed for personal use)
    SKIP_API_KEY_MASKING: true,
};
