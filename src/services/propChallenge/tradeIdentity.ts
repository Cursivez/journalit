


export function getTradeBrokerIdentity(trade: {
  accountId?: unknown;
  canonicalAccountId?: unknown;
  canonicalAccountIdentity?: unknown;
  isCopiedTrade?: unknown;
}): string | undefined {
  if (trade.isCopiedTrade === true) return undefined;
  if (
    trade.canonicalAccountIdentity === 'broker' &&
    typeof trade.canonicalAccountId === 'string'
  ) {
    const canonicalAccountId = trade.canonicalAccountId.trim();
    if (canonicalAccountId.length > 0) return canonicalAccountId;
  }
  if (typeof trade.accountId === 'string') {
    const accountId = trade.accountId.trim();
    if (accountId.length > 0) return accountId;
  }
  if (typeof trade.accountId === 'number' && Number.isFinite(trade.accountId)) {
    return String(trade.accountId);
  }
  return undefined;
}
