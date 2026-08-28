

import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Notice } from 'obsidian';
import {
  Check,
  ChevronRight,
  Flame,
  Minus,
  Snowflake,
  X,
} from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { getTradeAnalyticsDate } from '../../../utils/tradeAnalyticsDate';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import {
  useFilteredByPeriod,
  useHomePeriod,
} from '../context/HomePeriodContext';
import type { Trade } from '../../dashboard/utils/dataUtils';
import {
  isPnlContributingTrade,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import type { CurrentStreakKind, HomePeriod } from '../../../settings/types';
import {
  calculateCurrentStreak,
  calculateHistoricalStreaks,
} from '../../../utils/tradeStreaks';
import { useEventBus } from '../../../hooks/useEventBus';
import {
  calculateReviewStreakSummary,
  type ReviewStreakItem,
} from '../../../utils/reviewStreaks';
import {
  CURRENT_STREAK_KINDS,
  getCurrentStreakConfig,
  isCurrentReviewStreakKind,
  setCurrentStreakConfig,
} from '../../../utils/currentStreakConfig';
import { eventBus } from '../../../services/events/EventBus';
import {
  CurrentReviewStreakView,
  getCurrentStreakKindLabel,
  useReviewStreakState,
} from './CurrentStreakReview';
import { CurrentStreakLoading } from './CurrentStreakSkeleton';

interface CurrentStreakWidgetProps {
  plugin: JournalitPlugin;
  instanceId?: string;
  isEditing?: boolean;
}

interface StreakData {
  currentStreak: number;
  streakType: 'win' | 'loss' | 'none';
  longestWinStreak: number;
  longestLossStreak: number;
  avgWinStreak: number;
  avgLossStreak: number;
}

interface UiState {
  isConfiguring: boolean;
  isSavingConfig: boolean;
  selectedKind: CurrentStreakKind;
  draftKind: CurrentStreakKind;
}

type UiAction =
  | { type: 'open-config' }
  | { type: 'close-config' }
  | { type: 'select-draft'; kind: CurrentStreakKind }
  | { type: 'saving'; kind: CurrentStreakKind }
  | { type: 'saved' }
  | { type: 'save-failed'; kind: CurrentStreakKind }
  | { type: 'settings-updated'; kind: CurrentStreakKind };

const getPeriodLabel = (period: HomePeriod | undefined): string => {
  switch (period) {
    case 'month':
      return t('home.widget.streak.period.month');
    case 'quarter':
      return t('home.widget.streak.period.quarter');
    case 'year':
      return t('home.widget.streak.period.year');
    case 'lifetime':
    default:
      return t('home.widget.streak.period.ever');
  }
};

const createInitialUiState = ({
  plugin,
  instanceId,
}: {
  plugin: JournalitPlugin;
  instanceId: string;
}): UiState => {
  const selectedKind = getCurrentStreakConfig(
    plugin.settings.home,
    instanceId
  ).kind;
  return {
    isConfiguring: false,
    isSavingConfig: false,
    selectedKind,
    draftKind: selectedKind,
  };
};

const uiReducer = (state: UiState, action: UiAction): UiState => {
  switch (action.type) {
    case 'open-config':
      return {
        ...state,
        isConfiguring: true,
        draftKind: state.selectedKind,
      };
    case 'close-config':
      return {
        ...state,
        isConfiguring: false,
        draftKind: state.selectedKind,
      };
    case 'select-draft':
      return { ...state, draftKind: action.kind };
    case 'saving':
      return {
        ...state,
        isSavingConfig: true,
        selectedKind: action.kind,
      };
    case 'saved':
      return { ...state, isConfiguring: false, isSavingConfig: false };
    case 'save-failed':
      return {
        ...state,
        isSavingConfig: false,
        selectedKind: action.kind,
      };
    case 'settings-updated':
      if (state.selectedKind === action.kind && !state.isSavingConfig) {
        return state;
      }
      return {
        ...state,
        isSavingConfig: false,
        selectedKind: action.kind,
        draftKind: state.isConfiguring ? state.draftKind : action.kind,
      };
  }
};

const getStreakData = (
  trades: Trade[],
  breakEvenSettings: {
    breakEvenRangeMin?: number;
    breakEvenRangeMax?: number;
    breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
    breakEvenThresholdPercent?: number;
  },
  analyticsDateBasis: 'entry' | 'exit'
): StreakData => {
  const defaultData: StreakData = {
    currentStreak: 0,
    streakType: 'none',
    longestWinStreak: 0,
    longestLossStreak: 0,
    avgWinStreak: 0,
    avgLossStreak: 0,
  };

  if (trades.length === 0) {
    return defaultData;
  }

  const sortedTrades = trades.slice().sort((a: Trade, b: Trade) => {
    const dateA = getTradeAnalyticsDate(a, analyticsDateBasis)?.getTime() ?? 0;
    const dateB = getTradeAnalyticsDate(b, analyticsDateBasis)?.getTime() ?? 0;
    return dateB - dateA;
  });

  const { currentStreak, streakType } = calculateCurrentStreak(
    sortedTrades,
    breakEvenSettings
  );
  const chronologicalTrades = sortedTrades.slice().reverse();
  const { winStreaks, lossStreaks } = calculateHistoricalStreaks(
    chronologicalTrades,
    breakEvenSettings
  );

  return {
    currentStreak,
    streakType,
    longestWinStreak: winStreaks.length > 0 ? Math.max(...winStreaks) : 0,
    longestLossStreak: lossStreaks.length > 0 ? Math.max(...lossStreaks) : 0,
    avgWinStreak:
      winStreaks.length > 0
        ? winStreaks.reduce((sum, value) => sum + value, 0) / winStreaks.length
        : 0,
    avgLossStreak:
      lossStreaks.length > 0
        ? lossStreaks.reduce((sum, value) => sum + value, 0) /
          lossStreaks.length
        : 0,
  };
};

const getOutcomeDisplay = (streakData: StreakData) => {
  if (streakData.streakType === 'win') {
    return {
      color: 'var(--color-green)',
      icon: Flame,
      label:
        streakData.currentStreak === 1
          ? t('home.widget.streak.win')
          : t('home.widget.streak.wins'),
      contextLabel: t('home.widget.streak.in-a-row'),
    };
  }
  if (streakData.streakType === 'loss') {
    return {
      color: 'var(--color-red)',
      icon: Snowflake,
      label:
        streakData.currentStreak === 1
          ? t('home.widget.streak.loss')
          : t('home.widget.streak.losses'),
      contextLabel: t('home.widget.streak.in-a-row'),
    };
  }
  return {
    color: 'var(--text-muted)',
    icon: Minus,
    label: '',
    contextLabel: t('home.widget.streak.no-active'),
  };
};

const getOutcomeInsight = (
  streakData: StreakData,
  currentPeriod: HomePeriod | undefined
): string => {
  const periodLabel = getPeriodLabel(currentPeriod);

  if (streakData.streakType === 'none') {
    return t('home.widget.streak.start-trading');
  }
  if (streakData.streakType === 'win') {
    if (
      streakData.currentStreak >= streakData.longestWinStreak &&
      streakData.currentStreak > 1
    ) {
      return t('home.widget.streak.best-streak', { period: periodLabel });
    }
    if (
      streakData.currentStreak > streakData.avgWinStreak * 1.5 &&
      streakData.currentStreak > 1
    ) {
      return t('home.widget.streak.above-average', { period: periodLabel });
    }
    if (streakData.currentStreak >= 3)
      return t('home.widget.streak.stay-focused');
    if (streakData.currentStreak === 2)
      return t('home.widget.streak.keep-going');
    return t('home.widget.streak.good-start');
  }
  if (streakData.currentStreak >= 3) return t('home.widget.streak.pause');
  if (streakData.currentStreak >= 2) return t('home.widget.streak.review');
  return t('home.widget.streak.losses-process');
};

interface CurrentStreakFrameProps {
  children: React.ReactNode;
  isEditing: boolean;
  kind: CurrentStreakKind;
  triggerRef: React.Ref<HTMLButtonElement>;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLButtonElement>;
}

const CurrentStreakFrame: React.FC<CurrentStreakFrameProps> = ({
  children,
  isEditing,
  kind,
  triggerRef,
  onClick,
  onKeyDown,
}) => {
  return (
    <button
      type="button"
      ref={triggerRef}
      className={`journalit-native-button journalit-native-button--unstyled journalit-home-streak${isEditing ? '' : ' journalit-home-streak--clickable'}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-disabled={isEditing}
      tabIndex={isEditing ? -1 : 0}
      aria-label={t('home.widget.streak.configure-aria', {
        kind: getCurrentStreakKindLabel(kind),
      })}
    >
      {children}
    </button>
  );
};

interface ConfigPanelProps {
  draftKind: CurrentStreakKind;
  isSaving: boolean;
  onCancel: () => void;
  onDraftKindChange: (kind: CurrentStreakKind) => void;
  onSave: (kind: CurrentStreakKind) => void | Promise<void>;
}

const CurrentStreakConfigPanel: React.FC<ConfigPanelProps> = ({
  draftKind,
  isSaving,
  onCancel,
  onDraftKindChange,
  onSave,
}) => {
  const selectedKindRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    selectedKindRef.current?.focus();
  }, []);

  return (
    <div className="journalit-home-streak journalit-home-streak--configuring">
      <div className="journalit-home-widget__eyebrow journalit-home-streak__config-header">
        <span className="journalit-home-streak__config-title">
          {t('home.widget.streak.configure')}
        </span>
        <div className="journalit-home-streak__config-actions">
          <button
            type="button"
            className="clickable-icon journalit-home-streak__config-save"
            onClick={() => void onSave(draftKind)}
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
      <div
        className="journalit-home-widget__option-list journalit-home-streak__kind-list"
        aria-label={t('home.widget.streak.configure')}
      >
        {CURRENT_STREAK_KINDS.map((kind) => (
          <button
            key={kind}
            type="button"
            ref={draftKind === kind ? selectedKindRef : undefined}
            className={`journalit-home-widget__option${draftKind === kind ? ' journalit-home-widget__option--active' : ''}`}
            onClick={() => onDraftKindChange(kind)}
            aria-pressed={draftKind === kind}
            disabled={isSaving}
          >
            <span>{getCurrentStreakKindLabel(kind)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface OutcomeViewProps {
  currentPeriod: HomePeriod | undefined;
  streakData: StreakData;
}

const CurrentOutcomeStreakView: React.FC<OutcomeViewProps> = ({
  currentPeriod,
  streakData,
}) => {
  const display = getOutcomeDisplay(streakData);
  const IconComponent = display.icon;
  return (
    <>
      <div className="journalit-home-streak__header">
        <span>{t('home.widget.streak.title')}</span>
        <span className="journalit-home-streak__header-actions">
          {streakData.longestWinStreak > 0 && (
            <span className="journalit-home-streak__header-stats">
              {t('home.widget.streak.best')} {streakData.longestWinStreak} ·{' '}
              {t('home.widget.streak.avg')} {streakData.avgWinStreak.toFixed(1)}
            </span>
          )}
          <ChevronRight
            size={12}
            className="journalit-home-streak__header-chevron"
            aria-hidden="true"
          />
        </span>
      </div>
      <div
        className="journalit-home-streak__hero"
        style={cssVars({ '--journalit-home-streak-color': display.color })}
      >
        {streakData.streakType !== 'none' && (
          <IconComponent size={24} className="journalit-home-streak__icon" />
        )}
        <div className="journalit-home-streak__value">
          {streakData.streakType !== 'none' ? streakData.currentStreak : '—'}
        </div>
        <div className="journalit-home-streak__label">
          {streakData.streakType !== 'none'
            ? `${display.label} ${display.contextLabel}`
            : display.contextLabel}
        </div>
        <div className="journalit-home-streak__insight">
          {getOutcomeInsight(streakData, currentPeriod)}
        </div>
      </div>
    </>
  );
};

const CurrentStreakWidgetComponent: React.FC<CurrentStreakWidgetProps> = ({
  plugin,
  instanceId = 'currentStreak',
  isEditing = false,
}) => {
  const { dashboardData } = useDashboardData();
  const periodContext = useHomePeriod();
  const currentPeriod = periodContext?.period;
  const [uiState, dispatchUi] = useReducer(
    uiReducer,
    { plugin, instanceId },
    createInitialUiState
  );
  const reviewState = useReviewStreakState(plugin, uiState.selectedKind);
  const reviewKind = isCurrentReviewStreakKind(uiState.selectedKind)
    ? uiState.selectedKind
    : null;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasConfiguringRef = useRef(false);

  useLayoutEffect(() => {
    const wasConfiguring = wasConfiguringRef.current;
    wasConfiguringRef.current = uiState.isConfiguring;

    if (wasConfiguring && !uiState.isConfiguring) {
      triggerRef.current?.focus();
    }
  }, [uiState.isConfiguring]);

  useEventBus('settings:changed', (payload) => {
    if (payload.section === 'all' || payload.section === 'home') {
      dispatchUi({
        type: 'settings-updated',
        kind: getCurrentStreakConfig(plugin.settings.home, instanceId).kind,
      });
    }
  });

  const filteredTrades = useFilteredByPeriod(dashboardData?.trades);
  const closedTrades = useMemo(
    () =>
      (filteredTrades ?? []).filter((trade: Trade) =>
        isPnlContributingTrade(trade)
      ),
    [filteredTrades]
  );
  const tradeReviewItems = useMemo<ReviewStreakItem[]>(() => {
    if (!dashboardData?.trades || uiState.selectedKind !== 'trade-review') {
      return [];
    }
    const analyticsDateBasis =
      plugin.settings.trade.analyticsDateBasis ?? 'entry';
    return dashboardData.trades.flatMap((trade: Trade) => {
      if (
        isTradeOpenWithContext({
          tradeStatus: trade.tradeStatus,
          exitTime: trade.exitTime,
          exitPrice: trade.exitPrice,
          pnl: trade._originalPnlWasNull ? null : trade.pnl,
          useDirectPnLInput: trade.useDirectPnLInput,
          exits: trade.exits,
          entries: trade.entries,
        })
      ) {
        return [];
      }

      const date = getTradeAnalyticsDate(trade, analyticsDateBasis);
      return date ? [{ date, reviewed: trade.reviewed === true }] : [];
    });
  }, [
    dashboardData?.trades,
    plugin.settings.trade.analyticsDateBasis,
    uiState.selectedKind,
  ]);
  const breakEvenSettings = useMemo(
    () => ({
      breakEvenRangeMin: plugin.settings.trade.breakEvenRangeMin,
      breakEvenRangeMax: plugin.settings.trade.breakEvenRangeMax,
      breakEvenThresholdMode:
        plugin.settings.trade.breakEvenThresholdMode ?? 'fixed',
      breakEvenThresholdPercent:
        plugin.settings.trade.breakEvenThresholdPercent,
    }),
    [
      plugin.settings.trade.breakEvenRangeMin,
      plugin.settings.trade.breakEvenRangeMax,
      plugin.settings.trade.breakEvenThresholdMode,
      plugin.settings.trade.breakEvenThresholdPercent,
    ]
  );
  const streakData = useMemo(
    () =>
      getStreakData(
        reviewKind !== null ? [] : closedTrades,
        breakEvenSettings,
        plugin.settings.trade.analyticsDateBasis ?? 'entry'
      ),
    [
      breakEvenSettings,
      closedTrades,
      reviewKind,
      plugin.settings.trade.analyticsDateBasis,
    ]
  );
  const reviewStreakSummary = useMemo(() => {
    if (reviewKind === null) {
      return {
        currentStreak: 0,
        missedRequiredUnits: 0,
        hasReviewedAnchor: false,
      };
    }

    const items =
      reviewKind === 'trade-review' ? tradeReviewItems : reviewState.items;
    return calculateReviewStreakSummary(reviewKind, items, {
      now: new Date(reviewState.now),
      skipWeekends: plugin.settings.trade.skipWeekends,
      weekStartDay: plugin.settings.trade.weekStartDay,
    });
  }, [
    plugin.settings.trade.skipWeekends,
    plugin.settings.trade.weekStartDay,
    reviewState.items,
    reviewState.now,
    tradeReviewItems,
    reviewKind,
  ]);

  const saveKind = useCallback(
    async (kind: CurrentStreakKind) => {
      const home = plugin.settings.home;
      if (!home) return;

      const previousKind = uiState.selectedKind;
      dispatchUi({ type: 'saving', kind });
      setCurrentStreakConfig(home, instanceId, kind);

      try {
        await plugin.saveSettings();
        eventBus.publish('settings:changed', {
          component: 'home',
          section: 'home',
          source: 'current-streak-config',
        });
        dispatchUi({ type: 'saved' });
      } catch (error) {
        setCurrentStreakConfig(home, instanceId, previousKind);
        dispatchUi({ type: 'save-failed', kind: previousKind });
        new Notice(t('error.settings.save-failed'), 5000);
        console.error(
          '[CurrentStreakWidget] Failed to save streak kind:',
          error
        );
      }
    },
    [instanceId, plugin, uiState.selectedKind]
  );

  const handleWidgetClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isEditing || event.defaultPrevented) return;
      dispatchUi({ type: 'open-config' });
    },
    [isEditing]
  );
  const handleWidgetKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (isEditing || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      dispatchUi({ type: 'open-config' });
    },
    [isEditing]
  );

  const content = uiState.isConfiguring ? (
    <CurrentStreakConfigPanel
      draftKind={uiState.draftKind}
      isSaving={uiState.isSavingConfig}
      onCancel={() => dispatchUi({ type: 'close-config' })}
      onDraftKindChange={(kind) => dispatchUi({ type: 'select-draft', kind })}
      onSave={saveKind}
    />
  ) : !dashboardData && reviewKind === null ? (
    <CurrentStreakLoading />
  ) : (
    <CurrentStreakFrame
      isEditing={isEditing}
      kind={uiState.selectedKind}
      triggerRef={triggerRef}
      onClick={handleWidgetClick}
      onKeyDown={handleWidgetKeyDown}
    >
      {reviewKind !== null ? (
        <CurrentReviewStreakView
          kind={reviewKind}
          loading={
            reviewState.loading ||
            (uiState.selectedKind === 'trade-review' && !dashboardData)
          }
          error={reviewState.error}
          summary={reviewStreakSummary}
        />
      ) : (
        <CurrentOutcomeStreakView
          currentPeriod={currentPeriod}
          streakData={streakData}
        />
      )}
    </CurrentStreakFrame>
  );

  return content;
};

export const CurrentStreakWidget = memo(CurrentStreakWidgetComponent);
