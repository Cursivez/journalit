import type { BrokerSyncJob, RithmicConnection } from './types';
import { isBrokerSyncJobInProgress } from './types';

export type TradeSyncConnectionEligibility =
  | true
  | 'unsaved-changes'
  | 'mapping-required'
  | 'running-job'
  | 'not-ready';

interface BrokerJobBearingConnection {
  jobs: BrokerSyncJob[];
}

export interface TradeSyncEligibilityOptions {
  hasUnsavedChanges: boolean;
  isAccountMapped(canonicalAccountId: string): boolean;
}

export function connectionHasRunningJob(
  connection: BrokerJobBearingConnection
): boolean {
  return connection.jobs.some((job) => isBrokerSyncJobInProgress(job.status));
}

export function anyConnectionHasRunningJob(
  connections: readonly BrokerJobBearingConnection[]
): boolean {
  return connections.some(connectionHasRunningJob);
}

interface StandardBrokerSyncConnection extends BrokerJobBearingConnection {
  status: string;
  accounts: Array<{
    syncEnabled: boolean;
    canonicalAccountId: string;
  }>;
}

export function oauthBrokerConnectionSyncEligibility(
  connection: StandardBrokerSyncConnection,
  options: TradeSyncEligibilityOptions
): TradeSyncConnectionEligibility {
  if (connectionHasRunningJob(connection)) return 'running-job';
  if (connection.status !== 'active') return 'not-ready';
  if (options.hasUnsavedChanges) return 'unsaved-changes';
  if (
    connection.accounts.some(
      (account) =>
        account.syncEnabled &&
        !options.isAccountMapped(account.canonicalAccountId)
    )
  ) {
    return 'mapping-required';
  }
  if (!connection.accounts.some((account) => account.syncEnabled)) {
    return 'not-ready';
  }
  return true;
}

export function rithmicConnectionSyncEligibility(
  connection: RithmicConnection,
  options: TradeSyncEligibilityOptions
): TradeSyncConnectionEligibility {
  if (connectionHasRunningJob(connection)) return 'running-job';
  if (connection.status === 'setup_required') return true;
  return oauthBrokerConnectionSyncEligibility(connection, options);
}
