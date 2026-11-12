

import React, { useState } from 'react';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { PerformanceCalendar as SharedPerformanceCalendar } from '../../../charts/PerformanceCalendar';
import { t } from '../../../../lang/helpers';
import {
  COMPARE_LETTER,
  COMPARE_SIDES,
  type CompareSide,
} from '../../compare/CompareCharts';


const CalendarSideSwitch: React.FC<{
  side: CompareSide;
  onChange: (side: CompareSide) => void;
}> = ({ side, onChange }) => (
  <div
    className="journalit-compare-switch"
    role="radiogroup"
    aria-label={t('dashboard.compare.calendar-switch')}
  >
    {COMPARE_SIDES.map((option) => (
      <button
        key={option}
        type="button"
        role="radio"
        aria-checked={side === option}
        aria-label={t('dashboard.compare.filter-side', {
          side: COMPARE_LETTER[option],
        })}
        className={`journalit-compare-switch__option journalit-compare-switch__option--${option}${side === option ? ' is-active' : ''}`}
        onClick={() => onChange(option)}
      >
        {COMPARE_LETTER[option]}
      </button>
    ))}
  </div>
);


const PerformanceCalendarComponent: React.FC<BaseWidgetProps> = () => {
  const [side, setSide] = useState<CompareSide>('a');
  return (
    <BaseWidget skeletonType="calendar">
      {(data, _dateFormat, filters, compare) => {
        if (compare) {
          const shown = side === 'b' ? compare : { data, filters };
          return (
            <SharedPerformanceCalendar
              trades={shown.data.trades}
              filters={shown.filters}
              toolbarAction={
                <CalendarSideSwitch side={side} onChange={setSide} />
              }
            />
          );
        }
        return (
          <SharedPerformanceCalendar trades={data.trades} filters={filters} />
        );
      }}
    </BaseWidget>
  );
};


export const PerformanceCalendar = React.memo(PerformanceCalendarComponent);
