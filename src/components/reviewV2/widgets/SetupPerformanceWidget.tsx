

import React, { useState, useMemo, useCallback } from 'react';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { SharedSetupPerformanceChart } from '../../charts/SharedSetupPerformanceChart';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { CurrencyCode } from '../../../utils/currencyConfig';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { getDisplayPnL, getAccountCount } from '../../../utils/pnlUtils';
import type { SetupPerformanceDataPoint } from '../../charts/SharedSetupPerformanceChart';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { useEventBus } from '../../../hooks';
import { SkeletonBox } from '../../shared';
import { getBreakEvenBalanceForDisplayTrade } from './shared/breakEvenDisplayUtils';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';
import { splitReviewTradeByRealizedPnlEvent } from '../utils/reviewTradeDates';

type ReviewSetupTrade = Record<string, unknown> & {
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
  setup?: string | string[];
  rMultiple?: number;
  riskAmount?: number;
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceTotal?: number;
};

function asReviewSetupTrades(value: unknown): ReviewSetupTrade[] {
  return Array.isArray(value)
    ? value.filter((item): item is ReviewSetupTrade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];
}

function getTradeSetups(trade: ReviewSetupTrade): string[] {
  return Array.isArray(trade.setup)
    ? trade.setup.filter((setup): setup is string => typeof setup === 'string')
    : typeof trade.setup === 'string'
      ? [trade.setup]
      : [t('common.other')];
}

interface SetupPerformanceWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: SetupPerformanceWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

export interface SetupPerformanceWidgetConfig {
  showChart?: boolean; 
  showTable?: boolean; 
  topN?: number; 
  sortBy?: 'pnl' | 'winRate' | 'tradeCount'; 
  height?: number; 
}

const DEFAULT_CONFIG: SetupPerformanceWidgetConfig = {
  showChart: true,
  showTable: true,
  topN: undefined, 
  sortBy: 'pnl',
  height: 250,
};

export const SetupPerformanceWidget: React.FC<SetupPerformanceWidgetProps> =
  React.memo(
    ({ filePath, plugin, config = {}, preview = false, previewData }) => {
      const mergedConfig = { ...DEFAULT_CONFIG, ...config };

      
      const {
        trades: cachedTrades,
        loading: cacheLoading,
        currencyConversion,
      } = useReviewTrades(filePath, plugin);

      
      const trades = asReviewSetupTrades(
        preview && previewData ? previewData.trades : cachedTrades
      );
      const loading = preview ? false : cacheLoading;

      
      const [, setSettingsVersion] = useState(0);

      useEventBus(
        'settings:changed',
        useCallback(() => {
          setSettingsVersion((v) => v + 1);
        }, []),
        !preview
      );

      const { formatValue, shouldMask } = useDisplayFormatter();
      const isPnlMasked = shouldMask('pnl');
      const isMetricMasked = shouldMask('metric');
      const applyAccountCountMultiplier = false;
      const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
      const breakEvenThresholdMode =
        plugin?.settings?.trade?.breakEvenThresholdMode;
      const breakEvenThresholdPercent =
        plugin?.settings?.trade?.breakEvenThresholdPercent;
      const breakEvenRangeMin = plugin?.settings?.trade?.breakEvenRangeMin;
      const breakEvenRangeMax = plugin?.settings?.trade?.breakEvenRangeMax;

      
      const setupPerformance = useMemo(() => {
        const closedTrades = asReviewSetupTrades(
          trades
            .filter((t) => isPnlContributingTrade(t))
            .flatMap((trade) =>
              preview
                ? [trade]
                : splitReviewTradeByRealizedPnlEvent(trade, plugin)
            )
        );

        if (closedTrades.length === 0) {
          return [];
        }

        
        const setupMap = new Map<
          string,
          {
            pnl: number;
            wins: number;
            losses: number;
            tradeCount: number;
            totalRMultiple: number;
            grossProfit: number;
            grossLoss: number;
          }
        >();

        closedTrades.forEach((trade) => {
          
          const accountCount = getAccountCount(trade);
          const displayPnL = getDisplayPnL(
            getEffectivePnL(trade),
            accountCount,
            applyAccountCountMultiplier
          );

          const setups = getTradeSetups(trade);
          setups.forEach((setup: string) => {
            const existing = setupMap.get(setup) || {
              pnl: 0,
              wins: 0,
              losses: 0,
              tradeCount: 0,
              totalRMultiple: 0,
              grossProfit: 0,
              grossLoss: 0,
            };
            existing.pnl += displayPnL || 0;
            existing.tradeCount += 1;
            const breakEvenBalanceForDisplay =
              getBreakEvenBalanceForDisplayTrade(
                trade,
                applyAccountCountMultiplier
              );

            const outcome = classifyPnLWithBreakEvenSettings(
              displayPnL,
              {
                breakEvenRangeMin,
                breakEvenRangeMax,
                breakEvenThresholdMode,
                breakEvenThresholdPercent,
              },
              breakEvenBalanceForDisplay
            );

            if (outcome === 'win') {
              existing.wins += 1;
              existing.grossProfit += displayPnL;
            } else if (outcome === 'loss') {
              existing.losses += 1;
              existing.grossLoss += Math.abs(displayPnL);
            }

            
            const effectiveR = calculateEffectiveRMultiple(
              getEffectivePnL(trade),
              trade.rMultiple,
              trade.riskAmount,
              defaultRiskAmount
            );
            if (effectiveR !== undefined && !isNaN(effectiveR)) {
              existing.totalRMultiple += effectiveR;
            }

            setupMap.set(setup, existing);
          });
        });

        const setupData: SetupPerformanceDataPoint[] = Array.from(
          setupMap.entries()
        ).map(([name, data]) => {
          
          const decidedTrades = data.wins + data.losses;
          return {
            name,
            pnl: data.pnl,
            winRate: decidedTrades > 0 ? (data.wins / decidedTrades) * 100 : 0,
            tradeCount: data.tradeCount,
            totalRMultiple: data.totalRMultiple,
            profitFactor:
              data.grossLoss > 0
                ? data.grossProfit / data.grossLoss
                : data.grossProfit > 0
                  ? Infinity
                  : 0,
          };
        });

        
        switch (mergedConfig.sortBy) {
          case 'winRate':
            setupData.sort((a, b) => b.winRate - a.winRate);
            break;
          case 'tradeCount':
            setupData.sort((a, b) => b.tradeCount - a.tradeCount);
            break;
          case 'pnl':
          default:
            setupData.sort((a, b) => b.pnl - a.pnl);
            break;
        }

        return setupData;
      }, [
        trades,
        defaultRiskAmount,
        applyAccountCountMultiplier,
        breakEvenThresholdMode,
        breakEvenThresholdPercent,
        breakEvenRangeMin,
        breakEvenRangeMax,
        preview,
        plugin,
        mergedConfig.sortBy,
      ]);

      const tableContainerClassName = mergedConfig.showChart
        ? 'journalit-reviewv2-table-container journalit-reviewv2-table-container--chart'
        : 'journalit-reviewv2-table-container';

      if (loading) {
        return (
          <div className="journalit-reviewv2-chart-container">
            <div className="journalit-reviewv2-chart-header">
              <div className="journalit-reviewv2-chart-title">
                {t('widget.setup-performance.name')}
              </div>
            </div>
            <div className="journalit-reviewv2-chart-body journalit-reviewv2-chart-body--compact">
              
              {mergedConfig.showChart && (
                <div
                  className="journalit-reviewv2-chart-skeleton"
                  style={cssVars({
                    '--reviewv2-chart-height': `${mergedConfig.height}px`,
                    '--reviewv2-chart-bar-gap': '8px',
                  })}
                >
                  
                  <div className="journalit-reviewv2-chart-skeleton-axis">
                    <SkeletonBox width={30} height={10} borderRadius="4px" />
                    <SkeletonBox width={25} height={10} borderRadius="4px" />
                    <SkeletonBox width={28} height={10} borderRadius="4px" />
                  </div>
                  
                  <div className="journalit-reviewv2-chart-skeleton-bars">
                    <SkeletonBox width={28} height="70%" borderRadius="2px" />
                    <SkeletonBox width={28} height="45%" borderRadius="2px" />
                    <SkeletonBox width={28} height="60%" borderRadius="2px" />
                    <SkeletonBox width={28} height="30%" borderRadius="2px" />
                    <SkeletonBox width={28} height="50%" borderRadius="2px" />
                  </div>
                  
                  <div className="journalit-reviewv2-chart-skeleton-xline" />
                  
                  <div className="journalit-reviewv2-chart-skeleton-xlabels">
                    {['one', 'two', 'three', 'four', 'five'].map((key) => (
                      <SkeletonBox
                        key={key}
                        width={40}
                        height={10}
                        borderRadius="4px"
                      />
                    ))}
                  </div>
                </div>
              )}

              
              {mergedConfig.showTable && (
                <div className={tableContainerClassName}>
                  <table className="journalit-reviewv2-table">
                    <thead>
                      <tr>
                        <th className="journalit-reviewv2-table-header-cell">
                          {t('widget.table.header.setup')}
                        </th>
                        <th className="journalit-reviewv2-table-header-cell">
                          {t('widget.table.header.trades')}
                        </th>
                        <th className="journalit-reviewv2-table-header-cell">
                          {t('widget.table.header.pnl')}
                        </th>
                        <th className="journalit-reviewv2-table-header-cell">
                          {t('widget.table.header.win-rate')}
                        </th>
                        <th className="journalit-reviewv2-table-header-cell">
                          {t('widget.table.header.profit-factor')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {['first', 'second', 'third', 'fourth'].map((key) => (
                        <tr key={key}>
                          <td className="journalit-reviewv2-table-cell">
                            <SkeletonBox
                              width={70}
                              height={14}
                              borderRadius="4px"
                            />
                          </td>
                          <td className="journalit-reviewv2-table-cell">
                            <SkeletonBox
                              width={25}
                              height={14}
                              borderRadius="4px"
                            />
                          </td>
                          <td className="journalit-reviewv2-table-cell">
                            <SkeletonBox
                              width={55}
                              height={14}
                              borderRadius="4px"
                            />
                          </td>
                          <td className="journalit-reviewv2-table-cell">
                            <SkeletonBox
                              width={40}
                              height={14}
                              borderRadius="4px"
                            />
                          </td>
                          <td className="journalit-reviewv2-table-cell">
                            <SkeletonBox
                              width={30}
                              height={14}
                              borderRadius="4px"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      }

      if (setupPerformance.length === 0) {
        return (
          <div className="journalit-reviewv2-chart-container">
            <div className="journalit-reviewv2-chart-header">
              <div className="journalit-reviewv2-chart-title">
                {t('widget.setup-performance.name')}
              </div>
            </div>
            <div className="journalit-reviewv2-chart-empty">
              {t('widget.empty.no-setup-data')}
            </div>
          </div>
        );
      }

      const currency =
        getSingleExplicitCurrency(trades) ||
        plugin?.settings?.general?.currency ||
        CurrencyCode.USD;
      const topSetups =
        mergedConfig.showTable && mergedConfig.topN
          ? setupPerformance.slice(0, mergedConfig.topN)
          : setupPerformance;

      return (
        <div className="journalit-reviewv2-chart-container">
          <div className="journalit-reviewv2-chart-header">
            <div className="journalit-reviewv2-chart-title">
              {t('widget.setup-performance.name')}
              <CurrencyConversionInfo metadata={currencyConversion} />
            </div>
          </div>

          <div className="journalit-reviewv2-chart-body journalit-reviewv2-chart-body--compact">
            {mergedConfig.showChart && (
              <div
                className="journalit-reviewv2-chart-frame"
                style={cssVars({
                  '--reviewv2-chart-height': `${mergedConfig.height}px`,
                })}
              >
                <SharedSetupPerformanceChart
                  data={setupPerformance}
                  height={mergedConfig.height}
                  currencyOverride={currency}
                  plugin={plugin}
                />
              </div>
            )}

            {mergedConfig.showTable && (
              <div className={tableContainerClassName}>
                <table className="journalit-reviewv2-table">
                  <thead>
                    <tr>
                      <th className="journalit-reviewv2-table-header-cell">
                        {t('widget.table.header.setup')}
                      </th>
                      <th className="journalit-reviewv2-table-header-cell">
                        {t('widget.table.header.trades')}
                      </th>
                      <th className="journalit-reviewv2-table-header-cell">
                        {t('widget.table.header.pnl')}
                      </th>
                      <th className="journalit-reviewv2-table-header-cell">
                        {t('widget.table.header.win-rate')}
                      </th>
                      <th className="journalit-reviewv2-table-header-cell">
                        {t('widget.table.header.profit-factor')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSetups.map((setup) => (
                      <tr key={setup.name}>
                        <td className="journalit-reviewv2-table-cell">
                          {setup.name}
                        </td>
                        <td className="journalit-reviewv2-table-cell">
                          {setup.tradeCount}
                        </td>
                        <td
                          className={`journalit-reviewv2-table-cell journalit-reviewv2-table-cell--emphasis ${
                            isPnlMasked
                              ? ''
                              : setup.pnl >= 0
                                ? 'journalit-reviewv2-table-cell--positive'
                                : 'journalit-reviewv2-table-cell--negative'
                          }`}
                        >
                          {formatValue({
                            kind: 'pnl',
                            value: setup.pnl,
                            currencyCode: currency,
                            rMultiple: setup.totalRMultiple,
                          })}
                        </td>
                        <td className="journalit-reviewv2-table-cell">
                          {formatValue({
                            kind: 'returnPercent',
                            value: setup.winRate,
                            signed: false,
                            precision: 1,
                          })}
                        </td>
                        <td
                          className={`journalit-reviewv2-table-cell journalit-reviewv2-table-cell--emphasis ${
                            isMetricMasked
                              ? ''
                              : (setup.profitFactor ?? 0) >= 1
                                ? 'journalit-reviewv2-table-cell--positive'
                                : 'journalit-reviewv2-table-cell--negative'
                          }`}
                        >
                          {setup.profitFactor === Infinity && !isMetricMasked
                            ? '∞'
                            : !setup.profitFactor
                              ? '-'
                              : formatValue({
                                  kind: 'metric',
                                  value: setup.profitFactor,
                                  precision: 2,
                                })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }
  );

SetupPerformanceWidget.displayName = 'SetupPerformanceWidget';
