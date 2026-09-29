

import type { UnifiedFilters } from '../types';
import type { ExclusionListKey } from '../filterExclusions';
import type { FilterMatchMode, MatchModeListKey } from '../filterMatchModes';
import type { CustomFieldFilterSelections } from '../../../../types/customFields';

import type { FilterSelectionMode } from './menuModel';


export type ExcludableFilterField =
  | { kind: 'list'; key: ExclusionListKey }
  | { kind: 'customField'; fieldId: string };

function toggleValue(values: readonly string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}

function withoutValue(values: readonly string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values];
}

function setCustomFieldValues(
  selections: CustomFieldFilterSelections,
  fieldId: string,
  values: string[]
): CustomFieldFilterSelections {
  const next = { ...selections };
  if (values.length === 0) {
    delete next[fieldId];
  } else {
    next[fieldId] = values;
  }
  return next;
}

export function getIncludedValues(
  filters: UnifiedFilters,
  field: ExcludableFilterField
): string[] {
  return field.kind === 'list'
    ? filters[field.key]
    : (filters.customFieldFilters[field.fieldId] ?? []);
}

export function getExcludedValues(
  filters: UnifiedFilters,
  field: ExcludableFilterField
): string[] {
  return field.kind === 'list'
    ? filters.exclusions[field.key]
    : (filters.exclusions.customFieldFilters[field.fieldId] ?? []);
}

function withFieldValues(
  filters: UnifiedFilters,
  field: ExcludableFilterField,
  included: string[],
  excluded: string[]
): UnifiedFilters {
  if (field.kind === 'list') {
    return {
      ...filters,
      [field.key]: included,
      exclusions: { ...filters.exclusions, [field.key]: excluded },
    };
  }

  return {
    ...filters,
    customFieldFilters: setCustomFieldValues(
      filters.customFieldFilters,
      field.fieldId,
      included
    ),
    exclusions: {
      ...filters.exclusions,
      customFieldFilters: setCustomFieldValues(
        filters.exclusions.customFieldFilters,
        field.fieldId,
        excluded
      ),
    },
  };
}

export function toggleFieldValue(
  filters: UnifiedFilters,
  field: ExcludableFilterField,
  value: string,
  mode: FilterSelectionMode
): UnifiedFilters {
  const included = getIncludedValues(filters, field);
  const excluded = getExcludedValues(filters, field);

  return mode === 'include'
    ? withFieldValues(
        filters,
        field,
        toggleValue(included, value),
        withoutValue(excluded, value)
      )
    : withFieldValues(
        filters,
        field,
        withoutValue(included, value),
        toggleValue(excluded, value)
      );
}


export function clearFieldValues(
  filters: UnifiedFilters,
  field: ExcludableFilterField
): UnifiedFilters {
  const cleared = withFieldValues(filters, field, [], []);
  if (field.kind === 'list') {
    return field.key === 'tickers'
      ? cleared
      : setFieldMatchMode(cleared, { kind: 'list', key: field.key }, 'any');
  }
  return setFieldMatchMode(cleared, field, 'any');
}


export type MatchModeField =
  | { kind: 'list'; key: MatchModeListKey }
  | { kind: 'customField'; fieldId: string };


export function setFieldMatchMode(
  filters: UnifiedFilters,
  field: MatchModeField,
  mode: FilterMatchMode,
  noValueSentinel?: string
): UnifiedFilters {
  if (field.kind === 'customField') {
    const customFieldFilters = { ...filters.matchModes.customFieldFilters };
    if (mode === 'any') {
      delete customFieldFilters[field.fieldId];
    } else {
      customFieldFilters[field.fieldId] = mode;
    }
    return {
      ...filters,
      matchModes: { ...filters.matchModes, customFieldFilters },
    };
  }

  const included = filters[field.key];
  return {
    ...filters,
    [field.key]:
      mode !== 'any' && noValueSentinel
        ? withoutValue(included, noValueSentinel)
        : included,
    matchModes: { ...filters.matchModes, [field.key]: mode },
  };
}
