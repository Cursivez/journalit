

import type JournalitPlugin from '../../main';
import { createTradeProjectionOwnershipGuard } from './TradeProjectionOwnership';
import {
  BrokerSyncJobFailedError,
  type BrokerSyncDiagnostics,
  type BrokerSyncProvider,
  type BrokerSyncTerminalStatus,
} from './BrokerSyncProvider';
import type { BrokerClientOperationContext, BrokerSyncJob } from './types';
import { isBrokerSyncJobInProgress } from './types';

const CLOUD_SYNC_STATUS_POLL_INTERVAL_MS = 2000;
const CLOUD_SYNC_STATUS_POLL_TIMEOUT_MS = 30 * 60 * 1000;

interface BrokerSyncJobPollerHost {
  isStopped(): boolean;
  sleep(delayMs: number): Promise<void>;
}

export class BrokerSyncJobPoller {
  constructor(
    private readonly plugin: JournalitPlugin,
    readonly provider: BrokerSyncProvider,
    readonly diagnostics: BrokerSyncDiagnostics,
    private readonly host: BrokerSyncJobPollerHost
  ) {}

  assertOperationScope(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): void {
    if (
      operation &&
      (operation.scope !== 'connection' ||
        operation.connectionId !== connectionId)
    ) {
      throw new Error(
        `${this.provider.label} synchronization operation scope mismatch`
      );
    }
  }

  startSync(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<BrokerSyncJob> {
    return this.provider.startSync(connectionId, operation);
  }

  
  async waitForCompletion(
    connectionId: string,
    jobId: string,
    operation?: BrokerClientOperationContext
  ): Promise<'succeeded' | 'partial'> {
    const { status, errorCode } = await this.waitForTerminalStatus(
      connectionId,
      jobId,
      operation
    );
    if (status === 'failed' || status === 'cancelled') {
      throw new BrokerSyncJobFailedError(
        this.provider.label,
        status,
        errorCode
      );
    }
    return status;
  }

  async waitForTerminalStatus(
    connectionId: string,
    jobId: string,
    operation?: BrokerClientOperationContext
  ): Promise<{ status: BrokerSyncTerminalStatus; errorCode?: string }> {
    this.assertOperationScope(connectionId, operation);
    const pollStartedAt = Date.now();
    const diagnostics = this.diagnostics;
    const ownershipChanged = createTradeProjectionOwnershipGuard(
      this.plugin,
      operation?.ownerUserId
    );
    const assertPollingOwner = () => {
      if (ownershipChanged()) {
        throw new Error('Trade Projection sync stopped');
      }
    };
    assertPollingOwner();
    if (operation) {
      await diagnostics.record(operation, {
        eventType: 'job_poll_started',
      });
      assertPollingOwner();
    }
    while (!this.host.isStopped()) {
      if (this.host.isStopped())
        throw new Error('Trade Projection sync stopped');
      assertPollingOwner();
      let job;
      try {
        job = await this.provider.getJob(connectionId, jobId);
      } catch (error) {
        if (operation) {
          await diagnostics.record(operation, {
            eventType: 'job_poll_completed',
            errorCode: 'job_poll_request_failed',
          });
        }
        throw error;
      }
      if (this.host.isStopped())
        throw new Error('Trade Projection sync stopped');
      assertPollingOwner();
      if (
        job.status === 'succeeded' ||
        job.status === 'partial' ||
        job.status === 'failed' ||
        job.status === 'cancelled'
      ) {
        if (operation) {
          await diagnostics.record(operation, {
            eventType: 'job_poll_completed',
            errorCode:
              job.status === 'failed'
                ? 'broker_job_failed'
                : job.status === 'cancelled'
                  ? 'broker_job_cancelled'
                  : undefined,
          });
        }
        return { status: job.status, errorCode: job.errorCode };
      }
      if (!isBrokerSyncJobInProgress(job.status)) {
        if (operation) {
          await diagnostics.record(operation, {
            eventType: 'job_poll_completed',
          });
        }
        throw new Error(
          `${this.provider.label} cloud synchronization returned an invalid status`
        );
      }
      if (Date.now() - pollStartedAt >= CLOUD_SYNC_STATUS_POLL_TIMEOUT_MS) {
        if (operation) {
          await diagnostics.record(operation, {
            eventType: 'job_poll_completed',
          });
        }
        throw new Error(
          `${this.provider.label} cloud synchronization timed out`
        );
      }
      await this.host.sleep(CLOUD_SYNC_STATUS_POLL_INTERVAL_MS);
      assertPollingOwner();
    }
    throw new Error('Trade Projection sync stopped');
  }
}
