

import {
  CustomFieldType,
  validateFieldLabel,
  type DropdownOption,
} from '../../types/customFields';
import { normalizeCustomFieldLabel } from '../../services/CustomFieldsService';

export type ColumnCustomFieldType =
  | CustomFieldType.TEXT
  | CustomFieldType.NUMBER
  | CustomFieldType.DROPDOWN;

const MAX_CHOICES = 8;
const MAX_CHOICE_LENGTH = 30;


const NUMBER_PATTERN = /^[-+]?[$€£¥]?\s?\d+(?:[.,]\d+)?$/;

export function columnSampleValues(
  header: string,
  headers: readonly string[],
  sampleRows: readonly string[][]
): string[] {
  const columnIndex = headers.indexOf(header);
  if (columnIndex === -1) return [];
  const values: string[] = [];
  for (const row of sampleRows) {
    const value = (row[columnIndex] ?? '').trim();
    if (value) values.push(value);
  }
  return values;
}


export function inferColumnCustomFieldType(
  values: readonly string[]
): ColumnCustomFieldType {
  if (values.length === 0) return CustomFieldType.TEXT;
  if (values.every((value) => NUMBER_PATTERN.test(value))) {
    return CustomFieldType.NUMBER;
  }
  const distinct = new Set(values);
  const isChoiceList =
    distinct.size < values.length &&
    distinct.size <= MAX_CHOICES &&
    values.every((value) => value.length <= MAX_CHOICE_LENGTH);
  return isChoiceList ? CustomFieldType.DROPDOWN : CustomFieldType.TEXT;
}


export function choiceOptionsFromSamples(
  values: readonly string[]
): DropdownOption[] {
  const byKey = new Map<string, DropdownOption>();
  for (const value of values) {
    const key = value.toLowerCase();
    if (!byKey.has(key)) byKey.set(key, { value, label: value });
  }
  return Array.from(byKey.values());
}

export type NewCustomFieldLabelError = 'empty' | 'reserved' | 'duplicate';

export function validateNewCustomFieldLabel(
  label: string,
  existingLabels: readonly string[]
): NewCustomFieldLabelError | null {
  if (!label.trim()) return 'empty';
  if (validateFieldLabel(label)) return 'reserved';
  const normalized = normalizeCustomFieldLabel(label);
  return existingLabels.some(
    (existing) => normalizeCustomFieldLabel(existing) === normalized
  )
    ? 'duplicate'
    : null;
}
