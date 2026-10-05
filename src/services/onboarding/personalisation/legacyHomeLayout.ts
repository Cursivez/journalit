import type { HomeLayout } from '../../../components/home/defaultHomeLayout';


export const LEGACY_DEFAULT_HOME_LAYOUT: HomeLayout = {
  lg: [
    { i: 'weeklySummary', x: 2, y: 4, w: 4, h: 4 },
    { i: 'gettingStarted', x: 6, y: 2, w: 3, h: 6 },
    { i: 'unreviewedTrades', x: 6, y: 0, w: 3, h: 2 },
    { i: 'recentItems', x: 0, y: 4, w: 2, h: 4 },
    { i: 'positionSize', x: 9, y: 0, w: 3, h: 8 },
    { i: 'yearHeatmap', x: 0, y: 0, w: 6, h: 4 },
  ],
  md: [
    { i: 'weeklySummary', x: 3, y: 1, w: 3, h: 5 },
    { i: 'gettingStarted', x: 0, y: 0, w: 3, h: 6 },
    { i: 'unreviewedTrades', x: 3, y: 0, w: 3, h: 1 },
    { i: 'recentItems', x: 3, y: 11, w: 3, h: 8 },
    { i: 'positionSize', x: 0, y: 11, w: 3, h: 8 },
    { i: 'yearHeatmap', x: 0, y: 6, w: 6, h: 5 },
  ],
  sm: [
    { i: 'weeklySummary', x: 0, y: 1, w: 2, h: 5 },
    { i: 'gettingStarted', x: 2, y: 0, w: 2, h: 6 },
    { i: 'unreviewedTrades', x: 0, y: 0, w: 2, h: 1 },
    { i: 'recentItems', x: 0, y: 11, w: 2, h: 7 },
    { i: 'positionSize', x: 2, y: 11, w: 2, h: 7 },
    { i: 'yearHeatmap', x: 0, y: 6, w: 4, h: 5 },
  ],
  xs: [
    { i: 'weeklySummary', x: 0, y: 6, w: 2, h: 4 },
    { i: 'gettingStarted', x: 0, y: 0, w: 1, h: 6 },
    { i: 'unreviewedTrades', x: 0, y: 10, w: 2, h: 2 },
    { i: 'recentItems', x: 1, y: 0, w: 1, h: 6 },
    { i: 'positionSize', x: 0, y: 17, w: 2, h: 7 },
    { i: 'yearHeatmap', x: 0, y: 12, w: 2, h: 5 },
  ],
  xxs: [
    { i: 'weeklySummary', x: 0, y: 6, w: 1, h: 4 },
    { i: 'gettingStarted', x: 0, y: 0, w: 1, h: 6 },
    { i: 'unreviewedTrades', x: 0, y: 10, w: 1, h: 2 },
    { i: 'recentItems', x: 0, y: 12, w: 1, h: 5 },
    { i: 'positionSize', x: 0, y: 22, w: 1, h: 7 },
    { i: 'yearHeatmap', x: 0, y: 17, w: 1, h: 5 },
  ],
};
