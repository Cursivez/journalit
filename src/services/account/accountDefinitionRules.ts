import { DrawdownType, ProfitTargetType } from './types';
import type { PropChallengeConfig } from '../propChallenge/types';
import {
  isPropChallengePhaseComplete,
  phaseProfitTargetNeedsBalance,
} from '../propChallenge/PropChallengeConfig';



interface AccountDefinitionDraft {
  readonly initialBalance: number;
  readonly drawdownType: DrawdownType;
  readonly drawdownAmount: number;
  readonly hasProfitTarget: boolean;
  readonly profitTarget: number;
  readonly profitTargetType: ProfitTargetType;
  readonly monthlyCost: number;
  
  readonly createdDate: Date | null;
  readonly propChallenge?: PropChallengeConfig;
}


export type AccountDefinitionIssue =
  | 'balance-negative'
  | 'rule-incomplete'
  | 'drawdown-required'
  | 'profit-target-required'
  | 'profit-target-needs-balance'
  | 'phase-profit-target-needs-balance'
  | 'invalid-date'
  | 'future-date'
  | 'cost-negative';

export function accountDefinitionIssue(
  draft: AccountDefinitionDraft,
  now: Date = new Date()
): AccountDefinitionIssue | null {
  const phases = draft.propChallenge?.phases ?? [];
  if (phases.length > 0) {
    
    if (
      phases.some(
        (phase) =>
          !Number.isFinite(phase.startingBalance) || phase.startingBalance < 0
      )
    ) {
      return 'balance-negative';
    }
    
    
    if (phases.some((phase) => !isPropChallengePhaseComplete(phase))) {
      return 'rule-incomplete';
    }
    if (phases.some(phaseProfitTargetNeedsBalance)) {
      return 'phase-profit-target-needs-balance';
    }
  } else if (
    !Number.isFinite(draft.initialBalance) ||
    draft.initialBalance < 0
  ) {
    return 'balance-negative';
  }
  if (draft.drawdownType !== DrawdownType.NONE && !(draft.drawdownAmount > 0)) {
    return 'drawdown-required';
  }
  
  
  if (
    phases.length === 0 &&
    draft.hasProfitTarget &&
    !(draft.profitTarget > 0)
  ) {
    return 'profit-target-required';
  }
  if (
    phases.length === 0 &&
    draft.hasProfitTarget &&
    profitTargetNeedsBalance(draft)
  ) {
    return 'profit-target-needs-balance';
  }
  if (!draft.createdDate || Number.isNaN(draft.createdDate.getTime())) {
    return 'invalid-date';
  }
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const created = new Date(draft.createdDate);
  created.setHours(0, 0, 0, 0);
  if (created > today) return 'future-date';
  if (!Number.isFinite(draft.monthlyCost) || draft.monthlyCost < 0) {
    return 'cost-negative';
  }
  return null;
}

interface ProfitTargetDefinition {
  readonly initialBalance: number;
  readonly hasProfitTarget: boolean;
  readonly profitTarget: number;
  readonly profitTargetType: ProfitTargetType;
}


export function profitTargetNeedsBalance(
  account: Pick<ProfitTargetDefinition, 'initialBalance' | 'profitTargetType'>
): boolean {
  return (
    account.profitTargetType === ProfitTargetType.PERCENTAGE &&
    !(account.initialBalance > 0)
  );
}


export function resolveProfitTargetAmount(
  account: ProfitTargetDefinition
): number | undefined {
  if (!account.hasProfitTarget || !(account.profitTarget > 0)) return undefined;
  if (profitTargetNeedsBalance(account)) return undefined;
  return account.profitTargetType === ProfitTargetType.PERCENTAGE
    ? (account.initialBalance * account.profitTarget) / 100
    : account.profitTarget;
}
