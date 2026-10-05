

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Input } from '../../../core/Input';
import { ComboBox } from '../../../core/ComboBox';
import { FormSection } from '../FormSection';
import { TradeFormData, TradeFormErrors, TradeFormValue } from '../types';
import { getPluginInstance } from '../../../../utils/pluginContext';
import { CustomOptionsService, OptionType } from '../../../../services/options';
import { useEventBus } from '../../../../hooks/useEventBus';
import { t } from '../../../../lang/helpers';
import { TradeFormLayoutItemId } from '../../../../settings/types';
import { canonicalizeTradeTagSelection } from '../../../../utils/tradeTagNormalization';
import { normalizeSetupKey } from '../../../../services/setup/setupIdentity';
import type { Setup } from '../../../../services/setup/types';
import { logger } from '../../../../utils/logger';

const EMPTY_ACCOUNT_OPTIONS: Array<{ id: string; name: string }> = [];
const EMPTY_SETUP_OPTIONS: Array<{ id: string; name: string }> = [];
const EMPTY_MISTAKE_OPTIONS: Array<{ id: string; name: string }> = [];

type ArchivedSetupIdentity = Pick<Setup, 'id' | 'name' | 'aliases'>;

function getArchivedSetupKeys(
  archivedSetups: readonly ArchivedSetupIdentity[]
): Set<string> {
  const archivedSetupKeys = new Set<string>();

  for (const setup of archivedSetups) {
    for (const reference of [setup.id, setup.name, ...setup.aliases]) {
      const key = normalizeSetupKey(reference);
      if (key) archivedSetupKeys.add(key);
    }
  }

  return archivedSetupKeys;
}

export function isArchivedTradeFormSetupReference(
  reference: string,
  archivedSetups: readonly ArchivedSetupIdentity[]
): boolean {
  return getArchivedSetupKeys(archivedSetups).has(normalizeSetupKey(reference));
}

export function filterArchivedTradeFormSetupOptions(
  options: readonly string[],
  archivedSetups: readonly ArchivedSetupIdentity[]
): string[] {
  const archivedSetupKeys = getArchivedSetupKeys(archivedSetups);

  return options.filter(
    (option) => !archivedSetupKeys.has(normalizeSetupKey(option))
  );
}

export function rejectNewArchivedTradeFormSetupSelections(
  previousSelections: readonly string[],
  nextSelections: readonly string[],
  archivedSetups: readonly ArchivedSetupIdentity[]
): string[] {
  const archivedSetupKeys = getArchivedSetupKeys(archivedSetups);
  const previousSelectionKeys = new Set(
    previousSelections.map(normalizeSetupKey)
  );

  return nextSelections.filter((selection) => {
    const key = normalizeSetupKey(selection);
    return previousSelectionKeys.has(key) || !archivedSetupKeys.has(key);
  });
}

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

const saveSetupOption = async (option: string) => {
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
  const [archivedSetups, setArchivedSetups] = useState<ArchivedSetupIdentity[]>(
    []
  );
  const [hasLoadedArchivedSetups, setHasLoadedArchivedSetups] = useState(false);
  const setupRefreshVersionRef = useRef(0);
  const includesSetupField = fieldOrder.includes('setup');

  
  const optionsService = useMemo(() => getOptionsService(), []);
  const plugin = useMemo(() => getPluginInstance(), []);

  const refreshArchivedSetups = useCallback(async () => {
    if (!includesSetupField || !plugin) return;

    const refreshVersion = ++setupRefreshVersionRef.current;
    try {
      const setupService = await plugin.serviceManager.getSetupService();
      const nextArchivedSetups = await setupService.listExistingSetups({
        status: 'archived',
      });
      if (refreshVersion !== setupRefreshVersionRef.current) return;

      setArchivedSetups(nextArchivedSetups);
      setHasLoadedArchivedSetups(true);
    } catch (error) {
      if (refreshVersion !== setupRefreshVersionRef.current) return;

      logger.debug('Failed to load archived trade form setups', error);
      setHasLoadedArchivedSetups(true);
    }
  }, [includesSetupField, plugin]);

  useEffect(() => {
    void refreshArchivedSetups();
    return () => {
      setupRefreshVersionRef.current += 1;
    };
  }, [refreshArchivedSetups]);

  useEventBus(
    'setup:changed',
    refreshArchivedSetups,
    includesSetupField && Boolean(plugin)
  );

  const handleSaveSetup = useCallback(
    async (option: string) => {
      if (isArchivedTradeFormSetupReference(option, archivedSetups)) return;
      await saveSetupOption(option);
    },
    [archivedSetups]
  );

  
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
      const options = optionsService.getOptions(OptionType.SETUP);
      return hasLoadedArchivedSetups
        ? filterArchivedTradeFormSetupOptions(options, archivedSetups)
        : [];
    } catch (error) {
      console.error('Failed to load setup options:', error);
      return [];
    }
  }, [archivedSetups, hasLoadedArchivedSetups, optionsService, optionsVersion]);

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
              options={setupOptions}
              value={Array.isArray(data.setup) ? data.setup : []}
              onChange={(value) => {
                const previousValues = Array.isArray(data.setup)
                  ? data.setup
                  : [];
                onChange(
                  'setup',
                  rejectNewArchivedTradeFormSetupSelections(
                    previousValues,
                    value,
                    archivedSetups
                  )
                );
              }}
              allowCreate={hasLoadedArchivedSetups}
              isMulti={true}
              onSaveOption={handleSaveSetup}
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
      case 'customTags':
        return (
          <div className="field" key={fieldId}>
            <ComboBox
              label={t('form.field.custom-tags')}
              options={tagOptions}
              value={Array.isArray(data.customTags) ? data.customTags : []}
              onChange={(value) => {
                const previousValues = Array.isArray(data.customTags)
                  ? data.customTags
                  : [];
                const selectedValues = canonicalizeTradeTagSelection(
                  previousValues,
                  value
                );
                onChange('customTags', selectedValues);
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
