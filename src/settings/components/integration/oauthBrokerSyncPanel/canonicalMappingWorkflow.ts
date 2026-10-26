

import { Notice } from 'obsidian';
import { t } from '../../../../lang/helpers';
import type { BrokerSyncAccountBinding } from '../../../../services/tradeSync/BrokerSyncProvider';
import {
  isTradeProjectionAccountNotFoundError,
  isTradeProjectionAccountRemapConflictError,
  isTradeProjectionAccountRemapUnavailableError,
  type TradeProjectionClient,
} from '../../../../services/tradeSync/TradeProjectionClient';
import {
  isTradeSyncRateLimitError,
  tradeSyncRateLimitMessage,
} from '../../../../services/tradeSync/TradeSyncRateLimit';
import type {
  BrokerClientOperationContext,
  TradeProjectionAccountInventoryItem,
  TradeProjectionAccountVaultRemapResponse,
  TradeProjectionSyncResult,
} from '../../../../services/tradeSync/types';
import { logger } from '../../../../utils/logger';
import { generateUUID } from '../../../../utils/uuid';
import type { LocalAccountOption } from '../brokerSyncKit/types';
import {
  collectPendingRewriteAccountUpdates,
  deliverableOutstandingCountForAccounts,
  expectedScheduledRewriteCount,
  isNoOpTradeProjectionSyncResult,
  mergePendingRewriteWork,
  oauthBrokerRemapRestoreBindings,
  planOAuthBrokerMappingWrites,
  remapRestoreAccountIds,
  removePendingRewriteAccounts,
  type OAuthBrokerMappingRemapDecision,
  type OAuthBrokerPendingRewriteAccount,
  type OAuthBrokerPendingRewriteWork,
} from './accountMappingRemap';
import type { AccountDrafts } from './drafts';
import type { OAuthBrokerConnection } from './types';

export function projectionResultHasIssues(
  result: TradeProjectionSyncResult | undefined
): boolean {
  return Boolean(
    result &&
    (result.partial || result.failedCount > 0 || result.pendingCount > 0)
  );
}


export function canonicalMappingFailureNotice(
  error: unknown,
  fallback: (error: unknown) => string
): string {
  if (isTradeSyncRateLimitError(error)) {
    return tradeSyncRateLimitMessage(error.retryAt, error.action);
  }
  if (isTradeProjectionAccountNotFoundError(error)) {
    return t('trade-sync.oauth.remap.account-unavailable');
  }
  if (isTradeProjectionAccountRemapUnavailableError(error)) {
    return t('trade-sync.oauth.remap.unavailable');
  }
  if (isTradeProjectionAccountRemapConflictError(error)) {
    switch (error.conflict) {
      case 'projection_restore_in_progress':
        return t('trade-sync.oauth.remap.restore-in-progress');
      case 'remap_operation_conflict':
        return t('trade-sync.oauth.remap.operation-conflict');
      case 'account_remap_busy':
        return t('trade-sync.oauth.remap.account-busy');
      default: {
        const _exhaustive: never = error.conflict;
        return _exhaustive;
      }
    }
  }
  return fallback(error);
}


export function noticeUniqueMappingFailures(
  errors: unknown[],
  logLabel: string,
  format: (error: unknown) => string
): void {
  const seen = new Set<string>();
  for (const error of errors) {
    logger.error(logLabel, error);
    const text = format(error);
    if (seen.has(text)) continue;
    seen.add(text);
    new Notice(text);
  }
}

type CanonicalMappingBackend = Pick<
  TradeProjectionClient,
  | 'getAccountInventory'
  | 'updateAccountVaultMapping'
  | 'remapAccountVaultMapping'
>;


interface CanonicalMappingsPersisted {
  persistedLocalAccountIds: Map<string, string>;
  pendingAccounts: Record<string, OAuthBrokerPendingRewriteAccount>;
  completedAccountIds: string[];
}


type CanonicalRewriteSettlement =
  | { kind: 'delivered'; accountIds: string[] }
  | {
      kind: 'unfinished';
      updates: Record<string, OAuthBrokerPendingRewriteAccount>;
    };

interface CanonicalMappingWorkflowInput {
  connection: OAuthBrokerConnection;
  drafts: AccountDrafts;
  mappingDirty: Record<string, true>;
  localAccounts: LocalAccountOption[];
  
  pendingWork: OAuthBrokerPendingRewriteWork | null;
  operation: BrokerClientOperationContext;
  backend: CanonicalMappingBackend;
  enqueue: (
    canonicalAccountId: string,
    update: () => Promise<void>
  ) => Promise<void>;
  confirmRemap: (
    newAccountName: string
  ) => Promise<OAuthBrokerMappingRemapDecision>;
  
  assertOwnership: () => void;
  createProjectionOperation: () => Promise<BrokerClientOperationContext>;
  restore: (
    bindings: BrokerSyncAccountBinding[],
    operation: BrokerClientOperationContext
  ) => Promise<TradeProjectionSyncResult>;
  onRateLimited: (canonicalAccountId: string, retryAt: number) => void;
  
  onMappingsPersisted: (persisted: CanonicalMappingsPersisted) => void;
  logLabel: string;
}

type CanonicalMappingWorkflowOutcome =
  | { status: 'cancelled' }
  | {
      status: 'applied';
      mappingFailures: unknown[];
      remapProjection?: TradeProjectionSyncResult;
      restoreFailure?: unknown;
      rewriteUnfinished: boolean;
      unfinishedCount: number;
      preservedConflictCount: number;
      
      remapHasIssues: boolean;
      
      settlement?: CanonicalRewriteSettlement;
    };


export function prepareCanonicalPendingRewrite(
  persisted: CanonicalMappingsPersisted,
  currentEpoch: number,
  scope: { vaultId: string; ownerUserId: string }
): {
  epoch: number;
  transition: (
    current: OAuthBrokerPendingRewriteWork | null
  ) => OAuthBrokerPendingRewriteWork | null;
} {
  const epoch =
    Object.keys(persisted.pendingAccounts).length > 0
      ? currentEpoch + 1
      : currentEpoch;
  return {
    epoch,
    transition: (current) =>
      mergePendingRewriteWork({
        current: removePendingRewriteAccounts(
          current,
          persisted.completedAccountIds,
          scope
        ),
        vaultId: scope.vaultId,
        ownerUserId: scope.ownerUserId,
        epoch,
        accounts: persisted.pendingAccounts,
      }),
  };
}


export function applyCanonicalRewriteSettlement(
  current: OAuthBrokerPendingRewriteWork | null,
  settlement: CanonicalRewriteSettlement,
  scope: { vaultId: string; ownerUserId: string },
  fallbackEpoch: number
): OAuthBrokerPendingRewriteWork | null {
  if (settlement.kind === 'delivered') {
    return removePendingRewriteAccounts(current, settlement.accountIds, scope);
  }
  if (Object.keys(settlement.updates).length === 0) return current;
  return mergePendingRewriteWork({
    current,
    vaultId: scope.vaultId,
    ownerUserId: scope.ownerUserId,
    epoch: current?.epoch ?? fallbackEpoch,
    accounts: settlement.updates,
  });
}

export async function applyCanonicalMappingChanges(
  input: CanonicalMappingWorkflowInput
): Promise<CanonicalMappingWorkflowOutcome> {
  const { connection, operation, backend, assertOwnership } = input;
  const vaultId = operation.vaultId;
  assertOwnership();
  
  const inventory = await backend.getAccountInventory(vaultId, {
    interactiveEntitlement: false,
  });
  assertOwnership();
  const plan = await planOAuthBrokerMappingWrites({
    connection,
    drafts: input.drafts,
    mappingDirty: input.mappingDirty,
    localAccounts: input.localAccounts,
    inventoryAccounts: inventory.accounts,
    confirm: ({ newAccountName }) => input.confirmRemap(newAccountName),
    createOperationId: generateUUID,
  });
  if (plan.status === 'cancelled') return { status: 'cancelled' };
  const writes = plan.writes;
  assertOwnership();
  const persistedLocalAccountIds = new Map<string, string>();
  const remapReceiptsByAccountId = new Map<
    string,
    TradeProjectionAccountVaultRemapResponse
  >();
  const writePromises: Promise<void>[] = [];
  for (const write of writes) {
    assertOwnership();
    writePromises.push(
      input.enqueue(write.canonicalAccountId, async () => {
        assertOwnership();
        try {
          if (write.kind === 'remap') {
            const receipt = await backend.remapAccountVaultMapping(
              write.canonicalAccountId,
              {
                vaultId,
                localAccountId: write.localAccountId,
                localAccountName: write.localAccountName,
                existingNotes: write.existingNotes,
                clientOperationId: write.clientOperationId,
                pluginVersion: operation.pluginVersion,
                deviceId: operation.deviceId,
              }
            );
            remapReceiptsByAccountId.set(write.canonicalAccountId, receipt);
          } else {
            await backend.updateAccountVaultMapping(write.canonicalAccountId, {
              vaultId,
              localAccountId: write.localAccountId,
              localAccountName: write.localAccountName,
              mappingStatus: 'mapped',
              pluginVersion: operation.pluginVersion,
              clientOperationId: operation.clientOperationId,
            });
          }
          persistedLocalAccountIds.set(
            write.canonicalAccountId,
            write.localAccountId
          );
        } catch (error) {
          if (isTradeSyncRateLimitError(error)) {
            input.onRateLimited(write.canonicalAccountId, error.retryAt);
          }
          throw error;
        }
      })
    );
  }
  const settledWrites = await Promise.allSettled(writePromises);
  assertOwnership();
  const mappingFailures: unknown[] = [];
  for (const result of settledWrites) {
    if (result.status === 'rejected') mappingFailures.push(result.reason);
  }

  const updateReceipts: TradeProjectionAccountVaultRemapResponse[] = [];
  for (const receipt of remapReceiptsByAccountId.values()) {
    if (receipt.existingNotes === 'update') updateReceipts.push(receipt);
  }
  let preservedConflictCount = 0;
  for (const receipt of updateReceipts) {
    preservedConflictCount += receipt.preservedConflictCount;
  }
  const rewriteScope = {
    updateReceipts,
    pendingWork: input.pendingWork,
    connectionId: connection.id,
    vaultId,
    ownerUserId: operation.ownerUserId,
  };
  const connectionCanonicalAccountIds = connection.accounts.map(
    (account) => account.canonicalAccountId
  );
  const { pendingAccounts, completedAccountIds } =
    collectPendingRewriteAccountUpdates({
      ...rewriteScope,
      inventoryAccounts: inventory.accounts,
      connectionCanonicalAccountIds,
    });
  input.onMappingsPersisted({
    persistedLocalAccountIds,
    pendingAccounts,
    completedAccountIds,
  });

  let remapProjection: TradeProjectionSyncResult | undefined;
  let restoreFailure: unknown;
  const remapBindings = oauthBrokerRemapRestoreBindings({
    connection,
    provider: operation.provider,
    remappedCanonicalAccountIds: remapRestoreAccountIds(rewriteScope),
    inventoryAccounts: inventory.accounts,
  });
  if (remapBindings.length > 0) {
    try {
      const projectionOperation = await input.createProjectionOperation();
      assertOwnership();
      remapProjection = await input.restore(remapBindings, projectionOperation);
      assertOwnership();
    } catch (error) {
      assertOwnership();
      restoreFailure = error;
    }
  }
  const expectedRewriteCount = expectedScheduledRewriteCount({
    ...rewriteScope,
    inventoryAccounts: inventory.accounts,
    connectionCanonicalAccountIds,
  });
  let rewriteUnfinished = false;
  let unfinishedCount = 0;
  let latestInventoryAccounts:
    | TradeProjectionAccountInventoryItem[]
    | undefined;
  if (restoreFailure) {
    rewriteUnfinished = expectedRewriteCount > 0;
    unfinishedCount = expectedRewriteCount;
  } else if (expectedRewriteCount > 0) {
    if (!remapProjection || isNoOpTradeProjectionSyncResult(remapProjection)) {
      rewriteUnfinished = true;
      unfinishedCount = expectedRewriteCount;
    } else if (projectionResultHasIssues(remapProjection)) {
      rewriteUnfinished = true;
      const issueCount =
        remapProjection.pendingCount + remapProjection.failedCount;
      unfinishedCount = issueCount > 0 ? issueCount : expectedRewriteCount;
    } else {
      assertOwnership();
      try {
        const latestInventory = await backend.getAccountInventory(vaultId, {
          interactiveEntitlement: false,
        });
        assertOwnership();
        latestInventoryAccounts = latestInventory.accounts;
        unfinishedCount = deliverableOutstandingCountForAccounts(
          latestInventory.accounts,
          remapBindings.map((binding) => binding.canonicalAccountId)
        );
        rewriteUnfinished = unfinishedCount > 0;
      } catch (error) {
        assertOwnership();
        logger.error(input.logLabel, error);
        rewriteUnfinished = true;
        unfinishedCount = expectedRewriteCount;
      }
    }
  }

  let settlement: CanonicalRewriteSettlement | undefined;
  if (!rewriteUnfinished) {
    settlement = {
      kind: 'delivered',
      accountIds: remapBindings.map((binding) => binding.canonicalAccountId),
    };
  } else if (latestInventoryAccounts) {
    const updates: Record<string, OAuthBrokerPendingRewriteAccount> = {};
    for (const binding of remapBindings) {
      const remaining = deliverableOutstandingCountForAccounts(
        latestInventoryAccounts,
        [binding.canonicalAccountId]
      );
      if (remaining <= 0) continue;
      updates[binding.canonicalAccountId] = {
        connectionId: connection.id,
        scheduledCount: remaining,
      };
    }
    settlement = { kind: 'unfinished', updates };
  }

  return {
    status: 'applied',
    mappingFailures,
    remapProjection,
    restoreFailure,
    rewriteUnfinished,
    unfinishedCount,
    preservedConflictCount,
    remapHasIssues:
      projectionResultHasIssues(remapProjection) ||
      preservedConflictCount > 0 ||
      rewriteUnfinished ||
      Boolean(restoreFailure),
    settlement,
  };
}
