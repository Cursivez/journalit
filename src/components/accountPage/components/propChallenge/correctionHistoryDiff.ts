import type {
  PropChallengePhase,
  PropChallengeRule,
  PropChallengePayoutPolicy,
  PropChallengePayoutAvailability,
  PropChallengePayoutMaximum,
} from '../../../../services/propChallenge/types';
import { sameProfileContent } from '../../../../services/propChallenge/PropChallengePolicyHistory';
import { t } from '../../../../lang/helpers';
import type { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';

type Label = Parameters<typeof t>[0];
type Formatter = ReturnType<typeof useDisplayFormatter>['formatValue'];
type NumberKind = Parameters<Formatter>[0]['kind'];
interface Field {
  key: string;
  label: string;
  raw: unknown;
  display: string;
}


function fields(currencyCode: string, formatValue: Formatter) {
  const result: Field[] = [];
  const number = (value: number, kind: NumberKind) => {
    
    const [coefficient, exponent = '0'] = value.toString().split('e');
    const percentagePrecision = Math.min(
      100,
      Math.max(1, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent))
    );
    return formatValue({
      kind,
      value,
      currencyCode,
      precision: kind === 'percentage' ? percentagePrecision : undefined,
    });
  };
  const add = (key: string, label: Label, raw: unknown, display: string) => {
    if (raw !== undefined) result.push({ key, label: t(label), raw, display });
  };
  return {
    result,
    number,
    add,
    numeric(
      key: string,
      label: Label,
      value: number | undefined,
      kind: NumberKind = 'money'
    ) {
      if (value !== undefined)
        add(key, label, { value, kind }, number(value, kind));
    },
    boolean(key: string, label: Label, value: boolean | undefined) {
      add(key, label, value ?? false, t(value ? 'common.yes' : 'common.no'));
    },
    schedule(
      key: string,
      label: Label,
      values: number[],
      kind: NumberKind = 'money'
    ) {
      add(
        key,
        label,
        { values, kind },
        values.map((value) => number(value, kind)).join(' · ')
      );
    },
  };
}

function ruleFields(
  rule: PropChallengeRule,
  currencyCode: string,
  formatValue: Formatter
): Field[] {
  const f = fields(currencyCode, formatValue);
  f.boolean('enabled', 'account.prop-challenge.rule.enabled', rule.enabled);
  if ('amount' in rule) {
    f.numeric(
      'amount',
      'account.prop-challenge.rule.amount',
      rule.amount,
      rule.kind === 'profit_target' && rule.targetType === 'percentage'
        ? 'percentage'
        : rule.kind === 'drawdown'
          ? 'drawdown'
          : rule.kind === 'daily_loss_limit'
            ? 'risk'
            : 'money'
    );
  }
  switch (rule.kind) {
    case 'profit_target':
      f.add(
        'targetType',
        'account.prop-challenge.rule.target-type',
        rule.targetType,
        t(`account.profit-target.type.${rule.targetType}`)
      );
      f.boolean(
        'creditWithdrawals',
        'account.prop-challenge.rule.credit-withdrawals',
        rule.creditWithdrawals
      );
      break;
    case 'drawdown':
      f.add(
        'mode',
        'account.prop-challenge.rule.drawdown-mode',
        rule.mode,
        t(
          rule.mode === 'static'
            ? 'account.prop-challenge.drawdown.static'
            : rule.mode === 'eod_trailing'
              ? 'account.prop-challenge.drawdown.eod-trailing'
              : 'account.prop-challenge.drawdown.intraday-trailing'
        )
      );
      f.numeric(
        'lockAtBalance',
        'account.prop-challenge.rule.lock-at-balance',
        rule.lockAtBalance,
        'balance'
      );
      break;
    case 'daily_loss_limit':
      f.add(
        'breachAction',
        'account.prop-challenge.rule.breach-action',
        rule.breachAction ?? 'fail',
        t(
          rule.breachAction === 'suspend_until_next_session'
            ? 'account.prop-challenge.rule.breach-action.soft'
            : 'account.prop-challenge.rule.breach-action.hard'
        )
      );
      f.numeric(
        'profitThresholdPercent',
        'account.prop-challenge.rule.profit-threshold-percent',
        rule.profitThresholdPercent,
        'percentage'
      );
      f.numeric(
        'amountAfterThreshold',
        'account.prop-challenge.rule.amount-after-threshold',
        rule.amountAfterThreshold,
        'risk'
      );
      f.numeric(
        'scaleAtBalance',
        'account.prop-challenge.rule.scale-at-balance',
        rule.scaleAtBalance,
        'balance'
      );
      f.numeric(
        'scaledAmountPercentOfPeakEodProfit',
        'account.prop-challenge.rule.scaled-percent-of-peak-eod-profit',
        rule.scaledAmountPercentOfPeakEodProfit,
        'percentage'
      );
      if (rule.lossTiers)
        f.add(
          'lossTiers',
          'account.prop-challenge.rule.loss-tiers',
          rule.lossTiers,
          rule.lossTiers
            .map(
              (tier) =>
                `${f.number(tier.profit, 'money')} → ${f.number(tier.amount, 'risk')}`
            )
            .join(' · ')
        );
      f.add(
        'profitBasis',
        'account.prop-challenge.rule.position-profit-basis',
        rule.profitBasis ?? 'cumulative_trade_profit',
        t(
          rule.profitBasis === 'current_account_profit'
            ? 'account.prop-challenge.rule.position-profit-basis.current-account'
            : 'account.prop-challenge.rule.position-profit-basis.cumulative'
        )
      );
      break;
    case 'minimum_trading_days':
      f.numeric('days', 'account.prop-challenge.rule.days', rule.days, 'count');
      break;
    case 'minimum_profitable_days':
      f.numeric(
        'days',
        'account.prop-challenge.payout-rules.days',
        rule.days,
        'count'
      );
      f.numeric(
        'minimumDailyProfit',
        'account.prop-challenge.rule.minimum-daily-profit',
        rule.minimumDailyProfit
      );
      break;
    case 'consistency':
      f.numeric(
        'maxBestDayPercent',
        'account.prop-challenge.rule.best-day-percent',
        rule.maxBestDayPercent,
        'percentage'
      );
      f.numeric(
        'consistencyCushionPercent',
        'account.prop-challenge.rule.consistency-cushion-percent',
        rule.consistencyCushionPercent,
        'percentage'
      );
      break;
    case 'max_position_size':
      f.boolean(
        'microsPerContract',
        'account.prop-challenge.rule.micros-per-contract',
        rule.microsPerContract === 10
      );
      if ('maxContracts' in rule)
        f.numeric(
          'maxContracts',
          'account.prop-challenge.rule.max-contracts',
          rule.maxContracts,
          'positionSize'
        );
      else {
        f.numeric(
          'initialContracts',
          'account.prop-challenge.rule.initial-contracts',
          rule.initialContracts,
          'positionSize'
        );
        f.add(
          'profitBasis',
          'account.prop-challenge.rule.position-profit-basis',
          rule.profitBasis ?? 'cumulative_trade_profit',
          t(
            rule.profitBasis === 'current_account_profit'
              ? 'account.prop-challenge.rule.position-profit-basis.current-account'
              : 'account.prop-challenge.rule.position-profit-basis.cumulative'
          )
        );
        if ('profitTiers' in rule)
          f.add(
            'profitTiers',
            'account.prop-challenge.rule.position-tiers',
            rule.profitTiers,
            rule.profitTiers
              .map(
                (tier) =>
                  `${f.number(tier.profit, 'money')} → ${f.number(tier.maxContracts, 'positionSize')}`
              )
              .join(' · ')
          );
        else {
          f.numeric(
            'profitPerAdditionalContract',
            'account.prop-challenge.rule.profit-per-contract',
            rule.profitPerAdditionalContract
          );
          f.numeric(
            'maximumContracts',
            'account.prop-challenge.rule.maximum-contracts',
            rule.maximumContracts,
            'positionSize'
          );
        }
      }
      break;
    case 'daily_profit_cap':
    case 'live_review_daily_profit':
      break;
    default: {
      const exhaustive: never = rule;
      return exhaustive;
    }
  }
  return f.result;
}

function payoutFields(
  policy: PropChallengePayoutPolicy,
  currencyCode: string,
  formatValue: Formatter
): Field[] {
  const f = fields(currencyCode, formatValue);
  const cycle = policy.cycle;
  f.add(
    'cycle.kind',
    'account.prop-challenge.payout-rules.cycle',
    cycle.kind,
    t(
      cycle.kind === 'none'
        ? 'account.prop-challenge.payout-rules.cycle.none'
        : cycle.kind === 'trading_days'
          ? 'account.prop-challenge.payout-rules.cycle.trading-days'
          : cycle.kind === 'qualifying_days'
            ? 'account.prop-challenge.payout-rules.cycle.qualifying-days'
            : 'account.prop-challenge.payout-rules.cycle.calendar-days'
    )
  );
  if (cycle.kind !== 'none')
    f.numeric(
      'cycle.days',
      'account.prop-challenge.payout-rules.days',
      cycle.days,
      'count'
    );
  if (cycle.kind === 'qualifying_days')
    f.numeric(
      'cycle.minimumDailyProfit',
      'account.prop-challenge.payout-rules.minimum-daily-profit',
      cycle.minimumDailyProfit
    );
  if (cycle.kind === 'calendar_days')
    f.add(
      'cycle.anchor',
      'account.prop-challenge.payout-rules.anchor',
      cycle.anchor,
      t(
        cycle.anchor === 'phase_start'
          ? 'account.prop-challenge.payout-rules.anchor.phase-start'
          : 'account.prop-challenge.payout-rules.anchor.first-trade'
      )
    );
  if (policy.qualifyingDays) {
    f.numeric(
      'qualifyingDays.days',
      'account.prop-challenge.payout.requirement.qualifying-days',
      policy.qualifyingDays.days,
      'count'
    );
    f.numeric(
      'qualifyingDays.minimumDailyProfit',
      'account.prop-challenge.rule.minimum-daily-profit',
      policy.qualifyingDays.minimumDailyProfit
    );
  }
  f.numeric(
    'minimumElapsedHours',
    'account.prop-challenge.payout-rules.minimum-elapsed-hours',
    policy.minimumElapsedHours,
    'count'
  );
  f.numeric(
    'minimumBalance',
    'account.prop-challenge.payout-rules.minimum-balance',
    policy.minimumBalance,
    'balance'
  );
  f.numeric(
    'minimumCycleProfit',
    'account.prop-challenge.payout-rules.minimum-cycle-profit',
    policy.minimumCycleProfit
  );
  if (policy.minimumCycleProfitSchedule) {
    f.schedule(
      'minimumCycleProfitSchedule.amounts',
      'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule',
      policy.minimumCycleProfitSchedule.amounts
    );
    f.boolean(
      'minimumCycleProfitSchedule.repeatLast',
      'account.prop-challenge.payout-rules.schedule-repeat-value',
      policy.minimumCycleProfitSchedule.repeatLast
    );
  }
  f.boolean(
    'requirePositiveCycleProfitAfterFirst',
    'account.prop-challenge.payout-rules.positive-cycle-after-first',
    policy.requirePositiveCycleProfitAfterFirst
  );
  f.numeric(
    'newProfitPercentOfRequest',
    'account.prop-challenge.payout-rules.new-profit-percent',
    policy.newProfitPercentOfRequest,
    'percentage'
  );
  f.boolean(
    'firstPayoutCycleProfitExempt',
    'account.prop-challenge.payout-rules.first-payout-exempt',
    policy.firstPayoutCycleProfitExempt
  );
  f.numeric(
    'maxBestDayPercent',
    'account.prop-challenge.payout-rules.consistency-percent',
    policy.maxBestDayPercent,
    'percentage'
  );
  if (policy.maxBestDayPercentSchedule) {
    f.schedule(
      'maxBestDayPercentSchedule.percents',
      'account.prop-challenge.payout-rules.consistency-percent-schedule',
      policy.maxBestDayPercentSchedule.percents,
      'percentage'
    );
    f.boolean(
      'maxBestDayPercentSchedule.repeatLast',
      'account.prop-challenge.payout-rules.schedule-repeat-value',
      policy.maxBestDayPercentSchedule.repeatLast
    );
  }
  const availability = (
    value: PropChallengePayoutAvailability,
    lifetime: boolean
  ) => {
    const key = lifetime ? 'lifetime.availability' : 'availability';
    f.add(
      `${key}.kind`,
      lifetime
        ? 'account.prop-challenge.payout-rules.lifetime-unlock-availability'
        : 'account.prop-challenge.payout-rules.availability',
      value.kind,
      t(
        value.kind === 'profit_above_starting_balance'
          ? 'account.prop-challenge.payout-rules.availability.starting-balance'
          : 'account.prop-challenge.payout-rules.availability.balance-floor'
      )
    );
    f.numeric(
      `${key}.requestPercent`,
      lifetime
        ? 'account.prop-challenge.payout-rules.lifetime-unlock-request-percent'
        : 'account.prop-challenge.payout-rules.request-percent',
      value.requestPercent,
      'percentage'
    );
    if (value.kind === 'profit_above_balance_floor')
      f.numeric(
        `${key}.balanceFloor`,
        lifetime
          ? 'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor'
          : 'account.prop-challenge.payout-rules.balance-floor',
        value.balanceFloor,
        'balance'
      );
  };
  const maximum = (value: PropChallengePayoutMaximum, lifetime: boolean) => {
    const key = lifetime ? 'lifetime.maximum' : 'maximum';
    f.add(
      `${key}.kind`,
      lifetime
        ? 'account.prop-challenge.payout-rules.lifetime-unlock-maximum'
        : 'account.prop-challenge.payout-rules.maximum',
      value.kind,
      t(
        value.kind === 'none'
          ? 'account.prop-challenge.payout-rules.maximum.none'
          : value.kind === 'fixed'
            ? 'account.prop-challenge.payout-rules.maximum.fixed'
            : value.kind === 'first_fixed_then_none'
              ? 'account.prop-challenge.payout-rules.maximum.first-fixed-then-none'
              : value.kind === 'schedule'
                ? 'account.prop-challenge.payout-rules.maximum.schedule'
                : 'account.prop-challenge.payout-rules.maximum.cycle-profit-percent'
      )
    );
    if (value.kind === 'fixed' || value.kind === 'first_fixed_then_none')
      f.numeric(
        `${key}.amount`,
        lifetime
          ? 'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount'
          : value.kind === 'fixed'
            ? 'account.prop-challenge.payout-rules.maximum-amount'
            : 'account.prop-challenge.payout-rules.maximum-first-amount',
        value.amount
      );
    if (value.kind === 'cycle_profit_percent')
      f.numeric(
        `${key}.percent`,
        lifetime
          ? 'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent'
          : 'account.prop-challenge.payout-rules.maximum-cycle-profit-percent',
        value.percent,
        'percentage'
      );
    if (value.kind === 'schedule') {
      f.schedule(
        `${key}.amounts`,
        lifetime
          ? 'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule'
          : 'account.prop-challenge.payout-rules.schedule',
        value.amounts
      );
      f.boolean(
        `${key}.repeatLast`,
        'account.prop-challenge.payout-rules.schedule-repeat-last',
        value.repeatLast
      );
    }
  };
  availability(policy.availability, false);
  maximum(policy.maximumRequest, false);
  f.numeric(
    'minimumRequest',
    'account.prop-challenge.payout-rules.minimum-request',
    policy.minimumRequest
  );
  if (policy.lifetimeQualifyingDaysUnlock) {
    f.numeric(
      'lifetime.days',
      'account.prop-challenge.payout-rules.lifetime-unlock-days',
      policy.lifetimeQualifyingDaysUnlock.days,
      'count'
    );
    availability(policy.lifetimeQualifyingDaysUnlock.availability, true);
    maximum(policy.lifetimeQualifyingDaysUnlock.maximumRequest, true);
  }
  const split = policy.profitSplit;
  f.add(
    'split.kind',
    'account.prop-challenge.payout-rules.profit-split-model',
    split.kind,
    t(
      split.kind === 'fixed'
        ? 'account.prop-challenge.payout-rules.profit-split.fixed'
        : split.kind === 'cumulative_payout_threshold'
          ? 'account.prop-challenge.payout-rules.profit-split.threshold'
          : 'account.prop-challenge.payout-rules.profit-split.account-profit-threshold'
    )
  );
  if (split.kind === 'fixed')
    f.numeric(
      'split.percent',
      'account.prop-challenge.payout-rules.profit-split',
      split.percent,
      'percentage'
    );
  if (split.kind === 'cumulative_payout_threshold') {
    f.numeric(
      'split.initialPercent',
      'account.prop-challenge.payout-rules.profit-split.initial',
      split.initialPercent,
      'percentage'
    );
    f.numeric(
      'split.thresholdAmount',
      'account.prop-challenge.payout-rules.profit-split.threshold-amount',
      split.thresholdAmount
    );
    f.numeric(
      'split.thereafterPercent',
      'account.prop-challenge.payout-rules.profit-split.thereafter',
      split.thereafterPercent,
      'percentage'
    );
  }
  if (split.kind === 'account_profit_threshold') {
    f.numeric(
      'split.belowPercent',
      'account.prop-challenge.payout-rules.profit-split.below',
      split.belowPercent,
      'percentage'
    );
    f.numeric(
      'split.thresholdProfit',
      'account.prop-challenge.payout-rules.profit-split.threshold-profit',
      split.thresholdProfit
    );
    f.numeric(
      'split.atOrAbovePercent',
      'account.prop-challenge.payout-rules.profit-split.at-or-above',
      split.atOrAbovePercent,
      'percentage'
    );
  }
  f.add(
    'requestWindow.kind',
    'account.prop-challenge.payout-rules.request-window',
    policy.requestWindow?.kind ?? 'anytime',
    t(
      policy.requestWindow
        ? 'account.prop-challenge.payout-rules.request-window.weekdays'
        : 'account.prop-challenge.payout-rules.request-window.anytime'
    )
  );
  if (policy.requestWindow) {
    f.add(
      'requestWindow.weekdays',
      'account.prop-challenge.payout-rules.request-window.allowed-days',
      policy.requestWindow.weekdays,
      policy.requestWindow.weekdays
        .map((day) => t(`common.day.${day}`))
        .join(' · ')
    );
    f.add(
      'requestWindow.timeZone',
      'account.prop-challenge.payout-rules.request-window.time-zone',
      policy.requestWindow.timeZone,
      policy.requestWindow.timeZone
    );
  }
  f.numeric(
    'maximumPayouts',
    'account.prop-challenge.payout-rules.maximum-payouts',
    policy.maximumPayouts,
    'count'
  );
  const aftermath = policy.afterPayout;
  f.add(
    'afterPayout.action',
    'account.prop-challenge.payout-rules.aftermath',
    {
      balanceAction: aftermath.balanceAction,
      drawdownAction: aftermath.drawdownAction,
    },
    t(
      aftermath.drawdownAction === 'unchanged'
        ? 'account.prop-challenge.payout-rules.aftermath.unchanged'
        : aftermath.drawdownAction === 'lock_at_balance'
          ? 'account.prop-challenge.payout-rules.aftermath.lock'
          : 'account.prop-challenge.payout-rules.aftermath.reset'
    )
  );
  if (aftermath.drawdownAction === 'lock_at_balance')
    f.numeric(
      'afterPayout.drawdownFloor',
      'account.prop-challenge.payout-rules.drawdown-floor',
      aftermath.drawdownFloor,
      'balance'
    );
  f.boolean(
    'afterPayout.resetCycle',
    'account.prop-challenge.payout-rules.reset-cycle',
    aftermath.resetCycle
  );
  f.add(
    'afterPayout.maximumPayoutOutcome',
    'account.prop-challenge.payout-rules.maximum-payout-outcome',
    aftermath.maximumPayoutOutcome ?? 'continue',
    t(
      aftermath.maximumPayoutOutcome === 'conclude_account'
        ? 'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude'
        : aftermath.maximumPayoutOutcome === 'promote_to_next_phase'
          ? 'account.prop-challenge.payout-rules.maximum-payout-outcome.promote'
          : aftermath.maximumPayoutOutcome === 'eligible_for_live_review'
            ? 'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review'
            : 'account.prop-challenge.payout-rules.maximum-payout-outcome.continue'
    )
  );
  return f.result;
}

interface CorrectionChange {
  key: string;
  group: string;
  label: string;
  before: string;
  after: string;
}

export function correctionHistoryDiff(
  before: PropChallengePhase,
  after: PropChallengePhase,
  currencyCode: string,
  formatValue: Formatter
): CorrectionChange[] {
  const result: CorrectionChange[] = [];
  const compare = (
    key: string,
    group: string,
    previous: Field[],
    next: Field[]
  ) => {
    const left = new Map(previous.map((field) => [field.key, field]));
    const right = new Map(next.map((field) => [field.key, field]));
    for (const fieldKey of new Set([...left.keys(), ...right.keys()])) {
      const a = left.get(fieldKey),
        b = right.get(fieldKey);
      if (sameProfileContent(a?.raw, b?.raw)) continue;
      result.push({
        key: `${key}.${fieldKey}`,
        group,
        label: b?.label ?? a!.label,
        before: a?.display ?? t('account.profiles.not-configured'),
        after: b?.display ?? t('account.profiles.not-configured'),
      });
    }
  };
  for (const kind of new Set(
    [...before.rules, ...after.rules].map((rule) => rule.kind)
  )) {
    const previous = before.rules.filter((rule) => rule.kind === kind),
      next = after.rules.filter((rule) => rule.kind === kind);
    for (
      let index = 0;
      index < Math.max(previous.length, next.length);
      index++
    ) {
      const group = `${t(`account.prop-challenge.rule.${kind}`)}${Math.max(previous.length, next.length) > 1 ? ` · ${formatValue({ kind: 'count', value: index + 1 })}` : ''}`;
      compare(
        `${kind}.${index}`,
        group,
        previous[index]
          ? ruleFields(previous[index], currencyCode, formatValue)
          : [],
        next[index] ? ruleFields(next[index], currencyCode, formatValue) : []
      );
    }
  }
  compare(
    'payout',
    t('account.prop-challenge.payout-rules.title'),
    before.payoutPolicy
      ? payoutFields(before.payoutPolicy, currencyCode, formatValue)
      : [],
    after.payoutPolicy
      ? payoutFields(after.payoutPolicy, currencyCode, formatValue)
      : []
  );
  return result;
}
