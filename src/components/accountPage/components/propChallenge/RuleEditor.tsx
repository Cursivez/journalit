import React, { useId } from 'react';
import { DraftInput } from '../../../ui/DraftInput';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { t } from '../../../../lang/helpers';
import type {
  ExecutablePropChallengeRule,
  PropChallengeRule,
} from '../../../../services/propChallenge/types';
import { isDisputedRule } from '../../../../services/propChallenge/PropChallengeRuleReview';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import {
  ChevronDown,
  ChevronRight,
  Trash2,
} from '../../../shared/icons/ObsidianIcon';
import { NoTooltipButton } from '../../../ui/NoTooltipButton';
import { numberValue } from './editorOptions';
import { Tooltip } from '../../../shared/Tooltip';
import { HelpTooltipContent } from '../../../shared/HelpTooltipContent';
import { propChallengeRuleDescription } from './propChallengeRuleHelp';
import { PropChallengeField } from './PropChallengeField';
import {
  DrawdownFields,
  ProfitTargetFields,
  RuleAmountField,
} from './AmountRuleFields';

const formatLossTiers = (
  tiers: Array<{ profit: number; amount: number }>
): string => tiers.map((tier) => `${tier.profit}:${tier.amount}`).join(', ');

const parseLossTiers = (
  value: string
): Array<{ profit: number; amount: number }> =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .flatMap((entry) => {
      const [profitValue, amountValue] = entry.split(':');
      const profit = Number.parseFloat(profitValue ?? '');
      const amount = Number.parseFloat(amountValue ?? '');
      return Number.isFinite(profit) && Number.isFinite(amount)
        ? [{ profit, amount }]
        : [];
    });

function getDrawdownModeLabel(
  mode: Extract<PropChallengeRule, { kind: 'drawdown' }>['mode']
): string {
  switch (mode) {
    case 'static':
      return t('account.prop-challenge.drawdown.static');
    case 'eod_trailing':
      return t('account.prop-challenge.drawdown.eod-trailing');
    case 'intraday_trailing':
      return t('account.prop-challenge.drawdown.intraday-trailing');
  }
}

function getRuleSummary(
  rule: ExecutablePropChallengeRule,
  currencyCode: string,
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue']
): string {
  if (isDisputedRule(rule)) {
    return `${t('account.prop-challenge.rule.manual_review')}: ${rule.reviewRequired}`;
  }
  switch (rule.kind) {
    case 'profit_target': {
      const target = formatValue({
        kind: rule.targetType === 'percentage' ? 'percentage' : 'money',
        value: rule.amount,
        currencyCode,
        showCents: false,
        precision: rule.targetType === 'percentage' ? 1 : undefined,
      });
      return [
        target,
        t(`account.profit-target.type.${rule.targetType}`),
        rule.creditWithdrawals
          ? t('account.prop-challenge.rule.credit-withdrawals')
          : undefined,
      ]
        .filter((value): value is string => value !== undefined)
        .join(' · ');
    }
    case 'drawdown':
      return [
        formatValue({
          kind: 'drawdown',
          value: rule.amount,
          currencyCode,
          showCents: false,
        }),
        getDrawdownModeLabel(rule.mode),
        rule.lockAtBalance === undefined
          ? undefined
          : `${t('account.prop-challenge.rule.lock-at-balance')} ${formatValue({
              kind: 'balance',
              value: rule.lockAtBalance,
              currencyCode,
              showCents: false,
            })}`,
      ]
        .filter((value): value is string => value !== undefined)
        .join(' · ');
    case 'daily_loss_limit':
      return [
        rule.lossTiers
          ? `${formatValue({
              kind: 'risk',
              value: rule.amount,
              currencyCode,
              showCents: false,
            })} → ${t('account.prop-challenge.rule.daily-loss-tiered-summary')}`
          : rule.scaledAmountPercentOfPeakEodProfit !== undefined
            ? `${formatValue({
                kind: 'risk',
                value: rule.amount,
                currencyCode,
                showCents: false,
              })} → ${t(
                'account.prop-challenge.rule.peak-eod-profit-percent-summary',
                {
                  value: formatValue({
                    kind: 'percentage',
                    value: rule.scaledAmountPercentOfPeakEodProfit,
                    precision: 1,
                  }),
                }
              )}`
            : rule.amountAfterThreshold === undefined
              ? formatValue({
                  kind: 'risk',
                  value: rule.amount,
                  currencyCode,
                  showCents: false,
                })
              : `${formatValue({
                  kind: 'risk',
                  value: rule.amount,
                  currencyCode,
                  showCents: false,
                })} → ${formatValue({
                  kind: 'risk',
                  value: rule.amountAfterThreshold,
                  currencyCode,
                  showCents: false,
                })}`,
        t(
          rule.breachAction === 'suspend_until_next_session'
            ? 'account.prop-challenge.rule.breach-action.soft'
            : 'account.prop-challenge.rule.breach-action.hard'
        ),
      ].join(' · ');
    case 'daily_profit_cap':
      return `${formatValue({
        kind: 'money',
        value: rule.amount,
        currencyCode,
        showCents: false,
      })} · ${t('account.prop-challenge.rule.per-trading-day')}`;
    case 'live_review_daily_profit':
      return `${t('account.prop-challenge.rule.best-profitable-day')}: ${formatValue(
        {
          kind: 'money',
          value: rule.amount,
          currencyCode,
          showCents: false,
        }
      )}`;
    case 'minimum_trading_days':
      return `${t('account.prop-challenge.rule.days')}: ${formatValue({ kind: 'count', value: rule.days })}`;
    case 'minimum_profitable_days':
      return `${formatValue({ kind: 'count', value: rule.days })} · ${t(
        'account.prop-challenge.rule.minimum-daily-profit-summary',
        {
          value: formatValue({
            kind: 'money',
            value: rule.minimumDailyProfit,
            currencyCode,
            showCents: false,
          }),
        }
      )}`;
    case 'manual_review':
      return rule.reason;
    case 'consistency':
      return `${t('account.prop-challenge.rule.best-day-percent')}: ${rule.comparison === 'strictly_below' ? '< ' : '≤ '}${formatValue(
        {
          kind: 'percentage',
          value: rule.maxBestDayPercent,
          precision: 1,
        }
      )}${
        rule.consistencyCushionPercent === undefined
          ? ''
          : ` + ${formatValue({
              kind: 'percentage',
              value: rule.consistencyCushionPercent,
              precision: 1,
            })} ${t('account.prop-challenge.rule.consistency-cushion-short')}`
      }`;
  }
}

function DailyLossLimitFields({
  rule,
  startingBalance,
  disabled,
  onChange,
}: {
  rule: Extract<PropChallengeRule, { kind: 'daily_loss_limit' }>;
  startingBalance: number;
  disabled: boolean;
  onChange: (rule: PropChallengeRule) => void;
}) {
  return (
    <>
      <RuleAmountField
        amount={rule.amount}
        onChange={(amount) => onChange({ ...rule, amount })}
        disabled={disabled}
        descriptionKey="account.prop-challenge.rule.help.daily-loss-amount"
      />
      <PropChallengeField
        kind="dropdown"
        translationKey="account.prop-challenge.rule.breach-action"
        description={t('account.prop-challenge.rule.help.breach-action')}
      >
        <DropdownSelect
          value={rule.breachAction ?? 'fail'}
          ariaLabel={t('account.prop-challenge.rule.breach-action')}
          onChange={(breachAction) => {
            if (
              breachAction === 'fail' ||
              breachAction === 'suspend_until_next_session'
            ) {
              onChange({ ...rule, breachAction });
            }
          }}
          disabled={disabled}
          options={[
            {
              value: 'fail',
              label: t('account.prop-challenge.rule.breach-action.hard'),
            },
            {
              value: 'suspend_until_next_session',
              label: t('account.prop-challenge.rule.breach-action.soft'),
            },
          ]}
        />
      </PropChallengeField>
      <PropChallengeField
        kind="dropdown"
        translationKey="account.prop-challenge.rule.daily-loss-model"
        description={t('account.prop-challenge.rule.help.daily-loss-model')}
      >
        <DropdownSelect
          ariaLabel={t('account.prop-challenge.rule.daily-loss-model')}
          value={
            rule.lossTiers
              ? 'profit_tiers'
              : rule.scaleAtBalance !== undefined
                ? 'peak_eod_profit'
                : rule.profitThresholdPercent === undefined
                  ? 'fixed'
                  : 'profit_threshold'
          }
          onChange={(kind) => {
            if (kind === 'fixed') {
              const fixedRule = { ...rule };
              delete fixedRule.profitThresholdPercent;
              delete fixedRule.amountAfterThreshold;
              delete fixedRule.scaleAtBalance;
              delete fixedRule.scaledAmountPercentOfPeakEodProfit;
              delete fixedRule.lossTiers;
              delete fixedRule.profitBasis;
              onChange(fixedRule);
              return;
            }
            if (kind === 'profit_tiers') {
              const tieredRule = { ...rule };
              delete tieredRule.profitThresholdPercent;
              delete tieredRule.amountAfterThreshold;
              delete tieredRule.scaleAtBalance;
              delete tieredRule.scaledAmountPercentOfPeakEodProfit;
              tieredRule.lossTiers = [
                { profit: rule.amount, amount: rule.amount * 2 },
              ];
              tieredRule.profitBasis = 'current_account_profit';
              onChange(tieredRule);
              return;
            }
            if (kind === 'peak_eod_profit') {
              const scaledRule = { ...rule };
              delete scaledRule.profitThresholdPercent;
              delete scaledRule.amountAfterThreshold;
              delete scaledRule.lossTiers;
              delete scaledRule.profitBasis;
              scaledRule.scaleAtBalance = startingBalance + rule.amount;
              scaledRule.scaledAmountPercentOfPeakEodProfit = 60;
              onChange(scaledRule);
              return;
            }
            const thresholdRule = { ...rule };
            delete thresholdRule.scaleAtBalance;
            delete thresholdRule.scaledAmountPercentOfPeakEodProfit;
            delete thresholdRule.lossTiers;
            delete thresholdRule.profitBasis;
            onChange({
              ...thresholdRule,
              profitThresholdPercent: 6,
              amountAfterThreshold: rule.amount,
            });
          }}
          disabled={disabled}
          options={[
            {
              value: 'fixed',
              label: t('account.prop-challenge.rule.daily-loss-model.fixed'),
            },
            {
              value: 'profit_threshold',
              label: t(
                'account.prop-challenge.rule.daily-loss-model.threshold'
              ),
            },
            {
              value: 'peak_eod_profit',
              label: t(
                'account.prop-challenge.rule.daily-loss-model.peak-eod-profit'
              ),
            },
            {
              value: 'profit_tiers',
              label: t(
                'account.prop-challenge.rule.daily-loss-model.profit-tiers'
              ),
            },
          ]}
        />
      </PropChallengeField>
      {rule.profitThresholdPercent !== undefined &&
      rule.amountAfterThreshold !== undefined ? (
        <>
          <PropChallengeField
            kind="input"
            translationKey="account.prop-challenge.rule.profit-threshold-percent"
            description={t(
              'account.prop-challenge.rule.daily-loss-threshold-help'
            )}
          >
            <DraftInput
              type="number"
              min="0.1"
              step="0.1"
              value={rule.profitThresholdPercent}
              onChange={(event) =>
                onChange({
                  ...rule,
                  profitThresholdPercent: numberValue(event.target.value),
                })
              }
              disabled={disabled}
            />
          </PropChallengeField>
          <PropChallengeField
            kind="input"
            translationKey="account.prop-challenge.rule.amount-after-threshold"
            description={t(
              'account.prop-challenge.rule.daily-loss-threshold-help'
            )}
          >
            <DraftInput
              type="number"
              min="0"
              step="100"
              value={rule.amountAfterThreshold}
              onChange={(event) =>
                onChange({
                  ...rule,
                  amountAfterThreshold: numberValue(event.target.value),
                })
              }
              disabled={disabled}
            />
          </PropChallengeField>
        </>
      ) : null}
      {rule.scaleAtBalance !== undefined &&
      rule.scaledAmountPercentOfPeakEodProfit !== undefined ? (
        <>
          <PropChallengeField
            kind="input"
            translationKey="account.prop-challenge.rule.scale-at-balance"
            description={t(
              'account.prop-challenge.rule.daily-loss-peak-eod-help'
            )}
          >
            <DraftInput
              type="number"
              min="0"
              step="100"
              value={rule.scaleAtBalance}
              onChange={(event) =>
                onChange({
                  ...rule,
                  scaleAtBalance: numberValue(event.target.value),
                })
              }
              disabled={disabled}
            />
          </PropChallengeField>
          <PropChallengeField
            kind="input"
            translationKey="account.prop-challenge.rule.scaled-percent-of-peak-eod-profit"
            description={t(
              'account.prop-challenge.rule.daily-loss-peak-eod-help'
            )}
          >
            <DraftInput
              type="number"
              min="0.1"
              max="100"
              step="0.1"
              value={rule.scaledAmountPercentOfPeakEodProfit}
              onChange={(event) =>
                onChange({
                  ...rule,
                  scaledAmountPercentOfPeakEodProfit: numberValue(
                    event.target.value
                  ),
                })
              }
              disabled={disabled}
            />
          </PropChallengeField>
        </>
      ) : null}
      {rule.lossTiers ? (
        <>
          <PropChallengeField
            kind="input"
            translationKey="account.prop-challenge.rule.loss-tiers"
            description={t('account.prop-challenge.rule.daily-loss-tiers-help')}
          >
            <DraftInput
              type="text"
              value={formatLossTiers(rule.lossTiers)}
              onChange={(event) =>
                onChange({
                  ...rule,
                  lossTiers: parseLossTiers(event.target.value),
                })
              }
              disabled={disabled}
            />
          </PropChallengeField>
          <PropChallengeField
            kind="dropdown"
            translationKey="account.prop-challenge.rule.profit-basis"
            description={t('account.prop-challenge.rule.help.profit-basis')}
          >
            <DropdownSelect
              value={rule.profitBasis ?? 'cumulative_trade_profit'}
              ariaLabel={t('account.prop-challenge.rule.profit-basis')}
              onChange={(profitBasis) =>
                onChange({
                  ...rule,
                  profitBasis:
                    profitBasis === 'current_account_profit'
                      ? 'current_account_profit'
                      : 'cumulative_trade_profit',
                })
              }
              disabled={disabled}
              options={[
                {
                  value: 'current_account_profit',
                  label: t(
                    'account.prop-challenge.rule.profit-basis.current-account'
                  ),
                },
                {
                  value: 'cumulative_trade_profit',
                  label: t(
                    'account.prop-challenge.rule.profit-basis.cumulative'
                  ),
                },
              ]}
            />
          </PropChallengeField>
        </>
      ) : null}
    </>
  );
}

function MinimumTradingDaysField({
  rule,
  disabled,
  onChange,
}: {
  rule: Extract<PropChallengeRule, { kind: 'minimum_trading_days' }>;
  disabled: boolean;
  onChange: (rule: PropChallengeRule) => void;
}) {
  return (
    <PropChallengeField
      kind="input"
      translationKey="account.prop-challenge.rule.days"
      description={t('account.prop-challenge.ledger.help.minimum_trading_days')}
    >
      <DraftInput
        type="number"
        min="0"
        step="1"
        value={rule.days === 0 ? '' : rule.days}
        onChange={(event) =>
          onChange({ ...rule, days: numberValue(event.target.value) })
        }
        disabled={disabled}
      />
    </PropChallengeField>
  );
}

function MinimumProfitableDaysFields({
  rule,
  disabled,
  onChange,
}: {
  rule: Extract<PropChallengeRule, { kind: 'minimum_profitable_days' }>;
  disabled: boolean;
  onChange: (rule: PropChallengeRule) => void;
}) {
  return (
    <>
      <PropChallengeField
        kind="input"
        translationKey="account.prop-challenge.rule.days"
        description={t(
          'account.prop-challenge.ledger.help.minimum_profitable_days'
        )}
      >
        <DraftInput
          type="number"
          min="0"
          step="1"
          value={rule.days === 0 ? '' : rule.days}
          onChange={(event) =>
            onChange({ ...rule, days: numberValue(event.target.value) })
          }
          disabled={disabled}
        />
      </PropChallengeField>
      <PropChallengeField
        kind="input"
        translationKey="account.prop-challenge.rule.minimum-daily-profit"
        description={t('account.prop-challenge.rule.help.daily-profit')}
      >
        <DraftInput
          type="number"
          min="0"
          step="50"
          value={rule.minimumDailyProfit === 0 ? '' : rule.minimumDailyProfit}
          onChange={(event) =>
            onChange({
              ...rule,
              minimumDailyProfit: numberValue(event.target.value),
            })
          }
          disabled={disabled}
        />
      </PropChallengeField>
    </>
  );
}

function ConsistencyFields({
  rule,
  disabled,
  onChange,
}: {
  rule: Extract<PropChallengeRule, { kind: 'consistency' }>;
  disabled: boolean;
  onChange: (rule: PropChallengeRule) => void;
}) {
  return (
    <>
      <PropChallengeField
        kind="dropdown"
        translationKey="account.prop-challenge.rule.comparison"
        description={t(
          rule.comparison === 'strictly_below'
            ? 'account.prop-challenge.rule.strict-help'
            : 'account.prop-challenge.ledger.help.consistency'
        )}
      >
        <DropdownSelect
          ariaLabel={t('account.prop-challenge.rule.comparison')}
          disabled={disabled}
          value={rule.comparison ?? 'inclusive'}
          onChange={(value) => {
            const next = { ...rule };
            if (value === 'strictly_below') next.comparison = value;
            else delete next.comparison;
            onChange(next);
          }}
          options={[
            { value: 'inclusive', label: '≤' },
            { value: 'strictly_below', label: '<' },
          ]}
        />
      </PropChallengeField>
      <PropChallengeField
        kind="input"
        translationKey="account.prop-challenge.rule.best-day-percent"
        description={t('account.prop-challenge.ledger.help.consistency')}
      >
        <DraftInput
          type="number"
          min="0"
          step="1"
          value={rule.maxBestDayPercent === 0 ? '' : rule.maxBestDayPercent}
          onChange={(event) =>
            onChange({
              ...rule,
              maxBestDayPercent: numberValue(event.target.value),
            })
          }
          disabled={disabled}
        />
      </PropChallengeField>
      <PropChallengeField
        kind="input"
        translationKey="account.prop-challenge.rule.consistency-cushion-percent"
        description={t('account.prop-challenge.rule.help.consistency-cushion')}
      >
        <DraftInput
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={rule.consistencyCushionPercent ?? ''}
          onChange={(event) => {
            if (event.target.value === '') {
              const nextRule = { ...rule };
              delete nextRule.consistencyCushionPercent;
              onChange(nextRule);
              return;
            }
            onChange({
              ...rule,
              consistencyCushionPercent: numberValue(event.target.value),
            });
          }}
          disabled={disabled}
        />
      </PropChallengeField>
    </>
  );
}

function RuleEditorFields({
  rule,
  startingBalance,
  disabled,
  onChange,
}: {
  rule: ExecutablePropChallengeRule;
  startingBalance: number;
  disabled: boolean;
  onChange: (rule: ExecutablePropChallengeRule) => void;
}) {
  let fields: React.ReactNode;
  switch (rule.kind) {
    case 'profit_target':
      fields = (
        <ProfitTargetFields
          rule={rule}
          startingBalance={startingBalance}
          disabled={disabled}
          onChange={onChange}
        />
      );
      break;
    case 'drawdown':
      fields = (
        <DrawdownFields rule={rule} disabled={disabled} onChange={onChange} />
      );
      break;
    case 'daily_loss_limit':
      fields = (
        <DailyLossLimitFields
          rule={rule}
          startingBalance={startingBalance}
          disabled={disabled}
          onChange={onChange}
        />
      );
      break;
    case 'daily_profit_cap':
      fields = (
        <RuleAmountField
          amount={rule.amount}
          onChange={(amount) => onChange({ ...rule, amount })}
          disabled={disabled}
          descriptionKey="account.prop-challenge.rule.help.daily-profit-cap"
        />
      );
      break;
    case 'live_review_daily_profit':
      fields = (
        <RuleAmountField
          amount={rule.amount}
          onChange={(amount) => onChange({ ...rule, amount })}
          disabled={disabled}
          descriptionKey="account.prop-challenge.rule.help.live-review"
        />
      );
      break;
    case 'minimum_trading_days':
      fields = (
        <MinimumTradingDaysField
          rule={rule}
          disabled={disabled}
          onChange={onChange}
        />
      );
      break;
    case 'minimum_profitable_days':
      fields = (
        <MinimumProfitableDaysFields
          rule={rule}
          disabled={disabled}
          onChange={onChange}
        />
      );
      break;
    case 'manual_review':
      fields = <p>{rule.reason}</p>;
      break;
    case 'consistency':
      fields = (
        <ConsistencyFields
          rule={rule}
          disabled={disabled}
          onChange={onChange}
        />
      );
      break;
  }

  return fields;
}

export function RuleEditor({
  rule,
  ordinal,
  currencyCode,
  startingBalance,
  expanded,
  disabled,
  toggleRef,
  onToggle,
  onChange,
  onRemove,
}: {
  rule: ExecutablePropChallengeRule;
  ordinal: number;
  currencyCode: string;
  startingBalance: number;
  expanded: boolean;
  disabled: boolean;
  toggleRef: (element: HTMLButtonElement | null) => void;
  onToggle: () => void;
  onChange: (rule: ExecutablePropChallengeRule) => void;
  onRemove: () => void;
}) {
  const contentId = useId();
  const titleId = useId();
  const summaryId = useId();
  const ordinalId = useId();
  const descriptionId = useId();
  const { formatValue } = useDisplayFormatter();
  const title = t(`account.prop-challenge.rule.${rule.kind}`);
  const description = propChallengeRuleDescription(rule);
  const summary = getRuleSummary(rule, currencyCode, formatValue);
  const accessibleIdentity = `${title} (${ordinal}) — ${summary}`;
  const fields = (
    <RuleEditorFields
      rule={rule}
      startingBalance={startingBalance}
      disabled={disabled}
      onChange={onChange}
    />
  );

  return (
    <div className="journalit-prop-challenge-rule">
      <div className="journalit-prop-challenge-rule-summary-row">
        <button
          ref={toggleRef}
          type="button"
          className="journalit-prop-challenge-rule-toggle"
          
          
          
          aria-labelledby={`${titleId} ${ordinalId} ${summaryId}`}
          aria-expanded={expanded}
          aria-controls={contentId}
          aria-describedby={descriptionId}
          onClick={onToggle}
        >
          <Tooltip
            content={
              <HelpTooltipContent title={title} description={description} />
            }
            delay={200}
            preferredPosition="bottom"
            triggerClassName="journalit-prop-challenge-rule-help"
          >
            <strong id={titleId}>{title}</strong>
          </Tooltip>
          <span id={descriptionId} className="journalit-sr-only">
            {description}
          </span>
          <span id={ordinalId} className="journalit-sr-only">
            ({ordinal})
          </span>
          <span
            id={summaryId}
            className="journalit-prop-challenge-rule-summary"
          >
            {summary}
          </span>
          {expanded ? (
            <ChevronDown size={16} aria-hidden="true" />
          ) : (
            <ChevronRight size={16} aria-hidden="true" />
          )}
        </button>
        <NoTooltipButton
          className="journalit-prop-challenge-rule-remove"
          label={`${t('button.remove')}: ${accessibleIdentity}`}
          onClick={onRemove}
          disabled={disabled}
        >
          <Trash2 size={16} aria-hidden="true" />
        </NoTooltipButton>
      </div>
      {expanded && (
        <div
          id={contentId}
          className="journalit-prop-challenge-rule-fields"
          role="region"
          aria-labelledby={`${titleId} ${ordinalId} ${summaryId}`}
        >
          {fields}
        </div>
      )}
    </div>
  );
}
