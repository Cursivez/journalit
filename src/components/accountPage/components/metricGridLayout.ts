


export function balancedColumns(count: number, maxColumns: number): number {
  if (count <= 0) return 1;
  const rows = Math.ceil(count / maxColumns);
  return Math.ceil(count / rows);
}


interface MetricGridLayout {
  
  tracks: number;
  
  spans: number[];
}


export function metricGridLayout(
  count: number,
  maxColumns: number
): MetricGridLayout {
  if (count <= 0) return { tracks: 1, spans: [] };
  const columns = balancedColumns(count, maxColumns);
  const rows = Math.ceil(count / columns);
  const last = count - columns * (rows - 1);
  if (last === columns) {
    return { tracks: columns, spans: Array.from({ length: count }, () => 1) };
  }
  const firstOfLastRow = columns * (rows - 1);
  return {
    tracks: columns * last,
    spans: Array.from({ length: count }, (_, index) =>
      index >= firstOfLastRow ? columns : last
    ),
  };
}
