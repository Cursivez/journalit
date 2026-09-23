const TRADE_PROJECTION_GENERATION_PATTERN = /^(?:fresh|restore)_(\d+)(?:_|$)/;

export function parseTradeProjectionGenerationOrder(
  value?: string
): number | null {
  if (!value) return null;
  const match = value.match(TRADE_PROJECTION_GENERATION_PATTERN);
  return match ? Number(match[1]) : null;
}

export function isTradeProjectionGeneration(value: unknown): value is string {
  return (
    typeof value === 'string' && TRADE_PROJECTION_GENERATION_PATTERN.test(value)
  );
}

export function isRestoreTradeProjectionGeneration(value?: string): boolean {
  return value?.startsWith('restore_') === true;
}
