

import { useCallback, useMemo } from 'react';
import { Notice } from 'obsidian';
import { t } from '../../../../lang/helpers';
import type JournalitPlugin from '../../../../main';
import { createTradeProjectionOwnershipGuard } from '../../../../services/tradeSync/TradeProjectionOwnership';
import type { BrokerSyncAllResult } from '../../../../services/tradeSync/types';
import { logger } from '../../../../utils/logger';
import type { BrokerDataOwnership } from './types';


interface BrokerIdentifiedConnection {
  id: string;
}


type BrokerSyncAllBlockedReason =
  | 'unsaved-changes'
  | 'mapping-required'
  | 'running-job'
  | 'not-ready';


export type BrokerSyncAllEligibility = true | BrokerSyncAllBlockedReason;


const BLOCKED_REASON_PRIORITY: BrokerSyncAllBlockedReason[] = [
  'unsaved-changes',
  'mapping-required',
  'running-job',
  'not-ready',
];

const BLOCKED_REASON_MESSAGE_KEYS = {
  'unsaved-changes': 'trade-sync.broker.sync-all-blocked.unsaved-changes',
  'mapping-required': 'trade-sync.broker.sync-all-blocked.mapping-required',
  'running-job': 'trade-sync.broker.sync-all-blocked.running-job',
  'not-ready': 'trade-sync.broker.sync-all-blocked.not-ready',
} as const;


export interface BrokerSyncAllSummary {
  succeeded: number;
  total: number;
  hasIssues: boolean;
}

interface UseBrokerSyncAllOptions<
  TConnection extends BrokerIdentifiedConnection,
> {
  plugin: JournalitPlugin;
  connections: TConnection[];
  
  isEligible: (connection: TConnection) => BrokerSyncAllEligibility;
  dataOwnership?: BrokerDataOwnership;
  
  syncConnections: (connectionIds: string[]) => Promise<BrokerSyncAllResult>;
  
  completionNotice: (summary: BrokerSyncAllSummary) => string;
  setSyncAllBusy: (syncAllBusy: boolean) => void;
  setBusyConnections: (busyConnections: Record<string, true>) => void;
  resetForOwnershipChange: () => void;
  refresh: () => Promise<boolean | void>;
}

interface BrokerSyncAll {
  syncAll: () => Promise<void>;
  syncAllAvailable: boolean;
  
  syncAllBlockedMessage?: string;
}

export function useBrokerSyncAll<
  TConnection extends BrokerIdentifiedConnection,
>({
  plugin,
  connections,
  isEligible,
  dataOwnership,
  syncConnections,
  completionNotice,
  setSyncAllBusy,
  setBusyConnections,
  resetForOwnershipChange,
  refresh,
}: UseBrokerSyncAllOptions<TConnection>): BrokerSyncAll {
  const eligibility = useMemo(
    () => connections.map((connection) => isEligible(connection)),
    [connections, isEligible]
  );
  const eligibleConnections = useMemo(
    () =>
      connections.filter((connection, index) => eligibility[index] === true),
    [connections, eligibility]
  );
  const blockedReason = useMemo(() => {
    if (eligibleConnections.length > 0 || connections.length === 0) {
      return undefined;
    }
    const reasons = new Set(eligibility);
    return BLOCKED_REASON_PRIORITY.find((reason) => reasons.has(reason));
  }, [connections.length, eligibility, eligibleConnections.length]);

  const syncAll = useCallback(async () => {
    const ownershipChanged = createTradeProjectionOwnershipGuard(
      plugin,
      dataOwnership?.ownerUserId
    );
    const panelOwnerChanged = () =>
      !dataOwnership?.isCurrent() || ownershipChanged();
    if (panelOwnerChanged()) {
      resetForOwnershipChange();
      return;
    }
    if (eligibleConnections.length === 0) return;
    setSyncAllBusy(true);
    setBusyConnections(
      Object.fromEntries(
        eligibleConnections.map((connection) => [connection.id, true] as const)
      )
    );
    try {
      const result = await syncConnections(
        eligibleConnections.map((connection) => connection.id)
      );
      if (panelOwnerChanged()) {
        resetForOwnershipChange();
        return;
      }
      const synchronizedCount = result.outcomes.filter(
        (outcome) =>
          outcome.status === 'succeeded' || outcome.status === 'partial'
      ).length;
      const issueCount = result.outcomes.filter(
        (outcome) => outcome.status !== 'succeeded'
      ).length;
      new Notice(
        completionNotice({
          succeeded: synchronizedCount,
          total: result.outcomes.length,
          hasIssues:
            issueCount > 0 ||
            result.projection.failedCount > 0 ||
            result.projection.pendingCount > 0,
        })
      );
      await refresh();
    } catch (error) {
      if (panelOwnerChanged()) {
        resetForOwnershipChange();
        return;
      }
      logger.error('Broker sync all failed', error);
      new Notice(t('trade-sync.import.notice.sync-cloud-failed'));
    } finally {
      setSyncAllBusy(false);
      setBusyConnections({});
    }
  }, [
    completionNotice,
    dataOwnership,
    eligibleConnections,
    plugin,
    refresh,
    resetForOwnershipChange,
    setBusyConnections,
    setSyncAllBusy,
    syncConnections,
  ]);

  return {
    syncAll,
    syncAllAvailable: eligibleConnections.length > 0,
    syncAllBlockedMessage: blockedReason
      ? t(BLOCKED_REASON_MESSAGE_KEYS[blockedReason])
      : undefined,
  };
}
