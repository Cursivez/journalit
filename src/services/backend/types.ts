

import { FTPCredentials } from '../../settings/types';

export type {
  SyncResponse,
  SyncStatus,
  VaultRegistrationData,
  Trade,
  TradesResponse,
} from './ApiClient';

export interface TradeSyncMapping {
  [tradeId: number]: string; 
}

export interface LossReviewData {
  sections: {
    [sectionId: string]: {
      checkboxes?: { [key: string]: boolean };
      textAreas?: { [key: string]: string };
    };
  };
  reviewed: boolean;
  reviewedAt?: string;
}

export interface TradeMetadata {
  type: string;
  tradeId?: string;
  schemaVersion?: number;
  tradeStatus?: 'OPEN' | 'CLOSED' | string;
  backendTradeId?: number;
  csvImportId?: string;
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
  setupIds?: string[];
  setup?: string[];
  mistake?: string[];
  images?: string[];
  tags?: string[];
  lotSize?: number;
  pipValue?: number;
  lossReview?: LossReviewData;
}

export type { FTPCredentials };
