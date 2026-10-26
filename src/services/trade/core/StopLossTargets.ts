import { resolveTradePositionSide } from './TradeDirection';
import type { TradeDirectionInput } from './TradeDirection';


export interface StopLossTarget {
  
  clientId?: string;
  price?: number;
  
  closePercent?: number;
  
  size?: number;
}


interface PersistedStopLossTarget {
  price: number;
  closePercent?: number;
  size?: number;
}


export interface StopLossLeg {
  price: number;
  size: number;
}

export type StopLossCoverage =
  
  | { status: 'none' }
  
  | { status: 'ambiguous' }
  
  | { status: 'no-position-size' }
  
  | { status: 'partial'; coveredSize: number; positionSize: number }
  
  | { status: 'over'; coveredSize: number; positionSize: number }
  
  | { status: 'complete'; legs: StopLossLeg[]; positionSize: number };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);


export const parseFiniteNumber = (value: unknown): number | undefined => {
  if (isFiniteNumber(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};


export const hasStopLossAmount = (target: StopLossTarget): boolean =>
  isFiniteNumber(target.closePercent) || isFiniteNumber(target.size);


export const isPricedStopLoss = (
  target: StopLossTarget
): target is StopLossTarget & { price: number } => isFiniteNumber(target.price);


export const hasPricedStopLoss = (
  targets: readonly StopLossTarget[] | undefined
): boolean => (targets ?? []).some(isPricedStopLoss);


export function parseStopLossTargets(value: unknown): StopLossTarget[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item): StopLossTarget[] => {
    if (!isRecord(item)) return [];
    const price = parseFiniteNumber(item.price);
    const closePercent = parseFiniteNumber(item.closePercent);
    const size = parseFiniteNumber(item.size);
    if (
      price === undefined &&
      closePercent === undefined &&
      size === undefined
    ) {
      return [];
    }

    return [
      {
        ...(price !== undefined && { price }),
        ...(closePercent !== undefined &&
          size === undefined && { closePercent }),
        ...(size !== undefined && { size }),
      },
    ];
  });
}


export function serializeStopLossTargets(
  targets: readonly StopLossTarget[] | undefined
): PersistedStopLossTarget[] | undefined {
  const serialized = (targets ?? []).flatMap((target) =>
    isPricedStopLoss(target)
      ? [
          {
            price: target.price,
            ...(isFiniteNumber(target.closePercent) && {
              closePercent: target.closePercent,
            }),
            ...(isFiniteNumber(target.size) && { size: target.size }),
          },
        ]
      : []
  );
  return serialized.length > 0 ? serialized : undefined;
}


const sizeTolerance = (positionSize: number): number =>
  1e-9 * Math.max(1, Math.abs(positionSize));


export const resolveExplicitStopSize = (
  target: StopLossTarget,
  positionSize: number | undefined
): number => {
  if (isFiniteNumber(target.size)) return Math.max(target.size, 0);
  if (positionSize !== undefined && isFiniteNumber(target.closePercent)) {
    return Math.max((target.closePercent / 100) * positionSize, 0);
  }
  return 0;
};


export function resolveStopLossCoverage(
  targets: readonly StopLossTarget[] | undefined,
  positionSize: number | undefined
): StopLossCoverage {
  const explicitStops: Array<StopLossTarget & { price: number }> = [];
  const blankStops: Array<StopLossTarget & { price: number }> = [];
  for (const target of targets ?? []) {
    if (!isPricedStopLoss(target)) continue;
    (hasStopLossAmount(target) ? explicitStops : blankStops).push(target);
  }
  if (explicitStops.length + blankStops.length === 0) {
    return { status: 'none' };
  }
  if (blankStops.length > 1) return { status: 'ambiguous' };

  if (!isFiniteNumber(positionSize) || positionSize <= 0) {
    return { status: 'no-position-size' };
  }

  const tolerance = sizeTolerance(positionSize);
  const explicitLegs = explicitStops.map((target) => ({
    price: target.price,
    size: resolveExplicitStopSize(target, positionSize),
  }));
  const coveredSize = explicitLegs.reduce((total, leg) => total + leg.size, 0);

  if (coveredSize - positionSize > tolerance) {
    return { status: 'over', coveredSize, positionSize };
  }

  const [blankStop] = blankStops;
  const legs = blankStop
    ? [
        ...explicitLegs,
        {
          price: blankStop.price,
          size: Math.max(positionSize - coveredSize, 0),
        },
      ]
    : explicitLegs;

  if (!blankStop && positionSize - coveredSize > tolerance) {
    return { status: 'partial', coveredSize, positionSize };
  }

  return {
    status: 'complete',
    legs: legs.filter((leg) => leg.size > 0),
    positionSize,
  };
}


export function resolveEffectiveStopPrice(
  legs: readonly StopLossLeg[]
): number | undefined {
  const totalSize = legs.reduce((total, leg) => total + leg.size, 0);
  if (totalSize <= 0) return undefined;
  return (
    legs.reduce((total, leg) => total + leg.price * leg.size, 0) / totalSize
  );
}


export function calculateStopLossPriceDistance(
  legs: readonly StopLossLeg[],
  weightedEntryPrice: number,
  direction: TradeDirectionInput
): number {
  const totalSize = legs.reduce((total, leg) => total + leg.size, 0);
  if (totalSize <= 0) return 0;

  const side = resolveTradePositionSide(direction);
  if (side === null) {
    return (
      legs.reduce(
        (total, leg) =>
          total + leg.size * Math.abs(weightedEntryPrice - leg.price),
        0
      ) / totalSize
    );
  }

  const effectiveStop = resolveEffectiveStopPrice(legs);
  if (effectiveStop === undefined) return 0;
  const distance =
    side === 'long'
      ? weightedEntryPrice - effectiveStop
      : effectiveStop - weightedEntryPrice;
  return Math.max(distance, 0);
}
