

import { TradeFormData } from '../components/forms/trade/types';
import { LossReviewData } from '../services/backend/types';


export interface TradeFrontmatter extends TradeFormData {
  
  tradeStatus?: string;

  
  _originalPnlWasNull?: boolean;

  
  hasExplicitExitPrice?: boolean;

  
  notes?: string;

  
  mtComment?: string;
}


export type PartialTradeFrontmatter = Partial<TradeFrontmatter> & {
  pnl?: number;
  filePath?: string;
  lossReview?: LossReviewData;
  templateId?: string;
};
