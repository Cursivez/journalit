

import { TooltipProps } from 'recharts';
import type { ReactElement } from 'react';
import type { CssVarKey } from '../../styles/inlineStylePolicy';
import {
  PnLChartDataPoint,
  DrawdownChartDataPoint,
  TradesChartDataPoint,
} from '../../utils/chartUtils';


export interface BaseChartProps {
  height?: number | string;
  width?: number | string;
  className?: string;
  
  styleVars?: Partial<Record<CssVarKey, string | number | null | undefined>>;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  

  onChartClick?: (event: unknown) => void;

  onPointClick?: (
    data: (
      | PnLChartDataPoint
      | DrawdownChartDataPoint
      | TradesChartDataPoint
    ) & {
      path?: string;
    },
    index: number
  ) => void;
}


interface AxisRangeProps {
  minValue?: number;
  maxValue?: number;
  autoRange?: boolean;
  paddingPercentage?: number;
}


interface TooltipConfigProps {
  tooltipProps?: Partial<TooltipProps<number, string>>;
  showTooltip?: boolean;
  customTooltip?: ReactElement;
  showAccountTooltip?: boolean;
}


interface GradientProps {
  fillGradient?: boolean;
  gradientTransitionOffset?: number;
}


export interface PnLChartProps
  extends BaseChartProps, AxisRangeProps, TooltipConfigProps, GradientProps {
  data: PnLChartDataPoint[];
}


export interface DrawdownChartProps
  extends BaseChartProps, AxisRangeProps, TooltipConfigProps {
  data: DrawdownChartDataPoint[];
}


export interface TradesChartProps
  extends BaseChartProps, AxisRangeProps, TooltipConfigProps {
  data: TradesChartDataPoint[];
}
