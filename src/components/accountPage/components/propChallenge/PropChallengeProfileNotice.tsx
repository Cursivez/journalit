import React, { useEffect, useRef, useState } from 'react';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useService } from '../../../../hooks/useService';
import { useEventBus } from '../../../../hooks/useEventBus';
import { t } from '../../../../lang/helpers';
import type { AccountData } from '../../../../services/account/types';
import type { PropFirmProfileSelection } from '../../../../services/propChallenge/types';
import {
  compareAccountSourceProfile,
  findAccountSourceProfile,
  type ProfileNoticeComparison,
} from '../../../../services/propChallenge/PropChallengeProfileNotice';
import { Button } from '../../../ui/Button';
import { Info } from '../../../shared/icons/ObsidianIcon';
import {
  openProfileSourceModal,
  openProfileUpdateModal,
  openCorrectionHistoryModal,
} from './ProfileUpdateModal';

type State =
  | { kind: 'checking' | 'unavailable' | 'inactive' | 'missing' }
  | {
      kind: 'ready';
      selection: PropFirmProfileSelection;
      comparison: ProfileNoticeComparison;
    };

export function PropChallengeProfileNotice(
  props: Parameters<typeof ProfileNoticeCore>[0]
) {
  const plugin = usePlugin();
  return (
    <>
      <ProfileNoticeCore {...props} />
      {plugin &&
        Boolean(props.account.propChallenge?.correctionHistory?.length) && (
          <div className="journalit-profile-update-status">
            <Button
              variant="plain"
              size="small"
              onClick={() =>
                openCorrectionHistoryModal({ plugin, account: props.account })
              }
            >
              {t('account.profiles.correction-history')}
            </Button>
          </div>
        )}
    </>
  );
}

function ProfileNoticeCore({
  account,
  onUpdated,
}: {
  account: AccountData;
  onUpdated: () => void | Promise<void>;
}) {
  const plugin = usePlugin();
  const { service } = useService('propFirmProfileCatalogService');
  const config = account.propChallenge;
  const [state, setState] = useState<State>({ kind: 'checking' });
  const refresh = useRef<(force?: boolean) => void>(() => {});
  useEventBus('settings:changed', (event) => {
    if (
      event.section === 'personalPropFirmProfiles' ||
      event.section === 'backendIntegration'
    )
      refresh.current();
  });
  useEffect(() => {
    if (!plugin || !service || !config?.profileRef) return;
    let generation = 0;
    let disposed = false;
    const check = async (force = false) => {
      const request = ++generation;
      setState({ kind: 'checking' });
      try {
        let catalog;
        if (config.profileRef?.source !== 'personal') {
          if (
            plugin.settings.backendIntegration?.subscriptionTier !== 'premium'
          ) {
            setState({ kind: 'inactive' });
            return;
          }
          const result = await service.refresh({ force });
          if (disposed || request !== generation) return;
          if (result.kind !== 'ready') {
            setState({ kind: 'unavailable' });
            return;
          }
          catalog = result.catalog;
        }
        const selection = findAccountSourceProfile(
          config,
          catalog,
          plugin.settings.personalPropFirmProfiles ?? []
        );
        if (!selection) {
          setState({ kind: 'missing' });
          return;
        }
        const comparison = await compareAccountSourceProfile(config, selection);
        if (!disposed && request === generation)
          setState({ kind: 'ready', selection, comparison });
      } catch {
        if (!disposed && request === generation)
          setState({ kind: 'unavailable' });
      }
    };
    refresh.current = (force) => {
      void check(force);
    };
    void check();
    const win = window.activeWindow;
    const onFocus = () => {
      if (!win.document.hidden) void check();
    };
    win.addEventListener('focus', onFocus);
    const timer = win.setInterval(onFocus, 15 * 60_000);
    return () => {
      disposed = true;
      generation++;
      refresh.current = () => {};
      win.removeEventListener('focus', onFocus);
      win.clearInterval(timer);
    };
  }, [config, plugin, service]);

  if (
    !plugin ||
    !config ||
    (account.accountType === 'archived' &&
      !(
        state.kind === 'ready' &&
        (state.comparison.corrections?.length ||
          config.correctionHistory?.length)
      ))
  )
    return null;
  if (!config.profileRef)
    return (
      <div className="journalit-profile-update-status">
        <Button
          variant="plain"
          size="small"
          onClick={() => openProfileSourceModal({ plugin, account, onUpdated })}
        >
          {t('account.profiles.link-source')}
        </Button>
      </div>
    );
  if (state.kind === 'unavailable')
    return (
      <div className="journalit-profile-update-status" role="status">
        <span>{t('account.profiles.check-failed')}</span>
        <Button
          variant="plain"
          size="small"
          onClick={() => refresh.current(true)}
        >
          {t('account.profiles.retry')}
        </Button>
      </div>
    );
  if (state.kind !== 'ready') return null;
  const open = () =>
    openProfileUpdateModal({
      plugin,
      account,
      selection: state.selection,
      comparison: state.comparison,
      onUpdated,
    });
  
  
  if (!state.comparison.unreviewedPhaseIds.length) return null;
  return (
    <div
      className="account-date-warning journalit-profile-update-notice"
      role="status"
    >
      <Info size={20} className="account-date-warning__icon" />
      <div className="account-date-warning__content">
        <div className="account-date-warning__title">
          {t(
            state.comparison.corrections?.length
              ? 'account.profiles.correction-title'
              : 'account.profiles.notice-title'
          )}
        </div>
        {!state.comparison.corrections?.length && (
          <div className="account-date-warning__desc">
            {t('account.profiles.notice-description')}
          </div>
        )}
      </div>
      <Button
        variant="secondary"
        size="small"
        className="account-date-warning__button"
        onClick={open}
      >
        {t('account.profiles.review-changes')}
      </Button>
    </div>
  );
}
