

import type { AccountTradeData } from '../../../../services/accountPage/types';
import type { PropChallengePhase } from '../../../../services/propChallenge/types';
import { getTradeBrokerIdentity } from '../../../../services/propChallenge/tradeIdentity';

export interface PhaseBrokerAccountOption {
  id: string;
  displayName: string;
  tradeCount: number;
  firstTradeAt?: Date;
  lastTradeAt?: Date;
  assignedPhaseName?: string;
}

export function collectPhaseBrokerAccountOptions({
  trades,
  phases,
  currentPhaseId,
  resolveDisplayName,
}: {
  trades: readonly AccountTradeData[];
  phases: readonly PropChallengePhase[];
  currentPhaseId: string;
  resolveDisplayName: (identity: string) => string | undefined;
}): PhaseBrokerAccountOption[] {
  const statsById = new Map<
    string,
    { tradeCount: number; firstTradeAt: Date; lastTradeAt: Date }
  >();

  for (const trade of trades) {
    const identity = getTradeBrokerIdentity(trade);
    if (!identity) continue;
    const at = trade.entryTime;
    const existing = statsById.get(identity);
    if (!existing) {
      statsById.set(identity, {
        tradeCount: 1,
        firstTradeAt: at,
        lastTradeAt: at,
      });
      continue;
    }
    existing.tradeCount += 1;
    if (at.getTime() < existing.firstTradeAt.getTime()) {
      existing.firstTradeAt = at;
    }
    if (at.getTime() > existing.lastTradeAt.getTime()) {
      existing.lastTradeAt = at;
    }
  }

  const ownerById = new Map<string, string>();
  for (const phase of phases) {
    for (const identity of phase.brokerAccountIds ?? []) {
      if (!ownerById.has(identity)) ownerById.set(identity, phase.id);
    }
  }

  const ids: string[] = [];
  const seen = new Set<string>();
  for (const identity of statsById.keys()) {
    seen.add(identity);
    ids.push(identity);
  }
  for (const identity of ownerById.keys()) {
    if (seen.has(identity)) continue;
    seen.add(identity);
    ids.push(identity);
  }

  const options: PhaseBrokerAccountOption[] = [];
  const phasesById = new Map(phases.map((phase) => [phase.id, phase]));
  for (const id of ids) {
    const stats = statsById.get(id);
    const ownerPhaseId = ownerById.get(id);
    const displayName = resolveDisplayName(id) ?? id;
    const option: PhaseBrokerAccountOption = {
      id,
      displayName,
      tradeCount: stats?.tradeCount ?? 0,
    };
    if (stats) {
      option.firstTradeAt = stats.firstTradeAt;
      option.lastTradeAt = stats.lastTradeAt;
    }
    if (ownerPhaseId && ownerPhaseId !== currentPhaseId) {
      const ownerPhase = phasesById.get(ownerPhaseId);
      if (ownerPhase) option.assignedPhaseName = ownerPhase.name;
    }
    options.push(option);
  }

  options.sort((left, right) => {
    const leftTime = left.firstTradeAt?.getTime() ?? Number.POSITIVE_INFINITY;
    const rightTime = right.firstTradeAt?.getTime() ?? Number.POSITIVE_INFINITY;
    if (leftTime !== rightTime) return leftTime - rightTime;
    if (left.id < right.id) return -1;
    if (left.id > right.id) return 1;
    return 0;
  });
  return options;
}
