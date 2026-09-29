import React from 'react';
import { cssVars } from '../../styles/inlineStylePolicy';
import { SkeletonBox } from './SkeletonBox';
import { shareLoadingProps } from '../../services/share/brandedCapture';

interface ChartSkeletonProps {
  variant: 'area' | 'line' | 'bar' | 'scatter';
  height?: number | string;
  wide?: boolean;
  barGap?: string;
}

const BAR_HEIGHTS = [45, 25, 60, 15, 35, 50, 20, 68, 38, 55];


const SCATTER_POINTS = [
  [5, 72],
  [8, 80],
  [12, 66],
  [15, 73],
  [18, 60],
  [20, 86],
  [23, 65],
  [27, 54],
  [30, 70],
  [33, 45],
  [36, 59],
  [40, 80],
  [43, 51],
  [48, 38],
  [51, 57],
  [55, 71],
  [60, 44],
  [65, 30],
  [68, 53],
  [72, 78],
  [76, 24],
  [81, 39],
  [87, 15],
  [94, 28],
];

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  variant,
  height = '100%',
  wide = true,
  barGap = '4px',
}) => {
  const heightValue = typeof height === 'number' ? `${height}px` : height;
  const axisWidths = variant === 'line' ? [30, 25, 35, 28] : [30, 25, 28];

  return (
    <div
      className={`journalit-chart-skeleton${variant === 'scatter' ? ' journalit-chart-skeleton--scatter' : ''}`}
      {...shareLoadingProps}
      style={cssVars({
        '--journalit-chart-skeleton-height': heightValue,
        '--journalit-chart-skeleton-bar-gap': barGap,
      })}
      aria-hidden="true"
    >
      <div className="journalit-chart-skeleton-axis">
        {axisWidths.map((width) => (
          <SkeletonBox
            key={`axis-${width}`}
            width={width}
            height={10}
            borderRadius="4px"
          />
        ))}
      </div>

      {variant === 'scatter' ? (
        <>
          <div className="journalit-chart-skeleton-scatter-legend">
            {['first', 'second', 'third'].map((key) => (
              <div
                key={key}
                className="journalit-chart-skeleton-scatter-legend-item"
              >
                <SkeletonBox width={6} height={6} borderRadius="50%" />
                <SkeletonBox width={40} height={8} />
              </div>
            ))}
          </div>
          <div className="journalit-chart-skeleton-scatter">
            {SCATTER_POINTS.map(([x, y]) => (
              <div
                key={`${x}-${y}`}
                className="journalit-chart-skeleton-scatter-point"
                style={cssVars({
                  '--scatter-x': `${x}%`,
                  '--scatter-y': `${y}%`,
                })}
              >
                <SkeletonBox width={6} height={6} borderRadius="50%" />
              </div>
            ))}
          </div>
          <div className="journalit-chart-skeleton-xlabels journalit-chart-skeleton-xlabels--between">
            {['first', 'second', 'third', 'fourth', 'fifth'].map((key) => (
              <SkeletonBox key={key} width={20} height={10} />
            ))}
          </div>
        </>
      ) : variant === 'bar' ? (
        <>
          <div className="journalit-chart-skeleton-bars">
            {BAR_HEIGHTS.map((barHeight) => (
              <SkeletonBox
                key={`bar-${barHeight}`}
                width={18}
                height={`${barHeight}%`}
                borderRadius="2px"
              />
            ))}
          </div>
          <div className="journalit-chart-skeleton-xline" />
          <div className="journalit-chart-skeleton-xlabels">
            {['first', 'second', 'third', 'fourth', 'fifth'].map((key) => (
              <SkeletonBox
                key={key}
                width={15}
                height={10}
                borderRadius="4px"
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div
            className={`journalit-chart-skeleton-wave ${wide ? 'journalit-chart-skeleton-wave--wide' : ''}`}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
              focusable="false"
            >
              {variant === 'area' && (
                <path
                  d="M0,180 Q50,160 100,140 T200,100 T300,80 T400,60 L400,200 L0,200 Z"
                  className="skeleton-shimmer journalit-chart-skeleton-wave-fill"
                />
              )}
              <path
                d="M0,180 Q50,160 100,140 T200,100 T300,80 T400,60"
                className="skeleton-shimmer journalit-chart-skeleton-wave-line"
              />
            </svg>
          </div>
          <div className="journalit-chart-skeleton-xlabels journalit-chart-skeleton-xlabels--between journalit-chart-skeleton-xlabels--wide">
            {['first', 'second', 'third', 'fourth', 'fifth'].map((key) => (
              <SkeletonBox
                key={key}
                width={20}
                height={10}
                borderRadius="4px"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
