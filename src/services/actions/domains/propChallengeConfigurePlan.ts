
import { generateUUID } from '../../../utils/uuid';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import {
  isPropChallengeRuleComplete,
  setPropChallengePhaseStart,
  validatePhaseTimeline,
} from '../../propChallenge/PropChallengeConfig';
import { normalizePropChallengeConfig } from '../../propChallenge/normalization';
import { isExecutableRule } from '../../propChallenge/PropChallengeRuleReview';
import { ruleFromWire } from '../../agent/configuration/propChallengeRuleWire';
import { canonicalizeConfigurationValue } from '../../agent/configuration/configurationPrimitives';
import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropChallengeRule,
} from '../../propChallenge/types';
import { ActionPlanError } from '../ActionErrors';
import type { ActionInput } from '../ActionTypes';

type ChallengeInput = ActionInput<'prop_challenge.configure'>['challenge'];
type PhaseInput = ChallengeInput['phases'][number];

function sameJson(left: unknown, right: unknown): boolean {
  return (
    JSON.stringify(canonicalizeConfigurationValue(left)) ===
    JSON.stringify(canonicalizeConfigurationValue(right))
  );
}


function phaseRules(
  input: PhaseInput,
  existing: PropChallengePhase | undefined,
  field: string
): PropChallengeRule[] {
  const ruleIds = input.rules.flatMap((wire) =>
    wire.rule_id === undefined ? [] : [wire.rule_id]
  );
  if (new Set(ruleIds).size !== ruleIds.length) {
    throw new ActionPlanError('invalid_request', field);
  }
  return input.rules.map((wire) => {
    const ruleId = wire.rule_id;
    if (
      ruleId !== undefined &&
      !existing?.rules.some((rule) => rule.id === ruleId)
    ) {
      throw new ActionPlanError('not_found', field);
    }
    const rule = ruleFromWire(wire, ruleId ?? generateUUID());
    
    
    if (!rule || !isPropChallengeRuleComplete(rule)) {
      throw new ActionPlanError('invalid_request', field);
    }
    
    
    
    if (
      !isExecutableRule(rule) &&
      !existing?.rules.some(
        (archived) => archived.id === rule.id && sameJson(archived, rule)
      )
    ) {
      throw new ActionPlanError('unsupported_capability', field);
    }
    return rule;
  });
}

function phaseStart(value: string): string {
  const time = Date.parse(value);
  if (Number.isNaN(time)) {
    throw new ActionPlanError('invalid_request', 'challenge.phases');
  }
  return new Date(time).toISOString();
}


export function configuredChallenge(
  existing: PropChallengeConfig | undefined,
  input: ChallengeInput,
  createdDate: Date | string
): PropChallengeConfig {
  const field = 'challenge.phases';
  const byId = new Map(existing?.phases.map((phase) => [phase.id, phase]));
  
  
  const phaseIds = input.phases.flatMap((phase) =>
    phase.phase_id === undefined ? [] : [phase.phase_id]
  );
  if (new Set(phaseIds).size !== phaseIds.length) {
    throw new ActionPlanError('invalid_request', field);
  }
  const phases = input.phases.map((phaseInput, index): PropChallengePhase => {
    const old =
      phaseInput.phase_id === undefined
        ? undefined
        : byId.get(phaseInput.phase_id);
    if (phaseInput.phase_id !== undefined && !old) {
      throw new ActionPlanError('not_found', field);
    }
    const rules = phaseRules(phaseInput, old, field);
    if (old) {
      if (
        old.policyHistory?.length &&
        (old.name !== phaseInput.name ||
          old.stage !== phaseInput.stage ||
          old.startingBalance !== phaseInput.starting_balance ||
          !sameJson(old.rules, rules))
      ) {
        
        throw new ActionPlanError('unsupported_capability', field);
      }
      const kept: PropChallengePhase = {
        ...old,
        name: phaseInput.name,
        stage: phaseInput.stage,
        startingBalance: phaseInput.starting_balance,
        rules,
      };
      if (phaseInput.started_at === undefined) return kept;
      if (old.status === 'pending') {
        throw new ActionPlanError('invalid_request', field);
      }
      return setPropChallengePhaseStart(
        kept,
        phaseStart(phaseInput.started_at)
      );
    }
    const first = existing === undefined && index === 0;
    if (phaseInput.started_at !== undefined && !first) {
      throw new ActionPlanError('invalid_request', field);
    }
    const created = parseLocalDateSafe(
      createdDate instanceof Date ? createdDate : String(createdDate)
    );
    return {
      id: generateUUID(),
      name: phaseInput.name,
      stage: phaseInput.stage,
      status: first ? 'active' : 'pending',
      startingBalance: phaseInput.starting_balance,
      rules,
      ...(first
        ? {
            startedAt:
              phaseInput.started_at !== undefined
                ? phaseStart(phaseInput.started_at)
                : (created ?? new Date()).toISOString(),
          }
        : {}),
    };
  });

  for (const phase of existing?.phases ?? []) {
    if (
      !phases.some((kept) => kept.id === phase.id) &&
      (phase.status !== 'pending' || phase.policyHistory?.length)
    ) {
      throw new ActionPlanError('conflict', field);
    }
  }
  
  
  const keptOrder = phases.flatMap((phase) => {
    const index = existing?.phases.findIndex((old) => old.id === phase.id);
    return index === undefined || index < 0 ? [] : [index];
  });
  if (
    keptOrder.some((value, index) => index > 0 && value < keptOrder[index - 1])
  ) {
    throw new ActionPlanError('invalid_request', field);
  }
  const firstPending = phases.findIndex((phase) => phase.status === 'pending');
  if (
    firstPending >= 0 &&
    phases.slice(firstPending).some((phase) => phase.status !== 'pending')
  ) {
    throw new ActionPlanError('invalid_request', field);
  }

  const firmName =
    input.firm_name === undefined
      ? existing?.firmName
      : (input.firm_name ?? undefined);
  const purchaseDate = input.purchase_date ?? existing?.purchaseDate;
  const config: PropChallengeConfig = existing
    ? {
        ...existing,
        challengeName: input.challenge_name,
        firmName,
        purchaseDate,
        phases,
      }
    : {
        challengeName: input.challenge_name,
        ...(firmName ? { firmName } : {}),
        ...(purchaseDate ? { purchaseDate } : {}),
        status: 'active',
        currentPhaseId: phases[0].id,
        phases,
      };
  if (validatePhaseTimeline(config) !== undefined) {
    throw new ActionPlanError('invalid_request', field);
  }
  
  
  const loaded = normalizePropChallengeConfig(structuredClone(config));
  if (!loaded || !sameJson(config, loaded)) {
    throw new ActionPlanError('invalid_request', field);
  }
  return loaded;
}
