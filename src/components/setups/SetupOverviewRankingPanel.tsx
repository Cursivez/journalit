
import React, { useMemo } from 'react';
import { t } from '../../lang/helpers';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { cssVars } from '../../styles/inlineStylePolicy';
import { SetupOverviewCumulativePnlChart } from '../charts/SetupOverviewCumulativePnlChart';
import type { DropdownMenuOption } from '../shared/DropdownMenu';
import {
  DisplayValue,
  MetricValue,
  PercentValue,
} from '../shared/display/DisplayValue';
import {
  ALL_OUTCOMES_ONLY_METRIC_KEYS,
  METRIC_OPTIONS,
  OUTCOME_SCOPE_FALLBACK_METRIC_KEY,
  OVERVIEW_R_METRIC_KEYS,
  SETUP_PAIR_METRIC_OPTIONS,
} from './setupOverviewMetrics';
import {
  scopeSetupOverviewChartData,
  type SetupOutcome,
} from './setupOverviewScope';
import {
  OUTCOME_METRIC_LABEL_KEY,
  SetupOutcomeSummary,
} from './SetupOverviewOutcome';
import {
  getOverviewChartHeight,
  OVERVIEW_LINE_CHART_HEIGHT,
  SetupPerformanceEmptyState,
  type SetupPerformanceHeaderRenderer,
} from './SetupOverviewPerformanceChrome';
import {
  SetupPairMetricSelect,
  SetupPairsSplitInsight,
  SetupPairsSummaryPanel,
} from './SetupPairsPanel';
import type {
  MetricKey,
  SetupOutcomeMetricsSource,
  SetupOverviewPnlChartModel,
  SetupOverviewPnlSeries,
  SetupPairMetricKey,
  SetupTradeIndex,
  SetupViewModel,
} from './setupsViewTypes';
import {
  buildSetupOverviewPnlChartModel,
  buildSetupRankingChartData,
  calculateCompareMetrics,
  getMetricLeader,
  getMetricValue,
} from './setupsViewModel';
import { useSetupPairPerformanceModel } from './useSetupOverviewPerformance';
import { SetupTradeCount } from './SetupTradeCount';

const LazySetupPerformanceRankingChart = React.lazy(async () => {
  const module = await import('../charts/SharedSetupPerformanceChart');
  return { default: module.SetupPerformanceRankingChart };
});


export const resolveOverviewMetric = (
  metricKey: MetricKey,
  displayRMultiples: boolean,
  shouldMask: ReturnType<typeof useDisplayFormatter>['shouldMask'],
  outcome: SetupOutcome | null
) => {
  const visibleMetricKey: MetricKey =
    displayRMultiples || !OVERVIEW_R_METRIC_KEYS.has(metricKey)
      ? metricKey
      : 'profitFactor';
  const effectiveMetricKey: MetricKey =
    outcome && ALL_OUTCOMES_ONLY_METRIC_KEYS.has(visibleMetricKey)
      ? OUTCOME_SCOPE_FALLBACK_METRIC_KEY
      : visibleMetricKey;
  const metric =
    METRIC_OPTIONS.find((option) => option.key === effectiveMetricKey) ??
    METRIC_OPTIONS[0];
  const cumulativeMetricKind: 'pnl' | 'rMultiple' =
    effectiveMetricKey === 'cumulativeR' ? 'rMultiple' : 'pnl';
  return {
    effectiveMetricKey,
    metric,
    isChartMasked:
      metric.displayKind !== 'count' && shouldMask(metric.displayKind),
    isCumulativeMetric:
      effectiveMetricKey === 'cumulativePnl' ||
      effectiveMetricKey === 'cumulativeR',
    cumulativeMetricKind,
  };
};


const performanceChartDisplay = ({
  isPairsMode,
  isCumulativeMetric,
  pairModelCount,
  pairChartCount,
  cumulativeCount,
  rankingCount,
  isMasked,
}: {
  isPairsMode: boolean;
  isCumulativeMetric: boolean;
  pairModelCount: number;
  pairChartCount: number;
  cumulativeCount: number;
  rankingCount: number;
  isMasked: boolean;
}) => {
  const seriesCount = isCumulativeMetric ? cumulativeCount : rankingCount;
  const hasUsableData = (isPairsMode ? pairModelCount : seriesCount) > 0;
  const isEmpty = (isPairsMode ? pairChartCount : seriesCount) === 0;
  return {
    showEmpty: isEmpty || (!hasUsableData && !isMasked),
    showPrivacyNote: !isEmpty && isMasked,
    showChart: !isEmpty && (hasUsableData || isMasked),
  };
};

const leaderMetricValueOf = (
  leader: SetupViewModel | null,
  metricKey: MetricKey,
  rMetricsBySetupId: Map<string, ReturnType<typeof calculateCompareMetrics>>
) =>
  leader
    ? getMetricValue(
        leader.metrics,
        metricKey,
        rMetricsBySetupId.get(leader.setup.id)
      )
    : null;

const SetupPerformancePrivacyNote: React.FC<{ isPairsMode: boolean }> = ({
  isPairsMode,
}) => (
  <p className="journalit-setups-privacy-note">
    {isPairsMode
      ? t('setups.view.pairs.privacy')
      : t('setups.view.ranking.privacy')}
  </p>
);


type OverviewMetric = ReturnType<typeof resolveOverviewMetric>;


function outcomeMetricLabel(
  labelKey: OverviewMetric['metric']['labelKey'],
  outcome: SetupOutcome | null
): string {
  return outcome
    ? t(OUTCOME_METRIC_LABEL_KEY[outcome], { metric: t(labelKey) })
    : t(labelKey);
}


function useSetupRankingModel({
  viewModels,
  tradeIndex,
  outcomeMetrics,
  outcome,
  allSetupsSelected,
  effectiveMetricKey,
  isChartMasked,
  isCumulativeMetric,
  cumulativeMetricKind,
}: {
  viewModels: SetupViewModel[];
  tradeIndex: SetupTradeIndex;
  outcomeMetrics: SetupOutcomeMetricsSource;
  outcome: SetupOutcome | null;
  allSetupsSelected: boolean;
  effectiveMetricKey: OverviewMetric['effectiveMetricKey'];
  isChartMasked: boolean;
  isCumulativeMetric: boolean;
  cumulativeMetricKind: OverviewMetric['cumulativeMetricKind'];
}) {
  const scopedChartData = useMemo(
    () =>
      outcome
        ? scopeSetupOverviewChartData(
            viewModels,
            tradeIndex,
            outcome,
            outcomeMetrics
          )
        : null,
    [outcome, outcomeMetrics, tradeIndex, viewModels]
  );
  const chartViewModels = scopedChartData?.viewModels ?? viewModels;
  const chartTradeIndex = scopedChartData?.tradeIndex ?? tradeIndex;
  const rMetricsBySetupId = useMemo(
    () =>
      new Map(
        chartViewModels.map(({ setup }) => [
          setup.id,
          calculateCompareMetrics(chartTradeIndex.any.get(setup.id) ?? []),
        ])
      ),
    [chartViewModels, chartTradeIndex]
  );
  const pnlChartModel = useMemo(
    () =>
      buildSetupOverviewPnlChartModel(
        chartViewModels,
        chartTradeIndex,
        allSetupsSelected,
        cumulativeMetricKind
      ),
    [allSetupsSelected, chartViewModels, cumulativeMetricKind, chartTradeIndex]
  );
  
  const ranksByMagnitude = outcome !== null;
  
  const rankedViewModels = useMemo(
    () =>
      outcome
        ? chartViewModels.filter(({ metrics }) => metrics.totalTrades > 0)
        : chartViewModels,
    [chartViewModels, outcome]
  );
  const chartData = useMemo(
    () =>
      isCumulativeMetric
        ? []
        : buildSetupRankingChartData(
            rankedViewModels,
            effectiveMetricKey,
            isChartMasked,
            rMetricsBySetupId,
            ranksByMagnitude
          ),
    [
      effectiveMetricKey,
      isChartMasked,
      isCumulativeMetric,
      rankedViewModels,
      ranksByMagnitude,
      rMetricsBySetupId,
    ]
  );

  const performanceLeader = useMemo(
    () =>
      isChartMasked
        ? null
        : getMetricLeader(
            chartViewModels,
            effectiveMetricKey,
            rMetricsBySetupId,
            ranksByMagnitude
          ),
    [
      chartViewModels,
      effectiveMetricKey,
      isChartMasked,
      ranksByMagnitude,
      rMetricsBySetupId,
    ]
  );
  const needsReviewCount = useMemo(
    () =>
      chartViewModels.filter(
        ({ setup, completenessBadges }) =>
          setup.status !== 'archived' && completenessBadges.length > 0
      ).length,
    [chartViewModels]
  );
  return {
    
    outcomeSummary:
      outcome && scopedChartData
        ? { outcome, tradeCount: scopedChartData.tradeCount }
        : null,
    
    cumulativeCount:
      rankedViewModels.length > 0 ? pnlChartModel.data.length : 0,
    rMetricsBySetupId,
    pnlChartModel,
    rankedViewModels,
    chartData,
    performanceLeader,
    needsReviewCount,
  };
}

export const SetupRankingPanel: React.FC<{
  viewModels: SetupViewModel[];
  tradeIndex: SetupTradeIndex;
  outcomeMetrics: SetupOutcomeMetricsSource;
  outcome: SetupOutcome | null;
  isPairsMode: boolean;
  allSetupsSelected: boolean;
  displayRMultiples: boolean;
  metricKey: MetricKey;
  pairMetricKey: SetupPairMetricKey;
  pairMetricOptions: Array<DropdownMenuOption<SetupPairMetricKey>>;
  selectedPairKey: string | null;
  onPairSelected: (pairKey: string) => void;
  metricMenuOpen: boolean;
  metricMenuRef: React.RefObject<HTMLDivElement | null>;
  renderHeader: SetupPerformanceHeaderRenderer;
  onMetricMenuOpenChange: (open: boolean) => void;
  onPairMetricKeyChange: (metricKey: SetupPairMetricKey) => void;
  onSetupSelected: (setupId: string) => void;
}> = ({
  viewModels,
  tradeIndex,
  outcomeMetrics,
  outcome,
  isPairsMode,
  allSetupsSelected,
  displayRMultiples,
  metricKey,
  pairMetricKey,
  pairMetricOptions,
  selectedPairKey,
  onPairSelected,
  metricMenuOpen,
  metricMenuRef,
  renderHeader,
  onMetricMenuOpenChange,
  onPairMetricKeyChange,
  onSetupSelected,
}) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const {
    effectiveMetricKey,
    metric,
    isChartMasked,
    isCumulativeMetric,
    cumulativeMetricKind,
  } = resolveOverviewMetric(metricKey, displayRMultiples, shouldMask, outcome);
  const {
    outcomeSummary,
    cumulativeCount,
    rMetricsBySetupId,
    pnlChartModel,
    rankedViewModels,
    chartData,
    performanceLeader,
    needsReviewCount,
  } = useSetupRankingModel({
    viewModels,
    tradeIndex,
    outcomeMetrics,
    outcome,
    allSetupsSelected,
    effectiveMetricKey,
    isChartMasked,
    isCumulativeMetric,
    cumulativeMetricKind,
  });
  const isPairSummaryMasked = shouldMask('rMultiple');
  const {
    effectivePairMetricKey,
    isPairChartMasked,
    pairChartData,
    pairMetric,
    pairSummary,
    selectedPair,
    sortedPairModels,
  } = useSetupPairPerformanceModel({
    displayRMultiples,
    pairMetricKey,
    selectedPairKey,
    tradeIndex,
    viewModels,
  });

  const display = performanceChartDisplay({
    isPairsMode,
    isCumulativeMetric,
    pairModelCount: sortedPairModels.length,
    pairChartCount: pairChartData.length,
    cumulativeCount,
    rankingCount: chartData.length,
    isMasked: isPairsMode ? isPairChartMasked : isChartMasked,
  });
  const chartHeight = getOverviewChartHeight(rankedViewModels.length);
  const pairSummaryContent = (
    <SetupPairsSummaryPanel
      displayRMultiples={displayRMultiples}
      isMasked={isPairChartMasked}
      isSummaryMasked={isPairSummaryMasked}
      summary={pairSummary}
    />
  );

  return (
    <>
      {!isPairsMode
        ? renderHeader({
            summary: (
              <SetupPerformanceHeaderSummary
                leader={performanceLeader}
                leaderMetricValue={leaderMetricValueOf(
                  performanceLeader,
                  effectiveMetricKey,
                  rMetricsBySetupId
                )}
                metric={metric}
                mode={getSetupPerformanceHeaderSummaryMode({
                  isChartMasked,
                  isCumulativeMetric,
                })}
                needsReviewCount={needsReviewCount}
                outcome={outcomeSummary}
                pnlSeries={pnlChartModel.series}
              />
            ),
            metricKey: effectiveMetricKey,
            metricLabel: t(metric.labelKey),
            showOutcomeControl: true,
          })
        : null}
      {display.showEmpty ? (
        <SetupPerformanceEmptyState
          reason={isPairsMode ? 'pairs' : (outcome ?? 'ranking')}
        />
      ) : null}
      {display.showPrivacyNote ? (
        <SetupPerformancePrivacyNote isPairsMode={isPairsMode} />
      ) : null}
      {display.showChart ? (
        isPairsMode ? (
          <SetupPairsSplitInsight
            isMasked={isPairChartMasked}
            metric={pairMetric}
            metricSelector={
              <SetupPairMetricSelect
                menuOpen={metricMenuOpen}
                metricKey={effectivePairMetricKey}
                metricLabel={t(pairMetric.labelKey)}
                menuRef={metricMenuRef}
                onMetricKeyChange={onPairMetricKeyChange}
                onMenuOpenChange={onMetricMenuOpenChange}
                options={pairMetricOptions}
              />
            }
            pairs={sortedPairModels}
            selectedPair={selectedPair}
            summary={pairSummaryContent}
            onPairSelected={onPairSelected}
          />
        ) : (
          <SetupOverviewChartBody
            chartData={chartData}
            formatValue={formatValue}
            isMasked={isChartMasked}
            metric={metric}
            metricLabel={outcomeMetricLabel(metric.labelKey, outcome)}
            outcome={outcome}
            mode={isCumulativeMetric ? 'cumulative' : 'ranking'}
            chartHeight={chartHeight}
            cumulativeMetricKind={cumulativeMetricKind}
            pairChartData={pairChartData}
            pairMetric={pairMetric}
            pnlChartModel={pnlChartModel}
            onPairSelected={onPairSelected}
            onSetupSelected={onSetupSelected}
          />
        )
      ) : null}
    </>
  );
};

SetupRankingPanel.displayName = 'SetupRankingPanel';

type SetupPerformanceHeaderSummaryMode =
  | { kind: 'cumulative'; isMasked: boolean }
  | { kind: 'ranking' };

function getSetupPerformanceHeaderSummaryMode({
  isChartMasked,
  isCumulativeMetric,
}: {
  isChartMasked: boolean;
  isCumulativeMetric: boolean;
}): SetupPerformanceHeaderSummaryMode {
  return isCumulativeMetric
    ? { kind: 'cumulative', isMasked: isChartMasked }
    : { kind: 'ranking' };
}

const SetupPerformanceHeaderSummary: React.FC<{
  leader: SetupViewModel | null;
  leaderMetricValue: number | null;
  metric: (typeof METRIC_OPTIONS)[number];
  mode: SetupPerformanceHeaderSummaryMode;
  needsReviewCount: number;
  outcome: { outcome: SetupOutcome; tradeCount: number } | null;
  pnlSeries: SetupOverviewPnlSeries[];
}> = ({
  leader,
  leaderMetricValue,
  metric,
  mode,
  needsReviewCount,
  outcome,
  pnlSeries,
}) => {
  if (mode.kind === 'cumulative') {
    if (mode.isMasked) return null;
    return (
      <div className="journalit-setups-performance-summary journalit-setups-overview-pnl-header-summary">
        <SetupOverviewPnlHeaderLegend series={pnlSeries} />
      </div>
    );
  }
  if (outcome) {
    return (
      <SetupOutcomeSummary
        leader={leader}
        leaderMetricValue={leaderMetricValue}
        metric={metric}
        outcome={outcome.outcome}
        tradeCount={outcome.tradeCount}
      />
    );
  }
  return (
    <SetupPerformanceSummary
      leader={leader}
      leaderMetricValue={leaderMetricValue}
      metric={metric}
      needsReviewCount={needsReviewCount}
    />
  );
};

SetupPerformanceHeaderSummary.displayName = 'SetupPerformanceHeaderSummary';

const SetupOverviewPnlHeaderLegend: React.FC<{
  series: SetupOverviewPnlSeries[];
}> = ({ series }) => {
  if (series.length === 0) return null;

  return (
    <span className="journalit-setups-overview-pnl-header-legend">
      {series.slice(0, 7).map((item) => (
        <span
          className="journalit-chart-widget__legend-item journalit-setups-overview-pnl-header-legend__item"
          key={item.key}
        >
          <span
            className="journalit-chart-widget__legend-swatch"
            style={cssVars({
              '--journalit-setup-overview-pnl-series-color': item.color,
            })}
          />
          {item.label}
        </span>
      ))}
    </span>
  );
};

SetupOverviewPnlHeaderLegend.displayName = 'SetupOverviewPnlHeaderLegend';

const SetupOverviewChartBody: React.FC<{
  chartData: Array<{
    id: string;
    name: string;
    value: number;
    rawValue: number;
    trades: number;
    winRate: number;
    profitFactor: number;
  }>;
  pairChartData: Array<{
    id: string;
    name: string;
    value: number;
    rawValue: number;
    trades: number;
    winRate: number;
    profitFactor: number;
  }>;
  pnlChartModel: SetupOverviewPnlChartModel;
  metric: (typeof METRIC_OPTIONS)[number];
  metricLabel: string;
  outcome: SetupOutcome | null;
  pairMetric: (typeof SETUP_PAIR_METRIC_OPTIONS)[number];
  mode: 'ranking' | 'cumulative' | 'pairs';
  chartHeight: number;
  cumulativeMetricKind: 'pnl' | 'rMultiple';
  isMasked: boolean;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  onPairSelected: (pairKey: string) => void;
  onSetupSelected: (setupId: string) => void;
}> = ({
  chartData,
  pairChartData,
  pnlChartModel,
  metric,
  metricLabel,
  outcome,
  pairMetric,
  mode,
  chartHeight,
  cumulativeMetricKind,
  isMasked,
  formatValue,
  onPairSelected,
  onSetupSelected,
}) => (
  <div
    className={`journalit-chart-widget__body journalit-setups-performance-widget__body${mode === 'cumulative' ? ' journalit-setups-overview-pnl-widget__body' : ''}${mode === 'pairs' ? ' journalit-setups-pairs-widget__body' : ''}`}
  >
    <React.Suspense
      fallback={
        <div className="journalit-setups-empty">{t('common.loading')}</div>
      }
    >
      {mode === 'pairs' ? (
        <LazySetupPerformanceRankingChart
          data={pairChartData}
          metricKind={pairMetric.displayKind}
          metricKey={pairMetric.key}
          metricPrecision={pairMetric.precision}
          metricNeutralTone={pairMetric.neutralTone}
          metricLabel={t(pairMetric.labelKey)}
          isChartMasked={isMasked}
          onPointClick={onPairSelected}
        />
      ) : mode === 'cumulative' ? (
        <SetupOverviewCumulativePnlChart
          data={pnlChartModel.data}
          series={pnlChartModel.series}
          height={OVERVIEW_LINE_CHART_HEIGHT}
          formatPnl={(value) =>
            formatValue({
              kind: cumulativeMetricKind,
              value,
              ...(cumulativeMetricKind === 'pnl' ? { showCents: false } : {}),
            })
          }
          isMasked={isMasked}
        />
      ) : (
        <LazySetupPerformanceRankingChart
          data={chartData}
          height={chartHeight}
          metricKind={metric.displayKind}
          metricKey={metric.key}
          metricPrecision={metric.precision}
          metricNeutralTone={metric.neutralTone}
          metricLabel={metricLabel}
          outcome={outcome ?? undefined}
          isChartMasked={isMasked}
          onPointClick={onSetupSelected}
        />
      )}
    </React.Suspense>
  </div>
);

SetupOverviewChartBody.displayName = 'SetupOverviewChartBody';

const SetupPerformanceSummary: React.FC<{
  leader: SetupViewModel | null;
  leaderMetricValue: number | null;
  metric: (typeof METRIC_OPTIONS)[number];
  needsReviewCount: number;
}> = ({ leader, leaderMetricValue, metric, needsReviewCount }) => (
  <div
    className="journalit-setups-performance-summary"
    aria-label={t('setups.view.summary.aria')}
  >
    <span>
      {t('setups.view.summary.best-performer')}:{' '}
      <strong>{leader?.setup.name ?? '—'}</strong>
    </span>
    {leader ? (
      <span className="journalit-setups-performance-summary__meta">
        <DisplayValue
          kind={metric.displayKind}
          value={leaderMetricValue}
          precision={metric.precision ?? 2}
          tone="none"
        />{' '}
        {t(metric.labelKey)}
        <span aria-hidden="true">·</span>
        <SetupPerformanceSummaryContext
          leader={leader}
          metricKey={metric.key}
        />
      </span>
    ) : null}
    <span className="journalit-setups-performance-summary__warning">
      {t('setups.view.summary.needs-review')}:{' '}
      <MetricValue kind="count" value={needsReviewCount} tone="none" />
    </span>
  </div>
);

SetupPerformanceSummary.displayName = 'SetupPerformanceSummary';

const SetupPerformanceSummaryContext: React.FC<{
  leader: SetupViewModel;
  metricKey: MetricKey;
}> = ({ leader, metricKey }) => {
  if (metricKey === 'totalTrades') {
    return (
      <>
        <MetricValue
          kind="metric"
          value={leader.metrics.profitFactor}
          precision={2}
          tone="none"
        />{' '}
        {t('setups.view.metric.profit-factor')}
        <span aria-hidden="true">·</span>
        <PercentValue
          kind="percentage"
          value={leader.metrics.winRate}
          tone="none"
        />
      </>
    );
  }

  if (metricKey === 'winRate') {
    return (
      <>
        <MetricValue
          kind="metric"
          value={leader.metrics.profitFactor}
          precision={2}
          tone="none"
        />{' '}
        {t('setups.view.metric.profit-factor')}
        <span aria-hidden="true">·</span>
        <SetupTradeCount count={leader.metrics.totalTrades} />
      </>
    );
  }

  return (
    <>
      <PercentValue
        kind="percentage"
        value={leader.metrics.winRate}
        tone="none"
      />
      <span aria-hidden="true">·</span>
      <SetupTradeCount count={leader.metrics.totalTrades} />
    </>
  );
};

SetupPerformanceSummaryContext.displayName = 'SetupPerformanceSummaryContext';
