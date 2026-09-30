

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react';
import {
  ResponsiveGridLayout,
  type Layout,
  applyVerticalDragSwap,
  normalizeBottomSentinelRows,
  useContainerWidth,
} from '../shared/gridLayout/reactGridLayoutCompat';
import {
  getActiveLayout,
  getSavedHomeLgLayouts,
  saveLayout,
  HomeLayout,
} from './homeLayoutUtils';
import {
  applyWidgetSizeConstraints,
  type BreakpointKey,
  fillMissingBreakpointItems,
  GRID_COLS,
  GRID_ROW_HEIGHT,
  isBreakpointKey,
  LAYOUT_BOTTOM_POSITION,
  normalizeLayoutItem,
  sanitizeLayoutItem,
  syncBreakpointsToCurrentLayout,
} from '../shared/gridLayout/gridLayoutUtils';
import { usePlugin } from '../../hooks/usePlugin';
import { useEventBus } from '../../hooks/useEventBus';
import type JournalitPlugin from '../../main';
import { getHomeWidgetById } from './homeTypes';
import { t } from '../../lang/helpers';
import { DisplayPolicyProvider } from '../../contexts/DisplayPolicyContext';


import { RecentItemsWidget } from './widgets/RecentItemsWidget';
import { YearHeatmapWidget } from './widgets/YearHeatmapWidget';
import { WeeklySummaryWidget } from './widgets/WeeklySummaryWidget';
import { PositionSizeWidget } from './widgets/PositionSizeWidget';
import { EmbeddedNoteWidget } from './widgets/EmbeddedNoteWidget';
import { CurrentStreakWidget } from './widgets/CurrentStreakWidget';
import { BestHoursWidget } from './widgets/BestHoursWidget';
import { SetupLeaderboardWidget } from './widgets/SetupLeaderboardWidget';
import { UnreviewedTradesWidget } from './widgets/UnreviewedTradesWidget';
import { GoalsProgressWidget } from './widgets/GoalsProgressWidget';
import { TradingScoreWidget } from './widgets/TradingScoreWidget';
import { AUMWidget } from './widgets/AUMWidget';
import { DrawdownMonitorWidget } from './widgets/DrawdownMonitorWidget';
import { ProfitTargetWidget } from './widgets/ProfitTargetWidget';
import { EvalRoiWidget } from './widgets/EvalRoiWidget';
import { ChallengeAlertsWidget } from './widgets/ChallengeAlertsWidget';
import { GettingStartedWidget } from './widgets/GettingStartedWidget';
import { KeyEventsHomeWidget } from './widgets/KeyEventsHomeWidget';


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
        <div className="journalit-home-grid-error">
          <h3>{t('home.grid.error.title')}</h3>
          <p>
            {t('home.grid.error.message', {
              error: this.state.error?.message || '',
            })}
          </p>
          <button
            className="journalit-home-grid-error__retry"
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

function isWidgetRemoveEvent(
  event: Event
): event is CustomEvent<{ widgetId?: string }> {
  return event instanceof CustomEvent;
}

const GRID_MARGIN = 12; 


const validateLayoutItem = (item: Layout): Layout =>
  applyWidgetSizeConstraints(
    normalizeLayoutItem(item),
    getHomeWidgetById(item.i)
  );


const validateLayoutsForGrid = (layouts: { [key: string]: Layout[] }) => {
  const validatedLayouts: { [key: string]: Layout[] } = {};

  Object.entries(layouts).forEach(([breakpoint, layoutArray]) => {
    if (!Array.isArray(layoutArray)) {
      validatedLayouts[breakpoint] = [];
      return;
    }

    validatedLayouts[breakpoint] = layoutArray.map((item) => {
      if (!item || typeof item !== 'object') {
        return { i: 'unknown', x: 0, y: 0, w: 1, h: 1 };
      }
      return validateLayoutItem(item);
    });

    validatedLayouts[breakpoint] = normalizeBottomSentinelRows(
      validatedLayouts[breakpoint],
      LAYOUT_BOTTOM_POSITION
    );
  });

  return validatedLayouts;
};

interface HomeGridLayoutProps {
  isEditing: boolean;
  widgets: string[];
  onRemoveWidget: (widgetId: string) => void | Promise<void>;
  tradeCount: number | null;
}

interface HomeResponsiveGridProps {
  isEditing: boolean;
  widgets: string[];
  tradeCount: number | null;
  plugin: JournalitPlugin | null;
  gridWidth: number;
  layouts: { [key: string]: Layout[] };
  onLayoutChange: (
    currentLayout: Layout[],
    allLayouts: { [key: string]: Layout[] }
  ) => void;
  onDragStart: (
    _layout: Layout[],
    _oldItem: Layout | null,
    newItem: Layout | null
  ) => void;
  onDragStop: () => void;
  onResizeStart: () => void;
  onResizeStop: () => void;
  onWidthChange: () => void;
  onBreakpointChange: (breakpoint: string) => void;
}


interface GridWidgetItemProps {
  widgetId: string;
  isEditing: boolean;
  children: React.ReactNode;
}


const GridWidgetItem = memo<GridWidgetItemProps>(
  ({ widgetId, isEditing, children }) => {
    const setRemoveButtonRef = useCallback(
      (button: HTMLButtonElement | null) => {
        if (!button || !isEditing) return;

        button.onclick = (event) => {
          event.stopPropagation();
          
          
          
          window.activeDocument.dispatchEvent(
            new CustomEvent('journalit-home-grid-remove-widget', {
              detail: { widgetId },
            })
          );
        };

        button.onmousedown = (event) => {
          event.preventDefault();
          event.stopPropagation();
        };
      },
      [isEditing, widgetId]
    );

    return (
      <div className="journalit-home-widget">
        {isEditing && (
          <button
            ref={setRemoveButtonRef}
            type="button"
            className="journalit-home-widget-remove"
            aria-label={t('home.grid.widget.remove-aria')}
          >
            ✕
          </button>
        )}
        <div className="journalit-home-widget-content">{children}</div>
      </div>
    );
  }
);
GridWidgetItem.displayName = 'GridWidgetItem';

const HomeWidgetContent: React.FC<{
  widgetId: string;
  plugin: JournalitPlugin | null;
  tradeCount: number | null;
  isEditing: boolean;
}> = ({ widgetId, plugin, tradeCount, isEditing }) => {
  if (!plugin) return null;

  switch (widgetId) {
    case 'recentItems':
      return <RecentItemsWidget plugin={plugin} />;
    case 'yearHeatmap':
      return <YearHeatmapWidget plugin={plugin} />;
    case 'weeklySummary':
      return <WeeklySummaryWidget plugin={plugin} />;
    case 'keyEvents':
      return <KeyEventsHomeWidget plugin={plugin} />;
    case 'positionSize':
      return (
        <DisplayPolicyProvider privacyModeOverride={false}>
          <PositionSizeWidget plugin={plugin} />
        </DisplayPolicyProvider>
      );
    case 'currentStreak':
      return (
        <CurrentStreakWidget
          plugin={plugin}
          instanceId={widgetId}
          isEditing={isEditing}
        />
      );
    case 'bestHours':
      return <BestHoursWidget />;
    case 'setupLeaderboard':
      return (
        <SetupLeaderboardWidget plugin={plugin} instanceId="setupLeaderboard" />
      );
    case 'unreviewedTrades':
      return <UnreviewedTradesWidget plugin={plugin} />;
    case 'tradingScore':
      return <TradingScoreWidget />;
    case 'aum':
      return <AUMWidget plugin={plugin} />;
    case 'drawdownMonitor':
      return (
        <DrawdownMonitorWidget
          plugin={plugin}
          instanceId={widgetId}
          isEditing={isEditing}
        />
      );
    case 'profitTarget':
      return (
        <ProfitTargetWidget
          plugin={plugin}
          instanceId={widgetId}
          isEditing={isEditing}
        />
      );
    case 'evalRoi':
      return <EvalRoiWidget plugin={plugin} />;
    case 'challengeAlerts':
      return <ChallengeAlertsWidget plugin={plugin} />;
    case 'gettingStarted':
      return <GettingStartedWidget plugin={plugin} tradeCount={tradeCount} />;
    default:
      if (widgetId.startsWith('embeddedNote-')) {
        return <EmbeddedNoteWidget plugin={plugin} instanceId={widgetId} />;
      }
      if (widgetId.startsWith('currentStreak-')) {
        return (
          <CurrentStreakWidget
            plugin={plugin}
            instanceId={widgetId}
            isEditing={isEditing}
          />
        );
      }
      if (widgetId.startsWith('goalsProgress-')) {
        return <GoalsProgressWidget plugin={plugin} instanceId={widgetId} />;
      }
      if (widgetId.startsWith('setupLeaderboard-')) {
        return <SetupLeaderboardWidget plugin={plugin} instanceId={widgetId} />;
      }
      return (
        <div className="journalit-home-widget-error">
          {t('home.grid.widget.unknown-type', { widgetId })}
        </div>
      );
  }
};

const HomeResponsiveGrid: React.FC<HomeResponsiveGridProps> = ({
  isEditing,
  widgets,
  tradeCount,
  plugin,
  gridWidth,
  layouts,
  onLayoutChange,
  onDragStart,
  onDragStop,
  onResizeStart,
  onResizeStop,
  onWidthChange,
  onBreakpointChange,
}) => {
  return (
    <ResponsiveGridLayout
      className="layout"
      width={gridWidth}
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={GRID_COLS}
      allowOverlap={false}
      preventCollision={false}
      rowHeight={GRID_ROW_HEIGHT}
      isDraggable={isEditing}
      isResizable={isEditing}
      draggableCancel=".journalit-home-widget-remove, .journalit-home-widget-remove *"
      resizeConfig={{ enabled: isEditing }}
      dragConfig={{
        enabled: isEditing,
        cancel:
          '.journalit-home-widget-remove, .journalit-home-widget-remove *',
      }}
      onLayoutChange={onLayoutChange}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
      onWidthChange={onWidthChange}
      onBreakpointChange={onBreakpointChange}
      compactType={isEditing ? null : 'vertical'}
      containerPadding={[0, 0]}
      margin={[GRID_MARGIN, GRID_MARGIN]}
    >
      {widgets.map((widgetId) => (
        <div key={widgetId}>
          <GridWidgetItem widgetId={widgetId} isEditing={isEditing}>
            <HomeWidgetContent
              widgetId={widgetId}
              plugin={plugin}
              tradeCount={tradeCount}
              isEditing={isEditing}
            />
          </GridWidgetItem>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

HomeResponsiveGrid.displayName = 'HomeResponsiveGrid';


const computeLayoutsFromSettings = (
  plugin: JournalitPlugin | null,
  widgets: string[]
): {
  lg: Layout[];
  md: Layout[];
  sm: Layout[];
  xs: Layout[];
  xxs: Layout[];
} => {
  const emptyLayouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };

  if (!plugin) return emptyLayouts;

  try {
    const activeLayout = getActiveLayout(plugin);
    const widgetIds = new Set(widgets);
    const activeWidgetItems = (items: Layout[] | undefined): Layout[] =>
      (items ?? []).reduce<Layout[]>((acc, item) => {
        if (widgetIds.has(item.i)) {
          acc.push(validateLayoutItem(item));
        }
        return acc;
      }, []);

    return fillMissingBreakpointItems({
      layouts: {
        lg: activeWidgetItems(activeLayout.lg),
        md: activeWidgetItems(activeLayout.md),
        sm: activeWidgetItems(activeLayout.sm),
        xs: activeWidgetItems(activeLayout.xs),
        xxs: activeWidgetItems(activeLayout.xxs),
      },
      widgetIds: widgets,
      getSizing: getHomeWidgetById,
      savedLgLayouts: getSavedHomeLgLayouts(plugin),
    });
  } catch (error) {
    console.error('Error computing layouts:', error);
    const createDefaultLayoutItem = (widgetId: string, bp: string): Layout => {
      const widgetDef = getHomeWidgetById(widgetId);
      const maxCols = isBreakpointKey(bp) ? GRID_COLS[bp] : GRID_COLS.lg;
      const defaultWidth =
        bp === 'xxs' ? 1 : Math.min(widgetDef?.defaultSize.w || 6, maxCols);
      const defaultHeight = widgetDef?.defaultSize.h || 4;
      return validateLayoutItem({
        i: widgetId,
        x: 0,
        y: 0,
        w: defaultWidth,
        h: defaultHeight,
      });
    };

    return {
      lg: widgets.map((widgetId) => createDefaultLayoutItem(widgetId, 'lg')),
      md: widgets.map((widgetId) => createDefaultLayoutItem(widgetId, 'md')),
      sm: widgets.map((widgetId) => createDefaultLayoutItem(widgetId, 'sm')),
      xs: widgets.map((widgetId) => createDefaultLayoutItem(widgetId, 'xs')),
      xxs: widgets.map((widgetId) => createDefaultLayoutItem(widgetId, 'xxs')),
    };
  }
};

function useHomeGridLayoutPersistence({
  currentBreakpoint,
  isEditing,
  plugin,
}: {
  currentBreakpoint: BreakpointKey;
  isEditing: boolean;
  plugin: JournalitPlugin | null;
}) {
  const [isGridResizing, setIsGridResizing] = useState(false);
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

  const persistLayoutChange = useCallback(
    (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
      const sanitizedCurrentLayout =
        currentLayout?.reduce<Layout[]>((acc, item) => {
          const sanitized = sanitizeLayoutItem(item);
          if (sanitized !== null) {
            acc.push(sanitized);
          }
          return acc;
        }, []) || [];
      const sanitizedAllLayouts = Object.fromEntries(
        Object.entries(allLayouts || {}).map(([key, layout]) => [
          key,
          layout?.reduce<Layout[]>((acc, item) => {
            const sanitized = sanitizeLayoutItem(item);
            if (sanitized !== null) {
              acc.push(sanitized);
            }
            return acc;
          }, []) || [],
        ])
      );

      window.activeDocument.dispatchEvent(new CustomEvent('layout-changed'));

      if (!isEditing || !plugin) return;

      try {
        const activeBreakpointKey: BreakpointKey = currentBreakpoint || 'lg';
        const newLayout: HomeLayout = syncBreakpointsToCurrentLayout({
          layouts: {
            lg: sanitizedAllLayouts.lg || [],
            md: sanitizedAllLayouts.md || [],
            sm: sanitizedAllLayouts.sm || [],
            xs: sanitizedAllLayouts.xs || [],
            xxs: sanitizedAllLayouts.xxs || [],
          },
          currentLayout: sanitizedCurrentLayout,
          activeBreakpoint: activeBreakpointKey,
        });

        void saveLayout(plugin, newLayout);
      } catch (error) {
        console.error('Error saving layout in handleLayoutChange:', error);
      }
    },
    [currentBreakpoint, isEditing, plugin]
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

  const handleLayoutChange = useCallback(
    (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
      latestLayoutChangeRef.current = { currentLayout, allLayouts };

      if (activeDragItemIdRef.current || isResizeActiveRef.current) return;

      if (layoutSaveTimeoutRef.current) {
        window.clearTimeout(layoutSaveTimeoutRef.current);
      }

      layoutSaveTimeoutRef.current = window.setTimeout(flushLayoutChange, 160);
    },
    [flushLayoutChange]
  );

  const handleDragStart = useCallback(
    (_layout: Layout[], _oldItem: Layout | null, newItem: Layout | null) => {
      activeDragItemIdRef.current = newItem?.i ?? null;
      dragStartItemRef.current = newItem ? { ...newItem } : null;
    },
    []
  );

  const handleDragStop = useCallback(() => {
    window.setTimeout(() => {
      finalizeLayoutChange({ applyDragSwap: true });
      activeDragItemIdRef.current = null;
      dragStartItemRef.current = null;
    }, 0);
  }, [finalizeLayoutChange]);

  const handleResizeStart = useCallback(() => {
    isResizeActiveRef.current = true;
    setIsGridResizing(true);
  }, []);

  const handleResizeStop = useCallback(() => {
    setIsGridResizing(false);
    window.setTimeout(() => {
      finalizeLayoutChange({ applyDragSwap: false });
      isResizeActiveRef.current = false;
    }, 0);
    window.requestAnimationFrame(() => {
      window.activeDocument.dispatchEvent(
        new CustomEvent('journalit:chart-resize-resume')
      );
    });
  }, [finalizeLayoutChange]);

  return {
    handleDragStart,
    handleDragStop,
    handleLayoutChange,
    handleResizeStart,
    handleResizeStop,
    isGridResizing,
  };
}


const HomeGridLayoutBase: React.FC<HomeGridLayoutProps> = ({
  isEditing,
  widgets,
  onRemoveWidget,
  tradeCount,
}) => {
  const plugin = usePlugin();
  const [locallyRemovedWidgets, setLocallyRemovedWidgets] = useState<
    ReadonlySet<string>
  >(() => new Set());
  const visibleWidgets = useMemo(
    () => widgets.filter((widgetId) => !locallyRemovedWidgets.has(widgetId)),
    [locallyRemovedWidgets, widgets]
  );
  const visibleWidgetsKey = visibleWidgets.join('\u0000');
  const { width: gridWidth, containerRef } = useContainerWidth({
    initialWidth: 0,
  });

  
  
  type HomeLayouts = {
    lg: Layout[];
    md: Layout[];
    sm: Layout[];
    xs: Layout[];
    xxs: Layout[];
  };
  const [layoutState, setLayoutState] = useState<{
    plugin: typeof plugin;
    visibleWidgetsKey: string;
    layouts: HomeLayouts;
  }>(() => ({
    plugin,
    visibleWidgetsKey,
    layouts: computeLayoutsFromSettings(plugin, visibleWidgets),
  }));
  const layouts =
    layoutState.plugin === plugin &&
    layoutState.visibleWidgetsKey === visibleWidgetsKey
      ? layoutState.layouts
      : computeLayoutsFromSettings(plugin, visibleWidgets);
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<BreakpointKey>('lg');
  const {
    handleDragStart,
    handleDragStop,
    handleLayoutChange,
    handleResizeStart,
    handleResizeStop,
    isGridResizing,
  } = useHomeGridLayoutPersistence({
    currentBreakpoint,
    isEditing,
    plugin,
  });

  
  const handleWidthChange = useCallback(() => {}, []);

  const handleBreakpointChange = useCallback((breakpoint: string) => {
    if (isBreakpointKey(breakpoint)) {
      setCurrentBreakpoint(breakpoint);
    }
  }, []);

  
  const reloadLayouts = useCallback(() => {
    setLayoutState({
      plugin,
      visibleWidgetsKey,
      layouts: computeLayoutsFromSettings(plugin, visibleWidgets),
    });
  }, [plugin, visibleWidgets, visibleWidgetsKey]);

  
  const handleLayoutChanged = useCallback(
    (payload: { view?: string }) => {
      if (payload.view === 'home') {
        reloadLayouts();
      }
    },
    [reloadLayouts]
  );

  
  useEventBus('layout:changed', handleLayoutChanged);

  
  useEffect(() => {
    setLocallyRemovedWidgets((current) => {
      const widgetsSet6 = new Set(widgets);
      const next = new Set(
        [...current].filter((widgetId) => widgetsSet6.has(widgetId))
      );
      return next.size === current.size ? current : next;
    });
  }, [widgets]);

  const handleRemoveWidget = useCallback(
    (widgetId: string) => {
      setLocallyRemovedWidgets((current) => {
        if (current.has(widgetId)) return current;
        return new Set([...current, widgetId]);
      });
      window.setTimeout(() => void onRemoveWidget(widgetId), 400);
    },
    [onRemoveWidget]
  );

  useEffect(() => {
    const handleGridRemoveWidget = (event: Event) => {
      if (!isWidgetRemoveEvent(event)) return;
      const widgetId = event.detail?.widgetId;
      if (!widgetId) return;
      handleRemoveWidget(widgetId);
    };

    window.activeDocument.addEventListener(
      'journalit-home-grid-remove-widget',
      handleGridRemoveWidget
    );
    return () => {
      window.activeDocument.removeEventListener(
        'journalit-home-grid-remove-widget',
        handleGridRemoveWidget
      );
    };
  }, [handleRemoveWidget]);

  const validatedLayouts = validateLayoutsForGrid(layouts);

  return (
    <div
      ref={containerRef}
      className={`journalit-home-grid-layout ${isEditing ? 'is-editing' : ''} ${isGridResizing ? 'is-resizing' : ''}`}
    >
      <GridLayoutErrorBoundary isEditing={isEditing}>
        {gridWidth > 0 && (
          <HomeResponsiveGrid
            isEditing={isEditing}
            widgets={visibleWidgets}
            tradeCount={tradeCount}
            plugin={plugin}
            gridWidth={gridWidth}
            layouts={validatedLayouts}
            onLayoutChange={handleLayoutChange}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
            onWidthChange={handleWidthChange}
            onBreakpointChange={handleBreakpointChange}
          />
        )}
      </GridLayoutErrorBoundary>
    </div>
  );
};

export const HomeGridLayout = React.memo(HomeGridLayoutBase);
HomeGridLayout.displayName = 'HomeGridLayout';
