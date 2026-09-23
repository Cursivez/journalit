import type { TradeField } from '../csv/types';
import type { TradeImportManualMode } from './types';

export function requiredFieldsForManualMode(
  manualMode: TradeImportManualMode
): TradeField[] {
  return manualMode === 'direct_pnl'
    ? ['symbol', 'direction', 'entry_time', 'profit_loss']
    : ['symbol', 'direction', 'entry_time', 'entry_price', 'quantity'];
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
  headers: string[]
): TradeField[] {
  const mappedFields = new Set(
    Object.keys(normalizeManualColumnMappings(columnMappings, headers))
  );
  return requiredFieldsForManualMode(manualMode).filter(
    (field) => !mappedFields.has(field)
  );
}
