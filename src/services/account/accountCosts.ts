

import { parseLocalDateSafe } from '../../utils/dateUtils';
import type { AccountData } from './types';

const MS_PER_DAY = 86_400_000;
const DAYS_PER_BILLING_PERIOD = 30;

type CostAccount = Pick<
  AccountData,
  'accountType' | 'createdDate' | 'monthlyCost' | 'propChallenge'
> & {
  transactions: readonly Pick<AccountData['transactions'][number], 'date'>[];
};


export function estimateRecurringChargeDates(
  account: CostAccount,
  asOf: Date = new Date()
): Date[] {
  if (!account.monthlyCost || account.monthlyCost <= 0) return [];

  const createdAt = new Date(account.createdDate).getTime();
  let endAt = asOf.getTime();
  if (account.accountType?.toLowerCase() === 'archived') {
    endAt = createdAt;
    for (const transaction of account.transactions) {
      endAt = Math.max(endAt, new Date(transaction.date).getTime());
    }
  }

  const elapsedDays = Math.floor(Math.abs(endAt - createdAt) / MS_PER_DAY);
  const charges = Math.max(
    1,
    Math.floor(elapsedDays / DAYS_PER_BILLING_PERIOD)
  );
  
  
  return Array.from({ length: charges }, (_, index) => {
    const chargeDate = new Date(createdAt);
    chargeDate.setDate(chargeDate.getDate() + index * DAYS_PER_BILLING_PERIOD);
    return chargeDate;
  });
}


export function estimateRecurringCosts(
  account: CostAccount,
  asOf: Date = new Date()
): number {
  return (
    estimateRecurringChargeDates(account, asOf).length *
    Math.max(0, account.monthlyCost || 0)
  );
}


export function sumOneTimeCosts(
  account: CostAccount,
  includeDate?: (date: Date) => boolean
): number {
  let total = 0;
  for (const cost of account.propChallenge?.oneTimeCosts ?? []) {
    if (includeDate) {
      const costDate = parseLocalDateSafe(cost.date);
      if (!costDate || !includeDate(costDate)) continue;
    }
    total += Math.max(0, cost.amount);
  }
  return total;
}


export function calculateAccountTotalCosts(
  account: CostAccount,
  includeDate?: (date: Date) => boolean,
  asOf: Date = new Date()
): number {
  const chargeDates = estimateRecurringChargeDates(account, asOf);
  const includedCharges = includeDate
    ? chargeDates.filter(includeDate).length
    : chargeDates.length;
  return (
    sumOneTimeCosts(account, includeDate) +
    includedCharges * Math.max(0, account.monthlyCost || 0)
  );
}
