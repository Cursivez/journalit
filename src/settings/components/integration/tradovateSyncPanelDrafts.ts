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

export function tradovateAccountDraftKey(
  connectionId: string,
  connectionAccountId: string
): string {
  return JSON.stringify([connectionId, connectionAccountId]);
}
