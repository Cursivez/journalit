import React from 'react';
import { t } from '../../../../lang/helpers';
import type { PropChallengeRule } from '../../../../services/propChallenge/types';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import Checkbox from '../../../ui/Checkbox';
import { DraftInput } from '../../../ui/DraftInput';
import { numberValue } from './editorOptions';
import { PropChallengeField } from './PropChallengeField';

export function RuleAmountField({
  amount,
  onChange,
  disabled,
  descriptionKey,
}: {
  amount: number;
  onChange: (amount: number) => void;
  disabled: boolean;
  descriptionKey: Parameters<typeof t>[0];
}) {
  return (
    <PropChallengeField
      kind="input"
      translationKey="account.prop-challenge.rule.amount"
      description={t(descriptionKey)}
    >
      <DraftInput
        type="number"
        min="0"
        step="100"
        value={amount === 0 ? '' : amount}
        onChange={(event) => onChange(numberValue(event.target.value))}
        disabled={disabled}
      />
    </PropChallengeField>
  );
}

export function ProfitTargetFields({
  rule,
  disabled,
  onChange,
}: {
  rule: Extract<PropChallengeRule, { kind: 'profit_target' }>;
  disabled: boolean;
  onChange: (rule: PropChallengeRule) => void;
}) {
  return (
    <>
      <RuleAmountField
        amount={rule.amount}
        onChange={(amount) => onChange({ ...rule, amount })}
        disabled={disabled}
        descriptionKey="account.prop-challenge.rule.help.target-amount"
      />
      <PropChallengeField
        kind="dropdown"
        translationKey="account.prop-challenge.rule.target-type"
        description={t('account.prop-challenge.rule.help.target-amount')}
      >
        <DropdownSelect
          value={rule.targetType}
          ariaLabel={t('account.prop-challenge.rule.target-type')}
          onChange={(targetType) =>
            onChange({
              ...rule,
              targetType:
                targetType === 'percentage' ? 'percentage' : 'absolute',
              ...(targetType === 'percentage'
                ? { creditWithdrawals: undefined }
                : {}),
            })
          }
          disabled={disabled}
          options={[
            {
              value: 'absolute',
              label: t('account.profit-target.type.absolute'),
            },
            {
              value: 'percentage',
              label: t('account.profit-target.type.percentage'),
            },
          ]}
        />
      </PropChallengeField>
      {rule.targetType === 'absolute' && (
        <PropChallengeField
          kind="checkbox"
          translationKey="account.prop-challenge.rule.credit-withdrawals"
          description={t('account.prop-challenge.rule.help.credit-withdrawals')}
        >
          <Checkbox
            checked={rule.creditWithdrawals ?? false}
            onChange={(creditWithdrawals) =>
              onChange({
                ...rule,
                creditWithdrawals: creditWithdrawals || undefined,
              })
            }
            disabled={disabled}
          />
        </PropChallengeField>
      )}
    </>
  );
}

export function DrawdownFields({
  rule,
  disabled,
  onChange,
}: {
  rule: Extract<PropChallengeRule, { kind: 'drawdown' }>;
  disabled: boolean;
  onChange: (rule: PropChallengeRule) => void;
}) {
  return (
    <>
      <RuleAmountField
        amount={rule.amount}
        onChange={(amount) => onChange({ ...rule, amount })}
        disabled={disabled}
        descriptionKey="account.prop-challenge.rule.help.drawdown-amount"
      />
      <PropChallengeField
        kind="dropdown"
        translationKey="account.prop-challenge.rule.drawdown-mode"
        description={t('account.prop-challenge.rule.help.drawdown-mode')}
      >
        <DropdownSelect
          value={rule.mode}
          ariaLabel={t('account.prop-challenge.rule.drawdown-mode')}
          onChange={(mode) => {
            if (
              mode === 'static' ||
              mode === 'eod_trailing' ||
              mode === 'intraday_trailing'
            ) {
              onChange(
                mode === 'static'
                  ? { ...rule, mode, lockAtBalance: undefined }
                  : { ...rule, mode }
              );
            }
          }}
          disabled={disabled}
          options={[
            {
              value: 'static',
              label: t('account.prop-challenge.drawdown.static'),
            },
            {
              value: 'eod_trailing',
              label: t('account.prop-challenge.drawdown.eod-trailing'),
            },
            {
              value: 'intraday_trailing',
              label: t('account.prop-challenge.drawdown.intraday-trailing'),
            },
          ]}
        />
      </PropChallengeField>
      {rule.mode !== 'static' && (
        <PropChallengeField
          kind="input"
          translationKey="account.prop-challenge.rule.lock-at-balance"
          description={t('account.prop-challenge.rule.help.lock-balance')}
        >
          <DraftInput
            type="number"
            min="0"
            step="100"
            value={rule.lockAtBalance ?? ''}
            onChange={(event) =>
              onChange({
                ...rule,
                lockAtBalance: numberValue(event.target.value),
              })
            }
            disabled={disabled}
          />
        </PropChallengeField>
      )}
    </>
  );
}
