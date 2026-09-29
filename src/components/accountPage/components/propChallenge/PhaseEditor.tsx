import React, { useRef, useState } from 'react';
import { DraftInput } from '../../../ui/DraftInput';
import { t } from '../../../../lang/helpers';
import {
  addPropChallengeRule,
  createDefaultPropChallengePayoutPolicy,
  createPropChallengeRule,
  removePropChallengeRule,
  updatePropChallengeRule,
  setPropChallengePhaseStart,
  type PropChallengeRuleKind,
} from '../../../../services/propChallenge/PropChallengeConfig';
import type {
  PropChallengePhase,
  PropChallengeStage,
} from '../../../../services/propChallenge/types';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { Plus } from '../../../shared/icons/ObsidianIcon';
import { FastDateTimeInput } from '../../../core/FastDateTimeInput';
import { PayoutPolicyEditor } from './PayoutPolicyEditor';
import { RuleEditor } from './RuleEditor';
import { RULE_KINDS, numberValue, parseRuleKind } from './editorOptions';
import { useOptionalAccountPageData } from '../../context/AccountPageDataContext';
import { usePlugin } from '../../../../hooks/usePlugin';
import { formatDateDisplay } from '../../../../utils/dateUtils';
import Checkbox from '../../../ui/Checkbox';
import {
  collectPhaseBrokerAccountOptions,
  type PhaseBrokerAccountOption,
} from './phaseBrokerAccounts';

const PAYOUT_POLICY_RULE_ID = 'payout-policy';

function toIsoDate(value: Date | string | undefined): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function PhaseBrokerAccountsField({
  options,
  selectedIds,
  dateFormat,
  disabled,
  onToggle,
}: {
  options: readonly PhaseBrokerAccountOption[];
  selectedIds: ReadonlySet<string>;
  dateFormat: string | undefined;
  disabled: boolean;
  onToggle: (identity: string, selected: boolean) => void;
}) {
  
  
  
  if (options.length === 0) return null;

  return (
    <div className="journalit-prop-challenge-field">
      <span>{t('account.prop-challenge.broker-account-id')}</span>
      <ul className="journalit-prop-challenge-broker-accounts">
        {options.map((option) => {
          const assigned = Boolean(option.assignedPhaseName);
          const checked = !assigned && selectedIds.has(option.id);
          const title =
            option.displayName === option.id
              ? option.id
              : `${option.displayName} (${option.id})`;
          const meta: string[] = [];
          if (option.tradeCount > 0) {
            meta.push(
              option.tradeCount === 1
                ? t('account.prop-challenge.broker-accounts.trade-one')
                : t('account.prop-challenge.broker-accounts.trades', {
                    count: String(option.tradeCount),
                  })
            );
          }
          if (option.firstTradeAt && option.lastTradeAt) {
            meta.push(
              `${formatDateDisplay(option.firstTradeAt, dateFormat)} – ${formatDateDisplay(option.lastTradeAt, dateFormat)}`
            );
          }
          if (assigned && option.assignedPhaseName) {
            meta.push(
              t('account.prop-challenge.broker-accounts.assigned', {
                phase: option.assignedPhaseName,
              })
            );
          }
          return (
            <li
              key={option.id}
              className="journalit-prop-challenge-broker-account"
            >
              <Checkbox
                checked={checked}
                disabled={disabled || assigned}
                label={title}
                ariaLabel={title}
                onChange={(selected) => onToggle(option.id, selected)}
              />
              {meta.length > 0 && (
                <div className="journalit-prop-challenge-broker-account-meta">
                  {meta.join(' · ')}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PhaseDateFields({
  phase,
  dateFieldsDisabled,
  onChange,
}: {
  phase: PropChallengePhase;
  dateFieldsDisabled: boolean;
  onChange: (phase: PropChallengePhase) => void;
}) {
  if (phase.status === 'pending') return null;
  return (
    <div className="journalit-prop-challenge-phase-dates">
      <div className="journalit-prop-challenge-field">
        <span>{t('account.prop-challenge.phase-started')}</span>
        <FastDateTimeInput
          value={phase.startedAt ? new Date(phase.startedAt) : undefined}
          includeTime
          disabled={dateFieldsDisabled}
          className="journalit-prop-challenge-phase-date-picker"
          onChange={(value) => {
            const startedAt = toIsoDate(value);
            if (!startedAt) return;
            onChange(setPropChallengePhaseStart(phase, startedAt));
          }}
        />
      </div>
      {(phase.status === 'passed' || phase.status === 'failed') && (
        <div className="journalit-prop-challenge-field">
          <span>{t('account.prop-challenge.phase-completed')}</span>
          <FastDateTimeInput
            value={phase.completedAt ? new Date(phase.completedAt) : undefined}
            includeTime
            disabled={dateFieldsDisabled}
            className="journalit-prop-challenge-phase-date-picker"
            onChange={(value) => {
              const completedAt = toIsoDate(value);
              if (!completedAt) return;
              onChange({ ...phase, completedAt });
            }}
          />
        </div>
      )}
    </div>
  );
}

export function PhaseEditor({
  phase,
  phases,
  currencyCode,
  disabled,
  datesDisabled,
  onChange,
  onStageChange,
}: {
  phase: PropChallengePhase;
  phases?: readonly PropChallengePhase[];
  currencyCode: string;
  disabled: boolean;
  datesDisabled?: boolean;
  onChange: (phase: PropChallengePhase) => void;
  onStageChange?: (stage: PropChallengeStage) => void;
}) {
  const dateFieldsDisabled = datesDisabled ?? disabled;
  const stage = phase.stage ?? 'evaluation';
  const isFundedStage = stage === 'sim_funded' || stage === 'live_funded';
  const plugin = usePlugin();
  const dateFormat = plugin?.settings?.trade?.dateFormat;
  const accountPageData = useOptionalAccountPageData()?.accountPageData;
  const siblingPhases = phases ?? [phase];
  const brokerAccountOptions = accountPageData
    ? collectPhaseBrokerAccountOptions({
        trades: accountPageData.trades,
        phases: siblingPhases,
        currentPhaseId: phase.id,
        resolveDisplayName: (identity) => {
          for (const trade of accountPageData.trades) {
            if (
              trade.canonicalAccountId === identity &&
              trade.canonicalAccountDisplayName
            ) {
              return trade.canonicalAccountDisplayName;
            }
          }
          const mapped =
            plugin?.settings.backendIntegration?.accountMapping?.[identity];
          return mapped?.trim() || undefined;
        },
      })
    : [];
  const [expandedRuleId, setExpandedRuleId] = useState(
    () =>
      phase.rules[0]?.id ?? (phase.payoutPolicy ? PAYOUT_POLICY_RULE_ID : '')
  );
  const ruleToggleRefs = useRef(new Map<string, HTMLButtonElement>());
  const addRuleTriggerRef = useRef<HTMLButtonElement>(null);

  const addRule = (ruleKind: PropChallengeRuleKind) => {
    const rule = createPropChallengeRule(ruleKind);
    setExpandedRuleId(rule.id);
    onChange(addPropChallengeRule(phase, rule));
  };

  const addPayoutPolicy = () => {
    setExpandedRuleId(PAYOUT_POLICY_RULE_ID);
    onChange({
      ...phase,
      payoutPolicy: createDefaultPropChallengePayoutPolicy(),
    });
  };

  const removePayoutPolicy = () => {
    if (expandedRuleId === PAYOUT_POLICY_RULE_ID) setExpandedRuleId('');
    onChange({ ...phase, payoutPolicy: undefined });
    window.requestAnimationFrame(() => addRuleTriggerRef.current?.focus());
  };

  const removeRule = (ruleId: string) => {
    const index = phase.rules.findIndex((rule) => rule.id === ruleId);
    const adjacentRuleId =
      phase.rules[index + 1]?.id ?? phase.rules[index - 1]?.id ?? '';
    if (expandedRuleId === ruleId) {
      setExpandedRuleId(adjacentRuleId);
    }
    onChange(removePropChallengeRule(phase, ruleId));
    if (adjacentRuleId) {
      window.requestAnimationFrame(() =>
        ruleToggleRefs.current.get(adjacentRuleId)?.focus()
      );
    } else {
      window.requestAnimationFrame(() => addRuleTriggerRef.current?.focus());
    }
  };

  const setBrokerAccountSelected = (identity: string, selected: boolean) => {
    const nextIds: string[] = [];
    const seen = new Set<string>();
    for (const id of phase.brokerAccountIds ?? []) {
      if (id === identity && !selected) continue;
      if (seen.has(id)) continue;
      seen.add(id);
      nextIds.push(id);
    }
    if (selected && !seen.has(identity)) nextIds.push(identity);
    onChange({
      ...phase,
      brokerAccountIds: nextIds.length > 0 ? nextIds : undefined,
    });
  };

  return (
    <div className="journalit-prop-challenge-phase">
      <div className="journalit-prop-challenge-row-header">
        <strong>
          {phase.name || t('account.prop-challenge.unnamed-phase')}
        </strong>
      </div>
      <div className="journalit-prop-challenge-phase-fields">
        <label className="journalit-prop-challenge-field">
          <span>{t('account.prop-challenge.phase-name')}</span>
          <input
            value={phase.name}
            onChange={(event) =>
              onChange({ ...phase, name: event.target.value })
            }
            disabled={disabled}
          />
        </label>
        <label className="journalit-prop-challenge-field">
          <span>{t('account.prop-challenge.stage')}</span>
          <DropdownSelect
            value={stage}
            onChange={(value) => {
              const nextStage: PropChallengeStage =
                value === 'sim_funded' || value === 'live_funded'
                  ? value
                  : 'evaluation';
              if (nextStage === 'evaluation') setExpandedRuleId('');
              onChange({
                ...phase,
                stage: nextStage,
                ...(nextStage === 'evaluation'
                  ? { payoutPolicy: undefined }
                  : {}),
              });
              onStageChange?.(nextStage);
            }}
            ariaLabel={t('account.prop-challenge.stage')}
            disabled={disabled}
            options={[
              {
                value: 'evaluation',
                label: t('account.prop-challenge.stage.evaluation'),
              },
              {
                value: 'sim_funded',
                label: t('account.prop-challenge.stage.sim-funded'),
              },
              {
                value: 'live_funded',
                label: t('account.prop-challenge.stage.live-funded'),
              },
            ]}
          />
        </label>
        <label className="journalit-prop-challenge-field">
          <span>{t('account.prop-challenge.starting-balance')}</span>
          <DraftInput
            type="number"
            min="0"
            step="100"
            value={phase.startingBalance === 0 ? '' : phase.startingBalance}
            onChange={(event) =>
              onChange({
                ...phase,
                startingBalance: numberValue(event.target.value),
              })
            }
            disabled={disabled}
          />
        </label>
        {accountPageData ? (
          <PhaseBrokerAccountsField
            options={brokerAccountOptions}
            selectedIds={new Set(phase.brokerAccountIds ?? [])}
            dateFormat={dateFormat}
            disabled={disabled}
            onToggle={setBrokerAccountSelected}
          />
        ) : null}
        <PhaseDateFields
          phase={phase}
          dateFieldsDisabled={dateFieldsDisabled}
          onChange={onChange}
        />
      </div>
      <div className="journalit-prop-challenge-rules">
        <div className="journalit-prop-challenge-rules-heading">
          <strong>{t('account.prop-challenge.rules')}</strong>
          <DropdownSelect
            value=""
            options={[
              ...RULE_KINDS.map((kind) => ({
                value: kind,
                label: t(`account.prop-challenge.rule.${kind}`),
              })),
              ...(isFundedStage && !phase.payoutPolicy
                ? [
                    {
                      value: PAYOUT_POLICY_RULE_ID,
                      label: t('account.prop-challenge.payout-rules.title'),
                    },
                  ]
                : []),
            ]}
            onChange={(kind) => {
              if (kind === PAYOUT_POLICY_RULE_ID) addPayoutPolicy();
              else addRule(parseRuleKind(kind));
            }}
            ariaLabel={t('account.prop-challenge.add-rule')}
            placeholder={t('account.prop-challenge.add-rule')}
            disabled={disabled}
            className="journalit-prop-challenge-add-rule-menu"
            leadingContent={<Plus size={15} aria-hidden="true" />}
            triggerRef={addRuleTriggerRef}
          />
        </div>
        {phase.rules.length === 0 && !phase.payoutPolicy && (
          <div className="journalit-prop-challenge-rules-empty">
            {t('account.prop-challenge.rules.empty')}
          </div>
        )}
        {phase.rules.map((rule, index) => (
          <RuleEditor
            key={rule.id}
            rule={rule}
            ordinal={index + 1}
            currencyCode={currencyCode}
            startingBalance={phase.startingBalance}
            expanded={expandedRuleId === rule.id}
            disabled={disabled}
            toggleRef={(element) => {
              if (element) ruleToggleRefs.current.set(rule.id, element);
              else ruleToggleRefs.current.delete(rule.id);
            }}
            onToggle={() =>
              setExpandedRuleId((currentId) =>
                currentId === rule.id ? '' : rule.id
              )
            }
            onChange={(nextRule) =>
              onChange(updatePropChallengeRule(phase, nextRule))
            }
            onRemove={() => removeRule(rule.id)}
          />
        ))}
        {isFundedStage && phase.payoutPolicy && (
          <PayoutPolicyEditor
            policy={phase.payoutPolicy}
            startingBalance={phase.startingBalance}
            expanded={expandedRuleId === PAYOUT_POLICY_RULE_ID}
            disabled={disabled}
            toggleRef={(element) => {
              if (element)
                ruleToggleRefs.current.set(PAYOUT_POLICY_RULE_ID, element);
              else ruleToggleRefs.current.delete(PAYOUT_POLICY_RULE_ID);
            }}
            onToggle={() =>
              setExpandedRuleId((currentId) =>
                currentId === PAYOUT_POLICY_RULE_ID ? '' : PAYOUT_POLICY_RULE_ID
              )
            }
            onChange={(payoutPolicy) =>
              onChange({
                ...phase,
                payoutPolicy: { ...payoutPolicy, source: 'manual' },
              })
            }
            onRemove={removePayoutPolicy}
          />
        )}
      </div>
    </div>
  );
}
