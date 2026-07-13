

import React, { useState, useEffect } from 'react';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import {
  CustomFieldValues,
  CustomFieldDefinition,
  CustomFieldType,
} from '../../../../types/customFields';
import { CustomFieldsRenderer } from '../fields/CustomFieldRenderer';
import { FormSection } from '../FormSection';
import { usePlugin, useService } from '../../../../hooks';
import { t } from '../../../../lang/helpers';
import { TradeFormLayoutSettings } from '../../../../settings/types';
import {
  hasPopulatedTradeFormLayoutItem,
  isTradeFormLayoutItemVisible,
} from '../tradeFormLayoutConfig';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isCustomFieldType = (value: unknown): value is CustomFieldType =>
  Object.values<unknown>(CustomFieldType).includes(value);

const isCustomFieldDefinition = (
  value: unknown
): value is CustomFieldDefinition =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.label === 'string' &&
  typeof value.fieldKey === 'string' &&
  isCustomFieldType(value.type) &&
  typeof value.order === 'number';

interface AdvancedTabProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  customFieldValues: CustomFieldValues;

  onCustomFieldChange: (fieldId: string, value: unknown) => void;
  layout: TradeFormLayoutSettings;
  isEditMode: boolean;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({
  data: _data,
  errors,
  onChange: _onChange,
  customFieldValues,
  onCustomFieldChange,
  layout,
  isEditMode,
}) => {
  const plugin = usePlugin();
  const { service: customFieldsService, status } = useService(
    'customFieldsService'
  );
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>([]);

  
  useEffect(() => {
    const loadCustomFields = async () => {
      try {
        if (customFieldsService && status === 'ready') {
          const fields = customFieldsService.getFields();
          setCustomFields(fields);
        }
        
      } catch (error) {
        console.error('Failed to load custom fields:', error);
      }
    };

    void loadCustomFields();

    
    const app = plugin?.app;
    const handleCustomFieldsChanged = (payload: unknown) => {
      if (!payload || typeof payload !== 'object') return;
      if (!('fields' in payload)) return;

      const fields = payload.fields;
      if (Array.isArray(fields) && fields.every(isCustomFieldDefinition)) {
        setCustomFields(fields);
      }
    };

    if (app) {
      app.workspace.on(
        'journalit-custom-fields-changed',
        handleCustomFieldsChanged
      );
    }

    
    return () => {
      if (app) {
        app.workspace.off(
          'journalit-custom-fields-changed',
          handleCustomFieldsChanged
        );
      }
    };
  }, [plugin, customFieldsService, status]); 

  const shouldShowCustomFields =
    isTradeFormLayoutItemVisible(layout, 'customFields') ||
    (isEditMode &&
      hasPopulatedTradeFormLayoutItem({}, 'customFields', customFieldValues)) ||
    Object.keys(errors.customFields ?? {}).length > 0;

  return (
    <div className="trade-form-advanced-tab">
      {shouldShowCustomFields && (
        <FormSection title={t('form.section.custom-fields')}>
          <CustomFieldsRenderer
            fields={customFields}
            values={customFieldValues}
            onChange={onCustomFieldChange}
            errors={errors.customFields || {}}
          />
        </FormSection>
      )}
    </div>
  );
};
