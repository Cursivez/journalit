

import type { CustomFieldFilterSelections } from '../../../types/customFields';

export interface FilterExclusions {
  tickers: string[];
  setups: string[];
  tags: string[];
  mistakes: string[];
  customFieldFilters: CustomFieldFilterSelections;
}


export type ExclusionListKey = Exclude<
  keyof FilterExclusions,
  'customFieldFilters'
>;

const EXCLUSION_LIST_KEYS: readonly ExclusionListKey[] = [
  'tickers',
  'setups',
  'tags',
  'mistakes',
];

export function createFilterExclusions(): FilterExclusions {
  return {
    tickers: [],
    setups: [],
    tags: [],
    mistakes: [],
    customFieldFilters: {},
  };
}

export function cloneFilterExclusions(
  exclusions: FilterExclusions
): FilterExclusions {
  const customFieldFilters: CustomFieldFilterSelections = {};
  for (const [fieldId, values] of Object.entries(
    exclusions.customFieldFilters
  )) {
    customFieldFilters[fieldId] = [...values];
  }
  return {
    tickers: [...exclusions.tickers],
    setups: [...exclusions.setups],
    tags: [...exclusions.tags],
    mistakes: [...exclusions.mistakes],
    customFieldFilters,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readUniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (let i = 0; i < value.length; i++) {
    const entry: unknown = value[i];
    if (typeof entry !== 'string' || entry.length === 0 || seen.has(entry)) {
      continue;
    }
    seen.add(entry);
    result.push(entry);
  }
  return result;
}


export function normalizeFilterExclusions(value: unknown): FilterExclusions {
  const exclusions = createFilterExclusions();
  if (!isRecord(value)) {
    return exclusions;
  }

  for (const key of EXCLUSION_LIST_KEYS) {
    exclusions[key] = readUniqueStrings(value[key]);
  }

  const customFieldFilters = value.customFieldFilters;
  if (isRecord(customFieldFilters)) {
    for (const fieldId of Object.keys(customFieldFilters)) {
      const values = readUniqueStrings(customFieldFilters[fieldId]);
      if (values.length > 0) {
        exclusions.customFieldFilters[fieldId] = values;
      }
    }
  }

  return exclusions;
}

export function hasFilterExclusions(exclusions: FilterExclusions): boolean {
  for (const key of EXCLUSION_LIST_KEYS) {
    if (exclusions[key].length > 0) return true;
  }
  for (const values of Object.values(exclusions.customFieldFilters)) {
    if (values.length > 0) return true;
  }
  return false;
}


export function getFilterExclusionsCacheKey(
  exclusions: FilterExclusions
): string {
  if (!hasFilterExclusions(exclusions)) return 'NONE';
  const lists = EXCLUSION_LIST_KEYS.map((key) => [
    key,
    [...exclusions[key]].sort(),
  ]);
  const custom: Array<[string, string[]]> = [];
  for (const [fieldId, values] of Object.entries(
    exclusions.customFieldFilters
  )) {
    if (values.length > 0) custom.push([fieldId, [...values].sort()]);
  }
  custom.sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify([lists, custom]);
}

export function areFilterExclusionsEqual(
  a: FilterExclusions,
  b: FilterExclusions
): boolean {
  return getFilterExclusionsCacheKey(a) === getFilterExclusionsCacheKey(b);
}
