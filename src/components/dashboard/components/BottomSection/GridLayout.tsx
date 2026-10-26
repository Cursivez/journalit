

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  ResponsiveGridLayout,
  type Layout,
  applyVerticalDragSwap,
  normalizeBottomSentinelRows,
  useContainerWidth,
  verticalCompactor,
} from '../../../shared/gridLayout/reactGridLayoutCompat';
import {
  getActiveLayout,
  getSavedDashboardLgLayouts,
  saveLayout,
} from '../../utils/layoutUtils';
import {
  applyWidgetSizeConstraints,
  type BreakpointKey,
  fillMissingBreakpointItems,
  GRID_COLS,
  GRID_ROW_HEIGHT,
  isBreakpointKey,
  LAYOUT_BOTTOM_POSITION,
  normalizeLayoutItem,
  syncBreakpointsToCurrentLayout,
} from '../../../shared/gridLayout/gridLayoutUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import type JournalitPlugin from '../../../../main';
import { getUserDateFormat } from '../../../../utils/dateUtils';
import { getDashboardWidgetById } from './types';
import { hasTranslation, t } from '../../../../lang/helpers';
import { useDashboardData } from '../../context/DashboardDataContext';
import {
  buildCurrencyConversionMetadata,
  type CurrencyConversionTrade,
  CurrencyConversionInfo,
} from '../../../shared/display/CurrencyConversionInfo';
import { isPnlContributingTrade } from '../../../../utils/tradeStatusUtils';
import { StaticWidgetGrid } from '../../../shared/gridLayout/StaticWidgetGrid';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import { shouldShowDashboardWidgetMinimalHeader } from './widgetHeaderVisibility';
import { useDashboardLayoutReload } from '../../hooks/useDashboardLayoutReload';


class GridLayoutErrorBoundary extends React.Component<
  { children: React.ReactNode; isEditing: boolean },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; isEditing: boolean }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ResponsiveGridLayout crashed:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      isEditing: this.props.isEditing,
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="journalit-dashboard-grid-error">
          <h3>{t('home.grid.error.title')}</h3>
          <p>
            {t('home.grid.error.message', {
              error: this.state.error?.message || '',
            })}
          </p>
          <button
            className="journalit-dashboard-grid-error__retry"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            {t('home.grid.error.retry')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


import { PnLChart } from '../DashboardWidgets/PnLChart';
import { DirectionalPnLChart } from '../DashboardWidgets/DirectionalPnLChart';
import { PerformanceCalendar } from '../DashboardWidgets/PerformanceCalendar';
import { DailyPerformanceChart } from '../DashboardWidgets/DailyPerformanceChart';
import { TradesChart } from '../DashboardWidgets/TradesChart';
import { ExcursionScatter } from '../DashboardWidgets/ExcursionScatter';
import { DrawdownChart } from '../DashboardWidgets/DrawdownChart';
import { DirectionalDrawdownChart } from '../DashboardWidgets/DirectionalDrawdownChart';
import { RecentTradesWidget } from '../DashboardWidgets/RecentTradesWidget';
import { RollingWinLossRatioChart } from '../DashboardWidgets/RollingWinLossRatioChart';
import { RollingStatsChart } from '../DashboardWidgets/RollingStatsChart';
import { WeekdayPerformanceChart } from '../DashboardWidgets/WeekdayPerformanceChart';
import { HourlyPerformanceChart } from '../DashboardWidgets/HourlyPerformanceChart';
import { TickerPerformanceChart } from '../DashboardWidgets/TickerPerformanceChart';
import { SetupPerformanceChart } from '../DashboardWidgets/SetupPerformanceChart';
import { TagPerformanceChart } from '../DashboardWidgets/TagPerformanceChart';
import { RatingPerformanceChart } from '../DashboardWidgets/RatingPerformanceChart';


const GRID_MARGIN = 4;

const GRID_BREAKPOINTS: Record<BreakpointKey, number> = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};


const validateLayoutItem = (item: Layout): Layout =>
  applyWidgetSizeConstraints(
    normalizeLayoutItem(item),
    getDashboardWidgetById(item.i)
  );


const sanitizeBreakpointLayout = (
  layoutArray: Layout[] | undefined,
  allowedWidgetIds?: Set<string>
): Layout[] => {
  if (!Array.isArray(layoutArray)) {
    return [];
  }

  const seenWidgetIds = new Set<string>();
  const sanitized: Layout[] = [];

  for (const rawItem of Array.from(layoutArray)) {
    if (!rawItem || typeof rawItem !== 'object') {
      continue;
    }

    const itemId =
      typeof rawItem.i === 'string' && rawItem.i.length > 0
        ? rawItem.i
        : 'unknown';

    if (allowedWidgetIds && !allowedWidgetIds.has(itemId)) {
      continue;
    }

    if (seenWidgetIds.has(itemId)) {
      continue;
    }

    seenWidgetIds.add(itemId);
    sanitized.push(validateLayoutItem(rawItem));
  }

  return sanitized;
};

const calculateGridPixelHeight = (layout: Layout[]): number => {
  const rowCount = layout.reduce(
    (max, item) => Math.max(max, item.y + item.h),
    0
  );

  if (rowCount <= 0) return 0;
  return rowCount * GRID_ROW_HEIGHT + Math.max(0, rowCount - 1) * GRID_MARGIN;
};

interface GridLayoutProps {
  isEditing: boolean;
  widgets: string[];
  onRemoveWidget: (widgetId: string) => void;
}

interface DashboardWidgetRendererProps {
  widgetId: string;
  dateFormat: string;
}

interface DashboardWidgetCardProps extends DashboardWidgetRendererProps {
  editing: boolean;
  onRemoveWidget: (widgetId: string) => void;
  currencyConversion: ReturnType<typeof buildCurrencyConversionMetadata>;
  getConversionTradesForWidget: (
    widgetId: string
  ) => CurrencyConversionTrade[] | undefined;
}

type DashboardWidgetRenderFn = (dateFormat: string) => React.ReactElement;

const DASHBOARD_WIDGET_RENDERERS = new Map<string, DashboardWidgetRenderFn>(
  Object.entries({
    pnlChart: (dateFormat) => <PnLChart dateFormat={dateFormat} />,
    longPnLChart: (dateFormat) => (
      <DirectionalPnLChart dateFormat={dateFormat} direction="long" />
    ),
    shortPnLChart: (dateFormat) => (
      <DirectionalPnLChart dateFormat={dateFormat} direction="short" />
    ),
    performanceCalendar: (dateFormat) => (
      <PerformanceCalendar dateFormat={dateFormat} />
    ),
    dailyPerformance: (dateFormat) => (
      <DailyPerformanceChart dateFormat={dateFormat} />
    ),
    tradesChart: (dateFormat) => <TradesChart dateFormat={dateFormat} />,
    mfeScatter: (dateFormat) => (
      <ExcursionScatter excursion="mfe" dateFormat={dateFormat} />
    ),
    maeScatter: (dateFormat) => (
      <ExcursionScatter excursion="mae" dateFormat={dateFormat} />
    ),
    drawdownChart: (dateFormat) => <DrawdownChart dateFormat={dateFormat} />,
    longDrawdownChart: (dateFormat) => (
      <DirectionalDrawdownChart
        dateFormat={dateFormat}
        showLong={true}
        showShort={false}
        singleDirectionTitle={t('widget.longDrawdownChart.name')}
        hideInternalTitle={true}
      />
    ),
    shortDrawdownChart: (dateFormat) => (
      <DirectionalDrawdownChart
        dateFormat={dateFormat}
        showLong={false}
        showShort={true}
        singleDirectionTitle={t('widget.shortDrawdownChart.name')}
        hideInternalTitle={true}
      />
    ),
    recentTrades: (dateFormat) => (
      <RecentTradesWidget dateFormat={dateFormat} />
    ),
    rollingWinRate: (dateFormat) => (
      <RollingWinLossRatioChart dateFormat={dateFormat} />
    ),
    rollingStats: (dateFormat) => <RollingStatsChart dateFormat={dateFormat} />,
    weekdayPerformance: (dateFormat) => (
      <WeekdayPerformanceChart dateFormat={dateFormat} />
    ),
    hourlyPerformance: (dateFormat) => (
      <HourlyPerformanceChart dateFormat={dateFormat} />
    ),
    tickerPerformance: (dateFormat) => (
      <TickerPerformanceChart dateFormat={dateFormat} />
    ),
    setupPerformance: (dateFormat) => (
      <SetupPerformanceChart dateFormat={dateFormat} />
    ),
    tagPerformance: (dateFormat) => (
      <TagPerformanceChart dateFormat={dateFormat} />
    ),
    ratingPerformance: (dateFormat) => (
      <RatingPerformanceChart dateFormat={dateFormat} />
    ),
  } satisfies Record<string, DashboardWidgetRenderFn>)
);

const DashboardWidgetRenderer: React.FC<DashboardWidgetRendererProps> = ({
  widgetId,
  dateFormat,
}) => {
  const render = DASHBOARD_WIDGET_RENDERERS.get(widgetId);
  if (render) return render(dateFormat);
  return (
    <div className="journalit-dashboard-widget-error">
      Widget not implemented: {widgetId}
    </div>
  );
};

const DashboardWidgetCard: React.FC<DashboardWidgetCardProps> = ({
  widgetId,
  dateFormat,
  editing,
  onRemoveWidget,
  currencyConversion,
  getConversionTradesForWidget,
}) => {
  const { dashboardData, error } = useDashboardData();
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveWidget(widgetId);
  };

  const showMinimalHeader = shouldShowDashboardWidgetMinimalHeader({
    widgetId,
    hasDashboardData: dashboardData !== null,
    hasError: error !== null,
  });
  const widgetNameKey = `widget.${widgetId}.name`;
  const widgetName = hasTranslation(widgetNameKey)
    ? t(widgetNameKey)
    : widgetNameKey;

  return (
    <div className="journalit-dashboard-widget">
      {editing && (
        <button
          className="journalit-dashboard-widget-remove"
          onClick={handleRemoveClick}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label={t('grid.aria.remove-widget')}
        >
          ✕
        </button>
      )}

      {showMinimalHeader && (
        <div className="journalit-dashboard-widget-minimal-header">
          <div className="journalit-dashboard-widget-title">
            {widgetName}
            <CurrencyConversionInfo
              metadata={currencyConversion}
              trades={getConversionTradesForWidget(widgetId)}
            />
          </div>
        </div>
      )}

      <div className="journalit-dashboard-widget-content">
        <DashboardWidgetRenderer widgetId={widgetId} dateFormat={dateFormat} />
      </div>
    </div>
  );
};

const DashboardGridWidgetCard: React.FC<DashboardWidgetCardProps> = (props) => {
  const widgetDef = getDashboardWidgetById(props.widgetId);

  if (!widgetDef) {
    return (
      <div className="journalit-dashboard-widget-error">
        Unknown widget type: {props.widgetId}
      </div>
    );
  }

  return <DashboardWidgetCard {...props} />;
};



const useDashboardGridLayoutState = ({
  plugin,
  widgets,
  isEditing,
  gridWidth,
}: {
  plugin: JournalitPlugin | null;
  widgets: string[];
  isEditing: boolean;
  gridWidth: number;
}) => {
  type DashboardLayouts = {
    lg: Layout[];
    md: Layout[];
    sm: Layout[];
    xs: Layout[];
    xxs: Layout[];
  };
  const [layoutState, setLayoutState] = useState<{
    layouts: DashboardLayouts;
    layoutsReady: boolean;
  }>({
    layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
    layoutsReady: false,
  });
  const { layouts, layoutsReady } = layoutState;
  const [staticGridReady, dispatchStaticGridReady] = useReducer(
    (_state: boolean, nextReady: boolean) => nextReady,
    false
  );
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<BreakpointKey>('lg');
  const [isGridResizing, setIsGridResizing] = useState(false);
  const [resizeLockedHeight, setResizeLockedHeight] = useState<number | null>(
    null
  );
  const layoutSaveTimeoutRef = useRef<number | null>(null);
  const latestLayoutChangeRef = useRef<{
    currentLayout: Layout[];
    allLayouts: { [key: string]: Layout[] };
  } | null>(null);
  const activeDragItemIdRef = useRef<string | null>(null);
  const dragStartItemRef = useRef<Layout | null>(null);
  const isResizeActiveRef = useRef(false);
  const persistLayoutChangeRef = useRef<
    | ((
        currentLayout: Layout[],
        allLayouts: { [key: string]: Layout[] }
      ) => void)
    | null
  >(null);

  const handleBreakpointChange = useCallback((breakpoint: string) => {
    if (isBreakpointKey(breakpoint)) {
      setCurrentBreakpoint(breakpoint);
    }
  }, []);

  
  const loadLayouts = useCallback(() => {
    try {
      if (plugin) {
        const activeLayout = getActiveLayout(plugin);

        
        
        const widgetIdSet = new Set(widgets);

        const filteredLg = sanitizeBreakpointLayout(
          activeLayout.bottomSection.lg,
          widgetIdSet
        );

        const filteredMd = sanitizeBreakpointLayout(
          activeLayout.bottomSection.md,
          widgetIdSet
        );

        const filteredSm = sanitizeBreakpointLayout(
          activeLayout.bottomSection.sm,
          widgetIdSet
        );

        const filteredXs = sanitizeBreakpointLayout(
          activeLayout.bottomSection.xs || [],
          widgetIdSet
        );

        const filteredXxs = sanitizeBreakpointLayout(
          activeLayout.bottomSection.xxs || [],
          widgetIdSet
        );

        setLayoutState({
          layouts: fillMissingBreakpointItems({
            layouts: {
              lg: filteredLg,
              md: filteredMd,
              sm: filteredSm,
              xs: filteredXs,
              xxs: filteredXxs,
            },
            widgetIds: widgets,
            getSizing: getDashboardWidgetById,
            savedLgLayouts: getSavedDashboardLgLayouts(plugin),
          }),
          layoutsReady: true,
        });
      }
    } catch (error) {
      console.error('Error loading layouts:', error);
      

      
      const createDefaultLayoutItem = (
        widgetId: string,
        bp: string
      ): Layout => {
        const widgetDef = getDashboardWidgetById(widgetId);
        const maxCols = isBreakpointKey(bp) ? GRID_COLS[bp] : GRID_COLS.lg;
        const defaultWidth =
          bp === 'xxs' ? 1 : Math.min(widgetDef?.defaultSize.w || 6, maxCols);
        const defaultHeight = widgetDef?.defaultSize.h || (bp === 'lg' ? 4 : 3);

        const layoutItem: Layout = {
          i: widgetId,
          x: 0,
          y: 0, 
          w: defaultWidth,
          h: defaultHeight,
        };

        
        return validateLayoutItem(layoutItem);
      };

      
      const defaultLayouts = {
        lg: widgets.map((widgetId) => createDefaultLayoutItem(widgetId, 'lg')),
        md: widgets.map((widgetId) => createDefaultLayoutItem(widgetId, 'md')),
        sm: widgets.map((widgetId) => createDefaultLayoutItem(widgetId, 'sm')),
        xs: widgets.map((widgetId) => createDefaultLayoutItem(widgetId, 'xs')),
        xxs: widgets.map((widgetId) =>
          createDefaultLayoutItem(widgetId, 'xxs')
        ),
      };

      setLayoutState({ layouts: defaultLayouts, layoutsReady: true });
    }
  }, [plugin, widgets]);

  useEffect(() => {
    loadLayouts();
  }, [loadLayouts]);

  const applyPendingExternalLayoutReload = useDashboardLayoutReload(
    loadLayouts,
    {
      activeDragItemId: activeDragItemIdRef,
      isResizeActive: isResizeActiveRef,
      latestLayoutChange: latestLayoutChangeRef,
    }
  );

  const persistLayoutChange = useCallback(
    (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
      const widgetIdSet = new Set(widgets);

      const sanitizedCurrentLayout = sanitizeBreakpointLayout(
        currentLayout,
        widgetIdSet
      );
      const sanitizedAllLayouts = {
        lg: sanitizeBreakpointLayout(allLayouts?.lg, widgetIdSet),
        md: sanitizeBreakpointLayout(allLayouts?.md, widgetIdSet),
        sm: sanitizeBreakpointLayout(allLayouts?.sm, widgetIdSet),
        xs: sanitizeBreakpointLayout(allLayouts?.xs, widgetIdSet),
        xxs: sanitizeBreakpointLayout(allLayouts?.xxs, widgetIdSet),
      };

      
      const layoutChangedEvent = new CustomEvent('layout-changed');
      window.activeDocument.dispatchEvent(layoutChangedEvent);

      if (isEditing && plugin) {
        try {
          
          const currentSettings = getActiveLayout(plugin);

          
          const activeBreakpointKey: BreakpointKey = currentBreakpoint || 'lg';

          const nextLayouts = syncBreakpointsToCurrentLayout({
            layouts: sanitizedAllLayouts,
            currentLayout: sanitizedCurrentLayout,
            activeBreakpoint: activeBreakpointKey,
          });
          const newLayout = {
            ...currentSettings,
            bottomSection: {
              ...currentSettings.bottomSection,
              ...nextLayouts,
            },
          };

          setLayoutState({ layouts: nextLayouts, layoutsReady: true });
          void saveLayout(plugin, newLayout);
        } catch (error) {
          console.error('Error saving layout in handleLayoutChange:', error);
        }
      }
    },
    [currentBreakpoint, isEditing, plugin, widgets]
  );

  useEffect(() => {
    persistLayoutChangeRef.current = persistLayoutChange;
  }, [persistLayoutChange]);

  const flushLayoutChange = useCallback(() => {
    if (!latestLayoutChangeRef.current) return;
    const { currentLayout, allLayouts } = latestLayoutChangeRef.current;
    latestLayoutChangeRef.current = null;
    if (layoutSaveTimeoutRef.current) {
      window.clearTimeout(layoutSaveTimeoutRef.current);
      layoutSaveTimeoutRef.current = null;
    }
    persistLayoutChangeRef.current?.(currentLayout, allLayouts);
  }, []);

  const finalizeLayoutChange = useCallback(
    (options: { applyDragSwap: boolean }) => {
      if (!latestLayoutChangeRef.current) return;

      const { currentLayout, allLayouts } = latestLayoutChangeRef.current;
      const adjustedCurrentLayout = applyVerticalDragSwap(
        currentLayout,
        options.applyDragSwap ? activeDragItemIdRef.current : null,
        options.applyDragSwap ? dragStartItemRef.current : null
      );

      latestLayoutChangeRef.current = {
        currentLayout: adjustedCurrentLayout,
        allLayouts: {
          ...allLayouts,
          [currentBreakpoint]: adjustedCurrentLayout,
        },
      };

      flushLayoutChange();
    },
    [currentBreakpoint, flushLayoutChange]
  );

  useEffect(() => {
    return () => {
      if (layoutSaveTimeoutRef.current) {
        window.clearTimeout(layoutSaveTimeoutRef.current);
        layoutSaveTimeoutRef.current = null;
      }
      if (latestLayoutChangeRef.current) {
        const { currentLayout, allLayouts } = latestLayoutChangeRef.current;
        latestLayoutChangeRef.current = null;
        persistLayoutChangeRef.current?.(currentLayout, allLayouts);
      }
    };
  }, []);

  
  
  
  const handleLayoutChange = (
    currentLayout: Layout[],
    allLayouts: { [key: string]: Layout[] }
  ) => {
    latestLayoutChangeRef.current = {
      currentLayout,
      allLayouts,
    };

    if (activeDragItemIdRef.current || isResizeActiveRef.current) {
      return;
    }

    if (layoutSaveTimeoutRef.current) {
      window.clearTimeout(layoutSaveTimeoutRef.current);
    }

    layoutSaveTimeoutRef.current = window.setTimeout(flushLayoutChange, 160);
  };

  
  
  
  const validatedLayouts = useMemo(() => {
    const validated: Record<BreakpointKey, Layout[]> = {
      lg: [],
      md: [],
      sm: [],
      xs: [],
      xxs: [],
    };

    Object.entries(layouts).forEach(([breakpoint, layoutArray]) => {
      if (!isBreakpointKey(breakpoint)) {
        return;
      }

      validated[breakpoint] = normalizeBottomSentinelRows(
        sanitizeBreakpointLayout(layoutArray),
        LAYOUT_BOTTOM_POSITION
      );
    });

    return validated;
  }, [layouts]);

  useEffect(() => {
    if (isEditing || !layoutsReady || gridWidth <= 0) {
      dispatchStaticGridReady(false);
      return;
    }

    dispatchStaticGridReady(false);
    let secondFrameId: number | null = null;
    const firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        dispatchStaticGridReady(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId !== null) {
        window.cancelAnimationFrame(secondFrameId);
      }
    };
  }, [gridWidth, isEditing, layoutsReady]);

  const handleDragStart = useCallback(
    (_layout: Layout[], _oldItem: Layout | null, newItem: Layout | null) => {
      activeDragItemIdRef.current = newItem?.i ?? null;
      dragStartItemRef.current = newItem ? { ...newItem } : null;
    },
    []
  );

  const handleDragStop = useCallback(() => {
    window.setTimeout(() => {
      if (!applyPendingExternalLayoutReload()) {
        finalizeLayoutChange({ applyDragSwap: true });
      }
      activeDragItemIdRef.current = null;
      dragStartItemRef.current = null;
    }, 0);
  }, [applyPendingExternalLayoutReload, finalizeLayoutChange]);

  const handleResizeStart = useCallback(() => {
    isResizeActiveRef.current = true;
    setIsGridResizing(true);
    setResizeLockedHeight(
      calculateGridPixelHeight(validatedLayouts[currentBreakpoint])
    );
  }, [currentBreakpoint, validatedLayouts]);

  const handleResizeStop = useCallback(() => {
    setIsGridResizing(false);
    setResizeLockedHeight(null);
    window.setTimeout(() => {
      if (!applyPendingExternalLayoutReload()) {
        finalizeLayoutChange({ applyDragSwap: false });
      }
      isResizeActiveRef.current = false;
    }, 0);
    window.requestAnimationFrame(() => {
      window.activeDocument.dispatchEvent(
        new CustomEvent('journalit:chart-resize-resume')
      );
    });
  }, [applyPendingExternalLayoutReload, finalizeLayoutChange]);

  return {
    layoutsReady,
    staticGridReady,
    currentBreakpoint,
    isGridResizing,
    resizeLockedHeight,
    validatedLayouts,
    handleBreakpointChange,
    handleLayoutChange,
    handleDragStart,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
  };
};

export const GridLayout: React.FC<GridLayoutProps> = ({
  isEditing,
  widgets,
  onRemoveWidget,
}) => {
  const plugin = usePlugin();
  const { width: gridWidth, containerRef } = useContainerWidth({
    initialWidth: 0,
  });
  const { dashboardData } = useDashboardData();
  const currencyConversion = buildCurrencyConversionMetadata(
    dashboardData?.metrics
  );
  const {
    layoutsReady,
    staticGridReady,
    isGridResizing,
    resizeLockedHeight,
    validatedLayouts,
    handleBreakpointChange,
    handleLayoutChange,
    handleDragStart,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
  } = useDashboardGridLayoutState({
    plugin,
    widgets,
    isEditing,
    gridWidth,
  });

  const getConversionTradesForWidget = useCallback(
    (widgetId: string) => {
      const trades = dashboardData?.trades || [];
      if (widgetId === 'longPnLChart' || widgetId === 'longDrawdownChart') {
        const scopedTrades = trades.filter(
          (trade) =>
            isPnlContributingTrade(trade) &&
            String(trade.direction || '').toLowerCase() === 'long'
        );
        return scopedTrades.length > 0 ||
          !dashboardData?.metrics.unconvertedCurrencies?.length
          ? scopedTrades
          : undefined;
      }

      if (widgetId === 'shortPnLChart' || widgetId === 'shortDrawdownChart') {
        const scopedTrades = trades.filter(
          (trade) =>
            isPnlContributingTrade(trade) &&
            String(trade.direction || '').toLowerCase() === 'short'
        );
        return scopedTrades.length > 0 ||
          !dashboardData?.metrics.unconvertedCurrencies?.length
          ? scopedTrades
          : undefined;
      }

      return trades;
    },
    [
      dashboardData?.metrics.unconvertedCurrencies?.length,
      dashboardData?.trades,
    ]
  );

  const dateFormat = plugin?.settings?.trade?.dateFormat || getUserDateFormat();

  const staticDashboardWidgetProps = useMemo(
    () => ({
      dateFormat,
      editing: false,
      onRemoveWidget,
      currencyConversion,
      getConversionTradesForWidget,
    }),
    [
      currencyConversion,
      dateFormat,
      getConversionTradesForWidget,
      onRemoveWidget,
    ]
  );

  return (
    <div
      ref={containerRef}
      className={`journalit-dashboard-grid-layout ${isEditing ? 'is-editing' : ''} ${isGridResizing ? 'is-resizing' : ''}`}
    >
      <GridLayoutErrorBoundary isEditing={isEditing}>
        {isEditing && layoutsReady && gridWidth > 0 && (
          <ResponsiveGridLayout
            className="layout"
            style={cssVars({
              '--jit-dashboard-edit-grid-height': resizeLockedHeight
                ? `${resizeLockedHeight}px`
                : undefined,
            })}
            width={gridWidth}
            layouts={validatedLayouts}
            breakpoints={GRID_BREAKPOINTS}
            cols={GRID_COLS}
            allowOverlap={false}
            preventCollision={false}
            rowHeight={GRID_ROW_HEIGHT}
            resizeConfig={{ enabled: true }}
            dragConfig={{
              enabled: true,
              cancel:
                '.journalit-dashboard-widget-remove, .journalit-dashboard-widget-remove *',
            }}
            onLayoutChange={handleLayoutChange}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
            onBreakpointChange={handleBreakpointChange}
            compactor={verticalCompactor}
            containerPadding={[0, 0]}
            margin={[GRID_MARGIN, GRID_MARGIN]}
          >
            {widgets.map((widgetId) => (
              <div key={widgetId}>
                <DashboardGridWidgetCard
                  widgetId={widgetId}
                  dateFormat={dateFormat}
                  editing={true}
                  onRemoveWidget={onRemoveWidget}
                  currencyConversion={currencyConversion}
                  getConversionTradesForWidget={getConversionTradesForWidget}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
        {!isEditing && staticGridReady && (
          <StaticWidgetGrid
            layouts={validatedLayouts}
            widgets={widgets}
            cols={GRID_COLS}
            rowHeight={GRID_ROW_HEIGHT}
            gap={GRID_MARGIN}
            bottomPosition={LAYOUT_BOTTOM_POSITION}
            className="journalit-dashboard-static-grid"
            itemClassName="journalit-dashboard-static-grid-item"
            breakpoints={GRID_BREAKPOINTS}
            mode="absolute"
            initialWidth={gridWidth}
            getDefaultSize={(widgetId) =>
              getDashboardWidgetById(widgetId)?.defaultSize
            }
            WidgetComponent={DashboardGridWidgetCard}
            widgetProps={staticDashboardWidgetProps}
          />
        )}
      </GridLayoutErrorBoundary>
    </div>
  );
};
