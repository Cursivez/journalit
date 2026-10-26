

import React, { useId, useMemo } from 'react';
import { Input } from '../../../core/Input';
import { NumberInput } from '../../../core/NumberInput';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { FastDateTimeInput } from '../../../core/FastDateTimeInput';
import { ComboBox } from '../../../core/ComboBox';
import { Button } from '../../../ui/Button';
import { usePlugin } from '../../../../hooks/usePlugin';
import { t } from '../../../../lang/helpers';
import {
  CustomFieldDefinition,
  CustomFieldType,
} from '../../../../types/customFields';

type CustomFieldValue = unknown;

interface CustomFieldRendererProps {
  field: CustomFieldDefinition;
  value: CustomFieldValue;
  onChange: (value: CustomFieldValue) => void;
  error?: string;
  
  multilineText?: boolean;
}


function useCustomFieldOptions(
  field: CustomFieldDefinition
): Array<{ value: string; label: string }> {
  const plugin = usePlugin();
  const { id, type, options } = field;
  return useMemo(() => {
    if (
      type !== CustomFieldType.DROPDOWN &&
      type !== CustomFieldType.MULTISELECT
    ) {
      return options || [];
    }

    const predefinedOptions = options || [];
    const customFieldsService = plugin?.customFieldsService;

    if (!customFieldsService) {
      return predefinedOptions;
    }

    const savedOptions = customFieldsService.getFieldOptions(id);

    
    const savedAsOptions = savedOptions.map((option) => ({
      value: option,
      label: option,
    }));

    
    const combined = [...predefinedOptions];
    savedAsOptions.forEach((savedOption) => {
      if (!combined.some((existing) => existing.value === savedOption.value)) {
        combined.push(savedOption);
      }
    });

    return combined;
  }, [id, type, options, plugin?.customFieldsService]);
}


const CustomDropdownField: React.FC<{
  label: string;
  placeholder?: string;
  error?: string;
  required: boolean;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}> = ({ label, placeholder, error, required, value, options, onChange }) => {
  const id = useId();
  const triggerId = `${id}-trigger`;
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  return (
    <div
      className="selectContainer journalit-custom-field-dropdown"
      data-empty={value ? undefined : 'true'}
    >
      <label id={labelId} htmlFor={triggerId} className="label">
        {label}
        
        {required && <span className="required-indicator">*</span>}
      </label>
      <DropdownSelect
        id={triggerId}
        value={value}
        options={options}
        ariaLabel={label}
        
        ariaLabelledBy={labelId}
        ariaDescribedBy={error ? errorId : undefined}
        invalid={Boolean(error)}
        
        disabled={options.length === 0}
        placeholder={placeholder || t('common.select-option')}
        menuWidth="content"
        showOptionTooltips={false}
        onChange={onChange}
      />
      {error && (
        <div id={errorId} className="errorMessage" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};


const customFieldInputValues = (value: CustomFieldRendererProps['value']) => ({
  stringValue: typeof value === 'string' ? value : '',
  numberValue: typeof value === 'number' ? value : 0,
  stringListValue: Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [],
  dateValue:
    typeof value === 'string' || value instanceof Date ? value : undefined,
});

const numberBounds = (validation: CustomFieldDefinition['validation']) => ({
  min: validation?.min,
  max: validation?.max,
});

export const CustomFieldRenderer: React.FC<CustomFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  multilineText = false,
}) => {
  const plugin = usePlugin();
  const { id, label, type, validation, placeholder, allowCreateOptions } =
    field;

  const allOptions = useCustomFieldOptions(field);

  
  const handleSaveOption = async (option: string) => {
    const customFieldsService = plugin?.customFieldsService;
    if (!customFieldsService || !allowCreateOptions) {
      return;
    }

    try {
      await customFieldsService.addFieldOption(id, option);
    } catch (error) {
      console.error('Failed to save custom field option:', error);
    }
  };

  
  const required = validation?.required === true;
  const commonProps = useMemo(
    () => ({ label, placeholder, error, required }),
    [label, placeholder, error, required]
  );

  const { stringValue, numberValue, stringListValue, dateValue } =
    customFieldInputValues(value);
  const canCreateOptions = allowCreateOptions === true;

  switch (type) {
    case CustomFieldType.TEXT:
      return (
        <Input
          {...commonProps}
          value={stringValue}
          onChange={onChange}
          multiline={multilineText}
          type="text"
        />
      );

    case CustomFieldType.NUMBER:
      return (
        <NumberInput
          {...commonProps}
          value={numberValue}
          onChange={onChange}
          allowDecimal={true}
          precision={2}
          {...numberBounds(validation)}
        />
      );

    case CustomFieldType.DROPDOWN:
      
      return canCreateOptions ? (
        <ComboBox
          {...commonProps}
          value={stringValue}
          onChange={onChange}
          options={allOptions.map((opt) => opt.value)}
          isMulti={false}
          allowCreate={true}
          onSaveOption={handleSaveOption}
        />
      ) : (
        <CustomDropdownField
          {...commonProps}
          value={stringValue}
          options={allOptions}
          onChange={onChange}
        />
      );

    case CustomFieldType.MULTISELECT:
      return (
        <ComboBox
          {...commonProps}
          value={stringListValue}
          onChange={onChange}
          options={allOptions.map((opt) => opt.value)}
          isMulti={true}
          allowCreate={canCreateOptions}
          onSaveOption={canCreateOptions ? handleSaveOption : undefined}
        />
      );

    case CustomFieldType.DATE:
      return (
        <FastDateTimeInput
          {...commonProps}
          value={dateValue}
          onChange={onChange}
          includeTime={false}
        />
      );

    case CustomFieldType.DATETIME:
      return (
        <FastDateTimeInput
          {...commonProps}
          className="journalit-custom-datetime-field"
          value={dateValue}
          onChange={onChange}
          includeTime={true}
        />
      );

    case CustomFieldType.TIME:
      return (
        <FastDateTimeInput
          {...commonProps}
          className="journalit-custom-time-field"
          value={dateValue}
          onChange={onChange}
          timeOnly={true}
        />
      );

    default:
      return (
        <div className="custom-field-error">
          <p>Unsupported field type: {type}</p>
        </div>
      );
  }
};


const EMPTY_CUSTOM_FIELD_ERRORS: { [fieldId: string]: string } = {};

interface CustomFieldsRendererProps {
  fields: CustomFieldDefinition[];

  values: Record<string, CustomFieldValue>;

  onChange: (fieldId: string, value: CustomFieldValue) => void;
  errors?: { [fieldId: string]: string };
}

const CustomFieldsRendererComponent: React.FC<CustomFieldsRendererProps> = ({
  fields,
  values,
  onChange,
  errors = EMPTY_CUSTOM_FIELD_ERRORS,
}) => {
  const plugin = usePlugin();
  const openCustomFieldsSettings = () => {
    plugin?.app.saveLocalStorage('journalit:open-custom-fields-settings', '1');
    
    
    
    
    
    plugin?.openSettingsToTab('customization');
    window.dispatchEvent(new Event('journalit:open-custom-fields-settings'));
  };

  if (!fields || fields.length === 0) {
    return (
      <div className="custom-fields-empty">
        <p>{t('form.section.custom-fields-empty-title')}</p>
        <p>{t('form.section.custom-fields-empty-desc')}</p>
        <Button variant="primary" onClick={openCustomFieldsSettings}>
          {t('settings.customization.custom-fields.add-button')}
        </Button>
      </div>
    );
  }

  return (
    <div className="custom-fields-list">
      {fields.map((field, index) => (
        <div key={field.id} className="custom-field-wrapper">
          <div className="custom-field-order" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="custom-field-control">
            <CustomFieldRenderer
              field={field}
              value={values[field.id]}
              onChange={(value) => onChange(field.id, value)}
              error={errors[field.id]}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CustomFieldsRenderer = React.memo(CustomFieldsRendererComponent);
