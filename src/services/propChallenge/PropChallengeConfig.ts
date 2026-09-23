import { t } from '../../lang/helpers';
import { generateUUID } from '../../utils/uuid';
import type {
  PropChallengeConfig,
  PropChallengeCost,
  PropChallengeFailure,
  PropChallengePhase,
  PropChallengePayoutPolicy,
  PropChallengeRule,
  PropFirmProfilePhase,
  PropFirmProfileRule,
  PropFirmProfileSelection,
} from './types';
import { DrawdownType, type ProfitTargetType } from '../account/types';
import type { evaluatePropChallengePhase } from './PropChallengeRuleEngine';
import { getTradeBrokerIdentity } from './tradeIdentity';

export type PropChallengeRuleKind = PropChallengeRule['kind'];

export function createDefaultPropChallengePayoutPolicy(): PropChallengePayoutPolicy {
  return {
    version: 1,
    source: 'manual',
    cycle: { kind: 'none' },
    availability: {
      kind: 'profit_above_starting_balance',
      requestPercent: 100,
    },
    minimumRequest: 0,
    maximumRequest: { kind: 'none' },
    profitSplit: { kind: 'fixed', percent: 100 },
    afterPayout: {
      balanceAction: 'deduct_request',
      drawdownAction: 'unchanged',
      resetCycle: true,
    },
  };
}

export function createPropChallengeRule(
  kind: PropChallengeRuleKind
): PropChallengeRule {
  const base = { id: generateUUID(), enabled: true };
  switch (kind) {
    case 'profit_target':
      return { ...base, kind, amount: 0, targetType: 'absolute' };
    case 'drawdown':
      return { ...base, kind, mode: 'static', amount: 0 };
    case 'daily_loss_limit':
      return { ...base, kind, amount: 0, breachAction: 'fail' };
    case 'daily_profit_cap':
      return { ...base, kind, amount: 0 };
    case 'live_review_daily_profit':
      return { ...base, kind, amount: 0 };
    case 'minimum_trading_days':
      return { ...base, kind, days: 0 };
    case 'minimum_profitable_days':
      return { ...base, kind, days: 0, minimumDailyProfit: 0 };
    case 'consistency':
      return { ...base, kind, maxBestDayPercent: 0 };
    case 'max_position_size':
      return { ...base, kind, maxContracts: 0 };
  }
}

export function createPropChallengePhase(
  name: string,
  status: PropChallengePhase['status'] = 'pending'
): PropChallengePhase {
  return {
    id: generateUUID(),
    name,
    stage: 'evaluation',
    status,
    startingBalance: 0,
    rules: [],
  };
}

interface DefaultPropChallengeConfigOptions {
  phaseNames?: readonly [string, string, string];
  now?: Date;
}

export function createDefaultPropChallengeConfig(
  options: DefaultPropChallengeConfigOptions = {}
): PropChallengeConfig {
  const phaseNames = options.phaseNames ?? ['Phase 1', 'Phase 2', 'Funded'];
  const first = {
    ...createPropChallengePhase(phaseNames[0], 'active'),
    startedAt: (options.now ?? new Date()).toISOString(),
  };
  const second = createPropChallengePhase(phaseNames[1], 'pending');
  const funded = {
    ...createPropChallengePhase(phaseNames[2], 'pending'),
    stage: 'sim_funded' as const,
  };
  return {
    challengeName: '',
    status: 'active',
    currentPhaseId: first.id,
    phases: [first, second, funded],
  };
}

interface ExistingAccountPropChallengeOptions {
  initialBalance: number;
  drawdownType: DrawdownType;
  drawdownAmount: number;
  hasProfitTarget: boolean;
  profitTarget: number;
  profitTargetType: ProfitTargetType;
  phaseName?: string;
  now?: Date;
}

export function buildLegacyAccountRules({
  drawdownType,
  drawdownAmount,
  hasProfitTarget,
  profitTarget,
  profitTargetType,
}: Pick<
  ExistingAccountPropChallengeOptions,
  | 'drawdownType'
  | 'drawdownAmount'
  | 'hasProfitTarget'
  | 'profitTarget'
  | 'profitTargetType'
>): PropChallengeRule[] {
  const rules: PropChallengeRule[] = [];
  if (
    drawdownAmount > 0 &&
    (drawdownType === DrawdownType.FIXED ||
      drawdownType === DrawdownType.EOD_TRAILING)
  ) {
    rules.push({
      id: generateUUID(),
      enabled: true,
      kind: 'drawdown',
      mode: drawdownType === DrawdownType.FIXED ? 'static' : 'eod_trailing',
      amount: drawdownAmount,
    });
  }
  if (hasProfitTarget && profitTarget > 0) {
    rules.push({
      id: generateUUID(),
      enabled: true,
      kind: 'profit_target',
      amount: profitTarget,
      targetType: profitTargetType,
    });
  }
  return rules;
}

export function createPropChallengeFromExistingAccount({
  initialBalance,
  drawdownType,
  drawdownAmount,
  hasProfitTarget,
  profitTarget,
  profitTargetType,
  phaseName = 'Phase 1',
  now = new Date(),
}: ExistingAccountPropChallengeOptions): PropChallengeConfig {
  const rules = buildLegacyAccountRules({
    drawdownType,
    drawdownAmount,
    hasProfitTarget,
    profitTarget,
    profitTargetType,
  });
  const phase = {
    ...createPropChallengePhase(phaseName, 'active'),
    stage: 'evaluation' as const,
    startingBalance: initialBalance,
    startedAt: now.toISOString(),
    rules,
  };
  return {
    challengeName: '',
    status: 'active',
    currentPhaseId: phase.id,
    phases: [phase],
  };
}

function createRuleFromProfile(rule: PropFirmProfileRule): PropChallengeRule {
  return { ...rule, id: generateUUID(), enabled: true };
}

export function buildPhaseFromProfilePhase(
  phase: PropFirmProfilePhase,
  index: number
): PropChallengePhase {
  
  
  const cloned = structuredClone(phase);
  return {
    id: generateUUID(),
    name: cloned.name,
    stage: cloned.stage,
    status: 'pending',
    startingBalance: cloned.startingBalance,
    rules: cloned.rules.map(createRuleFromProfile),
    profileSnapshot: structuredClone(cloned),
    profilePhaseIndex: index,
    ...(cloned.payoutPolicy ? { payoutPolicy: cloned.payoutPolicy } : {}),
  };
}

export function createConfigFromProfile(
  profile: PropFirmProfileSelection
): PropChallengeConfig {
  const startedAt = new Date().toISOString();
  const phases = profile.challenge.phases.map((phase, index) => ({
    ...buildPhaseFromProfilePhase(phase, index),
    status: index === 0 ? ('active' as const) : ('pending' as const),
    ...(index === 0 ? { startedAt } : {}),
  }));
  return {
    challengeName: profile.challenge.name,
    firmName: profile.firmName,
    profileRef: {
      firmId: profile.firmId,
      challengeId: profile.challenge.id,
      catalogVersion: profile.catalogVersion,
      verifiedAt: profile.verifiedAt,
      ...(profile.source ? { source: profile.source } : {}),
    },
    status: 'active',
    currentPhaseId: phases[0]?.id,
    phases,
  };
}

export function replacePropChallengeWithProfile(
  config: PropChallengeConfig,
  profile: PropFirmProfileSelection
): PropChallengeConfig {
  const replacement = createConfigFromProfile(profile);
  return config.oneTimeCosts
    ? { ...replacement, oneTimeCosts: config.oneTimeCosts }
    : replacement;
}

export function createPropChallengeCost(): PropChallengeCost {
  const now = new Date();
  const localDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  return {
    id: generateUUID(),
    kind: 'purchase',
    date: localDate,
    amount: 0,
  };
}


export function getCurrentPropChallengePhase(
  config: PropChallengeConfig
): PropChallengePhase | undefined {
  return (
    config.phases.find((phase) => phase.id === config.currentPhaseId) ??
    config.phases.find((phase) => phase.status === 'active') ??
    config.phases[0]
  );
}

function parsePhaseTimestamp(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : timestamp;
}


export function advancePhase(
  config: PropChallengeConfig,
  at: Date
): PropChallengeConfig {
  let currentIndex = config.phases.findIndex(
    (phase) => phase.id === config.currentPhaseId
  );
  if (currentIndex < 0) {
    currentIndex = config.phases.findIndex(
      (phase) => phase.status === 'active'
    );
  }
  if (config.status !== 'active' || currentIndex < 0) return config;
  const currentPhase = config.phases[currentIndex];
  const startedAt = parsePhaseTimestamp(currentPhase.startedAt);
  if (startedAt !== undefined && at.getTime() < startedAt) return config;
  const completedAt = at.toISOString();
  const nextPhase = config.phases[currentIndex + 1];
  const entersFundedStage =
    nextPhase?.stage === 'sim_funded' || nextPhase?.stage === 'live_funded';
  return {
    ...config,
    status: nextPhase ? 'active' : 'passed',
    evaluationOutcome:
      entersFundedStage || !nextPhase ? 'passed' : config.evaluationOutcome,
    currentPhaseId: nextPhase?.id ?? config.currentPhaseId,
    phases: config.phases.map((phase, index) => {
      if (index === currentIndex)
        return { ...phase, status: 'passed', completedAt };
      if (index === currentIndex + 1)
        
        
        
        
        
        return {
          ...setPropChallengePhaseStart(phase, completedAt),
          status: 'active',
          completedAt: undefined,
        };
      return phase;
    }),
  };
}


function parseAttributionTimestamp(value: unknown): number | undefined {
  if (value instanceof Date) {
    const timestamp = value.getTime();
    return Number.isNaN(timestamp) ? undefined : timestamp;
  }
  if (typeof value === 'string' && value.length > 0) {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? undefined : timestamp;
  }
  return undefined;
}

export function tradeAttributionTimestamp(trade: {
  settlementTime?: unknown;
  exitTime?: unknown;
  entryTime?: unknown;
}): number | undefined {
  return (
    parseAttributionTimestamp(trade.settlementTime) ??
    parseAttributionTimestamp(trade.exitTime) ??
    parseAttributionTimestamp(trade.entryTime)
  );
}

function findPhaseClaimingBrokerIdentity(
  phases: readonly PropChallengePhase[],
  identity: string
): PropChallengePhase | undefined {
  for (const phase of phases) {
    if (phase.brokerAccountIds?.includes(identity)) return phase;
  }
  return undefined;
}

function resolvePhaseByTimeWindow(
  phases: readonly PropChallengePhase[],
  time: number,
  now: number
): PropChallengePhase | undefined {
  if (Number.isNaN(time)) return undefined;
  for (const phase of phases) {
    const start = parsePhaseTimestamp(phase.startedAt);
    if (start === undefined) continue;
    const end = phase.completedAt
      ? parsePhaseTimestamp(phase.completedAt)
      : now;
    if (end === undefined) continue;
    if (time >= start && time <= end) return phase;
  }
  return undefined;
}

interface PropChallengeTradeIdentity {
  accountId?: unknown;
  canonicalAccountId?: unknown;
  canonicalAccountIdentity?: unknown;
  isCopiedTrade?: unknown;
  settlementTime?: unknown;
  exitTime?: unknown;
  entryTime?: unknown;
}


export function resolvePhaseForTrade(
  config: PropChallengeConfig,
  trade: PropChallengeTradeIdentity,
  now: Date
): PropChallengePhase | undefined {
  const identity = getTradeBrokerIdentity(trade);
  if (identity) {
    const claimed = findPhaseClaimingBrokerIdentity(config.phases, identity);
    if (claimed) return claimed;
  }
  const timestamp = tradeAttributionTimestamp(trade);
  if (timestamp === undefined) return undefined;
  return resolvePhaseByTimeWindow(config.phases, timestamp, now.getTime());
}


export function doesPhaseOwnTradeAt(
  phases: readonly PropChallengePhase[],
  phase: PropChallengePhase,
  trade: PropChallengeTradeIdentity,
  timestamp: Date,
  now: Date
): boolean {
  const identity = getTradeBrokerIdentity(trade);
  if (identity) {
    const claimed = findPhaseClaimingBrokerIdentity(phases, identity);
    if (claimed) return claimed.id === phase.id;
  }
  const time = timestamp.getTime();
  if (Number.isNaN(time)) return false;
  if (!phase.startedAt) {
    
    const end = phase.completedAt
      ? Date.parse(phase.completedAt)
      : now.getTime();
    return !Number.isNaN(end) && time <= end;
  }
  
  
  return resolvePhaseByTimeWindow(phases, time, now.getTime())?.id === phase.id;
}


export function resolvePropChallengePhaseAt(
  config: PropChallengeConfig,
  timestamp: Date,
  trade?: PropChallengeTradeIdentity
): PropChallengePhase | undefined {
  if (trade && getTradeBrokerIdentity(trade)) {
    return resolvePhaseForTrade(
      config,
      {
        accountId: trade.accountId,
        canonicalAccountId: trade.canonicalAccountId,
        canonicalAccountIdentity: trade.canonicalAccountIdentity,
        entryTime: timestamp,
      },
      new Date()
    );
  }
  return resolvePhaseByTimeWindow(
    config.phases,
    timestamp.getTime(),
    Date.now()
  );
}


function isFundedPropChallengePhase(phase: PropChallengePhase): boolean {
  if (phase.stage === 'sim_funded' || phase.stage === 'live_funded')
    return true;
  return phase.stage === undefined && phase.payoutPolicy !== undefined;
}


export function resolvePropChallengePayoutPhaseAt(
  config: PropChallengeConfig,
  date: Date
): PropChallengePhase | undefined {
  const phase = resolvePropChallengePhaseAt(config, date);
  return phase && isFundedPropChallengePhase(phase) ? phase : undefined;
}


export function validatePhaseTimeline(
  config: PropChallengeConfig
): string | undefined {
  for (let index = 0; index < config.phases.length; index += 1) {
    const phase = config.phases[index];
    const startedAt = parsePhaseTimestamp(phase.startedAt);
    const completedAt = parsePhaseTimestamp(phase.completedAt);
    if (
      startedAt !== undefined &&
      completedAt !== undefined &&
      completedAt < startedAt
    ) {
      return t('account.prop-challenge.timeline.completed-before-started', {
        phase: phase.name,
      });
    }
    
    
    
    
    const history = phase.policyHistory;
    if (history && history.length > 1) {
      for (let revision = 1; revision < history.length; revision += 1) {
        const previous = parsePhaseTimestamp(history[revision - 1].effectiveAt);
        const current = parsePhaseTimestamp(history[revision].effectiveAt);
        if (
          previous !== undefined &&
          current !== undefined &&
          current <= previous
        ) {
          return t('account.prop-challenge.timeline.policy-history-conflict', {
            phase: phase.name,
          });
        }
      }
    }
    const nextPhase = config.phases[index + 1];
    if (!nextPhase) continue;
    const nextStartedAt = parsePhaseTimestamp(nextPhase.startedAt);
    if (
      completedAt !== undefined &&
      nextStartedAt !== undefined &&
      completedAt > nextStartedAt
    ) {
      return t('account.prop-challenge.timeline.out-of-order', {
        phase: phase.name,
        next: nextPhase.name,
      });
    }
  }
  return undefined;
}

export function markChallengeFailed(
  config: PropChallengeConfig,
  now: Date,
  failure?: PropChallengeFailure
): PropChallengeConfig {
  if (config.status !== 'active') return config;
  const currentPhase =
    config.phases.find((phase) => phase.id === config.currentPhaseId) ??
    config.phases.find((phase) => phase.status === 'active') ??
    config.phases[0];
  if (!currentPhase) return config;
  const completedAt = now.toISOString();
  return {
    ...config,
    status: 'failed',
    evaluationOutcome:
      currentPhase.stage === 'evaluation' ? 'failed' : config.evaluationOutcome,
    currentPhaseId: currentPhase.id,
    phases: config.phases.map((phase) =>
      phase.id === currentPhase.id
        ? {
            ...phase,
            status: 'failed',
            completedAt,
            ...(failure ? { failure } : {}),
          }
        : phase
    ),
  };
}

type PropChallengePhaseEvaluation = ReturnType<
  typeof evaluatePropChallengePhase
>;


export function reconcileChallengeHardFailure(
  config: PropChallengeConfig,
  evaluation: PropChallengePhaseEvaluation
): PropChallengeConfig {
  if (
    config.status !== 'active' ||
    evaluation.status !== 'failed' ||
    !evaluation.failure
  ) {
    return config;
  }

  const currentPhase =
    config.phases.find((phase) => phase.id === config.currentPhaseId) ??
    config.phases.find((phase) => phase.status === 'active');
  if (
    !currentPhase ||
    currentPhase.status !== 'active' ||
    currentPhase.id !== evaluation.phaseId
  ) {
    return config;
  }

  if (evaluation.failureAfterTargetReached) {
    const currentIndex = config.phases.findIndex(
      (phase) => phase.id === currentPhase.id
    );
    if (config.phases[currentIndex + 1]) {
      return config;
    }
  }

  const breachedAt = evaluation.failure.date.toISOString();
  return markChallengeFailed(config, evaluation.failure.date, {
    ruleId: evaluation.failure.ruleId,
    ruleKind: evaluation.failure.ruleKind,
    breachedAt,
  });
}

export function reopenChallenge(
  config: PropChallengeConfig
): PropChallengeConfig {
  if (config.status === 'active') return config;
  const currentPhase =
    config.phases.find((phase) => phase.id === config.currentPhaseId) ??
    [...config.phases]
      .reverse()
      .find((phase) => phase.status === 'failed' || phase.status === 'passed');
  if (!currentPhase) return config;
  const reopened: PropChallengeConfig = {
    ...config,
    status: 'active',
    currentPhaseId: currentPhase.id,
    phases: config.phases.map((phase) => {
      if (phase.id !== currentPhase.id) return phase;
      const reopenedPhase = { ...phase };
      delete reopenedPhase.failure;
      return {
        ...reopenedPhase,
        status: 'active',
        completedAt: undefined,
      };
    }),
  };
  
  
  
  
  if (reopened.evaluationOutcome === 'failed') {
    delete reopened.evaluationOutcome;
  }
  return reopened;
}

export function addPropChallengeCost(
  config: PropChallengeConfig,
  cost: PropChallengeCost
): PropChallengeConfig {
  return { ...config, oneTimeCosts: [...(config.oneTimeCosts ?? []), cost] };
}

export function updatePropChallengeCost(
  config: PropChallengeConfig,
  cost: PropChallengeCost
): PropChallengeConfig {
  return {
    ...config,
    oneTimeCosts: (config.oneTimeCosts ?? []).map((item) =>
      item.id === cost.id ? cost : item
    ),
  };
}

export function removePropChallengeCost(
  config: PropChallengeConfig,
  costId: string
): PropChallengeConfig {
  return {
    ...config,
    oneTimeCosts: (config.oneTimeCosts ?? []).filter(
      (cost) => cost.id !== costId
    ),
  };
}

export function addPropChallengePhase(
  config: PropChallengeConfig,
  phase: PropChallengePhase
): PropChallengeConfig {
  return { ...config, phases: [...config.phases, phase] };
}

export function updatePropChallengePhase(
  config: PropChallengeConfig,
  phase: PropChallengePhase
): PropChallengeConfig {
  return {
    ...config,
    phases: config.phases.map((item) => (item.id === phase.id ? phase : item)),
  };
}


export function rebasePropChallengeStart(
  config: PropChallengeConfig,
  startedAt: Date
): PropChallengeConfig {
  const first = config.phases[0];
  if (!first?.startedAt) return config;
  const current = Date.parse(first.startedAt);
  if (Number.isNaN(current) || current <= startedAt.getTime()) return config;
  return updatePropChallengePhase(
    config,
    setPropChallengePhaseStart(first, startedAt.toISOString())
  );
}


export function setPropChallengePhaseStart(
  phase: PropChallengePhase,
  startedAt: string
): PropChallengePhase {
  const history = phase.policyHistory;
  return {
    ...phase,
    startedAt,
    ...(history?.length
      ? {
          policyHistory: [
            { ...history[0], effectiveAt: startedAt },
            ...history.slice(1),
          ],
        }
      : {}),
  };
}

export function removePropChallengePhase(
  config: PropChallengeConfig,
  phaseId: string,
  now: Date = new Date()
): PropChallengeConfig {
  const removedIndex = config.phases.findIndex((phase) => phase.id === phaseId);
  const phases = config.phases.filter((phase) => phase.id !== phaseId);
  if (config.currentPhaseId !== phaseId) return { ...config, phases };
  const nextCurrent = phases[removedIndex] ?? phases[removedIndex - 1];
  return {
    ...config,
    currentPhaseId: nextCurrent?.id,
    phases: phases.map((phase) => ({
      ...phase,
      status: phase.id === nextCurrent?.id ? 'active' : phase.status,
      startedAt:
        phase.id === nextCurrent?.id
          ? (phase.startedAt ?? now.toISOString())
          : phase.startedAt,
      completedAt: phase.id === nextCurrent?.id ? undefined : phase.completedAt,
    })),
  };
}


export function isPropChallengeRuleComplete(rule: PropChallengeRule): boolean {
  if (!rule.enabled) return true;
  switch (rule.kind) {
    case 'profit_target':
    case 'drawdown':
    case 'daily_loss_limit':
    case 'daily_profit_cap':
    case 'live_review_daily_profit':
      return Number.isFinite(rule.amount) && rule.amount > 0;
    case 'minimum_trading_days':
      return Number.isInteger(rule.days) && rule.days > 0;
    case 'minimum_profitable_days':
      return (
        Number.isInteger(rule.days) &&
        rule.days > 0 &&
        Number.isFinite(rule.minimumDailyProfit) &&
        rule.minimumDailyProfit > 0
      );
    case 'consistency':
      return (
        Number.isFinite(rule.maxBestDayPercent) &&
        rule.maxBestDayPercent > 0 &&
        rule.maxBestDayPercent <= 100
      );
    case 'max_position_size': {
      if ('maxContracts' in rule) {
        return Number.isFinite(rule.maxContracts) && rule.maxContracts > 0;
      }
      if (
        !Number.isFinite(rule.initialContracts) ||
        rule.initialContracts <= 0
      ) {
        return false;
      }
      
      
      
      
      if ('profitTiers' in rule) {
        if (rule.profitTiers.length === 0) return false;
        let previousProfit = 0;
        let previousContracts = rule.initialContracts;
        for (const tier of rule.profitTiers) {
          if (
            !Number.isFinite(tier.profit) ||
            tier.profit <= previousProfit ||
            !Number.isFinite(tier.maxContracts) ||
            tier.maxContracts <= previousContracts
          ) {
            return false;
          }
          previousProfit = tier.profit;
          previousContracts = tier.maxContracts;
        }
        return true;
      }
      return (
        Number.isFinite(rule.profitPerAdditionalContract) &&
        rule.profitPerAdditionalContract > 0 &&
        (rule.maximumContracts === undefined ||
          (Number.isFinite(rule.maximumContracts) &&
            rule.maximumContracts >= rule.initialContracts))
      );
    }
  }
}

export function setCurrentPropChallengePhase(
  config: PropChallengeConfig,
  phaseId: string,
  now: Date = new Date()
): PropChallengeConfig {
  return {
    ...config,
    currentPhaseId: phaseId,
    phases: config.phases.map((phase) => ({
      ...phase,
      status:
        phase.id === phaseId
          ? 'active'
          : phase.status === 'active'
            ? 'pending'
            : phase.status,
      startedAt:
        phase.id === phaseId
          ? (phase.startedAt ?? now.toISOString())
          : phase.startedAt,
      completedAt:
        phase.id === phaseId
          ? undefined
          : 
            
            
            
            
            phase.status === 'active' && phase.startedAt
            ? (phase.completedAt ?? now.toISOString())
            : phase.completedAt,
    })),
  };
}

export function addPropChallengeRule(
  phase: PropChallengePhase,
  rule: PropChallengeRule
): PropChallengePhase {
  return { ...phase, rules: [...phase.rules, rule] };
}

export function updatePropChallengeRule(
  phase: PropChallengePhase,
  rule: PropChallengeRule
): PropChallengePhase {
  return {
    ...phase,
    rules: phase.rules.map((item) => (item.id === rule.id ? rule : item)),
  };
}

export function removePropChallengeRule(
  phase: PropChallengePhase,
  ruleId: string
): PropChallengePhase {
  return { ...phase, rules: phase.rules.filter((rule) => rule.id !== ruleId) };
}
