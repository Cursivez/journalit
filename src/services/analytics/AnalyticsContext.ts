import type { MaeMfeDisplayUnit } from '../../settings/types';
import type { DrawdownCapitalBasis } from '../../utils/drawdownAnalytics';
import type { WeekStartDaySetting } from '../../utils/dateUtils';

export interface AnalyticsContext {
  currency: string;
  analyticsDateBasis: 'entry' | 'exit';
  tradingDayCutoffTime?: string;
  breakEvenRangeMin?: number;
  breakEvenRangeMax?: number;
  breakEvenThresholdMode: 'fixed' | 'percentage_current_balance';
  breakEvenThresholdPercent?: number;
  defaultRiskAmount?: number;
  drawdownCapitalBasis?: DrawdownCapitalBasis;
  maeMfeDisplayUnit: MaeMfeDisplayUnit;
  weekStartDay: WeekStartDaySetting;
  timezone?: string;
}

export const createAnalyticsContext = (
  input: Partial<AnalyticsContext> = {}
): AnalyticsContext => ({
  currency: input.currency?.trim() || 'USD',
  analyticsDateBasis: input.analyticsDateBasis ?? 'entry',
  tradingDayCutoffTime: input.tradingDayCutoffTime?.trim() || undefined,
  breakEvenRangeMin: input.breakEvenRangeMin,
  breakEvenRangeMax: input.breakEvenRangeMax,
  breakEvenThresholdMode: input.breakEvenThresholdMode ?? 'fixed',
  breakEvenThresholdPercent: input.breakEvenThresholdPercent,
  defaultRiskAmount: input.defaultRiskAmount,
  drawdownCapitalBasis: input.drawdownCapitalBasis,
  maeMfeDisplayUnit: input.maeMfeDisplayUnit ?? 'dollar',
  weekStartDay: input.weekStartDay ?? 'monday',
  timezone: input.timezone?.trim() || undefined,
});
