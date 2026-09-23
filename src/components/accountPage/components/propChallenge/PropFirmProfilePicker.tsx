import React, { useEffect, useReducer, useState } from 'react';
import { t } from '../../../../lang/helpers';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useService } from '../../../../hooks/useService';
import { Check } from '../../../shared/icons/ObsidianIcon';
import { replacePropChallengeWithProfile } from '../../../../services/propChallenge/PropChallengeConfig';
import type {
  PropChallengeConfig,
  PropFirmProfileCatalog,
} from '../../../../services/propChallenge/types';
import { showConfirmationModal } from '../../../shared/ConfirmationModal';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { NoTooltipButton } from '../../../ui/NoTooltipButton';

interface Props {
  value: PropChallengeConfig;
  disabled: boolean;
  currencyCode: string;
  firmNameField: React.ReactNode;
  challengeNameField: React.ReactNode;
  onChange: (value: PropChallengeConfig) => void;
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
  const { service, status: serviceStatus } = useService(
    'propFirmProfileCatalogService'
  );
  const [{ catalog, status: loadStatus }, dispatchCatalog] = useReducer(
    catalogReducer,
    { status: 'loading' }
  );
  const [selectedFirmId, setSelectedFirmId] = useState(
    value.profileRef?.source === 'personal'
      ? ''
      : (value.profileRef?.firmId ?? '')
  );
  const [selectedChallengeId, setSelectedChallengeId] = useState(
    value.profileRef?.source === 'personal'
      ? ''
      : (value.profileRef?.challengeId ?? '')
  );

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

  const selectedFirm =
    catalog?.firms.find((firm) => firm.id === selectedFirmId) ??
    catalog?.firms[0];
  const selectedChallenge =
    selectedFirm?.challenges.find(
      (challenge) => challenge.id === selectedChallengeId
    ) ?? selectedFirm?.challenges[0];

  const applyProfile = async () => {
    if (!plugin || !catalog || !selectedFirm || !selectedChallenge) return;
    if (value.phases.length > 0) {
      const confirmed = await showConfirmationModal(plugin.app, {
        title: t('account.prop-challenge.profile.confirm-title'),
        message: t('account.prop-challenge.profile.confirm-message'),
        confirmLabel: t('account.prop-challenge.profile.apply'),
        cancelLabel: t('button.cancel'),
      });
      if (!confirmed) return;
    }
    onChange(
      replacePropChallengeWithProfile(value, {
        firmId: selectedFirm.id,
        firmName: selectedFirm.name,
        verifiedAt: selectedFirm.verifiedAt,
        catalogVersion: catalog.version,
        challenge: selectedChallenge,
      })
    );
  };

  const renderManualIdentity = (status?: string) => (
    <div className="journalit-prop-profile-picker">
      {status && <div className="journalit-prop-profile-status">{status}</div>}
      <div className="journalit-prop-profile-picker__controls">
        <div className="journalit-prop-profile-picker__column">
          {firmNameField}
        </div>
        <div className="journalit-prop-profile-picker__column">
          {challengeNameField}
        </div>
      </div>
    </div>
  );

  if ((serviceStatus === 'loading' || loadStatus === 'loading') && !catalog) {
    return renderManualIdentity(t('account.prop-challenge.profile.loading'));
  }
  if ((serviceStatus === 'error' || loadStatus === 'failed') && !catalog) {
    return renderManualIdentity(
      t('account.prop-challenge.profile.unavailable')
    );
  }
  if (!catalog || !selectedFirm || !selectedChallenge) {
    return renderManualIdentity();
  }

  return (
    <div className="journalit-prop-profile-picker">
      <div className="journalit-prop-profile-picker__title-row">
        <div className="journalit-prop-profile-picker__title">
          {t('account.prop-challenge.profile.title')}
        </div>
        {loadStatus === 'loading' && (
          <div className="journalit-prop-profile-status">
            {t('account.prop-challenge.profile.refreshing')}
          </div>
        )}
      </div>
      <div className="journalit-prop-profile-picker__controls">
        <div className="journalit-prop-profile-picker__column">
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.profile.firm')}</span>
            <DropdownSelect
              value={selectedFirm.id}
              onChange={(firmId) => {
                setSelectedFirmId(firmId);
                setSelectedChallengeId('');
              }}
              ariaLabel={t('account.prop-challenge.profile.firm')}
              disabled={disabled}
              options={catalog.firms.map((firm) => ({
                value: firm.id,
                label: firm.name,
              }))}
            />
          </label>
          {firmNameField}
        </div>
        <div className="journalit-prop-profile-picker__column">
          <div className="journalit-prop-profile-picker__challenge-selection">
            <label className="journalit-prop-challenge-field">
              <span>{t('account.prop-challenge.profile.challenge')}</span>
              <DropdownSelect
                value={selectedChallenge.id}
                onChange={(id) => {
                  setSelectedChallengeId(id);
                }}
                ariaLabel={t('account.prop-challenge.profile.challenge')}
                disabled={disabled}
                options={selectedFirm.challenges.map((challenge) => ({
                  value: challenge.id,
                  label: challenge.name,
                }))}
              />
            </label>
            <NoTooltipButton
              className="journalit-prop-profile-picker__apply"
              label={t('account.prop-challenge.profile.apply')}
              onClick={applyProfile}
              disabled={disabled || selectedChallenge.currency !== currencyCode}
            >
              <Check size={16} aria-hidden="true" />
            </NoTooltipButton>
          </div>
          {challengeNameField}
        </div>
      </div>
      {selectedChallenge.currency !== currencyCode && (
        <p role="status">{t('account.profiles.currency')}</p>
      )}
      {loadStatus === 'failed' && (
        <p role="status">{t('account.profiles.cached')}</p>
      )}
    </div>
  );
}
