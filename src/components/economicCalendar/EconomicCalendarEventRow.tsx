

import React from 'react';
import type { EconomicCalendarEvent } from '../../services/economicCalendar/types';
import type { NewsEventImpact } from '../../services/weekly/types';
import { t, type TranslationKey } from '../../lang/helpers';
import { formatTimeOfDay } from '../../utils/timeFormat';
import { CalendarCheck, CalendarOff } from '../shared/icons/ObsidianIcon';
import type { EconomicCalendarImportState } from './economicCalendarImportState';

const IMPACT_LABEL_KEYS: Record<NewsEventImpact, TranslationKey> = {
  high: 'view.economic-calendar.impact.high',
  medium: 'view.economic-calendar.impact.medium',
  low: 'view.economic-calendar.impact.low',
  none: 'view.economic-calendar.impact.none',
};

export function getImpactLabel(impact: NewsEventImpact): string {
  return t(IMPACT_LABEL_KEYS[impact]);
}

interface EconomicCalendarEventRowProps {
  event: EconomicCalendarEvent;
  importState: EconomicCalendarImportState;
  selected: boolean;
  isPast: boolean;
  use24HourTime: boolean;
  onToggleSelected: (eventId: number) => void;
}

type ReadingKind = 'actual' | 'forecast' | 'previous';

interface ReadingProps {
  kind: ReadingKind;
  label: string;
  value: number | undefined;
}


const EconomicCalendarReading: React.FC<ReadingProps> = ({
  kind,
  label,
  value,
}) => (
  <span className={`journalit-econ-reading journalit-econ-reading--${kind}`}>
    {value !== undefined && (
      <>
        
        <span className="journalit-econ-reading__label">{label}</span>
        <span className="journalit-econ-reading__value">{value}</span>
      </>
    )}
  </span>
);

export const EconomicCalendarEventRow: React.FC<
  EconomicCalendarEventRowProps
> = ({
  event,
  importState,
  selected,
  isPast,
  use24HourTime,
  onToggleSelected,
}) => {
  const scheduledDate = new Date(event.scheduledAt);
  const isSelectable = importState !== 'imported';
  
  
  const isHoliday = event.eventType === 'holiday';

  return (
    <div
      className={`journalit-econ-row${
        isPast ? ' journalit-econ-row--past' : ''
      }${isHoliday ? ' journalit-econ-row--holiday' : ''}`}
    >
      <div className="journalit-econ-row__select">
        {isSelectable ? (
          <input
            type="checkbox"
            className="journalit-econ-row__checkbox"
            checked={selected}
            onChange={() => onToggleSelected(event.id)}
            aria-label={t('view.economic-calendar.select-aria', {
              event: event.name,
            })}
          />
        ) : (
          <CalendarCheck
            className="journalit-econ-row__imported-status"
            size={14}
            role="img"
            aria-label={t('view.economic-calendar.imported')}
          />
        )}
      </div>

      <span className="journalit-econ-row__time">
        {isHoliday
          ? t('view.economic-calendar.all-day')
          : formatTimeOfDay(scheduledDate, use24HourTime)}
      </span>

      <span className="journalit-econ-row__currency">{event.currency}</span>

      {isHoliday ? (
        <CalendarOff
          className="journalit-econ-row__holiday-icon"
          size={12}
          aria-label={t('view.economic-calendar.holiday-aria')}
        />
      ) : (
        <span
          className={`journalit-econ-impact journalit-econ-impact--${event.impact}`}
          role="img"
          aria-label={t('view.economic-calendar.impact-aria', {
            impact: getImpactLabel(event.impact),
          })}
        />
      )}

      <div className="journalit-econ-row__name">
        <span className="journalit-econ-row__title">{event.name}</span>
        {importState === 'update-available' && (
          <span className="journalit-econ-badge journalit-econ-badge--update">
            {t('view.economic-calendar.update-available')}
          </span>
        )}
      </div>

      
      <div className="journalit-econ-row__readings">
        <EconomicCalendarReading
          kind="actual"
          label={t('view.economic-calendar.actual')}
          value={event.actual}
        />
        <EconomicCalendarReading
          kind="forecast"
          label={t('view.economic-calendar.forecast')}
          value={event.forecast}
        />
        <EconomicCalendarReading
          kind="previous"
          label={t('view.economic-calendar.previous')}
          value={event.previous}
        />
      </div>
    </div>
  );
};

EconomicCalendarEventRow.displayName = 'EconomicCalendarEventRow';
