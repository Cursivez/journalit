type TradeFormEditHydrationData = Record<string, unknown>;

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
    ...freshTradeData,
  };
}
