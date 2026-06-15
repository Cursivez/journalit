

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
  REVIEWS: 'reviews',
  CUSTOMIZATION: 'customization',
  TRADE_SYNC: 'tradeSync',
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
  DemonTrackerCountMode,
  DemonTrackerSourceMode,
  ReviewTemplate,
  TradeTemplate,
} from '../types/reviewV2';
import type { UnifiedFilters } from '../components/shared/filters/types';
import {
  DEFAULT_DASHBOARD_FILTERS,
  DEFAULT_REVIEW_FILTERS,
  DEFAULT_TRADELOG_FILTERS,
} from './viewFiltersDefaults';


export interface GeneralSettings {
  
  currency: CurrencyCode;
  
  displayName?: string;
  
  homeStartupBehavior?: 'always' | 'ifNone' | 'never';
  
  onboardingCompleted?: boolean;
  
  journalFolderPath?: string;
  
  debugLogging?: boolean;
}


export interface DisplaySettings {
  
  privacyMode: boolean;
  
  privacyMask: string;
}


export interface ReviewsSettings {
  
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


export interface WeeklyReviewSettings {
  
  reviewQuestions: string[];
  
  customTimeframes?: string[];
  
  recurringGoals?: string[];
  
  checklistItems?: string[];
  
  autoCreateOnFirstTrade?: boolean;
  
  autoCreateWeeklyReviewOnNavigation?: boolean;
}


export interface MonthlyReviewSettings {
  
  reviewQuestions: string[];
  
  customTimeframes?: string[];
  
  autoCreateOnFirstTrade?: boolean;
  
  autoCreateMonthlyReviewOnNavigation?: boolean;
}


export interface QuarterlyReviewSettings {
  
  reviewQuestions: string[];
  
  customTimeframes?: string[];
  
  autoCreateOnFirstTrade?: boolean;
  
  autoCreateQuarterlyReviewOnNavigation?: boolean;
}


export interface YearlyReviewSettings {
  
  reviewQuestions: string[];
  
  customTimeframes?: string[];
  
  autoCreateOnFirstTrade?: boolean;
  
  autoCreateYearlyReviewOnNavigation?: boolean;
}


export type UICustomizationSettings = object;


export interface LossReviewSection {
  id: string;
  title: string;
  type: 'header' | 'checkbox' | 'textarea' | 'checkboxList';
  content?: string; 
  items?: string[]; 
  placeholder?: string; 
}


export interface LossReviewSettings {
  
  enabled: boolean;
  
  sections: LossReviewSection[];
}



export type MaeMfeInputMode = 'price' | 'dollar';


export type BreakEvenThresholdMode = 'fixed' | 'percentage_current_balance';


export type WeekStartDay =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type AnalyticsDateBasis = 'entry' | 'exit';

export interface TradeSettings {
  
  autoOpenCreatedTrades: boolean;
  
  dateFormat: string;
  
  use24HourTime?: boolean;
  
  skipWeekends: boolean;
  
  weekStartDay?: WeekStartDay;
  
  lastAssetType?: string;
  
  useDirectPnLInput?: boolean;
  
  useDollarValueInput?: boolean;
  
  maeMfeInputMode?: MaeMfeInputMode;
  
  tradingDayCutoffTime?: string;
  
  tradingDayCutoffEndOfDayMigrationVersion?: string;
  
  breakEvenRangeMin?: number;
  
  breakEvenRangeMax?: number;
  
  breakEvenThresholdMode?: BreakEvenThresholdMode;
  
  breakEvenThresholdPercent?: number;
  
  lossReview?: LossReviewSettings;
  
  includeMissedTradesInCalculations?: boolean;
  
  defaultRiskAmount?: number;
  
  displayRMultiples?: boolean;
  
  includeCopyAccountsInAllAccountsAnalytics?: boolean;
  
  analyticsDateBasis?: AnalyticsDateBasis;
  
  canonicalExecutionMigrationVersion?: string;
}


export interface DRCSettings {
  
  checklistItems: string[];
  
  reviewQuestions: string[];
  
  customTimeframes: string[];
  
  recurringGoals: string[];
  
  autoCreateOnFirstTrade: boolean;
  
  autoCreateDRCOnNavigation: boolean;
}


export type WeekdayPerformanceMetric = 'net' | 'winRate' | 'trades';

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


export type QuickLinkAction =
  | 'addTrade'
  | 'openTradeLog'
  | 'openTradingDashboard'
  | 'openAccountDashboard'
  | 'openTodaysDRC'
  | 'openWeeklyReview'
  | 'openMonthlyReview'
  | 'openCSVImport'
  | 'openQuickTradeImport'
  | 'openLayoutBuilder'
  | 'openHome'
  | 'openQuarterlyReview'
  | 'openYearlyReview'
  | 'openPositionSizeCalculator';


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


export interface NavigationSettings {
  enabled: boolean;
  items: SidebarNavItem[];
  tabBehavior: SidebarTabBehavior;
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


export type HomeQuickLinksPosition = 'aboveWidgets' | 'belowWidgets';


export interface GoalConfig {
  
  type: GoalType;
  
  target: number;
  
  period: GoalPeriod;
  
  useRMultiples?: boolean;
  
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
  
  selectedPeriod?: HomePeriod;
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
  
  lastSyncTime?: string;
  
  syncCount?: number;
  
  vaultPath?: string;
  
  showSyncNotifications: boolean;
  
  showNewTradeNotifications: boolean;
  
  lastSeenVersion?: string;
  
  dismissedVersion?: string;
  showUpdateNotifications?: boolean;
  
  tradeSyncMapping?: { [tradeId: number]: string };
  
  accountMapping?: { [accountId: string]: string };
  
  ftpUsername?: string;
  
  ftpUserId?: number;
  
  ftpPassword?: string;
  
  vaultIdentifier?: string;
  
  secretStorageNamespace?: string;

  
  
  authToken?: string;
  
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


export type StaticTradeLogColumnId =
  
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


interface ScalperDefaultsSettings {
  
  countMode: DemonTrackerCountMode;
  
  sourceMode: DemonTrackerSourceMode;
  
  autoApplySessionMistakesToTrades: boolean;
}

export const DEFAULT_SCALPER_DEFAULTS: ScalperDefaultsSettings = {
  countMode: 'per-trade',
  sourceMode: 'trades',
  autoApplySessionMistakesToTrades: false,
};


export interface ReviewV2Settings {
  
  customWidgetTypes: CustomWidgetType[];
  
  templates?: ReviewTemplate[];
  
  tradeTemplates?: TradeTemplate[];
  
  scalperDefaults?: ScalperDefaultsSettings;
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


export interface JournalitSettings {
  
  general?: GeneralSettings;
  
  trade: TradeSettings;
  
  display?: DisplaySettings;
  
  tradeLog?: TradeLogSettings;
  
  reviewV2?: ReviewV2Settings;
  
  templates?: TemplatesSettings;
  
  drc: DRCSettings;
  
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
    skipWeekends: true,
    weekStartDay: 'monday',
    useDirectPnLInput: false, 
    useDollarValueInput: false, 
    maeMfeInputMode: 'dollar', 
    tradingDayCutoffTime: DEFAULT_TRADING_DAY_CUTOFF_TIME, 
    tradingDayCutoffEndOfDayMigrationVersion:
      TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION,
    breakEvenRangeMin: 0, 
    breakEvenRangeMax: 0, 
    breakEvenThresholdMode: 'fixed',
    breakEvenThresholdPercent: 0.05,
    includeMissedTradesInCalculations: false, 
    defaultRiskAmount: 0,
    displayRMultiples: false,
    includeCopyAccountsInAllAccountsAnalytics: false,
    analyticsDateBasis: 'entry',
    lossReview: {
      enabled: true,
      sections: [
        {
          id: 'pause-header',
          title: '**LOSS REVIEW**',
          type: 'header',
          content: '',
        },
        {
          id: 'pause-section',
          title: '**Pause**✋',
          type: 'header',
          content:
            'Take a moment to step back.\nDo **NOT** start looking at entering a position until you have completed this loss review.',
        },
        {
          id: 'pause-checkbox',
          title: '',
          type: 'checkbox',
          content:
            'Say out loud to yourself, **"losses are part of the process, there are endless opportunities in the market."**',
        },
        {
          id: 'review-plan',
          title: '**Review Your Plan**',
          type: 'header',
          content: '***Did you stick to your trading plan without mistakes?***',
        },
        {
          id: 'review-plan-checklist',
          title: '',
          type: 'checkboxList',
          items: [
            '→ If **yes**; there is nothing to be mad about, not every trade is going to work out regardless of how good the thesis is',
            "→ If **no**; figure out what went wrong, learn from it and don't do it again",
          ],
        },
        {
          id: 'feelings',
          title: '**Write Down Your Feelings**',
          type: 'header',
          content:
            '***Be honest about how you feel and note down your emotions:***',
        },
        {
          id: 'feelings-text',
          title: '',
          type: 'textarea',
          placeholder: 'How are you feeling about this loss?',
        },
        {
          id: 'learn-header',
          title: '**Learn From This Loss**',
          type: 'header',
          content:
            '***If the loss was reasonable, write down the best things you did during the trade and ways of repeating those:***',
        },
        {
          id: 'learn-reasonable',
          title: '',
          type: 'textarea',
          placeholder: 'What went well that you can repeat?',
        },
        {
          id: 'learn-unreasonable-header',
          title: '',
          type: 'header',
          content:
            "***If the loss was unreasonable, note where you went wrong and how you'll improve next time:***",
        },
        {
          id: 'learn-unreasonable',
          title: '',
          type: 'textarea',
          placeholder: 'What went wrong and how will you improve?',
        },
        {
          id: 'next-steps',
          title: '**Decide The Next Steps**',
          type: 'header',
          content:
            "***Outline what you'll do based on the previous questions and follow the plan.***\n***You might choose to step back from the charts if it's your third loss in a row.***\n***Or you might want to continue trading if it's the first one.***\n***What will you pay attention to? How will you behave?***",
        },
        {
          id: 'next-steps-text',
          title: '',
          type: 'textarea',
          placeholder: 'What are your next steps?',
        },
        {
          id: 'final-check',
          title: '**Final Check**',
          type: 'header',
          content: '',
        },
        {
          id: 'final-check-list',
          title: '',
          type: 'checkboxList',
          items: [
            'If you feel **tilted**, take a break from the screen and play guitar, play with Leo, or get something to eat',
            'If you feel **fine**, do not enter a trade until at least the next candle',
          ],
        },
        {
          id: 'overall-thoughts',
          title: '**Overall Trade Thoughts:**',
          type: 'header',
          content: '',
        },
        {
          id: 'overall-thoughts-text',
          title: '',
          type: 'textarea',
          placeholder: 'Any additional thoughts about this trade?',
        },
      ],
    },
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
    scalperDefaults: { ...DEFAULT_SCALPER_DEFAULTS },
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
  },
  dashboard: {
    layouts: {
      Default: DEFAULT_DASHBOARD_LAYOUT,
    },
    activeLayout: 'Default',
    weekdayPerformanceMetric: 'net',
    defaultFilters: {
      dateRange: [null, null],
      accounts: [],
      tickers: [],
      setups: [],
      tags: [],
      mistakes: [],
      tradeTypes: [],
      statuses: [],
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
        order: 1,
      },
      {
        id: 'trading-dashboard',
        label: 'Trading Dashboard',
        icon: 'grip',
        color: 'var(--text-accent)',
        action: 'openTradingDashboard',
        visible: true,
        order: 2,
      },
      {
        id: 'account-dashboard',
        label: 'Account Dashboard',
        icon: 'users',
        color: 'var(--text-accent)',
        action: 'openAccountDashboard',
        visible: true,
        order: 3,
      },
      {
        id: 'todays-drc',
        label: "Today's DRC",
        icon: 'calendar',
        color: 'var(--text-accent)',
        action: 'openTodaysDRC',
        visible: true,
        order: 4,
      },
      {
        id: 'weekly-review',
        label: 'This Week Review',
        icon: 'calendar-check',
        color: 'var(--text-accent)',
        action: 'openWeeklyReview',
        visible: true,
        order: 5,
      },
      {
        id: 'monthly-review',
        label: 'This Month Review',
        icon: 'calendar-range',
        color: 'var(--text-accent)',
        action: 'openMonthlyReview',
        visible: true,
        order: 6,
      },
      {
        id: 'csv-import',
        label: 'Trade Import',
        icon: 'import',
        color: 'var(--text-accent)',
        action: 'openCSVImport',
        visible: true,
        order: 7,
      },
      {
        id: 'quick-import',
        label: 'Quick Import',
        icon: 'import',
        color: 'var(--text-accent)',
        action: 'openQuickTradeImport',
        visible: false,
        order: 8,
      },
      {
        id: 'layout-builder',
        label: 'Layout Builder',
        icon: 'lucide-blocks',
        color: 'var(--text-accent)',
        action: 'openLayoutBuilder',
        visible: true,
        order: 9,
      },
    ],
    quickLinksPosition: 'belowWidgets',
    activeWidgets: ['recentItems', 'yearHeatmap'],
    embeddedNotes: {},
    goals: {},
    topBreakdowns: {},
    positionSizeDefaults: {
      riskPercentage: 1,
      accountBalance: undefined,
      assetType: 'stock',
      lastFuturesSymbol: 'ES',
      lastForexSymbol: 'EURUSD',
    },
    selectedPeriod: 'lifetime',
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
  navigation: {
    enabled: true,
    tabBehavior: 'replaceActiveTab',
    items: [
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
        label: 'Trading Dashboard',
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
        id: 'nav-account-dashboard',
        label: 'Account Dashboard',
        icon: 'users',
        action: 'openAccountDashboard',
        section: 'overview',
        visible: true,
        order: 3,
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
    ],
  },
};

export {};
