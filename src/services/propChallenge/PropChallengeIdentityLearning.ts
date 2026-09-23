

import { resolvePhaseForTrade } from './PropChallengeConfig';
import type { PropChallengeConfig, PropChallengePhase } from './types';
import { getTradeBrokerIdentity } from './tradeIdentity';

export interface PropChallengeIdentityTrade {
  accountId?: unknown;
  canonicalAccountId?: unknown;
  canonicalAccountIdentity?: unknown;
  isCopiedTrade?: unknown;
  canonicalAccountDisplayName?: unknown;
  settlementTime?: unknown;
  exitTime?: unknown;
  entryTime?: unknown;
}

interface UnclaimedBrokerIdentity {
  identity: string;
  identityLabel: string;
  firstTradeAt: string;
  tradeCount: number;
}

interface IdentityStats {
  tradeCount: number;
  firstTrade: PropChallengeIdentityTrade;
  firstTradeAt?: Date;
  displayName?: string;
  
  trades: PropChallengeIdentityTrade[];
}

function attributionDate(trade: PropChallengeIdentityTrade): Date | undefined {
  const values = [trade.settlementTime, trade.exitTime, trade.entryTime];
  for (const value of values) {
    if (value instanceof Date) {
      const time = value.getTime();
      if (!Number.isNaN(time)) return value;
      continue;
    }
    if (typeof value === 'string' && value.length > 0) {
      const time = Date.parse(value);
      if (!Number.isNaN(time)) return new Date(time);
    }
  }
  return undefined;
}

function tradeDisplayName(
  trade: PropChallengeIdentityTrade
): string | undefined {
  if (typeof trade.canonicalAccountDisplayName !== 'string') return undefined;
  const name = trade.canonicalAccountDisplayName.trim();
  return name.length > 0 ? name : undefined;
}

function collectIdentityStats(
  trades: readonly PropChallengeIdentityTrade[]
): Map<string, IdentityStats> {
  const stats = new Map<string, IdentityStats>();
  for (const trade of trades) {
    const identity = getTradeBrokerIdentity(trade);
    if (!identity) continue;
    const at = attributionDate(trade);
    const displayName = tradeDisplayName(trade);
    const existing = stats.get(identity);
    if (!existing) {
      const created: IdentityStats = {
        tradeCount: 1,
        firstTrade: trade,
        trades: [trade],
      };
      if (at) created.firstTradeAt = at;
      if (displayName) created.displayName = displayName;
      stats.set(identity, created);
      continue;
    }
    existing.tradeCount += 1;
    existing.trades.push(trade);
    if (
      at &&
      (!existing.firstTradeAt || at.getTime() < existing.firstTradeAt.getTime())
    ) {
      existing.firstTradeAt = at;
      existing.firstTrade = trade;
    }
    if (!existing.displayName && displayName)
      existing.displayName = displayName;
  }
  return stats;
}

function collectClaimedBrokerIdentities(
  config: PropChallengeConfig
): Set<string> {
  const claimed = new Set<string>();
  for (const phase of config.phases) {
    for (const identity of phase.brokerAccountIds ?? []) {
      if (identity.length > 0) claimed.add(identity);
    }
  }
  return claimed;
}

function identityLabel(
  identity: string,
  stats: IdentityStats | undefined,
  resolveIdentityLabel?: (identity: string) => string | undefined,
  localAccountName?: string
): string {
  
  
  
  const fromTrades = stats?.displayName?.trim();
  if (fromTrades && fromTrades !== localAccountName?.trim()) return fromTrades;
  const mapped = resolveIdentityLabel?.(identity)?.trim();
  if (mapped) return mapped;
  return identity.length > 12 ? identity.slice(0, 8) : identity;
}


function agreedPhaseForIdentity(
  config: PropChallengeConfig,
  trades: readonly PropChallengeIdentityTrade[],
  now: Date
): PropChallengePhase | undefined {
  let owner: PropChallengePhase | undefined;
  for (const trade of trades) {
    const phase = resolvePhaseForTrade(config, trade, now);
    if (!phase) return undefined;
    if (!owner) {
      owner = phase;
      continue;
    }
    if (phase.id !== owner.id) return undefined;
  }
  return owner;
}


export function listUnclaimedBrokerIdentities(
  config: PropChallengeConfig,
  trades: readonly PropChallengeIdentityTrade[],
  resolveIdentityLabel?: (identity: string) => string | undefined,
  localAccountName?: string,
  now: Date = new Date()
): UnclaimedBrokerIdentity[] {
  const claimed = collectClaimedBrokerIdentities(config);
  if (claimed.size === 0) return [];
  const unclaimed: UnclaimedBrokerIdentity[] = [];
  for (const [identity, stats] of collectIdentityStats(trades)) {
    if (claimed.has(identity) || !stats.firstTradeAt) continue;
    if (!agreedPhaseForIdentity(config, stats.trades, now)) continue;
    unclaimed.push({
      identity,
      identityLabel: identityLabel(
        identity,
        stats,
        resolveIdentityLabel,
        localAccountName
      ),
      firstTradeAt: stats.firstTradeAt.toISOString(),
      tradeCount: stats.tradeCount,
    });
  }
  unclaimed.sort((left, right) => {
    const time = left.firstTradeAt.localeCompare(right.firstTradeAt);
    if (time !== 0) return time;
    if (left.identity < right.identity) return -1;
    if (left.identity > right.identity) return 1;
    return 0;
  });
  return unclaimed;
}


export function assignBrokerIdentityToPhase(
  config: PropChallengeConfig,
  phaseId: string,
  identity: string
): PropChallengeConfig {
  const trimmed = identity.trim();
  if (!trimmed) return config;
  let changed = false;
  const phases = config.phases.map((phase) => {
    if (phase.id !== phaseId) return phase;
    const existing = phase.brokerAccountIds ?? [];
    if (existing.includes(trimmed)) return phase;
    changed = true;
    return { ...phase, brokerAccountIds: [...existing, trimmed] };
  });
  return changed ? { ...config, phases } : config;
}


export function learnPropChallengeIdentities(
  config: PropChallengeConfig,
  trades: readonly PropChallengeIdentityTrade[],
  now: Date
): PropChallengeConfig {
  if (collectClaimedBrokerIdentities(config).size > 0) return config;
  const stats = collectIdentityStats(trades);
  if (stats.size !== 1) return config;
  const [identity, info] = [...stats.entries()][0];
  const owner = agreedPhaseForIdentity(config, info.trades, now);
  if (!owner) return config;
  return assignBrokerIdentityToPhase(config, owner.id, identity);
}
