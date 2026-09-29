type TradeOperationKind = 'import' | 'sync';

export type TradeOperationSource =
  | 'full-import'
  | 'quick-import'
  | 'manual-sync'
  | 'automatic-sync'
  | 'broker-panel'
  | 'projection-restore';

type TradeOperationChange = 'created' | 'updated';

export interface TradeOperationTrade {
  filePath: string;
  entryTime: string;
  accountName: string;
  change: TradeOperationChange;
}

export interface TradeOperationCounts {
  created: number;
  updated: number;
  duplicates: number;
  failed: number;
  pending: number;
  ackFailed: number;
}

export interface TradeOperationResult {
  id: string;
  kind: TradeOperationKind;
  source: TradeOperationSource;
  completedAt: number;
  ownerUserId: string;
  counts: TradeOperationCounts;
  trades: TradeOperationTrade[];
  accountNames: string[];
  brokerLabels: string[];
  partial: boolean;
}

export interface TradeOperationScope {
  operationId: string;
  ownerUserId: string;
  filePaths: string[];
  accountNames: string[];
}

export interface TradeOperationSnapshot {
  recentResult: TradeOperationResult | null;
  activeTradeLogScope: TradeOperationScope | null;
}
