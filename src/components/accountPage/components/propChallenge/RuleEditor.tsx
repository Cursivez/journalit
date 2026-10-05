import React, { useId } from 'react';
import { DraftInput } from '../../../ui/DraftInput';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { t } from '../../../../lang/helpers';
import type { PropChallengeRule } from '../../../../services/propChallenge/types';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import {
  ChevronDown,
  ChevronRight,
  Trash2,
} from '../../../shared/icons/ObsidianIcon';
import Checkbox from '../../../ui/Checkbox';
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

const formatPositionTiers = (
  tiers: Array<{ profit: number; maxContracts: number }>
): string =>
  tiers.map((tier) => `${tier.profit}:${tier.maxContracts}`).join(', ');

const parsePositionTiers = (
  value: string
): Array<{ profit: number; maxContracts: number }> =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .flatMap((entry) => {
      const [profitValue, contractsValue] = entry.split(':');
      const profit = Number.parseFloat(profitValue ?? '');
      const maxContracts = Number.parseFloat(contractsValue ?? '');
      return Number.isFinite(profit) && Number.isFinite(maxContracts)
        ? [{ profit, maxContracts }]
        : [];
    });

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
  rule: PropChallengeRule,
  currencyCode: string,
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue']
): string {
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
    case 'consistency':
      return `${t('account.prop-challenge.rule.best-day-percent')}: ${formatValue(
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
    case 'max_position_size':
      return 'maxContracts' in rule
        ? `${t('account.prop-challenge.rule.max-contracts')}: ${formatValue({
            kind: 'positionSize',
            value: rule.maxContracts,
            precision: 0,
          })}`
        : 'profitTiers' in rule
          ? `${formatValue({
              kind: 'positionSize',
              value: rule.initialContracts,
              precision: 0,
            })} → ${formatValue({
              kind: 'positionSize',
              value:
                rule.profitTiers[rule.profitTiers.length - 1]?.maxContracts ??
                rule.initialContracts,
              precision: 0,
            })}`
          : rule.maximumContracts === undefined
            ? `${formatValue({
                kind: 'positionSize',
                value: rule.initialContracts,
                precision: 0,
              })} · ${t(
                'account.prop-challenge.rule.position-limit-model.eod-profit'
              )}`
            : `${formatValue({
                kind: 'positionSize',
                value: rule.initialContracts,
                precision: 0,
              })} → ${formatValue({
                kind: 'positionSize',
                value: rule.maximumContracts,
                precision: 0,
              })}`;
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
            translationKey="account.prop-challenge.rule.position-profit-basis"
            description={t('account.prop-challenge.rule.help.profit-basis')}
          >
            <DropdownSelect
              value={rule.profitBasis ?? 'cumulative_trade_profit'}
              ariaLabel={t('account.prop-challenge.rule.position-profit-basis')}
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
                    'account.prop-challenge.rule.position-profit-basis.current-account'
                  ),
                },
                {
                  value: 'cumulative_trade_profit',
                  label: t(
                    'account.prop-challenge.rule.position-profit-basis.cumulative'
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

function MaxPositionSizeFields({
  rule,
  startingBalance,
  disabled,
  onChange,
}: {
  rule: Extract<PropChallengeRule, { kind: 'max_position_size' }>;
  startingBalance: number;
  disabled: boolean;
  onChange: (rule: PropChallengeRule) => void;
}) {
  return (
    <>
      <PropChallengeField
        kind="dropdown"
        translationKey="account.prop-challenge.rule.position-limit-model"
        description={t('account.prop-challenge.rule.help.position-model')}
      >
        <DropdownSelect
          ariaLabel={t('account.prop-challenge.rule.position-limit-model')}
          value={
            'maxContracts' in rule
              ? 'fixed'
              : 'profitTiers' in rule
                ? 'eod_profit_tiers'
                : 'eod_profit_steps'
          }
          onChange={(kind) => {
            const initialContracts =
              'initialContracts' in rule ? rule.initialContracts : 1;
            const profitBasis =
              'maxContracts' in rule ? undefined : rule.profitBasis;
            const base = {
              id: rule.id,
              enabled: rule.enabled,
              kind: 'max_position_size' as const,
              ...(rule.microsPerContract
                ? { microsPerContract: rule.microsPerContract }
                : {}),
            };
            if (kind === 'fixed') {
              onChange({
                ...base,
                maxContracts: 'maxContracts' in rule ? rule.maxContracts : 1,
              });
              return;
            }
            if (kind === 'eod_profit_tiers') {
              onChange({
                ...base,
                initialContracts,
                profitTiers: [
                  { profit: 1_500, maxContracts: initialContracts + 1 },
                ],
                ...(profitBasis ? { profitBasis } : {}),
              });
              return;
            }
            onChange({
              ...base,
              initialContracts,
              profitPerAdditionalContract: 2_000,
              ...(profitBasis ? { profitBasis } : {}),
              ...('maxContracts' in rule && rule.maxContracts > 0
                ? { maximumContracts: rule.maxContracts }
                : {}),
            });
          }}
          disabled={disabled}
          options={[
            {
              value: 'fixed',
              label: t(
                'account.prop-challenge.rule.position-limit-model.fixed'
              ),
            },
            {
              value: 'eod_profit_steps',
              label: t(
                'account.prop-challenge.rule.position-limit-model.eod-profit'
              ),
            },
            {
              value: 'eod_profit_tiers',
              label: t(
                'account.prop-challenge.rule.position-limit-model.eod-profit-tiers'
              ),
            },
          ]}
        />
      </PropChallengeField>
      {'maxContracts' in rule ? (
        <PropChallengeField
          kind="input"
          translationKey="account.prop-challenge.rule.max-contracts"
          description={t('account.prop-challenge.rule.help.max-contracts')}
        >
          <DraftInput
            type="number"
            min="0"
            step="1"
            value={rule.maxContracts === 0 ? '' : rule.maxContracts}
            onChange={(event) =>
              onChange({
                ...rule,
                maxContracts: numberValue(event.target.value),
              })
            }
            disabled={disabled}
          />
        </PropChallengeField>
      ) : (
        <>
          <PropChallengeField
            kind="dropdown"
            translationKey="account.prop-challenge.rule.position-profit-basis"
            description={t('account.prop-challenge.rule.help.profit-basis')}
          >
            <DropdownSelect
              value={rule.profitBasis ?? 'cumulative_trade_profit'}
              ariaLabel={t('account.prop-challenge.rule.position-profit-basis')}
              onChange={(profitBasis) => {
                if (
                  profitBasis === 'cumulative_trade_profit' ||
                  profitBasis === 'current_account_profit'
                ) {
                  onChange({ ...rule, profitBasis });
                }
              }}
              disabled={disabled}
              options={[
                {
                  value: 'cumulative_trade_profit',
                  label: t(
                    'account.prop-challenge.rule.position-profit-basis.cumulative'
                  ),
                },
                {
                  value: 'current_account_profit',
                  label: t(
                    'account.prop-challenge.rule.position-profit-basis.current-account'
                  ),
                },
              ]}
            />
          </PropChallengeField>
          <PropChallengeField
            kind="input"
            translationKey="account.prop-challenge.rule.initial-contracts"
            description={t(
              'account.prop-challenge.rule.help.initial-contracts'
            )}
          >
            <DraftInput
              type="number"
              min="1"
              step="1"
              value={rule.initialContracts}
              onChange={(event) =>
                onChange({
                  ...rule,
                  initialContracts: numberValue(event.target.value),
                })
              }
              disabled={disabled}
            />
          </PropChallengeField>
          {'profitTiers' in rule ? (
            <>
              <PropChallengeField
                kind="input"
                translationKey="account.prop-challenge.rule.position-tiers"
                description={t(
                  'account.prop-challenge.rule.position-tiers-help'
                )}
              >
                <DraftInput
                  value={formatPositionTiers(rule.profitTiers)}
                  onChange={(event) =>
                    onChange({
                      ...rule,
                      profitTiers: parsePositionTiers(event.target.value),
                    })
                  }
                  disabled={disabled}
                />
              </PropChallengeField>
            </>
          ) : (
            <>
              <PropChallengeField
                kind="input"
                translationKey="account.prop-challenge.rule.profit-per-contract"
                description={t(
                  'account.prop-challenge.rule.position-scaling-help'
                )}
              >
                <DraftInput
                  type="number"
                  min="1"
                  step="500"
                  value={rule.profitPerAdditionalContract}
                  onChange={(event) =>
                    onChange({
                      ...rule,
                      profitPerAdditionalContract: numberValue(
                        event.target.value
                      ),
                    })
                  }
                  disabled={disabled}
                />
              </PropChallengeField>
              <PropChallengeField
                kind="input"
                translationKey="account.prop-challenge.rule.maximum-contracts"
                description={t(
                  'account.prop-challenge.rule.help.maximum-contracts'
                )}
              >
                <DraftInput
                  type="number"
                  min="1"
                  step="1"
                  value={rule.maximumContracts ?? ''}
                  onChange={(event) => {
                    if (event.target.value.trim() === '') {
                      const withoutMaximum = { ...rule };
                      delete withoutMaximum.maximumContracts;
                      onChange(withoutMaximum);
                      return;
                    }
                    onChange({
                      ...rule,
                      maximumContracts: numberValue(event.target.value),
                    });
                  }}
                  disabled={disabled}
                />
              </PropChallengeField>
            </>
          )}
        </>
      )}
      <PropChallengeField
        kind="checkbox"
        translationKey="account.prop-challenge.rule.micros-per-contract"
        description={t('account.prop-challenge.rule.micros-per-contract-help')}
      >
        <Checkbox
          checked={rule.microsPerContract === 10}
          onChange={(checked) => {
            const next = { ...rule };
            if (checked) next.microsPerContract = 10;
            else delete next.microsPerContract;
            onChange(next);
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
  rule: PropChallengeRule;
  startingBalance: number;
  disabled: boolean;
  onChange: (rule: PropChallengeRule) => void;
}) {
  let fields: React.ReactNode;
  switch (rule.kind) {
    case 'profit_target':
      fields = (
        <ProfitTargetFields
          rule={rule}
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
        <PropChallengeField
          kind="input"
          translationKey="account.prop-challenge.rule.days"
          description={t(
            'account.prop-challenge.ledger.help.minimum_trading_days'
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
      );
      break;
    case 'minimum_profitable_days':
      fields = (
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
              value={
                rule.minimumDailyProfit === 0 ? '' : rule.minimumDailyProfit
              }
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
      break;
    case 'consistency':
      fields = (
        <>
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
            description={t(
              'account.prop-challenge.rule.help.consistency-cushion'
            )}
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
      break;
    case 'max_position_size':
      fields = (
        <MaxPositionSizeFields
          rule={rule}
          startingBalance={startingBalance}
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
  rule: PropChallengeRule;
  ordinal: number;
  currencyCode: string;
  startingBalance: number;
  expanded: boolean;
  disabled: boolean;
  toggleRef: (element: HTMLButtonElement | null) => void;
  onToggle: () => void;
  onChange: (rule: PropChallengeRule) => void;
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
