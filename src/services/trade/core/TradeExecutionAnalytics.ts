import { normalizeTradeExecution } from './TradeExecutionNormalization';
import { safeParseDateValue } from '../../../utils/dateUtils';

interface TradeExecutionAnalyticsFields {
  entryTime: Date;
  exitTime: Date;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  entries: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  exits: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
    hasExplicitPrice?: boolean;
  }>;
  hasExplicitExitPrice?: boolean;
}

const createValidDate = (dateInput: unknown, fallback?: Date): Date => {
  if (!dateInput) {
    return fallback || new Date();
  }

  return safeParseDateValue(dateInput) ?? fallback ?? new Date();
};

export function normalizeTradeExecutionForAnalytics(
  frontmatter: Record<string, unknown>
): TradeExecutionAnalyticsFields {
  const normalized = normalizeTradeExecution(frontmatter, {
    deriveMissingExplicitness: true,
  });
  const entryTime =
    getFirstAnalyticsEntryTime(frontmatter, normalized) ??
    createValidDate(frontmatter.entryTime);
  const exitTime =
    getLastAnalyticsExitTime(frontmatter, normalized) ??
    (frontmatter.exitTime
      ? createValidDate(frontmatter.exitTime, entryTime)
      : entryTime);
  const entryPrice =
    normalized.weightedEntryPrice ?? normalized.entryPrice ?? 0;

  const exitPrice =
    normalized.resolvedExitPrice ??
    (isDirectPnlPlaceholderExit(normalized)
      ? entryPrice
      : normalized.exitPrice) ??
    entryPrice;
  const positionSize = getAnalyticsPositionSize(normalized);

  return {
    entryTime,
    exitTime,
    entryPrice,
    exitPrice,
    positionSize,
    entries: normalized.entries.map((entry) => ({
      time: entry.time,
      price: entry.price,
      size: entry.size,
    })),
    exits: normalized.exits.map((exit) => ({
      time: exit.time,
      price: exit.price,
      size: exit.size,
      ...(exit.hasExplicitPrice !== undefined
        ? { hasExplicitPrice: exit.hasExplicitPrice }
        : {}),
    })),
    hasExplicitExitPrice: normalized.hasExplicitExitPrice,
  };
}

function getAnalyticsPositionSize(normalized: {
  entries: Array<{ size: number | null }>;
  positionSize: number | null;
}): number {
  const totalEntrySize = normalized.entries.reduce(
    (sum, entry) =>
      entry.size !== null && entry.size > 0 ? sum + entry.size : sum,
    0
  );

  return totalEntrySize || normalized.positionSize || 0;
}

function isDirectPnlPlaceholderExit(normalized: {
  useDirectPnLInput: boolean;
  exitPrice: number | null;
  hasExplicitExitPrice?: boolean;
}): boolean {
  return (
    normalized.useDirectPnLInput &&
    normalized.exitPrice === 0 &&
    normalized.hasExplicitExitPrice !== true
  );
}

function getFirstAnalyticsEntryTime(
  frontmatter: Record<string, unknown>,
  normalized: { firstEntryTime: Date | null }
): Date | null {
  const entries = Array.isArray(frontmatter.entries) ? frontmatter.entries : [];
  const earliest = entries.reduce<Date | null>((current, entry) => {
    if (!entry || typeof entry !== 'object') {
      return current;
    }

    const parsed = safeParseDateValue((entry as { time?: unknown }).time);
    if (!parsed) {
      return current;
    }

    return !current || parsed < current ? parsed : current;
  }, null);

  return (
    earliest ??
    safeParseDateValue(frontmatter.entryTime) ??
    normalized.firstEntryTime
  );
}

function getLastAnalyticsExitTime(
  frontmatter: Record<string, unknown>,
  normalized: { lastExitTime: Date | null }
): Date | null {
  const exits = Array.isArray(frontmatter.exits) ? frontmatter.exits : [];
  const latest = exits.reduce<Date | null>((current, exit) => {
    if (!exit || typeof exit !== 'object') {
      return current;
    }

    const parsed = safeParseDateValue((exit as { time?: unknown }).time);
    if (!parsed) {
      return current;
    }

    return !current || parsed > current ? parsed : current;
  }, null);

  return (
    latest ??
    safeParseDateValue(frontmatter.exitTime) ??
    normalized.lastExitTime
  );
}

export function normalizeTradeExecutionForPeriodAnalytics(
  frontmatter: Record<string, unknown>
): TradeExecutionAnalyticsFields | null {
  const normalized = normalizeTradeExecution(frontmatter, {
    deriveMissingExplicitness: true,
  });
  const entryTime = getFirstAnalyticsEntryTime(frontmatter, normalized);
  if (!entryTime) {
    return null;
  }

  return normalizeTradeExecutionForAnalytics(frontmatter);
}
