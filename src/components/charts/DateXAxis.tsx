

import React, { useMemo } from 'react';
import {
  Text,
  XAxis,
  usePlotArea,
  type TextProps,
  type XAxisProps,
} from 'recharts';
import {
  dateTickAnchor,
  evenDateTicks,
  type PlotBounds,
} from './dateAxisTicks';

interface DateAxisTickProps extends Omit<
  TextProps,
  'x' | 'width' | 'height' | 'textAnchor'
> {
  x?: number | string;
  width?: number | string;
  height?: number | string;
  index?: number;
  payload?: { value?: unknown };
  tickFormatter?: (value: unknown, index: number) => string;
}


function dateAxisTick(plot: PlotBounds) {
  return function renderDateAxisTick({
    x,
    width: _width,
    height: _height,
    index = 0,
    payload,
    tickFormatter,
    ...textProps
  }: DateAxisTickProps): React.ReactElement {
    const value = payload?.value;
    const label = tickFormatter ? tickFormatter(value, index) : String(value);
    return (
      <Text {...textProps} x={x} textAnchor={dateTickAnchor(Number(x), plot)}>
        {label}
      </Text>
    );
  };
}


export function DateXAxis({
  chartData,
  ...props
}: Omit<XAxisProps, 'dataKey' | 'ticks' | 'interval' | 'tick'> & {
  chartData: readonly { dateKey: string }[];
}): React.ReactElement {
  const plotArea = usePlotArea();
  const left = plotArea?.x ?? 0;
  const right = left + (plotArea?.width ?? 0);
  const keys = useMemo(
    () => chartData.map((point) => point.dateKey),
    [chartData]
  );
  const ticks = useMemo(
    () => evenDateTicks(keys, { left, right }),
    [keys, left, right]
  );
  const tick = useMemo(() => dateAxisTick({ left, right }), [left, right]);
  return (
    <XAxis
      {...props}
      dataKey="dateKey"
      ticks={ticks}
      interval={0}
      tick={tick}
    />
  );
}
