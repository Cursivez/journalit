import { TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import type {
  AccountMetadata,
  GoalConfig,
  JournalitSettings,
} from '../../settings/types';
import { generateUUID } from '../../utils/uuid';
import { logger } from '../../utils/logger';
import { eventBus } from '../events/EventBus';
import { OptionType } from '../options/CustomOptionsService';
import { BackendSecretStorage } from '../backend/BackendSecretStorage';
import { TradeProjectionClient } from '../tradeSync/TradeProjectionClient';
import { getTradeProjectionVaultId } from '../tradeSync/TradeProjectionAckQueue';
import { normalizeAccountLookupKey } from '../trade/core/TradeAccountIdentity';
import { resolveStageAccountType } from '../propChallenge/stageAccountTypes';
import type { PropChallengePhase } from '../propChallenge/types';
import type { TradeType } from '../tradelog/types';
import {
  repointAccountReferences,
  revertAccountReferences,
} from '../accountPage/accountReferences';
import {
  AccountMergePlanError,
  fingerprintMetadata,
  planAccountMerge,
  rewriteAccountList,
} from './planAccountMerge';
import type {
  AccountMergeBackendMappingStatus,
  AccountMergeBuildSourceInput,
  AccountMergePlan,
  AccountMergePlanInput,
  AccountMergeRecord,
  AccountMergeResult,
  AccountMergeSourceInput,
  AccountMergeTrade,
  AccountReferenceChange,
} from './types';

const MERGE_TRADE_TYPES: TradeType[] = ['regular', 'missed', 'backtest'];

interface AccountMergeSettingsSnapshot {
  accountMetadata: Record<string, AccountMetadata>;
  accountMerges: Record<string, AccountMergeRecord>;
  accountMapping?: Record<string, string>;
  csvFavoriteAccount?: string;
  copyTradeAdjustments?: JournalitSettings['copyTradeAdjustments'];
  homeGoals?: Record<string, GoalConfig>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function normalizeAccountField(value: unknown): string[] {
  if (typeof value === 'string') {
    return value.trim() ? [value] : [];
  }
  if (!Array.isArray(value)) {
    return [];
  }
  const accounts: string[] = [];
  for (const entry of value) {
    if (typeof entry === 'string' && entry.trim()) {
      accounts.push(entry);
    }
  }
  return accounts;
}

function serializeAccountField(
  previousValue: unknown,
  nextAccount: readonly string[]
): string | string[] {
  if (Array.isArray(previousValue) || nextAccount.length !== 1) {
    return [...nextAccount];
  }
  return nextAccount[0];
}

function findPhaseId(
  phases: readonly PropChallengePhase[],
  accountName: string
): string {
  const accountKey = normalizeAccountLookupKey(accountName);
  for (const phase of phases) {
    if (
      typeof phase.legacyAccountName === 'string' &&
      normalizeAccountLookupKey(phase.legacyAccountName) === accountKey
    ) {
      return phase.id;
    }
  }
  return '';
}

function sameAccountKeys(
  left: readonly string[],
  right: readonly string[]
): boolean {
  const normalize = (names: readonly string[]) =>
    names.map((name) => normalizeAccountLookupKey(name)).sort();
  const a = normalize(left);
  const b = normalize(right);
  return a.length === b.length && a.every((key, index) => key === b[index]);
}


function collectPlanSourceKeys(plan: AccountMergePlan): ReadonlySet<string> {
  const targetKey = normalizeAccountLookupKey(plan.targetAccountName);
  const keys = new Set<string>();
  for (const name of plan.sourcesToArchive) {
    keys.add(normalizeAccountLookupKey(name));
  }
  for (const phase of plan.phases) {
    if (phase.legacyAccountName) {
      keys.add(normalizeAccountLookupKey(phase.legacyAccountName));
    }
  }
  for (const rewrite of plan.noteRewrites) {
    for (const name of rewrite.previousAccount) {
      const key = normalizeAccountLookupKey(name);
      if (key !== targetKey && !rewrite.nextAccount.includes(name)) {
        keys.add(key);
      }
    }
  }
  return keys;
}


function restoreMergedNoteAccounts(
  current: readonly string[],
  targetAccountName: string,
  previousAccount: readonly string[]
): string[] | undefined {
  const targetKey = normalizeAccountLookupKey(targetAccountName);
  let targetIndex = -1;
  for (let index = 0; index < current.length; index += 1) {
    if (normalizeAccountLookupKey(current[index]) === targetKey) {
      targetIndex = index;
      break;
    }
  }
  if (targetIndex < 0) {
    return undefined;
  }

  const next: string[] = [];
  const seen = new Set<string>();
  const pushUnique = (name: string): void => {
    const key = normalizeAccountLookupKey(name);
    if (seen.has(key)) return;
    seen.add(key);
    next.push(name);
  };

  for (let index = 0; index < current.length; index += 1) {
    if (index === targetIndex) {
      for (const name of previousAccount) {
        pushUnique(name);
      }
      continue;
    }
    pushUnique(current[index]);
  }
  return next;
}

export class AccountMergeService {
  constructor(private readonly plugin: JournalitPlugin) {}

  public async buildPlanInput(
    targetAccountName: string,
    sources: readonly AccountMergeBuildSourceInput[]
  ): Promise<AccountMergePlanInput> {
    const accountPageService = this.requireAccountPageService();
    const sourceInputs: AccountMergeSourceInput[] = [];

    
    
    for (const source of sources) {
      
      
      const metadata = accountPageService.getRevivedAccountMetadata(
        source.accountName
      );
      if (!metadata) {
        throw new AccountMergePlanError(
          'source_missing',
          `Source account "${source.accountName}" has no metadata.`
        );
      }

      const trades = (
        await accountPageService.getAccountTrades(
          source.accountName,
          MERGE_TRADE_TYPES
        )
      ).filter((trade) => !trade.isCopiedTrade);

      const mergeTrades: AccountMergeTrade[] = [];
      for (const trade of trades) {
        mergeTrades.push({
          path: trade.path,
          account: this.readAccountFieldFromCache(trade.path),
          entryTime: trade.entryTime,
          exitTime: trade.exitTime,
          settlementTime: trade.settlementTime,
          accountId: trade.accountId,
          canonicalAccountId: trade.canonicalAccountId,
          canonicalAccountIdentity: trade.canonicalAccountIdentity,
        });
      }

      sourceInputs.push({
        accountName: source.accountName,
        metadata,
        trades: mergeTrades,
        phaseName: source.phaseName,
        stage: source.stage,
        status: source.status,
        startedAt: source.startedAt,
        completedAt: source.completedAt,
        startingBalance: source.startingBalance,
        ...(source.rules ? { rules: source.rules } : {}),
      });
    }

    const catalog = await accountPageService.getAccountCatalog();
    const availableTypes = this.plugin.optionsService
      ? this.plugin.optionsService.getOptions(OptionType.ACCOUNT_TYPE)
      : [];

    return {
      targetAccountName,
      sources: sourceInputs,
      existingAccountNames: catalog.map((entry) => entry.name),
      now: new Date(),
      
      
      resolveAccountTypeForStage: (stage) =>
        resolveStageAccountType(
          this.plugin.settings.account?.challengeStageAccountTypes,
          stage,
          availableTypes
        ),
    };
  }

  public plan(input: AccountMergePlanInput) {
    return planAccountMerge(input);
  }

  public async execute(plan: AccountMergePlan): Promise<AccountMergeResult> {
    this.assertPlanStillValid(plan);

    const appliedRewrites = await this.applyNoteRewrites(
      plan.noteRewrites.map((rewrite) => ({
        path: rewrite.path,
        nextAccount: rewrite.nextAccount,
        expectedPrevious: rewrite.previousAccount,
      })),
      {
        sourceKeys: collectPlanSourceKeys(plan),
        targetAccountName: plan.targetAccountName,
      }
    );
    const rewrittenNotes = appliedRewrites.length;

    const snapshot = this.captureSettingsSnapshot();
    const now = new Date();
    
    
    
    const addsAccountOption = this.accountOptionMissing(plan.targetAccountName);
    let record: AccountMergeRecord;
    try {
      record = this.mutateSettingsForExecute(
        plan,
        now,
        appliedRewrites,
        addsAccountOption
      );
      await this.plugin.saveSettings();
    } catch (error) {
      this.restoreSettingsSnapshot(snapshot);
      await this.restoreNotesBestEffort(
        appliedRewrites.map((rewrite) => ({
          path: rewrite.path,
          account: rewrite.previousAccount,
        }))
      );
      throw error;
    }

    await this.ensureAccountOption(plan.targetAccountName);
    this.publishMergeEvents(plan);
    await this.requireAccountPageService().refreshAllAccountData();

    const backendMappings = await this.repointBackendMappings(plan, record.id);
    record.backendMappings = backendMappings;

    return {
      recordId: record.id,
      rewrittenNotes,
      backendMappings,
    };
  }

  public async undo(recordId: string): Promise<void> {
    const record = this.requireRecord(recordId);
    const noteRestores: Array<{ path: string; nextAccount: string[] }> = [];
    for (const note of record.notes) {
      const current = this.readAccountFieldFromCache(note.path);
      const nextAccount = restoreMergedNoteAccounts(
        current,
        record.targetAccountName,
        note.previousAccount
      );
      if (nextAccount === undefined) {
        continue;
      }
      noteRestores.push({ path: note.path, nextAccount });
    }
    const appliedRewrites = await this.applyNoteRewrites(noteRestores);

    const snapshot = this.captureSettingsSnapshot();
    const backendMappings = [...record.backendMappings];
    const addedAccountOption = record.addedAccountOption === true;
    const targetAccountName = record.targetAccountName;
    const filePaths = record.notes.map((note) => note.path);
    const accountNames = [
      record.targetAccountName,
      ...record.sources.map((source) => source.accountName),
    ];

    try {
      this.restoreArchivedSources(record);
      this.restoreTargetMetadata(record);
      revertAccountReferences(this.plugin.settings, record.referenceChanges);
      const merges = this.requireAccountSettings().accountMerges;
      if (merges) {
        delete merges[recordId];
      }
      await this.plugin.saveSettings();
    } catch (error) {
      this.restoreSettingsSnapshot(snapshot);
      await this.restoreNotesBestEffort(
        appliedRewrites.map((rewrite) => ({
          path: rewrite.path,
          account: rewrite.previousAccount,
        }))
      );
      throw error;
    }

    if (addedAccountOption) {
      await this.removeAccountOption(targetAccountName);
    }
    this.publishAccountAndTradeEvents(
      targetAccountName,
      accountNames,
      filePaths
    );
    await this.requireAccountPageService().refreshAllAccountData();
    await this.repointBackendMappingsFromRecord(backendMappings);
  }

  public async deleteLegacyAccounts(recordId: string): Promise<void> {
    const record = this.requireRecord(recordId);
    const accountPageService = this.requireAccountPageService();
    const targetKey = normalizeAccountLookupKey(record.targetAccountName);
    const deletedNames: string[] = [];

    
    
    for (const source of record.sources) {
      if (normalizeAccountLookupKey(source.accountName) === targetKey) {
        continue;
      }
      await accountPageService.deleteAccount(source.accountName);
      deletedNames.push(source.accountName);
    }

    const merges = this.requireAccountSettings().accountMerges;
    if (merges) {
      delete merges[recordId];
    }
    await this.plugin.saveSettings();

    eventBus.publish('account:changed', {
      action: 'batch-updated',
      accountName: record.targetAccountName,
      accountNames: [record.targetAccountName, ...deletedNames],
    });
    await accountPageService.refreshAllAccountData();
  }

  public getRecordForAccount(
    accountName: string
  ): AccountMergeRecord | undefined {
    const targetKey = normalizeAccountLookupKey(accountName);
    let latest: AccountMergeRecord | undefined;
    for (const record of this.listRecords()) {
      if (normalizeAccountLookupKey(record.targetAccountName) !== targetKey) {
        continue;
      }
      if (!latest || record.mergedAt > latest.mergedAt) {
        latest = record;
      }
    }
    return latest;
  }

  public listRecords(): AccountMergeRecord[] {
    const merges = this.plugin.settings.account?.accountMerges;
    if (!merges) {
      return [];
    }
    return Object.values(merges);
  }

  private requireAccountPageService() {
    const service = this.plugin.accountPageService;
    if (!service) {
      throw new Error('Account page service is not initialized');
    }
    return service;
  }

  private requireAccountSettings() {
    const account = this.plugin.settings.account;
    if (!account) {
      throw new Error('Account settings are not initialized');
    }
    return account;
  }

  private requireRecord(recordId: string): AccountMergeRecord {
    const record = this.plugin.settings.account?.accountMerges?.[recordId];
    if (!record) {
      throw new Error(`Account merge record "${recordId}" was not found.`);
    }
    return record;
  }

  private requireSourceMetadata(accountName: string): {
    key: string;
    metadata: AccountMetadata;
  } {
    const entry =
      this.requireAccountPageService().getAccountMetadataEntry(accountName);
    if (!entry) {
      throw new AccountMergePlanError(
        'source_missing',
        `Source account "${accountName}" has no metadata.`
      );
    }
    return entry;
  }

  private assertPlanStillValid(plan: AccountMergePlan): void {
    const sourceNames = [...plan.sourcesToArchive];
    if (plan.targetIsSource) {
      sourceNames.push(plan.targetAccountName);
    }

    for (const sourceName of sourceNames) {
      this.assertSourceMetadataUnchanged(sourceName, plan);
    }

    const targetEntry =
      this.requireAccountPageService().getAccountMetadataEntry(
        plan.targetAccountName
      );

    if (plan.targetIsSource) {
      return;
    }

    if (targetEntry) {
      throw new AccountMergePlanError(
        'target_exists',
        'Target account already exists and is not one of the merge sources.'
      );
    }
  }

  private assertSourceMetadataUnchanged(
    accountName: string,
    plan: AccountMergePlan
  ): void {
    
    
    const metadata =
      this.requireAccountPageService().getRevivedAccountMetadata(accountName);
    if (!metadata) {
      throw new AccountMergePlanError(
        'source_missing',
        `Source account "${accountName}" has no metadata.`
      );
    }
    const expected =
      plan.sourceMetadataFingerprints[normalizeAccountLookupKey(accountName)];
    if (expected !== fingerprintMetadata(metadata)) {
      throw new AccountMergePlanError(
        'source_changed',
        'A source account changed since the merge was planned.'
      );
    }
  }

  private readAccountFieldFromCache(path: string): string[] {
    const file = this.plugin.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      return [];
    }
    return normalizeAccountField(
      this.plugin.app.metadataCache.getFileCache(file)?.frontmatter?.account
    );
  }

  private requireFile(path: string): TFile {
    const file = this.plugin.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      throw new Error(`Account merge could not find note "${path}".`);
    }
    return file;
  }

  private async writeNoteAccount(
    path: string,
    nextAccount: readonly string[],
    revalidate?: {
      expectedPrevious: readonly string[];
      sourceKeys: ReadonlySet<string>;
      targetAccountName: string;
    }
  ): Promise<string[]> {
    const file = this.requireFile(path);
    let previousAccount: string[] = [];
    await this.plugin.app.fileManager.processFrontMatter(
      file,
      (frontmatter) => {
        if (!isRecord(frontmatter)) {
          return;
        }
        previousAccount = normalizeAccountField(frontmatter.account);
        
        
        
        const effectiveNext =
          revalidate &&
          !sameAccountKeys(previousAccount, revalidate.expectedPrevious)
            ? rewriteAccountList(
                previousAccount,
                revalidate.sourceKeys,
                revalidate.targetAccountName
              )
            : nextAccount;
        frontmatter.account = serializeAccountField(
          frontmatter.account,
          effectiveNext
        );
      }
    );
    return previousAccount;
  }

  private async applyNoteRewrites(
    rewrites: ReadonlyArray<{
      path: string;
      nextAccount: readonly string[];
      restoreAccount?: readonly string[];
      expectedPrevious?: readonly string[];
    }>,
    revalidation?: {
      sourceKeys: ReadonlySet<string>;
      targetAccountName: string;
    }
  ): Promise<Array<{ path: string; previousAccount: string[] }>> {
    const completed: Array<{
      path: string;
      previousAccount: string[];
      restoreAccount: string[];
    }> = [];
    try {
      
      for (const rewrite of rewrites) {
        const previousAccount = await this.writeNoteAccount(
          rewrite.path,
          rewrite.nextAccount,
          revalidation && rewrite.expectedPrevious
            ? { ...revalidation, expectedPrevious: rewrite.expectedPrevious }
            : undefined
        );
        completed.push({
          path: rewrite.path,
          previousAccount,
          restoreAccount: rewrite.restoreAccount
            ? [...rewrite.restoreAccount]
            : previousAccount,
        });
      }
      return completed.map((rewrite) => ({
        path: rewrite.path,
        previousAccount: rewrite.previousAccount,
      }));
    } catch (error) {
      await this.restoreNotesBestEffort(
        completed.map((rewrite) => ({
          path: rewrite.path,
          account: rewrite.restoreAccount,
        }))
      );
      throw error;
    }
  }

  private async restoreNotesBestEffort(
    rewrites: ReadonlyArray<{ path: string; account: readonly string[] }>
  ): Promise<void> {
    
    for (let index = rewrites.length - 1; index >= 0; index -= 1) {
      const rewrite = rewrites[index];
      try {
        await this.writeNoteAccount(rewrite.path, rewrite.account);
      } catch (error) {
        logger.warn(
          'Failed to restore note after account merge write failure',
          error
        );
      }
    }
  }

  private mutateSettingsForExecute(
    plan: AccountMergePlan,
    now: Date,
    notes: ReadonlyArray<{ path: string; previousAccount: readonly string[] }>,
    addsAccountOption = false
  ): AccountMergeRecord {
    const account = this.requireAccountSettings();
    if (!account.accountMetadata) {
      account.accountMetadata = {};
    }
    if (!account.accountMerges) {
      account.accountMerges = {};
    }
    const accountMetadata = account.accountMetadata;

    const referenceChanges: AccountReferenceChange[] = [];
    let previousTargetMetadata: AccountMetadata | undefined;
    if (plan.targetIsSource) {
      const targetEntry = this.requireSourceMetadata(plan.targetAccountName);
      previousTargetMetadata = cloneValue(targetEntry.metadata);
      if (targetEntry.key !== plan.targetAccountName) {
        
        delete accountMetadata[targetEntry.key];
        referenceChanges.push(
          ...repointAccountReferences(
            this.plugin.settings,
            targetEntry.key,
            plan.targetAccountName
          )
        );
      }
    }

    accountMetadata[plan.targetAccountName] = cloneValue(plan.targetMetadata);

    const sources: AccountMergeRecord['sources'] = [];
    if (plan.targetIsSource && previousTargetMetadata) {
      sources.push({
        accountName: plan.targetAccountName,
        previousAccountType: String(previousTargetMetadata.accountType),
        phaseId: findPhaseId(plan.phases, plan.targetAccountName),
      });
    }

    for (const sourceName of plan.sourcesToArchive) {
      const sourceEntry = this.requireSourceMetadata(sourceName);
      sources.push({
        accountName: sourceName,
        previousAccountType: String(sourceEntry.metadata.accountType),
        phaseId: findPhaseId(plan.phases, sourceName),
      });
      sourceEntry.metadata.accountType = 'archived';
      sourceEntry.metadata.mergedInto = plan.targetAccountName;
      sourceEntry.metadata.lastUpdated = new Date(now.getTime());
      referenceChanges.push(
        ...repointAccountReferences(
          this.plugin.settings,
          sourceName,
          plan.targetAccountName
        )
      );
    }

    const record: AccountMergeRecord = {
      id: generateUUID(),
      mergedAt: now.toISOString(),
      targetAccountName: plan.targetAccountName,
      targetWasSource: plan.targetIsSource,
      sources,
      notes: notes.map((note) => ({
        path: note.path,
        previousAccount: [...note.previousAccount],
      })),
      referenceChanges,
      backendMappings: [],
      ...(addsAccountOption ? { addedAccountOption: true } : {}),
    };
    if (previousTargetMetadata) {
      record.previousTargetMetadata = previousTargetMetadata;
    }

    account.accountMerges[record.id] = record;
    return record;
  }

  private restoreArchivedSources(record: AccountMergeRecord): void {
    const accountMetadata = this.requireAccountSettings().accountMetadata;
    if (!accountMetadata) {
      return;
    }
    const targetKey = normalizeAccountLookupKey(record.targetAccountName);
    for (const source of record.sources) {
      if (normalizeAccountLookupKey(source.accountName) === targetKey) {
        continue;
      }
      const entry = this.requireAccountPageService().getAccountMetadataEntry(
        source.accountName
      );
      if (!entry) {
        continue;
      }
      entry.metadata.accountType = source.previousAccountType;
      delete entry.metadata.mergedInto;
    }
  }

  private restoreTargetMetadata(record: AccountMergeRecord): void {
    const accountMetadata = this.requireAccountSettings().accountMetadata;
    if (!accountMetadata) {
      return;
    }
    if (record.targetWasSource) {
      if (record.previousTargetMetadata) {
        accountMetadata[record.targetAccountName] = cloneValue(
          record.previousTargetMetadata
        );
      }
      return;
    }
    delete accountMetadata[record.targetAccountName];
  }

  private captureSettingsSnapshot(): AccountMergeSettingsSnapshot {
    const account = this.plugin.settings.account;
    return {
      accountMetadata: cloneValue(account?.accountMetadata ?? {}),
      accountMerges: cloneValue(account?.accountMerges ?? {}),
      accountMapping: cloneValue(
        this.plugin.settings.backendIntegration?.accountMapping
      ),
      csvFavoriteAccount: this.plugin.settings.csvFavoriteAccount,
      copyTradeAdjustments: cloneValue(
        this.plugin.settings.copyTradeAdjustments
      ),
      homeGoals: cloneValue(this.plugin.settings.home?.goals),
    };
  }

  private restoreSettingsSnapshot(
    snapshot: AccountMergeSettingsSnapshot
  ): void {
    const account = this.plugin.settings.account;
    if (account) {
      account.accountMetadata = cloneValue(snapshot.accountMetadata);
      account.accountMerges = cloneValue(snapshot.accountMerges);
    }

    if (this.plugin.settings.backendIntegration) {
      if (snapshot.accountMapping === undefined) {
        delete this.plugin.settings.backendIntegration.accountMapping;
      } else {
        this.plugin.settings.backendIntegration.accountMapping = cloneValue(
          snapshot.accountMapping
        );
      }
    }

    this.plugin.settings.csvFavoriteAccount = snapshot.csvFavoriteAccount;

    if (snapshot.copyTradeAdjustments === undefined) {
      delete this.plugin.settings.copyTradeAdjustments;
    } else {
      this.plugin.settings.copyTradeAdjustments = cloneValue(
        snapshot.copyTradeAdjustments
      );
    }

    if (this.plugin.settings.home) {
      if (snapshot.homeGoals === undefined) {
        delete this.plugin.settings.home.goals;
      } else {
        this.plugin.settings.home.goals = cloneValue(snapshot.homeGoals);
      }
    }
  }

  
  private accountOptionMissing(accountName: string): boolean {
    const optionsService = this.plugin.optionsService;
    if (!optionsService) return false;
    try {
      const targetKey = normalizeAccountLookupKey(accountName);
      return !optionsService
        .getOptions(OptionType.ACCOUNT)
        .some((option) => normalizeAccountLookupKey(option) === targetKey);
    } catch (error) {
      logger.warn('Failed to read ACCOUNT options', error);
      return false;
    }
  }

  private async ensureAccountOption(accountName: string): Promise<void> {
    const optionsService = this.plugin.optionsService;
    if (!optionsService || !this.accountOptionMissing(accountName)) {
      return;
    }
    try {
      await optionsService.addOption(OptionType.ACCOUNT, accountName);
    } catch (error) {
      logger.warn(
        'Failed to add merged account name to ACCOUNT options',
        error
      );
    }
  }

  
  private async removeAccountOption(accountName: string): Promise<void> {
    const optionsService = this.plugin.optionsService;
    if (!optionsService) return;
    try {
      await optionsService.removeOption(OptionType.ACCOUNT, accountName);
    } catch (error) {
      logger.warn(
        'Failed to remove merged account name from ACCOUNT options',
        error
      );
    }
  }

  private publishMergeEvents(plan: AccountMergePlan): void {
    this.publishAccountAndTradeEvents(
      plan.targetAccountName,
      [plan.targetAccountName, ...plan.sourcesToArchive],
      plan.noteRewrites.map((rewrite) => rewrite.path)
    );
  }

  private publishAccountAndTradeEvents(
    accountName: string,
    accountNames: string[],
    filePaths: string[]
  ): void {
    eventBus.publish('trade:changed', {
      action: 'batch',
      filePaths,
    });
    eventBus.publish('account:changed', {
      action: 'batch-updated',
      accountName,
      accountNames,
    });
  }

  private async repointBackendMappings(
    plan: AccountMergePlan,
    recordId: string
  ): Promise<AccountMergeRecord['backendMappings']> {
    const mappings = await this.repointBackendMappingsFromPlan(plan);
    const stored = this.plugin.settings.account?.accountMerges?.[recordId];
    if (stored) {
      stored.backendMappings = mappings;
      try {
        await this.plugin.saveSettings();
      } catch (error) {
        logger.warn(
          'Failed to persist account merge backend mapping results',
          error
        );
      }
    }
    return mappings;
  }

  private async repointBackendMappingsFromPlan(
    plan: AccountMergePlan
  ): Promise<AccountMergeRecord['backendMappings']> {
    const context = await this.getProjectionContext();
    if (!context) {
      return [];
    }

    const archivedKeys = new Set(
      plan.sourcesToArchive.map((name) => normalizeAccountLookupKey(name))
    );
    const mappings: AccountMergeRecord['backendMappings'] = [];

    let inventory;
    try {
      inventory = await context.service.getAccountInventory(context.vaultId);
    } catch (error) {
      logger.warn(
        'Account merge skipped Trade Projection remapping because inventory was unavailable',
        error
      );
      return [];
    }

    const targetLocalAccountId = await this.resolveLocalAccountId(
      plan.targetAccountName
    );

    
    
    for (const account of inventory.accounts) {
      const previousLocalAccountName = account.mapping?.localAccountName;
      if (
        typeof previousLocalAccountName !== 'string' ||
        !archivedKeys.has(normalizeAccountLookupKey(previousLocalAccountName))
      ) {
        continue;
      }

      const previousLocalAccountId =
        typeof account.mapping?.localAccountId === 'string' &&
        account.mapping.localAccountId.trim()
          ? account.mapping.localAccountId
          : undefined;

      let status: AccountMergeBackendMappingStatus = 'failed';
      try {
        await context.service.updateAccountVaultMapping(account.accountId, {
          vaultId: context.vaultId,
          localAccountId: targetLocalAccountId,
          localAccountName: plan.targetAccountName,
          mappingStatus: 'mapped',
        });
        status = 'repointed';
      } catch (error) {
        logger.warn('Account merge Trade Projection remapping failed', error);
      }

      mappings.push({
        backendAccountId: account.accountId,
        previousLocalAccountName,
        ...(previousLocalAccountId ? { previousLocalAccountId } : {}),
        status,
      });
    }

    return mappings;
  }

  private async repointBackendMappingsFromRecord(
    backendMappings: AccountMergeRecord['backendMappings']
  ): Promise<void> {
    const context = await this.getProjectionContext();
    if (!context) {
      return;
    }

    
    for (const mapping of backendMappings) {
      if (mapping.status !== 'repointed') {
        continue;
      }
      try {
        await context.service.updateAccountVaultMapping(
          mapping.backendAccountId,
          {
            vaultId: context.vaultId,
            localAccountId:
              mapping.previousLocalAccountId ??
              mapping.previousLocalAccountName,
            localAccountName: mapping.previousLocalAccountName,
            mappingStatus: 'mapped',
          }
        );
      } catch (error) {
        logger.warn(
          'Account merge undo Trade Projection remapping failed',
          error
        );
      }
    }
  }

  private async resolveLocalAccountId(accountName: string): Promise<string> {
    try {
      const catalog =
        await this.requireAccountPageService().getAccountCatalog();
      const localAccountIdsByName: Record<string, string> = {};
      for (const entry of catalog) {
        if (entry.archived || !entry.name) {
          continue;
        }
        localAccountIdsByName[entry.name] = entry.id || entry.name;
      }
      return localAccountIdsByName[accountName] || accountName;
    } catch (error) {
      logger.warn(
        'Account merge could not resolve local account id for Trade Projection remapping',
        error
      );
      return accountName;
    }
  }

  private async getProjectionContext(): Promise<
    | {
        service: TradeProjectionClient;
        vaultId: string;
      }
    | undefined
  > {
    try {
      if (!BackendSecretStorage.hasAuthToken(this.plugin)) {
        return undefined;
      }
      const vaultId = await getTradeProjectionVaultId(this.plugin);
      if (!vaultId) {
        return undefined;
      }
      return {
        service: new TradeProjectionClient(),
        vaultId,
      };
    } catch (error) {
      logger.warn('Account merge skipped Trade Projection remapping', error);
      return undefined;
    }
  }
}
