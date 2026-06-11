import type { AnalyticsDateBasis } from '../settings/types';
import {
  getEffectivePnL,
  getFirstEntryTime,
  getLastExitTime,
  getPartialExitInfo,
  isTradeOpenWithContext,
} from './tradeStatusUtils';
import { parseTradeTimestampValue } from './dateUtils';
import { getTradingDay } from './tradingDayUtils';

export interface AnalyticsDateTradeLike {
  entryTime?: Date | string | null;
  exitTime?: Date | string | null;
  entries?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  exits?: Array<{
    time?: Date | string | null;
    price?: number | null;
    size?: number | null;
  }>;
  tradeStatus?: string;
  pnl?: number | null;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  _originalPnlWasNull?: boolean;
  direction?: string;
  assetType?: string;
  optionType?: string;
  contractSize?: number;
  dollarPerPoint?: number;
  tickValue?: number;
  tickSize?: number;
  lotSize?: number;
  pipValue?: number;
  commission?: number | null;
  commissionType?: 'fixed' | 'percentage';
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  dividends?: Array<{ amount?: number | null }>;
}

export interface RealizedPnlEvent {
  date: Date;
  tradingDay: Date;
  pnl: number;
  size?: number;
  source: 'entry' | 'exit';
}

export function getAnalyticsDateBasis(settings?: {
  trade?: { analyticsDateBasis?: AnalyticsDateBasis };
}): AnalyticsDateBasis {
  return settings?.trade?.analyticsDateBasis ?? 'entry';
}

export function getTradeAnalyticsDate(
  trade: AnalyticsDateTradeLike,
  basis: AnalyticsDateBasis
): Date | null {
  if (basis === 'entry') {
    const entryTime = getFirstEntryTime(trade);
    return entryTime && !Number.isNaN(entryTime.getTime()) ? entryTime : null;
  }

  const isOpen = isTradeOpenWithContext({
    tradeStatus: trade.tradeStatus,
    exitTime: trade.exitTime,
    pnl: trade._originalPnlWasNull ? null : trade.pnl,
    useDirectPnLInput: trade.useDirectPnLInput,
    exits: trade.exits,
    entries: trade.entries,
  });

  if (isOpen) {
    return null;
  }

  const exitTime = getLastExitTime(trade);
  return exitTime && !Number.isNaN(exitTime.getTime()) ? exitTime : null;
}

const isDateOnlyTimestampValue = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  return (
    value instanceof Date &&
    value.getHours() === 23 &&
    value.getMinutes() === 59 &&
    value.getSeconds() === 59 &&
    value.getMilliseconds() === 999
  );
};

const getAnalyticsDateRawValue = (
  trade: AnalyticsDateTradeLike,
  basis: AnalyticsDateBasis
): Date | string | null | undefined => {
  if (basis === 'entry') {
    return (
      getChronologicalExecutionTime(trade.entries, 'first') ?? trade.entryTime
    );
  }

  return getChronologicalExecutionTime(trade.exits, 'last') ?? trade.exitTime;
};

const getChronologicalExecutionTime = (
  executions:
    | Array<{ time?: Date | string | null; size?: number | null }>
    | undefined,
  position: 'first' | 'last'
): Date | string | null | undefined => {
  if (!executions?.length) {
    return undefined;
  }

  let selectedTime: Date | string | null | undefined;
  let selectedTimestamp: number | undefined;

  for (const execution of executions) {
    if (position === 'last' && !isMeaningfulExitTimeCandidate(execution)) {
      continue;
    }

    const time = execution.time;
    const parsed = parseTradeTimestampValue(time);
    if (!parsed) {
      continue;
    }

    const timestamp = parsed.getTime();
    if (
      selectedTimestamp === undefined ||
      (position === 'first'
        ? timestamp < selectedTimestamp
        : timestamp > selectedTimestamp)
    ) {
      selectedTimestamp = timestamp;
      selectedTime = time;
    }
  }

  return selectedTime;
};

const isMeaningfulExitTimeCandidate = (exit: {
  size?: number | null;
}): boolean => {
  return exit.size === undefined || exit.size === null || exit.size > 0;
};

export function getTradeAnalyticsTradingDay(
  trade: AnalyticsDateTradeLike,
  basis: AnalyticsDateBasis,
  plugin:
    | { settings?: { trade?: { tradingDayCutoffTime?: string } } }
    | null
    | undefined
): Date | null {
  const analyticsDate = getTradeAnalyticsDate(trade, basis);
  if (!analyticsDate || !plugin) {
    return analyticsDate;
  }

  if (isDateOnlyTimestampValue(getAnalyticsDateRawValue(trade, basis))) {
    analyticsDate.setHours(0, 0, 0, 0);
    return analyticsDate;
  }

  return getTradingDay(analyticsDate, plugin);
}

const toValidDate = (value: Date | string | null | undefined): Date | null => {
  if (!value) {
    return null;
  }

  return parseTradeTimestampValue(value);
};

const resolveTradingDay = (
  date: Date,
  plugin:
    | { settings?: { trade?: { tradingDayCutoffTime?: string } } }
    | null
    | undefined,
  rawValue?: Date | string | null
): Date => {
  if (isDateOnlyTimestampValue(rawValue)) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  return plugin ? getTradingDay(date, plugin) : date;
};

export function getTradeRealizedPnlEvents(
  trade: AnalyticsDateTradeLike,
  basis: AnalyticsDateBasis,
  plugin:
    | { settings?: { trade?: { tradingDayCutoffTime?: string } } }
    | null
    | undefined
): RealizedPnlEvent[] {
  if (basis === 'entry') {
    const entryDate = getTradeAnalyticsDate(trade, 'entry');
    if (!entryDate) {
      return [];
    }

    return [
      {
        date: entryDate,
        tradingDay: resolveTradingDay(
          entryDate,
          plugin,
          getAnalyticsDateRawValue(trade, 'entry')
        ),
        pnl: getEffectivePnL(trade),
        source: 'entry',
      },
    ];
  }

  if (!trade.exits || trade.exits.length === 0) {
    const exitDate = getTradeAnalyticsDate(trade, 'exit');
    if (!exitDate) {
      return [];
    }

    return [
      {
        date: exitDate,
        tradingDay: resolveTradingDay(
          exitDate,
          plugin,
          getAnalyticsDateRawValue(trade, 'exit')
        ),
        pnl: getEffectivePnL(trade),
        source: 'exit',
      },
    ];
  }

  const partialExitInfo = getPartialExitInfo({
    ...trade,
    commission: trade.commission ?? undefined,
    swap: trade.swap ?? undefined,
    fees: trade.fees ?? undefined,
    rebate: trade.rebate ?? undefined,
  });
  const events: RealizedPnlEvent[] = [];
  let calculatedTotal = 0;

  for (const exit of partialExitInfo.exits) {
    const exitDate = toValidDate(exit.time);
    if (!exitDate) {
      continue;
    }

    calculatedTotal += exit.pnl;
    events.push({
      date: exitDate,
      tradingDay: resolveTradingDay(exitDate, plugin, exit.time),
      pnl: exit.pnl,
      size: exit.size,
      source: 'exit',
    });
  }

  if (events.length === 0) {
    const exitDate = getTradeAnalyticsDate(trade, 'exit');
    if (!exitDate) {
      return [];
    }

    return [
      {
        date: exitDate,
        tradingDay: resolveTradingDay(
          exitDate,
          plugin,
          getAnalyticsDateRawValue(trade, 'exit')
        ),
        pnl: getEffectivePnL(trade),
        source: 'exit',
      },
    ];
  }

  const isOpen = isTradeOpenWithContext({
    tradeStatus: trade.tradeStatus,
    exitTime: trade.exitTime,
    pnl: trade._originalPnlWasNull ? null : trade.pnl,
    useDirectPnLInput: trade.useDirectPnLInput,
    exits: trade.exits,
    entries: trade.entries,
  });

  const eventTotal = isOpen
    ? partialExitInfo.realizedPnL
    : getEffectivePnL(trade);
  const residual = eventTotal - calculatedTotal;
  const lastEvent = events[events.length - 1];
  if (lastEvent && Number.isFinite(residual) && Math.abs(residual) > 1e-9) {
    lastEvent.pnl += residual;
  }

  return events;
}
