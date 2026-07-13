

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useEventBus } from '../../../hooks/useEventBus';
import { X, Check } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { GoalType, GoalPeriod, GoalConfig } from '../../../settings/types';
import {
  DashboardData,
  fetchDashboardData,
  Trade,
  isTradeOpenInDashboard,
} from '../../dashboard/utils/dataUtils';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { useHomeAccount } from '../context/HomeAccountContext';
import {
  calculateWinRateExcludingBreakeven,
  classifyPnLWithBreakEvenSettings,
} from '../../../utils/breakEvenRange';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import {
  getWeekStartDate,
  getWeekStartDaySetting,
  WeekStartDaySetting,
} from '../../../utils/dateUtils';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../shared/display/CurrencyConversionInfo';
import { getTradingDay } from '../../../utils/tradingDayUtils';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { t } from '../../../lang/helpers';
import { getTradeAnalyticsTradingDay } from '../../../utils/tradeAnalyticsDate';
import { normalizeAccountLookupKey } from '../../../services/trade/core/TradeAccountIdentity';
import { expandAccountsWithCopyTradingAccounts } from '../../../utils/accountCopyTrading';

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
  trades: Trade[];
  scopeMismatch?: boolean;
  configuredAccounts?: string[];
}

interface AccountScopedDashboardState {
  data: DashboardData | null;
}

interface GoalDraft {
  goalType: GoalType;
  target: string;
  period: GoalPeriod;
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
  config: GoalConfig,
  accounts: string[]
): number => {
  const values: number[] = [];
  for (const account of accounts) {
    const value = config.accountTargets?.[account] ?? 0;
    if (value > 0) {
      values.push(value);
    }
  }

  if (config.type === 'winRate') {
    return values.length > 0
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0;
  }

  return values.reduce((sum, value) => sum + value, 0);
};

const buildGoalDraft = (
  existingConfig: GoalConfig | undefined,
  displayRMultiples: boolean
): GoalDraft => ({
  goalType: existingConfig?.type || 'pnl',
  target: existingConfig?.target?.toString() || '',
  period: existingConfig?.period || 'weekly',
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

const getGoalTypeOptions = (): {
  value: GoalType;
  label: string;
  description: string;
}[] => [
  {
    value: 'pnl',
    label: t('home.widget.goals-progress.type.pnl'),
    description: t('home.widget.goals-progress.type.pnl-desc'),
  },
  {
    value: 'tradesJournaled',
    label: t('home.widget.goals-progress.type.trades-logged'),
    description: t('home.widget.goals-progress.type.trades-logged-desc'),
  },
  {
    value: 'winRate',
    label: t('home.widget.goals-progress.type.win-rate'),
    description: t('home.widget.goals-progress.type.win-rate-desc'),
  },
];

const getPeriodOptions = (): { value: GoalPeriod; label: string }[] => [
  { value: 'daily', label: t('home.widget.goals-progress.period.daily') },
  { value: 'weekly', label: t('home.widget.goals-progress.period.weekly') },
  { value: 'monthly', label: t('home.widget.goals-progress.period.monthly') },
];


const useGoalModel = (
  plugin: JournalitPlugin,
  instanceId: string,
  existingConfig: GoalConfig | undefined,
  dashboardData: ReturnType<typeof useDashboardData>,
  currency: string,
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'],
  defaultRiskAmount: number | undefined,
  weekStartDay: WeekStartDaySetting,
  accountContext: ReturnType<typeof useHomeAccount>,
  accountNames: string[]
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
  const [goalType, setGoalType] = useState<GoalType>(
    () => getPersistedDraft().goalType
  );
  const [period, setPeriod] = useState<GoalPeriod>(
    () => getPersistedDraft().period
  );
  const [target, setTarget] = useState<string>(
    () => getPersistedDraft().target
  );
  const [useRMultiples, setUseRMultiples] = useState<boolean>(
    () => getPersistedDraft().useRMultiples
  );
  const [accountAware, setAccountAware] = useState<boolean>(
    () => getPersistedDraft().accountAware
  );
  const [accountTargets, setAccountTargets] = useState<Record<string, string>>(
    () => getPersistedDraft().accountTargets
  );
  const [accountTargetAccounts, setAccountTargetAccounts] = useState<string[]>(
    () => getPersistedDraft().accountTargetAccounts
  );

  const resetDraftFromConfig = useCallback(() => {
    const draft = getPersistedDraft();
    setGoalType(draft.goalType);
    setTarget(draft.target);
    setPeriod(draft.period);
    setUseRMultiples(draft.useRMultiples);
    setAccountAware(draft.accountAware);
    setAccountTargets(draft.accountTargets);
    setAccountTargetAccounts(draft.accountTargetAccounts);
  }, [getPersistedDraft]);

  const handleOpenModal = useCallback(() => {
    resetDraftFromConfig();
    setShowModal(true);
  }, [resetDraftFromConfig]);

  const handleCancelModal = useCallback(() => {
    resetDraftFromConfig();
    setShowModal(false);
  }, [resetDraftFromConfig]);

  const rMultiplesEnabled = plugin.settings.trade?.displayRMultiples || false;
  const accountMetadata = plugin.settings.account?.accountMetadata;
  const includeCopyAccountsInAnalytics =
    plugin.settings.trade?.includeCopyAccountsInAllAccountsAnalytics === true;
  const [, setSettingsVersion] = useState(0);

  const handleSettingsChanged = useCallback(
    (payload?: { section?: string; source?: string }) => {
      if (payload?.section === 'trade' || payload?.source === 'week-start') {
        setSettingsVersion((prev) => prev + 1);
      }
    },
    []
  );

  useEventBus('settings:changed', handleSettingsChanged);

  
  const progress = useMemo((): GoalProgress | null => {
    if (!existingConfig || !dashboardData?.dashboardData?.trades) {
      return null;
    }

    const trades: Trade[] = dashboardData.dashboardData.trades;
    const now = new Date();
    const currentTradingDay = getTradingDay(now, plugin);
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

    
    let periodTrades: Trade[] = trades;
    let periodLabel = '';

    
    const effectivePeriod =
      config.type === 'tradesJournaled' ? 'lifetime' : config.period;

    if (effectivePeriod !== 'lifetime') {
      let periodStart: Date;
      const periodEnd: Date = currentTradingDay;

      if (effectivePeriod === 'daily') {
        periodStart = new Date(currentTradingDay);
        periodStart.setHours(0, 0, 0, 0);
        periodLabel = t('home.widget.goals-progress.period-label.today');
      } else if (effectivePeriod === 'weekly') {
        periodStart = getWeekStartDate(currentTradingDay, weekStartDay);
        periodLabel = t('home.widget.goals-progress.period-label.this-week');
      } else {
        
        periodStart = new Date(
          currentTradingDay.getFullYear(),
          currentTradingDay.getMonth(),
          1
        );
        periodLabel = t('home.widget.goals-progress.period-label.this-month');
      }

      const analyticsDateBasis =
        plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';

      periodTrades = trades.filter((trade: Trade) => {
        const analyticsDate = getTradeAnalyticsTradingDay(
          trade,
          analyticsDateBasis,
          plugin
        );
        if (!analyticsDate) return false;
        return analyticsDate >= periodStart && analyticsDate <= periodEnd;
      });
    } else {
      periodLabel = t('home.widget.goals-progress.period-label.total');
    }

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
      periodTrades = periodTrades.filter(
        (trade) =>
          tradeMatchesGoalAccounts(trade, explicitGoalAccountLookupKeys) ||
          (trade.isCopiedTrade === true &&
            copiedTradeMatchesGoalBase(trade, explicitGoalAccountLookupKeys) &&
            tradeMatchesGoalAccounts(trade, expandedGoalAccountLookupKeys))
      );
    }

    const pnlContributingTrades = periodTrades.filter((trade) =>
      isPnlContributingTrade(trade)
    );
    const breakEvenSettings = plugin.settings.trade;

    
    let current = 0;
    let label = '';

    switch (config.type) {
      case 'pnl': {
        const pnl = pnlContributingTrades.reduce(
          (sum, trade) => sum + getEffectivePnL(trade),
          0
        );
        const risk = defaultRiskAmount;
        if (
          config.useRMultiples &&
          typeof risk === 'number' &&
          Number.isFinite(risk) &&
          risk > 0
        ) {
          current = pnl / risk;
          label = formatValue({
            kind: 'rMultiple',
            value: current,
            precision: 1,
          });
        } else {
          current = pnl;
          label = formatValue({
            kind: 'pnl',
            value: current,
            currencyCode:
              dashboardData.dashboardData?.metrics.conversionBaseCurrency ||
              currency,
          });
        }
        break;
      }
      case 'tradesJournaled': {
        current = periodTrades.filter(
          (trade) => !isTradeOpenInDashboard(trade)
        ).length;
        label = t('home.widget.goals-progress.trades-count', {
          count: String(current),
        });
        break;
      }
      case 'winRate': {
        if (pnlContributingTrades.length > 0) {
          let wins = 0;
          let losses = 0;

          pnlContributingTrades.forEach((trade) => {
            const outcome = classifyPnLWithBreakEvenSettings(
              getEffectivePnL(trade),
              breakEvenSettings,
              trade.breakEvenAccountCurrentBalance
            );
            if (outcome === 'win') wins += 1;
            else if (outcome === 'loss') losses += 1;
          });

          current = calculateWinRateExcludingBreakeven(wins, losses) * 100;
        }
        label = formatValue({
          kind: 'returnPercent',
          value: current,
          signed: false,
          precision: 1,
        });
        break;
      }
    }

    const percentage =
      targetValue > 0 ? Math.min((current / targetValue) * 100, 100) : 0;
    const isComplete = targetValue > 0 && current >= targetValue;

    return {
      current,
      target: targetValue,
      percentage,
      label,
      periodLabel,
      isComplete,
      trades: pnlContributingTrades,
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

  
  const handleSave = useCallback(async () => {
    const parsedAccountTargets: Record<string, number> = {};
    const accountTargetAccountSet = new Set(accountTargetAccounts);
    for (const [account, rawValue] of Object.entries(accountTargets)) {
      if (!accountTargetAccountSet.has(account)) {
        continue;
      }

      const value = parseFloat(rawValue);
      if (Number.isFinite(value) && value > 0) {
        parsedAccountTargets[account] = value;
      }
    }
    const usesAccountTargets =
      accountAware && !(goalType === 'pnl' && useRMultiples);
    const targetNum = usesAccountTargets
      ? aggregateAccountTarget(
          {
            type: goalType,
            target: 0,
            period,
            accountTargets: parsedAccountTargets,
            createdAt: '',
          },
          accountTargetAccounts
        )
      : parseFloat(target);
    if (isNaN(targetNum) || targetNum <= 0) {
      return;
    }

    if (!plugin.settings.home) {
      plugin.settings.home = {
        layouts: { Default: { lg: [], md: [], sm: [], xs: [], xxs: [] } },
        activeLayout: 'Default',
      };
    }
    if (!plugin.settings.home.goals) {
      plugin.settings.home.goals = {};
    }

    
    const normalizedPeriod: GoalPeriod =
      goalType === 'tradesJournaled'
        ? 'lifetime'
        : period === 'lifetime'
          ? 'weekly'
          : period;

    const config: GoalConfig = {
      type: goalType,
      target: targetNum,
      period: normalizedPeriod,
      useRMultiples: goalType === 'pnl' ? useRMultiples : undefined,
      accountAware: usesAccountTargets || undefined,
      accountTargets: usesAccountTargets ? parsedAccountTargets : undefined,
      accountTargetAccounts: usesAccountTargets
        ? accountTargetAccounts.filter(
            (account) => parsedAccountTargets[account] > 0
          )
        : undefined,
      createdAt: existingConfig?.createdAt || new Date().toISOString(),
    };

    plugin.settings.home.goals[instanceId] = config;
    try {
      await plugin.saveSettings();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save goal settings:', err);
    }
  }, [
    goalType,
    target,
    period,
    useRMultiples,
    instanceId,
    plugin,
    existingConfig,
    accountAware,
    accountTargets,
    accountTargetAccounts,
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

    switch (existingConfig.type) {
      case 'pnl':
        if (existingConfig.useRMultiples) {
          return formatValue({
            kind: 'rMultiple',
            value: targetValue,
            precision: 1,
            signed: false,
          });
        }
        return formatValue({
          kind: 'pnl',
          value: targetValue,
          currencyCode:
            dashboardData.dashboardData?.metrics.conversionBaseCurrency ||
            currency,
          signed: false,
        });
      case 'tradesJournaled':
        return t('home.widget.goals-progress.trades-count', {
          count: String(targetValue),
        });
      case 'winRate':
        return formatValue({
          kind: 'returnPercent',
          value: targetValue,
          signed: false,
          precision: 1,
        });
      default:
        return targetValue.toString();
    }
  };

  const parsedTarget = parseFloat(target);
  const hasAccountTarget = accountTargetAccounts.some((account) => {
    const parsedValue = parseFloat(accountTargets[account] ?? '');
    return Number.isFinite(parsedValue) && parsedValue > 0;
  });
  const canSave =
    accountAware && !(goalType === 'pnl' && useRMultiples)
      ? hasAccountTarget
      : Number.isFinite(parsedTarget) && parsedTarget > 0;

  return {
    showModal,
    handleOpenModal,
    handleCancelModal,
    goalType,
    setGoalType,
    target,
    setTarget,
    period,
    setPeriod,
    useRMultiples,
    setUseRMultiples,
    accountAware,
    setAccountAware,
    accountTargets,
    setAccountTargets,
    accountTargetAccounts,
    setAccountTargetAccounts,
    rMultiplesEnabled,
    progress,
    handleSave,
    getTargetLabel,
    canSave,
  };
};

const getProgressClass = (percentage: number, isComplete: boolean): string => {
  if (isComplete) return 'journalit-home-goals--complete';
  if (percentage >= 75) return 'journalit-home-goals--high';
  if (percentage >= 50) return 'journalit-home-goals--medium';
  if (percentage >= 25) return 'journalit-home-goals--low';
  return 'journalit-home-goals--critical';
};


const GoalSettingModal: React.FC<{
  goalType: GoalType;
  setGoalType: (type: GoalType) => void;
  target: string;
  setTarget: (target: string) => void;
  period: GoalPeriod;
  setPeriod: (period: GoalPeriod) => void;
  useRMultiples: boolean;
  setUseRMultiples: (use: boolean) => void;
  accountAware: boolean;
  setAccountAware: (use: boolean) => void;
  accountTargets: Record<string, string>;
  setAccountTargets: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  accountTargetAccounts: string[];
  setAccountTargetAccounts: React.Dispatch<React.SetStateAction<string[]>>;
  accountNames: string[];
  rMultiplesEnabled: boolean;
  canSave: boolean;
  handleSave: () => void;
  onCancel: () => void;
  existingConfig?: GoalConfig;
  currency: string;
}> = ({
  goalType,
  setGoalType,
  target,
  setTarget,
  period,
  setPeriod,
  useRMultiples,
  setUseRMultiples,
  accountAware,
  setAccountAware,
  accountTargets,
  setAccountTargets,
  accountTargetAccounts,
  setAccountTargetAccounts,
  accountNames,
  rMultiplesEnabled,
  canSave,
  handleSave,
  onCancel,
  existingConfig,
  currency,
}) => {
  const availableAccounts = accountNames.filter(
    (account) => !accountTargetAccounts.includes(account)
  );
  const targetSuffix =
    goalType === 'pnl'
      ? currency
      : goalType === 'winRate'
        ? '%'
        : t('common.trades').toLowerCase();
  const usesRMultiplesForPnl = goalType === 'pnl' && useRMultiples;

  return (
    <div className="journalit-home-goals journalit-home-goals--modal">
      
      <div className="journalit-home-goals__header">
        <div className="journalit-home-widget__eyebrow">
          {t('home.widget.goals-progress.set-goal')}
        </div>
        <div className="journalit-home-goals__actions">
          
          <button
            onClick={() => void handleSave()}
            disabled={!canSave}
            className="clickable-icon journalit-home-goals__save-button"
            aria-label={t('home.widget.goals-progress.aria.save-goal')}
          >
            <Check size={14} />
          </button>
          
          {existingConfig && (
            <button
              onClick={onCancel}
              className="clickable-icon journalit-home-goals__cancel-button"
              aria-label={t('button.cancel')}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      
      <div className="journalit-home-goals__chip-list">
        {getGoalTypeOptions().map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setGoalType(option.value);
              
              if (option.value !== 'tradesJournaled' && period === 'lifetime') {
                setPeriod('weekly');
              }
            }}
            className={`journalit-home-goals__chip ${goalType === option.value ? 'journalit-home-goals__chip--active' : ''}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {!usesRMultiplesForPnl && accountNames.length > 0 && (
        <label className="journalit-home-goals__r-toggle">
          <input
            type="checkbox"
            checked={accountAware}
            onChange={(e) => setAccountAware(e.target.checked)}
            className="journalit-home-goals__checkbox"
          />
          {t('home.widget.goals-progress.account-aware')}
        </label>
      )}

      {!accountAware || usesRMultiplesForPnl ? (
        <div className="journalit-home-goals__target-row">
          <label className="journalit-home-goals__target-label">
            {t('home.widget.goals-progress.target')}
          </label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={
              goalType === 'pnl'
                ? usesRMultiplesForPnl
                  ? '10'
                  : '500'
                : goalType === 'winRate'
                  ? '60'
                  : '100'
            }
            className="journalit-home-goals__target-input"
          />
          <span className="journalit-home-goals__target-suffix">
            {usesRMultiplesForPnl ? 'R' : targetSuffix}
          </span>
        </div>
      ) : (
        <div className="journalit-home-goals__account-scope">
          <div className="journalit-home-goals__account-scope-header">
            <span className="journalit-home-goals__target-label">
              {t('home.widget.goals-progress.account-scope')}
            </span>
            <select
              value=""
              onChange={(e) => {
                const nextAccount = e.target.value;
                if (!nextAccount) return;
                setAccountTargetAccounts((prev) => [...prev, nextAccount]);
              }}
              className="journalit-home-goals__account-select"
            >
              <option value="">
                {t('home.widget.goals-progress.add-account')}
              </option>
              {availableAccounts.map((account) => (
                <option key={account} value={account}>
                  {account}
                </option>
              ))}
            </select>
          </div>

          <div className="journalit-home-goals__account-chips">
            {accountTargetAccounts.map((account) => (
              <button
                key={account}
                type="button"
                className="journalit-home-goals__account-chip"
                onClick={() =>
                  setAccountTargetAccounts((prev) =>
                    prev.filter((selected) => selected !== account)
                  )
                }
              >
                {account}
                <X size={12} />
              </button>
            ))}
          </div>

          <div className="journalit-home-goals__account-targets">
            {accountTargetAccounts.map((account) => (
              <label
                key={account}
                className="journalit-home-goals__account-target-row"
              >
                <span className="journalit-home-goals__account-target-name">
                  {account}
                </span>
                <input
                  type="number"
                  value={accountTargets[account] ?? ''}
                  onChange={(e) =>
                    setAccountTargets((prev) => ({
                      ...prev,
                      [account]: e.target.value,
                    }))
                  }
                  placeholder="0"
                  className="journalit-home-goals__target-input"
                />
                <span className="journalit-home-goals__target-suffix">
                  {targetSuffix}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      
      {goalType !== 'tradesJournaled' && (
        <div className="journalit-home-goals__period-row">
          {getPeriodOptions().map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`journalit-home-goals__period-button ${period === option.value ? 'journalit-home-goals__period-button--active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      
      {goalType === 'tradesJournaled' && (
        <div className="journalit-home-goals__lifetime">
          {t('home.widget.goals-progress.tracks-lifetime')}
        </div>
      )}

      
      {goalType === 'pnl' && rMultiplesEnabled && (
        <label className="journalit-home-goals__r-toggle">
          <input
            type="checkbox"
            checked={useRMultiples}
            onChange={(e) => setUseRMultiples(e.target.checked)}
            className="journalit-home-goals__checkbox"
          />
          {t('home.widget.goals-progress.use-r-multiples')}
        </label>
      )}
    </div>
  );
};


const GoalLoadingSkeleton: React.FC = () => (
  <div className="journalit-home-goals journalit-home-goals--loading">
    
    <SkeletonText width="70px" height="11px" />

    
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
  <div
    onClick={onSetGoal}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onSetGoal();
    }}
    className="journalit-home-goals journalit-home-goals--empty"
    aria-label={t('home.widget.goals-progress.aria.set-goal')}
  >
    <span className="journalit-home-goals__empty-text">
      {t('home.widget.goals-progress.click-to-set')}
    </span>
  </div>
);

const GoalScopeMismatchState: React.FC<{
  configuredAccounts: string[];
  onEdit: () => void;
}> = ({ configuredAccounts, onEdit }) => (
  <div
    onClick={onEdit}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onEdit();
    }}
    className="journalit-home-goals journalit-home-goals--empty journalit-home-goals--scope-mismatch"
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
  </div>
);


const GoalProgressDisplay: React.FC<{
  progress: GoalProgress;
  existingConfig: GoalConfig;
  dashboardData: ReturnType<typeof useDashboardData>;
  getTargetLabel: () => string;
  shouldMask: (kind: string) => boolean;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
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

  const isSensitiveGoalMasked =
    existingConfig?.type === 'pnl'
      ? shouldMask(existingConfig.useRMultiples ? 'rMultiple' : 'pnl')
      : existingConfig?.type === 'winRate'
        ? shouldMask('returnPercent')
        : false;
  const progressClass = isSensitiveGoalMasked
    ? ''
    : getProgressClass(progress.percentage, progress.isComplete);
  const progressPercentLabel = isSensitiveGoalMasked
    ? formatValue({ kind: 'metric', value: progress.percentage })
    : progress.isComplete
      ? t('home.widget.goals-progress.complete-100')
      : t('home.widget.goals-progress.complete-percent', {
          percent: String(Math.floor(progress.percentage)),
        });

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
      
      <div className="journalit-home-widget__eyebrow">
        {existingConfig?.type === 'pnl'
          ? t('home.widget.goals-progress.header.pnl')
          : existingConfig?.type === 'tradesJournaled'
            ? t('home.widget.goals-progress.header.trades')
            : t('home.widget.goals-progress.header.win-rate')}
        {existingConfig?.type === 'pnl' && !existingConfig.useRMultiples && (
          <CurrencyConversionInfo
            metadata={buildCurrencyConversionMetadata(
              dashboardData.dashboardData?.metrics
            )}
            trades={progress.trades}
          />
        )}
      </div>

      
      <div className="journalit-home-goals__hero">
        
        <div className="journalit-home-goals__value">{progress.label}</div>

        
        <div className="journalit-home-goals__target-context">
          {t('home.widget.goals-progress.of-target', {
            target: getTargetLabel(),
            period: progress.periodLabel,
          })}
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

      
      {progress.isComplete && !isSensitiveGoalMasked && (
        <div className="journalit-home-goals__complete">
          <Check size={12} />
          {t('home.widget.goals-progress.goal-reached')}
        </div>
      )}
    </div>
  );
};

const GoalsProgressWidgetComponent: React.FC<GoalsProgressWidgetProps> = ({
  plugin,
  instanceId,
}) => {
  const dashboardData = useDashboardData();
  const { currency } = useCurrency();
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

  const model = useGoalModel(
    plugin,
    instanceId,
    existingConfig,
    dashboardDataForGoal,
    currency,
    formatValue,
    defaultRiskAmount,
    weekStartDay,
    accountContext,
    accountNames
  );

  
  if (model.showModal) {
    return (
      <GoalSettingModal
        goalType={model.goalType}
        setGoalType={model.setGoalType}
        target={model.target}
        setTarget={model.setTarget}
        period={model.period}
        setPeriod={model.setPeriod}
        useRMultiples={model.useRMultiples}
        setUseRMultiples={model.setUseRMultiples}
        accountAware={model.accountAware}
        setAccountAware={model.setAccountAware}
        accountTargets={model.accountTargets}
        setAccountTargets={model.setAccountTargets}
        accountTargetAccounts={model.accountTargetAccounts}
        setAccountTargetAccounts={model.setAccountTargetAccounts}
        accountNames={accountNames}
        rMultiplesEnabled={model.rMultiplesEnabled}
        canSave={model.canSave}
        handleSave={() => void model.handleSave()}
        onCancel={model.handleCancelModal}
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
