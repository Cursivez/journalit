import { Plugin } from 'obsidian';
import { t } from '../lang/helpers';
import type { JournalitSettings } from '../settings/types';
import {
  CustomFieldDefinition,
  CustomFieldOptionsStorage,
  CustomFieldType,
  generateFieldId,
  generateUniqueFieldKey,
  labelToFieldKey,
  validateCustomFieldValue,
  validateFieldKey,
  validateFieldLabel,
} from '../types/customFields';
import type {
  CustomReviewFieldDefinition,
  CustomReviewFieldGroup,
  CustomReviewFieldsData,
  ReviewFieldReviewType,
} from '../types/reviewCustomFields';
import {
  DEFAULT_CUSTOM_REVIEW_FIELDS_DATA,
  DEFAULT_REVIEW_FIELD_INHERIT_TO,
  DEFAULT_REVIEW_FIELD_INHERITANCE_SOURCES,
  DEFAULT_REVIEW_FIELD_REVIEW_TYPES,
  REVIEW_FIELD_INHERITANCE_MODES,
  REVIEW_FIELD_REVIEW_TYPES,
} from '../types/reviewCustomFields';
import { ErrorHandler } from '../utils/errorHandler';

interface JournalitPluginInstance extends Plugin {
  settings: JournalitSettings;
  saveSettings(): Promise<void>;
}

function normalizeFieldLabel(label: string): string {
  return label.trim().toLowerCase();
}

function normalizeGroupName(name: string): string {
  return (
    name.trim() || t('settings.customization.review-fields.groups.untitled')
  );
}

function generateReviewFieldGroupId(): string {
  return `review_group_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function makeUniqueGroupName(
  requestedName: string,
  existingGroups: CustomReviewFieldGroup[]
): string {
  const baseName = normalizeGroupName(requestedName);
  const existingNames = new Set(
    existingGroups.map((group) => normalizeFieldLabel(group.name))
  );
  if (!existingNames.has(normalizeFieldLabel(baseName))) return baseName;

  let suffix = 2;
  while (existingNames.has(normalizeFieldLabel(`${baseName} ${suffix}`))) {
    suffix += 1;
  }
  return `${baseName} ${suffix}`;
}

function getOptionValue(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';

  const record = Object.fromEntries(Object.entries(value));
  const optionValue: unknown = record.value;
  return typeof optionValue === 'string' ? optionValue.trim() : '';
}

function isReviewFieldReviewType(
  value: unknown
): value is ReviewFieldReviewType {
  switch (value) {
    case 'drc':
    case 'weekly':
    case 'monthly':
    case 'quarterly':
    case 'yearly':
      return true;
    default:
      return false;
  }
}

function normalizeStringOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(
      value.flatMap((option) => {
        const normalized = getOptionValue(option);
        return normalized ? [normalized] : [];
      })
    ),
  ];
}

function normalizeReviewTypes(
  value: unknown,
  fallback: ReviewFieldReviewType[],
  allowedTypes: ReviewFieldReviewType[] = REVIEW_FIELD_REVIEW_TYPES
): ReviewFieldReviewType[] {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  const allowedTypeSet = new Set(allowedTypes);
  const normalized = value.filter(
    (entry): entry is ReviewFieldReviewType =>
      isReviewFieldReviewType(entry) && allowedTypeSet.has(entry)
  );

  return normalized.length > 0 ? [...new Set(normalized)] : [...fallback];
}

function normalizeReviewFieldValidation(
  validation: CustomReviewFieldDefinition['validation']
): CustomReviewFieldDefinition['validation'] {
  if (!validation) return {};
  const normalizedValidation = { ...validation };
  delete normalizedValidation.required;
  return normalizedValidation;
}

export class CustomReviewFieldsService {
  private plugin: JournalitPluginInstance;
  private fields: CustomReviewFieldsData = {
    groups: [],
    fields: [],
  };
  private fieldOptions: CustomFieldOptionsStorage = {};

  constructor(plugin: JournalitPluginInstance) {
    this.plugin = plugin;
    this.loadFields();
    this.loadFieldOptions();
  }

  private loadFields(): void {
    try {
      const loadedFields = {
        ...DEFAULT_CUSTOM_REVIEW_FIELDS_DATA,
        ...this.plugin.settings.customReviewFields,
      };

      const groups = (loadedFields.groups || [])
        .flatMap((group) =>
          this.isValidGroupDefinition(group)
            ? [this.normalizeGroupDefinition(group)]
            : []
        )
        .sort((a, b) => a.order - b.order);
      const groupIds = new Set(groups.map((group) => group.id));

      this.fields.groups = groups;
      this.fields.fields = (loadedFields.fields || [])
        .flatMap((field) => {
          if (!this.isValidFieldDefinition(field)) return [];
          const normalized = this.normalizeFieldDefinition(field);
          return [
            {
              ...normalized,
              groupId:
                normalized.groupId && groupIds.has(normalized.groupId)
                  ? normalized.groupId
                  : undefined,
            },
          ];
        })
        .sort((a, b) => a.order - b.order);
    } catch (error) {
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('load custom review fields')
      );
      this.fields = { groups: [], fields: [] };
    }
  }

  private loadFieldOptions(): void {
    try {
      this.fieldOptions = {
        ...(this.plugin.settings.customReviewFieldOptions || {}),
      };
    } catch (error) {
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('load custom review field options')
      );
      this.fieldOptions = {};
    }
  }

  private isValidFieldDefinition(
    field: unknown
  ): field is CustomReviewFieldDefinition {
    if (!field || typeof field !== 'object') return false;
    const candidate = field as Partial<CustomReviewFieldDefinition>;

    return (
      typeof candidate.id === 'string' &&
      typeof candidate.label === 'string' &&
      typeof candidate.type === 'string' &&
      Object.values(CustomFieldType).includes(candidate.type) &&
      typeof candidate.order === 'number'
    );
  }

  private isValidGroupDefinition(
    group: unknown
  ): group is CustomReviewFieldGroup {
    if (!group || typeof group !== 'object') return false;
    const candidate = group as Partial<CustomReviewFieldGroup>;

    return (
      typeof candidate.id === 'string' &&
      typeof candidate.name === 'string' &&
      typeof candidate.order === 'number'
    );
  }

  private normalizeGroupDefinition(
    group: CustomReviewFieldGroup
  ): CustomReviewFieldGroup {
    return {
      id: group.id,
      name: normalizeGroupName(group.name),
      description: group.description?.trim() || undefined,
      order: group.order,
      collapsedByDefault: group.collapsedByDefault ?? false,
    };
  }

  private normalizeFieldDefinition(
    field: CustomReviewFieldDefinition
  ): CustomReviewFieldDefinition {
    const reviewTypes = normalizeReviewTypes(
      field.scope?.reviewTypes,
      DEFAULT_REVIEW_FIELD_REVIEW_TYPES
    );
    const editableOn = normalizeReviewTypes(
      field.scope?.editableOn,
      reviewTypes
    );
    const inheritTo = normalizeReviewTypes(
      field.scope?.inheritTo,
      DEFAULT_REVIEW_FIELD_INHERIT_TO,
      REVIEW_FIELD_REVIEW_TYPES.filter((type) => type !== 'yearly')
    );
    const sources = normalizeReviewTypes(
      field.inheritance?.sources,
      DEFAULT_REVIEW_FIELD_INHERITANCE_SOURCES,
      REVIEW_FIELD_REVIEW_TYPES.filter((type) => type !== 'drc')
    );
    const mode = REVIEW_FIELD_INHERITANCE_MODES.includes(
      field.inheritance?.mode
    )
      ? field.inheritance.mode
      : 'inherit-and-local';

    return {
      ...field,
      fieldKey: field.fieldKey || labelToFieldKey(field.label),
      validation: normalizeReviewFieldValidation(field.validation),
      options: normalizeStringOptions(field.options),
      groupId: field.groupId,
      scope: { reviewTypes, editableOn, inheritTo },
      inheritance: {
        enabled: field.inheritance?.enabled ?? true,
        sources,
        mode,
        showSourceLabels: field.inheritance?.showSourceLabels ?? true,
        hideWhenEmpty: field.inheritance?.hideWhenEmpty ?? false,
      },
      display: {
        order: field.display?.order ?? field.order,
        compact: field.display?.compact,
      },
    };
  }

  private validateGroupId(groupId: string | undefined): void {
    if (!groupId) return;
    const groupExists = this.fields.groups.some(
      (group) => group.id === groupId
    );
    if (!groupExists) {
      throw new Error(`Review field group '${groupId}' does not exist`);
    }
  }

  private async saveFields(): Promise<void> {
    try {
      this.plugin.settings.customReviewFields = { ...this.fields };
      await this.plugin.saveSettings();
      this.plugin.app.workspace.trigger(
        'journalit-custom-review-fields-changed',
        this.fields
      );
    } catch (error) {
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('save custom review fields')
      );
      throw error;
    }
  }

  private async saveFieldOptions(): Promise<void> {
    try {
      this.plugin.settings.customReviewFieldOptions = { ...this.fieldOptions };
      await this.plugin.saveSettings();
      this.plugin.app.workspace.trigger(
        'journalit-custom-review-field-options-changed',
        this.fieldOptions
      );
    } catch (error) {
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('save custom review field options')
      );
      throw error;
    }
  }

  getFields(): CustomReviewFieldDefinition[] {
    return [...this.fields.fields].sort((a, b) => a.order - b.order);
  }

  getGroups(): CustomReviewFieldGroup[] {
    return [...this.fields.groups].sort((a, b) => a.order - b.order);
  }

  getGroup(groupId: string): CustomReviewFieldGroup | undefined {
    return this.fields.groups.find((group) => group.id === groupId);
  }

  getFieldsForGroup(groupId: string): CustomReviewFieldDefinition[] {
    return this.getFields().filter((field) => field.groupId === groupId);
  }

  getField(fieldId: string): CustomReviewFieldDefinition | undefined {
    return this.fields.fields.find((field) => field.id === fieldId);
  }

  getFieldsForReview(
    type: ReviewFieldReviewType
  ): CustomReviewFieldDefinition[] {
    return this.getFields().filter((field) =>
      field.scope.reviewTypes.includes(type)
    );
  }

  getEditableFieldsForReview(
    type: ReviewFieldReviewType
  ): CustomReviewFieldDefinition[] {
    return this.getFields().filter(
      (field) =>
        field.scope.reviewTypes.includes(type) &&
        field.scope.editableOn.includes(type) &&
        field.inheritance.mode !== 'inherit-only'
    );
  }

  getInheritedFieldsForReview(
    type: ReviewFieldReviewType
  ): CustomReviewFieldDefinition[] {
    return this.getFields().filter(
      (field) =>
        field.inheritance.enabled &&
        field.scope.inheritTo.includes(type) &&
        field.inheritance.mode !== 'local-only'
    );
  }

  async addField(
    fieldDefinition: Partial<CustomReviewFieldDefinition>
  ): Promise<CustomReviewFieldDefinition> {
    const label = fieldDefinition.label || 'New Review Field';
    const labelError = validateFieldLabel(label);
    if (labelError)
      throw new Error(`Invalid review field label: ${labelError}`);

    const normalizedLabel = normalizeFieldLabel(label);
    const hasDuplicateLabel = this.fields.fields.some(
      (field) => normalizeFieldLabel(field.label) === normalizedLabel
    );
    if (hasDuplicateLabel) {
      throw new Error(
        `Invalid review field label: ${t('error.settings.field-name-conflict')}`
      );
    }

    const existingKeys = this.fields.fields.map(
      (field) => field.fieldKey || labelToFieldKey(field.label)
    );
    const fieldType = fieldDefinition.type || CustomFieldType.TEXT;
    const order = fieldDefinition.order ?? Date.now();
    const fieldKey =
      fieldDefinition.fieldKey || generateUniqueFieldKey(label, existingKeys);
    const fieldKeyError = validateFieldKey(fieldKey);
    if (fieldKeyError)
      throw new Error(`Invalid review field key: ${fieldKeyError}`);
    if (existingKeys.includes(fieldKey)) {
      throw new Error(`Review field key '${fieldKey}' is already in use`);
    }
    this.validateGroupId(fieldDefinition.groupId);

    const newField = this.normalizeFieldDefinition({
      id: fieldDefinition.id || generateFieldId(),
      label,
      fieldKey,
      type: fieldType,
      validation: fieldDefinition.validation || {},
      options: fieldDefinition.options || [],
      allowCreateOptions: fieldDefinition.allowCreateOptions,
      placeholder: fieldDefinition.placeholder,
      helperText: fieldDefinition.helperText,
      description: fieldDefinition.description,
      groupId: fieldDefinition.groupId,
      order,
      scope: fieldDefinition.scope || {
        reviewTypes: [...DEFAULT_REVIEW_FIELD_REVIEW_TYPES],
        editableOn: [...DEFAULT_REVIEW_FIELD_REVIEW_TYPES],
        inheritTo: [...DEFAULT_REVIEW_FIELD_INHERIT_TO],
      },
      inheritance: fieldDefinition.inheritance || {
        enabled: true,
        sources: [...DEFAULT_REVIEW_FIELD_INHERITANCE_SOURCES],
        mode: 'inherit-and-local',
        showSourceLabels: true,
        hideWhenEmpty: false,
      },
      display: fieldDefinition.display || {
        order,
      },
    });

    this.fields.fields.push(newField);
    await this.saveFields();
    return newField;
  }

  async updateField(
    fieldId: string,
    updates: Partial<CustomReviewFieldDefinition>
  ): Promise<CustomReviewFieldDefinition | null> {
    const fieldIndex = this.fields.fields.findIndex(
      (field) => field.id === fieldId
    );
    if (fieldIndex === -1) return null;

    if (updates.label !== undefined) {
      const labelError = validateFieldLabel(updates.label);
      if (labelError)
        throw new Error(`Invalid review field label: ${labelError}`);

      const normalizedLabel = normalizeFieldLabel(updates.label);
      const hasDuplicateLabel = this.fields.fields.some(
        (field, index) =>
          index !== fieldIndex &&
          normalizeFieldLabel(field.label) === normalizedLabel
      );
      if (hasDuplicateLabel) {
        throw new Error(
          `Invalid review field label: ${t('error.settings.field-name-conflict')}`
        );
      }
    }

    if (updates.fieldKey !== undefined) {
      const existingField = this.fields.fields[fieldIndex];
      if (updates.fieldKey !== existingField.fieldKey) {
        throw new Error(
          'Changing a custom review field storage key is not supported. Create a new field or build an explicit migration first.'
        );
      }

      const fieldKeyError = validateFieldKey(updates.fieldKey);
      if (fieldKeyError)
        throw new Error(`Invalid review field key: ${fieldKeyError}`);
    }

    if (updates.groupId !== undefined) {
      this.validateGroupId(updates.groupId);
    }

    const existingField = this.fields.fields[fieldIndex];
    this.fields.fields[fieldIndex] = this.normalizeFieldDefinition({
      ...existingField,
      ...updates,
      id: fieldId,
    });

    await this.saveFields();
    return this.fields.fields[fieldIndex];
  }

  async removeField(fieldId: string): Promise<boolean> {
    const initialLength = this.fields.fields.length;
    this.fields.fields = this.fields.fields.filter(
      (field) => field.id !== fieldId
    );

    if (this.fields.fields.length === initialLength) return false;

    delete this.fieldOptions[fieldId];
    await this.saveFields();
    await this.saveFieldOptions();
    return true;
  }

  async addGroup(
    groupDefinition: Partial<CustomReviewFieldGroup>
  ): Promise<CustomReviewFieldGroup> {
    const requestedName =
      groupDefinition.name?.trim() ||
      t('settings.customization.review-fields.groups.default-name');
    const name = makeUniqueGroupName(requestedName, this.fields.groups);

    const group = this.normalizeGroupDefinition({
      id: groupDefinition.id || generateReviewFieldGroupId(),
      name,
      description: groupDefinition.description,
      order: groupDefinition.order ?? Date.now(),
      collapsedByDefault: groupDefinition.collapsedByDefault ?? false,
    });

    this.fields.groups.push(group);
    await this.saveFields();
    return group;
  }

  async updateGroup(
    groupId: string,
    updates: Partial<CustomReviewFieldGroup>
  ): Promise<CustomReviewFieldGroup | null> {
    const groupIndex = this.fields.groups.findIndex(
      (group) => group.id === groupId
    );
    if (groupIndex === -1) return null;

    if (updates.name !== undefined) {
      const normalizedName = normalizeFieldLabel(
        normalizeGroupName(updates.name)
      );
      const duplicate = this.fields.groups.some(
        (group, index) =>
          index !== groupIndex &&
          normalizeFieldLabel(group.name) === normalizedName
      );
      if (duplicate) {
        throw new Error(
          t('settings.customization.review-fields.groups.error.duplicate')
        );
      }
    }

    this.fields.groups[groupIndex] = this.normalizeGroupDefinition({
      ...this.fields.groups[groupIndex],
      ...updates,
      id: groupId,
    });
    await this.saveFields();
    return this.fields.groups[groupIndex];
  }

  async removeGroup(groupId: string): Promise<boolean> {
    const initialLength = this.fields.groups.length;
    this.fields.groups = this.fields.groups.filter(
      (group) => group.id !== groupId
    );
    if (this.fields.groups.length === initialLength) return false;

    this.fields.fields = this.fields.fields.map((field) =>
      field.groupId === groupId ? { ...field, groupId: undefined } : field
    );
    await this.saveFields();
    return true;
  }

  async reorderGroups(groupIds: string[]): Promise<void> {
    const groupMap = new Map(
      this.fields.groups.map((group) => [group.id, group])
    );
    const reorderedGroups: CustomReviewFieldGroup[] = [];

    groupIds.forEach((groupId, index) => {
      const group = groupMap.get(groupId);
      if (!group) return;
      reorderedGroups.push({ ...group, order: index });
      groupMap.delete(groupId);
    });

    groupMap.forEach((group) => reorderedGroups.push(group));
    this.fields.groups = reorderedGroups;
    await this.saveFields();
  }

  async reorderFields(fieldIds: string[]): Promise<void> {
    const fieldMap = new Map(
      this.fields.fields.map((field) => [field.id, field])
    );
    const reorderedFields: CustomReviewFieldDefinition[] = [];

    fieldIds.forEach((fieldId, index) => {
      const field = fieldMap.get(fieldId);
      if (!field) return;
      reorderedFields.push({
        ...field,
        order: index,
        display: { ...field.display, order: index },
      });
      fieldMap.delete(fieldId);
    });

    fieldMap.forEach((field) => reorderedFields.push(field));
    this.fields.fields = reorderedFields;
    await this.saveFields();
  }

  validateFieldValues(values: Record<string, unknown>): Record<string, string> {
    const errors: Record<string, string> = {};
    this.fields.fields.forEach((field) => {
      const validationField: CustomFieldDefinition = {
        ...field,
        options: field.options?.map((option) => ({
          value: option,
          label: option,
        })),
      };
      const error = validateCustomFieldValue(
        values[field.id],
        validationField,
        this.getFieldOptions(field.id)
      );
      if (error) errors[field.id] = error;
    });
    return errors;
  }

  getFieldOptions(fieldId: string): string[] {
    return [...(this.fieldOptions[fieldId] || [])];
  }

  async addFieldOption(fieldId: string, option: string): Promise<void> {
    const trimmedOption = option.trim();
    if (!trimmedOption) return;

    const existingOptions = this.fieldOptions[fieldId] || [];
    if (existingOptions.includes(trimmedOption)) return;

    this.fieldOptions[fieldId] = [...existingOptions, trimmedOption];
    await this.saveFieldOptions();
  }

  hasFields(): boolean {
    return this.fields.fields.length > 0;
  }

  async resetFields(): Promise<void> {
    this.fields.fields = [];
    this.fields.groups = [];
    this.fieldOptions = {};
    await this.saveFields();
    await this.saveFieldOptions();
  }
}
