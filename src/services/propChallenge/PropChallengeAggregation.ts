import type { AccountData, AccountTransaction } from '../account/types';
import { calculateAccountTotalCosts } from '../account/accountCosts';
import { TransactionType } from '../account/types';
import type { PropChallengeConfig, PropChallengePhase } from './types';
import { resolvePropChallengePayoutPhaseAt } from './PropChallengeConfig';
import { payoutReceiptTotals } from './PayoutReceipt';

function addPayouts(left: number | null, right: number | null): number | null {
  return left === null || right === null ? null : left + right;
}

function netAfterCosts(payouts: number | null, costs: number): number | null {
  return payouts === null ? null : payouts - costs;
}

const MS_PER_DAY = 86_400_000;

type PropChallengeOutcome = 'active' | 'passed' | 'failed';

interface PropChallengeStats {
  totalChallenges: number;
  activeChallenges: number;
  passedChallenges: number;
  failedChallenges: number;
  archivedChallenges: number;
  completedChallenges: number;
  passRate: number;
  totalCosts: number;
  totalPayouts: number | null;
  netPayouts: number | null;
  passedChallengesWithPayouts: number;
  payoutConversionRate: number | undefined;
  monetaryTotals: Array<{
    currencyCode?: string;
    challengeCount: number;
    passedChallenges: number;
    totalCosts: number;
    totalPayouts: number | null;
    netPayouts: number | null;
  }>;
}

interface PropPhaseNameStats {
  
  name: string;
  total: number;
  completed: number;
  passed: number;
  failed: number;
  passRate: number | undefined;
  
  averageDurationDays: number | undefined;
}

interface PropPhaseStats {
  completedPhases: number;
  
  mostFailedPhase: { name: string; failedCount: number } | undefined;
  
  phaseNames: PropPhaseNameStats[];
}

interface PropFirmStats {
  firms: Array<{
    
    name: string;
    total: number;
    completed: number;
    passed: number;
    failed: number;
    passRate: number | undefined;
    monetaryTotals: Array<{
      currencyCode?: string;
      totalCosts: number;
      totalPayouts: number | null;
      netPayouts: number | null;
    }>;
  }>;
}

interface FirmAccumulator {
  name: string;
  total: number;
  passed: number;
  failed: number;
  monetaryTotalsByCurrency: Map<
    string,
    { totalCosts: number; totalPayouts: number | null }
  >;
}

interface PhaseNameAccumulator {
  name: string;
  total: number;
  passed: number;
  failed: number;
  durationSum: number;
  durationCount: number;
}


function getPropPhaseDurationDays(
  phase: PropChallengePhase
): number | undefined {
  if (phase.status !== 'passed' && phase.status !== 'failed') return undefined;
  if (!phase.startedAt || !phase.completedAt) return undefined;

  const startedAt = Date.parse(phase.startedAt);
  const completedAt = Date.parse(phase.completedAt);
  if (!Number.isFinite(startedAt) || !Number.isFinite(completedAt)) {
    return undefined;
  }
  if (completedAt < startedAt) return undefined;

  return (completedAt - startedAt) / MS_PER_DAY;
}


export function aggregatePropPhaseStats(
  accounts: readonly AccountData[]
): PropPhaseStats {
  const byName = new Map<string, PhaseNameAccumulator>();
  let completedPhases = 0;

  for (const account of accounts) {
    const challenge = account.propChallenge;
    if (!challenge) continue;

    for (const phase of challenge.phases) {
      const key = phase.name.trim().toLowerCase();
      const entry = byName.get(key) ?? {
        name: phase.name.trim(),
        total: 0,
        passed: 0,
        failed: 0,
        durationSum: 0,
        durationCount: 0,
      };
      entry.total += 1;
      if (phase.status === 'passed') entry.passed += 1;
      if (phase.status === 'failed') entry.failed += 1;

      const durationDays = getPropPhaseDurationDays(phase);
      if (durationDays !== undefined) {
        entry.durationSum += durationDays;
        entry.durationCount += 1;
      }
      byName.set(key, entry);

      if (phase.status === 'passed' || phase.status === 'failed') {
        completedPhases += 1;
      }
    }
  }

  const accumulators = Array.from(byName.values()).sort(
    (a, b) =>
      b.total - a.total ||
      b.passed + b.failed - (a.passed + a.failed) ||
      a.name.localeCompare(b.name)
  );

  const failedRanked = accumulators
    .filter((entry) => entry.failed > 0)
    .sort((a, b) => b.failed - a.failed || a.name.localeCompare(b.name));

  return {
    completedPhases,
    mostFailedPhase: failedRanked[0]
      ? { name: failedRanked[0].name, failedCount: failedRanked[0].failed }
      : undefined,
    phaseNames: accumulators.map((entry) => ({
      name: entry.name,
      total: entry.total,
      completed: entry.passed + entry.failed,
      passed: entry.passed,
      failed: entry.failed,
      passRate:
        entry.passed + entry.failed === 0
          ? undefined
          : (entry.passed / (entry.passed + entry.failed)) * 100,
      averageDurationDays:
        entry.durationCount === 0
          ? undefined
          : entry.durationSum / entry.durationCount,
    })),
  };
}


function getPropChallengeOutcome(
  challenge: PropChallengeConfig
): PropChallengeOutcome {
  if (challenge.evaluationOutcome) return challenge.evaluationOutcome;
  return challenge.status;
}


export function aggregatePropFirmStats(
  accounts: readonly AccountData[]
): PropFirmStats {
  const byFirm = new Map<string, FirmAccumulator>();

  for (const account of accounts) {
    const challenge = account.propChallenge;
    const firmName = challenge?.firmName?.trim();
    if (!challenge || !firmName) continue;

    const key = firmName.toLowerCase();
    const firm: FirmAccumulator = byFirm.get(key) ?? {
      name: firmName,
      total: 0,
      passed: 0,
      failed: 0,
      monetaryTotalsByCurrency: new Map<
        string,
        { totalCosts: number; totalPayouts: number | null }
      >(),
    };
    const outcome = getPropChallengeOutcome(challenge);
    const totalCosts = calculateAccountTotalCosts(account);
    const totalPayouts = fundedPhasePayoutTotal(
      challenge,
      account.transactions
    );
    const currencyKey = account.currency ?? '';
    const monetaryTotals = firm.monetaryTotalsByCurrency.get(currencyKey) ?? {
      totalCosts: 0,
      totalPayouts: 0,
    };

    firm.total += 1;
    if (outcome === 'passed') firm.passed += 1;
    if (outcome === 'failed') firm.failed += 1;
    monetaryTotals.totalCosts += totalCosts;
    monetaryTotals.totalPayouts = addPayouts(
      monetaryTotals.totalPayouts,
      totalPayouts
    );
    firm.monetaryTotalsByCurrency.set(currencyKey, monetaryTotals);
    byFirm.set(key, firm);
  }

  return {
    firms: Array.from(byFirm.values())
      .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
      .map((firm) => {
        const completed = firm.passed + firm.failed;
        return {
          name: firm.name,
          total: firm.total,
          completed,
          passed: firm.passed,
          failed: firm.failed,
          passRate:
            completed === 0 ? undefined : (firm.passed / completed) * 100,
          monetaryTotals: Array.from(
            firm.monetaryTotalsByCurrency,
            ([currencyCode, totals]) => ({
              currencyCode: currencyCode || undefined,
              ...totals,
              netPayouts: netAfterCosts(totals.totalPayouts, totals.totalCosts),
            })
          ),
        };
      }),
  };
}


function fundedPhasePayoutTotal(
  challenge: PropChallengeConfig,
  transactions: readonly AccountTransaction[]
): number | null {
  return payoutReceiptTotals(
    transactions.filter(
      (transaction) =>
        transaction.type === TransactionType.WITHDRAWAL &&
        resolvePropChallengePayoutPhaseAt(challenge, new Date(transaction.date))
    )
  ).traderNet;
}

export function aggregatePropChallengeStats(
  accounts: readonly AccountData[]
): PropChallengeStats {
  let totalChallenges = 0;
  let activeChallenges = 0;
  let passedChallenges = 0;
  let failedChallenges = 0;
  let archivedChallenges = 0;
  let totalCosts = 0;
  let totalPayouts: number | null = 0;
  let passedChallengesWithPayouts = 0;
  const monetaryTotalsByCurrency = new Map<
    string,
    {
      challengeCount: number;
      passedChallenges: number;
      totalCosts: number;
      totalPayouts: number | null;
    }
  >();

  for (const account of accounts) {
    const challenge = account.propChallenge;
    if (!challenge) continue;
    totalChallenges += 1;

    const archived = account.accountType === 'archived';
    if (archived) archivedChallenges += 1;
    
    
    
    
    
    if (challenge.status === 'active' && !archived) activeChallenges += 1;
    const outcome = getPropChallengeOutcome(challenge);
    if (outcome === 'passed') passedChallenges += 1;
    if (outcome === 'failed') failedChallenges += 1;

    const accountCosts = calculateAccountTotalCosts(account);
    const accountPayouts = fundedPhasePayoutTotal(
      challenge,
      account.transactions
    );
    totalCosts += accountCosts;
    totalPayouts = addPayouts(totalPayouts, accountPayouts);
    if (
      outcome === 'passed' &&
      account.transactions.some(
        (transaction) =>
          transaction.type === TransactionType.WITHDRAWAL &&
          transaction.amount !== 0 &&
          resolvePropChallengePayoutPhaseAt(
            challenge,
            new Date(transaction.date)
          )
      )
    ) {
      passedChallengesWithPayouts += 1;
    }
    const currencyKey = account.currency ?? '';
    const currencyTotals = monetaryTotalsByCurrency.get(currencyKey) ?? {
      challengeCount: 0,
      passedChallenges: 0,
      totalCosts: 0,
      totalPayouts: 0,
    };
    currencyTotals.challengeCount += 1;
    if (outcome === 'passed') currencyTotals.passedChallenges += 1;
    currencyTotals.totalCosts += accountCosts;
    currencyTotals.totalPayouts = addPayouts(
      currencyTotals.totalPayouts,
      accountPayouts
    );
    monetaryTotalsByCurrency.set(currencyKey, currencyTotals);
  }

  const completedChallenges = passedChallenges + failedChallenges;
  return {
    totalChallenges,
    activeChallenges,
    passedChallenges,
    failedChallenges,
    archivedChallenges,
    completedChallenges,
    passRate:
      completedChallenges === 0
        ? 0
        : (passedChallenges / completedChallenges) * 100,
    totalCosts,
    totalPayouts,
    netPayouts: netAfterCosts(totalPayouts, totalCosts),
    passedChallengesWithPayouts,
    payoutConversionRate:
      passedChallenges === 0
        ? undefined
        : (passedChallengesWithPayouts / passedChallenges) * 100,
    monetaryTotals: Array.from(
      monetaryTotalsByCurrency,
      ([currencyCode, totals]) => ({
        currencyCode: currencyCode || undefined,
        ...totals,
        netPayouts: netAfterCosts(totals.totalPayouts, totals.totalCosts),
      })
    ),
  };
}

interface PropChallengeEconomicsTotals {
  currencyCode?: string;
  totalCosts: number;
  totalPayouts: number | null;
  netPayouts: number | null;
  
  roi: number | undefined;
}

interface PropChallengeEconomics {
  
  challengeCount: number;
  
  totalsByCurrency: PropChallengeEconomicsTotals[];
}


export function aggregatePropChallengeEconomics(
  accounts: readonly AccountData[],
  period?: {
    
    includesCostDate: (date: Date) => boolean;
    
    includesPayoutTimestamp: (timestamp: Date) => boolean;
  }
): PropChallengeEconomics {
  let challengeCount = 0;
  const totalsByCurrency = new Map<
    string,
    { totalCosts: number; totalPayouts: number | null }
  >();

  for (const account of accounts) {
    const challenge = account.propChallenge;
    if (!challenge) continue;
    challengeCount += 1;

    const accountCosts = calculateAccountTotalCosts(
      account,
      period?.includesCostDate
    );
    const accountPayouts = fundedPhasePayoutTotal(
      challenge,
      account.transactions.filter((transaction) => {
        if (transaction.type !== TransactionType.WITHDRAWAL) return false;
        const date = new Date(transaction.date);
        return !period || period.includesPayoutTimestamp(date);
      })
    );

    const currencyKey = account.currency ?? '';
    const totals = totalsByCurrency.get(currencyKey) ?? {
      totalCosts: 0,
      totalPayouts: 0,
    };
    totals.totalCosts += accountCosts;
    totals.totalPayouts = addPayouts(totals.totalPayouts, accountPayouts);
    totalsByCurrency.set(currencyKey, totals);
  }

  return {
    challengeCount,
    totalsByCurrency: Array.from(totalsByCurrency, ([currencyCode, totals]) => {
      const netPayouts = netAfterCosts(totals.totalPayouts, totals.totalCosts);
      return {
        currencyCode: currencyCode || undefined,
        ...totals,
        netPayouts,
        roi:
          netPayouts !== null && totals.totalCosts > 0
            ? (netPayouts / totals.totalCosts) * 100
            : undefined,
      };
    }),
  };
}
