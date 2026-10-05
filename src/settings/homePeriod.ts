import type { HomePeriod } from './types';
import { parseLocalDateSafe } from '../utils/dateUtils';

export interface HomeCustomRange {
  start: string;
  end: string;
}

export type HomePeriodSelection =
  | { period: Exclude<HomePeriod, 'custom'> }
  | { period: 'custom'; range: HomeCustomRange };


export function normalizeHomeCustomRange(
  value: unknown
): HomeCustomRange | undefined {
  if (
    !value ||
    typeof value !== 'object' ||
    !('start' in value) ||
    !('end' in value)
  )
    return undefined;
  const { start, end } = value;
  if (
    typeof start !== 'string' ||
    typeof end !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(end) ||
    !parseLocalDateSafe(start) ||
    !parseLocalDateSafe(end) ||
    start > end
  )
    return undefined;
  return { start, end };
}

export function resolveHomePeriodSelection(
  period: unknown,
  range: unknown
): HomePeriodSelection {
  switch (period) {
    case 'week':
    case 'month':
    case 'quarter':
    case 'year':
    case 'lifetime':
      return { period };
    case 'custom': {
      const normalized = normalizeHomeCustomRange(range);
      return normalized
        ? { period, range: normalized }
        : { period: 'lifetime' };
    }
    default:
      return { period: 'lifetime' };
  }
}
