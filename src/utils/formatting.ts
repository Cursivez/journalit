

import {
  CurrencyCode,
  CurrencyConfig,
  getCurrencyConfig,
} from './currencyConfig';

function affixCurrency(
  formattedNumber: string,
  currencyConfig: CurrencyConfig
): string {
  const spacing = currencyConfig.spacing ?? '';

  return currencyConfig.symbolBefore
    ? `${currencyConfig.symbol}${spacing}${formattedNumber}`
    : `${formattedNumber}${spacing}${currencyConfig.symbol}`;
}


export function formatCost(
  value: number | undefined | null,
  currencyCode: string = CurrencyCode.USD
): string {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';

  const currencyConfig = getCurrencyConfig(currencyCode);
  const absValue = Math.abs(value);

  if (value === 0) {
    return affixCurrency('0', currencyConfig);
  }

  const maxDecimals = currencyConfig.decimalPlaces;

  
  if (absValue === Math.floor(absValue) || maxDecimals === 0) {
    const formatted = Math.floor(absValue).toLocaleString(
      currencyConfig.locale
    );
    return affixCurrency(formatted, currencyConfig);
  }

  
  const formatted = absValue.toLocaleString(currencyConfig.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });

  return affixCurrency(formatted, currencyConfig);
}


export function formatCurrency(
  value: number | undefined | null,
  showPlusSign: boolean = false,
  currencyCode: string = CurrencyCode.USD
): string {
  if (value === undefined || value === null || isNaN(value)) return 'N/A';

  const currencyConfig = getCurrencyConfig(currencyCode);

  
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const sign = showPlusSign && value > 0 ? '+' : '';

  
  let minimumFractionDigits = currencyConfig.decimalPlaces;
  let maximumFractionDigits = currencyConfig.decimalPlaces;

  
  if (currencyConfig.decimalPlaces > 0) {
    
    if (absValue === 0) {
      minimumFractionDigits = 0;
      maximumFractionDigits = 0;
    }
    
    else if (absValue < 10) {
      minimumFractionDigits = 4;
      maximumFractionDigits = 5;
    } else if (absValue < 100) {
      minimumFractionDigits = 3;
      maximumFractionDigits = 4;
    } else if (absValue >= 100) {
      
      if (absValue === Math.floor(absValue)) {
        minimumFractionDigits = 0;
        maximumFractionDigits = 0;
      } else {
        minimumFractionDigits = currencyConfig.decimalPlaces;
        maximumFractionDigits = currencyConfig.decimalPlaces;
      }
    }
  }

  const formatted = absValue.toLocaleString(currencyConfig.locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const withCurrency = affixCurrency(formatted, currencyConfig);

  if (isNegative) {
    return `-${withCurrency}`;
  }

  return sign + withCurrency;
}


export function calculateEffectiveRMultiple(
  pnl: number | undefined,
  tradeRMultiple: number | undefined,
  tradeRiskAmount: number | undefined,
  defaultRiskAmount: number | undefined
): number | undefined {
  const hasSentinelZeroRMultiple =
    tradeRMultiple === 0 && pnl !== undefined && pnl !== 0;

  
  
  if (
    tradeRMultiple !== undefined &&
    !isNaN(tradeRMultiple) &&
    !hasSentinelZeroRMultiple
  ) {
    return tradeRMultiple;
  }

  
  const effectiveRiskAmount = tradeRiskAmount ?? defaultRiskAmount;

  if (
    pnl !== undefined &&
    effectiveRiskAmount !== undefined &&
    effectiveRiskAmount > 0
  ) {
    return pnl / effectiveRiskAmount;
  }

  return undefined;
}


export function formatPnL(
  value: number | undefined,
  showCents: boolean = true,
  currencyCode: string = CurrencyCode.USD,
  displayAsRMultiple?: boolean,
  rMultiple?: number
): string {
  if (value === undefined || isNaN(value)) return 'N/A';

  
  if (displayAsRMultiple === true) {
    if (rMultiple === undefined || isNaN(rMultiple)) return 'N/A';

    
    const sign = rMultiple >= 0 ? '+' : '';
    const formatted = rMultiple.toFixed(1);
    return `${sign}${formatted}R`;
  }

  const currencyConfig = getCurrencyConfig(currencyCode);
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  
  if (absValue >= 1000000) {
    const valueInM = absValue / 1000000;

    let result;
    if (!showCents || currencyConfig.decimalPlaces === 0) {
      
      result = Math.round(valueInM) + 'M';
    } else {
      
      const maxDecimals = Math.min(currencyConfig.decimalPlaces, 2);
      const formatted = valueInM.toFixed(maxDecimals);

      
      if (formatted.endsWith('.00')) {
        result = formatted.slice(0, -3) + 'M';
      } else if (formatted.endsWith('0') && maxDecimals > 1) {
        result = formatted.slice(0, -1) + 'M';
      } else {
        result = formatted + 'M';
      }
    }

    const withCurrency = affixCurrency(result, currencyConfig);
    return isNegative ? `-${withCurrency}` : withCurrency;
  }

  
  if (absValue >= 100000) {
    const valueInK = absValue / 1000;

    let result;
    if (!showCents || currencyConfig.decimalPlaces === 0) {
      
      result = Math.round(valueInK) + 'K';
    } else {
      
      const maxDecimals = Math.min(currencyConfig.decimalPlaces, 2);
      const formatted = valueInK.toFixed(maxDecimals);

      
      if (formatted.endsWith('.00')) {
        result = formatted.slice(0, -3) + 'K';
      } else if (formatted.endsWith('0') && maxDecimals > 1) {
        result = formatted.slice(0, -1) + 'K';
      } else {
        result = formatted + 'K';
      }
    }

    const withCurrency = affixCurrency(result, currencyConfig);
    return isNegative ? `-${withCurrency}` : withCurrency;
  }

  
  
  const hasDecimalPlaces = absValue !== Math.floor(absValue);

  let formattedNumber;

  if (!showCents || currencyConfig.decimalPlaces === 0) {
    
    formattedNumber = Math.round(absValue).toLocaleString(
      currencyConfig.locale
    );
  } else if (hasDecimalPlaces) {
    
    
    formattedNumber = absValue.toLocaleString(currencyConfig.locale, {
      minimumFractionDigits: currencyConfig.decimalPlaces,
      maximumFractionDigits: currencyConfig.decimalPlaces,
    });
  } else {
    
    formattedNumber = Math.floor(absValue).toLocaleString(
      currencyConfig.locale
    );
  }

  
  const withCurrency = affixCurrency(formattedNumber, currencyConfig);
  return isNegative ? `-${withCurrency}` : withCurrency;
}


export function formatDuration(
  milliseconds: number | null | undefined
): string {
  if (
    milliseconds === undefined ||
    milliseconds === null ||
    !Number.isFinite(milliseconds) ||
    milliseconds < 0
  ) {
    return 'N/A';
  }
  if (milliseconds === 0) return '<1s';

  
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = MS_PER_SECOND * 60;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;
  const MS_PER_MONTH = MS_PER_DAY * 30; 
  const MS_PER_YEAR = MS_PER_DAY * 365; 

  
  const years = Math.floor(milliseconds / MS_PER_YEAR);
  const monthsRemainder = milliseconds % MS_PER_YEAR;
  const months = Math.floor(monthsRemainder / MS_PER_MONTH);

  const daysRemainder = monthsRemainder % MS_PER_MONTH;
  const days = Math.floor(daysRemainder / MS_PER_DAY);

  const hoursRemainder = daysRemainder % MS_PER_DAY;
  const hours = Math.floor(hoursRemainder / MS_PER_HOUR);

  const minutesRemainder = hoursRemainder % MS_PER_HOUR;
  const minutes = Math.floor(minutesRemainder / MS_PER_MINUTE);

  const secondsRemainder = minutesRemainder % MS_PER_MINUTE;
  const seconds = Math.floor(secondsRemainder / MS_PER_SECOND);

  
  const units: Array<{ value: number; label: string }> = [];

  if (years > 0) units.push({ value: years, label: 'y' });
  if (months > 0) units.push({ value: months, label: 'mo' });
  if (days > 0) units.push({ value: days, label: 'd' });
  if (hours > 0) units.push({ value: hours, label: 'h' });
  if (minutes > 0) units.push({ value: minutes, label: 'm' });
  if (seconds > 0) units.push({ value: seconds, label: 's' });

  
  if (units.length === 0) {
    return '<1s';
  }

  
  const significantUnits = units.slice(0, 2);

  return significantUnits.map((u) => `${u.value}${u.label}`).join(' ');
}
