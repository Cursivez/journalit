

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import {
  PeriodPerformanceChartCard,
  type PeriodBarSkeletonShape,
} from './shared/PeriodPerformanceChartCard';
import { InvalidContextMessage } from './InvalidContextMessage';
import {
  formatLocalDateString,
  formatDatesForChartAxis,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import {
  getReviewTradeRealizedPnlEvents,
  getReviewTradeTradingDay,
} from '../utils/reviewTradeDates';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { getDisplayPnL, getAccountCount } from '../../../utils/pnlUtils';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { t } from '../../../lang/helpers';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { getTradeAccountNames } from './shared/accountDisplay';
import { formatAccountTooltipSummary } from './shared/accountTooltipSummary';
import {
  getReviewWidgetPeriodAriaLabel,
  openReviewWidgetPeriod,
} from '../reviewWidgetNavigation';

type ReviewDailyTrade = Record<string, unknown> & {
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

function asReviewDailyTrades(value: unknown): ReviewDailyTrade[] {
  return Array.isArray(value)
    ? value.filter((item): item is ReviewDailyTrade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];
}

function getTradeKey(trade: ReviewDailyTrade, index: number): string {
  return trade.tradeId ?? trade.id ?? trade.path ?? `trade-${index}`;
}

interface DailyPerformanceDataPoint {
  date: string;
  originalDate?: string;
  pnl: number;
  fill: string;
  trades?: number;
  rMultiple?: number;
  accountSummary?: string;
}

interface TradesDailyWidgetConfig {
  height?: number;
}

const EMPTY_TRADES_DAILY_CONFIG: TradesDailyWidgetConfig = {};

interface TradesDailyWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: TradesDailyWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

const CHART_SKELETON: PeriodBarSkeletonShape = {
  barWidth: 18,
  barHeights: ['45%', '25%', '60%', '15%', '35%', '50%', '20%'],
  labelCount: 5,
  labelWidth: 15,
};

export const TradesDailyWidget: React.FC<TradesDailyWidgetProps> = ({
  filePath,
  plugin,
  config = EMPTY_TRADES_DAILY_CONFIG,
  preview,
  previewData,
}) => {
  
  const {
    analyticsBasisTrades: cachedTrades,
    loading: cacheLoading,
    noteType,
    currencyConversion,
  } = useReviewTrades(filePath, plugin);

  
  const trades = asReviewDailyTrades(
    preview && previewData ? previewData.trades : cachedTrades
  );
  const loading = preview ? false : cacheLoading;

  const height = config.height ?? 250;

  
  const applyAccountCountMultiplier = false;
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

  
  const chartData: DailyPerformanceDataPoint[] = useMemo(() => {
    if (trades.length === 0) return [];

    const dailyMap = new Map<
      string,
      {
        pnl: number;
        tradeIds: Set<string>;
        rMultiple: number;
        accounts: Set<string>;
      }
    >();

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

        const dateKey = formatLocalDateString(event.tradingDay); 
        const existing = dailyMap.get(dateKey) || {
          pnl: 0,
          tradeIds: new Set<string>(),
          rMultiple: 0,
          accounts: new Set<string>(),
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
        dailyMap.set(dateKey, existing);
      }
    }

    
    const sortedKeys = Array.from(dailyMap.keys()).sort();
    const dates = sortedKeys.map(
      (key) => parseLocalDateSafe(key) ?? new Date(key)
    );

    
    const optimizedLabels = formatDatesForChartAxis(dates);

    const result: DailyPerformanceDataPoint[] = sortedKeys.map((dateKey, i) => {
      const data = dailyMap.get(dateKey)!;
      return {
        date: optimizedLabels[i],
        originalDate: dateKey,
        pnl: data.pnl,
        fill: data.pnl >= 0 ? 'var(--chart-positive)' : 'var(--chart-negative)',
        trades: data.tradeIds.size,
        rMultiple: data.rMultiple,
        accountSummary: formatAccountTooltipSummary(data.accounts),
      };
    });

    return result;
  }, [trades, applyAccountCountMultiplier, defaultRiskAmount, plugin]);

  
  if (noteType === 'drc') {
    return (
      <InvalidContextMessage
        widgetType={t('widget.trades-chart-daily.name')}
        reason={t('widget.invalid-context.weekly-monthly')}
      />
    );
  }

  return (
    <PeriodPerformanceChartCard
      title={t('widget.trades-chart-daily.name')}
      emptyMessage={t('widget.empty.no-daily-data')}
      loading={loading}
      height={height}
      skeleton={CHART_SKELETON}
      currencyConversion={currencyConversion}
      data={chartData}
      currencyOverride={getSingleExplicitCurrency(trades)}
      navigation={
        preview
          ? undefined
          : {
              getPointAriaLabel: (point) =>
                getReviewWidgetPeriodAriaLabel('daily', point.date),
              onPointClick: (point) => {
                if (!point.originalDate) return;
                const date = parseLocalDateSafe(point.originalDate);
                if (date) {
                  void openReviewWidgetPeriod(plugin, 'daily', date);
                }
              },
            }
      }
    />
  );
};

export {};
