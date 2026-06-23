

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import type { Trade } from '../../utils/dataUtils';
import { calculateEffectiveRMultiple } from '../../../../utils/formatting';
import { usePlugin } from '../../../../hooks/usePlugin';
import { TradeFormModal } from '../../../forms/trade/TradeFormModal';
import { EmptyState } from '../../../shared/EmptyState';
import {
  getEffectivePnL,
  hasRealizedStoredPnL,
  isTradeOpenPreservingNullPnl,
} from '../../../../utils/tradeStatusUtils';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { useDisplayFormatter } from '../../../../hooks/useDisplayPolicy';
import { safeDateSort } from '../../../../utils/dateUtils';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsDate,
} from '../../../../utils/tradeAnalyticsDate';
import { getDisplayPnL, getAccountCount } from '../../../../utils/pnlUtils';
import { classifyPnLWithBreakEvenSettings } from '../../../../utils/breakEvenRange';
import { t } from '../../../../lang/helpers';
import type JournalitPlugin from '../../../../main';
import { getTradeDirectionDisplayLabel } from '../../../../utils/tradeDirectionDisplay';

type RecentTradeRow = {
  trade: Trade;
  analyticsDate: Date;
  realizedPnL: number | undefined;
};


const formatDate = (date: Date, plugin: JournalitPlugin | null): string => {
  try {
    
    const dateFormat = plugin?.settings?.trade?.dateFormat || 'MMDDYY';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const shortYear = year.slice(2);

    
    switch (dateFormat) {
      case 'DDMMYY':
        return `${day}/${month}/${shortYear}`;
      case 'MMDDYY':
        return `${month}/${day}/${shortYear}`;
      case 'YYMMDD':
        return `${shortYear}/${month}/${day}`;
      default:
        return date.toLocaleDateString();
    }
  } catch {
    
    return date.toLocaleDateString();
  }
};


export const RecentTradesWidget: React.FC<BaseWidgetProps> = ({ filters }) => {
  const plugin = usePlugin();
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
  const applyAccountCountMultiplier = false;
  const analyticsDateBasis = getAnalyticsDateBasis(plugin?.settings);

  
  const openTradeNote = (tradePath: string) => {
    if (plugin) {
      
      void plugin.openFile(tradePath.split('#')[0] ?? tradePath, true);
    }
  };

  return (
    <BaseWidget filters={filters} skeletonType="table">
      {(data) => {
        
        
        
        const hasRealizedEventRows =
          analyticsDateBasis === 'exit' &&
          data.realizedEventTrades !== undefined;
        const rowSourceTrades = hasRealizedEventRows
          ? data.realizedEventTrades!
          : data.trades;
        const recentTrades: RecentTradeRow[] = rowSourceTrades
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

        return (
          <div className="journalit-dashboard-recent-trades">
            <table className="journalit-dashboard-recent-trades-table">
              <thead>
                <tr>
                  <th>{t('widget.recentTrades.date')}</th>
                  <th>{t('widget.recentTrades.ticker')}</th>
                  <th>{t('widget.recentTrades.direction')}</th>
                  <th className="pnl-column">{t('widget.recentTrades.pnl')}</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
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

                            
                            const modal = new TradeFormModal({
                              app: plugin.app,
                              plugin,
                            });
                            modal.open();
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentTrades.map(({ trade, analyticsDate, realizedPnL }) => {
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
                        key={`${trade.path}-${analyticsDate.toISOString()}-${realizedPnL ?? 'trade'}`}
                        onClick={() => openTradeNote(trade.path)}
                        className={`trade-row${tradeIsOpen && !isRealizedEvent ? ' open-trade' : ''}`}
                      >
                        <td className="date-cell">
                          {formatDate(analyticsDate, plugin)}
                        </td>
                        <td className="ticker-cell">
                          {trade.instrument || t('widget.recentTrades.unknown')}
                        </td>
                        <td className="direction-cell">
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
                                    : trade.currency || currency;
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
