

import React from 'react';
import JournalitPlugin from '../../../main';
import { Trade } from '../../../components/dashboard/utils/dataUtils';
import { SharedTradesChart, withChartData, ChartType } from '../../charts';

interface WeeklyTradesChartProps {
  trades: Trade[];
  height?: number;
  dateFormat?: string; 
  currencyOverride?: string;
  plugin?: JournalitPlugin | null;
}



const EnhancedTradesChart = withChartData(SharedTradesChart, ChartType.TRADES);


export const WeeklyTradesChart: React.FC<WeeklyTradesChartProps> = ({
  trades,
  height = 300,
  dateFormat,
  currencyOverride,
  plugin,
}) => {
  return (
    <EnhancedTradesChart
      trades={trades}
      plugin={plugin}
      dateFormat={dateFormat}
      height={height}
      currencyOverride={currencyOverride}
      onPointClick={(data, _index) => {
        
        if (data?.path) {
          // intentional
        }
      }}
    />
  );
};
