

import type { Layout } from './reactGridLayoutCompat';


export const LAYOUT_BOTTOM_POSITION = 9999;


const LEGACY_BOTTOM_POSITIONS: ReadonlySet<number> = new Set([10000000, 10000]);

export type BreakpointKey = 'lg' | 'md' | 'sm' | 'xs' | 'xxs';

const GRID_BREAKPOINT_KEYS: readonly BreakpointKey[] = [
  'lg',
  'md',
  'sm',
  'xs',
  'xxs',
];

type BreakpointLayouts = Record<BreakpointKey, Layout[]>;

export function isBreakpointKey(value: string): value is BreakpointKey {
  switch (value) {
    case 'lg':
    case 'md':
    case 'sm':
    case 'xs':
    case 'xxs':
      return true;
    default:
      return false;
  }
}


export const GRID_COLS: Record<BreakpointKey, number> = {
  lg: 12,
  md: 6,
  sm: 4,
  xs: 2,
  xxs: 1,
};


export const GRID_ROW_HEIGHT = 50;


interface GridWidgetSizing {
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
}

function isPositiveFinite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}


export function normalizeLayoutItem(item: Layout): Layout {
  return {
    ...item,
    i: typeof item.i === 'string' && item.i.length > 0 ? item.i : 'unknown',
    x: typeof item.x === 'number' && Number.isFinite(item.x) ? item.x : 0,
    y:
      typeof item.y === 'number' && Number.isFinite(item.y)
        ? LEGACY_BOTTOM_POSITIONS.has(item.y)
          ? LAYOUT_BOTTOM_POSITION
          : item.y
        : 0,
    w: isPositiveFinite(item.w) ? item.w : 1,
    h: isPositiveFinite(item.h) ? item.h : 1,
  };
}


export function normalizeLayoutForSave(layoutItems: Layout[]): Layout[] {
  return layoutItems.map(normalizeLayoutItem);
}


export function applyWidgetSizeConstraints(
  item: Layout,
  sizing: GridWidgetSizing | undefined
): Layout {
  if (!sizing?.maxSize) return item;

  const minW = item.minW ?? sizing.minSize.w;
  const minH = item.minH ?? sizing.minSize.h;
  const maxW = item.maxW ?? sizing.maxSize.w;
  const maxH = item.maxH ?? sizing.maxSize.h;

  return {
    ...item,
    minW,
    minH,
    maxW,
    maxH,
    w: Math.max(minW, Math.min(item.w, maxW)),
    h: Math.max(minH, Math.min(item.h, maxH)),
  };
}

function widgetConstraintProps(
  sizing: GridWidgetSizing | undefined
): Partial<Layout> {
  if (!sizing?.maxSize) return {};
  return {
    minW: sizing.minSize.w,
    minH: sizing.minSize.h,
    maxW: sizing.maxSize.w,
    maxH: sizing.maxSize.h,
  };
}

function clampToSizing(
  value: number,
  min: number,
  max: number | undefined
): number {
  return max === undefined ? value : Math.max(min, Math.min(value, max));
}


export function findBestWidgetPosition({
  layout,
  widgetId,
  w,
  h,
  sizing,
  savedLgLayouts,
}: {
  layout: Layout[];
  widgetId: string;
  w: number;
  h: number;
  sizing: GridWidgetSizing | undefined;
  savedLgLayouts: readonly Layout[][];
}): Layout {
  const constraints = widgetConstraintProps(sizing);

  if (layout.length === 0) {
    return { i: widgetId, x: 0, y: 0, w, h, ...constraints };
  }

  for (const savedLayout of savedLgLayouts) {
    const saved = savedLayout.find((item) => item.i === widgetId);
    if (saved) {
      return {
        i: widgetId,
        x: 0,
        y: LAYOUT_BOTTOM_POSITION,
        w: clampToSizing(saved.w, sizing?.minSize.w ?? 0, sizing?.maxSize?.w),
        h: clampToSizing(saved.h, sizing?.minSize.h ?? 0, sizing?.maxSize?.h),
        ...constraints,
      };
    }
  }

  const lowestBottom = layout.reduce(
    (max, item) => Math.max(max, item.y + item.h),
    0
  );

  return { i: widgetId, x: 0, y: lowestBottom, w, h, ...constraints };
}


export function fillMissingBreakpointItems({
  layouts,
  widgetIds,
  getSizing,
  savedLgLayouts,
}: {
  layouts: BreakpointLayouts;
  widgetIds: readonly string[];
  getSizing: (widgetId: string) => GridWidgetSizing | undefined;
  savedLgLayouts: readonly Layout[][];
}): BreakpointLayouts {
  const filled: BreakpointLayouts = {
    lg: [...layouts.lg],
    md: [...layouts.md],
    sm: [...layouts.sm],
    xs: [...layouts.xs],
    xxs: [...layouts.xxs],
  };

  for (const widgetId of widgetIds) {
    const missing = GRID_BREAKPOINT_KEYS.filter(
      (bp) => !filled[bp].some((item) => item.i === widgetId)
    );
    if (missing.length === 0) continue;

    const sizing = getSizing(widgetId);
    if (!sizing) continue;

    let sourceItem: Layout | undefined;
    for (const bp of GRID_BREAKPOINT_KEYS) {
      sourceItem = filled[bp].find((item) => item.i === widgetId);
      if (sourceItem) break;
    }
    const source =
      sourceItem ??
      findBestWidgetPosition({
        layout: filled.lg,
        widgetId,
        w: sizing.defaultSize.w,
        h: sizing.defaultSize.h,
        sizing,
        savedLgLayouts,
      });

    for (const bp of missing) {
      if (bp === 'lg') {
        filled.lg.push(
          findBestWidgetPosition({
            layout: filled.lg,
            widgetId,
            w: Math.min(source.w, GRID_COLS.lg),
            h: source.h,
            sizing,
            savedLgLayouts,
          })
        );
        continue;
      }

      filled[bp].push({
        i: widgetId,
        x: 0,
        y: LAYOUT_BOTTOM_POSITION,
        w: bp === 'xxs' ? GRID_COLS.xxs : Math.min(source.w, GRID_COLS[bp]),
        h: source.h,
      });
    }
  }

  return filled;
}


export function syncBreakpointsToCurrentLayout({
  layouts,
  currentLayout,
  activeBreakpoint,
}: {
  layouts: BreakpointLayouts;
  currentLayout: Layout[];
  activeBreakpoint: BreakpointKey;
}): BreakpointLayouts {
  const currentWidgetIds = new Set(currentLayout.map((item) => item.i));
  const synced: BreakpointLayouts = { ...layouts };

  for (const bp of GRID_BREAKPOINT_KEYS) {
    if (bp === activeBreakpoint) continue;

    const bpWidgetIds = new Set(layouts[bp].map((item) => item.i));
    const next = layouts[bp].filter((item) => currentWidgetIds.has(item.i));
    for (const item of currentLayout) {
      if (bpWidgetIds.has(item.i)) continue;
      next.push({
        i: item.i,
        x: 0,
        y: LAYOUT_BOTTOM_POSITION,
        w: Math.min(
          Math.max(
            1,
            Math.floor((item.w * GRID_COLS[bp]) / GRID_COLS[activeBreakpoint])
          ),
          GRID_COLS[bp]
        ),
        h: item.h,
      });
    }

    synced[bp] = next;
  }

  return synced;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : null;
}

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}



export function sanitizeLayoutItem(item: unknown): Layout | null {
  const record = asRecord(item);
  if (!record) return null;

  const x = finiteNumber(record.x, 0);
  const y = finiteNumber(record.y, 0);
  const rawW = finiteNumber(record.w, 1);
  const rawH = finiteNumber(record.h, 1);

  return {
    i: typeof record.i === 'string' ? record.i : 'unknown',
    x,
    y,
    w: rawW > 0 ? rawW : 1,
    h: rawH > 0 ? rawH : 1,
  };
}
