import { useCallback, useEffect, useRef, useState } from 'react';

import type JournalitPlugin from '../main';
import type { EntityShortcut, EntityShortcutTarget } from '../settings/types';
import type { AccountCatalogEntry } from '../services/accountPage/types';
import type { Setup } from '../services/setup/types';
import { normalizeAccountLookupKey } from '../services/trade/core/TradeAccountIdentity';
import { normalizeSetupKey } from '../services/setup/setupIdentity';
import { useEventBus } from './useEventBus';

export interface EntityShortcutCatalogItem {
  target: EntityShortcutTarget;
  label: string;
  icon: string;
}

function buildAccountCatalogItems(
  accounts: AccountCatalogEntry[]
): EntityShortcutCatalogItem[] {
  const items: EntityShortcutCatalogItem[] = [];
  for (const account of accounts) {
    if (account.archived) continue;
    items.push({
      target: { kind: 'account' as const, accountName: account.name },
      label: account.name,
      icon: 'user',
    });
  }
  return items;
}

function buildSetupCatalogItems(setups: Setup[]): EntityShortcutCatalogItem[] {
  const items: EntityShortcutCatalogItem[] = [];
  const sortedSetups = [...setups].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name)
  );
  for (const setup of sortedSetups) {
    if (setup.status === 'archived') continue;
    items.push({
      target: { kind: 'setup' as const, setupId: setup.id },
      label: setup.name,
      icon: 'flask-conical',
    });
  }
  return items;
}

interface EntityShortcutCatalogState {
  items: EntityShortcutCatalogItem[];
  loading: boolean;
  loaded: Record<EntityShortcutTarget['kind'], boolean>;
  errors: EntityShortcutCatalogErrors;
}

interface EntityShortcutCatalogRequest {
  account: boolean;
  setup: boolean;
}

export type EntityShortcutCatalogErrors = Record<
  EntityShortcutTarget['kind'],
  string | null
>;

const EMPTY_CATALOG_ERRORS: EntityShortcutCatalogErrors = {
  account: null,
  setup: null,
};

export function buildEntityShortcutCatalogItems(
  accounts: AccountCatalogEntry[],
  setups: Setup[]
): EntityShortcutCatalogItem[] {
  return [
    ...buildAccountCatalogItems(accounts),
    ...buildSetupCatalogItems(setups),
  ];
}

export function resolveEntityShortcutCatalogItem(
  items: EntityShortcutCatalogItem[],
  shortcut: EntityShortcut
): EntityShortcutCatalogItem | null {
  const shortcutTarget = shortcut.target;
  for (const item of items) {
    const itemTarget = item.target;
    if (shortcutTarget.kind !== itemTarget.kind) continue;
    if (
      shortcutTarget.kind === 'account' &&
      itemTarget.kind === 'account' &&
      normalizeAccountLookupKey(shortcutTarget.accountName) ===
        normalizeAccountLookupKey(itemTarget.accountName)
    ) {
      return item;
    }
    if (
      shortcutTarget.kind === 'setup' &&
      itemTarget.kind === 'setup' &&
      normalizeSetupKey(shortcutTarget.setupId) ===
        normalizeSetupKey(itemTarget.setupId)
    ) {
      return item;
    }
  }
  return null;
}

export function useEntityShortcutCatalog(
  plugin: JournalitPlugin,
  request: EntityShortcutCatalogRequest
): EntityShortcutCatalogState & {
  error: string | null;
  resolveShortcut: (
    shortcut: EntityShortcut
  ) => EntityShortcutCatalogItem | null;
} {
  const [state, setState] = useState<EntityShortcutCatalogState>({
    items: [],
    loading: false,
    loaded: { account: false, setup: false },
    errors: EMPTY_CATALOG_ERRORS,
  });
  const requestIdRef = useRef(0);
  const accountRequested = request.account;
  const setupRequested = request.setup;
  const enabled = accountRequested || setupRequested;

  const loadCatalog = useCallback(async () => {
    if (!enabled) return;
    const requestId = ++requestIdRef.current;
    setState((previous) => ({ ...previous, loading: true }));
    const [accountResult, setupResult] = await Promise.allSettled([
      accountRequested
        ? plugin.serviceManager
            .getAccountPageService()
            .then((service) => service.getAccountCatalogOrThrow())
        : Promise.resolve<AccountCatalogEntry[] | null>(null),
      setupRequested
        ? plugin.serviceManager
            .getSetupService()
            .then((service) => service.listSetups())
        : Promise.resolve<Setup[] | null>(null),
    ]);
    if (requestId !== requestIdRef.current) return;

    setState((previous) => {
      const accountItems =
        accountRequested &&
        accountResult.status === 'fulfilled' &&
        accountResult.value !== null
          ? buildAccountCatalogItems(accountResult.value)
          : previous.items.filter((item) => item.target.kind === 'account');
      const setupItems =
        setupRequested &&
        setupResult.status === 'fulfilled' &&
        setupResult.value !== null
          ? buildSetupCatalogItems(setupResult.value)
          : previous.items.filter((item) => item.target.kind === 'setup');
      const errors: EntityShortcutCatalogErrors = {
        account: accountRequested
          ? accountResult.status === 'rejected'
            ? errorMessage(accountResult.reason)
            : null
          : previous.errors.account,
        setup: setupRequested
          ? setupResult.status === 'rejected'
            ? errorMessage(setupResult.reason)
            : null
          : previous.errors.setup,
      };

      return {
        items: [...accountItems, ...setupItems],
        loading: false,
        loaded: {
          account: accountRequested || previous.loaded.account,
          setup: setupRequested || previous.loaded.setup,
        },
        errors,
      };
    });
  }, [accountRequested, enabled, plugin, setupRequested]);

  useEffect(() => {
    if (!enabled) {
      requestIdRef.current += 1;
      setState((previous) => ({ ...previous, loading: false }));
      return;
    }
    void loadCatalog();
  }, [enabled, loadCatalog]);
  useEventBus('account:changed', loadCatalog, accountRequested);
  useEventBus('setup:changed', loadCatalog, setupRequested);

  const resolveShortcut = useCallback(
    (shortcut: EntityShortcut): EntityShortcutCatalogItem | null =>
      resolveEntityShortcutCatalogItem(state.items, shortcut),
    [state.items]
  );

  const errors: EntityShortcutCatalogErrors = {
    account: accountRequested ? state.errors.account : null,
    setup: setupRequested ? state.errors.setup : null,
  };
  const error = [errors.account, errors.setup]
    .filter((message): message is string => message !== null)
    .join('; ');
  const requestedCatalogMissing =
    (accountRequested && !state.loaded.account) ||
    (setupRequested && !state.loaded.setup);

  return {
    ...state,
    loading: enabled && (requestedCatalogMissing || state.loading),
    errors,
    error: error || null,
    resolveShortcut,
  };
}

function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

export function entityShortcutTargetKey(target: EntityShortcutTarget): string {
  return target.kind === 'account'
    ? `account:${normalizeAccountLookupKey(target.accountName)}`
    : `setup:${normalizeSetupKey(target.setupId)}`;
}
