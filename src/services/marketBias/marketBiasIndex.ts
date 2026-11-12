

import { eventBus } from '../events/EventBus';
import type { MarketBiasEntry } from '../reviews/marketBias';

export type MarketBiasIndex = ReadonlyMap<string, readonly MarketBiasEntry[]>;

export const EMPTY_MARKET_BIAS: readonly MarketBiasEntry[] = [];


export interface MarketBiasNote {
  readonly key: string;
  readonly entries: readonly MarketBiasEntry[];
}

export interface MarketBiasIndexSource {
  
  notePaths(): Iterable<string>;
  
  readNote(path: string): MarketBiasNote | null;
}

function sameEntries(
  a: readonly MarketBiasEntry[],
  b: readonly MarketBiasEntry[]
): boolean {
  return (
    a.length === b.length &&
    a.every(
      (entry, i) => entry.ticker === b[i].ticker && entry.bias === b[i].bias
    )
  );
}

function sameNote(a: MarketBiasNote | null, b: MarketBiasNote | null): boolean {
  if (a === null || b === null) return a === b;
  return a.key === b.key && sameEntries(a.entries, b.entries);
}


export class MarketBiasIndexCache {
  
  private notes: Map<string, MarketBiasNote> | null = null;
  private index: MarketBiasIndex | null = null;

  constructor(private readonly source: MarketBiasIndexSource) {}

  get(): MarketBiasIndex {
    this.notes ??= this.readAll();
    if (!this.index) {
      
      
      const index = new Map<string, readonly MarketBiasEntry[]>();
      const paths = [...this.notes.keys()].sort();
      for (const path of paths) {
        const note = this.notes.get(path);
        if (note && !index.has(note.key)) index.set(note.key, note.entries);
      }
      this.index = index;
    }
    return this.index;
  }

  
  update(path: string): void {
    if (!this.notes) return;
    const previous = this.notes.get(path) ?? null;
    const next = this.source.readNote(path);
    if (sameNote(previous, next)) return;
    if (next) this.notes.set(path, next);
    else this.notes.delete(path);
    this.changed();
  }

  
  invalidate(): void {
    const previous = this.notes;
    if (!previous) return;
    this.notes = this.readAll();
    if (
      previous.size !== this.notes.size ||
      [...this.notes].some(
        ([path, note]) => !sameNote(previous.get(path) ?? null, note)
      )
    ) {
      this.changed();
    }
  }

  private changed(): void {
    this.index = null;
    eventBus.publish('market-bias:changed');
  }

  private readAll(): Map<string, MarketBiasNote> {
    const notes = new Map<string, MarketBiasNote>();
    for (const path of this.source.notePaths()) {
      const note = this.source.readNote(path);
      if (note) notes.set(path, note);
    }
    return notes;
  }
}
