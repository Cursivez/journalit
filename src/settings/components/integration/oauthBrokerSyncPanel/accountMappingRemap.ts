

import type { App } from 'obsidian';
import { showActionConfirmationModal } from '../../../../components/shared/ConfirmationModal';
import { t } from '../../../../lang/helpers';
import type { BrokerSyncAccountBinding } from '../../../../services/tradeSync/BrokerSyncProvider';
import type {
  BrokerSyncProviderId,
  TradeProjectionAccountInventoryItem,
  TradeProjectionAccountVaultRemapResponse,
  TradeProjectionSyncResult,
} from '../../../../services/tradeSync/types';
import { createTradeSyncLocalAccountResolver } from '../../../../services/tradeSync/TradeSyncAccountMappings';
import type { LocalAccountOption } from '../brokerSyncKit';
import type { OAuthBrokerConnection } from './types';
import { oauthBrokerAccountDraftKey, type AccountDrafts } from './drafts';

export type OAuthBrokerMappingExistingNotesChoice = 'update' | 'leave';
export type OAuthBrokerMappingRemapDecision =
  | OAuthBrokerMappingExistingNotesChoice
  | 'cancel';

type PreparedMappingWrite =
  | {
      kind: 'map';
      canonicalAccountId: string;
      localAccountId: string;
      localAccountName: string;
    }
  | {
      kind: 'remap';
      canonicalAccountId: string;
      localAccountId: string;
      localAccountName: string;
      existingNotes: OAuthBrokerMappingExistingNotesChoice;
      clientOperationId: string;
    };

type MappingWritePlan =
  | { status: 'cancelled' }
  | { status: 'ready'; writes: PreparedMappingWrite[] };

interface FrozenMappingCandidate {
  canonicalAccountId: string;
  localAccountId: string;
  localAccountName: string;
  oldAccountName: string;
  identityChanged: boolean;
  hasProjectedNotes: boolean;
}

function inventoryHasProjectedNotes(
  account: TradeProjectionAccountInventoryItem | undefined
): boolean {
  if (!account) return false;
  return (
    account.syncedCount > 0 ||
    account.pendingCount > 0 ||
    account.failedCount > 0 ||
    account.needsRewriteCount > 0 ||
    account.staleCount > 0 ||
    account.conflictCount > 0
  );
}

export function oauthBrokerRemapRestoreBindings(input: {
  connection: OAuthBrokerConnection;
  provider: BrokerSyncProviderId;
  remappedCanonicalAccountIds: Iterable<string>;
  inventoryAccounts: TradeProjectionAccountInventoryItem[];
}): BrokerSyncAccountBinding[] {
  const canonicalAccountIds = new Set(input.remappedCanonicalAccountIds);
  const connectionAccountIds = new Set(
    input.connection.accounts.map((account) => account.canonicalAccountId)
  );
  for (const account of input.inventoryAccounts) {
    if (
      connectionAccountIds.has(account.accountId) &&
      account.needsRewriteCount > 0
    ) {
      canonicalAccountIds.add(account.accountId);
    }
  }
  const bindings: BrokerSyncAccountBinding[] = [];
  for (const canonicalAccountId of canonicalAccountIds) {
    bindings.push({
      canonicalAccountId,
      connectionId: input.connection.id,
      provider: input.provider,
    });
  }
  return bindings;
}

export interface OAuthBrokerPendingRewriteAccount {
  connectionId: string;
  scheduledCount: number;
}

export interface OAuthBrokerPendingRewriteWork {
  vaultId: string;
  ownerUserId: string;
  epoch: number;
  accounts: Record<string, OAuthBrokerPendingRewriteAccount>;
}

export function isNoOpTradeProjectionSyncResult(
  result: TradeProjectionSyncResult | undefined
): boolean {
  return (
    result != null &&
    result.accountCount === 0 &&
    result.writtenCount === 0 &&
    result.failedCount === 0 &&
    result.pendingCount === 0 &&
    !result.partial
  );
}

function deliverableOutstandingCount(
  account: TradeProjectionAccountInventoryItem
): number {
  return (
    account.needsRewriteCount +
    account.failedCount +
    account.pendingCount +
    account.staleCount +
    account.missingCount
  );
}

export function deliverableOutstandingCountForAccounts(
  inventoryAccounts: TradeProjectionAccountInventoryItem[],
  canonicalAccountIds: Iterable<string>
): number {
  const wanted = new Set(canonicalAccountIds);
  let count = 0;
  for (const account of inventoryAccounts) {
    if (!wanted.has(account.accountId)) continue;
    count += deliverableOutstandingCount(account);
  }
  return count;
}

export function collectPendingRewriteAccountUpdates(input: {
  updateReceipts: TradeProjectionAccountVaultRemapResponse[];
  pendingWork: OAuthBrokerPendingRewriteWork | null;
  connectionId: string;
  vaultId: string;
  ownerUserId: string;
  inventoryAccounts: TradeProjectionAccountInventoryItem[];
  connectionCanonicalAccountIds: Iterable<string>;
}): {
  pendingAccounts: Record<string, OAuthBrokerPendingRewriteAccount>;
  completedAccountIds: string[];
} {
  const accounts: Record<string, OAuthBrokerPendingRewriteAccount> = {};
  const completedAccountIds: string[] = [];
  const decided = new Set<string>();
  const decide = (accountId: string, scheduledCount: number) => {
    if (decided.has(accountId)) return;
    decided.add(accountId);
    if (scheduledCount <= 0) {
      completedAccountIds.push(accountId);
      return;
    }
    accounts[accountId] = {
      connectionId: input.connectionId,
      scheduledCount,
    };
  };
  for (const receipt of input.updateReceipts) {
    if (receipt.existingNotes !== 'update') continue;
    decide(receipt.mapping.accountId, receipt.scheduledCount);
  }
  const inventoryById = new Map(
    input.inventoryAccounts.map((account) => [account.accountId, account])
  );
  if (
    input.pendingWork &&
    input.pendingWork.vaultId === input.vaultId &&
    input.pendingWork.ownerUserId === input.ownerUserId
  ) {
    for (const accountId of Object.keys(input.pendingWork.accounts)) {
      const pending = input.pendingWork.accounts[accountId];
      if (!pending || pending.connectionId !== input.connectionId) continue;
      const inventoryAccount = inventoryById.get(accountId);
      if (inventoryAccount) {
        decide(accountId, deliverableOutstandingCount(inventoryAccount));
      } else {
        decide(accountId, pending.scheduledCount);
      }
    }
  }
  const connectionIds = new Set(input.connectionCanonicalAccountIds);
  for (const account of input.inventoryAccounts) {
    if (!connectionIds.has(account.accountId)) continue;
    if (account.needsRewriteCount <= 0) continue;
    decide(account.accountId, account.needsRewriteCount);
  }
  return { pendingAccounts: accounts, completedAccountIds };
}

export function expectedScheduledRewriteCount(input: {
  updateReceipts: TradeProjectionAccountVaultRemapResponse[];
  pendingWork: OAuthBrokerPendingRewriteWork | null;
  connectionId: string;
  vaultId: string;
  ownerUserId: string;
  inventoryAccounts: TradeProjectionAccountInventoryItem[];
  connectionCanonicalAccountIds: Iterable<string>;
}): number {
  const accounts = collectPendingRewriteAccountUpdates(input).pendingAccounts;
  let count = 0;
  for (const accountId of Object.keys(accounts)) {
    const account = accounts[accountId];
    if (!account) continue;
    count += account.scheduledCount;
  }
  return count;
}

export function remapRestoreAccountIds(input: {
  updateReceipts: TradeProjectionAccountVaultRemapResponse[];
  pendingWork: OAuthBrokerPendingRewriteWork | null;
  connectionId: string;
  vaultId: string;
  ownerUserId: string;
}): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const add = (accountId: string) => {
    if (seen.has(accountId)) return;
    seen.add(accountId);
    ids.push(accountId);
  };
  for (const receipt of input.updateReceipts) {
    add(receipt.mapping.accountId);
  }
  if (
    input.pendingWork &&
    input.pendingWork.vaultId === input.vaultId &&
    input.pendingWork.ownerUserId === input.ownerUserId
  ) {
    for (const accountId of Object.keys(input.pendingWork.accounts)) {
      const pending = input.pendingWork.accounts[accountId];
      if (!pending || pending.connectionId !== input.connectionId) continue;
      add(accountId);
    }
  }
  return ids;
}

export function mergePendingRewriteWork(input: {
  current: OAuthBrokerPendingRewriteWork | null;
  vaultId: string;
  ownerUserId: string;
  epoch: number;
  accounts: Record<string, OAuthBrokerPendingRewriteAccount>;
}): OAuthBrokerPendingRewriteWork | null {
  const baseAccounts =
    input.current &&
    input.current.vaultId === input.vaultId &&
    input.current.ownerUserId === input.ownerUserId
      ? { ...input.current.accounts }
      : {};
  for (const accountId of Object.keys(input.accounts)) {
    const account = input.accounts[accountId];
    if (!account) continue;
    baseAccounts[accountId] = account;
  }
  if (Object.keys(baseAccounts).length === 0) return null;
  return {
    vaultId: input.vaultId,
    ownerUserId: input.ownerUserId,
    epoch: input.epoch,
    accounts: baseAccounts,
  };
}

export function removePendingRewriteAccounts(
  current: OAuthBrokerPendingRewriteWork | null,
  accountIds: Iterable<string>,
  scope?: { vaultId: string; ownerUserId: string }
): OAuthBrokerPendingRewriteWork | null {
  if (!current) return null;
  if (
    scope &&
    (current.vaultId !== scope.vaultId ||
      current.ownerUserId !== scope.ownerUserId)
  ) {
    return current;
  }
  const accounts = { ...current.accounts };
  for (const accountId of accountIds) {
    delete accounts[accountId];
  }
  if (Object.keys(accounts).length === 0) return null;
  return { ...current, accounts };
}

export function reconcilePendingRewriteWork(
  current: OAuthBrokerPendingRewriteWork | null,
  input: {
    ownerUserId: string;
    vaultId: string;
    epochAtStart: number;
    inventoryAccounts: TradeProjectionAccountInventoryItem[];
  }
): OAuthBrokerPendingRewriteWork | null {
  if (!current) return null;
  if (current.ownerUserId !== input.ownerUserId) return null;
  if (current.vaultId !== input.vaultId) return null;
  if (input.epochAtStart !== current.epoch) return current;
  const inventoryById = new Map(
    input.inventoryAccounts.map((account) => [account.accountId, account])
  );
  const accounts = { ...current.accounts };
  for (const accountId of Object.keys(accounts)) {
    const inventoryAccount = inventoryById.get(accountId);
    if (!inventoryAccount) continue;
    const remaining = deliverableOutstandingCount(inventoryAccount);
    const pendingAccount = accounts[accountId];
    if (remaining === 0) {
      delete accounts[accountId];
    } else if (pendingAccount) {
      accounts[accountId] = {
        ...pendingAccount,
        scheduledCount: remaining,
      };
    }
  }
  if (Object.keys(accounts).length === 0) return null;
  return { ...current, accounts };
}

export function confirmOAuthBrokerAccountRemap(
  app: App,
  newAccountName: string
): Promise<OAuthBrokerMappingRemapDecision> {
  return showActionConfirmationModal(app, {
    title: t('trade-sync.oauth.remap.title'),
    message: t('trade-sync.oauth.remap.message', {
      newAccount: newAccountName,
    }),
    renderContent: (contentEl) => {
      contentEl.addClass('journalit-account-remap-dialog');
    },
    cancelValue: 'cancel',
    actions: [
      {
        value: 'cancel',
        label: t('button.cancel'),
        variant: 'secondary',
        initialFocus: true,
      },
      {
        value: 'leave',
        label: t('trade-sync.oauth.remap.future-only'),
        variant: 'secondary',
      },
      {
        value: 'update',
        label: t('trade-sync.oauth.remap.update-notes'),
        variant: 'primary',
      },
    ],
  });
}

function hasPersistedMappingIdentity(
  mapping:
    | {
        localAccountId?: string | null;
        localAccountName?: string | null;
      }
    | null
    | undefined
): boolean {
  return Boolean(mapping?.localAccountId || mapping?.localAccountName);
}

function freezeMappingCandidates(input: {
  connection: OAuthBrokerConnection;
  drafts: AccountDrafts;
  mappingDirty: Record<string, true>;
  localAccounts: LocalAccountOption[];
  inventoryAccounts: TradeProjectionAccountInventoryItem[];
}): FrozenMappingCandidate[] {
  const resolver = createTradeSyncLocalAccountResolver(input.localAccounts);
  const inventoryByAccountId = new Map(
    input.inventoryAccounts.map((account) => [account.accountId, account])
  );
  const seenCanonicalAccountIds = new Set<string>();
  const candidates: FrozenMappingCandidate[] = [];
  for (const account of input.connection.accounts) {
    if (!input.mappingDirty[account.canonicalAccountId]) continue;
    if (seenCanonicalAccountIds.has(account.canonicalAccountId)) continue;
    const draft =
      input.drafts[oauthBrokerAccountDraftKey(input.connection.id, account.id)];
    const localAccount = draft?.localAccountId
      ? resolver.byId(draft.localAccountId)
      : undefined;
    if (!localAccount) continue;
    seenCanonicalAccountIds.add(account.canonicalAccountId);
    const inventoryAccount = inventoryByAccountId.get(
      account.canonicalAccountId
    );
    const mapping = inventoryAccount?.mapping;
    const resolvedOld = resolver.resolveMapping(mapping);
    candidates.push({
      canonicalAccountId: account.canonicalAccountId,
      localAccountId: localAccount.id,
      localAccountName: localAccount.name,
      oldAccountName:
        resolvedOld?.name ??
        mapping?.localAccountName ??
        mapping?.localAccountId ??
        '',
      identityChanged: resolvedOld
        ? resolvedOld.id !== localAccount.id
        : hasPersistedMappingIdentity(mapping),
      hasProjectedNotes: inventoryHasProjectedNotes(inventoryAccount),
    });
  }
  return candidates;
}

export async function planOAuthBrokerMappingWrites(input: {
  connection: OAuthBrokerConnection;
  drafts: AccountDrafts;
  mappingDirty: Record<string, true>;
  localAccounts: LocalAccountOption[];
  inventoryAccounts: TradeProjectionAccountInventoryItem[];
  confirm: (names: {
    oldAccountName: string;
    newAccountName: string;
  }) => Promise<OAuthBrokerMappingRemapDecision>;
  createOperationId: () => string;
}): Promise<MappingWritePlan> {
  const candidates = freezeMappingCandidates(input);
  const writes: PreparedMappingWrite[] = [];
  for (const candidate of candidates) {
    if (candidate.identityChanged && candidate.hasProjectedNotes) {
      const decision = await input.confirm({
        oldAccountName: candidate.oldAccountName,
        newAccountName: candidate.localAccountName,
      });
      if (decision === 'cancel') {
        return { status: 'cancelled' };
      }
      writes.push({
        kind: 'remap',
        canonicalAccountId: candidate.canonicalAccountId,
        localAccountId: candidate.localAccountId,
        localAccountName: candidate.localAccountName,
        existingNotes: decision,
        clientOperationId: input.createOperationId(),
      });
      continue;
    }
    writes.push({
      kind: 'map',
      canonicalAccountId: candidate.canonicalAccountId,
      localAccountId: candidate.localAccountId,
      localAccountName: candidate.localAccountName,
    });
  }
  return { status: 'ready', writes };
}
