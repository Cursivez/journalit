

import { TradeFormData } from '../forms/trade/types';


export interface MissedTradeFormData extends TradeFormData {
  
  isMissedTrade: true;
  
  missedReason?: string;
}

export {};
