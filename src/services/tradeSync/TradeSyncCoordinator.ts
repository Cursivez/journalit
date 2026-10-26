import { Notice } from 'obsidian';
import { t } from '../../lang/helpers';
import type JournalitPlugin from '../../main';
import { BackendSecretStorage } from '../backend/BackendSecretStorage';
import {
  METATRADER_SYNC_ENTITLEMENT_UNVERIFIED_STATUS,
  METATRADER_SYNC_NOT_ENTITLED_STATUS,
  type MetaTraderSyncResult,
  type SyncResponse,
} from '../backend/types';
import { SubscriptionTierService } from '../backend/SubscriptionTierService';
import type { SubscriptionTierRefreshResult } from '../backend/SubscriptionTierService';
import { logger } from '../../utils/logger';
import { CTraderBrokerSyncClient } from './CTraderBrokerSyncClient';
import { HyperliquidBrokerSyncClient } from './HyperliquidBrokerSyncClient';
import { TradovateBrokerSyncClient } from './TradovateBrokerSyncClient';
import { RithmicBrokerSyncClient } from './RithmicBrokerSyncClient';
import {
  brokerProviderUnavailableReason,
  type BrokerProviderUnavailableReason,
} from './http';
import { TradeProjectionClient } from './TradeProjectionClient';
import { getTradeProjectionVaultId } from './TradeProjectionAckQueue';
import {
  createTradeSyncAccountMappingIndex,
  createTradeSyncLocalAccountResolver,
  loadTradeSyncLocalAccounts,
} from './TradeSyncAccountMappings';
import {
  connectionHasRunningJob,
  oauthBrokerConnectionSyncEligibility,
  rithmicConnectionSyncEligibility,
  type TradeSyncConnectionEligibility,
  type TradeSyncEligibilityOptions,
} from './TradeSyncEligibility';
import type {
  BrokerSyncAllResult,
  BrokerSyncProviderId,
  CTraderConnection,
  CTraderConnections,
  HyperliquidConnection,
  HyperliquidConnections,
  RithmicConnections,
  TradeProjectionSyncResult,
  TradovateConnection,
  TradovateConnections,
} from './types';
import { brokerConnectionSyncFailed, partialIsProviderOnly } from './types';
import type { TradeOperationResult } from '../tradeOperations/types';
import {
  buildProjectionSyncOperationResult,
  combineAggregateTradeProjectionSnapshots,
  combineTradeProjectionSyncResults,
} from '../tradeOperations/resultBuilders';
import { getTradeProjectionOwnerId } from './TradeProjectionOwnership';
import { shouldAnnounceSyncCompletion } from '../tradeOperations/presentationPolicy';

type TradeSyncSourceId = 'metatrader' | BrokerSyncProviderId;

type TradeSyncSourceOutcome =
  | {
      source: TradeSyncSourceId;
      status: 'succeeded';
      importedCount: number;
    }
  | {
      source: TradeSyncSourceId;
      status: 'partial';
      importedCount: number;
      
      providerOnly: boolean;
    }
  | {
      source: TradeSyncSourceId;
      status: 'skipped';
      reason:
        | 'busy'
        | 'cancelled'
        | 'mapping-required'
        | 'not-ready'
        | 'tier'
        | 'unverified';
    }
  | {
      source: TradeSyncSourceId;
      status: 'failed';
    };

interface TradeSyncNowResult {
  status: 'completed' | 'partial' | 'failed' | 'no-sources' | 'offline';
  outcomes: TradeSyncSourceOutcome[];
  importedCount: number;
  operationResult?: TradeOperationResult;
}

export type TradeSyncNowSnapshot =
  | { status: 'idle' }
  | { status: 'running'; startedAt: number };

interface MetaTraderSyncService {
  forceSyncImmediate(options?: {
    showUserFeedback?: boolean;
    recordOperationResult?: boolean;
  }): Promise<MetaTraderSyncResult | null>;
  getIsSyncing(): boolean;
}

interface BrokerProjectionSyncService {
  syncAll(connectionIds: string[]): Promise<BrokerSyncAllResult>;
  syncRithmicAll(connectionIds: string[]): Promise<BrokerSyncAllResult>;
  syncCTraderAll(connectionIds: string[]): Promise<BrokerSyncAllResult>;
  syncHyperliquidAll(connectionIds: string[]): Promise<BrokerSyncAllResult>;
}

interface TradeSyncCoordinatorDependencies {
  getBackendService(): Promise<MetaTraderSyncService>;
  getProjectionService(): BrokerProjectionSyncService;
  getTradovateConnections(): Promise<TradovateConnections>;
  getRithmicConnections(): Promise<RithmicConnections>;
  getCTraderConnections(): Promise<CTraderConnections>;
  getHyperliquidConnections(): Promise<HyperliquidConnections>;
  getMappedCanonicalAccountIds(): Promise<ReadonlySet<string>>;
  refreshEntitlements(): Promise<SubscriptionTierRefreshResult>;
  hasAuthToken(): boolean;
  isOnline(): boolean;
  notify(message: string, timeout?: number): void;
  recordResult(result: TradeOperationResult): TradeOperationResult | null;
  requestUpgrade(featureName: string): void;
}

interface BrokerDiscovery {
  configured: boolean;
  connectionIds: string[];
  unavailableReason?: BrokerProviderUnavailableReason;
  failed: boolean;
  mappingRequired: boolean;
  partial: boolean;
}

interface BrokerDiscoveryOptions<TConnection extends { id: string }> {
  logLabel: string;
  unavailableOptions?: Parameters<typeof brokerProviderUnavailableReason>[1];
  eligibility(
    connection: TConnection,
    options: TradeSyncEligibilityOptions
  ): TradeSyncConnectionEligibility;
  mappingUnavailableFallback?(connections: readonly TConnection[]): {
    connectionIds: string[];
    hadCandidates: boolean;
  };
}

function brokerDiscovery(
  configured: boolean,
  overrides: Partial<Omit<BrokerDiscovery, 'configured'>> = {}
): BrokerDiscovery {
  return {
    configured,
    connectionIds: [],
    failed: false,
    mappingRequired: false,
    partial: false,
    ...overrides,
  };
}

type SettledResult<T> =
  | { status: 'fulfilled'; value: T }
  | { status: 'rejected'; reason: unknown };

function settle<T>(promise: Promise<T>): Promise<SettledResult<T>> {
  return promise.then(
    (value) => ({ status: 'fulfilled', value }),
    (reason: unknown) => ({ status: 'rejected', reason })
  );
}

function createDefaultDependencies(
  plugin: JournalitPlugin
): TradeSyncCoordinatorDependencies {
  const tradovateClient = new TradovateBrokerSyncClient();
  const rithmicClient = new RithmicBrokerSyncClient();
  const cTraderClient = new CTraderBrokerSyncClient();
  const hyperliquidClient = new HyperliquidBrokerSyncClient();
  const projectionClient = new TradeProjectionClient();
  return {
    getBackendService: () =>
      plugin.serviceManager.getBackendIntegrationService(),
    getProjectionService: () => plugin.ensureTradeProjectionSyncService(),
    getTradovateConnections: () =>
      tradovateClient.getTradovateConnections({
        interactiveEntitlement: false,
      }),
    getRithmicConnections: () =>
      rithmicClient.getRithmicConnections({ interactiveEntitlement: false }),
    getCTraderConnections: () =>
      cTraderClient.getCTraderConnections({ interactiveEntitlement: false }),
    getHyperliquidConnections: () =>
      hyperliquidClient.getHyperliquidConnections({
        interactiveEntitlement: false,
      }),
    refreshEntitlements: () =>
      new SubscriptionTierService(plugin).refreshTier('quick trade sync'),
    getMappedCanonicalAccountIds: async () => {
      const vaultId = await getTradeProjectionVaultId(plugin);
      const [inventory, localAccounts] = await Promise.all([
        projectionClient.getAccountInventory(vaultId, {
          interactiveEntitlement: false,
        }),
        loadTradeSyncLocalAccounts(plugin),
      ]);
      const mappingByAccountId = createTradeSyncAccountMappingIndex(
        inventory.accounts
      );
      const localAccountResolver =
        createTradeSyncLocalAccountResolver(localAccounts);
      const mappedAccountIds = new Set<string>();
      for (const account of inventory.accounts) {
        if (
          localAccountResolver.resolveMapping(
            mappingByAccountId.get(account.accountId)
          )
        ) {
          mappedAccountIds.add(account.accountId);
        }
      }
      return mappedAccountIds;
    },
    hasAuthToken: () => Boolean(BackendSecretStorage.getAuthToken(plugin)),
    isOnline: () => navigator.onLine,
    notify: (message, timeout) => {
      new Notice(message, timeout);
    },
    recordResult: (result) =>
      plugin.ensureTradeOperationResultService().record(result),
    requestUpgrade: (featureName) => {
      window.dispatchEvent(
        new CustomEvent('journalit:premium-required', {
          detail: { operation: featureName },
        })
      );
    },
  };
}

function classifyBrokerResult(
  source: BrokerSyncProviderId,
  result: BrokerSyncAllResult,
  importedCount: number
): TradeSyncSourceOutcome {
  const synchronizedCount = result.outcomes.filter(
    (outcome) => outcome.status === 'succeeded' || outcome.status === 'partial'
  ).length;
  const deliveryIssues =
    result.outcomes.some((outcome) =>
      brokerConnectionSyncFailed(outcome.status)
    ) ||
    result.projection.failedCount > 0 ||
    result.projection.pendingCount > 0 ||
    (result.projection.ackFailedCount ?? 0) > 0;
  const hasIssues =
    deliveryIssues ||
    result.outcomes.some((outcome) => outcome.status === 'partial');

  if (synchronizedCount === 0) {
    return importedCount > 0
      ? { source, status: 'partial', importedCount, providerOnly: false }
      : { source, status: 'failed' };
  }
  if (hasIssues) {
    return {
      source,
      status: 'partial',
      importedCount,
      providerOnly: !deliveryIssues,
    };
  }
  return { source, status: 'succeeded', importedCount };
}

function completedMetaTraderBatchOutcome(
  response: SyncResponse
): TradeSyncSourceOutcome | null {
  const hasBatchResult =
    response.synced_trades > 0 ||
    response.new_files > 0 ||
    response.updated_files > 0 ||
    response.errors.length > 0;
  return hasBatchResult
    ? {
        source: 'metatrader',
        status: 'partial',
        importedCount: response.new_files + response.updated_files,
        providerOnly: false,
      }
    : null;
}

export class TradeSyncCoordinator {
  private snapshot: TradeSyncNowSnapshot = { status: 'idle' };
  private readonly listeners = new Set<() => void>();
  private activeSync: Promise<TradeSyncNowResult> | null = null;
  private destroyed = false;

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly dependencies = createDefaultDependencies(plugin)
  ) {}

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  readonly getSnapshot = (): TradeSyncNowSnapshot => this.snapshot;

  syncNow(): Promise<TradeSyncNowResult> {
    if (this.activeSync) return this.activeSync;
    if (this.destroyed) {
      return Promise.resolve(this.abortedResult());
    }

    this.setSnapshot({ status: 'running', startedAt: Date.now() });
    this.activeSync = this.runSync().finally(() => {
      this.activeSync = null;
      this.setSnapshot({ status: 'idle' });
    });
    return this.activeSync;
  }

  async quiesceForSampleContext(): Promise<void> {
    if (this.activeSync) {
      await Promise.allSettled([this.activeSync]);
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.listeners.clear();
  }

  private async runSync(): Promise<TradeSyncNowResult> {
    if (!this.dependencies.isOnline()) {
      const result: TradeSyncNowResult = {
        status: 'offline',
        outcomes: [],
        importedCount: 0,
      };
      this.notify(t('trade-sync.quick.offline'));
      return result;
    }

    if (!this.dependencies.hasAuthToken()) {
      const result: TradeSyncNowResult = {
        status: 'no-sources',
        outcomes: [],
        importedCount: 0,
      };
      this.notify(t('notice.error.sign-in-sync'));
      return result;
    }

    const [
      entitlementRefresh,
      tradovateStatus,
      rithmicStatus,
      cTraderStatus,
      hyperliquidStatus,
    ] = await Promise.all([
      settle(this.dependencies.refreshEntitlements()),
      settle(this.dependencies.getTradovateConnections()),
      settle(this.dependencies.getRithmicConnections()),
      settle(this.dependencies.getCTraderConnections()),
      settle(this.dependencies.getHyperliquidConnections()),
    ]);
    if (this.destroyed) return this.abortedResult();
    if (entitlementRefresh.status === 'rejected') {
      logger.error(
        'Quick trade sync entitlement refresh failed',
        entitlementRefresh.reason
      );
    } else if (entitlementRefresh.value.status === 'free') {
      const result: TradeSyncNowResult = {
        status: 'no-sources',
        outcomes: [],
        importedCount: 0,
      };
      this.dependencies.requestUpgrade(t('trade-sync.providers.title'));
      return result;
    } else if (entitlementRefresh.value.status === 'signed_out') {
      const result: TradeSyncNowResult = {
        status: 'no-sources',
        outcomes: [],
        importedCount: 0,
      };
      this.notify(t('notice.error.sign-in-sync'));
      return result;
    }
    const initiatingOwnerUserId = getTradeProjectionOwnerId(this.plugin);
    if (!initiatingOwnerUserId) {
      const result: TradeSyncNowResult = {
        status: 'no-sources',
        outcomes: [],
        importedCount: 0,
      };
      this.notify(t('trade-sync.quick.not-ready'));
      return result;
    }
    this.notify(t('trade-sync.quick.started'), 2500);
    const hasConfiguredBroker = [
      tradovateStatus,
      rithmicStatus,
      cTraderStatus,
      hyperliquidStatus,
    ].some(
      (result) =>
        result.status === 'fulfilled' && result.value.connections.length > 0
    );
    let mappedAccountIds: SettledResult<ReadonlySet<string>> = {
      status: 'fulfilled',
      value: new Set<string>(),
    };
    if (hasConfiguredBroker) {
      try {
        const value = await this.dependencies.getMappedCanonicalAccountIds();
        if (this.destroyed) return this.abortedResult();
        mappedAccountIds = { status: 'fulfilled', value };
      } catch (error) {
        if (this.destroyed) return this.abortedResult();
        logger.error(
          'Quick trade sync account mapping discovery failed',
          error
        );
        mappedAccountIds = { status: 'rejected', reason: error };
      }
    }

    const tradovate = this.discoverTradovate(tradovateStatus, mappedAccountIds);
    const rithmic = this.discoverRithmic(rithmicStatus, mappedAccountIds);
    const cTrader = this.discoverCTrader(cTraderStatus, mappedAccountIds);
    const hyperliquid = this.discoverBroker<HyperliquidConnection>(
      hyperliquidStatus,
      mappedAccountIds,
      {
        logLabel: 'Hyperliquid',
        unavailableOptions: { allowHyperliquidDisabled: true },
        eligibility: oauthBrokerConnectionSyncEligibility,
      }
    );
    const brokers = [
      {
        id: 'tradovate',
        label: 'trade-sync.source.tradovate',
        discovery: tradovate,
      },
      {
        id: 'rithmic',
        label: 'trade-sync.source.rithmic',
        discovery: rithmic,
      },
      {
        id: 'ctrader',
        label: 'trade-sync.source.ctrader',
        discovery: cTrader,
      },
      {
        id: 'hyperliquid',
        label: 'trade-sync.source.hyperliquid',
        discovery: hyperliquid,
      },
    ] as const;
    const metaTraderConfigured = Boolean(
      this.plugin.settings.backendIntegration?.ftpUsername
    );
    const configuredSourceCount =
      Number(metaTraderConfigured) +
      brokers.filter(({ discovery }) => discovery.configured).length;
    const mappingRequiredSources = brokers.flatMap(({ discovery, label }) =>
      discovery.mappingRequired ? [t(label)] : []
    );

    if (configuredSourceCount === 0) {
      const hasTierRestriction = brokers.some(
        ({ discovery }) => discovery.unavailableReason === 'tier'
      );
      const result: TradeSyncNowResult = {
        status: 'no-sources',
        outcomes: [],
        importedCount: 0,
      };
      if (hasTierRestriction) {
        this.dependencies.requestUpgrade(t('trade-sync.providers.title'));
      } else {
        this.notify(t('trade-sync.quick.no-sources'));
      }
      return result;
    }

    if (this.destroyed) return this.abortedResult();
    const tasks: Promise<TradeSyncSourceOutcome>[] = [];
    const countedBrokerProjections = new WeakSet<TradeProjectionSyncResult>();
    const operationProjectionResults: TradeProjectionSyncResult[] = [];
    const brokerProjectionSnapshots: TradeProjectionSyncResult[] = [];
    if (metaTraderConfigured) {
      tasks.push(
        this.syncMetaTrader(operationProjectionResults, initiatingOwnerUserId)
      );
    }
    tasks.push(
      ...brokers.flatMap(({ id, discovery }) =>
        this.createBrokerTasks(
          id,
          discovery,
          countedBrokerProjections,
          brokerProjectionSnapshots
        )
      )
    );

    const outcomes = await Promise.all(tasks);
    if (this.destroyed) return this.abortedResult();
    const resultOutcomes = outcomes.filter(
      (outcome) =>
        outcome.status !== 'skipped' ||
        (outcome.reason !== 'busy' && outcome.reason !== 'not-ready')
    );
    const importedCount = outcomes.reduce(
      (total, outcome) =>
        outcome.status === 'succeeded' || outcome.status === 'partial'
          ? total + outcome.importedCount
          : total,
      0
    );
    const succeededCount = resultOutcomes.filter(
      (outcome) => outcome.status === 'succeeded'
    ).length;
    const completedCount = resultOutcomes.filter(
      (outcome) =>
        outcome.status === 'succeeded' || outcome.status === 'partial'
    ).length;
    const attemptedCount = outcomes.filter(
      (outcome) => outcome.status !== 'skipped'
    ).length;
    if (attemptedCount === 0) {
      const result: TradeSyncNowResult = {
        status: 'no-sources',
        outcomes,
        importedCount: 0,
      };
      const skipReasons = outcomes.flatMap((outcome) =>
        outcome.status === 'skipped' ? [outcome.reason] : []
      );
      if (skipReasons.includes('mapping-required')) {
        this.notify(
          t('trade-sync.quick.mapping-required', {
            imported: '0',
            providers: mappingRequiredSources.join(', '),
          })
        );
      } else if (skipReasons.includes('tier')) {
        this.dependencies.requestUpgrade(t('trade-sync.providers.title'));
      } else if (skipReasons.includes('unverified')) {
        this.notify(t('premium.gate.offline'));
      } else if (skipReasons.includes('cancelled')) {
        // intentional
        
      } else {
        this.notify(t('trade-sync.quick.not-ready'));
      }
      return result;
    }
    const hasIssues = resultOutcomes.some(
      (outcome) => outcome.status !== 'succeeded'
    );
    const status: TradeSyncNowResult['status'] =
      completedCount === 0 ? 'failed' : hasIssues ? 'partial' : 'completed';
    const latestBrokerProjection = combineAggregateTradeProjectionSnapshots(
      brokerProjectionSnapshots
    );
    const combinedProjectionResult = combineTradeProjectionSyncResults([
      ...operationProjectionResults,
      ...(latestBrokerProjection ? [latestBrokerProjection] : []),
    ]);
    const ownerUnchanged =
      Boolean(initiatingOwnerUserId) &&
      getTradeProjectionOwnerId(this.plugin) === initiatingOwnerUserId;
    const operationResult = ownerUnchanged
      ? this.dependencies.recordResult(
          buildProjectionSyncOperationResult({
            source: 'manual-sync',
            ownerUserId: initiatingOwnerUserId,
            result: {
              ...combinedProjectionResult,
              partial: status === 'partial' || combinedProjectionResult.partial,
              
              
              providerPartial:
                resultOutcomes.every(
                  (outcome) =>
                    outcome.status === 'succeeded' ||
                    (outcome.status === 'partial' && outcome.providerOnly)
                ) && partialIsProviderOnly(combinedProjectionResult),
            },
          })
        )
      : null;
    const result: TradeSyncNowResult = {
      status,
      outcomes,
      importedCount,
      ...(operationResult ? { operationResult } : {}),
    };

    if (status === 'failed') {
      this.notify(
        t('trade-sync.quick.failed', { sources: String(attemptedCount) })
      );
    }

    let completionMessage: string | null = null;
    if (mappingRequiredSources.length > 0) {
      completionMessage = t('trade-sync.quick.mapping-required', {
        imported: String(importedCount),
        providers: mappingRequiredSources.join(', '),
      });
    } else if (status === 'completed') {
      completionMessage = t('trade-sync.quick.complete', {
        imported: String(importedCount),
        sources: String(succeededCount),
      });
    } else if (status === 'partial') {
      completionMessage = t('trade-sync.quick.partial', {
        completed: String(completedCount),
        total: String(resultOutcomes.length),
        imported: String(importedCount),
      });
    }
    if (
      completionMessage &&
      (mappingRequiredSources.length > 0 ||
        (!operationResult && shouldAnnounceSyncCompletion(this.plugin)))
    ) {
      this.notify(completionMessage);
    }
    return result;
  }

  private async syncMetaTrader(
    operationProjectionResults: TradeProjectionSyncResult[],
    initiatingOwnerUserId: string
  ): Promise<TradeSyncSourceOutcome> {
    try {
      const backendService = await this.dependencies.getBackendService();
      if (this.destroyed) {
        return { source: 'metatrader', status: 'failed' };
      }
      if (backendService.getIsSyncing()) {
        return { source: 'metatrader', status: 'skipped', reason: 'busy' };
      }
      const syncResult = await backendService.forceSyncImmediate({
        showUserFeedback: false,
        
        recordOperationResult: false,
      });
      if (!syncResult || syncResult.ownerUserId !== initiatingOwnerUserId) {
        return { source: 'metatrader', status: 'failed' };
      }
      const { response, importedTrades, failedTradeWriteCount } = syncResult;
      if (importedTrades.length) {
        operationProjectionResults.push({
          accountCount: new Set(
            importedTrades.map((trade) => trade.accountName)
          ).size,
          writtenCount: importedTrades.length,
          failedCount: failedTradeWriteCount,
          pendingCount: 0,
          partial: response.status !== 'success' || response.errors.length > 0,
          importedTrades,
        });
      }
      switch (response.status) {
        case METATRADER_SYNC_NOT_ENTITLED_STATUS:
          return (
            completedMetaTraderBatchOutcome(response) ?? {
              source: 'metatrader',
              status: 'skipped',
              reason: 'tier',
            }
          );
        case METATRADER_SYNC_ENTITLEMENT_UNVERIFIED_STATUS:
          return (
            completedMetaTraderBatchOutcome(response) ?? {
              source: 'metatrader',
              status: 'skipped',
              reason: 'unverified',
            }
          );
        case 'cancelled':
          
          
          
          return importedTrades.length > 0 || failedTradeWriteCount > 0
            ? {
                source: 'metatrader',
                status: 'partial',
                importedCount: importedTrades.length,
                providerOnly: false,
              }
            : { source: 'metatrader', status: 'skipped', reason: 'cancelled' };
        case 'partial':
        case 'success': {
          const importedCount = response.new_files + response.updated_files;
          return response.status === 'partial' || response.errors.length > 0
            ? {
                source: 'metatrader',
                status: 'partial',
                importedCount,
                providerOnly: false,
              }
            : { source: 'metatrader', status: 'succeeded', importedCount };
        }
        default: {
          const unhandled: never = response.status;
          throw new Error(
            `Unhandled MetaTrader sync status: ${String(unhandled)}`
          );
        }
      }
    } catch (error) {
      logger.error('Quick MetaTrader sync failed', error);
      return { source: 'metatrader', status: 'failed' };
    }
  }

  private createBrokerTasks(
    source: BrokerSyncProviderId,
    discovery: BrokerDiscovery,
    countedProjections: WeakSet<TradeProjectionSyncResult>,
    brokerProjectionSnapshots: TradeProjectionSyncResult[]
  ): Promise<TradeSyncSourceOutcome>[] {
    if (discovery.failed) {
      return [Promise.resolve({ source, status: 'failed' })];
    }
    if (!discovery.configured) return [];
    if (discovery.connectionIds.length === 0) {
      return [
        Promise.resolve({
          source,
          status: 'skipped',
          reason: discovery.mappingRequired ? 'mapping-required' : 'not-ready',
        }),
      ];
    }

    const projectionService = this.dependencies.getProjectionService();
    const task = this.syncBrokerConnections(
      projectionService,
      source,
      discovery.connectionIds
    );
    return [
      task
        .then((result): TradeSyncSourceOutcome => {
          const projectionAlreadyCounted = countedProjections.has(
            result.projection
          );
          countedProjections.add(result.projection);
          if (!projectionAlreadyCounted) {
            brokerProjectionSnapshots.push(result.projection);
          }
          const outcome = classifyBrokerResult(
            source,
            result,
            projectionAlreadyCounted ? 0 : result.projection.writtenCount
          );
          
          
          return discovery.partial &&
            (outcome.status === 'succeeded' || outcome.status === 'partial')
            ? {
                source,
                status: 'partial',
                importedCount: outcome.importedCount,
                providerOnly: false,
              }
            : outcome;
        })
        .catch((error: unknown) => {
          logger.error(`Quick ${source} sync failed`, error);
          return { source, status: 'failed' } as const;
        }),
    ];
  }

  private syncBrokerConnections(
    projectionService: BrokerProjectionSyncService,
    source: BrokerSyncProviderId,
    connectionIds: string[]
  ): Promise<BrokerSyncAllResult> {
    switch (source) {
      case 'tradovate':
        return projectionService.syncAll(connectionIds);
      case 'rithmic':
        return projectionService.syncRithmicAll(connectionIds);
      case 'ctrader':
        return projectionService.syncCTraderAll(connectionIds);
      case 'hyperliquid':
        return projectionService.syncHyperliquidAll(connectionIds);
      default: {
        const _exhaustive: never = source;
        return _exhaustive;
      }
    }
  }

  private discoverTradovate(
    statusResult: SettledResult<TradovateConnections>,
    mappedAccountIds: SettledResult<ReadonlySet<string>>
  ): BrokerDiscovery {
    return this.discoverBroker<TradovateConnection>(
      statusResult,
      mappedAccountIds,
      {
        logLabel: 'Tradovate',
        eligibility: oauthBrokerConnectionSyncEligibility,
      }
    );
  }

  private discoverCTrader(
    statusResult: SettledResult<CTraderConnections>,
    mappedAccountIds: SettledResult<ReadonlySet<string>>
  ): BrokerDiscovery {
    return this.discoverBroker<CTraderConnection>(
      statusResult,
      mappedAccountIds,
      {
        logLabel: 'cTrader',
        unavailableOptions: { allowCTraderDisabled: true },
        eligibility: oauthBrokerConnectionSyncEligibility,
      }
    );
  }

  private discoverRithmic(
    statusResult: SettledResult<RithmicConnections>,
    mappedAccountIds: SettledResult<ReadonlySet<string>>
  ): BrokerDiscovery {
    return this.discoverBroker(statusResult, mappedAccountIds, {
      logLabel: 'Rithmic',
      unavailableOptions: { allowRithmicDisabled: true },
      eligibility: rithmicConnectionSyncEligibility,
      mappingUnavailableFallback: (connections) => {
        const candidates = connections.filter(
          (connection) => connection.status === 'setup_required'
        );
        return {
          connectionIds: candidates.flatMap((connection) =>
            connectionHasRunningJob(connection) ? [] : [connection.id]
          ),
          hadCandidates: candidates.length > 0,
        };
      },
    });
  }

  private discoverBroker<TConnection extends { id: string }>(
    statusResult: SettledResult<{ connections: TConnection[] }>,
    mappedAccountIds: SettledResult<ReadonlySet<string>>,
    options: BrokerDiscoveryOptions<TConnection>
  ): BrokerDiscovery {
    if (statusResult.status === 'rejected') {
      const unavailableReason = brokerProviderUnavailableReason(
        statusResult.reason,
        options.unavailableOptions
      );
      if (unavailableReason) {
        return brokerDiscovery(false, { unavailableReason });
      }
      logger.error(
        `${options.logLabel} quick sync discovery failed`,
        statusResult.reason
      );
      return brokerDiscovery(true, { failed: true });
    }

    const connections = statusResult.value.connections;
    if (connections.length === 0) return brokerDiscovery(false);
    if (mappedAccountIds.status === 'rejected') {
      const fallback = options.mappingUnavailableFallback?.(connections) ?? {
        connectionIds: [],
        hadCandidates: false,
      };
      return brokerDiscovery(true, {
        connectionIds: fallback.connectionIds,
        failed: !fallback.hadCandidates,
        partial: fallback.connectionIds.length > 0,
      });
    }

    const eligibility = connections.map((connection) => ({
      connection,
      result: options.eligibility(connection, {
        hasUnsavedChanges: false,
        isAccountMapped: (canonicalAccountId) =>
          mappedAccountIds.value.has(canonicalAccountId),
      }),
    }));
    const mappingRequired = eligibility.some(
      ({ result }) => result === 'mapping-required'
    );
    return brokerDiscovery(true, {
      connectionIds: eligibility.flatMap(({ connection, result }) =>
        result === true ? [connection.id] : []
      ),
      mappingRequired,
      partial: mappingRequired,
    });
  }

  private abortedResult(): TradeSyncNowResult {
    return { status: 'failed', outcomes: [], importedCount: 0 };
  }

  private setSnapshot(snapshot: TradeSyncNowSnapshot): void {
    if (this.destroyed) return;
    this.snapshot = snapshot;
    for (const listener of this.listeners) listener();
  }

  private notify(message: string, timeout?: number): void {
    if (this.destroyed) return;
    if (timeout === undefined) {
      this.dependencies.notify(message);
      return;
    }
    this.dependencies.notify(message, timeout);
  }
}
