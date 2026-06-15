import type { CustomReviewFieldDefinition } from '../types/reviewCustomFields';
import { serializeCustomFieldValue } from './customFieldPersistence';

const REVIEW_CUSTOM_FIELDS_FRONTMATTER_KEY = 'reviewCustomFields';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

type ReviewCustomFieldsFrontmatter = Record<string, unknown>;

export function mapReviewCustomFieldsToFrontmatter(
  values: Record<string, unknown> | undefined,
  fieldDefinitions: CustomReviewFieldDefinition[] = [],
  options?: { includeClearedFields?: boolean }
): ReviewCustomFieldsFrontmatter {
  const mapped: ReviewCustomFieldsFrontmatter = {};
  if (!values) return mapped;

  const definitionsById = new Map(
    fieldDefinitions.map((field) => [field.id, field])
  );
  const usedKeys = new Set<string>();

  for (const [fieldId, value] of Object.entries(values)) {
    const fieldDefinition = definitionsById.get(fieldId);
    const key = fieldDefinition?.fieldKey || fieldId;
    if (usedKeys.has(key)) continue;

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

export function mapReviewCustomFieldsToRootFrontmatter(
  values: Record<string, unknown> | undefined,
  fieldDefinitions: CustomReviewFieldDefinition[] = [],
  options?: { includeClearedFields?: boolean }
): Record<
  typeof REVIEW_CUSTOM_FIELDS_FRONTMATTER_KEY,
  ReviewCustomFieldsFrontmatter
> {
  return {
    [REVIEW_CUSTOM_FIELDS_FRONTMATTER_KEY]: mapReviewCustomFieldsToFrontmatter(
      values,
      fieldDefinitions,
      options
    ),
  };
}

export function readReviewCustomFieldValuesById(
  reviewCustomFields: unknown,
  fieldDefinitions: CustomReviewFieldDefinition[] = []
): Record<string, unknown> {
  if (!isRecord(reviewCustomFields)) {
    return {};
  }

  const source = reviewCustomFields;
  const values: Record<string, unknown> = {};

  for (const field of fieldDefinitions) {
    if (Object.prototype.hasOwnProperty.call(source, field.fieldKey)) {
      values[field.id] = source[field.fieldKey];
    }
  }

  return values;
}

export function readReviewCustomFieldValuesByIdFromFrontmatter(
  frontmatter: unknown,
  fieldDefinitions: CustomReviewFieldDefinition[] = []
): Record<string, unknown> {
  if (!isRecord(frontmatter)) {
    return {};
  }

  return readReviewCustomFieldValuesById(
    frontmatter[REVIEW_CUSTOM_FIELDS_FRONTMATTER_KEY],
    fieldDefinitions
  );
}

export function mergeReviewCustomFieldsFrontmatter(
  existingReviewCustomFields: unknown,
  updatesById: Record<string, unknown>,
  fieldDefinitions: CustomReviewFieldDefinition[],
  options?: { includeClearedFields?: boolean }
): ReviewCustomFieldsFrontmatter {
  const existing = isRecord(existingReviewCustomFields)
    ? existingReviewCustomFields
    : {};

  return {
    ...existing,
    ...mapReviewCustomFieldsToFrontmatter(
      updatesById,
      fieldDefinitions,
      options
    ),
  };
}

export function mergeReviewCustomFieldsRootFrontmatter(
  frontmatter: unknown,
  updatesById: Record<string, unknown>,
  fieldDefinitions: CustomReviewFieldDefinition[],
  options?: { includeClearedFields?: boolean }
): Record<
  typeof REVIEW_CUSTOM_FIELDS_FRONTMATTER_KEY,
  ReviewCustomFieldsFrontmatter
> {
  const source = isRecord(frontmatter)
    ? frontmatter[REVIEW_CUSTOM_FIELDS_FRONTMATTER_KEY]
    : undefined;

  return {
    [REVIEW_CUSTOM_FIELDS_FRONTMATTER_KEY]: mergeReviewCustomFieldsFrontmatter(
      source,
      updatesById,
      fieldDefinitions,
      options
    ),
  };
}
