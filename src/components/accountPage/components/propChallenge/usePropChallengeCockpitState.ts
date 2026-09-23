

import { useMemo } from 'react';
import { useAccountPageData } from '../../context/AccountPageDataContext';
import { usePlugin } from '../../../../hooks/usePlugin';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { usePropChallengeReconciliation } from '../../../../hooks/usePropChallengeReconciliation';
import { getCurrentPropChallengePhase } from '../../../../services/propChallenge/PropChallengeConfig';
import {
  evaluatePropChallengePayout,
  type PropChallengePayoutEvaluation,
} from '../../../../services/propChallenge/PropChallengePayoutEngine';
import { evaluatePropChallengePhase } from '../../../../services/propChallenge/PropChallengeRuleEngine';
import type {
  PropChallengeConfig,
  PropChallengePhase,
} from '../../../../services/propChallenge/types';
import {
  derivePropChallengeCockpitFlags,
  type PropChallengeCockpitFlags,
} from './propChallengeCockpitState';

export type PropChallengePhaseEvaluationResult = ReturnType<
  typeof evaluatePropChallengePhase
>;

export interface PropChallengeCockpitState extends PropChallengeCockpitFlags {
  challenge: PropChallengeConfig;
  currentPhase: PropChallengePhase;
  
  selectedPhase: PropChallengePhase;
  
  selectPhase: (phaseId: string | undefined) => void;
  evaluation: PropChallengePhaseEvaluationResult;
  
  selectedEvaluation: PropChallengePhaseEvaluationResult;
  payoutEvaluation?: PropChallengePayoutEvaluation;
}


export function usePropChallengeCockpitState(): PropChallengeCockpitState | null {
  
  
  const { accountPageData, selectedPhaseId, setSelectedPhaseId } =
    useAccountPageData();
  const plugin = usePlugin();
  const { shouldMask } = useDisplayFormatter();

  const challenge = accountPageData?.account.propChallenge;
  const currentPhase = challenge
    ? getCurrentPropChallengePhase(challenge)
    : undefined;
  const tradingDayCutoffTime = plugin?.settings?.trade?.tradingDayCutoffTime;
  const selectedPhase =
    challenge && currentPhase
      ? (challenge.phases.find((phase) => phase.id === selectedPhaseId) ??
        currentPhase)
      : undefined;

  const evaluation = useMemo(
    () =>
      accountPageData && currentPhase
        ? evaluatePropChallengePhase({
            phase: currentPhase,
            config: challenge,
            trades: accountPageData.trades,
            transactions: accountPageData.account.transactions,
            tradingDayCutoffTime,
          })
        : null,
    [accountPageData, challenge, currentPhase, tradingDayCutoffTime]
  );

  const selectedEvaluation = useMemo(
    () =>
      !accountPageData || !selectedPhase || !evaluation
        ? null
        : selectedPhase.id === currentPhase?.id
          ? evaluation
          : evaluatePropChallengePhase({
              phase: selectedPhase,
              config: challenge,
              
              
              
              
              trades: selectedPhase.startedAt ? accountPageData.trades : [],
              transactions: selectedPhase.startedAt
                ? accountPageData.account.transactions
                : [],
              tradingDayCutoffTime,
            }),
    [
      accountPageData,
      challenge,
      currentPhase?.id,
      evaluation,
      selectedPhase,
      tradingDayCutoffTime,
    ]
  );

  const outcomeMasked = shouldMask('pnl');

  const payoutEvaluation = useMemo(
    () =>
      accountPageData && currentPhase?.payoutPolicy && evaluation
        ? evaluatePropChallengePayout({
            phase: currentPhase,
            config: challenge,
            policy: currentPhase.payoutPolicy,
            evaluation,
            trades: accountPageData.trades,
            transactions: accountPageData.account.transactions,
            tradingDayCutoffTime,
          })
        : undefined,
    [accountPageData, challenge, currentPhase, evaluation, tradingDayCutoffTime]
  );

  usePropChallengeReconciliation({
    accountPageData,
    evaluation,
    payoutEvaluation,
  });

  return useMemo(() => {
    if (
      !challenge ||
      !currentPhase ||
      !evaluation ||
      !selectedPhase ||
      !selectedEvaluation
    ) {
      return null;
    }

    return {
      challenge,
      currentPhase,
      selectedPhase,
      selectPhase: setSelectedPhaseId,
      evaluation,
      selectedEvaluation,
      ...(payoutEvaluation ? { payoutEvaluation } : {}),
      ...derivePropChallengeCockpitFlags({
        status: challenge.status,
        rules: evaluation.rules,
        outcomeMasked,
        accountArchived: accountPageData?.account.accountType === 'archived',
      }),
    };
  }, [
    accountPageData?.account.accountType,
    challenge,
    currentPhase,
    setSelectedPhaseId,
    selectedPhase,
    evaluation,
    selectedEvaluation,
    outcomeMasked,
    payoutEvaluation,
  ]);
}
