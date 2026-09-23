import {
  OptionType,
  type CustomOptionsData,
} from '../services/options/CustomOptionsService';
import type { JournalitSettings } from '../settings/types';
import { DEFAULT_SETTINGS } from '../settings/types';
import { CustomFieldType } from '../types/customFields';
import type { ReviewTemplate } from '../types/reviewV2';
import { CurrencyCode } from '../utils/currencyConfig';
import {
  ACCOUNTS,
  DEMO_CUSTOM_FIELDS_NAMESPACE,
  DEMO_OPTIONS_NAMESPACE,
  DEMO_REVIEW_FIELD_IDS,
  DEMO_TRADE_FIELD_IDS,
  MISTAKES,
  SETUP_NAMES,
  TAGS,
  atZonedTime,
  createSampleAccountMetadata,
  endOfDay,
  type SampleChallengePayoutRecord,
  type SamplePropChallengeConfigs,
  type SampleAccountTimeline,
} from './demoPackCore';
import type { DemoGenerationInputs } from './DemoManifest';

function createTemplates(createdAt: string): ReviewTemplate[] {
  const base = (
    id: string,
    name: string,
    type: ReviewTemplate['type'],
    widgets: ReviewTemplate['widgets']
  ): ReviewTemplate => ({
    id,
    name,
    type,
    version: 1,
    createdAt,
    updatedAt: createdAt,
    isBuiltIn: false,
    widgets,
  });

  return [
    base('sample-drc-review', 'Daily Review', 'drc', [
      { type: 'header', locked: true },
      { type: 'review-context-fields' },
      { type: 'goals', config: { style: 'checkbox' } },
      { type: 'checklist' },
      { type: 'stats' },
      { type: 'trades' },
      { type: 'trade-review' },
      { type: 'pnl-chart' },
      { type: 'markdown-header', config: { level: 2, text: 'Reflection' } },
      { type: 'markdown-zone', id: 'reflection' },
      { type: 'review' },
      { type: 'mark-reviewed' },
    ]),
    base('sample-weekly-review', 'Weekly Review', 'weekly', [
      { type: 'header', locked: true },
      { type: 'review-context-fields' },
      { type: 'stats' },
      { type: 'drawdown-chart' },
      { type: 'trades-chart', config: { period: 'daily' } },
      { type: 'setup-performance' },
      { type: 'demon-tracker' },
      { type: 'weekly-drc-context' },
      {
        type: 'markdown-header',
        config: { level: 2, text: 'Weekly reflection' },
      },
      { type: 'markdown-zone', id: 'weekly-reflection' },
      { type: 'mark-reviewed' },
    ]),
    base('sample-monthly-review', 'Monthly Review', 'monthly', [
      { type: 'header', locked: true },
      { type: 'stats' },
      { type: 'trades-chart', config: { period: 'weekly' } },
      { type: 'setup-performance' },
      { type: 'tag-performance' },
      { type: 'review' },
      {
        type: 'markdown-header',
        config: { level: 2, text: 'Monthly summary' },
      },
      { type: 'markdown-zone', id: 'monthly-summary' },
      { type: 'mark-reviewed' },
    ]),
    base('sample-quarterly-review', 'Quarterly Review', 'quarterly', [
      { type: 'header', locked: true },
      { type: 'stats' },
      { type: 'trades-chart', config: { period: 'monthly' } },
      { type: 'drawdown-chart' },
      { type: 'setup-performance' },
      { type: 'markdown-header', config: { level: 2, text: 'Quarter plan' } },
      { type: 'markdown-zone', id: 'quarter-plan' },
      { type: 'mark-reviewed' },
    ]),
    base('sample-yearly-review', 'Yearly Review', 'yearly', [
      { type: 'header', locked: true },
      { type: 'stats' },
      { type: 'trades-chart', config: { period: 'quarterly' } },
      { type: 'drawdown-chart' },
      { type: 'setup-performance' },
      {
        type: 'markdown-header',
        config: { level: 2, text: 'Lessons and plan' },
      },
      { type: 'markdown-zone', id: 'year-plan' },
      { type: 'mark-reviewed' },
    ]),
  ];
}

function createOptions(): CustomOptionsData {
  return {
    [OptionType.INSTRUMENT]: [
      {
        name: 'MES',
        assetType: 'futures',
        currency: CurrencyCode.USD,
        futuresData: { dollarPerPoint: 5, tickSize: 0.25, tickValue: 1.25 },
      },
      {
        name: 'MNQ',
        assetType: 'futures',
        currency: CurrencyCode.USD,
        futuresData: { dollarPerPoint: 2, tickSize: 0.25, tickValue: 0.5 },
      },
      { name: 'AAPL', assetType: 'stock', currency: CurrencyCode.USD },
      { name: 'MSFT', assetType: 'stock', currency: CurrencyCode.USD },
    ],
    [OptionType.ACCOUNT]: [...ACCOUNTS],
    
    
    
    [OptionType.ACCOUNT_TYPE]: ['Demo', 'Evaluation', 'Funded'],
    [OptionType.SETUP]: [...SETUP_NAMES],
    [OptionType.MISTAKE]: [...MISTAKES],
    [OptionType.TAG]: [...TAGS],
    [OptionType.EVENT]: [
      {
        name: 'Illustrative policy announcement',
        color: 'gray',
        notes: 'Synthetic event used only to demonstrate review context.',
      },
    ],
    tagColors: {},
  };
}

export function createSampleSettings(options: {
  root: string;
  inputs: DemoGenerationInputs;
  latestSession: Date;
  recentRangeStart: Date;
  accountTimeline: SampleAccountTimeline;
  challenges: SamplePropChallengeConfigs;
  challengePayouts?: readonly SampleChallengePayoutRecord[];
}): Partial<JournalitSettings> {
  const settings = structuredClone(DEFAULT_SETTINGS);
  const createdAt = options.inputs.anchorInstant;
  const templates = createTemplates(createdAt);
  const startHerePath = `${options.root}/Start Here.md`;
  const embeddedNoteId = 'embeddedNote-sample-start';
  const streakId = 'currentStreak-sample-review';
  const goalId = 'goalsProgress-sample-monthly';
  const leaderboardId = 'setupLeaderboard-sample-setups';

  settings.trade.autoOpenCreatedTrades = false;
  settings.trade.skipWeekends = true;
  settings.trade.weekStartDay = options.inputs.weekStartDay;
  const tradeFormLayout =
    settings.trade.tradeFormLayout ??
    structuredClone(DEFAULT_SETTINGS.trade.tradeFormLayout!);
  tradeFormLayout.visibleItems = [
    'assetSpecific',
    'tradingCosts',
    'riskPlanning',
    'takeProfits',
    'maeMfe',
    'setup',
    'mistake',
    'customTags',
    'thesis',
    'attachments',
    'customFields',
  ];
  settings.trade.tradeFormLayout = tradeFormLayout;
  settings.general = {
    ...settings.general!,
    journalFolderPath: options.root,
  };
  settings.reviews = { globalAutoCreate: false };
  settings.drc.recurringGoals = [
    'Wait for confirmation before entry',
    'Record the reason for every discretionary change',
  ];
  settings.drc.checklistItems = [
    'Review key levels',
    'Confirm risk and invalidation',
    'Check the session plan',
  ];
  settings.weekly.recurringGoals = ['Complete the planned daily reflections'];
  settings.weekly.checklistItems = [
    'Review every trading day',
    'Choose one process focus',
  ];

  settings.account = {
    ...settings.account!,
    excludedAccountTypes: [],
    accountMetadata: createSampleAccountMetadata(
      options.accountTimeline,
      options.latestSession,
      new Date(createdAt),
      options.inputs.timezone,
      options.challenges,
      options.challengePayouts
    ),
  };

  settings.reviewV2 = {
    ...settings.reviewV2!,
    templates,
  };
  settings.templates = {
    ...settings.templates!,
    defaultDrc: 'sample-drc-review',
    defaultWeekly: 'sample-weekly-review',
    defaultMonthly: 'sample-monthly-review',
    defaultQuarterly: 'sample-quarterly-review',
    defaultYearly: 'sample-yearly-review',
  };
  settings.dashboard = {
    layouts: {
      'Performance Overview': {
        topSection: [
          'netPnL',
          'numTrades',
          'winRate',
          'profitFactor',
          'avgRRRiskBased',
          'maxDrawdown',
        ],
        bottomSection: {
          lg: [
            { i: 'pnlChart', x: 0, y: 0, w: 7, h: 7 },
            { i: 'performanceCalendar', x: 7, y: 0, w: 5, h: 7 },
            { i: 'setupPerformance', x: 0, y: 7, w: 5, h: 7 },
            { i: 'drawdownChart', x: 5, y: 7, w: 5, h: 7 },
            { i: 'recentTrades', x: 10, y: 7, w: 2, h: 7 },
          ],
          md: [
            { i: 'pnlChart', x: 0, y: 0, w: 6, h: 6 },
            { i: 'performanceCalendar', x: 0, y: 6, w: 6, h: 5 },
            { i: 'setupPerformance', x: 0, y: 11, w: 3, h: 6 },
            { i: 'drawdownChart', x: 3, y: 11, w: 3, h: 6 },
            { i: 'recentTrades', x: 0, y: 17, w: 6, h: 5 },
          ],
          sm: [
            { i: 'pnlChart', x: 0, y: 0, w: 4, h: 6 },
            { i: 'performanceCalendar', x: 0, y: 6, w: 4, h: 5 },
            { i: 'setupPerformance', x: 0, y: 11, w: 2, h: 6 },
            { i: 'drawdownChart', x: 2, y: 11, w: 2, h: 6 },
            { i: 'recentTrades', x: 0, y: 17, w: 4, h: 5 },
          ],
          xs: [
            { i: 'pnlChart', x: 0, y: 0, w: 2, h: 6 },
            { i: 'performanceCalendar', x: 0, y: 6, w: 2, h: 5 },
            { i: 'setupPerformance', x: 0, y: 11, w: 2, h: 6 },
            { i: 'drawdownChart', x: 0, y: 17, w: 2, h: 6 },
            { i: 'recentTrades', x: 0, y: 23, w: 2, h: 5 },
          ],
          xxs: [
            { i: 'pnlChart', x: 0, y: 0, w: 1, h: 6 },
            { i: 'performanceCalendar', x: 0, y: 6, w: 1, h: 6 },
            { i: 'setupPerformance', x: 0, y: 12, w: 1, h: 6 },
            { i: 'drawdownChart', x: 0, y: 18, w: 1, h: 6 },
            { i: 'recentTrades', x: 0, y: 24, w: 1, h: 5 },
          ],
        },
      },
    },
    activeLayout: 'Performance Overview',
    weekdayPerformanceMetric: 'net',
    tickerPerformanceMetric: 'net',
    tickerPerformanceViewMode: 'bestAndWorst',
    setupPerformanceMetric: 'net',
    setupPerformanceViewMode: 'bestAndWorst',
    tagPerformanceMetric: 'net',
    tagPerformanceViewMode: 'bestAndWorst',
    defaultFilters: {
      dateRange: [
        atZonedTime(options.recentRangeStart, options.inputs.timezone, 0, 0),
        endOfDay(options.latestSession, options.inputs.timezone),
      ],
      accounts: [],
      
      
      accountPhases: [],
      tickers: [],
      setups: [],
      tags: [],
      mistakes: [],
      tradeTypes: ['regular'],
      statuses: [],
      reviewStatus: [],
      directions: [],
      customFieldFilters: {},
      imageAnnotationStatus: [],
      imageTags: [],
    },
  };
  settings.home = {
    ...settings.home!,
    layouts: {
      'Daily Routine': {
        lg: [
          { i: 'weeklySummary', x: 0, y: 0, w: 6, h: 6 },
          { i: 'unreviewedTrades', x: 6, y: 0, w: 3, h: 2 },
          { i: streakId, x: 9, y: 0, w: 3, h: 4 },
          { i: goalId, x: 6, y: 2, w: 3, h: 5 },
          { i: leaderboardId, x: 9, y: 4, w: 3, h: 6 },
          { i: 'yearHeatmap', x: 0, y: 6, w: 6, h: 5 },
          { i: embeddedNoteId, x: 6, y: 10, w: 6, h: 6 },
        ],
        md: [
          { i: 'weeklySummary', x: 0, y: 0, w: 6, h: 6 },
          { i: 'unreviewedTrades', x: 0, y: 6, w: 3, h: 2 },
          { i: streakId, x: 3, y: 6, w: 3, h: 4 },
          { i: goalId, x: 0, y: 10, w: 3, h: 5 },
          { i: leaderboardId, x: 3, y: 10, w: 3, h: 6 },
          { i: 'yearHeatmap', x: 0, y: 16, w: 6, h: 5 },
          { i: embeddedNoteId, x: 0, y: 21, w: 6, h: 6 },
        ],
        sm: [
          { i: 'weeklySummary', x: 0, y: 0, w: 4, h: 6 },
          { i: 'unreviewedTrades', x: 0, y: 6, w: 2, h: 2 },
          { i: streakId, x: 2, y: 6, w: 2, h: 4 },
          { i: goalId, x: 0, y: 10, w: 2, h: 5 },
          { i: leaderboardId, x: 2, y: 10, w: 2, h: 6 },
          { i: 'yearHeatmap', x: 0, y: 16, w: 4, h: 5 },
          { i: embeddedNoteId, x: 0, y: 21, w: 4, h: 6 },
        ],
        xs: [
          { i: 'weeklySummary', x: 0, y: 0, w: 2, h: 6 },
          { i: 'unreviewedTrades', x: 0, y: 6, w: 2, h: 2 },
          { i: streakId, x: 0, y: 8, w: 2, h: 4 },
          { i: goalId, x: 0, y: 12, w: 2, h: 5 },
          { i: leaderboardId, x: 0, y: 17, w: 2, h: 6 },
          { i: 'yearHeatmap', x: 0, y: 23, w: 2, h: 5 },
          { i: embeddedNoteId, x: 0, y: 28, w: 2, h: 6 },
        ],
        xxs: [
          { i: 'weeklySummary', x: 0, y: 0, w: 1, h: 6 },
          { i: 'unreviewedTrades', x: 0, y: 6, w: 1, h: 2 },
          { i: streakId, x: 0, y: 8, w: 1, h: 4 },
          { i: goalId, x: 0, y: 12, w: 1, h: 5 },
          { i: leaderboardId, x: 0, y: 17, w: 1, h: 6 },
          { i: 'yearHeatmap', x: 0, y: 23, w: 1, h: 5 },
          { i: embeddedNoteId, x: 0, y: 28, w: 1, h: 6 },
        ],
      },
    },
    activeLayout: 'Daily Routine',
    activeWidgets: [
      'weeklySummary',
      'unreviewedTrades',
      streakId,
      goalId,
      leaderboardId,
      'yearHeatmap',
      embeddedNoteId,
    ],
    embeddedNotes: {
      [embeddedNoteId]: { filePath: startHerePath, title: 'Start Here' },
    },
    streaks: {
      [streakId]: { kind: 'drc-review', createdAt },
    },
    goals: {
      [goalId]: {
        type: 'tradesJournaled',
        target: 45,
        period: 'monthly',
        createdAt,
      },
    },
    topBreakdowns: {
      [leaderboardId]: {
        dimension: 'setups',
        valueMode: 'currency',
        createdAt,
      },
    },
    selectedPeriod: 'lifetime',
    recentItems: [],
  };
  settings.customReviewFields = {
    groups: [
      {
        id: 'sample-review-preparation',
        name: 'Preparation',
        order: 0,
      },
    ],
    fields: [
      {
        id: DEMO_REVIEW_FIELD_IDS.tradingFocus,
        label: 'Trading Focus',
        fieldKey: 'trading_focus',
        type: CustomFieldType.TEXT,
        order: 0,
        groupId: 'sample-review-preparation',
        scope: {
          reviewTypes: ['monthly', 'weekly', 'drc'],
          editableOn: ['monthly', 'weekly', 'drc'],
          inheritTo: ['weekly', 'drc'],
        },
        inheritance: {
          enabled: true,
          sources: ['monthly', 'weekly'],
          mode: 'inherit-and-local',
          showSourceLabels: true,
          hideWhenEmpty: false,
        },
        display: { order: 0, compact: false },
      },
      {
        id: DEMO_REVIEW_FIELD_IDS.energyLevel,
        label: 'Energy Level',
        fieldKey: 'energy_level',
        type: CustomFieldType.NUMBER,
        validation: { min: 1, max: 5 },
        order: 1,
        groupId: 'sample-review-preparation',
        scope: {
          reviewTypes: ['drc'],
          editableOn: ['drc'],
          inheritTo: [],
        },
        inheritance: {
          enabled: false,
          sources: [],
          mode: 'local-only',
          showSourceLabels: false,
          hideWhenEmpty: false,
        },
        display: { order: 1, compact: true },
      },
    ],
  };
  settings.economicCalendar = {
    ...settings.economicCalendar!,
    autoImport: false,
  };

  const scoped: Partial<JournalitSettings> = {};
  for (const key of [
    'trade',
    'tradeLog',
    'reviewV2',
    'templates',
    'drc',
    'weekly',
    'monthly',
    'quarterly',
    'yearly',
    'reviews',
    'dashboard',
    'home',
    'viewFilters',
    'customReviewFields',
    'customReviewFieldOptions',
    'account',
    'initializedOptionTypes',
    'symbolMappings',
    'copyTradeAdjustments',
    'economicCalendar',
    'general',
  ]) {
    scoped[key] = settings[key];
  }
  scoped[`customOptions_${DEMO_OPTIONS_NAMESPACE}`] = createOptions();
  scoped[`customTradeFields_${DEMO_CUSTOM_FIELDS_NAMESPACE}`] = {
    fields: [
      {
        id: DEMO_TRADE_FIELD_IDS.planAdherence,
        label: 'Plan Adherence',
        fieldKey: 'plan_adherence',
        type: CustomFieldType.DROPDOWN,
        options: [
          { value: 'Followed', label: 'Followed' },
          { value: 'Deviated', label: 'Deviated' },
        ],
        allowCreateOptions: false,
        tradeLog: { columnLabel: 'Plan', dropdownSortMode: 'option-order' },
        order: 0,
      },
      {
        id: DEMO_TRADE_FIELD_IDS.confidence,
        label: 'Confidence',
        fieldKey: 'confidence',
        type: CustomFieldType.NUMBER,
        validation: { min: 1, max: 5 },
        order: 1,
      },
      {
        id: DEMO_TRADE_FIELD_IDS.confluence,
        label: 'Confluence',
        fieldKey: 'confluence',
        type: CustomFieldType.MULTISELECT,
        options: [
          { value: 'Prior Level', label: 'Prior Level' },
          { value: 'Opening Range', label: 'Opening Range' },
          {
            value: 'Higher-Timeframe Alignment',
            label: 'Higher-Timeframe Alignment',
          },
        ],
        allowCreateOptions: false,
        order: 2,
      },
      {
        id: DEMO_TRADE_FIELD_IDS.catalystNotes,
        label: 'Catalyst Notes',
        fieldKey: 'catalyst_notes',
        type: CustomFieldType.TEXT,
        validation: { maxLength: 240 },
        order: 3,
      },
    ],
  };
  scoped[`customFieldOptions_${DEMO_CUSTOM_FIELDS_NAMESPACE}`] = {};
  return scoped;
}
