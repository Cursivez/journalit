

import { App, WorkspaceLeaf } from 'obsidian';
import { Root } from 'react-dom/client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CurrencyProvider } from '../../contexts/CurrencyContext';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';


interface RootContext {
  root: Root;
  domContainer: HTMLElement;
  leafId?: string;
}

export abstract class BaseComponentRenderer {
  protected app: App;
  protected reactRoots: Map<string, RootContext> = new Map();
  protected rootCreationTimes: Map<string, number> = new Map();
  private _currencyChangeHandler: () => void;

  constructor(app: App) {
    this.app = app;

    
    this._currencyChangeHandler = () => this.reRenderAllComponents();
    window.addEventListener(
      'journalit-currency-changed',
      this._currencyChangeHandler
    );
  }

  
  public abstract renderComponent(
    container: HTMLElement,
    data: unknown,
    filePath: string,
    viewId: string,
    contextId?: string
  ): Promise<void> | void;

  
  protected reRenderAllComponents(): void {
    // intentional
    
    
  }

  
  public cleanup(): void {
    window.removeEventListener(
      'journalit-currency-changed',
      this._currencyChangeHandler
    );
  }

  
  protected abstract getComponentClassName(): string;

  
  protected abstract getWrapperClassName(): string;

  
  protected abstract createReactElement(
    data: unknown,
    filePath: string,
    openNoteFn?: (path: string, createNewLeaf?: boolean) => void
  ): React.ReactElement;

  
  protected getOpenNoteFunction():
    | ((path: string, createNewLeaf?: boolean) => void)
    | undefined {
    try {
      
      const plugin = this.app.plugins?.plugins?.['journalit'];
      if (!plugin) {
        return undefined;
      }

      
      return (path: string, createNewLeaf: boolean = false) => {
        plugin.openFile(path, createNewLeaf);
      };
    } catch (error) {
      console.error(
        `[${this.constructor.name}] Error getting openNote function:`,
        error
      );
      return undefined;
    }
  }

  
  protected wrapWithSharedProviders(
    element: React.ReactElement,
    privacyModeOverride?: boolean
  ): React.ReactElement {
    return React.createElement(
      CurrencyProvider,
      null,
      React.createElement(
        DisplayPolicyProvider,
        { privacyModeOverride },
        element
      )
    );
  }

  protected getDisplayPolicyPrivacyModeOverride(
    _data: unknown
  ): boolean | undefined {
    return undefined;
  }

  
  public unmountComponent(
    filePath: string,
    viewId: string,
    leafId?: string,
    contextId?: string
  ): boolean {
    
    const rootIds = [
      `${filePath}-${viewId}`,
      leafId ? `${filePath}-leaf-${leafId}` : null,
      viewId.startsWith('leaf-')
        ? `${filePath}-${viewId}`
        : `${filePath}-leaf-${viewId}`,
      `${filePath}-view-${viewId}`,
      `${filePath}-context-${viewId}`,
      contextId ? `${filePath}-context-${contextId}` : null,
    ].filter(Boolean) as string[];

    let unmounted = false;

    
    for (const rootId of rootIds) {
      const rootContext = this.reactRoots.get(rootId);

      if (rootContext) {
        try {
          rootContext.root.unmount();
          this.reactRoots.delete(rootId);
          this.rootCreationTimes.delete(rootId);
          unmounted = true;

          
          if (
            rootContext.domContainer &&
            rootContext.domContainer.isConnected
          ) {
            rootContext.domContainer.remove();
          }
        } catch (error) {
          console.error(
            `[${this.constructor.name}] Error unmounting component:`,
            error,
            { rootId }
          );
        }
      }
    }

    
    if (!unmounted && leafId) {
      
      for (const [id, context] of this.reactRoots.entries()) {
        if (context.leafId === leafId && id.startsWith(filePath)) {
          try {
            context.root.unmount();
            this.reactRoots.delete(id);
            this.rootCreationTimes.delete(id);
            unmounted = true;

            
            if (context.domContainer && context.domContainer.isConnected) {
              context.domContainer.remove();
            }
          } catch (error) {
            console.error(
              `[${this.constructor.name}] Error unmounting by leafId:`,
              error,
              { id }
            );
          }
        }
      }
    }

    
    if (!unmounted) {
      for (const [id, context] of this.reactRoots.entries()) {
        if (id.startsWith(filePath)) {
          try {
            context.root.unmount();
            this.reactRoots.delete(id);
            this.rootCreationTimes.delete(id);
            unmounted = true;

            
            if (context.domContainer && context.domContainer.isConnected) {
              context.domContainer.remove();
            }
          } catch (error) {
            console.error(
              `[${this.constructor.name}] Error unmounting fallback component:`,
              error,
              { id }
            );
          }
        }
      }
    }

    return unmounted;
  }

  
  public unmountAllComponents(): void {
    
    const rootsSnapshot: Record<string, any> = {};
    const now = Date.now();

    
    const activeFile = this.app.workspace.getActiveFile();
    const activeFilePath = activeFile?.path;

    for (const [rootId, rootContext] of this.reactRoots.entries()) {
      try {
        
        if (activeFilePath && rootId.startsWith(activeFilePath)) {
          continue;
        }

        
        const creationTime = this.rootCreationTimes.get(rootId) || now;
        const ageInSeconds = ((now - creationTime) / 1000).toFixed(1);

        
        rootsSnapshot[rootId] = {
          domContainer: rootContext.domContainer?.tagName || 'unknown',
          isConnected: rootContext.domContainer?.isConnected || false,
          ageSeconds: ageInSeconds,
        };

        
        try {
          rootContext.root.unmount();
        } catch (_unmountError) {
          // intentional
        }

        
        if (rootContext.domContainer && rootContext.domContainer.isConnected) {
          try {
            rootContext.domContainer.remove();
          } catch (_removeError) {
            // intentional
          }
        }
      } catch (error) {
        console.error(`[${this.constructor.name}] Error unmounting root:`, {
          rootId,
          error,
        });
      }
    }

    
    for (const rootId of Object.keys(rootsSnapshot)) {
      this.reactRoots.delete(rootId);
      this.rootCreationTimes.delete(rootId);
    }

    
    this.cleanupOrphanedDomElements();
  }

  
  public unmountLeafComponents(leafId: string): void {
    const rootsToRemove: string[] = [];

    
    for (const [rootId, rootContext] of this.reactRoots.entries()) {
      if (rootContext.leafId === leafId) {
        try {
          
          rootContext.root.unmount();
          rootsToRemove.push(rootId);

          
          if (
            rootContext.domContainer &&
            rootContext.domContainer.isConnected
          ) {
            rootContext.domContainer.remove();
          }
        } catch (error) {
          console.error(
            `[${this.constructor.name}] Error unmounting leaf component:`,
            { rootId, leafId, error }
          );
        }
      }
    }

    
    if (rootsToRemove.length > 0) {
      rootsToRemove.forEach((rootId) => this.reactRoots.delete(rootId));

      
      this.cleanupLeafDomElements(leafId);
    }
  }

  
  protected cleanupLeafDomElements(leafId: string): void {
    
    const viewClass = this.getComponentClassName();
    const wrapperClass = this.getWrapperClassName();

    const viewElements = document.querySelectorAll(
      `.${viewClass}[data-leaf-id="${leafId}"]`
    );
    const wrapperElements = document.querySelectorAll(
      `.${wrapperClass}[data-leaf-id="${leafId}"]`
    );

    
    viewElements.forEach((el) => {
      try {
        el.remove();
      } catch (error) {
        console.error(
          `[${this.constructor.name}] Error removing leaf view element:`,
          error
        );
      }
    });

    
    wrapperElements.forEach((el) => {
      try {
        el.remove();
      } catch (error) {
        console.error(
          `[${this.constructor.name}] Error removing leaf wrapper element:`,
          error
        );
      }
    });
  }

  
  protected cleanupOrphanedDomElements(): void {
    const viewClass = this.getComponentClassName();
    const wrapperClass = this.getWrapperClassName();

    
    const viewElements = document.querySelectorAll(`.${viewClass}`);
    const wrapperElements = document.querySelectorAll(`.${wrapperClass}`);

    
    viewElements.forEach((el) => {
      try {
        el.remove();
      } catch (error) {
        console.error(
          `[${this.constructor.name}] Error removing orphaned view element:`,
          error
        );
      }
    });

    
    wrapperElements.forEach((el) => {
      try {
        el.remove();
      } catch (error) {
        console.error(
          `[${this.constructor.name}] Error removing orphaned wrapper element:`,
          error
        );
      }
    });
  }

  
  protected findContainingLeaf(
    element: HTMLElement
  ): WorkspaceLeaf | undefined {
    
    const leafEl = element.closest('.workspace-leaf');
    if (!leafEl) return undefined;

    
    const leafId = leafEl.id;

    if (!leafId) {
      
      const tabHeader = leafEl.querySelector('.workspace-tab-header');
      if (tabHeader) {
        const tabText = tabHeader.textContent?.trim();

        
        if (tabText) {
          let matchedByTitle: WorkspaceLeaf | undefined;

          this.app.workspace.iterateAllLeaves((leaf) => {
            const title = leaf.getDisplayText();
            if (title === tabText) {
              matchedByTitle = leaf;
            }
          });

          if (matchedByTitle) return matchedByTitle;
        }
      }

      
      const fileTitleEl = leafEl.querySelector('.view-header-title-container');
      if (fileTitleEl) {
        const fileTitle = fileTitleEl.textContent?.trim();

        if (fileTitle) {
          let matchedByFileTitle: WorkspaceLeaf | undefined;

          this.app.workspace.iterateAllLeaves((leaf) => {
            const view = leaf.view as unknown as Record<string, unknown>;
            if (view && 'file' in view && view.file) {
              const file = view.file as Record<string, unknown>;
              const fileName = file.basename as string;
              if (fileName === fileTitle) {
                matchedByFileTitle = leaf;
              }
            }
          });

          if (matchedByFileTitle) return matchedByFileTitle;
        }
      }

      return undefined;
    }

    
    let matchingLeaf: WorkspaceLeaf | undefined;

    this.app.workspace.iterateAllLeaves((leaf) => {
      const viewContainerEl = leaf.view?.containerEl as HTMLElement;

      if (viewContainerEl && viewContainerEl.id === leafId) {
        matchingLeaf = leaf;
      }
    });

    if (!matchingLeaf) {
      
      this.app.workspace.iterateAllLeaves((leaf) => {
        const viewContainerEl = leaf.view?.containerEl;
        if (viewContainerEl && viewContainerEl.contains(element)) {
          matchingLeaf = leaf;
        }
      });
    }

    return matchingLeaf;
  }

  
  protected createReactRoot(
    container: HTMLElement,
    rootId: string,
    leafId: string | undefined,
    contextId: string | undefined,

    data: any,
    filePath: string
  ): RootContext {
    
    const reactContainer = document.createElement('div');
    reactContainer.className = this.getWrapperClassName();
    reactContainer.setAttribute(
      `data-${this.getComponentClassName()}-root-id`,
      rootId
    );

    
    if (leafId) {
      reactContainer.setAttribute('data-leaf-id', leafId);
    }

    
    if (contextId) {
      reactContainer.setAttribute('data-context-id', contextId);
    }

    
    reactContainer.setAttribute('data-protected', 'true');

    container.appendChild(reactContainer);

    
    const root = createRoot(reactContainer);

    
    const rootContext: RootContext = {
      root,
      domContainer: reactContainer,
      leafId,
    };

    
    this.reactRoots.set(rootId, rootContext);

    
    this.rootCreationTimes.set(rootId, Date.now());

    
    const openNote = this.getOpenNoteFunction();

    
    root.render(
      this.wrapWithSharedProviders(
        this.createReactElement(data, filePath, openNote),
        this.getDisplayPolicyPrivacyModeOverride(data)
      )
    );

    return rootContext;
  }

  
  protected getDomPath(element: HTMLElement): string {
    const path: string[] = [];
    let currentNode: Element | null = element;

    while (currentNode && currentNode !== document.body) {
      let selector = currentNode.nodeName.toLowerCase();

      
      if (currentNode.id) {
        selector += `#${currentNode.id}`;
      } else {
        
        if (currentNode.className) {
          selector += `.${Array.from(currentNode.classList).join('.')}`;
        }

        
        const siblings = currentNode.parentElement
          ? Array.from(currentNode.parentElement.children)
          : [];

        if (siblings.length > 1) {
          const index = Array.prototype.indexOf.call(siblings, currentNode);
          selector += `:nth-child(${index + 1})`;
        }
      }

      path.unshift(selector);
      currentNode = currentNode.parentElement;
    }

    return path.join(' > ');
  }
}
