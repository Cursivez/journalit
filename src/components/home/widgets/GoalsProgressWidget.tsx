

import React, {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useEventBus } from '../../../hooks/useEventBus';
import { eventBus } from '../../../services/events/EventBus';
import type { SettingsChangedPayload } from '../../../services/events/types';
import { Check, ChevronRight, X } from '../../shared/icons/ObsidianIcon';
import { Button } from '../../ui/Button';
import JournalitPlugin from '../../../main';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { cssVars } from '../../../styles/inlineStylePolicy';
import {
  GoalType,
  GoalPeriod,
  GoalConfig,
  GoalDirection,
} from '../../../settings/types';
import {
  DashboardData,
  fetchDashboardData,
  Trade,
} from '../../dashboard/utils/dataUtils';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import type { DisplayValueKind } from '../../../services/display/DisplayPolicy';
import { useHomeAccount } from '../context/HomeAccountContext';
import { isPnlContributingTrade } from '../../../utils/tradeStatusUtils';
import {
  getWeekStartDaySetting,
  WeekStartDaySetting,
} from '../../../utils/dateUtils';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../shared/display/CurrencyConversionInfo';
import { DropdownSelect } from '../../shared/DropdownSelect';
import { SegmentedControl } from '../../shared/SegmentedControl';
import Checkbox from '../../ui/Checkbox';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { t, tPlural } from '../../../lang/helpers';
import {
  GOAL_HEADER_KEYS,
  aggregateGoalAccountTargets,
  isValidGoalTarget,
} from './goalDefinitions';
import { getAnalyticsDateBasis } from '../../../utils/tradeAnalyticsDate';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';
import { expandAccountsWithCopyTradingAccounts } from '../../../utils/accountCopyTrading';
import {
  DEFAULT_GOAL_SESSION_COUNT,
  defaultGoalDirection,
  goalDirectionOf,
  goalMetricValue,
  goalPeriodsFor,
  goalPeriodTrades,
  goalStanding,
  parseGoalSessionCount,
} from './goalMetrics';

interface GoalsProgressWidgetProps {
  plugin: JournalitPlugin;
  instanceId: string;
}

interface GoalProgress {
  current: number;
  target: number;
  percentage: number;
  label: string;
  periodLabel: string;
  isComplete: boolean;
  direction: GoalDirection;
  
  exceeded: boolean;
  trades: Trade[];
  scopeMismatch?: boolean;
  configuredAccounts?: string[];
}

interface AccountScopedDashboardState {
  data: DashboardData | null;
}

interface GoalDraft {
  goalType: GoalType;
  direction: GoalDirection;
  target: string;
  period: GoalPeriod;
  sessionCount: string;
  useRMultiples: boolean;
  accountAware: boolean;
  accountTargets: Record<string, string>;
  accountTargetAccounts: string[];
}

const accountScopedDashboardReducer = (
  _state: AccountScopedDashboardState,
  data: DashboardData | null
): AccountScopedDashboardState => ({ data });

const aggregateAccountTarget = (
  config: Pick<GoalConfig, 'type' | 'accountTargets'>,
  accounts: string[]
): number =>
  aggregateGoalAccountTargets(
    config.type,
    accounts.map((account) => config.accountTargets?.[account] ?? 0)
  );

const buildGoalDraft = (
  existingConfig: GoalConfig | undefined,
  displayRMultiples: boolean
): GoalDraft => ({
  goalType: existingConfig?.type || 'pnl',
  direction: existingConfig
    ? goalDirectionOf(existingConfig)
    : defaultGoalDirection('pnl'),
  target: existingConfig?.target?.toString() || '',
  period: existingConfig?.period || 'weekly',
  sessionCount: String(
    existingConfig?.sessionCount ?? DEFAULT_GOAL_SESSION_COUNT
  ),
  useRMultiples: existingConfig?.useRMultiples ?? displayRMultiples,
  accountAware: existingConfig?.accountAware ?? false,
  accountTargets: Object.fromEntries(
    Object.entries(existingConfig?.accountTargets ?? {}).map(
      ([account, value]) => [account, String(value)]
    )
  ),
  accountTargetAccounts: [...(existingConfig?.accountTargetAccounts ?? [])],
});

const tradeMatchesGoalAccounts = (
  trade: Trade,
  accountLookupKeys: ReadonlySet<string>
): boolean => {
  const tradeAccounts = [
    ...(trade.accountNamesNormalized ?? []),
    ...(trade.account ?? []),
    ...(trade.accountLookupKeys ?? []),
  ];

  return tradeAccounts.some((account) =>
    accountLookupKeys.has(normalizeAccountLookupKey(account))
  );
};

const copiedTradeMatchesGoalBase = (
  trade: Trade,
  baseAccountLookupKeys: ReadonlySet<string>
): boolean =>
  typeof trade.copiedFromAccount === 'string' &&
  baseAccountLookupKeys.has(normalizeAccountLookupKey(trade.copiedFromAccount));

const GOAL_TYPES: readonly GoalType[] = [
  'pnl',
  'tradesJournaled',
  'winRate',
  'profitFactor',
  'expectancy',
  'maxDrawdown',
];

const GOAL_TYPE_LABEL_KEYS = {
  pnl: 'home.widget.goals-progress.type.pnl',
  tradesJournaled: 'home.widget.goals-progress.type.trades-logged',
  winRate: 'home.widget.goals-progress.type.win-rate',
  profitFactor: 'home.widget.goals-progress.type.profit-factor',
  expectancy: 'home.widget.goals-progress.type.expectancy',
  maxDrawdown: 'home.widget.goals-progress.type.max-drawdown',
} as const satisfies Record<GoalType, string>;

const GOAL_PERIOD_LABEL_KEYS = {
  daily: 'home.widget.goals-progress.period.daily',
  weekly: 'home.widget.goals-progress.period.weekly',
  monthly: 'home.widget.goals-progress.period.monthly',
  sessions: 'home.widget.goals-progress.period.sessions',
  lifetime: 'home.widget.goals-progress.period.lifetime',
} as const satisfies Record<GoalPeriod, string>;

const isGoalType = (value: string): value is GoalType =>
  GOAL_TYPES.some((type) => type === value);


const goalPeriodLabel = (
  config: Pick<GoalConfig, 'period' | 'sessionCount'>
): string => {
  switch (config.period) {
    case 'daily':
      return t('home.widget.goals-progress.period-label.today');
    case 'weekly':
      return t('home.widget.goals-progress.period-label.this-week');
    case 'monthly':
      return t('home.widget.goals-progress.period-label.this-month');
    case 'sessions':
      return tPlural(
        'home.widget.goals-progress.period-label.sessions',
        config.sessionCount ?? DEFAULT_GOAL_SESSION_COUNT
      );
    case 'lifetime':
      return t('home.widget.goals-progress.period-label.total');
  }
};


const goalValueKind = (config: GoalConfig): DisplayValueKind | null => {
  switch (config.type) {
    case 'pnl':
      return config.useRMultiples ? 'rMultiple' : 'pnl';
    case 'winRate':
      return 'returnPercent';
    case 'profitFactor':
      return 'metric';
    case 'expectancy':
      return 'pnl';
    case 'maxDrawdown':
      return 'drawdown';
    case 'tradesJournaled':
      return null;
  }
};

type FormatValue = ReturnType<typeof useDisplayFormatter>['formatValue'];


const formatGoalValue = (
  config: GoalConfig,
  value: number,
  currencyCode: string,
  formatValue: FormatValue,
  signed: boolean
): string => {
  switch (config.type) {
    case 'pnl':
      return config.useRMultiples
        ? formatValue({
            kind: 'rMultiple',
            value,
            precision: 1,
            ...(signed ? {} : { signed: false }),
          })
        : formatValue({
            kind: 'pnl',
            value,
            currencyCode,
            ...(signed ? {} : { signed: false }),
          });
    case 'expectancy':
      return formatValue({
        kind: 'pnl',
        value,
        currencyCode,
        ...(signed ? {} : { signed: false }),
      });
    case 'maxDrawdown':
      return formatValue({ kind: 'drawdown', value, currencyCode });
    case 'winRate':
      return formatValue({
        kind: 'returnPercent',
        value,
        signed: false,
        precision: 1,
      });
    case 'profitFactor':
      return formatValue({ kind: 'metric', value, precision: 2 });
    case 'tradesJournaled':
      return t('home.widget.goals-progress.trades-count', {
        count: String(value),
      });
  }
};


const useGoalModel = (
  plugin: JournalitPlugin,
  instanceId: string,
  existingConfig: GoalConfig | undefined,
  dashboardData: ReturnType<typeof useDashboardData>,
  currency: string,
  formatValue: FormatValue,
  defaultRiskAmount: number | undefined,
  weekStartDay: WeekStartDaySetting,
  accountContext: ReturnType<typeof useHomeAccount>
) => {
  const getPersistedDraft = useCallback(
    () =>
      buildGoalDraft(
        existingConfig,
        plugin.settings.trade?.displayRMultiples || false
      ),
    [existingConfig, plugin.settings.trade?.displayRMultiples]
  );
  const [showModal, setShowModal] = useState(!existingConfig);
  const [draft, setDraft] = useState<GoalDraft>(() => getPersistedDraft());
  const updateDraft = useCallback(
    <K extends keyof GoalDraft>(key: K, value: GoalDraft[K]) =>
      setDraft((prev) => ({ ...prev, [key]: value })),
    []
  );

  const handleOpenModal = useCallback(() => {
    setDraft(getPersistedDraft());
    setShowModal(true);
  }, [getPersistedDraft]);

  const handleCancelModal = useCallback(() => {
    setDraft(getPersistedDraft());
    setShowModal(false);
  }, [getPersistedDraft]);

  const rMultiplesEnabled = plugin.settings.trade?.displayRMultiples || false;
  const accountMetadata = plugin.settings.account?.accountMetadata;
  const includeCopyAccountsInAnalytics =
    plugin.settings.trade?.includeCopyAccountsInAllAccountsAnalytics === true;
  const [, setSettingsVersion] = useState(0);

  const handleSettingsChanged = useCallback(
    (payload?: SettingsChangedPayload) => {
      if (
        payload?.section === 'trade' ||
        payload?.source === 'week-start' ||
        payload?.section === 'home' ||
        payload?.section === 'all'
      ) {
        setSettingsVersion((prev) => prev + 1);
      }
      
      
      if (
        (payload?.section === 'home' || payload?.section === 'all') &&
        !existingConfig &&
        plugin.settings.home?.goals?.[instanceId]
      ) {
        setShowModal(false);
      }
    },
    [existingConfig, plugin, instanceId]
  );

  useEventBus('settings:changed', handleSettingsChanged);

  
  const progress = useMemo((): GoalProgress | null => {
    if (!existingConfig || !dashboardData?.dashboardData?.trades) {
      return null;
    }

    const trades: Trade[] = dashboardData.dashboardData.trades;
    const config = existingConfig;
    const configuredGoalAccounts = config.accountTargetAccounts ?? [];
    const contextSelectedGoalAccounts = accountContext?.hasAccountFilter
      ? configuredGoalAccounts.filter((account) =>
          accountContext.matchesAccount(account)
        )
      : configuredGoalAccounts;
    const selectedGoalAccounts = expandAccountsWithCopyTradingAccounts(
      contextSelectedGoalAccounts,
      accountMetadata,
      includeCopyAccountsInAnalytics
    );
    const targetValue =
      config.accountAware && config.accountTargets
        ? aggregateAccountTarget(config, contextSelectedGoalAccounts)
        : config.target;
    const scopeMismatch =
      Boolean(config.accountAware) && contextSelectedGoalAccounts.length === 0;

    
    
    let scopedTrades = trades;
    if (config.accountAware) {
      const explicitGoalAccountLookupKeys = new Set(
        contextSelectedGoalAccounts.map((account) =>
          normalizeAccountLookupKey(account)
        )
      );
      const expandedGoalAccountLookupKeys = new Set(
        selectedGoalAccounts.map((account) =>
          normalizeAccountLookupKey(account)
        )
      );
      scopedTrades = trades.filter(
        (trade) =>
          tradeMatchesGoalAccounts(trade, explicitGoalAccountLookupKeys) ||
          (trade.isCopiedTrade === true &&
            copiedTradeMatchesGoalBase(trade, explicitGoalAccountLookupKeys) &&
            tradeMatchesGoalAccounts(trade, expandedGoalAccountLookupKeys))
      );
    }
    const periodTrades = goalPeriodTrades(scopedTrades, config, {
      plugin,
      weekStartDay,
      now: new Date(),
    });

    const rRiskAmount =
      config.type === 'pnl' &&
      config.useRMultiples &&
      typeof defaultRiskAmount === 'number' &&
      Number.isFinite(defaultRiskAmount) &&
      defaultRiskAmount > 0
        ? defaultRiskAmount
        : undefined;
    const current = goalMetricValue(config.type, periodTrades, {
      breakEvenSettings: plugin.settings.trade,
      analyticsDateBasis: getAnalyticsDateBasis(plugin.settings),
      rRiskAmount,
    });
    const currencyCode =
      dashboardData.dashboardData?.metrics.conversionBaseCurrency || currency;
    
    const valueConfig =
      config.type === 'pnl' && rRiskAmount === undefined
        ? { ...config, useRMultiples: false }
        : config;
    const direction = goalDirectionOf(config);
    
    
    const standing = scopeMismatch
      ? { percentage: 0, isComplete: false, exceeded: false }
      : goalStanding(current, targetValue, direction);

    return {
      current,
      target: targetValue,
      percentage: standing.percentage,
      label: formatGoalValue(
        valueConfig,
        current,
        currencyCode,
        formatValue,
        true
      ),
      periodLabel: goalPeriodLabel(config),
      isComplete: standing.isComplete,
      direction,
      exceeded: standing.exceeded,
      trades: periodTrades.filter((trade) => isPnlContributingTrade(trade)),
      scopeMismatch,
      configuredAccounts: configuredGoalAccounts,
    };
  }, [
    existingConfig,
    dashboardData,
    currency,
    formatValue,
    defaultRiskAmount,
    plugin,
    accountMetadata,
    includeCopyAccountsInAnalytics,
    weekStartDay,
    accountContext,
  ]);

  const usesAccountTargets =
    draft.accountAware && !(draft.goalType === 'pnl' && draft.useRMultiples);
  const periods = goalPeriodsFor(draft.goalType);
  
  const draftPeriod = periods.includes(draft.period) ? draft.period : 'weekly';
  const sessionCount =
    draftPeriod === 'sessions'
      ? parseGoalSessionCount(draft.sessionCount)
      : undefined;

  const parsedTarget = parseFloat(draft.target);
  const enteredAccountTargets = draft.accountTargetAccounts.flatMap(
    (account) => {
      const value = parseFloat(draft.accountTargets[account] ?? '');
      return Number.isFinite(value) && value > 0 ? [value] : [];
    }
  );
  const canSave =
    (draftPeriod !== 'sessions' || sessionCount !== undefined) &&
    (usesAccountTargets
      ? enteredAccountTargets.length > 0 &&
        enteredAccountTargets.every((value) =>
          isValidGoalTarget(draft.goalType, value)
        )
      : isValidGoalTarget(draft.goalType, parsedTarget));

  
  const handleSave = useCallback(async () => {
    if (!canSave) return;
    const parsedAccountTargets: Record<string, number> = {};
    const accountTargetAccountSet = new Set(draft.accountTargetAccounts);
    for (const [account, rawValue] of Object.entries(draft.accountTargets)) {
      if (!accountTargetAccountSet.has(account)) {
        continue;
      }

      const value = parseFloat(rawValue);
      if (Number.isFinite(value) && value > 0) {
        parsedAccountTargets[account] = value;
      }
    }
    const targetNum = usesAccountTargets
      ? aggregateAccountTarget(
          { type: draft.goalType, accountTargets: parsedAccountTargets },
          draft.accountTargetAccounts
        )
      : parsedTarget;

    if (!plugin.settings.home) {
      plugin.settings.home = {
        layouts: { Default: { lg: [], md: [], sm: [], xs: [], xxs: [] } },
        activeLayout: 'Default',
      };
    }
    if (!plugin.settings.home.goals) {
      plugin.settings.home.goals = {};
    }

    const config: GoalConfig = {
      type: draft.goalType,
      target: targetNum,
      period: draftPeriod,
      sessionCount,
      direction: draft.direction,
      useRMultiples: draft.goalType === 'pnl' ? draft.useRMultiples : undefined,
      accountAware: usesAccountTargets || undefined,
      accountTargets: usesAccountTargets ? parsedAccountTargets : undefined,
      accountTargetAccounts: usesAccountTargets
        ? draft.accountTargetAccounts.filter(
            (account) => parsedAccountTargets[account] > 0
          )
        : undefined,
      createdAt: existingConfig?.createdAt || new Date().toISOString(),
    };

    const goals = plugin.settings.home.goals;
    const previous = goals[instanceId];
    goals[instanceId] = config;
    try {
      await plugin.saveSettings();
      setShowModal(false);
      eventBus.publish('settings:changed', {
        component: 'home',
        section: 'home',
        source: 'goals-progress',
      });
    } catch (err) {
      if (goals[instanceId] === config) {
        if (previous === undefined) delete goals[instanceId];
        else goals[instanceId] = previous;
      }
      console.error('Failed to save goal settings:', err);
    }
  }, [
    canSave,
    draft,
    draftPeriod,
    parsedTarget,
    sessionCount,
    usesAccountTargets,
    instanceId,
    plugin,
    existingConfig,
  ]);

  
  const getTargetLabel = (): string => {
    if (!existingConfig) return '';
    const configuredGoalAccounts = existingConfig.accountTargetAccounts ?? [];
    const selectedGoalAccounts = accountContext?.hasAccountFilter
      ? configuredGoalAccounts.filter((account) =>
          accountContext.matchesAccount(account)
        )
      : configuredGoalAccounts;
    const targetValue =
      existingConfig.accountAware && existingConfig.accountTargets
        ? aggregateAccountTarget(existingConfig, selectedGoalAccounts)
        : existingConfig.target;
    return formatGoalValue(
      existingConfig,
      targetValue,
      dashboardData.dashboardData?.metrics.conversionBaseCurrency || currency,
      formatValue,
      false
    );
  };

  return {
    showModal,
    handleOpenModal,
    handleCancelModal,
    draft: { ...draft, period: draftPeriod },
    updateDraft,
    rMultiplesEnabled,
    progress,
    handleSave,
    getTargetLabel,
    canSave,
  };
};

const getProgressClass = (progress: GoalProgress): string => {
  const { percentage, isComplete } = progress;
  if (progress.direction === 'atMost') {
    
    if (progress.exceeded) return 'journalit-home-goals--critical';
    if (percentage >= 90) return 'journalit-home-goals--low';
    if (percentage >= 70) return 'journalit-home-goals--medium';
    return 'journalit-home-goals--high';
  }
  if (isComplete) return 'journalit-home-goals--complete';
  if (percentage >= 75) return 'journalit-home-goals--high';
  if (percentage >= 50) return 'journalit-home-goals--medium';
  if (percentage >= 25) return 'journalit-home-goals--low';
  return 'journalit-home-goals--critical';
};

const goalTargetSuffix = (goalType: GoalType, currency: string): string => {
  switch (goalType) {
    case 'pnl':
    case 'expectancy':
    case 'maxDrawdown':
      return currency;
    case 'winRate':
      return '%';
    case 'profitFactor':
      return '';
    case 'tradesJournaled':
      return t('common.trades').toLowerCase();
  }
};

const goalTargetPlaceholder = (
  goalType: GoalType,
  usesRMultiplesForPnl: boolean
): string => {
  switch (goalType) {
    case 'pnl':
      return usesRMultiplesForPnl ? '10' : '500';
    case 'winRate':
      return '60';
    case 'profitFactor':
      return '1.5';
    case 'expectancy':
      return '50';
    case 'maxDrawdown':
      return '1500';
    case 'tradesJournaled':
      return '100';
  }
};


const GoalAccountTargetRows: React.FC<{
  accountNames: string[];
  accountTargets: Record<string, string>;
  setAccountTargets: (targets: Record<string, string>) => void;
  accountTargetAccounts: string[];
  setAccountTargetAccounts: (accounts: string[]) => void;
  suffix: string;
  placeholder: string;
}> = ({
  accountNames,
  accountTargets,
  setAccountTargets,
  accountTargetAccounts,
  setAccountTargetAccounts,
  suffix,
  placeholder,
}) => {
  const chosen = new Set(accountTargetAccounts);
  const available = accountNames.filter((account) => !chosen.has(account));
  return (
    <div className="journalit-goal-form__accounts">
      {accountTargetAccounts.map((account) => (
        <div key={account} className="journalit-goal-form__account-row">
          <span className="journalit-goal-form__account-name">{account}</span>
          <input
            type="number"
            value={accountTargets[account] ?? ''}
            onChange={(e) =>
              setAccountTargets({
                ...accountTargets,
                [account]: e.target.value,
              })
            }
            placeholder={placeholder}
            aria-label={t('home.widget.goals-progress.aria.account-target', {
              account,
            })}
            className="journalit-home-goals__target-input"
          />
          {suffix && (
            <span className="journalit-goal-form__suffix">{suffix}</span>
          )}
          <button
            type="button"
            className="clickable-icon journalit-goal-form__account-remove"
            aria-label={t('home.widget.goals-progress.aria.remove-account', {
              account,
            })}
            onClick={() =>
              setAccountTargetAccounts(
                accountTargetAccounts.filter((selected) => selected !== account)
              )
            }
          >
            <X size={12} />
          </button>
        </div>
      ))}
      {available.length > 0 && (
        <DropdownSelect
          className="journalit-goal-form__dropdown journalit-goal-form__dropdown--add"
          value=""
          placeholder={t('home.widget.goals-progress.add-account')}
          options={available.map((account) => ({
            value: account,
            label: account,
          }))}
          onChange={(account) =>
            setAccountTargetAccounts([...accountTargetAccounts, account])
          }
          ariaLabel={t('home.widget.goals-progress.add-account')}
          menuWidth="content"
          showSelectionIndicator={false}
        />
      )}
    </div>
  );
};

const GOAL_DIRECTIONS: readonly GoalDirection[] = ['atLeast', 'atMost'];

const GOAL_DIRECTION_LABEL_KEYS = {
  atLeast: 'home.widget.goals-progress.direction.at-least',
  atMost: 'home.widget.goals-progress.direction.at-most',
} as const satisfies Record<GoalDirection, string>;

type GoalModel = ReturnType<typeof useGoalModel>;

type GoalDraftProps = Pick<GoalModel, 'draft' | 'updateDraft'>;


const goalUsesRMultiples = (draft: GoalDraft): boolean =>
  draft.goalType === 'pnl' && draft.useRMultiples;


const GoalAmountField: React.FC<
  GoalDraftProps & { accountNames: string[]; currency: string }
> = ({ draft, updateDraft, accountNames, currency }) => {
  const { goalType } = draft;
  const usesRMultiplesForPnl = goalUsesRMultiples(draft);
  const usesAccountTargets = draft.accountAware && !usesRMultiplesForPnl;
  const targetSuffix = goalTargetSuffix(goalType, currency);
  const suffix = usesRMultiplesForPnl ? 'R' : targetSuffix;
  const isLimit = draft.direction === 'atMost';
  const amountLabel = usesAccountTargets
    ? t(
        isLimit
          ? 'home.widget.goals-progress.field.limits'
          : 'home.widget.goals-progress.field.targets'
      )
    : t(
        isLimit
          ? 'home.widget.goals-progress.field.limit'
          : 'home.widget.goals-progress.target'
      );

  return (
    <>
      <span
        className={`journalit-goal-form__label${usesAccountTargets ? ' journalit-goal-form__label--top' : ''}`}
      >
        {amountLabel}
      </span>
      {usesAccountTargets ? (
        <GoalAccountTargetRows
          accountNames={accountNames}
          accountTargets={draft.accountTargets}
          setAccountTargets={(targets) =>
            updateDraft('accountTargets', targets)
          }
          accountTargetAccounts={draft.accountTargetAccounts}
          setAccountTargetAccounts={(accounts) =>
            updateDraft('accountTargetAccounts', accounts)
          }
          suffix={targetSuffix}
          placeholder={goalTargetPlaceholder(goalType, false)}
        />
      ) : (
        <div className="journalit-goal-form__amount">
          <input
            type="number"
            value={draft.target}
            onChange={(e) => updateDraft('target', e.target.value)}
            placeholder={goalTargetPlaceholder(goalType, usesRMultiplesForPnl)}
            aria-label={amountLabel}
            className="journalit-home-goals__target-input"
          />
          {suffix && (
            <span className="journalit-goal-form__suffix">{suffix}</span>
          )}
        </div>
      )}
    </>
  );
};


const GoalFormOptions: React.FC<
  GoalDraftProps & { rMultiplesEnabled: boolean; hasAccounts: boolean }
> = ({ draft, updateDraft, rMultiplesEnabled, hasAccounts }) => {
  const showAccountAware = !goalUsesRMultiples(draft) && hasAccounts;
  
  
  const showRToggle =
    draft.goalType === 'pnl' && (rMultiplesEnabled || draft.useRMultiples);
  if (!showAccountAware && !showRToggle) return null;

  return (
    <div className="journalit-goal-form__options">
      {showAccountAware && (
        <Checkbox
          checked={draft.accountAware}
          onChange={(checked) => updateDraft('accountAware', checked)}
          label={t('home.widget.goals-progress.account-aware')}
        />
      )}
      {showRToggle && (
        <Checkbox
          checked={draft.useRMultiples}
          onChange={(checked) => updateDraft('useRMultiples', checked)}
          label={t('home.widget.goals-progress.use-r-multiples')}
        />
      )}
    </div>
  );
};


const GoalSettingModal: React.FC<{
  model: Pick<
    GoalModel,
    'draft' | 'updateDraft' | 'rMultiplesEnabled' | 'canSave'
  >;
  handleSave: () => Promise<void>;
  onCancel: () => void;
  accountNames: string[];
  existingConfig?: GoalConfig;
  currency: string;
}> = ({
  model,
  handleSave,
  onCancel,
  accountNames,
  existingConfig,
  currency,
}) => {
  const { draft, updateDraft, rMultiplesEnabled, canSave } = model;
  const { goalType, direction, period } = draft;
  const ids = useId();
  const pickType = (value: string) => {
    if (!isGoalType(value)) return;
    updateDraft('goalType', value);
    updateDraft('direction', defaultGoalDirection(value));
  };

  return (
    <div className="journalit-home-goals journalit-home-goals--modal">
      <div className="journalit-home-goals__header">
        <div className="journalit-home-widget__eyebrow">
          {t('home.widget.goals-progress.set-goal')}
        </div>
        <div className="journalit-home-goals__actions">
          <Button
            variant="primary"
            size="small"
            className="journalit-home-config-icon-button"
            onClick={handleSave}
            disabled={!canSave}
            aria-label={t('home.widget.goals-progress.aria.save-goal')}
          >
            <Check size={14} aria-hidden="true" />
          </Button>
          {existingConfig && (
            <Button
              variant="secondary"
              size="small"
              className="journalit-home-config-icon-button"
              onClick={onCancel}
              aria-label={t('button.cancel')}
            >
              <X size={14} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      <div className="journalit-goal-form__grid">
        <span id={`${ids}-metric`} className="journalit-goal-form__label">
          {t('home.widget.goals-progress.field.metric')}
        </span>
        <DropdownSelect
          className="journalit-goal-form__dropdown"
          value={goalType}
          options={GOAL_TYPES.map((value) => ({
            value,
            label: t(GOAL_TYPE_LABEL_KEYS[value]),
          }))}
          onChange={pickType}
          ariaLabel={t('home.widget.goals-progress.field.metric')}
          ariaLabelledBy={`${ids}-metric`}
          menuWidth="content"
        />

        <span id={`${ids}-rule`} className="journalit-goal-form__label">
          {t('home.widget.goals-progress.field.rule')}
        </span>
        <SegmentedControl<GoalDirection>
          options={GOAL_DIRECTIONS.map((value) => ({
            value,
            label: t(GOAL_DIRECTION_LABEL_KEYS[value]),
          }))}
          value={direction}
          onChange={(value) => updateDraft('direction', value)}
          size="small"
          fullWidth
          groupRole="radiogroup"
          ariaLabelledBy={`${ids}-rule`}
        />

        <GoalAmountField
          draft={draft}
          updateDraft={updateDraft}
          accountNames={accountNames}
          currency={currency}
        />

        <span id={`${ids}-period`} className="journalit-goal-form__label">
          {t('home.widget.goals-progress.field.period')}
        </span>
        <SegmentedControl<GoalPeriod>
          options={goalPeriodsFor(goalType).map((value) => ({
            value,
            label: t(GOAL_PERIOD_LABEL_KEYS[value]),
          }))}
          value={period}
          onChange={(value) => updateDraft('period', value)}
          size="small"
          fullWidth
          ariaLabelledBy={`${ids}-period`}
        />

        {period === 'sessions' && (
          <>
            <label
              htmlFor={`${ids}-sessions`}
              className="journalit-goal-form__label"
            >
              {t('home.widget.goals-progress.field.last')}
            </label>
            <span className="journalit-goal-form__session-count">
              <input
                id={`${ids}-sessions`}
                type="number"
                min={1}
                step={1}
                value={draft.sessionCount}
                onChange={(e) => updateDraft('sessionCount', e.target.value)}
                className="journalit-home-goals__target-input"
              />
              {t('home.widget.goals-progress.field.sessions-unit')}
            </span>
          </>
        )}
      </div>

      <GoalFormOptions
        draft={draft}
        updateDraft={updateDraft}
        rMultiplesEnabled={rMultiplesEnabled}
        hasAccounts={accountNames.length > 0}
      />
    </div>
  );
};


const GoalLoadingSkeleton: React.FC = () => (
  <div className="journalit-home-goals journalit-home-goals--loading">
    
    <div className="journalit-home-goals__loading-header">
      <SkeletonText width="70px" height="11px" />
      <SkeletonBox width={12} height={12} borderRadius="3px" />
    </div>

    
    <div className="journalit-home-goals__hero">
      
      <SkeletonBox width={80} height={28} borderRadius="8px" />
      
      <SkeletonText width="120px" height="12px" />
      
      <SkeletonBox width="100%" height={8} borderRadius="4px" />
      
      <SkeletonText width="90px" height="13px" />
    </div>
  </div>
);


const GoalEmptyState: React.FC<{
  onSetGoal: () => void;
}> = ({ onSetGoal }) => (
  <button
    type="button"
    onClick={onSetGoal}
    className="journalit-native-button journalit-native-button--unstyled journalit-home-goals journalit-home-goals--empty"
    aria-label={t('home.widget.goals-progress.aria.set-goal')}
  >
    <span className="journalit-home-goals__empty-text">
      {t('home.widget.goals-progress.click-to-set')}
    </span>
  </button>
);

const GoalScopeMismatchState: React.FC<{
  configuredAccounts: string[];
  onEdit: () => void;
}> = ({ configuredAccounts, onEdit }) => (
  <button
    type="button"
    onClick={onEdit}
    className="journalit-native-button journalit-native-button--unstyled journalit-home-goals journalit-home-goals--empty journalit-home-goals--scope-mismatch"
    aria-label={t('home.widget.goals-progress.aria.change-goal')}
  >
    <span className="journalit-home-goals__empty-text">
      {t('home.widget.goals-progress.no-target-selected')}
    </span>
    <span className="journalit-home-goals__scope-hint">
      {configuredAccounts.length > 0
        ? t('home.widget.goals-progress.configured-for', {
            accounts: configuredAccounts.join(', '),
          })
        : t('home.widget.goals-progress.click-to-set')}
    </span>
  </button>
);


const isGoalMasked = (
  config: GoalConfig,
  shouldMask: (kind: DisplayValueKind) => boolean
): boolean => {
  const kind = goalValueKind(config);
  return kind !== null && shouldMask(kind);
};


const goalCompletionLabel = (progress: GoalProgress): string => {
  if (progress.direction === 'atMost') {
    return progress.exceeded
      ? t('home.widget.goals-progress.over-limit')
      : t('home.widget.goals-progress.limit-used', {
          percent: String(Math.floor(progress.percentage)),
        });
  }
  return progress.isComplete
    ? t('home.widget.goals-progress.complete-100')
    : t('home.widget.goals-progress.complete-percent', {
        percent: String(Math.floor(progress.percentage)),
      });
};


const GoalProgressDisplay: React.FC<{
  progress: GoalProgress;
  existingConfig: GoalConfig;
  dashboardData: ReturnType<typeof useDashboardData>;
  getTargetLabel: () => string;
  shouldMask: (kind: DisplayValueKind) => boolean;
  formatValue: FormatValue;
  onEdit: () => void;
}> = ({
  progress,
  existingConfig,
  dashboardData,
  getTargetLabel,
  shouldMask,
  formatValue,
  onEdit,
}) => {
  if (progress.scopeMismatch) {
    return (
      <GoalScopeMismatchState
        configuredAccounts={progress.configuredAccounts ?? []}
        onEdit={onEdit}
      />
    );
  }

  const isSensitiveGoalMasked = isGoalMasked(existingConfig, shouldMask);
  const progressClass = isSensitiveGoalMasked ? '' : getProgressClass(progress);
  const progressPercentLabel = isSensitiveGoalMasked
    ? formatValue({ kind: 'metric', value: progress.percentage })
    : goalCompletionLabel(progress);
  const showsConversionInfo =
    (existingConfig.type === 'pnl' && !existingConfig.useRMultiples) ||
    existingConfig.type === 'expectancy' ||
    existingConfig.type === 'maxDrawdown';

  return (
    <div
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onEdit();
      }}
      className={`journalit-home-goals journalit-home-goals--active ${progressClass}`}
      aria-label={t('home.widget.goals-progress.aria.change-goal')}
    >
      
      <div className="journalit-home-goals__display-header">
        <div className="journalit-home-widget__eyebrow">
          {t(GOAL_HEADER_KEYS[progress.direction][existingConfig.type])}
          {showsConversionInfo && (
            <CurrencyConversionInfo
              metadata={buildCurrencyConversionMetadata(
                dashboardData.dashboardData?.metrics
              )}
              trades={progress.trades}
            />
          )}
        </div>
        <div className="journalit-home-goals__display-actions">
          {progress.isComplete && !isSensitiveGoalMasked && (
            <div className="journalit-home-goals__complete">
              <Check size={12} />
              {t('home.widget.goals-progress.goal-reached')}
            </div>
          )}
          {progress.exceeded && !isSensitiveGoalMasked && (
            <div className="journalit-home-goals__complete journalit-home-goals__complete--exceeded">
              <X size={12} />
              {t('home.widget.goals-progress.limit-exceeded')}
            </div>
          )}
          <ChevronRight
            size={12}
            className="journalit-home-goals__header-chevron"
            aria-hidden="true"
          />
        </div>
      </div>

      
      <div className="journalit-home-goals__hero">
        
        <div className="journalit-home-goals__value">{progress.label}</div>

        
        <div className="journalit-home-goals__target-context">
          {t(
            progress.direction === 'atMost'
              ? 'home.widget.goals-progress.of-limit'
              : 'home.widget.goals-progress.of-target',
            {
              target: getTargetLabel(),
              period: progress.periodLabel,
            }
          )}
        </div>

        
        <div className="journalit-home-goals__bar">
          <div
            className="journalit-home-goals__bar-fill"
            style={cssVars({
              '--journalit-home-goals-progress': isSensitiveGoalMasked
                ? '0%'
                : `${progress.percentage}%`,
            })}
          />
        </div>

        
        <div className="journalit-home-goals__percent">
          {progressPercentLabel}
        </div>
      </div>
    </div>
  );
};

const GoalsProgressWidgetComponent: React.FC<GoalsProgressWidgetProps> = ({
  plugin,
  instanceId,
}) => {
  const dashboardData = useDashboardData();
  const { currency: liveCurrency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const accountContext = useHomeAccount();
  const [accountScopedDashboardState, dispatchAccountScopedDashboardData] =
    useReducer(accountScopedDashboardReducer, { data: null });

  
  const existingConfig = plugin.settings.home?.goals?.[instanceId];

  
  const defaultRiskAmount = plugin.settings.trade?.defaultRiskAmount;
  const [accountMetadataSnapshot, setAccountMetadataSnapshot] = useState(
    () => plugin.settings.account?.accountMetadata
  );
  const includeCopyAccountsInAnalytics =
    plugin.settings.trade?.includeCopyAccountsInAllAccountsAnalytics === true;
  const handleAccountChanged = useCallback(() => {
    setAccountMetadataSnapshot({
      ...(plugin.settings.account?.accountMetadata ?? {}),
    });
  }, [plugin]);
  useEventBus('account:changed', handleAccountChanged);
  const weekStartDay = getWeekStartDaySetting(plugin);
  const accountNames = useMemo(() => {
    if (accountContext?.availableAccounts.length) {
      return [...accountContext.availableAccounts].sort((a, b) =>
        a.localeCompare(b)
      );
    }

    const nextAccountNames: string[] = [];
    for (const account of Object.values(accountMetadataSnapshot ?? {})) {
      if (account.accountType?.toLowerCase() !== 'archived') {
        nextAccountNames.push(account.name);
      }
    }

    return nextAccountNames.sort((a, b) => a.localeCompare(b));
  }, [accountContext?.availableAccounts, accountMetadataSnapshot]);
  const accountScopedGoalAccounts = useMemo(
    () =>
      existingConfig?.accountAware &&
      existingConfig.accountTargetAccounts?.length
        ? expandAccountsWithCopyTradingAccounts(
            existingConfig.accountTargetAccounts,
            accountMetadataSnapshot,
            includeCopyAccountsInAnalytics
          )
        : [],
    [
      existingConfig?.accountAware,
      existingConfig?.accountTargetAccounts,
      accountMetadataSnapshot,
      includeCopyAccountsInAnalytics,
    ]
  );

  useEffect(() => {
    if (!dashboardData || accountScopedGoalAccounts.length === 0) {
      dispatchAccountScopedDashboardData(null);
      return;
    }

    let cancelled = false;
    void fetchDashboardData(
      plugin.app,
      plugin.tradeService,
      {
        ...dashboardData.filters,
        accounts: accountScopedGoalAccounts,
      },
      defaultRiskAmount,
      plugin
    )
      .then((data) => {
        if (!cancelled) {
          dispatchAccountScopedDashboardData(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          dispatchAccountScopedDashboardData(null);
        }
        console.error(
          'Failed to load account-scoped goal dashboard data:',
          error
        );
      });

    return () => {
      cancelled = true;
    };
  }, [dashboardData, accountScopedGoalAccounts, defaultRiskAmount, plugin]);

  const dashboardDataForGoal = accountScopedDashboardState.data
    ? { ...dashboardData, dashboardData: accountScopedDashboardState.data }
    : dashboardData;
  
  
  const currency = dashboardDataForGoal.dashboardData?.currency ?? liveCurrency;

  const model = useGoalModel(
    plugin,
    instanceId,
    existingConfig,
    dashboardDataForGoal,
    currency,
    formatValue,
    defaultRiskAmount,
    weekStartDay,
    accountContext
  );

  
  if (model.showModal) {
    return (
      <GoalSettingModal
        model={model}
        handleSave={model.handleSave}
        onCancel={model.handleCancelModal}
        accountNames={accountNames}
        existingConfig={existingConfig}
        currency={currency}
      />
    );
  }

  
  if (existingConfig && !dashboardData?.dashboardData) {
    return <GoalLoadingSkeleton />;
  }

  
  if (!model.progress) {
    return <GoalEmptyState onSetGoal={model.handleOpenModal} />;
  }

  
  return (
    <GoalProgressDisplay
      progress={model.progress}
      existingConfig={existingConfig!}
      dashboardData={dashboardData}
      getTargetLabel={model.getTargetLabel}
      shouldMask={shouldMask}
      formatValue={formatValue}
      onEdit={model.handleOpenModal}
    />
  );
};

export const GoalsProgressWidget = memo(GoalsProgressWidgetComponent);
