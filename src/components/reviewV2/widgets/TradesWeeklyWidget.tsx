

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import { SharedDailyPerformanceChart } from '../../charts/SharedDailyPerformanceChart';
import { InvalidContextMessage } from './InvalidContextMessage';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { getDisplayPnL, getAccountCount } from '../../../utils/pnlUtils';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { TradesPreviewData } from '../../../types/reviewV2';
import {
  getReviewTradeRealizedPnlEvents,
  getReviewTradeTradingDay,
} from '../utils/reviewTradeDates';
import { useReviewTrades } from '../hooks/useReviewData';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';
import { getTradeAccountNames } from './shared/accountDisplay';
import { formatAccountTooltipSummary } from './shared/accountTooltipSummary';
import {
  formatLocalDateString,
  getWeekNumberForDate,
  getWeekStartDate,
  getWeekStartDaySetting,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import {
  getReviewWidgetPeriodAriaLabel,
  openReviewWidgetPeriod,
} from '../reviewWidgetNavigation';

type ReviewPeriodTrade = Record<string, unknown> & {
  tradeId?: string;
  id?: string;
  path?: string;
  pnl?: number | null;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  tradeStatus?: string;
  account?: string | string[];
  currency?: string;
  originalCurrency?: string;
  brokerBaseCurrency?: string;
  riskAmount?: number;
  _analyticsRangeStart?: Date;
  _analyticsRangeEnd?: Date;
};

function asReviewPeriodTrades(value: unknown): ReviewPeriodTrade[] {
  return Array.isArray(value)
    ? value.filter((item): item is ReviewPeriodTrade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];
}

function getTradeKey(trade: ReviewPeriodTrade, index: number): string {
  return trade.tradeId ?? trade.id ?? trade.path ?? `trade-${index}`;
}

interface TradesWeeklyWidgetConfig {
  height?: number;
}

const EMPTY_TRADES_WEEKLY_CONFIG: TradesWeeklyWidgetConfig = {};

interface TradesWeeklyWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: TradesWeeklyWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface WeeklyDataPoint {
  date: string; 
  originalDate?: string;
  pnl: number;
  fill: string;
  trades: number;
  rMultiple?: number;
  accountSummary?: string;
}

export const TradesWeeklyWidget: React.FC<TradesWeeklyWidgetProps> = ({
  filePath,
  plugin,
  config = EMPTY_TRADES_WEEKLY_CONFIG,
  preview = false,
  previewData,
}) => {
  
  const {
    analyticsBasisTrades: cachedTrades,
    loading: cacheLoading,
    noteType,
    currencyConversion,
  } = useReviewTrades(filePath, plugin);

  
  const trades = asReviewPeriodTrades(
    preview && previewData ? previewData.trades : cachedTrades
  );
  const loading = preview ? false : cacheLoading;

  const height = config.height ?? 250;

  
  const applyAccountCountMultiplier = false;
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

  
  const chartData: WeeklyDataPoint[] = useMemo(() => {
    if (trades.length === 0) return [];

    const weeklyMap = new Map<
      string,
      {
        pnl: number;
        tradeIds: Set<string>;
        rMultiple: number;
        accounts: Set<string>;
        weekNumber: number;
      }
    >();
    const weekStartDay = getWeekStartDaySetting(plugin);

    for (const [tradeIndex, trade] of trades
      .filter((item) => isPnlContributingTrade(item))
      .entries()) {
      const analyticsDate = getReviewTradeTradingDay(trade, plugin);
      const realizedEvents = getReviewTradeRealizedPnlEvents(trade, plugin);
      if (!analyticsDate && realizedEvents.length === 0) {
        continue;
      }

      const pnlEvents =
        realizedEvents.length > 0
          ? realizedEvents
          : analyticsDate
            ? [{ tradingDay: analyticsDate, pnl: getEffectivePnL(trade) }]
            : [];
      const accountCount = getAccountCount(trade);
      const tradeKey = getTradeKey(trade, tradeIndex);

      for (const event of pnlEvents) {
        if (
          (trade._analyticsRangeStart &&
            event.tradingDay < trade._analyticsRangeStart) ||
          (trade._analyticsRangeEnd &&
            event.tradingDay > trade._analyticsRangeEnd)
        ) {
          continue;
        }

        const weekStart = getWeekStartDate(event.tradingDay, weekStartDay);
        const weekKey = formatLocalDateString(weekStart);
        const existing = weeklyMap.get(weekKey) || {
          pnl: 0,
          tradeIds: new Set<string>(),
          rMultiple: 0,
          accounts: new Set<string>(),
          weekNumber: getWeekNumberForDate(event.tradingDay, weekStartDay),
        };
        existing.pnl += getDisplayPnL(
          event.pnl,
          accountCount,
          applyAccountCountMultiplier
        );
        existing.tradeIds.add(tradeKey);
        for (const account of getTradeAccountNames(trade)) {
          existing.accounts.add(account);
        }
        existing.rMultiple +=
          calculateEffectiveRMultiple(
            event.pnl,
            undefined,
            trade.riskAmount,
            defaultRiskAmount
          ) ?? 0;
        weeklyMap.set(weekKey, existing);
      }
    }

    
    const result: WeeklyDataPoint[] = [];
    const sortedWeeks = Array.from(weeklyMap.keys()).sort();

    for (const weekKey of sortedWeeks) {
      const data = weeklyMap.get(weekKey)!;
      result.push({
        date: `W${data.weekNumber}`,
        originalDate: weekKey,
        pnl: data.pnl,
        fill: data.pnl >= 0 ? 'var(--chart-positive)' : 'var(--chart-negative)',
        trades: data.tradeIds.size,
        rMultiple: data.rMultiple,
        accountSummary: formatAccountTooltipSummary(data.accounts),
      });
    }

    return result;
  }, [trades, applyAccountCountMultiplier, defaultRiskAmount, plugin]);

  
  if (noteType === 'drc' || noteType === 'weekly-review') {
    return (
      <InvalidContextMessage
        widgetType={t('widget.trades-chart-weekly.name')}
        reason={t('widget.invalid-context.monthly-only')}
      />
    );
  }

  if (loading) {
    return (
      <div className="journalit-reviewv2-chart-container">
        <div className="journalit-reviewv2-chart-header">
          <div className="journalit-reviewv2-chart-title">
            {t('widget.trades-chart-weekly.name')}
          </div>
        </div>
        <div className="journalit-reviewv2-chart-body">
          
          <div
            className="journalit-reviewv2-chart-skeleton"
            style={cssVars({
              '--reviewv2-chart-height': `${height}px`,
              '--reviewv2-chart-bar-gap': '4px',
            })}
          >
            
            <div className="journalit-reviewv2-chart-skeleton-axis">
              <SkeletonBox width={30} height={10} borderRadius="4px" />
              <SkeletonBox width={25} height={10} borderRadius="4px" />
              <SkeletonBox width={28} height={10} borderRadius="4px" />
            </div>
            
            <div className="journalit-reviewv2-chart-skeleton-bars">
              <SkeletonBox width={18} height="45%" borderRadius="2px" />
              <SkeletonBox width={18} height="25%" borderRadius="2px" />
              <SkeletonBox width={18} height="60%" borderRadius="2px" />
              <SkeletonBox width={18} height="15%" borderRadius="2px" />
              <SkeletonBox width={18} height="35%" borderRadius="2px" />
            </div>
            
            <div className="journalit-reviewv2-chart-skeleton-xline" />
            
            <div className="journalit-reviewv2-chart-skeleton-xlabels">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBox
                  key={i}
                  width={20}
                  height={10}
                  borderRadius="4px"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="journalit-reviewv2-chart-container">
        <div className="journalit-reviewv2-chart-header">
          <div className="journalit-reviewv2-chart-title">
            {t('widget.trades-chart-weekly.name')}
            <CurrencyConversionInfo metadata={currencyConversion} />
          </div>
        </div>
        <div className="journalit-reviewv2-chart-empty">
          {t('widget.empty.no-weekly-data')}
        </div>
      </div>
    );
  }

  return (
    <div className="journalit-reviewv2-chart-container">
      <div className="journalit-reviewv2-chart-header">
        <div className="journalit-reviewv2-chart-title">
          {t('widget.trades-chart-weekly.name')}
          <CurrencyConversionInfo metadata={currencyConversion} />
        </div>
      </div>
      <div className="journalit-reviewv2-chart-body">
        <SharedDailyPerformanceChart
          data={chartData}
          height={height}
          currencyOverride={getSingleExplicitCurrency(trades)}
          navigation={
            preview
              ? undefined
              : {
                  getPointAriaLabel: (point) =>
                    getReviewWidgetPeriodAriaLabel('weekly', point.date),
                  onPointClick: (point) => {
                    if (!point.originalDate) return;
                    const date = parseLocalDateSafe(point.originalDate);
                    if (date) {
                      void openReviewWidgetPeriod(plugin, 'weekly', date);
                    }
                  },
                }
          }
        />
      </div>
    </div>
  );
};

export {};
