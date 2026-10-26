import {
  CustomFieldType,
  type CustomFieldDefinition,
} from '../../../types/customFields';
import type { AgentToolContracts } from '../protocol';
import { configurationRevision } from './configurationPrimitives';

type Configuration = Extract<
  AgentToolContracts['inspect_configuration']['result'],
  { status: 'ok' }
>['configuration'];
type CustomFieldsProjection = NonNullable<Configuration['custom_fields']>;
type WireCustomField = CustomFieldsProjection['fields'][number];
export type WireCustomFieldValidation = WireCustomField['validation'];
type WireOption = WireCustomField['options'][number];

const TYPES: ReadonlySet<string> = new Set(Object.values(CustomFieldType));
const KEY_PATTERN = /^[A-Za-z][A-Za-z0-9_]{0,99}$/;
const MAX_FIELDS = 200;
const MAX_OPTIONS = 200;
const MAX_CREATED_OPTIONS = 500;
const MAX_NUMBER = 1_000_000_000_000;

function boundedText(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.length >= 1 && value.length <= max;
}

function boundedNumber(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    Math.abs(value) <= MAX_NUMBER
  );
}


export function wireCustomFieldValidation(
  field: CustomFieldDefinition
): WireCustomFieldValidation | null {
  const source = field.validation ?? {};
  const validation: WireCustomFieldValidation = {};
  if (source.required !== undefined) validation.required = source.required;
  for (const [from, to] of [
    ['min', 'min'],
    ['max', 'max'],
  ] as const) {
    const value = source[from];
    if (value === undefined) continue;
    if (!boundedNumber(value)) return null;
    validation[to] = value;
  }
  for (const [from, to] of [
    ['minLength', 'min_length'],
    ['maxLength', 'max_length'],
  ] as const) {
    const value = source[from];
    if (value === undefined) continue;
    if (!Number.isInteger(value) || value < 0 || value > 10_000) return null;
    validation[to] = value;
  }
  if (validation.max_length === 0) return null;
  if (source.pattern !== undefined && source.pattern !== '') {
    if (!boundedText(source.pattern, 500)) return null;
    validation.pattern = source.pattern;
  }
  return validation;
}

function wireOptions(field: CustomFieldDefinition): WireOption[] | null {
  const options = field.options ?? [];
  if (options.length > MAX_OPTIONS) return null;
  const seen = new Set<string>();
  const result: WireOption[] = [];
  for (const option of options) {
    if (!boundedText(option.value, 100) || !boundedText(option.label, 100)) {
      return null;
    }
    if (seen.has(option.value)) return null;
    seen.add(option.value);
    result.push({ value: option.value, label: option.label });
  }
  return result;
}


function revisionContent(field: CustomFieldDefinition) {
  return {
    label: field.label,
    key: field.fieldKey,
    type: field.type,
    options: (field.options ?? []).map((option) => [
      option.value,
      option.label,
    ]),
    validation: wireCustomFieldValidation(field),
    placeholder: field.placeholder ?? null,
    helper_text: field.helperText ?? null,
    allow_create_options: field.allowCreateOptions === true,
  };
}

export function customFieldRevision(
  field: CustomFieldDefinition
): Promise<string> {
  return configurationRevision(revisionContent(field));
}


export function customFieldOrderRevision(
  fields: readonly CustomFieldDefinition[]
): Promise<string> {
  return configurationRevision({ order: fields.map((field) => field.id) });
}


async function wireCustomField(
  field: CustomFieldDefinition,
  createdOptions: readonly string[]
): Promise<WireCustomField | null> {
  if (
    !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(field.id) ||
    !boundedText(field.label, 100) ||
    !KEY_PATTERN.test(field.fieldKey) ||
    !TYPES.has(field.type)
  ) {
    return null;
  }
  const options = wireOptions(field);
  const validation = wireCustomFieldValidation(field);
  const created = [...new Set(createdOptions)];
  if (
    !options ||
    !validation ||
    created.length > MAX_CREATED_OPTIONS ||
    !created.every((option) => boundedText(option, 100))
  ) {
    return null;
  }
  if (
    (field.placeholder !== undefined &&
      field.placeholder !== '' &&
      !boundedText(field.placeholder, 200)) ||
    (field.helperText !== undefined &&
      field.helperText !== '' &&
      !boundedText(field.helperText, 500))
  ) {
    return null;
  }
  return {
    field_id: field.id,
    label: field.label,
    key: field.fieldKey,
    type: field.type,
    options,
    created_options: created,
    validation,
    ...(field.placeholder ? { placeholder: field.placeholder } : {}),
    ...(field.helperText ? { helper_text: field.helperText } : {}),
    allow_create_options: field.allowCreateOptions === true,
    revision: await customFieldRevision(field),
  };
}


export async function projectCustomFieldConfiguration(
  fields: readonly CustomFieldDefinition[],
  createdOptions: (fieldId: string) => readonly string[]
): Promise<CustomFieldsProjection> {
  const projected: WireCustomField[] = [];
  
  const seen = new Set<string>();
  let omitted = 0;
  const wires = await Promise.all(
    fields.map((field) => wireCustomField(field, createdOptions(field.id)))
  );
  for (const original of wires) {
    const wire = projected.length < MAX_FIELDS ? original : null;
    const identities = wire
      ? [
          `id:${wire.field_id}`,
          `key:${wire.key}`,
          `label:${wire.label.trim().toLowerCase()}`,
        ]
      : [];
    if (!wire || identities.some((identity) => seen.has(identity))) {
      omitted += 1;
      continue;
    }
    for (const identity of identities) seen.add(identity);
    projected.push(wire);
  }
  return {
    revision: await customFieldOrderRevision(fields),
    fields: projected,
    omitted_count: omitted,
  };
}
