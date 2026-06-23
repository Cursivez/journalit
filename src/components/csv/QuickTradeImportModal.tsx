import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { App, Modal } from 'obsidian';
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
import { t } from '../../lang/helpers';
import { PnLValue } from '../shared/display/DisplayValue';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';
import { formatDateDisplay } from '../../utils/dateUtils';
import { classifyPnLWithBreakEvenSettings } from '../../utils/breakEvenRange';
import { UPGRADE_URL } from '../../constants';
import { openExternalUrl } from '../../utils/externalLinks';
import { DeviceFlowSignInModal } from '../auth/DeviceFlowSignInModal';
import { useBackendProEntitlement } from '../../hooks/useBackendProEntitlement';
import { BackendTradeImportService } from '../../services/tradeImport/BackendTradeImportService';
import {
  TradeImportValidationError,
  TradeImportWorkflowService,
} from '../../services/tradeImport/TradeImportWorkflowService';
import type {
  ClassifiedPreviewTrade,
  TradeImportCapabilities,
  TradeImportPreviewResponse,
} from '../../services/tradeImport/types';
import type { TradeImportCompletionResult } from '../../services/tradeImport/TradeImportWorkflowService';
import {
  isTradeImportBlocked,
  isTradeImportCommitEligible,
  isTradeImportSkipped,
} from '../../services/tradeImport/commitEligibility';
import {
  getCachedQuickTradeImportSetup,
  loadCachedQuickTradeImportSetup,
  type TradeImportQuickImportState,
  type TradeImportQuickSetup,
} from '../../services/tradeImport/quickImportSetup';
import { setQuickImportTradeImportHandoff } from '../../services/tradeImport/quickImportHandoff';

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
  const label = classification.replace('_', ' ');
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

const QuickImportPnlCell: React.FC<{
  preview: ClassifiedPreviewTrade['preview'];
  plugin: JournalitPlugin;
}> = ({ preview, plugin }) => {
  const value = preview.profitLoss ?? preview.directPnL;
  const outcome =
    typeof value === 'number' && Number.isFinite(value)
      ? classifyPnLWithBreakEvenSettings(value, {
          breakEvenRangeMin: plugin.settings.trade.breakEvenRangeMin,
          breakEvenRangeMax: plugin.settings.trade.breakEvenRangeMax,
          breakEvenThresholdMode: plugin.settings.trade.breakEvenThresholdMode,
          breakEvenThresholdPercent:
            plugin.settings.trade.breakEvenThresholdPercent,
        })
      : 'unknown';
  const tone =
    outcome === 'win'
      ? 'positive'
      : outcome === 'loss'
        ? 'negative'
        : 'neutral';

  return (
    <PnLValue
      value={value}
      currencyCode={preview.currency ?? 'USD'}
      fallback="—"
      tone={tone}
    />
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
  return dateValue
    ? formatDateDisplay(dateValue, plugin.settings.trade.dateFormat)
    : '—';
}

interface QuickImportPreviewSummaryProps {
  classified: ClassifiedPreviewTrade[];
  duplicateCount: number;
  failedCount: number;
  hasImportExceptions: boolean;
  noImportablePreview: boolean;
  plugin: JournalitPlugin;
  previewRows: ClassifiedPreviewTrade[];
  writableCount: number;
}

const QuickImportPreviewSummary: React.FC<QuickImportPreviewSummaryProps> = ({
  classified,
  duplicateCount,
  failedCount,
  hasImportExceptions,
  noImportablePreview,
  plugin,
  previewRows,
  writableCount,
}) => (
  <div className="journalit-quick-import-summary">
    <h3>{t('quick-import.summary.title')}</h3>
    <div className="journalit-quick-import-summary__grid">
      <span>{t('quick-import.summary.to-import')}</span>
      <strong>{String(writableCount)}</strong>
      {hasImportExceptions && (
        <>
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
        </>
      )}
    </div>
    {noImportablePreview && (
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
              <th>{t('trade-import.table.status')}</th>
              <th>{t('trade-import.table.result')}</th>
            </tr>
          </thead>
          <tbody>
            {previewRows.map((item) => (
              <tr key={item.itemId}>
                <td>{item.preview.symbol}</td>
                <td>{formatQuickImportDate(item.preview, plugin)}</td>
                <td>
                  <QuickImportPnlCell preview={item.preview} plugin={plugin} />
                </td>
                <td>{item.preview.status}</td>
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
  </div>
);

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
  classified: ClassifiedPreviewTrade[];
  file: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileSelected: (file: File | null) => void;
  handleImport: () => Promise<void>;
  isDragging: boolean;
  openFullTradeImport: () => Promise<void>;
  plugin: JournalitPlugin;
  preview: TradeImportPreviewResponse | null;
  result: TradeImportCompletionResult | null;
  setDragging: (isDragging: boolean) => void;
  setup: TradeImportQuickSetup | null;
  state: TradeImportQuickImportState;
}

const QuickImportMainContent: React.FC<QuickImportMainContentProps> = ({
  classified,
  file,
  fileInputRef,
  handleDrop,
  handleFileSelected,
  handleImport,
  isDragging,
  openFullTradeImport,
  plugin,
  preview,
  result,
  setDragging,
  setup,
  state,
}) => {
  const duplicateCount = classified.filter((item) =>
    isTradeImportSkipped(item.defaultAction)
  ).length;
  const failedCount = classified.filter((item) =>
    isTradeImportBlocked(item.defaultAction)
  ).length;
  const writableCount = classified.filter((item) =>
    isTradeImportCommitEligible(item.defaultAction)
  ).length;
  const hasImportExceptions = duplicateCount > 0 || failedCount > 0;
  const isImporting = state.phase === 'importing';
  const isPreparingSetup = state.phase === 'loading';
  const needsQuickImportSetup = state.phase === 'needs_full_import' && !file;
  const noImportablePreview =
    state.phase === 'ready_to_import' && preview !== null && writableCount < 1;
  const showFullTradeImportAction =
    needsQuickImportSetup ||
    state.phase === 'error' ||
    state.phase === 'needs_full_import' ||
    noImportablePreview;
  const fullTradeImportActionLabel = needsQuickImportSetup
    ? t('quick-import.action.setup-in-trade-import')
    : state.phase === 'needs_full_import' ||
        state.phase === 'error' ||
        noImportablePreview
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

      {(state.phase === 'needs_full_import' || state.phase === 'error') && (
        <div className="journalit-quick-import-callout">
          <FileText size={16} />
          <span>{state.message}</span>
        </div>
      )}

      {preview && state.phase === 'ready_to_import' && (
        <QuickImportPreviewSummary
          classified={classified}
          duplicateCount={duplicateCount}
          failedCount={failedCount}
          hasImportExceptions={hasImportExceptions}
          noImportablePreview={noImportablePreview}
          plugin={plugin}
          previewRows={previewRows}
          writableCount={writableCount}
        />
      )}

      {result && state.phase === 'complete' && (
        <div className="journalit-quick-import-summary">
          <h3>{t('quick-import.complete.title')}</h3>
          <p>
            {t('quick-import.complete.message', {
              written: String(result.writtenCount),
              duplicates: String(result.duplicateCount),
              failed: String(result.failedCount),
            })}
          </p>
        </div>
      )}

      <div className="journalit-quick-import-actions">
        {showFullTradeImportAction && (
          <button type="button" onClick={() => void openFullTradeImport()}>
            {fullTradeImportActionLabel}
          </button>
        )}
        <div className="journalit-quick-import-actions__primary">
          {((state.phase === 'ready_to_import' && writableCount > 0) ||
            state.phase === 'importing') && (
            <button
              type="button"
              className="mod-cta"
              disabled={state.phase !== 'ready_to_import' || writableCount < 1}
              onClick={() => void handleImport()}
            >
              {state.phase === 'importing'
                ? t('quick-import.status.importing')
                : t('quick-import.action.import-count', {
                    count: String(writableCount),
                  })}
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
  onSignIn: () => void;
  onUpgrade: () => void;
}

function renderQuickImportAccessGate({
  canUseQuickTradeImport,
  isAuthenticated,
  isCheckingEntitlement,
  onSignIn,
  onUpgrade,
}: QuickImportAccessGateProps): React.ReactElement | null {
  if (!isAuthenticated) {
    return (
      <div className="journalit-quick-import-modal">
        <p>{t('quick-import.gate.sign-in')}</p>
        <button type="button" className="mod-cta" onClick={onSignIn}>
          {t('premium.gate.cta.signin-continue')}
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
        <button type="button" className="mod-cta" onClick={onUpgrade}>
          {t('premium.gate.cta.continue-pro')}
        </button>
      </div>
    );
  }

  return null;
}

const QuickTradeImportModalContent: React.FC<
  QuickTradeImportModalContentProps
> = ({ plugin, closeModal }) => {
  const backendService = useMemo(() => new BackendTradeImportService(), []);
  const workflowService = useMemo(
    () => new TradeImportWorkflowService(plugin, backendService),
    [backendService, plugin]
  );
  const cachedQuickSetup = getCachedQuickTradeImportSetup();
  const hasInitialQuickSetupRef = useRef(cachedQuickSetup !== null);
  const requestVersionRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const { capabilities, setup, state } = quickSetupState;
  const updateQuickImportState = (nextState: TradeImportQuickImportState) => {
    dispatchQuickSetup({ type: 'state', state: nextState });
  };
  const [importState, dispatchImportState] = useReducer(
    (
      state: {
        file: File | null;
        preview: TradeImportPreviewResponse | null;
        classified: ClassifiedPreviewTrade[];
        result: TradeImportCompletionResult | null;
        isDragging: boolean;
      },
      update: Partial<{
        file: File | null;
        preview: TradeImportPreviewResponse | null;
        classified: ClassifiedPreviewTrade[];
        result: TradeImportCompletionResult | null;
        isDragging: boolean;
      }>
    ) => ({ ...state, ...update }),
    {
      file: null,
      preview: null,
      classified: [],
      result: null,
      isDragging: false,
    }
  );
  const { file, preview, classified, result, isDragging } = importState;

  const {
    isAuthenticated,
    isFeatureEnabled: canUseQuickTradeImport,
    isChecking: isCheckingEntitlement,
  } = useBackendProEntitlement(
    plugin,
    'quick trade import open',
    'quickTradeImport'
  );

  useEffect(() => {
    if (!canUseQuickTradeImport) {
      updateQuickImportState({ phase: 'idle' });
      return;
    }
    let cancelled = false;
    if (!hasInitialQuickSetupRef.current)
      updateQuickImportState({ phase: 'loading' });
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
          updateQuickImportState({
            phase: 'error',
            message: t('quick-import.message.capabilities-failed'),
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [backendService, canUseQuickTradeImport, isCheckingEntitlement, plugin]);

  const selectedBrokerCapabilities = useMemo(
    () => capabilities?.brokers.find((broker) => broker.id === setup?.broker),
    [capabilities, setup?.broker]
  );

  const openFullTradeImport = useCallback(async () => {
    if (file && setup) {
      setQuickImportTradeImportHandoff({
        file,
        broker: setup.broker,
        accountName: setup.accountName,
        assetType: setup.assetType,
        manualMode: setup.manualMode,
        dateFormat: setup.dateFormat,
        sheetName: setup.sheetName,
        headerRowIndex: setup.headerRowIndex,
        columnMappings: setup.columnMappings,
        aiMappingEnabled: setup.aiMappingEnabled,
        preview,
        classified,
      });
    }
    closeModal();
    await plugin.viewManager.openCSVImportView();
    window.dispatchEvent(new Event('journalit:quick-import-handoff-ready'));
  }, [classified, closeModal, file, plugin.viewManager, preview, setup]);

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
    openExternalUrl(UPGRADE_URL);
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
        preview: null,
        classified: [],
        result: null,
      });
      updateQuickImportState({ phase: 'analysing' });
      try {
        const analyseResult = await workflowService.analyseFile({
          file: selectedFile,
          capabilities,
          brokerCapabilities: selectedBrokerCapabilities,
          broker: setup.broker,
          sheetName: setup.sheetName,
          headerRowIndex: setup.headerRowIndex,
          aiMappingEnabled: setup.aiMappingEnabled,
        });
        if (requestVersionRef.current !== requestVersion) return;
        const nextSheetName =
          analyseResult.response.selectedSheet ??
          analyseResult.response.suggestedSheet ??
          setup.sheetName;
        const nextHeaderRowIndex =
          setup.headerRowIndex ??
          analyseResult.response.suggestedHeaderRowIndex ??
          null;
        const columnMappings =
          Object.keys(setup.columnMappings).length > 0
            ? setup.columnMappings
            : analyseResult.suggestedColumnMappings;

        if (
          setup.broker === 'MANUAL' &&
          Object.keys(columnMappings).length === 0
        ) {
          updateQuickImportState({
            phase: 'needs_full_import',
            message: t('quick-import.message.mapping-required'),
          });
          return;
        }

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
          manualMode: setup.manualMode,
          dateFormat: setup.dateFormat,
          columnMappings,
        });
        if (requestVersionRef.current !== requestVersion) return;
        dispatchImportState({
          preview: previewResult.response,
          classified: previewResult.classifiedTrades,
        });
        updateQuickImportState({ phase: 'ready_to_import' });
      } catch (error) {
        if (requestVersionRef.current !== requestVersion) return;
        updateQuickImportState({
          phase:
            error instanceof TradeImportValidationError
              ? 'error'
              : 'needs_full_import',
          message:
            error instanceof TradeImportValidationError
              ? error.message
              : t('quick-import.message.preview-failed'),
        });
      }
    },
    [capabilities, selectedBrokerCapabilities, setup, workflowService]
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
    if (!preview || classified.length === 0 || !setup) return;
    updateQuickImportState({ phase: 'importing' });
    const writeResult = await workflowService.writePreview({
      preview,
      classified,
      accountName: setup.accountName,
      brokerLabel: setup.brokerLabel,
      localWriteTimeoutMs: LOCAL_WRITE_TIMEOUT_MS,
    });
    dispatchImportState({ result: writeResult });
    updateQuickImportState({ phase: 'complete' });
  }, [classified, preview, setup, workflowService]);

  const accessGate = renderQuickImportAccessGate({
    canUseQuickTradeImport,
    isAuthenticated,
    isCheckingEntitlement,
    onSignIn: () => void handleSignIn(),
    onUpgrade: () => void handleUpgrade(),
  });
  if (accessGate) {
    return accessGate;
  }

  return (
    <QuickImportMainContent
      classified={classified}
      file={file}
      fileInputRef={fileInputRef}
      handleDrop={handleDrop}
      handleFileSelected={handleFileSelected}
      handleImport={handleImport}
      isDragging={isDragging}
      openFullTradeImport={openFullTradeImport}
      plugin={plugin}
      preview={preview}
      result={result}
      setDragging={(nextIsDragging) =>
        dispatchImportState({ isDragging: nextIsDragging })
      }
      setup={setup}
      state={state}
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
