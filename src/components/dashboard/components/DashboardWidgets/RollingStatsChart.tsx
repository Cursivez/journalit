

import React, { useState } from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { ChartBase } from '../../../charts/ChartBase';
import { RechartsPortalTooltip } from '../../../charts/RechartsPortalTooltip';
import { DashboardData, Trade } from '../../utils/dataUtils';
import type { FilterState } from '../../DashboardView';
import type JournalitPlugin from '../../../../main';
import {
  calculateCoreTradeMetrics,
  calculateExpectancyR,
} from '../../../../services/analytics/metrics';
import {
  getEffectivePnL,
  hasMissedTradeOutcome,
  isPnlContributingTrade,
} from '../../../../utils/tradeStatusUtils';
import { calculateEffectiveRMultiple } from '../../../../utils/formatting';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import { classifyPnLWithBreakEvenSettings } from '../../../../utils/breakEvenRange';
import { formatDatesForChartAxis } from '../../../../utils/dateUtils';
import type { DisplayValueKind } from '../../../../services/display/DisplayPolicy';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsDate,
  getTradeAnalyticsTradingDay,
} from '../../../../utils/tradeAnalyticsDate';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';
import {
  calculateYAxisWidth,
  generateNiceAxis,
} from '../../../../utils/chartUtils';
import { skipVerticalGridCoordinates } from '../../../charts/chartGrid';
import { SignedStrokeGradientStops } from '../../../charts/SignedSeriesDefs';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import {
  CompareLegend,
  CompareRollingChart,
  type CompareRollingSeries,
} from '../../compare/CompareCharts';


interface RollingStatsDataPoint {
  avgWin: number | null; 
  avgLoss: number | null; 
  avgWinR: number | null; 
  avgLossR: number | null; 
  
  winRate: number | null;
  
  profitFactor: number | null;
  expectancy: number | null;
  expectancyR: number | null;
  
  avgSessionPnL: number | null;
  avgSessionPnLR: number | null;
  label: string; 
}


interface RollingWindow {
  unit: 'trades' | 'sessions';
  size: number;
}


type RollingMetric =
  | 'avgWinLoss'
  | 'winRate'
  | 'profitFactor'
  | 'expectancy'
  | 'avgSessionPnL';

type SingleRollingMetric = Exclude<RollingMetric, 'avgWinLoss'>;


type TooltipContentLike<TData> = TooltipProps<number, string> & {
  payload?: ReadonlyArray<{
    payload?: TData;
  }>;
  
  label?: string | number;
};

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
}

type DisplayRollingStatsDataPoint = RollingStatsDataPoint & {
  displayAvgWin: number | null;
  displayAvgLoss: number | null;
  displayAvgWinR: number | null;
  displayAvgLossR: number | null;
};

type DisplayValueFormatter = ReturnType<
  typeof useDisplayFormatter
>['formatValue'];

function formatRollingStatsYAxisTick(
  value: number,
  displayRMultiples: boolean,
  currencyCode: string,
  formatValue: DisplayValueFormatter
): string {
  if (!Number.isFinite(value)) return '';
  return displayRMultiples
    ? formatValue({ kind: 'rMultiple', value })
    : formatValue({ kind: 'pnl', value, currencyCode });
}

const collectVisibleYAxisValues = (
  chartData: DisplayRollingStatsDataPoint[],
  displayRMultiples: boolean
): number[] => {
  const keys = displayRMultiples
    ? (['displayAvgWinR', 'displayAvgLossR'] as const)
    : (['displayAvgWin', 'displayAvgLoss'] as const);

  return chartData.flatMap((point) =>
    keys.flatMap((key) => {
      const value = point[key];
      return typeof value === 'number' && Number.isFinite(value) ? [value] : [];
    })
  );
};

const buildRollingStatsYAxis = (values: number[]) => {
  if (values.length === 0) {
    return generateNiceAxis(0, 1, 5, false);
  }

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  if (dataMin !== dataMax) {
    return generateNiceAxis(dataMin, dataMax, 5, false);
  }

  if (dataMin === 0) {
    return generateNiceAxis(-1, 1, 5, false);
  }

  const padding = Math.abs(dataMin) * 0.1;
  return generateNiceAxis(dataMin - padding, dataMax + padding, 5, false);
};

type BreakEvenSettings = Parameters<typeof classifyPnLWithBreakEvenSettings>[1];

const average = (values: number[]): number | null =>
  values.length > 0
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : null;


export const calculateRollingWindowStats = (
  data: Pick<DashboardData, 'trades' | 'realizedEventTrades'>,
  rollingWindow: RollingWindow,
  pointsShown: number,
  defaultRiskAmount: number | undefined,
  breakEvenSettings: BreakEvenSettings,
  analyticsDateBasis: 'entry' | 'exit',
  plugin: JournalitPlugin | undefined,
  dateFormat: string
): RollingStatsDataPoint[] => {
  const sourceTrades =
    rollingWindow.unit === 'sessions' && analyticsDateBasis === 'exit'
      ? (data.realizedEventTrades ?? data.trades)
      : data.trades;
  
  
  const sortedTrades = sourceTrades
    .flatMap((trade) =>
      isPnlContributingTrade(trade) &&
      (trade.isMissedTrade !== true || hasMissedTradeOutcome(trade))
        ? [
            {
              trade,
              time:
                getTradeAnalyticsDate(trade, analyticsDateBasis)?.getTime() ??
                0,
            },
          ]
        : []
    )
    .sort((a, b) => a.time - b.time);
  const days = new Map<Trade, Date | null>();
  const dayOf = (trade: Trade): Date | null => {
    let day = days.get(trade);
    if (day === undefined) {
      day = getTradeAnalyticsTradingDay(trade, analyticsDateBasis, plugin);
      days.set(trade, day);
    }
    return day;
  };

  const windows: Array<{ trades: Trade[]; sessions: number; label: string }> =
    [];
  if (rollingWindow.unit === 'trades') {
    for (
      let i = Math.max(0, sortedTrades.length - pointsShown);
      i < sortedTrades.length;
      i += 1
    ) {
      const windowTrades = sortedTrades
        .slice(Math.max(0, i - rollingWindow.size + 1), i + 1)
        .map(({ trade }) => trade);
      const sessionDays = new Set<number>();
      for (const trade of windowTrades) {
        const day = dayOf(trade);
        if (day) sessionDays.add(day.getTime());
      }
      windows.push({
        trades: windowTrades,
        sessions: sessionDays.size,
        label: `#${i + 1}`,
      });
    }
  } else {
    
    
    
    const sessionsByDay = new Map<number, { day: Date; trades: Trade[] }>();
    for (const { trade } of sortedTrades) {
      const day = dayOf(trade);
      if (!day) continue;
      const session = sessionsByDay.get(day.getTime());
      if (session) {
        session.trades.push(trade);
      } else {
        sessionsByDay.set(day.getTime(), { day, trades: [trade] });
      }
    }
    const sessions = [...sessionsByDay.values()].sort(
      (a, b) => a.day.getTime() - b.day.getTime()
    );
    const firstShown = Math.max(0, sessions.length - pointsShown);
    const labels = formatDatesForChartAxis(
      sessions.slice(firstShown).map((session) => session.day),
      dateFormat
    );
    for (let j = firstShown; j < sessions.length; j += 1) {
      const windowSessions = sessions.slice(
        Math.max(0, j - rollingWindow.size + 1),
        j + 1
      );
      windows.push({
        trades: windowSessions.flatMap((session) => session.trades),
        sessions: windowSessions.length,
        label: labels[j - firstShown],
      });
    }
  }

  const rMultipleOf = (trade: Trade): number | undefined => {
    const r = calculateEffectiveRMultiple(
      getEffectivePnL(trade),
      trade.rMultiple,
      trade.riskAmount,
      defaultRiskAmount
    );
    return r !== undefined && !isNaN(r) ? r : undefined;
  };

  return windows.map(({ trades: windowTrades, sessions, label }) => {
    const netPnLValues: number[] = [];
    const winningNetPnL: number[] = [];
    const losingNetPnL: number[] = [];
    const winR: number[] = [];
    const lossR: number[] = [];
    const rValues: number[] = [];
    for (const trade of windowTrades) {
      const pnl = getEffectivePnL(trade);
      const r = rMultipleOf(trade);
      netPnLValues.push(pnl);
      if (r !== undefined) rValues.push(r);
      const outcome = classifyPnLWithBreakEvenSettings(
        pnl,
        breakEvenSettings,
        trade.breakEvenAccountCurrentBalance
      );
      if (outcome === 'win') {
        winningNetPnL.push(pnl);
        if (r !== undefined) winR.push(r);
      } else if (outcome === 'loss') {
        losingNetPnL.push(pnl);
        if (r !== undefined) lossR.push(Math.abs(r));
      }
    }

    const core = calculateCoreTradeMetrics({
      netPnLValues,
      winningNetPnL,
      losingNetPnL,
    });
    const decided = core.numWinTrades + core.numLossTrades;
    const netR = rValues.reduce((sum, value) => sum + value, 0);
    return {
      avgWin: core.numWinTrades > 0 ? core.avgWin : null,
      avgLoss: core.numLossTrades > 0 ? core.avgLoss : null,
      avgWinR: average(winR),
      avgLossR: average(lossR),
      winRate: decided > 0 ? core.winRate : null,
      profitFactor: decided > 0 ? core.profitFactor : null,
      expectancy: decided > 0 ? core.expectancy : null,
      expectancyR: calculateExpectancyR(rValues) ?? null,
      avgSessionPnL: sessions > 0 ? core.netPnL / sessions : null,
      avgSessionPnLR:
        sessions > 0 && rValues.length > 0 ? netR / sessions : null,
      label,
    };
  });
};

const TRADE_WINDOW_SIZES = [10, 20, 30, 50];
const SESSION_WINDOW_SIZES = [5, 10, 20, 50];

const windowKey = (rollingWindow: RollingWindow): string =>
  `${rollingWindow.unit}-${rollingWindow.size}`;

const WINDOW_OPTIONS: RollingWindow[] = [
  ...TRADE_WINDOW_SIZES.map((size) => ({ unit: 'trades' as const, size })),
  ...SESSION_WINDOW_SIZES.map((size) => ({ unit: 'sessions' as const, size })),
];


const INITIAL_WINDOW: RollingWindow = { unit: 'trades', size: 20 };


const SESSION_POINTS_SHOWN = 40;

const ROLLING_METRIC_TITLES: Record<RollingMetric, () => string> = {
  avgWinLoss: () => t('dashboard.widgets.rollingStats.title'),
  winRate: () => t('widget.rollingStatsWinRate.name'),
  profitFactor: () => t('widget.rollingStatsProfitFactor.name'),
  expectancy: () => t('widget.rollingStatsExpectancy.name'),
  avgSessionPnL: () => t('widget.rollingStatsAvgSessionPnL.name'),
};

const SINGLE_METRIC_LABELS: Record<SingleRollingMetric, () => string> = {
  winRate: () => t('dashboard.metrics.winRate'),
  profitFactor: () => t('dashboard.metrics.profitFactor'),
  expectancy: () => t('dashboard.metrics.expectancy'),
  avgSessionPnL: () => t('dashboard.widgets.rollingStats.avgSessionPnL'),
};


const SIGNED_SINGLE_METRICS: ReadonlySet<SingleRollingMetric> = new Set([
  'expectancy',
  'avgSessionPnL',
]);

const POSITIVE_LINE_COLOR = 'var(--chart-positive)';
const NEGATIVE_LINE_COLOR = 'var(--chart-negative)';
const NEUTRAL_LINE_COLOR = 'var(--text-muted)';

const SINGLE_METRIC_KINDS: Record<SingleRollingMetric, DisplayValueKind> = {
  winRate: 'returnPercent',
  profitFactor: 'metric',
  expectancy: 'pnl',
  avgSessionPnL: 'pnl',
};


const singleMetricValue = (
  point: RollingStatsDataPoint,
  metric: SingleRollingMetric,
  displayRMultiples: boolean
): number | null => {
  switch (metric) {
    case 'winRate':
      return point.winRate;
    case 'profitFactor':
      return point.profitFactor;
    case 'expectancy':
      return displayRMultiples ? point.expectancyR : point.expectancy;
    case 'avgSessionPnL':
      return displayRMultiples ? point.avgSessionPnLR : point.avgSessionPnL;
  }
};

interface SingleMetricFormatContext {
  formatValue: DisplayValueFormatter;
  displayRMultiples: boolean;
  currencyCode: string;
}


const formatSingleMetric = (
  metric: SingleRollingMetric,
  value: number,
  point: RollingStatsDataPoint | undefined,
  { formatValue, displayRMultiples, currencyCode }: SingleMetricFormatContext
): string => {
  switch (metric) {
    case 'winRate':
      return formatValue({
        kind: 'returnPercent',
        value: value * 100,
        precision: 0,
        signed: false,
      });
    case 'profitFactor':
      return formatValue({ kind: 'metric', value, precision: 2 });
    case 'expectancy':
    case 'avgSessionPnL': {
      if (!point) {
        return displayRMultiples
          ? formatValue({ kind: 'rMultiple', value })
          : formatValue({ kind: 'pnl', value, currencyCode, showCents: false });
      }
      const isExpectancy = metric === 'expectancy';
      return formatValue({
        kind: 'pnl',
        value: (isExpectancy ? point.expectancy : point.avgSessionPnL) ?? 0,
        currencyCode,
        showCents: false,
        rMultiple: isExpectancy ? point.expectancyR : point.avgSessionPnLR,
      });
    }
  }
};


const renderRollingStatsLegend = (
  { payload }: CustomLegendProps,
  singleColor?: string
) => {
  if (!payload) return null;
  return (
    <div className="journalit-chart-widget__legend">
      {payload.map((entry) => (
        <div
          key={`legend-${entry.value}`}
          className="journalit-chart-widget__legend-item"
        >
          <div
            className="journalit-chart-widget__legend-swatch"
            style={cssVars({ '--legend-color': singleColor ?? entry.color })}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

interface AvgWinLossTooltipRowsProps {
  point: RollingStatsDataPoint;
  isPnlMasked: boolean;
  currencyCode: string;
  formatValue: DisplayValueFormatter;
}


const AvgWinLossTooltipRows: React.FC<AvgWinLossTooltipRowsProps> = ({
  point,
  isPnlMasked,
  currencyCode,
  formatValue,
}) => {
  const row = 'journalit-chart-tooltip-row';
  const format = (value: number, rMultiple: number | null) =>
    formatValue({
      kind: 'pnl',
      value,
      currencyCode,
      showCents: false,
      rMultiple,
    });
  return (
    <>
      {(isPnlMasked || point.avgWin !== null) && (
        <div
          className={`${row} ${isPnlMasked ? '' : `${row}--positive`} ${row}--spaced`}
        >
          {t('dashboard.widgets.rollingStats.avgWin')}:{' '}
          {format(point.avgWin ?? 0, point.avgWinR)}
        </div>
      )}
      {(isPnlMasked || point.avgLoss !== null) && (
        <div className={`${row} ${isPnlMasked ? '' : `${row}--negative`}`}>
          {t('dashboard.widgets.rollingStats.avgLoss')}:{' '}
          {format(point.avgLoss ?? 0, point.avgLossR)}
        </div>
      )}
    </>
  );
};

type RollingStatsTooltipProps = TooltipContentLike<RollingStatsDataPoint> & {
  chartData: RollingStatsDataPoint[];
  unit: RollingWindow['unit'];
  singleMetric: SingleRollingMetric | null;
  isSingleMasked: boolean;
  isPnlMasked: boolean;
  displayRMultiples: boolean;
  currencyCode: string;
  formatSingle: (value: number, point?: RollingStatsDataPoint) => string;
  formatValue: DisplayValueFormatter;
};

const RollingStatsTooltip: React.FC<RollingStatsTooltipProps> = ({
  active,
  payload,
  label,
  chartData,
  unit,
  singleMetric,
  isSingleMasked,
  isPnlMasked,
  displayRMultiples,
  currencyCode,
  formatSingle,
  formatValue,
}) => {
  
  
  const data =
    payload?.[0]?.payload ?? chartData.find((point) => point.label === label);
  if (!active || !data) return null;
  const singleValue = singleMetric
    ? singleMetricValue(data, singleMetric, displayRMultiples)
    : null;

  return (
    <div className="journalit-chart-tooltip journalit-chart-tooltip--compact">
      <div className="journalit-chart-tooltip-label">
        {unit === 'trades'
          ? t('dashboard.widgets.rollingStats.tooltip.trade', {
              label: data.label,
            })
          : data.label}
      </div>
      {singleMetric && (singleValue !== null || isSingleMasked) && (
        <div className="journalit-chart-tooltip-row journalit-chart-tooltip-row--spaced">
          {SINGLE_METRIC_LABELS[singleMetric]()}:{' '}
          {formatSingle(singleValue ?? 0, data)}
        </div>
      )}
      {!singleMetric && (
        <AvgWinLossTooltipRows
          point={data}
          isPnlMasked={isPnlMasked}
          currencyCode={currencyCode}
          formatValue={formatValue}
        />
      )}
    </div>
  );
};

const windowOptionLabel = (option: RollingWindow): string =>
  option.unit === 'trades'
    ? t('dashboard.widgets.rollingStats.trades', {
        count: String(option.size),
      })
    : t('dashboard.widgets.rollingStats.sessions', {
        count: String(option.size),
      });

const WINDOW_GROUP_LABELS: Record<RollingWindow['unit'], () => string> = {
  trades: () => t('dashboard.widgets.rollingStats.group.trades'),
  sessions: () => t('dashboard.widgets.rollingStats.group.sessions'),
};

interface RollingStatsHeaderProps {
  metric: RollingMetric;
  rollingWindow: RollingWindow;
  onWindowChange: (rollingWindow: RollingWindow) => void;
  
  children?: React.ReactNode;
}


const RollingStatsHeader: React.FC<RollingStatsHeaderProps> = ({
  metric,
  rollingWindow,
  onWindowChange,
  children,
}) => (
  <div className="journalit-chart-widget__header">
    <div className="journalit-chart-widget__title">
      {ROLLING_METRIC_TITLES[metric]()}
      {children}
    </div>
    <div className="journalit-chart-widget__selector">
      <DropdownSelect
        variant="button"
        menuWidth="content"
        showOptionTooltips={false}
        ariaLabel={t('dashboard.widgets.rollingStats.period')}
        value={windowKey(rollingWindow)}
        options={WINDOW_OPTIONS.map((option) => ({
          value: windowKey(option),
          label: windowOptionLabel(option),
          group: WINDOW_GROUP_LABELS[option.unit](),
        }))}
        onChange={(next) => {
          const picked = WINDOW_OPTIONS.find(
            (option) => windowKey(option) === next
          );
          if (picked) onWindowChange(picked);
        }}
      />
    </div>
  </div>
);

interface RollingStatsCompareProps {
  a: RollingStatsDataPoint[];
  b: RollingStatsDataPoint[];
  
  metric: SingleRollingMetric | null;
  unit: RollingWindow['unit'];
  displayRMultiples: boolean;
  formatValue: (value: number) => string;
  masked: boolean;
  aFilters: FilterState;
  bFilters: FilterState;
}

const finiteOrNull = (value: number | null): number | null =>
  value !== null && Number.isFinite(value) ? value : null;


const RollingStatsCompare: React.FC<RollingStatsCompareProps> = ({
  a,
  b,
  metric,
  unit,
  displayRMultiples,
  formatValue,
  masked,
  aFilters,
  bFilters,
}) => {
  const sides = [
    ['a', a],
    ['b', b],
  ] as const;
  const series = sides.flatMap(([side, stats]): CompareRollingSeries[] =>
    metric
      ? [
          {
            key: side,
            side,
            label: SINGLE_METRIC_LABELS[metric](),
            values: stats.map((point) =>
              finiteOrNull(singleMetricValue(point, metric, displayRMultiples))
            ),
          },
        ]
      : [
          {
            key: `${side}-win`,
            side,
            label: t('dashboard.widgets.rollingStats.avgWin'),
            values: stats.map((point) =>
              displayRMultiples ? point.avgWinR : point.avgWin
            ),
          },
          {
            key: `${side}-loss`,
            side,
            label: t('dashboard.widgets.rollingStats.avgLoss'),
            dashed: true,
            values: stats.map((point) =>
              displayRMultiples ? point.avgLossR : point.avgLoss
            ),
          },
        ]
  );
  return (
    <div className="journalit-compare-widget">
      <CompareRollingChart
        series={series}
        unit={unit}
        formatValue={formatValue}
        masked={masked}
        referenceY={metric === 'profitFactor' ? 1 : 0}
        ariaLabel={
          metric
            ? SINGLE_METRIC_LABELS[metric]()
            : t('dashboard.widgets.rollingStats.title')
        }
      />
      <CompareLegend aFilters={aFilters} bFilters={bFilters}>
        {metric ? null : (
          <>
            <span className="journalit-compare-legend__item journalit-compare-legend__key">
              <span
                className="journalit-compare-legend__line"
                aria-hidden="true"
              />
              {t('dashboard.widgets.rollingStats.avgWin')}
            </span>
            <span className="journalit-compare-legend__item journalit-compare-legend__key">
              <span
                className="journalit-compare-legend__line journalit-compare-legend__line--dashed"
                aria-hidden="true"
              />
              {t('dashboard.widgets.rollingStats.avgLoss')}
            </span>
          </>
        )}
      </CompareLegend>
    </div>
  );
};


const buildRollingStatsDisplay = (
  chartData: RollingStatsDataPoint[],
  singleMetric: SingleRollingMetric | null,
  isSingleMasked: boolean,
  isPnlMasked: boolean,
  displayRMultiples: boolean
) => {
  const displayChartData = chartData.map((point) => {
    const value = singleMetric
      ? singleMetricValue(point, singleMetric, displayRMultiples)
      : null;
    const displayValue = isSingleMasked
      ? 1
      : value !== null && Number.isFinite(value)
        ? value
        : null;
    return isPnlMasked
      ? {
          ...point,
          displayAvgWin: 1,
          displayAvgLoss: -1,
          displayAvgWinR: 1,
          displayAvgLossR: -1,
          displayValue,
        }
      : {
          ...point,
          displayAvgWin: point.avgWin,
          displayAvgLoss: point.avgLoss,
          displayAvgWinR: point.avgWinR,
          displayAvgLossR: point.avgLossR,
          displayValue,
        };
  });
  const yAxisValues = singleMetric
    ? displayChartData.flatMap((point) =>
        point.displayValue !== null && Number.isFinite(point.displayValue)
          ? [point.displayValue]
          : []
      )
    : collectVisibleYAxisValues(displayChartData, displayRMultiples);
  
  const yAxisConfig =
    singleMetric === 'winRate' && !isSingleMasked
      ? generateNiceAxis(0, 1, 5, false)
      : buildRollingStatsYAxis(yAxisValues);

  return { displayChartData, yAxisConfig };
};

interface SingleLineStroke {
  stroke: string;
  
  legendColor: string;
  
  dotFill: string;
  name: string;
  
  transitionOffset?: number;
}


const singleLineStroke = (
  points: ReadonlyArray<{ displayValue: number | null }>,
  metric: SingleRollingMetric,
  masked: boolean,
  gradientId: string
): SingleLineStroke => {
  const base = {
    dotFill: masked ? NEUTRAL_LINE_COLOR : 'var(--interactive-accent)',
    name: SINGLE_METRIC_LABELS[metric](),
  };
  const solid = (color: string): SingleLineStroke => ({
    ...base,
    stroke: color,
    legendColor: color,
  });
  if (masked || !SIGNED_SINGLE_METRICS.has(metric)) {
    return solid(NEUTRAL_LINE_COLOR);
  }
  let min = Infinity;
  let max = -Infinity;
  for (const { displayValue } of points) {
    if (displayValue === null || !Number.isFinite(displayValue)) continue;
    min = Math.min(min, displayValue);
    max = Math.max(max, displayValue);
  }
  if (min >= 0 || !Number.isFinite(min)) return solid(POSITIVE_LINE_COLOR);
  if (max <= 0) return solid(NEGATIVE_LINE_COLOR);
  return {
    ...base,
    stroke: `url(#${gradientId})`,
    legendColor: NEUTRAL_LINE_COLOR,
    transitionOffset: (max / (max - min)) * 100,
  };
};

interface RollingStatsLineChartProps {
  chartData: RollingStatsDataPoint[];
  singleMetric: SingleRollingMetric | null;
  unit: RollingWindow['unit'];
  isSingleMasked: boolean;
  isPnlMasked: boolean;
  displayRMultiples: boolean;
  currencyCode: string;
  formatValue: DisplayValueFormatter;
  formatSingle: (value: number, point?: RollingStatsDataPoint) => string;
  formatYAxisTick: (value: number) => string;
}


const RollingStatsLineChart: React.FC<RollingStatsLineChartProps> = ({
  chartData,
  singleMetric,
  unit,
  isSingleMasked,
  isPnlMasked,
  displayRMultiples,
  currencyCode,
  formatValue,
  formatSingle,
  formatYAxisTick,
}) => {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const { displayChartData, yAxisConfig } = buildRollingStatsDisplay(
    chartData,
    singleMetric,
    isSingleMasked,
    isPnlMasked,
    displayRMultiples
  );
  const gradientId = `journalit-rolling-stats-${React.useId().replace(/:/g, '')}`;
  const singleLine = singleMetric
    ? singleLineStroke(
        displayChartData,
        singleMetric,
        isSingleMasked,
        gradientId
      )
    : null;
  const winColor = isPnlMasked ? NEUTRAL_LINE_COLOR : POSITIVE_LINE_COLOR;
  const lossColor = isPnlMasked ? NEUTRAL_LINE_COLOR : NEGATIVE_LINE_COLOR;

  return (
    <div className="journalit-chart-widget__body">
      <ChartBase
        height="100%"
        width="100%"
        chartRef={chartRef}
        skeletonVariant="line"
      >
        <LineChart
          data={displayChartData}
          margin={{ top: 6, right: 20, left: 0, bottom: 10 }}
        >
          {singleLine?.transitionOffset !== undefined && (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <SignedStrokeGradientStops
                  transitionOffset={singleLine.transitionOffset}
                  positiveColor={POSITIVE_LINE_COLOR}
                  negativeColor={NEGATIVE_LINE_COLOR}
                />
              </linearGradient>
            </defs>
          )}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            verticalCoordinatesGenerator={skipVerticalGridCoordinates}
            stroke="var(--background-modifier-border)"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="label"
            height={16}
            tickMargin={4}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatYAxisTick}
            width={calculateYAxisWidth(yAxisConfig.ticks, formatYAxisTick)}
            tickLine={true}
            tickMargin={5}
            domain={yAxisConfig.domain}
            ticks={yAxisConfig.ticks}
          />
          <RechartsPortalTooltip
            chartRef={chartRef}
            allowEmptyPayload
            cursor={{
              stroke: 'var(--interactive-accent)',
              strokeWidth: 1,
              strokeDasharray: '3 3',
            }}
          >
            {(props: TooltipContentLike<RollingStatsDataPoint>) => (
              <RollingStatsTooltip
                {...props}
                chartData={chartData}
                unit={unit}
                singleMetric={singleMetric}
                isSingleMasked={isSingleMasked}
                isPnlMasked={isPnlMasked}
                displayRMultiples={displayRMultiples}
                currencyCode={currencyCode}
                formatSingle={formatSingle}
                formatValue={formatValue}
              />
            )}
          </RechartsPortalTooltip>
          <Legend
            content={(props: CustomLegendProps) =>
              renderRollingStatsLegend(props, singleLine?.legendColor)
            }
          />
          {yAxisConfig.domain[0] <= 0 && yAxisConfig.domain[1] >= 0 && (
            <ReferenceLine
              y={0}
              stroke="var(--text-normal)"
              strokeOpacity={0.3}
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          )}
          {singleLine ? (
            <Line
              type="monotone"
              dataKey="displayValue"
              stroke={singleLine.stroke}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 1,
                stroke: 'var(--background-primary)',
                fill: singleLine.dotFill,
              }}
              name={singleLine.name}
              connectNulls={false}
              animationDuration={500}
              animationEasing="ease-out"
            />
          ) : null}
          {singleMetric ? null : (
            <Line
              type="monotone"
              dataKey={displayRMultiples ? 'displayAvgWinR' : 'displayAvgWin'}
              stroke={winColor}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 1,
                stroke: 'var(--background-primary)',
                fill: winColor,
              }}
              name={t('dashboard.widgets.rollingStats.avgWin')}
              connectNulls={false}
              animationDuration={500}
              animationEasing="ease-out"
            />
          )}
          {singleMetric ? null : (
            <Line
              type="monotone"
              dataKey={displayRMultiples ? 'displayAvgLossR' : 'displayAvgLoss'}
              stroke={lossColor}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 1,
                stroke: 'var(--background-primary)',
                fill: lossColor,
              }}
              name={t('dashboard.widgets.rollingStats.avgLoss')}
              connectNulls={false}
              animationDuration={500}
              animationEasing="ease-out"
            />
          )}
        </LineChart>
      </ChartBase>
    </div>
  );
};

interface RollingStatsChartProps extends BaseWidgetProps {
  
  metric: RollingMetric;
}


export const RollingStatsChart = React.memo<RollingStatsChartProps>(
  ({ dateFormat, metric }) => {
    const plugin = usePlugin();
    const [rollingWindow, setRollingWindow] =
      useState<RollingWindow>(INITIAL_WINDOW);
    const singleMetric = metric === 'avgWinLoss' ? null : metric;
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
    const displayRMultiples =
      plugin?.settings?.trade?.displayRMultiples ?? false;
    const { formatValue, shouldMask } = useDisplayFormatter();
    const isPnlMasked = shouldMask('pnl');
    const isSingleMasked = singleMetric
      ? shouldMask(SINGLE_METRIC_KINDS[singleMetric])
      : false;

    return (
      <BaseWidget dateFormat={dateFormat} skeletonType="line-chart">
        {(data, userDateFormat, filters, compare) => {
          
          const currencyOverride = data.metrics.isMultiCurrency
            ? data.metrics.conversionBaseCurrency
            : undefined;

          const activeCurrency = currencyOverride || data.currency;

          const statsFor = (
            source: Pick<DashboardData, 'trades' | 'realizedEventTrades'>
          ) =>
            calculateRollingWindowStats(
              source,
              rollingWindow,
              rollingWindow.unit === 'trades'
                ? rollingWindow.size
                : SESSION_POINTS_SHOWN,
              defaultRiskAmount,
              plugin?.settings?.trade,
              getAnalyticsDateBasis(plugin?.settings),
              plugin ?? undefined,
              userDateFormat
            );
          const chartData = statsFor(data);
          const formatSingle = (
            value: number,
            point?: RollingStatsDataPoint
          ): string =>
            singleMetric
              ? formatSingleMetric(singleMetric, value, point, {
                  formatValue,
                  displayRMultiples,
                  currencyCode: activeCurrency,
                })
              : '';
          const formatYAxisTick = (value: number) =>
            !Number.isFinite(value)
              ? ''
              : singleMetric
                ? formatSingle(value)
                : formatRollingStatsYAxisTick(
                    value,
                    displayRMultiples,
                    activeCurrency,
                    formatValue
                  );

          return (
            <div className="journalit-chart-widget">
              <RollingStatsHeader
                metric={metric}
                rollingWindow={rollingWindow}
                onWindowChange={setRollingWindow}
              >
                {!displayRMultiples && (
                  <CurrencyConversionInfo
                    metadata={buildCurrencyConversionMetadata(data.metrics)}
                    trades={data.trades}
                  />
                )}
              </RollingStatsHeader>

              {compare ? (
                <RollingStatsCompare
                  a={chartData}
                  b={statsFor(compare.data)}
                  metric={singleMetric}
                  unit={rollingWindow.unit}
                  displayRMultiples={displayRMultiples}
                  formatValue={formatYAxisTick}
                  masked={singleMetric ? isSingleMasked : isPnlMasked}
                  aFilters={filters}
                  bFilters={compare.filters}
                />
              ) : (
                <RollingStatsLineChart
                  chartData={chartData}
                  singleMetric={singleMetric}
                  unit={rollingWindow.unit}
                  isSingleMasked={isSingleMasked}
                  isPnlMasked={isPnlMasked}
                  displayRMultiples={displayRMultiples}
                  currencyCode={activeCurrency}
                  formatValue={formatValue}
                  formatSingle={formatSingle}
                  formatYAxisTick={formatYAxisTick}
                />
              )}
            </div>
          );
        }}
      </BaseWidget>
    );
  }
);

RollingStatsChart.displayName = 'RollingStatsChart';
