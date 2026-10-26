
import React from 'react';
import { SharedDailyPerformanceChart } from '../../../charts/SharedDailyPerformanceChart';
import { SkeletonBox } from '../../../shared/SkeletonBox';
import {
  CurrencyConversionInfo,
  type ReviewCurrencyConversionMetadata,
} from '../../../shared/display/CurrencyConversionInfo';
import { cssVars } from '../../../../styles/inlineStylePolicy';
import { shareLoadingProps } from '../../../../services/share/brandedCapture';

type ChartProps = React.ComponentProps<typeof SharedDailyPerformanceChart>;

export interface PeriodBarSkeletonShape {
  barWidth: number;
  
  barHeights: readonly string[];
  labelCount: number;
  labelWidth: number;
}

const PeriodBarSkeleton: React.FC<{
  height: number;
  shape: PeriodBarSkeletonShape;
}> = ({ height, shape }) => (
  <div
    className="journalit-reviewv2-chart-skeleton"
    {...shareLoadingProps}
    style={cssVars({
      '--reviewv2-chart-height': `${height}px`,
      '--reviewv2-chart-bar-gap': '4px',
    })}
  >
    <div className="journalit-reviewv2-chart-skeleton-axis">
      <SkeletonBox width={30} height={10} borderRadius="4px" />
      <SkeletonBox width={25} height={10} borderRadius="4px" />
      <SkeletonBox width={28} height={10} borderRadius="4px" />
    </div>
    <div className="journalit-reviewv2-chart-skeleton-bars">
      {shape.barHeights.map((barHeight) => (
        <SkeletonBox
          key={barHeight}
          width={shape.barWidth}
          height={barHeight}
          borderRadius="2px"
        />
      ))}
    </div>
    <div className="journalit-reviewv2-chart-skeleton-xline" />
    <div className="journalit-reviewv2-chart-skeleton-xlabels">
      {Array.from({ length: shape.labelCount }).map((_, i) => (
        <SkeletonBox
          key={i}
          width={shape.labelWidth}
          height={10}
          borderRadius="4px"
        />
      ))}
    </div>
  </div>
);

interface PeriodPerformanceChartCardProps {
  title: string;
  emptyMessage: string;
  loading: boolean;
  height: number;
  skeleton: PeriodBarSkeletonShape;
  currencyConversion: ReviewCurrencyConversionMetadata | null | undefined;
  data: ChartProps['data'];
  currencyOverride: ChartProps['currencyOverride'];
  navigation: ChartProps['navigation'];
}

export const PeriodPerformanceChartCard: React.FC<
  PeriodPerformanceChartCardProps
> = ({
  title,
  emptyMessage,
  loading,
  height,
  skeleton,
  currencyConversion,
  data,
  currencyOverride,
  navigation,
}) => (
  <div className="journalit-reviewv2-chart-container">
    <div className="journalit-reviewv2-chart-header">
      <div className="journalit-reviewv2-chart-title">
        {title}
        {!loading && <CurrencyConversionInfo metadata={currencyConversion} />}
      </div>
    </div>
    {loading || data.length > 0 ? (
      <div className="journalit-reviewv2-chart-body">
        {loading ? (
          <PeriodBarSkeleton height={height} shape={skeleton} />
        ) : (
          <SharedDailyPerformanceChart
            data={data}
            height={height}
            currencyOverride={currencyOverride}
            navigation={navigation}
          />
        )}
      </div>
    ) : (
      <div className="journalit-reviewv2-chart-empty">{emptyMessage}</div>
    )}
  </div>
);
