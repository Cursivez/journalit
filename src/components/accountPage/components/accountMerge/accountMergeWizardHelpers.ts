

import type { TranslationKey } from '../../../../lang/helpers';
import {
  AccountMergePlanError,
  planAccountMerge,
} from '../../../../services/accountMerge/planAccountMerge';
import type {
  AccountMergePlanErrorCode,
  AccountMergePlanInput,
} from '../../../../services/accountMerge/types';
import { isPropChallengeRuleComplete } from '../../../../services/propChallenge/PropChallengeConfig';
import type { PropChallengeRule } from '../../../../services/propChallenge/types';

export interface AccountMergeCandidate {
  name: string;
  accountType?: string;
  archived: boolean;
  currency?: string;
  createdDate?: string;
}

export function hasIncompleteAccountMergeRules(
  rulesByPhase: readonly (readonly PropChallengeRule[] | undefined)[],
  profileApplied: boolean
): boolean {
  return (
    !profileApplied &&
    rulesByPhase.some((rules) =>
      rules?.some((rule) => !isPropChallengeRuleComplete(rule))
    )
  );
}

export function hasEditedAccountMergeRules(
  overrides: readonly { rules?: readonly PropChallengeRule[] }[]
): boolean {
  return overrides.some((override) =>
    Object.prototype.hasOwnProperty.call(override, 'rules')
  );
}

const ERROR_LOCALE_KEYS: Record<AccountMergePlanErrorCode, TranslationKey> = {
  too_few_sources: 'account.merge.error.too-few-sources',
  duplicate_source: 'account.merge.error.duplicate-source',
  target_exists: 'account.merge.error.target-exists',
  currency_mismatch: 'account.merge.error.currency-mismatch',
  timeline_not_monotonic: 'account.merge.error.timeline-not-monotonic',
  invalid_override: 'account.merge.error.invalid-override',
  source_missing: 'account.merge.error.source-missing',
  profile_phase_mismatch: 'account.merge.error.profile-phase-mismatch',
  profile_currency_mismatch: 'account.merge.error.profile-currency-mismatch',
  source_changed: 'account.merge.error.source-changed',
  multiple_active_phases: 'account.merge.error.multiple-active-phases',
  phases_after_failed_source: 'account.merge.error.phases-after-failed-source',
  copy_trading_overlap: 'account.merge.error.copy-trading-overlap',
};

export function accountMergeErrorLocaleKey(
  code: AccountMergePlanErrorCode
): TranslationKey {
  return ERROR_LOCALE_KEYS[code];
}

function createdTime(candidate: AccountMergeCandidate): number {
  if (!candidate.createdDate) return Number.POSITIVE_INFINITY;
  const time = new Date(candidate.createdDate).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}


export function sortCandidatesByCreatedDate(
  candidates: readonly AccountMergeCandidate[]
): AccountMergeCandidate[] {
  return [...candidates].sort((a, b) => {
    const timeA = createdTime(a);
    const timeB = createdTime(b);
    if (timeA !== timeB) return timeA < timeB ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

interface AccountMergeDateOverrides {
  startedAt?: string;
  completedAt?: string;
}


export function findInvalidOverrideRow(
  overrides: readonly AccountMergeDateOverrides[]
): number | undefined {
  for (let index = 0; index < overrides.length; index++) {
    const { startedAt, completedAt } = overrides[index];
    const started = startedAt ? Date.parse(startedAt) : undefined;
    const completed = completedAt ? Date.parse(completedAt) : undefined;
    if (started !== undefined && Number.isNaN(started)) return index;
    if (completed !== undefined && Number.isNaN(completed)) return index;
    if (
      started !== undefined &&
      completed !== undefined &&
      completed < started
    ) {
      return index;
    }
    
    
    const nextStartedAt = overrides[index + 1]?.startedAt;
    const nextStarted = nextStartedAt ? Date.parse(nextStartedAt) : undefined;
    if (
      completed !== undefined &&
      nextStarted !== undefined &&
      !Number.isNaN(nextStarted) &&
      completed > nextStarted
    ) {
      return index;
    }
  }
  return undefined;
}


export function locatePlanErrorRow(
  input: AccountMergePlanInput,
  code: AccountMergePlanErrorCode
): number | undefined {
  for (let size = 1; size <= input.sources.length; size++) {
    try {
      planAccountMerge({ ...input, sources: input.sources.slice(0, size) });
    } catch (error) {
      if (error instanceof AccountMergePlanError && error.code === code) {
        return size - 1;
      }
    }
  }
  return undefined;
}

interface MergedFromSummary {
  shown: string[];
  extra: number;
}


export function summarizeMergedFrom(
  names: readonly string[],
  max = 3
): MergedFromSummary {
  return {
    shown: names.slice(0, max),
    extra: Math.max(0, names.length - max),
  };
}
