

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
import {
  getTradeSetupGroups,
  getTradeTagGroups,
} from '../../../utils/tradeGrouping';

type ReviewGroupedTrade = Record<string, unknown> & {
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
  tags?: string[];
  customTags?: string[];
  rMultiple?: number;
  riskAmount?: number;
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceTotal?: number;
};

function asReviewGroupedTrades(value: unknown): ReviewGroupedTrade[] {
  return Array.isArray(value)
    ? value.filter((item): item is ReviewGroupedTrade =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];
}

type GroupedPerformanceKind = 'setup' | 'tag';

export interface GroupedPerformanceWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: GroupedPerformanceWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
  kind: GroupedPerformanceKind;
}

export interface GroupedPerformanceWidgetConfig {
  showChart?: boolean; 
  showTable?: boolean; 
  topN?: number; 
  sortBy?: 'pnl' | 'winRate' | 'tradeCount'; 
  height?: number; 
}

const getDefaultConfig = (
  kind: GroupedPerformanceKind
): GroupedPerformanceWidgetConfig => ({
  showChart: true,
  showTable: true,
  topN: kind === 'tag' ? 10 : undefined,
  sortBy: 'pnl',
  height: 250,
});

const getWidgetTitle = (kind: GroupedPerformanceKind): string =>
  kind === 'setup'
    ? t('widget.setup-performance.name')
    : t('widget.tag-performance.name');

const getEmptyMessage = (kind: GroupedPerformanceKind): string =>
  kind === 'setup'
    ? t('widget.empty.no-setup-data')
    : t('widget.empty.no-tag-data');

const getColumnHeader = (kind: GroupedPerformanceKind): string =>
  kind === 'setup'
    ? t('widget.table.header.setup')
    : t('widget.table.header.tag');

const getTradeGroups = (
  trade: ReviewGroupedTrade,
  kind: GroupedPerformanceKind
): string[] => {
  if (kind === 'tag') {
    return getTradeTagGroups(trade);
  }

  if (trade.setup === undefined || trade.setup === null) {
    return [t('common.other')];
  }

  return getTradeSetupGroups({
    setup: Array.isArray(trade.setup) ? trade.setup : [trade.setup],
  });
};

interface BuildGroupedPerformanceOptions {
  kind: GroupedPerformanceKind;
  defaultRiskAmount?: number;
  applyAccountCountMultiplier: boolean;
  breakEvenRangeMin?: number;
  breakEvenRangeMax?: number;
  breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
  breakEvenThresholdPercent?: number;
  sortBy: NonNullable<GroupedPerformanceWidgetConfig['sortBy']>;
}

export const buildGroupedPerformanceData = (
  trades: readonly ReviewGroupedTrade[],
  options: BuildGroupedPerformanceOptions
): SetupPerformanceDataPoint[] => {
  const groupMap = new Map<
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

  for (const trade of trades) {
    const displayPnL = getDisplayPnL(
      getEffectivePnL(trade),
      getAccountCount(trade),
      options.applyAccountCountMultiplier
    );
    const groups = getTradeGroups(trade, options.kind);

    for (const group of groups) {
      const existing = groupMap.get(group) ?? {
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

      const outcome = classifyPnLWithBreakEvenSettings(
        displayPnL,
        {
          breakEvenRangeMin: options.breakEvenRangeMin,
          breakEvenRangeMax: options.breakEvenRangeMax,
          breakEvenThresholdMode: options.breakEvenThresholdMode,
          breakEvenThresholdPercent: options.breakEvenThresholdPercent,
        },
        getBreakEvenBalanceForDisplayTrade(
          trade,
          options.applyAccountCountMultiplier
        )
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
        options.defaultRiskAmount
      );
      if (effectiveR !== undefined && Number.isFinite(effectiveR)) {
        existing.totalRMultiple += effectiveR;
      }

      groupMap.set(group, existing);
    }
  }

  const groupedData = Array.from(groupMap.entries(), ([name, data]) => {
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

  switch (options.sortBy) {
    case 'winRate':
      groupedData.sort((a, b) => b.winRate - a.winRate);
      break;
    case 'tradeCount':
      groupedData.sort((a, b) => b.tradeCount - a.tradeCount);
      break;
    case 'pnl':
      groupedData.sort((a, b) => b.pnl - a.pnl);
      break;
    default:
      groupedData.sort((a, b) => b.pnl - a.pnl);
      break;
  }

  return groupedData;
};

export const selectGroupedPerformanceRows = (
  data: readonly SetupPerformanceDataPoint[],
  kind: GroupedPerformanceKind,
  topN: number | undefined,
  maskTagIdentities = false
): {
  chartRows: SetupPerformanceDataPoint[];
  tableRows: SetupPerformanceDataPoint[];
} => {
  const tableRows = topN ? data.slice(0, topN) : [...data];
  const presentationRows =
    kind === 'tag' && maskTagIdentities
      ? tableRows.map((row, index) => ({
          ...row,
          name: `${t('widget.table.header.tag')} ${index + 1}`,
        }))
      : tableRows;
  return {
    chartRows: kind === 'tag' ? presentationRows : [...data],
    tableRows: presentationRows,
  };
};

export const formatGroupedProfitFactor = (
  profitFactor: number | undefined,
  isMasked: boolean,
  formatMetric: (value: number) => string
): string => {
  const value = profitFactor ?? 0;
  if (isMasked) return formatMetric(value);
  if (value === Infinity) return '∞';
  if (!value) return '-';
  return formatMetric(value);
};

const GroupedPerformanceTableHead: React.FC<{ columnHeader: string }> = ({
  columnHeader,
}) => (
  <thead>
    <tr>
      <th className="journalit-reviewv2-table-header-cell">{columnHeader}</th>
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
);

export const GroupedPerformanceWidget: React.FC<GroupedPerformanceWidgetProps> =
  React.memo(
    ({ filePath, plugin, config = {}, preview = false, previewData, kind }) => {
      const mergedConfig = { ...getDefaultConfig(kind), ...config };
      const widgetTitle = getWidgetTitle(kind);
      const columnHeader = getColumnHeader(kind);

      
      const {
        trades: cachedTrades,
        loading: cacheLoading,
        currencyConversion,
      } = useReviewTrades(filePath, plugin);

      
      const trades = asReviewGroupedTrades(
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
      const isWinRateMasked = shouldMask('returnPercent');
      const maskTagIdentities =
        kind === 'tag' && (isPnlMasked || isMetricMasked || isWinRateMasked);
      const applyAccountCountMultiplier = false;
      const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
      const breakEvenThresholdMode =
        plugin?.settings?.trade?.breakEvenThresholdMode;
      const breakEvenThresholdPercent =
        plugin?.settings?.trade?.breakEvenThresholdPercent;
      const breakEvenRangeMin = plugin?.settings?.trade?.breakEvenRangeMin;
      const breakEvenRangeMax = plugin?.settings?.trade?.breakEvenRangeMax;

      
      const groupedPerformance = useMemo(() => {
        const closedTrades = asReviewGroupedTrades(
          trades.flatMap((trade) =>
            isPnlContributingTrade(trade)
              ? preview
                ? [trade]
                : splitReviewTradeByRealizedPnlEvent(trade, plugin)
              : []
          )
        );

        return buildGroupedPerformanceData(closedTrades, {
          kind,
          defaultRiskAmount,
          applyAccountCountMultiplier,
          breakEvenRangeMin,
          breakEvenRangeMax,
          breakEvenThresholdMode,
          breakEvenThresholdPercent,
          sortBy: mergedConfig.sortBy ?? 'pnl',
        });
      }, [
        trades,
        preview,
        plugin,
        kind,
        defaultRiskAmount,
        applyAccountCountMultiplier,
        breakEvenRangeMin,
        breakEvenRangeMax,
        breakEvenThresholdMode,
        breakEvenThresholdPercent,
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
                {widgetTitle}
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
                    <GroupedPerformanceTableHead columnHeader={columnHeader} />
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

      if (groupedPerformance.length === 0) {
        return (
          <div className="journalit-reviewv2-chart-container">
            <div className="journalit-reviewv2-chart-header">
              <div className="journalit-reviewv2-chart-title">
                {widgetTitle}
              </div>
            </div>
            <div className="journalit-reviewv2-chart-empty">
              {getEmptyMessage(kind)}
            </div>
          </div>
        );
      }

      const currency =
        getSingleExplicitCurrency(trades) ||
        plugin?.settings?.general?.currency ||
        CurrencyCode.USD;
      const { chartRows, tableRows } = selectGroupedPerformanceRows(
        groupedPerformance,
        kind,
        mergedConfig.topN,
        maskTagIdentities
      );

      return (
        <div className="journalit-reviewv2-chart-container">
          <div className="journalit-reviewv2-chart-header">
            <div className="journalit-reviewv2-chart-title">
              {widgetTitle}
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
                  data={chartRows}
                  height={mergedConfig.height}
                  currencyOverride={currency}
                  plugin={plugin}
                />
              </div>
            )}

            {mergedConfig.showTable && (
              <div className={tableContainerClassName}>
                <table className="journalit-reviewv2-table">
                  <GroupedPerformanceTableHead columnHeader={columnHeader} />
                  <tbody>
                    {tableRows.map((row) => (
                      <tr key={row.name}>
                        <td className="journalit-reviewv2-table-cell">
                          {row.name}
                        </td>
                        <td className="journalit-reviewv2-table-cell">
                          {row.tradeCount}
                        </td>
                        <td
                          className={`journalit-reviewv2-table-cell journalit-reviewv2-table-cell--emphasis ${
                            isPnlMasked
                              ? ''
                              : row.pnl >= 0
                                ? 'journalit-reviewv2-table-cell--positive'
                                : 'journalit-reviewv2-table-cell--negative'
                          }`}
                        >
                          {formatValue({
                            kind: 'pnl',
                            value: row.pnl,
                            currencyCode: currency,
                            rMultiple: row.totalRMultiple,
                          })}
                        </td>
                        <td className="journalit-reviewv2-table-cell">
                          {formatValue({
                            kind: 'returnPercent',
                            value: row.winRate,
                            signed: false,
                            precision: 1,
                          })}
                        </td>
                        <td
                          className={`journalit-reviewv2-table-cell journalit-reviewv2-table-cell--emphasis ${
                            isMetricMasked
                              ? ''
                              : (row.profitFactor ?? 0) >= 1
                                ? 'journalit-reviewv2-table-cell--positive'
                                : 'journalit-reviewv2-table-cell--negative'
                          }`}
                        >
                          {formatGroupedProfitFactor(
                            row.profitFactor,
                            isMetricMasked,
                            (value) =>
                              formatValue({
                                kind: 'metric',
                                value,
                                precision: 2,
                              })
                          )}
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

GroupedPerformanceWidget.displayName = 'GroupedPerformanceWidget';
