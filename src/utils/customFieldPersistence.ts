import {
  CustomFieldDefinition,
  CustomFieldType,
  CustomFieldValues,
} from '../types/customFields';

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATETIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?$/;
const TIME_PATTERN = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function formatLocalDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatLocalDateTime(date: Date): string {
  return `${formatLocalDate(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function normalizeCustomTimeValue(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const match = trimmed.match(TIME_PATTERN);
  if (!match) return undefined;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || '0');

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return undefined;
  }

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function parseStoredDateLikeValue(
  value: unknown,
  options?: { includeTime?: boolean; timeOnly?: boolean }
): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }
  if (typeof value !== 'string') {
    return undefined;
  }

  if (options?.timeOnly) {
    const normalizedTime = normalizeCustomTimeValue(value);
    if (!normalizedTime) return undefined;
    const [hours, minutes, seconds] = normalizedTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }

  const dateOnlyMatch = value.match(DATE_ONLY_PATTERN);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const dateTimeMatch = value.match(DATETIME_PATTERN);
  if (dateTimeMatch) {
    const [, year, month, day, hours, minutes, seconds] = dateTimeMatch;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds || '0')
    );
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function normalizeArrayValue(value: unknown[]): unknown[] | undefined {
  const normalized = value
    .map((entry) => {
      if (typeof entry === 'string') {
        const trimmed = entry.trim();
        return trimmed || undefined;
      }
      if (entry instanceof Date) {
        return Number.isNaN(entry.getTime())
          ? undefined
          : formatLocalDateTime(entry);
      }
      return entry ?? undefined;
    })
    .filter((entry) => entry !== undefined);

  return normalized.length > 0 ? normalized : undefined;
}

export function serializeCustomFieldValue(
  value: unknown,
  fieldType?: CustomFieldType
): unknown {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return normalizeArrayValue(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }

    switch (fieldType) {
      case CustomFieldType.DATE: {
        const parsedDate = parseStoredDateLikeValue(trimmed);
        return parsedDate ? formatLocalDate(parsedDate) : trimmed;
      }
      case CustomFieldType.DATETIME: {
        const parsedDateTime = parseStoredDateLikeValue(trimmed, {
          includeTime: true,
        });
        return parsedDateTime ? formatLocalDateTime(parsedDateTime) : trimmed;
      }
      case CustomFieldType.TIME:
        return normalizeCustomTimeValue(trimmed) || trimmed;
      default:
        return trimmed;
    }
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return undefined;
    }

    switch (fieldType) {
      case CustomFieldType.DATE:
        return formatLocalDate(value);
      case CustomFieldType.DATETIME:
      default:
        return formatLocalDateTime(value);
    }
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  return value;
}

export function mapCustomFieldsToFrontmatter(
  values: CustomFieldValues | undefined,
  fieldDefinitions: CustomFieldDefinition[] = [],
  options?: { includeClearedFields?: boolean }
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  if (!values) {
    return mapped;
  }

  const definitionsById = new Map(
    fieldDefinitions.map((field) => [field.id, field])
  );
  const usedKeys = new Set<string>();

  for (const [fieldId, value] of Object.entries(values)) {
    const fieldDefinition = definitionsById.get(fieldId);
    const key = fieldDefinition?.fieldKey || fieldId;

    if (usedKeys.has(key)) {
      continue;
    }

    const serializedValue = serializeCustomFieldValue(
      value,
      fieldDefinition?.type
    );

    if (serializedValue !== undefined || options?.includeClearedFields) {
      mapped[key] = serializedValue;
    }

    usedKeys.add(key);
  }

  return mapped;
}
