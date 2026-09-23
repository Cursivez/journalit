

import React, { useMemo, useState } from 'react';
import { Notice } from 'obsidian';
import { useAccountPageData } from '../../context/AccountPageDataContext';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { t } from '../../../../lang/helpers';
import { savePropChallengeConfig } from '../../../../services/propChallenge/PropChallengePersistence';
import type {
  PropChallengeConfig,
  PropChallengePayoutPlan,
} from '../../../../services/propChallenge/types';
import { Button } from '../../../ui/Button';
import { CollapsibleSection } from '../../../shared/CollapsibleSection';
import { DropdownSelect } from '../../../shared/DropdownSelect';

type WithdrawalKind = 'full' | 'percent' | 'amount';


function withdrawalValueIsValid(form: {
  kind: WithdrawalKind;
  value: string;
}): boolean {
  if (form.kind === 'full') return true;
  const value = Number.parseFloat(form.value);
  if (!Number.isFinite(value) || value <= 0) return false;
  return form.kind === 'percent' ? value <= 100 : true;
}

function planFromForm(form: {
  minimum: string;
  kind: WithdrawalKind;
  value: string;
}): PropChallengePayoutPlan | undefined {
  const plan: PropChallengePayoutPlan = {};
  const minimum = Number.parseFloat(form.minimum);
  if (Number.isFinite(minimum) && minimum > 0)
    plan.notifyMinimumAmount = minimum;
  const value = Number.parseFloat(form.value);
  if (form.kind === 'percent' && value > 0 && value <= 100)
    plan.withdrawal = { kind: 'percent', value };
  else if (form.kind === 'amount' && value > 0)
    plan.withdrawal = { kind: 'amount', value };
  return Object.keys(plan).length ? plan : undefined;
}

export const PropChallengePayoutPlanEditor: React.FC<{
  challenge: PropChallengeConfig;
  currency: string;
}> = ({ challenge, currency }) => {
  const { accountPageData } = useAccountPageData();
  const plugin = usePlugin();
  const { formatValue } = useDisplayFormatter();
  const plan = challenge.payoutPlan;
  const [form, setForm] = useState<{
    minimum: string;
    kind: WithdrawalKind;
    value: string;
  }>({
    minimum: plan?.notifyMinimumAmount?.toString() ?? '',
    kind: plan?.withdrawal?.kind ?? 'full',
    value: plan?.withdrawal?.value.toString() ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [valueError, setValueError] = useState('');

  const kindOptions = useMemo(
    (): Array<{ value: WithdrawalKind; label: string }> => [
      { value: 'full', label: t('account.prop-challenge.payout.plan.full') },
      {
        value: 'percent',
        label: t('account.prop-challenge.payout.plan.percent'),
      },
      {
        value: 'amount',
        label: t('account.prop-challenge.payout.plan.amount'),
      },
    ],
    []
  );

  if (!plugin?.accountPageService || !accountPageData) return null;
  const accountPageService = plugin.accountPageService;

  const save = async () => {
    if (!withdrawalValueIsValid(form)) {
      setValueError(
        form.kind === 'percent'
          ? t('account.prop-challenge.payout.plan.percent-invalid')
          : t('account.prop-challenge.payout.plan.amount-invalid')
      );
      return;
    }
    setValueError('');
    setSaving(true);
    try {
      const nextPlan = planFromForm(form);
      const rest: PropChallengeConfig = { ...challenge };
      delete rest.payoutPlan;
      await savePropChallengeConfig({
        accountPageService,
        accountName: accountPageData.account.name,
        accountId: accountPageData.account.accountId,
        config: nextPlan ? { ...rest, payoutPlan: nextPlan } : rest,
        expectedConfig: challenge,
      });
      new Notice(t('account.prop-challenge.payout.plan.saved'));
    } catch (error) {
      console.error('Failed to save payout plan:', error);
      new Notice(t('account.prop-challenge.actions.error'));
    } finally {
      setSaving(false);
    }
  };

  const money = (value: number) =>
    formatValue({
      kind: 'money',
      value,
      currencyCode: currency,
      showCents: false,
    });
  const planSummary = [
    plan?.notifyMinimumAmount !== undefined
      ? t('account.prop-challenge.payout.plan.summary-notify', {
          amount: money(plan.notifyMinimumAmount),
        })
      : undefined,
    plan?.withdrawal?.kind === 'percent'
      ? t('account.prop-challenge.payout.plan.summary-percent', {
          percent: String(plan.withdrawal.value),
        })
      : plan?.withdrawal?.kind === 'amount'
        ? t('account.prop-challenge.payout.plan.summary-amount', {
            amount: money(plan.withdrawal.value),
          })
        : plan
          ? t('account.prop-challenge.payout.plan.summary-full')
          : undefined,
  ].filter((part): part is string => Boolean(part));
  const planTitle = [
    t('account.prop-challenge.payout.plan.title'),
    ...planSummary,
  ].join(' · ');

  return (
    <CollapsibleSection
      title={planTitle}
      defaultOpen={false}
      className="journalit-prop-payout-plan"
    >
      <div className="journalit-prop-payout-plan__grid">
        <label>
          <span>
            {t('account.prop-challenge.payout.plan.notify-minimum', {
              currency,
            })}
          </span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.minimum}
            placeholder="0"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                minimum: event.target.value,
              }))
            }
          />
        </label>
        <label>
          <span>{t('account.prop-challenge.payout.plan.withdrawal')}</span>
          <DropdownSelect
            ariaLabel={t('account.prop-challenge.payout.plan.withdrawal')}
            value={form.kind}
            options={kindOptions}
            onChange={(kind) => {
              setValueError('');
              setForm((current) => ({
                ...current,
                kind: kind === 'percent' || kind === 'amount' ? kind : 'full',
              }));
            }}
          />
        </label>
        {form.kind !== 'full' && (
          <label>
            <span>
              {form.kind === 'percent'
                ? t('account.prop-challenge.payout.plan.percent-value')
                : t('account.prop-challenge.payout.plan.amount-value', {
                    currency,
                  })}
            </span>
            <input
              type="number"
              min={0}
              max={form.kind === 'percent' ? 100 : undefined}
              step={form.kind === 'percent' ? '1' : '0.01'}
              value={form.value}
              aria-invalid={valueError ? true : undefined}
              onChange={(event) => {
                setValueError('');
                setForm((current) => ({
                  ...current,
                  value: event.target.value,
                }));
              }}
            />
            {valueError && (
              <span className="journalit-prop-payout-plan__error" role="alert">
                {valueError}
              </span>
            )}
          </label>
        )}
      </div>
      <div className="journalit-prop-payout-plan__actions">
        <Button
          variant="secondary"
          size="small"
          disabled={saving}
          onClick={() => void save()}
        >
          {t('account.prop-challenge.payout.plan.save')}
        </Button>
      </div>
    </CollapsibleSection>
  );
};
