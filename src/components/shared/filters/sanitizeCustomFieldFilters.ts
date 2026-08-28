import {
  type CustomFieldDefinition,
  type CustomFieldFilterSelections,
  isDiscreteCustomFieldFilterable,
} from '../../../types/customFields';

export function sanitizeCustomFieldFilters(
  customFieldFilters: CustomFieldFilterSelections | undefined,
  customFields: readonly CustomFieldDefinition[]
): CustomFieldFilterSelections {
  const filterableFieldIds = new Set<string>();
  for (const field of customFields) {
    if (isDiscreteCustomFieldFilterable(field)) {
      filterableFieldIds.add(field.id);
    }
  }

  return Object.fromEntries(
    Object.entries(customFieldFilters || {}).flatMap(([fieldId, values]) => {
      if (!filterableFieldIds.has(fieldId) || !Array.isArray(values)) {
        return [];
      }

      const sanitizedValues = [...new Set(values.filter(Boolean))];
      return sanitizedValues.length > 0 ? [[fieldId, sanitizedValues]] : [];
    })
  );
}
