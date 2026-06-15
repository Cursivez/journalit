

import React, { useMemo } from 'react';
import { Input } from '../../../core/Input';
import { NumberInput } from '../../../core/NumberInput';
import { Select } from '../../../core/Select';
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
}

const CustomFieldRenderer: React.FC<CustomFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const plugin = usePlugin();
  const {
    id,
    label,
    type,
    validation,
    options,
    placeholder,
    allowCreateOptions,
  } = field;

  
  const allOptions = useMemo(() => {
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

  
  const commonProps = useMemo(
    () => ({
      label,
      placeholder,
      error,
      required: validation?.required || false,
    }),
    [label, placeholder, error, validation?.required]
  );

  const stringValue = typeof value === 'string' ? value : '';
  const numberValue = typeof value === 'number' ? value : 0;
  const stringListValue = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
  const dateValue =
    typeof value === 'string' || value instanceof Date ? value : undefined;

  switch (type) {
    case CustomFieldType.TEXT:
      return (
        <Input
          {...commonProps}
          value={stringValue}
          onChange={onChange}
          multiline={false}
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
          min={validation?.min}
          max={validation?.max}
        />
      );

    case CustomFieldType.DROPDOWN:
      
      if (allowCreateOptions) {
        return (
          <ComboBox
            {...commonProps}
            value={stringValue}
            onChange={onChange}
            options={allOptions.map((opt) => opt.value)}
            isMulti={false}
            allowCreate={true}
            onSaveOption={handleSaveOption}
          />
        );
      } else {
        return (
          <Select
            {...commonProps}
            value={stringValue}
            onChange={onChange}
            options={allOptions}
          />
        );
      }

    case CustomFieldType.MULTISELECT:
      return (
        <ComboBox
          {...commonProps}
          value={stringListValue}
          onChange={onChange}
          options={allOptions.map((opt) => opt.value)}
          isMulti={true}
          allowCreate={allowCreateOptions || false}
          onSaveOption={allowCreateOptions ? handleSaveOption : undefined}
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
          value={dateValue}
          onChange={onChange}
          includeTime={true}
        />
      );

    case CustomFieldType.TIME:
      return (
        <FastDateTimeInput
          {...commonProps}
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
  const openCustomFieldsSettings = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    plugin?.app.saveLocalStorage('journalit:open-custom-fields-settings', '1');
    const modalEl = event.currentTarget.closest('.modal');
    const closeButton = modalEl?.querySelector<HTMLButtonElement>(
      '.modal-close-button'
    );
    closeButton?.click();
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
