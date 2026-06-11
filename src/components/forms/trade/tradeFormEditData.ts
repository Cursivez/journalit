type TradeFormEditHydrationData = {
  currency?: unknown;
  mtComment?: unknown;
};

export function mergeFreshTradeFormEditData<T extends Record<string, unknown>>(
  normalizedTradeData: T | null | undefined,
  freshTradeData: TradeFormEditHydrationData | null | undefined
): Record<string, unknown> {
  const initialData = normalizedTradeData ?? {};

  if (!freshTradeData) {
    return initialData;
  }

  return {
    ...initialData,
    currency: freshTradeData.currency,
    mtComment: freshTradeData.mtComment,
  };
}
