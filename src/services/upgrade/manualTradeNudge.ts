


export const MANUAL_TRADE_NUDGE_THRESHOLDS = {
  minManualTrades: 20,
  minSpanDays: 14,
  minDistinctEntryDays: 3,
} as const;

type ManualTradeNudgeThresholds = {
  readonly [K in keyof typeof MANUAL_TRADE_NUDGE_THRESHOLDS]: number;
};


const NON_MANUAL_PROVENANCE_KEYS = [
  'canonicalTradeId',
  'tradeImportId',
  'backendTradeId',
  'lastBrokerSyncAt',
  'csvImportId',
  'journalitSampleInstance',
  'journalitSampleEntityId',
] as const;

const hasProvenanceValue = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== '';


export function isManuallyEnteredTrade(
  frontmatter: Record<string, unknown>
): boolean {
  if (
    frontmatter.type === 'backtest-trade' ||
    frontmatter.isBacktestTrade === true
  ) {
    return false;
  }
  return !NON_MANUAL_PROVENANCE_KEYS.some((key) =>
    hasProvenanceValue(frontmatter[key])
  );
}

interface ManualTradeNudgeEvaluation {
  eligible: boolean;
  manualTradeCount: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const localDayKey = (timestampMs: number): string => {
  const date = new Date(timestampMs);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};


export function evaluateManualTradeNudge(
  creationTimesMs: readonly number[],
  thresholds: ManualTradeNudgeThresholds = MANUAL_TRADE_NUDGE_THRESHOLDS
): ManualTradeNudgeEvaluation {
  let earliest = Number.POSITIVE_INFINITY;
  let latest = Number.NEGATIVE_INFINITY;
  let manualTradeCount = 0;
  const entryDays = new Set<string>();

  for (const createdAt of creationTimesMs) {
    if (!Number.isFinite(createdAt) || createdAt <= 0) continue;
    manualTradeCount += 1;
    if (createdAt < earliest) earliest = createdAt;
    if (createdAt > latest) latest = createdAt;
    entryDays.add(localDayKey(createdAt));
  }

  const eligible =
    manualTradeCount >= thresholds.minManualTrades &&
    latest - earliest >= thresholds.minSpanDays * DAY_MS &&
    entryDays.size >= thresholds.minDistinctEntryDays;

  return { eligible, manualTradeCount };
}
