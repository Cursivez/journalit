
import type { Layout } from '../shared/gridLayout/reactGridLayoutCompat';
import {
  GRID_COLS,
  type BreakpointKey,
} from '../shared/gridLayout/gridLayoutUtils';

export const HOME_LAYOUT_BREAKPOINTS = ['lg', 'md', 'sm', 'xs', 'xxs'] as const;

export type HomeLayout = Record<BreakpointKey, Layout[]>;

const HOME_LANES: Record<BreakpointKey, number> = {
  lg: 3,
  md: 2,
  sm: 2,
  xs: 1,
  xxs: 1,
};



const HOME_DEFAULT_ROWS = {
  gettingStarted: 9,
  yearHeatmap: 4,
  unreviewedTrades: 2,
  weeklySummary: 4,
  bestHours: 4,
  currentStreak: 4,
  positionSize: 8,
  recentItems: 4,
  drawdownMonitor: 4,
  profitTarget: 4,
  goalsProgress: 4,
} as const;

export type HomeDefaultWidgetId = keyof typeof HOME_DEFAULT_ROWS;

export interface HomeWidgetPlacement {
  widgetId: HomeDefaultWidgetId;
  instanceId: string;
}

export const DEFAULT_HOME_WIDGETS: HomeDefaultWidgetId[] = [
  'gettingStarted',
  'yearHeatmap',
  'unreviewedTrades',
  'weeklySummary',
  'positionSize',
  'recentItems',
];


export function buildHomeLayouts(
  placements: readonly HomeWidgetPlacement[]
): HomeLayout {
  const layouts: HomeLayout = { lg: [], md: [], sm: [], xs: [], xxs: [] };

  for (const breakpoint of HOME_LAYOUT_BREAKPOINTS) {
    const laneCount = HOME_LANES[breakpoint];
    const laneWidth = GRID_COLS[breakpoint] / laneCount;
    const bottoms = Array<number>(laneCount).fill(0);

    for (const { widgetId, instanceId } of placements) {
      const y = Math.min(...bottoms);
      const lane = bottoms.indexOf(y);
      const span =
        widgetId === 'yearHeatmap' &&
        breakpoint === 'lg' &&
        lane < laneCount - 1 &&
        bottoms[lane + 1] === y
          ? 2
          : 1;
      const h = HOME_DEFAULT_ROWS[widgetId];

      layouts[breakpoint].push({
        i: instanceId,
        x: lane * laneWidth,
        y,
        w: span * laneWidth,
        h,
      });
      for (let offset = 0; offset < span; offset += 1) {
        bottoms[lane + offset] = y + h;
      }
    }
  }
  return layouts;
}

export const createDefaultHomeLayout = (): HomeLayout =>
  buildHomeLayouts(
    DEFAULT_HOME_WIDGETS.map((widgetId) => ({ widgetId, instanceId: widgetId }))
  );
