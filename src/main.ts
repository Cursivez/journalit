

import { Plugin, Notice, TFile, requireApiVersion } from 'obsidian';
import { t } from './lang/helpers';
import { JournalitSettingsTab } from './settings';
import { JournalitSettings, SettingsTabId } from './settings/types';
import { TradeFormModal } from './components/forms/trade/TradeFormModal';
import type {
  TradeFormData,
  TradeFormOpenOptions,
} from './components/forms/trade/types';
import { TradeService } from './services/trade/TradeService';
import { SetupService } from './services/setup/SetupService';
import { DRCService } from './services/drc/DRCService';
import { WeeklyReviewService } from './services/weekly/WeeklyReviewService';
import { MissedTradeService } from './services/missedTrade/MissedTradeService';
import { BacktestTradeService } from './services/backtestTrade/BacktestTradeService';
import { MonthlyReviewService } from './services/monthly/MonthlyReviewService';
import { QuarterlyReviewService } from './services/quarterly/QuarterlyReviewService';
import { CustomOptionsService } from './services/options';
import { CustomFieldsService } from './services/CustomFieldsService';
import { CustomReviewFieldsService } from './services/CustomReviewFieldsService';
import { ReviewContextInheritanceService } from './services/ReviewContextInheritanceService';
import { TradeNoteProcessor } from './components/trade';

import { ServiceManager } from './services/ServiceManager';
import { ProcessorManager } from './components/ProcessorManager';
import { ViewManager } from './views/ViewManager';
import type { NavigationSource } from './navigation/types';



import { CommandRegistry } from './commands/commandRegistry';
import { RibbonManager } from './ui/ribbonManager';
import { OnboardingManager } from './onboarding/onboardingManager';


import { AccountPageService } from './services/accountPage';
import { AccountMergeService } from './services/accountMerge';
import { BackendIntegrationService } from './services/backend';
import { SubscriptionTierService } from './services/backend/SubscriptionTierService';
import { ensureAuthReady } from './services/backend/TokenManager';
import { TradeProjectionSyncService } from './services/tradeSync/TradeProjectionSyncService';
import { TradeSyncCoordinator } from './services/tradeSync/TradeSyncCoordinator';
import { SessionPhaseWatcher } from './services/sessionMode/SessionPhaseWatcher';
import { TradeOperationResultService } from './services/tradeOperations/TradeOperationResultService';
import {
  readTradeOperationResultNotice,
  TRADE_OPERATION_RESULT_NOTICE_EVENT,
} from './services/tradeOperations/resultNotice';
import { TradeOperationSyncToast } from './components/tradeOperations/TradeOperationSyncToast';
import type { CanonicalProjectionMigrationService } from './services/tradeSync/CanonicalProjectionMigrationService';
import { InstrumentSpecService } from './services/InstrumentSpecService';
import { RecentItem } from './settings/types';

import { PluginCleanupManager } from './core/PluginCleanupManager';
import { SettingsManager } from './settings/SettingsManager';
import { UIStateManager } from './settings/UIStateManager';
import { NavigationManager } from './navigation/NavigationManager';
import { PluginInitializer } from './core/PluginInitializer';
import { UpdateNotificationService } from './services/UpdateNotificationService';
import { GraphLinkService } from './services/graph/GraphLinkService';

import { ReviewDataCache } from './services/reviewV2/ReviewDataCache';
import { EventBus } from './services/events';
import { clearOnboardingUpgradeOrigin } from './services/upgrade/upgradeOrigin';
import { GuideRegistry } from './guides/GuideRegistry';
import { ViewGuideService } from './guides/ViewGuideService';
import { mergeFreshTradeFormEditData } from './components/forms/trade/tradeFormEditData';
import { DemoSessionService } from './demo/DemoSessionService';
import {
  handleUpgradeReturn,
  parseUpgradeReturnFeature,
} from './services/upgrade/UpgradeReturnService';



const isCustomEvent = (event: Event): event is CustomEvent<unknown> =>
  event instanceof CustomEvent;

declare global {
  interface Window {
    __dropdownClickHandlerAdded?: boolean;
    __dropdownClickHandlerDocument?: Document;
    __isHandlingComboBoxRemove?: boolean;
    __obsidianStartTime?: number;
    __REACT_ERROR_OVERLAY__?: boolean;
  }
}


window.__dropdownClickHandlerAdded = false;
window.__dropdownClickHandlerDocument = undefined;
window.__isHandlingComboBoxRemove = false;


export default class JournalitPlugin extends Plugin {
  
  tradeService: TradeService;

  
  setupService: SetupService;
  
  
  drcService: DRCService;

  
  weeklyReviewService: WeeklyReviewService;

  
  monthlyReviewService: MonthlyReviewService;

  
  quarterlyReviewService: QuarterlyReviewService;

  
  missedTradeService: MissedTradeService;

  
  backtestTradeService: BacktestTradeService;

  
  optionsService: CustomOptionsService;

  
  customFieldsService: CustomFieldsService;

  
  customReviewFieldsService: CustomReviewFieldsService;

  
  reviewContextInheritanceService: ReviewContextInheritanceService;

  
  specService: InstrumentSpecService;

  

  
  accountPageService: AccountPageService;

  
  accountMergeService: AccountMergeService;

  
  backendIntegrationService: BackendIntegrationService | null = null;

  
  reviewDataCache: ReviewDataCache | null = null;

  
  eventBus: EventBus;

  
  graphLinkService: GraphLinkService;

  
  settings: JournalitSettings;

  
  tradeNoteProcessor: TradeNoteProcessor | null = null;

  
  serviceManager: ServiceManager;

  
  processorManager: ProcessorManager;

  
  viewManager: ViewManager;

  
  recentItems: RecentItem[] = [];

  
  private pluginInitializer: PluginInitializer;
  private initializationReady: Promise<void> | null = null;
  settingsManager: SettingsManager;
  uiStateManager: UIStateManager;
  commandRegistry: CommandRegistry;
  ribbonManager: RibbonManager;
  onboardingManager: OnboardingManager; 
  private cleanupManager: PluginCleanupManager;
  navigationManager: NavigationManager;
  updateNotificationService: UpdateNotificationService | null = null;
  tradeProjectionSyncService: TradeProjectionSyncService | null = null;
  tradeSyncCoordinator: TradeSyncCoordinator | null = null;
  sessionPhaseWatcher: SessionPhaseWatcher | null = null;
  tradeOperationResultService: TradeOperationResultService | null = null;
  tradeOperationSyncToast: TradeOperationSyncToast | null = null;
  canonicalProjectionMigrationService: CanonicalProjectionMigrationService | null =
    null;

  
  guideRegistry: GuideRegistry | null = null;

  
  viewGuideService: ViewGuideService | null = null;

  
  demoSessionService: DemoSessionService | null = null;

  
  settingsTab: JournalitSettingsTab | null = null;

  
  static instance: JournalitPlugin | null = null;

  waitForStartupTradeMigrations(): Promise<void> {
    return this.pluginInitializer.waitForStartupTradeMigrations();
  }

  initializeRealContextBackgroundServices(
    resumeFromSample = false
  ): Promise<void> {
    return this.pluginInitializer.initializeRealContextBackgroundServices(
      resumeFromSample
    );
  }

  waitForRealContextBackgroundServices(): Promise<void> {
    return this.pluginInitializer.waitForRealContextBackgroundServices();
  }

  
  async onload() {
    
    this.settingsManager = new SettingsManager(this);

    
    this.uiStateManager = new UIStateManager(this);

    
    this.cleanupManager = new PluginCleanupManager(this);
    Object.defineProperty(this, 'onunload', {
      configurable: true,
      value: () => this.runUnloadCleanup(),
    });

    
    this.pluginInitializer = new PluginInitializer(this);
    this.registerObsidianProtocolHandler('journalit-upgrade', (params) => {
      const feature = parseUpgradeReturnFeature(params.feature);
      if (!feature) {
        new Notice(t('onboarding.activation.notice.invalid-url'), 5000);
        return;
      }

      void (async () => {
        await this.initializationReady;
        await handleUpgradeReturn(this, feature);
      })().catch((error) => {
        console.error('[Journalit] Upgrade return failed:', error);
        new Notice(t('onboarding.activation.error.generic'));
      });
    });
    this.initializationReady = this.pluginInitializer.initialize();
    await this.initializationReady;
    const tradeOperationSyncToast = new TradeOperationSyncToast(this);
    this.tradeOperationSyncToast = tradeOperationSyncToast;

    const handleTradeOperationResultNotice = (event: Event) => {
      const detail = readTradeOperationResultNotice(event);
      const result =
        this.ensureTradeOperationResultService().getSnapshot().recentResult;
      if (!detail || !result || result.id !== detail.operationId) return;
      tradeOperationSyncToast.show(result);
    };
    window.addEventListener(
      TRADE_OPERATION_RESULT_NOTICE_EVENT,
      handleTradeOperationResultNotice
    );
    this.register(() =>
      window.removeEventListener(
        TRADE_OPERATION_RESULT_NOTICE_EVENT,
        handleTradeOperationResultNotice
      )
    );

    
    this.register402ErrorHandler();

    const startProjectionSyncForPremium = () => {
      void Promise.resolve()
        .then(() =>
          this.canonicalProjectionMigrationService?.queuePendingConflictAcknowledgements()
        )
        .then(() => {
          if (
            this.settings.backendIntegration?.subscriptionTier === 'premium'
          ) {
            this.ensureTradeProjectionSyncService();
          }
        })
        .catch((error) => {
          console.warn(
            '[Journalit] Pending projection conflict ownership failed:',
            error
          );
        });
    };
    window.addEventListener(
      'journalit:subscription-changed',
      startProjectionSyncForPremium
    );
    this.register(() =>
      window.removeEventListener(
        'journalit:subscription-changed',
        startProjectionSyncForPremium
      )
    );
    const resumeAutomaticAuth = (reason: 'online' | 'focus') => {
      void ensureAuthReady(this, { resume: reason }).then((readiness) => {
        if (readiness.status === 'unavailable') return;
        startProjectionSyncForPremium();
      });
    };
    this.registerDomEvent(window, 'online', () =>
      resumeAutomaticAuth('online')
    );
    this.registerDomEvent(window, 'focus', () => resumeAutomaticAuth('focus'));
    
    
    
    void ensureAuthReady(this)
      .then((readiness) => {
        if (
          readiness.status !== 'unavailable' &&
          readiness.status !== 'rejected'
        ) {
          void new SubscriptionTierService(this)
            .refreshTier('startup')
            .then(async (result) => {
              if (result.status !== 'premium' && result.status !== 'free')
                return;
              await this.canonicalProjectionMigrationService?.queuePendingConflictAcknowledgements();
              if (result.status === 'premium') {
                this.ensureTradeProjectionSyncService();
              }
            })
            .catch((error) => {
              console.warn('[Journalit] Startup tier refresh failed:', error);
            });
        }
        
        
        startProjectionSyncForPremium();
      })
      .catch((error) => {
        console.warn('[Journalit] Startup auth readiness failed:', error);
        startProjectionSyncForPremium();
      });
  }

  ensureTradeProjectionSyncService(): TradeProjectionSyncService {
    if (!this.tradeProjectionSyncService) {
      this.tradeProjectionSyncService = new TradeProjectionSyncService(this);
      this.tradeProjectionSyncService.start();
    }
    return this.tradeProjectionSyncService;
  }

  ensureTradeSyncCoordinator(): TradeSyncCoordinator {
    if (!this.tradeSyncCoordinator) {
      this.tradeSyncCoordinator = new TradeSyncCoordinator(this);
    }
    return this.tradeSyncCoordinator;
  }

  ensureTradeOperationResultService(): TradeOperationResultService {
    if (!this.tradeOperationResultService) {
      this.tradeOperationResultService = new TradeOperationResultService(this);
    }
    return this.tradeOperationResultService;
  }

  
  ensureSessionPhaseWatcher(): SessionPhaseWatcher {
    if (!this.sessionPhaseWatcher) {
      
      
      
      const watcher = new SessionPhaseWatcher(this);
      this.sessionPhaseWatcher = watcher;
      this.register(() => {
        watcher.destroy();
        if (this.sessionPhaseWatcher === watcher) {
          this.sessionPhaseWatcher = null;
        }
      });
    }
    return this.sessionPhaseWatcher;
  }

  
  private register402ErrorHandler(): void {
    const handler = (event: Event) => {
      
      const detail = isCustomEvent(event) ? event.detail : undefined;
      const detailRecord: Record<string, unknown> | null =
        detail && typeof detail === 'object' && !Array.isArray(detail)
          ? Object.fromEntries(Object.entries(detail))
          : null;
      const operationValue = detailRecord?.operation;
      const operation =
        typeof operationValue === 'string' ? operationValue : 'This feature';

      
      import('./components/modals/UpgradeModal')
        .then(({ openUpgradeModal }) => {
          openUpgradeModal({
            app: this.app,
            plugin: this,
            featureName: operation,
          });
        })
        .catch((error) => {
          console.error('[Journalit] Failed to load UpgradeModal:', error);
          new Notice(t('notice.error.open-upgrade-modal'));
        });
    };

    window.addEventListener('journalit:premium-required', handler);

    
    this.register(() => {
      window.removeEventListener('journalit:premium-required', handler);
    });
  }

  
  openSettings(): void {
    if (requireApiVersion('1.13.0')) {
      this.app.setting?.clearPageStack?.();
    }

    this.app.setting?.open();
    this.app.setting?.openTabById(this.manifest.id);
  }

  
  openSettingsToTab(tabId: SettingsTabId): void {
    if (requireApiVersion('1.13.0')) {
      this.app.setting?.open();
      this.app.setting?.openTabById(this.manifest.id);
      this.settingsTab?.openNativeSettingsPage(tabId);
      return;
    }

    
    if (this.settingsTab) {
      this.settingsTab.setInitialTab(tabId);
    }

    
    this.app.setting?.open();
    this.app.setting?.openTabById(this.manifest.id);
    if (this.settingsTab) {
      this.settingsTab.setInitialTab(tabId);
      this.settingsTab.renderInitialTab();
    }
    window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('journalit:open-settings-tab', {
          detail: { tabId },
        })
      );
    }, 0);
  }

  
  async openAccountDashboard(): Promise<void> {
    try {
      await this.viewManager.openAccountDashboardView();
    } catch (error) {
      console.error('Error opening account dashboard:', error);
      new Notice(
        t('notice.error.open-account-dashboard', {
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  }

  
  private async runUnloadCleanup(): Promise<void> {
    clearOnboardingUpgradeOrigin();
    await this.cleanupManager.cleanup().catch((error: unknown) => {
      console.error('Error during plugin cleanup:', error);
      
    });
  }

  onunload() {
    
    
    
    void this.runUnloadCleanup();
  }

  
  async saveSettings(): Promise<void> {
    await this.settingsManager.saveSettings(this.settings);
  }

  
  async openNavigationSidebar(): Promise<void> {
    await this.viewManager.activateNavigationSidebar();
    void this.uiStateManager.updateState({
      gettingStartedOpenedNavigationSidebar: true,
    });
  }

  async openCalendarSidebar(): Promise<void> {
    await this.viewManager.activateCalendarSidebar({
      revealExisting: true,
    });
  }

  async openSessionMode(): Promise<void> {
    await this.viewManager.activateSessionMode({
      revealExisting: true,
    });
  }

  
  async openTradeFormInEditMode(
    

    tradeData: Partial<TradeFormData>,
    filePath: string,
    openOptions?: TradeFormOpenOptions
  ): Promise<void> {
    try {
      let initialData = tradeData || {};

      if (filePath && this.tradeService) {
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile) {
          const freshTradeData = await this.tradeService.extractTradeData(file);
          if (freshTradeData) {
            initialData = mergeFreshTradeFormEditData(
              tradeData,
              freshTradeData
            );
          }
        }
      }

      const modal = new TradeFormModal({
        app: this.app,
        plugin: this,
        isEditMode: true,
        initialData,
        filePath: filePath || '',
        openOptions,
      });
      modal.open();
    } catch (error) {
      console.error('Failed to open trade form in edit mode:', error);
      new Notice(
        t('notice.error.open-trade-form-edit', {
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  }

  
  async openFile(
    filePath: string,
    createNewLeaf: boolean = true,
    focusLeaf: boolean = true,
    source: NavigationSource = 'standard'
  ): Promise<void> {
    await this.navigationManager.openFile(
      filePath,
      createNewLeaf,
      focusLeaf,
      source
    );
  }

  
  trackRecentView(viewType: string, label: string, icon: string): void {
    this.navigationManager.trackRecentView(viewType, label, icon);
  }
}
