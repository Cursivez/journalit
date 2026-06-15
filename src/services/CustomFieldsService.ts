

import { Plugin, Notice } from 'obsidian';
import { t } from '../lang/helpers';
import { ErrorHandler } from '../utils/errorHandler';
import type { JournalitSettings } from '../settings/types';
import {
  CustomFieldDefinition,
  CustomFieldsData,
  CustomFieldType,
  CustomFieldOptionsStorage,
  DEFAULT_CUSTOM_FIELDS_DATA,
  generateFieldId,
  validateCustomFieldValue,
  labelToFieldKey,
  generateUniqueFieldKey,
  validateFieldKey,
  validateFieldLabel,
  type CustomFieldTradeLogDropdownSortMode,
  type CustomFieldTradeLogSettings,
} from '../types/customFields';


interface CustomFieldsServiceConfig {
  
  namespace?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseCustomFieldType(value: unknown): CustomFieldType | null {
  switch (value) {
    case CustomFieldType.TEXT:
    case CustomFieldType.NUMBER:
    case CustomFieldType.DROPDOWN:
    case CustomFieldType.MULTISELECT:
    case CustomFieldType.DATE:
    case CustomFieldType.DATETIME:
    case CustomFieldType.TIME:
      return value;
    default:
      return null;
  }
}

function normalizeCustomFieldLabel(label: string): string {
  return label.trim().toLowerCase();
}

function getSettingsValue(settings: JournalitSettings, key: string): unknown {
  const settingsRecord: Record<string, unknown> = settings;
  return settingsRecord[key];
}

function parseCustomFieldsImport(
  jsonData: string
): Record<string, unknown> | null {
  const parseJson: (text: string) => unknown = JSON.parse;
  const parsed = parseJson(jsonData);
  return isRecord(parsed) ? parsed : null;
}

function parseFieldOptionsStorage(value: unknown): CustomFieldOptionsStorage {
  if (!isRecord(value)) return {};
  const storage: CustomFieldOptionsStorage = {};
  for (const fieldId in value) {
    const options = value[fieldId];
    if (!Array.isArray(options)) continue;
    const strings: string[] = [];
    for (const option of options) {
      if (typeof option === 'string') strings.push(option);
    }
    storage[fieldId] = strings;
  }
  return storage;
}


interface JournalitPluginInstance extends Plugin {
  settings: JournalitSettings;
  saveSettings(): Promise<void>;
}


export class CustomFieldsService {
  private plugin: JournalitPluginInstance;
  private fields: CustomFieldsData = { ...DEFAULT_CUSTOM_FIELDS_DATA };
  private fieldOptions: CustomFieldOptionsStorage = {};
  private namespace: string = '';

  
  constructor(
    plugin: JournalitPluginInstance,
    config?: CustomFieldsServiceConfig
  ) {
    this.plugin = plugin;

    
    if (config?.namespace) {
      this.namespace = config.namespace;
    }

    
    this.loadFields();
    this.loadFieldOptions();
  }

  
  private getFieldsKey(): string {
    return this.namespace
      ? `customTradeFields_${this.namespace}`
      : 'customTradeFields';
  }

  
  private loadFields(): void {
    try {
      
      const fieldsKey = this.getFieldsKey();

      
      const pluginInstance = this.plugin;

      const storedFieldsData = getSettingsValue(
        pluginInstance.settings,
        fieldsKey
      );

      if (isRecord(storedFieldsData)) {
        
        const loadedFields = {
          ...DEFAULT_CUSTOM_FIELDS_DATA,
          ...storedFieldsData,
        };

        
        const fields = Array.isArray(loadedFields.fields)
          ? loadedFields.fields
          : [];
        this.fields.fields = fields
          .filter((field): field is CustomFieldDefinition =>
            this.isValidFieldDefinition(field)
          )
          .map((field) => ({
            ...field,
            tradeLog: this.normalizeTradeLogSettings(
              field.tradeLog,
              field.type
            ),
          }))
          .sort((a, b) => a.order - b.order);
      } else if (
        !this.namespace &&
        isRecord(pluginInstance.settings.customTradeFields)
      ) {
        
        const loadedFields = {
          ...DEFAULT_CUSTOM_FIELDS_DATA,
          ...pluginInstance.settings.customTradeFields,
        };

        const fields = Array.isArray(loadedFields.fields)
          ? loadedFields.fields
          : [];
        this.fields.fields = fields
          .filter((field): field is CustomFieldDefinition =>
            this.isValidFieldDefinition(field)
          )
          .map((field) => ({
            ...field,
            tradeLog: this.normalizeTradeLogSettings(
              field.tradeLog,
              field.type
            ),
          }))
          .sort((a, b) => a.order - b.order);
      }
    } catch (error) {
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('load custom fields')
      );
      
      this.fields = { ...DEFAULT_CUSTOM_FIELDS_DATA };
    }
  }

  

  private isValidFieldDefinition(
    field: unknown
  ): field is CustomFieldDefinition {
    if (!isRecord(field)) {
      return false;
    }
    const candidate = field;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.label === 'string' &&
      parseCustomFieldType(candidate.type) !== null &&
      typeof candidate.order === 'number'
    );
  }

  private normalizeTradeLogSettings(
    tradeLog: CustomFieldTradeLogSettings | undefined,
    fieldType: CustomFieldType
  ): CustomFieldTradeLogSettings | undefined {
    if (!tradeLog || typeof tradeLog !== 'object') {
      return undefined;
    }

    const normalized: CustomFieldTradeLogSettings = {};

    if (typeof tradeLog.columnLabel === 'string') {
      const trimmedColumnLabel = tradeLog.columnLabel.trim();
      if (trimmedColumnLabel.length > 0) {
        normalized.columnLabel = trimmedColumnLabel;
      }
    }

    if (
      fieldType === CustomFieldType.NUMBER &&
      tradeLog.displayAsCurrency === true
    ) {
      normalized.displayAsCurrency = true;
    }

    if (
      fieldType === CustomFieldType.MULTISELECT &&
      tradeLog.multiselectCollapsedDisplay === 'values'
    ) {
      normalized.multiselectCollapsedDisplay = 'values';
    }

    const dropdownSortModes: CustomFieldTradeLogDropdownSortMode[] = [
      'alphabetical',
      'numeric',
      'option-order',
    ];
    if (
      fieldType === CustomFieldType.DROPDOWN &&
      typeof tradeLog.dropdownSortMode === 'string' &&
      dropdownSortModes.includes(tradeLog.dropdownSortMode)
    ) {
      normalized.dropdownSortMode = tradeLog.dropdownSortMode;
    }

    return Object.keys(normalized).length > 0 ? normalized : undefined;
  }

  
  private validateRegexPattern(pattern: string): boolean {
    if (!pattern) return true;

    try {
      
      const dangerousPatterns = [
        /\(\?!.\*\)\.\*/, 
        /\(\.\*\)\+/, 
        /\.\*\.\*/, 
        /\(\.\+\)\+/, 
        /\(\?!.\+\)\.\+/, 
      ];

      
      for (const dangerous of dangerousPatterns) {
        if (dangerous.test(pattern)) {
          return false;
        }
      }

      
      const start = Date.now();
      new RegExp(pattern);
      const duration = Date.now() - start;

      
      if (duration > 50) {
        return false;
      }

      return true;
    } catch (error) {
      console.warn(
        '[CustomFieldsService] Invalid regex pattern:',
        pattern,
        error
      );
      return false;
    }
  }

  
  private async saveFields(): Promise<void> {
    try {
      
      const fieldsKey = this.getFieldsKey();

      
      const pluginInstance = this.plugin;

      
      if (pluginInstance.settings) {
        
        pluginInstance.settings[fieldsKey] = { ...this.fields };

        
        await pluginInstance.saveSettings();
      } else {
        
        const existingData = (await this.plugin.loadData()) as unknown;
        const existingRecord = isRecord(existingData) ? existingData : {};
        const updatedData = { ...existingRecord, [fieldsKey]: this.fields };
        await this.plugin.saveData(updatedData);
      }

      
      this.plugin.app.workspace.trigger(
        'journalit-custom-fields-changed',
        this.fields
      );
    } catch (error) {
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('save custom fields')
      );
      throw error;
    }
  }

  
  getFields(): CustomFieldDefinition[] {
    return [...this.fields.fields].sort((a, b) => a.order - b.order);
  }

  
  getField(fieldId: string): CustomFieldDefinition | undefined {
    return this.fields.fields.find((field) => field.id === fieldId);
  }

  
  async addField(
    fieldDefinition: Partial<CustomFieldDefinition>
  ): Promise<CustomFieldDefinition> {
    const label = fieldDefinition.label || 'New Field';
    const existingKeys = this.fields.fields.map(
      (f) => f.fieldKey || labelToFieldKey(f.label)
    );

    
    if (
      fieldDefinition.validation?.pattern &&
      !this.validateRegexPattern(fieldDefinition.validation.pattern)
    ) {
      const error = new Error(
        `Invalid or potentially dangerous regex pattern: ${fieldDefinition.validation.pattern}`
      );
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('validate field pattern')
      );
      throw error;
    }

    const labelError = validateFieldLabel(label);
    if (labelError) {
      throw new Error(`Invalid field label: ${labelError}`);
    }

    const normalizedLabel = normalizeCustomFieldLabel(label);
    const hasDuplicateLabel = this.fields.fields.some(
      (field) => normalizeCustomFieldLabel(field.label) === normalizedLabel
    );
    if (hasDuplicateLabel) {
      throw new Error(
        `Invalid field label: ${t('error.settings.field-name-conflict')}`
      );
    }

    const fieldType = fieldDefinition.type || CustomFieldType.TEXT;
    const newField: CustomFieldDefinition = {
      id: fieldDefinition.id || generateFieldId(),
      label,
      fieldKey:
        fieldDefinition.fieldKey || generateUniqueFieldKey(label, existingKeys),
      type: fieldType,
      validation: fieldDefinition.validation || {},
      options: fieldDefinition.options || [],
      allowCreateOptions: fieldDefinition.allowCreateOptions,
      placeholder: fieldDefinition.placeholder,
      helperText: fieldDefinition.helperText,
      tradeLog: this.normalizeTradeLogSettings(
        fieldDefinition.tradeLog,
        fieldType
      ),
      order: fieldDefinition.order || Date.now(),
    };

    this.fields.fields.push(newField);
    await this.saveFields();

    return newField;
  }

  
  async updateField(
    fieldId: string,
    updates: Partial<CustomFieldDefinition>
  ): Promise<CustomFieldDefinition | null> {
    const fieldIndex = this.fields.fields.findIndex(
      (field) => field.id === fieldId
    );

    if (fieldIndex === -1) {
      console.error(`Field with ID ${fieldId} not found`);
      return null;
    }

    
    if (
      updates.validation?.pattern &&
      !this.validateRegexPattern(updates.validation.pattern)
    ) {
      const error = new Error(
        `Invalid or potentially dangerous regex pattern: ${updates.validation.pattern}`
      );
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('validate field pattern update')
      );
      throw error;
    }

    if (updates.label !== undefined) {
      const existingField = this.fields.fields[fieldIndex];
      if (updates.label !== existingField.label) {
        const labelError = validateFieldLabel(updates.label);
        if (labelError) {
          throw new Error(`Invalid field label: ${labelError}`);
        }

        const normalizedLabel = normalizeCustomFieldLabel(updates.label);
        const hasDuplicateLabel = this.fields.fields.some(
          (field, index) =>
            index !== fieldIndex &&
            normalizeCustomFieldLabel(field.label) === normalizedLabel
        );
        if (hasDuplicateLabel) {
          throw new Error(
            `Invalid field label: ${t('error.settings.field-name-conflict')}`
          );
        }
      }
    }

    
    
    
    if (updates.fieldKey !== undefined) {
      const existingField = this.fields.fields[fieldIndex];
      if (updates.fieldKey !== existingField.fieldKey) {
        const error = new Error(
          'Changing a custom field storage key is not supported. Create a new field or build an explicit migration first.'
        );
        ErrorHandler.logError(
          error,
          ErrorHandler.createContext('prevent custom field key mutation')
        );
        throw error;
      }

      const fieldKeyError = validateFieldKey(updates.fieldKey);
      if (fieldKeyError) {
        throw new Error(`Invalid field key: ${fieldKeyError}`);
      }

      
      const otherFields = this.fields.fields.filter(
        (_, index) => index !== fieldIndex
      );
      const existingKeys = otherFields.map(
        (f) => f.fieldKey || labelToFieldKey(f.label)
      );

      if (existingKeys.includes(updates.fieldKey)) {
        const error = new Error(
          `Field key '${updates.fieldKey}' is already in use by another custom field`
        );
        ErrorHandler.logError(
          error,
          ErrorHandler.createContext('validate field key uniqueness')
        );
        throw error;
      }
    }

    const existingField = this.fields.fields[fieldIndex];
    const nextFieldType: CustomFieldType = updates.type ?? existingField.type;
    const hasTradeLogUpdate = 'tradeLog' in updates;

    
    this.fields.fields[fieldIndex] = {
      ...existingField,
      ...updates,
      id: fieldId, 
      tradeLog: this.normalizeTradeLogSettings(
        hasTradeLogUpdate ? updates.tradeLog : existingField.tradeLog,
        nextFieldType
      ),
    };

    await this.saveFields();
    return this.fields.fields[fieldIndex];
  }

  
  async removeField(fieldId: string): Promise<boolean> {
    const initialLength = this.fields.fields.length;
    this.fields.fields = this.fields.fields.filter(
      (field) => field.id !== fieldId
    );

    if (this.fields.fields.length < initialLength) {
      await this.saveFields();
      
      await this.removeAllFieldOptions(fieldId);
      return true;
    }

    return false;
  }

  
  async reorderFields(fieldIds: string[]): Promise<void> {
    const fieldMap = new Map(
      this.fields.fields.map((field) => [field.id, field])
    );
    const reorderedFields: CustomFieldDefinition[] = [];

    
    fieldIds.forEach((id, index) => {
      const field = fieldMap.get(id);
      if (field) {
        reorderedFields.push({
          ...field,
          order: index,
        });
        fieldMap.delete(id);
      }
    });

    
    fieldMap.forEach((field) => {
      reorderedFields.push({
        ...field,
        order: reorderedFields.length,
      });
    });

    this.fields.fields = reorderedFields;
    await this.saveFields();
  }

  

  validateFieldValues(values: { [fieldId: string]: unknown }): {
    [fieldId: string]: string;
  } {
    const errors: { [fieldId: string]: string } = {};

    this.fields.fields.forEach((field) => {
      const value = values[field.id];
      const error = validateCustomFieldValue(value, field);
      if (error) {
        errors[field.id] = error;
      }
    });

    return errors;
  }

  
  getFieldsByType(type: CustomFieldType): CustomFieldDefinition[] {
    return this.getFields().filter((field) => field.type === type);
  }

  
  hasFields(): boolean {
    return this.fields.fields.length > 0;
  }

  
  async resetFields(): Promise<void> {
    this.fields.fields = [];
    await this.saveFields();
  }

  
  exportFields(): string {
    return JSON.stringify(this.fields, null, 2);
  }

  
  async importFields(jsonData: string): Promise<void> {
    try {
      const importedRecord = parseCustomFieldsImport(jsonData);

      
      if (!importedRecord || !Array.isArray(importedRecord.fields)) {
        throw new Error('Invalid custom fields data format');
      }
      const importedFields: unknown[] = importedRecord.fields;

      
      const validFields = importedFields.filter(
        (field): field is CustomFieldDefinition => {
          if (!this.isValidFieldDefinition(field)) {
            return false;
          }

          
          if (
            field.validation?.pattern &&
            !this.validateRegexPattern(field.validation.pattern)
          ) {
            console.warn(
              `Skipping field "${field.label}" due to invalid or dangerous regex pattern: ${field.validation.pattern}`
            );
            return false;
          }

          return true;
        }
      );

      if (validFields.length !== importedFields.length) {
        new Notice(
          t('settings.customization.custom-fields.notice.import-summary', {
            validCount: String(validFields.length),
            totalCount: String(importedFields.length),
          })
        );
      }

      this.fields.fields = validFields
        .map((field) => ({
          ...field,
          tradeLog: this.normalizeTradeLogSettings(field.tradeLog, field.type),
        }))
        .sort((a, b) => a.order - b.order);
      await this.saveFields();

      new Notice(
        t('notice.custom-fields-imported', {
          count: String(validFields.length),
        })
      );
    } catch (error) {
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('import custom fields')
      );
      throw error;
    }
  }

  

  
  private getFieldOptionsKey(): string {
    return this.namespace
      ? `customFieldOptions_${this.namespace}`
      : 'customFieldOptions';
  }

  
  private loadFieldOptions(): void {
    try {
      const optionsKey = this.getFieldOptionsKey();
      const pluginInstance = this.plugin;
      const settingsRecord: Record<string, unknown> = pluginInstance.settings;
      const savedOptions = settingsRecord[optionsKey];

      this.fieldOptions = parseFieldOptionsStorage(savedOptions);
    } catch (error) {
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('load custom field options')
      );
      this.fieldOptions = {};
    }
  }

  
  private async saveFieldOptions(): Promise<void> {
    try {
      const optionsKey = this.getFieldOptionsKey();
      const pluginInstance = this.plugin;

      
      if (pluginInstance.settings) {
        pluginInstance.settings[optionsKey] = { ...this.fieldOptions };
        await pluginInstance.saveSettings();
      } else {
        
        const existingData = (await this.plugin.loadData()) as unknown;
        const existingRecord = isRecord(existingData) ? existingData : {};
        const updatedData = {
          ...existingRecord,
          [optionsKey]: this.fieldOptions,
        };
        await this.plugin.saveData(updatedData);
      }
    } catch (error) {
      ErrorHandler.logError(
        error,
        ErrorHandler.createContext('save custom field options')
      );
      throw error;
    }
  }

  
  getFieldOptions(fieldId: string): string[] {
    return this.fieldOptions[fieldId] || [];
  }

  
  async addFieldOption(fieldId: string, option: string): Promise<boolean> {
    const cleanOption = option.trim();
    if (!cleanOption) {
      return false;
    }

    
    if (!this.fieldOptions[fieldId]) {
      this.fieldOptions[fieldId] = [];
    }

    
    const exists = this.fieldOptions[fieldId].some(
      (existing) => existing.toLowerCase() === cleanOption.toLowerCase()
    );

    if (exists) {
      return false;
    }

    
    this.fieldOptions[fieldId].push(cleanOption);
    await this.saveFieldOptions();

    return true;
  }

  
  async removeFieldOption(fieldId: string, option: string): Promise<boolean> {
    if (!this.fieldOptions[fieldId]) {
      return false;
    }

    const initialLength = this.fieldOptions[fieldId].length;
    this.fieldOptions[fieldId] = this.fieldOptions[fieldId].filter(
      (existing) => existing.toLowerCase() !== option.toLowerCase()
    );

    const removed = initialLength !== this.fieldOptions[fieldId].length;

    if (removed) {
      await this.saveFieldOptions();
    }

    return removed;
  }

  
  async removeAllFieldOptions(fieldId: string): Promise<void> {
    if (this.fieldOptions[fieldId]) {
      delete this.fieldOptions[fieldId];
      await this.saveFieldOptions();
    }
  }

  
  getFieldsWithCustomOptions(): CustomFieldDefinition[] {
    return this.getFields().filter(
      (field) =>
        (field.type === CustomFieldType.DROPDOWN ||
          field.type === CustomFieldType.MULTISELECT) &&
        field.allowCreateOptions
    );
  }
}
