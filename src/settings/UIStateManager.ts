

import { Plugin } from 'obsidian';
import { debounceAsync } from '../utils/debounce';
import { FilterState } from '../components/dashboard/DashboardView';
import {
  RecentItem,
  HomePeriod,
  TradeLogSettings,
  PersistedViewFilters,
  JournalitSettings,
} from './types';
import type { TradeType } from '../services/tradelog/types';


const UI_STATE_FILENAME = 'ui-state.json';


interface UIState {
  
  recentItems: RecentItem[];

  
  lastUsedFilters?: FilterState;

  
  viewFilters?: PersistedViewFilters;

  
  tradeLog?: TradeLogSettings;

  
  tradeLogMode?: 'trades' | 'imageGallery';

  
  selectedPeriod?: HomePeriod;

  
  selectedHomeAccounts?: string[];

  
  selectedHomeTradeTypes?: TradeType[];

  
  selectedAccountDashboardTradeTypes?: TradeType[];

  
  homeAccountFilterSelectAllActive?: boolean;

  
  lastAssetType?: string;

  
  dashboardActiveLayout?: string;

  
  homeActiveLayout?: string;

  
  imageGallery?: {
    sourceType?: string;
    sort?: string;
    size?: string;
    viewMode?: string;
  };

  
  lastSyncTime?: string;

  
  persistentCacheVersion?: string;

  
  oldDerivedStorageCleanupVersion?: string;

  

  
  syncCount?: number;

  
  tradeSyncSelectedSource?: 'metatrader' | 'tradeImport';

  
  lastFuturesSymbol?: string;

  
  lastForexSymbol?: string;

  
  gettingStartedDismissed?: boolean;

  
  gettingStartedOpenedTradeLog?: boolean;
  gettingStartedOpenedLayoutBuilder?: boolean;

  
  setupDetailAnalysisMode?: 'performance' | 'execution-gap';

  
  setupOverviewMetricKey?:
    | 'expectedValue'
    | 'expectedR'
    | 'totalPnL'
    | 'totalR'
    | 'winRate'
    | 'profitFactor'
    | 'totalTrades'
    | 'cumulativePnl'
    | 'cumulativeR';

  
  setupOverviewSelectedSetupIds?: string[];

  
  setupOverviewChartMode?: 'setups' | 'pairs';

  
  setupOverviewPairMetricKey?:
    | 'edgeR'
    | 'expectancyR'
    | 'totalR'
    | 'totalPnL'
    | 'winRate'
    | 'profitFactor'
    | 'totalTrades';
}


const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const DEFAULT_UI_STATE: UIState = {
  recentItems: [],
  imageGallery: {
    sourceType: 'all',
    sort: 'newest',
    size: 'medium',
    viewMode: 'grouped',
  },
  tradeLogMode: 'trades',
  gettingStartedDismissed: false,
  gettingStartedOpenedTradeLog: false,
  gettingStartedOpenedLayoutBuilder: false,
};


export class UIStateManager {
  private plugin: Plugin;
  private state: UIState = { ...DEFAULT_UI_STATE };
  private loadedFromDisk: boolean = false;
  private debouncedSave: (() => Promise<void>) & {
    cancel: () => void;
    flush: () => Promise<void | undefined>;
  };

  constructor(plugin: Plugin) {
    this.plugin = plugin;

    
    this.debouncedSave = debounceAsync(() => this.saveStateInternal(), 1000);
  }

  
  private getStatePath(): string {
    return `${this.plugin.app.vault.configDir}/plugins/${this.plugin.manifest.id}/${UI_STATE_FILENAME}`;
  }

  
  async loadState(): Promise<UIState> {
    try {
      const statePath = this.getStatePath();
      const exists = await this.plugin.app.vault.adapter.exists(statePath);

      if (!exists) {
        this.state = { ...DEFAULT_UI_STATE };
        this.loadedFromDisk = false;
        return this.state;
      }

      const content = await this.plugin.app.vault.adapter.read(statePath);
      const data: unknown = JSON.parse(content);

      
      this.state = {
        ...DEFAULT_UI_STATE,
        ...(isRecord(data) ? data : {}),
      };
      this.loadedFromDisk = true;

      return this.state;
    } catch (error) {
      console.warn(
        'UIStateManager: Failed to load UI state, using defaults:',
        error
      );
      this.state = { ...DEFAULT_UI_STATE };
      this.loadedFromDisk = false;
      return this.state;
    }
  }

  
  hasPersistedState(): boolean {
    return this.loadedFromDisk;
  }

  
  shouldMigrateFromSettings(settings: JournalitSettings): boolean {
    if (!this.hasLegacyUIData(settings)) {
      return false;
    }

    if (
      settings.home?.recentItems?.length &&
      this.state.recentItems.length === 0
    ) {
      return true;
    }

    if (settings.dashboard?.lastUsedFilters && !this.state.lastUsedFilters) {
      return true;
    }

    if (settings.viewFilters && !this.state.viewFilters) {
      return true;
    }

    if (settings.viewFilters?.tradelog && !this.state.viewFilters?.tradelog) {
      return true;
    }

    if (settings.tradeLog && !this.state.tradeLog) {
      return true;
    }

    if (settings.home?.selectedPeriod && !this.state.selectedPeriod) {
      return true;
    }

    if (settings.trade?.lastAssetType && !this.state.lastAssetType) {
      return true;
    }

    if (settings.dashboard?.activeLayout && !this.state.dashboardActiveLayout) {
      return true;
    }

    if (settings.home?.activeLayout && !this.state.homeActiveLayout) {
      return true;
    }

    if (settings.backendIntegration?.lastSyncTime && !this.state.lastSyncTime) {
      return true;
    }

    if (
      settings.backendIntegration?.syncCount !== undefined &&
      this.state.syncCount === undefined
    ) {
      return true;
    }

    if (
      settings.home?.positionSizeDefaults?.lastFuturesSymbol &&
      !this.state.lastFuturesSymbol
    ) {
      return true;
    }

    if (
      settings.home?.positionSizeDefaults?.lastForexSymbol &&
      !this.state.lastForexSymbol
    ) {
      return true;
    }

    return false;
  }

  
  getState(): UIState {
    return this.state;
  }

  
  async updateState(updates: Partial<UIState>): Promise<void> {
    this.state = {
      ...this.state,
      ...updates,
    };
    await this.debouncedSave();
  }

  
  async updateStateImmediate(updates: Partial<UIState>): Promise<void> {
    this.state = {
      ...this.state,
      ...updates,
    };
    this.debouncedSave.cancel();
    await this.saveStateInternal();
  }

  
  getDebouncedSave(): (() => Promise<void>) & {
    cancel: () => void;
    flush: () => Promise<void | undefined>;
  } {
    return this.debouncedSave;
  }

  
  private async saveStateInternal(): Promise<void> {
    try {
      const statePath = this.getStatePath();
      await this.plugin.app.vault.adapter.write(
        statePath,
        JSON.stringify(this.state, null, 2)
      );
    } catch (error) {
      console.error('UIStateManager: Failed to save UI state:', error);
    }
  }

  
  async flush(): Promise<void> {
    await this.debouncedSave.flush();
  }

  
  hasLegacyUIData(settings: JournalitSettings): boolean {
    return !!(
      settings.home?.recentItems?.length ||
      settings.dashboard?.lastUsedFilters ||
      settings.viewFilters ||
      settings.tradeLog ||
      settings.home?.selectedPeriod ||
      settings.trade?.lastAssetType ||
      settings.dashboard?.activeLayout ||
      settings.home?.activeLayout ||
      settings.backendIntegration?.lastSyncTime ||
      settings.backendIntegration?.syncCount !== undefined ||
      settings.home?.positionSizeDefaults?.lastFuturesSymbol ||
      settings.home?.positionSizeDefaults?.lastForexSymbol
    );
  }

  
  async migrateFromSettings(settings: JournalitSettings): Promise<boolean> {
    let migrated = false;

    
    const recentItems = settings.home?.recentItems;
    if (
      (!this.state.recentItems || this.state.recentItems.length === 0) &&
      recentItems &&
      recentItems.length > 0
    ) {
      this.state.recentItems = [...recentItems];
      migrated = true;
    }

    
    if (!this.state.lastUsedFilters && settings.dashboard?.lastUsedFilters) {
      this.state.lastUsedFilters = { ...settings.dashboard.lastUsedFilters };
      migrated = true;
    }

    
    
    
    if (settings.viewFilters) {
      const currentViewFilters = this.state.viewFilters ?? {};
      this.state.viewFilters = {
        ...settings.viewFilters,
        ...currentViewFilters,
      };
      migrated = true;
    }

    
    if (!this.state.tradeLog && settings.tradeLog) {
      this.state.tradeLog = { ...settings.tradeLog };
      migrated = true;
    }

    
    if (!this.state.selectedPeriod && settings.home?.selectedPeriod) {
      this.state.selectedPeriod = settings.home.selectedPeriod;
      migrated = true;
    }

    
    if (!this.state.lastAssetType && settings.trade?.lastAssetType) {
      this.state.lastAssetType = settings.trade.lastAssetType;
      migrated = true;
    }

    
    if (!this.state.dashboardActiveLayout && settings.dashboard?.activeLayout) {
      this.state.dashboardActiveLayout = settings.dashboard.activeLayout;
      migrated = true;
    }
    if (!this.state.homeActiveLayout && settings.home?.activeLayout) {
      this.state.homeActiveLayout = settings.home.activeLayout;
      migrated = true;
    }

    
    if (!this.state.lastSyncTime && settings.backendIntegration?.lastSyncTime) {
      this.state.lastSyncTime = settings.backendIntegration.lastSyncTime;
      migrated = true;
    }
    if (
      this.state.syncCount === undefined &&
      settings.backendIntegration?.syncCount !== undefined
    ) {
      this.state.syncCount = settings.backendIntegration.syncCount;
      migrated = true;
    }

    
    if (
      !this.state.lastFuturesSymbol &&
      settings.home?.positionSizeDefaults?.lastFuturesSymbol
    ) {
      this.state.lastFuturesSymbol =
        settings.home.positionSizeDefaults.lastFuturesSymbol;
      migrated = true;
    }
    if (
      !this.state.lastForexSymbol &&
      settings.home?.positionSizeDefaults?.lastForexSymbol
    ) {
      this.state.lastForexSymbol =
        settings.home.positionSizeDefaults.lastForexSymbol;
      migrated = true;
    }

    if (migrated) {
      
      await this.saveStateInternal();
      this.loadedFromDisk = true;
    }

    return migrated;
  }

  
  cleanMigratedFields(settings: JournalitSettings): JournalitSettings {
    const homeSettings = settings.home;
    const dashboardSettings = settings.dashboard;
    const backendSettings = settings.backendIntegration;

    
    if (homeSettings?.recentItems) {
      homeSettings.recentItems = undefined;
    }

    
    if (dashboardSettings?.lastUsedFilters) {
      dashboardSettings.lastUsedFilters = undefined;
    }

    
    if (settings.viewFilters) {
      settings.viewFilters = undefined;
    }

    
    if (settings.tradeLog) {
      settings.tradeLog = undefined;
    }

    
    if (homeSettings?.selectedPeriod) {
      homeSettings.selectedPeriod = undefined;
    }

    
    if (settings.trade?.lastAssetType) {
      settings.trade.lastAssetType = undefined;
    }

    
    

    
    if (backendSettings?.lastSyncTime) {
      backendSettings.lastSyncTime = undefined;
    }
    if (backendSettings?.syncCount !== undefined) {
      backendSettings.syncCount = undefined;
    }

    
    const positionSizeDefaults = homeSettings?.positionSizeDefaults;
    if (positionSizeDefaults?.lastFuturesSymbol) {
      positionSizeDefaults.lastFuturesSymbol = undefined;
    }
    if (positionSizeDefaults?.lastForexSymbol) {
      positionSizeDefaults.lastForexSymbol = undefined;
    }

    return settings;
  }
}
