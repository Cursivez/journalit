

import { t } from '../../../../lang/helpers';
import type { PropChallengeRuleEvaluation } from '../../../../services/propChallenge/PropChallengeRuleEngine';
import type { DisplayValueOptions } from '../../../../services/display/DisplayPolicy';
import {
  propChallengeRuleHelp,
  type PropChallengeLedgerHelp,
} from './propChallengeRuleHelp';

type FormatDisplayValue = (options: DisplayValueOptions) => string;


export type PropChallengeLedgerState =
  | 'not-started'
  | 'in-progress'
  | 'reached'
  | 'met'
  | 'eligible'
  | 'safe'
  | 'clear'
  | 'within-rule'
  | 'needs-profit'
  | 'near-limit'
  | 'limit-reached'
  | 'cap-applied'
  | 'within-cap'
  | 'breached';

export type PropChallengeLedgerTone =
  | 'neutral'
  | 'attention'
  | 'positive'
  | 'warning'
  | 'negative';


export interface PropChallengeLedgerExplanation {
  title: string;
  description: string;
  formula: string;
  
  calculations: string[];
  disclosureLabel: string;
}

export interface PropChallengeLedgerRow {
  ruleId: string;
  kind: PropChallengeRuleEvaluation['kind'];
  label: string;
  explanation?: PropChallengeLedgerExplanation;
  
  help: PropChallengeLedgerHelp;
  
  progressText: string;
  
  progressRatio: number;
  
  limitRatio?: number;
  
  count?: { current: number; target: number };
  requirementText: string;
  state: PropChallengeLedgerState;
  tone: PropChallengeLedgerTone;
}


export type PropChallengeLedgerEntry = Omit<PropChallengeLedgerRow, 'kind'>;

const TONE_BY_STATE: Record<PropChallengeLedgerState, PropChallengeLedgerTone> =
  {
    'not-started': 'neutral',
    'in-progress': 'attention',
    reached: 'positive',
    met: 'positive',
    eligible: 'positive',
    safe: 'positive',
    clear: 'positive',
    'within-rule': 'positive',
    
    
    'needs-profit': 'neutral',
    'near-limit': 'warning',
    'limit-reached': 'warning',
    'cap-applied': 'attention',
    'within-cap': 'positive',
    breached: 'negative',
  };

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function ratioOf(value: number, total: number): number {
  return total > 0 ? clampRatio(value / total) : 0;
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

function currentOf(current: string, target: string): string {
  return t('account.prop-challenge.ledger.value.of', { current, target });
}

function requirement(
  key: 'target' | 'buffer' | 'max' | 'days' | 'at-most' | 'best-day',
  value: string
): string {
  return t(`account.prop-challenge.ledger.requirement.${key}`, { value });
}


function attainmentState(
  satisfied: boolean,
  doneState: Extract<PropChallengeLedgerState, 'reached' | 'met'>,
  startedCount?: number
): PropChallengeLedgerState {
  if (satisfied) return doneState;
  if (startedCount !== undefined && startedCount <= 0) return 'not-started';
  return 'in-progress';
}


function limitState(
  breached: boolean,
  currentWarning: boolean,
  safeState: Extract<PropChallengeLedgerState, 'safe' | 'clear' | 'within-rule'>
): PropChallengeLedgerState {
  if (breached) return 'breached';
  if (currentWarning) return 'near-limit';
  return safeState;
}


function shareText(formatValue: FormatDisplayValue, value: number): string {
  return formatValue({
    kind: 'percentage',
    value,
    precision: Number.isInteger(value) ? 0 : 1,
  });
}


function consistencyExplanation(
  rule: Extract<PropChallengeRuleEvaluation, { kind: 'consistency' }>,
  formatValue: FormatDisplayValue,
  currency: string
): PropChallengeLedgerExplanation {
  const label = t('account.prop-challenge.summary.rule.consistency');
  const calculations: string[] = [];

  if (rule.totalProfit > 0) {
    const bestDay = money(formatValue, rule.bestDayProfit, currency);
    const totalProfit = money(formatValue, rule.totalProfit, currency);
    const share = shareText(formatValue, rule.bestDayPercent);
    const maximum = shareText(formatValue, rule.target);
    calculations.push(
      t('account.prop-challenge.ledger.tooltip.consistency.best-day', {
        value: bestDay,
      }),
      t('account.prop-challenge.ledger.tooltip.consistency.total-profit', {
        value: totalProfit,
      }),
      t('account.prop-challenge.ledger.tooltip.consistency.share', {
        best: bestDay,
        total: totalProfit,
        share,
      })
    );
    if (rule.satisfied) {
      calculations.push(
        t('account.prop-challenge.ledger.tooltip.consistency.within', {
          share,
          maximum,
        })
      );
    } else if (rule.target <= 0) {
      
      
      
      calculations.push(
        t('account.prop-challenge.ledger.tooltip.consistency.no-maximum')
      );
    } else if (rule.requiredTotalProfit > rule.totalProfit) {
      calculations.push(
        t('account.prop-challenge.ledger.tooltip.consistency.goal', {
          best: bestDay,
          maximum,
          goal: money(formatValue, rule.requiredTotalProfit, currency),
        }),
        t('account.prop-challenge.ledger.tooltip.consistency.goal-hint')
      );
    }
    
    
    
  } else {
    calculations.push(
      t('account.prop-challenge.ledger.tooltip.consistency.pending')
    );
  }

  return {
    title: label,
    description: t(
      'account.prop-challenge.ledger.tooltip.consistency.description'
    ),
    formula: t('account.prop-challenge.ledger.tooltip.consistency.formula'),
    calculations,
    disclosureLabel: t('account.prop-challenge.ledger.tooltip.open', {
      rule: label,
    }),
  };
}

function buildRow(
  rule: PropChallengeRuleEvaluation,
  formatValue: FormatDisplayValue,
  currency: string
): Omit<
  PropChallengeLedgerRow,
  'ruleId' | 'kind' | 'label' | 'tone' | 'explanation' | 'help'
> {
  switch (rule.kind) {
    case 'profit_target':
      return {
        progressText: currentOf(
          money(formatValue, rule.current, currency),
          money(formatValue, rule.target, currency)
        ),
        progressRatio: clampRatio(rule.progress),
        requirementText: requirement(
          'target',
          money(formatValue, rule.target, currency)
        ),
        state: attainmentState(rule.satisfied, 'reached'),
      };

    case 'drawdown': {
      
      
      
      
      
      
      const drawdown = (value: number) =>
        formatValue({
          kind: 'drawdown',
          value,
          currencyCode: currency,
          signed: false,
        });
      return {
        
        
        progressText: t('account.prop-challenge.ledger.value.used', {
          used: drawdown(rule.breached ? rule.maximumUsed : rule.currentUsed),
        }),
        progressRatio: rule.breached
          ? clampRatio(rule.progress)
          : ratioOf(rule.currentUsed, rule.limit),
        requirementText: requirement('max', drawdown(rule.limit)),
        state: limitState(rule.breached, rule.currentBufferWarning, 'safe'),
      };
    }

    case 'daily_loss_limit': {
      
      
      const risk = (value: number) =>
        formatValue({
          kind: 'risk',
          value,
          currencyCode: currency,
          signed: false,
        });
      
      
      
      
      if (rule.breached && (rule.breachAction ?? 'fail') === 'fail') {
        return {
          progressText: t('account.prop-challenge.ledger.value.used', {
            used: risk(rule.current),
          }),
          progressRatio: clampRatio(rule.progress),
          requirementText: requirement('max', risk(rule.target)),
          state: 'breached',
        };
      }
      return {
        progressText: t('account.prop-challenge.ledger.value.of-today', {
          current: risk(rule.currentTradingDayMaximumLoss),
          target: risk(rule.target),
        }),
        progressRatio: ratioOf(rule.currentTradingDayMaximumLoss, rule.target),
        requirementText: requirement('max', risk(rule.target)),
        state:
          rule.breachAction === 'suspend_until_next_session' &&
          rule.currentTradingDayBreached
            ? 'limit-reached'
            : limitState(false, rule.currentTradingDayWarning, 'clear'),
      };
    }

    case 'daily_profit_cap': {
      const profit = (value: number) => money(formatValue, value, currency);
      return {
        progressText: t('account.prop-challenge.ledger.value.credited-profit', {
          credited: profit(rule.creditedTradeProfit),
          actual: profit(rule.actualTradeProfit),
        }),
        progressRatio: ratioOf(rule.current, rule.target),
        requirementText: t(
          'account.prop-challenge.ledger.requirement.daily-cap',
          { value: profit(rule.target) }
        ),
        state: rule.excludedProfit > 0 ? 'cap-applied' : 'within-cap',
      };
    }

    case 'live_review_daily_profit': {
      const profit = (value: number) => money(formatValue, value, currency);
      return {
        progressText: currentOf(profit(rule.current), profit(rule.target)),
        progressRatio: clampRatio(rule.progress),
        requirementText: requirement('target', profit(rule.target)),
        state: rule.eligibleForLiveReview
          ? 'eligible'
          : rule.current > 0
            ? 'in-progress'
            : 'not-started',
      };
    }

    case 'minimum_trading_days': {
      const days = (value: number) =>
        formatValue({ kind: 'metric', value, precision: 0 });
      return {
        progressText: currentOf(days(rule.current), days(rule.target)),
        progressRatio: clampRatio(rule.progress),
        requirementText: requirement('days', days(rule.target)),
        state: attainmentState(rule.satisfied, 'met', rule.current),
        count: { current: rule.current, target: rule.target },
      };
    }

    case 'minimum_profitable_days': {
      const days = (value: number) =>
        formatValue({ kind: 'metric', value, precision: 0 });
      return {
        progressText: currentOf(days(rule.current), days(rule.target)),
        progressRatio: clampRatio(rule.progress),
        requirementText: t(
          'account.prop-challenge.ledger.requirement.profitable-days',
          {
            days: days(rule.target),
            profit: money(formatValue, rule.minimumDailyProfit, currency),
          }
        ),
        state: attainmentState(rule.satisfied, 'met', rule.current),
        count: { current: rule.current, target: rule.target },
      };
    }

    case 'consistency': {
      
      
      
      const percent = (value: number) => shareText(formatValue, value);
      
      
      
      
      
      
      const requirementText = requirement('best-day', percent(rule.target));
      
      
      const bestDayShare = () =>
        t('account.prop-challenge.ledger.value.best-day-share', {
          value: percent(rule.bestDayPercent),
        });
      
      
      const limitRatio = clampRatio(rule.target / 100);
      if (rule.satisfied) {
        return {
          progressText: bestDayShare(),
          progressRatio: clampRatio(rule.bestDayPercent / 100),
          limitRatio,
          requirementText,
          state: 'within-rule',
        };
      }
      if (rule.totalProfit > 0) {
        
        
        
        
        const hasGoal = rule.requiredTotalProfit > rule.totalProfit;
        return {
          progressText: hasGoal
            ? t('account.prop-challenge.ledger.value.consistency-goal', {
                current: money(formatValue, rule.totalProfit, currency),
                target: money(formatValue, rule.requiredTotalProfit, currency),
              })
            : bestDayShare(),
          progressRatio: clampRatio(rule.bestDayPercent / 100),
          limitRatio,
          requirementText,
          state: 'needs-profit',
        };
      }
      return {
        progressText: t('account.prop-challenge.ledger.value.no-profit'),
        progressRatio: 0,
        requirementText,
        state: 'not-started',
      };
    }

    case 'max_position_size': {
      const size = (value: number) =>
        formatValue({ kind: 'positionSize', value, precision: 2 });
      return {
        progressText: currentOf(size(rule.current), size(rule.target)),
        progressRatio: ratioOf(rule.current, rule.target),
        requirementText: requirement('at-most', size(rule.target)),
        
        
        state: limitState(rule.breached, false, 'within-rule'),
      };
    }

    default: {
      const exhaustive: never = rule;
      return exhaustive;
    }
  }
}


export function buildPropChallengeLedgerRows(
  rules: readonly PropChallengeRuleEvaluation[],
  formatValue: FormatDisplayValue,
  currency: string
): PropChallengeLedgerRow[] {
  return rules.map((rule) => {
    const row = buildRow(rule, formatValue, currency);
    return {
      ruleId: rule.ruleId,
      kind: rule.kind,
      
      
      label:
        rule.kind === 'drawdown'
          ? t(`account.prop-challenge.summary.rule.drawdown-${rule.mode}`)
          : t(`account.prop-challenge.summary.rule.${rule.kind}`),
      tone: TONE_BY_STATE[row.state],
      
      
      explanation:
        rule.kind === 'consistency'
          ? consistencyExplanation(rule, formatValue, currency)
          : undefined,
      help: propChallengeRuleHelp(rule, formatValue, currency),
      ...row,
    };
  });
}
