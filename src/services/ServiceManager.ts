

import { App } from 'obsidian';
import { TradeService } from './trade/TradeService';
import { lazyLoad } from '../utils/dynamicImport';
import JournalitPlugin from '../main';
import { scheduleIdle, scheduleSequence } from '../utils/deferredExecution';


import { SetupService } from './setup/SetupService';
import { DRCService } from './drc/DRCService';
import { WeeklyReviewService } from './weekly/WeeklyReviewService';
import { MonthlyReviewService } from './monthly/MonthlyReviewService';
import { QuarterlyReviewService } from './quarterly/QuarterlyReviewService';
import { YearlyReviewService } from './yearly/YearlyReviewService';
import { CustomOptionsService } from './options';
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
import { BackendSecretStorage } from './backend/BackendSecretStorage';

interface ServiceInitQueue {
  setupService?: Promise<SetupService>;
  drcService?: Promise<DRCService>;
  weeklyReviewService?: Promise<WeeklyReviewService>;
  missedTradeService?: Promise<MissedTradeService>;
  backtestTradeService?: Promise<BacktestTradeService>;
  monthlyReviewService?: Promise<MonthlyReviewService>;
  quarterlyReviewService?: Promise<QuarterlyReviewService>;
  yearlyReviewService?: Promise<YearlyReviewService>;
  accountPageService?: Promise<AccountPageService>;
  backendIntegrationService?: Promise<BackendIntegrationService>;
  onboardingService?: Promise<OnboardingService>;
  propFirmProfileCatalogService?: Promise<PropFirmProfileCatalogService>;
  economicCalendarService?: Promise<EconomicCalendarService>;
}

export class ServiceManager {
  private static instance: ServiceManager | null = null;

  private app: App;
  private plugin: JournalitPlugin;

  
  private _tradeService: TradeService | null = null;
  private _folderPathService: FolderPathService | null = null;
  private _imageGalleryVaultWatcher: ImageGalleryVaultWatcher | null = null;

  
  private _setupService: SetupService | null = null;
  private _drcService: DRCService | null = null;
  private _weeklyReviewService: WeeklyReviewService | null = null;
  private _monthlyReviewService: MonthlyReviewService | null = null;
  private _quarterlyReviewService: QuarterlyReviewService | null = null;
  private _yearlyReviewService: YearlyReviewService | null = null;
  private _optionsService: CustomOptionsService | null = null;
  private _customFieldsService: CustomFieldsService | null = null;
  private _customReviewFieldsService: CustomReviewFieldsService | null = null;
  private _reviewContextInheritanceService: ReviewContextInheritanceService | null =
    null;
  private _missedTradeService: MissedTradeService | null = null;
  private _backtestTradeService: BacktestTradeService | null = null;
  
  private _backendIntegrationService: BackendIntegrationService | null = null;
  private _onboardingService: OnboardingService | null = null;
  private _accountPageService: AccountPageService | null = null;
  private _propFirmProfileCatalogService: PropFirmProfileCatalogService | null =
    null;
  private _reviewStreakService: ReviewStreakService | null = null;
  private _economicCalendarService: EconomicCalendarService | null = null;

  
  private initializedServices: Set<string> = new Set();

  
  private serviceInitQueue: ServiceInitQueue = {};

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
      async () => await this.getSetupService(),
      async () => await this.getDRCService(),
      async () => await this.getWeeklyReviewService(),
      async () => await this.getMonthlyReviewService(),
      async () => await this.getQuarterlyReviewService(),
      
      async () => await this.getAccountPageService(),
    ];

    
    
    await scheduleSequence(initOperations, 50);
  }

  
  public getTradeService(): TradeService {
    if (!this._tradeService) {
      const folderPathService = this.getFolderPathService();
      this._tradeService = new TradeService(this.app, folderPathService, {
        namespace: 'trade',
      });
      this._tradeService.setPlugin(this.plugin);
      this.initializedServices.add('tradeService');
    }
    return this._tradeService;
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

  
  public async getSetupService(): Promise<SetupService> {
    if (this._setupService) {
      return this._setupService;
    }

    
    const existingPromise = this.serviceInitQueue.setupService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      const tradeService = this.getTradeService();

      
      const service = await lazyLoad(
        () => new SetupService(this.app, tradeService, { namespace: 'setup' }),
        'SetupService'
      );
      service.setPlugin(this.plugin);
      this._setupService = service;
      this.initializedServices.add('setupService');
      delete this.serviceInitQueue.setupService;

      return service;
    })();

    
    this.serviceInitQueue.setupService = initPromise;

    return initPromise;
  }

  
  public async getDRCService(): Promise<DRCService> {
    if (this._drcService) {
      return this._drcService;
    }

    
    const existingPromise = this.serviceInitQueue.drcService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      const folderPathService = this.getFolderPathService();

      
      const service = await lazyLoad(
        () =>
          new DRCService(this.app, this.plugin, folderPathService, {
            namespace: 'drc',
          }),
        'DRCService'
      );

      this._drcService = service;
      this.initializedServices.add('drcService');
      delete this.serviceInitQueue.drcService;

      return service;
    })();

    
    this.serviceInitQueue.drcService = initPromise;

    return initPromise;
  }

  
  public async getWeeklyReviewService(): Promise<WeeklyReviewService> {
    if (this._weeklyReviewService) {
      return this._weeklyReviewService;
    }

    
    const existingPromise = this.serviceInitQueue.weeklyReviewService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      const folderPathService = this.getFolderPathService();

      
      const service = await lazyLoad(
        () => new WeeklyReviewService(this.app, this.plugin, folderPathService),
        'WeeklyReviewService'
      );

      this._weeklyReviewService = service;
      this.initializedServices.add('weeklyReviewService');
      delete this.serviceInitQueue.weeklyReviewService;

      return service;
    })();

    
    this.serviceInitQueue.weeklyReviewService = initPromise;

    return initPromise;
  }

  
  public async getEconomicCalendarService(): Promise<EconomicCalendarService> {
    if (this._economicCalendarService) {
      return this._economicCalendarService;
    }

    const existingPromise = this.serviceInitQueue.economicCalendarService;
    if (existingPromise) {
      return existingPromise;
    }

    const initPromise = (async () => {
      const weeklyReviewService = await this.getWeeklyReviewService();
      const service = await lazyLoad(
        () => new EconomicCalendarService(this.plugin, weeklyReviewService),
        'EconomicCalendarService'
      );

      this._economicCalendarService = service;
      this.initializedServices.add('economicCalendarService');
      delete this.serviceInitQueue.economicCalendarService;

      return service;
    })();

    this.serviceInitQueue.economicCalendarService = initPromise;
    return initPromise;
  }

  
  public async getMissedTradeService(): Promise<MissedTradeService> {
    if (this._missedTradeService) {
      return this._missedTradeService;
    }

    
    const existingPromise = this.serviceInitQueue.missedTradeService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      const service = await lazyLoad(
        () =>
          new MissedTradeService(this.app, this.plugin, {
            namespace: 'missed-trade',
          }),
        'MissedTradeService'
      );
      this._missedTradeService = service;
      this.initializedServices.add('missedTradeService');
      delete this.serviceInitQueue.missedTradeService;

      return service;
    })();

    
    this.serviceInitQueue.missedTradeService = initPromise;

    return initPromise;
  }

  
  public async getBacktestTradeService(): Promise<BacktestTradeService> {
    if (this._backtestTradeService) {
      return this._backtestTradeService;
    }

    
    const existingPromise = this.serviceInitQueue.backtestTradeService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      const service = await lazyLoad(
        () =>
          new BacktestTradeService(this.app, this.plugin, {
            namespace: 'backtest-trade',
          }),
        'BacktestTradeService'
      );
      this._backtestTradeService = service;
      this.initializedServices.add('backtestTradeService');
      delete this.serviceInitQueue.backtestTradeService;

      return service;
    })();

    
    this.serviceInitQueue.backtestTradeService = initPromise;

    return initPromise;
  }

  
  public async getMonthlyReviewService(): Promise<MonthlyReviewService> {
    if (this._monthlyReviewService) {
      return this._monthlyReviewService;
    }

    
    const existingPromise = this.serviceInitQueue.monthlyReviewService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      const folderPathService = this.getFolderPathService();

      
      const service = await lazyLoad(
        () =>
          new MonthlyReviewService(this.app, this.plugin, folderPathService, {
            namespace: 'monthly',
          }),
        'MonthlyReviewService'
      );
      this._monthlyReviewService = service;
      this.initializedServices.add('monthlyReviewService');
      delete this.serviceInitQueue.monthlyReviewService;

      return service;
    })();

    
    this.serviceInitQueue.monthlyReviewService = initPromise;

    return initPromise;
  }

  
  public async getQuarterlyReviewService(): Promise<QuarterlyReviewService> {
    if (this._quarterlyReviewService) {
      return this._quarterlyReviewService;
    }

    
    const existingPromise = this.serviceInitQueue.quarterlyReviewService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      const folderPathService = this.getFolderPathService();

      
      const service = await lazyLoad(
        () =>
          new QuarterlyReviewService(this.app, this.plugin, folderPathService, {
            namespace: 'quarterly',
          }),
        'QuarterlyReviewService'
      );
      this._quarterlyReviewService = service;
      this.initializedServices.add('quarterlyReviewService');
      delete this.serviceInitQueue.quarterlyReviewService;

      return service;
    })();

    
    this.serviceInitQueue.quarterlyReviewService = initPromise;

    return initPromise;
  }

  
  public async getYearlyReviewService(): Promise<YearlyReviewService> {
    if (this._yearlyReviewService) {
      return this._yearlyReviewService;
    }

    
    const existingPromise = this.serviceInitQueue.yearlyReviewService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      const folderPathService = this.getFolderPathService();

      
      const service = await lazyLoad(
        () =>
          new YearlyReviewService(this.app, this.plugin, folderPathService, {
            namespace: 'yearly',
          }),
        'YearlyReviewService'
      );
      this._yearlyReviewService = service;
      this.initializedServices.add('yearlyReviewService');
      delete this.serviceInitQueue.yearlyReviewService;

      return service;
    })();

    
    this.serviceInitQueue.yearlyReviewService = initPromise;

    return initPromise;
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
    const services = new Set(
      Object.values(this).filter(
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

  

  
  public async getAccountPageService(): Promise<AccountPageService> {
    if (this._accountPageService) {
      return this._accountPageService;
    }

    
    const existingPromise = this.serviceInitQueue.accountPageService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      this.getTradeService();

      
      const service = await lazyLoad(() => {
        const service = new AccountPageService(this.app);
        service.setPlugin(this.plugin);
        return service;
      }, 'AccountPageService');

      this._accountPageService = service;
      this.initializedServices.add('accountPageService');
      delete this.serviceInitQueue.accountPageService;

      return service;
    })();

    
    this.serviceInitQueue.accountPageService = initPromise;

    return initPromise;
  }

  
  public getBackendIntegrationServiceIfInitialized(): BackendIntegrationService | null {
    return this._backendIntegrationService;
  }

  public async getBackendIntegrationService(): Promise<BackendIntegrationService> {
    if (this._backendIntegrationService) {
      return this._backendIntegrationService;
    }

    
    const existingPromise = this.serviceInitQueue.backendIntegrationService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      const service = await lazyLoad(
        () => new BackendIntegrationService(this.plugin),
        'BackendIntegrationService'
      );

      this._backendIntegrationService = service;
      this.initializedServices.add('backendIntegrationService');
      delete this.serviceInitQueue.backendIntegrationService;

      return service;
    })();

    
    this.serviceInitQueue.backendIntegrationService = initPromise;

    return initPromise;
  }

  public async getPropFirmProfileCatalogService(): Promise<PropFirmProfileCatalogService> {
    if (this._propFirmProfileCatalogService) {
      return this._propFirmProfileCatalogService;
    }
    const existingPromise = this.serviceInitQueue.propFirmProfileCatalogService;
    if (existingPromise) return existingPromise;

    const initPromise = lazyLoad(
      () =>
        new PropFirmProfileCatalogService(this.plugin, () =>
          BackendSecretStorage.getAuthToken(this.plugin)
        ),
      'PropFirmProfileCatalogService'
    ).then((service) => {
      this._propFirmProfileCatalogService = service;
      this.initializedServices.add('propFirmProfileCatalogService');
      delete this.serviceInitQueue.propFirmProfileCatalogService;
      return service;
    });
    this.serviceInitQueue.propFirmProfileCatalogService = initPromise;
    return initPromise;
  }

  
  
  public getInitializedOnboardingService(): OnboardingService | null {
    return this._onboardingService;
  }

  public async getOnboardingService(): Promise<OnboardingService> {
    if (this._onboardingService) {
      return this._onboardingService;
    }

    
    const existingPromise = this.serviceInitQueue.onboardingService;
    if (existingPromise) {
      return existingPromise;
    }

    
    const initPromise = (async () => {
      
      const service = await lazyLoad(
        () => new OnboardingService(this.app, this.plugin),
        'OnboardingService'
      );

      await service.initialize();

      this._onboardingService = service;
      this.initializedServices.add('onboardingService');
      delete this.serviceInitQueue.onboardingService;

      return service;
    })();

    
    this.serviceInitQueue.onboardingService = initPromise;

    return initPromise;
  }

  
  public preInitializeServices(serviceNames: string[]): void {
    if (serviceNames.length === 0) return;

    
    scheduleIdle(() => {
      const initOperations = serviceNames.map((name) => {
        return async () => {
          switch (name) {
            case 'setupService':
              await this.getSetupService();
              break;
            case 'drcService':
              await this.getDRCService();
              break;
            case 'weeklyReviewService':
              await this.getWeeklyReviewService();
              break;
            case 'monthlyReviewService':
              await this.getMonthlyReviewService();
              break;
            case 'quarterlyReviewService':
              await this.getQuarterlyReviewService();
              break;
            
            
            case 'accountPageService':
              await this.getAccountPageService();
              break;
            case 'onboardingService':
              await this.getOnboardingService();
              break;
            case 'backtestTradeService':
              await this.getBacktestTradeService();
              break;
          }
        };
      });

      
      void scheduleSequence(initOperations, 100);
    });
  }

  
  public async cleanupServices(): Promise<void> {
    
    if (this._tradeService) {
      await this.cleanupDataService(this._tradeService);
      this._tradeService = null;
    }

    if (this._setupService) {
      await this.cleanupDataService(this._setupService);
      this._setupService = null;
    }

    if (this._monthlyReviewService) {
      await this.cleanupDataService(this._monthlyReviewService);
      this._monthlyReviewService = null;
    }

    if (this._quarterlyReviewService) {
      await this.cleanupDataService(this._quarterlyReviewService);
      this._quarterlyReviewService = null;
    }

    if (this._yearlyReviewService) {
      await this.cleanupDataService(this._yearlyReviewService);
      this._yearlyReviewService = null;
    }

    if (this._missedTradeService) {
      await this.cleanupDataService(this._missedTradeService);
      this._missedTradeService = null;
    }

    if (this._backtestTradeService) {
      await this.cleanupDataService(this._backtestTradeService);
      this._backtestTradeService = null;
    }

    if (this._accountPageService) {
      await this.cleanupDataService(this._accountPageService);
      this._accountPageService.destroy();
      this._accountPageService = null;
    }

    this._reviewStreakService = null;

    
    
    try {
      await CustomDataService.unloadSharedIndexManager();
    } catch (error) {
      console.error('Error cleaning up CustomDataService:', error);
    }

    if (this._weeklyReviewService) {
      this._weeklyReviewService.cleanup();
      this._weeklyReviewService = null;
    }

    if (this._economicCalendarService) {
      this._economicCalendarService.cleanup();
      this._economicCalendarService = null;
    }

    if (this._drcService) {
      this._drcService.cleanup();
      this._drcService = null;
    }

    
    this._optionsService = null;
    this._customFieldsService = null;
    this._customReviewFieldsService = null;
    this._reviewContextInheritanceService = null;

    
    if (this._backendIntegrationService) {
      this._backendIntegrationService.cleanup();
      this._backendIntegrationService = null;
    }
    this._propFirmProfileCatalogService = null;

    
    if (this._onboardingService) {
      void this._onboardingService.onunload();
      this._onboardingService = null;
    }

    
    this.initializedServices.clear();
    this.serviceInitQueue = {};
    ServiceManager.instance = null;
  }
}
