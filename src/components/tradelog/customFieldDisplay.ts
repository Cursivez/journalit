import {
  CustomFieldDefinition,
  CustomFieldType,
} from '../../types/customFields';

export function getCustomFieldRawValue(
  trade: Record<string, unknown>,
  field: CustomFieldDefinition
): unknown {
  const rootLevelValue = trade[field.fieldKey];
  if (rootLevelValue !== undefined) {
    return rootLevelValue;
  }

  const nestedCustomFields = trade.customFields;
  if (
    nestedCustomFields &&
    typeof nestedCustomFields === 'object' &&
    !Array.isArray(nestedCustomFields)
  ) {
    return Object.fromEntries(Object.entries(nestedCustomFields))[field.id];
  }

  return undefined;
}

function normalizeComparableCustomValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }

  return null;
}

function getCustomFieldOptionLabel(
  field: CustomFieldDefinition,
  value: unknown
): string | null {
  const normalizedValue = normalizeComparableCustomValue(value);
  if (normalizedValue === null) {
    return null;
  }

  const matchingOption = field.options?.find(
    (option) => option.value === normalizedValue
  );

  return matchingOption?.label?.trim() || normalizedValue;
}

export function getCustomFieldDisplayValues(
  field: CustomFieldDefinition,
  rawValue: unknown
): string[] {
  if (field.type === CustomFieldType.MULTISELECT) {
    const multiselectValues = Array.isArray(rawValue) ? rawValue : [rawValue];

    return multiselectValues
      .map((value) => getCustomFieldOptionLabel(field, value))
      .filter((value): value is string => Boolean(value));
  }

  const singleValue = getCustomFieldOptionLabel(field, rawValue);
  return singleValue ? [singleValue] : [];
}

export function getCustomFieldCollapsedMultiselectDisplayMode(
  field: CustomFieldDefinition
): 'count' | 'values' {
  return field.tradeLog?.multiselectCollapsedDisplay === 'values'
    ? 'values'
    : 'count';
}
