


export interface ExpandedPillColumnValues {
  
  labels: string[];
  
  lists: string[][];
}


export function collectExpandedPillColumn(
  lists: Iterable<readonly string[]>
): ExpandedPillColumnValues {
  const labels = new Set<string>();
  const seenLists = new Set<string>();
  const uniqueLists: string[][] = [];

  for (const list of lists) {
    if (list.length === 0) continue;
    const listKey = JSON.stringify(list);
    if (seenLists.has(listKey)) continue;
    seenLists.add(listKey);
    uniqueLists.push([...list]);
    for (const label of list) labels.add(label);
  }

  return { labels: [...labels], lists: uniqueLists };
}


export function widestPillListWidth(
  lists: readonly (readonly string[])[],
  widthByLabel: ReadonlyMap<string, number>,
  gap: number
): number {
  let widest = 0;
  for (const list of lists) {
    let width = gap * Math.max(0, list.length - 1);
    for (const label of list) width += widthByLabel.get(label) ?? 0;
    if (width > widest) widest = width;
  }
  return widest;
}
