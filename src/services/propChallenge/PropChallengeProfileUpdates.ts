import { generateUUID } from '../../utils/uuid';
import {
  canPreserveProfileState,
  ruleDefinition,
  sameProfileContent,
} from './PropChallengePolicyHistory';
import type {
  PropChallengeConfig,
  PropChallengePolicyRevision,
  PropChallengeRule,
  PropFirmProfileSelection,
} from './types';

interface UpdateOptions {
  application?: PropChallengePolicyRevision['application'];
  config: PropChallengeConfig;
  selection: PropFirmProfileSelection;
  phaseId: string;
  
  sourcePhaseIndex: number;
  keepRuleIds: readonly string[];
  keepPayoutPolicy: boolean;
  effectiveAt: string;
  transition: NonNullable<PropChallengePolicyRevision['transition']>;
  now?: Date;
}

export function proposedProfileRules(
  config: PropChallengeConfig,
  phaseId: string,
  selection: PropFirmProfileSelection,
  sourcePhaseIndex: number,
  keepRuleIds: readonly string[]
): PropChallengeRule[] {
  const phase = config.phases.find((item) => item.id === phaseId);
  const source = selection.challenge.phases[sourcePhaseIndex];
  if (!phase || !source)
    throw new Error('Select an account phase and a source phase.');
  const keepRuleIdSet = new Set(keepRuleIds);
  const kept = phase.rules.filter((rule) => keepRuleIdSet.has(rule.id));
  if (kept.length !== keepRuleIdSet.size)
    throw new Error('A selected local rule no longer exists.');
  const keptKinds = new Set(kept.map((rule) => rule.kind));
  const available = phase.rules.filter((rule) => !keepRuleIdSet.has(rule.id));
  return structuredClone([
    ...kept,
    ...source.rules.flatMap((rule) => {
      if (keptKinds.has(rule.kind)) return [];
      const index = available.findIndex((existing) =>
        sameProfileContent(ruleDefinition(existing), { ...rule, enabled: true })
      );
      const existing = index < 0 ? undefined : available.splice(index, 1)[0];
      return [{ ...rule, id: existing?.id ?? generateUUID(), enabled: true }];
    }),
  ]);
}

export function applyProfilePhaseUpdate(
  options: UpdateOptions
): PropChallengeConfig {
  const {
    config,
    selection,
    phaseId,
    sourcePhaseIndex,
    effectiveAt,
    transition,
  } = options;
  const phase = config.phases.find((item) => item.id === phaseId);
  const source = selection.challenge.phases[sourcePhaseIndex];
  if (!phase || !source)
    throw new Error('Select an account phase and a source phase.');
  if (phase.status !== 'active' && phase.status !== 'pending')
    throw new Error('Completed phases cannot be upgraded.');
  if (
    phase.stage !== source.stage ||
    phase.startingBalance !== source.startingBalance
  ) {
    throw new Error(
      'An upgrade cannot change stage or starting balance. Choose the matching source phase.'
    );
  }
  if (
    config.profileRef &&
    (config.profileRef.firmId !== selection.firmId ||
      config.profileRef.challengeId !== selection.challenge.id ||
      (config.profileRef.source ?? 'catalog') !==
        (selection.source ?? 'catalog'))
  ) {
    throw new Error('An upgrade must use the same firm and challenge.');
  }
  if (
    config.profileRef &&
    selection.catalogVersion < config.profileRef.catalogVersion
  ) {
    throw new Error(
      'The selected profile is older than the account reference. Refresh the catalog before updating.'
    );
  }
  const rules = proposedProfileRules(
    config,
    phaseId,
    selection,
    sourcePhaseIndex,
    options.keepRuleIds
  );
  const payoutPolicy = options.keepPayoutPolicy
    ? phase.payoutPolicy
    : source.payoutPolicy;
  let history = phase.policyHistory;
  if (phase.status === 'active') {
    const time = Date.parse(effectiveAt);
    const prior = phase.policyHistory;
    const last = prior?.[prior.length - 1]?.effectiveAt ?? phase.startedAt;
    if (
      !last ||
      !Number.isFinite(time) ||
      time <= Date.parse(last) ||
      time > (options.now ?? new Date()).getTime()
    ) {
      throw new Error(
        'Effective date must follow the phase start and previous updates, and cannot be in the future.'
      );
    }
    if (transition.basis === 'preserve') {
      if (!canPreserveProfileState(phase, { rules, payoutPolicy }))
        throw new Error(
          'Changed drawdown or payout policies require confirmed transition terms.'
        );
    } else {
      if (!transition.source.trim())
        throw new Error('Enter the source of the custom transition terms.');
      const cycle = Date.parse(transition.payoutCycleStartedAt);
      if (
        !Number.isFinite(cycle) ||
        cycle < Date.parse(phase.startedAt ?? last) ||
        cycle > time
      ) {
        throw new Error(
          'Payout cycle start must be between the phase start and effective date.'
        );
      }
      const drawdowns = rules.filter((rule) => rule.kind === 'drawdown');
      const preserveDrawdowns =
        transition.drawdowns.length === 0 &&
        canPreserveProfileState({ rules: phase.rules }, { rules });
      if (
        !preserveDrawdowns &&
        transition.drawdowns.length !== drawdowns.length
      )
        throw new Error('Confirm the floor and peak for every drawdown rule.');
      for (const [index, rule] of drawdowns.entries()) {
        if (preserveDrawdowns) break;
        const state = transition.drawdowns[index];
        if (
          !Number.isFinite(state.floor) ||
          !Number.isFinite(state.peakBalance) ||
          state.peakBalance < phase.startingBalance ||
          state.floor > state.peakBalance ||
          (rule.kind === 'drawdown' &&
            rule.lockAtBalance !== undefined &&
            state.floor > rule.lockAtBalance)
        ) {
          throw new Error('Invalid drawdown transition floor or peak.');
        }
      }
    }
    history = [
      ...(phase.policyHistory ?? [
        {
          effectiveAt: phase.startedAt ?? last,
          rules: phase.rules,
          payoutPolicy: phase.payoutPolicy,
        },
      ]),
      {
        effectiveAt,
        rules,
        payoutPolicy,
        ...(options.application ? { application: options.application } : {}),
        transition:
          transition.basis === 'preserve'
            ? transition
            : {
                ...transition,
                drawdowns: transition.drawdowns.map((state, index) => ({
                  ...state,
                  ruleId: rules.filter((rule) => rule.kind === 'drawdown')[
                    index
                  ].id,
                })),
              },
      },
    ];
  }
  
  
  const dismissals = { ...config.profileUpdateDismissals };
  delete dismissals[phaseId];
  return structuredClone({
    ...config,
    profileUpdateDismissals: Object.keys(dismissals).length
      ? dismissals
      : undefined,
    profileRef: {
      firmId: selection.firmId,
      challengeId: selection.challenge.id,
      catalogVersion: selection.catalogVersion,
      verifiedAt: selection.verifiedAt,
      source: selection.source ?? 'catalog',
    },
    phases: config.phases.map((item) =>
      item.id === phaseId
        ? {
            ...item,
            rules,
            payoutPolicy,
            policyHistory: history?.map((revision) =>
              structuredClone(revision)
            ),
            profileSnapshot: source,
            profileApplication: options.application,
            profilePhaseIndex: sourcePhaseIndex,
          }
        : item
    ),
  });
}
