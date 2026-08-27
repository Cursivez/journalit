

import { isBrokerSyncJobInProgress } from '../../../../services/tradeSync/types';
import type { BrokerSyncJob } from '../../../../services/tradeSync/types';


interface BrokerJobBearingConnection {
  jobs: BrokerSyncJob[];
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
