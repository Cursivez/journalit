

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
  saveLayout,
  LAYOUT_BOTTOM_POSITION,
  HomeLayout,
} from './homeLayoutUtils';
import { sanitizeLayoutItem } from '../shared/gridLayout/gridLayoutUtils';
import {
  GRID_COLS as SHARED_GRID_COLS,
  GRID_ROW_HEIGHT as SHARED_GRID_ROW_HEIGHT,
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
import { GettingStartedWidget } from './widgets/GettingStartedWidget';


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


const findBestWidgetPosition = (
  layouts: Layout[],
  widgetId: string,
  defaultW: number,
  defaultH: number,
  pluginInstance: JournalitPlugin | null
) => {
  const widgetDef = getHomeWidgetById(widgetId);
  const constraints: Partial<Layout> = {};
  if (widgetDef?.maxSize) {
    constraints.minW = widgetDef.minSize.w;
    constraints.minH = widgetDef.minSize.h;
    constraints.maxW = widgetDef.maxSize.w;
    constraints.maxH = widgetDef.maxSize.h;
  }

  if (!layouts || layouts.length === 0) {
    return {
      i: widgetId,
      x: 0,
      y: 0,
      w: defaultW,
      h: defaultH,
      ...constraints,
    };
  }

  if (pluginInstance) {
    try {
      const allLayouts = pluginInstance.settings?.home?.layouts || {};

      for (const layoutName in allLayouts) {
        const layout = allLayouts[layoutName];
        if (!layout) continue;
        const lgLayout = layout.lg || [];

        let existingWidget: Layout | undefined;
        for (const item of lgLayout) {
          if (item.i === widgetId) {
            existingWidget = item;
            break;
          }
        }
        if (existingWidget) {
          const w = widgetDef?.maxSize
            ? Math.max(
                widgetDef.minSize.w,
                Math.min(existingWidget.w, widgetDef.maxSize.w)
              )
            : existingWidget.w;
          const h = widgetDef?.maxSize
            ? Math.max(
                widgetDef.minSize.h,
                Math.min(existingWidget.h, widgetDef.maxSize.h)
              )
            : existingWidget.h;
          const result = {
            i: widgetId,
            x: 0,
            y: LAYOUT_BOTTOM_POSITION,
            w,
            h,
            ...constraints,
          };
          return result;
        }
      }
    } catch (error) {
      console.error('Error finding previous layout:', error);
    }
  }

  let maxY = 0;
  layouts.forEach((item: Layout) => {
    const y = typeof item.y === 'number' ? item.y : 0;
    const h = typeof item.h === 'number' ? item.h : 1;
    const itemBottom = y + h;
    if (itemBottom > maxY) {
      maxY = itemBottom;
    }
  });

  const result = {
    i: widgetId,
    x: 0,
    y: maxY,
    w: defaultW,
    h: defaultH,
    ...constraints,
  };
  return result;
};



type BreakpointKey = 'lg' | 'md' | 'sm' | 'xs' | 'xxs';

function isBreakpointKey(value: string): value is BreakpointKey {
  switch (value) {
    case 'lg':
    case 'md':
    case 'sm':
    case 'xs':
    case 'xxs':
      return true;
    default:
      return false;
  }
}

function isWidgetRemoveEvent(
  event: Event
): event is CustomEvent<{ widgetId?: string }> {
  return event instanceof CustomEvent;
}


const GRID_ROW_HEIGHT = SHARED_GRID_ROW_HEIGHT;
const GRID_MARGIN = 12; 
const GRID_COLS = SHARED_GRID_COLS;


const validateLayoutItem = (item: Layout): Layout => {
  const widgetDef = getHomeWidgetById(item.i);

  const validated: Layout = {
    ...item,
    i: typeof item.i === 'string' ? item.i : 'unknown',
    x: typeof item.x === 'number' && isFinite(item.x) ? item.x : 0,
    y:
      typeof item.y === 'number' && isFinite(item.y)
        ? item.y === Infinity || item.y === 10000000 || item.y === 10000
          ? LAYOUT_BOTTOM_POSITION
          : item.y
        : item.y === Infinity
          ? LAYOUT_BOTTOM_POSITION
          : 0,
    w:
      typeof item.w === 'number' && isFinite(item.w) && item.w > 0 ? item.w : 1,
    h:
      typeof item.h === 'number' && isFinite(item.h) && item.h > 0 ? item.h : 1,
  };

  if (widgetDef?.maxSize) {
    validated.minW = item.minW ?? widgetDef.minSize.w;
    validated.minH = item.minH ?? widgetDef.minSize.h;
    validated.maxW = item.maxW ?? widgetDef.maxSize.w;
    validated.maxH = item.maxH ?? widgetDef.maxSize.h;
    validated.w = Math.max(
      validated.minW,
      Math.min(validated.w, validated.maxW)
    );
    validated.h = Math.max(
      validated.minH,
      Math.min(validated.h, validated.maxH)
    );
  }

  return validated;
};


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
  plugin: JournalitPlugin | null;
  children: React.ReactNode;
}


const GridWidgetItem = memo<GridWidgetItemProps>(
  ({ widgetId, isEditing, plugin, children }) => {
    const setRemoveButtonRef = useCallback(
      (button: HTMLButtonElement | null) => {
        if (!button || !isEditing) return;

        button.onclick = (event) => {
          event.stopPropagation();
          if (!plugin?.settings.home) return;
          const currentLayoutName =
            plugin.settings.home.activeLayout || 'Default';
          const currentLayouts =
            plugin.settings.home.layouts[currentLayoutName];
          if (!currentLayouts) return;

          const prunedLayout: HomeLayout = {
            lg: currentLayouts.lg?.filter((item) => item.i !== widgetId) || [],
            md: currentLayouts.md?.filter((item) => item.i !== widgetId) || [],
            sm: currentLayouts.sm?.filter((item) => item.i !== widgetId) || [],
            xs: currentLayouts.xs?.filter((item) => item.i !== widgetId) || [],
            xxs:
              currentLayouts.xxs?.filter((item) => item.i !== widgetId) || [],
          };
          window.setTimeout(() => {
            void saveLayout(plugin, currentLayoutName, prunedLayout);
          }, 400);
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
      [isEditing, plugin, widgetId]
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
}> = ({ widgetId, plugin, tradeCount }) => {
  if (!plugin) return null;

  switch (widgetId) {
    case 'recentItems':
      return <RecentItemsWidget plugin={plugin} />;
    case 'yearHeatmap':
      return <YearHeatmapWidget plugin={plugin} />;
    case 'weeklySummary':
      return <WeeklySummaryWidget plugin={plugin} />;
    case 'positionSize':
      return (
        <DisplayPolicyProvider privacyModeOverride={false}>
          <PositionSizeWidget plugin={plugin} />
        </DisplayPolicyProvider>
      );
    case 'currentStreak':
      return <CurrentStreakWidget plugin={plugin} />;
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
      return <DrawdownMonitorWidget plugin={plugin} />;
    case 'profitTarget':
      return <ProfitTargetWidget plugin={plugin} />;
    case 'gettingStarted':
      return <GettingStartedWidget plugin={plugin} tradeCount={tradeCount} />;
    default:
      if (widgetId.startsWith('embeddedNote-')) {
        return <EmbeddedNoteWidget plugin={plugin} instanceId={widgetId} />;
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
}) => (
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
      cancel: '.journalit-home-widget-remove, .journalit-home-widget-remove *',
    }}
    onLayoutChange={onLayoutChange}
    onDragStart={onDragStart}
    onDragStop={onDragStop}
    onResizeStart={onResizeStart}
    onResizeStop={onResizeStop}
    onWidthChange={onWidthChange}
    onBreakpointChange={onBreakpointChange}
    compactType={isEditing ? null : 'vertical'}
    containerPadding={[0, 12]}
    margin={[GRID_MARGIN, GRID_MARGIN]}
  >
    {widgets.map((widgetId) => (
      <div key={widgetId}>
        <GridWidgetItem
          widgetId={widgetId}
          isEditing={isEditing}
          plugin={plugin}
        >
          <HomeWidgetContent
            widgetId={widgetId}
            plugin={plugin}
            tradeCount={tradeCount}
          />
        </GridWidgetItem>
      </div>
    ))}
  </ResponsiveGridLayout>
);

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

    const filteredLg = (activeLayout.lg || [])
      .filter((item: Layout) => widgets.includes(item.i))
      .map(validateLayoutItem);

    const filteredMd = (activeLayout.md || [])
      .filter((item: Layout) => widgets.includes(item.i))
      .map(validateLayoutItem);

    const filteredSm = (activeLayout.sm || [])
      .filter((item: Layout) => widgets.includes(item.i))
      .map(validateLayoutItem);

    const filteredXs = (activeLayout.xs || [])
      .filter((item: Layout) => widgets.includes(item.i))
      .map(validateLayoutItem);

    const filteredXxs = (activeLayout.xxs || [])
      .filter((item: Layout) => widgets.includes(item.i))
      .map(validateLayoutItem);

    const cols = GRID_COLS;

    widgets.forEach((widgetId) => {
      const inLg = filteredLg.some((item: Layout) => item.i === widgetId);
      const inMd = filteredMd.some((item: Layout) => item.i === widgetId);
      const inSm = filteredSm.some((item: Layout) => item.i === widgetId);
      const inXs = filteredXs.some((item: Layout) => item.i === widgetId);
      const inXxs = filteredXxs.some((item: Layout) => item.i === widgetId);

      if (!inLg || !inMd || !inSm || !inXs || !inXxs) {
        const widgetDef = getHomeWidgetById(widgetId);
        if (widgetDef) {
          let sourceItem: Layout | undefined;

          if (inLg)
            sourceItem = filteredLg.find((item: Layout) => item.i === widgetId);
          else if (inMd)
            sourceItem = filteredMd.find((item: Layout) => item.i === widgetId);
          else if (inSm)
            sourceItem = filteredSm.find((item: Layout) => item.i === widgetId);
          else if (inXs)
            sourceItem = filteredXs.find((item: Layout) => item.i === widgetId);
          else if (inXxs)
            sourceItem = filteredXxs.find(
              (item: Layout) => item.i === widgetId
            );

          if (!sourceItem) {
            sourceItem = findBestWidgetPosition(
              filteredLg,
              widgetId,
              widgetDef.defaultSize.w,
              widgetDef.defaultSize.h,
              plugin
            );
          }

          if (!inLg) {
            const lgItem = findBestWidgetPosition(
              filteredLg,
              widgetId,
              Math.min(sourceItem.w, cols.lg),
              sourceItem.h,
              plugin
            );
            filteredLg.push(lgItem);
          }
          if (!inMd)
            filteredMd.push({
              i: widgetId,
              x: 0,
              y: LAYOUT_BOTTOM_POSITION,
              w: Math.min(sourceItem.w, cols.md),
              h: sourceItem.h,
            });
          if (!inSm)
            filteredSm.push({
              i: widgetId,
              x: 0,
              y: LAYOUT_BOTTOM_POSITION,
              w: Math.min(sourceItem.w, cols.sm),
              h: sourceItem.h,
            });
          if (!inXs)
            filteredXs.push({
              i: widgetId,
              x: 0,
              y: LAYOUT_BOTTOM_POSITION,
              w: Math.min(sourceItem.w, cols.xs),
              h: sourceItem.h,
            });
          if (!inXxs)
            filteredXxs.push({
              i: widgetId,
              x: 0,
              y: LAYOUT_BOTTOM_POSITION,
              w: cols.xxs,
              h: sourceItem.h,
            });
        }
      }
    });

    return {
      lg: filteredLg,
      md: filteredMd,
      sm: filteredSm,
      xs: filteredXs,
      xxs: filteredXxs,
    };
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
        currentLayout
          ?.map(sanitizeLayoutItem)
          .filter((item): item is Layout => item !== null) || [];
      const sanitizedAllLayouts = Object.fromEntries(
        Object.entries(allLayouts || {}).map(([key, layout]) => [
          key,
          layout
            ?.map(sanitizeLayoutItem)
            .filter((item): item is Layout => item !== null) || [],
        ])
      );

      window.activeDocument.dispatchEvent(new CustomEvent('layout-changed'));

      if (!isEditing || !plugin) return;

      try {
        const activeBreakpointKey: BreakpointKey = currentBreakpoint || 'lg';
        const currentWidgetIds = sanitizedCurrentLayout.map((item) => item.i);
        const newLayout: HomeLayout = {
          lg: sanitizedAllLayouts.lg || [],
          md: sanitizedAllLayouts.md || [],
          sm: sanitizedAllLayouts.sm || [],
          xs: sanitizedAllLayouts.xs || [],
          xxs: sanitizedAllLayouts.xxs || [],
        };
        const allBreakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'] as const;

        allBreakpoints.forEach((bp) => {
          if (bp === activeBreakpointKey) return;

          const bpLayout = newLayout[bp];
          const bpWidgetIds = bpLayout.map((item: Layout) => item.i);
          newLayout[bp] = bpLayout.filter((item: Layout) =>
            currentWidgetIds.includes(item.i)
          );

          currentWidgetIds.forEach((widgetId) => {
            if (bpWidgetIds.includes(widgetId)) return;

            const currentItem = sanitizedCurrentLayout.find(
              (item) => item.i === widgetId
            );
            if (!currentItem) return;

            newLayout[bp].push({
              i: widgetId,
              x: 0,
              y: LAYOUT_BOTTOM_POSITION,
              w: Math.min(
                Math.max(
                  1,
                  Math.floor(
                    (currentItem.w * GRID_COLS[bp]) /
                      GRID_COLS[activeBreakpointKey]
                  )
                ),
                GRID_COLS[bp]
              ),
              h: currentItem.h,
            });
          });
        });

        void saveLayout(plugin, 'Default', newLayout);
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
  const {
    width: gridWidth,
    containerRef,
    mounted: gridWidthMeasured,
  } = useContainerWidth({
    initialWidth: 0,
  });

  
  
  const [layouts, setLayouts] = useState<{
    lg: Layout[];
    md: Layout[];
    sm: Layout[];
    xs: Layout[];
    xxs: Layout[];
  }>(() => computeLayoutsFromSettings(plugin, visibleWidgets));
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
    setLayouts(computeLayoutsFromSettings(plugin, visibleWidgets));
  }, [plugin, visibleWidgets]);

  
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
      const next = new Set(
        [...current].filter((widgetId) => widgets.includes(widgetId))
      );
      return next.size === current.size ? current : next;
    });
  }, [widgets]);

  useEffect(() => {
    setLayouts(computeLayoutsFromSettings(plugin, visibleWidgets));
  }, [plugin, visibleWidgets]);

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
        {gridWidthMeasured && gridWidth > 0 && (
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
