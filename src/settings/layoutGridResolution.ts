

import { defineOwnEntry } from '../utils/defineOwnEntry';

const GRID_RESOLUTION_SCALE = 2;
const BREAKPOINTS = ['lg', 'md', 'sm', 'xs', 'xxs'] as const;
const HORIZONTAL_KEYS = ['x', 'w', 'minW', 'maxW'] as const;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function scaleItem(item: unknown): unknown {
  if (!isRecord(item)) return item;
  const scaled: UnknownRecord = { ...item };
  for (const key of HORIZONTAL_KEYS) {
    const value = scaled[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      scaled[key] = value * GRID_RESOLUTION_SCALE;
    }
  }
  return scaled;
}


function scaleBreakpoints(
  target: UnknownRecord,
  source: UnknownRecord
): UnknownRecord | null {
  let next: UnknownRecord | null = null;
  for (const breakpoint of BREAKPOINTS) {
    const items = target[breakpoint];
    if (!Array.isArray(source[breakpoint]) || !Array.isArray(items)) continue;
    next ??= { ...target };
    next[breakpoint] = items.map(scaleItem);
  }
  return next;
}

function migrateNamedLayouts(
  section: unknown,
  sourceSection: unknown,
  breakpointsOf: (layout: UnknownRecord) => unknown,
  withBreakpoints: (layout: UnknownRecord, scaled: UnknownRecord) => unknown
): boolean {
  if (!isRecord(section) || !isRecord(sourceSection)) return false;
  const layouts = section.layouts;
  const sourceLayouts = sourceSection.layouts;
  if (!isRecord(layouts) || !isRecord(sourceLayouts)) return false;

  const migrated: UnknownRecord = { ...layouts };
  let changed = false;
  for (const name of Object.keys(sourceLayouts)) {
    const layout = layouts[name];
    const sourceLayout = sourceLayouts[name];
    if (!isRecord(layout) || !isRecord(sourceLayout)) continue;
    const target = breakpointsOf(layout);
    const source = breakpointsOf(sourceLayout);
    if (!isRecord(target) || !isRecord(source)) continue;
    const scaled = scaleBreakpoints(target, source);
    if (!scaled) continue;
    defineOwnEntry(migrated, name, withBreakpoints(layout, scaled));
    changed = true;
  }
  
  
  if (changed) section.layouts = migrated;
  return changed;
}


export function migrateLayoutGridResolution(
  settings: UnknownRecord,
  source: unknown
): boolean {
  if (!isRecord(source)) return false;
  const home = migrateNamedLayouts(
    settings.home,
    source.home,
    (layout) => layout,
    (_layout, scaled) => scaled
  );
  const dashboard = migrateNamedLayouts(
    settings.dashboard,
    source.dashboard,
    (layout) => layout.bottomSection,
    (layout, scaled) => ({ ...layout, bottomSection: scaled })
  );
  return home || dashboard;
}
