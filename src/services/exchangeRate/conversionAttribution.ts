interface ConversionAttributionTrade {
  conversionUsedFetchedRates?: boolean;
}

export function resolveScopedConversionRateDate(
  trades: ConversionAttributionTrade[],
  unscopedRateDate: string,
  manualFxRateTradeCount: number
): string {
  if (trades.some((trade) => trade.conversionUsedFetchedRates === true)) {
    return unscopedRateDate;
  }

  return manualFxRateTradeCount > 0 ? 'manual' : 'broker';
}
