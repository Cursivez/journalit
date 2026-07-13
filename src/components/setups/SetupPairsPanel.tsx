import React, { useMemo } from 'react';

import { t } from '../../lang/helpers';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { cssVars } from '../../styles/inlineStylePolicy';
import { DropdownMenu, type DropdownMenuOption } from '../shared/DropdownMenu';
import { EmptyState } from '../shared/EmptyState';
import { ToolbarButton } from '../shared/ToolbarButton';
import { ChevronDown } from '../shared/icons/ObsidianIcon';
import {
  MetricValue,
  PercentValue,
  PnLValue,
  RMultipleValue,
} from '../shared/display';
import { SETUP_PAIR_METRIC_OPTIONS } from './setupOverviewMetrics';
import type {
  MetricKey,
  SetupCompareMetrics,
  SetupDetailMetricTone,
  SetupPairMetricKey,
  SetupPairSummary,
  SetupPairTrendPoint,
  SetupPairViewModel,
} from './setupsViewTypes';
import {
  buildSetupPairEvidenceTrend,
  formatSetupPairSummaryLabel,
  getAveragePnl,
  getSetupPairBarValue,
  getSetupPairChartModels,
  getSetupPairMetricValue,
  getValueTone,
  getWorstSetupPair,
} from './setupsViewModel';

const LazySetupPairTrendChart = React.lazy(async () => {
  const module = await import('../charts/SetupPairTrendChart');
  return { default: module.SetupPairTrendChart };
});

export const SetupPairsSummary: React.FC<{
  summary: SetupPairSummary;
}> = ({ summary }) => (
  <div
    className="journalit-setups-performance-summary"
    aria-label={t('setups.view.pairs.summary-aria')}
  >
    <span>
      {t('setups.view.pairs.best')}:{' '}
      <strong>
        {summary.bestPair
          ? formatSetupPairSummaryLabel(summary.bestPair.setupNames)
          : '—'}
      </strong>
    </span>
    {summary.bestPair ? (
      <span className="journalit-setups-performance-summary__meta">
        <RMultipleValue value={summary.bestPair.edgeR} precision={2} />{' '}
        {t('setups.view.pairs.metric.edge-short')}
        <span aria-hidden="true">·</span>
        <MetricValue
          kind="count"
          value={summary.bestPair.metrics.totalTrades}
          tone="none"
        />{' '}
        {t('setups.view.metric.trades')}
      </span>
    ) : null}
    <span className="journalit-setups-performance-summary__warning">
      {t('setups.view.pairs.worst')}:{' '}
      <strong>
        {summary.worstPair
          ? formatSetupPairSummaryLabel(summary.worstPair.setupNames)
          : '—'}
      </strong>
    </span>
    {summary.worstPair ? (
      <span className="journalit-setups-performance-summary__warning">
        <RMultipleValue value={summary.worstPair.edgeR} precision={2} />{' '}
        {t('setups.view.pairs.metric.edge-short')}
      </span>
    ) : null}
    <span className="journalit-setups-performance-summary__warning">
      {t('setups.view.summary.needs-review')}:{' '}
      <MetricValue kind="count" value={summary.needsReviewCount} tone="none" />
    </span>
  </div>
);

SetupPairsSummary.displayName = 'SetupPairsSummary';

export const SetupPerformanceMetricSelect: React.FC<{
  menuOpen: boolean;
  metricKey: MetricKey;
  metricLabel: string;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onMetricKeyChange: (metricKey: MetricKey) => void;
  onMenuOpenChange: (open: boolean) => void;
  options: Array<DropdownMenuOption<MetricKey>>;
}> = ({
  menuOpen,
  metricKey,
  metricLabel,
  menuRef,
  onMetricKeyChange,
  onMenuOpenChange,
  options,
}) => (
  <div
    className="journalit-setups-performance-widget__metric-menu"
    ref={menuRef}
  >
    <ToolbarButton
      aria-expanded={menuOpen}
      aria-haspopup="menu"
      aria-label={t('setups.view.ranking.metric-aria')}
      className="journalit-setups-performance-widget__metric-trigger"
      onClick={() => onMenuOpenChange(!menuOpen)}
      type="button"
    >
      <span>{metricLabel}</span>
      <ChevronDown
        size={14}
        aria-hidden="true"
        className={`journalit-home-period-chevron${menuOpen ? ' journalit-home-period-chevron--open' : ''}`}
      />
    </ToolbarButton>
    {menuOpen ? (
      <DropdownMenu
        className="journalit-setups-performance-widget__metric-dropdown"
        onChange={(value) => {
          onMetricKeyChange(value);
          onMenuOpenChange(false);
        }}
        options={options}
        value={metricKey}
      />
    ) : null}
  </div>
);

SetupPerformanceMetricSelect.displayName = 'SetupPerformanceMetricSelect';

export const SetupPairMetricSelect: React.FC<{
  menuOpen: boolean;
  metricKey: SetupPairMetricKey;
  metricLabel: string;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onMetricKeyChange: (metricKey: SetupPairMetricKey) => void;
  onMenuOpenChange: (open: boolean) => void;
  options: Array<DropdownMenuOption<SetupPairMetricKey>>;
}> = ({
  menuOpen,
  metricKey,
  metricLabel,
  menuRef,
  onMetricKeyChange,
  onMenuOpenChange,
  options,
}) => (
  <div
    className="journalit-setups-performance-widget__metric-menu"
    ref={menuRef}
  >
    <ToolbarButton
      aria-expanded={menuOpen}
      aria-haspopup="menu"
      aria-label={t('setups.view.pairs.metric-aria')}
      className="journalit-setups-performance-widget__metric-trigger"
      onClick={() => onMenuOpenChange(!menuOpen)}
      type="button"
    >
      <span>{metricLabel}</span>
      <ChevronDown
        size={14}
        aria-hidden="true"
        className={`journalit-home-period-chevron${menuOpen ? ' journalit-home-period-chevron--open' : ''}`}
      />
    </ToolbarButton>
    {menuOpen ? (
      <DropdownMenu
        className="journalit-setups-performance-widget__metric-dropdown"
        onChange={(value) => {
          onMetricKeyChange(value);
          onMenuOpenChange(false);
        }}
        options={options}
        value={metricKey}
      />
    ) : null}
  </div>
);

SetupPairMetricSelect.displayName = 'SetupPairMetricSelect';

export const SetupPairsSplitInsight: React.FC<{
  isMasked: boolean;
  metric: (typeof SETUP_PAIR_METRIC_OPTIONS)[number];
  pairs: SetupPairViewModel[];
  selectedPair: SetupPairViewModel | null;
  onPairSelected: (pairKey: string) => void;
}> = ({ isMasked, metric, pairs, selectedPair, onPairSelected }) => {
  const rankedPairs = useMemo(
    () =>
      isMasked ? pairs.slice(0, 6) : getSetupPairChartModels(pairs, metric.key),
    [isMasked, metric.key, pairs]
  );
  const worstPair = useMemo(
    () => (isMasked ? null : getWorstSetupPair(pairs, metric.key)),
    [isMasked, metric.key, pairs]
  );
  const finiteMagnitudes = [
    ...rankedPairs.map((pair) =>
      Math.abs(getSetupPairBarValue(pair, metric.key))
    ),
    worstPair ? Math.abs(getSetupPairBarValue(worstPair, metric.key)) : 0,
  ].filter(Number.isFinite);
  const maxMagnitude = Math.max(1, ...finiteMagnitudes);

  return (
    <div className="journalit-setups-pairs-split">
      <div
        className={`journalit-setups-pairs-table${metric.key === 'totalTrades' ? ' journalit-setups-pairs-table--trade-count-metric' : ''}`}
        role="list"
      >
        <div className="journalit-setups-pairs-table__header">
          <span>#</span>
          <span>{t('setups.view.pairs.table.setup-pair')}</span>
          <span>{t(metric.labelKey)}</span>
          {metric.key !== 'totalTrades' ? (
            <span>{t('setups.view.metric.trades')}</span>
          ) : null}
        </div>
        {rankedPairs.map((pair, index) => (
          <SetupPairRankingRow
            isMasked={isMasked}
            isSelected={selectedPair?.key === pair.key}
            key={pair.key}
            maxMagnitude={maxMagnitude}
            metric={metric}
            pair={pair}
            rank={index + 1}
            showTradeCount={metric.key !== 'totalTrades'}
            onSelect={onPairSelected}
          />
        ))}
        {worstPair &&
        !rankedPairs.some((pair) => pair.key === worstPair.key) ? (
          <SetupPairRankingRow
            isMasked={isMasked}
            isSelected={selectedPair?.key === worstPair.key}
            label={t('setups.view.pairs.worst-short')}
            maxMagnitude={maxMagnitude}
            metric={metric}
            pair={worstPair}
            showTradeCount={metric.key !== 'totalTrades'}
            onSelect={onPairSelected}
          />
        ) : null}
      </div>
      <SetupPairEvidencePanel
        isMasked={isMasked}
        metric={metric}
        pair={selectedPair}
      />
    </div>
  );
};

SetupPairsSplitInsight.displayName = 'SetupPairsSplitInsight';

export function getSetupPairBarTone(
  metricKey: SetupPairMetricKey,
  barValue: number,
  hasMetricData: boolean,
  isMasked: boolean
): SetupDetailMetricTone {
  if (
    !hasMetricData ||
    isMasked ||
    metricKey === 'winRate' ||
    metricKey === 'totalTrades'
  ) {
    return 'neutral';
  }
  return barValue < 0 ? 'negative' : 'positive';
}

const SetupPairRankingRow: React.FC<{
  isMasked: boolean;
  isSelected: boolean;
  label?: string;
  maxMagnitude: number;
  metric: (typeof SETUP_PAIR_METRIC_OPTIONS)[number];
  pair: SetupPairViewModel;
  rank?: number;
  showTradeCount: boolean;
  onSelect: (pairKey: string) => void;
}> = ({
  isMasked,
  isSelected,
  label,
  maxMagnitude,
  metric,
  pair,
  rank,
  showTradeCount,
  onSelect,
}) => {
  const value = getSetupPairMetricValue(pair, metric.key);
  const barValue = getSetupPairBarValue(pair, metric.key);
  const hasMetricData =
    metric.key !== 'profitFactor' || pair.metrics.totalTrades > 0;
  const barMagnitude = !hasMetricData
    ? 0
    : isMasked
      ? 0.38
      : Number.isFinite(barValue)
        ? Math.min(1, Math.abs(barValue) / maxMagnitude)
        : 1;
  const barTone = getSetupPairBarTone(
    metric.key,
    barValue,
    hasMetricData,
    isMasked
  );
  const barWidth = isMasked
    ? '38%'
    : `${(hasMetricData && barValue !== 0 ? Math.max(0.04, barMagnitude) : 0) * 100}%`;

  return (
    <button
      aria-pressed={isSelected}
      className={`journalit-setups-pairs-row${isSelected ? ' journalit-setups-pairs-row--selected' : ''}`}
      onClick={() => onSelect(pair.key)}
      type="button"
    >
      <span
        className={`journalit-setups-pairs-row__rank${label ? ' journalit-setups-pairs-row__rank--label' : ''}`}
      >
        {label ?? rank ?? '—'}
      </span>
      <span className="journalit-setups-pairs-row__name">
        <span>{pair.setupNames[0]}</span>
        <span aria-hidden="true">+</span>
        <span>{pair.setupNames[1]}</span>
      </span>
      <span className="journalit-setups-pairs-row__metric">
        <span
          className="journalit-setups-pairs-row__bar-track"
          aria-hidden="true"
        >
          <span
            className={`journalit-setups-pairs-row__bar journalit-setups-pairs-row__bar--${barTone}`}
            style={cssVars({
              '--journalit-setup-pair-bar-width': barWidth,
            })}
          />
        </span>
        <span className="journalit-setups-pairs-row__value">
          <PairMetricValue
            metric={metric}
            value={hasMetricData ? value : null}
          />
        </span>
      </span>
      {showTradeCount ? (
        <span className="journalit-setups-pairs-row__trades">
          <MetricValue
            kind="count"
            value={pair.metrics.totalTrades}
            tone="none"
          />
        </span>
      ) : null}
    </button>
  );
};

SetupPairRankingRow.displayName = 'SetupPairRankingRow';

const PairMetricValue: React.FC<{
  metric: (typeof SETUP_PAIR_METRIC_OPTIONS)[number];
  value: number | null;
}> = ({ metric, value }) => {
  switch (metric.displayKind) {
    case 'count':
      return <MetricValue kind="count" value={value} tone="none" />;
    case 'percentage':
      return <PercentValue kind="percentage" value={value} tone="none" />;
    case 'pnl':
      return <PnLValue value={value} precision={0} />;
    case 'rMultiple':
      return <RMultipleValue value={value} precision={2} />;
    case 'metric':
      return metric.key === 'profitFactor' ? (
        <MetricValue
          kind="metric"
          value={value}
          precision={2}
          tone={
            value === null
              ? 'none'
              : value > 1
                ? 'positive'
                : value < 1
                  ? 'negative'
                  : 'neutral'
          }
        />
      ) : (
        <MetricValue kind="metric" value={value} precision={2} />
      );
  }
};

PairMetricValue.displayName = 'PairMetricValue';

function getSetupPairEvidenceMetricValue(
  metrics: SetupCompareMetrics,
  pairEdgeR: number | null,
  metricKey: SetupPairMetricKey
): number {
  switch (metricKey) {
    case 'edgeR':
      return pairEdgeR ?? metrics.expectancyR;
    case 'expectancyR':
      return metrics.expectancyR;
    case 'totalR':
      return metrics.totalR;
    case 'totalPnL':
      return metrics.totalPnL;
    case 'winRate':
      return metrics.winRate;
    case 'profitFactor':
      return metrics.profitFactor;
    case 'totalTrades':
      return metrics.totalTrades;
  }
}

function getSetupPairEvidenceMetricTone(
  metric: (typeof SETUP_PAIR_METRIC_OPTIONS)[number],
  value: number
): SetupDetailMetricTone {
  if (metric.key === 'profitFactor') {
    return value > 1 ? 'positive' : value < 1 ? 'negative' : 'neutral';
  }
  if (metric.key === 'winRate' || metric.key === 'totalTrades') {
    return 'neutral';
  }
  return getValueTone(value);
}

function formatSetupPairEvidenceMetricValue(
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'],
  metric: (typeof SETUP_PAIR_METRIC_OPTIONS)[number],
  value: number
): string {
  switch (metric.displayKind) {
    case 'count':
      return formatValue({ kind: 'count', value });
    case 'percentage':
      return formatValue({ kind: 'percentage', value, precision: 0 });
    case 'pnl':
      return formatValue({ kind: 'pnl', value, showCents: false });
    case 'rMultiple':
      return formatValue({ kind: 'rMultiple', value, precision: 2 });
    case 'metric':
      return formatValue({ kind: 'metric', value, precision: 2 });
  }
}

const SetupPairEvidencePanel: React.FC<{
  isMasked: boolean;
  metric: (typeof SETUP_PAIR_METRIC_OPTIONS)[number];
  pair: SetupPairViewModel | null;
}> = ({ isMasked, metric, pair }) => {
  if (!pair) {
    return (
      <div className="journalit-setups-pairs-evidence journalit-setups-pairs-evidence--empty">
        <EmptyState
          iconSize={30}
          message={t('setups.view.pairs.empty')}
          subMessage={t('setups.view.pairs.empty-submessage')}
        />
      </div>
    );
  }

  if (isMasked) {
    return (
      <aside className="journalit-setups-pairs-evidence">
        <div className="journalit-setups-pairs-evidence__header">
          <h3>{pair.setupNames.join(' + ')}</h3>
        </div>
        <p className="journalit-setups-privacy-note">
          {t('setups.view.pairs.privacy')}
        </p>
      </aside>
    );
  }

  const togetherValue = getSetupPairEvidenceMetricValue(
    pair.metrics,
    pair.edgeR,
    metric.key
  );
  const firstSoloValue = getSetupPairEvidenceMetricValue(
    pair.firstSoloMetrics,
    null,
    metric.key
  );
  const secondSoloValue = getSetupPairEvidenceMetricValue(
    pair.secondSoloMetrics,
    null,
    metric.key
  );
  const edgeValue =
    metric.key === 'edgeR'
      ? pair.edgeR
      : togetherValue - Math.max(firstSoloValue, secondSoloValue);
  const togetherAvailable = pair.metrics.totalTrades > 0;
  const firstSoloAvailable = pair.firstSoloMetrics.totalTrades > 0;
  const secondSoloAvailable = pair.secondSoloMetrics.totalTrades > 0;
  const edgeAvailable =
    togetherAvailable && firstSoloAvailable && secondSoloAvailable;
  const trend = togetherAvailable
    ? buildSetupPairEvidenceTrend(pair, metric.key)
    : [];
  const hasTrendData = metric.key !== 'profitFactor' || trend.length > 0;

  return (
    <aside className="journalit-setups-pairs-evidence">
      <div className="journalit-setups-pairs-evidence__header">
        <h3>{pair.setupNames.join(' + ')}</h3>
      </div>
      <div className="journalit-setups-pairs-evidence__content">
        <div className="journalit-setups-pairs-evidence__chart-block">
          <div className="journalit-setups-pairs-evidence__section-title">
            {t(metric.labelKey)}
          </div>
          {hasTrendData ? (
            <SetupPairMiniTrendChart
              baseline={metric.key === 'profitFactor' ? 1 : 0}
              displayKind={metric.displayKind}
              points={trend}
            />
          ) : (
            <div className="journalit-setups-pairs-mini-chart journalit-setups-pairs-mini-chart--unavailable">
              <PairEvidenceSelectedMetricValue
                available={togetherAvailable}
                metric={metric}
                value={togetherValue}
              />
            </div>
          )}
        </div>
        <div className="journalit-setups-pairs-evidence__stats">
          <div className="journalit-setups-pairs-evidence__section-title">
            {t('setups.view.pairs.evidence')}
          </div>
          <PairEvidenceMetric
            label={t('setups.view.pairs.together')}
            tone={
              togetherAvailable
                ? getSetupPairEvidenceMetricTone(metric, togetherValue)
                : 'neutral'
            }
            value={
              <PairEvidenceSelectedMetricValue
                available={togetherAvailable}
                metric={metric}
                value={togetherValue}
              />
            }
          />
          <PairEvidenceMetric
            label={pair.setupNames[0]}
            tone={
              firstSoloAvailable
                ? getSetupPairEvidenceMetricTone(metric, firstSoloValue)
                : 'neutral'
            }
            value={
              <PairEvidenceSelectedMetricValue
                available={firstSoloAvailable}
                metric={metric}
                value={firstSoloValue}
              />
            }
          />
          <PairEvidenceMetric
            label={pair.setupNames[1]}
            tone={
              secondSoloAvailable
                ? getSetupPairEvidenceMetricTone(metric, secondSoloValue)
                : 'neutral'
            }
            value={
              <PairEvidenceSelectedMetricValue
                available={secondSoloAvailable}
                metric={metric}
                value={secondSoloValue}
              />
            }
          />
          <PairEvidenceMetric
            label={t('setups.view.pairs.metric.edge-short')}
            tone={
              edgeAvailable
                ? getSetupPairEvidenceMetricTone(metric, edgeValue)
                : 'neutral'
            }
            value={
              <PairEvidenceSelectedMetricValue
                available={edgeAvailable}
                metric={metric}
                value={edgeValue}
              />
            }
          />
          <PairEvidenceMetric
            label={t('setups.view.metric.trades')}
            value={
              <MetricValue kind="count" value={pair.metrics.totalTrades} />
            }
          />
        </div>
      </div>
      {edgeAvailable ? (
        <SetupPairEdgeComparison
          edgeValue={edgeValue}
          firstLabel={pair.setupNames[0]}
          firstValue={firstSoloValue}
          metric={metric}
          secondLabel={pair.setupNames[1]}
          secondValue={secondSoloValue}
          togetherValue={togetherValue}
        />
      ) : null}
    </aside>
  );
};

SetupPairEvidencePanel.displayName = 'SetupPairEvidencePanel';

const PairEvidenceMetric: React.FC<{
  label: string;
  tone?: SetupDetailMetricTone;
  value: React.ReactNode;
}> = ({ label, tone = 'neutral', value }) => (
  <div className="journalit-setups-pairs-evidence__metric">
    <span>{label}</span>
    <strong
      className={`journalit-setups-pairs-evidence__metric-value journalit-setups-pairs-evidence__metric-value--${tone}`}
    >
      {value}
    </strong>
  </div>
);

PairEvidenceMetric.displayName = 'PairEvidenceMetric';

const PairEvidenceSelectedMetricValue: React.FC<{
  available: boolean;
  metric: (typeof SETUP_PAIR_METRIC_OPTIONS)[number];
  value: number;
}> = ({ available, metric, value }) =>
  available ? (
    <PairMetricValue metric={metric} value={value} />
  ) : (
    <MetricValue kind="metric" value={null} tone="none" />
  );

PairEvidenceSelectedMetricValue.displayName = 'PairEvidenceSelectedMetricValue';

const SetupPairMiniTrendChart: React.FC<{
  baseline: number;
  displayKind: (typeof SETUP_PAIR_METRIC_OPTIONS)[number]['displayKind'];
  points: SetupPairTrendPoint[];
}> = ({ baseline, displayKind, points }) => {
  if (points.length === 0) {
    return <div className="journalit-setups-pairs-mini-chart" />;
  }

  return (
    <div className="journalit-setups-pairs-mini-chart">
      <React.Suspense fallback={null}>
        <LazySetupPairTrendChart
          baseline={baseline}
          displayKind={displayKind}
          points={points}
        />
      </React.Suspense>
    </div>
  );
};

SetupPairMiniTrendChart.displayName = 'SetupPairMiniTrendChart';

const SetupPairEdgeComparison: React.FC<{
  edgeValue: number;
  firstLabel: string;
  firstValue: number;
  metric: (typeof SETUP_PAIR_METRIC_OPTIONS)[number];
  secondLabel: string;
  secondValue: number;
  togetherValue: number;
}> = ({
  edgeValue,
  firstLabel,
  firstValue,
  metric,
  secondLabel,
  secondValue,
  togetherValue,
}) => {
  const { formatValue } = useDisplayFormatter();
  const firstPosition = 0;
  const togetherPosition = 50;
  const secondPosition = 100;

  return (
    <div className="journalit-setups-pairs-edge">
      <div className="journalit-setups-pairs-evidence__section-title">
        {t('setups.view.pairs.edge-comparison')}
      </div>
      <div className="journalit-setups-pairs-edge__track">
        <span
          className="journalit-setups-pairs-edge__point journalit-setups-pairs-edge__point--first"
          style={cssVars({
            '--journalit-setup-pair-edge-position': `${firstPosition}%`,
          })}
        />
        <span
          className="journalit-setups-pairs-edge__point journalit-setups-pairs-edge__point--second"
          style={cssVars({
            '--journalit-setup-pair-edge-position': `${secondPosition}%`,
          })}
        />
        <span
          className="journalit-setups-pairs-edge__point journalit-setups-pairs-edge__point--together"
          style={cssVars({
            '--journalit-setup-pair-edge-position': `${togetherPosition}%`,
          })}
        />
      </div>
      <div className="journalit-setups-pairs-edge__labels">
        <span
          className={`journalit-setups-pairs-edge__label journalit-setups-pairs-edge__label--${getSetupPairEvidenceMetricTone(metric, firstValue)}`}
        >
          {firstLabel}
          <PairMetricValue metric={metric} value={firstValue} />
        </span>
        <span
          className={`journalit-setups-pairs-edge__label journalit-setups-pairs-edge__label--${getSetupPairEvidenceMetricTone(metric, togetherValue)}`}
        >
          {t('setups.view.pairs.together')}
          <PairMetricValue metric={metric} value={togetherValue} />
        </span>
        <span
          className={`journalit-setups-pairs-edge__label journalit-setups-pairs-edge__label--${getSetupPairEvidenceMetricTone(metric, secondValue)}`}
        >
          {secondLabel}
          <PairMetricValue metric={metric} value={secondValue} />
        </span>
      </div>
      <p className="journalit-setups-pairs-evidence__caption">
        {t('setups.view.pairs.edge-caption').replace(
          '{edge}',
          formatSetupPairEvidenceMetricValue(formatValue, metric, edgeValue)
        )}
      </p>
    </div>
  );
};

SetupPairEdgeComparison.displayName = 'SetupPairEdgeComparison';

const SetupPairInsightPanel: React.FC<{
  displayRMultiples: boolean;
  pair: SetupPairViewModel;
}> = ({ displayRMultiples, pair }) => {
  const togetherValue = displayRMultiples
    ? pair.metrics.expectancyR
    : getAveragePnl(pair.metrics);
  const firstSoloValue = displayRMultiples
    ? pair.firstSoloMetrics.expectancyR
    : getAveragePnl(pair.firstSoloMetrics);
  const secondSoloValue = displayRMultiples
    ? pair.secondSoloMetrics.expectancyR
    : getAveragePnl(pair.secondSoloMetrics);
  const edgeValue = displayRMultiples
    ? pair.edgeR
    : togetherValue - Math.max(firstSoloValue, secondSoloValue);

  return (
    <div className="journalit-setups-pair-insight">
      <div className="journalit-setups-pair-insight__title">
        {pair.setupNames.join(' + ')}
      </div>
      <div className="journalit-setups-pair-insight__metrics">
        <PairInsightMetric
          label={t('setups.view.pairs.together')}
          value={
            <PairInsightMetricValue
              displayRMultiples={displayRMultiples}
              value={togetherValue}
            />
          }
        />
        <PairInsightMetric
          label={pair.setupNames[0]}
          value={
            <PairInsightMetricValue
              displayRMultiples={displayRMultiples}
              value={firstSoloValue}
            />
          }
        />
        <PairInsightMetric
          label={pair.setupNames[1]}
          value={
            <PairInsightMetricValue
              displayRMultiples={displayRMultiples}
              value={secondSoloValue}
            />
          }
        />
        <PairInsightMetric
          label={t('setups.view.pairs.metric.edge-short')}
          value={
            <PairInsightMetricValue
              displayRMultiples={displayRMultiples}
              value={edgeValue}
            />
          }
        />
        <PairInsightMetric
          label={t('setups.view.metric.trades')}
          value={<MetricValue kind="count" value={pair.metrics.totalTrades} />}
        />
      </div>
    </div>
  );
};

SetupPairInsightPanel.displayName = 'SetupPairInsightPanel';

const PairInsightMetricValue: React.FC<{
  displayRMultiples: boolean;
  value: number;
}> = ({ displayRMultiples, value }) =>
  displayRMultiples ? (
    <RMultipleValue value={value} precision={2} />
  ) : (
    <PnLValue value={value} precision={0} />
  );

PairInsightMetricValue.displayName = 'PairInsightMetricValue';

const PairInsightMetric: React.FC<{
  label: string;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className="journalit-setups-pair-insight__metric">
    <span className="journalit-setups-pair-insight__metric-label">{label}</span>
    <span className="journalit-setups-pair-insight__metric-value">{value}</span>
  </div>
);

PairInsightMetric.displayName = 'PairInsightMetric';
