import React from 'react';
import { AlertTriangle, BadgeCheck } from '../shared/icons/ObsidianIcon';
import { t, tPlural } from '../../lang/helpers';
import type JournalitPlugin from '../../main';
import type { TradeImportCompletionResult } from '../../services/tradeImport/TradeImportWorkflowService';
import type { TradeOperationResult } from '../../services/tradeOperations/types';
import {
  getTradeOperationResultTitle,
  TradeOperationResultCard,
} from '../tradeOperations/TradeOperationResultCard';

interface TradeImportCompletionSummaryProps {
  plugin: JournalitPlugin;
  result: TradeImportCompletionResult;
  operationResult: TradeOperationResult | null;
  headingId?: string;
}

function resolveCompletionTitle(result: TradeImportCompletionResult): string {
  if (result.pendingCount > 0) return t('csv.results.pending-title');
  const hasImportedOrExistingTrades =
    result.writtenCount > 0 || result.duplicateCount > 0;
  if (result.failedCount > 0 && hasImportedOrExistingTrades) {
    return t('csv.results.completed-with-issues');
  }
  if (result.success || hasImportedOrExistingTrades) {
    return t('csv.results.history-ready');
  }
  return t('csv.results.failed');
}

export function getTradeImportCompletionTitle(
  result: TradeImportCompletionResult,
  operationResult: TradeOperationResult | null
): string {
  return operationResult
    ? getTradeOperationResultTitle(operationResult)
    : resolveCompletionTitle(result);
}

export const TradeImportCompletionSummary: React.FC<
  TradeImportCompletionSummaryProps
> = ({ plugin, result, operationResult, headingId }) => {
  const fallbackTitle = headingId ? '' : resolveCompletionTitle(result);

  return (
    <div
      className="journalit-trade-import-completion"
      role={headingId && !operationResult ? 'status' : undefined}
      aria-labelledby={headingId && !operationResult ? headingId : undefined}
      aria-live={headingId && !operationResult ? 'polite' : undefined}
      aria-atomic={headingId && !operationResult ? 'true' : undefined}
    >
      {operationResult ? (
        <TradeOperationResultCard
          plugin={plugin}
          result={operationResult}
          presentation="inline"
          externalHeadingId={headingId}
        />
      ) : (
        <>
          {!headingId && (
            <div role="status" aria-live="polite" aria-atomic="true">
              <h3>{fallbackTitle}</h3>
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
          <div className="result-item result-info">
            <span className="result-text result-text--muted">
              {t('csv.results.broker', { broker: result.brokerLabel })}
            </span>
          </div>
        </>
      )}
      {result.attachedImageCount > 0 && (
        <div className="result-item result-success">
          <BadgeCheck className="result-icon" size={20} />
          <span className="result-text">
            {t('trade-import.completion.screenshots-added', {
              count: String(result.attachedImageCount),
            })}
          </span>
        </div>
      )}
      {result.failedImageCount > 0 && (
        <div className="result-item result-warning">
          <AlertTriangle className="result-icon" size={20} />
          <span className="result-text">
            {t('trade-import.completion.screenshots-failed', {
              count: String(result.failedImageCount),
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
    </div>
  );
};
