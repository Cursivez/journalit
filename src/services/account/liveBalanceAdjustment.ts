export function normalizeLiveBalanceAdjustment(
  liveBalanceAdjustment: number | undefined
): number | undefined {
  return typeof liveBalanceAdjustment === 'number' &&
    Number.isFinite(liveBalanceAdjustment) &&
    Math.abs(liveBalanceAdjustment) > 1e-9
    ? liveBalanceAdjustment
    : undefined;
}

export function hasLiveBalanceAdjustment(
  liveBalanceAdjustment: number | undefined
): boolean {
  return normalizeLiveBalanceAdjustment(liveBalanceAdjustment) !== undefined;
}

export function parseLiveBalanceInput(
  value: string
): number | null | undefined {
  const trimmedValue = value.trim();
  if (trimmedValue === '') {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

export function toLiveBalanceAdjustment(
  liveBalance: number | null,
  computedBalance: number
): number | undefined {
  if (liveBalance === null) {
    return undefined;
  }

  return normalizeLiveBalanceAdjustment(liveBalance - computedBalance);
}
