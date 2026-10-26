import type { TakeProfitTarget } from '../../../components/forms/trade/types';
import { parseFiniteNumber } from './StopLossTargets';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);


export function parseTakeProfitTargets(value: unknown): TakeProfitTarget[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item): TakeProfitTarget[] => {
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
        ...(closePercent !== undefined && { closePercent }),
        ...(size !== undefined && { size }),
      },
    ];
  });
}
