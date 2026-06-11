

import { TradeFormData } from '../forms/trade/types';


export interface MissedTradeFormData extends TradeFormData {
  
  isMissedTrade: true;
  
  missedReason?: string;
}


export interface MissedTradeNoteData {
  

  [key: string]: any;
  
  isMissedTrade: true;
  
  missedReason?: string;
  
  filePath?: string;
  
  reviewed?: boolean;
  
  reviewedAt?: string;
}

export {};
