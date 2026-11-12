import {
  classifyPnLWithBreakEvenSettings,
  type BreakEvenRangeSettings,
} from '../../utils/breakEvenRange';

export type SetupTradeOutcome = 'win' | 'loss' | 'breakeven';


export type SetupTradeOutcomeClassifier = (
  pnl: number,
  trade: SetupTradeBalanceFields
) => SetupTradeOutcome;


export interface SetupTradeBalanceFields {
  breakEvenAccountCurrentBalance?: unknown;
  breakEvenAccountCurrentBalanceTotal?: unknown;
}

const finiteNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;


export function createSetupTradeOutcomeClassifier(
  settings: BreakEvenRangeSettings | undefined
): SetupTradeOutcomeClassifier {
  return (pnl, trade) => {
    const outcome = classifyPnLWithBreakEvenSettings(
      pnl,
      settings,
      finiteNumber(trade.breakEvenAccountCurrentBalanceTotal) ??
        finiteNumber(trade.breakEvenAccountCurrentBalance)
    );
    return outcome === 'unknown' ? 'breakeven' : outcome;
  };
}
