import type {
  PropChallengeConfig,
  PropChallengeCost,
  PropChallengePhase,
} from '../../propChallenge/types';
import type { PropChallengePhaseEvaluation } from '../../propChallenge/PropChallengeRuleEngine';
import {
  agentContractManifest,
  parseAgentToolResult,
  type AgentToolContracts,
} from '../protocol/AgentContractRegistry';
import { ruleToWire } from './propChallengeRuleWire';
import type { AccountConfigurationSource } from './accountConfiguration';
import { accountRevision } from './accountConfiguration';
import { isBoundedString, isOpaqueId } from './configurationPrimitives';

type Configuration = Extract<
  AgentToolContracts['inspect_configuration']['result'],
  { status: 'ok' }
>['configuration'];
type ChallengesProjection = NonNullable<Configuration['prop_challenges']>;
type WireChallenge = ChallengesProjection['challenges'][number];
type WirePhase = WireChallenge['phases'][number];
type WireRule = WirePhase['rules'][number];
type WireCost = WireChallenge['costs'][number];
type WireProgress = NonNullable<WireChallenge['progress']>;

const MAX_CHALLENGES = 200;
const MAX_PHASES = 20;
const MAX_RULES = 50;
const MAX_COSTS = 200;
const MAX_AMOUNT = 1_000_000_000_000;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;


export interface PropChallengeSource {
  readonly account: AccountConfigurationSource;
  readonly config: PropChallengeConfig;
  readonly evaluation: PropChallengePhaseEvaluation | null;
}

class Unrepresentable extends Error {}

function finite(value: number): number {
  if (!Number.isFinite(value) || Math.abs(value) > MAX_AMOUNT) {
    throw new Unrepresentable();
  }
  return value;
}

function instant(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const time = Date.parse(value);
  if (Number.isNaN(time)) throw new Unrepresentable();
  return new Date(time).toISOString();
}

function id(value: string): string {
  if (!isOpaqueId(value)) throw new Unrepresentable();
  return value;
}

function wirePhase(phase: PropChallengePhase): WirePhase {
  if (!isBoundedString(phase.name, 120) || phase.rules.length > MAX_RULES) {
    throw new Unrepresentable();
  }
  const startedAt = instant(phase.startedAt);
  const completedAt = instant(phase.completedAt);
  return {
    phase_id: id(phase.id),
    name: phase.name,
    ...(phase.stage ? { stage: phase.stage } : {}),
    status: phase.status,
    starting_balance: finite(phase.startingBalance),
    ...(startedAt ? { started_at: startedAt } : {}),
    ...(completedAt ? { completed_at: completedAt } : {}),
    ...(phase.failure
      ? {
          failure: {
            rule_id: id(phase.failure.ruleId),
            rule_kind: phase.failure.ruleKind,
            breached_at: instant(phase.failure.breachedAt) ?? '',
          },
        }
      : {}),
    
    rules: phase.rules.map((rule) => ruleToWire(rule) as WireRule),
    has_payout_policy: phase.payoutPolicy !== undefined,
  };
}

function wireCost(cost: PropChallengeCost): WireCost {
  const note = cost.note?.trim();
  if (!DATE_PATTERN.test(cost.date) || !(cost.amount >= 0)) {
    throw new Unrepresentable();
  }
  return {
    cost_id: id(cost.id),
    date: cost.date,
    amount: finite(cost.amount),
    kind: cost.kind,
    ...(note && isBoundedString(note, 500) ? { note } : {}),
  };
}

function wireProgress(evaluation: PropChallengePhaseEvaluation): WireProgress {
  return {
    phase_id: id(evaluation.phaseId),
    status: evaluation.status,
    current_balance: finite(evaluation.currentBalance),
    target_reached: evaluation.targetReached,
    requirements_outstanding: [...new Set(evaluation.requirementsOutstanding)],
    rules: evaluation.rules.slice(0, MAX_RULES).map((rule) => ({
      rule_id: id(rule.ruleId),
      current: finite(rule.current),
      target: finite(rule.target),
      remaining: finite(rule.remaining),
      satisfied: rule.satisfied,
      breached: rule.breached,
    })),
  };
}

async function wireChallenge(
  source: PropChallengeSource
): Promise<WireChallenge> {
  const { config, account } = source;
  if (
    config.phases.length > MAX_PHASES ||
    (config.oneTimeCosts?.length ?? 0) > MAX_COSTS ||
    config.challengeName.length > 200
  ) {
    throw new Unrepresentable();
  }
  const firmName = config.firmName?.trim();
  const phases = config.phases.map(wirePhase);
  const currentPhaseId =
    config.currentPhaseId !== undefined &&
    phases.some((phase) => phase.phase_id === config.currentPhaseId)
      ? config.currentPhaseId
      : undefined;
  const progress = source.evaluation ? wireProgress(source.evaluation) : null;
  return {
    account_id: account.accountId,
    challenge_name: config.challengeName,
    ...(firmName && isBoundedString(firmName, 200)
      ? { firm_name: firmName }
      : {}),
    status: config.status,
    ...(config.evaluationOutcome
      ? { evaluation_outcome: config.evaluationOutcome }
      : {}),
    ...(currentPhaseId ? { current_phase_id: currentPhaseId } : {}),
    ...(config.purchaseDate && DATE_PATTERN.test(config.purchaseDate)
      ? { purchase_date: config.purchaseDate }
      : {}),
    ...(config.profileRef &&
    isOpaqueId(config.profileRef.firmId) &&
    isOpaqueId(config.profileRef.challengeId)
      ? {
          profile: {
            firm_id: config.profileRef.firmId,
            challenge_id: config.profileRef.challengeId,
          },
        }
      : {}),
    phases,
    costs: (config.oneTimeCosts ?? []).map(wireCost),
    ...(progress && phases.some((phase) => phase.phase_id === progress.phase_id)
      ? { progress }
      : {}),
    revision: await accountRevision(account.name, account.metadata),
  };
}


function fitsContract(challenge: WireChallenge): boolean {
  try {
    parseAgentToolResult('inspect_configuration', {
      status: 'ok',
      meta: {
        contract_version: agentContractManifest.version,
        contract_digest: agentContractManifest.digest,
        cached: false,
      },
      configuration: {
        prop_challenges: { challenges: [challenge], omitted_count: 0 },
      },
    });
    return true;
  } catch {
    return false;
  }
}


export async function projectPropChallengeConfiguration(
  sources: readonly PropChallengeSource[]
): Promise<ChallengesProjection> {
  const challenges: WireChallenge[] = [];
  let omitted = 0;
  for (const source of sources) {
    if (challenges.length >= MAX_CHALLENGES) {
      omitted += 1;
      continue;
    }
    try {
      const challenge = await wireChallenge(source);
      if (!fitsContract(challenge)) throw new Unrepresentable();
      challenges.push(challenge);
    } catch (error) {
      if (!(error instanceof Unrepresentable)) throw error;
      omitted += 1;
    }
  }
  return { challenges, omitted_count: omitted };
}
