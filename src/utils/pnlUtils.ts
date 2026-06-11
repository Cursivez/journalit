


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
    useDirectPnLInput?: boolean;
    _originalPnlWasNull?: boolean;
    account?: string[] | string;
  },
>(
  trades: TTrade[],
  applyAccountCountMultiplier: boolean
): Array<TTrade & { pnl: number; _originalPnlWasNull?: boolean }> {
  return trades.map((trade) => {
    const effectivePnL =
      trade.useDirectPnLInput === true && trade.directPnL != null
        ? trade.directPnL
        : trade.pnl;
    const originalPnlWasNull =
      trade._originalPnlWasNull === true ||
      (trade.useDirectPnLInput !== true && trade.pnl == null);

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
