

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import JournalitPlugin from '../../main';
import { TradeLogService } from '../../services/tradelog/TradeLogService';
import { ServiceManager } from '../../services/ServiceManager';
import { TimeNode, TradeLogFilters } from '../../services/tradelog/types';
import { TradeLogHeader } from './TradeLogHeader';
import { TradeLogEmptyState } from './TradeLogEmptyState';
import { TradeLogTree } from './TradeLogTree';
import { TradeLogSkeleton } from './TradeLogSkeleton';
import {
  ImageGallery,
  type ImageGalleryControls,
  normalizeImageGallerySize,
  normalizeImageGallerySort,
  normalizeImageGallerySourceType,
  normalizeImageGalleryViewMode,
} from '../imageGallery/ImageGallery';
import { useDebounced } from '../../hooks/useDebounced';
import { useEventBus, useEventBusMultiple } from '../../hooks/useEventBus';
import { useLeafActive } from '../../hooks/useLeafActive';
import { useTradeOperationResult } from '../../hooks/useTradeOperationResult';
import { TradeFormModal } from '../forms/trade/TradeFormModal';
import { Notice, WorkspaceLeaf, setTooltip } from 'obsidian';
import { t, tPlural } from '../../lang/helpers';
import {
  createTradeLogFilters,
  normalizeTradeLogFilters,
} from '../../settings/viewFiltersDefaults';
import {
  getVisibleColumns,
  generateGridTemplate,
  buildTradeLogColumnDefinitions,
  getColumnLabel,
  getSortIconName,
  resolveTradeLogSettings,
} from './columnConfig';
import { SortConfig, applySorting } from './sortUtils';
import {
  ArrowUp01,
  ArrowDown10,
  ArrowUpAZ,
  ArrowDownZA,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  ArrowUpDown,
  ListFilter,
  type ObsidianIconComponent,
} from '../shared/icons/ObsidianIcon';
import { BatchActionToolbar } from './BatchActionToolbar';
import {
  batchMarkAsReviewed,
  batchAddSetups,
  batchAddTags,
  batchAddMistakes,
  batchDeleteTrades,
  batchDuplicateTrades,
} from './batchOperations';
import { OptionType } from '../../services/options';
import { getTradeIdsInRange } from './selectionUtils';
import { createTradingDayFromString } from '../../utils/tradingDayUtils';
import { openReviewPeriod } from '../../services/tradeOperations/reviewNavigation';
import { areSnapshotKeysClaimedByCustomFields } from '../../utils/unrealizedPnl';
import { cssVars } from '../../styles/inlineStylePolicy';
import { CustomFieldType } from '../../types/customFields';
import {
  getCustomFieldDisplayValues,
  getCustomFieldRawValue,
} from './customFieldDisplay';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideTarget,
} from '../../guides/GuideRuntimeLayer';
import {
  TRADE_LOG_BATCH_TOOLBAR_TARGET_ID,
  TRADE_LOG_EMPTY_GUIDE_ID,
  TRADE_LOG_EMPTY_STATE_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_EMPTY_GUIDE_ID,
  TRADE_LOG_IMAGE_GALLERY_MAIN_GUIDE_ID,
  TRADE_LOG_MAIN_GUIDE_ID,
  TRADE_LOG_MULTI_SELECT_ENABLED_ACTION_ID,
  TRADE_LOG_TABLE_HEADERS_TARGET_ID,
} from '../../guides/tradeLogGuideIds';
import { isFilterMenuWhatsNewDue } from '../../guides/filterMenuWhatsNewResolution';
import {
  FILTER_MENU_DONE_STEP_ID,
  FILTER_MENU_EXCLUDE_STEP_ID,
  FILTER_MENU_MATCH_STEP_ID,
  FILTER_MENU_OPEN_STEP_ID,
  FILTER_MENU_PHASES_STEP_ID,
  TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID,
} from '../../guides/filterMenuWhatsNewGuideIds';
import { TRADE_LOG_VIEW_TYPE } from '../../views/TradeLogView';
import {
  AccountChangedPayload,
  SettingsChangedPayload,
} from '../../services/events/types';
import { remapAccountFilterFromAccountChange } from '../shared/filters/remapSelectedAccounts';
import { persistViewFilter } from '../shared/filters/viewFilterPersistence';
import { ImageGalleryService } from '../../services/imageGallery/ImageGalleryService';
import {
  getSetupLabelColor,
  getTagLabelColor,
  TradeLabelColorProvider,
  useTradeLabelColors,
} from '../../contexts/TradeLabelColorContext';
import { useTradeLabelColorData } from '../../hooks/useTradeLabelColorData';
import {
  getLabelColorClassName,
  getLabelColorForeground,
} from '../../types/labelColor';
import {
  clearInactiveTreeSessionLogTags,
  getActiveTreeSessionLogTags,
  pruneUnknownSessionLogTags,
  refreshSessionLogTagDefinitionNodeIdentities,
  shouldShowTradeLogFilteredEmptyState,
  type TradeCountResolution,
  type TradeLogMode,
} from './tradeLogStateUtils';
import { mergeUserTradeLogFilterChange } from './tradeLogFilterChanges';
import { clearDrilldownBasisForTradeLogMode } from './tradeLogFilterChanges';
import { getSessionLogTags } from '../sessionLog/sessionLogUtils';
import { mergeClassNames } from '../../utils/classNames';
import { sanitizeFilterCustomFields } from '../shared/filters/sanitizeCustomFieldFilters';

interface TradeLogProps {
  plugin: JournalitPlugin;
  leaf: WorkspaceLeaf;
}

function getDuplicateAwareStringKeys(values: string[]): string[] {
  const occurrenceByValue = new Map<string, number>();
  return values.map((value) => {
    const occurrence = occurrenceByValue.get(value) ?? 0;
    occurrenceByValue.set(value, occurrence + 1);
    return JSON.stringify([value, occurrence]);
  });
}

const GUIDE_REFRESH_EVENTS: Array<
  | 'trade:changed'
  | 'missed-trade:changed'
  | 'backtest-trade:changed'
  | 'folder-path:changed'
> = [
  'trade:changed',
  'missed-trade:changed',
  'backtest-trade:changed',
  'folder-path:changed',
];

const TRADE_DATA_CHANGE_EVENTS: Array<
  | 'trade:committed'
  | 'trade:changed'
  | 'missed-trade:changed'
  | 'backtest-trade:changed'
  | 'folder-path:changed'
  | 'drc:session-log-index-invalidated'
> = [
  'trade:committed',
  'trade:changed',
  'missed-trade:changed',
  'backtest-trade:changed',
  'folder-path:changed',
  'drc:session-log-index-invalidated',
];

type TradeLogFilterSyncWindow = Window & {
  journalitSyncTradeLogFilters?: () => void;
};

const TRADE_LOG_GUIDE_TRADE_MODE_STEPS = new Set([
  'intro',
  'view-selector',
  'filters',
  'sorting',
  'open-trades',
  'switch-to-gallery',
  FILTER_MENU_OPEN_STEP_ID,
  FILTER_MENU_EXCLUDE_STEP_ID,
  FILTER_MENU_MATCH_STEP_ID,
  FILTER_MENU_PHASES_STEP_ID,
  FILTER_MENU_DONE_STEP_ID,
]);

const TRADE_LOG_GUIDE_IMAGE_GALLERY_STEPS = new Set([
  'gallery-source-sort',
  'gallery-grouping',
  'gallery-filters',
  'gallery-grid',
  'gallery-finish',
]);

const TRADE_LOG_IMAGE_GALLERY_GUIDE_IDS = new Set([
  TRADE_LOG_MAIN_GUIDE_ID,
  TRADE_LOG_IMAGE_GALLERY_EMPTY_GUIDE_ID,
  TRADE_LOG_IMAGE_GALLERY_MAIN_GUIDE_ID,
]);

function normalizeTradeLogMode(value: unknown): TradeLogMode {
  return value === 'imageGallery' ? 'imageGallery' : 'trades';
}

function showReviewNavigationNotice(
  outcome: Awaited<ReturnType<typeof openReviewPeriod>>
): void {
  if (outcome === 'creation-disabled') {
    new Notice(t('trade-handoff.review.creation-disabled'));
  } else if (outcome === 'failed') {
    new Notice(t('trade-handoff.review.open-failed'));
  }
}

function loadPersistedTradeLogFilters(
  plugin: JournalitPlugin
): TradeLogFilters | null {
  const persisted = plugin.uiStateManager.getState().viewFilters?.tradelog;
  if (!persisted) {
    return null;
  }

  const normalizedFilters: TradeLogFilters = {
    ...normalizeTradeLogFilters(persisted),
    dateRange: [
      persisted.dateRange?.[0] ? new Date(persisted.dateRange[0]) : null,
      persisted.dateRange?.[1] ? new Date(persisted.dateRange[1]) : null,
    ],
  };
  const configuredTagIds = new Set(
    getSessionLogTags(plugin).map((tag) => tag.id)
  );
  const prunedFilters = pruneUnknownSessionLogTags(
    normalizedFilters,
    configuredTagIds
  );
  if (prunedFilters !== normalizedFilters) {
    persistViewFilter(plugin.uiStateManager, 'tradelog', prunedFilters);
  }
  return prunedFilters;
}








const updateNodeChildren = (
  nodes: TimeNode[],
  nodeId: string,
  children: TimeNode[]
): TimeNode[] => {
  let found = false;

  const result = nodes.map((n) => {
    if (n.id === nodeId) {
      found = true;
      const updatedNode = { ...n, children, dataLoaded: true };
      return updatedNode;
    }
    if (n.children) {
      return {
        ...n,
        children: updateNodeChildren(n.children, nodeId, children),
      };
    }
    return n;
  });

  if (!found) {
    // intentional
  }

  return result;
};

const MAX_TRADE_DEPTH_BY_VIEW_LEVEL: Record<
  Exclude<TradeLogFilters['viewLevel'], 'trades'>,
  number
> = {
  years: 5,
  quarters: 4,
  months: 3,
  weeks: 2,
  days: 1,
};

const getTreeHorizontalWidthOffset = (
  viewLevel: TradeLogFilters['viewLevel']
): number => {
  if (viewLevel === 'trades') {
    return 0;
  }

  const maxTradeDepth = MAX_TRADE_DEPTH_BY_VIEW_LEVEL[viewLevel];
  const treeStructureWidth = maxTradeDepth * 24;
  const treeIndicatorColumnWidth = 20;
  const treeIndicatorGridGap = 6;

  return treeStructureWidth + treeIndicatorColumnWidth + treeIndicatorGridGap;
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : typeof value === 'string'
      ? [value]
      : [];
}

function getStringValue(
  record: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  const value = record?.[key];
  return typeof value === 'string' ? value : undefined;
}


const ICON_COMPONENTS: Record<string, ObsidianIconComponent> = {
  ArrowUp01,
  ArrowDown10,
  ArrowUpAZ,
  ArrowDownZA,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  ArrowUpDown,
};


const EXPANDABLE_COLUMNS = ['setups', 'mistakes', 'tags'];

type TradeLogColumn = ReturnType<typeof getVisibleColumns>[number];

interface TradeLogSizerRowData {
  setups: string[];
  mistakes: string[];
  tags: string[];
  customMultiselects: Record<string, string[]>;
}

interface ExpandedModeSizerRowProps {
  isExpandedMode: boolean;
  isDataLoaded: boolean;
  sizerRowRef: React.RefObject<HTMLDivElement | null>;
  visibleColumns: TradeLogColumn[];
  sizerRowData: TradeLogSizerRowData;
}

const ExpandedModeSizerRow: React.FC<ExpandedModeSizerRowProps> = ({
  isExpandedMode,
  isDataLoaded,
  sizerRowRef,
  visibleColumns,
  sizerRowData,
}) => {
  const labelColors = useTradeLabelColors();

  if (!isExpandedMode || !isDataLoaded) {
    return null;
  }

  const setupKeys = getDuplicateAwareStringKeys(sizerRowData.setups);
  const mistakeKeys = getDuplicateAwareStringKeys(sizerRowData.mistakes);
  const tagKeys = getDuplicateAwareStringKeys(sizerRowData.tags);

  return (
    <div ref={sizerRowRef} className="trade-log-sizer-row" aria-hidden="true">
      {visibleColumns.map((col) => {
        if (col.id === 'setups') {
          return (
            <div
              key={col.id}
              data-sizer-col="setups"
              className="trade-setups-cell expanded sizer-cell"
            >
              <div className="expanded-pills sizer-pills">
                {sizerRowData.setups.map((setup, i) => {
                  const color = getSetupLabelColor(labelColors.setups, setup);
                  return (
                    <span
                      key={setupKeys[i]}
                      className={`pill pill--setup ${getLabelColorClassName(color)}`}
                      style={cssVars({
                        '--journalit-label-color': color,
                        '--journalit-label-foreground':
                          getLabelColorForeground(color),
                      })}
                    >
                      {setup}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        }
        if (col.id === 'mistakes') {
          return (
            <div
              key={col.id}
              data-sizer-col="mistakes"
              className="trade-mistakes-cell expanded sizer-cell"
            >
              <div className="expanded-pills sizer-pills">
                {sizerRowData.mistakes.map((mistake, i) => (
                  <span key={mistakeKeys[i]} className="pill pill--mistake">
                    {mistake}
                  </span>
                ))}
              </div>
            </div>
          );
        }
        if (col.id === 'tags') {
          return (
            <div
              key={col.id}
              data-sizer-col="tags"
              className="trade-tags-cell expanded sizer-cell"
            >
              <div className="expanded-pills sizer-pills">
                {sizerRowData.tags.map((tag, i) => {
                  const color = getTagLabelColor(labelColors.tags, tag);
                  return (
                    <span
                      key={tagKeys[i]}
                      className={`pill pill--tag ${getLabelColorClassName(color)}`}
                      style={cssVars({
                        '--journalit-label-color': color,
                        '--journalit-label-foreground':
                          getLabelColorForeground(color),
                      })}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        }
        if (col.customField?.type === CustomFieldType.MULTISELECT) {
          const values = sizerRowData.customMultiselects[col.id] || [];
          const valueKeys = getDuplicateAwareStringKeys(values);
          return (
            <div
              key={col.id}
              data-sizer-col={col.id}
              className="trade-custom-field-cell expanded sizer-cell"
            >
              <div className="expanded-pills sizer-pills">
                {values.map((value, i) => (
                  <span key={valueKeys[i]} className="pill pill--tag">
                    {value}
                  </span>
                ))}
              </div>
            </div>
          );
        }
        return <div key={col.id} />;
      })}
    </div>
  );
};

interface TradeLogColumnHeadersProps {
  visibleColumns: TradeLogColumn[];
  gridTemplate: string;
  effectiveHeaderScrollbarWidth: number;
  effectiveSortConfig: SortConfig;
  registerTableHeadersTarget: (element: HTMLElement | null) => void;
  onSort: (columnId: string) => void;
}

const TradeLogColumnHeaders: React.FC<TradeLogColumnHeadersProps> = ({
  visibleColumns,
  gridTemplate,
  effectiveHeaderScrollbarWidth,
  effectiveSortConfig,
  registerTableHeadersTarget,
  onSort,
}) => (
  <div className="trade-log-headers">
    <div
      ref={registerTableHeadersTarget}
      className="trade-log-header-row"
      style={cssVars({
        '--journalit-tradelog-grid-template': gridTemplate,
        '--journalit-tradelog-header-scrollbar-width': `${effectiveHeaderScrollbarWidth}px`,
      })}
    >
      {visibleColumns.map((col) => {
        const isSorted = effectiveSortConfig.column === col.id;
        const isClickable = col.sortable;
        const iconName = isClickable
          ? getSortIconName(
              col.type,
              isSorted ? effectiveSortConfig.direction : null
            )
          : null;
        const IconComponent = iconName ? ICON_COMPONENTS[iconName] : null;
        const label = col.id === 'select' ? '' : getColumnLabel(col);
        const isMoneyColumn = col.id === 'fees' || col.id === 'dividends';
        const className = `header-cell header-${col.id} ${isMoneyColumn ? 'header-money-cell' : ''} ${isClickable ? 'sortable' : ''} ${isSorted ? 'sorted' : ''}`;
        const content = (
          <>
            <span>{label}</span>

            {IconComponent && (
              <IconComponent
                size={14}
                className={
                  isSorted ? 'sort-indicator' : 'sort-indicator-unsorted'
                }
              />
            )}
          </>
        );

        
        
        
        
        const attachHeaderTooltip = (el: HTMLElement | null) => {
          if (el) {
            setTooltip(el, label, { placement: 'top' });
          }
        };

        if (!isClickable) {
          return (
            <div key={col.id} className={className} ref={attachHeaderTooltip}>
              {content}
            </div>
          );
        }

        return (
          <button
            type="button"
            key={col.id}
            className={mergeClassNames(
              'journalit-native-button journalit-native-button--unstyled',
              className
            )}
            ref={attachHeaderTooltip}
            onClick={() => onSort(col.id)}
          >
            {content}
          </button>
        );
      })}
    </div>
  </div>
);

const useTradeLogController = ({ plugin, leaf }: TradeLogProps) => {
  const isActive = useLeafActive(leaf);
  const tradeOperationSnapshot = useTradeOperationResult(plugin);
  const activeTradeLogScope = tradeOperationSnapshot.activeTradeLogScope;
  
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isTreeReady, setIsTreeReady] = useState(false);
  const [nodes, setNodes] = useState<TimeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<TradeLogFilters>(
    () => loadPersistedTradeLogFilters(plugin) ?? createTradeLogFilters()
  );
  const filtersRef = useRef(filters);
  const applyFilters = useCallback((nextFilters: TradeLogFilters) => {
    filtersRef.current = nextFilters;
    setFilters(nextFilters);
  }, []);
  const [tradeLogMode, setTradeLogMode] = useState<TradeLogMode>(() =>
    normalizeTradeLogMode(plugin.uiStateManager.getState().tradeLogMode)
  );
  const [imageGalleryControls, setImageGalleryControls] =
    useState<ImageGalleryControls>(() => {
      const persisted = plugin.uiStateManager.getState().imageGallery;
      return {
        sourceType: normalizeImageGallerySourceType(persisted?.sourceType),
        size: normalizeImageGallerySize(persisted?.size),
        sort: normalizeImageGallerySort(persisted?.sort),
        viewMode: normalizeImageGalleryViewMode(persisted?.viewMode),
      };
    });
  const [settingsVersion, setSettingsVersion] = useState(0);

  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    direction: 'desc',
  });

  
  const [containerHeight, setContainerHeight] = useState<number>(() => {
    
    const vh = window.innerHeight || 600;
    const estimatedOverhead = 200; 
    return Math.max(400, vh - estimatedOverhead);
  });
  const [headerScrollbarWidth, setHeaderScrollbarWidth] = useState(0);

  
  const [selectedTrades, setSelectedTrades] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const operationScopeIdRef = useRef<string | null>(null);
  const operationScopeTransitionFiltersRef = useRef<TradeLogFilters | null>(
    null
  );
  
  
  useEffect(() => {
    const nextScopeId = activeTradeLogScope?.operationId ?? null;
    if (nextScopeId === operationScopeIdRef.current) return;
    operationScopeIdRef.current = nextScopeId;
    setTradeLogMode(
      nextScopeId
        ? 'trades'
        : normalizeTradeLogMode(plugin.uiStateManager.getState().tradeLogMode)
    );
    setIsMultiSelectMode(false);
    setSelectedTrades(new Set());
    if (nextScopeId) {
      const scopedFilters = {
        ...createTradeLogFilters(),
        viewLevel: 'trades' as const,
      };
      operationScopeTransitionFiltersRef.current = scopedFilters;
      applyFilters(scopedFilters);
      return;
    }
    const persistedFilters =
      loadPersistedTradeLogFilters(plugin) ?? createTradeLogFilters();
    operationScopeTransitionFiltersRef.current = persistedFilters;
    applyFilters(persistedFilters);
  }, [activeTradeLogScope?.operationId, applyFilters, plugin]);
  const [guideVersion, setGuideVersion] = useState(0);
  const [optionsVersion, setOptionsVersion] = useState(0);
  const [tradeCountResolution, setTradeCountResolution] =
    useState<TradeCountResolution>({ status: 'loading' });
  const totalTradeCount =
    tradeCountResolution.status === 'ready' ? tradeCountResolution.count : null;
  const isTradeCountResolved = tradeCountResolution.status !== 'loading';
  const [imageGalleryItemCount, setImageGalleryItemCount] = useState<
    number | null
  >(null);
  const emitGuideAction = useGuideAction();
  const wasActiveRef = useRef(isActive);
  const registerEmptyStateTarget = useGuideTarget(
    TRADE_LOG_EMPTY_STATE_TARGET_ID
  );
  const registerTableHeadersTarget = useGuideTarget(
    TRADE_LOG_TABLE_HEADERS_TARGET_ID
  );
  const registerBatchToolbarTarget = useGuideTarget(
    TRADE_LOG_BATCH_TOOLBAR_TARGET_ID
  );

  
  const [isExpandedMode, setIsExpandedMode] = useState(() => {
    return resolveTradeLogSettings(
      plugin.uiStateManager.getState().tradeLog,
      plugin.customFieldsService?.getFields() || []
    ).expandedMode;
  });
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  
  const scrollOffsetRef = useRef(0);
  const [requestedScrollOffset, setRequestedScrollOffset] = useState<
    number | null
  >(null);
  const loadGenerationRef = useRef(0);
  
  const hasLoadedOnceRef = useRef(false);
  const lastViewLevelRef = useRef<TradeLogFilters['viewLevel']>('trades');
  const lastOperationScopeIdRef = useRef<string | null>(null);
  
  const isLoadingRef = useRef(false);
  const nodeNavigationInFlightRef = useRef(false);

  const getPersistedTradeLogFilters =
    useCallback((): TradeLogFilters | null => {
      return loadPersistedTradeLogFilters(plugin);
    }, [plugin]);

  const syncFiltersFromPersistedState = useCallback(() => {
    if (activeTradeLogScope) {
      return;
    }
    const persistedFilters = getPersistedTradeLogFilters();
    if (persistedFilters) {
      applyFilters(persistedFilters);
    }
    setTradeLogMode(
      normalizeTradeLogMode(plugin.uiStateManager.getState().tradeLogMode)
    );
  }, [
    activeTradeLogScope,
    applyFilters,
    getPersistedTradeLogFilters,
    plugin.uiStateManager,
  ]);

  const persistFilters = useCallback(
    (nextFilters: TradeLogFilters) => {
      const normalizedFilters = normalizeTradeLogFilters(nextFilters);
      persistViewFilter(plugin.uiStateManager, 'tradelog', normalizedFilters);
    },
    [plugin]
  );

  const commitFilters = useCallback(
    (nextFilters: TradeLogFilters) => {
      applyFilters(nextFilters);
      if (!activeTradeLogScope) {
        persistFilters(nextFilters);
      }
    },
    [activeTradeLogScope, applyFilters, persistFilters]
  );

  const handleModeChange = useCallback(
    (nextMode: TradeLogMode) => {
      setTradeLogMode(nextMode);
      if (nextMode === 'imageGallery') {
        setIsMultiSelectMode(false);
        setSelectedTrades(new Set());
      }
      const currentFilters = filtersRef.current;
      const modeFilters = clearDrilldownBasisForTradeLogMode(
        currentFilters,
        nextMode
      );
      const nextFilters = clearInactiveTreeSessionLogTags(
        modeFilters,
        nextMode
      );
      if (nextFilters !== currentFilters) {
        commitFilters(nextFilters);
      }
      void plugin.uiStateManager.updateStateImmediate({
        tradeLogMode: nextMode,
      });
    },
    [commitFilters, plugin.uiStateManager]
  );

  const handleImageGalleryControlsChange = useCallback(
    (updates: Partial<ImageGalleryControls>) => {
      const nextControls = { ...imageGalleryControls, ...updates };
      setImageGalleryControls(nextControls);
      void plugin.uiStateManager.updateStateImmediate({
        imageGallery: nextControls,
      });
    },
    [imageGalleryControls, plugin.uiStateManager]
  );

  useEffect(() => {
    const handleCustomFieldsChanged = () => {
      setSettingsVersion((prev) => prev + 1);
    };

    const handleExternalFiltersUpdated = () => syncFiltersFromPersistedState();

    plugin.app.workspace.on(
      'journalit-custom-fields-changed',
      handleCustomFieldsChanged
    );
    window.addEventListener(
      'journalit-tradelog-filters-updated',
      handleExternalFiltersUpdated
    );

    return () => {
      plugin.app.workspace.off(
        'journalit-custom-fields-changed',
        handleCustomFieldsChanged
      );
      window.removeEventListener(
        'journalit-tradelog-filters-updated',
        handleExternalFiltersUpdated
      );
    };
  }, [plugin.app, syncFiltersFromPersistedState]);

  
  const tradeLogUIState = plugin.uiStateManager.getState().tradeLog;

  const customFields = useMemo(() => {
    void settingsVersion;
    return plugin.customFieldsService?.getFields() || [];
  }, [plugin.customFieldsService, settingsVersion]);
  const allColumns = useMemo(
    () => buildTradeLogColumnDefinitions(customFields),
    [customFields]
  );
  const snapshotKeysClaimedByCustomFields = useMemo(
    () => areSnapshotKeysClaimedByCustomFields(customFields),
    [customFields]
  );

  useEffect(() => {
    
    const currentFilters = filtersRef.current;
    const sanitized = sanitizeFilterCustomFields(currentFilters, customFields);
    if (sanitized === currentFilters) {
      return;
    }
    commitFilters(normalizeTradeLogFilters(sanitized));
  }, [
    commitFilters,
    customFields,
    filters.customFieldFilters,
    filters.exclusions,
    filters.matchModes,
  ]);

  const effectiveSortConfig = useMemo<SortConfig>(() => {
    if (!sortConfig.column) {
      return sortConfig;
    }

    const sortedColumn = allColumns.find(
      (column) => column.id === sortConfig.column
    );

    return sortedColumn?.sortable
      ? sortConfig
      : { column: null, direction: 'desc' };
  }, [allColumns, sortConfig]);

  const resolvedTradeLogState = useMemo(() => {
    void settingsVersion;
    return resolveTradeLogSettings(tradeLogUIState, customFields);
  }, [tradeLogUIState, customFields, settingsVersion]);

  
  const visibleColumns = useMemo(() => {
    let columns = getVisibleColumns(
      resolvedTradeLogState.columnVisibility,
      resolvedTradeLogState.columnOrder,
      allColumns
    );

    
    if (isMultiSelectMode) {
      const selectColumn = allColumns.find((c) => c.id === 'select');
      if (selectColumn) {
        columns = [selectColumn, ...columns];
      }
    }

    return columns;
  }, [resolvedTradeLogState, isMultiSelectMode, allColumns]);

  
  const sizerRowRef = useRef<HTMLDivElement>(null);
  const [measuredWidths, setMeasuredWidths] = useState<Record<string, number>>(
    {}
  );

  
  const gridTemplate = useMemo(() => {
    return generateGridTemplate(
      visibleColumns,
      filters.viewLevel,
      isExpandedMode,
      measuredWidths
    );
  }, [visibleColumns, filters.viewLevel, isExpandedMode, measuredWidths]);

  
  const defaultRiskAmount = plugin.settings?.trade?.defaultRiskAmount;

  const sortedNodes = useMemo(() => {
    if (filters.viewLevel !== 'trades' || !effectiveSortConfig.column) {
      return nodes;
    }

    return applySorting(
      nodes,
      effectiveSortConfig,
      defaultRiskAmount,
      allColumns,
      snapshotKeysClaimedByCustomFields,
      plugin.settings.trade.maeMfeDisplayUnit ?? 'dollar'
    );
  }, [
    nodes,
    effectiveSortConfig,
    filters.viewLevel,
    defaultRiskAmount,
    allColumns,
    snapshotKeysClaimedByCustomFields,
    plugin.settings.trade.maeMfeDisplayUnit,
  ]);

  const sizerRowData = useMemo(() => {
    if (!isExpandedMode) {
      return {
        setups: [] as string[],
        mistakes: [] as string[],
        tags: [] as string[],
        customMultiselects: {},
      };
    }

    let widestSetups: string[] = [];
    let widestMistakes: string[] = [];
    let widestTags: string[] = [];
    const widestCustomMultiselects: Record<string, string[]> = {};

    const customMultiselectColumns = visibleColumns.filter(
      (column) => column.customField?.type === CustomFieldType.MULTISELECT
    );

    const getListWeight = (values: string[]): number =>
      values.join('').length + values.length * 4;

    const traverse = (nodeList: TimeNode[]) => {
      for (const node of nodeList) {
        if (node.type === 'trade' && node.trade) {
          const trade = asRecord(node.trade);
          const setups = asStringArray(trade?.setup);
          const mistakes = asStringArray(trade?.mistake);
          const tags = asStringArray(trade?.tags);

          if (setups.length > widestSetups.length) widestSetups = setups;
          if (mistakes.length > widestMistakes.length) {
            widestMistakes = mistakes;
          }
          if (tags.length > widestTags.length) widestTags = tags;

          for (const column of customMultiselectColumns) {
            const field = column.customField;
            if (!field) continue;

            const values = getCustomFieldDisplayValues(
              field,
              getCustomFieldRawValue(trade ?? {}, field)
            );

            if (values.length === 0) continue;

            const existing = widestCustomMultiselects[column.id] || [];
            if (getListWeight(values) > getListWeight(existing)) {
              widestCustomMultiselects[column.id] = values;
            }
          }
        }
        if (node.children) traverse(node.children);
      }
    };
    traverse(nodes);

    return {
      setups: widestSetups,
      mistakes: widestMistakes,
      tags: widestTags,
      customMultiselects: widestCustomMultiselects,
    };
  }, [nodes, isExpandedMode, visibleColumns]);

  
  useEffect(() => {
    if (!isExpandedMode || !sizerRowRef.current) {
      setMeasuredWidths({});
      return;
    }

    
    window.requestAnimationFrame(() => {
      if (!sizerRowRef.current) return;

      const newWidths: Record<string, number> = {};
      const cells = sizerRowRef.current.querySelectorAll('[data-sizer-col]');
      cells.forEach((cell) => {
        const colId = cell.getAttribute('data-sizer-col');
        if (colId) {
          newWidths[colId] = cell.getBoundingClientRect().width;
        }
      });

      setMeasuredWidths(newWidths);
    });
  }, [isExpandedMode, sizerRowData]);

  
  
  const tradesMinWidth = useMemo(() => {
    const columnsWidth = visibleColumns.reduce((sum, col) => {
      
      if (
        isExpandedMode &&
        (EXPANDABLE_COLUMNS.includes(col.id) ||
          col.customField?.type === CustomFieldType.MULTISELECT)
      ) {
        const measuredWidth = measuredWidths[col.id];
        if (measuredWidth && measuredWidth > 0) {
          return sum + Math.ceil(measuredWidth) + 8; 
        }
        return sum + col.width; 
      }
      const w = col.width === 0 ? 240 : col.width; 
      return sum + w;
    }, 0);
    const gap = Math.max(0, visibleColumns.length - 1) * 8; 
    const padding = 32; 
    return (
      columnsWidth +
      gap +
      padding +
      getTreeHorizontalWidthOffset(filters.viewLevel)
    );
  }, [visibleColumns, isExpandedMode, measuredWidths, filters.viewLevel]);

  const [tradeLogService] = useState(() => new TradeLogService(plugin));
  useEffect(() => {
    tradeLogService.connect();
    return () => tradeLogService.destroy();
  }, [tradeLogService]);
  const [imageGalleryService] = useState(() => new ImageGalleryService(plugin));

  
  const debouncedFilters = useDebounced(filters, 150);

  useEffect(() => {
    if (operationScopeTransitionFiltersRef.current === debouncedFilters) {
      operationScopeTransitionFiltersRef.current = null;
    }
  }, [debouncedFilters]);

  const refreshTradeCount = useCallback(
    async ({
      requireReady,
      ignoreUnmount,
    }: {
      requireReady: boolean;
      ignoreUnmount?: () => boolean;
    }) => {
      if (!plugin.tradeService) {
        return;
      }

      try {
        if (requireReady) {
          await plugin.tradeService.waitForTradeDataReady();
        }

        const tradeCount = await plugin.tradeService.getTradeCount();
        let count = tradeCount;

        if (tradeCount === 0) {
          const serviceManager = ServiceManager.getInstance(plugin.app, plugin);
          const missedTradeService =
            await serviceManager.getMissedTradeService();
          count += await missedTradeService.getMissedTradeCount();
        }

        if (!ignoreUnmount || !ignoreUnmount()) {
          setTradeCountResolution({ status: 'ready', count });
        }
      } catch (error) {
        if (!ignoreUnmount || !ignoreUnmount()) {
          setTradeCountResolution((previousResolution) =>
            previousResolution.status === 'ready'
              ? previousResolution
              : { status: 'failed' }
          );
        }
        console.error(
          requireReady
            ? '[TradeLog] Failed to resolve trade count:'
            : '[TradeLog] Failed to refresh trade count:',
          error
        );
      }
    },
    [plugin]
  );

  
  const handleOptionsChanged = useCallback(() => {
    setOptionsVersion((prev) => prev + 1);
  }, []);

  
  useEventBus('options:changed', handleOptionsChanged);

  useEffect(() => {
    let isUnmounted = false;

    void refreshTradeCount({
      requireReady: true,
      ignoreUnmount: () => isUnmounted,
    });

    return () => {
      isUnmounted = true;
    };
  }, [refreshTradeCount]);

  useEventBusMultiple(
    GUIDE_REFRESH_EVENTS,
    () => {
      void refreshTradeCount({ requireReady: false });
    },
    !!plugin.tradeService
  );

  useEventBusMultiple(
    [
      'trade:committed',
      'trade:changed',
      'missed-trade:changed',
      'backtest-trade:changed',
      'review:changed',
      'settings:changed',
      'options:changed',
      'account:changed',
      'folder-path:changed',
      'image-gallery:changed',
    ],
    () => {
      if (tradeLogMode === 'imageGallery') {
        return;
      }

      imageGalleryService.invalidate();
      setImageGalleryItemCount(null);
    }
  );

  const resolvedGuideId = useMemo(() => {
    void guideVersion;

    const guideService = plugin.viewGuideService;

    const activeSession = guideService?.getSessionForLeaf(
      leaf,
      TRADE_LOG_VIEW_TYPE
    );
    if (activeSession?.guideId === TRADE_LOG_MAIN_GUIDE_ID) {
      return TRADE_LOG_MAIN_GUIDE_ID;
    }
    
    
    
    if (
      guideService &&
      activeSession?.guideId === TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID &&
      isFilterMenuWhatsNewDue(TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID, (id) =>
        guideService.getPersistedGuideState(id)
      )
    ) {
      return TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID;
    }

    if (tradeLogMode === 'imageGallery') {
      if (imageGalleryItemCount === null) {
        return null;
      }

      if (imageGalleryItemCount === 0) {
        return TRADE_LOG_IMAGE_GALLERY_EMPTY_GUIDE_ID;
      }

      return TRADE_LOG_IMAGE_GALLERY_MAIN_GUIDE_ID;
    }

    if (isDataLoaded) {
      if (nodes.length > 0) {
        if (
          guideService &&
          isFilterMenuWhatsNewDue(
            TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID,
            (guideId) => guideService.getPersistedGuideState(guideId)
          )
        ) {
          return TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID;
        }

        return TRADE_LOG_MAIN_GUIDE_ID;
      }

      if (totalTradeCount === 0) {
        return TRADE_LOG_EMPTY_GUIDE_ID;
      }

      return null;
    }

    if (totalTradeCount === null) {
      return null;
    }

    if (totalTradeCount === 0) {
      return TRADE_LOG_EMPTY_GUIDE_ID;
    }

    return TRADE_LOG_MAIN_GUIDE_ID;
  }, [
    guideVersion,
    imageGalleryItemCount,
    isDataLoaded,
    leaf,
    nodes.length,
    plugin.viewGuideService,
    tradeLogMode,
    totalTradeCount,
  ]);

  useEffect(() => {
    if (!plugin.viewGuideService) {
      return;
    }

    const activeSession = plugin.viewGuideService.getSessionForLeaf(
      leaf,
      TRADE_LOG_VIEW_TYPE
    );

    if (
      activeSession &&
      resolvedGuideId &&
      activeSession.guideId !== resolvedGuideId
    ) {
      void plugin.viewGuideService.clearGuideState(activeSession.guideId);
    }

    plugin.viewGuideService.setResolvedGuideForLeaf(leaf, resolvedGuideId);
  }, [leaf, plugin, resolvedGuideId]);

  useEffect(() => {
    return () => {
      plugin.viewGuideService?.setResolvedGuideForLeaf(leaf, null);
    };
  }, [leaf, plugin]);

  useEffect(() => {
    const guideService = plugin.viewGuideService;
    if (!guideService) {
      return;
    }

    return guideService.subscribe(() => {
      setGuideVersion((prev) => prev + 1);
    });
  }, [plugin]);

  const handleGuideBack = useCallback(({ toStepId }: { toStepId: string }) => {
    if (toStepId === 'multi-select' || toStepId === 'batch-actions') {
      setTradeLogMode('trades');
      setIsMultiSelectMode(toStepId === 'batch-actions');
      return;
    }

    if (TRADE_LOG_GUIDE_TRADE_MODE_STEPS.has(toStepId)) {
      setTradeLogMode('trades');
      setIsMultiSelectMode(false);
      setSelectedTrades(new Set());
      return;
    }

    if (TRADE_LOG_GUIDE_IMAGE_GALLERY_STEPS.has(toStepId)) {
      setTradeLogMode('imageGallery');
      setIsMultiSelectMode(false);
      setSelectedTrades(new Set());
      return;
    }
  }, []);

  useGuideBackHandler(handleGuideBack);

  useLayoutEffect(() => {
    void guideVersion;

    const guideService = plugin.viewGuideService;
    if (!guideService) {
      return;
    }

    const session = guideService.getSessionForLeaf(leaf, TRADE_LOG_VIEW_TYPE);

    if (!session || !TRADE_LOG_IMAGE_GALLERY_GUIDE_IDS.has(session.guideId)) {
      return;
    }

    if (TRADE_LOG_GUIDE_TRADE_MODE_STEPS.has(session.currentStepId)) {
      setTradeLogMode('trades');
    }

    if (TRADE_LOG_GUIDE_IMAGE_GALLERY_STEPS.has(session.currentStepId)) {
      setTradeLogMode('imageGallery');
    }
  }, [guideVersion, leaf, plugin]);

  useLayoutEffect(() => {
    void guideVersion;

    const guideService = plugin.viewGuideService;
    if (!guideService) {
      return;
    }

    const session = guideService.getSessionForLeaf(leaf, TRADE_LOG_VIEW_TYPE);

    if (!session || !TRADE_LOG_IMAGE_GALLERY_GUIDE_IDS.has(session.guideId)) {
      return;
    }

    if (TRADE_LOG_GUIDE_IMAGE_GALLERY_STEPS.has(session.currentStepId)) {
      if (isMultiSelectMode) {
        setIsMultiSelectMode(false);
      }
      setSelectedTrades((current) =>
        current.size > 0 ? new Set<string>() : current
      );
    }
  }, [guideVersion, isMultiSelectMode, leaf, plugin]);

  useLayoutEffect(() => {
    void guideVersion;

    const guideService = plugin.viewGuideService;
    if (!guideService) {
      return;
    }

    const session = guideService.getSessionForLeaf(leaf, TRADE_LOG_VIEW_TYPE);

    if (!session || !TRADE_LOG_IMAGE_GALLERY_GUIDE_IDS.has(session.guideId)) {
      return;
    }

    if (session.currentStepId === 'open-trades' && isMultiSelectMode) {
      setIsMultiSelectMode(false);
      setSelectedTrades(new Set());
    }
  }, [guideVersion, isMultiSelectMode, leaf, plugin]);

  
  
  useEffect(() => {
    void guideVersion;
    if (isMultiSelectMode) {
      emitGuideAction(TRADE_LOG_MULTI_SELECT_ENABLED_ACTION_ID);
    }
  }, [emitGuideAction, guideVersion, isMultiSelectMode]);

  
  const setupOptions = useMemo(() => {
    void optionsVersion;
    try {
      return plugin.optionsService?.getOptions(OptionType.SETUP) || [];
    } catch (error) {
      console.error('Failed to load setup options:', error);
      return [];
    }
  }, [plugin.optionsService, optionsVersion]);

  const mistakeOptions = useMemo(() => {
    void optionsVersion;
    try {
      return plugin.optionsService?.getOptions(OptionType.MISTAKE) || [];
    } catch (error) {
      console.error('Failed to load mistake options:', error);
      return [];
    }
  }, [plugin.optionsService, optionsVersion]);

  const tagOptions = useMemo(() => {
    void optionsVersion;
    try {
      return plugin.optionsService?.getOptions(OptionType.TAG) || [];
    } catch (error) {
      console.error('Failed to load tag options:', error);
      return [];
    }
  }, [plugin.optionsService, optionsVersion]);

  
  useEffect(() => {
    const updateHeight = () => {
      const viewContainer = window.activeDocument.querySelector(
        '.journalit-trade-log-view-container'
      );
      if (viewContainer) {
        const rect = viewContainer.getBoundingClientRect();
        const headerHeight =
          window.activeDocument
            .querySelector('.trade-log-header')
            ?.getBoundingClientRect()?.height || 120;
        const availableHeight = rect.height - headerHeight;
        setContainerHeight(Math.max(400, availableHeight));
      }
    };

    const timer = window.setTimeout(updateHeight, 200);
    window.addEventListener('resize', updateHeight);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  
  const loadDataForFilters = useCallback(
    async (activeFilters: TradeLogFilters) => {
      const loadGeneration = loadGenerationRef.current + 1;
      loadGenerationRef.current = loadGeneration;
      const activeOperationScopeId = activeTradeLogScope?.operationId ?? null;
      const shouldBlockForLoad =
        !hasLoadedOnceRef.current ||
        lastViewLevelRef.current !== activeFilters.viewLevel ||
        lastOperationScopeIdRef.current !== activeOperationScopeId;

      
      
      
      
      
      if (shouldBlockForLoad) {
        setIsDataLoaded(false);
        setIsTreeReady(false);
        setNodes([]);
      }

      try {
        
        
        isLoadingRef.current = true;
        const data = await tradeLogService.getHierarchicalData(
          activeFilters.viewLevel,
          activeFilters.dateRange[0] || undefined,
          activeFilters.dateRange[1] || undefined,
          activeFilters.tradeTypes,
          activeFilters.statuses,
          activeFilters.accounts,
          activeFilters.tickers,
          activeFilters.setups,
          activeFilters.tags,
          activeFilters.mistakes,
          activeFilters.customFieldFilters,
          activeFilters.reviewStatus,
          activeFilters.directions,
          getActiveTreeSessionLogTags(activeFilters),
          activeFilters.analyticsDateBasis,
          activeTradeLogScope?.filePaths,
          activeFilters.accountPhases,
          activeFilters.exclusions,
          activeFilters.matchModes
        );

        if (loadGenerationRef.current !== loadGeneration) {
          return;
        }

        setNodes((previousNodes) =>
          previousNodes === data ? [...data] : data
        );

        
        if (
          !hasLoadedOnceRef.current ||
          lastViewLevelRef.current !== activeFilters.viewLevel
        ) {
          setExpandedNodes(new Set());
        }
        lastViewLevelRef.current = activeFilters.viewLevel;
        lastOperationScopeIdRef.current = activeOperationScopeId;

        
        setIsDataLoaded(true);
        hasLoadedOnceRef.current = true;

        
        setRequestedScrollOffset(scrollOffsetRef.current);
      } catch (error) {
        if (loadGenerationRef.current !== loadGeneration) {
          return;
        }

        console.error('Error loading trade log data:', error);
        
        setIsDataLoaded(true);
        setIsTreeReady(true);
      } finally {
        if (loadGenerationRef.current === loadGeneration) {
          isLoadingRef.current = false;
        }
      }
    },
    [
      activeTradeLogScope?.filePaths,
      activeTradeLogScope?.operationId,
      tradeLogService,
    ]
  );

  const loadData = useCallback(async () => {
    await loadDataForFilters(
      operationScopeTransitionFiltersRef.current ?? debouncedFilters
    );
  }, [debouncedFilters, loadDataForFilters]);

  const syncAndLoadPersistedFilters = useCallback(() => {
    if (activeTradeLogScope) {
      return;
    }
    const persistedState = plugin.uiStateManager.getState();
    setTradeLogMode(normalizeTradeLogMode(persistedState.tradeLogMode));
    const persistedImageGallery = persistedState.imageGallery;
    if (persistedImageGallery) {
      setImageGalleryControls({
        sourceType: normalizeImageGallerySourceType(
          persistedImageGallery.sourceType
        ),
        size: normalizeImageGallerySize(persistedImageGallery.size),
        sort: normalizeImageGallerySort(persistedImageGallery.sort),
        viewMode: normalizeImageGalleryViewMode(persistedImageGallery.viewMode),
      });
    }

    const persistedFilters = getPersistedTradeLogFilters();
    if (!persistedFilters) {
      void loadData();
      return;
    }

    applyFilters(persistedFilters);
    void loadDataForFilters(persistedFilters);
  }, [
    activeTradeLogScope,
    applyFilters,
    getPersistedTradeLogFilters,
    loadData,
    loadDataForFilters,
    plugin.uiStateManager,
  ]);

  useEffect(() => {
    const filterSyncWindow = window as TradeLogFilterSyncWindow;
    filterSyncWindow.journalitSyncTradeLogFilters = syncAndLoadPersistedFilters;

    return () => {
      if (
        filterSyncWindow.journalitSyncTradeLogFilters ===
        syncAndLoadPersistedFilters
      ) {
        delete filterSyncWindow.journalitSyncTradeLogFilters;
      }
    };
  }, [syncAndLoadPersistedFilters]);

  
  const handleSort = useCallback(
    (columnId: string) => {
      setSortConfig((prev) => {
        
        if (columnId === 'date') {
          if (prev.column === columnId) {
            
            return {
              column: columnId,
              direction: prev.direction === 'asc' ? 'desc' : 'asc',
            };
          }
          
          return {
            column: columnId,
            direction: 'desc',
          };
        }

        const column = allColumns.find(
          (candidate) => candidate.id === columnId
        );
        const naturalDirection = column?.customField
          ? [
              CustomFieldType.DATE,
              CustomFieldType.DATETIME,
              CustomFieldType.TIME,
            ].includes(column.customField.type)
            ? 'desc'
            : 'asc'
          : [
                'pnl',
                'positionSize',
                'duration',
                'expirationDate',
                'daysToExpiry',
              ].includes(columnId)
            ? 'desc'
            : 'asc';
        const oppositeDirection = naturalDirection === 'desc' ? 'asc' : 'desc';

        if (prev.column === columnId) {
          
          if (prev.direction === naturalDirection) {
            return {
              column: columnId,
              direction: oppositeDirection,
            };
          }
          
          return { column: null, direction: 'desc' };
        }

        
        return {
          column: columnId,
          direction: naturalDirection,
        };
      });
    },
    [allColumns]
  );

  
  const handleToggleTradeSelection = useCallback(
    (
      tradeId: string,
      event?: React.MouseEvent | React.ChangeEvent<HTMLInputElement>
    ) => {
      
      const isShiftClick = event && 'shiftKey' in event && event.shiftKey;

      
      if (isShiftClick && lastSelectedId && lastSelectedId !== tradeId) {
        const rangeIds = getTradeIdsInRange(
          sortedNodes,
          lastSelectedId,
          tradeId
        );
        if (rangeIds.length > 0) {
          setSelectedTrades((prev) => {
            const newSet = new Set(prev);
            rangeIds.forEach((id) => newSet.add(id));
            return newSet;
          });
          setLastSelectedId(tradeId);
          return;
        }
      }

      
      setSelectedTrades((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(tradeId)) {
          newSet.delete(tradeId);
        } else {
          newSet.add(tradeId);
        }
        return newSet;
      });

      setLastSelectedId(tradeId);
    },
    [lastSelectedId, sortedNodes]
  );

  const handleSelectAll = useCallback(() => {
    const allTradeIds = new Set<string>();
    const collectTradeIds = (nodes: TimeNode[]) => {
      nodes.forEach((node) => {
        if (node.type === 'trade') {
          const trade = asRecord(node.trade);
          if (trade?.isCopiedTrade === true) {
            return;
          }

          const fileRecord = asRecord(trade?.file);
          const filePath =
            getStringValue(fileRecord, 'path') ??
            getStringValue(trade, 'filePath') ??
            getStringValue(trade, 'path');
          if (filePath) {
            allTradeIds.add(filePath);
          }
        }
        if (node.children) {
          collectTradeIds(node.children);
        }
      });
    };
    collectTradeIds(sortedNodes);
    setSelectedTrades(allTradeIds);
  }, [sortedNodes]);

  const handleClearSelection = useCallback(() => {
    setSelectedTrades(new Set());
  }, []);

  const handleToggleMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode((prev) => !prev);

    if (isMultiSelectMode) {
      setSelectedTrades(new Set());
    }
  }, [isMultiSelectMode]);

  
  useEventBus('settings:changed', (payload: { component?: string }) => {
    if (payload?.component === 'tradeLog') {
      const newExpandedMode = resolveTradeLogSettings(
        plugin.uiStateManager.getState().tradeLog,
        plugin.customFieldsService?.getFields() || []
      ).expandedMode;
      setIsExpandedMode(newExpandedMode);
    }
  });

  
  const handleBatchMarkReviewed = useCallback(async () => {
    const paths = Array.from(selectedTrades);
    const result = await batchMarkAsReviewed(plugin.app, paths);

    
    if (result.errors > 0 && result.processed === 0) {
      new Notice(
        t('notice.error.mark-reviewed', {
          error: tPlural('tradelog.batch.errors-count', result.errors),
        })
      );
    } else if (result.processed === 0) {
      new Notice(
        result.total > 1
          ? t('tradelog.batch.already-reviewed', {
              total: String(result.total),
            })
          : t('tradelog.batch.already-reviewed-single')
      );
    } else if (result.skipped === 0 && result.errors === 0) {
      new Notice(tPlural('notice.mark-reviewed', result.processed));
    } else {
      const parts = [tPlural('notice.mark-reviewed', result.processed)];
      if (result.skipped > 0) {
        parts.push(
          `${result.skipped} ${t('tradelog.batch.already-reviewed-plain')}`
        );
      }
      if (result.errors > 0) {
        parts.push(tPlural('tradelog.batch.errors-count', result.errors));
      }
      new Notice(parts.join(', '));
    }

    setSelectedTrades(new Set());

    
    if (result.processed > 0) {
      setIsMultiSelectMode(false);
    }
  }, [selectedTrades, plugin.app]);

  const handleBatchAddSetups = useCallback(
    async (setupIds: string[]) => {
      const paths = Array.from(selectedTrades);
      const result = await batchAddSetups(
        plugin.app,
        paths,
        setupIds,
        setupIds
      );

      
      if (result.errors > 0 && result.processed === 0) {
        new Notice(
          t('notice.error.add-setups', {
            error: tPlural('tradelog.batch.errors-count', result.errors),
          })
        );
      } else if (result.processed === 0) {
        new Notice(
          t('tradelog.batch.no-updates-needed', {
            total: String(result.total),
            type: t('tradelog.column.setups').toLowerCase(),
          })
        );
      } else if (result.skipped === 0 && result.errors === 0) {
        new Notice(
          t('notice.setups-added', { count: String(result.processed) })
        );
      } else {
        const parts = [
          t('notice.setups-added', { count: String(result.processed) }),
        ];
        if (result.skipped > 0) {
          parts.push(
            t('tradelog.batch.already-had-all', {
              count: String(result.skipped),
              type: t('tradelog.column.setups').toLowerCase(),
            })
          );
        }
        if (result.errors > 0) {
          parts.push(tPlural('tradelog.batch.errors-count', result.errors));
        }
        new Notice(parts.join(', '));
      }

      setSelectedTrades(new Set());

      
      if (result.processed > 0) {
        setIsMultiSelectMode(false);
      }
    },
    [selectedTrades, plugin.app]
  );

  const handleBatchAddMistakes = useCallback(
    async (mistakes: string[]) => {
      const paths = Array.from(selectedTrades);
      const result = await batchAddMistakes(plugin.app, paths, mistakes);

      
      if (result.errors > 0 && result.processed === 0) {
        new Notice(
          t('notice.error.add-mistakes', {
            error: tPlural('tradelog.batch.errors-count', result.errors),
          })
        );
      } else if (result.processed === 0) {
        new Notice(
          t('tradelog.batch.no-updates-needed', {
            total: String(result.total),
            type: t('tradelog.column.mistakes').toLowerCase(),
          })
        );
      } else if (result.skipped === 0 && result.errors === 0) {
        new Notice(
          t('notice.mistakes-added', { count: String(result.processed) })
        );
      } else {
        const parts = [
          t('notice.mistakes-added', { count: String(result.processed) }),
        ];
        if (result.skipped > 0) {
          parts.push(
            t('tradelog.batch.already-had-all', {
              count: String(result.skipped),
              type: t('tradelog.column.mistakes').toLowerCase(),
            })
          );
        }
        if (result.errors > 0) {
          parts.push(tPlural('tradelog.batch.errors-count', result.errors));
        }
        new Notice(parts.join(', '));
      }

      setSelectedTrades(new Set());

      
      if (result.processed > 0) {
        setIsMultiSelectMode(false);
      }
    },
    [selectedTrades, plugin.app]
  );

  const handleBatchAddTags = useCallback(
    async (tags: string[]) => {
      const paths = Array.from(selectedTrades);
      const result = await batchAddTags(plugin.app, paths, tags);

      if (result.errors > 0 && result.processed === 0) {
        new Notice(
          t('notice.error.add-tags', {
            error: tPlural('tradelog.batch.errors-count', result.errors),
          })
        );
      } else if (result.processed === 0) {
        new Notice(
          t('tradelog.batch.no-updates-needed', {
            total: String(result.total),
            type: t('tradelog.column.tags').toLowerCase(),
          })
        );
      } else if (result.skipped === 0 && result.errors === 0) {
        new Notice(t('notice.tags-added', { count: String(result.processed) }));
      } else {
        const parts = [
          t('notice.tags-added', { count: String(result.processed) }),
        ];
        if (result.skipped > 0) {
          parts.push(
            t('tradelog.batch.already-had-all', {
              count: String(result.skipped),
              type: t('tradelog.column.tags').toLowerCase(),
            })
          );
        }
        if (result.errors > 0) {
          parts.push(tPlural('tradelog.batch.errors-count', result.errors));
        }
        new Notice(parts.join(', '));
      }

      setSelectedTrades(new Set());

      if (result.processed > 0) {
        setIsMultiSelectMode(false);
      }
    },
    [selectedTrades, plugin.app]
  );

  const handleBatchDuplicate = useCallback(async () => {
    const paths = Array.from(selectedTrades);
    const result = await batchDuplicateTrades(plugin.app, paths);

    if (result.errors > 0 && result.processed === 0) {
      new Notice(
        t('notice.error.duplicate-trades', {
          error: tPlural('tradelog.batch.errors-count', result.errors),
        })
      );
    } else if (result.processed === 0) {
      new Notice(tPlural('tradelog.batch.duplicate-skipped', result.skipped));
    } else {
      const parts = [tPlural('notice.trades-duplicated', result.processed)];
      if (result.skipped > 0) {
        parts.push(tPlural('tradelog.batch.duplicate-skipped', result.skipped));
      }
      if (result.errors > 0) {
        parts.push(tPlural('tradelog.batch.errors-count', result.errors));
      }
      new Notice(parts.join(', '));
    }

    setSelectedTrades(new Set());

    if (result.processed > 0) {
      setIsMultiSelectMode(false);
    }
  }, [selectedTrades, plugin.app]);

  const handleBatchDelete = useCallback(async () => {
    const paths = Array.from(selectedTrades);
    const result = await batchDeleteTrades(plugin.app, paths);

    
    if (result.errors > 0 && result.processed === 0) {
      new Notice(
        t('notice.error.delete-trades', {
          error: tPlural('tradelog.batch.errors-count', result.errors),
        })
      );
    } else if (result.errors === 0) {
      new Notice(tPlural('notice.trades-deleted', result.processed));
    } else {
      new Notice(
        `${tPlural('notice.trades-deleted', result.processed)} (${tPlural('tradelog.batch.errors-count', result.errors)})`
      );
    }

    setSelectedTrades(new Set());
    setIsMultiSelectMode(false);
  }, [selectedTrades, plugin.app]);

  
  useEffect(() => {
    void loadData();
  }, [debouncedFilters, loadData]);

  
  
  const reloadTimerRef = useRef<number | null>(null);

  
  const handleTradeDataChanged = useCallback(() => {
    
    if (reloadTimerRef.current) {
      window.clearTimeout(reloadTimerRef.current);
    }
    reloadTimerRef.current = window.setTimeout(() => {
      void (async () => {
        
        if (plugin.app.workspace.trigger) {
          plugin.app.workspace.trigger('layout-change');
        }
        
        await new Promise((resolve) => window.setTimeout(resolve, 80));
        await loadData();
        reloadTimerRef.current = null;
      })();
    }, 400);
  }, [loadData, plugin.app.workspace]);

  
  useEventBusMultiple(
    TRADE_DATA_CHANGE_EVENTS,
    handleTradeDataChanged,
    isActive
  );

  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      syncAndLoadPersistedFilters();
    }
    wasActiveRef.current = isActive;
  }, [isActive, syncAndLoadPersistedFilters]);

  useEventBus(
    'settings:changed',
    (payload?: SettingsChangedPayload) => {
      if (payload?.section === 'trade' || payload?.source === 'week-start') {
        handleTradeDataChanged();
      }
      if (payload?.section === 'copyTradeAdjustments') {
        void loadData();
      }
      if (payload?.section === 'drc') {
        setNodes(refreshSessionLogTagDefinitionNodeIdentities);
        const configuredTagIds = new Set(
          getSessionLogTags(plugin).map((tag) => tag.id)
        );
        const currentFilters = filtersRef.current;
        const nextFilters = pruneUnknownSessionLogTags(
          currentFilters,
          configuredTagIds
        );
        if (nextFilters !== currentFilters) {
          commitFilters(nextFilters);
        }
      }
    },
    isActive
  );

  
  useEffect(() => {
    return () => {
      if (reloadTimerRef.current) {
        window.clearTimeout(reloadTimerRef.current);
      }
    };
  }, []);

  
  const handleToggleExpand = useCallback(
    async (node: TimeNode) => {
      const newExpanded = new Set(expandedNodes);

      if (expandedNodes.has(node.id)) {
        
        newExpanded.delete(node.id);
        setExpandedNodes(newExpanded);
      } else {
        

        
        if (!node.dataLoaded && node.type !== 'trade') {
          try {
            const children = await tradeLogService.getNodeChildren(node, {
              operationFilePaths: activeTradeLogScope?.filePaths,
            });

            
            

            
            setNodes((prev) => updateNodeChildren(prev, node.id, children));

            
            
            window.setTimeout(() => {
              setExpandedNodes((prev) => {
                const newExpandedDelayed = new Set(prev);
                newExpandedDelayed.add(node.id);
                return newExpandedDelayed;
              });
            }, 0);
          } catch (error) {
            console.error('Error loading node children:', error);
            
          }
        } else {
          
          newExpanded.add(node.id);
          setExpandedNodes(newExpanded);
        }
      }
    },
    [activeTradeLogScope?.filePaths, expandedNodes, tradeLogService]
  );

  
  const navigateToNode = useCallback(
    async (node: TimeNode) => {
      switch (node.type) {
        case 'trade': {
          
          
          let tradePath: string | undefined;
          const trade = asRecord(node.trade);
          const fileRecord = asRecord(trade?.file);
          const copySourcePath = getStringValue(trade, 'copySourceFilePath');
          const filePath = getStringValue(fileRecord, 'path');
          const tradeFilePath = getStringValue(trade, 'filePath');
          if (copySourcePath) {
            tradePath = copySourcePath;
          } else if (filePath) {
            tradePath = filePath;
          } else if (tradeFilePath) {
            
            tradePath = tradeFilePath;
          } else if (node.id && node.id.includes('.md')) {
            
            tradePath = node.id;
          }

          
          if (tradePath) {
            const file = plugin.app.vault.getAbstractFileByPath(tradePath);
            if (file) {
              await plugin.openFile(tradePath, true);
            } else {
              
              console.warn('Trade file not found:', tradePath);
              new Notice(
                t('tradelog.node.file-not-found', { path: tradePath })
              );
            }
          }
          break;
        }

        case 'day': {
          const date = createTradingDayFromString(node.id);
          const outcome = await openReviewPeriod(plugin, 'days', date);
          showReviewNavigationNotice(outcome);
          break;
        }

        case 'week': {
          if (!node.anchorDate) break;
          const outcome = await openReviewPeriod(
            plugin,
            'weeks',
            createTradingDayFromString(node.anchorDate)
          );
          showReviewNavigationNotice(outcome);
          break;
        }

        case 'month': {
          const [yearStr, monthStr] = node.id.split('-');
          const year = parseInt(yearStr);
          const month = parseInt(monthStr) - 1;
          const monthDate = new Date(year, month, 1);
          const outcome = await openReviewPeriod(plugin, 'months', monthDate);
          showReviewNavigationNotice(outcome);
          break;
        }

        case 'quarter': {
          const [yearStr, quarterStr] = node.id.split('-Q');
          const date = new Date(
            parseInt(yearStr),
            (parseInt(quarterStr) - 1) * 3,
            1
          );
          const outcome = await openReviewPeriod(plugin, 'quarters', date);
          showReviewNavigationNotice(outcome);
          break;
        }

        case 'year': {
          const outcome = await openReviewPeriod(
            plugin,
            'years',
            new Date(parseInt(node.id), 0, 1)
          );
          showReviewNavigationNotice(outcome);
          break;
        }
      }
    },
    [plugin]
  );

  const handleNodeClick = useCallback(
    async (node: TimeNode) => {
      if (nodeNavigationInFlightRef.current) return;
      nodeNavigationInFlightRef.current = true;
      try {
        await navigateToNode(node);
      } finally {
        nodeNavigationInFlightRef.current = false;
      }
    },
    [navigateToNode]
  );

  const handleClearImageGalleryFilters = useCallback(() => {
    const nextFilters = {
      ...createTradeLogFilters(),
      viewLevel: filtersRef.current.viewLevel,
    };
    commitFilters(nextFilters);
    handleImageGalleryControlsChange({ sourceType: 'all' });
  }, [commitFilters, handleImageGalleryControlsChange]);

  const handleClearTradeFilters = useCallback(() => {
    const nextFilters = {
      ...createTradeLogFilters(),
      viewLevel: filtersRef.current.viewLevel,
    };
    commitFilters(nextFilters);
  }, [commitFilters]);

  const handleShowAllImageGallerySources = useCallback(() => {
    handleImageGalleryControlsChange({ sourceType: 'all' });
  }, [handleImageGalleryControlsChange]);

  
  const handleFilterChange = useCallback(
    (newFilters: Partial<TradeLogFilters>) => {
      const nextFilters = clearInactiveTreeSessionLogTags(
        mergeUserTradeLogFilterChange(filtersRef.current, newFilters),
        tradeLogMode
      );
      commitFilters(nextFilters);
    },
    [commitFilters, tradeLogMode]
  );

  const handleAccountChanged = useCallback(
    (payload: AccountChangedPayload) => {
      const remappedFilters = remapAccountFilterFromAccountChange(
        filtersRef.current,
        payload
      );

      if (remappedFilters === filtersRef.current) return;

      const nextFilters = normalizeTradeLogFilters(remappedFilters);
      commitFilters(nextFilters);
    },
    [commitFilters]
  );

  useEventBus('account:changed', handleAccountChanged);
  useEventBus('tradelog:filters-updated', syncAndLoadPersistedFilters);

  const handleSettingsChange = useCallback(() => {
    setSettingsVersion((prev) => prev + 1);
  }, []);

  const effectiveHeaderScrollbarWidth =
    filters.viewLevel === 'trades' ? headerScrollbarWidth : 0;

  
  const handleTreeReady = useCallback(() => {
    if (isLoadingRef.current) {
      return;
    }

    setIsTreeReady(true);
    
    setRequestedScrollOffset(null);
  }, []);

  const treeContent =
    !isDataLoaded || (nodes.length === 0 && !isTradeCountResolved) ? (
      <TradeLogSkeleton
        visibleColumns={visibleColumns}
        gridTemplate={gridTemplate}
        containerHeight={containerHeight}
      />
    ) : (
      <div className="trade-log-tree-wrapper">
        {!isTreeReady && (
          <TradeLogSkeleton
            visibleColumns={visibleColumns}
            gridTemplate={gridTemplate}
            containerHeight={containerHeight}
          />
        )}
        <div
          className={`trade-log-tree-container ${isTreeReady ? 'trade-log-tree-container--visible' : 'trade-log-tree-container--hidden'}`}
        >
          <TradeLogTree
            nodes={sortedNodes}
            expandedNodes={expandedNodes}
            onToggleExpand={(path) => void handleToggleExpand(path)}
            onNodeClick={(node) => void handleNodeClick(node)}
            onTreeReady={handleTreeReady}
            onScrollbarWidthChange={setHeaderScrollbarWidth}
            viewLevel={filters.viewLevel}
            visibleColumns={visibleColumns}
            gridTemplate={gridTemplate}
            selectedTrades={selectedTrades}
            onToggleTradeSelection={handleToggleTradeSelection}
            isMultiSelectMode={isMultiSelectMode}
            isExpandedMode={isExpandedMode}
            requestedScrollOffset={requestedScrollOffset}
            onScrollOffsetChange={(offset) => {
              scrollOffsetRef.current = offset;
            }}
          />
        </div>
      </div>
    );

  const expandedModeSizerRow = (
    <ExpandedModeSizerRow
      isExpandedMode={Boolean(isExpandedMode)}
      isDataLoaded={isDataLoaded}
      sizerRowRef={sizerRowRef}
      visibleColumns={visibleColumns}
      sizerRowData={sizerRowData}
    />
  );

  return {
    plugin,
    leaf,
    isDataLoaded,
    nodes,
    isTradeCountResolved,
    activeTradeLogScope,
    clearTradeLogOperationScope: () =>
      plugin.ensureTradeOperationResultService().clearTradeLogScope(),
    tradeCountResolution,
    filters,
    tradeLogMode,
    handleModeChange,
    imageGalleryControls,
    imageGalleryService,
    tradeLogService,
    handleImageGalleryControlsChange,
    handleClearImageGalleryFilters,
    handleClearTradeFilters,
    setImageGalleryItemCount,
    handleShowAllImageGallerySources,
    handleFilterChange,
    handleSettingsChange,
    isMultiSelectMode,
    handleToggleMultiSelectMode,
    registerEmptyStateTarget,
    registerBatchToolbarTarget,
    selectedTrades,
    handleBatchMarkReviewed,
    handleBatchAddSetups,
    handleBatchAddTags,
    handleBatchAddMistakes,
    handleBatchDuplicate,
    handleBatchDelete,
    handleSelectAll,
    handleClearSelection,
    setupOptions,
    tagOptions,
    mistakeOptions,
    tradesMinWidth,
    gridTemplate,
    effectiveHeaderScrollbarWidth,
    effectiveSortConfig,
    visibleColumns,
    registerTableHeadersTarget,
    handleSort,
    expandedModeSizerRow,
    treeContent,
  };
};

const TradeLogContent: React.FC<{
  controller: ReturnType<typeof useTradeLogController>;
}> = ({ controller }) => {
  const {
    plugin,
    leaf,
    isDataLoaded,
    nodes,
    isTradeCountResolved,
    activeTradeLogScope,
    clearTradeLogOperationScope,
    tradeCountResolution,
    filters,
    tradeLogMode,
    handleModeChange,
    imageGalleryControls,
    imageGalleryService,
    tradeLogService,
    handleImageGalleryControlsChange,
    handleClearImageGalleryFilters,
    handleClearTradeFilters,
    setImageGalleryItemCount,
    handleShowAllImageGallerySources,
    handleFilterChange,
    handleSettingsChange,
    isMultiSelectMode,
    handleToggleMultiSelectMode,
    registerEmptyStateTarget,
    registerBatchToolbarTarget,
    selectedTrades,
    handleBatchMarkReviewed,
    handleBatchAddSetups,
    handleBatchAddTags,
    handleBatchAddMistakes,
    handleBatchDuplicate,
    handleBatchDelete,
    handleSelectAll,
    handleClearSelection,
    setupOptions,
    tagOptions,
    mistakeOptions,
    tradesMinWidth,
    gridTemplate,
    effectiveHeaderScrollbarWidth,
    effectiveSortConfig,
    visibleColumns,
    registerTableHeadersTarget,
    handleSort,
    expandedModeSizerRow,
    treeContent,
  } = controller;

  const operationScopeBanner = activeTradeLogScope ? (
    <div className="journalit-trade-log-operation-scope" role="status">
      <div className="journalit-trade-log-operation-scope__label">
        <ListFilter size={16} aria-hidden="true" />
        <span>
          {t('trade-handoff.scope.label', {
            trades: tPlural(
              'trade-handoff.trade-count',
              activeTradeLogScope.filePaths.length
            ),
            accounts: activeTradeLogScope.accountNames.join(', '),
          })}
        </span>
      </div>
      <button
        type="button"
        className="journalit-trade-log-operation-scope__exit"
        onClick={clearTradeLogOperationScope}
      >
        {t('trade-handoff.scope.exit')}
      </button>
    </div>
  ) : null;

  
  if (
    tradeLogMode === 'trades' &&
    isDataLoaded &&
    nodes.length === 0 &&
    isTradeCountResolved
  ) {
    const handleOpenTradeForm = () => {
      const modal = new TradeFormModal({ app: plugin.app, plugin });
      modal.open();
    };

    const handleOpenTradeImport = () => {
      void plugin.viewManager.openCSVImportView();
    };

    return (
      <div className="journalit-trade-log journalit-trade-log--operation-scope">
        <TradeLogHeader
          app={plugin.app}
          plugin={plugin}
          tradeLogService={tradeLogService}
          imageGalleryService={imageGalleryService}
          leaf={leaf}
          filters={filters}
          mode={tradeLogMode}
          onModeChange={handleModeChange}
          imageGalleryControls={imageGalleryControls}
          onImageGalleryControlsChange={handleImageGalleryControlsChange}
          onFilterChange={handleFilterChange}
          onSettingsChange={handleSettingsChange}
          isMultiSelectMode={isMultiSelectMode}
          onToggleMultiSelectMode={handleToggleMultiSelectMode}
          tradeOnly={Boolean(activeTradeLogScope)}
        />
        {operationScopeBanner}
        <div
          ref={registerEmptyStateTarget}
          className="journalit-trade-log-empty-container"
        >
          <TradeLogEmptyState
            isFilteredEmpty={shouldShowTradeLogFilteredEmptyState(
              tradeCountResolution,
              filters,
              Boolean(activeTradeLogScope)
            )}
            onImportTrades={handleOpenTradeImport}
            onAddTradeManually={handleOpenTradeForm}
            onClearFilters={handleClearTradeFilters}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`journalit-trade-log${activeTradeLogScope ? ' journalit-trade-log--operation-scope' : ''}`}
    >
      <TradeLogHeader
        app={plugin.app}
        plugin={plugin}
        tradeLogService={tradeLogService}
        imageGalleryService={imageGalleryService}
        leaf={leaf}
        filters={filters}
        mode={tradeLogMode}
        onModeChange={handleModeChange}
        imageGalleryControls={imageGalleryControls}
        onImageGalleryControlsChange={handleImageGalleryControlsChange}
        onFilterChange={handleFilterChange}
        onSettingsChange={handleSettingsChange}
        isMultiSelectMode={isMultiSelectMode}
        onToggleMultiSelectMode={handleToggleMultiSelectMode}
        tradeOnly={Boolean(activeTradeLogScope)}
      />

      {operationScopeBanner}

      {tradeLogMode === 'trades' && isMultiSelectMode && (
        <div ref={registerBatchToolbarTarget}>
          <BatchActionToolbar
            app={plugin.app}
            plugin={plugin}
            selectedCount={selectedTrades.size}
            onMarkAsReviewed={handleBatchMarkReviewed}
            onAddSetups={handleBatchAddSetups}
            onAddTags={handleBatchAddTags}
            onAddMistakes={handleBatchAddMistakes}
            onDuplicate={handleBatchDuplicate}
            onDelete={handleBatchDelete}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            setupOptions={setupOptions}
            tagOptions={tagOptions}
            mistakeOptions={mistakeOptions}
          />
        </div>
      )}

      {tradeLogMode === 'imageGallery' ? (
        <ImageGallery
          plugin={plugin}
          service={imageGalleryService}
          tradeLogFilters={filters}
          onClearFilters={handleClearImageGalleryFilters}
          onItemCountChange={setImageGalleryItemCount}
          onShowAllImages={handleShowAllImageGallerySources}
          {...imageGalleryControls}
        />
      ) : (
        <div
          className={`trade-log-content ${filters.viewLevel === 'trades' ? 'trades-view' : 'tree-view'}`}
        >
          {filters.viewLevel === 'trades' ? (
            <div className="trade-log-hscroll">
              <div
                className="trade-log-hscroll-inner"
                style={cssVars({
                  '--journalit-tradelog-min-width': `${tradesMinWidth}px`,
                })}
              >
                
                {isDataLoaded && (
                  <TradeLogColumnHeaders
                    visibleColumns={visibleColumns}
                    gridTemplate={gridTemplate}
                    effectiveHeaderScrollbarWidth={
                      effectiveHeaderScrollbarWidth
                    }
                    effectiveSortConfig={effectiveSortConfig}
                    registerTableHeadersTarget={registerTableHeadersTarget}
                    onSort={handleSort}
                  />
                )}

                {expandedModeSizerRow}

                {treeContent}
              </div>
            </div>
          ) : (
            <div className="trade-log-hscroll">
              <div
                className="trade-log-hscroll-inner"
                style={cssVars({
                  '--journalit-tradelog-min-width': `${tradesMinWidth}px`,
                })}
              >
                {expandedModeSizerRow}
                {treeContent}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const TradeLog: React.FC<TradeLogProps> = (props) => {
  const controller = useTradeLogController(props);
  const labelColors = useTradeLabelColorData(props.plugin);

  return (
    <TradeLabelColorProvider value={labelColors}>
      <TradeLogContent controller={controller} />
    </TradeLabelColorProvider>
  );
};
