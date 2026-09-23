

import type { evaluatePropChallengePhase } from './PropChallengeRuleEngine';
import type { PropChallengePayoutEvaluation } from './PropChallengePayoutEngine';
import { getCurrentPropChallengePhase } from './PropChallengeConfig';
import { canonicalProfileContent } from './PropChallengePolicyHistory';
import {
  listUnclaimedBrokerIdentities,
  type PropChallengeIdentityTrade,
} from './PropChallengeIdentityLearning';
import type {
  PropChallengeActiveNotice,
  PropChallengeConfig,
  PropChallengeFailure,
  PropChallengeNoticeKind,
  PropChallengeNoticeState,
  PropChallengePayoutPlan,
  PropChallengePhase,
} from './types';

type PhaseEvaluation = ReturnType<typeof evaluatePropChallengePhase>;

export interface PropChallengeNotice {
  fingerprint: string;
  kind: PropChallengeNoticeKind;
  phase: PropChallengePhase;
  
  nextPhase?: PropChallengePhase;
  failure?: PropChallengeFailure;
  
  amount?: number;
  
  suggestedAmount?: number;
  
  requirements?: string[];
  lostAt?: string;
  reachedAt?: string;
  breachAfterReached?: boolean;
  
  identity?: string;
  identityLabel?: string;
  firstTradeAt?: string;
  tradeCount?: number;
}

export interface DeriveNoticesInput {
  config: PropChallengeConfig;
  accountArchived: boolean;
  evaluation: PhaseEvaluation | null | undefined;
  payoutEvaluation?: PropChallengePayoutEvaluation;
  trades?: readonly PropChallengeIdentityTrade[];
  resolveIdentityLabel?: (identity: string) => string | undefined;
  
  accountName?: string;
  
  now?: Date;
}

function unmetPayoutRequirementKinds(
  requirements: PropChallengePayoutEvaluation['requirements']
): string[] {
  const kinds: string[] = [];
  for (const requirement of requirements) {
    if (!requirement.satisfied) kinds.push(requirement.kind);
  }
  return kinds;
}

const PRIORITY: Record<PropChallengeNoticeKind, number> = {
  phase_failed: 0,
  unknown_account: 1,
  evaluation_passed: 2,
  target_reached: 2,
  payout_available: 3,
  payout_lost: 4,
};

function propChallengeNoticeFingerprint(
  kind: PropChallengeNoticeKind,
  phaseId: string,
  key?: string | number
): string {
  return key === undefined
    ? `${kind}:${phaseId}`
    : `${kind}:${phaseId}:${String(key)}`;
}

function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}


export function suggestPropChallengePayoutAmount(
  plan: PropChallengePayoutPlan | undefined,
  payout: Pick<
    PropChallengePayoutEvaluation,
    'availableAmount' | 'maximumRequest'
  >
): number {
  const available = Math.max(0, payout.availableAmount);
  let suggested = available;
  if (plan?.withdrawal?.kind === 'percent')
    suggested = (available * plan.withdrawal.value) / 100;
  else if (plan?.withdrawal?.kind === 'amount')
    suggested = Math.min(available, plan.withdrawal.value);
  if (Number.isFinite(payout.maximumRequest) && payout.maximumRequest > 0)
    suggested = Math.min(suggested, payout.maximumRequest);
  return roundCents(Math.max(0, suggested));
}

function isDismissed(
  state: PropChallengeNoticeState | undefined,
  fingerprint: string
): boolean {
  return Boolean(state?.dismissed?.[fingerprint]);
}


export function derivePropChallengeNotices(
  input: DeriveNoticesInput
): PropChallengeNotice[] {
  const { config, accountArchived, evaluation, payoutEvaluation } = input;
  if (accountArchived) return [];
  const phase = getCurrentPropChallengePhase(config);
  if (!phase) return [];
  const state = config.notices;
  const notices: PropChallengeNotice[] = [];

  if (config.status === 'failed') {
    const failedPhase =
      config.phases.find((candidate) => candidate.status === 'failed') ?? phase;
    const failure = failedPhase.failure;
    const fingerprint = propChallengeNoticeFingerprint(
      'phase_failed',
      failedPhase.id,
      failure?.breachedAt ?? failedPhase.completedAt ?? ''
    );
    if (!isDismissed(state, fingerprint))
      notices.push({
        fingerprint,
        kind: 'phase_failed',
        phase: failedPhase,
        ...(failure ? { failure } : {}),
      });
    return notices;
  }

  if (config.status === 'active') {
    const unknownIndex = config.phases.findIndex(
      (candidate) => candidate.id === phase.id
    );
    const unknownNextPhase = config.phases[unknownIndex + 1];
    for (const unclaimed of listUnclaimedBrokerIdentities(
      config,
      input.trades ?? [],
      input.resolveIdentityLabel,
      input.accountName,
      input.now
    )) {
      const fingerprint = propChallengeNoticeFingerprint(
        'unknown_account',
        phase.id,
        unclaimed.identity
      );
      if (isDismissed(state, fingerprint)) continue;
      notices.push({
        fingerprint,
        kind: 'unknown_account',
        phase,
        identity: unclaimed.identity,
        identityLabel: unclaimed.identityLabel,
        firstTradeAt: unclaimed.firstTradeAt,
        tradeCount: unclaimed.tradeCount,
        ...(unknownNextPhase ? { nextPhase: unknownNextPhase } : {}),
      });
    }
  }

  if (
    config.status !== 'active' ||
    !evaluation ||
    evaluation.phaseId !== phase.id
  )
    return notices;

  const index = config.phases.findIndex(
    (candidate) => candidate.id === phase.id
  );
  const nextPhase = config.phases[index + 1];
  const offerAdvance =
    evaluation.status === 'passed' ||
    (evaluation.failureAfterTargetReached && Boolean(nextPhase));

  if (offerAdvance) {
    const kind: PropChallengeNoticeKind = nextPhase
      ? 'target_reached'
      : 'evaluation_passed';
    const fingerprint = propChallengeNoticeFingerprint(kind, phase.id);
    if (!isDismissed(state, fingerprint))
      notices.push({
        fingerprint,
        kind,
        phase,
        ...(nextPhase ? { nextPhase } : {}),
        ...(evaluation.targetReachedAt
          ? { reachedAt: evaluation.targetReachedAt.toISOString() }
          : {}),
        ...(evaluation.failureAfterTargetReached && nextPhase
          ? { breachAfterReached: true }
          : {}),
      });
  }

  if (payoutEvaluation) {
    if (
      payoutEvaluation.status === 'eligible' &&
      payoutEvaluation.availableAmount > 0 &&
      payoutEvaluation.availableAmount >=
        (config.payoutPlan?.notifyMinimumAmount ?? 0)
    ) {
      const fingerprint = propChallengeNoticeFingerprint(
        'payout_available',
        phase.id,
        payoutEvaluation.payoutCount
      );
      if (!isDismissed(state, fingerprint))
        notices.push({
          fingerprint,
          kind: 'payout_available',
          phase,
          amount: payoutEvaluation.availableAmount,
          suggestedAmount: suggestPropChallengePayoutAmount(
            config.payoutPlan,
            payoutEvaluation
          ),
        });
    }
    const lost = state?.payoutLost;
    if (
      lost &&
      payoutEvaluation.status === 'not_eligible' &&
      lost.phaseId === phase.id &&
      lost.payoutCount === payoutEvaluation.payoutCount
    ) {
      const fingerprint = propChallengeNoticeFingerprint(
        'payout_lost',
        phase.id,
        `${lost.payoutCount}:${lost.at}`
      );
      
      
      
      if (!isDismissed(state, fingerprint))
        notices.push({
          fingerprint,
          kind: 'payout_lost',
          phase,
          requirements: unmetPayoutRequirementKinds(
            payoutEvaluation.requirements
          ),
          lostAt: lost.at,
        });
    }
  }

  return notices.sort((a, b) => PRIORITY[a.kind] - PRIORITY[b.kind]);
}

export interface ReconcileNoticeStateInput extends DeriveNoticesInput {
  now: Date;
}

function pruneState(
  state: PropChallengeNoticeState
): PropChallengeNoticeState | undefined {
  const next: PropChallengeNoticeState = {};
  if (state.dismissed && Object.keys(state.dismissed).length)
    next.dismissed = state.dismissed;
  if (state.payoutObserved) next.payoutObserved = state.payoutObserved;
  if (state.payoutLost) next.payoutLost = state.payoutLost;
  if (state.active?.length) next.active = state.active;
  return Object.keys(next).length ? next : undefined;
}

function withNoticeState(
  config: PropChallengeConfig,
  state: PropChallengeNoticeState | undefined
): PropChallengeConfig {
  if (
    canonicalProfileContent(config.notices) === canonicalProfileContent(state)
  )
    return config;
  const rest: PropChallengeConfig = { ...config };
  delete rest.notices;
  return state ? { ...rest, notices: state } : rest;
}


export function reconcilePropChallengeNoticeState(
  input: ReconcileNoticeStateInput
): PropChallengeConfig {
  const { config, payoutEvaluation, now } = input;
  const phase = getCurrentPropChallengePhase(config);
  const phaseIds = new Set(config.phases.map((candidate) => candidate.id));
  const state: PropChallengeNoticeState = { ...(config.notices ?? {}) };

  if (state.dismissed) {
    const dismissed: Record<string, string> = {};
    for (const [fingerprint, at] of Object.entries(state.dismissed)) {
      const phaseId = fingerprint.split(':')[1];
      if (phaseId && phaseIds.has(phaseId)) dismissed[fingerprint] = at;
    }
    state.dismissed = dismissed;
  }

  if (
    phase &&
    payoutEvaluation &&
    config.status === 'active' &&
    !input.accountArchived
  ) {
    const previous = state.payoutObserved;
    const sameCycle =
      previous?.phaseId === phase.id &&
      previous.payoutCount === payoutEvaluation.payoutCount;
    if (
      sameCycle &&
      previous.status === 'eligible' &&
      payoutEvaluation.status === 'not_eligible'
    ) {
      state.payoutLost = {
        phaseId: phase.id,
        payoutCount: payoutEvaluation.payoutCount,
        at: now.toISOString(),
        requirements: unmetPayoutRequirementKinds(
          payoutEvaluation.requirements
        ),
      };
    } else if (
      payoutEvaluation.status === 'eligible' ||
      (state.payoutLost &&
        (state.payoutLost.phaseId !== phase.id ||
          state.payoutLost.payoutCount !== payoutEvaluation.payoutCount))
    ) {
      delete state.payoutLost;
    }
    if (!sameCycle || previous.status !== payoutEvaluation.status)
      state.payoutObserved = {
        phaseId: phase.id,
        payoutCount: payoutEvaluation.payoutCount,
        status: payoutEvaluation.status,
        at: now.toISOString(),
      };
  } else if (config.status !== 'active' || input.accountArchived) {
    delete state.payoutObserved;
    delete state.payoutLost;
  }

  const previousActive = new Map(
    (config.notices?.active ?? []).map((entry) => [entry.fingerprint, entry])
  );
  const active: PropChallengeActiveNotice[] = derivePropChallengeNotices({
    ...input,
    config: { ...config, notices: state },
  }).map((notice) => ({
    fingerprint: notice.fingerprint,
    kind: notice.kind,
    phaseId: notice.phase.id,
    detectedAt:
      previousActive.get(notice.fingerprint)?.detectedAt ?? now.toISOString(),
    ...(notice.amount !== undefined
      ? { amount: roundCents(notice.amount) }
      : {}),
    ...(notice.identity
      ? {
          identity: notice.identity,
          identityLabel: notice.identityLabel ?? notice.identity,
        }
      : {}),
  }));
  state.active = active;

  return withNoticeState(config, pruneState(state));
}


export function dismissPropChallengeNotice(
  config: PropChallengeConfig,
  fingerprint: string,
  now: Date
): PropChallengeConfig {
  const state: PropChallengeNoticeState = {
    ...(config.notices ?? {}),
    dismissed: {
      ...(config.notices?.dismissed ?? {}),
      [fingerprint]: now.toISOString(),
    },
    active: (config.notices?.active ?? []).filter(
      (entry) => entry.fingerprint !== fingerprint
    ),
  };
  return withNoticeState(config, pruneState(state));
}
