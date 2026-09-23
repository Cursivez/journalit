

import {
  FTPCredentials,
  FTPProvisionedCredentials,
} from '../../settings/types';
import type { TradeProjectionPersistedTradeSummary } from '../tradeSync/types';
import type { SyncResponse } from './ApiClient';

export type {
  SyncResponse,
  SyncStatus,
  VaultRegistrationData,
  Trade,
  TradesResponse,
} from './ApiClient';

export const METATRADER_SYNC_NOT_ENTITLED_STATUS = 'not-entitled';
export const METATRADER_SYNC_ENTITLEMENT_UNVERIFIED_STATUS =
  'entitlement-unverified';

export interface MetaTraderSyncResult {
  ownerUserId: string;
  response: SyncResponse;
  importedTrades: TradeProjectionPersistedTradeSummary[];
  failedTradeWriteCount: number;
}

export interface TradeSyncMapping {
  [tradeId: number]: string; 
}

export interface LossReviewData {
  sections: {
    [sectionId: string]: {
      checkboxes?: { [key: string]: boolean };
      textAreas?: { [key: string]: string };
      
      label?: string;
      
      choiceOptionId?: string;
    };
  };
  reviewed: boolean;
  reviewedAt?: string;
}

export interface TradeReviewData {
  sections: LossReviewData['sections'];
}

export interface TradeMetadata {
  type: string;
  tradeId?: string;
  schemaVersion?: number;
  tradeStatus?: string;
  backendTradeId?: number;
  executionLedgerVersion?: number;
  executionIds?: string[];
  entryTime: string;
  entryPrice: string;
  exitTime?: string;
  exitPrice?: string;
  positionSize: string;
  direction: string;
  instrument: string;
  assetType: string;
  pnl?: string | number;
  account?: string | string[];
  entries?: Array<{ time: string; price: number; size: number }>;
  exits?: Array<{ time: string; price: number; size: number }>;
  dividends?: Array<{ time: string; amount: number }>;
  commission?: number;
  commissionType?: 'fixed' | 'percentage';
  fees?: number;
  mtComment?: string;
  useDirectPnLInput?: boolean | string;
  directPnL?: number | string;

  setup?: string[];
  mistake?: string[];
  images?: string[];
  tags?: string[];
  lotSize?: number;
  pipValue?: number;
  lossReview?: LossReviewData;
  tradeReview?: TradeReviewData;
}

export type { FTPCredentials, FTPProvisionedCredentials };
