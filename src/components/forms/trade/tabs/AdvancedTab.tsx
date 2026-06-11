

import React, { useState, useEffect } from 'react';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import {
  CustomFieldValues,
  CustomFieldDefinition,
} from '../../../../types/customFields';
import { CustomFieldsRenderer } from '../fields/CustomFieldRenderer';
import { FormSection } from '../FormSection';
import { usePlugin, useService } from '../../../../hooks';
import { t } from '../../../../lang/helpers';

interface AdvancedTabProps {
  data: Partial<TradeFormData>;
  errors: TradeFormErrors;
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  customFieldValues: CustomFieldValues;

  onCustomFieldChange: (fieldId: string, value: any) => void;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({
  data: _data,
  errors,
  onChange: _onChange,
  customFieldValues,
  onCustomFieldChange,
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

    loadCustomFields();

    
    const app = plugin?.app;
    const handleCustomFieldsChanged = (payload: unknown) => {
      if (!payload || typeof payload !== 'object') return;
      if (!('fields' in payload)) return;

      const fields = (payload as { fields?: unknown }).fields;
      if (Array.isArray(fields)) {
        setCustomFields(fields as CustomFieldDefinition[]);
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

  return (
    <div className="trade-form-advanced-tab">
      <FormSection title={t('form.section.custom-fields')}>
        <CustomFieldsRenderer
          fields={customFields}
          values={customFieldValues}
          onChange={onCustomFieldChange}
          errors={errors.customFields || {}}
        />
      </FormSection>
    </div>
  );
};
