

import { TFile, type App, type EventRef, type TAbstractFile } from 'obsidian';
import { eventBus } from '../events/EventBus';
import type { Unsubscribe } from '../events/types';
import { textFingerprint } from '../../utils/textFingerprint';


const SETUP_CHANGE_DEBOUNCE_MS = 150;


const REMOVED = 0;

interface SetupNoteChangeFeedOptions {
  
  isSetupNotePath(path: string): boolean;
  
  whenWritesSettled(): Promise<void>;
}

export class SetupNoteChangeFeed {
  
  private readonly announced = new Map<string, number>();
  
  private readonly pending = new Map<string, number>();
  
  private nextMovedState = -1;
  private timer: number | null = null;
  private stopped = false;
  private readonly eventRefs: Array<{
    source: { offref(ref: EventRef): void };
    ref: EventRef;
  }> = [];
  private unsubscribeAnnouncements: Unsubscribe | null = null;

  constructor(
    private readonly app: App,
    private readonly options: SetupNoteChangeFeedOptions
  ) {}

  
  public start(): void {
    const { metadataCache, vault } = this.app;
    this.eventRefs.push(
      {
        source: metadataCache,
        ref: metadataCache.on('changed', (file, data) =>
          this.handleParsed(file, data)
        ),
      },
      {
        source: metadataCache,
        ref: metadataCache.on('deleted', (file) =>
          this.handleRemoved(file.path)
        ),
      },
      {
        source: vault,
        ref: vault.on('rename', (file, oldPath) =>
          this.handleRenamed(file, oldPath)
        ),
      }
    );
    this.unsubscribeAnnouncements = eventBus.subscribe('setup:changed', () =>
      this.handleAnnounced()
    );
  }

  public stop(): void {
    if (this.stopped) return;
    this.stopped = true;
    for (const { source, ref } of this.eventRefs) source.offref(ref);
    this.eventRefs.length = 0;
    this.unsubscribeAnnouncements?.();
    this.unsubscribeAnnouncements = null;
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
    this.pending.clear();
    this.announced.clear();
  }

  private handleParsed(file: TFile, data: string): void {
    if (!this.options.isSetupNotePath(file.path)) return;
    this.observe(file.path, textFingerprint(data));
  }

  private handleRemoved(path: string): void {
    if (!this.options.isSetupNotePath(path)) return;
    this.observe(path, REMOVED);
  }

  
  private handleRenamed(file: TAbstractFile, oldPath: string): void {
    if (!(file instanceof TFile)) return;
    this.handleRemoved(oldPath);
    if (this.options.isSetupNotePath(file.path)) {
      this.observe(file.path, this.nextMovedState--);
    }
  }

  private observe(path: string, state: number): void {
    
    
    if (this.announced.get(path) === state) {
      this.pending.delete(path);
      return;
    }
    this.pending.set(path, state);
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.timer = null;
      void this.flush();
    }, SETUP_CHANGE_DEBOUNCE_MS);
  }

  
  private handleAnnounced(): void {
    for (const [path, state] of this.pending) this.announced.set(path, state);
    this.pending.clear();
  }

  private async flush(): Promise<void> {
    await this.options.whenWritesSettled();
    
    if (this.stopped || this.timer !== null || this.pending.size === 0) return;
    const filePaths = [...this.pending.keys()];
    
    eventBus.publish('setup:changed', {
      action: 'batch',
      filePaths,
      timestamp: Date.now(),
    });
  }
}
