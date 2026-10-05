import {
  canPreserveProfileState,
  sameProfileContent,
} from './PropChallengePolicyHistory';
import { parseApplicability, isPurchaseDate } from './ProfileApplicability';
import type {
  PropChallengeConfig,
  PropFirmCatalogCorrection,
  PropChallengeCost,
  PropChallengeMaximumPayoutOutcome,
  PropChallengePayoutAftermath,
  PropChallengePayoutAvailability,
  PropChallengePayoutCycle,
  PropChallengePayoutLifetimeQualifyingDaysUnlock,
  PropChallengePayoutMaximum,
  PropChallengePayoutPolicy,
  PropChallengePayoutRequestWindow,
  PropChallengeProfitSplit,
  PropChallengePhase,
  PropChallengePolicyRevision,
  PropChallengeRule,
  PropFirmProfileCatalog,
  PropFirmIndex,
  PropFirmIndexCache,
  PropFirmSummary,
  PropFirmProfileCatalogCache,
  PropFirmProfileChallenge,
  PropFirmProfileFirm,
  PropFirmProfilePhase,
  PropFirmProfileRule,
  PropChallengePayoutPlan,
  PropChallengeNoticeState,
  PropChallengeNoticeKind,
  PropChallengeActiveNotice,
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);


const isPositiveDayCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1;

function normalizeBrokerAccountIds(value: unknown): string[] | undefined {
  const ids: string[] = [];
  const seen = new Set<string>();
  const add = (item: unknown) => {
    if (typeof item !== 'string') return;
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) return;
    seen.add(trimmed);
    ids.push(trimmed);
  };
  if (Array.isArray(value)) {
    for (const item of value) add(item);
  }
  return ids.length > 0 ? ids : undefined;
}

function normalizeDailyLossIncrease(
  value: Record<string, unknown>
):
  | { profitThresholdPercent: number; amountAfterThreshold: number }
  | Record<string, never>
  | null {
  if (
    value.profitThresholdPercent === undefined &&
    value.amountAfterThreshold === undefined
  ) {
    return {};
  }
  return isFiniteNumber(value.profitThresholdPercent) &&
    value.profitThresholdPercent > 0 &&
    isFiniteNumber(value.amountAfterThreshold) &&
    value.amountAfterThreshold > 0
    ? {
        profitThresholdPercent: value.profitThresholdPercent,
        amountAfterThreshold: value.amountAfterThreshold,
      }
    : null;
}

function normalizeDailyLossScaling(value: Record<string, unknown>):
  | {
      scaleAtBalance: number;
      scaledAmountPercentOfPeakEodProfit: number;
    }
  | Record<string, never>
  | null {
  if (
    value.scaleAtBalance === undefined &&
    value.scaledAmountPercentOfPeakEodProfit === undefined
  ) {
    return {};
  }
  return isFiniteNumber(value.scaleAtBalance) &&
    value.scaleAtBalance > 0 &&
    isFiniteNumber(value.scaledAmountPercentOfPeakEodProfit) &&
    value.scaledAmountPercentOfPeakEodProfit > 0 &&
    value.scaledAmountPercentOfPeakEodProfit <= 100
    ? {
        scaleAtBalance: value.scaleAtBalance,
        scaledAmountPercentOfPeakEodProfit:
          value.scaledAmountPercentOfPeakEodProfit,
      }
    : null;
}

function normalizeDailyLossTiers(
  value: unknown,
  initialAmount: number
): Array<{ profit: number; amount: number }> | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const tiers: Array<{ profit: number; amount: number }> = [];
  let previousProfit = 0;
  let previousAmount = initialAmount;
  for (const candidate of value) {
    if (
      !isRecord(candidate) ||
      !isFiniteNumber(candidate.profit) ||
      candidate.profit <= previousProfit ||
      !isFiniteNumber(candidate.amount) ||
      candidate.amount <= previousAmount
    )
      return null;
    tiers.push({ profit: candidate.profit, amount: candidate.amount });
    previousProfit = candidate.profit;
    previousAmount = candidate.amount;
  }
  return tiers;
}

function normalizePositionProfitBasis(
  value: unknown
): 'cumulative_trade_profit' | 'current_account_profit' | undefined | null {
  return value === undefined ||
    value === 'cumulative_trade_profit' ||
    value === 'current_account_profit'
    ? value
    : null;
}


function normalizePositionSizeCounting(
  value: Record<string, unknown>
): { microsPerContract?: 10 } | null {
  if (value.microsPerContract === undefined) return {};
  return value.microsPerContract === 10 ? { microsPerContract: 10 } : null;
}

function normalizePositionProfitTiers(
  value: unknown,
  initialContracts: number
): Array<{ profit: number; maxContracts: number }> | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const tiers: Array<{ profit: number; maxContracts: number }> = [];
  let previousProfit = 0;
  let previousContracts = initialContracts;
  for (const candidate of value) {
    if (
      !isRecord(candidate) ||
      !isFiniteNumber(candidate.profit) ||
      candidate.profit <= previousProfit ||
      !isFiniteNumber(candidate.maxContracts) ||
      candidate.maxContracts <= previousContracts
    ) {
      return null;
    }
    tiers.push({
      profit: candidate.profit,
      maxContracts: candidate.maxContracts,
    });
    previousProfit = candidate.profit;
    previousContracts = candidate.maxContracts;
  }
  return tiers;
}

const isIsoDateString = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value));

function normalizeRule(value: unknown): PropChallengeRule | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.enabled !== 'boolean'
  )
    return null;
  switch (value.kind) {
    case 'profit_target':
      return isPositiveAmount(value.amount) &&
        (value.targetType === 'absolute' || value.targetType === 'percentage')
        ? {
            id: value.id,
            enabled: value.enabled,
            kind: value.kind,
            amount: value.amount,
            targetType: value.targetType,
            ...(value.creditWithdrawals === true &&
            value.targetType === 'absolute'
              ? { creditWithdrawals: true }
              : {}),
          }
        : null;
    case 'drawdown': {
      if (
        !isPositiveAmount(value.amount) ||
        (value.mode !== 'static' &&
          value.mode !== 'eod_trailing' &&
          value.mode !== 'intraday_trailing')
      )
        return null;
      const rule: PropChallengeRule = {
        id: value.id,
        enabled: value.enabled,
        kind: value.kind,
        mode: value.mode,
        amount: value.amount,
      };
      if (value.mode !== 'static' && isFiniteNumber(value.lockAtBalance))
        rule.lockAtBalance = value.lockAtBalance;
      return rule;
    }
    case 'daily_loss_limit': {
      const increase = normalizeDailyLossIncrease(value);
      const scaling = normalizeDailyLossScaling(value);
      const lossTiers = isPositiveAmount(value.amount)
        ? value.lossTiers === undefined
          ? undefined
          : normalizeDailyLossTiers(value.lossTiers, value.amount)
        : null;
      const profitBasis = normalizePositionProfitBasis(value.profitBasis);
      const dynamicModelCount = [
        value.profitThresholdPercent,
        value.scaleAtBalance,
        value.lossTiers,
      ].filter((candidate) => candidate !== undefined).length;
      return isPositiveAmount(value.amount) &&
        increase &&
        scaling &&
        lossTiers !== null &&
        profitBasis !== null &&
        dynamicModelCount <= 1 &&
        (lossTiers !== undefined || profitBasis === undefined)
        ? {
            id: value.id,
            enabled: value.enabled,
            kind: value.kind,
            amount: value.amount,
            breachAction:
              value.breachAction === 'suspend_until_next_session'
                ? value.breachAction
                : 'fail',
            ...increase,
            ...scaling,
            ...(lossTiers ? { lossTiers } : {}),
            ...(profitBasis ? { profitBasis } : {}),
          }
        : null;
    }
    case 'daily_profit_cap':
      return isFiniteNumber(value.amount)
        ? {
            id: value.id,
            enabled: value.enabled,
            kind: value.kind,
            amount: value.amount,
          }
        : null;
    case 'live_review_daily_profit':
      return isFiniteNumber(value.amount) && value.amount > 0
        ? {
            id: value.id,
            enabled: value.enabled,
            kind: value.kind,
            amount: value.amount,
          }
        : null;
    case 'minimum_trading_days':
      return isFiniteNumber(value.days)
        ? {
            id: value.id,
            enabled: value.enabled,
            kind: value.kind,
            days: value.days,
          }
        : null;
    case 'minimum_profitable_days':
      return isFiniteNumber(value.days) &&
        isFiniteNumber(value.minimumDailyProfit)
        ? {
            id: value.id,
            enabled: value.enabled,
            kind: value.kind,
            days: value.days,
            minimumDailyProfit: value.minimumDailyProfit,
          }
        : null;
    case 'consistency':
      return isFiniteNumber(value.maxBestDayPercent) &&
        (value.consistencyCushionPercent === undefined ||
          (isFiniteNumber(value.consistencyCushionPercent) &&
            value.consistencyCushionPercent > 0 &&
            value.maxBestDayPercent + value.consistencyCushionPercent <= 100))
        ? {
            id: value.id,
            enabled: value.enabled,
            kind: value.kind,
            maxBestDayPercent: value.maxBestDayPercent,
            ...(value.consistencyCushionPercent === undefined
              ? {}
              : {
                  consistencyCushionPercent: value.consistencyCushionPercent,
                }),
          }
        : null;
    case 'max_position_size': {
      const profitBasis = normalizePositionProfitBasis(value.profitBasis);
      if (profitBasis === null) return null;
      const counting = normalizePositionSizeCounting(value);
      if (counting === null) return null;
      if (
        isFiniteNumber(value.maxContracts) &&
        value.maxContracts > 0 &&
        value.initialContracts === undefined &&
        value.profitPerAdditionalContract === undefined &&
        value.maximumContracts === undefined &&
        value.profitTiers === undefined &&
        value.profitBasis === undefined
      ) {
        return {
          id: value.id,
          enabled: value.enabled,
          kind: value.kind,
          maxContracts: value.maxContracts,
          ...counting,
        };
      }
      if (
        value.maxContracts === undefined &&
        isFiniteNumber(value.initialContracts) &&
        value.initialContracts > 0 &&
        value.profitPerAdditionalContract === undefined &&
        value.maximumContracts === undefined
      ) {
        const profitTiers = normalizePositionProfitTiers(
          value.profitTiers,
          value.initialContracts
        );
        if (profitTiers) {
          return {
            id: value.id,
            enabled: value.enabled,
            kind: value.kind,
            initialContracts: value.initialContracts,
            profitTiers,
            ...(profitBasis ? { profitBasis } : {}),
            ...counting,
          };
        }
      }
      return value.maxContracts === undefined &&
        isFiniteNumber(value.initialContracts) &&
        value.initialContracts > 0 &&
        isFiniteNumber(value.profitPerAdditionalContract) &&
        value.profitPerAdditionalContract > 0 &&
        value.profitTiers === undefined &&
        (value.maximumContracts === undefined ||
          (isFiniteNumber(value.maximumContracts) &&
            value.maximumContracts >= value.initialContracts))
        ? {
            id: value.id,
            enabled: value.enabled,
            kind: value.kind,
            initialContracts: value.initialContracts,
            profitPerAdditionalContract: value.profitPerAdditionalContract,
            ...(value.maximumContracts === undefined
              ? {}
              : { maximumContracts: value.maximumContracts }),
            ...(profitBasis ? { profitBasis } : {}),
            ...counting,
          }
        : null;
    }
    default:
      return null;
  }
}


function isPositiveAmount(value: unknown): value is number {
  return isFiniteNumber(value) && value > 0;
}

function normalizeProfileRule(value: unknown): PropFirmProfileRule | null {
  if (!isRecord(value)) return null;
  switch (value.kind) {
    case 'profit_target':
      return isFiniteNumber(value.amount) &&
        (value.targetType === 'absolute' || value.targetType === 'percentage')
        ? {
            kind: value.kind,
            amount: value.amount,
            targetType: value.targetType,
            ...(value.creditWithdrawals === true &&
            value.targetType === 'absolute'
              ? { creditWithdrawals: true }
              : {}),
          }
        : null;
    case 'drawdown': {
      if (
        !isFiniteNumber(value.amount) ||
        (value.mode !== 'static' &&
          value.mode !== 'eod_trailing' &&
          value.mode !== 'intraday_trailing')
      )
        return null;
      const rule: PropFirmProfileRule = {
        kind: value.kind,
        mode: value.mode,
        amount: value.amount,
      };
      if (value.mode !== 'static' && isFiniteNumber(value.lockAtBalance)) {
        rule.lockAtBalance = value.lockAtBalance;
      }
      return rule;
    }
    case 'daily_loss_limit': {
      const increase = normalizeDailyLossIncrease(value);
      const scaling = normalizeDailyLossScaling(value);
      const lossTiers = isFiniteNumber(value.amount)
        ? value.lossTiers === undefined
          ? undefined
          : normalizeDailyLossTiers(value.lossTiers, value.amount)
        : null;
      const profitBasis = normalizePositionProfitBasis(value.profitBasis);
      const dynamicModelCount = [
        value.profitThresholdPercent,
        value.scaleAtBalance,
        value.lossTiers,
      ].filter((candidate) => candidate !== undefined).length;
      return isFiniteNumber(value.amount) &&
        increase &&
        scaling &&
        lossTiers !== null &&
        profitBasis !== null &&
        dynamicModelCount <= 1 &&
        (lossTiers !== undefined || profitBasis === undefined)
        ? {
            kind: value.kind,
            amount: value.amount,
            breachAction:
              value.breachAction === 'suspend_until_next_session'
                ? value.breachAction
                : 'fail',
            ...increase,
            ...scaling,
            ...(lossTiers ? { lossTiers } : {}),
            ...(profitBasis ? { profitBasis } : {}),
          }
        : null;
    }
    case 'daily_profit_cap':
      return isFiniteNumber(value.amount)
        ? { kind: value.kind, amount: value.amount }
        : null;
    case 'live_review_daily_profit':
      return isFiniteNumber(value.amount) && value.amount > 0
        ? { kind: value.kind, amount: value.amount }
        : null;
    case 'minimum_trading_days':
      return isPositiveDayCount(value.days)
        ? { kind: value.kind, days: value.days }
        : null;
    case 'minimum_profitable_days':
      return isPositiveDayCount(value.days) &&
        isFiniteNumber(value.minimumDailyProfit)
        ? {
            kind: value.kind,
            days: value.days,
            minimumDailyProfit: value.minimumDailyProfit,
          }
        : null;
    case 'consistency':
      return isFiniteNumber(value.maxBestDayPercent) &&
        (value.consistencyCushionPercent === undefined ||
          (isFiniteNumber(value.consistencyCushionPercent) &&
            value.consistencyCushionPercent > 0 &&
            value.maxBestDayPercent + value.consistencyCushionPercent <= 100))
        ? {
            kind: value.kind,
            maxBestDayPercent: value.maxBestDayPercent,
            ...(value.consistencyCushionPercent === undefined
              ? {}
              : {
                  consistencyCushionPercent: value.consistencyCushionPercent,
                }),
          }
        : null;
    case 'max_position_size': {
      const profitBasis = normalizePositionProfitBasis(value.profitBasis);
      if (profitBasis === null) return null;
      const counting = normalizePositionSizeCounting(value);
      if (counting === null) return null;
      if (
        isFiniteNumber(value.maxContracts) &&
        value.maxContracts > 0 &&
        value.initialContracts === undefined &&
        value.profitPerAdditionalContract === undefined &&
        value.maximumContracts === undefined &&
        value.profitTiers === undefined &&
        value.profitBasis === undefined
      ) {
        return {
          kind: value.kind,
          maxContracts: value.maxContracts,
          ...counting,
        };
      }
      if (
        value.maxContracts === undefined &&
        isFiniteNumber(value.initialContracts) &&
        value.initialContracts > 0 &&
        value.profitPerAdditionalContract === undefined &&
        value.maximumContracts === undefined
      ) {
        const profitTiers = normalizePositionProfitTiers(
          value.profitTiers,
          value.initialContracts
        );
        if (profitTiers) {
          return {
            kind: value.kind,
            initialContracts: value.initialContracts,
            profitTiers,
            ...(profitBasis ? { profitBasis } : {}),
            ...counting,
          };
        }
      }
      return value.maxContracts === undefined &&
        isFiniteNumber(value.initialContracts) &&
        value.initialContracts > 0 &&
        isFiniteNumber(value.profitPerAdditionalContract) &&
        value.profitPerAdditionalContract > 0 &&
        value.profitTiers === undefined &&
        (value.maximumContracts === undefined ||
          (isFiniteNumber(value.maximumContracts) &&
            value.maximumContracts >= value.initialContracts))
        ? {
            kind: value.kind,
            initialContracts: value.initialContracts,
            profitPerAdditionalContract: value.profitPerAdditionalContract,
            ...(value.maximumContracts === undefined
              ? {}
              : { maximumContracts: value.maximumContracts }),
            ...(profitBasis ? { profitBasis } : {}),
            ...counting,
          }
        : null;
    }
    default:
      return null;
  }
}

function normalizePayoutCycle(value: unknown): PropChallengePayoutCycle | null {
  if (!isRecord(value)) return null;
  switch (value.kind) {
    case 'none':
      return { kind: value.kind };
    case 'trading_days':
      return isPositiveDayCount(value.days)
        ? { kind: value.kind, days: value.days }
        : null;
    case 'qualifying_days':
      return isPositiveDayCount(value.days) &&
        isFiniteNumber(value.minimumDailyProfit) &&
        value.minimumDailyProfit > 0
        ? {
            kind: value.kind,
            days: value.days,
            minimumDailyProfit: value.minimumDailyProfit,
          }
        : null;
    case 'calendar_days':
      return isPositiveDayCount(value.days) &&
        (value.anchor === 'phase_start' || value.anchor === 'first_trade')
        ? { kind: value.kind, days: value.days, anchor: value.anchor }
        : null;
    default:
      return null;
  }
}

function normalizePayoutAvailability(
  value: unknown
): PropChallengePayoutAvailability | null {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.requestPercent) ||
    value.requestPercent <= 0 ||
    value.requestPercent > 100
  )
    return null;
  switch (value.kind) {
    case 'profit_above_starting_balance':
      return { kind: value.kind, requestPercent: value.requestPercent };
    case 'profit_above_balance_floor':
      return isFiniteNumber(value.balanceFloor) && value.balanceFloor >= 0
        ? {
            kind: value.kind,
            balanceFloor: value.balanceFloor,
            requestPercent: value.requestPercent,
          }
        : null;
    default:
      return null;
  }
}

function normalizePayoutMaximum(
  value: unknown
): PropChallengePayoutMaximum | null {
  if (!isRecord(value)) return null;
  switch (value.kind) {
    case 'none':
      return { kind: value.kind };
    case 'fixed':
      return isFiniteNumber(value.amount) && value.amount > 0
        ? { kind: value.kind, amount: value.amount }
        : null;
    case 'first_fixed_then_none':
      return isFiniteNumber(value.amount) && value.amount > 0
        ? { kind: value.kind, amount: value.amount }
        : null;
    case 'cycle_profit_percent':
      return isFiniteNumber(value.percent) &&
        value.percent > 0 &&
        value.percent <= 100
        ? { kind: value.kind, percent: value.percent }
        : null;
    case 'schedule': {
      if (!Array.isArray(value.amounts) || value.amounts.length === 0)
        return null;
      const amounts = value.amounts.filter(isFiniteNumber);
      return amounts.length === value.amounts.length &&
        amounts.every((amount) => amount > 0) &&
        (value.repeatLast === undefined ||
          typeof value.repeatLast === 'boolean')
        ? {
            kind: value.kind,
            amounts,
            ...(value.repeatLast ? { repeatLast: true } : {}),
          }
        : null;
    }
    default:
      return null;
  }
}

function normalizePayoutLifetimeQualifyingDaysUnlock(
  value: unknown
): PropChallengePayoutLifetimeQualifyingDaysUnlock | null {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.days) ||
    !Number.isInteger(value.days) ||
    value.days < 1
  )
    return null;
  const availability = normalizePayoutAvailability(value.availability);
  const maximumRequest = normalizePayoutMaximum(value.maximumRequest);
  return availability && maximumRequest
    ? { days: value.days, availability, maximumRequest }
    : null;
}

function normalizePayoutNumberSchedule(
  value: unknown,
  field: 'amounts',
  maximum?: number
): { amounts: number[]; repeatLast?: boolean } | null;
function normalizePayoutNumberSchedule(
  value: unknown,
  field: 'percents',
  maximum?: number
): { percents: number[]; repeatLast?: boolean } | null;
function normalizePayoutNumberSchedule(
  value: unknown,
  field: 'amounts' | 'percents',
  maximum?: number
):
  | { amounts: number[]; repeatLast?: boolean }
  | { percents: number[]; repeatLast?: boolean }
  | null {
  if (
    !isRecord(value) ||
    !Array.isArray(value[field]) ||
    value[field].length === 0
  )
    return null;
  const entries = value[field].filter(isFiniteNumber);
  if (
    entries.length !== value[field].length ||
    entries.some(
      (entry) =>
        entry < 0 ||
        (field === 'percents' && entry === 0) ||
        (maximum !== undefined && entry > maximum)
    ) ||
    (value.repeatLast !== undefined && typeof value.repeatLast !== 'boolean')
  )
    return null;
  return field === 'amounts'
    ? {
        amounts: entries,
        ...(value.repeatLast ? { repeatLast: true } : {}),
      }
    : {
        percents: entries,
        ...(value.repeatLast ? { repeatLast: true } : {}),
      };
}

function isMaximumPayoutOutcome(
  value: unknown
): value is PropChallengeMaximumPayoutOutcome {
  return (
    value === 'conclude_account' ||
    value === 'promote_to_next_phase' ||
    value === 'eligible_for_live_review'
  );
}

function normalizeProfitSplit(value: unknown): PropChallengeProfitSplit | null {
  if (!isRecord(value)) return null;
  switch (value.kind) {
    case 'fixed':
      return isFiniteNumber(value.percent) &&
        value.percent > 0 &&
        value.percent <= 100
        ? { kind: value.kind, percent: value.percent }
        : null;
    case 'cumulative_payout_threshold':
      return isFiniteNumber(value.initialPercent) &&
        value.initialPercent > 0 &&
        value.initialPercent <= 100 &&
        isFiniteNumber(value.thresholdAmount) &&
        value.thresholdAmount > 0 &&
        isFiniteNumber(value.thereafterPercent) &&
        value.thereafterPercent > 0 &&
        value.thereafterPercent <= 100
        ? {
            kind: value.kind,
            initialPercent: value.initialPercent,
            thresholdAmount: value.thresholdAmount,
            thereafterPercent: value.thereafterPercent,
          }
        : null;
    case 'account_profit_threshold':
      return isFiniteNumber(value.belowPercent) &&
        value.belowPercent > 0 &&
        value.belowPercent <= 100 &&
        isFiniteNumber(value.thresholdProfit) &&
        value.thresholdProfit > 0 &&
        isFiniteNumber(value.atOrAbovePercent) &&
        value.atOrAbovePercent > 0 &&
        value.atOrAbovePercent <= 100
        ? {
            kind: value.kind,
            belowPercent: value.belowPercent,
            thresholdProfit: value.thresholdProfit,
            atOrAbovePercent: value.atOrAbovePercent,
          }
        : null;
    default:
      return null;
  }
}


export function isSupportedTimeZone(value: string): boolean {
  if (value.length === 0) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

function normalizePayoutRequestWindow(
  value: unknown
): PropChallengePayoutRequestWindow | null {
  if (!isRecord(value) || value.kind !== 'weekdays') return null;
  const validWeekdays = new Set([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]);
  if (
    !Array.isArray(value.weekdays) ||
    value.weekdays.length === 0 ||
    !value.weekdays.every(
      (
        weekday
      ): weekday is PropChallengePayoutRequestWindow['weekdays'][number] =>
        typeof weekday === 'string' && validWeekdays.has(weekday)
    ) ||
    new Set(value.weekdays).size !== value.weekdays.length ||
    typeof value.timeZone !== 'string' ||
    value.timeZone.length === 0
  )
    return null;
  if (!isSupportedTimeZone(value.timeZone)) return null;
  return {
    kind: value.kind,
    weekdays: value.weekdays,
    timeZone: value.timeZone,
  };
}

function normalizePayoutAftermath(
  value: unknown
): PropChallengePayoutAftermath | null {
  if (!isRecord(value) || typeof value.resetCycle !== 'boolean') return null;
  const maximumPayoutOutcome = isMaximumPayoutOutcome(
    value.maximumPayoutOutcome
  )
    ? value.maximumPayoutOutcome
    : value.concludeAfterMaximumPayouts === true
      ? 'conclude_account'
      : undefined;
  if (
    value.maximumPayoutOutcome !== undefined &&
    !isMaximumPayoutOutcome(value.maximumPayoutOutcome)
  )
    return null;
  if (
    value.balanceAction === 'deduct_request' &&
    value.drawdownAction === 'unchanged'
  ) {
    return {
      balanceAction: value.balanceAction,
      drawdownAction: value.drawdownAction,
      resetCycle: value.resetCycle,
      ...(maximumPayoutOutcome ? { maximumPayoutOutcome } : {}),
    };
  }
  if (
    value.balanceAction === 'deduct_request' &&
    value.drawdownAction === 'lock_at_balance' &&
    isFiniteNumber(value.drawdownFloor) &&
    value.drawdownFloor >= 0
  ) {
    return {
      balanceAction: value.balanceAction,
      drawdownAction: value.drawdownAction,
      drawdownFloor: value.drawdownFloor,
      resetCycle: value.resetCycle,
      ...(maximumPayoutOutcome ? { maximumPayoutOutcome } : {}),
    };
  }
  if (
    value.balanceAction === 'reset_to_starting_balance' &&
    value.drawdownAction === 'reset_from_starting_balance'
  ) {
    return {
      balanceAction: value.balanceAction,
      drawdownAction: value.drawdownAction,
      resetCycle: value.resetCycle,
      ...(maximumPayoutOutcome ? { maximumPayoutOutcome } : {}),
    };
  }
  return null;
}

export function normalizePropChallengePayoutPolicy(
  value: unknown
): PropChallengePayoutPolicy | null {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.version) ||
    value.version < 1 ||
    typeof value.source !== 'string' ||
    !isFiniteNumber(value.minimumRequest) ||
    value.minimumRequest < 0
  )
    return null;
  const cycle = normalizePayoutCycle(value.cycle);
  let qualifyingDays: PropChallengePayoutPolicy['qualifyingDays'];
  if (value.qualifyingDays !== undefined) {
    if (
      !isRecord(value.qualifyingDays) ||
      !isPositiveDayCount(value.qualifyingDays.days) ||
      !isFiniteNumber(value.qualifyingDays.minimumDailyProfit) ||
      value.qualifyingDays.minimumDailyProfit <= 0 ||
      cycle?.kind === 'qualifying_days'
    )
      return null;
    qualifyingDays = {
      days: value.qualifyingDays.days,
      minimumDailyProfit: value.qualifyingDays.minimumDailyProfit,
    };
  }
  const availability = normalizePayoutAvailability(value.availability);
  const maximumRequest = normalizePayoutMaximum(value.maximumRequest);
  const lifetimeQualifyingDaysUnlock =
    value.lifetimeQualifyingDaysUnlock === undefined
      ? undefined
      : normalizePayoutLifetimeQualifyingDaysUnlock(
          value.lifetimeQualifyingDaysUnlock
        );
  const afterPayout = normalizePayoutAftermath(value.afterPayout);
  const profitSplit =
    normalizeProfitSplit(value.profitSplit) ??
    (isFiniteNumber(value.profitSplitPercent) &&
    value.profitSplitPercent > 0 &&
    value.profitSplitPercent <= 100
      ? ({
          kind: 'fixed',
          percent: value.profitSplitPercent,
        } satisfies PropChallengeProfitSplit)
      : null);
  const requestWindow =
    value.requestWindow === undefined
      ? undefined
      : normalizePayoutRequestWindow(value.requestWindow);
  const minimumCycleProfitSchedule =
    value.minimumCycleProfitSchedule === undefined
      ? undefined
      : normalizePayoutNumberSchedule(
          value.minimumCycleProfitSchedule,
          'amounts'
        );
  const maxBestDayPercentSchedule =
    value.maxBestDayPercentSchedule === undefined
      ? undefined
      : normalizePayoutNumberSchedule(
          value.maxBestDayPercentSchedule,
          'percents',
          100
        );
  if (
    !cycle ||
    !availability ||
    !maximumRequest ||
    lifetimeQualifyingDaysUnlock === null ||
    !afterPayout ||
    !profitSplit ||
    requestWindow === null ||
    minimumCycleProfitSchedule === null ||
    maxBestDayPercentSchedule === null
  )
    return null;
  if (
    lifetimeQualifyingDaysUnlock !== undefined &&
    cycle.kind !== 'qualifying_days'
  )
    return null;
  if (
    value.minimumBalance !== undefined &&
    (!isFiniteNumber(value.minimumBalance) || value.minimumBalance < 0)
  )
    return null;
  if (
    value.minimumCycleProfit !== undefined &&
    (!isFiniteNumber(value.minimumCycleProfit) || value.minimumCycleProfit < 0)
  )
    return null;
  if (
    value.minimumCycleProfit !== undefined &&
    minimumCycleProfitSchedule !== undefined
  )
    return null;
  if (
    value.requirePositiveCycleProfitAfterFirst !== undefined &&
    typeof value.requirePositiveCycleProfitAfterFirst !== 'boolean'
  )
    return null;
  if (
    value.newProfitPercentOfRequest !== undefined &&
    (!isFiniteNumber(value.newProfitPercentOfRequest) ||
      value.newProfitPercentOfRequest <= 0 ||
      value.newProfitPercentOfRequest > 100)
  )
    return null;
  if (
    value.minimumElapsedHours !== undefined &&
    (!isFiniteNumber(value.minimumElapsedHours) ||
      value.minimumElapsedHours < 1)
  )
    return null;
  if (
    value.maxBestDayPercent !== undefined &&
    (!isFiniteNumber(value.maxBestDayPercent) ||
      value.maxBestDayPercent <= 0 ||
      value.maxBestDayPercent > 100)
  )
    return null;
  if (
    value.maxBestDayPercent !== undefined &&
    maxBestDayPercentSchedule !== undefined
  )
    return null;
  if (
    value.maximumPayouts !== undefined &&
    (!isFiniteNumber(value.maximumPayouts) || value.maximumPayouts < 1)
  )
    return null;
  if (
    afterPayout.maximumPayoutOutcome !== undefined &&
    value.maximumPayouts === undefined
  )
    return null;
  return {
    version: value.version,
    source: value.source,
    cycle,
    ...(qualifyingDays ? { qualifyingDays } : {}),
    availability,
    minimumRequest: value.minimumRequest,
    maximumRequest,
    ...(lifetimeQualifyingDaysUnlock ? { lifetimeQualifyingDaysUnlock } : {}),
    profitSplit,
    ...(requestWindow ? { requestWindow } : {}),
    afterPayout,
    ...(isFiniteNumber(value.minimumCycleProfit)
      ? { minimumCycleProfit: value.minimumCycleProfit }
      : {}),
    ...(minimumCycleProfitSchedule ? { minimumCycleProfitSchedule } : {}),
    ...(isFiniteNumber(value.minimumBalance)
      ? { minimumBalance: value.minimumBalance }
      : {}),
    ...(value.requirePositiveCycleProfitAfterFirst === true
      ? { requirePositiveCycleProfitAfterFirst: true }
      : {}),
    ...(isFiniteNumber(value.newProfitPercentOfRequest)
      ? { newProfitPercentOfRequest: value.newProfitPercentOfRequest }
      : {}),
    ...(isFiniteNumber(value.minimumElapsedHours)
      ? { minimumElapsedHours: value.minimumElapsedHours }
      : {}),
    ...(typeof value.firstPayoutCycleProfitExempt === 'boolean'
      ? { firstPayoutCycleProfitExempt: value.firstPayoutCycleProfitExempt }
      : {}),
    ...(isFiniteNumber(value.maxBestDayPercent)
      ? { maxBestDayPercent: value.maxBestDayPercent }
      : {}),
    ...(maxBestDayPercentSchedule ? { maxBestDayPercentSchedule } : {}),
    ...(isFiniteNumber(value.maximumPayouts)
      ? { maximumPayouts: value.maximumPayouts }
      : {}),
  };
}

function normalizeCatalogCorrection(
  value: unknown,
  stage: PropFirmProfilePhase['stage'],
  startingBalance: number
): PropFirmCatalogCorrection | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    !value.id.trim() ||
    typeof value.reason !== 'string' ||
    !value.reason.trim() ||
    typeof value.sourceUrl !== 'string' ||
    !isPurchaseDate(value.verifiedAt) ||
    !Array.isArray(value.fromPolicyHashes) ||
    !value.fromPolicyHashes.length ||
    !value.fromPolicyHashes.every(
      (h) => typeof h === 'string' && /^[a-f0-9]{64}$/.test(h)
    ) ||
    !isRecord(value.replacement) ||
    !Array.isArray(value.replacement.rules)
  )
    return null;
  try {
    if (new URL(value.sourceUrl).protocol !== 'https:') return null;
  } catch {
    return null;
  }
  for (const bound of [value.affectedFrom, value.affectedUntil])
    if (
      bound !== undefined &&
      (typeof bound !== 'string' ||
        !/(?:Z|[+-]\d\d:\d\d)$/.test(bound) ||
        !isIsoDateString(bound))
    )
      return null;
  if (
    typeof value.affectedFrom === 'string' &&
    typeof value.affectedUntil === 'string' &&
    Date.parse(value.affectedFrom) >= Date.parse(value.affectedUntil)
  )
    return null;
  const policy = normalizeProfilePhase({
    name: 'Correction',
    stage,
    startingBalance,
    rules: value.replacement.rules,
    payoutPolicy: value.replacement.payoutPolicy,
  });
  if (!policy || policy.rules.length !== value.replacement.rules.length)
    return null;
  return {
    id: value.id,
    reason: value.reason,
    sourceUrl: value.sourceUrl,
    verifiedAt: value.verifiedAt,
    fromPolicyHashes: value.fromPolicyHashes.filter(
      (hash: unknown): hash is string => typeof hash === 'string'
    ),
    ...(typeof value.affectedFrom === 'string'
      ? { affectedFrom: value.affectedFrom }
      : {}),
    ...(typeof value.affectedUntil === 'string'
      ? { affectedUntil: value.affectedUntil }
      : {}),
    replacement: {
      rules: policy.rules,
      ...(policy.payoutPolicy ? { payoutPolicy: policy.payoutPolicy } : {}),
    },
  };
}

function normalizeProfilePhase(value: unknown): PropFirmProfilePhase | null {
  if (
    !isRecord(value) ||
    typeof value.name !== 'string' ||
    !isFiniteNumber(value.startingBalance) ||
    !Array.isArray(value.rules)
  )
    return null;
  const applicability = parseApplicability(value);
  if (!applicability) return null;
  
  
  
  
  
  
  if (
    value.stage !== 'evaluation' &&
    value.stage !== 'sim_funded' &&
    value.stage !== 'live_funded'
  )
    return null;
  const stage = value.stage;
  const payoutPolicy = normalizePropChallengePayoutPolicy(value.payoutPolicy);
  if (
    value.payoutPolicy !== undefined &&
    (!payoutPolicy || stage === 'evaluation')
  )
    return null;
  const corrections: PropFirmCatalogCorrection[] = [];
  if (value.catalogCorrections !== undefined) {
    if (!Array.isArray(value.catalogCorrections)) return null;
    for (const raw of value.catalogCorrections) {
      const c = normalizeCatalogCorrection(raw, stage, value.startingBalance);
      if (!c || corrections.some((other) => other.id === c.id)) return null;
      corrections.push(c);
    }
  }
  
  
  
  
  
  const rules = value.rules.flatMap((rule) => {
    const normalized = normalizeProfileRule(rule);
    return normalized ? [normalized] : [];
  });
  if (rules.length !== value.rules.length) return null;
  return {
    name: value.name,
    stage,
    ...(corrections.length ? { catalogCorrections: corrections } : {}),
    ...applicability,
    startingBalance: value.startingBalance,
    rules,
    ...(payoutPolicy ? { payoutPolicy } : {}),
  };
}

function normalizeProfileChallenge(
  value: unknown
): PropFirmProfileChallenge | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    !isFiniteNumber(value.accountSize) ||
    typeof value.currency !== 'string' ||
    !Array.isArray(value.phases)
  )
    return null;
  const phases = value.phases.flatMap((phase) => {
    const normalized = normalizeProfilePhase(phase);
    return normalized ? [normalized] : [];
  });
  if (phases.length === 0 || phases.length !== value.phases.length) return null;
  return {
    id: value.id,
    name: value.name,
    accountSize: value.accountSize,
    currency: value.currency,
    notes: typeof value.notes === 'string' ? value.notes : undefined,
    phases,
  };
}

function normalizeProfileFirm(value: unknown): PropFirmProfileFirm | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    !isIsoDateString(value.verifiedAt) ||
    !Array.isArray(value.sources) ||
    !value.sources.every((source) => typeof source === 'string') ||
    !Array.isArray(value.challenges)
  )
    return null;
  const challenges = value.challenges.flatMap((challenge) => {
    const normalized = normalizeProfileChallenge(challenge);
    return normalized ? [normalized] : [];
  });
  if (challenges.length === 0) return null;
  return {
    id: value.id,
    name: value.name,
    verifiedAt: value.verifiedAt,
    sources: [...value.sources],
    challenges,
  };
}


export function normalizePropFirmIndex(
  value: unknown
): PropFirmIndex | undefined {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.version) ||
    !Array.isArray(value.firms)
  ) {
    return undefined;
  }
  const firms: PropFirmSummary[] = [];
  for (const entry of value.firms) {
    if (
      !isRecord(entry) ||
      typeof entry.id !== 'string' ||
      !entry.id.trim() ||
      typeof entry.name !== 'string' ||
      !entry.name.trim() ||
      !isFiniteNumber(entry.challenges) ||
      entry.challenges < 1
    ) {
      return undefined;
    }
    firms.push({
      id: entry.id,
      name: entry.name,
      challenges: Math.floor(entry.challenges),
    });
  }
  return firms.length > 0 ? { version: value.version, firms } : undefined;
}

export function normalizePropFirmIndexCache(
  value: unknown
): PropFirmIndexCache | undefined {
  if (!isRecord(value) || !isIsoDateString(value.fetchedAt)) return undefined;
  const index = normalizePropFirmIndex(value.index);
  if (!index) return undefined;
  return {
    index,
    ...(typeof value.etag === 'string' && value.etag
      ? { etag: value.etag }
      : {}),
    fetchedAt: value.fetchedAt,
  };
}

export function normalizePropFirmProfileCatalog(
  value: unknown
): PropFirmProfileCatalog | undefined {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.version) ||
    !isIsoDateString(value.updatedAt) ||
    !Array.isArray(value.firms)
  )
    return undefined;
  return {
    version: value.version,
    updatedAt: value.updatedAt,
    firms: value.firms.flatMap((firm) => {
      const normalized = normalizeProfileFirm(firm);
      return normalized ? [normalized] : [];
    }),
  };
}

export function normalizePropFirmProfileCatalogCache(
  value: unknown
): PropFirmProfileCatalogCache | undefined {
  if (!isRecord(value) || !isIsoDateString(value.fetchedAt)) return undefined;
  const catalog = normalizePropFirmProfileCatalog(value.catalog);
  if (!catalog) return undefined;
  return {
    catalog,
    etag: typeof value.etag === 'string' ? value.etag : undefined,
    fetchedAt: value.fetchedAt,
  };
}

function normalizeProfileApplication(
  value: unknown
): PropChallengePolicyRevision['application'] | null {
  if (value === undefined) return undefined;
  if (
    !isRecord(value) ||
    (value.basis !== 'published' && value.basis !== 'confirmed') ||
    typeof value.reference !== 'string' ||
    !value.reference.trim() ||
    (value.basis !== 'confirmed' &&
      (typeof value.announcementId !== 'string' ||
        !value.announcementId.trim()))
  )
    return null;
  return {
    basis: value.basis,
    reference: value.reference,
    ...(typeof value.announcementId === 'string'
      ? { announcementId: value.announcementId }
      : {}),
  };
}

function normalizePolicyHistory(
  value: unknown
): PropChallengePolicyRevision[] | null {
  if (!Array.isArray(value) || value.length < 2) return null;
  const result: PropChallengePolicyRevision[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      !isIsoDateString(item.effectiveAt) ||
      !Array.isArray(item.rules)
    )
      return null;
    if (
      result.length &&
      Date.parse(item.effectiveAt) <=
        Date.parse(result[result.length - 1].effectiveAt)
    )
      return null;
    const rules = item.rules.map(normalizeRule);
    if (!rules.every((rule): rule is PropChallengeRule => rule !== null))
      return null;
    const payoutPolicy =
      item.payoutPolicy === undefined
        ? undefined
        : normalizePropChallengePayoutPolicy(item.payoutPolicy);
    if (payoutPolicy === null) return null;
    const revision: PropChallengePolicyRevision = {
      effectiveAt: item.effectiveAt,
      rules,
      ...(payoutPolicy ? { payoutPolicy } : {}),
    };
    const application = normalizeProfileApplication(item.application);
    if (application === null) return null;
    if (application) revision.application = application;
    if (result.length) {
      const transition = item.transition;
      if (isRecord(transition) && transition.basis === 'preserve') {
        if (!canPreserveProfileState(result[result.length - 1], revision))
          return null;
        revision.transition = { basis: 'preserve' };
        result.push(revision);
        continue;
      }
      if (
        !isRecord(transition) ||
        transition.basis !== 'custom' ||
        typeof transition.source !== 'string' ||
        !transition.source.trim() ||
        !isIsoDateString(transition.payoutCycleStartedAt) ||
        Date.parse(transition.payoutCycleStartedAt) >
          Date.parse(item.effectiveAt) ||
        Date.parse(transition.payoutCycleStartedAt) <
          Date.parse(result[0].effectiveAt) ||
        !Array.isArray(transition.drawdowns)
      )
        return null;
      const drawdowns: Extract<
        NonNullable<PropChallengePolicyRevision['transition']>,
        { basis: 'custom' }
      >['drawdowns'] = [];
      for (const state of transition.drawdowns) {
        if (
          !isRecord(state) ||
          typeof state.ruleId !== 'string' ||
          !isFiniteNumber(state.floor) ||
          !isFiniteNumber(state.peakBalance) ||
          state.floor > state.peakBalance ||
          typeof state.locked !== 'boolean'
        )
          return null;
        drawdowns.push({
          ruleId: state.ruleId,
          floor: state.floor,
          peakBalance: state.peakBalance,
          locked: state.locked,
        });
      }
      const expected = rules.filter((rule) => rule.kind === 'drawdown');
      const required = expected.filter(
        (rule) =>
          !result[result.length - 1].rules.some((previous) =>
            sameProfileContent(previous, rule)
          )
      );
      if (
        new Set(drawdowns.map((state) => state.ruleId)).size !==
          drawdowns.length ||
        drawdowns.some(
          (state) => !expected.some((rule) => rule.id === state.ruleId)
        ) ||
        required.some(
          (rule) => !drawdowns.some((state) => state.ruleId === rule.id)
        )
      )
        return null;
      revision.transition = {
        basis: 'custom',
        source: transition.source,
        payoutCycleStartedAt: transition.payoutCycleStartedAt,
        drawdowns,
      };
    } else if (item.transition !== undefined) return null;
    result.push(revision);
  }
  return result;
}

function normalizePhase(value: unknown): PropChallengePhase | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    !isFiniteNumber(value.startingBalance) ||
    !Array.isArray(value.rules)
  )
    return null;
  if (
    value.status !== 'pending' &&
    value.status !== 'active' &&
    value.status !== 'passed' &&
    value.status !== 'failed'
  )
    return null;
  const phase: PropChallengePhase = {
    id: value.id,
    name: value.name,
    stage:
      value.stage === 'evaluation' ||
      value.stage === 'sim_funded' ||
      value.stage === 'live_funded'
        ? value.stage
        : 'evaluation',
    status: value.status,
    startingBalance: value.startingBalance,
    rules: value.rules.flatMap((rule) => {
      const normalized = normalizeRule(rule);
      return normalized ? [normalized] : [];
    }),
  };
  const application = normalizeProfileApplication(value.profileApplication);
  if (value.balanceAdjustments !== undefined) {
    if (!Array.isArray(value.balanceAdjustments)) return null;
    const adjustments: NonNullable<PropChallengePhase['balanceAdjustments']> =
      [];
    for (const adjustment of value.balanceAdjustments) {
      if (
        !isRecord(adjustment) ||
        !isFiniteNumber(adjustment.amount) ||
        !isIsoDateString(adjustment.recordedAt)
      )
        return null;
      adjustments.push({
        amount: adjustment.amount,
        recordedAt: adjustment.recordedAt,
      });
    }
    if (adjustments.length)
      phase.balanceAdjustments = adjustments.sort(
        (left, right) =>
          Date.parse(left.recordedAt) - Date.parse(right.recordedAt)
      );
  }
  if (application === null) return null;
  if (application) phase.profileApplication = application;
  if (value.policyHistory !== undefined) {
    const history = normalizePolicyHistory(value.policyHistory);
    if (
      !history ||
      !isIsoDateString(value.startedAt) ||
      history[0].effectiveAt !== value.startedAt
    )
      return null;
    phase.policyHistory = history;
  }
  if (value.profileSnapshot !== undefined) {
    const snapshot = normalizeProfilePhase(value.profileSnapshot);
    if (
      !snapshot ||
      !isFiniteNumber(value.profilePhaseIndex) ||
      !Number.isInteger(value.profilePhaseIndex) ||
      value.profilePhaseIndex < 0
    )
      return null;
    phase.profileSnapshot = snapshot;
    phase.profilePhaseIndex = value.profilePhaseIndex;
  }
  const brokerAccountIds = normalizeBrokerAccountIds(value.brokerAccountIds);
  if (brokerAccountIds) phase.brokerAccountIds = brokerAccountIds;
  if (typeof value.legacyAccountName === 'string') {
    const legacyAccountName = value.legacyAccountName.trim();
    if (legacyAccountName) phase.legacyAccountName = legacyAccountName;
  }
  if (isIsoDateString(value.startedAt)) phase.startedAt = value.startedAt;
  if (isIsoDateString(value.completedAt)) phase.completedAt = value.completedAt;
  if (value.payoutPolicy !== undefined) {
    const payoutPolicy = normalizePropChallengePayoutPolicy(value.payoutPolicy);
    if (!payoutPolicy || phase.stage === 'evaluation') return null;
    phase.payoutPolicy = payoutPolicy;
  }
  if (
    isRecord(value.failure) &&
    typeof value.failure.ruleId === 'string' &&
    (value.failure.ruleKind === 'drawdown' ||
      value.failure.ruleKind === 'daily_loss_limit' ||
      value.failure.ruleKind === 'max_position_size') &&
    isIsoDateString(value.failure.breachedAt)
  ) {
    phase.failure = {
      ruleId: value.failure.ruleId,
      ruleKind: value.failure.ruleKind,
      breachedAt: value.failure.breachedAt,
    };
  }
  if (Array.isArray(value.waivedFailures)) {
    const waivedFailures = value.waivedFailures.flatMap((waiver) =>
      isRecord(waiver) &&
      typeof waiver.ruleId === 'string' &&
      isIsoDateString(waiver.breachedAt)
        ? [{ ruleId: waiver.ruleId, breachedAt: waiver.breachedAt }]
        : []
    );
    if (waivedFailures.length > 0) phase.waivedFailures = waivedFailures;
  }
  return phase;
}

function normalizeCost(value: unknown): PropChallengeCost | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    !isIsoDateString(value.date) ||
    !isFiniteNumber(value.amount)
  )
    return null;
  if (
    value.kind !== 'purchase' &&
    value.kind !== 'reset' &&
    value.kind !== 'activation' &&
    value.kind !== 'other'
  )
    return null;
  return {
    id: value.id,
    date: value.date,
    amount: value.amount,
    kind: value.kind,
    note: typeof value.note === 'string' ? value.note : undefined,
  };
}

export function normalizePropChallengeConfig(
  value: unknown
): PropChallengeConfig | undefined {
  if (
    !isRecord(value) ||
    typeof value.challengeName !== 'string' ||
    !Array.isArray(value.phases)
  )
    return undefined;
  if (
    value.status !== 'active' &&
    value.status !== 'passed' &&
    value.status !== 'failed' &&
    value.status !== 'archived'
  )
    return undefined;
  const phases = value.phases.flatMap((phase) => {
    const normalized = normalizePhase(phase);
    return normalized ? [normalized] : [];
  });
  if (phases.length === 0) return undefined;
  const currentPhaseId =
    typeof value.currentPhaseId === 'string' &&
    phases.some((phase) => phase.id === value.currentPhaseId)
      ? value.currentPhaseId
      : undefined;
  
  
  const migratedStatus =
    value.status === 'archived'
      ? value.evaluationOutcome === 'failed' ||
        phases.some((phase) => phase.status === 'failed')
        ? 'failed'
        : value.evaluationOutcome === 'passed' ||
            phases.some((phase) => phase.status === 'passed')
          ? 'passed'
          : 'active'
      : value.status;
  const currentPhase =
    phases.find((phase) => phase.id === currentPhaseId) ??
    phases.find((phase) => phase.status === 'active') ??
    phases[0];
  const hasActiveFundedStage =
    currentPhase.status === 'active' &&
    (currentPhase.stage === 'sim_funded' ||
      currentPhase.stage === 'live_funded');
  const normalizedStatus =
    migratedStatus === 'passed' && hasActiveFundedStage
      ? 'active'
      : migratedStatus;
  const config: PropChallengeConfig = {
    challengeName: value.challengeName,
    status: normalizedStatus,
    currentPhaseId,
    phases,
  };
  if (isPurchaseDate(value.purchaseDate))
    config.purchaseDate = value.purchaseDate;
  if (value.correctionHistory !== undefined) {
    if (!Array.isArray(value.correctionHistory)) return undefined;
    config.correctionHistory = [];
    for (const audit of value.correctionHistory) {
      if (
        !isRecord(audit) ||
        typeof audit.id !== 'string' ||
        typeof audit.currencyCode !== 'string' ||
        !isIsoDateString(audit.appliedAt) ||
        !isRecord(audit.source) ||
        typeof audit.source.firmId !== 'string' ||
        typeof audit.source.challengeId !== 'string' ||
        !isFiniteNumber(audit.source.catalogVersion) ||
        !isIsoDateString(audit.source.verifiedAt) ||
        !['active', 'passed', 'failed'].includes(String(audit.beforeStatus)) ||
        !['active', 'passed', 'failed'].includes(String(audit.afterStatus)) ||
        typeof audit.evaluationStatus !== 'string'
      )
        return undefined;
      const before = normalizePhase(audit.before),
        after = normalizePhase(audit.after);
      if (!before || !after || before.id !== after.id) return undefined;
      const correction = normalizeCatalogCorrection(
        audit.correction,
        before.stage ?? 'evaluation',
        before.startingBalance
      );
      if (
        !correction ||
        (audit.beforeStatus !== 'active' &&
          audit.beforeStatus !== 'passed' &&
          audit.beforeStatus !== 'failed') ||
        (audit.afterStatus !== 'active' &&
          audit.afterStatus !== 'passed' &&
          audit.afterStatus !== 'failed')
      )
        return undefined;
      config.correctionHistory.push({
        id: audit.id,
        currencyCode: audit.currencyCode,
        appliedAt: audit.appliedAt,
        correction,
        before,
        after,
        beforeStatus: audit.beforeStatus,
        afterStatus: audit.afterStatus,
        evaluationStatus: audit.evaluationStatus,
        source: {
          firmId: audit.source.firmId,
          challengeId: audit.source.challengeId,
          catalogVersion: audit.source.catalogVersion,
          verifiedAt: audit.source.verifiedAt,
          source: 'catalog',
        },
      });
    }
  }
  if (typeof value.firmName === 'string') config.firmName = value.firmName;
  if (isRecord(value.profileUpdateDismissals)) {
    const dismissals: Record<string, string> = {};
    for (const phase of phases) {
      const fingerprint = value.profileUpdateDismissals[phase.id];
      if (
        typeof fingerprint === 'string' &&
        /^[a-f0-9]{64}$/.test(fingerprint)
      ) {
        dismissals[phase.id] = fingerprint;
      }
    }
    if (Object.keys(dismissals).length)
      config.profileUpdateDismissals = dismissals;
  }
  if (
    value.evaluationOutcome === 'passed' ||
    value.evaluationOutcome === 'failed'
  )
    config.evaluationOutcome = value.evaluationOutcome;
  else if (migratedStatus === 'passed' && hasActiveFundedStage)
    config.evaluationOutcome = 'passed';
  if (
    isRecord(value.profileRef) &&
    typeof value.profileRef.firmId === 'string' &&
    typeof value.profileRef.challengeId === 'string' &&
    isFiniteNumber(value.profileRef.catalogVersion) &&
    isIsoDateString(value.profileRef.verifiedAt)
  ) {
    config.profileRef = {
      firmId: value.profileRef.firmId,
      challengeId: value.profileRef.challengeId,
      catalogVersion: value.profileRef.catalogVersion,
      verifiedAt: value.profileRef.verifiedAt,
      ...(value.profileRef.source === 'personal' ||
      value.profileRef.source === 'catalog'
        ? { source: value.profileRef.source }
        : {}),
    };
  }
  if (Array.isArray(value.oneTimeCosts))
    config.oneTimeCosts = value.oneTimeCosts.flatMap((cost) => {
      const normalized = normalizeCost(cost);
      return normalized ? [normalized] : [];
    });
  const payoutPlan = normalizePayoutPlan(value.payoutPlan);
  if (payoutPlan) config.payoutPlan = payoutPlan;
  const notices = normalizeNoticeState(
    value.notices,
    new Set(phases.map((phase) => phase.id))
  );
  if (notices) config.notices = notices;
  return config;
}

function normalizePayoutPlan(
  value: unknown
): PropChallengePayoutPlan | undefined {
  if (!isRecord(value)) return undefined;
  const plan: PropChallengePayoutPlan = {};
  if (
    isFiniteNumber(value.notifyMinimumAmount) &&
    value.notifyMinimumAmount > 0
  )
    plan.notifyMinimumAmount = value.notifyMinimumAmount;
  const withdrawal = value.withdrawal;
  if (isRecord(withdrawal) && isFiniteNumber(withdrawal.value)) {
    if (
      withdrawal.kind === 'percent' &&
      withdrawal.value > 0 &&
      withdrawal.value <= 100
    )
      plan.withdrawal = { kind: 'percent', value: withdrawal.value };
    else if (withdrawal.kind === 'amount' && withdrawal.value > 0)
      plan.withdrawal = { kind: 'amount', value: withdrawal.value };
  }
  return Object.keys(plan).length ? plan : undefined;
}

const NOTICE_KINDS: ReadonlySet<PropChallengeNoticeKind> =
  new Set<PropChallengeNoticeKind>([
    'phase_failed',
    'unknown_account',
    'target_reached',
    'evaluation_passed',
    'payout_available',
    'payout_lost',
  ]);

function isPropChallengeNoticeKind(
  value: string
): value is PropChallengeNoticeKind {
  return (NOTICE_KINDS as ReadonlySet<string>).has(value);
}

function normalizeNoticeState(
  value: unknown,
  phaseIds: ReadonlySet<string>
): PropChallengeNoticeState | undefined {
  if (!isRecord(value)) return undefined;
  const state: PropChallengeNoticeState = {};
  if (isRecord(value.dismissed)) {
    const dismissed: Record<string, string> = {};
    for (const [fingerprint, at] of Object.entries(value.dismissed)) {
      if (isIsoDateString(at)) dismissed[fingerprint] = at;
    }
    if (Object.keys(dismissed).length) state.dismissed = dismissed;
  }
  const observed = value.payoutObserved;
  if (
    isRecord(observed) &&
    typeof observed.phaseId === 'string' &&
    phaseIds.has(observed.phaseId) &&
    isFiniteNumber(observed.payoutCount) &&
    (observed.status === 'eligible' || observed.status === 'not_eligible') &&
    isIsoDateString(observed.at)
  )
    state.payoutObserved = {
      phaseId: observed.phaseId,
      payoutCount: observed.payoutCount,
      status: observed.status,
      at: observed.at,
    };
  const lost = value.payoutLost;
  if (
    isRecord(lost) &&
    typeof lost.phaseId === 'string' &&
    phaseIds.has(lost.phaseId) &&
    isFiniteNumber(lost.payoutCount) &&
    isIsoDateString(lost.at) &&
    Array.isArray(lost.requirements) &&
    lost.requirements.every((item) => typeof item === 'string')
  )
    state.payoutLost = {
      phaseId: lost.phaseId,
      payoutCount: lost.payoutCount,
      at: lost.at,
      requirements: lost.requirements,
    };
  if (Array.isArray(value.active)) {
    const active = value.active.flatMap(
      (entry): PropChallengeActiveNotice[] => {
        if (
          !isRecord(entry) ||
          typeof entry.fingerprint !== 'string' ||
          typeof entry.kind !== 'string' ||
          !isPropChallengeNoticeKind(entry.kind) ||
          typeof entry.phaseId !== 'string' ||
          !phaseIds.has(entry.phaseId) ||
          !isIsoDateString(entry.detectedAt)
        )
          return [];
        return [
          {
            fingerprint: entry.fingerprint,
            kind: entry.kind,
            phaseId: entry.phaseId,
            detectedAt: entry.detectedAt,
            ...(isFiniteNumber(entry.amount) ? { amount: entry.amount } : {}),
            ...(typeof entry.identity === 'string' && entry.identity.trim()
              ? { identity: entry.identity.trim() }
              : {}),
            ...(typeof entry.identityLabel === 'string' &&
            entry.identityLabel.trim()
              ? { identityLabel: entry.identityLabel.trim() }
              : {}),
          },
        ];
      }
    );
    if (active.length) state.active = active;
  }
  return Object.keys(state).length ? state : undefined;
}
