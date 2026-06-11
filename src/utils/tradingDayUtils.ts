

import { type WeekStartDaySetting } from './dateUtils';
import { getPluginInstance } from './pluginContext';


type PluginWithTradeSettings = {
  settings?: {
    trade?: {
      tradingDayCutoffTime?: string;
      weekStartDay?: WeekStartDaySetting;
    };
  };
} | null;

export const DEFAULT_TRADING_DAY_CUTOFF_TIME = '23:59';
export const TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION =
  '2026-05-end-of-day-cutoff-v1';


function getTradingDayCutoffTime(plugin?: PluginWithTradeSettings): string {
  try {
    const resolvedPlugin = plugin ?? getPluginInstance();
    if (resolvedPlugin?.settings?.trade?.tradingDayCutoffTime) {
      return resolvedPlugin.settings.trade.tradingDayCutoffTime;
    }

    
    return DEFAULT_TRADING_DAY_CUTOFF_TIME;
  } catch (error) {
    console.warn(
      `Error getting trading day cutoff time, using default (${DEFAULT_TRADING_DAY_CUTOFF_TIME})`,
      error
    );
    return DEFAULT_TRADING_DAY_CUTOFF_TIME;
  }
}


function parseCutoffTime(cutoffTime: string): {
  hours: number;
  minutes: number;
} {
  try {
    const [hoursStr, minutesStr] = cutoffTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      console.warn(
        `Invalid cutoff time format: ${cutoffTime}, using ${DEFAULT_TRADING_DAY_CUTOFF_TIME}`
      );
      return { hours: 23, minutes: 59 };
    }

    return { hours, minutes };
  } catch (error) {
    console.warn(
      `Error parsing cutoff time: ${cutoffTime}, using ${DEFAULT_TRADING_DAY_CUTOFF_TIME}`,
      error
    );
    return { hours: 23, minutes: 59 };
  }
}


export function getTradingDay(
  date: Date,
  plugin?: PluginWithTradeSettings
): Date {
  
  const cutoffTime = getTradingDayCutoffTime(plugin);
  const { hours, minutes } = parseCutoffTime(cutoffTime);

  
  const result = new Date(date);

  
  
  
  if (
    result.getHours() > hours ||
    (result.getHours() === hours && result.getMinutes() > minutes)
  ) {
    result.setDate(result.getDate() + 1);
  }

  
  result.setHours(0, 0, 0, 0);

  return result;
}


export function isSameTradingDay(
  date1: Date,
  date2: Date,
  plugin?: PluginWithTradeSettings
): boolean {
  const tradingDay1 = getTradingDay(date1, plugin);
  const tradingDay2 = getTradingDay(date2, plugin);

  return (
    tradingDay1.getFullYear() === tradingDay2.getFullYear() &&
    tradingDay1.getMonth() === tradingDay2.getMonth() &&
    tradingDay1.getDate() === tradingDay2.getDate()
  );
}


export function getTradingDayRange(
  date: Date,
  plugin?: PluginWithTradeSettings
): { start: Date; end: Date } {
  const cutoffTime = getTradingDayCutoffTime(plugin);
  const { hours, minutes } = parseCutoffTime(cutoffTime);

  
  const tradingDay = getTradingDay(date, plugin);

  
  const end = new Date(tradingDay);
  end.setHours(hours, minutes, 59, 999);

  
  const start = new Date(end);
  start.setDate(start.getDate() - 1);
  start.setMilliseconds(start.getMilliseconds() + 1);

  return { start, end };
}


export function getTradingDayString(
  date: Date,
  plugin?: PluginWithTradeSettings
): string {
  const tradingDay = getTradingDay(date, plugin);
  const year = tradingDay.getFullYear();
  const month = String(tradingDay.getMonth() + 1).padStart(2, '0');
  const day = String(tradingDay.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


export function createTradingDayFromString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}
