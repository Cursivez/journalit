type TradeWithAccount = {
  account?: string | string[];
};

export const UNKNOWN_ACCOUNT_LABEL = 'Unknown Account';

export function getTradeAccountNames(trade: TradeWithAccount): string[] {
  if (Array.isArray(trade.account)) {
    return trade.account
      .map((account) => account.trim())
      .filter((account) => account.length > 0);
  }

  if (typeof trade.account === 'string') {
    const account = trade.account.trim();
    return account ? [account] : [];
  }

  return [];
}

export function getDistinctAccountNames(trades: TradeWithAccount[]): string[] {
  return Array.from(
    new Set(trades.flatMap((trade) => getTradeAccountNames(trade)))
  ).sort((a, b) => a.localeCompare(b));
}
