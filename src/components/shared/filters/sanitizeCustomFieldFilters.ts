import {
  type CustomFieldDefinition,
  type CustomFieldFilterSelections,
  CustomFieldType,
  isDiscreteCustomFieldFilterable,
} from '../../../types/customFields';
import {
  type FilterExclusions,
  areFilterExclusionsEqual,
} from './filterExclusions';
import {
  type FilterMatchModes,
  areFilterMatchModesEqual,
} from './filterMatchModes';

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


function sanitizeMatchModeCustomFields(
  modes: FilterMatchModes,
  customFields: readonly CustomFieldDefinition[]
): FilterMatchModes {
  const multiSelectIds = new Set<string>();
  for (const field of customFields) {
    if (field.type === CustomFieldType.MULTISELECT)
      multiSelectIds.add(field.id);
  }
  const customFieldFilters: FilterMatchModes['customFieldFilters'] = {};
  for (const [fieldId, mode] of Object.entries(modes.customFieldFilters)) {
    if (multiSelectIds.has(fieldId) && mode !== 'any') {
      customFieldFilters[fieldId] = mode;
    }
  }
  return { ...modes, customFieldFilters };
}

interface CustomFieldFilterRules {
  customFieldFilters: CustomFieldFilterSelections;
  exclusions: FilterExclusions;
  matchModes: FilterMatchModes;
}


export function sanitizeFilterCustomFields<F extends CustomFieldFilterRules>(
  filters: F,
  customFields: readonly CustomFieldDefinition[]
): F {
  const customFieldFilters = sanitizeCustomFieldFilters(
    filters.customFieldFilters,
    customFields
  );
  const exclusions: FilterExclusions = {
    ...filters.exclusions,
    customFieldFilters: sanitizeCustomFieldFilters(
      filters.exclusions.customFieldFilters,
      customFields
    ),
  };
  const matchModes = sanitizeMatchModeCustomFields(
    filters.matchModes,
    customFields
  );

  if (
    JSON.stringify(customFieldFilters) ===
      JSON.stringify(filters.customFieldFilters) &&
    areFilterExclusionsEqual(exclusions, filters.exclusions) &&
    areFilterMatchModesEqual(matchModes, filters.matchModes)
  ) {
    return filters;
  }

  return { ...filters, customFieldFilters, exclusions, matchModes };
}
