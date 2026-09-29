import React from 'react';
import { AlertTriangle, BadgeCheck } from '../shared/icons/ObsidianIcon';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { t, tPlural } from '../../lang/helpers';
import { formatLocalizedMonth } from '../../utils/localizedDateTime';
import {
  canImportTradeAnyway,
  isTradeImportCommitEligible,
  isTradeImportDuplicate,
  needsTradeImportAttention,
} from '../../services/tradeImport/commitEligibility';
import {
  type ClassifiedPreviewTrade,
  type TradeImportDiagnostic,
  type TradeImportPreviewResponse,
} from '../../services/tradeImport/types';
import { getTradeImportTimeZone } from '../../services/tradeImport/timeZone';
import type { SubscriptionTierRefreshStatus } from '../../services/backend/SubscriptionTierService';
import { resolveBrokerImportRecovery } from './brokerImportRecovery';
import { formatTradeImportPreviewDateTime } from './tradeImportPreviewDate';
import { workbookImageCountForImport } from '../../services/tradeImport/workbookImages';
import { tradeImportClassificationLabel } from '../../services/tradeImport/classificationLabels';
import { TradeImportProGate } from './TradeImportProGate';
import { TradeImportPnlCell } from './TradeImportPnlCell';
import { TradeImportDateOrderQuestion } from './TradeImportDateOrderQuestion';
import {
  DATE_FORMAT_DIAGNOSTIC_CODES,
  DATE_ORDER_DIAGNOSTIC_CODES,
} from './dateOrderQuestion';
import type { BreakEvenRangeSettings } from '../../utils/breakEvenRange';

interface GroupedTradeImportDiagnostic {
  affectedRowCount?: number;
  code: string;
  field?: string;
  key: string;
  message: string;
  rows: number[];
  severity: NonNullable<TradeImportDiagnostic['severity']>;
}


export interface TradeImportDiagnosticMappingActions {
  columnsForField: (field: string) => readonly string[];
  isRequiredField: (field: string) => boolean;
  onUnmapField: (field: string) => void;
  onEditMapping: () => void;
}

interface TradeImportDiagnosticsProps {
  className?: string;
  defaultOpen: boolean;
  diagnostics: TradeImportDiagnostic[];
  mappingActions?: TradeImportDiagnosticMappingActions;
}

function groupTradeImportDiagnostics(
  diagnostics: TradeImportDiagnostic[]
): GroupedTradeImportDiagnostic[] {
  const groups = new Map<
    string,
    {
      code: string;
      field?: string;
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
      code: diagnostic.code,
      field: diagnostic.field,
      message: diagnostic.message,
      rows: new Map<number, number>(),
      severity: diagnostic.severity ?? 'info',
    };
    const reportedCount = Math.max(1, diagnostic.count ?? 1);

    
    const row = diagnostic.sheetRow ?? diagnostic.row;
    if (typeof row === 'number') {
      group.rows.set(row, Math.max(group.rows.get(row) ?? 0, reportedCount));
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
    code: group.code,
    field: group.field,
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

const DiagnosticColumnFix: React.FC<{
  code: string;
  field: string;
  mappingActions: TradeImportDiagnosticMappingActions;
}> = ({ code, field, mappingActions }) => {
  const columns = mappingActions.columnsForField(field);
  if (columns.length === 0) return null;
  
  
  const dateFormatFix = DATE_FORMAT_DIAGNOSTIC_CODES.has(code);
  const required = dateFormatFix || mappingActions.isRequiredField(field);
  return (
    <span className="journalit-trade-import-diagnostic-column">
      <span>
        {t('trade-import.diagnostic.column', { columns: columns.join(', ') })}
      </span>
      <button
        type="button"
        className="journalit-trade-import-inline-link"
        onClick={() =>
          required
            ? mappingActions.onEditMapping()
            : mappingActions.onUnmapField(field)
        }
      >
        {dateFormatFix
          ? t('trade-import.diagnostic.choose-date-format')
          : required
            ? t('trade-import.diagnostic.edit-mapping')
            : t('trade-import.diagnostic.unmap-column')}
      </button>
    </span>
  );
};

export const TradeImportDiagnostics: React.FC<TradeImportDiagnosticsProps> = ({
  className,
  defaultOpen,
  diagnostics,
  mappingActions,
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
            {mappingActions && diagnostic.field && (
              <DiagnosticColumnFix
                code={diagnostic.code}
                field={diagnostic.field}
                mappingActions={mappingActions}
              />
            )}
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

interface OtherAccountGroup {
  accountId: string;
  accountDisplayName: string;
  count: number;
}

function groupOtherAccountMatches(
  classified: ClassifiedPreviewTrade[]
): OtherAccountGroup[] {
  const counts = new Map<string, OtherAccountGroup>();
  for (const { otherAccount } of classified) {
    if (!otherAccount) continue;
    const { accountId, accountDisplayName } = otherAccount;
    const group = counts.get(accountId) ?? {
      accountId,
      accountDisplayName,
      count: 0,
    };
    group.count += 1;
    counts.set(accountId, group);
  }
  return Array.from(counts.values());
}


export const TradeImportOtherAccountNotice: React.FC<{
  classified: ClassifiedPreviewTrade[];
  className?: string;
  
  localAccountNames: readonly string[];
  onImportIntoAccount: (accountName: string) => void;
  
  onManageImports: () => void;
}> = ({
  classified,
  className = 'journalit-trade-import-preview-partial',
  localAccountNames,
  onImportIntoAccount,
  onManageImports,
}) => {
  const groups = groupOtherAccountMatches(classified);
  if (groups.length === 0) return null;
  const switchableAccounts = new Set(localAccountNames);
  return (
    <>
      {groups.map((group) => (
        <p key={group.accountId} className={className}>
          <AlertTriangle size={15} />
          <span>
            {t('trade-import.preview.other-account.message', {
              count: String(group.count),
              account: group.accountDisplayName,
            })}
            <span className="journalit-trade-import-notice-actions">
              <span className="journalit-trade-import-notice-actions__row">
                {switchableAccounts.has(group.accountDisplayName) && (
                  <button
                    type="button"
                    className="journalit-trade-import-inline-link"
                    onClick={() =>
                      onImportIntoAccount(group.accountDisplayName)
                    }
                  >
                    {t('trade-import.preview.other-account.import-instead', {
                      account: group.accountDisplayName,
                    })}
                  </button>
                )}
                <button
                  type="button"
                  className="journalit-trade-import-inline-link"
                  onClick={onManageImports}
                >
                  {t('trade-import.preview.other-account.undo-earlier')}
                </button>
              </span>
            </span>
          </span>
        </p>
      ))}
    </>
  );
};

export function previewStatusLabel(
  status: ClassifiedPreviewTrade['preview']['status']
): string {
  switch (status) {
    case 'OPEN':
      return t('trade-import.status.open');
    case 'PARTIALLY_CLOSED':
      return t('trade-import.status.partially-closed');
    case 'CLOSED':
      return t('trade-import.status.closed');
    case 'CANCELLED':
      return t('trade-import.status.cancelled');
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

const MAX_ROW_THUMBNAILS = 3;
const NO_IMAGE_URLS: ReadonlyMap<string, string> = new Map();

const WorkbookImageThumbnails: React.FC<{
  item: ClassifiedPreviewTrade;
  urls: ReadonlyMap<string, string>;
}> = ({ item, urls }) => {
  const images = item.preview.embeddedImages ?? [];
  if (images.length === 0) return null;
  const hidden = images.length - MAX_ROW_THUMBNAILS;
  return (
    <span className="journalit-trade-import-thumbnails">
      {images.slice(0, MAX_ROW_THUMBNAILS).map((image) => {
        
        const key = `${image.row}:${image.column ?? ''}:${image.path}`;
        const url = urls.get(image.path);
        return url ? (
          <img
            key={key}
            src={url}
            alt={t('trade-import.preview.screenshot-alt', {
              symbol: item.preview.symbol,
              row: String(image.row),
            })}
            loading="lazy"
          />
        ) : (
          <span
            key={key}
            className="journalit-trade-import-thumbnails__placeholder"
            aria-hidden="true"
          />
        );
      })}
      {hidden > 0 && (
        <span className="journalit-trade-import-thumbnails__more">
          {t('trade-import.preview.screenshots-more', {
            count: String(hidden),
          })}
        </span>
      )}
    </span>
  );
};

const TradeImportPreviewTable: React.FC<{
  rows: ClassifiedPreviewTrade[];
  breakEven: BreakEvenRangeSettings;
  accountCurrency: string | undefined;
  dateFormat: string;
  use24HourTime: boolean;
  importAnywayItemIds?: ReadonlySet<string>;
  onToggleImportAnyway?: (
    itemIds: readonly string[],
    importAnyway: boolean
  ) => void;
  
  locked?: boolean;
  workbookImageUrls?: ReadonlyMap<string, string>;
}> = ({
  rows,
  breakEven,
  accountCurrency,
  dateFormat,
  use24HourTime,
  importAnywayItemIds,
  onToggleImportAnyway,
  locked = false,
  workbookImageUrls = NO_IMAGE_URLS,
}) => {
  if (rows.length === 0) return null;
  
  const hasMessages = rows.some((item) => item.message);
  const hasImages = rows.some(
    (item) => (item.preview.embeddedImages?.length ?? 0) > 0
  );
  return (
    <div className="csv-preview-table-wrapper">
      <table className="csv-preview-table">
        <thead>
          <tr>
            <th>{t('trade-import.table.status')}</th>
            <th>{t('trade-import.table.symbol')}</th>
            <th>{t('trade-import.table.direction')}</th>
            <th>{t('trade-import.table.entry-time')}</th>
            <th>{t('trade-import.table.quantity')}</th>
            <th>{t('trade-import.table.open-closed')}</th>
            <th>{t('chart.tooltip.pnl')}</th>
            {hasImages && <th>{t('trade-import.table.screenshots')}</th>}
            {hasMessages && <th>{t('trade-import.table.message')}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.itemId}>
              <td>
                {tradeImportClassificationLabel(item.classification)}
                {onToggleImportAnyway && canImportTradeAnyway(item) && (
                  <label className="journalit-trade-import-import-anyway">
                    <input
                      type="checkbox"
                      checked={importAnywayItemIds?.has(item.itemId) ?? false}
                      disabled={locked}
                      aria-label={t('trade-import.preview.import-anyway-aria', {
                        symbol: item.preview.symbol,
                        date: formatTradeImportPreviewDateTime(
                          item.preview.entryTime,
                          dateFormat,
                          use24HourTime
                        ),
                      })}
                      onChange={(event) =>
                        onToggleImportAnyway(
                          [item.itemId],
                          event.target.checked
                        )
                      }
                    />
                    <span>{t('trade-import.preview.import-anyway')}</span>
                  </label>
                )}
              </td>
              <td>{item.preview.symbol}</td>
              <td>{item.preview.direction}</td>
              <td>
                {formatTradeImportPreviewDateTime(
                  item.preview.entryTime,
                  dateFormat,
                  use24HourTime
                )}
              </td>
              <td>{item.preview.quantity}</td>
              <td>{previewStatusLabel(item.preview.status)}</td>
              <td>
                <TradeImportPnlCell
                  item={item}
                  breakEven={breakEven}
                  accountCurrency={accountCurrency}
                />
              </td>
              {hasImages && (
                <td>
                  <WorkbookImageThumbnails
                    item={item}
                    urls={workbookImageUrls}
                  />
                </td>
              )}
              {hasMessages && <td>{item.message ?? ''}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface TradeImportPreviewReviewProps {
  
  accountCurrency: string | undefined;
  breakEven: BreakEvenRangeSettings;
  busy: boolean;
  canCommit: boolean;
  classified: ClassifiedPreviewTrade[];
  dateFormat: string;
  
  entitlementStatus: SubscriptionTierRefreshStatus | null;
  importCompleted: boolean;
  isCheckingEntitlement: boolean;
  isRefreshingStatus: boolean;
  
  localAccountNames: readonly string[];
  
  mappingActions?: TradeImportDiagnosticMappingActions;
  
  onChooseDateFormat?: (format: string) => void;
  
  importAnywayItemIds?: ReadonlySet<string>;
  onToggleImportAnyway?: (
    itemIds: readonly string[],
    importAnyway: boolean
  ) => void;
  
  workbookImageUrls?: ReadonlyMap<string, string>;
  
  workbookImagesIncluded?: boolean;
  onToggleWorkbookImages?: (included: boolean) => void;
  onCancel: () => void;
  onChooseAnotherFile: () => void;
  
  onManageImports: () => void;
  onConfirm: () => void;
  
  onImportIntoAccount: (accountName: string) => void;
  onRefreshStatus: () => void;
  onUpgrade: () => void;
  preview: TradeImportPreviewResponse;
  use24HourTime: boolean;
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
const NO_ITEMS: ReadonlySet<string> = new Set();

function buildPreviewOverview(
  classified: ClassifiedPreviewTrade[],
  timeZone: string,
  importAnywayItemIds: ReadonlySet<string>
): TradeImportPreviewOverview {
  let attentionCount = 0;
  let duplicateCount = 0;
  let importableCount = 0;
  let firstTimestamp = Number.POSITIVE_INFINITY;
  let lastTimestamp = Number.NEGATIVE_INFINITY;
  const symbols = new Set<string>();

  for (const item of classified) {
    const importAnyway = importAnywayItemIds.has(item.itemId);
    if (isTradeImportCommitEligible(item.defaultAction) || importAnyway) {
      importableCount += 1;
    } else if (isTradeImportDuplicate(item)) {
      duplicateCount += 1;
    }
    if (needsTradeImportAttention(item)) attentionCount += 1;

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


const TradeImportPreviewOutcome: React.FC<{
  preview: TradeImportPreviewResponse;
  overview: TradeImportPreviewOverview;
  hasOtherAccountMatches: boolean;
  onManageImports: () => void;
}> = ({ preview, overview, hasOtherAccountMatches, onManageImports }) => (
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
        <>
          <p>
            {t('trade-import.preview.partial.message', {
              count: String(overview.importableCount),
              failed: String(preview.summary.failedRowCount),
              incomplete: String(preview.summary.skippedIncompleteCount),
            })}
          </p>
          <p>{t('trade-import.preview.partial.guidance')}</p>
        </>
      )}
      {preview.outcome === 'failed' && (
        <>
          <p>{t('trade-import.preview.failed.message')}</p>
          <p>{t('trade-import.preview.failed.guidance')}</p>
        </>
      )}
      {preview.outcome === 'completed' && overview.importableCount === 0 && (
        <p>
          {t('trade-import.preview.no-eligible')}
          
          {!hasOtherAccountMatches && (
            <>
              {' '}
              <button
                type="button"
                className="journalit-trade-import-inline-link"
                onClick={onManageImports}
              >
                {t('trade-import.action.manage-imports')}
              </button>
            </>
          )}
        </p>
      )}
    </div>
  </div>
);


const ImportAllAnywayToggle: React.FC<{
  itemIds: readonly string[];
  selected: ReadonlySet<string>;
  disabled: boolean;
  onToggle: (itemIds: readonly string[], importAnyway: boolean) => void;
}> = ({ itemIds, selected, disabled, onToggle }) => (
  <label className="journalit-trade-import-import-all-anyway">
    <input
      type="checkbox"
      checked={itemIds.every((itemId) => selected.has(itemId))}
      disabled={disabled}
      onChange={(event) => onToggle(itemIds, event.target.checked)}
    />
    <span>
      {t('trade-import.preview.import-all-anyway', {
        count: String(itemIds.length),
      })}
    </span>
  </label>
);


const WorkbookImagesToggle: React.FC<{
  count: number;
  included: boolean;
  disabled: boolean;
  onToggle: (included: boolean) => void;
}> = ({ count, included, disabled, onToggle }) =>
  count > 0 ? (
    <label className="journalit-trade-import-workbook-images">
      <input
        type="checkbox"
        checked={included}
        disabled={disabled}
        onChange={(event) => onToggle(event.target.checked)}
      />
      <span>
        {t('trade-import.preview.include-screenshots', {
          count: String(count),
        })}
      </span>
    </label>
  ) : null;

export const TradeImportPreviewReview: React.FC<
  TradeImportPreviewReviewProps
> = ({
  accountCurrency,
  breakEven,
  busy,
  canCommit,
  classified,
  dateFormat,
  entitlementStatus,
  importCompleted,
  isCheckingEntitlement,
  isRefreshingStatus,
  localAccountNames,
  mappingActions,
  onChooseDateFormat,
  importAnywayItemIds = NO_ITEMS,
  onToggleImportAnyway,
  workbookImageUrls,
  workbookImagesIncluded = false,
  onToggleWorkbookImages,
  onCancel,
  onChooseAnotherFile,
  onManageImports,
  onConfirm,
  onImportIntoAccount,
  onRefreshStatus,
  onUpgrade,
  preview,
  use24HourTime,
}) => {
  const timeZone = getTradeImportTimeZone();
  const overview = React.useMemo(
    () => buildPreviewOverview(classified, timeZone, importAnywayItemIds),
    [classified, importAnywayItemIds, timeZone]
  );
  const visibleClassified = classified.slice(0, MAX_RENDERED_PREVIEW_ROWS);
  
  
  const importAnywayCandidateIds = React.useMemo(
    () =>
      classified.flatMap((item) =>
        canImportTradeAnyway(item) ? [item.itemId] : []
      ),
    [classified]
  );
  const hasHiddenImportAnywayCandidates = classified
    .slice(MAX_RENDERED_PREVIEW_ROWS)
    .some(canImportTradeAnyway);
  const hasOtherAccountMatches = classified.some((item) => item.otherAccount);
  const recovery = resolveBrokerImportRecovery(preview);
  const workbookImageCount = workbookImageCountForImport(
    classified,
    importAnywayItemIds
  );
  
  const dateOrderDiagnostic = preview.diagnostics.find(
    (diagnostic) =>
      DATE_ORDER_DIAGNOSTIC_CODES.has(diagnostic.code) &&
      (diagnostic.candidateFormats?.length ?? 0) > 0
  );

  if (recovery) {
    const remainingDiagnostics = preview.diagnostics.filter(
      (diagnostic) => !recovery.diagnosticCodesToSuppress.has(diagnostic.code)
    );
    const RecoveryNotice = recovery.Notice;

    return (
      <>
        <RecoveryNotice
          className="journalit-trade-import-outcome journalit-trade-import-outcome--failed"
          disabled={busy}
          iconSize={20}
        />

        <TradeImportDiagnostics
          diagnostics={remainingDiagnostics}
          defaultOpen
          className="journalit-trade-import-preview-diagnostics"
        />

        <div className="journalit-trade-import-actions">
          <button
            className="journalit-trade-import-confirm-button"
            disabled={busy || importCompleted}
            onClick={onChooseAnotherFile}
          >
            {t('csv.button.import-another')}
          </button>
        </div>
      </>
    );
  }

  const confirmDisabled =
    busy ||
    isCheckingEntitlement ||
    isRefreshingStatus ||
    importCompleted ||
    preview.outcome === 'failed' ||
    
    
    (overview.importableCount < 1 &&
      (canCommit || importAnywayCandidateIds.length === 0));

  const entitlementIsUnverified =
    isCheckingEntitlement ||
    entitlementStatus === null ||
    entitlementStatus === 'unverified';

  
  
  if (
    !canCommit &&
    !isCheckingEntitlement &&
    entitlementStatus === 'free' &&
    preview.outcome !== 'failed' &&
    overview.importableCount > 0
  ) {
    return (
      <>
        <TradeImportProGate
          busy={busy}
          importableCount={overview.importableCount}
          isCheckingEntitlement={isCheckingEntitlement}
          isRefreshingStatus={isRefreshingStatus}
          onRefreshStatus={onRefreshStatus}
          onUpgrade={onUpgrade}
        />

        <div className="journalit-trade-import-preview-counts journalit-trade-import-preview-counts--inline">
          <span>
            {t('trade-import.preview.metric.ready')}{' '}
            <strong>{String(overview.importableCount)}</strong>
          </span>
          <span>
            {t('trade-import.preview.metric.duplicates')}{' '}
            <strong>{String(overview.duplicateCount)}</strong>
          </span>
          <span>
            {t('trade-import.preview.metric.attention')}{' '}
            <strong>{String(overview.attentionCount)}</strong>
          </span>
        </div>

        {preview.outcome === 'partially_completed' && (
          <p className="journalit-trade-import-preview-partial">
            <AlertTriangle size={15} />
            <span>
              {t('trade-import.preview.partial.message', {
                count: String(overview.importableCount),
                failed: String(preview.summary.failedRowCount),
                incomplete: String(preview.summary.skippedIncompleteCount),
              })}
            </span>
          </p>
        )}

        <TradeImportDiagnostics
          diagnostics={preview.diagnostics}
          defaultOpen={false}
          className="journalit-trade-import-preview-diagnostics"
          mappingActions={mappingActions}
        />

        <TradeImportOtherAccountNotice
          classified={classified}
          localAccountNames={localAccountNames}
          onImportIntoAccount={onImportIntoAccount}
          onManageImports={onManageImports}
        />

        <TradeImportPreviewTable
          rows={visibleClassified}
          breakEven={breakEven}
          accountCurrency={accountCurrency}
          dateFormat={dateFormat}
          use24HourTime={use24HourTime}
          workbookImageUrls={workbookImageUrls}
        />

        <div className="journalit-trade-import-actions">
          <button
            className="journalit-trade-import-cancel-preview-button"
            disabled={busy}
            onClick={onCancel}
          >
            {t('trade-import.action.cancel-preview')}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <TradeImportPreviewOutcome
        preview={preview}
        overview={overview}
        hasOtherAccountMatches={hasOtherAccountMatches}
        onManageImports={onManageImports}
      />

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
      {onChooseDateFormat && dateOrderDiagnostic && (
        <TradeImportDateOrderQuestion
          diagnostic={dateOrderDiagnostic}
          busy={busy}
          onChoose={onChooseDateFormat}
        />
      )}
      <TradeImportDiagnostics
        diagnostics={preview.diagnostics}
        defaultOpen={preview.outcome !== 'completed'}
        className="journalit-trade-import-preview-diagnostics"
        mappingActions={mappingActions}
      />
      <TradeImportOtherAccountNotice
        classified={classified}
        localAccountNames={localAccountNames}
        onImportIntoAccount={onImportIntoAccount}
        onManageImports={onManageImports}
      />
      {canCommit && onToggleImportAnyway && hasHiddenImportAnywayCandidates && (
        <ImportAllAnywayToggle
          itemIds={importAnywayCandidateIds}
          selected={importAnywayItemIds}
          disabled={busy || importCompleted}
          onToggle={onToggleImportAnyway}
        />
      )}
      {canCommit && onToggleWorkbookImages && (
        <WorkbookImagesToggle
          count={workbookImageCount}
          included={workbookImagesIncluded}
          disabled={busy || importCompleted}
          onToggle={onToggleWorkbookImages}
        />
      )}
      <TradeImportPreviewTable
        rows={visibleClassified}
        breakEven={breakEven}
        accountCurrency={accountCurrency}
        dateFormat={dateFormat}
        use24HourTime={use24HourTime}
        importAnywayItemIds={importAnywayItemIds}
        onToggleImportAnyway={canCommit ? onToggleImportAnyway : undefined}
        locked={busy || importCompleted}
        workbookImageUrls={workbookImageUrls}
      />

      <div className="journalit-trade-import-actions">
        <button
          className="journalit-trade-import-cancel-preview-button"
          disabled={busy || importCompleted}
          onClick={onCancel}
        >
          {t('trade-import.action.cancel-preview')}
        </button>
        {(canCommit || preview.outcome !== 'failed') && (
          <button
            className="journalit-trade-import-confirm-button"
            disabled={confirmDisabled}
            onClick={
              canCommit
                ? onConfirm
                : entitlementIsUnverified
                  ? onRefreshStatus
                  : onUpgrade
            }
          >
            {canCommit
              ? t('trade-import.action.confirm')
              : entitlementIsUnverified
                ? t('premium.gate.cta.refresh')
                : overview.importableCount > 0
                  ? tPlural(
                      'trade-import.action.activate-pro',
                      overview.importableCount
                    )
                  : t('premium.gate.cta.continue-pro')}
          </button>
        )}
      </div>
    </>
  );
};
