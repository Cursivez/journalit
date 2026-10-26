import {
  calculateTotalDividends,
  resolveRealizedOrTerminalPnL,
} from '../../utils/pnlCalculation';
import {
  getCurrentRealizedPnL,
  getPartialExitInfo,
  hasMissedTradeOutcome,
  hasRealizedStoredPnL,
  isTradeOpenWithContext,
} from '../../utils/tradeStatusUtils';
import { hasUnknownCanonicalPnL } from '../../services/trade/core/CanonicalProjectionFields';
import type { PartialTradeFrontmatter } from '../../types/TradeFrontmatter';
import type { TradeLogTrade } from '../../services/tradelog/types';
import {
  calculateSnapshotRealizedPnL,
  calculateUnrealizedPnL,
} from '../../utils/unrealizedPnl';

export function getTradeLogFloatingPnL(
  trade: PartialTradeFrontmatter & Record<string, unknown>,
  snapshotKeysClaimedByCustomFields: boolean
): number | null {
  if (snapshotKeysClaimedByCustomFields) return null;

  const unrealizedPnL = calculateUnrealizedPnL(trade);
  if (unrealizedPnL === null) return null;

  const currentRealizedPnL = getCurrentRealizedPnL(
    trade,
    calculateTotalDividends(trade)
  );
  if (currentRealizedPnL === null) return null;

  return (
    calculateSnapshotRealizedPnL(trade, currentRealizedPnL) + unrealizedPnL
  );
}

export function getTradeLogDisplayedPnL(
  trade: TradeLogTrade,
  snapshotKeysClaimedByCustomFields: boolean
): number {
  if (trade._analyticsEventContext)
    return trade._analyticsEventContext.pnl ?? 0;
  const floatingPnL = getTradeLogFloatingPnL(
    trade,
    snapshotKeysClaimedByCustomFields
  );
  if (floatingPnL !== null) return floatingPnL;

  return resolveRealizedOrTerminalPnL(trade) ?? 0;
}


export function getTradeLogPnlValue(
  trade: TradeLogTrade,
  snapshotKeysClaimedByCustomFields: boolean
): number | null {
  if (hasUnknownCanonicalPnL(trade)) return null;
  
  
  if (trade._analyticsEventContext) return trade._analyticsEventContext.pnl;
  if (trade.isMissedTrade && !hasMissedTradeOutcome(trade)) return null;
  const floatingPnL = getTradeLogFloatingPnL(
    trade,
    snapshotKeysClaimedByCustomFields
  );
  if (floatingPnL !== null) return floatingPnL;
  if (
    isTradeOpenWithContext(trade) &&
    !getPartialExitInfo(trade).isPartialExit &&
    !hasRealizedStoredPnL(trade)
  )
    return null;
  return resolveRealizedOrTerminalPnL(trade) ?? 0;
}
