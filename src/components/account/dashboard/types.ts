

import { WorkspaceLeaf } from 'obsidian';
import { AccountData } from '../../../services/account/types';


export interface DashboardMetricsData {
  totalAccounts: number;
  totalAUM: number;
  totalGrowthAmount: number;
  totalGrowthPercent: number;
  totalWithdrawals: number;
  totalTrades: number;
}


export interface AUMChartDataPoint {
  date: string; 
  rawDate: Date; 
  balance: number; 
  isDeposit?: boolean; 
  depositAmount?: number; 
  isWithdrawal?: boolean; 
  withdrawalAmount?: number; 
  accountCreated?: string; 
  accountArchived?: string; 
}


export interface AUMChartProps {
  data: AUMChartDataPoint[];
  height?: number;
  plugin?: import('../../../main').default;
}


export interface DashboardMetricsProps {
  metrics: DashboardMetricsData;
  withdrawalAccounts?: AccountData[];
}


export interface AccountSectionProps {
  type: string;
  accounts: AccountData[];
  openAccount: (
    accountName: string,
    accountData?: AccountData
  ) => void | Promise<void>;
  totalAUM?: number; 
  excludedTypes?: string[]; 
}


export interface AccountCardProps {
  account: AccountData;
  onClick: () => void;
}


export interface AccountSectionsProps {
  accountsByType: Record<string, AccountData[]>;
  openAccount: (
    accountName: string,
    accountData?: AccountData
  ) => void | Promise<void>;
  plugin: import('../../../main').default;
  refreshTrigger?: number;
  totalAUM?: number; 
  excludedTypes?: string[]; 
}


export interface AccountDashboardProps {
  plugin: import('../../../main').default;
  leaf: WorkspaceLeaf;
}
