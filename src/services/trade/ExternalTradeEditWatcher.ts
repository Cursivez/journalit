

import type { FrontMatterCache, TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import { eventBus } from '../events/EventBus';
import type { Unsubscribe } from '../events/types';
import {
  JOURNALIT_DRC_PROPERTY,
  JOURNALIT_PARENT_REVIEW_PROPERTY,
  JOURNALIT_SETUPS_PROPERTY,
} from '../graph/graphTypes';
import { TRADE_DATA_MAX_WAIT_MS } from './core/TradeDataChangeFeed';


const SETTLE_MS = 1000;

const MAX_WAIT_MS = TRADE_DATA_MAX_WAIT_MS;


const UNANNOUNCED_KEYS: ReadonlySet<string> = new Set([
  JOURNALIT_DRC_PROPERTY,
  JOURNALIT_SETUPS_PROPERTY,
  JOURNALIT_PARENT_REVIEW_PROPERTY,
]);

interface WriterClaim {
  at: number;
  
  signature: string | null;
}

export class ExternalTradeEditWatcher {
  
  private readonly signatures = new Map<string, string>();
  
  private readonly changed = new Set<string>();
  
  private readonly claims = new Map<string, WriterClaim>();
  private firstPendingAt = 0;
  private publishing = false;
  private ready = false;
  private destroyed = false;
  private flushTimer: number | null = null;
  private unsubscribes: Unsubscribe[] = [];

  constructor(private readonly plugin: JournalitPlugin) {}

  initialize(): void {
    const announce = (paths: Array<string | undefined>): void => {
      if (this.publishing) return;
      const at = Date.now();
      for (const path of paths) {
        if (!path) continue;
        
        
        this.claims.set(path, {
          at,
          signature: this.changed.has(path)
            ? (this.signatures.get(path) ?? null)
            : null,
        });
      }
    };

    this.unsubscribes.push(
      eventBus.subscribe('trade:committed', ({ change }) =>
        announce([change.path, change.previousPath])
      ),
      eventBus.subscribe('trade:changed', (payload) =>
        announce([
          ...(payload.filePaths ?? []),
          payload.filePath,
          payload.oldFilePath,
        ])
      ),
      eventBus.subscribe('missed-trade:changed', ({ filePath }) =>
        announce([filePath])
      ),
      eventBus.subscribe('backtest-trade:changed', ({ filePath }) =>
        announce([filePath])
      )
    );

    const { app } = this.plugin;
    this.plugin.registerEvent(
      app.workspace.on('file-open', (file) => {
        if (file) this.rememberProperties(file);
      })
    );
    this.plugin.registerEvent(
      app.metadataCache.on('changed', (file, _data, cache) => {
        if (!this.ready || file.extension !== 'md') return;
        const tracked = this.signatures.has(file.path);
        
        
        if (!this.isTradeNote(file.path, cache.frontmatter) && !tracked) {
          return;
        }
        this.recordChange(file.path, propertySignature(cache.frontmatter));
      })
    );

    void this.plugin.tradeService.waitForTradeDataReady().then(() => {
      if (this.destroyed) return;
      app.workspace.iterateAllLeaves((leaf) => {
        const file: unknown = leaf.view.getState().file;
        const open =
          typeof file === 'string' ? app.vault.getFileByPath(file) : null;
        if (open) this.rememberProperties(open);
      });
      this.ready = true;
    });
  }

  destroy(): void {
    this.destroyed = true;
    this.ready = false;
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
    this.unsubscribes = [];
    if (this.flushTimer !== null) window.clearTimeout(this.flushTimer);
    this.flushTimer = null;
    this.changed.clear();
    this.claims.clear();
    this.signatures.clear();
  }

  
  private isTradeNote(
    path: string,
    frontmatter: FrontMatterCache | undefined
  ): boolean {
    const { tradeService } = this.plugin;
    return (
      tradeService.feedsTradeData(path, frontmatter) ||
      tradeService.feedsMissedTradeData(path, frontmatter)
    );
  }

  
  private rememberProperties(file: TFile): void {
    const frontmatter =
      this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    if (this.isTradeNote(file.path, frontmatter)) {
      this.signatures.set(file.path, propertySignature(frontmatter));
    }
  }

  private recordChange(path: string, signature: string): void {
    const previous = this.signatures.get(path);
    this.signatures.set(path, signature);
    if (previous === signature) return;
    const now = Date.now();
    const claim = this.claims.get(path);
    if (claim && claim.signature === null && now - claim.at <= SETTLE_MS) {
      claim.signature = signature;
    }
    if (this.flushTimer === null) {
      this.firstPendingAt = now;
    } else {
      window.clearTimeout(this.flushTimer);
    }
    this.changed.add(path);
    const delay = Math.min(
      SETTLE_MS,
      Math.max(0, this.firstPendingAt + MAX_WAIT_MS - now)
    );
    this.flushTimer = window.setTimeout(() => this.flush(), delay);
  }

  private flush(): void {
    this.flushTimer = null;
    const outside: string[] = [];
    for (const path of this.changed) {
      const claimed = this.claims.get(path)?.signature;
      if (claimed !== this.signatures.get(path)) outside.push(path);
    }
    this.changed.clear();
    const expired = Date.now() - SETTLE_MS;
    for (const [path, claim] of this.claims) {
      if (claim.at < expired) this.claims.delete(path);
    }
    if (outside.length === 0) return;

    
    
    
    this.publishing = true;
    try {
      eventBus.publish('trade:changed', {
        action: 'updated',
        filePaths: outside,
        timestamp: Date.now(),
      });
    } finally {
      this.publishing = false;
    }
    for (const path of outside) {
      const frontmatter =
        this.plugin.app.metadataCache.getCache(path)?.frontmatter;
      if (!this.isTradeNote(path, frontmatter)) this.signatures.delete(path);
    }
  }
}

function propertySignature(frontmatter: FrontMatterCache | undefined): string {
  return JSON.stringify(
    Object.entries(frontmatter ?? {}).filter(
      ([key]) => !UNANNOUNCED_KEYS.has(key)
    )
  );
}
