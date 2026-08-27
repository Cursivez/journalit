

import type {
  BrokerClientDiagnosticEventInput,
  BrokerClientOperationContext,
  BrokerSyncJob,
  BrokerSyncProviderId,
} from './types';

export type BrokerSyncTerminalStatus =
  | 'succeeded'
  | 'partial'
  | 'failed'
  | 'cancelled';

export interface BrokerSyncAccountBinding {
  canonicalAccountId: string;
  connectionId: string;
  provider: BrokerSyncProviderId;
}

export interface BrokerSyncProvider {
  
  readonly id: BrokerSyncProviderId;
  
  readonly label: string;
  startSync(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<BrokerSyncJob>;
  getJob(connectionId: string, jobId: string): Promise<BrokerSyncJob>;
  listSyncEnabledAccountBindings(): Promise<BrokerSyncAccountBinding[]>;
}

export interface BrokerSyncDiagnostics {
  createConnectionOperation(
    vaultId: string,
    connectionId: string,
    provider: BrokerSyncProviderId
  ): Promise<BrokerClientOperationContext>;
  createProjectionOperation(
    vaultId: string,
    provider: BrokerSyncProviderId,
    syncRunId?: string
  ): Promise<BrokerClientOperationContext>;
  record(
    operation: BrokerClientOperationContext,
    event: BrokerClientDiagnosticEventInput
  ): Promise<void>;
  flush(): Promise<void>;
}


export class BrokerSyncJobFailedError extends Error {
  constructor(
    providerLabel: string,
    readonly status: 'failed' | 'cancelled',
    readonly errorCode?: string
  ) {
    super(`${providerLabel} cloud synchronization ${status} while processing`);
    this.name = 'BrokerSyncJobFailedError';
  }
}
