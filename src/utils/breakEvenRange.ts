export interface BreakEvenRangeSettings {
  breakEvenRangeMin?: number;
  breakEvenRangeMax?: number;
  breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
  breakEvenThresholdPercent?: number;
  min?: number;
  max?: number;
}

interface NormalizedBreakEvenRange {
  min: number;
  max: number;
}

type PnLOutcome = 'win' | 'loss' | 'breakeven';
type PnLOutcomeWithUnknown = PnLOutcome | 'unknown';


export const normalizeBreakEvenRange = (
  settings?: BreakEvenRangeSettings
): NormalizedBreakEvenRange => {
  let min = settings?.breakEvenRangeMin ?? settings?.min ?? 0;
  let max = settings?.breakEvenRangeMax ?? settings?.max ?? 0;

  if (min > max) {
    [min, max] = [max, min];
  }

  return { min, max };
};

const getBreakEvenRangeForClassification = (
  settings: BreakEvenRangeSettings | undefined,
  accountCurrentBalance?: number
): NormalizedBreakEvenRange | null => {
  const mode = settings?.breakEvenThresholdMode ?? 'fixed';

  if (mode !== 'percentage_current_balance') {
    return normalizeBreakEvenRange(settings);
  }

  if (
    accountCurrentBalance === undefined ||
    accountCurrentBalance === null ||
    !Number.isFinite(accountCurrentBalance)
  ) {
    return null;
  }

  const configuredPercent = settings?.breakEvenThresholdPercent ?? 0;
  const safePercent = Number.isFinite(configuredPercent)
    ? Math.max(0, configuredPercent)
    : 0;

  const threshold = (Math.abs(accountCurrentBalance) * safePercent) / 100;
  return {
    min: -threshold,
    max: threshold,
  };
};


export const classifyPnLByBreakEvenRange = (
  pnl: number,
  settings?: BreakEvenRangeSettings
): PnLOutcome => {
  const { min, max } = normalizeBreakEvenRange(settings);

  if (pnl > max) return 'win';
  if (pnl < min) return 'loss';
  return 'breakeven';
};


export const classifyPnLWithBreakEvenSettings = (
  pnl: number,
  settings?: BreakEvenRangeSettings,
  accountCurrentBalance?: number
): PnLOutcomeWithUnknown => {
  const range = getBreakEvenRangeForClassification(
    settings,
    accountCurrentBalance
  );

  if (!range) {
    return 'unknown';
  }

  if (pnl > range.max) return 'win';
  if (pnl < range.min) return 'loss';
  return 'breakeven';
};


export const calculateWinRateExcludingBreakeven = (
  wins: number,
  losses: number
): number => {
  const decidedTrades = wins + losses;
  return decidedTrades > 0 ? wins / decidedTrades : 0;
};
