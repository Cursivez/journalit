

import {
  TFile,
  type App,
  type CachedMetadata,
  type FrontMatterCache,
  type Plugin,
  type TAbstractFile,
} from 'obsidian';
import { eventBus } from '../../events/EventBus';
import type { Unsubscribe } from '../../events/types';


const TRADE_DATA_QUIET_DELAY_MS = 0;

const TRADE_DATA_BURST_DELAY_MS = 250;

const BURST_WINDOW_MS = 500;

export const TRADE_DATA_MAX_WAIT_MS = 2000;


const NOT_A_TRADE = 0;

type TradeNotePredicate = (
  path: string,
  frontmatter: FrontMatterCache | undefined
) => boolean;


interface TradeDataFeedKind {
  
  readonly changedEvent: 'trade-data:changed' | 'missed-trade-data:changed';
  
  subscribeToWriters(onChange: (paths: string[]) => void): Unsubscribe;
}

const FEED_KINDS = {
  trades: {
    changedEvent: 'trade-data:changed',
    subscribeToWriters: (onChange) =>
      eventBus.subscribe('trade:changed', (payload) =>
        onChange(
          [
            ...(payload.filePaths ?? []),
            payload.filePath,
            payload.oldFilePath,
          ].filter((path): path is string => Boolean(path))
        )
      ),
  },
  missedTrades: {
    changedEvent: 'missed-trade-data:changed',
    subscribeToWriters: (onChange) =>
      eventBus.subscribe('missed-trade:changed', (payload) =>
        onChange(payload.filePath ? [payload.filePath] : [])
      ),
  },
} satisfies Record<string, TradeDataFeedKind>;

export class TradeDataChangeFeed {
  
  private readonly announced = new Map<string, number>();
  private readonly pendingPaths = new Set<string>();
  private pendingAll = false;
  private timer: number | null = null;
  private firstPendingAt = 0;
  private lastChangeAt = Number.NEGATIVE_INFINITY;
  private stopped = false;

  private readonly kind: TradeDataFeedKind;

  
  constructor(
    private readonly app: App,
    kind: keyof typeof FEED_KINDS,
    private readonly isTradeNote: TradeNotePredicate,
    private readonly whenIndexesCurrent: () => Promise<void> | null
  ) {
    this.kind = FEED_KINDS[kind];
  }

  
  public startWhenReady(plugin: Plugin, ready: Promise<unknown>): void {
    let unloaded = false;
    plugin.register(() => {
      unloaded = true;
      this.stop();
    });
    void ready.then(() => {
      if (!unloaded) this.listen(plugin);
    });
  }

  private listen(plugin: Plugin): void {
    const { metadataCache, vault } = this.app;
    plugin.registerEvent(vault.on('modify', (file) => this.handleModify(file)));
    plugin.registerEvent(
      metadataCache.on('changed', (file, _data, cache) =>
        this.handleParsed(file, cache)
      )
    );
    plugin.registerEvent(
      metadataCache.on('deleted', (file, previousCache) =>
        this.handleDeleted(file, previousCache)
      )
    );
    plugin.registerEvent(
      vault.on('rename', (file, oldPath) => this.handleRename(file, oldPath))
    );
    plugin.register(
      this.kind.subscribeToWriters((paths) => this.handleWriterChange(paths))
    );
  }

  private stop(): void {
    this.stopped = true;
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
    this.pendingPaths.clear();
    this.pendingAll = false;
  }

  
  private handleModify(file: TAbstractFile): void {
    if (!(file instanceof TFile) || file.extension !== 'md') return;
    if (this.announced.has(file.path)) return;
    const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
    if (!this.isTradeNote(file.path, frontmatter)) return;
    this.announced.set(file.path, fingerprint(frontmatter));
  }

  private handleParsed(file: TFile, cache: CachedMetadata): void {
    const previous = this.announced.get(file.path);
    const current = this.fingerprintOf(file.path, cache.frontmatter);
    const wasTrade = previous !== undefined && previous !== NOT_A_TRADE;
    if (!wasTrade && current === NOT_A_TRADE) return;
    if (previous === current) return;
    this.announce(file.path, current);
  }

  private handleDeleted(
    file: TFile,
    previousCache: CachedMetadata | null
  ): void {
    const previous =
      this.announced.get(file.path) ??
      this.fingerprintOf(file.path, previousCache?.frontmatter);
    if (previous === NOT_A_TRADE) return;
    this.announce(file.path, NOT_A_TRADE);
  }

  
  private handleRename(file: TAbstractFile, oldPath: string): void {
    if (!(file instanceof TFile) || file.extension !== 'md') return;
    const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
    const previous =
      this.announced.get(oldPath) ?? this.fingerprintOf(oldPath, frontmatter);
    const current = this.fingerprintOf(file.path, frontmatter);
    if (previous === NOT_A_TRADE && current === NOT_A_TRADE) return;
    this.announce(oldPath, NOT_A_TRADE);
    this.announce(file.path, current);
  }

  
  private handleWriterChange(paths: string[]): void {
    if (paths.length === 0) {
      this.pendingAll = true;
      this.schedule();
      return;
    }
    for (const path of paths) {
      const file = this.app.vault.getFileByPath(path);
      const current = file
        ? this.fingerprintOf(
            path,
            this.app.metadataCache.getFileCache(file)?.frontmatter
          )
        : NOT_A_TRADE;
      const previous = this.announced.get(path);
      
      
      
      
      const changed = !file
        ? previous !== NOT_A_TRADE
        : previous === undefined
          ? current !== NOT_A_TRADE
          : previous !== current;
      if (changed) this.announce(path, current);
    }
  }

  private fingerprintOf(
    path: string,
    frontmatter: FrontMatterCache | undefined
  ): number {
    return this.isTradeNote(path, frontmatter)
      ? fingerprint(frontmatter)
      : NOT_A_TRADE;
  }

  private announce(path: string, current: number): void {
    this.announced.set(path, current);
    this.pendingPaths.add(path);
    this.schedule();
  }

  
  private schedule(): void {
    const now = performance.now();
    const inBurst = now - this.lastChangeAt < BURST_WINDOW_MS;
    this.lastChangeAt = now;
    if (this.timer === null) {
      this.firstPendingAt = now;
    } else {
      window.clearTimeout(this.timer);
    }
    const delay = Math.min(
      inBurst ? TRADE_DATA_BURST_DELAY_MS : TRADE_DATA_QUIET_DELAY_MS,
      Math.max(0, this.firstPendingAt + TRADE_DATA_MAX_WAIT_MS - now)
    );
    this.timer = window.setTimeout(() => this.flush(), delay);
  }

  private flush(): void {
    this.timer = null;
    const filePaths = this.pendingAll ? 'all' : [...this.pendingPaths];
    this.pendingPaths.clear();
    this.pendingAll = false;
    const { changedEvent } = this.kind;
    const publish = () => {
      if (!this.stopped) eventBus.publish(changedEvent, { filePaths });
    };
    
    
    const indexesApplied = this.whenIndexesCurrent();
    if (indexesApplied) void indexesApplied.then(publish);
    else publish();
  }
}


function fingerprint(frontmatter: FrontMatterCache | undefined): number {
  const text = JSON.stringify(frontmatter ?? null);
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0) || 1;
}
