import React, { useEffect, useState } from 'react';
import type JournalitPlugin from '../../../../main';
import type { AccountData } from '../../../../services/account/types';
import type { AccountTradeData } from '../../../../services/accountPage/types';
import type { AccountPageService } from '../../../../services/accountPage/AccountPageService';
import type { PropFirmProfileCatalogService } from '../../../../services/propChallenge/PropFirmProfileCatalogService';
import type {
  PropChallengeConfig,
  PropFirmProfileSelection,
} from '../../../../services/propChallenge/types';
import {
  correctionDataFingerprint,
  previewCatalogCorrection,
  type CorrectionMatch,
} from '../../../../services/propChallenge/PropChallengeCatalogCorrections';
import {
  findAccountSourceProfile,
  retainCurrentProfileRules,
  type ProfileNoticeComparison,
} from '../../../../services/propChallenge/PropChallengeProfileNotice';
import {
  policyAt,
  sameProfileContent,
  ruleDefinition,
} from '../../../../services/propChallenge/PropChallengePolicyHistory';
import { eventBus } from '../../../../services/events/EventBus';
import { t } from '../../../../lang/helpers';
import { CurrencyCode } from '../../../../utils/currencyConfig';
import { Button } from '../../../ui/Button';
import Checkbox from '../../../ui/Checkbox';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { CollapsibleSection } from '../../../shared/CollapsibleSection';
import { ProfilePolicyComparison } from './ProfilePolicyComparison';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';

type Preview = Awaited<ReturnType<typeof previewCatalogCorrection>> & {
  at: Date;
};
export interface CorrectionReviewServices {
  accountPageService: Pick<
    AccountPageService,
    'refreshAccountData' | 'updateAccountMetadata'
  > & {
    getAccountPageData: (name: string) => Promise<{
      account: Pick<AccountData, 'propChallenge' | 'transactions'>;
      trades: AccountTradeData[];
    } | null>;
  };
  propFirmProfileCatalogService: Pick<PropFirmProfileCatalogService, 'refresh'>;
}
interface Props {
  plugin: {
    settings: Pick<JournalitPlugin['settings'], 'general' | 'trade'>;
    serviceManager: {
      getServiceByName: <K extends keyof CorrectionReviewServices>(
        name: K
      ) => Promise<CorrectionReviewServices[K]>;
    };
  };
  account: Pick<AccountData, 'name' | 'id' | 'currency'>;
  config: PropChallengeConfig;
  selection: PropFirmProfileSelection;
  comparison: ProfileNoticeComparison;
  matches: CorrectionMatch[];
  onUpdated: () => void | Promise<void>;
  onClose: () => void;
}

function CorrectionDetails({
  sourceUrl,
  children,
}: {
  sourceUrl: string;
  children?: React.ReactNode;
}) {
  return (
    <CollapsibleSection
      title={t('account.profiles.correction-details')}
      defaultOpen={false}
      className="journalit-profile-correction-details"
    >
      {children}
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        {t('account.profiles.correction-source')}
      </a>
    </CollapsibleSection>
  );
}

export function CorrectionAuditHistory({
  config,
  standalone = false,
}: {
  config: PropChallengeConfig;
  standalone?: boolean;
}) {
  const { shouldMask } = useDisplayFormatter();
  const masked = shouldMask('money');
  if (!config.correctionHistory?.length) return null;
  const content = (
    <>
      {config.correctionHistory.map((audit) => (
        <div key={audit.id}>
          <p>
            {new Date(audit.appliedAt).toLocaleDateString()} ·{' '}
            {audit.before.name}
          </p>
          {masked && <p>{t('settings.general.privacy-mode')}</p>}
          {!masked &&
            (
              audit.after.policyHistory ?? [
                {
                  effectiveAt: audit.after.startedAt ?? audit.appliedAt,
                  rules: audit.after.rules,
                  payoutPolicy: audit.after.payoutPolicy,
                },
              ]
            ).map((revision) => {
              const original = policyAt(
                audit.before,
                new Date(revision.effectiveAt)
              );
              if (
                sameProfileContent(
                  original.rules.map(ruleDefinition),
                  revision.rules.map(ruleDefinition)
                ) &&
                sameProfileContent(original.payoutPolicy, revision.payoutPolicy)
              )
                return null;
              return (
                <div key={revision.effectiveAt}>
                  <p>
                    {t('account.profiles.correction-period')}:{' '}
                    {new Date(revision.effectiveAt).toLocaleDateString()}
                  </p>
                  <ProfilePolicyComparison
                    current={{ ...audit.before, ...original }}
                    incoming={{ ...audit.after, ...revision }}
                    currencyCode={audit.currencyCode}
                  />
                </div>
              );
            })}
          {!masked && (
            <CorrectionDetails sourceUrl={audit.correction.sourceUrl}>
              <p>{new Date(audit.appliedAt).toLocaleString()}</p>
              {(
                audit.after.policyHistory ??
                (audit.after.startedAt
                  ? [{ effectiveAt: audit.after.startedAt }]
                  : [])
              ).map((revision) => (
                <p key={revision.effectiveAt}>
                  {new Date(revision.effectiveAt).toLocaleString()}
                </p>
              ))}
            </CorrectionDetails>
          )}
        </div>
      ))}
    </>
  );
  return standalone ? (
    content
  ) : (
    <CollapsibleSection
      title={t('account.profiles.correction-history')}
      defaultOpen={false}
    >
      {content}
    </CollapsibleSection>
  );
}

export function ProfileCorrectionReview(props: Props) {
  const currency =
    props.account.currency ??
    props.plugin.settings.general?.currency ??
    CurrencyCode.USD;
  const [choice, setChoice] = useState('0');
  const match = props.matches[Number(choice)];
  const [preview, setPreview] = useState<Preview>();
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const ready =
    preview &&
    match &&
    preview.match.phaseId === match.phaseId &&
    preview.match.correction.id === match.correction.id;
  useEffect(() => {
    let cancelled = false;
    setPreview(undefined);
    setConfirmed(false);
    setError('');
    if (!match) return;
    void (async () => {
      const service =
        await props.plugin.serviceManager.getServiceByName(
          'accountPageService'
        );
      const data = await service.getAccountPageData(props.account.name);
      if (
        !data ||
        !sameProfileContent(data.account.propChallenge, props.config)
      )
        throw new Error(t('account.profiles.source-changed'));
      const at = new Date();
      const result = await previewCatalogCorrection({
        currencyCode: currency,
        config: props.config,
        selection: props.selection,
        phaseId: match.phaseId,
        correctionId: match.correction.id,
        trades: data.trades,
        transactions: data.account.transactions,
        tradingDayCutoffTime: props.plugin.settings.trade?.tradingDayCutoffTime,
        now: at,
      });
      if (!cancelled) setPreview({ ...result, at });
    })().catch((failure) => {
      if (!cancelled)
        setError(
          failure instanceof Error
            ? failure.message
            : t('account.profiles.error')
        );
    });
    return () => {
      cancelled = true;
    };
  }, [
    match,
    props.account.name,
    props.config,
    props.plugin,
    props.selection,
    currency,
  ]);

  const save = async (apply: boolean) => {
    if (saving || (apply && (!ready || !confirmed))) return;
    setSaving(true);
    setError('');
    try {
      const accounts =
        await props.plugin.serviceManager.getServiceByName(
          'accountPageService'
        );
      let next = retainCurrentProfileRules(props.config, props.comparison);
      if (apply && preview) {
        const catalogService =
          await props.plugin.serviceManager.getServiceByName(
            'propFirmProfileCatalogService'
          );
        const response = await catalogService.refresh({ force: true });
        if (response.kind !== 'ready')
          throw new Error(t('account.profiles.check-failed'));
        const latest = findAccountSourceProfile(
          props.config,
          response.catalog,
          []
        );
        if (
          !latest ||
          !sameProfileContent(latest.challenge, props.selection.challenge)
        )
          throw new Error(t('account.profiles.source-changed'));
        await accounts.refreshAccountData(props.account.name);
        const data = await accounts.getAccountPageData(props.account.name);
        const cutoff = props.plugin.settings.trade?.tradingDayCutoffTime;
        if (
          !data ||
          !sameProfileContent(data.account.propChallenge, props.config) ||
          correctionDataFingerprint(
            data.trades,
            data.account.transactions,
            cutoff
          ) !== preview.dataFingerprint
        )
          throw new Error(t('account.profiles.correction-stale'));
        const fresh = await previewCatalogCorrection({
          currencyCode: currency,
          config: props.config,
          selection: latest,
          phaseId: preview.match.phaseId,
          correctionId: preview.match.correction.id,
          trades: data.trades,
          transactions: data.account.transactions,
          tradingDayCutoffTime: cutoff,
          now: preview.at,
        });
        next = fresh.config;
        const audit =
          next.correctionHistory?.[next.correctionHistory.length - 1];
        if (audit) audit.appliedAt = new Date().toISOString();
      }
      await accounts.updateAccountMetadata(
        props.account.name,
        { propChallenge: next },
        {
          expectedPropChallenge: props.config,
          expectedCurrency: props.account.currency,
        }
      );
      eventBus.publish('account:changed', {
        action: 'updated',
        accountId: props.account.id ?? props.account.name,
        accountName: props.account.name,
      });
      await props.onUpdated();
      props.onClose();
    } catch (failure) {
      setConfirmed(false);
      setError(
        failure instanceof Error ? failure.message : t('account.profiles.error')
      );
    } finally {
      setSaving(false);
    }
  };
  const before =
    preview?.config.correctionHistory?.[
      preview.config.correctionHistory.length - 1
    ]?.before;
  const after = preview?.config.phases.find((p) => p.id === match?.phaseId);
  return (
    <section
      className="journalit-profile-review"
      aria-label={t('account.profiles.correction-title')}
    >
      <div className="journalit-profile-update-source">
        <strong>{props.account.name}</strong>
        <span>
          {props.selection.firmName} · {props.selection.challenge.name}
        </span>
      </div>
      {props.matches.length > 1 && (
        <DropdownSelect
          value={choice}
          onChange={setChoice}
          disabled={saving}
          ariaLabel={t('account.profiles.correction-title')}
          options={props.matches.map((m, i) => ({
            value: String(i),
            label: `${i + 1}. ${props.config.phases.find((p) => p.id === m.phaseId)?.name}${m.periods.length ? ` · ${m.periods.map((period) => (period.from ? new Date(period.from).toLocaleString() : t('account.prop-challenge.summary.phase-status.pending'))).join(', ')}` : ''}`,
          }))}
        />
      )}
      {!preview && !error && (
        <p role="status">{t('account.profiles.applicability-checking')}</p>
      )}
      {ready && preview && before && after && (
        <>
          {preview.match.periods.map((period) => (
            <div key={period.from || `pending:${period.until ?? 'open'}`}>
              <p>
                {t('account.profiles.correction-period')}:{' '}
                {period.from
                  ? new Date(period.from).toLocaleDateString()
                  : t('account.prop-challenge.summary.phase-status.pending')}
                {period.until
                  ? ` – ${new Date(period.until).toLocaleDateString()}`
                  : ''}
              </p>
              <ProfilePolicyComparison
                current={{
                  ...before,
                  ...(period.from
                    ? policyAt(before, new Date(period.from))
                    : {}),
                }}
                incoming={{
                  ...after,
                  ...(period.from
                    ? policyAt(after, new Date(period.from))
                    : {}),
                }}
                currencyCode={currency}
              />
            </div>
          ))}
          {before.status === after.status &&
            Boolean(preview.beforeEvaluation.failure) !==
              Boolean(preview.evaluation.failure) && (
              <p>
                {t('account.profiles.correction-result')}:{' '}
                {t(
                  preview.beforeEvaluation.failure
                    ? 'account.prop-challenge.summary.status.failed'
                    : 'account.profiles.no-hard-breach'
                )}{' '}
                →{' '}
                {t(
                  preview.evaluation.failure
                    ? 'account.prop-challenge.summary.status.failed'
                    : 'account.profiles.no-hard-breach'
                )}
              </p>
            )}
          {before.status !== after.status && (
            <p>
              {t(
                `account.prop-challenge.summary.phase-status.${before.status}`
              )}{' '}
              →{' '}
              {t(`account.prop-challenge.summary.phase-status.${after.status}`)}
            </p>
          )}
          <Checkbox
            checked={confirmed}
            onChange={setConfirmed}
            disabled={saving}
            label={t('account.profiles.correction-consent')}
          />
        </>
      )}
      {error && <p role="alert">{error}</p>}
      {match && (
        <CorrectionDetails sourceUrl={match.correction.sourceUrl}>
          {preview?.match.periods.map((period, index) => (
            <p key={index}>
              {period.from
                ? new Date(period.from).toLocaleString()
                : t('account.prop-challenge.summary.phase-status.pending')}
              {period.until
                ? ` – ${new Date(period.until).toLocaleString()}`
                : ''}
            </p>
          ))}
        </CorrectionDetails>
      )}
      <div className="journalit-profile-review__actions">
        <Button
          size="small"
          variant="plain"
          disabled={saving}
          onClick={() => {
            void save(false);
          }}
        >
          {t('account.profiles.retain')}
        </Button>
        <Button
          size="small"
          disabled={!ready || !confirmed || saving || Boolean(error)}
          onClick={() => {
            void save(true);
          }}
        >
          {t('account.profiles.correction-apply')}
        </Button>
      </div>
      <CorrectionAuditHistory config={props.config} />
    </section>
  );
}
