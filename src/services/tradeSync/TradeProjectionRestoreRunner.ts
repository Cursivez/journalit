

import type JournalitPlugin from '../../main';
import { logger } from '../../utils/logger';
import { ApiClient } from '../backend/ApiClient';
import { SubscriptionTierService } from '../backend/SubscriptionTierService';
import type { TradeProjectionClient } from './TradeProjectionClient';
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
import type {
  BrokerSyncAccountBinding,
  BrokerSyncDiagnostics,
  BrokerSyncProvider,
} from './BrokerSyncProvider';
import type {
  BrokerClientOperationContext,
  TradeProjection,
  TradeProjectionSyncResult,
} from './types';

const PAGE_LIMIT = 100;

export function emptyTradeProjectionSyncResult(): TradeProjectionSyncResult {
  return {
    accountCount: 0,
    writtenCount: 0,
    failedCount: 0,
    pendingCount: 0,
  };
}

export class TradeProjectionRestoreRunner {
  private readonly mappings: TradeProjectionAccountMappingService;
  private readonly restoreService: TradeProjectionRestoreService;

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly projectionClient: TradeProjectionClient,
    private readonly diagnostics: BrokerSyncDiagnostics,
    private readonly providers: BrokerSyncProvider[],
    private readonly isStopped: () => boolean
  ) {
    this.mappings = new TradeProjectionAccountMappingService(projectionClient);
    this.restoreService = new TradeProjectionRestoreService(
      plugin,
      projectionClient
    );
  }

  async run(
    operation?: BrokerClientOperationContext
  ): Promise<TradeProjectionSyncResult> {
    await this.plugin.canonicalProjectionMigrationService?.run();
    if (this.isStopped()) return emptyTradeProjectionSyncResult();
    if (!ApiClient.getAuthToken() || navigator.onLine === false) {
      return emptyTradeProjectionSyncResult();
    }
    if (
      this.plugin.settings.backendIntegration?.subscriptionTier !== 'premium'
    ) {
      return emptyTradeProjectionSyncResult();
    }
    const initiatingUserId = await this.resolveProjectionOwner();
    if (!initiatingUserId) return emptyTradeProjectionSyncResult();
    const ownershipChanged = createTradeProjectionOwnershipGuard(
      this.plugin,
      initiatingUserId
    );
    const shouldStop = () => this.isStopped() || ownershipChanged();
    async function completeWhileOwned<T>(
      work: () => Promise<T>
    ): Promise<{ value: T } | null> {
      if (shouldStop()) return null;
      const value = await work();
      return shouldStop() ? null : { value };
    }
    if (!(await completeWhileOwned(() => this.diagnostics.flush()))) {
      return emptyTradeProjectionSyncResult();
    }
    if (
      !(await completeWhileOwned(() =>
        flushTradeProjectionAcks(this.plugin, this.projectionClient, {
          interactiveEntitlement: false,
        })
      ))
    ) {
      return emptyTradeProjectionSyncResult();
    }
    const vaultResult = await completeWhileOwned(() =>
      getTradeProjectionVaultId(this.plugin)
    );
    if (!vaultResult) return emptyTradeProjectionSyncResult();
    const vaultId = vaultResult.value;
    const inventoryResult = await completeWhileOwned(() =>
      Promise.all([
        this.mappings.getInventory(vaultId, {
          interactiveEntitlement: false,
        }),
        this.loadAccountBindings(),
      ])
    );
    if (!inventoryResult) return emptyTradeProjectionSyncResult();
    const [inventory, connectionIdByCanonicalAccountId] = inventoryResult.value;
    if (operation) {
      await this.diagnostics.record(operation, {
        eventType: 'projection_inventory_loaded',
        ...(inventory.accounts.length > 0
          ? { count: inventory.accounts.length }
          : {}),
      });
    }
    const brokerAccounts = inventory.accounts.flatMap((account) => {
      const binding = connectionIdByCanonicalAccountId.get(account.accountId);
      return binding ? [{ account, binding }] : [];
    });
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
      BrokerClientOperationContext
    >();
    
    
    const recordMappingMissing = async (canonicalAccountId: string) => {
      if (!operation) return;
      const binding = connectionIdByCanonicalAccountId.get(canonicalAccountId);
      if (!binding) return;
      const { connectionId, provider } = binding;
      let diagnosticOperation = mappingDiagnosticOperations.get(connectionId);
      if (!diagnosticOperation) {
        diagnosticOperation = await this.diagnostics.createConnectionOperation(
          vaultId,
          connectionId,
          provider
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
    
    
    for (const { account, binding } of brokerAccounts) {
      if (shouldStop()) return emptyTradeProjectionSyncResult();
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
        clientOperation: operation
          ? { ...operation, provider: binding.provider }
          : undefined,
      });
      writtenCount += result.writtenCount + result.duplicateCount;
      failedCount += result.failedCount + result.ackFailedCount;
      pendingCount += result.pendingCount;
    }
    return {
      accountCount: brokerAccounts.length,
      writtenCount,
      failedCount,
      pendingCount,
    };
  }

  
  private async loadAccountBindings(): Promise<
    Map<string, BrokerSyncAccountBinding>
  > {
    const bindingLists = await Promise.all(
      this.providers.map((provider) =>
        provider.listSyncEnabledAccountBindings()
      )
    );
    const connectionIdByCanonicalAccountId = new Map<
      string,
      BrokerSyncAccountBinding
    >();
    for (const bindings of bindingLists) {
      for (const binding of bindings) {
        connectionIdByCanonicalAccountId.set(
          binding.canonicalAccountId,
          binding
        );
      }
    }
    return connectionIdByCanonicalAccountId;
  }

  private async resolveProjectionOwner(): Promise<string> {
    const existingOwner = getTradeProjectionOwnerId(this.plugin);
    if (existingOwner) return existingOwner;

    await new SubscriptionTierService(this.plugin).refreshTier(
      'trade projection owner bootstrap'
    );
    return getTradeProjectionOwnerId(this.plugin);
  }

  private async loadAccountProjections(
    vaultId: string,
    accountId: string,
    shouldStop: () => boolean
  ): Promise<TradeProjection[]> {
    return loadAllProjectionPages(async (cursor) => {
      if (shouldStop()) throw new Error('Trade Projection sync stopped');
      const response = await this.projectionClient.getRestorableProjections(
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
