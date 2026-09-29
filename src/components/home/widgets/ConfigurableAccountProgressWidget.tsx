

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../main';
import type { AccountProgressWidgetConfig } from '../../../settings/types';
import { t } from '../../../lang/helpers';
import { eventBus } from '../../../services/events/EventBus';
import { useEventBus } from '../../../hooks/useEventBus';
import { Check, X } from '../../shared/icons/ObsidianIcon';
import {
  ACCOUNT_PROGRESS_MAX_OPTIONS,
  getAccountProgressConfig,
  isAccountSelected,
  selectAccountProgressItems,
  setAccountProgressConfig,
} from '../../../utils/accountProgressWidgetConfig';
import {
  AccountProgressListWidget,
  AccountProgressLoading,
  AccountProgressState,
  showNameIfTruncated,
  type AccountProgressListItem,
  type AccountProgressListWidgetProps,
} from './AccountProgressListWidget';


const SEARCH_THRESHOLD = 8;

type ListProps<TStatus extends string> = Omit<
  AccountProgressListWidgetProps<TStatus>,
  'items' | 'title' | 'onConfigure' | 'configureRef'
>;

interface Props<TStatus extends string> {
  plugin: JournalitPlugin;
  instanceId: string;
  isEditing: boolean;
  title: string;
  
  items: AccountProgressListItem<TStatus>[];
  
  isShown: (accountName: string) => boolean;
  
  isLoading: boolean;
  errorMessage: string | null;
  loadingTitleWidth: number;
  
  automaticHint: string;
  
  emptyMessage: string;
  emptyIcon: React.ReactNode;
  listProps: ListProps<TStatus>;
}


function useAccountProgressConfig(plugin: JournalitPlugin, instanceId: string) {
  const [, rerender] = useReducer((count: number) => count + 1, 0);
  const [isSaving, setIsSaving] = useState(false);

  useEventBus('settings:changed', (payload) => {
    if (payload.section === 'home' || payload.section === 'all') rerender();
  });

  const save = useCallback(
    async (next: AccountProgressWidgetConfig): Promise<boolean> => {
      const home = plugin.settings.home;
      if (!home) return false;
      const previous = getAccountProgressConfig(home, instanceId);
      setIsSaving(true);
      setAccountProgressConfig(home, instanceId, next);
      try {
        await plugin.saveSettings();
        eventBus.publish('settings:changed', {
          component: 'home',
          section: 'home',
          source: 'account-progress-config',
        });
        return true;
      } catch (error) {
        setAccountProgressConfig(home, instanceId, previous);
        new Notice(t('error.settings.save-failed'), 5000);
        console.error(
          '[AccountProgressWidget] Failed to save account selection:',
          error
        );
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [instanceId, plugin]
  );

  return {
    config: getAccountProgressConfig(plugin.settings.home, instanceId),
    isSaving,
    save,
  };
}

interface ConfigPanelProps {
  automaticHint: string;
  accounts: readonly { accountName: string; name: string }[];
  initial: AccountProgressWidgetConfig;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (config: AccountProgressWidgetConfig) => void;
}

const AccountProgressConfigPanel: React.FC<ConfigPanelProps> = ({
  automaticHint,
  accounts,
  initial,
  isSaving,
  onCancel,
  onSave,
}) => {
  const [draft, setDraft] = useState(initial);
  const [query, setQuery] = useState('');
  const activeModeRef = useRef<HTMLButtonElement>(null);
  
  const searchable = accounts.length > SEARCH_THRESHOLD;
  
  
  const needle = searchable ? query.trim().toLowerCase() : '';
  const listed = needle
    ? accounts.filter((account) => account.name.toLowerCase().includes(needle))
    : accounts;
  const setListed = (select: boolean) =>
    setDraft((current) => {
      const rest = current.accounts.filter(
        (name) =>
          !listed.some((account) =>
            isAccountSelected([name], account.accountName)
          )
      );
      return {
        ...current,
        accounts: select
          ? [...rest, ...listed.map((account) => account.accountName)]
          : rest,
      };
    });

  useLayoutEffect(() => {
    activeModeRef.current?.focus();
  }, []);

  const toggleAccount = (accountName: string) =>
    setDraft((current) => ({
      ...current,
      accounts: isAccountSelected(current.accounts, accountName)
        ? current.accounts.filter(
            (name) => !isAccountSelected([name], accountName)
          )
        : [...current.accounts, accountName],
    }));

  const modeButton = (mode: AccountProgressWidgetConfig['mode']) => (
    <button
      type="button"
      ref={draft.mode === mode ? activeModeRef : undefined}
      className={`journalit-home-widget__option${draft.mode === mode ? ' journalit-home-widget__option--active' : ''}`}
      aria-pressed={draft.mode === mode}
      disabled={isSaving}
      onClick={() => setDraft((current) => ({ ...current, mode }))}
    >
      {t(
        mode === 'automatic'
          ? 'home.widget.account-progress.mode.automatic'
          : 'home.widget.account-progress.mode.selected'
      )}
    </button>
  );

  return (
    <div className="journalit-home-account-progress journalit-home-account-progress--configuring">
      
      <div className="journalit-home-streak__config-header journalit-home-account-progress__config-header">
        <div
          className="journalit-home-widget__option-list"
          role="group"
          aria-label={t('home.widget.account-progress.config-title')}
        >
          {modeButton('automatic')}
          {modeButton('selected')}
        </div>
        <div className="journalit-home-streak__config-actions">
          <button
            type="button"
            className="clickable-icon journalit-home-streak__config-save"
            onClick={() => onSave(draft)}
            aria-label={t('button.save')}
            disabled={isSaving}
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            className="clickable-icon journalit-home-streak__config-cancel"
            onClick={onCancel}
            aria-label={t('button.cancel')}
            disabled={isSaving}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {draft.mode === 'automatic' ? (
        <div className="journalit-home-account-progress__config-section">
          <span className="journalit-home-account-progress__config-hint">
            {automaticHint}
          </span>
          <span className="journalit-home-account-progress__config-label">
            {t('home.widget.account-progress.max-label')}
          </span>
          <div className="journalit-home-widget__option-list">
            {ACCOUNT_PROGRESS_MAX_OPTIONS.map((count) => (
              <button
                key={count ?? 'all'}
                type="button"
                className={`journalit-home-widget__option${draft.maxAccounts === count ? ' journalit-home-widget__option--active' : ''}`}
                aria-pressed={draft.maxAccounts === count}
                disabled={isSaving}
                onClick={() =>
                  setDraft((current) => ({ ...current, maxAccounts: count }))
                }
              >
                {count === null
                  ? t('home.widget.account-progress.max-all')
                  : String(count)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="journalit-home-account-progress__config-section journalit-home-account-progress__config-section--accounts">
          {accounts.length === 0 ? (
            <span className="journalit-home-account-progress__config-hint">
              {t('home.widget.account-progress.no-eligible')}
            </span>
          ) : (
            <div className="journalit-home-account-progress__account-toolbar">
              {searchable ? (
                <input
                  type="search"
                  className="journalit-home-account-progress__account-search"
                  value={query}
                  placeholder={t('home.widget.account-progress.search')}
                  aria-label={t('home.widget.account-progress.search')}
                  onChange={(event) => setQuery(event.target.value)}
                />
              ) : (
                <span className="journalit-home-account-progress__config-hint">
                  {t('home.widget.account-progress.select-hint')}
                </span>
              )}
              <button
                type="button"
                className="journalit-home-widget__option"
                disabled={isSaving || listed.length === 0}
                aria-label={t('home.widget.account-progress.select-all-aria')}
                onClick={() => setListed(true)}
              >
                {t('home.widget.account-progress.select-all')}
              </button>
              <button
                type="button"
                className="journalit-home-widget__option"
                disabled={isSaving || listed.length === 0}
                aria-label={t('home.widget.account-progress.select-none-aria')}
                onClick={() => setListed(false)}
              >
                {t('home.widget.account-progress.select-none')}
              </button>
            </div>
          )}
          <div
            className="journalit-home-account-progress__account-list"
            role="group"
            aria-label={t('home.widget.account-progress.mode.selected')}
          >
            {listed.map((account) => {
              const selected = isAccountSelected(
                draft.accounts,
                account.accountName
              );
              return (
                <button
                  key={account.accountName}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  className={`journalit-native-button journalit-native-button--unstyled journalit-home-account-progress__account-option${selected ? ' is-selected' : ''}`}
                  disabled={isSaving}
                  onClick={() => toggleAccount(account.accountName)}
                >
                  <span
                    className="journalit-home-account-progress__account-check"
                    aria-hidden="true"
                  >
                    {selected && <Check size={11} />}
                  </span>
                  <span
                    className="journalit-home-account-progress__account-name"
                    onMouseEnter={showNameIfTruncated}
                  >
                    {account.name}
                  </span>
                </button>
              );
            })}
            {searchable && listed.length === 0 && (
              <span className="journalit-home-account-progress__config-hint">
                {t('home.widget.account-progress.no-match')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


function emptyStateMessage(
  config: AccountProgressWidgetConfig,
  emptyMessage: string
): string {
  if (config.mode !== 'selected') return emptyMessage;
  if (config.accounts.length === 0) {
    return t('home.widget.account-progress.none-selected');
  }
  return t('home.widget.account-progress.none-available');
}

export function ConfigurableAccountProgressWidget<TStatus extends string>({
  plugin,
  instanceId,
  isEditing,
  isShown,
  title,
  items,
  isLoading,
  errorMessage,
  loadingTitleWidth,
  automaticHint,
  emptyMessage,
  emptyIcon,
  listProps,
}: Props<TStatus>): React.ReactElement {
  const { config, isSaving, save } = useAccountProgressConfig(
    plugin,
    instanceId
  );
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  
  
  
  
  const configKey = JSON.stringify(config);
  const [panelKey, setPanelKey] = useState(configKey);
  if (!isSaving && panelKey !== configKey) setPanelKey(configKey);
  const configureRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);
  
  const openConfig = isEditing ? undefined : () => setIsConfiguring(true);
  const closeConfig = () => {
    restoreFocusRef.current = true;
    setIsConfiguring(false);
  };

  
  
  useEffect(() => {
    if (isConfiguring || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    configureRef.current?.focus();
  }, [isConfiguring]);

  if (isConfiguring) {
    return (
      <AccountProgressConfigPanel
        key={panelKey}
        automaticHint={automaticHint}
        accounts={[...items].sort((a, b) =>
          
          a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base',
          })
        )}
        initial={config}
        isSaving={isSaving}
        onCancel={closeConfig}
        onSave={(next) => {
          void save(next).then((saved) => {
            if (saved) closeConfig();
          });
        }}
      />
    );
  }

  if (isLoading) {
    return <AccountProgressLoading titleWidth={loadingTitleWidth} />;
  }

  if (errorMessage) {
    return <AccountProgressState title={title} message={errorMessage} />;
  }

  const shown = selectAccountProgressItems(
    items.filter((item) => isShown(item.accountName)),
    config
  );
  if (shown.length === 0) {
    return (
      <AccountProgressState
        title={title}
        message={emptyStateMessage(config, emptyMessage)}
        icon={emptyIcon}
        onConfigure={openConfig}
        configureRef={configureRef}
      />
    );
  }

  return (
    <AccountProgressListWidget
      {...listProps}
      title={title}
      items={shown}
      onConfigure={openConfig}
      configureRef={configureRef}
    />
  );
}
