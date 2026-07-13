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
import { SETUPS_DETAIL_HAS_EXECUTION_GAP_CONTEXT_KEY } from '../../guides/setupsMainGuide';
import { analyzeDrawdown } from '../../utils/drawdownAnalytics';
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
} from '../shared/display';
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

export const SetupDetailPerformanceSection: React.FC<{
  plugin: JournalitPlugin;
  viewModel: SetupViewModel;
  linkedTrades: SetupLinkedTrade[];
}> = ({ plugin, viewModel, linkedTrades }) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const registerDetailPerformanceTarget = useGuideTarget(
    SETUPS_DETAIL_PERFORMANCE_TARGET_ID
  );
  const currentGuideStepId = useGuideCurrentStepId();
  const useRMultiples = plugin.settings.trade?.displayRMultiples ?? false;
  const dateFormat = plugin.settings.trade?.dateFormat ?? 'DDMMYY';
  const defaultRiskAmount = plugin.settings.trade?.defaultRiskAmount;
  const [chartMode, setChartMode] =
    useState<SetupDetailChartMode>('cumulative');
  const [analysisMode, setAnalysisMode] = useState<SetupDetailAnalysisMode>(
    () =>
      plugin.uiStateManager.getState().setupDetailAnalysisMode ?? 'performance'
  );
  const [chartModeMenuOpen, setChartModeMenuOpen] = useState(false);
  const chartModeMenuRef = useRef<HTMLDivElement>(null);
  const hasExecutionGap =
    (viewModel.opportunityStats?.missed.recordCount ?? 0) > 0 ||
    (viewModel.opportunityStats?.backtest.recordCount ?? 0) > 0;
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
  const lineToneClass = isPerformanceMasked
    ? 'journalit-setups-detail-performance--masked'
    : displayedTotal === null
      ? 'journalit-setups-detail-performance--neutral'
      : displayedTotal < 0
        ? 'journalit-setups-detail-performance--negative'
        : 'journalit-setups-detail-performance--positive';
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
  const currentChartModeLabel =
    chartModeOptions.find((option) => option.value === chartMode)?.label ??
    chartModeOptions[0].label;
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

    window.activeDocument.addEventListener('pointerdown', handlePointerDown);
    return () =>
      window.activeDocument.removeEventListener(
        'pointerdown',
        handlePointerDown
      );
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
        {effectiveAnalysisMode === 'execution-gap' &&
        viewModel.opportunityStats ? (
          <LazySetupExecutionGapChart
            stats={viewModel.opportunityStats}
            formatValue={(value) =>
              formatValue({
                kind: useRMultiples ? 'rMultiple' : 'pnl',
                value,
                ...(useRMultiples ? {} : { showCents: false }),
              })
            }
            isMasked={shouldMask(useRMultiples ? 'rMultiple' : 'pnl')}
            valueMode={useRMultiples ? 'rMultiple' : 'pnl'}
          />
        ) : hasData ? (
          chartMode === 'trades' ? (
            <SharedTradesChart
              className="journalit-setups-detail-performance__shared-chart"
              data={tradesChartData}
              valueMode={useRMultiples ? 'rMultiple' : 'pnl'}
              height="100%"
              margin={{ top: 8, right: 8, bottom: 2, left: 0 }}
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
        )}
      </div>
    </section>
  );
};

SetupDetailPerformanceSection.displayName = 'SetupDetailPerformanceSection';

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
            tone={
              masking.metric
                ? 'neutral'
                : getMetricTone(viewModel.metrics.profitFactor - 1)
            }
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
            tone={
              masking.performance || displayedTotal === null
                ? 'neutral'
                : getMetricTone(displayedTotal)
            }
            value={
              useRMultiples ? (
                <RMultipleValue value={displayedTotal} />
              ) : (
                <SetupDetailPnlMetricValue value={viewModel.metrics.totalPnL} />
              )
            }
          />
          <SetupDetailPerformanceStat
            label={t('setups.view.metric.win-rate')}
            tone={
              masking.percentage
                ? 'neutral'
                : getMetricTone(viewModel.metrics.winRate - 50)
            }
            value={
              <PercentValue
                kind="percentage"
                value={viewModel.metrics.winRate}
              />
            }
          />
          <SetupDetailPerformanceStat
            label={t('metric.expectancy.name')}
            tone={
              masking.performance
                ? 'neutral'
                : displayedExpectancy === null
                  ? 'neutral'
                  : getMetricTone(displayedExpectancy)
            }
            value={
              useRMultiples ? (
                <RMultipleValue value={displayedExpectancy} />
              ) : (
                <SetupDetailPnlMetricValue
                  value={viewModel.metrics.expectedValue}
                />
              )
            }
          />
          <SetupDetailPerformanceStat
            label={t('dashboard.metrics.maxDrawdown')}
            tone={
              masking.drawdown || maxDrawdown.amount <= 0
                ? 'neutral'
                : 'negative'
            }
            value={
              <DisplayValue
                kind="drawdown"
                rMultiple={maxDrawdown.rMultiple}
                tone={
                  masking.drawdown || maxDrawdown.amount <= 0
                    ? 'neutral'
                    : 'negative'
                }
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
  const liveValue = useRMultiples ? stats.live.totalR : stats.live.totalPnL;
  const missedValue = useRMultiples
    ? stats.missed.totalR
    : stats.missed.totalPnL;
  const livePlusMissedValue = useRMultiples
    ? stats.livePlusMissed.totalR
    : stats.livePlusMissed.totalPnL;
  const backtestValue = useRMultiples
    ? stats.backtest.totalR
    : stats.backtest.totalPnL;
  const capturedEdge = Math.max(0, liveValue);
  const missedEdge = Math.max(0, missedValue);
  const availableEdge = capturedEdge + missedEdge;
  const captureRate =
    availableEdge > 0 ? (capturedEdge / availableEdge) * 100 : 0;
  const liveVsBacktestAverageRDelta =
    stats.backtestVsLiveAverageRDelta === null
      ? null
      : stats.backtestVsLiveAverageRDelta * -1;
  return (
    <>
      <SetupDetailPerformanceStat
        label={t(
          useRMultiples
            ? 'setups.view.detail.execution-gap.live-r'
            : 'setups.view.detail.execution-gap.live-pnl'
        )}
        tone={isValueMasked ? 'neutral' : getMetricTone(liveValue)}
        value={
          useRMultiples ? (
            <RMultipleValue value={liveValue} />
          ) : (
            <SetupDetailPnlMetricValue value={liveValue} />
          )
        }
      />
      {hasMissedTrades ? (
        <>
          <SetupDetailPerformanceStat
            label={t('setups.view.detail.execution-gap.missed-edge')}
            tone={isValueMasked ? 'neutral' : 'warning'}
            value={
              useRMultiples ? (
                <RMultipleValue value={missedValue} />
              ) : (
                <SetupDetailPnlMetricValue value={missedValue} />
              )
            }
          />
          <SetupDetailPerformanceStat
            label={t('setups.view.detail.execution-gap.live-plus-missed')}
            tone={
              isValueMasked ? 'neutral' : getMetricTone(livePlusMissedValue)
            }
            value={
              useRMultiples ? (
                <RMultipleValue value={livePlusMissedValue} />
              ) : (
                <SetupDetailPnlMetricValue value={livePlusMissedValue} />
              )
            }
          />
        </>
      ) : null}
      {hasBacktestTrades ? (
        <SetupDetailPerformanceStat
          label={t('setups.view.detail.execution-gap.backtest')}
          tone={isValueMasked ? 'neutral' : 'info'}
          value={
            useRMultiples ? (
              <RMultipleValue value={backtestValue} />
            ) : (
              <SetupDetailPnlMetricValue value={backtestValue} />
            )
          }
        />
      ) : null}
      {hasMissedTrades ? (
        <SetupDetailPerformanceStat
          label={<SetupExecutionGapCaptureRateLabel />}
          tone={
            isPercentageMasked
              ? 'neutral'
              : captureRate >= 75
                ? 'positive'
                : captureRate >= 40
                  ? 'warning'
                  : 'negative'
          }
          value={<PercentValue kind="percentage" value={captureRate} />}
        />
      ) : hasBacktestTrades ? (
        <SetupDetailPerformanceStat
          label={t('setups.view.detail.execution-gap.average-r-delta')}
          tone={
            isRMultipleMasked || liveVsBacktestAverageRDelta === null
              ? 'neutral'
              : getMetricTone(liveVsBacktestAverageRDelta)
          }
          value={
            liveVsBacktestAverageRDelta === null ? (
              <span>{SETUP_METRIC_NOT_AVAILABLE}</span>
            ) : (
              <RMultipleValue
                value={liveVsBacktestAverageRDelta}
                precision={2}
              />
            )
          }
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
