import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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
import { DisplayValue, MetricValue, PercentValue } from '../shared/display';
import {
  METRIC_OPTIONS,
  OVERVIEW_R_METRIC_KEYS,
  PAIR_R_METRIC_KEYS,
  SETUP_PAIR_METRIC_OPTIONS,
  SETUP_PAIR_MIN_TRADES,
} from './setupOverviewMetrics';
import {
  SetupPairMetricSelect,
  SetupPairsSplitInsight,
  SetupPairsSummary,
  SetupPerformanceMetricSelect,
} from './SetupPairsPanel';
import type {
  MetricKey,
  SetupOverviewChartMode,
  SetupOverviewPnlChartModel,
  SetupOverviewPnlSeries,
  SetupPairMetricKey,
  SetupPairSummary,
  SetupTradeIndex,
  SetupViewModel,
} from './setupsViewTypes';
import {
  buildSetupOverviewPnlChartModel,
  buildSetupPairSummary,
  buildSetupPairViewModels,
  buildSetupPairRankingChartData,
  buildSetupRankingChartData,
  calculateCompareMetrics,
  getMetricLeader,
  getMetricValue,
  sortSetupPairViewModels,
} from './setupsViewModel';

const LazySetupPerformanceRankingChart = React.lazy(async () => {
  const module = await import('../charts/SharedSetupPerformanceChart');
  return { default: module.SetupPerformanceRankingChart };
});

function useSetupPairPerformanceModel({
  displayRMultiples,
  pairMetricKey,
  selectedPairKey,
  tradeIndex,
  viewModels,
}: {
  displayRMultiples: boolean;
  pairMetricKey: SetupPairMetricKey;
  selectedPairKey: string | null;
  tradeIndex: SetupTradeIndex;
  viewModels: SetupViewModel[];
}) {
  const { shouldMask } = useDisplayFormatter();
  const pairModels = useMemo(
    () => buildSetupPairViewModels(viewModels, tradeIndex),
    [tradeIndex, viewModels]
  );
  const eligiblePairModels = useMemo(
    () =>
      pairModels.filter(
        (pair) => pair.metrics.totalTrades >= SETUP_PAIR_MIN_TRADES
      ),
    [pairModels]
  );
  const effectivePairMetricKey =
    displayRMultiples || !PAIR_R_METRIC_KEYS.has(pairMetricKey)
      ? pairMetricKey
      : 'profitFactor';
  const pairMetric =
    SETUP_PAIR_METRIC_OPTIONS.find(
      (option) => option.key === effectivePairMetricKey
    ) ?? SETUP_PAIR_METRIC_OPTIONS[0];
  const isPairChartMasked =
    pairMetric.displayKind !== 'count' && shouldMask(pairMetric.displayKind);
  const sortedPairModels = useMemo(
    () =>
      sortSetupPairViewModels(
        eligiblePairModels,
        effectivePairMetricKey,
        isPairChartMasked
      ),
    [effectivePairMetricKey, eligiblePairModels, isPairChartMasked]
  );
  const pairChartData = useMemo(
    () =>
      buildSetupPairRankingChartData(
        sortedPairModels,
        effectivePairMetricKey,
        isPairChartMasked
      ),
    [effectivePairMetricKey, isPairChartMasked, sortedPairModels]
  );
  const selectedPair = useMemo(
    () =>
      selectedPairKey
        ? (sortedPairModels.find((pair) => pair.key === selectedPairKey) ??
          sortedPairModels[0] ??
          null)
        : (sortedPairModels[0] ?? null),
    [selectedPairKey, sortedPairModels]
  );
  const pairSummary = useMemo(
    () => buildSetupPairSummary(eligiblePairModels),
    [eligiblePairModels]
  );

  return {
    effectivePairMetricKey,
    isPairChartMasked,
    pairChartData,
    pairMetric,
    pairSummary,
    selectedPair,
    sortedPairModels,
  };
}

function useCloseSetupChartMenusOnOutsidePointer(
  metricMenuOpen: boolean,
  setupMenuOpen: boolean,
  metricMenuRef: React.RefObject<HTMLDivElement | null>,
  setupMenuRef: React.RefObject<HTMLDivElement | null>,
  closeMenus: () => void
): void {
  useEffect(() => {
    if (!metricMenuOpen && !setupMenuOpen) return undefined;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (metricMenuRef.current?.contains(target)) return;
      if (setupMenuRef.current?.contains(target)) return;
      closeMenus();
    };

    window.activeDocument.addEventListener('pointerdown', handlePointerDown);
    return () =>
      window.activeDocument.removeEventListener(
        'pointerdown',
        handlePointerDown
      );
  }, [closeMenus, metricMenuOpen, metricMenuRef, setupMenuOpen, setupMenuRef]);
}

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
  const displayRMultiples = plugin.settings.trade?.displayRMultiples ?? false;
  const effectiveMetricKey =
    displayRMultiples || !OVERVIEW_R_METRIC_KEYS.has(metricKey)
      ? metricKey
      : 'profitFactor';
  const metric =
    METRIC_OPTIONS.find((option) => option.key === effectiveMetricKey) ??
    METRIC_OPTIONS[0];
  const isChartMasked =
    metric.displayKind !== 'count' && shouldMask(metric.displayKind);
  const isPairSummaryMasked = shouldMask('rMultiple');
  const isCumulativeMetric =
    effectiveMetricKey === 'cumulativePnl' ||
    effectiveMetricKey === 'cumulativeR';
  const cumulativeMetricKind: 'pnl' | 'rMultiple' =
    effectiveMetricKey === 'cumulativeR' ? 'rMultiple' : 'pnl';
  const availableSetupIds = useMemo(
    () => viewModels.map(({ setup }) => setup.id),
    [viewModels]
  );
  const effectiveSelectedSetupIds = useMemo(() => {
    if (selectedSetupIds === undefined) return availableSetupIds;
    const available = new Set(availableSetupIds);
    return selectedSetupIds.filter((setupId) => available.has(setupId));
  }, [availableSetupIds, selectedSetupIds]);
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
        selectedSetupIds === undefined ||
          effectiveSelectedSetupIds.length === availableSetupIds.length,
        cumulativeMetricKind
      ),
    [
      availableSetupIds.length,
      effectiveSelectedSetupIds.length,
      filteredViewModels,
      cumulativeMetricKind,
      selectedSetupIds,
      tradeIndex,
    ]
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
  const hasUsableData = isPairsMode
    ? sortedPairModels.length > 0
    : isCumulativeMetric
      ? pnlChartModel.data.length > 0
      : chartData.length > 0;
  const isEmpty = isPairsMode
    ? pairChartData.length === 0
    : isCumulativeMetric
      ? pnlChartModel.data.length === 0
      : chartData.length === 0;
  const title = isPairsMode ? t('setups.view.pairs.title') : null;
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
  const performanceLeaderMetricValue = performanceLeader
    ? getMetricValue(
        performanceLeader.metrics,
        effectiveMetricKey,
        rMetricsBySetupId.get(performanceLeader.setup.id)
      )
    : null;
  const needsReviewCount = useMemo(
    () =>
      filteredViewModels.filter(
        ({ setup, completenessBadges }) =>
          setup.status !== 'archived' && completenessBadges.length > 0
      ).length,
    [filteredViewModels]
  );
  const headerSummaryMode = getSetupPerformanceHeaderSummaryMode({
    displayRMultiples,
    isChartMasked,
    isCumulativeMetric,
    isPairChartMasked,
    isPairSummaryMasked,
    isPairsMode,
  });
  const headerSummary = (
    <SetupPerformanceHeaderSummary
      leader={performanceLeader}
      leaderMetricValue={performanceLeaderMetricValue}
      metric={metric}
      mode={headerSummaryMode}
      needsReviewCount={needsReviewCount}
      pairSummary={pairSummary}
      pnlSeries={pnlChartModel.series}
    />
  );
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
  const currentMetricLabel = t(metric.labelKey);
  const currentPairMetricLabel = t(pairMetric.labelKey);
  const setupSelectionLabel =
    selectedSetupIds === undefined ||
    effectiveSelectedSetupIds.length === availableSetupIds.length
      ? t('setups.view.overview.setup-filter.all')
      : t('setups.view.overview.setup-filter.selected').replace(
          '{count}',
          String(effectiveSelectedSetupIds.length)
        );

  return (
    <section
      className={`journalit-chart-widget journalit-setups-performance-widget${isPairsMode ? ' journalit-setups-performance-widget--pairs' : ''}`}
      ref={registerChartTarget}
    >
      <SetupPerformanceWidgetHeader
        currentMetricLabel={currentMetricLabel}
        currentPairMetricLabel={currentPairMetricLabel}
        effectiveSelectedSetupIds={effectiveSelectedSetupIds}
        headerSummary={headerSummary}
        isPairsMode={isPairsMode}
        metricKey={effectiveMetricKey}
        metricMenuOpen={metricMenuOpen}
        metricMenuRef={metricMenuRef}
        metricOptions={metricOptions}
        pairMetricKey={effectivePairMetricKey}
        pairMetricOptions={pairMetricOptions}
        setupMenuOpen={setupMenuOpen}
        setupMenuRef={setupMenuRef}
        setupSelectionLabel={setupSelectionLabel}
        setups={viewModels.map(({ setup }) => setup)}
        title={title}
        onMetricKeyChange={onMetricKeyChange}
        onMetricMenuOpenChange={handleMetricMenuOpenChange}
        onPairMetricKeyChange={onPairMetricKeyChange}
        onSelectedSetupIdsChange={onSelectedSetupIdsChange}
        onSetupMenuOpenChange={handleSetupMenuOpenChange}
      />
      {isEmpty ||
      (!hasUsableData && !(isPairsMode ? isPairChartMasked : isChartMasked)) ? (
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
      ) : null}
      {!isEmpty && (isPairsMode ? isPairChartMasked : isChartMasked) ? (
        <p className="journalit-setups-privacy-note">
          {isPairsMode
            ? t('setups.view.pairs.privacy')
            : t('setups.view.ranking.privacy')}
        </p>
      ) : null}
      {!isEmpty &&
      (hasUsableData || (isPairsMode ? isPairChartMasked : isChartMasked)) ? (
        isPairsMode ? (
          <SetupPairsSplitInsight
            isMasked={isPairChartMasked}
            metric={pairMetric}
            pairs={sortedPairModels}
            selectedPair={selectedPair}
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
          />
        )
      ) : null}
    </section>
  );
};

SetupPerformanceChartSection.displayName = 'SetupPerformanceChartSection';

type SetupPerformanceHeaderSummaryMode =
  | {
      kind: 'pairs';
      displayRMultiples: boolean;
      isMasked: boolean;
      isSummaryMasked: boolean;
    }
  | { kind: 'cumulative'; isMasked: boolean }
  | { kind: 'ranking' };

function getOverviewChartHeight(setupCount: number): number {
  return Math.max(340, setupCount * 30 + 48);
}

function getSetupPerformanceHeaderSummaryMode({
  displayRMultiples,
  isChartMasked,
  isCumulativeMetric,
  isPairChartMasked,
  isPairSummaryMasked,
  isPairsMode,
}: {
  displayRMultiples: boolean;
  isChartMasked: boolean;
  isCumulativeMetric: boolean;
  isPairChartMasked: boolean;
  isPairSummaryMasked: boolean;
  isPairsMode: boolean;
}): SetupPerformanceHeaderSummaryMode {
  if (isPairsMode) {
    return {
      kind: 'pairs',
      displayRMultiples,
      isMasked: isPairChartMasked,
      isSummaryMasked: isPairSummaryMasked,
    };
  }
  return isCumulativeMetric
    ? { kind: 'cumulative', isMasked: isChartMasked }
    : { kind: 'ranking' };
}

export const SetupPerformanceHeaderSummary: React.FC<{
  leader: SetupViewModel | null;
  leaderMetricValue: number | null;
  metric: (typeof METRIC_OPTIONS)[number];
  mode: SetupPerformanceHeaderSummaryMode;
  needsReviewCount: number;
  pairSummary: SetupPairSummary;
  pnlSeries: SetupOverviewPnlSeries[];
}> = ({
  leader,
  leaderMetricValue,
  metric,
  mode,
  needsReviewCount,
  pairSummary,
  pnlSeries,
}) => {
  if (mode.kind === 'pairs') {
    return mode.isMasked ||
      mode.isSummaryMasked ||
      !mode.displayRMultiples ? null : (
      <SetupPairsSummary summary={pairSummary} />
    );
  }
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
  title: string | null;
  isPairsMode: boolean;
  headerSummary: React.ReactNode;
  metricMenuOpen: boolean;
  setupMenuOpen: boolean;
  metricKey: MetricKey;
  pairMetricKey: SetupPairMetricKey;
  currentMetricLabel: string;
  currentPairMetricLabel: string;
  metricMenuRef: React.RefObject<HTMLDivElement | null>;
  setupMenuRef: React.RefObject<HTMLDivElement | null>;
  metricOptions: Array<DropdownMenuOption<MetricKey>>;
  pairMetricOptions: Array<DropdownMenuOption<SetupPairMetricKey>>;
  effectiveSelectedSetupIds: string[];
  setupSelectionLabel: string;
  setups: Setup[];
  onMetricKeyChange: (metricKey: MetricKey) => void;
  onPairMetricKeyChange: (metricKey: SetupPairMetricKey) => void;
  onMetricMenuOpenChange: (open: boolean) => void;
  onSetupMenuOpenChange: (open: boolean) => void;
  onSelectedSetupIdsChange: (setupIds: string[] | undefined) => void;
}> = ({
  title,
  isPairsMode,
  headerSummary,
  metricMenuOpen,
  setupMenuOpen,
  metricKey,
  pairMetricKey,
  currentMetricLabel,
  currentPairMetricLabel,
  metricMenuRef,
  setupMenuRef,
  metricOptions,
  pairMetricOptions,
  effectiveSelectedSetupIds,
  setupSelectionLabel,
  setups,
  onMetricKeyChange,
  onPairMetricKeyChange,
  onMetricMenuOpenChange,
  onSetupMenuOpenChange,
  onSelectedSetupIdsChange,
}) => (
  <div className="journalit-setups-performance-widget__header">
    <div className="journalit-setups-performance-widget__heading">
      {title ? (
        <div className="journalit-setups-performance-widget__title-row">
          <div className="journalit-chart-widget__title">{title}</div>
        </div>
      ) : null}
      {headerSummary}
    </div>
    <div className="journalit-chart-widget__selector">
      {isPairsMode ? (
        <SetupPairMetricSelect
          menuOpen={metricMenuOpen}
          metricKey={pairMetricKey}
          metricLabel={currentPairMetricLabel}
          menuRef={metricMenuRef}
          onMetricKeyChange={onPairMetricKeyChange}
          onMenuOpenChange={onMetricMenuOpenChange}
          options={pairMetricOptions}
        />
      ) : (
        <>
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
        </>
      )}
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
