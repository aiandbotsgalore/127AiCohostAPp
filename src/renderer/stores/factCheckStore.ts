import { ipc } from '../ipc';

export interface FactCheck {
    id: string;
    verdict: 'True' | 'False' | 'Misleading' | 'Unverified';
    confidence: number;
    claim: string;
    reason: string;
    timestamp: number;
}

type Listener = () => void;

class FactCheckStore {
    private factChecks: FactCheck[] = [];
    private pinnedClaims: Set<string> = new Set();
    private listeners: Set<Listener> = new Set();
    private initialized = false;

    constructor() {
        this.init();
    }

    private init() {
        if (this.initialized) return;
        this.initialized = true;

        ipc.on('fact-check:claim', (event, claim: FactCheck) => {
            void event;
            this.factChecks = [claim, ...this.factChecks].slice(0, 50);
            this.notify();
        });
    }

    public subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach(l => l());
    }

    public getFactChecks() {
        return this.factChecks;
    }

    public getPinnedClaims() {
        return this.pinnedClaims;
    }

    public togglePin(id: string) {
        const next = new Set(this.pinnedClaims);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        this.pinnedClaims = next;
        this.notify();
    }

    public clear() {
        this.factChecks = [];
        this.pinnedClaims = new Set();
        this.notify();
    }
}

export const factCheckStore = new FactCheckStore();
