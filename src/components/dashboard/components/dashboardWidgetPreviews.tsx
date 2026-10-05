

import React from 'react';
import { t } from '../../../lang/helpers';
import type { StatDelta } from '../../../utils/previousPeriodDelta';
import {
  ChartFrame,
  HBarChart,
  Mini,
  PlotBars,
  PlotLine,
  PlotScatter,
  toneClass,
  type PreviewTone,
} from '../../shared/widgetDrawer/previewPrimitives';
import { MetricCard } from './TopSection/MetricCard';
import type { MetricDefinition } from './TopSection/types';
import { AVAILABLE_WIDGETS } from './BottomSection/types';
import {
  previewCalendarWeekday,
  previewDateTick,
  previewDayLabel,
} from '../../shared/widgetDrawer/previewDateLabels';

const widgetName = (id: string): string =>
  AVAILABLE_WIDGETS.find((widget) => widget.id === id)?.name ?? id;


const dateTicks = (): string[] => [
  previewDateTick(27, 7),
  previewDateTick(3, 8),
  previewDateTick(10, 8),
  previewDateTick(17, 8),
  previewDateTick(25, 8),
];

const EQUITY = [
  0, 0.1, 0.2, 0.9, 1.1, 1.6, 2.4, 3, 3.1, 3.3, 3.9, 4.4, 5.6, 5.8, 6.4, 7, 7.6,
  8.9, 9, 10.6, 11, 12.1, 11.6, 12.3, 11.7,
];
const DRAWDOWN = [
  0, -0.2, 0, -0.5, 0, -0.1, 0, -1.7, 0, -0.3, 0, -1, 0, -0.9, 0, 0, -0.4, 0,
  -9, -3.5, -5.2, -14.2, -8, 0, -8.8,
];

const lineChart = (
  id: string,
  values: number[],
  min: number,
  max: number,
  yLabels: string[],
  tone: PreviewTone,
  options: { area?: boolean; baselineAt?: number; control?: string } = {}
) => (
  <ChartFrame
    title={widgetName(id)}
    control={options.control}
    yLabels={yLabels}
    xLabels={dateTicks()}
  >
    <PlotLine
      values={values}
      min={min}
      max={max}
      tone={tone}
      area={options.area ?? true}
      baselineAt={options.baselineAt}
    />
  </ChartFrame>
);

const CALENDAR_CELLS: Array<[string, number]> = [
  ['3', 0],
  ['4', 0],
  ['5', 0],
  ['6', 0],
  ['7', 0],
  ['10', 0],
  ['11', 45],
  ['12', 0],
  ['13', 14],
  ['14', 0],
  ['17', -25],
  ['18', 0],
  ['19', 62],
  ['20', 0],
  ['21', 18],
  ['24', 0],
  ['25', 31],
  ['26', 45],
  ['27', 14],
  ['28', -25],
];

const CalendarPreview: React.FC = () => (
  <Mini className="journalit-wpd-calendar">
    <div className="journalit-wpd-calendar-head">
      <span>←</span>
      <span className="journalit-wpd-strong">
        {`${t('calendar.month.august').slice(0, 3)} · Q3 2026`.toLocaleUpperCase()}
      </span>
      <span>→</span>
    </div>
    <div className="journalit-wpd-calendar-grid">
      {[1, 2, 3, 4, 5].map((weekday) => (
        <span key={weekday} className="journalit-wpd-calendar-dow">
          {previewCalendarWeekday(weekday).toLocaleUpperCase()}
        </span>
      ))}
      <span className="journalit-wpd-calendar-pill">{t('calendar.pnl')}</span>
      {CALENDAR_CELLS.map(([day, pnl], index) => (
        <React.Fragment key={day}>
          <span
            className={`journalit-wpd-calendar-cell${pnl > 0 ? ' journalit-wpd-calendar-cell--pos' : ''}${pnl < 0 ? ' journalit-wpd-calendar-cell--neg' : ''}`}
          >
            <span>{day}</span>
            {pnl !== 0 && (
              <span className="journalit-wpd-calendar-value">
                {pnl > 0 ? `$${pnl}` : `-$${Math.abs(pnl)}`}
              </span>
            )}
          </span>
          {index % 5 === 4 && (
            <span className="journalit-wpd-calendar-cell journalit-wpd-calendar-week">
              <span>W{32 + Math.floor(index / 5)}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  </Mini>
);

const RecentTradesPreview: React.FC = () => (
  <Mini className="journalit-wpd-table">
    <div className="journalit-wpd-table-row journalit-wpd-table-head">
      <span>{t('tradelog.column.date')}</span>
      <span>{t('tradelog.column.ticker')}</span>
      <span>{t('tradelog.column.direction')}</span>
      <span>{t('tradelog.column.pnl')}</span>
    </div>
    {(
      [
        ['25/09/26', 'MSFT', 'short', 184.2],
        ['25/09/26', 'MNQ', 'short', -96.5],
        ['25/09/26', 'AAPL', 'long', 312.75],
        ['24/09/26', 'MNQ', 'long', 420],
        ['24/09/26', 'MES', 'long', -140.25],
        ['24/09/26', 'MNQ', 'short', 96.1],
      ] as const
    ).map(([date, ticker, direction, pnl]) => (
      <div key={`${date}-${ticker}-${pnl}`} className="journalit-wpd-table-row">
        <span>{date}</span>
        <span className="journalit-wpd-strong">{ticker}</span>
        <span>{t(`form.field.direction.${direction}`)}</span>
        <span className={toneClass(pnl >= 0 ? 'pos' : 'neg')}>
          {pnl >= 0 ? `$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`}
        </span>
      </div>
    ))}
  </Mini>
);

export const DASHBOARD_WIDGET_PREVIEWS: Record<string, () => React.ReactNode> =
  {
    pnlChart: () =>
      lineChart(
        'pnlChart',
        EQUITY,
        0,
        14,
        ['$14k', '$10k', '$6k', '$2k'],
        'pos'
      ),
    longPnLChart: () =>
      lineChart(
        'longPnLChart',
        EQUITY.map((value, index) => value * 0.6 + Math.sin(index) * 0.3),
        0,
        8,
        ['$8k', '$6k', '$4k', '$2k', '$0'],
        'pos'
      ),
    shortPnLChart: () =>
      lineChart(
        'shortPnLChart',
        [
          0, 0.2, 0.1, -0.4, -0.2, 0.3, 0.8, 0.6, 1.1, 1.6, 1.4, 1.9, 2.4, 2.2,
          2.8, 3.1, 2.9, 3.4, 3.9, 4.2,
        ],
        -1,
        5,
        ['$5k', '$3k', '$1k', '-$1k'],
        'pos',
        { baselineAt: 0 }
      ),
    performanceCalendar: () => <CalendarPreview />,
    dailyPerformance: () => (
      <ChartFrame
        title={widgetName('dailyPerformance')}
        control="20D"
        yLabels={['$2,000', '$1,000', '$0', '-$500']}
        xLabels={['01/09', '07/09', '13/09', '19/09', '25/09']}
      >
        <PlotBars
          values={[
            0.1, 0.1, 0.1, 0.3, 0.5, 0.5, 0.6, 0.9, 0.2, 0.9, 0.9, 0.5, 1.1,
            1.3, 0.9, 1.7, 1.2, 0.1, -0.4, 0.1,
          ]}
          min={-0.5}
          max={2}
        />
      </ChartFrame>
    ),
    tradesChart: () => (
      <ChartFrame
        title={widgetName('tradesChart')}
        control="50"
        yLabels={['$1,000', '$500', '$0', '-$500', '-$1,000']}
        xLabels={['#2', '#14', '#26', '#38', '#50']}
      >
        <PlotBars
          values={[
            0.1, 0.1, -0.1, 0.6, 0.1, 0.5, -0.1, 0.4, -0.1, 0.65, -0.1, -0.1,
            0.4, 0.45, 0.55, 0.1, -0.1, 0.1, -0.1, 0.55, 0.5, 0.6, 0.1, 0.1,
            0.1, 0.1, 0.3, 0.1, 0.35, 0.6, -0.1, 0.45, -0.1, -0.1, -0.9, 0.55,
            -0.1, -0.15, -0.1, -0.9, -0.1, 0.65, -0.1, 0.5, -0.1, 0.55, -0.9,
            0.1, 0.1,
          ]}
          min={-1}
          max={1}
          gap={0.25}
        />
      </ChartFrame>
    ),
    weekdayPerformance: () => (
      <ChartFrame
        title={widgetName('weekdayPerformance')}
        yLabels={['$3,500', '$2,500', '$1,500', '$500']}
        xLabels={[1, 2, 3, 4, 5].map(previewDayLabel)}
      >
        <PlotBars
          values={[3.2, 2.6, 2.3, 1.5, 2.5]}
          min={0}
          max={3.5}
          gap={0.18}
        />
      </ChartFrame>
    ),
    hourlyPerformance: () => (
      <ChartFrame
        title={widgetName('hourlyPerformance')}
        yLabels={['$5,000', '$3,000', '$1,000', '$0']}
        xLabels={['00:00', '06:00', '12:00', '18:00']}
      >
        <PlotBars
          values={[
            0, 0, 0, 0, 0, 0, 0, 0, 0, 4.6, 4.8, 2.3, 0.4, 0, -0.3, 0.2, 0, 0,
            0, 0, 0, 0, 0, 0,
          ]}
          min={-0.5}
          max={5}
          gap={0.2}
        />
      </ChartFrame>
    ),
    tickerPerformance: () => (
      <HBarChart
        title={widgetName('tickerPerformance')}
        rows={[
          { category: 'MNQ', value: 11.4 },
          { category: 'MES', value: 3.1 },
          { category: 'AAPL', value: 1.8 },
          { category: 'MSFT', value: -0.9 },
        ]}
        xLabels={['$0', '$4,000', '$8,000', '$12,000']}
      />
    ),
    setupPerformance: () => (
      <HBarChart
        title={widgetName('setupPerformance')}
        rows={[
          { category: 'Opening Range B…', value: 3.6 },
          { category: 'Range Reversal', value: 3.1 },
          { category: 'Failed Breakout', value: 2.8 },
          { category: 'Trend Pullback', value: 2.3 },
        ]}
        xLabels={['$0', '$1,000', '$2,000', '$3,000', '$4,000']}
      />
    ),
    tagPerformance: () => (
      <HBarChart
        title={widgetName('tagPerformance')}
        rows={[
          { category: 'A+ Setup', value: 4.2 },
          { category: 'Patient Entry', value: 2.6 },
          { category: 'Late Entry', value: -0.8 },
          { category: 'FOMO', value: -1.9 },
        ]}
        xLabels={['-$2,000', '$0', '$2,000', '$4,000']}
      />
    ),
    drawdownChart: () =>
      lineChart(
        'drawdownChart',
        DRAWDOWN,
        -16,
        0,
        ['$0', '-$400', '-$800', '-$1,200', '-$1,600'],
        'neg',
        { baselineAt: 0 }
      ),
    longDrawdownChart: () =>
      lineChart(
        'longDrawdownChart',
        DRAWDOWN.map((value, index) => (index % 3 === 0 ? value * 0.4 : 0)),
        -7,
        0,
        ['$0', '-$10', '-$20', '-$30'],
        'neg',
        { baselineAt: 0 }
      ),
    shortDrawdownChart: () =>
      lineChart(
        'shortDrawdownChart',
        DRAWDOWN.map((value, index) => (index % 2 === 0 ? value * 0.6 : 0)),
        -9,
        0,
        ['$0', '-$200', '-$400', '-$600'],
        'neg',
        { baselineAt: 0 }
      ),
    recentTrades: () => <RecentTradesPreview />,
    mfeScatter: () => (
      <ChartFrame
        title={widgetName('mfeScatter')}
        legend={[
          { label: t('tradelog.filter.losers'), tone: 'neg' },
          { label: t('tradelog.filter.winners'), tone: 'pos' },
        ]}
        yLabels={['$1,000', '$500', '$0', '-$500', '-$1,000']}
        xLabels={['$0', '$200', '$400', '$600', '$800']}
      >
        <PlotScatter
          zeroY={30}
          points={[
            [1, 29.5, 'pos'],
            [2, 29, 'pos'],
            [3, 28.8, 'pos'],
            [4, 28.4, 'pos'],
            [5, 28, 'pos'],
            [6, 27.5, 'pos'],
            [2, 30.6, 'neg'],
            [3, 31, 'neg'],
            [7, 32.8, 'neg'],
            [10, 33.5, 'neg'],
            [13, 34.4, 'neg'],
            [40, 24.5, 'pos'],
            [45, 23, 'pos'],
            [52, 21.5, 'pos'],
            [58, 21, 'pos'],
            [65, 20, 'pos'],
            [71, 19.2, 'pos'],
            [76, 18.4, 'pos'],
            [81, 17.6, 'pos'],
            [86, 17, 'pos'],
            [90, 16.5, 'pos'],
            [95, 16, 'pos'],
            [78, 56, 'neg'],
          ]}
        />
      </ChartFrame>
    ),
    rollingWinRate: () => (
      <ChartFrame
        title={widgetName('rollingWinRate')}
        control="20"
        yLabels={['10.0', '7.5', '5.0', '2.5', '0.0']}
        xLabels={['#76', '#80', '#85', '#90', '#95']}
      >
        <PlotLine
          values={[
            8.1, 7, 7.1, 8.8, 9.5, 1.5, 1.3, 1.7, 1.9, 2, 1.2, 1.2, 1.3, 1.5,
            1.8, 2.2, 2.4, 1.9, 1.9, 1.7,
          ]}
          min={0}
          max={10}
          tone="muted"
          baselineAt={1}
        />
      </ChartFrame>
    ),
    rollingStats: () => (
      <ChartFrame
        title={widgetName('rollingStats')}
        control="20"
        legend={[
          { label: t('dashboard.widgets.rollingStats.avgLoss'), tone: 'neg' },
          { label: t('dashboard.widgets.rollingStats.avgWin'), tone: 'pos' },
        ]}
        yLabels={['$500', '$400', '$300', '$200', '$100']}
        xLabels={['#76', '#80', '#85', '#90', '#95']}
      >
        <PlotLine
          values={[
            2.6, 2.6, 2.6, 2.5, 2.3, 2.5, 2.7, 2.9, 3.1, 3.1, 2.8, 2.7, 2.7, 3,
            3.5, 3.8, 4.4, 4.5, 4.5, 4.1,
          ]}
          min={1}
          max={5}
          tone="pos"
        />
        <PlotLine
          values={[
            1.2, 1.1, 1.3, 1.2, 1.1, 1.7, 2, 1.7, 1.6, 1.6, 2.5, 2.2, 2.2, 2, 2,
            1.8, 1.8, 2.4, 2.4, 2.4,
          ]}
          min={1}
          max={5}
          tone="neg"
        />
      </ChartFrame>
    ),
  };

interface MetricSample {
  value: string;
  mainPart?: string;
  decimalPart?: string;
  isPositive?: boolean;
  delta?: StatDelta;
}

const up = (value: string): StatDelta => ({
  value,
  direction: 'up',
  tone: 'green',
});
const down = (value: string, tone: 'green' | 'red' = 'red'): StatDelta => ({
  value,
  direction: 'down',
  tone,
});

const money = (
  main: string,
  decimals: string,
  isPositive: boolean,
  delta: StatDelta
): MetricSample => ({
  value: `${main}${decimals}`,
  mainPart: main,
  decimalPart: decimals,
  isPositive,
  delta,
});


export const DASHBOARD_METRIC_PREVIEWS: Record<string, MetricSample> = {
  netPnL: money('$11,731', '.28', true, up('$1,240.60')),
  winRate: { value: '62.5%', delta: up('4.2%') },
  profitFactor: { value: '1.84', isPositive: true, delta: up('0.21') },
  sharpeRatio: { value: '1.12', isPositive: true, delta: up('0.08') },
  calmarRatio: { value: '1.54', isPositive: true },
  expectancy: money('$57', '.20', true, up('$6.40')),
  maxDrawdown: {
    value: '-8.4%',
    isPositive: false,
    delta: down('1.2%', 'green'),
  },
  bestDay: money('$1,350', '.00', true, up('$210.00')),
  largestWin: money('$920', '.50', true, up('$120.50')),
  largestLoss: money('-$410', '.25', false, down('$60.00', 'green')),
  longestWinStreak: { value: '7', delta: up('2') },
  longestLossStreak: { value: '3', delta: down('1', 'green') },
  numTrades: { value: '128', delta: up('14') },
  numWinTrades: { value: '80', isPositive: true, delta: up('9') },
  numLossTrades: { value: '48', isPositive: false, delta: up('5') },
  avgWin: money('$215', '.40', true, up('$18.20')),
  avgLoss: money('-$118', '.60', false, down('$9.10', 'green')),
  avgRR: { value: '1.82', delta: up('0.14') },
  avgRRRiskBased: { value: '1.6R', delta: up('0.2R') },
  avgHoldTime: { value: '2h 14m', delta: down('12m') },
  timeInDrawdown: { value: '34%', delta: down('6%', 'green') },
  avgRecoveryTime: { value: '3.2d', delta: down('0.8d', 'green') },
  longestDrawdown: { value: '11d', delta: down('2d', 'green') },
  drawdownEpisodes: { value: '6', delta: down('1', 'green') },
  avgWinHoldTime: { value: '1h 48m', delta: up('9m') },
  avgLossHoldTime: { value: '2h 40m', delta: down('15m', 'green') },
  avgWinnerHeat: { value: '0.4R', delta: down('0.1R', 'green') },
  winnerMaeP90: { value: '0.8R', delta: down('0.1R', 'green') },
  winnerMaeMedian: { value: '0.3R', delta: down('0.05R', 'green') },
  avgLossHeat: { value: '0.9R', delta: up('0.1R') },
  winnerAvgMfe: { value: '2.1R', delta: up('0.3R') },
  loserAvgMfe: { value: '0.6R', delta: up('0.1R') },
  winnerMfeP90: { value: '3.4R', delta: up('0.4R') },
  loserMfeP90: { value: '1.2R', delta: up('0.2R') },
};


export const renderMetricPreview = (
  metric: MetricDefinition
): React.ReactNode => {
  const sample = DASHBOARD_METRIC_PREVIEWS[metric.id];
  return (
    <div className="journalit-wpd-metric-row">
      <div className="journalit-wpd-metric-card">
        <MetricCard
          name={metric.name}
          value={sample.value}
          mainPart={sample.mainPart}
          decimalPart={sample.decimalPart}
          isPositive={sample.isPositive}
          previousDelta={sample.delta}
        />
      </div>
    </div>
  );
};
