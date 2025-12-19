/**
 * Session Memory Service - File-based Storage
 *
 * Manages persistent storage for session summaries and conversation history.
 * Uses JSON file storage instead of IndexedDB (which is not available in Node.js/main process).
 */

import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { SessionSummary } from '../../shared/types';

export class SessionMemoryService {
  private dbPath: string;
  private summaries: SessionSummary[] = [];

  constructor() {
    // Store in userData directory
    this.dbPath = path.join(app.getPath('userData'), 'session-memory.json');
    this.loadFromDisk();
  }

  /**
   * Load summaries from disk.
   */
  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf-8');
        this.summaries = JSON.parse(data);
        console.log(`[SessionMemory] Loaded ${this.summaries.length} summaries from disk`);
      } else {
        console.log('[SessionMemory] No existing data file, starting fresh');
        this.summaries = [];
      }
    } catch (error) {
      console.error('[SessionMemory] Failed to load from disk:', error);
      this.summaries = [];
    }
  }

  /**
   * Save summaries to disk.
   */
  private saveToDisk(): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.summaries, null, 2), 'utf-8');
      console.log(`[SessionMemory] Saved ${this.summaries.length} summaries to disk`);
    } catch (error) {
      console.error('[SessionMemory] Failed to save to disk:', error);
    }
  }

  /**
   * Add a new session summary.
   * @param summary The session summary to add.
   */
  async addSummary(summary: SessionSummary): Promise<void> {
    this.summaries.push(summary);
    // Keep only last 100 summaries
    if (this.summaries.length > 100) {
      this.summaries = this.summaries.slice(-100);
    }
    this.saveToDisk();
  }

  /**
   * Get recent session summaries.
   * @param count Number of summaries to retrieve.
   */
  async getRecentSummaries(count: number): Promise<string[]> {
    // Sort by timestamp (newest first) and take the requested count
    const sorted = [...this.summaries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);

    return sorted.map(s => s.summary);
  }

  /**
   * Get all summaries.
   */
  async getAllSummaries(): Promise<SessionSummary[]> {
    return [...this.summaries].sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Clear all summaries.
   */
  async clearAll(): Promise<void> {
    this.summaries = [];
    this.saveToDisk();
  }
}
