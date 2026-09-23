import React, { useId, useState } from 'react';
import { t } from '../../../../lang/helpers';
import type {
  PropChallengeMaximumPayoutOutcome,
  PropChallengePayoutAftermath,
  PropChallengePayoutAvailability,
  PropChallengePayoutCycle,
  PropChallengePayoutMaximum,
  PropChallengePayoutPolicy,
  PropChallengeProfitSplit,
  PropChallengeWeekday,
} from '../../../../services/propChallenge/types';
import { isSupportedTimeZone } from '../../../../services/propChallenge/normalization';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import {
  ChevronDown,
  ChevronRight,
  Trash2,
} from '../../../shared/icons/ObsidianIcon';
import { NoTooltipButton } from '../../../ui/NoTooltipButton';
import Checkbox from '../../../ui/Checkbox';
import { numberValue } from './editorOptions';

const optionalNumberValue = (value: string): number | undefined =>
  value === '' ? undefined : numberValue(value);

const positiveNumberValue = (value: string): number =>
  Math.max(1, numberValue(value));

const optionalPositiveNumberValue = (value: string): number | undefined => {
  const parsed = optionalNumberValue(value);
  return parsed === undefined ? undefined : Math.max(1, parsed);
};

const percentageValue = (value: string): number =>
  Math.min(100, positiveNumberValue(value));

const PAYOUT_WEEKDAYS: PropChallengeWeekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

function isMaximumPayoutOutcome(
  value: string
): value is PropChallengeMaximumPayoutOutcome {
  return (
    value === 'conclude_account' ||
    value === 'promote_to_next_phase' ||
    value === 'eligible_for_live_review'
  );
}

function createCycle(kind: string): PropChallengePayoutCycle {
  switch (kind) {
    case 'trading_days':
      return { kind, days: 1 };
    case 'qualifying_days':
      return { kind, days: 1, minimumDailyProfit: 1 };
    case 'calendar_days':
      return { kind, days: 1, anchor: 'phase_start' };
    default:
      return { kind: 'none' };
  }
}

function createAvailability(
  kind: string,
  startingBalance: number
): PropChallengePayoutAvailability {
  return kind === 'profit_above_balance_floor'
    ? { kind, balanceFloor: startingBalance, requestPercent: 100 }
    : { kind: 'profit_above_starting_balance', requestPercent: 100 };
}

function createMaximum(kind: string): PropChallengePayoutMaximum {
  switch (kind) {
    case 'fixed':
      return { kind, amount: 1_000 };
    case 'first_fixed_then_none':
      return { kind, amount: 1_000 };
    case 'schedule':
      return { kind, amounts: [1_000] };
    case 'cycle_profit_percent':
      return { kind, percent: 20 };
    default:
      return { kind: 'none' };
  }
}

function createProfitSplit(kind: string): PropChallengeProfitSplit {
  switch (kind) {
    case 'cumulative_payout_threshold':
      return {
        kind,
        initialPercent: 100,
        thresholdAmount: 10_000,
        thereafterPercent: 90,
      };
    case 'account_profit_threshold':
      return {
        kind,
        belowPercent: 50,
        thresholdProfit: 4_000,
        atOrAbovePercent: 80,
      };
    default:
      return { kind: 'fixed', percent: 100 };
  }
}

function createAftermath(
  kind: string,
  startingBalance: number,
  resetCycle: boolean,
  maximumPayoutOutcome: PropChallengeMaximumPayoutOutcome | undefined
): PropChallengePayoutAftermath {
  const outcome = maximumPayoutOutcome ? { maximumPayoutOutcome } : {};
  switch (kind) {
    case 'lock_at_balance':
      return {
        balanceAction: 'deduct_request',
        drawdownAction: 'lock_at_balance',
        drawdownFloor: startingBalance,
        resetCycle,
        ...outcome,
      };
    case 'reset_from_starting_balance':
      return {
        balanceAction: 'reset_to_starting_balance',
        drawdownAction: 'reset_from_starting_balance',
        resetCycle,
        ...outcome,
      };
    default:
      return {
        balanceAction: 'deduct_request',
        drawdownAction: 'unchanged',
        resetCycle,
        ...outcome,
      };
  }
}

function parseSchedule(value: string): number[] {
  const amounts = value
    .split(',')
    .map((amount) => amount.trim())
    .filter((amount) => amount.length > 0)
    .map(positiveNumberValue);
  return amounts.length > 0 ? amounts : [1];
}

function updateCycleDays(
  cycle: PropChallengePayoutCycle,
  days: number
): PropChallengePayoutCycle {
  switch (cycle.kind) {
    case 'trading_days':
    case 'qualifying_days':
    case 'calendar_days':
      return { ...cycle, days };
    case 'none':
      return cycle;
  }
}

function updateQualifyingDailyProfit(
  cycle: PropChallengePayoutCycle,
  minimumDailyProfit: number
): PropChallengePayoutCycle {
  return cycle.kind === 'qualifying_days'
    ? { ...cycle, minimumDailyProfit }
    : cycle;
}

function updateCalendarAnchor(
  cycle: PropChallengePayoutCycle,
  anchor: string
): PropChallengePayoutCycle {
  return cycle.kind === 'calendar_days'
    ? {
        ...cycle,
        anchor: anchor === 'first_trade' ? 'first_trade' : 'phase_start',
      }
    : cycle;
}

function updateBalanceFloor(
  availability: PropChallengePayoutAvailability,
  balanceFloor: number
): PropChallengePayoutAvailability {
  return availability.kind === 'profit_above_balance_floor'
    ? { ...availability, balanceFloor }
    : availability;
}

function updateDrawdownFloor(
  aftermath: PropChallengePayoutAftermath,
  drawdownFloor: number
): PropChallengePayoutAftermath {
  return aftermath.drawdownAction === 'lock_at_balance'
    ? { ...aftermath, drawdownFloor }
    : aftermath;
}

type PayoutOptionalNumberField =
  | 'minimumCycleProfit'
  | 'minimumBalance'
  | 'minimumElapsedHours'
  | 'maxBestDayPercent'
  | 'maximumPayouts';

type UpdateOptionalNumber = (
  field: PayoutOptionalNumberField,
  value: string
) => void;

function PayoutRequestTimeZoneField({
  timeZone,
  disabled,
  onTimeZoneChange,
}: {
  timeZone: string;
  disabled: boolean;
  onTimeZoneChange: (timeZone: string) => void;
}) {
  const [draft, setDraft] = useState(timeZone);
  const invalid = draft.length > 0 && !isSupportedTimeZone(draft);
  return (
    <>
      <label className="journalit-prop-challenge-field">
        <span>
          {t('account.prop-challenge.payout-rules.request-window.time-zone')}
        </span>
        <input
          type="text"
          value={draft}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            if (isSupportedTimeZone(next)) onTimeZoneChange(next);
          }}
          disabled={disabled}
          aria-invalid={invalid}
        />
      </label>
      {invalid ? (
        <span className="journalit-prop-challenge-field-error" role="alert">
          {t('account.prop-challenge.payout.timezone-invalid')}
        </span>
      ) : null}
    </>
  );
}



function PayoutPolicyEligibilitySection({
  policy,
  disabled,
  onChange,
  updateOptionalNumber,
  toggleRequestWeekday,
}: {
  policy: PropChallengePayoutPolicy;
  disabled: boolean;
  onChange: (policy: PropChallengePayoutPolicy) => void;
  updateOptionalNumber: UpdateOptionalNumber;
  toggleRequestWeekday: (weekday: PropChallengeWeekday) => void;
}) {
  return (
    <section className="journalit-prop-payout-policy-editor__group">
      <strong className="journalit-prop-payout-policy-editor__group-title">
        {t('account.prop-challenge.payout-rules.group.eligibility')}
      </strong>
      <div className="journalit-prop-payout-policy-editor__group-fields">
        <label className="journalit-prop-challenge-field">
          <span>{t('account.prop-challenge.payout-rules.cycle')}</span>
          <DropdownSelect
            value={policy.cycle.kind}
            onChange={(kind) => {
              const nextPolicy = {
                ...policy,
                cycle: createCycle(kind),
              };
              if (kind !== 'qualifying_days') {
                delete nextPolicy.lifetimeQualifyingDaysUnlock;
              }
              onChange(nextPolicy);
            }}
            ariaLabel={t('account.prop-challenge.payout-rules.cycle')}
            disabled={disabled}
            options={[
              {
                value: 'none',
                label: t('account.prop-challenge.payout-rules.cycle.none'),
              },
              {
                value: 'trading_days',
                label: t(
                  'account.prop-challenge.payout-rules.cycle.trading-days'
                ),
              },
              {
                value: 'qualifying_days',
                label: t(
                  'account.prop-challenge.payout-rules.cycle.qualifying-days'
                ),
              },
              {
                value: 'calendar_days',
                label: t(
                  'account.prop-challenge.payout-rules.cycle.calendar-days'
                ),
              },
            ]}
          />
        </label>

        {policy.cycle.kind !== 'none' && (
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.payout-rules.days')}</span>
            <input
              type="number"
              min="1"
              step="1"
              value={policy.cycle.days}
              onChange={(event) =>
                onChange({
                  ...policy,
                  cycle: updateCycleDays(
                    policy.cycle,
                    positiveNumberValue(event.target.value)
                  ),
                })
              }
              disabled={disabled}
            />
          </label>
        )}

        {policy.cycle.kind === 'qualifying_days' && (
          <label className="journalit-prop-challenge-field">
            <span>
              {t('account.prop-challenge.payout-rules.minimum-daily-profit')}
            </span>
            <input
              type="number"
              min="0"
              step="50"
              value={policy.cycle.minimumDailyProfit || ''}
              onChange={(event) =>
                onChange({
                  ...policy,
                  cycle: updateQualifyingDailyProfit(
                    policy.cycle,
                    positiveNumberValue(event.target.value)
                  ),
                })
              }
              disabled={disabled}
            />
          </label>
        )}

        {policy.cycle.kind === 'calendar_days' && (
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.payout-rules.anchor')}</span>
            <DropdownSelect
              value={policy.cycle.anchor}
              onChange={(anchor) =>
                onChange({
                  ...policy,
                  cycle: updateCalendarAnchor(policy.cycle, anchor),
                })
              }
              ariaLabel={t('account.prop-challenge.payout-rules.anchor')}
              disabled={disabled}
              options={[
                {
                  value: 'phase_start',
                  label: t(
                    'account.prop-challenge.payout-rules.anchor.phase-start'
                  ),
                },
                {
                  value: 'first_trade',
                  label: t(
                    'account.prop-challenge.payout-rules.anchor.first-trade'
                  ),
                },
              ]}
            />
          </label>
        )}

        <label className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.minimum-elapsed-hours')}
          </span>
          <input
            type="number"
            min="1"
            step="1"
            value={policy.minimumElapsedHours ?? ''}
            onChange={(event) =>
              updateOptionalNumber('minimumElapsedHours', event.target.value)
            }
            disabled={disabled}
          />
        </label>

        <label className="journalit-prop-challenge-field">
          <span>{t('account.prop-challenge.payout-rules.request-window')}</span>
          <DropdownSelect
            value={policy.requestWindow ? 'weekdays' : 'anytime'}
            onChange={(kind) =>
              onChange({
                ...policy,
                requestWindow:
                  kind === 'weekdays'
                    ? {
                        kind,
                        weekdays: ['tuesday'],
                        timeZone: 'America/New_York',
                      }
                    : undefined,
              })
            }
            ariaLabel={t('account.prop-challenge.payout-rules.request-window')}
            disabled={disabled}
            options={[
              {
                value: 'anytime',
                label: t(
                  'account.prop-challenge.payout-rules.request-window.anytime'
                ),
              },
              {
                value: 'weekdays',
                label: t(
                  'account.prop-challenge.payout-rules.request-window.weekdays'
                ),
              },
            ]}
          />
        </label>

        {policy.requestWindow && (
          <>
            <PayoutRequestTimeZoneField
              timeZone={policy.requestWindow.timeZone}
              disabled={disabled}
              onTimeZoneChange={(timeZone) =>
                onChange({
                  ...policy,
                  requestWindow: {
                    ...policy.requestWindow!,
                    timeZone,
                  },
                })
              }
            />
            <fieldset className="journalit-prop-payout-policy-editor__weekdays">
              <legend>
                {t(
                  'account.prop-challenge.payout-rules.request-window.allowed-days'
                )}
              </legend>
              {PAYOUT_WEEKDAYS.map((weekday) => (
                <label key={weekday}>
                  <Checkbox
                    checked={policy.requestWindow!.weekdays.includes(weekday)}
                    onChange={() => toggleRequestWeekday(weekday)}
                    disabled={disabled}
                  />
                  <span>{t(`common.day.${weekday}`)}</span>
                </label>
              ))}
            </fieldset>
          </>
        )}

        <label className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.minimum-balance')}
          </span>
          <input
            type="number"
            min="0"
            step="100"
            value={policy.minimumBalance ?? ''}
            onChange={(event) =>
              updateOptionalNumber('minimumBalance', event.target.value)
            }
            disabled={disabled}
          />
        </label>

        <label className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.minimum-cycle-profit')}
          </span>
          <input
            type="number"
            min="0"
            step="50"
            value={policy.minimumCycleProfit ?? ''}
            onChange={(event) =>
              updateOptionalNumber('minimumCycleProfit', event.target.value)
            }
            disabled={disabled}
          />
        </label>

        <label className="journalit-prop-challenge-field">
          <span>
            {t(
              'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule'
            )}
          </span>
          <input
            type="text"
            value={policy.minimumCycleProfitSchedule?.amounts.join(', ') ?? ''}
            onChange={(event) => {
              const nextPolicy = { ...policy };
              if (event.target.value.trim() === '') {
                delete nextPolicy.minimumCycleProfitSchedule;
              } else {
                delete nextPolicy.minimumCycleProfit;
                nextPolicy.minimumCycleProfitSchedule = {
                  amounts: parseSchedule(event.target.value),
                  repeatLast: policy.minimumCycleProfitSchedule?.repeatLast,
                };
              }
              onChange(nextPolicy);
            }}
            disabled={disabled}
          />
        </label>

        {policy.minimumCycleProfitSchedule && (
          <div className="journalit-prop-challenge-field">
            <span>
              {t('account.prop-challenge.payout-rules.schedule-repeat-value')}
            </span>
            <Checkbox
              checked={policy.minimumCycleProfitSchedule.repeatLast ?? false}
              onChange={(repeatLast) =>
                onChange({
                  ...policy,
                  minimumCycleProfitSchedule: {
                    ...policy.minimumCycleProfitSchedule!,
                    repeatLast,
                  },
                })
              }
              disabled={disabled}
            />
          </div>
        )}

        <div className="journalit-prop-challenge-field">
          <span>
            {t(
              'account.prop-challenge.payout-rules.positive-cycle-after-first'
            )}
          </span>
          <Checkbox
            checked={policy.requirePositiveCycleProfitAfterFirst ?? false}
            onChange={(requirePositiveCycleProfitAfterFirst) =>
              onChange({
                ...policy,
                requirePositiveCycleProfitAfterFirst,
              })
            }
            disabled={disabled}
          />
        </div>

        <label className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.consistency-percent')}
          </span>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={policy.maxBestDayPercent ?? ''}
            onChange={(event) =>
              updateOptionalNumber('maxBestDayPercent', event.target.value)
            }
            disabled={disabled}
          />
        </label>

        <label className="journalit-prop-challenge-field">
          <span>
            {t(
              'account.prop-challenge.payout-rules.consistency-percent-schedule'
            )}
          </span>
          <input
            type="text"
            value={policy.maxBestDayPercentSchedule?.percents.join(', ') ?? ''}
            onChange={(event) => {
              const nextPolicy = { ...policy };
              if (event.target.value.trim() === '') {
                delete nextPolicy.maxBestDayPercentSchedule;
              } else {
                delete nextPolicy.maxBestDayPercent;
                nextPolicy.maxBestDayPercentSchedule = {
                  percents: parseSchedule(event.target.value).map((percent) =>
                    Math.min(100, percent)
                  ),
                  repeatLast: policy.maxBestDayPercentSchedule?.repeatLast,
                };
              }
              onChange(nextPolicy);
            }}
            disabled={disabled}
          />
        </label>

        {policy.maxBestDayPercentSchedule && (
          <div className="journalit-prop-challenge-field">
            <span>
              {t('account.prop-challenge.payout-rules.schedule-repeat-value')}
            </span>
            <Checkbox
              checked={policy.maxBestDayPercentSchedule.repeatLast ?? false}
              onChange={(repeatLast) =>
                onChange({
                  ...policy,
                  maxBestDayPercentSchedule: {
                    ...policy.maxBestDayPercentSchedule!,
                    repeatLast,
                  },
                })
              }
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </section>
  );
}



function PayoutPolicyAvailabilitySection({
  policy,
  disabled,
  onChange,
  updateOptionalNumber,
  startingBalance,
}: {
  policy: PropChallengePayoutPolicy;
  disabled: boolean;
  onChange: (policy: PropChallengePayoutPolicy) => void;
  updateOptionalNumber: UpdateOptionalNumber;
  startingBalance: number;
}) {
  const lifetimeUnlock = policy.lifetimeQualifyingDaysUnlock;
  const lifetimeMaximum = lifetimeUnlock?.maximumRequest;
  return (
    <section className="journalit-prop-payout-policy-editor__group">
      <strong className="journalit-prop-payout-policy-editor__group-title">
        {t('account.prop-challenge.payout-rules.group.availability')}
      </strong>
      <div className="journalit-prop-payout-policy-editor__group-fields">
        <label className="journalit-prop-challenge-field">
          <span>{t('account.prop-challenge.payout-rules.availability')}</span>
          <DropdownSelect
            value={policy.availability.kind}
            onChange={(kind) =>
              onChange({
                ...policy,
                availability: createAvailability(kind, startingBalance),
              })
            }
            ariaLabel={t('account.prop-challenge.payout-rules.availability')}
            disabled={disabled}
            options={[
              {
                value: 'profit_above_starting_balance',
                label: t(
                  'account.prop-challenge.payout-rules.availability.starting-balance'
                ),
              },
              {
                value: 'profit_above_balance_floor',
                label: t(
                  'account.prop-challenge.payout-rules.availability.balance-floor'
                ),
              },
            ]}
          />
        </label>

        {policy.availability.kind === 'profit_above_balance_floor' && (
          <label className="journalit-prop-challenge-field">
            <span>
              {t('account.prop-challenge.payout-rules.balance-floor')}
            </span>
            <input
              type="number"
              min="0"
              step="100"
              value={policy.availability.balanceFloor || ''}
              onChange={(event) =>
                onChange({
                  ...policy,
                  availability: updateBalanceFloor(
                    policy.availability,
                    Math.max(0, numberValue(event.target.value))
                  ),
                })
              }
              disabled={disabled}
            />
          </label>
        )}

        <label className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.request-percent')}
          </span>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={policy.availability.requestPercent}
            onChange={(event) =>
              onChange({
                ...policy,
                availability: {
                  ...policy.availability,
                  requestPercent: percentageValue(event.target.value),
                },
              })
            }
            disabled={disabled}
          />
        </label>

        <label className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.new-profit-percent')}
          </span>
          <input
            type="number"
            min="1"
            max="100"
            step="1"
            value={policy.newProfitPercentOfRequest ?? ''}
            onChange={(event) => {
              const nextPolicy = { ...policy };
              const parsed = optionalPositiveNumberValue(event.target.value);
              if (parsed === undefined) {
                delete nextPolicy.newProfitPercentOfRequest;
              } else {
                nextPolicy.newProfitPercentOfRequest = Math.min(100, parsed);
              }
              onChange(nextPolicy);
            }}
            disabled={disabled}
          />
        </label>
        <p className="setting-item-description">
          {t('account.prop-challenge.payout-rules.new-profit-percent-help')}
        </p>

        <label className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.minimum-request')}
          </span>
          <input
            type="number"
            min="0"
            step="50"
            value={policy.minimumRequest || ''}
            onChange={(event) =>
              onChange({
                ...policy,
                minimumRequest: Math.max(0, numberValue(event.target.value)),
              })
            }
            disabled={disabled}
          />
        </label>

        <label className="journalit-prop-challenge-field">
          <span>{t('account.prop-challenge.payout-rules.maximum')}</span>
          <DropdownSelect
            value={policy.maximumRequest.kind}
            onChange={(kind) =>
              onChange({
                ...policy,
                maximumRequest: createMaximum(kind),
              })
            }
            ariaLabel={t('account.prop-challenge.payout-rules.maximum')}
            disabled={disabled}
            options={[
              {
                value: 'none',
                label: t('account.prop-challenge.payout-rules.maximum.none'),
              },
              {
                value: 'fixed',
                label: t('account.prop-challenge.payout-rules.maximum.fixed'),
              },
              {
                value: 'first_fixed_then_none',
                label: t(
                  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none'
                ),
              },
              {
                value: 'schedule',
                label: t(
                  'account.prop-challenge.payout-rules.maximum.schedule'
                ),
              },
              {
                value: 'cycle_profit_percent',
                label: t(
                  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent'
                ),
              },
            ]}
          />
        </label>

        {policy.maximumRequest.kind === 'fixed' && (
          <label className="journalit-prop-challenge-field">
            <span>
              {t('account.prop-challenge.payout-rules.maximum-amount')}
            </span>
            <input
              type="number"
              min="0"
              step="50"
              value={policy.maximumRequest.amount || ''}
              onChange={(event) =>
                onChange({
                  ...policy,
                  maximumRequest: {
                    kind: 'fixed',
                    amount: positiveNumberValue(event.target.value),
                  },
                })
              }
              disabled={disabled}
            />
          </label>
        )}

        {policy.maximumRequest.kind === 'first_fixed_then_none' && (
          <label className="journalit-prop-challenge-field">
            <span>
              {t('account.prop-challenge.payout-rules.maximum-first-amount')}
            </span>
            <input
              type="number"
              min="1"
              step="50"
              value={policy.maximumRequest.amount}
              onChange={(event) =>
                onChange({
                  ...policy,
                  maximumRequest: {
                    kind: 'first_fixed_then_none',
                    amount: positiveNumberValue(event.target.value),
                  },
                })
              }
              disabled={disabled}
            />
          </label>
        )}

        {policy.maximumRequest.kind === 'schedule' && (
          <>
            <label className="journalit-prop-challenge-field">
              <span>{t('account.prop-challenge.payout-rules.schedule')}</span>
              <input
                value={policy.maximumRequest.amounts.join(', ')}
                onChange={(event) => {
                  if (policy.maximumRequest.kind !== 'schedule') return;
                  onChange({
                    ...policy,
                    maximumRequest: {
                      kind: 'schedule',
                      amounts: parseSchedule(event.target.value),
                      repeatLast: policy.maximumRequest.repeatLast,
                    },
                  });
                }}
                disabled={disabled}
              />
            </label>
            <div className="journalit-prop-challenge-field">
              <span>
                {t('account.prop-challenge.payout-rules.schedule-repeat-last')}
              </span>
              <Checkbox
                checked={policy.maximumRequest.repeatLast ?? false}
                onChange={(repeatLast) => {
                  if (policy.maximumRequest.kind !== 'schedule') return;
                  onChange({
                    ...policy,
                    maximumRequest: {
                      kind: 'schedule',
                      amounts: policy.maximumRequest.amounts,
                      repeatLast,
                    },
                  });
                }}
                disabled={disabled}
              />
            </div>
          </>
        )}

        {policy.maximumRequest.kind === 'cycle_profit_percent' && (
          <label className="journalit-prop-challenge-field">
            <span>
              {t(
                'account.prop-challenge.payout-rules.maximum-cycle-profit-percent'
              )}
            </span>
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              value={policy.maximumRequest.percent}
              onChange={(event) =>
                onChange({
                  ...policy,
                  maximumRequest: {
                    kind: 'cycle_profit_percent',
                    percent: percentageValue(event.target.value),
                  },
                })
              }
              disabled={disabled}
            />
          </label>
        )}

        {policy.cycle.kind === 'qualifying_days' && (
          <>
            <div className="journalit-prop-challenge-field">
              <span>
                {t('account.prop-challenge.payout-rules.lifetime-unlock')}
              </span>
              <Checkbox
                checked={Boolean(lifetimeUnlock)}
                ariaLabel={t(
                  'account.prop-challenge.payout-rules.lifetime-unlock'
                )}
                onChange={(enabled) => {
                  const nextPolicy = { ...policy };
                  if (enabled) {
                    nextPolicy.lifetimeQualifyingDaysUnlock = {
                      days: 30,
                      availability: {
                        kind: 'profit_above_starting_balance',
                        requestPercent: 100,
                      },
                      maximumRequest: { kind: 'none' },
                    };
                  } else {
                    delete nextPolicy.lifetimeQualifyingDaysUnlock;
                  }
                  onChange(nextPolicy);
                }}
                disabled={disabled}
              />
            </div>

            {lifetimeUnlock && (
              <>
                <p className="setting-item-description">
                  {t(
                    'account.prop-challenge.payout-rules.lifetime-unlock-help'
                  )}
                </p>
                <label className="journalit-prop-challenge-field">
                  <span>
                    {t(
                      'account.prop-challenge.payout-rules.lifetime-unlock-days'
                    )}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={lifetimeUnlock.days}
                    onChange={(event) =>
                      onChange({
                        ...policy,
                        lifetimeQualifyingDaysUnlock: {
                          ...lifetimeUnlock,
                          days: positiveNumberValue(event.target.value),
                        },
                      })
                    }
                    disabled={disabled}
                  />
                </label>
                <label className="journalit-prop-challenge-field">
                  <span>
                    {t(
                      'account.prop-challenge.payout-rules.lifetime-unlock-availability'
                    )}
                  </span>
                  <DropdownSelect
                    value={lifetimeUnlock.availability.kind}
                    onChange={(kind) =>
                      onChange({
                        ...policy,
                        lifetimeQualifyingDaysUnlock: {
                          ...lifetimeUnlock,
                          availability: createAvailability(
                            kind,
                            startingBalance
                          ),
                        },
                      })
                    }
                    ariaLabel={t(
                      'account.prop-challenge.payout-rules.lifetime-unlock-availability'
                    )}
                    disabled={disabled}
                    options={[
                      {
                        value: 'profit_above_starting_balance',
                        label: t(
                          'account.prop-challenge.payout-rules.availability.starting-balance'
                        ),
                      },
                      {
                        value: 'profit_above_balance_floor',
                        label: t(
                          'account.prop-challenge.payout-rules.availability.balance-floor'
                        ),
                      },
                    ]}
                  />
                </label>
                {lifetimeUnlock.availability.kind ===
                  'profit_above_balance_floor' && (
                  <label className="journalit-prop-challenge-field">
                    <span>
                      {t(
                        'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor'
                      )}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={lifetimeUnlock.availability.balanceFloor || ''}
                      onChange={(event) => {
                        const unlock = lifetimeUnlock;
                        onChange({
                          ...policy,
                          lifetimeQualifyingDaysUnlock: {
                            ...unlock,
                            availability: updateBalanceFloor(
                              unlock.availability,
                              Math.max(0, numberValue(event.target.value))
                            ),
                          },
                        });
                      }}
                      disabled={disabled}
                    />
                  </label>
                )}
                <label className="journalit-prop-challenge-field">
                  <span>
                    {t(
                      'account.prop-challenge.payout-rules.lifetime-unlock-request-percent'
                    )}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={lifetimeUnlock.availability.requestPercent}
                    onChange={(event) =>
                      onChange({
                        ...policy,
                        lifetimeQualifyingDaysUnlock: {
                          ...lifetimeUnlock,
                          availability: {
                            ...lifetimeUnlock.availability,
                            requestPercent: percentageValue(event.target.value),
                          },
                        },
                      })
                    }
                    disabled={disabled}
                  />
                </label>
                <label className="journalit-prop-challenge-field">
                  <span>
                    {t(
                      'account.prop-challenge.payout-rules.lifetime-unlock-maximum'
                    )}
                  </span>
                  <DropdownSelect
                    value={lifetimeUnlock.maximumRequest.kind}
                    onChange={(kind) =>
                      onChange({
                        ...policy,
                        lifetimeQualifyingDaysUnlock: {
                          ...lifetimeUnlock,
                          maximumRequest: createMaximum(kind),
                        },
                      })
                    }
                    ariaLabel={t(
                      'account.prop-challenge.payout-rules.lifetime-unlock-maximum'
                    )}
                    disabled={disabled}
                    options={[
                      {
                        value: 'none',
                        label: t(
                          'account.prop-challenge.payout-rules.maximum.none'
                        ),
                      },
                      {
                        value: 'fixed',
                        label: t(
                          'account.prop-challenge.payout-rules.maximum.fixed'
                        ),
                      },
                      {
                        value: 'first_fixed_then_none',
                        label: t(
                          'account.prop-challenge.payout-rules.maximum.first-fixed-then-none'
                        ),
                      },
                      {
                        value: 'schedule',
                        label: t(
                          'account.prop-challenge.payout-rules.maximum.schedule'
                        ),
                      },
                      {
                        value: 'cycle_profit_percent',
                        label: t(
                          'account.prop-challenge.payout-rules.maximum.cycle-profit-percent'
                        ),
                      },
                    ]}
                  />
                </label>
                {lifetimeUnlock.maximumRequest.kind === 'fixed' && (
                  <label className="journalit-prop-challenge-field">
                    <span>
                      {t(
                        'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount'
                      )}
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="50"
                      value={lifetimeUnlock.maximumRequest.amount}
                      onChange={(event) =>
                        onChange({
                          ...policy,
                          lifetimeQualifyingDaysUnlock: {
                            ...lifetimeUnlock,
                            maximumRequest: {
                              kind: 'fixed',
                              amount: positiveNumberValue(event.target.value),
                            },
                          },
                        })
                      }
                      disabled={disabled}
                    />
                  </label>
                )}
                {lifetimeMaximum?.kind === 'first_fixed_then_none' && (
                  <label className="journalit-prop-challenge-field">
                    <span>
                      {t(
                        'account.prop-challenge.payout-rules.maximum-first-amount'
                      )}
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="50"
                      value={lifetimeMaximum.amount}
                      onChange={(event) =>
                        onChange({
                          ...policy,
                          lifetimeQualifyingDaysUnlock: {
                            ...lifetimeUnlock,
                            maximumRequest: {
                              kind: 'first_fixed_then_none',
                              amount: positiveNumberValue(event.target.value),
                            },
                          },
                        })
                      }
                      disabled={disabled}
                    />
                  </label>
                )}
                {lifetimeMaximum?.kind === 'schedule' && (
                  <>
                    <label className="journalit-prop-challenge-field">
                      <span>
                        {t(
                          'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule'
                        )}
                      </span>
                      <input
                        type="text"
                        value={lifetimeMaximum.amounts.join(', ')}
                        onChange={(event) =>
                          onChange({
                            ...policy,
                            lifetimeQualifyingDaysUnlock: {
                              ...lifetimeUnlock,
                              maximumRequest: {
                                kind: 'schedule',
                                amounts: parseSchedule(event.target.value),
                                repeatLast: lifetimeMaximum.repeatLast,
                              },
                            },
                          })
                        }
                        disabled={disabled}
                      />
                    </label>
                    <div className="journalit-prop-challenge-field">
                      <span>
                        {t(
                          'account.prop-challenge.payout-rules.schedule-repeat-last'
                        )}
                      </span>
                      <Checkbox
                        checked={lifetimeMaximum.repeatLast ?? false}
                        onChange={(repeatLast) =>
                          onChange({
                            ...policy,
                            lifetimeQualifyingDaysUnlock: {
                              ...lifetimeUnlock,
                              maximumRequest: {
                                kind: 'schedule',
                                amounts: lifetimeMaximum.amounts,
                                repeatLast,
                              },
                            },
                          })
                        }
                        disabled={disabled}
                      />
                    </div>
                  </>
                )}
                {lifetimeMaximum?.kind === 'cycle_profit_percent' && (
                  <label className="journalit-prop-challenge-field">
                    <span>
                      {t(
                        'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent'
                      )}
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      value={lifetimeMaximum.percent}
                      onChange={(event) =>
                        onChange({
                          ...policy,
                          lifetimeQualifyingDaysUnlock: {
                            ...lifetimeUnlock,
                            maximumRequest: {
                              kind: 'cycle_profit_percent',
                              percent: percentageValue(event.target.value),
                            },
                          },
                        })
                      }
                      disabled={disabled}
                    />
                  </label>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function PayoutPolicyTermsSection({
  policy,
  disabled,
  onChange,
  updateOptionalNumber,
}: {
  policy: PropChallengePayoutPolicy;
  disabled: boolean;
  onChange: (policy: PropChallengePayoutPolicy) => void;
  updateOptionalNumber: UpdateOptionalNumber;
}) {
  const thresholdProfitSplit =
    policy.profitSplit.kind === 'cumulative_payout_threshold'
      ? policy.profitSplit
      : undefined;
  const fixedProfitSplit =
    policy.profitSplit.kind === 'fixed' ? policy.profitSplit : undefined;
  const accountProfitThresholdSplit =
    policy.profitSplit.kind === 'account_profit_threshold'
      ? policy.profitSplit
      : undefined;
  return (
    <section className="journalit-prop-payout-policy-editor__group">
      <strong className="journalit-prop-payout-policy-editor__group-title">
        {t('account.prop-challenge.payout-rules.group.terms')}
      </strong>
      <div className="journalit-prop-payout-policy-editor__group-fields">
        <label className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.profit-split-model')}
          </span>
          <DropdownSelect
            value={policy.profitSplit.kind}
            onChange={(kind) =>
              onChange({
                ...policy,
                profitSplit: createProfitSplit(kind),
              })
            }
            ariaLabel={t(
              'account.prop-challenge.payout-rules.profit-split-model'
            )}
            disabled={disabled}
            options={[
              {
                value: 'fixed',
                label: t(
                  'account.prop-challenge.payout-rules.profit-split.fixed'
                ),
              },
              {
                value: 'cumulative_payout_threshold',
                label: t(
                  'account.prop-challenge.payout-rules.profit-split.threshold'
                ),
              },
              {
                value: 'account_profit_threshold',
                label: t(
                  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold'
                ),
              },
            ]}
          />
        </label>

        {fixedProfitSplit ? (
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.payout-rules.profit-split')}</span>
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              value={fixedProfitSplit.percent}
              onChange={(event) =>
                onChange({
                  ...policy,
                  profitSplit: {
                    kind: 'fixed',
                    percent: percentageValue(event.target.value),
                  },
                })
              }
              disabled={disabled}
            />
          </label>
        ) : thresholdProfitSplit ? (
          <>
            <label className="journalit-prop-challenge-field">
              <span>
                {t('account.prop-challenge.payout-rules.profit-split.initial')}
              </span>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={thresholdProfitSplit.initialPercent}
                onChange={(event) =>
                  onChange({
                    ...policy,
                    profitSplit: {
                      ...thresholdProfitSplit,
                      initialPercent: percentageValue(event.target.value),
                    },
                  })
                }
                disabled={disabled}
              />
            </label>
            <label className="journalit-prop-challenge-field">
              <span>
                {t(
                  'account.prop-challenge.payout-rules.profit-split.threshold-amount'
                )}
              </span>
              <input
                type="number"
                min="1"
                step="500"
                value={thresholdProfitSplit.thresholdAmount}
                onChange={(event) =>
                  onChange({
                    ...policy,
                    profitSplit: {
                      ...thresholdProfitSplit,
                      thresholdAmount: positiveNumberValue(event.target.value),
                    },
                  })
                }
                disabled={disabled}
              />
            </label>
            <label className="journalit-prop-challenge-field">
              <span>
                {t(
                  'account.prop-challenge.payout-rules.profit-split.thereafter'
                )}
              </span>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={thresholdProfitSplit.thereafterPercent}
                onChange={(event) =>
                  onChange({
                    ...policy,
                    profitSplit: {
                      ...thresholdProfitSplit,
                      thereafterPercent: percentageValue(event.target.value),
                    },
                  })
                }
                disabled={disabled}
              />
            </label>
          </>
        ) : accountProfitThresholdSplit ? (
          <>
            <p className="setting-item-description">
              {t(
                'account.prop-challenge.payout-rules.profit-split.account-profit-help'
              )}
            </p>
            <label className="journalit-prop-challenge-field">
              <span>
                {t('account.prop-challenge.payout-rules.profit-split.below')}
              </span>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={accountProfitThresholdSplit.belowPercent}
                onChange={(event) =>
                  onChange({
                    ...policy,
                    profitSplit: {
                      ...accountProfitThresholdSplit,
                      belowPercent: percentageValue(event.target.value),
                    },
                  })
                }
                disabled={disabled}
              />
            </label>
            <label className="journalit-prop-challenge-field">
              <span>
                {t(
                  'account.prop-challenge.payout-rules.profit-split.threshold-profit'
                )}
              </span>
              <input
                type="number"
                min="1"
                step="500"
                value={accountProfitThresholdSplit.thresholdProfit}
                onChange={(event) =>
                  onChange({
                    ...policy,
                    profitSplit: {
                      ...accountProfitThresholdSplit,
                      thresholdProfit: positiveNumberValue(event.target.value),
                    },
                  })
                }
                disabled={disabled}
              />
            </label>
            <label className="journalit-prop-challenge-field">
              <span>
                {t(
                  'account.prop-challenge.payout-rules.profit-split.at-or-above'
                )}
              </span>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={accountProfitThresholdSplit.atOrAbovePercent}
                onChange={(event) =>
                  onChange({
                    ...policy,
                    profitSplit: {
                      ...accountProfitThresholdSplit,
                      atOrAbovePercent: percentageValue(event.target.value),
                    },
                  })
                }
                disabled={disabled}
              />
            </label>
          </>
        ) : null}

        <label className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.maximum-payouts')}
          </span>
          <input
            type="number"
            min="1"
            step="1"
            value={policy.maximumPayouts ?? ''}
            onChange={(event) =>
              updateOptionalNumber('maximumPayouts', event.target.value)
            }
            disabled={disabled}
          />
        </label>
      </div>
    </section>
  );
}

function PayoutPolicyAftermathSection({
  policy,
  disabled,
  onChange,
  startingBalance,
}: {
  policy: PropChallengePayoutPolicy;
  disabled: boolean;
  onChange: (policy: PropChallengePayoutPolicy) => void;
  startingBalance: number;
}) {
  return (
    <section className="journalit-prop-payout-policy-editor__group">
      <strong className="journalit-prop-payout-policy-editor__group-title">
        {t('account.prop-challenge.payout-rules.group.aftermath')}
      </strong>
      <div className="journalit-prop-payout-policy-editor__group-fields">
        <label className="journalit-prop-challenge-field">
          <span>{t('account.prop-challenge.payout-rules.aftermath')}</span>
          <DropdownSelect
            value={policy.afterPayout.drawdownAction}
            onChange={(kind) =>
              onChange({
                ...policy,
                afterPayout: createAftermath(
                  kind,
                  startingBalance,
                  policy.afterPayout.resetCycle,
                  policy.afterPayout.maximumPayoutOutcome
                ),
              })
            }
            ariaLabel={t('account.prop-challenge.payout-rules.aftermath')}
            disabled={disabled}
            options={[
              {
                value: 'unchanged',
                label: t(
                  'account.prop-challenge.payout-rules.aftermath.unchanged'
                ),
              },
              {
                value: 'lock_at_balance',
                label: t('account.prop-challenge.payout-rules.aftermath.lock'),
              },
              {
                value: 'reset_from_starting_balance',
                label: t('account.prop-challenge.payout-rules.aftermath.reset'),
              },
            ]}
          />
        </label>

        {policy.afterPayout.drawdownAction === 'lock_at_balance' && (
          <label className="journalit-prop-challenge-field">
            <span>
              {t('account.prop-challenge.payout-rules.drawdown-floor')}
            </span>
            <input
              type="number"
              min="0"
              step="100"
              value={policy.afterPayout.drawdownFloor || ''}
              onChange={(event) =>
                onChange({
                  ...policy,
                  afterPayout: updateDrawdownFloor(
                    policy.afterPayout,
                    Math.max(0, numberValue(event.target.value))
                  ),
                })
              }
              disabled={disabled}
            />
          </label>
        )}
        <label className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.maximum-payout-outcome')}
          </span>
          <DropdownSelect
            value={policy.afterPayout.maximumPayoutOutcome ?? 'continue'}
            onChange={(maximumPayoutOutcome) =>
              onChange({
                ...policy,
                afterPayout: {
                  ...policy.afterPayout,
                  maximumPayoutOutcome: isMaximumPayoutOutcome(
                    maximumPayoutOutcome
                  )
                    ? maximumPayoutOutcome
                    : undefined,
                },
              })
            }
            ariaLabel={t(
              'account.prop-challenge.payout-rules.maximum-payout-outcome'
            )}
            disabled={disabled || policy.maximumPayouts === undefined}
            options={[
              {
                value: 'continue',
                label: t(
                  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue'
                ),
              },
              {
                value: 'conclude_account',
                label: t(
                  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude'
                ),
              },
              {
                value: 'promote_to_next_phase',
                label: t(
                  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote'
                ),
              },
              {
                value: 'eligible_for_live_review',
                label: t(
                  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review'
                ),
              },
            ]}
          />
        </label>
      </div>

      <div className="journalit-prop-payout-policy-editor__checks">
        <div className="journalit-prop-challenge-field">
          <span>
            {t('account.prop-challenge.payout-rules.first-payout-exempt')}
          </span>
          <Checkbox
            checked={policy.firstPayoutCycleProfitExempt ?? false}
            onChange={(checked) =>
              onChange({
                ...policy,
                firstPayoutCycleProfitExempt: checked,
              })
            }
            disabled={disabled}
          />
        </div>
        <div className="journalit-prop-challenge-field">
          <span>{t('account.prop-challenge.payout-rules.reset-cycle')}</span>
          <Checkbox
            checked={policy.afterPayout.resetCycle}
            onChange={(checked) =>
              onChange({
                ...policy,
                afterPayout: {
                  ...policy.afterPayout,
                  resetCycle: checked,
                },
              })
            }
            disabled={disabled}
          />
        </div>
      </div>
    </section>
  );
}

export const PayoutPolicyEditor: React.FC<{
  policy: PropChallengePayoutPolicy;
  startingBalance: number;
  expanded: boolean;
  disabled: boolean;
  toggleRef: (element: HTMLButtonElement | null) => void;
  onToggle: () => void;
  onChange: (policy: PropChallengePayoutPolicy) => void;
  onRemove: () => void;
}> = ({
  policy,
  startingBalance,
  expanded,
  disabled,
  toggleRef,
  onToggle,
  onChange,
  onRemove,
}) => {
  const contentId = useId();
  const titleId = `${contentId}-title`;
  const summaryId = `${contentId}-summary`;
  const title = t('account.prop-challenge.payout-rules.title');
  const cycleLabel = t(
    `account.prop-challenge.payout-rules.cycle.${
      policy.cycle.kind === 'trading_days'
        ? 'trading-days'
        : policy.cycle.kind === 'qualifying_days'
          ? 'qualifying-days'
          : policy.cycle.kind === 'calendar_days'
            ? 'calendar-days'
            : 'none'
    }`
  );
  const splitSummary = (() => {
    switch (policy.profitSplit.kind) {
      case 'fixed':
        return `${policy.profitSplit.percent}%`;
      case 'cumulative_payout_threshold':
        return `${policy.profitSplit.initialPercent}% → ${policy.profitSplit.thereafterPercent}%`;
      case 'account_profit_threshold':
        return `${policy.profitSplit.belowPercent}% → ${policy.profitSplit.atOrAbovePercent}%`;
    }
  })();
  const summary = `${cycleLabel} · ${splitSummary}`;
  const accessibleIdentity = `${title} — ${summary}`;
  const updateOptionalNumber: UpdateOptionalNumber = (field, value) => {
    const parsed =
      field === 'minimumCycleProfit' || field === 'minimumBalance'
        ? optionalNumberValue(value)
        : optionalPositiveNumberValue(value);
    const nextValue =
      parsed === undefined
        ? undefined
        : field === 'maxBestDayPercent'
          ? Math.min(100, parsed)
          : field === 'minimumCycleProfit' || field === 'minimumBalance'
            ? Math.max(0, parsed)
            : Math.floor(parsed);
    const nextPolicy = { ...policy };
    if (nextValue === undefined) delete nextPolicy[field];
    else nextPolicy[field] = nextValue;
    if (field === 'minimumCycleProfit') {
      delete nextPolicy.minimumCycleProfitSchedule;
    }
    if (field === 'maxBestDayPercent') {
      delete nextPolicy.maxBestDayPercentSchedule;
    }
    if (field === 'maximumPayouts' && nextValue === undefined) {
      nextPolicy.afterPayout = {
        ...policy.afterPayout,
        maximumPayoutOutcome: undefined,
      };
    }
    onChange(nextPolicy);
  };
  const toggleRequestWeekday = (weekday: PropChallengeWeekday) => {
    if (!policy.requestWindow) return;
    const selected = policy.requestWindow.weekdays.includes(weekday);
    if (selected && policy.requestWindow.weekdays.length === 1) return;
    onChange({
      ...policy,
      requestWindow: {
        ...policy.requestWindow,
        weekdays: selected
          ? policy.requestWindow.weekdays.filter((value) => value !== weekday)
          : [...policy.requestWindow.weekdays, weekday],
      },
    });
  };

  return (
    <div className="journalit-prop-challenge-rule journalit-prop-payout-policy-editor">
      <div className="journalit-prop-challenge-rule-summary-row">
        <button
          ref={toggleRef}
          type="button"
          className="journalit-prop-challenge-rule-toggle"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={onToggle}
        >
          <strong id={titleId}>{title}</strong>
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
          aria-labelledby={`${titleId} ${summaryId}`}
        >
          <div className="journalit-prop-payout-policy-editor__fields">
            <PayoutPolicyEligibilitySection
              policy={policy}
              disabled={disabled}
              onChange={onChange}
              updateOptionalNumber={updateOptionalNumber}
              toggleRequestWeekday={toggleRequestWeekday}
            />
            <PayoutPolicyAvailabilitySection
              policy={policy}
              disabled={disabled}
              onChange={onChange}
              updateOptionalNumber={updateOptionalNumber}
              startingBalance={startingBalance}
            />
            <PayoutPolicyTermsSection
              policy={policy}
              disabled={disabled}
              onChange={onChange}
              updateOptionalNumber={updateOptionalNumber}
            />
            <PayoutPolicyAftermathSection
              policy={policy}
              disabled={disabled}
              onChange={onChange}
              startingBalance={startingBalance}
            />
          </div>
        </div>
      )}
    </div>
  );
};
