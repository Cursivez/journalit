

import React, { useId } from 'react';
import { t, tPlural } from '../../../lang/helpers';
import {
  getKeyEventDayLabel,
  getKeyEventShortDayLabel,
  type KeyEventColor,
} from '../../../utils/keyEvents';
import {
  formatDayMonthDisplay,
  getUserDateFormat,
} from '../../../utils/dateUtils';
import { shareCaptureExcludeProps } from '../../../services/share/brandedCapture';

const MAX_DOTS = 8;

const IMPACT_RANK: Record<KeyEventColor, number> = {
  red: 0,
  orange: 1,
  yellow: 2,
  gray: 3,
};

export interface KeyEventsDayPickerTile {
  day: string;
  date: Date | null;
  colors: KeyEventColor[];
  isToday: boolean;
  isPast: boolean;
}

interface KeyEventsDayPickerProps {
  tiles: KeyEventsDayPickerTile[];
  
  selectedDay: string | null;
  onSelect: (day: string) => void;
}

export const KeyEventsDayPicker: React.FC<KeyEventsDayPickerProps> = ({
  tiles,
  selectedDay,
  onSelect,
}) => {
  
  
  const labelId = useId();
  return (
    <div
      className="key-events-day-picker"
      role="group"
      aria-labelledby={labelId}
      
      {...shareCaptureExcludeProps}
    >
      <span className="journalit-sr-only" id={labelId}>
        {t('widget.key-events.day-picker-label')}
      </span>
      {tiles.map((tile) => {
        const dots = [...tile.colors].sort(
          (first, second) => IMPACT_RANK[first] - IMPACT_RANK[second]
        );
        const hiddenDots = dots.length - MAX_DOTS;
        const isSelected = tile.day === selectedDay;
        return (
          <button
            key={tile.day}
            type="button"
            className={[
              'journalit-key-events-day-picker__tile',
              isSelected && 'is-selected',
              tile.isToday && 'is-today',
              tile.isPast && 'is-past',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={isSelected}
            disabled={tile.colors.length === 0}
            onClick={() => onSelect(tile.day)}
          >
            <span className="key-events-day-picker__weekday" aria-hidden="true">
              {getKeyEventShortDayLabel(tile.day)}
            </span>
            {tile.date && (
              <span className="key-events-day-picker__date" aria-hidden="true">
                {formatDayMonthDisplay(tile.date, getUserDateFormat())}
              </span>
            )}
            <span className="journalit-sr-only">
              {getKeyEventDayLabel(tile.day)}
              {tile.isToday ? `, ${t('widget.key-events.today')}` : ''},{' '}
              {tPlural('widget.key-events.event-count', tile.colors.length)}
            </span>
            <span className="key-events-day-picker__dots" aria-hidden="true">
              {dots.slice(0, MAX_DOTS).map((color, index) => (
                <span
                  key={index}
                  className={`key-events-day-picker__dot key-events-color-dot--${color}`}
                />
              ))}
              {hiddenDots > 0 && (
                <span className="key-events-day-picker__more">
                  +{hiddenDots}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

KeyEventsDayPicker.displayName = 'KeyEventsDayPicker';
