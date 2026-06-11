

import { AccountData } from '../account/types';


export interface AccountTradeData {
  path: string;
  instrument: string;
  direction: string;
  entryPrice: number;
  exitPrice: number;
  
  hasExplicitExitPrice?: boolean;
  positionSize: number;
  pnl: number;
  commission: number;
  swap: number;
  fees: number;
  rebate?: number;
  entryTime: Date;
  exitTime: Date | null;
  setup: string[];
  mistake: string[];
  tags: string[];
  reviewed: boolean;
  assetType?: string;
  optionType?: string;
  rMultiple?: number;
  riskAmount?: number;
  stopLoss?: number;
  
  currency?: string;
  
  tradeStatus?: 'OPEN' | 'CLOSED' | string;
  
  useDirectPnLInput?: boolean;
  
  directPnL?: number;
  
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
  
  settlementTime?: Date | null;
  
  _originalPnlWasNull?: boolean;
  
  isCopiedTrade?: boolean;
  
  copiedFromAccount?: string;
  
  copyMultiplier?: number;
  
  copyAccountLookupKey?: string;
  
  copyPnlAdjustment?: number;
  
  copyBaseTradeKey?: string;
}


export interface AccountMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  avgWin: number;
  avgLoss: number;
  avgWinRMultiple?: number;
  avgLossRMultiple?: number;
  profitFactor: number;
  totalCommission: number;
  totalSwap: number;
  totalFees: number;
  
  pnlByCurrency?: Record<string, number>;
  
  isMultiCurrency?: boolean;
  
  primaryCurrency?: string;
  
  convertedTotalPnL?: number;
  
  conversionBaseCurrency?: string;
  
  conversionRateDate?: string;
  
  unconvertedCurrencies?: string[];
  
  originalTradeCount?: number;
  
  convertedTradeCount?: number;
}


export interface AccountPageData {
  account: AccountData;
  trades: AccountTradeData[];
  metrics: AccountMetrics;
}

export interface AccountCatalogEntry {
  id: string;
  name: string;
  accountType?: string;
  archived: boolean;
  currency?: string;
}


export interface AccountTradeFilter {
  dateRange?: [Date | null, Date | null];
  instruments?: string[];
  setups?: string[];
  directions?: string[];
  reviewed?: boolean;
}

export {};
