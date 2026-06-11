

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import JournalitPlugin from '../../../main';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { t } from '../../../lang/helpers';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { getSingleExplicitCurrency } from '../../../utils/currencyAggregation';
import { SkeletonBox } from '../../shared';
import { Tooltip } from '../../shared/Tooltip';
import {
  getTradeAccountNames,
  UNKNOWN_ACCOUNT_LABEL,
} from './shared/accountDisplay';
import { splitReviewTradeByRealizedPnlEvent } from '../utils/reviewTradeDates';

interface AccountBreakdownWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface AccountBreakdownRow {
  account: string;
  trades: number;
  pnl: number;
  wins: number;
  losses: number;
  grossProfit: number;
  grossLoss: number;
}

interface AccountBreakdownAccumulator {
  account: string;
  pnl: number;
  tradePnls: Map<string, { pnl: number; breakEvenBalance?: number }>;
}

const calculateWinRate = (row: AccountBreakdownRow): number | null => {
  const decisiveTrades = row.wins + row.losses;
  return decisiveTrades > 0 ? (row.wins / decisiveTrades) * 100 : null;
};

const calculateProfitFactor = (row: AccountBreakdownRow): number | null => {
  if (row.grossLoss === 0) {
    return row.grossProfit > 0 ? Infinity : null;
  }

  return row.grossProfit / row.grossLoss;
};

const AccountNameCell = React.memo<{ account: string }>(({ account }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node) return undefined;

    const updateTruncation = () => {
      setIsTruncated(node.scrollWidth > node.clientWidth + 1);
    };

    updateTruncation();

    const ResizeObserverCtor = node.ownerDocument.defaultView?.ResizeObserver;
    if (!ResizeObserverCtor) return undefined;

    const observer = new ResizeObserverCtor(updateTruncation);
    observer.observe(node);
    const cell = node.closest('td');
    if (cell) observer.observe(cell);
    return () => observer.disconnect();
  }, [account]);

  return (
    <Tooltip
      content={account}
      delay={0}
      disabled={!isTruncated}
      instantHide={true}
      preferredPosition="top"
      triggerClassName="journalit-reviewv2-account-breakdown-account-trigger"
      className="journalit-reviewv2-entry-tooltip"
    >
      <span
        ref={textRef}
        className="journalit-reviewv2-account-breakdown-account-text"
      >
        {account}
      </span>
    </Tooltip>
  );
});

AccountNameCell.displayName = 'AccountNameCell';

export const AccountBreakdownWidget: React.FC<AccountBreakdownWidgetProps> =
  React.memo(({ filePath, plugin, preview = false, previewData }) => {
    const { trades: cachedTrades, loading: cacheLoading } = useReviewTrades(
      filePath,
      plugin
    );
    const trades = preview && previewData ? previewData.trades : cachedTrades;
    const loading = preview ? false : cacheLoading;
    const { formatValue, shouldMask } = useDisplayFormatter();
    const isPnlMasked = shouldMask('pnl');
    const isMetricMasked = shouldMask('metric');
    const currencyOverride = getSingleExplicitCurrency(trades);
    const breakEvenSettings = plugin?.settings?.trade;

    const rows = useMemo(() => {
      const accountLookup = new Map<string, AccountBreakdownAccumulator>();

      for (const [tradeIndex, sourceTrade] of trades
        .filter((item) => isPnlContributingTrade(item))
        .entries()) {
        const tradeKey = String(
          sourceTrade.tradeId ??
            sourceTrade.id ??
            sourceTrade.path ??
            `trade-${tradeIndex}`
        );
        const pnlScopedTrades = preview
          ? [sourceTrade]
          : splitReviewTradeByRealizedPnlEvent(sourceTrade, plugin);

        for (const trade of pnlScopedTrades) {
          const accountNames = getTradeAccountNames(trade);
          const accounts =
            accountNames.length > 0 ? accountNames : [UNKNOWN_ACCOUNT_LABEL];
          const pnl = getEffectivePnL(trade);
          const breakEvenBalance =
            typeof (trade as Record<string, unknown>)
              .breakEvenAccountCurrentBalance === 'number'
              ? ((trade as Record<string, unknown>)
                  .breakEvenAccountCurrentBalance as number)
              : undefined;

          for (const account of accounts) {
            const row = accountLookup.get(account) ?? {
              account,
              pnl: 0,
              tradePnls: new Map<
                string,
                { pnl: number; breakEvenBalance?: number }
              >(),
            };

            row.pnl += pnl;
            const tradePnl = row.tradePnls.get(tradeKey) ?? {
              pnl: 0,
              breakEvenBalance,
            };
            tradePnl.pnl += pnl;
            tradePnl.breakEvenBalance ??= breakEvenBalance;
            row.tradePnls.set(tradeKey, tradePnl);
            accountLookup.set(account, row);
          }
        }
      }

      const rows = Array.from(accountLookup.values()).map((accountData) => {
        const row: AccountBreakdownRow = {
          account: accountData.account,
          trades: accountData.tradePnls.size,
          pnl: accountData.pnl,
          wins: 0,
          losses: 0,
          grossProfit: 0,
          grossLoss: 0,
        };

        for (const tradePnl of accountData.tradePnls.values()) {
          const outcome = classifyPnLWithBreakEvenSettings(
            tradePnl.pnl,
            breakEvenSettings,
            tradePnl.breakEvenBalance
          );

          if (outcome === 'win') {
            row.wins += 1;
            row.grossProfit += Math.max(tradePnl.pnl, 0);
          } else if (outcome === 'loss') {
            row.losses += 1;
            row.grossLoss += Math.abs(Math.min(tradePnl.pnl, 0));
          }
        }

        return row;
      });
      return rows.sort((a, b) => b.pnl - a.pnl);
    }, [breakEvenSettings, plugin, preview, trades]);

    if (loading) {
      return (
        <div className="journalit-reviewv2-table-wrapper">
          <table className="journalit-reviewv2-table">
            <tbody>
              {Array.from({ length: 3 }).map((_, index) => (
                <tr
                  key={index}
                  className="journalit-reviewv2-table-row journalit-reviewv2-table-row--static"
                >
                  <td className="journalit-reviewv2-table-cell">
                    <SkeletonBox width={110} height={16} borderRadius="4px" />
                  </td>
                  <td className="journalit-reviewv2-table-cell">
                    <SkeletonBox width={45} height={16} borderRadius="4px" />
                  </td>
                  <td className="journalit-reviewv2-table-cell">
                    <SkeletonBox width={70} height={16} borderRadius="4px" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (rows.length === 0) {
      return (
        <div className="journalit-reviewv2-empty">
          {t('widget.account-breakdown.empty')}
        </div>
      );
    }

    return (
      <div className="journalit-reviewv2-table-wrapper">
        <table className="journalit-reviewv2-table">
          <thead>
            <tr>
              <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-align-left">
                {t('widget.account-breakdown.column.account')}
              </th>
              <th className="journalit-reviewv2-table-header-cell">
                {t('widget.account-breakdown.column.trades')}
              </th>
              <th className="journalit-reviewv2-table-header-cell">
                {t('widget.account-breakdown.column.pnl')}
              </th>
              <th className="journalit-reviewv2-table-header-cell">
                {t('widget.account-breakdown.column.win-rate')}
              </th>
              <th className="journalit-reviewv2-table-header-cell">
                {t('widget.account-breakdown.column.profit-factor')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const winRate = calculateWinRate(row);
              const profitFactor = calculateProfitFactor(row);
              const pnlToneClass = isPnlMasked
                ? ''
                : row.pnl > 0
                  ? 'journalit-reviewv2-table-cell--positive'
                  : row.pnl < 0
                    ? 'journalit-reviewv2-table-cell--negative'
                    : 'journalit-reviewv2-table-cell--muted';
              const profitFactorToneClass =
                isMetricMasked || profitFactor === null
                  ? ''
                  : profitFactor >= 1
                    ? 'journalit-reviewv2-table-cell--positive'
                    : 'journalit-reviewv2-table-cell--negative';

              return (
                <tr
                  key={row.account}
                  className="journalit-reviewv2-table-row journalit-reviewv2-table-row--static"
                >
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-align-left journalit-reviewv2-table-cell--emphasis journalit-reviewv2-account-breakdown-account-cell">
                    <AccountNameCell account={row.account} />
                  </td>
                  <td className="journalit-reviewv2-table-cell">
                    {row.trades}
                  </td>
                  <td
                    className={`journalit-reviewv2-table-cell journalit-reviewv2-table-cell--emphasis ${pnlToneClass}`.trim()}
                  >
                    {formatValue({
                      kind: 'pnl',
                      value: row.pnl,
                      currencyCode: currencyOverride,
                    })}
                  </td>
                  <td className="journalit-reviewv2-table-cell">
                    {winRate === null
                      ? '—'
                      : formatValue({
                          kind: 'returnPercent',
                          value: winRate,
                          signed: false,
                          precision: 1,
                        })}
                  </td>
                  <td
                    className={`journalit-reviewv2-table-cell journalit-reviewv2-table-cell--emphasis ${profitFactorToneClass}`.trim()}
                  >
                    {profitFactor === null
                      ? '—'
                      : profitFactor === Infinity
                        ? isMetricMasked
                          ? formatValue({ kind: 'metric', value: 1 })
                          : '∞'
                        : formatValue({
                            kind: 'metric',
                            value: profitFactor,
                            precision: 2,
                          })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  });

AccountBreakdownWidget.displayName = 'AccountBreakdownWidget';
