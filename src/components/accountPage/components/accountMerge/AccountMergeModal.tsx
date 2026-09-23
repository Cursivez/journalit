

import { App, Modal } from 'obsidian';
import React, { useEffect, useId, useMemo, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type JournalitPlugin from '../../../../main';
import { t, type TranslationKey } from '../../../../lang/helpers';
import { AccountMergePlanError } from '../../../../services/accountMerge/planAccountMerge';
import type {
  AccountMergeBuildSourceInput,
  AccountMergePlan,
  AccountMergePlanErrorCode,
  AccountMergePlanInput,
  AccountMergeWarning,
} from '../../../../services/accountMerge/types';
import type {
  PropChallengePhase,
  PropChallengeStage,
  PropFirmProfileSelection,
  PropChallengeRule,
} from '../../../../services/propChallenge/types';
import { ModalGuide } from '../../../../guides/modalGuide/ModalGuide';
import {
  ACCOUNT_MERGE_CHALLENGE_PAGE_GUIDE,
  ACCOUNT_MERGE_PHASES_PAGE_GUIDE,
  ACCOUNT_MERGE_REVIEW_PAGE_GUIDE,
} from '../../../../guides/accountConversionGuides';
import {
  AccountMergeIdentitySection,
  type AccountMergeIdentity,
} from './AccountMergeIdentitySection';
import { AccountMergePhaseRules } from './AccountMergePhaseRules';
import { useWizardProTier } from './useWizardProTier';
import { showConfirmationModal } from '../../../shared/ConfirmationModal';
import { DisplayPolicyProvider } from '../../../../contexts/DisplayPolicyContext';
import { CurrencyProvider } from '../../../../contexts/CurrencyContext';
import { formatDateDisplay } from '../../../../utils/dateUtils';
import { Button } from '../../../ui/Button';
import Checkbox from '../../../ui/Checkbox';
import ToggleSwitch from '../../../ui/ToggleSwitch';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { MoneyValue } from '../../../shared/display/DisplayValue';
import { FastDateTimeInput } from '../../../core/FastDateTimeInput';
import { ensureAccountMergeServices } from '../../../../services/accountMerge/ensureAccountMergeServices';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  GitMerge,
} from '../../../shared/icons/ObsidianIcon';
import {
  accountMergeErrorLocaleKey,
  findInvalidOverrideRow,
  hasEditedAccountMergeRules,
  hasIncompleteAccountMergeRules,
  locatePlanErrorRow,
  sortCandidatesByCreatedDate,
  type AccountMergeCandidate,
} from './accountMergeWizardHelpers';

type AccountMergeOutcome = 'merged' | 'cancelled';

interface AccountMergeModalOptions {
  
  accounts?: string[];
  
  sequence?: { index: number; total: number };
  onMerged?: (targetAccountName: string) => void;
}

type WizardStep = 'accounts' | 'challenge' | 'phases' | 'review';

const STEP_LABEL_KEYS: Record<WizardStep, TranslationKey> = {
  accounts: 'account.merge.step.accounts',
  challenge: 'account.merge.step.challenge',
  phases: 'account.merge.step.phases',
  review: 'account.merge.step.review',
};

type PhaseStatusOverride = 'passed' | 'failed' | 'active';

interface PhaseOverride {
  phaseName?: string;
  stage?: PropChallengeStage;
  status?: PhaseStatusOverride;
  startedAt?: string;
  completedAt?: string;
  startingBalance?: number;
  
  rules?: PropChallengeRule[];
}

interface PlanState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  
  plan?: AccountMergePlan;
  code?: AccountMergePlanErrorCode;
  message?: string;
  row?: number;
}

const STAGE_LABEL_KEYS: Record<PropChallengeStage, TranslationKey> = {
  evaluation: 'account.prop-challenge.stage.evaluation',
  sim_funded: 'account.prop-challenge.stage.sim-funded',
  live_funded: 'account.prop-challenge.stage.live-funded',
};

function isPropChallengeStage(value: string): value is PropChallengeStage {
  return value in STAGE_LABEL_KEYS;
}

const STATUS_LABEL_KEYS: Record<PhaseStatusOverride, TranslationKey> = {
  passed: 'account.prop-challenge.summary.phase-status.passed',
  failed: 'account.prop-challenge.summary.phase-status.failed',
  active: 'account.prop-challenge.summary.phase-status.active',
};

function isPhaseStatusOverride(value: string): value is PhaseStatusOverride {
  return value in STATUS_LABEL_KEYS;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const WARNING_LABEL_KEYS: Record<AccountMergeWarning['kind'], TranslationKey> =
  {
    trade_outside_phase_window: 'account.merge.warning.trade-outside-window',
    identity_claimed_by_multiple_sources:
      'account.merge.warning.identity-shared',
    copy_trading_period_dropped: 'account.merge.warning.copy-trading-dropped',
    starting_balance_differs_from_profile:
      'account.merge.warning.balance-differs',
  };

function toIsoDate(value: unknown): string | undefined {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }
  return undefined;
}

function toIsoString(value: Date | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function noteBasename(path: string): string {
  const file = path.slice(path.lastIndexOf('/') + 1);
  return file.endsWith('.md') ? file.slice(0, -3) : file;
}

function warningDetail(warning: AccountMergeWarning): string {
  switch (warning.kind) {
    case 'trade_outside_phase_window':
      return `${noteBasename(warning.path)} · ${warning.sourceAccountName}`;
    case 'identity_claimed_by_multiple_sources':
      return `${warning.identity} → ${warning.assignedTo}`;
    case 'copy_trading_period_dropped':
      return `${warning.sourceAccountName} → ${warning.baseAccount}`;
    case 'starting_balance_differs_from_profile':
      return `${warning.sourceAccountName} · ${warning.phaseName}`;
  }
}

function warningKey(warning: AccountMergeWarning): string {
  switch (warning.kind) {
    case 'trade_outside_phase_window':
      return `${warning.kind}:${warning.path}:${warning.attributedPhaseId ?? 'none'}`;
    case 'identity_claimed_by_multiple_sources':
      return `${warning.kind}:${warning.identity}`;
    case 'copy_trading_period_dropped':
      return `${warning.kind}:${warning.sourceAccountName}:${warning.baseAccount}:${warning.startDate}`;
    case 'starting_balance_differs_from_profile':
      return `${warning.kind}:${warning.sourceAccountName}:${warning.phaseName}`;
  }
}

function formatShortDate(iso: string | undefined): string {
  return iso ? formatDateDisplay(new Date(iso)) : '—';
}





const StepperHeader: React.FC<{
  steps: WizardStep[];
  step: WizardStep;
  sequence?: AccountMergeModalOptions['sequence'];
}> = ({ steps, step, sequence }) => {
  const activeIndex = steps.indexOf(step);
  return (
    <div className="journalit-account-merge-modal__header">
      {sequence && sequence.total > 1 && (
        <span className="journalit-account-merge-modal__sequence">
          {t('account.merge.sequence', {
            index: String(sequence.index),
            total: String(sequence.total),
          })}
        </span>
      )}
      <div className="journalit-account-merge-modal__steps">
        {steps.map((entry, index) => (
          <span
            key={entry}
            className={`journalit-account-merge-modal__step${
              index === activeIndex ? ' is-active' : ''
            }${index < activeIndex ? ' is-done' : ''}`}
            aria-current={index === activeIndex ? 'step' : undefined}
          >
            <span className="journalit-account-merge-modal__step-index">
              {index < activeIndex ? <Check size={10} /> : index + 1}
            </span>
            {t(STEP_LABEL_KEYS[entry])}
          </span>
        ))}
      </div>
    </div>
  );
};

const PlanErrorRow: React.FC<{ state: PlanState }> = ({ state }) => {
  if (state.status !== 'error') return null;
  const message = state.code
    ? t(accountMergeErrorLocaleKey(state.code))
    : (state.message ?? t('account.merge.error.unknown'));
  return (
    <div className="journalit-account-merge-modal__error" role="alert">
      <AlertTriangle size={14} />
      {message}
    </div>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span className="journalit-account-merge-modal__section-title">
    {children}
  </span>
);





interface AccountsStepProps {
  candidates: AccountMergeCandidate[] | null;
  showArchived: boolean;
  onShowArchivedChange: (value: boolean) => void;
  selected: string[];
  onToggle: (name: string, checked: boolean) => void;
}

const AccountsStep: React.FC<AccountsStepProps> = ({
  candidates,
  showArchived,
  onShowArchivedChange,
  selected,
  onToggle,
}) => {
  if (!candidates) {
    return (
      <div className="journalit-account-merge-modal__loading">
        {t('account.merge.loading')}
      </div>
    );
  }

  const selectedSet = new Set(selected);
  const visible = candidates.filter(
    (candidate) =>
      showArchived || !candidate.archived || selectedSet.has(candidate.name)
  );

  return (
    <section className="journalit-account-merge-modal__section">
      <div className="journalit-account-merge-modal__section-head">
        <SectionTitle>{t('account.merge.accounts.title')}</SectionTitle>
        <label className="journalit-account-merge-modal__toggle">
          {t('account.merge.accounts.show-archived')}
          <ToggleSwitch
            checked={showArchived}
            onChange={onShowArchivedChange}
            ariaLabel={t('account.merge.accounts.show-archived')}
          />
        </label>
      </div>
      <div className="journalit-account-merge-modal__list">
        {visible.length === 0 && (
          <div className="journalit-account-merge-modal__row is-empty">
            {t('account.merge.accounts.empty')}
          </div>
        )}
        {visible.map((candidate) => (
          <label
            className="journalit-account-merge-modal__row"
            key={candidate.name}
          >
            <Checkbox
              checked={selectedSet.has(candidate.name)}
              onChange={(checked) => onToggle(candidate.name, checked)}
              ariaLabel={candidate.name}
            />
            <span className="journalit-account-merge-modal__row-label">
              {candidate.name}
            </span>
            <span className="journalit-account-merge-modal__row-meta">
              {candidate.accountType && (
                <span className="journalit-account-merge-modal__badge">
                  {candidate.accountType}
                </span>
              )}
              {candidate.createdDate && (
                <span>
                  {formatDateDisplay(new Date(candidate.createdDate))}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
};





interface ChallengeStepProps {
  selected: string[];
  lockedAccounts: boolean;
  onMove: (index: number, delta: number) => void;
  targetMode: 'keep' | 'new';
  onTargetModeChange: (mode: 'keep' | 'new') => void;
  targetKeep: string;
  onTargetKeepChange: (name: string) => void;
  targetName: string;
  onTargetNameChange: (name: string) => void;
  plugin: JournalitPlugin;
  isPro: boolean;
  currency?: string;
  identity: AccountMergeIdentity;
  onIdentityChange: (identity: AccountMergeIdentity) => void;
  profile: PropFirmProfileSelection | undefined;
  onProfileChange: (
    profile: PropFirmProfileSelection | undefined
  ) => Promise<void>;
}

const ChallengeStep: React.FC<ChallengeStepProps> = ({
  selected,
  lockedAccounts,
  onMove,
  targetMode,
  onTargetModeChange,
  targetKeep,
  onTargetKeepChange,
  targetName,
  onTargetNameChange,
  plugin,
  isPro,
  currency,
  identity,
  onIdentityChange,
  profile,
  onProfileChange,
}) => {
  const single = selected.length === 1;
  const targetFieldId = useId();
  const keepRadioId = `${targetFieldId}-keep`;
  const newRadioId = `${targetFieldId}-new`;
  return (
    <>
      <section className="journalit-account-merge-modal__section">
        <SectionTitle>{t('account.merge.challenge.accounts')}</SectionTitle>
        <div className="journalit-account-merge-modal__chain">
          {selected.map((name, index) => (
            <React.Fragment key={name}>
              {index > 0 && (
                <ArrowRight
                  size={12}
                  className="journalit-account-merge-modal__chain-arrow"
                />
              )}
              <span className="journalit-account-merge-modal__chip">
                <span className="journalit-account-merge-modal__chip-index">
                  {index + 1}
                </span>
                {name}
                {!single && (
                  <span className="journalit-account-merge-modal__chip-move">
                    <button
                      type="button"
                      className="journalit-account-merge-modal__chip-move-button"
                      aria-label={t('account.merge.challenge.move-earlier', {
                        account: name,
                      })}
                      disabled={index === 0}
                      onClick={() => onMove(index, -1)}
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <button
                      type="button"
                      className="journalit-account-merge-modal__chip-move-button"
                      aria-label={t('account.merge.challenge.move-later', {
                        account: name,
                      })}
                      disabled={index === selected.length - 1}
                      onClick={() => onMove(index, 1)}
                    >
                      <ChevronRight size={12} />
                    </button>
                  </span>
                )}
              </span>
            </React.Fragment>
          ))}
        </div>
        {!single && (
          <span className="journalit-account-merge-modal__hint">
            {t('account.merge.challenge.order-hint')}
          </span>
        )}
        {lockedAccounts && single && (
          <span className="journalit-account-merge-modal__hint">
            {t('account.merge.challenge.single-hint')}
          </span>
        )}
      </section>

      {!single && (
        <section
          className="journalit-account-merge-modal__section"
          data-journalit-guide-target="account-merge.target"
        >
          <SectionTitle>{t('account.merge.target.title')}</SectionTitle>
          <div className="journalit-account-merge-modal__target">
            <div className="journalit-account-merge-modal__target-row">
              <input
                type="radio"
                id={keepRadioId}
                name="journalit-account-merge-target"
                checked={targetMode === 'keep'}
                onChange={() => onTargetModeChange('keep')}
              />
              <label
                htmlFor={keepRadioId}
                className="journalit-account-merge-modal__target-label"
              >
                {t('account.merge.target.keep')}
              </label>
              <div className="journalit-account-merge-modal__target-input">
                <DropdownSelect
                  value={targetKeep}
                  options={selected.map((name) => ({
                    value: name,
                    label: name,
                  }))}
                  onChange={onTargetKeepChange}
                  ariaLabel={t('account.merge.target.keep')}
                  disabled={targetMode !== 'keep'}
                />
              </div>
            </div>
            <div className="journalit-account-merge-modal__target-row">
              <input
                type="radio"
                id={newRadioId}
                name="journalit-account-merge-target"
                checked={targetMode === 'new'}
                onChange={() => onTargetModeChange('new')}
              />
              <label
                htmlFor={newRadioId}
                className="journalit-account-merge-modal__target-label"
              >
                {t('account.merge.target.new')}
              </label>
              <input
                type="text"
                className="journalit-account-merge-modal__target-input"
                value={targetName}
                disabled={targetMode !== 'new'}
                aria-label={t('account.merge.target.new')}
                onChange={(event) => onTargetNameChange(event.target.value)}
              />
            </div>
          </div>
        </section>
      )}

      <AccountMergeIdentitySection
        plugin={plugin}
        isPro={isPro}
        currency={currency}
        identity={identity}
        onIdentityChange={onIdentityChange}
        profile={profile}
        onProfileChange={onProfileChange}
      />
    </>
  );
};





interface PhasesStepProps {
  selected: string[];
  overrides: Record<string, PhaseOverride>;
  onOverrideChange: (name: string, patch: PhaseOverride) => void;
  planState: PlanState;
  currency?: string;
  
  manualRules: boolean;
  showPrefillTeaser: boolean;
  offerCatalog: boolean;
  typedFirmName: string;
  onApplyProfile: (selection: PropFirmProfileSelection) => void;
}

const PhasesStep: React.FC<PhasesStepProps> = ({
  selected,
  overrides,
  onOverrideChange,
  planState,
  currency,
  manualRules,
  showPrefillTeaser,
  offerCatalog,
  typedFirmName,
  onApplyProfile,
}) => {
  const phases: PropChallengePhase[] = planState.plan?.phases ?? [];
  const invalidRow = planState.status === 'error' ? planState.row : undefined;
  const trailing = phases.slice(selected.length);

  return (
    <div className="journalit-account-merge-modal__phases">
      {selected.map((name, index) => {
        const override = overrides[name] ?? {};
        const phase = phases[index];
        const stage = override.stage ?? phase?.stage ?? 'evaluation';
        const phaseStatus = phase?.status;
        const status: PhaseStatusOverride =
          override.status ??
          (phaseStatus === 'passed' ||
          phaseStatus === 'failed' ||
          phaseStatus === 'active'
            ? phaseStatus
            : 'active');
        const ruleKinds: PropChallengeRule['kind'][] = [];
        const seenRuleKinds = new Set<PropChallengeRule['kind']>();
        for (const rule of phase?.rules ?? []) {
          if (!rule.enabled || seenRuleKinds.has(rule.kind)) continue;
          seenRuleKinds.add(rule.kind);
          ruleKinds.push(rule.kind);
        }

        return (
          <section
            className={`journalit-account-merge-modal__phase${
              invalidRow === index ? ' is-invalid' : ''
            }`}
            key={name}
            
            
            data-journalit-guide-target={
              index === 0 ? 'account-merge.phases' : undefined
            }
          >
            <div className="journalit-account-merge-modal__phase-head">
              <span className="journalit-account-merge-modal__chip-index">
                {index + 1}
              </span>
              <span className="journalit-account-merge-modal__phase-source">
                {name}
              </span>
              <span className="journalit-account-merge-modal__phase-facts">
                <MoneyValue
                  kind="balance"
                  value={phase?.startingBalance ?? 0}
                  currencyCode={currency}
                  tone="none"
                />
                <span>
                  {ruleKinds.length
                    ? ruleKinds
                        .map((kind) =>
                          t(`account.prop-challenge.summary.rule.${kind}`)
                        )
                        .join(' · ')
                    : t('account.merge.phase.no-rules')}
                </span>
                <span>
                  {t('account.merge.phase.identities-count', {
                    count: String(phase?.brokerAccountIds?.length ?? 0),
                  })}
                </span>
              </span>
            </div>
            <div className="journalit-account-merge-modal__phase-grid">
              <label className="journalit-account-merge-modal__field">
                <span className="journalit-account-merge-modal__field-label">
                  {t('account.merge.phase.name')}
                </span>
                <input
                  type="text"
                  value={override.phaseName ?? phase?.name ?? name}
                  onChange={(event) =>
                    onOverrideChange(name, {
                      phaseName: event.target.value.trim()
                        ? event.target.value
                        : undefined,
                    })
                  }
                />
              </label>
              <div className="journalit-account-merge-modal__field">
                <span className="journalit-account-merge-modal__field-label">
                  {t('account.prop-challenge.stage')}
                </span>
                <DropdownSelect
                  value={stage}
                  options={(
                    ['evaluation', 'sim_funded', 'live_funded'] as const
                  ).map((value) => ({
                    value,
                    label: t(STAGE_LABEL_KEYS[value]),
                  }))}
                  onChange={(value) => {
                    if (isPropChallengeStage(value)) {
                      onOverrideChange(name, { stage: value });
                    }
                  }}
                  ariaLabel={t('account.prop-challenge.stage')}
                />
              </div>
              <div className="journalit-account-merge-modal__field">
                <span className="journalit-account-merge-modal__field-label">
                  {t('account.merge.phase.status')}
                </span>
                <DropdownSelect
                  value={status}
                  options={(['passed', 'failed', 'active'] as const).map(
                    (value) => ({
                      value,
                      label: t(STATUS_LABEL_KEYS[value]),
                    })
                  )}
                  onChange={(value) => {
                    if (isPhaseStatusOverride(value)) {
                      onOverrideChange(name, { status: value });
                    }
                  }}
                  ariaLabel={t('account.merge.phase.status')}
                />
              </div>
            </div>
            <div className="journalit-account-merge-modal__phase-dates">
              <div className="journalit-account-merge-modal__field">
                <span className="journalit-account-merge-modal__field-label">
                  {t('account.merge.phase.started')}
                </span>
                <FastDateTimeInput
                  value={override.startedAt ?? phase?.startedAt}
                  includeTime
                  onChange={(value) =>
                    onOverrideChange(name, { startedAt: toIsoString(value) })
                  }
                />
              </div>
              <div className="journalit-account-merge-modal__field">
                <span className="journalit-account-merge-modal__field-label">
                  {t('account.merge.phase.completed')}
                </span>
                <FastDateTimeInput
                  value={override.completedAt ?? phase?.completedAt}
                  includeTime
                  onChange={(value) =>
                    onOverrideChange(name, {
                      completedAt: toIsoString(value),
                    })
                  }
                />
              </div>
            </div>
            {manualRules && (
              <AccountMergePhaseRules
                rules={override.rules ?? phase?.rules ?? []}
                currencyCode={currency ?? 'USD'}
                startingBalance={phase?.startingBalance ?? 0}
                showPrefillTeaser={showPrefillTeaser}
                offerCatalog={offerCatalog}
                typedFirmName={typedFirmName}
                onChange={(rules) => onOverrideChange(name, { rules })}
                onApplyProfile={onApplyProfile}
              />
            )}
          </section>
        );
      })}

      {trailing.map((phase, offset) => (
        <section
          className="journalit-account-merge-modal__phase is-pending"
          key={phase.id}
        >
          <div className="journalit-account-merge-modal__phase-head">
            <span className="journalit-account-merge-modal__chip-index">
              {selected.length + offset + 1}
            </span>
            <span className="journalit-account-merge-modal__phase-source">
              {phase.name}
            </span>
            <span className="journalit-account-merge-modal__phase-facts">
              <span className="journalit-account-merge-modal__badge">
                {t(STAGE_LABEL_KEYS[phase.stage ?? 'evaluation'])}
              </span>
              <span>{t('account.merge.phase.pending')}</span>
            </span>
          </div>
        </section>
      ))}
    </div>
  );
};





const ReviewStep: React.FC<{
  selected: string[];
  planState: PlanState;
  onEditPhases: () => void;
  onUseProfileBalance: (accountName: string, balance: number) => void;
}> = ({ selected, planState, onEditPhases, onUseProfileBalance }) => {
  const plan = planState.status === 'ready' ? planState.plan : undefined;
  if (!plan) {
    return (
      <div className="journalit-account-merge-modal__loading">
        {t('account.merge.loading')}
      </div>
    );
  }
  const warningGroups = new Map<
    AccountMergeWarning['kind'],
    AccountMergeWarning[]
  >();
  for (const warning of plan.warnings) {
    const group = warningGroups.get(warning.kind);
    if (group) group.push(warning);
    else warningGroups.set(warning.kind, [warning]);
  }
  const notesByAccount = new Map<string, number>();
  const challengeIdentity = plan.targetMetadata.propChallenge;
  for (const name of selected) {
    notesByAccount.set(
      name,
      plan.noteRewrites.filter((rewrite) =>
        rewrite.previousAccount.includes(name)
      ).length
    );
  }

  return (
    <>
      <div className="journalit-account-merge-modal__summary">
        <div className="journalit-account-merge-modal__summary-main">
          <span className="journalit-account-merge-modal__summary-name">
            {plan.targetAccountName}
          </span>
          {(challengeIdentity?.firmName ||
            challengeIdentity?.challengeName) && (
            <span className="journalit-account-merge-modal__summary-sub">
              {[challengeIdentity.firmName, challengeIdentity.challengeName]
                .filter(Boolean)
                .join(' · ')}
            </span>
          )}
        </div>
        <div className="journalit-account-merge-modal__summary-stats">
          <span>
            <strong>{plan.phases.length}</strong>{' '}
            {t('account.merge.review.phases')}
          </span>
          <span>
            <strong>{plan.noteRewrites.length}</strong>{' '}
            {t('account.merge.review.notes')}
          </span>
          <span>
            <strong>{plan.sourcesToArchive.length}</strong>{' '}
            {t('account.merge.review.archived')}
          </span>
        </div>
      </div>

      <div className="journalit-account-merge-modal__table">
        <div className="journalit-account-merge-modal__table-head">
          <span />
          <span>{t('account.merge.step.phases')}</span>
          <span />
          <span />
          <span>{t('account.merge.review.notes')}</span>
          <span>{t('account.merge.review.identities')}</span>
        </div>
        {plan.phases.map((phase, index) => (
          <div
            className="journalit-account-merge-modal__table-row"
            key={phase.id}
          >
            <span className="journalit-account-merge-modal__chip-index">
              {index + 1}
            </span>
            <span className="journalit-account-merge-modal__table-name">
              {phase.name}
              {phase.legacyAccountName &&
                phase.legacyAccountName !== phase.name && (
                  <span className="journalit-account-merge-modal__table-sub">
                    {phase.legacyAccountName}
                  </span>
                )}
            </span>
            <span className="journalit-account-merge-modal__badge">
              {phase.status === 'pending'
                ? t('account.merge.phase.pending')
                : t(STATUS_LABEL_KEYS[phase.status])}
            </span>
            <span className="journalit-account-merge-modal__table-dates">
              {formatShortDate(phase.startedAt)}
              {' → '}
              {phase.completedAt
                ? formatShortDate(phase.completedAt)
                : t('account.merge.review.open')}
            </span>
            <span className="journalit-account-merge-modal__table-count">
              {phase.legacyAccountName
                ? (notesByAccount.get(phase.legacyAccountName) ?? 0)
                : '—'}
            </span>
            <span className="journalit-account-merge-modal__table-count">
              {phase.brokerAccountIds?.length ?? 0}
            </span>
          </div>
        ))}
      </div>

      {warningGroups.size > 0 && (
        <section className="journalit-account-merge-modal__section">
          {Array.from(warningGroups.entries()).map(([kind, warnings]) => (
            <details
              className="journalit-account-merge-modal__warning-group"
              key={kind}
            >
              <summary className="journalit-account-merge-modal__warning-summary">
                <AlertTriangle size={14} />
                {t(WARNING_LABEL_KEYS[kind])}
                <span className="journalit-account-merge-modal__warning-count">
                  {warnings.length}
                </span>
              </summary>
              <ul className="journalit-account-merge-modal__warning-items">
                {warnings.map((warning) => (
                  <li key={warningKey(warning)}>
                    <span>{warningDetail(warning)}</span>
                    {warning.kind ===
                      'starting_balance_differs_from_profile' && (
                      <Button
                        variant="plain"
                        size="small"
                        onClick={() =>
                          onUseProfileBalance(
                            warning.sourceAccountName,
                            warning.profileBalance
                          )
                        }
                      >
                        {t('account.merge.warning.use-profile-balance')}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
              {kind === 'trade_outside_phase_window' && (
                <div className="journalit-account-merge-modal__warning-actions">
                  <Button variant="plain" size="small" onClick={onEditPhases}>
                    {t('account.merge.warning.edit-phases')}
                  </Button>
                </div>
              )}
            </details>
          ))}
        </section>
      )}
    </>
  );
};








const AccountMergeModalContent: React.FC<{
  plugin: JournalitPlugin;
  options: AccountMergeModalOptions;
  onDone: (outcome: AccountMergeOutcome) => void;
  onStepChange: (step: WizardStep) => void;
}> = ({ plugin, options, onDone, onStepChange }) => {
  const lockedAccounts = !!options.accounts?.length;
  const steps: WizardStep[] = lockedAccounts
    ? ['challenge', 'phases', 'review']
    : ['accounts', 'challenge', 'phases', 'review'];
  const [step, setStepState] = useState<WizardStep>(steps[0]);
  
  const setStep = (next: WizardStep) => {
    onStepChange(next);
    setStepState(next);
  };
  const [candidates, setCandidates] = useState<AccountMergeCandidate[] | null>(
    null
  );
  const [showArchived, setShowArchived] = useState(false);
  const [selected, setSelected] = useState<string[]>(options.accounts ?? []);
  const [targetMode, setTargetMode] = useState<'keep' | 'new'>('keep');
  const [targetKeep, setTargetKeep] = useState('');
  const [targetName, setTargetName] = useState('');
  const [identity, setIdentity] = useState<AccountMergeIdentity>({
    firmName: '',
    challengeName: '',
  });
  const [profile, setProfile] = useState<PropFirmProfileSelection>();
  const isPro = useWizardProTier(plugin);

  
  
  const applyProfile = async (next: PropFirmProfileSelection | undefined) => {
    if (next) {
      const typedRules = hasEditedAccountMergeRules(Object.values(overrides));
      if (
        typedRules &&
        !(await showConfirmationModal(plugin.app, {
          title: t('account.merge.profile.replace-rules.title'),
          message: [
            {
              text: t('account.merge.profile.replace-rules.body', {
                firm: next.firmName,
              }),
            },
          ],
          confirmLabel: t('account.merge.profile.replace-rules.confirm'),
          cancelLabel: t('button.cancel'),
        }))
      ) {
        return;
      }
      setOverrides((current) =>
        Object.fromEntries(
          Object.entries(current).map(([name, override]) => {
            const rest = { ...override };
            delete rest.rules;
            return [name, rest];
          })
        )
      );
      setIdentity({
        firmName: next.firmName,
        challengeName: next.challenge.name,
      });
    }
    setProfile(next);
  };
  const [overrides, setOverrides] = useState<Record<string, PhaseOverride>>({});
  const [planState, setPlanState] = useState<PlanState>({ status: 'idle' });
  const [running, setRunning] = useState(false);
  const [executeError, setExecuteError] = useState<string | null>(null);

  const accountPageService = plugin.accountPageService;
  const mergeService = plugin.accountMergeService;

  useEffect(() => {
    if (!accountPageService) return;
    let cancelled = false;
    void (async () => {
      const catalog = await accountPageService.getAccountCatalog();
      const eligible: AccountMergeCandidate[] = [];
      for (const entry of catalog) {
        const metadata = accountPageService.getAccountMetadataEntry(
          entry.name
        )?.metadata;
        if (!metadata || metadata.propChallenge) continue;
        eligible.push({
          name: entry.name,
          accountType: entry.accountType,
          archived: entry.archived,
          currency: entry.currency,
          createdDate: toIsoDate(metadata.createdDate),
        });
      }
      if (!cancelled) setCandidates(sortCandidatesByCreatedDate(eligible));
    })();
    return () => {
      cancelled = true;
    };
  }, [accountPageService]);

  const catalogOrder = useMemo(() => {
    const order = new Map<string, number>();
    (candidates ?? []).forEach((candidate, index) =>
      order.set(candidate.name, index)
    );
    return order;
  }, [candidates]);

  const single = selected.length === 1;
  const effectiveKeep = selected.includes(targetKeep)
    ? targetKeep
    : (selected[selected.length - 1] ?? '');
  const targetAccountName = single
    ? selected[0]
    : targetMode === 'new'
      ? targetName.trim()
      : effectiveKeep;
  const currency = candidates?.find(
    (candidate) => candidate.name === selected[0]
  )?.currency;

  const sourceInputs: AccountMergeBuildSourceInput[] = useMemo(
    () =>
      selected.map((name) => ({
        accountName: name,
        ...(overrides[name] ?? {}),
      })),
    [selected, overrides]
  );

  useEffect(() => {
    if (!mergeService) return;
    if (sourceInputs.length < 1 || !targetAccountName) {
      setPlanState({ status: 'idle' });
      return;
    }
    let cancelled = false;
    setPlanState((current) => ({ status: 'loading', plan: current.plan }));
    const handle = window.setTimeout(() => {
      void (async () => {
        let input: AccountMergePlanInput;
        try {
          input = await mergeService.buildPlanInput(
            targetAccountName,
            sourceInputs
          );
        } catch (error) {
          if (cancelled) return;
          setPlanState((current) =>
            error instanceof AccountMergePlanError
              ? { status: 'error', code: error.code, plan: current.plan }
              : {
                  status: 'error',
                  message: errorMessage(error),
                  plan: current.plan,
                }
          );
          return;
        }
        if (cancelled) return;
        const planInput: AccountMergePlanInput = {
          ...input,
          ...(profile ? { profile } : {}),
          ...(identity.challengeName.trim()
            ? { challengeName: identity.challengeName }
            : {}),
          ...(identity.firmName.trim() ? { firmName: identity.firmName } : {}),
        };
        try {
          const plan = mergeService.plan(planInput);
          setPlanState({ status: 'ready', plan });
        } catch (error) {
          if (cancelled) return;
          if (!(error instanceof AccountMergePlanError)) {
            setPlanState((current) => ({
              status: 'error',
              message: errorMessage(error),
              plan: current.plan,
            }));
            return;
          }
          const row =
            error.code === 'invalid_override'
              ? findInvalidOverrideRow(
                  planInput.sources.map((source) => ({
                    startedAt: source.startedAt,
                    completedAt: source.completedAt,
                  }))
                )
              : error.code === 'timeline_not_monotonic'
                ? locatePlanErrorRow(planInput, error.code)
                : undefined;
          setPlanState((current) => ({
            status: 'error',
            code: error.code,
            row,
            plan: current.plan,
          }));
        }
      })();
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [
    identity.challengeName,
    identity.firmName,
    mergeService,
    targetAccountName,
    sourceInputs,
    profile,
  ]);

  const toggleAccount = (name: string, checked: boolean) => {
    setSelected((current) => {
      if (!checked) return current.filter((entry) => entry !== name);
      if (current.includes(name)) return current;
      const rank = catalogOrder.get(name) ?? Number.MAX_SAFE_INTEGER;
      const insertAt = current.findIndex(
        (entry) => (catalogOrder.get(entry) ?? Number.MAX_SAFE_INTEGER) > rank
      );
      if (insertAt < 0) return [...current, name];
      return [...current.slice(0, insertAt), name, ...current.slice(insertAt)];
    });
  };

  const moveAccount = (index: number, delta: number) => {
    setSelected((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const patchOverride = (name: string, patch: PhaseOverride) => {
    setOverrides((current) => ({
      ...current,
      [name]: { ...(current[name] ?? {}), ...patch },
    }));
  };

  const stepIndex = steps.indexOf(step);
  const hasIncompleteRules = hasIncompleteAccountMergeRules(
    selected.map((name) => overrides[name]?.rules),
    Boolean(profile)
  );
  const canAdvance =
    step === 'accounts'
      ? selected.length >= 1
      : step === 'challenge'
        ? targetAccountName !== '' && planState.status !== 'error'
        : planState.status === 'ready' && !hasIncompleteRules;

  const runMerge = async () => {
    const plan = planState.status === 'ready' ? planState.plan : undefined;
    if (!plan || !mergeService || hasIncompleteRules) return;
    setRunning(true);
    setExecuteError(null);
    try {
      await mergeService.execute(plan);
    } catch (error) {
      setRunning(false);
      setExecuteError(
        error instanceof Error
          ? error.message
          : t('account.merge.error.unknown')
      );
      return;
    }
    options.onMerged?.(plan.targetAccountName);
    onDone('merged');
  };

  const primaryLabel =
    step === 'review'
      ? single
        ? t('account.merge.action.convert')
        : t('account.merge.action.merge')
      : t('button.next');

  return (
    <>
      <StepperHeader steps={steps} step={step} sequence={options.sequence} />
      {step === 'challenge' && (
        <ModalGuide
          plugin={plugin}
          identity={ACCOUNT_MERGE_CHALLENGE_PAGE_GUIDE.identity}
          steps={ACCOUNT_MERGE_CHALLENGE_PAGE_GUIDE.steps}
        />
      )}
      {step === 'phases' && (
        <ModalGuide
          plugin={plugin}
          identity={ACCOUNT_MERGE_PHASES_PAGE_GUIDE.identity}
          steps={ACCOUNT_MERGE_PHASES_PAGE_GUIDE.steps}
        />
      )}
      {step === 'review' && (
        <ModalGuide
          plugin={plugin}
          identity={ACCOUNT_MERGE_REVIEW_PAGE_GUIDE.identity}
          steps={ACCOUNT_MERGE_REVIEW_PAGE_GUIDE.steps}
        />
      )}
      <div className="journalit-account-merge-modal__content">
        {step === 'accounts' && (
          <AccountsStep
            candidates={candidates}
            showArchived={showArchived}
            onShowArchivedChange={setShowArchived}
            selected={selected}
            onToggle={toggleAccount}
          />
        )}
        {step === 'challenge' && (
          <ChallengeStep
            selected={selected}
            lockedAccounts={lockedAccounts}
            onMove={moveAccount}
            targetMode={targetMode}
            onTargetModeChange={setTargetMode}
            targetKeep={effectiveKeep}
            onTargetKeepChange={setTargetKeep}
            targetName={targetName}
            onTargetNameChange={setTargetName}
            plugin={plugin}
            isPro={isPro}
            currency={currency}
            identity={identity}
            onIdentityChange={setIdentity}
            profile={profile}
            onProfileChange={applyProfile}
          />
        )}
        {step === 'phases' && (
          <div>
            <PhasesStep
              selected={selected}
              overrides={overrides}
              onOverrideChange={patchOverride}
              planState={planState}
              currency={currency}
              manualRules={!profile}
              showPrefillTeaser={!isPro}
              offerCatalog={isPro && !profile}
              typedFirmName={identity.firmName}
              onApplyProfile={(selection) => void applyProfile(selection)}
            />
            {hasIncompleteRules && (
              <div
                className="journalit-account-merge-modal__alert is-error"
                role="alert"
              >
                <AlertTriangle size={16} />
                <span>{t('account.create.error.rule-incomplete')}</span>
              </div>
            )}
          </div>
        )}
        {step === 'review' && (
          <div data-journalit-guide-target="account-merge.review">
            <ReviewStep
              selected={selected}
              planState={planState}
              onEditPhases={() => setStep('phases')}
              onUseProfileBalance={(accountName, balance) =>
                patchOverride(accountName, { startingBalance: balance })
              }
            />
          </div>
        )}
      </div>

      {step !== 'accounts' && <PlanErrorRow state={planState} />}
      {executeError && (
        <div className="journalit-account-merge-modal__error" role="alert">
          <AlertTriangle size={14} />
          {executeError}
        </div>
      )}

      <div className="journalit-account-merge-modal__actions">
        {stepIndex > 0 && (
          <Button
            variant="plain"
            disabled={running}
            onClick={() => setStep(steps[stepIndex - 1])}
          >
            {t('button.back')}
          </Button>
        )}
        <span
          aria-hidden="true"
          className="journalit-account-merge-modal__actions-spacer"
        />
        <Button
          variant="plain"
          disabled={running}
          onClick={() => onDone('cancelled')}
        >
          {t('button.cancel')}
        </Button>
        {step === 'review' ? (
          <Button
            variant="primary"
            disabled={
              running || planState.status !== 'ready' || hasIncompleteRules
            }
            onClick={() => void runMerge()}
          >
            <GitMerge size={14} />
            {primaryLabel}
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={!canAdvance}
            onClick={() => setStep(steps[stepIndex + 1])}
          >
            {primaryLabel}
          </Button>
        )}
      </div>
    </>
  );
};

class AccountMergeModal extends Modal {
  private root: Root | null = null;
  private settled = false;

  constructor(
    app: App,
    private readonly plugin: JournalitPlugin,
    private readonly options: AccountMergeModalOptions,
    private readonly resolveOutcome: (outcome: AccountMergeOutcome) => void
  ) {
    super(app);
    this.titleEl.setText(t('account.merge.title'));
    this.modalEl.addClass('journalit-account-merge-modal');
    this.applyStepWidth(options.accounts?.length ? 'challenge' : 'accounts');
  }

  private applyStepWidth(step: WizardStep): void {
    this.modalEl.toggleClass(
      'is-compact',
      step === 'accounts' || step === 'challenge'
    );
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    const container = contentEl.createDiv({
      cls: 'journalit-account-merge-modal__body',
    });
    this.root = createRoot(container);
    this.root.render(
      <CurrencyProvider>
        <DisplayPolicyProvider privacyModeOverride={false}>
          <AccountMergeModalContent
            plugin={this.plugin}
            options={this.options}
            onDone={(outcome) => this.settle(outcome)}
            onStepChange={(step) => this.applyStepWidth(step)}
          />
        </DisplayPolicyProvider>
      </CurrencyProvider>
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    if (!this.settled) {
      this.settled = true;
      this.resolveOutcome('cancelled');
    }
  }

  private settle(outcome: AccountMergeOutcome): void {
    if (this.settled) return;
    this.settled = true;
    this.resolveOutcome(outcome);
    this.close();
  }
}

export async function openAccountMergeModal(
  app: App,
  plugin: JournalitPlugin,
  options: AccountMergeModalOptions = {}
): Promise<AccountMergeOutcome> {
  await ensureAccountMergeServices(plugin);
  return new Promise((resolve) => {
    new AccountMergeModal(app, plugin, options, resolve).open();
  });
}
