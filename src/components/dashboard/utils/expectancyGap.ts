import type { Trade } from './dataUtils';
import { hasUnknownCanonicalPnL } from '../../../services/trade/core/CanonicalProjectionFields';
import {
  getEffectivePnL,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { resolveTradeRiskAmount } from '../../../utils/riskCalculation';
import { extractPriceMoveValueFields } from '../../../utils/priceMoveValue';

export interface ExpectancySample {
  realizedR: number | null;
  included: number;
  closed: number;
}


export function calculateExpectancySample(
  trades: readonly Trade[]
): ExpectancySample {
  let total = 0;
  let included = 0;
  let closed = 0;
  for (const trade of trades) {
    if (
      trade.isBacktestTrade ||
      trade.isMissedTrade ||
      trade.tradeStatus === 'CANCELLED' ||
      isTradeOpenWithContext(trade)
    )
      continue;
    closed++;
    const knownStoredPnL =
      !trade._originalPnlWasNull && Number.isFinite(trade.pnl);
    const knownDirectPnL =
      trade.useDirectPnLInput === true && Number.isFinite(trade.directPnL);
    if (hasUnknownCanonicalPnL(trade) || (!knownStoredPnL && !knownDirectPnL))
      continue;
    const pnl = getEffectivePnL(trade);
    
    
    const recordedR =
      typeof trade.rMultiple === 'number' &&
      Number.isFinite(trade.rMultiple) &&
      trade.rMultiple !== 0
        ? trade.rMultiple
        : undefined;
    
    
    const risk =
      recordedR === undefined
        ? resolveTradeRiskAmount({
            ...extractPriceMoveValueFields(trade),
            riskAmount: trade.riskAmount,
            stopLosses: trade.stopLosses,
            direction: trade.direction,
            entryPrice: trade.entryPrice,
            positionSize: trade.positionSize,
            entries: trade.entries?.map((entry) => ({
              price: entry.price ?? undefined,
              size: entry.size ?? undefined,
            })),
          })
        : undefined;
    const r = calculateEffectiveRMultiple(pnl, recordedR, risk, undefined);
    if (r === undefined || !Number.isFinite(r)) continue;
    total += r;
    included++;
  }
  const mean = included > 0 ? total / included : null;
  return {
    realizedR: mean !== null && Number.isFinite(mean) ? mean : null,
    included,
    closed,
  };
}

export function calculateExpectancyGap(
  realizedR: number | null,
  expectedR: number | null
): number | null {
  if (realizedR === null || expectedR === null) return null;
  const gap = realizedR - expectedR;
  return Number.isFinite(gap) ? gap : null;
}
