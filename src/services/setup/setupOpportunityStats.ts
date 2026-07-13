import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import { calculateDirectionalPriceDiff } from '../../utils/pnlCalculation';
import {
  getEffectivePnL,
  getResolvedWeightedAverageExitPrice,
  getWeightedAverageEntryPrice,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import { inferStoredTradeType } from '../../utils/tradeTypeRouting';
import type {
  Setup,
  SetupMissedReasonCount,
  SetupOpportunityBucket,
  SetupOpportunityStats,
  SetupOpportunityTradeType,
} from './types';

interface SetupOpportunityRecord {
  path?: unknown;
  type?: unknown;
  isMissedTrade?: unknown;
  isBacktestTrade?: unknown;
  setup?: unknown;
  missedReason?: unknown;
  pnl?: number | null;
  rMultiple?: unknown;
  riskAmount?: unknown;
  entryPrice?: unknown;
  exitPrice?: unknown;
  positionSize?: unknown;
  direction?: unknown;
  assetType?: unknown;
  optionType?: unknown;
  hasExplicitExitPrice?: unknown;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  tradeStatus?: unknown;
  exitTime?: unknown;
  entries?: unknown;
  exits?: unknown;
  _originalPnlWasNull?: unknown;
}

type TradePnlInput = Parameters<typeof isPnlContributingTrade>[0] & {
  entryPrice?: number | null;
  exitPrice?: number | null;
  positionSize: number;
  direction?: string;
  assetType?: string;
  optionType?: string;
  hasExplicitExitPrice?: boolean;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
    hasExplicitPrice?: boolean;
  }>;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
    hasExplicitPrice?: boolean;
  }>;
};

interface AttributedOpportunityTrade {
  setupIds: string[];
  type: SetupOpportunityTradeType;
  missedReason: string | null;
  pnl: number;
  pnlContributing: boolean;
  rMultiple: number | null;
}

const EMPTY_BUCKET: SetupOpportunityBucket = {
  recordCount: 0,
  contributingCount: 0,
  winRate: 0,
  totalPnL: 0,
  averagePnL: 0,
  profitFactor: 0,
  totalR: 0,
  averageR: 0,
  rMultipleCount: 0,
};

export function buildSetupOpportunityStats(
  setups: Setup[],
  tradeData: unknown[],
  defaultRiskAmount?: number
): Record<string, SetupOpportunityStats> {
  const setupById = new Map(setups.map((setup) => [setup.id, setup]));
  const resolveToken = createSetupTokenResolver(setups);
  const attributedTrades = tradeData.flatMap((rawTrade) => {
    const trade = toAttributedOpportunityTrade(
      rawTrade,
      setupById,
      resolveToken,
      defaultRiskAmount
    );
    return trade ? [trade] : [];
  });

  return Object.fromEntries(
    setups.map((setup) => [
      setup.id,
      buildSetupOpportunityStatsForSetup(setup.id, attributedTrades),
    ])
  );
}

function buildSetupOpportunityStatsForSetup(
  setupId: string,
  trades: AttributedOpportunityTrade[]
): SetupOpportunityStats {
  const linkedTrades = trades.filter((trade) =>
    trade.setupIds.includes(setupId)
  );
  const liveTrades = linkedTrades.filter((trade) => trade.type === 'live');
  const missedTrades = linkedTrades.filter((trade) => trade.type === 'missed');
  const backtestTrades = linkedTrades.filter(
    (trade) => trade.type === 'backtest'
  );
  const live = calculateBucket(liveTrades);
  const missed = calculateBucket(missedTrades);
  const backtest = calculateBucket(backtestTrades);
  const livePlusMissed = calculateBucket([...liveTrades, ...missedTrades]);
  const opportunityCount = live.recordCount + missed.recordCount;
  const backtestVsLiveAverageRDelta =
    backtest.rMultipleCount > 0 && live.rMultipleCount > 0
      ? backtest.averageR - live.averageR
      : null;

  return {
    setupId,
    live,
    missed,
    backtest,
    livePlusMissed,
    missedOpportunityRate: opportunityCount
      ? missed.recordCount / opportunityCount
      : 0,
    backtestVsLiveAverageRDelta,
    missedReasonCounts: countMissedReasons(missedTrades),
  };
}

function calculateBucket(
  trades: AttributedOpportunityTrade[]
): SetupOpportunityBucket {
  if (trades.length === 0) return { ...EMPTY_BUCKET };
  const pnlResults = trades.flatMap((trade) =>
    trade.pnlContributing ? [trade.pnl] : []
  );
  const rMultiples = trades.flatMap((trade) =>
    trade.rMultiple !== null ? [trade.rMultiple] : []
  );
  const winners = pnlResults.filter((pnl) => pnl > 0);
  const losers = pnlResults.filter((pnl) => pnl < 0);
  const totalPnL = pnlResults.reduce((sum, pnl) => sum + pnl, 0);
  const totalWin = winners.reduce((sum, pnl) => sum + pnl, 0);
  const totalLoss = Math.abs(losers.reduce((sum, pnl) => sum + pnl, 0));
  const totalR = rMultiples.reduce((sum, rMultiple) => sum + rMultiple, 0);

  return {
    recordCount: trades.length,
    contributingCount: pnlResults.length,
    winRate:
      calculateWinRateExcludingBreakeven(winners.length, losers.length) * 100,
    totalPnL,
    averagePnL: pnlResults.length ? totalPnL / pnlResults.length : 0,
    profitFactor: totalLoss ? totalWin / totalLoss : totalWin ? Infinity : 0,
    totalR,
    averageR: rMultiples.length ? totalR / rMultiples.length : 0,
    rMultipleCount: rMultiples.length,
  };
}

function countMissedReasons(
  missedTrades: AttributedOpportunityTrade[]
): SetupMissedReasonCount[] {
  const counts = new Map<string, number>();
  for (const trade of missedTrades) {
    const reason = trade.missedReason?.trim();
    if (!reason) continue;
    counts.set(reason, (counts.get(reason) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason));
}

function toAttributedOpportunityTrade(
  rawTrade: unknown,
  setupById: Map<string, Setup>,
  resolveToken: (token: string) => string | null,
  defaultRiskAmount?: number
): AttributedOpportunityTrade | null {
  const trade: SetupOpportunityRecord = isRecord(rawTrade) ? rawTrade : {};
  const setupIds = getAnySetupIdsForTrade(trade, setupById, resolveToken);
  if (setupIds.length === 0) return null;
  const pnlInput = toTradePnlInput(trade);
  const pnlContributing = isPnlContributingTrade(pnlInput);
  const pnl = pnlContributing ? calculateTradePnl(pnlInput) : 0;

  return {
    setupIds,
    type: inferSetupOpportunityTradeType(trade),
    missedReason:
      typeof trade.missedReason === 'string' ? trade.missedReason : null,
    pnl,
    pnlContributing,
    rMultiple: pnlContributing
      ? calculateEffectiveRMultiple(
          pnl,
          getOptionalNumber(trade.rMultiple),
          getOptionalNumber(trade.riskAmount),
          defaultRiskAmount
        )
      : null,
  };
}

function inferSetupOpportunityTradeType(
  trade: SetupOpportunityRecord
): SetupOpportunityTradeType {
  const tradeType = inferStoredTradeType({
    filePath: typeof trade.path === 'string' ? trade.path : undefined,
    type: trade.type,
    isMissedTrade: trade.isMissedTrade,
    isBacktestTrade: trade.isBacktestTrade,
  });
  return tradeType === 'regular' ? 'live' : tradeType;
}

function getAnySetupIdsForTrade(
  trade: SetupOpportunityRecord,
  setupById: Map<string, Setup>,
  resolveToken: (token: string) => string | null
): string[] {
  const setupIds = new Set<string>();
  for (const token of getStringArray(trade.setup)) {
    const setupId = setupById.has(token) ? token : resolveToken(token);
    if (setupId && setupById.has(setupId)) setupIds.add(setupId);
  }
  return [...setupIds];
}

function createSetupTokenResolver(
  setups: Setup[]
): (token: string) => string | null {
  const exact = new Map<string, string[]>();
  const normalized = new Map<string, string[]>();

  for (const setup of setups) {
    for (const token of [setup.id, setup.name, ...setup.aliases]) {
      addCandidate(exact, token, setup.id);
      addCandidate(normalized, normalizeSetupToken(token), setup.id);
    }
  }

  return (token: string): string | null => {
    const exactMatch = getUniqueCandidate(exact.get(token.trim()));
    if (exactMatch) return exactMatch;
    return getUniqueCandidate(normalized.get(normalizeSetupToken(token)));
  };
}

function addCandidate(
  map: Map<string, string[]>,
  token: string,
  setupId: string
): void {
  const key = token.trim();
  if (!key) return;
  const candidates = map.get(key) ?? [];
  if (!candidates.includes(setupId)) candidates.push(setupId);
  map.set(key, candidates);
}

function getUniqueCandidate(candidates: string[] | undefined): string | null {
  return candidates?.length === 1 ? candidates[0] : null;
}

function normalizeSetupToken(value: string): string {
  return value
    .trim()
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

function toTradePnlInput(trade: SetupOpportunityRecord): TradePnlInput {
  return {
    tradeStatus:
      typeof trade.tradeStatus === 'string' ? trade.tradeStatus : undefined,
    exitTime: stringifyDateLike(trade.exitTime) || null,
    exitPrice: getOptionalNumber(trade.exitPrice),
    pnl: typeof trade.pnl === 'number' ? trade.pnl : null,
    _originalPnlWasNull: trade._originalPnlWasNull === true,
    useDirectPnLInput: trade.useDirectPnLInput,
    directPnL: typeof trade.directPnL === 'number' ? trade.directPnL : null,
    dividends: trade.dividends,
    commission: trade.commission,
    swap: trade.swap,
    fees: trade.fees,
    rebate: trade.rebate,
    entries: getTradeExecutions(trade.entries),
    exits: getTradeExecutions(trade.exits),
    entryPrice: getOptionalNumber(trade.entryPrice),
    positionSize: getOptionalNumber(trade.positionSize) ?? 0,
    direction:
      typeof trade.direction === 'string' ? trade.direction : undefined,
    assetType:
      typeof trade.assetType === 'string' ? trade.assetType : undefined,
    optionType:
      typeof trade.optionType === 'string' ? trade.optionType : undefined,
    hasExplicitExitPrice: trade.hasExplicitExitPrice === true,
  };
}

function calculateTradePnl(trade: TradePnlInput): number {
  const hasStoredOrDirectPnL =
    (trade.pnl !== undefined &&
      trade.pnl !== null &&
      Number.isFinite(trade.pnl)) ||
    (trade.useDirectPnLInput === true &&
      trade.directPnL !== undefined &&
      trade.directPnL !== null);

  if (hasStoredOrDirectPnL) return getEffectivePnL(trade);

  const entryPrice = getWeightedAverageEntryPrice(trade);
  const exitPrice = getResolvedWeightedAverageExitPrice(trade);
  const priceDiff = calculateDirectionalPriceDiff(
    { assetType: trade.assetType, direction: trade.direction || 'long' },
    entryPrice,
    exitPrice
  );
  return priceDiff === null ? 0 : priceDiff * trade.positionSize;
}

function calculateEffectiveRMultiple(
  pnl: number,
  storedRMultiple: number | null,
  riskAmount: number | null,
  defaultRiskAmount?: number
): number | null {
  if (storedRMultiple !== null) return storedRMultiple;
  const effectiveRisk = riskAmount ?? defaultRiskAmount;
  if (!effectiveRisk || !Number.isFinite(effectiveRisk)) return null;
  return pnl / effectiveRisk;
}

function getTradeExecutions(value: unknown): TradePnlInput['entries'] {
  if (!Array.isArray(value)) return undefined;
  return value.flatMap((execution) =>
    isRecord(execution)
      ? [
          {
            time:
              execution.time instanceof Date ||
              typeof execution.time === 'string'
                ? execution.time
                : null,
            price: getOptionalNumber(execution.price),
            size: getOptionalNumber(execution.size),
            ...(typeof execution.hasExplicitPrice === 'boolean' && {
              hasExplicitPrice: execution.hasExplicitPrice,
            }),
          },
        ]
      : []
  );
}

function getOptionalNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function stringifyDateLike(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return typeof value === 'string' ? value : '';
}

function getStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
