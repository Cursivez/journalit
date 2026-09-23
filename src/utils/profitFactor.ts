
export function calculateProfitFactor(
  grossProfit: number,
  grossLossAbs: number
): number {
  return grossLossAbs > 0
    ? grossProfit / grossLossAbs
    : grossProfit > 0
      ? Infinity
      : 0;
}
