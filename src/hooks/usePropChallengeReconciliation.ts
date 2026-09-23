import { useEffect } from 'react';
import type { AccountPageData } from '../services/accountPage/types';
import type { PropChallengePayoutEvaluation } from '../services/propChallenge/PropChallengePayoutEngine';
import {
  maximumPayoutTransitionInstant,
  persistPropChallengeHardFailure,
  persistPropChallengeNoticeState,
  persistPropChallengeIdentityLearning,
  persistPropChallengeMaximumPayoutOutcome,
} from '../services/propChallenge/PropChallengePersistence';
import type { evaluatePropChallengePhase } from '../services/propChallenge/PropChallengeRuleEngine';
import { getAvailableAccountTypes } from '../components/accountPage/components/propChallenge/propChallengeLifecycleActions';
import { usePlugin } from './usePlugin';
import { AccountMetadataConflictError } from '../services/accountPage/AccountPageService';
import { logger } from '../utils/logger';

type PropChallengePhaseEvaluation = ReturnType<
  typeof evaluatePropChallengePhase
>;

interface UsePropChallengeReconciliationOptions {
  accountPageData: AccountPageData | null | undefined;
  evaluation: PropChallengePhaseEvaluation | null | undefined;
  payoutEvaluation?: PropChallengePayoutEvaluation;
}


export function usePropChallengeReconciliation({
  accountPageData,
  evaluation,
  payoutEvaluation,
}: UsePropChallengeReconciliationOptions): void {
  const plugin = usePlugin();
  const accountPageService = plugin?.accountPageService;
  const accountMapping = plugin?.settings?.backendIntegration?.accountMapping;

  useEffect(() => {
    const challenge = accountPageData?.account.propChallenge;
    if (!accountPageService || !accountPageData || !challenge || !evaluation) {
      return;
    }
    const accountName = accountPageData.account.name;
    const accountId = accountPageData.account.accountId;

    void (async () => {
      const learned = await persistPropChallengeIdentityLearning({
        accountPageService,
        accountName,
        accountId,
        config: challenge,
        trades: accountPageData.trades,
        now: new Date(),
      });
      if (learned) return;

      
      
      
      
      
      
      
      const payoutTransitionAt = maximumPayoutTransitionInstant(
        challenge,
        accountPageData.account.transactions,
        new Date()
      );
      const failureAt = evaluation.failure?.date.getTime();
      const payoutFirst =
        failureAt !== undefined && payoutTransitionAt.getTime() < failureAt;

      if (!payoutFirst) {
        const failed = await persistPropChallengeHardFailure({
          accountPageService,
          accountName,
          accountId,
          config: challenge,
          evaluation,
        });
        if (failed) return;
      }
      const appliedPayoutOutcome =
        await persistPropChallengeMaximumPayoutOutcome({
          accountPageService,
          accountName,
          accountId,
          config: challenge,
          payoutEvaluation,
          now: new Date(),
          transactions: accountPageData.account.transactions,
          stageAccountTypes:
            plugin?.settings?.account?.challengeStageAccountTypes,
          availableAccountTypes: getAvailableAccountTypes(plugin),
        });
      if (appliedPayoutOutcome) return;
      if (payoutFirst) {
        const failed = await persistPropChallengeHardFailure({
          accountPageService,
          accountName,
          accountId,
          config: challenge,
          evaluation,
        });
        if (failed) return;
      }
      await persistPropChallengeNoticeState({
        accountPageService,
        accountName,
        accountId,
        input: {
          config: challenge,
          accountArchived: accountPageData.account.accountType === 'archived',
          evaluation,
          payoutEvaluation,
          now: new Date(),
          trades: accountPageData.trades,
          accountName,
          resolveIdentityLabel: (identity) =>
            accountMapping?.[identity]?.trim() || undefined,
        },
      });
    })().catch((error: unknown) => {
      
      
      if (error instanceof AccountMetadataConflictError) {
        logger.debug('Prop challenge reconciliation superseded:', accountName);
        return;
      }
      console.error('Failed to reconcile prop challenge lifecycle:', error);
    });
  }, [
    accountPageData,
    accountPageService,
    accountMapping,
    evaluation,
    payoutEvaluation,
    plugin,
  ]);
}
