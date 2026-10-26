

import type { getTradeAnalyticsTradingDay } from '../../../utils/tradeAnalyticsDate';


export function createTradeDerivationCache<V>(): (
  trade: object,
  context: string,
  derive: () => V
) => V {
  const byTrade = new WeakMap<object, Map<string, { value: V }>>();
  return (trade, context, derive) => {
    const byContext = byTrade.get(trade);
    const cached = byContext?.get(context);
    if (cached) return cached.value;
    const value = derive();
    if (byContext) {
      byContext.set(context, { value });
    } else {
      byTrade.set(trade, new Map([[context, { value }]]));
    }
    return value;
  };
}


const analyticsDayContexts = new Map<string, Map<string | null, string>>();
export const analyticsDayContext = (
  analyticsDateBasis: 'entry' | 'exit',
  plugin: Parameters<typeof getTradeAnalyticsTradingDay>[2]
): string => {
  const cutoff = plugin
    ? (plugin.settings?.trade?.tradingDayCutoffTime ?? '')
    : null;
  let byCutoff = analyticsDayContexts.get(analyticsDateBasis);
  if (!byCutoff) {
    byCutoff = new Map();
    analyticsDayContexts.set(analyticsDateBasis, byCutoff);
  }
  let context = byCutoff.get(cutoff);
  if (context === undefined) {
    context = `${analyticsDateBasis}\u0000${cutoff === null ? 'calendar-day' : `cutoff:${cutoff}`}`;
    byCutoff.set(cutoff, context);
  }
  return context;
};
