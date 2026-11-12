import React from 'react';
import { DraftInput } from '../../../ui/DraftInput';
import { FastDateTimeInput } from '../../../core/FastDateTimeInput';
import { t } from '../../../../lang/helpers';
import {
  addPropChallengePriorPayout,
  createPropChallengePriorPayout,
  removePropChallengePriorPayout,
  updatePropChallengePriorPayout,
} from '../../../../services/propChallenge/PropChallengeConfig';
import type { PropChallengeConfig } from '../../../../services/propChallenge/types';
import { Trash2 } from '../../../shared/icons/ObsidianIcon';
import { numberValue } from './editorOptions';
import {
  DatedListHeading,
  formatCostDate,
  parseCostDate,
} from './PropChallengeCostsEditor';

interface Props {
  value: PropChallengeConfig;
  disabled: boolean;
  onChange: (value: PropChallengeConfig) => void;
}


export function PropChallengePriorPayoutsEditor({
  value,
  disabled,
  onChange,
}: Props) {
  const payouts = value.priorPayouts ?? [];
  return (
    <div className="journalit-prop-challenge-costs journalit-prop-challenge-prior-payouts">
      <DatedListHeading
        title={t('account.prop-challenge.prior-payouts.title')}
        description={t('account.prop-challenge.prior-payouts.description')}
        addLabel={t('account.prop-challenge.prior-payouts.add')}
        disabled={disabled}
        onAdd={() =>
          onChange(
            addPropChallengePriorPayout(value, createPropChallengePriorPayout())
          )
        }
      />
      {payouts.length === 0 ? (
        <div className="journalit-prop-challenge-costs-empty">
          {t('account.prop-challenge.prior-payouts.empty')}
        </div>
      ) : (
        <div className="journalit-prop-challenge-costs-columns journalit-prop-challenge-prior-payout">
          <span>{t('account.prop-challenge.costs.date')}</span>
          <span>{t('account.prop-challenge.prior-payouts.amount')}</span>
          <span>{t('account.prop-challenge.costs.note')}</span>
          <span aria-hidden="true" />
        </div>
      )}
      {payouts.map((payout) => (
        <div
          className="journalit-prop-challenge-cost journalit-prop-challenge-prior-payout"
          key={payout.id}
        >
          <div className="journalit-prop-challenge-field journalit-prop-challenge-cost-date-field">
            <span>{t('account.prop-challenge.costs.date')}</span>
            <FastDateTimeInput
              value={parseCostDate(payout.date)}
              disabled={disabled}
              className="journalit-prop-challenge-cost-date-picker"
              onChange={(date) => {
                const nextDate = formatCostDate(date);
                if (!nextDate) return;
                onChange(
                  updatePropChallengePriorPayout(value, {
                    ...payout,
                    date: nextDate,
                  })
                );
              }}
            />
          </div>
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.prior-payouts.amount')}</span>
            <DraftInput
              type="number"
              min="0"
              step="0.01"
              value={payout.amount === 0 ? '' : payout.amount}
              placeholder="0"
              disabled={disabled}
              onChange={(event) =>
                onChange(
                  updatePropChallengePriorPayout(value, {
                    ...payout,
                    amount: Math.max(0, numberValue(event.target.value)),
                  })
                )
              }
            />
          </label>
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.costs.note')}</span>
            <input
              value={payout.note ?? ''}
              disabled={disabled}
              onChange={(event) =>
                onChange(
                  updatePropChallengePriorPayout(value, {
                    ...payout,
                    note: event.target.value || undefined,
                  })
                )
              }
            />
          </label>
          <button
            type="button"
            className="journalit-prop-challenge-cost-remove journalit-icon-button"
            aria-label={`${t('button.remove')}: ${payout.date}`}
            disabled={disabled}
            onClick={() =>
              onChange(removePropChallengePriorPayout(value, payout.id))
            }
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
