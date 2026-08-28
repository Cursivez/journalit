

import { useCallback } from 'react';
import { t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';
import type { TradovateConnection } from '../../../services/tradeSync/types';
import {
  connectionHasRunningJob,
  useBrokerSyncAll,
  type BrokerDataOwnership,
  type BrokerSyncAllEligibility,
  type BrokerSyncAllSummary,
} from './brokerSyncKit';
import {
  type AccountDrafts,
  tradovateAccountDraftKey,
} from './tradovateSyncPanelDrafts';

interface UseTradovateSyncAllOptions {
  plugin: JournalitPlugin;
  connections: TradovateConnection[];
  configurationDirty: Record<string, true>;
  mappingDirty: Record<string, true>;
  drafts: AccountDrafts;
  dataOwnership?: BrokerDataOwnership;
  setSyncAllBusy: (syncAllBusy: boolean) => void;
  setBusyConnections: (busyConnections: Record<string, true>) => void;
  resetForOwnershipChange: () => void;
  refresh: () => Promise<boolean | void>;
}


function connectionSyncAllEligibility(
  connection: TradovateConnection,
  configurationDirty: Record<string, true>,
  mappingDirty: Record<string, true>,
  drafts: AccountDrafts
): BrokerSyncAllEligibility {
  if (connectionHasRunningJob(connection)) return 'running-job';
  if (connection.status !== 'active') return 'not-ready';
  if (
    configurationDirty[connection.id] ||
    connection.accounts.some(
      (account) => mappingDirty[account.canonicalAccountId]
    )
  ) {
    return 'unsaved-changes';
  }
  if (
    connection.accounts.some(
      (account) =>
        account.syncEnabled &&
        !drafts[tradovateAccountDraftKey(connection.id, account.id)]
          ?.localAccountId
    )
  ) {
    return 'mapping-required';
  }
  if (!connection.accounts.some((account) => account.syncEnabled)) {
    return 'not-ready';
  }
  return true;
}

export function useTradovateSyncAll({
  plugin,
  connections,
  configurationDirty,
  mappingDirty,
  drafts,
  dataOwnership,
  setSyncAllBusy,
  setBusyConnections,
  resetForOwnershipChange,
  refresh,
}: UseTradovateSyncAllOptions): {
  syncAll: () => Promise<void>;
  syncAllAvailable: boolean;
  syncAllBlockedMessage?: string;
} {
  const isEligible = useCallback(
    (connection: TradovateConnection) =>
      connectionSyncAllEligibility(
        connection,
        configurationDirty,
        mappingDirty,
        drafts
      ),
    [configurationDirty, drafts, mappingDirty]
  );

  const syncConnections = useCallback(
    (connectionIds: string[]) =>
      plugin.ensureTradeProjectionSyncService().syncAll(connectionIds),
    [plugin]
  );

  const completionNotice = useCallback(
    ({ succeeded, total, hasIssues }: BrokerSyncAllSummary) =>
      t(
        hasIssues
          ? 'trade-sync.tradovate.sync-all-partial'
          : 'trade-sync.tradovate.sync-all-complete',
        { succeeded: String(succeeded), total: String(total) }
      ),
    []
  );

  return useBrokerSyncAll({
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
  });
}
