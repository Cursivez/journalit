

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { PerformanceCalendar as SharedPerformanceCalendar } from '../../../charts/PerformanceCalendar';


const PerformanceCalendarComponent: React.FC<BaseWidgetProps> = () => {
  return (
    <BaseWidget skeletonType="calendar">
      {(data, _dateFormat, filters) => {
        return (
          <SharedPerformanceCalendar trades={data.trades} filters={filters} />
        );
      }}
    </BaseWidget>
  );
};


export const PerformanceCalendar = React.memo(PerformanceCalendarComponent);
