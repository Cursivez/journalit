

import React, { useEffect, useReducer, useState } from 'react';
import type JournalitPlugin from '../../../../main';
import { t } from '../../../../lang/helpers';
import { useService } from '../../../../hooks/useService';
import { useEventBus } from '../../../../hooks/useEventBus';
import type {
  PropFirmProfileCatalog,
  PropFirmProfileSelection,
} from '../../../../services/propChallenge/types';
import { personalProfileSelection } from '../../../../services/propChallenge/PersonalPropFirmProfiles';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { NoTooltipButton } from '../../../ui/NoTooltipButton';
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
  ) => Promise<void>;
}

export const CatalogPicker: React.FC<{
  currency?: string;
  
  initialFirmName?: string;
  
  initialChallengeName?: string;
  onApply: (selection: PropFirmProfileSelection) => void;
  firmNameField?: React.ReactNode;
  challengeNameField?: React.ReactNode;
}> = ({
  currency,
  initialFirmName,
  initialChallengeName,
  onApply,
  firmNameField,
  challengeNameField,
}) => {
  const { service, status } = useService('propFirmProfileCatalogService');
  const [catalog, setCatalog] = useState<PropFirmProfileCatalog | undefined>(
    () => service?.getCatalog()
  );
  const [firmId, setFirmId] = useState('');
  const [challengeId, setChallengeId] = useState('');
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
  if (!catalog) {
    return (
      <div className="journalit-prop-profile-picker">
        <div className="journalit-account-merge-modal__loading">
          {status === 'loading'
            ? t('account.prop-challenge.profile.loading')
            : t('account.prop-challenge.profile.unavailable')}
        </div>
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
  const firm =
    catalog.firms.find((entry) => entry.id === (firmId || initialFirmId)) ??
    catalog.firms[0];
  const initialChallengeId = initialChallengeName
    ? firm?.challenges.find(
        (entry) =>
          entry.name.trim().toLocaleLowerCase() ===
          initialChallengeName.trim().toLocaleLowerCase()
      )?.id
    : undefined;
  const challenge =
    firm?.challenges.find(
      (entry) => entry.id === (challengeId || initialChallengeId)
    ) ?? firm?.challenges[0];
  const currencyMismatch =
    !!challenge && !!currency && challenge.currency !== currency;
  return (
    <div className="journalit-prop-profile-picker">
      <div className="journalit-prop-profile-picker__title-row">
        <div className="journalit-prop-profile-picker__title">
          {t('account.prop-challenge.profile.title')}
        </div>
        {status === 'loading' && (
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
              value={firm?.id ?? ''}
              ariaLabel={t('account.prop-challenge.profile.firm')}
              options={catalog.firms.map((entry) => ({
                value: entry.id,
                label: entry.name,
              }))}
              onChange={(id) => {
                setFirmId(id);
                setChallengeId('');
              }}
            />
          </label>
          {firmNameField}
        </div>
        <div className="journalit-prop-profile-picker__column">
          <div className="journalit-prop-profile-picker__challenge-selection">
            <label className="journalit-prop-challenge-field">
              <span>{t('account.prop-challenge.profile.challenge')}</span>
              <DropdownSelect
                value={challenge?.id ?? ''}
                ariaLabel={t('account.prop-challenge.profile.challenge')}
                options={(firm?.challenges ?? []).map((entry) => ({
                  value: entry.id,
                  label:
                    currency && entry.currency !== currency
                      ? `${entry.name} · ${entry.currency}`
                      : entry.name,
                }))}
                onChange={setChallengeId}
              />
            </label>
            <NoTooltipButton
              className="journalit-prop-profile-picker__apply"
              label={t('account.prop-challenge.profile.apply')}
              disabled={!firm || !challenge || currencyMismatch}
              onClick={() => {
                if (!firm || !challenge) return;
                onApply({
                  firmId: firm.id,
                  firmName: firm.name,
                  verifiedAt: firm.verifiedAt,
                  catalogVersion: catalog.version,
                  challenge,
                });
              }}
            >
              <Check size={16} aria-hidden="true" />
            </NoTooltipButton>
          </div>
          {challengeNameField}
        </div>
      </div>
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

  const applySelection = (selection: PropFirmProfileSelection) => {
    void onProfileChange(selection);
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
          currency={currency}
          initialFirmName={profile?.firmName ?? identity.firmName}
          initialChallengeName={
            profile?.challenge.name ?? identity.challengeName
          }
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
              disabled={!!currency && personal.challenge.currency !== currency}
              onClick={() => applySelection(personalProfileSelection(personal))}
            >
              {t('account.prop-challenge.profile.apply')}
            </Button>
          )}
        </div>
      </section>
      {profile && (
        <div className="journalit-account-merge-modal__applied" role="status">
          <Check size={12} aria-hidden="true" />
          <span>
            {t('account.merge.profile.applied', {
              firm: profile.firmName,
              challenge: profile.challenge.name,
            })}
          </span>
          <Button
            variant="plain"
            size="small"
            onClick={() => void onProfileChange(undefined)}
          >
            {t('account.merge.profile.remove')}
          </Button>
        </div>
      )}
    </section>
  );
};
