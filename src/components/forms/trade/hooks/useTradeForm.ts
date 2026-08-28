import type JournalitPlugin from '../../../../main';
import { logger } from '../../../../utils/logger';
import { t } from '../../../../lang/helpers';


import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  type SyntheticEvent,
} from 'react';
import { normalizePath, TFile } from 'obsidian';
import { CustomOptionsService, OptionType } from '../../../../services/options';
import {
  getGeneratedMediaFileId,
  imageService,
} from '../../../../services/image/ImageService';
import {
  TradeFormData,
  TradeFormErrors,
  TradeFormValue,
  DEFAULT_TRADE_FORM_DATA,
} from '../types';
import { resolveFormExitExplicitness } from '../exitExplicitness';
import type { TradeFormLayoutSettings } from '../../../../settings/types';
import {
  validateTradeForm,
  hasFormErrors,
  validateCustomFields,
} from '../validation';
import { deriveRawDirectPnLFromStoredCombinedPnL } from '../../../../utils/pnlCalculation';
import { usePlugin } from '../../../../hooks/usePlugin';
import { getTradingDay } from '../../../../utils/tradingDayUtils';
import { isTradeOpenWithContext } from '../../../../utils/tradeStatusUtils';
import {
  hasUnrealizedPriceSnapshot,
  isUnrealizedSnapshotExecutionValid,
  shouldInvalidateUnrealizedSnapshot,
} from '../../../../utils/unrealizedPnl';
import {
  getQuarterForMonth,
  getQuarterString,
  getWeekFolderName,
} from '../../../../utils/dateUtils';
import {
  getTradeMediaOwner,
  isManagedTradeMediaPath,
} from '../../../../services/trade/core/TradeMediaOwnership';
import {
  rekeyImageAnnotations,
  serializeImageAnnotations,
} from '../../../../utils/imageAnnotations';

interface UseTradeFormProps {
  initialData?: Partial<TradeFormData>;
  isEditMode?: boolean;
  onSubmit?: (data: TradeFormData) => Promise<boolean> | boolean;
  onCancel?: () => Promise<boolean> | boolean | void;
  layout?: TradeFormLayoutSettings;
}

const UNREALIZED_SNAPSHOT_QUOTE_CONTEXT_FIELDS = new Set<keyof TradeFormData>([
  'instrument',
  'direction',
  'assetType',
  'currency',
  'exchange',
  'expirationDate',
  'strikePrice',
  'optionType',
  'contractSize',
  'contractSymbol',
  'dollarPerPoint',
  'tickSize',
  'tickValue',
  'currencyPair',
  'lotSize',
  'pipValue',
  'tradingPair',
  'cryptoExchange',
]);

const hasQuoteContextChanged = (
  field: keyof TradeFormData,
  previousValue: TradeFormValue,
  nextValue: TradeFormValue
): boolean => {
  if (!UNREALIZED_SNAPSHOT_QUOTE_CONTEXT_FIELDS.has(field)) return false;
  if (previousValue instanceof Date && nextValue instanceof Date) {
    return previousValue.getTime() !== nextValue.getTime();
  }
  return previousValue !== nextValue;
};

const hasTradeLegValues = (leg: {
  price?: number | null;
  size?: number | null;
}): boolean =>
  (leg.price !== undefined && leg.price !== null && leg.price !== 0) ||
  (leg.size !== undefined && leg.size !== null && leg.size !== 0);

const withResolvedSnapshotExitExplicitness = (
  data: Partial<TradeFormData>
): Partial<TradeFormData> => {
  if (!Array.isArray(data.exits)) {
    return data;
  }

  return {
    ...data,
    exits: data.exits.map((exit) => ({
      ...exit,
      hasExplicitPrice: resolveFormExitExplicitness(
        exit,
        data.useDirectPnLInput
      ),
    })),
  };
};

const completeTradeFormData = (
  data: Partial<TradeFormData>
): TradeFormData => ({
  ...DEFAULT_TRADE_FORM_DATA,
  ...data,
});

const withCurrentTimeForBlankTradeTimes = (
  data: Partial<TradeFormData>,
  preserveScalarTradeTimes = false,
  referenceDate = new Date()
): Partial<TradeFormData> => {
  const snapshotTime = data.unrealizedPriceSnapshotTime;
  const entryTimeReference =
    snapshotTime instanceof Date && Number.isFinite(snapshotTime.getTime())
      ? snapshotTime
      : referenceDate;
  const applyReferenceTime = (
    date: Date | undefined,
    reference: Date
  ): Date => {
    const base = date ? new Date(date) : new Date(reference);
    base.setHours(
      reference.getHours(),
      reference.getMinutes(),
      reference.getSeconds(),
      reference.getMilliseconds()
    );
    return base;
  };
  const earliestTime = (times: Array<Date | undefined>): Date | undefined =>
    times.reduce<Date | undefined>(
      (earliest, time) =>
        time instanceof Date &&
        (!earliest || time.getTime() < earliest.getTime())
          ? time
          : earliest,
      undefined
    );
  const latestTime = (times: Array<Date | undefined>): Date | undefined =>
    times.reduce<Date | undefined>(
      (latest, time) =>
        time instanceof Date && (!latest || time.getTime() > latest.getTime())
          ? time
          : latest,
      undefined
    );
  const normalized: Partial<TradeFormData> = { ...data };

  if (Array.isArray(data.entries)) {
    normalized.entries = data.entries.map((entry) => ({
      ...entry,
      time:
        entry.time ??
        (entry.blankTimeDate || hasTradeLegValues(entry)
          ? applyReferenceTime(entry.blankTimeDate, entryTimeReference)
          : undefined),
      blankTimeDate: undefined,
    }));
  }

  if (Array.isArray(data.exits)) {
    normalized.exits = data.exits.map((exit) => ({
      ...exit,
      time:
        exit.time ??
        (exit.blankTimeDate || hasTradeLegValues(exit)
          ? applyReferenceTime(exit.blankTimeDate, referenceDate)
          : undefined),
      blankTimeDate: undefined,
    }));
  }

  const entryTime = earliestTime(
    normalized.entries?.map((entry) => entry.time) ?? []
  );
  if (
    entryTime &&
    (!preserveScalarTradeTimes || !data.useDirectPnLInput || !data.entryTime)
  ) {
    normalized.entryTime = entryTime;
  }

  const exitTime = latestTime(normalized.exits?.map((exit) => exit.time) ?? []);
  if (exitTime) {
    normalized.exitTime = exitTime;
  } else if (Array.isArray(normalized.exits) && !preserveScalarTradeTimes) {
    normalized.exitTime = undefined;
  }

  return normalized;
};

const clearInvalidUnrealizedSnapshot = (
  data: Partial<TradeFormData>
): Partial<TradeFormData> => {
  if (
    !hasUnrealizedPriceSnapshot(data) ||
    isUnrealizedSnapshotExecutionValid(data)
  ) {
    return data;
  }

  return {
    ...data,
    unrealizedPriceSnapshot: undefined,
    unrealizedPriceSnapshotTime: undefined,
  };
};

const normalizeSubmittedTradeStatus = (
  data: Partial<TradeFormData>
): Partial<TradeFormData> => {
  const isRegularPriceBasedTrade =
    data.useDirectPnLInput !== true &&
    data.isMissedTrade !== true &&
    data.isBacktestTrade !== true &&
    data.tradeStatus !== 'CANCELLED';

  if (!isRegularPriceBasedTrade) {
    return data;
  }

  const explicitExits = (data.exits ?? []).filter((exit) =>
    resolveFormExitExplicitness(exit, data.useDirectPnLInput)
  );
  const isOpenTrade = isTradeOpenWithContext({
    
    
    tradeStatus: undefined,
    
    
    exitTime: undefined,
    exitPrice: undefined,
    pnl: undefined,
    useDirectPnLInput: data.useDirectPnLInput,
    exits: explicitExits,
    entries: data.entries,
  });

  return isOpenTrade ? data : { ...data, tradeStatus: 'CLOSED' };
};

const syncHiddenDirectPnLExitTime = (
  data: Partial<TradeFormData>,
  layout: TradeFormLayoutSettings | undefined,
  preserveExistingExitTime: boolean
): Partial<TradeFormData> => {
  if (preserveExistingExitTime || data.useDirectPnLInput !== true) {
    return data;
  }

  const hasIntentionalExits = (data.exits ?? []).some(
    (exit) => hasTradeLegValues(exit) || exit.time instanceof Date
  );
  if (layout?.inputMode !== 'pnl-risk' && hasIntentionalExits) {
    return data;
  }

  return {
    ...data,
    exitTime: data.entryTime,
  };
};

const shouldRefreshAutoCommission = (field: keyof TradeFormData): boolean =>
  field === 'instrument' ||
  field === 'assetType' ||
  field === 'account' ||
  field === 'positionSize' ||
  field === 'entries' ||
  field === 'exits' ||
  field === 'exitPrice' ||
  field === 'hasExplicitCommission' ||
  field === 'commissionType' ||
  field === 'useDirectPnLInput';

const hasExitData = (data: Partial<TradeFormData>): boolean => {
  const meaningfulExits = (data.exits ?? []).filter(hasTradeLegValues);
  const hasScalarExitPrice =
    data.exitPrice !== undefined &&
    data.exitPrice !== null &&
    (data.exitPrice > 0 ||
      (data.hasExplicitExitPrice === true && meaningfulExits.length === 0));
  const hasClosedDirectPnL =
    data.useDirectPnLInput === true &&
    data.tradeStatus !== 'OPEN' &&
    data.tradeStatus !== 'PARTIALLY_CLOSED' &&
    data.tradeStatus !== 'CANCELLED';

  return (
    hasClosedDirectPnL ||
    (data.tradeStatus === 'CLOSED' && hasScalarExitPrice) ||
    meaningfulExits.length > 0
  );
};

const getExitedPositionSize = (
  data: Partial<TradeFormData>
): number | undefined => {
  const exitedSize = (data.exits ?? []).reduce(
    (total, exit) =>
      exit.size !== undefined && exit.size !== null && exit.size > 0
        ? total + exit.size
        : total,
    0
  );
  return exitedSize > 0 ? exitedSize : undefined;
};

const applyAutoCommission = (
  data: Partial<TradeFormData>,
  optionsService?: CustomOptionsService,
  previousData?: Partial<TradeFormData>
): Partial<TradeFormData> => {
  if (data.hasExplicitCommission === true) {
    return data;
  }

  const instrument = typeof data.instrument === 'string' ? data.instrument : '';
  const positionSize =
    typeof data.positionSize === 'number' ? data.positionSize : 0;
  if (
    data.commissionType === 'percentage' &&
    (typeof data.commission !== 'number' || data.commission === 0)
  ) {
    return data;
  }

  if (
    (data.isMissedTrade === true || data.isBacktestTrade === true) &&
    data.hasExplicitCommission !== false &&
    typeof data.commission === 'number' &&
    data.commission !== 0
  ) {
    return data;
  }

  const canInferPreviousAutoCommission = Boolean(
    previousData &&
    (previousData.isMissedTrade !== true ||
      previousData.hasExplicitCommission === false) &&
    (previousData.isBacktestTrade !== true ||
      previousData.hasExplicitCommission === false)
  );
  const previousAutoCommission =
    previousData && canInferPreviousAutoCommission
      ? optionsService?.calculateInstrumentCommission({
          instrument:
            typeof previousData.instrument === 'string'
              ? previousData.instrument
              : '',
          assetType: previousData.assetType,
          account: previousData.account,
          positionSize:
            typeof previousData.positionSize === 'number'
              ? previousData.positionSize
              : 0,
          exitedPositionSize: getExitedPositionSize(previousData),
          hasExit: hasExitData(previousData),
        })
      : undefined;
  const hadAutoCommission =
    previousAutoCommission !== undefined &&
    typeof data.commission === 'number' &&
    Math.abs(data.commission - previousAutoCommission) < 0.000001;

  if (data.commissionType === 'percentage') {
    const changedFromFixedAutoCommission =
      previousData?.commissionType !== 'percentage' && hadAutoCommission;
    return changedFromFixedAutoCommission
      ? { ...data, commission: undefined, hasExplicitCommission: false }
      : data;
  }

  if (!instrument || positionSize <= 0) {
    return hadAutoCommission
      ? { ...data, commission: undefined, hasExplicitCommission: false }
      : data;
  }

  const hasExit = hasExitData(data);
  const commission = optionsService?.calculateInstrumentCommission({
    instrument,
    assetType: data.assetType,
    account: data.account,
    positionSize,
    exitedPositionSize: getExitedPositionSize(data),
    hasExit,
  });

  if (hadAutoCommission) {
    return commission === undefined
      ? { ...data, commission: undefined, hasExplicitCommission: false }
      : {
          ...data,
          commission,
          commissionType: 'fixed',
          hasExplicitCommission: false,
        };
  }

  if (data.commission && data.commission !== 0) {
    if (commission === undefined) {
      return data;
    }

    if (hasExit === false) {
      return data;
    }

    const entryOnlyCommission = optionsService?.calculateInstrumentCommission({
      instrument,
      assetType: data.assetType,
      account: data.account,
      positionSize,
      exitedPositionSize: getExitedPositionSize(data),
      hasExit: false,
    });

    if (entryOnlyCommission === undefined) {
      return data;
    }

    const isStoredEntryOnlyCommission =
      Math.abs(data.commission - entryOnlyCommission) < 0.000001;
    if (!isStoredEntryOnlyCommission) {
      return data;
    }
  }

  if (commission === undefined) {
    return data;
  }

  return {
    ...data,
    commission,
    commissionType: 'fixed',
    hasExplicitCommission: false,
  };
};

async function resolveSetupSelections(
  plugin: JournalitPlugin,
  data: Partial<TradeFormData>
): Promise<void> {
  const setupLabels = Array.isArray(data.setup) ? data.setup : [];
  if (setupLabels.length === 0) {
    return;
  }

  const setupService = await plugin.serviceManager.getSetupService();
  const creationLabels = new Set(data.setupCreationLabels ?? []);

  for (const label of setupLabels) {
    const resolved = await setupService.resolveSetupRef(label);
    if (resolved.kind === 'resolved' && resolved.setup) {
      continue;
    }

    if (creationLabels.has(label)) {
      await setupService.createSetup({ name: label });
    }
  }
}

export const useTradeForm = ({
  initialData = {},
  isEditMode = false,
  onSubmit,
  onCancel,
  layout,
}: UseTradeFormProps) => {
  const plugin = usePlugin();
  if (!plugin) {
    throw new Error('Journalit plugin context is required for trade form');
  }
  
  const [formData, setFormData] = useState<Partial<TradeFormData>>(() => {
    
    if (isEditMode && initialData) {
      const editData: Partial<TradeFormData> = { ...initialData };

      
      
      if (!editData.entries || !Array.isArray(editData.entries)) {
        editData.entries = [];
      }

      
      
      if (
        editData.entries.length === 0 &&
        editData.entryPrice != null &&
        editData.positionSize != null
      ) {
        editData.entries = [
          {
            time: editData.entryTime || new Date(),
            price: editData.entryPrice,
            size: editData.positionSize,
          },
        ];
      }
      if (!editData.exits || !Array.isArray(editData.exits)) {
        editData.exits = [];
      }
      if (!editData.dividends || !Array.isArray(editData.dividends)) {
        editData.dividends = [];
      }
      if (!editData.images) editData.images = [];
      if (!editData.tags) editData.tags = [];
      if (!editData.customTags || editData.customTags.length === 0) {
        editData.customTags = Array.isArray(editData.tags)
          ? [...editData.tags]
          : [];
      }
      if (!editData.setup) editData.setup = [];
      if (!editData.mistake) editData.mistake = [];
      if (!editData.account) editData.account = [];

      
      
      const rawSnapshotTime: unknown = editData.unrealizedPriceSnapshotTime;
      if (rawSnapshotTime !== undefined && !(rawSnapshotTime instanceof Date)) {
        const parsedSnapshotTime =
          typeof rawSnapshotTime === 'string' ||
          typeof rawSnapshotTime === 'number'
            ? new Date(rawSnapshotTime)
            : undefined;
        editData.unrealizedPriceSnapshotTime =
          parsedSnapshotTime && !isNaN(parsedSnapshotTime.getTime())
            ? parsedSnapshotTime
            : undefined;
      }

      
      if (editData.isMissedTrade === undefined) {
        
        if (editData.type === 'missed-trade') {
          editData.isMissedTrade = true;
        }
        
        else if (
          editData.filePath &&
          editData.filePath.includes('-M') &&
          editData.filePath.endsWith('.md')
        ) {
          editData.isMissedTrade = true;
        }
        
        else {
          editData.isMissedTrade = false;
        }
      }

      
      
      
      const isSyncedTrade =
        editData.backendTradeId !== undefined &&
        editData.backendTradeId !== null;
      const hasValidPrices =
        editData.entryPrice !== undefined &&
        editData.entryPrice !== null &&
        editData.entryPrice > 0 &&
        editData.exitPrice !== undefined &&
        editData.exitPrice !== null &&
        editData.exitPrice > 0;

      const isOpenTrade = isTradeOpenWithContext({
        tradeStatus: editData.tradeStatus,
        exitTime: editData.exitTime,
        exitPrice: editData.exitPrice,
        pnl: editData._originalPnlWasNull ? null : editData.pnl,
        useDirectPnLInput: editData.useDirectPnLInput,
        exits: editData.exits,
        entries: editData.entries,
      });

      
      if (isOpenTrade) {
        
        
        editData.useDirectPnLInput = false;
      } else if (isSyncedTrade) {
        
        
        editData.useDirectPnLInput = true;
      } else if (editData.useDirectPnLInput === undefined) {
        
        
        editData.useDirectPnLInput = !hasValidPrices;
      }
      

      
      
      
      if (editData.useDirectPnLInput && editData.directPnL === undefined) {
        editData.directPnL = deriveRawDirectPnLFromStoredCombinedPnL(editData);
      }
      if (!editData.useDirectPnLInput) {
        editData.directPnL = undefined;
      }

      return editData;
    }

    
    const defaultData = { ...DEFAULT_TRADE_FORM_DATA };

    
    const mergedData: Partial<TradeFormData> = { ...defaultData };

    
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        const k = key as keyof TradeFormData;
        const value = initialData[k];

        
        if (Array.isArray(value)) {
          
          (mergedData as Record<keyof TradeFormData, unknown>)[k] = Array.from(
            value as unknown[]
          );
        } else {
          
          (mergedData as Record<keyof TradeFormData, unknown>)[k] = value;
        }
      });

      
      if (!mergedData.images && initialData.images) {
        mergedData.images = [...initialData.images];
      }
    }

    
    try {
      const hasExplicitDirectPnL = 'directPnL' in initialData;
      if (plugin.settings.trade.tradeFormLayout?.inputMode === 'pnl-risk') {
        mergedData.useDirectPnLInput = true;
        if (!hasExplicitDirectPnL) {
          mergedData.directPnL = undefined;
        }
      } else if (plugin.settings.trade.useDirectPnLInput !== undefined) {
        mergedData.useDirectPnLInput = plugin.settings.trade.useDirectPnLInput;
        if (mergedData.useDirectPnLInput && !hasExplicitDirectPnL) {
          mergedData.directPnL = undefined;
        }
      }
    } catch (error) {
      console.error('Error loading PNL input mode preference:', error);
      
    }

    
    try {
      const tradeFormLayout = plugin.settings.trade.tradeFormLayout;
      if (
        tradeFormLayout?.assetTypeMode === 'fixed' &&
        tradeFormLayout.defaultAssetType &&
        !mergedData.assetType
      ) {
        mergedData.assetType = tradeFormLayout.defaultAssetType;
      }

      const lastAssetType = plugin.uiStateManager.getState().lastAssetType;
      if (lastAssetType && !mergedData.assetType) {
        
        mergedData.assetType = lastAssetType;
      }
    } catch (error) {
      console.error('Error accessing last asset type from UI state:', error);
    }

    
    try {
      if (plugin.settings.trade.defaultRiskAmount) {
        const defaultRisk = plugin.settings.trade.defaultRiskAmount;
        if (defaultRisk > 0 && !mergedData.riskAmount) {
          mergedData.riskAmount = defaultRisk;
        }
      }
    } catch (error) {
      console.error('Error loading default risk amount from settings:', error);
    }

    return mergedData;
  });
  const formDataRef = useRef(formData);
  useLayoutEffect(() => {
    formDataRef.current = formData;
  }, [formData]);
  const commitFormData = useCallback(
    (
      update:
        | Partial<TradeFormData>
        | ((current: Partial<TradeFormData>) => Partial<TradeFormData>)
    ) => {
      const nextFormData =
        typeof update === 'function' ? update(formDataRef.current) : update;
      formDataRef.current = nextFormData;
      setFormData(nextFormData);
    },
    []
  );

  
  
  
  const initialFormData = useMemo(() => {
    return structuredClone(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentional: capture initial state only on first render
  }, []);

  
  const initialFormDataRef = useRef<Partial<TradeFormData> | null>(
    initialFormData
  );

  
  const [errors, setErrors] = useState<TradeFormErrors>({});

  
  
  const [submissionErrors, setSubmissionErrors] = useState<TradeFormErrors>({});

  
  const [formSubmitted, setFormSubmitted] = useState(false);

  
  const submissionInFlightRef = useRef(false);

  
  const [tempImages, setTempImages] = useState<string[]>([]);

  
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  
  const formRef = useRef<HTMLFormElement>(null);

  
  const [cleanupPerformed, setCleanupPerformed] = useState(false);

  const runValidation = useCallback(
    (nextData: Partial<TradeFormData>) => {
      const validationErrors = validateTradeForm(nextData);

      
      if (plugin?.customFieldsService && nextData.customFields) {
        const customFieldDefinitions = plugin.customFieldsService.getFields();
        const customFieldErrors = validateCustomFields(
          nextData.customFields,
          customFieldDefinitions,
          plugin.customFieldsService
        );
        if (Object.keys(customFieldErrors).length > 0) {
          validationErrors.customFields = customFieldErrors;
        }
      }

      
      setErrors(validationErrors);
      return validationErrors;
    },
    [plugin]
  );

  const hasDisplayedErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    if (!formSubmitted && !hasDisplayedErrors) return;
    runValidation(withCurrentTimeForBlankTradeTimes(formData, isEditMode));
  }, [formData, formSubmitted, hasDisplayedErrors, isEditMode, runValidation]);

  
  const cleanupPendingImages = useCallback(async () => {
    try {
      
      if (cleanupPerformed || pendingImagesRef.current.length === 0) {
        return;
      }

      
      setCleanupPerformed(true);

      
      const imagesToCleanup = [...pendingImagesRef.current];

      
      for (const imagePath of imagesToCleanup) {
        await imageService.deleteImage(imagePath, true); 
      }

      
      setTempImages([]);
    } catch (error) {
      console.error('Failed to clean up pending images:', error);
    }
  }, [cleanupPerformed]);

  
  const deleteImageFile = async (imagePath: string) => {
    try {
      if (!imagePath) return;

      
      const isNewlyAddedImage = tempImages.includes(imagePath);

      
      
      commitFormData((prevData) => {
        const currentImages = Array.isArray(prevData.images)
          ? [...prevData.images]
          : [];
        const newImages = currentImages.filter((img) => img !== imagePath);
        return {
          ...prevData,
          images: newImages,
        };
      });

      if (isNewlyAddedImage) {
        
        try {
          await imageService.deleteImage(imagePath, true); 
          setTempImages((prev) => prev.filter((path) => path !== imagePath));
        } catch (error) {
          
          logger.debug(
            `Newly added image file deletion failed (may already be deleted): ${imagePath}`,
            error
          );
        }
      } else {
        if (isPersistedTradeUpload(imagePath)) {
          setImagesToDelete((prev) =>
            prev.includes(imagePath) ? prev : [...prev, imagePath]
          );
        }

        
        
        return;
      }
    } catch (error) {
      console.error(`Failed to delete image file ${imagePath}:`, error);
    }
  };

  const handleFieldChange = useCallback(
    (field: keyof TradeFormData, value: TradeFormValue) => {
      
      const currentFormData = formDataRef.current;
      const newData = {
        ...currentFormData,
        [field]: value,
      };

      if (field === 'commission') {
        newData.hasExplicitCommission = true;
      }

      
      
      
      if (field === 'currency' && value !== currentFormData.currency) {
        newData.fxRate = undefined;
        newData.fxRateBaseCurrency = undefined;
      }
      if (field === 'fxRate') {
        newData.fxRateBaseCurrency =
          value === undefined
            ? undefined
            : plugin.settings?.general?.currency || 'USD';
      }

      let executionsChanged = false;
      if (
        (field === 'entries' || field === 'exits') &&
        currentFormData.unrealizedPriceSnapshot !== undefined &&
        currentFormData.unrealizedPriceSnapshot !== null
      ) {
        const referenceDate = new Date();
        executionsChanged = shouldInvalidateUnrealizedSnapshot(
          withCurrentTimeForBlankTradeTimes(
            withResolvedSnapshotExitExplicitness(currentFormData),
            isEditMode,
            referenceDate
          ),
          withCurrentTimeForBlankTradeTimes(
            withResolvedSnapshotExitExplicitness(newData),
            isEditMode,
            referenceDate
          )
        );
      }

      if (
        executionsChanged ||
        hasQuoteContextChanged(field, currentFormData[field], value) ||
        (field === 'useDirectPnLInput' && value !== currentFormData[field])
      ) {
        newData.unrealizedPriceSnapshot = undefined;
        newData.unrealizedPriceSnapshotTime = undefined;
      }
      if (
        field === 'unrealizedPriceSnapshotTime' &&
        (value === undefined || value === null)
      ) {
        newData.unrealizedPriceSnapshot = undefined;
      }

      const nextData = shouldRefreshAutoCommission(field)
        ? applyAutoCommission(newData, plugin.optionsService, currentFormData)
        : newData;

      commitFormData(nextData);

      if (formSubmitted) {
        runValidation(withCurrentTimeForBlankTradeTimes(nextData, isEditMode));
      }
    },
    [
      commitFormData,
      formSubmitted,
      isEditMode,
      plugin.optionsService,
      plugin.settings?.general?.currency,
      runValidation,
    ]
  );

  
  const pendingImagesRef = useRef<string[]>([]);

  
  const tradeNumberRef = useRef<string | null>(null);
  const tradeNumberKeyRef = useRef<string | null>(null);

  
  useEffect(() => {
    pendingImagesRef.current = tempImages;
  }, [tempImages]);

  const getTradeNumberKey = useCallback(
    (ticker: string, date: Date, tradePrefix: string): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${ticker}-${tradePrefix}-${year}-${month}-${day}`;
    },
    []
  );

  const getExistingMediaOwnerForIdentity = useCallback(
    (safeTicker: string, targetDate: Date, tradePrefix: string) => {
      const tradeService = plugin.tradeService;
      const initialFilePath = initialData.filePath;
      const initialInstrument = initialData.instrument;
      const initialEntryTime = initialData.entryTime
        ? new Date(String(initialData.entryTime))
        : null;
      if (
        !isEditMode ||
        !tradeService ||
        !initialFilePath ||
        !initialInstrument ||
        !initialEntryTime ||
        isNaN(initialEntryTime.getTime())
      ) {
        return null;
      }

      const initialSafeTicker =
        tradeService.sanitizeTickerForFilename(initialInstrument);
      if (initialSafeTicker !== safeTicker) {
        return null;
      }

      const initialIsMissedTrade = initialData.isMissedTrade || false;
      const initialTargetDate = initialIsMissedTrade
        ? getTradingDay(initialEntryTime, plugin)
        : initialEntryTime;
      const initialTradePrefix = initialIsMissedTrade
        ? 'M'
        : initialData.isBacktestTrade
          ? 'B'
          : 'T';
      const initialKey = getTradeNumberKey(
        initialSafeTicker,
        initialTargetDate,
        initialTradePrefix
      );
      const currentKey = getTradeNumberKey(safeTicker, targetDate, tradePrefix);

      return initialKey === currentKey
        ? getTradeMediaOwner(initialFilePath, initialInstrument)
        : null;
    },
    [
      getTradeNumberKey,
      initialData.entryTime,
      initialData.filePath,
      initialData.instrument,
      initialData.isBacktestTrade,
      initialData.isMissedTrade,
      isEditMode,
      plugin,
    ]
  );

  const ensureFolderHierarchy = useCallback(
    async (folderPath: string) => {
      const app = plugin.app;
      const normalizedPath = normalizePath(folderPath);
      const segments = normalizedPath.split('/').filter(Boolean);
      let currentPath = '';

      for (const segment of segments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        const resolvedPath = normalizePath(currentPath);

        try {
          const exists = await app.vault.adapter.exists(resolvedPath);
          if (!exists) {
            await app.vault.adapter.mkdir(resolvedPath);
          }
        } catch (error) {
          console.warn(`Failed to ensure folder ${resolvedPath}:`, error);
        }
      }
    },
    [plugin.app]
  );

  const isPersistedTradeUpload = useCallback(
    (imagePath: string): boolean =>
      isEditMode &&
      isManagedTradeMediaPath({
        mediaPath: imagePath,
        tradeFilePath: initialData.filePath,
        instrument: initialData.instrument,
      }),
    [initialData.filePath, initialData.instrument, isEditMode]
  );

  const handleAddImage = async (file: File): Promise<string> => {
    try {
      const pluginInstance = plugin;
      const tradeService = pluginInstance ? pluginInstance.tradeService : null;

      if (!tradeService) {
        throw new Error('Could not access TradeService');
      }

      const entryTime = formData.entryTime
        ? new Date(formData.entryTime)
        : new Date();
      const ticker = formData.instrument || initialData.instrument || 'UNKNOWN';

      const isMissedTrade = formData.isMissedTrade || false;
      const isBacktestTrade = formData.isBacktestTrade || false;
      const tradePrefix = isMissedTrade ? 'M' : isBacktestTrade ? 'B' : 'T';

      const targetDate = isMissedTrade
        ? getTradingDay(entryTime, pluginInstance)
        : entryTime;

      const safeTicker = tradeService.sanitizeTickerForFilename(ticker);
      const tradeNumberKey = getTradeNumberKey(
        safeTicker,
        targetDate,
        tradePrefix
      );
      const initialFilePath = initialData.filePath || '';
      const existingMediaOwner = getExistingMediaOwnerForIdentity(
        safeTicker,
        targetDate,
        tradePrefix
      );

      const backtestTradeService = isBacktestTrade
        ? pluginInstance?.backtestTradeService ||
          (pluginInstance?.serviceManager?.getBacktestTradeService
            ? await pluginInstance.serviceManager.getBacktestTradeService()
            : null)
        : null;

      let tradeNumber: string;

      if (
        tradeNumberRef.current &&
        tradeNumberKeyRef.current === tradeNumberKey
      ) {
        tradeNumber = tradeNumberRef.current;
      } else {
        let resolvedTradeNumber: string | null = null;

        if (initialFilePath && existingMediaOwner) {
          const match = initialFilePath.match(/[TMB](\d+)\.md$/);
          if (match) {
            resolvedTradeNumber = match[1];
          }
        }

        if (resolvedTradeNumber) {
          tradeNumber = resolvedTradeNumber;
        } else if (isMissedTrade && pluginInstance?.missedTradeService) {
          tradeNumber = String(
            await pluginInstance.missedTradeService.getMissedTradeNumberForDay(
              safeTicker,
              targetDate
            )
          );
        } else if (isBacktestTrade) {
          if (backtestTradeService) {
            tradeNumber = String(
              await backtestTradeService.getBacktestTradeNumberForDay(
                safeTicker,
                targetDate
              )
            );
          } else {
            console.warn(
              'BacktestTradeService unavailable; falling back to trade numbering'
            );
            tradeNumber = String(
              await tradeService.getTradeNumberForDay(safeTicker, targetDate)
            );
          }
        } else {
          tradeNumber = String(
            await tradeService.getTradeNumberForDay(safeTicker, targetDate)
          );
        }
      }

      tradeNumberRef.current = tradeNumber;
      tradeNumberKeyRef.current = tradeNumberKey;

      const year = targetDate.getFullYear();
      const monthNum = targetDate.getMonth() + 1;
      const month = String(monthNum).padStart(2, '0');
      const weekFolderName = getWeekFolderName(targetDate, year);
      const dateFormat = pluginInstance?.settings.trade.dateFormat || 'DDMMYY';
      const formattedDate = tradeService.formatDateForFilename(
        targetDate,
        dateFormat
      );
      const imageFolderName = `${safeTicker}-${formattedDate}-${tradePrefix}${tradeNumber}`;

      const folderPathService =
        pluginInstance?.serviceManager?.getFolderPathService();
      const baseFolderPath =
        folderPathService?.journalFolderPath || '!Journalit';
      const quarter = getQuarterForMonth(monthNum);
      const quarterFolder = getQuarterString(quarter);

      const baseFolder =
        existingMediaOwner?.directory ??
        (folderPathService
          ? folderPathService.getDatePathForQuarterSync(
              String(year),
              quarter,
              month,
              weekFolderName,
              'media',
              imageFolderName
            )
          : `${baseFolderPath}/${year}/${quarterFolder}/${month}/${weekFolderName}/media/${imageFolderName}`);
      const imageFilePrefix = existingMediaOwner
        ? existingMediaOwner.fileNamePrefix.slice(0, -1)
        : `${safeTicker}-${tradePrefix}${tradeNumber}`;

      await ensureFolderHierarchy(baseFolder);

      const filePath = await imageService.saveImage(
        file,
        baseFolder,
        imageFilePrefix
      );

      setTempImages((prev) => [...prev, filePath]);

      return filePath;
    } catch (error) {
      console.error('Failed to upload media:', error);
      throw new Error(
        `Failed to upload media: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    setFormSubmitted(true);

    
    
    
    const submitReadyData = clearInvalidUnrealizedSnapshot(
      syncHiddenDirectPnLExitTime(
        withCurrentTimeForBlankTradeTimes(
          withResolvedSnapshotExitExplicitness(formData),
          isEditMode
        ),
        layout ?? plugin?.settings.trade.tradeFormLayout,
        isEditMode
      )
    );

    
    const validationErrors = runValidation(submitReadyData);

    
    setErrors(validationErrors);
    setSubmissionErrors({});

    
    
    
    const dataToSubmit = {
      ...normalizeSubmittedTradeStatus(submitReadyData),
    };

    
    if (isEditMode && initialData.filePath) {
      dataToSubmit.filePath = initialData.filePath;
    }

    
    if (!dataToSubmit.assetType && formData.assetType) {
      dataToSubmit.assetType = formData.assetType;
    }

    
    if (formData.useDirectPnLInput !== undefined) {
      dataToSubmit.useDirectPnLInput = formData.useDirectPnLInput;
    }
    if (formData.directPnL !== undefined) {
      dataToSubmit.directPnL = formData.directPnL;
    }

    
    if (formData.isMissedTrade !== undefined) {
      dataToSubmit.isMissedTrade = formData.isMissedTrade;
    }
    if (formData.missedReason !== undefined) {
      dataToSubmit.missedReason = formData.missedReason;
    }

    
    if (!hasFormErrors(validationErrors) && onSubmit) {
      if (submissionInFlightRef.current) {
        return;
      }

      submissionInFlightRef.current = true;

      try {
        await resolveSetupSelections(plugin, dataToSubmit);
      } catch (error) {
        console.error('Failed to prepare setup selections:', error);
        const setupResolutionError = t('validation.setup-resolution-failed');
        setSubmissionErrors((current) => ({
          ...current,
          form: setupResolutionError,
        }));
        submissionInFlightRef.current = false;
        return;
      }

      
      await saveCustomOptions(dataToSubmit);

      
      try {
        for (const imagePath of imagesToDelete) {
          await imageService.deleteImage(imagePath, true); 
        }
      } catch (error) {
        console.error('Failed to delete marked images:', error);
      }

      let nextTempImages = tempImages;

      if (
        Array.isArray(dataToSubmit.images) &&
        dataToSubmit.images.length > 0 &&
        tempImages.length > 0
      ) {
        try {
          const pluginInstance = plugin;
          const tradeService = pluginInstance?.tradeService;

          if (tradeService) {
            const entryTime = dataToSubmit.entryTime
              ? new Date(dataToSubmit.entryTime)
              : new Date();
            const isMissedTrade = dataToSubmit.isMissedTrade || false;
            const isBacktestTrade = dataToSubmit.isBacktestTrade || false;
            const tradePrefix = isMissedTrade
              ? 'M'
              : isBacktestTrade
                ? 'B'
                : 'T';
            const targetDate = isMissedTrade
              ? getTradingDay(entryTime, pluginInstance)
              : entryTime;
            const ticker = dataToSubmit.instrument || 'UNKNOWN';
            const safeTicker = tradeService.sanitizeTickerForFilename(ticker);

            const tradeNumberKey = getTradeNumberKey(
              safeTicker,
              targetDate,
              tradePrefix
            );
            const existingMediaOwner = getExistingMediaOwnerForIdentity(
              safeTicker,
              targetDate,
              tradePrefix
            );
            const backtestTradeService = isBacktestTrade
              ? pluginInstance?.backtestTradeService ||
                (pluginInstance?.serviceManager?.getBacktestTradeService
                  ? await pluginInstance.serviceManager.getBacktestTradeService()
                  : null)
              : null;
            let tradeNumber = tradeNumberRef.current;

            if (!tradeNumber || tradeNumberKeyRef.current !== tradeNumberKey) {
              if (isMissedTrade && pluginInstance?.missedTradeService) {
                tradeNumber = String(
                  await pluginInstance.missedTradeService.getMissedTradeNumberForDay(
                    safeTicker,
                    targetDate
                  )
                );
              } else if (isBacktestTrade) {
                if (backtestTradeService) {
                  tradeNumber = String(
                    await backtestTradeService.getBacktestTradeNumberForDay(
                      safeTicker,
                      targetDate
                    )
                  );
                } else {
                  console.warn(
                    'BacktestTradeService unavailable; falling back to trade numbering'
                  );
                  tradeNumber = String(
                    await tradeService.getTradeNumberForDay(
                      safeTicker,
                      targetDate
                    )
                  );
                }
              } else {
                tradeNumber = String(
                  await tradeService.getTradeNumberForDay(
                    safeTicker,
                    targetDate
                  )
                );
              }

              tradeNumberRef.current = tradeNumber;
              tradeNumberKeyRef.current = tradeNumberKey;
            }

            const year = targetDate.getFullYear();
            const monthNum = targetDate.getMonth() + 1;
            const month = String(monthNum).padStart(2, '0');
            const weekFolderName = getWeekFolderName(targetDate, year);
            const dateFormat =
              pluginInstance?.settings.trade.dateFormat || 'DDMMYY';
            const formattedDate = tradeService.formatDateForFilename(
              targetDate,
              dateFormat
            );
            const imageFolderName = `${safeTicker}-${formattedDate}-${tradePrefix}${tradeNumber}`;

            const folderPathService =
              pluginInstance?.serviceManager?.getFolderPathService();
            const baseFolderPath =
              folderPathService?.journalFolderPath || '!Journalit';
            const quarter = getQuarterForMonth(monthNum);
            const quarterFolder = getQuarterString(quarter);

            const baseFolder =
              existingMediaOwner?.directory ??
              (folderPathService
                ? folderPathService.getDatePathForQuarterSync(
                    String(year),
                    quarter,
                    month,
                    weekFolderName,
                    'media',
                    imageFolderName
                  )
                : `${baseFolderPath}/${year}/${quarterFolder}/${month}/${weekFolderName}/media/${imageFolderName}`);

            await ensureFolderHierarchy(baseFolder);

            const fileNamePrefix = existingMediaOwner
              ? existingMediaOwner.fileNamePrefix.slice(0, -1)
              : `${safeTicker}-${tradePrefix}${tradeNumber}`;
            const updatedImages: string[] = [];
            const tempImageMap = new Map<string, string>();
            const tempImageSet = new Set(tempImages);

            for (const imagePath of dataToSubmit.images) {
              if (!tempImageSet.has(imagePath)) {
                updatedImages.push(imagePath);
                continue;
              }

              let finalPath = imagePath;

              if (!imagePath.startsWith(`${baseFolder}/`)) {
                const file = plugin.app.vault.getAbstractFileByPath(imagePath);
                if (file && file instanceof TFile) {
                  const extensionIndex = file.name.lastIndexOf('.');
                  const extension =
                    extensionIndex >= 0 ? file.name.slice(extensionIndex) : '';
                  const fileId = getGeneratedMediaFileId(file.name);
                  const newFileName = `${fileNamePrefix}-${fileId}${extension}`;
                  const newPath = normalizePath(`${baseFolder}/${newFileName}`);

                  try {
                    await plugin.app.vault.rename(file, newPath);
                    finalPath = newPath;
                  } catch (error) {
                    console.warn(`Failed to move image ${imagePath}:`, error);
                  }
                }
              }

              updatedImages.push(finalPath);
              tempImageMap.set(imagePath, finalPath);
            }

            const updatedTempImages = tempImages.map(
              (imagePath) => tempImageMap.get(imagePath) || imagePath
            );
            const updatedImageAnnotations = rekeyImageAnnotations(
              dataToSubmit.imageAnnotations,
              tempImageMap
            );

            dataToSubmit.images = updatedImages;
            dataToSubmit.imageAnnotations = updatedImageAnnotations;
            commitFormData((prevData) => ({
              ...prevData,
              images: updatedImages,
              imageAnnotations: rekeyImageAnnotations(
                prevData.imageAnnotations,
                tempImageMap
              ),
            }));
            setTempImages(updatedTempImages);
            nextTempImages = updatedTempImages;
          }
        } catch (error) {
          console.error(
            'Failed to normalize trade images before submit:',
            error
          );
        }
      }

      
      pendingImagesRef.current = [];
      setCleanupPerformed(true);

      let submitSucceeded = true;

      try {
        const result = await onSubmit(completeTradeFormData(dataToSubmit));
        submitSucceeded = result !== false;
      } catch (error) {
        console.error('Trade form submission failed:', error);
        submitSucceeded = false;
      }

      if (!submitSucceeded) {
        submissionInFlightRef.current = false;
        pendingImagesRef.current = nextTempImages;
        setCleanupPerformed(false);
        return;
      }

      
      setTempImages([]);
      setImagesToDelete([]);
      
      setSubmissionErrors({});
      setErrors({});
      setFormSubmitted(false);
      submissionInFlightRef.current = false;
    }
  };

  
  const saveCustomOptions = async (data: Partial<TradeFormData>) => {
    try {
      
      const optionsService =
        plugin.optionsService || new CustomOptionsService(plugin);

      
      if (!optionsService) {
        return;
      }

      
      if (data.instrument && data.assetType) {
        const existingInstrument = optionsService.getInstrument(
          data.instrument,
          data.assetType
        );
        const isEditSubmission = Boolean(data.filePath);

        const futuresData =
          data.assetType === 'futures' &&
          (data.dollarPerPoint !== undefined ||
            data.tickSize !== undefined ||
            data.tickValue !== undefined)
            ? {
                dollarPerPoint: data.dollarPerPoint,
                tickSize: data.tickSize,
                tickValue: data.tickValue,
              }
            : undefined;

        const forexData =
          data.assetType === 'forex' &&
          (data.lotSize !== undefined || data.pipValue !== undefined)
            ? {
                lotSize: data.lotSize,
                pipValue: data.pipValue,
                pipSize: existingInstrument?.forexData?.pipSize,
              }
            : undefined;

        const cfdData =
          data.assetType === 'cfd' && data.contractSize !== undefined
            ? {
                contractSize: data.contractSize,
              }
            : undefined;

        if (existingInstrument) {
          if (!isEditSubmission) {
            if (data.assetType === 'futures' && futuresData !== undefined) {
              await optionsService.setFuturesDataForInstrument(
                data.instrument,
                futuresData
              );
            } else if (data.assetType === 'forex' && forexData !== undefined) {
              await optionsService.setForexDataForInstrument(
                data.instrument,
                forexData
              );
            } else if (data.assetType === 'cfd' && cfdData !== undefined) {
              await optionsService.setCfdDataForInstrument(
                data.instrument,
                cfdData
              );
            }
          }
        } else {
          await optionsService.addOption(
            OptionType.INSTRUMENT,
            data.instrument,
            data.assetType,
            isEditSubmission ? undefined : futuresData,
            isEditSubmission ? undefined : forexData,
            isEditSubmission ? undefined : cfdData
          );
        }
      }

      
      if (data.account && data.account.length > 0) {
        await optionsService.addOptions(OptionType.ACCOUNT, data.account);
      }

      
      if (data.mistake && data.mistake.length > 0) {
        await optionsService.addOptions(OptionType.MISTAKE, data.mistake);
      }

      
      if (data.customTags && data.customTags.length > 0) {
        await optionsService.addOptions(OptionType.TAG, data.customTags);
      }
    } catch (error) {
      console.error('Failed to save custom options:', error);
    }
  };

  
  useEffect(() => {
    
    return () => {
      void cleanupPendingImages();
    };
  }, [cleanupPendingImages]);

  const handleCancel = (): Promise<boolean> | boolean => {
    if (!onCancel) return true;

    const result = onCancel();
    return result === undefined ? true : result;
  };

  
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const isDirty = useCallback((): boolean => {
    if (!initialFormDataRef.current) return false;

    const initial = initialFormDataRef.current;

    
    const instrumentChanged =
      (formData.instrument || '').trim() !== (initial.instrument || '').trim();
    const entryPriceChanged =
      (formData.entryPrice || 0) !== (initial.entryPrice || 0);
    const exitPriceChanged =
      (formData.exitPrice || 0) !== (initial.exitPrice || 0);
    const positionSizeChanged =
      (formData.positionSize || 0) !== (initial.positionSize || 0);
    const normalizeOptionalNumber = (value: unknown): number | null =>
      typeof value === 'number' && Number.isFinite(value) ? value : null;
    const currencyChanged =
      (formData.currency || '').trim() !== (initial.currency || '').trim();
    const fxRateChanged =
      normalizeOptionalNumber(formData.fxRate) !==
      normalizeOptionalNumber(initial.fxRate);
    const fxRateBaseCurrencyChanged =
      (formData.fxRateBaseCurrency || '').trim() !==
      (initial.fxRateBaseCurrency || '').trim();
    const trackForexPnlConversionChange =
      formData.forexPnlConversionRateSource === 'manual' ||
      initial.forexPnlConversionRateSource === 'manual';
    const forexPnlConversionRateChanged =
      trackForexPnlConversionChange &&
      normalizeOptionalNumber(formData.forexPnlConversionRate) !==
        normalizeOptionalNumber(initial.forexPnlConversionRate);
    const forexPnlConversionContextChanged =
      trackForexPnlConversionChange &&
      ((formData.forexQuoteCurrency || '').trim() !==
        (initial.forexQuoteCurrency || '').trim() ||
        (formData.forexPnlConversionBaseCurrency || '').trim() !==
          (initial.forexPnlConversionBaseCurrency || '').trim());
    const directPnLChanged =
      normalizeOptionalNumber(formData.directPnL) !==
      normalizeOptionalNumber(initial.directPnL);
    const riskAmountChanged =
      normalizeOptionalNumber(formData.riskAmount) !==
      normalizeOptionalNumber(initial.riskAmount);
    const stopLossChanged =
      normalizeOptionalNumber(formData.stopLoss) !==
      normalizeOptionalNumber(initial.stopLoss);
    const unrealizedPriceSnapshotChanged =
      normalizeOptionalNumber(formData.unrealizedPriceSnapshot) !==
      normalizeOptionalNumber(initial.unrealizedPriceSnapshot);
    const useDirectPnLInputChanged =
      Boolean(formData.useDirectPnLInput) !==
      Boolean(initial.useDirectPnLInput);
    const normalizeDateSnapshot = (date: unknown): string | null => {
      if (date instanceof Date) {
        return Number.isFinite(date.getTime()) ? date.toISOString() : null;
      }
      if (typeof date === 'string' || typeof date === 'number') {
        return String(date);
      }
      return null;
    };
    const entryTimeChanged =
      normalizeDateSnapshot(formData.entryTime) !==
      normalizeDateSnapshot(initial.entryTime);
    const unrealizedPriceSnapshotTimeChanged =
      normalizeDateSnapshot(formData.unrealizedPriceSnapshotTime) !==
      normalizeDateSnapshot(initial.unrealizedPriceSnapshotTime);
    const thesisChanged =
      (formData.thesis || '').trim() !== (initial.thesis || '').trim();
    const directionChanged =
      (formData.direction || '') !== (initial.direction || '');
    const normalizeDividendSnapshot = (
      dividends: Partial<TradeFormData>['dividends']
    ) =>
      JSON.stringify(
        (dividends || []).map((dividend) => ({
          time:
            dividend?.time instanceof Date
              ? Number.isFinite(dividend.time.getTime())
                ? dividend.time.toISOString()
                : null
              : dividend?.time
                ? String(dividend.time)
                : null,
          amount: dividend?.amount ?? null,
        }))
      );
    const dividendsChanged =
      normalizeDividendSnapshot(formData.dividends) !==
      normalizeDividendSnapshot(initial.dividends);
    const normalizeExecutionSnapshot = (
      executions:
        | Partial<TradeFormData>['entries']
        | Partial<TradeFormData>['exits']
    ) =>
      JSON.stringify(
        (executions || []).map((execution) => ({
          time:
            execution?.time instanceof Date
              ? Number.isFinite(execution.time.getTime())
                ? execution.time.toISOString()
                : null
              : execution?.time
                ? String(execution.time)
                : null,
          blankTimeDate:
            execution?.blankTimeDate instanceof Date
              ? Number.isFinite(execution.blankTimeDate.getTime())
                ? execution.blankTimeDate.toISOString()
                : null
              : execution?.blankTimeDate
                ? String(execution.blankTimeDate)
                : null,
          price: execution?.price ?? null,
          size: execution?.size ?? null,
          notional: execution?.notional ?? null,
          hasExplicitPrice:
            execution && 'hasExplicitPrice' in execution
              ? execution.hasExplicitPrice
              : undefined,
        }))
      );
    const entriesChanged =
      normalizeExecutionSnapshot(formData.entries) !==
      normalizeExecutionSnapshot(initial.entries);
    const exitsChanged =
      normalizeExecutionSnapshot(formData.exits) !==
      normalizeExecutionSnapshot(initial.exits);
    const normalizeIdealExitSnapshot = (
      idealExits: Partial<TradeFormData>['idealExits']
    ) =>
      JSON.stringify(
        (idealExits || []).map((idealExit) => ({
          time:
            idealExit?.time instanceof Date
              ? Number.isFinite(idealExit.time.getTime())
                ? idealExit.time.toISOString()
                : null
              : idealExit?.time
                ? String(idealExit.time)
                : null,
          price: idealExit?.price ?? null,
          size: idealExit?.size ?? null,
        }))
      );
    const idealExitsChanged =
      normalizeIdealExitSnapshot(formData.idealExits) !==
      normalizeIdealExitSnapshot(initial.idealExits);
    const normalizeTakeProfitSnapshot = (
      takeProfits: Partial<TradeFormData>['takeProfits']
    ) =>
      JSON.stringify(
        (takeProfits || []).map((target) => ({
          price: target?.price ?? null,
          closePercent: target?.closePercent ?? null,
        }))
      );
    const takeProfitsChanged =
      normalizeTakeProfitSnapshot(formData.takeProfits) !==
      normalizeTakeProfitSnapshot(initial.takeProfits);

    const imagesChanged =
      JSON.stringify(formData.images ?? []) !==
      JSON.stringify(initial.images ?? []);
    const imageAnnotationsChanged =
      JSON.stringify(
        serializeImageAnnotations(formData.imageAnnotations ?? {})
      ) !==
      JSON.stringify(serializeImageAnnotations(initial.imageAnnotations ?? {}));

    return (
      instrumentChanged ||
      entryPriceChanged ||
      exitPriceChanged ||
      positionSizeChanged ||
      currencyChanged ||
      fxRateChanged ||
      fxRateBaseCurrencyChanged ||
      forexPnlConversionRateChanged ||
      forexPnlConversionContextChanged ||
      directPnLChanged ||
      riskAmountChanged ||
      stopLossChanged ||
      unrealizedPriceSnapshotChanged ||
      unrealizedPriceSnapshotTimeChanged ||
      useDirectPnLInputChanged ||
      entryTimeChanged ||
      entriesChanged ||
      exitsChanged ||
      idealExitsChanged ||
      thesisChanged ||
      imagesChanged ||
      imageAnnotationsChanged ||
      directionChanged ||
      dividendsChanged ||
      takeProfitsChanged
    );
  }, [
    formData.instrument,
    formData.entryPrice,
    formData.exitPrice,
    formData.positionSize,
    formData.currency,
    formData.fxRate,
    formData.fxRateBaseCurrency,
    formData.forexQuoteCurrency,
    formData.forexPnlConversionRate,
    formData.forexPnlConversionBaseCurrency,
    formData.forexPnlConversionRateSource,
    formData.directPnL,
    formData.riskAmount,
    formData.stopLoss,
    formData.unrealizedPriceSnapshot,
    formData.unrealizedPriceSnapshotTime,
    formData.useDirectPnLInput,
    formData.entryTime,
    formData.entries,
    formData.exits,
    formData.idealExits,
    formData.thesis,
    formData.images,
    formData.imageAnnotations,
    formData.direction,
    formData.dividends,
    formData.takeProfits,
  ]);

  const displayedErrors = {
    ...errors,
    ...submissionErrors,
  };
  const submissionState: 'idle' | 'retryable-error' = hasFormErrors(
    submissionErrors
  )
    ? 'retryable-error'
    : 'idle';

  return {
    formData,
    errors: displayedErrors,
    submissionState,
    formRef,
    handleFieldChange,
    handleAddImage,
    deleteImageFile,
    handleSubmit,
    handleCancel,
    isSubmitting,
    setIsSubmitting,
    formSubmitted,
    cleanupPerformed,
    imagesToDelete, 
    isDirty, 
  };
};
