import { logger } from '../utils/logger';


import { App } from 'obsidian';
import { lazyLoad } from '../utils/dynamicImport';


interface ICustomProcessor {
  initialize?(): void | Promise<void>;
  cleanup?(): void | Promise<void>;
}


interface ICustomRenderer {
  cleanup?(): void | Promise<void>;
}


import { TradeNoteProcessor } from './trade';
import { WidgetCodeblockProcessor } from './reviewV2/WidgetCodeblockProcessor';
import JournalitPlugin from '../main';

export class ProcessorManager {
  private static instance: ProcessorManager | null = null;

  private app: App;
  private plugin: JournalitPlugin;

  
  private _tradeNoteProcessor: TradeNoteProcessor | null = null;
  private _widgetCodeblockProcessor: WidgetCodeblockProcessor | null = null;

  
  private initializedProcessors: Set<string> = new Set();

  
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
    
    
    await this.getTradeNoteProcessor();

    
    
    this.getWidgetCodeblockProcessor();
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

  
  public isProcessorInitialized(processorName: string): boolean {
    return this.initializedProcessors.has(processorName);
  }

  
  public getAllInitializedProcessors(): {
    tradeNoteProcessor: TradeNoteProcessor | null;
    widgetCodeblockProcessor: WidgetCodeblockProcessor | null;
  } {
    return {
      tradeNoteProcessor: this._tradeNoteProcessor,
      widgetCodeblockProcessor: this._widgetCodeblockProcessor,
    };
  }

  
  public cleanupProcessors(): void {
    if (this._tradeNoteProcessor) {
      this._tradeNoteProcessor.cleanup();
      this._tradeNoteProcessor = null;
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
