

import type JournalitPlugin from '../../main';
import { generateUUID } from '../../utils/uuid';
import { TradeProjectionClient } from './TradeProjectionClient';
import { getTradeProjectionVaultId } from './TradeProjectionAckQueue';
import {
  createTradeProjectionOwnershipGuard,
  getTradeProjectionOwnerId,
} from './TradeProjectionOwnership';
import {
  emptyTradeProjectionSyncResult,
  TradeProjectionRestoreRunner,
} from './TradeProjectionRestoreRunner';
import { TradovateClientDiagnosticsService } from './TradovateClientDiagnosticsService';
import { BrokerSyncJobPoller } from './BrokerSyncJobPoller';
import { TradovateBrokerSyncProvider } from './TradovateBrokerSyncProvider';
import { RithmicBrokerSyncProvider } from './RithmicBrokerSyncProvider';
import { CTraderBrokerSyncProvider } from './CTraderBrokerSyncProvider';
import type { BrokerSyncAccountBinding } from './BrokerSyncProvider';
import type {
  BrokerClientOperationContext,
  BrokerConnectionSyncOutcome,
  BrokerSyncAllResult,
  TradeProjectionSyncResult,
} from './types';
import { buildProjectionSyncOperationResult } from '../tradeOperations/resultBuilders';
import { DemoSyncGate } from '../../demo/DemoSyncGate';

const AUTOMATIC_SYNC_INTERVAL_MS = 15 * 60 * 1000;

export class TradeProjectionSyncService {
  private readonly projectionClient = new TradeProjectionClient();
  private readonly diagnostics: TradovateClientDiagnosticsService;
  private readonly restoreRunner: TradeProjectionRestoreRunner;
  private readonly tradovate: BrokerSyncJobPoller;
  private readonly rithmic: BrokerSyncJobPoller;
  private readonly ctrader: BrokerSyncJobPoller;
  private activeSync: Promise<TradeProjectionSyncResult> | null = null;
  private readonly timerIds = new Set<number>();
  private readonly sleepResolvers = new Map<number, () => void>();
  private stopped = false;

  constructor(private readonly plugin: JournalitPlugin) {
    this.diagnostics = new TradovateClientDiagnosticsService(plugin);
    const tradovateProvider = new TradovateBrokerSyncProvider();
    const rithmicProvider = new RithmicBrokerSyncProvider();
    const ctraderProvider = new CTraderBrokerSyncProvider();
    const host = {
      isStopped: () => this.stopped,
      sleep: (delayMs: number) => this.sleep(delayMs),
    };
    this.tradovate = new BrokerSyncJobPoller(
      plugin,
      tradovateProvider,
      this.diagnostics,
      host
    );
    this.rithmic = new BrokerSyncJobPoller(
      plugin,
      rithmicProvider,
      this.diagnostics,
      host
    );
    this.ctrader = new BrokerSyncJobPoller(
      plugin,
      ctraderProvider,
      this.diagnostics,
      host
    );
    this.restoreRunner = new TradeProjectionRestoreRunner(
      plugin,
      this.projectionClient,
      this.diagnostics,
      [tradovateProvider, rithmicProvider, ctraderProvider],
      () => this.stopped
    );
  }

  start(): void {
    const synchronize = () => {
      if (this.stopped || this.activeSync) return;
      const initiatingOwnerUserId = getTradeProjectionOwnerId(this.plugin);
      if (!initiatingOwnerUserId) return;
      void this.syncProjections()
        .then((result) => {
          if (
            this.stopped ||
            getTradeProjectionOwnerId(this.plugin) !== initiatingOwnerUserId
          ) {
            return;
          }
          this.plugin.ensureTradeOperationResultService().record(
            buildProjectionSyncOperationResult({
              result,
              source: 'automatic-sync',
              ownerUserId: initiatingOwnerUserId,
            })
          );
        })
        .catch(() => undefined);
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
    operation?: BrokerClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    if (this.stopped || DemoSyncGate.isActive()) {
      return Promise.resolve(this.emptyResult());
    }
    if (operation?.scope === 'connection') {
      return Promise.reject(
        new Error('Canonical projection requires aggregate diagnostic scope')
      );
    }
    if (this.activeSync) return this.activeSync;
    this.activeSync = this.restoreRunner.run(operation).finally(() => {
      this.activeSync = null;
    });
    return this.activeSync;
  }

  async quiesceForSampleContext(): Promise<void> {
    while (this.activeSync) {
      await Promise.allSettled([this.activeSync]);
    }
  }

  
  async syncRemappedAccountProjections(
    accountBindings: BrokerSyncAccountBinding[],
    operation?: BrokerClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    if (operation?.scope === 'connection') {
      return Promise.reject(
        new Error('Canonical projection requires aggregate diagnostic scope')
      );
    }
    const initiatingUserId =
      operation?.ownerUserId ?? getTradeProjectionOwnerId(this.plugin);
    const ownershipChanged = createTradeProjectionOwnershipGuard(
      this.plugin,
      initiatingUserId
    );
    const assertOwner = () => {
      if (this.stopped || ownershipChanged()) {
        throw new Error('Trade Projection sync stopped');
      }
    };
    assertOwner();
    while (true) {
      await this.waitForActiveSync(assertOwner);
      assertOwner();
      if (accountBindings.length === 0) return this.emptyResult();
      if (this.activeSync) continue;
      this.activeSync = this.restoreRunner
        .runForRemappedAccounts(accountBindings, operation)
        .finally(() => {
          this.activeSync = null;
        });
      return this.activeSync;
    }
  }

  syncConnection(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    return this.runConnectionSync(this.tradovate, connectionId, operation);
  }

  
  syncRithmicConnection(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    return this.runConnectionSync(this.rithmic, connectionId, operation);
  }

  
  syncCTraderConnection(
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    return this.runConnectionSync(this.ctrader, connectionId, operation);
  }

  projectAfterJob(
    connectionId: string,
    jobId: string,
    operation?: BrokerClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    return this.runProjectionHandoff(
      this.tradovate,
      connectionId,
      jobId,
      operation
    );
  }

  waitForCloudSync(
    connectionId: string,
    jobId: string,
    operation?: BrokerClientOperationContext
  ): Promise<'succeeded' | 'partial'> {
    return this.tradovate.waitForCompletion(connectionId, jobId, operation);
  }

  async waitForCloudSyncTerminal(
    connectionId: string,
    jobId: string,
    operation?: BrokerClientOperationContext
  ): Promise<'succeeded' | 'partial' | 'failed' | 'cancelled'> {
    const { status } = await this.tradovate.waitForTerminalStatus(
      connectionId,
      jobId,
      operation
    );
    return status;
  }

  syncAll(connectionIds: string[]): Promise<BrokerSyncAllResult> {
    return this.runSyncAll(this.tradovate, connectionIds);
  }

  
  syncRithmicAll(connectionIds: string[]): Promise<BrokerSyncAllResult> {
    return this.runSyncAll(this.rithmic, connectionIds);
  }

  projectAfterCTraderJob(
    connectionId: string,
    jobId: string,
    operation?: BrokerClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    return this.runProjectionHandoff(
      this.ctrader,
      connectionId,
      jobId,
      operation
    );
  }

  waitForCTraderCloudSync(
    connectionId: string,
    jobId: string,
    operation?: BrokerClientOperationContext
  ): Promise<'succeeded' | 'partial'> {
    return this.ctrader.waitForCompletion(connectionId, jobId, operation);
  }

  async waitForCTraderCloudSyncTerminal(
    connectionId: string,
    jobId: string,
    operation?: BrokerClientOperationContext
  ): Promise<'succeeded' | 'partial' | 'failed' | 'cancelled'> {
    const { status } = await this.ctrader.waitForTerminalStatus(
      connectionId,
      jobId,
      operation
    );
    return status;
  }

  
  syncCTraderAll(connectionIds: string[]): Promise<BrokerSyncAllResult> {
    return this.runSyncAll(this.ctrader, connectionIds);
  }

  private async runConnectionSync(
    poller: BrokerSyncJobPoller,
    connectionId: string,
    operation?: BrokerClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    if (this.stopped) return this.emptyResult();
    poller.assertOperationScope(connectionId, operation);
    const vaultId = await getTradeProjectionVaultId(this.plugin);
    const currentOperation =
      operation ??
      (await poller.diagnostics.createConnectionOperation(
        vaultId,
        connectionId,
        poller.provider.id
      ));
    const ownershipChanged = createTradeProjectionOwnershipGuard(
      this.plugin,
      currentOperation.ownerUserId
    );
    if (this.stopped || ownershipChanged()) {
      throw new Error('Trade Projection sync stopped');
    }
    const job = await poller.startSync(connectionId, currentOperation);
    if (this.stopped || ownershipChanged()) {
      throw new Error('Trade Projection sync stopped');
    }
    return this.runProjectionHandoff(
      poller,
      connectionId,
      job.id,
      currentOperation
    );
  }

  private async runProjectionHandoff(
    poller: BrokerSyncJobPoller,
    connectionId: string,
    jobId: string,
    operation?: BrokerClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    if (this.stopped) return this.emptyResult();
    poller.assertOperationScope(connectionId, operation);
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
    const cloudStatus = await poller.waitForCompletion(
      connectionId,
      jobId,
      currentOperation
    );
    assertHandoffOwner();
    await this.waitForActiveSync(assertHandoffOwner);
    assertHandoffOwner();
    const projectionOperation =
      await this.diagnostics.createProjectionOperation(
        currentOperation?.vaultId ??
          (await getTradeProjectionVaultId(this.plugin)),
        poller.provider.id
      );
    assertHandoffOwner();
    const result = await this.syncProjections(projectionOperation);
    assertHandoffOwner();
    return cloudStatus === 'partial' ? { ...result, partial: true } : result;
  }

  private async runSyncAll(
    poller: BrokerSyncJobPoller,
    connectionIds: string[]
  ): Promise<BrokerSyncAllResult> {
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
    const diagnostics = poller.diagnostics;
    const settled = await Promise.allSettled(
      uniqueConnectionIds.map(async (connectionId) => {
        assertSyncOwner();
        const operation = await diagnostics.createConnectionOperation(
          vaultId,
          connectionId,
          poller.provider.id
        );
        assertSyncOwner();
        const job = await poller.startSync(connectionId, operation);
        assertSyncOwner();
        const { status } = await poller.waitForTerminalStatus(
          connectionId,
          job.id,
          { ...operation, jobId: job.id }
        );
        assertSyncOwner();
        return {
          connectionId,
          status,
        } satisfies BrokerConnectionSyncOutcome;
      })
    );
    assertSyncOwner();
    const outcomes = settled.map(
      (outcome, index): BrokerConnectionSyncOutcome =>
        outcome.status === 'fulfilled'
          ? outcome.value
          : {
              connectionId: uniqueConnectionIds[index],
              status: 'request_failed',
            }
    );
    assertSyncOwner();
    const projectionOperation =
      await this.diagnostics.createProjectionOperation(
        vaultId,
        poller.provider.id,
        syncRunId
      );
    assertSyncOwner();
    await this.waitForActiveSync(assertSyncOwner);
    assertSyncOwner();
    const projection = await this.syncProjections(projectionOperation);
    assertSyncOwner();
    return { outcomes, projection };
  }

  private async waitForActiveSync(assertOwner: () => void): Promise<void> {
    while (this.activeSync) {
      await Promise.allSettled([this.activeSync]);
      assertOwner();
    }
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

  private emptyResult(): TradeProjectionSyncResult {
    return emptyTradeProjectionSyncResult();
  }

  private stop(): void {
    if (this.stopped) return;
    this.stopped = true;
    this.diagnostics.dispose();
    for (const timerId of this.timerIds) window.clearTimeout(timerId);
    this.timerIds.clear();
    for (const resolve of this.sleepResolvers.values()) resolve();
    this.sleepResolvers.clear();
  }
}
