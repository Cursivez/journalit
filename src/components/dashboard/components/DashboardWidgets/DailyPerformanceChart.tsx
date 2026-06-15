

import React, { useState } from 'react';
import { t } from '../../../../lang/helpers';
import {
  formatDateDisplay,
  parseLocalDateSafe,
} from '../../../../utils/dateUtils';
import { calculateEffectiveRMultiple } from '../../../../utils/formatting';
import {
  getTradeAnalyticsTradingDay,
  getTradeRealizedPnlEvents,
} from '../../../../utils/tradeAnalyticsDate';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { SharedDailyPerformanceChart } from '../../../charts';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../../utils/tradeStatusUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import {
  buildCurrencyConversionMetadata,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';


const DAILY_PERIODS = [10, 20, 30, 50] as const;
type DailyPeriod = (typeof DAILY_PERIODS)[number];

const parseDailyPeriod = (value: number): DailyPeriod | null => {
  switch (value) {
    case 10:
    case 20:
    case 30:
    case 50:
      return value;
    default:
      return null;
  }
};


export const DailyPerformanceChart = React.memo<BaseWidgetProps>(
  ({ filters, dateFormat }) => {
    const plugin = usePlugin();
    const [selectedPeriod, setSelectedPeriod] = useState<DailyPeriod>(20);

    return (
      <BaseWidget
        filters={filters}
        dateFormat={dateFormat}
        skeletonType="bar-chart"
      >
        {(data, userDateFormat) => {
          
          const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

          
          const tradesByDate: {
            [date: string]: { pnl: number; trades: number; rMultiple: number };
          } = {};
          const tradeIdsByDate: { [date: string]: Set<string> } = {};

          
          data.trades
            .filter((trade) => isPnlContributingTrade(trade))
            .forEach((trade) => {
              
              const analyticsDateBasis =
                plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';
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

              for (const event of pnlEvents) {
                const eventDate = event.tradingDay;
                if (
                  (trade._analyticsRangeStart &&
                    eventDate < trade._analyticsRangeStart) ||
                  (trade._analyticsRangeEnd &&
                    eventDate > trade._analyticsRangeEnd)
                ) {
                  continue;
                }

                const year = eventDate.getFullYear();
                const month = String(eventDate.getMonth() + 1).padStart(2, '0');
                const day = String(eventDate.getDate()).padStart(2, '0');
                const dateKey = `${year}-${month}-${day}`;

                if (!tradesByDate[dateKey]) {
                  tradesByDate[dateKey] = { pnl: 0, trades: 0, rMultiple: 0 };
                  tradeIdsByDate[dateKey] = new Set<string>();
                }

                tradesByDate[dateKey].pnl += event.pnl;
                const tradeKey =
                  trade.tradeId ?? trade.path ?? trade.instrument;
                if (tradeKey && !tradeIdsByDate[dateKey].has(tradeKey)) {
                  tradeIdsByDate[dateKey].add(tradeKey);
                  tradesByDate[dateKey].trades += 1;
                }

                const effectiveRMultiple = calculateEffectiveRMultiple(
                  event.pnl,
                  useStoredRMultiple ? trade.rMultiple : undefined,
                  trade.riskAmount,
                  defaultRiskAmount
                );

                if (
                  effectiveRMultiple !== undefined &&
                  !isNaN(effectiveRMultiple)
                ) {
                  tradesByDate[dateKey].rMultiple += effectiveRMultiple;
                }
              }
            });

          
          const allChartData = Object.entries(tradesByDate).map(
            ([date, data]) => ({
              date: formatDateDisplay(
                parseLocalDateSafe(date) ?? new Date(date),
                userDateFormat
              ),
              originalDate: date, 
              pnl: data.pnl,
              trades: data.trades,
              rMultiple: data.rMultiple,
              
              fill:
                data.pnl >= 0
                  ? 'var(--chart-positive)'
                  : 'var(--chart-negative)',
            })
          );

          
          allChartData.sort(
            (a, b) =>
              new Date(a.originalDate).getTime() -
              new Date(b.originalDate).getTime()
          );

          
          const chartData = allChartData.slice(-selectedPeriod);

          
          const currencyOverride = data.metrics.isMultiCurrency
            ? data.metrics.conversionBaseCurrency
            : undefined;

          
          return (
            <div className="journalit-dashboard-daily-performance-chart">
              
              <div className="journalit-dashboard-daily-performance-chart__header">
                <div className="journalit-dashboard-daily-performance-chart__title">
                  {t('dashboard.widgets.daily-performance.title')}
                  <CurrencyConversionInfo
                    metadata={buildCurrencyConversionMetadata(data.metrics)}
                    trades={data.trades}
                  />
                </div>
                <div className="journalit-dashboard-daily-performance-chart__selector">
                  <select
                    aria-label={t(
                      'dashboard.widgets.daily-performance.period-aria'
                    )}
                    value={selectedPeriod}
                    onChange={(e) => {
                      const period = parseDailyPeriod(Number(e.target.value));
                      if (period) {
                        setSelectedPeriod(period);
                      }
                    }}
                    className="journalit-dashboard-daily-performance-chart__select"
                  >
                    {DAILY_PERIODS.map((period) => (
                      <option key={period} value={period}>
                        {t('dashboard.widgets.daily-performance.period-days', {
                          count: period.toString(),
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              
              <div className="journalit-dashboard-daily-performance-chart__body">
                <SharedDailyPerformanceChart
                  data={chartData}
                  currencyOverride={currencyOverride}
                />
              </div>
            </div>
          );
        }}
      </BaseWidget>
    );
  }
);
DailyPerformanceChart.displayName = 'DailyPerformanceChart';
