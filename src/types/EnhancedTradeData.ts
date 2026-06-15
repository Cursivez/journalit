

import { AccountTradeData } from '../services/accountPage/types';
import type { TradeAccountRef } from '../services/trade/core/TradeAccountIdentity';
import type { TradeId } from '../utils/tradeIdentity';


export interface EnhancedTradeData extends AccountTradeData {
  
  tradeStatus?: string;

  
  useDirectPnLInput?: boolean;

  
  entries?: Array<{
    time: Date | null;
    price: number;
    size: number;
    notional?: number;
  }>;

  
  exits?: Array<{
    time: Date | null;
    price: number;
    size: number;
    
    hasExplicitPrice?: boolean;
    notional?: number;
  }>;

  
  dividends?: Array<{
    time: Date | null;
    amount: number;
  }>;

  
  _originalPnlWasNull?: boolean;

  
  tradeId?: TradeId;

  
  schemaVersion?: number;

  
  backendTradeId?: number;

  
  accountId?: string;

  
  accountRefs?: TradeAccountRef[];

  
  isMissedTrade?: boolean;

  
  isBacktestTrade?: boolean;
}
