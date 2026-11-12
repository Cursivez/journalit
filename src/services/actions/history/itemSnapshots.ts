
import type { AccountTransaction } from '../../account/types';
import type {
  PropChallengeCost,
  PropChallengePriorPayout,
} from '../../propChallenge/types';

export function transactionItemSnapshot(
  transaction: AccountTransaction
): string {
  return JSON.stringify([
    transaction.type,
    transaction.amount,
    new Date(transaction.date).getTime(),
    transaction.datePrecision ?? null,
    transaction.description ?? null,
    transaction.payoutReceipt ?? null,
  ]);
}

export function costItemSnapshot(cost: PropChallengeCost): string {
  return JSON.stringify([cost.kind, cost.amount, cost.date, cost.note ?? null]);
}

export function priorPayoutItemSnapshot(
  payout: PropChallengePriorPayout
): string {
  return JSON.stringify([payout.amount, payout.date, payout.note ?? null]);
}
