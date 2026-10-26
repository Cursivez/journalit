
import type JournalitPlugin from '../../../../main';
import { CurrencyCode } from '../../../../utils/currencyConfig';
import { getSingleExplicitCurrency } from '../../../../utils/currencyAggregation';

export function readReviewTradeSettings(plugin: JournalitPlugin) {
  const trade = plugin?.settings?.trade;
  return {
    defaultRiskAmount: trade?.defaultRiskAmount,
    dateFormat: trade?.dateFormat || 'DDMMYY',
    breakEvenThresholdMode: trade?.breakEvenThresholdMode,
    breakEvenThresholdPercent: trade?.breakEvenThresholdPercent,
    breakEvenRangeMin: trade?.breakEvenRangeMin,
    breakEvenRangeMax: trade?.breakEvenRangeMax,
  };
}

export function settingsCurrency(plugin: JournalitPlugin): string {
  return plugin?.settings?.general?.currency || CurrencyCode.USD;
}


export function resolveReviewCurrency(
  trades: Parameters<typeof getSingleExplicitCurrency>[0],
  plugin: JournalitPlugin
): string {
  return getSingleExplicitCurrency(trades) || settingsCurrency(plugin);
}
