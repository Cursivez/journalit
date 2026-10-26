import type { AccountData, AccountTransaction } from './types';
import { TransactionType } from './types';
import type { CurrencyCode } from '../../utils/currencyConfig';
import { formatLocalDateString } from '../../utils/dateUtils';

interface MonthlyReturnYear {
  year: number;
  months: (number | null)[];
  total: number | null;
}

interface ReturnDay {
  
  inflows: number;
  
  outflows: number;
  
  events: { time: number; performance: number; flow: number }[];
}

function sortedTransactions(account: AccountData) {
  return [...account.transactions].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
}

function isExternal(transaction: AccountTransaction): boolean {
  return (
    transaction.type === TransactionType.DEPOSIT ||
    transaction.type === TransactionType.WITHDRAWAL
  );
}


export function firstTradeInScope(
  account: AccountData,
  asOf: Date = new Date()
): Date | null {
  let funded = false;
  for (const transaction of sortedTransactions(account)) {
    if (transaction.date > asOf) return null;
    if (!funded) {
      funded = isExternal(transaction) && transaction.balanceAfter > 0;
    } else if (transaction.type === TransactionType.TRADE) {
      return transaction.date;
    }
  }
  return null;
}


export function withPropChallengePhaseResets(
  account: AccountData
): AccountData {
  const phases = account.propChallenge?.phases ?? [];
  const starts = phases
    .flatMap((phase) => {
      if (phase.startedAt === undefined) return [];
      const time = Date.parse(phase.startedAt);
      const sharedTransition = phases.some(
        (candidate) =>
          candidate.id !== phase.id &&
          candidate.completedAt !== undefined &&
          Date.parse(candidate.completedAt) === time
      );
      return [{ phase, time, sharedTransition }];
    })
    .sort((a, b) => a.time - b.time);
  if (starts.length === 0) return account;

  const ordered = sortedTransactions(account);
  const transactions: AccountTransaction[] = [];
  let offset = 0;
  let balance = 0;
  let index = 0;
  const append = (transaction: AccountTransaction) => {
    balance = transaction.balanceAfter + offset;
    transactions.push({ ...transaction, balanceAfter: balance });
  };
  for (const { phase, time, sharedTransition } of starts) {
    while (index < ordered.length) {
      const transaction = ordered[index];
      const at = transaction.date.getTime();
      const ownedByNewPhase =
        at === time &&
        transaction.type === TransactionType.TRADE &&
        !sharedTransition;
      if (at > time || ownedByNewPhase) break;
      append(transaction);
      index++;
    }
    const flow = phase.startingBalance - balance;
    if (flow === 0) continue;
    offset += flow;
    balance = phase.startingBalance;
    transactions.push({
      id: `phase-reset:${phase.id}`,
      date: new Date(time),
      datePrecision: 'instant',
      type: flow > 0 ? TransactionType.DEPOSIT : TransactionType.WITHDRAWAL,
      amount: flow,
      description: phase.name,
      balanceAfter: balance,
    });
  }
  while (index < ordered.length) append(ordered[index++]);
  return { ...account, transactions };
}


export function calculateMonthlyReturns(
  accounts: readonly AccountData[],
  asOf: Date = new Date()
): MonthlyReturnYear[] {
  const days = new Map<string, ReturnDay>();
  let firstTradeKey: string | null = null;
  for (const account of accounts) {
    const firstTrade = firstTradeInScope(account, asOf);
    if (firstTrade === null) continue;
    const firstKey = formatLocalDateString(firstTrade);
    if (firstTradeKey === null || firstKey < firstTradeKey)
      firstTradeKey = firstKey;
    let previousBalance = 0;
    let funded = false;
    for (const transaction of sortedTransactions(account)) {
      if (transaction.date > asOf) break;
      const external = isExternal(transaction);
      if (!funded) {
        if (!external || transaction.balanceAfter <= 0) continue;
        funded = true;
      }
      
      
      const delta = transaction.balanceAfter - previousBalance;
      previousBalance = transaction.balanceAfter;
      const key = formatLocalDateString(transaction.date);
      const day = days.get(key) ?? { inflows: 0, outflows: 0, events: [] };
      const time = transaction.date.getTime();
      if (!external) {
        day.events.push({ time, performance: delta, flow: 0 });
      } else if (transaction.datePrecision === 'instant') {
        day.events.push({ time, performance: 0, flow: delta });
      } else if (delta > 0) {
        day.inflows += delta;
      } else {
        day.outflows += delta;
      }
      days.set(key, day);
    }
  }
  const entries = [...days.entries()].sort(([a], [b]) => a.localeCompare(b));
  if (firstTradeKey === null) return [];

  const firstYear = Number(entries[0][0].slice(0, 4));
  const firstTradeYear = Number(firstTradeKey.slice(0, 4));
  const firstTradeMonth = Number(firstTradeKey.slice(5, 7)) - 1;
  const lastYear = asOf.getFullYear();
  const lastMonth = asOf.getMonth();
  const result: MonthlyReturnYear[] = [];
  let balance = 0;
  let index = 0;
  for (let year = firstYear; year <= lastYear; year++) {
    const months: (number | null)[] = Array.from({ length: 12 }, () => null);
    let annualFactor = 1;
    let annualInvalid = false;
    let annualAvailable = false;
    for (let month = 0; month < 12; month++) {
      if (year === lastYear && month > lastMonth) break;
      const visible =
        year > firstTradeYear ||
        (year === firstTradeYear && month >= firstTradeMonth);
      const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
      let factor = 1;
      let available = balance > 0;
      let invalid = false;
      while (index < entries.length && entries[index][0].startsWith(prefix)) {
        const day = entries[index++][1];
        let capital = balance + day.inflows;
        let performance = 0;
        available ||= capital > 0;
        
        const closePeriod = (flow: number) => {
          if (performance !== 0) {
            const periodFactor = 1 + performance / capital;
            if (
              capital <= 0 ||
              periodFactor < 0 ||
              !Number.isFinite(periodFactor)
            ) {
              invalid = true;
            } else {
              factor *= periodFactor;
            }
          }
          capital += performance + flow;
          performance = 0;
          available ||= capital > 0;
        };
        
        for (const event of [...day.events].sort((a, b) => a.time - b.time)) {
          if (event.flow === 0) performance += event.performance;
          else closePeriod(event.flow);
        }
        closePeriod(0);
        balance = capital + day.outflows;
      }
      if (!visible) continue;
      if (available && !invalid) {
        months[month] = (factor - 1) * 100;
        annualFactor *= factor;
        annualAvailable = true;
      }
      annualInvalid ||= invalid;
    }
    if (year < firstTradeYear) continue;
    result.push({
      year,
      months,
      total:
        annualAvailable && !annualInvalid ? (annualFactor - 1) * 100 : null,
    });
  }
  return result;
}


export function convertLedgerCurrency(
  account: AccountData,
  currency: CurrencyCode,
  factor: number
): AccountData {
  return {
    ...account,
    currency,
    transactions: account.transactions.map((transaction) => ({
      ...transaction,
      amount: transaction.amount * factor,
      balanceAfter: transaction.balanceAfter * factor,
    })),
  };
}
