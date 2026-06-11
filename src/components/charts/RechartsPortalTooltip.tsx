import React from 'react';
import { Tooltip, TooltipProps } from 'recharts';
import { PortalChartTooltip, TooltipPlacementMode } from './PortalChartTooltip';

type RechartsTooltipRuntimeProps = TooltipProps<number, string> & {
  
  active?: boolean;
  payload?: readonly unknown[];
  coordinate?: { x: number; y: number };
};

interface RechartsPortalTooltipProps {
  chartRef: React.RefObject<HTMLElement | null>;
  children: (tooltipProps: RechartsTooltipRuntimeProps) => React.ReactNode;
  placementMode?: TooltipPlacementMode;
  cursor?: TooltipProps<number, string>['cursor'];
  tooltipProps?: Omit<
    Partial<TooltipProps<number, string>>,
    'allowEscapeViewBox' | 'content' | 'cursor'
  >;
}

export function RechartsPortalTooltip({
  chartRef,
  children,
  placementMode = 'point',
  cursor,
  tooltipProps,
}: RechartsPortalTooltipProps): React.ReactElement {
  return (
    <Tooltip
      {...tooltipProps}
      allowEscapeViewBox={{ x: true, y: true }}
      content={(runtimeProps) => (
        <PortalChartTooltip
          active={runtimeProps.active}
          payload={runtimeProps.payload}
          coordinate={runtimeProps.coordinate}
          chartRef={chartRef}
          placementMode={placementMode}
        >
          {children(runtimeProps)}
        </PortalChartTooltip>
      )}
      cursor={cursor}
    />
  );
}
