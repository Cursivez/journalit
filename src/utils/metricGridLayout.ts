


interface MetricGridLayout {
  
  tracks: number;
  
  spans: number[];
}


export function metricGridLayout(
  count: number,
  maxColumns: number
): MetricGridLayout {
  if (count <= 0) return { tracks: 1, spans: [] };
  const rows = Math.ceil(count / maxColumns);
  const long = Math.ceil(count / rows);
  const short = Math.floor(count / rows);
  if (long === short) {
    return { tracks: long, spans: Array.from({ length: count }, () => 1) };
  }
  const tilesInLongRows = long * (count % rows);
  return {
    tracks: long * short,
    spans: Array.from({ length: count }, (_, index) =>
      index < tilesInLongRows ? short : long
    ),
  };
}
