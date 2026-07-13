

import {
  App,
  MarkdownPostProcessorContext,
  MarkdownRenderChild,
  MarkdownView,
  TFile,
  Plugin,
} from 'obsidian';
import { isViewWithTFile } from '../../types/obsidian-extensions';
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

const READING_RENDER_GRACE_PERIOD_MS = 3000;
const INLINE_RENDER_COMMIT_TIMEOUT_MS = 5000;

function toRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return Object.fromEntries(Object.entries(value));
}

class InlineTradeNoteRenderChild extends MarkdownRenderChild {
  constructor(
    containerEl: HTMLElement,
    private readonly cleanupInlineTradeNote: () => void
  ) {
    super(containerEl);
  }

  onunload(): void {
    this.cleanupInlineTradeNote();
  }
}

export class TradeNoteProcessor extends BaseComponentProcessor {
  
  private unsubscribeTradeListener: Unsubscribe | null = null;
  private unsubscribeBacktestListener: Unsubscribe | null = null;
  private unsubscribeMissedListener: Unsubscribe | null = null;
  private activeTradeRenderTimeout: number | null = null;
  private readingRecoveryTimeout: number | null = null;
  private activeModeRenderTimeout: number | null = null;
  private readingEnsureLocks: WeakMap<HTMLElement, Promise<void>> =
    new WeakMap();
  private inlineRenderHosts: Map<string, HTMLElement> = new Map();
  private diskFrontmatterReads: Map<
    string,
    { mtime: number; promise: Promise<Record<string, unknown>> }
  > = new Map();

  
  private observerTimeouts: Map<MutationObserver, number> = new Map();
  constructor(app: App, plugin: Plugin) {
    super(app, plugin, new TradeNoteRenderer(app));

    
    this.setupTradeUpdateListener();
  }

  public initialize(): void {
    super.initialize();

    const scheduleReadingRecoveryScan = () => {
      this.scheduleReadingRecoveryScan();
    };

    const scheduleActiveTradeNoteRender = () => {
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile || !this.isLikelyTradeCandidate(activeFile)) return;

      if (this.activeTradeRenderTimeout) {
        window.clearTimeout(this.activeTradeRenderTimeout);
      }

      this.activeTradeRenderTimeout = window.setTimeout(() => {
        this.activeTradeRenderTimeout = null;
        void this.renderActiveTradeNote();
        void this.scanReadingMarkdownViewsForTrades();
      }, 300);
    };

    this.plugin.registerEvent(
      this.app.workspace.on('active-leaf-change', () => {
        scheduleActiveTradeNoteRender();
        scheduleReadingRecoveryScan();
      })
    );
    this.plugin.registerEvent(
      this.app.workspace.on('layout-change', () => {
        scheduleActiveTradeNoteRender();
        scheduleReadingRecoveryScan();
      })
    );
    this.plugin.registerEvent(
      this.app.workspace.on('file-open', scheduleReadingRecoveryScan)
    );
    this.plugin.registerEvent(
      this.app.metadataCache.on('resolved', scheduleReadingRecoveryScan)
    );

    const sourceModeObserver = new MutationObserver(() => {
      this.scheduleActiveModeTradeNoteRender();
    });
    sourceModeObserver.observe(window.activeDocument.body, {
      childList: true,
      subtree: true,
    });
    this.activeObservers.push(sourceModeObserver);

    this.app.workspace.onLayoutReady(scheduleReadingRecoveryScan);
  }

  private scheduleActiveModeTradeNoteRender(): void {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    const activeFile = activeView?.file;
    if (
      !activeView ||
      !activeFile ||
      !this.isLikelyTradeCandidate(activeFile)
    ) {
      return;
    }

    if (this.activeModeRenderTimeout) {
      window.clearTimeout(this.activeModeRenderTimeout);
    }

    this.activeModeRenderTimeout = window.setTimeout(() => {
      this.activeModeRenderTimeout = null;
      if (activeView.getMode() === 'source') {
        void this.renderActiveTradeNote();
        return;
      }
      this.scheduleReadingRecoveryScan();
      void this.scanReadingMarkdownViewsForTrades();
    }, 150);
  }

  
  protected isValidComponentType(
    frontmatter: Record<string, unknown>
  ): boolean {
    return (
      frontmatter &&
      (frontmatter.type === 'trade' ||
        frontmatter.type === 'backtest-trade' ||
        frontmatter.type === 'missed-trade' ||
        frontmatter.isMissedTrade === true)
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

  protected async handleMarkdownPostProcessor(
    element: HTMLElement,
    ctx: MarkdownPostProcessorContext
  ): Promise<void> {
    if (
      !ctx.sourcePath ||
      element.closest('.markdown-embed') ||
      element.closest('.markdown-source-view') ||
      element.closest('.cm-editor') ||
      element.closest(`.${this.getComponentClassName()}`)
    ) {
      return;
    }

    const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
    if (!(file instanceof TFile)) return;

    const previewView = element.closest('.markdown-preview-view');
    if (!previewView?.instanceOf(HTMLElement)) return;

    const previewRoot = previewView;
    const markdownView = this.findMarkdownViewForElement(previewRoot);
    const isWorkspaceReadingView =
      markdownView !== null &&
      markdownView.getMode() === 'preview' &&
      markdownView.file?.path === file.path;

    if (
      isWorkspaceReadingView &&
      this.shouldSkipReadingPostProcess(previewRoot, file.path)
    ) {
      return;
    }
    if (
      !isWorkspaceReadingView &&
      this.shouldSkipInlinePostProcess(ctx, file.path)
    ) {
      return;
    }

    const contextFrontmatter = toRecord(ctx.frontmatter);
    if (this.shouldSkipKnownNonTrade(file, contextFrontmatter)) return;

    const frontmatter = await this.getRenderableTradeFrontmatter(
      file,
      contextFrontmatter ?? (await this.resolveTradeFrontmatter(file))
    );
    if (!frontmatter) return;

    if (!markdownView || !isWorkspaceReadingView) {
      await this.renderInlineTradeNote(element, ctx, file, frontmatter);
      return;
    }

    await this.ensureReadingTradeNote({
      previewRoot,
      markdownView,
      file,
      frontmatter,
      ctx,
    });
  }

  private async resolveTradeFrontmatter(
    file: TFile
  ): Promise<Record<string, unknown> | null> {
    const cachedFrontmatter = toRecord(
      this.app.metadataCache.getFileCache(file)?.frontmatter
    );
    if (cachedFrontmatter) {
      return cachedFrontmatter;
    }

    return this.readFrontmatterFromDiskOnce(file);
  }

  private readFrontmatterFromDiskOnce(
    file: TFile
  ): Promise<Record<string, unknown>> {
    const existing = this.diskFrontmatterReads.get(file.path);
    if (existing?.mtime === file.stat.mtime) {
      return existing.promise;
    }

    const promise = readFrontmatterFromDisk(this.app, file).catch((error) => {
      const current = this.diskFrontmatterReads.get(file.path);
      if (current?.promise === promise) {
        this.diskFrontmatterReads.delete(file.path);
      }
      throw error;
    });

    this.diskFrontmatterReads.set(file.path, {
      mtime: file.stat.mtime,
      promise,
    });

    return promise;
  }

  private async getRenderableTradeFrontmatter(
    _file: TFile,
    frontmatter: Record<string, unknown> | null
  ): Promise<Record<string, unknown> | null> {
    if (!frontmatter || !this.isValidComponentType(frontmatter)) return null;
    return frontmatter;
  }

  private findMarkdownViewForElement(
    element: HTMLElement
  ): MarkdownView | null {
    let markdownView: MarkdownView | null = null;

    this.app.workspace.iterateAllLeaves((leaf) => {
      if (markdownView || !(leaf.view instanceof MarkdownView)) return;
      if (leaf.view.containerEl.contains(element)) {
        markdownView = leaf.view;
      }
    });

    return markdownView;
  }

  private getReadingPreviewRoot(view: MarkdownView): HTMLElement | null {
    const container = view.previewMode?.containerEl;
    if (!container) return null;

    return (
      container.querySelector<HTMLElement>('.markdown-preview-view') ??
      container
    );
  }

  private getReadingInstanceId(host: HTMLElement): string {
    const existing = host.getAttribute('data-instance-id');
    if (existing) return existing;

    const instanceId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `reading-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    host.setAttribute('data-instance-id', instanceId);
    return instanceId;
  }

  private getInlineRenderKey(
    ctx: MarkdownPostProcessorContext,
    filePath: string
  ): string {
    return `${ctx.docId}:${filePath}`;
  }

  private getInlineInstanceId(ctx: MarkdownPostProcessorContext): string {
    return `export-${ctx.docId}`;
  }

  private shouldSkipInlinePostProcess(
    ctx: MarkdownPostProcessorContext,
    filePath: string
  ): boolean {
    return Boolean(
      this.inlineRenderHosts.get(this.getInlineRenderKey(ctx, filePath))
        ?.parentElement
    );
  }

  private async renderInlineTradeNote(
    element: HTMLElement,
    ctx: MarkdownPostProcessorContext,
    file: TFile,
    frontmatter: Record<string, unknown>
  ): Promise<void> {
    const renderKey = this.getInlineRenderKey(ctx, file.path);
    const existingHost = this.inlineRenderHosts.get(renderKey);
    if (existingHost?.parentElement) return;
    if (existingHost) {
      this.renderer.unmountContainer(existingHost);
      this.inlineRenderHosts.delete(renderKey);
    }

    const componentClass = this.getComponentClassName();
    const host = element.ownerDocument.createElement('div');
    const instanceId = this.getInlineInstanceId(ctx);

    host.className = componentClass;
    host.setAttribute('data-mode', 'export');
    host.setAttribute('data-file-path', file.path);
    host.setAttribute('data-instance-id', instanceId);
    host.setAttribute('data-view-id', instanceId);
    host.setAttribute('data-markdown-view-id', ctx.docId);
    host.setAttribute('data-rendering-started-at', Date.now().toString());

    element.prepend(host);
    this.inlineRenderHosts.set(renderKey, host);
    ctx.addChild(
      new InlineTradeNoteRenderChild(host, () => {
        this.renderer.unmountContainer(host);
        if (this.inlineRenderHosts.get(renderKey) === host) {
          this.inlineRenderHosts.delete(renderKey);
        }
        host.remove();
      })
    );

    await this.renderer.renderComponent(
      host,
      frontmatter,
      file.path,
      instanceId,
      instanceId
    );
    await this.waitForTradeNoteCommit(host);
  }

  private shouldSkipReadingPostProcess(
    previewRoot: HTMLElement,
    filePath: string
  ): boolean {
    const readingRoot = this.getStableReadingHostParent(previewRoot);
    const host = Array.from(
      readingRoot.querySelectorAll<HTMLElement>(
        `.${this.getComponentClassName()}[data-mode="reading"]`
      )
    ).find(
      (element) =>
        element.parentElement === readingRoot &&
        element.getAttribute('data-file-path') === filePath
    );
    if (!host) return false;
    return (
      this.isTradeNoteHostMounted(host) || this.isReadingHostRendering(host)
    );
  }

  private shouldSkipKnownNonTrade(
    file: TFile,
    contextFrontmatter: Record<string, unknown> | null
  ): boolean {
    if (contextFrontmatter) {
      return !this.isValidComponentType(contextFrontmatter);
    }

    const cache = this.app.metadataCache.getFileCache(file);
    if (!cache) return false;

    const cachedFrontmatter = toRecord(cache.frontmatter);
    if (!cachedFrontmatter) return false;

    return !this.isValidComponentType(cachedFrontmatter);
  }

  private isTradeNoteHostMounted(host: HTMLElement): boolean {
    return (
      host.querySelector('.trade-note-container.trade-note-mounted') !== null
    );
  }

  private waitForTradeNoteCommit(host: HTMLElement): Promise<void> {
    if (this.isTradeNoteHostMounted(host)) return Promise.resolve();

    return new Promise((resolve) => {
      let didResolve = false;

      const finish = () => {
        if (didResolve) return;
        didResolve = true;
        observer.disconnect();
        window.clearTimeout(timeoutId);
        resolve();
      };

      const checkMounted = () => {
        if (this.isTradeNoteHostMounted(host) || !host.parentElement) {
          finish();
        }
      };

      const observer = new MutationObserver(checkMounted);
      const timeoutId = window.setTimeout(
        finish,
        INLINE_RENDER_COMMIT_TIMEOUT_MS
      );

      observer.observe(host, {
        attributes: true,
        attributeFilter: ['class', 'data-mounted-at'],
        childList: true,
        subtree: true,
      });
      checkMounted();
    });
  }

  private isReadingHostRendering(host: HTMLElement): boolean {
    const renderingStartedAt = Number(
      host.getAttribute('data-rendering-started-at') ?? 0
    );
    return (
      host.querySelector(`.${this.getWrapperClassName()}`) !== null &&
      renderingStartedAt > 0 &&
      Date.now() - renderingStartedAt < READING_RENDER_GRACE_PERIOD_MS
    );
  }

  private isSourceHostRendering(host: HTMLElement): boolean {
    const renderingStartedAt = Number(
      host.getAttribute('data-rendering-started-at') ?? 0
    );
    return (
      host.querySelector(`.${this.getWrapperClassName()}`) !== null &&
      renderingStartedAt > 0 &&
      Date.now() - renderingStartedAt < INLINE_RENDER_COMMIT_TIMEOUT_MS
    );
  }

  private async withReadingLock(
    previewRoot: HTMLElement,
    fn: () => Promise<void>
  ): Promise<void> {
    const existing = this.readingEnsureLocks.get(previewRoot);
    if (existing) {
      await existing;
    }

    const next = fn().finally(() => {
      if (this.readingEnsureLocks.get(previewRoot) === next) {
        this.readingEnsureLocks.delete(previewRoot);
      }
    });

    this.readingEnsureLocks.set(previewRoot, next);
    await next;
  }

  private async ensureReadingTradeNote(args: {
    previewRoot: HTMLElement;
    markdownView: MarkdownView;
    file: TFile;
    frontmatter: Record<string, unknown>;
    ctx?: MarkdownPostProcessorContext;
  }): Promise<void> {
    const { previewRoot, markdownView, file, frontmatter, ctx } = args;

    await this.withReadingLock(previewRoot, async () => {
      if (!previewRoot.isConnected || markdownView.file?.path !== file.path) {
        return;
      }

      const componentClass = this.getComponentClassName();
      const readingRoot = this.getStableReadingHostParent(previewRoot);
      previewRoot.classList.add('journalit-trade-note-native-preview-hidden');
      const existingHosts = Array.from(
        readingRoot.querySelectorAll<HTMLElement>(
          `.${componentClass}[data-mode="reading"]`
        )
      );
      const directHosts = existingHosts.filter(
        (element) => element.parentElement === readingRoot
      );

      this.cleanupSourceEditorTradeNotesForReadingLeaf(markdownView, file.path);

      let host = directHosts.find(
        (element) => element.getAttribute('data-file-path') === file.path
      );

      if (!host) {
        host = readingRoot.ownerDocument.createElement('div');
        host.className = componentClass;
        host.setAttribute('data-mode', 'reading');
        host.setAttribute('data-file-path', file.path);
        host.setAttribute('data-view-id', this.getReadingInstanceId(host));
        host.setAttribute('data-markdown-view-id', ctx?.docId ?? 'recovery');

        const leafId = markdownView.containerEl.closest('.workspace-leaf')?.id;
        if (leafId) {
          host.setAttribute('data-leaf-id', leafId);
        }

        readingRoot.prepend(host);
      }

      const instanceId = this.getReadingInstanceId(host);
      host.setAttribute('data-view-id', instanceId);
      if (ctx?.docId) {
        host.setAttribute('data-markdown-view-id', ctx.docId);
      }

      for (const duplicate of existingHosts) {
        if (duplicate === host) continue;

        this.renderer.unmountContainer(duplicate);
        duplicate.remove();
      }

      if (this.isTradeNoteHostMounted(host)) {
        host.removeAttribute('data-rendering-started-at');
        return;
      }

      if (this.isReadingHostRendering(host)) {
        return;
      }

      host.classList.remove('trade-note-mounted');
      host.removeAttribute('data-mounted-at');
      host.setAttribute('data-rendering-started-at', Date.now().toString());

      await this.renderer.renderComponent(
        host,
        frontmatter,
        file.path,
        instanceId,
        instanceId
      );
    });
  }

  private getStableReadingHostParent(previewRoot: HTMLElement): HTMLElement {
    const readingRoot =
      previewRoot.closest<HTMLElement>('.markdown-reading-view') ?? previewRoot;
    readingRoot.classList.add('journalit-trade-note-reading-view');
    return readingRoot;
  }

  private cleanupStaleReadingViewClasses(): void {
    const componentClass = this.getComponentClassName();

    this.app.workspace.iterateAllLeaves((leaf) => {
      const root = leaf.view?.containerEl;
      if (!root) return;

      root
        .querySelectorAll<HTMLElement>(
          '.markdown-reading-view.journalit-trade-note-reading-view'
        )
        .forEach((readingRoot) => {
          const hasReadingTradeNote = !!readingRoot.querySelector(
            `.${componentClass}[data-mode="reading"]`
          );
          if (!hasReadingTradeNote) {
            readingRoot.classList.remove('journalit-trade-note-reading-view');
          }
        });
    });
  }

  private cleanupSourceEditorTradeNotesForReadingLeaf(
    markdownView: MarkdownView,
    filePath: string
  ): void {
    const leafContent = markdownView.containerEl.closest(
      '.workspace-leaf-content'
    );
    if (!leafContent) return;

    const escapedFilePath = CSS.escape(filePath);
    leafContent
      .querySelectorAll<HTMLElement>(
        `.cm-editor .${this.getComponentClassName()}[data-file-path="${escapedFilePath}"]`
      )
      .forEach((element) => {
        const viewId = element.getAttribute('data-view-id');
        const leafId = element.getAttribute('data-leaf-id');
        if (viewId) {
          this.renderer.unmountComponent(filePath, viewId, leafId ?? undefined);
        }
        element.remove();
      });
  }

  private cleanupReadingTradeNotesForSourceLeaf(
    markdownView: MarkdownView,
    filePath: string
  ): void {
    const leafContent = markdownView.containerEl.closest(
      '.workspace-leaf-content'
    );
    if (!leafContent) return;

    const escapedFilePath = CSS.escape(filePath);
    leafContent
      .querySelectorAll<HTMLElement>(
        `.markdown-reading-view > .${this.getComponentClassName()}[data-mode="reading"][data-file-path="${escapedFilePath}"]`
      )
      .forEach((element) => {
        const viewId = element.getAttribute('data-view-id');
        const leafId = element.getAttribute('data-leaf-id');
        if (viewId) {
          this.renderer.unmountComponent(filePath, viewId, leafId ?? undefined);
        }
        element.remove();
      });

    this.cleanupStaleReadingViewClasses();
  }

  private cleanupLegacySourceTradeNotesForSourceLeaf(
    markdownView: MarkdownView,
    filePath: string
  ): void {
    const escapedFilePath = CSS.escape(filePath);
    markdownView.containerEl
      .querySelectorAll<HTMLElement>(
        `.cm-editor .${this.getComponentClassName()}[data-file-path="${escapedFilePath}"]:not([data-mode])`
      )
      .forEach((element) => {
        const viewId = element.getAttribute('data-view-id');
        const leafId = element.getAttribute('data-leaf-id');
        if (viewId) {
          this.renderer.unmountComponent(filePath, viewId, leafId ?? undefined);
        }
        element.remove();
      });
  }

  private scheduleReadingRecoveryScan(): void {
    if (this.readingRecoveryTimeout) {
      window.clearTimeout(this.readingRecoveryTimeout);
    }

    this.readingRecoveryTimeout = window.setTimeout(() => {
      this.readingRecoveryTimeout = null;
      void this.scanReadingMarkdownViewsForTrades();
    }, 100);
  }

  private async scanReadingMarkdownViewsForTrades(): Promise<void> {
    const tasks: Promise<void>[] = [];

    this.app.workspace.iterateAllLeaves((leaf) => {
      const view = leaf.view;
      if (!(view instanceof MarkdownView)) return;
      if (view.getMode() !== 'preview' || !view.file) return;
      const file = view.file;

      const previewRoot = this.getReadingPreviewRoot(view);
      if (!previewRoot) {
        view.previewMode?.rerender(true);
        return;
      }

      tasks.push(
        (async () => {
          const frontmatter = await this.getRenderableTradeFrontmatter(
            file,
            await this.resolveTradeFrontmatter(file)
          );
          if (!frontmatter) return;

          await this.ensureReadingTradeNote({
            previewRoot,
            markdownView: view,
            file,
            frontmatter,
          });
        })()
      );
    });

    await Promise.all(tasks);
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
    this.cleanupStaleReadingViewClasses();

    const cachedFrontmatter =
      this.app.metadataCache.getFileCache(file)?.frontmatter;

    
    if (cachedFrontmatter && !this.isValidComponentType(cachedFrontmatter)) {
      this.cleanupStaleReadingViewClasses();
      return;
    }

    let frontmatter = cachedFrontmatter as Record<string, unknown> | undefined;
    if (!frontmatter) {
      
      frontmatter = await readFrontmatterFromDisk(this.app, file);
    }

    
    if (!frontmatter || !this.isValidComponentType(frontmatter)) {
      this.cleanupStaleReadingViewClasses();
      return;
    }
    this.scheduleReadingRecoveryScan();

    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (
      activeView?.file?.path === file.path &&
      activeView.getMode() === 'source'
    ) {
      await this.renderActiveTradeNote();
    }
  }

  private isLikelyTradeCandidate(file: TFile): boolean {
    const cachedFrontmatter =
      this.app.metadataCache.getFileCache(file)?.frontmatter;
    if (cachedFrontmatter && this.isValidComponentType(cachedFrontmatter)) {
      return true;
    }

    
    return /(-T\d+\.md$|-B\d+\.md$|-M\d+\.md$)/i.test(file.path);
  }

  
  private renderAllActiveTradeNotes(): void {
    
    this.app.workspace.iterateAllLeaves((leaf) => {
      try {
        
        if (!leaf.view || !isViewWithTFile(leaf.view)) return;

        
        const file = leaf.view.file;

        
        if (!this.isLikelyTradeCandidate(file)) return;

        
        window.setTimeout(() => {
          if (leaf.view instanceof MarkdownView) {
            void this.renderTradeNoteInView(leaf.view);
            return;
          }

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
    const staleTradeNotes = this.findTradeNoteElementsForPath(filePath);

    staleTradeNotes.forEach((element) => {
      const container = element;
      const viewId = container.getAttribute('data-view-id');
      const leafId = container.getAttribute('data-leaf-id');
      if (viewId) {
        this.renderer.unmountComponent(filePath, viewId, leafId || undefined);
      }
      container.remove();
    });

    this.cleanupStaleReadingViewClasses();
  }

  private findTradeNoteElementsForPath(filePath: string): HTMLElement[] {
    const componentClass = this.getComponentClassName();
    const selector = `.${componentClass}[data-file-path="${filePath}"]`;
    const documents = new Set<Document>();

    this.app.workspace.iterateAllLeaves((leaf) => {
      const ownerDocument = leaf.view?.containerEl?.ownerDocument;
      if (ownerDocument) {
        documents.add(ownerDocument);
      }
    });
    documents.add(window.activeDocument);

    const elements: HTMLElement[] = [];
    documents.forEach((document) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (element.instanceOf(HTMLElement)) {
          elements.push(element);
        }
      });
    });

    return elements;
  }

  private setupTradeUpdateListener(): void {
    
    const handleTradeUpdate = async (
      payload:
        | TradeChangedPayload
        | BacktestTradeChangedPayload
        | MissedTradeChangedPayload
    ) => {
      try {
        if (
          payload.action === 'trade-review-updated' ||
          payload.action === 'loss-review-updated'
        ) {
          return;
        }

        
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
      
      const tradeNotes = this.findTradeNoteElementsForPath(file.path);

      if (tradeNotes.length === 0) {
        await this.handleFileOpen(file, true);
        return;
      }
      
      for (const element of tradeNotes) {
        const container = element;
        const viewId = container.getAttribute('data-view-id');
        const contextId =
          container.getAttribute('data-markdown-view-id') ||
          container.getAttribute('data-editor-id');

        if (viewId) {
          this.renderer.unmountContainer(container);
          container.classList.remove('trade-note-mounted');
          container.removeAttribute('data-mounted-at');

          
          const existingWrappers = container.querySelectorAll(
            `.${this.getWrapperClassName()}`
          );
          existingWrappers.forEach((wrapper) => wrapper.remove());

          const renderMode = container.getAttribute('data-mode');
          if (renderMode === 'reading' || renderMode === 'export') {
            container.setAttribute(
              'data-rendering-started-at',
              Date.now().toString()
            );
            await this.renderer.renderComponent(
              container,
              frontmatter,
              file.path,
              viewId,
              viewId
            );
            continue;
          }

          
          await new Promise<void>((resolve) => {
            window.setTimeout(() => {
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
    } catch (error) {
      console.error(
        `[TradeNote] Error refreshing trade note for ${file.path}:`,
        error
      );
    }
  }

  
  public cleanup(): void {
    
    for (const [, timeout] of this.observerTimeouts) {
      window.clearTimeout(timeout);
    }
    this.observerTimeouts.clear();
    if (this.activeTradeRenderTimeout) {
      window.clearTimeout(this.activeTradeRenderTimeout);
      this.activeTradeRenderTimeout = null;
    }
    if (this.readingRecoveryTimeout) {
      window.clearTimeout(this.readingRecoveryTimeout);
      this.readingRecoveryTimeout = null;
    }
    if (this.activeModeRenderTimeout) {
      window.clearTimeout(this.activeModeRenderTimeout);
      this.activeModeRenderTimeout = null;
    }
    this.inlineRenderHosts.forEach((host) => {
      this.renderer.unmountContainer(host);
      host.remove();
    });
    this.inlineRenderHosts.clear();
    this.diskFrontmatterReads.clear();
    this.cleanupStaleReadingViewClasses();

    
    super.cleanup();
    this.cleanupStaleReadingViewClasses();

    
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

    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) return;

    await this.renderTradeNoteInView(activeView);
  }

  private async renderTradeNoteInView(activeView: MarkdownView): Promise<void> {
    const activeFile = activeView.file;
    if (!activeFile) return;

    const frontmatter = await readFrontmatterFromDisk(this.app, activeFile);

    if (!frontmatter || !this.isValidComponentType(frontmatter)) return;

    const containerEl = activeView.containerEl.closest(
      '.workspace-leaf-content'
    );
    if (!containerEl) {
      console.error('[TradeNote] Cannot find containing leaf for active view');
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
      const editorSizer = activeView.containerEl.querySelector('.cm-sizer');
      const insertionAnchor = editorSizer ?? metadataContainer;
      if (insertionAnchor) {
        this.cleanupReadingTradeNotesForSourceLeaf(activeView, activeFile.path);
        this.cleanupLegacySourceTradeNotesForSourceLeaf(
          activeView,
          activeFile.path
        );

        
        let componentElement = Array.from(
          activeView.containerEl.querySelectorAll(
            `.cm-editor .${componentClass}[data-mode="source"]`
          )
        ).find((el): el is HTMLElement => {
          const matchesFilePath =
            el.getAttribute('data-file-path') === activeFile.path;
          const matchesLeafId =
            !leafId || el.getAttribute('data-leaf-id') === leafId;
          return el.instanceOf(HTMLElement) && matchesFilePath && matchesLeafId;
        });

        if (
          componentElement?.querySelector(
            '.trade-note-container.trade-note-mounted'
          )
        ) {
          componentElement.removeAttribute('data-rendering-started-at');
          this.markFileRenderedInMode(activeFile.path, 'source');
          return;
        }

        if (componentElement && this.isSourceHostRendering(componentElement)) {
          return;
        }

        if (!componentElement) {
          componentElement = window.activeDocument.createElement('div');
          componentElement.className = componentClass;
          componentElement.setAttribute('data-mode', 'source');
          componentElement.setAttribute('data-file-path', activeFile.path);
          componentElement.setAttribute('data-view-id', viewId);
          componentElement.setAttribute('data-editor-id', viewId);

          
          if (leafId) {
            componentElement.setAttribute('data-leaf-id', leafId);
          }

          insertionAnchor.prepend(componentElement);
        }

        componentElement.setAttribute(
          'data-rendering-started-at',
          Date.now().toString()
        );

        
        void this.renderer.renderComponent(
          componentElement,
          frontmatter,
          activeFile.path,
          viewId
        );
        void this.waitForTradeNoteCommit(componentElement).finally(() => {
          this.cleanupLegacySourceTradeNotesForSourceLeaf(
            activeView,
            activeFile.path
          );
        });
        [100, 500, 1200, 2500].forEach((delayMs) => {
          window.setTimeout(() => {
            this.cleanupLegacySourceTradeNotesForSourceLeaf(
              activeView,
              activeFile.path
            );
          }, delayMs);
        });
        this.markFileRenderedInMode(activeFile.path, 'source');
      }
    } else {
      
      
      
      this.scheduleReadingRecoveryScan();
    }
  }
}
