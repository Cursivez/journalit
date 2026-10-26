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

function ResultItem({
  tone,
  children,
}: {
  tone: 'success' | 'warning';
  children: React.ReactNode;
}) {
  const Icon = tone === 'success' ? BadgeCheck : AlertTriangle;
  return (
    <div className={`result-item result-${tone}`}>
      <Icon className="result-icon" size={20} />
      <span className="result-text">{children}</span>
    </div>
  );
}

interface CompletionFollowUp {
  key: string;
  tone: 'success' | 'warning';
  text: React.ReactNode;
}


function completionFollowUps(
  result: TradeImportCompletionResult
): CompletionFollowUp[] {
  const rows: CompletionFollowUp[] = [];
  if (result.attachedImageCount > 0)
    rows.push({
      key: 'screenshots-added',
      tone: 'success',
      text: t('trade-import.completion.screenshots-added', {
        count: String(result.attachedImageCount),
      }),
    });
  if (result.failedImageCount > 0)
    rows.push({
      key: 'screenshots-failed',
      tone: 'warning',
      text: t('trade-import.completion.screenshots-failed', {
        count: String(result.failedImageCount),
      }),
    });
  if (result.duplicateCount > 0)
    rows.push({
      key: 'skipped',
      tone: 'warning',
      text: tPlural('csv.results.skipped', result.duplicateCount),
    });
  if (result.failedCount > 0)
    rows.push({
      key: 'failed',
      tone: 'warning',
      text: (
        <>
          {t('csv.results.failed-to-import-prefix')}
          {result.failedCount}
          {t('csv.results.failed-to-import-suffix')}
        </>
      ),
    });
  if (result.pendingCount > 0)
    rows.push({
      key: 'pending',
      tone: 'warning',
      text: t('csv.results.pending-local-writes', {
        count: String(result.pendingCount),
      }),
    });
  return rows;
}


const completionLiveRegion = (
  headingId: string | undefined,
  operationResult: TradeOperationResult | null
) =>
  headingId && !operationResult
    ? {
        role: 'status',
        'aria-labelledby': headingId,
        'aria-live': 'polite' as const,
        'aria-atomic': 'true' as const,
      }
    : {};

function ImportCompletionBody({
  result,
  headingId,
}: {
  result: TradeImportCompletionResult;
  headingId: string | undefined;
}) {
  return (
    <>
      {!headingId && (
        <div role="status" aria-live="polite" aria-atomic="true">
          <h3>{resolveCompletionTitle(result)}</h3>
        </div>
      )}
      {result.writtenCount > 0 && (
        <ResultItem tone="success">
          {tPlural('csv.results.success', result.writtenCount, {
            account: result.accountName,
          })}
        </ResultItem>
      )}
      <div className="result-item result-info">
        <span className="result-text result-text--muted">
          {t('csv.results.broker', { broker: result.brokerLabel })}
        </span>
      </div>
    </>
  );
}

export const TradeImportCompletionSummary: React.FC<
  TradeImportCompletionSummaryProps
> = ({ plugin, result, operationResult, headingId }) => (
  <div
    className="journalit-trade-import-completion"
    {...completionLiveRegion(headingId, operationResult)}
  >
    {operationResult ? (
      <TradeOperationResultCard
        plugin={plugin}
        result={operationResult}
        presentation="inline"
        externalHeadingId={headingId}
      />
    ) : (
      <ImportCompletionBody result={result} headingId={headingId} />
    )}
    {completionFollowUps(result).map((row) => (
      <ResultItem key={row.key} tone={row.tone}>
        {row.text}
      </ResultItem>
    ))}
  </div>
);
