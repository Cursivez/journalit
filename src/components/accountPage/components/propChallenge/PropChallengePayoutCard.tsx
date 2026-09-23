

import React, { useId, useMemo, useState } from 'react';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { t } from '../../../../lang/helpers';
import { useGuideTarget } from '../../../../guides/GuideRuntimeLayer';
import { ACCOUNT_PAGE_PAYOUT_SECTION_TARGET_ID } from '../../../../guides/accountPageGuideIds';
import {
  previewPropChallengePayout,
  type PropChallengePayoutEvaluation,
} from '../../../../services/propChallenge/PropChallengePayoutEngine';
import type {
  PropChallengePayoutPolicy,
  PropChallengePhase,
} from '../../../../services/propChallenge/types';
import { AlertTriangle } from '../../../shared/icons/ObsidianIcon';
import { SegmentedProgress } from '../../../shared/SegmentedProgress';
import type { PropChallengePhaseEvaluationResult } from './usePropChallengeCockpitState';

interface Props {
  currency: string;
  evaluation: PropChallengePhaseEvaluationResult;
  payout: PropChallengePayoutEvaluation;
  phase: PropChallengePhase;
  policy: PropChallengePayoutPolicy;
}


const Notice: React.FC<{
  tone: 'warning' | 'danger' | 'info';
  children: string;
}> = ({ tone, children }) => (
  <p className={`journalit-prop-payout-detail__notice is-${tone}`}>
    {tone === 'info' ? null : <AlertTriangle aria-hidden="true" size={12} />}
    <span>{children}</span>
  </p>
);

const Line: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="journalit-prop-payout-detail__line">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export const PropChallengePayoutCard: React.FC<Props> = ({
  currency,
  evaluation,
  payout,
  phase,
  policy,
}) => {
  const { formatValue } = useDisplayFormatter();
  const registerPayoutTarget = useGuideTarget(
    ACCOUNT_PAGE_PAYOUT_SECTION_TARGET_ID
  );
  const titleId = useId();
  
  
  const [draft, setDraft] = useState<string | null>(null);
  const requestInput = draft ?? payout.availableAmount.toFixed(2);
  const requestedAmount = Number.parseFloat(requestInput);
  const normalizedRequest = Number.isFinite(requestedAmount)
    ? Math.max(0, requestedAmount)
    : 0;
  const impact = useMemo(
    () =>
      previewPropChallengePayout({
        phase,
        policy,
        evaluation,
        payout,
        requestedAmount: normalizedRequest,
      }),
    [evaluation, normalizedRequest, payout, phase, policy]
  );
  const money = (value: number) =>
    formatValue({ kind: 'pnl', value, currencyCode: currency });

  
  
  const gates = [
    ...payout.requirements.map((requirement) => requirement.satisfied),
    ...(payout.lifetimeQualifyingDays
      ? [payout.lifetimeQualifyingDays.unlocked]
      : []),
  ];
  const metCount = gates.filter(Boolean).length;

  
  
  return (
    <>
      <section
        aria-labelledby={titleId}
        className="journalit-prop-payout-head"
        ref={registerPayoutTarget}
      >
        <span className="journalit-account-page-sr-only" id={titleId}>
          {t('account.prop-challenge.payout.title')}
        </span>

        <div className="journalit-prop-payout-head__hero">
          <span className="journalit-prop-payout-head__label">
            {t('account.prop-challenge.payout.available')}
          </span>
          <strong className="journalit-prop-payout-head__amount">
            {money(payout.availableAmount)}
          </strong>
        </div>

        {gates.length > 0 ? (
          <div className="journalit-prop-payout-head__gates">
            <SegmentedProgress
              className="journalit-prop-payout-head__bar"
              completed={metCount}
              total={gates.length}
              tone="positive"
            />
            <span className="journalit-prop-payout-head__caption">
              {t('account.prop-challenge.payout.met-of-total', {
                met: String(metCount),
                total: String(gates.length),
              })}
            </span>
          </div>
        ) : null}
      </section>

      <div className="journalit-prop-payout-detail">
        <label className="journalit-prop-payout-detail__preview">
          <span>{t('account.prop-challenge.payout.preview-amount')}</span>
          <input
            max={payout.availableAmount}
            min={payout.minimumRequest}
            onChange={(event) => setDraft(event.target.value)}
            step="0.01"
            type="number"
            value={requestInput}
          />
        </label>

        {!impact.requestAllowed && (
          <Notice tone="warning">
            {t('account.prop-challenge.payout.request-not-allowed')}
          </Notice>
        )}
        {impact.immediateBreach && (
          <Notice tone="danger">
            {t('account.prop-challenge.payout.immediate-breach')}
          </Notice>
        )}
        {!impact.immediateBreach && impact.accountConcludes && (
          <Notice tone="warning">
            {t('account.prop-challenge.payout.account-concludes')}
          </Notice>
        )}
        {!impact.immediateBreach &&
          impact.maximumPayoutOutcome === 'promote_to_next_phase' && (
            <Notice tone="info">
              {t('account.prop-challenge.payout.next-stage-after-payout')}
            </Notice>
          )}
        {!impact.immediateBreach &&
          impact.maximumPayoutOutcome === 'eligible_for_live_review' && (
            <Notice tone="info">
              {t('account.prop-challenge.payout.live-review-after-payout')}
            </Notice>
          )}

        <div className="journalit-prop-payout-detail__lines">
          <Line
            label={t('account.prop-challenge.payout.you-receive')}
            value={money(impact.traderReceives)}
          />
          <Line
            label={t('account.prop-challenge.payout.balance-after')}
            value={money(impact.postPayoutBalance)}
          />
          {impact.drawdownFloor !== undefined && (
            <Line
              label={t('account.prop-challenge.payout.drawdown-floor')}
              value={money(impact.drawdownFloor)}
            />
          )}
          {impact.remainingDrawdownBuffer !== undefined && (
            <Line
              label={t('account.prop-challenge.payout.buffer-after')}
              value={money(impact.remainingDrawdownBuffer)}
            />
          )}
        </div>
      </div>
    </>
  );
};
