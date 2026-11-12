

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import type { Trade } from '../../utils/dataUtils';
import { calculateEffectiveRMultiple } from '../../../../utils/formatting';
import { usePlugin } from '../../../../hooks/usePlugin';
import { TradeFormDrawer } from '../../../forms/trade/TradeFormDrawer';
import { EmptyState } from '../../../shared/EmptyState';
import {
  getEffectivePnL,
  hasRealizedStoredPnL,
  isTradeOpenPreservingNullPnl,
} from '../../../../utils/tradeStatusUtils';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { formatDateDisplay, safeDateSort } from '../../../../utils/dateUtils';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsDate,
} from '../../../../utils/tradeAnalyticsDate';
import { getDisplayPnL, getAccountCount } from '../../../../utils/pnlUtils';
import { classifyPnLWithBreakEvenSettings } from '../../../../utils/breakEvenRange';
import { t } from '../../../../lang/helpers';
import { getTradeDirectionDisplayLabel } from '../../../../utils/tradeDirectionDisplay';
import { getTradeNotePath } from '../../../../utils/chartUtils';

type RecentTradeRow = {
  trade: Trade;
  analyticsDate: Date;
  realizedPnL: number | undefined;
  
  inA?: boolean;
  inB?: boolean;
};

const recentRowKey = (row: RecentTradeRow) =>
  `${row.trade.path}-${row.analyticsDate.toISOString()}-${row.realizedPnL ?? 'trade'}`;


const MembershipDots: React.FC<{ inA: boolean; inB: boolean }> = ({
  inA,
  inB,
}) => {
  const label = [
    inA ? t('dashboard.compare.filter-side', { side: 'A' }) : null,
    inB ? t('dashboard.compare.filter-side', { side: 'B' }) : null,
  ]
    .filter(Boolean)
    .join(', ');
  return (
    <span className="journalit-compare-dots" role="img" aria-label={label}>
      <span
        className={`journalit-compare-dot journalit-compare-dot--a${inA ? '' : ' is-empty'}`}
      />
      <span
        className={`journalit-compare-dot journalit-compare-dot--b${inB ? '' : ' is-empty'}`}
      />
    </span>
  );
};


const RecentTradesWidgetComponent: React.FC<BaseWidgetProps> = () => {
  const plugin = usePlugin();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
  const applyAccountCountMultiplier = false;
  const analyticsDateBasis = getAnalyticsDateBasis(plugin?.settings);

  
  const openTradeNote = (tradePath: string) => {
    if (plugin) {
      
      void plugin.openFile(getTradeNotePath(tradePath), true);
    }
  };

  return (
    <BaseWidget skeletonType="table">
      {(data, _dateFormat, _filters, compare) => {
        
        
        
        const recentRows = (source: typeof data): RecentTradeRow[] => {
          const hasRealizedEventRows =
            analyticsDateBasis === 'exit' &&
            source.realizedEventTrades !== undefined;
          const rowSourceTrades = hasRealizedEventRows
            ? source.realizedEventTrades!
            : source.trades;
          return rowSourceTrades
            .flatMap((trade) => {
              const analyticsDate = hasRealizedEventRows
                ? ((trade.exitTime as Date | null | undefined) ?? null)
                : getTradeAnalyticsDate(trade, analyticsDateBasis);
              if (analyticsDate === null) {
                return [];
              }
              return [
                {
                  trade,
                  analyticsDate,
                  realizedPnL: hasRealizedEventRows
                    ? getEffectivePnL(trade)
                    : undefined,
                },
              ];
            })
            .sort((a, b) => safeDateSort(b.analyticsDate, a.analyticsDate))
            .slice(0, 10); 
        };
        const aRows = recentRows(data);
        
        
        const recentTrades: RecentTradeRow[] = compare
          ? (() => {
              const bKeys = new Set(recentRows(compare.data).map(recentRowKey));
              const aKeys = new Set(aRows.map(recentRowKey));
              const merged = new Map<string, RecentTradeRow>();
              for (const row of [...aRows, ...recentRows(compare.data)]) {
                const key = recentRowKey(row);
                if (!merged.has(key)) {
                  merged.set(key, {
                    ...row,
                    inA: aKeys.has(key),
                    inB: bKeys.has(key),
                  });
                }
              }
              return Array.from(merged.values())
                .sort((a, b) => safeDateSort(b.analyticsDate, a.analyticsDate))
                .slice(0, 10);
            })()
          : aRows;
        const comparing = compare !== null;
        const columnCount = comparing ? 5 : 4;

        return (
          <div className="journalit-dashboard-recent-trades">
            
            <table
              role="table"
              className={`journalit-dashboard-recent-trades-table${comparing ? ' journalit-dashboard-recent-trades-table--compare' : ''}`}
            >
              <thead role="rowgroup">
                <tr role="row">
                  {comparing && (
                    <th
                      role="columnheader"
                      scope="col"
                      className="journalit-compare-dots-column"
                    >
                      <span className="journalit-sr-only">
                        {t('dashboard.compare.in-filters')}
                      </span>
                    </th>
                  )}
                  <th role="columnheader" scope="col">
                    {t('widget.recentTrades.date')}
                  </th>
                  <th role="columnheader" scope="col">
                    {t('widget.recentTrades.ticker')}
                  </th>
                  <th role="columnheader" scope="col">
                    {t('widget.recentTrades.direction')}
                  </th>
                  <th role="columnheader" scope="col" className="pnl-column">
                    {t('widget.recentTrades.pnl')}
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {recentTrades.length === 0 ? (
                  <tr role="row">
                    <td
                      role="cell"
                      colSpan={columnCount}
                      aria-colspan={columnCount}
                      className="journalit-dashboard-recent-trades-empty-cell"
                    >
                      <div className="journalit-dashboard-recent-trades-empty-wrapper">
                        <EmptyState
                          message={t('widget.recentTrades.no-trades')}
                          subMessage={t('widget.recentTrades.empty-submessage')}
                          iconSize={32}
                          actionButtonText={t('button.add-trade')}
                          onActionButtonClick={() => {
                            
                            if (!plugin || !plugin.app) return;

                            
                            const drawer = new TradeFormDrawer({
                              app: plugin.app,
                              plugin,
                            });
                            drawer.open();
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentTrades.map((row) => {
                    const { trade, analyticsDate, realizedPnL } = row;
                    const tradeIsOpen = isTradeOpenPreservingNullPnl({
                      tradeStatus: trade.tradeStatus,
                      exitTime: trade.exitTime,
                      pnl: trade.pnl,
                      useDirectPnLInput: trade.useDirectPnLInput,
                      exits: trade.exits,
                      entries: trade.entries,
                      _originalPnlWasNull: trade._originalPnlWasNull,
                    });

                    
                    const basePnL = realizedPnL ?? getEffectivePnL(trade);
                    const accountCount = getAccountCount(trade);
                    const displayPnL = getDisplayPnL(
                      basePnL,
                      accountCount,
                      applyAccountCountMultiplier
                    );

                    const breakEvenBalanceForDisplay =
                      applyAccountCountMultiplier
                        ? (trade.breakEvenAccountCurrentBalanceTotal ??
                          trade.breakEvenAccountCurrentBalance)
                        : trade.breakEvenAccountCurrentBalance;

                    const outcome = classifyPnLWithBreakEvenSettings(
                      displayPnL,
                      plugin?.settings?.trade,
                      breakEvenBalanceForDisplay
                    );
                    const isRealizedEvent = realizedPnL !== undefined;
                    const isPositive =
                      !isPnlMasked &&
                      (!tradeIsOpen || isRealizedEvent) &&
                      outcome === 'win';
                    const isNegative =
                      !isPnlMasked &&
                      (!tradeIsOpen || isRealizedEvent) &&
                      outcome === 'loss';

                    return (
                      <tr
                        role="row"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            event.currentTarget.click();
                          }
                        }}
                        key={recentRowKey(row)}
                        onClick={() => openTradeNote(trade.path)}
                        className={`trade-row${tradeIsOpen && !isRealizedEvent ? ' open-trade' : ''}`}
                      >
                        {comparing && (
                          <td
                            role="cell"
                            className="journalit-compare-dots-column"
                          >
                            <MembershipDots
                              inA={row.inA ?? false}
                              inB={row.inB ?? false}
                            />
                          </td>
                        )}
                        <td role="cell" className="date-cell">
                          {formatDateDisplay(analyticsDate)}
                        </td>
                        <td role="cell" className="ticker-cell">
                          {trade.instrument || t('widget.recentTrades.unknown')}
                        </td>
                        <td role="cell" className="direction-cell">
                          {getTradeDirectionDisplayLabel(
                            {
                              direction: trade.direction,
                              assetType: trade.assetType,
                              optionType: trade.optionType,
                            },
                            t('widget.recentTrades.unknown')
                          )}
                        </td>
                        <td
                          role="cell"
                          className={`pnl-cell ${tradeIsOpen && !isRealizedEvent ? 'open' : isPositive ? 'positive' : isNegative ? 'negative' : ''}`}
                        >
                          {tradeIsOpen &&
                          !isRealizedEvent &&
                          !hasRealizedStoredPnL(trade)
                            ? t('tradelog.status.open')
                            : (() => {
                                const effectiveRMultiple =
                                  calculateEffectiveRMultiple(
                                    displayPnL,
                                    tradeIsOpen || isRealizedEvent
                                      ? undefined
                                      : trade.rMultiple,
                                    trade.riskAmount,
                                    defaultRiskAmount
                                  );
                                
                                const displayCurrency =
                                  data.metrics.isMultiCurrency &&
                                  data.metrics.conversionBaseCurrency
                                    ? data.metrics.conversionBaseCurrency
                                    : trade.currency || data.currency;
                                return formatValue({
                                  kind: 'pnl',
                                  value: displayPnL,
                                  currencyCode: displayCurrency,
                                  rMultiple: effectiveRMultiple,
                                });
                              })()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        );
      }}
    </BaseWidget>
  );
};


export const RecentTradesWidget = React.memo(RecentTradesWidgetComponent);
