import React, { useEffect, useMemo, useRef, useState } from 'react';

import { t } from '../../lang/helpers';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { useGuideAction, useGuideTarget } from '../../guides/GuideRuntimeLayer';
import {
  SETUPS_BACK_BUTTON_TARGET_ID,
  SETUPS_COMPARE_BODY_TARGET_ID,
  SETUPS_COMPARE_HEADER_TARGET_ID,
  SETUPS_OVERVIEW_OPENED_ACTION_ID,
} from '../../guides/setupsGuideIds';
import { DropdownMenu, type DropdownMenuOption } from '../shared/DropdownMenu';
import { EmptyState } from '../shared/EmptyState';
import { SkeletonBox } from '../shared/SkeletonBox';
import { ToolbarButton } from '../shared/ToolbarButton';
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  MoveLeft,
  Trophy,
} from '../shared/icons/ObsidianIcon';
import {
  MetricValue,
  PercentValue,
  PnLValue,
  RMultipleValue,
} from '../shared/display';

import type {
  SetupCompareChartMetric,
  SetupCompareEdgeSummary,
  SetupCompareMetricKey,
  SetupCompareViewModel,
  SetupTradeIndex,
  SetupViewModel,
} from './setupsViewTypes';
import {
  buildCompareBreakdowns,
  buildCompareEdgeSummary,
  buildCumulativeCompareChartSeries,
  calculateCompareMetrics,
  getCompareConfidenceLabel,
  getCompareEdgeStrengthLabel,
  getCompareMetricDelta,
  getCompareMetricDisplayKind,
  getCompareMetricWinnerId,
  getSetupTrades,
} from './setupsViewModel';

const LazySetupCompareCumulativeChart = React.lazy(async () => {
  const module = await import('../charts/SharedSetupPerformanceChart');
  return { default: module.SetupCompareCumulativeChart };
});

const LazySetupCompareEdgeBreakdownChart = React.lazy(async () => {
  const module = await import('../charts/SharedSetupPerformanceChart');
  return { default: module.SetupCompareEdgeBreakdownChart };
});

export const SetupComparePage: React.FC<{
  displayRMultiples: boolean;
  viewModels: SetupViewModel[];
  tradeIndex: SetupTradeIndex;
  selectedSetupIds: string[];
  onBack: () => void;
}> = ({
  displayRMultiples,
  viewModels,
  tradeIndex,
  selectedSetupIds,
  onBack,
}) => {
  const { shouldMask } = useDisplayFormatter();
  const emitGuideAction = useGuideAction();
  const registerBackButtonTarget = useGuideTarget(SETUPS_BACK_BUTTON_TARGET_ID);
  const registerCompareHeaderTarget = useGuideTarget(
    SETUPS_COMPARE_HEADER_TARGET_ID
  );
  const registerCompareBodyTarget = useGuideTarget(
    SETUPS_COMPARE_BODY_TARGET_ID
  );
  const [chartMetric, setChartMetric] = useState<SetupCompareChartMetric>(() =>
    displayRMultiples ? 'r' : 'pnl'
  );
  const effectiveChartMetric = displayRMultiples ? chartMetric : 'pnl';
  const selectedModels = viewModels.filter(({ setup }) =>
    selectedSetupIds.includes(setup.id)
  );
  const setupTradeMap = tradeIndex.any;
  const compareModels: SetupCompareViewModel[] = selectedModels.map(
    ({ setup }) => {
      const trades = getSetupTrades(setupTradeMap, setup.id);
      return { setup, trades, metrics: calculateCompareMetrics(trades) };
    }
  );
  const edgeSummary =
    compareModels.length === 2
      ? buildCompareEdgeSummary(compareModels, displayRMultiples)
      : null;
  const isPerformanceMasked =
    shouldMask('metric') || shouldMask('pnl') || shouldMask('rMultiple');
  const compareTitle = compareModels
    .map(({ setup }) => setup.name)
    .join(' vs ');

  return (
    <div className="journalit-setups-view journalit-setups-compare-page">
      <header className="journalit-setups-compare-header">
        <button
          className="journalit-setups-detail-back-button"
          onClick={() => {
            emitGuideAction(SETUPS_OVERVIEW_OPENED_ACTION_ID);
            onBack();
          }}
          ref={registerBackButtonTarget}
        >
          <MoveLeft size={15} strokeWidth={2} aria-hidden="true" />
          {t('setups.view.detail.back')}
        </button>
        <h1 className="journalit-setups-compare-header__title">
          {compareModels.length === 2 ? (
            <>
              <span className="journalit-setups-compare-header__setup-name journalit-setups-compare-header__setup-name--left">
                {compareModels[0].setup.name}
              </span>
              <span className="journalit-setups-compare-header__vs">vs</span>
              <span className="journalit-setups-compare-header__setup-name journalit-setups-compare-header__setup-name--right">
                {compareModels[1].setup.name}
              </span>
            </>
          ) : (
            compareTitle || t('setups.view.compare.empty')
          )}
        </h1>
      </header>

      {compareModels.length !== 2 ? (
        <EmptyState
          className="journalit-setups-compare-empty-state"
          iconSize={42}
          message={t('setups.view.compare.empty')}
          subMessage={t('setups.view.compare.empty-submessage')}
        />
      ) : (
        <>
          {edgeSummary ? (
            <div ref={registerCompareHeaderTarget}>
              <CompareEdgeSummaryCard
                summary={edgeSummary}
                isPerformanceMasked={isPerformanceMasked}
              />
            </div>
          ) : null}

          <section
            className="journalit-setups-compare-body-card"
            ref={registerCompareBodyTarget}
          >
            <div className="journalit-setups-compare-main-grid">
              <section className="journalit-setups-compare-panel journalit-setups-compare-panel--metrics">
                <h2 className="journalit-setups-section-title">
                  {t('setups.view.compare.metrics-title')}
                </h2>
                <div className="journalit-setups-compare-metrics">
                  <div className="journalit-setups-compare-metric-row journalit-setups-compare-metric-row--header">
                    <span>{t('setups.view.compare.metric')}</span>
                    <span>{compareModels[0].setup.name}</span>
                    <span>{compareModels[1].setup.name}</span>
                    <span>{t('setups.view.compare.edge-column')}</span>
                  </div>
                  <CompareMetricRow
                    label={t('setups.view.metric.trades')}
                    models={compareModels}
                    metric="trades"
                  />
                  <CompareMetricRow
                    label={t('setups.view.metric.win-rate')}
                    models={compareModels}
                    metric="winRate"
                  />
                  <CompareMetricRow
                    label={t('setups.view.metric.net-pnl')}
                    models={compareModels}
                    metric="totalPnL"
                  />
                  {displayRMultiples ? (
                    <>
                      <CompareMetricRow
                        label={t('setups.view.detail.performance.cumulative-r')}
                        models={compareModels}
                        metric="totalR"
                      />
                      <CompareMetricRow
                        label={t('metric.expectancy.name')}
                        models={compareModels}
                        metric="expectancyR"
                      />
                    </>
                  ) : null}
                  <CompareMetricRow
                    label={t('setups.view.metric.profit-factor')}
                    models={compareModels}
                    metric="profitFactor"
                  />
                </div>
              </section>

              <section className="journalit-setups-compare-panel journalit-setups-compare-panel--chart">
                <div className="journalit-setups-compare-panel__header">
                  <h2 className="journalit-setups-section-title">
                    {t('setups.view.compare.cumulative-title')}
                  </h2>
                  {displayRMultiples ? (
                    <SetupCompareChartMetricControl
                      metric={effectiveChartMetric}
                      onMetricChange={setChartMetric}
                    />
                  ) : null}
                </div>
                {isPerformanceMasked ? (
                  <p className="journalit-setups-privacy-note">
                    {t('setups.view.compare.cumulative-privacy')}
                  </p>
                ) : (
                  <CumulativeCompareChart
                    compareModels={compareModels}
                    metric={effectiveChartMetric}
                  />
                )}
              </section>
            </div>

            {isPerformanceMasked || !edgeSummary ? null : (
              <CompareBreakdowns
                compareModels={compareModels}
                edgeSummary={edgeSummary}
              />
            )}
          </section>
        </>
      )}
    </div>
  );
};

SetupComparePage.displayName = 'SetupComparePage';

const SetupCompareChartMetricControl: React.FC<{
  metric: SetupCompareChartMetric;
  onMetricChange: (metric: SetupCompareChartMetric) => void;
}> = ({ metric, onMetricChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const options: Array<DropdownMenuOption<SetupCompareChartMetric>> = [
    {
      value: 'r',
      label: t('setups.view.detail.performance.cumulative-r'),
    },
    {
      value: 'pnl',
      label: t('setups.view.detail.performance.cumulative-pnl'),
    },
  ];
  const currentLabel =
    options.find((option) => option.value === metric)?.label ??
    options[0].label;

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || menuRef.current?.contains(target)) {
        return;
      }
      setMenuOpen(false);
    };
    window.activeDocument.addEventListener('pointerdown', handlePointerDown);
    return () =>
      window.activeDocument.removeEventListener(
        'pointerdown',
        handlePointerDown
      );
  }, [menuOpen]);

  return (
    <div
      className="journalit-setups-detail-performance__chart-mode"
      ref={menuRef}
    >
      <ToolbarButton
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        className="journalit-setups-detail-performance__chart-mode-trigger"
        onClick={() => setMenuOpen((open) => !open)}
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
            onMetricChange(value);
            setMenuOpen(false);
          }}
          options={options}
          value={metric}
        />
      ) : null}
    </div>
  );
};

SetupCompareChartMetricControl.displayName = 'SetupCompareChartMetricControl';

export const CompareEdgeSummaryCard: React.FC<{
  summary: SetupCompareEdgeSummary;
  isPerformanceMasked: boolean;
}> = ({ summary, isPerformanceMasked }) => {
  if (isPerformanceMasked) {
    return (
      <section className="journalit-setups-compare-edge-card journalit-setups-compare-edge-card--masked">
        <p className="journalit-setups-privacy-note">
          {t('setups.view.compare.edge-reasons-privacy')}
        </p>
      </section>
    );
  }

  const winnerName =
    summary.winner?.setup.name ?? t('setups.view.compare.no-clear-edge');
  return (
    <section className="journalit-setups-compare-edge-card">
      <div className="journalit-setups-compare-edge-card__primary">
        <div
          className="journalit-setups-compare-edge-card__icon"
          aria-hidden="true"
        >
          <Trophy size={30} />
        </div>
        <div>
          <span className="journalit-setups-compare-edge-card__eyebrow">
            {t('setups.view.compare.edge-label')}
          </span>
          <strong>{winnerName}</strong>
          {summary.winner ? (
            <span className="journalit-setups-compare-edge-card__strength">
              {getCompareEdgeStrengthLabel(summary.edgeStrength)}
            </span>
          ) : null}
        </div>
      </div>
      <div className="journalit-setups-compare-edge-card__stat">
        <span>{t('setups.view.compare.expectancy-edge')}</span>
        {summary.expectancyKind === 'rMultiple' ? (
          <RMultipleValue value={summary.expectancyDelta} precision={2} />
        ) : (
          <PnLValue value={summary.expectancyDelta} />
        )}
      </div>
      <div className="journalit-setups-compare-edge-card__stat">
        <span>{t('setups.view.compare.confidence')}</span>
        <div className="journalit-setups-compare-confidence">
          <span
            className={`journalit-setups-compare-confidence__gauge journalit-setups-compare-confidence__gauge--${summary.confidence}`}
            aria-hidden="true"
          />
          <strong
            className={`journalit-setups-compare-confidence__label journalit-setups-compare-confidence__label--${summary.confidence}`}
          >
            {getCompareConfidenceLabel(summary.confidence)}
          </strong>
        </div>
      </div>
      <div className="journalit-setups-compare-edge-card__reasons">
        {summary.reasons.map((reason) => (
          <div
            className={`journalit-setups-compare-edge-reason journalit-setups-compare-edge-reason--${reason.tone}`}
            key={reason.label}
          >
            <CheckCircle2 size={15} aria-hidden="true" />
            <span>{reason.label}</span>
            <strong>{reason.value}</strong>
          </div>
        ))}
        <div className="journalit-setups-compare-edge-reason journalit-setups-compare-edge-reason--neutral">
          <Circle size={15} aria-hidden="true" />
          <span>{t('setups.view.compare.sample')}</span>
          <strong>{summary.sampleDescription}</strong>
        </div>
      </div>
    </section>
  );
};

CompareEdgeSummaryCard.displayName = 'CompareEdgeSummaryCard';

const CompareMetricRow: React.FC<{
  label: string;
  models: SetupCompareViewModel[];
  metric: SetupCompareMetricKey;
}> = ({ label, models, metric }) => {
  const { shouldMask } = useDisplayFormatter();
  const isWinnerMasked = shouldMask(getCompareMetricDisplayKind(metric));
  const winnerId = isWinnerMasked
    ? null
    : getCompareMetricWinnerId(models, metric);
  return (
    <div className="journalit-setups-compare-metric-row">
      <span className="journalit-setups-compare-metric-row__label">
        {label}
      </span>
      {models.map((model) => (
        <span
          className={[
            'journalit-setups-compare-metric-row__value',
            winnerId === model.setup.id
              ? 'journalit-setups-compare-metric-row__value--winner'
              : '',
            winnerId !== null && winnerId !== model.setup.id
              ? 'journalit-setups-compare-metric-row__value--nonwinner'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
          key={model.setup.id}
        >
          <CompareMetricValue model={model} metric={metric} />
        </span>
      ))}
      <span className="journalit-setups-compare-metric-row__edge">
        <CompareMetricEdgeValue models={models} metric={metric} />
      </span>
    </div>
  );
};

CompareMetricRow.displayName = 'CompareMetricRow';

const CompareMetricValue: React.FC<{
  model: SetupCompareViewModel;
  metric: SetupCompareMetricKey;
}> = ({ model, metric }) => {
  switch (metric) {
    case 'trades':
      return (
        <MetricValue
          kind="count"
          value={model.metrics.totalTrades}
          tone="none"
        />
      );
    case 'winRate':
      return (
        <PercentValue
          kind="percentage"
          value={model.metrics.winRate}
          tone="none"
        />
      );
    case 'totalPnL':
      return <PnLValue value={model.metrics.totalPnL} tone="none" />;
    case 'totalR':
      return (
        <RMultipleValue
          value={model.metrics.totalR}
          precision={2}
          tone="none"
        />
      );
    case 'expectancyR':
      return (
        <RMultipleValue
          value={model.metrics.expectancyR}
          precision={2}
          tone="none"
        />
      );
    case 'profitFactor':
      return (
        <MetricValue
          kind="metric"
          value={model.metrics.profitFactor}
          precision={2}
          tone="none"
        />
      );
  }
};

CompareMetricValue.displayName = 'CompareMetricValue';

const CompareMetricEdgeValue: React.FC<{
  models: SetupCompareViewModel[];
  metric: SetupCompareMetricKey;
}> = ({ models, metric }) => {
  if (models.length !== 2) return null;
  const delta = getCompareMetricDelta(models, metric);

  switch (metric) {
    case 'trades':
      return <MetricValue kind="count" value={delta} signed tone="none" />;
    case 'winRate':
      return (
        <PercentValue
          kind="percentage"
          value={delta}
          precision={1}
          signed
          tone="none"
        />
      );
    case 'totalPnL':
      return <PnLValue value={delta} tone="none" />;
    case 'totalR':
    case 'expectancyR':
      return <RMultipleValue value={delta} precision={2} tone="none" />;
    case 'profitFactor':
      return (
        <MetricValue
          kind="metric"
          value={delta}
          precision={2}
          signed
          tone="none"
        />
      );
  }
};

CompareMetricEdgeValue.displayName = 'CompareMetricEdgeValue';

const CompareBreakdowns: React.FC<{
  compareModels: SetupCompareViewModel[];
  edgeSummary: SetupCompareEdgeSummary;
}> = ({ compareModels, edgeSummary }) => {
  const winnerModel = edgeSummary.winner ?? compareModels[0];
  const otherModel =
    compareModels.find((model) => model.setup.id !== winnerModel.setup.id) ??
    compareModels[1];
  const breakdowns = buildCompareBreakdowns(
    winnerModel,
    otherModel,
    edgeSummary.expectancyKind
  );
  if (breakdowns.length === 0) return null;

  return (
    <section className="journalit-setups-compare-breakdown-section">
      <div className="journalit-setups-compare-breakdowns">
        {breakdowns.map((breakdown) => (
          <article
            className="journalit-setups-compare-breakdown"
            key={breakdown.label}
          >
            <div className="journalit-setups-compare-breakdown__header">
              <div className="journalit-setups-compare-breakdown__title">
                <breakdown.Icon size={17} strokeWidth={2} />
                <h3>{breakdown.label}</h3>
              </div>
              <span className="journalit-setups-compare-breakdown__metric">
                {t('setups.view.compare.edge-column')}
              </span>
            </div>
            <React.Suspense
              fallback={
                <SkeletonBox width="100%" height={220} borderRadius="10px" />
              }
            >
              <LazySetupCompareEdgeBreakdownChart
                data={breakdown.rows}
                winnerName={winnerModel.setup.name}
                otherName={otherModel.setup.name}
                valueKind={edgeSummary.expectancyKind}
              />
            </React.Suspense>
          </article>
        ))}
      </div>
    </section>
  );
};

CompareBreakdowns.displayName = 'CompareBreakdowns';

const CumulativeCompareChart: React.FC<{
  compareModels: SetupCompareViewModel[];
  metric: SetupCompareChartMetric;
}> = ({ compareModels, metric }) => {
  const series = useMemo(
    () => buildCumulativeCompareChartSeries(compareModels, metric),
    [compareModels, metric]
  );

  if (series.every((item) => item.values.length === 0)) {
    return (
      <div className="journalit-setups-empty">
        {t('setups.view.compare.cumulative-empty')}
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={<SkeletonBox width="100%" height={320} borderRadius="10px" />}
    >
      <LazySetupCompareCumulativeChart metric={metric} series={series} />
    </React.Suspense>
  );
};

CumulativeCompareChart.displayName = 'CumulativeCompareChart';
