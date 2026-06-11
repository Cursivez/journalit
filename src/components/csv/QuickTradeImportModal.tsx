import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
import {
  ensureCSVImportStyles,
  removeCSVImportStyles,
} from '../../styles/csvImportStyles';
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
  resolveQuickTradeImportSetup,
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
  if (classification === 'duplicate') {
    return (
      <span className="journalit-quick-import-result-icon is-duplicate">
        <Copy size={15} aria-label={label} />
      </span>
    );
  }
  if (classification === 'update_existing') {
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

const QuickTradeImportModalContent: React.FC<
  QuickTradeImportModalContentProps
> = ({ plugin, closeModal }) => {
  const backendService = useMemo(() => new BackendTradeImportService(), []);
  const workflowService = useMemo(
    () => new TradeImportWorkflowService(plugin, backendService),
    [backendService, plugin]
  );
  const requestVersionRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capabilities, setCapabilities] =
    useState<TradeImportCapabilities | null>(null);
  const [setup, setSetup] = useState<TradeImportQuickSetup | null>(null);
  const [state, setState] = useState<TradeImportQuickImportState>({
    phase: 'loading',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<TradeImportPreviewResponse | null>(
    null
  );
  const [classified, setClassified] = useState<ClassifiedPreviewTrade[]>([]);
  const [result, setResult] = useState<TradeImportCompletionResult | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);

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
    ensureCSVImportStyles();
    return () => removeCSVImportStyles();
  }, []);

  useEffect(() => {
    if (!canUseQuickTradeImport || isCheckingEntitlement) {
      setState({ phase: 'idle' });
      return;
    }
    let cancelled = false;
    setState({ phase: 'loading' });
    void (async () => {
      try {
        const loadedCapabilities = await backendService.getCapabilities();
        if (cancelled) return;
        const resolvedSetup = await resolveQuickTradeImportSetup(
          plugin,
          loadedCapabilities
        );
        if (cancelled) return;
        setCapabilities(loadedCapabilities);
        setSetup(resolvedSetup);
        setState({
          phase: resolvedSetup.state === 'ready' ? 'idle' : 'needs_full_import',
          message:
            resolvedSetup.state === 'ready'
              ? undefined
              : t('quick-import.message.needs-setup'),
        });
      } catch (_error) {
        if (!cancelled) {
          setState({
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
      () => document.dispatchEvent(new Event('journalit:subscription-changed')),
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
        setState({
          phase: 'needs_full_import',
          message: t('quick-import.message.needs-setup'),
        });
        return;
      }
      setFile(selectedFile);
      setPreview(null);
      setClassified([]);
      setResult(null);
      setState({ phase: 'analysing' });
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
          setState({
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
        setPreview(previewResult.response);
        setClassified(previewResult.classifiedTrades);
        setState({ phase: 'ready_to_import' });
      } catch (error) {
        if (requestVersionRef.current !== requestVersion) return;
        setState({
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
      setIsDragging(false);
      if (state.phase === 'importing') return;
      handleFileSelected(event.dataTransfer.files.item(0));
    },
    [handleFileSelected, state.phase]
  );

  const handleImport = useCallback(async () => {
    if (!preview || classified.length === 0 || !setup) return;
    setState({ phase: 'importing' });
    const writeResult = await workflowService.writePreview({
      preview,
      classified,
      accountName: setup.accountName,
      brokerLabel: setup.brokerLabel,
      localWriteTimeoutMs: LOCAL_WRITE_TIMEOUT_MS,
    });
    setResult(writeResult);
    setState({ phase: 'complete' });
  }, [classified, preview, setup, workflowService]);

  if (!isAuthenticated) {
    return (
      <div className="journalit-quick-import-modal">
        <p>{t('quick-import.gate.sign-in')}</p>
        <button type="button" className="mod-cta" onClick={handleSignIn}>
          {t('premium.gate.cta.signin-continue')}
        </button>
      </div>
    );
  }

  if (isCheckingEntitlement) {
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
        <button type="button" className="mod-cta" onClick={handleUpgrade}>
          {t('premium.gate.cta.continue-pro')}
        </button>
      </div>
    );
  }

  const duplicateCount = classified.filter(
    (item) => item.classification === 'duplicate'
  ).length;
  const failedCount = classified.filter(
    (item) => item.classification === 'failed'
  ).length;
  const writableCount = classified.length - duplicateCount - failedCount;
  const hasImportExceptions = duplicateCount > 0 || failedCount > 0;
  const isImporting = state.phase === 'importing';
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

      {!needsQuickImportSetup && state.phase === 'idle' && !file && (
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
            tabIndex={0}
            onClick={() => {
              if (!isImporting) fileInputRef.current?.click();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (!isImporting) fileInputRef.current?.click();
              }
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              if (isImporting) return;
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              event.preventDefault();
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null
                )
              ) {
                setIsDragging(false);
              }
            }}
            onDrop={handleDrop}
          >
            <Upload size={24} />
            <strong>
              {isDragging
                ? t('trade-import.action.drop-file')
                : t('quick-import.dropzone.title')}
            </strong>
            <span>{t('quick-import.dropzone.subtitle')}</span>
            <input
              ref={fileInputRef}
              type="file"
              className="journalit-quick-import-file-input"
              disabled={isImporting}
              onChange={(event) =>
                handleFileSelected(event.currentTarget.files?.item(0) ?? null)
              }
            />
          </div>
        </>
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
        <div className="journalit-quick-import-file-card">
          <CheckCircle size={18} />
          <div>
            <strong>{selectedFile.name}</strong>
            <span>
              {state.phase === 'ready_to_import' || state.phase === 'complete'
                ? t('quick-import.file.processed')
                : t('quick-import.file.selected')}
            </span>
          </div>
          {!isImporting && state.phase !== 'complete' && (
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
              handleFileSelected(event.currentTarget.files?.item(0) ?? null)
            }
          />
        </div>
      )}

      {state.phase === 'loading' && (
        <p className="journalit-quick-import-status">
          {t('quick-import.status.loading')}
        </p>
      )}
      {(state.phase === 'needs_full_import' || state.phase === 'error') && (
        <div className="journalit-quick-import-callout">
          <FileText size={16} />
          <span>{state.message}</span>
        </div>
      )}

      {preview && state.phase === 'ready_to_import' && (
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
                    <tr key={item.preview.csvImportId}>
                      <td>{item.preview.symbol}</td>
                      <td>{formatQuickImportDate(item.preview, plugin)}</td>
                      <td>
                        <QuickImportPnlCell
                          preview={item.preview}
                          plugin={plugin}
                        />
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
          <button type="button" onClick={openFullTradeImport}>
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
              onClick={handleImport}
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
