

import React, { useState } from 'react';
import { Notice } from 'obsidian';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useEventBus } from '../../../../hooks/useEventBus';
import { useAccountPageData } from '../../context/AccountPageDataContext';
import { t } from '../../../../lang/helpers';
import { showConfirmationModal } from '../../../shared/ConfirmationModal';
import { Button } from '../../../ui/Button';
import { GitMerge } from '../../../shared/icons/ObsidianIcon';
import { summarizeMergedFrom } from './accountMergeWizardHelpers';

export const AccountMergeLegacyNotice: React.FC<{ accountName: string }> = ({
  accountName,
}) => {
  const plugin = usePlugin();
  const { refreshData } = useAccountPageData();
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  
  const [, setRevision] = useState(0);
  useEventBus('account:changed', () => setRevision((value) => value + 1));

  const mergeService = plugin?.accountMergeService;
  const record = mergeService?.getRecordForAccount(accountName);
  if (!mergeService || !record || dismissed) return null;

  const sourceNames: string[] = [];
  for (const source of record.sources) {
    if (source.accountName !== record.targetAccountName) {
      sourceNames.push(source.accountName);
    }
  }
  const { shown, extra } = summarizeMergedFrom(sourceNames);
  const names = extra > 0 ? [...shown, `+${extra}`] : shown;
  
  const converted = sourceNames.length === 0;

  const run = async (
    confirmed: () => Promise<boolean>,
    work: () => Promise<void>
  ) => {
    if (!(await confirmed())) return;
    setBusy(true);
    try {
      await work();
      setDismissed(true);
      await refreshData();
    } catch (error) {
      console.error('Failed to apply account merge action:', error);
      new Notice(t('account.merge.notice.error'));
    } finally {
      setBusy(false);
    }
  };

  const undo = () =>
    void run(
      () =>
        showConfirmationModal(plugin.app, {
          title: t('account.merge.undo.title'),
          message: t('account.merge.undo.message'),
          confirmLabel: t('account.merge.action.undo'),
          cancelLabel: t('button.cancel'),
        }),
      () => mergeService.undo(record.id)
    );

  const deleteLegacy = () =>
    void run(
      () =>
        showConfirmationModal(plugin.app, {
          title: t('account.merge.delete.title'),
          message: t('account.merge.delete.message'),
          confirmLabel: t('account.merge.action.delete'),
          cancelLabel: t('button.cancel'),
          destructive: true,
        }),
      () => mergeService.deleteLegacyAccounts(record.id)
    );

  return (
    <div
      className="account-date-warning journalit-account-merge-notice"
      role="status"
    >
      <GitMerge size={20} className="account-date-warning__icon" />
      <div className="account-date-warning__content">
        <div className="account-date-warning__title">
          {converted
            ? t('account.merge.notice.converted')
            : t('account.merge.notice.title', { accounts: names.join(', ') })}
        </div>
      </div>
      <div className="journalit-account-merge-notice__actions">
        <Button variant="plain" size="small" disabled={busy} onClick={undo}>
          {t('account.merge.action.undo')}
        </Button>
        {!converted && (
          <Button
            variant="danger"
            size="small"
            className="account-date-warning__button"
            disabled={busy}
            onClick={deleteLegacy}
          >
            {t('account.merge.action.delete')}
          </Button>
        )}
      </div>
    </div>
  );
};
