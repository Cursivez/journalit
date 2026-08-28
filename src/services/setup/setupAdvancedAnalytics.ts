import { calculateWinRateExcludingBreakeven } from '../../utils/breakEvenRange';
import { isPnlContributingTrade } from '../../utils/tradeStatusUtils';
import { inferStoredTradeType } from '../../utils/tradeTypeRouting';
import { calculateSetupTradePnl, toSetupTradePnlInput } from './setupTradePnl';
import type {
  Setup,
  SetupAdvancedAnalytics,
  SetupAdvancedAnalyticsBySetup,
  SetupCombinationAnalytics,
  SetupNeedsAttentionInsight,
  SetupOutcomeMetrics,
} from './types';

interface SetupAdvancedAnalyticsTradeRecord {
  path?: unknown;
  type?: unknown;
  isMissedTrade?: unknown;
  isBacktestTrade?: unknown;
  setup?: unknown;
  pnl?: number | null;
  authoritativePnl?: number | null;
  canonicalTradeId?: string;
  canonicalTradeVersion?: number;
  canonicalProjectionSchemaVersion?: number;
  entryPrice?: unknown;
  exitPrice?: unknown;
  positionSize?: unknown;
  direction?: unknown;
  assetType?: unknown;
  hasExplicitExitPrice?: unknown;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  commissionType?: 'fixed' | 'percentage';
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  tradeStatus?: string;
  exitTime?: unknown;
  entries?: unknown;
  exits?: unknown;
  _originalPnlWasNull?: unknown;
}

interface AttributedTrade {
  setupIds: string[];
  pnl: number;
  pnlContributing: boolean;
}

export function buildSetupAdvancedAnalytics(
  setups: Setup[],
  tradeData: unknown[]
): SetupAdvancedAnalytics {
  const setupById = new Map(setups.map((setup) => [setup.id, setup]));
  const resolver = createSetupTokenResolver(setups);
  const attributedTrades = tradeData.flatMap((trade) => {
    const attributedTrade = toAttributedTrade(trade, setupById, resolver);
    return attributedTrade ? [attributedTrade] : [];
  });

  return {
    bySetup: Object.fromEntries(
      setups.map((setup) => [
        setup.id,
        buildSetupAnalytics(setup, attributedTrades),
      ])
    ),
    combinations: buildCombinationAnalytics(attributedTrades, setupById, 2),
    pairedSetups: buildCombinationAnalytics(attributedTrades, setupById, 2, 2),
  };
}

function buildSetupAnalytics(
  setup: Setup,
  trades: AttributedTrade[]
): SetupAdvancedAnalyticsBySetup {
  const linkedTrades = trades.filter((trade) =>
    trade.setupIds.includes(setup.id)
  );

  return {
    setupId: setup.id,
    tradeCount: linkedTrades.filter((trade) => trade.pnlContributing).length,
    needsAttention: buildNeedsAttentionInsights(setup, linkedTrades),
  };
}

function buildNeedsAttentionInsights(
  setup: Setup,
  trades: AttributedTrade[]
): SetupNeedsAttentionInsight[] {
  const insights: SetupNeedsAttentionInsight[] = [];
  const contributingTradeCount = trades.filter(
    (trade) => trade.pnlContributing
  ).length;

  if (contributingTradeCount === 0) {
    insights.push({
      setupId: setup.id,
      kind: 'no-trades',
      severity: 'info',
    });
  }

  return insights;
}

function buildCombinationAnalytics(
  trades: AttributedTrade[],
  setupById: Map<string, Setup>,
  minimumSize: number,
  exactSize?: number
): SetupCombinationAnalytics[] {
  const byCombination = new Map<
    string,
    { setupIds: string[]; trades: AttributedTrade[] }
  >();

  for (const trade of trades) {
    if (!trade.pnlContributing) continue;
    const setupIds = Array.from(new Set(trade.setupIds)).sort();
    const combinations = getSetupIdCombinations(
      setupIds,
      minimumSize,
      exactSize
    );
    for (const combination of combinations) {
      const key = JSON.stringify(combination);
      const existing = byCombination.get(key);
      if (existing) {
        existing.trades.push(trade);
      } else {
        byCombination.set(key, { setupIds: combination, trades: [trade] });
      }
    }
  }

  return Array.from(byCombination.values())
    .map(({ setupIds, trades: combinationTrades }) => {
      return {
        setupIds,
        setupNames: setupIds.map(
          (setupId) => setupById.get(setupId)?.name ?? setupId
        ),
        metrics: calculateOutcomeMetrics(combinationTrades),
      };
    })
    .sort(
      (a, b) =>
        b.metrics.totalPnL - a.metrics.totalPnL ||
        b.metrics.tradeCount - a.metrics.tradeCount ||
        a.setupNames.join(' + ').localeCompare(b.setupNames.join(' + '))
    );
}

function calculateOutcomeMetrics(
  trades: AttributedTrade[]
): SetupOutcomeMetrics {
  const results = trades.flatMap((trade) =>
    trade.pnlContributing ? [trade.pnl] : []
  );
  const winners = results.filter((pnl) => pnl > 0);
  const losers = results.filter((pnl) => pnl < 0);
  const totalPnL = results.reduce((sum, pnl) => sum + pnl, 0);
  const totalWin = winners.reduce((sum, pnl) => sum + pnl, 0);
  const totalLoss = Math.abs(losers.reduce((sum, pnl) => sum + pnl, 0));

  return {
    tradeCount: results.length,
    winRate:
      calculateWinRateExcludingBreakeven(winners.length, losers.length) * 100,
    totalPnL,
    averagePnL: results.length ? totalPnL / results.length : 0,
    profitFactor: totalLoss ? totalWin / totalLoss : totalWin ? Infinity : 0,
  };
}

function toAttributedTrade(
  rawTrade: unknown,
  setupById: Map<string, Setup>,
  resolveToken: (token: string) => string | null
): AttributedTrade | null {
  const trade = isRecord(rawTrade) ? rawTrade : {};
  if (!isRegularTrade(trade)) return null;
  const setupIds = getAnySetupIdsForTrade(trade, setupById, resolveToken);
  if (setupIds.length === 0) return null;

  const pnlInput = toSetupTradePnlInput(trade);
  const pnlContributing = isPnlContributingTrade(pnlInput);

  return {
    setupIds,
    pnl: pnlContributing ? calculateSetupTradePnl(pnlInput) : 0,
    pnlContributing,
  };
}

function isRegularTrade(trade: SetupAdvancedAnalyticsTradeRecord): boolean {
  return (
    inferStoredTradeType({
      filePath: typeof trade.path === 'string' ? trade.path : undefined,
      type: trade.type,
      isMissedTrade: trade.isMissedTrade,
      isBacktestTrade: trade.isBacktestTrade,
    }) === 'regular'
  );
}

function getAnySetupIdsForTrade(
  trade: SetupAdvancedAnalyticsTradeRecord,
  setupById: Map<string, Setup>,
  resolveToken: (token: string) => string | null
): string[] {
  const setupIds = new Set<string>();

  for (const token of getStringArray(trade.setup)) {
    const resolvedId = setupById.has(token) ? token : resolveToken(token);
    if (resolvedId && setupById.has(resolvedId)) setupIds.add(resolvedId);
  }

  return [...setupIds];
}

function createSetupTokenResolver(
  setups: Setup[]
): (token: string) => string | null {
  const exact = new Map<string, string[]>();
  const normalized = new Map<string, string[]>();

  for (const setup of setups) {
    addCandidate(exact, setup.id, setup.id);
    addCandidate(exact, setup.name, setup.id);
    addCandidate(normalized, normalizeSetupToken(setup.name), setup.id);
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

function getSetupIdCombinations(
  setupIds: string[],
  minimumSize: number,
  exactSize?: number
): string[][] {
  const results: string[][] = [];
  const maxSize = exactSize ?? setupIds.length;

  const visit = (start: number, combination: string[]): void => {
    if (combination.length >= minimumSize && combination.length <= maxSize) {
      if (!exactSize || combination.length === exactSize) {
        results.push([...combination]);
      }
    }
    if (combination.length === maxSize) return;

    for (let index = start; index < setupIds.length; index += 1) {
      combination.push(setupIds[index]);
      visit(index + 1, combination);
      combination.pop();
    }
  };

  visit(0, []);
  return results;
}

function getStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return typeof value === 'string' ? [value] : [];
}

function normalizeSetupToken(value: string): string {
  return value
    .trim()
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
