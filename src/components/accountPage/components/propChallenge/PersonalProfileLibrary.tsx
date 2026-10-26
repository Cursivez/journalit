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
  type PersonalPropFirmProfile,
} from '../../../../services/propChallenge/PersonalPropFirmProfiles';
import { Button } from '../../../ui/Button';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { showConfirmationModal } from '../../../shared/ConfirmationModal';

interface Props {
  value: PropChallengeConfig;
  currencyCode: string;
  disabled: boolean;
  existingAccount: boolean;
  
  showPicker?: boolean;
  onChange: (config: PropChallengeConfig) => void;
}


const isSavedProfileMissing = (
  existingAccount: boolean,
  value: PropChallengeConfig,
  selectedId: string,
  selected: PersonalPropFirmProfile | undefined
): boolean =>
  existingAccount &&
  value.profileRef?.source === 'personal' &&
  selectedId !== '' &&
  !selected;

const appliedPersonalProfileId = (value: PropChallengeConfig): string =>
  value.profileRef?.source === 'personal' ? value.profileRef.challengeId : '';

function ProfilePickerRow({
  titleId,
  profiles,
  selectedId,
  onPick,
  unavailable,
  applyDisabled,
  canApply,
  onApply,
}: {
  titleId: string;
  profiles: readonly PersonalPropFirmProfile[];
  selectedId: string;
  onPick: (id: string) => void;
  unavailable: boolean;
  applyDisabled: boolean;
  canApply: boolean;
  onApply: () => void;
}) {
  return (
    <>
      <strong className="journalit-prop-profile-picker__title" id={titleId}>
        {t('account.profiles.library')}
      </strong>
      <div className="journalit-personal-profiles__selection">
        <DropdownSelect
          value={selectedId}
          onChange={onPick}
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
        {canApply && (
          <Button size="small" disabled={applyDisabled} onClick={onApply}>
            {t('account.prop-challenge.profile.apply')}
          </Button>
        )}
      </div>
    </>
  );
}

function SelectedProfileActions({
  showPicker,
  unavailable,
  onSaveRevision,
  onDelete,
}: {
  showPicker: boolean;
  unavailable: boolean;
  onSaveRevision: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <Button size="small" disabled={unavailable} onClick={onSaveRevision}>
        {t(
          showPicker
            ? 'account.profiles.save-revision'
            : 'account.profiles.update-saved'
        )}
      </Button>
      <Button
        size="small"
        className="journalit-personal-profiles__delete"
        disabled={unavailable}
        onClick={onDelete}
      >
        {showPicker ? t('button.delete') : t('account.profiles.delete-saved')}
      </Button>
    </>
  );
}

function ProfileLibraryStatus({
  currencyMismatch,
  savedNotice,
  error,
}: {
  currencyMismatch: boolean;
  savedNotice: boolean;
  error: string;
}) {
  return (
    <>
      {currencyMismatch && (
        <p role="status">{t('account.profiles.currency')}</p>
      )}
      {savedNotice && <p role="status">{t('account.profiles.saved')}</p>}
      {error && <p role="alert">{error}</p>}
    </>
  );
}

export function PersonalProfileLibrary({
  value,
  currencyCode,
  disabled,
  existingAccount,
  showPicker = true,
  onChange,
}: Props) {
  const titleId = useId();
  const plugin = usePlugin();
  const [, refresh] = useReducer((revision: number) => revision + 1, 0);
  useEventBus('settings:changed', (event) => {
    if (event.section === 'personalPropFirmProfiles') refresh();
  });
  const appliedId = appliedPersonalProfileId(value);
  const [pickedId, setPickedId] = useState(appliedId);
  const selectedId = showPicker ? pickedId : appliedId;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  
  const [saved, setSaved] = useState(false);
  const profiles = plugin?.settings.personalPropFirmProfiles ?? [];
  const selected = profiles.find((profile) => profile.id === selectedId);
  const unavailable = disabled || busy || !plugin;
  const currencyMismatch =
    selected !== undefined && selected.challenge.currency !== currencyCode;
  const execute = async <T,>(
    action: () => Promise<T>
  ): Promise<T | undefined> => {
    setError('');
    setSaved(false);
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
      if (!savedId) return;
      setPickedId(savedId);
      setSaved(true);
    });
  };
  return (
    <section
      className="journalit-personal-profiles"
      aria-labelledby={showPicker ? titleId : undefined}
    >
      {isSavedProfileMissing(existingAccount, value, selectedId, selected) && (
        <p role="status">{t('account.profiles.missing')}</p>
      )}
      {showPicker && (
        <ProfilePickerRow
          titleId={titleId}
          profiles={profiles}
          selectedId={selectedId}
          onPick={setPickedId}
          unavailable={unavailable}
          applyDisabled={unavailable || currencyMismatch}
          canApply={selected !== undefined && !existingAccount}
          onApply={() =>
            void execute(async () => {
              if (!plugin || !selected) return;
              
              
              
              
              onChange(
                replacePropChallengeWithProfile(
                  value,
                  personalProfileSelection(selected)
                )
              );
            })
          }
        />
      )}
      <div className="journalit-personal-profiles__actions">
        <Button size="small" disabled={unavailable} onClick={() => save(false)}>
          {t('account.profiles.save-new')}
        </Button>
        {selected && (
          <SelectedProfileActions
            showPicker={showPicker}
            unavailable={unavailable}
            onSaveRevision={() => save(true)}
            onDelete={() =>
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
                if (done) setPickedId('');
              })
            }
          />
        )}
      </div>
      <ProfileLibraryStatus
        currencyMismatch={currencyMismatch}
        savedNotice={saved && !showPicker}
        error={error}
      />
    </section>
  );
}
