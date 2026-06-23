

import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import React, { StrictMode } from 'react';
import { ReactViewConfig, RenderFunction } from './types';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { DisplayPolicyProvider } from '../contexts/DisplayPolicyContext';
import { getPluginInstance } from '../utils/pluginContext';
import { GuideRuntimeLayer } from '../guides/GuideRuntimeLayer';


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
  private _pendingAnimationFrame: number | null = null;
  private _intervals: number[] = [];

  constructor(leaf: WorkspaceLeaf, config: ReactViewConfig = {}) {
    super(leaf);
    this.config = {
      rootId: `react-root-${Date.now()}`,
      ...config,
    };

    
    this._themeChangeHandler = () => this.renderComponent();
    this._currencyChangeHandler = () => this.renderComponent();
  }

  
  protected abstract getRenderFunction(): RenderFunction;

  
  async onOpen(): Promise<void> {
    try {
      this.contentEl.empty();

      

      
      
      
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

      
      this.app.workspace.onLayoutReady(() => {
        
        this._pendingAnimationFrame = window.requestAnimationFrame(() => {
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
      this.root.render(
        <StrictMode>
          <CurrencyProvider>
            <DisplayPolicyProvider
              privacyModeOverride={this.config.displayPolicyPrivacyModeOverride}
            >
              <GuideRuntimeLayer leaf={this.leaf} viewType={this.getViewType()}>
                {viewContent}
              </GuideRuntimeLayer>
            </DisplayPolicyProvider>
          </CurrencyProvider>
        </StrictMode>
      );
    } catch (error) {
      console.error(
        `[Journalit] Failed to render React component in ${this.getViewType()}:`,
        error
      );
    }
  }

  
  async onClose(): Promise<void> {
    
    if (this._pendingAnimationFrame) {
      window.cancelAnimationFrame(this._pendingAnimationFrame);
      this._pendingAnimationFrame = null;
    }

    
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

    return Promise.resolve();
  }
}
