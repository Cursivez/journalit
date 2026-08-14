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
export type PnLOutcomeWithUnknown = PnLOutcome | 'unknown';

export interface GroupedBreakEvenAccountBalance {
  accountKeys: readonly string[];
  balance: number | undefined;
}


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


export const classifyGroupedPnLWithBreakEvenSettings = ({
  pnl,
  settings,
  accountBalanceGroups,
}: {
  pnl: number;
  settings: BreakEvenRangeSettings | undefined;
  accountBalanceGroups: readonly GroupedBreakEvenAccountBalance[];
}): PnLOutcomeWithUnknown => {
  if (accountBalanceGroups.length === 0) {
    return 'breakeven';
  }

  if (settings?.breakEvenThresholdMode !== 'percentage_current_balance') {
    return classifyPnLWithBreakEvenSettings(pnl, settings);
  }

  const groupsByAccountSet = new Map<
    string,
    { accountKeys: Set<string>; balance: number }
  >();

  for (const group of accountBalanceGroups) {
    if (group.balance === undefined || !Number.isFinite(group.balance)) {
      return 'unknown';
    }

    const normalizedAccountKeys = new Set<string>();
    for (const accountKey of group.accountKeys) {
      const normalizedAccountKey = accountKey.trim().toLowerCase();
      if (normalizedAccountKey) {
        normalizedAccountKeys.add(normalizedAccountKey);
      }
    }
    const accountKeys = Array.from(normalizedAccountKeys).sort();
    if (accountKeys.length === 0) {
      return 'unknown';
    }

    const accountSetKey = accountKeys.join('\u0000');
    const existingGroup = groupsByAccountSet.get(accountSetKey);
    if (existingGroup) {
      if (existingGroup.balance !== group.balance) {
        return 'unknown';
      }
      continue;
    }

    groupsByAccountSet.set(accountSetKey, {
      accountKeys: new Set(accountKeys),
      balance: group.balance,
    });
  }

  const uniqueGroups = Array.from(groupsByAccountSet.values());
  const coveringGroups = uniqueGroups.filter(
    (candidate) =>
      !uniqueGroups.some(
        (other) =>
          other !== candidate &&
          other.accountKeys.size > candidate.accountKeys.size &&
          Array.from(candidate.accountKeys).every((accountKey) =>
            other.accountKeys.has(accountKey)
          )
      )
  );

  for (let i = 0; i < coveringGroups.length; i++) {
    for (let j = i + 1; j < coveringGroups.length; j++) {
      const hasOverlap = Array.from(coveringGroups[i].accountKeys).some(
        (accountKey) => coveringGroups[j].accountKeys.has(accountKey)
      );
      if (hasOverlap) {
        return 'unknown';
      }
    }
  }

  const totalBalance = coveringGroups.reduce(
    (sum, group) => sum + group.balance,
    0
  );
  return classifyPnLWithBreakEvenSettings(pnl, settings, totalBalance);
};


export const calculateWinRateExcludingBreakeven = (
  wins: number,
  losses: number
): number => {
  const decidedTrades = wins + losses;
  return decidedTrades > 0 ? wins / decidedTrades : 0;
};
