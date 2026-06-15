

import * as Obsidian from 'obsidian';
import { App, PluginSettingTab, requireApiVersion } from 'obsidian';
import React, { useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { eventBus } from '../services/events';
import { t } from '../lang/helpers';
import JournalitPlugin from '../main';
import {
  DEFAULT_SETTINGS,
  SETTINGS_TAB_IDS,
  type JournalitSettings,
  type SettingsTabId,
} from './types';


import { GeneralTab } from './components/general/GeneralTab';
import { ReviewsTab } from './components/reviews/ReviewsTab';
import { AuthTab } from './components/accounts/AuthTab';
import { CustomizationTab } from './components/customization/CustomizationTab';
import { TradeSyncTab } from './components/integration/TradeSyncTab';

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
  items: NativeSettingDefinitionItem[];
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

type NativeSettingControl =
  | {
      type: 'toggle';
      key: string;
      defaultValue?: boolean;
      disabled?: boolean | (() => boolean);
    }
  | {
      type: 'text';
      key: string;
      placeholder?: string;
      defaultValue?: string;
      validate?: (value: string) => string | void;
    }
  | {
      type: 'number';
      key: string;
      min?: number;
      max?: number;
      step?: number;
      placeholder?: string;
      defaultValue?: number;
      validate?: (value: number) => string | void;
    }
  | {
      type: 'dropdown';
      key: string;
      defaultValue?: string;
      options: Record<string, string>;
    };

type NativeSettingDefinitionItem =
  | NativeSettingDefinitionPage
  | NativeSettingDefinitionGroup
  | NativeSettingDefinitionRender
  | NativeSettingDefinitionControl;

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

  getSettingDefinitions(): NativeSettingDefinitionItem[] {
    if (!requireApiVersion('1.13.0')) {
      return [];
    }

    return getSettingsPageDefinitions().map((definition) => ({
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
    }));
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
    const tabToDisplay = this.initialTab;
    this.initialTab = SETTINGS_TAB_IDS.GENERAL; 
    this.renderReactSettings(this.containerEl, tabToDisplay, true);
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
  initialTab?: string;
  showTabs?: boolean;
}


const SettingsTabContent: React.FC<SettingsTabContentProps> = React.memo(
  ({
    plugin,
    initialTab = SETTINGS_TAB_IDS.GENERAL,
    showTabs = true,
  }: SettingsTabContentProps) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    
    
    useEffect(() => {
      setActiveTab(initialTab);
    }, [initialTab]);

    
    const handleTabChange = (newTab: string) => {
      setActiveTab(newTab);
    };

    
    const tabs = [
      { id: SETTINGS_TAB_IDS.GENERAL, label: t('settings.tab.general') },
      { id: SETTINGS_TAB_IDS.REVIEWS, label: t('settings.tab.reviews') },
      {
        id: SETTINGS_TAB_IDS.CUSTOMIZATION,
        label: t('settings.tab.customization'),
      },
      { id: SETTINGS_TAB_IDS.TRADE_SYNC, label: t('settings.tab.backend') },
      { id: SETTINGS_TAB_IDS.ACCOUNTS, label: t('settings.tab.accounts') },
    ];

    return (
      <div className="settings-tab-container">
        {showTabs && (
          <nav className="settings-tab-nav">
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
          {activeTab === 'general' && <GeneralTab plugin={plugin} />}
          {activeTab === 'reviews' && <ReviewsTab plugin={plugin} />}
          {activeTab === 'customization' && (
            <CustomizationTab plugin={plugin} />
          )}
          {activeTab === SETTINGS_TAB_IDS.TRADE_SYNC && (
            <TradeSyncTab plugin={plugin} />
          )}
          {activeTab === SETTINGS_TAB_IDS.ACCOUNTS && (
            <AuthTab plugin={plugin} />
          )}
        </div>
      </div>
    );
  }
);

SettingsTabContent.displayName = 'SettingsTabContent';

const settingsRoots = new WeakMap<HTMLElement, Root>();

function getSettingsPageDefinitions(): SettingsPageDefinition[] {
  return [
    {
      tabId: SETTINGS_TAB_IDS.GENERAL,
      label: t('settings.tab.general'),
      desc: 'Core trading, display, privacy, folders, startup, and data management preferences.',
      createItems: createGeneralNativeSettingItems,
      aliases: [
        'currency',
        'display name',
        'privacy mode',
        'home view',
        'journal folder',
        'date format',
        'risk amount',
        'R-multiples',
        'copy trading PnL',
        'notifications',
        'backup',
        'import settings',
        'export settings',
      ],
    },
    {
      tabId: SETTINGS_TAB_IDS.REVIEWS,
      label: t('settings.tab.reviews'),
      desc: 'Daily, weekly, monthly, quarterly, yearly, and scalper review templates and automation.',
      createItems: createReviewNativeSettingItems,
      aliases: [
        'daily review',
        'DRC',
        'weekly review',
        'monthly review',
        'quarterly review',
        'yearly review',
        'review templates',
        'recurring goals',
        'checklist',
        'auto-create reviews',
        'scalper',
      ],
    },
    {
      tabId: SETTINGS_TAB_IDS.CUSTOMIZATION,
      label: t('settings.tab.customization'),
      desc: 'Custom trade fields, review fields, entry models, instruments, setups, mistakes, and tags.',
      aliases: [
        'custom fields',
        'review fields',
        'entry models',
        'instruments',
        'sessions',
        'directions',
        'setups',
        'mistakes',
        'tags',
        'events',
        'symbols',
      ],
    },
    {
      tabId: SETTINGS_TAB_IDS.TRADE_SYNC,
      label: t('settings.tab.backend'),
      desc: 'Backend sync, MetaTrader FTP credentials, account linking, import, export, and diagnostics.',
      aliases: [
        'backend',
        'sync',
        'MetaTrader',
        'FTP',
        'credentials',
        'account linking',
        'import trades',
        'export trades',
        'diagnostics',
        'auto sync',
      ],
    },
    {
      tabId: SETTINGS_TAB_IDS.ACCOUNTS,
      label: t('settings.tab.accounts'),
      desc: 'Journalit account authentication, subscription status, sign in, and sign out.',
      aliases: [
        'account',
        'authentication',
        'login',
        'logout',
        'sign in',
        'sign out',
        'subscription',
        'billing',
        'user email',
      ],
    },
  ];
}

function createGeneralNativeSettingItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  return [
    {
      type: 'group',
      heading: t('settings.general.display-privacy-section'),
      items: [
        dropdownSetting(
          t('settings.general.currency'),
          t('settings.general.currency-desc'),
          'general.currency',
          {
            USD: 'USD',
            EUR: 'EUR',
            GBP: 'GBP',
            CAD: 'CAD',
            AUD: 'AUD',
            JPY: 'JPY',
            CHF: 'CHF',
            NZD: 'NZD',
          },
          'USD'
        ),
        textSetting(
          t('settings.general.display-name'),
          t('settings.general.display-name-desc'),
          'general.displayName',
          t('settings.general.display-name-placeholder')
        ),
        toggleSetting(
          t('settings.general.privacy-mode'),
          t('settings.general.privacy-mode-desc'),
          'display.privacyMode',
          false
        ),
      ],
    },
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
    createReactPageDefinition(
      tab,
      SETTINGS_TAB_IDS.GENERAL,
      'Advanced general settings',
      'Open the full Journalit general settings UI for folder changes, image paths, backups, import, export, and reset actions.',
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

function createReviewNativeSettingItems(
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
  ];
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
