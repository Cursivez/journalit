
export function normalizeExpectancyBenchmark(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
