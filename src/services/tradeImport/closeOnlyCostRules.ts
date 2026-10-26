import type { CustomOptionsService } from '../options/CustomOptionsService';
import type { TradeData } from '../trade/TradeService';
import { applyInstrumentCostRulesToProjection } from '../tradeSync/projectionCostRules';

type CostRuleOptions = Pick<
  CustomOptionsService,
  'calculateInstrumentCommission'
>;


interface TargetState {
  trade: TradeData;
  
  canonicalCommission: number;
  
  ruleCommission: number;
}

const exitedSize = (trade: TradeData): number => {
  const fromRows = (trade.exits ?? []).reduce(
    (total, exit) => (exit.size > 0 ? total + exit.size : total),
    0
  );
  return fromRows > 0 ? fromRows : (trade.closedQuantity ?? 0);
};


export function closeHasCostRule(
  close: TradeData,
  optionsService: CostRuleOptions
): boolean {
  if (!close.instrument || close.positionSize <= 0) return false;
  return (
    optionsService.calculateInstrumentCommission({
      instrument: close.instrument,
      assetType: close.assetType,
      account: close.account,
      positionSize: close.positionSize,
      exitedPositionSize: close.positionSize,
      hasExit: true,
    }) !== undefined
  );
}


export function createCloseOnlyCostRuleAdjuster(
  targets: ReadonlyMap<string, TradeData>,
  optionsService: CostRuleOptions
): (
  targetTradeId: string,
  close: TradeData,
  closeProfitLoss: number
) => number {
  const states = new Map<string, TargetState>();
  return (targetTradeId, close, closeProfitLoss) => {
    let state = states.get(targetTradeId);
    if (!state) {
      const note = targets.get(targetTradeId);
      if (!note) return closeProfitLoss;
      const ruleDerived = note.hasExplicitCommission === false;
      state = {
        trade: note,
        canonicalCommission: ruleDerived ? 0 : (note.commission ?? 0),
        ruleCommission: ruleDerived ? (note.commission ?? 0) : 0,
      };
    }
    const canonicalCommission =
      state.canonicalCommission + (close.commission ?? 0);
    
    
    const closedQuantity =
      exitedSize(state.trade) + (exitedSize(close) || close.positionSize);
    const projected = applyInstrumentCostRulesToProjection(
      {
        ...state.trade,
        commission: canonicalCommission,
        hasExplicitCommission: true,
        exits: [],
        closedQuantity,
        tradeStatus:
          closedQuantity >= state.trade.positionSize
            ? 'CLOSED'
            : 'PARTIALLY_CLOSED',
      },
      optionsService
    );
    const ruleCommission =
      projected.hasExplicitCommission === false
        ? (projected.commission ?? 0)
        : 0;
    states.set(targetTradeId, {
      trade: projected,
      canonicalCommission,
      ruleCommission,
    });
    return closeProfitLoss - (ruleCommission - state.ruleCommission);
  };
}
