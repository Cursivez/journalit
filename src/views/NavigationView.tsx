import React from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { ReactView } from './ReactView';
import { RenderFunction } from './types';
import JournalitPlugin from '../main';
import { NavigationSidebar } from '../components/navigation/NavigationSidebar';
import {
  ensureNavigationStyles,
  injectNavigationStyles,
} from '../styles/navigationStyles';
import { t } from '../lang/helpers';

export const NAVIGATION_VIEW_TYPE = 'journalit-navigation-view';

export class NavigationView extends ReactView {
  private plugin: JournalitPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: JournalitPlugin) {
    super(leaf, {
      containerClass: 'journalit-navigation-view-container',
      rootId: 'journalit-navigation-view',
    });
    this.plugin = plugin;
  }

  getViewType(): string {
    return NAVIGATION_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t('navigation.title');
  }

  getIcon(): string {
    return 'circle-dot-dashed';
  }

  async onOpen(): Promise<void> {
    this.containerEl.addClass('journalit-navigation-view-container');
    await super.onOpen();
  }

  protected getRenderFunction(): RenderFunction {
    const NavigationViewRenderer = () => (
      <NavigationSidebar plugin={this.plugin} />
    );
    NavigationViewRenderer.displayName = 'NavigationViewRenderer';
    return NavigationViewRenderer;
  }
}
