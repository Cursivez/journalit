

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
import { t } from '../../../lang/helpers';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';
import { getTradeAccountNames } from './shared/accountDisplay';
import { formatAccountTooltipSummary } from './shared/accountTooltipSummary';

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

  
  const trades = preview && previewData ? previewData.trades : cachedTrades;
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

  if (loading) {
    return (
      <div className="journalit-reviewv2-chart-container">
        <div className="journalit-reviewv2-chart-header">
          <div className="journalit-reviewv2-chart-title">
            {t('widget.trades-chart-quarterly.name')}
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
              <SkeletonBox width={24} height="45%" borderRadius="2px" />
              <SkeletonBox width={24} height="60%" borderRadius="2px" />
              <SkeletonBox width={24} height="35%" borderRadius="2px" />
              <SkeletonBox width={24} height="50%" borderRadius="2px" />
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
            {t('widget.trades-chart-quarterly.name')}
            <CurrencyConversionInfo metadata={currencyConversion} />
          </div>
        </div>
        <div className="journalit-reviewv2-chart-empty">
          {t('widget.empty.no-quarterly-data')}
        </div>
      </div>
    );
  }

  return (
    <div className="journalit-reviewv2-chart-container">
      <div className="journalit-reviewv2-chart-header">
        <div className="journalit-reviewv2-chart-title">
          {t('widget.trades-chart-quarterly.name')}
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
