const CANONICAL_PROJECTION_SCHEMA_VERSION = 1;

interface CanonicalProjectionPnlFields {
  canonicalTradeId?: string;
  canonicalTradeVersion?: number;
  canonicalProjectionSchemaVersion?: number;
  authoritativePnl?: number | null;
}

export function extractCanonicalProjectionPnlFields(
  value: Record<string, unknown>
): CanonicalProjectionPnlFields {
  return {
    canonicalTradeId:
      typeof value.canonicalTradeId === 'string' &&
      value.canonicalTradeId.trim() !== ''
        ? value.canonicalTradeId
        : undefined,
    canonicalTradeVersion:
      typeof value.canonicalTradeVersion === 'number' &&
      Number.isInteger(value.canonicalTradeVersion) &&
      value.canonicalTradeVersion > 0
        ? value.canonicalTradeVersion
        : undefined,
    canonicalProjectionSchemaVersion:
      value.canonicalProjectionSchemaVersion ===
      CANONICAL_PROJECTION_SCHEMA_VERSION
        ? CANONICAL_PROJECTION_SCHEMA_VERSION
        : undefined,
    authoritativePnl:
      value.authoritativePnl === null ||
      (typeof value.authoritativePnl === 'number' &&
        Number.isFinite(value.authoritativePnl))
        ? value.authoritativePnl
        : undefined,
  };
}

export function hasCanonicalProjectionIdentity(value: unknown): value is Record<
  string,
  unknown
> & {
  canonicalTradeId: string;
  canonicalTradeVersion: number;
  canonicalProjectionSchemaVersion: number;
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    'canonicalTradeId' in value &&
    typeof value.canonicalTradeId === 'string' &&
    value.canonicalTradeId.trim() !== '' &&
    'canonicalTradeVersion' in value &&
    typeof value.canonicalTradeVersion === 'number' &&
    Number.isInteger(value.canonicalTradeVersion) &&
    value.canonicalTradeVersion > 0 &&
    'canonicalProjectionSchemaVersion' in value &&
    value.canonicalProjectionSchemaVersion ===
      CANONICAL_PROJECTION_SCHEMA_VERSION
  );
}

export function hasUnknownCanonicalPnL(value: unknown): boolean {
  return (
    hasCanonicalProjectionIdentity(value) &&
    (value.authoritativePnl === null ||
      value.pnl == null ||
      value._originalPnlWasNull === true)
  );
}

export const CANONICAL_PROJECTION_CLEAR_FIELDS = [
  'entries',
  'exits',
  'entryTime',
  'exitTime',
  'entryPrice',
  'exitPrice',
  'hasExplicitExitPrice',
  'positionSize',
  'openQuantity',
  'closedQuantity',
  'direction',
  'instrument',
  'tradeStatus',

  'assetType',
  'commission',
  'hasExplicitCommission',
  'commissionType',
  'swap',
  'fees',
  'currency',
  'brokerBaseCurrencyPnl',
  'brokerBaseCurrency',
  'brokerBaseCurrencyPnlSource',
  'authoritativePnl',
  'rMultiple',
  'useDirectPnLInput',
  'directPnL',
  'exchange',
  'underlyingSymbol',
  'expirationDate',
  'strikePrice',
  'optionType',
  'contractSize',
  'contractSymbol',
  'dollarPerPoint',
  'tickSize',
  'lastBrokerSyncAt',
  'tickValue',
  'currencyPair',
  'lotSize',
  'pipValue',
  'pipSize',
  'tradingPair',
  'cryptoExchange',
  'leverageRatio',
  'executionLedgerVersion',
  'executionIds',
  'sourceRows',
  'orderId',
  'backendTradeId',
  'tradeImportId',
  'tradeImportVersion',
  'tradeImportAccountId',
  'tradeImportAccountBroker',
  'tradeImportAccountDisplayName',
  'canonicalTradeId',
  'canonicalTradeVersion',
  'canonicalProjectionGeneration',
  'canonicalAccountId',
  'canonicalBroker',
  'canonicalAccountDisplayName',
  'canonicalProjectionSchemaVersion',
  'mtComment',
] as const;

export type CanonicalProjectionClearField =
  (typeof CANONICAL_PROJECTION_CLEAR_FIELDS)[number];

export const CANONICAL_PROJECTION_EMPTY_ARRAY_FIELDS =
  new Set<CanonicalProjectionClearField>([
    'entries',
    'exits',
    'executionIds',
    'sourceRows',
  ] satisfies readonly CanonicalProjectionClearField[]);
