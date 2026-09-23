import React, { useId, useReducer, useState } from 'react';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useEventBus } from '../../../../hooks/useEventBus';
import { t } from '../../../../lang/helpers';
import { replacePropChallengeWithProfile } from '../../../../services/propChallenge/PropChallengeConfig';
import type { PropChallengeConfig } from '../../../../services/propChallenge/types';
import {
  changePersonalProfiles,
  createPersonalProfile,
  personalProfileSelection,
} from '../../../../services/propChallenge/PersonalPropFirmProfiles';
import { Button } from '../../../ui/Button';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { showConfirmationModal } from '../../../shared/ConfirmationModal';

interface Props {
  value: PropChallengeConfig;
  currencyCode: string;
  disabled: boolean;
  existingAccount: boolean;
  onChange: (config: PropChallengeConfig) => void;
}

export function PersonalProfileLibrary({
  value,
  currencyCode,
  disabled,
  existingAccount,
  onChange,
}: Props) {
  const titleId = useId();
  const plugin = usePlugin();
  const [, refresh] = useReducer((revision: number) => revision + 1, 0);
  useEventBus('settings:changed', (event) => {
    if (event.section === 'personalPropFirmProfiles') refresh();
  });
  const [selectedId, setSelectedId] = useState(
    value.profileRef?.source === 'personal' ? value.profileRef.challengeId : ''
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const profiles = plugin?.settings.personalPropFirmProfiles ?? [];
  const selected = profiles.find((profile) => profile.id === selectedId);
  const unavailable = disabled || busy || !plugin;
  const execute = async <T,>(
    action: () => Promise<T>
  ): Promise<T | undefined> => {
    setError('');
    setBusy(true);
    try {
      return await action();
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : t('account.profiles.error')
      );
      return undefined;
    } finally {
      setBusy(false);
    }
  };
  const save = (replace: boolean) => {
    void execute(async () => {
      if (!plugin) return;
      if (
        replace &&
        (!selected ||
          !(await showConfirmationModal(plugin.app, {
            title: t('account.profiles.save-revision'),
            message: t('account.profiles.independent'),
            confirmLabel: t('button.save'),
            cancelLabel: t('button.cancel'),
          })))
      )
        return;
      let savedId = '';
      await changePersonalProfiles(plugin, (current) => {
        const previous = replace
          ? current.find((profile) => profile.id === selectedId)
          : undefined;
        if (replace && !previous)
          throw new Error(t('account.profiles.missing'));
        const next = createPersonalProfile(value, currencyCode, previous);
        savedId = next.id;
        return [...current.filter((profile) => profile.id !== next.id), next];
      });
      return savedId;
    }).then((savedId) => {
      if (savedId) setSelectedId(savedId);
    });
  };
  return (
    <section className="journalit-personal-profiles" aria-labelledby={titleId}>
      <strong className="journalit-prop-profile-picker__title" id={titleId}>
        {t('account.profiles.library')}
      </strong>
      {existingAccount &&
        value.profileRef?.source === 'personal' &&
        selectedId &&
        !selected && <p role="status">{t('account.profiles.missing')}</p>}
      <div className="journalit-personal-profiles__selection">
        <DropdownSelect
          value={selectedId}
          onChange={(id) => {
            setSelectedId(id);
          }}
          ariaLabel={t('account.profiles.library')}
          ariaLabelledBy={titleId}
          disabled={unavailable}
          options={[
            { value: '', label: t('account.profiles.choose') },
            ...profiles.map((profile) => ({
              value: profile.id,
              label: `${profile.firmName} / ${profile.challenge.name} · v${profile.revision}`,
            })),
          ]}
        />
        {selected && !existingAccount && (
          <Button
            size="small"
            disabled={
              unavailable || selected.challenge.currency !== currencyCode
            }
            onClick={() => {
              
              
              
              
              onChange(
                replacePropChallengeWithProfile(
                  value,
                  personalProfileSelection(selected)
                )
              );
            }}
          >
            {t('account.prop-challenge.profile.apply')}
          </Button>
        )}
      </div>
      <div className="journalit-personal-profiles__actions">
        <Button
          variant="plain"
          size="small"
          disabled={unavailable}
          onClick={() => save(false)}
        >
          {t('account.profiles.save-new')}
        </Button>
        {selected && (
          <>
            <Button
              variant="plain"
              size="small"
              disabled={unavailable}
              onClick={() => save(true)}
            >
              {t('account.profiles.save-revision')}
            </Button>
            <Button
              variant="plain"
              size="small"
              className="journalit-personal-profiles__delete"
              disabled={unavailable}
              onClick={() =>
                void execute(async () => {
                  if (
                    !plugin ||
                    !(await showConfirmationModal(plugin.app, {
                      title: t('button.delete'),
                      message: t('account.profiles.delete-help'),
                      confirmLabel: t('button.delete'),
                      cancelLabel: t('button.cancel'),
                    }))
                  )
                    return false;
                  await changePersonalProfiles(plugin, (current) =>
                    current.filter((profile) => profile.id !== selectedId)
                  );
                  return true;
                }).then((done) => {
                  if (done) setSelectedId('');
                })
              }
            >
              {t('button.delete')}
            </Button>
          </>
        )}
      </div>
      {selected && selected.challenge.currency !== currencyCode && (
        <p role="status">{t('account.profiles.currency')}</p>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
