import type { AccountPageService } from '../accountPage/AccountPageService';
import { eventBus } from '../events/EventBus';
import { TransactionType } from '../account/types';
import type { AccountTransaction } from '../account/types';
import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropChallengePayoutPolicy,
  PropChallengeStage,
} from './types';
import type { evaluatePropChallengePhase } from './PropChallengeRuleEngine';
import { resolveStageAccountType } from './stageAccountTypes';
import type { PropChallengePayoutEvaluation } from './PropChallengePayoutEngine';
import {
  advancePhase,
  getCurrentPropChallengePhase,
  reconcileChallengeHardFailure,
  resolvePropChallengePayoutPhaseAt,
} from './PropChallengeConfig';
import { policyAt } from './PropChallengePolicyHistory';
import {
  reconcilePropChallengeNoticeState,
  type ReconcileNoticeStateInput,
} from './PropChallengeNotices';
import {
  learnPropChallengeIdentities,
  type PropChallengeIdentityTrade,
} from './PropChallengeIdentityLearning';

interface SavePropChallengeConfigOptions {
  accountPageService: AccountPageService;
  accountName: string;
  accountId?: string;
  config: PropChallengeConfig;
  accountType?: string;
  
  createdDate?: Date;
  expectedConfig?: PropChallengeConfig;
}

type PropChallengePhaseEvaluation = ReturnType<
  typeof evaluatePropChallengePhase
>;

interface PersistPropChallengeHardFailureOptions extends Omit<
  SavePropChallengeConfigOptions,
  'config' | 'accountType'
> {
  config: PropChallengeConfig;
  evaluation: PropChallengePhaseEvaluation;
}

const activeFailureWrites = new Map<string, Promise<void>>();
const activeNoticeWrites = new Map<string, Promise<void>>();
const activeIdentityWrites = new Map<string, Promise<void>>();
const activeMaximumPayoutWrites = new Map<string, Promise<void>>();

export async function savePropChallengeConfig({
  accountPageService,
  accountName,
  accountId,
  config,
  accountType,
  createdDate,
  expectedConfig,
}: SavePropChallengeConfigOptions): Promise<void> {
  await accountPageService.updateAccountMetadata(
    accountName,
    {
      propChallenge: config,
      ...(accountType ? { accountType } : {}),
      ...(createdDate ? { createdDate } : {}),
    },
    expectedConfig ? { expectedPropChallenge: expectedConfig } : undefined
  );
  eventBus.publish('account:changed', {
    action: 'updated',
    accountId: accountId ?? accountName,
    accountName,
  });
}


export async function persistPropChallengeHardFailure({
  accountPageService,
  accountName,
  accountId,
  config,
  evaluation,
}: PersistPropChallengeHardFailureOptions): Promise<boolean> {
  const failedConfig = reconcileChallengeHardFailure(config, evaluation);
  if (failedConfig === config || !evaluation.failure) return false;

  const key = [
    accountId ?? accountName,
    evaluation.phaseId,
    evaluation.failure.ruleId,
    evaluation.failure.date.toISOString(),
  ].join(':');
  const activeWrite = activeFailureWrites.get(key);
  if (activeWrite) {
    await activeWrite;
    return true;
  }

  const write = savePropChallengeConfig({
    accountPageService,
    accountName,
    accountId,
    config: failedConfig,
    expectedConfig: config,
  });
  activeFailureWrites.set(key, write);
  try {
    await write;
  } finally {
    if (activeFailureWrites.get(key) === write) {
      activeFailureWrites.delete(key);
    }
  }
  return true;
}

function concludeChallengeAsPassed(
  config: PropChallengeConfig,
  at: Date
): PropChallengeConfig {
  if (config.status !== 'active') return config;
  const currentPhase = getCurrentPropChallengePhase(config);
  if (!currentPhase || currentPhase.status !== 'active') return config;
  const completedAt = at.toISOString();
  return {
    ...config,
    status: 'passed',
    evaluationOutcome: 'passed',
    currentPhaseId: currentPhase.id,
    phases: config.phases.map((phase) =>
      phase.id === currentPhase.id
        ? { ...phase, status: 'passed' as const, completedAt }
        : phase
    ),
  };
}


function effectivePayoutPolicyAt(
  phase: PropChallengePhase,
  at: Date
): PropChallengePayoutPolicy | undefined {
  return policyAt(phase, at).payoutPolicy;
}


export function reconcilePropChallengeMaximumPayoutOutcome(
  config: PropChallengeConfig,
  payoutEvaluation: PropChallengePayoutEvaluation | undefined,
  at: Date
): PropChallengeConfig {
  if (config.status !== 'active' || !payoutEvaluation) return config;
  const phase = getCurrentPropChallengePhase(config);
  if (!phase || phase.status !== 'active') return config;
  const policy = effectivePayoutPolicyAt(phase, at);
  if (!policy) return config;
  const { maximumPayouts, afterPayout } = policy;
  const outcome = afterPayout.maximumPayoutOutcome;
  if (
    maximumPayouts === undefined ||
    outcome === undefined ||
    payoutEvaluation.payoutCount < maximumPayouts
  ) {
    return config;
  }
  switch (outcome) {
    case 'promote_to_next_phase':
      return advancePhase(config, at);
    case 'conclude_account':
      return concludeChallengeAsPassed(config, at);
    case 'eligible_for_live_review':
      return config;
  }
}

interface PersistPropChallengeMaximumPayoutOutcomeOptions extends Omit<
  SavePropChallengeConfigOptions,
  'config' | 'accountType' | 'expectedConfig'
> {
  config: PropChallengeConfig;
  payoutEvaluation?: PropChallengePayoutEvaluation;
  now: Date;
  
  transactions?: readonly AccountTransaction[];
  
  stageAccountTypes?: Partial<Record<PropChallengeStage, string>>;
  availableAccountTypes?: readonly string[];
}



export function maximumPayoutTransitionInstant(
  config: PropChallengeConfig,
  transactions: readonly AccountTransaction[] | undefined,
  now: Date
): Date {
  const phase = getCurrentPropChallengePhase(config);
  if (!phase) return now;
  const owned: Date[] = [];
  for (const transaction of transactions ?? []) {
    if (transaction.type !== TransactionType.WITHDRAWAL) continue;
    if (
      resolvePropChallengePayoutPhaseAt(config, transaction.date)?.id !==
      phase.id
    )
      continue;
    owned.push(transaction.date);
  }
  if (owned.length === 0) return now;
  owned.sort((left, right) => left.getTime() - right.getTime());
  const candidates = owned.map((date) => date.getTime());
  for (const revision of phase.policyHistory ?? []) {
    const effectiveAt = Date.parse(revision.effectiveAt);
    if (Number.isFinite(effectiveAt) && effectiveAt <= now.getTime()) {
      candidates.push(effectiveAt);
    }
  }
  candidates.sort((left, right) => left - right);
  for (const candidate of candidates) {
    const at = new Date(candidate);
    const policy = effectivePayoutPolicyAt(phase, at);
    const cap = policy?.maximumPayouts;
    if (cap === undefined || cap <= 0) continue;
    if (policy?.afterPayout.maximumPayoutOutcome === undefined) continue;
    const reached = owned.filter((date) => date.getTime() <= candidate).length;
    if (reached >= cap) return at;
  }
  return owned[owned.length - 1];
}

export async function persistPropChallengeMaximumPayoutOutcome({
  accountPageService,
  accountName,
  accountId,
  config,
  payoutEvaluation,
  now,
  transactions,
  stageAccountTypes,
  availableAccountTypes,
}: PersistPropChallengeMaximumPayoutOutcomeOptions): Promise<boolean> {
  const transitionAt = maximumPayoutTransitionInstant(
    config,
    transactions,
    now
  );
  const next = reconcilePropChallengeMaximumPayoutOutcome(
    config,
    payoutEvaluation,
    transitionAt
  );
  if (next === config) return false;

  const phase = getCurrentPropChallengePhase(config);
  
  
  
  const advancedPhase =
    next.currentPhaseId !== config.currentPhaseId
      ? next.phases.find((candidate) => candidate.id === next.currentPhaseId)
      : undefined;
  const promotedAccountType =
    advancedPhase && availableAccountTypes
      ? resolveStageAccountType(
          stageAccountTypes,
          advancedPhase.stage,
          availableAccountTypes
        )
      : undefined;
  const key = [
    accountId ?? accountName,
    phase?.id ?? '',
    String(payoutEvaluation?.payoutCount ?? 0),
    (phase
      ? effectivePayoutPolicyAt(phase, now)?.afterPayout.maximumPayoutOutcome
      : undefined) ?? '',
  ].join(':');
  const activeWrite = activeMaximumPayoutWrites.get(key);
  if (activeWrite) {
    await activeWrite;
    return true;
  }

  const write = savePropChallengeConfig({
    accountPageService,
    accountName,
    accountId,
    config: next,
    expectedConfig: config,
    ...(promotedAccountType ? { accountType: promotedAccountType } : {}),
  });
  activeMaximumPayoutWrites.set(key, write);
  try {
    await write;
  } finally {
    if (activeMaximumPayoutWrites.get(key) === write) {
      activeMaximumPayoutWrites.delete(key);
    }
  }
  return true;
}

interface PersistPropChallengeNoticeStateOptions extends Omit<
  SavePropChallengeConfigOptions,
  'config' | 'accountType' | 'expectedConfig'
> {
  input: ReconcileNoticeStateInput;
}


export async function persistPropChallengeNoticeState({
  accountPageService,
  accountName,
  accountId,
  input,
}: PersistPropChallengeNoticeStateOptions): Promise<boolean> {
  const next = reconcilePropChallengeNoticeState(input);
  if (next === input.config) return false;

  
  
  
  const key = accountId ?? accountName;
  const activeWrite = activeNoticeWrites.get(key);
  if (activeWrite) {
    await activeWrite;
    return true;
  }

  const write = savePropChallengeConfig({
    accountPageService,
    accountName,
    accountId,
    config: next,
    expectedConfig: input.config,
  });
  activeNoticeWrites.set(key, write);
  try {
    await write;
  } finally {
    if (activeNoticeWrites.get(key) === write) activeNoticeWrites.delete(key);
  }
  return true;
}

interface PersistPropChallengeIdentityLearningOptions extends Omit<
  SavePropChallengeConfigOptions,
  'config' | 'accountType' | 'expectedConfig'
> {
  config: PropChallengeConfig;
  trades: readonly PropChallengeIdentityTrade[];
  now: Date;
}


export async function persistPropChallengeIdentityLearning({
  accountPageService,
  accountName,
  accountId,
  config,
  trades,
  now,
}: PersistPropChallengeIdentityLearningOptions): Promise<boolean> {
  const next = learnPropChallengeIdentities(config, trades, now);
  if (next === config) return false;

  const key = accountId ?? accountName;
  const activeWrite = activeIdentityWrites.get(key);
  if (activeWrite) {
    await activeWrite;
    return true;
  }

  const write = savePropChallengeConfig({
    accountPageService,
    accountName,
    accountId,
    config: next,
    expectedConfig: config,
  });
  activeIdentityWrites.set(key, write);
  try {
    await write;
  } finally {
    if (activeIdentityWrites.get(key) === write)
      activeIdentityWrites.delete(key);
  }
  return true;
}
