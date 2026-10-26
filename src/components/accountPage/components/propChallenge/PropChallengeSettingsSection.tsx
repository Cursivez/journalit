import React, { useContext, useState } from 'react';
import { DateDraftGateContext } from '../../../core/DateDraftGate';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { BackendSecretStorage } from '../../../../services/backend/BackendSecretStorage';
import {
  addPropChallengePhase,
  createPropChallengePhase,
  removePropChallengePhase,
  reopenChallenge,
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
import { Plus } from '../../../shared/icons/ObsidianIcon';
import { PhaseEditor } from './PhaseEditor';
import { PropChallengeCostsEditor } from './PropChallengeCostsEditor';
import { PropFirmProfilePicker } from './PropFirmProfilePicker';
import {
  PropFirmPrefillHeadingLink,
  PropFirmPrefillMatch,
  usePropFirmIndex,
} from './PropFirmPrefillTeaser';
import { PhaseTimeline } from './PhaseTimeline';
import { PhasePolicyHistory } from './PhasePolicyHistory';
import { PersonalProfileLibrary } from './PersonalProfileLibrary';

interface Props {
  value: PropChallengeConfig | undefined;
  currencyCode: string;
  disabled: boolean;
  existingAccount: boolean;
  accountType: string;
  onChange: (value: PropChallengeConfig) => void;
  onAccountTypeChange: (accountType: string) => void;
  
  monthlyCostField: React.ReactNode;
}

type ChallengePhase = PropChallengeConfig['phases'][number];


function resolveSelectedPhase(
  value: PropChallengeConfig | undefined,
  selectedPhaseId: string
): ChallengePhase | undefined {
  if (!value) return undefined;
  return (
    value.phases.find((phase) => phase.id === selectedPhaseId) ??
    value.phases.find((phase) => phase.id === value.currentPhaseId) ??
    value.phases[0]
  );
}


const hasLinkedIdentity = (
  value: PropChallengeConfig,
  existingAccount: boolean
): boolean =>
  existingAccount &&
  value.profileRef !== undefined &&
  Boolean(value.firmName?.trim() && value.challengeName.trim());


const isPhaseRemovable = (
  value: PropChallengeConfig,
  selectedPhase: ChallengePhase | undefined
): boolean =>
  value.phases.length > 1 &&
  !selectedPhase?.policyHistory?.length &&
  !(value.status !== 'active' && selectedPhase?.id === value.currentPhaseId);


const canPickCatalogProfile = (plugin: ReturnType<typeof usePlugin>) =>
  Boolean(
    plugin?.settings.backendIntegration?.subscriptionTier === 'premium' &&
    BackendSecretStorage.hasAuthToken(plugin)
  );


const isReopenablePhase = (
  value: PropChallengeConfig,
  selectedPhase: ChallengePhase | undefined
): boolean =>
  value.status === 'failed' && selectedPhase?.id === value.currentPhaseId;

interface NameFieldProps {
  value: PropChallengeConfig;
  disabled: boolean;
  onChange: (value: PropChallengeConfig) => void;
}

const FirmNameField: React.FC<NameFieldProps> = ({
  value,
  disabled,
  onChange,
}) => (
  <label className="journalit-prop-challenge-field">
    <span>
      {t('account.prop-challenge.firm-name')}{' '}
      <span className="setting-item-name-optional">
        {t('form.field.optional')}
      </span>
    </span>
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
);

const ChallengeNameField: React.FC<NameFieldProps> = ({
  value,
  disabled,
  onChange,
}) => (
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
);


const PhaseWorkspace: React.FC<{
  value: PropChallengeConfig;
  selectedPhase: ChallengePhase | undefined;
  currencyCode: string;
  disabled: boolean;
  onSelectPhase: (id: string) => void;
  onAddPhase: () => void;
  onRemovePhase: () => void;
  
  onReopenPhase: (() => void) | undefined;
  onChange: (value: PropChallengeConfig) => void;
  
  onCurrentStageChange: (stage: PropChallengeStage) => void;
}> = ({
  value,
  selectedPhase,
  currencyCode,
  disabled,
  onSelectPhase,
  onAddPhase,
  onRemovePhase,
  onReopenPhase,
  onChange,
  onCurrentStageChange,
}) => {
  const timelineError = validatePhaseTimeline(value);
  return (
    <div className="journalit-prop-challenge-phase-workspace">
      <PhaseTimeline
        phases={value.phases}
        selectedPhaseId={selectedPhase?.id}
        currentPhaseId={value.currentPhaseId}
        disabled={disabled}
        onSelect={onSelectPhase}
      />
      <div className="journalit-prop-challenge-phase-actions">
        <Button size="small" onClick={onAddPhase} disabled={disabled}>
          <Plus size={15} aria-hidden="true" />
          {t('account.prop-challenge.add-phase')}
        </Button>
        {onReopenPhase && (
          <Button size="small" onClick={onReopenPhase} disabled={disabled}>
            {t('account.prop-challenge.actions.reopen')}
          </Button>
        )}
        <Button
          size="small"
          onClick={onRemovePhase}
          disabled={disabled || !isPhaseRemovable(value, selectedPhase)}
        >
          {t('account.prop-challenge.remove-phase')}
        </Button>
      </div>
      {selectedPhase && (
        <PhaseEditor
          key={selectedPhase.id}
          phase={selectedPhase}
          profileRef={value.profileRef}
          phases={value.phases}
          currencyCode={currencyCode}
          disabled={disabled || Boolean(selectedPhase.policyHistory?.length)}
          datesDisabled={disabled}
          onChange={(nextPhase) =>
            onChange(updatePropChallengePhase(value, nextPhase))
          }
          onStageChange={(stage) => {
            if (selectedPhase.id === value.currentPhaseId) {
              onCurrentStageChange(stage);
            }
          }}
        />
      )}
      {timelineError && (
        <div className="error-message-inline">{timelineError}</div>
      )}
    </div>
  );
};

export function PropChallengeSettingsSection({
  value,
  currencyCode,
  disabled,
  existingAccount,
  accountType,
  onChange,
  onAccountTypeChange,
  monthlyCostField,
}: Props) {
  const plugin = usePlugin();
  const dateDraftGate = useContext(DateDraftGateContext);
  const [selectedPhaseId, setSelectedPhaseId] = useState('');
  
  
  
  const firmIndex = usePropFirmIndex();
  const showProfilePicker = canPickCatalogProfile(plugin);
  
  
  
  const showPrefillTeaser = !showProfilePicker && !existingAccount;
  const selectedPhase = resolveSelectedPhase(value, selectedPhaseId);

  if (!value) return null;

  const alignAccountType = (stage: PropChallengeStage) => {
    const resolved = resolveStageAccountType(
      plugin?.settings.account?.challengeStageAccountTypes,
      stage,
      getAvailableAccountTypes(plugin)
    );
    if (resolved && resolved !== accountType) onAccountTypeChange(resolved);
  };

  const addPhase = () => {
    if (dateDraftGate && !dateDraftGate.confirm()) return;
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

  const canReopenSelectedPhase = isReopenablePhase(value, selectedPhase);

  const reopenSelectedPhase = () => {
    if (!canReopenSelectedPhase || !selectedPhase) return;
    alignAccountType(selectedPhase.stage ?? 'evaluation');
    onChange(reopenChallenge(value));
  };

  const showsLinkedIdentity = hasLinkedIdentity(value, existingAccount);
  
  const showsIdentityFields = existingAccount
    ? !showsLinkedIdentity
    : !showProfilePicker;
  const firmNameField = (
    <FirmNameField value={value} disabled={disabled} onChange={onChange} />
  );
  const challengeNameField = (
    <ChallengeNameField value={value} disabled={disabled} onChange={onChange} />
  );

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
          {showsLinkedIdentity && (
            
            
            <p className="journalit-prop-challenge-linked-identity">
              {value.firmName} · {value.challengeName}
            </p>
          )}
          {showsIdentityFields && (
            <>
              
              <div className="journalit-prop-challenge-identity-block">
                <div className="journalit-prop-challenge-identity">
                  {firmNameField}
                  {challengeNameField}
                </div>
                {showPrefillTeaser && (
                  <PropFirmPrefillMatch
                    firms={firmIndex}
                    typedFirmName={value.firmName ?? ''}
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
            
            
            
            showPicker={!showProfilePicker}
            onChange={(next) => {
              if (dateDraftGate && !dateDraftGate.confirm()) return;
              onChange(next);
              const firstPhase = next.phases[0];
              if (firstPhase) {
                alignAccountType(firstPhase.stage ?? 'evaluation');
              }
            }}
          />
        </div>
        <PhaseWorkspace
          value={value}
          selectedPhase={selectedPhase}
          currencyCode={currencyCode}
          disabled={disabled}
          onSelectPhase={(id) => {
            if (dateDraftGate && !dateDraftGate.confirm()) return;
            setSelectedPhaseId(id);
          }}
          onAddPhase={addPhase}
          onRemovePhase={removeSelectedPhase}
          onReopenPhase={
            canReopenSelectedPhase ? reopenSelectedPhase : undefined
          }
          onChange={onChange}
          onCurrentStageChange={alignAccountType}
        />
        {selectedPhase && (
          <PhasePolicyHistory
            phase={selectedPhase}
            phases={value.phases}
            currencyCode={currencyCode}
          />
        )}
        <PropChallengeCostsEditor
          monthlyCostField={monthlyCostField}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      </>
    </div>
  );
}
