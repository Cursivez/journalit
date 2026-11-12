import React from 'react';
import type { DotItemDotProps } from 'recharts';


export function isolatedPointDot<Key extends string>(
  data: ReadonlyArray<Partial<Record<Key, unknown>>>,
  key: Key,
  color: string,
  opacity = 1
) {
  const IsolatedPointDot = (props: DotItemDotProps): React.ReactElement => {
    const { cx, cy, index } = props;
    const isolated =
      data[index]?.[key] != null &&
      data[index - 1]?.[key] == null &&
      data[index + 1]?.[key] == null;
    return isolated && cx != null && cy != null ? (
      <circle
        key={`${key}-${index}`}
        cx={cx}
        cy={cy}
        r={3.5}
        fill={color}
        fillOpacity={opacity}
        stroke="var(--background-primary)"
        strokeWidth={1}
      />
    ) : (
      <circle key={`${key}-${index}`} cx={0} cy={0} r={0} opacity={0} />
    );
  };
  return IsolatedPointDot;
}
