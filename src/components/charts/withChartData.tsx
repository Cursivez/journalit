

import React from 'react';
import {
  preparePnLChartData,
  prepareDrawdownChartData,
  prepareTradesChartData,
  PnLChartDataPoint,
  DrawdownChartDataPoint,
  TradesChartDataPoint,
} from '../../utils/chartUtils';
import { Trade } from '../dashboard/utils/dataUtils';
import { usePlugin } from '../../hooks/usePlugin';

export enum ChartType {
  PNL = 'pnl',
  DRAWDOWN = 'drawdown',
  TRADES = 'trades',
}

interface WithChartDataProps {
  trades: Trade[];
  dateFormat?: string;
  height?: number | string;

  [key: string]: any;
}


export function withChartData<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  chartType: ChartType
): React.FC<WithChartDataProps & Omit<P, 'data'>> {
  const Component = (props: WithChartDataProps & Omit<P, 'data'>) => {
    const { trades, dateFormat = 'MMM DD, YYYY', ...rest } = props;
    const plugin = usePlugin();
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;

    
    if (!trades || trades.length === 0) {
      
      switch (chartType) {
        case ChartType.PNL:
          return (
            <WrappedComponent
              data={[] as PnLChartDataPoint[]}
              plugin={plugin}
              {...(rest as P)}
            />
          );
        case ChartType.DRAWDOWN:
          return (
            <WrappedComponent
              data={[] as DrawdownChartDataPoint[]}
              plugin={plugin}
              {...(rest as P)}
            />
          );
        case ChartType.TRADES:
          return (
            <WrappedComponent
              data={[] as TradesChartDataPoint[]}
              plugin={plugin}
              {...(rest as P)}
            />
          );
        default:
          return (
            <WrappedComponent data={[]} plugin={plugin} {...(rest as P)} />
          );
      }
    }

    
    switch (chartType) {
      case ChartType.PNL: {
        const pnlData = preparePnLChartData(
          trades,
          dateFormat,
          defaultRiskAmount,
          plugin
        );
        return (
          <WrappedComponent data={pnlData} plugin={plugin} {...(rest as P)} />
        );
      }

      case ChartType.DRAWDOWN: {
        const drawdownData = prepareDrawdownChartData(
          trades,
          dateFormat,
          defaultRiskAmount,
          'combined',
          plugin
        );
        return (
          <WrappedComponent
            data={drawdownData}
            plugin={plugin}
            {...(rest as P)}
          />
        );
      }

      case ChartType.TRADES: {
        const tradesData = prepareTradesChartData(
          trades,
          defaultRiskAmount,
          plugin
        );
        return (
          <WrappedComponent
            data={tradesData}
            plugin={plugin}
            {...(rest as P)}
          />
        );
      }

      default:
        return <WrappedComponent data={[]} plugin={plugin} {...(rest as P)} />;
    }
  };

  Component.displayName = `withChartData(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return Component;
}
