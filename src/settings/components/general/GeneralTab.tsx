

import React, { useEffect, useState, useRef } from 'react';
import { Notice, setIcon } from 'obsidian';
import JournalitPlugin from '../../../main';
import { ToggleSwitch } from '../../../components/ui';
import { Button } from '../../../components/ui/Button';
import { ExternalLinkButton } from '../../../components/ui/ExternalLinkButton';
import { Select } from '../../../components/core/Select';
import { Accordion } from '../../../components/shared/Accordion';
import { FolderBrowser } from '../../../components/ui/FolderBrowser';
import { openPathChangeInstructionModal } from '../../../components/modals/PathChangeInstructionModal';
import {
  getCurrencyOptions,
  CurrencyCode,
} from '../../../utils/currencyConfig';
import { useDebouncedFunction } from '../../../hooks/useDebounced';
import { TradePathUpdateUtility } from '../../../services/trade/TradePathUpdateUtility';
import { eventBus } from '../../../services/events';
import { SettingsExporter } from '../../SettingsExporter';
import { t } from '../../../lang/helpers';
import {
  DEFAULT_TRADING_DAY_CUTOFF_TIME,
  TRADING_DAY_CUTOFF_END_OF_DAY_MIGRATION_VERSION,
} from '../../../utils/tradingDayUtils';
import { DEFAULT_SETTINGS } from '../../types';
import type {
  AnalyticsDateBasis,
  WeekStartDay,
  SidebarTabBehavior,
} from '../../types';

interface GeneralTabProps {
  plugin: JournalitPlugin;
}

function useGeneralTabModel(props: GeneralTabProps) {
  const { plugin } = props;
  
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

  
  const [isUpdatingImages, setIsUpdatingImages] = useState(false);

  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  
  const settingsExporter = useRef(new SettingsExporter(plugin));

  
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
          autoCreateOnFirstTrade: true,
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

  
  const dateFormatOptions = [
    { value: 'DDMMYY', label: t('settings.general.date-format-ddmmyy') },
    { value: 'MMDDYY', label: t('settings.general.date-format-mmddyy') },
    { value: 'YYMMDD', label: t('settings.general.date-format-yymmdd') },
  ];

  const weekStartDayLabelMap: Record<WeekStartDay, string> = {
    sunday: t('calendar.day.sun'),
    monday: t('calendar.day.mon'),
    tuesday: t('calendar.day.tue'),
    wednesday: t('calendar.day.wed'),
    thursday: t('calendar.day.thu'),
    friday: t('calendar.day.fri'),
    saturday: t('calendar.day.sat'),
  };

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

  const breakEvenModeOptions = [
    {
      value: 'fixed',
      label: t('settings.general.break-even-mode-fixed'),
    },
    {
      value: 'percentage_current_balance',
      label: t('settings.general.break-even-mode-percent'),
    },
  ];

  const analyticsDateBasisOptions = [
    {
      value: 'entry',
      label: t('settings.general.analytics-date-basis-entry'),
    },
    {
      value: 'exit',
      label: t('settings.general.analytics-date-basis-exit'),
    },
  ];

  
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
    const weekStartDay = newValue as WeekStartDay;
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
    const analyticsDateBasis = newValue as AnalyticsDateBasis;
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
    const currencyCode = newValue as CurrencyCode;

    
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
      
      if (!plugin.settings.general) {
        plugin.settings.general = {
          currency: CurrencyCode.USD,
          displayName: displayName,
        };
      } else {
        plugin.settings.general.displayName = displayName;
      }

      await plugin.saveSettings();
      setDisplayNameDirty(false);

      
      const homeRefreshEvent = new CustomEvent(
        'journalit:display-name-changed',
        {
          detail: { displayName: displayName },
        }
      );
      window.dispatchEvent(homeRefreshEvent);

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

  
  const handleJournalFolderPathChange = useDebouncedFunction(
    async (newPath: string) => {
      
      const backendService =
        await plugin.serviceManager.getBackendIntegrationService();
      if (backendService?.getIsSyncing()) {
        new Notice(t('notice.error.cannot-change-folder-during-sync'), 5000);
        
        const folderPathService =
          await plugin.serviceManager?.getFolderPathService();
        const currentPath =
          folderPathService?.journalFolderPath || '!Journalit';
        setJournalFolderPath(currentPath);
        return;
      }

      
      const folderPathService =
        await plugin.serviceManager?.getFolderPathService();
      const currentPath = folderPathService?.journalFolderPath || '!Journalit';

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

      openPathChangeInstructionModal(
        plugin.app,
        plugin,
        effectiveCurrentPath,
        effectiveNewPath,
        hasExistingTrades,
        async () => {
          
          try {
            
            if (!plugin.settings.general) {
              plugin.settings.general = {
                currency: CurrencyCode.USD,
                journalFolderPath: effectiveNewPath,
              };
            } else {
              plugin.settings.general.journalFolderPath = effectiveNewPath;
            }

            await plugin.saveSettings();

            
            eventBus.publish('settings:changed', {});

            
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
          }
        },
        () => {
          
          setJournalFolderPath(currentPath);
        }
      );
    },
    2000, 
    { leading: false, trailing: true }
  );

  
  const handleHomeStartupBehaviorChange = async (newValue: string) => {
    
    if (!plugin.settings.general) {
      plugin.settings.general = {
        currency: CurrencyCode.USD,
        homeStartupBehavior: newValue as 'always' | 'ifNone' | 'never',
      };
    } else {
      plugin.settings.general.homeStartupBehavior = newValue as
        | 'always'
        | 'ifNone'
        | 'never';
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
        behavior: labels[newValue as keyof typeof labels],
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
    
    plugin.settings.trade.breakEvenRangeMin = value > 0 ? -value : value;

    
    const max = plugin.settings.trade.breakEvenRangeMax ?? 0;
    const actualMin = value > 0 ? -value : value;
    if (actualMin > max) {
      new Notice(t('settings.general.break-even-warning'), 5000);
    }

    await applyBreakEvenSettingsUpdate();
  };

  
  const handleBreakEvenMaxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    plugin.settings.trade.breakEvenRangeMax = value;

    
    const min = plugin.settings.trade.breakEvenRangeMin ?? 0;
    if (min > value) {
      new Notice(t('settings.general.break-even-warning'), 5000);
    }

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

  
  const handleBreakEvenRangeBlur = () => {
    new Notice(t('settings.general.break-even-updated'));
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

  const maeMfeInputModeOptions = [
    { value: 'price', label: t('settings.general.mae-mfe-input-mode-price') },
    { value: 'dollar', label: t('settings.general.mae-mfe-input-mode-dollar') },
  ];

  const handleMaeMfeInputModeChange = async (newValue: string) => {
    plugin.settings.trade.maeMfeInputMode = newValue as 'price' | 'dollar';
    await plugin.saveSettings();
    setSettingsVersion((prev) => prev + 1);
  };

  
  const docsIconRef = useRef<HTMLSpanElement>(null);
  const discordIconRef = useRef<HTMLSpanElement>(null);
  const githubIconRef = useRef<HTMLSpanElement>(null);

  
  useEffect(() => {
    if (docsIconRef.current) setIcon(docsIconRef.current, 'book-open');
    if (discordIconRef.current)
      setIcon(discordIconRef.current, 'messages-square');
    if (githubIconRef.current) setIcon(githubIconRef.current, 'github');
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
    handleCurrencyChange,
    handleDateFormatChange,
    handleDefaultRiskAmountChange,
    handleDisplayNameCancel,
    handleDisplayNameConfirm,
    handleDisplayNameInputChange,
    handleDisplayRMultiplesToggle,
    handleDollarValueInputToggle,
    handleFilterRecentItemsToggle,
    handleHomeStartupBehaviorChange,
    handleJournalFolderPathChange,
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
  handleIncludeCopyAccountsToggle,
  handleMaeMfeInputModeChange,
  maeMfeInputModeOptions,
}: Pick<
  GeneralTabModel,
  | 'plugin'
  | 'handleDefaultRiskAmountChange'
  | 'handleDisplayRMultiplesToggle'
  | 'handleIncludeCopyAccountsToggle'
  | 'handleMaeMfeInputModeChange'
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
          <input
            type="number"
            value={plugin.settings.trade.defaultRiskAmount ?? 0}
            onChange={handleDefaultRiskAmountChange}
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
            <input
              type="number"
              min="0"
              step="0.01"
              value={plugin.settings.trade.breakEvenThresholdPercent ?? 0}
              onChange={handleBreakEvenPercentChange}
              onBlur={handleBreakEvenRangeBlur}
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
            <input
              type="number"
              value={plugin.settings.trade.breakEvenRangeMin ?? 0}
              onChange={handleBreakEvenMinChange}
              onBlur={handleBreakEvenRangeBlur}
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
            <input
              type="number"
              value={plugin.settings.trade.breakEvenRangeMax ?? 0}
              onChange={handleBreakEvenMaxChange}
              onBlur={handleBreakEvenRangeBlur}
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
            onChange={handleTradingDayCutoffTimeChange}
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
  handleIncludeCopyAccountsToggle,
  handleMaeMfeInputModeChange,
  maeMfeInputModeOptions,
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
  | 'handleIncludeCopyAccountsToggle'
  | 'handleMaeMfeInputModeChange'
  | 'maeMfeInputModeOptions'
>) {
  return (
    <>
      
      <Accordion
        title={t('settings.general.trade-settings')}
        defaultExpanded={true}
      >
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

        <GeneralBreakEvenSettings
          plugin={plugin}
          handleBreakEvenModeChange={handleBreakEvenModeChange}
          breakEvenModeOptions={breakEvenModeOptions}
          handleBreakEvenPercentChange={handleBreakEvenPercentChange}
          handleBreakEvenRangeBlur={handleBreakEvenRangeBlur}
          handleBreakEvenMinChange={handleBreakEvenMinChange}
          handleBreakEvenMaxChange={handleBreakEvenMaxChange}
        />

        <GeneralRiskDisplaySettings
          plugin={plugin}
          handleDefaultRiskAmountChange={handleDefaultRiskAmountChange}
          handleDisplayRMultiplesToggle={handleDisplayRMultiplesToggle}
          handleIncludeCopyAccountsToggle={handleIncludeCopyAccountsToggle}
          handleMaeMfeInputModeChange={handleMaeMfeInputModeChange}
          maeMfeInputModeOptions={maeMfeInputModeOptions}
        />
      </Accordion>

      
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
              checked={
                plugin.settings.backendIntegration?.showSyncNotifications ??
                true
              }
              onChange={async (newValue: boolean) => {
                if (!plugin.settings.backendIntegration) {
                  plugin.settings.backendIntegration = {
                    serverUrl: 'https://api.journalit.co',
                    syncEnabled: false,
                    userId: '',
                    showSyncNotifications: true,
                    showNewTradeNotifications: true,
                    showUpdateNotifications: true,
                    lastSeenVersion: '',
                  };
                }
                plugin.settings.backendIntegration!.showSyncNotifications =
                  newValue;
                await plugin.saveSettings();
                setSettingsVersion((prev) => prev + 1);
                new Notice(
                  t('settings.general.sync-notifications-toggled', {
                    status: newValue
                      ? t('settings.general.enabled')
                      : t('settings.general.disabled'),
                  })
                );
              }}
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
              checked={
                plugin.settings.backendIntegration?.showNewTradeNotifications ??
                true
              }
              onChange={async (newValue: boolean) => {
                if (!plugin.settings.backendIntegration) {
                  plugin.settings.backendIntegration = {
                    serverUrl: 'https://api.journalit.co',
                    syncEnabled: false,
                    userId: '',
                    showSyncNotifications: true,
                    showNewTradeNotifications: true,
                    showUpdateNotifications: true,
                    lastSeenVersion: '',
                  };
                }
                plugin.settings.backendIntegration!.showNewTradeNotifications =
                  newValue;
                await plugin.saveSettings();
                setSettingsVersion((prev) => prev + 1);
                new Notice(
                  t('settings.general.new-trade-notifications-toggled', {
                    status: newValue
                      ? t('settings.general.enabled')
                      : t('settings.general.disabled'),
                  })
                );
              }}
              id="new-trade-notifications-toggle"
              ariaLabel={t('settings.general.new-trade-notifications-aria')}
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <div className="setting-item-name">
              {t('settings.general.update-notifications')}
            </div>
            <div className="setting-item-description">
              {t('settings.general.update-notifications-desc')}
            </div>
          </div>
          <div className="setting-item-control">
            <ToggleSwitch
              checked={
                plugin.settings.backendIntegration?.showUpdateNotifications ??
                true
              }
              onChange={async (newValue: boolean) => {
                if (!plugin.settings.backendIntegration) {
                  plugin.settings.backendIntegration = {
                    serverUrl: 'https://api.journalit.co',
                    syncEnabled: false,
                    userId: '',
                    showSyncNotifications: true,
                    showNewTradeNotifications: true,
                    showUpdateNotifications: true,
                    lastSeenVersion: '',
                  };
                }
                plugin.settings.backendIntegration!.showUpdateNotifications =
                  newValue;
                await plugin.saveSettings();
                setSettingsVersion((prev) => prev + 1);
                new Notice(
                  t('settings.general.update-notifications-toggled', {
                    status: newValue
                      ? t('settings.general.enabled')
                      : t('settings.general.disabled'),
                  })
                );
              }}
              id="show-update-notifications-toggle"
              ariaLabel={t('settings.general.update-notifications-aria')}
            />
          </div>
        </div>
      </Accordion>
    </>
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
>) {
  return (
    <>
      
      <Accordion
        title={t('settings.general.data-management')}
        defaultExpanded={false}
      >
        
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
              onClick={async () => {
                setIsExporting(true);
                try {
                  await settingsExporter.current.exportSettings();
                } finally {
                  setIsExporting(false);
                }
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
              onClick={async () => {
                setIsImporting(true);
                try {
                  const file =
                    await settingsExporter.current.openImportFilePicker();
                  if (file) {
                    const success =
                      await settingsExporter.current.importSettings(file);
                    if (success) {
                      setSettingsVersion((prev) => prev + 1);
                    }
                  }
                } finally {
                  setIsImporting(false);
                }
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
              onClick={async () => {
                setIsResetting(true);
                try {
                  const success =
                    await settingsExporter.current.resetToDefaults(plugin.app);
                  if (success) {
                    setSettingsVersion((prev) => prev + 1);
                  }
                } finally {
                  setIsResetting(false);
                }
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
      </Accordion>
    </>
  );
}

function GeneralFolderSettingsSection({
  plugin,
  journalFolderPath,
  handleJournalFolderPathChange,
  setIsUpdatingImages,
  isUpdatingImages,
}: Pick<
  GeneralTabModel,
  | 'plugin'
  | 'journalFolderPath'
  | 'handleJournalFolderPathChange'
  | 'setIsUpdatingImages'
  | 'isUpdatingImages'
>) {
  return (
    <>
      
      <Accordion
        title={t('settings.general.folder-section')}
        defaultExpanded={false}
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
              onClick={async () => {
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
              }}
              disabled={isUpdatingImages}
              className="journalit-settings-action-button"
            >
              {isUpdatingImages
                ? t('settings.general.update-image-paths-updating')
                : t('settings.general.update-image-paths')}
            </Button>
          </div>
        </div>
      </Accordion>
    </>
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
  handleJournalFolderPathChange,
  setIsUpdatingImages,
  isUpdatingImages,
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
  | 'handleJournalFolderPathChange'
  | 'setIsUpdatingImages'
  | 'isUpdatingImages'
>) {
  return (
    <>
      <h3>{t('settings.general.title')}</h3>
      <div className="journalit-settings-links">
        <ExternalLinkButton
          url="https://journalit.co/docs"
          label={t('settings.general.docs')}
          iconRef={docsIconRef}
        />
        <ExternalLinkButton
          url="https://discord.gg/AkSw3D9h8b"
          label={t('settings.general.discord')}
          iconRef={discordIconRef}
        />
        <ExternalLinkButton
          url="https://github.com/Cursivez/journalit"
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
            options={getCurrencyOptions()}
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
                  handleDisplayNameConfirm();
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
                  onClick={handleDisplayNameConfirm}
                  aria-label={t('settings.general.display-name-confirm-aria')}
                  className="journalit-settings-display-name-button journalit-settings-display-name-button--confirm"
                >
                  ✓
                </button>
                <button
                  onClick={handleDisplayNameCancel}
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

      
      <Accordion
        title={t('settings.general.home-view-settings')}
        defaultExpanded={false}
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
      </Accordion>

      
      <Accordion
        title={t('settings.general.navigation-sidebar')}
        defaultExpanded={false}
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
                    ...DEFAULT_SETTINGS.navigation!,
                    tabBehavior: newValue as SidebarTabBehavior,
                    items: DEFAULT_SETTINGS.navigation?.items ?? [],
                  };
                } else {
                  plugin.settings.navigation.tabBehavior =
                    newValue as SidebarTabBehavior;
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
      </Accordion>

      <GeneralFolderSettingsSection
        plugin={plugin}
        journalFolderPath={journalFolderPath}
        handleJournalFolderPathChange={handleJournalFolderPathChange}
        setIsUpdatingImages={setIsUpdatingImages}
        isUpdatingImages={isUpdatingImages}
      />
    </>
  );
}

export const GeneralTab: React.FC<GeneralTabProps> = (props) => {
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
    handleCurrencyChange,
    handleDateFormatChange,
    handleDefaultRiskAmountChange,
    handleDisplayNameCancel,
    handleDisplayNameConfirm,
    handleDisplayNameInputChange,
    handleDisplayRMultiplesToggle,
    handleDollarValueInputToggle,
    handleFilterRecentItemsToggle,
    handleHomeStartupBehaviorChange,
    handleJournalFolderPathChange,
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
        handleJournalFolderPathChange={handleJournalFolderPathChange}
        setIsUpdatingImages={setIsUpdatingImages}
        isUpdatingImages={isUpdatingImages}
      />

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
        handleIncludeCopyAccountsToggle={handleIncludeCopyAccountsToggle}
        handleMaeMfeInputModeChange={handleMaeMfeInputModeChange}
        maeMfeInputModeOptions={maeMfeInputModeOptions}
      />

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
      />
    </div>
  );
};
