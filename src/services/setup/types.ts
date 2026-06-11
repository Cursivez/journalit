

export interface Setup {
  id: string;
  name: string;
  description: string;
  rules: string; 
  color: string; 
  icon: string; 
  status: 'active' | 'archived';
  version: number;
  createdAt: string;
  updatedAt: string;
  order: number; 
}

export interface SetupData {
  name: string;
  description: string;
  rules: string;
  color?: string;
  icon?: string;
  order?: number;
  status?: 'active' | 'archived';
}

export interface SetupMetrics {
  
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  avgWinner: number;
  avgLoser: number;
  winStreak: number;
  loseStreak: number;
  currentStreak: number;

  
  expectedValue: number; 
  riskRewardRatio: number; 
  profitFactor: number; 
  averageDuration: number; 
  bestTrade: number; 
  worstTrade: number; 
  averageVolume: number; 

  
  lastTradeDate: string; 
  tradingFrequency: number; 
  inactivityStreak: number; 
}

export interface SetupFilter {
  status?: 'active' | 'archived';
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'winRate' | 'order';
  sortDir?: 'asc' | 'desc';
}
