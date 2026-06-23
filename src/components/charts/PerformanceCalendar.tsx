

import React, {
  useEffect,
  useMemo,
  useRef,
  memo,
  useCallback,
  useState,
} from 'react';
import { useEventBus } from '../../hooks';
import { usePlugin } from '../../hooks/usePlugin';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import {
  classifyPnLWithBreakEvenSettings,
  normalizeBreakEvenRange,
} from '../../utils/breakEvenRange';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsTradingDay,
  getTradeRealizedPnlEvents,
} from '../../utils/tradeAnalyticsDate';
import {
  formatLocalDateString,
  getWeekStartDayIndex,
  getWeekStartDaySetting,
  getWeekNumberForDate,
  isWeekend,
} from '../../utils/dateUtils';
import { FilterState } from '../dashboard/DashboardView';
import { Trade } from '../dashboard/utils/dataUtils';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { getDisplayPnL, getAccountCount } from '../../utils/pnlUtils';
import { hasTranslation, t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';



interface PerformanceCalendarProps {
  trades: Trade[];
  filters?: FilterState;
  onDayClick?: (date: Date) => void;
  onWeekClick?: (date: Date) => void;
  height?: number | string;
  compactWidthThreshold?: number;
  compactHeightThreshold?: number;
}


interface DayData {
  date: Date | null;
  currentMonth: boolean;
  dayNumber: number;
  pnl: number | null;
  tradeCount: number;
  isToday: boolean;
  rMultiple: number | null;
  breakEvenAccountCurrentBalance?: number;
  hasUnresolvedBreakEvenBalance?: boolean;
}


const CalendarDay = memo<{
  day: DayData;
  onClick?: (date: Date) => void;
  breakEvenSettings: {
    breakEvenRangeMin: number;
    breakEvenRangeMax: number;
    breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
    breakEvenThresholdPercent?: number;
  };
}>(({ day, onClick, breakEvenSettings }) => {
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');

  const handleClick = useCallback(() => {
    if (day.date && day.currentMonth && onClick) onClick(day.date);
  }, [day.currentMonth, day.date, onClick]);
  const isClickable = Boolean(day.date && day.currentMonth && onClick);
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isClickable) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick, isClickable]
  );

  const isWeekendDay = day.date ? isWeekend(day.date) : false;
  const dayOutcome =
    day.pnl !== null && day.tradeCount > 0
      ? classifyPnLWithBreakEvenSettings(
          day.pnl,
          breakEvenSettings,
          day.breakEvenAccountCurrentBalance
        )
      : null;

  const isPositiveDay = dayOutcome === 'win';
  const isNegativeDay = dayOutcome === 'loss';
  const isNeutralDay =
    day.pnl !== null &&
    day.tradeCount > 0 &&
    (dayOutcome === 'breakeven' || dayOutcome === 'unknown');

  const dayClasses = [
    'journalit-dashboard-calendar-day',
    day.currentMonth ? 'current-month' : 'other-month',
    day.tradeCount > 0 ? 'has-trades' : '',
    !isPnlMasked && isPositiveDay ? 'positive' : '',
    !isPnlMasked && isNegativeDay ? 'negative' : '',
    !isPnlMasked && isNeutralDay ? 'neutral' : '',
    isWeekendDay ? 'weekend-day' : '',
    day.isToday ? 'today' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const interactiveDayProps = isClickable
    ? {
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        role: 'button',
        tabIndex: 0,
        'aria-label': day.date
          ? t('calendar.aria.open-daily-review', {
              date: formatLocalDateString(day.date),
            })
          : undefined,
      }
    : {};

  return (
    <div className={dayClasses} {...interactiveDayProps}>
      <div className="journalit-dashboard-calendar-day-number">
        {day.dayNumber || ''}
      </div>
      {day.pnl !== null && (
        <div className="journalit-dashboard-calendar-day-pnl">
          {formatValue({
            kind: 'pnl',
            value: day.pnl,
            showCents: false,
            currencyCode: currency,
            rMultiple: day.rMultiple,
          })}
        </div>
      )}
      {day.tradeCount > 0 && (
        <div className="journalit-dashboard-calendar-day-trades">
          {day.tradeCount === 1
            ? t('calendar.trade', { count: '1' })
            : t('calendar.trades', { count: String(day.tradeCount) })}
        </div>
      )}
    </div>
  );
});

CalendarDay.displayName = 'CalendarDay';


export const PerformanceCalendar = memo<PerformanceCalendarProps>(
  ({
    trades,
    filters,
    onDayClick,
    onWeekClick,
    height = '100%',
    compactWidthThreshold = 320,
    compactHeightThreshold = 300,
  }) => {
    const plugin = usePlugin();
    const { currency } = useCurrency();
    const { formatValue, shouldMask } = useDisplayFormatter();
    const calendarRef = useRef<HTMLDivElement>(null);
    const [isCompact, setIsCompact] = useState(false);

    
    
    const skipWeekends = plugin?.settings?.trade?.skipWeekends ?? true;
    const weekStartDay = getWeekStartDaySetting(plugin ?? undefined);
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

    useEffect(() => {
      const calendarElement = calendarRef.current;
      if (!calendarElement) return;

      const updateCompactMode = () => {
        const { width, height } = calendarElement.getBoundingClientRect();

        
        
        
        
        if (width <= 0 || height <= 0) {
          return;
        }

        setIsCompact(
          width <= compactWidthThreshold || height <= compactHeightThreshold
        );
      };

      updateCompactMode();

      if (!window.ResizeObserver) {
        window.addEventListener('resize', updateCompactMode);
        return () => window.removeEventListener('resize', updateCompactMode);
      }

      const resizeObserver = new ResizeObserver(updateCompactMode);
      resizeObserver.observe(calendarElement);

      return () => resizeObserver.disconnect();
    }, [compactHeightThreshold, compactWidthThreshold]);

    const weekStartDayIndex = useMemo(
      () => getWeekStartDayIndex(weekStartDay),
      [weekStartDay]
    );

    const orderedWeekdays = useMemo(() => {
      const baseOrder = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const rotatedOrder = [
        ...baseOrder.slice(weekStartDayIndex),
        ...baseOrder.slice(0, weekStartDayIndex),
      ];

      if (!skipWeekends) {
        return rotatedOrder;
      }

      return rotatedOrder.filter((day) => day !== 'sun' && day !== 'sat');
    }, [skipWeekends, weekStartDayIndex]);

    const weekdayIndices = useMemo(() => {
      const baseOrder = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const rotatedOrder = [
        ...baseOrder.slice(weekStartDayIndex),
        ...baseOrder.slice(0, weekStartDayIndex),
      ];
      const indices = new Set<number>();

      rotatedOrder.forEach((dayKey, index) => {
        if (dayKey !== 'sun' && dayKey !== 'sat') {
          indices.add(index);
        }
      });

      return indices;
    }, [weekStartDayIndex]);

    
    const applyAccountCountMultiplier = false;

    const isPnlMasked = shouldMask('pnl');

    
    const defaultRiskAmount = useMemo(
      () => plugin?.settings?.trade?.defaultRiskAmount,
      [plugin?.settings?.trade?.defaultRiskAmount]
    );

    const analyticsDateBasis = getAnalyticsDateBasis(plugin?.settings);

    const breakEvenRangeMinSetting = plugin?.settings?.trade?.breakEvenRangeMin;
    const breakEvenRangeMaxSetting = plugin?.settings?.trade?.breakEvenRangeMax;
    const breakEvenRange = useMemo(
      () =>
        normalizeBreakEvenRange({
          breakEvenRangeMin: breakEvenRangeMinSetting,
          breakEvenRangeMax: breakEvenRangeMaxSetting,
        }),
      [breakEvenRangeMinSetting, breakEvenRangeMaxSetting]
    );
    const { min: breakEvenRangeMin, max: breakEvenRangeMax } = breakEvenRange;
    const breakEvenSettings = useMemo(
      () => ({
        breakEvenRangeMin,
        breakEvenRangeMax,
        breakEvenThresholdMode:
          plugin?.settings?.trade?.breakEvenThresholdMode ?? 'fixed',
        breakEvenThresholdPercent:
          plugin?.settings?.trade?.breakEvenThresholdPercent,
      }),
      [
        breakEvenRangeMin,
        breakEvenRangeMax,
        plugin?.settings?.trade?.breakEvenThresholdMode,
        plugin?.settings?.trade?.breakEvenThresholdPercent,
      ]
    );

    
    const tradesByDate: { [date: string]: number } = {};
    const tradeCountByDate: { [date: string]: number } = {};
    const tradeIdsByDate: { [date: string]: Set<string> } = {};
    const rMultipleByDate: { [date: string]: number } = {};
    const breakEvenBalancesByDate: { [date: string]: Set<number> } = {};
    const hasUnresolvedBreakEvenBalanceByDate: { [date: string]: boolean } = {};

    
    trades.forEach((trade) => {
      const tradeDate = getTradeAnalyticsTradingDay(
        trade,
        analyticsDateBasis,
        plugin
      );
      const realizedEvents = getTradeRealizedPnlEvents(
        trade,
        analyticsDateBasis,
        plugin
      );
      if (!tradeDate && realizedEvents.length === 0) {
        return;
      }

      
      if (!isPnlContributingTrade(trade)) {
        return;
      }

      
      if (trade.isMissedTrade === true) {
        return;
      }

      
      if (trade.isBacktestTrade === true) {
        return;
      }

      
      if (!trade.instrument) {
        return;
      }

      const pnlEvents = realizedEvents.length
        ? realizedEvents
        : tradeDate
          ? [
              {
                tradingDay: tradeDate,
                pnl: getEffectivePnL(trade),
              },
            ]
          : [];
      const useStoredRMultiple = pnlEvents.length === 1;
      const accountCount = getAccountCount(trade);
      const breakEvenBalanceForDisplay = applyAccountCountMultiplier
        ? (trade.breakEvenAccountCurrentBalanceTotal ??
          trade.breakEvenAccountCurrentBalance)
        : trade.breakEvenAccountCurrentBalance;

      for (const event of pnlEvents) {
        const eventDate = event.tradingDay;
        if (
          (filters?.dateRange?.[0] && eventDate < filters.dateRange[0]) ||
          (filters?.dateRange?.[1] && eventDate > filters.dateRange[1])
        ) {
          continue;
        }

        const dateKey = formatLocalDateString(eventDate);

        if (tradesByDate[dateKey] === undefined) {
          tradesByDate[dateKey] = 0;
          tradeCountByDate[dateKey] = 0;
          tradeIdsByDate[dateKey] = new Set<string>();
          breakEvenBalancesByDate[dateKey] = new Set<number>();
          hasUnresolvedBreakEvenBalanceByDate[dateKey] = false;
        }

        const displayPnL = getDisplayPnL(
          event.pnl,
          accountCount,
          applyAccountCountMultiplier
        );
        tradesByDate[dateKey] += displayPnL;
        const tradeKey = trade.tradeId ?? trade.path ?? trade.instrument;
        if (tradeKey && !tradeIdsByDate[dateKey].has(tradeKey)) {
          tradeIdsByDate[dateKey].add(tradeKey);
          tradeCountByDate[dateKey]++;
        }

        const resolvedBreakEvenBalance =
          typeof breakEvenBalanceForDisplay === 'number' &&
          Number.isFinite(breakEvenBalanceForDisplay)
            ? breakEvenBalanceForDisplay
            : undefined;

        if (resolvedBreakEvenBalance !== undefined) {
          breakEvenBalancesByDate[dateKey].add(resolvedBreakEvenBalance);
        }

        const displayOutcome = classifyPnLWithBreakEvenSettings(
          displayPnL,
          breakEvenSettings,
          resolvedBreakEvenBalance
        );
        if (displayOutcome === 'unknown') {
          hasUnresolvedBreakEvenBalanceByDate[dateKey] = true;
        }

        const effectiveRMultiple = calculateEffectiveRMultiple(
          displayPnL,
          useStoredRMultiple ? trade.rMultiple : undefined,
          trade.riskAmount,
          defaultRiskAmount
        );

        if (effectiveRMultiple !== undefined && !isNaN(effectiveRMultiple)) {
          rMultipleByDate[dateKey] =
            (rMultipleByDate[dateKey] ?? 0) + effectiveRMultiple;
        }
      }
    });

    
    
    const { gridStartDate } = useMemo(() => {
      let startDate: Date;
      let endDate: Date;
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth(); 

      
      if (!filters?.dateRange?.[0] && !filters?.dateRange?.[1]) {
        
        startDate = new Date(currentYear, currentMonth, 1); 
        endDate = new Date(currentYear, currentMonth + 1, 0); 
      }
      
      else if (
        filters?.dateRange?.[0] &&
        filters.dateRange[0].getFullYear() === currentYear &&
        filters.dateRange[0].getMonth() === 0 && 
        filters.dateRange[0].getDate() === 1
        
      ) {
        
        startDate = new Date(currentYear, 0, 1); 
        endDate = new Date(currentYear, 11, 31); 
      }
      
      else {
        
        startDate =
          filters?.dateRange?.[0] ||
          (trades.length > 0
            ? new Date(
                Math.min(
                  ...trades.map((t) => {
                    const date = getTradeAnalyticsTradingDay(
                      t,
                      analyticsDateBasis,
                      plugin
                    );
                    return date ? date.getTime() : Date.now();
                  })
                )
              )
            : today); 

        endDate = filters?.dateRange?.[1] || today; 
      }

      
      if (startDate > endDate) {
        startDate = new Date(endDate); 
        startDate.setDate(1); 
        console.warn(
          'Calendar: Corrected invalid date range where start date was after end date.'
        );
      }

      return { gridStartDate: startDate, gridEndDate: endDate };
    }, [analyticsDateBasis, filters?.dateRange, plugin, trades]);

    const firstVisibleMonth = useMemo(
      () => new Date(gridStartDate.getFullYear(), gridStartDate.getMonth(), 1),
      [gridStartDate]
    );
    const [visibleMonthState, setVisibleMonthState] = useState(() => ({
      firstVisibleMonth,
      offset: 0,
    }));
    const visibleMonthOffset =
      visibleMonthState.firstVisibleMonth.getTime() ===
      firstVisibleMonth.getTime()
        ? visibleMonthState.offset
        : 0;
    const setVisibleMonthOffset = (
      offset: number | ((currentOffset: number) => number)
    ) => {
      setVisibleMonthState((current) => {
        const currentOffset =
          current.firstVisibleMonth.getTime() === firstVisibleMonth.getTime()
            ? current.offset
            : 0;
        return {
          firstVisibleMonth,
          offset: typeof offset === 'function' ? offset(currentOffset) : offset,
        };
      });
    };

    const visibleMonth = useMemo(
      () =>
        new Date(
          firstVisibleMonth.getFullYear(),
          firstVisibleMonth.getMonth() + visibleMonthOffset,
          1
        ),
      [firstVisibleMonth, visibleMonthOffset]
    );
    const visibleMonthEnd = useMemo(
      () =>
        new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0),
      [visibleMonth]
    );
    const visibleQuarter = Math.floor(visibleMonth.getMonth() / 3) + 1;
    const monthNames = useMemo(
      () => [
        t('calendar.month.january'),
        t('calendar.month.february'),
        t('calendar.month.march'),
        t('calendar.month.april'),
        t('calendar.month.may'),
        t('calendar.month.june'),
        t('calendar.month.july'),
        t('calendar.month.august'),
        t('calendar.month.september'),
        t('calendar.month.october'),
        t('calendar.month.november'),
        t('calendar.month.december'),
      ],
      []
    );
    
    const calendar = generateCalendarGrid(
      visibleMonth,
      visibleMonthEnd,
      tradesByDate,
      tradeCountByDate,
      rMultipleByDate,
      breakEvenBalancesByDate,
      hasUnresolvedBreakEvenBalanceByDate,
      weekStartDayIndex
    );

    
    const handleDayClick = (date: Date) => {
      if (onDayClick) {
        
        onDayClick(date);
      } else if (plugin) {
        
        void plugin.drcService?.openDRC(date);
      }
    };

    
    const handleWeekClick = (date: Date) => {
      if (onWeekClick) {
        
        onWeekClick(date);
      } else if (plugin) {
        
        if (plugin.weeklyReviewService) {
          
          void plugin.weeklyReviewService.openWeeklyReview(date);
        } else if (plugin.drcService) {
          
          console.warn(
            'WeeklyReviewService not found, falling back to DRCService'
          );
          void plugin.drcService.openDRC(date);
        }
      }
    };

    const handleMonthClick = async () => {
      const monthlyReviewService =
        await plugin?.serviceManager?.getMonthlyReviewService?.();
      await monthlyReviewService?.openMonthlyReview(visibleMonth);
    };

    const handleQuarterClick = async () => {
      const quarterlyReviewService =
        await plugin?.serviceManager?.getQuarterlyReviewService?.();
      await quarterlyReviewService?.openQuarterlyReview(visibleMonth);
    };

    const handleYearClick = async () => {
      const yearlyReviewService =
        await plugin?.serviceManager?.getYearlyReviewService?.();
      await yearlyReviewService?.openYearlyReview(visibleMonth);
    };

    return (
      <div
        ref={calendarRef}
        className={`journalit-dashboard-calendar ${isCompact ? 'is-compact' : ''}`}
        style={cssVars({
          '--journalit-dashboard-calendar-height':
            typeof height === 'number' ? `${height}px` : String(height),
        })}
      >
        <div className="journalit-dashboard-calendar-inner">
          <div className="journalit-dashboard-calendar-month-toolbar">
            <button
              className="journalit-dashboard-calendar-nav-button"
              type="button"
              onClick={() => setVisibleMonthOffset((offset) => offset - 1)}
              aria-label={t('button.back')}
            >
              ←
            </button>
            <div className="journalit-dashboard-calendar-current-month">
              <button
                className="journalit-dashboard-calendar-header-link"
                type="button"
                onClick={() => void handleMonthClick()}
              >
                {monthNames[visibleMonth.getMonth()].slice(0, 3)}
              </button>{' '}
              <span className="journalit-dashboard-calendar-header-separator">
                ·
              </span>{' '}
              <button
                className="journalit-dashboard-calendar-header-link"
                type="button"
                onClick={() => void handleQuarterClick()}
              >
                Q{visibleQuarter}
              </button>{' '}
              <button
                className="journalit-dashboard-calendar-header-link"
                type="button"
                onClick={() => void handleYearClick()}
              >
                {visibleMonth.getFullYear()}
              </button>
            </div>
            <button
              className="journalit-dashboard-calendar-nav-button"
              type="button"
              onClick={() => setVisibleMonthOffset((offset) => offset + 1)}
              aria-label={t('button.next')}
            >
              →
            </button>
          </div>
          <div
            className={`journalit-dashboard-calendar-header ${skipWeekends ? 'hide-weekends' : ''}`}
          >
            {orderedWeekdays.map((dayKey, index) => {
              const isPrimary = dayKey === 'mon' || dayKey === 'tue';
              const isFirst = index === 0;
              const dataDay = `${dayKey[0].toUpperCase()}${dayKey.slice(1, 3)}`;

              const weekdayKey = `calendar.weekday.${dayKey}`;
              const weekdayLabel = hasTranslation(weekdayKey)
                ? t(weekdayKey)
                : weekdayKey;

              return (
                <div
                  key={dayKey}
                  className={`journalit-dashboard-calendar-weekday ${
                    dayKey === 'mon' ? 'monday-header' : ''
                  } ${isPrimary ? 'journalit-dashboard-calendar-weekday--primary' : ''} ${isFirst ? 'journalit-dashboard-calendar-weekday--first' : ''}`}
                  data-day={dataDay}
                >
                  {weekdayLabel}
                </div>
              );
            })}
            <div className="journalit-dashboard-calendar-weekday weekly-pnl-header">
              {t('calendar.pnl')}
            </div>
          </div>

          <div
            className={`journalit-dashboard-calendar-grid ${skipWeekends ? 'hide-weekends' : ''}`}
          >
            {calendar.flatMap((week, weekIndex) => {
              
              if (skipWeekends) {
                
                
                const hasValidWeekdays = week.some(
                  (day, dayIndex) =>
                    weekdayIndices.has(dayIndex) &&
                    day.date !== null &&
                    day.currentMonth
                );

                if (!hasValidWeekdays) return [];
              }

              
              let weeklyPnL = 0;
              let weeklyTradeCount = 0;
              let validDays = 0;
              let weeklyRMultiple = 0;
              let weeklyHasRMultiple = false;

              const visibleWeekDays = skipWeekends
                ? week.filter((_, dayIndex) => weekdayIndices.has(dayIndex))
                : week;
              const currentMonthWeekDays = visibleWeekDays.filter(
                (day) => day.currentMonth
              );

              
              const firstValidDate = currentMonthWeekDays.find(
                (day) => day.date
              )?.date;

              
              currentMonthWeekDays.forEach((day) => {
                if (day.pnl !== null) {
                  weeklyPnL += day.pnl;
                  validDays++;
                }
                if (day.tradeCount > 0) {
                  weeklyTradeCount += day.tradeCount;
                }
                if (day.rMultiple !== null) {
                  weeklyRMultiple += day.rMultiple;
                  weeklyHasRMultiple = true;
                }
              });

              const weeklyHasUnresolvedBreakEvenBalance =
                currentMonthWeekDays.some(
                  (day) => day.hasUnresolvedBreakEvenBalance === true
                );

              const weeklyBalances = Array.from(
                new Set(
                  currentMonthWeekDays.flatMap((day) => {
                    const balance = day.breakEvenAccountCurrentBalance;
                    return balance !== undefined && Number.isFinite(balance)
                      ? [balance]
                      : [];
                  })
                )
              );
              const weeklyBreakEvenAccountCurrentBalance =
                weeklyBalances.length === 1 ? weeklyBalances[0] : undefined;

              const weeklyOutcome =
                validDays > 0 && !weeklyHasUnresolvedBreakEvenBalance
                  ? classifyPnLWithBreakEvenSettings(
                      weeklyPnL,
                      breakEvenSettings,
                      weeklyBreakEvenAccountCurrentBalance
                    )
                  : null;

              const weeklyOutcomeClass = isPnlMasked
                ? ''
                : weeklyOutcome === 'win'
                  ? 'positive'
                  : weeklyOutcome === 'loss'
                    ? 'negative'
                    : weeklyOutcome
                      ? 'neutral'
                      : '';

              return (
                <React.Fragment key={`week-${weekIndex}`}>
                  <div
                    className={`journalit-dashboard-calendar-week ${
                      skipWeekends ? 'hide-weekends' : ''
                    }`}
                  >
                    {visibleWeekDays.map((day, filteredIndex) => {
                      return (
                        <CalendarDay
                          key={`day-${weekIndex}-${filteredIndex}`}
                          day={day}
                          onClick={handleDayClick}
                          breakEvenSettings={breakEvenSettings}
                        />
                      );
                    })}

                    
                    {(() => {
                      const interactiveWeekProps = firstValidDate
                        ? {
                            onClick: () => handleWeekClick(firstValidDate),
                            onKeyDown: (
                              event: React.KeyboardEvent<HTMLDivElement>
                            ) => {
                              if (event.key !== 'Enter' && event.key !== ' ') {
                                return;
                              }

                              event.preventDefault();
                              handleWeekClick(firstValidDate);
                            },
                            role: 'button',
                            tabIndex: 0,
                            'aria-label': t(
                              'calendar.aria.open-weekly-review',
                              {
                                date: formatLocalDateString(firstValidDate),
                              }
                            ),
                          }
                        : {};

                      return (
                        <div
                          className={`journalit-dashboard-calendar-weekly-pnl ${weeklyTradeCount > 0 ? 'has-trades' : ''} ${weeklyOutcomeClass}`}
                          {...interactiveWeekProps}
                        >
                          {firstValidDate && (
                            <div className="journalit-dashboard-calendar-week-number">
                              W
                              {getWeekNumberForDate(
                                firstValidDate,
                                weekStartDay
                              )}
                            </div>
                          )}
                          {validDays > 0 && (
                            <>
                              <div className="journalit-dashboard-calendar-week-total-label">
                                {t('calendar.week')}
                              </div>
                              <div className="journalit-dashboard-calendar-week-total-value">
                                {formatValue({
                                  kind: 'pnl',
                                  value: weeklyPnL,
                                  showCents: false,
                                  currencyCode: currency,
                                  rMultiple: weeklyHasRMultiple
                                    ? weeklyRMultiple
                                    : undefined,
                                })}
                              </div>
                              {weeklyTradeCount > 0 && (
                                <div className="journalit-dashboard-calendar-week-trade-count">
                                  {weeklyTradeCount === 1
                                    ? t('calendar.trade', { count: '1' })
                                    : t('calendar.trades', {
                                        count: String(weeklyTradeCount),
                                      })}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

PerformanceCalendar.displayName = 'PerformanceCalendar';


const generateCalendarGrid = (
  startDate: Date,
  endDate: Date,
  tradesByDate: { [date: string]: number },
  tradeCountByDate: { [date: string]: number },
  rMultipleByDate: { [date: string]: number },
  breakEvenBalancesByDate: { [date: string]: Set<number> },
  hasUnresolvedBreakEvenBalanceByDate: { [date: string]: boolean },
  weekStartDayIndex: number
) => {
  const calendar = [];

  
  const currentDate = new Date(startDate);
  currentDate.setDate(1); 

  
  const lastDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);

  
  while (currentDate <= lastDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = (firstDay.getDay() - weekStartDayIndex + 7) % 7; 

    
    const lastDay = new Date(year, month + 1, 0);
    const lastDayOfWeek = (lastDay.getDay() - weekStartDayIndex + 7) % 7;
    const calendarStartDate = new Date(firstDay);
    calendarStartDate.setDate(firstDay.getDate() - firstDayOfWeek);
    const calendarEndDate = new Date(lastDay);
    calendarEndDate.setDate(lastDay.getDate() + (6 - lastDayOfWeek));

    
    const cursorDate = new Date(calendarStartDate);
    const monthWeeks = [];

    
    while (cursorDate <= calendarEndDate) {
      const week = [];

      
      for (let i = 0; i < 7; i++) {
        const dateObj = new Date(cursorDate);
        const dayYear = dateObj.getFullYear();
        const dayMonth = dateObj.getMonth();
        const dayNumber = dateObj.getDate();
        const dateStr = `${dayYear}-${String(dayMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
        const currentMonth = dayYear === year && dayMonth === month;

        const balancesForDate = Array.from(
          breakEvenBalancesByDate[dateStr] ?? new Set<number>()
        );
        const breakEvenAccountCurrentBalance =
          balancesForDate.length === 1 ? balancesForDate[0] : undefined;

        week.push({
          dayNumber,
          date: dateObj,
          currentMonth,
          pnl: currentMonth ? (tradesByDate[dateStr] ?? null) : null,
          tradeCount: currentMonth ? (tradeCountByDate[dateStr] ?? 0) : 0,
          isToday: isToday(dateStr),
          rMultiple: currentMonth ? (rMultipleByDate[dateStr] ?? null) : null,
          breakEvenAccountCurrentBalance: currentMonth
            ? breakEvenAccountCurrentBalance
            : undefined,
          hasUnresolvedBreakEvenBalance:
            currentMonth &&
            hasUnresolvedBreakEvenBalanceByDate[dateStr] === true,
        });

        cursorDate.setDate(cursorDate.getDate() + 1);
      }

      monthWeeks.push(week);
    }

    calendar.push(...monthWeeks);

    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return calendar;
};


function isToday(date: string | null): boolean {
  if (!date) return false;

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return date === todayString;
}
