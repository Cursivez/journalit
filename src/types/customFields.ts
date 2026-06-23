

import { t } from '../lang/helpers';


export enum CustomFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DROPDOWN = 'dropdown',
  MULTISELECT = 'multiselect',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
}


export interface DropdownOption {
  value: string;
  label: string;
}


interface CustomFieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string; 
}

export type CustomFieldTradeLogMultiselectCollapsedDisplay = 'count' | 'values';

export type CustomFieldTradeLogDropdownSortMode =
  | 'alphabetical'
  | 'numeric'
  | 'option-order';

export interface CustomFieldTradeLogSettings {
  columnLabel?: string;
  displayAsCurrency?: boolean;
  multiselectCollapsedDisplay?: CustomFieldTradeLogMultiselectCollapsedDisplay;
  dropdownSortMode?: CustomFieldTradeLogDropdownSortMode;
}

export type CustomFieldFilterSelections = Record<string, string[]>;

export function isDiscreteCustomFieldFilterable(
  field: CustomFieldDefinition
): boolean {
  return (
    field.type === CustomFieldType.DROPDOWN ||
    field.type === CustomFieldType.MULTISELECT
  );
}


export interface CustomFieldDefinition {
  id: string; 
  label: string; 
  fieldKey: string; 
  type: CustomFieldType;
  validation?: CustomFieldValidation;
  options?: DropdownOption[]; 
  allowCreateOptions?: boolean; 
  placeholder?: string;
  helperText?: string;
  tradeLog?: CustomFieldTradeLogSettings;
  order: number; 
}


export interface CustomFieldsData {
  fields: CustomFieldDefinition[];
}


export interface CustomFieldValues {
  [fieldId: string]: unknown; 
}


export interface CustomFieldOptionsStorage {
  [fieldId: string]: string[]; 
}


export const DEFAULT_CUSTOM_FIELDS_DATA: CustomFieldsData = {
  fields: [],
};


export const RESERVED_FRONTMATTER_KEYS = new Set([
  'type',
  'entryTime',
  'exitTime',
  'entryPrice',
  'exitPrice',
  'positionSize',
  'direction',
  'tradeStatus',
  'entries',
  'exits',
  'commission',
  'fees',
  'setupIds',

  'instrument',
  'assetType',
  'account',
  'setup',
  'mistake',
  'tags',
  'pnl',
  'useDirectPnLInput',
  'directPnL',
  'lossReview',
  'reviewed',
  'reviewedAt',
  'exchange',
  'optionType',
  'strikePrice',
  'expirationDate',
  'dollarPerPoint',
  'tickSize',
  'tickValue',
  'currencyPair',
  'cryptoPair',
  'cryptoExchange',
  'leverageRatio',
  'tradeId',
  'schemaVersion',
  'backendTradeId',
  'backendAccountId',
  'isMissedTrade',
  'isBacktestTrade',
  'filePath',
  'thesis',
  'mtComment',
  'images',
  'contractSize',
  'lotSize',
  'pipValue',
  'pricePerShare',
  'dividendPerShare',
  'swap',
  'notes',
  'originalPnl',
  'executionIds',
  'executionLedgerVersion',
  'mae',
  'mfe',
  'maePrice',
  'mfePrice',
  'riskAmount',
  'rMultiple',
  'stopLoss',
  'takeProfits',
  'currency',
  'customFields',
  'customTags',
]);


export function generateFieldId(): string {
  return `custom_field_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}


export function labelToFieldKey(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/gi, '') 
    .replace(/\s+/g, '_') 
    .replace(/_{2,}/g, '_') 
    .replace(/^_+|_+$/g, ''); 
}


export function validateFieldKey(fieldKey: string): string | null {
  if (!fieldKey || fieldKey.trim() === '') {
    return t('validation.custom-field.key-empty');
  }

  if (RESERVED_FRONTMATTER_KEYS.has(fieldKey)) {
    return t('validation.custom-field.key-conflict');
  }

  
  if (!/^[a-z][a-z0-9_]*$/i.test(fieldKey)) {
    return t('validation.custom-field.key-format');
  }

  return null;
}

export function validateFieldLabel(label: string): string | null {
  const derivedKey = labelToFieldKey(label);

  if (derivedKey && RESERVED_FRONTMATTER_KEYS.has(derivedKey)) {
    return t('validation.custom-field.key-conflict');
  }

  return null;
}


export function generateUniqueFieldKey(
  label: string,
  existingKeys: string[] = []
): string {
  let baseKey = labelToFieldKey(label);

  
  if (!baseKey || RESERVED_FRONTMATTER_KEYS.has(baseKey)) {
    baseKey = 'custom_field';
  }

  let fieldKey = baseKey;
  let counter = 1;
  const existingKeySet = new Set(existingKeys);

  
  while (
    existingKeySet.has(fieldKey) ||
    RESERVED_FRONTMATTER_KEYS.has(fieldKey)
  ) {
    fieldKey = `${baseKey}_${counter}`;
    counter++;
  }

  return fieldKey;
}


export function createDefaultFieldDefinition(
  type: CustomFieldType,
  existingKeys: string[] = []
): CustomFieldDefinition {
  const id = generateFieldId();
  const label = `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`;
  const fieldKey = generateUniqueFieldKey(label, existingKeys);

  return {
    id,
    label,
    fieldKey,
    type,
    validation: {},
    order: Date.now(), 
  };
}


export function validateCustomFieldValue(
  value: unknown,
  definition: CustomFieldDefinition,
  savedOptions?: string[]
): string | null {
  const { validation = {}, type } = definition;

  const normalizeComparableOption = (option: unknown): string | null => {
    if (typeof option === 'string') {
      return option;
    }

    if (
      typeof option === 'number' ||
      typeof option === 'boolean' ||
      typeof option === 'bigint'
    ) {
      return String(option);
    }

    return null;
  };

  
  const getAllValidOptions = (): string[] => {
    const predefinedOptions = (definition.options || []).flatMap((opt) => {
      const option = normalizeComparableOption(opt.value);
      return option === null ? [] : [option];
    });

    const persistedOptions = (savedOptions || []).flatMap((value) => {
      const option = normalizeComparableOption(value);
      return option === null ? [] : [option];
    });

    
    return [...new Set([...predefinedOptions, ...persistedOptions])];
  };

  
  if (
    validation.required &&
    (value === undefined || value === null || value === '')
  ) {
    return t('validation.custom-field.required', { label: definition.label });
  }

  
  if (value === undefined || value === null || value === '') {
    return null;
  }

  switch (type) {
    case CustomFieldType.TEXT:
      if (typeof value !== 'string') {
        return t('validation.custom-field.text', { label: definition.label });
      }
      if (validation.minLength && value.length < validation.minLength) {
        return t('validation.custom-field.min-length', {
          label: definition.label,
          minLength: String(validation.minLength),
        });
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return t('validation.custom-field.max-length', {
          label: definition.label,
          maxLength: String(validation.maxLength),
        });
      }
      if (validation.pattern) {
        try {
          const regex = new RegExp(validation.pattern);
          if (!regex.test(value)) {
            return t('validation.custom-field.pattern-invalid', {
              label: definition.label,
            });
          }
        } catch {
          console.warn(
            '[CustomFields] Invalid regex pattern:',
            validation.pattern
          );
          return t('validation.custom-field.pattern-invalid-pattern', {
            label: definition.label,
          });
        }
      }
      break;

    case CustomFieldType.NUMBER: {
      const num = Number(value);
      if (isNaN(num)) {
        return t('validation.custom-field.number', { label: definition.label });
      }
      if (validation.min !== undefined && num < validation.min) {
        return t('validation.custom-field.min', {
          label: definition.label,
          min: String(validation.min),
        });
      }
      if (validation.max !== undefined && num > validation.max) {
        return t('validation.custom-field.max', {
          label: definition.label,
          max: String(validation.max),
        });
      }
      break;
    }

    case CustomFieldType.DROPDOWN: {
      const normalizedDropdownValue = normalizeComparableOption(value);
      if (normalizedDropdownValue === null) {
        return t('validation.custom-field.selection', {
          label: definition.label,
        });
      }
      
      if (definition.allowCreateOptions) {
        break;
      }
      
      const validDropdownOptions = getAllValidOptions();
      const validDropdownOptionSet = new Set(validDropdownOptions);
      if (
        validDropdownOptionSet.size > 0 &&
        !validDropdownOptionSet.has(normalizedDropdownValue)
      ) {
        return t('validation.custom-field.option', {
          label: definition.label,
        });
      }
      break;
    }

    case CustomFieldType.MULTISELECT: {
      if (!Array.isArray(value)) {
        return t('validation.custom-field.array', {
          label: definition.label,
        });
      }
      
      if (definition.allowCreateOptions) {
        break;
      }
      
      const validMultiselectOptions = getAllValidOptions();
      const validMultiselectOptionSet = new Set(validMultiselectOptions);
      if (validMultiselectOptionSet.size > 0) {
        for (const item of value) {
          const normalizedItem = normalizeComparableOption(item);
          if (
            normalizedItem === null ||
            !validMultiselectOptionSet.has(normalizedItem)
          ) {
            return t('validation.custom-field.invalid-option', {
              label: definition.label,
              item: String(item),
            });
          }
        }
      }
      break;
    }

    case CustomFieldType.DATE:
    case CustomFieldType.DATETIME: {
      if (
        typeof value !== 'string' &&
        typeof value !== 'number' &&
        !(value instanceof Date)
      ) {
        return t('validation.custom-field.date', { label: definition.label });
      }

      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return t('validation.custom-field.date', { label: definition.label });
      }
      break;
    }

    case CustomFieldType.TIME: {
      
      if (typeof value !== 'string') {
        return t('validation.custom-field.time', { label: definition.label });
      }

      
      const sanitizedTime = value.trim().toLowerCase();

      if (sanitizedTime === '') {
        return validation.required
          ? t('validation.custom-field.required', { label: definition.label })
          : null;
      }

      
      let isValidTime = false;
      let normalizedTime = '';

      
      const time24Pattern =
        /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?$/;
      const time24Match = sanitizedTime.match(time24Pattern);

      if (time24Match) {
        isValidTime = true;
        const hours = time24Match[1].padStart(2, '0');
        const minutes = time24Match[2];
        const seconds = time24Match[3] || '00';
        normalizedTime = `${hours}:${minutes}:${seconds}`;
      } else {
        
        const time12Pattern =
          /^(1[0-2]|0?[1-9]):([0-5][0-9])(?::([0-5][0-9]))?\s*(am|pm)$/;
        const time12Match = sanitizedTime.match(time12Pattern);

        if (time12Match) {
          isValidTime = true;
          let hours = parseInt(time12Match[1]);
          const minutes = time12Match[2];
          const seconds = time12Match[3] || '00';
          const ampm = time12Match[4];

          
          if (ampm === 'pm' && hours !== 12) {
            hours += 12;
          } else if (ampm === 'am' && hours === 12) {
            hours = 0;
          }

          normalizedTime = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
        }
      }

      if (!isValidTime) {
        return t('validation.custom-field.time-format', {
          label: definition.label,
        });
      }

      
      const [hours, minutes, seconds] = normalizedTime.split(':').map(Number);
      if (hours > 23 || minutes > 59 || seconds > 59) {
        return t('validation.custom-field.time-values', {
          label: definition.label,
        });
      }

      break;
    }
  }

  return null;
}
