import type { Trade } from './dataUtils';
import type { MaeMfeDisplayUnit } from '../../../settings/types';
import {
  classifyPnLWithBreakEvenSettings,
  type BreakEvenRangeSettings,
} from '../../../utils/breakEvenRange';
import {
  getTradeMfeTicks,
  getTradeMfeValue,
} from '../../../utils/tradeExcursion';
import {
  getEffectivePnL,
  getTotalEntrySize,
  isPnlContributingTrade,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';

interface MfeScatterDataPoint {
  observationId: string;
  observationIndex: number;
  path: string;
  mfe: number;
  realized: number;
  outcome: 'win' | 'loss' | 'breakeven' | 'unknown';
}


export function prepareMfeScatterData(
  trades: readonly Trade[],
  unit: MaeMfeDisplayUnit,
  currency: string,
  breakEvenSettings?: BreakEvenRangeSettings
): MfeScatterDataPoint[] {
  const points: MfeScatterDataPoint[] = [];

  for (let sourceIndex = 0; sourceIndex < trades.length; sourceIndex += 1) {
    const trade = trades[sourceIndex];
    if (
      trade._originalPnlWasNull === true &&
      !(
        trade.useDirectPnLInput === true &&
        typeof trade.directPnL === 'number' &&
        Number.isFinite(trade.directPnL)
      )
    ) {
      continue;
    }
    if (isTradeOpenWithContext(trade) || !isPnlContributingTrade(trade)) {
      continue;
    }
    const mfe =
      unit === 'ticks' ? getTradeMfeTicks(trade) : getTradeMfeValue(trade);
    if (mfe === undefined || !Number.isFinite(mfe)) continue;
    let realized = getEffectivePnL(
      trade._originalPnlWasNull ? { ...trade, pnl: null } : trade
    );
    
    
    const outcome = classifyPnLWithBreakEvenSettings(
      realized,
      (trade.currency || currency) === currency ? breakEvenSettings : undefined,
      trade.breakEvenAccountCurrentBalance
    );
    if (unit === 'ticks') {
      const size = getTotalEntrySize(trade);
      const tickValue = trade.tickValue;
      if (
        size === null ||
        size <= 0 ||
        typeof tickValue !== 'number' ||
        !Number.isFinite(tickValue) ||
        tickValue <= 0
      ) {
        continue;
      }
      realized =
        (trade.originalPnlBeforeConversion ?? realized) / (tickValue * size);
    } else if ((trade.currency || currency) !== currency) {
      
      continue;
    }
    if (!Number.isFinite(realized)) continue;

    points.push({
      observationId:
        trade.tradeId ??
        trade._dashboardExcursionSourceKey ??
        `${trade.path}::mfe::${sourceIndex}`,
      observationIndex: points.length + 1,
      path: trade.path,
      mfe: Math.abs(mfe),
      realized,
      outcome,
    });
  }

  return points;
}
