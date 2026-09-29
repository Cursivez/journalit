import { parseLocalDateSafe } from '../../utils/dateUtils';
import { createTickerMatcher } from '../../utils/tickerMatching';
import type { DirectionFilter, TradeLogFilters } from '../tradelog/types';
import type { ImageGalleryItem } from '../../components/imageGallery/types';
import type { FilterExclusions } from '../../components/shared/filters/filterExclusions';
import {
  type FilterMatchMode,
  type FilterMatchModes,
  getCustomFieldMatchMode,
  matchesSelectedValues,
} from '../../components/shared/filters/filterMatchModes';
import {
  getStringArray,
  isRecord,
  SELECTABLE_TRADE_STATUSES,
} from './ImageGalleryInternal';

function getTimestamp(date: string): number {
  const timestamp = parseLocalDateSafe(date)?.getTime() ?? Number.NaN;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function includesAny(values: string[], selected: string[]): boolean {
  if (selected.length === 0) return true;
  const normalizedValues = new Set(values.map((value) => value.toLowerCase()));
  return selected.some((selectedValue) =>
    normalizedValues.has(selectedValue.toLowerCase())
  );
}


function matchesSelection(
  values: string[],
  selected: string[],
  noValueSentinel: string,
  mode: FilterMatchMode
): boolean {
  if (selected.length === 0) return true;
  const selectedSet = new Set<string>();
  for (const value of selected) {
    if (value !== noValueSentinel) selectedSet.add(value.toLowerCase());
  }
  return matchesSelectedValues(
    values.map((value) => value.toLowerCase()),
    selectedSet,
    mode,
    selected.includes(noValueSentinel)
  );
}

export function normalizeCustomFieldFilterValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value instanceof Date
  ) {
    return String(value);
  }
  return null;
}

function hasAnySourceCustomFieldValue(
  item: ImageGalleryItem,
  selectedCustomFields: TradeLogFilters['customFieldFilters'],
  matchModes: FilterMatchModes
): boolean {
  return Object.entries(selectedCustomFields || {}).every(
    ([fieldId, selectedValues]) =>
      !Array.isArray(selectedValues) ||
      matchesSelection(
        item.sourceCustomFields[fieldId] ?? [],
        selectedValues,
        `__NO_VALUE__${fieldId}`,
        getCustomFieldMatchMode(matchModes, fieldId)
      )
  );
}

function includesExcludedValue(
  values: string[],
  excluded: string[],
  noValueSentinel: string
): boolean {
  if (excluded.length === 0) return false;
  if (values.length === 0) return excluded.includes(noValueSentinel);
  const excludedValues = excluded.filter((value) => value !== noValueSentinel);
  
  
  return excludedValues.length > 0 && includesAny(values, excludedValues);
}


function matchesAnyImageGalleryExclusion(
  item: ImageGalleryItem,
  exclusions: FilterExclusions
): boolean {
  if (exclusions.tickers.length > 0) {
    const tickerCandidate =
      item.sourceType === 'folder'
        ? item.symbol || ''
        : item.symbol || item.sourceLabel || '';
    if (createTickerMatcher(exclusions.tickers)(tickerCandidate)) return true;
  }

  if (includesExcludedValue(item.setupIds, exclusions.setups, '__NO_SETUP__')) {
    return true;
  }
  if (includesExcludedValue(item.sourceTags, exclusions.tags, '__NO_TAGS__')) {
    return true;
  }
  if (
    includesExcludedValue(item.mistakes, exclusions.mistakes, '__NO_MISTAKES__')
  ) {
    return true;
  }

  for (const [fieldId, excludedValues] of Object.entries(
    exclusions.customFieldFilters
  )) {
    const itemValues = item.sourceCustomFields[fieldId] ?? [];
    if (
      includesExcludedValue(
        itemValues,
        excludedValues,
        `__NO_VALUE__${fieldId}`
      )
    ) {
      return true;
    }
  }

  return false;
}

function matchesImageAnnotationStatus(
  item: ImageGalleryItem,
  selectedStatuses: string[]
): boolean {
  if (selectedStatuses.length === 0) return true;

  return selectedStatuses.some((status) => {
    if (status === 'tagged') {
      return item.tags.length > 0;
    }
    if (status === 'untagged') {
      return item.tags.length === 0;
    }
    if (status === 'hasNotes') {
      return Boolean(item.notes?.trim());
    }
    if (status === 'noNotes') {
      return !item.notes?.trim();
    }
    return false;
  });
}

function normalizeDirectionFilterValue(
  value: string | undefined
): DirectionFilter | null {
  const direction = value?.toLowerCase() ?? '';
  if (direction === 'buy' || direction === 'long' || direction === 'call') {
    return 'long';
  }
  if (direction === 'sell' || direction === 'short' || direction === 'put') {
    return 'short';
  }
  return null;
}

export function matchesImageGalleryTradeLogFilters(
  item: ImageGalleryItem,
  filters: TradeLogFilters,
  sessionLogContext: {
    matchingDays: ReadonlySet<string> | null;
    itemTradingDay: string | null;
  } = { matchingDays: null, itemTradingDay: null }
): boolean {
  if (
    sessionLogContext.matchingDays &&
    (!sessionLogContext.itemTradingDay ||
      !sessionLogContext.matchingDays.has(sessionLogContext.itemTradingDay))
  ) {
    return false;
  }

  const [startDate, endDate] = filters.dateRange;
  const timestamp = getTimestamp(item.date);
  if (startDate && timestamp < startDate.getTime()) return false;
  if (endDate && timestamp > endDate.getTime()) return false;

  if (filters.tickers.length > 0) {
    const matcher = createTickerMatcher(filters.tickers);
    const tickerCandidate =
      item.sourceType === 'folder'
        ? item.symbol || ''
        : item.symbol || item.sourceLabel || '';
    const matched = matcher(tickerCandidate);
    if (!matched) return false;
  }

  if (
    filters.accounts.length === 0 &&
    item.isCopiedTrade &&
    !item.includeInAllAccounts
  ) {
    return false;
  }

  if (filters.accounts.length > 0) {
    if (item.accounts && item.accounts.length > 0) {
      if (!includesAny(item.accounts, filters.accounts)) return false;
    } else if (!item.account) {
      return false;
    } else if (!includesAny([item.account], filters.accounts)) {
      return false;
    }
  }

  if (filters.tradeTypes.length > 0 && filters.tradeTypes.length < 3) {
    if (!item.tradeType || !filters.tradeTypes.includes(item.tradeType)) {
      return false;
    }
  }

  if (filters.directions.length > 0) {
    const normalizedDirection = normalizeDirectionFilterValue(item.direction);
    if (
      !normalizedDirection ||
      !filters.directions.includes(normalizedDirection)
    ) {
      return false;
    }
  }

  if (
    !matchesSelection(
      item.setupIds,
      filters.setups,
      '__NO_SETUP__',
      filters.matchModes.setups
    )
  ) {
    return false;
  }
  if (
    !matchesSelection(
      item.sourceTags,
      filters.tags,
      '__NO_TAGS__',
      filters.matchModes.tags
    )
  ) {
    return false;
  }
  if (
    !matchesSelection(
      item.mistakes,
      filters.mistakes,
      '__NO_MISTAKES__',
      filters.matchModes.mistakes
    )
  ) {
    return false;
  }

  if (
    !hasAnySourceCustomFieldValue(
      item,
      filters.customFieldFilters,
      filters.matchModes
    )
  ) {
    return false;
  }

  if (matchesAnyImageGalleryExclusion(item, filters.exclusions)) {
    return false;
  }

  if (filters.reviewStatus.length === 1) {
    if (item.reviewed === undefined) return false;
    const reviewed = item.reviewed ? 'reviewed' : 'unreviewed';
    if (!filters.reviewStatus.includes(reviewed)) return false;
  }

  if (
    filters.statuses.length > 0 &&
    filters.statuses.length < SELECTABLE_TRADE_STATUSES.length
  ) {
    const status = item.tradeStatus ?? 'all';
    if (status === 'all' || !filters.statuses.includes(status)) return false;
  }

  if (!matchesImageAnnotationStatus(item, filters.imageAnnotationStatus)) {
    return false;
  }

  if (
    !matchesSelection(item.tags, filters.imageTags, '__NO_IMAGE_TAGS__', 'any')
  ) {
    return false;
  }

  return true;
}

export function normalizeStringArrayRecord(
  value: unknown
): Record<string, string[]> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, entryValue]) => {
      const values = getStringArray(entryValue);
      return values.length > 0 ? [[key, values]] : [];
    })
  );
}
