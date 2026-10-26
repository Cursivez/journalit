import React, { useEffect, useId, useState } from 'react';
import type JournalitPlugin from '../../../../main';
import type { AccountData } from '../../../../services/account/types';
import type { AccountTradeData } from '../../../../services/accountPage/types';
import type { AccountPageService } from '../../../../services/accountPage/AccountPageService';
import type { PropFirmProfileCatalogService } from '../../../../services/propChallenge/PropFirmProfileCatalogService';
import type {
  PropChallengeConfig,
  PropChallengePhase,
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
} from '../../../../services/propChallenge/PropChallengePolicyHistory';
import { eventBus } from '../../../../services/events/EventBus';
import { t } from '../../../../lang/helpers';
import { CurrencyCode } from '../../../../utils/currencyConfig';
import { Button } from '../../../ui/Button';
import Checkbox from '../../../ui/Checkbox';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { CollapsibleSection } from '../../../shared/CollapsibleSection';
import { ProfilePolicyComparison } from './ProfilePolicyComparison';
import { AlertTriangle, CheckCircle } from '../../../shared/icons/ObsidianIcon';
import { CorrectionAuditHistory } from './CorrectionAuditHistory';

type Preview = Awaited<ReturnType<typeof previewCatalogCorrection>> & {
  at: Date;
};
interface CorrectionReviewServices {
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

type Period = CorrectionMatch['periods'][number];

function formatPeriod(period: Period) {
  if (!period.from)
    return t('account.prop-challenge.summary.phase-status.pending');
  const from = new Date(period.from).toLocaleDateString();
  return period.until
    ? `${from} – ${new Date(period.until).toLocaleDateString()}`
    : t('account.profiles.correction-period-open', { date: from });
}

function CorrectionPeriod({
  period,
  before,
  after,
  currencyCode,
}: {
  period: Period;
  before: PropChallengePhase;
  after: PropChallengePhase;
  currencyCode: string;
}) {
  const at = period.from ? new Date(period.from) : undefined;
  return (
    <div className="journalit-profile-correction__period">
      <div className="journalit-profile-correction__period-head">
        <span className="journalit-profile-correction__label">
          {t('account.profiles.correction-period')}
        </span>
        <span>{formatPeriod(period)}</span>
      </div>
      <ProfilePolicyComparison
        current={{ ...before, ...(at ? policyAt(before, at) : {}) }}
        incoming={{ ...after, ...(at ? policyAt(after, at) : {}) }}
        currencyCode={currencyCode}
        currentLabel={t('account.profiles.correction-before')}
        incomingLabel={t('account.profiles.correction-after')}
      />
    </div>
  );
}

function resultLabel(failed: boolean) {
  return t(
    failed
      ? 'account.prop-challenge.summary.status.failed'
      : 'account.profiles.not-failed'
  );
}


function CorrectionOutcome({
  preview,
  before,
  after,
}: {
  preview: Pick<Preview, 'beforeEvaluation' | 'evaluation'>;
  before: PropChallengePhase;
  after: PropChallengePhase;
}) {
  const wasFailed = Boolean(preview.beforeEvaluation.failure);
  const isFailed = Boolean(preview.evaluation.failure);
  const change =
    before.status !== after.status
      ? {
          from: t(
            `account.prop-challenge.summary.phase-status.${before.status}`
          ),
          to: t(`account.prop-challenge.summary.phase-status.${after.status}`),
          failed: after.status === 'failed',
        }
      : wasFailed !== isFailed
        ? {
            from: resultLabel(wasFailed),
            to: resultLabel(isFailed),
            failed: isFailed,
          }
        : undefined;
  if (!change) return null;
  const Icon = change.failed ? AlertTriangle : CheckCircle;
  return (
    <div
      className={`account-date-warning journalit-prop-transition-notice ${change.failed ? 'is-failed' : 'is-passed'}`}
    >
      <Icon size={20} className="account-date-warning__icon" />
      <div className="account-date-warning__content">
        <div className="account-date-warning__title">
          {t('account.profiles.correction-effect')}
        </div>
        <div className="account-date-warning__desc">
          {change.from} → {change.to}
        </div>
      </div>
    </div>
  );
}

function CorrectionConsent({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}) {
  const helpId = useId();
  return (
    <div className="journalit-profile-correction__consent">
      <Checkbox
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        ariaDescribedBy={helpId}
        label={t('account.profiles.correction-consent')}
      />
      <p id={helpId}>{t('account.profiles.correction-consent-help')}</p>
    </div>
  );
}

const reviewCurrency = (props: Props): string =>
  props.account.currency ??
  props.plugin.settings.general?.currency ??
  CurrencyCode.USD;


const isPreviewCurrent = (
  preview: Preview | undefined,
  match: CorrectionMatch | undefined
): boolean =>
  preview !== undefined &&
  match !== undefined &&
  preview.match.phaseId === match.phaseId &&
  preview.match.correction.id === match.correction.id;


function correctionReviewOf(
  preview: Preview | undefined,
  match: CorrectionMatch | undefined
):
  | { preview: Preview; before: PropChallengePhase; after: PropChallengePhase }
  | undefined {
  if (!preview || !match) return undefined;
  const history = preview.config.correctionHistory;
  const before = history?.[history.length - 1]?.before;
  const after = preview.config.phases.find((p) => p.id === match.phaseId);
  return before && after ? { preview, before, after } : undefined;
}

export function ProfileCorrectionReview(props: Props) {
  const currency = reviewCurrency(props);
  const [choice, setChoice] = useState('0');
  const match = props.matches[Number(choice)];
  const [preview, setPreview] = useState<Preview>();
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const ready = isPreviewCurrent(preview, match);
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
  const review = ready ? correctionReviewOf(preview, match) : undefined;
  return (
    <section className="journalit-profile-review journalit-profile-correction">
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
      {review && (
        <>
          {review.preview.match.periods.map((period) => (
            <CorrectionPeriod
              key={period.from || `pending:${period.until ?? 'open'}`}
              period={period}
              before={review.before}
              after={review.after}
              currencyCode={currency}
            />
          ))}
          <CorrectionOutcome
            preview={review.preview}
            before={review.before}
            after={review.after}
          />
        </>
      )}
      {error && (
        <div className="journalit-profile-correction__error" role="alert">
          <AlertTriangle size={14} />
          <span>{error}</span>
        </div>
      )}
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
      {review && (
        <CorrectionConsent
          checked={confirmed}
          onChange={setConfirmed}
          disabled={saving}
        />
      )}
      <div className="journalit-modal-actions">
        <Button
          variant="plain"
          disabled={saving}
          className="journalit-modal-actions__cancel"
          onClick={() => {
            void save(false);
          }}
        >
          {t('account.profiles.retain')}
        </Button>
        <Button
          variant="primary"
          disabled={!ready || !confirmed || saving || Boolean(error)}
          className="journalit-modal-actions__primary"
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
