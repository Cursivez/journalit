import type { AgentOptionsPersistenceCommand } from '../../options/CustomOptionsService';
import {
  isAccountTypeCatalogChange,
  materializeOptionCatalogChange,
  OptionCatalogMutationError,
  type MaterializedOptionChange,
  type OwnedOptionFields,
} from './optionCatalogMutation';
import type { AccountTypeAssignmentSource } from './optionCatalogConfiguration';
import {
  canonicalizeConfigurationValue,
  isRecord,
} from './configurationPrimitives';
import type { NoteRewriteChange, NoteRewritePlan } from './noteRewritePlan';
import {
  isEventRewritePlan,
  isMistakeRewriteChange,
  isMistakeRewritePlan,
  isNoteRewriteChange,
  isTagRewriteChange,
  isTagRewritePlan,
} from './noteRewritePlan';
import type {
  OptionCatalogChange,
  OptionChangeSummary,
} from './optionChangeTypes';

type CreateChange = Extract<
  OptionCatalogChange,
  {
    kind:
      | 'create_tag'
      | 'create_mistake'
      | 'create_account_type'
      | 'create_event';
  }
>;


interface MaterializedCreateSequence {
  readonly baseRevision: string;
  readonly resultingRevision: string;
  readonly entries: readonly MaterializedOptionChange[];
  readonly ownedFields: OwnedOptionFields;
}

interface Dependencies {
  getRawOptions(): unknown;
  getRawAccountSettings(): unknown;
  getAuthoritativeAccounts(): Promise<readonly AccountTypeAssignmentSource[]>;
  persist(command: AgentOptionsPersistenceCommand): Promise<void>;
  scanNoteRewrite(change: NoteRewriteChange): Promise<NoteRewritePlan>;
  onNoteRewriteCommitted(plan: NoteRewritePlan): void;
  
  onCommitted(change: OptionCatalogChange, summary: OptionChangeSummary): void;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function equal(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function fieldPresence(record: Record<string, unknown>, key: string): unknown {
  if (!Object.prototype.hasOwnProperty.call(record, key)) {
    return { present: false };
  }
  return { present: true, value: record[key] };
}

function snapshotMetadataAccountTypes(raw: unknown): unknown {
  if (!isRecord(raw)) return raw;
  const result: Record<string, unknown> = {};
  const keys = Object.keys(raw).sort();
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    const entry = raw[key];
    if (!isRecord(entry)) {
      result[key] = { present: false };
      continue;
    }
    result[key] = Object.prototype.hasOwnProperty.call(entry, 'accountType')
      ? { present: true, value: entry.accountType }
      : { present: false };
  }
  return result;
}

function snapshotAccountTypePersistedState(
  rawOptions: unknown,
  rawAccountSettings: unknown
): unknown {
  const options = isRecord(rawOptions) ? rawOptions : {};
  const account = isRecord(rawAccountSettings) ? rawAccountSettings : {};
  return canonicalizeConfigurationValue({
    account_type: options.account_type,
    accountTypeOrder: account.accountTypeOrder,
    excludedAccountTypes: account.excludedAccountTypes,
    includeWithdrawalsFromExcluded: account.includeWithdrawalsFromExcluded,
    defaultAccountType: fieldPresence(account, 'defaultAccountType'),
    accountMetadata: Object.prototype.hasOwnProperty.call(
      account,
      'accountMetadata'
    )
      ? {
          present: true,
          value: snapshotMetadataAccountTypes(account.accountMetadata),
        }
      : { present: false },
  });
}

function snapshotRewritePersistedState(
  change: NoteRewriteChange,
  rawOptions: unknown
): unknown {
  const options = isRecord(rawOptions) ? rawOptions : {};
  if (isTagRewriteChange(change)) {
    return canonicalizeConfigurationValue({
      tag: fieldPresence(options, 'tag'),
      tagColors: fieldPresence(options, 'tagColors'),
    });
  }
  if (isMistakeRewriteChange(change)) {
    return canonicalizeConfigurationValue({
      mistake: fieldPresence(options, 'mistake'),
    });
  }
  return canonicalizeConfigurationValue({
    event: fieldPresence(options, 'event'),
  });
}

function plansEqual(
  left: NoteRewritePlan | undefined,
  right: NoteRewritePlan | undefined
): boolean {
  if (left === undefined && right === undefined) return true;
  if (left === undefined || right === undefined) return false;
  if (!equal(left.change, right.change)) return false;
  if (
    left.affectedNoteCount !== right.affectedNoteCount ||
    left.mutations.length !== right.mutations.length
  ) {
    return false;
  }
  if (isTagRewritePlan(left) || isTagRewritePlan(right)) {
    if (!isTagRewritePlan(left) || !isTagRewritePlan(right)) return false;
    if (
      left.affectedTradeCount !== right.affectedTradeCount ||
      left.affectedSetupCount !== right.affectedSetupCount ||
      left.affectedReviewCount !== right.affectedReviewCount ||
      left.affectedOtherNoteCount !== right.affectedOtherNoteCount
    ) {
      return false;
    }
  }
  if (isMistakeRewritePlan(left) || isMistakeRewritePlan(right)) {
    if (!isMistakeRewritePlan(left) || !isMistakeRewritePlan(right)) {
      return false;
    }
    if (
      left.affectedTradeCount !== right.affectedTradeCount ||
      left.affectedReviewCount !== right.affectedReviewCount
    ) {
      return false;
    }
  }
  if (isEventRewritePlan(left) || isEventRewritePlan(right)) {
    if (!isEventRewritePlan(left) || !isEventRewritePlan(right)) return false;
    if (
      left.affectedReviewCount !== right.affectedReviewCount ||
      left.preservedReviewCount !== right.preservedReviewCount ||
      left.references.length !== right.references.length
    ) {
      return false;
    }
    for (let index = 0; index < left.references.length; index += 1) {
      const current = left.references[index];
      const expected = right.references[index];
      if (
        current.path !== expected.path ||
        current.originalContentHash !== expected.originalContentHash ||
        current.originalContent !== expected.originalContent
      ) {
        return false;
      }
    }
  }
  for (let index = 0; index < left.mutations.length; index += 1) {
    const current = left.mutations[index];
    const expected = right.mutations[index];
    if (
      current.path !== expected.path ||
      current.category !== expected.category ||
      current.originalContentHash !== expected.originalContentHash ||
      current.originalContent !== expected.originalContent ||
      current.resultingContent !== expected.resultingContent
    ) {
      return false;
    }
  }
  return true;
}

function materializationsMatch(
  left: MaterializedOptionChange,
  right: MaterializedOptionChange
): boolean {
  return (
    left.baseRevision === right.baseRevision &&
    left.resultingRevision === right.resultingRevision &&
    equal(left.affectedEntry, right.affectedEntry) &&
    equal(left.summary, right.summary) &&
    equal(left.ownedFields, right.ownedFields) &&
    plansEqual(left.plan, right.plan)
  );
}


function installCreatedFields(
  rawOptions: unknown,
  rawAccountSettings: unknown,
  ownedFields: OwnedOptionFields
): { rawOptions: Record<string, unknown>; rawAccountSettings: unknown } {
  const options = { ...(isRecord(rawOptions) ? rawOptions : {}) };
  switch (ownedFields.catalog) {
    case 'tags':
      options.tag = clone(ownedFields.tag);
      options.tagColors = clone(ownedFields.tagColors);
      return { rawOptions: options, rawAccountSettings };
    case 'mistakes':
      options.mistake = clone(ownedFields.mistake);
      return { rawOptions: options, rawAccountSettings };
    case 'events':
      options.event = clone(ownedFields.event);
      return { rawOptions: options, rawAccountSettings };
    case 'account_types': {
      options.account_type = clone(ownedFields.account_type);
      const account: Record<string, unknown> = {
        ...(isRecord(rawAccountSettings) ? rawAccountSettings : {}),
        accountTypeOrder: clone(ownedFields.accountTypeOrder),
      };
      if (ownedFields.defaultAccountType !== undefined) {
        account.defaultAccountType = ownedFields.defaultAccountType;
      }
      if (ownedFields.excludedAccountTypes !== undefined) {
        account.excludedAccountTypes = clone(ownedFields.excludedAccountTypes);
      }
      if (ownedFields.includeWithdrawalsFromExcluded !== undefined) {
        account.includeWithdrawalsFromExcluded = clone(
          ownedFields.includeWithdrawalsFromExcluded
        );
      }
      return { rawOptions: options, rawAccountSettings: account };
    }
  }
}

function sequencesMatch(
  left: MaterializedCreateSequence,
  right: MaterializedCreateSequence
): boolean {
  return (
    left.baseRevision === right.baseRevision &&
    left.resultingRevision === right.resultingRevision &&
    left.entries.length === right.entries.length &&
    left.entries.every((entry, index) =>
      materializationsMatch(entry, right.entries[index])
    ) &&
    equal(left.ownedFields, right.ownedFields)
  );
}


export class OptionCatalogPlanner {
  constructor(private readonly dependencies: Dependencies) {}

  private async loadAuthoritativeAccounts(): Promise<
    readonly AccountTypeAssignmentSource[]
  > {
    try {
      return await this.dependencies.getAuthoritativeAccounts();
    } catch (error) {
      if (error instanceof OptionCatalogMutationError) throw error;
      throw new OptionCatalogMutationError('internal_error');
    }
  }

  async plan(
    change: OptionCatalogChange,
    signal: AbortSignal
  ): Promise<MaterializedOptionChange> {
    if (signal.aborted) throw signal.reason;
    const accounts = isAccountTypeCatalogChange(change)
      ? await this.loadAuthoritativeAccounts()
      : undefined;
    const materialized = await materializeOptionCatalogChange({
      rawOptions: this.dependencies.getRawOptions(),
      rawAccountSettings: this.dependencies.getRawAccountSettings(),
      change,
      accounts,
      scanNoteRewrite: isNoteRewriteChange(change)
        ? (resolvedChange) => this.dependencies.scanNoteRewrite(resolvedChange)
        : undefined,
    });
    if (signal.aborted) throw signal.reason;
    return deepFreeze(clone(materialized));
  }

  async planCreates(
    changes: readonly CreateChange[],
    signal: AbortSignal
  ): Promise<MaterializedCreateSequence> {
    if (signal.aborted) throw signal.reason;
    const accounts = changes.some((change) =>
      isAccountTypeCatalogChange(change)
    )
      ? await this.loadAuthoritativeAccounts()
      : undefined;
    const sequence = await materializeCreateSequence(
      this.dependencies.getRawOptions(),
      this.dependencies.getRawAccountSettings(),
      changes,
      accounts
    );
    if (signal.aborted) throw signal.reason;
    return deepFreeze(clone(sequence));
  }

  async execute(
    payload: MaterializedOptionChange,
    signal: AbortSignal
  ): Promise<void> {
    if (signal.aborted) throw signal.reason;
    await this.dependencies.persist(
      this.createPersistenceCommand(payload, signal)
    );
    this.publishCommitted(payload);
    if (isNoteRewriteChange(payload.change) && payload.plan) {
      try {
        this.dependencies.onNoteRewriteCommitted(payload.plan);
      } catch {
        console.error(
          isTagRewriteChange(payload.change)
            ? 'Agent tag rewrite post-commit notification failed.'
            : isMistakeRewriteChange(payload.change)
              ? 'Agent mistake rewrite post-commit notification failed.'
              : 'Agent event rewrite post-commit notification failed.'
        );
      }
    }
  }

  async executeCreates(
    sequence: MaterializedCreateSequence,
    changes: readonly CreateChange[],
    signal: AbortSignal
  ): Promise<void> {
    if (signal.aborted) throw signal.reason;
    const needsAccounts = changes.some((change) =>
      isAccountTypeCatalogChange(change)
    );
    let preparedAccounts: readonly AccountTypeAssignmentSource[] | undefined;
    let accountsPrepared = false;
    await this.dependencies.persist({
      kind: 'settings_only',
      ownedFields: clone(sequence.ownedFields),
      ...(needsAccounts
        ? {
            prepareVerification: async (): Promise<void> => {
              preparedAccounts = await this.loadAuthoritativeAccounts();
              if (signal.aborted) throw signal.reason;
              accountsPrepared = true;
            },
          }
        : {}),
      verifyCurrent: async (rawOptions, rawAccountSettings) => {
        if (needsAccounts && !accountsPrepared) {
          throw new OptionCatalogMutationError('internal_error');
        }
        const rematerialized = await materializeCreateSequence(
          rawOptions,
          rawAccountSettings,
          changes,
          needsAccounts ? preparedAccounts : undefined
        );
        if (!sequencesMatch(rematerialized, sequence)) {
          throw new OptionCatalogMutationError('conflict');
        }
      },
    });
    for (const entry of sequence.entries) this.publishCommitted(entry);
  }

  private publishCommitted(payload: MaterializedOptionChange): void {
    try {
      this.dependencies.onCommitted(payload.change, payload.summary);
    } catch {
      console.error('Option change notification failed after persistence.');
    }
  }

  private createPersistenceCommand(
    payload: MaterializedOptionChange,
    signal?: AbortSignal
  ): AgentOptionsPersistenceCommand {
    const rewriteChange = isNoteRewriteChange(payload.change)
      ? payload.change
      : undefined;
    const needsAccounts = isAccountTypeCatalogChange(payload.change);
    let preparedAccounts: readonly AccountTypeAssignmentSource[] | undefined;
    let accountsPrepared = false;
    const prepareVerification = needsAccounts
      ? async (): Promise<void> => {
          preparedAccounts = await this.loadAuthoritativeAccounts();
          if (signal?.aborted) throw signal.reason;
          accountsPrepared = true;
        }
      : undefined;
    const verifyCurrent = async (
      rawOptions: unknown,
      rawAccountSettings: unknown
    ): Promise<void> => {
      const persistedSnapshot = needsAccounts
        ? snapshotAccountTypePersistedState(rawOptions, rawAccountSettings)
        : undefined;
      const rewritePersistedSnapshot = rewriteChange
        ? snapshotRewritePersistedState(rewriteChange, rawOptions)
        : undefined;
      if (needsAccounts && !accountsPrepared) {
        throw new OptionCatalogMutationError('internal_error');
      }
      const accounts = needsAccounts ? preparedAccounts : undefined;
      const rematerialized = await materializeOptionCatalogChange({
        rawOptions,
        rawAccountSettings,
        change: payload.change,
        expectedBaseRevision: payload.baseRevision,
        accounts,
        scanNoteRewrite: rewriteChange
          ? (resolvedChange) =>
              this.dependencies.scanNoteRewrite(resolvedChange)
          : undefined,
      });
      if (!materializationsMatch(rematerialized, payload)) {
        throw new OptionCatalogMutationError('conflict');
      }
      if (
        rewriteChange !== undefined &&
        !equal(
          rewritePersistedSnapshot,
          snapshotRewritePersistedState(rewriteChange, rawOptions)
        )
      ) {
        throw new OptionCatalogMutationError('conflict');
      }
      if (
        persistedSnapshot !== undefined &&
        !equal(
          persistedSnapshot,
          snapshotAccountTypePersistedState(rawOptions, rawAccountSettings)
        )
      ) {
        throw new OptionCatalogMutationError('conflict');
      }
    };
    if (rewriteChange) {
      if (payload.plan === undefined) {
        throw new OptionCatalogMutationError('internal_error');
      }
      const expectedCatalog = isTagRewriteChange(rewriteChange)
        ? 'tags'
        : isMistakeRewriteChange(rewriteChange)
          ? 'mistakes'
          : 'events';
      if (payload.ownedFields.catalog !== expectedCatalog) {
        throw new OptionCatalogMutationError('internal_error');
      }
      return {
        kind: 'note_rewrite',
        ownedFields: clone(payload.ownedFields),
        plan: deepFreeze(clone(payload.plan)),
        verifyCurrent,
      };
    }
    return {
      kind: 'settings_only',
      ownedFields: clone(payload.ownedFields),
      ...(prepareVerification === undefined ? {} : { prepareVerification }),
      verifyCurrent,
    };
  }
}

async function materializeCreateSequence(
  rawOptions: unknown,
  rawAccountSettings: unknown,
  changes: readonly CreateChange[],
  accounts: readonly AccountTypeAssignmentSource[] | undefined
): Promise<MaterializedCreateSequence> {
  if (changes.length === 0)
    throw new OptionCatalogMutationError('invalid_request');
  const entries: MaterializedOptionChange[] = [];
  let options = rawOptions;
  let account = rawAccountSettings;
  for (const change of changes) {
    const materialized = await materializeOptionCatalogChange({
      rawOptions: options,
      rawAccountSettings: account,
      change,
      accounts,
    });
    entries.push(materialized);
    const installed = installCreatedFields(
      options,
      account,
      materialized.ownedFields
    );
    options = installed.rawOptions;
    account = installed.rawAccountSettings;
  }
  return {
    baseRevision: entries[0].baseRevision,
    resultingRevision: entries[entries.length - 1].resultingRevision,
    entries,
    ownedFields: entries[entries.length - 1].ownedFields,
  };
}
