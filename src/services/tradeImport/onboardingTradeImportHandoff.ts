let pendingBrokerId: string | undefined;

export function setOnboardingTradeImportBroker(
  brokerId: string | undefined
): void {
  pendingBrokerId = brokerId;
}

export function consumeOnboardingTradeImportBroker(): string | undefined {
  const brokerId = pendingBrokerId;
  pendingBrokerId = undefined;
  return brokerId;
}
