import { calculateTotalDividends } from '../../utils/pnlCalculation';
import {
  getEffectivePnL,
  getPartialExitInfo,
  hasRealizedStoredPnL,
} from '../../utils/tradeStatusUtils';
import {
  calculateSnapshotRealizedPnL,
  calculateUnrealizedPnL,
} from '../../utils/unrealizedPnl';

export function getTradeLogFloatingPnL(
  trade: Record<string, unknown>,
  snapshotKeysClaimedByCustomFields: boolean
): number | null {
  if (snapshotKeysClaimedByCustomFields) return null;

  const unrealizedPnL = calculateUnrealizedPnL(trade);
  if (unrealizedPnL === null) return null;

  const realizedPnL = getEffectivePnL(trade);
  const partialExitInfo = getPartialExitInfo(trade);
  const currentRealizedPnL = hasRealizedStoredPnL(trade)
    ? realizedPnL
    : partialExitInfo.isPartialExit
      ? partialExitInfo.realizedPnL + calculateTotalDividends(trade)
      : 0;

  return (
    calculateSnapshotRealizedPnL(trade, currentRealizedPnL) + unrealizedPnL
  );
}

export function getTradeLogDisplayedPnL(
  trade: Record<string, unknown>,
  snapshotKeysClaimedByCustomFields: boolean
): number {
  return (
    getTradeLogFloatingPnL(trade, snapshotKeysClaimedByCustomFields) ??
    getEffectivePnL(trade)
  );
}
