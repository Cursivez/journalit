

import { AccountData } from '../../../services/account/types';
import { AccountTypeMetrics, calculateAccountTypeMetrics } from './utils';


const ACCOUNT_TYPE_COLORS = [
  '#3b82f6', 
  '#7c3aed', 
  '#06b6d4', 
  '#f59e0b', 
  '#8b5cf6', 
  '#2563eb', 
  '#0ea5e9', 
  '#d97706', 
  '#6366f1', 
  '#ec4899', 
] as const;


export interface AccountTypeWeightData {
  type: string; 
  displayName: string; 
  aumAmount: number; 
  aumWeightPercent: number; 
  color: string; 
  accounts: AccountData[]; 
  metrics: AccountTypeMetrics; 
}


function getAccountTypeColor(index: number): string {
  const baseColorIndex = index % ACCOUNT_TYPE_COLORS.length;
  const baseColor = ACCOUNT_TYPE_COLORS[baseColorIndex];

  
  if (index >= ACCOUNT_TYPE_COLORS.length) {
    const opacityLevel = Math.max(
      0.6,
      1 - Math.floor(index / ACCOUNT_TYPE_COLORS.length) * 0.2
    );
    
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacityLevel})`;
  }

  return baseColor;
}


function formatAccountTypeDisplayName(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}


export function calculateAccountTypeWeights(
  accounts: AccountData[],
  accountsByType: Record<string, AccountData[]>,
  accountTypesToDisplay: string[],
  totalAUM: number,
  excludedTypes: string[] = []
): AccountTypeWeightData[] {
  if (!accounts || accounts.length === 0 || totalAUM === 0) {
    return [];
  }

  const weightData: AccountTypeWeightData[] = [];

  
  accountTypesToDisplay.forEach((type, index) => {
    const typeAccounts = accountsByType[type] || [];

    
    if (typeAccounts.length === 0) {
      return;
    }

    
    const isExcluded = excludedTypes.includes(type.toLowerCase());

    
    if (isExcluded) {
      return;
    }

    
    const metrics = calculateAccountTypeMetrics(typeAccounts, totalAUM);

    
    if (metrics.aumAmount > 0) {
      weightData.push({
        type,
        displayName: formatAccountTypeDisplayName(type),
        aumAmount: metrics.aumAmount,
        aumWeightPercent: metrics.aumWeightPercent,
        color: getAccountTypeColor(index),
        accounts: typeAccounts,
        metrics,
      });
    }
  });

  return weightData;
}


export function filterSignificantSegments(
  weightData: AccountTypeWeightData[],
  minimumPercentage: number = 1.0
): { segments: AccountTypeWeightData[]; otherSegment?: AccountTypeWeightData } {
  const significantSegments = weightData.filter(
    (data) => data.aumWeightPercent >= minimumPercentage
  );
  const smallSegments = weightData.filter(
    (data) => data.aumWeightPercent < minimumPercentage
  );

  if (smallSegments.length === 0) {
    return { segments: significantSegments };
  }

  
  const otherAumAmount = smallSegments.reduce(
    (sum, data) => sum + data.aumAmount,
    0
  );
  const otherWeightPercent = smallSegments.reduce(
    (sum, data) => sum + data.aumWeightPercent,
    0
  );
  const otherAccountCount = smallSegments.reduce(
    (sum, data) => sum + data.metrics.accountCount,
    0
  );
  const otherTotalTrades = smallSegments.reduce(
    (sum, data) => sum + data.metrics.totalTrades,
    0
  );
  const otherTotalGrowthAmount = smallSegments.reduce(
    (sum, data) => sum + data.metrics.totalGrowthAmount,
    0
  );
  const otherTotalWithdrawals = smallSegments.reduce(
    (sum, data) => sum + data.metrics.totalWithdrawals,
    0
  );

  
  const otherTotalInitialBalance = smallSegments.reduce(
    (sum, data) =>
      sum +
      data.accounts.reduce(
        (accountSum, account) => accountSum + account.initialBalance,
        0
      ),
    0
  );
  const otherTotalGrowthPercent =
    otherTotalInitialBalance > 0
      ? (otherTotalGrowthAmount / otherTotalInitialBalance) * 100
      : 0;

  const otherSegment: AccountTypeWeightData = {
    type: 'other',
    displayName: 'Other',
    aumAmount: otherAumAmount,
    aumWeightPercent: otherWeightPercent,
    color: '#94a3b8', 
    accounts: smallSegments.flatMap((data) => data.accounts),
    metrics: {
      aumAmount: otherAumAmount,
      aumWeightPercent: otherWeightPercent,
      accountCount: otherAccountCount,
      totalTrades: otherTotalTrades,
      totalGrowthAmount: otherTotalGrowthAmount,
      totalGrowthPercent: otherTotalGrowthPercent,
      totalWithdrawals: otherTotalWithdrawals,
    },
  };

  return {
    segments: significantSegments,
    otherSegment: otherSegment,
  };
}
