

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Settings,
  Check,
  Plus,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from '../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../main';
import {
  AVAILABLE_HOME_WIDGETS,
  DEFAULT_HOME_WIDGETS,
  getHomeWidgetById,
} from './homeTypes';
import { LAYOUT_BOTTOM_POSITION } from './homeLayoutUtils';
import { generateUUID } from '../../utils/uuid';
import { DashboardDataProvider } from '../dashboard/context/DashboardDataContext';
import { HomePeriodProvider } from './context/HomePeriodContext';
import { HomeAccountProvider } from './context/HomeAccountContext';
import { HomeGridLayout } from './HomeGridLayout';
import { HomeAccountsDataProvider } from './context/HomeAccountsDataContext';
import { QuickLinksRow } from './QuickLinksRow';
import { HomeWidgetSelector } from './components/HomeWidgetSelector';
import { HomeAccountFilter } from './components/HomeAccountFilter';
import { HomeTradeTypeFilter } from './components/HomeTradeTypeFilter';
import {
  QuickLinkButton,
  DEFAULT_SETTINGS,
  HomePeriod,
  HomeQuickLinksPosition,
} from '../../settings/types';
import { useEventBus } from '../../hooks/useEventBus';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideCurrentStepId,
  useGuideTarget,
} from '../../guides/GuideRuntimeLayer';
import {
  HOME_ADD_WIDGET_BUTTON_TARGET_ID,
  HOME_EDIT_BUTTON_TARGET_ID,
  HOME_EDIT_MODE_DISABLED_ACTION_ID,
  HOME_EDIT_MODE_ENABLED_ACTION_ID,
  HOME_FILTERS_TARGET_ID,
  HOME_GRID_TARGET_ID,
  HOME_QUICK_LINKS_POSITION_BUTTON_TARGET_ID,
  HOME_QUICK_LINKS_TARGET_ID,
  HOME_WIDGET_SELECTOR_OPENED_ACTION_ID,
} from '../../guides/homeGuideIds';
import {
  collectAvailableHomeAccounts,
  normalizeHomeAccountSelection,
  normalizeHomeTradeTypes,
  remapHomeSelectedAccounts,
  type HomeAccountTradeSnapshot,
} from './utils/homeTradeTypeUtils';
import { areAccountSelectionsEqual } from '../shared/filters/remapSelectedAccounts';
import type { TradeChangedPayload } from '../../services/events/types';
import { t, hasTranslation } from '../../lang/helpers';

const asHomeAccountTradeSnapshots = (
  value: unknown
): HomeAccountTradeSnapshot[] =>
  Array.isArray(value)
    ? value.filter((item): item is HomeAccountTradeSnapshot =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];

interface HomePageProps {
  plugin: JournalitPlugin;
}







const questionOnlyGreetingKeys = [
  'home.greeting.still-up',
  'home.greeting.late-night',
  'home.greeting.midnight-oil',
  'home.greeting.ready-conquer',
  'home.greeting.hows-it-going',
  'home.greeting.winding-down',
  'home.greeting.how-did-today-go',
];

interface GreetingResult {
  jsx: React.ReactNode;
  originalString: string;
}

const HOME_PERIODS: HomePeriod[] = ['month', 'quarter', 'year', 'lifetime'];


const getPeriodLabels = (): Record<HomePeriod, string> => ({
  month: t('home.period.month'),
  quarter: t('home.period.quarter'),
  year: t('home.period.year'),
  lifetime: t('home.period.lifetime'),
});

function useHomePageModel(plugin: JournalitPlugin) {
  
  const isFirstTimeUser = useCallback((): boolean => {
    const ONBOARDING_SHOWN_KEY = `journalit-onboarding-ever-shown-${plugin.app.vault.getName()}`;
    return !plugin.app.loadLocalStorage(ONBOARDING_SHOWN_KEY);
  }, [plugin]);

  const isQuestion = useCallback((greetingKey: string): boolean => {
    if (questionOnlyGreetingKeys.includes(greetingKey)) {
      return true;
    }

    const greetingText = hasTranslation(greetingKey)
      ? t(greetingKey)
      : greetingKey;

    return greetingText.trim().endsWith('?');
  }, []);

  const getGreeting = useCallback((): GreetingResult => {
    if (isFirstTimeUser()) {
      const welcomeMessage = t('home.greeting.welcome');
      return { jsx: welcomeMessage, originalString: welcomeMessage };
    }

    const displayName = plugin.settings.general?.displayName || '';
    const now = new Date();
    const hour = now.getHours();

    const lateNightGreetingKeys = [
      'home.greeting.nightowl',
      'home.greeting.still-up',
      'home.greeting.late-night',
      'home.greeting.midnight-oil',
    ];
    const morningGreetingKeys = [
      'home.greeting.good-morning',
      'home.greeting.rise-and-shine',
      'home.greeting.morning-trader',
      'home.greeting.ready-conquer',
      'home.greeting.fresh-start',
    ];
    const afternoonGreetingKeys = [
      'home.greeting.good-afternoon',
      'home.greeting.day-going-well',
      'home.greeting.afternoon-checkin',
      'home.greeting.midday-momentum',
      'home.greeting.hows-it-going',
    ];
    const eveningGreetingKeys = [
      'home.greeting.good-evening',
      'home.greeting.winding-down',
      'home.greeting.evening-review',
      'home.greeting.how-did-today-go',
      'home.greeting.time-to-reflect',
    ];
    const universalGreetingKeys = [
      'home.greeting.welcome-back',
      'home.greeting.hey-there',
      'home.greeting.good-to-see-you',
    ];

    let timeBasedGreetingKeys: string[] = [];
    if (hour >= 0 && hour < 5) {
      timeBasedGreetingKeys = lateNightGreetingKeys;
    } else if (hour >= 5 && hour < 11) {
      timeBasedGreetingKeys = morningGreetingKeys;
    } else if (hour >= 11 && hour < 17) {
      timeBasedGreetingKeys = afternoonGreetingKeys;
    } else {
      timeBasedGreetingKeys = eveningGreetingKeys;
    }

    const allGreetingKeys = [
      ...timeBasedGreetingKeys,
      ...universalGreetingKeys,
    ];
    const randomIndex = Math.floor(Math.random() * allGreetingKeys.length);
    const selectedGreetingKey = allGreetingKeys[randomIndex];
    const selectedGreeting = hasTranslation(selectedGreetingKey)
      ? t(selectedGreetingKey)
      : selectedGreetingKey;

    if (questionOnlyGreetingKeys.includes(selectedGreetingKey)) {
      if (displayName) {
        const jsx = (
          <>
            <span className="journalit-home-greeting-normal">
              {t('home.greeting.hey')}{' '}
            </span>
            <span className="journalit-home-greeting-strong">
              {displayName}
            </span>
            <span className="journalit-home-greeting-normal">
              , {selectedGreeting}
            </span>
          </>
        );
        return {
          jsx,
          originalString: `${t('home.greeting.hey')} ${displayName}, ${selectedGreeting}`,
        };
      } else {
        return { jsx: selectedGreeting, originalString: selectedGreeting };
      }
    }

    if (displayName) {
      const jsx = (
        <>
          <span className="journalit-home-greeting-normal">
            {selectedGreeting},{' '}
          </span>
          <span className="journalit-home-greeting-strong">{displayName}</span>
        </>
      );
      return { jsx, originalString: `${selectedGreeting}, ${displayName}` };
    }

    return { jsx: selectedGreeting, originalString: selectedGreeting };
  }, [plugin, isFirstTimeUser]);

  const generateSubtitle = useCallback(
    (greetingIsQuestion: boolean): string => {
      if (isFirstTimeUser()) {
        return t('home.subtitle.first-time');
      }

      const statementSubtitleKeys = [
        'home.subtitle.see-how-doing',
        'home.subtitle.elevate-trading',
        'home.subtitle.journey-continues',
        'home.subtitle.check-progress',
      ];

      const questionSubtitleKeys = [
        'home.subtitle.ready-elevate',
        'home.subtitle.agenda-today',
        'home.subtitle.trading-going',
      ];

      const subtitleKeys = greetingIsQuestion
        ? questionSubtitleKeys
        : statementSubtitleKeys;
      const randomIndex = Math.floor(Math.random() * subtitleKeys.length);
      const subtitleKey = subtitleKeys[randomIndex];
      return hasTranslation(subtitleKey) ? t(subtitleKey) : subtitleKey;
    },
    [isFirstTimeUser]
  );

  const [isEditing, setIsEditing] = useState(false);

  
  const [selectedPeriod, setSelectedPeriod] = useState<HomePeriod>(() => {
    return plugin.uiStateManager.getState().selectedPeriod || 'lifetime';
  });
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(() => {
    return plugin.uiStateManager.getState().selectedHomeAccounts || [];
  });
  const [selectedTradeTypes, setSelectedTradeTypes] = useState(() =>
    normalizeHomeTradeTypes(
      plugin.uiStateManager.getState().selectedHomeTradeTypes
    )
  );
  const [explicitAllAccountsSelected, setExplicitAllAccountsSelected] =
    useState(
      () =>
        plugin.uiStateManager.getState().homeAccountFilterSelectAllActive ??
        false
    );
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [tradeCount, setTradeCount] = useState<number | null>(null);
  const [gettingStartedDismissed, setGettingStartedDismissed] = useState(
    () => plugin.uiStateManager.getState().gettingStartedDismissed ?? false
  );
  const emitGuideAction = useGuideAction();
  const currentGuideStepId = useGuideCurrentStepId();
  const registerFiltersTarget = useGuideTarget(HOME_FILTERS_TARGET_ID);
  const registerEditButtonTarget = useGuideTarget(HOME_EDIT_BUTTON_TARGET_ID);
  const registerAddWidgetButtonTarget = useGuideTarget(
    HOME_ADD_WIDGET_BUTTON_TARGET_ID
  );
  const registerQuickLinksPositionButtonTarget = useGuideTarget(
    HOME_QUICK_LINKS_POSITION_BUTTON_TARGET_ID
  );
  const registerQuickLinksTarget = useGuideTarget(HOME_QUICK_LINKS_TARGET_ID);
  const registerGridTarget = useGuideTarget(HOME_GRID_TARGET_ID);

  const isTradeCountLoadingRef = useRef(false);
  const homeTradeDataReadyRef = useRef(false);
  const homeStartupRefreshDoneRef = useRef(false);
  const homeAuthoritativeBootstrapDoneRef = useRef(false);
  const homeAuthoritativeBootstrapPromiseRef = useRef<Promise<void> | null>(
    null
  );
  const autoAddGettingStartedRef = useRef(false);
  const periodDropdownRef = useRef<HTMLDivElement>(null);
  const selectedAccountsRef = useRef<string[]>(selectedAccounts);

  useEffect(() => {
    selectedAccountsRef.current = selectedAccounts;
  }, [selectedAccounts]);

  
  const getWidgetsFromLayout = useCallback((): string[] => {
    const homeSettings = plugin.settings.home;
    if (!homeSettings?.layouts) return DEFAULT_HOME_WIDGETS;

    const activeLayoutName = homeSettings.activeLayout || 'Default';
    const layout = homeSettings.layouts[activeLayoutName];
    if (!layout?.lg || layout.lg.length === 0) return DEFAULT_HOME_WIDGETS;

    
    
    const allWidgetIds = layout.lg.map((item) => item.i);
    const knownWidgetIds = allWidgetIds.filter(
      (widgetId) => getHomeWidgetById(widgetId) !== undefined
    );

    
    const unknownWidgetIds = allWidgetIds.filter(
      (id) => !knownWidgetIds.includes(id)
    );
    if (unknownWidgetIds.length > 0) {
      console.warn(
        'Journalit HomePage: Filtered unknown widget types from layout:',
        unknownWidgetIds
      );
    }

    return knownWidgetIds;
  }, [plugin]);

  
  const [activeWidgets, setActiveWidgets] =
    useState<string[]>(getWidgetsFromLayout);

  
  const initializeWidgets = useCallback(() => {
    const widgetsFromLayout = getWidgetsFromLayout();
    setActiveWidgets(widgetsFromLayout);
  }, [getWidgetsFromLayout]);

  
  useEventBus(
    'layout:changed',
    useCallback(
      (payload) => {
        if (payload.view === 'home') {
          initializeWidgets();
        }
      },
      [initializeWidgets]
    )
  );

  useEffect(() => {}, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      const ActiveDocumentNode = window.activeDocument.defaultView?.Node;
      if (
        !periodDropdownRef.current ||
        !ActiveDocumentNode ||
        !(target instanceof ActiveDocumentNode)
      ) {
        setShowPeriodDropdown(false);
        return;
      }

      if (!periodDropdownRef.current.contains(target)) {
        setShowPeriodDropdown(false);
      }
    };

    window.activeDocument.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.activeDocument.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const previousIsEditingRef = useRef(isEditing);

  useEffect(() => {
    if (isEditing) {
      emitGuideAction(HOME_EDIT_MODE_ENABLED_ACTION_ID);
    } else if (previousIsEditingRef.current) {
      emitGuideAction(HOME_EDIT_MODE_DISABLED_ACTION_ID);
    }

    previousIsEditingRef.current = isEditing;
  }, [emitGuideAction, isEditing]);

  
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const suppressGuideWidgetSelectorCloseRef = useRef(false);

  useEffect(() => {
    if (!showWidgetSelector) {
      return;
    }

    emitGuideAction(HOME_WIDGET_SELECTOR_OPENED_ACTION_ID);
  }, [emitGuideAction, showWidgetSelector]);

  useEffect(() => {
    if (currentGuideStepId === 'widget-picker') {
      suppressGuideWidgetSelectorCloseRef.current = false;
      return;
    }

    if (currentGuideStepId !== 'move-and-resize' || !showWidgetSelector) {
      return;
    }

    if (suppressGuideWidgetSelectorCloseRef.current) {
      return;
    }

    setShowWidgetSelector(false);
  }, [currentGuideStepId, showWidgetSelector]);

  const handleGuideBack = useCallback(
    async ({ toStepId }: { toStepId: string }) => {
      if (toStepId === 'intro' || toStepId === 'filters') {
        setIsEditing(false);
        setShowWidgetSelector(false);
        return;
      }

      if (toStepId === 'widget-picker') {
        suppressGuideWidgetSelectorCloseRef.current = true;
        setIsEditing(true);
        setShowWidgetSelector(true);
        await new Promise((resolve) => window.setTimeout(resolve, 0));
        return;
      }

      if (toStepId === 'customize') {
        setIsEditing(false);
        setShowWidgetSelector(false);
        return;
      }

      if (
        toStepId === 'quick-links-position' ||
        toStepId === 'quick-links' ||
        toStepId === 'add-widget' ||
        toStepId === 'move-and-resize' ||
        toStepId === 'save-layout'
      ) {
        setIsEditing(true);
        setShowWidgetSelector(false);
      }
    },
    []
  );

  useGuideBackHandler(handleGuideBack);

  
  useEffect(() => {
    initializeWidgets();
  }, [initializeWidgets]);
  
  const [quickLinks, setQuickLinks] = useState<QuickLinkButton[]>(() => {
    return (
      plugin.settings.home?.quickLinks ||
      DEFAULT_SETTINGS.home?.quickLinks ||
      []
    );
  });
  const [quickLinksPosition, setQuickLinksPosition] =
    useState<HomeQuickLinksPosition>(() => {
      return (
        plugin.settings.home?.quickLinksPosition ||
        DEFAULT_SETTINGS.home?.quickLinksPosition ||
        'belowWidgets'
      );
    });

  
  
  
  const [
    { greeting: memoizedGreeting, subtitle: memoizedSubtitle },
    setGreetingState,
  ] = useState(() => {
    const greetingResult = getGreeting();
    const greetingIsQuestion = isQuestion(greetingResult.originalString);
    return {
      greeting: greetingResult.jsx,
      subtitle: generateSubtitle(greetingIsQuestion),
    };
  });

  
  useEffect(() => {
    if (!plugin.settings.home) {
      plugin.settings.home = {
        layouts: {
          Default: {
            lg: [
              { i: 'weeklySummary', x: 2, y: 4, w: 4, h: 4 },
              { i: 'gettingStarted', x: 6, y: 2, w: 3, h: 6 },
              { i: 'unreviewedTrades', x: 6, y: 0, w: 3, h: 2 },
              { i: 'recentItems', x: 0, y: 4, w: 2, h: 4 },
              { i: 'positionSize', x: 9, y: 0, w: 3, h: 8 },
              { i: 'yearHeatmap', x: 0, y: 0, w: 6, h: 4 },
            ],
            md: [
              { i: 'weeklySummary', x: 3, y: 1, w: 3, h: 5 },
              { i: 'gettingStarted', x: 0, y: 0, w: 3, h: 6 },
              { i: 'unreviewedTrades', x: 3, y: 0, w: 3, h: 1 },
              { i: 'yearHeatmap', x: 0, y: 6, w: 6, h: 5 },
              { i: 'positionSize', x: 0, y: 11, w: 3, h: 8 },
              { i: 'recentItems', x: 3, y: 11, w: 3, h: 8 },
            ],
            sm: [
              { i: 'weeklySummary', x: 0, y: 1, w: 2, h: 5 },
              { i: 'gettingStarted', x: 2, y: 0, w: 2, h: 6 },
              { i: 'unreviewedTrades', x: 0, y: 0, w: 2, h: 1 },
              { i: 'yearHeatmap', x: 0, y: 6, w: 4, h: 5 },
              { i: 'recentItems', x: 0, y: 11, w: 2, h: 7 },
              { i: 'positionSize', x: 2, y: 11, w: 2, h: 7 },
            ],
            xs: [
              { i: 'gettingStarted', x: 0, y: 0, w: 1, h: 6 },
              { i: 'recentItems', x: 1, y: 0, w: 1, h: 6 },
              { i: 'weeklySummary', x: 0, y: 6, w: 2, h: 4 },
              { i: 'unreviewedTrades', x: 0, y: 10, w: 2, h: 2 },
              { i: 'yearHeatmap', x: 0, y: 12, w: 2, h: 5 },
              { i: 'positionSize', x: 0, y: 17, w: 2, h: 7 },
            ],
            xxs: [
              { i: 'gettingStarted', x: 0, y: 0, w: 1, h: 6 },
              { i: 'weeklySummary', x: 0, y: 6, w: 1, h: 4 },
              { i: 'unreviewedTrades', x: 0, y: 10, w: 1, h: 2 },
              { i: 'recentItems', x: 0, y: 12, w: 1, h: 5 },
              { i: 'yearHeatmap', x: 0, y: 17, w: 1, h: 5 },
              { i: 'positionSize', x: 0, y: 22, w: 1, h: 7 },
            ],
          },
        },
        activeLayout: 'Default',
        recentItems: [],
        quickLinksPosition: 'belowWidgets',
      };
      
      void plugin.saveSettings();
    }
  }, [plugin]);

  const refreshGreetingState = useCallback(() => {
    const greetingResult = getGreeting();
    const greetingIsQuestion = isQuestion(greetingResult.originalString);
    setGreetingState({
      greeting: greetingResult.jsx,
      subtitle: generateSubtitle(greetingIsQuestion),
    });
  }, [getGreeting, isQuestion, generateSubtitle]);
  const refreshGreetingStateRef = useRef(refreshGreetingState);

  useEffect(() => {
    refreshGreetingStateRef.current = refreshGreetingState;
  }, [refreshGreetingState]);

  
  useEffect(() => {
    const refreshCurrentGreetingState = () => {
      refreshGreetingStateRef.current();
    };

    window.addEventListener(
      'journalit:display-name-changed',
      refreshCurrentGreetingState
    );

    return () => {
      window.removeEventListener(
        'journalit:display-name-changed',
        refreshCurrentGreetingState
      );
    };
  }, []);

  const handleToggleEdit = () => {
    const nextIsEditing = !isEditing;
    setIsEditing(nextIsEditing);

    if (!nextIsEditing) {
      setShowPeriodDropdown(false);
      setShowWidgetSelector(false);
    }
  };

  const handleToggleQuickLinksPosition = useCallback(async () => {
    if (!plugin.settings.home) {
      return;
    }

    const previousPosition = quickLinksPosition;
    const nextPosition: HomeQuickLinksPosition =
      previousPosition === 'belowWidgets' ? 'aboveWidgets' : 'belowWidgets';

    setQuickLinksPosition(nextPosition);
    plugin.settings.home.quickLinksPosition = nextPosition;

    try {
      await plugin.saveSettings();
    } catch (error) {
      console.error('Failed to save quick links position:', error);
      setQuickLinksPosition(previousPosition);
      plugin.settings.home.quickLinksPosition = previousPosition;
    }
  }, [plugin, quickLinksPosition]);

  
  const handlePeriodChange = useCallback(
    async (period: HomePeriod) => {
      setSelectedPeriod(period);
      setShowPeriodDropdown(false);

      
      await plugin.uiStateManager.updateState({
        selectedPeriod: period,
      });
    },
    [plugin]
  );

  const handleAccountFilterChange = useCallback(
    async (accounts: string[], explicitAllSelected: boolean) => {
      const normalizedSelection = normalizeHomeAccountSelection(
        availableAccounts,
        accounts,
        explicitAllSelected
      );

      setSelectedAccounts(normalizedSelection.selectedAccounts);
      setExplicitAllAccountsSelected(normalizedSelection.explicitAllSelected);

      await plugin.uiStateManager.updateState({
        selectedHomeAccounts: normalizedSelection.selectedAccounts,
        homeAccountFilterSelectAllActive:
          normalizedSelection.explicitAllSelected,
      });
    },
    [availableAccounts, plugin]
  );

  const handleTradeTypeFilterChange = useCallback(
    async (tradeTypes: ('regular' | 'backtest')[]) => {
      const normalizedTradeTypes = normalizeHomeTradeTypes(tradeTypes);
      setSelectedTradeTypes(normalizedTradeTypes);

      await plugin.uiStateManager.updateState({
        selectedHomeTradeTypes: normalizedTradeTypes,
      });
    },
    [plugin]
  );

  const ensureHomeTradeDataReady = useCallback(async () => {
    if (homeTradeDataReadyRef.current) {
      return;
    }

    try {
      await plugin.tradeService.waitForTradeDataReady();
      homeTradeDataReadyRef.current = true;
    } catch (error) {
      console.error(
        '[HomePage] Failed waiting for trade data readiness:',
        error
      );
    }
  }, [plugin]);

  const resolveMappedAccountName = useCallback(
    (accountId: string) =>
      plugin.settings.backendIntegration?.accountMapping?.[accountId],
    [plugin]
  );

  const getHomeAccountCatalogNames = useCallback(
    async (tradeTypes: string[]): Promise<string[]> => {
      if (!tradeTypes.includes('regular')) {
        return [];
      }

      const accountPageService =
        await plugin.serviceManager.getAccountPageService();
      const accounts = await accountPageService.getAllEnhancedAccounts([
        'regular',
      ]);

      return accounts
        .map((account) => account.name || account.accountName)
        .filter((accountName): accountName is string => Boolean(accountName));
    },
    [plugin]
  );

  const persistRemappedHomeAccounts = useCallback(
    async (remappedSelectedAccounts: string[]) => {
      if (
        areAccountSelectionsEqual(
          selectedAccountsRef.current,
          remappedSelectedAccounts
        )
      ) {
        return;
      }

      await plugin.uiStateManager.updateState({
        selectedHomeAccounts: remappedSelectedAccounts,
        homeAccountFilterSelectAllActive: explicitAllAccountsSelected,
      });
    },
    [explicitAllAccountsSelected, plugin]
  );

  const bootstrapHomeAuthoritativeData = useCallback(async () => {
    if (homeAuthoritativeBootstrapDoneRef.current) {
      return;
    }

    if (homeAuthoritativeBootstrapPromiseRef.current) {
      await homeAuthoritativeBootstrapPromiseRef.current;
      return;
    }

    homeAuthoritativeBootstrapPromiseRef.current = (async () => {
      try {
        await ensureHomeTradeDataReady();

        const tradeService = plugin.serviceManager.getTradeService();
        const missedTradeService =
          await plugin.serviceManager.getMissedTradeService();

        const [rawAllTrades, missedTradeFiles, catalogAccountNames] =
          await Promise.all([
            tradeService.getTradeData({ fresh: true }),
            missedTradeService.getMissedTrades(
              new Date('2000-01-01T00:00:00.000Z'),
              new Date('2099-12-31T23:59:59.999Z')
            ),
            getHomeAccountCatalogNames(selectedTradeTypes),
          ]);

        const allTrades = asHomeAccountTradeSnapshots(rawAllTrades);
        const nextAccounts = collectAvailableHomeAccounts(
          allTrades,
          selectedTradeTypes,
          catalogAccountNames,
          {
            resolveAccountIdDisplayName: resolveMappedAccountName,
          }
        );

        const remappedSelectedAccounts = explicitAllAccountsSelected
          ? nextAccounts
          : remapHomeSelectedAccounts(
              allTrades,
              selectedAccountsRef.current,
              selectedTradeTypes,
              nextAccounts,
              {
                resolveAccountIdDisplayName: resolveMappedAccountName,
              }
            );

        setAvailableAccounts(nextAccounts);
        setSelectedAccounts((currentSelection) =>
          areAccountSelectionsEqual(currentSelection, remappedSelectedAccounts)
            ? currentSelection
            : remappedSelectedAccounts
        );
        await persistRemappedHomeAccounts(remappedSelectedAccounts);
        setTradeCount(allTrades.length + missedTradeFiles.length);
        homeAuthoritativeBootstrapDoneRef.current = true;
      } catch (error) {
        console.error(
          '[HomePage] Failed to bootstrap authoritative home data:',
          error
        );
      } finally {
        homeAuthoritativeBootstrapPromiseRef.current = null;
      }
    })();

    await homeAuthoritativeBootstrapPromiseRef.current;
  }, [
    ensureHomeTradeDataReady,
    explicitAllAccountsSelected,
    getHomeAccountCatalogNames,
    persistRemappedHomeAccounts,
    plugin,
    selectedTradeTypes,
    resolveMappedAccountName,
  ]);

  const refreshAvailableAccounts = useCallback(async () => {
    try {
      if (!homeAuthoritativeBootstrapDoneRef.current) {
        await bootstrapHomeAuthoritativeData();
      }

      await ensureHomeTradeDataReady();

      const [rawAllTrades, catalogAccountNames] = await Promise.all([
        plugin.tradeService.getTradeData({ fresh: false }),
        getHomeAccountCatalogNames(selectedTradeTypes),
      ]);
      const allTrades = asHomeAccountTradeSnapshots(rawAllTrades);
      const nextAccounts = collectAvailableHomeAccounts(
        allTrades,
        selectedTradeTypes,
        catalogAccountNames,
        {
          resolveAccountIdDisplayName: resolveMappedAccountName,
        }
      );
      const remappedSelectedAccounts = explicitAllAccountsSelected
        ? nextAccounts
        : remapHomeSelectedAccounts(
            allTrades,
            selectedAccountsRef.current,
            selectedTradeTypes,
            nextAccounts,
            {
              resolveAccountIdDisplayName: resolveMappedAccountName,
            }
          );

      setAvailableAccounts(nextAccounts);
      setSelectedAccounts((currentSelection) =>
        areAccountSelectionsEqual(currentSelection, remappedSelectedAccounts)
          ? currentSelection
          : remappedSelectedAccounts
      );
      await persistRemappedHomeAccounts(remappedSelectedAccounts);
    } catch (error) {
      console.error('[HomePage] Failed to load available accounts:', error);
    }
  }, [
    bootstrapHomeAuthoritativeData,
    ensureHomeTradeDataReady,
    explicitAllAccountsSelected,
    getHomeAccountCatalogNames,
    persistRemappedHomeAccounts,
    plugin,
    selectedTradeTypes,
    resolveMappedAccountName,
  ]);

  const applyTradeCountDelta = useCallback((delta: number) => {
    if (!Number.isFinite(delta) || delta === 0) {
      return;
    }

    setTradeCount((current) => {
      if (current === null) {
        return current;
      }

      return Math.max(0, current + delta);
    });
  }, []);

  const refreshTradeCount = useCallback(async () => {
    if (isTradeCountLoadingRef.current) {
      return;
    }

    isTradeCountLoadingRef.current = true;

    try {
      if (!homeAuthoritativeBootstrapDoneRef.current) {
        await bootstrapHomeAuthoritativeData();
        return;
      }

      const tradeService = plugin.serviceManager.getTradeService();
      const missedTradeService =
        await plugin.serviceManager.getMissedTradeService();

      await ensureHomeTradeDataReady();

      const [tradeCountTotal, missedTradeCount] = await Promise.all([
        tradeService.getTradeCount(),
        missedTradeService.getMissedTradeCount(),
      ]);

      setTradeCount(tradeCountTotal + missedTradeCount);
    } catch (error) {
      console.error('[HomePage] Failed to refresh trade count:', error);
    } finally {
      isTradeCountLoadingRef.current = false;
    }
  }, [bootstrapHomeAuthoritativeData, ensureHomeTradeDataReady, plugin]);

  const handleTradeChanged = useCallback(
    (payload: TradeChangedPayload) => {
      if (!payload || tradeCount === null) {
        void refreshTradeCount();
        return;
      }

      if (payload.action === 'created') {
        applyTradeCountDelta(payload.filePaths?.length ?? 1);
        return;
      }

      if (payload.action === 'deleted') {
        const removedCount = payload.filePaths?.length ?? 1;
        applyTradeCountDelta(-removedCount);
        return;
      }

      if (payload.action === 'batch') {
        const batchCount = payload.importedCount ?? payload.filePaths?.length;
        if (batchCount !== undefined) {
          applyTradeCountDelta(batchCount);
          return;
        }
      }

      void refreshTradeCount();
    },
    [applyTradeCountDelta, refreshTradeCount, tradeCount]
  );

  useEventBus('trade:changed', handleTradeChanged);
  useEventBus('trade:changed', () => {
    void refreshAvailableAccounts();
  });
  useEventBus('missed-trade:changed', refreshTradeCount);
  useEventBus('backtest-trade:changed', refreshTradeCount);
  useEventBus('backtest-trade:changed', () => {
    void refreshAvailableAccounts();
  });
  useEventBus('account:changed', () => {
    void refreshAvailableAccounts();
  });

  useEffect(() => {
    if (homeStartupRefreshDoneRef.current) {
      return;
    }

    homeStartupRefreshDoneRef.current = true;

    void bootstrapHomeAuthoritativeData();
  }, [bootstrapHomeAuthoritativeData]);

  useEffect(() => {
    let isCancelled = false;

    const refreshAccountsForTradeTypeChange = async () => {
      try {
        if (!homeAuthoritativeBootstrapDoneRef.current) {
          await bootstrapHomeAuthoritativeData();
        }

        await ensureHomeTradeDataReady();

        const [rawAllTrades, catalogAccountNames] = await Promise.all([
          plugin.tradeService.getTradeData({ fresh: false }),
          getHomeAccountCatalogNames(selectedTradeTypes),
        ]);
        const allTrades = asHomeAccountTradeSnapshots(rawAllTrades);
        const nextAccounts = collectAvailableHomeAccounts(
          allTrades,
          selectedTradeTypes,
          catalogAccountNames,
          {
            resolveAccountIdDisplayName: resolveMappedAccountName,
          }
        );
        const remappedSelectedAccounts = explicitAllAccountsSelected
          ? nextAccounts
          : remapHomeSelectedAccounts(
              allTrades,
              selectedAccountsRef.current,
              selectedTradeTypes,
              nextAccounts,
              {
                resolveAccountIdDisplayName: resolveMappedAccountName,
              }
            );

        if (!isCancelled) {
          setAvailableAccounts(nextAccounts);
          setSelectedAccounts((currentSelection) =>
            areAccountSelectionsEqual(
              currentSelection,
              remappedSelectedAccounts
            )
              ? currentSelection
              : remappedSelectedAccounts
          );
          await persistRemappedHomeAccounts(remappedSelectedAccounts);
        }
      } catch (error) {
        console.error(
          '[HomePage] Failed to refresh accounts for trade-type change:',
          error
        );
      }
    };

    void refreshAccountsForTradeTypeChange();

    return () => {
      isCancelled = true;
    };
  }, [
    bootstrapHomeAuthoritativeData,
    ensureHomeTradeDataReady,
    explicitAllAccountsSelected,
    getHomeAccountCatalogNames,
    persistRemappedHomeAccounts,
    plugin,
    selectedTradeTypes,
    resolveMappedAccountName,
  ]);

  useEffect(() => {
    const normalizedSelection = normalizeHomeAccountSelection(
      availableAccounts,
      selectedAccounts,
      explicitAllAccountsSelected
    );

    const accountsChanged =
      normalizedSelection.selectedAccounts.length !== selectedAccounts.length ||
      normalizedSelection.selectedAccounts.some(
        (account, index) => selectedAccounts[index] !== account
      );
    const explicitChanged =
      normalizedSelection.explicitAllSelected !== explicitAllAccountsSelected;

    if (!accountsChanged && !explicitChanged) {
      return;
    }

    setSelectedAccounts(normalizedSelection.selectedAccounts);
    setExplicitAllAccountsSelected(normalizedSelection.explicitAllSelected);

    void plugin.uiStateManager.updateState({
      selectedHomeAccounts: normalizedSelection.selectedAccounts,
      homeAccountFilterSelectAllActive: normalizedSelection.explicitAllSelected,
    });
  }, [
    availableAccounts,
    explicitAllAccountsSelected,
    plugin,
    selectedAccounts,
  ]);

  const hasVisibleQuickLinks = useMemo(
    () => quickLinks.some((quickLink) => quickLink.visible),
    [quickLinks]
  );

  
  const hiddenQuickLinks = useMemo(() => {
    return quickLinks.filter((ql) => !ql.visible);
  }, [quickLinks]);

  
  const handleRestoreQuickLink = useCallback(
    async (quickLinkId: string) => {
      const updatedQuickLinks = quickLinks.map((ql) =>
        ql.id === quickLinkId ? { ...ql, visible: true } : ql
      );

      
      setQuickLinks(updatedQuickLinks);

      
      plugin.settings.home = {
        ...plugin.settings.home!,
        quickLinks: updatedQuickLinks,
      };
      try {
        await plugin.saveSettings();
      } catch (error) {
        console.error('Failed to save quick link visibility:', error);
      }
    },
    [quickLinks, plugin]
  );

  
  const prevQuickLinksRef = useRef<QuickLinkButton[] | undefined>(undefined);

  
  useEffect(() => {
    const settingsQuickLinks = plugin.settings.home?.quickLinks;
    if (!settingsQuickLinks) return;

    
    if (settingsQuickLinks === prevQuickLinksRef.current) return;

    
    const hasChanged =
      settingsQuickLinks.length !== quickLinks.length ||
      settingsQuickLinks.some(
        (ql, i) =>
          ql.id !== quickLinks[i]?.id || ql.visible !== quickLinks[i]?.visible
      );

    if (hasChanged) {
      setQuickLinks(settingsQuickLinks);
    }
    prevQuickLinksRef.current = settingsQuickLinks;
  }, [plugin.settings.home?.quickLinks, quickLinks]);

  useEffect(() => {
    const settingsQuickLinksPosition =
      plugin.settings.home?.quickLinksPosition ||
      DEFAULT_SETTINGS.home?.quickLinksPosition ||
      'belowWidgets';

    if (settingsQuickLinksPosition !== quickLinksPosition) {
      setQuickLinksPosition(settingsQuickLinksPosition);
    }
  }, [plugin.settings.home?.quickLinksPosition, quickLinksPosition]);

  
  const handleAddWidget = useCallback(
    async (widgetId: string) => {
      
      const widgetDef = AVAILABLE_HOME_WIDGETS.find((w) => w.id === widgetId);
      const finalWidgetId = widgetDef?.configurable
        ? `${widgetId}-${generateUUID()}`
        : widgetId;

      

      
      if (plugin.settings.home) {
        const widgetDef = getHomeWidgetById(finalWidgetId);
        if (widgetDef) {
          const cols = { lg: 12, md: 6, sm: 4, xs: 2, xxs: 1 };
          const currentLayoutName =
            plugin.settings.home.activeLayout || 'Default';
          const currentLayouts =
            plugin.settings.home.layouts[currentLayoutName];

          if (currentLayouts) {
            
            if (!currentLayouts.lg?.some((item) => item.i === finalWidgetId)) {
              currentLayouts.lg = [
                ...(currentLayouts.lg || []),
                {
                  i: finalWidgetId,
                  x: 0,
                  y: LAYOUT_BOTTOM_POSITION,
                  w: Math.min(widgetDef.defaultSize.w, cols.lg),
                  h: widgetDef.defaultSize.h,
                },
              ];
            }
            if (!currentLayouts.md?.some((item) => item.i === finalWidgetId)) {
              currentLayouts.md = [
                ...(currentLayouts.md || []),
                {
                  i: finalWidgetId,
                  x: 0,
                  y: LAYOUT_BOTTOM_POSITION,
                  w: Math.min(widgetDef.defaultSize.w, cols.md),
                  h: widgetDef.defaultSize.h,
                },
              ];
            }
            if (!currentLayouts.sm?.some((item) => item.i === finalWidgetId)) {
              currentLayouts.sm = [
                ...(currentLayouts.sm || []),
                {
                  i: finalWidgetId,
                  x: 0,
                  y: LAYOUT_BOTTOM_POSITION,
                  w: Math.min(widgetDef.defaultSize.w, cols.sm),
                  h: widgetDef.defaultSize.h,
                },
              ];
            }
            if (!currentLayouts.xs?.some((item) => item.i === finalWidgetId)) {
              currentLayouts.xs = [
                ...(currentLayouts.xs || []),
                {
                  i: finalWidgetId,
                  x: 0,
                  y: LAYOUT_BOTTOM_POSITION,
                  w: Math.min(widgetDef.defaultSize.w, cols.xs),
                  h: widgetDef.defaultSize.h,
                },
              ];
            }
            if (!currentLayouts.xxs?.some((item) => item.i === finalWidgetId)) {
              currentLayouts.xxs = [
                ...(currentLayouts.xxs || []),
                {
                  i: finalWidgetId,
                  x: 0,
                  y: LAYOUT_BOTTOM_POSITION,
                  w: 1,
                  h: widgetDef.defaultSize.h,
                },
              ];
            }
          }
        }

        
        await plugin.saveSettings();

        
        setActiveWidgets(getWidgetsFromLayout());
      }
    },
    [plugin, getWidgetsFromLayout]
  );

  useEffect(() => {
    if (tradeCount === null) {
      return;
    }

    if (tradeCount > 0) {
      return;
    }

    if (gettingStartedDismissed) {
      return;
    }

    if (activeWidgets.includes('gettingStarted')) {
      return;
    }

    if (autoAddGettingStartedRef.current) {
      return;
    }

    autoAddGettingStartedRef.current = true;
    void handleAddWidget('gettingStarted');
  }, [tradeCount, gettingStartedDismissed, activeWidgets, handleAddWidget]);

  
  const handleRemoveWidget = useCallback(
    async (widgetId: string) => {
      
      if (plugin.settings.home) {
        
        if (
          widgetId.startsWith('embeddedNote-') &&
          plugin.settings.home.embeddedNotes
        ) {
          delete plugin.settings.home.embeddedNotes[widgetId];
        }

        
        if (
          widgetId.startsWith('goalsProgress-') &&
          plugin.settings.home.goals
        ) {
          delete plugin.settings.home.goals[widgetId];
        }

        
        if (
          (widgetId === 'setupLeaderboard' ||
            widgetId.startsWith('setupLeaderboard-')) &&
          plugin.settings.home.topBreakdowns
        ) {
          delete plugin.settings.home.topBreakdowns[widgetId];
        }

        if (widgetId === 'gettingStarted') {
          setGettingStartedDismissed(true);
          await plugin.uiStateManager.updateState({
            gettingStartedDismissed: true,
          });
        }

        
        const currentLayoutName =
          plugin.settings.home.activeLayout || 'Default';
        const currentLayouts = plugin.settings.home.layouts[currentLayoutName];
        if (currentLayouts) {
          currentLayouts.lg =
            currentLayouts.lg?.filter((item) => item.i !== widgetId) || [];
          currentLayouts.md =
            currentLayouts.md?.filter((item) => item.i !== widgetId) || [];
          currentLayouts.sm =
            currentLayouts.sm?.filter((item) => item.i !== widgetId) || [];
          currentLayouts.xs =
            currentLayouts.xs?.filter((item) => item.i !== widgetId) || [];
          currentLayouts.xxs =
            currentLayouts.xxs?.filter((item) => item.i !== widgetId) || [];
        }

        
        await plugin.saveSettings();

        
        setActiveWidgets(getWidgetsFromLayout());
      }
    },
    [plugin, getWidgetsFromLayout]
  );

  const effectiveSelectedAccounts = useMemo(() => {
    if (explicitAllAccountsSelected) {
      return [];
    }

    return selectedAccounts;
  }, [explicitAllAccountsSelected, selectedAccounts]);

  
  
  
  
  const lifetimeFilters = useMemo(
    () => ({
      dateRange: [null, null] as [Date | null, Date | null],
      accounts: effectiveSelectedAccounts,
      tickers: [],
      setups: [],
      tradeTypes: [...selectedTradeTypes],
      statuses: [],
      tags: [],
      mistakes: [],
      customFieldFilters: {},
    }),
    [effectiveSelectedAccounts, selectedTradeTypes]
  );

  const hasAccountBackedHomeWidgets = useMemo(
    () =>
      activeWidgets.includes('aum') ||
      activeWidgets.includes('drawdownMonitor'),
    [activeWidgets]
  );

  return {
    memoizedGreeting,
    memoizedSubtitle,
    registerFiltersTarget,
    periodDropdownRef,
    showPeriodDropdown,
    setShowPeriodDropdown,
    selectedPeriod,
    handlePeriodChange,
    selectedTradeTypes,
    handleTradeTypeFilterChange,
    availableAccounts,
    selectedAccounts,
    explicitAllAccountsSelected,
    handleAccountFilterChange,
    isEditing,
    setShowWidgetSelector,
    registerAddWidgetButtonTarget,
    handleToggleQuickLinksPosition,
    quickLinksPosition,
    registerQuickLinksPositionButtonTarget,
    handleToggleEdit,
    registerEditButtonTarget,
    effectiveSelectedAccounts,
    lifetimeFilters,
    hasVisibleQuickLinks,
    registerQuickLinksTarget,
    quickLinks,
    setQuickLinks,
    registerGridTarget,
    hasAccountBackedHomeWidgets,
    activeWidgets,
    handleRemoveWidget,
    tradeCount,
    showWidgetSelector,
    hiddenQuickLinks,
    handleAddWidget,
    handleRestoreQuickLink,
  };
}

const HomePageComponent: React.FC<HomePageProps> = ({ plugin }) => {
  const {
    memoizedGreeting,
    memoizedSubtitle,
    registerFiltersTarget,
    periodDropdownRef,
    showPeriodDropdown,
    setShowPeriodDropdown,
    selectedPeriod,
    handlePeriodChange,
    selectedTradeTypes,
    handleTradeTypeFilterChange,
    availableAccounts,
    selectedAccounts,
    explicitAllAccountsSelected,
    handleAccountFilterChange,
    isEditing,
    setShowWidgetSelector,
    registerAddWidgetButtonTarget,
    handleToggleQuickLinksPosition,
    quickLinksPosition,
    registerQuickLinksPositionButtonTarget,
    handleToggleEdit,
    registerEditButtonTarget,
    effectiveSelectedAccounts,
    lifetimeFilters,
    hasVisibleQuickLinks,
    registerQuickLinksTarget,
    quickLinks,
    setQuickLinks,
    registerGridTarget,
    hasAccountBackedHomeWidgets,
    activeWidgets,
    handleRemoveWidget,
    tradeCount,
    showWidgetSelector,
    hiddenQuickLinks,
    handleAddWidget,
    handleRestoreQuickLink,
  } = useHomePageModel(plugin);

  return (
    <div className="journalit-home-page">
      
      <div className="journalit-home-header">
        <div className="journalit-home-greeting">
          <h1 className="journalit-home-greeting-title">{memoizedGreeting}</h1>
          <p className="journalit-home-greeting-subtitle">{memoizedSubtitle}</p>
        </div>

        <div className="journalit-home-actions">
          <div className="journalit-home-filters" ref={registerFiltersTarget}>
            
            <div
              className="journalit-home-period-wrapper"
              ref={periodDropdownRef}
            >
              <button
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                className="journalit-home-period-selector clickable-icon"
                aria-label={t('home.aria.filter-period')}
              >
                <span>{getPeriodLabels()[selectedPeriod]}</span>
                <ChevronDown
                  size={14}
                  className={`journalit-home-period-chevron${showPeriodDropdown ? ' journalit-home-period-chevron--open' : ''}`}
                />
              </button>

              
              {showPeriodDropdown && (
                <div className="journalit-home-period-menu">
                  {HOME_PERIODS.map((period) => (
                    <button
                      key={period}
                      onClick={() => void handlePeriodChange(period)}
                      className={`journalit-home-period-option${selectedPeriod === period ? ' journalit-home-period-option--active' : ''}`}
                    >
                      <span
                        className="journalit-home-period-option__check"
                        aria-hidden="true"
                      >
                        {selectedPeriod === period ? '✓' : ''}
                      </span>
                      <span className="journalit-home-period-option__label">
                        {getPeriodLabels()[period]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <HomeTradeTypeFilter
              selectedTradeTypes={selectedTradeTypes}
              onChange={handleTradeTypeFilterChange}
            />

            <HomeAccountFilter
              availableAccounts={availableAccounts}
              selectedAccounts={selectedAccounts}
              explicitAllSelected={explicitAllAccountsSelected}
              onChange={handleAccountFilterChange}
            />
          </div>

          
          {isEditing && (
            <button
              onClick={() => setShowWidgetSelector(true)}
              className="journalit-home-add-widget-button clickable-icon"
              aria-label={t('home.aria.add-widget')}
              ref={registerAddWidgetButtonTarget}
            >
              <Plus size={14} />
              <span>{t('home.button.add-widget')}</span>
            </button>
          )}

          {isEditing && (
            <button
              onClick={() => void handleToggleQuickLinksPosition()}
              className="journalit-home-quick-links-position-toggle clickable-icon"
              aria-label={
                quickLinksPosition === 'belowWidgets'
                  ? t('home.quick-links.move-above')
                  : t('home.quick-links.move-below')
              }
              ref={registerQuickLinksPositionButtonTarget}
            >
              {quickLinksPosition === 'belowWidgets' ? (
                <ArrowUp size={14} />
              ) : (
                <ArrowDown size={14} />
              )}
            </button>
          )}

          <button
            onClick={() => void handleToggleEdit()}
            className={`journalit-home-edit-toggle clickable-icon${isEditing ? ' journalit-home-edit-toggle--active' : ''}`}
            aria-label={
              isEditing ? t('home.aria.save-layout') : t('home.aria.customize')
            }
            ref={registerEditButtonTarget}
          >
            {isEditing ? <Check size={14} /> : <Settings size={14} />}
          </button>
        </div>
      </div>

      
      <div className="journalit-home-content">
        <HomeAccountProvider selectedAccounts={effectiveSelectedAccounts}>
          <DashboardDataProvider
            app={plugin.app}
            tradeService={plugin.tradeService}
            filters={lifetimeFilters}
            plugin={plugin}
          >
            <HomePeriodProvider period={selectedPeriod}>
              {quickLinksPosition === 'aboveWidgets' &&
                (isEditing || hasVisibleQuickLinks) && (
                  <div
                    className="journalit-home-section journalit-home-section--quick-links"
                    ref={registerQuickLinksTarget}
                  >
                    <QuickLinksRow
                      plugin={plugin}
                      isEditing={isEditing}
                      quickLinks={quickLinks}
                      onQuickLinksChange={setQuickLinks}
                    />
                  </div>
                )}

              
              <div className="journalit-home-section" ref={registerGridTarget}>
                <HomeAccountsDataProvider
                  plugin={plugin}
                  enabled={hasAccountBackedHomeWidgets}
                  selectedTradeTypes={selectedTradeTypes}
                >
                  <HomeGridLayout
                    isEditing={isEditing}
                    widgets={activeWidgets}
                    onRemoveWidget={handleRemoveWidget}
                    tradeCount={tradeCount}
                  />
                </HomeAccountsDataProvider>
              </div>

              {quickLinksPosition !== 'aboveWidgets' &&
                (isEditing || hasVisibleQuickLinks) && (
                  <div
                    className="journalit-home-section journalit-home-section--quick-links"
                    ref={registerQuickLinksTarget}
                  >
                    <QuickLinksRow
                      plugin={plugin}
                      isEditing={isEditing}
                      quickLinks={quickLinks}
                      onQuickLinksChange={setQuickLinks}
                    />
                  </div>
                )}
            </HomePeriodProvider>
          </DashboardDataProvider>
        </HomeAccountProvider>
      </div>

      
      {showWidgetSelector && (
        <HomeWidgetSelector
          activeWidgets={activeWidgets}
          hiddenQuickLinks={hiddenQuickLinks}
          onAddWidget={handleAddWidget}
          onRestoreQuickLink={handleRestoreQuickLink}
          onClose={() => setShowWidgetSelector(false)}
        />
      )}
    </div>
  );
};


export const HomePage = React.memo(HomePageComponent);
