

import {
  TradeFormData,
  TradeFormErrors,
  shouldShowTradeDividends,
} from './types';
import { isTradeOpenWithContext } from '../../../utils/tradeStatusUtils';
import {
  validateCustomFieldValue,
  CustomFieldDefinition,
  CustomFieldValues,
} from '../../../types/customFields';
import { CustomFieldsService } from '../../../services/CustomFieldsService';
import { isValidDate, safeGetTime } from '../../../utils/dateUtils';
import { formatCost } from '../../../utils/formatting';
import { t } from '../../../lang/helpers';
import { normalizeTradeExecution } from '../../../services/trade/core/TradeExecutionNormalization';


import {
  calculatePnL,
  calculateActualCommission,
  calculateDirectionalPriceDiff,
} from '../../../utils/pnlCalculation';
import {
  calculateStopLossRiskAmount,
  canCalculateStopLossRiskAmount,
  resolveEffectiveRiskAmount,
} from '../../../utils/riskCalculation';

function addEntriesExitsError(errors: TradeFormErrors, message: string): void {
  errors.entriesExits = errors.entriesExits
    ? `${errors.entriesExits} ${message}`
    : message;
}
export {
  calculatePnL,
  calculateStopLossRiskAmount,
  canCalculateStopLossRiskAmount,
  resolveEffectiveRiskAmount,
};


export const validateTradeForm = (
  data: Partial<TradeFormData>
): TradeFormErrors => {
  const errors: TradeFormErrors = {};

  
  const isDirectPnLMode = data.useDirectPnLInput === true;

  
  const isMissedTrade = data.isMissedTrade === true;

  
  const isBacktestTrade = data.isBacktestTrade === true;

  const shouldValidateDividends = shouldShowTradeDividends(data);

  
  const isOpenTrade = isTradeOpenWithContext({
    tradeStatus: data.tradeStatus,
    exitTime: data.exitTime,
    pnl: null,
    useDirectPnLInput: data.useDirectPnLInput,
    exits: data.exits,
    entries: data.entries,
  });

  
  
  if (isMissedTrade && !isDirectPnLMode) {
    
    const hasValidExitPrice =
      data.exitPrice !== undefined &&
      data.exitPrice !== null &&
      data.exitPrice !== 0;
    const hasValidExits =
      data.exits &&
      data.exits.length > 0 &&
      data.exits.some(
        (exit) =>
          (exit.price !== undefined &&
            exit.price !== null &&
            exit.price !== 0) ||
          (exit.size !== undefined && exit.size !== null && exit.size !== 0)
      );

    
    if (!hasValidExitPrice && !hasValidExits) {
      errors.form = t('validation.missed-trade-requires-exit');
      return errors; 
    }
  }

  
  if (data.isBacktestTrade === true && isOpenTrade) {
    // intentional
    
    
  }

  
  if (!isDirectPnLMode && !isMissedTrade) {
    
    if (!data.entries || data.entries.length === 0) {
      errors.entriesExits = t('trade.validation.entry-required');
    } else {
      
      const entriesErrors: Array<{
        time?: string;
        price?: string;
        size?: string;
      }> = [];
      let hasEntryErrors = false;

      data.entries.forEach((entry, index) => {
        const entryErrors: { time?: string; price?: string; size?: string } =
          {};

        if (!entry.time) {
          entryErrors.time = t('trade.validation.entry-time-required');
          hasEntryErrors = true;
        }

        if (entry.price === undefined || entry.price === null) {
          entryErrors.price = t('trade.validation.entry-price-required');
          hasEntryErrors = true;
        }

        if (
          entry.size === undefined ||
          entry.size === null ||
          entry.size <= 0
        ) {
          entryErrors.size = t('trade.validation.entry-size-positive');
          hasEntryErrors = true;
        }

        entriesErrors[index] = entryErrors;
      });

      if (hasEntryErrors) {
        errors.entries = entriesErrors;
      }
    }
  }

  
  if (!isDirectPnLMode && !isMissedTrade) {
    
    if (!data.exits || data.exits.length === 0) {
      
      if (!isOpenTrade) {
        addEntriesExitsError(
          errors,
          t('trade.validation.exit-required-closed')
        );
      }
    } else {
      
      
      const meaningfulExits = data.exits.filter(
        (exit) =>
          (exit.price !== undefined &&
            exit.price !== null &&
            exit.price !== 0) ||
          (exit.size !== undefined && exit.size !== null && exit.size !== 0)
      );

      
      if (meaningfulExits.length === 0 && isOpenTrade) {
        // intentional
      } else {
        
        const exitsErrors: Array<{
          time?: string;
          price?: string;
          size?: string;
        }> = [];
        let hasExitErrors = false;

        data.exits.forEach((exit, index) => {
          
          
          
          const isEmptyPlaceholder =
            (exit.price === undefined ||
              exit.price === null ||
              exit.price === 0) &&
            (exit.size === undefined || exit.size === null || exit.size === 0);

          if (isEmptyPlaceholder && isOpenTrade) {
            exitsErrors[index] = {}; 
            return;
          }

          const exitErrors: { time?: string; price?: string; size?: string } =
            {};

          if (!exit.time) {
            exitErrors.time = t('trade.validation.exit-time-required');
            hasExitErrors = true;
          }

          if (exit.price === undefined || exit.price === null) {
            exitErrors.price = t('trade.validation.exit-price-required');
            hasExitErrors = true;
          }

          if (exit.size === undefined || exit.size === null || exit.size <= 0) {
            exitErrors.size = t('trade.validation.exit-size-positive');
            hasExitErrors = true;
          }

          exitsErrors[index] = exitErrors;
        });

        if (hasExitErrors) {
          errors.exits = exitsErrors;
        }
      }
    }
  }

  if (shouldValidateDividends && data.dividends && data.dividends.length > 0) {
    const dividendsErrors: Array<{ time?: string; amount?: string }> = [];
    let hasDividendErrors = false;

    data.dividends.forEach((dividend, index) => {
      const dividendErrors: { time?: string; amount?: string } = {};

      if (!isValidDate(dividend.time)) {
        dividendErrors.time = t('trade.validation.dividend-time-required');
        hasDividendErrors = true;
      }

      if (
        dividend.amount === undefined ||
        dividend.amount === null ||
        !Number.isFinite(dividend.amount) ||
        dividend.amount === 0
      ) {
        dividendErrors.amount = t('trade.validation.dividend-amount-nonzero');
        hasDividendErrors = true;
      }

      dividendsErrors[index] = dividendErrors;
    });

    if (hasDividendErrors) {
      errors.dividends = dividendsErrors;
    }
  }

  
  if (
    !isDirectPnLMode &&
    !isMissedTrade &&
    data.entries &&
    data.entries.length > 0 &&
    data.exits &&
    data.exits.length > 0
  ) {
    
    
    const completeExits = data.exits.filter(
      (exit) =>
        exit.price !== undefined &&
        exit.price !== null &&
        exit.price !== 0 &&
        exit.size !== undefined &&
        exit.size !== null &&
        exit.size !== 0
    );

    
    if (completeExits.length === 0 && isOpenTrade) {
      // intentional
    } else {
      
      
      const totalEntrySize = data.entries.reduce(
        (sum, entry) => sum + (entry.size || 0),
        0
      );

      const totalExitSize = completeExits.reduce(
        (sum, exit) => sum + (exit.size || 0),
        0
      );

      const sizeOverage = totalExitSize - totalEntrySize;
      const sizeComparisonTolerance = 1e-9;

      
      if (sizeOverage > sizeComparisonTolerance) {
        if (!errors.entriesExits) {
          errors.entriesExits = t('trade.validation.exit-size-exceeds-entry');
        } else {
          errors.entriesExits += ` ${t('trade.validation.exit-size-exceeds-entry')}`;
        }
      }

      
      const firstEntryTime =
        data.entries && data.entries.length > 0
          ? safeGetTime(data.entries[0].time)
          : null;
      if (
        firstEntryTime &&
        completeExits.some((exit) => {
          const exitTime = safeGetTime(exit.time);
          return exitTime && exitTime < firstEntryTime;
        })
      ) {
        if (!errors.entriesExits) {
          errors.entriesExits = t('trade.validation.exit-before-entry');
        } else {
          errors.entriesExits += ` ${t('trade.validation.exit-before-entry')}`;
        }
      }
    }
  }

  
  if (isDirectPnLMode && !isMissedTrade) {
    if (data.directPnL === undefined || data.directPnL === null) {
      errors.directPnL = t('trade.validation.direct-pnl-required');
    }
  }

  
  const hasValidEntries =
    data.entries &&
    data.entries.length > 0 &&
    data.entries.some(
      (entry) =>
        entry.time && entry.price !== undefined && entry.size !== undefined
    );

  if (!data.entryTime && (isDirectPnLMode || !hasValidEntries)) {
    errors.entryTime = t('trade.validation.entry-time-select');
  }

  
  if (!data.direction && data.assetType !== 'options') {
    errors.direction = t('trade.validation.direction-required');
  }

  if (!data.assetType) {
    errors.assetType = t('trade.validation.asset-type-required');
  }

  if (!data.instrument) {
    errors.instrument = t('trade.validation.ticker-required');
  } else {
    
    const tickerPattern = /^[A-Z0-9.]+$/i;
    if (!tickerPattern.test(data.instrument)) {
      errors.instrument = t('trade.validation.ticker-invalid');
    }
  }

  if (
    !isMissedTrade &&
    !isBacktestTrade &&
    (!data.account || data.account.length === 0)
  ) {
    errors.account = t('trade.validation.account-required');
  }

  
  
  
  
  
  
  
  
  const hasLegacyFields =
    (data.entryPrice !== undefined && data.entryPrice !== null) ||
    (data.exitPrice !== undefined && data.exitPrice !== null) ||
    (data.positionSize !== undefined && data.positionSize !== null);

  const hasStructuredTransactions =
    (Array.isArray(data.entries) && data.entries.length > 0) ||
    (Array.isArray(data.exits) && data.exits.length > 0);

  
  if (
    hasLegacyFields &&
    !hasStructuredTransactions &&
    !isDirectPnLMode &&
    !isMissedTrade
  ) {
    

    
    if (!isOpenTrade && !data.exitTime) {
      errors.exitTime = t('trade.validation.exit-time-select');
    }

    
    if (
      data.entryPrice === undefined ||
      data.entryPrice === null ||
      data.entryPrice <= 0
    ) {
      errors.entryPrice = t('trade.validation.entry-price-invalid');
    }

    
    if (
      !isOpenTrade &&
      (data.exitPrice === undefined ||
        data.exitPrice === null ||
        data.exitPrice <= 0)
    ) {
      errors.exitPrice = t('trade.validation.exit-price-invalid');
    }

    
    if (
      data.positionSize === undefined ||
      data.positionSize === null ||
      data.positionSize <= 0
    ) {
      errors.positionSize = t('trade.validation.position-size-invalid');
    }

    
    const entryTime = safeGetTime(data.entryTime);
    const exitTime = safeGetTime(data.exitTime);
    if (entryTime && exitTime && exitTime < entryTime) {
      errors.exitTime = t('trade.validation.exit-time-after-entry');
    }
  }

  
  if (data.assetType) {
    switch (data.assetType) {
      case 'stock':
        
        
        break;

      case 'options':
        
        if (!data.expirationDate) {
          errors.expirationDate = t(
            'trade.validation.expiration-date-required'
          );
        }

        if (!data.strikePrice) {
          errors.strikePrice = t('trade.validation.strike-price-required');
        }

        if (!data.optionType) {
          errors.optionType = t('trade.validation.option-type-required');
        }

        if (data.contractSize !== undefined && data.contractSize <= 0) {
          errors.contractSize = t('trade.validation.contract-size-positive');
        }
        break;

      case 'futures':
        
        if (data.dollarPerPoint === undefined || data.dollarPerPoint < 0.01) {
          errors.dollarPerPoint = t('trade.validation.dollars-per-point-min');
        }
        break;

      case 'forex':
        
        if (data.lotSize !== undefined && data.lotSize < 0) {
          errors.lotSize = t('trade.validation.lot-size-nonnegative');
        }
        break;

      case 'crypto':
        
        
        break;

      case 'cfd':
        
        if (data.contractSize !== undefined && data.contractSize <= 0) {
          errors.contractSize = t('trade.validation.contract-size-positive');
        }
        if (data.leverageRatio !== undefined && data.leverageRatio <= 0) {
          errors.leverageRatio = t('trade.validation.leverage-positive');
        }
        break;
    }
  }

  

  
  if (data.commissionType !== undefined && data.commissionType !== null) {
    if (
      data.commissionType !== 'fixed' &&
      data.commissionType !== 'percentage'
    ) {
      errors.commissionType = t('trade.validation.commission-type-invalid');
    }
  }

  
  if (data.commission !== undefined && data.commission !== null) {
    if (typeof data.commission !== 'number') {
      errors.commission = t('trade.validation.commission-number');
    } else {
      
      const commissionType = data.commissionType || 'fixed';

      if (commissionType === 'fixed') {
        // intentional
        
      } else if (commissionType === 'percentage') {
        
        if (data.commission < 0 || data.commission > 100) {
          errors.commission = t('trade.validation.commission-percentage-range');
        }
      }
    }
  }

  
  if (data.rebate !== undefined && data.rebate !== null) {
    
    if (data.assetType !== 'options') {
      errors.rebate = t('trade.validation.rebate-options-only');
    } else {
      
      if (typeof data.rebate !== 'number') {
        errors.rebate = t('trade.validation.rebate-number');
      } else if (data.rebate < 0) {
        errors.rebate = t('trade.validation.rebate-positive');
      }
    }
  }

  if (data.swap !== undefined && data.swap !== null) {
    if (typeof data.swap !== 'number') {
      errors.swap = t('trade.validation.swap-invalid');
    }
    
  }

  if (data.fees !== undefined && data.fees !== null) {
    if (typeof data.fees !== 'number') {
      errors.fees = t('trade.validation.fees-number');
    }
  }

  
  if (data.riskAmount !== undefined && data.riskAmount !== null) {
    if (typeof data.riskAmount !== 'number') {
      errors.riskAmount = t('trade.validation.risk-number');
    } else if (!Number.isFinite(data.riskAmount)) {
      errors.riskAmount = t('trade.validation.risk-valid-number');
    } else if (data.riskAmount <= 0) {
      errors.riskAmount = t('trade.validation.risk-positive');
    }
  }

  
  if (data.stopLoss !== undefined && data.stopLoss !== null) {
    if (typeof data.stopLoss !== 'number') {
      errors.stopLoss = t('trade.validation.stop-loss-number');
    } else if (!Number.isFinite(data.stopLoss)) {
      errors.stopLoss = t('trade.validation.stop-loss-valid-number');
    }
  }

  return errors;
};


export const validateCustomFields = (
  customFields: CustomFieldValues | undefined,
  fieldDefinitions: CustomFieldDefinition[],
  customFieldsService?: CustomFieldsService
): { [fieldId: string]: string } => {
  const customFieldErrors: { [fieldId: string]: string } = {};

  if (!customFields || !fieldDefinitions || fieldDefinitions.length === 0) {
    return customFieldErrors;
  }

  
  fieldDefinitions.forEach((definition) => {
    const value = customFields[definition.id];

    
    const savedOptions = customFieldsService
      ? customFieldsService.getFieldOptions(definition.id)
      : undefined;

    const error = validateCustomFieldValue(value, definition, savedOptions);
    if (error) {
      customFieldErrors[definition.id] = error;
    }
  });

  return customFieldErrors;
};


export const hasFormErrors = (errors: TradeFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};


const hasManualRiskBasis = (data: Partial<TradeFormData>): boolean => {
  return (
    typeof data.riskAmount === 'number' &&
    Number.isFinite(data.riskAmount) &&
    data.riskAmount > 0
  );
};

const hasAuthoritativeStopLossRiskBasis = (
  data: Partial<TradeFormData>
): boolean => {
  const stopLossRiskAmount = calculateStopLossRiskAmount(data);
  if (stopLossRiskAmount <= 0) {
    return false;
  }

  switch (data.assetType) {
    case 'options':
      return !!(data.contractSize && data.contractSize > 0);
    case 'futures':
      return !!(data.dollarPerPoint && data.dollarPerPoint > 0);
    case 'forex':
      return !!(
        (data.lotSize && data.lotSize > 0) ||
        (data.pipValue && data.pipValue > 0)
      );
    case 'cfd':
      return !!(data.contractSize && data.contractSize > 0);
    default:
      return true;
  }
};

const hasPersistableRiskBasis = (data: Partial<TradeFormData>): boolean => {
  return hasAuthoritativeStopLossRiskBasis(data) || hasManualRiskBasis(data);
};

export const calculateRMultiple = (data: Partial<TradeFormData>): number => {
  
  if (
    isTradeOpenWithContext({
      tradeStatus: data.tradeStatus,
      exitTime: data.exitTime,
      pnl: data._originalPnlWasNull ? null : data.pnl,
      useDirectPnLInput: data.useDirectPnLInput,
      exits: data.exits,
      entries: data.entries,
    })
  ) {
    return 0;
  }

  
  const pnl = calculatePnL(data);

  
  let riskAmount = calculateStopLossRiskAmount(data);

  
  if (
    riskAmount === 0 &&
    typeof data.riskAmount === 'number' &&
    Number.isFinite(data.riskAmount) &&
    data.riskAmount > 0
  ) {
    riskAmount = data.riskAmount;
  }

  
  if (riskAmount === 0) {
    return 0;
  }

  
  return pnl / riskAmount;
};

export const calculatePersistableRMultiple = (
  data: Partial<TradeFormData>
): number | undefined => {
  if (!hasPersistableRiskBasis(data)) {
    return undefined;
  }

  const pnl = calculatePnL(data);

  if (hasAuthoritativeStopLossRiskBasis(data)) {
    const stopLossRiskAmount = calculateStopLossRiskAmount(data);
    return stopLossRiskAmount > 0 ? pnl / stopLossRiskAmount : undefined;
  }

  return hasManualRiskBasis(data) && data.riskAmount
    ? pnl / data.riskAmount
    : undefined;
};


export const calculatePercentageReturn = (
  data: Partial<TradeFormData>
): number => {
  
  if (
    isTradeOpenWithContext({
      tradeStatus: data.tradeStatus,
      exitTime: data.exitTime,
      pnl: data.pnl,
      useDirectPnLInput: data.useDirectPnLInput,
      exits: data.exits,
      entries: data.entries,
    })
  ) {
    return 0;
  }

  
  if (data.useDirectPnLInput) {
    return 0; 
  }

  const normalizedExecution = normalizeTradeExecution(data, {
    deriveMissingExplicitness: false,
  });
  const entryPrice = normalizedExecution.weightedEntryPrice;
  const exitPrice = normalizedExecution.resolvedExitPrice;

  const priceDiff = calculateDirectionalPriceDiff(data, entryPrice, exitPrice);
  if (priceDiff === null || entryPrice === null) {
    return 0;
  }

  
  let percentReturn = (priceDiff / entryPrice) * 100;

  
  if (
    data.assetType === 'cfd' &&
    data.leverageRatio &&
    data.leverageRatio > 0
  ) {
    
    percentReturn = percentReturn * data.leverageRatio;
  }

  return percentReturn;
};


export const formatCostBreakdown = (
  data: Partial<TradeFormData>,
  displayRMultiples?: boolean,
  riskAmount?: number
): string => {
  const costs: string[] = [];

  if (data.commission && data.commission > 0) {
    const actualCommission = calculateActualCommission(data);
    const commissionType = data.commissionType || 'fixed';

    let formattedValue: string;
    if (displayRMultiples === true && riskAmount && riskAmount > 0) {
      const rValue = actualCommission / riskAmount;
      formattedValue = `${rValue.toFixed(2)}R`;
    } else {
      formattedValue = formatCost(actualCommission);
    }

    const displayText =
      commissionType === 'percentage'
        ? `Commission (${data.commission}%): ${formattedValue}`
        : `Commission: ${formattedValue}`;
    costs.push(displayText);
  }

  if (data.swap !== undefined && data.swap !== null && data.swap !== 0) {
    const swapLabel = data.swap > 0 ? 'Swap Cost' : 'Swap Credit';
    const absSwap = Math.abs(data.swap);

    let formattedValue: string;
    if (displayRMultiples === true && riskAmount && riskAmount > 0) {
      const rValue = absSwap / riskAmount;
      formattedValue = `${rValue.toFixed(2)}R`;
    } else {
      formattedValue = formatCost(absSwap);
    }

    costs.push(`${swapLabel}: ${formattedValue}`);
  }

  if (data.fees && data.fees > 0) {
    let formattedValue: string;
    if (displayRMultiples === true && riskAmount && riskAmount > 0) {
      const rValue = data.fees / riskAmount;
      formattedValue = `${rValue.toFixed(2)}R`;
    } else {
      formattedValue = formatCost(data.fees);
    }

    costs.push(`Fees: ${formattedValue}`);
  }

  
  const credits: string[] = [];
  if (data.rebate && data.rebate > 0) {
    let formattedValue: string;
    if (displayRMultiples === true && riskAmount && riskAmount > 0) {
      const rValue = data.rebate / riskAmount;
      formattedValue = `${rValue.toFixed(2)}R`;
    } else {
      formattedValue = formatCost(data.rebate);
    }
    credits.push(`Rebate: ${formattedValue}`);
  }

  const breakdown = costs.length > 0 ? costs.join(', ') : 'No costs';
  return credits.length > 0
    ? `${breakdown} | ${credits.join(', ')}`
    : breakdown;
};


export const calculateTotalCosts = (data: Partial<TradeFormData>): number => {
  const actualCommission = calculateActualCommission(data);
  const swap = data.swap || 0;
  const fees = data.fees || 0;

  return actualCommission + swap + fees;
};
