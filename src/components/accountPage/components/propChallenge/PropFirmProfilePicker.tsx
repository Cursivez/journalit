import React, { useContext, useEffect, useReducer, useState } from 'react';
import { DateDraftGateContext } from '../../../core/DateDraftGate';
import { t } from '../../../../lang/helpers';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useService } from '../../../../hooks/useService';
import { useEventBus } from '../../../../hooks/useEventBus';
import { replacePropChallengeWithProfile } from '../../../../services/propChallenge/PropChallengeConfig';
import { personalProfileSelection } from '../../../../services/propChallenge/PersonalPropFirmProfiles';
import type {
  PropChallengeConfig,
  PropFirmProfileCatalog,
  PropFirmProfileSelection,
} from '../../../../services/propChallenge/types';
import { showConfirmationModal } from '../../../shared/ConfirmationModal';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import {
  isUntouchedChallengeConfig,
  markUntouchedChallengeConfig,
} from './untouchedChallengeConfigs';

interface Props {
  value: PropChallengeConfig;
  disabled: boolean;
  currencyCode: string;
  
  firmNameField: React.ReactNode;
  challengeNameField: React.ReactNode;
  onChange: (value: PropChallengeConfig) => void;
}


const SAVED_PROFILES = '__saved-profiles';
const CUSTOM_FIRM = '__custom-firm';


function hasTypedIdentity(value: PropChallengeConfig): boolean {
  return (
    !value.profileRef &&
    Boolean(value.firmName?.trim() || value.challengeName.trim())
  );
}


function appliedSelection(value: PropChallengeConfig): {
  firmId: string;
  challengeId: string;
} {
  const ref = value.profileRef;
  if (!ref) return { firmId: '', challengeId: '' };
  return {
    firmId: ref.source === 'personal' ? SAVED_PROFILES : ref.firmId,
    challengeId: ref.challengeId,
  };
}

type LoadStatus = 'loading' | 'ready' | 'failed';
interface CatalogState {
  catalog?: PropFirmProfileCatalog;
  status: LoadStatus;
}
type CatalogAction =
  | { type: 'refreshing'; catalog?: PropFirmProfileCatalog }
  | { type: 'settled'; catalog?: PropFirmProfileCatalog; refreshed: boolean };

function catalogReducer(
  state: CatalogState,
  action: CatalogAction
): CatalogState {
  switch (action.type) {
    case 'refreshing':
      return { catalog: action.catalog ?? state.catalog, status: 'loading' };
    case 'settled':
      return {
        catalog: action.catalog ?? state.catalog,
        status: action.refreshed ? 'ready' : 'failed',
      };
  }
}

export function PropFirmProfilePicker({
  value,
  disabled,
  currencyCode,
  firmNameField,
  challengeNameField,
  onChange,
}: Props) {
  const plugin = usePlugin();
  const dateDraftGate = useContext(DateDraftGateContext);
  const canReplace = () => !dateDraftGate || dateDraftGate.confirm();
  const { service, status: serviceStatus } = useService(
    'propFirmProfileCatalogService'
  );
  const [{ catalog, status: loadStatus }, dispatchCatalog] = useReducer(
    catalogReducer,
    { status: 'loading' }
  );
  const [, refreshSavedProfiles] = useReducer(
    (revision: number) => revision + 1,
    0
  );
  useEventBus('settings:changed', (event) => {
    if (event.section === 'personalPropFirmProfiles') refreshSavedProfiles();
  });
  const savedProfiles = plugin?.settings.personalPropFirmProfiles ?? [];
  
  
  
  const [selectedFirmId, setSelectedFirmId] = useState(
    () =>
      appliedSelection(value).firmId ||
      (hasTypedIdentity(value) ? CUSTOM_FIRM : '')
  );
  const [selectedChallengeId, setSelectedChallengeId] = useState(
    () => appliedSelection(value).challengeId
  );
  
  
  const firmId = selectedFirmId || (hasTypedIdentity(value) ? CUSTOM_FIRM : '');

  useEffect(() => {
    if (!service) return;
    let cancelled = false;
    const cached = service.getCatalog();
    dispatchCatalog({ type: 'refreshing', catalog: cached });
    void service.refresh().then((result) => {
      if (cancelled) return;
      dispatchCatalog({
        type: 'settled',
        catalog: result.catalog,
        refreshed: result.kind === 'ready',
      });
    });
    return () => {
      cancelled = true;
    };
  }, [service]);

  
  
  
  const applySelection = async (selection: PropFirmProfileSelection) => {
    if (!plugin) return;
    setSelectedChallengeId(selection.challenge.id);
    
    
    if (selection.challenge.currency !== currencyCode) return;
    if (!isUntouchedChallengeConfig(value)) {
      const confirmed = await showConfirmationModal(plugin.app, {
        title: t('account.prop-challenge.profile.confirm-title'),
        message: t('account.prop-challenge.profile.confirm-message'),
        confirmLabel: t('account.prop-challenge.profile.apply'),
        cancelLabel: t('button.cancel'),
      });
      if (!confirmed) {
        
        
        const applied = appliedSelection(value);
        setSelectedFirmId(applied.firmId);
        setSelectedChallengeId(applied.challengeId);
        return;
      }
    }
    onChange(
      markUntouchedChallengeConfig(
        replacePropChallengeWithProfile(value, selection)
      )
    );
  };

  
  
  
  
  
  const chooseCustomFirm = () => {
    setSelectedFirmId(CUSTOM_FIRM);
    setSelectedChallengeId('');
    if (!value.profileRef) return;
    const next: PropChallengeConfig = {
      ...value,
      challengeName: '',
      phases: value.phases.map((phase) => {
        const unlinked = { ...phase };
        delete unlinked.profileSnapshot;
        delete unlinked.profilePhaseIndex;
        delete unlinked.profileApplication;
        return unlinked;
      }),
    };
    delete next.firmName;
    delete next.profileRef;
    delete next.profileUpdateDismissals;
    onChange(
      isUntouchedChallengeConfig(value)
        ? markUntouchedChallengeConfig(next)
        : next
    );
  };

  const manualIdentity = (
    <div className="journalit-prop-profile-picker__controls">
      <div className="journalit-prop-profile-picker__column">
        {firmNameField}
      </div>
      <div className="journalit-prop-profile-picker__column">
        {challengeNameField}
      </div>
    </div>
  );

  if ((serviceStatus === 'loading' || loadStatus === 'loading') && !catalog) {
    return (
      <div className="journalit-prop-profile-picker">
        <div className="journalit-prop-profile-status">
          {t('account.prop-challenge.profile.loading')}
        </div>
        {manualIdentity}
      </div>
    );
  }
  if (!catalog) {
    return (
      <div className="journalit-prop-profile-picker">
        <div className="journalit-prop-profile-status">
          {t('account.prop-challenge.profile.unavailable')}
        </div>
        {manualIdentity}
      </div>
    );
  }

  const selectedFirm = catalog.firms.find((firm) => firm.id === firmId);
  const challengeChoices: Array<{
    label: string;
    selection: PropFirmProfileSelection;
  }> =
    firmId === SAVED_PROFILES
      ? savedProfiles.map((profile) => ({
          label: `${profile.firmName} / ${profile.challenge.name}`,
          selection: personalProfileSelection(profile),
        }))
      : selectedFirm
        ? selectedFirm.challenges.map((challenge) => ({
            label: challenge.name,
            selection: {
              firmId: selectedFirm.id,
              firmName: selectedFirm.name,
              verifiedAt: selectedFirm.verifiedAt,
              catalogVersion: catalog.version,
              challenge,
            },
          }))
        : [];
  const selectedChoice = challengeChoices.find(
    (choice) => choice.selection.challenge.id === selectedChallengeId
  );
  const isCustomFirm = firmId === CUSTOM_FIRM;
  
  
  
  const appliedIdentity = [value.firmName, value.challengeName]
    .map((name) => name?.trim())
    .filter(Boolean)
    .join(' · ');
  const applied = appliedSelection(value);
  const showsApplied =
    value.profileRef !== undefined &&
    firmId === applied.firmId &&
    selectedChallengeId === applied.challengeId;

  return (
    <div className="journalit-prop-profile-picker">
      {loadStatus === 'loading' && (
        <div className="journalit-prop-profile-status">
          {t('account.prop-challenge.profile.refreshing')}
        </div>
      )}
      <div className="journalit-prop-profile-picker__controls">
        <div className="journalit-prop-profile-picker__column">
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.profile.firm')}</span>
            <DropdownSelect
              value={firmId}
              onBeforeChange={(id) => id !== CUSTOM_FIRM || canReplace()}
              onChange={(nextFirmId) => {
                if (nextFirmId === CUSTOM_FIRM) {
                  chooseCustomFirm();
                  return;
                }
                setSelectedFirmId(nextFirmId);
                setSelectedChallengeId('');
              }}
              ariaLabel={t('account.prop-challenge.profile.firm')}
              placeholder={t('account.prop-challenge.profile.choose-firm')}
              disabled={disabled}
              options={[
                ...(savedProfiles.length > 0
                  ? [
                      {
                        value: SAVED_PROFILES,
                        label: t('account.profiles.library'),
                      },
                    ]
                  : []),
                ...catalog.firms.map((firm) => ({
                  value: firm.id,
                  label: firm.name,
                })),
                {
                  value: CUSTOM_FIRM,
                  label: t('account.prop-challenge.profile.custom-firm'),
                },
              ]}
            />
          </label>
        </div>
        {!isCustomFirm && (
          <div className="journalit-prop-profile-picker__column">
            <label className="journalit-prop-challenge-field">
              <span>{t('account.prop-challenge.profile.challenge')}</span>
              <DropdownSelect
                value={selectedChoice?.selection.challenge.id ?? ''}
                onBeforeChange={canReplace}
                onChange={(id) => {
                  const choice = challengeChoices.find(
                    (entry) => entry.selection.challenge.id === id
                  );
                  if (choice) void applySelection(choice.selection);
                }}
                ariaLabel={t('account.prop-challenge.profile.challenge')}
                placeholder={t(
                  'account.prop-challenge.profile.choose-challenge'
                )}
                disabled={disabled || !firmId}
                options={challengeChoices.map((choice) => ({
                  value: choice.selection.challenge.id,
                  label:
                    choice.selection.challenge.currency === currencyCode
                      ? choice.label
                      : `${choice.label} · ${choice.selection.challenge.currency}`,
                }))}
              />
            </label>
          </div>
        )}
      </div>
      {!isCustomFirm && !value.profileRef && (
        <p className="journalit-prop-profile-picker__help">
          {t('account.prop-challenge.profile.help')}
        </p>
      )}
      {isCustomFirm && manualIdentity}
      {!isCustomFirm && !showsApplied && appliedIdentity && (
        <p className="journalit-prop-challenge-linked-identity">
          {t('account.prop-challenge.profile.current', {
            identity: appliedIdentity,
          })}
        </p>
      )}
      {selectedChoice &&
        selectedChoice.selection.challenge.currency !== currencyCode && (
          <p role="status">{t('account.profiles.currency')}</p>
        )}
      {loadStatus === 'failed' && (
        <p role="status">{t('account.profiles.cached')}</p>
      )}
    </div>
  );
}
