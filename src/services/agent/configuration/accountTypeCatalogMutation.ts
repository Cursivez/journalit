import {
  compareCodePoints,
  isBoundedString,
  isRecord,
} from './configurationPrimitives';
import { OptionCatalogMutationError } from './optionCatalogMutationError';
import type { AccountTypeAssignmentSource } from './optionCatalogConfiguration';

const RAW_LIMIT = 100_000;
const NAME_LIMIT = 120;
const RESERVED_ACCOUNT_TYPE = 'archived';
const DEFAULT_ACCOUNT_TYPE = 'demo';

interface AccountTypeMetadataAssignmentPatch {
  readonly from: string;
  readonly to: string;
}

export interface AccountTypeOwnedFields {
  catalog: 'account_types';
  account_type: unknown[];
  accountTypeOrder: unknown[];
  excludedAccountTypes?: unknown[];
  includeWithdrawalsFromExcluded?: Record<string, unknown>;
  defaultAccountType?: string;
  metadataAccountTypePatch?: Record<string, AccountTypeMetadataAssignmentPatch>;
}

type AccountTypeLifecycleChange =
  | {
      kind: 'rename_account_type';
      source_value: string;
      target_value: string;
    }
  | {
      kind: 'move_account_type';
      value: string;
      before_value?: string;
    }
  | {
      kind: 'delete_account_type';
      value: string;
    };

function clone<T>(value: T): T {
  return structuredClone(value);
}

function fail(code: OptionCatalogMutationError['code']): never {
  throw new OptionCatalogMutationError(code);
}


function failInUse(): never {
  throw new OptionCatalogMutationError('conflict', true);
}

function validIdentity(value: unknown): value is string {
  if (
    !isBoundedString(value, NAME_LIMIT) ||
    value !== value.trim() ||
    value.includes('/')
  ) {
    return false;
  }
  return !/^["']|["']$/.test(value);
}

function identityKey(value: string): string {
  return value.toLowerCase();
}

function isReservedAccountType(value: string): boolean {
  return identityKey(value) === RESERVED_ACCOUNT_TYPE;
}

function rejectReserved(value: string): void {
  if (isReservedAccountType(value)) fail('conflict');
}

function uniqueStringIndex(
  values: readonly unknown[],
  identity: string
): number {
  const key = identityKey(identity);
  let found = -1;
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (typeof value !== 'string' || identityKey(value) !== key) continue;
    if (found !== -1) fail('conflict');
    found = index;
  }
  return found;
}

function requireArray(
  rawOptions: Record<string, unknown>,
  key: string
): unknown[] {
  const value = rawOptions[key];
  if (!Array.isArray(value)) fail('conflict');
  if (value.length > RAW_LIMIT) fail('limit_exceeded');
  return clone(value);
}

function requireStoredIdentity(
  values: readonly unknown[],
  identity: string
): { index: number; stored: string } {
  const index = uniqueStringIndex(values, identity);
  if (index === -1) fail('not_found');
  const stored = values[index];
  if (typeof stored !== 'string') fail('internal_error');
  if (!validIdentity(stored)) fail('conflict');
  return { index, stored };
}

function requireWellFormedCatalog(
  accountType: unknown[]
): { stored: string; key: string }[] {
  const entries: { stored: string; key: string }[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < accountType.length; index += 1) {
    const value = accountType[index];
    if (typeof value !== 'string' || !validIdentity(value)) fail('conflict');
    const key = identityKey(value);
    if (seen.has(key)) fail('conflict');
    seen.add(key);
    entries.push({ stored: value, key });
  }
  return entries;
}

function currentDefaultAccountTypeKey(
  rawAccountSettings: Record<string, unknown> | undefined
): string {
  if (
    rawAccountSettings === undefined ||
    !Object.prototype.hasOwnProperty.call(
      rawAccountSettings,
      'defaultAccountType'
    )
  ) {
    return DEFAULT_ACCOUNT_TYPE;
  }
  const value = rawAccountSettings.defaultAccountType;
  if (typeof value !== 'string' || !validIdentity(value)) fail('conflict');
  return identityKey(value);
}

function rejectDefaultOwner(
  identity: string,
  rawAccountSettings: Record<string, unknown> | undefined
): void {
  if (
    currentDefaultAccountTypeKey(rawAccountSettings) === identityKey(identity)
  ) {
    failInUse();
  }
}

function matchingRecordKeys(
  record: Record<string, unknown>,
  identity: string
): string[] {
  const key = identityKey(identity);
  const matches: string[] = [];
  const keys = Object.keys(record);
  for (let index = 0; index < keys.length; index += 1) {
    const recordKey = keys[index];
    if (identityKey(recordKey) === key) matches.push(recordKey);
  }
  return matches;
}

function rejectOrphanTargetReferences(
  order: unknown[],
  excluded: unknown[] | undefined,
  withdrawals: Record<string, unknown> | undefined,
  target: string
): void {
  if (uniqueStringIndex(order, target) !== -1) fail('conflict');
  if (excluded !== undefined && uniqueStringIndex(excluded, target) !== -1) {
    fail('conflict');
  }
  if (
    withdrawals !== undefined &&
    matchingRecordKeys(withdrawals, target).length > 0
  ) {
    fail('conflict');
  }
}

function requireWellFormedStringList(values: unknown[]): void {
  const seen = new Set<string>();
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (typeof value !== 'string' || !validIdentity(value)) fail('conflict');
    const key = identityKey(value);
    if (seen.has(key)) fail('conflict');
    seen.add(key);
  }
}

function requireWellFormedWithdrawalMap(values: Record<string, unknown>): void {
  const keys = Object.keys(values);
  const seen = new Set<string>();
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    if (!validIdentity(key)) fail('conflict');
    const normalized = identityKey(key);
    if (seen.has(normalized)) fail('conflict');
    seen.add(normalized);
    if (typeof values[key] !== 'boolean') fail('conflict');
  }
}

function completeNonReservedOrder(
  catalog: readonly { stored: string; key: string }[],
  existingOrder: unknown[]
): string[] {
  requireWellFormedStringList(existingOrder);
  const catalogKeys = new Set<string>();
  for (let index = 0; index < catalog.length; index += 1) {
    const entry = catalog[index];
    if (!isReservedAccountType(entry.stored)) catalogKeys.add(entry.key);
  }
  const order: string[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < existingOrder.length; index += 1) {
    const value = existingOrder[index];
    if (typeof value !== 'string') fail('conflict');
    if (isReservedAccountType(value)) continue;
    const key = identityKey(value);
    if (!catalogKeys.has(key)) continue;
    if (seen.has(key)) fail('conflict');
    seen.add(key);
    order.push(value);
  }
  for (let index = 0; index < catalog.length; index += 1) {
    const entry = catalog[index];
    if (isReservedAccountType(entry.stored) || seen.has(entry.key)) continue;
    if (order.length === RAW_LIMIT) fail('limit_exceeded');
    order.push(entry.key);
    seen.add(entry.key);
  }
  return order;
}

function archivedOrderValue(
  catalog: readonly { stored: string; key: string }[],
  existingOrder: unknown[]
): string | undefined {
  let stored: string | undefined;
  for (let index = 0; index < existingOrder.length; index += 1) {
    const value = existingOrder[index];
    if (typeof value !== 'string' || !isReservedAccountType(value)) continue;
    if (stored !== undefined) fail('conflict');
    stored = value;
  }
  if (stored !== undefined) return stored;
  for (let index = 0; index < catalog.length; index += 1) {
    if (isReservedAccountType(catalog[index].stored)) return 'archived';
  }
  return undefined;
}

function withArchivedLast(
  order: string[],
  catalog: readonly { stored: string; key: string }[],
  existingOrder: unknown[]
): unknown[] {
  const archived = archivedOrderValue(catalog, existingOrder);
  if (archived === undefined) return order;
  if (order.length === RAW_LIMIT) fail('limit_exceeded');
  return [...order, archived];
}

function moveInOrder(
  order: string[],
  value: string,
  before: string | undefined
): string[] {
  const next = [...order];
  const valueKey = identityKey(value);
  const from = next.findIndex((entry) => identityKey(entry) === valueKey);
  if (from === -1) fail('internal_error');
  const [moved] = next.splice(from, 1);
  if (before === undefined) {
    next.push(moved);
    return next;
  }
  const beforeKey = identityKey(before);
  const to = next.findIndex((entry) => identityKey(entry) === beforeKey);
  if (to === -1) fail('not_found');
  next.splice(to, 0, moved);
  return next;
}

function rewriteStringList(
  values: unknown[] | undefined,
  source: string,
  target: string
): unknown[] | undefined {
  if (values === undefined) return undefined;
  requireWellFormedStringList(values);
  const sourceKey = identityKey(source);
  const targetKey = identityKey(target);
  const next: unknown[] = [];
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (typeof value !== 'string') fail('conflict');
    next.push(identityKey(value) === sourceKey ? targetKey : value);
  }
  return next;
}

function removeFromStringList(
  values: unknown[] | undefined,
  source: string
): unknown[] | undefined {
  if (values === undefined) return undefined;
  requireWellFormedStringList(values);
  const sourceKey = identityKey(source);
  const next: unknown[] = [];
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (typeof value !== 'string') fail('conflict');
    if (identityKey(value) === sourceKey) continue;
    next.push(value);
  }
  return next;
}

function rewriteWithdrawalMap(
  values: Record<string, unknown> | undefined,
  source: string,
  target: string
): Record<string, unknown> | undefined {
  if (values === undefined) return undefined;
  requireWellFormedWithdrawalMap(values);
  const sourceKeys = matchingRecordKeys(values, source);
  if (sourceKeys.length > 1) fail('conflict');
  const next = clone(values);
  if (sourceKeys.length === 0) return next;
  const sourceKey = sourceKeys[0];
  const moved = next[sourceKey];
  delete next[sourceKey];
  next[identityKey(target)] = moved;
  return next;
}

function removeFromWithdrawalMap(
  values: Record<string, unknown> | undefined,
  source: string
): Record<string, unknown> | undefined {
  if (values === undefined) return undefined;
  requireWellFormedWithdrawalMap(values);
  const next = clone(values);
  const sourceKeys = matchingRecordKeys(next, source);
  for (let index = 0; index < sourceKeys.length; index += 1) {
    delete next[sourceKeys[index]];
  }
  return next;
}

function accountLookupKey(name: string): string {
  return name.trim().toLowerCase();
}

function collectAssignmentRewrite(
  rawAccountSettings: Record<string, unknown> | undefined,
  accounts: readonly AccountTypeAssignmentSource[],
  source: string,
  target: string | undefined
): {
  patch: Record<string, AccountTypeMetadataAssignmentPatch>;
  affectedCount: number;
} {
  const sourceKey = identityKey(source);
  const targetKey = target === undefined ? undefined : identityKey(target);
  const seenNames = new Set<string>();
  const matchingAccounts: { name: string; accountType: string }[] = [];
  for (let index = 0; index < accounts.length; index += 1) {
    const account = accounts[index];
    if (typeof account.name !== 'string' || account.name.trim() === '') {
      fail('conflict');
    }
    const nameKey = accountLookupKey(account.name);
    if (seenNames.has(nameKey)) fail('conflict');
    seenNames.add(nameKey);
    const effective = account.accountType ?? DEFAULT_ACCOUNT_TYPE;
    if (typeof effective !== 'string') fail('conflict');
    const effectiveKey = identityKey(effective);
    if (targetKey !== undefined && effectiveKey === targetKey) fail('conflict');
    if (effectiveKey !== sourceKey) continue;
    matchingAccounts.push({ name: account.name, accountType: effective });
  }
  if (matchingAccounts.length > RAW_LIMIT) fail('conflict');

  const metadataValue =
    rawAccountSettings === undefined
      ? undefined
      : rawAccountSettings.accountMetadata;
  const metadataByLookup = new Map<
    string,
    { key: string; accountType: string }
  >();
  if (metadataValue !== undefined) {
    if (!isRecord(metadataValue)) fail('conflict');
    const metadataKeys = Object.keys(metadataValue);
    if (metadataKeys.length > RAW_LIMIT) fail('limit_exceeded');
    for (let index = 0; index < metadataKeys.length; index += 1) {
      const key = metadataKeys[index];
      const entry = metadataValue[key];
      if (!isRecord(entry)) fail('conflict');
      const accountType = entry.accountType;
      if (accountType === undefined) continue;
      if (typeof accountType !== 'string') fail('conflict');
      const lookup = accountLookupKey(key);
      if (metadataByLookup.has(lookup)) fail('conflict');
      metadataByLookup.set(lookup, { key, accountType });
    }
  }

  const matchingMetadata = new Map<
    string,
    { key: string; accountType: string }
  >();
  for (const [lookup, entry] of metadataByLookup) {
    const assignedKey = identityKey(entry.accountType);
    if (targetKey !== undefined && assignedKey === targetKey) fail('conflict');
    if (assignedKey !== sourceKey) continue;
    if (!validIdentity(entry.accountType)) fail('conflict');
    matchingMetadata.set(lookup, entry);
  }

  if (target === undefined) {
    if (matchingAccounts.length > 0 || matchingMetadata.size > 0) {
      failInUse();
    }
    return { patch: {}, affectedCount: 0 };
  }

  if (matchingAccounts.length !== matchingMetadata.size) fail('conflict');
  const patchEntries: [string, AccountTypeMetadataAssignmentPatch][] = [];
  for (let index = 0; index < matchingAccounts.length; index += 1) {
    const account = matchingAccounts[index];
    const lookup = accountLookupKey(account.name);
    const metadata = matchingMetadata.get(lookup);
    if (metadata === undefined) fail('conflict');
    if (
      identityKey(account.accountType) !== identityKey(metadata.accountType)
    ) {
      fail('conflict');
    }
    patchEntries.push([
      metadata.key,
      { from: metadata.accountType, to: target },
    ]);
  }
  patchEntries.sort((left, right) => compareCodePoints(left[0], right[0]));
  const patch: Record<string, AccountTypeMetadataAssignmentPatch> = {};
  for (let index = 0; index < patchEntries.length; index += 1) {
    const [key, value] = patchEntries[index];
    patch[key] = value;
  }
  return { patch, affectedCount: matchingAccounts.length };
}

export function applyAccountTypeAssignments(
  accounts: readonly AccountTypeAssignmentSource[],
  change: AccountTypeLifecycleChange
): AccountTypeAssignmentSource[] {
  if (change.kind !== 'rename_account_type') {
    return accounts.map((account) =>
      account.accountType === undefined
        ? { name: account.name }
        : { name: account.name, accountType: account.accountType }
    );
  }
  const sourceKey = identityKey(change.source_value);
  const next: AccountTypeAssignmentSource[] = [];
  for (let index = 0; index < accounts.length; index += 1) {
    const account = accounts[index];
    if (
      account.accountType !== undefined &&
      identityKey(account.accountType) === sourceKey
    ) {
      next.push({ name: account.name, accountType: change.target_value });
      continue;
    }
    next.push(
      account.accountType === undefined
        ? { name: account.name }
        : { name: account.name, accountType: account.accountType }
    );
  }
  return next;
}

export function materializeAccountTypeLifecycle(input: {
  change: AccountTypeLifecycleChange;
  rawOptions: Record<string, unknown>;
  rawAccountSettings: Record<string, unknown> | undefined;
  accounts: readonly AccountTypeAssignmentSource[];
}): {
  ownedFields: AccountTypeOwnedFields;
  affectedEntry: { value: string };
  affectedAccountCount: number;
  
  discardsUserSettings?: true;
} {
  const change = input.change;
  const account_type = requireArray(input.rawOptions, 'account_type');
  const catalog = requireWellFormedCatalog(account_type);
  const accountTypeOrder = clone(
    isRecord(input.rawAccountSettings) &&
      Array.isArray(input.rawAccountSettings.accountTypeOrder)
      ? input.rawAccountSettings.accountTypeOrder
      : input.rawAccountSettings !== undefined &&
          Object.prototype.hasOwnProperty.call(
            input.rawAccountSettings,
            'accountTypeOrder'
          )
        ? fail('conflict')
        : []
  );
  const excludedAccountTypes =
    input.rawAccountSettings === undefined ||
    !Object.prototype.hasOwnProperty.call(
      input.rawAccountSettings,
      'excludedAccountTypes'
    )
      ? undefined
      : Array.isArray(input.rawAccountSettings.excludedAccountTypes)
        ? clone(input.rawAccountSettings.excludedAccountTypes)
        : fail('conflict');
  const includeWithdrawalsFromExcluded =
    input.rawAccountSettings === undefined ||
    !Object.prototype.hasOwnProperty.call(
      input.rawAccountSettings,
      'includeWithdrawalsFromExcluded'
    )
      ? undefined
      : isRecord(input.rawAccountSettings.includeWithdrawalsFromExcluded)
        ? clone(input.rawAccountSettings.includeWithdrawalsFromExcluded)
        : fail('conflict');
  if (
    excludedAccountTypes !== undefined &&
    excludedAccountTypes.length > RAW_LIMIT
  ) {
    fail('limit_exceeded');
  }
  if (
    includeWithdrawalsFromExcluded !== undefined &&
    Object.keys(includeWithdrawalsFromExcluded).length > RAW_LIMIT
  ) {
    fail('limit_exceeded');
  }

  switch (change.kind) {
    case 'rename_account_type': {
      if (
        !validIdentity(change.source_value) ||
        !validIdentity(change.target_value)
      ) {
        fail('invalid_request');
      }
      rejectReserved(change.source_value);
      rejectReserved(change.target_value);
      if (
        identityKey(change.source_value) === identityKey(change.target_value)
      ) {
        fail('conflict');
      }
      const sourceMatch = requireStoredIdentity(
        account_type,
        change.source_value
      );
      if (uniqueStringIndex(account_type, change.target_value) !== -1) {
        fail('conflict');
      }
      rejectOrphanTargetReferences(
        accountTypeOrder,
        excludedAccountTypes,
        includeWithdrawalsFromExcluded,
        change.target_value
      );
      if (excludedAccountTypes !== undefined) {
        requireWellFormedStringList(excludedAccountTypes);
      }
      if (includeWithdrawalsFromExcluded !== undefined) {
        requireWellFormedWithdrawalMap(includeWithdrawalsFromExcluded);
      }
      const assignment = collectAssignmentRewrite(
        input.rawAccountSettings,
        input.accounts,
        change.source_value,
        change.target_value
      );
      account_type[sourceMatch.index] = change.target_value;
      const completed = completeNonReservedOrder(catalog, accountTypeOrder);
      const rewrittenOrder = completed.map((value) =>
        identityKey(value) === identityKey(change.source_value)
          ? identityKey(change.target_value)
          : value
      );
      const ownedFields: AccountTypeOwnedFields = {
        catalog: 'account_types',
        account_type,
        accountTypeOrder: withArchivedLast(
          rewrittenOrder,
          catalog,
          accountTypeOrder
        ),
      };
      const nextExcluded = rewriteStringList(
        excludedAccountTypes,
        change.source_value,
        change.target_value
      );
      const nextWithdrawals = rewriteWithdrawalMap(
        includeWithdrawalsFromExcluded,
        change.source_value,
        change.target_value
      );
      if (nextExcluded !== undefined) {
        ownedFields.excludedAccountTypes = nextExcluded;
      }
      if (nextWithdrawals !== undefined) {
        ownedFields.includeWithdrawalsFromExcluded = nextWithdrawals;
      }
      if (Object.keys(assignment.patch).length > 0) {
        ownedFields.metadataAccountTypePatch = assignment.patch;
      }
      if (
        currentDefaultAccountTypeKey(input.rawAccountSettings) ===
        identityKey(change.source_value)
      ) {
        ownedFields.defaultAccountType = change.target_value;
      }
      return {
        ownedFields,
        affectedEntry: { value: change.target_value },
        affectedAccountCount: assignment.affectedCount,
      };
    }
    case 'move_account_type': {
      if (!validIdentity(change.value)) fail('invalid_request');
      rejectReserved(change.value);
      requireStoredIdentity(account_type, change.value);
      if (change.before_value !== undefined) {
        if (!validIdentity(change.before_value)) fail('invalid_request');
        rejectReserved(change.before_value);
        if (identityKey(change.value) === identityKey(change.before_value)) {
          fail('conflict');
        }
        requireStoredIdentity(account_type, change.before_value);
      }
      const completed = completeNonReservedOrder(catalog, accountTypeOrder);
      const moved = moveInOrder(completed, change.value, change.before_value);
      return {
        ownedFields: {
          catalog: 'account_types',
          account_type,
          accountTypeOrder: withArchivedLast(moved, catalog, accountTypeOrder),
          ...(excludedAccountTypes === undefined
            ? {}
            : { excludedAccountTypes }),
          ...(includeWithdrawalsFromExcluded === undefined
            ? {}
            : { includeWithdrawalsFromExcluded }),
        },
        affectedEntry: { value: change.value },
        affectedAccountCount: 0,
      };
    }
    case 'delete_account_type': {
      if (!validIdentity(change.value)) fail('invalid_request');
      rejectReserved(change.value);
      rejectDefaultOwner(change.value, input.rawAccountSettings);
      const sourceMatch = requireStoredIdentity(account_type, change.value);
      collectAssignmentRewrite(
        input.rawAccountSettings,
        input.accounts,
        change.value,
        undefined
      );
      account_type.splice(sourceMatch.index, 1);
      const remainingCatalog = requireWellFormedCatalog(account_type);
      const completed = completeNonReservedOrder(
        remainingCatalog,
        accountTypeOrder
      );
      const nextExcluded = removeFromStringList(
        excludedAccountTypes,
        change.value
      );
      const nextWithdrawals = removeFromWithdrawalMap(
        includeWithdrawalsFromExcluded,
        change.value
      );
      const discardsUserSettings =
        nextExcluded?.length !== excludedAccountTypes?.length ||
        (includeWithdrawalsFromExcluded !== undefined &&
          matchingRecordKeys(includeWithdrawalsFromExcluded, change.value)
            .length > 0);
      return {
        ownedFields: {
          catalog: 'account_types',
          account_type,
          accountTypeOrder: withArchivedLast(
            completed,
            remainingCatalog,
            accountTypeOrder
          ),
          ...(nextExcluded === undefined
            ? {}
            : { excludedAccountTypes: nextExcluded }),
          ...(nextWithdrawals === undefined
            ? {}
            : { includeWithdrawalsFromExcluded: nextWithdrawals }),
        },
        affectedEntry: { value: sourceMatch.stored },
        affectedAccountCount: 0,
        ...(discardsUserSettings ? { discardsUserSettings: true } : {}),
      };
    }
    default: {
      const exhaustive: never = change;
      return exhaustive;
    }
  }
}
