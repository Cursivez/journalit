

import { getEffectivePnL } from './tradeStatusUtils';
import { calculateActualCommission } from './pnlCalculation';

interface CommissionCostInput {
  commission?: number | null;
  commissionType?: 'fixed' | 'percentage';
  entryPrice?: number | null;
  positionSize?: number | null;
  entries?: Array<{ price?: number | null; size?: number | null }>;
  useDirectPnLInput?: boolean;
  directPnL?: number | null;
}

export function calculateCommissionCost(trade: CommissionCostInput): number {
  return Math.abs(
    calculateActualCommission({
      commission: trade.commission ?? undefined,
      commissionType: trade.commissionType,
      entryPrice: trade.entryPrice ?? undefined,
      positionSize: trade.positionSize ?? undefined,
      entries: trade.entries?.map((entry) => ({
        price: entry.price ?? undefined,
        size: entry.size ?? undefined,
      })),
      useDirectPnLInput: trade.useDirectPnLInput,
      directPnL: trade.directPnL ?? undefined,
    })
  );
}


export function getDisplayPnL(
  pnl: number | undefined,
  _accountCount: number,
  _applyAccountCountMultiplier: boolean
): number {
  if (pnl === undefined || pnl === null) {
    return 0;
  }

  return pnl;
}


export function getAccountCount(trade: {
  account?: string[] | string;
}): number {
  if (!trade.account) {
    return 1;
  }

  if (Array.isArray(trade.account)) {
    return Math.max(trade.account.length, 1);
  }

  return 1;
}


export function mapTradesToDisplayPnL<
  TTrade extends {
    pnl?: number | null;
    directPnL?: number | null;
    authoritativePnl?: number | null;
    canonicalTradeId?: string | null;
    useDirectPnLInput?: boolean;
    _originalPnlWasNull?: boolean;
    dividends?: Array<{ amount?: number | null }>;
    commission?: number | null;
    swap?: number | null;
    fees?: number | null;
    rebate?: number | null;
    account?: string[] | string;
  },
>(
  trades: TTrade[],
  applyAccountCountMultiplier: boolean
): Array<TTrade & { pnl: number; _originalPnlWasNull?: boolean }> {
  return trades.map((trade) => {
    const usesCanonicalPnl =
      trade.authoritativePnl !== undefined || Boolean(trade.canonicalTradeId);
    const effectivePnL =
      trade.authoritativePnl !== undefined
        ? trade.authoritativePnl
        : trade.canonicalTradeId
          ? trade.pnl
          : getEffectivePnL(trade);
    const originalPnlWasNull =
      trade._originalPnlWasNull === true ||
      (usesCanonicalPnl
        ? effectivePnL == null
        : trade.useDirectPnLInput !== true && trade.pnl == null);

    return {
      ...trade,
      _originalPnlWasNull: originalPnlWasNull
        ? true
        : trade._originalPnlWasNull,
      pnl: getDisplayPnL(
        effectivePnL === null ? undefined : effectivePnL,
        getAccountCount(trade),
        applyAccountCountMultiplier
      ),
    };
  });
}
