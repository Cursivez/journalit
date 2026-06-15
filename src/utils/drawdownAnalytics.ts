import { calculateEffectiveRMultiple } from './formatting';
import { safeGetTime, safeParseDateValue } from './dateUtils';
import { isTradeOpenWithContext } from './tradeStatusUtils';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export type DrawdownDirection = 'combined' | 'long' | 'short';

type DrawdownCurveType = 'realizedPnl' | 'strategyAllocation';

export type DrawdownCapitalBasis =
  | { type: 'none' }
  | { type: 'startingEquity'; amount: number; label?: string }
  | { type: 'fixedCapital'; amount: number; label?: string };

interface DrawdownBasisMetadata {
  curveType: DrawdownCurveType;
  capitalBasisType: DrawdownCapitalBasis['type'];
  percentBasisLabel: string | null;
  percentUnavailableReason: 'capital-basis-required' | null;
}

interface DrawdownAnalyzableTrade {
  path?: string;
  entryTime?: Date | string | null;
  exitTime?: Date | string | null;
  pnl?: number | null;
  direction?: string | null;
  tradeStatus?: string;
  useDirectPnLInput?: boolean;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  _originalPnlWasNull?: boolean;
  riskAmount?: number;
  rMultiple?: number;
}

interface DrawdownAnalyticsPoint<TTrade extends DrawdownAnalyzableTrade> {
  trade: TTrade;
  tradeIndex: number;
  realizedAt: Date | null;
  realizedAtMs: number | null;
  pnl: number;
  cumulativeRealizedPnl: number;
  peakCumulativeRealizedPnl: number;
  basisValue: number | null;
  peakBasisValue: number | null;
  drawdownAmount: number;
  drawdownPercent: number | null;
  drawdownPercentBasisValue: number | null;
  drawdownPercentBasisLabel: string | null;
  rMultiple: number;
  hasEffectiveRMultiple: boolean;
  cumulativeR: number;
  peakCumulativeR: number;
  drawdownR: number;
  drawdownRComplete: boolean;
  isNewPeak: boolean;
}

interface DrawdownEpisode<TTrade extends DrawdownAnalyzableTrade> {
  startPoint: DrawdownAnalyticsPoint<TTrade>;
  troughPoint: DrawdownAnalyticsPoint<TTrade>;
  recoveryPoint: DrawdownAnalyticsPoint<TTrade> | null;
  endPoint: DrawdownAnalyticsPoint<TTrade>;
  recovered: boolean;
  maxDrawdownAmount: number;
  maxDrawdownPercent: number | null;
  maxDrawdownPercentBasisValue: number | null;
  maxDrawdownR: number;
  maxDrawdownRComplete: boolean;
  durationTrades: number;
  durationMs: number | null;
  durationDays: number | null;
  recoveryDurationTrades: number | null;
  recoveryDurationMs: number | null;
  recoveryDurationDays: number | null;
}

interface DrawdownAnalyticsSummary {
  totalClosedTrades: number;
  maxDrawdownAmount: number;
  maxDrawdownAmountPercent: number | null;
  maxDrawdownAmountPercentBasisValue: number | null;
  maxDrawdownPercent: number | null;
  maxDrawdownAmountR: number;
  maxDrawdownAmountRComplete: boolean;
  maxDrawdownR: number;
  maxDrawdownRComplete: boolean;
  currentDrawdownAmount: number;
  currentDrawdownPercent: number | null;
  currentDrawdownR: number;
  currentDrawdownRComplete: boolean;
  currentlyInDrawdown: boolean;
  episodeCount: number;
  recoveredEpisodeCount: number;
  unrecoveredEpisodeCount: number;
  underwaterTradeCount: number;
  percentTimeInDrawdownTrades: number;
  percentTimeInDrawdownDays: number | null;
  averageDrawdownDurationTrades: number;
  averageDrawdownDurationDays: number | null;
  averageRecoveryDurationTrades: number | null;
  averageRecoveryDurationDays: number | null;
  longestDrawdownDurationTrades: number;
  longestDrawdownDurationDays: number | null;
  totalTimeSpanMs: number | null;
  totalTimeSpanDays: number | null;
  underwaterTimeMs: number | null;
  underwaterTimeDays: number | null;
  hasIncompleteRealizedTimestamps: boolean;
  basis: DrawdownBasisMetadata;
}

interface DrawdownAnalyticsResult<TTrade extends DrawdownAnalyzableTrade> {
  direction: DrawdownDirection;
  trades: TTrade[];
  points: DrawdownAnalyticsPoint<TTrade>[];
  episodes: DrawdownEpisode<TTrade>[];
  summary: DrawdownAnalyticsSummary;
}

interface AnalyzeDrawdownOptions {
  direction?: DrawdownDirection;
  defaultRiskAmount?: number;
  assumeClosedTrades?: boolean;
  curveType?: DrawdownCurveType;
  capitalBasis?: DrawdownCapitalBasis;
}

interface DrawdownCapitalBasisResolvableTrade {
  account?: string[] | string | null;
  accountLookupKeys?: string[];
  currency?: string | null;
}

interface DrawdownCapitalBasisAccountMetadata {
  name?: string;
  initialBalance?: number;
  currentBalance?: number;
  currency?: string;
}

interface DrawdownCapitalBasisAccountCapital {
  amount?: number;
  currency?: string;
  source?: 'currentCapital' | 'initialBalance';
}

interface DrawdownCapitalBasisFilterScope {
  dateRange?: [Date | null, Date | null];
  accounts?: string[];
  tickers?: string[];
  setups?: string[];
  tags?: string[];
  mistakes?: string[];
  tradeTypes?: string[];
  statuses?: string[];
  customFieldFilters?: Record<string, unknown>;
}

interface ResolveDrawdownCapitalBasisOptions {
  filters?: DrawdownCapitalBasisFilterScope | null;
  displayCurrency?: string;
  accountCapitalByLookupKey?: Record<
    string,
    DrawdownCapitalBasisAccountCapital
  >;
}

const getPositiveFiniteNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : null;

const getFiniteNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const EMPTY_SUMMARY_BASE = {
  totalClosedTrades: 0,
  maxDrawdownAmount: 0,
  maxDrawdownAmountPercent: null,
  maxDrawdownAmountPercentBasisValue: null,
  maxDrawdownPercent: null,
  maxDrawdownAmountR: 0,
  maxDrawdownAmountRComplete: true,
  maxDrawdownR: 0,
  maxDrawdownRComplete: true,
  currentDrawdownAmount: 0,
  currentDrawdownPercent: null,
  currentDrawdownR: 0,
  currentDrawdownRComplete: true,
  currentlyInDrawdown: false,
  episodeCount: 0,
  recoveredEpisodeCount: 0,
  unrecoveredEpisodeCount: 0,
  underwaterTradeCount: 0,
  percentTimeInDrawdownTrades: 0,
  percentTimeInDrawdownDays: null,
  averageDrawdownDurationTrades: 0,
  averageDrawdownDurationDays: null,
  averageRecoveryDurationTrades: null,
  averageRecoveryDurationDays: null,
  longestDrawdownDurationTrades: 0,
  longestDrawdownDurationDays: null,
  totalTimeSpanMs: null,
  totalTimeSpanDays: null,
  underwaterTimeMs: null,
  underwaterTimeDays: null,
  hasIncompleteRealizedTimestamps: false,
};

const createEmptySummary = (
  basis: DrawdownBasisMetadata
): DrawdownAnalyticsSummary => ({
  ...EMPTY_SUMMARY_BASE,
  basis,
});

const normalizeDirection = (direction?: string | null): DrawdownDirection => {
  if (direction?.toLowerCase() === 'long') return 'long';
  if (direction?.toLowerCase() === 'short') return 'short';
  return 'combined';
};

const normalizeLookupKey = (value: string): string =>
  value.trim().toLowerCase();

const isNonAccountFilterActive = (
  filters: DrawdownCapitalBasisFilterScope | null | undefined
): boolean => {
  if (!filters) return false;

  const nonDefaultTradeTypeFilterActive = (filters.tradeTypes ?? []).some(
    (tradeType) => tradeType !== 'regular'
  );

  return (
    filters.dateRange?.some((date) => date != null) === true ||
    (filters.tickers?.length ?? 0) > 0 ||
    (filters.setups?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0 ||
    (filters.mistakes?.length ?? 0) > 0 ||
    nonDefaultTradeTypeFilterActive ||
    (filters.statuses?.length ?? 0) > 0 ||
    Object.values(filters.customFieldFilters ?? {}).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    })
  );
};

const getTradeAccountLookupKeys = (
  trade: DrawdownCapitalBasisResolvableTrade
): string[] => {
  const explicitKeys = (trade.accountLookupKeys ?? [])
    .map(normalizeLookupKey)
    .filter((key) => key.length > 0);
  if (explicitKeys.length > 0) {
    return Array.from(new Set(explicitKeys));
  }

  const accountValues = Array.isArray(trade.account)
    ? trade.account
    : typeof trade.account === 'string'
      ? [trade.account]
      : [];

  return Array.from(
    new Set(
      accountValues.map(normalizeLookupKey).filter((key) => key.length > 0)
    )
  );
};

export const resolveDrawdownCapitalBasis = (
  trades: DrawdownCapitalBasisResolvableTrade[],
  accountMetadata:
    | Record<string, DrawdownCapitalBasisAccountMetadata>
    | null
    | undefined,
  options: ResolveDrawdownCapitalBasisOptions = {}
): DrawdownCapitalBasis => {
  if (
    !Array.isArray(trades) ||
    trades.length === 0 ||
    !accountMetadata ||
    isNonAccountFilterActive(options.filters)
  ) {
    return { type: 'none' };
  }

  const metadataByLookupKey = new Map<
    string,
    { canonicalKey: string; metadata: DrawdownCapitalBasisAccountMetadata }
  >();
  for (const [accountName, metadata] of Object.entries(accountMetadata)) {
    const canonicalKey = normalizeLookupKey(accountName);
    metadataByLookupKey.set(canonicalKey, { canonicalKey, metadata });
    if (metadata.name) {
      metadataByLookupKey.set(normalizeLookupKey(metadata.name), {
        canonicalKey,
        metadata,
      });
    }
  }
  const capitalByLookupKey = new Map<
    string,
    DrawdownCapitalBasisAccountCapital
  >();
  for (const [accountName, capital] of Object.entries(
    options.accountCapitalByLookupKey ?? {}
  )) {
    capitalByLookupKey.set(normalizeLookupKey(accountName), capital);
  }

  const accountKeys = new Set<string>();
  const scopedAccountKeys = (options.filters?.accounts ?? [])
    .map(normalizeLookupKey)
    .filter((key) => key.length > 0);

  if (scopedAccountKeys.length > 0) {
    const tradeAccountKeys = new Set<string>();
    for (const trade of trades) {
      getTradeAccountLookupKeys(trade).forEach((key) =>
        tradeAccountKeys.add(key)
      );
    }

    scopedAccountKeys
      .filter((key) => tradeAccountKeys.has(key))
      .forEach((key) => accountKeys.add(key));
  } else {
    for (const trade of trades) {
      const tradeAccountKeys = getTradeAccountLookupKeys(trade);
      if (tradeAccountKeys.length === 0) {
        return { type: 'none' };
      }
      tradeAccountKeys.forEach((key) => accountKeys.add(key));
    }
  }

  if (accountKeys.size === 0) {
    return { type: 'none' };
  }

  let resolvedCapital = 0;
  let usesCurrentCapital = false;
  let usesInitialBalance = false;
  const countedCanonicalKeys = new Set<string>();
  for (const accountKey of accountKeys) {
    const metadataEntry = metadataByLookupKey.get(accountKey);
    const accountCapital = capitalByLookupKey.get(accountKey);
    if (!metadataEntry && !accountCapital) {
      return { type: 'none' };
    }
    const canonicalKey = metadataEntry?.canonicalKey ?? accountKey;
    if (countedCanonicalKeys.has(canonicalKey)) {
      continue;
    }
    countedCanonicalKeys.add(canonicalKey);
    const metadata = metadataEntry?.metadata;

    const accountCurrency = accountCapital?.currency ?? metadata?.currency;
    if (
      options.displayCurrency &&
      accountCurrency &&
      accountCurrency !== options.displayCurrency
    ) {
      return { type: 'none' };
    }

    const accountCapitalAmount = getPositiveFiniteNumber(
      accountCapital?.amount
    );
    const initialBalance = getPositiveFiniteNumber(metadata?.initialBalance);
    const currentBalance = getPositiveFiniteNumber(metadata?.currentBalance);
    const resolvedBasis =
      accountCapitalAmount !== null
        ? {
            amount: accountCapitalAmount,
            source: accountCapital?.source ?? 'currentCapital',
          }
        : initialBalance !== null
          ? {
              amount: initialBalance,
              source: 'initialBalance' as const,
            }
          : currentBalance !== null
            ? {
                amount: currentBalance,
                source: 'currentCapital' as const,
              }
            : null;

    if (resolvedBasis == null) {
      return { type: 'none' };
    }

    usesCurrentCapital ||= resolvedBasis.source === 'currentCapital';
    usesInitialBalance ||= resolvedBasis.source === 'initialBalance';
    resolvedCapital += resolvedBasis.amount;
  }

  if (resolvedCapital <= 0) {
    return { type: 'none' };
  }

  if (usesCurrentCapital && usesInitialBalance) {
    return { type: 'none' };
  }

  return usesCurrentCapital
    ? {
        type: 'fixedCapital',
        amount: resolvedCapital,
        label: 'account capital',
      }
    : { type: 'startingEquity', amount: resolvedCapital };
};

interface DrawdownSortableTrade<TTrade extends DrawdownAnalyzableTrade> {
  trade: TTrade;
  originalIndex: number;
  realizedAt: Date | null;
  realizedAtMs: number | null;
  entryTimeMs: number | null;
}

const createSortableTrade = <TTrade extends DrawdownAnalyzableTrade>(
  trade: TTrade,
  originalIndex: number
): DrawdownSortableTrade<TTrade> => {
  const realizedAt = getRealizedTradeTimestamp(trade);

  return {
    trade,
    originalIndex,
    realizedAt,
    realizedAtMs: safeGetTime(realizedAt),
    entryTimeMs: safeGetTime(trade.entryTime),
  };
};

const compareSortableTrades = <TTrade extends DrawdownAnalyzableTrade>(
  a: DrawdownSortableTrade<TTrade>,
  b: DrawdownSortableTrade<TTrade>
): number => {
  const realizedTimeDiff =
    (a.realizedAtMs ?? Number.MAX_SAFE_INTEGER) -
    (b.realizedAtMs ?? Number.MAX_SAFE_INTEGER);
  if (realizedTimeDiff !== 0) return realizedTimeDiff;

  const entryTimeDiff =
    (a.entryTimeMs ?? Number.MAX_SAFE_INTEGER) -
    (b.entryTimeMs ?? Number.MAX_SAFE_INTEGER);
  if (entryTimeDiff !== 0) return entryTimeDiff;

  const pathDiff = (a.trade.path ?? '').localeCompare(b.trade.path ?? '');
  if (pathDiff !== 0) return pathDiff;

  return a.originalIndex - b.originalIndex;
};

const matchesDirection = (
  trade: DrawdownAnalyzableTrade,
  direction: DrawdownDirection
): boolean => {
  if (direction === 'combined') return true;
  return normalizeDirection(trade.direction) === direction;
};

const isClosedTrade = (trade: DrawdownAnalyzableTrade): boolean => {
  if (trade.tradeStatus === 'CLOSED') {
    return true;
  }

  const isOpen = isTradeOpenWithContext({
    tradeStatus: trade.tradeStatus,
    exitTime: trade.exitTime,
    pnl: trade._originalPnlWasNull ? null : (trade.pnl ?? null),
    useDirectPnLInput: trade.useDirectPnLInput,
    exits: trade.exits,
    entries: trade.entries,
  });

  return !isOpen;
};

const getFallbackExitTime = (trade: DrawdownAnalyzableTrade): Date | null => {
  const exitTimes = (trade.exits ?? [])
    .map((exit) => safeParseDateValue(exit.time))
    .filter((date): date is Date => date !== null)
    .sort((a, b) => a.getTime() - b.getTime());

  return exitTimes.length > 0 ? exitTimes[exitTimes.length - 1] : null;
};

const getDurationMs = (
  startMs: number | null | undefined,
  endMs: number | null | undefined
): number | null => {
  if (startMs == null || endMs == null) {
    return null;
  }

  return Math.max(0, endMs - startMs);
};

const getDurationDays = (durationMs: number | null): number | null => {
  if (durationMs == null) {
    return null;
  }

  return durationMs / MILLISECONDS_PER_DAY;
};

const average = (values: number[]): number | null => {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const getSummaryDrawdownPercent = (
  point: Pick<
    DrawdownAnalyticsPoint<DrawdownAnalyzableTrade>,
    'drawdownAmount' | 'drawdownPercent'
  >
): number | null => {
  if (point.drawdownAmount <= 0) {
    return point.drawdownPercent;
  }

  return point.drawdownPercent;
};

const maxNullable = (
  currentMax: number | null,
  candidate: number | null
): number | null => {
  if (candidate == null) return currentMax;
  if (currentMax == null) return candidate;
  return Math.max(currentMax, candidate);
};

const createBasisMetadata = (
  curveType: DrawdownCurveType,
  capitalBasis: DrawdownCapitalBasis
): DrawdownBasisMetadata => {
  if (capitalBasis.type === 'startingEquity') {
    return {
      curveType,
      capitalBasisType: 'startingEquity',
      percentBasisLabel: capitalBasis.label ?? 'peak realized equity',
      percentUnavailableReason: null,
    };
  }

  if (capitalBasis.type === 'fixedCapital') {
    return {
      curveType,
      capitalBasisType: 'fixedCapital',
      percentBasisLabel: capitalBasis.label ?? 'starting capital',
      percentUnavailableReason: null,
    };
  }

  return {
    curveType,
    capitalBasisType: 'none',
    percentBasisLabel: null,
    percentUnavailableReason: 'capital-basis-required',
  };
};

const normalizeCapitalBasis = (
  capitalBasis: DrawdownCapitalBasis | undefined
): DrawdownCapitalBasis => {
  if (
    (capitalBasis?.type === 'startingEquity' ||
      capitalBasis?.type === 'fixedCapital') &&
    Number.isFinite(capitalBasis.amount) &&
    capitalBasis.amount > 0
  ) {
    return capitalBasis;
  }

  return { type: 'none' };
};

const getBasisValue = (
  capitalBasis: DrawdownCapitalBasis,
  cumulativeRealizedPnl: number
): number | null => {
  if (capitalBasis.type === 'startingEquity') {
    return capitalBasis.amount + cumulativeRealizedPnl;
  }

  if (capitalBasis.type === 'fixedCapital') {
    return capitalBasis.amount;
  }

  return null;
};

const getDrawdownPercent = (
  drawdownAmount: number,
  peakBasisValue: number | null
): number | null => {
  if (peakBasisValue == null || peakBasisValue <= 0) {
    return null;
  }

  return (drawdownAmount / peakBasisValue) * 100;
};

const calculateDrawdownRMultiple = <TTrade extends DrawdownAnalyzableTrade>(
  pnl: number,
  trade: TTrade,
  defaultRiskAmount: number | undefined
): number | undefined => {
  if (pnl === 0) {
    return 0;
  }

  return calculateEffectiveRMultiple(
    pnl,
    trade.rMultiple,
    trade.riskAmount,
    defaultRiskAmount
  );
};

const finalizeEpisode = <TTrade extends DrawdownAnalyzableTrade>(
  episode: Pick<
    DrawdownEpisode<TTrade>,
    'startPoint' | 'troughPoint' | 'recoveryPoint' | 'recovered'
  >,
  terminalPoint: DrawdownAnalyticsPoint<TTrade>
): DrawdownEpisode<TTrade> => {
  const endPoint = episode.recoveryPoint ?? terminalPoint;
  const durationMs = getDurationMs(
    episode.startPoint.realizedAtMs,
    endPoint.realizedAtMs
  );
  const recoveryDurationMs = episode.recoveryPoint
    ? getDurationMs(
        episode.troughPoint.realizedAtMs,
        episode.recoveryPoint.realizedAtMs
      )
    : null;

  return {
    ...episode,
    endPoint,
    maxDrawdownAmount: episode.troughPoint.drawdownAmount,
    maxDrawdownPercent: getSummaryDrawdownPercent(episode.troughPoint),
    maxDrawdownPercentBasisValue: episode.troughPoint.drawdownPercentBasisValue,
    maxDrawdownR: episode.troughPoint.drawdownR,
    maxDrawdownRComplete: episode.troughPoint.drawdownRComplete,
    durationTrades: episode.recoveryPoint
      ? Math.max(
          0,
          episode.recoveryPoint.tradeIndex - episode.startPoint.tradeIndex
        )
      : Math.max(
          0,
          terminalPoint.tradeIndex - episode.startPoint.tradeIndex + 1
        ),
    durationMs,
    durationDays: getDurationDays(durationMs),
    recoveryDurationTrades: episode.recoveryPoint
      ? Math.max(
          0,
          episode.recoveryPoint.tradeIndex - episode.troughPoint.tradeIndex
        )
      : null,
    recoveryDurationMs,
    recoveryDurationDays: getDurationDays(recoveryDurationMs),
  };
};

const buildSummary = <TTrade extends DrawdownAnalyzableTrade>(
  points: DrawdownAnalyticsPoint<TTrade>[],
  episodes: DrawdownEpisode<TTrade>[],
  maxDrawdownAmount: number,
  maxDrawdownPercent: number | null,
  maxDrawdownR: number,
  basis: DrawdownBasisMetadata
): DrawdownAnalyticsSummary => {
  const lastPoint = points[points.length - 1];
  const underwaterTradeCount = points.filter(
    (point) => point.drawdownAmount > 0
  ).length;
  const hasIncompleteRealizedTimestamps = points.some(
    (point) => point.realizedAtMs == null
  );

  const firstPoint = points[0];
  const totalTimeSpanMs = hasIncompleteRealizedTimestamps
    ? null
    : getDurationMs(firstPoint?.realizedAtMs, lastPoint?.realizedAtMs);
  const underwaterTimeMs = hasIncompleteRealizedTimestamps
    ? null
    : episodes.reduce<number | null>((total, episode) => {
        if (total == null || episode.durationMs == null) {
          return null;
        }
        return total + episode.durationMs;
      }, 0);

  const durationDaysValues = episodes
    .map((episode) => episode.durationDays)
    .filter((value): value is number => value != null);
  const recoveryDurationDaysValues = episodes
    .map((episode) => episode.recoveryDurationDays)
    .filter((value): value is number => value != null);
  const recoveryDurationTradeValues = episodes
    .map((episode) => episode.recoveryDurationTrades)
    .filter((value): value is number => value != null);
  const maxDrawdownEpisodes = episodes.filter(
    (episode) => episode.maxDrawdownAmount === maxDrawdownAmount
  );
  const maxDrawdownAmountR =
    maxDrawdownEpisodes.length > 0
      ? Math.max(...maxDrawdownEpisodes.map((episode) => episode.maxDrawdownR))
      : 0;
  const maxDrawdownAmountRComplete =
    maxDrawdownAmount <= 0 ||
    (maxDrawdownEpisodes.length > 0 &&
      maxDrawdownEpisodes.every((episode) => episode.maxDrawdownRComplete));
  const zeroDrawdownPercentPoint =
    maxDrawdownAmount <= 0
      ? points.find(
          (point) =>
            point.drawdownPercent != null &&
            point.drawdownPercentBasisValue != null
        )
      : undefined;
  const maxDrawdownAmountPercent =
    maxDrawdownAmount <= 0 && zeroDrawdownPercentPoint
      ? zeroDrawdownPercentPoint.drawdownPercent
      : maxDrawdownEpisodes.reduce<number | null>(
          (currentMax, episode) =>
            maxNullable(currentMax, episode.maxDrawdownPercent),
          null
        );
  const maxDrawdownAmountPercentBasisValue = zeroDrawdownPercentPoint
    ? zeroDrawdownPercentPoint.drawdownPercentBasisValue
    : (maxDrawdownEpisodes.find(
        (episode) => episode.maxDrawdownPercent === maxDrawdownAmountPercent
      )?.maxDrawdownPercentBasisValue ?? null);
  const maxDrawdownREpisodes = episodes.filter(
    (episode) => episode.maxDrawdownR === maxDrawdownR
  );
  const maxDrawdownRComplete =
    maxDrawdownR <= 0 ||
    (maxDrawdownREpisodes.length > 0 &&
      maxDrawdownREpisodes.every((episode) => episode.maxDrawdownRComplete));

  return {
    totalClosedTrades: points.length,
    maxDrawdownAmount,
    maxDrawdownAmountPercent,
    maxDrawdownAmountPercentBasisValue,
    maxDrawdownPercent,
    maxDrawdownAmountR,
    maxDrawdownAmountRComplete,
    maxDrawdownR,
    maxDrawdownRComplete,
    currentDrawdownAmount: lastPoint?.drawdownAmount ?? 0,
    currentDrawdownPercent: lastPoint
      ? getSummaryDrawdownPercent(lastPoint)
      : 0,
    currentDrawdownR: lastPoint?.drawdownR ?? 0,
    currentDrawdownRComplete: lastPoint?.drawdownRComplete ?? true,
    currentlyInDrawdown: (lastPoint?.drawdownAmount ?? 0) > 0,
    episodeCount: episodes.length,
    recoveredEpisodeCount: episodes.filter((episode) => episode.recovered)
      .length,
    unrecoveredEpisodeCount: episodes.filter((episode) => !episode.recovered)
      .length,
    underwaterTradeCount,
    percentTimeInDrawdownTrades:
      points.length > 0 ? (underwaterTradeCount / points.length) * 100 : 0,
    percentTimeInDrawdownDays:
      totalTimeSpanMs != null && underwaterTimeMs != null && totalTimeSpanMs > 0
        ? (underwaterTimeMs / totalTimeSpanMs) * 100
        : null,
    averageDrawdownDurationTrades:
      episodes.length > 0
        ? episodes.reduce((sum, episode) => sum + episode.durationTrades, 0) /
          episodes.length
        : 0,
    averageDrawdownDurationDays: hasIncompleteRealizedTimestamps
      ? null
      : average(durationDaysValues),
    averageRecoveryDurationTrades: average(recoveryDurationTradeValues),
    averageRecoveryDurationDays: hasIncompleteRealizedTimestamps
      ? null
      : average(recoveryDurationDaysValues),
    longestDrawdownDurationTrades: episodes.reduce(
      (maxDuration, episode) => Math.max(maxDuration, episode.durationTrades),
      0
    ),
    longestDrawdownDurationDays: hasIncompleteRealizedTimestamps
      ? null
      : durationDaysValues.length > 0
        ? Math.max(...durationDaysValues)
        : 0,
    totalTimeSpanMs,
    totalTimeSpanDays: getDurationDays(totalTimeSpanMs),
    underwaterTimeMs,
    underwaterTimeDays: getDurationDays(underwaterTimeMs),
    hasIncompleteRealizedTimestamps,
    basis,
  };
};


export function getRealizedTradeTimestamp(
  trade: DrawdownAnalyzableTrade
): Date | null {
  return (
    safeParseDateValue(trade.exitTime) ??
    getFallbackExitTime(trade) ??
    safeParseDateValue(trade.entryTime)
  );
}

export const getDrawdownCacheSignature = (
  trades: DrawdownAnalyzableTrade[],
  direction: DrawdownDirection = 'combined',
  assumeClosedTrades = false
): string => {
  if (!Array.isArray(trades) || trades.length === 0) {
    return `${direction}:empty`;
  }

  return trades
    .filter((trade) => assumeClosedTrades || isClosedTrade(trade))
    .filter((trade) => matchesDirection(trade, direction))
    .map(createSortableTrade)
    .sort(compareSortableTrades)
    .map((item, index) =>
      [
        item.trade.path ?? `index-${index}`,
        item.realizedAtMs ?? 'no-time',
        item.entryTimeMs ?? 'no-entry-time',
        item.trade.pnl ?? 0,
        item.trade.direction ?? 'combined',
        item.trade.rMultiple ?? 'no-r',
        item.trade.riskAmount ?? 'no-risk',
      ].join('|')
    )
    .join('::');
};

export const analyzeDrawdown = <TTrade extends DrawdownAnalyzableTrade>(
  trades: TTrade[],
  options: AnalyzeDrawdownOptions = {}
): DrawdownAnalyticsResult<TTrade> => {
  const direction = options.direction ?? 'combined';
  const defaultRiskAmount = options.defaultRiskAmount;
  const assumeClosedTrades = options.assumeClosedTrades ?? false;
  const curveType = options.curveType ?? 'realizedPnl';
  const capitalBasis = normalizeCapitalBasis(options.capitalBasis);
  const basis = createBasisMetadata(curveType, capitalBasis);

  if (!Array.isArray(trades) || trades.length === 0) {
    return {
      direction,
      trades: [],
      points: [],
      episodes: [],
      summary: createEmptySummary(basis),
    };
  }

  const filteredTrades = trades
    .filter((trade) => assumeClosedTrades || isClosedTrade(trade))
    .filter((trade) => matchesDirection(trade, direction));

  if (filteredTrades.length === 0) {
    return {
      direction,
      trades: [],
      points: [],
      episodes: [],
      summary: createEmptySummary(basis),
    };
  }

  const sortedTrades = filteredTrades
    .map(createSortableTrade)
    .sort(compareSortableTrades);

  let cumulativeRealizedPnl = 0;
  let peakCumulativeRealizedPnl = 0;
  let peakBasisValue = getBasisValue(capitalBasis, 0);
  let cumulativeR = 0;
  
  
  
  let peakCumulativeR = 0;
  let maxDrawdownAmount = 0;
  let maxDrawdownPercent: number | null = null;
  let maxDrawdownR = 0;
  let currentEpisode: Pick<
    DrawdownEpisode<TTrade>,
    'startPoint' | 'troughPoint' | 'recoveryPoint' | 'recovered'
  > | null = null;
  let currentEpisodeRComplete = true;

  const points: DrawdownAnalyticsPoint<TTrade>[] = [];
  const episodes: DrawdownEpisode<TTrade>[] = [];

  sortedTrades.forEach(({ trade }, index) => {
    const pnl = getFiniteNumber(trade.pnl);
    cumulativeRealizedPnl += pnl;

    const effectiveRMultiple = calculateDrawdownRMultiple(
      pnl,
      trade,
      defaultRiskAmount
    );
    const hasEffectiveRMultiple = effectiveRMultiple !== undefined;
    const rMultiple = effectiveRMultiple ?? 0;
    cumulativeR += rMultiple;

    const nextPeakCumulativeRealizedPnl = Math.max(
      peakCumulativeRealizedPnl,
      cumulativeRealizedPnl
    );
    const nextPeakCumulativeR =
      cumulativeRealizedPnl >= peakCumulativeRealizedPnl
        ? cumulativeR
        : peakCumulativeR;
    const basisValue = getBasisValue(capitalBasis, cumulativeRealizedPnl);
    const nextPeakBasisValue =
      peakBasisValue != null && basisValue != null
        ? Math.max(peakBasisValue, basisValue)
        : null;
    const drawdownAmount = Math.max(
      0,
      nextPeakCumulativeRealizedPnl - cumulativeRealizedPnl
    );
    const drawdownPercent = getDrawdownPercent(
      drawdownAmount,
      nextPeakBasisValue
    );
    const drawdownR = Math.max(0, nextPeakCumulativeR - cumulativeR);
    const drawdownRComplete =
      drawdownAmount <= 0
        ? true
        : currentEpisode
          ? currentEpisodeRComplete && hasEffectiveRMultiple
          : hasEffectiveRMultiple;
    const realizedAt = getRealizedTradeTimestamp(trade);
    const point: DrawdownAnalyticsPoint<TTrade> = {
      trade,
      tradeIndex: index,
      realizedAt,
      realizedAtMs: safeGetTime(realizedAt),
      pnl,
      cumulativeRealizedPnl,
      peakCumulativeRealizedPnl: nextPeakCumulativeRealizedPnl,
      basisValue,
      peakBasisValue: nextPeakBasisValue,
      drawdownAmount,
      drawdownPercent,
      drawdownPercentBasisValue: nextPeakBasisValue,
      drawdownPercentBasisLabel: basis.percentBasisLabel,
      rMultiple,
      hasEffectiveRMultiple,
      cumulativeR,
      peakCumulativeR: nextPeakCumulativeR,
      drawdownR,
      drawdownRComplete,
      isNewPeak: cumulativeRealizedPnl >= nextPeakCumulativeRealizedPnl,
    };

    points.push(point);

    maxDrawdownAmount = Math.max(maxDrawdownAmount, drawdownAmount);
    maxDrawdownPercent = maxNullable(
      maxDrawdownPercent,
      getSummaryDrawdownPercent(point)
    );
    maxDrawdownR = Math.max(maxDrawdownR, drawdownR);

    if (drawdownAmount > 0) {
      if (!currentEpisode) {
        currentEpisode = {
          startPoint: point,
          troughPoint: point,
          recoveryPoint: null,
          recovered: false,
        };
        currentEpisodeRComplete = hasEffectiveRMultiple;
      } else {
        currentEpisodeRComplete =
          currentEpisodeRComplete && hasEffectiveRMultiple;
      }

      if (currentEpisode.troughPoint.drawdownAmount < point.drawdownAmount) {
        currentEpisode.troughPoint = point;
      }
    } else if (currentEpisode) {
      currentEpisode.recoveryPoint = point;
      currentEpisode.recovered = true;
      episodes.push(finalizeEpisode(currentEpisode, point));
      currentEpisode = null;
      currentEpisodeRComplete = true;
    }

    peakCumulativeRealizedPnl = nextPeakCumulativeRealizedPnl;
    peakBasisValue = nextPeakBasisValue;
    peakCumulativeR = nextPeakCumulativeR;
  });

  if (currentEpisode && points.length > 0) {
    episodes.push(finalizeEpisode(currentEpisode, points[points.length - 1]));
  }

  return {
    direction,
    trades: sortedTrades.map(({ trade }) => trade),
    points,
    episodes,
    summary: buildSummary(
      points,
      episodes,
      maxDrawdownAmount,
      maxDrawdownPercent,
      maxDrawdownR,
      basis
    ),
  };
};
