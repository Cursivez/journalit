

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import {
  PeriodPerformanceChartCard,
  type PeriodBarSkeletonShape,
} from './shared/PeriodPerformanceChartCard';
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
import { t } from '../../../lang/helpers';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { getTradeAccountNames } from './shared/accountDisplay';
import { formatAccountTooltipSummary } from './shared/accountTooltipSummary';
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

interface TradesQuarterlyWidgetConfig {
  height?: number;
}

const EMPTY_TRADES_QUARTERLY_CONFIG: TradesQuarterlyWidgetConfig = {};

interface TradesQuarterlyWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: TradesQuarterlyWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface QuarterlyDataPoint {
  date: string; 
  originalDate?: string;
  pnl: number;
  fill: string;
  trades: number;
  rMultiple?: number;
  accountSummary?: string;
}


function getQuarter(month: number): number {
  return Math.floor(month / 3) + 1;
}

function getQuarterStartDate(quarterKey: string): Date | null {
  const match = /^(\d{4})-Q([1-4])$/.exec(quarterKey);
  if (!match) return null;
  return new Date(Number(match[1]), (Number(match[2]) - 1) * 3, 1);
}

const CHART_SKELETON: PeriodBarSkeletonShape = {
  barWidth: 24,
  barHeights: ['45%', '60%', '35%', '50%'],
  labelCount: 4,
  labelWidth: 20,
};

export const TradesQuarterlyWidget: React.FC<TradesQuarterlyWidgetProps> = ({
  filePath,
  plugin,
  config = EMPTY_TRADES_QUARTERLY_CONFIG,
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

  
  const chartData: QuarterlyDataPoint[] = useMemo(() => {
    if (trades.length === 0) return [];

    
    const quarterlyMap = new Map<
      string,
      {
        pnl: number;
        tradeIds: Set<string>;
        rMultiple: number;
        quarter: number;
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

        const year = event.tradingDay.getFullYear();
        const quarter = getQuarter(event.tradingDay.getMonth());
        const quarterKey = `${year}-Q${quarter}`;
        const existing = quarterlyMap.get(quarterKey) || {
          pnl: 0,
          tradeIds: new Set<string>(),
          rMultiple: 0,
          quarter,
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
        quarterlyMap.set(quarterKey, existing);
      }
    }

    
    const result: QuarterlyDataPoint[] = [];
    const sortedKeys = Array.from(quarterlyMap.keys()).sort();

    for (const quarterKey of sortedKeys) {
      const data = quarterlyMap.get(quarterKey)!;
      result.push({
        date: `Q${data.quarter}`,
        originalDate: quarterKey,
        pnl: data.pnl,
        fill: data.pnl >= 0 ? 'var(--chart-positive)' : 'var(--chart-negative)',
        trades: data.tradeIds.size,
        rMultiple: data.rMultiple,
        accountSummary: formatAccountTooltipSummary(data.accounts),
      });
    }

    return result;
  }, [trades, applyAccountCountMultiplier, defaultRiskAmount, plugin]);

  
  if (
    noteType === 'drc' ||
    noteType === 'weekly-review' ||
    noteType === 'monthly-review' ||
    noteType === 'quarterly-review'
  ) {
    return (
      <InvalidContextMessage
        widgetType={t('widget.trades-chart-quarterly.name')}
        reason={t('widget.invalid-context.yearly-only')}
      />
    );
  }

  return (
    <PeriodPerformanceChartCard
      title={t('widget.trades-chart-quarterly.name')}
      emptyMessage={t('widget.empty.no-quarterly-data')}
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
                getReviewWidgetPeriodAriaLabel('quarterly', point.date),
              onPointClick: (point) => {
                if (!point.originalDate) return;
                const date = getQuarterStartDate(point.originalDate);
                if (date) {
                  void openReviewWidgetPeriod(plugin, 'quarterly', date);
                }
              },
            }
      }
    />
  );
};

export {};
