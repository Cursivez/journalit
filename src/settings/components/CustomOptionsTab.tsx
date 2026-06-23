

import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  Check,
  X,
  Edit,
  Trash,
  Lock,
  ChevronDown,
} from '../../components/shared/icons/ObsidianIcon';
import { App, Notice, Modal } from 'obsidian';
import { hasTranslation, t } from '../../lang/helpers';
import { ErrorHandler } from '../../utils/errorHandler';
import JournalitPlugin from '../../main';

import {
  CustomOptionsService,
  OptionType,
  FuturesInstrumentData,
  ForexInstrumentData,
  CfdInstrumentData,
  InstrumentData,
  EventOptionData,
  InstrumentCommissionRule,
  InstrumentCommissionRuleMethod,
} from '../../services/options/CustomOptionsService';
import { AssetType } from '../../components/forms/trade/types';
import { getCurrencyOptions } from '../../utils/currencyConfig';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { NoTooltipButton } from '../../components/ui/NoTooltipButton';
import type { SymbolMapping } from '../../settings/types';


class AdvancedConfirmationModal extends Modal {
  constructor(
    app: App,
    private message: string,
    private onConfirm: (updateNotes: boolean) => void
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('p', { text: this.message });
    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    
    buttonContainer
      .createEl('button', {
        text: t('settings.customization.options.confirm.update-notes'),
        cls: 'mod-cta',
      })
      .addEventListener('click', () => {
        this.close();
        this.onConfirm(true);
      });

    
    buttonContainer
      .createEl('button', {
        text: t('settings.customization.options.confirm.save-name'),
      })
      .addEventListener('click', () => {
        this.close();
        this.onConfirm(false);
      });

    
    buttonContainer
      .createEl('button', {
        text: t('settings.customization.options.confirm.cancel'),
      })
      .addEventListener('click', () => {
        this.close();
        
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


class ResetConfirmationModal extends Modal {
  constructor(
    app: App,
    private message: string,
    private onConfirm: () => void | Promise<void>
  ) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('p', { text: this.message });
    const buttonContainer = contentEl.createDiv({
      cls: 'modal-button-container journalit-modal-button-container',
    });

    
    buttonContainer
      .createEl('button', { text: t('button.reset'), cls: 'mod-warning' })
      .addEventListener('click', () => {
        this.close();
        void this.onConfirm();
      });

    
    buttonContainer
      .createEl('button', { text: t('button.cancel') })
      .addEventListener('click', () => {
        this.close();
      });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

interface CustomOptionsTabProps {
  plugin: JournalitPlugin;
  filterType?: OptionType; 
  showSymbolMappings?: boolean; 
}

interface OptionInfo {
  text: string;
  isEditing: boolean;
  editValue: string;
  editAssetType?: string; 
  originalAssetType?: string;
  
  editDollarPerPoint?: string;
  editTickSize?: string;
  editTickValue?: string;
  
  editLotSize?: string;
  editPipValue?: string;
  editPipSize?: string;
  
  editContractSize?: string;
  editCurrency?: string;
  editCommissionRules?: CommissionRuleDraft[];
  
  editColor?: string;
  editNotes?: string;
}


const EVENT_COLORS = ['gray', 'red', 'orange', 'yellow'] as const;


const CUSTOM_OPTION_TYPES = [
  OptionType.INSTRUMENT,
  OptionType.ACCOUNT,
  OptionType.ACCOUNT_TYPE,
  OptionType.SETUP,
  OptionType.MISTAKE,
  OptionType.TAG,
  OptionType.EVENT,
] as const;

const isOptionType = (type: string): type is OptionType => {
  switch (type) {
    case 'instrument':
    case 'account':
    case 'account_type':
    case 'setup':
    case 'mistake':
    case 'tag':
    case 'event':
      return true;
    default:
      return false;
  }
};

type OptionsState = {
  ['instrument']: InstrumentData[];
  ['account']: string[];
  ['account_type']: string[];
  ['setup']: string[];
  ['mistake']: string[];
  ['tag']: string[];
  ['event']: EventOptionData[];
};

type EditStates = Record<string, Record<string, OptionInfo>>;

const EMPTY_OPTIONS_STATE: OptionsState = {
  [OptionType.INSTRUMENT]: [],
  [OptionType.ACCOUNT]: [],
  [OptionType.ACCOUNT_TYPE]: [],
  [OptionType.SETUP]: [],
  [OptionType.MISTAKE]: [],
  [OptionType.TAG]: [],
  [OptionType.EVENT]: [],
};

type CommissionRuleDraft = {
  account: string;
  method: InstrumentCommissionRuleMethod;
  entryCommission: string;
  exitCommission: string;
  roundTripCommission: string;
};

interface CommissionAccountDropdownProps {
  accounts: string[];
  value: string;
  onChange: (account: string) => void;
}

const CommissionAccountDropdown: React.FC<CommissionAccountDropdownProps> = ({
  accounts,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const allAccountsLabel = t(
    'settings.customization.options.commission.all-accounts'
  );
  const summary = value || allAccountsLabel;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (
        dropdownRef.current &&
        target instanceof Node &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    window.activeDocument.addEventListener('mousedown', handleClickOutside);
    return () =>
      window.activeDocument.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  const handleSelect = (account: string) => {
    onChange(account);
    setIsOpen(false);
  };

  return (
    <div
      className="custom-options-commission-account-dropdown"
      ref={dropdownRef}
    >
      <button
        type="button"
        className="custom-options-commission-account-dropdown__trigger clickable-icon"
        aria-label={summary}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <span className="custom-options-commission-account-dropdown__summary">
          {summary}
        </span>
        <ChevronDown
          size={14}
          className={`custom-options-commission-account-dropdown__chevron${isOpen ? ' custom-options-commission-account-dropdown__chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="custom-options-commission-account-dropdown__menu">
          <button
            type="button"
            className={`custom-options-commission-account-dropdown__option${value ? '' : ' custom-options-commission-account-dropdown__option--active'}`}
            aria-pressed={!value}
            onClick={() => handleSelect('')}
          >
            <span className="custom-options-commission-account-dropdown__option-label">
              {allAccountsLabel}
            </span>
          </button>
          {accounts.map((account) => (
            <button
              key={account}
              type="button"
              className={`custom-options-commission-account-dropdown__option${value === account ? ' custom-options-commission-account-dropdown__option--active' : ''}`}
              aria-pressed={value === account}
              onClick={() => handleSelect(account)}
            >
              <span className="custom-options-commission-account-dropdown__option-label">
                {account}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

type BuildEditStatesOptions = {
  closeEditingFor?: {
    type: string;
    optionKey: string;
  };
  types?: string[];
};

type BuildEditStatesRuntimeOptions = BuildEditStatesOptions & {
  previousEditStates?: EditStates;
};

const createStringEditState = (option: string): OptionInfo => ({
  text: option,
  isEditing: false,
  editValue: option,
});

const createEventEditState = (event: EventOptionData): OptionInfo => ({
  text: event.name,
  isEditing: false,
  editValue: event.name,
  editColor: event.color || 'gray',
  editNotes: event.notes || '',
});

const createCommissionRuleDraft = (
  rule?: InstrumentCommissionRule
): CommissionRuleDraft => ({
  account: rule?.account || '',
  method: rule?.method || 'perSide',
  entryCommission: rule?.entryCommission?.toString() || '',
  exitCommission: rule?.exitCommission?.toString() || '',
  roundTripCommission: rule?.roundTripCommission?.toString() || '',
});

const parseCommissionRules = (
  drafts?: CommissionRuleDraft[]
): InstrumentCommissionRule[] | undefined => {
  if (!drafts) return undefined;

  const rules = drafts.reduce<InstrumentCommissionRule[]>((acc, draft) => {
    const rule = {
      account: draft.account.trim() || undefined,
      method: draft.method,
      entryCommission:
        draft.method === 'perSide'
          ? parseFloat(draft.entryCommission) || 0
          : undefined,
      exitCommission:
        draft.method === 'perSide'
          ? parseFloat(draft.exitCommission) || 0
          : undefined,
      roundTripCommission:
        draft.method === 'roundTrip'
          ? parseFloat(draft.roundTripCommission) || 0
          : undefined,
    };
    if (
      rule.method === 'roundTrip'
        ? (rule.roundTripCommission ?? 0) > 0
        : (rule.entryCommission ?? 0) > 0 || (rule.exitCommission ?? 0) > 0
    ) {
      acc.push(rule);
    }
    return acc;
  }, []);

  const allAccountsRule = rules.find((rule) => !rule.account);
  if (allAccountsRule) return [allAccountsRule];

  return rules;
};

const createInstrumentEditState = (instrument: InstrumentData): OptionInfo => {
  const editState: OptionInfo = {
    text: instrument.name,
    isEditing: false,
    editValue: instrument.name,
    editAssetType: instrument.assetType,
    originalAssetType: instrument.assetType,
  };

  if (instrument.assetType === 'futures' && instrument.futuresData) {
    editState.editDollarPerPoint =
      instrument.futuresData.dollarPerPoint?.toString() || '';
    editState.editTickSize = instrument.futuresData.tickSize?.toString() || '';
    editState.editTickValue =
      instrument.futuresData.tickValue?.toString() || '';
  }

  if (instrument.assetType === 'forex' && instrument.forexData) {
    editState.editLotSize = instrument.forexData.lotSize?.toString() || '';
    editState.editPipValue = instrument.forexData.pipValue?.toString() || '';
    editState.editPipSize = instrument.forexData.pipSize?.toString() || '';
  }

  if (instrument.assetType === 'cfd') {
    if (instrument.cfdData) {
      editState.editContractSize =
        instrument.cfdData.contractSize?.toString() || '';
    }
    editState.editCurrency = instrument.currency || '';
  }

  editState.editCommissionRules = instrument.commissionRules?.map(
    createCommissionRuleDraft
  );

  return editState;
};

function allOptionsForType(
  options: OptionsState[OptionType],
  type: OptionType.INSTRUMENT
): InstrumentData[];
function allOptionsForType(
  options: OptionsState[OptionType],
  type: OptionType.EVENT
): EventOptionData[];
function allOptionsForType(
  options: OptionsState[OptionType],
  type:
    | OptionType.ACCOUNT
    | OptionType.ACCOUNT_TYPE
    | OptionType.SETUP
    | OptionType.MISTAKE
    | OptionType.TAG
): string[];
function allOptionsForType(
  options: OptionsState[OptionType],
  _type: OptionType
): OptionsState[OptionType] {
  return options;
}

const buildEditStatesForType = (
  type: OptionType,
  typeOptions: OptionsState[OptionType]
): Record<string, OptionInfo> => {
  const typeEditStates: Record<string, OptionInfo> = {};

  switch (type) {
    case OptionType.INSTRUMENT:
      allOptionsForType(typeOptions, type).forEach((instrument) => {
        typeEditStates[instrument.name] = createInstrumentEditState(instrument);
      });
      break;
    case OptionType.EVENT:
      allOptionsForType(typeOptions, type).forEach((event) => {
        typeEditStates[event.name] = createEventEditState(event);
      });
      break;
    case OptionType.ACCOUNT:
    case OptionType.ACCOUNT_TYPE:
    case OptionType.SETUP:
    case OptionType.MISTAKE:
    case OptionType.TAG:
      allOptionsForType(typeOptions, type).forEach((option) => {
        typeEditStates[option] = createStringEditState(option);
      });
      break;
  }

  return typeEditStates;
};

const buildEditStates = (
  allOptions: OptionsState,
  {
    previousEditStates,
    closeEditingFor,
    types,
  }: BuildEditStatesRuntimeOptions = {}
): EditStates => {
  const nextEditStates: EditStates = {};

  CUSTOM_OPTION_TYPES.forEach((type) => {
    if (types && !types.includes(type)) {
      return;
    }

    nextEditStates[type] = buildEditStatesForType(type, allOptions[type]);

    if (!previousEditStates) {
      return;
    }

    Object.entries(nextEditStates[type]).forEach(([optionKey, optionState]) => {
      const shouldCloseEditing =
        closeEditingFor?.type === type &&
        closeEditingFor.optionKey === optionKey;

      nextEditStates[type][optionKey] = {
        ...optionState,
        isEditing: shouldCloseEditing
          ? false
          : (previousEditStates[type]?.[optionKey]?.isEditing ?? false),
      };
    });
  });

  return nextEditStates;
};

type TickerSpecsDraft = {
  dollarPerPoint: string;
  tickSize: string;
  tickValue: string;
  lotSize: string;
  pipValue: string;
  pipSize: string;
  contractSize: string;
  currency: string;
};

type NewMappingDraft = {
  importedSymbol: string;
  baseSymbol: string;
};

type StateUpdater<T> = T | ((previous: T) => T);

type ViewModelState = {
  options: OptionsState;
  editStates: EditStates;
  newOptionValues: Record<string, string>;
  newAssetType: string;
  newTickerSpecs: TickerSpecsDraft;
  newEventColor: string;
  newEventNotes: string;
  symbolMappings: SymbolMapping[];
  newMapping: NewMappingDraft;
};

type ViewModelAction =
  | {
      type: 'apply-reloaded-options';
      allOptions: OptionsState;
      options?: BuildEditStatesOptions & { mergeWithPrevious?: boolean };
    }
  | { type: 'set-edit-states'; value: StateUpdater<EditStates> }
  | {
      type: 'set-new-option-values';
      value: StateUpdater<Record<string, string>>;
    }
  | { type: 'set-new-asset-type'; value: string }
  | { type: 'set-new-ticker-specs'; value: StateUpdater<TickerSpecsDraft> }
  | { type: 'set-new-event-color'; value: string }
  | { type: 'set-new-event-notes'; value: string }
  | { type: 'set-symbol-mappings'; value: SymbolMapping[] }
  | { type: 'set-new-mapping'; value: StateUpdater<NewMappingDraft> };

const DEFAULT_TICKER_SPECS: TickerSpecsDraft = {
  dollarPerPoint: '',
  tickSize: '',
  tickValue: '',
  lotSize: '',
  pipValue: '',
  pipSize: '',
  contractSize: '',
  currency: '',
};

const DEFAULT_NEW_MAPPING: NewMappingDraft = {
  importedSymbol: '',
  baseSymbol: '',
};

const createDefaultTickerSpecs = (): TickerSpecsDraft => ({
  ...DEFAULT_TICKER_SPECS,
});

const createDefaultNewMapping = (): NewMappingDraft => ({
  ...DEFAULT_NEW_MAPPING,
});

const INITIAL_VIEW_MODEL_STATE: ViewModelState = {
  options: EMPTY_OPTIONS_STATE,
  editStates: {},
  newOptionValues: {},
  newAssetType: 'stock',
  newTickerSpecs: createDefaultTickerSpecs(),
  newEventColor: 'gray',
  newEventNotes: '',
  symbolMappings: [],
  newMapping: createDefaultNewMapping(),
};

const isStateUpdaterFunction = <T,>(
  value: StateUpdater<T>
): value is (previous: T) => T => typeof value === 'function';

const resolveUpdater = <T,>(value: StateUpdater<T>, previous: T): T =>
  isStateUpdaterFunction(value) ? value(previous) : value;

const customOptionsTabReducer = (
  state: ViewModelState,
  action: ViewModelAction
): ViewModelState => {
  switch (action.type) {
    case 'apply-reloaded-options': {
      const {
        closeEditingFor,
        types,
        mergeWithPrevious = false,
      } = action.options ?? {};

      const previousEditStates = closeEditingFor ? state.editStates : undefined;

      const nextEditStates = buildEditStates(action.allOptions, {
        previousEditStates,
        closeEditingFor,
        types,
      });

      return {
        ...state,
        options: action.allOptions,
        editStates: mergeWithPrevious
          ? { ...state.editStates, ...nextEditStates }
          : nextEditStates,
      };
    }
    case 'set-edit-states':
      return {
        ...state,
        editStates: resolveUpdater(action.value, state.editStates),
      };
    case 'set-new-option-values':
      return {
        ...state,
        newOptionValues: resolveUpdater(action.value, state.newOptionValues),
      };
    case 'set-new-asset-type':
      return { ...state, newAssetType: action.value };
    case 'set-new-ticker-specs':
      return {
        ...state,
        newTickerSpecs: resolveUpdater(action.value, state.newTickerSpecs),
      };
    case 'set-new-event-color':
      return { ...state, newEventColor: action.value };
    case 'set-new-event-notes':
      return { ...state, newEventNotes: action.value };
    case 'set-symbol-mappings':
      return { ...state, symbolMappings: action.value };
    case 'set-new-mapping':
      return {
        ...state,
        newMapping: resolveUpdater(action.value, state.newMapping),
      };
    default:
      return state;
  }
};

const useCustomOptionsTabViewModel = (
  optionsService: CustomOptionsService,
  plugin: JournalitPlugin
) => {
  const [state, dispatch] = useReducer(
    customOptionsTabReducer,
    INITIAL_VIEW_MODEL_STATE
  );

  const setEditStates = useCallback((value: StateUpdater<EditStates>) => {
    dispatch({ type: 'set-edit-states', value });
  }, []);

  const setNewOptionValues = useCallback(
    (value: StateUpdater<Record<string, string>>) => {
      dispatch({ type: 'set-new-option-values', value });
    },
    []
  );

  const setNewAssetType = useCallback((value: string) => {
    dispatch({ type: 'set-new-asset-type', value });
  }, []);

  const setNewTickerSpecs = useCallback(
    (value: StateUpdater<TickerSpecsDraft>) => {
      dispatch({ type: 'set-new-ticker-specs', value });
    },
    []
  );

  const setNewEventColor = useCallback((value: string) => {
    dispatch({ type: 'set-new-event-color', value });
  }, []);

  const setNewEventNotes = useCallback((value: string) => {
    dispatch({ type: 'set-new-event-notes', value });
  }, []);

  const setSymbolMappings = useCallback((value: SymbolMapping[]) => {
    dispatch({ type: 'set-symbol-mappings', value });
  }, []);

  const setNewMapping = useCallback((value: StateUpdater<NewMappingDraft>) => {
    dispatch({ type: 'set-new-mapping', value });
  }, []);

  const applyReloadedOptions = useCallback(
    (
      allOptions: OptionsState,
      options: BuildEditStatesOptions & { mergeWithPrevious?: boolean } = {}
    ) => {
      dispatch({
        type: 'apply-reloaded-options',
        allOptions,
        options,
      });
    },
    []
  );

  const reloadOptionsState = useCallback(
    async (
      options: BuildEditStatesOptions & { mergeWithPrevious?: boolean } = {}
    ) => {
      await optionsService.reloadOptions();
      const allOptions = optionsService.getAllOptions() as OptionsState;
      applyReloadedOptions(allOptions, options);
      return allOptions;
    },
    [applyReloadedOptions, optionsService]
  );

  const reloadSymbolMappings = useCallback(() => {
    plugin.specService.loadMappings();
    setSymbolMappings([...plugin.specService.getAllMappings()]);
  }, [plugin, setSymbolMappings]);

  return {
    ...state,
    setEditStates,
    setNewOptionValues,
    setNewAssetType,
    setNewTickerSpecs,
    setNewEventColor,
    setNewEventNotes,
    setSymbolMappings,
    setNewMapping,
    reloadOptionsState,
    reloadSymbolMappings,
  };
};

const useCustomOptionsTabController = ({
  plugin,
  filterType,
  showSymbolMappings = false,
}: CustomOptionsTabProps) => {
  
  const [optionsService] = useState<CustomOptionsService>(
    plugin.optionsService
  );

  const {
    options,
    editStates,
    newOptionValues,
    newAssetType,
    newTickerSpecs,
    newEventColor,
    newEventNotes,
    symbolMappings,
    newMapping,
    setEditStates,
    setNewOptionValues,
    setNewAssetType,
    setNewTickerSpecs,
    setNewEventColor,
    setNewEventNotes,
    setNewMapping,
    reloadOptionsState,
    reloadSymbolMappings,
  } = useCustomOptionsTabViewModel(optionsService, plugin);

  
  useEffect(() => {
    const loadOptions = async () => {
      await reloadOptionsState();
    };

    void loadOptions();
  }, [plugin, optionsService, reloadOptionsState]); 

  
  useEffect(() => {
    reloadSymbolMappings();
  }, [reloadSymbolMappings]);

  
  const getDisplayName = (type: string): string => {
    switch (type) {
      case 'instrument':
        return t('settings.customization.options.type.tickers');
      case 'account':
        return t('settings.customization.options.type.accounts');
      case 'account_type':
        return t('settings.customization.options.type.account-types');
      case 'setup':
        return t('settings.customization.options.type.setups');
      case 'mistake':
        return t('settings.customization.options.type.mistakes');
      case 'tag':
        return t('settings.customization.options.type.tags');
      case 'event':
        return t('settings.customization.options.type.events');
      default:
        return type;
    }
  };

  
  const getAssetTypeDisplayName = (assetType: string | undefined): string => {
    if (!assetType) {
      return t('form.field.asset-type.stock');
    }

    switch (assetType) {
      case 'stock':
        return t('form.field.asset-type.stock');
      case 'options':
        return t('form.field.asset-type.options');
      case 'futures':
        return t('form.field.asset-type.futures');
      case 'forex':
        return t('form.field.asset-type.forex');
      case 'crypto':
        return t('form.field.asset-type.crypto');
      case 'cfd':
        return t('settings.customization.options.asset-type.cfd');
      default:
        return assetType.charAt(0).toUpperCase() + assetType.slice(1);
    }
  };

  
  const startEditing = (type: string, optionKey: string) => {
    
    if (type === 'account_type' && optionKey.toLowerCase() === 'archived') {
      return;
    }

    setEditStates((prev) => {
      
      const typeState = prev[type] || {};
      
      const optionState = typeState[optionKey] || {
        text: optionKey,
        isEditing: false,
        editValue: optionKey,
      };

      
      let editAssetType;
      const updatedOptionState = { ...optionState };
      if (type === 'instrument') {
        const instrument = options['instrument'].find(
          (i) => i.name === optionKey
        );
        editAssetType = instrument?.assetType || 'stock';

        
        if (editAssetType === 'futures' || editAssetType === 'forex') {
          const builtInSpecs = plugin.specService.getSpecsForSymbol(
            optionKey,
            editAssetType
          );

          
          const hasExistingSpecs =
            editAssetType === 'futures'
              ? instrument?.futuresData &&
                (instrument.futuresData.dollarPerPoint ?? 0) > 0
              : instrument?.forexData &&
                (instrument.forexData.lotSize ?? 0) > 0;

          if (builtInSpecs && !hasExistingSpecs) {
            if (
              editAssetType === 'futures' &&
              'dollarPerPoint' in builtInSpecs
            ) {
              updatedOptionState.editDollarPerPoint =
                builtInSpecs.dollarPerPoint.toString();
              updatedOptionState.editTickSize =
                builtInSpecs.tickSize.toString();
              updatedOptionState.editTickValue =
                builtInSpecs.tickValue.toString();
            } else if (editAssetType === 'forex' && 'lotSize' in builtInSpecs) {
              updatedOptionState.editLotSize = builtInSpecs.lotSize.toString();
              updatedOptionState.editPipValue =
                builtInSpecs.pipValue.toString();
              updatedOptionState.editPipSize = builtInSpecs.pipSize.toString();
            }
          }
        }
      } else if (type === 'event') {
        const event = options['event'].find((e) => e.name === optionKey);
        updatedOptionState.editColor = event?.color || 'gray';
        updatedOptionState.editNotes = event?.notes || '';
      }

      return {
        ...prev,
        [type]: {
          ...typeState,
          [optionKey]: {
            ...updatedOptionState,
            isEditing: true,
            editValue: optionKey, 
            editAssetType, 
          },
        },
      };
    });

    
    window.setTimeout(() => {
      
      const inputElement = window.activeDocument.querySelector(
        `.option-edit-input[data-option="${CSS.escape(optionKey)}"]`
      );
      if (inputElement instanceof HTMLInputElement) {
        inputElement.focus({ preventScroll: true });
        inputElement.select(); 
      }
    }, 50);
  };

  
  const cancelEditing = (type: string, optionKey: string) => {
    setEditStates((prev) => {
      const typeState = prev[type] || {};
      const optionState = typeState[optionKey];
      
      if (!optionState) return prev;

      return {
        ...prev,
        [type]: {
          ...typeState,
          [optionKey]: {
            ...optionState,
            isEditing: false,
          },
        },
      };
    });
  };

  
  const resetFocusState = () => {
    try {
      
      if (window.activeDocument.activeElement instanceof HTMLElement) {
        window.activeDocument.activeElement.blur();
      }

      
      const hiddenInput = window.activeDocument.createElement('input');
      hiddenInput.classList.add('jl-focus-reset-input');
      window.activeDocument.body.appendChild(hiddenInput);

      
      window.requestAnimationFrame(() => {
        hiddenInput.focus();
        window.requestAnimationFrame(() => {
          hiddenInput.blur();
          if (window.activeDocument.body.contains(hiddenInput)) {
            window.activeDocument.body.removeChild(hiddenInput);
          }
        });
      });
    } catch (error) {
      console.error('Failed to reset focus state:', error);
    }
  };

  
  const handleAddOption = async (type: string) => {
    const newValue = newOptionValues[type]?.trim();

    if (!newValue) {
      new Notice(t('settings.customization.options.notice.empty-name'));
      return;
    }

    
    if (type === 'instrument') {
      const tickerPattern = /^[A-Z0-9.]+$/i;
      if (!tickerPattern.test(newValue)) {
        new Notice(t('settings.customization.options.notice.invalid-ticker'));
        return;
      }
    }

    if (!isOptionType(type)) {
      return;
    }
    const optionType: OptionType = type;

    
    resetFocusState();

    try {
      let success = false;
      if (optionType === OptionType.EVENT) {
        
        success = newEventNotes
          ? await optionsService.addOrUpdateEventOption(
              newValue,
              newEventColor,
              newEventNotes
            )
          : await optionsService.addOrUpdateEventOption(
              newValue,
              newEventColor
            );
      } else if (optionType === OptionType.INSTRUMENT) {
        
        let futuresData: FuturesInstrumentData | undefined = undefined;
        if (newAssetType === 'futures') {
          const dollarPerPoint = newTickerSpecs.dollarPerPoint?.trim()
            ? parseFloat(newTickerSpecs.dollarPerPoint)
            : undefined;
          const tickSize = newTickerSpecs.tickSize?.trim()
            ? parseFloat(newTickerSpecs.tickSize)
            : undefined;
          const tickValue = newTickerSpecs.tickValue?.trim()
            ? parseFloat(newTickerSpecs.tickValue)
            : undefined;

          if (
            dollarPerPoint !== undefined ||
            tickSize !== undefined ||
            tickValue !== undefined
          ) {
            futuresData = {
              dollarPerPoint: dollarPerPoint !== undefined ? dollarPerPoint : 0,
              tickSize: tickSize !== undefined ? tickSize : 0,
              tickValue: tickValue !== undefined ? tickValue : 0,
            };
          }
        }

        
        let forexData: ForexInstrumentData | undefined = undefined;
        if (newAssetType === 'forex') {
          const lotSize = newTickerSpecs.lotSize?.trim()
            ? parseFloat(newTickerSpecs.lotSize)
            : undefined;
          const pipValue = newTickerSpecs.pipValue?.trim()
            ? parseFloat(newTickerSpecs.pipValue)
            : undefined;
          const pipSize = newTickerSpecs.pipSize?.trim()
            ? parseFloat(newTickerSpecs.pipSize)
            : undefined;

          if (
            lotSize !== undefined ||
            pipValue !== undefined ||
            pipSize !== undefined
          ) {
            forexData = {
              lotSize: lotSize !== undefined ? lotSize : 0,
              pipValue: pipValue !== undefined ? pipValue : 0,
              pipSize: pipSize !== undefined ? pipSize : 0,
            };
          }
        }

        let cfdData: CfdInstrumentData | undefined = undefined;
        if (newAssetType === 'cfd') {
          const contractSize = newTickerSpecs.contractSize?.trim()
            ? parseFloat(newTickerSpecs.contractSize)
            : undefined;

          if (contractSize !== undefined) {
            cfdData = { contractSize };
          }
        }

        const instrumentCurrency =
          newAssetType === 'cfd'
            ? newTickerSpecs.currency?.trim() || undefined
            : undefined;

        
        success = await optionsService.addOption(
          optionType,
          newValue,
          newAssetType,
          futuresData,
          forexData,
          cfdData,
          instrumentCurrency
        );
      } else {
        
        success = await optionsService.addOption(optionType, newValue);
      }

      if (success) {
        new Notice(
          t('settings.customization.options.notice.added', {
            newValue,
            type: getDisplayName(type),
          })
        );
        
        setNewOptionValues((prev) => ({ ...prev, [type]: '' }));
        
        if (optionType === OptionType.INSTRUMENT) {
          setNewTickerSpecs(createDefaultTickerSpecs());
        }
        
        if (optionType === OptionType.EVENT) {
          setNewEventColor('gray');
          setNewEventNotes('');
        }

        await reloadOptionsState();
      } else {
        ErrorHandler.showError(
          new Error(
            t('settings.customization.options.notice.duplicate', { newValue })
          ),
          ErrorHandler.createContext(
            `add ${getDisplayName(type).toLowerCase()} option`
          )
        );
      }
    } catch (error) {
      ErrorHandler.handleError(
        error,
        ErrorHandler.createContext(
          `add ${getDisplayName(type).toLowerCase()} option`
        )
      );
    }
  };

  
  const updateEditValue = (type: string, optionKey: string, value: string) => {
    setEditStates((prev) => {
      const typeState = prev[type] || {};
      const optionState = typeState[optionKey];
      
      if (!optionState) {
        
        console.warn(
          `Initializing missing edit state for ${type} - ${optionKey} during updateEditValue`
        );
        return {
          ...prev,
          [type]: {
            ...typeState,
            [optionKey]: {
              text: optionKey,
              isEditing: true,
              editValue: value,
            },
          },
        };
      }

      return {
        ...prev,
        [type]: {
          ...typeState,
          [optionKey]: {
            ...optionState,
            editValue: value,
          },
        },
      };
    });
  };

  
  const updateEditAssetType = (
    type: string,
    optionKey: string,
    assetType: string
  ) => {
    if (type !== 'instrument') return;

    setEditStates((prev) => {
      const typeState = prev[type] || {};
      const optionState = typeState[optionKey];
      if (!optionState) return prev;

      return {
        ...prev,
        [type]: {
          ...typeState,
          [optionKey]: {
            ...optionState,
            editAssetType: assetType,
            originalAssetType:
              optionState.originalAssetType || optionState.editAssetType,
          },
        },
      };
    });
  };

  
  const updateSpecField = (
    type: string,
    optionKey: string,
    field: string,
    value: string
  ) => {
    if (type !== 'instrument') return;

    setEditStates((prev) => {
      const typeState = prev[type] || {};
      const optionState = typeState[optionKey];
      if (!optionState) return prev;

      return {
        ...prev,
        [type]: {
          ...typeState,
          [optionKey]: {
            ...optionState,
            [field]: value,
          },
        },
      };
    });
  };

  const updateCommissionRule = (
    type: string,
    optionKey: string,
    index: number,
    field: keyof CommissionRuleDraft,
    value: string
  ) => {
    if (type !== 'instrument') return;

    setEditStates((prev) => {
      const typeState = prev[type] || {};
      const optionState = typeState[optionKey];
      if (!optionState) return prev;

      const rules = optionState.editCommissionRules || [];
      const updatedRules = rules.map((rule, ruleIndex) =>
        ruleIndex === index ? { ...rule, [field]: value } : rule
      );
      const nextRules =
        field === 'account' && !value.trim()
          ? [updatedRules[index]]
          : updatedRules;

      return {
        ...prev,
        [type]: {
          ...typeState,
          [optionKey]: {
            ...optionState,
            editCommissionRules: nextRules,
          },
        },
      };
    });
  };

  const addCommissionRule = (type: string, optionKey: string) => {
    if (type !== 'instrument') return;

    setEditStates((prev) => {
      const typeState = prev[type] || {};
      const optionState = typeState[optionKey];
      if (!optionState) return prev;

      const rules = optionState.editCommissionRules || [];
      if (rules.some((rule) => !rule.account.trim())) return prev;

      return {
        ...prev,
        [type]: {
          ...typeState,
          [optionKey]: {
            ...optionState,
            editCommissionRules: [...rules, createCommissionRuleDraft()],
          },
        },
      };
    });
  };

  const removeCommissionRule = (
    type: string,
    optionKey: string,
    index: number
  ) => {
    if (type !== 'instrument') return;

    setEditStates((prev) => {
      const typeState = prev[type] || {};
      const optionState = typeState[optionKey];
      if (!optionState) return prev;

      return {
        ...prev,
        [type]: {
          ...typeState,
          [optionKey]: {
            ...optionState,
            editCommissionRules: (optionState.editCommissionRules || []).filter(
              (_rule, ruleIndex) => ruleIndex !== index
            ),
          },
        },
      };
    });
  };

  
  const updateEditColor = (type: string, optionKey: string, color: string) => {
    if (type !== 'event') return;

    setEditStates((prev) => {
      const typeState = prev[type] || {};
      const optionState = typeState[optionKey];
      if (!optionState) return prev;

      return {
        ...prev,
        [type]: {
          ...typeState,
          [optionKey]: {
            ...optionState,
            editColor: color,
          },
        },
      };
    });
  };

  const updateEditNotes = (type: string, optionKey: string, notes: string) => {
    if (type !== 'event') return;

    setEditStates((prev) => {
      const typeState = prev[type] || {};
      const optionState = typeState[optionKey];
      if (!optionState) return prev;

      return {
        ...prev,
        [type]: {
          ...typeState,
          [optionKey]: {
            ...optionState,
            editNotes: notes,
          },
        },
      };
    });
  };

  
  const saveOption = async (type: string, oldValueKey: string) => {
    try {
      
      if (!editStates[type] || !editStates[type][oldValueKey]) {
        console.error(
          `Cannot save option: Edit state not found for type "${type}", key "${oldValueKey}"`
        );
        new Notice(t('common.error'));
        return;
      }

      const editState = editStates[type][oldValueKey];
      const newValue = editState.editValue;

      if (!newValue || newValue.trim() === '') {
        new Notice(t('settings.customization.options.notice.empty-name'));
        return;
      }

      
      if (type === 'instrument') {
        const tickerPattern = /^[A-Z0-9.]+$/i;
        if (!tickerPattern.test(newValue)) {
          new Notice(t('settings.customization.options.notice.invalid-ticker'));
          return;
        }
      }

      
      let assetType: string | undefined;
      if (type === 'instrument') {
        assetType = editState.editAssetType;
        if (!assetType) {
          
          const instrument = options['instrument'].find(
            (i) => i.name === oldValueKey
          );
          assetType = instrument?.assetType;
        }

        if (!assetType) {
          new Notice(
            t('settings.customization.options.notice.asset-type-required')
          );
          return;
        }
      }

      const parseNumericValue = (value?: string) => {
        if (!value || value.trim() === '') return undefined;
        const parsed = parseFloat(value);
        return Number.isFinite(parsed) ? parsed : undefined;
      };

      let futuresData: FuturesInstrumentData | undefined;
      let forexData: ForexInstrumentData | undefined;
      let cfdData: CfdInstrumentData | undefined;
      let specsChanged = false;
      let currencyChanged = false;
      let eventColorChanged = false;
      let eventNotesChanged = false;
      let existingInstrument: InstrumentData | undefined;
      let instrumentCurrency: string | undefined;
      let commissionRules: InstrumentCommissionRule[] | undefined;
      let commissionRulesChanged = false;

      if (type === 'instrument') {
        const originalAssetType = editState.originalAssetType || assetType;
        existingInstrument = options['instrument'].find(
          (instrument) =>
            instrument.name === oldValueKey &&
            instrument.assetType === originalAssetType
        );

        if (assetType === 'futures') {
          const dollarPerPoint = parseNumericValue(
            editState.editDollarPerPoint
          );
          const tickSize = parseNumericValue(editState.editTickSize);
          const tickValue = parseNumericValue(editState.editTickValue);

          if (
            dollarPerPoint !== undefined ||
            tickSize !== undefined ||
            tickValue !== undefined
          ) {
            futuresData = {
              dollarPerPoint: dollarPerPoint !== undefined ? dollarPerPoint : 0,
              tickSize: tickSize !== undefined ? tickSize : 0,
              tickValue: tickValue !== undefined ? tickValue : 0,
            };
          } else {
            futuresData = existingInstrument?.futuresData;
          }

          const normalizeValue = (value?: number) => value ?? 0;
          specsChanged =
            normalizeValue(existingInstrument?.futuresData?.dollarPerPoint) !==
              normalizeValue(futuresData?.dollarPerPoint) ||
            normalizeValue(existingInstrument?.futuresData?.tickSize) !==
              normalizeValue(futuresData?.tickSize) ||
            normalizeValue(existingInstrument?.futuresData?.tickValue) !==
              normalizeValue(futuresData?.tickValue);
        }

        if (assetType === 'forex') {
          const lotSize = parseNumericValue(editState.editLotSize);
          const pipValue = parseNumericValue(editState.editPipValue);
          const pipSize = parseNumericValue(editState.editPipSize);

          if (
            lotSize !== undefined ||
            pipValue !== undefined ||
            pipSize !== undefined
          ) {
            forexData = {
              lotSize: lotSize !== undefined ? lotSize : 0,
              pipValue: pipValue !== undefined ? pipValue : 0,
              pipSize: pipSize !== undefined ? pipSize : 0,
            };
          } else {
            forexData = existingInstrument?.forexData;
          }

          const normalizeValue = (value?: number) => value ?? 0;
          specsChanged =
            normalizeValue(existingInstrument?.forexData?.lotSize) !==
              normalizeValue(forexData?.lotSize) ||
            normalizeValue(existingInstrument?.forexData?.pipValue) !==
              normalizeValue(forexData?.pipValue) ||
            normalizeValue(existingInstrument?.forexData?.pipSize) !==
              normalizeValue(forexData?.pipSize);
        }

        if (assetType === 'cfd') {
          const contractSize = parseNumericValue(editState.editContractSize);

          cfdData =
            contractSize !== undefined
              ? { contractSize }
              : existingInstrument?.cfdData
                ? {}
                : undefined;

          const normalizeValue = (value?: number) => value ?? 0;
          specsChanged =
            normalizeValue(existingInstrument?.cfdData?.contractSize) !==
            normalizeValue(cfdData?.contractSize);
        }

        instrumentCurrency =
          assetType === 'cfd' ? (editState.editCurrency?.trim() ?? '') : '';
        currencyChanged =
          (existingInstrument?.currency || '') !== instrumentCurrency;
        commissionRules =
          assetType === 'cfd'
            ? []
            : parseCommissionRules(editState.editCommissionRules);
        commissionRulesChanged =
          JSON.stringify(existingInstrument?.commissionRules || []) !==
          JSON.stringify(commissionRules || []);
      } else if (type === 'event') {
        const existingEvent = options['event'].find(
          (event) => event.name === oldValueKey
        );
        const existingColor = existingEvent?.color || 'gray';
        const editedColor = editState.editColor || 'gray';
        const existingNotes = existingEvent?.notes || '';
        const editedNotes = editState.editNotes || '';

        eventColorChanged = existingColor !== editedColor;
        eventNotesChanged = existingNotes !== editedNotes;
      }

      const performUpdate = async (shouldUpdateNotes: boolean) => {
        
        resetFocusState();

        
        
        setEditStates((prev) => {
          const newTypeState = { ...(prev[type] || {}) };
          const optionState = newTypeState[oldValueKey];

          if (optionState) {
            
            delete newTypeState[oldValueKey];
            
            newTypeState[newValue] = {
              ...optionState, 
              text: newValue,
              isEditing: false,
              editValue: newValue, 
            };
          }

          return { ...prev, [type]: newTypeState };
        });

        
        let result;
        if (type === 'instrument') {
          
          result = await optionsService.updateInstrument(
            oldValueKey,
            newValue,
            assetType!,
            futuresData,
            shouldUpdateNotes,
            forexData,
            cfdData,
            editState.originalAssetType || existingInstrument?.assetType,
            instrumentCurrency,
            commissionRules
          );
        } else if (type === 'event') {
          
          const newColor = editState.editColor || 'gray';

          
          if (oldValueKey !== newValue) {
            
            await optionsService.removeOption(OptionType.EVENT, oldValueKey);
          }
          
          const success = await optionsService.addOrUpdateEventOption(
            newValue,
            newColor,
            editState.editNotes || ''
          );
          result = { success, updatedNotes: 0 };
        } else {
          
          if (!isOptionType(type)) {
            return;
          }
          const optionType: OptionType = type;

          result = await optionsService.updateOption(
            optionType,
            oldValueKey,
            newValue,
            shouldUpdateNotes
          );
        }

        if (result.success) {
          await reloadOptionsState({
            closeEditingFor: { type, optionKey: newValue },
          });

          
          if (shouldUpdateNotes && result.updatedNotes !== undefined) {
            new Notice(
              t('settings.customization.options.notice.updated-with-notes', {
                oldValue: oldValueKey,
                newValue,
                count: result.updatedNotes.toString(),
              })
            );
          } else {
            new Notice(
              t('settings.customization.options.notice.updated', {
                oldValue: oldValueKey,
                newValue,
              })
            );
          }
        } else {
          ErrorHandler.showError(
            new Error(
              t('settings.customization.options.notice.duplicate', { newValue })
            ),
            ErrorHandler.createContext(
              `update ${getDisplayName(type).toLowerCase()} option`
            )
          );
          
          setEditStates((prev) => {
            const revertedTypeState = { ...(prev[type] || {}) };
            const optionState = revertedTypeState[newValue]; 

            if (optionState) {
              delete revertedTypeState[newValue]; 
              
              revertedTypeState[oldValueKey] = {
                ...(editStates[type]?.[oldValueKey] || {
                  text: oldValueKey,
                  editValue: oldValueKey,
                }), 
                isEditing: true,
                editValue: newValue, 
              };
            } else {
              
              if (prev[type]?.[oldValueKey]) {
                revertedTypeState[oldValueKey] = {
                  ...prev[type][oldValueKey],
                  isEditing: true,
                  editValue: newValue, 
                };
              }
            }
            return { ...prev, [type]: revertedTypeState };
          });
        }
      };

      
      if (oldValueKey !== newValue) {
        const message = t(
          'settings.customization.options.confirm.rename-message',
          {
            oldValue: oldValueKey,
            newValue,
          }
        );

        
        new AdvancedConfirmationModal(
          plugin.app,
          message,
          (shouldUpdateNotes) => {
            void performUpdate(shouldUpdateNotes);
          }
        ).open();
      } else if (type === 'instrument') {
        
        const instrument = options['instrument'].find(
          (i) =>
            i.name === oldValueKey &&
            i.assetType ===
              (editState.originalAssetType || editState.editAssetType)
        );
        const currentAssetType = instrument?.assetType;
        const newAssetType = editState.editAssetType;

        if (
          currentAssetType !== newAssetType ||
          specsChanged ||
          currencyChanged ||
          commissionRulesChanged
        ) {
          
          void performUpdate(false);
        } else {
          
          setEditStates((prev) => ({
            ...prev,
            [type]: {
              ...(prev[type] || {}),
              [oldValueKey]: {
                ...(prev[type]?.[oldValueKey] || {
                  text: oldValueKey,
                  editValue: oldValueKey,
                }),
                isEditing: false,
              },
            },
          }));
        }
      } else if (type === 'event') {
        if (eventColorChanged || eventNotesChanged) {
          void performUpdate(false);
        } else {
          setEditStates((prev) => ({
            ...prev,
            [type]: {
              ...(prev[type] || {}),
              [oldValueKey]: {
                ...(prev[type]?.[oldValueKey] || {
                  text: oldValueKey,
                  editValue: oldValueKey,
                }),
                isEditing: false,
              },
            },
          }));
        }
      } else {
        
        setEditStates((prev) => ({
          ...prev,
          [type]: {
            ...(prev[type] || {}),
            [oldValueKey]: {
              ...(prev[type]?.[oldValueKey] || {
                text: oldValueKey,
                editValue: oldValueKey,
              }),
              isEditing: false,
            },
          },
        }));
      }
    } catch (error) {
      ErrorHandler.handleError(
        error,
        ErrorHandler.createContext(
          `update ${getDisplayName(type).toLowerCase()} option`
        )
      );
      
      setEditStates((prev) => ({
        ...prev,
        [type]: {
          ...(prev[type] || {}),
          [oldValueKey]: {
            ...(prev[type]?.[oldValueKey] || {
              text: oldValueKey,
              editValue: oldValueKey,
            }),
            isEditing: true, 
          },
        },
      }));
    }
  };

  
  const removeOption = async (type: string, optionKey: string) => {
    
    if (type === 'account_type' && optionKey.toLowerCase() === 'archived') {
      new Notice(
        t('settings.customization.options.notice.cannot-delete-archived')
      );
      return;
    }

    try {
      
      const message = t(
        'settings.customization.options.confirm.remove-message',
        { option: optionKey }
      );

      
      class DeleteConfirmationModal extends Modal {
        constructor(
          app: App,
          private message: string,
          private onConfirm: () => void | Promise<void>
        ) {
          super(app);
        }

        onOpen() {
          const { contentEl } = this;
          contentEl.createEl('p', { text: this.message });
          const buttonContainer = contentEl.createDiv({
            cls: 'modal-button-container journalit-modal-button-container',
          });

          
          buttonContainer
            .createEl('button', {
              text: t('button.delete'),
              cls: 'mod-warning',
            })
            .addEventListener('click', () => {
              this.close();
              void this.onConfirm();
            });

          
          buttonContainer
            .createEl('button', { text: t('button.cancel') })
            .addEventListener('click', () => {
              this.close();
            });
        }

        onClose() {
          const { contentEl } = this;
          contentEl.empty();
        }
      }

      
      new DeleteConfirmationModal(plugin.app, message, async () => {
        
        resetFocusState();

        if (!isOptionType(type)) {
          return;
        }
        const optionType: OptionType = type;

        const removed = await optionsService.removeOption(
          optionType,
          optionKey
        );

        if (removed) {
          await reloadOptionsState();

          new Notice(
            t('settings.customization.options.notice.removed', {
              option: optionKey,
            })
          );
        } else {
          ErrorHandler.showError(
            new Error(t('settings.customization.options.notice.remove-failed')),
            ErrorHandler.createContext(
              `remove ${getDisplayName(type).toLowerCase()} option`
            )
          );
        }
      }).open();
    } catch (error) {
      ErrorHandler.handleError(
        error,
        ErrorHandler.createContext(
          `remove ${getDisplayName(type).toLowerCase()} option`
        )
      );
    }
  };

  
  const resetOptionsType = async (type: string) => {
    try {
      const message = t(
        'settings.customization.options.confirm.reset-message',
        { type: getDisplayName(type).toLowerCase() }
      );

      new ResetConfirmationModal(plugin.app, message, async () => {
        resetFocusState();
        if (!isOptionType(type)) {
          return;
        }
        const optionType: OptionType = type;

        const didChange =
          await optionsService.resetOptionsToDefaults(optionType);

        if (!didChange) {
          new Notice(
            t('settings.customization.options.notice.no-options-to-reset', {
              type: getDisplayName(type).toLowerCase(),
            })
          );
          return;
        }

        await reloadOptionsState({
          types: [type],
          mergeWithPrevious: true,
        });

        new Notice(
          t('settings.customization.options.notice.reset-success', {
            type: getDisplayName(type).toLowerCase(),
          })
        );
      }).open();
    } catch (error) {
      ErrorHandler.handleError(
        error,
        ErrorHandler.createContext(
          `reset ${getDisplayName(type).toLowerCase()} options`
        )
      );
    }
  };

  
  const handleAddMapping = async () => {
    if (!newMapping.importedSymbol.trim() || !newMapping.baseSymbol.trim()) {
      new Notice(
        t('settings.customization.options.notice.mapping-symbols-required')
      );
      return;
    }

    try {
      const importedSymbol = newMapping.importedSymbol.trim();
      const baseSymbol = newMapping.baseSymbol.trim();

      const saved = await plugin.specService.saveMapping(
        importedSymbol,
        baseSymbol,
        false 
      );

      if (!saved) {
        new Notice(
          t('settings.customization.options.notice.mapping-add-failed')
        );
        return;
      }

      
      reloadSymbolMappings();
      setNewMapping(createDefaultNewMapping());
      new Notice(
        t('settings.customization.options.notice.mapping-added', {
          imported: importedSymbol,
          base: baseSymbol,
        })
      );
    } catch (error) {
      new Notice(t('settings.customization.options.notice.mapping-add-failed'));
      console.error(error);
    }
  };

  
  const handleDeleteMapping = async (importedSymbol: string) => {
    try {
      await plugin.specService.deleteMapping(importedSymbol);

      
      reloadSymbolMappings();
      new Notice(
        t('settings.customization.options.notice.mapping-deleted', {
          symbol: importedSymbol,
        })
      );
    } catch (error) {
      new Notice(
        t('settings.customization.options.notice.mapping-delete-failed')
      );
      console.error(error);
    }
  };

  
  const shouldShowCategory = (type: string) => {
    
    if (showSymbolMappings) return false;
    
    if (filterType) return type === String(filterType);
    
    return type !== 'account';
  };

  const shouldShowSymbolMappings = showSymbolMappings || !filterType;

  return {
    plugin,
    options,
    editStates,
    newOptionValues,
    newAssetType,
    newTickerSpecs,
    newEventColor,
    newEventNotes,
    symbolMappings,
    newMapping,
    setNewOptionValues,
    setNewAssetType,
    setNewTickerSpecs,
    setNewEventColor,
    setNewEventNotes,
    setNewMapping,
    getDisplayName,
    getAssetTypeDisplayName,
    startEditing,
    cancelEditing,
    updateEditValue,
    updateEditAssetType,
    updateSpecField,
    updateCommissionRule,
    addCommissionRule,
    removeCommissionRule,
    saveOption,
    updateEditColor,
    updateEditNotes,
    removeOption,
    resetOptionsType,
    handleAddOption,
    handleAddMapping,
    handleDeleteMapping,
    shouldShowCategory,
    shouldShowSymbolMappings,
  };
};

const renderCustomOptionsTab = (
  controller: ReturnType<typeof useCustomOptionsTabController>
) => {
  const {
    plugin,
    options,
    editStates,
    newOptionValues,
    newAssetType,
    newTickerSpecs,
    newEventColor,
    newEventNotes,
    symbolMappings,
    newMapping,
    setNewOptionValues,
    setNewAssetType,
    setNewTickerSpecs,
    setNewEventColor,
    setNewEventNotes,
    setNewMapping,
    getDisplayName,
    getAssetTypeDisplayName,
    startEditing,
    cancelEditing,
    updateEditValue,
    updateEditAssetType,
    updateSpecField,
    updateCommissionRule,
    addCommissionRule,
    removeCommissionRule,
    saveOption,
    updateEditColor,
    updateEditNotes,
    removeOption,
    resetOptionsType,
    handleAddOption,
    handleAddMapping,
    handleDeleteMapping,
    shouldShowCategory,
    shouldShowSymbolMappings,
  } = controller;

  const visibleOptionEntries = Object.entries(options).flatMap(
    ([type, typeOptions]) =>
      shouldShowCategory(type) ? ([[type, typeOptions]] as const) : []
  );

  return (
    <div className="journalit-settings-tab custom-options-settings journalit-u-max-h-full journalit-u-overflow-visible">
      <div className="custom-options-container">
        
        {visibleOptionEntries.map(([type, typeOptions]) => (
          <div key={type} className="option-category">
            {!typeOptions || typeOptions.length === 0 ? (
              <p className="setting-item-description">
                {t('settings.customization.options.empty-state', {
                  type: getDisplayName(type).toLowerCase(),
                })}
              </p>
            ) : (
              <div className="custom-options-container">
                
                {type === 'instrument'
                  ? 
                    allOptionsForType(typeOptions, OptionType.INSTRUMENT).map(
                      (instrument) => {
                        const optionKey = instrument.name;
                        const optionInfo = editStates[type]?.[optionKey];

                        
                        if (!optionInfo) return null;

                        return optionInfo.isEditing ? (
                          
                          <div
                            key={`${type}-${optionKey}-${instrument.assetType}`}
                            className="setting-item option-item"
                          >
                            <div className="setting-item-control journalit-u-flex-col journalit-u-items-stretch">
                              <div className="journalit-u-flex journalit-u-gap-8 journalit-u-w-full">
                                <input
                                  type="text"
                                  value={optionInfo.editValue}
                                  onChange={(e) =>
                                    updateEditValue(
                                      type,
                                      optionKey,
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      void saveOption(type, optionKey);
                                    } else if (e.key === 'Escape') {
                                      e.preventDefault();
                                      cancelEditing(type, optionKey);
                                    }
                                  }}
                                  className="option-edit-input journalit-u-flex-1"
                                  data-option={optionKey}
                                  aria-label={t(
                                    'settings.customization.options.label.edit-option',
                                    { option: optionKey }
                                  )}
                                />
                                <select
                                  className="custom-options-asset-select"
                                  value={
                                    optionInfo.editAssetType ||
                                    instrument.assetType
                                  }
                                  onChange={(e) =>
                                    updateEditAssetType(
                                      type,
                                      optionKey,
                                      e.target.value
                                    )
                                  }
                                >
                                  {Object.values(AssetType).map((assetType) => (
                                    <option key={assetType} value={assetType}>
                                      {getAssetTypeDisplayName(assetType)}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {(optionInfo.editAssetType ||
                                instrument.assetType) === 'cfd' && (
                                <div className="custom-options-cfd-row">
                                  <div>
                                    <label className="custom-options-spec-label">
                                      {t('settings.general.currency')}
                                    </label>
                                    <select
                                      className="journalit-u-w-full"
                                      value={optionInfo.editCurrency || ''}
                                      onChange={(e) =>
                                        updateSpecField(
                                          type,
                                          optionKey,
                                          'editCurrency',
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">
                                        {t('common.none')}
                                      </option>
                                      {getCurrencyOptions().map(
                                        (currencyOption) => (
                                          <option
                                            key={currencyOption.value}
                                            value={currencyOption.value}
                                          >
                                            {currencyOption.label}
                                          </option>
                                        )
                                      )}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="custom-options-spec-label">
                                      {t('form.field.contract-size')}
                                    </label>
                                    <input
                                      type="number"
                                      value={optionInfo.editContractSize || ''}
                                      onChange={(e) =>
                                        updateSpecField(
                                          type,
                                          optionKey,
                                          'editContractSize',
                                          e.target.value
                                        )
                                      }
                                      className="journalit-u-w-full"
                                      step="any"
                                    />
                                  </div>

                                  <div className="option-actions custom-options-cfd-actions">
                                    <NoTooltipButton
                                      className="custom-options-compact-icon-button"
                                      label={t(
                                        'settings.customization.options.label.save-changes'
                                      )}
                                      onClick={() =>
                                        saveOption(type, optionKey)
                                      }
                                    >
                                      <Check size={16} />
                                    </NoTooltipButton>
                                    <NoTooltipButton
                                      className="custom-options-compact-icon-button"
                                      label={t(
                                        'settings.customization.options.label.cancel-editing'
                                      )}
                                      onClick={() =>
                                        cancelEditing(type, optionKey)
                                      }
                                    >
                                      <X size={16} />
                                    </NoTooltipButton>
                                  </div>
                                </div>
                              )}

                              
                              {(optionInfo.editAssetType ||
                                instrument.assetType) === 'futures' && (
                                <div className="custom-options-spec-grid">
                                  <div>
                                    <label className="custom-options-spec-label">
                                      {t('form.field.dollars-per-point')}
                                    </label>
                                    <input
                                      type="number"
                                      placeholder={t(
                                        'settings.customization.options.placeholder.dollar-per-point'
                                      )}
                                      value={
                                        optionInfo.editDollarPerPoint || ''
                                      }
                                      onChange={(e) =>
                                        updateSpecField(
                                          type,
                                          optionKey,
                                          'editDollarPerPoint',
                                          e.target.value
                                        )
                                      }
                                      className="journalit-u-w-full"
                                      step="any"
                                    />
                                  </div>
                                  <div>
                                    <label className="custom-options-spec-label">
                                      {t('form.field.tick-size')}
                                    </label>
                                    <input
                                      type="number"
                                      placeholder={t(
                                        'settings.customization.options.placeholder.tick-size'
                                      )}
                                      value={optionInfo.editTickSize || ''}
                                      onChange={(e) =>
                                        updateSpecField(
                                          type,
                                          optionKey,
                                          'editTickSize',
                                          e.target.value
                                        )
                                      }
                                      className="journalit-u-w-full"
                                      step="any"
                                    />
                                  </div>
                                  <div>
                                    <label className="custom-options-spec-label">
                                      {t('form.field.tick-value')}
                                    </label>
                                    <input
                                      type="number"
                                      placeholder={t(
                                        'settings.customization.options.placeholder.tick-value'
                                      )}
                                      value={optionInfo.editTickValue || ''}
                                      onChange={(e) =>
                                        updateSpecField(
                                          type,
                                          optionKey,
                                          'editTickValue',
                                          e.target.value
                                        )
                                      }
                                      className="journalit-u-w-full"
                                      step="any"
                                    />
                                  </div>
                                </div>
                              )}

                              
                              {(optionInfo.editAssetType ||
                                instrument.assetType) === 'forex' && (
                                <div className="custom-options-spec-grid">
                                  <div>
                                    <label className="custom-options-spec-label">
                                      {t('form.field.lot-size')}
                                    </label>
                                    <input
                                      type="number"
                                      placeholder={t(
                                        'settings.customization.options.placeholder.lot-size'
                                      )}
                                      value={optionInfo.editLotSize || ''}
                                      onChange={(e) =>
                                        updateSpecField(
                                          type,
                                          optionKey,
                                          'editLotSize',
                                          e.target.value
                                        )
                                      }
                                      className="journalit-u-w-full"
                                      step="any"
                                    />
                                  </div>
                                  <div>
                                    <label className="custom-options-spec-label">
                                      {t('form.field.pip-value')}
                                    </label>
                                    <input
                                      type="number"
                                      placeholder={t(
                                        'settings.customization.options.placeholder.pip-value'
                                      )}
                                      value={optionInfo.editPipValue || ''}
                                      onChange={(e) =>
                                        updateSpecField(
                                          type,
                                          optionKey,
                                          'editPipValue',
                                          e.target.value
                                        )
                                      }
                                      className="journalit-u-w-full"
                                      step="any"
                                    />
                                  </div>
                                  <div>
                                    <label className="custom-options-spec-label">
                                      {t(
                                        'settings.customization.options.field.pip-size'
                                      )}
                                    </label>
                                    <input
                                      type="number"
                                      placeholder={t(
                                        'settings.customization.options.placeholder.pip-size'
                                      )}
                                      value={optionInfo.editPipSize || ''}
                                      onChange={(e) =>
                                        updateSpecField(
                                          type,
                                          optionKey,
                                          'editPipSize',
                                          e.target.value
                                        )
                                      }
                                      className="journalit-u-w-full"
                                      step="any"
                                    />
                                  </div>
                                </div>
                              )}

                              {(optionInfo.editAssetType ||
                                instrument.assetType) !== 'cfd' && (
                                <div className="custom-options-commission-section">
                                  <div className="custom-options-commission-header">
                                    <span>
                                      {t(
                                        'settings.customization.options.commission.costs'
                                      )}
                                    </span>
                                    <Button
                                      onClick={() =>
                                        addCommissionRule(type, optionKey)
                                      }
                                      disabled={(
                                        optionInfo.editCommissionRules || []
                                      ).some((rule) => !rule.account.trim())}
                                    >
                                      {t(
                                        'settings.customization.options.commission.add-rule'
                                      )}
                                    </Button>
                                  </div>
                                  {(optionInfo.editCommissionRules || [])
                                    .length > 0 && (
                                    <div className="custom-options-commission-table">
                                      {(
                                        optionInfo.editCommissionRules || []
                                      ).map((rule, ruleIndex) => (
                                        <div
                                          className={`custom-options-commission-rule custom-options-commission-rule--${rule.method}`}
                                          key={ruleIndex}
                                        >
                                          <div className="custom-options-commission-field custom-options-commission-field--account">
                                            <span>
                                              {t(
                                                'settings.customization.options.commission.applies-to'
                                              )}
                                            </span>
                                            <CommissionAccountDropdown
                                              accounts={options['account']}
                                              value={rule.account}
                                              onChange={(account) =>
                                                updateCommissionRule(
                                                  type,
                                                  optionKey,
                                                  ruleIndex,
                                                  'account',
                                                  account
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="custom-options-commission-field custom-options-commission-field--method">
                                            <span>
                                              {t(
                                                'settings.customization.options.commission.method'
                                              )}
                                            </span>
                                            <div
                                              className="custom-options-commission-method-toggle"
                                              role="radiogroup"
                                              aria-label={t(
                                                'settings.customization.options.commission.method'
                                              )}
                                            >
                                              <button
                                                type="button"
                                                className="custom-options-commission-method-button"
                                                aria-checked={
                                                  rule.method === 'perSide'
                                                }
                                                role="radio"
                                                onClick={() =>
                                                  updateCommissionRule(
                                                    type,
                                                    optionKey,
                                                    ruleIndex,
                                                    'method',
                                                    'perSide'
                                                  )
                                                }
                                              >
                                                {t(
                                                  'settings.customization.options.commission.per-side'
                                                )}
                                              </button>
                                              <button
                                                type="button"
                                                className="custom-options-commission-method-button"
                                                aria-checked={
                                                  rule.method === 'roundTrip'
                                                }
                                                role="radio"
                                                onClick={() =>
                                                  updateCommissionRule(
                                                    type,
                                                    optionKey,
                                                    ruleIndex,
                                                    'method',
                                                    'roundTrip'
                                                  )
                                                }
                                              >
                                                {t(
                                                  'settings.customization.options.commission.round-trip'
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                          {rule.method === 'perSide' && (
                                            <>
                                              <label className="custom-options-commission-field custom-options-commission-field--entry">
                                                <span>
                                                  {t(
                                                    'settings.customization.options.commission.entry'
                                                  )}
                                                </span>
                                                <input
                                                  type="number"
                                                  value={rule.entryCommission}
                                                  onChange={(e) =>
                                                    updateCommissionRule(
                                                      type,
                                                      optionKey,
                                                      ruleIndex,
                                                      'entryCommission',
                                                      e.target.value
                                                    )
                                                  }
                                                  step="any"
                                                />
                                              </label>
                                              <label className="custom-options-commission-field custom-options-commission-field--exit">
                                                <span>
                                                  {t(
                                                    'settings.customization.options.commission.exit'
                                                  )}
                                                </span>
                                                <input
                                                  type="number"
                                                  value={rule.exitCommission}
                                                  onChange={(e) =>
                                                    updateCommissionRule(
                                                      type,
                                                      optionKey,
                                                      ruleIndex,
                                                      'exitCommission',
                                                      e.target.value
                                                    )
                                                  }
                                                  step="any"
                                                />
                                              </label>
                                            </>
                                          )}
                                          {rule.method === 'roundTrip' && (
                                            <label className="custom-options-commission-field custom-options-commission-field--round-trip">
                                              <span>
                                                {t(
                                                  'settings.customization.options.commission.round-trip'
                                                )}
                                              </span>
                                              <input
                                                type="number"
                                                value={rule.roundTripCommission}
                                                onChange={(e) =>
                                                  updateCommissionRule(
                                                    type,
                                                    optionKey,
                                                    ruleIndex,
                                                    'roundTripCommission',
                                                    e.target.value
                                                  )
                                                }
                                                step="any"
                                              />
                                            </label>
                                          )}
                                          <NoTooltipButton
                                            className="custom-options-compact-icon-button"
                                            label={t(
                                              'settings.customization.options.commission.remove-rule'
                                            )}
                                            onClick={() =>
                                              removeCommissionRule(
                                                type,
                                                optionKey,
                                                ruleIndex
                                              )
                                            }
                                          >
                                            <Trash size={16} />
                                          </NoTooltipButton>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {(optionInfo.editAssetType ||
                                instrument.assetType) !== 'cfd' && (
                                <div className="option-actions journalit-u-mt-8">
                                  <NoTooltipButton
                                    className="custom-options-compact-icon-button"
                                    label={t(
                                      'settings.customization.options.label.save-changes'
                                    )}
                                    onClick={() => saveOption(type, optionKey)}
                                  >
                                    <Check size={16} />
                                  </NoTooltipButton>
                                  <NoTooltipButton
                                    className="custom-options-compact-icon-button"
                                    label={t(
                                      'settings.customization.options.label.cancel-editing'
                                    )}
                                    onClick={() =>
                                      cancelEditing(type, optionKey)
                                    }
                                  >
                                    <X size={16} />
                                  </NoTooltipButton>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          
                          <div
                            key={`${type}-${optionKey}-${instrument.assetType}`}
                            className="setting-item option-item"
                          >
                            <div className="setting-item-info">
                              <div>
                                <div className="custom-options-name-row">
                                  <div className="setting-item-name">
                                    {optionKey}
                                  </div>
                                  <span className="custom-options-asset-tag">
                                    {getAssetTypeDisplayName(
                                      instrument.assetType
                                    )}
                                  </span>
                                </div>
                                
                                {(instrument.assetType === 'futures' ||
                                  instrument.assetType === 'forex' ||
                                  instrument.assetType === 'cfd') &&
                                  (() => {
                                    const hasCustomFuturesSpecs =
                                      instrument.assetType === 'futures' &&
                                      instrument.futuresData &&
                                      (instrument.futuresData.dollarPerPoint ??
                                        0) > 0 &&
                                      (instrument.futuresData.tickSize ?? 0) >
                                        0 &&
                                      (instrument.futuresData.tickValue ?? 0) >
                                        0;

                                    const hasCustomForexSpecs =
                                      instrument.assetType === 'forex' &&
                                      instrument.forexData &&
                                      (instrument.forexData.lotSize ?? 0) > 0 &&
                                      (instrument.forexData.pipValue ?? 0) >
                                        0 &&
                                      (instrument.forexData.pipSize ?? 0) > 0;

                                    const hasCustomCfdSpecs =
                                      instrument.assetType === 'cfd' &&
                                      instrument.cfdData &&
                                      (instrument.cfdData.contractSize ?? 0) >
                                        0;

                                    if (hasCustomFuturesSpecs) {
                                      const fd = instrument.futuresData!;
                                      return (
                                        <div className="custom-options-spec-preview">
                                          {t(
                                            'settings.customization.options.instrument.specs-futures',
                                            {
                                              dollar: (
                                                fd.dollarPerPoint ?? 0
                                              ).toString(),
                                              tick: (
                                                fd.tickSize ?? 0
                                              ).toString(),
                                              value: (
                                                fd.tickValue ?? 0
                                              ).toString(),
                                            }
                                          )}
                                        </div>
                                      );
                                    }

                                    if (hasCustomForexSpecs) {
                                      const fxd = instrument.forexData!;
                                      return (
                                        <div className="custom-options-spec-preview">
                                          {t(
                                            'settings.customization.options.instrument.specs-forex',
                                            {
                                              lot: (
                                                fxd.lotSize ?? 0
                                              ).toString(),
                                              pip: (
                                                fxd.pipValue ?? 0
                                              ).toString(),
                                              size: (
                                                fxd.pipSize ?? 0
                                              ).toString(),
                                            }
                                          )}
                                        </div>
                                      );
                                    }

                                    if (hasCustomCfdSpecs) {
                                      return (
                                        <div className="custom-options-spec-preview">
                                          {t('form.field.contract-size')}:{' '}
                                          {(
                                            instrument.cfdData?.contractSize ??
                                            0
                                          ).toString()}
                                        </div>
                                      );
                                    }

                                    const builtInSpecs =
                                      plugin.specService.getSpecsForSymbol(
                                        optionKey,
                                        instrument.assetType
                                      );
                                    if (builtInSpecs) {
                                      if (
                                        instrument.assetType === 'futures' &&
                                        'dollarPerPoint' in builtInSpecs
                                      ) {
                                        return (
                                          <div className="custom-options-spec-preview">
                                            {t(
                                              'settings.customization.options.instrument.specs-futures',
                                              {
                                                dollar:
                                                  builtInSpecs.dollarPerPoint.toString(),
                                                tick: builtInSpecs.tickSize.toString(),
                                                value:
                                                  builtInSpecs.tickValue.toString(),
                                              }
                                            )}
                                            <span className="custom-options-spec-built-in">
                                              {t(
                                                'settings.customization.options.instrument.built-in'
                                              )}
                                            </span>
                                          </div>
                                        );
                                      } else if (
                                        instrument.assetType === 'forex' &&
                                        'lotSize' in builtInSpecs
                                      ) {
                                        return (
                                          <div className="custom-options-spec-preview">
                                            {t(
                                              'settings.customization.options.instrument.specs-forex',
                                              {
                                                lot: builtInSpecs.lotSize.toString(),
                                                pip: builtInSpecs.pipValue.toString(),
                                                size: builtInSpecs.pipSize.toString(),
                                              }
                                            )}
                                            <span className="custom-options-spec-built-in">
                                              {t(
                                                'settings.customization.options.instrument.built-in'
                                              )}
                                            </span>
                                          </div>
                                        );
                                      }
                                    }

                                    return null;
                                  })()}
                                {instrument.assetType === 'cfd' &&
                                  instrument.currency && (
                                    <div className="custom-options-spec-preview">
                                      {t('settings.general.currency')}:{' '}
                                      {instrument.currency}
                                    </div>
                                  )}
                                
                                {(() => {
                                  const mapping = symbolMappings.find(
                                    (m) =>
                                      m.importedSymbol.toUpperCase() ===
                                      optionKey.toUpperCase()
                                  );
                                  if (mapping) {
                                    return (
                                      <div className="custom-options-mapped-message">
                                        {t(
                                          'settings.customization.options.instrument.mapped-to',
                                          { base: mapping.baseSymbol }
                                        )}
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                                
                                {(() => {
                                  const isMapped = symbolMappings.find(
                                    (m) =>
                                      m.importedSymbol.toUpperCase() ===
                                      optionKey.toUpperCase()
                                  );
                                  if (isMapped) return null;

                                  if (
                                    instrument.assetType !== 'futures' &&
                                    instrument.assetType !== 'forex' &&
                                    instrument.assetType !== 'cfd'
                                  )
                                    return null;

                                  const hasCustomSpecs =
                                    instrument.assetType === 'futures'
                                      ? (instrument.futuresData
                                          ?.dollarPerPoint ?? 0) > 0
                                      : instrument.assetType === 'forex'
                                        ? (instrument.forexData?.lotSize ?? 0) >
                                          0
                                        : (instrument.cfdData?.contractSize ??
                                            0) > 0;

                                  const builtInSpecs =
                                    plugin.specService.getSpecsForSymbol(
                                      optionKey,
                                      instrument.assetType
                                    );

                                  if (!hasCustomSpecs && !builtInSpecs) {
                                    return (
                                      <div className="custom-options-spec-empty">
                                        {t(
                                          'settings.customization.options.instrument.no-specs'
                                        )}
                                      </div>
                                    );
                                  }

                                  return null;
                                })()}
                              </div>
                            </div>
                            <div className="setting-item-control">
                              <div className="option-actions">
                                <NoTooltipButton
                                  label={t(
                                    'settings.customization.options.label.edit-option',
                                    { option: optionKey }
                                  )}
                                  onClick={() => startEditing(type, optionKey)}
                                >
                                  <Edit size={24} />
                                </NoTooltipButton>
                                <NoTooltipButton
                                  label={t(
                                    'settings.customization.options.label.remove-option',
                                    { option: optionKey }
                                  )}
                                  onClick={() => removeOption(type, optionKey)}
                                >
                                  <Trash size={24} />
                                </NoTooltipButton>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  : type === 'event'
                    ? 
                      allOptionsForType(typeOptions, OptionType.EVENT).map(
                        (event) => {
                          const optionKey = event.name;
                          const optionInfo = editStates[type]?.[optionKey];

                          
                          if (!optionInfo) return null;

                          return optionInfo.isEditing ? (
                            
                            <div
                              key={`${type}-${optionKey}`}
                              className="setting-item option-item custom-options-event-item-edit"
                              role="group"
                              aria-label={t(
                                'settings.customization.options.label.edit-option',
                                { option: optionKey }
                              )}
                            >
                              <div className="setting-item-control custom-options-event-editor">
                                <div className="custom-options-event-editor-main">
                                  <input
                                    type="text"
                                    value={optionInfo.editValue}
                                    onChange={(e) =>
                                      updateEditValue(
                                        type,
                                        optionKey,
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        void saveOption(type, optionKey);
                                      } else if (e.key === 'Escape') {
                                        e.preventDefault();
                                        cancelEditing(type, optionKey);
                                      }
                                    }}
                                    className="option-edit-input custom-options-event-input"
                                    data-option={optionKey}
                                    aria-label={t(
                                      'settings.customization.options.label.edit-option',
                                      { option: optionKey }
                                    )}
                                  />
                                </div>
                                <div className="custom-options-event-editor-footer">
                                  <div className="custom-options-color-picker custom-options-color-picker--compact">
                                    <span className="custom-options-color-label">
                                      {t(
                                        'settings.customization.options.field.priority'
                                      )}
                                    </span>
                                    {EVENT_COLORS.map((color) => {
                                      const key = `common.color.${color}`;
                                      const label = hasTranslation(key)
                                        ? t(key)
                                        : key;

                                      return (
                                        <button
                                          key={color}
                                          type="button"
                                          className={`clickable-icon custom-options-color-option${
                                            optionInfo.editColor === color
                                              ? ' custom-options-color-option--selected'
                                              : ''
                                          }`}
                                          onClick={() =>
                                            updateEditColor(
                                              type,
                                              optionKey,
                                              color
                                            )
                                          }
                                          aria-label={label}
                                        >
                                          <span
                                            className={`custom-options-color-swatch custom-options-color-swatch--${color}`}
                                          />
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <label className="custom-options-spec-label">
                                    {t(
                                      'settings.customization.options.field.default-event-notes'
                                    )}
                                  </label>
                                  <textarea
                                    value={optionInfo.editNotes || ''}
                                    onChange={(e) =>
                                      updateEditNotes(
                                        type,
                                        optionKey,
                                        e.target.value
                                      )
                                    }
                                    placeholder={t(
                                      'settings.customization.options.placeholder.default-event-notes'
                                    )}
                                    className="custom-options-event-notes-textarea"
                                    rows={4}
                                  />
                                  <div className="option-actions custom-options-event-actions">
                                    <NoTooltipButton
                                      label={t(
                                        'settings.customization.options.label.save-changes'
                                      )}
                                      onClick={() =>
                                        saveOption(type, optionKey)
                                      }
                                    >
                                      <Check size={24} />
                                    </NoTooltipButton>
                                    <NoTooltipButton
                                      label={t(
                                        'settings.customization.options.label.cancel-editing'
                                      )}
                                      onClick={() =>
                                        cancelEditing(type, optionKey)
                                      }
                                    >
                                      <X size={24} />
                                    </NoTooltipButton>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            
                            <div
                              key={`${type}-${optionKey}`}
                              className="setting-item option-item"
                            >
                              <div className="setting-item-info">
                                <div className="setting-item-name custom-options-name-row">
                                  {optionKey}
                                  <span
                                    className={`custom-options-event-color-dot custom-options-event-color-dot--${event.color}`}
                                    aria-label={`${t('settings.customization.options.field.priority')} ${event.color}`}
                                  ></span>
                                </div>
                                {event.notes && (
                                  <div className="setting-item-description custom-options-event-notes-preview">
                                    {event.notes}
                                  </div>
                                )}
                              </div>
                              <div className="setting-item-control">
                                <div className="option-actions">
                                  <NoTooltipButton
                                    label={t(
                                      'settings.customization.options.label.edit-option',
                                      { option: optionKey }
                                    )}
                                    onClick={() =>
                                      startEditing(type, optionKey)
                                    }
                                  >
                                    <Edit size={24} />
                                  </NoTooltipButton>
                                  <NoTooltipButton
                                    label={t(
                                      'settings.customization.options.label.remove-option',
                                      { option: optionKey }
                                    )}
                                    onClick={() =>
                                      removeOption(type, optionKey)
                                    }
                                  >
                                    <Trash size={24} />
                                  </NoTooltipButton>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    : 
                      allOptionsForType(typeOptions, OptionType.ACCOUNT).map(
                        (option) => {
                          const optionInfo = editStates[type]?.[option];

                          
                          if (!optionInfo) return null;

                          return optionInfo.isEditing ? (
                            
                            <div
                              key={`${type}-${option}`}
                              className="setting-item option-item"
                            >
                              <div className="setting-item-control">
                                <input
                                  type="text"
                                  value={optionInfo.editValue}
                                  onChange={(e) =>
                                    updateEditValue(
                                      type,
                                      option,
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      void saveOption(type, option);
                                    } else if (e.key === 'Escape') {
                                      e.preventDefault();
                                      cancelEditing(type, option);
                                    }
                                  }}
                                  className="option-edit-input"
                                  data-option={option}
                                  aria-label={t(
                                    'settings.customization.options.label.edit-option',
                                    { option }
                                  )}
                                />
                                <div className="option-actions">
                                  <NoTooltipButton
                                    label={t(
                                      'settings.customization.options.label.save-changes'
                                    )}
                                    onClick={() => saveOption(type, option)}
                                  >
                                    <Check size={24} />
                                  </NoTooltipButton>
                                  <NoTooltipButton
                                    label={t(
                                      'settings.customization.options.label.cancel-editing'
                                    )}
                                    onClick={() => cancelEditing(type, option)}
                                  >
                                    <X size={24} />
                                  </NoTooltipButton>
                                </div>
                              </div>
                            </div>
                          ) : (
                            
                            <div
                              key={`${type}-${option}`}
                              className="setting-item option-item"
                            >
                              <div className="setting-item-info">
                                <div className="setting-item-name custom-options-name-row custom-options-name-row--gap">
                                  {option}
                                  
                                  {type === 'account_type' &&
                                    option.toLowerCase() === 'archived' && (
                                      <Lock
                                        size={14}
                                        className="custom-options-lock-icon"
                                      />
                                    )}
                                </div>
                              </div>
                              <div className="setting-item-control">
                                <div className="option-actions">
                                  
                                  {type === 'account_type' &&
                                  option.toLowerCase() === 'archived' ? (
                                    <span className="custom-options-locked-label">
                                      {t(
                                        'settings.customization.options.label.locked'
                                      )}
                                    </span>
                                  ) : (
                                    <>
                                      <NoTooltipButton
                                        label={t(
                                          'settings.customization.options.label.edit-option',
                                          { option }
                                        )}
                                        onClick={() =>
                                          startEditing(type, option)
                                        }
                                      >
                                        <Edit size={24} />
                                      </NoTooltipButton>
                                      <NoTooltipButton
                                        label={t(
                                          'settings.customization.options.label.remove-option',
                                          { option }
                                        )}
                                        onClick={() =>
                                          removeOption(type, option)
                                        }
                                      >
                                        <Trash size={24} />
                                      </NoTooltipButton>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}

                
                <div className="custom-options-reset-container">
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => resetOptionsType(type)}
                    className="reset-category-button"
                    aria-label={t(
                      'settings.customization.options.aria.reset-all',
                      { type: getDisplayName(type).toLowerCase() }
                    )}
                  >
                    {t('settings.customization.options.button.reset-all', {
                      type: getDisplayName(type),
                    })}
                  </Button>
                </div>
              </div>
            )}

            
            <div className="setting-item custom-item-add">
              <div className="setting-item-info journalit-u-flex-col journalit-u-items-stretch">
                {type === 'instrument' ? (
                  
                  <>
                    <div className="journalit-u-flex journalit-u-gap-8 journalit-u-w-full">
                      <input
                        type="text"
                        value={newOptionValues[type] || ''}
                        onChange={(e) =>
                          setNewOptionValues((prev) => ({
                            ...prev,
                            [type]: e.target.value,
                          }))
                        }
                        placeholder={t(
                          'settings.customization.options.placeholder.new-name',
                          { type: getDisplayName(type).slice(0, -1) }
                        )}
                        aria-label={t(
                          'settings.customization.options.placeholder.add-new',
                          { type: getDisplayName(type).toLowerCase() }
                        )}
                        onKeyDown={(e) => {
                          if (
                            e.key === 'Enter' &&
                            newOptionValues[type]?.trim()
                          ) {
                            e.preventDefault();
                            void handleAddOption(type);
                          }
                        }}
                        className="journalit-u-flex-1"
                      />
                      <select
                        className="custom-options-asset-select"
                        value={newAssetType}
                        onChange={(e) => setNewAssetType(e.target.value)}
                      >
                        {Object.values(AssetType).map((assetType) => (
                          <option key={assetType} value={assetType}>
                            {getAssetTypeDisplayName(assetType)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {newAssetType === 'cfd' && (
                      <div className="custom-options-cfd-row">
                        <div>
                          <label className="custom-options-spec-label">
                            {t('settings.general.currency')}{' '}
                            {t('settings.customization.options.field.optional')}
                          </label>
                          <select
                            className="journalit-u-w-full"
                            value={newTickerSpecs.currency}
                            onChange={(e) =>
                              setNewTickerSpecs((prev) => ({
                                ...prev,
                                currency: e.target.value,
                              }))
                            }
                          >
                            <option value="">{t('common.none')}</option>
                            {getCurrencyOptions().map((currencyOption) => (
                              <option
                                key={currencyOption.value}
                                value={currencyOption.value}
                              >
                                {currencyOption.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="custom-options-spec-label">
                            {t('form.field.contract-size')}{' '}
                            {t('settings.customization.options.field.optional')}
                          </label>
                          <input
                            type="number"
                            value={newTickerSpecs.contractSize}
                            onChange={(e) =>
                              setNewTickerSpecs((prev) => ({
                                ...prev,
                                contractSize: e.target.value,
                              }))
                            }
                            className="journalit-u-w-full"
                            step="any"
                          />
                        </div>
                        <div className="option-actions custom-options-cfd-actions">
                          <Button
                            onClick={() => handleAddOption(type)}
                            disabled={!newOptionValues[type]?.trim()}
                            aria-label={t(
                              'settings.customization.options.aria.confirm-add',
                              { type: getDisplayName(type).toLowerCase() }
                            )}
                          >
                            {t('button.add')}
                          </Button>
                        </div>
                      </div>
                    )}

                    
                    {newAssetType === 'futures' && (
                      <div className="custom-options-spec-grid">
                        <div>
                          <label className="custom-options-spec-label">
                            {t('form.field.dollars-per-point')}{' '}
                            {t('settings.customization.options.field.optional')}
                          </label>
                          <input
                            type="number"
                            placeholder={t(
                              'settings.customization.options.placeholder.dollar-per-point'
                            )}
                            value={newTickerSpecs.dollarPerPoint}
                            onChange={(e) =>
                              setNewTickerSpecs((prev) => ({
                                ...prev,
                                dollarPerPoint: e.target.value,
                              }))
                            }
                            className="journalit-u-w-full"
                            step="any"
                          />
                        </div>
                        <div>
                          <label className="custom-options-spec-label">
                            {t('form.field.tick-size')}{' '}
                            {t('settings.customization.options.field.optional')}
                          </label>
                          <input
                            type="number"
                            placeholder={t(
                              'settings.customization.options.placeholder.tick-size'
                            )}
                            value={newTickerSpecs.tickSize}
                            onChange={(e) =>
                              setNewTickerSpecs((prev) => ({
                                ...prev,
                                tickSize: e.target.value,
                              }))
                            }
                            className="journalit-u-w-full"
                            step="any"
                          />
                        </div>
                        <div>
                          <label className="custom-options-spec-label">
                            {t('form.field.tick-value')}{' '}
                            {t('settings.customization.options.field.optional')}
                          </label>
                          <input
                            type="number"
                            placeholder={t(
                              'settings.customization.options.placeholder.tick-value'
                            )}
                            value={newTickerSpecs.tickValue}
                            onChange={(e) =>
                              setNewTickerSpecs((prev) => ({
                                ...prev,
                                tickValue: e.target.value,
                              }))
                            }
                            className="journalit-u-w-full"
                            step="any"
                          />
                        </div>
                      </div>
                    )}

                    
                    {newAssetType === 'forex' && (
                      <div className="custom-options-spec-grid">
                        <div>
                          <label className="custom-options-spec-label">
                            {t('form.field.lot-size')}{' '}
                            {t('settings.customization.options.field.optional')}
                          </label>
                          <input
                            type="number"
                            placeholder={t(
                              'settings.customization.options.placeholder.lot-size'
                            )}
                            value={newTickerSpecs.lotSize}
                            onChange={(e) =>
                              setNewTickerSpecs((prev) => ({
                                ...prev,
                                lotSize: e.target.value,
                              }))
                            }
                            className="journalit-u-w-full"
                            step="any"
                          />
                        </div>
                        <div>
                          <label className="custom-options-spec-label">
                            {t('form.field.pip-value')}{' '}
                            {t('settings.customization.options.field.optional')}
                          </label>
                          <input
                            type="number"
                            placeholder={t(
                              'settings.customization.options.placeholder.pip-value'
                            )}
                            value={newTickerSpecs.pipValue}
                            onChange={(e) =>
                              setNewTickerSpecs((prev) => ({
                                ...prev,
                                pipValue: e.target.value,
                              }))
                            }
                            className="journalit-u-w-full"
                            step="any"
                          />
                        </div>
                        <div>
                          <label className="custom-options-spec-label">
                            {t('settings.customization.options.field.pip-size')}{' '}
                            {t('settings.customization.options.field.optional')}
                          </label>
                          <input
                            type="number"
                            placeholder={t(
                              'settings.customization.options.placeholder.pip-size'
                            )}
                            value={newTickerSpecs.pipSize}
                            onChange={(e) =>
                              setNewTickerSpecs((prev) => ({
                                ...prev,
                                pipSize: e.target.value,
                              }))
                            }
                            className="journalit-u-w-full"
                            step="any"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : type === 'event' ? (
                  
                  <>
                    <input
                      type="text"
                      value={newOptionValues[type] || ''}
                      onChange={(e) =>
                        setNewOptionValues((prev) => ({
                          ...prev,
                          [type]: e.target.value,
                        }))
                      }
                      placeholder={t(
                        'settings.customization.options.placeholder.new-name',
                        { type: getDisplayName(type).slice(0, -1) }
                      )}
                      aria-label={t(
                        'settings.customization.options.placeholder.add-new',
                        { type: getDisplayName(type).toLowerCase() }
                      )}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter' &&
                          newOptionValues[type]?.trim()
                        ) {
                          e.preventDefault();
                          void handleAddOption(type);
                        }
                      }}
                    />
                    <textarea
                      value={newEventNotes}
                      onChange={(e) => setNewEventNotes(e.target.value)}
                      placeholder={t(
                        'settings.customization.options.placeholder.default-event-notes'
                      )}
                      aria-label={t(
                        'settings.customization.options.field.default-event-notes'
                      )}
                      className="custom-options-event-notes-textarea"
                      rows={4}
                    />
                    
                    <div className="custom-options-color-picker">
                      <span className="custom-options-color-label">
                        {t('settings.customization.options.field.priority')}
                      </span>
                      {EVENT_COLORS.map((color) => {
                        const key = `common.color.${color}`;
                        const label = hasTranslation(key) ? t(key) : key;

                        return (
                          <button
                            key={color}
                            type="button"
                            className={`clickable-icon custom-options-color-option${
                              newEventColor === color
                                ? ' custom-options-color-option--selected'
                                : ''
                            }`}
                            onClick={() => setNewEventColor(color)}
                            aria-label={label}
                          >
                            <span
                              className={`custom-options-color-swatch custom-options-color-swatch--${color}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  
                  <input
                    type="text"
                    value={newOptionValues[type] || ''}
                    onChange={(e) =>
                      setNewOptionValues((prev) => ({
                        ...prev,
                        [type]: e.target.value,
                      }))
                    }
                    placeholder={t(
                      'settings.customization.options.placeholder.new-name',
                      { type: getDisplayName(type).slice(0, -1) }
                    )}
                    aria-label={t(
                      'settings.customization.options.placeholder.add-new',
                      { type: getDisplayName(type).toLowerCase() }
                    )}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newOptionValues[type]?.trim()) {
                        e.preventDefault();
                        void handleAddOption(type);
                      }
                    }}
                  />
                )}
              </div>
              {!(type === 'instrument' && newAssetType === 'cfd') && (
                <div className="setting-item-control">
                  <Button
                    onClick={() => handleAddOption(type)}
                    disabled={!newOptionValues[type]?.trim()}
                    aria-label={t(
                      'settings.customization.options.aria.confirm-add',
                      { type: getDisplayName(type).toLowerCase() }
                    )}
                  >
                    {t('button.add')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        
        {shouldShowSymbolMappings && (
          <>
            <div className="setting-item">
              <div className="setting-item-info">
                <div className="setting-item-description">
                  {t('settings.customization.options.mapping.description')}
                </div>
              </div>
            </div>

            {symbolMappings.length > 0 ? (
              <div className="custom-options-container">
                {symbolMappings.map((mapping) => (
                  <div
                    key={mapping.importedSymbol}
                    className="setting-item option-item"
                  >
                    <div className="setting-item-info">
                      <div className="setting-item-name">
                        {mapping.importedSymbol} → {mapping.baseSymbol}
                      </div>
                      <div className="setting-item-description">
                        {mapping.autoDetected
                          ? t(
                              'settings.customization.options.mapping.auto-detected'
                            )
                          : t(
                              'settings.customization.options.mapping.manual'
                            )}{' '}
                        •{' '}
                        {t(
                          'settings.customization.options.mapping.created-at',
                          {
                            date: new Date(
                              mapping.dateCreated
                            ).toLocaleDateString(),
                          }
                        )}
                      </div>
                    </div>
                    <div className="setting-item-control">
                      <IconButton
                        onClick={() =>
                          void handleDeleteMapping(mapping.importedSymbol)
                        }
                        ariaLabel={t(
                          'settings.customization.options.aria.delete-mapping'
                        )}
                        className="danger"
                      >
                        <Trash size={16} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="setting-item">
                <div className="setting-item-description">
                  {t('settings.customization.options.mapping.no-mappings')}
                </div>
              </div>
            )}

            
            <div className="setting-item custom-item-add">
              <div className="setting-item-info journalit-u-flex journalit-u-gap-8 journalit-u-w-full">
                <input
                  type="text"
                  value={newMapping.importedSymbol}
                  onChange={(e) =>
                    setNewMapping((prev) => ({
                      ...prev,
                      importedSymbol: e.target.value,
                    }))
                  }
                  placeholder={t(
                    'settings.customization.options.mapping.placeholder-imported'
                  )}
                  className="journalit-u-flex-1"
                />
                <span className="custom-options-symbol-mapping-arrow">→</span>
                <input
                  type="text"
                  value={newMapping.baseSymbol}
                  onChange={(e) =>
                    setNewMapping((prev) => ({
                      ...prev,
                      baseSymbol: e.target.value,
                    }))
                  }
                  placeholder={t(
                    'settings.customization.options.mapping.placeholder-base'
                  )}
                  className="journalit-u-flex-1"
                />
              </div>
              <div className="setting-item-control">
                <Button
                  onClick={() => void handleAddMapping()}
                  disabled={
                    !newMapping.importedSymbol.trim() ||
                    !newMapping.baseSymbol.trim()
                  }
                >
                  {t('settings.customization.options.mapping.button-add')}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const CustomOptionsTab: React.FC<CustomOptionsTabProps> = (props) =>
  renderCustomOptionsTab(useCustomOptionsTabController(props));
