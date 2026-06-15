import { getTradingDay } from './tradingDayUtils';
import { safeString } from './safeString';

type StoredTradeType = 'regular' | 'missed' | 'backtest';

interface TradeTypeSnapshot {
  filePath?: string;
  type?: unknown;
  isMissedTrade?: unknown;
  isBacktestTrade?: unknown;
  instrument?: unknown;
  entryTime?: unknown;
}

export function inferStoredTradeType(
  snapshot: TradeTypeSnapshot
): StoredTradeType {
  const filePath =
    typeof snapshot.filePath === 'string' ? snapshot.filePath : undefined;

  if (filePath) {
    if (/-M\d+\.md$/i.test(filePath)) {
      return 'missed';
    }
    if (/-B\d+\.md$/i.test(filePath)) {
      return 'backtest';
    }
    if (/-T\d+\.md$/i.test(filePath)) {
      return 'regular';
    }
  }

  if (snapshot.type === 'missed-trade' || snapshot.isMissedTrade === true) {
    return 'missed';
  }

  if (snapshot.type === 'backtest-trade' || snapshot.isBacktestTrade === true) {
    return 'backtest';
  }

  return 'regular';
}

export function getRequestedTradeType(snapshot: {
  isMissedTrade?: unknown;
  isBacktestTrade?: unknown;
}): StoredTradeType {
  if (snapshot.isMissedTrade === true) {
    return 'missed';
  }

  if (snapshot.isBacktestTrade === true) {
    return 'backtest';
  }

  return 'regular';
}

export function normalizeTradeIdentityDate(
  tradeType: StoredTradeType,
  entryTime: unknown,
  plugin?: unknown
): Date | null {
  if (entryTime === null || entryTime === undefined) {
    return null;
  }

  const parsedDate =
    entryTime instanceof Date ? entryTime : new Date(safeString(entryTime));
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const targetDate =
    tradeType === 'missed' && plugin
      ? getTradingDay(parsedDate, plugin)
      : parsedDate;

  return new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );
}

export function hasTradeIdentityChanged(
  currentSnapshot: TradeTypeSnapshot,
  nextSnapshot: TradeTypeSnapshot,
  plugin?: unknown,
  sanitizeTicker?: (ticker: string) => string
): boolean {
  const currentType = inferStoredTradeType(currentSnapshot);
  const nextType = getRequestedTradeType(nextSnapshot);

  if (currentType !== nextType) {
    return true;
  }

  const normalizeTicker = (value: unknown): string => {
    const raw = typeof value === 'string' ? value.trim() : '';
    if (!raw) {
      return '';
    }

    return sanitizeTicker ? sanitizeTicker(raw) : raw.toUpperCase();
  };

  if (
    normalizeTicker(currentSnapshot.instrument) !==
    normalizeTicker(nextSnapshot.instrument)
  ) {
    return true;
  }

  const currentDate = normalizeTradeIdentityDate(
    currentType,
    currentSnapshot.entryTime,
    plugin
  );
  const nextDate = normalizeTradeIdentityDate(
    nextType,
    nextSnapshot.entryTime,
    plugin
  );

  if (currentDate === null || nextDate === null) {
    return currentDate !== nextDate;
  }

  return currentDate.getTime() !== nextDate.getTime();
}
