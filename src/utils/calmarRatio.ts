import { safeGetTime } from './dateUtils';
import type {
  analyzeDrawdown,
  DrawdownCapitalBasis,
} from './drawdownAnalytics';

const DAY_MS = 86_400_000;

export type CalmarUnavailableReason =
  | 'no-history'
  | 'capital'
  | 'incomplete-history'
  | 'dates'
  | 'short-history'
  | 'no-drawdown'
  | 'non-positive-equity'
  | 'non-finite'
  | 'scope'
  | 'conversion';

type CalmarResult =
  | { value: number; reason?: never }
  | { value?: never; reason: CalmarUnavailableReason };


export function calculateCalmarRatio(
  analytics: ReturnType<typeof analyzeDrawdown>,
  capitalBasis: DrawdownCapitalBasis | undefined
): CalmarResult {
  if (analytics.points.length === 0) return { reason: 'no-history' };
  if (
    capitalBasis?.type !== 'startingEquity' ||
    analytics.summary.basis.capitalBasisType !== 'startingEquity'
  ) {
    return { reason: 'capital' };
  }
  if (analytics.summary.hasIncompleteRealizedTimestamps)
    return { reason: 'dates' };

  const maxDrawdownPercent = analytics.summary.maxDrawdownPercent;
  if (maxDrawdownPercent === null || maxDrawdownPercent <= 0)
    return { reason: 'no-drawdown' };

  let start = Infinity;
  let end = -Infinity;
  for (const point of analytics.points) {
    
    if (point.basisValue === null || point.basisValue <= 0)
      return { reason: 'non-positive-equity' };
    const realizedAt = point.realizedAtMs;
    if (realizedAt === null) return { reason: 'dates' };
    const entryAt = safeGetTime(point.trade.entryTime);
    start = Math.min(start, entryAt ?? realizedAt, realizedAt);
    end = Math.max(end, realizedAt);
  }

  const days = (end - start) / DAY_MS;
  
  if (days < 1) return { reason: 'short-history' };
  const endingEquity =
    analytics.points[analytics.points.length - 1].basisValue!;
  const annualizedReturn = Math.expm1(
    Math.log(endingEquity / capitalBasis.amount) * (365.25 / days)
  );
  const ratio = annualizedReturn / (maxDrawdownPercent / 100);
  return Number.isFinite(ratio) ? { value: ratio } : { reason: 'non-finite' };
}
