interface TradeBreakEvenBalanceFields {
  [key: string]: unknown;
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceTotal?: number;
}

export const getBreakEvenBalanceForDisplayTrade = (
  trade: TradeBreakEvenBalanceFields,
  applyAccountCountMultiplier: boolean
): number | undefined => {
  const singleBalance =
    typeof trade.breakEvenAccountCurrentBalance === 'number'
      ? trade.breakEvenAccountCurrentBalance
      : undefined;
  const totalBalance =
    typeof trade.breakEvenAccountCurrentBalanceTotal === 'number'
      ? trade.breakEvenAccountCurrentBalanceTotal
      : undefined;

  return applyAccountCountMultiplier
    ? (totalBalance ?? singleBalance)
    : singleBalance;
};
