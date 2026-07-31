import JournalitPlugin from '../../../main';
import type { AnalyticsDateBasis } from '../../../settings/types';

import {
  getAllocatedRealizedPnlEvents,
  getAnalyticsDateBasis,
  getTradeAnalyticsDate,
  getTradeAnalyticsTradingDay,
  type AnalyticsDateTradeLike,
  type RealizedPnlEvent,
} from '../../../utils/tradeAnalyticsDate';

type ReviewRangeTrade = AnalyticsDateTradeLike & {
  _analyticsRangeStart?: Date;
  _analyticsRangeEnd?: Date;
  _reviewBreakdownDate?: Date;
  rMultiple?: number;
  brokerBaseCurrencyPnl?: number | null;
  brokerBaseCurrency?: string;
  brokerBaseCurrencyPnlSource?: string;
  originalPnlBeforeConversion?: number | null;
};

export const getReviewAnalyticsDateBasis = (
  plugin: JournalitPlugin | null | undefined
): AnalyticsDateBasis => getAnalyticsDateBasis(plugin?.settings);

export const getReviewTradeDate = (
  trade: ReviewRangeTrade,
  plugin: JournalitPlugin | null | undefined
): Date | null =>
  trade._reviewBreakdownDate ??
  getTradeAnalyticsDate(trade, getReviewAnalyticsDateBasis(plugin));

export const getReviewTradeTradingDay = (
  trade: ReviewRangeTrade,
  plugin: JournalitPlugin | null | undefined
): Date | null =>
  trade._reviewBreakdownDate ??
  getTradeAnalyticsTradingDay(
    trade,
    getReviewAnalyticsDateBasis(plugin),
    plugin
  );

export const getReviewTradeRealizedPnlEvents = (
  trade: ReviewRangeTrade,
  plugin: JournalitPlugin | null | undefined
): RealizedPnlEvent[] => {
  const usesConvertedZeroBasisBrokerPnl =
    trade.originalPnlBeforeConversion === 0 &&
    typeof trade.brokerBaseCurrencyPnl === 'number';
  const events = getAllocatedRealizedPnlEvents(
    trade,
    getReviewAnalyticsDateBasis(plugin),
    plugin
  ).map(({ event, brokerBaseCurrencyPnl }) =>
    usesConvertedZeroBasisBrokerPnl
      ? { ...event, pnl: brokerBaseCurrencyPnl ?? event.pnl }
      : event
  );

  return events.filter(
    (event) =>
      (!trade._analyticsRangeStart ||
        event.tradingDay >= trade._analyticsRangeStart) &&
      (!trade._analyticsRangeEnd ||
        event.tradingDay <= trade._analyticsRangeEnd)
  );
};

export const splitReviewTradeByRealizedPnlEvent = <T extends ReviewRangeTrade>(
  trade: T,
  plugin: JournalitPlugin | null | undefined
): Array<T & { _reviewBreakdownDate?: Date }> => {
  const allEvents = getAllocatedRealizedPnlEvents(
    trade,
    getReviewAnalyticsDateBasis(plugin),
    plugin
  );
  const events = allEvents.filter(
    ({ event }) =>
      (!trade._analyticsRangeStart ||
        event.tradingDay >= trade._analyticsRangeStart) &&
      (!trade._analyticsRangeEnd ||
        event.tradingDay <= trade._analyticsRangeEnd)
  );
  const shouldKeepStoredRMultiple =
    getReviewAnalyticsDateBasis(plugin) === 'entry';
  const usesConvertedZeroBasisBrokerPnl =
    trade.originalPnlBeforeConversion === 0 &&
    typeof trade.brokerBaseCurrencyPnl === 'number';

  return events.map(({ event, brokerBaseCurrencyPnl }) => ({
    ...trade,
    pnl: usesConvertedZeroBasisBrokerPnl
      ? (brokerBaseCurrencyPnl ?? event.pnl)
      : event.pnl,
    originalPnlBeforeConversion: event.originalPnl ?? event.pnl,
    directPnL: undefined,
    useDirectPnLInput: false,
    brokerBaseCurrencyPnl,
    brokerBaseCurrency:
      brokerBaseCurrencyPnl !== undefined
        ? trade.brokerBaseCurrency
        : undefined,
    brokerBaseCurrencyPnlSource:
      brokerBaseCurrencyPnl !== undefined
        ? trade.brokerBaseCurrencyPnlSource
        : undefined,
    rMultiple: shouldKeepStoredRMultiple ? trade.rMultiple : undefined,
    ...(event.source === 'exit'
      ? { exitTime: event.date, exits: undefined }
      : {}),
    _reviewBreakdownDate: event.tradingDay,
  }));
};
