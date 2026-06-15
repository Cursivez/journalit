

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import { SharedDailyPerformanceChart } from '../../charts';
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
import { SkeletonBox } from '../../shared';
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';
import { getTradeAccountNames } from './shared/accountDisplay';
import { formatAccountTooltipSummary } from './shared/accountTooltipSummary';

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

  if (loading) {
    return (
      <div className="journalit-reviewv2-chart-container">
        <div className="journalit-reviewv2-chart-header">
          <div className="journalit-reviewv2-chart-title">
            {t('widget.trades-chart-daily.name')}
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
              <SkeletonBox width={18} height="50%" borderRadius="2px" />
              <SkeletonBox width={18} height="20%" borderRadius="2px" />
            </div>
            
            <div className="journalit-reviewv2-chart-skeleton-xline" />
            
            <div className="journalit-reviewv2-chart-skeleton-xlabels">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonBox
                  key={i}
                  width={15}
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
            {t('widget.trades-chart-daily.name')}
            <CurrencyConversionInfo metadata={currencyConversion} />
          </div>
        </div>
        <div className="journalit-reviewv2-chart-empty">
          {t('widget.empty.no-daily-data')}
        </div>
      </div>
    );
  }

  return (
    <div className="journalit-reviewv2-chart-container">
      <div className="journalit-reviewv2-chart-header">
        <div className="journalit-reviewv2-chart-title">
          {t('widget.trades-chart-daily.name')}
          <CurrencyConversionInfo
            metadata={currencyConversion}
            trades={trades.filter((trade) => isPnlContributingTrade(trade))}
          />
        </div>
      </div>
      <div className="journalit-reviewv2-chart-body">
        <SharedDailyPerformanceChart
          data={chartData}
          height={height}
          currencyOverride={getSingleExplicitCurrency(trades)}
        />
      </div>
    </div>
  );
};

export {};
