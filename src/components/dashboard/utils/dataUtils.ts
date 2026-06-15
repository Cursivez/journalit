

import { App, TFile } from 'obsidian';
import { TradeService } from '../../../services/trade/TradeService';
import { FilterState } from '../DashboardView';
import {
  getEffectivePnL,
  isPnlContributingTrade,
  isTradeOpenPreservingNullPnl,
} from '../../../utils/tradeStatusUtils';

import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { normalizeStringArray } from '../../../utils/dataUtils';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsDate,
  getTradeAnalyticsTradingDay,
  getTradeRealizedPnlEvents,
} from '../../../utils/tradeAnalyticsDate';
import {
  type BreakEvenRangeSettings,
  calculateWinRateExcludingBreakeven,
  classifyPnLWithBreakEvenSettings,
  normalizeBreakEvenRange,
} from '../../../utils/breakEvenRange';
import {
  formatLocalDateString,
  safeParseDateValue,
  safeDateSort,
} from '../../../utils/dateUtils';
import { parseTradeDividendTransactions } from '../../../utils/tradeUtils';
import { aggregatePnLByCurrency } from '../../../utils/currencyAggregation';
import { ExchangeRateService } from '../../../services/exchangeRate';
import { calculateHistoricalStreaks } from '../../../utils/tradeStreaks';
import { inferStoredTradeType } from '../../../utils/tradeTypeRouting';
import {
  calculateTradeReturnPercent,
  getTradeMaeValue,
  getTradeMfeValue,
} from '../../tradelog/tradeMetricUtils';
import type JournalitPlugin from '../../../main';
import {
  analyzeDrawdown,
  resolveDrawdownCapitalBasis,
  type DrawdownCapitalBasis,
} from '../../../utils/drawdownAnalytics';
import {
  type TradeAccountRef,
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from '../../../services/trade/core/TradeAccountIdentity';
import {
  fetchBreakEvenAccountBalanceLookup,
  getBreakEvenAccountBalanceFields,
  resolveBreakEvenAccountBalances,
} from '../../../services/trade/core/BreakEvenAccountBalance';
import { normalizeTradeExecutionForAnalytics } from '../../../services/trade/core/TradeExecutionAnalytics';
import { applyTradeFilters } from '../../shared/filters/filterUtils';
import {
  getCopyTradingPeriodForEntryDate,
  isCopyTradingBaseEligible,
} from '../../../utils/accountCopyTrading';
import {
  calculateCopiedTradePnL,
  scaleCopiedTradeExecutionFields,
} from '../../../utils/copyTradePnL';
import { getAccountCapitalBasisLookup } from '../../../utils/accountCapitalBasis';



const createValidDate = (dateInput: unknown, fallback?: Date): Date => {
  if (!dateInput) {
    return fallback || new Date();
  }

  return safeParseDateValue(dateInput) ?? fallback ?? new Date();
};

const formatScalarId = (value: unknown): string | null =>
  typeof value === 'string' || typeof value === 'number' ? String(value) : null;

const toRecord = (value: object): Record<string, unknown> =>
  Object.fromEntries(Object.entries(value));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const getStringField = (
  frontmatter: Record<string, unknown>,
  key: string
): string | undefined =>
  typeof frontmatter[key] === 'string' ? frontmatter[key] : undefined;

const getBooleanField = (
  frontmatter: Record<string, unknown>,
  key: string
): boolean | undefined => {
  const value = frontmatter[key];
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

const hasDashboardEntryDate = (
  frontmatter: Record<string, unknown>
): boolean => {
  if (frontmatter.entryTime) {
    return true;
  }

  return Boolean(
    Array.isArray(frontmatter.entries) &&
    frontmatter.entries.some((entry) => isRecord(entry) && entry.time)
  );
};

const appendHash = (hash: number, value: unknown): number => {
  const text =
    value === undefined || value === null
      ? ''
      : typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ? String(value)
        : JSON.stringify(value);
  let nextHash = hash;

  for (let i = 0; i < text.length; i++) {
    nextHash = (nextHash * 31 + text.charCodeAt(i)) >>> 0;
  }

  return (nextHash * 31 + 124) >>> 0;
};

const hashJsonValue = (hash: number, value: unknown): number => {
  if (value === undefined || value === null) {
    return appendHash(hash, '');
  }

  return appendHash(hash, JSON.stringify(value));
};

type NormalizedMetricsTrade = Omit<
  Trade,
  'entryTime' | 'exitTime' | 'path' | 'currency'
> & {
  entryTime: Date;
  exitTime: Date | null;
  path: string;
  currency: string;
  _dashboardRealizedTradingDay?: Date;
};

const normalizeTradeForMetrics = (
  trade: Trade,
  defaultCurrency: string
): NormalizedMetricsTrade => {
  const entryTime = createValidDate(
    (trade as { entryTime?: unknown }).entryTime
  );
  const rawExitTime = (trade as { exitTime?: unknown }).exitTime;
  const exitTime =
    rawExitTime !== undefined && rawExitTime !== null
      ? createValidDate(rawExitTime, entryTime)
      : null;

  return {
    ...trade,
    entryTime,
    exitTime,
    path: trade.path || '',
    currency: trade.currency || defaultCurrency,
  };
};

const buildMetricsCacheKey = (
  trades: NormalizedMetricsTrade[],
  options: {
    defaultRiskAmount?: number;
    breakEvenRangeMin: number;
    breakEvenRangeMax: number;
    breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
    breakEvenThresholdPercent?: number;
    defaultCurrency: string;
    analyticsDateBasis: 'entry' | 'exit';
    tradingDayCutoffTime?: string;
    drawdownCapitalBasis?: DrawdownCapitalBasis['type'];
    drawdownCapitalBasisAmount?: number | 'none';
  }
): string => {
  let tradeFingerprint = 0;
  for (const trade of trades) {
    tradeFingerprint = appendHash(tradeFingerprint, trade.path);
    tradeFingerprint = appendHash(
      tradeFingerprint,
      trade.entryTime.toISOString()
    );
    tradeFingerprint = appendHash(
      tradeFingerprint,
      trade.exitTime ? trade.exitTime.toISOString() : ''
    );
    tradeFingerprint = appendHash(
      tradeFingerprint,
      trade._dashboardRealizedTradingDay?.toISOString() ?? ''
    );
    tradeFingerprint = appendHash(
      tradeFingerprint,
      trade._dashboardExcursionSourceKey ?? ''
    );
    tradeFingerprint = appendHash(
      tradeFingerprint,
      trade._dashboardExcursionPnL ?? ''
    );
    tradeFingerprint = appendHash(tradeFingerprint, trade.pnl);
    tradeFingerprint = appendHash(tradeFingerprint, trade.directPnL);
    tradeFingerprint = appendHash(tradeFingerprint, trade.useDirectPnLInput);
    tradeFingerprint = appendHash(tradeFingerprint, trade.entryPrice);
    tradeFingerprint = appendHash(tradeFingerprint, trade.exitPrice);
    tradeFingerprint = appendHash(tradeFingerprint, trade.positionSize);
    tradeFingerprint = appendHash(tradeFingerprint, trade.direction);
    tradeFingerprint = appendHash(tradeFingerprint, trade.assetType);
    tradeFingerprint = appendHash(tradeFingerprint, trade.leverageRatio);
    tradeFingerprint = appendHash(tradeFingerprint, trade.contractSize);
    tradeFingerprint = appendHash(tradeFingerprint, trade.dollarPerPoint);
    tradeFingerprint = appendHash(tradeFingerprint, trade.tickSize);
    tradeFingerprint = appendHash(tradeFingerprint, trade.tickValue);
    tradeFingerprint = appendHash(tradeFingerprint, trade.lotSize);
    tradeFingerprint = appendHash(tradeFingerprint, trade.pipValue);
    tradeFingerprint = hashJsonValue(tradeFingerprint, trade.entries ?? []);
    tradeFingerprint = hashJsonValue(tradeFingerprint, trade.exits ?? []);
    tradeFingerprint = appendHash(tradeFingerprint, trade.rMultiple);
    tradeFingerprint = appendHash(tradeFingerprint, trade.riskAmount);
    tradeFingerprint = appendHash(tradeFingerprint, trade.mae);
    tradeFingerprint = appendHash(tradeFingerprint, trade.mfe);
    tradeFingerprint = appendHash(tradeFingerprint, trade.maePrice);
    tradeFingerprint = appendHash(tradeFingerprint, trade.mfePrice);
    tradeFingerprint = appendHash(tradeFingerprint, trade.currency);
    tradeFingerprint = appendHash(
      tradeFingerprint,
      trade.breakEvenAccountCurrentBalance ?? 'na'
    );
    tradeFingerprint = appendHash(
      tradeFingerprint,
      trade.breakEvenAccountCurrentBalanceTotal ?? 'na'
    );
  }

  return [
    trades.length,
    tradeFingerprint,
    options.defaultRiskAmount ?? 'none',
    options.breakEvenRangeMin,
    options.breakEvenRangeMax,
    options.breakEvenThresholdMode ?? 'fixed',
    options.breakEvenThresholdPercent ?? 'na',
    options.defaultCurrency,
    options.analyticsDateBasis,
    options.tradingDayCutoffTime ?? 'none',
    options.drawdownCapitalBasis ?? 'none',
    options.drawdownCapitalBasisAmount ?? 'none',
  ].join(':');
};


class LRUCache<K, V> {
  private maxSize: number;
  private cache: Map<K, V>;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      
      const firstKey = Array.from(this.cache.keys())[0];
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}



const metricsCache = new LRUCache<string, DashboardData['metrics']>(50);


export const isTradeOpenInDashboard = (trade: Trade): boolean =>
  isTradeOpenPreservingNullPnl({
    tradeStatus: trade.tradeStatus,
    exitTime: trade.exitTime,
    pnl: trade.pnl,
    useDirectPnLInput: trade.useDirectPnLInput,
    exits: trade.exits,
    entries: trade.entries,
    _originalPnlWasNull: trade._originalPnlWasNull,
  });


export interface Trade {
  path: string;
  entryTime: Date;
  exitTime: Date;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  direction: string;
  pnl: number;
  directPnL?: number;
  tradeStatus?: string;
  useDirectPnLInput?: boolean;
  dividends?: Array<{ time?: Date | string | null; amount?: number | null }>;
  rebate?: number;
  hasExplicitExitPrice?: boolean;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
    hasExplicitPrice?: boolean;
  }>;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  
  _originalPnlWasNull?: boolean;
  _analyticsRangeStart?: Date;
  _analyticsRangeEnd?: Date;
  _dashboardExcursionSourceKey?: string;
  _dashboardExcursionPnL?: number;
  instrument?: string;
  setup?: string[];
  mistake?: string[];
  account?: string[];

  accountId?: string; 
  accountRefs?: TradeAccountRef[];
  accountLookupKeys?: string[];
  accountNamesNormalized?: string[];
  
  breakEvenAccountCurrentBalance?: number;
  
  breakEvenAccountCurrentBalanceCurrency?: string;
  
  breakEvenAccountCurrentBalanceTotal?: number;
  
  breakEvenAccountCurrentBalanceTotalCurrency?: string;
  commission?: number;
  swap?: number;
  fees?: number;
  tags?: string[]; 
  customTags?: string[]; 
  assetType?: string; 
  optionType?: string; 
  stopLoss?: number; 
  riskAmount?: number; 
  rMultiple?: number; 
  leverageRatio?: number; 
  contractSize?: number;
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;
  lotSize?: number;
  pipValue?: number;
  currency?: string; 
  mae?: number; 
  mfe?: number; 
  maePrice?: number; 
  mfePrice?: number; 

  
  tradeId?: string;

  
  schemaVersion?: number;

  
  backendTradeId?: number;

  
  isMissedTrade?: boolean;

  
  isBacktestTrade?: boolean;

  
  reviewed?: boolean;

  
  customFields?: Record<string, unknown>;
  isCopiedTrade?: boolean;
  copiedFromAccount?: string;
  copyMultiplier?: number;
  copyAccountLookupKey?: string;
  copyPnlAdjustment?: number;
  copyBaseTradeKey?: string;
}


const TRADE_PROPERTY_KEYS = new Set<string>([
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
  'directPnL',
  'dividends',
  'rebate',
  'hasExplicitExitPrice',
  'exits',
  'entries',
  '_originalPnlWasNull',
  'instrument',
  'setup',
  'mistake',
  'account',

  'accountId',
  'accountRefs',
  'accountLookupKeys',
  'accountNamesNormalized',
  'breakEvenAccountCurrentBalance',
  'breakEvenAccountCurrentBalanceCurrency',
  'breakEvenAccountCurrentBalanceTotal',
  'breakEvenAccountCurrentBalanceTotalCurrency',
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
  'leverageRatio',
  'contractSize',
  'dollarPerPoint',
  'tickSize',
  'tickValue',
  'lotSize',
  'pipValue',
  'currency',
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
]);

export interface DashboardData {
  trades: Trade[];
  drawdownCapitalBasis?: DrawdownCapitalBasis;
  
  realizedEventTrades?: Trade[];
  metrics: {
    netPnL: number;
    winRate: number;
    profitFactor: number;
    expectancy: number;
    numTrades: number;
    numWinTrades: number;
    numLossTrades: number;
    avgWin: number;
    avgLoss: number;
    avgWinPercent?: number;
    avgLossPercent?: number;
    avgRR?: number;
    avgRRRiskBased?: number;
    
    riskBasedTradesCount?: number;
    
    riskBasedWinTradesCount?: number;
    
    riskBasedLossTradesCount?: number;
    avgWinR?: number;
    avgLossR?: number;
    expectancyR?: number;
    netPnLR?: number;
    maxDrawdown: number;
    maxDrawdownAmountPercent?: number | null;
    maxDrawdownAmountPercentBasisLabel?: string | null;
    bestDay: number;
    largestWin: number;
    largestLoss: number;
    largestWinPercent?: number;
    largestLossPercent?: number;
    longestWinStreak: number;
    longestLossStreak: number;
    avgHoldTime: number;
    avgWinHoldTime: number;
    avgLossHoldTime: number;
    largestWinR?: number;
    largestLossR?: number;
    maxDrawdownR?: number;
    bestDayR?: number;
    percentTimeInDrawdownDays?: number | null;
    averageRecoveryDurationDays?: number | null;
    longestDrawdownDurationDays?: number | null;
    drawdownEpisodeCount?: number;
    avgWinnerHeat?: number;
    winnerMaeP90?: number;
    winnerMaeMedian?: number;
    avgLossHeat?: number;
    winnerAvgMfe?: number;
    loserAvgMfe?: number;
    winnerMfeP90?: number;
    loserMfeP90?: number;
    
    netPnLByCurrency?: Record<string, number>;
    
    isMultiCurrency?: boolean;
    
    primaryCurrency?: string;
    
    convertedNetPnL?: number;
    
    conversionBaseCurrency?: string;
    
    conversionRateDate?: string;
    
    unconvertedCurrencies?: string[];
    
    originalTradeCount?: number;
    
    convertedTradeCount?: number;
    
    brokerBaseCurrencyTradeCount?: number;
  };
}


const fetchTradeData = async (
  app: App,
  tradeService: TradeService,
  filters: FilterState,
  plugin?: JournalitPlugin,
  options?: { freshTradeQuery?: boolean }
): Promise<Trade[]> => {
  try {
    
    const startDate = filters.dateRange[0] || new Date(0); 
    const endDate = filters.dateRange[1] || new Date(); 

    
    

    const analyticsDateBasis = getAnalyticsDateBasis(plugin?.settings);

    
    const tradeFiles = await tradeService.getTrades(startDate, endDate, {
      dateBasis: analyticsDateBasis,
      fresh: options?.freshTradeQuery,
    });
    const customFieldDefinitions =
      plugin?.customFieldsService?.getFields() || [];
    const breakEvenThresholdMode =
      plugin?.settings?.trade?.breakEvenThresholdMode ?? 'fixed';
    const accountBalanceLookup =
      breakEvenThresholdMode === 'percentage_current_balance'
        ? await fetchBreakEvenAccountBalanceLookup(plugin)
        : null;

    const processTradeFile = async (file: TFile): Promise<Trade | null> => {
      try {
        const cachedFrontmatter = app.metadataCache.getFileCache(file)
          ?.frontmatter as Record<string, unknown> | undefined;
        const frontmatter =
          cachedFrontmatter ??
          ((await tradeService.readFrontmatter(file)) as
            | Record<string, unknown>
            | undefined);

        if (!frontmatter || !hasDashboardEntryDate(frontmatter)) {
          return null;
        }

        const customFields = customFieldDefinitions.reduce<
          Record<string, unknown>
        >((acc, fieldDef) => {
          if (
            fieldDef.fieldKey &&
            frontmatter[fieldDef.fieldKey] !== undefined
          ) {
            acc[fieldDef.id] = frontmatter[fieldDef.fieldKey];
          }
          return acc;
        }, {});

        const originalPnlWasNull =
          frontmatter.pnl === undefined || frontmatter.pnl === null;
        const storedTradeType = inferStoredTradeType({
          filePath: file.path,
          type: frontmatter.type,
          isMissedTrade: frontmatter.isMissedTrade,
          isBacktestTrade: frontmatter.isBacktestTrade,
        });
        const normalizedExecution =
          normalizeTradeExecutionForAnalytics(frontmatter);

        const trade: Trade = {
          path: file.path,
          ...normalizedExecution,
          direction: getStringField(frontmatter, 'direction') ?? '',
          pnl:
            frontmatter.pnl !== undefined && frontmatter.pnl !== null
              ? Number(frontmatter.pnl)
              : 0,
          directPnL:
            frontmatter.directPnL !== undefined &&
            frontmatter.directPnL !== null &&
            Number.isFinite(Number(frontmatter.directPnL))
              ? Number(frontmatter.directPnL)
              : undefined,
          tradeStatus: getStringField(frontmatter, 'tradeStatus'),
          useDirectPnLInput: getBooleanField(frontmatter, 'useDirectPnLInput'),
          dividends: parseTradeDividendTransactions(frontmatter.dividends),
          rebate:
            frontmatter.rebate !== undefined && frontmatter.rebate !== null
              ? Number(frontmatter.rebate)
              : undefined,
          _originalPnlWasNull: originalPnlWasNull,
          _analyticsRangeStart: startDate,
          _analyticsRangeEnd: endDate,
          instrument: getStringField(frontmatter, 'instrument'),
          setup: normalizeStringArray(frontmatter.setup),
          mistake: normalizeStringArray(frontmatter.mistake),
          account: normalizeStringArray(frontmatter.account),

          accountId:
            typeof frontmatter.accountId === 'string'
              ? frontmatter.accountId.trim() || undefined
              : typeof frontmatter.accountId === 'number' &&
                  Number.isFinite(frontmatter.accountId)
                ? String(frontmatter.accountId)
                : undefined,
          backendTradeId:
            frontmatter.backendTradeId !== undefined &&
            frontmatter.backendTradeId !== null
              ? (() => {
                  const value = Number(frontmatter.backendTradeId);
                  return Number.isFinite(value) ? value : undefined;
                })()
              : undefined,
          commission:
            frontmatter.commission !== undefined
              ? (() => {
                  const value = Number(frontmatter.commission);
                  return isNaN(value) ? 0 : value;
                })()
              : undefined,
          swap:
            frontmatter.swap !== undefined
              ? (() => {
                  const value = Number(frontmatter.swap);
                  return isNaN(value) ? 0 : value;
                })()
              : undefined,
          fees:
            frontmatter.fees !== undefined
              ? (() => {
                  const value = Number(frontmatter.fees);
                  return isNaN(value) ? 0 : value;
                })()
              : undefined,
          tags: normalizeStringArray(frontmatter.tags),
          customTags: normalizeStringArray(frontmatter.tags),
          assetType: getStringField(frontmatter, 'assetType'),
          optionType: getStringField(frontmatter, 'optionType'),
          stopLoss:
            frontmatter.stopLoss !== undefined
              ? Number(frontmatter.stopLoss)
              : undefined,
          riskAmount:
            frontmatter.riskAmount !== undefined
              ? Number(frontmatter.riskAmount)
              : undefined,
          rMultiple:
            frontmatter.rMultiple !== undefined
              ? Number(frontmatter.rMultiple)
              : undefined,
          leverageRatio:
            frontmatter.leverageRatio !== undefined
              ? Number(frontmatter.leverageRatio)
              : undefined,
          contractSize:
            frontmatter.contractSize !== undefined
              ? Number(frontmatter.contractSize)
              : undefined,
          dollarPerPoint:
            frontmatter.dollarPerPoint !== undefined
              ? Number(frontmatter.dollarPerPoint)
              : undefined,
          tickSize:
            frontmatter.tickSize !== undefined
              ? Number(frontmatter.tickSize)
              : undefined,
          tickValue:
            frontmatter.tickValue !== undefined
              ? Number(frontmatter.tickValue)
              : undefined,
          lotSize:
            frontmatter.lotSize !== undefined
              ? Number(frontmatter.lotSize)
              : undefined,
          pipValue:
            frontmatter.pipValue !== undefined
              ? Number(frontmatter.pipValue)
              : undefined,
          currency: getStringField(frontmatter, 'currency'),
          mae:
            frontmatter.mae !== undefined ? Number(frontmatter.mae) : undefined,
          mfe:
            frontmatter.mfe !== undefined ? Number(frontmatter.mfe) : undefined,
          maePrice:
            frontmatter.maePrice !== undefined
              ? Number(frontmatter.maePrice)
              : undefined,
          mfePrice:
            frontmatter.mfePrice !== undefined
              ? Number(frontmatter.mfePrice)
              : undefined,
          isMissedTrade: storedTradeType === 'missed',
          isBacktestTrade: storedTradeType === 'backtest',
          reviewed: getBooleanField(frontmatter, 'reviewed') ?? false,
          customFields:
            Object.keys(customFields).length > 0 ? customFields : undefined,
          ...Object.fromEntries(
            customFieldDefinitions
              .filter(
                (fieldDef) =>
                  fieldDef.fieldKey &&
                  frontmatter[fieldDef.fieldKey] !== undefined &&
                  !TRADE_PROPERTY_KEYS.has(fieldDef.fieldKey)
              )
              .map((fieldDef) => [
                fieldDef.fieldKey,
                frontmatter[fieldDef.fieldKey],
              ])
          ),
        };

        const accountIdentity = normalizeTradeAccountIdentity(toRecord(trade), {
          resolveAccountIdDisplayName: (accountId) =>
            plugin?.settings?.backendIntegration?.accountMapping?.[accountId],
        });

        trade.accountRefs = accountIdentity.refs;
        trade.accountLookupKeys = accountIdentity.lookupKeys;
        trade.accountNamesNormalized = accountIdentity.accountNames;

        if (accountBalanceLookup) {
          Object.assign(
            trade,
            getBreakEvenAccountBalanceFields(
              resolveBreakEvenAccountBalances(
                toRecord(trade),
                accountBalanceLookup,
                {
                  resolveAccountIdDisplayName: (accountId) =>
                    plugin?.settings?.backendIntegration?.accountMapping?.[
                      accountId
                    ],
                }
              )
            )
          );
        }

        return trade;
      } catch (error) {
        console.error(`Error processing trade file ${file.path}:`, error);
        return null;
      }
    };

    const baseTrades = await Promise.all(tradeFiles.map(processTradeFile));

    const trades = baseTrades.flatMap((trade) =>
      trade
        ? [
            trade,
            ...createCopiedDashboardTrades(trade, filters.accounts, plugin),
          ]
        : [trade]
    );

    const breakEvenRange = normalizeBreakEvenRange(plugin?.settings?.trade);
    const breakEvenSettings: BreakEvenRangeSettings = {
      breakEvenRangeMin: breakEvenRange.min,
      breakEvenRangeMax: breakEvenRange.max,
      breakEvenThresholdMode,
      breakEvenThresholdPercent:
        plugin?.settings?.trade?.breakEvenThresholdPercent,
    };
    const nonNullTrades = trades.filter(
      (trade): trade is Trade => trade !== null
    );

    return applyTradeFilters(nonNullTrades, filters, customFieldDefinitions, {
      resolveAccountIdDisplayName: (accountId) =>
        plugin?.settings?.backendIntegration?.accountMapping?.[accountId],
      isTradeOpen: isTradeOpenInDashboard,
      breakEvenSettings,
      getBreakEvenBalance: (trade) => trade.breakEvenAccountCurrentBalance,
    });
  } catch (error) {
    console.error('Error fetching trade data:', error);
    return [];
  }
};

const createCopiedDashboardTrades = (
  baseTrade: Trade,
  requestedAccounts: string[],
  plugin?: JournalitPlugin
): Trade[] => {
  if (!plugin) {
    return [];
  }

  const accountMetadata = plugin?.settings?.account?.accountMetadata ?? {};
  const includeCopyAccountsInAllAccounts =
    plugin?.settings?.trade?.includeCopyAccountsInAllAccountsAnalytics === true;
  const requestedAccountLookupKeys = new Set(
    requestedAccounts.map((accountName) =>
      normalizeAccountLookupKey(accountName)
    )
  );

  if (
    !includeCopyAccountsInAllAccounts &&
    requestedAccountLookupKeys.size === 0
  ) {
    return [];
  }

  const baseIdentity = normalizeTradeAccountIdentity(toRecord(baseTrade));
  const baseAccountLookupKeys = new Set(baseIdentity.lookupKeys);
  if (baseAccountLookupKeys.size === 0) {
    return [];
  }

  const copiedTrades: Trade[] = [];
  for (const [copyAccountName, copyMetadata] of Object.entries(
    accountMetadata
  )) {
    const copyPeriod = getCopyTradingPeriodForEntryDate(
      copyMetadata,
      baseTrade.entryTime
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
        baseTrade.entryTime,
        plugin?.settings?.general?.currency
      )
    ) {
      continue;
    }

    const copyBaseTradeKey = String(
      baseTrade.path ?? baseTrade.tradeId ?? 'trade'
    );
    const {
      pnl: copiedPnL,
      commission,
      adjustment,
    } = calculateCopiedTradePnL({
      plugin,
      baseTrade: { ...baseTrade, copyBaseTradeKey },
      copyAccountName,
      copyAccountLookupKey,
      multiplier: copyPeriod.multiplier,
    });
    const copiedRiskAmount =
      baseTrade.riskAmount === undefined
        ? undefined
        : baseTrade.riskAmount * copyPeriod.multiplier;

    copiedTrades.push({
      ...baseTrade,
      ...scaleCopiedTradeExecutionFields(baseTrade, copyPeriod.multiplier),
      tradeId: `${baseTrade.tradeId || baseTrade.path || baseTrade.instrument || 'trade'}::copy::${copyAccountLookupKey}`,
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
        baseTrade.directPnL === undefined
          ? undefined
          : baseTrade.directPnL * copyPeriod.multiplier,
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
};


interface CalculateMetricsOptions {
  defaultRiskAmount?: number;
  breakEvenRangeMin?: number;
  breakEvenRangeMax?: number;
  breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
  breakEvenThresholdPercent?: number;
  
  defaultCurrency?: string;
  analyticsDateBasis?: 'entry' | 'exit';
  tradingDayCutoffTime?: string;
  drawdownCapitalBasis?: DrawdownCapitalBasis;
}


export const calculateMetrics = (
  trades: Trade[],
  optionsOrDefaultRiskAmount?: number | CalculateMetricsOptions
): DashboardData['metrics'] => {
  
  const options: CalculateMetricsOptions =
    typeof optionsOrDefaultRiskAmount === 'number'
      ? { defaultRiskAmount: optionsOrDefaultRiskAmount }
      : optionsOrDefaultRiskAmount || {};

  const {
    defaultRiskAmount,
    defaultCurrency = 'USD',
    analyticsDateBasis = 'entry',
    tradingDayCutoffTime,
    drawdownCapitalBasis,
  } = options;
  const { min: breakEvenRangeMin, max: breakEvenRangeMax } =
    normalizeBreakEvenRange(options);
  const breakEvenSettings: BreakEvenRangeSettings = {
    breakEvenRangeMin,
    breakEvenRangeMax,
    breakEvenThresholdMode: options.breakEvenThresholdMode,
    breakEvenThresholdPercent: options.breakEvenThresholdPercent,
  };
  
  if (!trades.length) {
    return {
      netPnL: 0,
      winRate: 0,
      profitFactor: 0,
      expectancy: 0,
      numTrades: 0,
      numWinTrades: 0,
      numLossTrades: 0,
      avgWin: 0,
      avgLoss: 0,
      avgWinPercent: undefined,
      avgLossPercent: undefined,
      avgRR: undefined,
      avgRRRiskBased: undefined,
      riskBasedTradesCount: 0,
      riskBasedWinTradesCount: 0,
      riskBasedLossTradesCount: 0,
      avgWinR: undefined,
      avgLossR: undefined,
      expectancyR: undefined,
      netPnLR: undefined,
      maxDrawdown: 0,
      maxDrawdownAmountPercent: null,
      maxDrawdownAmountPercentBasisLabel: null,
      bestDay: 0,
      largestWin: 0,
      largestLoss: 0,
      largestWinPercent: undefined,
      largestLossPercent: undefined,
      longestWinStreak: 0,
      longestLossStreak: 0,
      avgHoldTime: 0,
      avgWinHoldTime: 0,
      avgLossHoldTime: 0,
      largestWinR: undefined,
      largestLossR: undefined,
      maxDrawdownR: undefined,
      bestDayR: undefined,
      percentTimeInDrawdownDays: null,
      averageRecoveryDurationDays: null,
      longestDrawdownDurationDays: null,
      drawdownEpisodeCount: 0,
      avgWinnerHeat: undefined,
      winnerMaeP90: undefined,
      winnerMaeMedian: undefined,
      avgLossHeat: undefined,
      winnerAvgMfe: undefined,
      loserAvgMfe: undefined,
      winnerMfeP90: undefined,
      loserMfeP90: undefined,
    };
  }

  
  
  
  const contributingTrades = trades.filter((t) => isPnlContributingTrade(t));

  
  
  const closedTrades = contributingTrades.map((trade) =>
    normalizeTradeForMetrics(trade, defaultCurrency)
  );
  
  const netPnLValues = closedTrades.map((t) => getEffectivePnL(t));
  const tradingDayPlugin = tradingDayCutoffTime
    ? ({
        settings: {
          trade: {
            tradingDayCutoffTime,
          },
        },
      } as { settings: { trade: { tradingDayCutoffTime: string } } })
    : undefined;

  const cacheKey = buildMetricsCacheKey(closedTrades, {
    defaultRiskAmount,
    breakEvenRangeMin,
    breakEvenRangeMax,
    breakEvenThresholdMode: options.breakEvenThresholdMode,
    breakEvenThresholdPercent: options.breakEvenThresholdPercent,
    defaultCurrency,
    analyticsDateBasis,
    tradingDayCutoffTime,
    drawdownCapitalBasis: options.drawdownCapitalBasis?.type ?? 'none',
    drawdownCapitalBasisAmount:
      options.drawdownCapitalBasis && 'amount' in options.drawdownCapitalBasis
        ? options.drawdownCapitalBasis.amount
        : 'none',
  });

  const cachedResult = metricsCache.get(cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const totalNetPnL = netPnLValues.reduce((sum, pnl) => sum + pnl, 0);

  
  
  const winningNetPnL: number[] = [];
  const losingNetPnL: number[] = [];
  const winningTrades: NormalizedMetricsTrade[] = [];
  const losingTrades: NormalizedMetricsTrade[] = [];

  for (const [index, trade] of closedTrades.entries()) {
    const pnl = netPnLValues[index] ?? getEffectivePnL(trade);
    const outcome = classifyPnLWithBreakEvenSettings(
      pnl,
      breakEvenSettings,
      trade.breakEvenAccountCurrentBalance
    );

    if (outcome === 'win') {
      winningNetPnL.push(pnl);
      winningTrades.push(trade);
    } else if (outcome === 'loss') {
      losingNetPnL.push(pnl);
      losingTrades.push(trade);
    }
  }

  const winningReturnPercents: number[] = [];
  const losingReturnPercents: number[] = [];
  const hasMatchingReturnPercentSign = (
    bucket: 'win' | 'loss',
    returnPercent: number | undefined
  ): returnPercent is number => {
    if (returnPercent === undefined || isNaN(returnPercent)) {
      return false;
    }

    return bucket === 'win' ? returnPercent > 0 : returnPercent < 0;
  };

  for (const trade of winningTrades) {
    const returnPercent = calculateTradeReturnPercent(trade);
    if (hasMatchingReturnPercentSign('win', returnPercent)) {
      winningReturnPercents.push(returnPercent);
    }
  }

  for (const trade of losingTrades) {
    const returnPercent = calculateTradeReturnPercent(trade);
    if (hasMatchingReturnPercentSign('loss', returnPercent)) {
      losingReturnPercents.push(returnPercent);
    }
  }

  
  const totalProfit = winningNetPnL.reduce((sum, pnl) => sum + pnl, 0);
  const totalLoss = Math.abs(losingNetPnL.reduce((sum, pnl) => sum + pnl, 0));

  
  
  const netPnL = totalNetPnL;
  const winRate = calculateWinRateExcludingBreakeven(
    winningNetPnL.length,
    losingNetPnL.length
  );
  const profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss;

  
  const avgWin =
    winningNetPnL.length > 0 ? totalProfit / winningNetPnL.length : 0;
  const avgLoss = losingNetPnL.length > 0 ? totalLoss / losingNetPnL.length : 0;
  const avgWinPercent =
    winningReturnPercents.length > 0 &&
    winningReturnPercents.length === winningNetPnL.length
      ? winningReturnPercents.reduce((sum, percent) => sum + percent, 0) /
        winningReturnPercents.length
      : undefined;
  const avgLossPercent =
    losingReturnPercents.length > 0 &&
    losingReturnPercents.length === losingNetPnL.length
      ? losingReturnPercents.reduce((sum, percent) => sum + percent, 0) /
        losingReturnPercents.length
      : undefined;

  
  const expectancy = winRate * avgWin - (1 - winRate) * avgLoss;

  
  
  const avgRR = avgWin > 0 && avgLoss > 0 ? avgWin / avgLoss : undefined;

  
  let avgWinR: number | undefined = undefined;
  let avgLossR: number | undefined = undefined;
  let avgRRRiskBased: number | undefined = undefined;
  let riskBasedTradesCount = 0;
  let riskBasedWinTradesCount = 0;
  let riskBasedLossTradesCount = 0;
  let expectancyR: number | undefined = undefined;
  let netPnLR: number | undefined = undefined;

  
  const effectiveRMultiples: number[] = [];
  const breakEvenAwareWinningRMultiples: number[] = [];
  const breakEvenAwareLosingRMultiples: number[] = [];

  for (const trade of closedTrades) {
    const effectiveR = calculateEffectiveRMultiple(
      getEffectivePnL(trade),
      trade.rMultiple,
      trade.riskAmount,
      defaultRiskAmount
    );

    if (effectiveR !== undefined && !isNaN(effectiveR)) {
      effectiveRMultiples.push(effectiveR);

      const pnl = getEffectivePnL(trade);
      const outcome = classifyPnLWithBreakEvenSettings(
        pnl,
        breakEvenSettings,
        trade.breakEvenAccountCurrentBalance
      );

      if (outcome === 'win') {
        breakEvenAwareWinningRMultiples.push(effectiveR);
      } else if (outcome === 'loss') {
        breakEvenAwareLosingRMultiples.push(effectiveR);
      }
    }
  }

  if (effectiveRMultiples.length > 0) {
    const winningRMultiples = effectiveRMultiples.filter((r) => r > 0);
    const losingRMultiples = effectiveRMultiples.filter((r) => r < 0);

    riskBasedTradesCount = effectiveRMultiples.length;
    riskBasedWinTradesCount = breakEvenAwareWinningRMultiples.length;
    riskBasedLossTradesCount = breakEvenAwareLosingRMultiples.length;

    
    netPnLR = effectiveRMultiples.reduce((sum, r) => sum + r, 0);

    
    avgWinR =
      winningRMultiples.length > 0
        ? winningRMultiples.reduce((sum, r) => sum + r, 0) /
          winningRMultiples.length
        : 0;

    
    avgLossR =
      losingRMultiples.length > 0
        ? Math.abs(
            losingRMultiples.reduce((sum, r) => sum + r, 0) /
              losingRMultiples.length
          )
        : 0;

    
    const avgWinRiskBasedR =
      breakEvenAwareWinningRMultiples.length > 0
        ? breakEvenAwareWinningRMultiples.reduce((sum, r) => sum + r, 0) /
          breakEvenAwareWinningRMultiples.length
        : undefined;
    const avgLossRiskBasedR =
      breakEvenAwareLosingRMultiples.length > 0
        ? Math.abs(
            breakEvenAwareLosingRMultiples.reduce((sum, r) => sum + r, 0) /
              breakEvenAwareLosingRMultiples.length
          )
        : undefined;

    avgRRRiskBased =
      avgWinRiskBasedR !== undefined &&
      avgLossRiskBasedR !== undefined &&
      avgWinRiskBasedR > 0 &&
      avgLossRiskBasedR > 0
        ? avgWinRiskBasedR / avgLossRiskBasedR
        : undefined;

    
    const rWinRate = winningRMultiples.length / effectiveRMultiples.length;
    expectancyR = rWinRate * avgWinR - (1 - rWinRate) * avgLossR;
  }

  const drawdownAnalyticsTrades = closedTrades.map((trade) => ({
    ...trade,
    exitTime:
      getTradeAnalyticsDate(trade, analyticsDateBasis) ??
      trade._dashboardRealizedTradingDay ??
      (analyticsDateBasis === 'entry' ? trade.entryTime : trade.exitTime),
    exits: undefined,
  }));

  const drawdownAnalytics = analyzeDrawdown(drawdownAnalyticsTrades, {
    defaultRiskAmount,
    assumeClosedTrades: true,
    capitalBasis: drawdownCapitalBasis,
  });
  const maxDrawdown = drawdownAnalytics.summary.maxDrawdownAmount;
  const maxDrawdownAmountPercent =
    drawdownAnalytics.summary.maxDrawdownAmountPercent;
  const maxDrawdownAmountPercentBasisLabel =
    drawdownAnalytics.summary.basis.percentBasisLabel;
  const percentTimeInDrawdownDays =
    drawdownAnalytics.summary.percentTimeInDrawdownDays;
  const averageRecoveryDurationDays =
    drawdownAnalytics.summary.averageRecoveryDurationDays;
  const longestDrawdownDurationDays =
    drawdownAnalytics.summary.longestDrawdownDurationDays;
  const drawdownEpisodeCount = drawdownAnalytics.summary.episodeCount;

  
  const dailyPnL = new Map<string, number>();
  closedTrades.forEach((trade) => {
    const analyticsDate = getMetricsTradingDay(
      trade,
      analyticsDateBasis,
      tradingDayPlugin
    );
    if (!analyticsDate) {
      return;
    }

    const dateStr = formatLocalDateString(analyticsDate);
    dailyPnL.set(
      dateStr,
      (dailyPnL.get(dateStr) || 0) + getEffectivePnL(trade)
    );
  });
  const bestDay =
    dailyPnL.size > 0 ? Math.max(...Array.from(dailyPnL.values())) : 0;

  const getAuthoritativeExtremePercent = (
    tradesForExtreme: NormalizedMetricsTrade[],
    extremePnL: number,
    bucket: 'win' | 'loss'
  ): number | undefined => {
    const tiedTrades = tradesForExtreme.filter(
      (trade) => getEffectivePnL(trade) === extremePnL
    );

    if (tiedTrades.length === 0) {
      return undefined;
    }

    const computedPercents = tiedTrades.map((trade) =>
      calculateTradeReturnPercent(trade)
    );

    if (
      computedPercents.some(
        (percent) => !hasMatchingReturnPercentSign(bucket, percent)
      )
    ) {
      return undefined;
    }

    const firstPercent = computedPercents[0];
    if (firstPercent === undefined) {
      return undefined;
    }
    const allMatch = computedPercents.every(
      (percent) =>
        percent !== undefined && Math.abs(percent - firstPercent) < 0.0001
    );

    return allMatch ? firstPercent : undefined;
  };

  
  const largestWin = winningNetPnL.length > 0 ? Math.max(...winningNetPnL) : 0;
  const largestWinPercent =
    winningNetPnL.length > 0
      ? getAuthoritativeExtremePercent(winningTrades, largestWin, 'win')
      : undefined;

  
  const largestLoss = losingNetPnL.length > 0 ? Math.min(...losingNetPnL) : 0;
  const largestLossPercent =
    losingNetPnL.length > 0
      ? getAuthoritativeExtremePercent(losingTrades, largestLoss, 'loss')
      : undefined;

  
  const chronologicalTradesByExit = [...closedTrades].sort((a, b) => {
    const dateA = a.exitTime ?? a.entryTime;
    const dateB = b.exitTime ?? b.entryTime;
    const dateComparison = safeDateSort(dateA, dateB);

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return (a.path ?? '').localeCompare(b.path ?? '');
  });

  const { winStreaks, lossStreaks } = calculateHistoricalStreaks(
    chronologicalTradesByExit,
    breakEvenSettings
  );

  const longestWinStreak = winStreaks.length > 0 ? Math.max(...winStreaks) : 0;
  const longestLossStreak =
    lossStreaks.length > 0 ? Math.max(...lossStreaks) : 0;

  
  
  const calculateAvgHoldTime = (trades: NormalizedMetricsTrade[]): number => {
    let totalHoldTime = 0;
    let validTradeCount = 0;

    for (const trade of trades) {
      if (!trade.exitTime) continue;

      const holdTime = trade.exitTime.getTime() - trade.entryTime.getTime();

      
      if (holdTime <= 0) continue;

      totalHoldTime += holdTime;
      validTradeCount++;
    }

    return validTradeCount > 0 ? totalHoldTime / validTradeCount : 0;
  };

  
  const avgHoldTime = calculateAvgHoldTime(closedTrades);
  const avgWinHoldTime = calculateAvgHoldTime(winningTrades);
  const avgLossHoldTime = calculateAvgHoldTime(losingTrades);

  const averageFinite = (values: number[]): number | undefined =>
    values.length > 0
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : undefined;

  const percentileFinite = (
    values: number[],
    percentile: number
  ): number | undefined => {
    if (values.length === 0) return undefined;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.min(Math.max(index, 0), sorted.length - 1)];
  };

  const medianFinite = (values: number[]): number | undefined => {
    if (values.length === 0) return undefined;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];
  };

  const getExcursionSourceKey = (trade: NormalizedMetricsTrade): string =>
    trade._dashboardExcursionSourceKey ??
    formatScalarId(trade.tradeId) ??
    formatScalarId(trade.backendTradeId) ??
    trade.path;

  const collectExcursionValues = (
    sourceTrades: NormalizedMetricsTrade[],
    outcomeBucket: 'win' | 'loss',
    getter: (trade: NormalizedMetricsTrade) => number | undefined
  ): number[] => {
    const values: number[] = [];
    const seenSourceKeys = new Set<string>();

    for (const trade of sourceTrades) {
      const sourceKey = getExcursionSourceKey(trade);
      if (seenSourceKeys.has(sourceKey)) continue;
      seenSourceKeys.add(sourceKey);

      const excursionPnL =
        trade._dashboardExcursionPnL ?? getEffectivePnL(trade);
      const outcome = classifyPnLWithBreakEvenSettings(
        excursionPnL,
        breakEvenSettings,
        trade.breakEvenAccountCurrentBalance
      );
      if (outcome !== outcomeBucket) continue;

      const value = getter(trade);
      if (value !== undefined && Number.isFinite(value)) {
        values.push(Math.abs(value));
      }
    }

    return values;
  };

  const winnerMaeValues = collectExcursionValues(
    closedTrades,
    'win',
    getTradeMaeValue
  );
  const loserMaeValues = collectExcursionValues(
    closedTrades,
    'loss',
    getTradeMaeValue
  );
  const winnerMfeValues = collectExcursionValues(
    closedTrades,
    'win',
    getTradeMfeValue
  );
  const loserMfeValues = collectExcursionValues(
    closedTrades,
    'loss',
    getTradeMfeValue
  );

  const avgWinnerHeat = averageFinite(winnerMaeValues);
  const winnerMaeP90 = percentileFinite(winnerMaeValues, 90);
  const winnerMaeMedian = medianFinite(winnerMaeValues);
  const avgLossHeat = averageFinite(loserMaeValues);
  const winnerAvgMfe = averageFinite(winnerMfeValues);
  const loserAvgMfe = averageFinite(loserMfeValues);
  const winnerMfeP90 = percentileFinite(winnerMfeValues, 90);
  const loserMfeP90 = percentileFinite(loserMfeValues, 90);

  
  let largestWinR: number | undefined = undefined;
  let largestLossR: number | undefined = undefined;
  let maxDrawdownR: number | undefined = undefined;
  let bestDayR: number | undefined = undefined;

  if (effectiveRMultiples.length > 0) {
    
    const winningRMultiples = effectiveRMultiples.filter((r) => r > 0);
    largestWinR =
      winningRMultiples.length > 0 ? Math.max(...winningRMultiples) : undefined;

    
    const losingRMultiples = effectiveRMultiples.filter((r) => r < 0);
    largestLossR =
      losingRMultiples.length > 0 ? Math.min(...losingRMultiples) : undefined;

    
    maxDrawdownR = drawdownAnalytics.summary.maxDrawdownR;

    
    const dailyRMultiples = new Map<string, number>();
    closedTrades.forEach((trade) => {
      const effectiveR = calculateEffectiveRMultiple(
        getEffectivePnL(trade),
        trade.rMultiple,
        trade.riskAmount,
        defaultRiskAmount
      );
      if (effectiveR !== undefined && !isNaN(effectiveR)) {
        const analyticsDate = getMetricsTradingDay(
          trade,
          analyticsDateBasis,
          tradingDayPlugin
        );
        if (!analyticsDate) {
          return;
        }

        const dateStr = formatLocalDateString(analyticsDate);
        dailyRMultiples.set(
          dateStr,
          (dailyRMultiples.get(dateStr) || 0) + effectiveR
        );
      }
    });
    bestDayR =
      dailyRMultiples.size > 0
        ? Math.max(...Array.from(dailyRMultiples.values()))
        : undefined;
  }

  
  const currencyGrouped = aggregatePnLByCurrency(closedTrades, defaultCurrency);

  const metrics = {
    netPnL,
    winRate,
    profitFactor,
    expectancy,
    numTrades: closedTrades.length, 
    numWinTrades: winningNetPnL.length,
    numLossTrades: losingNetPnL.length,
    avgWin,
    avgLoss,
    avgWinPercent,
    avgLossPercent,
    avgRR,
    avgRRRiskBased,
    riskBasedTradesCount,
    riskBasedWinTradesCount,
    riskBasedLossTradesCount,
    avgWinR,
    avgLossR,
    expectancyR,
    netPnLR,
    maxDrawdown,
    maxDrawdownAmountPercent,
    maxDrawdownAmountPercentBasisLabel,
    bestDay,
    largestWin,
    largestLoss,
    largestWinPercent,
    largestLossPercent,
    longestWinStreak,
    longestLossStreak,
    avgHoldTime,
    avgWinHoldTime,
    avgLossHoldTime,
    percentTimeInDrawdownDays,
    averageRecoveryDurationDays,
    longestDrawdownDurationDays,
    drawdownEpisodeCount,
    avgWinnerHeat,
    winnerMaeP90,
    winnerMaeMedian,
    avgLossHeat,
    winnerAvgMfe,
    loserAvgMfe,
    winnerMfeP90,
    loserMfeP90,
    largestWinR,
    largestLossR,
    maxDrawdownR,
    bestDayR,
    
    netPnLByCurrency: currencyGrouped.byCurrency,
    isMultiCurrency: currencyGrouped.isMultiCurrency,
    primaryCurrency: currencyGrouped.defaultCurrency,
  };

  
  metricsCache.set(cacheKey, metrics);

  return metrics;
};

const projectExitDateTradesToRealizedEvents = (
  trades: Trade[],
  plugin?: JournalitPlugin
): Trade[] => {
  const projectedTrades: Trade[] = [];

  for (const trade of trades) {
    const excursionSourceKey =
      trade.tradeId ??
      (trade.backendTradeId !== undefined
        ? String(trade.backendTradeId)
        : null) ??
      trade.path;
    const excursionPnL = getEffectivePnL(trade);
    const events = getTradeRealizedPnlEvents(trade, 'exit', plugin).filter(
      (event) => {
        const rangeStart = trade._analyticsRangeStart;
        const rangeEnd = trade._analyticsRangeEnd;
        return (
          (!rangeStart || event.tradingDay >= rangeStart) &&
          (!rangeEnd || event.tradingDay <= rangeEnd)
        );
      }
    );

    events.forEach((event, index) => {
      projectedTrades.push({
        ...trade,
        path: `${trade.path || trade.instrument || 'trade'}#realized-${index}`,
        tradeStatus: 'CLOSED',
        pnl: event.pnl,
        brokerBaseCurrencyPnl: undefined,
        brokerBaseCurrency: undefined,
        brokerBaseCurrencyPnlSource: undefined,
        directPnL: undefined,
        useDirectPnLInput: false,
        rMultiple: undefined,
        exitTime: event.date,
        exits: undefined,
        _dashboardRealizedTradingDay: event.tradingDay,
        _dashboardExcursionSourceKey: excursionSourceKey,
        _dashboardExcursionPnL: excursionPnL,
        _originalPnlWasNull: false,
      } as Trade);
    });
  }

  return projectedTrades;
};

const getMetricsTradingDay = (
  trade: NormalizedMetricsTrade,
  analyticsDateBasis: 'entry' | 'exit',
  tradingDayPlugin:
    | { settings: { trade: { tradingDayCutoffTime: string } } }
    | undefined
): Date | null =>
  trade._dashboardRealizedTradingDay ??
  getTradeAnalyticsTradingDay(trade, analyticsDateBasis, tradingDayPlugin);


export const fetchDashboardData = async (
  app: App,
  tradeService: TradeService,
  filters: FilterState,
  defaultRiskAmount?: number,
  plugin?: JournalitPlugin,
  options?: { freshTradeQuery?: boolean }
): Promise<DashboardData> => {
  try {
    
    const trades = await fetchTradeData(
      app,
      tradeService,
      filters,
      plugin,
      options
    );

    const breakEvenRangeMin = plugin?.settings?.trade?.breakEvenRangeMin;
    const breakEvenRangeMax = plugin?.settings?.trade?.breakEvenRangeMax;
    const breakEvenThresholdMode =
      plugin?.settings?.trade?.breakEvenThresholdMode;
    const breakEvenThresholdPercent =
      plugin?.settings?.trade?.breakEvenThresholdPercent;

    
    
    const userCurrency = plugin?.settings?.general?.currency || 'USD';

    const analyticsDateBasis = getAnalyticsDateBasis(plugin?.settings);

    
    
    
    
    const rawTradesForMetrics =
      analyticsDateBasis === 'exit'
        ? projectExitDateTradesToRealizedEvents(trades, plugin)
        : trades;

    
    
    
    
    const currencyGrouped = aggregatePnLByCurrency(
      rawTradesForMetrics,
      userCurrency
    );

    let tradesForDisplay = trades;
    let tradesForMetrics = rawTradesForMetrics;
    let conversionMetadata: {
      baseCurrency: string;
      rateDate: string;
      unconvertedCurrencies: string[];
      originalTradeCount: number;
      convertedTradeCount: number;
      brokerBaseCurrencyTradeCount?: number;
    } | null = null;

    
    if (currencyGrouped.isMultiCurrency && plugin) {
      const baseCurrency = plugin.settings?.general?.currency || 'USD';
      const exchangeRateService = new ExchangeRateService(plugin);
      const convertedMetrics = await exchangeRateService.convertTrades(
        rawTradesForMetrics,
        baseCurrency
      );
      if (convertedMetrics) {
        tradesForMetrics = convertedMetrics.trades;
        conversionMetadata = {
          baseCurrency: convertedMetrics.baseCurrency,
          rateDate: convertedMetrics.rateDate,
          unconvertedCurrencies: convertedMetrics.unconvertedCurrencies,
          originalTradeCount: convertedMetrics.originalTradeCount,
          convertedTradeCount: convertedMetrics.convertedTradeCount,
          brokerBaseCurrencyTradeCount:
            convertedMetrics.brokerBaseCurrencyTradeCount,
        };
      }

      const convertedDisplay = await exchangeRateService.convertTrades(
        trades,
        baseCurrency
      );
      if (convertedDisplay) {
        tradesForDisplay = convertedDisplay.trades;
      }
    }

    const accountCapitalByLookupKey =
      await getAccountCapitalBasisLookup(plugin);

    
    const drawdownCapitalBasis = resolveDrawdownCapitalBasis(
      tradesForMetrics,
      plugin?.settings?.account?.accountMetadata,
      {
        filters,
        displayCurrency: conversionMetadata?.baseCurrency ?? userCurrency,
        accountCapitalByLookupKey,
      }
    );
    const metrics = calculateMetrics(tradesForMetrics, {
      defaultRiskAmount,
      breakEvenRangeMin,
      breakEvenRangeMax,
      breakEvenThresholdMode,
      breakEvenThresholdPercent,
      defaultCurrency: userCurrency,
      analyticsDateBasis,
      tradingDayCutoffTime: plugin?.settings?.trade?.tradingDayCutoffTime,
      drawdownCapitalBasis,
    });

    
    if (conversionMetadata) {
      metrics.convertedNetPnL = metrics.netPnL;
      metrics.conversionBaseCurrency = conversionMetadata.baseCurrency;
      metrics.conversionRateDate = conversionMetadata.rateDate;
      metrics.brokerBaseCurrencyTradeCount =
        conversionMetadata.brokerBaseCurrencyTradeCount;
      metrics.unconvertedCurrencies =
        conversionMetadata.unconvertedCurrencies.length > 0
          ? conversionMetadata.unconvertedCurrencies
          : undefined;
      
      if (
        conversionMetadata.originalTradeCount !==
        conversionMetadata.convertedTradeCount
      ) {
        metrics.originalTradeCount = conversionMetadata.originalTradeCount;
        metrics.convertedTradeCount = conversionMetadata.convertedTradeCount;
      }
      
      metrics.netPnLByCurrency = currencyGrouped.byCurrency;
      metrics.isMultiCurrency = true;
      metrics.primaryCurrency = conversionMetadata.baseCurrency;
    }

    
    
    if (currencyGrouped.isMultiCurrency && !conversionMetadata) {
      metrics.percentTimeInDrawdownDays = undefined;
      metrics.averageRecoveryDurationDays = undefined;
      metrics.longestDrawdownDurationDays = undefined;
      metrics.drawdownEpisodeCount = undefined;
    }

    return {
      trades: tradesForDisplay, 
      drawdownCapitalBasis,
      realizedEventTrades:
        analyticsDateBasis === 'exit' ? tradesForMetrics : undefined,
      metrics,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      trades: [],
      metrics: calculateMetrics([], defaultRiskAmount),
    };
  }
};
