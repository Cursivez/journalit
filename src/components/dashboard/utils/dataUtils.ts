

import { App, TFile } from 'obsidian';

import { TradeService } from '../../../services/trade/TradeService';
import { FilterState } from '../DashboardView';
import type {
  AnalyticsDateBasis,
  MaeMfeDisplayUnit,
} from '../../../settings/types';
import {
  getEffectivePnL,
  getPartialExitInfo,
  isPnlContributingTrade,
  isTradeOpenPreservingNullPnl,
} from '../../../utils/tradeStatusUtils';
import {
  areSnapshotKeysClaimedByCustomFields,
  calculateUnrealizedPnL,
} from '../../../utils/unrealizedPnl';

import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { normalizeStringArray } from '../../../utils/dataUtils';
import {
  getAllocatedRealizedPnlEvents,
  getAnalyticsDateBasis,
  getProjectedRealizedEventTrades,
  getTradeAnalyticsDate,
  getTradeAnalyticsTradingDay,
} from '../../../utils/tradeAnalyticsDate';
import { getTradingDay } from '../../../utils/tradingDayUtils';
import {
  type BreakEvenRangeSettings,
  calculateWinRateExcludingBreakeven,
  classifyPnLByBreakEvenRange,
  classifyPnLWithBreakEvenSettings,
  normalizeBreakEvenRange,
} from '../../../utils/breakEvenRange';
import {
  formatLocalDateString,
  parseTradeTimestampValue,
  safeParseDateValue,
  safeDateSort,
} from '../../../utils/dateUtils';
import { parseTradeDividendTransactions } from '../../../utils/tradeUtils';
import { aggregatePnLByCurrency } from '../../../utils/currencyAggregation';
import { ExchangeRateService } from '../../../services/exchangeRate/ExchangeRateService';
import { resolveScopedConversionRateDate } from '../../../services/exchangeRate/conversionAttribution';
import { calculateHistoricalStreaks } from '../../../utils/tradeStreaks';
import { inferStoredTradeType } from '../../../utils/tradeTypeRouting';
import { calculateTradeReturnPercent } from '../../tradelog/tradeMetricUtils';
import {
  getTradeMaeTicks,
  getTradeMaeValue,
  getTradeMfeTicks,
  getTradeMfeValue,
  resolvePreConversionExcursionFields,
} from '../../../utils/tradeExcursion';
import type JournalitPlugin from '../../../main';
import {
  analyzeDrawdown,
  isNonAccountFilterActive,
  resolveDrawdownCapitalBasis,
  type DrawdownCapitalBasis,
} from '../../../utils/drawdownAnalytics';
import {
  type TradeAccountRef,
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from '../../../services/trade/core/TradeAccountIdentity';
import {
  extractCanonicalProjectionPnlFields,
  hasUnknownCanonicalPnL,
} from '../../../services/trade/core/CanonicalProjectionFields';
import {
  type BreakEvenAccountBalanceLookup,
  type BreakEvenAccountBalanceSnapshot,
  fetchBreakEvenAccountBalanceLookup,
  getBreakEvenAccountBalanceFields,
  resolveBreakEvenAccountBalances,
} from '../../../services/trade/core/BreakEvenAccountBalance';
import { normalizeTradeExecutionForAnalytics } from '../../../services/trade/core/TradeExecutionAnalytics';
import { calculateProfitFactor } from '../../../utils/profitFactor';
import { applyTradeFilters } from '../../shared/filters/filterUtils';
import {
  accountsRequiringCopiedRows,
  resolveAccountPhaseWindowsFromPlugin,
} from '../../shared/filters/accountPhaseScope';
import {
  getCopyTradingPeriodForEntryDate,
  isCopyTradingBaseEligible,
} from '../../../utils/accountCopyTrading';
import {
  calculateCopiedTradePnL,
  scaleCopiedTradeExecutionFields,
} from '../../../utils/copyTradePnL';
import { getAccountCapitalBasisLookup } from '../../../utils/accountCapitalBasis';
import {
  calculateCalmarRatio,
  type CalmarUnavailableReason,
} from '../../../utils/calmarRatio';



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

const calculateTradeLevelSharpeRatio = (
  tradeReturns: number[]
): number | undefined => {
  if (tradeReturns.length < 2) {
    return undefined;
  }

  const meanReturn =
    tradeReturns.reduce((sum, value) => sum + value, 0) / tradeReturns.length;
  const sampleVariance =
    tradeReturns.reduce(
      (sum, value) => sum + Math.pow(value - meanReturn, 2),
      0
    ) /
    (tradeReturns.length - 1);
  const sampleStandardDeviation = Math.sqrt(sampleVariance);

  if (sampleStandardDeviation <= Number.EPSILON) {
    return undefined;
  }

  return meanReturn / sampleStandardDeviation;
};

const getStringField = (
  frontmatter: Record<string, unknown>,
  key: string
): string | undefined =>
  typeof frontmatter[key] === 'string' ? frontmatter[key] : undefined;

const getForexPnlConversionRateSource = (
  frontmatter: Record<string, unknown>
): 'automatic' | 'manual' | undefined => {
  const source = getStringField(frontmatter, 'forexPnlConversionRateSource');
  return source === 'automatic' || source === 'manual' ? source : undefined;
};

const getCommissionTypeField = (
  frontmatter: Record<string, unknown>
): 'fixed' | 'percentage' | undefined => {
  const value = getStringField(frontmatter, 'commissionType');
  return value === 'fixed' || value === 'percentage' ? value : undefined;
};

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

const getFiniteNonNegativeNumberField = (
  frontmatter: Record<string, unknown>,
  key: string
): number | undefined => {
  const value = frontmatter[key];
  if (value === undefined || value === null) return undefined;

  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
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

const DATE_ONLY_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getDateOnlyExecutionTime = (value: unknown): string | undefined => {
  if (!isRecord(value)) return undefined;
  const time = value.time;
  return typeof time === 'string' && DATE_ONLY_TIMESTAMP_PATTERN.test(time)
    ? time
    : undefined;
};

const preserveDateOnlyExecutionTimes = (
  normalizedExecution: ReturnType<typeof normalizeTradeExecutionForAnalytics>,
  frontmatter: Record<string, unknown>
): ReturnType<typeof normalizeTradeExecutionForAnalytics> => {
  const rawEntries = Array.isArray(frontmatter.entries)
    ? frontmatter.entries
    : [];
  const rawExits = Array.isArray(frontmatter.exits) ? frontmatter.exits : [];
  return {
    ...normalizedExecution,
    entries: normalizedExecution.entries.map((entry, index) => ({
      ...entry,
      time: getDateOnlyExecutionTime(rawEntries[index]) ?? entry.time,
    })),
    exits: normalizedExecution.exits.map((exit, index) => ({
      ...exit,
      time: getDateOnlyExecutionTime(rawExits[index]) ?? exit.time,
    })),
  };
};

interface DashboardDataFetchOptions {
  freshTradeQuery?: boolean;
  dateBasisOverride?: AnalyticsDateBasis;
  executionScopedDateRange?: boolean;
}

const hasTimestampInRange = (
  value: unknown,
  startDate: Date,
  endDate: Date,
  plugin?: JournalitPlugin,
  basis?: AnalyticsDateBasis
): boolean => {
  const timestamp = parseTradeTimestampValue(value);
  if (timestamp && timestamp >= startDate && timestamp <= endDate) return true;
  if (!plugin || !basis || typeof value !== 'string') return false;
  const analyticsTradingDay = getTradeAnalyticsTradingDay(
    basis === 'entry' ? { entryTime: value } : { exitTime: value },
    basis,
    plugin
  );
  if (!analyticsTradingDay) return false;
  const startTradingDay = getTradingDay(startDate, plugin);
  const endTradingDay = getTradingDay(endDate, plugin);
  return (
    analyticsTradingDay >= startTradingDay &&
    analyticsTradingDay <= endTradingDay
  );
};

const hasExecutionInDateRange = (
  trade: Record<string, unknown>,
  startDate: Date,
  endDate: Date,
  plugin?: JournalitPlugin
): boolean => {
  if (hasTimestampInRange(trade.entryTime, startDate, endDate, plugin, 'entry'))
    return true;
  if (hasTimestampInRange(trade.exitTime, startDate, endDate, plugin, 'exit'))
    return true;

  const entries = Array.isArray(trade.entries) ? trade.entries : [];
  if (
    entries.some(
      (entry) =>
        isRecord(entry) &&
        hasTimestampInRange(entry.time, startDate, endDate, plugin, 'entry')
    )
  ) {
    return true;
  }

  const exits = Array.isArray(trade.exits) ? trade.exits : [];
  return exits.some(
    (exit) =>
      isRecord(exit) &&
      hasTimestampInRange(exit.time, startDate, endDate, plugin, 'exit')
  );
};

const getExecutionScopedTradeFiles = async (
  app: App,
  tradeService: TradeService,
  startDate: Date,
  endDate: Date,
  fresh: boolean | undefined,
  plugin?: JournalitPlugin
): Promise<TFile[]> => {
  const tradeFiles: TFile[] = [];
  for (const value of await tradeService.getTradeData({ fresh })) {
    if (!isRecord(value)) continue;
    if (!hasExecutionInDateRange(value, startDate, endDate, plugin)) continue;
    const path = value.path;
    if (typeof path !== 'string') continue;
    const file = app.vault.getAbstractFileByPath(path);
    if (file instanceof TFile) tradeFiles.push(file);
  }
  return tradeFiles;
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

const appendMetricsTradeFingerprint = (
  fingerprint: number,
  trade: NormalizedMetricsTrade
): number => {
  fingerprint = appendHash(fingerprint, trade.path);
  fingerprint = appendHash(fingerprint, trade.entryTime.toISOString());
  fingerprint = appendHash(
    fingerprint,
    trade.exitTime ? trade.exitTime.toISOString() : ''
  );
  fingerprint = appendHash(
    fingerprint,
    trade._dashboardRealizedTradingDay?.toISOString() ?? ''
  );
  fingerprint = appendHash(
    fingerprint,
    trade._dashboardExcursionSourceKey ?? ''
  );
  fingerprint = appendHash(fingerprint, trade._dashboardExcursionPnL ?? '');
  fingerprint = appendHash(fingerprint, trade.pnl);
  fingerprint = appendHash(fingerprint, trade.directPnL);
  fingerprint = appendHash(fingerprint, trade.useDirectPnLInput);
  fingerprint = appendHash(fingerprint, trade.entryPrice);
  fingerprint = appendHash(fingerprint, trade.exitPrice);
  fingerprint = appendHash(fingerprint, trade.positionSize);
  fingerprint = appendHash(fingerprint, trade.direction);
  fingerprint = appendHash(fingerprint, trade.assetType);
  fingerprint = appendHash(fingerprint, trade.leverageRatio);
  fingerprint = appendHash(fingerprint, trade.contractSize);
  fingerprint = appendHash(fingerprint, trade.dollarPerPoint);
  fingerprint = appendHash(fingerprint, trade.tickSize);
  fingerprint = appendHash(fingerprint, trade.tickValue);
  fingerprint = appendHash(fingerprint, trade.lotSize);
  fingerprint = appendHash(fingerprint, trade.pipValue);
  fingerprint = hashJsonValue(fingerprint, trade.entries ?? []);
  fingerprint = hashJsonValue(fingerprint, trade.exits ?? []);
  fingerprint = appendHash(fingerprint, trade.rMultiple);
  fingerprint = appendHash(fingerprint, trade.riskAmount);
  fingerprint = appendHash(fingerprint, trade.mae);
  fingerprint = appendHash(fingerprint, trade.mfe);
  fingerprint = appendHash(fingerprint, trade.originalMaeBeforeConversion);
  fingerprint = appendHash(fingerprint, trade.originalMfeBeforeConversion);
  fingerprint = appendHash(fingerprint, trade.maeAmountDerivedFromPrice);
  fingerprint = appendHash(fingerprint, trade.mfeAmountDerivedFromPrice);
  fingerprint = appendHash(fingerprint, trade.maeTicksBeforeConversion);
  fingerprint = appendHash(fingerprint, trade.mfeTicksBeforeConversion);
  fingerprint = appendHash(fingerprint, trade.maePrice);
  fingerprint = appendHash(fingerprint, trade.mfePrice);
  fingerprint = appendHash(fingerprint, trade.currency);
  fingerprint = appendHash(
    fingerprint,
    trade.breakEvenAccountCurrentBalance ?? 'na'
  );
  fingerprint = appendHash(
    fingerprint,
    trade.breakEvenAccountCurrentBalanceTotal ?? 'na'
  );
  return fingerprint;
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
    calmarHistoryIncomplete: boolean;
    maeMfeDisplayUnit: MaeMfeDisplayUnit;
    sharpeRatioTrades: NormalizedMetricsTrade[];
    tickExcursionSupplementTrades: NormalizedMetricsTrade[];
  }
): string => {
  let tradeFingerprint = 0;
  for (const trade of trades) {
    tradeFingerprint = appendMetricsTradeFingerprint(tradeFingerprint, trade);
  }

  let sharpeRatioFingerprint = 0;
  for (const trade of options.sharpeRatioTrades) {
    sharpeRatioFingerprint = appendHash(sharpeRatioFingerprint, trade.path);
    sharpeRatioFingerprint = appendHash(
      sharpeRatioFingerprint,
      trade.entryTime.toISOString()
    );
    sharpeRatioFingerprint = appendHash(
      sharpeRatioFingerprint,
      trade.exitTime ? trade.exitTime.toISOString() : ''
    );
    sharpeRatioFingerprint = appendHash(sharpeRatioFingerprint, trade.pnl);
    sharpeRatioFingerprint = appendHash(
      sharpeRatioFingerprint,
      trade.directPnL
    );
    sharpeRatioFingerprint = appendHash(
      sharpeRatioFingerprint,
      trade.useDirectPnLInput
    );
    sharpeRatioFingerprint = hashJsonValue(
      sharpeRatioFingerprint,
      trade.dividends ?? []
    );
    sharpeRatioFingerprint = appendHash(
      sharpeRatioFingerprint,
      trade.commission
    );
    sharpeRatioFingerprint = appendHash(sharpeRatioFingerprint, trade.swap);
    sharpeRatioFingerprint = appendHash(sharpeRatioFingerprint, trade.fees);
    sharpeRatioFingerprint = appendHash(sharpeRatioFingerprint, trade.rebate);
    sharpeRatioFingerprint = appendHash(sharpeRatioFingerprint, trade.currency);
  }

  let tickExcursionSupplementFingerprint = 0;
  for (const trade of options.tickExcursionSupplementTrades) {
    tickExcursionSupplementFingerprint = appendMetricsTradeFingerprint(
      tickExcursionSupplementFingerprint,
      trade
    );
  }

  return [
    trades.length,
    tradeFingerprint,
    options.sharpeRatioTrades.length,
    sharpeRatioFingerprint,
    options.tickExcursionSupplementTrades.length,
    tickExcursionSupplementFingerprint,
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
    options.calmarHistoryIncomplete,
    options.maeMfeDisplayUnit,
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


const hasIncompleteCalmarHistory = (trades: Trade[]): boolean =>
  trades.some((trade) => {
    if (trade.tradeStatus === 'CANCELLED') return false;
    if (
      isTradeOpenInDashboard(trade) &&
      trade.tradeStatus !== 'PARTIALLY_CLOSED'
    )
      return false;
    if (hasUnknownCanonicalPnL(trade)) return true;
    const missingStoredPnL =
      trade._originalPnlWasNull === true || !Number.isFinite(trade.pnl);
    const knownDirectPnL =
      trade.useDirectPnLInput === true && Number.isFinite(trade.directPnL);
    return missingStoredPnL && !knownDirectPnL;
  });


export const getSnapshotTimelineRealizedAdjustment = (
  trade: Trade,
  plugin?: Parameters<typeof getAllocatedRealizedPnlEvents>[2],
  analyticsDateBasis: AnalyticsDateBasis = 'entry'
): number => {
  const capturedAt = safeParseDateValue(trade.unrealizedPriceSnapshotTime);
  if (!capturedAt) return 0;

  const rangeStart = safeParseDateValue(trade._analyticsRangeStart);
  const rangeEnd = safeParseDateValue(trade._analyticsRangeEnd);
  const isInRange = (tradingDay: Date): boolean =>
    analyticsDateBasis !== 'exit' ||
    ((!rangeStart || tradingDay >= rangeStart) &&
      (!rangeEnd || tradingDay <= rangeEnd));

  const existedAtCapture = (
    time: Date | string | null | undefined
  ): boolean => {
    const parsed = safeParseDateValue(time);
    return !parsed || parsed <= capturedAt;
  };
  const includedCurrentExits = (trade.exits ?? []).filter((exit) => {
    const exitedAt = safeParseDateValue(exit.time);
    return (
      !exitedAt ||
      exitedAt <= capturedAt ||
      isInRange(getTradingDay(exitedAt, plugin))
    );
  });
  const hasIncludedPostCaptureExit = includedCurrentExits.some((exit) => {
    const exitedAt = safeParseDateValue(exit.time);
    return exitedAt !== null && exitedAt > capturedAt;
  });
  const executionOnlyTrade = {
    ...trade,
    exits: includedCurrentExits,
    commission: undefined,
    swap: undefined,
    fees: undefined,
    rebate: undefined,
  };
  const captureExecutionTrade = {
    ...executionOnlyTrade,
    entries: trade.entries?.filter((entry) => existedAtCapture(entry.time)),
    exits: includedCurrentExits.filter((exit) => existedAtCapture(exit.time)),
  };
  
  
  
  const currentExecutionPnL =
    getPartialExitInfo(executionOnlyTrade).realizedPnL;
  const captureExecutionPnL = getPartialExitInfo(
    captureExecutionTrade
  ).realizedPnL;
  const conversionPnlFactor =
    typeof trade.conversionPnlFactor === 'number' &&
    Number.isFinite(trade.conversionPnlFactor) &&
    trade.conversionPnlFactor > 0
      ? trade.conversionPnlFactor
      : 1;
  const postCaptureExecutionPnL =
    (hasIncludedPostCaptureExit
      ? currentExecutionPnL - captureExecutionPnL
      : 0) * conversionPnlFactor;
  const postCaptureDividends = (trade.dividends ?? []).reduce(
    (total, dividend) => {
      const paidAt = safeParseDateValue(dividend.time);
      const timelineDividendAmount =
        typeof dividend.amount === 'number' && Number.isFinite(dividend.amount)
          ? trade.originalCurrency !== undefined &&
            typeof trade.unrealizedPnlConversionRate === 'number' &&
            trade.unrealizedPnlConversionRate > 0
            ? (dividend.amount / trade.unrealizedPnlConversionRate) *
              conversionPnlFactor
            : dividend.amount
          : undefined;
      return paidAt &&
        paidAt > capturedAt &&
        isInRange(getTradingDay(paidAt, plugin)) &&
        timelineDividendAmount !== undefined
        ? total + timelineDividendAmount
        : total;
    },
    0
  );
  const postCaptureRealizedPnL = postCaptureExecutionPnL + postCaptureDividends;
  return postCaptureRealizedPnL === 0 ? 0 : -postCaptureRealizedPnL;
};

const getDashboardExcursionSourceKey = (trade: Trade): string =>
  trade.tradeId ??
  (trade.backendTradeId !== undefined
    ? String(trade.backendTradeId)
    : undefined) ??
  trade.path;

const getSnapshotTimelineRealizedContribution = (
  trade: Trade,
  plugin: Parameters<typeof getAllocatedRealizedPnlEvents>[2],
  analyticsDateBasis: AnalyticsDateBasis,
  hasProjectedRealizedContribution: boolean
): number => {
  
  
  
  if (analyticsDateBasis !== 'exit' || hasProjectedRealizedContribution) {
    return getSnapshotTimelineRealizedAdjustment(
      trade,
      plugin,
      analyticsDateBasis
    );
  }

  const capturedAt = safeParseDateValue(trade.unrealizedPriceSnapshotTime);
  const hasRealizedEventAtOrBeforeCapture =
    capturedAt !== null &&
    getAllocatedRealizedPnlEvents(trade, 'exit', plugin).some(
      ({ event }) => event.date <= capturedAt
    );
  
  
  if (hasRealizedEventAtOrBeforeCapture) {
    return 0;
  }

  
  
  
  return (
    getEffectivePnL(trade) +
    getSnapshotTimelineRealizedAdjustment(trade, plugin, 'entry')
  );
};


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
  authoritativePnl?: number | null;
  canonicalTradeId?: string;
  canonicalTradeVersion?: number;
  canonicalProjectionSchemaVersion?: number;
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
  _dashboardExcursionFxExcluded?: boolean;
  instrument?: string;
  setup?: string[];
  mistake?: string[];
  account?: string[];

  accountId?: string; 
  canonicalAccountId?: string;
  canonicalAccountIdentity?: 'broker' | 'name';
  accountRefs?: TradeAccountRef[];
  accountLookupKeys?: string[];
  accountNamesNormalized?: string[];
  
  breakEvenAccountCurrentBalanceSnapshots?: BreakEvenAccountBalanceSnapshot[];
  
  breakEvenAccountCurrentBalance?: number;
  
  breakEvenAccountCurrentBalanceCurrency?: string;
  
  breakEvenAccountCurrentBalanceTotal?: number;
  
  breakEvenAccountCurrentBalanceTotalCurrency?: string;
  commission?: number;
  commissionType?: 'fixed' | 'percentage';
  swap?: number;
  fees?: number;
  tags?: string[]; 
  customTags?: string[]; 
  assetType?: string; 
  optionType?: string; 
  stopLoss?: number; 
  takeProfits?: Array<{
    price?: number;
    closePercent?: number;
    size?: number;
  }>;
  riskAmount?: number; 
  rMultiple?: number; 
  leverageRatio?: number; 
  contractSize?: number;
  dollarPerPoint?: number;
  tickSize?: number;
  tickValue?: number;
  lotSize?: number;
  pipValue?: number;
  pipSize?: number;
  forexQuoteCurrency?: string;
  forexPnlConversionRate?: number;
  forexPnlConversionBaseCurrency?: string;
  forexPnlConversionRateDate?: string;
  forexPnlConversionRateSource?: 'automatic' | 'manual';
  currency?: string; 
  fxRate?: number; 
  fxRateBaseCurrency?: string; 
  brokerBaseCurrencyPnl?: number; 
  brokerBaseCurrency?: string; 
  brokerBaseCurrencyPnlSource?: string; 
  originalCurrency?: string;
  
  conversionPnlFactor?: number;
  
  originalPnlBeforeConversion?: number;
  originalMaeBeforeConversion?: number;
  originalMfeBeforeConversion?: number;
  maeAmountDerivedFromPrice?: boolean;
  mfeAmountDerivedFromPrice?: boolean;
  maeTicksBeforeConversion?: number;
  mfeTicksBeforeConversion?: number;
  conversionUsedManualRate?: boolean;
  conversionUsedFetchedRates?: boolean;
  mae?: number; 
  mfe?: number; 
  maePrice?: number; 
  mfePrice?: number; 
  
  unrealizedPriceSnapshot?: number;
  
  unrealizedPriceSnapshotTime?: string;
  
  unrealizedPnlConversionRate?: number;

  
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
  'breakEvenAccountCurrentBalanceSnapshots',
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
  'pipSize',
  'forexQuoteCurrency',
  'forexPnlConversionRate',
  'forexPnlConversionBaseCurrency',
  'forexPnlConversionRateDate',
  'forexPnlConversionRateSource',
  'currency',
  'fxRate',
  'fxRateBaseCurrency',
  'brokerBaseCurrencyPnl',
  'brokerBaseCurrency',
  'brokerBaseCurrencyPnlSource',
  'originalMaeBeforeConversion',
  'originalMfeBeforeConversion',
  'maeAmountDerivedFromPrice',
  'mfeAmountDerivedFromPrice',
  'maeTicksBeforeConversion',
  'mfeTicksBeforeConversion',
  'mae',
  'mfe',
  'maePrice',
  'mfePrice',
  'unrealizedPriceSnapshot',
  'unrealizedPriceSnapshotTime',
  
  
  'originalCurrency',
  'unrealizedPnlConversionRate',
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
  
  excursionTrades?: Trade[];
  
  unrealizedTrades?: Trade[];
  drawdownCapitalBasis?: DrawdownCapitalBasis;
  
  realizedEventTrades?: Trade[];
  metrics: {
    netPnL: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio?: number;
    calmarRatio?: number;
    calmarRatioUnavailableReason?: CalmarUnavailableReason;
    
    sharpeRatioTradeCount?: number;
    
    sharpeRatioSourceTradeCount?: number;
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
    unrealizedPnLR?: number;
    
    unrealizedTradeCount?: number;
    
    unrealizedRTradeCount?: number;
    
    snapshotTimelineRealizedPnLContribution?: number;
    
    unrealizedPnL?: number;
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
    winnerExcursionSourceTradeCount?: number;
    loserExcursionSourceTradeCount?: number;
    winnerMaeEligibleTradeCount?: number;
    loserMaeEligibleTradeCount?: number;
    winnerMfeEligibleTradeCount?: number;
    loserMfeEligibleTradeCount?: number;
    
    netPnLByCurrency?: Record<string, number>;
    
    isMultiCurrency?: boolean;
    
    primaryCurrency?: string;
    
    convertedNetPnL?: number;
    
    conversionBaseCurrency?: string;
    
    conversionRateDate?: string;
    
    unconvertedCurrencies?: string[];
    
    partiallyConvertedCurrencies?: string[];
    
    originalTradeCount?: number;
    
    convertedTradeCount?: number;
    
    brokerBaseCurrencyTradeCount?: number;
    
    manualFxRateTradeCount?: number;
  };
}


const fetchTradeData = async (
  app: App,
  tradeService: TradeService,
  filters: FilterState,
  plugin?: JournalitPlugin,
  options?: DashboardDataFetchOptions
): Promise<Trade[]> => {
  try {
    
    const startDate = filters.dateRange[0] || new Date(0); 
    const endDate = filters.dateRange[1] || new Date(); 

    
    

    const analyticsDateBasis =
      options?.dateBasisOverride ?? getAnalyticsDateBasis(plugin?.settings);

    
    const tradeFiles = options?.executionScopedDateRange
      ? await getExecutionScopedTradeFiles(
          app,
          tradeService,
          startDate,
          endDate,
          options.freshTradeQuery,
          plugin
        )
      : await tradeService.getTrades(startDate, endDate, {
          dateBasis: analyticsDateBasis,
          fresh: options?.freshTradeQuery,
          includeUnrealizedPnL:
            plugin?.settings?.trade?.includeUnrealizedPnLInCalculations ===
            true,
        });
    const customFieldDefinitions =
      plugin?.customFieldsService?.getFields() || [];
    const snapshotKeysClaimedByCustomFields =
      areSnapshotKeysClaimedByCustomFields(customFieldDefinitions);
    const breakEvenThresholdMode =
      plugin?.settings?.trade?.breakEvenThresholdMode ?? 'fixed';
    const accountBalanceLookup =
      breakEvenThresholdMode === 'percentage_current_balance'
        ? await fetchBreakEvenAccountBalanceLookup(plugin)
        : null;

    const processTradeFile = async (file: TFile): Promise<Trade | null> => {
      try {
        const cachedFrontmatter =
          app.metadataCache.getFileCache(file)?.frontmatter;
        const frontmatter =
          cachedFrontmatter ?? (await tradeService.readFrontmatter(file));

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
        const normalizedExecution = preserveDateOnlyExecutionTimes(
          normalizeTradeExecutionForAnalytics(frontmatter),
          frontmatter
        );

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
          ...extractCanonicalProjectionPnlFields(frontmatter),
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
          canonicalAccountId:
            getStringField(frontmatter, 'canonicalAccountId')?.trim() ||
            undefined,
          canonicalAccountIdentity: (() => {
            const identity = getStringField(
              frontmatter,
              'canonicalAccountIdentity'
            );
            return identity === 'broker' || identity === 'name'
              ? identity
              : undefined;
          })(),
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
          commissionType: getCommissionTypeField(frontmatter),
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
          takeProfits: Array.isArray(frontmatter.takeProfits)
            ? frontmatter.takeProfits.flatMap((target) => {
                if (!isRecord(target)) return [];
                return [
                  {
                    ...(target.price !== undefined && {
                      price: Number(target.price),
                    }),
                    ...(target.closePercent !== undefined && {
                      closePercent: Number(target.closePercent),
                    }),
                    ...(target.size !== undefined && {
                      size: Number(target.size),
                    }),
                  },
                ];
              })
            : [],
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
          pipSize:
            frontmatter.pipSize !== undefined
              ? Number(frontmatter.pipSize)
              : undefined,
          forexQuoteCurrency: getStringField(frontmatter, 'forexQuoteCurrency'),
          forexPnlConversionRate:
            frontmatter.forexPnlConversionRate !== undefined
              ? Number(frontmatter.forexPnlConversionRate)
              : undefined,
          forexPnlConversionBaseCurrency: getStringField(
            frontmatter,
            'forexPnlConversionBaseCurrency'
          ),
          forexPnlConversionRateDate: getStringField(
            frontmatter,
            'forexPnlConversionRateDate'
          ),
          forexPnlConversionRateSource:
            getForexPnlConversionRateSource(frontmatter),
          currency: getStringField(frontmatter, 'currency'),
          fxRate:
            frontmatter.fxRate !== undefined
              ? Number(frontmatter.fxRate)
              : undefined,
          fxRateBaseCurrency: getStringField(frontmatter, 'fxRateBaseCurrency'),
          brokerBaseCurrencyPnl:
            frontmatter.brokerBaseCurrencyPnl !== undefined
              ? Number(frontmatter.brokerBaseCurrencyPnl)
              : undefined,
          brokerBaseCurrency: getStringField(frontmatter, 'brokerBaseCurrency'),
          brokerBaseCurrencyPnlSource: getStringField(
            frontmatter,
            'brokerBaseCurrencyPnlSource'
          ),
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
          
          
          unrealizedPriceSnapshot: !snapshotKeysClaimedByCustomFields
            ? getFiniteNonNegativeNumberField(
                frontmatter,
                'unrealizedPriceSnapshot'
              )
            : undefined,
          unrealizedPriceSnapshotTime: snapshotKeysClaimedByCustomFields
            ? undefined
            : getStringField(frontmatter, 'unrealizedPriceSnapshotTime'),
          isMissedTrade: storedTradeType === 'missed',
          isBacktestTrade: storedTradeType === 'backtest',
          reviewed: getBooleanField(frontmatter, 'reviewed') ?? false,
          customFields:
            Object.keys(customFields).length > 0 ? customFields : undefined,
          ...Object.fromEntries(
            customFieldDefinitions.flatMap((fieldDef) =>
              fieldDef.fieldKey &&
              frontmatter[fieldDef.fieldKey] !== undefined &&
              !TRADE_PROPERTY_KEYS.has(fieldDef.fieldKey)
                ? [[fieldDef.fieldKey, frontmatter[fieldDef.fieldKey]]]
                : []
            )
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

    
    
    const copyMaterializationAccounts = accountsRequiringCopiedRows(
      filters.accounts,
      filters.accountPhases
    );
    const trades = baseTrades.flatMap((trade) =>
      trade
        ? [
            trade,
            ...createCopiedDashboardTrades(
              trade,
              copyMaterializationAccounts,
              plugin,
              accountBalanceLookup
            ),
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
      accountPhaseWindows: resolveAccountPhaseWindowsFromPlugin(
        filters.accountPhases,
        plugin
      ),
    });
  } catch (error) {
    console.error('Error fetching trade data:', error);
    return [];
  }
};

const createCopiedDashboardTrades = (
  baseTrade: Trade,
  requestedAccounts: string[],
  plugin: JournalitPlugin | undefined,
  accountBalanceLookup: BreakEvenAccountBalanceLookup | null
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

    const copiedTrade: Trade = {
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
      pnl: copiedPnL ?? 0,
      _originalPnlWasNull:
        copiedPnL === null ? true : baseTrade._originalPnlWasNull,
      directPnL:
        baseTrade.directPnL === undefined
          ? undefined
          : baseTrade.directPnL * copyPeriod.multiplier,
      riskAmount: copiedRiskAmount,
      rMultiple:
        copiedPnL !== null && copiedRiskAmount && copiedRiskAmount !== 0
          ? copiedPnL / copiedRiskAmount
          : copiedPnL === null
            ? undefined
            : baseTrade.rMultiple,
      commission: commission ?? 0,
      commissionType: 'fixed',
      fees: 0,
      currency: baseTrade.currency ?? copyMetadata.currency,
      
      
      
      brokerBaseCurrencyPnl: undefined,
      brokerBaseCurrency: undefined,
      brokerBaseCurrencyPnlSource: undefined,
      breakEvenAccountCurrentBalanceSnapshots: undefined,
      breakEvenAccountCurrentBalance: undefined,
      breakEvenAccountCurrentBalanceCurrency: undefined,
      breakEvenAccountCurrentBalanceTotal: undefined,
      breakEvenAccountCurrentBalanceTotalCurrency: undefined,
      isCopiedTrade: true,
      copiedFromAccount: copyPeriod.baseAccount,
      copyMultiplier: copyPeriod.multiplier,
      copyAccountLookupKey,
      copyPnlAdjustment: adjustment,
      copyBaseTradeKey,
    };

    if (accountBalanceLookup) {
      Object.assign(
        copiedTrade,
        getBreakEvenAccountBalanceFields(
          resolveBreakEvenAccountBalances(
            toRecord(copiedTrade),
            accountBalanceLookup
          )
        )
      );
    }

    copiedTrades.push(copiedTrade);
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
  maeMfeDisplayUnit?: MaeMfeDisplayUnit;
  
  calmarHistoryIncomplete?: boolean;
  
  sharpeRatioTrades?: Trade[];
  
  unrealizedPnlTrades?: Trade[];
  
  tickExcursionSupplementTrades?: Trade[];
}

const resolveBaseCurrencyUnrealizedContribution = (
  trade: Trade,
  baseCurrency: string
): number | null => {
  const unrealizedPnL = calculateUnrealizedPnL(trade);
  if (unrealizedPnL === null) return null;
  if ((trade.currency || baseCurrency) !== baseCurrency) return null;

  if (trade.originalCurrency === undefined) {
    return unrealizedPnL;
  }
  if (trade.unrealizedPnlConversionRate === undefined) {
    return null;
  }

  return unrealizedPnL * trade.unrealizedPnlConversionRate;
};

type ExcursionMetrics = Pick<
  DashboardData['metrics'],
  | 'avgWinnerHeat'
  | 'winnerMaeP90'
  | 'winnerMaeMedian'
  | 'avgLossHeat'
  | 'winnerAvgMfe'
  | 'loserAvgMfe'
  | 'winnerMfeP90'
  | 'loserMfeP90'
  | 'winnerExcursionSourceTradeCount'
  | 'loserExcursionSourceTradeCount'
  | 'winnerMaeEligibleTradeCount'
  | 'loserMaeEligibleTradeCount'
  | 'winnerMfeEligibleTradeCount'
  | 'loserMfeEligibleTradeCount'
>;


const isWholeTradeInAnalyticsRange = (
  trade: Trade,
  analyticsDateBasis: AnalyticsDateBasis,
  tradingDayPlugin: Parameters<typeof getTradeAnalyticsTradingDay>[2]
): boolean => {
  const fallbackAnalyticsDate = safeParseDateValue(
    analyticsDateBasis === 'entry' ? trade.entryTime : trade.exitTime
  );
  const analyticsTradingDay =
    getTradeAnalyticsTradingDay(trade, analyticsDateBasis, tradingDayPlugin) ??
    (fallbackAnalyticsDate
      ? getTradingDay(fallbackAnalyticsDate, tradingDayPlugin)
      : null);
  if (!analyticsTradingDay) return false;
  const rangeStart = trade._analyticsRangeStart
    ? safeParseDateValue(trade._analyticsRangeStart)
    : undefined;
  const rangeEnd = trade._analyticsRangeEnd
    ? safeParseDateValue(trade._analyticsRangeEnd)
    : undefined;
  return (
    (!rangeStart || analyticsTradingDay >= rangeStart) &&
    (!rangeEnd || analyticsTradingDay <= rangeEnd)
  );
};

const calculateExcursionMetrics = (
  sourceTrades: NormalizedMetricsTrade[],
  breakEvenSettings: BreakEvenRangeSettings,
  displayUnit: MaeMfeDisplayUnit
): ExcursionMetrics => {
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
  const collectValues = (
    outcomeBucket: 'win' | 'loss',
    getter: (trade: NormalizedMetricsTrade) => number | undefined
  ): { values: number[]; sourceTradeCount: number } => {
    const values: number[] = [];
    const seenSourceKeys = new Set<string>();
    let sourceTradeCount = 0;

    for (const trade of sourceTrades) {
      const sourceKey = getExcursionSourceKey(trade);
      if (seenSourceKeys.has(sourceKey)) continue;
      seenSourceKeys.add(sourceKey);

      const excursionPnL =
        trade._dashboardExcursionPnL ?? getEffectivePnL(trade);
      
      
      const outcome = trade._dashboardExcursionFxExcluded
        ? classifyPnLByBreakEvenRange(excursionPnL, { min: 0, max: 0 })
        : classifyPnLWithBreakEvenSettings(
            excursionPnL,
            breakEvenSettings,
            trade.breakEvenAccountCurrentBalance
          );
      if (outcome !== outcomeBucket) continue;
      sourceTradeCount++;

      const value = getter(trade);
      if (value !== undefined && Number.isFinite(value)) {
        values.push(Math.abs(value));
      }
    }

    return { values, sourceTradeCount };
  };
  const maeGetter =
    displayUnit === 'ticks' ? getTradeMaeTicks : getTradeMaeValue;
  const mfeGetter =
    displayUnit === 'ticks' ? getTradeMfeTicks : getTradeMfeValue;
  const winnerMae = collectValues('win', maeGetter);
  const loserMae = collectValues('loss', maeGetter);
  const winnerMfe = collectValues('win', mfeGetter);
  const loserMfe = collectValues('loss', mfeGetter);

  return {
    avgWinnerHeat: averageFinite(winnerMae.values),
    winnerMaeP90: percentileFinite(winnerMae.values, 90),
    winnerMaeMedian: medianFinite(winnerMae.values),
    avgLossHeat: averageFinite(loserMae.values),
    winnerAvgMfe: averageFinite(winnerMfe.values),
    loserAvgMfe: averageFinite(loserMfe.values),
    winnerMfeP90: percentileFinite(winnerMfe.values, 90),
    loserMfeP90: percentileFinite(loserMfe.values, 90),
    winnerExcursionSourceTradeCount: winnerMae.sourceTradeCount,
    loserExcursionSourceTradeCount: loserMae.sourceTradeCount,
    winnerMaeEligibleTradeCount: winnerMae.values.length,
    loserMaeEligibleTradeCount: loserMae.values.length,
    winnerMfeEligibleTradeCount: winnerMfe.values.length,
    loserMfeEligibleTradeCount: loserMfe.values.length,
  };
};


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
    maeMfeDisplayUnit = 'dollar',
  } = options;
  const { min: breakEvenRangeMin, max: breakEvenRangeMax } =
    normalizeBreakEvenRange(options);
  const breakEvenSettings: BreakEvenRangeSettings = {
    breakEvenRangeMin,
    breakEvenRangeMax,
    breakEvenThresholdMode: options.breakEvenThresholdMode,
    breakEvenThresholdPercent: options.breakEvenThresholdPercent,
  };
  const tradingDayPlugin = tradingDayCutoffTime
    ? {
        settings: {
          trade: {
            tradingDayCutoffTime,
          },
        },
      }
    : undefined;
  
  
  
  
  const unrealizedPnlSourceTrades = options.unrealizedPnlTrades ?? [];
  let unrealizedPnL: number | undefined;
  let unrealizedPnLR: number | undefined;
  let snapshotTimelineRealizedPnLContribution: number | undefined;
  let snapshotTimelineRAdjustment: number | undefined;
  let unrealizedTradeCount = 0;
  let unrealizedRTradeCount = 0;
  
  
  const metricSourceKeys = new Set<string>();
  if (unrealizedPnlSourceTrades.length > 0) {
    for (const trade of trades) {
      if (isPnlContributingTrade(trade)) {
        metricSourceKeys.add(
          trade._dashboardExcursionSourceKey ??
            getDashboardExcursionSourceKey(trade)
        );
      }
    }
  }
  const projectedRealizedSourceKeys = new Set<string>();
  if (analyticsDateBasis === 'exit' && unrealizedPnlSourceTrades.length > 0) {
    for (const trade of trades) {
      if (trade._dashboardExcursionSourceKey) {
        projectedRealizedSourceKeys.add(trade._dashboardExcursionSourceKey);
      }
    }
  }
  for (const trade of unrealizedPnlSourceTrades) {
    const contributionAmount = resolveBaseCurrencyUnrealizedContribution(
      trade,
      defaultCurrency
    );
    if (contributionAmount === null) {
      continue;
    }

    unrealizedPnL = (unrealizedPnL ?? 0) + contributionAmount;
    const unrealizedR = calculateEffectiveRMultiple(
      contributionAmount,
      undefined,
      trade.riskAmount,
      defaultRiskAmount
    );
    if (unrealizedR !== undefined) {
      unrealizedPnLR = (unrealizedPnLR ?? 0) + unrealizedR;
    }
    if (!metricSourceKeys.has(getDashboardExcursionSourceKey(trade))) {
      unrealizedTradeCount += 1;
      if (unrealizedR !== undefined) unrealizedRTradeCount += 1;
    }

    const hasProjectedRealizedContribution =
      analyticsDateBasis === 'exit' &&
      projectedRealizedSourceKeys.has(getDashboardExcursionSourceKey(trade));
    const snapshotTimelineRealizedContributionAmount =
      getSnapshotTimelineRealizedContribution(
        trade,
        tradingDayPlugin,
        analyticsDateBasis,
        hasProjectedRealizedContribution
      );
    snapshotTimelineRealizedPnLContribution =
      (snapshotTimelineRealizedPnLContribution ?? 0) +
      snapshotTimelineRealizedContributionAmount;
    const snapshotTimelineR = calculateEffectiveRMultiple(
      snapshotTimelineRealizedContributionAmount,
      undefined,
      trade.riskAmount,
      defaultRiskAmount
    );
    if (snapshotTimelineR !== undefined) {
      snapshotTimelineRAdjustment =
        (snapshotTimelineRAdjustment ?? 0) + snapshotTimelineR;
    }
  }
  const tickExcursionSupplementTrades: NormalizedMetricsTrade[] = [];
  if (maeMfeDisplayUnit === 'ticks') {
    for (const trade of options.tickExcursionSupplementTrades ?? []) {
      if (
        !isPnlContributingTrade(trade) ||
        trade.assetType?.trim().toLowerCase() !== 'futures'
      ) {
        continue;
      }
      tickExcursionSupplementTrades.push(
        normalizeTradeForMetrics(
          { ...trade, _dashboardExcursionFxExcluded: true },
          defaultCurrency
        )
      );
    }
  }
  
  if (!trades.length) {
    return {
      unrealizedPnL,
      unrealizedPnLR,
      unrealizedTradeCount,
      unrealizedRTradeCount,
      snapshotTimelineRealizedPnLContribution,
      netPnL: 0,
      winRate: 0,
      profitFactor: 0,
      sharpeRatio: undefined,
      calmarRatio: undefined,
      calmarRatioUnavailableReason: options.calmarHistoryIncomplete
        ? 'incomplete-history'
        : 'no-history',
      sharpeRatioTradeCount: 0,
      sharpeRatioSourceTradeCount: 0,
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
      netPnLR:
        unrealizedPnLR === undefined &&
        snapshotTimelineRAdjustment === undefined
          ? undefined
          : (unrealizedPnLR ?? 0) + (snapshotTimelineRAdjustment ?? 0),
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
      ...calculateExcursionMetrics(
        tickExcursionSupplementTrades,
        breakEvenSettings,
        maeMfeDisplayUnit
      ),
    };
  }

  
  
  
  const calmarHistoryIncomplete =
    options.calmarHistoryIncomplete ?? hasIncompleteCalmarHistory(trades);
  const contributingTrades = trades.filter((t) => isPnlContributingTrade(t));

  
  
  const closedTrades = contributingTrades.map((trade) =>
    normalizeTradeForMetrics(trade, defaultCurrency)
  );
  const sharpeRatioInputTrades =
    options.sharpeRatioTrades ?? contributingTrades;
  
  
  const sharpeRatioTrades: NormalizedMetricsTrade[] = [];
  for (const trade of sharpeRatioInputTrades) {
    if (
      !isPnlContributingTrade(trade) ||
      isTradeOpenInDashboard(trade) ||
      !isWholeTradeInAnalyticsRange(trade, analyticsDateBasis, tradingDayPlugin)
    ) {
      continue;
    }

    sharpeRatioTrades.push(normalizeTradeForMetrics(trade, defaultCurrency));
  }
  
  const netPnLValues = closedTrades.map((t) => getEffectivePnL(t));

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
    calmarHistoryIncomplete,
    drawdownCapitalBasisAmount:
      options.drawdownCapitalBasis && 'amount' in options.drawdownCapitalBasis
        ? options.drawdownCapitalBasis.amount
        : 'none',
    maeMfeDisplayUnit,
    sharpeRatioTrades,
    tickExcursionSupplementTrades,
  });

  const cachedResult = metricsCache.get(cacheKey);
  if (cachedResult !== undefined) {
    return {
      ...cachedResult,
      unrealizedPnL,
      unrealizedPnLR,
      unrealizedTradeCount,
      unrealizedRTradeCount,
      snapshotTimelineRealizedPnLContribution,
      netPnLR:
        unrealizedPnLR === undefined &&
        snapshotTimelineRAdjustment === undefined
          ? cachedResult.netPnLR
          : (cachedResult.netPnLR ?? 0) +
            (unrealizedPnLR ?? 0) +
            (snapshotTimelineRAdjustment ?? 0),
    };
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
  const profitFactor = calculateProfitFactor(totalProfit, totalLoss);

  
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

  const sharpeRatioValues: number[] = [];
  for (const trade of sharpeRatioTrades) {
    const pnl = getEffectivePnL(trade);
    if (Number.isFinite(pnl)) {
      sharpeRatioValues.push(pnl);
    }
  }
  const sharpeRatioSourceTradeCount = sharpeRatioTrades.length;
  const sharpeRatioTradeCount = sharpeRatioValues.length;
  const sharpeRatio = calculateTradeLevelSharpeRatio(sharpeRatioValues);

  
  
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
  const calmar: ReturnType<typeof calculateCalmarRatio> =
    calmarHistoryIncomplete
      ? { reason: 'incomplete-history' }
      : calculateCalmarRatio(drawdownAnalytics, drawdownCapitalBasis);
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

  const excursionMetrics = calculateExcursionMetrics(
    [...closedTrades, ...tickExcursionSupplementTrades],
    breakEvenSettings,
    maeMfeDisplayUnit
  );

  
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
    sharpeRatio,
    calmarRatio: calmar.value,
    calmarRatioUnavailableReason: calmar.reason,
    sharpeRatioTradeCount,
    sharpeRatioSourceTradeCount,
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
    unrealizedPnLR: undefined,
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
    ...excursionMetrics,
    largestWinR,
    largestLossR,
    maxDrawdownR,
    bestDayR,
    
    netPnLByCurrency: currencyGrouped.byCurrency,
    isMultiCurrency: currencyGrouped.isMultiCurrency,
    primaryCurrency: currencyGrouped.defaultCurrency,
  };

  
  
  metricsCache.set(cacheKey, metrics);

  return {
    ...metrics,
    unrealizedPnL,
    unrealizedPnLR,
    unrealizedTradeCount,
    unrealizedRTradeCount,
    snapshotTimelineRealizedPnLContribution,
    netPnLR:
      unrealizedPnLR === undefined && snapshotTimelineRAdjustment === undefined
        ? metrics.netPnLR
        : (metrics.netPnLR ?? 0) +
          (unrealizedPnLR ?? 0) +
          (snapshotTimelineRAdjustment ?? 0),
  };
};


const isSnapshotCaptureInExitRange = (
  trade: Trade,
  plugin?: JournalitPlugin
): boolean => {
  if (trade.unrealizedPriceSnapshot === undefined) {
    return true;
  }

  const rangeStart = safeParseDateValue(trade._analyticsRangeStart);
  const rangeEnd = safeParseDateValue(trade._analyticsRangeEnd);
  if (!rangeStart && !rangeEnd) {
    return true;
  }

  const captureTime = safeParseDateValue(trade.unrealizedPriceSnapshotTime);
  const captureDay = captureTime
    ? getTradingDay(captureTime, plugin)
    : getTradeAnalyticsTradingDay(trade, 'entry', plugin);
  if (!captureDay) {
    return false;
  }

  return (
    (!rangeStart || captureDay >= rangeStart) &&
    (!rangeEnd || captureDay <= rangeEnd)
  );
};

const isSnapshotOnlyExitRangeTrade = (
  trade: Trade,
  plugin?: JournalitPlugin
): boolean => {
  if (
    trade.unrealizedPriceSnapshot === undefined ||
    !isTradeOpenPreservingNullPnl(trade) ||
    !isSnapshotCaptureInExitRange(trade, plugin)
  ) {
    return false;
  }

  const rangeStart = safeParseDateValue(trade._analyticsRangeStart);
  const rangeEnd = safeParseDateValue(trade._analyticsRangeEnd);
  const isInRange = (tradingDay: Date): boolean =>
    (!rangeStart || tradingDay >= rangeStart) &&
    (!rangeEnd || tradingDay <= rangeEnd);

  const exitTradingDay = getTradeAnalyticsTradingDay(trade, 'exit', plugin);
  if (exitTradingDay && isInRange(exitTradingDay)) {
    return false;
  }

  return !getAllocatedRealizedPnlEvents(trade, 'exit', plugin).some(
    ({ event }) => isInRange(event.tradingDay)
  );
};

const hasDisplayableUnrealizedContribution = (
  trade: Trade,
  baseCurrency: string
): boolean =>
  resolveBaseCurrencyUnrealizedContribution(trade, baseCurrency) !== null;

const projectExitDateTradesToRealizedEvents = (
  trades: Trade[],
  plugin?: JournalitPlugin
): Trade[] => {
  const projectedTrades: Trade[] = [];

  for (const trade of trades) {
    const excursionSourceKey = getDashboardExcursionSourceKey(trade);
    const excursionPnL = getEffectivePnL(trade);
    const rangeStart = trade._analyticsRangeStart;
    const rangeEnd = trade._analyticsRangeEnd;
    const events = getProjectedRealizedEventTrades(trade, plugin).filter(
      ({ event }) =>
        (!rangeStart || event.tradingDay >= rangeStart) &&
        (!rangeEnd || event.tradingDay <= rangeEnd)
    );
    events.forEach(({ trade: projectedTrade, event, originalIndex }) => {
      projectedTrades.push({
        ...projectedTrade,
        path: `${trade.path || trade.instrument || 'trade'}#realized-${originalIndex}`,
        _dashboardRealizedTradingDay: event.tradingDay,
        _dashboardExcursionSourceKey: excursionSourceKey,
        _dashboardExcursionPnL: excursionPnL,
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

const applyUnconvertedDisplayMetadata = (
  metrics: DashboardData['metrics'],
  trades: Trade[],
  baseCurrency: string
): void => {
  const unconvertedCurrencies = new Set<string>();
  let baseCurrencyTradeCount = 0;
  for (const trade of trades) {
    const currency = trade.currency || baseCurrency;
    if (currency === baseCurrency) {
      baseCurrencyTradeCount += 1;
    } else {
      unconvertedCurrencies.add(currency);
    }
  }

  metrics.isMultiCurrency = true;
  metrics.unconvertedCurrencies =
    unconvertedCurrencies.size > 0
      ? Array.from(unconvertedCurrencies)
      : undefined;
  metrics.originalTradeCount = trades.length;
  metrics.convertedTradeCount = baseCurrencyTradeCount;

  const snapshotRealizedContribution =
    metrics.snapshotTimelineRealizedPnLContribution;
  if (snapshotRealizedContribution) {
    
    
    metrics.netPnLByCurrency = {
      ...metrics.netPnLByCurrency,
      [baseCurrency]:
        (metrics.netPnLByCurrency?.[baseCurrency] ?? 0) +
        snapshotRealizedContribution,
    };
  }
};


export const fetchDashboardData = async (
  app: App,
  tradeService: TradeService,
  filters: FilterState,
  defaultRiskAmount?: number,
  plugin?: JournalitPlugin,
  options?: DashboardDataFetchOptions
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

    
    
    const userCurrency: string = plugin?.settings?.general?.currency || 'USD';

    const analyticsDateBasis = getAnalyticsDateBasis(plugin?.settings);

    const calmarHistoryIncomplete = hasIncompleteCalmarHistory(trades);

    
    
    
    
    const rawTradesForMetrics =
      analyticsDateBasis === 'exit'
        ? projectExitDateTradesToRealizedEvents(trades, plugin)
        : trades;

    
    
    
    
    const currencyGrouped = aggregatePnLByCurrency(
      rawTradesForMetrics,
      userCurrency
    );

    const includeUnrealizedPnL =
      plugin?.settings?.trade?.includeUnrealizedPnLInCalculations === true;

    let tradesForDisplay = trades;
    let tradesForSharpe = trades;
    let excursionTrades = trades;
    let tradesForUnrealized = trades;
    let tradesForMetrics = rawTradesForMetrics;
    let tickExcursionSupplementTrades: Trade[] = [];
    let conversionMetadata: {
      baseCurrency: string;
      rateDate: string;
      unconvertedCurrencies: string[];
      partiallyConvertedCurrencies?: string[];
      originalTradeCount: number;
      convertedTradeCount: number;
      brokerBaseCurrencyTradeCount?: number;
      manualFxRateTradeCount?: number;
    } | null = null;

    
    
    
    const needsCurrencyConversion = trades.length > 0;

    if (needsCurrencyConversion && plugin) {
      const baseCurrency = userCurrency;
      const exchangeRateService = new ExchangeRateService(plugin);
      
      
      
      
      const withExplicitExcursions = (list: Trade[]): Trade[] =>
        list.map((trade) => {
          if ((trade.currency || userCurrency) === userCurrency) return trade;
          const resolution = resolvePreConversionExcursionFields(trade);
          return resolution.changed
            ? { ...trade, ...resolution.fields }
            : trade;
        });
      
      
      
      
      const convertedDisplay = await exchangeRateService.convertTrades(
        withExplicitExcursions(trades),
        baseCurrency,
        baseCurrency,
        { includeUnrealizedPnl: includeUnrealizedPnL }
      );
      if (convertedDisplay) {
        tradesForDisplay = convertedDisplay.trades;
        tradesForSharpe = convertedDisplay.trades;
        
        excursionTrades = [
          ...convertedDisplay.trades,
          ...convertedDisplay.excludedTrades,
        ];
        tradesForUnrealized = convertedDisplay.trades;
        
        
        
        
        conversionMetadata = {
          baseCurrency: convertedDisplay.baseCurrency,
          rateDate: convertedDisplay.rateDate,
          unconvertedCurrencies: convertedDisplay.unconvertedCurrencies,
          partiallyConvertedCurrencies:
            convertedDisplay.partiallyConvertedCurrencies,
          originalTradeCount: convertedDisplay.originalTradeCount,
          convertedTradeCount: convertedDisplay.convertedTradeCount,
          brokerBaseCurrencyTradeCount:
            convertedDisplay.brokerBaseCurrencyTradeCount,
          manualFxRateTradeCount: convertedDisplay.manualFxRateTradeCount,
        };
      } else {
        
        
        
        tradesForUnrealized = trades.filter((trade) =>
          hasDisplayableUnrealizedContribution(trade, userCurrency)
        );
      }

      const metricsConversionInput =
        withExplicitExcursions(rawTradesForMetrics);
      const convertedMetrics = await exchangeRateService.convertTrades(
        metricsConversionInput,
        baseCurrency,
        baseCurrency,
        { includeUnrealizedPnl: includeUnrealizedPnL }
      );
      if (convertedMetrics) {
        tradesForMetrics = convertedMetrics.trades;
        tickExcursionSupplementTrades = convertedMetrics.excludedTrades;
        if (
          analyticsDateBasis === 'exit' &&
          options?.executionScopedDateRange !== true
        ) {
          
          
          tradesForDisplay = convertedMetrics.trades;
        }
        if (conversionMetadata) {
          const realizedSourceRows = convertedMetrics.trades.filter((trade) =>
            isPnlContributingTrade(trade)
          );
          const unrealizedSourceRows = tradesForUnrealized.filter(
            (trade) =>
              (analyticsDateBasis !== 'exit' ||
                isSnapshotCaptureInExitRange(trade, plugin)) &&
              calculateUnrealizedPnL(trade) !== null
          );
          const scopedSourceRows = [
            ...realizedSourceRows,
            ...unrealizedSourceRows,
          ];
          const brokerSourceKeys = new Set<string>();
          const manualSourceKeys = new Set<string>();
          for (const trade of realizedSourceRows) {
            const sourceKey =
              trade.tradeId ?? trade._dashboardExcursionSourceKey ?? trade.path;
            if (
              typeof trade.brokerBaseCurrencyPnl === 'number' &&
              Number.isFinite(trade.brokerBaseCurrencyPnl) &&
              trade.brokerBaseCurrencyPnl !== 0 &&
              trade.brokerBaseCurrency === convertedMetrics.baseCurrency &&
              trade.originalCurrency !== convertedMetrics.baseCurrency
            ) {
              brokerSourceKeys.add(sourceKey);
            }
          }
          for (const trade of scopedSourceRows) {
            const sourceKey =
              trade.tradeId ?? trade._dashboardExcursionSourceKey ?? trade.path;
            if (trade.conversionUsedManualRate === true) {
              manualSourceKeys.add(sourceKey);
            }
          }
          conversionMetadata.rateDate = resolveScopedConversionRateDate(
            scopedSourceRows,
            convertedMetrics.rateDate,
            manualSourceKeys.size
          );
          conversionMetadata.unconvertedCurrencies = Array.from(
            new Set([
              ...conversionMetadata.unconvertedCurrencies,
              ...convertedMetrics.unconvertedCurrencies,
            ])
          );
          conversionMetadata.partiallyConvertedCurrencies = Array.from(
            new Set([
              ...(conversionMetadata.partiallyConvertedCurrencies ?? []),
              ...(convertedMetrics.partiallyConvertedCurrencies ?? []),
            ])
          );
          conversionMetadata.brokerBaseCurrencyTradeCount =
            brokerSourceKeys.size;
          conversionMetadata.manualFxRateTradeCount = manualSourceKeys.size;
        }
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
      calmarHistoryIncomplete,
      defaultRiskAmount,
      breakEvenRangeMin,
      breakEvenRangeMax,
      breakEvenThresholdMode,
      breakEvenThresholdPercent,
      defaultCurrency: userCurrency,
      analyticsDateBasis,
      tradingDayCutoffTime: plugin?.settings?.trade?.tradingDayCutoffTime,
      drawdownCapitalBasis,
      maeMfeDisplayUnit: plugin?.settings?.trade?.maeMfeDisplayUnit ?? 'dollar',
      sharpeRatioTrades: tradesForSharpe,
      unrealizedPnlTrades: includeUnrealizedPnL
        ? analyticsDateBasis === 'exit'
          ? tradesForUnrealized.filter((trade) =>
              isSnapshotCaptureInExitRange(trade, plugin)
            )
          : tradesForUnrealized
        : [],
      tickExcursionSupplementTrades,
    });

    
    
    if (
      isNonAccountFilterActive(filters) ||
      (filters.directions?.length ?? 0) > 0 ||
      (filters.accountPhases?.length ?? 0) > 0 ||
      (filters.reviewStatus?.length ?? 0) > 0 ||
      (filters.imageAnnotationStatus?.length ?? 0) > 0 ||
      (filters.imageTags?.length ?? 0) > 0
    ) {
      metrics.calmarRatio = undefined;
      metrics.calmarRatioUnavailableReason = 'scope';
    }

    
    if (conversionMetadata) {
      if (
        conversionMetadata.unconvertedCurrencies.length > 0 ||
        (conversionMetadata.partiallyConvertedCurrencies?.length ?? 0) > 0 ||
        conversionMetadata.originalTradeCount !==
          conversionMetadata.convertedTradeCount
      ) {
        
        metrics.calmarRatio = undefined;
        metrics.calmarRatioUnavailableReason = 'conversion';
      }
      metrics.convertedNetPnL = metrics.netPnL;
      metrics.conversionBaseCurrency = conversionMetadata.baseCurrency;
      metrics.conversionRateDate = conversionMetadata.rateDate;
      metrics.brokerBaseCurrencyTradeCount =
        conversionMetadata.brokerBaseCurrencyTradeCount;
      metrics.manualFxRateTradeCount =
        conversionMetadata.manualFxRateTradeCount;
      metrics.unconvertedCurrencies =
        conversionMetadata.unconvertedCurrencies.length > 0
          ? conversionMetadata.unconvertedCurrencies
          : undefined;
      metrics.partiallyConvertedCurrencies =
        conversionMetadata.partiallyConvertedCurrencies &&
        conversionMetadata.partiallyConvertedCurrencies.length > 0
          ? conversionMetadata.partiallyConvertedCurrencies
          : undefined;
      
      if (
        conversionMetadata.originalTradeCount !==
        conversionMetadata.convertedTradeCount
      ) {
        metrics.originalTradeCount = conversionMetadata.originalTradeCount;
        metrics.convertedTradeCount = conversionMetadata.convertedTradeCount;
      }
      
      metrics.netPnLByCurrency = currencyGrouped.byCurrency;
      metrics.isMultiCurrency =
        currencyGrouped.currencies.some(
          (currency) => currency !== conversionMetadata.baseCurrency
        ) ||
        tradesForUnrealized.some(
          (trade) =>
            isSnapshotCaptureInExitRange(trade, plugin) &&
            calculateUnrealizedPnL(trade) !== null &&
            (trade.originalCurrency ?? trade.currency ?? userCurrency) !==
              conversionMetadata.baseCurrency
        ) ||
        conversionMetadata.unconvertedCurrencies.length > 0 ||
        (conversionMetadata.partiallyConvertedCurrencies?.length ?? 0) > 0;
      metrics.primaryCurrency = conversionMetadata.baseCurrency;
    }

    if (needsCurrencyConversion && !conversionMetadata) {
      
      
      
      applyUnconvertedDisplayMetadata(metrics, trades, userCurrency);
      
      
      
      metrics.percentTimeInDrawdownDays = undefined;
      metrics.averageRecoveryDurationDays = undefined;
      metrics.longestDrawdownDurationDays = undefined;
      metrics.drawdownEpisodeCount = undefined;
      metrics.calmarRatio = undefined;
      metrics.calmarRatioUnavailableReason = 'conversion';
    }

    const separateSnapshotOnlyTrades =
      analyticsDateBasis === 'exit' &&
      options?.executionScopedDateRange !== true;
    const unrealizedTrades =
      separateSnapshotOnlyTrades && includeUnrealizedPnL
        ? tradesForUnrealized.filter(
            (trade) =>
              isSnapshotOnlyExitRangeTrade(trade, plugin) &&
              hasDisplayableUnrealizedContribution(trade, userCurrency)
          )
        : undefined;
    const displayTrades = separateSnapshotOnlyTrades
      ? tradesForDisplay.filter(
          (trade) => !isSnapshotOnlyExitRangeTrade(trade, plugin)
        )
      : tradesForDisplay;

    return {
      trades: displayTrades,
      excursionTrades: excursionTrades.filter((trade) =>
        isWholeTradeInAnalyticsRange(trade, analyticsDateBasis, plugin)
      ),
      unrealizedTrades,
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
