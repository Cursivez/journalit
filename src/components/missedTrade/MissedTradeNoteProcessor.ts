

import { App, MarkdownView, TFile, Plugin } from 'obsidian';
import {
  isViewWithFile,
  isViewWithTFile,
} from '../../types/obsidian-extensions';
import { MissedTradeNoteRenderer } from './MissedTradeNoteRenderer';
import { BaseComponentProcessor } from '../base/BaseComponentProcessor';
import {
  eventBus,
  MissedTradeChangedPayload,
  TradeChangedPayload,
  BacktestTradeChangedPayload,
  Unsubscribe,
} from '../../services/events';
import { readFrontmatterFromDisk } from '../../utils/dataRefresh';

export class MissedTradeNoteProcessor extends BaseComponentProcessor {
  
  private unsubscribeMissedTradeListener: Unsubscribe | null = null;
  private unsubscribeTradeListener: Unsubscribe | null = null;
  private unsubscribeBacktestTradeListener: Unsubscribe | null = null;

  
  private observerTimeouts: Map<MutationObserver, number> = new Map();

  constructor(app: App, plugin: Plugin) {
    super(app, plugin, new MissedTradeNoteRenderer(app));

    
    this.setupMissedTradeUpdateListener();
  }

  
  private async getManualFrontmatter(
    file: TFile
  ): Promise<Record<string, unknown>> {
    try {
      return await readFrontmatterFromDisk(this.app, file);
    } catch (error) {
      console.error('[MissedTradeProcessor] Error reading frontmatter:', error);
      throw error;
    }
  }

  
  protected isValidComponentType(
    frontmatter: Record<string, unknown>
  ): boolean {
    return (
      frontmatter &&
      (frontmatter.type === 'missed-trade' ||
        frontmatter.isMissedTrade === true)
    );
  }

  
  protected getComponentClassName(): string {
    return 'journalit-missed-trade-view';
  }

  
  protected getWrapperClassName(): string {
    return 'journalit-missed-trade-note-wrapper';
  }

  
  protected getComponentTypeIdentifier(): string {
    return 'missed-trade';
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
      window.clearTimeout(timeout);
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

    let frontmatter: Record<string, unknown>;

    
    if (this.isLikelyMissedTradeCandidate(file)) {
      try {
        frontmatter = await this.getManualFrontmatter(file);
      } catch {
        return;
      }
    } else {
      
      const hasCachedFrontmatter =
        !!this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (hasCachedFrontmatter || !this.isPossibleJournalTradeFile(file)) {
        return;
      }

      try {
        frontmatter = await this.getManualFrontmatter(file);
      } catch {
        return;
      }

      if (!this.isValidComponentType(frontmatter)) {
        return;
      }
    }

    
    if (!frontmatter || !this.isValidComponentType(frontmatter)) {
      return;
    }

    
    const bodyEl = window.activeDocument.body;

    
    const observer = new MutationObserver((mutations, obs) => {
      
      
      const editors = window.activeDocument.querySelectorAll('.cm-editor');
      if (editors.length === 0) return;

      
      editors.forEach((editor) => {
        
        const metadataContainer = editor.querySelector('.metadata-container');
        if (!metadataContainer) return;

        
        const containerEl = metadataContainer.closest(
          '.workspace-leaf-content'
        );
        if (!containerEl) return;

        
        const leaf = containerEl.instanceOf(HTMLElement)
          ? this.findContainingLeaf(containerEl)
          : null;
        const leafViewEl = leaf?.view?.containerEl;

        
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

        
        let missedTradeNoteElement = Array.from(
          editor.querySelectorAll(`.${componentClassName}`)
        ).find(
          (el): el is HTMLElement =>
            el.instanceOf(HTMLElement) &&
            el.getAttribute('data-file-path') === file.path
        );

        
        if (!missedTradeNoteElement) {
          missedTradeNoteElement = window.activeDocument.createElement('div');
          missedTradeNoteElement.className = componentClassName;
          missedTradeNoteElement.classList.add('journalit-component-container');
          missedTradeNoteElement.setAttribute('data-file-path', file.path);
          missedTradeNoteElement.setAttribute('data-view-id', viewId);
          missedTradeNoteElement.setAttribute('data-editor-id', editorId);

          
          if (leafId) {
            missedTradeNoteElement.setAttribute('data-leaf-id', leafId);
          }

          
          missedTradeNoteElement.setAttribute(
            'data-inserted-at',
            Date.now().toString()
          );

          metadataContainer.after(missedTradeNoteElement);
        }

        
        void this.renderer.renderComponent(
          missedTradeNoteElement,
          frontmatter,
          file.path,
          viewId,
          editorId
        );

        
        this.markFileRenderedInMode(file.path, 'source');
      });

      
      obs.disconnect();

      
      const index = this.activeObservers.indexOf(obs);
      if (index > -1) {
        this.activeObservers.splice(index, 1);
      }
    });

    
    this.activeObservers.push(observer);

    
    observer.observe(bodyEl, { childList: true, subtree: true });

    
    const timeout = window.setTimeout(() => {
      this.disconnectObserverSafely(observer);
    }, 3000);

    
    this.observerTimeouts.set(observer, timeout);
  }

  
  public renderMissedTradeNotesInWorkspace(): void {
    this.renderAllActiveMissedTradeNotes();
  }

  private isLikelyMissedTradeCandidate(file: TFile): boolean {
    const cachedFrontmatter =
      this.app.metadataCache.getFileCache(file)?.frontmatter;
    return (
      cachedFrontmatter?.type === 'missed-trade' ||
      cachedFrontmatter?.isMissedTrade === true ||
      /-M\d+\.md$/i.test(file.path)
    );
  }

  private isPossibleJournalTradeFile(file: TFile): boolean {
    return /(^|\/)!Journalit\//.test(file.path) && /\/trades\//.test(file.path);
  }

  
  private renderAllActiveMissedTradeNotes(): void {
    
    const processedFilePaths = new Set<string>();

    
    this.app.workspace.iterateAllLeaves((leaf) => {
      try {
        
        if (!leaf.view || !isViewWithTFile(leaf.view)) return;

        
        const file = leaf.view.file;

        
        if (processedFilePaths.has(file.path)) return;

        
        
        if (!this.isLikelyMissedTradeCandidate(file)) return;

        
        processedFilePaths.add(file.path);

        
        window.setTimeout(() => {
          this.invokeHandleFileOpenSafely(file, true);
        }, 300);
      } catch (error) {
        console.error(
          '[MissedTradeNote] Error rendering active missed trade note at startup:',
          error
        );
      }
    });
  }

  
  public async renderActiveComponent(): Promise<void> {
    await this.renderActiveMissedTradeNote();
  }

  
  private removeMissedTradeNoteForPath(filePath: string): void {
    const componentClass = this.getComponentClassName();
    const staleMissedTradeNotes = window.activeDocument.querySelectorAll(
      `.${componentClass}[data-file-path="${filePath}"]`
    );

    staleMissedTradeNotes.forEach((element) => {
      if (!element.instanceOf(HTMLElement)) {
        return;
      }

      const container = element;
      const viewId = container.getAttribute('data-view-id');
      const leafId = container.getAttribute('data-leaf-id');
      if (viewId) {
        this.renderer.unmountComponent(filePath, viewId, leafId || undefined);
      }
      container.remove();
    });
  }

  private setupMissedTradeUpdateListener(): void {
    
    const handleMissedTradeUpdate = async (
      payload:
        | MissedTradeChangedPayload
        | TradeChangedPayload
        | BacktestTradeChangedPayload
    ) => {
      try {
        const filePathSet = new Set<string>();
        if (payload.filePath) {
          filePathSet.add(payload.filePath);
        }
        if ('filePaths' in payload && payload.filePaths) {
          payload.filePaths.forEach((path) => filePathSet.add(path));
        }

        for (const filePath of filePathSet) {
          const file = this.app.vault.getAbstractFileByPath(filePath);
          if (!(file instanceof TFile)) {
            this.removeMissedTradeNoteForPath(filePath);
            continue;
          }

          
          
          const cachedFrontmatter =
            this.app.metadataCache.getFileCache(file)?.frontmatter;
          const isLikelyMissedTrade =
            cachedFrontmatter?.type === 'missed-trade' ||
            cachedFrontmatter?.isMissedTrade === true ||
            /-M\d+\.md$/i.test(file.path);

          if (!isLikelyMissedTrade) {
            this.removeMissedTradeNoteForPath(file.path);
            this.clearFileRenderedStatus(file.path);
            continue;
          }

          
          await this.refreshMissedTradeNote(file);
        }
      } catch (error) {
        console.error(
          '[MissedTradeProcessor] Error handling missed trade update event:',
          error
        );
      }
    };

    
    this.unsubscribeMissedTradeListener = eventBus.subscribe(
      'missed-trade:changed',
      handleMissedTradeUpdate
    );
    this.unsubscribeTradeListener = eventBus.subscribe(
      'trade:changed',
      handleMissedTradeUpdate
    );
    this.unsubscribeBacktestTradeListener = eventBus.subscribe(
      'backtest-trade:changed',
      handleMissedTradeUpdate
    );
  }

  
  private async refreshMissedTradeNote(file: TFile): Promise<void> {
    try {
      const frontmatter = await this.getManualFrontmatter(file);

      
      if (!this.isValidComponentType(frontmatter)) {
        this.removeMissedTradeNoteForPath(file.path);
        this.clearFileRenderedStatus(file.path);
        return;
      }

      
      this.cleanupDuplicateComponents(file.path);

      
      const componentClass = this.getComponentClassName();
      const missedTradeNotes = window.activeDocument.querySelectorAll(
        `.${componentClass}[data-file-path="${file.path}"]`
      );

      if (missedTradeNotes.length === 0) {
        await this.handleFileOpen(file, true);
        return;
      }

      
      for (const missedTradeNoteEl of Array.from(missedTradeNotes)) {
        const viewId = missedTradeNoteEl.getAttribute('data-view-id');
        const contextId =
          missedTradeNoteEl.getAttribute('data-markdown-view-id') ||
          missedTradeNoteEl.getAttribute('data-editor-id');

        if (viewId) {
          if (!missedTradeNoteEl.instanceOf(HTMLElement)) {
            continue;
          }

          
          missedTradeNoteEl.classList.add('jl-component-visible');

          
          const existingWrappers = missedTradeNoteEl.querySelectorAll(
            `.${this.getWrapperClassName()}`
          );
          existingWrappers.forEach((wrapper) => wrapper.remove());

          
          await new Promise<void>((resolve) =>
            window.setTimeout(() => {
              try {
                this.renderWithDeduplication({
                  file,
                  container: missedTradeNoteEl,
                  data: frontmatter,
                  viewId,
                  contextId: contextId || undefined,
                  componentClassName: this.getComponentClassName(),
                  mountedClassName: 'missed-trade-note-mounted',
                  contentSelector: '.missed-trade-note-container',
                });
                resolve();
              } catch (error) {
                console.error(
                  `[MissedTradeNote] Error during re-render:`,
                  error
                );
                resolve();
              }
            }, 50)
          );
        }
      }

      
      this.markFileRenderedInMode(file.path, 'source');
      this.markFileRenderedInMode(file.path, 'preview');
    } catch (error) {
      console.error(
        `[MissedTradeNote] Error refreshing missed trade note for ${file.path}:`,
        error
      );
    }
  }

  
  public cleanup(): void {
    
    for (const [, timeout] of this.observerTimeouts) {
      window.clearTimeout(timeout);
    }
    this.observerTimeouts.clear();

    
    super.cleanup();

    
    if (this.unsubscribeMissedTradeListener) {
      this.unsubscribeMissedTradeListener();
      this.unsubscribeMissedTradeListener = null;
    }
    if (this.unsubscribeTradeListener) {
      this.unsubscribeTradeListener();
      this.unsubscribeTradeListener = null;
    }
    if (this.unsubscribeBacktestTradeListener) {
      this.unsubscribeBacktestTradeListener();
      this.unsubscribeBacktestTradeListener = null;
    }
  }

  
  public async renderActiveMissedTradeNote(): Promise<void> {
    this.cleanupOrphanedComponents();

    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) return;

    let frontmatter: Record<string, unknown>;
    try {
      frontmatter = await this.getManualFrontmatter(activeFile);
    } catch {
      return;
    }

    if (!frontmatter || !this.isValidComponentType(frontmatter)) return;

    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
      console.error('[MissedTradeNote] No active markdown view found');
      return;
    }

    const containerEl = activeView.containerEl.closest(
      '.workspace-leaf-content'
    );
    if (!containerEl) {
      console.error(
        '[MissedTradeNote] Cannot find containing leaf for active view'
      );
      return;
    }

    
    const leaf = containerEl.instanceOf(HTMLElement)
      ? this.findContainingLeaf(containerEl)
      : null;
    const leafViewEl = leaf?.view?.containerEl;
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
        ).find((el): el is HTMLElement => {
          const matchesFilePath =
            el.getAttribute('data-file-path') === activeFile.path;
          const matchesViewId = el.getAttribute('data-view-id') === viewId;
          const matchesLeafId =
            !leafId || el.getAttribute('data-leaf-id') === leafId;
          return (
            el.instanceOf(HTMLElement) &&
            matchesFilePath &&
            matchesViewId &&
            matchesLeafId
          );
        });

        if (!componentElement) {
          componentElement = window.activeDocument.createElement('div');
          componentElement.className = componentClass;
          componentElement.classList.add('journalit-component-container');
          componentElement.setAttribute('data-file-path', activeFile.path);
          componentElement.setAttribute('data-view-id', viewId);

          
          if (leafId) {
            componentElement.setAttribute('data-leaf-id', leafId);
          }

          metadataContainer.after(componentElement);
        }

        
        void this.renderer.renderComponent(
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
        ).find((el): el is HTMLElement => {
          const matchesFilePath =
            el.getAttribute('data-file-path') === activeFile.path;
          const matchesViewId = el.getAttribute('data-view-id') === viewId;
          const matchesLeafId =
            !leafId || el.getAttribute('data-leaf-id') === leafId;
          return (
            el.instanceOf(HTMLElement) &&
            matchesFilePath &&
            matchesViewId &&
            matchesLeafId
          );
        });

        if (!componentElement) {
          componentElement = window.activeDocument.createElement('div');
          componentElement.className = componentClass;
          componentElement.classList.add('journalit-component-container');
          componentElement.setAttribute('data-file-path', activeFile.path);
          componentElement.setAttribute('data-view-id', viewId);

          
          if (leafId) {
            componentElement.setAttribute('data-leaf-id', leafId);
          }

          previewTarget.prepend(componentElement);
        }

        
        void this.renderer.renderComponent(
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
