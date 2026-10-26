

import { App, TFile } from 'obsidian';
import { TradeNoteWriter } from './trade/TradeNoteWriter';
import { TradeService } from './trade/TradeService';
import { lazyLoad } from '../utils/dynamicImport';
import JournalitPlugin from '../main';
import { BackendSecretStorage } from './backend/BackendSecretStorage';
import { scheduleIdle, scheduleSequence } from '../utils/deferredExecution';


import { SetupService } from './setup/SetupService';
import { DRCService } from './drc/DRCService';
import { WeeklyReviewService } from './weekly/WeeklyReviewService';
import { MonthlyReviewService } from './monthly/MonthlyReviewService';
import { QuarterlyReviewService } from './quarterly/QuarterlyReviewService';
import { YearlyReviewService } from './yearly/YearlyReviewService';
import { CustomOptionsService, OptionType } from './options';
import { CustomFieldsService } from './CustomFieldsService';
import { CustomReviewFieldsService } from './CustomReviewFieldsService';
import { ReviewContextInheritanceService } from './ReviewContextInheritanceService';
import { CustomDataService } from './base/CustomDataService';

import { BackendIntegrationService } from './backend';
import { OnboardingService } from './onboarding/OnboardingService';
import { MissedTradeService } from './missedTrade/MissedTradeService';
import { BacktestTradeService } from './backtestTrade/BacktestTradeService';
import { AccountPageService } from './accountPage';
import { FolderPathService } from './core/FolderPathService';
import { EconomicCalendarService } from './economicCalendar/EconomicCalendarService';
import { ImageGalleryVaultWatcher } from './imageGallery/ImageGalleryVaultWatcher';
import { ReviewStreakService } from './reviewStreak/ReviewStreakService';
import { ServiceName, ServiceRegistry } from '../types/ServiceRegistry';
import type { JournalSettingsContext } from '../demo/DemoSettingsScope';
import { PropFirmProfileCatalogService } from './propChallenge/PropFirmProfileCatalogService';
import {
  AgentEntityIdentityService,
  AgentTradeIdentityService,
} from './agent/identity';
import { AgentToolRegistry } from './agent/AgentToolRegistry';
import { AgentResultCache } from './agent/AgentResultCache';
import { ActionBatchService } from './actions/ActionBatchService';
import { AgentApprovalCardController } from './actions/AgentApprovalCardController';
import { AgentRequestsModal } from '../components/agentRequests/AgentRequestsModal';
import { TradeUpdateAction } from './actions/domains/tradeUpdateAction';
import { createCustomFieldActions } from './actions/domains/customFieldActions';
import { createSessionLogEntryActions } from './actions/domains/sessionLogEntryActions';
import { createKeyEventActions } from './actions/domains/keyEventActions';
import { createDayTradeFieldActions } from './actions/domains/dayTradeFieldActions';
import { createUnplannedSessionActions } from './actions/domains/unplannedSessionActions';
import {
  canStartUnplannedSession,
  getRunningUnplannedSession,
  resolveCurrentSessionModePhase,
  startUnplannedSession,
  stopUnplannedSession,
} from '../components/sessionMode/unplannedSessionUtils';
import { readTradeJournalValues } from './trade/core/TradeJournalFields';
import { DAY_TRADE_FIELDS_KEY } from './drc/dayTradeFields';
import {
  formatLocalDateString,
  isWeekendSkippingEnabled,
} from '../utils/dateUtils';
import { getTradingDay } from '../utils/tradingDayUtils';
import { createReviewImageActions } from './actions/domains/reviewImageActions';
import { readSessionLogEntries } from './sessionLog/sessionLogEntries';
import { createSessionLogTagActions } from './actions/domains/sessionLogTagActions';
import { createAccountActions } from './actions/domains/accountActions';
import { AgentChangeHistory } from './actions/history/AgentChangeHistory';
import type { ActionId } from './actions/ActionTypes';
import {
  editableItemOf,
  inverseOf,
  type ActionInverse,
  type EditableItem,
} from './actions/history/actionInverses';
import { undoAgentChange } from './actions/history/undoAgentChange';
import { createPropChallengeActions } from './actions/domains/propChallengeActions';
import { availableAccountTypes } from './propChallenge/stageAccountTypes';
import { rewriteAccountReferenceNotes } from './account/accountRename';
import { findServerImportAccountsForLocalAccount } from './tradeImport/tradeImportServerDeletion';
import { persistSessionLogTags } from './sessionLog/sessionLogTagCatalog';
import { TradeCreateAction } from './actions/domains/tradeCreateAction';
import type { ActionDefinitions } from './actions/ActionTypes';
import { createTradeLifecycleActions } from './actions/domains/tradeLifecycleActions';
import { resolveInstrumentContractDefaults } from './trade/instrumentContractDefaults';
import {
  ReviewCreateAction,
  ReviewUpdateAction,
} from './actions/domains/reviewContentActions';
import { createInspectJournalHandler } from './agent/handlers/inspectJournal';
import { createQueryTradesHandler } from './agent/handlers/queryTrades';
import type { PropChallengeSource } from './agent/configuration/propChallengeConfiguration';
import { getCurrentPropChallengePhase } from './propChallenge/PropChallengeConfig';
import { evaluatePropChallengePhase } from './propChallenge/PropChallengeRuleEngine';
import {
  readAccountSources,
  type AccountSources,
} from './agent/configuration/accountConfigurationSources';
import { AgentTradeReadService } from './agent/trades';
import { AgentAnalyticsReadService } from './agent/analytics';
import {
  AgentReviewReadService,
  AgentReviewWriteService,
  getAgentReviewQuestionLabels,
  type AgentReviewIdentity,
} from './agent/reviews';
import { createEvaluateTradesHandler } from './agent/handlers/evaluateTrades';
import { createAnalyzeBehaviorHandler } from './agent/handlers/analyzeBehavior';
import { createGetPremarketBriefHandler } from './agent/handlers/getPremarketBrief';
import { readActiveChallengeProgress } from './agent/analytics/premarketChallenges';
import { createGetTradeHandler } from './agent/handlers/getTrade';
import { createGetReviewHandler } from './agent/handlers/getReview';
import { createViewImageHandler } from './agent/handlers/viewImage';
import {
  reviewImageSources,
  type AgentMediaOwner,
} from './agent/media/agentOwnerMedia';
import { createImageAnnotationActions } from './actions/domains/imageAnnotationActions';
import { createNavigateJournalitHandler } from './agent/handlers/navigateJournalit';
import { createRunIntegrationHandler } from './agent/handlers/runIntegration';
import { createApplyChangesHandler } from './agent/handlers/applyChanges';
import { createInspectConfigurationHandler } from './agent/handlers/inspectConfiguration';
import { WIDGET_REGISTRY } from '../data/widgetRegistry';
import { AVAILABLE_METRICS } from '../components/dashboard/components/TopSection/types';
import { AVAILABLE_WIDGETS } from '../components/dashboard/components/BottomSection/types';
import { AVAILABLE_HOME_WIDGETS } from '../components/home/homeTypes';
import { ReviewTemplateService } from './templates/ReviewTemplateService';
import {
  DashboardLayoutPlanner,
  HomeLayoutPlanner,
  ReviewTemplatePlanner,
  SessionWorkflowPlanner,
  SettingsPlanner,
} from './agent/configuration';
import { SETTINGS_OWNED_PATHS } from './agent/configuration/settingsConfiguration';
import { PositionSizeCalculatorModal } from '../components/modals/PositionSizeCalculatorModal';
import {
  applySettingsControlValue,
  deleteSettingsPath,
  publishSettingsControlChange,
  readSettingsPath,
  setSettingsPath,
} from '../settings/settingsControlWrites';
import { scanNoteRewritePlan } from './agent/configuration/noteRewritePlan';
import { OptionCatalogPlanner } from './agent/configuration/OptionCatalogPlanner';
import type {
  OptionCatalogChange,
  OptionChangeSummary,
} from './agent/configuration/optionChangeTypes';
import { createOptionActions } from './actions/domains/optionActions';
import { createConfigurationActions } from './actions/domains/configurationActions';
import { createSetupActions } from './actions/domains/setupActions';
import { SetupLinkCodec, setupRevision } from './agent/setups/setupLinks';
import { lazyAction } from './actions/lazyAction';
import { hasStoredCustomFieldValue } from '../utils/customFieldPersistence';
import { DEFAULT_SESSION_LOG_ALERT_RULE } from '../types/sessionLog';
import { publishNoteRewriteCommitted } from './agent/configuration/noteRewriteEvents';
import {
  canonicalizeConfigurationValue,
  isRecord,
} from './agent/configuration/configurationPrimitives';
import { AgentNavigationService } from './agent/navigation';
import { AgentIntegrationService } from './agent/integrations';
import { TradovateBrokerSyncClient } from './tradeSync/TradovateBrokerSyncClient';
import { ImageGalleryService } from './imageGallery/ImageGalleryService';
import {
  readCurrentFrontmatter,
  readFrontmatterFromDisk,
} from '../utils/dataRefresh';
import { eventBus, type Unsubscribe } from './events';
import { resolveVaultMediaFile } from '../utils/imageMediaUtils';
import {
  AgentInstallationRegistrationClient,
  AgentAccessSessionService,
} from './agent/registration';
import {
  AgentRelaySessionService,
  AgentRelayTicketClient,
} from './agent/relay';

function configurationValuesEqual(left: unknown, right: unknown): boolean {
  return (
    JSON.stringify(canonicalizeConfigurationValue(left)) ===
    JSON.stringify(canonicalizeConfigurationValue(right))
  );
}

function withoutConfigurationEntries<T>(
  source: Record<string, T> | undefined,
  ids: readonly string[]
): Record<string, T> | undefined {
  if (ids.length === 0 || source === undefined || !isRecord(source))
    return source;
  const next = { ...source };
  for (const id of ids) delete next[id];
  return next;
}


interface LazyServices {
  setupService: SetupService;
  drcService: DRCService;
  weeklyReviewService: WeeklyReviewService;
  missedTradeService: MissedTradeService;
  backtestTradeService: BacktestTradeService;
  monthlyReviewService: MonthlyReviewService;
  quarterlyReviewService: QuarterlyReviewService;
  yearlyReviewService: YearlyReviewService;
  accountPageService: AccountPageService;
  backendIntegrationService: BackendIntegrationService;
  onboardingService: OnboardingService;
  propFirmProfileCatalogService: PropFirmProfileCatalogService;
  economicCalendarService: EconomicCalendarService;
  agentEntityIdentityService: AgentEntityIdentityService;
  agentTradeIdentityService: AgentTradeIdentityService;
  agentTradeReadService: AgentTradeReadService;
  agentAnalyticsReadService: AgentAnalyticsReadService;
  agentReviewReadService: AgentReviewReadService;
  actionBatchService: ActionBatchService;
  agentNavigationService: AgentNavigationService;
  agentAccessSessionService: AgentAccessSessionService;
  agentRelaySessionService: AgentRelaySessionService;
}

type LazyServiceKey = keyof LazyServices;

type ServiceInitQueue = {
  [Key in LazyServiceKey]?: Promise<LazyServices[Key]>;
};


class ServiceInitializationCancelledError extends Error {}


export function isServiceCleanupCancellation(error: unknown): boolean {
  return error instanceof ServiceInitializationCancelledError;
}

function cancelledInitialization(
  label: string
): ServiceInitializationCancelledError {
  return new ServiceInitializationCancelledError(
    `${label} initialization was cancelled by service cleanup.`
  );
}

const REVIEW_PERIOD_SERVICE = 'Review period service';
const AGENT_RELAY_SESSION = 'Agent relay session';
const AGENT_TRADE_READ = 'Agent trade read';
const AGENT_ANALYTICS_READ = 'Agent analytics read';
const ACTION_BATCH = 'Action batch';

export class ServiceManager {
  private static instance: ServiceManager | null = null;
  
  private closed = false;
  
  private agentRelayAdmissionClosed = false;
  private agentRelaySessionShutdown: Promise<void> = Promise.resolve();
  private recoveringAgentAccessSession: AgentAccessSessionService | null = null;

  private app: App;
  private plugin: JournalitPlugin;

  
  private _tradeService: TradeService | null = null;
  private _folderPathService: FolderPathService | null = null;
  private _imageGalleryVaultWatcher: ImageGalleryVaultWatcher | null = null;

  
  private _optionsService: CustomOptionsService | null = null;
  private agentRequestsModal: AgentRequestsModal | null = null;
  private agentChangeHistory: AgentChangeHistory | null = null;
  private _customFieldsService: CustomFieldsService | null = null;
  private _customReviewFieldsService: CustomReviewFieldsService | null = null;
  private _reviewContextInheritanceService: ReviewContextInheritanceService | null =
    null;
  
  private _reviewStreakService: ReviewStreakService | null = null;
  private _agentApprovalCard: AgentApprovalCardController | null = null;
  private _agentIntegrationService: AgentIntegrationService | null = null;
  private _agentTradeReadImageGalleryService: ImageGalleryService | null = null;
  private _agentImageAnnotationService: ImageGalleryService | null = null;
  private agentTradeReadImageGalleryUnsubscribeFns: Unsubscribe[] = [];
  private _agentToolRegistry: AgentToolRegistry | null = null;
  private _agentResultCache: AgentResultCache | null = null;
  private _sessionWorkflowPlanner: SessionWorkflowPlanner | null = null;
  private _reviewTemplatePlanner: ReviewTemplatePlanner | null = null;
  private _dashboardLayoutPlanner: DashboardLayoutPlanner | null = null;
  private _homeLayoutPlanner: HomeLayoutPlanner | null = null;
  private _settingsPlanner: SettingsPlanner | null = null;

  
  private initializedServices: Set<string> = new Set();

  
  private serviceInitQueue: ServiceInitQueue = {};

  
  private lazyServices: Partial<LazyServices> = {};

  
  private lazyService<Key extends LazyServiceKey>(
    key: Key,
    label: string,
    create: (isOpen: () => boolean) => Promise<LazyServices[Key]>,
    discard?: (service: LazyServices[Key]) => unknown,
    isOpen: () => boolean = () => !this.closed
  ): Promise<LazyServices[Key]> {
    const existing = this.lazyServices[key];
    if (existing) return Promise.resolve(existing);
    if (!isOpen()) return Promise.reject(cancelledInitialization(label));
    
    const queue = (): { [K in Key]?: Promise<LazyServices[K]> } =>
      this.serviceInitQueue;
    const pending = queue()[key];
    if (pending) return pending;

    const initPromise: Promise<LazyServices[Key]> = (async () => {
      const service = await create(isOpen);
      if (!isOpen()) {
        try {
          await discard?.(service);
        } catch (error) {
          
          console.warn(`${label} discard after cleanup failed`, error);
        }
        throw cancelledInitialization(label);
      }
      this.lazyServices[key] = service;
      this.initializedServices.add(key);
      return service;
    })();

    queue()[key] = initPromise;
    const settle = () => {
      delete queue()[key];
    };
    initPromise.then(settle, settle);
    return initPromise;
  }

  private constructor(app: App, plugin: JournalitPlugin) {
    this.app = app;
    this.plugin = plugin;
  }

  
  public static getInstance(app: App, plugin: JournalitPlugin): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager(app, plugin);
    }
    return ServiceManager.instance;
  }

  
  public async getServiceByName<K extends ServiceName>(
    serviceName: K
  ): Promise<ServiceRegistry[K]>;
  public async getServiceByName(
    serviceName: ServiceName
  ): Promise<ServiceRegistry[ServiceName]> {
    switch (serviceName) {
      case 'tradeService':
        return this.getTradeService();
      case 'setupService':
        return await this.getSetupService();
      case 'drcService':
        return await this.getDRCService();
      case 'weeklyReviewService':
        return await this.getWeeklyReviewService();
      case 'monthlyReviewService':
        return await this.getMonthlyReviewService();
      case 'quarterlyReviewService':
        return await this.getQuarterlyReviewService();
      case 'yearlyReviewService':
        return await this.getYearlyReviewService();
      case 'optionsService':
        return await this.getOptionsService();
      case 'customFieldsService':
        return this.getCustomFieldsService();
      case 'customReviewFieldsService':
        return this.getCustomReviewFieldsService();
      case 'reviewContextInheritanceService':
        return this.getReviewContextInheritanceService();
      case 'missedTradeService':
        return await this.getMissedTradeService();
      case 'backtestTradeService':
        return await this.getBacktestTradeService();
      case 'accountPageService':
        return await this.getAccountPageService();
      case 'backendIntegrationService':
        return await this.getBackendIntegrationService();
      case 'onboardingService':
        return await this.getOnboardingService();
      case 'folderPathService':
        return this.getFolderPathService();
      case 'propFirmProfileCatalogService':
        return await this.getPropFirmProfileCatalogService();
      case 'reviewStreakService':
        return this.getReviewStreakService();
      case 'economicCalendarService':
        return await this.getEconomicCalendarService();
      case 'agentEntityIdentityService':
        return await this.getAgentEntityIdentityService();
      case 'agentTradeIdentityService':
        return await this.getAgentTradeIdentityService();
      case 'agentTradeReadService':
        return await this.getAgentTradeReadService();
      case 'agentAnalyticsReadService':
        return await this.getAgentAnalyticsReadService();
      case 'agentReviewReadService':
        return await this.getAgentReviewReadService();
      case 'actionBatchService':
        return await this.getActionBatchService();
      case 'agentNavigationService':
        return await this.getAgentNavigationService();
      case 'agentIntegrationService':
        return this.getAgentIntegrationService();
      case 'agentToolRegistry':
        return this.getAgentToolRegistry();
      case 'agentResultCache':
        return this.getAgentResultCache();
      case 'agentAccessSessionService':
        return await this.getAgentAccessSessionService();
      case 'agentRelaySessionService':
        return await this.getAgentRelaySessionService();
    }
  }

  
  public async initializeCoreServices(): Promise<void> {
    
    

    
    const folderPathService = this.getFolderPathService();
    if (!this._imageGalleryVaultWatcher) {
      this._imageGalleryVaultWatcher = new ImageGalleryVaultWatcher(
        this.plugin
      );
      this._imageGalleryVaultWatcher.register();
    }
    this._tradeService = new TradeService(this.app, folderPathService, {
      namespace: 'trade',
    });
    this._tradeService.setPlugin(this.plugin);
    this.initializedServices.add('tradeService');

    
    this._customFieldsService = new CustomFieldsService(this.plugin);
    this.initializedServices.add('customFieldsService');

    this._customReviewFieldsService = new CustomReviewFieldsService(
      this.plugin
    );
    this.initializedServices.add('customReviewFieldsService');

    this._reviewContextInheritanceService = new ReviewContextInheritanceService(
      this.plugin
    );
    this.initializedServices.add('reviewContextInheritanceService');

    
    const optionsService = new CustomOptionsService(this.plugin, {
      namespace: 'options',
    });
    this._optionsService = optionsService;
    this._tradeService.setTagAssignmentRunner((tags, operation, previousTags) =>
      optionsService.runWithTagAssignments(tags, operation, previousTags)
    );
    this.initializedServices.add('optionsService');
  }

  
  public async initializeRemainingServices(): Promise<void> {
    
    const initOperations = [
      () => this.warmUp(this.getSetupService()),
      () => this.warmUp(this.getDRCService()),
      () => this.warmUp(this.getWeeklyReviewService()),
      () => this.warmUp(this.getMonthlyReviewService()),
      () => this.warmUp(this.getQuarterlyReviewService()),
      () => this.warmUp(this.getAccountPageService()),
    ];

    
    
    
    await scheduleSequence(initOperations, 50);
  }

  
  public getTradeService(): TradeService {
    if (!this._tradeService) {
      if (this.closed) throw cancelledInitialization('Trade service');
      const folderPathService = this.getFolderPathService();
      this._tradeService = new TradeService(this.app, folderPathService, {
        namespace: 'trade',
      });
      this._tradeService.setPlugin(this.plugin);
      this.initializedServices.add('tradeService');
    }
    return this._tradeService;
  }

  
  private createLazyTradeActions(): Pick<
    ActionDefinitions,
    'trade.create' | 'trade.update' | 'trade.set_type' | 'trade.delete'
  > {
    let identities: Promise<
      readonly [AgentTradeIdentityService, AgentEntityIdentityService]
    > | null = null;
    const loadIdentities = () =>
      (identities ??= Promise.all([
        this.getAgentTradeIdentityService(),
        this.getAgentEntityIdentityService(),
      ] as const).catch((error: unknown) => {
        identities = null;
        throw error;
      }));
    const labels = {
      getAvailableTags: () =>
        this.getOptionsServiceSync().getOptions(OptionType.TAG),
      getAvailableMistakes: () =>
        this.getOptionsServiceSync().getOptions(OptionType.MISTAKE),
      calculateCommission: (
        input: Parameters<
          CustomOptionsService['calculateInstrumentCommission']
        >[0]
      ) => this.getOptionsServiceSync().calculateInstrumentCommission(input),
    };
    const lifecycle = async () => {
      const [tradeIdentityService, entityIdentityService] =
        await loadIdentities();
      return createTradeLifecycleActions({
        tradeIdentityService,
        entityIdentityService,
        tradeService: this.getTradeService(),
        writer: this.getTradeNoteWriter(),
      });
    };
    return {
      'trade.create': lazyAction(async () => {
        const [tradeIdentityService, entityIdentityService] =
          await loadIdentities();
        return new TradeCreateAction({
          tradeIdentityService,
          entityIdentityService,
          customFields: this.getCustomFieldsService(),
          writer: this.getTradeNoteWriter(),
          tradeService: this.getTradeService(),
          instruments: this.createTradeInstrumentCatalog(),
          ...labels,
        });
      }),
      'trade.update': lazyAction(async () => {
        const [tradeIdentityService, entityIdentityService] =
          await loadIdentities();
        return new TradeUpdateAction({
          tradeIdentityService,
          entityIdentityService,
          customFields: this.getCustomFieldsService(),
          tradeService: this.getTradeService(),
          writer: this.getTradeNoteWriter(),
          ...labels,
        });
      }),
      'trade.set_type': lazyAction(
        async () => (await lifecycle())['trade.set_type']
      ),
      'trade.delete': lazyAction(
        async () => (await lifecycle())['trade.delete']
      ),
    };
  }

  
  private createTradeInstrumentCatalog(): ConstructorParameters<
    typeof TradeCreateAction
  >[0]['instruments'] {
    const options = () => this.getOptionsServiceSync();
    return {
      has: (instrument, assetType) =>
        options().getInstrument(instrument, assetType) !== undefined,
      add: async (instrument, assetType) => {
        if (
          await options().addOption(
            OptionType.INSTRUMENT,
            instrument,
            assetType
          )
        ) {
          options().notifyOptionsChanged();
        }
      },
      contractDefaults: (instrument, assetType) =>
        resolveInstrumentContractDefaults(instrument, assetType, {
          specs: this.plugin.specService,
          catalog: options(),
        }),
    };
  }

  
  public getTradeNoteWriter(): TradeNoteWriter {
    return new TradeNoteWriter({
      app: this.app,
      tradeService: this.getTradeService(),
      getMissedTradeService: () => this.getMissedTradeService(),
      getBacktestTradeService: () => this.getBacktestTradeService(),
      plugin: this.plugin,
    });
  }

  public getFolderPathService(): FolderPathService {
    if (!this._folderPathService) {
      this._folderPathService = new FolderPathService(this.app, this.plugin);
      this.initializedServices.add('folderPathService');
    }
    return this._folderPathService;
  }

  
  public getReviewStreakService(): ReviewStreakService {
    if (!this._reviewStreakService) {
      this._reviewStreakService = new ReviewStreakService(this.plugin);
      this.initializedServices.add('reviewStreakService');
    }

    return this._reviewStreakService;
  }

  
  public getSetupService(): Promise<SetupService> {
    return this.lazyService(
      'setupService',
      'Setup service',
      async () => {
        const tradeService = this.getTradeService();
        const service = await lazyLoad(
          () =>
            new SetupService(this.app, tradeService, { namespace: 'setup' }),
          'SetupService'
        );
        service.setPlugin(this.plugin);
        return service;
      },
      (service) => this.cleanupDataService(service)
    );
  }

  
  public getDRCService(): Promise<DRCService> {
    return this.lazyService(
      'drcService',
      REVIEW_PERIOD_SERVICE,
      async () => {
        const folderPathService = this.getFolderPathService();
        return lazyLoad(
          () =>
            new DRCService(this.app, this.plugin, folderPathService, {
              namespace: 'drc',
            }),
          'DRCService'
        );
      },
      (service) => service.cleanup()
    );
  }

  
  public getWeeklyReviewService(): Promise<WeeklyReviewService> {
    return this.lazyService(
      'weeklyReviewService',
      REVIEW_PERIOD_SERVICE,
      async () => {
        const folderPathService = this.getFolderPathService();
        return lazyLoad(
          () =>
            new WeeklyReviewService(this.app, this.plugin, folderPathService),
          'WeeklyReviewService'
        );
      },
      (service) => service.cleanup()
    );
  }

  
  public getEconomicCalendarService(): Promise<EconomicCalendarService> {
    return this.lazyService(
      'economicCalendarService',
      'Economic calendar service',
      async () => {
        const weeklyReviewService = await this.getWeeklyReviewService();
        return lazyLoad(
          () => new EconomicCalendarService(this.plugin, weeklyReviewService),
          'EconomicCalendarService'
        );
      },
      (service) => service.cleanup()
    );
  }

  
  public getMissedTradeService(): Promise<MissedTradeService> {
    return this.lazyService(
      'missedTradeService',
      'Missed trade service',
      () =>
        lazyLoad(
          () =>
            new MissedTradeService(this.app, this.plugin, {
              namespace: 'missed-trade',
            }),
          'MissedTradeService'
        ),
      (service) => this.cleanupDataService(service)
    );
  }

  
  public getBacktestTradeService(): Promise<BacktestTradeService> {
    return this.lazyService(
      'backtestTradeService',
      'Backtest trade service',
      () =>
        lazyLoad(
          () =>
            new BacktestTradeService(this.app, this.plugin, {
              namespace: 'backtest-trade',
            }),
          'BacktestTradeService'
        ),
      (service) => this.cleanupDataService(service)
    );
  }

  
  public getMonthlyReviewService(): Promise<MonthlyReviewService> {
    return this.lazyService(
      'monthlyReviewService',
      REVIEW_PERIOD_SERVICE,
      async () => {
        const folderPathService = this.getFolderPathService();
        return lazyLoad(
          () =>
            new MonthlyReviewService(this.app, this.plugin, folderPathService, {
              namespace: 'monthly',
            }),
          'MonthlyReviewService'
        );
      },
      (service) => this.cleanupDataService(service)
    );
  }

  
  public getQuarterlyReviewService(): Promise<QuarterlyReviewService> {
    return this.lazyService(
      'quarterlyReviewService',
      REVIEW_PERIOD_SERVICE,
      async () => {
        const folderPathService = this.getFolderPathService();
        return lazyLoad(
          () =>
            new QuarterlyReviewService(
              this.app,
              this.plugin,
              folderPathService,
              {
                namespace: 'quarterly',
              }
            ),
          'QuarterlyReviewService'
        );
      },
      (service) => this.cleanupDataService(service)
    );
  }

  
  public getYearlyReviewService(): Promise<YearlyReviewService> {
    return this.lazyService(
      'yearlyReviewService',
      REVIEW_PERIOD_SERVICE,
      async () => {
        const folderPathService = this.getFolderPathService();
        return lazyLoad(
          () =>
            new YearlyReviewService(this.app, this.plugin, folderPathService, {
              namespace: 'yearly',
            }),
          'YearlyReviewService'
        );
      },
      (service) => this.cleanupDataService(service)
    );
  }

  
  public async getOptionsService(): Promise<CustomOptionsService> {
    return this.getOptionsServiceSync();
  }

  
  public getCustomFieldsService(): CustomFieldsService {
    if (!this._customFieldsService) {
      throw new Error(
        'CustomFieldsService not initialized. Make sure initializeCoreServices() was called.'
      );
    }
    return this._customFieldsService;
  }

  
  public getCustomReviewFieldsService(): CustomReviewFieldsService {
    if (!this._customReviewFieldsService) {
      throw new Error(
        'CustomReviewFieldsService not initialized. Make sure initializeCoreServices() was called.'
      );
    }
    return this._customReviewFieldsService;
  }

  
  public getReviewContextInheritanceService(): ReviewContextInheritanceService {
    if (!this._reviewContextInheritanceService) {
      throw new Error(
        'ReviewContextInheritanceService not initialized. Make sure initializeCoreServices() was called.'
      );
    }
    return this._reviewContextInheritanceService;
  }

  
  public getOptionsServiceSync(): CustomOptionsService {
    if (!this._optionsService) {
      throw new Error(
        'CustomOptionsService not initialized. Make sure initializeCoreServices() was called.'
      );
    }
    return this._optionsService;
  }

  public async activateFolderContext(
    context: JournalSettingsContext,
    sampleRoot?: string
  ): Promise<void> {
    this.getFolderPathService().activateContext(context, sampleRoot);
    await this.clearFolderScopedCaches();
  }

  public async clearFolderScopedCaches(): Promise<void> {
    const owned: unknown[] = [
      ...(Object.values(this) as unknown[]),
      ...Object.values(this.lazyServices),
    ];
    const services = new Set(
      owned.filter(
        (service): service is CustomDataService =>
          service instanceof CustomDataService
      )
    );
    await Promise.all(Array.from(services, (service) => service.clearCache()));
    await Promise.all(
      Array.from(services, async (service) => {
        try {
          await service.flushPersistentCache();
        } catch (error) {
          console.warn(
            `Failed to flush ${service.cacheNamespace} persistent cache:`,
            error
          );
        }
      })
    );
  }

  private async cleanupDataService(service: CustomDataService): Promise<void> {
    try {
      await service.cleanup();
    } catch (error) {
      console.error(
        `Error cleaning up ${service.cacheNamespace} data service:`,
        error
      );
    }
  }

  
  public isServiceInitialized(serviceName: string): boolean {
    return this.initializedServices.has(serviceName);
  }

  
  public isServiceInitializing(serviceName: string): boolean {
    return serviceName in this.serviceInitQueue;
  }

  

  
  public getAccountPageService(): Promise<AccountPageService> {
    return this.lazyService(
      'accountPageService',
      'Account page service',
      async () => {
        
        this.getTradeService();
        return lazyLoad(() => {
          const service = new AccountPageService(this.app);
          service.setPlugin(this.plugin);
          return service;
        }, 'AccountPageService');
      },
      async (service) => {
        await this.cleanupDataService(service);
        service.destroy();
      }
    );
  }

  public getAgentEntityIdentityService(): Promise<AgentEntityIdentityService> {
    return this.lazyService(
      'agentEntityIdentityService',
      'Agent entity identity',
      async () => {
        const [accountPageService, setupService] = await Promise.all([
          this.getAccountPageService(),
          this.getSetupService(),
        ]);
        return lazyLoad(
          () =>
            new AgentEntityIdentityService(
              this.plugin,
              accountPageService,
              setupService
            ),
          'AgentEntityIdentityService'
        );
      }
    );
  }

  
  public async getAgentAccessSessionService(): Promise<AgentAccessSessionService> {
    const existing = this.lazyServices.agentAccessSessionService;
    if (existing) {
      await existing.recoverRegistration();
      return existing;
    }

    return this.lazyService(
      'agentAccessSessionService',
      'Agent access session',
      async (isOpen) => {
        const service = await lazyLoad(
          () =>
            new AgentAccessSessionService(
              this.plugin,
              new AgentInstallationRegistrationClient(this.plugin)
            ),
          'AgentAccessSessionService'
        );
        
        if (!isOpen()) return service;
        
        
        this.recoveringAgentAccessSession = service;
        try {
          await service.recoverRegistration();
        } catch (error) {
          service.dispose();
          throw error;
        } finally {
          if (this.recoveringAgentAccessSession === service) {
            this.recoveringAgentAccessSession = null;
          }
        }
        return service;
      },
      (service) => service.dispose()
    );
  }

  public getAgentRelaySessionService(): Promise<AgentRelaySessionService> {
    return this.lazyService(
      'agentRelaySessionService',
      AGENT_RELAY_SESSION,
      () => {
        const registry = this.getAgentToolRegistry();
        return lazyLoad(
          () =>
            new AgentRelaySessionService(
              this.plugin,
              new AgentRelayTicketClient(this.plugin),
              registry
            ),
          'AgentRelaySessionService'
        );
      },
      
      (service) => service.dispose().catch(() => undefined),
      
      () => !this.agentRelayAdmissionClosed
    );
  }

  public getAgentTradeIdentityService(): Promise<AgentTradeIdentityService> {
    return this.lazyService(
      'agentTradeIdentityService',
      'Agent trade identity',
      async () => {
        const missedTradeService = await this.getMissedTradeService();
        return lazyLoad(
          () =>
            new AgentTradeIdentityService(
              this.app,
              missedTradeService,
              this.getFolderPathService()
            ),
          'AgentTradeIdentityService'
        );
      }
    );
  }

  
  public async readAgentPropChallengeSources(
    signal: AbortSignal
  ): Promise<PropChallengeSource[]> {
    const [accounts, accountPageService] = await Promise.all([
      this.readAgentAccountSources(signal),
      this.getAccountPageService(),
    ]);
    const tradingDayCutoffTime =
      this.plugin.settings.trade?.tradingDayCutoffTime;
    
    const sources = await Promise.all(
      accounts.sources.flatMap((account) => {
        const config = account.metadata?.propChallenge;
        if (!config) return [];
        return [
          accountPageService
            .getAccountPageData(account.name)
            .then((data): PropChallengeSource => {
              const phase = getCurrentPropChallengePhase(config);
              return {
                account,
                config,
                evaluation:
                  data && phase
                    ? evaluatePropChallengePhase({
                        phase,
                        config,
                        trades: data.trades,
                        transactions: data.account.transactions,
                        tradingDayCutoffTime,
                      })
                    : null,
              };
            }),
        ];
      })
    );
    if (signal.aborted) throw signal.reason;
    return sources;
  }

  
  public async readAgentAccountSources(
    signal: AbortSignal
  ): Promise<AccountSources> {
    const [accountPageService, identityService] = await Promise.all([
      this.getAccountPageService(),
      this.getAgentEntityIdentityService(),
    ]);
    return readAccountSources(
      {
        getAccountCatalog: () => accountPageService.getAccountCatalogOrThrow(),
        getAccountMetadata: () => this.plugin.settings.account?.accountMetadata,
        getAccountMapping: () =>
          this.plugin.settings.backendIntegration?.accountMapping,
        getOrCreateAccountId: (name) =>
          identityService.getOrCreateAccountId(name),
        listTradeAccountReferences: async (readSignal) => {
          const records = await (
            await this.getAgentTradeReadService()
          ).read(
            { filters: { trade_types: ['regular', 'missed', 'backtest'] } },
            readSignal
          );
          return records.map((record) => ({
            path: record.file.path,
            accountIds: record.accountIds,
          }));
        },
      },
      signal
    );
  }

  public getAgentTradeReadService(): Promise<AgentTradeReadService> {
    return this.lazyService(
      'agentTradeReadService',
      AGENT_TRADE_READ,
      async (isOpen) => {
        const [
          tradeIdentityService,
          entityIdentityService,
          setupService,
          drcService,
        ] = await Promise.all([
          this.getAgentTradeIdentityService(),
          this.getAgentEntityIdentityService(),
          this.getSetupService(),
          this.getDRCService(),
        ]);
        
        
        if (!isOpen()) throw cancelledInitialization(AGENT_TRADE_READ);
        const tradeService = this.getTradeService();
        const customFieldsService = this.getCustomFieldsService();
        const service = await lazyLoad(
          () =>
            new AgentTradeReadService({
              plugin: this.plugin,
              tradeIdentityService,
              tradeService,
              entityIdentityService,
              setupService,
              drcService,
              customFieldsService,
              getImageGalleryService: () => {
                if (!this._agentTradeReadImageGalleryService) {
                  throw new Error('Agent trade image gallery is unavailable.');
                }
                return this._agentTradeReadImageGalleryService;
              },
              readFrontmatter: (file) => readCurrentFrontmatter(this.app, file),
            }),
          'AgentTradeReadService'
        );

        
        if (!isOpen()) throw cancelledInitialization(AGENT_TRADE_READ);
        const imageGalleryService = new ImageGalleryService(this.plugin);
        const invalidateImageGallery = () =>
          imageGalleryService.invalidateInMemoryCache();
        this._agentTradeReadImageGalleryService = imageGalleryService;
        this.agentTradeReadImageGalleryUnsubscribeFns = [
          eventBus.subscribe('trade:committed', invalidateImageGallery),
          eventBus.subscribe('trade-data:changed', invalidateImageGallery),
          eventBus.subscribe('missed-trade:changed', invalidateImageGallery),
          eventBus.subscribe(
            'missed-trade-data:changed',
            invalidateImageGallery
          ),
          eventBus.subscribe('backtest-trade:changed', invalidateImageGallery),
          eventBus.subscribe('review:changed', invalidateImageGallery),
          eventBus.subscribe('settings:changed', (payload) => {
            if (payload.source !== 'gallery-folders-service') {
              invalidateImageGallery();
            }
          }),
          eventBus.subscribe('options:changed', invalidateImageGallery),
          eventBus.subscribe('account:changed', invalidateImageGallery),
          eventBus.subscribe('folder-path:changed', invalidateImageGallery),
          eventBus.subscribe('image-gallery:changed', invalidateImageGallery),
        ];
        return service;
      }
    );
  }

  public getAgentAnalyticsReadService(): Promise<AgentAnalyticsReadService> {
    return this.lazyService(
      'agentAnalyticsReadService',
      AGENT_ANALYTICS_READ,
      async (isOpen) => {
        const identityService = await this.getAgentEntityIdentityService();
        
        if (!isOpen()) throw cancelledInitialization(AGENT_ANALYTICS_READ);
        const tradeService = this.getTradeService();
        return lazyLoad(
          () =>
            new AgentAnalyticsReadService({
              app: this.app,
              plugin: this.plugin,
              tradeService,
              getTradeReadService: () => this.getAgentTradeReadService(),
              identityService,
            }),
          'AgentAnalyticsReadService'
        );
      }
    );
  }

  public getAgentReviewReadService(): Promise<AgentReviewReadService> {
    return this.lazyService('agentReviewReadService', 'Agent review read', () =>
      lazyLoad(
        () =>
          new AgentReviewReadService({
            app: this.app,
            plugin: this.plugin,
            folderPathService: this.getFolderPathService(),
            resolveDayPath: async (date) =>
              (await this.getDRCService()).getDRCNotePath(date),
            resolveWeeklyPath: async (date) =>
              (await this.getWeeklyReviewService()).getWeeklyReviewPath(date),
            resolveMonthlyPath: async (date) =>
              (await this.getMonthlyReviewService()).getMonthlyReviewPath(date),
            resolveQuarterlyPath: async (date) =>
              (await this.getQuarterlyReviewService()).getQuarterlyReviewPath(
                date
              ),
            resolveYearlyPath: async (date) =>
              (await this.getYearlyReviewService()).getYearlyReviewPath(date),
            readFrontmatter: (file) => readCurrentFrontmatter(this.app, file),
          }),
        'AgentReviewReadService'
      )
    );
  }

  
  private async getNavigationReviewTemplateService(): Promise<ReviewTemplateService> {
    return new ReviewTemplateService(this.plugin);
  }

  public getAgentNavigationService(): Promise<AgentNavigationService> {
    return this.lazyService('agentNavigationService', 'Agent navigation', () =>
      lazyLoad(
        () =>
          new AgentNavigationService({
            plugin: this.plugin,
            navigationManager: this.plugin.navigationManager,
            getTradeIdentityService: () => this.getAgentTradeIdentityService(),
            getEntityIdentityService: () =>
              this.getAgentEntityIdentityService(),
            getReviewReadService: () => this.getAgentReviewReadService(),
            getReviewTemplateService: () =>
              this.getNavigationReviewTemplateService(),
            customFieldsService: this.getCustomFieldsService(),
            openAgentActivity: () => this.openAgentActivity(),
            openPositionSizeCalculator: () =>
              new PositionSizeCalculatorModal(this.app, this.plugin).open(),
          }),
        'AgentNavigationService'
      )
    );
  }

  public getAgentToolRegistry(): AgentToolRegistry {
    if (!this._agentToolRegistry) {
      const registry = new AgentToolRegistry();
      registry.register({
        tool: 'apply_changes',
        handler: createApplyChangesHandler({
          getBatchService: () => this.getActionBatchService(),
        }),
      });
      registry.register({
        tool: 'inspect_journal',
        handler: createInspectJournalHandler({
          registry,
          pluginVersion: () => this.plugin.manifest.version,
          calculationSettings: () => ({
            currency: this.plugin.settings.general?.currency,
            ...this.plugin.settings.trade,
          }),
          getTradeData: () =>
            this.getTradeService().getTradeData({ fresh: true }),
          getAccountCatalog: async () =>
            (await this.getAccountPageService()).getAccountCatalogOrThrow(),
          getOrCreateAccountId: async (name) =>
            (await this.getAgentEntityIdentityService()).getOrCreateAccountId(
              name
            ),
          listSetups: async () =>
            (await this.getSetupService()).listSetupsForAgentIdentityStrict(),
          ensureSetupId: async (name) =>
            (await this.getSetupService()).ensureAgentEntityId(name),
          getOptions: (type: OptionType.TAG | OptionType.MISTAKE) =>
            this.getOptionsServiceSync().getOptions(type),
          readSessionMode: async () => {
            const state = await resolveCurrentSessionModePhase(this.plugin);
            const running = getRunningUnplannedSession(state);
            return {
              phase: state.phase,
              canStartUnplanned: canStartUnplannedSession(state),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              ...(running
                ? {
                    runningUnplanned: {
                      id: running.id,
                      startedAt: running.start,
                    },
                  }
                : {}),
            };
          },
        }),
      });
      registry.register({
        tool: 'inspect_configuration',
        handler: createInspectConfigurationHandler({
          getSessionModeSettings: () => this.plugin.settings.sessionMode,
          getReviewTemplateSettings: () => ({
            templates: this.plugin.settings.reviewV2?.templates,
            defaultDrc: this.plugin.settings.templates?.defaultDrc,
            defaultWeekly: this.plugin.settings.templates?.defaultWeekly,
            defaultMonthly: this.plugin.settings.templates?.defaultMonthly,
            defaultQuarterly: this.plugin.settings.templates?.defaultQuarterly,
            defaultYearly: this.plugin.settings.templates?.defaultYearly,
          }),
          getBuiltInReviewTemplates: () =>
            ReviewTemplateService.getBuiltInTemplateSnapshot(),
          getReviewWidgetCatalog: () => WIDGET_REGISTRY,
          getDashboardLayoutSettings: () => ({
            layouts: this.plugin.settings.dashboard?.layouts,
            activeLayout: this.plugin.settings.dashboard?.activeLayout,
          }),
          getDashboardMetricCatalog: () => AVAILABLE_METRICS,
          getDashboardWidgetCatalog: () => AVAILABLE_WIDGETS,
          getHomeLayoutSettings: () => ({
            layouts: this.plugin.settings.home?.layouts,
            activeLayout: this.plugin.settings.home?.activeLayout,
            embeddedNotes: this.plugin.settings.home?.embeddedNotes,
            goals: this.plugin.settings.home?.goals,
            topBreakdowns: this.plugin.settings.home?.topBreakdowns,
          }),
          getHomeWidgetCatalog: () => AVAILABLE_HOME_WIDGETS,
          getRawOptionSettings: () =>
            this.plugin.settings.customOptions_options,
          getRawAccountSettings: () => this.plugin.settings.account,
          listSetups: async () =>
            (await this.getSetupService()).listSetupsForAgentIdentityStrict(),
          readSetupDefinitions: async () =>
            (await this.getSetupService()).readExistingSetupDefinitionsStrict(),
          describeSetup: async (setup, signal) => ({
            revision: await setupRevision(setup),
            linkedNotes: await this.createSetupLinkCodec().describe(
              setup,
              signal
            ),
          }),
          ensureSetupIds: async (names) =>
            (await this.getSetupService()).ensureAgentEntityIds(names),
          getAccountCatalog: async () =>
            (await this.getAccountPageService()).getAccountCatalogOrThrow(),
          getSettingsConfiguration: () =>
            readOwnedSettings(this.plugin.settings),
          getCustomFields: () => this.getCustomFieldsService().getFields(),
          getCustomFieldCreatedOptions: (fieldId) =>
            this.getCustomFieldsService().getFieldOptions(fieldId),
          getSessionLogTags: () => this.plugin.settings.drc.sessionLogTags,
          getSessionLogAlertRuleTagId: () =>
            (
              this.plugin.settings.drc.sessionLogAlertRule ??
              DEFAULT_SESSION_LOG_ALERT_RULE
            ).tagId,
          readAccountSources: (signal) => this.readAgentAccountSources(signal),
          readPropChallengeSources: (signal) =>
            this.readAgentPropChallengeSources(signal),
        }),
      });
      registry.register({
        tool: 'query_trades',
        handler: createQueryTradesHandler({
          getReadService: () => this.getAgentTradeReadService(),
          cache: this.getAgentResultCache(),
        }),
      });
      registry.register({
        tool: 'evaluate_trades',
        handler: createEvaluateTradesHandler({
          getReadService: () => this.getAgentAnalyticsReadService(),
          cache: this.getAgentResultCache(),
        }),
      });
      registry.register({
        tool: 'analyze_behavior',
        handler: createAnalyzeBehaviorHandler({
          getReadService: () => this.getAgentAnalyticsReadService(),
        }),
      });
      registry.register({
        tool: 'get_premarket_brief',
        handler: createGetPremarketBriefHandler({
          getAnalyticsReadService: () => this.getAgentAnalyticsReadService(),
          getReviewReadService: () => this.getAgentReviewReadService(),
          getIdentityService: () => this.getAgentEntityIdentityService(),
          readChallengeProgress: async (signal) =>
            readActiveChallengeProgress(
              await this.getAccountPageService(),
              this.plugin.settings.trade?.tradingDayCutoffTime,
              signal
            ),
          getSettings: () => this.plugin.settings,
          skipsWeekends: () => isWeekendSkippingEnabled(this.plugin),
          now: () => new Date(),
        }),
      });
      registry.register({
        tool: 'get_trade',
        handler: createGetTradeHandler({
          getReadService: () => this.getAgentTradeReadService(),
          cache: this.getAgentResultCache(),
          readContent: (file) => this.getTradeService().readTradeContent(file),
          resolveMediaFile: (pathOrLink, sourcePath) =>
            resolveVaultMediaFile(this.app, pathOrLink, sourcePath),
          readImageAnnotation: (sourcePath, source) =>
            this.getAgentImageAnnotationService().getEffectiveImageAnnotationSync(
              sourcePath,
              source
            ),
        }),
      });
      registry.register({
        tool: 'get_review',
        handler: createGetReviewHandler({
          getReviewReadService: () => this.getAgentReviewReadService(),
          getAnalyticsReadService: () => this.getAgentAnalyticsReadService(),
          cache: this.getAgentResultCache(),
          readSessionLog: (file) =>
            readSessionLogEntries({ app: this.app }, file.path),
          readContent: (file) => this.app.vault.read(file),
          readFrontmatter: (file) => readCurrentFrontmatter(this.app, file),
          resolveMediaFile: (pathOrLink, sourcePath) =>
            resolveVaultMediaFile(this.app, pathOrLink, sourcePath),
          readImageAnnotation: (sourcePath, source) =>
            this.getAgentImageAnnotationService().getEffectiveImageAnnotationSync(
              sourcePath,
              source
            ),
          getCustomFields: () => this.getCustomFieldsService().getFields(),
          getSetupIds: async (names) =>
            (await this.getAgentEntityIdentityService()).getOrCreateSetupIds(
              names
            ),
        }),
      });
      registry.register({
        tool: 'navigate_journalit',
        handler: createNavigateJournalitHandler({
          getNavigationService: () => this.getAgentNavigationService(),
        }),
      });
      registry.register({
        tool: 'run_integration',
        handler: createRunIntegrationHandler({
          getIntegrationService: () => this.getAgentIntegrationService(),
        }),
      });
      registry.register({
        tool: 'view_image',
        handler: createViewImageHandler({
          tradeMedia: (tradeId, signal) =>
            this.readAgentTradeMediaOwner(tradeId, signal),
          reviewMedia: (review, signal) =>
            this.readAgentReviewMediaOwner(review, signal),
          resolveMediaFile: (pathOrLink, sourcePath) =>
            resolveVaultMediaFile(this.app, pathOrLink, sourcePath),
          readBinary: (file) => this.app.vault.readBinary(file),
        }),
      });
      this._agentToolRegistry = registry;
      this.initializedServices.add('agentToolRegistry');
    }
    return this._agentToolRegistry;
  }

  public getAgentIntegrationService(): AgentIntegrationService {
    if (!this._agentIntegrationService) {
      const backend = new TradovateBrokerSyncClient();
      this._agentIntegrationService = new AgentIntegrationService({
        getAuthToken: () => BackendSecretStorage.getAuthToken(this.plugin),
        isOnline: () => navigator.onLine !== false,
        getTradovateConnections: () =>
          backend.getTradovateConnections({ interactiveEntitlement: false }),
        syncConnection: (connectionId) =>
          this.plugin
            .ensureTradeProjectionSyncService()
            .syncConnection(connectionId),
        openImportWorkflow: () => this.plugin.viewManager.openCSVImportView(),
        importEconomicCalendarWeek: async (weekDate) => {
          const imported = await (
            await this.getEconomicCalendarService()
          ).importConfiguredEventsForWeek(weekDate);
          return imported.status === 'ok'
            ? {
                status: 'ok',
                weekStart: imported.weekStart,
                importedCount: imported.importedCount,
                updatedCount: imported.updatedCount,
                skippedCount: imported.skippedCount,
              }
            : { status: imported.status };
        },
      });
      this.initializedServices.add('agentIntegrationService');
    }
    return this._agentIntegrationService;
  }

  
  private async readAgentTradeMediaOwner(
    tradeId: string,
    signal: AbortSignal
  ): Promise<AgentMediaOwner | null> {
    const record = await (
      await this.getAgentTradeReadService()
    ).readByTradeId(tradeId, signal);
    return record ? { file: record.file, sources: record.mediaPaths } : null;
  }

  
  private async readAgentReviewMediaOwner(
    review: AgentReviewIdentity,
    signal: AbortSignal
  ): Promise<AgentMediaOwner | null> {
    const file = await (
      await this.getAgentReviewReadService()
    ).resolveFile(review, signal);
    if (!file) return null;
    const [content, frontmatter] = await Promise.all([
      this.app.vault.read(file),
      readCurrentFrontmatter(this.app, file),
    ]);
    return { file, sources: reviewImageSources(content, frontmatter) };
  }

  
  private getAgentImageAnnotationService(): ImageGalleryService {
    this._agentImageAnnotationService ??= new ImageGalleryService(this.plugin);
    return this._agentImageAnnotationService;
  }

  public getAgentResultCache(): AgentResultCache {
    if (!this._agentResultCache) {
      this._agentResultCache = new AgentResultCache();
      this.initializedServices.add('agentResultCache');
    }
    return this._agentResultCache;
  }

  private getSessionWorkflowPlanner(): SessionWorkflowPlanner {
    if (!this._sessionWorkflowPlanner) {
      this._sessionWorkflowPlanner = new SessionWorkflowPlanner({
        getSettings: () => this.plugin.settings.sessionMode,
        saveSettings: async (settings) => {
          const previous = this.plugin.settings.sessionMode;
          const merged = {
            ...previous,
            tradeGateQuestions: settings.tradeGateQuestions,
            tradeGateWorkflows: settings.tradeGateWorkflows,
          };
          this.plugin.settings.sessionMode = merged;
          try {
            await this.plugin.saveSettings();
          } catch (error) {
            if (this.plugin.settings.sessionMode === merged) {
              this.plugin.settings.sessionMode = previous;
            }
            throw error;
          }
          eventBus.publish('settings:changed', {
            section: 'sessionMode',
            source: 'agent',
          });
        },
      });
      this.initializedServices.add('sessionWorkflowPlanner');
    }
    return this._sessionWorkflowPlanner;
  }

  private getReviewTemplatePlanner(): ReviewTemplatePlanner {
    if (!this._reviewTemplatePlanner) {
      this._reviewTemplatePlanner = new ReviewTemplatePlanner({
        getSettings: () => ({
          templates: this.plugin.settings.reviewV2?.templates,
          defaultDrc: this.plugin.settings.templates?.defaultDrc,
          defaultWeekly: this.plugin.settings.templates?.defaultWeekly,
          defaultMonthly: this.plugin.settings.templates?.defaultMonthly,
          defaultQuarterly: this.plugin.settings.templates?.defaultQuarterly,
          defaultYearly: this.plugin.settings.templates?.defaultYearly,
        }),
        getBuiltIns: () => ReviewTemplateService.getBuiltInTemplateSnapshot(),
        getCatalog: () => WIDGET_REGISTRY,
        saveSettings: async (settings) => {
          const previousReviewV2 = this.plugin.settings.reviewV2;
          const previousTemplates = this.plugin.settings.templates;
          if (!previousTemplates)
            throw new Error('Review template defaults are unavailable.');
          const mergedReviewV2 = {
            ...(previousReviewV2 ?? {
              customWidgetTypes: [],
              tradeTemplates: [],
            }),
          };
          
          
          const rawMergedReviewV2: { templates?: unknown } = mergedReviewV2;
          rawMergedReviewV2.templates = settings.templates;
          const mergedTemplates = {
            ...previousTemplates,
            defaultDrc:
              typeof settings.defaultDrc === 'string'
                ? settings.defaultDrc
                : previousTemplates.defaultDrc,
            defaultWeekly:
              typeof settings.defaultWeekly === 'string'
                ? settings.defaultWeekly
                : previousTemplates.defaultWeekly,
            defaultMonthly:
              typeof settings.defaultMonthly === 'string'
                ? settings.defaultMonthly
                : previousTemplates.defaultMonthly,
            defaultQuarterly:
              typeof settings.defaultQuarterly === 'string'
                ? settings.defaultQuarterly
                : previousTemplates.defaultQuarterly,
            defaultYearly:
              typeof settings.defaultYearly === 'string'
                ? settings.defaultYearly
                : previousTemplates.defaultYearly,
          };
          const templatesChanged =
            JSON.stringify(previousReviewV2?.templates) !==
            JSON.stringify(settings.templates);
          const defaultEntries = [
            ['drc', 'defaultDrc'],
            ['weekly', 'defaultWeekly'],
            ['monthly', 'defaultMonthly'],
            ['quarterly', 'defaultQuarterly'],
            ['yearly', 'defaultYearly'],
          ] as const;
          const changedDefaults = defaultEntries.filter(
            ([, key]) => previousTemplates[key] !== mergedTemplates[key]
          );
          this.plugin.settings.reviewV2 = mergedReviewV2;
          this.plugin.settings.templates = mergedTemplates;
          try {
            await this.plugin.saveSettings();
          } catch (error) {
            if (this.plugin.settings.reviewV2 === mergedReviewV2) {
              const currentRawReviewV2: { templates?: unknown } =
                this.plugin.settings.reviewV2;
              if (currentRawReviewV2.templates === settings.templates) {
                if (previousReviewV2?.templates === undefined)
                  delete currentRawReviewV2.templates;
                else currentRawReviewV2.templates = previousReviewV2.templates;
              }
            }
            if (this.plugin.settings.templates === mergedTemplates) {
              
              
              
              for (const [, key] of defaultEntries) {
                if (mergedTemplates[key] === settings[key])
                  mergedTemplates[key] = previousTemplates[key];
              }
            }
            throw error;
          }
          if (templatesChanged) eventBus.publish('review-template:changed');
          for (const [type, key] of changedDefaults) {
            const value = mergedTemplates[key];
            eventBus.publish('default-template:changed', {
              type,
              value: value === '' ? null : value,
            });
          }
          eventBus.publish('settings:changed', {
            section: 'reviews',
            source: 'agent',
          });
        },
      });
      this.initializedServices.add('reviewTemplatePlanner');
    }
    return this._reviewTemplatePlanner;
  }

  private getDashboardLayoutPlanner(): DashboardLayoutPlanner {
    if (!this._dashboardLayoutPlanner) {
      this._dashboardLayoutPlanner = new DashboardLayoutPlanner({
        getSettings: () => ({
          layouts: this.plugin.settings.dashboard?.layouts,
          activeLayout: this.plugin.settings.dashboard?.activeLayout,
        }),
        metrics: AVAILABLE_METRICS,
        dashboardWidgets: AVAILABLE_WIDGETS,
        saveSettings: async (command) => {
          const dashboard = this.plugin.settings.dashboard;
          if (!dashboard)
            throw new Error('Dashboard settings are unavailable.');
          const previousLayouts = dashboard.layouts;
          const previousActive = dashboard.activeLayout;
          const installedLayouts = structuredClone(command.layouts);
          if (!isRecord(installedLayouts))
            throw new Error('Dashboard layouts are invalid.');
          const installedActive = command.activeLayout;
          const layoutsSnapshot = structuredClone(installedLayouts);
          const rawDashboard: { layouts: unknown; activeLayout: unknown } =
            dashboard;
          rawDashboard.layouts = installedLayouts;
          if (installedActive !== undefined)
            rawDashboard.activeLayout = installedActive;
          try {
            await this.plugin.saveSettings();
          } catch (error) {
            
            
            if (configurationValuesEqual(dashboard.layouts, layoutsSnapshot))
              dashboard.layouts = previousLayouts;
            if (
              installedActive !== undefined &&
              dashboard.activeLayout === installedActive
            )
              dashboard.activeLayout = previousActive;
            throw error;
          }
          eventBus.publish('layout:changed', {
            view: 'dashboard',
            source: 'agent',
            layoutName: dashboard.activeLayout,
          });
          const activeLayout = dashboard.layouts[dashboard.activeLayout];
          eventBus.publish('metrics:changed', {
            activeMetrics: [...(activeLayout?.topSection ?? [])],
          });
          eventBus.publish('widgets:changed', {
            activeWidgets: [
              ...new Set(
                (activeLayout?.bottomSection.lg ?? []).map((item) => item.i)
              ),
            ],
          });
          eventBus.publish('settings:changed', {
            section: 'dashboard',
            source: 'agent',
          });
        },
      });
      this.initializedServices.add('dashboardLayoutPlanner');
    }
    return this._dashboardLayoutPlanner;
  }

  private getHomeLayoutPlanner(): HomeLayoutPlanner {
    if (!this._homeLayoutPlanner) {
      this._homeLayoutPlanner = new HomeLayoutPlanner({
        getSettings: () => ({
          layouts: this.plugin.settings.home?.layouts,
          activeLayout: this.plugin.settings.home?.activeLayout,
          embeddedNotes: this.plugin.settings.home?.embeddedNotes,
          goals: this.plugin.settings.home?.goals,
          topBreakdowns: this.plugin.settings.home?.topBreakdowns,
          streaks: this.plugin.settings.home?.streaks,
        }),
        homeWidgets: AVAILABLE_HOME_WIDGETS,
        saveSettings: async (command) => {
          const home = this.plugin.settings.home;
          if (!home) throw new Error('Home settings are unavailable.');
          const previousLayouts = home.layouts;
          const previousActive = home.activeLayout;
          const previousEmbeddedNotes = home.embeddedNotes;
          const previousGoals = home.goals;
          const previousTopBreakdowns = home.topBreakdowns;
          const previousStreaks = home.streaks;
          const installedLayouts = structuredClone(command.layouts);
          if (!isRecord(installedLayouts))
            throw new Error('Home layouts are invalid.');
          const installedActive = command.activeLayout;
          const removals = command.homeRemovals;
          const embeddedRemovals: string[] = [];
          const goalRemovals: string[] = [];
          const breakdownRemovals: string[] = [];
          const streakRemovals: string[] = [];
          for (const removal of removals) {
            switch (removal.type) {
              case 'embeddedNote':
                embeddedRemovals.push(removal.id);
                break;
              case 'goalsProgress':
                goalRemovals.push(removal.id);
                break;
              case 'setupLeaderboard':
                breakdownRemovals.push(removal.id);
                break;
              case 'currentStreak':
                streakRemovals.push(removal.id);
                break;
            }
          }
          const installedEmbeddedNotes = withoutConfigurationEntries(
            home.embeddedNotes,
            embeddedRemovals
          );
          const installedGoals = withoutConfigurationEntries(
            home.goals,
            goalRemovals
          );
          const installedTopBreakdowns = withoutConfigurationEntries(
            home.topBreakdowns,
            breakdownRemovals
          );
          const installedStreaks = withoutConfigurationEntries(
            home.streaks,
            streakRemovals
          );
          const layoutsSnapshot = structuredClone(installedLayouts);
          const embeddedSnapshot = structuredClone(installedEmbeddedNotes);
          const goalsSnapshot = structuredClone(installedGoals);
          const breakdownsSnapshot = structuredClone(installedTopBreakdowns);
          const streaksSnapshot = structuredClone(installedStreaks);
          const rawHome: { layouts: unknown; activeLayout: unknown } = home;
          rawHome.layouts = installedLayouts;
          if (installedActive !== undefined)
            rawHome.activeLayout = installedActive;
          if (embeddedRemovals.length > 0)
            home.embeddedNotes = installedEmbeddedNotes;
          if (goalRemovals.length > 0) home.goals = installedGoals;
          if (breakdownRemovals.length > 0)
            home.topBreakdowns = installedTopBreakdowns;
          if (streakRemovals.length > 0) home.streaks = installedStreaks;
          try {
            await this.plugin.saveSettings();
          } catch (error) {
            if (configurationValuesEqual(home.layouts, layoutsSnapshot))
              home.layouts = previousLayouts;
            if (
              installedActive !== undefined &&
              home.activeLayout === installedActive
            )
              home.activeLayout = previousActive;
            if (
              embeddedRemovals.length > 0 &&
              configurationValuesEqual(home.embeddedNotes, embeddedSnapshot)
            )
              home.embeddedNotes = previousEmbeddedNotes;
            if (
              goalRemovals.length > 0 &&
              configurationValuesEqual(home.goals, goalsSnapshot)
            )
              home.goals = previousGoals;
            if (
              breakdownRemovals.length > 0 &&
              configurationValuesEqual(home.topBreakdowns, breakdownsSnapshot)
            )
              home.topBreakdowns = previousTopBreakdowns;
            if (
              streakRemovals.length > 0 &&
              configurationValuesEqual(home.streaks, streaksSnapshot)
            )
              home.streaks = previousStreaks;
            throw error;
          }
          eventBus.publish('layout:changed', {
            view: 'home',
            source: 'agent',
            layoutName: home.activeLayout,
          });
          eventBus.publish('settings:changed', {
            section: 'home',
            source: 'agent',
          });
        },
      });
      this.initializedServices.add('homeLayoutPlanner');
    }
    return this._homeLayoutPlanner;
  }

  private publishNoteRewriteCommitted(
    plan: Parameters<typeof publishNoteRewriteCommitted>[0]
  ): void {
    publishNoteRewriteCommitted(plan, (payload) => {
      this.getOptionsServiceSync().notifyOptionsChanged(payload);
    });
  }

  private getSettingsPlanner(): SettingsPlanner {
    if (!this._settingsPlanner) {
      this._settingsPlanner = new SettingsPlanner({
        getSettings: () => readOwnedSettings(this.plugin.settings),
        saveSettings: async (changes) => {
          const settings = this.plugin.settings;
          const paths = Object.keys(changes);
          const previous = paths.map((path) => ({
            path,
            value: readSettingsPath(settings, path),
          }));
          
          for (const path of paths) {
            applySettingsControlValue(settings, path, changes[path]);
          }
          const installed = paths.map((path) =>
            readSettingsPath(settings, path)
          );
          try {
            await this.plugin.saveSettings();
          } catch (error) {
            
            if (this.plugin.settings === settings) {
              previous.forEach((prior, index) => {
                if (readSettingsPath(settings, prior.path) !== installed[index])
                  return;
                if (prior.value !== undefined)
                  setSettingsPath(settings, prior.path, prior.value);
                else deleteSettingsPath(settings, prior.path);
              });
            }
            throw error;
          }
          
          
          
          
          const published = new Set<string>();
          for (const path of paths) {
            await publishSettingsControlChange(this.plugin, path, published);
          }
        },
      });
      this.initializedServices.add('settingsPlanner');
    }
    return this._settingsPlanner;
  }

  
  private notifyOptionsCommitted(
    change: OptionCatalogChange,
    summary: OptionChangeSummary
  ): void {
    const optionsService = this.getOptionsServiceSync();
    switch (change.kind) {
      case 'create_tag':
        optionsService.notifyOptionsChanged({
          optionType: OptionType.TAG,
          action: 'created',
        });
        break;
      case 'create_mistake':
        optionsService.notifyOptionsChanged({
          optionType: OptionType.MISTAKE,
          action: 'created',
        });
        break;
      case 'create_account_type':
        optionsService.notifyOptionsChanged({
          optionType: OptionType.ACCOUNT_TYPE,
          action: 'created',
          accountType: change.value,
        });
        break;
      case 'create_event':
        optionsService.notifyOptionsChanged({
          optionType: OptionType.EVENT,
          action: 'created',
        });
        break;
      case 'set_tag_color':
      case 'clear_tag_color':
        optionsService.notifyOptionsChanged({
          optionType: OptionType.TAG,
          action: 'updated',
        });
        break;
      case 'update_event_style':
        optionsService.notifyOptionsChanged({
          optionType: OptionType.EVENT,
          action: 'updated',
        });
        break;
      case 'rename_tag':
      case 'merge_tags':
      case 'delete_tag':
      case 'rename_mistake':
      case 'merge_mistakes':
      case 'delete_mistake':
      case 'rename_event':
      case 'merge_events':
      case 'delete_event':
        break;
      case 'rename_account_type':
        optionsService.notifyOptionsChanged({
          optionType: OptionType.ACCOUNT_TYPE,
          action: 'updated',
        });
        if (
          summary.action === 'rename_account_type' &&
          summary.affected_account_count > 0
        ) {
          eventBus.publish('account:changed', {
            action: 'batch-updated',
          });
        }
        break;
      case 'move_account_type':
        optionsService.notifyOptionsChanged({
          optionType: OptionType.ACCOUNT_TYPE,
          action: 'updated',
        });
        break;
      case 'delete_account_type':
        optionsService.notifyOptionsChanged({
          optionType: OptionType.ACCOUNT_TYPE,
          action: 'deleted',
        });
        break;
      default: {
        const exhaustive: never = change;
        return exhaustive;
      }
    }
  }

  
  private createOptionCatalogPlanner(): OptionCatalogPlanner {
    return new OptionCatalogPlanner({
      getRawOptions: () => this.plugin.settings.customOptions_options,
      getRawAccountSettings: () => this.plugin.settings.account,
      getAuthoritativeAccounts: async () => {
        const accountPage = await this.getAccountPageService();
        return accountPage.getAccountCatalogOrThrow();
      },
      persist: (command) =>
        this.getOptionsServiceSync().persistAgentOptionsCommand(command),
      scanNoteRewrite: (change) =>
        scanNoteRewritePlan({
          app: this.app,
          settings: this.plugin.settings,
          change,
        }),
      onNoteRewriteCommitted: (plan) => {
        this.publishNoteRewriteCommitted(plan);
      },
      onCommitted: (change, summary) => {
        this.notifyOptionsCommitted(change, summary);
      },
    });
  }

  
  public getActionBatchServiceIfInitialized(): ActionBatchService | null {
    return this.lazyServices.actionBatchService ?? null;
  }

  
  public openAgentActivity(): void {
    
    if (this.agentRequestsModal) return;
    const modal = new AgentRequestsModal(
      this.app,
      this.lazyServices.actionBatchService ?? null,
      this.getAgentChangeHistory(),
      (batchId) => this.undoAgentChange(batchId),
      () => {
        if (this.agentRequestsModal === modal) this.agentRequestsModal = null;
      }
    );
    this.agentRequestsModal = modal;
    modal.open();
  }

  
  private createSetupLinkCodec(): SetupLinkCodec {
    return new SetupLinkCodec({
      app: this.app,
      listTradeFiles: async () =>
        (await this.getAgentTradeIdentityService()).listTradeIdentitiesStrict(),
      identifyReview: async (file, signal) =>
        (await this.getAgentReviewReadService()).identifyFile(file, signal),
      resolveReview: async (identity, signal) =>
        (await this.getAgentReviewReadService()).resolveFile(identity, signal),
      listSetups: async () =>
        (await this.getSetupService()).readExistingSetupDefinitionsStrict(),
    });
  }

  
  private createLazyKeyEventActions(): ReturnType<
    typeof createKeyEventActions
  > {
    let loaded: Promise<ReturnType<typeof createKeyEventActions>> | null = null;
    const load = () =>
      (loaded ??= this.getWeeklyReviewService().then(
        (weekly) =>
          createKeyEventActions({
            resolveWeekReview: async (review, signal) =>
              (await this.getAgentReviewReadService()).resolveFile(
                review,
                signal
              ),
            weekReviewPath: (weekStart) =>
              weekly.getWeeklyReviewPath(weekStart),
            readKeyEvents: (weekStart) =>
              weekly.getKeyEventsWriteStateForWeek(weekStart),
            updateKeyEvents: (weekStart, update) =>
              weekly.updateKeyEventsForWeek(weekStart, update),
          }),
        (error: unknown) => {
          loaded = null;
          throw error;
        }
      ));
    return {
      'review.add_key_events': lazyAction(
        async () => (await load())['review.add_key_events']
      ),
      'review.update_key_event': lazyAction(
        async () => (await load())['review.update_key_event']
      ),
      'review.delete_key_event': lazyAction(
        async () => (await load())['review.delete_key_event']
      ),
    };
  }

  
  private createLazyDayTradeFieldActions(): ReturnType<
    typeof createDayTradeFieldActions
  > {
    return {
      'review.set_day_trade_fields': lazyAction(async () => {
        const dayFields = this.plugin.dayTradeFieldsService;
        if (!dayFields) {
          throw new Error('Day trade fields are not available yet.');
        }
        const customFields = this.getCustomFieldsService();
        return createDayTradeFieldActions({
          resolveDayReview: async (review, signal) =>
            (await this.getAgentReviewReadService()).resolveFile(
              review,
              signal
            ),
          readFrontmatter: (file) =>
            this.app.metadataCache.getFileCache(file)?.frontmatter,
          customFields,
          getAvailableTags: () =>
            this.getOptionsServiceSync().getOptions(OptionType.TAG),
          getAvailableMistakes: () =>
            this.getOptionsServiceSync().getOptions(OptionType.MISTAKE),
          resolveSetupId: async (setupId) =>
            (await this.getAgentEntityIdentityService()).resolveSetupId(
              setupId
            ),
          getDayTradePaths: (day) => dayFields.getDayTradePaths(day),
          readTradeJournalValues: (path) => {
            const file = this.app.vault.getAbstractFileByPath(path);
            const frontmatter =
              file instanceof TFile
                ? this.app.metadataCache.getFileCache(file)?.frontmatter
                : undefined;
            return frontmatter
              ? readTradeJournalValues(frontmatter, customFields.getFields())
              : null;
          },
          saveRules: async (file, rules, guard) =>
            (await this.getDRCService()).updateDRCFrontmatterGuarded(
              file.path,
              { [DAY_TRADE_FIELDS_KEY]: rules },
              guard,
              'agent'
            ),
          applyRuleChanges: (day, paths, changes) =>
            dayFields.applyRuleChanges(day, paths, changes),
        })['review.set_day_trade_fields'];
      }),
    };
  }

  
  
  private createLazyCustomFieldActions(): ReturnType<
    typeof createCustomFieldActions
  > {
    let loaded: ReturnType<typeof createCustomFieldActions> | null = null;
    const load = () =>
      (loaded ??= createCustomFieldActions({
        service: this.getCustomFieldsService(),
        countTradesWithValue: async (fieldId, signal) => {
          const field = this.getCustomFieldsService().getField(fieldId);
          if (!field) return 0;
          const trades = await (
            await this.getAgentTradeIdentityService()
          ).listTradeIdentitiesStrict();
          if (signal.aborted) throw signal.reason;
          return trades.filter(({ file }) =>
            hasStoredCustomFieldValue(
              this.app.metadataCache.getFileCache(file)?.frontmatter,
              field
            )
          ).length;
        },
      }));
    return {
      'custom_field.create': lazyAction(
        async () => load()['custom_field.create']
      ),
      'custom_field.update': lazyAction(
        async () => load()['custom_field.update']
      ),
      'custom_field.delete': lazyAction(
        async () => load()['custom_field.delete']
      ),
      'custom_field.reorder': lazyAction(
        async () => load()['custom_field.reorder']
      ),
    };
  }

  private createLazyAccountActions(): ReturnType<typeof createAccountActions> {
    const accounts = () => this.getAccountPageService();
    return createAccountActions({
      readSources: (signal) => this.readAgentAccountSources(signal),
      getAccountTypes: () =>
        this.getOptionsServiceSync().getOptions(OptionType.ACCOUNT_TYPE),
      getDefaultCurrency: () => this.plugin.settings.general?.currency ?? 'USD',
      getStoredMetadata: () => this.plugin.settings.account?.accountMetadata,
      accounts: {
        updateAccountMetadata: async (...args) =>
          (await accounts()).updateAccountMetadata(...args),
        renameAccountMetadata: async (...args) =>
          (await accounts()).renameAccountMetadata(...args),
        deleteAccount: async (...args) =>
          (await accounts()).deleteAccount(...args),
        addManualDeposit: async (...args) =>
          (await accounts()).addManualDeposit(...args),
        addManualWithdrawal: async (...args) =>
          (await accounts()).addManualWithdrawal(...args),
        deleteManualTransaction: async (...args) =>
          (await accounts()).deleteManualTransaction(...args),
        getAccountPageData: async (...args) =>
          (await accounts()).getAccountPageData(...args),
      },
      getOrCreateAccountId: async (name) =>
        (await this.getAgentEntityIdentityService()).getOrCreateAccountId(name),
      rewriteAccountNotes: (oldName, newName) =>
        rewriteAccountReferenceNotes(
          this.getOptionsServiceSync(),
          oldName,
          newName
        ),
      renameAccountViews: (oldName, newName) =>
        this.plugin.viewManager.renameAccountPageViews(oldName, newName),
      countServerImportAccounts: async (account) =>
        (await findServerImportAccountsForLocalAccount(this.plugin, account))
          .length,
    });
  }

  private createLazySetupActions(): ReturnType<typeof createSetupActions> {
    let loaded: Promise<ReturnType<typeof createSetupActions>> | null = null;
    const load = () =>
      (loaded ??= this.getSetupService().then(
        (setupService) =>
          createSetupActions({
            readSetups: () => setupService.readExistingSetupDefinitionsStrict(),
            setupService,
            links: this.createSetupLinkCodec(),
            getTagCatalog: () =>
              this.getOptionsServiceSync().getOptions(OptionType.TAG),
            referencePaths: (name) =>
              this.getOptionsServiceSync().listSetupReferenceNotePaths(name),
          }),
        (error: unknown) => {
          loaded = null;
          throw error;
        }
      ));
    return {
      'setup.create': lazyAction(async () => (await load())['setup.create']),
      'setup.update': lazyAction(async () => (await load())['setup.update']),
      'setup.rename': lazyAction(async () => (await load())['setup.rename']),
      'setup.delete': lazyAction(async () => (await load())['setup.delete']),
    };
  }

  
  
  public getAgentChangeHistory(): AgentChangeHistory {
    if (!this.agentChangeHistory) {
      
      const uiState = this.plugin.uiStateManager;
      this.agentChangeHistory = new AgentChangeHistory({
        load: async () => ({
          batches: uiState.getState().agentChangeHistory,
        }),
        save: (batches) =>
          uiState.updateStateImmediate({ agentChangeHistory: batches }),
      });
      void this.agentChangeHistory.load();
    }
    return this.agentChangeHistory;
  }

  
  private async guardedInverse(
    action: ActionId,
    inverse: ActionInverse | null,
    result: unknown
  ): Promise<ActionInverse | null> {
    if (!inverse) return null;
    const item = editableItemOf(action, result);
    if (!item) return inverse;
    try {
      const snapshot = await this.readAgentItemSnapshot(item);
      return snapshot === undefined
        ? null
        : { ...inverse, itemGuard: { ...item, snapshot } };
    } catch (error) {
      console.warn('[Journalit] Could not snapshot an agent change:', error);
      return null;
    }
  }

  
  private async readAgentItemSnapshot(
    item: EditableItem
  ): Promise<string | undefined> {
    const sources = await this.readAgentAccountSources(
      new AbortController().signal
    );
    const metadata = sources.byId(item.accountId)?.metadata;
    if (item.kind === 'account_transaction') {
      const transaction = metadata?.manualTransactions?.find(
        (candidate) => candidate.id === item.itemId
      );
      return transaction
        ? JSON.stringify([
            transaction.type,
            transaction.amount,
            new Date(transaction.date).getTime(),
            transaction.datePrecision ?? null,
            transaction.description ?? null,
            transaction.payoutReceipt ?? null,
          ])
        : undefined;
    }
    const cost = metadata?.propChallenge?.oneTimeCosts?.find(
      (candidate) => candidate.id === item.itemId
    );
    return cost
      ? JSON.stringify([cost.kind, cost.amount, cost.date, cost.note ?? null])
      : undefined;
  }

  
  public async undoAgentChange(batchId: string): Promise<'undone' | 'failed'> {
    const batchService = await this.getActionBatchService();
    return undoAgentChange(
      {
        history: this.getAgentChangeHistory(),
        runLocal: (call, installationId, signal, precondition) =>
          batchService.runLocal(call, installationId, signal, precondition),
        checkLocal: (call, installationId, signal, precondition) =>
          batchService.checkLocal(call, installationId, signal, precondition),
        itemSnapshot: (item) => this.readAgentItemSnapshot(item),
      },
      batchId,
      new AbortController().signal
    );
  }

  public getActionBatchService(): Promise<ActionBatchService> {
    return this.lazyService(
      'actionBatchService',
      ACTION_BATCH,
      async (isOpen) => {
        async function resolvePeriodService<Service>(
          getter: () => Promise<Service>
        ): Promise<Service> {
          if (!isOpen()) throw cancelledInitialization(ACTION_BATCH);
          try {
            const periodService = await getter();
            if (!isOpen()) throw cancelledInitialization(ACTION_BATCH);
            return periodService;
          } catch (error) {
            if (!isOpen()) throw cancelledInitialization(ACTION_BATCH);
            throw error;
          }
        }
        const getConfiguredQuestionLabels = (
          period: Parameters<typeof getAgentReviewQuestionLabels>[1]
        ) => getAgentReviewQuestionLabels(this.plugin.settings, period);
        let reviewDependencies: Promise<
          ConstructorParameters<typeof ReviewCreateAction>[0] & {
            reviewWriteService: AgentReviewWriteService;
          }
        > | null = null;
        const loadReviewDependencies = () =>
          (reviewDependencies ??= this.getAgentReviewReadService().then(
            (reviewReadService) => ({
              reviewReadService,
              reviewWriteService: new AgentReviewWriteService({
                reviewReadService,
                resolveDrcService: () =>
                  resolvePeriodService(() => this.getDRCService()),
                resolveWeeklyReviewService: () =>
                  resolvePeriodService(() => this.getWeeklyReviewService()),
                resolveMonthlyReviewService: () =>
                  resolvePeriodService(() => this.getMonthlyReviewService()),
                resolveQuarterlyReviewService: () =>
                  resolvePeriodService(() => this.getQuarterlyReviewService()),
                resolveYearlyReviewService: () =>
                  resolvePeriodService(() => this.getYearlyReviewService()),
                getConfiguredQuestionLabels,
              }),
              getConfiguredQuestionLabels,
            }),
            (error: unknown) => {
              reviewDependencies = null;
              throw error;
            }
          ));
        const service = await lazyLoad(
          () =>
            new ActionBatchService({
              definitions: {
                ...this.createLazyTradeActions(),
                ...this.createLazyCustomFieldActions(),
                ...this.createLazyAccountActions(),
                ...createPropChallengeActions({
                  readChallenges: (signal) =>
                    this.readAgentPropChallengeSources(signal),
                  readAccounts: (signal) =>
                    this.readAgentAccountSources(signal),
                  getStoredMetadata: () =>
                    this.plugin.settings.account?.accountMetadata,
                  getStageAccountTypes: () =>
                    this.plugin.settings.account?.challengeStageAccountTypes,
                  getAvailableAccountTypes: () =>
                    availableAccountTypes(
                      this.getOptionsServiceSync().getOptions(
                        OptionType.ACCOUNT_TYPE
                      )
                    ),
                  getDefaultCurrency: () =>
                    this.plugin.settings.general?.currency ?? 'USD',
                  accounts: {
                    updateAccountMetadata: async (...args) =>
                      (
                        await this.getAccountPageService()
                      ).updateAccountMetadata(...args),
                  },
                }),
                ...createSessionLogEntryActions({
                  resolveDayReview: async (review, signal) =>
                    (await this.getAgentReviewReadService()).resolveFile(
                      review,
                      signal
                    ),
                  store: {
                    app: this.app,
                    updateSessionLog: async (filePath, compute, source) =>
                      (await this.getDRCService()).updateDRCFrontmatterWith(
                        filePath,
                        compute,
                        source
                      ),
                  },
                  getTags: () => this.plugin.settings.drc.sessionLogTags,
                }),
                ...this.createLazyKeyEventActions(),
                ...this.createLazyDayTradeFieldActions(),
                ...createUnplannedSessionActions({
                  now: () => new Date(),
                  resolvePhase: (now) =>
                    resolveCurrentSessionModePhase(this.plugin, now),
                  tradingDay: (now) =>
                    formatLocalDateString(getTradingDay(now, this.plugin)),
                  start: (reason) =>
                    startUnplannedSession({ plugin: this.plugin, reason }),
                  stop: (session) =>
                    stopUnplannedSession({ plugin: this.plugin, session }),
                }),
                ...createReviewImageActions({
                  app: this.app,
                  resolveReview: async (review, signal) =>
                    (await this.getAgentReviewReadService()).resolveFile(
                      review,
                      signal
                    ),
                  readFrontmatter: (file) =>
                    readFrontmatterFromDisk(this.app, file),
                  ensureImageWidgetIds: (filePath) =>
                    this.plugin.processorManager
                      .getWidgetCodeblockProcessor()
                      .ensureImageWidgetIds(filePath),
                  updateFrontmatterGuarded: async (
                    period,
                    filePath,
                    updates,
                    guard
                  ) =>
                    (
                      await loadReviewDependencies()
                    ).reviewWriteService.updateFrontmatterGuarded(
                      period,
                      filePath,
                      updates,
                      guard
                    ),
                  tradeMedia: (tradeId, signal) =>
                    this.readAgentTradeMediaOwner(tradeId, signal),
                  resolveMediaFile: (pathOrLink, sourcePath) =>
                    resolveVaultMediaFile(this.app, pathOrLink, sourcePath),
                }),
                ...createImageAnnotationActions({
                  tradeMedia: (tradeId, signal) =>
                    this.readAgentTradeMediaOwner(tradeId, signal),
                  reviewMedia: (review, signal) =>
                    this.readAgentReviewMediaOwner(review, signal),
                  resolveMediaFile: (pathOrLink, sourcePath) =>
                    resolveVaultMediaFile(this.app, pathOrLink, sourcePath),
                  tradeRevision: (path) =>
                    this.getTradeService().getCurrentTradeMutationRevision(
                      path
                    ),
                  runSerializedTradeWrite: (path, write) =>
                    this.getTradeService().runSerializedNoteWrite(path, write),
                  getAvailableTags: () =>
                    this.getOptionsServiceSync().getOptions(OptionType.TAG),
                  readOwnAnnotations: async (file) =>
                    (await readCurrentFrontmatter(this.app, file))
                      .imageAnnotations,
                  centralAnnotation: (sourcePath, source) =>
                    this.getAgentImageAnnotationService().getCentralImageAnnotation(
                      sourcePath,
                      source
                    ),
                  writeAnnotations: (sourcePath, changes, guard) =>
                    this.getAgentImageAnnotationService().updateImageAnnotations(
                      sourcePath,
                      changes,
                      guard
                    ),
                }),
                ...createSessionLogTagActions({
                  getTags: () => this.plugin.settings.drc.sessionLogTags,
                  saveTags: (tags) =>
                    persistSessionLogTags(this.plugin, tags, 'agent-action'),
                  getAlertRuleTagId: () =>
                    (
                      this.plugin.settings.drc.sessionLogAlertRule ??
                      DEFAULT_SESSION_LOG_ALERT_RULE
                    ).tagId,
                  countTaggedDays: async (tagId) => {
                    let days = 0;
                    for (const tags of (await this.getDRCService())
                      .getSessionLogTagIdsByDay()
                      .values()) {
                      if (tags.has(tagId)) days += 1;
                    }
                    return days;
                  },
                }),
                'review.create': lazyAction(
                  async () =>
                    new ReviewCreateAction(await loadReviewDependencies())
                ),
                'review.update': lazyAction(
                  async () =>
                    new ReviewUpdateAction(await loadReviewDependencies())
                ),
                ...createOptionActions(this.createOptionCatalogPlanner()),
                ...this.createLazySetupActions(),
                ...createConfigurationActions({
                  settings: () => this.getSettingsPlanner(),
                  dashboardLayouts: () => this.getDashboardLayoutPlanner(),
                  homeLayouts: () => this.getHomeLayoutPlanner(),
                  reviewTemplates: () => this.getReviewTemplatePlanner(),
                  sessionWorkflows: () => this.getSessionWorkflowPlanner(),
                }),
              },
              approvalsDisabled: () =>
                this.plugin.settings.agentAccess.fullAccess,
              onCommitted: (batch) => {
                void (async () => {
                  const actions = await Promise.all(
                    batch.actions.map(async (action) => ({
                      action: action.action,
                      title: action.title,
                      target: action.display.target,
                      changes: [...action.display.changes],
                      outcome: action.outcome,
                      inverse:
                        action.outcome === 'applied'
                          ? await this.guardedInverse(
                              action.action,
                              inverseOf(
                                action.action,
                                action.input,
                                action.summary,
                                action.result,
                                action.undo
                              ),
                              action.result
                            )
                          : null,
                    }))
                  );
                  await this.getAgentChangeHistory().record({
                    id: batch.previewId,
                    committedAt: batch.committedAt,
                    installationId: batch.installationId,
                    actions,
                  });
                })().catch((error: unknown) => {
                  console.warn(
                    '[Journalit] Could not record an agent change:',
                    error
                  );
                });
              },
            }),
          'ActionBatchService'
        );
        
        if (isOpen()) {
          this._agentApprovalCard = new AgentApprovalCardController(service);
        }
        return service;
      },
      (service) => service.close()
    );
  }

  
  public getBackendIntegrationServiceIfInitialized(): BackendIntegrationService | null {
    return this.lazyServices.backendIntegrationService ?? null;
  }

  public getBackendIntegrationService(): Promise<BackendIntegrationService> {
    return this.lazyService(
      'backendIntegrationService',
      'Backend integration service',
      () =>
        lazyLoad(
          () => new BackendIntegrationService(this.plugin),
          'BackendIntegrationService'
        ),
      (service) => service.cleanup()
    );
  }

  public getPropFirmProfileCatalogService(): Promise<PropFirmProfileCatalogService> {
    return this.lazyService(
      'propFirmProfileCatalogService',
      'Prop firm profile catalog service',
      () =>
        lazyLoad(
          () =>
            new PropFirmProfileCatalogService(this.plugin, () =>
              BackendSecretStorage.getAuthToken(this.plugin)
            ),
          'PropFirmProfileCatalogService'
        )
    );
  }

  
  public getInitializedOnboardingService(): OnboardingService | null {
    return this.lazyServices.onboardingService ?? null;
  }

  public getOnboardingService(): Promise<OnboardingService> {
    return this.lazyService(
      'onboardingService',
      'Onboarding service',
      async () => {
        const service = await lazyLoad(
          () => new OnboardingService(this.app, this.plugin),
          'OnboardingService'
        );
        await service.initialize();
        return service;
      },
      (service) => service.onunload()
    );
  }

  
  private warmUp(initialization: Promise<unknown>): Promise<void> {
    return initialization.then(
      () => undefined,
      (error: unknown) => {
        if (!(error instanceof ServiceInitializationCancelledError)) {
          console.warn('Journalit: background service warm-up failed', error);
        }
      }
    );
  }

  
  public preInitializeServices(serviceNames: string[]): void {
    if (serviceNames.length === 0) return;

    
    scheduleIdle(() => {
      const warmers: Record<string, () => Promise<unknown>> = {
        setupService: () => this.getSetupService(),
        drcService: () => this.getDRCService(),
        weeklyReviewService: () => this.getWeeklyReviewService(),
        monthlyReviewService: () => this.getMonthlyReviewService(),
        quarterlyReviewService: () => this.getQuarterlyReviewService(),
        accountPageService: () => this.getAccountPageService(),
        onboardingService: () => this.getOnboardingService(),
        backtestTradeService: () => this.getBacktestTradeService(),
      };
      const initOperations = serviceNames.map((name) => () => {
        const warm = warmers[name];
        return warm ? this.warmUp(warm()) : undefined;
      });

      
      void scheduleSequence(initOperations, 100);
    });
  }

  
  public shutdownAgentRelaySessionService(): Promise<void> {
    this.agentRelayAdmissionClosed = true;

    const service = this.lazyServices.agentRelaySessionService;
    const pending = this.serviceInitQueue.agentRelaySessionService;
    const previousShutdown = this.agentRelaySessionShutdown;

    delete this.lazyServices.agentRelaySessionService;
    this.initializedServices.delete('agentRelaySessionService');
    delete this.serviceInitQueue.agentRelaySessionService;

    const shutdown = (async () => {
      await previousShutdown;
      await Promise.all([
        service ? service.dispose().catch(() => undefined) : Promise.resolve(),
        pending
          ? pending.then(
              () => undefined,
              () => undefined
            )
          : Promise.resolve(),
      ]);
    })();
    this.agentRelaySessionShutdown = shutdown;
    return shutdown;
  }

  
  public async cleanupServices(): Promise<void> {
    const relayShutdown = this.shutdownAgentRelaySessionService();
    this.closed = true;
    this.recoveringAgentAccessSession?.dispose();
    this.recoveringAgentAccessSession = null;
    for (const unsubscribe of this.agentTradeReadImageGalleryUnsubscribeFns) {
      unsubscribe();
    }
    this.agentTradeReadImageGalleryUnsubscribeFns = [];
    this._agentTradeReadImageGalleryService = null;
    this._agentImageAnnotationService = null;

    
    if (this._tradeService) {
      await this.cleanupDataService(this._tradeService);
      this._tradeService = null;
    }

    if (this.lazyServices.setupService) {
      await this.cleanupDataService(this.lazyServices.setupService);
      delete this.lazyServices.setupService;
    }

    if (this.lazyServices.monthlyReviewService) {
      await this.cleanupDataService(this.lazyServices.monthlyReviewService);
      delete this.lazyServices.monthlyReviewService;
    }

    if (this.lazyServices.quarterlyReviewService) {
      await this.cleanupDataService(this.lazyServices.quarterlyReviewService);
      delete this.lazyServices.quarterlyReviewService;
    }

    if (this.lazyServices.yearlyReviewService) {
      await this.cleanupDataService(this.lazyServices.yearlyReviewService);
      delete this.lazyServices.yearlyReviewService;
    }

    if (this.lazyServices.missedTradeService) {
      await this.cleanupDataService(this.lazyServices.missedTradeService);
      delete this.lazyServices.missedTradeService;
    }

    if (this.lazyServices.backtestTradeService) {
      await this.cleanupDataService(this.lazyServices.backtestTradeService);
      delete this.lazyServices.backtestTradeService;
    }

    if (this.lazyServices.accountPageService) {
      await this.cleanupDataService(this.lazyServices.accountPageService);
      this.lazyServices.accountPageService.destroy();
      delete this.lazyServices.accountPageService;
    }

    this._reviewStreakService = null;

    
    
    try {
      await CustomDataService.unloadSharedIndexManager();
    } catch (error) {
      console.error('Error cleaning up CustomDataService:', error);
    }

    if (this.lazyServices.weeklyReviewService) {
      this.lazyServices.weeklyReviewService.cleanup();
      delete this.lazyServices.weeklyReviewService;
    }

    if (this.lazyServices.economicCalendarService) {
      this.lazyServices.economicCalendarService.cleanup();
      delete this.lazyServices.economicCalendarService;
    }

    if (this.lazyServices.drcService) {
      this.lazyServices.drcService.cleanup();
      delete this.lazyServices.drcService;
    }

    
    this._optionsService = null;
    this._customFieldsService = null;
    this._customReviewFieldsService = null;
    this._reviewContextInheritanceService = null;
    delete this.lazyServices.agentEntityIdentityService;
    delete this.lazyServices.agentTradeIdentityService;
    delete this.lazyServices.agentTradeReadService;
    delete this.lazyServices.agentAnalyticsReadService;
    delete this.lazyServices.agentReviewReadService;
    this._agentApprovalCard?.dispose();
    this._agentApprovalCard = null;
    if (this.lazyServices.actionBatchService) {
      this.lazyServices.actionBatchService.close();
      delete this.lazyServices.actionBatchService;
    }
    this._sessionWorkflowPlanner = null;
    this._reviewTemplatePlanner = null;
    this._dashboardLayoutPlanner = null;
    this._homeLayoutPlanner = null;
    this._settingsPlanner = null;
    delete this.lazyServices.agentNavigationService;
    if (this._agentIntegrationService) {
      this._agentIntegrationService.clear();
      this._agentIntegrationService = null;
    }
    if (this.lazyServices.agentAccessSessionService) {
      this.lazyServices.agentAccessSessionService.dispose();
      delete this.lazyServices.agentAccessSessionService;
    }
    this._agentToolRegistry = null;
    
    this.agentRequestsModal?.close();
    this.agentRequestsModal = null;
    if (this._agentResultCache) {
      this._agentResultCache.clear();
      this._agentResultCache = null;
    }

    
    if (this.lazyServices.backendIntegrationService) {
      this.lazyServices.backendIntegrationService.cleanup();
      delete this.lazyServices.backendIntegrationService;
    }
    delete this.lazyServices.propFirmProfileCatalogService;

    
    if (this.lazyServices.onboardingService) {
      void this.lazyServices.onboardingService.onunload();
      delete this.lazyServices.onboardingService;
    }

    
    this.initializedServices.clear();
    this.serviceInitQueue = {};
    ServiceManager.instance = null;
    return relayShutdown;
  }
}


function readOwnedSettings(
  settings: JournalitPlugin['settings']
): Record<string, unknown> {
  const owned: Record<string, unknown> = {};
  for (const path of SETTINGS_OWNED_PATHS) {
    const value = readSettingsPath(settings, path);
    if (value !== undefined) owned[path] = value;
  }
  return owned;
}
