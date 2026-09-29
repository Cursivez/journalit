import {
  SELECTABLE_STATUSES_COUNT,
  SELECTABLE_TRADE_TYPES_COUNT,
  type TimeNode,
  type TradeLogFilters,
} from '../../services/tradelog/types';
import { hasFilterExclusions } from '../shared/filters/filterExclusions';

export type TradeLogMode = 'trades' | 'imageGallery';

export type TradeCountResolution =
  | { status: 'loading' }
  | { status: 'ready'; count: number }
  | { status: 'failed' };

export function areSessionLogTagsActive(
  mode: TradeLogMode,
  viewLevel: TradeLogFilters['viewLevel']
): boolean {
  return mode === 'imageGallery' || viewLevel === 'days';
}

export function clearInactiveTreeSessionLogTags(
  filters: TradeLogFilters,
  mode: TradeLogMode
): TradeLogFilters {
  if (
    areSessionLogTagsActive(mode, filters.viewLevel) ||
    filters.sessionLogTags.length === 0
  ) {
    return filters;
  }

  return { ...filters, sessionLogTags: [] };
}

export function getActiveTreeSessionLogTags(
  filters: TradeLogFilters
): string[] {
  return filters.viewLevel === 'days' ? filters.sessionLogTags : [];
}

export function hasActiveTradeLogResultFilters(
  filters: TradeLogFilters
): boolean {
  return (
    filters.dateRange.some((date) => date !== null) ||
    (filters.tradeTypes.length > 0 &&
      filters.tradeTypes.length < SELECTABLE_TRADE_TYPES_COUNT) ||
    (filters.statuses.length > 0 &&
      filters.statuses.length < SELECTABLE_STATUSES_COUNT) ||
    filters.accounts.length > 0 ||
    filters.directions.length > 0 ||
    (areSessionLogTagsActive('trades', filters.viewLevel) &&
      filters.sessionLogTags.length > 0) ||
    filters.tickers.length > 0 ||
    filters.setups.length > 0 ||
    filters.tags.length > 0 ||
    filters.mistakes.length > 0 ||
    filters.reviewStatus.length > 0 ||
    Object.values(filters.customFieldFilters).some(
      (values) => values.length > 0
    ) ||
    hasFilterExclusions(filters.exclusions)
  );
}

export function shouldShowTradeLogFilteredEmptyState(
  tradeCountResolution: TradeCountResolution,
  filters: TradeLogFilters,
  operationScoped = false
): boolean {
  if (operationScoped || tradeCountResolution.status !== 'ready') return true;
  if (tradeCountResolution.count === 0) return false;
  if (!hasActiveTradeLogResultFilters(filters)) return false;
  return true;
}

export function pruneUnknownSessionLogTags(
  filters: TradeLogFilters,
  configuredTagIds: ReadonlySet<string>
): TradeLogFilters {
  const sessionLogTags = filters.sessionLogTags.filter((tagId) =>
    configuredTagIds.has(tagId)
  );
  return sessionLogTags.length === filters.sessionLogTags.length
    ? filters
    : { ...filters, sessionLogTags };
}

export function refreshSessionLogTagDefinitionNodeIdentities(
  nodes: TimeNode[]
): TimeNode[] {
  let changed = false;
  const refreshedNodes = nodes.map((node) => {
    const refreshedChildren = node.children
      ? refreshSessionLogTagDefinitionNodeIdentities(node.children)
      : undefined;
    const childrenChanged = refreshedChildren !== node.children;
    const taggedDayChanged =
      node.type === 'day' && (node.sessionLogTagIds?.length ?? 0) > 0;

    if (!childrenChanged && !taggedDayChanged) {
      return node;
    }

    changed = true;
    return {
      ...node,
      children: refreshedChildren,
    };
  });

  return changed ? refreshedNodes : nodes;
}
