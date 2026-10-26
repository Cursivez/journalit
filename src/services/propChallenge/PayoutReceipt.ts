import type { AccountTransaction } from '../account/types';
import { TransactionType } from '../account/types';
import type { AccountPageData } from '../accountPage/types';
import {
  resolvePropChallengePayoutPhaseAt,
  resolvePhaseForTrade,
} from './PropChallengeConfig';
import { policyAt } from './PropChallengePolicyHistory';
import { evaluatePropChallengePhase } from './PropChallengeRuleEngine';
import {
  evaluatePropChallengePayout,
  previewPropChallengePayout,
} from './PropChallengePayoutEngine';


export interface PayoutReceipt {
  basis: 'policy_estimate';
  grossRequest: number;
  traderNetAmount: number | null;
  source: string;
  reviewReason?: string;
}

export function normalizePayoutReceipt(
  value: unknown,
  transaction: Pick<AccountTransaction, 'type' | 'amount'>
): PayoutReceipt | undefined {
  if (value === undefined) return undefined;
  const grossRequest = Math.abs(transaction.amount);
  if (
    typeof value === 'object' &&
    value !== null &&
    'basis' in value &&
    value.basis === 'policy_estimate' &&
    'grossRequest' in value &&
    value.grossRequest === grossRequest &&
    'traderNetAmount' in value &&
    (value.traderNetAmount === null ||
      (typeof value.traderNetAmount === 'number' &&
        Number.isFinite(value.traderNetAmount) &&
        value.traderNetAmount >= 0 &&
        value.traderNetAmount <= grossRequest)) &&
    'source' in value &&
    typeof value.source === 'string' &&
    (!('reviewReason' in value) || typeof value.reviewReason === 'string') &&
    transaction.type === TransactionType.WITHDRAWAL
  ) {
    return {
      basis: 'policy_estimate',
      grossRequest,
      traderNetAmount: value.traderNetAmount,
      source: value.source,
      ...('reviewReason' in value && typeof value.reviewReason === 'string'
        ? { reviewReason: value.reviewReason }
        : {}),
    };
  }
  return {
    basis: 'policy_estimate',
    grossRequest,
    traderNetAmount: null,
    source: '',
    reviewReason:
      'Stored payout estimate is invalid; confirm trader proceeds from the payout record.',
  };
}

export function buildPayoutReceipt(
  data: Pick<AccountPageData, 'trades' | 'excludedTrades'> & {
    account: Pick<AccountPageData['account'], 'propChallenge' | 'transactions'>;
  },
  requestedAmount: number,
  date: Date,
  tradingDayCutoffTime?: string
): PayoutReceipt | undefined {
  
  
  data = {
    ...data,
    account: {
      ...data.account,
      transactions: data.account.transactions.filter(
        (transaction) => transaction.date <= date
      ),
    },
    trades: data.trades.filter((trade) => trade.entryTime <= date),
  };
  const config = data.account.propChallenge;
  if (!config) return undefined;
  const phase = resolvePropChallengePayoutPhaseAt(config, date);
  if (!phase) return undefined;
  const policy = policyAt(phase, date).payoutPolicy;
  const base = {
    basis: 'policy_estimate' as const,
    grossRequest: requestedAmount,
  };
  const hasRelevantExcludedTrades = data.excludedTrades?.some(
    (trade) =>
      trade.entryTime <= date &&
      resolvePhaseForTrade(config, trade, date)?.id === phase.id
  );
  if (!policy || hasRelevantExcludedTrades)
    return {
      ...base,
      traderNetAmount: null,
      source: policy?.source ?? '',
      reviewReason:
        'Payout terms or complete converted trade data are unavailable.',
    };
  const evaluation = evaluatePropChallengePhase({
    phase,
    config,
    trades: data.trades,
    transactions: data.account.transactions,
    now: date,
    tradingDayCutoffTime,
  });
  const payout = evaluatePropChallengePayout({
    phase,
    config,
    policy,
    evaluation,
    trades: data.trades,
    transactions: data.account.transactions,
    now: date,
    tradingDayCutoffTime,
  });
  const impact = previewPropChallengePayout({
    phase,
    policy,
    evaluation,
    payout,
    requestedAmount,
  });
  return {
    ...base,
    traderNetAmount: impact.traderReceives,
    source: policy.source,
    ...(impact.reviewReason ? { reviewReason: impact.reviewReason } : {}),
  };
}


export function payoutReceiptTotals(
  transactions: readonly AccountTransaction[]
) {
  let grossAccountDebits = 0;
  let knownTraderNet = 0;
  let unknownCount = 0;
  for (const transaction of transactions) {
    if (transaction.type !== TransactionType.WITHDRAWAL) continue;
    grossAccountDebits += Math.abs(transaction.amount);
    const receipt = normalizePayoutReceipt(
      transaction.payoutReceipt,
      transaction
    );
    if (!receipt || receipt.traderNetAmount === null) unknownCount++;
    else knownTraderNet += receipt.traderNetAmount;
  }
  return {
    grossAccountDebits,
    knownTraderNet,
    unknownCount,
    traderNet: unknownCount > 0 ? null : knownTraderNet,
  };
}
