import React from 'react';
import { AlertTriangle, BadgeCheck } from '../shared/icons/ObsidianIcon';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { t, tPlural } from '../../lang/helpers';
import { formatLocalizedMonth } from '../../utils/localizedDateTime';
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
import { getTradeImportTimeZone } from '../../services/tradeImport/timeZone';

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
  canCommit: boolean;
  classified: ClassifiedPreviewTrade[];
  freePreviewRequestsPerHour?: number;
  maxStoredPreviewItems?: number;
  importCompleted: boolean;
  isCheckingEntitlement: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onUpgrade: () => void;
  preview: TradeImportPreviewResponse;
}

interface TradeImportPreviewOverview {
  attentionCount: number;
  dateRange: string | null;
  duplicateCount: number;
  importableCount: number;
  symbolCount: number;
  tradeCount: number;
}

const MAX_RENDERED_PREVIEW_ROWS = 500;

function buildPreviewOverview(
  classified: ClassifiedPreviewTrade[],
  timeZone: string
): TradeImportPreviewOverview {
  let attentionCount = 0;
  let duplicateCount = 0;
  let importableCount = 0;
  let firstTimestamp = Number.POSITIVE_INFINITY;
  let lastTimestamp = Number.NEGATIVE_INFINITY;
  const symbols = new Set<string>();

  for (const item of classified) {
    if (isTradeImportCommitEligible(item.defaultAction)) importableCount += 1;
    if (isTradeImportSkipped(item.defaultAction)) duplicateCount += 1;
    if (isTradeImportBlocked(item.defaultAction)) attentionCount += 1;

    const timestamp = Date.parse(item.preview.entryTime);
    firstTimestamp = Math.min(firstTimestamp, timestamp);
    lastTimestamp = Math.max(lastTimestamp, timestamp);

    const symbol = item.preview.symbol.trim().toUpperCase();
    if (symbol) symbols.add(symbol);
  }

  let dateRange: string | null = null;

  if (Number.isFinite(firstTimestamp) && Number.isFinite(lastTimestamp)) {
    const start = formatLocalizedMonth(firstTimestamp, timeZone);
    const end = formatLocalizedMonth(lastTimestamp, timeZone);
    dateRange =
      start === end
        ? start
        : t('trade-import.preview.date-range', { start, end });
  }

  return {
    attentionCount,
    dateRange,
    duplicateCount,
    importableCount,
    symbolCount: symbols.size,
    tradeCount: classified.length,
  };
}

export const TradeImportPreviewReview: React.FC<
  TradeImportPreviewReviewProps
> = ({
  busy,
  canCommit,
  classified,
  freePreviewRequestsPerHour,
  maxStoredPreviewItems,
  importCompleted,
  isCheckingEntitlement,
  onCancel,
  onConfirm,
  onUpgrade,
  preview,
}) => {
  const timeZone = getTradeImportTimeZone();
  const overview = React.useMemo(
    () => buildPreviewOverview(classified, timeZone),
    [classified, timeZone]
  );
  const visibleClassified = classified.slice(0, MAX_RENDERED_PREVIEW_ROWS);
  const hasPreviewMessages = visibleClassified.some((item) => item.message);
  const confirmDisabled =
    busy ||
    isCheckingEntitlement ||
    importCompleted ||
    preview.outcome === 'failed' ||
    overview.importableCount < 1;

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
            {preview.outcome === 'failed'
              ? t('quick-import.summary.failed')
              : tPlural('trade-import.preview.found', overview.tradeCount)}
          </strong>
          {preview.outcome !== 'failed' && (
            <div className="journalit-trade-import-preview-overview-meta">
              {overview.dateRange && <span>{overview.dateRange}</span>}
              <span>
                {t('trade-import.preview.metric.symbols')}{' '}
                <strong>{String(overview.symbolCount)}</strong>
              </span>
            </div>
          )}
          {preview.outcome === 'partially_completed' && (
            <p>
              {t('trade-import.preview.partial.message', {
                count: String(overview.importableCount),
                failed: String(preview.summary.failedRowCount),
                incomplete: String(preview.summary.skippedIncompleteCount),
              })}
            </p>
          )}
          {preview.outcome === 'failed' && (
            <p>{t('trade-import.preview.failed.message')}</p>
          )}
          {preview.outcome === 'partially_completed' && (
            <p>{t('trade-import.preview.partial.guidance')}</p>
          )}
          {preview.outcome === 'failed' && (
            <p>{t('trade-import.preview.failed.guidance')}</p>
          )}
          {preview.outcome === 'completed' &&
            overview.importableCount === 0 && (
              <p>{t('trade-import.preview.no-eligible')}</p>
            )}
        </div>
      </div>

      {preview.outcome !== 'failed' && (
        <div className="journalit-trade-import-preview-counts">
          <span>{t('trade-import.preview.metric.ready')}</span>
          <strong>{String(overview.importableCount)}</strong>
          <span>{t('trade-import.preview.metric.duplicates')}</span>
          <strong>{String(overview.duplicateCount)}</strong>
          <span>{t('trade-import.preview.metric.attention')}</span>
          <strong>{String(overview.attentionCount)}</strong>
        </div>
      )}

      <TradeImportDiagnostics
        diagnostics={preview.diagnostics}
        defaultOpen={preview.outcome !== 'completed'}
        className="journalit-trade-import-preview-diagnostics"
      />

      {!canCommit && overview.importableCount > 0 && (
        <div className="journalit-trade-import-preview-upgrade">
          <strong>{t('trade-import.preview.upgrade.title')}</strong>
          <span>
            {tPlural(
              'trade-import.preview.upgrade.description',
              overview.importableCount
            )}
          </span>
          {freePreviewRequestsPerHour != null &&
            freePreviewRequestsPerHour > 0 && (
              <small>
                {t('trade-import.preview.upgrade.free-limit', {
                  count: String(freePreviewRequestsPerHour),
                })}
              </small>
            )}
          {maxStoredPreviewItems != null && maxStoredPreviewItems > 0 && (
            <small>
              {t('trade-import.preview.upgrade.free-storage-limit', {
                count: String(maxStoredPreviewItems),
              })}
            </small>
          )}
        </div>
      )}

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
          onClick={canCommit ? onConfirm : onUpgrade}
        >
          {canCommit
            ? t('trade-import.action.confirm')
            : overview.importableCount > 0
              ? tPlural(
                  'trade-import.action.activate-pro',
                  overview.importableCount
                )
              : t('premium.gate.cta.continue-pro')}
        </button>
      </div>
    </>
  );
};
