import {
  TRADE_FIELDS,
  TradeField,
  type CSVColumnMappings,
  type LocalCSVTemplate,
  type ManualImportMode,
  type MultiColumnMappings,
} from './types';

const TRADE_FIELD_SET = new Set<string>(TRADE_FIELDS);
const CUSTOM_FIELD_PREFIX = 'custom:';
const CUSTOM_FIELD_KEY_REGEX = /^[a-z][a-z0-9_]*$/i;

const DEFAULT_MANUAL_MODE: ManualImportMode = 'price_based';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeColumnName(value: string): string {
  return value.trim();
}

function isTradeField(value: string): value is TradeField {
  return TRADE_FIELD_SET.has(value);
}

function normalizeCustomFieldKey(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const key = trimmed.startsWith(CUSTOM_FIELD_PREFIX)
    ? trimmed.slice(CUSTOM_FIELD_PREFIX.length).trim()
    : trimmed;

  if (!CUSTOM_FIELD_KEY_REGEX.test(key)) {
    return undefined;
  }

  return key;
}

function normalizeMappingField(
  value: string,
  options?: { preserveExplicitCustomPrefix?: boolean }
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const hasExplicitCustomPrefix = trimmed.startsWith(CUSTOM_FIELD_PREFIX);
  if (hasExplicitCustomPrefix) {
    const customKey = normalizeCustomFieldKey(trimmed);
    if (!customKey) {
      return undefined;
    }

    return options?.preserveExplicitCustomPrefix
      ? `${CUSTOM_FIELD_PREFIX}${customKey}`
      : customKey;
  }

  if (isTradeField(trimmed)) {
    return trimmed;
  }

  return normalizeCustomFieldKey(trimmed);
}

function sanitizeColumns(columns: string[]): string[] {
  const seen = new Set<string>();
  const sanitized: string[] = [];

  for (const column of columns) {
    const normalized = normalizeColumnName(column);
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    sanitized.push(normalized);
  }

  return sanitized;
}

function normalizeManualMode(mode: unknown): ManualImportMode {
  if (mode === 'direct_pnl') {
    return 'direct_pnl';
  }
  return DEFAULT_MANUAL_MODE;
}

function normalizeHeaderRowIndex(value: unknown): number | undefined {
  if (!Number.isFinite(value)) {
    return undefined;
  }

  const normalized = Math.trunc(Number(value));
  if (normalized < 1) {
    return undefined;
  }

  return normalized;
}

function normalizeColumnMappings(
  columnMappings: CSVColumnMappings | undefined
): MultiColumnMappings {
  const normalized: MultiColumnMappings = {};

  if (!columnMappings || typeof columnMappings !== 'object') {
    return normalized;
  }

  for (const [key, rawValue] of Object.entries(columnMappings)) {
    if (Array.isArray(rawValue)) {
      const mappingField = normalizeMappingField(key, {
        preserveExplicitCustomPrefix: true,
      });
      if (!mappingField) {
        continue;
      }

      const cols = sanitizeColumns(rawValue.filter(isNonEmptyString));
      if (cols.length > 0) {
        normalized[mappingField] = cols;
      }
      continue;
    }

    if (!isNonEmptyString(rawValue)) {
      continue;
    }

    const columnName = normalizeColumnName(key);
    const mappedField = normalizeMappingField(rawValue, {
      preserveExplicitCustomPrefix: true,
    });

    if (!columnName || !mappedField) {
      continue;
    }

    const current = normalized[mappedField] || [];
    const currentColumns = new Set(current);
    if (!currentColumns.has(columnName)) {
      normalized[mappedField] = [...current, columnName];
    }
  }

  return normalized;
}

function canonicalMappingsForComparison(
  columnMappings: CSVColumnMappings
): MultiColumnMappings {
  const mappings: MultiColumnMappings = {};

  for (const [key, value] of Object.entries(columnMappings)) {
    if (Array.isArray(value)) {
      mappings[key] = value.filter(isNonEmptyString);
    }
  }

  return mappings;
}

function isCanonicalV2Shape(columnMappings: CSVColumnMappings): boolean {
  const entries = Object.entries(columnMappings);
  if (entries.length === 0) {
    return true;
  }

  return entries.every(
    ([key, value]) =>
      !!normalizeMappingField(key, {
        preserveExplicitCustomPrefix: true,
      }) && Array.isArray(value)
  );
}

export function normalizeTemplate(template: LocalCSVTemplate): {
  template: LocalCSVTemplate;
  changed: boolean;
} {
  const normalizedMappings = normalizeColumnMappings(template.column_mappings);
  const normalizedMode = normalizeManualMode(template.manual_mode);
  const normalizedHeaderRowIndex = normalizeHeaderRowIndex(
    template.header_row_index
  );

  const rawMappings = template.column_mappings || {};
  const canonicalShape = isCanonicalV2Shape(rawMappings);
  const canonicalWithoutSanitization = canonicalShape
    ? canonicalMappingsForComparison(rawMappings)
    : normalizeColumnMappings(rawMappings);

  const changed =
    !canonicalShape ||
    JSON.stringify(canonicalWithoutSanitization) !==
      JSON.stringify(normalizedMappings) ||
    template.mapping_version !== 2 ||
    template.manual_mode !== normalizedMode ||
    template.header_row_index !== normalizedHeaderRowIndex;

  return {
    template: {
      ...template,
      mapping_version: 2,
      manual_mode: normalizedMode,
      header_row_index: normalizedHeaderRowIndex,
      column_mappings: normalizedMappings,
    },
    changed,
  };
}
