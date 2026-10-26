
import React, { useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';
import { createDateWithoutTime } from '../../utils/dateUtils';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from '../shared/icons/ObsidianIcon';
import { useAnchoredMenuPosition } from '../shared/menus/useAnchoredMenuPosition';
import type { DatePickerLocale } from './datePickerLocales';

export interface DateTimePickerPopupConfig {
  value?: Date;
  includeTime: boolean;
  timeOnly: boolean;
  showSeconds: boolean;
  use24HourTime: boolean;
  minDate?: Date;
  closeOnQuickAction: boolean;
  locale: DatePickerLocale;
  onChange: (date: Date | undefined) => void;
  onSelectDay: (date: Date, pickerTime: Date | undefined) => Date | undefined;
  onToday: (date: Date) => void;
}

interface DateTimePickerPopupProps {
  config: DateTimePickerPopupConfig;
  anchor: HTMLElement;
  
  onDismiss: (restoreFocus: boolean) => void;
  popupRef: React.RefObject<HTMLDivElement | null>;
}

interface MonthView {
  year: number;
  month: number;
}

interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

const MAX_POPUP_HEIGHT = 480;
const DAYS_PER_WEEK = 7;
const CALENDAR_DAYS = 42;

const monthOf = (date: Date): MonthView => ({
  year: date.getFullYear(),
  month: date.getMonth(),
});

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();


function calendarDays(view: MonthView, firstDayOfWeek: number): Date[] {
  const first = new Date(view.year, view.month, 1);
  const offset = (first.getDay() - firstDayOfWeek + DAYS_PER_WEEK) % 7;
  return Array.from(
    { length: CALENDAR_DAYS },
    (_, index) => new Date(view.year, view.month, 1 - offset + index)
  );
}

const dayLabel = (date: Date, locale: DatePickerLocale) =>
  `${locale.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const timePartsOf = (date: Date): TimeParts => ({
  hour: date.getHours(),
  minute: date.getMinutes(),
  second: date.getSeconds(),
});

export const DateTimePickerPopup: React.FC<DateTimePickerPopupProps> = ({
  config,
  anchor,
  onDismiss,
  popupRef,
}) => {
  const {
    value,
    includeTime,
    timeOnly,
    showSeconds,
    use24HourTime,
    minDate,
    closeOnQuickAction,
    locale,
  } = config;
  const hasTime = includeTime || timeOnly;
  
  const [openedAt] = useState(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now;
  });
  const [view, setView] = useState<MonthView>(() => monthOf(value ?? openedAt));
  
  
  const [editedTime, setEditedTime] = useState<Date | undefined>();
  const anchorRef = useRef(anchor);
  const shownTime = editedTime ?? value;
  const time = timePartsOf(shownTime ?? openedAt);

  const position = useAnchoredMenuPosition({
    isOpen: true,
    triggerRef: anchorRef,
    menuRef: popupRef,
    width: 'content',
    maxHeight: MAX_POPUP_HEIGHT,
  });

  const focusDay = (key: string) =>
    popupRef.current
      ?.querySelector<HTMLElement>(`[data-day="${key}"]`)
      ?.focus({ preventScroll: true });

  
  
  
  useLayoutEffect(() => {
    if (timeOnly) return;
    popupRef.current
      ?.querySelector<HTMLElement>('.journalit-date-picker__day[tabindex="0"]')
      ?.focus({ preventScroll: true });
  }, [timeOnly, popupRef]);

  const minDay = minDate ? createDateWithoutTime(minDate, true) : undefined;
  const isDayDisabled = (date: Date) => Boolean(minDay && date < minDay);
  const todayAllowed = (now: Date) =>
    !minDate || (hasTime ? now >= minDate : !isDayDisabled(now));

  const selectDay = (date: Date) => {
    if (isDayDisabled(date)) return;
    config.onSelectDay(new Date(date), editedTime && new Date(editedTime));
    onDismiss(true);
  };

  const commitTime = (parts: TimeParts) => {
    const base = shownTime ?? new Date(openedAt);
    const next = new Date(base);
    next.setHours(
      parts.hour,
      parts.minute,
      showSeconds ? parts.second : base.getSeconds(),
      0
    );
    
    if (minDate && next < minDate) next.setTime(minDate.getTime());
    setEditedTime(next);
    if (next.getTime() !== shownTime?.getTime())
      config.onChange(new Date(next));
  };

  const today = () => {
    const now = new Date();
    if (!todayAllowed(now)) return;
    config.onToday(now);
    setEditedTime(undefined);
    setView(monthOf(now));
    if (closeOnQuickAction) onDismiss(true);
  };

  const clear = () => {
    setEditedTime(undefined);
    config.onChange(undefined);
    if (closeOnQuickAction) onDismiss(true);
  };

  const moveMonth = (delta: number) =>
    setView((current) =>
      monthOf(new Date(current.year, current.month + delta))
    );

  const moveFocus = (from: Date, deltaDays: number) => {
    const target = new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate() + deltaDays
    );
    flushSync(() => setView(monthOf(target)));
    focusDay(dayKey(target));
  };

  const handleDayKeyDown = (event: React.KeyboardEvent, date: Date) => {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -DAYS_PER_WEEK,
      ArrowDown: DAYS_PER_WEEK,
    };
    if (event.key in deltas) {
      event.preventDefault();
      moveFocus(date, deltas[event.key]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectDay(date);
    }
  };

  const firstDayOfWeek = locale.firstDayOfWeek;
  const weekdays = Array.from(
    { length: DAYS_PER_WEEK },
    (_, index) => (firstDayOfWeek + index) % DAYS_PER_WEEK
  );
  const selected = value;
  const todayDate = new Date();
  const days = calendarDays(view, firstDayOfWeek);
  const inView = (date: Date) =>
    date.getFullYear() === view.year && date.getMonth() === view.month;
  
  
  const preferredStop = [selected, todayDate].find(
    (date): date is Date => date !== undefined && inView(date)
  );
  const tabStopDate =
    preferredStop && !isDayDisabled(preferredStop)
      ? preferredStop
      : days.find((date) => inView(date) && !isDayDisabled(date));
  const tabStop = tabStopDate && dayKey(tabStopDate);

  return (
    <div
      ref={popupRef}
      className="journalit-date-picker"
      data-time-only={timeOnly ? 'true' : undefined}
      data-has-seconds={hasTime && showSeconds ? 'true' : undefined}
      data-open-upward={position.openUpward ? 'true' : undefined}
      dir="ltr"
      style={cssVars({
        '--journalit-date-picker-top': `${position.top}px`,
        '--journalit-date-picker-left': `${position.left}px`,
        '--journalit-date-picker-max-height': `${position.maxHeight}px`,
      })}
    >
      {!timeOnly && (
        <>
          <div className="journalit-date-picker__header">
            <button
              type="button"
              className="clickable-icon journalit-date-picker__nav"
              aria-label={locale.labels.previousMonth}
              onClick={() => moveMonth(-1)}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="journalit-date-picker__title">
              <span className="journalit-date-picker__month">
                {locale.months[view.month]}
              </span>
              <YearInput
                year={view.year}
                label={locale.labels.year}
                onChange={(year) => setView({ year, month: view.month })}
              />
            </div>
            <button
              type="button"
              className="clickable-icon journalit-date-picker__nav"
              aria-label={locale.labels.nextMonth}
              onClick={() => moveMonth(1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="journalit-date-picker__weekdays" aria-hidden="true">
            {weekdays.map((day) => (
              <span key={day} className="journalit-date-picker__weekday">
                {locale.weekdaysShort[day]}
              </span>
            ))}
          </div>
          <div className="journalit-date-picker__days">
            {days.map((date) => {
              const disabled = isDayDisabled(date);
              const isSelected = Boolean(selected && sameDay(date, selected));
              const isToday = sameDay(date, todayDate);
              
              
              
              const isActive = isSelected || (!selected && isToday);
              return (
                <button
                  key={dayKey(date)}
                  type="button"
                  className="journalit-date-picker__day"
                  data-day={dayKey(date)}
                  data-outside-month={inView(date) ? undefined : 'true'}
                  data-today={isToday && !isActive ? 'true' : undefined}
                  data-active={isActive ? 'true' : undefined}
                  aria-current={isToday ? 'date' : undefined}
                  aria-pressed={isSelected}
                  aria-label={dayLabel(date, locale)}
                  disabled={disabled}
                  tabIndex={dayKey(date) === tabStop ? 0 : -1}
                  onClick={() => selectDay(date)}
                  onKeyDown={(event) => handleDayKeyDown(event, date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </>
      )}
      <div className="journalit-date-picker__footer">
        <button
          type="button"
          className="journalit-date-picker__action"
          onClick={clear}
        >
          {t('datepicker.button.clear')}
        </button>
        {hasTime && (
          <TimeFields
            time={time}
            showSeconds={showSeconds}
            use24HourTime={use24HourTime}
            locale={locale}
            autoFocus={timeOnly}
            onCommit={commitTime}
            onEnter={() => onDismiss(true)}
          />
        )}
        <button
          type="button"
          className="journalit-date-picker__action"
          disabled={!todayAllowed(todayDate)}
          onClick={today}
        >
          {t(timeOnly ? 'datepicker.button.now' : 'datepicker.button.today')}
        </button>
      </div>
    </div>
  );
};


const YearInput: React.FC<{
  year: number;
  label: string;
  onChange: (year: number) => void;
}> = ({ year, label, onChange }) => {
  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <span className="journalit-date-picker__year">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        className="journalit-date-picker__year-input"
        aria-label={label}
        value={draft ?? String(year)}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
          setDraft(digits);
          if (digits.length === 4) onChange(Number(digits));
        }}
        onBlur={() => setDraft(null)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            setDraft(null);
            onChange(year + (event.key === 'ArrowUp' ? 1 : -1));
          }
        }}
      />
      <Stepper
        field={inputRef}
        onStep={(delta) => {
          setDraft(null);
          onChange(year + delta);
        }}
      />
    </span>
  );
};

const Stepper: React.FC<{
  field: React.RefObject<HTMLInputElement | null>;
  onStep: (delta: 1 | -1) => void;
}> = ({ field, onStep }) => (
  <span className="journalit-date-picker__stepper" aria-hidden="true">
    {([1, -1] as const).map((delta) => (
      <button
        key={delta}
        type="button"
        tabIndex={-1}
        className="journalit-date-picker__step"
        
        
        onMouseDown={(event) => {
          event.preventDefault();
          field.current?.focus();
        }}
        onClick={() => onStep(delta)}
      >
        {delta === 1 ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </button>
    ))}
  </span>
);

interface TimeFieldsProps {
  time: TimeParts;
  showSeconds: boolean;
  use24HourTime: boolean;
  locale: DatePickerLocale;
  autoFocus: boolean;
  onCommit: (time: TimeParts) => void;
  onEnter: () => void;
}

const TimeFields: React.FC<TimeFieldsProps> = ({
  time,
  showSeconds,
  use24HourTime,
  locale,
  autoFocus,
  onCommit,
  onEnter,
}) => {
  const isPm = time.hour >= 12;
  const displayHour = use24HourTime ? time.hour : time.hour % 12 || 12;
  const toHour24 = (hour: number) =>
    use24HourTime ? hour : (hour % 12) + (isPm ? 12 : 0);
  return (
    <div className="journalit-date-picker__time">
      <TimeField
        className="journalit-date-picker__hour"
        label={locale.labels.hour}
        value={displayHour}
        min={use24HourTime ? 0 : 1}
        max={use24HourTime ? 23 : 12}
        autoFocus={autoFocus}
        onCommit={(hour) => onCommit({ ...time, hour: toHour24(hour) })}
        onEnter={onEnter}
      />
      <span className="journalit-date-picker__separator">:</span>
      <TimeField
        className="journalit-date-picker__minute"
        label={locale.labels.minute}
        value={time.minute}
        min={0}
        max={59}
        onCommit={(minute) => onCommit({ ...time, minute })}
        onEnter={onEnter}
      />
      {showSeconds && (
        <>
          <span className="journalit-date-picker__separator">:</span>
          <TimeField
            className="journalit-date-picker__second"
            label={locale.labels.second}
            value={time.second}
            min={0}
            max={59}
            onCommit={(second) => onCommit({ ...time, second })}
            onEnter={onEnter}
          />
        </>
      )}
      {!use24HourTime && (
        <button
          type="button"
          className="journalit-date-picker__ampm"
          onClick={() => onCommit({ ...time, hour: (time.hour + 12) % 24 })}
        >
          {isPm ? 'PM' : 'AM'}
        </button>
      )}
    </div>
  );
};


const TimeField: React.FC<{
  className: string;
  label: string;
  value: number;
  min: number;
  max: number;
  autoFocus?: boolean;
  onCommit: (value: number) => void;
  onEnter: () => void;
}> = ({ className, label, value, min, max, autoFocus, onCommit, onEnter }) => {
  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!autoFocus) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [autoFocus]);

  const step = (delta: 1 | -1) => {
    
    const parsed = draft ? Number.parseInt(draft, 10) : Number.NaN;
    const current = Number.isNaN(parsed)
      ? value
      : Math.min(max, Math.max(min, parsed));
    setDraft(null);
    const span = max - min + 1;
    onCommit(((current - min + delta + span) % span) + min);
  };
  const commitDraft = () => {
    if (draft === null) return;
    setDraft(null);
    const parsed = Number.parseInt(draft, 10);
    if (Number.isNaN(parsed)) return;
    const next = Math.min(max, Math.max(min, parsed));
    if (next !== value) onCommit(next);
  };

  return (
    <span className="journalit-date-picker__time-unit">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        className={`journalit-date-picker__time-input ${className}`}
        aria-label={label}
        value={draft ?? String(value).padStart(2, '0')}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) =>
          setDraft(event.target.value.replace(/\D/g, '').slice(0, 2))
        }
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            step(event.key === 'ArrowUp' ? 1 : -1);
          } else if (event.key === 'Enter') {
            event.preventDefault();
            commitDraft();
            onEnter();
          }
        }}
      />
      <Stepper field={inputRef} onStep={step} />
    </span>
  );
};
