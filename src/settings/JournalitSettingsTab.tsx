

import * as Obsidian from 'obsidian';
import { App, PluginSettingTab, requireApiVersion } from 'obsidian';
import type { SettingControl, SettingDefinitionItem } from 'obsidian';
import React, { useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { eventBus } from '../services/events';
import { t } from '../lang/helpers';
import JournalitPlugin from '../main';
import { getBaseCurrencyOptions } from '../utils/currencyConfig';
import {
  DEFAULT_SETTINGS,
  SETTINGS_TAB_IDS,
  type JournalitSettings,
  type SettingsTabId,
} from './types';


import { GeneralTab } from './components/general/GeneralTab';
import { JournalSettingsTab } from './components/journal/JournalSettingsTab';
import { SyncSettingsTab } from './components/sync/SyncSettingsTab';

interface NativeSettingDefinitionPage {
  type: 'page';
  name: string;
  desc: string;
  aliases?: string[];
  items?: NativeSettingDefinitionItem[];
  page?: () => NativeSettingPage;
}

interface NativeSettingDefinitionGroup {
  type: 'group';
  heading: string;
  items: NativeSettingGroupItem[];
}

interface NativeSettingDefinitionRender {
  name: string;
  desc?: string;
  aliases?: string[];
  searchable?: boolean;
  render: (setting: NativeSettingRenderTarget) => (() => void) | void;
}

interface NativeSettingDefinitionControl {
  name: string;
  desc?: string;
  aliases?: string[];
  visible?: boolean | (() => boolean);
  control: NativeSettingControl;
}

type NativeSettingControl = SettingControl<string>;

type NativeSettingGroupItem =
  | NativeSettingDefinitionPage
  | NativeSettingDefinitionRender
  | NativeSettingDefinitionControl;

type NativeSettingDefinitionItem =
  | NativeSettingDefinitionPage
  | NativeSettingDefinitionGroup
  | NativeSettingGroupItem;

interface NativeSettingRenderTarget {
  settingEl: HTMLElement;
  controlEl: HTMLElement;
}

interface NativeSettingPage {
  containerEl?: HTMLElement;
  display(): void;
  hide?(): void;
}

type NativeSettingPageConstructor = new () => NativeSettingPage;

interface SettingsPageDefinition {
  tabId: SettingsTabId;
  label: string;
  desc: string;
  aliases: string[];
  createItems?: (tab: JournalitSettingsTab) => NativeSettingDefinitionItem[];
}

export class JournalitSettingsTab extends PluginSettingTab {
  plugin: JournalitPlugin;
  private root: Root | null = null;
  private initialTab: SettingsTabId = SETTINGS_TAB_IDS.GENERAL;

  constructor(app: App, plugin: JournalitPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  setInitialTab(tabId: SettingsTabId): void {
    this.initialTab = tabId;
  }

  renderInitialTab(): void {
    const tabToDisplay = this.initialTab;
    this.initialTab = SETTINGS_TAB_IDS.GENERAL;
    this.renderReactSettings(this.containerEl, tabToDisplay, true);
  }

  getSettingDefinitions(): SettingDefinitionItem<string>[] {
    if (!requireApiVersion('1.13.0')) {
      return [];
    }

    return getSettingsPageDefinitions().map<SettingDefinitionItem<string>>(
      (definition) => ({
        type: 'page',
        name: definition.label,
        desc: definition.desc,
        aliases: definition.aliases,
        ...(definition.createItems
          ? { items: definition.createItems(this) }
          : {
              page: () =>
                createNativeReactSettingsPage({
                  title: definition.label,
                  display: (containerEl) => {
                    this.renderReactSettings(
                      containerEl,
                      definition.tabId,
                      false
                    );
                  },
                  hide: (containerEl) => {
                    this.unmountReactSettings(containerEl);
                  },
                }),
            }),
      })
    );
  }

  getControlValue(key: string): unknown {
    return getSettingsPath(this.plugin.settings, key);
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    const didSet = applyNativeSettingsControlValue(
      this.plugin.settings,
      key,
      value
    );

    if (!didSet) {
      return;
    }

    await this.plugin.saveSettings();
    await this.handleNativeControlSideEffects(key);
  }

  refreshNativeSettingsDomState(): void {
    const refreshDomState = Reflect.get(this, 'refreshDomState');
    if (typeof refreshDomState === 'function') {
      Reflect.apply(refreshDomState, this, []);
    }
  }

  updateNativeSettingsDefinitions(): void {
    const update = Reflect.get(this, 'update');
    if (typeof update === 'function') {
      Reflect.apply(update, this, []);
    }
  }

  private async handleNativeControlSideEffects(key: string): Promise<void> {
    if (key === 'general.currency') {
      window.dispatchEvent(
        new CustomEvent('journalit-currency-changed', {
          detail: { currency: this.plugin.settings.general?.currency },
        })
      );
      eventBus.publish('settings:changed', {
        section: 'general',
        source: 'currency',
      });
      return;
    }

    if (key === 'general.displayName') {
      window.dispatchEvent(
        new CustomEvent('journalit:display-name-changed', {
          detail: { displayName: this.plugin.settings.general?.displayName },
        })
      );
      return;
    }

    if (key === 'home.filterRecentItemsToJournalit') {
      const recentItems = this.plugin.uiStateManager.getState().recentItems;
      eventBus.publish('recent-items:changed', {
        recentItems: recentItems.map((item) => ({
          path: item.path || item.viewType || '',
          timestamp: new Date(item.openedAt).getTime(),
          type: item.type,
        })),
      });
      return;
    }

    if (key.startsWith('display.')) {
      eventBus.publish('settings:changed', {
        section: 'display',
        source: key.slice('display.'.length),
      });
      return;
    }

    if (key.startsWith('trade.')) {
      eventBus.publish('settings:changed', {
        section: 'trade',
        source: key.slice('trade.'.length),
      });

      if (
        key.startsWith('trade.breakEven') ||
        key === 'trade.defaultRiskAmount'
      ) {
        await this.plugin.tradeService?.clearCache();
        await this.plugin.accountPageService?.refreshAllAccountData();
      }
      return;
    }

    if (key.startsWith('backendIntegration.')) {
      eventBus.publish('settings:changed', {
        section: 'backendIntegration',
        source: key.slice('backendIntegration.'.length),
      });
      return;
    }

    if (
      key.startsWith('reviews.') ||
      key.startsWith('drc.') ||
      key.startsWith('weekly.') ||
      key.startsWith('monthly.') ||
      key.startsWith('quarterly.') ||
      key.startsWith('yearly.') ||
      key.startsWith('reviewV2.')
    ) {
      eventBus.publish('settings:changed', {
        section: 'reviews',
        source: key,
      });
    }
  }

  display(): void {
    this.renderInitialTab();
  }

  renderReactSettings(
    containerEl: HTMLElement,
    tabToDisplay: SettingsTabId,
    showTabs: boolean
  ): void {
    this.unmountReactSettings(containerEl);
    containerEl.empty();
    containerEl.addClass('journalit-settings');

    const wrapperEl = containerEl.createDiv({
      cls: 'journalit-settings-wrapper',
    });

    const root = createRoot(wrapperEl);
    settingsRoots.set(containerEl, root);

    if (containerEl === this.containerEl) {
      this.root = root;
    }

    root.render(
      <React.StrictMode>
        <SettingsTabContent
          plugin={this.plugin}
          initialTab={tabToDisplay}
          showTabs={showTabs}
        />
      </React.StrictMode>
    );
  }

  unmountReactSettings(containerEl: HTMLElement): void {
    const root = settingsRoots.get(containerEl);
    if (root) {
      root.unmount();
      settingsRoots.delete(containerEl);
    }

    if (containerEl === this.containerEl) {
      this.root = null;
    }

    containerEl.removeClass('journalit-settings');
  }

  
  hide(): void {
    this.unmountReactSettings(this.containerEl);
    this.containerEl.empty();
  }
}


interface SettingsTabContentProps {
  plugin: JournalitPlugin;
  initialTab?: SettingsTabId;
  showTabs?: boolean;
}


const SettingsTabContent: React.FC<SettingsTabContentProps> = React.memo(
  ({
    plugin,
    initialTab = SETTINGS_TAB_IDS.GENERAL,
    showTabs = true,
  }: SettingsTabContentProps) => {
    const [tabState, setTabState] = useState(() => ({
      initialTab,
      activeTab: initialTab,
    }));
    
    
    const requestedTab =
      tabState.initialTab === initialTab ? tabState.activeTab : initialTab;
    const activeTab = normalizeSettingsTabId(requestedTab);

    
    const handleTabChange = (newTab: SettingsTabId) => {
      setTabState({ initialTab, activeTab: newTab });
    };

    useEffect(() => {
      const handleOpenSettingsTab = (event: Event) => {
        if (!(event instanceof CustomEvent) || !isRecord(event.detail)) return;
        const tabId = event.detail.tabId;
        if (typeof tabId !== 'string') return;
        if (!isSettingsTabId(tabId)) return;
        setTabState({
          initialTab: tabId,
          activeTab: tabId,
        });
      };

      window.addEventListener(
        'journalit:open-settings-tab',
        handleOpenSettingsTab
      );
      return () => {
        window.removeEventListener(
          'journalit:open-settings-tab',
          handleOpenSettingsTab
        );
      };
    }, []);

    
    const tabs = [
      { id: SETTINGS_TAB_IDS.GENERAL, label: t('settings.tab.general') },
      { id: SETTINGS_TAB_IDS.TRADING, label: t('settings.tab.trading') },
      {
        id: SETTINGS_TAB_IDS.JOURNAL,
        label: t('settings.tab.journal-setup'),
      },
      { id: SETTINGS_TAB_IDS.SYNC, label: t('settings.tab.sync') },
      { id: SETTINGS_TAB_IDS.ADVANCED, label: t('form.tab.advanced') },
    ];

    return (
      <div className="settings-tab-container">
        {showTabs && (
          <nav className="settings-tab-nav journalit-settings-main-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`settings-tab-button ${activeTab === tab.id ? 'settings-tab-button--active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        <div
          className="settings-tab-content journalit-tab-content"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === SETTINGS_TAB_IDS.GENERAL && (
            <GeneralTab plugin={plugin} scope="general" />
          )}
          {activeTab === SETTINGS_TAB_IDS.TRADING && (
            <GeneralTab plugin={plugin} scope="trading" />
          )}
          {activeTab === SETTINGS_TAB_IDS.JOURNAL && (
            <JournalSettingsTab
              plugin={plugin}
              initialSection={
                requestedTab === SETTINGS_TAB_IDS.SESSION_MODE
                  ? 'sessionMode'
                  : requestedTab === SETTINGS_TAB_IDS.CUSTOMIZATION
                    ? 'fields'
                    : 'reviews'
              }
            />
          )}
          {activeTab === SETTINGS_TAB_IDS.SYNC && (
            <SyncSettingsTab
              plugin={plugin}
              initialSection={
                requestedTab === SETTINGS_TAB_IDS.ACCOUNTS
                  ? 'account'
                  : requestedTab === SETTINGS_TAB_IDS.TRADE_IMPORT_SYNC
                    ? 'tradeImport'
                    : 'metatrader'
              }
            />
          )}
          {activeTab === SETTINGS_TAB_IDS.ADVANCED && (
            <GeneralTab plugin={plugin} scope="advanced" />
          )}
        </div>
      </div>
    );
  }
);

SettingsTabContent.displayName = 'SettingsTabContent';

const settingsRoots = new WeakMap<HTMLElement, Root>();

function isSettingsTabId(tabId: string): tabId is SettingsTabId {
  return Object.values(SETTINGS_TAB_IDS).some((value) => value === tabId);
}

function normalizeSettingsTabId(tabId: SettingsTabId): SettingsTabId {
  if (
    tabId === SETTINGS_TAB_IDS.REVIEWS ||
    tabId === SETTINGS_TAB_IDS.CUSTOMIZATION ||
    tabId === SETTINGS_TAB_IDS.SESSION_MODE
  ) {
    return SETTINGS_TAB_IDS.JOURNAL;
  }

  if (
    tabId === SETTINGS_TAB_IDS.TRADE_SYNC ||
    tabId === SETTINGS_TAB_IDS.TRADE_IMPORT_SYNC ||
    tabId === SETTINGS_TAB_IDS.ACCOUNTS
  ) {
    return SETTINGS_TAB_IDS.SYNC;
  }

  return tabId;
}

function getSettingsPageDefinitions(): SettingsPageDefinition[] {
  return [
    {
      tabId: SETTINGS_TAB_IDS.GENERAL,
      label: t('settings.tab.general'),
      desc: 'Currency, display name, home startup, recent items, and navigation preferences.',
      createItems: createGeneralNativeSettingItems,
      aliases: [
        'currency',
        'display name',
        'home view',
        'recent items',
        'navigation sidebar',
        'privacy mode',
      ],
    },
    {
      tabId: SETTINGS_TAB_IDS.TRADING,
      label: t('settings.tab.trading'),
      desc: 'Trade defaults, date handling, risk, break-even logic, and analytics display preferences.',
      createItems: createTradingNativeSettingItems,
      aliases: [
        'date format',
        'risk amount',
        'R-multiples',
        'break-even',
        'MAE',
        'MFE',
        'copy trading PnL',
        'trading day cutoff',
      ],
    },
    {
      tabId: SETTINGS_TAB_IDS.JOURNAL,
      label: t('settings.tab.journal-setup'),
      desc: 'Review templates, automation, custom fields, form layout, symbols, setups, mistakes, tags, and events.',
      createItems: createJournalNativeSettingItems,
      aliases: [
        'daily review',
        'weekly review',
        'review templates',
        'recurring goals',
        'checklist',
        'custom fields',
        'trade form layout',
        'symbols',
        'setups',
        'mistakes',
        'tags',
        'events',
      ],
    },
    {
      tabId: SETTINGS_TAB_IDS.SYNC,
      label: t('settings.tab.sync'),
      desc: 'Journalit account, subscription, MetaTrader sync, trade import, account linking, and sync notifications.',
      createItems: createSyncNativeSettingItems,
      aliases: [
        'account',
        'subscription',
        'billing',
        'backend',
        'sync',
        'MetaTrader',
        'FTP',
        'credentials',
        'account linking',
        'import trades',
        'diagnostics',
        'notifications',
      ],
    },
    {
      tabId: SETTINGS_TAB_IDS.ADVANCED,
      label: t('form.tab.advanced'),
      desc: 'Journal folder, image path maintenance, settings backup, import, export, and reset.',
      createItems: createAdvancedNativeSettingItems,
      aliases: [
        'journal folder',
        'image paths',
        'backup',
        'import settings',
        'export settings',
        'reset settings',
      ],
    },
  ];
}

function createGeneralNativeSettingItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  void tab;
  const currencyOptions = Object.fromEntries(
    getBaseCurrencyOptions().map((option) => [option.value, option.label])
  );

  return [
    {
      type: 'group',
      heading: t('settings.general.display-privacy-section'),
      items: [
        dropdownSetting(
          t('settings.general.currency'),
          t('settings.general.currency-desc'),
          'general.currency',
          currencyOptions,
          'USD'
        ),
        textSetting(
          t('settings.general.display-name'),
          t('settings.general.display-name-desc'),
          'general.displayName',
          t('settings.general.display-name-placeholder')
        ),
      ],
    },
    {
      type: 'group',
      heading: t('settings.general.home-view-settings'),
      items: [
        dropdownSetting(
          t('settings.general.home-auto-open'),
          t('settings.general.home-auto-open-desc'),
          'general.homeStartupBehavior',
          {
            always: t('settings.general.home-auto-open-always'),
            ifNone: t('settings.general.home-auto-open-ifnone'),
            never: t('settings.general.home-auto-open-never'),
          },
          'always'
        ),
        toggleSetting(
          t('settings.general.filter-recent'),
          t('settings.general.filter-recent-desc'),
          'home.filterRecentItemsToJournalit',
          false
        ),
      ],
    },
    {
      type: 'group',
      heading: t('settings.general.navigation-sidebar'),
      items: [
        dropdownSetting(
          t('navigation.setting.tab-behavior'),
          t('navigation.setting.tab-behavior.desc'),
          'navigation.tabBehavior',
          {
            newTab: t('navigation.setting.tab-behavior.new-tab'),
            replaceActiveTab: t('navigation.setting.tab-behavior.replace'),
          },
          'replaceActiveTab'
        ),
      ],
    },
    {
      type: 'group',
      heading: t('settings.general.data-management'),
      items: [
        toggleSetting(
          t('settings.general.privacy-mode'),
          t('settings.general.privacy-mode-desc'),
          'display.privacyMode',
          false
        ),
      ],
    },
  ];
}

function createTradingNativeSettingItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  return [
    {
      type: 'group',
      heading: t('settings.general.trade-settings'),
      items: [
        toggleSetting(
          t('settings.general.auto-open-trades'),
          t('settings.general.auto-open-trades-desc'),
          'trade.autoOpenCreatedTrades',
          false
        ),
        dropdownSetting(
          t('settings.general.date-format'),
          t('settings.general.date-format-desc'),
          'trade.dateFormat',
          { DDMMYY: 'DDMMYY', MMDDYY: 'MMDDYY', YYMMDD: 'YYMMDD' },
          'DDMMYY'
        ),
        toggleSetting(
          t('settings.general.use-24-hour-time'),
          t('settings.general.use-24-hour-time-desc'),
          'trade.use24HourTime',
          false
        ),
        toggleSetting(
          t('settings.general.skip-weekends'),
          t('settings.general.skip-weekends-desc'),
          'trade.skipWeekends',
          true
        ),
        dropdownSetting(
          t('settings.general.week-start'),
          t('settings.general.week-start-desc'),
          'trade.weekStartDay',
          {
            sunday: t('common.day.sunday'),
            monday: t('common.day.monday'),
            tuesday: t('common.day.tuesday'),
            wednesday: t('common.day.wednesday'),
            thursday: t('common.day.thursday'),
            friday: t('common.day.friday'),
            saturday: t('common.day.saturday'),
          },
          'monday'
        ),
        dropdownSetting(
          t('settings.general.analytics-date-basis'),
          t('settings.general.analytics-date-basis-desc'),
          'trade.analyticsDateBasis',
          {
            entry: t('settings.general.analytics-date-basis-entry'),
            exit: t('settings.general.analytics-date-basis-exit'),
          },
          'entry'
        ),
        toggleSetting(
          t('settings.general.dollar-value-input'),
          t('settings.general.dollar-value-input-desc'),
          'trade.useDollarValueInput',
          false
        ),
        textSetting(
          t('settings.general.cutoff-time'),
          t('settings.general.cutoff-time-desc'),
          'trade.tradingDayCutoffTime',
          '23:59',
          validateTime
        ),
      ],
    },
    {
      type: 'group',
      heading: 'Risk and display',
      items: [
        numberSetting(
          t('settings.general.default-risk'),
          t('settings.general.default-risk-desc'),
          'trade.defaultRiskAmount',
          0,
          { min: 0, step: 0.01 }
        ),
        toggleSetting(
          t('settings.general.display-r-multiples'),
          t('settings.general.display-r-multiples-desc'),
          'trade.displayRMultiples',
          false
        ),
        dropdownSetting(
          t('settings.general.mae-mfe-input-mode'),
          t('settings.general.mae-mfe-input-mode-desc'),
          'trade.maeMfeInputMode',
          {
            price: t('settings.general.mae-mfe-input-mode-price'),
            dollar: t('settings.general.mae-mfe-input-mode-dollar'),
          },
          'dollar'
        ),
      ],
    },
    createReactPageDefinition(
      tab,
      SETTINGS_TAB_IDS.TRADING,
      t('settings.general.trade-settings'),
      'Open the full Journalit trade settings UI for break-even thresholds, copy-account analytics, and advanced trade display preferences.',
      [
        'break-even',
        'break-even range',
        'break-even percent',
        'copy accounts',
        'copy trading analytics',
        'advanced trade settings',
      ]
    ),
  ];
}

function createJournalNativeSettingItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  return [
    {
      type: 'group',
      heading: t('settings.reviews.auto-create'),
      items: [
        toggleSetting(
          t('settings.reviews.global-auto-create'),
          t('settings.reviews.global-auto-create-desc'),
          'reviews.globalAutoCreate',
          true
        ),
        toggleSetting(
          t('settings.reviews.auto-create-drc-nav'),
          t('settings.reviews.auto-create-drc-nav-desc'),
          'drc.autoCreateDRCOnNavigation',
          true
        ),
        toggleSetting(
          t('settings.reviews.auto-create-weekly-nav'),
          t('settings.reviews.auto-create-weekly-nav-desc'),
          'weekly.autoCreateWeeklyReviewOnNavigation',
          true
        ),
        toggleSetting(
          t('settings.reviews.auto-create-monthly-nav'),
          t('settings.reviews.auto-create-monthly-nav-desc'),
          'monthly.autoCreateMonthlyReviewOnNavigation',
          true
        ),
        toggleSetting(
          t('settings.reviews.auto-create-quarterly-nav'),
          t('settings.reviews.auto-create-quarterly-nav-desc'),
          'quarterly.autoCreateQuarterlyReviewOnNavigation',
          true
        ),
        toggleSetting(
          t('settings.reviews.auto-create-yearly-nav'),
          t('settings.reviews.auto-create-yearly-nav-desc'),
          'yearly.autoCreateYearlyReviewOnNavigation',
          true
        ),
      ],
    },
    {
      type: 'group',
      heading: t('settings.reviews.scalper-defaults'),
      items: [
        dropdownSetting(
          t('settings.reviews.scalper-default-count-mode'),
          t('settings.reviews.scalper-default-count-mode-desc'),
          'reviewV2.scalperDefaults.countMode',
          {
            'per-trade': t(
              'templateEditor.widget.demon-tracker.count-mode.per-trade'
            ),
            'per-trading-day': t(
              'templateEditor.widget.demon-tracker.count-mode.per-trading-day'
            ),
          },
          'per-trade'
        ),
        dropdownSetting(
          t('settings.reviews.scalper-default-source-mode'),
          t('settings.reviews.scalper-default-source-mode-desc'),
          'reviewV2.scalperDefaults.sourceMode',
          {
            trades: t('templateEditor.widget.demon-tracker.source-mode.trades'),
            session: t(
              'templateEditor.widget.demon-tracker.source-mode.session'
            ),
            combined: t(
              'templateEditor.widget.demon-tracker.source-mode.combined'
            ),
          },
          'trades'
        ),
        toggleSetting(
          t('settings.reviews.scalper-auto-apply-session'),
          t('settings.reviews.scalper-auto-apply-session-desc'),
          'reviewV2.scalperDefaults.autoApplySessionMistakesToTrades',
          false
        ),
      ],
    },
    createReactPageDefinition(
      tab,
      SETTINGS_TAB_IDS.REVIEWS,
      'Review templates, goals, and checklists',
      'Open the full Journalit review settings UI for templates, recurring goals, and checklist management.',
      ['review templates', 'recurring goals', 'checklist', 'template builder']
    ),
    createReactPageDefinition(
      tab,
      SETTINGS_TAB_IDS.CUSTOMIZATION,
      t('settings.tab.customization'),
      'Open custom fields, form layout, symbols, mappings, setups, mistakes, tags, and events.',
      [
        'custom fields',
        'trade form layout',
        'symbols',
        'symbol mappings',
        'setups',
        'mistakes',
        'tags',
        'events',
      ]
    ),
    createReactPageDefinition(
      tab,
      SETTINGS_TAB_IDS.SESSION_MODE,
      t('settings.session-mode.title'),
      'Open Session Mode settings for trading windows, phase layout, Trade Gate workflows, and session log tags.',
      [
        'session mode',
        'trading sessions',
        'phase layout',
        'trade gate',
        'session log tags',
      ]
    ),
  ];
}

function createSyncNativeSettingItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  return [
    {
      type: 'group',
      heading: t('settings.general.notification-settings'),
      items: [
        toggleSetting(
          t('settings.general.sync-notifications'),
          t('settings.general.sync-notifications-desc'),
          'backendIntegration.showSyncNotifications',
          true
        ),
        toggleSetting(
          t('settings.general.new-trade-notifications'),
          t('settings.general.new-trade-notifications-desc'),
          'backendIntegration.showNewTradeNotifications',
          true
        ),
        toggleSetting(
          t('settings.general.update-notifications'),
          t('settings.general.update-notifications-desc'),
          'backendIntegration.showUpdateNotifications',
          true
        ),
      ],
    },
    createReactPageDefinition(
      tab,
      SETTINGS_TAB_IDS.ACCOUNTS,
      t('settings.tab.accounts'),
      'Open Journalit account authentication, subscription, sign in, and sign out.',
      ['account', 'subscription', 'billing', 'login', 'logout', 'sign in']
    ),
    createReactPageDefinition(
      tab,
      SETTINGS_TAB_IDS.TRADE_SYNC,
      t('trade-sync.source.metatrader'),
      'Open MetaTrader sync setup, FTP credentials, account management, and diagnostics.',
      ['MetaTrader', 'FTP', 'credentials', 'account management', 'diagnostics']
    ),
    createReactPageDefinition(
      tab,
      SETTINGS_TAB_IDS.TRADE_IMPORT_SYNC,
      t('trade-sync.source.trade-import'),
      'Open Trade Import sync inventory, account mapping, and restore tools.',
      [
        'trade import',
        'import trades',
        'inventory',
        'restore',
        'account mapping',
      ]
    ),
  ];
}

function createAdvancedNativeSettingItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  return [
    createReactPageDefinition(
      tab,
      SETTINGS_TAB_IDS.ADVANCED,
      t('form.tab.advanced'),
      'Open folder location, image path maintenance, settings import, export, and reset actions.',
      [
        'journal folder',
        'image paths',
        'backup',
        'import settings',
        'export settings',
        'reset settings',
      ]
    ),
  ];
}

function createReactPageDefinition(
  tab: JournalitSettingsTab,
  tabId: SettingsTabId,
  name: string,
  desc: string,
  aliases: string[]
): NativeSettingDefinitionPage {
  return {
    type: 'page',
    name,
    desc,
    aliases,
    page: () =>
      createNativeReactSettingsPage({
        title: name,
        display: (containerEl) => {
          tab.renderReactSettings(containerEl, tabId, false);
        },
        hide: (containerEl) => {
          tab.unmountReactSettings(containerEl);
        },
      }),
  };
}

function toggleSetting(
  name: string,
  desc: string,
  key: string,
  defaultValue: boolean,
  disabled?: () => boolean
): NativeSettingDefinitionControl {
  return {
    name,
    desc,
    control: { type: 'toggle', key, defaultValue, disabled },
  };
}

function textSetting(
  name: string,
  desc: string,
  key: string,
  placeholder: string,
  validate?: (value: string) => string | void
): NativeSettingDefinitionControl {
  return {
    name,
    desc,
    aliases: [placeholder],
    control: { type: 'text', key, placeholder, validate },
  };
}

function numberSetting(
  name: string,
  desc: string,
  key: string,
  defaultValue: number,
  options: Pick<
    Extract<NativeSettingControl, { type: 'number' }>,
    'min' | 'max' | 'step'
  > = {}
): NativeSettingDefinitionControl {
  return {
    name,
    desc,
    control: { type: 'number', key, defaultValue, ...options },
  };
}

function dropdownSetting(
  name: string,
  desc: string,
  key: string,
  options: Record<string, string>,
  defaultValue: string
): NativeSettingDefinitionControl {
  return {
    name,
    desc,
    aliases: Object.values(options),
    control: { type: 'dropdown', key, options, defaultValue },
  };
}

function validateTime(value: string): string | void {
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return undefined;
  }

  return 'Use 24-hour time in HH:MM format.';
}

function getSettingsPath(settings: JournalitSettings, path: string): unknown {
  let cursor: unknown = settings;

  for (const part of path.split('.')) {
    if (!isRecord(cursor)) {
      return getDefaultSettingsPath(path);
    }

    cursor = cursor[part];
  }

  return cursor ?? getDefaultSettingsPath(path);
}

function applyNativeSettingsControlValue(
  settings: JournalitSettings,
  path: string,
  value: unknown
): boolean {
  if (path === 'trade.tradingDayCutoffTime') {
    settings.trade.tradingDayCutoffEndOfDayMigrationVersion =
      DEFAULT_SETTINGS.trade.tradingDayCutoffEndOfDayMigrationVersion;
  }

  setSettingsPath(settings, path, value);
  return true;
}

function setSettingsPath(
  settings: JournalitSettings,
  path: string,
  value: unknown
): void {
  const parts = path.split('.');
  const last = parts.pop();
  if (!last) {
    return;
  }

  let cursor: object = settings;
  let currentPath = '';

  for (const part of parts) {
    currentPath = currentPath ? `${currentPath}.${part}` : part;
    const next: unknown = Reflect.get(cursor, part);

    if (isRecord(next)) {
      cursor = next;
      continue;
    }

    const defaultBranch = getDefaultSettingsPath(currentPath);
    const replacement = isRecord(defaultBranch)
      ? cloneRecord(defaultBranch)
      : {};
    Reflect.set(cursor, part, replacement);
    cursor = replacement;
  }

  Reflect.set(cursor, last, value);
}

function getDefaultSettingsPath(path: string): unknown {
  let cursor: unknown = DEFAULT_SETTINGS;

  for (const part of path.split('.')) {
    if (!isRecord(cursor)) {
      return undefined;
    }

    cursor = cursor[part];
  }

  return cursor;
}

function cloneRecord(record: Record<string, unknown>): Record<string, unknown> {
  return { ...record };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

interface NativeReactSettingsPageOptions {
  title: string;
  display(containerEl: HTMLElement): void;
  hide(containerEl: HTMLElement): void;
}

function createNativeReactSettingsPage(
  options: NativeReactSettingsPageOptions
): NativeSettingPage {
  const SettingPage = getNativeSettingPageConstructor();

  return new (class JournalitNativeSettingsPage extends SettingPage {
    constructor() {
      super();
      Reflect.set(this, 'title', options.title);
    }

    display(): void {
      options.display(getNativeSettingPageContainer(this));
    }

    hide(): void {
      hideNativeSettingPageBase(this, SettingPage);
      options.hide(getNativeSettingPageContainer(this));
    }
  })();
}

function isNativeSettingPageConstructor(
  value: unknown
): value is NativeSettingPageConstructor {
  return typeof value === 'function' && 'prototype' in value;
}

function getNativeSettingPageConstructor(): NativeSettingPageConstructor {
  const settingPageConstructor: unknown = Reflect.get(Obsidian, 'SettingPage');
  if (!isNativeSettingPageConstructor(settingPageConstructor)) {
    throw new Error('Obsidian SettingPage API is unavailable.');
  }

  return settingPageConstructor;
}

function getNativeSettingPageContainer(page: NativeSettingPage): HTMLElement {
  const containerEl = Reflect.get(page, 'containerEl');
  if (!(containerEl instanceof HTMLElement)) {
    throw new Error('Obsidian SettingPage container is unavailable.');
  }

  return containerEl;
}

function hideNativeSettingPageBase(
  page: NativeSettingPage,
  pageConstructor: NativeSettingPageConstructor
): void {
  const hide: unknown = Reflect.get(pageConstructor.prototype, 'hide');
  if (typeof hide === 'function') {
    Reflect.apply(hide, page, []);
  }
}
