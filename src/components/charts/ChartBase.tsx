import { logger } from '../../utils/logger';


import React, {
  ReactElement,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';
import { BaseChartProps } from './types';
import { ChartSkeleton } from '../shared/ChartSkeleton';
import { cssVars } from '../../styles/inlineStylePolicy';


interface ChartBaseProps extends BaseChartProps {
  
  
  children: ReactElement<{ width?: number; height?: number }>;
  chartRef?: React.RefObject<HTMLDivElement | null>;
  skeletonVariant?: 'area' | 'line' | 'bar';
}


const MIN_CHART_WIDTH = 100;
const MIN_CHART_HEIGHT = 100;


const DEBUG_CHARTS: boolean =
  (typeof window !== 'undefined' && window.JOURNALIT_DEBUG_CHARTS) === true;


interface ContainerDimensions {
  width: number;
  height: number;
}


export const ChartBase = React.memo<ChartBaseProps>(
  ({
    children,
    height = '100%',
    width = '100%',
    className = '',
    styleVars,
    onChartClick,
    chartRef,
    skeletonVariant = 'area',
  }) => {
    const internalContainerRef = useRef<HTMLDivElement>(null);
    const containerRef = chartRef ?? internalContainerRef;
    const [dimensions, setDimensions] = useState<ContainerDimensions>({
      width: 0,
      height: 0,
    });
    const [isInitialized, setIsInitialized] = useState(false);

    
    const heightValue = typeof height === 'number' ? `${height}px` : height;
    const widthValue = typeof width === 'number' ? `${width}px` : width;

    
    const containerClass = `journalit-chart-container ${className}`.trim();

    
    const hasAdequateDimensions =
      dimensions.width >= MIN_CHART_WIDTH &&
      dimensions.height >= MIN_CHART_HEIGHT;
    const shouldShowChart = isInitialized && hasAdequateDimensions;

    const interactiveContainerProps = onChartClick
      ? {
          onClick: onChartClick,
          onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
              return;
            }

            event.preventDefault();
            onChartClick(event);
          },
          role: 'button',
          tabIndex: 0,
        }
      : {};

    const isInteractiveGridResizing = useCallback(() => {
      return (
        containerRef.current?.closest(
          '.journalit-dashboard-grid-layout.is-resizing, .journalit-home-grid-layout.is-resizing'
        ) !== null
      );
    }, [containerRef]);

    
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const measure = () => {
        const rect = container.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        if (width > 0 && height > 0) {
          setDimensions((previous) =>
            previous.width === width && previous.height === height
              ? previous
              : { width, height }
          );
          setIsInitialized(true);
        }
      };

      
      measure();
      if (DEBUG_CHARTS) {
        

        logger.debug('[ChartBase] initial dimensions', {
          width: Math.floor(container.getBoundingClientRect().width),
          height: Math.floor(container.getBoundingClientRect().height),
        });
      }

      
      if (typeof ResizeObserver === 'undefined') {
        console.warn(
          'ResizeObserver not available, falling back to immediate render'
        );
        setDimensions({ width: MIN_CHART_WIDTH, height: MIN_CHART_HEIGHT });
        setIsInitialized(true);
        return;
      }

      const resizeObserver = new ResizeObserver((entries) => {
        if (isInteractiveGridResizing()) return;

        for (const entry of entries) {
          const width = Math.floor(entry.contentRect.width);
          const height = Math.floor(entry.contentRect.height);
          setDimensions((previous) =>
            previous.width === width && previous.height === height
              ? previous
              : { width, height }
          );

          
          setIsInitialized((previous) => previous || true);

          if (DEBUG_CHARTS) {
            logger.debug('[ChartBase] resize', {
              width,
              height,
              shouldShowChart:
                width >= MIN_CHART_WIDTH && height >= MIN_CHART_HEIGHT,
            });
          }
        }
      });

      resizeObserver.observe(container);
      window.activeDocument.addEventListener(
        'journalit:chart-resize-resume',
        measure
      );

      
      return () => {
        window.activeDocument.removeEventListener(
          'journalit:chart-resize-resume',
          measure
        );
        resizeObserver.unobserve(container);
        resizeObserver.disconnect();
      };
    }, [containerRef, isInteractiveGridResizing]);

    return (
      <div
        ref={containerRef}
        className={containerClass}
        style={cssVars({
          '--journalit-chart-width': widthValue,
          '--journalit-chart-height': heightValue,
          '--journalit-chart-min-height':
            typeof height === 'string' && height.includes('%')
              ? '120px'
              : undefined,
          ...(styleVars || {}),
        })}
        {...interactiveContainerProps}
      >
        {shouldShowChart ? (
          React.cloneElement(children, {
            width: Math.max(0, Math.floor(dimensions.width)),
            height: Math.max(0, Math.floor(dimensions.height)),
          })
        ) : (
          <div className="journalit-chart-loading-container">
            <ChartSkeleton variant={skeletonVariant} />
          </div>
        )}
      </div>
    );
  }
);

ChartBase.displayName = 'ChartBase';
