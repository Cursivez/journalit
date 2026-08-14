import React from 'react';
import { t } from '../../../../lang/helpers';
import { getTradeTickerGroups } from '../../../../utils/tradeGrouping';
import type { BaseWidgetProps } from './BaseWidget';
import { PerformanceBreakdownChart } from './PerformanceBreakdownChart';

export const TickerPerformanceChart = React.memo<BaseWidgetProps>((props) => (
  <PerformanceBreakdownChart
    {...props}
    kind="ticker"
    title={t('dashboard.widgets.ticker-performance.title')}
    emptyMessage={t('dashboard.widgets.ticker-performance.empty')}
    maskedLabel={t('dashboard.widgets.ticker-performance.masked-ticker')}
    getGroups={getTradeTickerGroups}
  />
));

TickerPerformanceChart.displayName = 'TickerPerformanceChart';
