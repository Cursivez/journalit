import { logger } from '../../../../utils/logger';


import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type SyntheticEvent,
} from 'react';
import { normalizePath, TFile } from 'obsidian';
import { CustomOptionsService, OptionType } from '../../../../services/options';
import { imageService } from '../../../../services/image/ImageService';
import {
  TradeFormData,
  TradeFormErrors,
  TradeFormValue,
  DEFAULT_TRADE_FORM_DATA,
} from '../types';
import {
  validateTradeForm,
  hasFormErrors,
  validateCustomFields,
} from '../validation';
import { deriveRawDirectPnLFromStoredCombinedPnL } from '../../../../utils/pnlCalculation';
import { usePlugin } from '../../../../hooks';
import { getTradingDay } from '../../../../utils/tradingDayUtils';
import { isTradeOpenWithContext } from '../../../../utils/tradeStatusUtils';
import {
  getQuarterForMonth,
  getQuarterString,
  getWeekFolderName,
} from '../../../../utils/dateUtils';

interface UseTradeFormProps {
  initialData?: Partial<TradeFormData>;
  isEditMode?: boolean;
  onSubmit?: (data: TradeFormData) => Promise<boolean> | boolean;
  onCancel?: () => void;
}

const hasTradeLegValues = (leg: {
  price?: number | null;
  size?: number | null;
}): boolean =>
  (leg.price !== undefined && leg.price !== null && leg.price !== 0) ||
  (leg.size !== undefined && leg.size !== null && leg.size !== 0);

const completeTradeFormData = (
  data: Partial<TradeFormData>
): TradeFormData => ({
  ...DEFAULT_TRADE_FORM_DATA,
  ...data,
});

const withCurrentTimeForBlankTradeTimes = (
  data: Partial<TradeFormData>
): Partial<TradeFormData> => {
  const now = new Date();
  const applyCurrentTime = (date?: Date): Date => {
    const base = date ? new Date(date) : new Date(now);
    base.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
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
      time: entry.time ?? applyCurrentTime(entry.blankTimeDate),
      blankTimeDate: undefined,
    }));
  }

  if (Array.isArray(data.exits)) {
    normalized.exits = data.exits.map((exit) => ({
      ...exit,
      time:
        exit.time ??
        (hasTradeLegValues(exit)
          ? applyCurrentTime(exit.blankTimeDate)
          : undefined),
      blankTimeDate: undefined,
    }));
  }

  const entryTime = earliestTime(
    normalized.entries?.map((entry) => entry.time) ?? []
  );
  if (entryTime) {
    normalized.entryTime = entryTime;
  }

  const exitTime = latestTime(normalized.exits?.map((exit) => exit.time) ?? []);
  if (exitTime) {
    normalized.exitTime = exitTime;
  } else if (Array.isArray(normalized.exits)) {
    normalized.exitTime = undefined;
  }

  return normalized;
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

  return (
    (data.tradeStatus !== 'OPEN' && data.useDirectPnLInput === true) ||
    (data.tradeStatus !== 'OPEN' && hasScalarExitPrice) ||
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

export const useTradeForm = ({
  initialData = {},
  isEditMode = false,
  onSubmit,
  onCancel,
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
      if (!editData.customTags) editData.customTags = [];
      if (!editData.setup) editData.setup = [];
      if (!editData.mistake) editData.mistake = [];
      if (!editData.account) editData.account = [];
      if (!editData.setupIds) editData.setupIds = [];

      
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

      const isSyncedOpenTrade = isTradeOpenWithContext({
        tradeStatus: editData.tradeStatus,
        exitTime: editData.exitTime,
        exitPrice: editData.exitPrice,
        pnl: editData._originalPnlWasNull ? null : editData.pnl,
        useDirectPnLInput: editData.useDirectPnLInput,
        exits: editData.exits,
        entries: editData.entries,
      });

      
      if (isSyncedTrade) {
        
        
        
        editData.useDirectPnLInput = !isSyncedOpenTrade;
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
      if (plugin.settings.trade.useDirectPnLInput !== undefined) {
        mergedData.useDirectPnLInput = plugin.settings.trade.useDirectPnLInput;
      }
    } catch (error) {
      console.error('Error loading PNL input mode preference:', error);
      
    }

    
    try {
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

  
  
  
  const initialFormData = useMemo(() => {
    return structuredClone(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentional: capture initial state only on first render
  }, []);

  
  const initialFormDataRef = useRef<Partial<TradeFormData> | null>(
    initialFormData
  );

  
  const [errors, setErrors] = useState<TradeFormErrors>({});

  
  const [, setSubmissionErrors] = useState<TradeFormErrors>({});

  
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
    [plugin?.customFieldsService]
  );

  
  useEffect(() => {
    
    if (formSubmitted) {
      runValidation(withCurrentTimeForBlankTradeTimes(formData));
    }
  }, [formData, formSubmitted, runValidation]);

  
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

      
      
      setFormData((prevData) => {
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
      setFormData((prevData) => {
        
        const newData = {
          ...prevData,
          [field]: value,
        };

        
        const isHandlingSync = field.toString().endsWith('Ids');

        if (field === 'setup' && !isHandlingSync) {
          newData.setupIds = Array.isArray(value) ? Array.from(value) : [];
        } else if (field === 'setupIds' && !isHandlingSync) {
          newData.setup = Array.isArray(value) ? Array.from(value) : [];
        }

        return shouldRefreshAutoCommission(field)
          ? applyAutoCommission(newData, plugin.optionsService, prevData)
          : newData;
      });
    },
    [plugin.optionsService]
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
    (imagePath: string): boolean => {
      if (!isEditMode || !initialData.filePath || !initialData.instrument) {
        return false;
      }

      const normalizedPath = normalizePath(imagePath);
      if (!/\.(?:jpe?g|png|gif|bmp|webp|svg)$/i.test(normalizedPath)) {
        return false;
      }

      const tradeFileName = initialData.filePath.split('/').pop() ?? '';
      const tradeNumberMatch = tradeFileName.match(/-([TMB]\d+)\.md$/i);
      if (!tradeNumberMatch || !normalizedPath.includes('/media/')) {
        return false;
      }

      const safeTicker = plugin?.tradeService
        ? plugin.tradeService.sanitizeTickerForFilename(initialData.instrument)
        : initialData.instrument.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = normalizedPath.split('/').pop() ?? '';

      return fileName.startsWith(`${safeTicker}-${tradeNumberMatch[1]}-`);
    },
    [initialData.filePath, initialData.instrument, isEditMode, plugin]
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
        const filePath = initialData?.filePath || '';
        const initialInstrument = initialData?.instrument
          ? tradeService.sanitizeTickerForFilename(initialData.instrument)
          : null;
        const initialEntryTime = initialData?.entryTime
          ? new Date(String(initialData.entryTime))
          : null;
        const initialIsMissedTrade = initialData?.isMissedTrade || false;
        const initialTargetDate =
          initialEntryTime && !isNaN(initialEntryTime.getTime())
            ? initialIsMissedTrade
              ? getTradingDay(initialEntryTime, pluginInstance)
              : initialEntryTime
            : null;
        const initialTradePrefix = initialIsMissedTrade
          ? 'M'
          : initialData?.isBacktestTrade
            ? 'B'
            : 'T';
        const initialKey =
          initialTargetDate && initialInstrument === safeTicker
            ? getTradeNumberKey(
                safeTicker,
                initialTargetDate,
                initialTradePrefix
              )
            : null;

        let resolvedTradeNumber: string | null = null;

        if (filePath && initialKey === tradeNumberKey) {
          const match = filePath.match(/[TMB](\d+)\.md$/);
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

      const baseFolder = folderPathService
        ? folderPathService.getDatePathForQuarterSync(
            String(year),
            quarter,
            month,
            weekFolderName,
            'media',
            imageFolderName
          )
        : `${baseFolderPath}/${year}/${quarterFolder}/${month}/${weekFolderName}/media/${imageFolderName}`;

      await ensureFolderHierarchy(baseFolder);

      const filePath = await imageService.saveImage(
        file,
        baseFolder,
        `${safeTicker}-${tradePrefix}${tradeNumber}`
      );

      setTempImages((prev) => [...prev, filePath]);

      return filePath;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw new Error(
        `Failed to upload image: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    setFormSubmitted(true);

    const submitReadyData = withCurrentTimeForBlankTradeTimes(formData);

    
    const validationErrors = runValidation(submitReadyData);

    
    setErrors(validationErrors);
    setSubmissionErrors(validationErrors);

    
    const dataToSubmit = { ...submitReadyData };

    
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

            const baseFolder = folderPathService
              ? folderPathService.getDatePathForQuarterSync(
                  String(year),
                  quarter,
                  month,
                  weekFolderName,
                  'media',
                  imageFolderName
                )
              : `${baseFolderPath}/${year}/${quarterFolder}/${month}/${weekFolderName}/media/${imageFolderName}`;

            await ensureFolderHierarchy(baseFolder);

            const fileNamePrefix = `${safeTicker}-${tradePrefix}${tradeNumber}`;
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
                  const timestampMatch = file.name.match(/-(\d+)(\.[^.]+)?$/);
                  const timestamp = timestampMatch
                    ? timestampMatch[1]
                    : String(Date.now());
                  const newFileName = `${fileNamePrefix}-${timestamp}${extension}`;
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

            dataToSubmit.images = updatedImages;
            setFormData((prevData) => ({
              ...prevData,
              images: updatedImages,
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

      
      if (data.setup && data.setup.length > 0) {
        await optionsService.addOptions(OptionType.SETUP, data.setup);
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

  const handleCancel = () => {
    if (onCancel) onCancel();
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

    
    const currentImages = Array.isArray(formData.images)
      ? formData.images.length
      : 0;
    const initialImages = Array.isArray(initial.images)
      ? initial.images.length
      : 0;
    const imagesChanged = currentImages !== initialImages;

    return (
      instrumentChanged ||
      entryPriceChanged ||
      exitPriceChanged ||
      positionSizeChanged ||
      thesisChanged ||
      imagesChanged ||
      directionChanged ||
      dividendsChanged ||
      takeProfitsChanged
    );
  }, [
    formData.instrument,
    formData.entryPrice,
    formData.exitPrice,
    formData.positionSize,
    formData.thesis,
    formData.images,
    formData.direction,
    formData.dividends,
    formData.takeProfits,
  ]);

  return {
    formData,
    errors,
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
