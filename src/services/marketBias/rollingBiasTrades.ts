

import type { AnalyticsDateBasis } from '../../settings/types';
import { getTradeAnalyticsDate } from '../../utils/tradeAnalyticsDate';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import {
  classifyPnLWithBreakEvenSettings,
  normalizeBreakEvenRange,
  type BreakEvenRangeSettings,
} from '../../utils/breakEvenRange';
import type { RollingBiasTrade } from './rollingBiasWinRate';
import type {
  TradeMarketBiasInput,
  TradeMarketBiasResolver,
} from './tradeMarketBias';
import type JournalitPlugin from '../../main';

type RollingSourceTrade = Parameters<typeof isPnlContributingTrade>[0] &
  Parameters<typeof getTradeAnalyticsDate>[0] &
  Parameters<typeof getEffectivePnL>[0] &
  TradeMarketBiasInput & {
    breakEvenAccountCurrentBalance?: number;
  };

export function getBreakEvenSettings(
  plugin: JournalitPlugin | null | undefined
): BreakEvenRangeSettings {
  const trade = plugin?.settings?.trade;
  const range = normalizeBreakEvenRange(trade);
  return {
    breakEvenRangeMin: range.min,
    breakEvenRangeMax: range.max,
    breakEvenThresholdMode: trade?.breakEvenThresholdMode ?? 'fixed',
    breakEvenThresholdPercent: trade?.breakEvenThresholdPercent,
  };
}

export function toRollingBiasTrades(
  trades: readonly RollingSourceTrade[],
  resolveBias: TradeMarketBiasResolver,
  breakEvenSettings: BreakEvenRangeSettings,
  dateBasis: AnalyticsDateBasis
): RollingBiasTrade[] {
  return trades.flatMap((trade) => {
    if (!isPnlContributingTrade(trade)) return [];
    const entryTime = getTradeAnalyticsDate(trade, 'entry');
    const time = getTradeAnalyticsDate(trade, dateBasis);
    if (!entryTime || !time) return [];
    return [
      {
        alignment: resolveBias({ ...trade, entryTime }).alignment,
        outcome: classifyPnLWithBreakEvenSettings(
          getEffectivePnL(trade),
          breakEvenSettings,
          trade.breakEvenAccountCurrentBalance
        ),
        time: time.getTime(),
      },
    ];
  });
}
