import React from 'react';
import { AlertTriangle, BadgeCheck } from '../shared/icons/ObsidianIcon';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { t } from '../../lang/helpers';
import {
  isTradeImportBlocked,
  isTradeImportCommitEligible,
  isTradeImportSkipped,
} from '../../services/tradeImport/commitEligibility';
import type {
  ClassifiedPreviewTrade,
  TradeImportDiagnostic,
  TradeImportPreviewResponse,
} from '../../services/tradeImport/types';

interface GroupedTradeImportDiagnostic {
  affectedRowCount?: number;
  key: string;
  message: string;
  rows: number[];
  severity: NonNullable<TradeImportDiagnostic['severity']>;
}

interface TradeImportDiagnosticsProps {
  className?: string;
  defaultOpen: boolean;
  diagnostics: TradeImportDiagnostic[];
}

function groupTradeImportDiagnostics(
  diagnostics: TradeImportDiagnostic[]
): GroupedTradeImportDiagnostic[] {
  const groups = new Map<
    string,
    {
      message: string;
      rows: Map<number, number>;
      severity: NonNullable<TradeImportDiagnostic['severity']>;
    }
  >();

  for (const diagnostic of diagnostics) {
    const key = JSON.stringify([
      diagnostic.severity ?? '',
      diagnostic.kind ?? '',
      diagnostic.code,
      diagnostic.field ?? '',
      diagnostic.message,
    ]);
    const group = groups.get(key) ?? {
      message: diagnostic.message,
      rows: new Map<number, number>(),
      severity: diagnostic.severity ?? 'info',
    };
    const reportedCount = Math.max(1, diagnostic.count ?? 1);

    if (typeof diagnostic.row === 'number') {
      group.rows.set(
        diagnostic.row,
        Math.max(group.rows.get(diagnostic.row) ?? 0, reportedCount)
      );
    }
    groups.set(key, group);
  }

  return Array.from(groups, ([key, group]) => ({
    affectedRowCount:
      group.rows.size > 0
        ? Array.from(group.rows.values()).reduce(
            (total, count) => total + count,
            0
          )
        : undefined,
    key,
    message: group.message,
    rows: Array.from(group.rows.keys()).sort((left, right) => left - right),
    severity: group.severity,
  }));
}

function diagnosticSeverityLabel(
  severity: NonNullable<TradeImportDiagnostic['severity']>
): string {
  switch (severity) {
    case 'error':
      return t('common.error');
    case 'warning':
      return t('common.warning');
    case 'info':
      return t('common.info');
  }
}

export const TradeImportDiagnostics: React.FC<TradeImportDiagnosticsProps> = ({
  className,
  defaultOpen,
  diagnostics,
}) => {
  const groupedDiagnostics = groupTradeImportDiagnostics(diagnostics);
  if (groupedDiagnostics.length === 0) return null;

  return (
    <CollapsibleSection
      title={t('trade-import.preview.diagnostics', {
        count: String(groupedDiagnostics.length),
      })}
      defaultOpen={defaultOpen}
      className={className}
    >
      <ul className="journalit-trade-import-diagnostics">
        {groupedDiagnostics.map((diagnostic) => (
          <li key={diagnostic.key}>
            <div className="journalit-trade-import-diagnostic-summary">
              <span>
                <strong
                  className={`journalit-trade-import-diagnostic-severity journalit-trade-import-diagnostic-severity--${diagnostic.severity}`}
                >
                  {diagnosticSeverityLabel(diagnostic.severity)}
                </strong>
                {diagnostic.message}
              </span>
              {diagnostic.affectedRowCount !== undefined && (
                <strong>
                  {t('trade-import.preview.affected-rows', {
                    count: String(diagnostic.affectedRowCount),
                  })}
                </strong>
              )}
            </div>
            {diagnostic.rows.length > 0 && (
              <span className="journalit-trade-import-diagnostic-rows">
                {t('csv.errors.rows', {
                  rows: diagnostic.rows.join(', '),
                })}
              </span>
            )}
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );
};

interface TradeImportPreviewReviewProps {
  busy: boolean;
  classified: ClassifiedPreviewTrade[];
  importCompleted: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  preview: TradeImportPreviewResponse;
  visibleClassified: ClassifiedPreviewTrade[];
}

export const TradeImportPreviewReview: React.FC<
  TradeImportPreviewReviewProps
> = ({
  busy,
  classified,
  importCompleted,
  onCancel,
  onConfirm,
  preview,
  visibleClassified,
}) => {
  const importableCount = classified.filter((item) =>
    isTradeImportCommitEligible(item.defaultAction)
  ).length;
  const duplicateCount = classified.filter((item) =>
    isTradeImportSkipped(item.defaultAction)
  ).length;
  const blockedCount = classified.filter((item) =>
    isTradeImportBlocked(item.defaultAction)
  ).length;
  const hasPreviewMessages = visibleClassified.some((item) => item.message);
  const confirmDisabled =
    busy ||
    importCompleted ||
    preview.outcome === 'failed' ||
    importableCount < 1;

  return (
    <>
      <div
        className={`journalit-trade-import-outcome journalit-trade-import-outcome--${preview.outcome}`}
      >
        {preview.outcome === 'completed' ? (
          <BadgeCheck size={20} />
        ) : (
          <AlertTriangle size={20} />
        )}
        <div>
          <strong>
            {preview.outcome === 'completed'
              ? t('quick-import.summary.title')
              : preview.outcome === 'partially_completed'
                ? t('quick-import.summary.failed')
                : t('quick-import.summary.failed')}
          </strong>
          <p>
            {preview.outcome === 'completed'
              ? t('trade-import.preview.completed.message', {
                  count: String(importableCount),
                })
              : preview.outcome === 'partially_completed'
                ? t('trade-import.preview.partial.message', {
                    count: String(importableCount),
                    failed: String(preview.summary.failedRowCount),
                    incomplete: String(preview.summary.skippedIncompleteCount),
                  })
                : t('trade-import.preview.failed.message')}
          </p>
          {preview.outcome === 'partially_completed' && (
            <p>{t('trade-import.preview.partial.guidance')}</p>
          )}
          {preview.outcome === 'failed' && (
            <p>{t('trade-import.preview.failed.guidance')}</p>
          )}
          {preview.outcome === 'completed' && importableCount === 0 && (
            <p>{t('trade-import.preview.no-eligible')}</p>
          )}
        </div>
      </div>

      <div className="journalit-trade-import-preview-counts">
        <span>{t('quick-import.summary.to-import')}</span>
        <strong>{String(importableCount)}</strong>
        <span>{t('quick-import.summary.duplicates')}</span>
        <strong>{String(duplicateCount)}</strong>
        <span>{t('quick-import.summary.failed')}</span>
        <strong>{String(blockedCount)}</strong>
      </div>

      <TradeImportDiagnostics
        diagnostics={preview.diagnostics}
        defaultOpen={preview.outcome !== 'completed'}
        className="journalit-trade-import-preview-diagnostics"
      />

      {visibleClassified.length > 0 && (
        <div className="csv-preview-table-wrapper">
          <table className="csv-preview-table">
            <thead>
              <tr>
                <th>{t('trade-import.table.status')}</th>
                <th>{t('trade-import.table.symbol')}</th>
                <th>{t('trade-import.table.direction')}</th>
                <th>{t('trade-import.table.entry-time')}</th>
                <th>{t('trade-import.table.quantity')}</th>
                {hasPreviewMessages && (
                  <th>{t('trade-import.table.message')}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {visibleClassified.map((item) => (
                <tr key={item.itemId}>
                  <td>{item.classification}</td>
                  <td>{item.preview.symbol}</td>
                  <td>{item.preview.direction}</td>
                  <td>{item.preview.entryTime}</td>
                  <td>{item.preview.quantity}</td>
                  {hasPreviewMessages && <td>{item.message ?? ''}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="journalit-trade-import-actions">
        <button
          className="journalit-trade-import-cancel-preview-button"
          disabled={busy || importCompleted}
          onClick={onCancel}
        >
          {t('trade-import.action.cancel-preview')}
        </button>
        <button
          className="journalit-trade-import-confirm-button"
          disabled={confirmDisabled}
          onClick={onConfirm}
        >
          {t('trade-import.action.confirm')}
        </button>
      </div>
    </>
  );
};
