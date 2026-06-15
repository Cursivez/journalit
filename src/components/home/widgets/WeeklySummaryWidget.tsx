

import React, {
  memo,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import { useEventBus } from '../../../hooks/useEventBus';
import JournalitPlugin from '../../../main';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { t } from '../../../lang/helpers';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsTradingDay,
} from '../../../utils/tradeAnalyticsDate';
import { Trade } from '../../dashboard/utils/dataUtils';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
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
  type WeekStartDaySetting,
} from '../../../utils/dateUtils';
import { getTradingDay } from '../../../utils/tradingDayUtils';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../shared/display/CurrencyConversionInfo';


function formatTradingDayString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface WeeklySummaryWidgetProps {
  plugin: JournalitPlugin;
}

interface DailyData {
  day: string;
  dayShort: string;
  pnl: number;
  rMultiple: number | undefined;
  tradeCount: number;
  isFuture: boolean;
  outcome: 'win' | 'loss' | 'breakeven';
  currency: string | undefined;
}

interface WeeklyMetrics {
  current: {
    netPnL: number;
    netRMultiple: number | undefined;
    winRate: number;
    totalTrades: number;
    profitFactor: number;
    winningDays: number;
    losingDays: number;
    currency: string | undefined;
    trades: Trade[];
  };
  previous: {
    netPnL: number;
  };
  historicalAvg: number;
  dailyData: DailyData[];
  hasCurrentTrades: boolean;
  hasPreviousTrades: boolean;
  contextMessage: string;
}


function DayBarTooltipComponent({
  hoveredDay,
  dailyData,
  currency,
  formatValue,
  isPnlMasked,
}: {
  hoveredDay: number | null;
  dailyData: DailyData[];
  currency: string;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  isPnlMasked: boolean;
}) {
  if (hoveredDay === null || !dailyData[hoveredDay]) return null;
  const hoveredData = dailyData[hoveredDay];
  if (hoveredData.isFuture) return null;

  const formattedVal = formatValue({
    kind: 'pnl',
    value: hoveredData.pnl,
    currencyCode: hoveredData.currency || currency,
    rMultiple: hoveredData.rMultiple,
  });

  return (
    <div className="journalit-home-weekly__tooltip">
      <span className="journalit-home-weekly__tooltip-day">
        {hoveredData.day}
      </span>
      {hoveredData.tradeCount > 0 ? (
        <>
          <span className="journalit-home-weekly__tooltip-separator">·</span>
          <span
            className={`journalit-home-weekly__tooltip-value ${
              isPnlMasked
                ? ''
                : hoveredData.outcome === 'win'
                  ? 'journalit-home-weekly__tooltip-value--positive'
                  : hoveredData.outcome === 'loss'
                    ? 'journalit-home-weekly__tooltip-value--negative'
                    : ''
            }`}
          >
            {formattedVal}
          </span>
          <span className="journalit-home-weekly__tooltip-separator">·</span>
          <span className="journalit-home-weekly__tooltip-muted">
            {hoveredData.tradeCount}{' '}
            {hoveredData.tradeCount !== 1
              ? t('home.widget.weekly.trades')
              : t('home.widget.weekly.trade')}
          </span>
        </>
      ) : (
        <span className="journalit-home-weekly__tooltip-empty">
          {t('home.widget.weekly.no-trades-tooltip')}
        </span>
      )}
    </div>
  );
}

const DayBarTooltip = memo(DayBarTooltipComponent);


function DayBarsSectionComponent({
  dailyData,
  hoveredDay,
  setHoveredDay,
  maxAbsPnL,
  currency,
  formatValue,
  isPnlMasked,
}: {
  dailyData: DailyData[];
  hoveredDay: number | null;
  setHoveredDay: (index: number | null) => void;
  maxAbsPnL: number;
  currency: string;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  isPnlMasked: boolean;
}) {
  return (
    <div className="journalit-home-weekly__bars">
      <DayBarTooltip
        hoveredDay={hoveredDay}
        dailyData={dailyData}
        currency={currency}
        formatValue={formatValue}
        isPnlMasked={isPnlMasked}
      />
      {dailyData.map((day, index) => {
        const isNeutralLikeEmpty =
          day.tradeCount === 0 || day.outcome === 'breakeven';

        const barHeight =
          day.isFuture || isNeutralLikeEmpty || isPnlMasked
            ? 4
            : Math.max(8, (Math.abs(day.pnl) / maxAbsPnL) * 40);

        const barVariant = day.isFuture
          ? 'future'
          : isNeutralLikeEmpty || isPnlMasked
            ? 'neutral'
            : day.outcome === 'win'
              ? 'positive'
              : 'negative';

        const barClassName = `journalit-home-weekly__bar journalit-home-weekly__bar--${barVariant}`;
        const barWrapperClassName = day.isFuture
          ? 'journalit-home-weekly__bar-wrapper'
          : 'journalit-home-weekly__bar-wrapper journalit-home-weekly__bar-wrapper--clickable';
        const dayLabelClassName =
          hoveredDay === index
            ? 'journalit-home-weekly__day-label journalit-home-weekly__day-label--active'
            : day.isFuture
              ? 'journalit-home-weekly__day-label journalit-home-weekly__day-label--future'
              : 'journalit-home-weekly__day-label journalit-home-weekly__day-label--muted';

        const opacity =
          day.isFuture || (isPnlMasked && !isNeutralLikeEmpty)
            ? 0.3
            : isNeutralLikeEmpty
              ? 0.5
              : 1;

        return (
          <div
            key={day.day}
            className={barWrapperClassName}
            onMouseEnter={() => !day.isFuture && setHoveredDay(index)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            <div
              className={barClassName}
              style={cssVars({
                '--journalit-home-weekly-bar-height': `${barHeight}px`,
                '--journalit-home-weekly-bar-opacity': String(
                  hoveredDay === index ? 1 : opacity
                ),
                '--journalit-home-weekly-bar-scale':
                  hoveredDay === index ? '1.1' : '1',
              })}
            />
            <span className={dayLabelClassName}>{day.dayShort}</span>
          </div>
        );
      })}
    </div>
  );
}

const DayBarsSection = memo(DayBarsSectionComponent);


function HeroSectionComponent({
  hasCurrentTrades,
  formattedHeroValue,
  emptyHeroValue,
  contextMessage,
  isPnlMasked,
  displayValue,
}: {
  hasCurrentTrades: boolean;
  formattedHeroValue: string;
  emptyHeroValue: string;
  contextMessage: string;
  isPnlMasked: boolean;
  displayValue: number;
}) {
  const pnlColor = isPnlMasked
    ? 'var(--text-normal)'
    : displayValue >= 0
      ? 'var(--color-green)'
      : 'var(--color-red)';

  return (
    <div className="journalit-home-weekly__hero">
      <div
        className="journalit-home-weekly__hero-value"
        style={cssVars({ '--journalit-home-weekly-hero-color': pnlColor })}
      >
        {hasCurrentTrades ? formattedHeroValue : emptyHeroValue}
      </div>
      <div className="journalit-home-weekly__hero-context">
        {isPnlMasked ? '' : contextMessage}
      </div>
    </div>
  );
}

const HeroSection = memo(HeroSectionComponent);


function useWeeklyMetrics(
  dashboardData: ReturnType<typeof useDashboardData>,
  skipWeekends: boolean,
  displayRMultiples: boolean,
  defaultRiskAmount: number | undefined,
  plugin: JournalitPlugin,
  weekStartDay: WeekStartDaySetting | undefined,
  breakEvenRangeMin: number | undefined,
  breakEvenRangeMax: number | undefined,
  breakEvenThresholdMode: 'fixed' | 'percentage_current_balance' | undefined,
  breakEvenThresholdPercent: number | undefined
): WeeklyMetrics | null {
  return useMemo((): WeeklyMetrics | null => {
    if (!dashboardData?.dashboardData?.trades) {
      return null;
    }

    try {
      const trades: Trade[] = dashboardData.dashboardData.trades;
      const breakEvenSettings: Parameters<
        typeof classifyPnLWithBreakEvenSettings
      >[1] = {
        breakEvenRangeMin,
        breakEvenRangeMax,
        breakEvenThresholdMode: breakEvenThresholdMode,
        breakEvenThresholdPercent,
      };
      const today = new Date();

      const analyticsDateBasis = getAnalyticsDateBasis(plugin.settings);
      const getAnalyticsTradingDay = (trade: Trade) =>
        getTradeAnalyticsTradingDay(trade, analyticsDateBasis, plugin);

      
      const todayTradingDay = getTradingDay(today, plugin);
      const currentWeekStart = getWeekStartDate(todayTradingDay, weekStartDay);

      
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
      currentWeekEnd.setHours(23, 59, 59, 999);

      
      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7);
      const previousWeekEnd = new Date(previousWeekStart);
      previousWeekEnd.setDate(previousWeekEnd.getDate() + 6);
      previousWeekEnd.setHours(23, 59, 59, 999);

      
      const currentWeekTrades = trades.filter((trade: Trade) => {
        const tradingDay = getAnalyticsTradingDay(trade);
        return (
          isPnlContributingTrade(trade) &&
          tradingDay !== null &&
          tradingDay >= currentWeekStart &&
          tradingDay <= currentWeekEnd
        );
      });

      
      const previousWeekTrades = trades.filter((trade: Trade) => {
        const tradingDay = getAnalyticsTradingDay(trade);
        return (
          isPnlContributingTrade(trade) &&
          tradingDay !== null &&
          tradingDay >= previousWeekStart &&
          tradingDay <= previousWeekEnd
        );
      });

      
      const currentNetPnL = currentWeekTrades.reduce(
        (sum, trade) => sum + getEffectivePnL(trade),
        0
      );
      const currentTotalTrades = currentWeekTrades.length;

      const getTradeOutcome = (trade: Trade) =>
        classifyPnLWithBreakEvenSettings(
          getEffectivePnL(trade),
          breakEvenSettings,
          trade.breakEvenAccountCurrentBalance
        );

      const currentWinningTrades = currentWeekTrades.filter(
        (trade) => getTradeOutcome(trade) === 'win'
      ).length;
      const currentLosingTrades = currentWeekTrades.filter(
        (trade) => getTradeOutcome(trade) === 'loss'
      ).length;

      const currentWinRate =
        calculateWinRateExcludingBreakeven(
          currentWinningTrades,
          currentLosingTrades
        ) * 100;

      const currentWins = currentWeekTrades
        .filter((trade) => getTradeOutcome(trade) === 'win')
        .reduce((sum, trade) => sum + getEffectivePnL(trade), 0);

      const currentLosses = Math.abs(
        currentWeekTrades
          .filter((trade) => getTradeOutcome(trade) === 'loss')
          .reduce((sum, trade) => sum + getEffectivePnL(trade), 0)
      );

      const currentProfitFactor =
        currentLosses === 0
          ? currentWins > 0
            ? Infinity
            : 0
          : currentWins / currentLosses;

      
      let currentNetRMultiple: number | undefined;
      if (displayRMultiples) {
        const rMultiples: number[] = [];
        for (const trade of currentWeekTrades) {
          const effectiveR = calculateEffectiveRMultiple(
            getEffectivePnL(trade),
            trade.rMultiple,
            trade.riskAmount,
            defaultRiskAmount
          );
          if (effectiveR !== undefined) {
            rMultiples.push(effectiveR);
          }
        }
        if (rMultiples.length > 0) {
          currentNetRMultiple = rMultiples.reduce((sum, r) => sum + r, 0);
        }
      }

      
      const previousNetPnL = previousWeekTrades.reduce(
        (sum, trade) => sum + getEffectivePnL(trade),
        0
      );

      
      const eightWeeksAgo = new Date(currentWeekStart);
      eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

      const historicalTrades = trades.filter((trade: Trade) => {
        const tradingDay = getAnalyticsTradingDay(trade);
        return (
          isPnlContributingTrade(trade) &&
          tradingDay !== null &&
          tradingDay >= eightWeeksAgo &&
          tradingDay < currentWeekStart
        );
      });

      const historicalPnL = historicalTrades.reduce(
        (sum, trade) => sum + getEffectivePnL(trade),
        0
      );
      const historicalAvg = historicalTrades.length > 0 ? historicalPnL / 8 : 0;

      
      const baseDayOrder = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const dayNameMap: Record<string, string> = {
        sun: t('calendar.day.sun'),
        mon: t('calendar.day.mon'),
        tue: t('calendar.day.tue'),
        wed: t('calendar.day.wed'),
        thu: t('calendar.day.thu'),
        fri: t('calendar.day.fri'),
        sat: t('calendar.day.sat'),
      };
      const dayShortMap: Record<string, string> = {
        sun: 'S',
        mon: 'M',
        tue: 'T',
        wed: 'W',
        thu: 'T',
        fri: 'F',
        sat: 'S',
      };
      const visibleDays: { date: Date; key: string }[] = [];

      for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeekStart);
        day.setDate(day.getDate() + i);
        day.setHours(12, 0, 0, 0);

        const dayKey = baseDayOrder[day.getDay()];
        if (skipWeekends && (dayKey === 'sun' || dayKey === 'sat')) {
          continue;
        }

        visibleDays.push({ date: day, key: dayKey });
      }

      const dayNames = visibleDays.map((day) => dayNameMap[day.key]);
      const dayShorts = visibleDays.map((day) => dayShortMap[day.key]);
      const daysToShow = visibleDays.length;
      const dailyData: DailyData[] = [];
      let winningDays = 0;
      let losingDays = 0;

      const todayTradingDayStr = formatTradingDayString(todayTradingDay);

      for (let i = 0; i < daysToShow; i++) {
        const day = new Date(visibleDays[i].date);

        const thisTradingDay = getTradingDay(day, plugin);
        const thisTradingDayStr = formatTradingDayString(thisTradingDay);
        const isFuture = thisTradingDayStr > todayTradingDayStr;

        const dayTrades = currentWeekTrades.filter((trade: Trade) => {
          const tradeTradingDay = getAnalyticsTradingDay(trade);
          if (!tradeTradingDay) {
            return false;
          }

          const tradeTradingDayStr = formatTradingDayString(tradeTradingDay);
          return tradeTradingDayStr === thisTradingDayStr;
        });

        const dayPnL = dayTrades.reduce(
          (sum, trade) => sum + getEffectivePnL(trade),
          0
        );

        let dayRMultiple: number | undefined = undefined;
        if (defaultRiskAmount && defaultRiskAmount > 0) {
          const dayRMultiples: number[] = [];
          for (const trade of dayTrades) {
            const effectiveR = calculateEffectiveRMultiple(
              getEffectivePnL(trade),
              trade.rMultiple,
              trade.riskAmount,
              defaultRiskAmount
            );
            if (effectiveR !== undefined) {
              dayRMultiples.push(effectiveR);
            }
          }
          if (dayRMultiples.length > 0) {
            dayRMultiple = dayRMultiples.reduce((sum, r) => sum + r, 0);
          }
        }

        const dayAccountBalances = Array.from(
          new Set(
            dayTrades
              .map((trade) => trade.breakEvenAccountCurrentBalance)
              .filter(
                (balance): balance is number =>
                  balance !== undefined && Number.isFinite(balance)
              )
          )
        );
        const dayAccountBalance =
          dayAccountBalances.length === 1 ? dayAccountBalances[0] : undefined;
        const dayHasUnresolvedBreakEvenBalance =
          breakEvenThresholdMode === 'percentage_current_balance' &&
          dayTrades.some(
            (trade) =>
              trade.breakEvenAccountCurrentBalance === undefined ||
              !Number.isFinite(trade.breakEvenAccountCurrentBalance)
          );

        const dayOutcomeRaw =
          dayTrades.length === 0
            ? 'breakeven'
            : dayHasUnresolvedBreakEvenBalance
              ? 'unknown'
              : classifyPnLWithBreakEvenSettings(
                  dayPnL,
                  breakEvenSettings,
                  dayAccountBalance
                );
        const dayOutcome =
          dayOutcomeRaw === 'unknown' ? 'breakeven' : dayOutcomeRaw;

        if (!isFuture && dayTrades.length > 0) {
          if (dayOutcomeRaw === 'win') {
            winningDays++;
          } else if (dayOutcomeRaw === 'loss') {
            losingDays++;
          }
        }

        dailyData.push({
          day: dayNames[i],
          dayShort: dayShorts[i],
          pnl: dayPnL,
          rMultiple: dayRMultiple,
          tradeCount: dayTrades.length,
          isFuture,
          outcome: dayOutcome,
          currency: getSingleExplicitCurrency(dayTrades),
        });
      }

      let contextMessage = '';

      if (currentTotalTrades === 0) {
        contextMessage = t('home.widget.weekly.no-trades');
      } else if (losingDays >= 3 && winningDays === 0) {
        contextMessage = t('home.widget.weekly.losing-days', {
          count: String(losingDays),
        });
      } else if (winningDays >= 3 && losingDays === 0) {
        contextMessage = t('home.widget.weekly.winning-days', {
          count: String(winningDays),
        });
      } else if (historicalAvg !== 0 && currentNetPnL > historicalAvg * 1.5) {
        contextMessage = t('home.widget.weekly.above-average');
      } else if (
        historicalAvg !== 0 &&
        currentNetPnL < historicalAvg * 0.5 &&
        currentNetPnL > 0
      ) {
        contextMessage = t('home.widget.weekly.below-average');
      } else if (previousNetPnL !== 0) {
        const changePercent =
          ((currentNetPnL - previousNetPnL) / Math.abs(previousNetPnL)) * 100;
        if (changePercent > 50) {
          contextMessage = t('home.widget.weekly.better-than-last');
        } else if (changePercent < -50) {
          contextMessage = t('home.widget.weekly.slower-than-last');
        } else if (currentNetPnL >= 0) {
          contextMessage = t('home.widget.weekly.on-track');
        } else {
          contextMessage = t('home.widget.weekly.room-to-recover');
        }
      } else if (currentNetPnL >= 0) {
        contextMessage = t('home.widget.weekly.solid-start');
      } else {
        contextMessage = t('home.widget.weekly.early-in-week');
      }

      return {
        current: {
          netPnL: currentNetPnL,
          netRMultiple: currentNetRMultiple,
          winRate: currentWinRate,
          totalTrades: currentTotalTrades,
          profitFactor: currentProfitFactor,
          winningDays,
          losingDays,
          currency: getSingleExplicitCurrency(currentWeekTrades),
          trades: currentWeekTrades,
        },
        previous: {
          netPnL: previousNetPnL,
        },
        historicalAvg,
        dailyData,
        hasCurrentTrades: currentTotalTrades > 0,
        hasPreviousTrades: previousWeekTrades.length > 0,
        contextMessage,
      };
    } catch (error) {
      console.error('Error calculating weekly metrics:', error);
      return null;
    }
  }, [
    dashboardData,
    skipWeekends,
    displayRMultiples,
    defaultRiskAmount,
    plugin,
    weekStartDay,
    breakEvenRangeMin,
    breakEvenRangeMax,
    breakEvenThresholdMode,
    breakEvenThresholdPercent,
  ]);
}

const WeeklySummaryWidgetComponent: React.FC<WeeklySummaryWidgetProps> = ({
  plugin,
}) => {
  const dashboardData = useDashboardData();
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();

  
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const allowReviewNavigation =
    getAnalyticsDateBasis(plugin.settings) === 'entry';

  
  const openWeeklyReview = useCallback(async () => {
    if (!allowReviewNavigation) {
      return;
    }

    try {
      const weeklyReviewService =
        await plugin.serviceManager.getWeeklyReviewService();
      await weeklyReviewService.openWeeklyReview(new Date());
    } catch (error) {
      console.error('Failed to open weekly review:', error);
    }
  }, [allowReviewNavigation, plugin]);

  
  const skipWeekends = plugin.settings.trade?.skipWeekends ?? true;

  
  const displayRMultiples = plugin.settings.trade?.displayRMultiples ?? false;
  const defaultRiskAmount = plugin.settings.trade?.defaultRiskAmount;
  const weekStartDay = getWeekStartDaySetting(plugin);

  const breakEvenRangeMin = plugin.settings.trade?.breakEvenRangeMin;
  const breakEvenRangeMax = plugin.settings.trade?.breakEvenRangeMax;
  const breakEvenThresholdMode:
    | 'fixed'
    | 'percentage_current_balance'
    | undefined = plugin.settings.trade?.breakEvenThresholdMode ?? 'fixed';
  const breakEvenThresholdPercent =
    plugin.settings.trade?.breakEvenThresholdPercent;

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

  const weeklyMetrics = useWeeklyMetrics(
    dashboardData,
    skipWeekends,
    displayRMultiples,
    defaultRiskAmount,
    plugin,
    weekStartDay,
    breakEvenRangeMin,
    breakEvenRangeMax,
    breakEvenThresholdMode,
    breakEvenThresholdPercent
  );

  
  const maxAbsPnL = useMemo(() => {
    if (!weeklyMetrics?.dailyData) return 0;
    return Math.max(...weeklyMetrics.dailyData.map((d) => Math.abs(d.pnl)), 1);
  }, [weeklyMetrics?.dailyData]);

  
  useLayoutEffect(() => {}, []);

  useEffect(() => {}, []);

  if (!dashboardData?.dashboardData) {
    return (
      <div className="journalit-home-weekly__loading">
        
        <SkeletonText width="70px" height="11px" />

        
        <div className="journalit-home-weekly__loading-hero">
          <SkeletonBox width="120px" height="32px" borderRadius="4px" />
          <SkeletonText width="100px" height="12px" />
        </div>

        
        <div className="journalit-home-weekly__loading-bars">
          {[24, 32, 18, 28, 14].map((height) => (
            <div
              key={`loading-bar-${height}`}
              className="journalit-home-weekly__loading-bar"
            >
              <SkeletonBox
                width="100%"
                height={`${height}px`}
                className="journalit-home-weekly__skeleton-bar"
                borderRadius="2px"
              />
              <SkeletonText width="10px" height="10px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!weeklyMetrics) {
    return (
      <div className="journalit-home-weekly__empty">
        <span className="journalit-home-widget__eyebrow">
          {t('home.widget.weekly.title')}
        </span>
        <span className="journalit-home-widget__muted">
          {t('home.widget.weekly.no-trade-data')}
        </span>
      </div>
    );
  }

  const { current, dailyData, contextMessage, hasCurrentTrades } =
    weeklyMetrics;
  const isPnlMasked = shouldMask('pnl');
  const currencyConversion = buildCurrencyConversionMetadata(
    dashboardData.dashboardData?.metrics
  );

  
  const displayValue =
    displayRMultiples && current.netRMultiple !== undefined
      ? current.netRMultiple
      : current.netPnL;

  
  const formattedHeroValue = formatValue({
    kind: 'pnl',
    value: current.netPnL,
    currencyCode: current.currency || currency,
    rMultiple: current.netRMultiple,
  });
  const emptyHeroValue = formatValue({
    kind: 'pnl',
    value: 0,
    currencyCode: currency,
    rMultiple: displayRMultiples ? 0 : undefined,
  });

  const content = (
    <>
      
      <div className="journalit-home-widget__eyebrow">
        {t('home.widget.weekly.title')}
        <CurrencyConversionInfo
          metadata={currencyConversion}
          trades={current.trades.length > 0 ? current.trades : undefined}
        />
      </div>

      
      <HeroSection
        hasCurrentTrades={hasCurrentTrades}
        formattedHeroValue={formattedHeroValue}
        emptyHeroValue={emptyHeroValue}
        contextMessage={contextMessage}
        isPnlMasked={isPnlMasked}
        displayValue={displayValue}
      />

      
      <DayBarsSection
        dailyData={dailyData}
        hoveredDay={hoveredDay}
        setHoveredDay={setHoveredDay}
        maxAbsPnL={maxAbsPnL}
        currency={currency}
        formatValue={formatValue}
        isPnlMasked={isPnlMasked}
      />
    </>
  );

  if (!allowReviewNavigation) {
    return <div className="journalit-home-weekly">{content}</div>;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => void openWeeklyReview()}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        void openWeeklyReview();
      }}
      className="journalit-home-weekly journalit-home-weekly--clickable"
    >
      {content}
    </div>
  );
};

export const WeeklySummaryWidget = memo(WeeklySummaryWidgetComponent);
