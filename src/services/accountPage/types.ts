

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
  authoritativePnl?: number | null;
  canonicalTradeId?: string;
  canonicalTradeVersion?: number;
  canonicalProjectionSchemaVersion?: number;
  commission: number;
  commissionType?: 'fixed' | 'percentage';
  swap: number;
  fees: number;
  rebate?: number;
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceCurrency?: string;
  breakEvenAccountCurrentBalanceTotal?: number;
  breakEvenAccountCurrentBalanceTotalCurrency?: string;
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
  
  fxRate?: number;
  
  fxRateBaseCurrency?: string;
  
  brokerBaseCurrencyPnl?: number;
  
  brokerBaseCurrency?: string;
  
  brokerBaseCurrencyPnlSource?: string;
  
  originalCurrency?: string;
  
  conversionPartialCurrencies?: string[];
  
  conversionUsedManualRate?: boolean;
  
  conversionUsedFetchedRates?: boolean;
  
  tradeStatus?: string;
  
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
  
  partiallyConvertedCurrencies?: string[];
  
  brokerBaseCurrencyTradeCount?: number;
  
  manualFxRateTradeCount?: number;
  
  originalTradeCount?: number;
  
  convertedTradeCount?: number;
}


export interface AccountPageData {
  account: AccountData;
  trades: AccountTradeData[];
  
  excludedTrades?: AccountTradeData[];
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
