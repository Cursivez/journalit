import type { AnalyticsDateBasis } from '../settings/types';
import {
  getEffectivePnL,
  getFirstEntryTime,
  getLastExitTime,
  getPartialExitInfo,
  getWeightedAverageEntryPrice,
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
  
  conversionPnlFactor?: number;
  originalPnlBeforeConversion?: number | null;
}

export interface RealizedPnlEvent {
  date: Date;
  tradingDay: Date;
  pnl: number;
  originalPnl?: number;
  pnlKnown: boolean;
  size?: number;
  source: 'entry' | 'exit';
  execution?: {
    time?: Date | string | null;
    price: number;
    size: number;
  };
}

interface AllocatedRealizedPnlEvent {
  event: RealizedPnlEvent;
  originalIndex: number;
  brokerBaseCurrencyPnl?: number;
}

type BrokerPnlTrade = AnalyticsDateTradeLike & {
  brokerBaseCurrencyPnl?: number | null;
  originalPnlBeforeConversion?: number | null;
};

interface ProjectableRealizedTrade extends BrokerPnlTrade {
  brokerBaseCurrency?: string;
  brokerBaseCurrencyPnlSource?: string;
  rMultiple?: number;
  entryPrice?: number | null;
  exitPrice?: number | null;
  hasExplicitExitPrice?: boolean;
}

interface ProjectedRealizedEventTrade<T extends ProjectableRealizedTrade> {
  trade: T;
  event: RealizedPnlEvent;
  originalIndex: number;
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
  const originalEffectivePnl =
    typeof trade.originalPnlBeforeConversion === 'number' &&
    Number.isFinite(trade.originalPnlBeforeConversion)
      ? trade.originalPnlBeforeConversion
      : getEffectivePnL(trade);

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
        originalPnl: originalEffectivePnl,
        pnlKnown: trade._originalPnlWasNull !== true,
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
        originalPnl: originalEffectivePnl,
        pnlKnown: trade._originalPnlWasNull !== true,
        source: 'exit',
      },
    ];
  }

  
  
  
  const conversionPnlFactor =
    typeof trade.conversionPnlFactor === 'number' &&
    Number.isFinite(trade.conversionPnlFactor) &&
    trade.conversionPnlFactor > 0
      ? trade.conversionPnlFactor
      : 1;
  
  
  
  const toTradeCurrencyCost = (
    value: number | null | undefined
  ): number | undefined =>
    typeof value === 'number' && Number.isFinite(value)
      ? value / conversionPnlFactor
      : undefined;
  const partialExitInfo = getPartialExitInfo({
    ...trade,
    commission:
      trade.commissionType === 'percentage'
        ? (trade.commission ?? undefined)
        : toTradeCurrencyCost(trade.commission),
    swap: toTradeCurrencyCost(trade.swap),
    fees: toTradeCurrencyCost(trade.fees),
    rebate: toTradeCurrencyCost(trade.rebate),
  });
  const events: RealizedPnlEvent[] = [];
  let calculatedTotal = 0;
  let calculatedOriginalTotal = 0;

  for (const exit of partialExitInfo.exits) {
    const exitDate = toValidDate(exit.time);
    if (!exitDate) {
      continue;
    }

    const exitPnl = exit.pnl * conversionPnlFactor;
    calculatedTotal += exitPnl;
    calculatedOriginalTotal += exit.pnl;
    events.push({
      date: exitDate,
      tradingDay: resolveTradingDay(exitDate, plugin, exit.time),
      pnl: exitPnl,
      originalPnl: exit.pnl,
      pnlKnown: true,
      size: exit.size,
      source: 'exit',
      execution: {
        time: exit.time,
        price: exit.price,
        size: exit.size,
      },
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
        originalPnl: originalEffectivePnl,
        pnlKnown: trade._originalPnlWasNull !== true,
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

  const hasAuthoritativePartialPnl =
    trade.tradeStatus === 'PARTIALLY_CLOSED' &&
    trade._originalPnlWasNull !== true &&
    trade.pnl != null &&
    Number.isFinite(trade.pnl);
  const eventTotal =
    isOpen && !hasAuthoritativePartialPnl
      ? partialExitInfo.realizedPnL * conversionPnlFactor
      : getEffectivePnL(trade);
  const residual = eventTotal - calculatedTotal;
  const originalEventTotal =
    isOpen && !hasAuthoritativePartialPnl
      ? partialExitInfo.realizedPnL
      : typeof trade.originalPnlBeforeConversion === 'number' &&
          Number.isFinite(trade.originalPnlBeforeConversion)
        ? trade.originalPnlBeforeConversion
        : eventTotal / conversionPnlFactor;
  const originalResidual = originalEventTotal - calculatedOriginalTotal;
  const lastEvent = events[events.length - 1];
  if (lastEvent && Number.isFinite(residual) && Math.abs(residual) > 1e-9) {
    lastEvent.pnl += residual;
  }
  if (
    lastEvent &&
    Number.isFinite(originalResidual) &&
    Math.abs(originalResidual) > 1e-9
  ) {
    lastEvent.originalPnl = (lastEvent.originalPnl ?? 0) + originalResidual;
  }

  return events;
}


export function getAllocatedRealizedPnlEvents(
  trade: BrokerPnlTrade,
  basis: AnalyticsDateBasis,
  plugin: Parameters<typeof getTradeRealizedPnlEvents>[2]
): AllocatedRealizedPnlEvent[] {
  const events = getTradeRealizedPnlEvents(trade, basis, plugin);
  const effectivePnl =
    typeof trade.originalPnlBeforeConversion === 'number' &&
    Number.isFinite(trade.originalPnlBeforeConversion)
      ? trade.originalPnlBeforeConversion
      : getEffectivePnL(trade);
  const brokerPnl =
    typeof trade.brokerBaseCurrencyPnl === 'number' &&
    Number.isFinite(trade.brokerBaseCurrencyPnl)
      ? trade.brokerBaseCurrencyPnl
      : null;
  const canAllocateProportionally =
    brokerPnl !== null && Number.isFinite(effectivePnl) && effectivePnl !== 0;
  let finalEventIndex = -1;
  for (let index = 0; index < events.length; index += 1) {
    if (
      finalEventIndex === -1 ||
      events[index].date > events[finalEventIndex].date
    ) {
      finalEventIndex = index;
    }
  }

  return events.map((event, originalIndex) => ({
    event,
    originalIndex,
    brokerBaseCurrencyPnl:
      brokerPnl === null
        ? undefined
        : canAllocateProportionally
          ? brokerPnl * (event.pnl / effectivePnl)
          : originalIndex === finalEventIndex
            ? brokerPnl
            : 0,
  }));
}


export function getProjectedRealizedEventTrades<
  T extends ProjectableRealizedTrade,
>(
  trade: T,
  plugin: Parameters<typeof getTradeRealizedPnlEvents>[2]
): ProjectedRealizedEventTrade<T>[] {
  return getAllocatedRealizedPnlEvents(trade, 'exit', plugin).map(
    ({ event, originalIndex, brokerBaseCurrencyPnl }) => ({
      trade: {
        ...trade,
        tradeStatus: 'CLOSED',
        pnl: event.pnl,
        brokerBaseCurrencyPnl,
        brokerBaseCurrency:
          brokerBaseCurrencyPnl !== undefined
            ? trade.brokerBaseCurrency
            : undefined,
        brokerBaseCurrencyPnlSource:
          brokerBaseCurrencyPnl !== undefined
            ? trade.brokerBaseCurrencyPnlSource
            : undefined,
        directPnL: undefined,
        useDirectPnLInput: false,
        rMultiple: undefined,
        exitTime: event.date,
        exitPrice: event.execution?.price ?? trade.exitPrice,
        hasExplicitExitPrice:
          event.execution !== undefined ? true : trade.hasExplicitExitPrice,
        
        
        
        
        entryPrice: getWeightedAverageEntryPrice(trade) ?? trade.entryPrice,
        entries: undefined,
        exits: event.execution ? [event.execution] : undefined,
        _originalPnlWasNull:
          trade._originalPnlWasNull === true && !event.pnlKnown,
      },
      event,
      originalIndex,
    })
  );
}
