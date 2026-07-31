import type { TradeProjection, TradeProjectionResponse } from './types';

const MAX_PROJECTION_PAGES = 1000;

export async function loadAllProjectionPages(
  fetchPage: (cursor?: string) => Promise<TradeProjectionResponse>,
  include: (projection: TradeProjection) => boolean = () => true
): Promise<TradeProjection[]> {
  const projections: TradeProjection[] = [];
  const seenCursors = new Set<string>();

  const loadPage = async (
    cursor: string | undefined,
    page: number
  ): Promise<TradeProjection[]> => {
    if (page >= MAX_PROJECTION_PAGES) {
      throw new Error('Trade Projection pagination limit exceeded');
    }
    const response = await fetchPage(cursor);
    projections.push(...response.projections.filter(include));
    const nextCursor = response.nextCursor?.trim();
    if (!nextCursor) return projections;
    if (seenCursors.has(nextCursor)) {
      throw new Error('Trade Projection pagination cursor repeated');
    }
    seenCursors.add(nextCursor);
    return loadPage(nextCursor, page + 1);
  };

  return loadPage(undefined, 0);
}
