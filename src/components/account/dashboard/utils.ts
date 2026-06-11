

import {
  AccountData,
  DrawdownType,
  ProfitTargetType,
  TransactionType,
} from '../../../services/account/types';
import { formatPnL } from '../../../utils/formatting';
import { formatDateDisplay, getUserDateFormat } from '../../../utils/dateUtils';
import { DashboardMetricsData, AUMChartDataPoint } from './types';
import { CurrencyCode } from '../../../utils/currencyConfig';
import { AccountSettings } from '../../../settings/types';
import { normalizeLiveBalanceAdjustment } from '../../../services/account/liveBalanceAdjustment';


type SettingsWithAccount = { account?: AccountSettings };

const DEFAULT_ACCOUNT_TYPE_ORDER = ['funded', 'evaluation', 'demo', 'archived'];
const DEFAULT_ACCOUNT_TYPE_KEYS = new Set(DEFAULT_ACCOUNT_TYPE_ORDER);

const ensureArchivedLast = (types: string[]): string[] => {
  const archivedIndex = types.findIndex(
    (type) => type.toLowerCase() === 'archived'
  );

  if (archivedIndex === -1) {
    return types;
  }

  const archivedType = types[archivedIndex];
  return [...types.filter((_, index) => index !== archivedIndex), archivedType];
};

export function getDisplayAccountTypeKeys(
  configuredOrder: string[] | undefined,
  customTypes: string[] = []
): string[] {
  const normalizedOrder = (configuredOrder || DEFAULT_ACCOUNT_TYPE_ORDER).map(
    (type) => type.toLowerCase()
  );
  const orderWithArchived = normalizedOrder.includes('archived')
    ? normalizedOrder
    : [...normalizedOrder, 'archived'];

  const customTypeKeys = customTypes.map((type) => type.toLowerCase());
  const validTypeKeys = new Set(customTypeKeys);

  
  
  
  
  
  
  const configuredTypeKeys = customTypes.length
    ? orderWithArchived.filter(
        (type) => type === 'archived' || validTypeKeys.has(type)
      )
    : orderWithArchived;
  const nonDefaultCustomTypeKeys = customTypeKeys.filter(
    (type) => !DEFAULT_ACCOUNT_TYPE_KEYS.has(type)
  );
  const typeKeys = new Set<string>([
    ...configuredTypeKeys,
    ...nonDefaultCustomTypeKeys,
  ]);

  const sortedTypeKeys: string[] = [];
  orderWithArchived.forEach((type) => {
    if (typeKeys.has(type)) {
      sortedTypeKeys.push(type);
      typeKeys.delete(type);
    }
  });
  typeKeys.forEach((type) => sortedTypeKeys.push(type));

  return ensureArchivedLast(sortedTypeKeys);
}

export function getDisplayAccountTypes(
  accountsByType: Record<string, AccountData[]>,
  configuredOrder: string[] | undefined,
  customTypes: string[] = []
): string[] {
  const existingTypeKeyMap = new Map<string, string>();

  Object.keys(accountsByType).forEach((type) => {
    const key = type.toLowerCase();
    if (!existingTypeKeyMap.has(key)) {
      existingTypeKeyMap.set(key, type);
    }
  });

  return getDisplayAccountTypeKeys(configuredOrder, customTypes).map(
    (typeKey) => existingTypeKeyMap.get(typeKey) ?? typeKey
  );
}


export function calculateAccountGrowthAmount(account: AccountData): number {
  const tradePnL = Number.isFinite(account.metrics.totalPnL)
    ? account.metrics.totalPnL
    : 0;
  const liveBalanceAdjustment =
    normalizeLiveBalanceAdjustment(account.liveBalanceAdjustment) ?? 0;

  return tradePnL + liveBalanceAdjustment;
}


export function calculateAccountGrowthPercent(account: AccountData): number {
  if (account.initialBalance <= 0) {
    return 0;
  }

  return (calculateAccountGrowthAmount(account) / account.initialBalance) * 100;
}


export function calculateDashboardMetrics(
  accounts: AccountData[],
  settings?: SettingsWithAccount
): DashboardMetricsData {
  if (!accounts || accounts.length === 0) {
    return {
      totalAccounts: 0,
      totalAUM: 0,
      totalGrowthAmount: 0,
      totalGrowthPercent: 0,
      totalWithdrawals: 0,
      totalTrades: 0,
    };
  }

  
  
  const excludedTypes = settings?.account?.excludedAccountTypes || ['archived'];
  const includeWithdrawalsMap = settings?.account
    ?.includeWithdrawalsFromExcluded || { archived: true };

  
  const includedAccounts = accounts.filter(
    (account) =>
      account.accountType &&
      !excludedTypes.includes(account.accountType.toLowerCase())
  );

  
  const withdrawalAccounts = [
    ...includedAccounts,
    ...accounts.filter(
      (account) =>
        account.accountType &&
        excludedTypes.includes(account.accountType.toLowerCase()) &&
        includeWithdrawalsMap[account.accountType.toLowerCase()]
    ),
  ];

  const totalAccounts = includedAccounts.length;
  const totalAUM = includedAccounts.reduce(
    (sum, account) => sum + account.currentBalance,
    0
  );
  const totalInitialBalance = includedAccounts.reduce(
    (sum, account) => sum + account.initialBalance,
    0
  );
  const totalGrowthAmount = includedAccounts.reduce(
    (sum, account) => sum + calculateAccountGrowthAmount(account),
    0
  );
  const totalGrowthPercent =
    totalInitialBalance > 0
      ? (totalGrowthAmount / totalInitialBalance) * 100
      : 0;

  
  const totalWithdrawals = withdrawalAccounts.reduce(
    (sum, account) => sum + (account.metrics.totalWithdrawals || 0),
    0
  );

  
  const totalTrades = includedAccounts.reduce(
    (sum, account) => sum + account.metrics.totalTrades,
    0
  );

  return {
    totalAccounts,
    totalAUM,
    totalGrowthAmount,
    totalGrowthPercent,
    totalWithdrawals,
    totalTrades,
  };
}


export function generateAUMChartData(
  accounts: AccountData[],
  settings?: SettingsWithAccount
): AUMChartDataPoint[] {
  if (!accounts || accounts.length === 0) return [];

  const excludedTypes = settings?.account?.excludedAccountTypes || ['archived'];

  const includedAccounts = accounts.filter(
    (account) =>
      account.accountType &&
      !excludedTypes.includes(account.accountType.toLowerCase())
  );

  if (includedAccounts.length === 0) return [];

  const toDateKey = (value: Date): string => value.toISOString().split('T')[0];

  const dateData = new Map<
    string,
    {
      depositsForDay: number;
      withdrawalsForDay: number;
      accountCreated?: string;
      accountArchived?: string;
    }
  >();

  const accountStates = includedAccounts.map((account) => {
    const createdDate = new Date(account.createdDate);
    const createdDateKey = toDateKey(createdDate);

    if (!dateData.has(createdDateKey)) {
      dateData.set(createdDateKey, {
        depositsForDay: 0,
        withdrawalsForDay: 0,
      });
    }
    dateData.get(createdDateKey)!.accountCreated = account.id;

    const sortedTransactions = [...account.transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const snapshots = sortedTransactions.map((transaction) => {
      const dateKey = toDateKey(new Date(transaction.date));

      if (!dateData.has(dateKey)) {
        dateData.set(dateKey, {
          depositsForDay: 0,
          withdrawalsForDay: 0,
        });
      }

      const dayData = dateData.get(dateKey)!;
      if (
        transaction.type === TransactionType.DEPOSIT &&
        transaction.amount > 0
      ) {
        dayData.depositsForDay += transaction.amount;
      } else if (
        transaction.type === TransactionType.WITHDRAWAL ||
        (transaction.type === TransactionType.DEPOSIT && transaction.amount < 0)
      ) {
        dayData.withdrawalsForDay += Math.abs(transaction.amount);
      }

      return {
        dateKey,
        balance: transaction.balanceAfter,
      };
    });

    if (
      account.accountType?.toLowerCase() === 'archived' &&
      sortedTransactions.length > 0
    ) {
      const archiveDateKey = toDateKey(
        new Date(sortedTransactions[sortedTransactions.length - 1].date)
      );
      if (!dateData.has(archiveDateKey)) {
        dateData.set(archiveDateKey, {
          depositsForDay: 0,
          withdrawalsForDay: 0,
        });
      }
      dateData.get(archiveDateKey)!.accountArchived = account.id;
    }

    return {
      account,
      createdDate,
      createdDateKey,
      snapshots,
      snapshotIndex: 0,
      latestBalance: account.initialBalance,
    };
  });

  const sortedDates = [...dateData.keys()].sort();
  const lastDateKey = sortedDates[sortedDates.length - 1];

  return sortedDates.map((dateKey) => {
    const date = new Date(dateKey);
    const dayData = dateData.get(dateKey)!;
    let totalBalance = 0;

    for (const state of accountStates) {
      if (state.createdDateKey > dateKey) {
        continue;
      }

      while (
        state.snapshotIndex < state.snapshots.length &&
        state.snapshots[state.snapshotIndex].dateKey <= dateKey
      ) {
        state.latestBalance = state.snapshots[state.snapshotIndex].balance;
        state.snapshotIndex += 1;
      }

      const balance =
        dateKey === lastDateKey
          ? state.account.currentBalance
          : state.latestBalance;
      totalBalance += balance;
    }

    return {
      date: formatDateDisplay(date, getUserDateFormat()),
      rawDate: date,
      balance: totalBalance,
      isDeposit: dayData.depositsForDay > 0,
      depositAmount:
        dayData.depositsForDay > 0 ? dayData.depositsForDay : undefined,
      isWithdrawal: dayData.withdrawalsForDay > 0,
      withdrawalAmount:
        dayData.withdrawalsForDay > 0 ? dayData.withdrawalsForDay : undefined,
      accountCreated: dayData.accountCreated,
      accountArchived: dayData.accountArchived,
    };
  });
}


export function groupAccountsByType(
  accounts: AccountData[]
): Record<string, AccountData[]> {
  if (!accounts || accounts.length === 0) return {};

  
  const groupedByLowercase = accounts.reduce(
    (acc, account) => {
      const type = account.accountType?.toLowerCase() || 'unknown';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(account);
      return acc;
    },
    {} as Record<string, AccountData[]>
  );

  
  
  const result: Record<string, AccountData[]> = {};
  Object.entries(groupedByLowercase).forEach(([, accountsInGroup]) => {
    
    const displayType = accountsInGroup[0].accountType;
    result[displayType] = accountsInGroup;
  });

  return result;
}


export function formatAccountType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}


export function calculateAccountAge(createdDate: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - new Date(createdDate).getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months === 1 ? '' : 's'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    if (remainingMonths === 0) {
      return `${years} year${years === 1 ? '' : 's'}`;
    } else {
      return `${years}y ${remainingMonths}m`;
    }
  }
}


export function formatDrawdown(
  account: AccountData,
  currency: CurrencyCode = CurrencyCode.USD,
  displayRMultiples?: boolean,
  defaultRiskAmount?: number
): string {
  if (account.drawdownType === DrawdownType.NONE) {
    return 'N/A';
  }

  
  
  
  
  
  
  
  
  
  
  if (
    account.drawdownType === DrawdownType.MANUAL &&
    account.currentDrawdownSnapshot
  ) {
    const remaining =
      account.currentBalance - account.currentDrawdownSnapshot.drawdownLimit;
    const used = Math.min(
      account.drawdownAmount,
      Math.max(0, account.drawdownAmount - remaining)
    );
    const usedPercentage =
      account.drawdownAmount > 0
        ? Math.min(100, Math.max(0, (used / account.drawdownAmount) * 100))
        : 0;

    
    const rMultiple =
      displayRMultiples && defaultRiskAmount && defaultRiskAmount > 0
        ? used / defaultRiskAmount
        : undefined;

    return `${formatPnL(used, true, currency, displayRMultiples, rMultiple)} (${usedPercentage.toFixed(2)}%)`;
  }

  if (account.drawdownAmount <= 0) {
    return 'N/A';
  }

  const { used, usedPercentage } = calculateAccountDrawdownUsage(account);

  
  const rMultiple =
    displayRMultiples && defaultRiskAmount && defaultRiskAmount > 0
      ? used / defaultRiskAmount
      : undefined;

  return `${formatPnL(used, true, currency, displayRMultiples, rMultiple)} (${usedPercentage.toFixed(2)}%)`;
}


function calculateAccountDrawdownFloor(account: AccountData): number {
  if (account.drawdownType === DrawdownType.EOD_TRAILING) {
    const peakBalance = Math.max(
      account.initialBalance,
      account.currentBalance,
      ...account.dailyBalances.map((record) => record.balance)
    );

    return Math.min(
      account.initialBalance,
      peakBalance - account.drawdownAmount
    );
  }

  return account.initialBalance - account.drawdownAmount;
}

function calculateAccountDrawdownUsage(account: AccountData): {
  remainingDistance: number;
  used: number;
  usedPercentage: number;
} {
  const drawdownFloor = calculateAccountDrawdownFloor(account);
  const remainingDistance = account.currentBalance - drawdownFloor;
  const used = Math.min(
    account.drawdownAmount,
    Math.max(0, account.drawdownAmount - remainingDistance)
  );
  const usedPercentage = (used / account.drawdownAmount) * 100;

  return { remainingDistance, used, usedPercentage };
}

export function calculateDrawdownRemaining(account: AccountData): number {
  if (account.drawdownType === DrawdownType.NONE) {
    return 0;
  }

  
  if (
    account.drawdownType === DrawdownType.MANUAL &&
    account.currentDrawdownSnapshot
  ) {
    const limit = account.currentDrawdownSnapshot.drawdownLimit;

    
    if (limit <= 0 || account.initialBalance <= limit) {
      return 0;
    }

    
    const remainingDistance = account.currentBalance - limit;

    
    const remainingPercentage =
      account.drawdownAmount > 0
        ? (remainingDistance / account.drawdownAmount) * 100
        : 0;

    return Math.min(100, Math.max(0, remainingPercentage));
  }

  if (account.drawdownAmount <= 0) {
    return 0;
  }

  const drawdownFloor = calculateAccountDrawdownFloor(account);
  const remainingDistance = account.currentBalance - drawdownFloor;
  const remainingPercentage =
    (remainingDistance / account.drawdownAmount) * 100;

  return Math.min(100, Math.max(0, remainingPercentage));
}


export function formatDrawdownRemaining(
  account: AccountData,
  currency: CurrencyCode = CurrencyCode.USD,
  displayRMultiples?: boolean,
  defaultRiskAmount?: number
): string {
  if (account.drawdownType === DrawdownType.NONE) {
    return 'No drawdown set';
  }

  
  
  
  if (
    account.drawdownType === DrawdownType.MANUAL &&
    account.currentDrawdownSnapshot
  ) {
    const remaining =
      account.currentBalance - account.currentDrawdownSnapshot.drawdownLimit;
    const used = Math.min(
      account.drawdownAmount,
      Math.max(0, account.drawdownAmount - remaining)
    );
    const usedPercentage =
      account.drawdownAmount > 0
        ? Math.min(100, Math.max(0, (used / account.drawdownAmount) * 100))
        : 0;

    if (displayRMultiples && defaultRiskAmount && defaultRiskAmount > 0) {
      return `${formatPnL(remaining, true, currency, displayRMultiples, remaining / defaultRiskAmount)}/${formatPnL(account.drawdownAmount, true, currency, displayRMultiples, account.drawdownAmount / defaultRiskAmount)} (${usedPercentage.toFixed(1)}% used)`;
    }

    return `${formatPnL(remaining, true, currency)}/${formatPnL(account.drawdownAmount, true, currency)} (${usedPercentage.toFixed(1)}% used)`;
  }

  if (account.drawdownAmount <= 0) {
    return 'No drawdown set';
  }

  const drawdownFloor = calculateAccountDrawdownFloor(account);
  const drawdownDistance = account.currentBalance - drawdownFloor;
  const remainingPercentage = (drawdownDistance / account.drawdownAmount) * 100;

  
  const distanceRMultiple =
    displayRMultiples && defaultRiskAmount && defaultRiskAmount > 0
      ? drawdownDistance / defaultRiskAmount
      : undefined;
  const amountRMultiple =
    displayRMultiples && defaultRiskAmount && defaultRiskAmount > 0
      ? account.drawdownAmount / defaultRiskAmount
      : undefined;

  return `${formatPnL(drawdownDistance, true, currency, displayRMultiples, distanceRMultiple)}/${formatPnL(account.drawdownAmount, true, currency, displayRMultiples, amountRMultiple)} (${remainingPercentage.toFixed(1)}% remaining)`;
}


export function calculateTotalCosts(account: AccountData): number {
  if (!account.monthlyCost || account.monthlyCost <= 0) {
    return 0;
  }

  const createdDate = new Date(account.createdDate);
  let endDate: Date;

  
  if (account.accountType?.toLowerCase() === 'archived') {
    if (account.transactions.length > 0) {
      
      const sortedTransactions = [...account.transactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      endDate = new Date(
        sortedTransactions[sortedTransactions.length - 1].date
      );
    } else {
      
      endDate = createdDate;
    }
  } else {
    
    endDate = new Date();
  }

  
  const diffTime = Math.abs(endDate.getTime() - createdDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  
  const monthsElapsed = Math.floor(diffDays / 30);

  
  
  const totalCharges = Math.max(1, monthsElapsed);

  return account.monthlyCost * totalCharges;
}


export function calculateProfitTargetProgress(account: AccountData): number {
  if (!account.hasProfitTarget || account.profitTarget <= 0) return 0;

  const targetAmount =
    account.profitTargetType === ProfitTargetType.PERCENTAGE
      ? (account.initialBalance * account.profitTarget) / 100
      : account.profitTarget;

  const currentPnL = calculateAccountGrowthAmount(account);
  const progress = (currentPnL / targetAmount) * 100;

  return Math.min(100, Math.max(0, progress));
}


export function calculateAccountWithdrawals(account: AccountData): number {
  return account.transactions
    .filter(
      (t) =>
        t.type === TransactionType.WITHDRAWAL ||
        (t.type === TransactionType.DEPOSIT && t.amount < 0)
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export interface MonthlyWithdrawal {
  year: number;
  month: number;
  monthName: string;
  total: number;
}

function toTimestamp(date: Date | string | undefined): number {
  if (!date) {
    return 0;
  }

  const timestamp =
    date instanceof Date ? date.getTime() : new Date(date).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function haveSameRelevantTransactions(
  prevTransactions: AccountData['transactions'],
  nextTransactions: AccountData['transactions']
): boolean {
  return (
    prevTransactions.length === nextTransactions.length &&
    prevTransactions.every((transaction, index) => {
      const nextTransaction = nextTransactions[index];
      return (
        nextTransaction &&
        transaction.id === nextTransaction.id &&
        transaction.type === nextTransaction.type &&
        transaction.amount === nextTransaction.amount &&
        transaction.balanceAfter === nextTransaction.balanceAfter &&
        toTimestamp(transaction.date) === toTimestamp(nextTransaction.date)
      );
    })
  );
}

const MONTH_SHORT_KEYS = [
  'widget.header.month-short.0',
  'widget.header.month-short.1',
  'widget.header.month-short.2',
  'widget.header.month-short.3',
  'widget.header.month-short.4',
  'widget.header.month-short.5',
  'widget.header.month-short.6',
  'widget.header.month-short.7',
  'widget.header.month-short.8',
  'widget.header.month-short.9',
  'widget.header.month-short.10',
  'widget.header.month-short.11',
] as const;

export function getWithdrawalsByMonth(
  accounts: AccountData[]
): MonthlyWithdrawal[] {
  const monthMap = new Map<string, number>();

  for (const account of accounts) {
    const withdrawals = account.transactions.filter(
      (t) =>
        t.type === TransactionType.WITHDRAWAL ||
        (t.type === TransactionType.DEPOSIT && t.amount < 0)
    );

    for (const w of withdrawals) {
      const date = w.date instanceof Date ? w.date : new Date(w.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;
      monthMap.set(key, (monthMap.get(key) || 0) + Math.abs(w.amount));
    }
  }

  const result: MonthlyWithdrawal[] = [];
  for (const [key, total] of monthMap) {
    const [yearStr, monthStr] = key.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    result.push({
      year,
      month,
      monthName: MONTH_SHORT_KEYS[month],
      total,
    });
  }

  result.sort((a, b) => b.year - a.year || b.month - a.month);

  return result;
}

export function getWithdrawalAccountsForDashboard(
  accounts: AccountData[],
  settings?: SettingsWithAccount
): AccountData[] {
  const excludedTypes = settings?.account?.excludedAccountTypes || ['archived'];
  const includeWithdrawalsMap = settings?.account
    ?.includeWithdrawalsFromExcluded || { archived: true };

  const includedAccounts = accounts.filter(
    (account) =>
      account.accountType &&
      !excludedTypes.includes(account.accountType.toLowerCase())
  );

  return [
    ...includedAccounts,
    ...accounts.filter(
      (account) =>
        account.accountType &&
        excludedTypes.includes(account.accountType.toLowerCase()) &&
        includeWithdrawalsMap[account.accountType.toLowerCase()]
    ),
  ];
}


export function calculateDrawdownUsed(account: AccountData): number {
  if (account.drawdownType === DrawdownType.NONE) {
    return 0;
  }

  
  
  
  
  if (
    account.drawdownType === DrawdownType.MANUAL &&
    account.currentDrawdownSnapshot
  ) {
    const remaining =
      account.currentBalance - account.currentDrawdownSnapshot.drawdownLimit;
    const used = Math.min(
      account.drawdownAmount,
      Math.max(0, account.drawdownAmount - remaining)
    );

    if (account.drawdownAmount <= 0) {
      return 0;
    }

    const usedPercentage = (used / account.drawdownAmount) * 100;
    return Math.min(100, Math.max(0, usedPercentage));
  }

  if (account.drawdownAmount <= 0) {
    return 0;
  }

  const { usedPercentage } = calculateAccountDrawdownUsage(account);

  return Math.min(100, Math.max(0, usedPercentage));
}


export interface AccountTypeMetrics {
  aumAmount: number; 
  aumWeightPercent: number; 
  totalWithdrawals: number; 
  accountCount: number; 
  totalTrades: number; 
  totalGrowthAmount: number; 
  totalGrowthPercent: number; 
}


export function calculateAccountTypeMetrics(
  accounts: AccountData[],
  totalAUM: number
): AccountTypeMetrics {
  if (!accounts || accounts.length === 0) {
    return {
      aumAmount: 0,
      aumWeightPercent: 0,
      totalWithdrawals: 0,
      accountCount: 0,
      totalTrades: 0,
      totalGrowthAmount: 0,
      totalGrowthPercent: 0,
    };
  }

  
  const aumAmount = accounts.reduce(
    (sum, account) => sum + account.currentBalance,
    0
  );

  
  const aumWeightPercent = totalAUM > 0 ? (aumAmount / totalAUM) * 100 : 0;

  
  const totalWithdrawals = accounts.reduce(
    (sum, account) => sum + (account.metrics.totalWithdrawals || 0),
    0
  );

  
  const accountCount = accounts.length;

  
  const totalTrades = accounts.reduce(
    (sum, account) => sum + account.metrics.totalTrades,
    0
  );

  
  const totalInitialBalance = accounts.reduce(
    (sum, account) => sum + account.initialBalance,
    0
  );
  const totalGrowthAmount = accounts.reduce(
    (sum, account) => sum + calculateAccountGrowthAmount(account),
    0
  );
  const totalGrowthPercent =
    totalInitialBalance > 0
      ? (totalGrowthAmount / totalInitialBalance) * 100
      : 0;

  return {
    aumAmount,
    aumWeightPercent,
    totalWithdrawals,
    accountCount,
    totalTrades,
    totalGrowthAmount,
    totalGrowthPercent,
  };
}
