

import type { Layout } from './reactGridLayoutCompat';


export const LAYOUT_BOTTOM_POSITION = 9999;


type BreakpointKey = 'lg' | 'md' | 'sm' | 'xs' | 'xxs';


export const GRID_COLS: Record<BreakpointKey, number> = {
  lg: 12,
  md: 6,
  sm: 4,
  xs: 2,
  xxs: 1,
};


export const GRID_ROW_HEIGHT = 50;


export interface ResponsiveLayouts {
  lg: Layout[];
  md: Layout[];
  sm: Layout[];
  xs: Layout[];
  xxs: Layout[];
  [key: string]: Layout[];
}


export interface WidgetDefinition {
  id: string;
  name: string;
  description?: string;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
}


export function normalizeLayoutForSave(layoutItems: Layout[]): Layout[] {
  return layoutItems.map((item) => ({
    ...item,
    i: item.i || 'unknown',
    x: typeof item.x === 'number' && isFinite(item.x) ? item.x : 0,
    y:
      typeof item.y === 'number' && isFinite(item.y)
        ? item.y === Infinity || item.y === 10000000 || item.y === 10000
          ? LAYOUT_BOTTOM_POSITION
          : item.y
        : item.y === Infinity
          ? LAYOUT_BOTTOM_POSITION
          : 0,
    w:
      typeof item.w === 'number' && isFinite(item.w) && item.w > 0 ? item.w : 1,
    h:
      typeof item.h === 'number' && isFinite(item.h) && item.h > 0 ? item.h : 1,
  }));
}


export function validateLayoutItem(
  item: Layout,
  widgetDef?: WidgetDefinition,
  breakpointCols?: number
): Layout {
  const cols = breakpointCols || GRID_COLS.lg;

  const validated: Layout = {
    ...item,
    i: typeof item.i === 'string' ? item.i : 'unknown',
    x: typeof item.x === 'number' && isFinite(item.x) ? item.x : 0,
    y:
      typeof item.y === 'number' && isFinite(item.y)
        ? item.y === Infinity || item.y === 10000000 || item.y === 10000
          ? LAYOUT_BOTTOM_POSITION
          : item.y
        : item.y === Infinity
          ? LAYOUT_BOTTOM_POSITION
          : 0,
    w:
      typeof item.w === 'number' && isFinite(item.w) && item.w > 0 ? item.w : 1,
    h:
      typeof item.h === 'number' && isFinite(item.h) && item.h > 0 ? item.h : 1,
  };

  
  
  if (widgetDef?.maxSize) {
    validated.minW = Math.min(item.minW ?? widgetDef.minSize.w, cols);
    validated.minH = item.minH ?? widgetDef.minSize.h;
    validated.maxW = Math.min(item.maxW ?? widgetDef.maxSize.w, cols);
    validated.maxH = item.maxH ?? widgetDef.maxSize.h;
    validated.w = Math.max(
      validated.minW,
      Math.min(validated.w, validated.maxW)
    );
    validated.h = Math.max(
      validated.minH,
      Math.min(validated.h, validated.maxH)
    );
  } else if (widgetDef?.minSize) {
    const minW = Math.min(widgetDef.minSize.w, cols);
    const minH = widgetDef.minSize.h;
    validated.w = Math.max(validated.w, minW);
    validated.h = Math.max(validated.h, minH);
  }

  return validated;
}


export function validateLayoutsForGrid(
  layouts: ResponsiveLayouts,
  getWidgetDef?: (id: string) => WidgetDefinition | undefined
): ResponsiveLayouts {
  const validatedLayouts: ResponsiveLayouts = {
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
  };

  const breakpoints: BreakpointKey[] = ['lg', 'md', 'sm', 'xs', 'xxs'];

  breakpoints.forEach((bp) => {
    const layoutArray = layouts[bp];
    if (!Array.isArray(layoutArray)) {
      validatedLayouts[bp] = [];
      return;
    }

    validatedLayouts[bp] = layoutArray.map((item) => {
      if (!item || typeof item !== 'object') {
        return { i: 'unknown', x: 0, y: 0, w: 1, h: 1 };
      }
      const widgetDef = getWidgetDef ? getWidgetDef(item.i) : undefined;
      return validateLayoutItem(item, widgetDef, GRID_COLS[bp]);
    });
  });

  return validatedLayouts;
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
  const rawY = finiteNumber(record.y, 0);
  const y = rawY === Infinity ? LAYOUT_BOTTOM_POSITION : rawY;
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


export function sanitizeAllLayouts(allLayouts: {
  [key: string]: Layout[];
}): ResponsiveLayouts {
  const sanitized: ResponsiveLayouts = {
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
  };

  const breakpoints: BreakpointKey[] = ['lg', 'md', 'sm', 'xs', 'xxs'];

  breakpoints.forEach((bp) => {
    const layout = allLayouts[bp];
    if (Array.isArray(layout)) {
      sanitized[bp] = layout
        .map(sanitizeLayoutItem)
        .filter((item): item is Layout => item !== null);
    }
  });

  return sanitized;
}


export function syncWidgetsAcrossBreakpoints(
  layouts: ResponsiveLayouts,
  getWidgetDef?: (id: string) => WidgetDefinition | undefined
): void {
  const breakpoints: BreakpointKey[] = ['lg', 'md', 'sm', 'xs', 'xxs'];

  
  const allWidgetIds = new Set<string>();
  breakpoints.forEach((bp) => {
    layouts[bp].forEach((item) => allWidgetIds.add(item.i));
  });

  const sourceItemsByWidgetId = new Map<string, Layout>();
  for (const sourceBp of breakpoints) {
    for (const item of layouts[sourceBp]) {
      if (!sourceItemsByWidgetId.has(item.i)) {
        sourceItemsByWidgetId.set(item.i, item);
      }
    }
  }

  
  breakpoints.forEach((bp) => {
    const bpWidgetIds = new Set(layouts[bp].map((item) => item.i));
    const cols = GRID_COLS[bp];

    allWidgetIds.forEach((widgetId) => {
      if (!bpWidgetIds.has(widgetId)) {
        const sourceItem = sourceItemsByWidgetId.get(widgetId);

        if (sourceItem) {
          const widgetDef = getWidgetDef ? getWidgetDef(widgetId) : undefined;
          const defaultW = widgetDef?.defaultSize.w || sourceItem.w;
          const defaultH = widgetDef?.defaultSize.h || sourceItem.h;

          layouts[bp].push({
            i: widgetId,
            x: 0,
            y: LAYOUT_BOTTOM_POSITION,
            w: bp === 'xxs' ? 1 : Math.min(defaultW, cols),
            h: defaultH,
          });
        }
      }
    });
  });
}


export function findBestWidgetPosition(
  currentLayout: Layout[],
  widgetId: string,
  defaultW: number,
  defaultH: number,
  widgetDef?: WidgetDefinition
): Layout {
  const constraints: Partial<Layout> = {};

  if (widgetDef?.maxSize) {
    constraints.minW = widgetDef.minSize.w;
    constraints.minH = widgetDef.minSize.h;
    constraints.maxW = widgetDef.maxSize.w;
    constraints.maxH = widgetDef.maxSize.h;
  }

  
  if (!currentLayout || currentLayout.length === 0) {
    return {
      i: widgetId,
      x: 0,
      y: 0,
      w: defaultW,
      h: defaultH,
      ...constraints,
    };
  }

  
  let maxY = 0;
  currentLayout.forEach((item) => {
    const y = typeof item.y === 'number' && isFinite(item.y) ? item.y : 0;
    const h = typeof item.h === 'number' && isFinite(item.h) ? item.h : 1;
    const itemBottom = y + h;
    if (itemBottom > maxY) {
      maxY = itemBottom;
    }
  });

  return {
    i: widgetId,
    x: 0,
    y: maxY,
    w: defaultW,
    h: defaultH,
    ...constraints,
  };
}


export function createDefaultLayouts(
  widgets: string[],
  getWidgetDef: (id: string) => WidgetDefinition | undefined
): ResponsiveLayouts {
  const layouts: ResponsiveLayouts = {
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
  };
  const breakpoints: BreakpointKey[] = ['lg', 'md', 'sm', 'xs', 'xxs'];

  widgets.forEach((widgetId) => {
    const widgetDef = getWidgetDef(widgetId);
    if (!widgetDef) return;

    breakpoints.forEach((bp) => {
      const cols = GRID_COLS[bp];
      layouts[bp].push({
        i: widgetId,
        x: 0,
        y: LAYOUT_BOTTOM_POSITION,
        w: bp === 'xxs' ? 1 : Math.min(widgetDef.defaultSize.w, cols),
        h: widgetDef.defaultSize.h,
      });
    });
  });

  return layouts;
}


export function filterLayoutsForWidgets(
  layouts: ResponsiveLayouts,
  widgets: string[],
  getWidgetDef?: (id: string) => WidgetDefinition | undefined
): ResponsiveLayouts {
  const widgetSet = new Set(widgets);
  const filtered: ResponsiveLayouts = {
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
  };
  const breakpoints: BreakpointKey[] = ['lg', 'md', 'sm', 'xs', 'xxs'];

  breakpoints.forEach((bp) => {
    filtered[bp] = (layouts[bp] || [])
      .filter((item) => widgetSet.has(item.i))
      .map((item) => {
        const widgetDef = getWidgetDef ? getWidgetDef(item.i) : undefined;
        return validateLayoutItem(item, widgetDef, GRID_COLS[bp]);
      });
  });

  return filtered;
}


export function addMissingWidgetsToLayouts(
  layouts: ResponsiveLayouts,
  widgets: string[],
  getWidgetDef: (id: string) => WidgetDefinition | undefined
): void {
  const breakpoints: BreakpointKey[] = ['lg', 'md', 'sm', 'xs', 'xxs'];

  widgets.forEach((widgetId) => {
    const widgetDef = getWidgetDef(widgetId);
    if (!widgetDef) return;

    breakpoints.forEach((bp) => {
      const exists = layouts[bp].some((item) => item.i === widgetId);
      if (!exists) {
        const cols = GRID_COLS[bp];
        layouts[bp].push({
          i: widgetId,
          x: 0,
          y: LAYOUT_BOTTOM_POSITION,
          w: bp === 'xxs' ? 1 : Math.min(widgetDef.defaultSize.w, cols),
          h: widgetDef.defaultSize.h,
        });
      }
    });
  });
}
