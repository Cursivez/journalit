function balancedColumns(metricCount: number, columnCap: number): number {
  return Math.ceil(metricCount / Math.ceil(metricCount / columnCap));
}


export function getMetricLayoutColumns(metricCount: number): {
  wide: number;
  medium: number;
  narrow: number;
} {
  const count = Math.max(1, metricCount);
  return {
    wide: balancedColumns(count, 8),
    medium: balancedColumns(count, 4),
    narrow: balancedColumns(count, 2),
  };
}
