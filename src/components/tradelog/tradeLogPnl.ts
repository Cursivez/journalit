import {
  calculateTotalDividends,
  resolveRealizedOrTerminalPnL,
} from '../../utils/pnlCalculation';
import { getCurrentRealizedPnL } from '../../utils/tradeStatusUtils';
import type { PartialTradeFrontmatter } from '../../types/TradeFrontmatter';
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
  trade: PartialTradeFrontmatter & Record<string, unknown>,
  snapshotKeysClaimedByCustomFields: boolean
): number {
  const floatingPnL = getTradeLogFloatingPnL(
    trade,
    snapshotKeysClaimedByCustomFields
  );
  if (floatingPnL !== null) return floatingPnL;

  return resolveRealizedOrTerminalPnL(trade) ?? 0;
}
