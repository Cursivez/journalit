import type { TakeProfitTarget } from '../../../components/forms/trade/types';
import { resolveTakeProfitCloseSize } from '../../../components/forms/trade/validation';
import { resolveTradeStopLossCoverage } from '../../../utils/riskCalculation';
import type { StopLossTarget } from '../../trade/core/StopLossTargets';
import type { TradeData } from '../../trade/TradeService';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput } from '../ActionTypes';


export type WireTarget = NonNullable<
  ActionInput<'trade.update'>['stop_losses']
>[number];
export type TargetListField = 'stop_losses' | 'take_profits';

export const MAX_TARGETS = 100;

export const MAX_PRICE = 1_000_000_000;
const MAX_SIZE = 1_000_000_000_000;

const TOLERANCE = 1e-9;

export interface PlannedTarget {
  price: number;
  closePercent?: number;
  size?: number;
}

function positive(value: number | undefined, maximum: number): boolean {
  return (
    value === undefined ||
    (Number.isFinite(value) && value > 0 && value <= maximum)
  );
}


export function parseTargetList(
  list: readonly WireTarget[],
  field: TargetListField
): PlannedTarget[] {
  const invalid = () => new ActionPlanError('invalid_request', field);
  if (list.length > MAX_TARGETS) throw invalid();
  let percentTotal = 0;
  let withoutAmount = 0;
  const targets = list.map((item): PlannedTarget => {
    const { price, close_percent: closePercent, size } = item;
    if (
      !Number.isFinite(price) ||
      Math.abs(price) > MAX_PRICE ||
      !positive(closePercent, 100) ||
      !positive(size, MAX_SIZE) ||
      (closePercent !== undefined && size !== undefined)
    ) {
      throw invalid();
    }
    if (closePercent === undefined && size === undefined) withoutAmount++;
    percentTotal += closePercent ?? 0;
    return {
      price,
      ...(closePercent === undefined ? {} : { closePercent }),
      ...(size === undefined ? {} : { size }),
    };
  });
  if (field === 'stop_losses' && withoutAmount > 1) throw invalid();
  if (percentTotal > 100 + TOLERANCE) throw invalid();
  return targets;
}


export function validateTargetTotals(
  next: TradeData,
  requested: { stopLosses: boolean; takeProfits: boolean }
): TargetListField | null {
  if (
    requested.stopLosses &&
    resolveTradeStopLossCoverage(next).status === 'over'
  ) {
    return 'stop_losses';
  }
  const targets = next.takeProfits ?? [];
  const positionSize =
    Number.isFinite(next.positionSize) && next.positionSize > 0
      ? next.positionSize
      : undefined;
  if (
    requested.takeProfits &&
    positionSize !== undefined &&
    targets.some((target) => target.size !== undefined)
  ) {
    const total = targets.reduce(
      (sum, target) => sum + resolveTakeProfitCloseSize(target, positionSize),
      0
    );
    if (total - positionSize > TOLERANCE * Math.max(1, positionSize)) {
      return 'take_profits';
    }
  }
  return null;
}


export function wireTargets(
  stored: readonly (StopLossTarget | TakeProfitTarget)[] | undefined,
  field: TargetListField
): WireTarget[] | null {
  const items: WireTarget[] = [];
  for (const target of stored ?? []) {
    
    if (target.price === undefined) continue;
    items.push({
      price: target.price,
      ...(target.closePercent === undefined
        ? {}
        : { close_percent: target.closePercent }),
      ...(target.size === undefined ? {} : { size: target.size }),
    });
  }
  try {
    parseTargetList(items, field);
  } catch {
    return null;
  }
  return items;
}


export function targetListKey(
  stored: readonly (StopLossTarget | TakeProfitTarget)[] | undefined
): string {
  return JSON.stringify(
    (stored ?? []).flatMap((target) =>
      target.price === undefined
        ? []
        : [[target.price, target.closePercent ?? null, target.size ?? null]]
    )
  );
}
