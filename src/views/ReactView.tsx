

import { ItemView, Scope, WorkspaceLeaf } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import React, { StrictMode } from 'react';
import { ReactViewConfig, RenderFunction } from './types';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { DisplayPolicyProvider } from '../contexts/DisplayPolicyContext';
import { getPluginInstance } from '../utils/pluginContext';
import { GuideRuntimeLayer } from '../guides/GuideRuntimeLayer';
import { shouldSuppressEscapeForReactView } from './escapeKeySuppression';


export abstract class ReactView extends ItemView {
  
  private root: Root | null = null;

  
  private rootEl: HTMLElement | null = null;

  
  protected config: ReactViewConfig;

  
  registerInterval(interval: number): number {
    this._intervals.push(interval);
    return interval;
  }

  
  clearInterval(interval: number): void {
    window.clearInterval(interval);
    this._intervals = this._intervals.filter((id) => id !== interval);
  }

  
  private _themeChangeHandler: () => void;
  private _currencyChangeHandler: () => void;
  private _escapeKeyHandler: (event: KeyboardEvent) => void;
  private _keyboardScope: Scope | null = null;
  private _scopePushed = false;
  private _pendingAnimationFrame: number | null = null;
  private _intervals: number[] = [];

  constructor(leaf: WorkspaceLeaf, config: ReactViewConfig = {}) {
    super(leaf);
    this.navigation = false;
    this.config = {
      rootId: `react-root-${Date.now()}`,
      ...config,
    };

    
    this._themeChangeHandler = () => this.renderComponent();
    this._currencyChangeHandler = () => this.renderComponent();
    this._escapeKeyHandler = (event: KeyboardEvent) => {
      if (this.shouldSuppressEscape(event)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    };
    this.initializeKeyboardScope();
  }

  private isKeyboardActiveLeaf(): boolean {
    return Boolean(
      this.containerEl
        .closest('.workspace-leaf')
        ?.classList.contains('mod-active')
    );
  }

  private shouldSuppressEscape(event: KeyboardEvent): boolean {
    return shouldSuppressEscapeForReactView(event, {
      active: this.isKeyboardActiveLeaf(),
      viewDocument: this.containerEl.ownerDocument,
    });
  }

  private initializeKeyboardScope(): void {
    if (this._keyboardScope) {
      return;
    }

    this._keyboardScope = new Scope(this.app.scope);
    this._keyboardScope.register(null, 'Escape', (event) => {
      if (this.shouldSuppressEscape(event)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }

      return undefined;
    });
  }

  
  protected abstract getRenderFunction(): RenderFunction;

  public syncActiveKeyboardScope(): void {
    const shouldBeActive = this.isKeyboardActiveLeaf();

    if (shouldBeActive && !this._scopePushed && this._keyboardScope) {
      this.app.keymap.pushScope(this._keyboardScope);
      this._scopePushed = true;
      return;
    }

    if (!shouldBeActive && this._scopePushed && this._keyboardScope) {
      this.app.keymap.popScope(this._keyboardScope);
      this._scopePushed = false;
    }
  }

  private releaseKeyboardScope(): void {
    if (this._scopePushed && this._keyboardScope) {
      this.app.keymap.popScope(this._keyboardScope);
      this._scopePushed = false;
    }
  }

  
  async onOpen(): Promise<void> {
    try {
      this.contentEl.empty();
      this.navigation = false;
      this.initializeKeyboardScope();

      

      
      
      
      this.containerEl.addClass('react-view-container');

      
      
      this.config.containerClass
        ?.trim()
        .split(/\s+/)
        .forEach((className) => {
          if (className) {
            this.containerEl.addClass(className);
          }
        });

      
      
      
      this.rootEl = this.contentEl.createDiv({
        cls: 'journalit-react-view-root',
      });
      if (this.config.rootId) {
        this.rootEl.id = this.config.rootId;
      }

      
      this.root = createRoot(this.rootEl);
      this.renderComponent();

      
      window.activeDocument.addEventListener(
        'theme-change',
        this._themeChangeHandler
      );
      window.addEventListener(
        'journalit-currency-changed',
        this._currencyChangeHandler
      );
      this.containerEl.ownerDocument.defaultView?.addEventListener(
        'keydown',
        this._escapeKeyHandler,
        true
      );
      this.registerEvent(
        this.app.workspace.on('active-leaf-change', () =>
          this.syncActiveKeyboardScope()
        )
      );
      this.syncActiveKeyboardScope();

      
      this.app.workspace.onLayoutReady(() => {
        
        this._pendingAnimationFrame = window.requestAnimationFrame(() => {
          this.syncActiveKeyboardScope();
          this.renderComponent();
          this._pendingAnimationFrame = null;
        });
      });
    } catch (error) {
      console.error('Failed to initialize React view:', error);
      throw error;
    }
  }

  
  protected renderComponent(): void {
    
    if (!this.root) {
      console.warn('Cannot render component: React root not initialized');
      return;
    }

    
    const viewDocument = this.containerEl.ownerDocument;
    if (
      !viewDocument.body.contains(this.containerEl) ||
      !viewDocument.body.contains(this.rootEl)
    ) {
      
      return;
    }

    try {
      
      if (!getPluginInstance()) {
        throw new Error(
          'Cannot render component: Plugin not initialized. This indicates a view registration race condition.'
        );
      }

      const viewContent = this.getRenderFunction()();
      const renderView = () =>
        this.root?.render(
          <StrictMode>
            <CurrencyProvider>
              <DisplayPolicyProvider
                privacyModeOverride={
                  this.config.displayPolicyPrivacyModeOverride
                }
              >
                <GuideRuntimeLayer
                  leaf={this.leaf}
                  viewType={this.getViewType()}
                >
                  {viewContent}
                </GuideRuntimeLayer>
              </DisplayPolicyProvider>
            </CurrencyProvider>
          </StrictMode>
        );

      renderView();
    } catch (error) {
      console.error(
        `[Journalit] Failed to render React component in ${this.getViewType()}:`,
        error
      );
    }
  }

  protected isRenderReady(): boolean {
    return this.root !== null;
  }

  
  async onClose(): Promise<void> {
    
    if (this._pendingAnimationFrame) {
      window.cancelAnimationFrame(this._pendingAnimationFrame);
      this._pendingAnimationFrame = null;
    }

    this.releaseKeyboardScope();

    
    if (this._intervals) {
      this._intervals.forEach((interval) => window.clearInterval(interval));
      this._intervals = [];
    }

    
    if (this.root) {
      try {
        this.root.unmount();
        this.root = null;
      } catch (error) {
        console.error('Failed to unmount React component:', error);
      }
    }

    this.rootEl?.remove();
    this.rootEl = null;

    
    window.activeDocument.removeEventListener(
      'theme-change',
      this._themeChangeHandler
    );
    window.removeEventListener(
      'journalit-currency-changed',
      this._currencyChangeHandler
    );
    this.containerEl.ownerDocument.defaultView?.removeEventListener(
      'keydown',
      this._escapeKeyHandler,
      true
    );

    return Promise.resolve();
  }
}
