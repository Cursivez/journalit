
import React from 'react';
import { t } from '../../../../lang/helpers';
import { getTradeTagGroups } from '../../../../utils/tradeGrouping';
import type { BaseWidgetProps } from './BaseWidget';
import { PerformanceBreakdownChart } from './PerformanceBreakdownChart';

export const TagPerformanceChart = React.memo<BaseWidgetProps>((props) => (
  <PerformanceBreakdownChart
    {...props}
    kind="tag"
    title={t('dashboard.widgets.tag-performance.title')}
    emptyMessage={t('dashboard.widgets.tag-performance.empty')}
    maskedLabel={t('dashboard.widgets.tag-performance.masked-label')}
    getGroups={getTradeTagGroups}
  />
));

TagPerformanceChart.displayName = 'TagPerformanceChart';
