import { logger } from '../../utils/logger';


import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import JournalitPlugin from '../../main';
import { TradeLogService } from '../../services/tradelog';
import { ServiceManager } from '../../services/ServiceManager';
import { TimeNode, TradeLogFilters } from '../../services/tradelog/types';
import { TradeLogHeader } from './TradeLogHeader';
import { TradeLogTree } from './TradeLogTree';
import { EmptyState } from '../shared';
import { TradeLogSkeleton } from './TradeLogSkeleton';
import { useDebounced, useEventBus, useEventBusMultiple } from '../../hooks';
import { useLeafActive } from '../../hooks/useLeafActive';
import { TradeFormModal } from '../forms/trade/TradeFormModal';
import { Notice, WorkspaceLeaf } from 'obsidian';
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
  type ObsidianIconComponent,
} from '../shared/icons/ObsidianIcon';
import { BatchActionToolbar } from './BatchActionToolbar';
import {
  batchMarkAsReviewed,
  batchAddSetups,
  batchAddTags,
  batchAddMistakes,
  batchDeleteTrades,
} from './batchOperations';
import { OptionType } from '../../services/options';
import { getTradeIdsInRange } from './selectionUtils';
import { createTradingDayFromString } from '../../utils/tradingDayUtils';
import { cssVars } from '../../styles/inlineStylePolicy';
import {
  CustomFieldDefinition,
  CustomFieldType,
  isDiscreteCustomFieldFilterable,
} from '../../types/customFields';
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
  TRADE_LOG_MAIN_GUIDE_ID,
  TRADE_LOG_MULTI_SELECT_ENABLED_ACTION_ID,
  TRADE_LOG_TABLE_HEADERS_TARGET_ID,
} from '../../guides/tradeLogGuideIds';
import { TRADE_LOG_VIEW_TYPE } from '../../views/TradeLogView';
import { AccountChangedPayload } from '../../services/events/types';
import { remapAccountFilterFromAccountChange } from '../shared/filters/remapSelectedAccounts';
import { persistViewFilter } from '../shared/filters/viewFilterPersistence';

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
  'trade:changed' | 'backtest-trade:changed' | 'folder-path:changed'
> = ['trade:changed', 'backtest-trade:changed', 'folder-path:changed'];

const TRADE_DATA_CHANGE_EVENTS: Array<
  | 'trade:committed'
  | 'trade:changed'
  | 'missed-trade:changed'
  | 'backtest-trade:changed'
> = [
  'trade:committed',
  'trade:changed',
  'missed-trade:changed',
  'backtest-trade:changed',
];

type TradeLogFilterSyncWindow = Window & {
  journalitSyncTradeLogFilters?: () => void;
};








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

const sanitizeCustomFieldFilters = (
  customFieldFilters: TradeLogFilters['customFieldFilters'],
  customFields: CustomFieldDefinition[]
): TradeLogFilters['customFieldFilters'] => {
  const filterableFieldIds = new Set(
    customFields
      .filter((field) => isDiscreteCustomFieldFilterable(field))
      .map((field) => field.id)
  );

  return Object.fromEntries(
    Object.entries(customFieldFilters || {}).flatMap(([fieldId, values]) => {
      if (!filterableFieldIds.has(fieldId) || !Array.isArray(values)) {
        return [];
      }

      const sanitizedValues = [...new Set(values.filter(Boolean))];
      return sanitizedValues.length > 0 ? [[fieldId, sanitizedValues]] : [];
    })
  );
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
                {sizerRowData.setups.map((setup, i) => (
                  <span key={setupKeys[i]} className="pill pill--setup">
                    {setup}
                  </span>
                ))}
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
                {sizerRowData.tags.map((tag, i) => (
                  <span key={tagKeys[i]} className="pill pill--tag">
                    {tag}
                  </span>
                ))}
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

        return (
          <div
            key={col.id}
            className={`header-cell header-${col.id} ${isMoneyColumn ? 'header-money-cell' : ''} ${isClickable ? 'sortable' : ''} ${isSorted ? 'sorted' : ''}`}
            onClick={isClickable ? () => onSort(col.id) : undefined}
            onKeyDown={(event) => {
              if (
                !isClickable ||
                (event.key !== 'Enter' && event.key !== ' ')
              ) {
                return;
              }

              event.preventDefault();
              onSort(col.id);
            }}
            role="button"
            tabIndex={isClickable ? 0 : undefined}
          >
            <span>{label}</span>

            {IconComponent && (
              <IconComponent
                size={14}
                className={
                  isSorted ? 'sort-indicator' : 'sort-indicator-unsorted'
                }
              />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const useTradeLogController = ({ plugin, leaf }: TradeLogProps) => {
  const isActive = useLeafActive(leaf);
  
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isTreeReady, setIsTreeReady] = useState(false);
  const [nodes, setNodes] = useState<TimeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<TradeLogFilters>(() => {
    const defaults = createTradeLogFilters();
    const persisted = plugin.uiStateManager.getState().viewFilters?.tradelog;
    if (!persisted) {
      return defaults;
    }

    return {
      ...normalizeTradeLogFilters(persisted),
      dateRange: [
        persisted.dateRange?.[0] ? new Date(persisted.dateRange[0]) : null,
        persisted.dateRange?.[1] ? new Date(persisted.dateRange[1]) : null,
      ],
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
  const [guideVersion, setGuideVersion] = useState(0);
  const [optionsVersion, setOptionsVersion] = useState(0);
  const [totalTradeCount, setTotalTradeCount] = useState<number | null>(null);
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
  
  const isLoadingRef = useRef(false);

  const getPersistedTradeLogFilters =
    useCallback((): TradeLogFilters | null => {
      const persisted = plugin.uiStateManager.getState().viewFilters?.tradelog;
      if (!persisted) {
        return null;
      }

      return {
        ...normalizeTradeLogFilters(persisted),
        dateRange: [
          persisted.dateRange?.[0] ? new Date(persisted.dateRange[0]) : null,
          persisted.dateRange?.[1] ? new Date(persisted.dateRange[1]) : null,
        ],
      };
    }, [plugin.uiStateManager]);

  const syncFiltersFromPersistedState = useCallback(() => {
    const persistedFilters = getPersistedTradeLogFilters();
    if (persistedFilters) {
      setFilters(persistedFilters);
    }
  }, [getPersistedTradeLogFilters]);

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

  useEffect(() => {
    const sanitizedCustomFieldFilters = sanitizeCustomFieldFilters(
      filters.customFieldFilters,
      customFields
    );
    const currentEntries = Object.entries(filters.customFieldFilters || {});
    const sanitizedEntries = Object.entries(sanitizedCustomFieldFilters);

    let filtersAreUnchanged = currentEntries.length === sanitizedEntries.length;

    if (filtersAreUnchanged) {
      for (const [fieldId, values] of currentEntries) {
        const nextValues = sanitizedCustomFieldFilters[fieldId] || [];
        if (!Array.isArray(values) || values.length !== nextValues.length) {
          filtersAreUnchanged = false;
          break;
        }

        for (let index = 0; index < values.length; index++) {
          if (values[index] !== nextValues[index]) {
            filtersAreUnchanged = false;
            break;
          }
        }

        if (!filtersAreUnchanged) break;
      }
    }

    if (filtersAreUnchanged) {
      return;
    }

    setFilters((prev) => {
      const nextFilters = normalizeTradeLogFilters({
        ...prev,
        customFieldFilters: sanitizedCustomFieldFilters,
      });

      persistViewFilter(plugin.uiStateManager, 'tradelog', nextFilters);

      return nextFilters;
    });
  }, [customFields, filters.customFieldFilters, plugin]);

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
      allColumns
    );
  }, [
    nodes,
    effectiveSortConfig,
    filters.viewLevel,
    defaultRiskAmount,
    allColumns,
  ]);

  const sizerRowData = useMemo(() => {
    if (!isExpandedMode) {
      return {
        setups: [] as string[],
        mistakes: [] as string[],
        tags: [] as string[],
        customMultiselects: {} as Record<string, string[]>,
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
      const w = col.width === 0 ? 320 : col.width;
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

  

  const tradeLogServiceRef = useRef<TradeLogService | null>(null);
  if (!tradeLogServiceRef.current) {
    tradeLogServiceRef.current = new TradeLogService(plugin);
  }
  const tradeLogService = tradeLogServiceRef.current;

  
  const debouncedFilters = useDebounced(filters, 150);

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

        const count = await plugin.tradeService.getTradeCount();
        if (!ignoreUnmount || !ignoreUnmount()) {
          setTotalTradeCount(count);
        }
      } catch (error) {
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

  const resolvedGuideId = useMemo(() => {
    if (isDataLoaded) {
      if (nodes.length > 0) {
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
  }, [isDataLoaded, nodes.length, totalTradeCount]);

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
    if (
      toStepId === 'intro' ||
      toStepId === 'view-selector' ||
      toStepId === 'filters' ||
      toStepId === 'filter-modal' ||
      toStepId === 'sorting'
    ) {
      setIsMultiSelectMode(false);
      setSelectedTrades(new Set());
      return;
    }

    if (toStepId === 'multi-select' || toStepId === 'batch-actions') {
      setIsMultiSelectMode(toStepId === 'batch-actions');
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

    if (!session || session.guideId !== TRADE_LOG_MAIN_GUIDE_ID) {
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
      const shouldBlockForLoad =
        !hasLoadedOnceRef.current ||
        lastViewLevelRef.current !== activeFilters.viewLevel;

      
      
      
      
      
      if (shouldBlockForLoad) {
        setIsDataLoaded(false);
        setIsTreeReady(false);
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
          activeFilters.customFieldFilters
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
    [tradeLogService]
  );

  const loadData = useCallback(async () => {
    await loadDataForFilters(debouncedFilters);
  }, [debouncedFilters, loadDataForFilters]);

  const syncAndLoadPersistedFilters = useCallback(() => {
    const persistedFilters = getPersistedTradeLogFilters();
    if (!persistedFilters) {
      void loadData();
      return;
    }

    setFilters(persistedFilters);
    void loadDataForFilters(persistedFilters);
  }, [getPersistedTradeLogFilters, loadData, loadDataForFilters]);

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
    (payload?: { section?: string; source?: string }) => {
      if (payload?.section === 'trade' || payload?.source === 'week-start') {
        handleTradeDataChanged();
      }
      if (payload?.section === 'copyTradeAdjustments') {
        void loadData();
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

  
  useEffect(() => {
    return () => {
      
      if (tradeLogServiceRef.current) {
        tradeLogServiceRef.current.destroy();
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
            const children = await tradeLogService.getNodeChildren(node);

            
            

            
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
    [expandedNodes, tradeLogService]
  );

  
  const handleNodeClick = useCallback(
    async (node: TimeNode) => {
      const serviceManager = ServiceManager.getInstance(plugin.app, plugin);

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
          const drcService = await serviceManager.getDRCService();
          const drcPath = drcService.getDRCNotePath(date);

          
          const file = plugin.app.vault.getAbstractFileByPath(drcPath);
          if (file) {
            await plugin.openFile(drcPath, true);
          } else if (plugin.settings.drc.autoCreateDRCOnNavigation) {
            
            await drcService.createDRC(date);
            await plugin.openFile(drcPath, true);
          }
          
          break;
        }

        case 'week': {
          
          
          
          const parts = node.id.split('-W');
          const weekStr = parts[1]; 
          const yearMonth = parts[0]; 
          const yearStr = yearMonth.split('-')[0]; 
          const year = parseInt(yearStr);
          const week = parseInt(weekStr);

          
          const jan1 = new Date(year, 0, 1);
          const dayOfWeek = jan1.getDay();
          const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
          const firstMonday = new Date(year, 0, 1 + daysToMonday);
          const weekDate = new Date(
            firstMonday.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000
          );

          const weeklyService = await serviceManager.getWeeklyReviewService();
          const weekPath = weeklyService.getWeeklyReviewPath(weekDate);

          
          const file = plugin.app.vault.getAbstractFileByPath(weekPath);
          if (file) {
            await plugin.openFile(weekPath, true);
          } else if (
            plugin.settings.weekly.autoCreateWeeklyReviewOnNavigation
          ) {
            
            await weeklyService.createWeeklyReview(weekDate);
            await plugin.openFile(weekPath, true);
          }
          
          break;
        }

        case 'month': {
          
          
          const [yearStr, monthStr] = node.id.split('-');
          const year = parseInt(yearStr);
          const month = parseInt(monthStr) - 1; 
          const monthDate = new Date(year, month, 1);

          const monthlyService = await serviceManager.getMonthlyReviewService();
          const monthPath = monthlyService.getMonthlyReviewPath(monthDate);

          
          const file = plugin.app.vault.getAbstractFileByPath(monthPath);
          if (file) {
            await plugin.openFile(monthPath, true);
          } else if (
            plugin.settings.monthly?.autoCreateMonthlyReviewOnNavigation
          ) {
            
            const createdFile =
              await monthlyService.createMonthlyReview(monthDate);
            if (createdFile) {
              await plugin.openFile(monthPath, true);
            }
          }
          
          break;
        }

        case 'quarter':
        case 'year':
          
          logger.debug(
            t('tradelog.node.no-review-available', {
              type: node.type,
              id: node.id,
            })
          );
          break;
      }
    },
    [plugin]
  );

  const persistFilters = useCallback(
    (nextFilters: TradeLogFilters) => {
      const normalizedFilters = normalizeTradeLogFilters(nextFilters);
      persistViewFilter(plugin.uiStateManager, 'tradelog', normalizedFilters);
    },
    [plugin]
  );

  
  const handleFilterChange = useCallback(
    (newFilters: Partial<TradeLogFilters>) => {
      setFilters((prev) => {
        const nextFilters = normalizeTradeLogFilters({
          ...prev,
          ...newFilters,
        });
        persistFilters(nextFilters);
        return nextFilters;
      });
    },
    [persistFilters]
  );

  const handleAccountChanged = useCallback(
    (payload: AccountChangedPayload) => {
      setFilters((previousFilters) => {
        const remappedFilters = remapAccountFilterFromAccountChange(
          previousFilters,
          payload
        );

        if (remappedFilters === previousFilters) {
          return previousFilters;
        }

        const nextFilters = normalizeTradeLogFilters(remappedFilters);
        persistFilters(nextFilters);
        return nextFilters;
      });
    },
    [persistFilters]
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

  const renderTreeContent = () =>
    !isDataLoaded ? (
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

  const renderExpandedModeSizerRow = () => (
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
    filters,
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
    renderExpandedModeSizerRow,
    renderTreeContent,
  };
};

const renderTradeLog = (
  controller: ReturnType<typeof useTradeLogController>
) => {
  const {
    plugin,
    leaf,
    isDataLoaded,
    nodes,
    filters,
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
    renderExpandedModeSizerRow,
    renderTreeContent,
  } = controller;

  
  if (isDataLoaded && nodes.length === 0) {
    return (
      <div className="journalit-trade-log">
        <TradeLogHeader
          app={plugin.app}
          plugin={plugin}
          leaf={leaf}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSettingsChange={handleSettingsChange}
          isMultiSelectMode={isMultiSelectMode}
          onToggleMultiSelectMode={handleToggleMultiSelectMode}
        />
        <div ref={registerEmptyStateTarget}>
          <EmptyState
            message={t('tradelog.empty')}
            subMessage={t('tradelog.empty.submessage')}
            actionButtonText={t('button.create-trade')}
            onActionButtonClick={() => {
              void (async () => {
                const modal = new TradeFormModal({ app: plugin.app, plugin });
                modal.open();
              })();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="journalit-trade-log">
      <TradeLogHeader
        app={plugin.app}
        plugin={plugin}
        leaf={leaf}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSettingsChange={handleSettingsChange}
        isMultiSelectMode={isMultiSelectMode}
        onToggleMultiSelectMode={handleToggleMultiSelectMode}
      />

      {isMultiSelectMode && (
        <div ref={registerBatchToolbarTarget}>
          <BatchActionToolbar
            app={plugin.app}
            plugin={plugin}
            selectedCount={selectedTrades.size}
            onMarkAsReviewed={handleBatchMarkReviewed}
            onAddSetups={handleBatchAddSetups}
            onAddTags={handleBatchAddTags}
            onAddMistakes={handleBatchAddMistakes}
            onDelete={handleBatchDelete}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            setupOptions={setupOptions}
            tagOptions={tagOptions}
            mistakeOptions={mistakeOptions}
          />
        </div>
      )}

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
                  effectiveHeaderScrollbarWidth={effectiveHeaderScrollbarWidth}
                  effectiveSortConfig={effectiveSortConfig}
                  registerTableHeadersTarget={registerTableHeadersTarget}
                  onSort={handleSort}
                />
              )}

              {renderExpandedModeSizerRow()}

              {renderTreeContent()}
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
              {renderExpandedModeSizerRow()}
              {renderTreeContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TradeLog: React.FC<TradeLogProps> = (props) =>
  renderTradeLog(useTradeLogController(props));
