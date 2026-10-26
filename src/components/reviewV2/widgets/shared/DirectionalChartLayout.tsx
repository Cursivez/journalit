
import React from 'react';
import { SkeletonBox } from '../../../shared/SkeletonBox';
import {
  CurrencyConversionInfo,
  type CurrencyConversionTrade,
  type ReviewCurrencyConversionMetadata,
} from '../../../shared/display/CurrencyConversionInfo';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import { shareLoadingProps } from '../../../../services/share/brandedCapture';

export type TradeDirection = 'long' | 'short';

export const DirectionalContainer: React.FC<{
  layout?: 'stacked' | 'side-by-side';
  showLong?: boolean;
  showShort?: boolean;
  renderDirection: (direction: TradeDirection) => React.ReactNode;
}> = ({ layout, showLong, showShort, renderDirection }) => (
  <div
    className={
      layout === 'side-by-side'
        ? 'journalit-reviewv2-directional-container journalit-reviewv2-directional-container--row'
        : 'journalit-reviewv2-directional-container journalit-reviewv2-directional-container--column'
    }
  >
    {showLong && renderDirection('long')}
    {showShort && renderDirection('short')}
  </div>
);


export const DirectionalSection: React.FC<{
  title: string;
  conversion?: {
    metadata: ReviewCurrencyConversionMetadata | null | undefined;
    trades: CurrencyConversionTrade[];
  };
  emptyMessage?: string;
  children?: React.ReactNode;
}> = ({ title, conversion, emptyMessage, children }) => (
  <div className="journalit-reviewv2-directional-section">
    <div className="journalit-reviewv2-chart-header">
      <div className="journalit-reviewv2-chart-title">
        {title}
        {conversion && (
          <CurrencyConversionInfo
            metadata={conversion.metadata}
            trades={conversion.trades}
          />
        )}
      </div>
    </div>
    {children ? (
      <div className="journalit-reviewv2-chart-body">{children}</div>
    ) : (
      <div className="journalit-reviewv2-chart-empty journalit-reviewv2-chart-empty--small">
        {emptyMessage}
      </div>
    )}
  </div>
);

export const DirectionalChartSkeleton: React.FC<{
  height: number;
  
  axisWidths: readonly number[];
  areaPath: string;
  linePath: string;
}> = ({ height, axisWidths, areaPath, linePath }) => (
  <div
    className="journalit-reviewv2-chart-skeleton"
    {...shareLoadingProps}
    style={cssVars({
      '--reviewv2-chart-height': `${height}px`,
      '--reviewv2-chart-bar-gap': '4px',
    })}
  >
    <div className="journalit-reviewv2-chart-skeleton-axis">
      {axisWidths.map((width) => (
        <SkeletonBox key={width} width={width} height={10} borderRadius="4px" />
      ))}
    </div>
    <div className="journalit-reviewv2-chart-skeleton-wave journalit-reviewv2-chart-skeleton-wave--wide">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <path
          d={areaPath}
          fill="var(--background-modifier-border)"
          className="journalit-skeleton-shimmer journalit-reviewv2-chart-skeleton-wave-fill"
        />
        <path
          d={linePath}
          fill="none"
          stroke="var(--background-modifier-border)"
          strokeWidth="2"
          className="journalit-skeleton-shimmer journalit-reviewv2-chart-skeleton-wave-line"
        />
      </svg>
    </div>
    <div className="journalit-reviewv2-chart-skeleton-xlabels journalit-reviewv2-chart-skeleton-xlabels--between journalit-reviewv2-chart-skeleton-xlabels--wide">
      <SkeletonBox width={20} height={10} borderRadius="4px" />
      <SkeletonBox width={20} height={10} borderRadius="4px" />
      <SkeletonBox width={20} height={10} borderRadius="4px" />
    </div>
  </div>
);
