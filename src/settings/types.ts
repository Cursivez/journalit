

import type { Layout } from '../components/shared/gridLayout/reactGridLayoutCompat';
import { DEFAULT_PRIVACY_MASK } from '../constants';
import {
  DEFAULT_TRADING_DAY_CUTOFF_TIME,
  TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION,
} from '../utils/tradingDayUtils';
import { FilterState } from '../components/dashboard/DashboardView';
import type { TradeLogFilters } from '../services/tradelog/types';

export const SETTINGS_TAB_IDS = {
  GENERAL: 'general',
  TRADING: 'trading',
  JOURNAL: 'journal',
  SYNC: 'sync',
  ADVANCED: 'advanced',
  ECONOMIC_CALENDAR: 'economicCalendar',
  
  REVIEWS: 'reviews',
  CUSTOMIZATION: 'customization',
  SESSION_MODE: 'sessionMode',
  TRADE_SYNC: 'tradeSync',
  TRADE_IMPORT_SYNC: 'tradeImportSync',
  ACCOUNTS: 'accounts',
} as const;

export type SettingsTabId =
  (typeof SETTINGS_TAB_IDS)[keyof typeof SETTINGS_TAB_IDS];

import {
  CustomOptionsData,
  DEFAULT_OPTIONS_DATA,
} from '../services/options/CustomOptionsService';
import {
  AccountType,
  DrawdownType,
  ProfitTargetType,
  AccountTransaction,
  ManualDrawdownSnapshot,
} from '../services/account/types';
import {
  CustomFieldsData,
  CustomFieldOptionsStorage,
  DEFAULT_CUSTOM_FIELDS_DATA,
} from '../types/customFields';
import {
  CustomReviewFieldsData,
  DEFAULT_CUSTOM_REVIEW_FIELDS_DATA,
} from '../types/reviewCustomFields';
import { CurrencyCode } from '../utils/currencyConfig';
import type { LocalCSVTemplate } from '../services/csv/types';

import type {
  CustomWidgetType,
  ReviewTemplate,
  TradeTemplate,
} from '../types/reviewV2';
import type {
  SessionLogAlertRule,
  SessionLogTagDefinition,
} from '../types/sessionLog';
import {
  DEFAULT_SESSION_LOG_ALERT_RULE,
  DEFAULT_SESSION_LOG_TAGS,
} from '../types/sessionLog';
import type { SessionModeSettings } from '../types/sessionMode';
import { DEFAULT_SESSION_MODE_SETTINGS } from '../types/sessionMode';
import type { UnifiedFilters } from '../components/shared/filters/types';
import {
  DEFAULT_DASHBOARD_FILTERS,
  DEFAULT_REVIEW_FILTERS,
  DEFAULT_TRADELOG_FILTERS,
} from './viewFiltersDefaults';


interface GeneralSettings {
  
  currency: CurrencyCode;
  
  displayName?: string;
  
  homeStartupBehavior?: 'always' | 'ifNone' | 'never';
  
  onboardingCompleted?: boolean;
  
  journalFolderPath?: string;
  
  debugLogging?: boolean;
}


interface DisplaySettings {
  
  privacyMode: boolean;
  
  privacyMask: string;
}


interface ReviewsSettings {
  
  globalAutoCreate: boolean;
}


export interface FTPCredentials {
  user_id?: number; 
  username: string;
  password?: string; 
  server: string;
  port: number;
  lastPasswordReset?: string;
}


export interface FTPProvisionedCredentials extends FTPCredentials {
  source: 'created' | 'reused' | 'rotated';
}


interface WeeklyReviewSettings {
  
  reviewQuestions: string[];
  
  customTimeframes?: string[];
  
  recurringGoals?: string[];
  
  checklistItems?: string[];
  
  autoCreateOnFirstTrade?: boolean;
  
  autoCreateWeeklyReviewOnNavigation?: boolean;
}


interface MonthlyReviewSettings {
  
  reviewQuestions: string[];
  
  customTimeframes?: string[];
  
  autoCreateOnFirstTrade?: boolean;
  
  autoCreateMonthlyReviewOnNavigation?: boolean;
}


interface QuarterlyReviewSettings {
  
  reviewQuestions: string[];
  
  customTimeframes?: string[];
  
  autoCreateOnFirstTrade?: boolean;
  
  autoCreateQuarterlyReviewOnNavigation?: boolean;
}


interface YearlyReviewSettings {
  
  reviewQuestions: string[];
  
  customTimeframes?: string[];
  
  autoCreateOnFirstTrade?: boolean;
  
  autoCreateYearlyReviewOnNavigation?: boolean;
}


type UICustomizationSettings = object;



type MaeMfeInputMode = 'price' | 'dollar';
export type MaeMfeDisplayUnit = 'dollar' | 'ticks';


type BreakEvenThresholdMode = 'fixed' | 'percentage_current_balance';


export type WeekStartDay =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type AnalyticsDateBasis = 'entry' | 'exit';

export type TradeFormInputMode = 'prices' | 'pnl-risk';
export type TradeFormAssetTypeMode = 'show' | 'fixed';
const TRADE_FORM_DEFAULT_ASSET_TYPES = [
  'stock',
  'options',
  'futures',
  'forex',
  'crypto',
  'cfd',
] as const;
export type TradeFormDefaultAssetType =
  (typeof TRADE_FORM_DEFAULT_ASSET_TYPES)[number];

const TRADE_FORM_LAYOUT_ITEM_IDS = [
  'assetSpecific',
  'tradingCosts',
  'tradingCostRebate',
  'tradingCostSwap',
  'tradingCostFees',
  'riskPlanning',
  'takeProfits',
  'idealExits',
  'unrealizedSnapshot',
  'dividends',
  'maeMfe',
  'tradeCurrency',
  'pnlPreview',
  'importShortcut',
  'setup',
  'mistake',
  'customTags',
  'thesis',
  'attachments',
  'customFields',
] as const;

export type TradeFormLayoutItemId = (typeof TRADE_FORM_LAYOUT_ITEM_IDS)[number];

export interface TradeFormLayoutSettings {
  
  inputMode: TradeFormInputMode;
  
  assetTypeMode: TradeFormAssetTypeMode;
  
  defaultAssetType: TradeFormDefaultAssetType;
  
  itemOrder: TradeFormLayoutItemId[];
  
  visibleItems: TradeFormLayoutItemId[];
  
  showManualFxRate: boolean;
}

export const DEFAULT_TRADE_FORM_LAYOUT_SETTINGS: TradeFormLayoutSettings = {
  inputMode: 'prices',
  assetTypeMode: 'show',
  defaultAssetType: 'stock',
  itemOrder: [...TRADE_FORM_LAYOUT_ITEM_IDS],
  visibleItems: TRADE_FORM_LAYOUT_ITEM_IDS.filter(
    (itemId) =>
      itemId !== 'idealExits' &&
      itemId !== 'unrealizedSnapshot' &&
      itemId !== 'dividends' &&
      itemId !== 'tradeCurrency'
  ),
  showManualFxRate: false,
};

const TRADE_FORM_LAYOUT_ITEM_ID_SET = new Set<string>(
  TRADE_FORM_LAYOUT_ITEM_IDS
);
function isTradeFormLayoutItemId(
  value: unknown
): value is TradeFormLayoutItemId {
  return typeof value === 'string' && TRADE_FORM_LAYOUT_ITEM_ID_SET.has(value);
}

function uniqueTradeFormLayoutItems(value: unknown): TradeFormLayoutItemId[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<TradeFormLayoutItemId>();
  const items: TradeFormLayoutItemId[] = [];
  for (const item of value) {
    const itemId = normalizeTradeFormLayoutItemId(item);
    if (!itemId || seen.has(itemId)) continue;
    seen.add(itemId);
    items.push(itemId);
  }
  return items;
}

function containsRetiredRealizedPnlPreview(value: unknown): boolean {
  if (!Array.isArray(value)) return false;

  for (const item of value) {
    if (item === 'realizedPnlPreview') return true;
  }
  return false;
}

function normalizeTradeFormLayoutItemId(
  value: unknown
): TradeFormLayoutItemId | null {
  if (isTradeFormLayoutItemId(value)) return value;

  
  
  
  if (value === 'stopLoss' || value === 'riskAmount') return 'riskPlanning';
  if (value === 'mae' || value === 'mfe') return 'maeMfe';

  return null;
}

function resolveTradeFormDefaultAssetType(
  value: unknown
): TradeFormDefaultAssetType {
  if (typeof value !== 'string') {
    return DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.defaultAssetType;
  }

  for (const assetType of TRADE_FORM_DEFAULT_ASSET_TYPES) {
    if (assetType === value) return assetType;
  }

  return DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.defaultAssetType;
}

export function resolveTradeFormLayoutSettings(
  settings: Partial<TradeFormLayoutSettings> | null | undefined
): TradeFormLayoutSettings {
  if (!settings) {
    return {
      inputMode: DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.inputMode,
      assetTypeMode: DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.assetTypeMode,
      defaultAssetType: DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.defaultAssetType,
      itemOrder: [...DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.itemOrder],
      visibleItems: [...DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.visibleItems],
      showManualFxRate: DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.showManualFxRate,
    };
  }

  const savedOrder = uniqueTradeFormLayoutItems(settings.itemOrder);
  const savedOrderSet = new Set(savedOrder);
  const itemOrder = [
    ...savedOrder,
    ...DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.itemOrder.filter(
      (itemId) => !savedOrderSet.has(itemId)
    ),
  ];

  const hasSavedVisibleItems = Array.isArray(settings.visibleItems);
  const savedVisible = uniqueTradeFormLayoutItems(settings.visibleItems);
  const visibleSet = new Set(
    hasSavedVisibleItems
      ? savedVisible
      : DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.visibleItems
  );
  if (containsRetiredRealizedPnlPreview(settings.visibleItems)) {
    visibleSet.add('pnlPreview');
  }

  for (const itemId of DEFAULT_TRADE_FORM_LAYOUT_SETTINGS.visibleItems) {
    if (!savedOrderSet.has(itemId)) {
      visibleSet.add(itemId);
    }
  }

  const inputMode = settings.inputMode === 'pnl-risk' ? 'pnl-risk' : 'prices';
  const resolvedVisibleItems = itemOrder.filter((itemId) =>
    visibleSet.has(itemId)
  );

  return {
    inputMode,
    assetTypeMode: settings.assetTypeMode === 'fixed' ? 'fixed' : 'show',
    defaultAssetType: resolveTradeFormDefaultAssetType(
      settings.defaultAssetType
    ),
    itemOrder,
    visibleItems:
      inputMode === 'pnl-risk'
        ? resolvedVisibleItems.filter((itemId) => itemId !== 'idealExits')
        : resolvedVisibleItems,
    showManualFxRate: settings.showManualFxRate === true,
  };
}

interface TradeSettings {
  
  autoOpenCreatedTrades: boolean;
  
  dateFormat: string;
  
  use24HourTime?: boolean;
  
  showSeconds?: boolean;
  
  skipWeekends: boolean;
  
  weekStartDay?: WeekStartDay;
  
  lastAssetType?: string;
  
  useDirectPnLInput?: boolean;
  
  useDollarValueInput?: boolean;
  
  maeMfeInputMode?: MaeMfeInputMode;
  
  maeMfeDisplayUnit?: MaeMfeDisplayUnit;
  
  tradingDayCutoffTime?: string;
  
  tradingDayCutoffEndOfDayMigrationVersion?: string;
  
  breakEvenRangeMin?: number;
  
  breakEvenRangeMax?: number;
  
  breakEvenThresholdMode?: BreakEvenThresholdMode;
  
  breakEvenThresholdPercent?: number;
  
  includeMissedTradesInCalculations?: boolean;
  
  includeUnrealizedPnLInCalculations?: boolean;
  
  defaultRiskAmount?: number;
  
  displayRMultiples?: boolean;
  
  includeCopyAccountsInAllAccountsAnalytics?: boolean;
  
  analyticsDateBasis?: AnalyticsDateBasis;
  
  tradeFormLayout?: TradeFormLayoutSettings;
  
  canonicalExecutionMigrationVersion?: string;
  
  tradeReviewMarkdownMigrationVersion?: string;
  
  galleryFolders: string[];
  
  graphLinkMigrationVersion?: string;
  
  tradeReviewLayoutMigrationVersion?: string;
}


interface DRCSettings {
  
  checklistItems: string[];
  
  reviewQuestions: string[];
  
  customTimeframes: string[];
  
  recurringGoals: string[];
  
  autoCreateOnFirstTrade: boolean;
  
  autoCreateDRCOnNavigation: boolean;
  
  sessionLogTags: SessionLogTagDefinition[];
  
  sessionLogAlertRule: SessionLogAlertRule;
}


export type WeekdayPerformanceMetric = 'net' | 'winRate' | 'trades';
export type PerformanceBreakdownMetric = 'net' | 'winRate';
export type PerformanceBreakdownViewMode = 'bestAndWorst' | 'best' | 'worst';

export interface DashboardSettings {
  
  layouts: {
    
    [name: string]: {
      
      topSection: string[];
      
      bottomSection: {
        lg: Layout[]; 
        md: Layout[]; 
        sm: Layout[]; 
        xs?: Layout[]; 
        xxs?: Layout[]; 
      };
    };
  };
  
  activeLayout: string;
  
  weekdayPerformanceMetric?: WeekdayPerformanceMetric;
  
  tickerPerformanceMetric?: PerformanceBreakdownMetric;
  
  tickerPerformanceViewMode?: PerformanceBreakdownViewMode;
  
  setupPerformanceMetric?: PerformanceBreakdownMetric;
  
  setupPerformanceViewMode?: PerformanceBreakdownViewMode;
  
  tagPerformanceMetric?: PerformanceBreakdownMetric;
  
  tagPerformanceViewMode?: PerformanceBreakdownViewMode;
  
  defaultFilters: FilterState;
  
  lastUsedFilters?: FilterState;
}


export interface RecentItem {
  
  type: 'file' | 'view';
  
  title: string;
  
  path?: string;
  
  viewType?: string;
  
  icon?: string;
  
  openedAt: string;
}


export const QUICK_LINK_ACTIONS = [
  'addTrade',
  'openTradeLog',
  'openSetups',
  'openTradingDashboard',
  'openAccountDashboard',
  'openTodaysDRC',
  'openWeeklyReview',
  'openMonthlyReview',
  'openCSVImport',
  'openQuickTradeImport',
  'openLayoutBuilder',
  'openNavigationSidebar',
  'openSessionMode',
  'openHome',
  'openQuarterlyReview',
  'openYearlyReview',
  'openPositionSizeCalculator',
  'openEconomicCalendar',
] as const;

export type QuickLinkAction = (typeof QUICK_LINK_ACTIONS)[number];


export interface QuickLinkButton {
  
  id: string;
  
  label: string;
  
  icon: string;
  
  color: string;
  
  action: QuickLinkAction;
  
  visible: boolean;
  
  order: number;
}


export interface SidebarNavItem {
  id: string;
  label: string;
  icon: string;
  action: QuickLinkAction;
  section: 'overview' | 'reviews' | 'tools';
  visible: boolean;
  order: number;
}


export type SidebarTabBehavior = 'newTab' | 'replaceActiveTab';


interface NavigationSettings {
  items: SidebarNavItem[];
  tabBehavior: SidebarTabBehavior;
}

const DEFAULT_NAVIGATION_ITEMS: SidebarNavItem[] = [
  {
    id: 'nav-home',
    label: 'Home',
    icon: 'circle-dot-dashed',
    action: 'openHome',
    section: 'overview',
    visible: true,
    order: 0,
  },
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    icon: 'grip',
    action: 'openTradingDashboard',
    section: 'overview',
    visible: true,
    order: 1,
  },
  {
    id: 'nav-trade-log',
    label: 'Trade Log',
    icon: 'folder-tree',
    action: 'openTradeLog',
    section: 'overview',
    visible: true,
    order: 2,
  },
  {
    id: 'nav-setups',
    label: 'Setups',
    icon: 'flask-conical',
    action: 'openSetups',
    section: 'overview',
    visible: true,
    order: 3,
  },
  {
    id: 'nav-account-dashboard',
    label: 'Accounts',
    icon: 'users',
    action: 'openAccountDashboard',
    section: 'overview',
    visible: true,
    order: 4,
  },
  {
    id: 'nav-drc',
    label: "Today's DRC",
    icon: 'calendar',
    action: 'openTodaysDRC',
    section: 'reviews',
    visible: true,
    order: 0,
  },
  {
    id: 'nav-weekly',
    label: "This Week's Review",
    icon: 'calendar-check',
    action: 'openWeeklyReview',
    section: 'reviews',
    visible: true,
    order: 1,
  },
  {
    id: 'nav-monthly',
    label: "This Month's Review",
    icon: 'calendar-range',
    action: 'openMonthlyReview',
    section: 'reviews',
    visible: true,
    order: 2,
  },
  {
    id: 'nav-quarterly',
    label: "This Quarter's Review",
    icon: 'calendar-search',
    action: 'openQuarterlyReview',
    section: 'reviews',
    visible: true,
    order: 3,
  },
  {
    id: 'nav-yearly',
    label: "This Year's Review",
    icon: 'calendar-heart',
    action: 'openYearlyReview',
    section: 'reviews',
    visible: true,
    order: 4,
  },
  {
    id: 'nav-add-trade',
    label: 'Add Trade',
    icon: 'plus-circle',
    action: 'addTrade',
    section: 'tools',
    visible: true,
    order: 0,
  },
  {
    id: 'nav-layout-builder',
    label: 'Layout Builder',
    icon: 'lucide-blocks',
    action: 'openLayoutBuilder',
    section: 'tools',
    visible: true,
    order: 1,
  },
  {
    id: 'nav-quick-import',
    label: 'Quick Import',
    icon: 'zap',
    action: 'openQuickTradeImport',
    section: 'tools',
    visible: true,
    order: 2,
  },
  {
    id: 'nav-csv-import',
    label: 'Trade Import',
    icon: 'import',
    action: 'openCSVImport',
    section: 'tools',
    visible: true,
    order: 3,
  },
  {
    id: 'nav-position-size',
    label: 'Position Size Calculator',
    icon: 'calculator',
    action: 'openPositionSizeCalculator',
    section: 'tools',
    visible: true,
    order: 4,
  },
  {
    id: 'nav-session-mode',
    label: 'Session Mode',
    icon: 'radio',
    action: 'openSessionMode',
    section: 'tools',
    visible: true,
    order: 5,
  },
  {
    id: 'nav-economic-calendar',
    label: 'Economic Calendar',
    icon: 'calendar-range',
    action: 'openEconomicCalendar',
    section: 'tools',
    visible: true,
    order: 6,
  },
];

export function createDefaultNavigationSettings(): NavigationSettings {
  return {
    tabBehavior: 'replaceActiveTab',
    items: DEFAULT_NAVIGATION_ITEMS.map((item) => ({ ...item })),
  };
}


export type PositionSizeAssetType = 'stock' | 'futures' | 'forex';


interface PositionSizeDefaults {
  
  riskPercentage: number;
  
  accountBalance?: number;
  
  assetType?: PositionSizeAssetType;
  
  lastFuturesSymbol?: string;
  
  lastForexSymbol?: string;
}


export interface EmbeddedNoteConfig {
  
  filePath: string;
  
  title?: string;
}


export type GoalType = 'pnl' | 'tradesJournaled' | 'winRate';


export type GoalPeriod = 'daily' | 'weekly' | 'monthly' | 'lifetime';


export type HomePeriod = 'month' | 'quarter' | 'year' | 'lifetime';
export type HomeViewMode = 'overview' | 'dashboard';


export type HomeQuickLinksPosition = 'aboveWidgets' | 'belowWidgets';


export interface GoalConfig {
  
  type: GoalType;
  
  target: number;
  
  period: GoalPeriod;
  
  useRMultiples?: boolean;
  
  accountAware?: boolean;
  
  accountTargets?: Record<string, number>;
  
  accountTargetAccounts?: string[];
  
  createdAt: string;
}


export type TopBreakdownDimension =
  | 'setups'
  | 'assetTypes'
  | 'tags'
  | 'tickers';


export type TopBreakdownValueMode = 'currency' | 'percentage';


export interface TopBreakdownConfig {
  
  dimension: TopBreakdownDimension;
  
  valueMode: TopBreakdownValueMode;
  
  createdAt: string;
}


export type CurrentStreakKind =
  | 'trade-outcome'
  | 'trade-review'
  | 'drc-review'
  | 'weekly-review'
  | 'monthly-review';


export interface CurrentStreakConfig {
  kind: CurrentStreakKind;
  createdAt: string;
}


export interface HomeSettings {
  
  layouts: {
    
    [name: string]: {
      
      lg: Layout[]; 
      md: Layout[]; 
      sm: Layout[]; 
      xs?: Layout[]; 
      xxs?: Layout[]; 
    };
  };
  
  activeLayout: string;
  
  recentItems?: RecentItem[];
  
  filterRecentItemsToJournalit?: boolean;
  
  quickLinks?: QuickLinkButton[];
  
  quickLinksPosition?: HomeQuickLinksPosition;
  
  activeWidgets?: string[];
  
  embeddedNotes?: Record<string, EmbeddedNoteConfig>;
  
  positionSizeDefaults?: PositionSizeDefaults;
  
  goals?: Record<string, GoalConfig>;
  
  topBreakdowns?: Record<string, TopBreakdownConfig>;
  
  streaks?: Record<string, CurrentStreakConfig>;
  
  selectedPeriod?: HomePeriod;
  
  backgroundImagePath?: string;
  
  showBackgroundInDashboard?: boolean;
}


export interface AccountMetadata {
  
  name: string;
  
  accountType: AccountType | string;
  
  createdDate: Date;
  
  initialBalance: number;
  
  drawdownType: DrawdownType;
  
  drawdownAmount: number;
  
  hasProfitTarget: boolean;
  
  profitTarget: number;
  
  profitTargetType: ProfitTargetType;
  
  profitTargetDate?: Date;
  
  monthlyCost: number;
  
  liveBalanceAdjustment?: number;
  
  manualTransactions?: AccountTransaction[];
  
  manualDrawdownSnapshots?: ManualDrawdownSnapshot[];
  
  lastUpdated: Date;
  
  currency?: CurrencyCode;
  
  copyTradingPeriods?: CopyTradingPeriod[];
}

export interface CopyTradingPeriod {
  
  baseAccount: string;
  
  multiplier: number;
  
  startDate: Date;
  
  endDate?: Date;
}


export interface AccountSettings {
  
  defaultAccountType: AccountType;
  
  defaultDrawdownType: DrawdownType;
  
  defaultDrawdownAmount: number;
  
  showBalanceInDashboard: boolean;
  
  excludedAccountTypes: string[];
  
  includeWithdrawalsFromExcluded: Record<string, boolean>;
  
  accountTypeOrder?: string[];
  
  accountMetadata?: Record<string, AccountMetadata>;
}


export interface BackendIntegrationSettings {
  
  serverUrl?: string;
  
  syncEnabled: boolean;
  
  userId: string;
  
  authenticatedAccountId?: string;
  
  lastSyncTime?: string;
  
  syncCount?: number;
  
  vaultPath?: string;
  
  showSyncNotifications: boolean;
  
  showNewTradeNotifications: boolean;
  
  lastSeenVersion?: string;
  
  dismissedVersion?: string;
  
  lastAvailableUpdateCheckAt?: string;
  
  lastAvailableUpdateAttemptAt?: string;
  
  lastKnownAvailableVersion?: string;
  
  dismissedAvailableVersion?: string;
  showUpdateNotifications?: boolean;
  
  tradeSyncMapping?: { [tradeId: number]: string };
  
  accountMapping?: { [accountId: string]: string };
  
  ftpUsername?: string;
  
  ftpUserId?: number;
  
  ftpPassword?: string;
  
  vaultIdentifier?: string;
  
  canonicalProjectionMigrationVersion?: number;
  
  canonicalProjectionCustomFieldKeyMigrations?: Array<{
    fieldId: string;
    sourceKey: string;
    targetKey: string;
  }>;
  
  pendingTradeImportProjectionAcks?: Array<{
    ownerUserId?: string;
    vaultId: string;
    deviceId?: string;
    pluginVersion?: string;
    clientOperationId?: string;
    diagnosticSyncRunId?: string;
    diagnosticProvider?: 'tradovate' | 'rithmic';
    results: Array<{
      tradeId: string;
      backendTradeVersion: number;
      filePath?: string;
      status:
        | 'pending'
        | 'synced'
        | 'failed'
        | 'conflict'
        | 'local_deleted'
        | 'needs_rewrite';
      errorCode?: string;
    }>;
  }>;
  
  pendingTradeProjectionAckRecoveryByOwner?: Record<
    string,
    {
      nextAttemptAt?: string;
      blockedBy?: 'authentication' | 'entitlement';
    }
  >;

  
  pendingCanonicalProjectionMigrationAcks?: Array<{
    tradeId: string;
    backendTradeVersion: number;
    filePath?: string;
    status: 'conflict';
    errorCode: 'duplicate_canonical_projection';
  }>;

  
  pendingTradovateClientDiagnostics?: Array<{
    ownerUserId: string;
    schemaVersion: 'tradovate-client-diagnostics-v2';
    pluginVersion: string;
    vaultId: string;
    deviceId?: string;
    jobId?: string;
    operationId: string;
    connectionId?: string;
    syncRunId?: string;
    events: Array<{
      eventType:
        | 'sync_requested'
        | 'job_poll_started'
        | 'job_poll_completed'
        | 'projection_inventory_loaded'
        | 'account_mapping_missing'
        | 'projection_write_failed'
        | 'projection_ack_queued';
      occurredAt: string;
      errorCode?:
        | 'broker_job_failed'
        | 'broker_job_cancelled'
        | 'job_poll_request_failed'
        | 'local_account_mapping_missing'
        | 'obsidian_write_timeout'
        | 'blocked_by_obsidian_write_timeout'
        | 'obsidian_write_failed'
        | 'trade_cache_lookup_failed';
      count?: number;
    }>;
  }>;
  
  localDeletedCanonicalTradeIds?: string[];
  
  canonicalTradeProjectionOwners?: Record<string, string>;
  
  restoringCanonicalTradeIds?: string[];
  
  secretStorageNamespace?: string;

  
  
  authToken?: string;
  
  accessTokenExpiresAt?: string;
  
  authSessionId?: string;
  
  userEmail?: string;
  
  subscriptionTier?: 'free' | 'premium';
}

export function createDefaultBackendIntegrationSettings(): BackendIntegrationSettings {
  return {
    syncEnabled: false,
    userId: '',
    showSyncNotifications: true,
    showNewTradeNotifications: true,
  };
}


export interface AccountInfo {
  accountId: string;
  displayName: string;
  brokerName?: string;
  firstSeen?: string;
  lastSeen?: string;
  status?: 'active' | 'ignored';
  ignoredAt?: string;
}


export interface SymbolMapping {
  importedSymbol: string; 
  baseSymbol: string; 
  autoDetected: boolean; 
  confirmedByUser?: boolean; 
  dateCreated: string; 
}


type StaticTradeLogColumnId =
  
  | 'select'
  | 'image'
  | 'account'
  | 'ticker'
  | 'exchange'
  | 'status'
  | 'direction'
  
  | 'date'
  | 'entryTime'
  | 'exitDate'
  | 'exitTime'
  | 'duration'
  | 'expirationDate'
  | 'daysToExpiry'
  
  | 'entryPrice'
  | 'exitPrice'
  | 'priceMove'
  | 'stopLoss'
  
  | 'slDistanceDollar'
  | 'slDistancePercent'
  | 'riskAmount'
  | 'rMultiple'
  | 'maxR'
  | 'maePrice'
  | 'mfePrice'
  | 'mae'
  | 'mfe'
  | 'maePercent'
  | 'mfePercent'
  
  | 'positionSize'
  | 'positionValue'
  | 'fees'
  | 'dividends'
  | 'pnl'
  | 'returnPercent'
  
  | 'setups'
  | 'mistakes'
  | 'tags'
  | 'reviewed'
  | 'thesis'
  | 'mtComment';

export type CustomTradeLogColumnId = `cf:${string}`;

export type TradeLogColumnId = StaticTradeLogColumnId | CustomTradeLogColumnId;


export interface TradeLogSettings {
  
  columnVisibility: Partial<Record<TradeLogColumnId, boolean>>;
  
  columnOrder: TradeLogColumnId[];
  
  columnWidths: Partial<Record<TradeLogColumnId, number>>;
  
  expandedMode?: boolean;
}


interface ReviewV2Settings {
  
  customWidgetTypes: CustomWidgetType[];
  
  templates?: ReviewTemplate[];
  
  tradeTemplates?: TradeTemplate[];
}


export interface TemplatesSettings {
  
  defaultTrade: string;
  
  defaultDrc: string;
  
  defaultWeekly: string;
  
  defaultMonthly: string;
  
  defaultQuarterly: string;
  
  defaultYearly: string;
}


export interface PersistedViewFilters {
  
  dashboard: FilterState;
  
  tradelog: TradeLogFilters;
  
  reviews: UnifiedFilters;
}

export type EconomicCalendarImpact = 'none' | 'low' | 'medium' | 'high';


export const ECONOMIC_CALENDAR_IMPACTS: EconomicCalendarImpact[] = [
  'none',
  'low',
  'medium',
  'high',
];


export const ECONOMIC_CALENDAR_IMPACTS_DISPLAY_ORDER: EconomicCalendarImpact[] =
  [...ECONOMIC_CALENDAR_IMPACTS].reverse();


export interface EconomicCalendarViewFilters {
  currencies: string[];
  impacts: EconomicCalendarImpact[];
}

export interface EconomicCalendarSettings {
  
  defaultCurrencies: string[];
  
  impacts: EconomicCalendarImpact[];
  
  includeHolidays: boolean;
  
  autoImport: boolean;
}

export function createDefaultEconomicCalendarSettings(): EconomicCalendarSettings {
  return {
    defaultCurrencies: [],
    impacts: ['low', 'medium', 'high'],
    includeHolidays: true,
    autoImport: false,
  };
}

export const DEFAULT_ECONOMIC_CALENDAR_SETTINGS: EconomicCalendarSettings =
  createDefaultEconomicCalendarSettings();


export interface JournalitSettings {
  
  general?: GeneralSettings;
  
  trade: TradeSettings;
  
  display?: DisplaySettings;
  
  tradeLog?: TradeLogSettings;
  
  reviewV2?: ReviewV2Settings;
  
  templates?: TemplatesSettings;
  
  drc: DRCSettings;
  sessionMode: SessionModeSettings;
  
  weekly: WeeklyReviewSettings;
  
  monthly?: MonthlyReviewSettings;
  
  quarterly?: QuarterlyReviewSettings;
  
  yearly?: YearlyReviewSettings;
  
  reviews?: ReviewsSettings;
  
  dashboard?: DashboardSettings;
  
  home?: HomeSettings;
  
  viewFilters?: PersistedViewFilters;
  
  uiCustomization?: UICustomizationSettings;
  
  customOptions?: CustomOptionsData;
  
  customTradeFields?: CustomFieldsData;
  
  customFieldOptions?: CustomFieldOptionsStorage;
  
  customReviewFields?: CustomReviewFieldsData;
  
  customReviewFieldOptions?: CustomFieldOptionsStorage;
  
  account?: AccountSettings;

  
  backendIntegration?: BackendIntegrationSettings;
  
  csvTemplates?: LocalCSVTemplate[];
  
  csvHiddenBrokers?: string[];
  
  csvFavoriteBroker?: string;
  
  csvFavoriteAccount?: string;
  
  csvFavoriteTemplateId?: string;
  
  csvLastAssetType?: Record<string, string>;
  
  initializedOptionTypes?: string[];
  
  symbolMappings?: SymbolMapping[];
  
  navigation?: NavigationSettings;
  
  economicCalendar?: EconomicCalendarSettings;
  
  copyTradeAdjustments?: Record<
    string,
    Record<string, { pnlAdjustment: number; note?: string }>
  >;
  

  [key: string]: unknown;
}

export const DEFAULT_DASHBOARD_LAYOUT: DashboardSettings['layouts'][string] = {
  topSection: [
    'netPnL',
    'winRate',
    'numTrades',
    'maxDrawdown',
    'profitFactor',
    'sharpeRatio',
    'expectancy',
    'bestDay',
  ],
  bottomSection: {
    lg: [
      { i: 'pnlChart', x: 0, y: 0, w: 6, h: 8 },
      { i: 'performanceCalendar', x: 6, y: 0, w: 4, h: 8 },
      { i: 'recentTrades', x: 10, y: 0, w: 2, h: 7 },
      { i: 'longPnLChart', x: 0, y: 8, w: 6, h: 8 },
      { i: 'shortPnLChart', x: 6, y: 8, w: 6, h: 8 },
    ],
    md: [
      { i: 'pnlChart', x: 0, y: 0, w: 6, h: 6 },
      { i: 'performanceCalendar', x: 0, y: 6, w: 6, h: 3 },
      { i: 'recentTrades', x: 0, y: 9, w: 6, h: 3 },
      { i: 'longPnLChart', x: 0, y: 12, w: 6, h: 6 },
      { i: 'shortPnLChart', x: 0, y: 18, w: 6, h: 6 },
    ],
    sm: [
      { i: 'pnlChart', x: 0, y: 0, w: 4, h: 6 },
      { i: 'performanceCalendar', x: 0, y: 6, w: 2, h: 6 },
      { i: 'recentTrades', x: 2, y: 6, w: 2, h: 6 },
      { i: 'longPnLChart', x: 0, y: 12, w: 4, h: 6 },
      { i: 'shortPnLChart', x: 0, y: 18, w: 4, h: 6 },
    ],
    xs: [
      { i: 'pnlChart', x: 0, y: 0, w: 2, h: 6 },
      { i: 'performanceCalendar', x: 0, y: 6, w: 1, h: 5 },
      { i: 'recentTrades', x: 1, y: 6, w: 1, h: 5 },
      { i: 'longPnLChart', x: 0, y: 11, w: 2, h: 6 },
      { i: 'shortPnLChart', x: 0, y: 17, w: 2, h: 6 },
    ],
    xxs: [
      { i: 'pnlChart', x: 0, y: 0, w: 1, h: 6 },
      { i: 'performanceCalendar', x: 0, y: 6, w: 1, h: 6 },
      { i: 'recentTrades', x: 0, y: 12, w: 1, h: 4 },
      { i: 'longPnLChart', x: 0, y: 16, w: 1, h: 6 },
      { i: 'shortPnLChart', x: 0, y: 22, w: 1, h: 6 },
    ],
  },
};


export const DEFAULT_SETTINGS: JournalitSettings = {
  general: {
    currency: CurrencyCode.USD, 
    displayName: '',
    homeStartupBehavior: 'always',
    onboardingCompleted: false,
    journalFolderPath: '', 
    debugLogging: false,
  },
  display: {
    privacyMode: false,
    privacyMask: DEFAULT_PRIVACY_MASK,
  },
  trade: {
    autoOpenCreatedTrades: true,
    dateFormat: 'DDMMYY',
    use24HourTime: false, 
    showSeconds: false,
    skipWeekends: true,
    weekStartDay: 'monday',
    useDirectPnLInput: false, 
    useDollarValueInput: false, 
    maeMfeInputMode: 'dollar', 
    maeMfeDisplayUnit: 'dollar',
    tradingDayCutoffTime: DEFAULT_TRADING_DAY_CUTOFF_TIME, 
    tradingDayCutoffEndOfDayMigrationVersion:
      TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION,
    breakEvenRangeMin: 0, 
    breakEvenRangeMax: 0, 
    breakEvenThresholdMode: 'fixed',
    breakEvenThresholdPercent: 0.05,
    includeMissedTradesInCalculations: false, 
    includeUnrealizedPnLInCalculations: false, 
    defaultRiskAmount: 0,
    displayRMultiples: false,
    includeCopyAccountsInAllAccountsAnalytics: false,
    analyticsDateBasis: 'entry',
    tradeFormLayout: DEFAULT_TRADE_FORM_LAYOUT_SETTINGS,
    galleryFolders: [],
  },
  tradeLog: {
    expandedMode: false,
    columnVisibility: {
      select: false,
      image: true,
      account: true,
      ticker: true,
      status: true,
      pnl: true,
      direction: true,
      setups: true,
      mistakes: true,
      tags: true,
      date: true,
      reviewed: true,
      duration: false,
      positionSize: false,
      priceMove: false,
      expirationDate: false,
      daysToExpiry: false,
      thesis: false,
      mtComment: false,
    },
    columnOrder: [
      'select',
      'image',
      'account',
      'ticker',
      'status',
      'pnl',
      'direction',
      'setups',
      'mistakes',
      'tags',
      'date',
      'reviewed',
      'duration',
      'positionSize',
      'entryPrice',
      'exitPrice',
      'priceMove',
      'stopLoss',
      'expirationDate',
      'daysToExpiry',
      'thesis',
      'mtComment',
    ],
    columnWidths: {},
  },
  reviewV2: {
    customWidgetTypes: [],
    templates: [],
    tradeTemplates: [],
  },
  templates: {
    defaultTrade: 'builtin-trade-standard',
    defaultDrc: 'builtin-drc-standard',
    defaultWeekly: 'builtin-weekly-standard',
    defaultMonthly: 'builtin-monthly-standard',
    defaultQuarterly: 'builtin-quarterly-standard',
    defaultYearly: 'builtin-yearly-standard',
  },
  reviews: {
    globalAutoCreate: true,
  },
  uiCustomization: {
    
  },
  customOptions: DEFAULT_OPTIONS_DATA, 
  customTradeFields: DEFAULT_CUSTOM_FIELDS_DATA, 
  customFieldOptions: {}, 
  customReviewFields: DEFAULT_CUSTOM_REVIEW_FIELDS_DATA, 
  customReviewFieldOptions: {}, 
  weekly: {
    reviewQuestions: [
      'What worked well this week?',
      "What didn't work this week?",
      'Which setups were most profitable?',
      'What mistakes cost me the most money?',
      'What could I improve for next week?',
    ],
    customTimeframes: ['Monthly', 'Weekly', 'Daily'],
    recurringGoals: [],
    checklistItems: [
      'Check ForexFactory news',
      'Build weekly plan',
      'Prepare HTF narrative',
    ],
    autoCreateOnFirstTrade: true, 
    autoCreateWeeklyReviewOnNavigation: true, 
  },
  monthly: {
    reviewQuestions: [
      'What were the key lessons from this month?',
      'Which strategies performed best?',
      'What patterns do I notice in my trading?',
      'What are my goals for next month?',
      'How can I improve my risk management?',
    ],
    customTimeframes: ['Quarterly', 'Monthly', 'Weekly'],
    autoCreateOnFirstTrade: true, 
    autoCreateMonthlyReviewOnNavigation: true, 
  },
  quarterly: {
    reviewQuestions: [
      'What were the major wins and losses this quarter?',
      'Which trading strategies performed best over the quarter?',
      'What market conditions did I handle well or poorly?',
      'What are my goals for next quarter?',
      'How has my trading evolved compared to previous quarters?',
    ],
    customTimeframes: ['Yearly', 'Quarterly', 'Monthly'],
    autoCreateOnFirstTrade: true, 
    autoCreateQuarterlyReviewOnNavigation: true, 
  },
  yearly: {
    reviewQuestions: [
      'What were my biggest wins and losses this year?',
      'Which trading strategies performed best over the year?',
      'How did I handle different market conditions throughout the year?',
      'What are my goals for next year?',
      'How has my trading evolved compared to previous years?',
      'What key lessons did I learn this year?',
    ],
    customTimeframes: ['Yearly', 'Quarterly', 'Monthly'],
    autoCreateOnFirstTrade: true, 
    autoCreateYearlyReviewOnNavigation: true, 
  },
  drc: {
    checklistItems: [
      'Review market conditions',
      'Check economic calendar',
      'Set risk limits for the day',
      "Review previous day's trades",
    ],
    reviewQuestions: [
      'What did I do well today?',
      'What could I improve on?',
      'What will I focus on for the next session?',
    ],
    
    customTimeframes: ['Daily', '4H', '1H', '30M'],
    recurringGoals: [],
    autoCreateOnFirstTrade: true, 
    autoCreateDRCOnNavigation: true, 
    sessionLogTags: DEFAULT_SESSION_LOG_TAGS,
    sessionLogAlertRule: DEFAULT_SESSION_LOG_ALERT_RULE,
  },
  sessionMode: DEFAULT_SESSION_MODE_SETTINGS,
  dashboard: {
    layouts: {
      Default: DEFAULT_DASHBOARD_LAYOUT,
    },
    activeLayout: 'Default',
    weekdayPerformanceMetric: 'net',
    tickerPerformanceMetric: 'net',
    tickerPerformanceViewMode: 'bestAndWorst',
    setupPerformanceMetric: 'net',
    setupPerformanceViewMode: 'bestAndWorst',
    tagPerformanceMetric: 'net',
    tagPerformanceViewMode: 'bestAndWorst',
    defaultFilters: {
      dateRange: [null, null],
      accounts: [],
      tickers: [],
      setups: [],
      tags: [],
      mistakes: [],
      tradeTypes: [],
      statuses: [],
      reviewStatus: [],
      directions: [],
      customFieldFilters: {},
    },
    lastUsedFilters: {
      dateRange: [null, null],
      accounts: [],
      tickers: [],
      setups: [],
      tags: [],
      mistakes: [],
      tradeTypes: [],
      statuses: [],
      reviewStatus: [],
      directions: [],
      customFieldFilters: {},
    },
  },
  home: {
    layouts: {
      Default: {
        lg: [
          { i: 'weeklySummary', x: 2, y: 4, w: 4, h: 4 },
          { i: 'gettingStarted', x: 6, y: 2, w: 3, h: 6 },
          { i: 'unreviewedTrades', x: 6, y: 0, w: 3, h: 2 },
          { i: 'recentItems', x: 0, y: 4, w: 2, h: 4 },
          { i: 'positionSize', x: 9, y: 0, w: 3, h: 8 },
          { i: 'yearHeatmap', x: 0, y: 0, w: 6, h: 4 },
        ],
        md: [
          { i: 'weeklySummary', x: 3, y: 1, w: 3, h: 5 },
          { i: 'gettingStarted', x: 0, y: 0, w: 3, h: 6 },
          { i: 'unreviewedTrades', x: 3, y: 0, w: 3, h: 1 },
          { i: 'recentItems', x: 3, y: 11, w: 3, h: 8 },
          { i: 'positionSize', x: 0, y: 11, w: 3, h: 8 },
          { i: 'yearHeatmap', x: 0, y: 6, w: 6, h: 5 },
        ],
        sm: [
          { i: 'weeklySummary', x: 0, y: 1, w: 2, h: 5 },
          { i: 'gettingStarted', x: 2, y: 0, w: 2, h: 6 },
          { i: 'unreviewedTrades', x: 0, y: 0, w: 2, h: 1 },
          { i: 'recentItems', x: 0, y: 11, w: 2, h: 7 },
          { i: 'positionSize', x: 2, y: 11, w: 2, h: 7 },
          { i: 'yearHeatmap', x: 0, y: 6, w: 4, h: 5 },
        ],
        xs: [
          { i: 'weeklySummary', x: 0, y: 6, w: 2, h: 4 },
          { i: 'gettingStarted', x: 0, y: 0, w: 1, h: 6 },
          { i: 'unreviewedTrades', x: 0, y: 10, w: 2, h: 2 },
          { i: 'recentItems', x: 1, y: 0, w: 1, h: 6 },
          { i: 'positionSize', x: 0, y: 17, w: 2, h: 7 },
          { i: 'yearHeatmap', x: 0, y: 12, w: 2, h: 5 },
        ],
        xxs: [
          { i: 'weeklySummary', x: 0, y: 6, w: 1, h: 4 },
          { i: 'gettingStarted', x: 0, y: 0, w: 1, h: 6 },
          { i: 'unreviewedTrades', x: 0, y: 10, w: 1, h: 2 },
          { i: 'recentItems', x: 0, y: 12, w: 1, h: 5 },
          { i: 'positionSize', x: 0, y: 22, w: 1, h: 7 },
          { i: 'yearHeatmap', x: 0, y: 17, w: 1, h: 5 },
        ],
      },
    },
    activeLayout: 'Default',
    recentItems: [],
    quickLinks: [
      {
        id: 'add-trade',
        label: 'Add Trade',
        icon: 'plus-circle',
        color: 'var(--interactive-accent)',
        action: 'addTrade',
        visible: true,
        order: 0,
      },
      {
        id: 'trade-log',
        label: 'Trade Log',
        icon: 'folder-tree',
        color: 'var(--text-accent)',
        action: 'openTradeLog',
        visible: true,
        order: 2,
      },
      {
        id: 'setups',
        label: 'Setups',
        icon: 'flask-conical',
        color: 'var(--text-accent)',
        action: 'openSetups',
        visible: true,
        order: 3,
      },
      {
        id: 'trading-dashboard',
        label: 'Dashboard',
        icon: 'grip',
        color: 'var(--text-accent)',
        action: 'openTradingDashboard',
        visible: true,
        order: 4,
      },
      {
        id: 'account-dashboard',
        label: 'Accounts',
        icon: 'users',
        color: 'var(--text-accent)',
        action: 'openAccountDashboard',
        visible: true,
        order: 5,
      },
      {
        id: 'todays-drc',
        label: "Today's DRC",
        icon: 'calendar',
        color: 'var(--text-accent)',
        action: 'openTodaysDRC',
        visible: true,
        order: 1,
      },
      {
        id: 'weekly-review',
        label: 'This Week Review',
        icon: 'calendar-check',
        color: 'var(--text-accent)',
        action: 'openWeeklyReview',
        visible: false,
        order: 6,
      },
      {
        id: 'monthly-review',
        label: 'This Month Review',
        icon: 'calendar-range',
        color: 'var(--text-accent)',
        action: 'openMonthlyReview',
        visible: false,
        order: 7,
      },
      {
        id: 'quarterly-review',
        label: 'This Quarter Review',
        icon: 'calendar-search',
        color: 'var(--text-accent)',
        action: 'openQuarterlyReview',
        visible: false,
        order: 8,
      },
      {
        id: 'yearly-review',
        label: 'This Year Review',
        icon: 'calendar-heart',
        color: 'var(--text-accent)',
        action: 'openYearlyReview',
        visible: false,
        order: 9,
      },
      {
        id: 'csv-import',
        label: 'Trade Import',
        icon: 'import',
        color: 'var(--text-accent)',
        action: 'openCSVImport',
        visible: true,
        order: 10,
      },
      {
        id: 'quick-import',
        label: 'Quick Import',
        icon: 'zap',
        color: 'var(--text-accent)',
        action: 'openQuickTradeImport',
        visible: false,
        order: 11,
      },
      {
        id: 'layout-builder',
        label: 'Layout Builder',
        icon: 'lucide-blocks',
        color: 'var(--text-accent)',
        action: 'openLayoutBuilder',
        visible: true,
        order: 12,
      },
      {
        id: 'navigation-sidebar',
        label: 'Navigation Sidebar',
        icon: 'panel-left-open',
        color: 'var(--text-accent)',
        action: 'openNavigationSidebar',
        visible: false,
        order: 13,
      },
      {
        id: 'session-mode',
        label: 'Session Mode',
        icon: 'radio',
        color: 'var(--text-accent)',
        action: 'openSessionMode',
        visible: true,
        order: 14,
      },
      {
        
        
        id: 'economic-calendar',
        label: 'Economic Calendar',
        icon: 'calendar-range',
        color: 'var(--text-accent)',
        action: 'openEconomicCalendar',
        visible: false,
        order: 15,
      },
    ],
    quickLinksPosition: 'belowWidgets',
    activeWidgets: ['recentItems', 'yearHeatmap'],
    embeddedNotes: {},
    goals: {},
    topBreakdowns: {},
    streaks: {},
    positionSizeDefaults: {
      riskPercentage: 1,
      accountBalance: undefined,
      assetType: 'stock',
      lastFuturesSymbol: 'ES',
      lastForexSymbol: 'EURUSD',
    },
    selectedPeriod: 'lifetime',
    backgroundImagePath: '',
    showBackgroundInDashboard: false,
  },
  viewFilters: {
    dashboard: DEFAULT_DASHBOARD_FILTERS,
    tradelog: DEFAULT_TRADELOG_FILTERS,
    reviews: DEFAULT_REVIEW_FILTERS,
  },
  account: {
    defaultAccountType: AccountType.DEMO,
    defaultDrawdownType: DrawdownType.NONE,
    defaultDrawdownAmount: 0,
    showBalanceInDashboard: true,
    excludedAccountTypes: ['archived'],
    includeWithdrawalsFromExcluded: { archived: true, demo: false },
    accountTypeOrder: ['funded', 'evaluation', 'demo', 'archived'],
    accountMetadata: {},
  },

  copyTradeAdjustments: {},
  backendIntegration: {
    serverUrl: 'https://api.journalit.co', 
    syncEnabled: false,
    userId: '', 
    showSyncNotifications: true,
    showNewTradeNotifications: true,
    showUpdateNotifications: true,
    lastSeenVersion: '',
    dismissedVersion: '',
    lastAvailableUpdateCheckAt: '',
    lastAvailableUpdateAttemptAt: '',
    lastKnownAvailableVersion: '',
    dismissedAvailableVersion: '',
    
    userEmail: '',
    subscriptionTier: 'free',
  },
  csvTemplates: [],
  csvHiddenBrokers: [],
  csvFavoriteBroker: undefined,
  csvFavoriteAccount: undefined,
  csvFavoriteTemplateId: undefined,
  csvLastAssetType: {},
  initializedOptionTypes: [],
  symbolMappings: [],
  navigation: createDefaultNavigationSettings(),
  economicCalendar: createDefaultEconomicCalendarSettings(),
};

export {};
