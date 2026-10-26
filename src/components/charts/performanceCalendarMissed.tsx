

import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { t } from '../../lang/helpers';
import type { AnalyticsDateBasis } from '../../settings/types';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import { formatLocalDateString } from '../../utils/dateUtils';
import { getMissedTradeTradingDay } from '../../utils/tradeAnalyticsDate';
import {
  getEffectivePnL,
  hasMissedTradeOutcome,
} from '../../utils/tradeStatusUtils';
import type { Trade } from '../dashboard/utils/dataUtils';

export interface MissedTotals {
  count: number;
  
  pnl: number | null;
  
  rMultiple: number | null;
  
  hasUnknownR: boolean;
}


export type MissedTradesByDate = Map<string, MissedTotals>;


export function addMissedTrade(
  missedByDate: MissedTradesByDate,
  trade: Trade,
  options: {
    analyticsDateBasis: AnalyticsDateBasis;
    plugin: Parameters<typeof getMissedTradeTradingDay>[2];
    defaultRiskAmount: number | undefined;
    isOutsideDateRange: (date: Date) => boolean;
  }
): void {
  const tradingDay = getMissedTradeTradingDay(
    trade,
    options.analyticsDateBasis,
    options.plugin
  );
  if (!tradingDay || options.isOutsideDateRange(tradingDay)) {
    return;
  }

  const dateKey = formatLocalDateString(tradingDay);
  let tally = missedByDate.get(dateKey);
  if (!tally) {
    tally = { count: 0, pnl: null, rMultiple: null, hasUnknownR: false };
    missedByDate.set(dateKey, tally);
  }
  tally.count++;

  if (!hasMissedTradeOutcome(trade)) {
    return;
  }

  const pnl = getEffectivePnL(trade);
  tally.pnl = (tally.pnl ?? 0) + pnl;
  const rMultiple = calculateEffectiveRMultiple(
    pnl,
    trade.rMultiple,
    trade.riskAmount,
    options.defaultRiskAmount
  );
  if (rMultiple === undefined || !Number.isFinite(rMultiple)) {
    tally.hasUnknownR = true;
    tally.rMultiple = null;
  } else if (!tally.hasUnknownR) {
    tally.rMultiple = (tally.rMultiple ?? 0) + rMultiple;
  }
}


export function sumMissedTotals(
  days: ReadonlyArray<MissedTotals | null>
): MissedTotals | null {
  let sum: MissedTotals | null = null;
  for (const day of days) {
    if (!day) continue;
    sum ??= { count: 0, pnl: null, rMultiple: null, hasUnknownR: false };
    sum.count += day.count;
    if (day.pnl !== null) sum.pnl = (sum.pnl ?? 0) + day.pnl;
    if (day.hasUnknownR) {
      sum.hasUnknownR = true;
      sum.rMultiple = null;
    } else if (day.rMultiple !== null && !sum.hasUnknownR) {
      sum.rMultiple = (sum.rMultiple ?? 0) + day.rMultiple;
    }
  }
  return sum;
}


export const TradeAndMissedCounts: React.FC<{
  tradeCount: number;
  missedCount: number;
}> = ({ tradeCount, missedCount }) => (
  <>
    {t('calendar.trades-short', { count: String(tradeCount) })}
    {' · '}
    <span className="journalit-dashboard-calendar-missed-count">
      {t('calendar.missed-short', { count: String(missedCount) })}
    </span>
  </>
);


export const MissedTradesMarker: React.FC = () => (
  <span
    className="journalit-dashboard-calendar-missed-marker"
    aria-hidden="true"
  />
);


export const MissedOnlySummary: React.FC<{
  totals: MissedTotals;
  valueClassName: string;
  countClassName: string;
}> = ({ totals, valueClassName, countClassName }) => {
  const { currency } = useCurrency();
  const { formatValue } = useDisplayFormatter();

  return (
    <>
      {totals.pnl !== null && (
        <div className={valueClassName}>
          {formatValue({
            kind: 'pnl',
            value: totals.pnl,
            showCents: false,
            currencyCode: currency,
            rMultiple: totals.rMultiple,
          })}
        </div>
      )}
      <div className={countClassName}>
        {t('calendar.missed', { count: String(totals.count) })}
      </div>
    </>
  );
};
