

import JournalitPlugin from '../main';
import { GlobalPasteManager } from '../utils/GlobalPasteManager';
import { removeDropdownFixScript } from '../utils';
import { resetPluginHookState } from '../hooks/usePlugin';
import { EventBus } from '../services/events';


interface ElementWithEmpty {
  empty?: () => void;
}

export class PluginCleanupManager {
  private plugin: JournalitPlugin;

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  
  async cleanup(): Promise<void> {
    
    if (this.plugin.uiStateManager) {
      try {
        await this.plugin.uiStateManager.flush();
      } catch (error) {
        console.error('Error flushing UI state on unload:', error);
      }
    }

    
    if (this.plugin.settingsManager) {
      try {
        await this.plugin.settingsManager.getDebouncedSave().flush();
      } catch (error) {
        
        const message = error instanceof Error ? error.message : String(error);
        if (!message.includes('cancelled')) {
          console.error(
            'Error flushing settings manager debounced save on unload:',
            error
          );
        }
      }
    }

    if (this.plugin.viewGuideService) {
      try {
        await this.plugin.viewGuideService.destroy();
      } catch (error) {
        console.error(
          'Error tearing down view guide service on unload:',
          error
        );
      } finally {
        this.plugin.viewGuideService = null;
        this.plugin.guideRegistry = null;
      }
    }

    
    
    removeDropdownFixScript();
    window.__obsidianStartTime = undefined;

    
    
    try {
      this.plugin.viewManager?.cleanupViews();
    } catch (e) {
      console.error('Error cleaning up view manager state:', e);
    }

    
    try {
      if (this.plugin.processorManager) {
        this.plugin.processorManager.cleanupProcessors();
      } else {
        
        if (this.plugin.tradeNoteProcessor) {
          this.plugin.tradeNoteProcessor.cleanup();
        }
      }
    } catch (e) {
      console.error('Error cleaning up processors:', e);
    }

    
    this.plugin.tradeNoteProcessor = null;

    
    try {
      GlobalPasteManager.getInstance().cleanup();
    } catch (e) {
      console.error('Error cleaning up GlobalPasteManager:', e);
    }

    
    const cleanupSelectors = [
      '.journalit-trade-view',
      '.journalit-trade-note-wrapper',
      '.journalit-drc-view',
      '.journalit-drc-note-wrapper',
      '.weekly-review-wrapper',
      '.journalit-weekly-review-view',
      '.weekly-review',
      
    ];

    
    cleanupSelectors.forEach((selector) => {
      try {
        const elements = window.activeDocument.querySelectorAll(selector);

        elements.forEach((el) => {
          try {
            if (
              selector === '.weekly-review' &&
              typeof (el as ElementWithEmpty).empty === 'function'
            ) {
              
              (el as ElementWithEmpty).empty?.();
            }
            el.remove();
          } catch (err) {
            console.error(`Error removing element ${selector}:`, err);
          }
        });
      } catch (err) {
        console.error(`Error processing selector ${selector}:`, err);
      }
    });

    
    resetPluginHookState();
    JournalitPlugin.instance = null;

    
    if (this.plugin.serviceManager) {
      this.plugin.serviceManager.cleanupServices();
    } else {
      
      
      
      for (const serviceKey of [
        'tradeService',
        'setupService',
        'drcService',
        'weeklyReviewService',
        'monthlyReviewService',
        'optionsService',
        'customFieldsService',
        'customReviewFieldsService',
        'reviewContextInheritanceService',
      ]) {
        Reflect.set(this.plugin, serviceKey, null);
      }
      
      this.plugin.backendIntegrationService = null;
    }

    
    this.plugin.backendIntegrationService = null;

    
    if (this.plugin.reviewDataCache) {
      this.plugin.reviewDataCache.destroy();
      this.plugin.reviewDataCache = null;
    }

    
    try {
      EventBus.resetInstance();
    } catch (e) {
      console.error('Error cleaning up EventBus:', e);
    }

    
    if (this.plugin.updateNotificationService) {
      this.plugin.updateNotificationService.cleanup();
      this.plugin.updateNotificationService = null;
    }
  }
}
