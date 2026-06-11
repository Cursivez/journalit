

import { App, MarkdownView, TFile, Plugin } from 'obsidian';
import {
  isViewWithFile,
  isViewWithTFile,
} from '../../types/obsidian-extensions';
import { TradeNoteRenderer } from './TradeNoteRenderer';
import { BaseComponentProcessor } from '../base/BaseComponentProcessor';
import {
  eventBus,
  TradeChangedPayload,
  BacktestTradeChangedPayload,
  MissedTradeChangedPayload,
  Unsubscribe,
} from '../../services/events';
import { readFrontmatterFromDisk } from '../../utils/dataRefresh';

export class TradeNoteProcessor extends BaseComponentProcessor {
  
  private unsubscribeTradeListener: Unsubscribe | null = null;
  private unsubscribeBacktestListener: Unsubscribe | null = null;
  private unsubscribeMissedListener: Unsubscribe | null = null;
  private activeTradeRenderTimeout: NodeJS.Timeout | null = null;

  
  private observerTimeouts: Map<MutationObserver, NodeJS.Timeout> = new Map();
  constructor(app: App, plugin: Plugin) {
    super(app, plugin, new TradeNoteRenderer(app));

    
    this.setupTradeUpdateListener();
  }

  public initialize(): void {
    super.initialize();

    const scheduleActiveTradeNoteRender = () => {
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile || !this.isLikelyTradeCandidate(activeFile)) return;

      if (this.activeTradeRenderTimeout) {
        clearTimeout(this.activeTradeRenderTimeout);
      }

      this.activeTradeRenderTimeout = setTimeout(() => {
        this.activeTradeRenderTimeout = null;
        void this.renderActiveTradeNote();
      }, 300);
    };

    this.plugin.registerEvent(
      this.app.workspace.on('active-leaf-change', scheduleActiveTradeNoteRender)
    );
    this.plugin.registerEvent(
      this.app.workspace.on('layout-change', scheduleActiveTradeNoteRender)
    );
  }

  
  protected isValidComponentType(
    frontmatter: Record<string, unknown>
  ): boolean {
    return (
      frontmatter &&
      (frontmatter.type === 'trade' || frontmatter.type === 'backtest-trade')
    );
  }

  
  protected getComponentClassName(): string {
    return 'journalit-trade-view';
  }

  
  protected getWrapperClassName(): string {
    return 'journalit-trade-note-wrapper';
  }

  
  protected getComponentTypeIdentifier(): string {
    return 'trade';
  }

  
  protected async getAdditionalDataForComponent(
    _file: TFile,
    _frontmatter: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    
    return {};
  }

  
  private disconnectObserverSafely(observer: MutationObserver): void {
    
    const timeout = this.observerTimeouts.get(observer);
    if (timeout) {
      clearTimeout(timeout);
      this.observerTimeouts.delete(observer);
    }

    
    observer.disconnect();

    
    const index = this.activeObservers.indexOf(observer);
    if (index > -1) {
      this.activeObservers.splice(index, 1);
    }
  }

  
  protected async handleFileOpen(
    file: TFile | null,
    _isInitialLoad: boolean = false
  ): Promise<void> {
    if (!file) return;

    
    this.cleanupOrphanedComponents();
    this.cleanupUnrelatedComponents(file.path);

    const cachedFrontmatter =
      this.app.metadataCache.getFileCache(file)?.frontmatter;

    
    if (
      cachedFrontmatter &&
      cachedFrontmatter.type !== 'trade' &&
      cachedFrontmatter.type !== 'backtest-trade'
    ) {
      return;
    }

    let frontmatter = cachedFrontmatter as Record<string, unknown> | undefined;
    if (!frontmatter) {
      
      frontmatter = await readFrontmatterFromDisk(this.app, file);
    }

    
    if (!frontmatter || !this.isValidComponentType(frontmatter)) {
      return;
    }
    if (frontmatter.templateId) {
      return;
    }

    
    
    
    setTimeout(() => {
      const activeFile = this.app.workspace.getActiveFile();
      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (
        activeFile?.path === file.path &&
        activeView?.getMode() === 'preview'
      ) {
        void this.renderActiveTradeNote();
      }
    }, 250);

    const processedEditors = new WeakSet<Element>();
    const renderAvailableEditors = (): number => {
      
      
      const editors = document.querySelectorAll('.cm-editor');
      if (editors.length === 0) return 0;

      let renderedCount = 0;

      
      editors.forEach((editor) => {
        if (processedEditors.has(editor)) return;

        
        const metadataContainer = editor.querySelector('.metadata-container');
        if (!metadataContainer) return;

        
        const containerEl = metadataContainer.closest(
          '.workspace-leaf-content'
        );
        if (!containerEl) return;

        
        const leaf = this.findContainingLeaf(containerEl as HTMLElement);
        const leafViewEl = leaf?.view?.containerEl as HTMLElement;

        
        const leafEl = metadataContainer.closest('.workspace-leaf');
        const trueLeafId = leafEl?.id;

        const leafId = trueLeafId || leafViewEl?.id || null;

        
        const editorId = this.getUniqueElementId(editor);
        const viewId = leafId ? `leaf-${leafId}` : editorId;

        
        let isEditorShowingFile = true; 

        
        if (leaf) {
          const view = leaf.view;
          let activeFile: TFile | null = null;

          
          if (view && isViewWithFile(view)) {
            activeFile = view.file ?? null;
          } else if (view instanceof MarkdownView) {
            activeFile = view.file;
          }

          if (activeFile) {
            
            isEditorShowingFile = activeFile.path === file.path;
          }
        }

        
        if (!isEditorShowingFile) {
          return;
        }

        
        
        const componentClassName = this.getComponentClassName();
        editor
          .querySelectorAll(`.${componentClassName}`)
          .forEach((existingNote) => {
            const notePath = existingNote.getAttribute('data-file-path');
            if (notePath && notePath !== file.path) {
              
              const viewId = existingNote.getAttribute('data-view-id');
              const leafIdAttr = existingNote.getAttribute('data-leaf-id');

              if (viewId) {
                
                this.renderer.unmountComponent(
                  notePath,
                  viewId,
                  leafIdAttr || undefined
                );
              }

              
              existingNote.remove();
            }
          });

        
        let tradeNoteElement = Array.from(
          editor.querySelectorAll(`.${componentClassName}`)
        ).find((el) => {
          const matchesFilePath =
            el.getAttribute('data-file-path') === file.path;
          return matchesFilePath;
        }) as HTMLElement;

        
        if (!tradeNoteElement) {
          tradeNoteElement = document.createElement('div');
          tradeNoteElement.className = componentClassName;
          tradeNoteElement.setAttribute('data-file-path', file.path);
          tradeNoteElement.setAttribute('data-view-id', viewId);
          tradeNoteElement.setAttribute('data-editor-id', editorId);

          
          if (leafId) {
            tradeNoteElement.setAttribute('data-leaf-id', leafId);
          }

          
          tradeNoteElement.setAttribute(
            'data-inserted-at',
            Date.now().toString()
          );

          metadataContainer.after(tradeNoteElement);
        }

        
        setTimeout(() => {
          if (!tradeNoteElement.isConnected) return;

          this.renderer.renderComponent(
            tradeNoteElement,
            frontmatter,
            file.path,
            viewId,
            editorId
          );
        }, 500);

        
        this.markFileRenderedInMode(file.path, 'source');
        processedEditors.add(editor);
        renderedCount += 1;
      });

      return renderedCount;
    };

    
    
    
    renderAvailableEditors();
    [100, 300, 750].forEach((delayMs) => {
      setTimeout(() => {
        renderAvailableEditors();
      }, delayMs);
    });

    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView?.file?.path === file.path) {
      await this.renderActiveTradeNote();
    }

    
    const bodyEl = document.body;

    
    const observer = new MutationObserver(() => {
      renderAvailableEditors();
    });

    
    this.activeObservers.push(observer);

    
    observer.observe(bodyEl, { childList: true, subtree: true });

    
    const timeout = setTimeout(() => {
      this.disconnectObserverSafely(observer);
    }, 3000);

    
    this.observerTimeouts.set(observer, timeout);
  }

  private isLikelyTradeCandidate(file: TFile): boolean {
    const cachedFrontmatter =
      this.app.metadataCache.getFileCache(file)?.frontmatter;
    if (
      cachedFrontmatter?.type === 'trade' ||
      cachedFrontmatter?.type === 'backtest-trade'
    ) {
      return true;
    }

    
    return /(-T\d+\.md$|-B\d+\.md$)/i.test(file.path);
  }

  
  private renderAllActiveTradeNotes(): void {
    
    const processedFilePaths = new Set<string>();

    
    this.app.workspace.iterateAllLeaves((leaf) => {
      try {
        
        if (!leaf.view || !isViewWithTFile(leaf.view)) return;

        
        const file = leaf.view.file;

        
        if (processedFilePaths.has(file.path)) return;

        
        if (!this.isLikelyTradeCandidate(file)) return;

        
        processedFilePaths.add(file.path);

        
        setTimeout(() => {
          this.invokeHandleFileOpenSafely(file, true);
        }, 300);
      } catch (error) {
        console.error(
          '[TradeNote] Error rendering active trade note at startup:',
          error
        );
      }
    });
  }

  
  public async renderActiveComponent(): Promise<void> {
    await this.renderActiveTradeNote();
  }

  
  private removeTradeNoteForPath(filePath: string): void {
    const componentClass = this.getComponentClassName();
    const staleTradeNotes = document.querySelectorAll(
      `.${componentClass}[data-file-path="${filePath}"]`
    );

    staleTradeNotes.forEach((element) => {
      const container = element as HTMLElement;
      const viewId = container.getAttribute('data-view-id');
      const leafId = container.getAttribute('data-leaf-id');
      if (viewId) {
        this.renderer.unmountComponent(filePath, viewId, leafId || undefined);
      }
      container.remove();
    });
  }

  private setupTradeUpdateListener(): void {
    
    const handleTradeUpdate = async (
      payload:
        | TradeChangedPayload
        | BacktestTradeChangedPayload
        | MissedTradeChangedPayload
    ) => {
      try {
        
        const filePathSet = new Set<string>();
        if (payload.filePath) {
          filePathSet.add(payload.filePath);
        }
        if ('filePaths' in payload && payload.filePaths) {
          payload.filePaths.forEach((path) => filePathSet.add(path));
        }

        if (filePathSet.size === 0) return;

        
        for (const filePath of filePathSet) {
          const file = this.app.vault.getAbstractFileByPath(filePath);
          if (!(file instanceof TFile)) {
            this.removeTradeNoteForPath(filePath);
            continue;
          }

          
          await this.refreshTradeNote(file);
        }
      } catch (error) {
        console.error('[TradeNote] Error handling trade update event:', error);
      }
    };

    
    this.unsubscribeTradeListener = eventBus.subscribe(
      'trade:changed',
      handleTradeUpdate
    );
    this.unsubscribeBacktestListener = eventBus.subscribe(
      'backtest-trade:changed',
      handleTradeUpdate
    );
    this.unsubscribeMissedListener = eventBus.subscribe(
      'missed-trade:changed',
      handleTradeUpdate
    );
  }

  
  private async refreshTradeNote(file: TFile): Promise<void> {
    try {
      
      const frontmatter = await readFrontmatterFromDisk(this.app, file);

      
      
      if (!this.isValidComponentType(frontmatter)) {
        this.removeTradeNoteForPath(file.path);
        this.clearFileRenderedStatus(file.path);
        return;
      }
      
      this.cleanupDuplicateComponents(file.path);

      
      const componentClass = this.getComponentClassName();
      const tradeNotes = document.querySelectorAll(
        `.${componentClass}[data-file-path="${file.path}"]`
      );

      if (tradeNotes.length === 0) {
        await this.handleFileOpen(file, true);
        return;
      }
      
      for (const element of Array.from(tradeNotes)) {
        const container = element as HTMLElement;
        const viewId = container.getAttribute('data-view-id');
        const contextId =
          container.getAttribute('data-markdown-view-id') ||
          container.getAttribute('data-editor-id');

        if (viewId) {
          
          const existingWrappers = container.querySelectorAll(
            `.${this.getWrapperClassName()}`
          );
          existingWrappers.forEach((wrapper) => wrapper.remove());

          
          await new Promise<void>((resolve) => {
            setTimeout(() => {
              try {
                this.renderWithDeduplication({
                  file,
                  container: container,
                  data: frontmatter,
                  viewId,
                  contextId: contextId || undefined,
                  componentClassName: this.getComponentClassName(),
                  mountedClassName: 'trade-note-mounted',
                  contentSelector: '.trade-note-container',
                });
                resolve();
              } catch (error) {
                console.error(`[TradeNote] Error during re-render:`, error);
                resolve();
              }
            }, 50);
          });
        }
      }

      
      this.markFileRenderedInMode(file.path, 'source');
      this.markFileRenderedInMode(file.path, 'preview');
    } catch (error) {
      console.error(
        `[TradeNote] Error refreshing trade note for ${file.path}:`,
        error
      );
    }
  }

  
  public cleanup(): void {
    
    for (const [_observer, timeout] of this.observerTimeouts) {
      clearTimeout(timeout);
    }
    this.observerTimeouts.clear();
    if (this.activeTradeRenderTimeout) {
      clearTimeout(this.activeTradeRenderTimeout);
      this.activeTradeRenderTimeout = null;
    }

    
    super.cleanup();

    
    if (this.unsubscribeTradeListener) {
      this.unsubscribeTradeListener();
      this.unsubscribeTradeListener = null;
    }
    if (this.unsubscribeBacktestListener) {
      this.unsubscribeBacktestListener();
      this.unsubscribeBacktestListener = null;
    }
    if (this.unsubscribeMissedListener) {
      this.unsubscribeMissedListener();
      this.unsubscribeMissedListener = null;
    }
  }

  
  public async renderActiveTradeNote(): Promise<void> {
    this.cleanupOrphanedComponents();

    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) return;

    const frontmatter = await readFrontmatterFromDisk(this.app, activeFile);

    if (!frontmatter || !this.isValidComponentType(frontmatter)) return;
    if (frontmatter.templateId) return;

    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
      return;
    }

    const containerEl = activeView.containerEl.closest(
      '.workspace-leaf-content'
    );
    if (!containerEl) {
      console.error('[TradeNote] Cannot find containing leaf for active view');
      return;
    }

    
    const leaf = this.findContainingLeaf(containerEl as HTMLElement);
    const leafViewEl = leaf?.view?.containerEl as HTMLElement;
    const leafId = leafViewEl?.id || null;

    
    const viewId = leafId ? `leaf-${leafId}` : this.generateViewId(containerEl);

    
    const isSourceMode = activeView.getMode() === 'source';
    const componentClass = this.getComponentClassName();

    if (isSourceMode) {
      
      const metadataContainer = activeView.containerEl.querySelector(
        '.metadata-container'
      );
      if (metadataContainer) {
        
        let componentElement = Array.from(
          containerEl.querySelectorAll(`.${componentClass}`)
        ).find((el) => {
          const matchesFilePath =
            el.getAttribute('data-file-path') === activeFile.path;
          const matchesLeafId =
            !leafId || el.getAttribute('data-leaf-id') === leafId;
          return matchesFilePath && matchesLeafId;
        }) as HTMLElement;

        if (!componentElement) {
          componentElement = document.createElement('div');
          componentElement.className = componentClass;
          componentElement.setAttribute('data-file-path', activeFile.path);
          componentElement.setAttribute('data-view-id', viewId);

          
          if (leafId) {
            componentElement.setAttribute('data-leaf-id', leafId);
          }

          metadataContainer.after(componentElement);
        }

        
        this.renderer.renderComponent(
          componentElement,
          frontmatter,
          activeFile.path,
          viewId
        );
        this.markFileRenderedInMode(activeFile.path, 'source');
      }
    } else {
      
      const preview = activeView.containerEl.querySelector(
        '.markdown-preview-view'
      );
      if (preview) {
        
        
        const previewTarget =
          preview.querySelector('.markdown-preview-sizer') ?? preview;

        
        let componentElement = Array.from(
          previewTarget.querySelectorAll(`.${componentClass}`)
        ).find((el) => {
          const matchesFilePath =
            el.getAttribute('data-file-path') === activeFile.path;
          const matchesViewId = el.getAttribute('data-view-id') === viewId;
          const matchesLeafId =
            !leafId || el.getAttribute('data-leaf-id') === leafId;
          return matchesFilePath && matchesViewId && matchesLeafId;
        }) as HTMLElement;

        if (!componentElement) {
          componentElement = document.createElement('div');
          componentElement.className = componentClass;
          componentElement.setAttribute('data-file-path', activeFile.path);
          componentElement.setAttribute('data-view-id', viewId);

          
          if (leafId) {
            componentElement.setAttribute('data-leaf-id', leafId);
          }

          previewTarget.prepend(componentElement);
        }

        
        this.renderer.renderComponent(
          componentElement,
          frontmatter,
          activeFile.path,
          viewId
        );
        this.markFileRenderedInMode(activeFile.path, 'preview');
      }
    }
  }
}
