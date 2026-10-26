

import React, { useReducer, useEffect } from 'react';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import type { CustomFieldValues } from '../../../../types/customFields';
import { CustomFieldsRenderer } from '../fields/CustomFieldRenderer';
import { FormSection } from '../FormSection';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useService } from '../../../../hooks/useService';
import { t } from '../../../../lang/helpers';
import { TradeFormLayoutSettings } from '../../../../settings/types';
import {
  hasPopulatedTradeFormLayoutItem,
  isTradeFormLayoutItemVisible,
} from '../tradeFormLayoutConfig';

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
  const { error } = useService('customFieldsService');
  const [, invalidateFields] = useReducer(
    (revision: number) => revision + 1,
    0
  );
  const manager = plugin?.serviceManager;
  
  
  
  const customFieldsService = manager?.isServiceInitialized(
    'customFieldsService'
  )
    ? manager.getCustomFieldsService()
    : null;
  const customFields = customFieldsService?.getFields() ?? null;

  
  
  useEffect(() => {
    const app = plugin?.app;
    if (!app) return;
    const handleCustomFieldsChanged = () => invalidateFields();
    app.workspace.on(
      'journalit-custom-fields-changed',
      handleCustomFieldsChanged
    );
    
    invalidateFields();
    return () => {
      app.workspace.off(
        'journalit-custom-fields-changed',
        handleCustomFieldsChanged
      );
    };
  }, [plugin]);

  const shouldShowCustomFields =
    isTradeFormLayoutItemVisible(layout, 'customFields') ||
    (isEditMode &&
      hasPopulatedTradeFormLayoutItem({}, 'customFields', customFieldValues)) ||
    Object.keys(errors.customFields ?? {}).length > 0;

  return (
    <div className="trade-form-advanced-tab">
      {shouldShowCustomFields && (
        <FormSection title={t('form.section.custom-fields')}>
          {customFields ? (
            <CustomFieldsRenderer
              fields={customFields}
              values={customFieldValues}
              onChange={onCustomFieldChange}
              errors={errors.customFields || {}}
            />
          ) : error ? (
            <div role="alert" className="errorMessage">
              {error.message}
            </div>
          ) : (
            <div role="status">{t('common.loading')}</div>
          )}
        </FormSection>
      )}
    </div>
  );
};
