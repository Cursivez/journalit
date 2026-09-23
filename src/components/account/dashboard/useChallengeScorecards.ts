

import { useCurrency } from '../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { t } from '../../../lang/helpers';
import type {
  aggregatePropChallengeStats,
  aggregatePropFirmStats,
} from '../../../services/propChallenge/PropChallengeAggregation';

const EM_DASH = '—';

export interface ScorecardMetric {
  key: string;
  label: string;
  value: string;
  valueClassName?: string;
  explanation?: {
    description: string;
    formula: string;
    calculations: string[];
  };
}

type ChallengeStats = ReturnType<typeof aggregatePropChallengeStats>;
type FirmStats = ReturnType<typeof aggregatePropFirmStats>;
type MonetaryField = keyof Omit<
  ChallengeStats['monetaryTotals'][number],
  'currencyCode'
>;

interface ChallengeScorecards {
  summaryMetrics: ScorecardMetric[];
  economicsMetrics: ScorecardMetric[];
  formatCount: (value: number) => string;
  formatPercent: (value: number | undefined) => string;
  formatDuration: (days: number | undefined) => string;
  formatFirmNet: (firm: FirmStats['firms'][number]) => string;
  
  hideFailureSignal: boolean;
}

export function useChallengeScorecards(
  stats: ChallengeStats,
  firmStats: FirmStats
): ChallengeScorecards {
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();

  const monetaryOutcomesMasked = shouldMask('pnl');
  const returnMetricsMasked = shouldMask('returnPercent');
  
  const outcomeCountsMasked = shouldMask('metric');
  const singleCurrencyTotals =
    stats.monetaryTotals.length === 1 ? stats.monetaryTotals[0] : undefined;
  const netClass =
    monetaryOutcomesMasked || !singleCurrencyTotals
      ? ''
      : singleCurrencyTotals.netPayouts >= 0
        ? ' is-positive'
        : ' is-negative';
  const roi =
    singleCurrencyTotals && singleCurrencyTotals.totalCosts > 0
      ? (singleCurrencyTotals.netPayouts / singleCurrencyTotals.totalCosts) *
        100
      : undefined;
  
  
  
  
  const roiHasNoCostBasis = Boolean(
    singleCurrencyTotals &&
    singleCurrencyTotals.totalCosts === 0 &&
    singleCurrencyTotals.totalPayouts > 0
  );
  const roiClass =
    returnMetricsMasked || roi === undefined
      ? ''
      : roi >= 0
        ? ' is-positive'
        : ' is-negative';

  const formatMonetaryTotals = (
    field: MonetaryField,
    kind: 'money' | 'pnl'
  ): string =>
    stats.monetaryTotals
      .map((totals) =>
        formatValue({
          kind,
          value: totals[field],
          currencyCode: totals.currencyCode || currency,
          notation: 'compact',
        })
      )
      .join(' · ');

  const formatAverageCost = (
    divisor: 'challengeCount' | 'passedChallenges'
  ): string => {
    const values = stats.monetaryTotals.flatMap((totals) =>
      totals[divisor] === 0
        ? []
        : [
            formatValue({
              kind: 'money',
              value: totals.totalCosts / totals[divisor],
              currencyCode: totals.currencyCode || currency,
              notation: 'compact',
            }),
          ]
    );
    return values.length === 0 ? EM_DASH : values.join(' · ');
  };

  const formatPercent = (value: number | undefined): string =>
    formatValue({
      kind: 'returnPercent',
      value,
      signed: false,
      precision: 1,
      fallback: EM_DASH,
    });

  const formatCount = (value: number): string =>
    formatValue({ kind: 'count', value });

  const formatMoney = (
    value: number,
    currencyCode: string | undefined,
    kind: 'money' | 'pnl' = 'money'
  ): string =>
    formatValue({
      kind,
      value,
      currencyCode: currencyCode || currency,
    });

  const formatFirmNet = (firm: (typeof firmStats.firms)[number]): string =>
    firm.monetaryTotals
      .map((totals) =>
        formatValue({
          kind: 'pnl',
          value: totals.netPayouts,
          currencyCode: totals.currencyCode || currency,
          notation: 'compact',
        })
      )
      .join(' · ');

  const unavailableCalculation = t(
    'account-dashboard.prop.tooltip.calculation-unavailable'
  );

  const formatDuration = (days: number | undefined): string =>
    days === undefined
      ? EM_DASH
      : t('account-dashboard.prop.phases.days', {
          
          
          
          count: formatValue({ kind: 'metric', value: days, precision: 0 }),
        });

  const summaryMetrics: ScorecardMetric[] = [
    {
      key: 'active',
      label: t('account-dashboard.prop.metrics.active'),
      value: formatValue({
        kind: 'count',
        value: stats.activeChallenges,
      }),
    },
    {
      key: 'pass-rate',
      label: t('account-dashboard.prop.metrics.pass-rate'),
      value: formatPercent(stats.passRate),
      explanation: {
        description: t('account-dashboard.prop.tooltip.pass-rate.description'),
        formula: t('account-dashboard.prop.tooltip.pass-rate.formula'),
        calculations: outcomeCountsMasked
          ? []
          : [
              stats.completedChallenges === 0
                ? unavailableCalculation
                : `${formatCount(stats.passedChallenges)} ÷ ${formatCount(stats.completedChallenges)} × 100 = ${formatPercent(stats.passRate)}`,
            ],
      },
    },
    {
      key: 'costs',
      label: t('account-dashboard.prop.metrics.costs'),
      value: formatMonetaryTotals('totalCosts', 'money'),
    },
    {
      key: 'payouts',
      label: t('account-dashboard.prop.metrics.payouts'),
      value: formatMonetaryTotals('totalPayouts', 'money'),
    },
    {
      key: 'net',
      label: t('account-dashboard.prop.metrics.net'),
      value: formatMonetaryTotals('netPayouts', 'pnl'),
      valueClassName: netClass,
    },
  ];

  const economicsMetrics: ScorecardMetric[] = [
    {
      key: 'roi',
      label: t('account-dashboard.prop.economics.roi'),
      value:
        roiHasNoCostBasis && !returnMetricsMasked
          ? t('account-dashboard.prop.economics.roi-no-cost')
          : formatPercent(roi),
      valueClassName: roiClass,
      explanation: {
        description: t('account-dashboard.prop.tooltip.roi.description'),
        formula: t('account-dashboard.prop.tooltip.roi.formula'),
        calculations: [
          singleCurrencyTotals && singleCurrencyTotals.totalCosts > 0
            ? `(${formatMoney(singleCurrencyTotals.totalPayouts, singleCurrencyTotals.currencyCode)} − ${formatMoney(singleCurrencyTotals.totalCosts, singleCurrencyTotals.currencyCode)}) ÷ ${formatMoney(singleCurrencyTotals.totalCosts, singleCurrencyTotals.currencyCode)} × 100 = ${formatPercent(roi)}`
            : roiHasNoCostBasis
              ? t('account-dashboard.prop.tooltip.roi.no-cost', {
                  payouts: formatMoney(
                    singleCurrencyTotals?.totalPayouts ?? 0,
                    singleCurrencyTotals?.currencyCode
                  ),
                })
              : unavailableCalculation,
        ],
      },
    },
    {
      key: 'average-cost',
      label: t('account-dashboard.prop.economics.average-cost-per-attempt'),
      value: formatAverageCost('challengeCount'),
      explanation: {
        description: t(
          'account-dashboard.prop.tooltip.average-cost.description'
        ),
        formula: t('account-dashboard.prop.tooltip.average-cost.formula'),
        calculations:
          stats.monetaryTotals.length === 0
            ? [unavailableCalculation]
            : stats.monetaryTotals.map(
                (totals) =>
                  `${formatMoney(totals.totalCosts, totals.currencyCode)} ÷ ${formatCount(totals.challengeCount)} = ${formatMoney(totals.totalCosts / totals.challengeCount, totals.currencyCode)}`
              ),
      },
    },
    {
      key: 'funded-cost',
      label: t('account-dashboard.prop.economics.cost-per-funded-account'),
      value: formatAverageCost('passedChallenges'),
      explanation: {
        description: t(
          'account-dashboard.prop.tooltip.funded-cost.description'
        ),
        formula: t('account-dashboard.prop.tooltip.funded-cost.formula'),
        calculations: (() => {
          if (outcomeCountsMasked) return [];
          const calculations = stats.monetaryTotals.flatMap((totals) =>
            totals.passedChallenges === 0
              ? []
              : [
                  `${formatMoney(totals.totalCosts, totals.currencyCode)} ÷ ${formatCount(totals.passedChallenges)} = ${formatMoney(totals.totalCosts / totals.passedChallenges, totals.currencyCode)}`,
                ]
          );
          return calculations.length === 0
            ? [unavailableCalculation]
            : calculations;
        })(),
      },
    },
    {
      key: 'payout-conversion',
      label: t('account-dashboard.prop.economics.payout-conversion'),
      value: formatPercent(stats.payoutConversionRate),
      explanation: {
        description: t(
          'account-dashboard.prop.tooltip.payout-conversion.description'
        ),
        formula: t('account-dashboard.prop.tooltip.payout-conversion.formula'),
        calculations: outcomeCountsMasked
          ? []
          : [
              stats.passedChallenges === 0
                ? unavailableCalculation
                : `${formatCount(stats.passedChallengesWithPayouts)} ÷ ${formatCount(stats.passedChallenges)} × 100 = ${formatPercent(stats.payoutConversionRate)}`,
            ],
      },
    },
  ];

  return {
    summaryMetrics,
    economicsMetrics,
    formatCount,
    formatPercent,
    formatDuration,
    formatFirmNet,
    hideFailureSignal: returnMetricsMasked,
  };
}
