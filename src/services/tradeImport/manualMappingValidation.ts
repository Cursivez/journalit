import type { ManualImportMode, TradeField } from '../csv/types';
import type { TradeImportManualMode } from './types';

const PER_ROW_BASE_FIELDS: TradeField[] = ['symbol', 'direction', 'entry_time'];
const PER_ROW_PRICE_FIELDS: TradeField[] = [
  'entry_price',
  'exit_price',
  'quantity',
];


export function manualModeForBackend(
  mode: ManualImportMode,
  supportedModes: readonly TradeImportManualMode[]
): TradeImportManualMode {
  return mode === 'direct_pnl' && supportedModes.includes('trade_per_row')
    ? 'trade_per_row'
    : mode;
}


const CONTRACT_SIZE_ASSET_TYPES: ReadonlySet<string> = new Set([
  'forex',
  'futures',
]);


export function requiredFieldsForManualMode(
  manualMode: TradeImportManualMode,
  mappedFields: ReadonlySet<string>,
  assetType: string
): TradeField[] {
  switch (manualMode) {
    case 'price_based':
      return ['symbol', 'direction', 'entry_time', 'entry_price', 'quantity'];
    case 'direct_pnl':
      return [...PER_ROW_BASE_FIELDS, 'profit_loss'];
    case 'trade_per_row': {
      const computesPnl =
        !mappedFields.has('profit_loss') &&
        PER_ROW_PRICE_FIELDS.every((field) => mappedFields.has(field));
      if (!computesPnl) return [...PER_ROW_BASE_FIELDS, 'profit_loss'];
      return CONTRACT_SIZE_ASSET_TYPES.has(assetType)
        ? [...PER_ROW_BASE_FIELDS, ...PER_ROW_PRICE_FIELDS, 'contract_size']
        : [...PER_ROW_BASE_FIELDS, ...PER_ROW_PRICE_FIELDS];
    }
    default: {
      const exhaustive: never = manualMode;
      return exhaustive;
    }
  }
}


export function resolveManualImportMode(
  choice: ManualImportMode | null,
  applicableMappings: Record<string, string[]>,
  supportsTradePerRow: boolean
): ManualImportMode {
  if (choice) return choice;
  const perRow =
    Boolean(applicableMappings.profit_loss) ||
    (supportsTradePerRow && Boolean(applicableMappings.exit_price));
  return perRow ? 'direct_pnl' : 'price_based';
}

export function normalizeManualColumnMappings(
  mappings: Record<string, string[]>,
  headers: string[]
): Record<string, string[]> {
  const availableHeaders = new Set(headers);
  const assignedColumns = new Set<string>();
  const normalizedMappings: Record<string, string[]> = {};

  for (const [field, columns] of Object.entries(mappings)) {
    const normalizedColumns: string[] = [];
    for (const column of columns) {
      if (!availableHeaders.has(column) || assignedColumns.has(column)) {
        continue;
      }
      assignedColumns.add(column);
      normalizedColumns.push(column);
    }
    if (normalizedColumns.length > 0) {
      normalizedMappings[field] = normalizedColumns;
    }
  }

  return normalizedMappings;
}

export function missingRequiredFieldsForMappings(
  manualMode: TradeImportManualMode,
  columnMappings: Record<string, string[]>,
  headers: string[],
  assetType: string
): TradeField[] {
  const mappedFields = new Set(
    Object.keys(normalizeManualColumnMappings(columnMappings, headers))
  );
  return requiredFieldsForManualMode(
    manualMode,
    mappedFields,
    assetType
  ).filter((field) => !mappedFields.has(field));
}
