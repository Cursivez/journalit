

import JournalitPlugin from '../../main';
import { ApiClient } from './ApiClient';
import {
  BackendIntegrationSettings,
  AccountInfo,
  DEFAULT_SETTINGS,
  GoalConfig,
} from '../../settings/types';
import { eventBus } from '../events';
import { normalizeAccountLookupKey } from '../trade/core/TradeAccountIdentity';

interface ApiAccountInfo {
  accountId?: string | number;
  account_id?: string | number;
  mt_account_id?: string | number;
  displayName?: string;
  display_name?: string;
  brokerName?: string;
  broker_name?: string;
  firstSeen?: string;
  first_seen?: string;
  lastSeen?: string;
  last_seen?: string;
  status?: AccountInfo['status'];
  ignoredAt?: string;
  ignored_at?: string;
}

export class AccountManagementService {
  private plugin: JournalitPlugin;

  
  private get settings(): BackendIntegrationSettings {
    if (!this.plugin.settings.backendIntegration) {
      console.error(
        'AccountManagementService: backendIntegration is undefined, using defaults'
      );
      this.plugin.settings.backendIntegration = {
        ...DEFAULT_SETTINGS.backendIntegration!,
      };
    }
    return this.plugin.settings.backendIntegration;
  }

  constructor(plugin: JournalitPlugin, _settings: BackendIntegrationSettings) {
    this.plugin = plugin;
    
    
  }

  private restoreRecord<T>(
    target: Record<string, T>,
    snapshot: Record<string, T>
  ): void {
    for (const key of Object.keys(target)) {
      if (!(key in snapshot)) {
        delete target[key];
      }
    }

    for (const [key, value] of Object.entries(snapshot)) {
      target[key] = value;
    }
  }

  private migrateAccountMetadataKey(
    previousDisplayName: string | undefined,
    nextDisplayName: string
  ): void {
    const normalizedPrevious = previousDisplayName?.trim();
    const normalizedNext = nextDisplayName.trim();
    if (
      !normalizedPrevious ||
      !normalizedNext ||
      normalizedPrevious === normalizedNext
    ) {
      return;
    }

    const accountMetadata = this.plugin.settings.account?.accountMetadata;
    if (!accountMetadata) {
      return;
    }

    const nextLookupKey = normalizeAccountLookupKey(normalizedNext);
    const previousLookupKey = normalizeAccountLookupKey(normalizedPrevious);

    const existingNextMetadataKey = Object.keys(accountMetadata).find(
      (key) => normalizeAccountLookupKey(key) === nextLookupKey
    );

    if (
      existingNextMetadataKey &&
      normalizeAccountLookupKey(existingNextMetadataKey) !== previousLookupKey
    ) {
      return;
    }

    const previousMetadataKey = Object.keys(accountMetadata).find(
      (key) => normalizeAccountLookupKey(key) === previousLookupKey
    );
    if (!previousMetadataKey) {
      return;
    }

    const previousMetadata = accountMetadata[previousMetadataKey];
    if (!previousMetadata) {
      return;
    }

    delete accountMetadata[previousMetadataKey];
    accountMetadata[normalizedNext] = {
      ...previousMetadata,
      name: normalizedNext,
      lastUpdated: new Date(),
    };
  }

  private cloneHomeGoals(): Record<string, GoalConfig> | undefined {
    const homeGoals = this.plugin.settings.home?.goals;
    if (!homeGoals) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(homeGoals).map(([goalId, goalConfig]) => [
        goalId,
        {
          ...goalConfig,
          accountTargets: goalConfig.accountTargets
            ? { ...goalConfig.accountTargets }
            : undefined,
          accountTargetAccounts: goalConfig.accountTargetAccounts
            ? [...goalConfig.accountTargetAccounts]
            : undefined,
        },
      ])
    );
  }

  private migrateHomeGoalAccountTargets(
    previousDisplayName: string | undefined,
    nextDisplayName: string
  ): void {
    const normalizedPrevious = previousDisplayName?.trim();
    const normalizedNext = nextDisplayName.trim();
    if (
      !normalizedPrevious ||
      !normalizedNext ||
      normalizedPrevious === normalizedNext
    ) {
      return;
    }

    const homeGoals = this.plugin.settings.home?.goals;
    if (!homeGoals) {
      return;
    }

    const previousLookupKey = normalizeAccountLookupKey(normalizedPrevious);
    const nextLookupKey = normalizeAccountLookupKey(normalizedNext);
    for (const goalConfig of Object.values(homeGoals)) {
      if (goalConfig.accountTargets) {
        const accountTargetKeyByLookup = new Map(
          Object.keys(goalConfig.accountTargets).map((accountName) => [
            normalizeAccountLookupKey(accountName),
            accountName,
          ])
        );

        for (const [accountName, target] of Object.entries(
          goalConfig.accountTargets
        )) {
          if (normalizeAccountLookupKey(accountName) !== previousLookupKey) {
            continue;
          }

          const existingNextTargetKey =
            accountTargetKeyByLookup.get(nextLookupKey);

          if (!existingNextTargetKey || existingNextTargetKey === accountName) {
            goalConfig.accountTargets[normalizedNext] = target;
          }
          delete goalConfig.accountTargets[accountName];
        }
      }

      if (goalConfig.accountTargetAccounts) {
        const seenAccounts = new Set<string>();
        goalConfig.accountTargetAccounts = goalConfig.accountTargetAccounts
          .map((accountName) =>
            normalizeAccountLookupKey(accountName) === previousLookupKey
              ? normalizedNext
              : accountName
          )
          .filter((accountName) => {
            const lookupKey = normalizeAccountLookupKey(accountName);
            if (seenAccounts.has(lookupKey)) {
              return false;
            }

            seenAccounts.add(lookupKey);
            return true;
          });
      }
    }
  }

  
  getAccountDisplayName(accountId: string): string {
    if (
      this.settings.accountMapping &&
      this.settings.accountMapping[accountId]
    ) {
      return this.settings.accountMapping[accountId];
    }

    
    return `Account-${accountId}`;
  }

  
  async createAccountMapping(
    accountId: string,
    displayName: string,
    options?: {
      previousDisplayName?: string;
    }
  ): Promise<void> {
    if (!this.settings.accountMapping) {
      this.settings.accountMapping = {};
    }

    const previousDisplayName = this.settings.accountMapping[accountId];
    const mappingSnapshot = { ...this.settings.accountMapping };
    const accountMetadata = this.plugin.settings.account?.accountMetadata;
    const metadataSnapshot = accountMetadata
      ? { ...accountMetadata }
      : undefined;
    const homeGoalsSnapshot = this.cloneHomeGoals();

    const migrationPreviousDisplayName =
      previousDisplayName ?? options?.previousDisplayName;

    this.settings.accountMapping[accountId] = displayName;
    this.migrateAccountMetadataKey(migrationPreviousDisplayName, displayName);
    this.migrateHomeGoalAccountTargets(
      migrationPreviousDisplayName,
      displayName
    );

    try {
      await this.plugin.saveSettings();
    } catch (error) {
      this.restoreRecord(this.settings.accountMapping, mappingSnapshot);
      if (accountMetadata && metadataSnapshot) {
        this.restoreRecord(accountMetadata, metadataSnapshot);
      }
      if (this.plugin.settings.home?.goals && homeGoalsSnapshot) {
        this.restoreRecord(this.plugin.settings.home.goals, homeGoalsSnapshot);
      }
      throw error;
    }

    const accountNames = [displayName, accountId];
    const accountNamesCandidates = [
      previousDisplayName,
      options?.previousDisplayName,
      previousDisplayName || options?.previousDisplayName
        ? undefined
        : `Account-${accountId}`,
    ];

    for (const candidate of accountNamesCandidates) {
      if (typeof candidate !== 'string') {
        continue;
      }

      const normalizedCandidate = candidate.trim();
      if (
        normalizedCandidate &&
        normalizedCandidate.toLowerCase() !== displayName.trim().toLowerCase()
      ) {
        accountNames.push(normalizedCandidate);
      }
    }

    eventBus.publish('account:changed', {
      action: 'updated',
      accountId,
      accountName: displayName,
      accountNames: Array.from(new Set(accountNames)),
    });
  }

  
  async updateAccountMappings(accounts: AccountInfo[]): Promise<void> {
    if (!this.settings.accountMapping) {
      this.settings.accountMapping = {};
    }

    let hasChanges = false;
    const updatedMappings: Array<{
      accountId: string;
      nextDisplayName: string;
      previousDisplayName?: string;
    }> = [];
    const updatedAccountNames = new Set<string>();
    const mappingSnapshot = { ...this.settings.accountMapping };
    const accountMetadata = this.plugin.settings.account?.accountMetadata;
    const metadataSnapshot = accountMetadata
      ? { ...accountMetadata }
      : undefined;
    const homeGoalsSnapshot = this.cloneHomeGoals();
    const accountCatalog = await this.plugin.accountPageService
      ?.getAccountCatalog()
      .catch(() => []);
    const localAccountNames = new Set(
      accountCatalog?.map((account) => account.name) ?? []
    );

    for (const account of accounts) {
      const previousDisplayName =
        this.settings.accountMapping[account.accountId];
      const canApplyDisplayName = Boolean(
        account.displayName &&
        (localAccountNames.has(account.displayName) || previousDisplayName)
      );

      if (
        canApplyDisplayName &&
        account.displayName &&
        (!this.settings.accountMapping[account.accountId] ||
          this.settings.accountMapping[account.accountId] !==
            account.displayName)
      ) {
        this.settings.accountMapping[account.accountId] = account.displayName;
        this.migrateAccountMetadataKey(
          previousDisplayName,
          account.displayName
        );
        this.migrateHomeGoalAccountTargets(
          previousDisplayName,
          account.displayName
        );
        updatedMappings.push({
          accountId: account.accountId,
          nextDisplayName: account.displayName,
          previousDisplayName:
            typeof previousDisplayName === 'string'
              ? previousDisplayName
              : undefined,
        });
        updatedAccountNames.add(account.displayName);
        updatedAccountNames.add(account.accountId);
        if (
          typeof previousDisplayName === 'string' &&
          previousDisplayName.trim()
        ) {
          updatedAccountNames.add(previousDisplayName.trim());
        }
        hasChanges = true;
      }
    }

    if (hasChanges) {
      try {
        await this.plugin.saveSettings();
      } catch (error) {
        this.restoreRecord(this.settings.accountMapping, mappingSnapshot);
        if (accountMetadata && metadataSnapshot) {
          this.restoreRecord(accountMetadata, metadataSnapshot);
        }
        if (this.plugin.settings.home?.goals && homeGoalsSnapshot) {
          this.restoreRecord(
            this.plugin.settings.home.goals,
            homeGoalsSnapshot
          );
        }
        throw error;
      }

      for (const mapping of updatedMappings) {
        const accountNames = [mapping.nextDisplayName, mapping.accountId];
        if (mapping.previousDisplayName?.trim()) {
          accountNames.push(mapping.previousDisplayName.trim());
        }

        eventBus.publish('account:changed', {
          action: 'updated',
          accountId: mapping.accountId,
          accountName: mapping.nextDisplayName,
          accountNames: Array.from(new Set(accountNames)),
        });
      }

      eventBus.publish('account:changed', {
        action: 'batch-updated',
        accountNames: Array.from(updatedAccountNames),
      });
    }
  }

  
  async fetchUserAccounts(options?: {
    status?: 'active' | 'ignored';
  }): Promise<AccountInfo[]> {
    try {
      const url = ApiClient.buildUrl('/api/v1/mt-accounts', {
        status: options?.status,
      });
      const response = await ApiClient.makeRequest<{
        accounts: ApiAccountInfo[];
      }>(url, { method: 'GET' }, 'fetch user accounts');

      if (!response) {
        return [];
      }

      
      const accounts = response.accounts || [];

      const transformedAccounts = accounts.map(
        (account): AccountInfo => ({
          accountId: String(
            account.accountId ||
              account.account_id ||
              account.mt_account_id ||
              ''
          ),
          displayName:
            account.displayName ||
            account.display_name ||
            `Account-${account.account_id || account.mt_account_id || 'Unknown'}`,
          brokerName: account.brokerName || account.broker_name,
          firstSeen: account.firstSeen || account.first_seen,
          lastSeen: account.lastSeen || account.last_seen,
          status: account.status,
          ignoredAt: account.ignoredAt || account.ignored_at,
        })
      );

      return transformedAccounts;
    } catch (error) {
      console.error(
        `❌ Failed to fetch MT accounts:`,
        error instanceof Error ? error.message : String(error)
      );
      throw new Error(
        `Failed to fetch MT accounts: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  
  async updateAccountDisplayName(
    accountId: string,
    displayName: string,
    _userId: string
  ): Promise<boolean> {
    try {
      
      const url = ApiClient.buildUrl(
        `/api/v1/mt-accounts/${encodeURIComponent(accountId)}`
      );
      await ApiClient.makeRequest<{ success: boolean; message: string }>(
        url,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            display_name: displayName,
          }),
        },
        'update account display name'
      );

      
      await this.createAccountMapping(accountId, displayName);

      return true;
    } catch (error) {
      console.error('Failed to update account display name:', error);
      throw error;
    }
  }

  
  async unlinkMtAccount(accountId: string): Promise<void> {
    try {
      const url = ApiClient.buildUrl(
        `/api/v1/mt-accounts/${encodeURIComponent(accountId)}/unlink`
      );
      const response = await ApiClient.makeRequest<{
        success?: boolean;
        message?: string;
      }>(url, { method: 'POST' }, 'unlink MT account', 0, {
        propagateErrors: true,
      });

      if (!response) {
        throw new Error('Backend did not confirm MT account unlink');
      }

      ApiClient.invalidateCache('/api/v1/mt-accounts');

      const accountMapping =
        this.plugin.settings.backendIntegration?.accountMapping;
      const mappedDisplayName = accountMapping?.[accountId];
      if (accountMapping && accountId in accountMapping) {
        delete accountMapping[accountId];
        await this.plugin.saveSettings();
      }

      const accountNames = Array.from(
        new Set(
          [accountId, mappedDisplayName].filter(
            (value): value is string =>
              typeof value === 'string' && value.trim().length > 0
          )
        )
      );

      eventBus.publish('account:changed', {
        action: 'deleted',
        accountId,
        accountName: mappedDisplayName ?? accountId,
        accountNames,
      });
    } catch (error) {
      console.error('Failed to unlink MT account:', error);
      throw error;
    }
  }

  async relinkMtAccount(accountId: string, displayName: string): Promise<void> {
    try {
      const url = ApiClient.buildUrl(
        `/api/v1/mt-accounts/${encodeURIComponent(accountId)}/relink`
      );
      const response = await ApiClient.makeRequest<{
        success?: boolean;
        message?: string;
      }>(url, { method: 'POST' }, 'relink MT account', 0, {
        propagateErrors: true,
      });

      if (!response) {
        throw new Error('Backend did not confirm MT account relink');
      }

      ApiClient.invalidateCache('/api/v1/mt-accounts');

      const accountCatalog =
        await this.plugin.accountPageService?.getAccountCatalog();
      const hasLocalAccount = accountCatalog?.some(
        (account) => account.name === displayName
      );

      if (hasLocalAccount) {
        await this.createAccountMapping(accountId, displayName);
      } else {
        const accountMapping =
          this.plugin.settings.backendIntegration?.accountMapping;
        if (accountMapping && accountId in accountMapping) {
          delete accountMapping[accountId];
          await this.plugin.saveSettings();
        }
      }

      eventBus.publish('account:changed', {
        action: 'updated',
        accountId,
        accountName: accountId,
        accountNames: [accountId, displayName],
      });
    } catch (error) {
      console.error('Failed to relink MT account:', error);
      throw error;
    }
  }

  

  async getAccountTrades(
    accountId: string,
    userId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<unknown[]> {
    try {
      
      const url = ApiClient.buildUrl(
        `/api/v1/mt-accounts/${encodeURIComponent(accountId)}/trades`,
        {
          limit,
          offset,
        }
      );

      const response = await ApiClient.makeRequest<{
        trades: unknown[];
        count: number;
        total_count: number;
      }>(url, { method: 'GET' }, 'fetch account trades');

      if (!response) {
        return [];
      }

      return response.trades || [];
    } catch (error) {
      console.error('Failed to fetch account trades:', error);
      throw error;
    }
  }

  
  checkForNewAccounts(accountIds: Set<string>): string[] {
    const newAccounts: string[] = [];

    for (const accountId of accountIds) {
      if (
        !this.settings.accountMapping ||
        !this.settings.accountMapping[accountId]
      ) {
        newAccounts.push(accountId);
      }
    }

    return newAccounts;
  }
}
