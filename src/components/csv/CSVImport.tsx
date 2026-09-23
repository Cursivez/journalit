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
  ExternalLink,
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
import { Notice } from 'obsidian';
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
import { isTradeImportBlocked } from '../../services/tradeImport/commitEligibility';
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
import { writeClipboardText } from '../../utils/clipboard';
import {
  TradeImportDiagnostics,
  TradeImportPreviewReview,
} from './TradeImportPreviewReview';
import { resolveBrokerImportAnalyseRecovery } from './brokerImportRecovery';
import { BROKER_GUIDE_URLS } from './brokerGuides';
import {
  getTradeImportCompletionTitle,
  TradeImportCompletionSummary,
} from './TradeImportCompletionSummary';
import { buildImportOperationResult } from '../../services/tradeOperations/resultBuilders';
import type { TradeOperationResult } from '../../services/tradeOperations/types';
import {
  missingRequiredFieldsForMappings,
  normalizeManualColumnMappings,
  requiredFieldsForManualMode,
} from '../../services/tradeImport/manualMappingValidation';

interface CSVImportProps {
  plugin: JournalitPlugin;
}
type AssetType = 'stock' | 'options' | 'futures' | 'forex' | 'crypto';
type TradeImportWizardStep = 1 | 2 | 3;

const TRADE_IMPORT_STEP_NUMBERS: TradeImportWizardStep[] = [1, 2, 3];
const TRADE_FIELD_VALUES = new Set<string>(TRADE_FIELDS);

const isAssetType = (value: unknown): value is AssetType =>
  value === 'stock' ||
  value === 'options' ||
  value === 'futures' ||
  value === 'forex' ||
  value === 'crypto';

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

export function tradeImportPreviewErrorPresentation(error: unknown): {
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

const rememberedCsvAssetType = (
  plugin: JournalitPlugin,
  brokerId: string
): AssetType | undefined => {
  const value =
    plugin.settings.csvLastAssetType?.[brokerId] ??
    plugin.settings.csvLastAssetType?.__last;
  return isAssetType(value) ? value : undefined;
};

interface DropdownOption {
  value: string;
  label: string;
}

export const TradeImportSignInGate: React.FC<{ onSignIn: () => void }> = ({
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

      <div className="journalit-trade-import-gate-benefits">
        <div>
          <BadgeCheck size={16} />
          <span>{t('trade-import.gate.sign-in.reassurance')}</span>
        </div>
        <div>
          <BadgeCheck size={16} />
          <span>{t('trade-import.gate.sign-in.no-trial')}</span>
        </div>
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
    window.activeDocument.addEventListener('pointerdown', handlePointerDown);
    activeWindow.addEventListener('keydown', handleKeyDown, true);
    window.activeDocument.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );
    window.addEventListener('pagehide', handleWindowBlur);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.activeDocument.removeEventListener(
        'pointerdown',
        handlePointerDown
      );
      activeWindow.removeEventListener('keydown', handleKeyDown, true);
      window.activeDocument.removeEventListener(
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

function optionalCoreFieldsForMode(manualMode: ManualImportMode): TradeField[] {
  return manualMode === 'direct_pnl'
    ? [
        'quantity',
        'entry_price',
        'exit_time',
        'exit_price',
        'commission',
        'fees',
        'swap',
        'status',
      ]
    : [
        'exit_time',
        'exit_price',
        'commission',
        'fees',
        'swap',
        'profit_loss',
        'status',
      ];
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
  manualMode: ManualImportMode,
  assetType: AssetType,
  customFields: TradeImportCustomFieldDefinition[]
): Record<string, string[]> {
  const categories: Record<string, string[]> = {
    [t('csv.mapper.category.required')]:
      requiredFieldsForManualMode(manualMode),
    [t('csv.mapper.category.optional-core')]:
      optionalCoreFieldsForMode(manualMode),
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

interface TradeImportPreviewActionProps {
  assetType: AssetType;
  busy: boolean;
  missingRequiredFields: TradeField[];
  ready: boolean;
  onPreview: () => void;
}

export const TradeImportPreviewAction: React.FC<
  TradeImportPreviewActionProps
> = ({ assetType, busy, missingRequiredFields, ready, onPreview }) => {
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

export const CSVImport = memo<CSVImportProps>(({ plugin }) => {
  const tradeImportCompletionHeadingId = useId();
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
  const [selectedAccountName, setSelectedAccountName] = useState(
    plugin.settings.csvFavoriteAccount &&
      accounts.includes(plugin.settings.csvFavoriteAccount)
      ? plugin.settings.csvFavoriteAccount
      : accounts[0]
  );
  const [broker, setBroker] = useState(
    plugin.settings.csvFavoriteBroker ?? 'MANUAL'
  );
  const [assetType, setAssetType] = useState<AssetType>(
    () =>
      rememberedCsvAssetType(
        plugin,
        plugin.settings.csvFavoriteBroker ?? 'MANUAL'
      ) ?? 'stock'
  );
  const [favoriteAccount, setFavoriteAccount] = useState(
    plugin.settings.csvFavoriteAccount ?? ''
  );
  const [favoriteBroker, setFavoriteBroker] = useState(
    plugin.settings.csvFavoriteBroker ?? ''
  );
  const [favoriteTemplateId, setFavoriteTemplateId] = useState(
    plugin.settings.csvFavoriteTemplateId ?? ''
  );
  const [manualMode, setManualMode] = useState<ManualImportMode>('price_based');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
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
  const [selectedDateFormat, setSelectedDateFormat] = useState('');
  const [aiMappingRequested, setAiMappingRequested] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
  const [importResult, setImportResult] =
    useState<TradeImportCompletionResult | null>(null);
  const [operationResult, setOperationResult] =
    useState<TradeOperationResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);
  const [activeStep, setActiveStep] = useState<TradeImportWizardStep>(1);
  const requestVersionRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appliedFavoriteBrokerRef = useRef(false);
  const appliedFavoriteTemplateRef = useRef(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const brokerDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownState, dispatchDropdownState] = useReducer(
    (
      state: {
        isAccountDropdownOpen: boolean;
        isBrokerDropdownOpen: boolean;
        isTemplateDropdownOpen: boolean;
      },
      update: Partial<{
        isAccountDropdownOpen: boolean;
        isBrokerDropdownOpen: boolean;
        isTemplateDropdownOpen: boolean;
      }>
    ) => ({ ...state, ...update }),
    {
      isAccountDropdownOpen: false,
      isBrokerDropdownOpen: false,
      isTemplateDropdownOpen: false,
    }
  );
  const {
    isAccountDropdownOpen,
    isBrokerDropdownOpen,
    isTemplateDropdownOpen,
  } = dropdownState;
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
    window.activeDocument.addEventListener('pointerdown', handlePointerDown);
    activeWindow.addEventListener('keydown', handleKeyDown, true);
    window.activeDocument.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );
    window.addEventListener('pagehide', handleWindowBlur);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.activeDocument.removeEventListener(
        'pointerdown',
        handlePointerDown
      );
      activeWindow.removeEventListener('keydown', handleKeyDown, true);
      window.activeDocument.removeEventListener(
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
        brokerDropdownRef.current &&
        event.target instanceof Node &&
        !brokerDropdownRef.current.contains(event.target)
      ) {
        dispatchDropdownState({ isBrokerDropdownOpen: false });
      }
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

    window.activeDocument.addEventListener('mousedown', handleClickOutside);
    return () =>
      window.activeDocument.removeEventListener(
        'mousedown',
        handleClickOutside
      );
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
  const supportedExtensions =
    capabilities?.fileTypes
      .flatMap((type) => type.extensions.map((ext) => `.${ext}`))
      .join(',') ?? '.csv,.txt,.xlsx,.xls,.html,.htm';
  const selectedBrokerCapabilities = capabilities?.brokers.find(
    (item) => item.id === broker
  );
  const selectedBrokerLabel =
    selectedBrokerCapabilities?.label ??
    brokers.find((item) => item.id === broker)?.label ??
    t('trade-import.broker.manual');
  const brokerGuideUrl = BROKER_GUIDE_URLS[broker];
  const isManualBroker = broker === 'MANUAL';
  const isManualMappingFlow = broker === 'MANUAL' || selectedTemplateId !== '';
  const supportsManualMapping =
    isManualMappingFlow &&
    (selectedBrokerCapabilities?.supportsManualMapping ?? broker === 'MANUAL');
  const missingRequiredMappingFields = useMemo(
    () =>
      supportsManualMapping
        ? missingRequiredFieldsForMappings(
            manualMode,
            columnMappings,
            analyse?.headers ?? []
          )
        : [],
    [analyse, columnMappings, manualMode, supportsManualMapping]
  );
  const applicableColumnMappings = useMemo(
    () =>
      analyse
        ? normalizeManualColumnMappings(columnMappings, analyse.headers)
        : {},
    [analyse, columnMappings]
  );
  const analyseRecovery = useMemo(
    () =>
      analyse ? resolveBrokerImportAnalyseRecovery(analyse, broker) : null,
    [analyse, broker]
  );
  const AnalyseRecoveryNotice = analyseRecovery?.Notice;
  const failedPreviewRows = classified.filter((item) =>
    isTradeImportBlocked(item.defaultAction)
  );

  const supportedFileTypesSet = new Set(
    selectedBrokerCapabilities?.supportedFileTypes ?? []
  );
  const acceptedExtensionList = selectedBrokerCapabilities
    ? capabilities?.fileTypes.flatMap((type) =>
        supportedFileTypesSet.has(type.id)
          ? type.extensions.map((ext) => `.${ext}`)
          : []
      ) || []
    : supportedExtensions.split(',').filter(Boolean);
  const acceptedExtensions = acceptedExtensionList.join(',');

  const applyQuickImportHandoff = useCallback(() => {
    if (!capabilities) return false;
    const handoff = consumeQuickImportTradeImportHandoff();
    if (!handoff) return false;

    appliedFavoriteBrokerRef.current = true;
    appliedFavoriteTemplateRef.current = true;
    requestVersionRef.current += 1;

    setSelectedAccountName(handoff.accountName);
    setBroker(handoff.broker);
    setAssetType(handoff.assetType);
    setManualMode(handoff.manualMode ?? 'price_based');
    setSelectedDateFormat(handoff.dateFormat ?? '');
    setSelectedSheetName(handoff.sheetName ?? null);
    setSelectedHeaderRowIndex(handoff.headerRowIndex ?? null);
    setColumnMappings(handoff.columnMappings);
    setAiMappingRequested(handoff.aiMappingEnabled);
    setFile(handoff.file);
    setAnalyse(handoff.analyse ?? null);
    setPreview(handoff.preview ?? null);
    setPreviewOwnerUserId(handoff.previewOwnerUserId ?? null);
    setClassified(handoff.classified ?? []);
    setImportResult(null);
    setOperationResult(null);
    setImportCompleted(false);
    setSelectedTemplateId(handoff.templateId ?? '');
    setTemplateName(handoff.templateName ?? '');
    setActiveStep(handoff.preview ? 3 : handoff.analyse ? 2 : 1);
    return true;
  }, [capabilities]);

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
      setBroker(nextBroker);
      if (nextBroker !== 'MANUAL') {
        setSelectedTemplateId('');
        setTemplateExportCode('');
        setTemplateImportOpen(false);
      }
      const lastAssetType = rememberedCsvAssetType(plugin, nextBroker);
      if (lastAssetType) setAssetType(lastAssetType);
    },
    [plugin]
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
        : 'MANUAL';

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

  const handleAiMappingChange = useCallback(
    (checked: boolean) => {
      setAiMappingRequested(checked);
      if (!checked && !selectedTemplateId) setColumnMappings({});
      invalidateAnalysis();
    },
    [invalidateAnalysis, selectedTemplateId]
  );

  const selectBroker = useCallback(
    (brokerId: string) => {
      setBroker(brokerId);
      if (brokerId !== 'MANUAL') {
        setSelectedTemplateId('');
        setTemplateExportCode('');
        setTemplateImportOpen(false);
      }
      const lastAssetType = rememberedCsvAssetType(plugin, brokerId);
      if (lastAssetType) setAssetType(lastAssetType);
      dispatchDropdownState({ isBrokerDropdownOpen: false });
      invalidateAnalysis();
    },
    [invalidateAnalysis, plugin]
  );

  const selectAssetType = useCallback(
    (nextAssetType: AssetType) => {
      setAssetType(nextAssetType);
      plugin.settings.csvLastAssetType = {
        ...(plugin.settings.csvLastAssetType ?? {}),
        [broker]: nextAssetType,
        __last: nextAssetType,
      };
      void plugin.saveSettings();
      invalidatePreview();
    },
    [broker, invalidatePreview, plugin]
  );

  const applyTemplate = useCallback(
    async (template: LocalCSVTemplate, markAsUsed = true) => {
      setSelectedTemplateId(template.id);
      setBroker(template.broker_type);
      setAssetType(template.asset_type);
      setManualMode(template.manual_mode ?? 'price_based');
      setSelectedHeaderRowIndex(template.header_row_index ?? null);
      setSelectedDateFormat(template.date_format ?? '');
      setColumnMappings(asMappings(template.column_mappings));
      invalidateAnalysis();
      if (markAsUsed) {
        await localTemplateService.markTemplateAsUsed(template.id);
      }
    },
    [invalidateAnalysis, localTemplateService]
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
        headerRowIndex: number | null;
      }
    ) => {
      if (!file || !capabilities) return;
      const requestVersion = requestVersionRef.current + 1;
      requestVersionRef.current = requestVersion;
      const requestSheetName = selection
        ? selection.sheetName
        : selectedSheetName;
      const requestHeaderRowIndex = selection
        ? selection.headerRowIndex
        : selectedHeaderRowIndex;
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
            headerRowIndex: requestHeaderRowIndex,
            aiMappingEnabled,
          });
        if (requestVersion !== requestVersionRef.current) return;
        setAnalyse(response);
        setSelectedSheetName(
          response.selectedSheet ?? response.suggestedSheet ?? null
        );
        setSelectedHeaderRowIndex(
          requestHeaderRowIndex ?? response.suggestedHeaderRowIndex ?? 1
        );
        setColumnMappings((currentMappings) =>
          !sourceSupportsManualMapping ||
          !aiMappingEnabled ||
          Object.keys(currentMappings).length > 0
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
        new Notice(
          freePreviewRateLimitMessage(error) ??
            (error instanceof TradeImportValidationError
              ? error.message
              : t('trade-import.notice.analyse-failed'))
        );
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

  const switchToRecommendedSource = useCallback(
    (source: string) => {
      setBroker(source);
      setSelectedTemplateId('');
      setTemplateExportCode('');
      setTemplateImportOpen(false);
      setColumnMappings({});
      setManualMode('price_based');
      setSelectedDateFormat('');
      setAiMappingRequested(false);
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
        headerRowIndex: null,
      });
    },
    [analyseFileForSource]
  );

  const runPreview = useCallback(async () => {
    if (!file || !selectedAccountName || !analyse) return;
    if (!capabilities) return;
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
          accountName: selectedAccountName,
          assetType,
          manualMode,
          dateFormat: selectedDateFormat,
          columnMappings: applicableColumnMappings,
          manualMappingRequired: supportsManualMapping,
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
  }, [
    analyse,
    applicableColumnMappings,
    assetType,
    broker,
    capabilities,
    file,
    manualMode,
    missingRequiredMappingFields,
    selectedDateFormat,
    selectedHeaderRowIndex,
    selectedAccountName,
    selectedBrokerCapabilities,
    selectedSheetName,
    supportsManualMapping,
    workflowService,
  ]);

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
        },
      });
    } finally {
      setBusy(false);
    }
  }, [
    classified,
    file,
    importCompleted,
    plugin,
    preview,
    previewOwnerUserId,
    selectedAccountName,
    selectedBrokerLabel,
    workflowService,
  ]);

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
      if (!selectedTemplateId) setColumnMappings({});
      invalidateAnalysis();
    },
    [invalidateAnalysis, selectedTemplateId]
  );

  const chooseAnotherFile = useCallback(() => {
    if (!preview || importCompleted) return;
    if (!selectedTemplateId) {
      setSelectedSheetName(null);
      setSelectedHeaderRowIndex(null);
    }
    handleFileSelected(null);
  }, [handleFileSelected, importCompleted, preview, selectedTemplateId]);

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

  const maxStep = importCompleted || preview ? 3 : analyse ? 2 : 1;

  const requiredFieldsForModeSet = new Set(
    requiredFieldsForManualMode(manualMode)
  );
  return (
    <div className="journalit-csv-import journalit-trade-import-simple">
      <div className="journalit-trade-import-stepper">
        {TRADE_IMPORT_STEP_NUMBERS.map((stepNumber) => {
          const label =
            stepNumber === 1
              ? t('trade-import.step.select')
              : stepNumber === 2
                ? t('trade-import.step.analyse')
                : t('trade-import.step.preview');
          return (
            <button
              type="button"
              disabled={stepNumber > maxStep || busy}
              onClick={() => setActiveStep(stepNumber)}
              key={label}
              className={`journalit-trade-import-step ${maxStep >= stepNumber ? 'is-active' : ''} ${activeStep === stepNumber ? 'is-current' : ''}`}
            >
              <span>{stepNumber}</span>
              <strong>{label}</strong>
            </button>
          );
        })}
      </div>

      <div className="journalit-trade-import-layout">
        {activeStep === 1 && (
          <section className="csv-import-card journalit-trade-import-panel">
            <h2>
              <Settings2 /> {t('trade-import.step.select')}
            </h2>
            <div className="journalit-trade-import-form-grid">
              <label>
                {t('trade-import.label.account')}
                <div
                  className="journalit-home-period-wrapper journalit-trade-import-account-picker"
                  ref={accountDropdownRef}
                >
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      dispatchDropdownState({
                        isAccountDropdownOpen: !isAccountDropdownOpen,
                      })
                    }
                    className="journalit-home-period-selector journalit-trade-import-account-trigger clickable-icon"
                    aria-label={t('trade-import.label.account')}
                  >
                    <span>{selectedAccountName}</span>
                    <ChevronDown
                      size={14}
                      className={`journalit-home-period-chevron${isAccountDropdownOpen ? ' journalit-home-period-chevron--open' : ''}`}
                    />
                  </button>
                  {isAccountDropdownOpen && (
                    <div className="journalit-home-period-menu journalit-trade-import-account-menu">
                      {accounts.map((account) => {
                        const isSelected = account === selectedAccountName;
                        return (
                          <div
                            key={account}
                            className={`journalit-home-period-option journalit-trade-import-favorite-option${isSelected ? ' journalit-home-period-option--active' : ''}`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAccountName(account);
                                dispatchDropdownState({
                                  isAccountDropdownOpen: false,
                                });
                                invalidatePreview();
                              }}
                              className="journalit-trade-import-favorite-option__select"
                            >
                              <span
                                className="journalit-home-period-option__check"
                                aria-hidden="true"
                              >
                                {isSelected ? (
                                  <Check size={10} strokeWidth={3} />
                                ) : null}
                              </span>
                              <span className="journalit-home-period-option__label">
                                {account}
                              </span>
                            </button>
                            <button
                              type="button"
                              className={`journalit-trade-import-favorite-button${favoriteAccount === account ? ' is-favorite' : ''}`}
                              aria-label={
                                favoriteAccount === account
                                  ? t('csv.account-selector.favorite.remove')
                                  : t('csv.account-selector.favorite.set')
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                void toggleFavoriteAccount(account);
                              }}
                            >
                              <Star size={13} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </label>
              <label>
                {t('trade-import.label.broker')}
                <div
                  className="journalit-home-period-wrapper journalit-trade-import-broker-picker"
                  ref={brokerDropdownRef}
                >
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      dispatchDropdownState({
                        isBrokerDropdownOpen: !isBrokerDropdownOpen,
                      })
                    }
                    className="journalit-home-period-selector journalit-trade-import-broker-trigger clickable-icon"
                    aria-label={t('trade-import.label.broker')}
                  >
                    <span>{selectedBrokerLabel}</span>
                    <ChevronDown
                      size={14}
                      className={`journalit-home-period-chevron${isBrokerDropdownOpen ? ' journalit-home-period-chevron--open' : ''}`}
                    />
                  </button>
                  {isBrokerDropdownOpen && (
                    <div className="journalit-home-period-menu journalit-trade-import-broker-menu">
                      {brokers.map((item) => {
                        const isSelected = item.id === broker;
                        return (
                          <div
                            key={item.id}
                            className={`journalit-home-period-option journalit-trade-import-favorite-option${isSelected ? ' journalit-home-period-option--active' : ''}`}
                          >
                            <button
                              type="button"
                              onClick={() => selectBroker(item.id)}
                              className="journalit-trade-import-favorite-option__select"
                            >
                              <span
                                className="journalit-home-period-option__check"
                                aria-hidden="true"
                              >
                                {isSelected ? (
                                  <Check size={10} strokeWidth={3} />
                                ) : null}
                              </span>
                              <span className="journalit-home-period-option__label">
                                {item.label}
                              </span>
                            </button>
                            <button
                              type="button"
                              className={`journalit-trade-import-favorite-button${favoriteBroker === item.id ? ' is-favorite' : ''}`}
                              aria-label={
                                favoriteBroker === item.id
                                  ? t('csv.broker.remove-favorite-aria')
                                  : t('csv.broker.set-favorite-aria')
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                void toggleFavoriteBroker(item.id);
                              }}
                            >
                              <Star size={13} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </label>
              <label>
                {t('trade-import.label.asset-type')}
                <TradeImportDropdown
                  label={t('trade-import.label.asset-type')}
                  disabled={busy}
                  value={assetType}
                  options={[
                    { value: 'stock', label: t('trade-import.asset.stock') },
                    {
                      value: 'options',
                      label: t('trade-import.asset.options'),
                    },
                    {
                      value: 'futures',
                      label: t('trade-import.asset.futures'),
                    },
                    { value: 'forex', label: t('trade-import.asset.forex') },
                    { value: 'crypto', label: t('trade-import.asset.crypto') },
                  ]}
                  onChange={(value) => {
                    if (isAssetType(value)) {
                      selectAssetType(value);
                    }
                  }}
                />
              </label>
            </div>

            <div
              className={`journalit-trade-import-file-picker ${isDraggingFile ? 'is-dragging' : ''}`}
              role="button"
              tabIndex={busy ? -1 : 0}
              onClick={(event) => {
                const target = event.target;
                if (
                  target instanceof Element &&
                  target.closest('.journalit-trade-import-guide-link')
                ) {
                  return;
                }
                fileInputRef.current?.click();
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragEnter={handleFileDragEnter}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={handleFileDragLeave}
              onDrop={handleFileDrop}
            >
              <input
                aria-label={t('trade-import.action.choose-file')}
                ref={fileInputRef}
                type="file"
                accept={acceptedExtensions}
                disabled={busy}
                onChange={(event) =>
                  handleFileSelected(event.target.files?.[0] ?? null)
                }
              />
              <FileText size={36} />
              <span className="journalit-trade-import-file-picker-label">
                {file
                  ? file.name
                  : isDraggingFile
                    ? t('trade-import.action.drop-file')
                    : t('trade-import.action.choose-file')}
              </span>
              {brokerGuideUrl && (
                <div className="journalit-trade-import-guide-prompt">
                  <span>{t('trade-import.guide.prompt')}</span>
                  <button
                    type="button"
                    className="journalit-trade-import-guide-link"
                    disabled={busy}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      openExternalUrl(brokerGuideUrl);
                    }}
                  >
                    {t('trade-import.guide.link')}
                    <ExternalLink size={13} aria-hidden="true" />
                  </button>
                </div>
              )}
              <div className="journalit-trade-import-file-types" aria-hidden>
                {acceptedExtensionList.map((extension) => (
                  <span key={extension}>{extension}</span>
                ))}
              </div>
            </div>

            {isManualBroker && (
              <div className="journalit-trade-import-template-section">
                <div className="journalit-trade-import-template-picker-row">
                  <label>
                    {t('trade-import.label.template')}
                    <div
                      className="journalit-home-period-wrapper journalit-trade-import-template-picker"
                      ref={templateDropdownRef}
                    >
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          dispatchDropdownState({
                            isTemplateDropdownOpen: !isTemplateDropdownOpen,
                          })
                        }
                        className="journalit-home-period-selector journalit-trade-import-template-trigger clickable-icon"
                        aria-label={t('trade-import.label.template')}
                      >
                        <span>
                          {selectedTemplateId
                            ? localTemplateService.getTemplate(
                                selectedTemplateId
                              )?.name
                            : t('trade-import.template.none')}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`journalit-home-period-chevron${isTemplateDropdownOpen ? ' journalit-home-period-chevron--open' : ''}`}
                        />
                      </button>
                      {isTemplateDropdownOpen && (
                        <div className="journalit-home-period-menu journalit-trade-import-template-select-menu">
                          <div
                            className={`journalit-home-period-option journalit-trade-import-favorite-option${selectedTemplateId === '' ? ' journalit-home-period-option--active' : ''}`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTemplateId('');
                                setColumnMappings({});
                                setTemplateExportCode('');
                                dispatchDropdownState({
                                  isTemplateDropdownOpen: false,
                                });
                                invalidateAnalysis();
                              }}
                              className="journalit-trade-import-favorite-option__select"
                            >
                              <span
                                className="journalit-home-period-option__check"
                                aria-hidden="true"
                              >
                                {selectedTemplateId === '' ? (
                                  <Check size={10} strokeWidth={3} />
                                ) : null}
                              </span>
                              <span className="journalit-home-period-option__label">
                                {t('trade-import.template.none')}
                              </span>
                            </button>
                          </div>
                          {templates.map((template) => {
                            const isSelected =
                              template.id === selectedTemplateId;
                            return (
                              <div
                                key={template.id}
                                className={`journalit-home-period-option journalit-trade-import-favorite-option${isSelected ? ' journalit-home-period-option--active' : ''}`}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    void applyTemplate(template);
                                    dispatchDropdownState({
                                      isTemplateDropdownOpen: false,
                                    });
                                  }}
                                  className="journalit-trade-import-favorite-option__select"
                                >
                                  <span
                                    className="journalit-home-period-option__check"
                                    aria-hidden="true"
                                  >
                                    {isSelected ? (
                                      <Check size={10} strokeWidth={3} />
                                    ) : null}
                                  </span>
                                  <span className="journalit-home-period-option__label">
                                    {template.name}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  className={`journalit-trade-import-favorite-button${favoriteTemplateId === template.id ? ' is-favorite' : ''}`}
                                  aria-label={
                                    favoriteTemplateId === template.id
                                      ? t(
                                          'csv.account-selector.favorite.remove'
                                        )
                                      : t('csv.account-selector.favorite.set')
                                  }
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    void toggleFavoriteTemplate(template.id);
                                  }}
                                >
                                  <Star size={13} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </label>
                  <div
                    ref={templateActionsRef}
                    className="journalit-trade-import-template-menu-wrapper"
                  >
                    <button
                      type="button"
                      className="journalit-trade-import-template-menu-trigger"
                      disabled={busy}
                      aria-label={t('trade-import.label.template-actions')}
                      onClick={() =>
                        dispatchTemplateActionMenuState({
                          templateActionsOpen: !templateActionsOpen,
                        })
                      }
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {templateActionsOpen &&
                      templateMenuPosition &&
                      createPortal(
                        <div
                          ref={templateMenuRef}
                          className="journalit-trade-import-template-menu journalit-trade-import-template-menu--portal"
                          style={cssVars({
                            '--trade-import-menu-top': `${templateMenuPosition.top}px`,
                            '--trade-import-menu-left': `${templateMenuPosition.left}px`,
                            '--trade-import-menu-width': `${templateMenuPosition.width}px`,
                            '--trade-import-menu-max-height': `${templateMenuPosition.maxHeight}px`,
                          })}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setTemplateImportOpen(true);
                              setTemplateExportCode('');
                              dispatchTemplateActionMenuState({
                                templateActionsOpen: false,
                              });
                            }}
                          >
                            <Upload size={15} aria-hidden="true" />
                            {t('csv.template-import.button.import')}
                          </button>
                          <button
                            type="button"
                            disabled={!selectedTemplateId}
                            onClick={() => {
                              exportSelectedTemplate();
                              dispatchTemplateActionMenuState({
                                templateActionsOpen: false,
                              });
                            }}
                          >
                            <Download size={15} aria-hidden="true" />
                            {t('csv.button.export-template')}
                          </button>
                          <button
                            type="button"
                            disabled={!selectedTemplateId}
                            onClick={() => {
                              dispatchTemplateActionMenuState({
                                templateActionsOpen: false,
                              });
                              void deleteSelectedTemplate();
                            }}
                          >
                            <Trash2 size={15} aria-hidden="true" />
                            {t('csv.button.delete-template')}
                          </button>
                        </div>,
                        window.activeDocument.body
                      )}
                  </div>
                  {supportsManualMapping &&
                    selectedBrokerCapabilities?.supportsAiMapping &&
                    canUseAiMapping && (
                      <label className="journalit-trade-import-ai-toggle">
                        <input
                          type="checkbox"
                          disabled={busy}
                          checked={aiMappingEnabled}
                          onChange={(event) => {
                            handleAiMappingChange(event.target.checked);
                          }}
                        />
                        <span>{t('trade-import.label.ai-mapping')}</span>
                      </label>
                    )}
                </div>
                {templateImportOpen && (
                  <div className="journalit-trade-import-template-panel">
                    <label>
                      {t('csv.template-import.label.share-code')}
                      <input
                        type="text"
                        disabled={busy}
                        value={templateShareCode}
                        onChange={(event) =>
                          setTemplateShareCode(event.target.value)
                        }
                        placeholder={t(
                          'csv.template-import.placeholder.share-code'
                        )}
                      />
                    </label>
                    <div className="journalit-trade-import-template-actions">
                      <button
                        disabled={!templateShareCode.trim() || busy}
                        onClick={() => void importTemplate()}
                      >
                        {t('csv.template-import.button.import')}
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => {
                          setTemplateImportOpen(false);
                          setTemplateShareCode('');
                        }}
                      >
                        {t('button.cancel')}
                      </button>
                    </div>
                  </div>
                )}
                {templateExportCode && (
                  <div className="journalit-trade-import-template-panel">
                    <label>
                      {t('csv.export-template.label.share-code')}
                      <textarea readOnly value={templateExportCode} />
                    </label>
                    <button onClick={() => void copyTemplateExportCode()}>
                      {templateCopied
                        ? t('csv.export-template.button.copied')
                        : t('csv.export-template.button.copy')}
                    </button>
                  </div>
                )}
                {supportsManualMapping && (
                  <div className="journalit-trade-import-manual-mode">
                    <div className="journalit-trade-import-manual-mode-title">
                      {t('csv.mapper.mode.title')}
                    </div>
                    <p>{t('csv.mapper.mode.help')}</p>
                    <div
                      className="journalit-trade-import-manual-mode-options"
                      role="radiogroup"
                      aria-label={t('trade-import.label.manual-mode')}
                    >
                      {(
                        [
                          [
                            'price_based',
                            t('trade-import.manual-mode.price-based'),
                          ],
                          [
                            'direct_pnl',
                            t('trade-import.manual-mode.direct-pnl'),
                          ],
                        ] as const
                      ).map(([value, label]) => (
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
                                setManualMode(event.target.value);
                                invalidatePreview();
                              }
                            }}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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

            <button
              className="journalit-trade-import-primary"
              disabled={!file || !capabilities || busy}
              onClick={() => void runAnalyse()}
            >
              {t('trade-import.action.analyse')}
            </button>
          </section>
        )}

        {activeStep === 2 && analyse && (
          <section className="csv-import-card journalit-trade-import-panel">
            <h2>
              <Sparkles /> {t('trade-import.step.analyse')}
            </h2>
            <>
              <p>
                {t('trade-import.analyse.detected', {
                  fileType: analyse.fileType,
                })}
              </p>
              {analyseRecovery && AnalyseRecoveryNotice && (
                <AnalyseRecoveryNotice
                  className="journalit-trade-import-outcome journalit-trade-import-outcome--failed"
                  disabled={busy}
                  iconSize={20}
                  selectedSource={broker}
                  onSwitchSource={() =>
                    switchToRecommendedSource(analyseRecovery.recommendedSource)
                  }
                />
              )}
              <TradeImportDiagnostics
                diagnostics={analyse.diagnostics}
                defaultOpen={true}
              />
              <div className="journalit-trade-import-review-controls">
                {analyse.sheets.length > 0 && (
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
                      onChange={(value) => {
                        setSelectedSheetName(value || null);
                        invalidateAnalysis();
                      }}
                    />
                  </label>
                )}
                <label>
                  <span>{t('trade-import.label.header-row')}</span>
                  <input
                    type="number"
                    disabled={busy}
                    min={1}
                    value={selectedHeaderRowIndex ?? ''}
                    placeholder={t('trade-import.placeholder.auto')}
                    onChange={(event) => {
                      setSelectedHeaderRowIndex(
                        event.target.value
                          ? Math.max(1, Number(event.target.value) || 1)
                          : null
                      );
                      invalidateAnalysis();
                    }}
                  />
                </label>
                <label className="journalit-trade-import-date-format-control">
                  <span>{t('trade-import.label.date-format')}</span>
                  <TradeImportDropdown
                    label={t('trade-import.label.date-format')}
                    disabled={busy}
                    value={selectedDateFormat}
                    options={getDateFormatOptions()}
                    menuClassName="journalit-trade-import-date-format-menu"
                    menuMinWidth={520}
                    onChange={(value) => {
                      setSelectedDateFormat(value);
                      invalidatePreview();
                    }}
                  />
                </label>
              </div>
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
                          <td
                            key={`${analyse.headers[cellIndex] ?? cellIndex}:${cell}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {supportsManualMapping && (
                <div className="csv-column-mapper journalit-trade-import-inline-mapper">
                  <div className="csv-mapper-header">
                    <h3>{t('csv.mapper.title')}</h3>
                    <p>{t('csv.mapper.subtitle')}</p>
                  </div>
                  <div className="csv-message csv-message--info csv-tip-message">
                    <strong>{t('csv.mapper.tip.title')}</strong>
                    <p className="csv-tip-text">{t('csv.mapper.tip.desc')}</p>
                  </div>
                  <div className="csv-mapper-grid-container">
                    <div className="csv-mapper-grid">
                      {analyse.headers.map((header) => {
                        const assignments = columnAssignmentsFromMappings(
                          columnMappings,
                          analyse.headers
                        );
                        const selectedField = assignments[header] ?? '';
                        const customFields = customFieldDefinitions(plugin);
                        const usedSingleFields = new Set(
                          Object.values(assignments).filter(
                            (field) =>
                              field !== selectedField &&
                              !isMultiColumnMappingField(field, customFields)
                          )
                        );
                        const tradeFieldOptions = TRADE_FIELDS.flatMap(
                          (field) =>
                            field === selectedField ||
                            !usedSingleFields.has(field)
                              ? [
                                  {
                                    value: field,
                                    label: fieldLabel(field),
                                  },
                                ]
                              : []
                        );
                        const customFieldOptions = customFieldDefinitions(
                          plugin
                        ).flatMap((field) => {
                          const fieldKey = field.fieldKey || field.id;
                          const option = {
                            value: `custom:${fieldKey}`,
                            label: `${field.label || fieldKey} (${fieldKey})`,
                          };
                          return option.value === selectedField ||
                            !usedSingleFields.has(option.value)
                            ? [option]
                            : [];
                        });
                        const sampleValue = sampleValueForHeader(
                          header,
                          analyse.headers,
                          analyse.sampleRows
                        );
                        return (
                          <div key={header} className="csv-mapper-row">
                            <div className="csv-mapper-source">
                              <div className="csv-column-header">
                                <div className="csv-column-name">
                                  <span>{header}</span>
                                  {isTradeField(selectedField) &&
                                    requiredFieldsForModeSet.has(
                                      selectedField
                                    ) && (
                                      <span className="csv-required-badge csv-required-badge--source">
                                        {t('csv.mapper.required-badge')}
                                      </span>
                                    )}
                                </div>
                                {sampleValue && (
                                  <div className="csv-column-sample">
                                    {t('csv.mapper.example')}{' '}
                                    <span className="csv-sample-value">
                                      {sampleValue}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="csv-mapper-arrow">→</div>
                            <div className="csv-mapper-target">
                              <TradeImportDropdown
                                label={t('csv.mapper.aria.map-column', {
                                  header,
                                })}
                                disabled={busy}
                                value={selectedField}
                                options={[
                                  {
                                    value: '',
                                    label: t('csv.mapper.do-not-import'),
                                  },
                                  ...tradeFieldOptions,
                                  ...customFieldOptions,
                                ]}
                                onChange={(value) => {
                                  invalidatePreview();
                                  setColumnMappings((current) =>
                                    updateColumnAssignment(
                                      current,
                                      header,
                                      value
                                    )
                                  );
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="csv-mapper-summary csv-mapper-summary--box">
                    {(() => {
                      const assignments = columnAssignmentsFromMappings(
                        columnMappings,
                        analyse.headers
                      );
                      const mappedFields = new Set(Object.values(assignments));
                      const allRequiredMapped = requiredFieldsForManualMode(
                        manualMode
                      ).every((field) => mappedFields.has(field));
                      return (
                        <>
                          <strong>{t('csv.mapper.summary.title')}</strong>{' '}
                          {Object.values(assignments).filter(Boolean).length}{' '}
                          {t('csv.mapper.summary.of')} {analyse.headers.length}{' '}
                          {t('csv.mapper.summary.columns-mapped')}
                          {allRequiredMapped && (
                            <span className="csv-mapper-summary-success">
                              ✓ {t('csv.mapper.summary.all-mapped')}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div className="csv-mapper-fields-section">
                    <Accordion
                      title={t('csv.mapper.available-fields.title')}
                      defaultExpanded={false}
                    >
                      {(() => {
                        const assignments = columnAssignmentsFromMappings(
                          columnMappings,
                          analyse.headers
                        );
                        const mappedFields = new Set(
                          Object.values(assignments)
                        );
                        const customFields = customFieldDefinitions(plugin);
                        const helpText = fieldHelpText();
                        const requiredFieldsForModeSet2 = new Set(
                          requiredFieldsForManualMode(manualMode)
                        );
                        return (
                          <div className="csv-mapper-fields-reference">
                            <p className="csv-mapper-fields-desc">
                              {t('csv.mapper.available-fields.desc')}
                            </p>
                            {Object.entries(
                              visibleFieldCategories(
                                manualMode,
                                assetType,
                                customFields
                              )
                            ).map(([category, fields]) => (
                              <div
                                key={category}
                                className="csv-field-category"
                              >
                                <h4 className="csv-field-category-title">
                                  {category}
                                </h4>
                                <div className="csv-field-category-list">
                                  {fields.map((field) => {
                                    const mapped = mappedFields.has(field);
                                    const required =
                                      isTradeField(field) &&
                                      requiredFieldsForModeSet2.has(field);
                                    return (
                                      <div
                                        key={field}
                                        className={`csv-field-item ${mapped ? 'csv-field-item--mapped' : 'csv-field-item--unmapped'}`}
                                      >
                                        <span className="csv-field-item-icon">
                                          {mapped ? '✓' : '○'}
                                        </span>
                                        <strong>
                                          {mappingFieldLabel(
                                            field,
                                            customFields
                                          )}
                                        </strong>
                                        {required && (
                                          <span
                                            className={`csv-field-required ${mapped ? 'csv-field-required--mapped' : 'csv-field-required--unmapped'}`}
                                          >
                                            {t('csv.mapper.required-label')}
                                          </span>
                                        )}
                                        {helpText[field] && (
                                          <span className="csv-field-help">
                                            : {helpText[field]}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </Accordion>
                  </div>
                  <div className="journalit-trade-import-save-template-row">
                    <label>
                      {t('trade-import.label.save-template')}
                      <input
                        type="text"
                        disabled={busy}
                        value={templateName}
                        onChange={(event) =>
                          setTemplateName(event.target.value)
                        }
                        placeholder={t(
                          'trade-import.placeholder.template-name'
                        )}
                      />
                    </label>
                    <button
                      disabled={!templateName.trim() || busy}
                      onClick={() => void saveTemplate()}
                    >
                      {t('trade-import.action.save-template')}
                    </button>
                  </div>
                </div>
              )}
              {previewError && (
                <div className="csv-message csv-message--error journalit-trade-import-preview-error">
                  <strong>{previewError.message}</strong>
                  {previewError.details && <p>{previewError.details}</p>}
                  {previewError.showGuidance && (
                    <p>{t('trade-import.preview-error.guidance')}</p>
                  )}
                </div>
              )}
              <TradeImportPreviewAction
                assetType={assetType}
                busy={busy}
                missingRequiredFields={missingRequiredMappingFields}
                ready={Boolean(
                  file && capabilities && analyse && !analyseRecovery
                )}
                onPreview={() => void runPreview()}
              />
            </>
          </section>
        )}

        {activeStep === 3 && preview && (
          <section className="csv-import-card journalit-trade-import-panel">
            <div
              className={
                importCompleted && importResult
                  ? 'journalit-trade-import-completion-header'
                  : undefined
              }
            >
              <h2
                id={
                  importCompleted && importResult
                    ? tradeImportCompletionHeadingId
                    : undefined
                }
              >
                {importCompleted &&
                importResult &&
                (operationResult?.partial ||
                  importResult.failedCount > 0 ||
                  importResult.pendingCount > 0) ? (
                  <AlertTriangle />
                ) : (
                  <BadgeCheck />
                )}{' '}
                {importCompleted && importResult
                  ? getTradeImportCompletionTitle(importResult, operationResult)
                  : t('trade-import.step.preview')}
              </h2>
              {importCompleted && importResult && (
                <button
                  type="button"
                  className="journalit-trade-import-completion-header__reset"
                  onClick={resetImportFlow}
                >
                  {t('csv.button.import-another')}
                </button>
              )}
            </div>
            {importCompleted && importResult ? (
              <div className="csv-import-results journalit-trade-import-results">
                <TradeImportCompletionSummary
                  plugin={plugin}
                  result={importResult}
                  operationResult={operationResult}
                  headingId={tradeImportCompletionHeadingId}
                />
                <TradeImportDiagnostics
                  diagnostics={preview.diagnostics}
                  defaultOpen={importResult.writtenCount === 0}
                  className="csv-results-problems"
                />
                {failedPreviewRows.length > 0 && (
                  <CollapsibleSection
                    title={t('csv.results.errors-header', {
                      count: String(failedPreviewRows.length),
                    })}
                    defaultOpen={importResult.writtenCount === 0}
                    className="csv-results-problems"
                  >
                    <div className="import-results-errors">
                      <div className="csv-error-group-body">
                        {failedPreviewRows.map((item) => (
                          <div
                            key={item.itemId}
                            className="csv-error-group-example"
                          >
                            {item.preview.sourceRows.length > 0 && (
                              <>
                                {t('csv.errors.rows', {
                                  rows: item.preview.sourceRows.join(', '),
                                })}
                                {' — '}
                              </>
                            )}
                            <strong>{item.preview.symbol || '—'}</strong>
                            {' — '}
                            {item.message ?? t('trade-import.table.message')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleSection>
                )}
              </div>
            ) : (
              <TradeImportPreviewReview
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
                onConfirm={() => void confirmImport()}
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
