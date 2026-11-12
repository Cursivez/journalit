import type { JournalitSettings } from '../../../settings/types';

type TradeSettings = JournalitSettings['trade'];


export interface TradeFormEntryPreferences {
  useDollarValueInput: boolean;
  maeMfeInputMode: NonNullable<TradeSettings['maeMfeInputMode']>;
  showSeconds: boolean;
}


export function readTradeFormEntryPreferences(
  trade: Pick<
    TradeSettings,
    'useDollarValueInput' | 'maeMfeInputMode' | 'showSeconds'
  >
): TradeFormEntryPreferences {
  return {
    useDollarValueInput: trade.useDollarValueInput ?? false,
    maeMfeInputMode: trade.maeMfeInputMode ?? 'dollar',
    showSeconds: trade.showSeconds ?? false,
  };
}
