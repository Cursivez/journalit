

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { normalizePath, Notice, setIcon, TFile, TFolder } from 'obsidian';
import JournalitPlugin from '../../../main';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';
import { Button } from '../../../components/ui/Button';
import { ExternalLinkButton } from '../../../components/ui/ExternalLinkButton';
import { Select } from '../../../components/core/Select';
import { Accordion } from '../../../components/shared/Accordion';
import { Folder, X } from '../../../components/shared/icons/ObsidianIcon';
import { FolderBrowser } from '../../../components/ui/FolderBrowser';
import { DraftInput } from '../../../components/ui/DraftInput';
import { openPathChangeInstructionModal } from '../../../components/modals/PathChangeInstructionModal';
import {
  getBaseCurrencyOptions,
  CurrencyCode,
  parseCuratedCurrencyCode,
} from '../../../utils/currencyConfig';
import { useDebouncedFunction } from '../../../hooks/useDebounced';
import { useEventBus } from '../../../hooks/useEventBus';
import { TradePathUpdateUtility } from '../../../services/trade/TradePathUpdateUtility';
import { eventBus } from '../../../services/events/EventBus';
import { SettingsExporter } from '../../SettingsExporter';
import { t } from '../../../lang/helpers';
import {
  DEFAULT_TRADING_DAY_CUTOFF_TIME,
  TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION,
} from '../../../utils/tradingDayUtils';
import {
  createDefaultBackendIntegrationSettings,
  createDefaultNavigationSettings,
  DEFAULT_SETTINGS,
} from '../../types';
import { UpdateNotificationSettingsSection } from './UpdateNotificationSettingsSection';
import type {
  AccentColorSource,
  AnalyticsDateBasis,
  MaeMfeDisplayUnit,
  WeekStartDay,
  SidebarTabBehavior,
} from '../../types';
import {
  applyGalleryFolderMutation,
  galleryFoldersMatch,
  persistGalleryFolderMutation,
  type GalleryFolderMutation,
} from '../../galleryFolderMutations';
import { saveDisplayName } from '../../displayName';
import {
  isSupportedHomeBackgroundFile,
  saveHomeBackgroundFile,
} from '../../../components/home/homeBackgroundUtils';
import { JOURNALIT_SETTINGS_RESOURCES } from '../../settingsResources';
import { HomeWidgetOpacityControl } from './HomeWidgetOpacityControl';
import { ensureHomeSettings } from '../../homeSettings';
import type { JournalSettingsContext } from '../../../demo/DemoSettingsScope';
import { canApplyJournalFolderEdit } from './journalFolderEditContext';

type HomeStartupBehavior = 'always' | 'ifNone' | 'never';
type MaeMfeInputMode = 'price' | 'dollar';
const RESOLVED_SETTINGS_SAVE_PROMISE = Promise.resolve();

function parseWeekStartDay(value: string): WeekStartDay {
  switch (value) {
    case 'sunday':
    case 'monday':
    case 'tuesday':
    case 'wednesday':
    case 'thursday':
    case 'friday':
    case 'saturday':
      return value;
    default:
      return 'monday';
  }
}

function parseAnalyticsDateBasis(value: string): AnalyticsDateBasis {
  return value === 'exit' ? 'exit' : 'entry';
}

function parseHomeStartupBehavior(value: string): HomeStartupBehavior {
  switch (value) {
    case 'ifNone':
    case 'never':
      return value;
    default:
      return 'always';
  }
}

function parseMaeMfeInputMode(value: string): MaeMfeInputMode {
  return value === 'price' ? 'price' : 'dollar';
}

function parseMaeMfeDisplayUnit(value: string): MaeMfeDisplayUnit {
  return value === 'ticks' ? 'ticks' : 'dollar';
}

function parseSidebarTabBehavior(value: string): SidebarTabBehavior {
  return value === 'newTab' ? 'newTab' : 'replaceActiveTab';
}

interface GeneralTabProps {
  plugin: JournalitPlugin;
  scope?: 'general' | 'trading' | 'advanced' | 'all';
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="journalit-settings-section">
      <h4>{title}</h4>
      {children}
    </section>
  );
}

function SettingsSectionOrAccordion({
  title,
  flat,
  children,
}: {
  title: string;
  flat: boolean;
  children: React.ReactNode;
}) {
  if (flat) {
    return <SettingsSection title={title}>{children}</SettingsSection>;
  }

  return (
    <Accordion title={title} defaultExpanded={false}>
      {children}
    </Accordion>
  );
}

const dateFormatOptionKeys = [
  { value: 'DDMMYY', labelKey: 'settings.general.date-format-ddmmyy' },
  { value: 'MMDDYY', labelKey: 'settings.general.date-format-mmddyy' },
  { value: 'YYMMDD', labelKey: 'settings.general.date-format-yymmdd' },
] as const;

const weekStartDayLabelKeys: Record<WeekStartDay, Parameters<typeof t>[0]> = {
  sunday: 'calendar.day.sun',
  monday: 'calendar.day.mon',
  tuesday: 'calendar.day.tue',
  wednesday: 'calendar.day.wed',
  thursday: 'calendar.day.thu',
  friday: 'calendar.day.fri',
  saturday: 'calendar.day.sat',
};

const getDateFormatOptions = () =>
  dateFormatOptionKeys.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

const getWeekStartDayLabelMap = (): Record<WeekStartDay, string> => ({
  sunday: t(weekStartDayLabelKeys.sunday),
  monday: t(weekStartDayLabelKeys.monday),
  tuesday: t(weekStartDayLabelKeys.tuesday),
  wednesday: t(weekStartDayLabelKeys.wednesday),
  thursday: t(weekStartDayLabelKeys.thursday),
  friday: t(weekStartDayLabelKeys.friday),
  saturday: t(weekStartDayLabelKeys.saturday),
});

const breakEvenModeOptionKeys = [
  {
    value: 'fixed',
    labelKey: 'settings.general.break-even-mode-fixed',
  },
  {
    value: 'percentage_current_balance',
    labelKey: 'settings.general.break-even-mode-percent',
  },
] as const;

const analyticsDateBasisOptionKeys = [
  {
    value: 'entry',
    labelKey: 'settings.general.analytics-date-basis-entry',
  },
  {
    value: 'exit',
    labelKey: 'settings.general.analytics-date-basis-exit',
  },
] as const;

const handleBreakEvenRangeBlur = () => {
  new Notice(t('settings.general.break-even-updated'));
};

const maeMfeInputModeOptionKeys = [
  { value: 'price', labelKey: 'settings.general.mae-mfe-input-mode-price' },
  { value: 'dollar', labelKey: 'settings.general.mae-mfe-input-mode-dollar' },
] as const;

const maeMfeDisplayUnitOptionKeys = [
  { value: 'dollar', labelKey: 'settings.general.mae-mfe-display-dollar' },
  { value: 'ticks', labelKey: 'settings.general.mae-mfe-display-ticks' },
] as const;

const getBreakEvenModeOptions = () =>
  breakEvenModeOptionKeys.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

const getAnalyticsDateBasisOptions = () =>
  analyticsDateBasisOptionKeys.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

const getMaeMfeInputModeOptions = () =>
  maeMfeInputModeOptionKeys.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

const getMaeMfeDisplayUnitOptions = () =>
  maeMfeDisplayUnitOptionKeys.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

function useGeneralTabModel(props: GeneralTabProps) {
  const { plugin } = props;
  const dateFormatOptions = getDateFormatOptions();
  const weekStartDayLabelMap = getWeekStartDayLabelMap();
  const breakEvenModeOptions = getBreakEvenModeOptions();
  const analyticsDateBasisOptions = getAnalyticsDateBasisOptions();
  const maeMfeInputModeOptions = getMaeMfeInputModeOptions();
  const maeMfeDisplayUnitOptions = getMaeMfeDisplayUnitOptions();
  
  if (!plugin.settings.general) {
    plugin.settings.general = {
      currency: CurrencyCode.USD, 
    };
  }

  if (!plugin.settings.display) {
    plugin.settings.display = {
      ...DEFAULT_SETTINGS.display!,
    };
  }

  
  const [settingsVersion, setSettingsVersion] = useState(0);
  
  void settingsVersion;

  
  const [displayName, setDisplayName] = useState(
    plugin.settings.general?.displayName || ''
  );
  const [displayNameDirty, setDisplayNameDirty] = useState(false);

  
  const [journalFolderPath, setJournalFolderPath] = useState(
    plugin.settings.general?.journalFolderPath || ''
  );
  const [journalFolderResetVersion, setJournalFolderResetVersion] = useState(0);

  
  const [isUpdatingImages, setIsUpdatingImages] = useState(false);

  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  
  const [settingsExporter] = useState(() => new SettingsExporter(plugin));

  
  useEffect(() => {
    setDisplayName(plugin.settings.general?.displayName || '');
    setDisplayNameDirty(false);
  }, [plugin.settings.general?.displayName, settingsVersion]);

  
  useEffect(() => {
    setJournalFolderPath(plugin.settings.general?.journalFolderPath || '');
  }, [plugin.settings.general?.journalFolderPath, settingsVersion]);

  
  useEffect(() => {
    let needsSave = false;

    
    if (plugin.settings.trade.skipWeekends === undefined) {
      plugin.settings.trade.skipWeekends = true;
      needsSave = true;
    }

    
    if (plugin.settings.trade.weekStartDay === undefined) {
      plugin.settings.trade.weekStartDay = 'monday';
      needsSave = true;
    }

    
    if (plugin.settings.trade.tradingDayCutoffTime === undefined) {
      plugin.settings.trade.tradingDayCutoffTime =
        DEFAULT_TRADING_DAY_CUTOFF_TIME;
      plugin.settings.trade.tradingDayCutoffEndOfDayMigrationVersion =
        TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION;
      needsSave = true;
    }

    if (plugin.settings.trade.breakEvenThresholdMode === undefined) {
      plugin.settings.trade.breakEvenThresholdMode = 'fixed';
      needsSave = true;
    }

    if (plugin.settings.trade.breakEvenThresholdPercent === undefined) {
      plugin.settings.trade.breakEvenThresholdPercent = 0.05;
      needsSave = true;
    }

    if (plugin.settings.trade.analyticsDateBasis === undefined) {
      plugin.settings.trade.analyticsDateBasis = 'entry';
      needsSave = true;
    }

    
    if (plugin.settings.drc.autoCreateDRCOnNavigation === undefined) {
      plugin.settings.drc.autoCreateDRCOnNavigation = true;
      needsSave = true;
    }

    
    if (
      plugin.settings.weekly.autoCreateWeeklyReviewOnNavigation === undefined
    ) {
      plugin.settings.weekly.autoCreateWeeklyReviewOnNavigation = true;
      needsSave = true;
    }

    
    if (
      plugin.settings.monthly?.autoCreateMonthlyReviewOnNavigation === undefined
    ) {
      if (!plugin.settings.monthly) {
        plugin.settings.monthly = {
          reviewQuestions: [],
          customTimeframes: [],
          autoCreateMonthlyReviewOnNavigation: true,
        };
      } else {
        plugin.settings.monthly.autoCreateMonthlyReviewOnNavigation = true;
      }
      needsSave = true;
    }

    if (needsSave) {
      
      void plugin.saveSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run only once on mount to initialize default settings
  }, []);

  

  const weekStartDayOptions = (
    [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ] as WeekStartDay[]
  ).map((day) => ({
    value: day,
    label: weekStartDayLabelMap[day],
  }));

  
  const handleAutoOpenToggle = async (newValue: boolean) => {
    
    plugin.settings.trade.autoOpenCreatedTrades = newValue;
    await plugin.saveSettings();

    
    setSettingsVersion((prev) => prev + 1);

    new Notice(
      t('settings.general.auto-open-toggled', {
        status: newValue
          ? t('settings.general.enabled')
          : t('settings.general.disabled'),
      })
    );
  };

  
  const handleDateFormatChange = async (newValue: string) => {
    
    plugin.settings.trade.dateFormat = newValue;
    await plugin.saveSettings();

    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'date-format',
    });

    new Notice(t('settings.general.date-format-changed', { format: newValue }));
  };

  
  const handleSkipWeekendsToggle = async (newValue: boolean) => {
    
    plugin.settings.trade.skipWeekends = newValue;
    await plugin.saveSettings();

    
    setSettingsVersion((prev) => prev + 1);
    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'skip-weekends',
    });

    new Notice(
      t('settings.general.skip-weekends-toggled', {
        status: newValue
          ? t('settings.general.enabled')
          : t('settings.general.disabled'),
      })
    );
  };

  const handleWeekStartDayChange = async (newValue: string) => {
    const weekStartDay = parseWeekStartDay(newValue);
    plugin.settings.trade.weekStartDay = weekStartDay;
    await plugin.saveSettings();

    setSettingsVersion((prev) => prev + 1);
    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'week-start',
    });

    new Notice(
      t('settings.general.week-start-changed', {
        day: weekStartDayLabelMap[weekStartDay],
      })
    );
  };

  const handleAnalyticsDateBasisChange = async (newValue: string) => {
    const analyticsDateBasis = parseAnalyticsDateBasis(newValue);
    plugin.settings.trade.analyticsDateBasis = analyticsDateBasis;
    await plugin.saveSettings();

    setSettingsVersion((prev) => prev + 1);
    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'analytics-date-basis',
    });

    new Notice(
      t('settings.general.analytics-date-basis-changed', {
        basis:
          analyticsDateBasis === 'exit'
            ? t('settings.general.analytics-date-basis-exit')
            : t('settings.general.analytics-date-basis-entry'),
      })
    );
  };

  
  const handleDollarValueInputToggle = async (newValue: boolean) => {
    plugin.settings.trade.useDollarValueInput = newValue;
    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);
    new Notice(
      t('settings.general.dollar-value-input-toggled', {
        mode: newValue
          ? t('settings.general.dollar-value')
          : t('settings.general.quantity'),
      })
    );
  };

  
  const handleTradingDayCutoffTimeChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;

    
    plugin.settings.trade.tradingDayCutoffTime = newValue;
    plugin.settings.trade.tradingDayCutoffEndOfDayMigrationVersion =
      TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION;
    await plugin.saveSettings();

    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'trading-day-cutoff',
    });

    new Notice(t('settings.general.cutoff-time-changed', { time: newValue }));
  };

  
  const handleCurrencyChange = async (newValue: string) => {
    const currencyCode = parseCuratedCurrencyCode(newValue);

    
    if (!plugin.settings.general) {
      plugin.settings.general = {
        currency: currencyCode,
      };
    } else {
      plugin.settings.general.currency = currencyCode;
    }

    
    try {
      await plugin.saveSettings();

      
      const currencyChangeEvent = new CustomEvent(
        'journalit-currency-changed',
        {
          detail: { currency: currencyCode },
        }
      );
      window.dispatchEvent(currencyChangeEvent);
      eventBus.publish('settings:changed', {
        section: 'general',
        source: 'currency',
      });

      
      setSettingsVersion((prev) => prev + 1);

      
      new Notice(
        '✓ ' +
          t('settings.general.currency-changed', { currency: currencyCode })
      );
    } catch (error) {
      console.error('Failed to save currency setting:', error);
      new Notice('❌ ' + t('settings.general.currency-save-failed'), 5000);

      
      setSettingsVersion((prev) => prev + 1);
    }
  };

  const handlePrivacyModeToggle = async (newValue: boolean) => {
    plugin.settings.display = {
      ...(plugin.settings.display ?? DEFAULT_SETTINGS.display!),
      privacyMode: newValue,
    };

    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);
    eventBus.publish('settings:changed', {
      section: 'display',
      source: 'privacy-mode',
    });
  };

  
  const handleDisplayNameInputChange = (newValue: string) => {
    setDisplayName(newValue);
    setDisplayNameDirty(
      newValue !== (plugin.settings.general?.displayName || '')
    );
  };

  
  const handleDisplayNameConfirm = async () => {
    try {
      await saveDisplayName(plugin, displayName);
      setDisplayNameDirty(false);

      new Notice(
        displayName
          ? t('settings.general.display-name-saved', { name: displayName })
          : t('settings.general.display-name-cleared')
      );
    } catch (error) {
      console.error('Failed to save display name:', error);
      new Notice('❌ ' + t('settings.general.display-name-save-failed'), 5000);
    }
  };

  
  const handleDisplayNameCancel = () => {
    setDisplayName(plugin.settings.general?.displayName || '');
    setDisplayNameDirty(false);
  };

  
  const applyJournalFolderPathChange = useDebouncedFunction(
    async (request: {
      newPath: string;
      originContext: JournalSettingsContext;
    }) => {
      const { newPath, originContext } = request;
      const folderPathService = plugin.serviceManager?.getFolderPathService();
      const currentPath = folderPathService?.journalFolderPath || '!Journalit';
      const contextChanged = () =>
        !folderPathService ||
        !canApplyJournalFolderEdit(originContext, folderPathService.context);
      if (contextChanged()) {
        new Notice(t('sample.notice.folder-locked'), 5000);
        setJournalFolderPath(currentPath);
        setJournalFolderResetVersion((version) => version + 1);
        return;
      }

      
      const backendService =
        await plugin.serviceManager.getBackendIntegrationService();
      if (backendService?.getIsSyncing()) {
        new Notice(t('notice.error.cannot-change-folder-during-sync'), 5000);
        
        setJournalFolderPath(currentPath);
        setJournalFolderResetVersion((version) => version + 1);
        return;
      }

      if (newPath === currentPath) {
        return; 
      }

      
      let hasExistingTrades = false;
      try {
        const vault = plugin.app.vault;
        const allFiles = vault.getMarkdownFiles();
        const effectiveCurrentPath = currentPath || '!Journalit';
        hasExistingTrades = allFiles.some((file) =>
          file.path.startsWith(effectiveCurrentPath)
        );
      } catch (error) {
        console.warn('Failed to check for existing trades:', error);
      }

      
      const effectiveCurrentPath = currentPath || '!Journalit';

      
      let effectiveNewPath: string;
      if (!newPath || newPath.trim() === '') {
        
        effectiveNewPath = '!Journalit';
      } else {
        
        const normalizedNewPath = newPath.endsWith('/')
          ? newPath.slice(0, -1)
          : newPath;
        effectiveNewPath = `${normalizedNewPath}/!Journalit`;
      }

      if (contextChanged()) {
        setJournalFolderPath(currentPath);
        setJournalFolderResetVersion((version) => version + 1);
        return;
      }

      openPathChangeInstructionModal(
        plugin.app,
        plugin,
        effectiveCurrentPath,
        effectiveNewPath,
        hasExistingTrades,
        async () => {
          
          try {
            if (
              !folderPathService ||
              !canApplyJournalFolderEdit(
                originContext,
                folderPathService.context
              )
            ) {
              throw new Error('Journal context changed before folder update');
            }
            await folderPathService.updatePath(effectiveNewPath);

            
            eventBus.publish('settings:changed', { source: 'user-input' });

            
            setJournalFolderPath(effectiveNewPath);
            setSettingsVersion((prev) => prev + 1);

            new Notice(
              t('settings.general.folder-updated', { path: effectiveNewPath })
            );
          } catch (error) {
            console.error('Failed to update journal folder path:', error);
            new Notice(
              t('settings.general.folder-update-failed', {
                error: error instanceof Error ? error.message : String(error),
              })
            );
            setJournalFolderPath(currentPath); 
            setJournalFolderResetVersion((version) => version + 1);
          }
        },
        () => {
          
          setJournalFolderPath(currentPath);
          setJournalFolderResetVersion((version) => version + 1);
        }
      );
    },
    2000, 
    { leading: false, trailing: true }
  );

  const handleJournalFolderPathChange = (newPath: string) => {
    const originContext = plugin.serviceManager.getFolderPathService().context;
    applyJournalFolderPathChange({ newPath, originContext });
  };

  
  const handleHomeStartupBehaviorChange = async (newValue: string) => {
    
    if (!plugin.settings.general) {
      plugin.settings.general = {
        currency: CurrencyCode.USD,
        homeStartupBehavior: parseHomeStartupBehavior(newValue),
      };
    } else {
      plugin.settings.general.homeStartupBehavior =
        parseHomeStartupBehavior(newValue);
    }

    await plugin.saveSettings();

    
    setSettingsVersion((prev) => prev + 1);

    const labels = {
      always: t('settings.general.home-auto-open-always'),
      ifNone: t('settings.general.home-auto-open-ifnone'),
      never: t('settings.general.home-auto-open-never'),
    };
    new Notice(
      t('settings.general.home-startup-changed', {
        behavior: labels[parseHomeStartupBehavior(newValue)],
      })
    );
  };

  
  const handleFilterRecentItemsToggle = async (newValue: boolean) => {
    
    if (!plugin.settings.home) {
      plugin.settings.home = {
        layouts: {},
        activeLayout: 'Default',
        recentItems: [],
        filterRecentItemsToJournalit: newValue,
      };
    } else {
      plugin.settings.home.filterRecentItemsToJournalit = newValue;
    }

    await plugin.saveSettings();

    
    const recentItems = plugin.uiStateManager.getState().recentItems || [];
    eventBus.publish('recent-items:changed', {
      recentItems: recentItems.map((item) => ({
        path: item.path || item.viewType || '',
        timestamp: new Date(item.openedAt).getTime(),
        type: item.type,
      })),
    });

    setSettingsVersion((prev) => prev + 1);

    new Notice(
      t('settings.general.filter-recent-toggled', {
        status: newValue
          ? t('settings.general.enabled')
          : t('settings.general.disabled'),
      })
    );
  };

  const applyBreakEvenSettingsUpdate = async () => {
    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);
    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'break-even-range',
    });

    if (plugin.tradeService) {
      await plugin.tradeService.clearCache();
    }
    if (plugin.accountPageService) {
      await plugin.accountPageService.refreshAllAccountData();
    }
  };

  const handleBreakEvenModeChange = async (newValue: string) => {
    plugin.settings.trade.breakEvenThresholdMode =
      newValue === 'percentage_current_balance'
        ? 'percentage_current_balance'
        : 'fixed';

    if (
      plugin.settings.trade.breakEvenThresholdMode ===
        'percentage_current_balance' &&
      plugin.settings.trade.breakEvenThresholdPercent === undefined
    ) {
      plugin.settings.trade.breakEvenThresholdPercent = 0.05;
    }

    await applyBreakEvenSettingsUpdate();
    new Notice(t('settings.general.break-even-updated'));
  };

  
  const handleBreakEvenMinChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    
    
    plugin.settings.trade.breakEvenRangeMin = -Math.abs(value);

    await applyBreakEvenSettingsUpdate();
  };

  
  const handleBreakEvenMaxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    plugin.settings.trade.breakEvenRangeMax = Math.abs(value);

    await applyBreakEvenSettingsUpdate();
  };

  const handleBreakEvenPercentChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = Number(event.target.value);
    const value = Number.isFinite(rawValue) ? Math.max(0, rawValue) : 0;
    plugin.settings.trade.breakEvenThresholdPercent = value;

    await applyBreakEvenSettingsUpdate();
  };

  

  
  const handleDefaultRiskAmountChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value === '' ? 0 : Number(event.target.value);
    plugin.settings.trade.defaultRiskAmount = value;
    await plugin.saveSettings();
    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'default-risk-amount',
    });
    setSettingsVersion((prev) => prev + 1);
  };

  
  const handleDisplayRMultiplesToggle = async (newValue: boolean) => {
    plugin.settings.trade.displayRMultiples = newValue;
    await plugin.saveSettings();
    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'display-r-multiples',
    });
    setSettingsVersion((prev) => prev + 1);
    new Notice(
      t('settings.general.display-r-multiples-toggled', {
        status: newValue
          ? t('settings.general.enabled')
          : t('settings.general.disabled'),
      })
    );
  };

  const handleHideDollarAmountsInSharesToggle = async (newValue: boolean) => {
    plugin.settings.display = {
      ...(plugin.settings.display ?? DEFAULT_SETTINGS.display!),
      hideDollarAmountsInShares: newValue,
    };
    await plugin.saveSettings();
    eventBus.publish('settings:changed', {
      section: 'display',
      source: 'hide-dollar-amounts-in-shares',
    });
    setSettingsVersion((prev) => prev + 1);
  };

  const handleIncludeCopyAccountsToggle = async (newValue: boolean) => {
    plugin.settings.trade.includeCopyAccountsInAllAccountsAnalytics = newValue;
    await plugin.saveSettings();
    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'include-copy-accounts-analytics',
    });
    setSettingsVersion((prev) => prev + 1);
    new Notice(
      t('settings.general.include-copy-accounts-toggled', {
        status: newValue
          ? t('settings.general.enabled')
          : t('settings.general.disabled'),
      })
    );
  };

  const handleIncludeUnrealizedPnLToggle = async (newValue: boolean) => {
    plugin.settings.trade.includeUnrealizedPnLInCalculations = newValue;
    await plugin.saveSettings();
    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'include-unrealized-pnl',
    });
    setSettingsVersion((prev) => prev + 1);
    new Notice(
      t('settings.general.include-unrealized-pnl-toggled', {
        status: newValue
          ? t('settings.general.enabled')
          : t('settings.general.disabled'),
      })
    );
  };

  const handleMaeMfeInputModeChange = async (newValue: string) => {
    plugin.settings.trade.maeMfeInputMode = parseMaeMfeInputMode(newValue);
    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);
  };

  const handleMaeMfeDisplayUnitChange = async (newValue: string) => {
    plugin.settings.trade.maeMfeDisplayUnit = parseMaeMfeDisplayUnit(newValue);
    await plugin.saveSettings();
    eventBus.publish('settings:changed', {
      section: 'trade',
      source: 'mae-mfe-display-unit',
    });
    setSettingsVersion((prev) => prev + 1);
  };

  
  const docsIconRef = useRef<HTMLSpanElement>(null);
  const discordIconRef = useRef<HTMLSpanElement>(null);
  const githubIconRef = useRef<HTMLSpanElement>(null);

  
  useEffect(() => {
    const iconTargets: Array<
      [React.RefObject<HTMLSpanElement | null>, string]
    > = [
      [docsIconRef, 'book-open'],
      [discordIconRef, 'messages-square'],
      [githubIconRef, 'github'],
    ];
    for (const [ref, icon] of iconTargets) {
      if (ref.current) setIcon(ref.current, icon);
    }
  }, []);

  return {
    analyticsDateBasisOptions,
    breakEvenModeOptions,
    dateFormatOptions,
    discordIconRef,
    displayName,
    displayNameDirty,
    docsIconRef,
    githubIconRef,
    handleAnalyticsDateBasisChange,
    handleAutoOpenToggle,
    handleBreakEvenMaxChange,
    handleBreakEvenMinChange,
    handleBreakEvenModeChange,
    handleBreakEvenPercentChange,
    handleBreakEvenRangeBlur,
    handleIncludeCopyAccountsToggle,
    handleIncludeUnrealizedPnLToggle,
    handleCurrencyChange,
    handleDateFormatChange,
    handleDefaultRiskAmountChange,
    handleDisplayNameCancel,
    handleDisplayNameConfirm,
    handleDisplayNameInputChange,
    handleDisplayRMultiplesToggle,
    handleHideDollarAmountsInSharesToggle,
    handleDollarValueInputToggle,
    handleFilterRecentItemsToggle,
    handleHomeStartupBehaviorChange,
    handleJournalFolderPathChange,
    handleMaeMfeDisplayUnitChange,
    handleMaeMfeInputModeChange,
    handlePrivacyModeToggle,
    handleSkipWeekendsToggle,
    handleTradingDayCutoffTimeChange,
    handleWeekStartDayChange,
    isExporting,
    isImporting,
    isResetting,
    isUpdatingImages,
    journalFolderPath,
    journalFolderResetVersion,
    maeMfeDisplayUnitOptions,
    maeMfeInputModeOptions,
    plugin,
    setIsExporting,
    setIsImporting,
    setIsResetting,
    setIsUpdatingImages,
    setSettingsVersion,
    settingsExporter,
    weekStartDayOptions,
  };
}

type GeneralTabModel = ReturnType<typeof useGeneralTabModel>;

function GeneralRiskDisplaySettings({
  plugin,
  handleDefaultRiskAmountChange,
  handleDisplayRMultiplesToggle,
  handleHideDollarAmountsInSharesToggle,
  handleIncludeCopyAccountsToggle,
  handleIncludeUnrealizedPnLToggle,
  handleMaeMfeDisplayUnitChange,
  handleMaeMfeInputModeChange,
  maeMfeDisplayUnitOptions,
  maeMfeInputModeOptions,
}: Pick<
  GeneralTabModel,
  | 'plugin'
  | 'handleDefaultRiskAmountChange'
  | 'handleDisplayRMultiplesToggle'
  | 'handleHideDollarAmountsInSharesToggle'
  | 'handleIncludeCopyAccountsToggle'
  | 'handleIncludeUnrealizedPnLToggle'
  | 'handleMaeMfeDisplayUnitChange'
  | 'handleMaeMfeInputModeChange'
  | 'maeMfeDisplayUnitOptions'
  | 'maeMfeInputModeOptions'
>) {
  return (
    <>
      
      <div className="setting-item journalit-settings-divider">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.default-risk')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.default-risk-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <DraftInput
            type="number"
            value={plugin.settings.trade.defaultRiskAmount ?? 0}
            onChange={(event) => void handleDefaultRiskAmountChange(event)}
            onFocus={(e) => {
              const numValue = parseFloat(e.target.value);
              if (
                numValue === 0 ||
                e.target.value === '0' ||
                /^0\.0+$/.test(e.target.value)
              ) {
                e.target.select();
              }
            }}
            placeholder="0.00"
            aria-label={t('settings.general.default-risk-aria')}
            className="setting-input journalit-settings-input journalit-settings-input--compact"
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.display-r-multiples')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.display-r-multiples-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={plugin.settings.trade.displayRMultiples ?? false}
            onChange={handleDisplayRMultiplesToggle}
            id="display-r-multiples-toggle"
            ariaLabel={t('settings.general.display-r-multiples-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.hide-dollar-amounts-in-shares')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.hide-dollar-amounts-in-shares-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={
              plugin.settings.display?.hideDollarAmountsInShares ?? false
            }
            onChange={handleHideDollarAmountsInSharesToggle}
            disabled={!plugin.settings.trade.displayRMultiples}
            id="hide-dollar-amounts-in-shares-toggle"
            ariaLabel={t('settings.general.hide-dollar-amounts-in-shares')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.include-copy-accounts-analytics')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.include-copy-accounts-analytics-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={
              plugin.settings.trade.includeCopyAccountsInAllAccountsAnalytics ??
              false
            }
            onChange={handleIncludeCopyAccountsToggle}
            id="include-copy-accounts-analytics-toggle"
            ariaLabel={t(
              'settings.general.include-copy-accounts-analytics-aria'
            )}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.include-unrealized-pnl')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.include-unrealized-pnl-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={
              plugin.settings.trade.includeUnrealizedPnLInCalculations ?? false
            }
            onChange={handleIncludeUnrealizedPnLToggle}
            id="include-unrealized-pnl-toggle"
            ariaLabel={t('settings.general.include-unrealized-pnl-aria')}
          />
        </div>
      </div>

      
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.mae-mfe-input-mode')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.mae-mfe-input-mode-desc')}
            <br />
            <strong>
              {t('settings.general.mae-mfe-input-mode-desc-price')}
            </strong>
            <br />
            <strong>
              {t('settings.general.mae-mfe-input-mode-desc-dollar')}
            </strong>
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            value={plugin.settings.trade?.maeMfeInputMode ?? 'dollar'}
            onChange={handleMaeMfeInputModeChange}
            options={maeMfeInputModeOptions}
            id="mae-mfe-input-mode-dropdown"
            aria-label={t('settings.general.mae-mfe-input-mode-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.mae-mfe-display-unit')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.mae-mfe-display-unit-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            value={plugin.settings.trade?.maeMfeDisplayUnit ?? 'dollar'}
            onChange={handleMaeMfeDisplayUnitChange}
            options={maeMfeDisplayUnitOptions}
            id="mae-mfe-display-unit-dropdown"
            aria-label={t('settings.general.mae-mfe-display-unit-aria')}
          />
        </div>
      </div>
    </>
  );
}

function GeneralBreakEvenSettings({
  plugin,
  handleBreakEvenModeChange,
  breakEvenModeOptions,
  handleBreakEvenPercentChange,
  handleBreakEvenRangeBlur,
  handleBreakEvenMinChange,
  handleBreakEvenMaxChange,
}: Pick<
  GeneralTabModel,
  | 'plugin'
  | 'handleBreakEvenModeChange'
  | 'breakEvenModeOptions'
  | 'handleBreakEvenPercentChange'
  | 'handleBreakEvenRangeBlur'
  | 'handleBreakEvenMinChange'
  | 'handleBreakEvenMaxChange'
>) {
  return (
    <>
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.break-even-threshold-mode')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.break-even-threshold-mode-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            value={plugin.settings.trade.breakEvenThresholdMode ?? 'fixed'}
            onChange={handleBreakEvenModeChange}
            options={breakEvenModeOptions}
            id="break-even-threshold-mode-dropdown"
            aria-label={t('settings.general.break-even-threshold-mode')}
          />
        </div>
      </div>

      {plugin.settings.trade.breakEvenThresholdMode ===
      'percentage_current_balance' ? (
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.general.break-even-percent')}
            </div>
            <div className="setting-item-description">
              {t('settings.general.break-even-percent-desc')}
            </div>
          </div>
          <div className="setting-item-control journalit-settings-range">
            <DraftInput
              type="number"
              min="0"
              step="0.01"
              value={plugin.settings.trade.breakEvenThresholdPercent ?? 0}
              onChange={(event) => void handleBreakEvenPercentChange(event)}
              onBlur={() => void handleBreakEvenRangeBlur()}
              onFocus={(e) => {
                const numValue = parseFloat(e.target.value);
                if (
                  numValue === 0 ||
                  e.target.value === '0' ||
                  /^0\.0+$/.test(e.target.value)
                ) {
                  e.target.select();
                }
              }}
              placeholder={t('settings.general.break-even-percent-placeholder')}
              aria-label={t('settings.general.break-even-percent-aria')}
              className="setting-input journalit-settings-input journalit-settings-input--compact"
            />
            <span className="journalit-settings-muted-text">%</span>
          </div>
        </div>
      ) : (
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.general.break-even-range')}
            </div>
            <div className="setting-item-description">
              {t('settings.general.break-even-range-desc')}
            </div>
          </div>
          <div className="setting-item-control journalit-settings-range">
            <DraftInput
              type="number"
              value={plugin.settings.trade.breakEvenRangeMin ?? 0}
              onChange={(event) => void handleBreakEvenMinChange(event)}
              onBlur={() => void handleBreakEvenRangeBlur()}
              onFocus={(e) => {
                const numValue = parseFloat(e.target.value);
                if (
                  numValue === 0 ||
                  e.target.value === '0' ||
                  /^0\.0+$/.test(e.target.value)
                ) {
                  e.target.select();
                }
              }}
              placeholder={t('settings.general.break-even-min-placeholder')}
              aria-label={t('settings.general.break-even-min-aria')}
              className="setting-input journalit-settings-input journalit-settings-input--compact"
            />
            <span className="journalit-settings-muted-text">
              {t('settings.general.break-even-to')}
            </span>
            <DraftInput
              type="number"
              value={plugin.settings.trade.breakEvenRangeMax ?? 0}
              onChange={(event) => void handleBreakEvenMaxChange(event)}
              onBlur={() => void handleBreakEvenRangeBlur()}
              onFocus={(e) => {
                const numValue = parseFloat(e.target.value);
                if (
                  numValue === 0 ||
                  e.target.value === '0' ||
                  /^0\.0+$/.test(e.target.value)
                ) {
                  e.target.select();
                }
              }}
              placeholder={t('settings.general.break-even-max-placeholder')}
              aria-label={t('settings.general.break-even-max-aria')}
              className="setting-input journalit-settings-input journalit-settings-input--compact"
            />
          </div>
        </div>
      )}
    </>
  );
}

function GeneralTradeBasicsSettings({
  plugin,
  handleAutoOpenToggle,
  handleDateFormatChange,
  dateFormatOptions,
  setSettingsVersion,
  handleSkipWeekendsToggle,
  handleWeekStartDayChange,
  weekStartDayOptions,
  handleAnalyticsDateBasisChange,
  analyticsDateBasisOptions,
  handleDollarValueInputToggle,
  handleTradingDayCutoffTimeChange,
}: Pick<
  GeneralTabModel,
  | 'plugin'
  | 'handleAutoOpenToggle'
  | 'handleDateFormatChange'
  | 'dateFormatOptions'
  | 'setSettingsVersion'
  | 'handleSkipWeekendsToggle'
  | 'handleWeekStartDayChange'
  | 'weekStartDayOptions'
  | 'handleAnalyticsDateBasisChange'
  | 'analyticsDateBasisOptions'
  | 'handleDollarValueInputToggle'
  | 'handleTradingDayCutoffTimeChange'
>) {
  return (
    <>
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.auto-open-trades')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.auto-open-trades-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={plugin.settings.trade.autoOpenCreatedTrades || false}
            onChange={handleAutoOpenToggle}
            id="auto-open-trades-toggle"
            ariaLabel={t('settings.general.auto-open-trades-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.date-format')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.date-format-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            value={plugin.settings.trade.dateFormat}
            onChange={handleDateFormatChange}
            options={dateFormatOptions}
            id="date-format-dropdown"
            aria-label={t('settings.general.date-format-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.use-24-hour-time')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.use-24-hour-time-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={plugin.settings.trade.use24HourTime ?? false}
            onChange={async (checked: boolean) => {
              plugin.settings.trade.use24HourTime = checked;
              await plugin.saveSettings();
              setSettingsVersion((prev) => prev + 1);
            }}
            id="use-24-hour-time-toggle"
            ariaLabel={t('settings.general.use-24-hour-time-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.show-seconds')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.show-seconds-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={plugin.settings.trade.showSeconds ?? false}
            onChange={async (checked: boolean) => {
              plugin.settings.trade.showSeconds = checked;
              await plugin.saveSettings();
              setSettingsVersion((prev) => prev + 1);
            }}
            id="show-trade-seconds-toggle"
            ariaLabel={t('settings.general.show-seconds-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.skip-weekends')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.skip-weekends-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={plugin.settings.trade.skipWeekends ?? true}
            onChange={handleSkipWeekendsToggle}
            id="skip-weekends-toggle"
            ariaLabel={t('settings.general.skip-weekends-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.week-start')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.week-start-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            value={plugin.settings.trade.weekStartDay ?? 'monday'}
            onChange={handleWeekStartDayChange}
            options={weekStartDayOptions}
            id="week-start-day-dropdown"
            aria-label={t('settings.general.week-start-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.analytics-date-basis')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.analytics-date-basis-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            value={plugin.settings.trade.analyticsDateBasis ?? 'entry'}
            onChange={handleAnalyticsDateBasisChange}
            options={analyticsDateBasisOptions}
            id="analytics-date-basis-dropdown"
            aria-label={t('settings.general.analytics-date-basis-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.dollar-value-input')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.dollar-value-input-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={plugin.settings.trade.useDollarValueInput ?? false}
            onChange={handleDollarValueInputToggle}
            id="dollar-value-input-toggle"
            ariaLabel={t('settings.general.dollar-value-input-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.cutoff-time')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.cutoff-time-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <input
            type="time"
            value={
              plugin.settings.trade.tradingDayCutoffTime ??
              DEFAULT_TRADING_DAY_CUTOFF_TIME
            }
            onChange={(event) => void handleTradingDayCutoffTimeChange(event)}
            id="trading-day-cutoff-time"
            aria-label={t('settings.general.cutoff-time-aria')}
            className="setting-input time-input journalit-settings-input journalit-settings-input--time"
          />
        </div>
      </div>
    </>
  );
}

function GeneralTradeSettingsSection({
  plugin,
  handleAutoOpenToggle,
  handleDateFormatChange,
  dateFormatOptions,
  setSettingsVersion,
  handleSkipWeekendsToggle,
  handleWeekStartDayChange,
  weekStartDayOptions,
  handleAnalyticsDateBasisChange,
  analyticsDateBasisOptions,
  handleDollarValueInputToggle,
  handleTradingDayCutoffTimeChange,
  handleBreakEvenModeChange,
  breakEvenModeOptions,
  handleBreakEvenPercentChange,
  handleBreakEvenRangeBlur,
  handleBreakEvenMinChange,
  handleBreakEvenMaxChange,
  handleDefaultRiskAmountChange,
  handleDisplayRMultiplesToggle,
  handleHideDollarAmountsInSharesToggle,
  handleIncludeCopyAccountsToggle,
  handleIncludeUnrealizedPnLToggle,
  handleMaeMfeDisplayUnitChange,
  handleMaeMfeInputModeChange,
  maeMfeDisplayUnitOptions,
  maeMfeInputModeOptions,
  flat = false,
}: Pick<
  GeneralTabModel,
  | 'plugin'
  | 'handleAutoOpenToggle'
  | 'handleDateFormatChange'
  | 'dateFormatOptions'
  | 'setSettingsVersion'
  | 'handleSkipWeekendsToggle'
  | 'handleWeekStartDayChange'
  | 'weekStartDayOptions'
  | 'handleAnalyticsDateBasisChange'
  | 'analyticsDateBasisOptions'
  | 'handleDollarValueInputToggle'
  | 'handleTradingDayCutoffTimeChange'
  | 'handleBreakEvenModeChange'
  | 'breakEvenModeOptions'
  | 'handleBreakEvenPercentChange'
  | 'handleBreakEvenRangeBlur'
  | 'handleBreakEvenMinChange'
  | 'handleBreakEvenMaxChange'
  | 'handleDefaultRiskAmountChange'
  | 'handleDisplayRMultiplesToggle'
  | 'handleHideDollarAmountsInSharesToggle'
  | 'handleIncludeCopyAccountsToggle'
  | 'handleIncludeUnrealizedPnLToggle'
  | 'handleMaeMfeDisplayUnitChange'
  | 'handleMaeMfeInputModeChange'
  | 'maeMfeDisplayUnitOptions'
  | 'maeMfeInputModeOptions'
> & { flat?: boolean }) {
  const tradeBasics = (
    <GeneralTradeBasicsSettings
      plugin={plugin}
      handleAutoOpenToggle={handleAutoOpenToggle}
      handleDateFormatChange={handleDateFormatChange}
      dateFormatOptions={dateFormatOptions}
      setSettingsVersion={setSettingsVersion}
      handleSkipWeekendsToggle={handleSkipWeekendsToggle}
      handleWeekStartDayChange={handleWeekStartDayChange}
      weekStartDayOptions={weekStartDayOptions}
      handleAnalyticsDateBasisChange={handleAnalyticsDateBasisChange}
      analyticsDateBasisOptions={analyticsDateBasisOptions}
      handleDollarValueInputToggle={handleDollarValueInputToggle}
      handleTradingDayCutoffTimeChange={handleTradingDayCutoffTimeChange}
    />
  );

  const breakEven = (
    <GeneralBreakEvenSettings
      plugin={plugin}
      handleBreakEvenModeChange={handleBreakEvenModeChange}
      breakEvenModeOptions={breakEvenModeOptions}
      handleBreakEvenPercentChange={handleBreakEvenPercentChange}
      handleBreakEvenRangeBlur={handleBreakEvenRangeBlur}
      handleBreakEvenMinChange={handleBreakEvenMinChange}
      handleBreakEvenMaxChange={handleBreakEvenMaxChange}
    />
  );

  const riskDisplay = (
    <GeneralRiskDisplaySettings
      plugin={plugin}
      handleDefaultRiskAmountChange={handleDefaultRiskAmountChange}
      handleDisplayRMultiplesToggle={handleDisplayRMultiplesToggle}
      handleHideDollarAmountsInSharesToggle={
        handleHideDollarAmountsInSharesToggle
      }
      handleIncludeCopyAccountsToggle={handleIncludeCopyAccountsToggle}
      handleIncludeUnrealizedPnLToggle={handleIncludeUnrealizedPnLToggle}
      handleMaeMfeDisplayUnitChange={handleMaeMfeDisplayUnitChange}
      handleMaeMfeInputModeChange={handleMaeMfeInputModeChange}
      maeMfeDisplayUnitOptions={maeMfeDisplayUnitOptions}
      maeMfeInputModeOptions={maeMfeInputModeOptions}
    />
  );

  if (flat) {
    return (
      <>
        <SettingsSection title={t('settings.general.trade-settings')}>
          {tradeBasics}
        </SettingsSection>
        <SettingsSection
          title={t('settings.general.break-even-threshold-mode')}
        >
          {breakEven}
        </SettingsSection>
        <SettingsSection title={t('form.section.risk-management')}>
          {riskDisplay}
        </SettingsSection>
        <GalleryFoldersSettingsSection plugin={plugin} />
      </>
    );
  }

  return (
    <Accordion
      title={t('settings.general.trade-settings')}
      defaultExpanded={true}
    >
      {tradeBasics}
      {breakEven}
      {riskDisplay}
    </Accordion>
  );
}

export function GalleryFoldersSettingsControl({
  plugin,
}: Pick<GeneralTabModel, 'plugin'>) {
  const [folders, setFolders] = useState(
    () => plugin.settings.trade.galleryFolders ?? []
  );
  const foldersRef = useRef(folders);
  const saveQueueRef = useRef<Promise<void>>(RESOLVED_SETTINGS_SAVE_PROMISE);
  const latestMutationIdRef = useRef(0);
  const pendingSavesRef = useRef(0);
  const [selectedPath, setSelectedPath] = useState('');
  const [folderBrowserKey, setFolderBrowserKey] = useState(0);

  useEventBus('settings:changed', (payload) => {
    if (payload.source === 'gallery-folders') return;
    
    
    
    
    if (pendingSavesRef.current > 0) return;
    const canonicalFolders = [...plugin.settings.trade.galleryFolders];
    foldersRef.current = canonicalFolders;
    setFolders(canonicalFolders);
  });

  const saveFolders = (mutation: GalleryFolderMutation): Promise<void> => {
    const mutationId = ++latestMutationIdRef.current;
    const folderIdentity = plugin.app.vault.getAbstractFileByPath(
      mutation.path
    );
    const queuedMutation =
      folderIdentity instanceof TFolder
        ? { ...mutation, getCurrentPath: () => folderIdentity.path }
        : mutation;
    const optimisticFolders = applyGalleryFolderMutation(
      foldersRef.current,
      queuedMutation
    );
    foldersRef.current = optimisticFolders;
    setFolders(optimisticFolders);
    pendingSavesRef.current += 1;
    const save = saveQueueRef.current.then(async () => {
      try {
        const result = await persistGalleryFolderMutation({
          currentFolders: plugin.settings.trade.galleryFolders,
          mutation: queuedMutation,
          setCanonicalFolders: (folders) => {
            plugin.settings.trade.galleryFolders = folders;
          },
          getCanonicalFolders: () => plugin.settings.trade.galleryFolders,
          saveSettings: () => plugin.saveSettings(),
          onTargetApplied: (targetFolders) => {
            if (mutationId === latestMutationIdRef.current) {
              foldersRef.current = targetFolders;
              setFolders(targetFolders);
            }
          },
        });
        if (result.success) {
          eventBus.publish('settings:changed', {
            section: 'trade',
            source: 'gallery-folders',
          });
        } else {
          console.error('Failed to save gallery folders:', result.error);
          const mutationIsCurrent =
            mutationId === latestMutationIdRef.current &&
            galleryFoldersMatch(foldersRef.current, result.targetFolders);
          if (mutationIsCurrent) {
            foldersRef.current = result.folders;
            setFolders(result.folders);
          }
          new Notice(t('settings.gallery-folders.save-failed'), 5000);
        }
      } finally {
        pendingSavesRef.current -= 1;
      }
    });
    saveQueueRef.current = save.catch(() => undefined);
    return save;
  };

  const handleAdd = async () => {
    const normalized = normalizePath(selectedPath.trim());
    const currentFolders = foldersRef.current;
    if (!normalized || currentFolders.includes(normalized)) return;
    if (plugin.app.vault.getAbstractFileByPath(normalized) instanceof TFile) {
      new Notice(t('settings.gallery-folders.not-a-folder'), 5000);
      return;
    }
    const save = saveFolders({ kind: 'add', path: normalized });
    setSelectedPath('');
    setFolderBrowserKey((current) => current + 1);
    await save;
  };

  const handleRemove = (folderPath: string) => {
    void saveFolders({ kind: 'remove', path: folderPath });
  };

  return (
    <>
      {folders.length > 0 && (
        <div className="journalit-gallery-folders-list">
          {folders.map((folderPath) => (
            <div className="journalit-gallery-folders-row" key={folderPath}>
              <Folder
                aria-hidden="true"
                className="journalit-gallery-folders-row__icon"
                size={15}
              />
              <span className="journalit-gallery-folders-row__path">
                {folderPath}
              </span>
              <button
                aria-label={t('settings.gallery-folders.remove-aria', {
                  path: folderPath,
                })}
                className="clickable-icon journalit-gallery-folders-row__remove"
                onClick={() => handleRemove(folderPath)}
                type="button"
              >
                <X aria-hidden="true" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="journalit-gallery-folders-add">
        <FolderBrowser
          app={plugin.app}
          includeJournalitTree
          key={folderBrowserKey}
          onChange={setSelectedPath}
          onInputChange={setSelectedPath}
          placeholder={t('settings.gallery-folders.placeholder')}
          selectedPath={selectedPath}
        />
        <Button
          disabled={
            !selectedPath.trim() ||
            folders.includes(normalizePath(selectedPath.trim()))
          }
          onClick={handleAdd}
          size="small"
          variant="primary"
        >
          {t('settings.gallery-folders.add')}
        </Button>
      </div>
    </>
  );
}

function GalleryFoldersSettingsSection({
  plugin,
}: Pick<GeneralTabModel, 'plugin'>) {
  return (
    <SettingsSection title={t('settings.gallery-folders.section')}>
      <p className="journalit-gallery-folders-description">
        {t('settings.gallery-folders.description')}
      </p>
      <GalleryFoldersSettingsControl plugin={plugin} />
    </SettingsSection>
  );
}

export function SyncNotificationSettingsSection({
  plugin,
}: Pick<GeneralTabModel, 'plugin'>) {
  const [notificationSettings, setNotificationSettings] = useState(() => ({
    showSyncNotifications:
      plugin.settings.backendIntegration?.showSyncNotifications ?? true,
    showNewTradeNotifications:
      plugin.settings.backendIntegration?.showNewTradeNotifications ?? true,
  }));

  const ensureBackendIntegrationSettings = () => {
    plugin.settings.backendIntegration ??=
      createDefaultBackendIntegrationSettings();
    return plugin.settings.backendIntegration;
  };

  const saveNotificationSetting = async (
    key: 'showSyncNotifications' | 'showNewTradeNotifications',
    value: boolean,
    noticeKey:
      | 'settings.general.sync-notifications-toggled'
      | 'settings.general.new-trade-notifications-toggled'
  ) => {
    const backendIntegration = ensureBackendIntegrationSettings();
    backendIntegration[key] = value;
    await plugin.saveSettings();
    setNotificationSettings((current) => ({
      ...current,
      [key]: value,
    }));
    new Notice(
      t(noticeKey, {
        status: value
          ? t('settings.general.enabled')
          : t('settings.general.disabled'),
      })
    );
  };

  return (
    <Accordion
      title={t('settings.general.notification-settings')}
      defaultExpanded={false}
    >
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.sync-notifications')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.sync-notifications-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={notificationSettings.showSyncNotifications}
            onChange={(newValue: boolean) =>
              void saveNotificationSetting(
                'showSyncNotifications',
                newValue,
                'settings.general.sync-notifications-toggled'
              )
            }
            id="sync-notifications-toggle"
            ariaLabel={t('settings.general.sync-notifications-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.new-trade-notifications')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.new-trade-notifications-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={notificationSettings.showNewTradeNotifications}
            onChange={(newValue: boolean) =>
              void saveNotificationSetting(
                'showNewTradeNotifications',
                newValue,
                'settings.general.new-trade-notifications-toggled'
              )
            }
            id="new-trade-notifications-toggle"
            ariaLabel={t('settings.general.new-trade-notifications-aria')}
          />
        </div>
      </div>
    </Accordion>
  );
}

function GeneralDataManagementSection({
  plugin,
  handlePrivacyModeToggle,
  settingsExporter,
  isExporting,
  setIsExporting,
  isImporting,
  setIsImporting,
  isResetting,
  setIsResetting,
  setSettingsVersion,
  includePrivacyMode = true,
  includeSettingsActions = true,
  flat = false,
}: Pick<
  GeneralTabModel,
  | 'plugin'
  | 'handlePrivacyModeToggle'
  | 'settingsExporter'
  | 'isExporting'
  | 'setIsExporting'
  | 'isImporting'
  | 'setIsImporting'
  | 'isResetting'
  | 'setIsResetting'
  | 'setSettingsVersion'
> & {
  includePrivacyMode?: boolean;
  includeSettingsActions?: boolean;
  flat?: boolean;
}) {
  return (
    <SettingsSectionOrAccordion
      title={
        includePrivacyMode
          ? t('settings.general.data-management')
          : t('settings.general.backup-restore-section')
      }
      flat={flat}
    >
      {includePrivacyMode && (
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.general.privacy-mode')}
            </div>
            <div className="setting-item-description">
              {t('settings.general.privacy-mode-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <ToggleSwitch
              checked={plugin.settings.display?.privacyMode ?? false}
              onChange={handlePrivacyModeToggle}
              id="privacy-mode-toggle"
              ariaLabel={t('settings.general.privacy-mode-aria')}
            />
          </div>
        </div>
      )}

      {includeSettingsActions && (
        <>
          
          <div className="setting-item">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {t('settings.general.export-settings')}
              </div>
              <div className="setting-item-description">
                {t('settings.general.export-settings-desc')}
              </div>
            </div>
            <div className="setting-item-control">
              <Button
                variant="primary"
                onClick={() => {
                  void (async () => {
                    setIsExporting(true);
                    try {
                      await settingsExporter.exportSettings();
                    } finally {
                      setIsExporting(false);
                    }
                  })();
                }}
                disabled={isExporting}
                className="journalit-settings-action-button"
              >
                {isExporting
                  ? t('settings.general.export-settings-exporting')
                  : t('settings.general.export-settings')}
              </Button>
            </div>
          </div>

          
          <div className="setting-item">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {t('settings.general.import-settings')}
              </div>
              <div className="setting-item-description">
                {t('settings.general.import-settings-desc')}
              </div>
            </div>
            <div className="setting-item-control">
              <Button
                variant="primary"
                onClick={() => {
                  void (async () => {
                    setIsImporting(true);
                    try {
                      const file =
                        await settingsExporter.openImportFilePicker();
                      if (file) {
                        const success =
                          await settingsExporter.importSettings(file);
                        if (success) {
                          setSettingsVersion((prev) => prev + 1);
                        }
                      }
                    } finally {
                      setIsImporting(false);
                    }
                  })();
                }}
                disabled={isImporting}
                className="journalit-settings-action-button"
              >
                {isImporting
                  ? t('settings.general.import-settings-importing')
                  : t('settings.general.import-settings')}
              </Button>
            </div>
          </div>

          
          <div className="setting-item journalit-settings-divider">
            <div className="setting-item-info">
              <div className="setting-item-name">
                {t('settings.general.reset-to-defaults')}
              </div>
              <div className="setting-item-description">
                {t('settings.general.reset-to-defaults-desc')}
                <br />
                <span className="journalit-settings-text-error">
                  {t('settings.general.reset-to-defaults-warning')}
                </span>
              </div>
            </div>
            <div className="setting-item-control">
              <Button
                variant="danger"
                onClick={() => {
                  void (async () => {
                    setIsResetting(true);
                    try {
                      const success = await settingsExporter.resetToDefaults(
                        plugin.app
                      );
                      if (success) {
                        setSettingsVersion((prev) => prev + 1);
                      }
                    } finally {
                      setIsResetting(false);
                    }
                  })();
                }}
                disabled={isResetting}
                className="journalit-settings-action-button"
              >
                {isResetting
                  ? t('settings.general.reset-to-defaults-resetting')
                  : t('settings.general.reset-to-defaults')}
              </Button>
            </div>
          </div>
        </>
      )}
    </SettingsSectionOrAccordion>
  );
}

function GeneralFolderSettingsSection({
  plugin,
  journalFolderPath,
  journalFolderResetVersion,
  handleJournalFolderPathChange,
  setIsUpdatingImages,
  isUpdatingImages,
  flat = false,
}: Pick<
  GeneralTabModel,
  | 'plugin'
  | 'journalFolderPath'
  | 'journalFolderResetVersion'
  | 'handleJournalFolderPathChange'
  | 'setIsUpdatingImages'
  | 'isUpdatingImages'
> & { flat?: boolean }) {
  const isSampleContext =
    plugin.serviceManager.getFolderPathService().context === 'sample';
  return (
    <SettingsSectionOrAccordion
      title={t('settings.general.folder-section')}
      flat={flat}
    >
      
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.journal-folder')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.journal-folder-desc')}
            <br />
            {t('settings.general.journal-folder-desc-2')}
          </div>
        </div>
        <div className="setting-item-control">
          <FolderBrowser
            selectedPath={journalFolderPath}
            resetToken={journalFolderResetVersion}
            onChange={handleJournalFolderPathChange}
            placeholder={
              journalFolderPath
                ? t('settings.general.journal-folder-placeholder')
                : t('settings.general.journal-folder-default')
            }
            app={plugin.app}
          />
        </div>
      </div>

      
      <div className="setting-item journalit-settings-divider journalit-settings-divider--compact">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.update-image-paths')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.update-image-paths-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Button
            variant="primary"
            onClick={() => {
              if (
                plugin.serviceManager.getFolderPathService().context ===
                'sample'
              ) {
                return;
              }
              void (async () => {
                setIsUpdatingImages(true);
                try {
                  const currentPath =
                    plugin.settings.general?.journalFolderPath || '!Journalit';
                  const normalizedCurrentPath =
                    currentPath.replace(/\/$/, '') + '/';

                  
                  const allFiles = plugin.app.vault.getMarkdownFiles();
                  const oldBasePaths = new Set<string>();

                  const utility = new TradePathUpdateUtility(
                    plugin.app,
                    plugin.tradeService
                  );

                  for (const file of allFiles) {
                    
                    const oldPaths = utility.getImageBasePaths(
                      file,
                      normalizedCurrentPath
                    );

                    if (oldPaths.size > 0) {
                      oldPaths.forEach((oldPath) => oldBasePaths.add(oldPath));
                    }
                  }

                  if (oldBasePaths.size === 0) {
                    new Notice(t('settings.general.update-image-paths-match'));
                    setIsUpdatingImages(false);
                    return;
                  }

                  
                  let totalFilesUpdated = 0;
                  let totalFailed = 0;
                  const allErrors: string[] = [];

                  const pathStats = await utility.updateImagePathsForBasePaths(
                    Array.from(oldBasePaths),
                    normalizedCurrentPath.replace(/\/$/, '')
                  );
                  totalFilesUpdated += pathStats.updated;
                  totalFailed += pathStats.failed;
                  allErrors.push(...pathStats.errors);

                  
                  try {
                    const quarterlyStats = await utility.fixQuarterlyImagePaths(
                      currentPath.replace(/\/$/, '')
                    );
                    totalFilesUpdated += quarterlyStats.updated;
                    totalFailed += quarterlyStats.failed;
                    allErrors.push(...quarterlyStats.errors);
                  } catch (error) {
                    console.error('Failed to fix quarterly paths:', error);
                    allErrors.push(
                      `Quarterly fix: ${error instanceof Error ? error.message : String(error)}`
                    );
                  }

                  
                  if (allErrors.length > 0) {
                    new Notice(
                      t('settings.general.update-image-paths-errors', {
                        updated: String(totalFilesUpdated),
                        failed: String(totalFailed),
                      }),
                      8000
                    );
                    console.error('Image path update errors:', allErrors);
                  } else if (totalFilesUpdated > 0) {
                    new Notice(
                      t('settings.general.update-image-paths-success', {
                        count: String(totalFilesUpdated),
                      }),
                      5000
                    );
                  } else {
                    new Notice(
                      t('settings.general.update-image-paths-no-update'),
                      3000
                    );
                  }
                } catch (error) {
                  console.error('Failed to update image paths:', error);
                  new Notice(
                    t('settings.general.update-image-paths-failed'),
                    5000
                  );
                } finally {
                  setIsUpdatingImages(false);
                }
              })();
            }}
            disabled={isUpdatingImages || isSampleContext}
            className="journalit-settings-action-button"
          >
            {isUpdatingImages
              ? t('settings.general.update-image-paths-updating')
              : t('settings.general.update-image-paths')}
          </Button>
        </div>
      </div>
    </SettingsSectionOrAccordion>
  );
}

export function HomeBackgroundControls({
  plugin,
}: {
  plugin: JournalitPlugin;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasBackground = Boolean(plugin.settings.home?.backgroundImagePath);

  const persistPath = useCallback(
    async (nextPath: string) => {
      ensureHomeSettings(plugin.settings).backgroundImagePath =
        nextPath || undefined;
      await plugin.saveSettings();
      eventBus.publish('settings:changed', {
        section: 'home',
        source: 'background-image',
      });
    },
    [plugin]
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;

      if (!isSupportedHomeBackgroundFile(file)) {
        new Notice(t('settings.general.home-background-invalid-file'));
        return;
      }

      setIsSaving(true);
      try {
        const savedPath = await saveHomeBackgroundFile(plugin.app, file);
        await persistPath(savedPath);
        new Notice(t('settings.general.home-background-saved'));
      } catch (error) {
        console.error('Failed to import Home background image:', error);
        new Notice(t('settings.general.home-background-save-failed'));
      } finally {
        setIsSaving(false);
      }
    },
    [persistPath, plugin]
  );

  const clearPath = useCallback(async () => {
    setIsSaving(true);
    try {
      await persistPath('');
      new Notice(t('settings.general.home-background-cleared'));
    } catch (error) {
      console.error('Failed to clear Home background image:', error);
      new Notice(t('settings.general.home-background-save-failed'));
    } finally {
      setIsSaving(false);
    }
  }, [persistPath]);

  return (
    <div className="journalit-home-background-controls">
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="primary"
        size="small"
        loading={isSaving}
        disabled={isSaving}
      >
        {t('settings.general.home-background-choose')}
      </Button>
      {hasBackground && (
        <Button
          onClick={() => void clearPath()}
          variant="plain"
          size="small"
          disabled={isSaving}
        >
          {t('settings.general.home-background-clear')}
        </Button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => void handleFileChange(event)}
        className="journalit-home-background-file-input"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}

export function NavigationSidebarOpenControl({
  plugin,
}: {
  plugin: JournalitPlugin;
}) {
  const handleOpen = async () => {
    try {
      await plugin.openNavigationSidebar();
      plugin.app.setting?.close();
    } catch (error) {
      console.error(
        '[Journalit] Failed to open navigation sidebar from settings:',
        error
      );
      new Notice(t('notice.error.open-navigation-sidebar'));
    }
  };

  return (
    <Button variant="primary" size="small" onClick={handleOpen}>
      {t('navigation.setting.open.button')}
    </Button>
  );
}

export function CalendarSidebarOpenControl({
  plugin,
}: {
  plugin: JournalitPlugin;
}) {
  const handleOpen = async () => {
    try {
      await plugin.openCalendarSidebar();
      plugin.app.setting?.close();
    } catch (error) {
      console.error(
        '[Journalit] Failed to open calendar sidebar from settings:',
        error
      );
      new Notice(t('notice.error.open-calendar-sidebar'));
    }
  };

  return (
    <Button variant="primary" size="small" onClick={handleOpen}>
      {t('calendar.setting.open.button')}
    </Button>
  );
}

export function HomeBackgroundSettings({
  plugin,
}: {
  plugin: JournalitPlugin;
}) {
  const [hasBackground, setHasBackground] = useState(
    Boolean(plugin.settings.home?.backgroundImagePath)
  );
  useEventBus('settings:changed', (payload) => {
    if (payload.section === 'home' || payload.section === 'all') {
      setHasBackground(Boolean(plugin.settings.home?.backgroundImagePath));
    }
  });
  const [showInDashboard, setShowInDashboard] = useState(
    plugin.settings.home?.showBackgroundInDashboard ?? false
  );

  const handleDashboardVisibilityChange = useCallback(
    async (newValue: boolean) => {
      ensureHomeSettings(plugin.settings).showBackgroundInDashboard = newValue;
      setShowInDashboard(newValue);
      await plugin.saveSettings();
      eventBus.publish('settings:changed', {
        section: 'home',
        source: 'background-dashboard-visibility',
      });
    },
    [plugin]
  );

  return (
    <>
      <div className="setting-item journalit-home-background-setting">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.home-background')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.home-background-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <HomeBackgroundControls plugin={plugin} />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.home-background-dashboard')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.home-background-dashboard-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={showInDashboard}
            onChange={handleDashboardVisibilityChange}
            id="home-background-dashboard-toggle"
            ariaLabel={t('settings.general.home-background-dashboard-aria')}
          />
        </div>
      </div>
      {hasBackground && (
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.general.home-widget-opacity')}
            </div>
            <div className="setting-item-description">
              {t('settings.general.home-widget-opacity-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <HomeWidgetOpacityControl plugin={plugin} />
          </div>
        </div>
      )}
    </>
  );
}


export function AccentColorSetting({ plugin }: { plugin: JournalitPlugin }) {
  const [source, setSource] = useState<AccentColorSource>(
    plugin.settings.general?.accentColorSource ?? 'journalit'
  );

  const handleChange = async (value: string) => {
    const next: AccentColorSource =
      value === 'obsidian' ? 'obsidian' : 'journalit';
    if (!plugin.settings.general) {
      plugin.settings.general = {
        currency: CurrencyCode.USD,
        accentColorSource: next,
      };
    } else {
      plugin.settings.general.accentColorSource = next;
    }
    setSource(next);
    await plugin.saveSettings();
    
    eventBus.publish('appearance:accent-source-changed');
  };

  return (
    <div className="setting-item">
      <div className="setting-item-info">
        <div className="setting-item-name">
          {t('settings.general.accent-color')}
        </div>
        <div className="setting-item-description">
          {t('settings.general.accent-color-desc')}
        </div>
      </div>
      <div className="setting-item-control">
        <Select
          value={source}
          onChange={(value) => void handleChange(value)}
          options={[
            {
              value: 'journalit',
              label: t('settings.general.accent-color-journalit'),
            },
            {
              value: 'obsidian',
              label: t('settings.general.accent-color-obsidian'),
            },
          ]}
          id="accent-color-source-dropdown"
          aria-label={t('settings.general.accent-color')}
        />
      </div>
    </div>
  );
}

const ReviewWidgetNavigationSetting: React.FC<{
  plugin: JournalitPlugin;
  onSaved: () => void;
}> = ({ plugin, onSaved }) => (
  <div className="setting-item">
    <div className="setting-item-info">
      <div className="setting-item-name">
        {t('settings.general.review-links-new-tab')}
      </div>
      <div className="setting-item-description">
        {t('settings.general.review-links-new-tab-desc')}
      </div>
    </div>
    <div className="setting-item-control">
      <ToggleSwitch
        checked={plugin.settings.reviewV2?.openNoteLinksInNewTab ?? true}
        onChange={async (newValue) => {
          if (!plugin.settings.reviewV2) {
            plugin.settings.reviewV2 = {
              ...DEFAULT_SETTINGS.reviewV2!,
              openNoteLinksInNewTab: newValue,
            };
          } else {
            plugin.settings.reviewV2.openNoteLinksInNewTab = newValue;
          }
          await plugin.saveSettings();
          onSaved();
        }}
        id="review-widget-note-links-new-tab-toggle"
        ariaLabel={t('settings.general.review-links-new-tab-aria')}
      />
    </div>
  </div>
);

function HomeViewSettingsSection({
  plugin,
  flat,
  handleHomeStartupBehaviorChange,
  handleFilterRecentItemsToggle,
}: Pick<
  GeneralTabModel,
  'plugin' | 'handleHomeStartupBehaviorChange' | 'handleFilterRecentItemsToggle'
> & { flat: boolean }) {
  return (
    <SettingsSectionOrAccordion
      title={t('settings.general.home-view-settings')}
      flat={flat}
    >
      
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.home-auto-open')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.home-auto-open-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            value={plugin.settings.general?.homeStartupBehavior || 'always'}
            onChange={handleHomeStartupBehaviorChange}
            options={[
              {
                value: 'always',
                label: t('settings.general.home-auto-open-always'),
              },
              {
                value: 'ifNone',
                label: t('settings.general.home-auto-open-ifnone'),
              },
              {
                value: 'never',
                label: t('settings.general.home-auto-open-never'),
              },
            ]}
            id="home-startup-behavior-dropdown"
            aria-label={t('settings.general.home-auto-open-aria')}
          />
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.filter-recent')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.filter-recent-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <ToggleSwitch
            checked={
              plugin.settings.home?.filterRecentItemsToJournalit ?? false
            }
            onChange={handleFilterRecentItemsToggle}
            id="filter-recent-items-toggle"
            ariaLabel={t('settings.general.filter-recent-aria')}
          />
        </div>
      </div>

      <HomeBackgroundSettings plugin={plugin} />
    </SettingsSectionOrAccordion>
  );
}

function GeneralCoreSettingsSection({
  plugin,
  docsIconRef,
  discordIconRef,
  githubIconRef,
  handleCurrencyChange,
  displayName,
  displayNameDirty,
  handleDisplayNameInputChange,
  handleDisplayNameConfirm,
  handleDisplayNameCancel,
  handleHomeStartupBehaviorChange,
  handleFilterRecentItemsToggle,
  setSettingsVersion,
  journalFolderPath,
  journalFolderResetVersion,
  handleJournalFolderPathChange,
  setIsUpdatingImages,
  isUpdatingImages,
  showFolderSettings = true,
  flat = false,
}: Pick<
  GeneralTabModel,
  | 'plugin'
  | 'docsIconRef'
  | 'discordIconRef'
  | 'githubIconRef'
  | 'handleCurrencyChange'
  | 'displayName'
  | 'displayNameDirty'
  | 'handleDisplayNameInputChange'
  | 'handleDisplayNameConfirm'
  | 'handleDisplayNameCancel'
  | 'handleHomeStartupBehaviorChange'
  | 'handleFilterRecentItemsToggle'
  | 'setSettingsVersion'
  | 'journalFolderPath'
  | 'journalFolderResetVersion'
  | 'handleJournalFolderPathChange'
  | 'setIsUpdatingImages'
  | 'isUpdatingImages'
> & { showFolderSettings?: boolean; flat?: boolean }) {
  return (
    <>
      <h3>{t('settings.general.title')}</h3>
      <div className="journalit-settings-links">
        <ExternalLinkButton
          url={JOURNALIT_SETTINGS_RESOURCES.docs}
          label={t('settings.general.docs')}
          iconRef={docsIconRef}
        />
        <ExternalLinkButton
          url={JOURNALIT_SETTINGS_RESOURCES.discord}
          label={t('settings.general.discord')}
          iconRef={discordIconRef}
        />
        <ExternalLinkButton
          url={JOURNALIT_SETTINGS_RESOURCES.github}
          label={t('settings.general.github')}
          iconRef={githubIconRef}
        />
      </div>

      
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.currency')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.currency-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <Select
            value={plugin.settings.general?.currency || CurrencyCode.USD}
            onChange={handleCurrencyChange}
            options={getBaseCurrencyOptions()}
            id="currency-dropdown"
            aria-label={t('settings.general.currency-aria')}
          />
        </div>
      </div>

      
      <div className="setting-item">
        <div className="setting-item-info">
          <div className="setting-item-name">
            {t('settings.general.display-name')}
          </div>
          <div className="setting-item-description">
            {t('settings.general.display-name-desc')}
          </div>
        </div>
        <div className="setting-item-control">
          <div className="journalit-settings-display-name-row">
            <input
              type="text"
              value={displayName}
              onChange={(e) => handleDisplayNameInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && displayNameDirty) {
                  e.preventDefault();
                  void handleDisplayNameConfirm();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  handleDisplayNameCancel();
                }
              }}
              placeholder={t('settings.general.display-name-placeholder')}
              aria-label={t('settings.general.display-name-aria')}
              className="setting-input journalit-settings-input journalit-settings-display-name-input"
            />
            {displayNameDirty && (
              <>
                <button
                  onClick={() => void handleDisplayNameConfirm()}
                  aria-label={t('settings.general.display-name-confirm-aria')}
                  className="journalit-settings-display-name-button journalit-settings-display-name-button--confirm"
                >
                  ✓
                </button>
                <button
                  onClick={() => void handleDisplayNameCancel()}
                  aria-label={t('settings.general.display-name-cancel-aria')}
                  className="journalit-settings-display-name-button journalit-settings-display-name-button--cancel"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <SettingsSectionOrAccordion
        title={t('settings.general.appearance')}
        flat={flat}
      >
        <AccentColorSetting plugin={plugin} />
      </SettingsSectionOrAccordion>

      <HomeViewSettingsSection
        plugin={plugin}
        flat={flat}
        handleHomeStartupBehaviorChange={handleHomeStartupBehaviorChange}
        handleFilterRecentItemsToggle={handleFilterRecentItemsToggle}
      />

      
      <SettingsSectionOrAccordion
        title={t('settings.general.navigation-sidebar')}
        flat={flat}
      >
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('navigation.setting.open')}
            </div>
            <div className="setting-item-description">
              {t('navigation.setting.open.desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <NavigationSidebarOpenControl plugin={plugin} />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('calendar.setting.open')}
            </div>
            <div className="setting-item-description">
              {t('navigation.setting.open.desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <CalendarSidebarOpenControl plugin={plugin} />
          </div>
        </div>
      </SettingsSectionOrAccordion>

      <SettingsSectionOrAccordion
        title={t('settings.general.tab-behavior')}
        flat={flat}
      >
        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('navigation.setting.tab-behavior')}
            </div>
            <div className="setting-item-description">
              {t('navigation.setting.tab-behavior.desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <Select
              value={
                plugin.settings.navigation?.tabBehavior || 'replaceActiveTab'
              }
              onChange={async (newValue: string) => {
                if (!plugin.settings.navigation) {
                  plugin.settings.navigation = {
                    ...createDefaultNavigationSettings(),
                    tabBehavior: parseSidebarTabBehavior(newValue),
                  };
                } else {
                  plugin.settings.navigation.tabBehavior =
                    parseSidebarTabBehavior(newValue);
                }
                await plugin.saveSettings();
                setSettingsVersion((prev) => prev + 1);
              }}
              options={[
                {
                  value: 'newTab',
                  label: t('navigation.setting.tab-behavior.new-tab'),
                },
                {
                  value: 'replaceActiveTab',
                  label: t('navigation.setting.tab-behavior.replace'),
                },
              ]}
              id="navigation-tab-behavior-dropdown"
            />
          </div>
        </div>

        <ReviewWidgetNavigationSetting
          plugin={plugin}
          onSaved={() => setSettingsVersion((prev) => prev + 1)}
        />
      </SettingsSectionOrAccordion>

      {showFolderSettings && (
        <GeneralFolderSettingsSection
          plugin={plugin}
          journalFolderPath={journalFolderPath}
          journalFolderResetVersion={journalFolderResetVersion}
          handleJournalFolderPathChange={handleJournalFolderPathChange}
          setIsUpdatingImages={setIsUpdatingImages}
          isUpdatingImages={isUpdatingImages}
        />
      )}
    </>
  );
}

export const GeneralTab: React.FC<GeneralTabProps> = (props) => {
  const scope = props.scope ?? 'all';
  const {
    analyticsDateBasisOptions,
    breakEvenModeOptions,
    dateFormatOptions,
    discordIconRef,
    displayName,
    displayNameDirty,
    docsIconRef,
    githubIconRef,
    handleAnalyticsDateBasisChange,
    handleAutoOpenToggle,
    handleBreakEvenMaxChange,
    handleBreakEvenMinChange,
    handleBreakEvenModeChange,
    handleBreakEvenPercentChange,
    handleBreakEvenRangeBlur,
    handleIncludeCopyAccountsToggle,
    handleIncludeUnrealizedPnLToggle,
    handleCurrencyChange,
    handleDateFormatChange,
    handleDefaultRiskAmountChange,
    handleDisplayNameCancel,
    handleDisplayNameConfirm,
    handleDisplayNameInputChange,
    handleDisplayRMultiplesToggle,
    handleHideDollarAmountsInSharesToggle,
    handleDollarValueInputToggle,
    handleFilterRecentItemsToggle,
    handleHomeStartupBehaviorChange,
    handleJournalFolderPathChange,
    handleMaeMfeDisplayUnitChange,
    handleMaeMfeInputModeChange,
    handlePrivacyModeToggle,
    handleSkipWeekendsToggle,
    handleTradingDayCutoffTimeChange,
    handleWeekStartDayChange,
    isExporting,
    isImporting,
    isResetting,
    isUpdatingImages,
    journalFolderPath,
    journalFolderResetVersion,
    maeMfeDisplayUnitOptions,
    maeMfeInputModeOptions,
    plugin,
    setIsExporting,
    setIsImporting,
    setIsResetting,
    setIsUpdatingImages,
    setSettingsVersion,
    settingsExporter,
    weekStartDayOptions,
  } = useGeneralTabModel(props);

  return (
    <div className="journalit-settings-tab general-settings">
      {(scope === 'general' || scope === 'all') && (
        <GeneralCoreSettingsSection
          plugin={plugin}
          docsIconRef={docsIconRef}
          discordIconRef={discordIconRef}
          githubIconRef={githubIconRef}
          handleCurrencyChange={handleCurrencyChange}
          displayName={displayName}
          displayNameDirty={displayNameDirty}
          handleDisplayNameInputChange={handleDisplayNameInputChange}
          handleDisplayNameConfirm={handleDisplayNameConfirm}
          handleDisplayNameCancel={handleDisplayNameCancel}
          handleHomeStartupBehaviorChange={handleHomeStartupBehaviorChange}
          handleFilterRecentItemsToggle={handleFilterRecentItemsToggle}
          setSettingsVersion={setSettingsVersion}
          journalFolderPath={journalFolderPath}
          journalFolderResetVersion={journalFolderResetVersion}
          handleJournalFolderPathChange={handleJournalFolderPathChange}
          setIsUpdatingImages={setIsUpdatingImages}
          isUpdatingImages={isUpdatingImages}
          showFolderSettings={scope === 'all'}
          flat={scope === 'general'}
        />
      )}

      {(scope === 'general' || scope === 'all') && (
        <UpdateNotificationSettingsSection plugin={plugin} />
      )}

      {scope === 'general' && (
        <GeneralDataManagementSection
          plugin={plugin}
          handlePrivacyModeToggle={handlePrivacyModeToggle}
          settingsExporter={settingsExporter}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
          isImporting={isImporting}
          setIsImporting={setIsImporting}
          isResetting={isResetting}
          setIsResetting={setIsResetting}
          setSettingsVersion={setSettingsVersion}
          includeSettingsActions={false}
          flat={true}
        />
      )}

      {(scope === 'trading' || scope === 'all') && (
        <GeneralTradeSettingsSection
          plugin={plugin}
          handleAutoOpenToggle={handleAutoOpenToggle}
          handleDateFormatChange={handleDateFormatChange}
          dateFormatOptions={dateFormatOptions}
          setSettingsVersion={setSettingsVersion}
          handleSkipWeekendsToggle={handleSkipWeekendsToggle}
          handleWeekStartDayChange={handleWeekStartDayChange}
          weekStartDayOptions={weekStartDayOptions}
          handleAnalyticsDateBasisChange={handleAnalyticsDateBasisChange}
          analyticsDateBasisOptions={analyticsDateBasisOptions}
          handleDollarValueInputToggle={handleDollarValueInputToggle}
          handleTradingDayCutoffTimeChange={handleTradingDayCutoffTimeChange}
          handleBreakEvenModeChange={handleBreakEvenModeChange}
          breakEvenModeOptions={breakEvenModeOptions}
          handleBreakEvenPercentChange={handleBreakEvenPercentChange}
          handleBreakEvenRangeBlur={handleBreakEvenRangeBlur}
          handleBreakEvenMinChange={handleBreakEvenMinChange}
          handleBreakEvenMaxChange={handleBreakEvenMaxChange}
          handleDefaultRiskAmountChange={handleDefaultRiskAmountChange}
          handleDisplayRMultiplesToggle={handleDisplayRMultiplesToggle}
          handleHideDollarAmountsInSharesToggle={
            handleHideDollarAmountsInSharesToggle
          }
          handleIncludeCopyAccountsToggle={handleIncludeCopyAccountsToggle}
          handleIncludeUnrealizedPnLToggle={handleIncludeUnrealizedPnLToggle}
          handleMaeMfeDisplayUnitChange={handleMaeMfeDisplayUnitChange}
          handleMaeMfeInputModeChange={handleMaeMfeInputModeChange}
          maeMfeDisplayUnitOptions={maeMfeDisplayUnitOptions}
          maeMfeInputModeOptions={maeMfeInputModeOptions}
          flat={scope === 'trading'}
        />
      )}

      {(scope === 'advanced' || scope === 'all') && (
        <>
          {scope === 'advanced' && (
            <GeneralFolderSettingsSection
              plugin={plugin}
              journalFolderPath={journalFolderPath}
              journalFolderResetVersion={journalFolderResetVersion}
              handleJournalFolderPathChange={handleJournalFolderPathChange}
              setIsUpdatingImages={setIsUpdatingImages}
              isUpdatingImages={isUpdatingImages}
              flat={true}
            />
          )}
          <GeneralDataManagementSection
            plugin={plugin}
            handlePrivacyModeToggle={handlePrivacyModeToggle}
            settingsExporter={settingsExporter}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
            isImporting={isImporting}
            setIsImporting={setIsImporting}
            isResetting={isResetting}
            setIsResetting={setIsResetting}
            setSettingsVersion={setSettingsVersion}
            includePrivacyMode={scope === 'all'}
            flat={scope === 'advanced'}
          />
        </>
      )}
    </div>
  );
};
