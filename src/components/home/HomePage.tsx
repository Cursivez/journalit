

import React, {
  useState,
  useEffect,
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
} from 'react';
import { Notice, type WorkspaceLeaf } from 'obsidian';
import {
  Check,
  Plus,
  Grid2x2Plus,
  ArrowUp,
  ArrowDown,
  Settings,
} from '../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../main';
import {
  AVAILABLE_HOME_WIDGETS,
  DEFAULT_HOME_WIDGETS,
  getHomeWidgetById,
} from './homeTypes';
import { LAYOUT_BOTTOM_POSITION } from '../shared/gridLayout/gridLayoutUtils';
import { generateUUID } from '../../utils/uuid';
import { DashboardDataProvider } from '../dashboard/context/DashboardDataContext';
import { HomePeriodProvider } from './context/HomePeriodContext';
import { HomeAccountProvider } from './context/HomeAccountContext';
import { HomeGridLayout } from './HomeGridLayout';
import { HomeAccountsDataProvider } from './context/HomeAccountsDataContext';
import { QuickLinksRow } from './QuickLinksRow';
import { HomeWidgetSelector } from './components/HomeWidgetSelector';
import { HomeFilterPopover } from './components/HomeFilterPopover';
import { SegmentedControl } from '../shared/SegmentedControl';
import { DashboardPage } from '../dashboard/DashboardView';
import {
  QuickLinkButton,
  DEFAULT_SETTINGS,
  HomePeriod,
  HomeQuickLinksPosition,
  HomeViewMode,
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
  HOME_CUSTOMIZE_GUIDE_ID,
  HOME_EDIT_BUTTON_TARGET_ID,
  HOME_EDIT_MODE_DISABLED_ACTION_ID,
  HOME_EDIT_MODE_ENABLED_ACTION_ID,
  HOME_FILTERS_TARGET_ID,
  HOME_FILTER_POPOVER_OPENED_ACTION_ID,
  HOME_GRID_TARGET_ID,
  HOME_MAIN_GUIDE_ID,
  HOME_MODE_DASHBOARD_ENABLED_ACTION_ID,
  HOME_MODE_TOGGLE_DASHBOARD_OPTION_TARGET_ID,
  HOME_MODE_TOGGLE_TARGET_ID,
  HOME_QUICK_LINKS_POSITION_BUTTON_TARGET_ID,
  HOME_QUICK_LINKS_TARGET_ID,
  HOME_SETTINGS_BUTTON_TARGET_ID,
  HOME_WIDGET_SELECTOR_OPENED_ACTION_ID,
  HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID,
} from '../../guides/homeGuideIds';
import { useHomeGuideResolution } from '../../guides/useHomeGuideResolution';
import {
  collectAvailableHomeAccounts,
  DEFAULT_HOME_FILTERS,
  normalizeHomeAccountSelection,
  normalizeHomeTradeTypes,
  remapHomeSelectedAccounts,
  type HomeAccountTradeSnapshot,
} from './utils/homeTradeTypeUtils';
import { areAccountSelectionsEqual } from '../shared/filters/remapSelectedAccounts';
import { createFilterExclusions } from '../shared/filters/filterExclusions';
import { createFilterMatchModes } from '../shared/filters/filterMatchModes';
import type { TradeChangedPayload } from '../../services/events/types';
import { t, hasTranslation } from '../../lang/helpers';
import { HomeBackgroundSurface } from './HomeBackgroundSurface';
import { useLeafActive } from '../../hooks/useLeafActive';
import { subscribeToHomeModeChanges } from './homeModeEvents';
import { runQueuedTradeCountRefresh } from './homeTradeCountRefresh';
import { HomeGreetingTitle } from './components/HomeGreetingTitle';
import {
  saveDisplayName,
  subscribeToDisplayNameChanges,
} from '../../settings/displayName';
import {
  updateGreetingDisplayName,
  type HomeGreetingResult,
} from './homeGreetingState';
import {
  hasOnboardingBeenShown,
  markHomeVisited,
  resolveIsFirstHomeVisit,
} from '../../utils/homeVisitState';

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
  leaf: WorkspaceLeaf;
  modeEventTarget: HTMLElement;
  
  getInitialMode: () => HomeViewMode;
  
  onModeChange: (mode: HomeViewMode) => void;
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

const HOME_PERIODS: HomePeriod[] = ['month', 'quarter', 'year', 'lifetime'];


const getPeriodLabels = (): Record<HomePeriod, string> => ({
  month: t('home.period.month'),
  quarter: t('home.period.quarter'),
  year: t('home.period.year'),
  lifetime: t('home.period.lifetime'),
});

function useHomePageModel(plugin: JournalitPlugin, isActive: boolean) {
  const [isFirstHomeVisit, setIsFirstHomeVisit] = useState(() =>
    resolveIsFirstHomeVisit(plugin.app)
  );
  const firstHomeActivationCompletedRef = useRef(false);

  const isQuestion = useCallback((greetingKey: string): boolean => {
    if (questionOnlyGreetingKeys.includes(greetingKey)) {
      return true;
    }

    const greetingText = hasTranslation(greetingKey)
      ? t(greetingKey)
      : greetingKey;

    return greetingText.trim().endsWith('?');
  }, []);

  const getGreeting = useCallback(
    (firstHomeVisit = isFirstHomeVisit): HomeGreetingResult => {
      const displayName = plugin.settings.general?.displayName || '';
      if (firstHomeVisit) {
        
        
        const welcomeMessage = t('home.greeting.welcome');
        return {
          prefix: welcomeMessage,
          suffix: '',
          displayName: '',
          originalString: welcomeMessage,
        };
      }

      if (!displayName) {
        const welcomeBack = t('home.greeting.welcome-back');
        return {
          prefix: `${welcomeBack}, `,
          suffix: '',
          displayName,
          originalString: `${welcomeBack}, ${displayName}`,
        };
      }

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
        return {
          prefix: `${t('home.greeting.hey')} `,
          suffix: `, ${selectedGreeting}`,
          displayName,
          originalString: `${t('home.greeting.hey')} ${displayName}, ${selectedGreeting}`,
        };
      }

      return {
        prefix: `${selectedGreeting}, `,
        suffix: '',
        displayName,
        originalString: `${selectedGreeting}, ${displayName}`,
      };
    },
    [isFirstHomeVisit, plugin]
  );

  const generateSubtitle = useCallback(
    (
      greetingIsQuestion: boolean,
      firstHomeVisit = isFirstHomeVisit
    ): string => {
      if (firstHomeVisit) {
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
    [isFirstHomeVisit]
  );

  const [isEditing, setIsEditing] = useState(false);

  
  const [selectedPeriod, setSelectedPeriod] = useState<HomePeriod>(() => {
    return (
      plugin.uiStateManager.getState().selectedPeriod ??
      DEFAULT_HOME_FILTERS.period
    );
  });
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(() => {
    return (
      plugin.uiStateManager.getState().selectedHomeAccounts ?? [
        ...DEFAULT_HOME_FILTERS.accounts,
      ]
    );
  });
  const [selectedTradeTypes, setSelectedTradeTypes] = useState(() =>
    normalizeHomeTradeTypes(
      plugin.uiStateManager.getState().selectedHomeTradeTypes ?? [
        ...DEFAULT_HOME_FILTERS.tradeTypes,
      ]
    )
  );
  const [explicitAllAccountsSelected, setExplicitAllAccountsSelected] =
    useState(
      () =>
        plugin.uiStateManager.getState().homeAccountFilterSelectAllActive ??
        DEFAULT_HOME_FILTERS.explicitAllAccountsSelected
    );
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
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
  const isTradeCountRefreshQueuedRef = useRef(false);
  const activeTradeCountRefreshRef = useRef<Promise<void> | null>(null);
  const homeTradeDataReadyRef = useRef(false);
  const homeStartupRefreshDoneRef = useRef(false);
  const homeAuthoritativeBootstrapDoneRef = useRef(false);
  const homeAuthoritativeBootstrapPromiseRef = useRef<Promise<void> | null>(
    null
  );
  const autoAddGettingStartedRef = useRef(false);
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

    
    const knownWidgetIdsSet = new Set(knownWidgetIds);
    const unknownWidgetIds = allWidgetIds.filter(
      (id) => !knownWidgetIdsSet.has(id)
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
  const [showEntityShortcutPicker, setShowEntityShortcutPicker] =
    useState(false);
  
  
  
  const isWidgetSelectorOpen =
    showWidgetSelector ||
    (isActive &&
      isEditing &&
      !showEntityShortcutPicker &&
      currentGuideStepId === 'widget-picker');

  useEffect(() => {
    if (!isWidgetSelectorOpen) {
      return;
    }

    emitGuideAction(HOME_WIDGET_SELECTOR_OPENED_ACTION_ID);
  }, [emitGuideAction, isWidgetSelectorOpen]);

  const handleOpenEntityShortcuts = useCallback(() => {
    setShowWidgetSelector(false);
    setShowEntityShortcutPicker(true);
  }, []);
  const handleCloseEntityShortcutPicker = useCallback(() => {
    setShowEntityShortcutPicker(false);
  }, []);

  
  useEffect(() => {
    if (
      currentGuideStepId !== 'move-and-resize' &&
      currentGuideStepId !== 'save-layout'
    ) {
      return;
    }

    setShowWidgetSelector(false);
  }, [currentGuideStepId]);

  const handleGuideBack = useCallback(
    ({ toStepId, guideId }: { toStepId: string; guideId: string }) => {
      if (
        guideId !== HOME_MAIN_GUIDE_ID &&
        guideId !== HOME_CUSTOMIZE_GUIDE_ID &&
        guideId !== HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID
      ) {
        return;
      }
      setShowEntityShortcutPicker(false);
      if (toStepId === 'intro' || toStepId === 'filters') {
        setIsEditing(false);
        setShowWidgetSelector(false);
        return;
      }

      if (toStepId === 'widget-picker') {
        setIsEditing(true);
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

  useGuideBackHandler(isActive ? handleGuideBack : null);

  
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
      greeting: greetingResult,
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

  const handleSaveDisplayName = useCallback(
    async (displayName: string) => {
      try {
        await saveDisplayName(plugin, displayName);
      } catch (error) {
        console.error('Failed to save display name from Home:', error);
        new Notice(t('settings.general.display-name-save-failed'), 5000);
        throw error;
      }
    },
    [plugin]
  );

  useEffect(() => {
    if (!isFirstHomeVisit) {
      return;
    }

    if (isActive) {
      if (
        firstHomeActivationCompletedRef.current ||
        !hasOnboardingBeenShown(plugin.app)
      ) {
        return;
      }

      markHomeVisited(plugin.app);
      firstHomeActivationCompletedRef.current = true;
      return;
    }

    if (!firstHomeActivationCompletedRef.current) {
      return;
    }

    const greetingResult = getGreeting(false);
    setGreetingState({
      greeting: greetingResult,
      subtitle: generateSubtitle(
        isQuestion(greetingResult.originalString),
        false
      ),
    });
    setIsFirstHomeVisit(false);
  }, [
    generateSubtitle,
    getGreeting,
    isActive,
    isFirstHomeVisit,
    isQuestion,
    plugin,
  ]);

  
  useEffect(() => {
    if (isFirstHomeVisit) {
      return;
    }

    return subscribeToDisplayNameChanges(window, (displayName) => {
      setGreetingState((current) => {
        return {
          ...current,
          greeting: updateGreetingDisplayName(
            current.greeting,
            displayName,
            t('home.greeting.welcome-back')
          ),
        };
      });
    });
  }, [isFirstHomeVisit]);

  const handleToggleEdit = () => {
    const nextIsEditing = !isEditing;
    setIsEditing(nextIsEditing);

    if (!nextIsEditing) {
      setShowWidgetSelector(false);
      setShowEntityShortcutPicker(false);
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

  const handleResetFilters = useCallback(async () => {
    const defaultTradeTypes = [...DEFAULT_HOME_FILTERS.tradeTypes];
    const defaultAccounts = [...DEFAULT_HOME_FILTERS.accounts];

    setSelectedPeriod(DEFAULT_HOME_FILTERS.period);
    setSelectedTradeTypes(defaultTradeTypes);
    setSelectedAccounts(defaultAccounts);
    setExplicitAllAccountsSelected(
      DEFAULT_HOME_FILTERS.explicitAllAccountsSelected
    );

    await plugin.uiStateManager.updateState({
      selectedPeriod: DEFAULT_HOME_FILTERS.period,
      selectedHomeTradeTypes: defaultTradeTypes,
      selectedHomeAccounts: defaultAccounts,
      homeAccountFilterSelectAllActive:
        DEFAULT_HOME_FILTERS.explicitAllAccountsSelected,
    });
  }, [plugin]);

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

      return accounts.flatMap((account) => {
        const accountName = account.name || account.accountName;
        return accountName ? [accountName] : [];
      });
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
    await runQueuedTradeCountRefresh(
      isTradeCountLoadingRef,
      isTradeCountRefreshQueuedRef,
      activeTradeCountRefreshRef,
      async () => {
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
        }
      }
    );
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
    [getWidgetsFromLayout, plugin]
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

        if (
          (widgetId === 'currentStreak' ||
            widgetId.startsWith('currentStreak-')) &&
          plugin.settings.home.streaks
        ) {
          delete plugin.settings.home.streaks[widgetId];
        }

        if (plugin.settings.home.accountProgress?.[widgetId]) {
          delete plugin.settings.home.accountProgress[widgetId];
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
      accountPhases: [],
      tickers: [],
      setups: [],
      tradeTypes: [...selectedTradeTypes],
      statuses: [],
      reviewStatus: [],
      directions: [],
      tags: [],
      mistakes: [],
      customFieldFilters: {},
      exclusions: createFilterExclusions(),
      matchModes: createFilterMatchModes(),
    }),
    [effectiveSelectedAccounts, selectedTradeTypes]
  );

  const hasAccountBackedHomeWidgets = useMemo(
    () =>
      activeWidgets.includes('aum') ||
      activeWidgets.includes('drawdownMonitor') ||
      activeWidgets.includes('profitTarget') ||
      activeWidgets.includes('evalRoi') ||
      activeWidgets.includes('challengeAlerts'),
    [activeWidgets]
  );
  
  
  const showsChallengeRuleProgress =
    activeWidgets.includes('drawdownMonitor') ||
    activeWidgets.includes('profitTarget');

  return {
    memoizedGreeting,
    memoizedSubtitle,
    isFirstHomeVisit,
    handleSaveDisplayName,
    registerFiltersTarget,
    selectedPeriod,
    handlePeriodChange,
    selectedTradeTypes,
    handleTradeTypeFilterChange,
    availableAccounts,
    selectedAccounts,
    explicitAllAccountsSelected,
    handleAccountFilterChange,
    handleResetFilters,
    isEditing,
    setShowWidgetSelector,
    registerAddWidgetButtonTarget,
    showEntityShortcutPicker,
    handleOpenEntityShortcuts,
    handleCloseEntityShortcutPicker,
    handleToggleQuickLinksPosition,
    quickLinksPosition,
    registerQuickLinksPositionButtonTarget,
    handleToggleEdit,
    registerEditButtonTarget,
    effectiveSelectedAccounts,
    lifetimeFilters,
    registerQuickLinksTarget,
    quickLinks,
    setQuickLinks,
    registerGridTarget,
    hasAccountBackedHomeWidgets,
    showsChallengeRuleProgress,
    activeWidgets,
    handleRemoveWidget,
    tradeCount,
    isWidgetSelectorOpen,
    hiddenQuickLinks,
    handleAddWidget,
    handleRestoreQuickLink,
  };
}

type HomePageModel = ReturnType<typeof useHomePageModel>;

interface HomeModeContextValue {
  mode: HomeViewMode;
  changeMode: (mode: HomeViewMode) => void;
}



const HomeModeContext = React.createContext<HomeModeContextValue | null>(null);

interface HomeModeToggleProps {
  registerTarget?: (element: HTMLDivElement | null) => void;
  registerDashboardOptionTarget?: (element: HTMLButtonElement | null) => void;
}

const HomeModeToggle: React.FC<HomeModeToggleProps> = ({
  registerTarget,
  registerDashboardOptionTarget,
}) => {
  const modeContext = React.use(HomeModeContext);
  if (!modeContext) {
    throw new Error('HomeModeToggle must be rendered inside HomePage');
  }
  const { mode, changeMode } = modeContext;
  const modeOptions = useMemo(
    () => [
      { value: 'overview' as const, label: t('home.mode.overview') },
      { value: 'dashboard' as const, label: t('home.mode.dashboard') },
    ],
    []
  );

  return (
    <div className="journalit-home-mode-toggle-wrapper" ref={registerTarget}>
      <SegmentedControl
        options={modeOptions}
        value={mode}
        onChange={changeMode}
        size="small"
        groupRole="radiogroup"
        ariaLabel={t('home.mode.aria')}
        className="journalit-home-mode-toggle"
        getOptionRef={
          registerDashboardOptionTarget
            ? (value) =>
                value === 'dashboard'
                  ? registerDashboardOptionTarget
                  : undefined
            : undefined
        }
      />
    </div>
  );
};

interface HomeSettingsButtonProps {
  plugin: JournalitPlugin;
  registerTarget?: (element: HTMLButtonElement | null) => void;
}

const HomeSettingsButton: React.FC<HomeSettingsButtonProps> = ({
  plugin,
  registerTarget,
}) => (
  <button
    type="button"
    onClick={() => plugin.openSettings()}
    className="journalit-home-settings-button clickable-icon"
    aria-label={t('home.aria.open-settings')}
    ref={registerTarget}
  >
    <Settings size={16} aria-hidden="true" />
  </button>
);

interface HomeOverviewPanelProps {
  model: HomePageModel;
  plugin: JournalitPlugin;
  isActive: boolean;
  modeToggle: React.ReactNode;
}

const HomeOverviewPanel: React.FC<HomeOverviewPanelProps> = ({
  model,
  plugin,
  isActive,
  modeToggle,
}) => {
  const emitGuideAction = useGuideAction();

  return (
    <section
      className={`journalit-home-mode-panel journalit-home-mode-panel--overview${isActive ? ' is-active' : ''}`}
      aria-hidden={!isActive}
      inert={!isActive}
    >
      <div className="journalit-home-header">
        <div className="journalit-home-greeting">
          {model.isFirstHomeVisit ? (
            <h1 className="journalit-home-greeting-title">
              {model.memoizedGreeting.originalString}
            </h1>
          ) : (
            <HomeGreetingTitle
              prefix={model.memoizedGreeting.prefix}
              suffix={model.memoizedGreeting.suffix}
              displayName={model.memoizedGreeting.displayName}
              onSaveDisplayName={model.handleSaveDisplayName}
            />
          )}
          <div className="journalit-home-subtitle-row">
            <p className="journalit-home-greeting-subtitle">
              {model.memoizedSubtitle}
            </p>

            <div className="journalit-home-actions">
              <div ref={model.registerFiltersTarget}>
                <HomeFilterPopover
                  app={plugin.app}
                  periods={HOME_PERIODS}
                  periodLabels={getPeriodLabels()}
                  selectedPeriod={model.selectedPeriod}
                  onPeriodChange={model.handlePeriodChange}
                  selectedTradeTypes={model.selectedTradeTypes}
                  onTradeTypesChange={model.handleTradeTypeFilterChange}
                  availableAccounts={model.availableAccounts}
                  selectedAccounts={model.selectedAccounts}
                  explicitAllAccountsSelected={
                    model.explicitAllAccountsSelected
                  }
                  onAccountsChange={model.handleAccountFilterChange}
                  onReset={() => void model.handleResetFilters()}
                  onOpen={() =>
                    emitGuideAction(HOME_FILTER_POPOVER_OPENED_ACTION_ID)
                  }
                />
              </div>

              {model.isEditing && (
                <button
                  type="button"
                  onClick={() => model.setShowWidgetSelector(true)}
                  className="journalit-home-add-widget-button clickable-icon"
                  aria-label={t('home.button.add-widget')}
                  ref={model.registerAddWidgetButtonTarget}
                >
                  <Plus size={14} />
                  <span>{t('home.button.add-widget')}</span>
                </button>
              )}

              {model.isEditing && (
                <button
                  type="button"
                  onClick={() => void model.handleToggleQuickLinksPosition()}
                  className="journalit-home-quick-links-position-toggle clickable-icon"
                  aria-label={
                    model.quickLinksPosition === 'belowWidgets'
                      ? t('home.quick-links.move-above')
                      : t('home.quick-links.move-below')
                  }
                  ref={model.registerQuickLinksPositionButtonTarget}
                >
                  {model.quickLinksPosition === 'belowWidgets' ? (
                    <ArrowUp size={14} />
                  ) : (
                    <ArrowDown size={14} />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => void model.handleToggleEdit()}
                className={`journalit-home-edit-toggle clickable-icon${model.isEditing ? ' journalit-home-edit-toggle--active' : ''}`}
                aria-label={
                  model.isEditing
                    ? t('home.aria.save-layout')
                    : t('home.aria.customize')
                }
                ref={model.registerEditButtonTarget}
              >
                {model.isEditing ? (
                  <Check size={14} />
                ) : (
                  <Grid2x2Plus size={16} />
                )}
              </button>

              {modeToggle}
            </div>
          </div>
        </div>
      </div>

      <div className="journalit-home-content">
        <HomeAccountProvider
          selectedAccounts={model.effectiveSelectedAccounts}
          availableAccounts={model.availableAccounts}
        >
          <DashboardDataProvider
            app={plugin.app}
            tradeService={plugin.tradeService}
            filters={model.lifetimeFilters}
            plugin={plugin}
            isActive={isActive}
          >
            <HomePeriodProvider period={model.selectedPeriod}>
              {model.quickLinksPosition === 'aboveWidgets' && (
                <div
                  className="journalit-home-section journalit-home-section--quick-links"
                  ref={model.registerQuickLinksTarget}
                >
                  <QuickLinksRow
                    plugin={plugin}
                    isEditing={model.isEditing}
                    quickLinks={model.quickLinks}
                    onQuickLinksChange={model.setQuickLinks}
                    shortcutPickerOpen={model.showEntityShortcutPicker}
                    onShortcutPickerClose={
                      model.handleCloseEntityShortcutPicker
                    }
                  />
                </div>
              )}

              <div
                className="journalit-home-section"
                ref={model.registerGridTarget}
              >
                
                <HomeAccountsDataProvider
                  plugin={plugin}
                  enabled={model.hasAccountBackedHomeWidgets}
                  includeChallengeProgress={model.showsChallengeRuleProgress}
                  selectedTradeTypes={model.selectedTradeTypes}
                >
                  <HomeGridLayout
                    isEditing={model.isEditing}
                    widgets={model.activeWidgets}
                    onRemoveWidget={model.handleRemoveWidget}
                    tradeCount={model.tradeCount}
                  />
                </HomeAccountsDataProvider>
              </div>

              {model.quickLinksPosition !== 'aboveWidgets' && (
                <div
                  className="journalit-home-section journalit-home-section--quick-links"
                  ref={model.registerQuickLinksTarget}
                >
                  <QuickLinksRow
                    plugin={plugin}
                    isEditing={model.isEditing}
                    quickLinks={model.quickLinks}
                    onQuickLinksChange={model.setQuickLinks}
                    shortcutPickerOpen={model.showEntityShortcutPicker}
                    onShortcutPickerClose={
                      model.handleCloseEntityShortcutPicker
                    }
                  />
                </div>
              )}
            </HomePeriodProvider>
          </DashboardDataProvider>
        </HomeAccountProvider>
      </div>
    </section>
  );
};

interface HomeOverviewSectionProps {
  plugin: JournalitPlugin;
  leaf: WorkspaceLeaf;
  isActive: boolean;
  modeToggle: React.ReactNode;
}


const HomeOverviewSection: React.FC<HomeOverviewSectionProps> = ({
  plugin,
  leaf,
  isActive,
  modeToggle,
}) => {
  const model = useHomePageModel(plugin, isActive);
  useHomeGuideResolution({
    guideService: plugin.viewGuideService,
    leaf,
    isActive,
    isEditing: model.isEditing,
  });

  return (
    <>
      <HomeOverviewPanel
        model={model}
        plugin={plugin}
        isActive={isActive}
        modeToggle={modeToggle}
      />

      {model.isWidgetSelectorOpen && isActive && (
        <HomeWidgetSelector
          activeWidgets={model.activeWidgets}
          homeSettings={plugin.settings.home}
          hiddenQuickLinks={model.hiddenQuickLinks}
          onAddWidget={model.handleAddWidget}
          onRemoveWidget={model.handleRemoveWidget}
          onRestoreQuickLink={model.handleRestoreQuickLink}
          onOpenEntityShortcuts={model.handleOpenEntityShortcuts}
          onClose={() => model.setShowWidgetSelector(false)}
        />
      )}
    </>
  );
};

const HomePageComponent: React.FC<HomePageProps> = ({
  plugin,
  leaf,
  modeEventTarget,
  getInitialMode,
  onModeChange,
}) => {
  
  
  
  
  const [mode, setMode] = useState<HomeViewMode>(getInitialMode);
  
  
  const panelMode = useDeferredValue(mode);
  const isLeafActive = useLeafActive(leaf);
  const isOverviewPanelActive = panelMode === 'overview';
  const isDashboardPanelActive = panelMode === 'dashboard';
  
  
  
  
  const [overviewMounted, setOverviewMounted] = useState(isOverviewPanelActive);
  if (isOverviewPanelActive && !overviewMounted) {
    setOverviewMounted(true);
  }

  const emitGuideAction = useGuideAction();
  const changeMode = useCallback(
    (nextMode: HomeViewMode) => {
      setMode(nextMode);
      onModeChange(nextMode);
      if (nextMode === 'dashboard') {
        emitGuideAction(HOME_MODE_DASHBOARD_ENABLED_ACTION_ID);
      }
    },
    [emitGuideAction, onModeChange]
  );

  useEffect(() => {
    return subscribeToHomeModeChanges(modeEventTarget, {
      onModeChange: setMode,
      onDashboardNavigation: () =>
        emitGuideAction(HOME_MODE_DASHBOARD_ENABLED_ACTION_ID),
    });
  }, [emitGuideAction, modeEventTarget]);

  const modeContextValue = useMemo(
    () => ({ mode, changeMode }),
    [mode, changeMode]
  );
  const registerModeToggleTarget = useGuideTarget(HOME_MODE_TOGGLE_TARGET_ID);
  const registerModeToggleDashboardOptionTarget = useGuideTarget(
    HOME_MODE_TOGGLE_DASHBOARD_OPTION_TARGET_ID
  );
  const registerSettingsButtonTarget = useGuideTarget(
    HOME_SETTINGS_BUTTON_TARGET_ID
  );
  const overviewToggle = useMemo(
    () => (
      <>
        <HomeSettingsButton
          plugin={plugin}
          registerTarget={registerSettingsButtonTarget}
        />
        <HomeModeToggle
          registerTarget={registerModeToggleTarget}
          registerDashboardOptionTarget={
            registerModeToggleDashboardOptionTarget
          }
        />
      </>
    ),
    [
      plugin,
      registerModeToggleTarget,
      registerModeToggleDashboardOptionTarget,
      registerSettingsButtonTarget,
    ]
  );
  const dashboardToggle = useMemo(
    () => (
      <>
        <HomeSettingsButton plugin={plugin} />
        <HomeModeToggle />
      </>
    ),
    [plugin]
  );

  return (
    <HomeModeContext.Provider value={modeContextValue}>
      <HomeBackgroundSurface plugin={plugin} mode={panelMode}>
        <div className="journalit-home-mode-panels">
          {overviewMounted && (
            <HomeOverviewSection
              plugin={plugin}
              leaf={leaf}
              isActive={isLeafActive && isOverviewPanelActive}
              modeToggle={overviewToggle}
            />
          )}

          <section
            className={`journalit-home-mode-panel journalit-home-mode-panel--dashboard${isDashboardPanelActive ? ' is-active' : ''}`}
            aria-hidden={!isDashboardPanelActive}
            inert={!isDashboardPanelActive}
          >
            <DashboardPage
              leaf={leaf}
              isActive={isLeafActive && isDashboardPanelActive}
              modeToggle={dashboardToggle}
            />
          </section>
        </div>
      </HomeBackgroundSurface>
    </HomeModeContext.Provider>
  );
};


export const HomePage = React.memo(HomePageComponent);
