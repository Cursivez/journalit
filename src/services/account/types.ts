

import { CurrencyCode } from '../../utils/currencyConfig';
import type { CopyTradingPeriod } from '../../settings/types';


export enum AccountType {
  DEMO = 'demo',
  EVALUATION = 'evaluation',
  FUNDED = 'funded',
  
}


export enum DrawdownType {
  NONE = 'none',
  FIXED = 'fixed',
  EOD_TRAILING = 'eod_trailing',
  MANUAL = 'manual',
}


export interface ManualDrawdownSnapshot {
  date: Date; 
  drawdownLimit: number; 
  note?: string; 
}


export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRADE = 'trade',
  COST = 'cost',
}


export enum ProfitTargetType {
  ABSOLUTE = 'absolute',
  PERCENTAGE = 'percentage',
}


export interface AccountTransaction {
  id: string; 
  date: Date; 
  type: TransactionType; 
  amount: number; 
  description?: string; 
  tradeId?: string; 
  balanceAfter: number; 
}


export interface DailyBalanceRecord {
  date: Date; 
  balance: number; 
  drawdownLevel: number; 
}


export interface AccountMetrics {
  totalTrades: number; 
  winningTrades: number; 
  losingTrades: number; 
  breakEvenTrades: number; 
  winRate: number; 
  totalPnL: number; 
  bestTrade: number; 
  worstTrade: number; 
  profitFactor: number; 
  averageWin: number; 
  averageLoss: number; 
  avgWinRMultiple?: number; 
  avgLossRMultiple?: number; 
  maxDrawdown: number; 
  totalWithdrawals: number; 
  
  isMultiCurrency?: boolean; 
  conversionBaseCurrency?: string; 
}


export interface AccountData {
  id: string; 
  name: string; 
  accountName?: string; 
  accountId?: string; 
  accountType: AccountType | string; 
  initialBalance: number; 
  currentBalance: number; 

  
  drawdownType: DrawdownType; 
  drawdownAmount: number; 
  maxDrawdownReached: number; 
  currentDrawdownSnapshot?: ManualDrawdownSnapshot; 
  allDrawdownSnapshots?: ManualDrawdownSnapshot[]; 

  
  hasProfitTarget: boolean; 
  profitTarget: number; 
  profitTargetType: ProfitTargetType; 
  profitTargetDate?: Date; 

  
  monthlyCost: number; 
  liveBalanceAdjustment?: number; 

  
  createdDate: Date; 
  lastUpdated: Date; 
  lastBillingDate?: Date; 

  
  metrics: AccountMetrics; 

  
  transactions: AccountTransaction[]; 
  dailyBalances: DailyBalanceRecord[]; 
  notePath: string; 
  currency?: CurrencyCode; 
  copyTradingPeriods?: CopyTradingPeriod[]; 
}


export const DEFAULT_ACCOUNT_METRICS: AccountMetrics = {
  totalTrades: 0,
  winningTrades: 0,
  losingTrades: 0,
  breakEvenTrades: 0,
  winRate: 0,
  totalPnL: 0,
  bestTrade: 0,
  worstTrade: 0,
  profitFactor: 0,
  averageWin: 0,
  averageLoss: 0,
  maxDrawdown: 0,
  totalWithdrawals: 0,
};

export {};
