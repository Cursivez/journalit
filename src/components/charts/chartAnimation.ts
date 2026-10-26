import { createContext, useContext } from 'react';


export const ChartAnimationContext = createContext(true);

export function useChartAnimationActive(): boolean {
  return useContext(ChartAnimationContext);
}


const MAX_ANIMATED_SERIES_POINTS = 120;

export function shouldAnimateSeries(pointCount: number): boolean {
  return pointCount <= MAX_ANIMATED_SERIES_POINTS;
}
