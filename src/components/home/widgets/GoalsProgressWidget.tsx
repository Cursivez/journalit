

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useEventBus } from '../../../hooks/useEventBus';
import { X, Check } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { GoalType, GoalPeriod, GoalConfig } from '../../../settings/types';
import { Trade, isTradeOpenInDashboard } from '../../dashboard/utils/dataUtils';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
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
import { ensureHomeWidgetStyles } from '../../../styles/homeWidgetStyles';
import { t } from '../../../lang/helpers';
import { getTradeAnalyticsTradingDay } from '../../../utils/tradeAnalyticsDate';

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
}

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
  formatValue: any,
  defaultRiskAmount: number | undefined,
  weekStartDay: WeekStartDaySetting
) => {
  const existingGoalType = existingConfig?.type || 'pnl';
  const [showModal, setShowModal] = useState(!existingConfig);
  const [goalType, setGoalType] = useState<GoalType>(existingGoalType);
  const [target, setTarget] = useState<string>(
    existingConfig?.target?.toString() || ''
  );
  const [period, setPeriod] = useState<GoalPeriod>(
    existingConfig?.period || 'weekly'
  );
  const [useRMultiples, setUseRMultiples] = useState<boolean>(
    existingConfig?.useRMultiples ??
      (plugin.settings.trade?.displayRMultiples || false)
  );

  const rMultiplesEnabled = plugin.settings.trade?.displayRMultiples || false;
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

    const pnlContributingTrades = periodTrades.filter((trade) =>
      isPnlContributingTrade(trade as Trade)
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
      config.target > 0 ? Math.min((current / config.target) * 100, 100) : 0;
    const isComplete = current >= config.target;

    return {
      current,
      target: config.target,
      percentage,
      label,
      periodLabel,
      isComplete,
      trades: pnlContributingTrades,
    };
  }, [
    existingConfig,
    dashboardData,
    currency,
    formatValue,
    defaultRiskAmount,
    plugin,
    weekStartDay,
  ]);

  
  const handleSave = useCallback(async () => {
    const targetNum = parseFloat(target);
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
  ]);

  
  const getTargetLabel = (): string => {
    if (!existingConfig) return '';

    switch (existingConfig.type) {
      case 'pnl':
        if (existingConfig.useRMultiples) {
          return formatValue({
            kind: 'rMultiple',
            value: existingConfig.target,
            precision: 1,
            signed: false,
          });
        }
        return formatValue({
          kind: 'pnl',
          value: existingConfig.target,
          currencyCode:
            dashboardData.dashboardData?.metrics.conversionBaseCurrency ||
            currency,
          signed: false,
        });
      case 'tradesJournaled':
        return t('home.widget.goals-progress.trades-count', {
          count: String(existingConfig.target),
        });
      case 'winRate':
        return formatValue({
          kind: 'returnPercent',
          value: existingConfig.target,
          signed: false,
          precision: 1,
        });
      default:
        return existingConfig.target.toString();
    }
  };

  const parsedTarget = parseFloat(target);
  const canSave = Number.isFinite(parsedTarget) && parsedTarget > 0;

  return {
    showModal,
    setShowModal,
    goalType,
    setGoalType,
    target,
    setTarget,
    period,
    setPeriod,
    useRMultiples,
    setUseRMultiples,
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
  rMultiplesEnabled,
  canSave,
  handleSave,
  onCancel,
  existingConfig,
  currency,
}) => (
  <div className="journalit-home-goals journalit-home-goals--modal">
    
    <div className="journalit-home-goals__header">
      <div className="journalit-home-widget__eyebrow">
        {t('home.widget.goals-progress.set-goal')}
      </div>
      <div className="journalit-home-goals__actions">
        
        <button
          onClick={handleSave}
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
            ? useRMultiples
              ? '10'
              : '500'
            : goalType === 'winRate'
              ? '60'
              : '100'
        }
        className="journalit-home-goals__target-input"
      />
      <span className="journalit-home-goals__target-suffix">
        {goalType === 'pnl' && useRMultiples
          ? 'R'
          : goalType === 'pnl'
            ? currency
            : goalType === 'winRate'
              ? '%'
              : t('common.trades').toLowerCase()}
      </span>
    </div>

    
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

  
  const existingConfig = plugin.settings.home?.goals?.[instanceId];

  
  const defaultRiskAmount = plugin.settings.trade?.defaultRiskAmount;
  const weekStartDay = getWeekStartDaySetting(plugin);

  useEffect(() => {}, []);

  const model = useGoalModel(
    plugin,
    instanceId,
    existingConfig,
    dashboardData,
    currency,
    formatValue,
    defaultRiskAmount,
    weekStartDay
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
        rMultiplesEnabled={model.rMultiplesEnabled}
        canSave={model.canSave}
        handleSave={model.handleSave}
        onCancel={() => model.setShowModal(false)}
        existingConfig={existingConfig}
        currency={currency}
      />
    );
  }

  
  if (existingConfig && !dashboardData?.dashboardData) {
    return <GoalLoadingSkeleton />;
  }

  
  if (!model.progress) {
    return <GoalEmptyState onSetGoal={() => model.setShowModal(true)} />;
  }

  
  return (
    <GoalProgressDisplay
      progress={model.progress}
      existingConfig={existingConfig!}
      dashboardData={dashboardData}
      getTargetLabel={model.getTargetLabel}
      shouldMask={shouldMask}
      formatValue={formatValue}
      onEdit={() => model.setShowModal(true)}
    />
  );
};

export const GoalsProgressWidget = memo(GoalsProgressWidgetComponent);
