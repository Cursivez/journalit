import type { AccountMetadata, CopyTradingPeriod } from '../../settings/types';
import type {
  PropChallengePhase,
  PropChallengeRule,
  PropChallengeStage,
  PropFirmProfileSelection,
} from '../propChallenge/types';

export interface AccountMergeTrade {
  path: string;
  account: string[];
  entryTime: Date;
  exitTime: Date | null;
  settlementTime?: Date | null;
  accountId?: string;
  canonicalAccountId?: string;
  canonicalAccountIdentity?: 'broker' | 'name';
}

export interface AccountMergeSourceInput {
  accountName: string;
  metadata: AccountMetadata;
  trades: readonly AccountMergeTrade[];
  phaseName?: string;
  stage?: PropChallengeStage;
  status?: 'passed' | 'failed' | 'active';
  startedAt?: string;
  completedAt?: string;
  
  startingBalance?: number;
  
  rules?: PropChallengeRule[];
}

export interface AccountMergePlanInput {
  targetAccountName: string;
  sources: readonly AccountMergeSourceInput[];
  existingAccountNames: readonly string[];
  now: Date;
  
  resolveAccountTypeForStage?: (
    stage: PropChallengeStage | undefined
  ) => string | undefined;
  
  profile?: PropFirmProfileSelection;
  
  challengeName?: string;
  firmName?: string;
}

export type AccountMergeWarning =
  | {
      kind: 'trade_outside_phase_window';
      path: string;
      sourceAccountName: string;
      
      attributedPhaseId?: string;
    }
  | {
      kind: 'identity_claimed_by_multiple_sources';
      identity: string;
      sourceAccountNames: string[];
      assignedTo: string;
    }
  | {
      kind: 'copy_trading_period_dropped';
      sourceAccountName: string;
      baseAccount: string;
      startDate: string;
    }
  | {
      kind: 'starting_balance_differs_from_profile';
      sourceAccountName: string;
      phaseName: string;
      accountBalance: number;
      profileBalance: number;
    };

export interface AccountMergeNoteRewrite {
  path: string;
  previousAccount: string[];
  nextAccount: string[];
}

export interface AccountMergePlan {
  targetAccountName: string;
  targetIsSource: boolean;
  targetMetadata: AccountMetadata;
  sourcesToArchive: string[];
  phases: PropChallengePhase[];
  noteRewrites: AccountMergeNoteRewrite[];
  warnings: AccountMergeWarning[];
  
  sourceMetadataFingerprints: Record<string, string>;
}

export type AccountMergePlanErrorCode =
  | 'too_few_sources'
  | 'duplicate_source'
  | 'target_exists'
  | 'currency_mismatch'
  | 'timeline_not_monotonic'
  | 'invalid_override'
  | 'source_missing'
  | 'profile_phase_mismatch'
  | 'profile_currency_mismatch'
  | 'source_changed'
  | 'multiple_active_phases'
  | 'phases_after_failed_source'
  | 'copy_trading_overlap';

export type AccountMergeBackendMappingStatus =
  | 'repointed'
  | 'pending'
  | 'failed';

export type AccountReferenceChange =
  | { kind: 'accountMapping'; accountId: string; previous: string }
  | {
      kind: 'homeGoal';
      goalId: string;
      previousAccountTargets?: Record<string, number>;
      previousAccountTargetAccounts?: string[];
    }
  | {
      kind: 'copyTradingPeriods';
      accountKey: string;
      previousPeriods: CopyTradingPeriod[];
    }
  | { kind: 'csvFavoriteAccount'; previous: string }
  | {
      kind: 'homeAccountProgress';
      widgetId: string;
      previousAccounts: string[];
    }
  | {
      kind: 'copyTradeAdjustment';
      baseTradeKey: string;
      previousOldLookupKey: string;
      previousOldAdjustment: { pnlAdjustment: number; note?: string };
      previousNewLookupKey: string;
      previousNewAdjustment?: { pnlAdjustment: number; note?: string };
    };

export interface AccountMergeBuildSourceInput {
  accountName: string;
  phaseName?: string;
  stage?: PropChallengeStage;
  status?: 'passed' | 'failed' | 'active';
  startedAt?: string;
  completedAt?: string;
  startingBalance?: number;
  
  rules?: PropChallengeRule[];
}

export interface AccountMergeResult {
  recordId: string;
  rewrittenNotes: number;
  backendMappings: AccountMergeRecord['backendMappings'];
}

export interface AccountMergeRecord {
  id: string;
  mergedAt: string;
  targetAccountName: string;
  targetWasSource: boolean;
  previousTargetMetadata?: AccountMetadata;
  sources: Array<{
    accountName: string;
    previousAccountType: string;
    phaseId: string;
  }>;
  notes: Array<{ path: string; previousAccount: string[] }>;
  
  reviewedAt?: string;
  referenceChanges: AccountReferenceChange[];
  
  addedAccountOption?: boolean;
  backendMappings: Array<{
    backendAccountId: string;
    previousLocalAccountName: string;
    previousLocalAccountId?: string;
    status: AccountMergeBackendMappingStatus;
  }>;
}
