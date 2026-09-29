

import { t } from '../../../../lang/helpers';

export type DashboardWidgetCategory = 'performance' | 'breakdowns' | 'risk';

export interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  
  category: DashboardWidgetCategory;
  minSize: { w: number; h: number };
  defaultSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
}


const LEGACY_DIRECTIONAL_DRAWDOWN_WIDGET_ID = 'directionalDrawdownChart';
const DIRECTIONAL_DRAWDOWN_REPLACEMENT_WIDGET_IDS = [
  'longDrawdownChart',
  'shortDrawdownChart',
];

export const AVAILABLE_WIDGETS: WidgetDefinition[] = [
  {
    id: 'pnlChart',
    name: t('widget.pnlChart.name'),
    description: t('widget.pnlChart.description'),
    category: 'performance',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'longPnLChart',
    name: t('widget.longPnLChart.name'),
    description: t('widget.longPnLChart.description'),
    category: 'performance',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'shortPnLChart',
    name: t('widget.shortPnLChart.name'),
    description: t('widget.shortPnLChart.description'),
    category: 'performance',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'performanceCalendar',
    name: t('widget.performanceCalendar.name'),
    description: t('widget.performanceCalendar.description'),
    category: 'performance',
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'dailyPerformance',
    name: t('widget.dailyPerformance.name'),
    description: t('widget.dailyPerformance.description'),
    category: 'performance',
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'tradesChart',
    name: t('widget.tradesChart.name'),
    description: t('widget.tradesChart.description'),
    category: 'performance',
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'weekdayPerformance',
    name: t('widget.weekdayPerformance.name'),
    description: t('widget.weekdayPerformance.description'),
    category: 'breakdowns',
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'hourlyPerformance',
    name: t('widget.hourlyPerformance.name'),
    description: t('widget.hourlyPerformance.description'),
    category: 'breakdowns',
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'tickerPerformance',
    name: t('widget.tickerPerformance.name'),
    description: t('widget.tickerPerformance.description'),
    category: 'breakdowns',
    minSize: { w: 6, h: 8 },
    defaultSize: { w: 6, h: 10 },
  },
  {
    id: 'setupPerformance',
    name: t('dashboard.widgets.setup-performance.title'),
    description: t('dashboard.widgets.setup-performance.description'),
    category: 'breakdowns',
    minSize: { w: 6, h: 8 },
    defaultSize: { w: 6, h: 10 },
  },
  {
    id: 'tagPerformance',
    name: t('dashboard.widgets.tag-performance.title'),
    description: t('dashboard.widgets.tag-performance.description'),
    category: 'breakdowns',
    minSize: { w: 6, h: 8 },
    defaultSize: { w: 6, h: 10 },
  },
  {
    id: 'drawdownChart',
    name: t('widget.drawdownChart.name'),
    description: t('widget.drawdownChart.description'),
    category: 'risk',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'longDrawdownChart',
    name: t('widget.longDrawdownChart.name'),
    description: t('widget.longDrawdownChart.description'),
    category: 'risk',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'shortDrawdownChart',
    name: t('widget.shortDrawdownChart.name'),
    description: t('widget.shortDrawdownChart.description'),
    category: 'risk',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'recentTrades',
    name: t('widget.recentTrades.name'),
    description: t('widget.recentTrades.description'),
    category: 'performance',
    minSize: { w: 1, h: 3 },
    defaultSize: { w: 6, h: 4 },
    maxSize: { w: 12, h: 7 },
  },
  {
    id: 'mfeScatter',
    name: t('widget.mfeScatter.name'),
    description: t('widget.mfeScatter.description'),
    category: 'risk',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'rollingWinRate',
    name: t('widget.rollingWinRate.name'),
    description: t('widget.rollingWinRate.description'),
    category: 'risk',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'rollingStats',
    name: t('widget.rollingStats.name'),
    description: t('widget.rollingStats.description'),
    category: 'risk',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
];

const AVAILABLE_WIDGET_IDS = new Set(
  AVAILABLE_WIDGETS.map((widget) => widget.id)
);


export const normalizeDashboardWidgetIds = (widgetIds: string[]): string[] => {
  const normalizedWidgetIds: string[] = [];
  const seenWidgetIds = new Set<string>();

  const addWidgetId = (widgetId: string) => {
    if (!AVAILABLE_WIDGET_IDS.has(widgetId) || seenWidgetIds.has(widgetId)) {
      return;
    }

    seenWidgetIds.add(widgetId);
    normalizedWidgetIds.push(widgetId);
  };

  widgetIds.forEach((widgetId) => {
    if (widgetId === LEGACY_DIRECTIONAL_DRAWDOWN_WIDGET_ID) {
      DIRECTIONAL_DRAWDOWN_REPLACEMENT_WIDGET_IDS.forEach(addWidgetId);
      return;
    }

    addWidgetId(widgetId);
  });

  return normalizedWidgetIds;
};
