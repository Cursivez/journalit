

import type { WidgetPlacement } from '../../types/reviewV2';
import { t } from '../../lang/helpers';

export interface WidgetOptionSelect {
  kind: 'select';
  key: string;
  label: string;
  
  options: Array<{ value: string | number | null; label: string }>;
  defaultValue: string | number | null;
}

export interface WidgetOptionToggle {
  kind: 'toggle';
  key: string;
  label: string;
  defaultValue: boolean;
}


export interface WidgetOptionPair {
  kind: 'pair';
  label: string;
  
  first: { key: string; label: string };
  second: { key: string; label: string };
  bothLabel: string;
}

type WidgetOptionControl =
  | WidgetOptionSelect
  | WidgetOptionToggle
  | WidgetOptionPair;

const toggle = (
  key: string,
  label: string,
  defaultValue = true
): WidgetOptionToggle => ({ kind: 'toggle', key, label, defaultValue });

type WidgetLayoutOption = 'carousel' | 'stacked' | 'side-by-side';

const getLayoutLabel = (layout: WidgetLayoutOption): string => {
  switch (layout) {
    case 'carousel':
      return t('templateEditor.widget.option.layout.carousel');
    case 'stacked':
      return t('templateEditor.widget.option.layout.stacked');
    case 'side-by-side':
      return t('templateEditor.widget.option.layout.side-by-side');
  }
};

const layoutSelect = (
  values: WidgetLayoutOption[],
  defaultValue: WidgetLayoutOption
): WidgetOptionSelect => ({
  kind: 'select',
  key: 'layout',
  label: t('templateEditor.widget.option.layout'),
  options: values.map((value) => ({ value, label: getLayoutLabel(value) })),
  defaultValue,
});

const tradeTableControls = (): WidgetOptionControl[] => [
  {
    kind: 'select',
    key: 'pageSize',
    label: t('templateEditor.widget.option.trades-per-page'),
    options: [5, 10, 20, 50].map((size) => ({
      value: size,
      label: String(size),
    })),
    defaultValue: 20,
  },
  toggle('showOpenTrades', t('templateEditor.widget.option.show-open-trades')),
];

const directionalControls = (): WidgetOptionControl[] => [
  {
    kind: 'pair',
    label: t('templateEditor.widget.option.show'),
    first: {
      key: 'showLong',
      label: t('templateEditor.widget.option.long-only'),
    },
    second: {
      key: 'showShort',
      label: t('templateEditor.widget.option.short-only'),
    },
    bothLabel: t('templateEditor.widget.option.long-and-short'),
  },
  layoutSelect(['stacked', 'side-by-side'], 'stacked'),
];


const groupedPerformanceControls = (
  defaultTopN: number
): WidgetOptionControl[] => [
  {
    kind: 'select',
    key: 'topN',
    label: t('templateEditor.widget.option.rows'),
    options: [
      { value: 0, label: t('common.all') },
      ...[5, 10, 15, 20].map((rows) => ({ value: rows, label: String(rows) })),
    ],
    defaultValue: defaultTopN,
  },
  {
    kind: 'select',
    key: 'sortBy',
    label: t('templateEditor.widget.option.sort-by'),
    options: [
      { value: 'pnl', label: t('chart.label.pnl') },
      { value: 'winRate', label: t('setups.view.metric.win-rate') },
      { value: 'tradeCount', label: t('setups.view.metric.trade-count') },
    ],
    defaultValue: 'pnl',
  },
  {
    kind: 'pair',
    label: t('templateEditor.widget.option.show'),
    first: {
      key: 'showChart',
      label: t('templateEditor.widget.option.chart-only'),
    },
    second: {
      key: 'showTable',
      label: t('templateEditor.widget.option.table-only'),
    },
    bothLabel: t('templateEditor.widget.option.chart-and-table'),
  },
];

export function getWidgetOptionControls(
  widget: WidgetPlacement
): WidgetOptionControl[] {
  switch (widget.type) {
    case 'images':
      return [
        {
          kind: 'select',
          key: 'maxImages',
          label: t('templateEditor.widget.option.max-images'),
          options: [
            { value: null, label: t('templateEditor.widget.option.no-limit') },
            ...[1, 2, 3, 4, 5, 6, 8, 10].map((count) => ({
              value: count,
              label: String(count),
            })),
          ],
          defaultValue: null,
        },
        layoutSelect(['carousel', 'stacked'], 'carousel'),
        toggle('showUploader', t('templateEditor.widget.option.show-uploader')),
      ];
    case 'trades':
    case 'backtest-trades':
      return tradeTableControls();
    case 'stats':
      return [
        {
          kind: 'select',
          key: 'columns',
          label: t('templateEditor.widget.option.columns'),
          options: [2, 3, 4].map((columns) => ({
            value: columns,
            label: String(columns),
          })),
          defaultValue: 4,
        },
      ];
    case 'directional-pnl':
    case 'directional-drawdown':
      return directionalControls();
    case 'setup-performance':
      return groupedPerformanceControls(0);
    case 'tag-performance':
      return groupedPerformanceControls(10);
    case 'technical-game':
    case 'mental-game':
      return [
        {
          kind: 'select',
          key: 'pageSize',
          label: t('templateEditor.widget.page-size'),
          options: [5, 10, 15, 20].map((size) => ({
            value: size,
            label: String(size),
          })),
          defaultValue: 5,
        },
        toggle('showRating', t('templateEditor.widget.show-rating-column')),
      ];
    case 'best-worst': {
      
      const isTrades = (widget.config?.period ?? 'trades') === 'trades';
      return [
        {
          kind: 'pair',
          label: t('templateEditor.widget.option.show'),
          first: {
            key: 'showBest',
            label: t('templateEditor.widget.option.best-only'),
          },
          second: {
            key: 'showWorst',
            label: t('templateEditor.widget.option.worst-only'),
          },
          bothLabel: t('templateEditor.widget.option.best-and-worst'),
        },
        ...(isTrades
          ? [
              toggle(
                'showDuration',
                t('templateEditor.widget.option.show-duration')
              ),
              toggle(
                'showSetups',
                t('templateEditor.widget.option.show-setups')
              ),
              toggle(
                'showMistakes',
                t('templateEditor.widget.option.show-mistakes')
              ),
            ]
          : []),
      ];
    }
    default:
      return [];
  }
}
