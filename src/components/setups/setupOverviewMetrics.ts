import type { TranslationKey } from '../../lang/helpers';
import type { MetricKey, SetupPairMetricKey } from './setupsViewTypes';

interface SetupOverviewMetricOption {
  key: MetricKey;
  labelKey: TranslationKey;
  displayKind: 'count' | 'pnl' | 'percentage' | 'metric' | 'rMultiple';
}

interface SetupPairMetricOption {
  key: SetupPairMetricKey;
  labelKey: TranslationKey;
  displayKind: 'count' | 'pnl' | 'percentage' | 'metric' | 'rMultiple';
}

export const METRIC_OPTIONS: SetupOverviewMetricOption[] = [
  {
    key: 'profitFactor',
    labelKey: 'setups.view.metric.profit-factor',
    displayKind: 'metric',
  },
  {
    key: 'cumulativePnl',
    labelKey: 'setups.view.overview.pnl-chart.dropdown-label',
    displayKind: 'pnl',
  },
  {
    key: 'cumulativeR',
    labelKey: 'setups.view.detail.performance.cumulative-r',
    displayKind: 'rMultiple',
  },
  {
    key: 'expectedValue',
    labelKey: 'setups.view.metric.expected-value',
    displayKind: 'pnl',
  },
  {
    key: 'expectedR',
    labelKey: 'setups.view.metric.expectancy-r',
    displayKind: 'rMultiple',
  },
  {
    key: 'totalPnL',
    labelKey: 'setups.view.metric.net-pnl',
    displayKind: 'pnl',
  },
  {
    key: 'totalR',
    labelKey: 'dashboard.widgets.hourly-performance.metric.total-r',
    displayKind: 'rMultiple',
  },
  {
    key: 'winRate',
    labelKey: 'setups.view.metric.win-rate',
    displayKind: 'percentage',
  },
  {
    key: 'totalTrades',
    labelKey: 'setups.view.metric.trade-count',
    displayKind: 'count',
  },
];

export const SETUP_PAIR_METRIC_OPTIONS: SetupPairMetricOption[] = [
  {
    key: 'profitFactor',
    labelKey: 'setups.view.metric.profit-factor',
    displayKind: 'metric',
  },
  {
    key: 'expectancyR',
    labelKey: 'setups.view.pairs.metric.expectancy',
    displayKind: 'rMultiple',
  },
  {
    key: 'totalR',
    labelKey: 'dashboard.widgets.hourly-performance.metric.total-r',
    displayKind: 'rMultiple',
  },
  {
    key: 'totalPnL',
    labelKey: 'setups.view.metric.net-pnl',
    displayKind: 'pnl',
  },
  {
    key: 'winRate',
    labelKey: 'setups.view.metric.win-rate',
    displayKind: 'percentage',
  },
  {
    key: 'totalTrades',
    labelKey: 'setups.view.metric.trade-count',
    displayKind: 'count',
  },
  {
    key: 'edgeR',
    labelKey: 'setups.view.pairs.metric.edge',
    displayKind: 'rMultiple',
  },
];

export const OVERVIEW_R_METRIC_KEYS = new Set<MetricKey>([
  'cumulativeR',
  'expectedR',
  'totalR',
]);

export const PAIR_R_METRIC_KEYS = new Set<SetupPairMetricKey>([
  'edgeR',
  'expectancyR',
  'totalR',
]);

export const SETUP_PAIR_MIN_TRADES = 5;
