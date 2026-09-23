import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropFirmProfilePhase,
  PropFirmProfileSelection,
  PropFirmPolicyChange,
} from './types';
import {
  canonicalProfileContent,
  ruleDefinition,
} from './PropChallengePolicyHistory';
import { formatLocalDateString } from '../../utils/dateUtils';

export function isPurchaseDate(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const hash = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
const https = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

export function parseApplicability(
  value: Record<string, unknown>
): Pick<PropFirmProfilePhase, 'purchaseEligibility' | 'policyChanges'> | null {
  const result: Pick<
    PropFirmProfilePhase,
    'purchaseEligibility' | 'policyChanges'
  > = {};
  if (value.purchaseEligibility !== undefined) {
    const e = value.purchaseEligibility;
    if (
      !record(e) ||
      !isPurchaseDate(e.afterDate) ||
      !https(e.sourceUrl) ||
      !isPurchaseDate(e.verifiedAt)
    )
      return null;
    result.purchaseEligibility = {
      afterDate: e.afterDate,
      sourceUrl: e.sourceUrl,
      verifiedAt: e.verifiedAt,
    };
  }
  if (value.policyChanges !== undefined) {
    if (!Array.isArray(value.policyChanges)) return null;
    const changes: PropFirmPolicyChange[] = [];
    for (const c of value.policyChanges) {
      if (
        !record(c) ||
        typeof c.id !== 'string' ||
        !c.id ||
        changes.some((other) => other.id === c.id) ||
        !Array.isArray(c.fromPolicyHashes) ||
        !c.fromPolicyHashes.length ||
        !c.fromPolicyHashes.every(hash) ||
        !hash(c.toPolicyHash) ||
        c.fromPolicyHashes.includes(c.toPolicyHash) ||
        !https(c.sourceUrl) ||
        !isPurchaseDate(c.verifiedAt)
      )
        return null;
      const base = {
        id: c.id,
        fromPolicyHashes: c.fromPolicyHashes,
        toPolicyHash: c.toPolicyHash,
        sourceUrl: c.sourceUrl,
        verifiedAt: c.verifiedAt,
      };
      if (
        c.kind === 'existing_accounts' &&
        typeof c.effectiveAt === 'string' &&
        /(?:Z|[+-]\d\d:\d\d)$/.test(c.effectiveAt) &&
        Number.isFinite(Date.parse(c.effectiveAt)) &&
        c.purchaseAfterDate === undefined
      )
        changes.push({ ...base, kind: c.kind, effectiveAt: c.effectiveAt });
      else if (
        c.kind === 'new_purchases' &&
        isPurchaseDate(c.purchaseAfterDate) &&
        c.effectiveAt === undefined
      )
        changes.push({
          ...base,
          kind: c.kind,
          purchaseAfterDate: c.purchaseAfterDate,
        });
      else return null;
    }
    result.policyChanges = changes;
  }
  return result;
}

export async function profilePolicyHash(
  phase: Pick<
    PropChallengePhase,
    'stage' | 'startingBalance' | 'payoutPolicy'
  > & {
    rules: readonly (
      | PropFirmProfilePhase['rules'][number]
      | PropChallengePhase['rules'][number]
    )[];
  }
): Promise<string> {
  const rules = phase.rules.map((rule) => {
    return 'id' in rule ? ruleDefinition(rule) : { ...rule, enabled: true };
  });
  const bytes = new TextEncoder().encode(
    canonicalProfileContent({
      stage: phase.stage,
      startingBalance: phase.startingBalance,
      rules,
      payoutPolicy: phase.payoutPolicy,
    })
  );
  return Array.from(
    new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),
    (byte) => byte.toString(16).padStart(2, '0')
  ).join('');
}

export type ProfileApplicability =
  | { kind: 'personal' | 'unknown' }
  | { kind: 'scheduled'; sourceUrl: string; effectiveAt: string }
  | {
      kind:
        | 'needs_purchase_date'
        | 'not_applicable'
        | 'uncertain'
        | 'initial_terms';
      sourceUrl: string;
      cutoffDate: string;
    }
  | {
      kind: 'published';
      change: Extract<PropFirmPolicyChange, { kind: 'existing_accounts' }>;
    };

function matchPurchase(
  purchaseDate: string | undefined,
  cutoffDate: string,
  sourceUrl: string,
  now: Date
): ProfileApplicability | undefined {
  if (!purchaseDate)
    return { kind: 'needs_purchase_date', sourceUrl, cutoffDate };
  
  
  
  if (
    !isPurchaseDate(purchaseDate) ||
    purchaseDate > formatLocalDateString(now) ||
    purchaseDate === cutoffDate
  )
    return { kind: 'uncertain', sourceUrl, cutoffDate };
  if (purchaseDate < cutoffDate)
    return { kind: 'not_applicable', sourceUrl, cutoffDate };
  return undefined;
}

export async function resolveProfileApplicability(
  config: PropChallengeConfig,
  phase: PropChallengePhase,
  selection: PropFirmProfileSelection,
  sourcePhaseIndex: number,
  now = new Date()
): Promise<ProfileApplicability> {
  if (selection.source === 'personal') return { kind: 'personal' };
  const target = selection.challenge.phases[sourcePhaseIndex];
  if (
    !target ||
    target.stage !== phase.stage ||
    target.startingBalance !== phase.startingBalance
  )
    return { kind: 'unknown' };
  if (target.purchaseEligibility) {
    const e = target.purchaseEligibility;
    const decision = matchPurchase(
      config.purchaseDate,
      e.afterDate,
      e.sourceUrl,
      now
    );
    if (decision) return decision;
  }
  const [from, to] = await Promise.all([
    profilePolicyHash(phase),
    profilePolicyHash(target),
  ]);
  const matches =
    target.policyChanges?.filter(
      (change) =>
        change.toPolicyHash === to && change.fromPolicyHashes.includes(from)
    ) ?? [];
  if (matches.length !== 1) return { kind: 'unknown' };
  const change = matches[0];
  if (change.kind === 'new_purchases')
    return (
      matchPurchase(
        config.purchaseDate,
        change.purchaseAfterDate,
        change.sourceUrl,
        now
      ) ?? {
        kind: 'initial_terms',
        sourceUrl: change.sourceUrl,
        cutoffDate: change.purchaseAfterDate,
      }
    );
  const last =
    phase.policyHistory?.[phase.policyHistory.length - 1]?.effectiveAt ??
    phase.startedAt;
  if (Date.parse(change.effectiveAt) > now.getTime())
    return {
      kind: 'scheduled',
      sourceUrl: change.sourceUrl,
      effectiveAt: change.effectiveAt,
    };
  if (
    phase.status === 'active' &&
    (!last || Date.parse(change.effectiveAt) <= Date.parse(last))
  )
    return {
      kind: 'initial_terms',
      sourceUrl: change.sourceUrl,
      cutoffDate: change.effectiveAt.slice(0, 10),
    };
  return { kind: 'published', change };
}
