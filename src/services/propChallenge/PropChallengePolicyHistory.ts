import type {
  PropChallengePhase,
  PropChallengePolicyRevision,
  PropChallengeRule,
} from './types';

export function ruleDefinition({ id: _id, ...rule }: PropChallengeRule) {
  return rule;
}

export function canPreserveProfileState(
  before: Pick<PropChallengePolicyRevision, 'rules' | 'payoutPolicy'>,
  after: Pick<PropChallengePolicyRevision, 'rules' | 'payoutPolicy'>
): boolean {
  return (
    sameProfileContent(
      before.rules.filter((r) => r.kind === 'drawdown'),
      after.rules.filter((r) => r.kind === 'drawdown')
    ) && sameProfileContent(before.payoutPolicy, after.payoutPolicy)
  );
}

export function latestCustomTransition(
  phase: PropChallengePhase,
  at: string,
  ruleId?: string
) {
  return phase.policyHistory
    ?.slice()
    .reverse()
    .find(
      (revision) =>
        Date.parse(revision.effectiveAt) <= Date.parse(at) &&
        revision.transition?.basis === 'custom' &&
        (ruleId === undefined ||
          revision.transition.drawdowns.some(
            (state) => state.ruleId === ruleId
          ))
    );
}


export function policyAt(
  phase: PropChallengePhase,
  date: Date
): PropChallengePolicyRevision {
  const history = phase.policyHistory;
  if (!history?.length)
    return {
      effectiveAt: phase.startedAt ?? date.toISOString(),
      rules: phase.rules,
      payoutPolicy: phase.payoutPolicy,
    };
  let result = history[0];
  for (const revision of history) {
    if (Date.parse(revision.effectiveAt) > date.getTime()) break;
    result = revision;
  }
  return result;
}

export function sameProfileContent(left: unknown, right: unknown): boolean {
  return canonicalProfileContent(left) === canonicalProfileContent(right);
}

export function canonicalProfileContent(input: unknown): string {
  const canonical = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') {
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(value).sort()) {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (descriptor?.value !== undefined)
          result[key] = canonical(descriptor.value);
      }
      return result;
    }
    return value;
  };
  return JSON.stringify(canonical(input));
}
