import { logger } from '../../utils/logger';


import {
  App,
  MarkdownPostProcessorContext,
  MarkdownView,
  TFile,
  Plugin,
  WorkspaceLeaf,
} from 'obsidian';
import { BaseComponentRenderer } from './BaseComponentRenderer';
import {
  isViewWithFile,
  isViewWithTFile,
} from '../../types/obsidian-extensions';
import { t } from '../../lang/helpers';
import { readFrontmatterFromDisk } from '../../utils/dataRefresh';


interface RenderWithDeduplicationOptions {
  file: TFile;
  container: HTMLElement;

  data: any;
  viewId: string;
  contextId?: string;
  componentClassName?: string;
  rootClassName?: string;
  mountedClassName?: string;
  contentSelector?: string;
}

export abstract class BaseComponentProcessor {
  protected app: App;
  protected plugin: Plugin;
  protected renderer: BaseComponentRenderer;
  protected activeObservers: MutationObserver[] = [];
  protected registeredLeaves: Set<string> = new Set();

  
  protected renderedFilePaths: Map<string, Set<string>> = new Map();

  
  private static readonly TEMPLATE_ID_REGEX = /^templateId\s*:/m;

  constructor(app: App, plugin: Plugin, renderer: BaseComponentRenderer) {
    this.app = app;
    this.plugin = plugin;
    this.renderer = renderer;
  }

  
  protected async hasTemplateIdInRawFrontmatter(file: TFile): Promise<boolean> {
    try {
      const content = await this.app.vault.cachedRead(file);
      
      const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!yamlMatch) return false;

      
      return BaseComponentProcessor.TEMPLATE_ID_REGEX.test(yamlMatch[1]);
    } catch (error) {
      
      
      if (error instanceof Error && !error.message.includes('ENOENT')) {
        logger.debug(
          `[BaseComponentProcessor] Unexpected error reading frontmatter:`,
          error
        );
      }
      return false;
    }
  }

  
  public initialize(): void {
    
    this.app.workspace.onLayoutReady(() => {
      this.cleanupOrphanedComponents();
      this.handleInitialFileOpen();
    });

    this.registerMarkdownPostProcessor();
    this.setupFileOpenHandler();
    this.setupLayoutChangeHandler();
  }

  
  public cleanup(): void {
    
    this.activeObservers.forEach((observer) => {
      observer.disconnect();
    });

    
    this.renderer.unmountAllComponents();
    this.renderer.cleanup();

    
    this.activeObservers = [];

    
    this.registeredLeaves.clear();

    
    this.renderedFilePaths.clear();

    
  }

  
  protected abstract isValidComponentType(
    frontmatter: Record<string, unknown>
  ): boolean;

  
  protected abstract getComponentClassName(): string;

  
  protected abstract getComponentTypeIdentifier(): string;

  
  private registerMarkdownPostProcessor(): void {
    this.plugin.registerMarkdownPostProcessor(
      this.handleMarkdownPostProcessor.bind(this)
    );
  }

  
  private setupLayoutChangeHandler(): void {
    
    this.plugin.registerEvent(
      this.app.workspace.on('layout-change', this.handleLayoutChange.bind(this))
    );

    
    this.plugin.registerEvent(
      this.app.workspace.on('editor-change', (_editor, view) => {
        if (!(view && 'file' in view && view.file)) {
          return;
        }

        const file = view.file;
        if (!file) {
          return;
        }

        
        
        
        const isSourceMode =
          view instanceof MarkdownView ? view.getMode() === 'source' : false;
        const mode = isSourceMode ? 'source' : 'preview';

        const frontmatter =
          this.app.metadataCache.getFileCache(file)?.frontmatter;

        if (frontmatter && this.isValidComponentType(frontmatter)) {
          
          this.clearFileRenderedStatus(file.path, mode);

          
          setTimeout(() => {
            this.invokeHandleFileOpenSafely(file, true);
          }, 50);
        }
      })
    );

    
    this.app.workspace.onLayoutReady(() => {
      
      this.app.workspace.iterateAllLeaves((leaf) => {
        
        const viewContainerEl = leaf.view?.containerEl as HTMLElement;
        if (viewContainerEl && viewContainerEl.id) {
          this.registeredLeaves.add(viewContainerEl.id);
        }
      });
    });
  }

  
  private handleLayoutChange(): void {
    
    const currentLeafIds = new Set<string>();
    this.app.workspace.iterateAllLeaves((leaf) => {
      
      const viewContainerEl = leaf.view?.containerEl as HTMLElement;
      if (viewContainerEl && viewContainerEl.id) {
        currentLeafIds.add(viewContainerEl.id);

        
        if (!this.registeredLeaves.has(viewContainerEl.id)) {
          this.registeredLeaves.add(viewContainerEl.id);
        }
      }
    });

    
    const removedLeaves: string[] = [];
    this.registeredLeaves.forEach((leafId) => {
      if (!currentLeafIds.has(leafId)) {
        removedLeaves.push(leafId);
      }
    });

    
    removedLeaves.forEach((leafId) => {
      this.registeredLeaves.delete(leafId);
      this.renderer.unmountLeafComponents(leafId);
    });
  }

  
  protected async handleMarkdownPostProcessor(
    element: HTMLElement,
    ctx: MarkdownPostProcessorContext
  ): Promise<void> {
    
    if (!ctx.sourcePath) return;

    
    const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
    if (!(file instanceof TFile)) return;

    
    
    

    
    const previewRoot = element.closest('.markdown-preview-view');
    const isEmbeddedPreview = element.closest('.markdown-embed') !== null;
    const previewSizer = isEmbeddedPreview
      ? null
      : element.closest('.markdown-preview-sizer');
    const readingRoot = previewSizer ?? previewRoot;
    const isReadingViewRoot =
      !isEmbeddedPreview &&
      readingRoot !== null &&
      (element === readingRoot || element.parentElement === readingRoot) &&
      !ctx.sourcePath.endsWith('#') && 
      !element.previousElementSibling; 

    
    if (isReadingViewRoot) {
      
      const cache = this.app.metadataCache.getFileCache(file);
      let frontmatter = cache?.frontmatter;

      if (!frontmatter) {
        try {
          frontmatter = await readFrontmatterFromDisk(this.app, file);
        } catch {
          return;
        }
      }

      
      if (!frontmatter || !this.isValidComponentType(frontmatter)) return;

      
      
      if (frontmatter.templateId) {
        return;
      }

      
      
      
      
      const hasTemplateId = await this.hasTemplateIdInRawFrontmatter(file);
      if (hasTemplateId) {
        
        return;
      }
      
      if (this.isFileRenderedInMode(file.path, 'preview')) {
        
        return;
      }

      
      
      
      
      const markdownView = readingRoot;
      if (!markdownView) {
        console.warn(
          `[${this.constructor.name}] Cannot find parent markdown view for:`,
          ctx.sourcePath
        );
        return;
      }

      
      
      const containerEl = markdownView.closest('.workspace-leaf-content');
      if (!containerEl) {
        console.warn(
          `[${this.constructor.name}] Cannot find containing leaf for:`,
          ctx.sourcePath
        );
        return;
      }

      
      const leafEl = markdownView.closest('.workspace-leaf');
      const trueLeafId = leafEl?.id;

      
      const leaf = this.findContainingLeaf(containerEl as HTMLElement);
      const leafViewEl = leaf?.view?.containerEl as HTMLElement;
      const leafId = trueLeafId || leafViewEl?.id || null;

      
      
      const markdownViewId = this.getUniqueElementId(markdownView);
      const viewId = leafId ? `leaf-${leafId}` : markdownViewId;

      
      let isViewShowingFile = true; 

      
      if (leaf) {
        
        const view = leaf.view;
        let activeFile: TFile | null = null;

        
        if (isViewWithFile(view)) {
          
          activeFile = view.file ?? null;
        } else if (
          view &&
          'getViewType' in view &&
          view.getViewType() === 'markdown'
        ) {
          
          const mdView = view as unknown as { file: TFile | null };
          activeFile = mdView.file;
        }

        if (activeFile) {
          
          isViewShowingFile = activeFile.path === file.path;
        }
      }

      
      if (!isViewShowingFile) {
        return;
      }

      
      
      const componentClassName = this.getComponentClassName();
      markdownView
        .querySelectorAll(`.${componentClassName}`)
        .forEach((existingComponent) => {
          const notePath = existingComponent.getAttribute('data-file-path');
          if (notePath && notePath !== file.path) {
            
            const viewId = existingComponent.getAttribute('data-view-id');
            const leafIdAttr = existingComponent.getAttribute('data-leaf-id');

            if (viewId) {
              
              this.renderer.unmountComponent(
                notePath,
                viewId,
                leafIdAttr || undefined
              );
            }

            
            existingComponent.remove();
          }
        });

      
      const wrapperClass = this.getWrapperClassName();
      const existingWrappers = Array.from(
        markdownView.querySelectorAll(`.${wrapperClass}`)
      ).filter(
        (el) =>
          el
            .closest(`.${componentClassName}`)
            ?.getAttribute('data-file-path') === file.path
      );

      if (existingWrappers.length > 0) {
        
        return;
      }

      
      
      const existingComponentView = Array.from(
        markdownView.querySelectorAll(`.${componentClassName}`)
      ).find((el) => {
        const matchesFilePath = el.getAttribute('data-file-path') === file.path;
        return matchesFilePath;
      });

      
      if (existingComponentView) return;

      
      
      markdownView.querySelectorAll(`.${componentClassName}`).forEach((el) => {
        const matchesFilePath = el.getAttribute('data-file-path') === file.path;
        if (matchesFilePath) {
          el.remove();
        }
      });

      
      const componentElement = document.createElement('div');
      componentElement.className = this.getComponentClassName();
      componentElement.setAttribute('data-file-path', file.path);
      componentElement.setAttribute('data-view-id', viewId);
      componentElement.setAttribute('data-markdown-view-id', markdownViewId);

      
      if (leafId) {
        componentElement.setAttribute('data-leaf-id', leafId);
      }

      
      componentElement.setAttribute('data-inserted-at', Date.now().toString());

      
      markdownView.insertBefore(componentElement, markdownView.firstChild);

      
      try {
        
        const additionalData = await this.getAdditionalDataForComponent(
          file,
          frontmatter
        );

        
        const dataToRender =
          additionalData && typeof additionalData === 'object'
            ? { ...frontmatter, ...additionalData }
            : frontmatter;
        await this.renderer.renderComponent(
          componentElement,
          dataToRender,
          file.path,
          viewId,
          markdownViewId
        );

        
        this.markFileRenderedInMode(file.path, 'preview');
      } catch (error) {
        console.error(
          `[${this.constructor.name}] Error rendering component:`,
          error
        );
        componentElement.textContent = t('error.render-component', {
          component: this.getComponentTypeIdentifier(),
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  
  protected abstract getAdditionalDataForComponent(
    file: TFile,
    frontmatter: Record<string, unknown>
  ): Promise<unknown | void> | void;

  
  protected abstract getWrapperClassName(): string;

  
  protected generateViewId(element: Element): string {
    
    const leaf = element.closest('.workspace-leaf');
    if (leaf && leaf.id) {
      return `leaf-${leaf.id}`;
    }

    
    const leafContent = element.closest('.workspace-leaf-content');
    if (leafContent && leafContent.id) {
      return `content-${leafContent.id}`;
    }

    
    const viewContent = element.closest('.view-content');
    if (viewContent) {
      
      const siblings = Array.from(document.querySelectorAll('.view-content'));
      const index = siblings.indexOf(viewContent);
      if (index >= 0) {
        return `view-content-${index}`;
      }
    }

    
    const markdownView = element.closest('.markdown-preview-view');
    if (markdownView) {
      const siblings = Array.from(
        document.querySelectorAll('.markdown-preview-view')
      );
      const index = siblings.indexOf(markdownView);
      if (index >= 0) {
        return `markdown-view-${index}`;
      }
    }

    const editor = element.closest('.cm-editor');
    if (editor) {
      const siblings = Array.from(document.querySelectorAll('.cm-editor'));
      const index = siblings.indexOf(editor);
      if (index >= 0) {
        return `editor-${index}`;
      }
    }

    
    
    if (element.parentElement) {
      const siblings = Array.from(element.parentElement.children);
      const index = siblings.indexOf(element);
      return `view-${Date.now()}-${index}`;
    }

    
    return `view-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  protected invokeHandleFileOpenSafely(
    file: TFile | null,
    isInitialLoad: boolean
  ): void {
    Promise.resolve(this.handleFileOpen(file, isInitialLoad)).catch((error) => {
      console.error(
        `[${this.constructor.name}] Error handling file open for ${file?.path ?? 'unknown file'}:`,
        error
      );
    });
  }

  
  private setupFileOpenHandler(): void {
    
    this.plugin.registerEvent(
      this.app.workspace.on('file-open', (file) =>
        this.invokeHandleFileOpenSafely(file, false)
      )
    );

    
    this.app.workspace.onLayoutReady(() => {
      
      const activeFile = this.app.workspace.getActiveFile();
      if (activeFile) {
        
        setTimeout(() => {
          this.invokeHandleFileOpenSafely(activeFile, true);
        }, 100); 
      }
    });
  }

  
  
  protected renderWithDeduplication(
    options: RenderWithDeduplicationOptions
  ): boolean {
    const { file, container, data, viewId, contextId } = options;

    if (!container.isConnected) {
      return false;
    }

    
    const componentClassName =
      options.componentClassName || this.getComponentClassName();
    const mountedClassName = options.mountedClassName || 'component-mounted';
    const contentSelector = options.contentSelector || '.component-container';

    
    const renderRequestId = `${file.path}-${viewId}-${Date.now()}`;

    
    container.setAttribute('data-render-request', renderRequestId);
    container.setAttribute('data-debug-version', '1.0.0'); 

    
    const hasMountedFlag = container.getAttribute('data-mounted-at');
    if (hasMountedFlag) {
      return false; 
    }

    
    const existingComponent = container.querySelector(contentSelector);
    if (existingComponent) {
      
      if (existingComponent.classList.contains(mountedClassName)) {
        return false; 
      }
    }

    
    
    const anyProperlyRenderedComponent = Array.from(
      document.querySelectorAll(`.${componentClassName}`)
    ).some((el) => {
      
      const elPath = el.getAttribute('data-file-path');
      if (elPath !== file.path) return false;

      
      const contentContainer = el.querySelector(contentSelector);
      const hasValidContent =
        contentContainer &&
        (contentContainer.classList.contains(mountedClassName) ||
          contentContainer.querySelector('*'));

      
      const insertedAt = parseInt(el.getAttribute('data-inserted-at') || '0');
      const isRecent = Date.now() - insertedAt < 5000;

      return hasValidContent && isRecent;
    });

    
    
    if (anyProperlyRenderedComponent) {
      this.markFileRenderedInMode(file.path, viewId);
      return false;
    }

    
    const isSourceMode = container.closest('.cm-editor') ? true : false;
    container.setAttribute(
      'data-view-mode',
      isSourceMode ? 'source' : 'preview'
    );

    
    this.renderer.renderComponent(
      container,
      data,
      file.path,
      viewId,
      contextId
    );

    
    this.markFileRenderedInMode(file.path, viewId);

    return true;
  }

  
  protected hasProperlyRenderedComponents(
    filePath: string,
    componentClassName?: string,
    contentSelector?: string,
    mountedClassName?: string
  ): boolean {
    
    const compClass = componentClassName || this.getComponentClassName();
    const contentSel = contentSelector || '.component-container';
    const mountedClass = mountedClassName || 'component-mounted';

    
    const existingElements = document.querySelectorAll(
      `.${compClass}[data-file-path="${filePath}"]`
    );

    if (existingElements.length === 0) return false;

    
    return Array.from(existingElements).some((el) => {
      const container = el.querySelector(contentSel);
      return (
        container &&
        (container.classList.contains(mountedClass) ||
          (container.children && container.children.length > 0))
      );
    });
  }

  
  protected cleanupDuplicateComponents(
    filePath: string,
    componentClassName?: string
  ): number {
    const compClass = componentClassName || this.getComponentClassName();
    const existingComponents = Array.from(
      document.querySelectorAll(`.${compClass}[data-file-path="${filePath}"]`)
    );

    let removed = 0;
    if (existingComponents.length > 1) {
      
      for (let i = 1; i < existingComponents.length; i++) {
        const component = existingComponents[i];
        const componentViewId = component.getAttribute('data-view-id');
        const componentLeafId = component.getAttribute('data-leaf-id');

        if (componentViewId) {
          this.renderer.unmountComponent(
            filePath,
            componentViewId,
            componentLeafId || undefined
          );
        }
        component.remove();
        removed++;
      }
    }
    return removed;
  }

  protected getUniqueElementId(element: Element): string {
    
    if (element.id) {
      return `dom-${element.id}`;
    }

    
    
    const tagName = element.tagName.toLowerCase();
    const allSimilarElements = Array.from(document.querySelectorAll(tagName));

    
    const elementIndex = allSimilarElements.indexOf(element);

    
    let selector = tagName;
    if (element.className) {
      
      const firstClass = element.className.split(' ')[0];
      if (firstClass) {
        selector += `.${firstClass}`;
      }
    }

    
    const similarWithClass = Array.from(document.querySelectorAll(selector));
    const classIndex = similarWithClass.indexOf(element);

    
    return `dom-${selector.replace(/\./g, '-')}-${classIndex}-${elementIndex}-${Date.now()}`;
  }

  
  protected isFileRenderedInMode(filePath: string, viewMode: string): boolean {
    const renderSet = this.renderedFilePaths.get(filePath);
    if (!renderSet) return false;
    return renderSet.has(viewMode);
  }

  
  protected markFileRenderedInMode(filePath: string, viewMode: string): void {
    let renderSet = this.renderedFilePaths.get(filePath);
    if (!renderSet) {
      renderSet = new Set<string>();
      this.renderedFilePaths.set(filePath, renderSet);
    }
    renderSet.add(viewMode);
  }

  
  protected clearFileRenderedStatus(filePath: string, viewMode?: string): void {
    if (!viewMode) {
      
      this.renderedFilePaths.delete(filePath);
      return;
    }

    
    const renderSet = this.renderedFilePaths.get(filePath);
    if (renderSet) {
      renderSet.delete(viewMode);
      if (renderSet.size === 0) {
        this.renderedFilePaths.delete(filePath);
      }
    }
  }

  
  protected findContainingLeaf(
    element: HTMLElement
  ): WorkspaceLeaf | undefined {
    
    const leafEl = element.closest('.workspace-leaf');
    if (!leafEl) return undefined;

    
    const leafId = leafEl.id;

    
    if (leafId) {
      
      let matchingLeaf: WorkspaceLeaf | undefined;

      this.app.workspace.iterateAllLeaves((leaf) => {
        
        const viewContainerEl = leaf.view?.containerEl as HTMLElement;

        if (viewContainerEl && viewContainerEl.id === leafId) {
          matchingLeaf = leaf;
        }
      });

      if (matchingLeaf) {
        return matchingLeaf;
      }
    }

    
    

    
    const titleEl = leafEl.querySelector('.view-header-title');
    if (titleEl && titleEl.textContent) {
      const fileTitle = titleEl.textContent.trim();

      
      let matchedByTitle: WorkspaceLeaf | undefined;

      this.app.workspace.iterateAllLeaves((leaf) => {
        const view = leaf.view;
        if (view && isViewWithTFile(view)) {
          const fileName = view.file.basename;
          if (fileName === fileTitle) {
            matchedByTitle = leaf;
          }
        }
      });

      if (matchedByTitle) return matchedByTitle;
    }

    
    let matchedByContainment: WorkspaceLeaf | undefined;

    this.app.workspace.iterateAllLeaves((leaf) => {
      const viewContainerEl = leaf.view?.containerEl;
      if (viewContainerEl && viewContainerEl.contains(element)) {
        matchedByContainment = leaf;
      }
    });

    if (matchedByContainment) return matchedByContainment;

    
    return undefined;
  }

  
  protected cleanupUnrelatedComponents(currentFilePath: string): void {
    
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) return;

    const activeLeafEl =
      activeView.containerEl.closest('.workspace-leaf-content') ??
      activeView.containerEl;

    if (!activeLeafEl) return;

    
    const componentClass = this.getComponentClassName();
    const components = activeLeafEl.querySelectorAll(`.${componentClass}`);
    if (components.length === 0) return;

    
    const wrapperClass = this.getWrapperClassName();
    const wrappers = activeLeafEl.querySelectorAll(`.${wrapperClass}`);

    
    components.forEach((component) => {
      const notePath = component.getAttribute('data-file-path');
      if (!notePath || notePath === currentFilePath) return; 

      
      const viewId = component.getAttribute('data-view-id');
      const leafId = component.getAttribute('data-leaf-id');

      if (viewId) {
        
        this.renderer.unmountComponent(notePath, viewId, leafId || undefined);
      }

      
      component.remove();

      
      this.clearFileRenderedStatus(notePath);
    });

    
    wrappers.forEach((wrapper) => {
      
      const parentView = wrapper.closest(`.${componentClass}`);
      if (!parentView || !parentView.isConnected) {
        wrapper.remove();
      }
    });
  }

  
  protected cleanupOrphanedComponents(): void {
    
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) return;

    const activeLeafEl =
      activeView.containerEl.closest('.workspace-leaf-content') ??
      activeView.containerEl;

    if (!activeLeafEl) return;

    
    const componentClass = this.getComponentClassName();
    const components = activeLeafEl.querySelectorAll(`.${componentClass}`);
    if (components.length === 0) return;

    
    const activeFile = activeView.file;

    
    components.forEach((component) => {
      const filePath = component.getAttribute('data-file-path');
      if (!filePath) return;

      
      const leafId = component.getAttribute('data-leaf-id');

      
      
      if (activeFile && activeFile.path !== filePath) {
        
        const viewId = component.getAttribute('data-view-id');
        if (viewId) {
          
          this.renderer.unmountComponent(filePath, viewId, leafId || undefined);
        }

        
        component.remove();

        
        this.clearFileRenderedStatus(filePath);
      }
    });
  }

  
  protected handleInitialFileOpen(): void {
    
    const activeFile = this.app.workspace.getActiveFile();

    if (activeFile) {
      
      this.invokeHandleFileOpenSafely(activeFile, true);
    }

    
    this.app.workspace.iterateAllLeaves((leaf) => {
      
      const view = leaf.view;
      let leafFile: TFile | null = null;

      
      if (view && isViewWithFile(view)) {
        
        leafFile = view.file ?? null;
      } else if (
        view &&
        'getViewType' in view &&
        view.getViewType() === 'markdown'
      ) {
        
        const mdView = view as unknown as { file: TFile | null };
        leafFile = mdView.file;
      }

      
      if (leafFile && (!activeFile || leafFile.path !== activeFile.path)) {
        this.invokeHandleFileOpenSafely(leafFile, true);
      }
    });
  }

  
  protected abstract handleFileOpen(
    file: TFile | null,
    isInitialLoad?: boolean
  ): Promise<void> | void;

  
  public abstract renderActiveComponent(): Promise<void> | void;
}
