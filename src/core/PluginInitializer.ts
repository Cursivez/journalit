import { logger } from '../utils/logger';


import { MarkdownView, Notice, TFile } from 'obsidian';
import JournalitPlugin from '../main';
import { setupPluginHook } from '../hooks/usePlugin';
import { t } from '../lang/helpers';
import { CANONICAL_EXECUTION_MIGRATION_VERSION } from '../services/trade/core/TradeFrontmatterCodec';
import { TRADE_REVIEW_MARKDOWN_MIGRATION_VERSION } from '../services/trade/core/TradeReviewMarkdownCodec';

const PERSISTENT_CACHE_VERSION = '2026-04-account-identity-v1';
const OLD_DERIVED_STORAGE_CLEANUP_VERSION = '2026-06-plugin-storage-v3';
const LEGACY_DERIVED_STORAGE_FOLDERS = [
  '.journalit/cache',
  '.journalit/indexes',
  
  
  '.journalit/migrations',
  '.journalit/oldcache',
];
import { scheduleSequence } from '../utils/deferredExecution';
import { GlobalPasteManager } from '../utils/GlobalPasteManager';
import { injectDropdownFixScript } from '../utils';
import { CommandRegistry } from '../commands/commandRegistry';
import { RibbonManager } from '../ui/ribbonManager';
import { OnboardingManager } from '../onboarding/onboardingManager';

import { imageService } from '../services/image/ImageService';
import { RecentItem } from '../settings/types';
import { NavigationManager } from '../navigation/NavigationManager';
import { UpdateNotificationService } from '../services/UpdateNotificationService';
import {
  ReleaseNotesView,
  RELEASE_NOTES_VIEW_TYPE,
} from '../components/release-notes/ReleaseNotesView';
import { ReviewDataCache } from '../services/reviewV2/ReviewDataCache';
import { EventBus, eventBus } from '../services/events';
import { ONBOARDING_VIEW_TYPE } from '../views/OnboardingView';
import { TEMPLATE_BUILDER_VIEW_TYPE } from '../views/TemplateBuilderView';
import { SETUPS_VIEW_TYPE } from '../views/SetupsView';
import { GuideRegistry } from '../guides/GuideRegistry';
import { registerHomeMainGuide } from '../guides/homeMainGuide';
import { registerTradeLogEmptyGuide } from '../guides/tradeLogEmptyGuide';
import { registerTradeLogImageGalleryEmptyGuide } from '../guides/tradeLogImageGalleryEmptyGuide';
import { registerTradeLogMainGuide } from '../guides/tradeLogMainGuide';
import { registerTradeLogWhatsNewImageGalleryGuide } from '../guides/tradeLogWhatsNewImageGalleryGuide';
import { registerDashboardEmptyGuide } from '../guides/dashboardEmptyGuide';
import { registerDashboardMainGuide } from '../guides/dashboardMainGuide';
import { registerLayoutBuilderMainGuide } from '../guides/layoutBuilderMainGuide';
import { registerAccountDashboardEmptyGuide } from '../guides/accountDashboardEmptyGuide';
import { registerAccountDashboardMainGuide } from '../guides/accountDashboardMainGuide';
import { registerAccountPageEmptyGuide } from '../guides/accountPageEmptyGuide';
import { registerAccountPageMainGuide } from '../guides/accountPageMainGuide';
import { registerSetupsMainGuide } from '../guides/setupsMainGuide';
import { ViewGuideService } from '../guides/ViewGuideService';
import {
  getJournalitCachePath,
  getJournalitIndexesPath,
} from '../services/base/pluginStoragePaths';


interface JournalitPluginInternal extends JournalitPlugin {
  lastFileOpenTime?: number;
}


export class PluginInitializer {
  private plugin: JournalitPlugin;

  constructor(plugin: JournalitPlugin) {
    this.plugin = plugin;
  }

  
  async initialize(): Promise<void> {
    
    const startTime = Date.now();
    window.__obsidianStartTime = startTime;

    
    await this.initializeCriticalPath();

    
    await this.initializeCoreServices();

    
    await this.setupEssentialUI();

    
    await this.registerCoreFunctionality();

    
    this.plugin.app.workspace.onLayoutReady(() => {
      void this.initializeNonCriticalComponents();

      
      window.setTimeout(() => {
        void this.openHomeOnStartup();
      }, 100); 

      
      window.setTimeout(() => {
        void (async () => {
          try {
            const navigationEnabled =
              this.plugin.settings.navigation?.enabled ?? true;
            if (navigationEnabled) {
              await this.plugin.viewManager.activateNavigationSidebar();
            }
          } catch (error) {
            console.error(
              '[Journalit] Failed to activate navigation sidebar:',
              error
            );
          }
        })();
      }, 150);
    });
  }

  
  private async initializeCriticalPath(): Promise<void> {
    
    
    setupPluginHook(this.plugin);

    
    imageService.setApp(this.plugin.app);
    JournalitPlugin.instance = this.plugin;

    
    this.plugin.settings = await this.plugin.settingsManager.loadSettings();

    
    await this.plugin.uiStateManager.loadState();

    
    if (this.plugin.uiStateManager.hasLegacyUIData(this.plugin.settings)) {
      const migrated = await this.plugin.uiStateManager.migrateFromSettings(
        this.plugin.settings
      );
      if (migrated) {
        this.plugin.settings = this.plugin.uiStateManager.cleanMigratedFields(
          this.plugin.settings
        );
        await this.plugin.settingsManager.saveSettings(this.plugin.settings);
      }
    }

    
    
    
    try {
      const { BackendSecretStorage } =
        await import('../services/backend/BackendSecretStorage');
      await BackendSecretStorage.migrateLegacySettings(this.plugin);
    } catch (error) {
      console.error('[Journalit] Failed to restore backend auth token:', error);
      new Notice(t('notice.error.restore-auth'), 10000);
      
    }

    
    const uiState = this.plugin.uiStateManager.getState();
    this.plugin.recentItems = [...(uiState.recentItems || [])];

    eventBus.publish('recent-items:changed', {
      recentItems: this.plugin.recentItems.map((item) => ({
        path: item.path || item.viewType || '',
        timestamp: new Date(item.openedAt).getTime(),
        type: item.type,
      })),
    });

    
    await this.cleanupOldFiles();
    await this.cleanupOldDerivedStorageIfNeeded();
    await this.resetPersistentCachesIfNeeded();

    
    (this.plugin as JournalitPluginInternal).lastFileOpenTime = Date.now();

    
    injectDropdownFixScript();

    
    const [{ ServiceManager }, { ProcessorManager }, { ViewManager }] =
      await Promise.all([
        import('../services/ServiceManager'),
        import('../components/ProcessorManager'),
        import('../views/ViewManager'),
      ]);

    this.plugin.serviceManager = ServiceManager.getInstance(
      this.plugin.app,
      this.plugin
    );
    this.plugin.processorManager = ProcessorManager.getInstance(
      this.plugin.app,
      this.plugin
    );
    this.plugin.viewManager = ViewManager.getInstance(this.plugin);

    
    
    this.plugin.eventBus = EventBus.getInstance();

    
    
    this.plugin.processorManager.getWidgetCodeblockProcessor();

    
    this.plugin.navigationManager = new NavigationManager(
      this.plugin,
      this.plugin.viewManager
    );

    
    this.plugin.guideRegistry = new GuideRegistry();
    registerHomeMainGuide(this.plugin.guideRegistry);
    registerTradeLogEmptyGuide(this.plugin.guideRegistry);
    registerTradeLogImageGalleryEmptyGuide(this.plugin.guideRegistry);
    registerTradeLogWhatsNewImageGalleryGuide(this.plugin.guideRegistry);
    registerTradeLogMainGuide(this.plugin.guideRegistry);
    registerDashboardEmptyGuide(this.plugin.guideRegistry);
    registerDashboardMainGuide(this.plugin.guideRegistry);
    registerLayoutBuilderMainGuide(this.plugin.guideRegistry);
    registerAccountDashboardEmptyGuide(this.plugin.guideRegistry);
    registerAccountDashboardMainGuide(this.plugin.guideRegistry);
    registerAccountPageEmptyGuide(this.plugin.guideRegistry);
    registerAccountPageMainGuide(this.plugin.guideRegistry);
    registerSetupsMainGuide(this.plugin.guideRegistry);

    this.plugin.viewGuideService = new ViewGuideService(this.plugin);
    await this.plugin.viewGuideService.initialize();
  }

  
  private async initializeCoreServices(): Promise<void> {
    await this.plugin.serviceManager.initializeCoreServices();

    
    this.plugin.tradeService = this.plugin.serviceManager.getTradeService();
    this.plugin.customFieldsService =
      this.plugin.serviceManager.getCustomFieldsService();
    this.plugin.customReviewFieldsService =
      this.plugin.serviceManager.getCustomReviewFieldsService();
    this.plugin.reviewContextInheritanceService =
      this.plugin.serviceManager.getReviewContextInheritanceService();
    this.plugin.optionsService =
      this.plugin.serviceManager.getOptionsServiceSync();

    
    
    this.plugin.reviewDataCache = new ReviewDataCache(
      this.plugin.app,
      this.plugin
    );

    
    
    
    void this.plugin.tradeService
      .waitForTradeDataReady()
      .then(async () => {
        await this.plugin.tradeService.getTradeData({ fresh: true });
        await this.runCanonicalExecutionMigrationIfNeeded();
        await this.runTradeReviewMarkdownMigration();
      })
      .catch((err) => {
        console.error('[Journalit] Failed to pre-warm trade cache:', err);
      });

    
    const { InstrumentSpecService } =
      await import('../services/InstrumentSpecService');
    this.plugin.specService = new InstrumentSpecService(this.plugin);
    try {
      this.plugin.specService.loadMappings();
      logger.debug('[Journalit] InstrumentSpecService initialized');
    } catch (error) {
      console.error(
        '[Journalit] Failed to load symbol mappings from settings, continuing with empty mappings:',
        error
      );
    }

    
    this.plugin.updateNotificationService = new UpdateNotificationService(
      this.plugin
    );

    
    this.plugin.registerView(
      RELEASE_NOTES_VIEW_TYPE,
      (leaf) => new ReleaseNotesView(leaf)
    );

    
    try {
      await this.plugin.viewManager.registerHomeView();
    } catch (error) {
      console.error('[Journalit] Failed to register home view early:', error);
      
    }
  }

  private async runCanonicalExecutionMigrationIfNeeded(): Promise<void> {
    if (
      this.plugin.settings.trade.canonicalExecutionMigrationVersion ===
      CANONICAL_EXECUTION_MIGRATION_VERSION
    ) {
      return;
    }

    const result =
      await this.plugin.tradeService.migrateLegacyExecutionFields();
    if (result.failed > 0) {
      console.warn(
        `[Journalit] Legacy execution migration completed with ${result.failed} failures`,
        result.errors
      );
    }
    if (result.migrated > 0) {
      logger.info(
        `[Journalit] Backfilled canonical execution data for ${result.migrated} trade notes`
      );
    }
  }

  private async runTradeReviewMarkdownMigration(): Promise<void> {
    if (
      this.plugin.settings.trade.tradeReviewMarkdownMigrationVersion ===
      TRADE_REVIEW_MARKDOWN_MIGRATION_VERSION
    ) {
      return;
    }

    const result =
      await this.plugin.tradeService.migrateTradeReviewFrontmatterToMarkdown();
    if (result.failed > 0) {
      console.warn(
        `[Journalit] Trade review markdown migration completed with ${result.failed} failures`
      );
    }
    if (result.migrated > 0) {
      logger.info(
        `[Journalit] Migrated ${result.migrated} trade review frontmatter entries to markdown`
      );
    }
  }

  
  private async setupEssentialUI(): Promise<void> {
    const { JournalitSettingsTab } =
      await import('../settings/JournalitSettingsTab');

    
    await Promise.resolve();
    
    const settingsTab = new JournalitSettingsTab(this.plugin.app, this.plugin);
    this.plugin.settingsTab = settingsTab;
    this.plugin.addSettingTab(settingsTab);

    
    this.setupEventHandlers();
  }

  
  private setupEventHandlers(): void {
    this.plugin.viewManager.registerSetupMarkdownOpenInterceptor();

    
    this.plugin.registerEvent(
      this.plugin.app.workspace.on('file-open', (file) => {
        
        (this.plugin as JournalitPluginInternal).lastFileOpenTime = Date.now();

        
        if (file) {
          const recentItem: RecentItem = {
            type: 'file',
            title: file.basename,
            path: file.path,
            icon: 'file-text',
            openedAt: new Date().toISOString(),
          };
          void this.plugin.navigationManager.addRecentItem(recentItem);
        }

        if (file instanceof TFile) {
          window.setTimeout(() => {
            const markdownView =
              this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
            void this.plugin.viewManager.maybeOpenSetupMarkdownAsSetupsView(
              markdownView?.leaf ?? null
            );
          }, 0);
        }
      })
    );

    this.plugin.registerEvent(
      this.plugin.app.workspace.on('file-menu', (menu, file, _source, leaf) => {
        if (!(file instanceof TFile) || !(leaf?.view instanceof MarkdownView)) {
          return;
        }
        const cache = this.plugin.app.metadataCache.getFileCache(file);
        const isSetupFile = cache?.frontmatter?.['journalit-setup'] === true;
        if (!isSetupFile) return;
        menu.addItem((item) => {
          item
            .setTitle(t('setups.view.open-as-setup'))
            .setIcon('flask-conical')
            .setSection('pane')
            .onClick(() => {
              void this.plugin.viewManager.openSetupFileAsSetupsView(
                file,
                leaf
              );
            });
        });
      })
    );

    
    this.plugin.registerEvent(
      this.plugin.app.workspace.on('active-leaf-change', (leaf) => {
        if (leaf && leaf.view) {
          const viewType = leaf.view.getViewType();

          
          const getViewInfo = (
            type: string
          ): { label: string; icon: string } | null => {
            switch (type) {
              case 'journalit-dashboard-view':
                return { label: t('view.dashboard'), icon: 'grip' };
              case 'account-dashboard':
                return { label: t('view.account-dashboard'), icon: 'users' };
              case 'journalit-trade-log-view':
                return { label: t('view.trade-log'), icon: 'folder-tree' };
              case 'journalit-account-page-view': {
                
                const displayText = leaf.getDisplayText();
                return {
                  label: displayText || t('view.account-page.title-default'),
                  icon: 'user',
                };
              }
              case ONBOARDING_VIEW_TYPE:
                return {
                  label: t('onboarding.view.title'),
                  icon: 'circle-dot-dashed',
                };
              case TEMPLATE_BUILDER_VIEW_TYPE:
                return {
                  label: t('view.layout-builder'),
                  icon: 'lucide-blocks',
                };
              case SETUPS_VIEW_TYPE:
                return {
                  label: t('setups.view.title'),
                  icon: 'flask-conical',
                };
              default:
                return null;
            }
          };

          const viewInfo = getViewInfo(viewType);
          if (viewInfo) {
            
            this.plugin.navigationManager.trackRecentView(
              viewType,
              viewInfo.label,
              viewInfo.icon
            );
          }

          if (leaf.view instanceof MarkdownView) {
            window.setTimeout(() => {
              void this.plugin.viewManager.maybeOpenSetupMarkdownAsSetupsView(
                leaf
              );
            }, 0);
          }
        }
      })
    );
  }

  
  private async registerCoreFunctionality(): Promise<void> {
    
    await Promise.all([
      this.plugin.viewManager.registerDashboardView(),
      this.plugin.viewManager.registerAccountDashboardView(),
      this.plugin.viewManager.registerTradeLogView(),
      this.plugin.viewManager.registerAccountPageView(),
      this.plugin.viewManager.registerCSVImportView(),
      this.plugin.viewManager.registerOnboardingView(),
      this.plugin.viewManager.registerTemplateBuilderView(),
      this.plugin.viewManager.registerSetupsView(),
      this.plugin.viewManager.registerNavigationView(),
      this.plugin.viewManager.registerCalendarSidebarView(),
      this.plugin.viewManager.registerSessionModeView(),
    ]);

    logger.debug('[Journalit] All views registered successfully');
  }

  
  private async initializeNonCriticalComponents(): Promise<void> {
    try {
      
      

      
      
      
      try {
        
        this.plugin.serviceManager.preInitializeServices(['onboardingService']);

        
        
        const scheduleOnboardingCheck = () => {
          void this.plugin.onboardingManager?.checkAndShowOnboarding();
        };

        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(scheduleOnboardingCheck);
        } else {
          window.setTimeout(scheduleOnboardingCheck, 100);
        }
      } catch (err) {
        console.warn('[Journalit] Failed to warm-up onboarding modules:', err);
      }

      
      

      
      this.plugin.commandRegistry = new CommandRegistry(this.plugin);
      this.plugin.ribbonManager = new RibbonManager(this.plugin);
      this.plugin.onboardingManager = new OnboardingManager(this.plugin);

      
      
      await scheduleSequence(
        [
          
          
          () => {
            
            this.plugin.commandRegistry.registerAllCommands();
            this.plugin.ribbonManager.registerRibbonIcons();
          },

          
          
          async () => {
            
            
            await this.plugin.processorManager.initializeRequiredProcessors();

            

            
            const processors =
              this.plugin.processorManager.getAllInitializedProcessors();
            this.plugin.tradeNoteProcessor = processors.tradeNoteProcessor;
          },

          
          
          async () => {
            
            
            
            try {
              
              this.plugin.setupService =
                await this.plugin.serviceManager.getSetupService();
              this.plugin.drcService =
                await this.plugin.serviceManager.getDRCService();
            } catch (error) {
              console.error(
                'Error initializing high-priority services:',
                error
              );
            }
          },

          
          
          async () => {
            
            try {
              this.plugin.weeklyReviewService =
                await this.plugin.serviceManager.getWeeklyReviewService();
              this.plugin.monthlyReviewService =
                await this.plugin.serviceManager.getMonthlyReviewService();
              this.plugin.quarterlyReviewService =
                await this.plugin.serviceManager.getQuarterlyReviewService();
              this.plugin.missedTradeService =
                await this.plugin.serviceManager.getMissedTradeService();
              this.plugin.backtestTradeService =
                await this.plugin.serviceManager.getBacktestTradeService();

              
              GlobalPasteManager.getInstance().initialize();
            } catch (error) {
              console.error('Error initializing secondary services:', error);
            }
          },

          
          
          async () => {
            
            try {
              
              this.plugin.accountPageService =
                await this.plugin.serviceManager.getAccountPageService();
            } catch (error) {
              console.error('Error initializing background services:', error);
            }
          },

          
          
          async () => {
            
            await this.handleInitialFileRendering();
          },

          
          
          async () => {
            
            try {
              // intentional
              
            } catch (error) {
              console.error(
                'Error checking accounts for monthly billing:',
                error
              );
            }

            
            try {
              if (this.plugin.settings.backendIntegration?.syncEnabled) {
                const backendService =
                  await this.plugin.serviceManager.getBackendIntegrationService();

                
                this.plugin.backendIntegrationService = backendService;

                
                await backendService.registerVault({
                  suppressPremiumPrompt: true,
                });
              }
            } catch (error) {
              console.error('Error initializing backend integration:', error);
              
            }

            
            try {
              await this.plugin.updateNotificationService?.checkForUpdates();
            } catch (error) {
              console.error('Error checking for plugin updates:', error);
            }
          },
        ],
        30
      ); 
    } catch (error) {
      console.error('Error during non-critical initialization:', error);
    }
  }

  
  private async handleInitialFileRendering(): Promise<void> {
    const activeFile = this.plugin.app.workspace.getActiveFile();
    if (!activeFile) return;

    const cache = this.plugin.app.metadataCache.getFileCache(activeFile);
    const frontmatter = cache?.frontmatter;

    if (!frontmatter) return;

    if (frontmatter.type === 'trade') {
      
      if (!this.plugin.tradeNoteProcessor) {
        this.plugin.tradeNoteProcessor =
          await this.plugin.processorManager.getTradeNoteProcessor();
      }
    }
  }

  
  private async openHomeOnStartup(): Promise<void> {
    await this.plugin.navigationManager.openHomeOnStartup();
  }

  private async clearDirectoryFiles(path: string): Promise<number> {
    const adapter = this.plugin.app.vault.adapter;

    try {
      const listing = await adapter.list(path);
      let removedCount = 0;

      if (listing?.files) {
        for (const file of listing.files) {
          await adapter.remove(file);
          removedCount += 1;
        }
      }

      return removedCount;
    } catch (error) {
      if (this.isMissingPathError(error)) {
        return 0;
      }

      throw error;
    }
  }

  private isMissingPathError(error: unknown): boolean {
    return (
      error !== null &&
      typeof error === 'object' &&
      'code' in error &&
      Reflect.get(error, 'code') === 'ENOENT'
    );
  }

  private async removeDirectoryContents(path: string): Promise<number> {
    const adapter = this.plugin.app.vault.adapter;

    try {
      const listing = await adapter.list(path);
      let removedCount = 0;

      for (const file of listing.files ?? []) {
        await adapter.remove(file);
        removedCount += 1;
      }

      for (const folder of listing.folders ?? []) {
        removedCount += await this.removeDirectoryContents(folder);
        await adapter.rmdir(folder, false);
        removedCount += 1;
      }

      return removedCount;
    } catch (error) {
      if (this.isMissingPathError(error)) return 0;
      throw error;
    }
  }

  private async removeLegacyDerivedFolder(path: string): Promise<void> {
    const adapter = this.plugin.app.vault.adapter;
    try {
      if (!(await adapter.exists(path))) return;
      await this.removeDirectoryContents(path);
      await adapter.rmdir(path, false);
    } catch (error) {
      if (this.isMissingPathError(error)) return;
      throw error;
    }
  }

  private async cleanupOldDerivedStorageIfNeeded(): Promise<void> {
    const uiState = this.plugin.uiStateManager.getState();
    if (
      uiState.oldDerivedStorageCleanupVersion ===
      OLD_DERIVED_STORAGE_CLEANUP_VERSION
    ) {
      return;
    }

    try {
      const adapter = this.plugin.app.vault.adapter;
      for (const folder of LEGACY_DERIVED_STORAGE_FOLDERS) {
        await this.removeLegacyDerivedFolder(folder);
      }

      if (await adapter.exists('.journalit')) {
        const listing = await adapter.list('.journalit');
        if (
          (listing.files ?? []).length === 0 &&
          (listing.folders ?? []).length === 0
        ) {
          await adapter.rmdir('.journalit', false);
        }
      }

      await this.plugin.uiStateManager.updateStateImmediate({
        oldDerivedStorageCleanupVersion: OLD_DERIVED_STORAGE_CLEANUP_VERSION,
      });
    } catch (error) {
      console.warn(
        '[Journalit] Failed to clean up legacy .journalit derived storage:',
        error
      );
    }
  }

  private async resetPersistentCachesIfNeeded(): Promise<void> {
    const uiState = this.plugin.uiStateManager.getState();
    if (uiState.persistentCacheVersion === PERSISTENT_CACHE_VERSION) {
      return;
    }

    try {
      const cacheFilesRemoved = await this.clearDirectoryFiles(
        getJournalitCachePath(this.plugin.app)
      );
      const indexFilesRemoved = await this.clearDirectoryFiles(
        getJournalitIndexesPath(this.plugin.app)
      );

      logger.info(
        `[Journalit] Reset persisted caches for ${PERSISTENT_CACHE_VERSION} (cache files: ${cacheFilesRemoved}, index files: ${indexFilesRemoved})`
      );

      await this.plugin.uiStateManager.updateState({
        persistentCacheVersion: PERSISTENT_CACHE_VERSION,
      });
    } catch (error) {
      console.error('[Journalit] Failed to reset persisted caches:', error);
    }
  }

  
  private async cleanupOldFiles(): Promise<void> {
    try {
      const oldCssPath = `${this.plugin.app.vault.configDir}/plugins/journalit/main.css`;
      const adapter = this.plugin.app.vault.adapter;
      if (await adapter.exists(oldCssPath)) {
        await adapter.remove(oldCssPath);
        logger.debug('[Journalit] Removed deprecated main.css file');
      }
    } catch (error) {
      console.error('[Journalit] Error cleaning up old files:', error);
    }
  }
}
