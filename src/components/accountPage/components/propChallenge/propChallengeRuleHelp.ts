

import { t } from '../../../../lang/helpers';
import type { TranslationKey } from '../../../../lang/locale/en';
import type { DisplayValueOptions } from '../../../../services/display/DisplayPolicy';
import type { PropChallengePayoutRequirement } from '../../../../services/propChallenge/PropChallengePayoutEngine';
import type { PropChallengeRuleEvaluation } from '../../../../services/propChallenge/PropChallengeRuleEngine';
import type {
  PropChallengeRule,
  PropChallengeWeekday,
} from '../../../../services/propChallenge/types';

type FormatDisplayValue = (options: DisplayValueOptions) => string;

export interface PropChallengeLedgerHelp {
  description: string;
  example: string;
}


export function propChallengeRuleDescription(
  rule: PropChallengeRule | PropChallengeRuleEvaluation
): string {
  return rule.kind === 'drawdown'
    ? t(`account.prop-challenge.ledger.help.drawdown.${rule.mode}`)
    : t(`account.prop-challenge.ledger.help.${rule.kind}`);
}

function help(
  description: TranslationKey,
  example: TranslationKey,
  params?: Record<string, string>
): PropChallengeLedgerHelp {
  return {
    description: t(description),
    example: t(example, params),
  };
}

function ruleHelp(
  rule: PropChallengeRuleEvaluation,
  example: TranslationKey,
  params?: Record<string, string>
): PropChallengeLedgerHelp {
  return {
    description: propChallengeRuleDescription(rule),
    example: t(example, params),
  };
}

function money(
  formatValue: FormatDisplayValue,
  value: number,
  currency: string
): string {
  return formatValue({
    kind: 'money',
    value,
    currencyCode: currency,
    signed: false,
  });
}

function share(formatValue: FormatDisplayValue, value: number): string {
  return formatValue({
    kind: 'percentage',
    value,
    precision: Number.isInteger(value) ? 0 : 1,
  });
}

function count(formatValue: FormatDisplayValue, value: number): string {
  return formatValue({ kind: 'metric', value, precision: 0 });
}

function nonNegative(value: number): number {
  return Math.max(0, value);
}

function weekdayName(weekday: PropChallengeWeekday): string {
  return t(`common.day.${weekday}`);
}

function drawdownHelp(
  rule: Extract<PropChallengeRuleEvaluation, { kind: 'drawdown' }>,
  formatValue: FormatDisplayValue,
  currency: string
): PropChallengeLedgerHelp {
  const params = {
    floor: money(formatValue, rule.currentFloor, currency),
    limit: money(formatValue, rule.limit, currency),
    buffer: money(
      formatValue,
      nonNegative(rule.limit - rule.currentUsed),
      currency
    ),
  };
  return ruleHelp(
    rule,
    `account.prop-challenge.ledger.help.drawdown.${rule.mode}.example`,
    params
  );
}


export function propChallengeRuleHelp(
  rule: PropChallengeRuleEvaluation,
  formatValue: FormatDisplayValue,
  currency: string
): PropChallengeLedgerHelp {
  switch (rule.kind) {
    case 'profit_target':
      return ruleHelp(
        rule,
        rule.satisfied
          ? 'account.prop-challenge.ledger.help.profit_target.example-done'
          : 'account.prop-challenge.ledger.help.profit_target.example',
        {
          target: money(formatValue, rule.target, currency),
          current: money(formatValue, rule.current, currency),
          remaining: money(formatValue, nonNegative(rule.remaining), currency),
        }
      );
    case 'drawdown':
      return drawdownHelp(rule, formatValue, currency);
    case 'daily_loss_limit':
      return ruleHelp(
        rule,
        'account.prop-challenge.ledger.help.daily_loss_limit.example',
        {
          used: money(formatValue, rule.currentTradingDayMaximumLoss, currency),
          limit: money(formatValue, rule.target, currency),
          left: money(
            formatValue,
            nonNegative(rule.target - rule.currentTradingDayMaximumLoss),
            currency
          ),
        }
      );
    case 'daily_profit_cap':
      return ruleHelp(
        rule,
        'account.prop-challenge.ledger.help.daily_profit_cap.example',
        {
          cap: money(formatValue, rule.target, currency),
          excluded: money(formatValue, rule.excludedProfit, currency),
        }
      );
    case 'live_review_daily_profit':
      return ruleHelp(
        rule,
        'account.prop-challenge.ledger.help.live_review_daily_profit.example',
        {
          trigger: money(formatValue, rule.target, currency),
          bestDay: money(formatValue, rule.bestDayProfit, currency),
        }
      );
    case 'minimum_trading_days':
      return ruleHelp(
        rule,
        'account.prop-challenge.ledger.help.minimum_trading_days.example',
        {
          current: count(formatValue, rule.current),
          target: count(formatValue, rule.target),
          remaining: count(formatValue, nonNegative(rule.remaining)),
        }
      );
    case 'minimum_profitable_days':
      return ruleHelp(
        rule,
        'account.prop-challenge.ledger.help.minimum_profitable_days.example',
        {
          current: count(formatValue, rule.current),
          target: count(formatValue, rule.target),
          remaining: count(formatValue, nonNegative(rule.remaining)),
          minimum: money(formatValue, rule.minimumDailyProfit, currency),
        }
      );
    case 'consistency':
      if (rule.totalProfit <= 0) {
        return ruleHelp(
          rule,
          'account.prop-challenge.ledger.help.consistency.example-none'
        );
      }
      if (rule.satisfied) {
        return ruleHelp(
          rule,
          'account.prop-challenge.ledger.help.consistency.example-done',
          {
            bestDay: money(formatValue, rule.bestDayProfit, currency),
            share: share(formatValue, rule.bestDayPercent),
            maximum: share(formatValue, rule.target),
          }
        );
      }
      return ruleHelp(
        rule,
        'account.prop-challenge.ledger.help.consistency.example',
        {
          bestDay: money(formatValue, rule.bestDayProfit, currency),
          share: share(formatValue, rule.bestDayPercent),
          total: money(formatValue, rule.totalProfit, currency),
          goal: money(formatValue, rule.requiredTotalProfit, currency),
          maximum: share(formatValue, rule.target),
        }
      );
    case 'max_position_size':
      return ruleHelp(
        rule,
        'account.prop-challenge.ledger.help.max_position_size.example',
        {
          maximum: count(formatValue, rule.target),
          current: count(formatValue, rule.current),
        }
      );
    default: {
      const exhaustive: never = rule;
      return exhaustive;
    }
  }
}


export function propChallengePayoutRequirementHelp(
  requirement: PropChallengePayoutRequirement,
  formatValue: FormatDisplayValue,
  currency: string
): PropChallengeLedgerHelp {
  switch (requirement.kind) {
    case 'qualifying_days':
    case 'cycle_days':
      if (requirement.minimumDailyProfit !== undefined) {
        return help(
          'account.prop-challenge.ledger.help.payout.qualifying_days',
          'account.prop-challenge.ledger.help.payout.qualifying_days.example',
          {
            current: count(formatValue, requirement.current),
            target: count(formatValue, requirement.target),
            remaining: count(
              formatValue,
              nonNegative(requirement.target - requirement.current)
            ),
            minimum: money(
              formatValue,
              requirement.minimumDailyProfit,
              currency
            ),
          }
        );
      }

      return help(
        'account.prop-challenge.ledger.help.payout.cycle_days',
        'account.prop-challenge.ledger.help.payout.cycle_days.example',
        {
          current: count(formatValue, requirement.current),
          target: count(formatValue, requirement.target),
          remaining: count(
            formatValue,
            nonNegative(requirement.target - requirement.current)
          ),
        }
      );
    case 'cycle_profit':
      return help(
        'account.prop-challenge.ledger.help.payout.cycle_profit',
        'account.prop-challenge.ledger.help.payout.cycle_profit.example',
        {
          current: money(formatValue, requirement.current, currency),
          target: money(formatValue, requirement.target, currency),
        }
      );
    case 'minimum_balance':
      return help(
        'account.prop-challenge.ledger.help.payout.minimum_balance',
        'account.prop-challenge.ledger.help.payout.minimum_balance.example',
        {
          current: money(formatValue, requirement.current, currency),
          target: money(formatValue, requirement.target, currency),
        }
      );
    case 'positive_cycle_profit':
      return help(
        'account.prop-challenge.ledger.help.payout.positive_cycle_profit',
        'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example',
        {
          current: money(formatValue, requirement.current, currency),
        }
      );
    case 'consistency':
      if (requirement.cycleProfit <= 0) {
        return help(
          'account.prop-challenge.ledger.help.payout.consistency',
          'account.prop-challenge.ledger.help.payout.consistency.example-none'
        );
      }
      if (requirement.satisfied) {
        return help(
          'account.prop-challenge.ledger.help.payout.consistency',
          'account.prop-challenge.ledger.help.payout.consistency.example-done',
          {
            bestDay: money(formatValue, requirement.bestDayProfit, currency),
            share: share(formatValue, requirement.current),
            maximum: share(formatValue, requirement.target),
          }
        );
      }
      return help(
        'account.prop-challenge.ledger.help.payout.consistency',
        'account.prop-challenge.ledger.help.payout.consistency.example',
        {
          bestDay: money(formatValue, requirement.bestDayProfit, currency),
          share: share(formatValue, requirement.current),
          total: money(formatValue, requirement.cycleProfit, currency),
          goal: money(formatValue, requirement.requiredCycleProfit, currency),
          maximum: share(formatValue, requirement.target),
        }
      );
    case 'minimum_request':
      return help(
        'account.prop-challenge.ledger.help.payout.minimum_request',
        'account.prop-challenge.ledger.help.payout.minimum_request.example',
        {
          current: money(formatValue, requirement.current, currency),
          target: money(formatValue, requirement.target, currency),
        }
      );
    case 'payout_count':
      return help(
        'account.prop-challenge.ledger.help.payout.payout_count',
        'account.prop-challenge.ledger.help.payout.payout_count.example',
        {
          current: count(formatValue, requirement.current),
          target: count(formatValue, requirement.target),
        }
      );
    case 'request_window':
      return help(
        'account.prop-challenge.ledger.help.payout.request_window',
        'account.prop-challenge.ledger.help.payout.request_window.example',
        {
          today: requirement.currentWeekday
            ? weekdayName(requirement.currentWeekday)
            : '—',
          days: requirement.allowedWeekdays
            .map((weekday) => weekdayName(weekday))
            .join(', '),
          timeZone: requirement.timeZone,
        }
      );
    case 'elapsed_hours':
      return help(
        'account.prop-challenge.ledger.help.payout.elapsed_hours',
        'account.prop-challenge.ledger.help.payout.elapsed_hours.example',
        {
          current: count(formatValue, requirement.current),
          target: count(formatValue, requirement.target),
        }
      );
    default: {
      const exhaustive: never = requirement;
      return exhaustive;
    }
  }
}

export function propChallengeLifetimeQualifyingDaysHelp(
  lifetime: { current: number; target: number },
  formatValue: FormatDisplayValue
): PropChallengeLedgerHelp {
  return help(
    'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days',
    'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example',
    {
      current: count(formatValue, lifetime.current),
      target: count(formatValue, lifetime.target),
    }
  );
}
