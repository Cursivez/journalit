

import type { PropChallengeRuleEvaluation } from '../../../../services/propChallenge/PropChallengeRuleEngine';
import type { PropChallengeConfig } from '../../../../services/propChallenge/types';

export interface PropChallengeCockpitFlags {
  
  governs: boolean;
  
  showsRuleLedger: boolean;
  outcomeMasked: boolean;
}


export function derivePropChallengeCockpitFlags(input: {
  status: PropChallengeConfig['status'];
  rules: readonly PropChallengeRuleEvaluation[];
  outcomeMasked: boolean;
  accountArchived?: boolean;
}): PropChallengeCockpitFlags {
  const { status, rules, outcomeMasked, accountArchived = false } = input;

  const governs =
    !accountArchived &&
    (status === 'active' || status === 'passed' || status === 'failed');

  
  
  
  const showsRuleLedger =
    governs && status === 'active' && !outcomeMasked && rules.length > 0;

  return { governs, showsRuleLedger, outcomeMasked };
}

interface AccountPageTopState {
  showSummaryBand: boolean;
  showGenericRisk: boolean;
}


export function resolveAccountPageTopState(
  flags: PropChallengeCockpitFlags | null
): AccountPageTopState {
  const showSummaryBand = !flags?.showsRuleLedger;

  return {
    showSummaryBand,
    showGenericRisk: !flags?.governs,
  };
}
