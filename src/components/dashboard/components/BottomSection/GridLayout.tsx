

import React, {
  useCallback,
  useEffect,
  useMemo,
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
import { FilterState } from '../../DashboardView';
import {
  getActiveLayout,
  saveLayout,
  LAYOUT_BOTTOM_POSITION,
} from '../../utils/layoutUtils';
import { usePlugin } from '../../../../hooks/usePlugin';
import type JournalitPlugin from '../../../../main';
import { getUserDateFormat } from '../../../../utils/dateUtils';
import { AVAILABLE_WIDGETS, type WidgetDefinition } from './types';
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


export const findBestWidgetPosition = (
  layouts: Layout[],
  widgetId: string,
  defaultW: number,
  defaultH: number,
  pluginInstance: JournalitPlugin | null
) => {
  
  const widgetDef = AVAILABLE_WIDGETS.find((w) => w.id === widgetId);
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
      
      const allLayouts = pluginInstance.settings?.dashboard?.layouts || {};

      
      for (const layoutName in allLayouts) {
        const layout = allLayouts[layoutName];
        if (!layout) continue;
        const lgLayout = layout.bottomSection?.lg || [];

        
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
                constraints.minW as number,
                Math.min(existingWidget.w, constraints.maxW as number)
              )
            : existingWidget.w;
          const h = widgetDef?.maxSize
            ? Math.max(
                constraints.minH as number,
                Math.min(existingWidget.h, constraints.maxH as number)
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


import { PnLChart } from '../DashboardWidgets/PnLChart';
import { DirectionalPnLChart } from '../DashboardWidgets/DirectionalPnLChart';
import { PerformanceCalendar } from '../DashboardWidgets/PerformanceCalendar';
import { DailyPerformanceChart } from '../DashboardWidgets/DailyPerformanceChart';
import { TradesChart } from '../DashboardWidgets/TradesChart';
import { DrawdownChart } from '../DashboardWidgets/DrawdownChart';
import { DirectionalDrawdownChart } from '../DashboardWidgets/DirectionalDrawdownChart';
import { RecentTradesWidget } from '../DashboardWidgets/RecentTradesWidget';
import { RollingWinLossRatioChart } from '../DashboardWidgets/RollingWinLossRatioChart';
import { RollingStatsChart } from '../DashboardWidgets/RollingStatsChart';
import { WeekdayPerformanceChart } from '../DashboardWidgets/WeekdayPerformanceChart';
import { HourlyPerformanceChart } from '../DashboardWidgets/HourlyPerformanceChart';


type BreakpointKey = 'lg' | 'md' | 'sm' | 'xs' | 'xxs';


const GRID_ROW_HEIGHT = 50;
const GRID_MARGIN = 4;
const GRID_COLS: Record<BreakpointKey, number> = {
  lg: 12,
  md: 6,
  sm: 4,
  xs: 2,
  xxs: 1,
};

const GRID_BREAKPOINTS: Record<BreakpointKey, number> = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};

const VALID_BREAKPOINTS: BreakpointKey[] = ['lg', 'md', 'sm', 'xs', 'xxs'];

const calculateGridPixelHeight = (layout: Layout[]): number => {
  const rowCount = layout.reduce(
    (max, item) => Math.max(max, item.y + item.h),
    0
  );

  if (rowCount <= 0) return 0;
  return rowCount * GRID_ROW_HEIGHT + Math.max(0, rowCount - 1) * GRID_MARGIN;
};



const WIDGETS_WITH_HEADERS = [
  'pnlChart',
  'longPnLChart',
  'shortPnLChart',
  'drawdownChart',
  'longDrawdownChart',
  'shortDrawdownChart',
];

interface GridLayoutProps {
  filters: FilterState;
  isEditing: boolean;
  widgets: string[];
  onRemoveWidget: (widgetId: string) => void;
}

interface DashboardWidgetRendererProps {
  widgetId: string;
  filters: FilterState;
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

const DashboardWidgetRenderer: React.FC<DashboardWidgetRendererProps> = ({
  widgetId,
  filters,
  dateFormat,
}) => {
  switch (widgetId) {
    case 'pnlChart':
      return <PnLChart filters={filters} dateFormat={dateFormat} />;
    case 'longPnLChart':
      return (
        <DirectionalPnLChart
          filters={filters}
          dateFormat={dateFormat}
          direction="long"
        />
      );
    case 'shortPnLChart':
      return (
        <DirectionalPnLChart
          filters={filters}
          dateFormat={dateFormat}
          direction="short"
        />
      );
    case 'performanceCalendar':
      return <PerformanceCalendar filters={filters} dateFormat={dateFormat} />;
    case 'dailyPerformance':
      return (
        <DailyPerformanceChart filters={filters} dateFormat={dateFormat} />
      );
    case 'tradesChart':
      return <TradesChart filters={filters} dateFormat={dateFormat} />;
    case 'drawdownChart':
      return <DrawdownChart filters={filters} dateFormat={dateFormat} />;
    case 'longDrawdownChart':
      return (
        <DirectionalDrawdownChart
          filters={filters}
          dateFormat={dateFormat}
          showLong={true}
          showShort={false}
          singleDirectionTitle={t('widget.longDrawdownChart.name')}
          hideInternalTitle={true}
        />
      );
    case 'shortDrawdownChart':
      return (
        <DirectionalDrawdownChart
          filters={filters}
          dateFormat={dateFormat}
          showLong={false}
          showShort={true}
          singleDirectionTitle={t('widget.shortDrawdownChart.name')}
          hideInternalTitle={true}
        />
      );
    case 'recentTrades':
      return <RecentTradesWidget filters={filters} dateFormat={dateFormat} />;
    case 'rollingWinRate':
      return (
        <RollingWinLossRatioChart filters={filters} dateFormat={dateFormat} />
      );
    case 'rollingStats':
      return <RollingStatsChart filters={filters} dateFormat={dateFormat} />;
    case 'weekdayPerformance':
      return (
        <WeekdayPerformanceChart filters={filters} dateFormat={dateFormat} />
      );
    case 'hourlyPerformance':
      return (
        <HourlyPerformanceChart filters={filters} dateFormat={dateFormat} />
      );
    default:
      return (
        <div className="journalit-dashboard-widget-error">
          Widget not implemented: {widgetId}
        </div>
      );
  }
};

const DashboardWidgetCard: React.FC<DashboardWidgetCardProps> = ({
  widgetId,
  filters,
  dateFormat,
  editing,
  onRemoveWidget,
  currencyConversion,
  getConversionTradesForWidget,
}) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveWidget(widgetId);
  };

  const showMinimalHeader = WIDGETS_WITH_HEADERS.includes(widgetId);
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
        <DashboardWidgetRenderer
          widgetId={widgetId}
          filters={filters}
          dateFormat={dateFormat}
        />
      </div>
    </div>
  );
};



const useDashboardGridLayoutState = ({
  plugin,
  widgets,
  isEditing,
  gridWidthMeasured,
  gridWidth,
}: {
  plugin: JournalitPlugin | null;
  widgets: string[];
  isEditing: boolean;
  gridWidthMeasured: boolean;
  gridWidth: number;
}) => {
  const [layouts, setLayouts] = useState<{
    lg: Layout[];
    md: Layout[];
    sm: Layout[];
    xs: Layout[];
    xxs: Layout[];
  }>({
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
  });
  const [layoutsReady, setLayoutsReady] = useState(false);
  const [staticGridReady, setStaticGridReady] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<BreakpointKey>('lg');
  const [isGridResizing, setIsGridResizing] = useState(false);
  const [resizeLockedHeight, setResizeLockedHeight] = useState<number | null>(
    null
  );
  const layoutSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
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
    if (VALID_BREAKPOINTS.includes(breakpoint as BreakpointKey)) {
      setCurrentBreakpoint(breakpoint as BreakpointKey);
    }
  }, []);

  
  const validateLayoutItem = useCallback((item: Layout): Layout => {
    
    const widgetDef = AVAILABLE_WIDGETS.find((w) => w.id === item.i);

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
        typeof item.w === 'number' && isFinite(item.w) && item.w > 0
          ? item.w
          : 1,
      h:
        typeof item.h === 'number' && isFinite(item.h) && item.h > 0
          ? item.h
          : 1,
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
  }, []);

  
  const sanitizeBreakpointLayout = useCallback(
    (
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
    },
    [validateLayoutItem]
  );

  
  useEffect(() => {
    const loadLayouts = () => {
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

          
          const cols = GRID_COLS;

          
          widgets.forEach((widgetId) => {
            
            const inLg = filteredLg.some((item: Layout) => item.i === widgetId);
            const inMd = filteredMd.some((item: Layout) => item.i === widgetId);
            const inSm = filteredSm.some((item: Layout) => item.i === widgetId);
            const inXs = filteredXs.some((item: Layout) => item.i === widgetId);
            const inXxs = filteredXxs.some(
              (item: Layout) => item.i === widgetId
            );

            
            if (!inLg || !inMd || !inSm || !inXs || !inXxs) {
              const widgetDef = AVAILABLE_WIDGETS.find(
                (w: WidgetDefinition) => w.id === widgetId
              );
              if (widgetDef) {
                
                let sourceItem: Layout | undefined;

                
                if (inLg) {
                  sourceItem = filteredLg.find(
                    (item: Layout) => item.i === widgetId
                  );
                } else if (inMd) {
                  sourceItem = filteredMd.find(
                    (item: Layout) => item.i === widgetId
                  );
                } else if (inSm) {
                  sourceItem = filteredSm.find(
                    (item: Layout) => item.i === widgetId
                  );
                } else if (inXs) {
                  sourceItem = filteredXs.find(
                    (item: Layout) => item.i === widgetId
                  );
                } else if (inXxs) {
                  sourceItem = filteredXxs.find(
                    (item: Layout) => item.i === widgetId
                  );
                }

                
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

                if (!inMd) {
                  const mdItem = {
                    i: widgetId,
                    x: 0,
                    y: LAYOUT_BOTTOM_POSITION,
                    w: Math.min(sourceItem.w, cols.md),
                    h: sourceItem.h,
                  };
                  filteredMd.push(mdItem);
                }

                if (!inSm) {
                  const smItem = {
                    i: widgetId,
                    x: 0,
                    y: LAYOUT_BOTTOM_POSITION,
                    w: Math.min(sourceItem.w, cols.sm),
                    h: sourceItem.h,
                  };
                  filteredSm.push(smItem);
                }

                if (!inXs) {
                  const xsItem = {
                    i: widgetId,
                    x: 0,
                    y: LAYOUT_BOTTOM_POSITION,
                    w: Math.min(sourceItem.w, cols.xs),
                    h: sourceItem.h,
                  };
                  filteredXs.push(xsItem);
                }

                if (!inXxs) {
                  const xxsItem = {
                    i: widgetId,
                    x: 0,
                    y: LAYOUT_BOTTOM_POSITION,
                    w: cols.xxs,
                    h: sourceItem.h,
                  };
                  filteredXxs.push(xxsItem);
                }
              }
            }
          });

          
          setLayouts({
            lg: filteredLg,
            md: filteredMd,
            sm: filteredSm,
            xs: filteredXs,
            xxs: filteredXxs,
          });
          setLayoutsReady(true);
        }
      } catch (error) {
        console.error('Error loading layouts:', error);
        

        
        const createDefaultLayoutItem = (
          widgetId: string,
          bp: string
        ): Layout => {
          const widgetDef = AVAILABLE_WIDGETS.find(
            (w: WidgetDefinition) => w.id === widgetId
          );
          const maxCols = GRID_COLS[bp as BreakpointKey];
          const defaultWidth =
            bp === 'xxs' ? 1 : Math.min(widgetDef?.defaultSize.w || 6, maxCols);
          const defaultHeight =
            widgetDef?.defaultSize.h || (bp === 'lg' ? 4 : 3);

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
          lg: widgets.map((widgetId) =>
            createDefaultLayoutItem(widgetId, 'lg')
          ),
          md: widgets.map((widgetId) =>
            createDefaultLayoutItem(widgetId, 'md')
          ),
          sm: widgets.map((widgetId) =>
            createDefaultLayoutItem(widgetId, 'sm')
          ),
          xs: widgets.map((widgetId) =>
            createDefaultLayoutItem(widgetId, 'xs')
          ),
          xxs: widgets.map((widgetId) =>
            createDefaultLayoutItem(widgetId, 'xxs')
          ),
        };

        setLayouts(defaultLayouts);
        setLayoutsReady(true);
      }
    };

    loadLayouts();
  }, [plugin, widgets, sanitizeBreakpointLayout, validateLayoutItem]);

  

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
      document.dispatchEvent(layoutChangedEvent);

      if (isEditing && plugin) {
        try {
          
          const currentSettings = getActiveLayout(plugin);

          
          const activeBreakpointKey: BreakpointKey = currentBreakpoint || 'lg';

          
          const currentWidgetIds = sanitizedCurrentLayout.map((item) => item.i);

          
          const newLayout = {
            ...currentSettings,
            bottomSection: {
              ...currentSettings.bottomSection,
              lg: sanitizedAllLayouts.lg || [],
              md: sanitizedAllLayouts.md || [],
              sm: sanitizedAllLayouts.sm || [],
              xs: sanitizedAllLayouts.xs || [],
              xxs: sanitizedAllLayouts.xxs || [],
            },
          };

          
          const cols = GRID_COLS;

          
          const allBreakpoints = ['lg', 'md', 'sm', 'xs', 'xxs'] as const;

          allBreakpoints.forEach((bp) => {
            
            if (bp === activeBreakpointKey) return;

            
            const bpLayout = newLayout.bottomSection[bp];
            const bpWidgetIds = bpLayout.map((item: Layout) => item.i);

            
            newLayout.bottomSection[bp] = bpLayout.filter((item: Layout) =>
              currentWidgetIds.includes(item.i)
            );

            
            currentWidgetIds.forEach((widgetId) => {
              if (!bpWidgetIds.includes(widgetId)) {
                
                const currentItem = sanitizedCurrentLayout.find(
                  (item) => item.i === widgetId
                );
                if (currentItem) {
                  
                  newLayout.bottomSection[bp].push({
                    i: widgetId,
                    x: 0, 
                    y: LAYOUT_BOTTOM_POSITION, 
                    w: Math.min(
                      Math.max(
                        1,
                        Math.floor(
                          (currentItem.w * cols[bp]) / cols[activeBreakpointKey]
                        )
                      ),
                      cols[bp]
                    ), 
                    h: currentItem.h, 
                  });
                }
              }
            });
          });

          const nextLayouts = {
            lg: newLayout.bottomSection.lg,
            md: newLayout.bottomSection.md,
            sm: newLayout.bottomSection.sm,
            xs: newLayout.bottomSection.xs,
            xxs: newLayout.bottomSection.xxs,
          };

          setLayouts(nextLayouts);
          saveLayout(plugin, 'Default', newLayout);
        } catch (error) {
          console.error('Error saving layout in handleLayoutChange:', error);
        }
      }
    },
    [currentBreakpoint, isEditing, plugin, sanitizeBreakpointLayout, widgets]
  );

  useEffect(() => {
    persistLayoutChangeRef.current = persistLayoutChange;
  }, [persistLayoutChange]);

  const flushLayoutChange = useCallback(() => {
    if (!latestLayoutChangeRef.current) return;
    const { currentLayout, allLayouts } = latestLayoutChangeRef.current;
    latestLayoutChangeRef.current = null;
    if (layoutSaveTimeoutRef.current) {
      clearTimeout(layoutSaveTimeoutRef.current);
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
        clearTimeout(layoutSaveTimeoutRef.current);
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
      clearTimeout(layoutSaveTimeoutRef.current);
    }

    layoutSaveTimeoutRef.current = setTimeout(flushLayoutChange, 160);
  };

  
  
  
  const validatedLayouts = useMemo(() => {
    const validated: { [key: string]: Layout[] } = {};

    Object.entries(layouts).forEach(([breakpoint, layoutArray]) => {
      validated[breakpoint] = normalizeBottomSentinelRows(
        sanitizeBreakpointLayout(layoutArray),
        LAYOUT_BOTTOM_POSITION
      );
    });

    return validated;
  }, [layouts, sanitizeBreakpointLayout]);

  useEffect(() => {
    if (isEditing || !layoutsReady || !gridWidthMeasured || gridWidth <= 0) {
      setStaticGridReady(false);
      return;
    }

    setStaticGridReady(false);
    let secondFrameId: number | null = null;
    const firstFrameId = requestAnimationFrame(() => {
      secondFrameId = requestAnimationFrame(() => {
        setStaticGridReady(true);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrameId);
      if (secondFrameId !== null) {
        cancelAnimationFrame(secondFrameId);
      }
    };
  }, [gridWidth, gridWidthMeasured, isEditing, layoutsReady]);

  const handleDragStart = useCallback(
    (_layout: Layout[], _oldItem: Layout | null, newItem: Layout | null) => {
      activeDragItemIdRef.current = newItem?.i ?? null;
      dragStartItemRef.current = newItem ? { ...newItem } : null;
    },
    []
  );

  const handleDragStop = useCallback(() => {
    setTimeout(() => {
      finalizeLayoutChange({ applyDragSwap: true });
      activeDragItemIdRef.current = null;
      dragStartItemRef.current = null;
    }, 0);
  }, [finalizeLayoutChange]);

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
    setTimeout(() => {
      finalizeLayoutChange({ applyDragSwap: false });
      isResizeActiveRef.current = false;
    }, 0);
    requestAnimationFrame(() => {
      document.dispatchEvent(new CustomEvent('journalit:chart-resize-resume'));
    });
  }, [finalizeLayoutChange]);

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
  filters,
  isEditing,
  widgets,
  onRemoveWidget,
}) => {
  const plugin = usePlugin();
  const {
    width: gridWidth,
    containerRef,
    mounted: gridWidthMeasured,
  } = useContainerWidth({
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
    gridWidthMeasured,
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

  const renderWidgetCard = (widgetId: string, editing: boolean) => {
    const widgetDef = AVAILABLE_WIDGETS.find(
      (w: WidgetDefinition) => w.id === widgetId
    );

    if (!widgetDef) {
      return (
        <div className="journalit-dashboard-widget-error">
          Unknown widget type: {widgetId}
        </div>
      );
    }

    return (
      <DashboardWidgetCard
        widgetId={widgetId}
        filters={filters}
        dateFormat={dateFormat}
        editing={editing}
        onRemoveWidget={onRemoveWidget}
        currencyConversion={currencyConversion}
        getConversionTradesForWidget={getConversionTradesForWidget}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={`journalit-dashboard-grid-layout ${isEditing ? 'is-editing' : ''} ${isGridResizing ? 'is-resizing' : ''}`}
    >
      <GridLayoutErrorBoundary isEditing={isEditing}>
        {isEditing && layoutsReady && gridWidthMeasured && gridWidth > 0 && (
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
              <div key={widgetId}>{renderWidgetCard(widgetId, true)}</div>
            ))}
          </ResponsiveGridLayout>
        )}
        {!isEditing && staticGridReady && (
          <StaticWidgetGrid
            layouts={validatedLayouts as Record<BreakpointKey, Layout[]>}
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
              AVAILABLE_WIDGETS.find((widget) => widget.id === widgetId)
                ?.defaultSize
            }
            renderWidget={(widgetId) => renderWidgetCard(widgetId, false)}
          />
        )}
      </GridLayoutErrorBoundary>
    </div>
  );
};
