

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
import { OnboardingService } from './onboarding';
import { MissedTradeService } from './missedTrade/MissedTradeService';
import { BacktestTradeService } from './backtestTrade/BacktestTradeService';
import { AccountPageService } from './accountPage';
import { FolderPathService } from './core/FolderPathService';
import { ServiceName, GetServiceType } from '../types/ServiceRegistry';

export class ServiceManager {
  private static instance: ServiceManager | null = null;

  private app: App;
  private plugin: JournalitPlugin;

  
  private _tradeService: TradeService | null = null;
  private _folderPathService: FolderPathService | null = null;

  
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

  
  private initializedServices: Set<string> = new Set();

  
  private serviceInitQueue: Map<string, Promise<any>> = new Map();

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
  ): Promise<GetServiceType<K>> {
    switch (serviceName) {
      case 'tradeService':
        return (await this.getTradeService()) as GetServiceType<K>;
      case 'setupService':
        return (await this.getSetupService()) as GetServiceType<K>;
      case 'drcService':
        return (await this.getDRCService()) as GetServiceType<K>;
      case 'weeklyReviewService':
        return (await this.getWeeklyReviewService()) as GetServiceType<K>;
      case 'monthlyReviewService':
        return (await this.getMonthlyReviewService()) as GetServiceType<K>;
      case 'quarterlyReviewService':
        return (await this.getQuarterlyReviewService()) as GetServiceType<K>;
      case 'yearlyReviewService':
        return (await this.getYearlyReviewService()) as GetServiceType<K>;
      case 'optionsService':
        return (await this.getOptionsService()) as GetServiceType<K>;
      case 'customFieldsService':
        return (await this.getCustomFieldsService()) as GetServiceType<K>;
      case 'customReviewFieldsService':
        return (await this.getCustomReviewFieldsService()) as GetServiceType<K>;
      case 'reviewContextInheritanceService':
        return (await this.getReviewContextInheritanceService()) as GetServiceType<K>;
      case 'missedTradeService':
        return (await this.getMissedTradeService()) as GetServiceType<K>;
      case 'backtestTradeService':
        return (await this.getBacktestTradeService()) as GetServiceType<K>;
      case 'accountPageService':
        return (await this.getAccountPageService()) as GetServiceType<K>;
      case 'backendIntegrationService':
        return (await this.getBackendIntegrationService()) as GetServiceType<K>;
      case 'onboardingService':
        return (await this.getOnboardingService()) as GetServiceType<K>;
      case 'folderPathService':
        return (await this.getFolderPathService()) as GetServiceType<K>;
      default: {
        
        const _exhaustive: never = serviceName;
        throw new Error(`Unknown service: ${_exhaustive}`);
      }
    }
  }

  
  public async initializeCoreServices(): Promise<void> {
    
    

    
    const folderPathService = this.getFolderPathService();
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

    
    this._optionsService = new CustomOptionsService(this.plugin, {
      namespace: 'options',
    });
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

  
  public async getSetupService(): Promise<SetupService> {
    if (this._setupService) {
      return this._setupService;
    }

    
    const existingPromise = this.serviceInitQueue.get('setupService');
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
      this.serviceInitQueue.delete('setupService');

      return service;
    })();

    
    this.serviceInitQueue.set('setupService', initPromise);

    return initPromise;
  }

  
  public async getDRCService(): Promise<DRCService> {
    if (this._drcService) {
      return this._drcService;
    }

    
    const existingPromise = this.serviceInitQueue.get('drcService');
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
      this.serviceInitQueue.delete('drcService');

      return service;
    })();

    
    this.serviceInitQueue.set('drcService', initPromise);

    return initPromise;
  }

  
  public async getWeeklyReviewService(): Promise<WeeklyReviewService> {
    if (this._weeklyReviewService) {
      return this._weeklyReviewService;
    }

    
    const existingPromise = this.serviceInitQueue.get('weeklyReviewService');
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
      this.serviceInitQueue.delete('weeklyReviewService');

      return service;
    })();

    
    this.serviceInitQueue.set('weeklyReviewService', initPromise);

    return initPromise;
  }

  
  public async getMissedTradeService(): Promise<MissedTradeService> {
    if (this._missedTradeService) {
      return this._missedTradeService;
    }

    
    const existingPromise = this.serviceInitQueue.get('missedTradeService');
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
      service.setPlugin(this.plugin);

      this._missedTradeService = service;
      this.initializedServices.add('missedTradeService');
      this.serviceInitQueue.delete('missedTradeService');

      return service;
    })();

    
    this.serviceInitQueue.set('missedTradeService', initPromise);

    return initPromise;
  }

  
  public async getBacktestTradeService(): Promise<BacktestTradeService> {
    if (this._backtestTradeService) {
      return this._backtestTradeService;
    }

    
    const existingPromise = this.serviceInitQueue.get('backtestTradeService');
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
      service.setPlugin(this.plugin);

      this._backtestTradeService = service;
      this.initializedServices.add('backtestTradeService');
      this.serviceInitQueue.delete('backtestTradeService');

      return service;
    })();

    
    this.serviceInitQueue.set('backtestTradeService', initPromise);

    return initPromise;
  }

  
  public async getMonthlyReviewService(): Promise<MonthlyReviewService> {
    if (this._monthlyReviewService) {
      return this._monthlyReviewService;
    }

    
    const existingPromise = this.serviceInitQueue.get('monthlyReviewService');
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
      service.setPlugin(this.plugin);

      this._monthlyReviewService = service;
      this.initializedServices.add('monthlyReviewService');
      this.serviceInitQueue.delete('monthlyReviewService');

      return service;
    })();

    
    this.serviceInitQueue.set('monthlyReviewService', initPromise);

    return initPromise;
  }

  
  public async getQuarterlyReviewService(): Promise<QuarterlyReviewService> {
    if (this._quarterlyReviewService) {
      return this._quarterlyReviewService;
    }

    
    const existingPromise = this.serviceInitQueue.get('quarterlyReviewService');
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
      service.setPlugin(this.plugin);

      this._quarterlyReviewService = service;
      this.initializedServices.add('quarterlyReviewService');
      this.serviceInitQueue.delete('quarterlyReviewService');

      return service;
    })();

    
    this.serviceInitQueue.set('quarterlyReviewService', initPromise);

    return initPromise;
  }

  
  public async getYearlyReviewService(): Promise<YearlyReviewService> {
    if (this._yearlyReviewService) {
      return this._yearlyReviewService;
    }

    
    const existingPromise = this.serviceInitQueue.get('yearlyReviewService');
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
      service.setPlugin(this.plugin);

      this._yearlyReviewService = service;
      this.initializedServices.add('yearlyReviewService');
      this.serviceInitQueue.delete('yearlyReviewService');

      return service;
    })();

    
    this.serviceInitQueue.set('yearlyReviewService', initPromise);

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

  
  public isServiceInitialized(serviceName: string): boolean {
    return this.initializedServices.has(serviceName);
  }

  
  public isServiceInitializing(serviceName: string): boolean {
    return this.serviceInitQueue.has(serviceName);
  }

  

  
  public async getAccountPageService(): Promise<AccountPageService> {
    if (this._accountPageService) {
      return this._accountPageService;
    }

    
    const existingPromise = this.serviceInitQueue.get('accountPageService');
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
      this.serviceInitQueue.delete('accountPageService');

      return service;
    })();

    
    this.serviceInitQueue.set('accountPageService', initPromise);

    return initPromise;
  }

  
  public async getBackendIntegrationService(): Promise<BackendIntegrationService> {
    if (this._backendIntegrationService) {
      return this._backendIntegrationService;
    }

    
    const existingPromise = this.serviceInitQueue.get(
      'backendIntegrationService'
    );
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
      this.serviceInitQueue.delete('backendIntegrationService');

      return service;
    })();

    
    this.serviceInitQueue.set('backendIntegrationService', initPromise);

    return initPromise;
  }

  
  public async getOnboardingService(): Promise<OnboardingService> {
    if (this._onboardingService) {
      return this._onboardingService;
    }

    
    const existingPromise = this.serviceInitQueue.get('onboardingService');
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
      this.serviceInitQueue.delete('onboardingService');

      return service;
    })();

    
    this.serviceInitQueue.set('onboardingService', initPromise);

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

      
      scheduleSequence(initOperations, 100);
    });
  }

  
  public cleanupServices(): void {
    
    if (this._tradeService) {
      this._tradeService.cleanup();
      this._tradeService = null;
    }

    if (this._setupService) {
      this._setupService.cleanup();
      this._setupService = null;
    }

    if (this._monthlyReviewService) {
      this._monthlyReviewService.cleanup();
      this._monthlyReviewService = null;
    }

    if (this._quarterlyReviewService) {
      this._quarterlyReviewService.cleanup();
      this._quarterlyReviewService = null;
    }

    if (this._yearlyReviewService) {
      this._yearlyReviewService.cleanup();
      this._yearlyReviewService = null;
    }

    if (this._missedTradeService) {
      this._missedTradeService.cleanup();
      this._missedTradeService = null;
    }

    if (this._backtestTradeService) {
      this._backtestTradeService.cleanup();
      this._backtestTradeService = null;
    }

    if (this._accountPageService) {
      this._accountPageService.cleanup();
      this._accountPageService.destroy();
      this._accountPageService = null;
    }

    
    
    try {
      CustomDataService.unloadSharedIndexManager();
    } catch (error) {
      console.error('Error cleaning up CustomDataService:', error);
    }

    
    this._drcService = null;
    this._weeklyReviewService = null;
    this._optionsService = null;
    this._customFieldsService = null;
    this._customReviewFieldsService = null;
    this._reviewContextInheritanceService = null;

    
    if (this._backendIntegrationService) {
      this._backendIntegrationService.cleanup();
      this._backendIntegrationService = null;
    }

    
    if (this._onboardingService) {
      this._onboardingService.onunload();
      this._onboardingService = null;
    }

    
    this.initializedServices.clear();
    this.serviceInitQueue.clear();
    ServiceManager.instance = null;
  }
}
