

import React, { useEffect, useReducer, useState } from 'react';
import type JournalitPlugin from '../../../../main';
import { t } from '../../../../lang/helpers';
import { useService } from '../../../../hooks/useService';
import { useEventBus } from '../../../../hooks/useEventBus';
import type {
  PropFirmProfileCatalog,
  PropFirmProfileSelection,
} from '../../../../services/propChallenge/types';
import {
  personalProfileSelection,
  type PersonalPropFirmProfile,
} from '../../../../services/propChallenge/PersonalPropFirmProfiles';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { Button } from '../../../ui/Button';
import { AlertTriangle, Check } from '../../../shared/icons/ObsidianIcon';
import {
  PropFirmPrefillHeadingLink,
  PropFirmPrefillMatch,
  usePropFirmIndex,
} from '../propChallenge/PropFirmPrefillTeaser';
import { matchFirm } from '../propChallenge/propFirmPrefillMatch';

export interface AccountMergeIdentity {
  firmName: string;
  challengeName: string;
}

interface Props {
  plugin: JournalitPlugin;
  
  isPro: boolean;
  currency?: string;
  identity: AccountMergeIdentity;
  onIdentityChange: (identity: AccountMergeIdentity) => void;
  profile: PropFirmProfileSelection | undefined;
  onProfileChange: (
    profile: PropFirmProfileSelection | undefined
  ) => Promise<boolean>;
}


const SAVED_PROFILES = '__saved-profiles';
const CUSTOM_FIRM = '__custom-firm';

export const CatalogPicker: React.FC<{
  currency?: string;
  
  initialFirmName?: string;
  
  appliedProfile?: PropFirmProfileSelection;
  
  savedProfiles?: readonly PersonalPropFirmProfile[];
  
  onChooseCustomFirm?: () => void;
  
  initiallyCustom?: boolean;
  
  onApply: (selection: PropFirmProfileSelection) => Promise<boolean>;
  firmNameField?: React.ReactNode;
  challengeNameField?: React.ReactNode;
}> = ({
  currency,
  initialFirmName,
  appliedProfile,
  savedProfiles = [],
  onChooseCustomFirm,
  initiallyCustom = false,
  onApply,
  firmNameField,
  challengeNameField,
}) => {
  const { service, status } = useService('propFirmProfileCatalogService');
  const [catalog, setCatalog] = useState<PropFirmProfileCatalog | undefined>(
    () => service?.getCatalog()
  );
  const [firmId, setFirmId] = useState(() =>
    appliedProfile?.source === 'personal'
      ? SAVED_PROFILES
      : (appliedProfile?.firmId ?? (initiallyCustom ? CUSTOM_FIRM : ''))
  );
  const [challengeId, setChallengeId] = useState(
    appliedProfile?.challenge.id ?? ''
  );
  useEffect(() => {
    if (!service) return;
    let cancelled = false;
    setCatalog(service.getCatalog());
    void service.refresh().then((result) => {
      if (!cancelled && 'catalog' in result && result.catalog) {
        setCatalog(result.catalog);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [service]);
  const nameFields = (
    <div className="journalit-prop-profile-picker__controls">
      <div className="journalit-prop-profile-picker__column">
        {firmNameField}
      </div>
      <div className="journalit-prop-profile-picker__column">
        {challengeNameField}
      </div>
    </div>
  );
  if (!catalog) {
    return (
      <div className="journalit-prop-profile-picker">
        <div className="journalit-account-merge-modal__loading">
          {status === 'loading'
            ? t('account.prop-challenge.profile.loading')
            : t('account.prop-challenge.profile.unavailable')}
        </div>
        {nameFields}
      </div>
    );
  }
  
  
  const initialFirmId = initialFirmName
    ? matchFirm(
        initialFirmName,
        catalog.firms.map((entry) => ({
          id: entry.id,
          name: entry.name,
          challenges: entry.challenges.length,
        }))
      )?.id
    : undefined;
  const shownFirmId = firmId || initialFirmId || '';
  const isCustomFirm = shownFirmId === CUSTOM_FIRM;
  const firm = catalog.firms.find((entry) => entry.id === shownFirmId);
  const choices: Array<{ label: string; selection: PropFirmProfileSelection }> =
    shownFirmId === SAVED_PROFILES
      ? savedProfiles.map((entry) => ({
          label: `${entry.firmName} / ${entry.challenge.name}`,
          selection: personalProfileSelection(entry),
        }))
      : firm
        ? firm.challenges.map((entry) => ({
            label: entry.name,
            selection: {
              firmId: firm.id,
              firmName: firm.name,
              verifiedAt: firm.verifiedAt,
              catalogVersion: catalog.version,
              challenge: entry,
            },
          }))
        : [];
  const chosen = choices.find(
    (choice) => choice.selection.challenge.id === challengeId
  );
  const currencyMismatch =
    !!chosen && !!currency && chosen.selection.challenge.currency !== currency;
  return (
    <div className="journalit-prop-profile-picker">
      {status === 'loading' && (
        <div className="journalit-prop-profile-status">
          {t('account.prop-challenge.profile.refreshing')}
        </div>
      )}
      <div className="journalit-prop-profile-picker__controls">
        <div className="journalit-prop-profile-picker__column">
          <label className="journalit-prop-challenge-field">
            <span>{t('account.prop-challenge.profile.firm')}</span>
            <DropdownSelect
              value={shownFirmId}
              ariaLabel={t('account.prop-challenge.profile.firm')}
              options={[
                ...(savedProfiles.length > 0
                  ? [
                      {
                        value: SAVED_PROFILES,
                        label: t('account.profiles.library'),
                      },
                    ]
                  : []),
                ...catalog.firms.map((entry) => ({
                  value: entry.id,
                  label: entry.name,
                })),
                ...(onChooseCustomFirm
                  ? [
                      {
                        value: CUSTOM_FIRM,
                        label: t('account.prop-challenge.profile.custom-firm'),
                      },
                    ]
                  : []),
              ]}
              placeholder={t('account.prop-challenge.profile.choose-firm')}
              onChange={(id) => {
                setFirmId(id);
                setChallengeId('');
                if (id === CUSTOM_FIRM) onChooseCustomFirm?.();
              }}
            />
          </label>
        </div>
        {!isCustomFirm && (
          <div className="journalit-prop-profile-picker__column">
            <label className="journalit-prop-challenge-field">
              <span>{t('account.prop-challenge.profile.challenge')}</span>
              <DropdownSelect
                value={chosen?.selection.challenge.id ?? ''}
                ariaLabel={t('account.prop-challenge.profile.challenge')}
                placeholder={t(
                  'account.prop-challenge.profile.choose-challenge'
                )}
                disabled={!shownFirmId}
                options={choices.map((choice) => ({
                  value: choice.selection.challenge.id,
                  label:
                    currency && choice.selection.challenge.currency !== currency
                      ? `${choice.label} · ${choice.selection.challenge.currency}`
                      : choice.label,
                }))}
                onChange={(id) => {
                  const previousChallengeId = challengeId;
                  setChallengeId(id);
                  const choice = choices.find(
                    (entry) => entry.selection.challenge.id === id
                  );
                  
                  
                  if (!choice) return;
                  if (
                    currency &&
                    choice.selection.challenge.currency !== currency
                  )
                    return;
                  void onApply(choice.selection).then((applied) => {
                    if (!applied) setChallengeId(previousChallengeId);
                  });
                }}
              />
            </label>
          </div>
        )}
      </div>
      {onChooseCustomFirm && !isCustomFirm && !appliedProfile && (
        <p className="journalit-prop-profile-picker__help">
          {t('account.prop-challenge.profile.help')}
        </p>
      )}
      {(firmNameField || challengeNameField) &&
        (isCustomFirm || !onChooseCustomFirm) &&
        nameFields}
      {currencyMismatch && (
        <p
          role="status"
          className="journalit-account-merge-modal__hint is-warning"
        >
          <AlertTriangle size={12} />
          {t('account.profiles.currency')}
        </p>
      )}
    </div>
  );
};

export const AccountMergeIdentitySection: React.FC<Props> = ({
  plugin,
  isPro,
  currency,
  identity,
  onIdentityChange,
  profile,
  onProfileChange,
}) => {
  const [, refresh] = useReducer((revision: number) => revision + 1, 0);
  useEventBus('settings:changed', (event) => {
    if (event.section === 'personalPropFirmProfiles') refresh();
  });
  const [personalId, setPersonalId] = useState('');
  const firmIndex = usePropFirmIndex();
  const catalogAvailable = isPro;
  const personalProfiles = plugin.settings.personalPropFirmProfiles ?? [];
  const personal = personalProfiles.find((entry) => entry.id === personalId);

  const applySelection = async (selection: PropFirmProfileSelection) => {
    const applied = await onProfileChange(selection);
    if (applied) setCustomFirmChosen(false);
    return applied;
  };

  const [customFirmChosen, setCustomFirmChosen] = useState(false);
  
  
  const removeProfile = () => {
    onIdentityChange({ firmName: '', challengeName: '' });
    void onProfileChange(undefined);
  };
  
  
  const chooseCustomFirm = () => {
    setCustomFirmChosen(true);
    if (profile) removeProfile();
  };

  const firmNameField = (
    <label className="journalit-prop-challenge-field">
      <span>{t('account.prop-challenge.firm-name')}</span>
      <input
        value={identity.firmName}
        placeholder={t('account.prop-challenge.firm-name-placeholder')}
        onChange={(event) =>
          onIdentityChange({ ...identity, firmName: event.target.value })
        }
      />
    </label>
  );
  const challengeNameField = (
    <label className="journalit-prop-challenge-field">
      <span>{t('account.prop-challenge.challenge-name')}</span>
      <input
        value={identity.challengeName}
        placeholder={t('account.prop-challenge.challenge-name-placeholder')}
        onChange={(event) =>
          onIdentityChange({ ...identity, challengeName: event.target.value })
        }
      />
    </label>
  );

  return (
    <section
      className="journalit-account-merge-modal__section journalit-account-merge-modal__identity"
      data-journalit-guide-target="account-merge.identity"
    >
      <div className="journalit-prop-challenge-identity-heading-row">
        <strong className="journalit-prop-challenge-identity-heading">
          {t('account.prop-challenge.identity')}
        </strong>
        {!catalogAvailable && <PropFirmPrefillHeadingLink firms={firmIndex} />}
      </div>
      {catalogAvailable ? (
        <CatalogPicker
          
          
          key={profile ? `${profile.firmId}:${profile.challenge.id}` : 'none'}
          currency={currency}
          appliedProfile={profile}
          savedProfiles={personalProfiles}
          initiallyCustom={
            customFirmChosen ||
            (!profile &&
              Boolean(
                identity.firmName.trim() || identity.challengeName.trim()
              ))
          }
          onChooseCustomFirm={chooseCustomFirm}
          onApply={applySelection}
          firmNameField={firmNameField}
          challengeNameField={challengeNameField}
        />
      ) : (
        <div className="journalit-prop-challenge-identity-block">
          <div className="journalit-prop-challenge-identity">
            {firmNameField}
            {challengeNameField}
          </div>
          <PropFirmPrefillMatch
            firms={firmIndex}
            typedFirmName={identity.firmName}
          />
        </div>
      )}
      
      {!catalogAvailable && (
        <section className="journalit-personal-profiles">
          <strong className="journalit-prop-profile-picker__title">
            {t('account.profiles.library')}
          </strong>
          <div className="journalit-personal-profiles__selection">
            <DropdownSelect
              value={personalId}
              ariaLabel={t('account.profiles.library')}
              options={[
                { value: '', label: t('account.profiles.choose') },
                ...personalProfiles.map((entry) => ({
                  value: entry.id,
                  label: `${entry.firmName} / ${entry.challenge.name} · v${entry.revision}`,
                })),
              ]}
              onChange={setPersonalId}
            />
            {personal && (
              <Button
                size="small"
                disabled={
                  !!currency && personal.challenge.currency !== currency
                }
                onClick={() =>
                  void applySelection(personalProfileSelection(personal))
                }
              >
                {t('account.prop-challenge.profile.apply')}
              </Button>
            )}
          </div>
        </section>
      )}
      
      {profile && !catalogAvailable && (
        <div className="journalit-account-merge-modal__applied" role="status">
          <Check size={12} aria-hidden="true" />
          <span>
            {t('account.merge.profile.applied', {
              firm: profile.firmName,
              challenge: profile.challenge.name,
            })}
          </span>
          <Button variant="plain" size="small" onClick={removeProfile}>
            {t('account.merge.profile.remove')}
          </Button>
        </div>
      )}
    </section>
  );
};
