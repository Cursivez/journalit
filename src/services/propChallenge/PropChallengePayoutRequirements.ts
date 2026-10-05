import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropChallengePolicyRevision,
  PropChallengePayoutPolicy,
  PropChallengeRule,
  PropFirmProfilePhase,
} from './types';
import { isPropChallengeRuleComplete } from './PropChallengeConfig';
import {
  canPreserveProfileState,
  ruleDefinition,
  sameProfileContent,
} from './PropChallengePolicyHistory';
import type { PersonalPropFirmProfile } from './PersonalPropFirmProfiles';

type PolicyState = Pick<
  PropChallengePhase,
  'rules' | 'payoutPolicy' | 'profileSnapshot'
>;
type ProfileProvenance = Pick<
  NonNullable<PropChallengeConfig['profileRef']>,
  'source'
>;
type ProfitableDaysRule = Extract<
  PropChallengeRule,
  { kind: 'minimum_profitable_days' }
>;

function movableRule(
  state: PolicyState,
  profileRef?: ProfileProvenance
):
  | { rule: ProfitableDaysRule; payoutPolicy: PropChallengePayoutPolicy }
  | undefined {
  if (
    !state.payoutPolicy ||
    state.payoutPolicy.cycle.kind === 'qualifying_days' ||
    state.payoutPolicy.qualifyingDays ||
    state.rules.some((rule) => rule.enabled && rule.kind === 'profit_target')
  )
    return undefined;
  const rules = state.rules.filter(
    (rule): rule is ProfitableDaysRule =>
      rule.enabled && rule.kind === 'minimum_profitable_days'
  );
  if (rules.length !== 1) return undefined;
  const rule = rules[0];
  if (profileRef?.source !== 'personal') {
    if (profileRef && !state.profileSnapshot) return undefined;
    if (
      state.profileSnapshot?.rules.some((source) =>
        sameProfileContent(ruleDefinition(rule), { ...source, enabled: true })
      )
    )
      return undefined;
  }
  return { rule, payoutPolicy: state.payoutPolicy };
}


export function movePhaseProfitableDaysToPayoutPolicy(
  state: PolicyState,
  profileRef?: ProfileProvenance
): PolicyState {
  const candidate = movableRule(state, profileRef);
  if (!candidate) return state;
  return moveCandidate(state, candidate);
}

function moveCandidate(
  state: PolicyState,
  candidate: NonNullable<ReturnType<typeof movableRule>>
): PolicyState {
  const { rule, payoutPolicy } = candidate;
  return {
    rules: state.rules.filter((item) => item !== rule),
    payoutPolicy: {
      ...payoutPolicy,
      qualifyingDays: {
        days: rule.days,
        minimumDailyProfit: rule.minimumDailyProfit,
      },
    },
  };
}


export function migratePropChallengePayoutRequirements(
  config: PropChallengeConfig,
  personalProfiles: readonly PersonalPropFirmProfile[] = []
): PropChallengeConfig {
  let changed = false;
  const ref = config.profileRef;
  const phases = config.phases.map((phase) => {
    if (
      (phase.status !== 'active' && phase.status !== 'pending') ||
      (phase.stage !== 'sim_funded' && phase.stage !== 'live_funded')
    )
      return phase;
    const originalTemplate =
      ref?.source === 'personal'
        ? personalProfiles.find(
            (profile) =>
              profile.id === ref.firmId && profile.id === ref.challengeId
          )
        : undefined;
    const originalSourcePhase =
      phase.profilePhaseIndex === undefined
        ? undefined
        : originalTemplate?.challenge.phases[phase.profilePhaseIndex];
    const snapshot =
      phase.profileSnapshot &&
      originalSourcePhase &&
      sameProfileContent(phase.profileSnapshot, originalSourcePhase)
        ? migrateTemplatePhase(phase.profileSnapshot)
        : phase.profileSnapshot;
    const candidate = movableRule(phase, config.profileRef);
    if (!candidate || !isPropChallengeRuleComplete(candidate.rule)) {
      if (snapshot !== phase.profileSnapshot) {
        changed = true;
        return { ...phase, profileSnapshot: snapshot };
      }
      return phase;
    }
    const { rule } = candidate;
    const current = moveCandidate(phase, candidate);
    let history: PropChallengePolicyRevision[] | undefined;
    if (phase.policyHistory) {
      const latest = phase.policyHistory[phase.policyHistory.length - 1];
      if (
        !sameProfileContent(phase.rules, latest.rules) ||
        !sameProfileContent(phase.payoutPolicy, latest.payoutPolicy)
      )
        return phase;
      history = phase.policyHistory.map((revision) => {
        const candidate = movableRule(
          { ...revision, profileSnapshot: phase.profileSnapshot },
          config.profileRef
        );
        if (
          !candidate ||
          candidate.rule.id !== rule.id ||
          !isPropChallengeRuleComplete(candidate.rule)
        )
          return revision;
        return {
          ...revision,
          ...moveCandidate(revision, candidate),
        };
      });
      
      
      for (let index = 1; index < history.length; index++) {
        if (
          history[index].transition?.basis === 'preserve' &&
          !canPreserveProfileState(history[index - 1], history[index])
        )
          return phase;
      }
    }
    changed = true;
    return {
      ...phase,
      ...current,
      profileSnapshot: snapshot,
      ...(history ? { policyHistory: history } : {}),
    };
  });
  return changed ? { ...config, phases } : config;
}

function migrateTemplatePhase(
  phase: PropFirmProfilePhase
): PropFirmProfilePhase {
  if (phase.stage === 'evaluation') return phase;
  
  
  const state = {
    rules: phase.rules.map((rule, index) => ({
      ...rule,
      id: String(index),
      enabled: true,
    })),
    payoutPolicy: phase.payoutPolicy,
  };
  const candidate = movableRule(state, { source: 'personal' });
  if (!candidate || !isPropChallengeRuleComplete(candidate.rule)) return phase;
  const moved = moveCandidate(state, candidate);
  return {
    ...phase,
    payoutPolicy: moved.payoutPolicy,
    rules: moved.rules.map(({ id: _id, enabled: _enabled, ...rule }) => rule),
  };
}


export function migratePersonalProfilePayoutRequirements(
  profiles: PersonalPropFirmProfile[],
  now = new Date()
): PersonalPropFirmProfile[] {
  let changed = false;
  const result = profiles.map((profile) => {
    let profileChanged = false;
    const phases = profile.challenge.phases.map((phase) => {
      const migrated = migrateTemplatePhase(phase);
      if (migrated !== phase) profileChanged = true;
      return migrated;
    });
    if (!profileChanged) return profile;
    changed = true;
    return {
      ...profile,
      revision: profile.revision + 1,
      updatedAt: now.toISOString(),
      challenge: { ...profile.challenge, phases },
    };
  });
  return changed ? result : profiles;
}
