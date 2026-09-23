

import { t, type TranslationKey } from '../../../../lang/helpers';
import type {
  PropChallengePayoutEvaluation,
  PropChallengePayoutRequirement,
} from '../../../../services/propChallenge/PropChallengePayoutEngine';
import type { PropChallengeWeekday } from '../../../../services/propChallenge/types';
import type { DisplayValueOptions } from '../../../../services/display/DisplayPolicy';
import { payoutRequirementLabel } from './payoutRequirementLabel';
import type { PropChallengeLedgerEntry } from './propChallengeLedgerModel';
import {
  propChallengeLifetimeQualifyingDaysHelp,
  propChallengePayoutRequirementHelp,
} from './propChallengeRuleHelp';

type FormatDisplayValue = (options: DisplayValueOptions) => string;


const SHORT_WEEKDAY_KEYS = {
  monday: 'calendar.day.mon',
  tuesday: 'calendar.day.tue',
  wednesday: 'calendar.day.wed',
  thursday: 'calendar.day.thu',
  friday: 'calendar.day.fri',
  saturday: 'calendar.day.sat',
  sunday: 'calendar.day.sun',
} as const satisfies Record<PropChallengeWeekday, TranslationKey>;

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function ratioOf(current: number, target: number): number {
  return target > 0 ? clampRatio(current / target) : 1;
}

function minimum(value: string): string {
  return t('account.prop-challenge.ledger.requirement.minimum', { value });
}

function maximum(value: string): string {
  return t('account.prop-challenge.ledger.requirement.maximum', { value });
}

function pair(current: string, target: string): string {
  return t('account.prop-challenge.ledger.value.ratio', { current, target });
}


function entry(
  satisfied: boolean,
  overLimit = false
): Pick<PropChallengeLedgerEntry, 'state' | 'tone'> {
  if (satisfied) return { state: 'met', tone: 'positive' };
  if (overLimit) return { state: 'near-limit', tone: 'warning' };
  return { state: 'in-progress', tone: 'attention' };
}

function requirementRow(
  requirement: PropChallengePayoutRequirement,
  formatValue: FormatDisplayValue,
  currency: string
): PropChallengeLedgerEntry {
  const money = (value: number) =>
    formatValue({
      kind: 'money',
      value,
      currencyCode: currency,
      signed: false,
    });
  const count = (value: number) =>
    formatValue({ kind: 'metric', value, precision: 0 });
  const share = (value: number) =>
    formatValue({
      kind: 'percentage',
      value,
      precision: Number.isInteger(value) ? 0 : 1,
    });
  const label =
    requirement.kind === 'cycle_days' &&
    requirement.minimumDailyProfit !== undefined
      ? t('account.prop-challenge.payout.requirement.qualifying-days')
      : payoutRequirementLabel(requirement.kind);
  const base = {
    ruleId: `payout-${requirement.kind}`,
    label,
    help: propChallengePayoutRequirementHelp(
      requirement,
      formatValue,
      currency
    ),
    ...entry(requirement.satisfied),
  };

  switch (requirement.kind) {
    case 'cycle_days':
    case 'payout_count':
    case 'elapsed_hours': {
      const current = Math.floor(requirement.current);
      return {
        ...base,
        progressText: pair(count(current), count(requirement.target)),
        progressRatio: ratioOf(requirement.current, requirement.target),
        count: {
          current,
          target: requirement.target,
        },
        requirementText:
          requirement.kind === 'payout_count'
            ? maximum(count(requirement.target))
            : minimum(count(requirement.target)),
      };
    }

    case 'consistency':
      return {
        ...base,
        ...entry(requirement.satisfied, true),
        progressText: share(requirement.current),
        
        progressRatio: clampRatio(requirement.current / 100),
        limitRatio: clampRatio(requirement.target / 100),
        requirementText: maximum(share(requirement.target)),
      };

    case 'request_window':
      return {
        ...base,
        progressText: requirement.currentWeekday
          ? t(`common.day.${requirement.currentWeekday}`)
          : '—',
        progressRatio: requirement.satisfied ? 1 : 0,
        
        
        
        
        requirementText: requirement.allowedWeekdays
          .map((weekday) => t(SHORT_WEEKDAY_KEYS[weekday]))
          .join(', '),
      };

    default:
      return {
        ...base,
        progressText: money(requirement.current),
        progressRatio: ratioOf(requirement.current, requirement.target),
        requirementText: minimum(money(requirement.target)),
      };
  }
}


export function buildPayoutRequirementLedgerRows(
  payout: PropChallengePayoutEvaluation,
  formatValue: FormatDisplayValue,
  currency: string
): PropChallengeLedgerEntry[] {
  const rows = payout.requirements.map((requirement) =>
    requirementRow(requirement, formatValue, currency)
  );

  const lifetime = payout.lifetimeQualifyingDays;
  if (lifetime) {
    const count = (value: number) =>
      formatValue({ kind: 'metric', value, precision: 0 });
    rows.push({
      ruleId: 'payout-lifetime-qualifying-days',
      label: t('account.prop-challenge.payout.lifetime-qualifying-days'),
      help: propChallengeLifetimeQualifyingDaysHelp(lifetime, formatValue),
      progressText: pair(count(lifetime.current), count(lifetime.target)),
      progressRatio: ratioOf(lifetime.current, lifetime.target),
      count: { current: lifetime.current, target: lifetime.target },
      requirementText: minimum(count(lifetime.target)),
      ...entry(lifetime.unlocked),
    });
  }

  return rows;
}
