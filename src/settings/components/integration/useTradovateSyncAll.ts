import { useCallback, useMemo } from 'react';
import { Notice } from 'obsidian';
import { t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';
import { createTradeProjectionOwnershipGuard } from '../../../services/tradeSync/TradeProjectionOwnership';
import {
  isTradovateJobInProgress,
  type TradovateConnection,
} from '../../../services/tradeSync/types';
import { logger } from '../../../utils/logger';
import {
  type AccountDrafts,
  tradovateAccountDraftKey,
} from './tradovateSyncPanelDrafts';

interface DataOwnershipFence {
  ownerUserId: string;
  isCurrent: () => boolean;
}

interface SyncAllStatePatch {
  syncAllBusy: boolean;
  busyConnections: Record<string, true>;
}

interface UseTradovateSyncAllOptions {
  plugin: JournalitPlugin;
  connections: TradovateConnection[];
  configurationDirty: Record<string, true>;
  mappingDirty: Record<string, true>;
  drafts: AccountDrafts;
  dataOwnership?: DataOwnershipFence;
  patchState: (patch: SyncAllStatePatch) => void;
  resetForOwnershipChange: () => void;
  refresh: () => Promise<void>;
}

function connectionIsSyncAllEligible(
  connection: TradovateConnection,
  configurationDirty: Record<string, true>,
  mappingDirty: Record<string, true>,
  drafts: AccountDrafts
): boolean {
  return (
    connection.status === 'active' &&
    connection.accounts.some((account) => account.syncEnabled) &&
    !connection.accounts.some(
      (account) =>
        account.syncEnabled &&
        !drafts[tradovateAccountDraftKey(connection.id, account.id)]
          ?.localAccountId
    ) &&
    !connection.jobs.some((job) => isTradovateJobInProgress(job.status)) &&
    !configurationDirty[connection.id] &&
    !connection.accounts.some(
      (account) => mappingDirty[account.canonicalAccountId]
    )
  );
}

export function useTradovateSyncAll({
  plugin,
  connections,
  configurationDirty,
  mappingDirty,
  drafts,
  dataOwnership,
  patchState,
  resetForOwnershipChange,
  refresh,
}: UseTradovateSyncAllOptions): {
  syncAll: () => Promise<void>;
  syncAllAvailable: boolean;
} {
  const eligibleConnections = useMemo(
    () =>
      connections.filter((connection) =>
        connectionIsSyncAllEligible(
          connection,
          configurationDirty,
          mappingDirty,
          drafts
        )
      ),
    [configurationDirty, connections, drafts, mappingDirty]
  );

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
    patchState({
      syncAllBusy: true,
      busyConnections: Object.fromEntries(
        eligibleConnections.map((connection) => [connection.id, true] as const)
      ),
    });
    try {
      const result = await plugin
        .ensureTradeProjectionSyncService()
        .syncAll(eligibleConnections.map((connection) => connection.id));
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
        t(
          issueCount > 0 || result.projection.failedCount > 0
            ? 'trade-sync.tradovate.sync-all-partial'
            : 'trade-sync.tradovate.sync-all-complete',
          {
            succeeded: String(synchronizedCount),
            total: String(result.outcomes.length),
          }
        )
      );
      await refresh();
    } catch (error) {
      if (panelOwnerChanged()) {
        resetForOwnershipChange();
        return;
      }
      logger.error('Tradovate sync all failed', error);
      new Notice(t('trade-sync.import.notice.sync-cloud-failed'));
    } finally {
      patchState({ syncAllBusy: false, busyConnections: {} });
    }
  }, [
    dataOwnership,
    eligibleConnections,
    patchState,
    plugin,
    refresh,
    resetForOwnershipChange,
  ]);

  return {
    syncAll,
    syncAllAvailable: eligibleConnections.length > 0,
  };
}
