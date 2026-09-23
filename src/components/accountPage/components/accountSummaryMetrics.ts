

import { TransactionType } from '../../../services/account/types';
import type {
  AccountData,
  AccountTransaction,
} from '../../../services/account/types';
import { calculateTotalCosts } from '../../account/dashboard/utils';
import type { AccountTradeData } from '../../../services/accountPage/types';
import { doesPhaseOwnTransaction } from '../../../services/propChallenge/PropChallengeRuleEngine';
import type {
  PropChallengeConfig,
  PropChallengePhase,
} from '../../../services/propChallenge/types';

interface AccountCostSummary {
  estimatedRecurringCosts: number;
  estimatedTotalCosts: number;
  hasCosts: boolean;
  monthlyCost: number;
  oneTimeCosts: number;
}


export function calculateAccountCostSummary(
  account: AccountData,
  asOf: Date = new Date()
): AccountCostSummary {
  const monthlyCost = Math.max(0, account.monthlyCost || 0);
  const oneTimeCosts = (account.propChallenge?.oneTimeCosts ?? []).reduce(
    (total, cost) => total + Math.max(0, cost.amount),
    0
  );
  const estimatedRecurringCosts = calculateTotalCosts(account, asOf);
  const estimatedTotalCosts = oneTimeCosts + estimatedRecurringCosts;

  return {
    estimatedRecurringCosts,
    estimatedTotalCosts,
    hasCosts: estimatedTotalCosts > 0 || monthlyCost > 0,
    monthlyCost,
    oneTimeCosts,
  };
}


export function calculateNetCashFlow(account: AccountData): number {
  return manualCashTransactions(account).reduce((total, transaction) => {
    return isWithdrawal(transaction)
      ? total - Math.abs(transaction.amount)
      : total + transaction.amount;
  }, 0);
}


function manualCashTransactions(account: AccountData): AccountTransaction[] {
  return (account.transactions || []).filter(
    (transaction) =>
      (transaction.type === TransactionType.DEPOSIT ||
        transaction.type === TransactionType.WITHDRAWAL) &&
      transaction.description !== 'Initial deposit'
  );
}

function isWithdrawal(transaction: AccountTransaction): boolean {
  return (
    transaction.type === TransactionType.WITHDRAWAL || transaction.amount < 0
  );
}


export function calculatePhaseWithdrawals(
  phase: PropChallengePhase,
  config: PropChallengeConfig,
  trades: readonly AccountTradeData[],
  transactions: readonly AccountTransaction[],
  now: Date = new Date()
): number {
  if (!phase.startedAt) {
    return 0;
  }

  const tradesByPath = new Map<string, AccountTradeData>();
  for (const trade of trades) {
    tradesByPath.set(trade.path, trade);
  }

  return transactions
    .filter(
      (transaction) =>
        
        
        
        
        transaction.type === TransactionType.WITHDRAWAL &&
        transaction.description !== 'Initial deposit' &&
        doesPhaseOwnTransaction(
          transaction,
          config.phases,
          phase,
          tradesByPath,
          now
        )
    )
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
}
