import { logger } from '../../utils/logger';


import { App, TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import type { UnifiedFilters } from '../../components/shared/filters/types';
import { applyTradeFilters } from '../../components/shared/filters/filterUtils';
import {
  createTradingDayFromString,
  getTradingDay,
  getTradingDayRange,
} from '../../utils/tradingDayUtils';
import {
  formatLocalDateString,
  parseLocalDateSafe,
  parseTradeTimestampValue,
} from '../../utils/dateUtils';
import { aggregatePnLByCurrency } from '../../utils/currencyAggregation';
import { ExchangeRateService } from '../exchangeRate/ExchangeRateService';
import { eventBus } from '../events';
import type {
  Unsubscribe,
  TradeChangedPayload,
  BacktestTradeChangedPayload,
  MissedTradeChangedPayload,
  FilterChangedPayload,
  ReviewChangedPayload,
  ReviewFilterSyncPayload,
  SettingsChangedPayload,
} from '../events/types';
import type { PartialTradeFrontmatter } from '../../types/TradeFrontmatter';
import type { CustomFieldDefinition } from '../../types/customFields';
import type { TradeReviewData } from '../backend/types';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsTradingDay,
  getTradeRealizedPnlEvents,
} from '../../utils/tradeAnalyticsDate';
import { parseTradeReviewMarkdown } from '../trade/core/TradeReviewMarkdownCodec';
import { extractUserOwnedTradeNotes } from '../trade/core/TradeNoteDocumentCodec';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import { normalizeTradeExecutionForPeriodAnalytics } from '../trade/core/TradeExecutionAnalytics';
import { resolveSessionModeWindowsForDate } from '../../utils/sessionModePhase';
import type { ResolvedSessionModeWindow } from '../../types/sessionMode';
import { normalizeReviewFilters } from '../../settings/viewFiltersDefaults';
import {
  attachBreakEvenAccountBalancesToTrade,
  fetchBreakEvenAccountBalanceLookup,
  type BreakEvenAccountBalanceLookup,
} from '../trade/core/BreakEvenAccountBalance';
import {
  getCopyTradingPeriodForEntryDate,
  isCopyTradingBaseEligible,
} from '../../utils/accountCopyTrading';
import {
  calculateCopiedTradePnL,
  scaleCopiedTradeExecutionFields,
} from '../../utils/copyTradePnL';
import { safeString } from '../../utils/safeString';
import {
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from '../trade/core/TradeAccountIdentity';

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;

const getStringValue = (
  record: Record<string, unknown>,
  key: string
): string | undefined => {
  const value = record[key];
  return typeof value === 'string' ||
    typeof value === 'number' ||
    value instanceof Date
    ? String(value)
    : undefined;
};

const getNumberValue = (
  record: Record<string, unknown>,
  key: string
): number | undefined => {
  const value = record[key];
  return typeof value === 'number' ? value : undefined;
};

const isReviewNoteType = (
  value: unknown
): value is CachedReviewData['noteType'] => {
  switch (value) {
    case 'drc':
    case 'weekly-review':
    case 'monthly-review':
    case 'quarterly-review':
    case 'yearly-review':
    case 'trade':
      return true;
    default:
      return false;
  }
};

const isAutoPopulatedReviewNoteType = (value: unknown): boolean => {
  switch (value) {
    case 'drc':
    case 'weekly-review':
    case 'monthly-review':
    case 'quarterly-review':
    case 'yearly-review':
      return true;
    default:
      return false;
  }
};


export interface CachedReviewData {
  
  frontmatter: Record<string, unknown>;
  
  noteType:
    | 'drc'
    | 'weekly-review'
    | 'monthly-review'
    | 'quarterly-review'
    | 'yearly-review'
    | 'trade';
  
  dateRange: { start: Date; end: Date };
  
  tradingDayStr?: string;
  
  filters: UnifiedFilters;
  

  allTrades?: unknown[];
  

  executionBasisTrades?: unknown[];
  

  analyticsBasisTrades?: unknown[];
  

  trades: unknown[];
  
  sessionMistakesByTradingDay: Record<string, string[]>;
  
  currencyConversion?: {
    isMultiCurrency: boolean;
    conversionBaseCurrency?: string;
    conversionRateDate?: string;
    originalByCurrency?: Record<string, number>;
    convertedByCurrency?: Record<string, number>;
    unconvertedCurrencies?: string[];
    unconvertedTrades?: Array<Record<string, unknown>>;
    originalTradeCount?: number;
    convertedTradeCount?: number;
    brokerBaseCurrencyTradeCount?: number;
  };
  
  version: number;
  
  populatedAt: number;
}


type CacheSubscriber = (data: CachedReviewData | null) => void;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const getLocalDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function getSessionWindowsForTradingDay(
  tradingDay: Date,
  plugin: JournalitPlugin
): ResolvedSessionModeWindow[] {
  const previousDate = new Date(tradingDay);
  previousDate.setDate(previousDate.getDate() - 1);
  const tradingDayKey = getLocalDateKey(tradingDay);
  const windows = [
    ...resolveSessionModeWindowsForDate(
      previousDate,
      plugin.settings.sessionMode.sessionWindows
    ),
    ...resolveSessionModeWindowsForDate(
      tradingDay,
      plugin.settings.sessionMode.sessionWindows
    ),
  ];
  const seen = new Set<string>();
  return windows.filter((window) => {
    if (
      getLocalDateKey(getTradingDay(window.start, plugin)) !== tradingDayKey
    ) {
      return false;
    }
    const key = `${window.id}:${window.start.getTime()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getPayloadTradeFilePaths(payload: TradeChangedPayload): string[] {
  if (typeof payload.filePath === 'string') return [payload.filePath];
  return payload.filePaths ?? [];
}

function cachedReviewIncludesTradePath(
  cached: CachedReviewData,
  tradeFilePath: string
): boolean {
  return (
    tradeArrayIncludesPath(cached.allTrades, tradeFilePath) ||
    tradeArrayIncludesPath(cached.analyticsBasisTrades, tradeFilePath) ||
    tradeArrayIncludesPath(cached.trades, tradeFilePath)
  );
}

function tradeArrayIncludesPath(
  trades: unknown[] | undefined,
  tradeFilePath: string
): boolean {
  return (
    trades?.some((trade) => isRecord(trade) && trade.path === tradeFilePath) ??
    false
  );
}

function patchMarkdownTradeContextInArray(
  trades: unknown[] | undefined,
  tradeFilePath: string,
  context: { review: unknown; notes: string | undefined }
): unknown[] | undefined {
  if (!trades) return undefined;

  let changed = false;
  const nextTrades = trades.map((trade) => {
    if (!isRecord(trade) || trade.path !== tradeFilePath) return trade;
    changed = true;
    const nextTrade = { ...trade };
    if (context.review) {
      nextTrade.tradeReview = context.review;
    } else {
      delete nextTrade.tradeReview;
    }
    if (context.notes) {
      nextTrade.notes = context.notes;
    } else {
      delete nextTrade.notes;
    }
    return nextTrade;
  });

  return changed ? nextTrades : trades;
}

function patchMarkdownTradeContextInRequiredArray(
  trades: unknown[],
  tradeFilePath: string,
  context: { review: unknown; notes: string | undefined }
): unknown[] {
  return (
    patchMarkdownTradeContextInArray(trades, tradeFilePath, context) ?? trades
  );
}

const REVIEW_TRADE_PROPERTY_KEYS = new Set<string>([
  'path',
  'entryTime',
  'exitTime',
  'entryPrice',
  'exitPrice',
  'positionSize',
  'direction',
  'pnl',
  'tradeStatus',
  'useDirectPnLInput',
  'exits',
  'entries',
  '_originalPnlWasNull',
  'instrument',
  'setup',
  'mistake',
  'account',

  'commission',
  'swap',
  'fees',
  'tags',
  'customTags',
  'assetType',
  'optionType',
  'stopLoss',
  'riskAmount',
  'rMultiple',
  'currency',
  'originalCurrency',
  'originalPnlBeforeConversion',
  'mae',
  'mfe',
  'maePrice',
  'mfePrice',
  'tradeId',
  'schemaVersion',
  'backendTradeId',
  'isMissedTrade',
  'isBacktestTrade',
  'reviewed',
  'customFields',
  'breakEvenAccountCurrentBalance',
  'breakEvenAccountCurrentBalanceTotal',
]);

function enrichTradeWithCustomFields(
  trade: PartialTradeFrontmatter & Record<string, unknown>,
  customFieldDefinitions: CustomFieldDefinition[],
  app: App
): PartialTradeFrontmatter & Record<string, unknown> {
  const tradePath = typeof trade.path === 'string' ? trade.path : undefined;
  if (!tradePath || customFieldDefinitions.length === 0) {
    return trade;
  }

  const file = app.vault.getAbstractFileByPath(tradePath);
  if (!(file instanceof TFile)) {
    return trade;
  }

  const frontmatter = asRecord(
    app.metadataCache.getFileCache(file)?.frontmatter
  );
  if (!frontmatter) {
    return trade;
  }

  const customFields = customFieldDefinitions.reduce<Record<string, unknown>>(
    (acc, field) => {
      const nestedValue = asRecord(frontmatter.customFields)?.[field.id];
      const rootValue =
        field.fieldKey && frontmatter[field.fieldKey] !== undefined
          ? frontmatter[field.fieldKey]
          : undefined;
      const value = nestedValue !== undefined ? nestedValue : rootValue;

      if (value !== undefined) {
        acc[field.id] = value;
      }

      return acc;
    },
    {}
  );

  return {
    ...trade,
    ...(Object.keys(customFields).length > 0 ? { customFields } : {}),
    ...Object.fromEntries(
      customFieldDefinitions.flatMap((field) => {
        if (
          !field.fieldKey ||
          frontmatter[field.fieldKey] === undefined ||
          REVIEW_TRADE_PROPERTY_KEYS.has(field.fieldKey)
        ) {
          return [];
        }

        return [[field.fieldKey, frontmatter[field.fieldKey]]];
      })
    ),
  };
}


interface PendingPopulation {
  promise: Promise<void>;
  timestamp: number;
}


export class ReviewDataCache {
  private app: App;
  private plugin: JournalitPlugin;

  
  private cache: Map<string, CachedReviewData> = new Map();

  
  private subscribers: Map<string, Set<CacheSubscriber>> = new Map();

  
  private pendingPopulations: Map<string, PendingPopulation> = new Map();

  
  private pendingFilterOverrides: Map<string, UnifiedFilters> = new Map();

  
  private populateDebounceTimers: Map<string, number> = new Map();

  
  private static readonly POPULATE_DEBOUNCE_MS = 150;

  
  private static readonly CACHE_TTL_MS = 10 * 60 * 1000;

  
  private static readonly SESSION_MISTAKES_INDEX_TTL_MS = 10 * 1000;

  
  private sessionMistakesIndex: Record<string, string[]> | null = null;

  
  private sessionMistakesTradingDayByFile: Record<string, string> | null = null;

  
  private sessionMistakesIndexBuiltAt = 0;

  
  private drcAggregationFingerprintByFile: Map<string, string> = new Map();

  
  private sessionVisibleReviewedTradePathsByReview: Map<string, Set<string>> =
    new Map();

  
  private markdownTradeReviewByPath: Map<
    string,
    {
      mtime: number;
      review: TradeReviewData | undefined;
      notes: string | undefined;
    }
  > = new Map();

  
  private eventCleanup: Unsubscribe[] = [];

  
  private debugEnabled = false;

  
  private exchangeRateService: ExchangeRateService;

  constructor(app: App, plugin: JournalitPlugin) {
    this.app = app;
    this.plugin = plugin;
    this.exchangeRateService = new ExchangeRateService(this.plugin);

    this.setupEventListeners();
    this.setupFileOpenListener();
    this.startCleanupInterval();
  }

  
  public setDebug(enabled: boolean): void {
    this.debugEnabled = enabled;
  }

  private log(...args: unknown[]): void {
    if (this.debugEnabled) {
      logger.debug('[ReviewDataCache]', ...args);
    }
  }

  public async prepareTradesForReviewFilters(
    trades: Array<Record<string, unknown>>,
    filters: UnifiedFilters
  ): Promise<Array<Record<string, unknown>>> {
    const customFieldDefinitions =
      this.plugin.customFieldsService?.getFields() || [];

    let scopedTrades = trades.map((trade) =>
      enrichTradeWithCustomFields(
        trade as PartialTradeFrontmatter & Record<string, unknown>,
        customFieldDefinitions,
        this.app
      )
    );

    scopedTrades = this.expandCopiedTradesForReviewFilters(
      scopedTrades,
      filters.accounts
    );

    const breakEvenThresholdMode =
      this.plugin.settings?.trade?.breakEvenThresholdMode ?? 'fixed';
    if (breakEvenThresholdMode === 'percentage_current_balance') {
      const accountBalanceLookup = await fetchBreakEvenAccountBalanceLookup(
        this.plugin
      );
      scopedTrades = this.attachBreakEvenAccountBalances(
        scopedTrades,
        accountBalanceLookup
      );
    }

    const userCurrency = this.plugin?.settings?.general?.currency || 'USD';
    const currencyGrouped = aggregatePnLByCurrency(scopedTrades, userCurrency);

    if (currencyGrouped.isMultiCurrency) {
      const converted = await this.exchangeRateService.convertTrades(
        scopedTrades,
        userCurrency
      );

      if (converted) {
        scopedTrades = converted.trades;
      }
    }

    return applyTradeFilters(scopedTrades, filters, customFieldDefinitions, {
      resolveAccountIdDisplayName: (accountId) =>
        this.plugin.settings.backendIntegration?.accountMapping?.[accountId],
    });
  }

  private expandCopiedTradesForReviewFilters(
    trades: Array<Record<string, unknown>>,
    requestedAccounts: string[]
  ): Array<Record<string, unknown>> {
    const includeCopyAccountsInAllAccounts =
      this.plugin.settings.trade.includeCopyAccountsInAllAccountsAnalytics ===
      true;
    const requestedAccountLookupKeys = new Set(
      requestedAccounts.map((accountName) =>
        normalizeAccountLookupKey(accountName)
      )
    );

    if (
      !includeCopyAccountsInAllAccounts &&
      requestedAccountLookupKeys.size === 0
    ) {
      return trades;
    }

    return trades.flatMap((trade) => [
      trade,
      ...this.createCopiedReviewTrades(trade, requestedAccountLookupKeys),
    ]);
  }

  private createCopiedReviewTrades(
    baseTrade: Record<string, unknown>,
    requestedAccountLookupKeys: Set<string>
  ): Array<Record<string, unknown>> {
    const entryTime = this.parseTradeEntryDate(baseTrade.entryTime);
    if (!entryTime) {
      return [];
    }

    const baseAccountLookupKeys = new Set(
      normalizeTradeAccountIdentity(baseTrade).lookupKeys
    );
    if (baseAccountLookupKeys.size === 0) {
      return [];
    }

    const copiedTrades: Array<Record<string, unknown>> = [];
    const accountMetadata = this.plugin.settings.account?.accountMetadata ?? {};
    for (const [copyAccountName, copyMetadata] of Object.entries(
      accountMetadata
    )) {
      const copyPeriod = getCopyTradingPeriodForEntryDate(
        copyMetadata,
        entryTime
      );
      if (!copyPeriod) {
        continue;
      }

      const copyAccountLookupKey = normalizeAccountLookupKey(copyAccountName);
      if (
        requestedAccountLookupKeys.size > 0 &&
        !requestedAccountLookupKeys.has(copyAccountLookupKey)
      ) {
        continue;
      }

      if (
        !baseAccountLookupKeys.has(
          normalizeAccountLookupKey(copyPeriod.baseAccount)
        )
      ) {
        continue;
      }

      if (
        !isCopyTradingBaseEligible(
          accountMetadata,
          copyMetadata,
          copyPeriod.baseAccount,
          entryTime,
          this.plugin.settings.general?.currency
        )
      ) {
        continue;
      }

      const copyBaseTradeKey = safeString(
        baseTrade.path ?? baseTrade.tradeId ?? baseTrade.id ?? 'trade'
      );
      const {
        pnl: copiedPnL,
        commission,
        adjustment,
      } = calculateCopiedTradePnL({
        plugin: this.plugin,
        baseTrade: { ...baseTrade, copyBaseTradeKey },
        copyAccountName,
        copyAccountLookupKey,
        multiplier: copyPeriod.multiplier,
      });
      const riskAmount =
        typeof baseTrade.riskAmount === 'number'
          ? baseTrade.riskAmount
          : baseTrade.riskAmount === undefined
            ? undefined
            : Number(baseTrade.riskAmount);
      const copiedRiskAmount =
        riskAmount === undefined
          ? undefined
          : riskAmount * copyPeriod.multiplier;

      const copiedTradeId = `${safeString(baseTrade.tradeId ?? baseTrade.id ?? baseTrade.path ?? 'trade')}::copy::${copyAccountLookupKey}`;

      copiedTrades.push({
        ...baseTrade,
        ...scaleCopiedTradeExecutionFields(baseTrade, copyPeriod.multiplier),
        tradeId: copiedTradeId,
        id: copiedTradeId,
        account: [copyAccountName],
        accountRefs: [
          {
            value: copyAccountName,
            source: 'account',
            lookupKey: copyAccountLookupKey,
          },
        ],
        accountLookupKeys: [copyAccountLookupKey],
        accountNamesNormalized: [copyAccountName],
        pnl: copiedPnL,
        directPnL:
          typeof baseTrade.directPnL === 'number'
            ? baseTrade.directPnL * copyPeriod.multiplier
            : baseTrade.directPnL,
        riskAmount: copiedRiskAmount,
        rMultiple:
          copiedRiskAmount && copiedRiskAmount !== 0
            ? copiedPnL / copiedRiskAmount
            : baseTrade.rMultiple,
        commission: commission ?? 0,
        fees: 0,
        currency: baseTrade.currency ?? copyMetadata.currency,
        isCopiedTrade: true,
        copiedFromAccount: copyPeriod.baseAccount,
        copyMultiplier: copyPeriod.multiplier,
        copyAccountLookupKey,
        copyPnlAdjustment: adjustment,
        copyBaseTradeKey,
      });
    }

    return copiedTrades;
  }

  private parseTradeEntryDate(value: unknown): Date | null {
    if (!value) {
      return null;
    }
    const date = value instanceof Date ? value : new Date(safeString(value));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private attachBreakEvenAccountBalances(
    trades: Array<Record<string, unknown>>,
    accountBalanceLookup: BreakEvenAccountBalanceLookup
  ): Array<Record<string, unknown>> {
    if (accountBalanceLookup.size === 0) {
      return trades;
    }

    return trades.map((trade) =>
      attachBreakEvenAccountBalancesToTrade(trade, accountBalanceLookup, {
        resolveAccountIdDisplayName: (accountId) =>
          this.plugin.settings.backendIntegration?.accountMapping?.[accountId],
      })
    );
  }

  private areFiltersEqual(
    first: UnifiedFilters,
    second: UnifiedFilters
  ): boolean {
    return JSON.stringify(first) === JSON.stringify(second);
  }

  
  private setupEventListeners(): void {
    
    const handleTradeDataChanged = (payload: TradeChangedPayload) => {
      if (payload.action === 'review-status-updated') {
        this.updateTradeReviewStatusInCache(payload);
        return;
      }

      if (payload.action === 'trade-review-updated') {
        for (const filePath of getPayloadTradeFilePaths(payload)) {
          void this.refreshMarkdownTradeReviewInCache(filePath);
        }
        return;
      }

      if (
        payload.action === 'updated' ||
        payload.action === 'created' ||
        payload.action === 'deleted'
      ) {
        
        if (payload.filePath) {
          this.invalidateByTradeChange(payload.filePath);
        } else if (payload.filePaths && payload.filePaths.length > 0) {
          
          for (const filePath of payload.filePaths) {
            this.invalidateByTradeChange(filePath);
          }
        } else {
          
          this.invalidateAll();
        }
      } else if (payload.action === 'batch') {
        
        this.invalidateAll();
      }
    };

    const handleBacktestTradeDataChanged = (
      payload: BacktestTradeChangedPayload
    ) => {
      if (payload.filePath) {
        this.invalidateByTradeChange(payload.filePath);
      } else {
        this.invalidateAll();
      }
    };

    const handleMissedTradeDataChanged = (
      payload: MissedTradeChangedPayload
    ) => {
      if (payload.reviewed !== undefined) {
        this.updateTradeReviewStatusInCache({
          action: 'review-status-updated',
          filePath: payload.filePath,
          reviewed: payload.reviewed,
          reviewedAt: payload.reviewedAt,
        });
        return;
      }

      if (payload.filePath) {
        this.invalidateByTradeChange(payload.filePath);
      } else {
        this.invalidateAll();
      }
    };

    
    const handleFilterChanged = (payload: FilterChangedPayload) => {
      const { filePath, filters } = payload;
      if (!filePath || !filters) {
        return;
      }

      void this.reapplyFilters(filePath, normalizeReviewFilters(filters));
    };

    
    
    
    const handleReviewFilterSync = (payload: ReviewFilterSyncPayload) => {
      const normalizedFilters = normalizeReviewFilters(payload.filters);
      const trackedFilePaths = new Set<string>([
        ...this.cache.keys(),
        ...this.pendingPopulations.keys(),
      ]);

      for (const trackedFilePath of trackedFilePaths) {
        if (trackedFilePath === payload.sourceFilePath) {
          continue;
        }

        void this.reapplyFilters(trackedFilePath, normalizedFilters);
      }
    };

    
    const handleSettingsUpdated = (payload: SettingsChangedPayload) => {
      const isGlobalSettingsChange = payload?.section === 'all';
      const isTradingDayBucketingChange =
        isGlobalSettingsChange ||
        payload?.section === 'trade' ||
        payload?.section === 'copyTradeAdjustments' ||
        payload?.component === 'trade' ||
        payload?.source === 'trading-day-cutoff' ||
        payload?.source === 'week-start';
      const isCurrencyConversionChange =
        isGlobalSettingsChange || payload?.section === 'general';
      const isSessionModeWindowChange =
        isGlobalSettingsChange || payload?.section === 'sessionMode';

      if (
        isTradingDayBucketingChange ||
        isCurrencyConversionChange ||
        isSessionModeWindowChange
      ) {
        
        
        this.invalidateSessionMistakesIndex();

        const cachedFilePaths = Array.from(this.cache.keys());
        for (const cachedFilePath of cachedFilePaths) {
          this.populateDebounced(cachedFilePath);
        }
      }

      
      
      this.notifyAllSubscribers();
    };

    
    const handleReviewChanged = (payload: ReviewChangedPayload) => {
      
      
      
      if (payload.source === 'review-widget:grades') {
        return;
      }

      if (payload.type !== 'drc') {
        return;
      }

      if (
        payload.action !== 'updated' &&
        payload.action !== 'created' &&
        payload.action !== 'deleted'
      ) {
        return;
      }

      if (!payload.filePath) {
        this.invalidateAll();
        return;
      }

      const previousSessionTradingDayStr =
        this.getSessionMistakesTradingDayForFile(payload.filePath);

      
      this.invalidateSessionMistakesIndex();
      this.invalidateByDRCReviewChange(
        payload.filePath,
        previousSessionTradingDayStr
      );
    };

    
    const handleMetadataChanged = (file: TFile) => {
      const frontmatter =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (frontmatter?.type === 'drc') {
        const newFingerprint = this.getDRCAggregationFingerprint(frontmatter);
        const previousFingerprint = this.drcAggregationFingerprintByFile.get(
          file.path
        );

        if (newFingerprint !== null) {
          this.drcAggregationFingerprintByFile.set(file.path, newFingerprint);
        }

        
        
        if (
          newFingerprint !== null &&
          previousFingerprint !== undefined &&
          previousFingerprint === newFingerprint
        ) {
          if (this.cache.has(file.path)) {
            this.populateDebounced(file.path);
          }
          return;
        }

        const previousSessionTradingDayStr =
          this.getTradingDayFromDRCFingerprint(previousFingerprint) ??
          this.getSessionMistakesTradingDayForFile(file.path);

        this.invalidateSessionMistakesIndex();
        
        
        this.invalidateByDRCReviewChange(
          file.path,
          previousSessionTradingDayStr
        );
        return;
      }

      this.drcAggregationFingerprintByFile.delete(file.path);

      if (this.hasCachedTradePath(file.path)) {
        void this.refreshMarkdownTradeReviewInCache(file.path);
        return;
      }

      if (this.cache.has(file.path)) {
        
        this.populateDebounced(file.path);
      }
    };

    
    this.eventCleanup.push(
      eventBus.subscribe('trade:changed', handleTradeDataChanged),
      eventBus.subscribe(
        'backtest-trade:changed',
        handleBacktestTradeDataChanged
      ),
      eventBus.subscribe('missed-trade:changed', handleMissedTradeDataChanged),
      eventBus.subscribe('account:changed', () => {
        this.invalidateAll();
      }),
      eventBus.subscribe('filter:changed', handleFilterChanged),
      eventBus.subscribe('review:filter-sync', handleReviewFilterSync),
      eventBus.subscribe('settings:changed', handleSettingsUpdated),
      eventBus.subscribe('review:changed', handleReviewChanged)
    );

    if (typeof window !== 'undefined') {
      const handleCurrencyChanged = () => {
        this.invalidateAll();
      };
      window.addEventListener(
        'journalit-currency-changed',
        handleCurrencyChanged
      );
      this.eventCleanup.push(() => {
        window.removeEventListener(
          'journalit-currency-changed',
          handleCurrencyChanged
        );
      });
    }

    
    this.plugin.registerEvent(
      this.app.metadataCache.on('changed', handleMetadataChanged)
    );
    if (typeof this.app.vault.on === 'function') {
      this.plugin.registerEvent(
        this.app.vault.on('modify', (file) => {
          if (file instanceof TFile && this.hasCachedTradePath(file.path)) {
            void this.refreshMarkdownTradeReviewInCache(file.path);
          }
        })
      );
    }
  }

  
  private setupFileOpenListener(): void {
    const handleFileOpen = (file: TFile | null) => {
      if (!file) return;

      
      const cache = this.app.metadataCache.getFileCache(file);
      const type: unknown = cache?.frontmatter?.type;

      if (isAutoPopulatedReviewNoteType(type)) {
        
        if (!this.cache.has(file.path)) {
          this.log('Pre-populating on file open:', file.path);
          void this.populate(file.path);
        }
      }
    };

    this.plugin.registerEvent(
      this.app.workspace.on('file-open', handleFileOpen)
    );
  }

  
  private startCleanupInterval(): void {
    
    const intervalId = window.setInterval(
      () => {
        this.cleanupStaleEntries();
      },
      5 * 60 * 1000
    );

    
    this.eventCleanup.push(() => {
      window.clearInterval(intervalId);
    });
  }

  
  private cleanupStaleEntries(): void {
    const now = Date.now();
    let removed = 0;

    for (const [filePath, entry] of this.cache.entries()) {
      const age = now - entry.populatedAt;
      const hasSubscribers =
        this.subscribers.has(filePath) &&
        this.subscribers.get(filePath)!.size > 0;

      
      if (age > ReviewDataCache.CACHE_TTL_MS && !hasSubscribers) {
        this.cache.delete(filePath);
        removed++;
      }
    }

    if (removed > 0) {
      this.log(`Cleaned up ${removed} stale cache entries`);
    }
  }

  
  public get(filePath: string): CachedReviewData | null {
    const entry = this.cache.get(filePath);
    if (entry) {
      this.log('Cache hit:', filePath);
    } else {
      this.log('Cache miss:', filePath);
    }
    return entry || null;
  }

  
  public has(filePath: string): boolean {
    return this.cache.has(filePath);
  }

  
  public async populate(
    filePath: string,
    filtersOverride?: UnifiedFilters
  ): Promise<void> {
    const normalizedOverride = filtersOverride
      ? normalizeReviewFilters(filtersOverride)
      : undefined;

    
    const pending = this.pendingPopulations.get(filePath);
    if (pending) {
      if (normalizedOverride) {
        this.pendingFilterOverrides.set(filePath, normalizedOverride);
      }

      this.log('Returning existing population promise:', filePath);
      await pending.promise;

      const queuedOverride = this.pendingFilterOverrides.get(filePath);
      if (queuedOverride) {
        this.pendingFilterOverrides.delete(filePath);

        const cached = this.cache.get(filePath);
        if (!cached || !this.areFiltersEqual(cached.filters, queuedOverride)) {
          await this.populate(filePath, queuedOverride);
        }
      }

      return;
    }

    this.log('Starting population:', filePath);
    const promise = this.doPopulate(filePath, normalizedOverride);
    this.pendingPopulations.set(filePath, { promise, timestamp: Date.now() });

    try {
      await promise;
      this.log('Population complete:', filePath);
    } finally {
      this.pendingPopulations.delete(filePath);
    }
  }

  
  public populateDebounced(filePath: string): void {
    
    const existingTimer = this.populateDebounceTimers.get(filePath);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    
    const timer = window.setTimeout(() => {
      this.populateDebounceTimers.delete(filePath);
      void this.populate(filePath);
    }, ReviewDataCache.POPULATE_DEBOUNCE_MS);

    this.populateDebounceTimers.set(filePath, timer);
  }

  public setSessionReviewedTradeVisibility(
    reviewFilePath: string,
    tradeFilePath: string,
    keepVisible: boolean
  ): void {
    const nextPaths = new Set(
      this.sessionVisibleReviewedTradePathsByReview.get(reviewFilePath) ?? []
    );

    if (keepVisible) {
      nextPaths.add(tradeFilePath);
    } else {
      nextPaths.delete(tradeFilePath);
    }

    if (nextPaths.size === 0) {
      this.sessionVisibleReviewedTradePathsByReview.delete(reviewFilePath);
    } else {
      this.sessionVisibleReviewedTradePathsByReview.set(
        reviewFilePath,
        nextPaths
      );
    }

    const cached = this.cache.get(reviewFilePath);
    if (!cached) return;

    const nextCached = this.applySessionVisibilityToCachedData(
      cached,
      reviewFilePath
    );
    this.cache.set(reviewFilePath, nextCached);
    this.notifySubscribers(reviewFilePath, nextCached);
  }

  public async attachMarkdownTradeReviews<T extends Record<string, unknown>>(
    trades: T[]
  ): Promise<T[]> {
    return Promise.all(
      trades.map(async (trade) => {
        if (typeof trade.path !== 'string') return trade;
        const file = this.app.vault.getAbstractFileByPath(trade.path);
        if (!(file instanceof TFile)) return trade;
        const context = await this.readMarkdownTradeReviewContext(file);
        const nextTrade: T & {
          tradeReview?: TradeReviewData;
          notes?: string;
        } = { ...trade };
        if (context.review) {
          nextTrade.tradeReview = context.review;
        }
        if (context.notes) {
          nextTrade.notes = context.notes;
        }
        return nextTrade;
      })
    );
  }

  private async readMarkdownTradeReviewContext(file: TFile): Promise<{
    review: TradeReviewData | undefined;
    notes: string | undefined;
  }> {
    const cached = this.markdownTradeReviewByPath.get(file.path);
    if (cached && cached.mtime === file.stat.mtime) {
      return { review: cached.review, notes: cached.notes };
    }

    const content = await this.app.vault.read(file);
    const review = parseTradeReviewMarkdown(content);
    const notes = extractUserOwnedTradeNotes(content);
    this.markdownTradeReviewByPath.set(file.path, {
      mtime: file.stat.mtime,
      review,
      notes,
    });
    return { review, notes };
  }

  private async refreshMarkdownTradeReviewInCache(
    tradeFilePath: string
  ): Promise<void> {
    if (!this.hasCachedTradePath(tradeFilePath)) return;

    const file = this.app.vault.getAbstractFileByPath(tradeFilePath);
    if (!(file instanceof TFile)) return;

    const context = await this.readMarkdownTradeReviewContext(file);

    for (const [reviewFilePath, cached] of this.cache.entries()) {
      if (!cachedReviewIncludesTradePath(cached, tradeFilePath)) continue;

      const nextCached: CachedReviewData = {
        ...cached,
        allTrades: patchMarkdownTradeContextInArray(
          cached.allTrades,
          tradeFilePath,
          context
        ),
        analyticsBasisTrades: patchMarkdownTradeContextInArray(
          cached.analyticsBasisTrades,
          tradeFilePath,
          context
        ),
        trades: patchMarkdownTradeContextInRequiredArray(
          cached.trades,
          tradeFilePath,
          context
        ),
        version: cached.version + 1,
        populatedAt: Date.now(),
      };

      this.cache.set(reviewFilePath, nextCached);
      this.notifySubscribers(reviewFilePath, nextCached);
    }
  }

  private hasCachedTradePath(tradeFilePath: string): boolean {
    for (const cached of this.cache.values()) {
      if (cachedReviewIncludesTradePath(cached, tradeFilePath)) return true;
    }
    return false;
  }

  private async getMissedTradeReviewData(
    start: Date,
    end: Date
  ): Promise<Array<PartialTradeFrontmatter & Record<string, unknown>>> {
    const missedTradeService = this.plugin.serviceManager
      ? await this.plugin.serviceManager.getMissedTradeService()
      : this.plugin.missedTradeService;

    if (!missedTradeService?.getMissedTrades) {
      return [];
    }

    const missedTradeFiles = await missedTradeService.getMissedTrades(
      start,
      end
    );
    const extractedTrades = await Promise.all(
      missedTradeFiles.map((file) =>
        this.plugin.tradeService.extractTradeData(file)
      )
    );

    return extractedTrades.filter(
      (trade): trade is PartialTradeFrontmatter & Record<string, unknown> =>
        trade !== null && trade.isMissedTrade === true
    );
  }

  private mergeReviewTradeSources(
    primaryTrades: Array<PartialTradeFrontmatter & Record<string, unknown>>,
    supplementalTrades: Array<PartialTradeFrontmatter & Record<string, unknown>>
  ): Array<PartialTradeFrontmatter & Record<string, unknown>> {
    const mergedTrades = [...primaryTrades];
    const knownPaths = new Set<string>();

    for (const trade of primaryTrades) {
      if (typeof trade.path === 'string') {
        knownPaths.add(trade.path);
      }
    }

    for (const trade of supplementalTrades) {
      const path = typeof trade.path === 'string' ? trade.path : null;
      if (path && knownPaths.has(path)) continue;
      if (path) knownPaths.add(path);
      mergedTrades.push(trade);
    }

    return mergedTrades;
  }

  
  private async doPopulate(
    filePath: string,
    filtersOverride?: UnifiedFilters
  ): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) {
      return;
    }

    
    const cache = this.app.metadataCache.getFileCache(file);
    const frontmatter = cache?.frontmatter;

    if (!frontmatter) {
      
      await this.retryPopulate(filePath, 5, 150, filtersOverride);
      return;
    }

    
    if (!isReviewNoteType(frontmatter.type)) {
      return;
    }
    const noteType = frontmatter.type;

    
    const canonicalTrade =
      noteType === 'trade'
        ? normalizeTradeExecutionForPeriodAnalytics(frontmatter)
        : null;
    const date = parseLocalDateSafe(
      noteType === 'trade'
        ? canonicalTrade?.entryTime
        : getStringValue(frontmatter, 'date')
    );

    if (!date) {
      return;
    }

    
    let start: Date, end: Date;
    let tradingDayStr: string | undefined;

    if (noteType === 'drc') {
      
      
      tradingDayStr = formatLocalDateString(date);

      
      
      const tradingDayAnchor = new Date(date);
      tradingDayAnchor.setHours(12, 0, 0, 0);
      const tradingDayRange = getTradingDayRange(tradingDayAnchor, this.plugin);
      start = tradingDayRange.start;
      end = new Date(tradingDayRange.end.getTime() - 1);
    } else if (noteType === 'weekly-review') {
      
      const weekStart = getStringValue(frontmatter, 'weekStart');
      const weekEnd = getStringValue(frontmatter, 'weekEnd');
      start = weekStart ? (parseLocalDateSafe(weekStart) ?? date) : date;
      end = weekEnd
        ? (parseLocalDateSafe(weekEnd) ??
          new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000))
        : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (noteType === 'monthly-review') {
      start = new Date(date.getFullYear(), date.getMonth(), 1);
      end = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    } else if (noteType === 'quarterly-review') {
      
      
      const quarterStart = getStringValue(frontmatter, 'quarterStart');
      const quarterEnd = getStringValue(frontmatter, 'quarterEnd');
      const parsedQuarterStart = quarterStart
        ? parseLocalDateSafe(quarterStart)
        : null;
      const parsedQuarterEnd = quarterEnd
        ? parseLocalDateSafe(quarterEnd)
        : null;
      if (parsedQuarterStart && parsedQuarterEnd) {
        start = parsedQuarterStart;
        end = parsedQuarterEnd;
        end.setHours(23, 59, 59, 999);
      } else {
        
        const quarter = Math.floor(date.getMonth() / 3); 
        const startMonth = quarter * 3;
        start = new Date(date.getFullYear(), startMonth, 1);
        end = new Date(date.getFullYear(), startMonth + 3, 0, 23, 59, 59, 999);
      }
    } else if (noteType === 'yearly-review') {
      
      
      const yearStart = getStringValue(frontmatter, 'yearStart');
      const yearEnd = getStringValue(frontmatter, 'yearEnd');
      const parsedYearStart = yearStart ? parseLocalDateSafe(yearStart) : null;
      const parsedYearEnd = yearEnd ? parseLocalDateSafe(yearEnd) : null;
      if (parsedYearStart && parsedYearEnd) {
        start = parsedYearStart;
        end = parsedYearEnd;
        end.setHours(23, 59, 59, 999);
      } else {
        
        const year = getNumberValue(frontmatter, 'year') ?? date.getFullYear();
        start = new Date(year, 0, 1, 0, 0, 0, 0);
        end = new Date(year, 11, 31, 23, 59, 59, 999);
      }
    } else {
      
      start = date;
      end = date;
    }

    
    const savedFilters =
      this.plugin.uiStateManager.getState().viewFilters?.reviews;
    const filters: UnifiedFilters = filtersOverride
      ? normalizeReviewFilters(filtersOverride)
      : normalizeReviewFilters(savedFilters);

    

    let trades: Array<PartialTradeFrontmatter & Record<string, unknown>> = [];

    let scopedTrades: Array<PartialTradeFrontmatter & Record<string, unknown>> =
      [];

    let analyticsBasisTrades: Array<
      PartialTradeFrontmatter & Record<string, unknown>
    > = [];
    let executionBasisTrades: Array<
      PartialTradeFrontmatter & Record<string, unknown>
    > = [];
    let currencyConversion: CachedReviewData['currencyConversion'];

    if (this.plugin.tradeService) {
      try {
        const regularAndBacktestTrades =
          (await this.plugin.tradeService.getTradeData({
            fresh: false,
          })) as Array<PartialTradeFrontmatter & Record<string, unknown>>;
        const missedTrades = await this.getMissedTradeReviewData(start, end);
        const allTrades = this.mergeReviewTradeSources(
          regularAndBacktestTrades,
          missedTrades
        );

        const analyticsDateBasis = getAnalyticsDateBasis(this.plugin.settings);

        const isTradeInReviewRange = (
          trade: PartialTradeFrontmatter,
          basis: 'entry' | 'exit'
        ): boolean => {
          const analyticsTrade = {
            ...trade,
            _originalPnlWasNull: trade.pnl === undefined || trade.pnl === null,
          };

          if (basis === 'exit') {
            const realizedEvents = getTradeRealizedPnlEvents(
              analyticsTrade,
              basis,
              this.plugin
            );
            if (realizedEvents.length > 0) {
              return tradingDayStr
                ? realizedEvents.some(
                    (event) =>
                      formatLocalDateString(event.tradingDay) === tradingDayStr
                  )
                : realizedEvents.some(
                    (event) =>
                      event.tradingDay >= start && event.tradingDay <= end
                  );
            }
          }

          const analyticsTradingDay = getTradeAnalyticsTradingDay(
            analyticsTrade,
            basis,
            this.plugin
          );
          return tradingDayStr
            ? analyticsTradingDay !== null &&
                formatLocalDateString(analyticsTradingDay) === tradingDayStr
            : analyticsTradingDay !== null &&
                analyticsTradingDay >= start &&
                analyticsTradingDay <= end;
        };

        const hasEntryExecutionInReviewRange = (
          trade: PartialTradeFrontmatter
        ): boolean => {
          const entries = Array.isArray(trade.entries) ? trade.entries : [];
          if (entries.length === 0) {
            return isTradeInReviewRange(trade, 'entry');
          }

          return entries.some((entry) => {
            const entryTradingDay = getTradeAnalyticsTradingDay(
              { entryTime: entry.time },
              'entry',
              this.plugin
            );
            if (!entryTradingDay) return false;
            return tradingDayStr
              ? formatLocalDateString(entryTradingDay) === tradingDayStr
              : entryTradingDay >= start && entryTradingDay <= end;
          });
        };

        const drcSessionWindows =
          noteType === 'drc'
            ? getSessionWindowsForTradingDay(date, this.plugin)
            : [];
        const isTimestampInDRCSessionWindow = (value: unknown): boolean => {
          if (drcSessionWindows.length === 0) return false;
          const timestamp = parseTradeTimestampValue(value);
          if (!timestamp) return false;
          return drcSessionWindows.some(
            (window) => timestamp >= window.start && timestamp < window.end
          );
        };
        const hasExecutionInDRCSessionWindow = (
          trade: PartialTradeFrontmatter
        ): boolean => {
          const entries = Array.isArray(trade.entries) ? trade.entries : [];
          if (
            entries.some((entry) => isTimestampInDRCSessionWindow(entry.time))
          ) {
            return true;
          }
          if (
            entries.length === 0 &&
            isTimestampInDRCSessionWindow(trade.entryTime)
          ) {
            return true;
          }

          for (const event of getTradeRealizedPnlEvents(
            {
              ...trade,
              _originalPnlWasNull:
                trade.pnl === undefined || trade.pnl === null,
            },
            'exit',
            this.plugin
          )) {
            if (isTimestampInDRCSessionWindow(event.date)) return true;
          }
          return false;
        };

        
        
        trades = allTrades.filter((trade: PartialTradeFrontmatter) =>
          isTradeInReviewRange(trade, 'entry')
        );

        const analyticsBasisRawTrades =
          analyticsDateBasis === 'entry'
            ? trades
            : allTrades.filter((trade: PartialTradeFrontmatter) =>
                isTradeInReviewRange(trade, analyticsDateBasis)
              );
        const executionBasisRawTrades = allTrades.filter(
          (trade: PartialTradeFrontmatter) =>
            hasEntryExecutionInReviewRange(trade) ||
            isTradeInReviewRange(trade, 'exit') ||
            hasExecutionInDRCSessionWindow(trade)
        );

        const customFieldDefinitions =
          this.plugin.customFieldsService?.getFields() || [];

        scopedTrades = trades.map((trade) =>
          enrichTradeWithCustomFields(
            {
              ...trade,
              _analyticsRangeStart: start,
              _analyticsRangeEnd: end,
            },
            customFieldDefinitions,
            this.app
          )
        );
        analyticsBasisTrades =
          analyticsDateBasis === 'entry'
            ? scopedTrades
            : analyticsBasisRawTrades.map((trade) =>
                enrichTradeWithCustomFields(
                  {
                    ...trade,
                    _analyticsRangeStart: start,
                    _analyticsRangeEnd: end,
                  },
                  customFieldDefinitions,
                  this.app
                )
              );
        executionBasisTrades = executionBasisRawTrades.map((trade) =>
          enrichTradeWithCustomFields(
            {
              ...trade,
              _analyticsRangeStart: start,
              _analyticsRangeEnd: end,
            },
            customFieldDefinitions,
            this.app
          )
        );

        scopedTrades = this.expandCopiedTradesForReviewFilters(
          scopedTrades,
          filters.accounts || []
        );
        analyticsBasisTrades =
          analyticsDateBasis === 'entry'
            ? scopedTrades
            : this.expandCopiedTradesForReviewFilters(
                analyticsBasisTrades,
                filters.accounts || []
              );
        executionBasisTrades = this.expandCopiedTradesForReviewFilters(
          executionBasisTrades,
          filters.accounts || []
        );

        const breakEvenThresholdMode =
          this.plugin.settings?.trade?.breakEvenThresholdMode ?? 'fixed';
        if (breakEvenThresholdMode === 'percentage_current_balance') {
          const accountBalanceLookup = await fetchBreakEvenAccountBalanceLookup(
            this.plugin
          );
          scopedTrades = this.attachBreakEvenAccountBalances(
            scopedTrades,
            accountBalanceLookup
          );
          analyticsBasisTrades =
            analyticsDateBasis === 'entry'
              ? scopedTrades
              : this.attachBreakEvenAccountBalances(
                  analyticsBasisTrades,
                  accountBalanceLookup
                );
          executionBasisTrades = this.attachBreakEvenAccountBalances(
            executionBasisTrades,
            accountBalanceLookup
          );
        }

        
        
        
        const userCurrency = this.plugin?.settings?.general?.currency || 'USD';
        const currencyGrouped = aggregatePnLByCurrency(
          scopedTrades,
          userCurrency
        );
        const originalScopedTrades = scopedTrades;
        const analyticsBasisCurrencyGrouped =
          analyticsDateBasis === 'entry'
            ? currencyGrouped
            : aggregatePnLByCurrency(analyticsBasisTrades, userCurrency);

        let successfulConversion:
          | {
              baseCurrency: string;
              rateDate: string;
              unconvertedCurrencies: string[];
              originalTradeCount: number;
              convertedTradeCount: number;
              brokerBaseCurrencyTradeCount?: number;
            }
          | undefined;

        if (currencyGrouped.isMultiCurrency) {
          const conversionResult = await this.exchangeRateService.convertTrades(
            scopedTrades,
            userCurrency
          );

          
          
          
          
          if (conversionResult) {
            successfulConversion = conversionResult;
            scopedTrades = conversionResult.trades;
          }

          if (analyticsDateBasis === 'entry') {
            analyticsBasisTrades = scopedTrades;
          }
        }

        if (
          analyticsDateBasis !== 'entry' &&
          analyticsBasisCurrencyGrouped.isMultiCurrency
        ) {
          const analyticsConversionResult =
            await this.exchangeRateService.convertTrades(
              analyticsBasisTrades,
              userCurrency
            );
          if (analyticsConversionResult) {
            analyticsBasisTrades = analyticsConversionResult.trades;
          }
        }

        
        trades = applyTradeFilters(
          scopedTrades,
          filters,
          customFieldDefinitions,
          {
            resolveAccountIdDisplayName: (accountId) =>
              this.plugin.settings.backendIntegration?.accountMapping?.[
                accountId
              ],
          }
        );
        analyticsBasisTrades =
          analyticsDateBasis === 'entry'
            ? trades
            : applyTradeFilters(
                analyticsBasisTrades,
                filters,
                customFieldDefinitions,
                {
                  resolveAccountIdDisplayName: (accountId) =>
                    this.plugin.settings.backendIntegration?.accountMapping?.[
                      accountId
                    ],
                }
              );
        executionBasisTrades = applyTradeFilters(
          executionBasisTrades,
          filters,
          customFieldDefinitions,
          {
            resolveAccountIdDisplayName: (accountId) =>
              this.plugin.settings.backendIntegration?.accountMapping?.[
                accountId
              ],
          }
        );

        if (successfulConversion) {
          const originalByCurrency: Record<string, number> = {};
          const convertedByCurrency: Record<string, number> = {};
          const filteredOriginalTrades = applyTradeFilters(
            originalScopedTrades,
            filters,
            customFieldDefinitions,
            {
              resolveAccountIdDisplayName: (accountId) =>
                this.plugin.settings.backendIntegration?.accountMapping?.[
                  accountId
                ],
            }
          ).filter((trade) => isPnlContributingTrade(trade));
          const pnlContributingTrades = trades.filter((trade) =>
            isPnlContributingTrade(trade)
          );
          const filteredOriginalCurrencies = new Set<string>();

          for (const trade of filteredOriginalTrades) {
            const originalCurrency =
              typeof trade.currency === 'string'
                ? trade.currency
                : userCurrency;
            filteredOriginalCurrencies.add(originalCurrency);
            originalByCurrency[originalCurrency] =
              (originalByCurrency[originalCurrency] || 0) +
              getEffectivePnL(trade);
          }

          for (const trade of pnlContributingTrades) {
            const originalCurrency =
              typeof trade.originalCurrency === 'string'
                ? trade.originalCurrency
                : userCurrency;
            convertedByCurrency[originalCurrency] =
              (convertedByCurrency[originalCurrency] || 0) +
              getEffectivePnL(trade);
          }

          const filteredUnconvertedCurrencies =
            successfulConversion.unconvertedCurrencies.filter((currency) =>
              filteredOriginalCurrencies.has(currency)
            );
          const filteredUnconvertedCurrencySet = new Set(
            filteredUnconvertedCurrencies
          );
          const unconvertedTrades = filteredOriginalTrades.flatMap((trade) => {
            const originalCurrency =
              typeof trade.currency === 'string'
                ? trade.currency
                : userCurrency;
            return filteredUnconvertedCurrencySet.has(originalCurrency)
              ? [
                  {
                    ...trade,
                    originalCurrency,
                    originalPnlBeforeConversion: getEffectivePnL(trade),
                    isUnconvertedCurrency: true,
                  },
                ]
              : [];
          });
          const brokerBaseCurrencyTradeCount = pnlContributingTrades.filter(
            (trade) =>
              typeof trade.brokerBaseCurrencyPnl === 'number' &&
              Number.isFinite(trade.brokerBaseCurrencyPnl) &&
              trade.brokerBaseCurrency === successfulConversion.baseCurrency
          ).length;

          currencyConversion = {
            isMultiCurrency:
              pnlContributingTrades.length > 0 ||
              filteredUnconvertedCurrencies.length > 0,
            conversionBaseCurrency: successfulConversion.baseCurrency,
            conversionRateDate: successfulConversion.rateDate,
            originalByCurrency,
            convertedByCurrency,
            unconvertedCurrencies: filteredUnconvertedCurrencies,
            unconvertedTrades,
            originalTradeCount: filteredOriginalTrades.length,
            convertedTradeCount: pnlContributingTrades.length,
            brokerBaseCurrencyTradeCount,
          };
        }
      } catch (error) {
        console.error('[ReviewDataCache] Error fetching trades:', error);
      }
    }

    const sessionMistakesByTradingDay = this.collectSessionMistakesByTradingDay(
      start,
      end,
      tradingDayStr
    );

    
    const existingEntry = this.cache.get(filePath);
    const version = existingEntry ? existingEntry.version + 1 : 1;

    
    const entry = this.applySessionVisibilityToCachedData(
      {
        frontmatter,
        noteType,
        dateRange: { start, end },
        tradingDayStr,
        filters,
        allTrades: scopedTrades,
        executionBasisTrades,
        analyticsBasisTrades,
        trades,
        sessionMistakesByTradingDay,
        currencyConversion,
        version,
        populatedAt: Date.now(),
      },
      filePath
    );

    this.cache.set(filePath, entry);

    
    this.notifySubscribers(filePath, entry);
  }

  private normalizeSessionMistakes(values: unknown[]): string[] {
    const normalized: string[] = [];
    const seen = new Set<string>();

    for (const value of values) {
      if (typeof value !== 'string') continue;
      const trimmed = value.trim();
      if (!trimmed) continue;

      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;

      seen.add(key);
      normalized.push(trimmed);
    }

    return normalized;
  }

  private getDRCAggregationFingerprint(
    frontmatter: Record<string, unknown> | undefined
  ): string | null {
    if (!frontmatter || frontmatter.type !== 'drc') {
      return null;
    }

    const dateValue =
      typeof frontmatter.date === 'string' ? frontmatter.date.trim() : '';

    const mistakes = Array.isArray(frontmatter.sessionMistakes)
      ? this.normalizeSessionMistakes(frontmatter.sessionMistakes)
          .map((mistake) => mistake.toLowerCase())
          .sort((a, b) => a.localeCompare(b))
      : [];

    return `${dateValue}::${mistakes.join('|')}`;
  }

  private getTradingDayFromDRCFingerprint(
    fingerprint: string | undefined
  ): string | null {
    if (!fingerprint) {
      return null;
    }

    const separatorIndex = fingerprint.indexOf('::');
    const rawDate =
      separatorIndex >= 0
        ? fingerprint.slice(0, separatorIndex).trim()
        : fingerprint.trim();

    if (!rawDate) {
      return null;
    }

    const parsedDate = parseLocalDateSafe(rawDate);
    if (!parsedDate) {
      return null;
    }

    return formatLocalDateString(parsedDate);
  }

  private invalidateSessionMistakesIndex(): void {
    this.sessionMistakesIndex = null;
    this.sessionMistakesTradingDayByFile = null;
    this.sessionMistakesIndexBuiltAt = 0;
  }

  private rebuildSessionMistakesIndex(): {
    byTradingDay: Record<string, string[]>;
    byFile: Record<string, string>;
  } {
    const byTradingDay: Record<string, string[]> = {};
    const byFile: Record<string, string> = {};

    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
      const cachedFrontmatter: unknown =
        this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!isRecord(cachedFrontmatter) || cachedFrontmatter.type !== 'drc') {
        continue;
      }
      const frontmatter = cachedFrontmatter;

      if (!Array.isArray(frontmatter.sessionMistakes)) {
        continue;
      }

      const normalizedMistakes = this.normalizeSessionMistakes(
        frontmatter.sessionMistakes
      );
      if (normalizedMistakes.length === 0) {
        continue;
      }

      const dateValue = frontmatter.date;
      if (typeof dateValue !== 'string') {
        continue;
      }

      const parsedDate = parseLocalDateSafe(dateValue);
      if (!parsedDate) {
        continue;
      }

      const dayKey = formatLocalDateString(parsedDate);
      byFile[file.path] = dayKey;
      const existing = byTradingDay[dayKey] || [];

      byTradingDay[dayKey] = this.normalizeSessionMistakes([
        ...existing,
        ...normalizedMistakes,
      ]);
    }

    return { byTradingDay, byFile };
  }

  private getSessionMistakesIndex(): Record<string, string[]> {
    const now = Date.now();

    if (
      this.sessionMistakesIndex &&
      this.sessionMistakesTradingDayByFile &&
      now - this.sessionMistakesIndexBuiltAt <=
        ReviewDataCache.SESSION_MISTAKES_INDEX_TTL_MS
    ) {
      return this.sessionMistakesIndex;
    }

    const rebuilt = this.rebuildSessionMistakesIndex();
    this.sessionMistakesIndex = rebuilt.byTradingDay;
    this.sessionMistakesTradingDayByFile = rebuilt.byFile;
    this.sessionMistakesIndexBuiltAt = now;

    return this.sessionMistakesIndex;
  }

  private getSessionMistakesTradingDayForFile(filePath: string): string | null {
    this.getSessionMistakesIndex();
    return this.sessionMistakesTradingDayByFile?.[filePath] || null;
  }

  private collectSessionMistakesByTradingDay(
    start: Date,
    end: Date,
    tradingDayStr?: string
  ): Record<string, string[]> {
    const index = this.getSessionMistakesIndex();

    if (tradingDayStr) {
      const mistakes = index[tradingDayStr] || [];
      return mistakes.length > 0 ? { [tradingDayStr]: [...mistakes] } : {};
    }

    
    
    
    const startDateKey = formatLocalDateString(start);
    const endDateKey = formatLocalDateString(end);
    const minDateKey = startDateKey <= endDateKey ? startDateKey : endDateKey;
    const maxDateKey = startDateKey <= endDateKey ? endDateKey : startDateKey;

    const sessionMistakesByTradingDay: Record<string, string[]> = {};

    for (const [dayKey, mistakes] of Object.entries(index)) {
      if (dayKey < minDateKey || dayKey > maxDateKey) {
        continue;
      }

      sessionMistakesByTradingDay[dayKey] = [...mistakes];
    }

    return sessionMistakesByTradingDay;
  }

  
  private async retryPopulate(
    filePath: string,
    retries: number,
    delay: number,
    filtersOverride?: UnifiedFilters
  ): Promise<void> {
    for (let i = 0; i < retries; i++) {
      await new Promise((resolve) => window.setTimeout(resolve, delay));

      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) return;

      const cache = this.app.metadataCache.getFileCache(file);
      if (cache?.frontmatter) {
        await this.doPopulate(filePath, filtersOverride);
        return;
      }
    }
  }

  
  private async reapplyFilters(
    filePath: string,
    newFilters: UnifiedFilters
  ): Promise<void> {
    
    
    
    await this.populate(filePath, newFilters);
  }

  
  public invalidate(filePath: string): void {
    this.cache.delete(filePath);
    this.pendingFilterOverrides.delete(filePath);
    this.notifySubscribers(filePath, null);
  }

  
  public invalidateAll(): void {
    const filePaths = Array.from(
      new Set([
        ...this.cache.keys(),
        ...this.subscribers.keys(),
        ...this.pendingPopulations.keys(),
      ])
    );
    this.cache.clear();
    this.pendingFilterOverrides.clear();
    this.invalidateSessionMistakesIndex();

    
    for (const filePath of filePaths) {
      this.notifySubscribers(filePath, null);
    }

    
    
    for (const filePath of filePaths) {
      this.populateDebounced(filePath);
    }
  }

  private updateTradeReviewStatusInCache(payload: TradeChangedPayload): void {
    const filePaths = new Set<string>();
    if (payload.filePath) filePaths.add(payload.filePath);
    if (payload.filePaths) {
      for (const filePath of payload.filePaths) filePaths.add(filePath);
    }

    if (filePaths.size === 0 || payload.reviewed === undefined) {
      return;
    }

    for (const [reviewFilePath, cached] of this.cache.entries()) {
      const nextCached = this.applySessionVisibilityToCachedData(
        this.applyReviewStatusToCachedData(
          cached,
          filePaths,
          payload.reviewed,
          payload.reviewedAt
        ),
        reviewFilePath
      );
      if (nextCached === cached) continue;

      this.cache.set(reviewFilePath, nextCached);
      this.notifySubscribers(reviewFilePath, nextCached);
    }
  }

  private applySessionVisibilityToCachedData(
    cached: CachedReviewData,
    reviewFilePath: string
  ): CachedReviewData {
    const visiblePaths =
      this.sessionVisibleReviewedTradePathsByReview.get(reviewFilePath) ??
      new Set<string>();

    let changed = false;
    const updateTrades = (
      trades: unknown[] | undefined
    ): unknown[] | undefined => {
      if (!trades) return trades;
      return trades.map((trade) => {
        if (!isRecord(trade) || typeof trade.path !== 'string') return trade;
        const shouldKeepVisible = visiblePaths.has(trade.path);
        if (trade.reviewSessionVisible === shouldKeepVisible) return trade;
        changed = true;
        return {
          ...trade,
          reviewSessionVisible: shouldKeepVisible,
        };
      });
    };

    const allTrades = updateTrades(cached.allTrades);
    const executionBasisTrades = updateTrades(cached.executionBasisTrades);
    const analyticsBasisTrades = updateTrades(cached.analyticsBasisTrades);
    const trades = updateTrades(cached.trades) ?? cached.trades;

    if (!changed) return cached;

    return {
      ...cached,
      ...(allTrades ? { allTrades } : {}),
      ...(executionBasisTrades ? { executionBasisTrades } : {}),
      ...(analyticsBasisTrades ? { analyticsBasisTrades } : {}),
      trades,
    };
  }

  private applyReviewStatusToCachedData(
    cached: CachedReviewData,
    filePaths: Set<string>,
    reviewed: boolean,
    reviewedAt: string | undefined
  ): CachedReviewData {
    let changed = false;
    const updateTrades = (
      trades: unknown[] | undefined
    ): unknown[] | undefined => {
      if (!trades) return trades;
      return trades.map((trade) => {
        if (!isRecord(trade) || typeof trade.path !== 'string') return trade;
        if (!filePaths.has(trade.path)) return trade;
        changed = true;
        return {
          ...trade,
          reviewed,
          reviewedAt,
        };
      });
    };

    const allTrades = updateTrades(cached.allTrades);
    const executionBasisTrades = updateTrades(cached.executionBasisTrades);
    const analyticsBasisTrades = updateTrades(cached.analyticsBasisTrades);
    const trades = updateTrades(cached.trades) ?? cached.trades;

    if (!changed) return cached;

    return {
      ...cached,
      ...(allTrades ? { allTrades } : {}),
      ...(executionBasisTrades ? { executionBasisTrades } : {}),
      ...(analyticsBasisTrades ? { analyticsBasisTrades } : {}),
      trades,
      version: cached.version + 1,
      populatedAt: Date.now(),
    };
  }

  
  private invalidateByTradeChange(
    tradeFilePath: string,
    entryTime?: string
  ): void {
    if (!entryTime) {
      
      this.invalidateAll();
      return;
    }

    const tradeDate = new Date(entryTime);
    if (isNaN(tradeDate.getTime())) {
      this.invalidateAll();
      return;
    }

    
    for (const [filePath, cached] of this.cache.entries()) {
      const { start, end } = cached.dateRange;

      if (tradeDate >= start && tradeDate <= end) {
        
        this.invalidate(filePath);
        
        this.populateDebounced(filePath);
      }
    }
  }

  
  private invalidateByDRCReviewChange(
    drcFilePath: string,
    previousSessionTradingDayStr?: string | null
  ): void {
    const drcFile = this.app.vault.getAbstractFileByPath(drcFilePath);
    if (!(drcFile instanceof TFile)) {
      this.invalidateAll();
      return;
    }

    const cachedFrontmatter: unknown =
      this.app.metadataCache.getFileCache(drcFile)?.frontmatter;
    const frontmatter = isRecord(cachedFrontmatter)
      ? cachedFrontmatter
      : undefined;
    const rawDate = frontmatter?.date;
    if (typeof rawDate !== 'string') {
      this.invalidateAll();
      return;
    }

    const drcDate = parseLocalDateSafe(rawDate);
    if (!drcDate) {
      this.invalidateAll();
      return;
    }

    
    const drcTradingDayStr = formatLocalDateString(drcDate);
    const tradingDayAnchor = new Date(drcDate);
    tradingDayAnchor.setHours(12, 0, 0, 0);
    const tradingDayRange = getTradingDayRange(tradingDayAnchor, this.plugin);

    const affectedDayWindows: Array<{
      tradingDayStr?: string;
      start: Date;
      end: Date;
    }> = [
      {
        tradingDayStr: drcTradingDayStr,
        start: tradingDayRange.start,
        end: new Date(tradingDayRange.end.getTime() - 1),
      },
    ];

    
    
    const previousCachedDRC = this.cache.get(drcFilePath);
    if (previousCachedDRC?.noteType === 'drc') {
      const previousStart = previousCachedDRC.dateRange.start;
      const previousEnd = previousCachedDRC.dateRange.end;
      const previousTradingDayFromCache = previousCachedDRC.tradingDayStr;

      const isSameWindow =
        previousStart.getTime() === tradingDayRange.start.getTime() &&
        previousEnd.getTime() === tradingDayRange.end.getTime() - 1;

      if (!isSameWindow) {
        affectedDayWindows.push({
          tradingDayStr: previousTradingDayFromCache,
          start: previousStart,
          end: previousEnd,
        });
      }
    } else if (
      previousSessionTradingDayStr &&
      previousSessionTradingDayStr !== drcTradingDayStr
    ) {
      const previousTradingDayDate = createTradingDayFromString(
        previousSessionTradingDayStr
      );
      previousTradingDayDate.setHours(12, 0, 0, 0);
      const previousTradingDayRange = getTradingDayRange(
        previousTradingDayDate,
        this.plugin
      );

      affectedDayWindows.push({
        tradingDayStr: previousSessionTradingDayStr,
        start: previousTradingDayRange.start,
        end: new Date(previousTradingDayRange.end.getTime() - 1),
      });
    }

    const affectedFilePaths: string[] = [];
    for (const [cachedFilePath, cached] of this.cache.entries()) {
      const { start, end } = cached.dateRange;

      const isSameDRCFile = cachedFilePath === drcFilePath;
      const isSameDRCTradingDay =
        cached.noteType === 'drc' &&
        affectedDayWindows.some(
          (window) =>
            window.tradingDayStr !== undefined &&
            cached.tradingDayStr === window.tradingDayStr
        );

      const overlapsDateRange = affectedDayWindows.some(
        (window) => window.start <= end && window.end >= start
      );

      if (isSameDRCFile || isSameDRCTradingDay || overlapsDateRange) {
        affectedFilePaths.push(cachedFilePath);
      }
    }

    for (const cachedFilePath of affectedFilePaths) {
      this.invalidate(cachedFilePath);
      this.populateDebounced(cachedFilePath);
    }
  }

  
  public subscribe(filePath: string, callback: CacheSubscriber): () => void {
    if (!this.subscribers.has(filePath)) {
      this.subscribers.set(filePath, new Set());
    }

    this.subscribers.get(filePath)!.add(callback);

    return () => {
      const subs = this.subscribers.get(filePath);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(filePath);
        }
      }
    };
  }

  
  private notifySubscribers(
    filePath: string,
    data: CachedReviewData | null
  ): void {
    const subs = this.subscribers.get(filePath);
    if (subs) {
      for (const callback of subs) {
        try {
          callback(data);
        } catch (error) {
          console.error('[ReviewDataCache] Subscriber error:', error);
        }
      }
    }
  }

  
  private notifyAllSubscribers(): void {
    for (const [filePath, data] of this.cache.entries()) {
      
      
      this.notifySubscribers(filePath, { ...data });
    }
  }

  
  public getStats(): { entries: number; subscribers: number; pending: number } {
    let totalSubscribers = 0;
    for (const subs of this.subscribers.values()) {
      totalSubscribers += subs.size;
    }

    return {
      entries: this.cache.size,
      subscribers: totalSubscribers,
      pending: this.pendingPopulations.size,
    };
  }

  
  public destroy(): void {
    
    for (const timer of this.populateDebounceTimers.values()) {
      window.clearTimeout(timer);
    }
    this.populateDebounceTimers.clear();

    
    this.pendingPopulations.clear();
    this.pendingFilterOverrides.clear();

    
    this.cache.clear();
    this.invalidateSessionMistakesIndex();
    this.drcAggregationFingerprintByFile.clear();

    
    this.subscribers.clear();

    
    for (const cleanup of this.eventCleanup) {
      cleanup();
    }
    this.eventCleanup = [];
  }
}
