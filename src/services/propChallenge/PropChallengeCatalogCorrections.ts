import type { AccountTradeData } from '../accountPage/types';
import type { AccountTransaction } from '../account/types';
import { TransactionType } from '../account/types';
import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropChallengePolicyRevision,
  PropFirmCatalogCorrection,
  PropFirmProfileSelection,
} from './types';
import { profilePolicyHash } from './ProfileApplicability';
import {
  canonicalProfileContent,
  canPreserveProfileState,
  ruleDefinition,
  policyAt,
  sameProfileContent,
} from './PropChallengePolicyHistory';
import { evaluatePropChallengePhase } from './PropChallengeRuleEngine';
import { reconcileChallengeHardFailure } from './PropChallengeConfig';
import { generateUUID } from '../../utils/uuid';

export interface CorrectionMatch {
  blocked?: boolean;
  correction: PropFirmCatalogCorrection;
  phaseId: string;
  sourcePhaseIndex: number;
  periods: { from: string; until?: string }[];
}

function revisions(phase: PropChallengePhase): PropChallengePolicyRevision[] {
  return (
    phase.policyHistory ?? [
      {
        effectiveAt: phase.startedAt ?? '',
        rules: phase.rules,
        payoutPolicy: phase.payoutPolicy,
      },
    ]
  );
}

function intersection(
  revision: PropChallengePolicyRevision,
  next: PropChallengePolicyRevision | undefined,
  correction: PropFirmCatalogCorrection,
  phase: PropChallengePhase
) {
  const start = Math.max(
    Date.parse(revision.effectiveAt),
    correction.affectedFrom ? Date.parse(correction.affectedFrom) : -Infinity
  );
  const end = Math.min(
    next ? Date.parse(next.effectiveAt) : Infinity,
    correction.affectedUntil ? Date.parse(correction.affectedUntil) : Infinity,
    phase.completedAt ? Date.parse(phase.completedAt) + 1 : Infinity
  );
  return { start, end };
}

export async function findCatalogCorrections(
  config: PropChallengeConfig,
  selection: PropFirmProfileSelection
): Promise<CorrectionMatch[]> {
  const ref = config.profileRef;
  if (
    selection.source === 'personal' ||
    !ref ||
    (ref.source ?? 'catalog') !== 'catalog' ||
    ref.firmId !== selection.firmId ||
    ref.challengeId !== selection.challenge.id ||
    selection.catalogVersion < ref.catalogVersion
  )
    return [];
  const matches: CorrectionMatch[] = [];
  for (const phase of config.phases) {
    const index = phase.profilePhaseIndex;
    const source =
      index === undefined ? undefined : selection.challenge.phases[index];
    if (
      index === undefined ||
      !source ||
      source.stage !== phase.stage ||
      source.startingBalance !== phase.startingBalance ||
      !source.catalogCorrections?.length
    )
      continue;
    const history = revisions(phase);
    const catalogCorrections = source.catalogCorrections ?? [];
    const [hashes, targetHashes, snapshotHash] = await Promise.all([
      Promise.all(history.map((r) => profilePolicyHash({ ...phase, ...r }))),
      Promise.all(
        catalogCorrections.map((correction) =>
          profilePolicyHash({
            ...phase,
            ...correction.replacement,
          })
        )
      ),
      phase.profileSnapshot
        ? profilePolicyHash(phase.profileSnapshot)
        : undefined,
    ]);
    for (const [correctionIndex, correction] of catalogCorrections.entries()) {
      const fromPolicyHashes = new Set(correction.fromPolicyHashes);
      const target = targetHashes[correctionIndex];
      if (fromPolicyHashes.has(target)) continue;
      const periods: CorrectionMatch['periods'] = [];
      for (const [i, r] of history.entries()) {
        if (!fromPolicyHashes.has(hashes[i])) continue;
        if (phase.status === 'pending' && !phase.startedAt) {
          if (!correction.affectedFrom && !correction.affectedUntil)
            periods.push({ from: '' });
          continue;
        }
        const { start, end } = intersection(
          r,
          history[i + 1],
          correction,
          phase
        );
        if (Number.isFinite(start) && start < end)
          periods.push({
            from: new Date(start).toISOString(),
            ...(Number.isFinite(end)
              ? { until: new Date(end).toISOString() }
              : {}),
          });
      }
      if (periods.length)
        matches.push({
          correction,
          phaseId: phase.id,
          sourcePhaseIndex: index,
          periods,
        });
      else if (
        snapshotHash !== undefined &&
        (!phase.completedAt ||
          !correction.affectedFrom ||
          Date.parse(correction.affectedFrom) <=
            Date.parse(phase.completedAt)) &&
        (!phase.startedAt ||
          !correction.affectedUntil ||
          Date.parse(correction.affectedUntil) > Date.parse(phase.startedAt)) &&
        fromPolicyHashes.has(snapshotHash) &&
        !(config.correctionHistory ?? []).some(
          (a) =>
            a.before.id === phase.id &&
            sameProfileContent(a.correction, correction)
        )
      )
        matches.push({
          correction,
          phaseId: phase.id,
          sourcePhaseIndex: index,
          periods: [],
          blocked: true,
        });
    }
  }
  return matches;
}


export function correctionDataFingerprint(
  trades: readonly AccountTradeData[],
  transactions: readonly AccountTransaction[],
  cutoff?: string
): string {
  
  return canonicalProfileContent(
    JSON.parse(JSON.stringify({ trades, transactions, cutoff }))
  );
}

interface CorrectionPreviewInput {
  currencyCode: string;
  config: PropChallengeConfig;
  selection: PropFirmProfileSelection;
  phaseId: string;
  correctionId: string;
  trades: readonly AccountTradeData[];
  transactions: readonly AccountTransaction[];
  tradingDayCutoffTime?: string;
  now: Date;
}

export async function previewCatalogCorrection(input: CorrectionPreviewInput) {
  const { config, selection, trades, transactions, now } = input;
  if (input.currencyCode !== selection.challenge.currency)
    throw new Error('The correction currency does not match this account.');
  const matches = await findCatalogCorrections(config, selection);
  const match = matches.find(
    (m) => m.phaseId === input.phaseId && m.correction.id === input.correctionId
  );
  if (!match)
    throw new Error('This correction no longer matches the account history.');
  if (match.blocked)
    throw new Error(
      'Local overrides or missing historical policy evidence prevent automatic correction. Keep the current rules and review the affected history manually.'
    );
  const before = config.phases.find((p) => p.id === match.phaseId);
  if (!before) throw new Error('Account phase not found.');
  const correction = match.correction;
  const isCurrent = before.id === config.currentPhaseId;
  const recorded = before.failure;
  const failedPolicy = recorded
    ? policyAt(before, new Date(recorded.breachedAt))
    : undefined;
  const failedRule = failedPolicy?.rules.find((r) => r.id === recorded?.ruleId);
  const correctedRule =
    failedRule && failedPolicy
      ? correction.replacement.rules.filter((r) => r.kind === failedRule.kind)[
          failedPolicy.rules
            .filter((r) => r.kind === failedRule.kind)
            .findIndex((r) => r.id === failedRule.id)
        ]
      : undefined;
  const affectsFailure = Boolean(
    recorded &&
    failedPolicy &&
    failedRule &&
    correction.fromPolicyHashes.includes(
      await profilePolicyHash({ ...before, ...failedPolicy })
    ) &&
    (!correction.affectedFrom ||
      Date.parse(recorded.breachedAt) >= Date.parse(correction.affectedFrom)) &&
    (!correction.affectedUntil ||
      Date.parse(recorded.breachedAt) < Date.parse(correction.affectedUntil)) &&
    (!correctedRule ||
      !sameProfileContent(ruleDefinition(failedRule), {
        ...correctedRule,
        enabled: true,
      }))
  );
  const automaticFailure =
    isCurrent &&
    config.status === 'failed' &&
    before.status === 'failed' &&
    affectsFailure;
  const scopePhase = automaticFailure
    ? { ...before, completedAt: undefined }
    : before;
  const periods: CorrectionMatch['periods'] = [];
  const addedRuleIds = new Map<number, string>();
  for (const other of matches)
    if (
      other !== match &&
      other.phaseId === match.phaseId &&
      other.periods.some((a) =>
        match.periods.some(
          (b) =>
            (!a.until || !b.from || Date.parse(b.from) < Date.parse(a.until)) &&
            (!b.until || !a.from || Date.parse(a.from) < Date.parse(b.until))
        )
      )
    )
      throw new Error('Overlapping catalog corrections need publisher review.');
  const history = revisions(before);
  const corrected: PropChallengePolicyRevision[] = [];
  const changedRevisions = new Set<PropChallengePolicyRevision>();
  const fromPolicyHashes = new Set(correction.fromPolicyHashes);
  
  
  for (const [i, revision] of history.entries()) {
    const oldHash = await profilePolicyHash({ ...before, ...revision });
    const { start, end } = intersection(
      revision,
      history[i + 1],
      correction,
      scopePhase
    );
    const pending =
      before.status === 'pending' &&
      !before.startedAt &&
      !correction.affectedFrom &&
      !correction.affectedUntil;
    if (!fromPolicyHashes.has(oldHash) || (!pending && !(start < end))) {
      corrected.push(structuredClone(revision));
      continue;
    }
    const available = [...revision.rules];
    const rules = correction.replacement.rules.map((rule, position) => {
      let index = available.findIndex((old) =>
        sameProfileContent(ruleDefinition(old), { ...rule, enabled: true })
      );
      if (index < 0)
        index = available.findIndex((old) => old.kind === rule.kind);
      const old = index < 0 ? undefined : available.splice(index, 1)[0];
      const id = old?.id ?? addedRuleIds.get(position) ?? generateUUID();
      if (!old) addedRuleIds.set(position, id);
      return { ...rule, id, enabled: true };
    });
    const replacement = {
      rules,
      payoutPolicy: correction.replacement.payoutPolicy,
    };
    const aftermathChanged = !sameProfileContent(
      revision.payoutPolicy?.afterPayout,
      replacement.payoutPolicy?.afterPayout
    );
    const stateChanged =
      !canPreserveProfileState({ rules: revision.rules }, { rules }) ||
      !sameProfileContent(
        revision.payoutPolicy?.cycle,
        replacement.payoutPolicy?.cycle
      ) ||
      aftermathChanged;
    if (
      !pending &&
      ((stateChanged &&
        history.some((r) => r.transition?.basis === 'custom')) ||
        (aftermathChanged &&
          transactions.some(
            (t) =>
              t.type === TransactionType.WITHDRAWAL &&
              (!before.startedAt ||
                t.date.getTime() >= Date.parse(before.startedAt)) &&
              (!scopePhase.completedAt ||
                t.date.getTime() <= Date.parse(scopePhase.completedAt))
          )))
    )
      throw new Error(
        'This correction needs review of firm-confirmed transition or payout state before history can be recalculated.'
      );
    const begins = pending
      ? ''
      : start === Date.parse(revision.effectiveAt)
        ? revision.effectiveAt
        : new Date(start).toISOString();
    periods.push({
      from: begins,
      ...(Number.isFinite(end) ? { until: new Date(end).toISOString() } : {}),
    });
    if (!pending && start > Date.parse(revision.effectiveAt))
      corrected.push(structuredClone(revision));
    const changed: PropChallengePolicyRevision = {
      ...structuredClone(revision),
      ...replacement,
      effectiveAt: begins,
      application: undefined,
    };
    if (!pending && start > Date.parse(revision.effectiveAt))
      changed.transition = { basis: 'preserve' };
    corrected.push(changed);
    changedRevisions.add(changed);
    const nextEnd = history[i + 1]
      ? Date.parse(history[i + 1].effectiveAt)
      : Infinity;
    if (
      Number.isFinite(end) &&
      end < nextEnd &&
      (!scopePhase.completedAt || end <= Date.parse(scopePhase.completedAt))
    )
      corrected.push({
        ...structuredClone(revision),
        effectiveAt: new Date(end).toISOString(),
        transition: { basis: 'preserve' },
      });
  }
  if (
    corrected.some(
      (r) =>
        r.effectiveAt &&
        Date.parse(r.effectiveAt) > now.getTime() &&
        !history.some((old) => old.effectiveAt === r.effectiveAt)
    )
  )
    throw new Error(
      'A historical correction cannot introduce future policy boundaries. Publish planned rule changes separately.'
    );
  for (let i = 1; i < corrected.length; i++)
    if (
      corrected[i].transition?.basis === 'preserve' &&
      !canPreserveProfileState(corrected[i - 1], corrected[i])
    )
      throw new Error(
        'This historical boundary needs firm-confirmed transition state.'
      );
  const last = corrected[corrected.length - 1];
  const after: PropChallengePhase = {
    ...structuredClone(before),
    rules: last.rules,
    payoutPolicy: last.payoutPolicy,
    ...(before.policyHistory || corrected.length > 1
      ? { policyHistory: corrected }
      : {}),
    ...(changedRevisions.has(last) ? { profileApplication: undefined } : {}),
  };
  if (
    before.profileSnapshot &&
    correction.fromPolicyHashes.includes(
      await profilePolicyHash(before.profileSnapshot)
    ) &&
    changedRevisions.has(last)
  ) {
    after.profileSnapshot = {
      ...before.profileSnapshot,
      rules: correction.replacement.rules,
      payoutPolicy: correction.replacement.payoutPolicy,
    };
  }
  const evaluationPhase = automaticFailure
    ? {
        ...after,
        status: 'active' as const,
        completedAt: undefined,
        failure: undefined,
      }
    : after;
  const beforeEvaluation = evaluatePropChallengePhase({
    phase: before,
    config,
    trades,
    transactions,
    now,
    tradingDayCutoffTime: input.tradingDayCutoffTime,
  });
  
  
  
  
  
  const evaluationConfig: PropChallengeConfig = {
    ...config,
    phases: config.phases.map((p) =>
      p.id === before.id ? evaluationPhase : p
    ),
  };
  const evaluation = evaluatePropChallengePhase({
    phase: evaluationPhase,
    config: evaluationConfig,
    trades,
    transactions,
    now,
    tradingDayCutoffTime: input.tradingDayCutoffTime,
  });
  if (automaticFailure && !beforeEvaluation.failure)
    throw new Error(
      'The original breach cannot be reproduced from available history. Restore its trade data before recalculating this failure.'
    );
  let next: PropChallengeConfig = {
    ...structuredClone(config),
    phases: config.phases.map((p) =>
      p.id === before.id ? evaluationPhase : structuredClone(p)
    ),
  };
  if (automaticFailure)
    next = {
      ...next,
      status: 'active',
      ...(before.stage === 'evaluation'
        ? { evaluationOutcome: undefined }
        : {}),
    };
  if (isCurrent && next.status === 'active')
    next = reconcileChallengeHardFailure(next, evaluation);
  const finalPhase = next.phases.find((p) => p.id === before.id);
  if (!finalPhase) throw new Error('Corrected phase not found.');
  const source = {
    source: 'catalog' as const,
    firmId: selection.firmId,
    challengeId: selection.challenge.id,
    catalogVersion: selection.catalogVersion,
    verifiedAt: selection.verifiedAt,
  };
  next.profileRef = source;
  next.correctionHistory = [
    ...(config.correctionHistory ?? []),
    {
      id: generateUUID(),
      appliedAt: now.toISOString(),
      currencyCode: input.currencyCode,
      correction: structuredClone(correction),
      source,
      before: structuredClone(before),
      after: structuredClone(finalPhase),
      beforeStatus: config.status,
      afterStatus: next.status,
      evaluationStatus: evaluation.status,
    },
  ];
  const dismissals = { ...next.profileUpdateDismissals };
  delete dismissals[before.id];
  next.profileUpdateDismissals = Object.keys(dismissals).length
    ? dismissals
    : undefined;
  return {
    config: next,
    match: { ...match, periods },
    beforeEvaluation,
    evaluation,
    dataFingerprint: correctionDataFingerprint(
      trades,
      transactions,
      input.tradingDayCutoffTime
    ),
  };
}
