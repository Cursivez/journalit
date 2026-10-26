

import React, { useState, useMemo, useCallback } from 'react';
import { Input } from '../../../core/Input';
import { ComboBox } from '../../../core/ComboBox';
import { StarRating } from '../../../shared/StarRating';
import { FormSection } from '../FormSection';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import { getPluginInstance } from '../../../../utils/pluginContext';
import { CustomOptionsService, OptionType } from '../../../../services/options';
import { useEventBus } from '../../../../hooks/useEventBus';
import { useSetupPicker } from '../../../../hooks/useSetupNotes';
import { t } from '../../../../lang/helpers';
import { TradeFormLayoutItemId } from '../../../../settings/types';
import { canonicalizeTradeTagSelection } from '../../../../utils/tradeTagNormalization';

const EMPTY_ACCOUNT_OPTIONS: Array<{ id: string; name: string }> = [];
const EMPTY_SETUP_OPTIONS: Array<{ id: string; name: string }> = [];
const EMPTY_MISTAKE_OPTIONS: Array<{ id: string; name: string }> = [];

function getOptionsService(): CustomOptionsService {
  const plugin = getPluginInstance();
  if (!plugin) {
    throw new Error('Journalit plugin instance is unavailable.');
  }

  return plugin.optionsService ?? new CustomOptionsService(plugin);
}

interface CommonFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  
  accounts?: Array<{ id: string; name: string }>;
  
  setups?: Array<{ id: string; name: string }>;
  
  mistakes?: Array<{ id: string; name: string }>;
  
  fieldOrder: TradeFormLayoutItemId[];
}


const handleSaveTag = async (option: string) => {
  try {
    const optionsService = getOptionsService();
    const added = await optionsService.addOption(OptionType.TAG, option);
    if (added) {
      
      optionsService.notifyOptionsChanged();
    }
  } catch (error) {
    console.error('Failed to save custom tag option:', error);
  }
};

const handleSaveMistake = async (option: string) => {
  try {
    const optionsService = getOptionsService();
    const added = await optionsService.addOption(OptionType.MISTAKE, option);
    if (added) {
      
      optionsService.notifyOptionsChanged();
    }
  } catch (error) {
    console.error('Failed to save custom mistake option:', error);
  }
};

const CommonFieldsComponent: React.FC<CommonFieldsProps> = ({
  data,
  errors: _errors,
  onChange,
  accounts: _accounts = EMPTY_ACCOUNT_OPTIONS,
  setups: _setups = EMPTY_SETUP_OPTIONS,
  mistakes: _mistakes = EMPTY_MISTAKE_OPTIONS,
  fieldOrder,
}) => {
  
  const [optionsVersion, setOptionsVersion] = useState(0);
  const includesSetupField = fieldOrder.includes('setup');

  
  const optionsService = useMemo(() => getOptionsService(), []);
  const plugin = useMemo(() => getPluginInstance(), []);
  const setupPicker = useSetupPicker(plugin, includesSetupField);

  
  const tagOptions = useMemo(() => {
    void optionsVersion;
    try {
      return optionsService.getOptions(OptionType.TAG);
    } catch (error) {
      console.error('Failed to load custom tag options:', error);
      return [];
    }
  }, [optionsService, optionsVersion]);

  const mistakeOptions = useMemo(() => {
    void optionsVersion;
    try {
      return optionsService.getOptions(OptionType.MISTAKE);
    } catch (error) {
      console.error('Failed to load mistake options:', error);
      return [];
    }
  }, [optionsService, optionsVersion]);

  
  const handleOptionsChanged = useCallback(() => {
    setOptionsVersion((prev) => prev + 1);
  }, []);

  
  useEventBus('options:changed', handleOptionsChanged);

  

  

  

  const renderField = (fieldId: TradeFormLayoutItemId) => {
    switch (fieldId) {
      case 'setup':
        return (
          <div className="field" key={fieldId}>
            <ComboBox
              label={t('form.field.setup')}
              options={setupPicker.options}
              value={Array.isArray(data.setup) ? data.setup : []}
              onChange={(value) => {
                const previousValues = Array.isArray(data.setup)
                  ? data.setup
                  : [];
                onChange(
                  'setup',
                  setupPicker.filterSelection(previousValues, value)
                );
              }}
              allowCreate={setupPicker.loaded}
              isMulti={true}
              onSaveOption={setupPicker.saveSetup}
            />
          </div>
        );
      case 'mistake':
        return (
          <div className="field" key={fieldId}>
            <ComboBox
              label={t('form.field.mistake')}
              options={mistakeOptions}
              value={Array.isArray(data.mistake) ? data.mistake : []}
              onChange={(value) => onChange('mistake', value)}
              allowCreate={true}
              isMulti={true}
              onSaveOption={handleSaveMistake}
            />
          </div>
        );
      case 'tags':
        return (
          <div className="field" key={fieldId}>
            <ComboBox
              label={t('form.field.tags')}
              options={tagOptions}
              value={Array.isArray(data.tags) ? data.tags : []}
              onChange={(value) => {
                const previousValues = Array.isArray(data.tags)
                  ? data.tags
                  : [];
                const selectedValues = canonicalizeTradeTagSelection(
                  previousValues,
                  value
                );
                onChange('tags', selectedValues);
              }}
              isMulti={true}
              allowCreate={true}
              placeholder={t('form.placeholder.custom-tag')}
              onSaveOption={handleSaveTag}
            />
          </div>
        );
      case 'thesis':
        return (
          <div className="field" key={fieldId}>
            <Input
              label={t('form.field.trade-thesis')}
              placeholder={t('form.placeholder.thesis')}
              value={data.thesis || ''}
              onChange={(value) => onChange('thesis', value)}
              className="thesisField"
              multiline
            />
          </div>
        );
      case 'rating':
        return (
          <div className="field" key={fieldId}>
            <span className="label">{t('trade.rating.label')}</span>
            <StarRating
              value={data.tradeRating}
              label={t('trade.rating.label')}
              hint={t('trade.rating.hint')}
              size="lg"
              clearable
              onChange={(value) => onChange('tradeRating', value ?? undefined)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FormSection title={t('form.section.analysis-thesis')}>
      {fieldOrder.map(renderField)}
    </FormSection>
  );
};

export const CommonFields = React.memo(CommonFieldsComponent);
