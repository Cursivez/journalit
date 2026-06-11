

import React from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import JournalitPlugin from '../main';
import { HomePage } from '../components/home/HomePage';

export const HOME_VIEW_TYPE = 'journalit-home-view';

export class HomeView extends ReactView {
  plugin: JournalitPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: JournalitPlugin) {
    super(leaf, {
      containerClass: 'journalit-home-view-container',
      rootId: 'journalit-home-view',
    });

    this.plugin = plugin;
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

  protected getRenderFunction(): RenderFunction {
    const HomeViewRenderer = () => <HomePage plugin={this.plugin} />;
    HomeViewRenderer.displayName = 'HomeViewRenderer';
    return HomeViewRenderer;
  }
}
