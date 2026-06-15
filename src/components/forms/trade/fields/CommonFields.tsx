

import React, { useState, useMemo, useCallback } from 'react';
import { Input, ComboBox } from '../../../core';
import { FormSection } from '../FormSection';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import { getPluginInstance } from '../../../../utils/pluginContext';
import { CustomOptionsService, OptionType } from '../../../../services/options';
import { useEventBus } from '../../../../hooks';
import { t } from '../../../../lang/helpers';

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

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

interface CommonFieldsProps {
  
  data: Partial<TradeFormData>;
  
  errors: TradeFormErrors;
  
  onChange: (field: keyof TradeFormData, value: TradeFormValue) => void;
  
  accounts?: Array<{ id: string; name: string }>;
  
  setups?: Array<{ id: string; name: string }>;
  
  mistakes?: Array<{ id: string; name: string }>;
}


const CommonFieldsComponent: React.FC<CommonFieldsProps> = ({
  data,
  errors: _errors,
  onChange,
  accounts: _accounts = EMPTY_ACCOUNT_OPTIONS,
  setups: _setups = EMPTY_SETUP_OPTIONS,
  mistakes: _mistakes = EMPTY_MISTAKE_OPTIONS,
}) => {
  
  const [optionsVersion, setOptionsVersion] = useState(0);

  
  const optionsService = useMemo(() => getOptionsService(), []);

  
  const tagOptions = useMemo(() => {
    void optionsVersion;
    try {
      return optionsService.getOptions(OptionType.TAG);
    } catch (error) {
      console.error('Failed to load custom tag options:', error);
      return [];
    }
  }, [optionsService, optionsVersion]);

  const setupOptions = useMemo(() => {
    void optionsVersion;
    try {
      return optionsService.getOptions(OptionType.SETUP);
    } catch (error) {
      console.error('Failed to load setup options:', error);
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

  
  const handleSaveSetup = async (option: string) => {
    try {
      const optionsService = getOptionsService();
      const added = await optionsService.addOption(OptionType.SETUP, option);
      if (added) {
        
        optionsService.notifyOptionsChanged();
      }
    } catch (error) {
      console.error('Failed to save custom setup option:', error);
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

  return (
    <FormSection title={t('form.section.analysis-thesis')}>
      <div className="field">
        <ComboBox
          label={t('form.field.setup')}
          options={setupOptions}
          value={Array.isArray(data.setup) ? data.setup : []}
          onChange={(value) => {
            
            const selectedValues = asStringArray(value);

            
            onChange('setup', selectedValues);
          }}
          allowCreate={true}
          isMulti={true}
          optionType={OptionType.SETUP}
          onSaveOption={handleSaveSetup}
        />
      </div>

      <div className="field">
        <ComboBox
          label={t('form.field.mistake')}
          options={mistakeOptions}
          value={Array.isArray(data.mistake) ? data.mistake : []}
          onChange={(value) => {
            
            const selectedValues = asStringArray(value);

            
            onChange('mistake', selectedValues);
          }}
          allowCreate={true}
          isMulti={true}
          optionType={OptionType.MISTAKE}
          onSaveOption={handleSaveMistake}
        />
      </div>

      <div className="field">
        <ComboBox
          label={t('form.field.custom-tags')}
          options={tagOptions}
          value={Array.isArray(data.customTags) ? data.customTags : []}
          onChange={(value) => {
            

            
            const selectedValues = asStringArray(value);

            onChange('customTags', selectedValues);
          }}
          isMulti={true}
          allowCreate={true}
          placeholder={t('form.placeholder.custom-tag')}
          onSaveOption={handleSaveTag}
          optionType={OptionType.TAG}
        />
      </div>

      <div className="field">
        <Input
          label={t('form.field.trade-thesis')}
          placeholder={t('form.placeholder.thesis')}
          value={data.thesis || ''}
          onChange={(value) => onChange('thesis', value)}
          className="thesisField"
          multiline
        />
      </div>
    </FormSection>
  );
};

export const CommonFields = React.memo(CommonFieldsComponent);
