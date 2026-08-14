
import React from 'react';
import { t } from '../../../../lang/helpers';
import { getTradeSetupGroups } from '../../../../utils/tradeGrouping';
import type { BaseWidgetProps } from './BaseWidget';
import { PerformanceBreakdownChart } from './PerformanceBreakdownChart';

export const SetupPerformanceChart = React.memo<BaseWidgetProps>((props) => (
  <PerformanceBreakdownChart
    {...props}
    kind="setup"
    title={t('dashboard.widgets.setup-performance.title')}
    emptyMessage={t('dashboard.widgets.setup-performance.empty')}
    maskedLabel={t('dashboard.widgets.setup-performance.masked-label')}
    getGroups={getTradeSetupGroups}
  />
));

SetupPerformanceChart.displayName = 'SetupPerformanceChart';
