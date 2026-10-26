import {
  CustomFieldType,
  validateCustomFieldValue,
  type CustomFieldDefinition,
} from '../../../types/customFields';
import { serializeCustomFieldValue } from '../../../utils/customFieldPersistence';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput } from '../ActionTypes';


type WireCustomFieldChange = NonNullable<
  ActionInput<'trade.update'>['custom_fields']
>[number];


export interface CustomFieldCatalog {
  getField(fieldId: string): CustomFieldDefinition | undefined;
  getFieldOptions(fieldId: string): string[];
}


export interface CustomFieldChange {
  readonly field: CustomFieldDefinition;
  readonly value: unknown;
  
  readonly createdOptions: readonly string[];
}

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATETIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
const TIME = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

function validCalendarDate(year: string, month: string, day: string): boolean {
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return (
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
  );
}

function validClock(hours: string, minutes: string, seconds = '0'): boolean {
  return Number(hours) <= 23 && Number(minutes) <= 59 && Number(seconds) <= 59;
}


function matchesType(type: CustomFieldType, value: unknown): boolean {
  switch (type) {
    case CustomFieldType.TEXT:
    case CustomFieldType.DROPDOWN:
      return typeof value === 'string' && value.trim() !== '';
    case CustomFieldType.NUMBER:
      return typeof value === 'number' && Number.isFinite(value);
    case CustomFieldType.MULTISELECT:
      return (
        Array.isArray(value) &&
        value.length > 0 &&
        value.every((item) => typeof item === 'string' && item.trim() !== '')
      );
    case CustomFieldType.DATE: {
      const match = typeof value === 'string' ? DATE.exec(value) : null;
      return match !== null && validCalendarDate(match[1], match[2], match[3]);
    }
    case CustomFieldType.DATETIME: {
      const match = typeof value === 'string' ? DATETIME.exec(value) : null;
      return (
        match !== null &&
        validCalendarDate(match[1], match[2], match[3]) &&
        validClock(match[4], match[5], match[6])
      );
    }
    case CustomFieldType.TIME: {
      const match = typeof value === 'string' ? TIME.exec(value) : null;
      return match !== null && validClock(match[1], match[2], match[3]);
    }
  }
}


export function resolveCustomFieldChanges(
  changes: readonly WireCustomFieldChange[],
  catalog: CustomFieldCatalog,
  field: string
): CustomFieldChange[] {
  const seen = new Set<string>();
  return changes.map((change) => {
    const definition = catalog.getField(change.field_id);
    if (!definition) throw new ActionPlanError('not_found', field);
    if (seen.has(definition.id)) {
      throw new ActionPlanError('invalid_request', field);
    }
    seen.add(definition.id);
    if (change.value === null) {
      if (definition.validation?.required) {
        throw new ActionPlanError('invalid_request', field);
      }
      return { field: definition, value: null, createdOptions: [] };
    }
    if (!matchesType(definition.type, change.value)) {
      throw new ActionPlanError('invalid_request', field);
    }
    const saved = catalog.getFieldOptions(definition.id);
    const value = serializeCustomFieldValue(change.value, definition.type);
    if (validateCustomFieldValue(value, definition, saved) !== null) {
      throw new ActionPlanError('invalid_request', field);
    }
    const known = new Set([
      ...(definition.options ?? []).map((option) => option.value),
      ...saved,
    ]);
    const chosen =
      definition.type === CustomFieldType.DROPDOWN && typeof value === 'string'
        ? [value]
        : definition.type === CustomFieldType.MULTISELECT &&
            Array.isArray(value)
          ? value.filter(
              (option): option is string => typeof option === 'string'
            )
          : [];
    const createdOptions = definition.allowCreateOptions
      ? [...new Set(chosen.filter((option) => !known.has(option)))]
      : [];
    return { field: definition, value, createdOptions };
  });
}


export function customFieldValuesAfter(
  current: Readonly<Record<string, unknown>> | undefined,
  changes: readonly CustomFieldChange[]
): Record<string, unknown> {
  const next: Record<string, unknown> = { ...(current ?? {}) };
  for (const change of changes) next[change.field.id] = change.value;
  return next;
}
