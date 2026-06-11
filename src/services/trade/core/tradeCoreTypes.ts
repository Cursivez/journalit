export type TradeId = string;

export type TradeCommitAction = 'created' | 'updated' | 'deleted' | 'relocated';

export interface TradeRef {
  tradeId: TradeId;
  path: string;
  aliases: string[];
}

export interface TradeCommitReceipt {
  tradeId: TradeId;
  path: string;
  previousPath?: string;
  revision: number;
  schemaVersion: number;
  committedAt: number;
}

export interface TradeChange {
  action: TradeCommitAction;
  tradeId: TradeId;
  path: string;
  previousPath?: string;
  source?: string;
}

export interface TradeCommittedPayload {
  change: TradeChange;
  receipt: TradeCommitReceipt;
  legacyTradeChangedExpected?: boolean;
}

export interface TradeIdentitySnapshot {
  tradeId?: string;
  schemaVersion?: number;
  tradeRevision?: number;
}
