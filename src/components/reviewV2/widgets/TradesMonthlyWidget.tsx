

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import { SharedDailyPerformanceChart } from '../../charts';
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
import { SkeletonBox } from '../../shared';
import { hasTranslation, t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';
import { getTradeAccountNames } from './shared/accountDisplay';
import { formatAccountTooltipSummary } from './shared/accountTooltipSummary';

interface TradesMonthlyWidgetConfig {
  height?: number;
}

const EMPTY_TRADES_MONTHLY_CONFIG: TradesMonthlyWidgetConfig = {};

interface TradesMonthlyWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: TradesMonthlyWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface MonthlyDataPoint {
  date: string; 
  originalDate?: string;
  pnl: number;
  fill: string;
  trades: number;
  rMultiple?: number;
  accountSummary?: string;
}


const getMonthName = (monthIndex: number): string => {
  const key = `widget.header.month.${monthIndex}`;
  return hasTranslation(key) ? t(key) : key;
};

export const TradesMonthlyWidget: React.FC<TradesMonthlyWidgetProps> = ({
  filePath,
  plugin,
  config = EMPTY_TRADES_MONTHLY_CONFIG,
  preview = false,
  previewData,
}) => {
  
  const {
    analyticsBasisTrades: cachedTrades,
    loading: cacheLoading,
    noteType,
    currencyConversion,
  } = useReviewTrades(filePath, plugin);

  
  const trades = preview && previewData ? previewData.trades : cachedTrades;
  const loading = preview ? false : cacheLoading;

  const height = config.height ?? 250;

  
  const applyAccountCountMultiplier = false;
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

  
  const chartData: MonthlyDataPoint[] = useMemo(() => {
    if (trades.length === 0) return [];

    
    const monthlyMap = new Map<
      string,
      {
        pnl: number;
        tradeIds: Set<string>;
        rMultiple: number;
        month: number;
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

      const pnlEvents = realizedEvents.length
        ? realizedEvents
        : [{ tradingDay: analyticsDate as Date, pnl: getEffectivePnL(trade) }];
      const accountCount = getAccountCount(trade);
      const tradeKey =
        trade.tradeId ?? trade.id ?? trade.path ?? `trade-${tradeIndex}`;

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
        const month = event.tradingDay.getMonth(); 
        const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`; 
        const existing = monthlyMap.get(monthKey) || {
          pnl: 0,
          tradeIds: new Set<string>(),
          rMultiple: 0,
          month,
          accounts: new Set<string>(),
        };
        existing.pnl += getDisplayPnL(
          event.pnl,
          accountCount,
          applyAccountCountMultiplier
        );
        if (tradeKey) {
          existing.tradeIds.add(tradeKey);
        }
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
        monthlyMap.set(monthKey, existing);
      }
    }

    
    const result: MonthlyDataPoint[] = [];
    const sortedKeys = Array.from(monthlyMap.keys()).sort();

    for (const monthKey of sortedKeys) {
      const data = monthlyMap.get(monthKey)!;
      result.push({
        date: getMonthName(data.month),
        originalDate: monthKey,
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
    noteType === 'monthly-review'
  ) {
    return (
      <InvalidContextMessage
        widgetType={t('widget.trades-chart-monthly.name')}
        reason={t('widget.invalid-context.quarterly-yearly')}
      />
    );
  }

  if (loading) {
    return (
      <div className="journalit-reviewv2-chart-container">
        <div className="journalit-reviewv2-chart-header">
          <div className="journalit-reviewv2-chart-title">
            {t('widget.trades-chart-monthly.name')}
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
            </div>
            
            <div className="journalit-reviewv2-chart-skeleton-xline" />
            
            <div className="journalit-reviewv2-chart-skeleton-xlabels">
              {Array.from({ length: 6 }).map((_, i) => (
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
            {t('widget.trades-chart-monthly.name')}
            <CurrencyConversionInfo metadata={currencyConversion} />
          </div>
        </div>
        <div className="journalit-reviewv2-chart-empty">
          {t('widget.empty.no-monthly-data')}
        </div>
      </div>
    );
  }

  return (
    <div className="journalit-reviewv2-chart-container">
      <div className="journalit-reviewv2-chart-header">
        <div className="journalit-reviewv2-chart-title">
          {t('widget.trades-chart-monthly.name')}
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
