import type { Trade } from '../../dashboard/utils/dataUtils';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import type { BreakEvenRangeSettings } from '../../../utils/breakEvenRange';
import {
  getEffectivePnL,
  getFirstEntryTime,
} from '../../../utils/tradeStatusUtils';
import { getTradingDayString } from '../../../utils/tradingDayUtils';

const BEST_HOURS_BUCKET_MINUTES = 30;
const BEST_HOURS_MIN_RANKING_TRADES = 10;
const BEST_HOURS_MIN_RANKING_DAYS = 5;
const BEST_HOURS_MIN_DEVELOPING_TRADES = 5;
const BEST_HOURS_MIN_DEVELOPING_DAYS = 3;
const BEST_HOURS_MIN_ELIGIBLE_BUCKETS = 2;
const MINUTES_PER_DAY = 24 * 60;

type BestHoursSampleTier = 'reliable' | 'developing' | 'sparse';

export interface TimeBucket {
  id: string;
  startMinute: number;
  endMinute: number;
  label: string;
}

export interface BucketStats {
  bucket: TimeBucket;
  netPnl: number;
  averagePnl: number | null;
  tradeCount: number;
  distinctDayCount: number;
  wins: number;
  losses: number;
  breakevens: number;
  winRate: number | null;
  isRankingEligible: boolean;
  isDevelopingEligible: boolean;
  sampleTier: BestHoursSampleTier;
}

interface TradeObservation {
  tradeKey: string;
  occurredAt: Date;
  tradingDay: string;
  pnl: number;
  outcome: 'win' | 'loss' | 'breakeven';
}

interface PluginWithTradeSettings {
  settings?: {
    trade?: BreakEvenRangeSettings & {
      tradingDayCutoffTime?: string;
    };
  };
}

const getMinutesSinceMidnight = (date: Date): number =>
  date.getHours() * 60 + date.getMinutes();

const floorToBucket = (minute: number, bucketMinutes: number): number =>
  Math.floor(minute / bucketMinutes) * bucketMinutes;

export const formatMinuteOfDay = (minute: number): string => {
  const normalized =
    ((minute % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hour = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hour >= 12 ? 'pm' : 'am';
  const displayHour = hour % 12 || 12;

  return minutes === 0
    ? `${displayHour}${period}`
    : `${displayHour}:${String(minutes).padStart(2, '0')}${period}`;
};

export const formatBucketLabel = (
  startMinute: number,
  endMinute: number
): string =>
  `${formatMinuteOfDay(startMinute)}-${formatMinuteOfDay(endMinute)}`;

const createBucket = (
  startMinute: number,
  bucketMinutes: number
): TimeBucket => {
  const endMinute = startMinute + bucketMinutes;
  return {
    id: `bucket-${startMinute}`,
    startMinute,
    endMinute,
    label: formatBucketLabel(startMinute, endMinute),
  };
};

const getTradeKey = (trade: Trade, index: number): string =>
  trade.tradeId ??
  (trade.backendTradeId !== undefined
    ? `backend-${trade.backendTradeId}`
    : trade.path || `trade-${index}`);

const getEntryObservationDate = (trade: Trade): Date | null => {
  const entryTime = getFirstEntryTime(trade);
  return entryTime && !Number.isNaN(entryTime.getTime()) ? entryTime : null;
};

const buildEntryObservations = (
  trades: Trade[],
  plugin: PluginWithTradeSettings | null | undefined,
  breakEvenSettings: BreakEvenRangeSettings
): TradeObservation[] =>
  trades.flatMap((trade, index) => {
    const occurredAt = getEntryObservationDate(trade);
    if (!occurredAt) return [];

    const pnl = getEffectivePnL(trade);
    const rawOutcome = classifyPnLWithBreakEvenSettings(
      pnl,
      breakEvenSettings,
      trade.breakEvenAccountCurrentBalance
    );

    return [
      {
        tradeKey: getTradeKey(trade, index),
        occurredAt,
        tradingDay: getTradingDayString(occurredAt, plugin ?? undefined),
        pnl,
        outcome: rawOutcome === 'unknown' ? 'breakeven' : rawOutcome,
      },
    ];
  });

export const aggregateEntryTimeBuckets = ({
  trades,
  plugin,
  breakEvenSettings,
  bucketMinutes = BEST_HOURS_BUCKET_MINUTES,
}: {
  trades: Trade[];
  plugin: PluginWithTradeSettings | null | undefined;
  breakEvenSettings: BreakEvenRangeSettings;
  bucketMinutes?: number;
}): { buckets: TimeBucket[]; stats: BucketStats[] } => {
  const observations = buildEntryObservations(
    trades,
    plugin,
    breakEvenSettings
  );
  if (observations.length === 0) {
    return { buckets: [], stats: [] };
  }

  const observationMinutes = observations.map((observation) =>
    getMinutesSinceMidnight(observation.occurredAt)
  );
  const startMinute = floorToBucket(
    Math.min(...observationMinutes),
    bucketMinutes
  );
  const endMinute = Math.min(
    MINUTES_PER_DAY,
    floorToBucket(Math.max(...observationMinutes), bucketMinutes) +
      bucketMinutes
  );

  const buckets: TimeBucket[] = [];
  for (let minute = startMinute; minute < endMinute; minute += bucketMinutes) {
    buckets.push(createBucket(minute, bucketMinutes));
  }

  const statsByBucket = new Map<
    string,
    {
      netPnl: number;
      tradeKeys: Set<string>;
      tradingDays: Set<string>;
      wins: number;
      losses: number;
      breakevens: number;
    }
  >(
    buckets.map((bucket) => [
      bucket.id,
      {
        netPnl: 0,
        tradeKeys: new Set<string>(),
        tradingDays: new Set<string>(),
        wins: 0,
        losses: 0,
        breakevens: 0,
      },
    ])
  );

  for (const observation of observations) {
    const bucketStart = floorToBucket(
      getMinutesSinceMidnight(observation.occurredAt),
      bucketMinutes
    );
    const bucketStats = statsByBucket.get(`bucket-${bucketStart}`);
    if (!bucketStats) continue;

    bucketStats.netPnl += observation.pnl;
    bucketStats.tradeKeys.add(observation.tradeKey);
    bucketStats.tradingDays.add(observation.tradingDay);
    if (observation.outcome === 'win') {
      bucketStats.wins += 1;
    } else if (observation.outcome === 'loss') {
      bucketStats.losses += 1;
    } else {
      bucketStats.breakevens += 1;
    }
  }

  return {
    buckets,
    stats: buckets.map((bucket) => {
      const stats = statsByBucket.get(bucket.id)!;
      const tradeCount = stats.tradeKeys.size;
      const distinctDayCount = stats.tradingDays.size;
      const decidedTrades = stats.wins + stats.losses;
      const isRankingEligible =
        tradeCount >= BEST_HOURS_MIN_RANKING_TRADES &&
        distinctDayCount >= BEST_HOURS_MIN_RANKING_DAYS;
      const isDevelopingEligible =
        isRankingEligible ||
        (tradeCount >= BEST_HOURS_MIN_DEVELOPING_TRADES &&
          distinctDayCount >= BEST_HOURS_MIN_DEVELOPING_DAYS);
      const sampleTier: BestHoursSampleTier = isRankingEligible
        ? 'reliable'
        : isDevelopingEligible
          ? 'developing'
          : 'sparse';
      return {
        bucket,
        netPnl: stats.netPnl,
        averagePnl: tradeCount > 0 ? stats.netPnl / tradeCount : null,
        tradeCount,
        distinctDayCount,
        wins: stats.wins,
        losses: stats.losses,
        breakevens: stats.breakevens,
        winRate: decidedTrades > 0 ? (stats.wins / decidedTrades) * 100 : null,
        isRankingEligible,
        isDevelopingEligible,
        sampleTier,
      };
    }),
  };
};

const selectBestPositiveBucket = (stats: BucketStats[]): BucketStats | null => {
  const positiveBuckets = stats.filter(
    (bucket) => bucket.averagePnl !== null && bucket.averagePnl > 0
  );

  if (positiveBuckets.length === 0) {
    return null;
  }

  return positiveBuckets.reduce((best, current) =>
    current.averagePnl! > best.averagePnl! ? current : best
  );
};

export const selectBestEntryWindow = (
  stats: BucketStats[]
): BucketStats | null => {
  const reliableBuckets = stats.filter((bucket) => bucket.isRankingEligible);
  if (reliableBuckets.length >= BEST_HOURS_MIN_ELIGIBLE_BUCKETS) {
    return selectBestPositiveBucket(reliableBuckets);
  }

  const developingBuckets = stats.filter(
    (bucket) => bucket.isDevelopingEligible
  );
  if (developingBuckets.length < BEST_HOURS_MIN_ELIGIBLE_BUCKETS) {
    return null;
  }

  return selectBestPositiveBucket(developingBuckets);
};
