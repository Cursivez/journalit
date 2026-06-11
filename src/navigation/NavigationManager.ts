import { logger } from '../utils/logger';


import { App, TFile, WorkspaceLeaf, FileView } from 'obsidian';
import { isViewWithTFile } from '../types/obsidian-extensions';
import { RecentItem } from '../settings/types';
import { HOME_VIEW_TYPE } from '../views/HomeView';
import { NAVIGATION_VIEW_TYPE } from '../views/NavigationView';
import { ViewManager } from '../views/ViewManager';
import JournalitPlugin from '../main';
import { eventBus } from '../services/events/EventBus';
import type { NavigationSource } from './types';

export class NavigationManager {
  private plugin: JournalitPlugin;
  private app: App;
  private viewManager: ViewManager;

  constructor(plugin: JournalitPlugin, viewManager: ViewManager) {
    this.plugin = plugin;
    this.app = plugin.app;
    this.viewManager = viewManager;
  }

  
  async openFile(
    filePath: string,
    createNewLeaf: boolean = true,
    focusLeaf: boolean = true,
    source: NavigationSource = 'standard'
  ): Promise<void> {
    try {
      
      const file = this.app.vault.getAbstractFileByPath(filePath);

      if (file instanceof TFile) {
        
        let existingLeaf: WorkspaceLeaf | null = null;
        this.app.workspace.iterateAllLeaves((leaf) => {
          if (existingLeaf) return; 

          
          
          if (
            leaf.view instanceof FileView &&
            leaf.view.file?.path === filePath
          ) {
            existingLeaf = leaf;
            return;
          }

          
          if (leaf.view && isViewWithTFile(leaf.view)) {
            if (leaf.view.file.path === filePath) {
              existingLeaf = leaf;
              return;
            }
          }

          
          const state = leaf.view?.getState?.();
          if (state?.file === filePath) {
            existingLeaf = leaf;
            return;
          }
        });

        if (existingLeaf) {
          
          this.app.workspace.revealLeaf(existingLeaf);
          this.app.workspace.setActiveLeaf(existingLeaf, {
            focus: focusLeaf,
          });
          return;
        }

        
        let leaf: WorkspaceLeaf;
        if (createNewLeaf) {
          leaf = this.app.workspace.getLeaf('tab');
        } else if (source === 'sidebar') {
          
          
          const mostRecent = this.app.workspace.getMostRecentLeaf();
          if (
            mostRecent &&
            mostRecent.getRoot() === this.app.workspace.rootSplit &&
            mostRecent.view.getViewType() !== NAVIGATION_VIEW_TYPE
          ) {
            leaf = mostRecent;
          } else {
            leaf = this.app.workspace.getLeaf('tab');
          }
        } else {
          
          leaf = this.app.workspace.getLeaf();
        }

        await leaf.openFile(file);
        this.app.workspace.revealLeaf(leaf);
        this.app.workspace.setActiveLeaf(leaf, { focus: focusLeaf });
      } else {
        console.error(
          `Could not open file: ${filePath} - File not found or not a valid file`
        );
      }
    } catch (error) {
      console.error(`Error opening file: ${filePath}`, error);
    }
  }

  
  trackRecentView(viewType: string, label: string, icon: string): void {
    
    if (viewType === HOME_VIEW_TYPE) return;

    const newItem: RecentItem = {
      type: 'view',
      title: label,
      viewType: viewType,
      icon: icon,
      openedAt: new Date().toISOString(),
    };

    void this.addRecentItem(newItem);
  }

  
  async addRecentItem(item: RecentItem): Promise<void> {
    const recentItems = this.plugin.recentItems;

    
    const filteredItems = recentItems.filter((existing) => {
      if (item.type === 'file') {
        return existing.path !== item.path;
      } else {
        
        return (
          existing.viewType !== item.viewType || existing.title !== item.title
        );
      }
    });

    
    filteredItems.unshift(item);

    
    const updatedItems =
      filteredItems.length > 20 ? filteredItems.slice(0, 20) : filteredItems;

    
    this.plugin.recentItems = updatedItems;

    
    await this.plugin.uiStateManager.updateState({
      recentItems: [...updatedItems],
    });

    
    eventBus.publish('recent-items:changed', {
      recentItems: updatedItems.map((item) => ({
        path: item.path || item.viewType || '',
        timestamp: new Date(item.openedAt).getTime(),
        type: item.type,
      })),
    });
  }

  
  async openHomeOnStartup(): Promise<void> {
    try {
      const settings = this.plugin.settings;
      const homeStartupBehavior =
        settings.general?.homeStartupBehavior || 'always';

      
      if (homeStartupBehavior === 'never') {
        return;
      }

      
      const existingHome = this.app.workspace.getLeavesOfType(HOME_VIEW_TYPE);
      if (existingHome.length > 0) {
        logger.debug(
          '[Journalit] Home view already exists from workspace restoration'
        );
        if (homeStartupBehavior === 'always') {
          
          logger.debug('[Journalit] Revealing existing home view');
          this.app.workspace.revealLeaf(existingHome[0]);
        }
        return;
      }

      
      let shouldOpen = false;

      if (homeStartupBehavior === 'always') {
        shouldOpen = true;
      } else if (homeStartupBehavior === 'ifNone') {
        
        const activeFile = this.app.workspace.getActiveFile();
        const allLeaves = this.app.workspace.getLeavesOfType('markdown');
        const hasActiveContent = activeFile || allLeaves.length > 0;

        shouldOpen = !hasActiveContent;
      }

      if (shouldOpen) {
        logger.debug('[Journalit] Opening Journalit view on startup');
        await this.viewManager.openHomeView();
      }
    } catch (error) {
      console.error('Error opening Journalit on startup:', error);
    }
  }
}
