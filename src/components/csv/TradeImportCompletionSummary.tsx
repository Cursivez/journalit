import React from 'react';
import { AlertTriangle, BadgeCheck } from '../shared/icons/ObsidianIcon';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { t, tPlural } from '../../lang/helpers';
import type JournalitPlugin from '../../main';
import type { TradeImportCompletionResult } from '../../services/tradeImport/TradeImportWorkflowService';
import { formatDateDisplay } from '../../utils/dateUtils';

interface TradeImportCompletionSummaryProps {
  plugin: JournalitPlugin;
  result: TradeImportCompletionResult;
}

export const TradeImportCompletionSummary: React.FC<
  TradeImportCompletionSummaryProps
> = ({ plugin, result }) => {
  const { formatValue } = useDisplayFormatter();
  const title = result.success
    ? t('csv.results.history-ready')
    : result.failedCount > 0
      ? t('csv.results.failed')
      : t('csv.results.pending-title');
  let firstImportedAt = Number.POSITIVE_INFINITY;
  let lastImportedAt = Number.NEGATIVE_INFINITY;
  for (const trade of result.importedTrades) {
    const importedAt = Date.parse(trade.entryTime);
    if (!Number.isFinite(importedAt)) continue;
    firstImportedAt = Math.min(firstImportedAt, importedAt);
    lastImportedAt = Math.max(lastImportedAt, importedAt);
  }
  const hasImportedDateRange =
    Number.isFinite(firstImportedAt) && Number.isFinite(lastImportedAt);
  const firstImportedDate = hasImportedDateRange
    ? formatDateDisplay(
        new Date(firstImportedAt),
        plugin.settings.trade.dateFormat
      )
    : null;
  const lastImportedDate = hasImportedDateRange
    ? formatDateDisplay(
        new Date(lastImportedAt),
        plugin.settings.trade.dateFormat
      )
    : null;
  const importedDateRange =
    firstImportedDate && lastImportedDate
      ? firstImportedDate === lastImportedDate
        ? firstImportedDate
        : t('csv.results.history-date-range', {
            start: firstImportedDate,
            end: lastImportedDate,
          })
      : null;
  const importedSymbolCount = new Set(
    result.importedTrades.map((trade) => trade.symbol)
  ).size;

  return (
    <div className="journalit-trade-import-completion">
      <div role="status" aria-live="polite" aria-atomic="true">
        <h3>{title}</h3>
      </div>
      {result.writtenCount > 0 && importedDateRange && (
        <div className="journalit-trade-import-history-summary">
          <strong>
            {tPlural('csv.results.history-trades', result.writtenCount)}
          </strong>
          <span>{importedDateRange}</span>
          <span>
            {tPlural('csv.results.history-symbols', importedSymbolCount)}
          </span>
        </div>
      )}
      {result.writtenCount > 0 && (
        <div className="result-item result-success">
          <BadgeCheck className="result-icon" size={20} />
          <span className="result-text">
            {tPlural('csv.results.success', result.writtenCount, {
              account: result.accountName,
            })}
          </span>
        </div>
      )}
      {result.duplicateCount > 0 && (
        <div className="result-item result-warning">
          <AlertTriangle className="result-icon" size={20} />
          <span className="result-text">
            {tPlural('csv.results.skipped', result.duplicateCount)}
          </span>
        </div>
      )}
      {result.failedCount > 0 && (
        <div className="result-item result-warning">
          <AlertTriangle className="result-icon" size={20} />
          <span className="result-text">
            {t('csv.results.failed-to-import-prefix')}
            {result.failedCount}
            {t('csv.results.failed-to-import-suffix')}
          </span>
        </div>
      )}
      {result.pendingCount > 0 && (
        <div className="result-item result-warning">
          <AlertTriangle className="result-icon" size={20} />
          <span className="result-text">
            {t('csv.results.pending-local-writes', {
              count: String(result.pendingCount),
            })}
          </span>
        </div>
      )}
      <div className="result-item result-info">
        <span className="result-text result-text--muted">
          {t('csv.results.broker', { broker: result.brokerLabel })}
        </span>
      </div>
      {result.importedTrades.length > 0 && (
        <div className="imported-trades-preview">
          <div className="preview-header">
            {t('csv.results.preview-header', {
              shown: String(Math.min(5, result.importedTrades.length)),
              total: String(result.writtenCount),
            })}
          </div>
          <div className="csv-trades-list">
            <div className="csv-trade-preview-header" aria-hidden="true">
              <span>{t('trade-import.table.symbol')}</span>
              <span>{t('trade-import.table.date')}</span>
              <span>{t('trade-import.table.direction')}</span>
              <span>{t('trade-import.table.position')}</span>
              <span>{t('trade-import.table.result')}</span>
            </div>
            {result.importedTrades.slice(0, 5).map((trade) => (
              <button
                key={trade.filePath}
                type="button"
                className="csv-trade-preview-item journalit-csv-trade-preview-item"
                onClick={() => void plugin.openFile(trade.filePath, false)}
              >
                <span className="csv-trade-symbol">{trade.symbol}</span>
                <span className="csv-trade-date">
                  {formatDateDisplay(
                    trade.entryTime,
                    plugin.settings.trade.dateFormat
                  )}
                </span>
                <span className={`csv-trade-direction ${trade.direction}`}>
                  {trade.direction.toUpperCase()}
                </span>
                <span className="csv-trade-quantity">
                  {formatValue({
                    kind: 'positionSize',
                    value: trade.quantity,
                  })}{' '}
                  @{' '}
                  {formatValue({
                    kind: 'price',
                    value: trade.entryPrice,
                    currencyCode: plugin.settings.general?.currency,
                  })}
                </span>
                <span
                  className={`csv-trade-status ${trade.status.toLowerCase()}`}
                >
                  {typeof trade.profitLoss === 'number' &&
                  trade.profitLoss !== 0
                    ? formatValue({
                        kind: 'pnl',
                        value: trade.profitLoss,
                        currencyCode: plugin.settings.general?.currency,
                      })
                    : trade.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {result.writtenCount > 0 && (
        <p className="journalit-trade-import-enrichment-note">
          {t('csv.results.enrichment-note')}
        </p>
      )}
    </div>
  );
};
