import { t } from '../../lang/helpers';
import { getDateFormatOptions } from '../../services/csv/types';
import { getLocalIanaTimeZone } from '../../utils/timeZone';


export function isHyperliquidTradeHistory(broker: string): boolean {
  return broker === 'HYPERLIQUID';
}

export function resolveHyperliquidExportTimeZone(
  broker: string,
  backendSupportsExportTimeZone: boolean
): {
  timeZone?: string;
  errorKey?:
    | 'trade-import.hyperliquid.backend-update-required'
    | 'trade-import.hyperliquid.invalid-time-zone';
} {
  if (!isHyperliquidTradeHistory(broker)) return {};
  if (!backendSupportsExportTimeZone) {
    return { errorKey: 'trade-import.hyperliquid.backend-update-required' };
  }
  const timeZone = getLocalIanaTimeZone();
  return timeZone
    ? { timeZone }
    : { errorKey: 'trade-import.hyperliquid.invalid-time-zone' };
}

export function dateFormatForBroker(broker: string, format: string): string {
  return isHyperliquidTradeHistory(broker) &&
    !isDateFormatAllowedForBroker(broker, format)
    ? ''
    : format;
}

export function isDateFormatAllowedForBroker(
  broker: string,
  format: string
): boolean {
  const options = isHyperliquidTradeHistory(broker)
    ? hyperliquidDateFormatOptions()
    : getDateFormatOptions();
  return options.some((option) => option.value === format);
}


export function dateFormatOnBrokerSelection(
  broker: string,
  format: string
): string {
  return isDateFormatAllowedForBroker(broker, format) ? format : '';
}


export function hyperliquidDateFormatOptions(): Array<{
  value: string;
  label: string;
}> {
  return [
    { value: '', label: t('trade-import.placeholder.auto') },
    {
      value: 'M/d/yyyy HH:mm:ss',
      label: t('trade-import.hyperliquid.date-us'),
    },
    {
      
      
      value: 'dd/MM/yyyy HH:mm:ss',
      label: t('trade-import.hyperliquid.date-day-first'),
    },
    {
      value: 'dd.MM.yyyy HH:mm:ss',
      label: t('trade-import.hyperliquid.date-german'),
    },
  ];
}
