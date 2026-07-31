import type JournalitPlugin from '../../main';

import { BackendTradeImportService } from '../tradeImport/BackendTradeImportService';
import { TradeImportWorkflowService } from '../tradeImport/TradeImportWorkflowService';
import {
  clearLocalDeletedTradeProjection,
  restoreTradeProjectionAtomically,
} from './TradeProjectionAckQueue';
import { BackendTradeProjectionService } from './BackendTradeProjectionService';
import { loadAllProjectionPages } from './TradeProjectionPagination';
import { createTradeProjectionOwnershipGuard } from './TradeProjectionOwnership';
import type {
  TradeProjection,
  TradeProjectionAccountInventoryItem,
  TradovateClientOperationContext,
} from './types';

const RESTORE_PAGE_LIMIT = 100;

async function loadAllRestorableProjections(
  workflowService: TradeImportWorkflowService,
  accountId: string,
  shouldStop: () => boolean
): Promise<TradeProjection[]> {
  return loadAllProjectionPages(
    async (cursor) => {
      if (shouldStop()) throw new Error('Trade Projection recovery stopped');
      const response = await workflowService.getRestorableProjections({
        accountId,
        includeLocalDeleted: true,
        includeConflict: true,
        limit: RESTORE_PAGE_LIMIT,
        cursor,
      });
      if (shouldStop()) throw new Error('Trade Projection recovery stopped');
      return response;
    },
    (projection) => projection.projectionStatus !== 'synced'
  );
}

interface RestoreProjectionAccountOptions {
  account: TradeProjectionAccountInventoryItem;
  vaultId: string;
  localAccountId: string;
  localAccountName: string;
  brokerLabel: string;
  clientOperation: TradovateClientOperationContext;
}

type RecoveryResult = Awaited<
  ReturnType<TradeImportWorkflowService['restoreProjections']>
>;

export class TradeProjectionAccountRecoveryService {
  private readonly workflowService: TradeImportWorkflowService;

  constructor(
    private readonly plugin: JournalitPlugin,
    private readonly projectionBackendService = new BackendTradeProjectionService()
  ) {
    this.workflowService = new TradeImportWorkflowService(
      plugin,
      new BackendTradeImportService(),
      projectionBackendService
    );
  }

  async restoreAccount({
    account,
    vaultId,
    localAccountId,
    localAccountName,
    brokerLabel,
    clientOperation,
  }: RestoreProjectionAccountOptions): Promise<RecoveryResult | null> {
    const shouldStop = createTradeProjectionOwnershipGuard(
      this.plugin,
      clientOperation.ownerUserId
    );
    if (shouldStop()) return null;
    await this.projectionBackendService.updateAccountVaultMapping(
      account.accountId,
      {
        vaultId,
        localAccountId,
        localAccountName,
        mappingStatus: 'mapped',
        pluginVersion: clientOperation.pluginVersion,
        clientOperationId: clientOperation.clientOperationId,
      }
    );
    if (shouldStop()) return null;

    let restorableProjections = await loadAllRestorableProjections(
      this.workflowService,
      account.accountId,
      shouldStop
    );
    if (!restorableProjections.length) return null;

    const restoredProjectionIds = new Set<string>();
    
    
    try {
      for (const projection of restorableProjections) {
        if (shouldStop()) return null;
        if (projection.projectionStatus === 'local_deleted') {
          await restoreTradeProjectionAtomically(
            this.plugin,
            projection.id,
            async () => {
              if (shouldStop())
                throw new Error('Trade Projection recovery stopped');
              const restored =
                await this.projectionBackendService.restoreProjection(
                  projection.id,
                  vaultId,
                  clientOperation
                );
              if (shouldStop())
                throw new Error('Trade Projection recovery stopped');
              return restored;
            }
          );
          restoredProjectionIds.add(projection.id);
        } else {
          await clearLocalDeletedTradeProjection(this.plugin, projection.id);
        }
      }
    } catch (error) {
      if (shouldStop()) return null;
      throw error;
    }

    if (restoredProjectionIds.size > 0) {
      const refreshed = await loadAllRestorableProjections(
        this.workflowService,
        account.accountId,
        shouldStop
      );
      const refreshedById = new Map(
        refreshed.map((projection) => [projection.id, projection])
      );
      restorableProjections = restorableProjections.map((projection) => {
        if (!restoredProjectionIds.has(projection.id)) return projection;
        const current = refreshedById.get(projection.id);
        if (!current) throw new Error('Restored projection is not available');
        return current;
      });
    }

    if (shouldStop()) return null;
    return this.workflowService.restoreProjections({
      accountName: localAccountName,
      brokerLabel,
      projections: restorableProjections,
      localWriteTimeoutMs: 30000,
      ownerUserId: clientOperation.ownerUserId,
      shouldStop,
      clientOperation,
    });
  }
}
