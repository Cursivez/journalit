

import React, { memo, useMemo, useCallback, useId } from 'react';
import JournalitPlugin from '../../../main';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useHomePeriod } from '../context/HomePeriodContext';
import { useHomeAccount } from '../context/HomeAccountContext';
import { useHomeAccountsData } from '../context/HomeAccountsDataContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { HomePeriod } from '../../../settings/types';
import { aggregatePropChallengeEconomics } from '../../../services/propChallenge/PropChallengeAggregation';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { t } from '../../../lang/helpers';

interface EvalRoiWidgetProps {
  plugin: JournalitPlugin;
}

const EM_DASH = '—';

function getPeriodLabel(period: HomePeriod): string {
  switch (period) {
    case 'month':
      return t('home.widget.aum.period.month');
    case 'quarter':
      return t('home.widget.aum.period.quarter');
    case 'year':
      return t('home.widget.aum.period.year');
    case 'lifetime':
    default:
      return t('home.widget.aum.period.all');
  }
}

function EvalRoiLoadingState() {
  return (
    <div className="journalit-home-eval-roi journalit-home-eval-roi--loading">
      <div className="journalit-home-eval-roi__header">
        <SkeletonText width="60px" height="11px" />
        <SkeletonText width="70px" height="11px" />
      </div>
      <div className="journalit-home-eval-roi__body">
        <SkeletonBox width={132} height={70} borderRadius="66px 66px 4px 4px" />
        <div className="journalit-home-eval-roi__ledger">
          <SkeletonText width="100%" height="13px" />
          <SkeletonText width="100%" height="13px" />
          <SkeletonText width="100%" height="13px" />
        </div>
      </div>
    </div>
  );
}

function EvalRoiEmptyState({ message }: { message: string }) {
  return (
    <div className="journalit-home-eval-roi__empty">
      <span className="journalit-home-widget__eyebrow">
        {t('home.widget.eval-roi.title')}
      </span>
      <span className="journalit-home-widget__muted">{message}</span>
    </div>
  );
}


const GAUGE_LIMIT = 100;
const GAUGE_RADIUS = 48;
const GAUGE_STROKE = 6;
const GAUGE_WIDTH = GAUGE_RADIUS * 2 + GAUGE_STROKE;
const GAUGE_HEIGHT = GAUGE_RADIUS + GAUGE_STROKE;
const GAUGE_HALF_ARC_LENGTH = (Math.PI * GAUGE_RADIUS) / 2;

type GaugeSide = 'positive' | 'negative' | 'none';

function gaugeState(roi: number | undefined): {
  side: GaugeSide;
  fraction: number;
} {
  if (roi === undefined || roi === 0) return { side: 'none', fraction: 0 };
  return {
    side: roi > 0 ? 'positive' : 'negative',
    fraction: Math.min(GAUGE_LIMIT, Math.abs(roi)) / GAUGE_LIMIT,
  };
}

function EvalRoiGauge({
  roi,
  isMasked,
  breakEvenLabel,
}: {
  roi: number | undefined;
  isMasked: boolean;
  breakEvenLabel: string;
}) {
  const cx = GAUGE_WIDTH / 2;
  const cy = GAUGE_RADIUS + GAUGE_STROKE / 2;
  const top = `${cx} ${cy - GAUGE_RADIUS}`;
  
  const rightArc = `M ${top} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${cx + GAUGE_RADIUS} ${cy}`;
  const leftArc = `M ${top} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 0 ${cx - GAUGE_RADIUS} ${cy}`;
  const { side, fraction } = isMasked
    ? { side: 'none' as GaugeSide, fraction: 0 }
    : gaugeState(roi);
  const fillPath = side === 'negative' ? leftArc : rightArc;
  const fillClass =
    side === 'positive'
      ? ' journalit-home-eval-roi__tone--positive'
      : side === 'negative'
        ? ' journalit-home-eval-roi__tone--negative'
        : ' journalit-home-eval-roi__gauge-fill--empty';
  const tickInner = GAUGE_RADIUS - GAUGE_STROKE;
  const tickOuter = GAUGE_RADIUS + GAUGE_STROKE;
  
  
  const clipId = useId();
  const clipX = side === 'negative' ? -GAUGE_STROKE : cx;
  const clipWidth = GAUGE_WIDTH / 2 + GAUGE_STROKE;

  return (
    <svg
      viewBox={`0 0 ${GAUGE_WIDTH} ${GAUGE_HEIGHT}`}
      className="journalit-home-eval-roi__gauge-svg"
      role="img"
      aria-label={breakEvenLabel}
    >
      <title>{breakEvenLabel}</title>
      <defs>
        <clipPath id={clipId}>
          <rect
            x={clipX}
            y={-GAUGE_STROKE}
            width={clipWidth}
            height={GAUGE_HEIGHT + GAUGE_STROKE * 2}
          />
        </clipPath>
      </defs>
      <path
        d={leftArc}
        className="journalit-home-eval-roi__gauge-track"
        fill="none"
        strokeWidth={GAUGE_STROKE}
        strokeLinecap="round"
      />
      <path
        d={rightArc}
        className="journalit-home-eval-roi__gauge-track"
        fill="none"
        strokeWidth={GAUGE_STROKE}
        strokeLinecap="round"
      />
      <path
        d={fillPath}
        className={`journalit-home-eval-roi__gauge-fill${fillClass}`}
        fill="none"
        strokeWidth={GAUGE_STROKE}
        strokeLinecap="round"
        strokeDasharray={`${GAUGE_HALF_ARC_LENGTH * fraction} ${GAUGE_HALF_ARC_LENGTH}`}
        clipPath={`url(#${clipId})`}
        data-side={side}
        data-fraction={fraction.toFixed(3)}
      />
      <line
        x1={cx}
        y1={cy - tickOuter}
        x2={cx}
        y2={cy - tickInner}
        className="journalit-home-eval-roi__gauge-tick"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

const EvalRoiWidgetComponent: React.FC<EvalRoiWidgetProps> = ({ plugin }) => {
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const periodContext = useHomePeriod();
  const accountContext = useHomeAccount();
  const homeAccountsData = useHomeAccountsData();
  const accounts = useMemo(
    () => homeAccountsData?.accounts || [],
    [homeAccountsData?.accounts]
  );
  const isLoading = homeAccountsData?.isLoading ?? true;
  const error = homeAccountsData?.error ?? null;
  const period = periodContext?.period || 'month';
  const isDateInPeriod = periodContext?.isDateInPeriod;

  const openAccountDashboard = useCallback(() => {
    void plugin.viewManager.openAccountDashboardView();
  }, [plugin]);

  const economics = useMemo(() => {
    const challengeAccounts = accounts.filter(
      (account) =>
        account.propChallenge !== undefined &&
        (accountContext?.matchesAccount(account.accountName || account.name) ??
          true)
    );
    if (challengeAccounts.length === 0) return null;
    return aggregatePropChallengeEconomics(challengeAccounts, isDateInPeriod);
  }, [accounts, accountContext, isDateInPeriod]);

  if (isLoading) {
    return <EvalRoiLoadingState />;
  }

  if (error) {
    return (
      <EvalRoiEmptyState message={t('home.widget.eval-roi.unable-to-load')} />
    );
  }

  if (!economics) {
    return (
      <EvalRoiEmptyState message={t('home.widget.eval-roi.no-challenges')} />
    );
  }

  const { challengeCount, totalsByCurrency } = economics;
  
  const singleCurrency =
    totalsByCurrency.length === 1 ? totalsByCurrency[0] : undefined;
  const roi = singleCurrency?.roi;
  const isReturnMasked = shouldMask('returnPercent');
  const isMoneyMasked = shouldMask('money') || shouldMask('pnl');

  const formatTotals = (
    field: 'totalCosts' | 'totalPayouts' | 'netPayouts',
    kind: 'money' | 'pnl'
  ): string =>
    totalsByCurrency
      .map((totals) =>
        formatValue({
          kind,
          value: totals[field],
          currencyCode: totals.currencyCode || currency,
          showCents: false,
          notation: 'compact',
        })
      )
      .join(' · ');

  const formattedRoi = formatValue({
    kind: 'returnPercent',
    value: roi,
    precision: 1,
    fallback: EM_DASH,
  });
  const roiToneClass =
    isReturnMasked || roi === undefined
      ? ''
      : roi >= 0
        ? ' journalit-home-eval-roi__tone--positive'
        : ' journalit-home-eval-roi__tone--negative';

  const netValue = singleCurrency?.netPayouts;
  const netToneClass =
    isMoneyMasked || netValue === undefined
      ? ''
      : netValue >= 0
        ? ' journalit-home-eval-roi__tone--positive'
        : ' journalit-home-eval-roi__tone--negative';

  const countLabel =
    challengeCount === 1
      ? t('home.widget.eval-roi.challenge-count', { count: '1' })
      : t('home.widget.eval-roi.challenge-count-plural', {
          count: String(challengeCount),
        });

  return (
    <div
      onClick={openAccountDashboard}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') {
          return;
        }

        e.preventDefault();
        openAccountDashboard();
      }}
      role="button"
      tabIndex={0}
      className="journalit-home-eval-roi"
    >
      <div className="journalit-home-eval-roi__header">
        <span className="journalit-home-widget__eyebrow">
          {t('home.widget.eval-roi.title')}
        </span>
        <span className="journalit-home-widget__faint">
          {countLabel} · {getPeriodLabel(period)}
        </span>
      </div>

      <div className="journalit-home-eval-roi__body">
        <div className="journalit-home-eval-roi__gauge">
          <EvalRoiGauge
            roi={roi}
            isMasked={isReturnMasked}
            breakEvenLabel={t('home.widget.eval-roi.break-even')}
          />
          <div
            className={`journalit-home-eval-roi__hero${roiToneClass}`}
            aria-label={t('home.widget.eval-roi.roi-aria')}
          >
            {formattedRoi}
          </div>
        </div>

        <dl className="journalit-home-eval-roi__ledger">
          <div className="journalit-home-eval-roi__ledger-row">
            <dt className="journalit-home-eval-roi__ledger-label">
              {t('home.widget.eval-roi.spent')}
            </dt>
            <dd className="journalit-home-eval-roi__ledger-value journalit-home-eval-roi__ledger-value--muted">
              {formatTotals('totalCosts', 'money')}
            </dd>
          </div>
          <div className="journalit-home-eval-roi__ledger-row">
            <dt className="journalit-home-eval-roi__ledger-label">
              {t('home.widget.eval-roi.payouts')}
            </dt>
            <dd className="journalit-home-eval-roi__ledger-value">
              {formatTotals('totalPayouts', 'money')}
            </dd>
          </div>
          <div className="journalit-home-eval-roi__ledger-row journalit-home-eval-roi__ledger-row--net">
            <dt className="journalit-home-eval-roi__ledger-label">
              {t('home.widget.eval-roi.net')}
            </dt>
            <dd
              className={`journalit-home-eval-roi__ledger-value${netToneClass}`}
            >
              {formatTotals('netPayouts', 'pnl')}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export const EvalRoiWidget = memo(EvalRoiWidgetComponent);
