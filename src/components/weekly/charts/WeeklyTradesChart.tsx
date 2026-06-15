

import React from 'react';
import type JournalitPlugin from '../../../main';
import { Trade } from '../../../components/dashboard/utils/dataUtils';
import { SharedTradesChart } from '../../charts';
import { prepareTradesChartData } from '../../../utils/chartUtils';
import { usePlugin } from '../../../hooks/usePlugin';

interface WeeklyTradesChartProps {
  trades: Trade[];
  height?: number;
  dateFormat?: string; 
  currencyOverride?: string;
  plugin?: JournalitPlugin | null;
}


export const WeeklyTradesChart: React.FC<WeeklyTradesChartProps> = ({
  trades,
  height = 300,
  dateFormat,
  currencyOverride,
}) => {
  const plugin = usePlugin();
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
  const chartData = prepareTradesChartData(trades, defaultRiskAmount, plugin);

  return (
    <SharedTradesChart
      data={chartData}
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
