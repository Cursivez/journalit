
const OWNING_FIELDS = [
  'canonicalTradeId',
  'backendTradeId',
  'tradeImportId',
  'executionLedgerVersion',
  'lastBrokerSyncAt',
] as const;

function present(value: unknown): boolean {
  if (typeof value === 'string') return value.trim() !== '';
  return value !== undefined && value !== null;
}


export function isTradeExecutionOwnedBySync(
  source: Readonly<Record<string, unknown>>
): boolean {
  return OWNING_FIELDS.some((field) => present(source[field]));
}
