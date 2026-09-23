import React, { useEffect, useRef, useState } from 'react';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { BackendSecretStorage } from '../../../../services/backend/BackendSecretStorage';
import {
  addPropChallengePhase,
  createPropChallengePhase,
  removePropChallengePhase,
  updatePropChallengePhase,
  validatePhaseTimeline,
} from '../../../../services/propChallenge/PropChallengeConfig';
import { resolveStageAccountType } from '../../../../services/propChallenge/stageAccountTypes';
import type {
  PropChallengeConfig,
  PropChallengeStage,
} from '../../../../services/propChallenge/types';
import { getAvailableAccountTypes } from './propChallengeLifecycleActions';
import { Button } from '../../../ui/Button';
import { PhaseEditor } from './PhaseEditor';
import { PropChallengeCostsEditor } from './PropChallengeCostsEditor';
import { PropFirmProfilePicker } from './PropFirmProfilePicker';
import {
  PropFirmPrefillHeadingLink,
  PropFirmPrefillMatch,
  usePropFirmIndex,
} from './PropFirmPrefillTeaser';
import { observeSelectedPhaseStep } from './phaseTimelineScroll';
import { PersonalProfileLibrary } from './PersonalProfileLibrary';
import { CollapsibleSection } from '../../../shared/CollapsibleSection';

interface Props {
  value: PropChallengeConfig | undefined;
  currencyCode: string;
  disabled: boolean;
  existingAccount: boolean;
  accountType: string;
  onChange: (value: PropChallengeConfig) => void;
  onAccountTypeChange: (accountType: string) => void;
}

export function PropChallengeSettingsSection({
  value,
  currencyCode,
  disabled,
  existingAccount,
  accountType,
  onChange,
  onAccountTypeChange,
}: Props) {
  const plugin = usePlugin();
  const [selectedPhaseId, setSelectedPhaseId] = useState('');
  const phaseTimelineRef = useRef<HTMLElement>(null);
  
  
  
  const firmIndex = usePropFirmIndex();
  const showProfilePicker = Boolean(
    plugin?.settings.backendIntegration?.subscriptionTier === 'premium' &&
    BackendSecretStorage.hasAuthToken(plugin)
  );
  
  
  
  const showPrefillTeaser = !showProfilePicker && !existingAccount;
  const selectedPhase =
    value?.phases.find((phase) => phase.id === selectedPhaseId) ??
    value?.phases.find((phase) => phase.id === value.currentPhaseId) ??
    value?.phases[0];

  useEffect(() => {
    const timeline = phaseTimelineRef.current;
    if (!timeline) return;
    return observeSelectedPhaseStep(timeline);
  }, [selectedPhase?.id, value?.phases.length]);

  if (!value) return null;

  const timelineError = validatePhaseTimeline(value);

  const alignAccountType = (stage: PropChallengeStage) => {
    const resolved = resolveStageAccountType(
      plugin?.settings.account?.challengeStageAccountTypes,
      stage,
      getAvailableAccountTypes(plugin)
    );
    if (resolved && resolved !== accountType) onAccountTypeChange(resolved);
  };

  const addPhase = () => {
    if (!value) return;
    const phase = createPropChallengePhase(
      t('account.prop-challenge.default-phase-name', {
        number: String(value.phases.length + 1),
      })
    );
    setSelectedPhaseId(phase.id);
    onChange(addPropChallengePhase(value, phase));
  };

  const removeSelectedPhase = () => {
    if (!value || !selectedPhase || value.phases.length <= 1) return;
    const selectedIndex = value.phases.findIndex(
      (phase) => phase.id === selectedPhase.id
    );
    const nextSelection =
      value.phases[selectedIndex + 1] ?? value.phases[selectedIndex - 1];
    setSelectedPhaseId(nextSelection?.id ?? '');
    const next = removePropChallengePhase(value, selectedPhase.id);
    
    
    
    
    const promoted = next.phases.find(
      (phase) => phase.id === next.currentPhaseId
    );
    if (promoted) alignAccountType(promoted.stage ?? 'evaluation');
    onChange(next);
  };

  const firmNameField = value ? (
    <label className="journalit-prop-challenge-field">
      <span>{t('account.prop-challenge.firm-name')}</span>
      <input
        value={value.firmName ?? ''}
        placeholder={t('account.prop-challenge.firm-name-placeholder')}
        onChange={(event) =>
          onChange({
            ...value,
            firmName: event.target.value || undefined,
          })
        }
        disabled={disabled}
      />
    </label>
  ) : null;

  const challengeNameField = value ? (
    <label className="journalit-prop-challenge-field">
      <span>{t('account.prop-challenge.challenge-name')}</span>
      <input
        value={value.challengeName}
        placeholder={t('account.prop-challenge.challenge-name-placeholder')}
        onChange={(event) =>
          onChange({ ...value, challengeName: event.target.value })
        }
        disabled={disabled}
      />
    </label>
  ) : null;

  return (
    <div className="setting-item journalit-setting-item--full-width journalit-prop-challenge-section">
      <>
        <div className="journalit-prop-challenge-profile-identity">
          <div className="journalit-prop-challenge-identity-heading-row">
            <strong className="journalit-prop-challenge-identity-heading">
              {t('account.prop-challenge.identity')}
            </strong>
            {showPrefillTeaser && (
              <PropFirmPrefillHeadingLink firms={firmIndex} />
            )}
          </div>
          {showProfilePicker && !existingAccount && (
            <PropFirmProfilePicker
              value={value}
              disabled={disabled}
              firmNameField={firmNameField}
              currencyCode={currencyCode}
              challengeNameField={challengeNameField}
              onChange={(nextValue) => {
                setSelectedPhaseId(
                  nextValue.currentPhaseId ?? nextValue.phases[0]?.id ?? ''
                );
                onChange(nextValue);
                const firstPhase = nextValue.phases[0];
                if (firstPhase) {
                  alignAccountType(firstPhase.stage ?? 'evaluation');
                }
              }}
            />
          )}
          {(!showProfilePicker || existingAccount) && (
            <>
              
              <div className="journalit-prop-challenge-identity-block">
                <div className="journalit-prop-challenge-identity">
                  {firmNameField}
                  {challengeNameField}
                </div>
                {showPrefillTeaser && (
                  <PropFirmPrefillMatch
                    firms={firmIndex}
                    typedFirmName={value?.firmName ?? ''}
                  />
                )}
              </div>
            </>
          )}
          <PersonalProfileLibrary
            value={value}
            currencyCode={currencyCode}
            disabled={disabled}
            existingAccount={existingAccount}
            onChange={(next) => {
              onChange(next);
              const firstPhase = next.phases[0];
              if (firstPhase) {
                alignAccountType(firstPhase.stage ?? 'evaluation');
              }
            }}
          />
        </div>
        <div className="journalit-prop-challenge-phase-workspace">
          <nav
            ref={phaseTimelineRef}
            className="journalit-prop-challenge-phase-timeline"
            aria-label={t('account.prop-challenge.title')}
          >
            {value.phases.map((phase) => {
              const selected = phase.id === selectedPhase?.id;
              const current = phase.id === value.currentPhaseId;
              return (
                <button
                  key={phase.id}
                  type="button"
                  className={`journalit-prop-challenge-phase-step${selected ? ' is-selected' : ''}${current ? ' is-current' : ''}`}
                  aria-pressed={selected}
                  aria-current={current ? 'step' : undefined}
                  onClick={() => setSelectedPhaseId(phase.id)}
                  disabled={disabled}
                >
                  <span className="journalit-prop-challenge-phase-step-marker" />
                  <span className="journalit-prop-challenge-phase-step-label">
                    {phase.name || t('account.prop-challenge.unnamed-phase')}
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="journalit-prop-challenge-phase-actions">
            <Button
              variant="plain"
              size="small"
              onClick={addPhase}
              disabled={disabled}
            >
              {t('account.prop-challenge.add-phase')}
            </Button>
            <Button
              variant="plain"
              size="small"
              onClick={removeSelectedPhase}
              disabled={
                disabled ||
                value.phases.length <= 1 ||
                Boolean(selectedPhase?.policyHistory?.length) ||
                (value.status !== 'active' &&
                  selectedPhase?.id === value.currentPhaseId)
              }
            >
              {t('account.prop-challenge.remove-phase')}
            </Button>
          </div>
          {selectedPhase && (
            <PhaseEditor
              key={selectedPhase.id}
              phase={selectedPhase}
              phases={value.phases}
              currencyCode={currencyCode}
              disabled={
                disabled || Boolean(selectedPhase.policyHistory?.length)
              }
              datesDisabled={disabled}
              onChange={(nextPhase) =>
                onChange(updatePropChallengePhase(value, nextPhase))
              }
              onStageChange={(stage) => {
                if (selectedPhase.id === value.currentPhaseId) {
                  alignAccountType(stage);
                }
              }}
            />
          )}
          {timelineError && (
            <div className="error-message-inline">{timelineError}</div>
          )}
        </div>
        {selectedPhase?.policyHistory && (
          <CollapsibleSection
            className="journalit-profile-history"
            title={t('account.profiles.history')}
            defaultOpen={false}
          >
            <div className="journalit-profile-history__entries">
              <p>{t('account.profiles.history-help')}</p>
              {selectedPhase.policyHistory.map((revision) => (
                <CollapsibleSection
                  key={revision.effectiveAt}
                  title={new Date(revision.effectiveAt).toLocaleString()}
                  defaultOpen={false}
                  className="journalit-profile-history__entry"
                >
                  <div className="journalit-profile-history__entries">
                    {revision.transition?.basis === 'custom' && (
                      <p>
                        {t('account.profiles.custom-transition')}:{' '}
                        {revision.transition.source}
                      </p>
                    )}
                    <PhaseEditor
                      phase={{
                        ...selectedPhase,
                        rules: revision.rules,
                        payoutPolicy: revision.payoutPolicy,
                      }}
                      phases={value.phases}
                      currencyCode={currencyCode}
                      disabled
                      onChange={() => {}}
                    />
                  </div>
                </CollapsibleSection>
              ))}
            </div>
          </CollapsibleSection>
        )}
        <PropChallengeCostsEditor
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      </>
    </div>
  );
}
