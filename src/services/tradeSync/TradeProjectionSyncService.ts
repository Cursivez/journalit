import type JournalitPlugin from '../../main';
import { logger } from '../../utils/logger';
import { generateUUID } from '../../utils/uuid';
import { ApiClient } from '../backend/ApiClient';
import { SubscriptionTierService } from '../backend/SubscriptionTierService';
import { BackendTradeProjectionService } from './BackendTradeProjectionService';
import { TradeProjectionAccountMappingService } from './TradeProjectionAccountMappingService';
import { loadAllProjectionPages } from './TradeProjectionPagination';
import {
  flushTradeProjectionAcks,
  getTradeProjectionVaultId,
} from './TradeProjectionAckQueue';
import {
  createTradeProjectionOwnershipGuard,
  getTradeProjectionOwnerId,
} from './TradeProjectionOwnership';
import { TradeProjectionRestoreService } from './TradeProjectionRestoreService';
import { TradovateClientDiagnosticsService } from './TradovateClientDiagnosticsService';
import type {
  TradeProjection,
  TradovateConnectionSyncOutcome,
  TradeProjectionSyncResult,
  TradovateClientOperationContext,
  TradovateSyncAllResult,
} from './types';
import { isTradovateJobInProgress } from './types';

const PAGE_LIMIT = 100;
const AUTOMATIC_SYNC_INTERVAL_MS = 15 * 60 * 1000;
const CLOUD_SYNC_STATUS_POLL_INTERVAL_MS = 2000;
const CLOUD_SYNC_STATUS_POLL_TIMEOUT_MS = 30 * 60 * 1000;

export class TradeProjectionSyncService {
  private readonly backend = new BackendTradeProjectionService();
  private readonly mappings = new TradeProjectionAccountMappingService(
    this.backend
  );
  private readonly restoreService: TradeProjectionRestoreService;
  private readonly diagnostics: TradovateClientDiagnosticsService;
  private activeSync: Promise<TradeProjectionSyncResult> | null = null;
  private readonly timerIds = new Set<number>();
  private readonly sleepResolvers = new Map<number, () => void>();
  private stopped = false;

  constructor(private readonly plugin: JournalitPlugin) {
    this.restoreService = new TradeProjectionRestoreService(
      plugin,
      this.backend
    );
    this.diagnostics = new TradovateClientDiagnosticsService(
      plugin,
      this.backend
    );
  }

  start(): void {
    const synchronize = () => {
      if (this.stopped) return;
      void this.syncProjections().catch(() => undefined);
    };
    this.plugin.registerInterval(
      window.setInterval(synchronize, AUTOMATIC_SYNC_INTERVAL_MS)
    );
    this.plugin.registerDomEvent(window, 'online', synchronize);
    const initialSyncTimer = window.setTimeout(() => {
      this.timerIds.delete(initialSyncTimer);
      synchronize();
    }, 5000);
    this.timerIds.add(initialSyncTimer);
    this.plugin.register(() => this.stop());
  }

  syncProjections(
    operation?: TradovateClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    if (this.stopped) return Promise.resolve(this.emptyResult());
    if (operation?.scope === 'connection') {
      return Promise.reject(
        new Error('Canonical projection requires aggregate diagnostic scope')
      );
    }
    if (this.activeSync) return this.activeSync;
    this.activeSync = this.runProjectionSync(operation).finally(() => {
      this.activeSync = null;
    });
    return this.activeSync;
  }

  async syncConnection(
    connectionId: string,
    operation?: TradovateClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    if (this.stopped) return this.emptyResult();
    if (
      operation &&
      (operation.scope !== 'connection' ||
        operation.connectionId !== connectionId)
    ) {
      throw new Error('Tradovate synchronization operation scope mismatch');
    }
    const vaultId = await getTradeProjectionVaultId(this.plugin);
    const currentOperation =
      operation ??
      (await this.diagnostics.createConnectionOperation(vaultId, connectionId));
    const ownershipChanged = createTradeProjectionOwnershipGuard(
      this.plugin,
      currentOperation.ownerUserId
    );
    if (this.stopped || ownershipChanged()) {
      throw new Error('Trade Projection sync stopped');
    }
    const job = await this.backend.startTradovateSync(
      connectionId,
      'sync',
      currentOperation
    );
    if (this.stopped || ownershipChanged()) {
      throw new Error('Trade Projection sync stopped');
    }
    return this.projectAfterJob(connectionId, job.id, currentOperation);
  }

  async projectAfterJob(
    connectionId: string,
    jobId: string,
    operation?: TradovateClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    if (this.stopped) return this.emptyResult();
    if (
      operation &&
      (operation.scope !== 'connection' ||
        operation.connectionId !== connectionId)
    ) {
      throw new Error('Tradovate synchronization operation scope mismatch');
    }
    const currentOperation = operation ? { ...operation, jobId } : undefined;
    const ownershipChanged = createTradeProjectionOwnershipGuard(
      this.plugin,
      currentOperation?.ownerUserId
    );
    const assertHandoffOwner = () => {
      if (this.stopped || ownershipChanged()) {
        throw new Error('Trade Projection sync stopped');
      }
    };
    assertHandoffOwner();
    const cloudStatus = await this.waitForCloudSync(
      connectionId,
      jobId,
      currentOperation
    );
    assertHandoffOwner();
    while (this.activeSync) {
      await Promise.allSettled([this.activeSync]);
      assertHandoffOwner();
    }
    assertHandoffOwner();
    const projectionOperation =
      await this.diagnostics.createProjectionOperation(
        currentOperation?.vaultId ??
          (await getTradeProjectionVaultId(this.plugin))
      );
    assertHandoffOwner();
    const result = await this.syncProjections(projectionOperation);
    assertHandoffOwner();
    return cloudStatus === 'partial' ? { ...result, partial: true } : result;
  }

  async waitForCloudSync(
    connectionId: string,
    jobId: string,
    operation?: TradovateClientOperationContext
  ): Promise<'succeeded' | 'partial'> {
    const status = await this.waitForCloudSyncTerminal(
      connectionId,
      jobId,
      operation
    );
    if (status === 'failed' || status === 'cancelled') {
      throw new Error(
        `Tradovate cloud synchronization ${status} while processing`
      );
    }
    return status;
  }

  async waitForCloudSyncTerminal(
    connectionId: string,
    jobId: string,
    operation?: TradovateClientOperationContext
  ): Promise<'succeeded' | 'partial' | 'failed' | 'cancelled'> {
    if (
      operation &&
      (operation.scope !== 'connection' ||
        operation.connectionId !== connectionId)
    ) {
      throw new Error('Tradovate synchronization operation scope mismatch');
    }
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
    while (!this.stopped) {
      if (this.stopped) throw new Error('Trade Projection sync stopped');
      assertPollingOwner();
      let job;
      try {
        job = await this.backend.getTradovateJob(connectionId, jobId);
      } catch (error) {
        if (operation) {
          await diagnostics.record(operation, {
            eventType: 'job_poll_completed',
            errorCode: 'job_poll_request_failed',
          });
        }
        throw error;
      }
      if (this.stopped) throw new Error('Trade Projection sync stopped');
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
        return job.status;
      }
      if (!isTradovateJobInProgress(job.status)) {
        if (operation) {
          await diagnostics.record(operation, {
            eventType: 'job_poll_completed',
          });
        }
        throw new Error(
          'Tradovate cloud synchronization returned an invalid status'
        );
      }
      if (Date.now() - pollStartedAt >= CLOUD_SYNC_STATUS_POLL_TIMEOUT_MS) {
        if (operation) {
          await diagnostics.record(operation, {
            eventType: 'job_poll_completed',
          });
        }
        throw new Error('Tradovate cloud synchronization timed out');
      }
      await this.sleep(CLOUD_SYNC_STATUS_POLL_INTERVAL_MS);
      assertPollingOwner();
    }
    throw new Error('Trade Projection sync stopped');
  }

  async syncAll(connectionIds: string[]): Promise<TradovateSyncAllResult> {
    if (this.stopped) {
      return { outcomes: [], projection: this.emptyResult() };
    }
    const initiatingUserId = getTradeProjectionOwnerId(this.plugin);
    const ownershipChanged = createTradeProjectionOwnershipGuard(
      this.plugin,
      initiatingUserId
    );
    const assertSyncOwner = () => {
      if (this.stopped || ownershipChanged()) {
        throw new Error('Trade Projection sync stopped');
      }
    };
    assertSyncOwner();
    const uniqueConnectionIds = Array.from(new Set(connectionIds));
    if (uniqueConnectionIds.length === 0) {
      return { outcomes: [], projection: this.emptyResult() };
    }
    const syncRunId = generateUUID();
    const vaultId = await getTradeProjectionVaultId(this.plugin);
    assertSyncOwner();
    const settled = await Promise.allSettled(
      uniqueConnectionIds.map(async (connectionId) => {
        assertSyncOwner();
        const operation = await this.diagnostics.createConnectionOperation(
          vaultId,
          connectionId
        );
        assertSyncOwner();
        const job = await this.backend.startTradovateSync(
          connectionId,
          'sync',
          operation
        );
        assertSyncOwner();
        const status = await this.waitForCloudSyncTerminal(
          connectionId,
          job.id,
          { ...operation, jobId: job.id }
        );
        assertSyncOwner();
        return {
          connectionId,
          status,
        } satisfies TradovateConnectionSyncOutcome;
      })
    );
    assertSyncOwner();
    const outcomes = settled.map(
      (outcome, index): TradovateConnectionSyncOutcome =>
        outcome.status === 'fulfilled'
          ? outcome.value
          : {
              connectionId: uniqueConnectionIds[index],
              status: 'request_failed',
            }
    );
    assertSyncOwner();
    const projectionOperation =
      await this.diagnostics.createProjectionOperation(vaultId, syncRunId);
    assertSyncOwner();
    while (this.activeSync) {
      await Promise.allSettled([this.activeSync]);
      assertSyncOwner();
    }
    assertSyncOwner();
    const projection = await this.syncProjections(projectionOperation);
    assertSyncOwner();
    return { outcomes, projection };
  }

  private sleep(delayMs: number): Promise<void> {
    if (this.stopped) return Promise.resolve();
    return new Promise((resolve) => {
      let timerId = 0;
      const finish = () => {
        this.timerIds.delete(timerId);
        this.sleepResolvers.delete(timerId);
        resolve();
      };
      timerId = window.setTimeout(finish, delayMs);
      this.timerIds.add(timerId);
      this.sleepResolvers.set(timerId, finish);
    });
  }

  private async runProjectionSync(
    operation?: TradovateClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    await this.plugin.canonicalProjectionMigrationService?.run();
    if (this.stopped) return this.emptyResult();
    if (!ApiClient.getAuthToken() || navigator.onLine === false) {
      return this.emptyResult();
    }
    if (
      this.plugin.settings.backendIntegration?.subscriptionTier !== 'premium'
    ) {
      return this.emptyResult();
    }
    const initiatingUserId = await this.resolveProjectionOwner();
    if (!initiatingUserId) return this.emptyResult();
    const ownershipChanged = createTradeProjectionOwnershipGuard(
      this.plugin,
      initiatingUserId
    );
    const shouldStop = () => this.stopped || ownershipChanged();
    async function completeWhileOwned<T>(
      work: () => Promise<T>
    ): Promise<{ value: T } | null> {
      if (shouldStop()) return null;
      const value = await work();
      return shouldStop() ? null : { value };
    }
    if (!(await completeWhileOwned(() => this.diagnostics.flush()))) {
      return this.emptyResult();
    }
    if (
      !(await completeWhileOwned(() =>
        flushTradeProjectionAcks(this.plugin, this.backend, {
          interactiveEntitlement: false,
        })
      ))
    ) {
      return this.emptyResult();
    }
    const vaultResult = await completeWhileOwned(() =>
      getTradeProjectionVaultId(this.plugin)
    );
    if (!vaultResult) return this.emptyResult();
    const vaultId = vaultResult.value;
    const inventoryResult = await completeWhileOwned(() =>
      Promise.all([
        this.mappings.getInventory(vaultId, {
          interactiveEntitlement: false,
        }),
        this.backend.getTradovateConnections(),
      ])
    );
    if (!inventoryResult) return this.emptyResult();
    const [inventory, providerStatus] = inventoryResult.value;
    if (operation) {
      await this.diagnostics.record(operation, {
        eventType: 'projection_inventory_loaded',
        ...(inventory.accounts.length > 0
          ? { count: inventory.accounts.length }
          : {}),
      });
    }
    const connectionIdByCanonicalAccountId = new Map<string, string>();
    for (const connection of providerStatus.connections) {
      for (const account of connection.accounts) {
        if (account.syncEnabled) {
          connectionIdByCanonicalAccountId.set(
            account.canonicalAccountId,
            connection.id
          );
        }
      }
    }
    const tradovateCanonicalAccountIds = new Set(
      connectionIdByCanonicalAccountId.keys()
    );
    const tradovateAccounts = inventory.accounts.filter((account) =>
      tradovateCanonicalAccountIds.has(account.accountId)
    );
    let writtenCount = 0;
    let failedCount = 0;
    let pendingCount = 0;
    const catalog = await this.plugin.accountPageService?.getAccountCatalog();
    const catalogById = new Map<string, NonNullable<typeof catalog>[number]>();
    const catalogByName = new Map<
      string,
      NonNullable<typeof catalog>[number]
    >();
    const mappingDiagnosticOperations = new Map<
      string,
      TradovateClientOperationContext
    >();
    const recordMappingMissing = async (canonicalAccountId: string) => {
      if (!operation) return;
      const connectionId =
        connectionIdByCanonicalAccountId.get(canonicalAccountId);
      if (!connectionId) return;
      let diagnosticOperation = mappingDiagnosticOperations.get(connectionId);
      if (!diagnosticOperation) {
        diagnosticOperation = await this.diagnostics.createConnectionOperation(
          vaultId,
          connectionId
        );
        mappingDiagnosticOperations.set(connectionId, diagnosticOperation);
      }
      await this.diagnostics.record(diagnosticOperation, {
        eventType: 'account_mapping_missing',
        errorCode: 'local_account_mapping_missing',
      });
    };
    for (const localAccount of catalog ?? []) {
      if (localAccount.archived) continue;
      catalogById.set(localAccount.id, localAccount);
      catalogByName.set(
        localAccount.name.trim().toLocaleLowerCase(),
        localAccount
      );
    }
    
    
    for (const account of tradovateAccounts) {
      if (shouldStop()) return this.emptyResult();
      const mappedCatalogAccountById = account.mapping?.localAccountId
        ? catalogById.get(account.mapping.localAccountId)
        : undefined;
      const localAccountName =
        mappedCatalogAccountById?.name ?? account.mapping?.localAccountName;
      if (!localAccountName) {
        await recordMappingMissing(account.accountId);
        continue;
      }
      const projections = await this.loadAccountProjections(
        vaultId,
        account.accountId,
        shouldStop
      );
      if (projections.length === 0) continue;
      const mappedCatalogAccount = catalog?.length
        ? (mappedCatalogAccountById ??
          catalogByName.get(localAccountName.trim().toLocaleLowerCase()))
        : undefined;
      const mappingStillExists = catalog?.length
        ? Boolean(mappedCatalogAccount)
        : Object.keys(this.plugin.settings.account?.accountMetadata ?? {}).some(
            (name) =>
              name.trim().toLocaleLowerCase() ===
              localAccountName.trim().toLocaleLowerCase()
          );
      if (!mappingStillExists) {
        logger.warn(
          'Trade projection skipped because its local account mapping is stale; remap it in Trade Sync settings.'
        );
        failedCount += projections.length;
        await recordMappingMissing(account.accountId);
        continue;
      }
      const result = await this.restoreService.restoreProjections({
        accountName: mappedCatalogAccount?.name ?? localAccountName,
        brokerLabel: account.broker,
        projections,
        ownerUserId: initiatingUserId,
        requestOptions: { interactiveEntitlement: false },
        shouldStop,
        clientOperation: operation,
      });
      writtenCount += result.writtenCount + result.duplicateCount;
      failedCount += result.failedCount + result.ackFailedCount;
      pendingCount += result.pendingCount;
    }
    return {
      accountCount: tradovateAccounts.length,
      writtenCount,
      failedCount,
      pendingCount,
    };
  }

  private emptyResult(): TradeProjectionSyncResult {
    return {
      accountCount: 0,
      writtenCount: 0,
      failedCount: 0,
      pendingCount: 0,
    };
  }

  private async resolveProjectionOwner(): Promise<string> {
    const existingOwner = getTradeProjectionOwnerId(this.plugin);
    if (existingOwner) return existingOwner;

    await new SubscriptionTierService(this.plugin).refreshTier(
      'trade projection owner bootstrap'
    );
    return getTradeProjectionOwnerId(this.plugin);
  }

  private stop(): void {
    if (this.stopped) return;
    this.stopped = true;
    for (const timerId of this.timerIds) window.clearTimeout(timerId);
    this.timerIds.clear();
    for (const resolve of this.sleepResolvers.values()) resolve();
    this.sleepResolvers.clear();
  }

  private async loadAccountProjections(
    vaultId: string,
    accountId: string,
    shouldStop: () => boolean
  ): Promise<TradeProjection[]> {
    return loadAllProjectionPages(async (cursor) => {
      if (shouldStop()) throw new Error('Trade Projection sync stopped');
      const response = await this.backend.getRestorableProjections(
        {
          vaultId,
          accountId,
          limit: PAGE_LIMIT,
          cursor,
        },
        {
          interactiveEntitlement: false,
        }
      );
      if (shouldStop()) throw new Error('Trade Projection sync stopped');
      return response;
    });
  }
}
