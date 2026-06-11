

import React from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { PerformanceCalendar as SharedPerformanceCalendar } from '../../../charts';


export const PerformanceCalendar: React.FC<BaseWidgetProps> = ({ filters }) => {
  return (
    <BaseWidget filters={filters} skeletonType="calendar">
      {(data) => {
        return (
          <SharedPerformanceCalendar trades={data.trades} filters={filters} />
        );
      }}
    </BaseWidget>
  );
};
