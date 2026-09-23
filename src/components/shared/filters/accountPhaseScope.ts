

import type { AccountMetadata } from '../../../settings/types';
import type { PropChallengePhase } from '../../../services/propChallenge/types';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';
import type { AccountPhaseScope } from './types';

export interface ResolvedAccountPhaseWindow {
  account: string;
  phaseId: string;
  phaseName: string;
  lookupKey: string;
  start: number;
  end: number;
  identities: string[];
  foreignIdentities: string[];
}

export interface AccountPhaseOption {
  id: string;
  name: string;
  startedAt: string;
  completedAt?: string;
  status: 'pending' | 'active' | 'passed' | 'failed';
}

export interface AccountPhaseOptionGroup {
  account: string;
  phases: AccountPhaseOption[];
}

interface AccountPhasePluginLike {
  settings?: {
    account?: {
      accountMetadata?: Record<string, AccountMetadata>;
    };
  };
}

function parseTimestamp(value: unknown): number | undefined {
  if (value instanceof Date) {
    const timestamp = value.getTime();
    return Number.isNaN(timestamp) ? undefined : timestamp;
  }

  if (typeof value === 'string' && value.length > 0) {
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? undefined : timestamp;
  }

  return undefined;
}

function findAccountMetadata(
  accountName: string,
  accountMetadata: Record<string, AccountMetadata>
): { account: string; metadata: AccountMetadata } | undefined {
  const exact = accountMetadata[accountName];
  if (exact) {
    return { account: accountName, metadata: exact };
  }

  const lookupKey = normalizeAccountLookupKey(accountName);
  if (!lookupKey) {
    return undefined;
  }

  const accountKeys = Object.keys(accountMetadata);
  for (let i = 0; i < accountKeys.length; i++) {
    const account = accountKeys[i];
    if (normalizeAccountLookupKey(account) === lookupKey) {
      return { account, metadata: accountMetadata[account] };
    }
  }

  return undefined;
}

function phaseBrokerIdentities(phase: PropChallengePhase): string[] {
  return phase.brokerAccountIds ?? [];
}

function foreignBrokerIdentities(
  phase: PropChallengePhase,
  phases: readonly PropChallengePhase[]
): string[] {
  const own = new Set(phaseBrokerIdentities(phase));
  const foreign: string[] = [];
  const seen = new Set<string>();
  for (const other of phases) {
    if (other.id === phase.id) continue;
    for (const identity of phaseBrokerIdentities(other)) {
      if (own.has(identity) || seen.has(identity)) continue;
      seen.add(identity);
      foreign.push(identity);
    }
  }
  return foreign;
}


export function tradePhaseTimestamp(trade: object): number | undefined {
  return (
    parseTimestamp(Reflect.get(trade, 'settlementTime')) ??
    parseTimestamp(Reflect.get(trade, 'exitTime')) ??
    parseTimestamp(Reflect.get(trade, 'entryTime'))
  );
}



export function tradeMatchesAccountPhaseWindows(
  trade: object,
  lookupKeys: ReadonlySet<string>,
  brokerIdentity: string | undefined,
  windows: readonly ResolvedAccountPhaseWindow[]
): boolean {
  const timestamp = tradePhaseTimestamp(trade);
  for (const phaseWindow of windows) {
    if (!lookupKeys.has(phaseWindow.lookupKey)) continue;
    if (brokerIdentity && phaseWindow.identities.includes(brokerIdentity)) {
      return true;
    }
    if (
      brokerIdentity &&
      phaseWindow.foreignIdentities.includes(brokerIdentity)
    ) {
      continue;
    }
    if (
      timestamp !== undefined &&
      timestamp >= phaseWindow.start &&
      timestamp <= phaseWindow.end
    ) {
      return true;
    }
  }
  return false;
}

export function accountsRequiringCopiedRows(
  accounts: readonly string[] | undefined,
  scopes: readonly AccountPhaseScope[] | undefined
): string[] {
  const merged = accounts ? [...accounts] : [];
  if (!scopes || scopes.length === 0) {
    return merged;
  }

  const seen = new Set<string>();
  for (let i = 0; i < merged.length; i++) {
    const key = normalizeAccountLookupKey(merged[i]);
    if (key) seen.add(key);
  }
  for (let i = 0; i < scopes.length; i++) {
    const account = scopes[i].account;
    const key = normalizeAccountLookupKey(account);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(account);
  }
  return merged;
}

export function resolveAccountPhaseWindows(
  scopes: readonly AccountPhaseScope[] | undefined,
  accountMetadata: Record<string, AccountMetadata> | undefined,
  now: Date
): ResolvedAccountPhaseWindow[] {
  if (!scopes || scopes.length === 0 || !accountMetadata) {
    return [];
  }

  const resolved: ResolvedAccountPhaseWindow[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < scopes.length; i++) {
    const scope = scopes[i];
    const found = findAccountMetadata(scope.account, accountMetadata);
    if (!found) {
      continue;
    }

    const phases = found.metadata.propChallenge?.phases;
    if (!phases || phases.length === 0) {
      continue;
    }

    let phase: PropChallengePhase | undefined;
    for (let j = 0; j < phases.length; j++) {
      if (phases[j].id === scope.phaseId) {
        phase = phases[j];
        break;
      }
    }

    if (!phase || !phase.startedAt) {
      continue;
    }

    const start = parseTimestamp(phase.startedAt);
    if (start === undefined) {
      continue;
    }

    const end = phase.completedAt
      ? parseTimestamp(phase.completedAt)
      : now.getTime();
    if (end === undefined) {
      continue;
    }

    
    
    
    const phaseIndex = phases.indexOf(phase);
    const previousEnd =
      phaseIndex > 0
        ? parseTimestamp(phases[phaseIndex - 1].completedAt)
        : undefined;
    const windowStart =
      previousEnd !== undefined && previousEnd === start ? start + 1 : start;

    const lookupKey = normalizeAccountLookupKey(found.account);
    if (!lookupKey) {
      continue;
    }

    const dedupeKey = `${lookupKey}\0${phase.id}`;
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    resolved.push({
      account: found.account,
      phaseId: phase.id,
      phaseName: phase.name,
      lookupKey,
      start: windowStart,
      end,
      identities: phaseBrokerIdentities(phase),
      foreignIdentities: foreignBrokerIdentities(phase, phases),
    });
  }

  return resolved;
}

export function resolveAccountPhaseWindowsFromPlugin(
  scopes: readonly AccountPhaseScope[] | undefined,
  plugin: AccountPhasePluginLike | null | undefined,
  now: Date = new Date()
): ResolvedAccountPhaseWindow[] {
  return resolveAccountPhaseWindows(
    scopes,
    plugin?.settings?.account?.accountMetadata,
    now
  );
}

export function listAccountPhaseOptions(
  accountMetadata: Record<string, AccountMetadata> | undefined
): AccountPhaseOptionGroup[] {
  if (!accountMetadata) {
    return [];
  }

  const groups: AccountPhaseOptionGroup[] = [];
  const accountKeys = Object.keys(accountMetadata);

  for (let i = 0; i < accountKeys.length; i++) {
    const account = accountKeys[i];
    const phases = accountMetadata[account].propChallenge?.phases;
    if (!phases || phases.length === 0) {
      continue;
    }

    const startedPhases: AccountPhaseOption[] = [];
    for (let j = 0; j < phases.length; j++) {
      const phase = phases[j];
      if (!phase.startedAt) {
        continue;
      }

      const option: AccountPhaseOption = {
        id: phase.id,
        name: phase.name,
        startedAt: phase.startedAt,
        status: phase.status,
      };
      if (phase.completedAt) {
        option.completedAt = phase.completedAt;
      }
      startedPhases.push(option);
    }

    if (startedPhases.length > 0) {
      groups.push({ account, phases: startedPhases });
    }
  }

  return groups;
}
