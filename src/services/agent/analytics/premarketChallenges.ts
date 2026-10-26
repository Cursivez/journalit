import type { AccountPageService } from '../../accountPage/AccountPageService';
import { getCurrentPropChallengePhase } from '../../propChallenge/PropChallengeConfig';
import { evaluatePropChallengePhase } from '../../propChallenge/PropChallengeRuleEngine';
import {
  summarizeChallengeRuleProgress,
  type ChallengeRuleProgress,
} from '../../propChallenge/challengeRuleProgress';

export interface ActiveChallengeProgress {
  accountName: string;
  
  currency?: string;
  phaseName: string | null;
  progress: ChallengeRuleProgress;
}


export async function readActiveChallengeProgress(
  accountPageService: Pick<
    AccountPageService,
    'getAllEnhancedAccountsOrThrow' | 'getAccountPageDataOrThrow'
  >,
  tradingDayCutoffTime: string | undefined,
  signal: AbortSignal
): Promise<ActiveChallengeProgress[]> {
  const accounts = await accountPageService.getAllEnhancedAccountsOrThrow();
  if (signal.aborted) throw signal.reason;
  const active = accounts.filter(
    (account) =>
      account.propChallenge?.status === 'active' &&
      account.accountType !== 'archived'
  );
  
  const pages = await Promise.all(
    active.map((account) =>
      accountPageService.getAccountPageDataOrThrow(account.name)
    )
  );
  if (signal.aborted) throw signal.reason;
  const result: ActiveChallengeProgress[] = [];
  active.forEach((account, index) => {
    const data = pages[index];
    const challenge = data?.account.propChallenge;
    const phase = challenge
      ? getCurrentPropChallengePhase(challenge)
      : undefined;
    if (!data || !challenge || !phase) return;
    const evaluation = evaluatePropChallengePhase({
      phase,
      config: challenge,
      trades: data.trades,
      transactions: data.account.transactions,
      tradingDayCutoffTime,
    });
    result.push({
      accountName: account.name,
      ...(data.account.currency ? { currency: data.account.currency } : {}),
      phaseName: phase.name.trim() || null,
      progress: summarizeChallengeRuleProgress(evaluation),
    });
  });
  return result;
}
