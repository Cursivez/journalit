import { tradeImportClassificationLabel } from '../../services/tradeImport/classificationLabels';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { App, Modal, Notice } from 'obsidian';
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  FileText,
  Import,
  RefreshCw,
  Upload,
} from '../shared/icons/ObsidianIcon';
import type JournalitPlugin from '../../main';
import { t, tPlural } from '../../lang/helpers';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';
import { TradeImportPnlCell } from './TradeImportPnlCell';
import { tradeImportAccountCurrency } from '../../services/tradeImport/accountCurrency';
import { workbookImageCountForImport } from '../../services/tradeImport/workbookImages';

const NO_ITEMS: ReadonlySet<string> = new Set();
import { DATE_ORDER_DIAGNOSTIC_CODES } from './dateOrderQuestion';
import { manualModeForBackend } from '../../services/tradeImport/manualMappingValidation';
import { resolveUpgradeUrl } from '../../services/upgrade/upgradeOrigin';
import { openExternalUrl } from '../../utils/externalLinks';
import { DeviceFlowSignInModal } from '../auth/DeviceFlowSignInModal';
import { useBackendProEntitlement } from '../../hooks/useBackendProEntitlement';
import {
  dateFormatForBroker,
  isHyperliquidTradeHistory,
  resolveHyperliquidExportTimeZone,
} from './hyperliquidImportOptions';
import { BackendTradeImportService } from '../../services/tradeImport/BackendTradeImportService';
import { TradeProjectionClient } from '../../services/tradeSync/TradeProjectionClient';
import {
  TradeImportMappingValidationError,
  TradeImportValidationError,
  TradeImportWorkflowService,
} from '../../services/tradeImport/TradeImportWorkflowService';
import type {
  ClassifiedPreviewTrade,
  TradeImportAnalyseResponse,
  TradeImportCapabilities,
  TradeImportDiagnostic,
  TradeImportPreviewResponse,
} from '../../services/tradeImport/types';
import type { TradeImportCompletionResult } from '../../services/tradeImport/TradeImportWorkflowService';
import {
  isTradeImportCommitEligible,
  isTradeImportDuplicate,
  needsTradeImportAttention,
} from '../../services/tradeImport/commitEligibility';
import {
  getCachedQuickTradeImportSetup,
  loadCachedQuickTradeImportSetup,
  type TradeImportQuickImportState,
  type TradeImportQuickSetup,
} from '../../services/tradeImport/quickImportSetup';
import {
  clearQuickImportTradeImportHandoff,
  setQuickImportTradeImportHandoff,
} from '../../services/tradeImport/quickImportHandoff';
import { rememberTradeImportAssetType } from '../../services/tradeImport/tradeImportSources';
import {
  shouldRouteQuickImportToSourceRecovery,
  resolveBrokerImportRecovery,
  type BrokerImportRecovery,
} from './brokerImportRecovery';
import { BrokerImportRecoveryNotice } from './BrokerImportRecoveryNotice';
import { TradeOperationResultCard } from '../tradeOperations/TradeOperationResultCard';
import { buildImportOperationResult } from '../../services/tradeOperations/resultBuilders';
import type { TradeOperationResult } from '../../services/tradeOperations/types';
import { formatTradeImportPreviewDate } from './tradeImportPreviewDate';
import {
  previewStatusLabel,
  TradeImportOtherAccountNotice,
} from './TradeImportPreviewReview';
import { openImportManagement } from '../../services/tradeImport/importManagementNavigation';

const LOCAL_WRITE_TIMEOUT_MS = 10000;
const PRIVACY_URL = 'https://journalit.co/privacy';

interface QuickTradeImportModalContentProps {
  plugin: JournalitPlugin;
  closeModal: () => void;
}

interface QuickSetupState {
  capabilities: TradeImportCapabilities | null;
  setup: TradeImportQuickSetup | null;
  state: TradeImportQuickImportState;
}

type QuickSetupAction =
  | { type: 'state'; state: TradeImportQuickImportState }
  | {
      type: 'loaded';
      capabilities: TradeImportCapabilities;
      setup: TradeImportQuickSetup;
    };

const quickSetupReducer = (
  state: QuickSetupState,
  action: QuickSetupAction
): QuickSetupState => {
  switch (action.type) {
    case 'state':
      return { ...state, state: action.state };
    case 'loaded':
      return {
        capabilities: action.capabilities,
        setup: action.setup,
        state: {
          phase: action.setup.state === 'ready' ? 'idle' : 'needs_full_import',
          message:
            action.setup.state === 'ready'
              ? undefined
              : t('quick-import.message.needs-setup'),
        },
      };
  }
};

const QuickImportClassificationIcon: React.FC<{
  classification: ClassifiedPreviewTrade['classification'];
}> = ({ classification }) => {
  const label = tradeImportClassificationLabel(classification);
  if (classification === 'new') {
    return (
      <span className="journalit-quick-import-result-icon is-new">
        <CheckCircle size={15} aria-label={label} />
      </span>
    );
  }
  if (
    classification === 'exact_duplicate' ||
    classification === 'already_applied' ||
    classification === 'duplicate_in_import'
  ) {
    return (
      <span className="journalit-quick-import-result-icon is-duplicate">
        <Copy size={15} aria-label={label} />
      </span>
    );
  }
  if (
    classification === 'update_existing' ||
    classification === 'partial_update_existing'
  ) {
    return (
      <span className="journalit-quick-import-result-icon is-update">
        <RefreshCw size={15} aria-label={label} />
      </span>
    );
  }
  return (
    <span className="journalit-quick-import-result-icon is-failed">
      <AlertTriangle size={15} aria-label={label} />
    </span>
  );
};

function formatQuickImportDate(
  preview: ClassifiedPreviewTrade['preview'],
  plugin: JournalitPlugin
): string {
  const dateBasis = plugin.settings.trade.analyticsDateBasis ?? 'entry';
  const dateValue =
    dateBasis === 'exit' && preview.status === 'CLOSED'
      ? preview.exitTime
      : dateBasis === 'entry'
        ? preview.entryTime
        : null;
  return formatTradeImportPreviewDate(
    dateValue,
    plugin.settings.trade.dateFormat
  );
}

interface QuickImportPreviewSummaryProps {
  accountCurrency: string | undefined;
  
  workbookImageCount: number;
  workbookImagesIncluded: boolean;
  onToggleWorkbookImages: (included: boolean) => void;
  classified: ClassifiedPreviewTrade[];
  duplicateCount: number;
  failedCount: number;
  localAccountNames: readonly string[];
  noImportablePreview: boolean;
  onImportIntoAccount: (accountName: string) => void;
  onManageImports: () => void;
  plugin: JournalitPlugin;
  preview: TradeImportPreviewResponse;
  previewRows: ClassifiedPreviewTrade[];
  recovery: BrokerImportRecovery | null;
  writableCount: number;
}

const QuickImportPreviewSummary: React.FC<QuickImportPreviewSummaryProps> = ({
  accountCurrency,
  workbookImageCount,
  workbookImagesIncluded,
  onToggleWorkbookImages,
  classified,
  duplicateCount,
  failedCount,
  localAccountNames,
  onImportIntoAccount,
  noImportablePreview,
  onManageImports,
  plugin,
  preview,
  previewRows,
  recovery,
  writableCount,
}) => {
  return (
    <div className="journalit-quick-import-summary">
      <h3>
        {preview.outcome === 'completed'
          ? t('quick-import.summary.title')
          : t('quick-import.summary.failed')}
      </h3>
      {preview.outcome === 'partially_completed' && (
        <div className="journalit-quick-import-outcome-callout journalit-quick-import-outcome-callout--warning">
          <AlertTriangle size={16} />
          <span>
            {t('trade-import.preview.partial.message', {
              count: String(writableCount),
              failed: String(preview.summary.failedRowCount),
              incomplete: String(preview.summary.skippedIncompleteCount),
            })}
          </span>
        </div>
      )}
      {preview.outcome === 'failed' && !recovery && (
        <div className="journalit-quick-import-outcome-callout journalit-quick-import-outcome-callout--error">
          <AlertTriangle size={16} />
          <span>{t('trade-import.preview.failed.message')}</span>
        </div>
      )}
      <div className="journalit-quick-import-summary__grid">
        <span>{t('quick-import.summary.to-import')}</span>
        <strong>{String(writableCount)}</strong>
        {duplicateCount > 0 && (
          <>
            <span>{t('quick-import.summary.duplicates')}</span>
            <strong>{String(duplicateCount)}</strong>
          </>
        )}
        {failedCount > 0 && (
          <>
            <span>{t('quick-import.summary.failed')}</span>
            <strong>{String(failedCount)}</strong>
          </>
        )}
        {preview.summary.failedRowCount > 0 && (
          <>
            <span>{t('quick-import.summary.failed-rows')}</span>
            <strong>{String(preview.summary.failedRowCount)}</strong>
          </>
        )}
        {preview.summary.skippedIncompleteCount > 0 && (
          <>
            <span>{t('quick-import.summary.incomplete-rows')}</span>
            <strong>{String(preview.summary.skippedIncompleteCount)}</strong>
          </>
        )}
      </div>
      <TradeImportOtherAccountNotice
        classified={classified}
        className="journalit-quick-import-outcome-callout journalit-quick-import-outcome-callout--warning"
        localAccountNames={localAccountNames}
        onImportIntoAccount={onImportIntoAccount}
        onManageImports={onManageImports}
      />
      
      {noImportablePreview &&
        !recovery &&
        !classified.some((item) => item.otherAccount) && (
          <div className="journalit-quick-import-callout">
            <FileText size={16} />
            <span>{t('quick-import.message.no-importable')}</span>
          </div>
        )}
      {previewRows.length > 0 && (
        <div className="journalit-quick-import-preview-table-wrap">
          <table className="journalit-quick-import-preview-table">
            <thead>
              <tr>
                <th>{t('trade-import.table.symbol')}</th>
                <th>{t('trade-import.table.date')}</th>
                <th>{t('chart.tooltip.pnl')}</th>
                <th>{t('trade-import.table.open-closed')}</th>
                <th>{t('trade-import.table.result')}</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((item) => (
                <tr key={item.itemId}>
                  <td>{item.preview.symbol}</td>
                  <td>{formatQuickImportDate(item.preview, plugin)}</td>
                  <td>
                    <TradeImportPnlCell
                      item={item}
                      breakEven={plugin.settings.trade}
                      accountCurrency={accountCurrency}
                    />
                  </td>
                  <td>{previewStatusLabel(item.preview.status)}</td>
                  <td>
                    <QuickImportClassificationIcon
                      classification={item.classification}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {classified.length > previewRows.length && (
            <p className="journalit-quick-import-preview-more">
              {t('quick-import.preview.more', {
                count: String(classified.length - previewRows.length),
              })}
            </p>
          )}
        </div>
      )}
      {workbookImageCount > 0 && (
        <label className="journalit-quick-import-workbook-images">
          <input
            type="checkbox"
            checked={workbookImagesIncluded}
            onChange={(event) => onToggleWorkbookImages(event.target.checked)}
          />
          <span>
            {t('trade-import.preview.include-screenshots', {
              count: String(workbookImageCount),
            })}
          </span>
        </label>
      )}
    </div>
  );
};

interface QuickImportDropzoneProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  isImporting: boolean;
  isPreparingSetup: boolean;
  onDragStateChange: (isDragging: boolean) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onFileSelected: (file: File | null) => void;
}

const QuickImportDropzone: React.FC<QuickImportDropzoneProps> = ({
  fileInputRef,
  isDragging,
  isImporting,
  isPreparingSetup,
  onDragStateChange,
  onDrop,
  onFileSelected,
}) => {
  const openFilePicker = () => {
    if (!isImporting && !isPreparingSetup) fileInputRef.current?.click();
  };

  return (
    <>
      <p className="journalit-quick-import-privacy-note">
        {t('quick-import.privacy-note')}{' '}
        <button
          type="button"
          className="journalit-trade-import-inline-link"
          onClick={() => openExternalUrl(PRIVACY_URL)}
        >
          {t('button.learn-more')}
        </button>
      </p>

      <div
        className={`journalit-quick-import-dropzone${isDragging ? ' is-dragging' : ''}`}
        role="button"
        tabIndex={isPreparingSetup ? -1 : 0}
        aria-disabled={isPreparingSetup ? 'true' : 'false'}
        onClick={openFilePicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFilePicker();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (isImporting || isPreparingSetup) return;
          onDragStateChange(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          const relatedTarget = event.relatedTarget;
          if (
            !(relatedTarget instanceof Node) ||
            !event.currentTarget.contains(relatedTarget)
          ) {
            onDragStateChange(false);
          }
        }}
        onDrop={onDrop}
      >
        <Upload size={24} />
        <strong>
          {isDragging && !isPreparingSetup
            ? t('trade-import.action.drop-file')
            : t('quick-import.dropzone.title')}
        </strong>
        <span>{t('quick-import.dropzone.subtitle')}</span>
        <input
          aria-label={t('quick-import.dropzone.title')}
          ref={fileInputRef}
          type="file"
          className="journalit-quick-import-file-input"
          disabled={isImporting || isPreparingSetup}
          onChange={(event) =>
            onFileSelected(event.currentTarget.files?.item(0) ?? null)
          }
        />
      </div>
    </>
  );
};

interface QuickImportSelectedFileCardProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isImporting: boolean;
  onFileSelected: (file: File | null) => void;
  phase: TradeImportQuickImportState['phase'];
  selectedFile: File;
}

const QuickImportSelectedFileCard: React.FC<
  QuickImportSelectedFileCardProps
> = ({ fileInputRef, isImporting, onFileSelected, phase, selectedFile }) => (
  <div className="journalit-quick-import-file-card">
    <CheckCircle size={18} />
    <div>
      <strong>{selectedFile.name}</strong>
      <span>
        {phase === 'ready_to_import' || phase === 'complete'
          ? t('quick-import.file.processed')
          : t('quick-import.file.selected')}
      </span>
    </div>
    {!isImporting && phase !== 'complete' && (
      <button
        type="button"
        className="journalit-quick-import-replace-file-button"
        aria-label={t('quick-import.action.replace-file')}
        onClick={() => fileInputRef.current?.click()}
      >
        <RefreshCw size={16} />
      </button>
    )}
    <input
      aria-label={t('quick-import.action.replace-file')}
      ref={fileInputRef}
      type="file"
      className="journalit-quick-import-file-input"
      disabled={isImporting}
      onChange={(event) =>
        onFileSelected(event.currentTarget.files?.item(0) ?? null)
      }
    />
  </div>
);

interface QuickImportMainContentProps {
  recoveryDiagnostics: readonly TradeImportDiagnostic[];
  classified: ClassifiedPreviewTrade[];
  file: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileSelected: (file: File | null) => void;
  handleImport: () => Promise<void>;
  isDragging: boolean;
  onBeforeNavigate: () => void;
  
  openFullTradeImport: (
    accountName?: string,
    changeSource?: boolean
  ) => Promise<void>;
  recovery: BrokerImportRecovery | null;
  plugin: JournalitPlugin;
  preview: TradeImportPreviewResponse | null;
  result: TradeImportCompletionResult | null;
  operationResult: TradeOperationResult | null;
  setDragging: (isDragging: boolean) => void;
  setup: TradeImportQuickSetup | null;
  state: TradeImportQuickImportState;
  workbookImagesIncluded: boolean;
  onToggleWorkbookImages: (included: boolean) => void;
}

export const QuickImportMainContent: React.FC<QuickImportMainContentProps> = ({
  recovery,
  recoveryDiagnostics,
  classified,
  file,
  fileInputRef,
  handleDrop,
  handleFileSelected,
  handleImport,
  isDragging,
  onBeforeNavigate,
  openFullTradeImport,
  plugin,
  preview,
  result,
  operationResult,
  setDragging,
  setup,
  state,
  workbookImagesIncluded,
  onToggleWorkbookImages,
}) => {
  const duplicateCount = classified.filter(isTradeImportDuplicate).length;
  const failedCount = classified.filter(needsTradeImportAttention).length;
  const writableCount = classified.filter((item) =>
    isTradeImportCommitEligible(item.defaultAction)
  ).length;
  const isImporting = state.phase === 'importing';
  const isPreparingSetup = state.phase === 'loading';
  const needsQuickImportSetup = state.phase === 'needs_full_import' && !file;
  const noImportablePreview =
    state.phase === 'ready_to_import' && preview !== null && writableCount < 1;
  const parsingNeedsFullReview =
    state.phase === 'ready_to_import' &&
    (preview?.outcome === 'partially_completed' ||
      preview?.outcome === 'failed');
  
  
  const hasOtherAccountMatches =
    state.phase === 'ready_to_import' &&
    classified.some((item) => item.otherAccount);
  const showFullTradeImportAction =
    hasOtherAccountMatches ||
    needsQuickImportSetup ||
    state.phase === 'error' ||
    state.phase === 'needs_full_import' ||
    noImportablePreview ||
    parsingNeedsFullReview;
  const fullTradeImportActionLabel = needsQuickImportSetup
    ? t('quick-import.action.setup-in-trade-import')
    : state.phase === 'needs_full_import' ||
        state.phase === 'error' ||
        noImportablePreview ||
        parsingNeedsFullReview ||
        hasOtherAccountMatches
      ? t('quick-import.action.review-in-trade-import')
      : t('quick-import.action.open-full');
  const previewRows = classified.slice(0, 5);
  const selectedFile = file;

  return (
    <div className="journalit-quick-import-modal">
      <div className="journalit-quick-import-modal__header">
        <Import size={18} />
        <div>
          <p>{t('quick-import.subtitle')}</p>
        </div>
      </div>

      {setup && (
        <div className="journalit-quick-import-setup">
          <span>{setup.accountName}</span>
          <span>{setup.brokerLabel}</span>
          <span>{t(`trade-import.asset.${setup.assetType}`)}</span>
          {setup.templateName && <span>{setup.templateName}</span>}
        </div>
      )}

      {!needsQuickImportSetup &&
        (state.phase === 'idle' || isPreparingSetup) &&
        !file && (
          <QuickImportDropzone
            fileInputRef={fileInputRef}
            isDragging={isDragging}
            isImporting={isImporting}
            isPreparingSetup={isPreparingSetup}
            onDragStateChange={setDragging}
            onDrop={handleDrop}
            onFileSelected={handleFileSelected}
          />
        )}

      {selectedFile && state.phase === 'analysing' && (
        <div className="journalit-quick-import-processing">
          <div className="journalit-quick-import-file-card">
            <FileText size={18} />
            <div>
              <strong>{selectedFile.name}</strong>
              <span>{t('quick-import.processing.sent-to-server')}</span>
            </div>
          </div>
          <div className="journalit-quick-import-skeleton" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="journalit-quick-import-status">
            {t('quick-import.status.analysing')}
          </p>
        </div>
      )}

      {selectedFile && state.phase !== 'analysing' && (
        <QuickImportSelectedFileCard
          fileInputRef={fileInputRef}
          isImporting={isImporting}
          onFileSelected={handleFileSelected}
          phase={state.phase}
          selectedFile={selectedFile}
        />
      )}

      {recovery && (
        <BrokerImportRecoveryNotice
          {...recovery.getNoticeProps(recoveryDiagnostics)}
          className="journalit-quick-import-outcome-callout journalit-quick-import-outcome-callout--error"
          iconSize={16}
          disabled={isImporting}
          onSwitchSource={
            recovery.canChangeSource
              ? () => void openFullTradeImport(undefined, true)
              : undefined
          }
        />
      )}
      {!recovery &&
        (state.phase === 'needs_full_import' ||
          state.phase === 'unavailable' ||
          state.phase === 'error') && (
          <div className="journalit-quick-import-callout">
            <FileText size={16} />
            <span>{state.message}</span>
          </div>
        )}

      {!recovery?.canChangeSource &&
        preview &&
        state.phase === 'ready_to_import' && (
          <QuickImportPreviewSummary
            workbookImageCount={workbookImageCountForImport(
              classified,
              NO_ITEMS
            )}
            workbookImagesIncluded={workbookImagesIncluded}
            onToggleWorkbookImages={onToggleWorkbookImages}
            accountCurrency={tradeImportAccountCurrency(
              plugin.settings,
              setup?.accountName
            )}
            classified={classified}
            duplicateCount={duplicateCount}
            failedCount={failedCount}
            localAccountNames={setup?.accountNames ?? []}
            onImportIntoAccount={(accountName) =>
              void openFullTradeImport(accountName)
            }
            noImportablePreview={noImportablePreview}
            onManageImports={() => {
              onBeforeNavigate();
              openImportManagement(plugin);
            }}
            plugin={plugin}
            preview={preview}
            previewRows={previewRows}
            recovery={recovery}
            writableCount={writableCount}
          />
        )}

      {result && state.phase === 'complete' && (
        <div
          className={`journalit-quick-import-summary${
            operationResult
              ? ' journalit-quick-import-summary--operation-result'
              : ''
          }`}
        >
          {operationResult ? (
            <TradeOperationResultCard
              plugin={plugin}
              result={operationResult}
              presentation="inline-compact"
              onBeforeNavigate={onBeforeNavigate}
            />
          ) : (
            <h3>
              {result.pendingCount > 0
                ? t('csv.results.pending-title')
                : t('quick-import.complete.title')}
            </h3>
          )}
          {(!operationResult ||
            result.duplicateCount > 0 ||
            result.failedCount > 0) && (
            <p>
              {t('quick-import.complete.message', {
                written: String(result.writtenCount),
                duplicates: String(result.duplicateCount),
                failed: String(result.failedCount),
              })}
            </p>
          )}
          {result.pendingCount > 0 && (
            <p>
              {t('csv.results.pending-local-writes', {
                count: String(result.pendingCount),
              })}
            </p>
          )}
          {result.attachedImageCount > 0 && (
            <p>
              {t('trade-import.completion.screenshots-added', {
                count: String(result.attachedImageCount),
              })}
            </p>
          )}
          {result.failedImageCount > 0 && (
            <p>
              {t('trade-import.completion.screenshots-failed', {
                count: String(result.failedImageCount),
              })}
            </p>
          )}
        </div>
      )}

      <div className="journalit-quick-import-actions">
        {recovery?.showQuickImportAnotherFileAction && (
          <button
            type="button"
            className="journalit-quick-import-another-file-button"
            onClick={() => fileInputRef.current?.click()}
          >
            {t(recovery.anotherFileLabel ?? 'csv.button.import-another')}
          </button>
        )}
        {!recovery?.canChangeSource && showFullTradeImportAction && (
          <button type="button" onClick={() => void openFullTradeImport()}>
            {fullTradeImportActionLabel}
          </button>
        )}
        <div className="journalit-quick-import-actions__primary">
          {((state.phase === 'ready_to_import' &&
            writableCount > 0 &&
            preview?.outcome !== 'failed') ||
            state.phase === 'importing') && (
            <button
              type="button"
              className="mod-cta"
              disabled={state.phase !== 'ready_to_import' || writableCount < 1}
              onClick={() => void handleImport()}
            >
              {state.phase === 'importing'
                ? t('quick-import.status.importing')
                : tPlural('quick-import.action.import-count', writableCount)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface QuickImportAccessGateProps {
  canUseQuickTradeImport: boolean;
  isAuthenticated: boolean;
  isCheckingEntitlement: boolean;
  onPreviewFree: () => void;
  onSignIn: () => void;
  onUpgrade: () => void;
}

export function renderQuickImportAccessGate({
  canUseQuickTradeImport,
  isAuthenticated,
  isCheckingEntitlement,
  onPreviewFree,
  onSignIn,
  onUpgrade,
}: QuickImportAccessGateProps): React.ReactElement | null {
  if (!isAuthenticated) {
    return (
      <div className="journalit-quick-import-modal">
        <p>{t('quick-import.gate.sign-in')}</p>
        <button type="button" className="mod-cta" onClick={onSignIn}>
          {t('quick-import.gate.sign-in-cta')}
        </button>
      </div>
    );
  }

  if (isCheckingEntitlement && !canUseQuickTradeImport) {
    return (
      <div className="journalit-quick-import-modal">
        <p>{t('quick-import.status.checking-subscription')}</p>
      </div>
    );
  }

  if (!canUseQuickTradeImport) {
    return (
      <div className="journalit-quick-import-modal">
        <p>{t('quick-import.gate.pro')}</p>
        <div className="journalit-quick-import-gate-actions">
          <button type="button" className="mod-cta" onClick={onUpgrade}>
            {t('premium.gate.cta.continue-pro')}
          </button>
          <button
            type="button"
            className="journalit-quick-import-preview-free-button"
            onClick={onPreviewFree}
          >
            {t('quick-import.gate.preview-free')}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function useQuickImportSetupState({
  backendService,
  canUseQuickTradeImport,
  isCheckingEntitlement,
  plugin,
}: {
  backendService: BackendTradeImportService;
  canUseQuickTradeImport: boolean;
  isCheckingEntitlement: boolean;
  plugin: JournalitPlugin;
}): QuickSetupState & {
  updateState: (state: TradeImportQuickImportState) => void;
} {
  const cachedQuickSetup = useMemo(getCachedQuickTradeImportSetup, []);
  const hasInitialQuickSetupRef = useRef(cachedQuickSetup !== null);
  const [quickSetupState, dispatchQuickSetup] = useReducer(
    quickSetupReducer,
    undefined,
    (): QuickSetupState => ({
      capabilities: cachedQuickSetup?.capabilities ?? null,
      setup: cachedQuickSetup?.setup ?? null,
      state: {
        phase: cachedQuickSetup
          ? cachedQuickSetup.setup.state === 'ready'
            ? 'idle'
            : 'needs_full_import'
          : 'loading',
        message:
          cachedQuickSetup && cachedQuickSetup.setup.state !== 'ready'
            ? t('quick-import.message.needs-setup')
            : undefined,
      },
    })
  );
  const updateState = useCallback((state: TradeImportQuickImportState) => {
    dispatchQuickSetup({ type: 'state', state });
  }, []);

  useEffect(() => {
    if (!canUseQuickTradeImport) {
      updateState({ phase: 'idle' });
      return;
    }
    let cancelled = false;
    if (!hasInitialQuickSetupRef.current) updateState({ phase: 'loading' });
    void (async () => {
      try {
        const loaded = await loadCachedQuickTradeImportSetup(
          plugin,
          backendService
        );
        if (cancelled) return;
        dispatchQuickSetup({
          type: 'loaded',
          capabilities: loaded.capabilities,
          setup: loaded.setup,
        });
      } catch {
        if (!cancelled) {
          updateState({
            phase: 'error',
            message: t('quick-import.message.capabilities-failed'),
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    backendService,
    canUseQuickTradeImport,
    isCheckingEntitlement,
    plugin,
    updateState,
  ]);

  return { ...quickSetupState, updateState };
}

export const QuickTradeImportModalContent: React.FC<
  QuickTradeImportModalContentProps
> = ({ plugin, closeModal }) => {
  const backendService = useMemo(() => new BackendTradeImportService(), []);
  const projectionBackendService = useMemo(
    () => new TradeProjectionClient(),
    []
  );
  const workflowService = useMemo(
    () =>
      new TradeImportWorkflowService(
        plugin,
        backendService,
        projectionBackendService
      ),
    [backendService, plugin, projectionBackendService]
  );
  const requestVersionRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isAuthenticated,
    isFeatureEnabled: canUseQuickTradeImport,
    isChecking: isCheckingEntitlement,
  } = useBackendProEntitlement(
    plugin,
    'quick trade import open',
    'quickTradeImport'
  );
  const {
    capabilities,
    setup,
    state,
    updateState: updateQuickImportState,
  } = useQuickImportSetupState({
    backendService,
    canUseQuickTradeImport,
    isCheckingEntitlement,
    plugin,
  });
  const [importState, dispatchImportState] = useReducer(
    (
      state: {
        file: File | null;
        analyse: TradeImportAnalyseResponse | null;
        preview: TradeImportPreviewResponse | null;
        previewOwnerUserId: string | null;
        classified: ClassifiedPreviewTrade[];
        result: TradeImportCompletionResult | null;
        operationResult: TradeOperationResult | null;
        isDragging: boolean;
      },
      update: Partial<{
        file: File | null;
        analyse: TradeImportAnalyseResponse | null;
        preview: TradeImportPreviewResponse | null;
        previewOwnerUserId: string | null;
        classified: ClassifiedPreviewTrade[];
        result: TradeImportCompletionResult | null;
        operationResult: TradeOperationResult | null;
        isDragging: boolean;
      }>
    ) => ({ ...state, ...update }),
    {
      file: null,
      analyse: null,
      preview: null,
      previewOwnerUserId: null,
      classified: [],
      result: null,
      operationResult: null,
      isDragging: false,
    }
  );
  const {
    file,
    analyse,
    preview,
    previewOwnerUserId,
    classified,
    result,
    operationResult,
    isDragging,
  } = importState;
  
  const [workbookImagesExcludedFor, setWorkbookImagesExcludedFor] = useState<
    string | null
  >(null);
  const includeWorkbookImages =
    !preview || workbookImagesExcludedFor !== preview.importId;

  const selectedBrokerCapabilities = useMemo(
    () => capabilities?.brokers.find((broker) => broker.id === setup?.broker),
    [capabilities, setup?.broker]
  );

  const openFullTradeImport = useCallback(
    async (targetAccountName?: string, changeSource = false) => {
      
      
      const retarget =
        targetAccountName !== undefined &&
        targetAccountName !== setup?.accountName;
      if (file && setup) {
        setQuickImportTradeImportHandoff({
          file,
          broker: setup.broker,
          accountName: retarget ? targetAccountName : setup.accountName,
          assetType: setup.assetType,
          manualMode: setup.manualMode,
          dateFormat: setup.dateFormat,
          sheetName:
            analyse?.selectedSheet ??
            analyse?.suggestedSheet ??
            setup.sheetName,
          headerRowIndex: analyse?.headerRowIndex ?? setup.headerRowIndex,
          templateId: setup.templateId,
          templateName: setup.templateName,
          columnMappings: setup.columnMappings,
          aiMappingEnabled: setup.aiMappingEnabled,
          analyse,
          preview: retarget ? null : preview,
          previewOwnerUserId: retarget ? null : previewOwnerUserId,
          classified: retarget ? [] : classified,
          previewOnOpen: retarget,
          changeSource,
        });
      }
      closeModal();
      try {
        await plugin.viewManager.openCSVImportView();
        window.dispatchEvent(new Event('journalit:quick-import-handoff-ready'));
      } catch (error) {
        clearQuickImportTradeImportHandoff();
        console.error('[Quick Import] Failed to open Trade Import:', error);
        new Notice(t('trade-import.notice.open-failed'));
      }
    },
    [
      analyse,
      classified,
      closeModal,
      file,
      plugin.viewManager,
      preview,
      previewOwnerUserId,
      setup,
    ]
  );

  const handleSignIn = useCallback(() => {
    const modal = new DeviceFlowSignInModal(
      plugin.app,
      plugin,
      () => window.dispatchEvent(new Event('journalit:subscription-changed')),
      () => undefined
    );
    modal.open();
  }, [plugin]);

  const handleUpgrade = useCallback(() => {
    openExternalUrl(resolveUpgradeUrl('quickTradeImport'));
  }, []);

  const runQuickPreview = useCallback(
    async (selectedFile: File) => {
      const requestVersion = requestVersionRef.current + 1;
      requestVersionRef.current = requestVersion;
      if (!capabilities || !setup || setup.state !== 'ready') {
        updateQuickImportState({
          phase: 'needs_full_import',
          message: t('quick-import.message.needs-setup'),
        });
        return;
      }
      dispatchImportState({
        file: selectedFile,
        analyse: null,
        preview: null,
        previewOwnerUserId: null,
        classified: [],
        result: null,
        operationResult: null,
      });
      updateQuickImportState({ phase: 'analysing' });
      try {
        const analyseResult = await workflowService.analyseFile({
          file: selectedFile,
          capabilities,
          brokerCapabilities: selectedBrokerCapabilities,
          broker: setup.broker,
          sheetName: setup.sheetName,
          header: { index: setup.headerRowIndex },
          aiMappingEnabled: setup.aiMappingEnabled,
        });
        if (requestVersionRef.current !== requestVersion) return;
        dispatchImportState({ analyse: analyseResult.response });
        if (
          shouldRouteQuickImportToSourceRecovery(
            analyseResult.response,
            setup,
            capabilities.brokers
          )
        ) {
          updateQuickImportState({
            phase: 'needs_full_import',
            message: t('quick-import.message.source-mismatch'),
          });
          return;
        }
        if (resolveBrokerImportRecovery(analyseResult.response)) {
          updateQuickImportState({
            phase: 'needs_full_import',
            message: t('quick-import.message.preview-failed'),
          });
          return;
        }
        const isHyperliquid = isHyperliquidTradeHistory(setup.broker);
        const exportTimeZone = resolveHyperliquidExportTimeZone(
          setup.broker,
          selectedBrokerCapabilities?.supportsExportTimeZone === true
        );
        if (exportTimeZone.errorKey) {
          updateQuickImportState({
            phase: 'unavailable',
            message: t(exportTimeZone.errorKey),
          });
          return;
        }
        const nextSheetName =
          analyseResult.response.selectedSheet ??
          analyseResult.response.suggestedSheet ??
          setup.sheetName;
        
        
        const nextHeaderRowIndex = analyseResult.response.headerRowIndex;
        if (nextHeaderRowIndex === undefined) {
          updateQuickImportState({
            phase: 'needs_full_import',
            message: t('quick-import.message.preview-failed'),
          });
          return;
        }
        const columnMappings =
          Object.keys(setup.columnMappings).length > 0
            ? setup.columnMappings
            : analyseResult.suggestedColumnMappings;

        const previewResult = await workflowService.previewFile({
          file: selectedFile,
          capabilities,
          brokerCapabilities: selectedBrokerCapabilities,
          analyse: analyseResult.response,
          broker: setup.broker,
          sheetName: nextSheetName,
          headerRowIndex: nextHeaderRowIndex,
          accountName: setup.accountName,
          assetType: setup.assetType,
          manualMode: manualModeForBackend(
            setup.manualMode,
            capabilities.manualMapping.modes
          ),
          dateFormat: dateFormatForBroker(setup.broker, setup.dateFormat),
          timeZone: exportTimeZone.timeZone,
          columnMappings,
          manualMappingRequired:
            setup.broker === 'MANUAL' || setup.source === 'favorite-template',
        });
        if (requestVersionRef.current !== requestVersion) return;
        
        
        if (
          (setup.broker === 'MANUAL' || setup.source === 'favorite-template') &&
          previewResult.response.diagnostics.some((diagnostic) =>
            DATE_ORDER_DIAGNOSTIC_CODES.has(diagnostic.code)
          )
        ) {
          dispatchImportState({
            preview: previewResult.response,
            previewOwnerUserId: previewResult.ownerUserId,
            classified: previewResult.classifiedTrades,
          });
          updateQuickImportState({
            phase: 'needs_full_import',
            message: t('quick-import.message.date-order'),
          });
          return;
        }
        if (
          isHyperliquid &&
          previewResult.response.diagnostics.some(
            (diagnostic) => diagnostic.code === 'ambiguous-date-format'
          )
        ) {
          updateQuickImportState({
            phase: 'needs_full_import',
            message: t('quick-import.message.preview-failed'),
          });
          return;
        }
        dispatchImportState({
          preview: previewResult.response,
          previewOwnerUserId: previewResult.ownerUserId,
          classified: previewResult.classifiedTrades,
        });
        updateQuickImportState({ phase: 'ready_to_import' });
      } catch (error) {
        if (requestVersionRef.current !== requestVersion) return;
        updateQuickImportState({
          phase:
            error instanceof TradeImportMappingValidationError
              ? 'needs_full_import'
              : error instanceof TradeImportValidationError
                ? 'error'
                : 'needs_full_import',
          message:
            error instanceof TradeImportMappingValidationError
              ? t('quick-import.message.mapping-required')
              : error instanceof TradeImportValidationError
                ? error.message
                : t('quick-import.message.preview-failed'),
        });
      }
    },
    [
      capabilities,
      selectedBrokerCapabilities,
      setup,
      updateQuickImportState,
      workflowService,
    ]
  );

  const handleFileSelected = useCallback(
    (selectedFile: File | null) => {
      if (state.phase === 'importing') return;
      if (selectedFile) void runQuickPreview(selectedFile);
    },
    [runQuickPreview, state.phase]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      dispatchImportState({ isDragging: false });
      if (state.phase === 'importing') return;
      handleFileSelected(event.dataTransfer.files.item(0));
    },
    [handleFileSelected, state.phase]
  );

  const handleImport = useCallback(async () => {
    if (
      !preview ||
      !previewOwnerUserId ||
      preview.outcome === 'failed' ||
      classified.length === 0 ||
      !setup
    )
      return;
    updateQuickImportState({ phase: 'importing' });
    const writeResult = await workflowService.writePreview({
      preview,
      previewOwnerUserId,
      classified,
      workbookFile: includeWorkbookImages ? (file ?? undefined) : undefined,
      accountName: setup.accountName,
      brokerLabel: setup.brokerLabel,
      localWriteTimeoutMs: LOCAL_WRITE_TIMEOUT_MS,
    });
    const nextOperationResult = buildImportOperationResult({
      result: writeResult,
      source: 'quick-import',
      ownerUserId: previewOwnerUserId,
    });
    dispatchImportState({
      result: writeResult,
      operationResult: plugin
        .ensureTradeOperationResultService()
        .record(nextOperationResult),
    });
    updateQuickImportState({ phase: 'complete' });
    void rememberTradeImportAssetType(plugin, setup.broker, setup.assetType);
  }, [
    classified,
    file,
    includeWorkbookImages,
    plugin,
    preview,
    previewOwnerUserId,
    setup,
    updateQuickImportState,
    workflowService,
  ]);

  const accessGate = renderQuickImportAccessGate({
    canUseQuickTradeImport,
    isAuthenticated,
    isCheckingEntitlement,
    onPreviewFree: () => void openFullTradeImport(),
    onSignIn: () => void handleSignIn(),
    onUpgrade: () => void handleUpgrade(),
  });
  if (accessGate) {
    return accessGate;
  }

  const recoveryResponse =
    state.phase === 'ready_to_import'
      ? preview
      : state.phase === 'needs_full_import'
        ? analyse
        : null;
  const recovery =
    analyse &&
    setup &&
    capabilities &&
    shouldRouteQuickImportToSourceRecovery(analyse, setup, capabilities.brokers)
      ? null
      : resolveBrokerImportRecovery(recoveryResponse);

  return (
    <QuickImportMainContent
      recovery={recovery}
      recoveryDiagnostics={recoveryResponse?.diagnostics ?? []}
      classified={classified}
      file={file}
      fileInputRef={fileInputRef}
      handleDrop={handleDrop}
      handleFileSelected={handleFileSelected}
      handleImport={handleImport}
      isDragging={isDragging}
      onBeforeNavigate={closeModal}
      openFullTradeImport={openFullTradeImport}
      plugin={plugin}
      preview={preview}
      result={result}
      operationResult={operationResult}
      setDragging={(nextIsDragging) =>
        dispatchImportState({ isDragging: nextIsDragging })
      }
      setup={setup}
      state={state}
      workbookImagesIncluded={includeWorkbookImages}
      onToggleWorkbookImages={(included) =>
        setWorkbookImagesExcludedFor(
          included ? null : (preview?.importId ?? null)
        )
      }
    />
  );
};
class QuickTradeImportModal extends Modal {
  private root: Root | null = null;

  constructor(
    app: App,
    private plugin: JournalitPlugin
  ) {
    super(app);
  }

  onOpen(): void {
    this.titleEl.setText(t('quick-import.title'));
    this.contentEl.empty();
    this.modalEl.addClass('journalit-quick-import-modal-shell');
    const container = this.contentEl.createDiv();
    this.root = createRoot(container);
    this.root.render(
      <DisplayPolicyProvider privacyModeOverride={false}>
        <QuickTradeImportModalContent
          plugin={this.plugin}
          closeModal={() => this.close()}
        />
      </DisplayPolicyProvider>
    );
  }

  onClose(): void {
    this.root?.unmount();
    this.root = null;
    this.contentEl.empty();
  }
}

export function openQuickTradeImportModal(plugin: JournalitPlugin): void {
  new QuickTradeImportModal(plugin.app, plugin).open();
}
