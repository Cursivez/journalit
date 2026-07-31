

import React from 'react';
import { ViewStateResult, WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import JournalitPlugin from '../main';
import { HomePage } from '../components/home/HomePage';
import type { HomeViewMode } from '../settings/types';
import {
  HOME_MODE_CHANGE_EVENT,
  type HomeModeChangeEventDetail,
} from '../components/home/homeModeEvents';

export const HOME_VIEW_TYPE = 'journalit-home-view';

export class HomeView extends ReactView {
  plugin: JournalitPlugin;
  
  private mode: HomeViewMode;

  constructor(leaf: WorkspaceLeaf, plugin: JournalitPlugin) {
    super(leaf, {
      containerClass: 'journalit-home-view-container',
      rootId: 'journalit-home-view',
    });

    this.plugin = plugin;
    this.mode = plugin.uiStateManager.getState().homeViewMode ?? 'overview';
  }

  getViewType(): string {
    return HOME_VIEW_TYPE;
  }

  getDisplayText(): string {
    return 'Journalit';
  }

  getIcon(): string {
    return 'circle-dot-dashed';
  }

  public setMode(mode: HomeViewMode): void {
    this.trackModeChange(mode);
    this.notifyModeChange({ mode, source: 'navigation' });
  }

  private notifyModeChange(detail: HomeModeChangeEventDetail): void {
    this.containerEl.dispatchEvent(
      new CustomEvent(HOME_MODE_CHANGE_EVENT, {
        detail,
      })
    );
  }

  public getMode(): HomeViewMode {
    return this.mode;
  }

  
  public trackModeChange(mode: HomeViewMode): void {
    this.mode = mode;
    void this.plugin.uiStateManager.updateState({ homeViewMode: mode });
  }

  async setState(state: unknown, result: ViewStateResult): Promise<void> {
    await super.setState(state, result);
    if (!state || typeof state !== 'object' || !('mode' in state)) return;
    const mode = Reflect.get(state, 'mode');
    if (mode === 'overview' || mode === 'dashboard') {
      this.mode = mode;
      this.notifyModeChange({ mode, source: 'restoration' });
    }
  }

  getState(): Record<string, unknown> {
    return {
      ...super.getState(),
      mode: this.mode,
    };
  }

  protected getRenderFunction(): RenderFunction {
    const HomeViewRenderer = () => (
      <HomePage
        plugin={this.plugin}
        leaf={this.leaf}
        modeEventTarget={this.containerEl}
        getInitialMode={() => this.mode}
        onModeChange={(mode) => this.trackModeChange(mode)}
      />
    );
    HomeViewRenderer.displayName = 'HomeViewRenderer';
    return HomeViewRenderer;
  }
}
