

export type FilterMatchMode = 'any' | 'all' | 'only' | 'exact';

export const FILTER_MATCH_MODES: readonly FilterMatchMode[] = [
  'any',
  'all',
  'only',
  'exact',
];

export type MatchModeListKey = 'setups' | 'tags' | 'mistakes';

const MATCH_MODE_LIST_KEYS: readonly MatchModeListKey[] = [
  'setups',
  'tags',
  'mistakes',
];

export interface FilterMatchModes {
  setups: FilterMatchMode;
  tags: FilterMatchMode;
  mistakes: FilterMatchMode;
  
  customFieldFilters: Record<string, FilterMatchMode>;
}

export function createFilterMatchModes(): FilterMatchModes {
  return {
    setups: 'any',
    tags: 'any',
    mistakes: 'any',
    customFieldFilters: {},
  };
}

export function cloneFilterMatchModes(
  modes: FilterMatchModes
): FilterMatchModes {
  return { ...modes, customFieldFilters: { ...modes.customFieldFilters } };
}

function isFilterMatchMode(value: unknown): value is FilterMatchMode {
  return (
    typeof value === 'string' &&
    FILTER_MATCH_MODES.some((mode) => mode === value)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}


export function normalizeFilterMatchModes(value: unknown): FilterMatchModes {
  const modes = createFilterMatchModes();
  if (!isRecord(value)) return modes;

  for (const key of MATCH_MODE_LIST_KEYS) {
    const mode = value[key];
    if (isFilterMatchMode(mode)) modes[key] = mode;
  }

  const custom = value.customFieldFilters;
  if (isRecord(custom)) {
    for (const fieldId of Object.keys(custom)) {
      const mode = custom[fieldId];
      if (isFilterMatchMode(mode) && mode !== 'any') {
        modes.customFieldFilters[fieldId] = mode;
      }
    }
  }

  return modes;
}


export function getFilterMatchModesCacheKey(modes: FilterMatchModes): string {
  const custom: Array<[string, FilterMatchMode]> = [];
  for (const [fieldId, mode] of Object.entries(modes.customFieldFilters)) {
    if (mode !== 'any') custom.push([fieldId, mode]);
  }
  custom.sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify([modes.setups, modes.tags, modes.mistakes, custom]);
}

export function areFilterMatchModesEqual(
  a: FilterMatchModes,
  b: FilterMatchModes
): boolean {
  return getFilterMatchModesCacheKey(a) === getFilterMatchModesCacheKey(b);
}

export function getCustomFieldMatchMode(
  modes: FilterMatchModes,
  fieldId: string
): FilterMatchMode {
  return modes.customFieldFilters[fieldId] ?? 'any';
}


export function matchesSelectedValues(
  tradeValues: readonly string[],
  selected: ReadonlySet<string>,
  mode: FilterMatchMode,
  includesNoValue: boolean
): boolean {
  switch (mode) {
    case 'any':
      if (includesNoValue && tradeValues.length === 0) return true;
      return tradeValues.some((value) => selected.has(value));
    case 'all': {
      const present = new Set(tradeValues);
      for (const value of selected) {
        if (!present.has(value)) return false;
      }
      return selected.size > 0;
    }
    case 'only':
      return (
        tradeValues.length > 0 &&
        tradeValues.every((value) => selected.has(value))
      );
    case 'exact': {
      if (tradeValues.length === 0) return false;
      const present = new Set(tradeValues);
      if (present.size !== selected.size) return false;
      for (const value of present) {
        if (!selected.has(value)) return false;
      }
      return true;
    }
    default: {
      const exhaustive: never = mode;
      return exhaustive;
    }
  }
}
