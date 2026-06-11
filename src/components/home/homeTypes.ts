

import { t } from '../../lang/helpers';

export interface HomeWidgetDefinition {
  id: string;
  name: string;
  description: string;
  category: 'overview' | 'tools' | 'custom';
  minSize: { w: number; h: number };
  defaultSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  
  configurable?: boolean;
}


export const AVAILABLE_HOME_WIDGETS: HomeWidgetDefinition[] = [
  {
    id: 'recentItems',
    name: t('home.widget.recent-items.name'),
    description: t('home.widget.recent-items.description'),
    category: 'overview',
    minSize: { w: 3, h: 4 },
    defaultSize: { w: 4, h: 5 }, 
  },
  {
    id: 'yearHeatmap',
    name: t('home.widget.year-heatmap.name'),
    description: t('home.widget.year-heatmap.description'),
    category: 'overview',
    minSize: { w: 6, h: 4 },
    defaultSize: { w: 8, h: 5 }, 
  },
  {
    id: 'gettingStarted',
    name: t('home.widget.getting-started.name'),
    description: t('home.widget.getting-started.description'),
    category: 'overview',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 6, h: 6 }, 
  },
  {
    id: 'weeklySummary',
    name: t('home.widget.weekly-summary.name'),
    description: t('home.widget.weekly-summary.description'),
    category: 'overview',
    minSize: { w: 5, h: 5 },
    defaultSize: { w: 6, h: 7 }, 
  },
  {
    id: 'positionSize',
    name: t('home.widget.position-size.name'),
    description: t('home.widget.position-size.description'),
    category: 'tools',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 5, h: 6 }, 
  },
  {
    id: 'embeddedNote',
    name: t('home.widget.embedded-note.name'),
    description: t('home.widget.embedded-note.description'),
    category: 'custom',
    minSize: { w: 3, h: 4 },
    defaultSize: { w: 6, h: 6 }, 
    configurable: true,
  },
  {
    id: 'currentStreak',
    name: t('home.widget.current-streak.name'),
    description: t('home.widget.current-streak.description'),
    category: 'overview',
    minSize: { w: 3, h: 4 },
    defaultSize: { w: 4, h: 5 }, 
  },
  {
    id: 'bestHours',
    name: t('home.widget.best-hours.name'),
    description: t('home.widget.best-hours.description'),
    category: 'overview',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 5, h: 6 }, 
  },
  {
    id: 'setupLeaderboard',
    name: t('home.widget.setup-leaderboard.name'),
    description: t('home.widget.setup-leaderboard.description'),
    category: 'overview',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 5, h: 6 }, 
    configurable: true,
  },
  {
    id: 'unreviewedTrades',
    name: t('home.widget.unreviewed-trades.name'),
    description: t('home.widget.unreviewed-trades.description'),
    category: 'overview',
    minSize: { w: 3, h: 2 },
    defaultSize: { w: 4, h: 2 }, 
  },
  {
    id: 'goalsProgress',
    name: t('home.widget.goals-progress.name'),
    description: t('home.widget.goals-progress.description'),
    category: 'overview',
    minSize: { w: 4, h: 4 },
    defaultSize: { w: 5, h: 5 }, 
    configurable: true, 
  },
  {
    id: 'tradingScore',
    name: t('home.widget.trading-score.name'),
    description: t('home.widget.trading-score.description'),
    category: 'overview',
    minSize: { w: 4, h: 5 },
    defaultSize: { w: 5, h: 6 }, 
  },
  {
    id: 'aum',
    name: t('home.widget.aum.name'),
    description: t('home.widget.aum.description'),
    category: 'overview',
    minSize: { w: 3, h: 2 },
    defaultSize: { w: 4, h: 2 }, 
  },
  {
    id: 'drawdownMonitor',
    name: t('home.widget.drawdown-monitor.name'),
    description: t('home.widget.drawdown-monitor.description'),
    category: 'overview',
    minSize: { w: 3, h: 3 },
    defaultSize: { w: 4, h: 4 }, 
  },
];


export const DEFAULT_HOME_WIDGETS = ['recentItems', 'yearHeatmap'];


export const getHomeWidgetById = (
  id: string
): HomeWidgetDefinition | undefined => {
  
  const directMatch = AVAILABLE_HOME_WIDGETS.find((w) => w.id === id);
  if (directMatch) return directMatch;

  
  const dashIndex = id.indexOf('-');
  if (dashIndex > 0) {
    const baseId = id.substring(0, dashIndex);
    const baseWidget = AVAILABLE_HOME_WIDGETS.find((w) => w.id === baseId);
    if (baseWidget?.configurable) {
      return baseWidget;
    }
  }

  return undefined;
};
