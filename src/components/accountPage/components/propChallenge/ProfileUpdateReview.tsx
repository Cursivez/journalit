import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { t } from '../../../../lang/helpers';
import { createConfigFromProfile } from '../../../../services/propChallenge/PropChallengeConfig';
import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropChallengeRule,
  PropFirmProfileSelection,
} from '../../../../services/propChallenge/types';
import {
  applyProfilePhaseUpdate,
  proposedProfileRules,
} from '../../../../services/propChallenge/PropChallengeProfileUpdates';
import {
  sameProfileContent,
  canPreserveProfileState,
  ruleDefinition,
} from '../../../../services/propChallenge/PropChallengePolicyHistory';
import { Button } from '../../../ui/Button';
import Checkbox from '../../../ui/Checkbox';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { ProfilePolicyComparison } from './ProfilePolicyComparison';
import { FastDateTimeInput } from '../../../core/FastDateTimeInput';
import {
  resolveProfileApplicability,
  isPurchaseDate,
  type ProfileApplicability,
} from '../../../../services/propChallenge/ProfileApplicability';

interface Props {
  initialPhaseId?: string;
  config: PropChallengeConfig;
  selection: PropFirmProfileSelection;
  currencyCode: string;
  disabled: boolean;
  onApply: (config: PropChallengeConfig) => void;
  onCancel: () => void;
  onRetain?: (config: PropChallengeConfig) => void;
  onSaveFacts?: (config: PropChallengeConfig) => void;
}

function definitions(rules: readonly PropChallengeRule[]) {
  return rules.map(({ id: _id, ...rule }) => rule);
}
function sourceDefinitions(
  rules: readonly Omit<PropChallengeRule, 'id' | 'enabled'>[]
) {
  return rules.map((rule) => ({ ...rule, enabled: true }));
}

function groupByKind<T extends { kind: PropChallengeRule['kind'] }>(
  rules: readonly T[]
): Map<PropChallengeRule['kind'], T[]> {
  const grouped = new Map<PropChallengeRule['kind'], T[]>();
  for (const rule of rules) {
    const list = grouped.get(rule.kind);
    if (list) list.push(rule);
    else grouped.set(rule.kind, [rule]);
  }
  return grouped;
}

export function ProfileUpdateReview(props: Props) {
  const [purchaseDate, setPurchaseDate] = useState(
    props.config.purchaseDate ?? ''
  );
  const eligible = props.config.phases.filter(
    (phase) => phase.status === 'active' || phase.status === 'pending'
  );
  const initial =
    eligible.find((phase) => phase.id === props.initialPhaseId) ?? eligible[0];
  const [phaseId, setPhaseId] = useState(initial?.id ?? '');
  const [sourceIndex, setSourceIndex] = useState(
    String(initial?.profilePhaseIndex ?? 0)
  );
  const phase = eligible.find((item) => item.id === phaseId);
  const matching = props.selection.challenge.phases.flatMap((item, index) =>
    item.stage === phase?.stage &&
    item.startingBalance === phase.startingBalance
      ? [{ value: String(index), label: item.name }]
      : []
  );
  const selectedSource = matching.some((item) => item.value === sourceIndex)
    ? sourceIndex
    : matching[0]?.value;
  return (
    <section
      className="journalit-profile-review"
      aria-label={t('account.profiles.review')}
    >
      <div className="journalit-prop-profile-picker__controls">
        {eligible.length > 1 && (
          <label className="journalit-prop-challenge-field">
            <span>{t('account.profiles.account-phase')}</span>
            <DropdownSelect
              value={phaseId}
              ariaLabel={t('account.profiles.account-phase')}
              onChange={(id) => {
                setPhaseId(id);
                setSourceIndex(
                  String(
                    eligible.find((item) => item.id === id)
                      ?.profilePhaseIndex ?? 0
                  )
                );
              }}
              disabled={props.disabled}
              options={eligible.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </label>
        )}
        {matching.length > 1 && (
          <label className="journalit-prop-challenge-field">
            <span>{t('account.profiles.source-phase')}</span>
            <DropdownSelect
              value={selectedSource ?? ''}
              ariaLabel={t('account.profiles.source-phase')}
              onChange={setSourceIndex}
              disabled={props.disabled}
              options={matching}
            />
          </label>
        )}
      </div>
      {phase && selectedSource !== undefined ? (
        <PhaseUpdateReview
          key={JSON.stringify([
            phase,
            selectedSource,
            props.selection.source,
            props.selection.firmId,
            props.selection.challenge.id,
            props.selection.challenge.phases[Number(selectedSource)],
          ])}
          {...props}
          config={{
            ...props.config,
            ...(purchaseDate ? { purchaseDate } : { purchaseDate: undefined }),
          }}
          onPurchaseDate={setPurchaseDate}
          phase={phase}
          sourceIndex={Number(selectedSource)}
        />
      ) : (
        <>
          <p>
            {t(
              phase
                ? 'account.profiles.no-matching-phase'
                : 'account.profiles.completed'
            )}
          </p>
          <Button variant="plain" size="small" onClick={props.onCancel}>
            {t('button.cancel')}
          </Button>
        </>
      )}
    </section>
  );
}

interface ReviewDraft {
  keepRules: string[];
  keepPayout: boolean;
  effective: string;
  cycleStart: string;
  source: string;
  confirmed: boolean;
  error: string;
  carry: Record<number, { floor: string; peak: string; locked: boolean }>;
}
type DraftAction =
  | {
      type: 'edit';
      values: Partial<
        Pick<ReviewDraft, 'keepPayout' | 'effective' | 'cycleStart' | 'source'>
      >;
    }
  | { type: 'rule'; id: string; keep: boolean }
  | { type: 'carry'; index: number; value: ReviewDraft['carry'][number] }
  | { type: 'confirm'; value: boolean }
  | { type: 'error'; message: string };

function reviewDraftReducer(
  state: ReviewDraft,
  action: DraftAction
): ReviewDraft {
  switch (action.type) {
    case 'edit':
      return { ...state, ...action.values, confirmed: false, error: '' };
    case 'rule':
      return {
        ...state,
        keepRules: action.keep
          ? [...state.keepRules, action.id]
          : state.keepRules.filter((id) => id !== action.id),
        carry: {},
        confirmed: false,
        error: '',
      };
    case 'carry':
      return {
        ...state,
        carry: { ...state.carry, [action.index]: action.value },
        confirmed: false,
        error: '',
      };
    case 'confirm':
      return { ...state, confirmed: action.value, error: '' };
    case 'error':
      return { ...state, error: action.message };
  }
}



function PhaseUpdateReview({
  config,
  selection,
  currencyCode,
  disabled,
  onApply,
  onCancel,
  onRetain,
  onSaveFacts,
  onPurchaseDate,
  phase,
  sourceIndex,
}: Props & {
  phase: PropChallengePhase;
  sourceIndex: number;
  onPurchaseDate: (value: string) => void;
}) {
  const phaseId = phase.id;
  const [step, setStep] = useState<'review' | 'apply'>('review');
  const sourcePhase = selection.challenge.phases[sourceIndex];
  const baseline = phase.profileSnapshot;
  const [applicability, setApplicability] = useState<
    ProfileApplicability | { kind: 'checking' | 'check_failed' }
  >({ kind: selection.source === 'personal' ? 'personal' : 'checking' });
  useEffect(() => {
    if (selection.source === 'personal') {
      setApplicability({ kind: 'personal' });
      return;
    }
    let cancelled = false;
    setApplicability({ kind: 'checking' });
    void resolveProfileApplicability(config, phase, selection, sourceIndex)
      .then((result) => {
        if (!cancelled) setApplicability(result);
      })
      .catch(() => {
        if (!cancelled) setApplicability({ kind: 'check_failed' });
      });
    return () => {
      cancelled = true;
    };
  }, [config, phase, selection, sourceIndex]);
  const phaseRulesByKind = groupByKind(phase.rules);
  const baselineRulesByKind = baseline
    ? groupByKind(baseline.rules)
    : undefined;
  const localKinds = new Set<PropChallengeRule['kind']>();
  for (const [kind, rules] of phaseRulesByKind) {
    if (
      !baseline ||
      !sameProfileContent(
        definitions(rules),
        sourceDefinitions(baselineRulesByKind?.get(kind) ?? [])
      )
    ) {
      localKinds.add(kind);
    }
  }
  const conflicts = phase.rules.filter(
    (rule) =>
      localKinds.has(rule.kind) &&
      !sameProfileContent(
        definitions(phase.rules.filter((item) => item.kind === rule.kind)),
        sourceDefinitions(
          sourcePhase.rules.filter((item) => item.kind === rule.kind)
        )
      ) &&
      (!baseline ||
        !sameProfileContent(
          baseline.rules.filter((item) => item.kind === rule.kind),
          sourcePhase.rules.filter((item) => item.kind === rule.kind)
        ))
  );
  const localPayout =
    !baseline || !sameProfileContent(phase.payoutPolicy, baseline.payoutPolicy);
  const payoutConflict =
    localPayout &&
    !sameProfileContent(phase.payoutPolicy, sourcePhase.payoutPolicy) &&
    (!baseline ||
      !sameProfileContent(baseline.payoutPolicy, sourcePhase.payoutPolicy));
  const [draft, dispatch] = useReducer(
    reviewDraftReducer,
    phase,
    (initialPhase): ReviewDraft => ({
      keepRules: initialPhase.rules.reduce<string[]>((ids, rule) => {
        if (localKinds.has(rule.kind)) ids.push(rule.id);
        return ids;
      }, []),
      keepPayout: localPayout,
      effective: '',
      cycleStart: '',
      source: '',
      confirmed: false,
      error: '',
      carry: {},
    })
  );
  const {
    keepRules,
    keepPayout,
    effective,
    cycleStart,
    source,
    confirmed,
    error,
    carry,
  } = draft;
  const keepRuleIds = new Set(keepRules);
  const proposed = useMemo(
    () =>
      proposedProfileRules(config, phaseId, selection, sourceIndex, keepRules),
    [config, phaseId, selection, sourceIndex, keepRules]
  );
  const incoming = useMemo(
    () => createConfigFromProfile(selection).phases[sourceIndex],
    [selection, sourceIndex]
  );
  const payoutPolicy = keepPayout ? phase.payoutPolicy : incoming.payoutPolicy;
  const payoutChanged = !sameProfileContent(phase.payoutPolicy, payoutPolicy);
  const drawdownChanged = !canPreserveProfileState(
    { rules: phase.rules },
    { rules: proposed }
  );
  const drawdowns = drawdownChanged
    ? proposed.filter((rule) => rule.kind === 'drawdown')
    : [];
  const custom = drawdownChanged || payoutChanged;
  const active = phase.status === 'active';
  const published =
    applicability.kind === 'published' &&
    sameProfileContent(
      proposed.map(ruleDefinition),
      incoming.rules.map(ruleDefinition)
    ) &&
    sameProfileContent(payoutPolicy, incoming.payoutPolicy)
      ? applicability.change
      : undefined;
  const manualProof = selection.source !== 'personal' && !published;
  const needsConsent = !published || (active && custom);
  const effectiveValue = published?.effectiveAt ?? effective;
  const sourceDiffers =
    !baseline ||
    !sameProfileContent(baseline.rules, sourcePhase.rules) ||
    !sameProfileContent(baseline.payoutPolicy, sourcePhase.payoutPolicy);
  const sourceChanged = (kind: PropChallengeRule['kind']) =>
    !baseline ||
    !sameProfileContent(
      baseline.rules.filter((rule) => rule.kind === kind),
      sourcePhase.rules.filter((rule) => rule.kind === kind)
    );
  const comparisonCurrent = {
    ...phase,
    rules: phase.rules.filter((rule) => sourceChanged(rule.kind)),
  };
  const comparisonIncoming = {
    ...incoming,
    rules: incoming.rules.filter((rule) => sourceChanged(rule.kind)),
    payoutPolicy:
      baseline &&
      sameProfileContent(baseline.payoutPolicy, sourcePhase.payoutPolicy)
        ? phase.payoutPolicy
        : incoming.payoutPolicy,
  };
  const numberField = (
    label: string,
    value: string,
    change: (value: string) => void
  ) => (
    <label className="journalit-prop-challenge-field">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => change(event.target.value)}
        disabled={disabled}
      />
    </label>
  );
  const apply = () => {
    dispatch({ type: 'error', message: '' });
    try {
      if (needsConsent && !confirmed)
        throw new Error(t('account.profiles.confirm'));
      if (!['personal', 'unknown', 'published'].includes(applicability.kind))
        throw new Error(t('account.profiles.applicability-checking'));
      if (manualProof && !source.trim())
        throw new Error(t('account.profiles.transition-source'));
      if (selection.challenge.currency !== currencyCode)
        throw new Error(t('account.profiles.currency'));
      if (
        active &&
        drawdowns.some(
          (_, index) =>
            !carry[index]?.floor.trim() || !carry[index]?.peak.trim()
        )
      ) {
        throw new Error(t('account.profiles.transition-help'));
      }
      const result = applyProfilePhaseUpdate({
        config,
        selection,
        phaseId,
        sourcePhaseIndex: sourceIndex,
        keepRuleIds: keepRules,
        keepPayoutPolicy: keepPayout,
        effectiveAt: active
          ? new Date(effectiveValue).toISOString()
          : new Date().toISOString(),
        application: published
          ? {
              basis: 'published',
              reference: published.sourceUrl,
              announcementId: published.id,
            }
          : manualProof
            ? { basis: 'confirmed', reference: source.trim() }
            : undefined,
        transition: !custom
          ? { basis: 'preserve' }
          : {
              basis: 'custom',
              source,
              payoutCycleStartedAt:
                active && payoutChanged && payoutPolicy
                  ? new Date(cycleStart).toISOString()
                  : (phase.policyHistory
                      ?.slice()
                      .reverse()
                      .flatMap((revision) =>
                        revision.transition?.basis === 'custom'
                          ? [revision.transition.payoutCycleStartedAt]
                          : []
                      )[0] ??
                    phase.startedAt ??
                    new Date().toISOString()),
              drawdowns: drawdowns.map((rule, index) => ({
                ruleId: rule.id,
                floor: Number(carry[index]?.floor),
                peakBalance: Number(carry[index]?.peak),
                locked: carry[index]?.locked ?? false,
              })),
            },
      });
      onApply(result);
    } catch (failure) {
      dispatch({
        type: 'error',
        message:
          failure instanceof Error
            ? failure.message
            : t('account.profiles.error'),
      });
    }
  };
  const purchaseInput = (
    <FastDateTimeInput
      label={t('account.profiles.purchase-date')}
      value={
        config.purchaseDate
          ? new Date(`${config.purchaseDate}T12:00:00`)
          : undefined
      }
      disabled={disabled}
      onChange={(value) => {
        const date = value ? new Date(value) : undefined;
        const day =
          date && Number.isFinite(date.getTime())
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            : '';
        onPurchaseDate(day);
        dispatch({ type: 'confirm', value: false });
        setStep('review');
      }}
    />
  );
  if (applicability.kind === 'checking')
    return <p role="status">{t('account.profiles.applicability-checking')}</p>;
  if (applicability.kind === 'check_failed')
    return (
      <>
        <p role="alert">{t('account.profiles.check-failed')}</p>
        <Button onClick={onCancel}>{t('button.cancel')}</Button>
      </>
    );
  if (
    [
      'needs_purchase_date',
      'not_applicable',
      'uncertain',
      'initial_terms',
      'scheduled',
    ].includes(applicability.kind)
  ) {
    return (
      <div className="journalit-profile-review__transition">
        {(sourcePhase.purchaseEligibility ||
          sourcePhase.policyChanges?.some(
            (change) => change.kind === 'new_purchases'
          )) &&
          purchaseInput}
        <p role="status">
          {applicability.kind === 'scheduled'
            ? `${t('account.profiles.published-date')}: ${new Date(applicability.effectiveAt).toLocaleString()}`
            : t(
                applicability.kind === 'needs_purchase_date'
                  ? 'account.profiles.purchase-needed'
                  : applicability.kind === 'not_applicable'
                    ? 'account.profiles.purchase-excluded'
                    : applicability.kind === 'initial_terms'
                      ? 'account.profiles.initial-terms'
                      : 'account.profiles.purchase-uncertain'
              )}
        </p>
        {'sourceUrl' in applicability && (
          <a
            href={applicability.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('account.profiles.announcement')}
          </a>
        )}
        <div className="journalit-profile-review__actions">
          <Button variant="plain" size="small" onClick={onCancel}>
            {t('button.cancel')}
          </Button>
          {onSaveFacts && applicability.kind !== 'scheduled' && (
            <Button
              size="small"
              disabled={
                disabled ||
                !isPurchaseDate(config.purchaseDate) ||
                config.purchaseDate > new Date().toISOString().slice(0, 10)
              }
              onClick={() => onSaveFacts(config)}
            >
              {t('account.profiles.save-purchase')}
            </Button>
          )}
        </div>
      </div>
    );
  }
  return (
    <>
      {step === 'review' ? (
        <>
          <ProfilePolicyComparison
            current={comparisonCurrent}
            incoming={comparisonIncoming}
            currencyCode={currencyCode}
          />
          {(sourcePhase.purchaseEligibility || config.purchaseDate) &&
            purchaseInput}
          <div className="journalit-profile-review__choices">
            {Array.from(new Set(conflicts.map((rule) => rule.kind))).map(
              (kind) => (
                <Checkbox
                  key={kind}
                  disabled={disabled}
                  label={`${t('account.profiles.keep-local')} ${t(`account.prop-challenge.rule.${kind}`)}`}
                  checked={phase.rules
                    .filter((rule) => rule.kind === kind)
                    .every((rule) => keepRuleIds.has(rule.id))}
                  onChange={(keep) => {
                    for (const rule of phase.rules) {
                      if (rule.kind === kind) {
                        dispatch({ type: 'rule', id: rule.id, keep });
                      }
                    }
                  }}
                />
              )
            )}
            {payoutConflict && (
              <Checkbox
                checked={keepPayout}
                onChange={(keep) =>
                  dispatch({ type: 'edit', values: { keepPayout: keep } })
                }
                label={t('account.profiles.keep-payout')}
                disabled={disabled}
              />
            )}
          </div>
          <div className="journalit-profile-review__actions">
            <Button
              variant="plain"
              size="small"
              disabled={disabled}
              onClick={() => (onRetain ? onRetain(config) : onCancel())}
            >
              {t(onRetain ? 'account.profiles.retain' : 'button.cancel')}
            </Button>
            <Button
              size="small"
              disabled={
                disabled ||
                !sourceDiffers ||
                selection.challenge.currency !== currencyCode
              }
              onClick={() => setStep('apply')}
            >
              {t('button.next')}
            </Button>
          </div>
          {selection.challenge.currency !== currencyCode && (
            <p role="alert">{t('account.profiles.currency')}</p>
          )}
        </>
      ) : (
        <>
          {active && (
            <section
              className="journalit-profile-review__transition"
              aria-label={t('account.profiles.custom-transition')}
            >
              <div className="journalit-profile-review__dates">
                {published ? (
                  <div>
                    <span>{t('account.profiles.published-date')}</span>
                    <p>{new Date(published.effectiveAt).toLocaleString()}</p>
                    <a
                      href={published.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('account.profiles.announcement')}
                    </a>
                  </div>
                ) : (
                  <FastDateTimeInput
                    label={t(
                      manualProof
                        ? 'account.profiles.firm-effective'
                        : 'account.profiles.effective'
                    )}
                    value={effective || undefined}
                    includeTime
                    commitValidSegmentChangesImmediately
                    disabled={disabled}
                    onChange={(date) =>
                      dispatch({
                        type: 'edit',
                        values: {
                          effective:
                            date instanceof Date
                              ? date.toISOString()
                              : (date ?? ''),
                        },
                      })
                    }
                  />
                )}
                {payoutChanged && payoutPolicy && (
                  <FastDateTimeInput
                    label={t('account.profiles.cycle-start')}
                    value={cycleStart || undefined}
                    includeTime
                    commitValidSegmentChangesImmediately
                    disabled={disabled}
                    onChange={(date) =>
                      dispatch({
                        type: 'edit',
                        values: {
                          cycleStart:
                            date instanceof Date
                              ? date.toISOString()
                              : (date ?? ''),
                        },
                      })
                    }
                  />
                )}
              </div>
              {(custom || manualProof) && (
                <label className="journalit-prop-challenge-field">
                  <span>{t('account.profiles.transition-source')}</span>
                  <input
                    value={source}
                    disabled={disabled}
                    onChange={(event) =>
                      dispatch({
                        type: 'edit',
                        values: { source: event.target.value },
                      })
                    }
                  />
                </label>
              )}
              {drawdowns.map((rule, index) => {
                const value = carry[index] ?? {
                  floor: '',
                  peak: '',
                  locked: false,
                };
                const set = (next: typeof value) => {
                  dispatch({ type: 'carry', index, value: next });
                };
                return (
                  <div
                    key={rule.id}
                    className="journalit-profile-review__drawdown"
                  >
                    <strong>
                      {t('account.prop-challenge.rule.drawdown')} {index + 1}
                    </strong>
                    {numberField(
                      t('account.profiles.floor'),
                      value.floor,
                      (floor) => set({ ...value, floor })
                    )}
                    {numberField(
                      t('account.profiles.peak'),
                      value.peak,
                      (peak) => set({ ...value, peak })
                    )}
                    <Checkbox
                      checked={value.locked}
                      onChange={(locked) => set({ ...value, locked })}
                      label={t('account.profiles.locked')}
                      disabled={disabled}
                    />
                  </div>
                );
              })}
            </section>
          )}
          {!active && manualProof && (
            <label className="journalit-prop-challenge-field">
              <span>{t('account.profiles.transition-source')}</span>
              <input
                value={source}
                disabled={disabled}
                onChange={(event) =>
                  dispatch({
                    type: 'edit',
                    values: { source: event.target.value },
                  })
                }
              />
            </label>
          )}
          {needsConsent && (
            <Checkbox
              checked={confirmed}
              onChange={(value) => dispatch({ type: 'confirm', value })}
              label={t('account.profiles.confirm')}
              disabled={disabled}
            />
          )}
          {error && <p role="alert">{error}</p>}
          <div className="journalit-profile-review__actions">
            <Button
              variant="plain"
              size="small"
              onClick={() => {
                dispatch({ type: 'confirm', value: false });
                setStep('review');
              }}
            >
              {t('button.back')}
            </Button>
            <Button
              size="small"
              onClick={apply}
              disabled={
                disabled ||
                (needsConsent && !confirmed) ||
                (manualProof && !source.trim()) ||
                (active &&
                  (!effectiveValue ||
                    (custom && !source.trim()) ||
                    (payoutChanged && Boolean(payoutPolicy) && !cycleStart) ||
                    drawdowns.some(
                      (_, index) =>
                        !carry[index]?.floor.trim() ||
                        !carry[index]?.peak.trim()
                    )))
              }
            >
              {t('account.profiles.accept')}
            </Button>
          </div>
          <p>{t('account.profiles.history-unchanged')}</p>
        </>
      )}
    </>
  );
}
