import { logger } from '../utils/logger';


import { App, TFile } from 'obsidian';
import { lazyLoad } from '../utils/dynamicImport';
import { readFrontmatterFromDisk } from '../utils/dataRefresh';


interface ICustomProcessor {
  initialize?(): void | Promise<void>;
  cleanup?(): void | Promise<void>;
}


interface ICustomRenderer {
  cleanup?(): void | Promise<void>;
}


import { TradeNoteProcessor } from './trade';
import { MissedTradeNoteProcessor } from './missedTrade/MissedTradeNoteProcessor';
import { WidgetCodeblockProcessor } from './reviewV2/WidgetCodeblockProcessor';
import JournalitPlugin from '../main';

export class ProcessorManager {
  private static instance: ProcessorManager | null = null;

  private app: App;
  private plugin: JournalitPlugin;

  
  private _tradeNoteProcessor: TradeNoteProcessor | null = null;
  private _missedTradeNoteProcessor: MissedTradeNoteProcessor | null = null;
  private _widgetCodeblockProcessor: WidgetCodeblockProcessor | null = null;

  
  private initializedProcessors: Set<string> = new Set();

  
  private registeredLazyHandlers: Set<string> = new Set();
  private missedTradeLazyInitPromise: Promise<void> | null = null;
  private pendingMissedTradeLazyFiles: Map<string, TFile> = new Map();

  
  private customProcessors: Map<string, ICustomProcessor> = new Map();
  private customRenderers: Map<string, ICustomRenderer> = new Map();

  private constructor(app: App, plugin: JournalitPlugin) {
    this.app = app;
    this.plugin = plugin;
  }

  
  public static getInstance(
    app: App,
    plugin: JournalitPlugin
  ): ProcessorManager {
    if (!ProcessorManager.instance) {
      ProcessorManager.instance = new ProcessorManager(app, plugin);
    }
    return ProcessorManager.instance;
  }

  
  public async initializeRequiredProcessors(): Promise<void> {
    const activeFile = this.app.workspace.getActiveFile();
    let needsMissedTradeProcessor = false;

    
    if (activeFile) {
      const cache = this.app.metadataCache.getFileCache(activeFile);
      const frontmatter = cache?.frontmatter;

      if (await this.isMissedTradeCandidate(activeFile, frontmatter)) {
        needsMissedTradeProcessor = true;
      }
    }

    
    await this.getTradeNoteProcessor();

    
    
    this.getWidgetCodeblockProcessor();

    if (needsMissedTradeProcessor) {
      await this.getMissedTradeNoteProcessor();
    } else {
      this.registerLazyMissedTradeProcessor();
    }
  }

  
  public async getTradeNoteProcessor(): Promise<TradeNoteProcessor> {
    if (!this._tradeNoteProcessor) {
      
      this._tradeNoteProcessor = await lazyLoad(() => {
        const processor = new TradeNoteProcessor(this.app, this.plugin);
        processor.initialize();
        return processor;
      }, 'TradeNoteProcessor');

      this.initializedProcessors.add('tradeNoteProcessor');
    }
    return this._tradeNoteProcessor;
  }

  
  public async getMissedTradeNoteProcessor(): Promise<MissedTradeNoteProcessor> {
    if (!this._missedTradeNoteProcessor) {
      
      this._missedTradeNoteProcessor = await lazyLoad(() => {
        const processor = new MissedTradeNoteProcessor(this.app, this.plugin);
        processor.initialize();
        return processor;
      }, 'MissedTradeNoteProcessor');

      this.initializedProcessors.add('missedTradeNoteProcessor');
    }
    return this._missedTradeNoteProcessor;
  }

  
  public getWidgetCodeblockProcessor(): WidgetCodeblockProcessor {
    if (!this._widgetCodeblockProcessor) {
      
      this._widgetCodeblockProcessor = new WidgetCodeblockProcessor(
        this.plugin
      );
      this._widgetCodeblockProcessor.registerAll();

      this.initializedProcessors.add('widgetCodeblockProcessor');
      logger.debug(
        '[Journalit] WidgetCodeblockProcessor registered during early initialization'
      );
    }
    return this._widgetCodeblockProcessor;
  }

  private async isMissedTradeCandidate(
    file: TFile,
    frontmatter?: Record<string, unknown>
  ): Promise<boolean> {
    const isMissedTradeByFrontmatter =
      !!frontmatter &&
      (frontmatter.type === 'missed-trade' ||
        frontmatter.isMissedTrade === true);
    if (isMissedTradeByFrontmatter) {
      return true;
    }

    if (/-M\d+\.md$/i.test(file.path)) {
      return true;
    }

    
    try {
      const diskFrontmatter = await readFrontmatterFromDisk(this.app, file);
      return (
        diskFrontmatter.type === 'missed-trade' ||
        diskFrontmatter.isMissedTrade === true
      );
    } catch {
      return false;
    }
  }

  
  private registerLazyMissedTradeProcessor(): void {
    
    if (this.registeredLazyHandlers.has('missed-trade')) return;

    
    const fileOpenHandler = (file: TFile | null) => {
      if (!file) return;
      if (!this.registeredLazyHandlers.has('missed-trade')) return;
      if (this.missedTradeLazyInitPromise) {
        this.pendingMissedTradeLazyFiles.set(file.path, file);
        return;
      }

      this.missedTradeLazyInitPromise = (async () => {
        const cache = this.app.metadataCache.getFileCache(file);
        const frontmatter = cache?.frontmatter;

        const isCandidate = await this.isMissedTradeCandidate(
          file,
          frontmatter
        );
        if (!isCandidate) {
          return;
        }

        
        this.app.workspace.off('file-open', fileOpenHandler);
        this.registeredLazyHandlers.delete('missed-trade');

        try {
          await this.getMissedTradeNoteProcessor();
        } catch (error) {
          console.error('Failed to initialize missed trade processor:', error);
        }
      })()
        .catch((error) => {
          console.error(
            'Error during lazy missed trade initialization:',
            error
          );
        })
        .finally(() => {
          this.missedTradeLazyInitPromise = null;

          if (!this.registeredLazyHandlers.has('missed-trade')) {
            this.pendingMissedTradeLazyFiles.clear();
            return;
          }

          const nextPending = this.pendingMissedTradeLazyFiles.entries().next();
          if (nextPending.done) {
            return;
          }

          const [nextPath, nextFile] = nextPending.value;
          this.pendingMissedTradeLazyFiles.delete(nextPath);
          fileOpenHandler(nextFile);
        });
    };

    
    this.plugin.registerEvent(
      this.app.workspace.on('file-open', fileOpenHandler)
    );

    this.registeredLazyHandlers.add('missed-trade');
  }

  
  public isProcessorInitialized(processorName: string): boolean {
    return this.initializedProcessors.has(processorName);
  }

  
  public getAllInitializedProcessors(): {
    tradeNoteProcessor: TradeNoteProcessor | null;
    missedTradeNoteProcessor: MissedTradeNoteProcessor | null;
    widgetCodeblockProcessor: WidgetCodeblockProcessor | null;
  } {
    return {
      tradeNoteProcessor: this._tradeNoteProcessor,
      missedTradeNoteProcessor: this._missedTradeNoteProcessor,
      widgetCodeblockProcessor: this._widgetCodeblockProcessor,
    };
  }

  
  public cleanupProcessors(): void {
    if (this._tradeNoteProcessor) {
      this._tradeNoteProcessor.cleanup();
      this._tradeNoteProcessor = null;
    }

    if (this._missedTradeNoteProcessor) {
      this._missedTradeNoteProcessor.cleanup();
      this._missedTradeNoteProcessor = null;
    }

    if (this._widgetCodeblockProcessor) {
      this._widgetCodeblockProcessor.unregisterAll();
      this._widgetCodeblockProcessor = null;
    }

    
    this.customProcessors.forEach((processor) => {
      if (processor && typeof processor.cleanup === 'function') {
        void processor.cleanup();
      }
    });
    this.customProcessors.clear();

    
    this.customRenderers.forEach((renderer) => {
      if (renderer && typeof renderer.cleanup === 'function') {
        void renderer.cleanup();
      }
    });
    this.customRenderers.clear();

    
    this.initializedProcessors.clear();
    this.registeredLazyHandlers.clear();
    this.missedTradeLazyInitPromise = null;
    this.pendingMissedTradeLazyFiles.clear();
    ProcessorManager.instance = null;
  }

  
  public registerProcessor(type: string, processor: ICustomProcessor): void {
    
    this.customProcessors.set(type, processor);

    
    if (processor && typeof processor.initialize === 'function') {
      void processor.initialize();
    }

    
    this.initializedProcessors.add(`${type}Processor`);
  }

  
  public registerRenderer(type: string, renderer: ICustomRenderer): void {
    
    this.customRenderers.set(type, renderer);
  }

  
  public getRenderer(type: string): ICustomRenderer | null {
    
    if (this.customRenderers.has(type)) {
      return this.customRenderers.get(type) ?? null;
    }

    
    
    
    return null;
  }
}
