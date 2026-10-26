import { openImportManagement } from '../../services/tradeImport/importManagementNavigation';
import {
  tradeImportClassificationLabel,
  tradeImportCommitFailureLabel,
} from '../../services/tradeImport/classificationLabels';
import React, {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  ChevronDown,
  Download,
  FileText,
  Import,
  MoreHorizontal,
  Settings2,
  Sparkles,
  Star,
  Trash2,
  Upload,
} from '../shared/icons/ObsidianIcon';
import { Accordion } from '../shared/Accordion';
import { CollapsibleSection } from '../shared/CollapsibleSection';
import { Notice, Platform } from 'obsidian';
import { SubscriptionTierService } from '../../services/backend/SubscriptionTierService';
import { t } from '../../lang/helpers';
import JournalitPlugin from '../../main';
import { resolveUpgradeUrl } from '../../services/upgrade/upgradeOrigin';
import { useBackendProEntitlement } from '../../hooks/useBackendProEntitlement';
import { cssVars } from '../../styles/inlineStylePolicy';
import { openExternalUrl } from '../../utils/externalLinks';
import { DeviceFlowSignInModal } from '../auth/DeviceFlowSignInModal';
import { BackendTradeImportService } from '../../services/tradeImport/BackendTradeImportService';
import { TradeProjectionClient } from '../../services/tradeSync/TradeProjectionClient';
import { needsTradeImportAttention } from '../../services/tradeImport/commitEligibility';
import { consumeQuickImportTradeImportHandoff } from '../../services/tradeImport/quickImportHandoff';
import { consumeOnboardingTradeImportBroker } from '../../services/tradeImport/onboardingTradeImportHandoff';
import {
  customFieldDefinitions,
  TradeImportValidationError,
  TradeImportWorkflowService,
  type TradeImportCompletionResult,
} from '../../services/tradeImport/TradeImportWorkflowService';

import type {
  ClassifiedPreviewTrade,
  TradeImportCustomFieldDefinition,
  TradeImportAnalyseResponse,
  TradeImportCapabilities,
  TradeImportManualMode,
  TradeImportPreviewResponse,
} from '../../services/tradeImport/types';
import { flushTradeProjectionAcks } from '../../services/tradeSync/TradeProjectionAckQueue';
import { LocalTemplateService } from '../../services/csv/LocalTemplateService';
import type {
  LocalCSVTemplate,
  ManualImportMode,
  TradeField,
} from '../../services/csv/types';
import { getDateFormatOptions, TRADE_FIELDS } from '../../services/csv/types';
import {
  dateFormatForBroker,
  dateFormatOnBrokerSelection,
  hyperliquidDateFormatOptions,
  isDateFormatAllowedForBroker,
  isHyperliquidTradeHistory,
  resolveHyperliquidExportTimeZone,
} from './hyperliquidImportOptions';
import { writeClipboardText } from '../../utils/clipboard';
import {
  TradeImportDiagnostics,
  type TradeImportDiagnosticMappingActions,
  TradeImportPreviewReview,
  TradeImportRecoveryReview,
} from './TradeImportPreviewReview';
import {
  resolveBrokerImportAnalyseRecovery,
  resolveBrokerImportRecovery,
} from './brokerImportRecovery';
import { BROKER_GUIDE_URLS } from './brokerGuides';
import { NativeSourceRecoveryNotice } from './NativeSourceRecoveryNotice';
import type { NewColumnCustomField } from './CreateCustomFieldFromColumn';
import { openCustomFieldFromColumnModal } from './CustomFieldFromColumnModal';
import { choiceOptionsFromSamples } from './customFieldFromColumn';
import { TradeImportUnmappedColumns } from './TradeImportUnmappedColumns';
import { tradeImportAccountCurrency } from '../../services/tradeImport/accountCurrency';
import { TradeImportHeaderRowInput } from './TradeImportHeaderRowInput';
import { useWorkbookImageUrls } from './useWorkbookImageUrls';
import { TradeImportPnlFromPricesConfirm } from './TradeImportPnlFromPricesConfirm';
import { CustomFieldType } from '../../types/customFields';
import {
  TradeImportSourceGrid,
  TradeImportSourceSummary,
  TradeImportSyncSuggestion,
} from './TradeImportSourcePicker';
import {
  buildTradeImportSourceOptions,
  defaultTradeImportAssetType,
  isTradeImportAssetType,
  rememberTradeImportAssetType,
  tradeImportSourceLabel,
  type TradeImportAssetType,
} from '../../services/tradeImport/tradeImportSources';
import {
  getImportFormatOptions,
  importFormatForTile,
  importSourceTileId,
} from '../../services/onboarding/brokerCatalog';
import {
  rememberTradeImportDestination,
  resolveTradeImportDestination,
} from '../../services/tradeImport/importDestination';
import type { TradeImportDestination } from '../../services/tradeImport/types';
import { SegmentedControl } from '../shared/SegmentedControl';
import {
  getTradeImportCompletionTitle,
  TradeImportCompletionSummary,
} from './TradeImportCompletionSummary';
import { useTradeImportSyncSuggestion } from './useTradeImportSyncSuggestion';
import { buildImportOperationResult } from '../../services/tradeOperations/resultBuilders';
import type { TradeOperationResult } from '../../services/tradeOperations/types';
import {
  missingRequiredFieldsForMappings,
  normalizeManualColumnMappings,
  manualModeForBackend,
  requiredFieldsForManualMode,
  resolveManualImportMode,
} from '../../services/tradeImport/manualMappingValidation';

interface CSVImportProps {
  plugin: JournalitPlugin;
}
type AssetType = TradeImportAssetType;
type TradeImportWizardStep = 1 | 2 | 3;

const TRADE_IMPORT_STEP_NUMBERS: TradeImportWizardStep[] = [1, 2, 3];
const TRADE_FIELD_VALUES = new Set<string>(TRADE_FIELDS);

const isManualImportMode = (value: unknown): value is ManualImportMode =>
  value === 'price_based' || value === 'direct_pnl';

const isTradeField = (value: unknown): value is TradeField =>
  typeof value === 'string' && TRADE_FIELD_VALUES.has(value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function tradeImportResponseBody(
  error: unknown
): Record<string, unknown> | null {
  if (!isRecord(error) || !isRecord(error.context)) return null;
  return isRecord(error.context.responseBody)
    ? error.context.responseBody
    : null;
}

function freePreviewRateLimitMessage(error: unknown): string | null {
  const responseBody = tradeImportResponseBody(error);
  if (responseBody?.error !== 'free_preview_rate_limited') return null;
  const details = isRecord(responseBody.details) ? responseBody.details : null;
  const retryAfterSeconds =
    typeof details?.retryAfterSeconds === 'number'
      ? details.retryAfterSeconds
      : 0;
  return t('trade-import.notice.free-preview-rate-limited', {
    minutes: String(Math.max(1, Math.ceil(retryAfterSeconds / 60))),
  });
}

function freePreviewStorageLimitMessage(error: unknown): string | null {
  const responseBody = tradeImportResponseBody(error);
  if (responseBody?.error !== 'free_preview_storage_limit_reached') return null;
  const details = isRecord(responseBody.details) ? responseBody.details : null;
  const limit = typeof details?.limit === 'number' ? details.limit : 0;
  const storedItems =
    typeof details?.storedItems === 'number' ? details.storedItems : 0;
  const requestedItems =
    typeof details?.requestedItems === 'number' ? details.requestedItems : 0;
  return t('trade-import.notice.free-preview-storage-limit-reached', {
    limit: String(limit),
    storedItems: String(storedItems),
    requestedItems: String(requestedItems),
  });
}

function isFreePreviewCapacityError(error: unknown): boolean {
  const code = tradeImportResponseBody(error)?.error;
  return (
    code === 'free_preview_rate_limited' ||
    code === 'free_preview_storage_limit_reached'
  );
}

function previewErrorMessage(error: unknown): string {
  const rateLimitMessage = freePreviewRateLimitMessage(error);
  if (rateLimitMessage) return rateLimitMessage;
  const storageLimitMessage = freePreviewStorageLimitMessage(error);
  if (storageLimitMessage) return storageLimitMessage;
  if (error instanceof TradeImportValidationError) return error.message;
  return t('trade-import.notice.preview-failed');
}

function previewErrorDetails(error: unknown): string | null {
  const responseBody = tradeImportResponseBody(error);
  if (!responseBody || isFreePreviewCapacityError(error)) {
    return null;
  }
  const message = responseBody.message ?? responseBody.error;
  return typeof message === 'string' && message.trim() ? message : null;
}

function tradeImportPreviewErrorPresentation(error: unknown): {
  message: string;
  details: string | null;
  showGuidance: boolean;
} {
  return {
    message: previewErrorMessage(error),
    details: previewErrorDetails(error),
    showGuidance: !isFreePreviewCapacityError(error),
  };
}

interface DropdownOption {
  value: string;
  label: string;
}

const TradeImportSignInGate: React.FC<{ onSignIn: () => void }> = ({
  onSignIn,
}) => (
  <div className="journalit-csv-import journalit-trade-import-gate-view">
    <div className="journalit-trade-import-gate-card">
      <div className="journalit-trade-import-gate-brand" aria-hidden="true">
        <span>{t('trade-import.gate.brand-left')}</span>
        <div className="journalit-trade-import-gate-icon">
          <Import size={25} strokeWidth={1.8} />
        </div>
        <span>{t('trade-import.gate.brand-right')}</span>
      </div>

      <div className="journalit-trade-import-gate-copy">
        <h1>{t('trade-import.gate.sign-in.title')}</h1>
        <p className="journalit-trade-import-gate-description">
          {t('trade-import.gate.sign-in')}
        </p>
      </div>

      <div className="journalit-trade-import-gate-actions">
        <button
          type="button"
          className="journalit-trade-import-gate-primary"
          onClick={onSignIn}
        >
          {t('trade-import.gate.sign-in.cta')}
        </button>
      </div>
    </div>
  </div>
);

const PRIVACY_COPY_KEY = 'trade-import.privacy.copy' as const;
const PRIVACY_URL = 'https://journalit.co/privacy';
const LOCAL_WRITE_TIMEOUT_MS = 10000;
interface PortalMenuPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

function getPortalMenuPosition(
  element: HTMLElement,
  minimumWidth?: number
): PortalMenuPosition {
  const rect = element.getBoundingClientRect();
  const gap = 2;
  const viewportPadding = 12;
  const maxWidth = window.innerWidth - viewportPadding * 2;
  const width = Math.min(
    maxWidth,
    Math.max(rect.width, minimumWidth ?? rect.width)
  );
  const left = Math.min(
    Math.max(viewportPadding, rect.left),
    Math.max(viewportPadding, window.innerWidth - width - viewportPadding)
  );
  const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
  const availableHeight = Math.max(120, Math.min(320, spaceBelow - gap));

  return {
    top: Math.min(
      rect.bottom + gap,
      window.innerHeight - availableHeight - viewportPadding
    ),
    left,
    width,
    maxHeight: availableHeight,
  };
}

const TradeImportDropdown: React.FC<{
  label: string;
  value: string;
  options: DropdownOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
  className?: string;
  menuClassName?: string;
  menuMinWidth?: number;
  renderOptionAction?: (option: DropdownOption) => React.ReactNode;
}> = ({
  label,
  value,
  options,
  disabled = false,
  onChange,
  className,
  menuClassName,
  menuMinWidth,
  renderOptionAction,
}) => {
  const [menuState, dispatchMenuState] = useReducer(
    (
      state: { isOpen: boolean; menuPosition: PortalMenuPosition | null },
      update: Partial<{
        isOpen: boolean;
        menuPosition: PortalMenuPosition | null;
      }>
    ) => ({ ...state, ...update }),
    { isOpen: false, menuPosition: null }
  );
  const { isOpen, menuPosition } = menuState;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  const updateMenuPosition = useCallback(() => {
    if (!wrapperRef.current) return;
    dispatchMenuState({
      menuPosition: getPortalMenuPosition(wrapperRef.current, menuMinWidth),
    });
  }, [menuMinWidth]);

  useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !wrapperRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        dispatchMenuState({ isOpen: false });
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        dispatchMenuState({ isOpen: false });
      }
    };
    const handleScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Node && menuRef.current?.contains(target)) return;
      dispatchMenuState({ isOpen: false });
    };
    const handleReposition = () => updateMenuPosition();
    const handleWindowBlur = () => dispatchMenuState({ isOpen: false });
    const handleVisibilityChange = () => {
      if (window.activeDocument.hidden) dispatchMenuState({ isOpen: false });
    };
    const monitor = window.setInterval(() => {
      if (
        !window.activeDocument.hasFocus() ||
        !wrapperRef.current?.isConnected ||
        !wrapperRef.current.closest('.workspace-leaf.mod-active')
      ) {
        dispatchMenuState({ isOpen: false });
      }
    }, 150);
    const activeWindow = window.activeDocument.defaultView ?? window;
    const listenerDocument = window.activeDocument;
    listenerDocument.addEventListener('pointerdown', handlePointerDown);
    activeWindow.addEventListener('keydown', handleKeyDown, true);
    listenerDocument.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );
    window.addEventListener('pagehide', handleWindowBlur);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      listenerDocument.removeEventListener('pointerdown', handlePointerDown);
      activeWindow.removeEventListener('keydown', handleKeyDown, true);
      listenerDocument.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
      window.clearInterval(monitor);
      window.removeEventListener('pagehide', handleWindowBlur);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isOpen, updateMenuPosition]);

  const menu =
    isOpen && menuPosition
      ? createPortal(
          <div
            ref={menuRef}
            className={`journalit-home-period-menu journalit-trade-import-dropdown-menu journalit-trade-import-dropdown-menu--portal${menuClassName ? ` ${menuClassName}` : ''}`}
            style={cssVars({
              '--trade-import-menu-top': `${menuPosition.top}px`,
              '--trade-import-menu-left': `${menuPosition.left}px`,
              '--trade-import-menu-width': `${menuPosition.width}px`,
              '--trade-import-menu-max-height': `${menuPosition.maxHeight}px`,
            })}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value || '__empty__'}
                  className={`journalit-home-period-option journalit-trade-import-favorite-option${isSelected ? ' journalit-home-period-option--active' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      dispatchMenuState({ isOpen: false });
                    }}
                    className="journalit-trade-import-favorite-option__select"
                  >
                    <span
                      className="journalit-home-period-option__check"
                      aria-hidden="true"
                    >
                      {isSelected ? <Check size={10} strokeWidth={3} /> : null}
                    </span>
                    <span className="journalit-home-period-option__label">
                      {option.label}
                    </span>
                  </button>
                  {renderOptionAction?.(option)}
                </div>
              );
            })}
          </div>,
          window.activeDocument.body
        )
      : null;

  return (
    <div
      className={`journalit-home-period-wrapper journalit-trade-import-dropdown${className ? ` ${className}` : ''}`}
      ref={wrapperRef}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => dispatchMenuState({ isOpen: !isOpen })}
        className="journalit-home-period-selector journalit-trade-import-dropdown-trigger clickable-icon"
        aria-label={label}
      >
        <span>{selectedOption?.label ?? label}</span>
        <ChevronDown
          size={14}
          className={`journalit-home-period-chevron${isOpen ? ' journalit-home-period-chevron--open' : ''}`}
        />
      </button>
      {menu}
    </div>
  );
};

interface ImportAccountOption {
  name: string;
  id: string | null;
}

function accountOptions(plugin: JournalitPlugin): ImportAccountOption[] {
  const metadata = plugin.settings.account?.accountMetadata ?? {};
  const options = Object.values(metadata).flatMap((account) =>
    account.name ? [{ name: account.name, id: null }] : []
  );
  return options.length ? options : [{ name: 'Main Account', id: null }];
}

async function loadAccountOptions(
  plugin: JournalitPlugin
): Promise<ImportAccountOption[]> {
  const catalog = await plugin.accountPageService?.getAccountCatalog();
  const catalogOptions = (catalog ?? []).flatMap((account) =>
    !account.archived && account.name
      ? [{ name: account.name, id: account.id ?? null }]
      : []
  );
  return catalogOptions.length ? catalogOptions : accountOptions(plugin);
}

function asMappings(value: unknown): Record<string, string[]> {
  if (!value || typeof value !== 'object') return {};
  const mappings: Record<string, string[]> = {};
  for (const [key, columns] of Object.entries(value)) {
    if (Array.isArray(columns)) {
      mappings[key] = columns.flatMap((column) => {
        const mappedColumn = String(column);
        return mappedColumn ? [mappedColumn] : [];
      });
      continue;
    }
    if (typeof columns === 'string' && columns.trim()) {
      mappings[key] = [columns.trim()];
    }
  }
  return mappings;
}

const MULTI_COLUMN_MAPPING_FIELDS = new Set<string>([
  'tags',
  'images',
  'setup_ids',
  'mistake',
]);

function fieldLabel(field: string): string {
  const labels: Record<string, string> = {
    symbol: t('csv.mapper.field.symbol'),
    direction: t('csv.mapper.field.direction'),
    entry_time: t('csv.mapper.field.entry-time'),
    exit_time: t('csv.mapper.field.exit-time'),
    entry_price: t('csv.mapper.field.entry-price'),
    exit_price: t('csv.mapper.field.exit-price'),
    quantity: t('csv.mapper.field.quantity'),
    commission: t('form.field.commission'),
    fees: t('form.field.other-fees'),
    swap: t('form.field.swap'),
    profit_loss: t('form.field.profit-loss'),
    notes: t('csv.mapper.field.notes'),
    thesis: t('form.field.trade-thesis'),
    tags: t('tradelog.column.tags'),
    images: t('tradelog.column.image'),
    setup_ids: t('form.field.setup'),
    mistake: t('form.field.mistake'),
    asset_type: t('form.field.asset-type'),
    strike_price: t('form.field.strike-price'),
    expiration_date: t('form.field.expiration-date'),
    option_type: t('form.field.option-type'),
    contract_size: t('form.field.contract-size'),
    order_id: t('csv.mapper.field.order-id'),
    account_id: t('csv.mapper.field.account-id'),
    status: t('tradelog.column.status'),
  };
  return labels[field] ?? field;
}

function customFieldLabel(
  field: string,
  customFields: TradeImportCustomFieldDefinition[]
): string | null {
  if (!field.startsWith('custom:')) return null;
  const fieldKey = field.slice('custom:'.length);
  const definition = customFields.find(
    (customField) => (customField.fieldKey || customField.id) === fieldKey
  );
  return definition
    ? `${definition.label || fieldKey} (${fieldKey})`
    : fieldKey;
}

function mappingFieldLabel(
  field: string,
  customFields: TradeImportCustomFieldDefinition[]
): string {
  return customFieldLabel(field, customFields) ?? fieldLabel(field);
}

function isMultiColumnMappingField(
  field: string,
  customFields: TradeImportCustomFieldDefinition[]
): boolean {
  if (MULTI_COLUMN_MAPPING_FIELDS.has(field)) return true;
  if (!field.startsWith('custom:')) return false;
  const fieldKey = field.slice('custom:'.length);
  return customFields.some(
    (customField) =>
      (customField.fieldKey || customField.id) === fieldKey &&
      customField.type === 'multiselect'
  );
}

const CORE_TRADE_FIELDS: TradeField[] = [
  'quantity',
  'entry_price',
  'exit_time',
  'exit_price',
  'profit_loss',
  'commission',
  'fees',
  'swap',
];


function optionalCoreFields(
  requiredFields: readonly TradeField[],
  manualMode: TradeImportManualMode
): TradeField[] {
  const fields: TradeField[] =
    manualMode === 'price_based'
      ? [...CORE_TRADE_FIELDS, 'status']
      : CORE_TRADE_FIELDS;
  const required = new Set(requiredFields);
  return fields.filter((field) => !required.has(field));
}

function withoutField(
  mappings: Record<string, string[]>,
  field: string
): Record<string, string[]> {
  if (!(field in mappings)) return mappings;
  const next = { ...mappings };
  delete next[field];
  return next;
}

function fieldHelpText(): Record<string, string> {
  return {
    strike_price: t('csv.mapper.help.options-required'),
    expiration_date: t('csv.mapper.help.options-required'),
    option_type: t('csv.mapper.help.option-type-required'),
    contract_size: t('csv.mapper.help.contract-size'),
    order_id: t('csv.mapper.help.order-id'),
    asset_type: t('csv.mapper.help.asset-types'),
    status: t('csv.mapper.help.status'),
  };
}

function visibleFieldCategories(
  requiredFields: readonly TradeField[],
  manualMode: TradeImportManualMode,
  assetType: AssetType,
  customFields: TradeImportCustomFieldDefinition[]
): Record<string, string[]> {
  const categories: Record<string, string[]> = {
    [t('csv.mapper.category.required')]: [...requiredFields],
    [t('csv.mapper.category.optional-core')]: optionalCoreFields(
      requiredFields,
      manualMode
    ),
    [t('csv.mapper.category.identifiers')]: ['order_id', 'account_id'],
    [t('csv.mapper.category.other')]: [
      'notes',
      'thesis',
      'tags',
      'images',
      'setup_ids',
      'mistake',
      'asset_type',
    ],
  };
  if (assetType === 'options') {
    categories[t('csv.mapper.category.options')] = [
      'strike_price',
      'expiration_date',
      'option_type',
      'contract_size',
    ];
  } else if (assetType === 'futures') {
    categories[t('csv.mapper.category.futures')] = [
      'contract_size',
      'expiration_date',
    ];
  } else if (
    assetType === 'forex' &&
    !requiredFields.includes('contract_size')
  ) {
    
    
    categories[t('csv.mapper.category.optional-core')].push('contract_size');
  }
  if (customFields.length > 0) {
    categories[t('form.section.custom-fields')] = customFields.map(
      (field) => `custom:${field.fieldKey || field.id}`
    );
  }
  return categories;
}

function sampleValueForHeader(
  header: string,
  headers: string[],
  sampleRows: string[][]
): string {
  const columnIndex = headers.indexOf(header);
  if (columnIndex === -1) return '';
  const value = sampleRows[0]?.[columnIndex] ?? '';
  return value.length > 30 ? `${value.slice(0, 30)}...` : value;
}

function columnAssignmentsFromMappings(
  mappings: Record<string, string[]>,
  headers: string[]
): Record<string, string> {
  const assignments: Record<string, string> = {};
  for (const [field, columns] of Object.entries(
    normalizeManualColumnMappings(mappings, headers)
  )) {
    for (const column of columns) {
      if (!assignments[column]) assignments[column] = field;
    }
  }
  return assignments;
}

function updateColumnAssignment(
  mappings: Record<string, string[]>,
  column: string,
  nextField: string
): Record<string, string[]> {
  const next: Record<string, string[]> = {};
  for (const [field, columns] of Object.entries(mappings)) {
    const filteredColumns = columns.filter(
      (mappedColumn) => mappedColumn !== column
    );
    if (filteredColumns.length > 0) next[field] = filteredColumns;
  }
  if (nextField) {
    next[nextField] = [...(next[nextField] ?? []), column];
  }
  return next;
}


const TRADE_IMPORT_SYMBOL_EXAMPLE = 'CME_MINI:ES1!';

interface TradeImportPreviewActionProps {
  assetType: AssetType;
  busy: boolean;
  missingRequiredFields: TradeField[];
  
  pnlFromPricesAccepted?: boolean;
  ready: boolean;
  
  replacedByRecovery: boolean;
  onPreview: () => void;
}

const TradeImportPreviewAction: React.FC<TradeImportPreviewActionProps> = ({
  assetType,
  busy,
  missingRequiredFields,
  pnlFromPricesAccepted = false,
  ready,
  replacedByRecovery,
  onPreview,
}) => {
  if (replacedByRecovery) return null;
  const mappingIncomplete = missingRequiredFields.length > 0;

  return (
    <>
      {mappingIncomplete && (
        <div
          className="csv-message csv-message--error csv-message-spaced-bottom journalit-trade-import-mapping-requirements"
          role="status"
        >
          <strong>{t('notice.csv-missing-fields')}</strong>
          <p>{t('csv.mapper.missing-fields', { assetType })}</p>
          <ul>
            {missingRequiredFields.map((field) => (
              <li key={field}>{fieldLabel(field)}</li>
            ))}
          </ul>
          {pnlFromPricesAccepted &&
            missingRequiredFields.includes('profit_loss') && (
              <p>{t('csv.mapper.missing-fields.pnl-or-prices')}</p>
            )}
        </div>
      )}
      <button
        className="journalit-trade-import-primary"
        disabled={!ready || busy || mappingIncomplete}
        onClick={onPreview}
      >
        {t('trade-import.action.preview')}
      </button>
    </>
  );
};


const csvImportFavorites = (settings: JournalitPlugin['settings']) => ({
  account: settings.csvFavoriteAccount ?? '',
  broker: settings.csvFavoriteBroker ?? '',
  templateId: settings.csvFavoriteTemplateId ?? '',
});

const initialImportAccount = (
  favoriteAccount: string,
  accounts: readonly string[]
): string =>
  favoriteAccount && accounts.includes(favoriteAccount)
    ? favoriteAccount
    : accounts[0];

const onboardingAssetFocusOf = (plugin: JournalitPlugin) =>
  plugin.serviceManager.getInitializedOnboardingService()?.getState().answers
    .assetFocus;


const isBrokerDateFormatValid = (broker: string, dateFormat: string) =>
  !isHyperliquidTradeHistory(broker) ||
  isDateFormatAllowedForBroker(broker, dateFormat);


const workbookImagesIncludedFor = (
  preview: TradeImportPreviewResponse | null,
  excludedForImportId: string | null
): boolean => !preview || excludedForImportId !== preview.importId;

type ImportBrokerCapabilities = TradeImportCapabilities['brokers'][number];

const brokerCapabilitiesFor = (
  capabilities: TradeImportCapabilities | null,
  broker: string
): ImportBrokerCapabilities | undefined =>
  capabilities?.brokers.find((item) => item.id === broker);

const DEFAULT_IMPORT_EXTENSIONS = '.csv,.txt,.xlsx,.xls,.html,.htm';


function acceptedImportExtensions(
  capabilities: TradeImportCapabilities | null,
  brokerCapabilities: ImportBrokerCapabilities | undefined
): string[] {
  if (!capabilities) return DEFAULT_IMPORT_EXTENSIONS.split(',');
  const supported = brokerCapabilities
    ? new Set(brokerCapabilities.supportedFileTypes)
    : null;
  return capabilities.fileTypes.flatMap((type) =>
    !supported || supported.has(type.id)
      ? type.extensions.map((ext) => `.${ext}`)
      : []
  );
}


const supportsManualMappingFor = (
  broker: string,
  selectedTemplateId: string,
  brokerCapabilities: ImportBrokerCapabilities | undefined
): boolean => {
  const isManualBroker = broker === 'MANUAL';
  if (!isManualBroker && selectedTemplateId === '') return false;
  return brokerCapabilities?.supportsManualMapping ?? isManualBroker;
};

const manualModesOf = (capabilities: TradeImportCapabilities | null) =>
  capabilities?.manualMapping.modes ?? [];


const effectiveManualMode = (
  supportsManualMapping: boolean,
  choice: ManualImportMode | null,
  mappings: Record<string, string[]>,
  supportedModes: readonly string[]
): ManualImportMode =>
  supportsManualMapping
    ? resolveManualImportMode(
        choice,
        mappings,
        supportedModes.includes('trade_per_row')
      )
    : 'price_based';

interface DismissedAnalyseRecovery {
  file: File | null;
  selectedSource: string;
  recommendedSource: string;
}


function undismissedAnalyseRecovery(
  recovery: ReturnType<typeof resolveBrokerImportAnalyseRecovery> | null,
  dismissed: DismissedAnalyseRecovery | null,
  file: File | null,
  broker: string
) {
  if (!recovery || !dismissed) return recovery;
  const isDismissed =
    dismissed.file === file &&
    dismissed.selectedSource === broker &&
    dismissed.recommendedSource === recovery.recommendedSource;
  return isDismissed ? null : recovery;
}


function failedRowsOf(
  classified: readonly ClassifiedPreviewTrade[],
  importResult: TradeImportCompletionResult | null
): FailedImportRow[] {
  const failedItems = new Map(
    importResult?.failedItems.map((failed) => [failed.itemId, failed])
  );
  return classified.flatMap((item) => {
    const failed = failedItems.get(item.itemId);
    return failed || needsTradeImportAttention(item)
      ? [{ item, errorCode: failed?.errorCode }]
      : [];
  });
}

interface FailedImportRow {
  item: ClassifiedPreviewTrade;
  
  errorCode?: string;
}

const importDestinationFor = (
  capabilities: TradeImportCapabilities | null,
  destinations: NonNullable<
    JournalitPlugin['settings']['csvImportDestinations']
  >,
  broker: string
): TradeImportDestination | undefined =>
  capabilities
    ? resolveTradeImportDestination(
        { csvImportDestinations: destinations },
        capabilities,
        broker
      )
    : undefined;

const selectedSourceTileId = (
  syncOnlySourceId: string | null,
  broker: string,
  capabilities: TradeImportCapabilities | null
): string => syncOnlySourceId ?? importSourceTileId(broker, capabilities);

const templateNameOf = (
  service: LocalTemplateService,
  templateId: string
): string | undefined => service.getTemplate(templateId)?.name;


const offersAiMapping = (
  supportsManualMapping: boolean,
  brokerCapabilities: ImportBrokerCapabilities | undefined,
  canUseAiMapping: boolean
): boolean =>
  supportsManualMapping &&
  brokerCapabilities?.supportsAiMapping === true &&
  canUseAiMapping;

const canAnalyse = (
  file: File | null,
  capabilities: TradeImportCapabilities | null,
  busy: boolean
): boolean => !busy && file !== null && capabilities !== null;

const importDateFormatOptions = (isHyperliquid: boolean): DropdownOption[] =>
  isHyperliquid ? hyperliquidDateFormatOptions() : getDateFormatOptions();

function ManualTemplateSection({
  picker,
  actions,
  aiMapping,
  importPanel,
  exportPanel,
}: {
  picker: React.ComponentProps<typeof TemplatePicker>;
  actions: React.ComponentProps<typeof TemplateActionsMenu>;
  aiMapping: React.ComponentProps<typeof AiMappingToggle> & {
    offered: boolean;
  };
  importPanel: React.ComponentProps<typeof TemplateImportPanel> & {
    open: boolean;
  };
  
  exportPanel: React.ComponentProps<typeof TemplateExportPanel>;
}) {
  const { offered: aiMappingOffered, ...aiMappingToggle } = aiMapping;
  const { open: importPanelOpen, ...importPanelProps } = importPanel;
  return (
    <div className="journalit-trade-import-template-section">
      <div className="journalit-trade-import-template-picker-row">
        <TemplatePicker {...picker} />
        <TemplateActionsMenu {...actions} />
        {aiMappingOffered && <AiMappingToggle {...aiMappingToggle} />}
      </div>
      {importPanelOpen && <TemplateImportPanel {...importPanelProps} />}
      {exportPanel.code && <TemplateExportPanel {...exportPanel} />}
    </div>
  );
}


function hyperliquidReadiness(
  broker: string,
  brokerCapabilities: ImportBrokerCapabilities | undefined,
  dateFormatValid: boolean
) {
  const exportTimeZoneStatus = resolveHyperliquidExportTimeZone(
    broker,
    brokerCapabilities?.supportsExportTimeZone === true
  );
  return {
    exportTimeZoneStatus,
    hyperliquidPreviewReady: !exportTimeZoneStatus.errorKey && dateFormatValid,
  };
}

const canChangeSourceFromRecovery = (
  analyseFailureRecovery: ReturnType<typeof resolveBrokerImportRecovery>,
  preview: TradeImportPreviewResponse | null
): boolean =>
  (analyseFailureRecovery ?? resolveBrokerImportRecovery(preview))
    ?.canChangeSource === true;


const completedImportResult = (
  importCompleted: boolean,
  importResult: TradeImportCompletionResult | null
): TradeImportCompletionResult | null =>
  importCompleted ? importResult : null;


const furthestWizardStep = (
  importCompleted: boolean,
  preview: TradeImportPreviewResponse | null,
  analyse: TradeImportAnalyseResponse | null
): TradeImportWizardStep => {
  if (importCompleted || preview) return 3;
  return analyse ? 2 : 1;
};


const needsPnlFromPricesConfirmation = ({
  supportsManualMapping,
  backendManualMode,
  requiredMappingFields,
  selectedTemplateId,
  assetTypeConfirmed,
}: {
  supportsManualMapping: boolean;
  backendManualMode: TradeImportManualMode;
  requiredMappingFields: readonly TradeField[];
  selectedTemplateId: string;
  assetTypeConfirmed: boolean;
}): boolean =>
  supportsManualMapping &&
  backendManualMode === 'trade_per_row' &&
  requiredMappingFields.includes('exit_price') &&
  !selectedTemplateId &&
  !assetTypeConfirmed;

type TradeImportSyncCard = ReturnType<
  typeof useTradeImportSyncSuggestion
>['card'];
type TradeImportSourceChoice = ReturnType<
  typeof buildTradeImportSourceOptions
>[number];

const STEP_LABEL_KEYS = {
  1: 'trade-import.step.select',
  2: 'trade-import.step.analyse',
  3: 'trade-import.step.preview',
} as const;

function TradeImportStepper({
  maxStep,
  activeStep,
  busy,
  onSelect,
}: {
  maxStep: TradeImportWizardStep;
  activeStep: TradeImportWizardStep;
  busy: boolean;
  onSelect: (step: TradeImportWizardStep) => void;
}) {
  return (
    <div className="journalit-trade-import-stepper">
      {TRADE_IMPORT_STEP_NUMBERS.map((stepNumber) => {
        const label = t(STEP_LABEL_KEYS[stepNumber]);
        return (
          <button
            type="button"
            disabled={stepNumber > maxStep || busy}
            onClick={() => onSelect(stepNumber)}
            key={label}
            className={`journalit-trade-import-step ${maxStep >= stepNumber ? 'is-active' : ''} ${activeStep === stepNumber ? 'is-current' : ''}`}
          >
            <span>{stepNumber}</span>
            <strong>{label}</strong>
          </button>
        );
      })}
    </div>
  );
}

function SourceChoiceStep({
  syncCard,
  syncCardRevealRequest,
  sources,
  selectedId,
  busy,
  sourcesUnavailable,
  onOpenTradeSync,
  onSelect,
  changing,
  onCancel,
}: {
  syncCard: TradeImportSyncCard;
  syncCardRevealRequest: number;
  sources: TradeImportSourceChoice[];
  selectedId: string;
  busy: boolean;
  sourcesUnavailable: boolean;
  onOpenTradeSync: () => void;
  onSelect: (sourceId: string) => void;
  
  changing: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="journalit-trade-import-source-step">
      <div className="journalit-trade-import-source-step__header">
        <h3>{t('trade-import.source.title')}</h3>
        <p>{t('trade-import.source.subtitle')}</p>
      </div>
      
      {syncCard && (
        <TradeImportSyncSuggestion
          {...syncCard}
          busy={busy}
          revealRequest={syncCardRevealRequest}
          onOpenTradeSync={onOpenTradeSync}
        />
      )}
      <TradeImportSourceGrid
        sources={sources}
        selectedId={selectedId}
        busy={busy || sourcesUnavailable}
        
        autoFocusSearch={!Platform.isMobile}
        onSelect={onSelect}
      />
      {changing && (
        <button
          type="button"
          className="journalit-trade-import-source-step__cancel"
          onClick={onCancel}
        >
          {t('button.cancel')}
        </button>
      )}
    </div>
  );
}

function ChosenSourceHeader({
  source,
  brokerId,
  isFavorite,
  guideUrl,
  busy,
  showsHyperliquidGuidance,
  syncCard,
  onToggleFavorite,
  onChange,
  onOpenTradeSync,
}: {
  source: TradeImportSourceChoice | undefined;
  brokerId: string;
  isFavorite: boolean;
  guideUrl: string | undefined;
  busy: boolean;
  showsHyperliquidGuidance: boolean;
  syncCard: TradeImportSyncCard;
  onToggleFavorite: () => void;
  onChange: () => void;
  onOpenTradeSync: () => void;
}) {
  return (
    <>
      <TradeImportSourceSummary
        source={source}
        brokerId={brokerId}
        isFavorite={isFavorite}
        guideUrl={guideUrl}
        busy={busy}
        onOpenGuide={openExternalUrl}
        onToggleFavorite={onToggleFavorite}
        onChange={onChange}
      />
      {showsHyperliquidGuidance && (
        <p className="journalit-trade-import-hyperliquid-guidance">
          {t('trade-import.hyperliquid.export-guidance')}
        </p>
      )}
      {syncCard && (
        <TradeImportSyncSuggestion
          {...syncCard}
          busy={busy}
          onOpenTradeSync={onOpenTradeSync}
        />
      )}
    </>
  );
}

const chevronClass = (isOpen: boolean) =>
  `journalit-home-period-chevron${isOpen ? ' journalit-home-period-chevron--open' : ''}`;


function FavoriteOptionRow({
  label,
  selected,
  favorite,
  onSelect,
  onToggleFavorite,
}: {
  label: string;
  selected: boolean;
  
  favorite: boolean | undefined;
  onSelect: () => void;
  onToggleFavorite?: () => void;
}) {
  return (
    <div
      className={`journalit-home-period-option journalit-trade-import-favorite-option${selected ? ' journalit-home-period-option--active' : ''}`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="journalit-trade-import-favorite-option__select"
      >
        <span
          className="journalit-home-period-option__check"
          aria-hidden="true"
        >
          {selected ? <Check size={10} strokeWidth={3} /> : null}
        </span>
        <span className="journalit-home-period-option__label">{label}</span>
      </button>
      {favorite !== undefined && onToggleFavorite && (
        <button
          type="button"
          className={`journalit-trade-import-favorite-button${favorite ? ' is-favorite' : ''}`}
          aria-label={
            favorite
              ? t('csv.account-selector.favorite.remove')
              : t('csv.account-selector.favorite.set')
          }
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
        >
          <Star size={13} />
        </button>
      )}
    </div>
  );
}

function ImportAccountPicker({
  accounts,
  selectedAccount,
  favoriteAccount,
  isOpen,
  busy,
  containerRef,
  onToggleOpen,
  onSelect,
  onToggleFavorite,
}: {
  accounts: readonly string[];
  selectedAccount: string;
  favoriteAccount: string;
  isOpen: boolean;
  busy: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onToggleOpen: () => void;
  onSelect: (account: string) => void;
  onToggleFavorite: (account: string) => void;
}) {
  return (
    <label>
      {t('trade-import.label.account')}
      <div
        className="journalit-home-period-wrapper journalit-trade-import-account-picker"
        ref={containerRef}
      >
        <button
          type="button"
          disabled={busy}
          onClick={onToggleOpen}
          className="journalit-home-period-selector journalit-trade-import-account-trigger clickable-icon"
          aria-label={t('trade-import.label.account')}
        >
          <span>{selectedAccount}</span>
          <ChevronDown size={14} className={chevronClass(isOpen)} />
        </button>
        {isOpen && (
          <div className="journalit-home-period-menu journalit-trade-import-account-menu">
            {accounts.map((account) => (
              <FavoriteOptionRow
                key={account}
                label={account}
                selected={account === selectedAccount}
                favorite={favoriteAccount === account}
                onSelect={() => onSelect(account)}
                onToggleFavorite={() => onToggleFavorite(account)}
              />
            ))}
          </div>
        )}
      </div>
    </label>
  );
}

const ASSET_TYPE_OPTIONS = [
  ['stock', 'trade-import.asset.stock'],
  ['options', 'trade-import.asset.options'],
  ['futures', 'trade-import.asset.futures'],
  ['forex', 'trade-import.asset.forex'],
  ['crypto', 'trade-import.asset.crypto'],
] as const;

function AssetTypeField({
  assetType,
  busy,
  onSelect,
}: {
  assetType: AssetType;
  busy: boolean;
  onSelect: (assetType: AssetType) => void;
}) {
  return (
    <label>
      {t('trade-import.label.asset-type')}
      <TradeImportDropdown
        label={t('trade-import.label.asset-type')}
        disabled={busy}
        value={assetType}
        options={ASSET_TYPE_OPTIONS.map(([value, labelKey]) => ({
          value,
          label: t(labelKey),
        }))}
        onChange={(value) => {
          if (isTradeImportAssetType(value)) {
            onSelect(value);
          }
        }}
      />
    </label>
  );
}

function ImportFormatField({
  labelId,
  formats,
  broker,
  busy,
  onChange,
}: {
  labelId: string;
  formats: ReturnType<typeof getImportFormatOptions>;
  broker: string;
  busy: boolean;
  onChange: (brokerId: string) => void;
}) {
  if (formats.length === 0) return null;
  return (
    <div className="journalit-trade-import-choice-field">
      <span id={labelId}>{t('trade-import.label.export-format')}</span>
      <SegmentedControl<string>
        groupRole="radiogroup"
        ariaLabelledBy={labelId}
        size="small"
        fullWidth
        disabled={busy}
        value={broker}
        options={formats.map((format) => ({
          value: format.brokerId,
          label: format.label,
        }))}
        onChange={onChange}
      />
      <small>
        {formats.find((format) => format.brokerId === broker)?.hint}
      </small>
    </div>
  );
}

function ImportDestinationField({
  labelId,
  destination,
  busy,
  onChange,
}: {
  labelId: string;
  
  destination: TradeImportDestination | undefined;
  busy: boolean;
  onChange: (destination: TradeImportDestination) => void;
}) {
  if (!destination) return null;
  return (
    <div className="journalit-trade-import-choice-field">
      <span id={labelId}>{t('trade-import.label.destination')}</span>
      <SegmentedControl<TradeImportDestination>
        groupRole="radiogroup"
        ariaLabelledBy={labelId}
        size="small"
        fullWidth
        disabled={busy}
        value={destination}
        options={[
          {
            value: 'live',
            label: t('trade-import.destination.live'),
          },
          {
            value: 'backtest',
            label: t('trade-import.destination.backtest'),
          },
        ]}
        onChange={onChange}
      />
      {destination === 'backtest' && (
        <small>{t('trade-import.destination.backtest-hint')}</small>
      )}
    </div>
  );
}

function filePickerLabel(file: File | null, isDragging: boolean): string {
  if (file) return file.name;
  return isDragging
    ? t('trade-import.action.drop-file')
    : t('trade-import.action.choose-file');
}

function TradeImportFilePicker({
  file,
  isDragging,
  busy,
  inputRef,
  acceptedExtensions,
  acceptedExtensionList,
  onFileSelected,
  onDragEnter,
  onDragLeave,
  onDrop,
}: {
  file: File | null;
  isDragging: boolean;
  busy: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  acceptedExtensions: string;
  acceptedExtensionList: readonly string[];
  onFileSelected: (file: File | null) => void;
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className={`journalit-trade-import-file-picker ${isDragging ? 'is-dragging' : ''}`}
      role="button"
      tabIndex={busy ? -1 : 0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragEnter={onDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        aria-label={t('trade-import.action.choose-file')}
        ref={inputRef}
        type="file"
        accept={acceptedExtensions}
        disabled={busy}
        onChange={(event) => onFileSelected(event.target.files?.[0] ?? null)}
      />
      <FileText size={36} />
      <span className="journalit-trade-import-file-picker-label">
        {filePickerLabel(file, isDragging)}
      </span>
      <div className="journalit-trade-import-file-types" aria-hidden>
        {acceptedExtensionList.map((extension) => (
          <span key={extension}>{extension}</span>
        ))}
      </div>
    </div>
  );
}

function TemplatePicker({
  templates,
  selectedTemplateId,
  selectedTemplateName,
  favoriteTemplateId,
  isOpen,
  busy,
  containerRef,
  onToggleOpen,
  onClear,
  onApply,
  onToggleFavorite,
}: {
  templates: readonly LocalCSVTemplate[];
  selectedTemplateId: string;
  selectedTemplateName: string | undefined;
  favoriteTemplateId: string;
  isOpen: boolean;
  busy: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onToggleOpen: () => void;
  onClear: () => void;
  onApply: (template: LocalCSVTemplate) => void;
  onToggleFavorite: (templateId: string) => void;
}) {
  return (
    <label>
      {t('trade-import.label.template')}
      <div
        className="journalit-home-period-wrapper journalit-trade-import-template-picker"
        ref={containerRef}
      >
        <button
          type="button"
          disabled={busy}
          onClick={onToggleOpen}
          className="journalit-home-period-selector journalit-trade-import-template-trigger clickable-icon"
          aria-label={t('trade-import.label.template')}
        >
          <span>
            {selectedTemplateId
              ? selectedTemplateName
              : t('trade-import.template.none')}
          </span>
          <ChevronDown size={14} className={chevronClass(isOpen)} />
        </button>
        {isOpen && (
          <div className="journalit-home-period-menu journalit-trade-import-template-select-menu">
            <FavoriteOptionRow
              label={t('trade-import.template.none')}
              selected={selectedTemplateId === ''}
              favorite={undefined}
              onSelect={onClear}
            />
            {templates.map((template) => (
              <FavoriteOptionRow
                key={template.id}
                label={template.name}
                selected={template.id === selectedTemplateId}
                favorite={favoriteTemplateId === template.id}
                onSelect={() => onApply(template)}
                onToggleFavorite={() => onToggleFavorite(template.id)}
              />
            ))}
          </div>
        )}
      </div>
    </label>
  );
}

function TemplateActionsMenu({
  containerRef,
  menuRef,
  isOpen,
  position,
  busy,
  hasSelection,
  onToggle,
  onImport,
  onExport,
  onDelete,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  
  position: PortalMenuPosition | null;
  busy: boolean;
  hasSelection: boolean;
  onToggle: () => void;
  onImport: () => void;
  onExport: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      ref={containerRef}
      className="journalit-trade-import-template-menu-wrapper"
    >
      <button
        type="button"
        className="journalit-trade-import-template-menu-trigger"
        disabled={busy}
        aria-label={t('trade-import.label.template-actions')}
        onClick={onToggle}
      >
        <MoreHorizontal size={16} />
      </button>
      {isOpen &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            className="journalit-trade-import-template-menu journalit-trade-import-template-menu--portal"
            style={cssVars({
              '--trade-import-menu-top': `${position.top}px`,
              '--trade-import-menu-left': `${position.left}px`,
              '--trade-import-menu-width': `${position.width}px`,
              '--trade-import-menu-max-height': `${position.maxHeight}px`,
            })}
          >
            <button type="button" onClick={onImport}>
              <Upload size={15} aria-hidden="true" />
              {t('csv.template-import.button.import')}
            </button>
            <button type="button" disabled={!hasSelection} onClick={onExport}>
              <Download size={15} aria-hidden="true" />
              {t('csv.button.export-template')}
            </button>
            <button type="button" disabled={!hasSelection} onClick={onDelete}>
              <Trash2 size={15} aria-hidden="true" />
              {t('csv.button.delete-template')}
            </button>
          </div>,
          window.activeDocument.body
        )}
    </div>
  );
}

function AiMappingToggle({
  checked,
  busy,
  onChange,
}: {
  checked: boolean;
  busy: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <label className="journalit-trade-import-ai-toggle">
      <input
        type="checkbox"
        disabled={busy}
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
      />
      <span>{t('trade-import.label.ai-mapping')}</span>
    </label>
  );
}

function TemplateImportPanel({
  shareCode,
  busy,
  onChange,
  onImport,
  onCancel,
}: {
  shareCode: string;
  busy: boolean;
  onChange: (shareCode: string) => void;
  onImport: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="journalit-trade-import-template-panel">
      <label>
        {t('csv.template-import.label.share-code')}
        <input
          type="text"
          disabled={busy}
          value={shareCode}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t('csv.template-import.placeholder.share-code')}
        />
      </label>
      <div className="journalit-trade-import-template-actions">
        <button disabled={!shareCode.trim() || busy} onClick={onImport}>
          {t('csv.template-import.button.import')}
        </button>
        <button disabled={busy} onClick={onCancel}>
          {t('button.cancel')}
        </button>
      </div>
    </div>
  );
}

function TemplateExportPanel({
  code,
  copied,
  onCopy,
}: {
  code: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="journalit-trade-import-template-panel">
      <label>
        {t('csv.export-template.label.share-code')}
        <textarea readOnly value={code} />
      </label>
      <button onClick={onCopy}>
        {copied
          ? t('csv.export-template.button.copied')
          : t('csv.export-template.button.copy')}
      </button>
    </div>
  );
}

function TradeImportPrivacyNote() {
  return (
    <Accordion
      title={t('trade-import.step.privacy')}
      defaultExpanded={false}
      className="journalit-trade-import-accordion"
    >
      <p className="journalit-trade-import-privacy-note">
        {t(PRIVACY_COPY_KEY)}{' '}
        <button
          type="button"
          className="journalit-trade-import-inline-link"
          onClick={() => openExternalUrl(PRIVACY_URL)}
        >
          {t('button.learn-more')}
        </button>
      </p>
    </Accordion>
  );
}

type ManualMappingCustomFields = ReturnType<typeof customFieldDefinitions>;


function mappingOptionsForHeader(
  selectedField: string,
  assignments: Record<string, string>,
  customFields: ManualMappingCustomFields,
  perRowMode: boolean
): DropdownOption[] {
  const usedSingleFields = new Set(
    Object.values(assignments).filter(
      (field) =>
        field !== selectedField &&
        !isMultiColumnMappingField(field, customFields)
    )
  );
  const isOffered = (field: string) =>
    field === selectedField || !usedSingleFields.has(field);
  
  const tradeFieldOptions = TRADE_FIELDS.flatMap((field) =>
    (field !== 'status' || !perRowMode) && isOffered(field)
      ? [{ value: field, label: fieldLabel(field) }]
      : []
  );
  const customFieldOptions = customFields.flatMap((field) => {
    const fieldKey = field.fieldKey || field.id;
    const option = {
      value: `custom:${fieldKey}`,
      label: `${field.label || fieldKey} (${fieldKey})`,
    };
    return isOffered(option.value) ? [option] : [];
  });
  return [
    { value: '', label: t('csv.mapper.do-not-import') },
    ...tradeFieldOptions,
    ...customFieldOptions,
  ];
}

function ColumnMappingRow({
  header,
  selectedField,
  required,
  sampleValue,
  options,
  busy,
  onChange,
}: {
  header: string;
  selectedField: string;
  required: boolean;
  sampleValue: string | undefined;
  options: DropdownOption[];
  busy: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="csv-mapper-row">
      <div className="csv-mapper-source">
        <div className="csv-column-header">
          <div className="csv-column-name">
            <span>{header}</span>
            {required && (
              <span className="csv-required-badge csv-required-badge--source">
                {t('csv.mapper.required-badge')}
              </span>
            )}
          </div>
          {sampleValue && (
            <div className="csv-column-sample">
              {t('csv.mapper.example')}{' '}
              <span className="csv-sample-value">{sampleValue}</span>
            </div>
          )}
        </div>
      </div>
      <div className="csv-mapper-arrow">→</div>
      <div className="csv-mapper-target">
        <TradeImportDropdown
          label={t('csv.mapper.aria.map-column', { header })}
          disabled={busy}
          value={selectedField}
          options={options}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

const MANUAL_MODE_OPTIONS = [
  ['direct_pnl', 'trade-import.manual-mode.direct-pnl'],
  ['price_based', 'trade-import.manual-mode.price-based'],
] as const;

function ManualModePicker({
  titleId,
  manualMode,
  busy,
  onChange,
}: {
  titleId: string;
  manualMode: ManualImportMode;
  busy: boolean;
  onChange: (mode: ManualImportMode) => void;
}) {
  return (
    <div className="journalit-trade-import-manual-mode">
      <div id={titleId} className="journalit-trade-import-manual-mode-title">
        {t('csv.mapper.mode.title')}
      </div>
      <p>{t('csv.mapper.mode.help')}</p>
      <div
        className="journalit-trade-import-manual-mode-options"
        role="radiogroup"
        aria-labelledby={titleId}
      >
        {MANUAL_MODE_OPTIONS.map(([value, labelKey]) => (
          <label
            key={value}
            className={`journalit-trade-import-manual-mode-option${manualMode === value ? ' is-selected' : ''}${busy ? ' is-disabled' : ''}`}
          >
            <input
              type="radio"
              name="journalit-trade-import-manual-mode"
              value={value}
              disabled={busy}
              checked={manualMode === value}
              onChange={(event) => {
                if (isManualImportMode(event.target.value)) {
                  onChange(event.target.value);
                }
              }}
            />
            <span>{t(labelKey)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function MappingSummary({
  assignments,
  headerCount,
  requiredMappingFields,
}: {
  assignments: Record<string, string>;
  headerCount: number;
  requiredMappingFields: readonly TradeField[];
}) {
  const mappedFields = new Set(Object.values(assignments));
  const allRequiredMapped = requiredMappingFields.every((field) =>
    mappedFields.has(field)
  );
  return (
    <div className="csv-mapper-summary csv-mapper-summary--box">
      <strong>{t('csv.mapper.summary.title')}</strong>{' '}
      {Object.values(assignments).filter(Boolean).length}{' '}
      {t('csv.mapper.summary.of')} {headerCount}{' '}
      {t('csv.mapper.summary.columns-mapped')}
      {allRequiredMapped && (
        <span className="csv-mapper-summary-success">
          ✓ {t('csv.mapper.summary.all-mapped')}
        </span>
      )}
    </div>
  );
}

function MappingFieldItem({
  mapped,
  required,
  label,
  helpText,
}: {
  mapped: boolean;
  required: boolean;
  label: string;
  helpText: string | undefined;
}) {
  const state = mapped ? 'mapped' : 'unmapped';
  return (
    <div className={`csv-field-item csv-field-item--${state}`}>
      <span className="csv-field-item-icon">{mapped ? '✓' : '○'}</span>
      <strong>{label}</strong>
      {required && (
        <span className={`csv-field-required csv-field-required--${state}`}>
          {t('csv.mapper.required-label')}
        </span>
      )}
      {helpText && <span className="csv-field-help">: {helpText}</span>}
    </div>
  );
}

function MappingFieldsReference({
  assignments,
  requiredMappingFields,
  backendManualMode,
  assetType,
  customFields,
}: {
  assignments: Record<string, string>;
  requiredMappingFields: readonly TradeField[];
  backendManualMode: TradeImportManualMode;
  assetType: AssetType;
  customFields: ManualMappingCustomFields;
}) {
  const mappedFields = new Set(Object.values(assignments));
  const helpText = fieldHelpText();
  const requiredFields = new Set<string>(requiredMappingFields);
  return (
    <div className="csv-mapper-fields-reference">
      <p className="csv-mapper-fields-desc">
        {t('csv.mapper.available-fields.desc')}
      </p>
      {Object.entries(
        visibleFieldCategories(
          requiredMappingFields,
          backendManualMode,
          assetType,
          customFields
        )
      ).map(([category, fields]) => (
        <div key={category} className="csv-field-category">
          <h4 className="csv-field-category-title">{category}</h4>
          <div className="csv-field-category-list">
            {fields.map((field) => (
              <MappingFieldItem
                key={field}
                mapped={mappedFields.has(field)}
                required={isTradeField(field) && requiredFields.has(field)}
                label={mappingFieldLabel(field, customFields)}
                helpText={helpText[field]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ManualColumnMapper({
  plugin,
  analyse,
  columnMappings,
  requiredMappingFields,
  backendManualMode,
  manualMode,
  assetType,
  perRowMode,
  busy,
  modeTitleId,
  templateName,
  onManualModeChange,
  onAssignColumn,
  onCreateCustomField,
  onTemplateNameChange,
  onSaveTemplate,
}: {
  plugin: JournalitPlugin;
  analyse: TradeImportAnalyseResponse;
  
  columnMappings: Record<string, string[]>;
  requiredMappingFields: readonly TradeField[];
  backendManualMode: TradeImportManualMode;
  manualMode: ManualImportMode;
  assetType: AssetType;
  perRowMode: boolean;
  busy: boolean;
  modeTitleId: string;
  templateName: string;
  onManualModeChange: (mode: ManualImportMode) => void;
  onAssignColumn: (header: string, field: string) => void;
  onCreateCustomField: (
    header: string,
    field: NewColumnCustomField,
    samples: readonly string[]
  ) => Promise<boolean>;
  onTemplateNameChange: (name: string) => void;
  onSaveTemplate: () => void;
}) {
  const { headers, sampleRows } = analyse;
  const assignments = columnAssignmentsFromMappings(columnMappings, headers);
  const customFields = customFieldDefinitions(plugin);
  const requiredFields = new Set<string>(requiredMappingFields);
  return (
    <div className="csv-column-mapper journalit-trade-import-inline-mapper">
      <div className="csv-mapper-header">
        <h3>{t('csv.mapper.title')}</h3>
        <p>{t('csv.mapper.subtitle')}</p>
      </div>
      <ManualModePicker
        titleId={modeTitleId}
        manualMode={manualMode}
        busy={busy}
        onChange={onManualModeChange}
      />
      <div className="csv-message csv-message--info csv-tip-message">
        <strong>{t('csv.mapper.tip.title')}</strong>
        <p className="csv-tip-text">{t('csv.mapper.tip.desc')}</p>
      </div>
      <div className="csv-mapper-grid-container">
        <div className="csv-mapper-grid">
          {headers.map((header) => {
            const selectedField = assignments[header] ?? '';
            return (
              <ColumnMappingRow
                key={header}
                header={header}
                selectedField={selectedField}
                required={
                  isTradeField(selectedField) &&
                  requiredFields.has(selectedField)
                }
                sampleValue={sampleValueForHeader(header, headers, sampleRows)}
                options={mappingOptionsForHeader(
                  selectedField,
                  assignments,
                  customFields,
                  perRowMode
                )}
                busy={busy}
                onChange={(value) => onAssignColumn(header, value)}
              />
            );
          })}
        </div>
      </div>
      <TradeImportUnmappedColumns
        headers={headers}
        sampleRows={sampleRows}
        assignments={assignments}
        busy={busy}
        onKeep={(header, samples) =>
          openCustomFieldFromColumnModal(plugin.app, {
            header,
            sampleValues: samples,
            existingLabels: customFields.map((field) => field.label),
            onCreate: (field) => onCreateCustomField(header, field, samples),
          })
        }
      />
      <MappingSummary
        assignments={assignments}
        headerCount={headers.length}
        requiredMappingFields={requiredMappingFields}
      />
      <div className="csv-mapper-fields-section">
        <Accordion
          title={t('csv.mapper.available-fields.title')}
          defaultExpanded={false}
        >
          <MappingFieldsReference
            assignments={assignments}
            requiredMappingFields={requiredMappingFields}
            backendManualMode={backendManualMode}
            assetType={assetType}
            customFields={customFields}
          />
        </Accordion>
      </div>
      <div className="journalit-trade-import-save-template-row">
        <label>
          {t('trade-import.label.save-template')}
          <input
            type="text"
            disabled={busy}
            value={templateName}
            onChange={(event) => onTemplateNameChange(event.target.value)}
            placeholder={t('trade-import.placeholder.template-name')}
          />
        </label>
        <button
          disabled={!templateName.trim() || busy}
          onClick={onSaveTemplate}
        >
          {t('trade-import.action.save-template')}
        </button>
      </div>
    </div>
  );
}

type AnalyseFailureRecovery = ReturnType<typeof resolveBrokerImportRecovery>;
type AnalyseSourceRecovery = ReturnType<
  typeof resolveBrokerImportAnalyseRecovery
>;


function AnalyseSourceReview({
  analyse,
  broker,
  selectedBrokerLabel,
  supportsManualMapping,
  analyseRecovery,
  failureRecovery,
  busy,
  onContinueWithSelectedSource,
  onSwitchSource,
  onChangeSource,
  onChooseAnotherFile,
}: {
  analyse: TradeImportAnalyseResponse;
  broker: string;
  selectedBrokerLabel: string;
  supportsManualMapping: boolean;
  analyseRecovery: AnalyseSourceRecovery;
  failureRecovery: AnalyseFailureRecovery;
  busy: boolean;
  onContinueWithSelectedSource: (recommendedSource: string) => void;
  onSwitchSource: (source: string) => void;
  onChangeSource: () => void;
  onChooseAnotherFile: () => void;
}) {
  return (
    <>
      {!failureRecovery && (
        <p>
          {t(
            supportsManualMapping
              ? 'trade-import.analyse.detected'
              : 'trade-import.analyse.detected-native',
            { fileType: analyse.fileType }
          )}
        </p>
      )}
      {analyseRecovery && (
        <NativeSourceRecoveryNotice
          className="journalit-trade-import-outcome journalit-trade-import-outcome--failed"
          disabled={busy}
          iconSize={20}
          recovery={analyseRecovery}
          selectedSource={broker}
          selectedSourceLabel={
            
            broker === 'MANUAL'
              ? t('trade-import.broker.manual')
              : selectedBrokerLabel
          }
          onContinueWithSelectedSource={() =>
            onContinueWithSelectedSource(analyseRecovery.recommendedSource)
          }
          onSwitchSource={() =>
            onSwitchSource(analyseRecovery.recommendedSource)
          }
        />
      )}
      {failureRecovery && !analyseRecovery ? (
        <TradeImportRecoveryReview
          recovery={failureRecovery}
          diagnostics={analyse.diagnostics}
          busy={busy}
          onChangeSource={onChangeSource}
          onChooseAnotherFile={onChooseAnotherFile}
        />
      ) : (
        <TradeImportDiagnostics
          diagnostics={analyse.diagnostics.filter(
            (diagnostic) => !failureRecovery?.suppressesDiagnostic(diagnostic)
          )}
          defaultOpen={true}
        />
      )}
    </>
  );
}

function AnalyseReviewControls({
  analyse,
  busy,
  selectedSheetName,
  headerRowError,
  dateFormat,
  dateFormatOptions,
  onSelectSheet,
  onClearHeaderRowError,
  onCommitHeaderRow,
  onDateFormatChange,
}: {
  analyse: TradeImportAnalyseResponse;
  busy: boolean;
  selectedSheetName: string | null;
  headerRowError: string | null;
  dateFormat: string;
  dateFormatOptions: DropdownOption[];
  onSelectSheet: (sheetName: string) => void;
  onClearHeaderRowError: () => void;
  onCommitHeaderRow: (sheetRow: number) => void;
  onDateFormatChange: (format: string) => void;
}) {
  
  if (analyse.sheets.length === 0) return null;
  return (
    <div className="journalit-trade-import-review-controls">
      {analyse.sheets.length > 1 && (
        <label>
          <span>{t('trade-import.label.sheet')}</span>
          <TradeImportDropdown
            label={t('trade-import.label.sheet')}
            disabled={busy}
            value={selectedSheetName ?? ''}
            options={analyse.sheets.map((sheet) => ({
              value: sheet.name,
              label: sheet.name,
            }))}
            onChange={onSelectSheet}
          />
        </label>
      )}
      {analyse.headerSheetRow !== undefined && (
        <TradeImportHeaderRowInput
          key={`${analyse.importId}:${analyse.headerSheetRow}`}
          sheetRow={analyse.headerSheetRow}
          disabled={busy}
          error={headerRowError}
          onClearError={onClearHeaderRowError}
          onCommit={onCommitHeaderRow}
        />
      )}
      <label className="journalit-trade-import-date-format-control">
        <span>{t('trade-import.label.date-format')}</span>
        <TradeImportDropdown
          label={t('trade-import.label.date-format')}
          disabled={busy}
          value={dateFormat}
          options={dateFormatOptions}
          menuClassName="journalit-trade-import-date-format-menu"
          menuMinWidth={520}
          onChange={onDateFormatChange}
        />
      </label>
    </div>
  );
}

function ExportTimeZoneError({
  errorKey,
}: {
  errorKey: ReturnType<typeof resolveHyperliquidExportTimeZone>['errorKey'];
}) {
  if (!errorKey) return null;
  return (
    <div className="csv-message csv-message--error" role="alert">
      {t(errorKey)}
    </div>
  );
}

function AnalyseSampleTable({
  analyse,
}: {
  analyse: TradeImportAnalyseResponse;
}) {
  
  if (analyse.headers.length === 0) return null;
  return (
    <div className="csv-preview-table-wrapper journalit-trade-import-sample">
      <table className="csv-preview-table">
        <thead>
          <tr>
            {analyse.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {analyse.sampleRows.map((row) => (
            <tr key={row.join('\u001f')}>
              {row.map((cell, cellIndex) => (
                <td key={`${analyse.headers[cellIndex] ?? cellIndex}:${cell}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PreviewErrorState {
  message: string;
  details: string | null;
  showGuidance: boolean;
}

function PreviewErrorMessage({ error }: { error: PreviewErrorState | null }) {
  if (!error) return null;
  return (
    <div className="csv-message csv-message--error journalit-trade-import-preview-error">
      <strong>{error.message}</strong>
      {error.details && <p>{error.details}</p>}
      {error.showGuidance && <p>{t('trade-import.preview-error.guidance')}</p>}
    </div>
  );
}

function ImportSymbolField({
  required,
  value,
  busy,
  onChange,
}: {
  
  required: boolean;
  value: string;
  busy: boolean;
  onChange: (value: string) => void;
}) {
  if (!required) return null;
  return (
    <label className="journalit-trade-import-symbol-field">
      {t('trade-import.label.symbol')}
      <input
        type="text"
        disabled={busy}
        value={value}
        placeholder={TRADE_IMPORT_SYMBOL_EXAMPLE}
        autoComplete="off"
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
      />
      <small>{t('trade-import.symbol.hint')}</small>
    </label>
  );
}


function isPreviewReady({
  file,
  capabilities,
  analyse,
  analyseRecovery,
  failureRecovery,
  needsAssetTypeConfirmation,
  isHyperliquid,
  hyperliquidPreviewReady,
  importSymbol,
}: {
  file: File | null;
  capabilities: TradeImportCapabilities | null;
  analyse: TradeImportAnalyseResponse;
  
  analyseRecovery: AnalyseSourceRecovery;
  failureRecovery: AnalyseFailureRecovery;
  needsAssetTypeConfirmation: boolean;
  isHyperliquid: boolean;
  hyperliquidPreviewReady: boolean;
  importSymbol: string;
}): boolean {
  if (!file || !capabilities) return false;
  if (analyseRecovery || failureRecovery) return false;
  if (needsAssetTypeConfirmation) return false;
  if (isHyperliquid && !hyperliquidPreviewReady) return false;
  return !analyse.requiresSymbol || importSymbol.trim() !== '';
}


function TradeImportPreviewHeader({
  completedResult,
  operationResult,
  headingId,
  onReset,
}: {
  completedResult: TradeImportCompletionResult | null;
  operationResult: TradeOperationResult | null;
  headingId: string;
  onReset: () => void;
}) {
  if (!completedResult) {
    return (
      <div>
        <h2>
          <BadgeCheck /> {t('trade-import.step.preview')}
        </h2>
      </div>
    );
  }
  const hasIssues =
    operationResult?.partial === true ||
    completedResult.failedCount > 0 ||
    completedResult.pendingCount > 0;
  return (
    <div className="journalit-trade-import-completion-header">
      <h2 id={headingId}>
        {hasIssues ? <AlertTriangle /> : <BadgeCheck />}{' '}
        {getTradeImportCompletionTitle(completedResult, operationResult)}
      </h2>
      <button
        type="button"
        className="journalit-trade-import-completion-header__reset"
        onClick={onReset}
      >
        {t('csv.button.import-another')}
      </button>
    </div>
  );
}

function FailedPreviewRow({
  item,
  errorCode,
}: {
  item: ClassifiedPreviewTrade;
  errorCode?: string;
}) {
  
  const rows = item.preview.sourceSheetRows ?? item.preview.sourceRows;
  return (
    <div className="csv-error-group-example">
      {rows.length > 0 && (
        <>
          {t('csv.errors.rows', {
            rows: rows.join(', '),
          })}
          {' — '}
        </>
      )}
      <strong>{item.preview.symbol || '—'}</strong>
      {' — '}
      {tradeImportCommitFailureLabel(errorCode) ??
        item.message ??
        tradeImportClassificationLabel(item.classification)}
    </div>
  );
}

function TradeImportCompletedResults({
  plugin,
  result,
  operationResult,
  headingId,
  diagnostics,
  failedRows,
  onManageImports,
}: {
  plugin: JournalitPlugin;
  result: TradeImportCompletionResult;
  operationResult: TradeOperationResult | null;
  headingId: string;
  diagnostics: TradeImportPreviewResponse['diagnostics'];
  failedRows: readonly FailedImportRow[];
  onManageImports: () => void;
}) {
  
  const problemsOpen = result.writtenCount === 0;
  return (
    <div className="csv-import-results journalit-trade-import-results">
      <TradeImportCompletionSummary
        plugin={plugin}
        result={result}
        operationResult={operationResult}
        headingId={headingId}
      />
      
      {result.createdOnServer && (
        <p className="journalit-trade-import-undo-hint">
          {t('trade-import.completion.wrong-account')}{' '}
          <button
            type="button"
            className="journalit-trade-import-inline-link"
            onClick={onManageImports}
          >
            {t('trade-import.completion.undo-import')}
          </button>
        </p>
      )}
      <TradeImportDiagnostics
        diagnostics={diagnostics}
        defaultOpen={problemsOpen}
        className="csv-results-problems"
      />
      {failedRows.length > 0 && (
        <CollapsibleSection
          title={t('csv.results.errors-header', {
            count: String(failedRows.length),
          })}
          defaultOpen={problemsOpen}
          className="csv-results-problems"
        >
          <div className="import-results-errors">
            <div className="csv-error-group-body">
              {failedRows.map(({ item, errorCode }) => (
                <FailedPreviewRow
                  key={item.itemId}
                  item={item}
                  errorCode={errorCode}
                />
              ))}
            </div>
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}

export const CSVImport = memo<CSVImportProps>(({ plugin }) => {
  const tradeImportCompletionHeadingId = useId();
  const importDestinationLabelId = useId();
  const importFormatLabelId = useId();
  const backendTradeImportService = useMemo(
    () => new BackendTradeImportService(),
    []
  );
  const backendTradeProjectionService = useMemo(
    () => new TradeProjectionClient(),
    []
  );
  const workflowService = useMemo(
    () =>
      new TradeImportWorkflowService(
        plugin,
        backendTradeImportService,
        backendTradeProjectionService
      ),
    [backendTradeImportService, backendTradeProjectionService, plugin]
  );
  const localTemplateService = useMemo(
    () => new LocalTemplateService(plugin, plugin.settingsManager),
    [plugin]
  );
  const [, refreshTemplates] = useState(0);
  const templates = localTemplateService.getTemplatesByUsage();
  const [importAccountOptions, setImportAccountOptions] = useState<
    ImportAccountOption[]
  >(() => accountOptions(plugin));
  const accounts = useMemo(
    () => importAccountOptions.map((account) => account.name),
    [importAccountOptions]
  );
  const [capabilities, setCapabilities] =
    useState<TradeImportCapabilities | null>(null);
  const favorites = csvImportFavorites(plugin.settings);
  const [selectedAccountName, setSelectedAccountName] = useState(() =>
    initialImportAccount(favorites.account, accounts)
  );
  
  
  
  const [broker, setBroker] = useState(favorites.broker);
  const onboardingAssetFocus = onboardingAssetFocusOf(plugin);
  const [assetType, setAssetType] = useState<AssetType>(() =>
    defaultTradeImportAssetType(
      plugin.settings,
      favorites.broker,
      onboardingAssetFocus
    )
  );
  
  
  const [assetTypeConfirmed, setAssetTypeConfirmed] = useState(false);
  const [isChangingSource, setIsChangingSource] = useState(false);
  
  
  const [syncOnlySourceId, setSyncOnlySourceId] = useState<string | null>(null);
  const [syncCardRevealRequest, setSyncCardRevealRequest] = useState(0);
  const [selectedDateFormat, setSelectedDateFormat] = useState('');
  
  
  const setSource = useCallback((nextBroker: string) => {
    setBroker(nextBroker);
    setSelectedDateFormat((current) =>
      dateFormatOnBrokerSelection(nextBroker, current)
    );
    setSyncOnlySourceId(null);
    setIsChangingSource(false);
  }, []);
  const [favoriteAccount, setFavoriteAccount] = useState(favorites.account);
  const [favoriteBroker, setFavoriteBroker] = useState(favorites.broker);
  const [favoriteTemplateId, setFavoriteTemplateId] = useState(
    favorites.templateId
  );
  
  const manualModeTitleId = useId();
  const [manualModeChoice, setManualModeChoice] =
    useState<ManualImportMode | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  
  
  const [importSymbol, setImportSymbol] = useState('');
  const [templateShareCode, setTemplateShareCode] = useState('');
  const [templateExportCode, setTemplateExportCode] = useState('');
  const [templateCopied, setTemplateCopied] = useState(false);
  const [templateActionMenuState, dispatchTemplateActionMenuState] = useReducer(
    (
      state: {
        templateActionsOpen: boolean;
        templateMenuPosition: PortalMenuPosition | null;
      },
      update: Partial<{
        templateActionsOpen: boolean;
        templateMenuPosition: PortalMenuPosition | null;
      }>
    ) => ({ ...state, ...update }),
    { templateActionsOpen: false, templateMenuPosition: null }
  );
  const { templateActionsOpen, templateMenuPosition } = templateActionMenuState;
  const [templateImportOpen, setTemplateImportOpen] = useState(false);
  const templateActionsRef = useRef<HTMLDivElement>(null);
  const templateMenuRef = useRef<HTMLDivElement>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedSheetName, setSelectedSheetName] = useState<string | null>(
    null
  );
  const [selectedHeaderRowIndex, setSelectedHeaderRowIndex] = useState<
    number | null
  >(null);
  
  const [headerRowError, setHeaderRowError] = useState<string | null>(null);
  const isHyperliquid = isHyperliquidTradeHistory(broker);
  const hyperliquidDateFormatValid = isBrokerDateFormatValid(
    broker,
    selectedDateFormat
  );
  const [aiMappingRequested, setAiMappingRequested] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [dismissedAnalyseRecovery, setDismissedAnalyseRecovery] = useState<{
    file: File | null;
    selectedSource: string;
    recommendedSource: string;
  } | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [analyse, setAnalyse] = useState<TradeImportAnalyseResponse | null>(
    null
  );
  const [columnMappings, setColumnMappings] = useState<
    Record<string, string[]>
  >({});
  const [preview, setPreview] = useState<TradeImportPreviewResponse | null>(
    null
  );
  const [previewOwnerUserId, setPreviewOwnerUserId] = useState<string | null>(
    null
  );
  const [previewError, setPreviewError] = useState<{
    message: string;
    details: string | null;
    showGuidance: boolean;
  } | null>(null);
  const [classified, setClassified] = useState<ClassifiedPreviewTrade[]>([]);
  
  const [importAnywayChoice, setImportAnywayChoice] = useState<{
    importId: string | null;
    itemIds: ReadonlySet<string>;
  }>({ importId: null, itemIds: new Set() });
  const importAnywayItemIds = useMemo(
    () =>
      preview && importAnywayChoice.importId === preview.importId
        ? importAnywayChoice.itemIds
        : new Set<string>(),
    [importAnywayChoice, preview]
  );
  
  
  
  const [workbookImagesExcludedFor, setWorkbookImagesExcludedFor] = useState<
    string | null
  >(null);
  const includeWorkbookImages = workbookImagesIncludedFor(
    preview,
    workbookImagesExcludedFor
  );
  const workbookImageUrls = useWorkbookImageUrls(file, classified);
  const toggleImportAnyway = useCallback(
    (itemIds: readonly string[], importAnyway: boolean) => {
      if (!preview) return;
      const next = new Set(importAnywayItemIds);
      for (const itemId of itemIds) {
        if (importAnyway) next.add(itemId);
        else next.delete(itemId);
      }
      setImportAnywayChoice({ importId: preview.importId, itemIds: next });
    },
    [importAnywayItemIds, preview]
  );
  const [importResult, setImportResult] =
    useState<TradeImportCompletionResult | null>(null);
  const [operationResult, setOperationResult] =
    useState<TradeOperationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);
  const [activeStep, setActiveStep] = useState<TradeImportWizardStep>(1);
  const requestVersionRef = useRef(0);
  const handoffPreviewPendingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appliedFavoriteBrokerRef = useRef(false);
  const appliedFavoriteTemplateRef = useRef(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownState, dispatchDropdownState] = useReducer(
    (
      state: {
        isAccountDropdownOpen: boolean;
        isTemplateDropdownOpen: boolean;
      },
      update: Partial<{
        isAccountDropdownOpen: boolean;
        isTemplateDropdownOpen: boolean;
      }>
    ) => ({ ...state, ...update }),
    {
      isAccountDropdownOpen: false,
      isTemplateDropdownOpen: false,
    }
  );
  const { isAccountDropdownOpen, isTemplateDropdownOpen } = dropdownState;
  const {
    isAuthenticated,
    isFeatureEnabled: canUseTradeImport,
    isChecking: isCheckingEntitlement,
    entitlementStatus,
  } = useBackendProEntitlement(plugin, 'trade import view open', 'tradeImport');
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);
  const { isFeatureEnabled: canUseAiMapping } = useBackendProEntitlement(
    plugin,
    'trade import ai mapping toggle',
    'aiMapping'
  );
  const aiMappingEnabled = aiMappingRequested && canUseAiMapping;

  useEffect(() => {
    if (!templateActionsOpen) return;
    if (templateActionsRef.current) {
      dispatchTemplateActionMenuState({
        templateMenuPosition: getPortalMenuPosition(
          templateActionsRef.current,
          190
        ),
      });
    }
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !templateActionsRef.current?.contains(target) &&
        !templateMenuRef.current?.contains(target)
      ) {
        dispatchTemplateActionMenuState({ templateActionsOpen: false });
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        dispatchTemplateActionMenuState({ templateActionsOpen: false });
      }
    };
    const handleScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Node && templateMenuRef.current?.contains(target))
        return;
      dispatchTemplateActionMenuState({ templateActionsOpen: false });
    };
    const handleReposition = () => {
      if (!templateActionsRef.current) return;
      dispatchTemplateActionMenuState({
        templateMenuPosition: getPortalMenuPosition(
          templateActionsRef.current,
          190
        ),
      });
    };
    const handleWindowBlur = () =>
      dispatchTemplateActionMenuState({ templateActionsOpen: false });
    const handleVisibilityChange = () => {
      if (window.activeDocument.hidden)
        dispatchTemplateActionMenuState({ templateActionsOpen: false });
    };
    const monitor = window.setInterval(() => {
      if (
        !window.activeDocument.hasFocus() ||
        !templateActionsRef.current?.isConnected ||
        !templateActionsRef.current.closest('.workspace-leaf.mod-active')
      ) {
        dispatchTemplateActionMenuState({ templateActionsOpen: false });
      }
    }, 150);
    const activeWindow = window.activeDocument.defaultView ?? window;
    const listenerDocument = window.activeDocument;
    listenerDocument.addEventListener('pointerdown', handlePointerDown);
    activeWindow.addEventListener('keydown', handleKeyDown, true);
    listenerDocument.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );
    window.addEventListener('pagehide', handleWindowBlur);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      listenerDocument.removeEventListener('pointerdown', handlePointerDown);
      activeWindow.removeEventListener('keydown', handleKeyDown, true);
      listenerDocument.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
      window.clearInterval(monitor);
      window.removeEventListener('pagehide', handleWindowBlur);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [templateActionsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        event.target instanceof Node &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        dispatchDropdownState({ isAccountDropdownOpen: false });
      }
      if (
        templateDropdownRef.current &&
        event.target instanceof Node &&
        !templateDropdownRef.current.contains(event.target)
      ) {
        dispatchDropdownState({ isTemplateDropdownOpen: false });
      }
    };

    const listenerDocument = window.activeDocument;
    listenerDocument.addEventListener('mousedown', handleClickOutside);
    return () =>
      listenerDocument.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    void loadAccountOptions(plugin).then((loadedAccountOptions) => {
      if (cancelled) return;
      const loadedAccounts = loadedAccountOptions.map(
        (account) => account.name
      );
      setImportAccountOptions(loadedAccountOptions);
      setSelectedAccountName((current) => {
        const favorite = plugin.settings.csvFavoriteAccount;
        if (favorite && loadedAccounts.includes(favorite)) return favorite;
        return loadedAccounts.includes(current) ? current : loadedAccounts[0];
      });
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, plugin]);

  useEffect(() => {
    if (!isAuthenticated) return;
    backendTradeImportService
      .getCapabilities()
      .then((loadedCapabilities) => {
        setCapabilities(loadedCapabilities);
      })
      .catch(
        (error) =>
          new Notice(
            error instanceof Error
              ? error.message
              : t('trade-import.notice.capabilities-failed')
          )
      );
  }, [backendTradeImportService, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !canUseTradeImport) return;
    void flushTradeProjectionAcks(plugin, backendTradeProjectionService);
  }, [
    backendTradeProjectionService,
    canUseTradeImport,
    isAuthenticated,
    plugin,
  ]);

  const brokers = useMemo(
    () =>
      capabilities?.brokers ?? [
        { id: 'MANUAL', label: t('trade-import.broker.manual') },
      ],
    [capabilities]
  );
  const selectedBrokerCapabilities = brokerCapabilitiesFor(
    capabilities,
    broker
  );
  const { exportTimeZoneStatus, hyperliquidPreviewReady } =
    hyperliquidReadiness(
      broker,
      selectedBrokerCapabilities,
      hyperliquidDateFormatValid
    );
  const selectedBrokerLabel = tradeImportSourceLabel(broker, capabilities);
  const brokerGuideUrl = BROKER_GUIDE_URLS[broker];
  const sourceOptions = useMemo(
    () =>
      capabilities
        ? buildTradeImportSourceOptions(capabilities, favoriteBroker)
        : [],
    [capabilities, favoriteBroker]
  );
  const selectedSourceOption = sourceOptions.find(
    (option) => option.id === importSourceTileId(broker, capabilities)
  );
  const importFormats = getImportFormatOptions(broker, capabilities);
  const hasSource = broker !== '';
  
  const showSourceFirstGrid = !hasSource || isChangingSource;
  const syncOnlySource = sourceOptions.find(
    (option) => option.id === syncOnlySourceId
  );
  const { card: syncCard, openTradeSync } = useTradeImportSyncSuggestion({
    plugin,
    sources: sourceOptions,
    importSource: selectedSourceOption,
    syncOnlySource,
    isFavoriteSource: favoriteBroker === broker,
    formVisible: !showSourceFirstGrid,
  });
  const isManualBroker = broker === 'MANUAL';
  const supportsManualMapping = supportsManualMappingFor(
    broker,
    selectedTemplateId,
    selectedBrokerCapabilities
  );
  const normalizedColumnMappings = useMemo(
    () =>
      analyse
        ? normalizeManualColumnMappings(columnMappings, analyse.headers)
        : {},
    [analyse, columnMappings]
  );
  const supportedManualModes = manualModesOf(capabilities);
  const manualMode = effectiveManualMode(
    supportsManualMapping,
    manualModeChoice,
    normalizedColumnMappings,
    supportedManualModes
  );
  const backendManualMode = manualModeForBackend(
    manualMode,
    supportedManualModes
  );
  
  
  
  
  const perRowMode = manualMode === 'direct_pnl';
  const displayColumnMappings = useMemo(
    () =>
      perRowMode ? withoutField(columnMappings, 'status') : columnMappings,
    [columnMappings, perRowMode]
  );
  const applicableColumnMappings = useMemo(
    () =>
      perRowMode
        ? withoutField(normalizedColumnMappings, 'status')
        : normalizedColumnMappings,
    [normalizedColumnMappings, perRowMode]
  );
  const requiredMappingFields = requiredFieldsForManualMode(
    backendManualMode,
    new Set(Object.keys(applicableColumnMappings)),
    assetType
  );
  const missingRequiredMappingFields = useMemo(
    () =>
      supportsManualMapping
        ? missingRequiredFieldsForMappings(
            backendManualMode,
            displayColumnMappings,
            analyse?.headers ?? [],
            assetType
          )
        : [],
    [
      analyse,
      assetType,
      backendManualMode,
      displayColumnMappings,
      supportsManualMapping,
    ]
  );
  const resolvedAnalyseRecovery = useMemo(
    () =>
      analyse && capabilities
        ? resolveBrokerImportAnalyseRecovery(
            analyse,
            broker,
            capabilities.brokers
          )
        : null,
    [analyse, broker, capabilities]
  );
  const analyseFailureRecovery = resolveBrokerImportRecovery(analyse);
  const canChangeRecoverySource = canChangeSourceFromRecovery(
    analyseFailureRecovery,
    preview
  );
  const analyseRecovery = undismissedAnalyseRecovery(
    resolvedAnalyseRecovery,
    dismissedAnalyseRecovery,
    file,
    broker
  );
  const failedPreviewRows = failedRowsOf(classified, importResult);
  const acceptedExtensionList = acceptedImportExtensions(
    capabilities,
    selectedBrokerCapabilities
  );
  const acceptedExtensions = acceptedExtensionList.join(',');

  const applyQuickImportHandoff = useCallback(() => {
    if (!capabilities) return false;
    const handoff = consumeQuickImportTradeImportHandoff();
    if (!handoff) return false;

    appliedFavoriteBrokerRef.current = true;
    appliedFavoriteTemplateRef.current = true;
    requestVersionRef.current += 1;
    setHeaderRowError(null);

    setSelectedAccountName(handoff.accountName);
    setSource(handoff.broker);
    setAssetType(handoff.assetType);
    setManualModeChoice(handoff.manualMode ?? 'price_based');
    setSelectedDateFormat(
      dateFormatForBroker(handoff.broker, handoff.dateFormat ?? '')
    );
    setSelectedSheetName(handoff.sheetName ?? null);
    setSelectedHeaderRowIndex(handoff.headerRowIndex ?? null);
    setColumnMappings(handoff.columnMappings);
    setAiMappingRequested(handoff.aiMappingEnabled);
    setFile(handoff.file);
    setAssetTypeConfirmed(false);
    setImportSymbol('');
    setAnalyse(handoff.analyse ?? null);
    setPreview(handoff.preview ?? null);
    setPreviewOwnerUserId(handoff.previewOwnerUserId ?? null);
    setClassified(handoff.classified ?? []);
    setImportResult(null);
    setOperationResult(null);
    setImportCompleted(false);
    setSelectedTemplateId(handoff.templateId ?? '');
    setTemplateName(handoff.templateName ?? '');
    setActiveStep(
      handoff.changeSource ? 1 : handoff.preview ? 3 : handoff.analyse ? 2 : 1
    );
    setIsChangingSource(handoff.changeSource === true);
    
    
    handoffPreviewPendingRef.current =
      !handoff.changeSource &&
      handoff.previewOnOpen === true &&
      handoff.analyse !== null;
    return true;
  }, [capabilities, setSource]);

  useEffect(() => {
    applyQuickImportHandoff();
  }, [applyQuickImportHandoff]);

  useEffect(() => {
    const handleQuickImportHandoff = () => {
      applyQuickImportHandoff();
    };
    window.addEventListener(
      'journalit:quick-import-handoff-ready',
      handleQuickImportHandoff
    );
    return () => {
      window.removeEventListener(
        'journalit:quick-import-handoff-ready',
        handleQuickImportHandoff
      );
    };
  }, [applyQuickImportHandoff]);

  const applyBrokerSelection = useCallback(
    (nextBroker: string) => {
      setSource(nextBroker);
      if (nextBroker !== 'MANUAL') {
        setSelectedTemplateId('');
        setTemplateExportCode('');
        setTemplateImportOpen(false);
      }
      setAssetType(
        defaultTradeImportAssetType(
          plugin.settings,
          nextBroker,
          onboardingAssetFocus
        )
      );
    },
    [onboardingAssetFocus, plugin, setSource]
  );

  const applyOnboardingBrokerHandoff = useCallback(() => {
    if (!capabilities) return;
    const nextBroker = consumeOnboardingTradeImportBroker();
    if (!nextBroker) return;
    appliedFavoriteBrokerRef.current = true;
    applyBrokerSelection(nextBroker);
  }, [applyBrokerSelection, capabilities]);

  useEffect(() => {
    applyOnboardingBrokerHandoff();
    window.addEventListener(
      'journalit:onboarding-trade-import-handoff-ready',
      applyOnboardingBrokerHandoff
    );
    return () => {
      window.removeEventListener(
        'journalit:onboarding-trade-import-handoff-ready',
        applyOnboardingBrokerHandoff
      );
    };
  }, [applyOnboardingBrokerHandoff]);

  useEffect(() => {
    if (!capabilities) return;
    const availableBrokerIds = new Set(brokers.map((item) => item.id));
    const favorite = plugin.settings.csvFavoriteBroker;
    const shouldApplyFavorite =
      !favoriteTemplateId &&
      !appliedFavoriteBrokerRef.current &&
      favorite &&
      availableBrokerIds.has(favorite);
    const nextBroker = shouldApplyFavorite
      ? favorite
      : availableBrokerIds.has(broker)
        ? broker
        : '';

    appliedFavoriteBrokerRef.current = true;

    if (nextBroker !== broker) {
      applyBrokerSelection(nextBroker);
    }
  }, [
    applyBrokerSelection,
    broker,
    brokers,
    capabilities,
    plugin.settings.csvFavoriteBroker,
    favoriteTemplateId,
    plugin.settings.csvLastAssetType,
  ]);

  const toggleFavoriteAccount = useCallback(
    async (account: string) => {
      const nextFavorite = favoriteAccount === account ? '' : account;
      plugin.settings.csvFavoriteAccount = nextFavorite || undefined;
      setFavoriteAccount(nextFavorite);
      await plugin.saveSettings();
    },
    [favoriteAccount, plugin]
  );

  const toggleFavoriteBroker = useCallback(
    async (brokerId: string) => {
      const nextFavorite = favoriteBroker === brokerId ? '' : brokerId;
      plugin.settings.csvFavoriteBroker = nextFavorite || undefined;
      setFavoriteBroker(nextFavorite);
      await plugin.saveSettings();
    },
    [favoriteBroker, plugin]
  );

  const toggleFavoriteTemplate = useCallback(
    async (templateId: string) => {
      const nextFavorite = favoriteTemplateId === templateId ? '' : templateId;
      plugin.settings.csvFavoriteTemplateId = nextFavorite || undefined;
      setFavoriteTemplateId(nextFavorite);
      await plugin.saveSettings();
    },
    [favoriteTemplateId, plugin]
  );

  const invalidateAnalysis = useCallback(() => {
    requestVersionRef.current += 1;
    setHeaderRowError(null);
    setAnalyse(null);
    setPreview(null);
    setPreviewOwnerUserId(null);
    setPreviewError(null);
    setClassified([]);
    setImportResult(null);
    setOperationResult(null);
    setImportCompleted(false);
    setActiveStep(1);
  }, []);

  const invalidatePreview = useCallback(() => {
    requestVersionRef.current += 1;
    setPreview(null);
    setPreviewOwnerUserId(null);
    setPreviewError(null);
    setClassified([]);
    setImportResult(null);
    setOperationResult(null);
    setImportCompleted(false);
    setActiveStep((current) => (current === 3 ? 2 : current));
  }, []);

  const diagnosticMappingActions = useMemo<
    TradeImportDiagnosticMappingActions | undefined
  >(
    () =>
      supportsManualMapping
        ? {
            columnsForField: (field) => applicableColumnMappings[field] ?? [],
            isRequiredField: (field) =>
              requiredMappingFields.some((required) => required === field),
            onUnmapField: (field) => {
              setColumnMappings((current) => {
                const next = { ...current };
                delete next[field];
                return next;
              });
              invalidatePreview();
            },
            onEditMapping: invalidatePreview,
          }
        : undefined,
    [
      applicableColumnMappings,
      invalidatePreview,
      requiredMappingFields,
      supportsManualMapping,
    ]
  );

  const createCustomFieldForColumn = useCallback(
    async (
      column: string,
      field: NewColumnCustomField,
      sampleValues: readonly string[]
    ): Promise<boolean> => {
      try {
        const created = await plugin.customFieldsService.addField({
          label: field.label,
          type: field.type,
          ...(field.type === CustomFieldType.DROPDOWN
            ? {
                options: choiceOptionsFromSamples(sampleValues),
                allowCreateOptions: true,
              }
            : {}),
        });
        setColumnMappings((current) =>
          updateColumnAssignment(
            current,
            column,
            `custom:${created.fieldKey || created.id}`
          )
        );
        invalidatePreview();
        return true;
      } catch (error) {
        console.error('[TradeImport] Failed to create custom field:', error);
        new Notice(t('settings.customization.custom-fields.error.save-failed'));
        return false;
      }
    },
    [invalidatePreview, plugin]
  );

  const handleAiMappingChange = useCallback(
    (checked: boolean) => {
      setAiMappingRequested(checked);
      
      if (!selectedTemplateId) setColumnMappings({});
      invalidateAnalysis();
    },
    [invalidateAnalysis, selectedTemplateId]
  );

  const selectBroker = useCallback(
    (brokerId: string) => {
      applyBrokerSelection(brokerId);
      
      if (brokerId !== broker) {
        setSelectedSheetName(null);
        setSelectedHeaderRowIndex(null);
      }
      
      
      if (brokerId !== 'MANUAL' || !selectedTemplateId) {
        setColumnMappings({});
        setManualModeChoice(null);
      }
      invalidateAnalysis();
    },
    [applyBrokerSelection, broker, invalidateAnalysis, selectedTemplateId]
  );

  
  const [importDestinations, setImportDestinations] = useState(
    () => plugin.settings.csvImportDestinations ?? {}
  );
  const importDestination = importDestinationFor(
    capabilities,
    importDestinations,
    broker
  );
  const selectImportDestination = useCallback(
    (destination: TradeImportDestination) => {
      setImportDestinations((current) => ({
        ...current,
        [broker]: destination,
      }));
      void rememberTradeImportDestination(plugin, broker, destination);
      invalidatePreview();
    },
    [broker, invalidatePreview, plugin]
  );

  const selectAssetType = useCallback(
    (nextAssetType: AssetType) => {
      setAssetType(nextAssetType);
      setAssetTypeConfirmed(true);
      void rememberTradeImportAssetType(plugin, broker, nextAssetType);
      invalidatePreview();
    },
    [broker, invalidatePreview, plugin]
  );

  const applyTemplate = useCallback(
    async (template: LocalCSVTemplate, markAsUsed = true) => {
      setSelectedTemplateId(template.id);
      setSource(template.broker_type);
      setAssetType(template.asset_type);
      setManualModeChoice(template.manual_mode ?? 'price_based');
      setSelectedHeaderRowIndex(template.header_row_index ?? null);
      setSelectedDateFormat(
        dateFormatForBroker(template.broker_type, template.date_format ?? '')
      );
      setColumnMappings(asMappings(template.column_mappings));
      invalidateAnalysis();
      if (markAsUsed) {
        await localTemplateService.markTemplateAsUsed(template.id);
      }
    },
    [invalidateAnalysis, localTemplateService, setSource]
  );

  useEffect(() => {
    if (appliedFavoriteTemplateRef.current) return;
    if (!favoriteTemplateId) {
      appliedFavoriteTemplateRef.current = true;
      return;
    }

    const favoriteTemplate =
      localTemplateService.getTemplate(favoriteTemplateId);
    if (!favoriteTemplate) {
      appliedFavoriteTemplateRef.current = true;
      plugin.settings.csvFavoriteTemplateId = undefined;
      setFavoriteTemplateId('');
      void plugin.saveSettings();
      return;
    }

    appliedFavoriteTemplateRef.current = true;
    void applyTemplate(favoriteTemplate, false);
  }, [applyTemplate, favoriteTemplateId, localTemplateService, plugin]);

  const saveTemplate = useCallback(async () => {
    const trimmedName = templateName.trim();
    if (!trimmedName) return;
    if (localTemplateService.templateNameExists(trimmedName)) {
      new Notice(t('trade-import.notice.template-exists'));
      return;
    }
    await localTemplateService.createTemplate({
      name: trimmedName,
      broker_type: broker,
      asset_type: assetType,
      column_mappings: applicableColumnMappings,
      mapping_version: 2,
      manual_mode: manualMode,
      date_format: selectedDateFormat,
      header_row_index: selectedHeaderRowIndex ?? undefined,
      has_headers: true,
    });
    setTemplateName('');
    refreshTemplates((version) => version + 1);
    setTemplateExportCode('');
    new Notice(t('trade-import.notice.template-saved'));
  }, [
    assetType,
    applicableColumnMappings,
    broker,
    localTemplateService,
    manualMode,
    selectedDateFormat,
    selectedHeaderRowIndex,
    templateName,
  ]);

  const importTemplate = useCallback(async () => {
    const trimmedCode = templateShareCode.trim();
    if (!trimmedCode) return;
    try {
      const importedTemplate =
        await localTemplateService.importTemplate(trimmedCode);
      setTemplateShareCode('');
      setTemplateImportOpen(false);
      setTemplateExportCode('');
      refreshTemplates((version) => version + 1);
      new Notice(
        t('notice.csv-template-imported', { name: importedTemplate.name })
      );
    } catch {
      new Notice(t('csv.template-import.error.import-failed'));
    }
  }, [localTemplateService, templateShareCode]);

  const deleteSelectedTemplate = useCallback(async () => {
    if (!selectedTemplateId) return;
    const template = localTemplateService.getTemplate(selectedTemplateId);
    if (!template) return;
    try {
      await localTemplateService.deleteTemplate(selectedTemplateId);
      if (favoriteTemplateId === selectedTemplateId) {
        plugin.settings.csvFavoriteTemplateId = undefined;
        setFavoriteTemplateId('');
        await plugin.saveSettings();
      }
      setSelectedTemplateId('');
      setTemplateExportCode('');
      setTemplateImportOpen(false);
      setColumnMappings({});
      setManualModeChoice(null);
      refreshTemplates((version) => version + 1);
      invalidateAnalysis();
      new Notice(t('notice.csv-template-deleted', { name: template.name }));
    } catch (error) {
      new Notice(
        t('notice.csv-template-delete-failed', {
          error: error instanceof Error ? error.message : t('common.unknown'),
        })
      );
    }
  }, [
    favoriteTemplateId,
    invalidateAnalysis,
    localTemplateService,
    plugin,
    selectedTemplateId,
  ]);

  const exportSelectedTemplate = useCallback(() => {
    if (!selectedTemplateId) return;
    try {
      setTemplateExportCode(
        localTemplateService.exportTemplate(selectedTemplateId)
      );
      setTemplateImportOpen(false);
      setTemplateCopied(false);
    } catch {
      setTemplateExportCode('');
    }
  }, [localTemplateService, selectedTemplateId]);

  const copyTemplateExportCode = useCallback(async () => {
    if (!templateExportCode) return;
    await writeClipboardText(templateExportCode);
    setTemplateCopied(true);
  }, [templateExportCode]);

  const analyseFileForSource = useCallback(
    async (
      source: string,
      selection?: {
        sheetName: string | null;
        header: { sheetRow: number } | { index: number | null };
        
        freshMapping?: boolean;
      }
    ) => {
      if (!file || !capabilities) return;
      const requestVersion = requestVersionRef.current + 1;
      requestVersionRef.current = requestVersion;
      const requestSheetName = selection
        ? selection.sheetName
        : selectedSheetName;
      const requestHeader = selection
        ? selection.header
        : { index: selectedHeaderRowIndex };
      const sourceCapabilities = capabilities.brokers.find(
        (item) => item.id === source
      );
      const sourceSupportsManualMapping =
        source === 'MANUAL' ||
        sourceCapabilities?.supportsManualMapping === true;
      setBusy(true);
      try {
        const { response, suggestedColumnMappings } =
          await workflowService.analyseFile({
            file,
            capabilities,
            brokerCapabilities: sourceCapabilities,
            broker: source,
            sheetName: requestSheetName,
            header: requestHeader,
            aiMappingEnabled,
          });
        if (requestVersion !== requestVersionRef.current) return;
        if (
          response.headerRowIndex === undefined &&
          'sheetRow' in requestHeader
        ) {
          
          setHeaderRowError(
            response.diagnostics.find(
              (diagnostic) => diagnostic.code === 'invalid_header_row'
            )?.message ?? t('trade-import.notice.analyse-failed')
          );
          return;
        }
        setHeaderRowError(null);
        setAnalyse(response);
        setSelectedSheetName(
          response.selectedSheet ?? response.suggestedSheet ?? null
        );
        
        setSelectedHeaderRowIndex(response.headerRowIndex ?? null);
        setColumnMappings((currentMappings) =>
          !sourceSupportsManualMapping ||
          (!selection?.freshMapping && Object.keys(currentMappings).length > 0)
            ? currentMappings
            : suggestedColumnMappings
        );
        setPreview(null);
        setPreviewOwnerUserId(null);
        setPreviewError(null);
        setClassified([]);
        setImportResult(null);
        setOperationResult(null);
        setImportCompleted(false);
        setActiveStep(2);
      } catch (error) {
        if (requestVersion !== requestVersionRef.current) return;
        const message =
          freePreviewRateLimitMessage(error) ??
          (error instanceof TradeImportValidationError
            ? error.message
            : t('trade-import.notice.analyse-failed'));
        new Notice(message);
        
        
        if ('sheetRow' in requestHeader) setHeaderRowError(message);
      } finally {
        setBusy(false);
      }
    },
    [
      aiMappingEnabled,
      capabilities,
      file,
      selectedHeaderRowIndex,
      selectedSheetName,
      workflowService,
    ]
  );

  const runAnalyse = useCallback(
    () => analyseFileForSource(broker),
    [analyseFileForSource, broker]
  );

  const reanalyseFileForSource = useCallback(
    (source: string) => {
      applyBrokerSelection(source);
      setAssetTypeConfirmed(false);
      setHeaderRowError(null);
      setDismissedAnalyseRecovery(null);
      setSelectedTemplateId('');
      setTemplateExportCode('');
      setTemplateImportOpen(false);
      setColumnMappings({});
      setManualModeChoice(null);
      setSelectedDateFormat('');
      setSelectedSheetName(null);
      setSelectedHeaderRowIndex(null);
      setAnalyse(null);
      setPreview(null);
      setPreviewOwnerUserId(null);
      setPreviewError(null);
      setClassified([]);
      setImportResult(null);
      setOperationResult(null);
      setImportCompleted(false);
      setActiveStep(1);
      void analyseFileForSource(source, {
        sheetName: null,
        header: { index: null },
      });
    },
    [analyseFileForSource, applyBrokerSelection]
  );

  
  
  const selectSourceFormat = useCallback(
    (brokerId: string) => {
      if (file && canChangeRecoverySource) {
        reanalyseFileForSource(brokerId);
      } else {
        selectBroker(brokerId);
      }
    },
    [canChangeRecoverySource, file, reanalyseFileForSource, selectBroker]
  );

  const selectSource = useCallback(
    (sourceId: string) => {
      const option = sourceOptions.find(
        (candidate) => candidate.id === sourceId
      );
      if (option?.syncOnly) {
        selectBroker('');
        setSyncOnlySourceId(sourceId);
        
        setSyncCardRevealRequest((count) => count + 1);
        return;
      }
      
      
      selectSourceFormat(
        importSourceTileId(broker, capabilities) === sourceId
          ? broker
          : importFormatForTile(sourceId, favoriteBroker, capabilities)
      );
    },
    [
      broker,
      capabilities,
      favoriteBroker,
      selectBroker,
      selectSourceFormat,
      sourceOptions,
    ]
  );

  const runPreview = useCallback(
    async ({
      accountName = selectedAccountName,
      dateFormat = selectedDateFormat,
    }: { accountName?: string; dateFormat?: string } = {}) => {
      if (
        !file ||
        !accountName ||
        !analyse ||
        resolveBrokerImportRecovery(analyse)
      )
        return;
      if (!capabilities) return;
      
      const exportTimeZone = resolveHyperliquidExportTimeZone(
        broker,
        selectedBrokerCapabilities?.supportsExportTimeZone === true
      );
      if (exportTimeZone.errorKey || !hyperliquidDateFormatValid) return;
      if (analyse.requiresSymbol && importSymbol.trim() === '') return;
      if (missingRequiredMappingFields.length > 0) {
        new Notice(t('notice.csv-missing-fields'));
        return;
      }
      const requestVersion = requestVersionRef.current;
      setBusy(true);
      try {
        const { response, classifiedTrades, ownerUserId } =
          await workflowService.previewFile({
            file,
            capabilities,
            brokerCapabilities: selectedBrokerCapabilities,
            analyse,
            broker,
            sheetName: selectedSheetName,
            headerRowIndex: selectedHeaderRowIndex,
            accountName,
            assetType,
            manualMode: backendManualMode,
            dateFormat,
            timeZone: exportTimeZone.timeZone,
            columnMappings: applicableColumnMappings,
            manualMappingRequired: supportsManualMapping,
            destination: importDestination,
            symbol: importSymbol,
          });
        if (requestVersion !== requestVersionRef.current) return;
        setPreview(response);
        setPreviewOwnerUserId(ownerUserId);
        setPreviewError(null);
        setImportResult(null);
        setOperationResult(null);
        setImportCompleted(false);
        setClassified(classifiedTrades);
        setActiveStep(3);
      } catch (error) {
        if (requestVersion !== requestVersionRef.current) return;
        const presentation = tradeImportPreviewErrorPresentation(error);
        setPreview(null);
        setPreviewOwnerUserId(null);
        setPreviewError(presentation);
        new Notice(presentation.message);
      } finally {
        setBusy(false);
      }
    },
    [
      analyse,
      applicableColumnMappings,
      assetType,
      broker,
      backendManualMode,
      capabilities,
      file,
      importDestination,
      importSymbol,
      missingRequiredMappingFields,
      selectedDateFormat,
      hyperliquidDateFormatValid,
      selectedHeaderRowIndex,
      selectedAccountName,
      selectedBrokerCapabilities,
      selectedSheetName,
      supportsManualMapping,
      workflowService,
    ]
  );

  const resetImportFlow = useCallback(() => {
    requestVersionRef.current += 1;
    setFile(null);
    setAnalyse(null);
    setPreview(null);
    setPreviewOwnerUserId(null);
    setPreviewError(null);
    setClassified([]);
    setImportResult(null);
    setOperationResult(null);
    setImportCompleted(false);
    setSelectedSheetName(null);
    setSelectedHeaderRowIndex(null);
    setTemplateName('');
    setActiveStep(1);
  }, []);

  const confirmImport = useCallback(async () => {
    if (!preview || !previewOwnerUserId || !file || importCompleted) return;
    setBusy(true);
    try {
      await workflowService.writePreview({
        preview,
        previewOwnerUserId,
        classified,
        importAnywayItemIds,
        workbookFile: includeWorkbookImages ? file : undefined,
        accountName: selectedAccountName,
        brokerLabel: selectedBrokerLabel,
        localWriteTimeoutMs: LOCAL_WRITE_TIMEOUT_MS,
        onComplete: (result) => {
          new Notice(
            t('trade-import.notice.complete', {
              written: String(result.writtenCount),
              duplicateCount: String(result.duplicateCount),
              failedCount: String(result.failedCount),
            })
          );
          if (result.pendingCount > 0) {
            new Notice(
              t('csv.results.pending-local-writes', {
                count: String(result.pendingCount),
              })
            );
          }
          setImportResult(result);
          const nextOperationResult = buildImportOperationResult({
            result,
            source: 'full-import',
            ownerUserId: previewOwnerUserId,
          });
          setOperationResult(
            plugin
              .ensureTradeOperationResultService()
              .record(nextOperationResult)
          );
          setImportCompleted(true);
          void rememberTradeImportAssetType(plugin, broker, assetType);
        },
      });
    } finally {
      setBusy(false);
    }
  }, [
    assetType,
    broker,
    classified,
    file,
    importAnywayItemIds,
    importCompleted,
    includeWorkbookImages,
    plugin,
    preview,
    previewOwnerUserId,
    selectedAccountName,
    selectedBrokerLabel,
    workflowService,
  ]);

  
  
  const importIntoAccount = useCallback(
    (accountName: string) => {
      if (importCompleted || !accounts.includes(accountName)) return;
      setSelectedAccountName(accountName);
      invalidatePreview();
      void runPreview({ accountName });
    },
    [accounts, importCompleted, invalidatePreview, runPreview]
  );

  
  
  const chooseDateFormat = useCallback(
    (format: string) => {
      setSelectedDateFormat(format);
      invalidatePreview();
      void runPreview({ dateFormat: format });
    },
    [invalidatePreview, runPreview]
  );

  
  
  useEffect(() => {
    if (!handoffPreviewPendingRef.current || !file || !analyse) return;
    handoffPreviewPendingRef.current = false;
    void runPreview();
  }, [analyse, file, runPreview]);

  const cancelPreview = useCallback(() => {
    if (!preview || importCompleted) return;
    setPreview(null);
    setPreviewOwnerUserId(null);
    setPreviewError(null);
    setClassified([]);
    setImportResult(null);
    setOperationResult(null);
    setImportCompleted(false);
    setActiveStep(2);
  }, [importCompleted, preview]);

  const handleFileSelected = useCallback(
    (nextFile: File | null) => {
      setFile(nextFile);
      setAssetTypeConfirmed(false);
      setImportSymbol('');
      setSelectedSheetName(null);
      setSelectedHeaderRowIndex(
        selectedTemplateId
          ? (localTemplateService.getTemplate(selectedTemplateId)
              ?.header_row_index ?? null)
          : null
      );
      
      if (!selectedTemplateId) {
        setColumnMappings({});
        setManualModeChoice(null);
      }
      invalidateAnalysis();
    },
    [invalidateAnalysis, localTemplateService, selectedTemplateId]
  );

  const chooseAnotherFile = useCallback(() => {
    if (!file || importCompleted) return;
    handleFileSelected(null);
  }, [file, handleFileSelected, importCompleted]);

  const changeIncompatibleSource = useCallback(() => {
    requestVersionRef.current += 1;
    setActiveStep(1);
    setIsChangingSource(true);
  }, []);

  const handleFileDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!busy) setIsDraggingFile(true);
    },
    [busy]
  );

  const handleFileDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (
        !(event.relatedTarget instanceof Node) ||
        !event.currentTarget.contains(event.relatedTarget)
      ) {
        setIsDraggingFile(false);
      }
    },
    []
  );

  const handleFileDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingFile(false);
      if (busy) return;
      handleFileSelected(event.dataTransfer.files.item(0));
    },
    [busy, handleFileSelected]
  );

  const handleSignIn = useCallback(() => {
    const modal = new DeviceFlowSignInModal(
      plugin.app,
      plugin,
      () => {
        window.dispatchEvent(new Event('journalit:subscription-changed'));
      },
      () => undefined
    );
    modal.open();
  }, [plugin]);

  const handleUpgrade = useCallback(() => {
    openExternalUrl(resolveUpgradeUrl('csvImport'));
  }, []);

  const handleRefreshStatus = useCallback(async () => {
    setIsRefreshingStatus(true);
    try {
      const result = await new SubscriptionTierService(plugin).refreshTier(
        'trade import pro gate'
      );
      if (result.entitlements?.features.tradeImport.enabled === true) return;
      
      if (result.status === 'signed_out') return;
      new Notice(
        result.status === 'premium'
          ? t('trade-sync.gate.feature-unavailable.description')
          : result.status === 'unverified'
            ? t('premium.gate.offline')
            : t('premium.gate.not-pro-yet')
      );
    } finally {
      setIsRefreshingStatus(false);
    }
  }, [plugin]);

  if (!isAuthenticated) {
    return <TradeImportSignInGate onSignIn={handleSignIn} />;
  }

  const maxStep = furthestWizardStep(importCompleted, preview, analyse);
  const completedImport = completedImportResult(importCompleted, importResult);
  
  const manageImports = () => openImportManagement(plugin);

  
  const needsAssetTypeConfirmation = needsPnlFromPricesConfirmation({
    supportsManualMapping,
    backendManualMode,
    requiredMappingFields,
    selectedTemplateId,
    assetTypeConfirmed,
  });
  return (
    <div className="journalit-csv-import journalit-trade-import-simple">
      <TradeImportStepper
        maxStep={maxStep}
        activeStep={activeStep}
        busy={busy}
        onSelect={setActiveStep}
      />

      <div className="journalit-trade-import-layout">
        {activeStep === 1 && (
          <section className="csv-import-card journalit-trade-import-panel">
            <h2>
              <Settings2 /> {t('trade-import.step.select')}
            </h2>
            {showSourceFirstGrid ? (
              <SourceChoiceStep
                syncCard={syncCard}
                syncCardRevealRequest={syncCardRevealRequest}
                sources={sourceOptions}
                selectedId={selectedSourceTileId(
                  syncOnlySourceId,
                  broker,
                  capabilities
                )}
                busy={busy}
                sourcesUnavailable={!capabilities}
                onOpenTradeSync={openTradeSync}
                onSelect={selectSource}
                changing={isChangingSource}
                onCancel={() => {
                  setIsChangingSource(false);
                  if (canChangeRecoverySource)
                    setActiveStep(furthestWizardStep(false, preview, analyse));
                }}
              />
            ) : (
              <>
                <ChosenSourceHeader
                  source={selectedSourceOption}
                  brokerId={broker}
                  isFavorite={favoriteBroker === broker}
                  guideUrl={brokerGuideUrl}
                  busy={busy}
                  showsHyperliquidGuidance={isHyperliquid}
                  syncCard={syncCard}
                  onToggleFavorite={() => void toggleFavoriteBroker(broker)}
                  onChange={() => setIsChangingSource(true)}
                  onOpenTradeSync={openTradeSync}
                />
                <div className="journalit-trade-import-form-grid">
                  <ImportAccountPicker
                    accounts={accounts}
                    selectedAccount={selectedAccountName}
                    favoriteAccount={favoriteAccount}
                    isOpen={isAccountDropdownOpen}
                    busy={busy}
                    containerRef={accountDropdownRef}
                    onToggleOpen={() =>
                      dispatchDropdownState({
                        isAccountDropdownOpen: !isAccountDropdownOpen,
                      })
                    }
                    onSelect={(account) => {
                      setSelectedAccountName(account);
                      dispatchDropdownState({ isAccountDropdownOpen: false });
                      invalidatePreview();
                    }}
                    onToggleFavorite={(account) =>
                      void toggleFavoriteAccount(account)
                    }
                  />
                  <AssetTypeField
                    assetType={assetType}
                    busy={busy}
                    onSelect={selectAssetType}
                  />
                  <ImportFormatField
                    labelId={importFormatLabelId}
                    formats={importFormats}
                    broker={broker}
                    busy={busy}
                    onChange={selectSourceFormat}
                  />
                  <ImportDestinationField
                    labelId={importDestinationLabelId}
                    destination={importDestination}
                    busy={busy}
                    onChange={selectImportDestination}
                  />
                </div>

                <TradeImportFilePicker
                  file={file}
                  isDragging={isDraggingFile}
                  busy={busy}
                  inputRef={fileInputRef}
                  acceptedExtensions={acceptedExtensions}
                  acceptedExtensionList={acceptedExtensionList}
                  onFileSelected={handleFileSelected}
                  onDragEnter={handleFileDragEnter}
                  onDragLeave={handleFileDragLeave}
                  onDrop={handleFileDrop}
                />

                {isManualBroker && (
                  <ManualTemplateSection
                    picker={{
                      templates,
                      selectedTemplateId,
                      selectedTemplateName: templateNameOf(
                        localTemplateService,
                        selectedTemplateId
                      ),
                      favoriteTemplateId,
                      isOpen: isTemplateDropdownOpen,
                      busy,
                      containerRef: templateDropdownRef,
                      onToggleOpen: () =>
                        dispatchDropdownState({
                          isTemplateDropdownOpen: !isTemplateDropdownOpen,
                        }),
                      onClear: () => {
                        setSelectedTemplateId('');
                        setColumnMappings({});
                        setManualModeChoice(null);
                        
                        
                        setSelectedSheetName(null);
                        setSelectedHeaderRowIndex(null);
                        setTemplateExportCode('');
                        dispatchDropdownState({
                          isTemplateDropdownOpen: false,
                        });
                        invalidateAnalysis();
                      },
                      onApply: (template) => {
                        void applyTemplate(template);
                        dispatchDropdownState({
                          isTemplateDropdownOpen: false,
                        });
                      },
                      onToggleFavorite: (templateId) =>
                        void toggleFavoriteTemplate(templateId),
                    }}
                    actions={{
                      containerRef: templateActionsRef,
                      menuRef: templateMenuRef,
                      isOpen: templateActionsOpen,
                      position: templateMenuPosition,
                      busy,
                      hasSelection: selectedTemplateId !== '',
                      onToggle: () =>
                        dispatchTemplateActionMenuState({
                          templateActionsOpen: !templateActionsOpen,
                        }),
                      onImport: () => {
                        setTemplateImportOpen(true);
                        setTemplateExportCode('');
                        dispatchTemplateActionMenuState({
                          templateActionsOpen: false,
                        });
                      },
                      onExport: () => {
                        exportSelectedTemplate();
                        dispatchTemplateActionMenuState({
                          templateActionsOpen: false,
                        });
                      },
                      onDelete: () => {
                        dispatchTemplateActionMenuState({
                          templateActionsOpen: false,
                        });
                        void deleteSelectedTemplate();
                      },
                    }}
                    aiMapping={{
                      offered: offersAiMapping(
                        supportsManualMapping,
                        selectedBrokerCapabilities,
                        canUseAiMapping
                      ),
                      checked: aiMappingEnabled,
                      busy,
                      onChange: handleAiMappingChange,
                    }}
                    importPanel={{
                      open: templateImportOpen,
                      shareCode: templateShareCode,
                      busy,
                      onChange: setTemplateShareCode,
                      onImport: () => void importTemplate(),
                      onCancel: () => {
                        setTemplateImportOpen(false);
                        setTemplateShareCode('');
                      },
                    }}
                    exportPanel={{
                      code: templateExportCode,
                      copied: templateCopied,
                      onCopy: () => void copyTemplateExportCode(),
                    }}
                  />
                )}

                <TradeImportPrivacyNote />

                <button
                  className="journalit-trade-import-primary"
                  disabled={!canAnalyse(file, capabilities, busy)}
                  onClick={() => void runAnalyse()}
                >
                  {t('trade-import.action.analyse')}
                </button>
              </>
            )}
          </section>
        )}

        {activeStep === 2 && analyse && (
          <section className="csv-import-card journalit-trade-import-panel">
            <h2>
              <Sparkles /> {t('trade-import.step.analyse')}
            </h2>
            <>
              <AnalyseSourceReview
                analyse={analyse}
                broker={broker}
                selectedBrokerLabel={selectedBrokerLabel}
                supportsManualMapping={supportsManualMapping}
                analyseRecovery={analyseRecovery}
                failureRecovery={analyseFailureRecovery}
                busy={busy}
                onContinueWithSelectedSource={(recommendedSource) =>
                  setDismissedAnalyseRecovery({
                    file,
                    selectedSource: broker,
                    recommendedSource,
                  })
                }
                onSwitchSource={reanalyseFileForSource}
                onChangeSource={changeIncompatibleSource}
                onChooseAnotherFile={chooseAnotherFile}
              />
              <AnalyseReviewControls
                analyse={analyse}
                busy={busy}
                selectedSheetName={selectedSheetName}
                headerRowError={headerRowError}
                dateFormat={selectedDateFormat}
                dateFormatOptions={importDateFormatOptions(isHyperliquid)}
                onSelectSheet={(value) => {
                  
                  
                  void analyseFileForSource(broker, {
                    sheetName: value || null,
                    header: { index: null },
                    
                    freshMapping: !selectedTemplateId,
                  });
                }}
                onClearHeaderRowError={() => setHeaderRowError(null)}
                onCommitHeaderRow={(sheetRow) => {
                  void analyseFileForSource(broker, {
                    sheetName: selectedSheetName,
                    header: { sheetRow },
                    
                    freshMapping: !selectedTemplateId,
                  });
                }}
                onDateFormatChange={(value) => {
                  setSelectedDateFormat(value);
                  invalidatePreview();
                }}
              />
              <ExportTimeZoneError errorKey={exportTimeZoneStatus.errorKey} />
              <AnalyseSampleTable analyse={analyse} />
              {supportsManualMapping && (
                <ManualColumnMapper
                  plugin={plugin}
                  analyse={analyse}
                  columnMappings={displayColumnMappings}
                  requiredMappingFields={requiredMappingFields}
                  backendManualMode={backendManualMode}
                  manualMode={manualMode}
                  assetType={assetType}
                  perRowMode={perRowMode}
                  busy={busy}
                  modeTitleId={manualModeTitleId}
                  templateName={templateName}
                  onManualModeChange={(mode) => {
                    setManualModeChoice(mode);
                    invalidatePreview();
                  }}
                  onAssignColumn={(header, value) => {
                    invalidatePreview();
                    setColumnMappings((current) =>
                      updateColumnAssignment(current, header, value)
                    );
                  }}
                  onCreateCustomField={createCustomFieldForColumn}
                  onTemplateNameChange={setTemplateName}
                  onSaveTemplate={() => void saveTemplate()}
                />
              )}
              <PreviewErrorMessage error={previewError} />
              {needsAssetTypeConfirmation && (
                <TradeImportPnlFromPricesConfirm
                  assetType={assetType}
                  contractSizeMapped={Boolean(
                    applicableColumnMappings.contract_size
                  )}
                  busy={busy}
                  onConfirm={selectAssetType}
                />
              )}
              <ImportSymbolField
                required={analyse.requiresSymbol === true}
                value={importSymbol}
                busy={busy}
                onChange={(value) => {
                  setImportSymbol(value);
                  invalidatePreview();
                }}
              />
              <TradeImportPreviewAction
                replacedByRecovery={analyseFailureRecovery !== null}
                assetType={assetType}
                busy={busy}
                missingRequiredFields={missingRequiredMappingFields}
                pnlFromPricesAccepted={backendManualMode === 'trade_per_row'}
                ready={isPreviewReady({
                  file,
                  capabilities,
                  analyse,
                  analyseRecovery,
                  failureRecovery: analyseFailureRecovery,
                  needsAssetTypeConfirmation,
                  isHyperliquid,
                  hyperliquidPreviewReady,
                  importSymbol,
                })}
                onPreview={() => void runPreview()}
              />
            </>
          </section>
        )}

        {activeStep === 3 && preview && (
          <section className="csv-import-card journalit-trade-import-panel">
            <TradeImportPreviewHeader
              completedResult={completedImport}
              operationResult={operationResult}
              headingId={tradeImportCompletionHeadingId}
              onReset={resetImportFlow}
            />
            {completedImport ? (
              <TradeImportCompletedResults
                plugin={plugin}
                result={completedImport}
                operationResult={operationResult}
                headingId={tradeImportCompletionHeadingId}
                diagnostics={preview.diagnostics}
                failedRows={failedPreviewRows}
                onManageImports={manageImports}
              />
            ) : (
              <TradeImportPreviewReview
                accountCurrency={tradeImportAccountCurrency(
                  plugin.settings,
                  selectedAccountName
                )}
                breakEven={plugin.settings.trade}
                busy={busy}
                canCommit={canUseTradeImport}
                classified={classified}
                dateFormat={plugin.settings.trade.dateFormat}
                entitlementStatus={entitlementStatus}
                importCompleted={importCompleted}
                isCheckingEntitlement={isCheckingEntitlement}
                isRefreshingStatus={isRefreshingStatus}
                onCancel={() => void cancelPreview()}
                onChooseAnotherFile={chooseAnotherFile}
                onChangeSource={changeIncompatibleSource}
                onManageImports={manageImports}
                onConfirm={() => void confirmImport()}
                localAccountNames={accounts}
                mappingActions={diagnosticMappingActions}
                onChooseDateFormat={
                  supportsManualMapping ? chooseDateFormat : undefined
                }
                importAnywayItemIds={importAnywayItemIds}
                onToggleImportAnyway={toggleImportAnyway}
                workbookImageUrls={workbookImageUrls}
                workbookImagesIncluded={includeWorkbookImages}
                onToggleWorkbookImages={(included) =>
                  setWorkbookImagesExcludedFor(
                    included ? null : (preview?.importId ?? null)
                  )
                }
                onImportIntoAccount={importIntoAccount}
                onRefreshStatus={() => void handleRefreshStatus()}
                onUpgrade={handleUpgrade}
                preview={preview}
                use24HourTime={plugin.settings.trade.use24HourTime === true}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
});

CSVImport.displayName = 'CSVImport';
