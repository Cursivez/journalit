import type { Trade } from './dataUtils';
import type { MaeMfeDisplayUnit } from '../../../settings/types';
import {
  classifyPnLWithBreakEvenSettings,
  type BreakEvenRangeSettings,
} from '../../../utils/breakEvenRange';
import {
  getTradeMaeTicks,
  getTradeMaeValue,
  getTradeMfeTicks,
  getTradeMfeValue,
} from '../../../utils/tradeExcursion';
import {
  getEffectivePnL,
  getTotalEntrySize,
  hasMissedTradeOutcome,
  isPnlContributingTrade,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';

export type ExcursionSide = 'mae' | 'mfe';

export interface ExcursionScatterDataPoint {
  observationId: string;
  observationIndex: number;
  path: string;
  
  excursion: number;
  realized: number;
  outcome: 'win' | 'loss' | 'breakeven' | 'unknown';
}

const EXCURSION_READERS: Record<
  ExcursionSide,
  Record<MaeMfeDisplayUnit, (trade: Trade) => number | undefined>
> = {
  mae: { dollar: getTradeMaeValue, ticks: getTradeMaeTicks },
  mfe: { dollar: getTradeMfeValue, ticks: getTradeMfeTicks },
};


export function prepareExcursionScatterData(
  trades: readonly Trade[],
  side: ExcursionSide,
  unit: MaeMfeDisplayUnit,
  currency: string,
  breakEvenSettings?: BreakEvenRangeSettings
): ExcursionScatterDataPoint[] {
  const readExcursion = EXCURSION_READERS[side][unit];
  const points: ExcursionScatterDataPoint[] = [];

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
    
    
    if (trade.isMissedTrade === true && !hasMissedTradeOutcome(trade)) {
      continue;
    }
    const excursion = readExcursion(trade);
    if (excursion === undefined || !Number.isFinite(excursion)) continue;
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
        `${trade.path}::${side}::${sourceIndex}`,
      observationIndex: points.length + 1,
      path: trade.path,
      excursion: Math.abs(excursion),
      realized,
      outcome,
    });
  }

  return points;
}
