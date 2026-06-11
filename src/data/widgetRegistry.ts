

import type { ReviewTemplateType } from '../types/reviewV2';
import { t } from '../lang/helpers';

export type WidgetCategory =
  | 'charts'
  | 'statistics'
  | 'content'
  | 'tables'
  | 'layout';

export interface WidgetDefinition {
  type: string;
  name: string;
  description: string;
  category: WidgetCategory;
  availableIn: ReviewTemplateType[];
  
  defaultConfig?: Record<string, unknown>;
}

const CATEGORY_ORDER: WidgetCategory[] = [
  'content',
  'charts',
  'statistics',
  'tables',
  'layout',
];

export const CATEGORY_LABELS: Record<WidgetCategory, string> = {
  charts: t('widget.category.charts'),
  statistics: t('widget.category.statistics'),
  content: t('widget.category.content'),
  tables: t('widget.category.tables'),
  layout: t('widget.category.layout'),
};

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  
  
  {
    type: 'goals',
    name: t('widget.goals.name'),
    description: t('widget.goals.description'),
    category: 'content',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'review',
    name: t('widget.review.name'),
    description: t('widget.review.description'),
    category: 'content',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'review-context-fields',
    name: t('widget.review-context-fields.name'),
    description: t('widget.review-context-fields.description'),
    category: 'content',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
    defaultConfig: {
      selectionMode: 'all',
      showInherited: true,
      showLocal: true,
      hideEmpty: false,
    },
  },
  {
    type: 'checklist',
    name: t('widget.checklist.name'),
    description: t('widget.checklist.description'),
    category: 'content',
    availableIn: ['drc', 'weekly'],
  },
  {
    type: 'session-mistakes',
    name: t('widget.session-mistakes.name'),
    description: t('widget.session-mistakes.description'),
    category: 'content',
    availableIn: ['drc'],
  },
  {
    type: 'key-levels',
    name: t('widget.key-levels.name'),
    description: t('widget.key-levels.description'),
    category: 'content',
    availableIn: ['drc', 'weekly', 'monthly'],
  },
  {
    type: 'key-events',
    name: t('widget.key-events.name'),
    description: t('widget.key-events.description'),
    category: 'content',
    availableIn: ['drc', 'weekly'],
  },
  {
    type: 'missed-trades',
    name: t('widget.missed-trades.name'),
    description: t('widget.missed-trades.description'),
    category: 'content',
    availableIn: ['drc', 'weekly'],
  },
  {
    type: 'images',
    name: t('widget.images.name'),
    description: t('widget.images.description'),
    category: 'content',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'previous-trading-day-context',
    name: t('widget.previous-trading-day-context.name'),
    description: t('widget.previous-trading-day-context.description'),
    category: 'content',
    availableIn: ['drc'],
    defaultConfig: {
      fallbackMode: 'nearest-earlier',
    },
  },
  {
    type: 'weekly-drc-context',
    name: t('widget.weekly-drc-context.name'),
    description: t('widget.weekly-drc-context.description'),
    category: 'content',
    availableIn: ['weekly'],
    defaultConfig: {
      dayScope: 'all',
      defaultExpanded: false,
    },
  },
  {
    type: 'mark-reviewed',
    name: t('widget.mark-reviewed.name'),
    description: t('widget.mark-reviewed.description'),
    category: 'content',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },

  
  {
    type: 'pnl-chart',
    name: t('widget.pnl-chart.name'),
    description: t('widget.pnl-chart.description'),
    category: 'charts',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'drawdown-chart',
    name: t('widget.drawdown-chart.name'),
    description: t('widget.drawdown-chart.description'),
    category: 'charts',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'directional-pnl',
    name: t('widget.directional-pnl.name'),
    description: t('widget.directional-pnl.description'),
    category: 'charts',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'directional-drawdown',
    name: t('widget.directional-drawdown.name'),
    description: t('widget.directional-drawdown.description'),
    category: 'charts',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'long-drawdown',
    name: t('widget.long-drawdown.name'),
    description: t('widget.long-drawdown.description'),
    category: 'charts',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'short-drawdown',
    name: t('widget.short-drawdown.name'),
    description: t('widget.short-drawdown.description'),
    category: 'charts',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  
  {
    type: 'trades-chart',
    name: t('widget.trades-chart.name'),
    description: t('widget.trades-chart.description'),
    category: 'charts',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
    defaultConfig: { period: 'trades' },
  },
  {
    type: 'trades-chart',
    name: t('widget.trades-chart-daily.name'),
    description: t('widget.trades-chart-daily.description'),
    category: 'charts',
    availableIn: ['weekly', 'monthly', 'quarterly', 'yearly'],
    defaultConfig: { period: 'daily' },
  },
  {
    type: 'trades-chart',
    name: t('widget.trades-chart-weekly.name'),
    description: t('widget.trades-chart-weekly.description'),
    category: 'charts',
    availableIn: ['monthly', 'quarterly', 'yearly'],
    defaultConfig: { period: 'weekly' },
  },
  {
    type: 'trades-chart',
    name: t('widget.trades-chart-monthly.name'),
    description: t('widget.trades-chart-monthly.description'),
    category: 'charts',
    availableIn: ['quarterly', 'yearly'],
    defaultConfig: { period: 'monthly' },
  },
  {
    type: 'trades-chart',
    name: t('widget.trades-chart-quarterly.name'),
    description: t('widget.trades-chart-quarterly.description'),
    category: 'charts',
    availableIn: ['yearly'],
    defaultConfig: { period: 'quarterly' },
  },

  
  {
    type: 'stats',
    name: t('widget.stats.name'),
    description: t('widget.stats.description'),
    category: 'statistics',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'account-breakdown',
    name: t('widget.account-breakdown.name'),
    description: t('widget.account-breakdown.description'),
    category: 'statistics',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },

  {
    type: 'setup-performance',
    name: t('widget.setup-performance.name'),
    description: t('widget.setup-performance.description'),
    category: 'statistics',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  
  {
    type: 'best-worst',
    name: t('widget.best-worst-trades.name'),
    description: t('widget.best-worst-trades.description'),
    category: 'statistics',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
    defaultConfig: { period: 'trades' },
  },
  {
    type: 'best-worst',
    name: t('widget.best-worst-days.name'),
    description: t('widget.best-worst-days.description'),
    category: 'statistics',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
    defaultConfig: { period: 'days' },
  },
  {
    type: 'best-worst',
    name: t('widget.best-worst-weeks.name'),
    description: t('widget.best-worst-weeks.description'),
    category: 'statistics',
    availableIn: ['weekly', 'monthly', 'quarterly', 'yearly'],
    defaultConfig: { period: 'weeks' },
  },
  {
    type: 'best-worst',
    name: t('widget.best-worst-months.name'),
    description: t('widget.best-worst-months.description'),
    category: 'statistics',
    availableIn: ['quarterly', 'yearly'],
    defaultConfig: { period: 'months' },
  },
  {
    type: 'best-worst',
    name: t('widget.best-worst-quarters.name'),
    description: t('widget.best-worst-quarters.description'),
    category: 'statistics',
    availableIn: ['yearly'],
    defaultConfig: { period: 'quarters' },
  },
  {
    type: 'technical-game',
    name: t('widget.technical-game.name'),
    description: t('widget.technical-game.description'),
    category: 'statistics',
    availableIn: ['monthly', 'quarterly', 'yearly'],
    defaultConfig: { pageSize: 5, showRating: true },
  },
  {
    type: 'mental-game',
    name: t('widget.mental-game.name'),
    description: t('widget.mental-game.description'),
    category: 'statistics',
    availableIn: ['monthly', 'quarterly', 'yearly'],
    defaultConfig: { pageSize: 5, showRating: true },
  },
  {
    type: 'demon-tracker',
    name: t('widget.demon-tracker.name'),
    description: t('widget.demon-tracker.description'),
    category: 'statistics',
    availableIn: ['monthly', 'quarterly', 'yearly'],
  },

  
  {
    type: 'trades',
    name: t('widget.trades.name'),
    description: t('widget.trades.description'),
    category: 'tables',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'backtest-trades',
    name: t('widget.backtest-trades.name'),
    description: t('widget.backtest-trades.description'),
    category: 'tables',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  
  {
    type: 'breakdown',
    name: t('widget.breakdown-daily.name'),
    description: t('widget.breakdown-daily.description'),
    category: 'tables',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
    defaultConfig: { period: 'daily' },
  },
  {
    type: 'breakdown',
    name: t('widget.breakdown-weekly.name'),
    description: t('widget.breakdown-weekly.description'),
    category: 'tables',
    availableIn: ['weekly', 'monthly', 'quarterly', 'yearly'],
    defaultConfig: { period: 'weekly' },
  },
  {
    type: 'breakdown',
    name: t('widget.breakdown-monthly.name'),
    description: t('widget.breakdown-monthly.description'),
    category: 'tables',
    availableIn: ['quarterly', 'yearly'],
    defaultConfig: { period: 'monthly' },
  },
  {
    type: 'breakdown',
    name: t('widget.breakdown-quarterly.name'),
    description: t('widget.breakdown-quarterly.description'),
    category: 'tables',
    availableIn: ['yearly'],
    defaultConfig: { period: 'quarterly' },
  },

  
  {
    type: 'markdown-zone',
    name: t('widget.markdown-zone.name'),
    description: t('widget.markdown-zone.description'),
    category: 'layout',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  {
    type: 'markdown-header',
    name: t('widget.markdown-header.name'),
    description: t('widget.markdown-header.description'),
    category: 'layout',
    availableIn: ['drc', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
];


export function getWidgetsForTemplate(
  templateType: ReviewTemplateType
): WidgetDefinition[] {
  return WIDGET_REGISTRY.filter((w) => w.availableIn.includes(templateType));
}


export function getWidgetsByCategory(
  widgets: WidgetDefinition[]
): Map<WidgetCategory, WidgetDefinition[]> {
  const grouped = new Map<WidgetCategory, WidgetDefinition[]>();

  
  for (const category of CATEGORY_ORDER) {
    grouped.set(category, []);
  }

  
  for (const widget of widgets) {
    const categoryWidgets = grouped.get(widget.category);
    if (categoryWidgets) {
      categoryWidgets.push(widget);
    }
  }

  
  for (const category of CATEGORY_ORDER) {
    if (grouped.get(category)?.length === 0) {
      grouped.delete(category);
    }
  }

  return grouped;
}


export function getWidgetByType(type: string): WidgetDefinition | undefined {
  return WIDGET_REGISTRY.find((w) => w.type === type);
}


export function getWidgetByTypeAndConfig(
  type: string,
  config?: Record<string, unknown>
): WidgetDefinition | undefined {
  return WIDGET_REGISTRY.find((w) => {
    if (w.type !== type) return false;
    
    if (w.defaultConfig) {
      if (!config) return false;
      
      return Object.entries(w.defaultConfig).every(
        ([key, val]) => config[key] === val
      );
    }
    
    return !config || Object.keys(config).length === 0;
  });
}


export function getWidgetName(type: string): string {
  const widget = getWidgetByType(type);
  if (widget) return widget.name;
  
  return type
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}


export function getWidgetNameByPlacement(
  type: string,
  config?: Record<string, unknown>
): string {
  const widget = getWidgetByTypeAndConfig(type, config);
  if (widget) return widget.name;
  
  return getWidgetName(type);
}
