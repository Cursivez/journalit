

import {
  App,
  ButtonComponent,
  Notice,
  PluginSettingTab,
  SettingPage,
  setIcon,
} from 'obsidian';
import type { SettingControl, SettingDefinitionItem } from 'obsidian';
import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot, Root } from 'react-dom/client';
import { eventBus } from '../services/events/EventBus';
import { clearUpgradeOrigin } from '../services/upgrade/upgradeOrigin';
import { OptionType } from '../services/options/CustomOptionsService';
import { t } from '../lang/helpers';
import JournalitPlugin from '../main';
import { getBaseCurrencyOptions } from '../utils/currencyConfig';
import {
  DEFAULT_SETTINGS,
  SETTINGS_TAB_IDS,
  type SettingsTabId,
} from './types';
import { saveDisplayName } from './displayName';
import {
  OPEN_CUSTOM_FIELDS_REQUEST,
  OPEN_REVIEW_FIELDS_REQUEST,
} from './settingsOpenRequests';
import {
  applySettingsControlValue,
  getSettingsPath,
  publishSettingsControlChange,
} from './settingsControlWrites';

import {
  AdvancedSettings,
  GalleryFoldersSettingsControl,
  HomeBackgroundControls,
  NavigationSidebarOpenControl,
  CalendarSidebarOpenControl,
} from './components/general/GeneralTab';
import { EconomicCalendarSettingsSection } from './components/economicCalendar/EconomicCalendarSettingsSection';
import { SessionModeTab } from './components/sessionMode/SessionModeTab';
import { SyncSettingsTab } from './components/sync/SyncSettingsTab';
import { AuthTab } from './components/accounts/AuthTab';
import { CustomOptionsTab } from './components/CustomOptionsTab';
import { CustomFieldsManager } from './components/customization/CustomFieldsManager';
import { ReviewFieldsManager } from './components/customization/ReviewFieldsManager';
import { ReviewItemList } from './components/reviews/ReviewItemList';
import { openExternalUrl } from '../utils/externalLinks';
import { openTradeFormLayoutSettingsModal } from '../components/forms/trade/TradeFormLayoutSettingsModal';
import { JOURNALIT_SETTINGS_RESOURCES } from './settingsResources';
import { LOGO_DATA_URI } from '../assets/logoData';
import { HomeWidgetOpacityControl } from './components/general/HomeWidgetOpacityControl';

interface NativeSettingDefinitionPage {
  type: 'page';
  tabId?: SettingsTabId;
  name: string;
  desc?: string;
  aliases?: string[];
  displayValue?: () => string;
  items?: NativeSettingDefinitionItem[];
  page?: () => SettingPage;
}

interface NativeSettingDefinitionGroup {
  type: 'group';
  heading?: string;
  cls?: string;
  items: NativeSettingGroupItem[];
}

interface NativeSettingDefinitionRender {
  name: string;
  desc?: string;
  aliases?: string[];
  searchable?: boolean;
  visible?: boolean | (() => boolean);
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
  nameEl: HTMLElement;
  controlEl: HTMLElement;
}

export class JournalitSettingsTab extends PluginSettingTab {
  plugin: JournalitPlugin;

  constructor(app: App, plugin: JournalitPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  
  openNativeSettingsPage(tabId: SettingsTabId): boolean {
    const settingManager = this.app.setting;
    if (!settingManager) {
      return false;
    }

    
    const pageId =
      tabId === SETTINGS_TAB_IDS.ACCOUNTS
        ? SETTINGS_TAB_IDS.CONNECTIONS
        : tabId;
    const path = findNativePagePath(this.getNativeSettingDefinitions(), pageId);
    if (!path) {
      return false;
    }

    settingManager.clearPageStack?.();
    for (const name of path) {
      const settingEl = this.findPageRow(name);
      if (!settingEl) {
        return false;
      }
      if (settingManager.activateSettingItem) {
        settingManager.activateSettingItem(settingEl);
      } else {
        settingEl.click();
      }
    }
    return true;
  }

  
  private findPageRow(name: string): HTMLElement | undefined {
    const settingsEl =
      this.containerEl.closest('.modal.mod-settings') ?? this.containerEl;
    return Array.from(
      settingsEl.querySelectorAll<HTMLElement>('.setting-item.mod-navigable')
    )
      .filter(
        (element) =>
          element.querySelector('.setting-item-name')?.textContent?.trim() ===
          name
      )
      .last();
  }

  getSettingDefinitions(): SettingDefinitionItem<string>[] {
    return this.getNativeSettingDefinitions();
  }

  private getNativeSettingDefinitions(): NativeSettingDefinitionItem[] {
    return withJournalitGroupScope([
      {
        type: 'group',
        cls: 'journalit-settings-home-intro',
        items: createNativeHomeIntroItems(this.plugin),
      },
      {
        type: 'group',
        cls: 'journalit-settings-home-navigation',
        items: createHubPages(this),
      },
    ]);
  }

  getControlValue(key: string): unknown {
    return getSettingsPath(this.plugin.settings, key);
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    if (key === 'general.displayName') {
      if (typeof value !== 'string') {
        throw new TypeError('Display name must be a string');
      }

      try {
        await saveDisplayName(this.plugin, value);
      } finally {
        this.refreshDomState();
      }
      return;
    }

    applySettingsControlValue(this.plugin.settings, key, value);
    await this.plugin.saveSettings();
    this.refreshDomState();
    await publishSettingsControlChange(this.plugin, key);
  }

  
  hide(): void {
    clearUpgradeOrigin('metatraderSync');
    this.containerEl.empty();
  }
}


function findNativePagePath(
  definitions: NativeSettingDefinitionItem[],
  tabId: SettingsTabId
): string[] | undefined {
  for (const definition of definitions) {
    if ('type' in definition && definition.type === 'page') {
      if (definition.tabId === tabId) {
        return [definition.name];
      }
      const nested =
        definition.items && findNativePagePath(definition.items, tabId);
      if (nested) {
        return [definition.name, ...nested];
      }
    } else if ('type' in definition && definition.type === 'group') {
      const nested = findNativePagePath(definition.items, tabId);
      if (nested) {
        return nested;
      }
    }
  }

  return undefined;
}


const JOURNALIT_SETTINGS_GROUP_CLASS = 'journalit-settings-group';

function withJournalitGroupScope(
  items: NativeSettingDefinitionItem[]
): NativeSettingDefinitionItem[] {
  return items.map((item): NativeSettingDefinitionItem => {
    if ('type' in item && item.type === 'group') {
      return {
        ...item,
        
        
        cls: item.cls ?? JOURNALIT_SETTINGS_GROUP_CLASS,
        items: item.items.map(withNestedPageScope),
      };
    }
    return withNestedPageScope(item);
  });
}

function withNestedPageScope<T extends NativeSettingDefinitionItem>(
  item: T
): T {
  if ('type' in item && item.type === 'page' && item.items) {
    return { ...item, items: withJournalitGroupScope(item.items) };
  }
  return item;
}

const onOff = (value: boolean | undefined): string =>
  value ? t('settings.hub.value.on') : t('settings.hub.value.off');

function createHubPages(tab: JournalitSettingsTab): NativeSettingGroupItem[] {
  return [
    {
      type: 'page',
      tabId: SETTINGS_TAB_IDS.CONNECTIONS,
      name: t('settings.hub.connections'),
      desc: t('settings.hub.connections.desc'),
      aliases: [
        'account',
        'sync',
        'subscription',
        'billing',
        'sign in',
        'sign out',
        'MetaTrader',
        'Tradovate',
        'Rithmic',
        'cTrader',
        'FTP',
        'import trades',
        'economic calendar',
        'mcp',
      ],
      items: createConnectionsItems(tab),
    },
    {
      type: 'page',
      tabId: SETTINGS_TAB_IDS.JOURNAL,
      name: t('settings.tab.journal-setup'),
      desc: t('settings.hub.journal.desc'),
      aliases: [
        'trade form',
        'reviews',
        'recurring goals',
        'checklist',
        'custom fields',
        'symbols',
        'tags',
        'mistakes',
        'events',
      ],
      items: createJournalSetupItems(tab),
    },
    {
      type: 'page',
      tabId: SETTINGS_TAB_IDS.CALCULATIONS,
      name: t('settings.hub.calculations'),
      desc: t('settings.hub.calculations.desc'),
      displayValue: () =>
        t('settings.hub.calculations.value', {
          time: tab.plugin.settings.trade.tradingDayCutoffTime ?? '23:59',
        }),
      items: createCalculationsItems(tab),
    },
    {
      type: 'page',
      tabId: SETTINGS_TAB_IDS.PREFERENCES,
      name: t('settings.hub.preferences'),
      desc: t('settings.hub.preferences.desc'),
      items: createPreferencesItems(tab),
    },
    {
      type: 'page',
      tabId: SETTINGS_TAB_IDS.FILES_AND_BACKUPS,
      name: t('settings.hub.files'),
      desc: t('settings.page.advanced.desc'),
      aliases: [
        'journal folder',
        'image paths',
        'backup',
        'import settings',
        'export settings',
        'reset settings',
      ],
      items: [
        {
          
          
          type: 'group',
          cls: 'journalit-settings-plain-group',
          items: [
            {
              ...inlineReactRow('', undefined, () => (
                <AdvancedSettings plugin={tab.plugin} />
              )),
              searchable: false,
            },
          ],
        },
        {
          type: 'group',
          items: [
            inlineReactRow(
              t('settings.gallery-folders.section'),
              t('settings.gallery-folders.description'),
              () => <GalleryFoldersSettingsControl plugin={tab.plugin} />
            ),
          ],
        },
      ],
    },
  ];
}

function createConnectionsItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  return [
    {
      type: 'group',
      cls: 'journalit-settings-account-card-group',
      items: [
        {
          
          
          
          name: '',
          searchable: false,
          render: (setting) => {
            setting.settingEl.classList.add(
              'journalit-settings-account-card-item'
            );
            const root = createRoot(setting.controlEl);
            root.render(
              <div className="journalit-settings journalit-settings-account-card">
                <AuthTab plugin={tab.plugin} />
              </div>
            );
            return () => {
              root.unmount();
              setting.settingEl.classList.remove(
                'journalit-settings-account-card-item'
              );
            };
          },
        },
      ],
    },
    {
      type: 'group',
      items: [
        createReactPage({
          tabId: SETTINGS_TAB_IDS.TRADE_SYNC,
          name: t('trade-sync.providers.title'),
          desc: t('settings.page.trade-sync.desc'),
          aliases: [
            'MetaTrader',
            'Tradovate',
            'Rithmic',
            'cTrader',
            'broker sync',
            'FTP',
            'credentials',
            'account management',
            'diagnostics',
            'notifications',
          ],
          content: () => (
            <SyncSettingsTab plugin={tab.plugin} section="brokerSync" />
          ),
          onHide: () => clearUpgradeOrigin('metatraderSync'),
        }),
        createReactPage({
          tabId: SETTINGS_TAB_IDS.TRADE_IMPORT_SYNC,
          name: t('trade-sync.source.trade-import'),
          desc: t('trade-sync.source.trade-import.description'),
          aliases: [
            'trade import',
            'import trades',
            'inventory',
            'restore',
            'account mapping',
          ],
          content: () => (
            <SyncSettingsTab plugin={tab.plugin} section="tradeImport" />
          ),
        }),
        {
          ...createReactPage({
            tabId: SETTINGS_TAB_IDS.ECONOMIC_CALENDAR,
            name: t('settings.economic-calendar.title'),
            desc: t('settings.economic-calendar.description'),
            aliases: [
              'economic calendar',
              'news events',
              'key events',
              'auto-import',
            ],
            content: () => (
              <EconomicCalendarSettingsSection plugin={tab.plugin} />
            ),
          }),
          displayValue: () =>
            onOff(tab.plugin.settings.economicCalendar?.autoImport),
        },
        createReactPage({
          tabId: SETTINGS_TAB_IDS.MCP_ACCESS,
          name: t('settings.mcp-access.title'),
          desc: t('settings.page.mcp-access.desc'),
          aliases: [
            'mcp',
            'mcp access',
            'ai',
            'ai apps',
            'ai access',
            'ai assistant',
            'ai agent activity',
            'agent',
            'claude',
            'claude code',
            'chatgpt',
            'connector',
            'ai connections',
          ],
          content: () => (
            <SyncSettingsTab plugin={tab.plugin} section="mcpAccess" />
          ),
        }),
      ],
    },
  ];
}

function createJournalSetupItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  const listPage = (
    tabId: SettingsTabId,
    name: string,
    desc: string,
    list: React.ComponentProps<typeof CustomOptionsTab>
  ) =>
    createReactPage({
      tabId,
      name,
      desc,
      content: () => (
        <div className="journalit-settings-tab customization-settings">
          <CustomOptionsTab {...list} />
        </div>
      ),
    });

  return [
    {
      type: 'group',
      items: [
        {
          name: t('settings.general.trade-form'),
          desc: t('settings.general.trade-form-desc'),
          
          aliases: [
            'form layout',
            'position size',
            'dollar value',
            'MAE',
            'MFE',
            'seconds',
            'trade times',
            'stop loss unit',
            'take profit unit',
          ],
          render: (setting) => {
            new ButtonComponent(setting.controlEl)
              .setButtonText(
                t('settings.customization.trade-form-layout.button')
              )
              .onClick(() =>
                openTradeFormLayoutSettingsModal({
                  app: tab.app,
                  plugin: tab.plugin,
                })
              );
          },
        },
        {
          type: 'page',
          tabId: SETTINGS_TAB_IDS.REVIEWS,
          name: t('settings.page.reviews.title'),
          desc: t('settings.page.reviews.desc'),
          aliases: ['review layouts', 'recurring goals', 'checklist'],
          items: createReviewsItems(tab),
        },
        createReactPage({
          tabId: SETTINGS_TAB_IDS.SESSION_MODE,
          name: t('settings.session-mode.title'),
          desc: t('settings.session-mode.description'),
          aliases: [
            'session mode',
            'trading sessions',
            'phase layout',
            'trade gate',
            'session log tags',
          ],
          content: () => <SessionModeTab plugin={tab.plugin} />,
        }),
        {
          type: 'page',
          tabId: SETTINGS_TAB_IDS.CUSTOM_FIELDS,
          name: t('settings.hub.custom-fields'),
          desc: t('settings.hub.custom-fields.desc'),
          items: [
            {
              type: 'group',
              items: [
                inlineReactRow(
                  t('settings.customization.trade-fields'),
                  undefined,
                  () => <CustomFieldsManager plugin={tab.plugin} />,
                  { app: tab.app, request: OPEN_CUSTOM_FIELDS_REQUEST }
                ),
              ],
            },
            {
              type: 'group',
              items: [
                inlineReactRow(
                  t('settings.customization.review-fields'),
                  undefined,
                  () => <ReviewFieldsManager plugin={tab.plugin} />,
                  { app: tab.app, request: OPEN_REVIEW_FIELDS_REQUEST }
                ),
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      heading: t('settings.hub.symbols-and-tags'),
      items: [
        listPage(
          SETTINGS_TAB_IDS.SYMBOLS,
          t('settings.customization.tickers-symbols'),
          t('settings.hub.symbols.desc'),
          { plugin: tab.plugin, filterType: OptionType.INSTRUMENT }
        ),
        listPage(
          SETTINGS_TAB_IDS.SYMBOL_MAPPINGS,
          t('settings.customization.symbol-mappings'),
          t('settings.customization.options.mapping.description'),
          { plugin: tab.plugin, showSymbolMappings: true }
        ),
        listPage(
          SETTINGS_TAB_IDS.TAGS,
          t('settings.customization.tags'),
          t('settings.hub.tags.desc'),
          { plugin: tab.plugin, filterType: OptionType.TAG }
        ),
        listPage(
          SETTINGS_TAB_IDS.MISTAKES,
          t('settings.customization.mistakes'),
          t('settings.hub.mistakes.desc'),
          { plugin: tab.plugin, filterType: OptionType.MISTAKE }
        ),
        listPage(
          SETTINGS_TAB_IDS.EVENTS,
          t('settings.customization.events'),
          t('settings.hub.events.desc'),
          { plugin: tab.plugin, filterType: OptionType.EVENT }
        ),
      ],
    },
  ];
}

function createReviewsItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  const itemList = (
    name: string,
    desc: string | undefined,
    list: Omit<React.ComponentProps<typeof ReviewItemList>, 'plugin'>
  ) =>
    inlineReactRow(name, desc, () => (
      <ReviewItemList plugin={tab.plugin} {...list} />
    ));

  return [
    {
      type: 'group',
      items: [
        {
          name: t('settings.reviews.template-builder'),
          desc: t('settings.reviews.template-builder-desc'),
          aliases: ['layout builder', 'review templates'],
          render: (setting) => {
            new ButtonComponent(setting.controlEl)
              .setButtonText(t('settings.reviews.open-builder'))
              .onClick(() => {
                const commands = tab.app.commands;
                if (commands?.executeCommandById) {
                  commands.executeCommandById('journalit:open-layout-builder');
                } else {
                  new Notice(t('settings.reviews.notice.builder-not-found'));
                }
              });
          },
        },
      ],
    },
    {
      type: 'group',
      heading: t('settings.reviews.recurring-goals'),
      items: [
        itemList(
          t('settings.reviews.daily-goals'),
          t('settings.reviews.recurring-goals-desc'),
          {
            defaultItems: [],
            settingsPath: 'drc.recurringGoals',
            placeholder: t('settings.reviews.daily-goal-placeholder'),
            settingsEventComponent: 'drc',
          }
        ),
        itemList(t('settings.reviews.weekly-goals'), undefined, {
          defaultItems: [],
          settingsPath: 'weekly.recurringGoals',
          placeholder: t('settings.reviews.weekly-goal-placeholder'),
          settingsEventComponent: 'weekly',
        }),
      ],
    },
    {
      type: 'group',
      heading: t('settings.hub.checklists'),
      items: [
        itemList(
          t('settings.reviews.checklist'),
          t('settings.reviews.checklist-desc'),
          {
            defaultItems: [],
            settingsPath: 'drc.checklistItems',
            placeholder: t('settings.reviews.checklist-placeholder'),
            settingsEventComponent: 'drc',
          }
        ),
        itemList(
          t('settings.reviews.weekly-checklist'),
          t('settings.reviews.weekly-checklist-desc'),
          {
            defaultItems: DEFAULT_SETTINGS.weekly.checklistItems ?? [],
            settingsPath: 'weekly.checklistItems',
            placeholder: t('settings.reviews.weekly-checklist-placeholder'),
            settingsEventComponent: 'weekly',
          }
        ),
      ],
    },
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
      ],
    },
    {
      type: 'group',
      heading: t('settings.hub.create-on-open'),
      items: [
        toggleSetting(
          t('settings.hub.period.day'),
          t('settings.reviews.auto-create-drc-nav-desc'),
          'drc.autoCreateDRCOnNavigation',
          true
        ),
        toggleSetting(
          t('common.week'),
          t('settings.reviews.auto-create-weekly-nav-desc'),
          'weekly.autoCreateWeeklyReviewOnNavigation',
          true
        ),
        toggleSetting(
          t('common.month'),
          t('settings.reviews.auto-create-monthly-nav-desc'),
          'monthly.autoCreateMonthlyReviewOnNavigation',
          true
        ),
        toggleSetting(
          t('common.quarter'),
          t('settings.reviews.auto-create-quarterly-nav-desc'),
          'quarterly.autoCreateQuarterlyReviewOnNavigation',
          true
        ),
        toggleSetting(
          t('common.year'),
          t('settings.reviews.auto-create-yearly-nav-desc'),
          'yearly.autoCreateYearlyReviewOnNavigation',
          true
        ),
      ],
    },
  ];
}

function createCalculationsItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  const usesPercentBreakEven = () =>
    tab.plugin.settings.trade.breakEvenThresholdMode ===
    'percentage_current_balance';

  return [
    {
      type: 'group',
      heading: t('settings.hub.trading-day'),
      items: [
        {
          ...textSetting(
            t('settings.general.cutoff-time'),
            t('settings.general.cutoff-time-desc'),
            'trade.tradingDayCutoffTime',
            '23:59',
            validateTime
          ),
          aliases: ['trading day cutoff', 'cutoff time'],
        },
        toggleSetting(
          t('settings.general.skip-weekends'),
          t('settings.general.skip-weekends-desc'),
          'trade.skipWeekends',
          true
        ),
      ],
    },
    {
      type: 'group',
      heading: t('settings.hub.analytics'),
      items: [
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
          t('settings.general.include-unrealized-pnl'),
          t('settings.general.include-unrealized-pnl-desc'),
          'trade.includeUnrealizedPnLInCalculations',
          false,
          undefined,
          ['unrealized P&L', 'floating P&L', 'open position P&L']
        ),
        toggleSetting(
          t('settings.general.include-copy-accounts-analytics'),
          t('settings.general.include-copy-accounts-analytics-desc'),
          'trade.includeCopyAccountsInAllAccountsAnalytics',
          false,
          undefined,
          ['copy accounts', 'copy trading analytics']
        ),
      ],
    },
    {
      type: 'group',
      heading: t('settings.hub.risk'),
      items: [
        numberSetting(
          t('settings.general.default-risk'),
          t('settings.general.default-risk-desc'),
          'trade.defaultRiskAmount',
          0,
          { min: 0, step: 0.01 }
        ),
      ],
    },
    {
      type: 'group',
      heading: t('settings.hub.break-even'),
      items: [
        dropdownSetting(
          t('settings.general.break-even-threshold-mode'),
          t('settings.general.break-even-threshold-mode-desc'),
          'trade.breakEvenThresholdMode',
          {
            fixed: t('settings.general.break-even-mode-fixed'),
            percentage_current_balance: t(
              'settings.general.break-even-mode-percent'
            ),
          },
          'fixed'
        ),
        {
          ...numberSetting(
            t('settings.general.break-even-percent'),
            t('settings.general.break-even-percent-desc'),
            'trade.breakEvenThresholdPercent',
            0.05,
            { min: 0, step: 0.01 }
          ),
          aliases: ['break-even percentage'],
          visible: usesPercentBreakEven,
        },
        {
          ...numberSetting(
            t('settings.general.break-even-min-aria'),
            t('settings.general.break-even-range-desc'),
            'trade.breakEvenRangeMin',
            0,
            { max: 0, step: 0.01 }
          ),
          aliases: ['break-even minimum', 'break-even range'],
          visible: () => !usesPercentBreakEven(),
        },
        {
          ...numberSetting(
            t('settings.general.break-even-max-aria'),
            '',
            'trade.breakEvenRangeMax',
            0,
            { min: 0, step: 0.01 }
          ),
          aliases: ['break-even maximum', 'break-even range'],
          visible: () => !usesPercentBreakEven(),
        },
      ],
    },
  ];
}

function createPreferencesItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  const { plugin } = tab;
  const currencyOptions = Object.fromEntries(
    getBaseCurrencyOptions().map((option) => [option.value, option.label])
  );

  return [
    {
      type: 'group',
      items: [
        {
          type: 'page',
          tabId: SETTINGS_TAB_IDS.CURRENCY_AND_DATES,
          name: t('settings.hub.currency-and-dates'),
          desc: t('settings.hub.currency-and-dates.desc'),
          displayValue: () =>
            `${plugin.settings.general?.currency ?? 'USD'} · ${plugin.settings.trade.dateFormat}`,
          items: [
            {
              type: 'group',
              heading: t('settings.hub.numbers'),
              items: [
                dropdownSetting(
                  t('settings.general.currency'),
                  t('settings.general.currency-desc'),
                  'general.currency',
                  currencyOptions,
                  'USD'
                ),
                toggleSetting(
                  t('settings.general.display-r-multiples'),
                  t('settings.general.display-r-multiples-desc'),
                  'trade.displayRMultiples',
                  false
                ),
                toggleSetting(
                  t('settings.general.hide-dollar-amounts-in-r-mode'),
                  t('settings.general.hide-dollar-amounts-in-r-mode-desc'),
                  'trade.hideDollarAmountsInRMode',
                  false,
                  () => !plugin.settings.trade.displayRMultiples,
                  ['hide dollars', 'R only']
                ),
                dropdownSetting(
                  t('settings.general.mae-mfe-display-unit'),
                  t('settings.general.mae-mfe-display-unit-desc'),
                  'trade.maeMfeDisplayUnit',
                  {
                    dollar: t('settings.general.mae-mfe-display-dollar'),
                    ticks: t('settings.general.mae-mfe-display-ticks'),
                  },
                  'dollar'
                ),
              ],
            },
            {
              type: 'group',
              heading: t('settings.hub.dates-and-times'),
              items: [
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
              ],
            },
          ],
        },
        {
          type: 'page',
          tabId: SETTINGS_TAB_IDS.APPEARANCE,
          name: t('settings.hub.appearance'),
          desc: t('settings.hub.appearance.desc'),
          items: createAppearanceItems(tab),
        },
        {
          type: 'page',
          tabId: SETTINGS_TAB_IDS.PRIVACY,
          name: t('settings.hub.privacy'),
          desc: t('settings.hub.privacy.desc'),
          displayValue: () => onOff(plugin.settings.display?.privacyMode),
          items: [
            {
              type: 'group',
              items: [
                toggleSetting(
                  t('settings.general.privacy-mode'),
                  t('settings.general.privacy-mode-desc'),
                  'display.privacyMode',
                  false
                ),
                toggleSetting(
                  t('settings.general.hide-dollar-amounts-in-shares'),
                  t('settings.general.hide-dollar-amounts-in-shares-desc'),
                  'display.hideDollarAmountsInShares',
                  false,
                  
                  () => !plugin.settings.trade.displayRMultiples,
                  ['share', 'screenshot']
                ),
              ],
            },
          ],
        },
        {
          type: 'page',
          tabId: SETTINGS_TAB_IDS.NOTIFICATIONS,
          name: t('settings.hub.notifications'),
          desc: t('settings.hub.notifications.desc'),
          items: [
            {
              type: 'group',
              heading: t('settings.hub.updates'),
              items: [
                toggleSetting(
                  t('settings.general.update-notifications'),
                  t('settings.general.update-notifications-desc'),
                  'backendIntegration.showUpdateNotifications',
                  true
                ),
                toggleSetting(
                  t('settings.general.available-update-notifications'),
                  t('settings.general.available-update-notifications-desc'),
                  'backendIntegration.showAvailableUpdateNotifications',
                  true,
                  () =>
                    plugin.settings.backendIntegration
                      ?.showUpdateNotifications === false
                ),
              ],
            },
          ],
        },
      ],
    },
  ];
}

function createAppearanceItems(
  tab: JournalitSettingsTab
): NativeSettingDefinitionItem[] {
  return [
    {
      type: 'group',
      heading: t('settings.general.appearance'),
      items: [
        dropdownSetting(
          t('settings.general.accent-color'),
          t('settings.general.accent-color-desc'),
          'general.accentColorSource',
          {
            journalit: t('settings.general.accent-color-journalit'),
            obsidian: t('settings.general.accent-color-obsidian'),
          },
          'journalit'
        ),
        {
          name: t('settings.general.home-background'),
          desc: t('settings.general.home-background-desc'),
          aliases: ['home background', 'background image'],
          render: (setting) => {
            const root = createRoot(setting.controlEl);
            root.render(<HomeBackgroundControls plugin={tab.plugin} />);
            return () => root.unmount();
          },
        },
        toggleSetting(
          t('settings.general.home-background-dashboard'),
          t('settings.general.home-background-dashboard-desc'),
          'home.showBackgroundInDashboard',
          false
        ),
        {
          name: t('settings.general.home-widget-opacity'),
          desc: t('settings.general.home-widget-opacity-desc'),
          aliases: ['widget transparency', 'widget opacity'],
          visible: () => Boolean(tab.plugin.settings.home?.backgroundImagePath),
          render: (setting) => {
            const root = createRoot(setting.controlEl);
            root.render(
              <HomeWidgetOpacityControl
                plugin={tab.plugin}
                ownerDocument={setting.controlEl.ownerDocument}
              />
            );
            const unsubscribe = eventBus.subscribe(
              'settings:changed',
              (payload) => {
                if (
                  payload.section === 'all' ||
                  (payload.section === 'home' &&
                    payload.source === 'background-image')
                ) {
                  tab.refreshDomState();
                }
              }
            );
            return () => {
              unsubscribe();
              root.unmount();
            };
          },
        },
      ],
    },
    {
      type: 'group',
      heading: t('settings.hub.home'),
      items: [
        textSetting(
          t('settings.general.display-name'),
          t('settings.general.display-name-desc'),
          'general.displayName',
          t('settings.general.display-name-placeholder')
        ),
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
      heading: t('settings.hub.sidebars'),
      items: [
        {
          name: t('navigation.setting.open'),
          desc: t('navigation.setting.open.desc'),
          aliases: ['open sidebar', 'show sidebar', 'reveal sidebar'],
          render: (setting) => {
            const root = createRoot(setting.controlEl);
            root.render(<NavigationSidebarOpenControl plugin={tab.plugin} />);
            return () => root.unmount();
          },
        },
        {
          name: t('calendar.setting.open'),
          desc: t('navigation.setting.open.desc'),
          aliases: [
            'open calendar sidebar',
            'show calendar sidebar',
            'reveal calendar',
          ],
          render: (setting) => {
            const root = createRoot(setting.controlEl);
            root.render(<CalendarSidebarOpenControl plugin={tab.plugin} />);
            return () => root.unmount();
          },
        },
      ],
    },
    {
      type: 'group',
      heading: t('settings.hub.opening-links'),
      items: [
        toggleSetting(
          t('settings.general.auto-open-trades'),
          t('settings.general.auto-open-trades-desc'),
          'trade.autoOpenCreatedTrades',
          false
        ),
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
        toggleSetting(
          t('settings.general.review-links-new-tab'),
          t('settings.general.review-links-new-tab-desc'),
          'reviewV2.openNoteLinksInNewTab',
          true
        ),
      ],
    },
  ];
}

const INLINE_ROW_CLASS = 'journalit-settings-inline-item';


function inlineReactRow(
  name: string,
  desc: string | undefined,
  content: () => React.ReactNode,
  scrollRequest?: { app: App; request: string }
): NativeSettingDefinitionRender {
  return {
    name,
    desc,
    render: (setting) => {
      setting.settingEl.classList.add(INLINE_ROW_CLASS);
      const root = createRoot(setting.controlEl);
      
      
      flushSync(() =>
        root.render(
          <div className="journalit-settings journalit-settings-tab customization-settings">
            {content()}
          </div>
        )
      );
      if (
        scrollRequest &&
        scrollRequest.app.loadLocalStorage(scrollRequest.request) === '1'
      ) {
        scrollRequest.app.saveLocalStorage(scrollRequest.request, null);
        scrollIntoViewOnceAttached(setting.settingEl);
      }
      return () => {
        root.unmount();
        setting.settingEl.classList.remove(INLINE_ROW_CLASS);
      };
    },
  };
}


function scrollIntoViewOnceAttached(el: HTMLElement, framesLeft = 30): void {
  el.win.requestAnimationFrame(() => {
    if (el.isConnected) {
      el.scrollIntoView({ block: 'start' });
    } else if (framesLeft > 0) {
      scrollIntoViewOnceAttached(el, framesLeft - 1);
    }
  });
}

interface ReactPageOptions {
  tabId: SettingsTabId;
  name: string;
  desc: string;
  aliases?: string[];
  content: () => React.ReactNode;
  onHide?: () => void;
}


function createReactPage(
  options: ReactPageOptions
): NativeSettingDefinitionPage {
  return {
    type: 'page',
    tabId: options.tabId,
    name: options.name,
    desc: options.desc,
    aliases: options.aliases,
    page: () =>
      createNativeReactSettingsPage({
        title: options.name,
        display: (containerEl) => {
          unmountReactSettings(containerEl);
          containerEl.empty();
          containerEl.addClass('journalit-settings');
          const root = createRoot(
            containerEl.createDiv({ cls: 'journalit-settings-wrapper' })
          );
          settingsRoots.set(containerEl, root);
          root.render(
            <React.StrictMode>
              <div className="settings-tab-container">
                <div className="settings-tab-content journalit-tab-content">
                  {options.content()}
                </div>
              </div>
            </React.StrictMode>
          );
        },
        hide: (containerEl) => {
          options.onHide?.();
          unmountReactSettings(containerEl);
        },
      }),
  };
}

const settingsRoots = new WeakMap<HTMLElement, Root>();

function unmountReactSettings(containerEl: HTMLElement): void {
  settingsRoots.get(containerEl)?.unmount();
  settingsRoots.delete(containerEl);
  containerEl.removeClass('journalit-settings');
}

function createNativeHomeIntroItems(
  plugin: JournalitPlugin
): NativeSettingGroupItem[] {
  return [
    {
      name: 'Journalit',
      searchable: false,
      render: (setting) => {
        setting.settingEl.classList.add('journalit-settings-home-header');
        setting.nameEl.empty();
        setting.nameEl.createEl('img', {
          cls: 'journalit-settings-home-logo',
          attr: { src: LOGO_DATA_URI, alt: 'Journalit' },
        });
        setting.nameEl.createSpan({
          cls: 'journalit-settings-home-version',
          text: `v${plugin.manifest.version}`,
        });
        setting.controlEl.empty();

        const links = [
          {
            label: t('settings.general.docs'),
            icon: 'book-open',
            url: JOURNALIT_SETTINGS_RESOURCES.docs,
          },
          {
            label: t('settings.general.discord'),
            icon: 'messages-square',
            url: JOURNALIT_SETTINGS_RESOURCES.discord,
          },
          {
            label: t('settings.general.github'),
            icon: 'github',
            url: JOURNALIT_SETTINGS_RESOURCES.github,
          },
        ] as const;

        const listeners: Array<{
          button: HTMLButtonElement;
          handleClick: () => void;
        }> = [];

        for (const link of links) {
          const button = setting.controlEl.createEl('button', {
            cls: 'journalit-button journalit-button--secondary journalit-button--small',
            attr: { type: 'button' },
          });
          setIcon(
            button.createSpan({ cls: 'journalit-settings-home-resource-icon' }),
            link.icon
          );
          button.createSpan({
            cls: 'journalit-button__label',
            text: link.label,
          });

          const handleClick = () => openExternalUrl(link.url);
          button.addEventListener('click', handleClick);
          listeners.push({ button, handleClick });
        }

        return () => {
          for (const { button, handleClick } of listeners) {
            button.removeEventListener('click', handleClick);
          }
          setting.settingEl.classList.remove('journalit-settings-home-header');
        };
      },
    },
  ];
}

function toggleSetting(
  name: string,
  desc: string,
  key: string,
  defaultValue: boolean,
  disabled?: () => boolean,
  aliases?: string[]
): NativeSettingDefinitionControl {
  return {
    name,
    desc,
    aliases,
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

interface NativeReactSettingsPageOptions {
  title: string;
  display(containerEl: HTMLElement): void;
  hide(containerEl: HTMLElement): void;
}

function createNativeReactSettingsPage(
  options: NativeReactSettingsPageOptions
): SettingPage {
  return new (class JournalitNativeSettingsPage extends SettingPage {
    constructor() {
      super();
      this.title = options.title;
    }

    display(): void {
      options.display(this.containerEl);
    }

    hide(): void {
      super.hide();
      options.hide(this.containerEl);
    }
  })();
}
