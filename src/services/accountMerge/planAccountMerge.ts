import { t } from '../../lang/helpers';
import { generateUUID } from '../../utils/uuid';
import type { AccountMetadata, CopyTradingPeriod } from '../../settings/types';
import { normalizeAccountLookupKey } from '../trade/core/TradeAccountIdentity';
import {
  buildLegacyAccountRules,
  buildPhaseFromProfilePhase,
  resolvePhaseForTrade,
  tradeAttributionTimestamp,
} from '../propChallenge/PropChallengeConfig';
import { getTradeBrokerIdentity } from '../propChallenge/tradeIdentity';
import { normalizeLiveBalanceAdjustment } from '../account/liveBalanceAdjustment';
import { liveBalanceAdjustmentAnchor } from '../propChallenge/PropChallengeBalance';
import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropFirmProfilePhase,
} from '../propChallenge/types';
import type {
  AccountMergeNoteRewrite,
  AccountMergePlan,
  AccountMergePlanErrorCode,
  AccountMergePlanInput,
  AccountMergeSourceInput,
  AccountMergeWarning,
} from './types';

export class AccountMergePlanError extends Error {
  constructor(
    public readonly code: AccountMergePlanErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'AccountMergePlanError';
  }
}

export function planAccountMerge(
  input: AccountMergePlanInput
): AccountMergePlan {
  const { targetAccountName, now, profile } = input;
  const typedChallengeName = input.challengeName?.trim();
  const typedFirmName = input.firmName?.trim();
  const sources = input.sources;

  const sourceKeys = new Set<string>();
  for (const source of sources) {
    const key = normalizeAccountLookupKey(source.accountName);
    if (sourceKeys.has(key)) {
      throw new AccountMergePlanError(
        'duplicate_source',
        'Duplicate source account in merge plan.'
      );
    }
    sourceKeys.add(key);
  }

  const targetKey = normalizeAccountLookupKey(targetAccountName);
  const targetSourceIndex = sources.findIndex(
    (source) => normalizeAccountLookupKey(source.accountName) === targetKey
  );
  const targetIsSource = targetSourceIndex >= 0;
  if (sources.length === 0 || (sources.length === 1 && !targetIsSource)) {
    throw new AccountMergePlanError(
      'too_few_sources',
      'Account merge requires at least two source accounts.'
    );
  }
  if (!targetIsSource) {
    for (const name of input.existingAccountNames) {
      if (normalizeAccountLookupKey(name) === targetKey) {
        throw new AccountMergePlanError(
          'target_exists',
          'Target account already exists and is not one of the merge sources.'
        );
      }
    }
  }
  if (profile && sources.length > profile.challenge.phases.length) {
    throw new AccountMergePlanError(
      'profile_phase_mismatch',
      'Merge sources exceed the selected profile phase count.'
    );
  }

  const currency = resolveMergedCurrency(sources);
  if (profile && currency !== undefined) {
    const mergedCurrency: string = currency;
    if (profile.challenge.currency !== mergedCurrency) {
      throw new AccountMergePlanError(
        'profile_currency_mismatch',
        'Selected profile currency differs from the source accounts.'
      );
    }
  }
  const startedAtByPhase = resolveStartedAtByPhase(sources);
  assertStrictlyIncreasing(startedAtByPhase);

  const identityAssignment = assignBrokerIdentities(sources);
  const profileWarnings: AccountMergeWarning[] = [];
  const sourcePhases: PropChallengePhase[] = sources.map((source, index) => {
    const profilePhase = profile?.challenge.phases[index];
    const startingBalance =
      source.startingBalance ?? source.metadata.initialBalance;
    if (profilePhase && startingBalance !== profilePhase.startingBalance) {
      profileWarnings.push({
        kind: 'starting_balance_differs_from_profile',
        sourceAccountName: source.accountName,
        phaseName: source.phaseName ?? profilePhase.name,
        accountBalance: startingBalance,
        profileBalance: profilePhase.startingBalance,
      });
    }
    return buildPhase({
      source,
      isLast: index === sources.length - 1,
      startedAt: startedAtByPhase[index],
      nextStartedAt: startedAtByPhase[index + 1],
      brokerAccountIds: identityAssignment.idsBySource[index],
      now,
      profilePhase,
      profilePhaseIndex: index,
      convertsSingleAccount: sources.length === 1,
    });
  });
  const phases: PropChallengePhase[] = [...sourcePhases];
  for (let index = 0; index < sourcePhases.length; index += 1) {
    if (sourcePhases[index].status !== 'active') continue;
    if (index !== sourcePhases.length - 1) {
      throw new AccountMergePlanError(
        'multiple_active_phases',
        'Only the last selected account can still be active.'
      );
    }
  }
  
  
  
  
  
  const failedIndex = sourcePhases.findIndex(
    (phase) => phase.status === 'failed'
  );
  if (failedIndex >= 0 && failedIndex !== sourcePhases.length - 1) {
    throw new AccountMergePlanError(
      'phases_after_failed_source',
      'A failed account ends the challenge, so it must be the last one selected.'
    );
  }
  if (profile) {
    for (
      let index = sources.length;
      index < profile.challenge.phases.length;
      index += 1
    ) {
      phases.push(
        buildPhaseFromProfilePhase(profile.challenge.phases[index], index)
      );
    }
  }

  const currentPhaseIndex = resolveCurrentPhaseIndex(sourcePhases);
  const currentPhase = sourcePhases[currentPhaseIndex];
  const currentSource = sources[currentPhaseIndex];
  
  
  const lifecycle = resolveLifecycleAfterSources(phases, currentPhaseIndex);
  const propChallenge: PropChallengeConfig = {
    challengeName:
      typedChallengeName ||
      (profile ? profile.challenge.name : targetAccountName),
    ...(typedFirmName ? { firmName: typedFirmName } : {}),
    ...(profile
      ? {
          ...(typedFirmName ? {} : { firmName: profile.firmName }),
          profileRef: {
            firmId: profile.firmId,
            challengeId: profile.challenge.id,
            catalogVersion: profile.catalogVersion,
            verifiedAt: profile.verifiedAt,
            ...(profile.source ? { source: profile.source } : {}),
          },
        }
      : {}),
    status: currentPhase.status === 'failed' ? 'failed' : lifecycle.status,
    ...(lifecycle.evaluationOutcome
      ? { evaluationOutcome: lifecycle.evaluationOutcome }
      : {}),
    currentPhaseId: lifecycle.currentPhaseId,
    phases,
  };

  const copyTrading = filterCopyTradingPeriods(sources, sourceKeys, targetKey);
  const warnings: AccountMergeWarning[] = [
    ...identityAssignment.warnings,
    ...profileWarnings,
    ...collectOutOfWindowWarnings(sources, phases, propChallenge, now),
    ...copyTrading.warnings,
  ];

  const baseMetadata = targetIsSource
    ? sources[targetSourceIndex].metadata
    : sources[0].metadata;
  const targetMetadata = foldTargetMetadata({
    baseMetadata,
    sources,
    currentSource,
    targetAccountName,
    accountTypeForCurrentPhase: input.resolveAccountTypeForStage?.(
      phases.find((phase) => phase.id === lifecycle.currentPhaseId)?.stage
    ),
    currency,
    now,
    propChallenge,
    firstPhaseStartingBalance: phases[0].startingBalance,
    copyTradingPeriods: copyTrading.periods,
  });

  const sourcesToArchive: string[] = [];
  for (const source of sources) {
    if (normalizeAccountLookupKey(source.accountName) !== targetKey) {
      sourcesToArchive.push(source.accountName);
    }
  }

  const sourceMetadataFingerprints: Record<string, string> = {};
  for (const source of sources) {
    sourceMetadataFingerprints[normalizeAccountLookupKey(source.accountName)] =
      fingerprintMetadata(source.metadata);
  }

  return {
    targetAccountName,
    targetIsSource,
    targetMetadata,
    sourcesToArchive,
    phases,
    noteRewrites: collectNoteRewrites(sources, targetAccountName),
    warnings,
    sourceMetadataFingerprints,
  };
}

export function fingerprintMetadata(metadata: AccountMetadata): string {
  return stableStringify(metadata);
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value));
}

function sortKeysDeep(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    const items: unknown[] = [];
    for (const item of value) {
      items.push(sortKeysDeep(item));
    }
    return items;
  }
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    const entries = Object.entries(value).sort(([left], [right]) =>
      left < right ? -1 : left > right ? 1 : 0
    );
    for (const [key, entry] of entries) {
      if (entry === undefined) continue;
      sorted[key] = sortKeysDeep(entry);
    }
    return sorted;
  }
  return value;
}

function resolveMergedCurrency(
  sources: readonly AccountMergeSourceInput[]
): AccountMetadata['currency'] {
  let currency: AccountMetadata['currency'];
  for (const source of sources) {
    const value = source.metadata.currency;
    if (value === undefined) continue;
    if (currency !== undefined && currency !== value) {
      throw new AccountMergePlanError(
        'currency_mismatch',
        'Source accounts use different currencies.'
      );
    }
    currency = value;
  }
  return currency;
}

function resolveStartedAtByPhase(
  sources: readonly AccountMergeSourceInput[]
): string[] {
  const startedAtByPhase: string[] = [];
  for (const source of sources) {
    const startedAt =
      source.startedAt === undefined
        ? defaultPhaseStartedAt(source)
        : parseOverride(source.startedAt);
    if (
      source.completedAt !== undefined &&
      Date.parse(parseOverride(source.completedAt)) < Date.parse(startedAt)
    ) {
      throw new AccountMergePlanError(
        'invalid_override',
        'Phase completedAt override is earlier than startedAt.'
      );
    }
    startedAtByPhase.push(startedAt);
  }
  
  
  for (let index = 0; index < sources.length - 1; index += 1) {
    const override = sources[index].completedAt;
    if (
      override !== undefined &&
      Date.parse(parseOverride(override)) >
        Date.parse(startedAtByPhase[index + 1])
    ) {
      
      
      
      throw new AccountMergePlanError(
        'invalid_override',
        'Phase completedAt override is later than the next phase start.'
      );
    }
  }
  return startedAtByPhase;
}

function defaultPhaseStartedAt(source: AccountMergeSourceInput): string {
  let earliest = source.metadata.createdDate.getTime();
  for (const trade of source.trades) {
    const timestamp = tradeAttributionTimestamp(trade);
    if (timestamp !== undefined && timestamp < earliest) earliest = timestamp;
  }
  return new Date(earliest).toISOString();
}

function parseOverride(value: string): string {
  if (value.length === 0 || Number.isNaN(Date.parse(value))) {
    throw new AccountMergePlanError(
      'invalid_override',
      'Phase date override is not a valid ISO date.'
    );
  }
  return value;
}

function assertStrictlyIncreasing(startedAtByPhase: readonly string[]): void {
  for (let index = 1; index < startedAtByPhase.length; index += 1) {
    if (
      Date.parse(startedAtByPhase[index]) <=
      Date.parse(startedAtByPhase[index - 1])
    ) {
      throw new AccountMergePlanError(
        'timeline_not_monotonic',
        'Phase start times must be strictly increasing.'
      );
    }
  }
}

function assignBrokerIdentities(sources: readonly AccountMergeSourceInput[]): {
  idsBySource: string[][];
  warnings: AccountMergeWarning[];
} {
  const ownerByIdentity = new Map<string, number>();
  const sourceNamesByIdentity = new Map<string, string[]>();
  for (let index = 0; index < sources.length; index += 1) {
    const source = sources[index];
    const seen = new Set<string>();
    for (const trade of source.trades) {
      const identity = getTradeBrokerIdentity(trade);
      if (!identity || seen.has(identity)) continue;
      seen.add(identity);
      const names = sourceNamesByIdentity.get(identity);
      if (names) names.push(source.accountName);
      else sourceNamesByIdentity.set(identity, [source.accountName]);
      if (!ownerByIdentity.has(identity)) ownerByIdentity.set(identity, index);
    }
  }

  const idsBySource = sources.map(() => [] as string[]);
  for (const [identity, owner] of ownerByIdentity) {
    idsBySource[owner].push(identity);
  }
  for (const ids of idsBySource) ids.sort();

  const warnings: AccountMergeWarning[] = [];
  for (const [identity, sourceAccountNames] of sourceNamesByIdentity) {
    if (sourceAccountNames.length < 2) continue;
    const owner = ownerByIdentity.get(identity);
    if (owner === undefined) continue;
    warnings.push({
      kind: 'identity_claimed_by_multiple_sources',
      identity,
      sourceAccountNames,
      assignedTo: sources[owner].accountName,
    });
  }
  return { idsBySource, warnings };
}

const STAGE_NAME_KEYS = {
  evaluation: 'account.prop-challenge.stage.evaluation',
  sim_funded: 'account.prop-challenge.stage.sim-funded',
  live_funded: 'account.prop-challenge.stage.live-funded',
} as const;

function buildPhase({
  source,
  isLast,
  startedAt,
  nextStartedAt,
  brokerAccountIds,
  now,
  profilePhase,
  profilePhaseIndex,
  convertsSingleAccount,
}: {
  source: AccountMergeSourceInput;
  isLast: boolean;
  startedAt: string;
  nextStartedAt: string | undefined;
  brokerAccountIds: string[];
  now: Date;
  profilePhase: PropFirmProfilePhase | undefined;
  profilePhaseIndex: number;
  convertsSingleAccount: boolean;
}): PropChallengePhase {
  const status =
    source.status ?? (isLast ? ('active' as const) : ('passed' as const));
  const phase: PropChallengePhase = profilePhase
    ? {
        ...buildPhaseFromProfilePhase(profilePhase, profilePhaseIndex),
        
        ...(source.rules ? { rules: source.rules } : {}),
        name: source.phaseName ?? profilePhase.name,
        stage: source.stage ?? profilePhase.stage,
        status,
        startingBalance:
          source.startingBalance ?? source.metadata.initialBalance,
        legacyAccountName: source.accountName,
        startedAt,
      }
    : {
        id: generateUUID(),
        
        
        name:
          source.phaseName ??
          (convertsSingleAccount
            ? t(STAGE_NAME_KEYS[source.stage ?? 'evaluation'])
            : source.accountName),
        stage: source.stage ?? 'evaluation',
        status,
        startingBalance:
          source.startingBalance ?? source.metadata.initialBalance,
        rules:
          source.rules ??
          buildLegacyAccountRules({
            drawdownType: source.metadata.drawdownType,
            drawdownAmount: source.metadata.drawdownAmount,
            hasProfitTarget: source.metadata.hasProfitTarget,
            profitTarget: source.metadata.profitTarget,
            profitTargetType: source.metadata.profitTargetType,
          }),
        legacyAccountName: source.accountName,
        startedAt,
      };
  if (brokerAccountIds.length > 0) phase.brokerAccountIds = brokerAccountIds;
  const completedAt = resolveCompletedAt({
    override: source.completedAt,
    isLast,
    status,
    nextStartedAt,
    now,
  });
  if (completedAt) phase.completedAt = completedAt;
  const balanceAdjustment = normalizeLiveBalanceAdjustment(
    source.metadata.liveBalanceAdjustment
  );
  if (balanceAdjustment !== undefined)
    phase.balanceAdjustments = [
      {
        amount: balanceAdjustment,
        recordedAt: liveBalanceAdjustmentAnchor(
          source.metadata.lastUpdated,
          phase,
          now
        ),
      },
    ];
  return phase;
}

function resolveCompletedAt({
  override,
  isLast,
  status,
  nextStartedAt,
  now,
}: {
  override: string | undefined;
  isLast: boolean;
  status: PropChallengePhase['status'];
  nextStartedAt: string | undefined;
  now: Date;
}): string | undefined {
  
  
  
  
  const isActivePhase = isLast && status !== 'passed' && status !== 'failed';
  if (isActivePhase) return undefined;
  if (override !== undefined) return override;
  if (!isLast) return nextStartedAt;
  return now.toISOString();
}


function resolveLifecycleAfterSources(
  phases: PropChallengePhase[],
  currentPhaseIndex: number
): {
  status: PropChallengeConfig['status'];
  currentPhaseId: string;
  evaluationOutcome?: 'passed';
} {
  const current = phases[currentPhaseIndex];
  if (current.status !== 'passed') {
    return { status: 'active', currentPhaseId: current.id };
  }
  const next = phases[currentPhaseIndex + 1];
  if (!next) {
    return {
      status: 'passed',
      currentPhaseId: current.id,
      evaluationOutcome: 'passed',
    };
  }
  phases[currentPhaseIndex + 1] = {
    ...next,
    status: 'active',
    startedAt: current.completedAt ?? next.startedAt,
    completedAt: undefined,
  };
  return { status: 'active', currentPhaseId: next.id };
}

function resolveCurrentPhaseIndex(
  phases: readonly PropChallengePhase[]
): number {
  const activeIndex = phases.findIndex((phase) => phase.status === 'active');
  return activeIndex >= 0 ? activeIndex : phases.length - 1;
}

function collectOutOfWindowWarnings(
  sources: readonly AccountMergeSourceInput[],
  phases: readonly PropChallengePhase[],
  config: PropChallengeConfig,
  now: Date
): AccountMergeWarning[] {
  const warnings: AccountMergeWarning[] = [];
  for (let index = 0; index < sources.length; index += 1) {
    const source = sources[index];
    const sourcePhase = phases[index];
    for (const trade of source.trades) {
      if (getTradeBrokerIdentity(trade)) continue;
      const attributed = resolvePhaseForTrade(config, trade, now);
      if (attributed?.id === sourcePhase.id) continue;
      
      
      
      
      
      warnings.push({
        kind: 'trade_outside_phase_window',
        path: trade.path,
        sourceAccountName: source.accountName,
        ...(attributed ? { attributedPhaseId: attributed.id } : {}),
      });
    }
  }
  return warnings;
}

function filterCopyTradingPeriods(
  sources: readonly AccountMergeSourceInput[],
  sourceKeys: ReadonlySet<string>,
  targetKey: string
): {
  periods: CopyTradingPeriod[] | undefined;
  warnings: AccountMergeWarning[];
} {
  const warnings: AccountMergeWarning[] = [];
  const periods: CopyTradingPeriod[] = [];
  for (const source of sources) {
    const list = source.metadata.copyTradingPeriods;
    if (!list) continue;
    for (const period of list) {
      const baseKey = normalizeAccountLookupKey(period.baseAccount);
      if (sourceKeys.has(baseKey) || baseKey === targetKey) {
        warnings.push({
          kind: 'copy_trading_period_dropped',
          sourceAccountName: source.accountName,
          baseAccount: period.baseAccount,
          startDate: period.startDate.toISOString(),
        });
        continue;
      }
      periods.push(period);
    }
  }
  if (periods.length === 0) return { periods: undefined, warnings };
  periods.sort(
    (left, right) => left.startDate.getTime() - right.startDate.getTime()
  );
  assertCopyTradingPeriodsDoNotOverlap(periods);
  return { periods, warnings };
}


function assertCopyTradingPeriodsDoNotOverlap(
  periods: readonly CopyTradingPeriod[]
): void {
  for (let index = 1; index < periods.length; index += 1) {
    const previous = periods[index - 1];
    const nextStart = copyTradingDayTime(periods[index].startDate);
    const previousEnd = previous.endDate
      ? copyTradingDayTime(previous.endDate)
      : Number.POSITIVE_INFINITY;
    if (nextStart <= previousEnd) {
      throw new AccountMergePlanError(
        'copy_trading_overlap',
        'Merged copy-trading periods overlap.'
      );
    }
  }
}

function copyTradingDayTime(value: Date): number {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate()
  ).getTime();
}

function collectNoteRewrites(
  sources: readonly AccountMergeSourceInput[],
  targetAccountName: string
): AccountMergeNoteRewrite[] {
  const sourceKeys = new Set(
    sources.map((source) => normalizeAccountLookupKey(source.accountName))
  );
  const seenPaths = new Set<string>();
  const rewrites: AccountMergeNoteRewrite[] = [];
  for (const source of sources) {
    for (const trade of source.trades) {
      if (seenPaths.has(trade.path)) continue;
      const nextAccount = rewriteAccountList(
        trade.account,
        sourceKeys,
        targetAccountName
      );
      if (sameAccountList(trade.account, nextAccount)) continue;
      seenPaths.add(trade.path);
      rewrites.push({
        path: trade.path,
        previousAccount: [...trade.account],
        nextAccount,
      });
    }
  }
  return rewrites;
}

export function rewriteAccountList(
  previous: readonly string[],
  sourceKeys: ReadonlySet<string>,
  targetAccountName: string
): string[] {
  const next: string[] = [];
  const seen = new Set<string>();
  for (const value of previous) {
    const lookupKey = normalizeAccountLookupKey(value);
    const rewritten = sourceKeys.has(lookupKey) ? targetAccountName : value;
    const rewrittenKey = normalizeAccountLookupKey(rewritten);
    if (seen.has(rewrittenKey)) continue;
    seen.add(rewrittenKey);
    next.push(rewritten);
  }
  return next;
}

function sameAccountList(
  left: readonly string[],
  right: readonly string[]
): boolean {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

function foldTargetMetadata({
  baseMetadata,
  sources,
  currentSource,
  targetAccountName,
  accountTypeForCurrentPhase,
  currency,
  now,
  propChallenge,
  firstPhaseStartingBalance,
  copyTradingPeriods,
}: {
  baseMetadata: AccountMetadata;
  sources: readonly AccountMergeSourceInput[];
  currentSource: AccountMergeSourceInput;
  targetAccountName: string;
  accountTypeForCurrentPhase: string | undefined;
  currency: AccountMetadata['currency'];
  now: Date;
  propChallenge: PropChallengeConfig;
  firstPhaseStartingBalance: number;
  copyTradingPeriods: CopyTradingPeriod[] | undefined;
}): AccountMetadata {
  const targetMetadata: AccountMetadata = {
    ...baseMetadata,
    name: targetAccountName,
    createdDate: earliestCreatedDate(sources),
    initialBalance: firstPhaseStartingBalance,
    accountType:
      accountTypeForCurrentPhase ?? currentSource.metadata.accountType,
    drawdownType: currentSource.metadata.drawdownType,
    drawdownAmount: currentSource.metadata.drawdownAmount,
    hasProfitTarget: currentSource.metadata.hasProfitTarget,
    profitTarget: currentSource.metadata.profitTarget,
    profitTargetType: currentSource.metadata.profitTargetType,
    monthlyCost: currentSource.metadata.monthlyCost,
    lastUpdated: new Date(now.getTime()),
    propChallenge,
  };
  delete targetMetadata.mergedInto;

  if (currentSource.metadata.profitTargetDate !== undefined) {
    targetMetadata.profitTargetDate = currentSource.metadata.profitTargetDate;
  } else {
    delete targetMetadata.profitTargetDate;
  }

  delete targetMetadata.liveBalanceAdjustment;

  const manualTransactions = concatSortedByDate(
    sources,
    (metadata) => metadata.manualTransactions,
    (item) => item.date
  );
  if (manualTransactions)
    targetMetadata.manualTransactions = manualTransactions;
  else delete targetMetadata.manualTransactions;

  const manualDrawdownSnapshots = concatSortedByDate(
    sources,
    (metadata) => metadata.manualDrawdownSnapshots,
    (item) => item.date
  );
  if (manualDrawdownSnapshots) {
    targetMetadata.manualDrawdownSnapshots = manualDrawdownSnapshots;
  } else {
    delete targetMetadata.manualDrawdownSnapshots;
  }

  if (copyTradingPeriods) {
    targetMetadata.copyTradingPeriods = copyTradingPeriods;
  } else {
    delete targetMetadata.copyTradingPeriods;
  }

  if (currency !== undefined) targetMetadata.currency = currency;
  else delete targetMetadata.currency;

  return targetMetadata;
}

function earliestCreatedDate(
  sources: readonly AccountMergeSourceInput[]
): Date {
  let earliest = sources[0].metadata.createdDate.getTime();
  for (const source of sources) {
    const created = source.metadata.createdDate.getTime();
    if (created < earliest) earliest = created;
  }
  return new Date(earliest);
}

function concatSortedByDate<T>(
  sources: readonly AccountMergeSourceInput[],
  pick: (metadata: AccountMetadata) => T[] | undefined,
  getDate: (item: T) => Date
): T[] | undefined {
  const items: T[] = [];
  for (const source of sources) {
    const list = pick(source.metadata);
    if (!list) continue;
    for (const item of list) items.push(item);
  }
  if (items.length === 0) return undefined;
  return items.sort(
    (left, right) => getDate(left).getTime() - getDate(right).getTime()
  );
}
