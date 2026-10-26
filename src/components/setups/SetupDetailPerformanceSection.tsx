import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type JournalitPlugin from '../../main';
import type { SetupOpportunityStats } from '../../services/setup/types';
import { t } from '../../lang/helpers';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import {
  useGuideContextValue,
  useGuideCurrentStepId,
  useGuideTarget,
} from '../../guides/GuideRuntimeLayer';
import { SETUPS_DETAIL_PERFORMANCE_TARGET_ID } from '../../guides/setupsGuideIds';
import { SETUPS_DETAIL_HAS_EXECUTION_GAP_CONTEXT_KEY } from '../../guides/setupsGuideIds';
import { analyzeDrawdown } from '../../utils/drawdownAnalytics';
import { getTradeNotePath } from '../../utils/chartUtils';
import { SharedDrawdownChart } from '../charts/SharedDrawdownChart';
import { SharedPnLChart } from '../charts/SharedPnLChart';
import { SharedTradesChart } from '../charts/SharedTradesChart';
import { DropdownMenu, type DropdownMenuOption } from '../shared/DropdownMenu';
import { EmptyState } from '../shared/EmptyState';
import { ToolbarButton } from '../shared/ToolbarButton';
import { Tooltip } from '../shared/Tooltip';
import { ChevronDown, Info } from '../shared/icons/ObsidianIcon';
import {
  DisplayValue,
  MetricValue,
  PercentValue,
  RMultipleValue,
} from '../shared/display/DisplayValue';
import type {
  SetupDetailAnalysisMode,
  SetupDetailChartMode,
  SetupDetailMetricTone,
  SetupDetailTabOption,
  SetupLinkedTrade,
  SetupViewModel,
} from './setupsViewTypes';
import {
  buildSetupDetailDrawdownChartData,
  buildSetupDetailPerformancePoints,
  buildSetupDetailPnlChartData,
  buildSetupDetailTradesChartData,
  getMetricTone,
  getSetupDetailPerformanceSummary,
} from './setupsViewModel';

const LazySetupExecutionGapChart = React.lazy(async () => {
  const module = await import('../charts/SetupExecutionGapChart');
  return { default: module.SetupExecutionGapChart };
});

const SETUP_METRIC_NOT_AVAILABLE = '—';

const SetupDetailTabs = <T extends string>({
  activeId,
  ariaLabel,
  onChange,
  options,
}: {
  activeId: T;
  ariaLabel: string;
  onChange: (id: T) => void;
  options: Array<SetupDetailTabOption<T>>;
}) => (
  <div
    className="journalit-setups-detail-tabs"
    role="tablist"
    aria-label={ariaLabel}
  >
    {options.map((option) => (
      <button
        type="button"
        className={[
          'journalit-setups-detail-tab',
          option.id === activeId ? 'journalit-setups-detail-tab--active' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-selected={option.id === activeId}
        key={option.id}
        role="tab"
        onClick={() => onChange(option.id)}
      >
        <span>{option.label}</span>
        {option.badge ? (
          <span className="journalit-setups-detail-tab__badge">
            {option.badge}
          </span>
        ) : null}
      </button>
    ))}
  </div>
);

SetupDetailTabs.displayName = 'SetupDetailTabs';

function calculateSetupDetailMaxDrawdown(
  linkedTrades: SetupLinkedTrade[],
  defaultRiskAmount?: number
): { amount: number; rMultiple: number } {
  const drawdownTrades = linkedTrades.flatMap((trade) =>
    trade.pnlContributing
      ? [
          {
            path: trade.path,
            exitTime: trade.exitTime,
            entryTime: trade.entryTime,
            pnl: trade.pnl,
            rMultiple: trade.rMultiple,
            tradeStatus: 'CLOSED',
          },
        ]
      : []
  );
  const result = analyzeDrawdown(drawdownTrades, {
    assumeClosedTrades: true,
    defaultRiskAmount,
  });

  return {
    amount: result.summary.maxDrawdownAmount,
    rMultiple: result.summary.maxDrawdownR,
  };
}

function useGuideExecutionGapMode({
  analysisMode,
  currentGuideStepId,
  hasExecutionGap,
  plugin,
  setAnalysisMode,
}: {
  analysisMode: SetupDetailAnalysisMode;
  currentGuideStepId: string | null;
  hasExecutionGap: boolean;
  plugin: JournalitPlugin;
  setAnalysisMode: React.Dispatch<
    React.SetStateAction<SetupDetailAnalysisMode>
  >;
}): void {
  useEffect(() => {
    if (
      currentGuideStepId !== 'detail-execution-gap' ||
      !hasExecutionGap ||
      analysisMode === 'execution-gap'
    ) {
      return;
    }

    setAnalysisMode('execution-gap');
    void plugin.uiStateManager.updateStateImmediate({
      setupDetailAnalysisMode: 'execution-gap',
    });
  }, [
    analysisMode,
    currentGuideStepId,
    hasExecutionGap,
    plugin.uiStateManager,
    setAnalysisMode,
  ]);
}

const setupDetailTradeSettings = (plugin: JournalitPlugin) => ({
  useRMultiples: plugin.settings.trade?.displayRMultiples ?? false,
  dateFormat: plugin.settings.trade?.dateFormat ?? 'DDMMYY',
  defaultRiskAmount: plugin.settings.trade?.defaultRiskAmount,
});

const hasSetupExecutionGap = (
  stats: SetupOpportunityStats | undefined
): boolean =>
  (stats?.missed.recordCount ?? 0) > 0 ||
  (stats?.backtest.recordCount ?? 0) > 0;

const performanceLineToneClass = (
  isMasked: boolean,
  total: number | null
): string => {
  if (isMasked) return 'journalit-setups-detail-performance--masked';
  if (total === null) return 'journalit-setups-detail-performance--neutral';
  return total < 0
    ? 'journalit-setups-detail-performance--negative'
    : 'journalit-setups-detail-performance--positive';
};

const chartModeLabelOf = (
  options: Array<DropdownMenuOption<SetupDetailChartMode>>,
  chartMode: SetupDetailChartMode
): string =>
  options.find((option) => option.value === chartMode)?.label ??
  options[0].label;

const SetupDetailExecutionGapChart: React.FC<{
  stats: SetupOpportunityStats;
  valueMode: 'rMultiple' | 'pnl';
}> = ({ stats, valueMode }) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  return (
    <LazySetupExecutionGapChart
      stats={stats}
      formatValue={(value) =>
        formatValue({
          kind: valueMode,
          value,
          ...(valueMode === 'rMultiple' ? {} : { showCents: false }),
        })
      }
      isMasked={shouldMask(valueMode)}
      valueMode={valueMode}
    />
  );
};


const SetupDetailPerformanceChart: React.FC<{
  plugin: JournalitPlugin;
  
  executionGapStats: SetupOpportunityStats | undefined;
  useRMultiples: boolean;
  hasData: boolean;
  chartMode: SetupDetailChartMode;
  chartData: ReturnType<typeof buildSetupDetailPnlChartData>;
  tradesChartData: ReturnType<typeof buildSetupDetailTradesChartData>;
  drawdownChartData: ReturnType<typeof buildSetupDetailDrawdownChartData>;
}> = ({
  plugin,
  executionGapStats,
  useRMultiples,
  hasData,
  chartMode,
  chartData,
  tradesChartData,
  drawdownChartData,
}) => {
  const valueMode = useRMultiples ? 'rMultiple' : 'pnl';
  return executionGapStats ? (
    <SetupDetailExecutionGapChart
      stats={executionGapStats}
      valueMode={valueMode}
    />
  ) : hasData ? (
    chartMode === 'trades' ? (
      <SharedTradesChart
        className="journalit-setups-detail-performance__shared-chart"
        data={tradesChartData}
        valueMode={valueMode}
        height="100%"
        margin={{ top: 8, right: 8, bottom: 2, left: 0 }}
        onPointClick={(point) => {
          if (point.path) {
            const tradeNotePath = getTradeNotePath(point.path);
            void plugin.openFile(tradeNotePath, true);
          }
        }}
      />
    ) : chartMode === 'drawdown' ? (
      <SharedDrawdownChart
        className="journalit-setups-detail-performance__shared-chart"
        data={drawdownChartData}
        height="100%"
        plugin={plugin}
        margin={{ top: 8, right: 8, bottom: 2, left: 0 }}
      />
    ) : (
      <SharedPnLChart
        className="journalit-setups-detail-performance__shared-chart"
        data={chartData}
        height="100%"
        plugin={plugin}
        margin={{ top: 8, right: 8, bottom: 2, left: 0 }}
      />
    )
  ) : (
    <EmptyState
      className="journalit-setups-detail-performance__empty"
      iconSize={34}
      message={t('setups.view.detail.performance.empty')}
      subMessage={t('setups.view.detail.performance.empty-submessage')}
    />
  );
};

export const SetupDetailPerformanceSection: React.FC<{
  plugin: JournalitPlugin;
  viewModel: SetupViewModel;
  linkedTrades: SetupLinkedTrade[];
}> = ({ plugin, viewModel, linkedTrades }) => {
  const { shouldMask } = useDisplayFormatter();
  const registerDetailPerformanceTarget = useGuideTarget(
    SETUPS_DETAIL_PERFORMANCE_TARGET_ID
  );
  const currentGuideStepId = useGuideCurrentStepId();
  const { useRMultiples, dateFormat, defaultRiskAmount } =
    setupDetailTradeSettings(plugin);
  const [chartMode, setChartMode] =
    useState<SetupDetailChartMode>('cumulative');
  const [analysisMode, setAnalysisMode] = useState<SetupDetailAnalysisMode>(
    () =>
      plugin.uiStateManager.getState().setupDetailAnalysisMode ?? 'performance'
  );
  const [chartModeMenuOpen, setChartModeMenuOpen] = useState(false);
  const chartModeMenuRef = useRef<HTMLDivElement>(null);
  const hasExecutionGap = hasSetupExecutionGap(viewModel.opportunityStats);
  useGuideContextValue(
    SETUPS_DETAIL_HAS_EXECUTION_GAP_CONTEXT_KEY,
    hasExecutionGap
  );
  const effectiveAnalysisMode: SetupDetailAnalysisMode =
    analysisMode === 'execution-gap' && hasExecutionGap
      ? 'execution-gap'
      : 'performance';
  const points = useMemo(
    () => buildSetupDetailPerformancePoints(linkedTrades, useRMultiples),
    [linkedTrades, useRMultiples]
  );
  const hasData = points.length > 0;
  const { total: displayedTotal, expectancy: displayedExpectancy } =
    getSetupDetailPerformanceSummary(points, useRMultiples, viewModel.metrics);
  const isPerformanceMasked = shouldMask(useRMultiples ? 'rMultiple' : 'pnl');
  const isMetricMasked = shouldMask('metric');
  const isPercentageMasked = shouldMask('percentage');
  const isDrawdownMasked = shouldMask('drawdown');
  const lineToneClass = performanceLineToneClass(
    isPerformanceMasked,
    displayedTotal
  );
  const chartData = useMemo(
    () => buildSetupDetailPnlChartData(points),
    [points]
  );
  const tradesChartData = useMemo(
    () => buildSetupDetailTradesChartData(linkedTrades, useRMultiples),
    [linkedTrades, useRMultiples]
  );
  const drawdownChartData = useMemo(
    () =>
      buildSetupDetailDrawdownChartData(
        linkedTrades,
        dateFormat,
        defaultRiskAmount,
        plugin
      ),
    [dateFormat, defaultRiskAmount, linkedTrades, plugin]
  );
  const chartModeOptions = useMemo<
    Array<DropdownMenuOption<SetupDetailChartMode>>
  >(
    () => [
      {
        value: 'cumulative',
        label: useRMultiples
          ? t('setups.view.detail.performance.cumulative-r')
          : t('setups.view.detail.performance.cumulative-pnl'),
      },
      { value: 'trades', label: t('common.trades') },
      {
        value: 'drawdown',
        label: t('setups.view.detail.performance.drawdown'),
      },
    ],
    [useRMultiples]
  );
  const currentChartModeLabel = chartModeLabelOf(chartModeOptions, chartMode);
  const maxDrawdown = useMemo(
    () => calculateSetupDetailMaxDrawdown(linkedTrades, defaultRiskAmount),
    [defaultRiskAmount, linkedTrades]
  );

  const handleAnalysisModeChange = useCallback(
    (mode: SetupDetailAnalysisMode) => {
      setAnalysisMode(mode);
      void plugin.uiStateManager.updateStateImmediate({
        setupDetailAnalysisMode: mode,
      });
    },
    [plugin]
  );

  useGuideExecutionGapMode({
    analysisMode,
    currentGuideStepId,
    hasExecutionGap,
    plugin,
    setAnalysisMode,
  });

  useEffect(() => {
    if (!chartModeMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (chartModeMenuRef.current?.contains(target)) return;
      setChartModeMenuOpen(false);
    };

    const listenerDocument = window.activeDocument;
    listenerDocument.addEventListener('pointerdown', handlePointerDown);
    return () =>
      listenerDocument.removeEventListener('pointerdown', handlePointerDown);
  }, [chartModeMenuOpen]);

  return (
    <section
      className={`journalit-setups-detail-scaffold__hero journalit-setups-detail-scaffold__panel journalit-setups-detail-performance ${lineToneClass}`}
      ref={registerDetailPerformanceTarget}
    >
      {hasExecutionGap ? (
        <div className="journalit-setups-detail-performance__toolbar">
          <SetupDetailTabs
            activeId={effectiveAnalysisMode}
            ariaLabel={t('setups.view.detail.analysis.tabs-aria')}
            onChange={handleAnalysisModeChange}
            options={[
              {
                id: 'performance',
                label: t('setups.view.detail.analysis.performance'),
              },
              {
                id: 'execution-gap',
                label: t('setups.view.detail.analysis.execution-gap'),
              },
            ]}
          />
          {effectiveAnalysisMode === 'performance' ? (
            <SetupDetailChartModeControl
              chartMode={chartMode}
              currentLabel={currentChartModeLabel}
              menuOpen={chartModeMenuOpen}
              menuRef={chartModeMenuRef}
              options={chartModeOptions}
              onChartModeChange={setChartMode}
              onMenuOpenChange={setChartModeMenuOpen}
            />
          ) : null}
        </div>
      ) : null}
      <SetupDetailPerformanceStats
        displayedExpectancy={displayedExpectancy}
        displayedTotal={displayedTotal}
        effectiveAnalysisMode={effectiveAnalysisMode}
        masking={{
          drawdown: isDrawdownMasked,
          metric: isMetricMasked,
          percentage: isPercentageMasked,
          performance: isPerformanceMasked,
        }}
        maxDrawdown={maxDrawdown}
        useRMultiples={useRMultiples}
        viewModel={viewModel}
      />

      <div
        className={`journalit-setups-detail-performance__chart${hasExecutionGap ? '' : ' journalit-setups-detail-performance__chart--overlay-control'}`}
      >
        {!hasExecutionGap ? (
          <SetupDetailChartModeControl
            chartMode={chartMode}
            currentLabel={currentChartModeLabel}
            menuOpen={chartModeMenuOpen}
            menuRef={chartModeMenuRef}
            options={chartModeOptions}
            onChartModeChange={setChartMode}
            onMenuOpenChange={setChartModeMenuOpen}
          />
        ) : null}
        <SetupDetailPerformanceChart
          plugin={plugin}
          executionGapStats={
            effectiveAnalysisMode === 'execution-gap'
              ? viewModel.opportunityStats
              : undefined
          }
          useRMultiples={useRMultiples}
          hasData={hasData}
          chartMode={chartMode}
          chartData={chartData}
          tradesChartData={tradesChartData}
          drawdownChartData={drawdownChartData}
        />
      </div>
    </section>
  );
};

SetupDetailPerformanceSection.displayName = 'SetupDetailPerformanceSection';


const toneUnlessMasked = (
  isMasked: boolean,
  value: number | null
): SetupDetailMetricTone =>
  isMasked || value === null ? 'neutral' : getMetricTone(value);

const maskedTone = (
  isMasked: boolean,
  tone: SetupDetailMetricTone
): SetupDetailMetricTone => (isMasked ? 'neutral' : tone);

const drawdownTone = (
  isMasked: boolean,
  amount: number
): 'neutral' | 'negative' => (isMasked || amount <= 0 ? 'neutral' : 'negative');

const captureRateTone = (captureRate: number): SetupDetailMetricTone => {
  if (captureRate >= 75) return 'positive';
  return captureRate >= 40 ? 'warning' : 'negative';
};


const executionGapValues = (
  stats: SetupOpportunityStats,
  useRMultiples: boolean
) => {
  const totalOf = (bucket: { totalR: number; totalPnL: number }) =>
    useRMultiples ? bucket.totalR : bucket.totalPnL;
  const liveValue = totalOf(stats.live);
  const missedValue = totalOf(stats.missed);
  const capturedEdge = Math.max(0, liveValue);
  const availableEdge = capturedEdge + Math.max(0, missedValue);
  return {
    liveValue,
    missedValue,
    livePlusMissedValue: totalOf(stats.livePlusMissed),
    backtestValue: totalOf(stats.backtest),
    captureRate: availableEdge > 0 ? (capturedEdge / availableEdge) * 100 : 0,
    liveVsBacktestAverageRDelta:
      stats.backtestVsLiveAverageRDelta === null
        ? null
        : stats.backtestVsLiveAverageRDelta * -1,
  };
};

const SetupDetailOutcomeValue: React.FC<{
  useRMultiples: boolean;
  rValue: number | null;
  pnlValue: number;
}> = ({ useRMultiples, rValue, pnlValue }) =>
  useRMultiples ? (
    <RMultipleValue value={rValue} />
  ) : (
    <SetupDetailPnlMetricValue value={pnlValue} />
  );

const SetupAverageRDeltaStat: React.FC<{
  delta: number | null;
  isMasked: boolean;
}> = ({ delta, isMasked }) => (
  <SetupDetailPerformanceStat
    label={t('setups.view.detail.execution-gap.average-r-delta')}
    tone={toneUnlessMasked(isMasked, delta)}
    value={
      delta === null ? (
        <span>{SETUP_METRIC_NOT_AVAILABLE}</span>
      ) : (
        <RMultipleValue value={delta} precision={2} />
      )
    }
  />
);

const SetupDetailPerformanceStats: React.FC<{
  displayedExpectancy: number | null;
  displayedTotal: number | null;
  effectiveAnalysisMode: SetupDetailAnalysisMode;
  masking: {
    drawdown: boolean;
    metric: boolean;
    percentage: boolean;
    performance: boolean;
  };
  maxDrawdown: { amount: number; rMultiple: number };
  useRMultiples: boolean;
  viewModel: SetupViewModel;
}> = ({
  displayedExpectancy,
  displayedTotal,
  effectiveAnalysisMode,
  masking,
  maxDrawdown,
  useRMultiples,
  viewModel,
}) => (
  <div className="journalit-setups-detail-performance__header">
    <div className="journalit-setups-detail-performance__stats">
      {effectiveAnalysisMode === 'execution-gap' &&
      viewModel.opportunityStats ? (
        <SetupExecutionGapStats
          stats={viewModel.opportunityStats}
          useRMultiples={useRMultiples}
        />
      ) : (
        <>
          <SetupDetailPerformanceStat
            label={t('setups.view.metric.profit-factor')}
            tone={toneUnlessMasked(
              masking.metric,
              viewModel.metrics.profitFactor - 1
            )}
            value={
              <MetricValue
                kind="metric"
                value={viewModel.metrics.profitFactor}
                precision={2}
              />
            }
          />
          <SetupDetailPerformanceStat
            label={t('setups.view.metric.total-pnl')}
            tone={toneUnlessMasked(masking.performance, displayedTotal)}
            value={
              <SetupDetailOutcomeValue
                useRMultiples={useRMultiples}
                rValue={displayedTotal}
                pnlValue={viewModel.metrics.totalPnL}
              />
            }
          />
          <SetupDetailPerformanceStat
            label={t('setups.view.metric.win-rate')}
            tone={toneUnlessMasked(
              masking.percentage,
              viewModel.metrics.winRate - 50
            )}
            value={
              <PercentValue
                kind="percentage"
                value={viewModel.metrics.winRate}
              />
            }
          />
          <SetupDetailPerformanceStat
            label={t('metric.expectancy.name')}
            tone={toneUnlessMasked(masking.performance, displayedExpectancy)}
            value={
              <SetupDetailOutcomeValue
                useRMultiples={useRMultiples}
                rValue={displayedExpectancy}
                pnlValue={viewModel.metrics.expectedValue}
              />
            }
          />
          <SetupDetailPerformanceStat
            label={t('dashboard.metrics.maxDrawdown')}
            tone={drawdownTone(masking.drawdown, maxDrawdown.amount)}
            value={
              <DisplayValue
                kind="drawdown"
                rMultiple={maxDrawdown.rMultiple}
                tone={drawdownTone(masking.drawdown, maxDrawdown.amount)}
                value={Math.abs(maxDrawdown.amount)}
              />
            }
          />
        </>
      )}
    </div>
  </div>
);

SetupDetailPerformanceStats.displayName = 'SetupDetailPerformanceStats';

const SetupDetailChartModeControl: React.FC<{
  chartMode: SetupDetailChartMode;
  currentLabel: string;
  menuOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  options: Array<DropdownMenuOption<SetupDetailChartMode>>;
  onChartModeChange: (mode: SetupDetailChartMode) => void;
  onMenuOpenChange: (open: boolean) => void;
}> = ({
  chartMode,
  currentLabel,
  menuOpen,
  menuRef,
  options,
  onChartModeChange,
  onMenuOpenChange,
}) => (
  <div
    className="journalit-setups-detail-performance__chart-mode"
    ref={menuRef}
  >
    <ToolbarButton
      aria-expanded={menuOpen}
      aria-haspopup="menu"
      className="journalit-setups-detail-performance__chart-mode-trigger"
      onClick={() => onMenuOpenChange(!menuOpen)}
      type="button"
    >
      <span>{currentLabel}</span>
      <ChevronDown
        size={14}
        aria-hidden="true"
        className={`journalit-home-period-chevron${menuOpen ? ' journalit-home-period-chevron--open' : ''}`}
      />
    </ToolbarButton>
    {menuOpen ? (
      <DropdownMenu
        className="journalit-setups-detail-performance__chart-mode-dropdown"
        onChange={(value) => {
          onChartModeChange(value);
          onMenuOpenChange(false);
        }}
        options={options}
        value={chartMode}
      />
    ) : null}
  </div>
);

SetupDetailChartModeControl.displayName = 'SetupDetailChartModeControl';

const SetupExecutionGapStats: React.FC<{
  stats: SetupOpportunityStats;
  useRMultiples: boolean;
}> = ({ stats, useRMultiples }) => {
  const { shouldMask } = useDisplayFormatter();
  const isValueMasked = shouldMask(useRMultiples ? 'rMultiple' : 'pnl');
  const isPercentageMasked = shouldMask('percentage');
  const isRMultipleMasked = shouldMask('rMultiple');
  const hasMissedTrades = stats.missed.recordCount > 0;
  const hasBacktestTrades = stats.backtest.recordCount > 0;
  const {
    liveValue,
    missedValue,
    livePlusMissedValue,
    backtestValue,
    captureRate,
    liveVsBacktestAverageRDelta,
  } = executionGapValues(stats, useRMultiples);
  return (
    <>
      <SetupDetailPerformanceStat
        label={t(
          useRMultiples
            ? 'setups.view.detail.execution-gap.live-r'
            : 'setups.view.detail.execution-gap.live-pnl'
        )}
        tone={toneUnlessMasked(isValueMasked, liveValue)}
        value={
          <SetupDetailOutcomeValue
            useRMultiples={useRMultiples}
            rValue={liveValue}
            pnlValue={liveValue}
          />
        }
      />
      {hasMissedTrades ? (
        <>
          <SetupDetailPerformanceStat
            label={t('setups.view.detail.execution-gap.missed-edge')}
            tone={maskedTone(isValueMasked, 'warning')}
            value={
              <SetupDetailOutcomeValue
                useRMultiples={useRMultiples}
                rValue={missedValue}
                pnlValue={missedValue}
              />
            }
          />
          <SetupDetailPerformanceStat
            label={t('setups.view.detail.execution-gap.live-plus-missed')}
            tone={toneUnlessMasked(isValueMasked, livePlusMissedValue)}
            value={
              <SetupDetailOutcomeValue
                useRMultiples={useRMultiples}
                rValue={livePlusMissedValue}
                pnlValue={livePlusMissedValue}
              />
            }
          />
        </>
      ) : null}
      {hasBacktestTrades ? (
        <SetupDetailPerformanceStat
          label={t('setups.view.detail.execution-gap.backtest')}
          tone={maskedTone(isValueMasked, 'info')}
          value={
            <SetupDetailOutcomeValue
              useRMultiples={useRMultiples}
              rValue={backtestValue}
              pnlValue={backtestValue}
            />
          }
        />
      ) : null}
      {hasMissedTrades ? (
        <SetupDetailPerformanceStat
          label={<SetupExecutionGapCaptureRateLabel />}
          tone={maskedTone(isPercentageMasked, captureRateTone(captureRate))}
          value={<PercentValue kind="percentage" value={captureRate} />}
        />
      ) : hasBacktestTrades ? (
        <SetupAverageRDeltaStat
          delta={liveVsBacktestAverageRDelta}
          isMasked={isRMultipleMasked}
        />
      ) : null}
    </>
  );
};

SetupExecutionGapStats.displayName = 'SetupExecutionGapStats';

const SetupExecutionGapCaptureRateLabel: React.FC = () => (
  <span className="journalit-setups-detail-performance__stat-label-with-info">
    {t('setups.view.detail.execution-gap.capture-rate')}
    <Tooltip
      content={t('setups.view.detail.execution-gap.capture-rate-tooltip')}
      preferredPosition="left"
      triggerClassName="journalit-setups-detail-performance__stat-info-trigger"
    >
      <span
        className="journalit-dashboard-metric-info journalit-currency-conversion-info"
        aria-hidden="true"
      >
        <Info size={10} />
      </span>
    </Tooltip>
  </span>
);

SetupExecutionGapCaptureRateLabel.displayName =
  'SetupExecutionGapCaptureRateLabel';

const SetupDetailPerformanceStat: React.FC<{
  label: React.ReactNode;
  value: React.ReactNode;
  tone: SetupDetailMetricTone;
}> = ({ label, value, tone }) => (
  <div
    className={`journalit-setups-detail-performance__stat journalit-setups-detail-performance__stat--${tone}`}
  >
    <div className="journalit-setups-detail-performance__stat-label">
      {label}
    </div>
    <div className="journalit-setups-detail-performance__stat-value">
      <span className="journalit-setups-detail-performance__stat-primary">
        {value}
      </span>
    </div>
  </div>
);

SetupDetailPerformanceStat.displayName = 'SetupDetailPerformanceStat';

const SetupDetailPnlMetricValue: React.FC<{ value: number }> = ({ value }) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isMasked = shouldMask('pnl');
  const formattedValue = formatValue({
    kind: 'pnl',
    value,
    showCents: true,
  });

  if (isMasked) {
    return <span className="journalit-privacy-mask">{formattedValue}</span>;
  }

  const centsMatch = formattedValue.match(/^(.*?)(\.\d+)$/);
  if (!centsMatch) return <>{formattedValue}</>;

  return (
    <>
      {centsMatch[1]}
      <span className="journalit-setups-detail-performance__stat-cents">
        {centsMatch[2]}
      </span>
    </>
  );
};

SetupDetailPnlMetricValue.displayName = 'SetupDetailPnlMetricValue';
