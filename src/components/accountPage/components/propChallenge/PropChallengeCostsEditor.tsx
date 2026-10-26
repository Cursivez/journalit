import React from 'react';
import { DraftInput } from '../../../ui/DraftInput';
import { FastDateTimeInput } from '../../../core/FastDateTimeInput';
import { t } from '../../../../lang/helpers';
import {
  addPropChallengeCost,
  createPropChallengeCost,
  removePropChallengeCost,
  updatePropChallengeCost,
} from '../../../../services/propChallenge/PropChallengeConfig';
import type {
  PropChallengeConfig,
  PropChallengeCost,
} from '../../../../services/propChallenge/types';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { Plus, Trash2 } from '../../../shared/icons/ObsidianIcon';
import { Button } from '../../../ui/Button';
import { numberValue } from './editorOptions';

interface Props {
  monthlyCostField: React.ReactNode;
  value: PropChallengeConfig;
  disabled: boolean;
  onChange: (value: PropChallengeConfig) => void;
}

const COST_KINDS: PropChallengeCost['kind'][] = [
  'purchase',
  'reset',
  'activation',
  'other',
];

function parseCostKind(value: string): PropChallengeCost['kind'] {
  switch (value) {
    case 'purchase':
    case 'reset':
    case 'activation':
    case 'other':
      return value;
    default:
      throw new Error(`Unexpected prop challenge cost kind: ${value}`);
  }
}

function parseCostDate(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00`);
}

function formatCostDate(value: Date | string | undefined): string | undefined {
  if (!value) return undefined;
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return undefined;
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function PropChallengeCostsEditor({
  monthlyCostField,
  value,
  disabled,
  onChange,
}: Props) {
  const costs = value.oneTimeCosts ?? [];
  return (
    <div className="journalit-prop-challenge-costs">
      <strong className="journalit-prop-challenge-costs-title">
        {t('account.prop-challenge.costs.section-title')}
      </strong>
      {monthlyCostField}
      <div className="journalit-prop-challenge-costs-heading">
        <div className="journalit-prop-challenge-costs-heading-copy">
          <strong>{t('account.prop-challenge.costs.title')}</strong>
          <span>{t('account.prop-challenge.costs.description')}</span>
        </div>
        <Button
          size="small"
          className="journalit-prop-challenge-add-cost"
          disabled={disabled}
          onClick={() =>
            onChange(addPropChallengeCost(value, createPropChallengeCost()))
          }
        >
          <Plus size={15} aria-hidden="true" />
          {t('account.prop-challenge.costs.add')}
        </Button>
      </div>
      {costs.length === 0 ? (
        <div className="journalit-prop-challenge-costs-empty">
          {t('account.prop-challenge.costs.empty')}
        </div>
      ) : (
        <div className="journalit-prop-challenge-costs-columns">
          <span>{t('account.prop-challenge.costs.kind')}</span>
          <span>{t('account.prop-challenge.costs.date')}</span>
          <span>{t('account.prop-challenge.costs.amount')}</span>
          <span>{t('account.prop-challenge.costs.note')}</span>
          <span aria-hidden="true" />
        </div>
      )}
      {costs.map((cost) => (
        <div className="journalit-prop-challenge-cost" key={cost.id}>
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.costs.kind')}</span>
            <DropdownSelect
              value={cost.kind}
              disabled={disabled}
              onChange={(kind) =>
                onChange(
                  updatePropChallengeCost(value, {
                    ...cost,
                    kind: parseCostKind(kind),
                  })
                )
              }
              ariaLabel={t('account.prop-challenge.costs.kind')}
              menuWidth="content"
              options={COST_KINDS.map((kind) => ({
                value: kind,
                label: t(`account.prop-challenge.costs.kind.${kind}`),
              }))}
            />
          </label>
          <div className="journalit-prop-challenge-field journalit-prop-challenge-cost-date-field">
            <span>{t('account.prop-challenge.costs.date')}</span>
            <FastDateTimeInput
              value={parseCostDate(cost.date)}
              disabled={disabled}
              className="journalit-prop-challenge-cost-date-picker"
              onChange={(date) => {
                const nextDate = formatCostDate(date);
                if (!nextDate) return;
                onChange(
                  updatePropChallengeCost(value, {
                    ...cost,
                    date: nextDate,
                  })
                );
              }}
            />
          </div>
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.costs.amount')}</span>
            <DraftInput
              type="number"
              min="0"
              step="0.01"
              value={cost.amount === 0 ? '' : cost.amount}
              placeholder="0"
              disabled={disabled}
              onChange={(event) =>
                onChange(
                  updatePropChallengeCost(value, {
                    ...cost,
                    amount: Math.max(0, numberValue(event.target.value)),
                  })
                )
              }
            />
          </label>
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.costs.note')}</span>
            <input
              value={cost.note ?? ''}
              disabled={disabled}
              onChange={(event) =>
                onChange(
                  updatePropChallengeCost(value, {
                    ...cost,
                    note: event.target.value || undefined,
                  })
                )
              }
            />
          </label>
          <button
            type="button"
            className="journalit-prop-challenge-cost-remove"
            aria-label={`${t('button.remove')}: ${t(`account.prop-challenge.costs.kind.${cost.kind}`)}`}
            disabled={disabled}
            onClick={() => onChange(removePropChallengeCost(value, cost.id))}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
