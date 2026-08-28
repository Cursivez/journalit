

import { Plugin } from 'obsidian';
import { debounceAsync } from '../utils/debounce';
import { FilterState } from '../components/dashboard/DashboardView';
import {
  RecentItem,
  HomePeriod,
  HomeViewMode,
  TradeLogSettings,
  PersistedViewFilters,
  JournalitSettings,
  type EconomicCalendarViewFilters,
} from './types';
import { normalizeEconomicCalendarViewFilters } from '../services/economicCalendar/economicCalendarScope';
import type { TradeType } from '../services/tradelog/types';
import type { SetupDirection } from '../services/setup/types';
import { migrateLegacyAllStatusSelection } from './viewFiltersDefaults';


const UI_STATE_FILENAME = 'ui-state.json';


interface UIState {
  
  recentItems: RecentItem[];

  
  lastUsedFilters?: FilterState;

  
  viewFilters?: PersistedViewFilters;

  
  statusFilterCancelledMigrationVersion?: number;

  
  tradeLog?: TradeLogSettings;

  
  tradeLogMode?: 'trades' | 'imageGallery';

  
  selectedPeriod?: HomePeriod;

  
  homeViewMode?: HomeViewMode;

  
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

  
  lastFuturesSymbol?: string;

  
  lastForexSymbol?: string;

  
  gettingStartedDismissed?: boolean;

  
  gettingStartedOpenedTradeLog?: boolean;
  gettingStartedOpenedLayoutBuilder?: boolean;
  gettingStartedOpenedNavigationSidebar?: boolean;

  
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

  
  setupOverviewSelectedTags?: string[];

  
  setupOverviewSelectedDirections?: Array<SetupDirection | 'unspecified'>;

  
  setupOverviewChartMode?: 'setups' | 'pairs';

  
  setupOverviewPairMetricKey?:
    | 'edgeR'
    | 'expectancyR'
    | 'totalR'
    | 'totalPnL'
    | 'winRate'
    | 'profitFactor'
    | 'totalTrades';

  
  economicCalendar?: {
    lastAutoImportAt?: string;
    lastAutoImportWeekKey?: string;
    viewFilters?: EconomicCalendarViewFilters;
  };
}


const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function normalizeSetupOverviewSelectedTags(
  value: unknown
): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];

  const normalized: string[] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== 'string') continue;
    const tag = entry.trim();
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    normalized.push(tag);
  }
  return normalized;
}

function normalizeSetupOverviewSelectedDirections(
  value: unknown
): Array<SetupDirection | 'unspecified'> {
  if (!Array.isArray(value)) return [];
  const allowed = new Set(['long', 'short', 'both', 'unspecified']);
  return value.filter(
    (entry): entry is SetupDirection | 'unspecified' =>
      typeof entry === 'string' && allowed.has(entry)
  );
}

function normalizeEconomicCalendarUiState(
  value: unknown
): UIState['economicCalendar'] {
  if (!isRecord(value)) return undefined;
  const next: NonNullable<UIState['economicCalendar']> = {};
  if (
    typeof value.lastAutoImportAt === 'string' &&
    value.lastAutoImportAt.length > 0 &&
    !Number.isNaN(Date.parse(value.lastAutoImportAt))
  ) {
    next.lastAutoImportAt = value.lastAutoImportAt;
  }
  if (
    typeof value.lastAutoImportWeekKey === 'string' &&
    value.lastAutoImportWeekKey.length > 0
  ) {
    next.lastAutoImportWeekKey = value.lastAutoImportWeekKey;
  }
  const viewFilters = normalizeEconomicCalendarViewFilters(value.viewFilters);
  if (viewFilters) next.viewFilters = viewFilters;
  return next.lastAutoImportAt || next.lastAutoImportWeekKey || next.viewFilters
    ? next
    : undefined;
}

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
  gettingStartedOpenedNavigationSidebar: false,
};

const STATUS_FILTER_CANCELLED_MIGRATION_VERSION = 1;

function migratePersistedViewFilters(
  filters: PersistedViewFilters
): PersistedViewFilters {
  return {
    ...filters,
    ...(filters.dashboard
      ? {
          dashboard: {
            ...filters.dashboard,
            statuses: migrateLegacyAllStatusSelection(
              filters.dashboard.statuses
            ),
          },
        }
      : {}),
    ...(filters.tradelog
      ? {
          tradelog: {
            ...filters.tradelog,
            statuses: migrateLegacyAllStatusSelection(
              filters.tradelog.statuses
            ),
          },
        }
      : {}),
    ...(filters.reviews
      ? {
          reviews: {
            ...filters.reviews,
            statuses: migrateLegacyAllStatusSelection(filters.reviews.statuses),
          },
        }
      : {}),
  };
}


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
        this.state = {
          ...DEFAULT_UI_STATE,
          statusFilterCancelledMigrationVersion:
            STATUS_FILTER_CANCELLED_MIGRATION_VERSION,
        };
        this.loadedFromDisk = false;
        return this.state;
      }

      const content = await this.plugin.app.vault.adapter.read(statePath);
      const data: unknown = JSON.parse(content);
      const persistedState = isRecord(data) ? data : {};

      
      this.state = {
        ...DEFAULT_UI_STATE,
        ...persistedState,
        setupOverviewSelectedTags: normalizeSetupOverviewSelectedTags(
          persistedState.setupOverviewSelectedTags
        ),
        setupOverviewSelectedDirections:
          normalizeSetupOverviewSelectedDirections(
            persistedState.setupOverviewSelectedDirections
          ),
        economicCalendar: normalizeEconomicCalendarUiState(
          persistedState.economicCalendar
        ),
      };
      if (
        this.state.statusFilterCancelledMigrationVersion !==
        STATUS_FILTER_CANCELLED_MIGRATION_VERSION
      ) {
        if (this.state.viewFilters) {
          this.state.viewFilters = migratePersistedViewFilters(
            this.state.viewFilters
          );
        }
        this.state.statusFilterCancelledMigrationVersion =
          STATUS_FILTER_CANCELLED_MIGRATION_VERSION;
        await this.saveStateInternal();
      }
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
      const migratedSettingsViewFilters = migratePersistedViewFilters(
        settings.viewFilters
      );
      this.state.viewFilters = {
        ...migratedSettingsViewFilters,
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
