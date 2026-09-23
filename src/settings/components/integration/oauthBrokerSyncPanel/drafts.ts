

export type HistoryChoice =
  | 'all_available'
  | 'recent_90_days'
  | 'custom_date'
  | 'new_trades_only';

export interface AccountDraft {
  syncEnabled: boolean;
  historyChoice: HistoryChoice;
  historyFrom: string;
  localAccountId: string;
}

export type AccountDrafts = Record<string, AccountDraft>;

interface OAuthBrokerHistoryAccount {
  id: string;
  historyMode: 'all_available' | 'from_date' | 'from_connection';
  historyFrom?: string;
}

export interface OAuthBrokerAccountSelection {
  accountId: string;
  syncEnabled: boolean;
  historyMode: 'all_available' | 'from_date' | 'from_connection';
  historyFrom: string | null;
}

export function oauthBrokerAccountDraftKey(
  connectionId: string,
  connectionAccountId: string
): string {
  return JSON.stringify([connectionId, connectionAccountId]);
}

export function oauthBrokerHistoryChoice(
  account: OAuthBrokerHistoryAccount
): HistoryChoice {
  if (account.historyMode === 'from_connection') return 'new_trades_only';
  if (account.historyMode === 'from_date') return 'custom_date';
  return 'all_available';
}

function recentHistoryFrom(): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 90);
  return `${date.toISOString().slice(0, 10)}T00:00:00.000Z`;
}

export function oauthBrokerAccountSelection(
  account: OAuthBrokerHistoryAccount,
  draft: AccountDraft
): OAuthBrokerAccountSelection | null {
  if (!draft.syncEnabled) {
    return {
      accountId: account.id,
      syncEnabled: false,
      historyMode: account.historyMode,
      historyFrom: account.historyFrom ?? null,
    };
  }
  if (draft.historyChoice === 'custom_date' && !draft.historyFrom) return null;
  if (draft.historyChoice === 'all_available') {
    return {
      accountId: account.id,
      syncEnabled: true,
      historyMode: 'all_available',
      historyFrom: null,
    };
  }
  if (draft.historyChoice === 'new_trades_only') {
    return {
      accountId: account.id,
      syncEnabled: true,
      historyMode: 'from_connection',
      historyFrom: null,
    };
  }
  return {
    accountId: account.id,
    syncEnabled: true,
    historyMode: 'from_date',
    historyFrom:
      draft.historyChoice === 'recent_90_days'
        ? recentHistoryFrom()
        : `${draft.historyFrom}T00:00:00.000Z`,
  };
}
