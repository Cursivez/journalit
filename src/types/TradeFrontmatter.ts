

import { TradeFormData } from '../components/forms/trade/types';
import { LossReviewData, TradeReviewData } from '../services/backend/types';


export interface TradeFrontmatter extends TradeFormData {
  
  tradeStatus?: string;

  
  _originalPnlWasNull?: boolean;

  
  hasExplicitExitPrice?: boolean;

  
  notes?: string;

  
  mtComment?: string;
  lastBrokerSyncAt?: string;

  canonicalTradeId?: string;
  canonicalTradeVersion?: number;
  canonicalProjectionGeneration?: string;
  canonicalAccountId?: string;
  canonicalBroker?: string;
  canonicalAccountDisplayName?: string;
  canonicalProjectionSchemaVersion?: number;
}


export type PartialTradeFrontmatter = Partial<TradeFrontmatter> & {
  pnl?: number;
  filePath?: string;
  lossReview?: LossReviewData;
  tradeReview?: TradeReviewData;
  templateId?: string;
};
