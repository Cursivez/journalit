import type { TimeNode, TradeLogFilters } from '../../services/tradelog/types';

export type TradeLogMode = 'trades' | 'imageGallery';

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
