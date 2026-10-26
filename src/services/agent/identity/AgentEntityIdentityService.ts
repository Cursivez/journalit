import type JournalitPlugin from '../../../main';
import { generateUUID } from '../../../utils/uuid';
import { defineOwnEntry } from '../../../utils/defineOwnEntry';
import type { AccountPageService } from '../../accountPage';
import { normalizeAccountLookupKey } from '../../trade/core/TradeAccountIdentity';
import { isAccountAgentId } from './accountIdentityStore';
import type { SetupService } from '../../setup/SetupService';
import type { Setup } from '../../setup/types';
import { normalizeSetupKey } from '../../setup/setupIdentity';
import { normalizeSetupReadError } from '../../setup/setupReadErrors';
import {
  compareSetupIdentityOrder,
  isSetupAgentId,
} from './setupIdentityStore';

export class AgentEntityIdentityService {
  private readonly pendingAccountIds = new Map<
    string,
    Promise<string | null>
  >();

  constructor(
    private readonly plugin: Pick<JournalitPlugin, 'settings' | 'saveSettings'>,
    private readonly accountPageService: Pick<
      AccountPageService,
      'getAccountCatalogOrThrow'
    >,
    private readonly setupService: Pick<
      SetupService,
      'listSetupsForAgentIdentityStrict' | 'ensureAgentEntityIds'
    >
  ) {}

  public async getOrCreateAccountId(
    accountName: string
  ): Promise<string | null> {
    const lookupKey = normalizeAccountLookupKey(accountName);
    const pending = this.pendingAccountIds.get(lookupKey);
    if (pending) {
      return pending;
    }

    const operation = this.getOrCreateAccountIdInternal(lookupKey);
    this.pendingAccountIds.set(lookupKey, operation);
    try {
      return await operation;
    } finally {
      this.pendingAccountIds.delete(lookupKey);
    }
  }

  public async resolveAccountId(agentId: string): Promise<string | null> {
    if (!isAccountAgentId(agentId)) {
      return null;
    }

    const root = this.plugin.settings;
    const account = root.account;
    const identities = account?.agentAccountIds ?? {};
    const matchingEntry = Object.entries(identities).find(
      ([, storedId]) => storedId === agentId
    );
    if (!matchingEntry) {
      return null;
    }

    const [lookupKey] = matchingEntry;
    const catalog = await this.accountPageService.getAccountCatalogOrThrow();
    if (
      this.plugin.settings !== root ||
      root.account !== account ||
      account?.agentAccountIds !== identities ||
      identities[lookupKey] !== agentId
    ) {
      throw new Error(
        'Account identity changed during discovery. Refresh before continuing.'
      );
    }
    return (
      catalog.find(({ name }) => normalizeAccountLookupKey(name) === lookupKey)
        ?.name ?? null
    );
  }

  public async getOrCreateSetupId(
    currentSetupRef: string
  ): Promise<string | null> {
    return (
      (await this.getOrCreateSetupIds([currentSetupRef])).get(
        currentSetupRef
      ) ?? null
    );
  }

  
  public async getOrCreateSetupIds(
    currentSetupRefs: readonly string[]
  ): Promise<ReadonlyMap<string, string | null>> {
    const setups = await this.listSetupsStrict();
    const nameByRef = new Map<string, string>();
    for (const ref of currentSetupRefs) {
      const candidates = this.findSetupRefCandidates(setups, ref);
      if (candidates.length === 1) nameByRef.set(ref, candidates[0].name);
    }
    const result = new Map<string, string | null>();
    if (nameByRef.size === 0) {
      for (const ref of currentSetupRefs) result.set(ref, null);
      return result;
    }
    try {
      const ids = await this.setupService.ensureAgentEntityIds([
        ...new Set(nameByRef.values()),
      ]);
      for (const ref of currentSetupRefs) {
        const name = nameByRef.get(ref);
        if (name === undefined) {
          result.set(ref, null);
          continue;
        }
        const id = ids.get(name);
        if (!id) throw new Error('Setup identity is unavailable');
        result.set(ref, id);
      }
    } catch (error) {
      throw normalizeSetupReadError(error);
    }
    return result;
  }

  public async resolveSetupId(agentId: string): Promise<string | null> {
    return (await this.resolveSetupRecord(agentId))?.name ?? null;
  }

  public async resolveSetupRecord(agentId: string): Promise<Setup | null> {
    if (!isSetupAgentId(agentId)) {
      return null;
    }

    const setups = await this.listSetupsStrict();
    const matching = setups
      .filter((setup) => setup.agentEntityId === agentId)
      .sort(compareSetupIdentityOrder);
    return matching[0] ?? null;
  }

  private async getOrCreateAccountIdInternal(
    lookupKey: string
  ): Promise<string | null> {
    const root = this.plugin.settings;
    const accountSettings = root.account;
    const catalog = await this.accountPageService.getAccountCatalogOrThrow();
    const accountExists = catalog.some(
      ({ name }) => normalizeAccountLookupKey(name) === lookupKey
    );
    if (!accountExists) {
      return null;
    }

    if (this.plugin.settings !== root || root.account !== accountSettings) {
      throw new Error(
        'Account settings changed during identity discovery. Refresh before continuing.'
      );
    }
    if (!accountSettings) {
      throw new Error('Account settings are not initialized');
    }

    const previousIds = accountSettings.agentAccountIds;
    const identities = previousIds ?? {};
    if (Object.prototype.hasOwnProperty.call(identities, lookupKey)) {
      const existingId = identities[lookupKey];
      if (!isAccountAgentId(existingId))
        throw new Error(
          'Account identity is invalid. Repair account settings before continuing.'
        );
      return existingId;
    }

    const id = `account_${generateUUID()}`;
    defineOwnEntry(identities, lookupKey, id);
    accountSettings.agentAccountIds = identities;
    const owns = () =>
      this.plugin.settings === root &&
      root.account === accountSettings &&
      accountSettings.agentAccountIds === identities &&
      Object.prototype.hasOwnProperty.call(identities, lookupKey) === true &&
      identities[lookupKey] === id;
    try {
      await this.plugin.saveSettings();
    } catch (error) {
      if (!owns())
        throw new AggregateError(
          [error],
          'Account identity saving could not be confirmed; settings changed before recovery.'
        );
      delete identities[lookupKey];
      const removeMap =
        previousIds === undefined && Object.keys(identities).length === 0;
      if (removeMap) delete accountSettings.agentAccountIds;
      try {
        await this.plugin.saveSettings();
        if (
          this.plugin.settings !== root ||
          root.account !== accountSettings ||
          accountSettings.agentAccountIds !==
            (removeMap ? undefined : identities) ||
          Object.prototype.hasOwnProperty.call(identities, lookupKey)
        )
          throw new Error('Account identity changed during recovery.');
      } catch (recoveryError) {
        throw new AggregateError(
          [error, recoveryError],
          'Account identity saving could not be confirmed; recovery was incomplete.'
        );
      }
      throw error;
    }
    if (!owns())
      throw new Error(
        'Account identity changed while saving. Refresh before continuing.'
      );
    return id;
  }

  private async listSetupsStrict(): Promise<Setup[]> {
    try {
      return await this.setupService.listSetupsForAgentIdentityStrict();
    } catch (error) {
      throw normalizeSetupReadError(error);
    }
  }

  private findSetupRefCandidates(setups: Setup[], raw: string): Setup[] {
    const trimmed = raw.trim();
    const normalized = normalizeSetupKey(trimmed);
    return setups.filter(
      (setup) =>
        setup.name === trimmed || normalizeSetupKey(setup.name) === normalized
    );
  }
}
