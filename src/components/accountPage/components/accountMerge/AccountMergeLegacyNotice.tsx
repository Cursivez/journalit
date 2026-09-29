

import React, { useState } from 'react';
import { Notice } from 'obsidian';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { useEventBus } from '../../../../hooks/useEventBus';
import { useAccountPageData } from '../../context/AccountPageDataContext';
import { t } from '../../../../lang/helpers';
import { showConfirmationModal } from '../../../shared/ConfirmationModal';
import { Button } from '../../../ui/Button';
import {
  AlertTriangle,
  Check,
  GitMerge,
} from '../../../shared/icons/ObsidianIcon';
import { summarizeMergedFrom } from './accountMergeWizardHelpers';
import {
  getCurrentPropChallengePhase,
  resolvePhaseForTrade,
} from '../../../../services/propChallenge/PropChallengeConfig';
import type { AccountPageData } from '../../../../services/accountPage/types';
import { formatDateDisplay } from '../../../../utils/dateUtils';

interface SetupSummaryLine {
  ok: boolean;
  text: string;
}

const STAGE_LABEL_KEYS = {
  evaluation: 'account.prop-challenge.stage.evaluation',
  sim_funded: 'account.prop-challenge.stage.sim-funded',
  live_funded: 'account.prop-challenge.stage.live-funded',
} as const;


function buildSetupSummary(
  data: AccountPageData,
  dateFormat: string | undefined,
  formatCount: (value: number) => string
): SetupSummaryLine[] {
  const challenge = data.account.propChallenge;
  if (!challenge) return [];
  const lines: SetupSummaryLine[] = [
    {
      ok: true,
      text: t('account.merge.summary.phases', {
        phases: challenge.phases.map((phase) => phase.name).join(' → '),
      }),
    },
  ];
  const current = getCurrentPropChallengePhase(challenge);
  if (current) {
    const stage = t(STAGE_LABEL_KEYS[current.stage ?? 'evaluation']);
    const date = current.startedAt
      ? formatDateDisplay(new Date(current.startedAt), dateFormat)
      : '-';
    lines.push({
      ok: true,
      
      text:
        current.name === stage
          ? t('account.merge.summary.current-stage', { phase: stage, date })
          : t('account.merge.summary.current', {
              phase: current.name,
              stage,
              date,
            }),
    });
  }
  const now = new Date();
  const counted = data.trades.filter(
    (trade) => resolvePhaseForTrade(challenge, trade, now) !== undefined
  ).length;
  const total = data.trades.length;
  lines.push({
    ok: counted === total,
    text: t(
      counted === total
        ? 'account.merge.summary.trades'
        : 'account.merge.summary.trades-missing',
      { counted: formatCount(counted), total: formatCount(total) }
    ),
  });
  if (current) {
    const rules = current.rules.filter((rule) => rule.enabled);
    lines.push(
      rules.length > 0
        ? {
            ok: true,
            text: t('account.merge.summary.rules', {
              phase: current.name,
              rules: rules
                .map((rule) => t(`account.prop-challenge.rule.${rule.kind}`))
                .join(', '),
            }),
          }
        : {
            ok: false,
            text: t('account.merge.summary.no-rules', { phase: current.name }),
          }
    );
  }
  return lines;
}

export const AccountMergeLegacyNotice: React.FC<{ accountName: string }> = ({
  accountName,
}) => {
  const plugin = usePlugin();
  const { formatValue } = useDisplayFormatter();
  const { accountPageData } = useAccountPageData();
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
    work: () => Promise<void>,
    { removesRecord }: { removesRecord: boolean }
  ) => {
    if (!(await confirmed())) return;
    setBusy(true);
    try {
      await work();
      
      
      if (removesRecord) setDismissed(true);
    } catch (error) {
      console.error('Failed to apply account merge action:', error);
      new Notice(t('account.merge.notice.error'));
    } finally {
      setBusy(false);
    }
  };

  const markReviewed = () =>
    void run(
      () => Promise.resolve(true),
      () => mergeService.markReviewed(record.id),
      { removesRecord: false }
    );

  const undo = () =>
    void run(
      () =>
        showConfirmationModal(plugin.app, {
          title: t('account.merge.undo.title'),
          message: t('account.merge.undo.message'),
          confirmLabel: t('account.merge.action.undo'),
          cancelLabel: t('button.cancel'),
        }),
      () => mergeService.undo(record.id),
      { removesRecord: true }
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
      () => mergeService.deleteLegacyAccounts(record.id),
      { removesRecord: true }
    );

  const summary =
    !record.reviewedAt && accountPageData
      ? buildSetupSummary(
          accountPageData,
          plugin.settings.trade?.dateFormat,
          (value) => formatValue({ kind: 'count', value })
        )
      : [];
  
  if (record.reviewedAt && converted) return null;

  const title = converted
    ? t('account.merge.notice.converted')
    : t('account.merge.notice.title', { accounts: names.join(', ') });

  if (summary.length > 0) {
    return (
      <div
        className="account-date-warning journalit-account-merge-notice journalit-account-merge-notice--summary"
        role="status"
      >
        <GitMerge size={20} className="account-date-warning__icon" />
        <div className="account-date-warning__content">
          <div className="account-date-warning__title">{title}</div>
          <div className="account-date-warning__desc">
            {t('account.merge.summary.intro')}
          </div>
          <ul className="journalit-account-merge-notice__summary">
            {summary.map((line) => (
              <li key={line.text} className={line.ok ? 'is-ok' : 'is-warning'}>
                {line.ok ? (
                  <Check size={14} aria-hidden="true" />
                ) : (
                  <AlertTriangle size={14} aria-hidden="true" />
                )}
                <span>{line.text}</span>
              </li>
            ))}
          </ul>
          <div className="journalit-account-merge-notice__actions">
            <Button
              variant="primary"
              size="small"
              disabled={busy}
              onClick={markReviewed}
            >
              {t('account.merge.action.looks-right')}
            </Button>
            <Button variant="plain" size="small" disabled={busy} onClick={undo}>
              {t('account.merge.action.undo')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="account-date-warning journalit-account-merge-notice"
      role="status"
    >
      <GitMerge size={20} className="account-date-warning__icon" />
      <div className="account-date-warning__content">
        <div className="account-date-warning__title">{title}</div>
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
