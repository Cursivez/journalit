

import { Plugin } from 'obsidian';
import {
  normalizeHomeCustomRange,
  resolveHomePeriodSelection,
  type HomeCustomRange,
} from './homePeriod';
import { debounceAsync } from '../utils/debounce';
import {
  RecentItem,
  HomePeriod,
  HomeViewMode,
  TradeLogSettings,
  PersistedViewFilters,
  type EconomicCalendarViewFilters,
} from './types';
import { normalizeEconomicCalendarViewFilters } from '../services/economicCalendar/economicCalendarScope';
import type { TradeType } from '../services/tradelog/types';
import type { SetupDirection } from '../services/setup/types';
import { migrateLegacyAllStatusSelection } from './viewFiltersDefaults';
import type { JournalSettingsContext } from '../demo/DemoSettingsScope';
import {
  ensureDemoStateDirectory,
  getDemoStateDirectoryPath,
} from '../demo/DemoManifest';
import { Mutex } from '../utils/mutex';


const UI_STATE_FILENAME = 'ui-state.json';


interface UIState {
  
  recentItems: RecentItem[];

  
  viewFilters?: PersistedViewFilters;

  
  statusFilterCancelledMigrationVersion?: number;

  
  tradeLog?: TradeLogSettings;

  
  tradeLogMode?: 'trades' | 'imageGallery';

  
  selectedPeriod?: HomePeriod;
  selectedHomeCustomRange?: HomeCustomRange;

  
  homeViewMode?: HomeViewMode;

  
  selectedHomeAccounts?: string[];

  
  selectedHomeTradeTypes?: TradeType[];

  
  selectedAccountDashboardTradeTypes?: TradeType[];

  
  accountDashboardMode?: 'accountOverview' | 'challenges';

  
  homeAccountFilterSelectAllActive?: boolean;

  
  lastAssetType?: string;

  
  imageGallery?: {
    sourceType?: string;
    sort?: string;
    size?: string;
    viewMode?: string;
  };

  
  agentChangeHistory?: unknown;

  
  persistentCacheVersion?: string;

  
  oldDerivedStorageCleanupVersion?: string;

  
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

function createDefaultUIState(): UIState {
  return structuredClone(DEFAULT_UI_STATE);
}

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
  private state: UIState = createDefaultUIState();
  private loadedFromDisk: boolean = false;
  private activeContext: JournalSettingsContext = 'real';
  private readonly saveMutex = new Mutex();
  private debouncedSave: (() => Promise<void>) & {
    cancel: () => void;
    flush: () => Promise<void | undefined>;
  };

  constructor(plugin: Plugin) {
    this.plugin = plugin;

    
    this.debouncedSave = debounceAsync(() => this.saveStateInternal(), 1000);
  }

  
  private getStatePath(): string {
    if (this.activeContext === 'sample') {
      return this.getSampleStatePath();
    }
    return `${this.plugin.app.vault.configDir}/plugins/${this.plugin.manifest.id}/${UI_STATE_FILENAME}`;
  }

  private getSampleStatePath(): string {
    return `${getDemoStateDirectoryPath(this.plugin)}/${UI_STATE_FILENAME}`;
  }

  getActiveContext(): JournalSettingsContext {
    return this.activeContext;
  }

  async activateContext(context: JournalSettingsContext): Promise<UIState> {
    if (context === this.activeContext) {
      return this.state;
    }
    await this.flush();
    await this.saveMutex.withLock(async () => undefined);
    this.debouncedSave.cancel();
    this.activeContext = context;
    this.state = createDefaultUIState();
    this.loadedFromDisk = false;
    return this.loadState();
  }

  async removeSampleState(): Promise<void> {
    const path = this.getSampleStatePath();
    if (await this.plugin.app.vault.adapter.exists(path)) {
      await this.plugin.app.vault.adapter.remove(path);
    }
  }

  
  async loadState(): Promise<UIState> {
    try {
      const statePath = this.getStatePath();
      const exists = await this.plugin.app.vault.adapter.exists(statePath);

      if (!exists) {
        this.state = {
          ...createDefaultUIState(),
          statusFilterCancelledMigrationVersion:
            STATUS_FILTER_CANCELLED_MIGRATION_VERSION,
        };
        this.loadedFromDisk = false;
        return this.state;
      }

      const content = await this.plugin.app.vault.adapter.read(statePath);
      const data: unknown = JSON.parse(content);
      const persistedState = isRecord(data) ? data : {};
      const homePeriod = resolveHomePeriodSelection(
        persistedState.selectedPeriod,
        persistedState.selectedHomeCustomRange
      );

      
      this.state = {
        ...createDefaultUIState(),
        ...persistedState,
        selectedPeriod:
          persistedState.selectedPeriod === undefined
            ? undefined
            : homePeriod.period,
        selectedHomeCustomRange: normalizeHomeCustomRange(
          persistedState.selectedHomeCustomRange
        ),
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
      let shouldPersistNormalizedState = false;
      const persistedViewFilters = this.state.viewFilters;
      if (persistedViewFilters?.tradelog?.analyticsDateBasis !== undefined) {
        this.state.viewFilters = {
          ...persistedViewFilters,
          tradelog: {
            ...persistedViewFilters.tradelog,
            analyticsDateBasis: undefined,
          },
        };
        shouldPersistNormalizedState = true;
      }
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
        shouldPersistNormalizedState = true;
      }
      if (shouldPersistNormalizedState) {
        await this.saveStateInternal();
      }
      this.loadedFromDisk = true;

      return this.state;
    } catch (error) {
      console.warn(
        'UIStateManager: Failed to load UI state, using defaults:',
        error
      );
      this.state = createDefaultUIState();
      this.loadedFromDisk = false;
      return this.state;
    }
  }

  
  hasPersistedState(): boolean {
    return this.loadedFromDisk;
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
    await this.saveMutex.withLock(async () => {
      try {
        const statePath = this.getStatePath();
        const serializedState = JSON.stringify(this.state, null, 2);
        if (this.activeContext === 'sample') {
          await ensureDemoStateDirectory(this.plugin);
        }
        await this.plugin.app.vault.adapter.write(statePath, serializedState);
      } catch (error) {
        console.error('UIStateManager: Failed to save UI state:', error);
      }
    });
  }

  
  async flush(): Promise<void> {
    await this.debouncedSave.flush();
  }
}
