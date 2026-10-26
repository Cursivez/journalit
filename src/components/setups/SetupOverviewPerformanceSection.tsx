import React, { useCallback, useMemo, useRef, useState } from 'react';
import type JournalitPlugin from '../../main';
import type { Setup } from '../../services/setup/types';
import { t } from '../../lang/helpers';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { useGuideTarget } from '../../guides/GuideRuntimeLayer';
import { SETUPS_CHART_TARGET_ID } from '../../guides/setupsGuideIds';
import { cssVars } from '../../styles/inlineStylePolicy';
import { SetupOverviewCumulativePnlChart } from '../charts/SetupOverviewCumulativePnlChart';
import type { DropdownMenuOption } from '../shared/DropdownMenu';
import { EmptyState } from '../shared/EmptyState';
import { ToolbarButton } from '../shared/ToolbarButton';
import { ChevronDown } from '../shared/icons/ObsidianIcon';
import {
  DisplayValue,
  MetricValue,
  PercentValue,
} from '../shared/display/DisplayValue';
import {
  METRIC_OPTIONS,
  OVERVIEW_R_METRIC_KEYS,
  PAIR_R_METRIC_KEYS,
  SETUP_PAIR_METRIC_OPTIONS,
} from './setupOverviewMetrics';
import {
  SetupPairMetricSelect,
  SetupPairsSplitInsight,
  SetupPairsSummaryPanel,
  SetupPerformanceMetricSelect,
} from './SetupPairsPanel';
import type {
  MetricKey,
  SetupOverviewChartMode,
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
import {
  useSetupPairPerformanceModel,
  useCloseSetupChartMenusOnOutsidePointer,
} from './useSetupOverviewPerformance';

const LazySetupPerformanceRankingChart = React.lazy(async () => {
  const module = await import('../charts/SharedSetupPerformanceChart');
  return { default: module.SetupPerformanceRankingChart };
});

const displaysRMultiples = (plugin: JournalitPlugin): boolean =>
  plugin.settings.trade?.displayRMultiples ?? false;


const resolveOverviewMetric = (
  metricKey: MetricKey,
  displayRMultiples: boolean,
  shouldMask: ReturnType<typeof useDisplayFormatter>['shouldMask']
) => {
  const effectiveMetricKey: MetricKey =
    displayRMultiples || !OVERVIEW_R_METRIC_KEYS.has(metricKey)
      ? metricKey
      : 'profitFactor';
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

const setupSelectionLabelOf = (
  allSelected: boolean,
  selectedCount: number
): string =>
  allSelected
    ? t('setups.view.overview.setup-filter.all')
    : t('setups.view.overview.setup-filter.selected').replace(
        '{count}',
        String(selectedCount)
      );

const performanceWidgetClassName = (isPairsMode: boolean): string =>
  isPairsMode
    ? 'journalit-chart-widget journalit-setups-performance-widget journalit-setups-performance-widget--pairs'
    : 'journalit-chart-widget journalit-setups-performance-widget';

const SetupPerformanceEmptyState: React.FC<{ isPairsMode: boolean }> = ({
  isPairsMode,
}) => (
  <EmptyState
    className="journalit-setups-chart-empty-state"
    iconSize={34}
    message={
      isPairsMode
        ? t('setups.view.pairs.empty')
        : t('setups.view.ranking.empty')
    }
    subMessage={
      isPairsMode
        ? t('setups.view.pairs.empty-submessage')
        : t('setups.view.ranking.empty-submessage')
    }
  />
);

const SetupPerformancePrivacyNote: React.FC<{ isPairsMode: boolean }> = ({
  isPairsMode,
}) => (
  <p className="journalit-setups-privacy-note">
    {isPairsMode
      ? t('setups.view.pairs.privacy')
      : t('setups.view.ranking.privacy')}
  </p>
);

export const SetupPerformanceChartSection: React.FC<{
  plugin: JournalitPlugin;
  viewModels: SetupViewModel[];
  tradeIndex: SetupTradeIndex;
  chartMode: SetupOverviewChartMode;
  metricKey: MetricKey;
  pairMetricKey: SetupPairMetricKey;
  selectedSetupIds: string[] | undefined;
  onMetricKeyChange: (metricKey: MetricKey) => void;
  onPairMetricKeyChange: (metricKey: SetupPairMetricKey) => void;
  onSelectedSetupIdsChange: (setupIds: string[] | undefined) => void;
  onSetupSelected: (setupId: string) => void;
}> = ({
  plugin,
  viewModels,
  tradeIndex,
  chartMode,
  metricKey,
  pairMetricKey,
  selectedSetupIds,
  onMetricKeyChange,
  onPairMetricKeyChange,
  onSelectedSetupIdsChange,
  onSetupSelected,
}) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const registerChartTarget = useGuideTarget(SETUPS_CHART_TARGET_ID);
  const [metricMenuOpen, setMetricMenuOpen] = useState(false);
  const [setupMenuOpen, setSetupMenuOpen] = useState(false);
  const [selectedPairKey, setSelectedPairKey] = useState<string | null>(null);
  const metricMenuRef = useRef<HTMLDivElement>(null);
  const setupMenuRef = useRef<HTMLDivElement>(null);
  const handleMetricMenuOpenChange = (open: boolean) => {
    setMetricMenuOpen(open);
    if (open) setSetupMenuOpen(false);
  };
  const handleSetupMenuOpenChange = (open: boolean) => {
    setSetupMenuOpen(open);
    if (open) setMetricMenuOpen(false);
  };
  const closeMenus = useCallback(() => {
    setMetricMenuOpen(false);
    setSetupMenuOpen(false);
  }, []);
  useCloseSetupChartMenusOnOutsidePointer(
    metricMenuOpen,
    setupMenuOpen,
    metricMenuRef,
    setupMenuRef,
    closeMenus
  );
  const displayRMultiples = displaysRMultiples(plugin);
  const {
    effectiveMetricKey,
    metric,
    isChartMasked,
    isCumulativeMetric,
    cumulativeMetricKind,
  } = resolveOverviewMetric(metricKey, displayRMultiples, shouldMask);
  const isPairSummaryMasked = shouldMask('rMultiple');
  const availableSetupIds = useMemo(
    () => viewModels.map(({ setup }) => setup.id),
    [viewModels]
  );
  const effectiveSelectedSetupIds = useMemo(() => {
    if (selectedSetupIds === undefined) return availableSetupIds;
    const available = new Set(availableSetupIds);
    return selectedSetupIds.filter((setupId) => available.has(setupId));
  }, [availableSetupIds, selectedSetupIds]);
  const allSetupsSelected =
    selectedSetupIds === undefined ||
    effectiveSelectedSetupIds.length === availableSetupIds.length;
  const filteredViewModels = useMemo(() => {
    const selected = new Set(effectiveSelectedSetupIds);
    return viewModels.filter(({ setup }) => selected.has(setup.id));
  }, [effectiveSelectedSetupIds, viewModels]);
  const rMetricsBySetupId = useMemo(
    () =>
      new Map(
        filteredViewModels.map(({ setup }) => [
          setup.id,
          calculateCompareMetrics(tradeIndex.any.get(setup.id) ?? []),
        ])
      ),
    [filteredViewModels, tradeIndex]
  );
  const pnlChartModel = useMemo(
    () =>
      buildSetupOverviewPnlChartModel(
        filteredViewModels,
        tradeIndex,
        allSetupsSelected,
        cumulativeMetricKind
      ),
    [allSetupsSelected, filteredViewModels, cumulativeMetricKind, tradeIndex]
  );
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
    viewModels: filteredViewModels,
  });

  const chartData = useMemo(
    () =>
      isCumulativeMetric
        ? []
        : buildSetupRankingChartData(
            filteredViewModels,
            effectiveMetricKey,
            isChartMasked,
            rMetricsBySetupId
          ),
    [
      effectiveMetricKey,
      filteredViewModels,
      isChartMasked,
      isCumulativeMetric,
      rMetricsBySetupId,
    ]
  );

  const isPairsMode = chartMode === 'pairs';
  const display = performanceChartDisplay({
    isPairsMode,
    isCumulativeMetric,
    pairModelCount: sortedPairModels.length,
    pairChartCount: pairChartData.length,
    cumulativeCount: pnlChartModel.data.length,
    rankingCount: chartData.length,
    isMasked: isPairsMode ? isPairChartMasked : isChartMasked,
  });
  const chartHeight = getOverviewChartHeight(filteredViewModels.length);
  const performanceLeader = useMemo(
    () =>
      isChartMasked
        ? null
        : getMetricLeader(
            filteredViewModels,
            effectiveMetricKey,
            rMetricsBySetupId
          ),
    [effectiveMetricKey, filteredViewModels, isChartMasked, rMetricsBySetupId]
  );
  const performanceLeaderMetricValue = leaderMetricValueOf(
    performanceLeader,
    effectiveMetricKey,
    rMetricsBySetupId
  );
  const needsReviewCount = useMemo(
    () =>
      filteredViewModels.filter(
        ({ setup, completenessBadges }) =>
          setup.status !== 'archived' && completenessBadges.length > 0
      ).length,
    [filteredViewModels]
  );
  const headerSummaryMode = getSetupPerformanceHeaderSummaryMode({
    isChartMasked,
    isCumulativeMetric,
  });
  const headerSummary = (
    <SetupPerformanceHeaderSummary
      leader={performanceLeader}
      leaderMetricValue={performanceLeaderMetricValue}
      metric={metric}
      mode={headerSummaryMode}
      needsReviewCount={needsReviewCount}
      pnlSeries={pnlChartModel.series}
    />
  );
  const pairSummaryContent = (
    <SetupPairsSummaryPanel
      displayRMultiples={displayRMultiples}
      isMasked={isPairChartMasked}
      isSummaryMasked={isPairSummaryMasked}
      summary={pairSummary}
    />
  );
  const { metricOptions, pairMetricOptions } =
    useSetupPerformanceMetricOptions(displayRMultiples);
  const currentMetricLabel = t(metric.labelKey);
  const currentPairMetricLabel = t(pairMetric.labelKey);
  const setupSelectionLabel = setupSelectionLabelOf(
    allSetupsSelected,
    effectiveSelectedSetupIds.length
  );

  return (
    <section
      className={performanceWidgetClassName(isPairsMode)}
      ref={registerChartTarget}
    >
      {!isPairsMode ? (
        <SetupPerformanceWidgetHeader
          currentMetricLabel={currentMetricLabel}
          effectiveSelectedSetupIds={effectiveSelectedSetupIds}
          headerSummary={headerSummary}
          metricKey={effectiveMetricKey}
          metricMenuOpen={metricMenuOpen}
          metricMenuRef={metricMenuRef}
          metricOptions={metricOptions}
          setupMenuOpen={setupMenuOpen}
          setupMenuRef={setupMenuRef}
          setupSelectionLabel={setupSelectionLabel}
          setups={viewModels.map(({ setup }) => setup)}
          onMetricKeyChange={onMetricKeyChange}
          onMetricMenuOpenChange={handleMetricMenuOpenChange}
          onSelectedSetupIdsChange={onSelectedSetupIdsChange}
          onSetupMenuOpenChange={handleSetupMenuOpenChange}
        />
      ) : null}
      {display.showEmpty ? (
        <SetupPerformanceEmptyState isPairsMode={isPairsMode} />
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
                metricLabel={currentPairMetricLabel}
                menuRef={metricMenuRef}
                onMetricKeyChange={onPairMetricKeyChange}
                onMenuOpenChange={handleMetricMenuOpenChange}
                options={pairMetricOptions}
              />
            }
            pairs={sortedPairModels}
            selectedPair={selectedPair}
            summary={pairSummaryContent}
            onPairSelected={setSelectedPairKey}
          />
        ) : (
          <SetupOverviewChartBody
            chartData={chartData}
            formatValue={formatValue}
            isMasked={isChartMasked}
            metric={metric}
            mode={isCumulativeMetric ? 'cumulative' : 'ranking'}
            chartHeight={chartHeight}
            cumulativeMetricKind={cumulativeMetricKind}
            pairChartData={pairChartData}
            pairMetric={pairMetric}
            pnlChartModel={pnlChartModel}
            onPairSelected={setSelectedPairKey}
            onSetupSelected={onSetupSelected}
          />
        )
      ) : null}
    </section>
  );
};

SetupPerformanceChartSection.displayName = 'SetupPerformanceChartSection';

function useSetupPerformanceMetricOptions(displayRMultiples: boolean): {
  metricOptions: Array<DropdownMenuOption<MetricKey>>;
  pairMetricOptions: Array<DropdownMenuOption<SetupPairMetricKey>>;
} {
  const metricOptions = useMemo<Array<DropdownMenuOption<MetricKey>>>(() => {
    const options: Array<DropdownMenuOption<MetricKey>> = [];
    for (const option of METRIC_OPTIONS) {
      if (displayRMultiples || !OVERVIEW_R_METRIC_KEYS.has(option.key)) {
        options.push({ value: option.key, label: t(option.labelKey) });
      }
    }
    return options;
  }, [displayRMultiples]);
  const pairMetricOptions = useMemo<
    Array<DropdownMenuOption<SetupPairMetricKey>>
  >(() => {
    const options: Array<DropdownMenuOption<SetupPairMetricKey>> = [];
    for (const option of SETUP_PAIR_METRIC_OPTIONS) {
      if (displayRMultiples || !PAIR_R_METRIC_KEYS.has(option.key)) {
        options.push({ value: option.key, label: t(option.labelKey) });
      }
    }
    return options;
  }, [displayRMultiples]);

  return { metricOptions, pairMetricOptions };
}

type SetupPerformanceHeaderSummaryMode =
  | { kind: 'cumulative'; isMasked: boolean }
  | { kind: 'ranking' };

function getOverviewChartHeight(setupCount: number): number {
  return Math.max(340, setupCount * 30 + 48);
}

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
  pnlSeries: SetupOverviewPnlSeries[];
}> = ({
  leader,
  leaderMetricValue,
  metric,
  mode,
  needsReviewCount,
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

const SetupPerformanceWidgetHeader: React.FC<{
  headerSummary: React.ReactNode;
  metricMenuOpen: boolean;
  setupMenuOpen: boolean;
  metricKey: MetricKey;
  currentMetricLabel: string;
  metricMenuRef: React.RefObject<HTMLDivElement | null>;
  setupMenuRef: React.RefObject<HTMLDivElement | null>;
  metricOptions: Array<DropdownMenuOption<MetricKey>>;
  effectiveSelectedSetupIds: string[];
  setupSelectionLabel: string;
  setups: Setup[];
  onMetricKeyChange: (metricKey: MetricKey) => void;
  onMetricMenuOpenChange: (open: boolean) => void;
  onSetupMenuOpenChange: (open: boolean) => void;
  onSelectedSetupIdsChange: (setupIds: string[] | undefined) => void;
}> = ({
  headerSummary,
  metricMenuOpen,
  setupMenuOpen,
  metricKey,
  currentMetricLabel,
  metricMenuRef,
  setupMenuRef,
  metricOptions,
  effectiveSelectedSetupIds,
  setupSelectionLabel,
  setups,
  onMetricKeyChange,
  onMetricMenuOpenChange,
  onSetupMenuOpenChange,
  onSelectedSetupIdsChange,
}) => (
  <div className="journalit-setups-performance-widget__header">
    <div className="journalit-setups-performance-widget__heading">
      {headerSummary}
    </div>
    <div className="journalit-chart-widget__selector">
      <SetupPerformanceMetricSelect
        menuOpen={metricMenuOpen}
        metricKey={metricKey}
        metricLabel={currentMetricLabel}
        menuRef={metricMenuRef}
        onMetricKeyChange={onMetricKeyChange}
        onMenuOpenChange={onMetricMenuOpenChange}
        options={metricOptions}
      />
      <SetupOverviewSetupSelector
        menuOpen={setupMenuOpen}
        menuRef={setupMenuRef}
        selectedSetupIds={effectiveSelectedSetupIds}
        label={setupSelectionLabel}
        setups={setups}
        onMenuOpenChange={onSetupMenuOpenChange}
        onSelectedSetupIdsChange={onSelectedSetupIdsChange}
      />
    </div>
  </div>
);

SetupPerformanceWidgetHeader.displayName = 'SetupPerformanceWidgetHeader';

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
      fallback={<div className="journalit-setups-empty">Loading chart…</div>}
    >
      {mode === 'pairs' ? (
        <LazySetupPerformanceRankingChart
          data={pairChartData}
          metricKind={pairMetric.displayKind}
          metricKey={pairMetric.key}
          metricLabel={t(pairMetric.labelKey)}
          isChartMasked={isMasked}
          onPointClick={onPairSelected}
        />
      ) : mode === 'cumulative' ? (
        <SetupOverviewCumulativePnlChart
          data={pnlChartModel.data}
          series={pnlChartModel.series}
          height={chartHeight}
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
          metricLabel={t(metric.labelKey)}
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
          precision={metric.key === 'totalTrades' ? 0 : 2}
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
        <MetricValue
          kind="count"
          value={leader.metrics.totalTrades}
          tone="none"
        />{' '}
        {t('setups.view.metric.trades')}
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
      <MetricValue
        kind="count"
        value={leader.metrics.totalTrades}
        tone="none"
      />{' '}
      {t('setups.view.metric.trades')}
    </>
  );
};

SetupPerformanceSummaryContext.displayName = 'SetupPerformanceSummaryContext';

const SetupOverviewSetupSelector: React.FC<{
  menuOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  selectedSetupIds: string[];
  label: string;
  setups: Setup[];
  onMenuOpenChange: (open: boolean) => void;
  onSelectedSetupIdsChange: (setupIds: string[] | undefined) => void;
}> = ({
  menuOpen,
  menuRef,
  selectedSetupIds,
  label,
  setups,
  onMenuOpenChange,
  onSelectedSetupIdsChange,
}) => {
  const selectedSet = useMemo(
    () => new Set(selectedSetupIds),
    [selectedSetupIds]
  );
  const sortedSetups = useMemo(
    () =>
      [...setups].sort((first, second) =>
        first.name.localeCompare(second.name)
      ),
    [setups]
  );

  const handleToggleSetup = (setupId: string) => {
    const nextSelected = new Set(selectedSet);
    if (nextSelected.has(setupId)) {
      nextSelected.delete(setupId);
    } else {
      nextSelected.add(setupId);
    }
    const nextIds = [...nextSelected];
    onSelectedSetupIdsChange(
      nextIds.length === setups.length ? undefined : nextIds
    );
  };

  return (
    <div
      className="journalit-setups-performance-widget__metric-menu"
      ref={menuRef}
    >
      <ToolbarButton
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label={t('setups.view.overview.setup-filter.aria')}
        className="journalit-setups-performance-widget__metric-trigger journalit-setups-performance-widget__setup-trigger"
        onClick={() => onMenuOpenChange(!menuOpen)}
        type="button"
      >
        <span>{label}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`journalit-home-period-chevron${menuOpen ? ' journalit-home-period-chevron--open' : ''}`}
        />
      </ToolbarButton>
      {menuOpen ? (
        <div
          className="journalit-setups-performance-widget__metric-dropdown journalit-setups-performance-widget__setup-dropdown"
          role="menu"
        >
          <div className="journalit-setups-performance-widget__setup-actions">
            <button
              type="button"
              className="journalit-setups-performance-widget__setup-action"
              onClick={() => onSelectedSetupIdsChange(undefined)}
            >
              {t('setups.view.overview.setup-filter.select-all')}
            </button>
            <button
              type="button"
              className="journalit-setups-performance-widget__setup-action"
              onClick={() => onSelectedSetupIdsChange([])}
            >
              {t('setups.view.overview.setup-filter.clear')}
            </button>
          </div>
          <div className="journalit-setups-performance-widget__setup-list">
            {sortedSetups.map((setup) => (
              <button
                aria-checked={selectedSet.has(setup.id)}
                className={
                  selectedSet.has(setup.id)
                    ? 'journalit-home-period-option journalit-home-period-option--active'
                    : 'journalit-home-period-option'
                }
                key={setup.id}
                onClick={() => handleToggleSetup(setup.id)}
                role="menuitemcheckbox"
                type="button"
              >
                <span
                  className="journalit-home-period-option__check"
                  aria-hidden="true"
                >
                  {selectedSet.has(setup.id) ? '✓' : ''}
                </span>
                <span className="journalit-home-period-option__label">
                  {setup.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

SetupOverviewSetupSelector.displayName = 'SetupOverviewSetupSelector';
