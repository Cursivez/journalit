

export interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'analysis' | 'journal';
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
    name: 'Cumulative P&L',
    description: 'Line chart showing cumulative P&L over time',
    category: 'performance',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'longPnLChart',
    name: 'Long P&L',
    description: 'Cumulative P&L curve for long closed trades only',
    category: 'performance',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'shortPnLChart',
    name: 'Short P&L',
    description: 'Cumulative P&L curve for short closed trades only',
    category: 'performance',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'performanceCalendar',
    name: 'Performance Calendar',
    description: 'Calendar view showing daily performance',
    category: 'performance',
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'dailyPerformance',
    name: 'Daily Performance',
    description: 'Bar chart showing P&L for each trading day',
    category: 'performance',
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'tradesChart',
    name: 'Trades Chart',
    description: 'Bar chart showing P&L for each individual trade',
    category: 'performance',
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'weekdayPerformance',
    name: 'Weekday Performance',
    description: 'Bar chart showing performance for each day of the week',
    category: 'performance',
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'hourlyPerformance',
    name: 'Hourly Performance',
    description: 'Bar chart showing P&L for each hour of the day',
    category: 'performance',
    minSize: { w: 4, h: 3 },
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'drawdownChart',
    name: 'Drawdown Chart',
    description:
      'Closed-trade drawdown amount from the prior realized P&L high',
    category: 'performance',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'longDrawdownChart',
    name: 'Long Realized Drawdown',
    description: 'Closed-trade drawdown amount for long trades only',
    category: 'performance',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'shortDrawdownChart',
    name: 'Short Realized Drawdown',
    description: 'Closed-trade drawdown amount for short trades only',
    category: 'performance',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'recentTrades',
    name: 'Recent Trades',
    description: 'Shows the 10 most recent trades with details',
    category: 'journal',
    minSize: { w: 1, h: 3 },
    defaultSize: { w: 6, h: 4 },
    maxSize: { w: 12, h: 7 },
  },
  {
    id: 'rollingWinRate',
    name: 'Rolling Win/Loss Ratio',
    description:
      'Shows the ratio of average wins to average losses over a rolling period',
    category: 'analysis',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 8 },
  },
  {
    id: 'rollingStats',
    name: 'Rolling Avg Win/Loss',
    description: 'Shows average win and loss over a rolling period',
    category: 'analysis',
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
