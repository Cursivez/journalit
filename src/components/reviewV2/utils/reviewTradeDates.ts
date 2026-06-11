import JournalitPlugin from '../../../main';
import type { AnalyticsDateBasis } from '../../../settings/types';

import {
  getAnalyticsDateBasis,
  getTradeAnalyticsDate,
  getTradeAnalyticsTradingDay,
  getTradeRealizedPnlEvents,
  type AnalyticsDateTradeLike,
  type RealizedPnlEvent,
} from '../../../utils/tradeAnalyticsDate';

type ReviewRangeTrade = AnalyticsDateTradeLike & {
  _analyticsRangeStart?: Date;
  _analyticsRangeEnd?: Date;
  _reviewBreakdownDate?: Date;
  rMultiple?: number;
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
  const events = getTradeRealizedPnlEvents(
    trade,
    getReviewAnalyticsDateBasis(plugin),
    plugin
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
  const events = getReviewTradeRealizedPnlEvents(trade, plugin);
  const shouldKeepStoredRMultiple =
    getReviewAnalyticsDateBasis(plugin) === 'entry';

  return events.map((event) => ({
    ...trade,
    pnl: event.pnl,
    rMultiple: shouldKeepStoredRMultiple ? trade.rMultiple : undefined,
    ...(event.source === 'exit'
      ? { exitTime: event.date, exits: undefined }
      : {}),
    _reviewBreakdownDate: event.tradingDay,
  }));
};
