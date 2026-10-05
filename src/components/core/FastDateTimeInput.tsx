

import React, {
  useState,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useId,
  useLayoutEffect,
} from 'react';
import { CalendarIcon, ClockIcon } from '../shared/icons/ObsidianIcon';
import { getUserDateFormat } from '../../utils/dateUtils';
import { parseStoredDateLikeValue } from '../../utils/customFieldPersistence';
import { getPluginInstance } from '../../utils/pluginContext';
import { useDateTimePicker } from './useDateTimePicker';
import { DateDraftGateContext, type DateDraftCheck } from './DateDraftGate';
import { dateInputError } from './dateInputError';
import {
  dateToDraft,
  dateSegmentOrder,
  normalizeDateDigits,
  padDateDraft,
  parseDatePaste,
  resolveDateDraft,
  type DateSegment,
} from './dateInputDraft';

import { t } from '../../lang/helpers';


function getUse24HourTime(): boolean {
  try {
    const plugin = getPluginInstance();
    return plugin?.settings?.trade?.use24HourTime ?? false;
  } catch {
    return false;
  }
}

interface FastDateTimeInputProps {
  label?: string;
  ariaLabel?: string;
  value?: Date | string;
  onChange?: (date: Date | string | undefined) => void;
  
  commitValidSegmentChangesImmediately?: boolean;
  includeTime?: boolean;
  
  showSeconds?: boolean;
  timeOnly?: boolean;
  
  use24HourTime?: boolean;
  required?: boolean;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  defaultDateWhenEmpty?: Date;
  onBlankTimeDateChange?: (date: Date | undefined) => void;
  hidePickerButton?: boolean;
  openPickerSignal?: number;
  pickerPositionElement?: HTMLElement | null;
  controllerOnly?: boolean;
  onPickerClose?: () => void;
  closePickerOnQuickAction?: boolean;
}

type SegmentState = {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
  ampm: 'AM' | 'PM';
};

type EditableSegment = Exclude<keyof SegmentState, 'ampm'>;

type SegmentValueResult =
  | { kind: 'invalid' }
  | { kind: 'empty' }
  | { kind: 'value'; value: Date | string }
  | { kind: 'blank-time'; value: Date };

const INITIAL_SEGMENTS: SegmentState = {
  day: '',
  month: '',
  year: '',
  hour: '',
  minute: '',
  second: '',
  ampm: 'AM',
};

function valueKey(value: Date | string | undefined): string {
  return value instanceof Date
    ? `date:${value.getTime()}`
    : value === undefined
      ? 'empty'
      : `time:${value}`;
}

function timeString(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export const FastDateTimeInput: React.FC<FastDateTimeInputProps> = React.memo(
  ({
    label,
    ariaLabel,
    value,
    onChange,
    commitValidSegmentChangesImmediately = false,
    includeTime = false,
    showSeconds = false,
    timeOnly = false,
    use24HourTime: use24HourTimeOverride,
    required = false,
    error,
    disabled = false,
    className,
    minDate,
    defaultDateWhenEmpty,
    onBlankTimeDateChange,
    hidePickerButton = false,
    openPickerSignal = 0,
    pickerPositionElement = null,
    controllerOnly = false,
    onPickerClose,
    closePickerOnQuickAction = true,
  }) => {
    
    const userDateFormat = getUserDateFormat();
    const use24HourTime = useMemo(
      () => use24HourTimeOverride ?? getUse24HourTime(),
      [use24HourTimeOverride]
    );
    const shouldShowSeconds = showSeconds && includeTime && !timeOnly;

    
    const normalizedValue = useMemo(() => {
      if (!value) return defaultDateWhenEmpty;
      return parseStoredDateLikeValue(value, { includeTime, timeOnly });
    }, [value, defaultDateWhenEmpty, includeTime, timeOnly]);

    const shouldDisplayBlankTime = !value && Boolean(defaultDateWhenEmpty);

    const [segments, setSegments] = useState(INITIAL_SEGMENTS);
    
    
    const segmentsRef = useRef(segments);
    const draftDirty = useRef(false);
    const dispatchSegments = useCallback((update: Partial<SegmentState>) => {
      const next = { ...segmentsRef.current, ...update };
      segmentsRef.current = next;
      setSegments(next);
    }, []);
    const [dateTouched, setDateTouched] = useState(false);
    const dateGate = useContext(DateDraftGateContext);
    const draftId = useId();
    const lastEmission = useRef<string | null>(null);
    const { day, month, year, hour, minute, second, ampm } = segments;

    const setDay = useCallback(
      (nextDay: string) => dispatchSegments({ day: nextDay }),
      [dispatchSegments]
    );
    const setMonth = useCallback(
      (nextMonth: string) => dispatchSegments({ month: nextMonth }),
      [dispatchSegments]
    );
    const setYear = useCallback(
      (nextYear: string) => dispatchSegments({ year: nextYear }),
      [dispatchSegments]
    );
    const setHour = useCallback(
      (nextHour: string) => dispatchSegments({ hour: nextHour }),
      [dispatchSegments]
    );
    const setMinute = useCallback(
      (nextMinute: string) => dispatchSegments({ minute: nextMinute }),
      [dispatchSegments]
    );
    const setSecond = useCallback(
      (nextSecond: string) => dispatchSegments({ second: nextSecond }),
      [dispatchSegments]
    );
    const setAmpm = useCallback(
      (nextAmpm: 'AM' | 'PM') => dispatchSegments({ ampm: nextAmpm }),
      [dispatchSegments]
    );

    
    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);
    const secondRef = useRef<HTMLInputElement>(null);
    const ampmButtonRef = useRef<HTMLButtonElement>(null);
    const calendarButtonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastOpenPickerSignalRef = useRef(0);

    const syncSegmentsWithValue = useCallback(
      (nextValue: Date | undefined, blankTime: boolean) => {
        if (nextValue) {
          const nextSegments: Partial<SegmentState> = {
            ...dateToDraft(nextValue),
          };

          if (includeTime || timeOnly) {
            if (blankTime) {
              dispatchSegments({
                ...nextSegments,
                hour: '',
                minute: '',
                second: '',
                ampm: 'AM',
              });
              return;
            }
            const hours = nextValue.getHours();
            if (use24HourTime) {
              nextSegments.hour = String(hours).padStart(2, '0');
            } else {
              const h12 = hours % 12 || 12;
              nextSegments.hour = String(h12).padStart(2, '0');
              nextSegments.ampm = hours >= 12 ? 'PM' : 'AM';
            }
            nextSegments.minute = String(nextValue.getMinutes()).padStart(
              2,
              '0'
            );
            nextSegments.second = String(nextValue.getSeconds()).padStart(
              2,
              '0'
            );
          }

          dispatchSegments(nextSegments);
        } else {
          dispatchSegments(INITIAL_SEGMENTS);
        }
      },
      [dispatchSegments, includeTime, timeOnly, use24HourTime]
    );

    
    
    const normalizedTimestamp = normalizedValue?.getTime();
    const usesBlankTimeDate = Boolean(onBlankTimeDateChange);
    useEffect(() => {
      const next =
        normalizedTimestamp === undefined
          ? undefined
          : new Date(normalizedTimestamp);
      const key =
        shouldDisplayBlankTime && usesBlankTimeDate && next
          ? `blank:${next.getTime()}`
          : valueKey(timeOnly && next ? timeString(next) : next);
      const focused = [
        dayRef,
        monthRef,
        yearRef,
        hourRef,
        minuteRef,
        secondRef,
      ].some((ref) => ref.current === window.activeDocument.activeElement);
      if (focused && lastEmission.current === key) return;
      lastEmission.current = key;
      draftDirty.current = false;
      syncSegmentsWithValue(next, shouldDisplayBlankTime);
    }, [
      normalizedTimestamp,
      shouldDisplayBlankTime,
      syncSegmentsWithValue,
      timeOnly,
      usesBlankTimeDate,
    ]);

    
    const validateTime = useCallback(
      (
        h: number,
        m: number,
        meridiem: 'AM' | 'PM',
        s = 0
      ): { hours: number; minutes: number; seconds: number } => {
        
        const minutes = Math.max(0, Math.min(59, m));
        const seconds = Math.max(0, Math.min(59, s));

        let hours = h;
        if (use24HourTime) {
          
          hours = Math.max(0, Math.min(23, h));
        } else {
          
          hours = Math.max(1, Math.min(12, h));
          if (meridiem === 'PM' && hours !== 12) hours += 12;
          else if (meridiem === 'AM' && hours === 12) hours = 0;
        }

        return { hours, minutes, seconds };
      },
      [use24HourTime]
    );

    
    const buildValueFromSegments = useCallback(
      (
        candidateSegments: SegmentState,
        meridiem: 'AM' | 'PM' = candidateSegments.ampm
      ): SegmentValueResult => {
        const {
          day: candidateDay,
          month: candidateMonth,
          year: candidateYear,
          hour: candidateHour,
          minute: candidateMinute,
          second: candidateSecond,
        } = candidateSegments;

        if (timeOnly) {
          if (!candidateHour && !candidateMinute) {
            return { kind: 'empty' };
          }

          
          const h = parseInt(candidateHour, 10);
          const m = parseInt(candidateMinute, 10);
          if (isNaN(h) || isNaN(m)) {
            return { kind: 'invalid' };
          }

          const { hours, minutes } = validateTime(h, m, meridiem);

          
          const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
          return { kind: 'value', value: timeString };
        }

        if (
          !candidateDay &&
          !candidateMonth &&
          !candidateYear &&
          (!includeTime || (!candidateHour && !candidateMinute))
        ) {
          return { kind: 'empty' };
        }

        const resolved = resolveDateDraft({
          day: candidateDay,
          month: candidateMonth,
          year: candidateYear,
        });
        if (resolved.kind !== 'valid') return { kind: 'invalid' };
        const date = resolved.date;

        if (includeTime) {
          if (!candidateHour || !candidateMinute) {
            return { kind: 'blank-time', value: date };
          }

          const h = parseInt(candidateHour, 10);
          const m = parseInt(candidateMinute, 10);
          const s = parseInt(candidateSecond || '0', 10);

          const { hours, minutes, seconds } = validateTime(h, m, meridiem, s);
          date.setHours(hours, minutes, seconds, 0);
        }

        return { kind: 'value', value: date };
      },
      [timeOnly, includeTime, validateTime]
    );

    const emitValue = useCallback(
      (result: SegmentValueResult) => {
        if (result.kind === 'invalid') return false;
        const key =
          result.kind === 'blank-time' && onBlankTimeDateChange
            ? `blank:${result.value.getTime()}`
            : valueKey(result.kind === 'empty' ? undefined : result.value);
        draftDirty.current = false;
        if (lastEmission.current === key) return false;
        lastEmission.current = key;
        switch (result.kind) {
          case 'empty':
            onChange?.(undefined);
            return true;
          case 'value':
            onChange?.(result.value);
            return true;
          case 'blank-time':
            if (onBlankTimeDateChange) {
              onChange?.(undefined);
              onBlankTimeDateChange(result.value);
              return true;
            }

            result.value.setHours(0, 0, 0, 0);
            onChange?.(result.value);
            return true;
          default: {
            const exhaustiveResult: never = result;
            return exhaustiveResult;
          }
        }
      },
      [onBlankTimeDateChange, onChange]
    );

    
    const updateValue = useCallback(
      (meridiem?: 'AM' | 'PM') => {
        emitValue(buildValueFromSegments(segmentsRef.current, meridiem));
      },
      [buildValueFromSegments, emitValue]
    );

    const reconcileTimeDraft = useCallback(() => {
      const current = segmentsRef.current;
      if (!(includeTime || timeOnly) || !current.hour || !current.minute)
        return;
      const { hours, minutes, seconds } = validateTime(
        parseInt(current.hour, 10),
        parseInt(current.minute, 10),
        current.ampm,
        parseInt(current.second || '0', 10)
      );
      
      dispatchSegments({
        hour: String(use24HourTime ? hours : hours % 12 || 12).padStart(2, '0'),
        minute: String(minutes).padStart(2, '0'),
        second: String(seconds).padStart(2, '0'),
        ampm: hours >= 12 ? 'PM' : 'AM',
      });
    }, [dispatchSegments, includeTime, timeOnly, use24HourTime, validateTime]);

    const commitDraft = useCallback(() => {
      setDateTouched(true);
      const edited = draftDirty.current;
      dispatchSegments(padDateDraft(segmentsRef.current));
      reconcileTimeDraft();
      
      if (!edited) return false;
      return emitValue(buildValueFromSegments(segmentsRef.current));
    }, [
      buildValueFromSegments,
      dispatchSegments,
      emitValue,
      reconcileTimeDraft,
    ]);

    const draftCheck: DateDraftCheck = {
      check: () => {
        const current = segmentsRef.current;
        if (timeOnly) {
          const result = buildValueFromSegments(current);
          if (
            result.kind === 'invalid' ||
            (required && result.kind === 'empty')
          ) {
            setDateTouched(true);
            return 'invalid';
          }
        } else {
          const result = resolveDateDraft(padDateDraft(current));
          const dateMissingWithTime =
            result.kind === 'empty' &&
            includeTime &&
            Boolean(current.hour || current.minute || current.second);
          if (
            result.kind !== 'valid' &&
            !(result.kind === 'empty' && !required && !dateMissingWithTime)
          ) {
            setDateTouched(true);
            return 'invalid';
          }
        }
        return draftDirty.current && commitDraft() ? 'committed' : 'valid';
      },
      focus: () => {
        const current = segmentsRef.current;
        if (timeOnly) {
          (current.hour ? minuteRef : hourRef).current?.focus();
          return;
        }
        const result = resolveDateDraft(current);
        const field =
          result.kind === 'invalid'
            ? result.field
            : (dateSegmentOrder(getUserDateFormat()).find(
                (part) =>
                  !current[part] ||
                  (part === 'year' &&
                    current.year.length !== 2 &&
                    current.year.length !== 4)
              ) ?? 'day');
        ({ day: dayRef, month: monthRef, year: yearRef })[
          field
        ].current?.focus();
      },
    };
    const latestDraftCheck = useRef(draftCheck);
    useLayoutEffect(() => {
      latestDraftCheck.current = draftCheck;
    });
    useLayoutEffect(() => {
      if (!dateGate || controllerOnly || disabled) return;
      return dateGate.register(draftId, {
        check: () => latestDraftCheck.current.check(),
        focus: () => latestDraftCheck.current.focus(),
      });
    }, [controllerOnly, dateGate, disabled, draftId]);

    const handleSegmentKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
      if (commitDraft()) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleAmpmToggle = useCallback(() => {
      const nextAmpm = ampm === 'AM' ? 'PM' : 'AM';
      draftDirty.current = true;
      setAmpm(nextAmpm);
      if (hour && minute && (includeTime || timeOnly)) {
        updateValue(nextAmpm);
      }
    }, [ampm, hour, includeTime, minute, setAmpm, timeOnly, updateValue]);

    
    const handleSegmentChange = (
      value: string,
      segment: EditableSegment,
      setter: (v: string) => void,
      maxLength: number,
      nextRef?: React.RefObject<HTMLInputElement | null>
    ) => {
      const dateSegment =
        segment === 'day' || segment === 'month' || segment === 'year';
      const digits = dateSegment
        ? normalizeDateDigits(value)
        : value.replace(/\D/g, '').slice(0, maxLength);
      draftDirty.current = true;
      setter(digits);

      
      if (
        (dateSegment || commitValidSegmentChangesImmediately) &&
        !(segment === 'year' && digits.length === 2)
      ) {
        emitValue(buildValueFromSegments(segmentsRef.current));
      }

      const dateResult = dateSegment
        ? resolveDateDraft(segmentsRef.current)
        : undefined;
      if (
        digits.length === maxLength &&
        /^\d+$/.test(digits) &&
        nextRef?.current &&
        !(dateResult?.kind === 'invalid' && dateResult.field === segment)
      ) {
        nextRef.current.focus();
        nextRef.current.select();
      }
    };

    
    const commitDateTimeSegments = useCallback(
      (event: React.FocusEvent<HTMLDivElement>) => {
        const isStillEditing = [
          dayRef,
          monthRef,
          yearRef,
          hourRef,
          minuteRef,
          secondRef,
          ampmButtonRef,
        ].some(
          (ref) => ref.current !== null && ref.current === event.relatedTarget
        );
        if (isStillEditing) {
          if (
            draftDirty.current &&
            [dayRef, monthRef, yearRef].some(
              (ref) => ref.current === event.target
            )
          ) {
            dispatchSegments(padDateDraft(segmentsRef.current));
            updateValue();
          }
          return;
        }
        commitDraft();
      },
      [commitDraft, dispatchSegments, updateValue]
    );

    const handleDatePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = parseDatePaste(
        event.clipboardData.getData('text'),
        userDateFormat
      );
      if (!pasted) return;
      event.preventDefault();
      draftDirty.current = true;
      setDateTouched(true);
      dispatchSegments(pasted);
      updateValue();
    };

    const dateResult = resolveDateDraft({ day, month, year });
    const draftError = timeOnly
      ? undefined
      : dateInputError(
          dateResult,
          dateTouched,
          required || (includeTime && Boolean(hour || minute || second))
        );
    const timeResult = timeOnly ? buildValueFromSegments(segments) : undefined;
    const timeDraftError =
      dateTouched &&
      timeResult &&
      (timeResult.kind === 'invalid' ||
        (required && timeResult.kind === 'empty'))
        ? t('validation.custom-field.time', {
            label: label ?? ariaLabel ?? 'HH:MM',
          })
        : undefined;
    const displayedError = draftError ?? timeDraftError ?? error;
    const errorId = useId();
    const dateAria = (field: DateSegment) => ({
      'aria-invalid': Boolean(
        draftError &&
        (dateResult.kind !== 'invalid' || dateResult.field === field)
      ),
      'aria-describedby': displayedError ? errorId : undefined,
    });

    const acceptPickerDate = (date: Date | undefined, blankTime = false) => {
      
      
      
      
      if (date || !normalizedValue) syncSegmentsWithValue(date, blankTime);
      setDateTouched(true);
      emitValue(
        !date
          ? { kind: 'empty' }
          : blankTime
            ? { kind: 'blank-time', value: date }
            : { kind: 'value', value: timeOnly ? timeString(date) : date }
      );
    };

    const openPicker = useDateTimePicker({
      containerRef,
      triggerRef: calendarButtonRef,
      positionElement: pickerPositionElement,
      value: normalizedValue,
      disabled,
      includeTime,
      timeOnly,
      showSeconds: shouldShowSeconds,
      use24HourTime,
      minDate,
      closeOnQuickAction: closePickerOnQuickAction,
      onClose: onPickerClose,
      onChange: (date) => {
        if (!date) {
          acceptPickerDate(undefined);
          return;
        }
        if (timeOnly) {
          acceptPickerDate(date);
        } else {
          if (includeTime && !shouldShowSeconds)
            date.setSeconds(parseInt(segmentsRef.current.second, 10) || 0, 0);
          acceptPickerDate(date);
        }
      },
      onSelectDay: (date, pickerTime) => {
        const current = segmentsRef.current;
        if (includeTime && !timeOnly) {
          if (
            onBlankTimeDateChange &&
            !pickerTime &&
            (!current.hour || !current.minute)
          ) {
            acceptPickerDate(date, true);
            return;
          }
          let hours =
            pickerTime?.getHours() ?? (parseInt(current.hour, 10) || 0);
          if (!pickerTime && !use24HourTime) {
            if (current.ampm === 'PM' && hours !== 12) hours += 12;
            if (current.ampm === 'AM' && hours === 12) hours = 0;
          }
          date.setHours(
            hours,
            pickerTime?.getMinutes() ?? (parseInt(current.minute, 10) || 0),
            shouldShowSeconds && pickerTime
              ? pickerTime.getSeconds()
              : parseInt(current.second, 10) || 0,
            0
          );
        }
        acceptPickerDate(date);
        return date;
      },
      onToday: (date) => {
        acceptPickerDate(date);
      },
    });

    const handleOpenCalendar = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openPicker();
      },
      [openPicker]
    );

    useEffect(() => {
      if (openPickerSignal === lastOpenPickerSignalRef.current) return;
      lastOpenPickerSignalRef.current = openPickerSignal;
      if (openPickerSignal > 0) openPicker();
    }, [openPicker, openPickerSignal]);

    
    
    
    
    
    const getDateSegments = () => {
      const timeRef = includeTime || timeOnly ? hourRef : undefined;

      const segments = {
        day: (
          <input
            ref={dayRef}
            type="text"
            inputMode="numeric"
            value={day}
            onChange={(e) =>
              handleSegmentChange(
                e.target.value,
                'day',
                setDay,
                2,
                userDateFormat === 'DDMMYY'
                  ? monthRef
                  : userDateFormat === 'MMDDYY'
                    ? yearRef
                    :  timeRef
              )
            }
            onKeyDown={handleSegmentKeyDown}
            placeholder={t('datepicker.placeholder.day')}
            onPaste={handleDatePaste}
            {...dateAria('day')}
            data-segment="day"
            disabled={disabled}
            className="segment-input journalit-fast-datetime__segment"
          />
        ),
        month: (
          <input
            ref={monthRef}
            type="text"
            inputMode="numeric"
            value={month}
            onChange={(e) =>
              handleSegmentChange(
                e.target.value,
                'month',
                setMonth,
                2,
                userDateFormat === 'DDMMYY'
                  ? yearRef
                  : userDateFormat === 'MMDDYY'
                    ? dayRef
                    :  dayRef
              )
            }
            onKeyDown={handleSegmentKeyDown}
            placeholder={t('datepicker.placeholder.month')}
            onPaste={handleDatePaste}
            {...dateAria('month')}
            data-segment="month"
            disabled={disabled}
            className="segment-input journalit-fast-datetime__segment"
          />
        ),
        year: (
          <input
            ref={yearRef}
            type="text"
            inputMode="numeric"
            value={year}
            onChange={(e) =>
              handleSegmentChange(
                e.target.value,
                'year',
                setYear,
                4,
                userDateFormat === 'YYMMDD' ? monthRef : timeRef
              )
            }
            placeholder={t('datepicker.placeholder.year')}
            onPaste={handleDatePaste}
            {...dateAria('year')}
            data-segment="year"
            onKeyDown={handleSegmentKeyDown}
            data-year-extended={year.length > 2 ? 'true' : undefined}
            disabled={disabled}
            className="segment-input journalit-fast-datetime__segment"
          />
        ),
      };

      switch (userDateFormat) {
        case 'MMDDYY':
          return [
            { key: 'month', element: segments.month },
            { key: 'day', element: segments.day },
            { key: 'year', element: segments.year },
          ];
        case 'YYMMDD':
          return [
            { key: 'year', element: segments.year },
            { key: 'month', element: segments.month },
            { key: 'day', element: segments.day },
          ];
        case 'DDMMYY':
        default:
          return [
            { key: 'day', element: segments.day },
            { key: 'month', element: segments.month },
            { key: 'year', element: segments.year },
          ];
      }
    };

    
    const labelId = useId();
    const hasTimeContent = includeTime || timeOnly;
    const isDateOnly = !hasTimeContent;

    return (
      <div
        className={['journalit-fast-datetime', className]
          .filter(Boolean)
          .join(' ')}
        data-controller-only={controllerOnly ? 'true' : 'false'}
      >
        {label && (
          <div id={labelId} className="journalit-fast-datetime__label">
            {label}
            {required && (
              <span className="journalit-fast-datetime__required">*</span>
            )}
          </div>
        )}

        <div
          ref={containerRef}
          dir="ltr"
          role="group"
          aria-label={label ? undefined : ariaLabel}
          aria-labelledby={label ? labelId : undefined}
          className="journalit-fast-datetime__container"
          data-date-only={isDateOnly ? 'true' : 'false'}
          data-timestamp={includeTime && !timeOnly ? 'true' : 'false'}
          data-has-seconds={shouldShowSeconds ? 'true' : 'false'}
          data-has-error={displayedError ? 'true' : 'false'}
          aria-describedby={displayedError ? errorId : undefined}
          onBlur={commitDateTimeSegments}
        >
          
          {!controllerOnly && !timeOnly && (
            <div className="journalit-fast-datetime__date-group">
              {getDateSegments().map((segment, i) => (
                <React.Fragment key={segment.key}>
                  {segment.element}
                  {i < 2 && (
                    <span className="journalit-fast-datetime__separator">
                      /
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          
          {!controllerOnly && (includeTime || timeOnly) && (
            <div className="journalit-fast-datetime__time-group">
              {!timeOnly && (
                <span
                  className="journalit-fast-datetime__separator journalit-fast-datetime__separator--spacer"
                  aria-hidden="true"
                />
              )}
              <input
                ref={hourRef}
                type="text"
                inputMode="numeric"
                value={hour}
                onChange={(e) =>
                  handleSegmentChange(
                    e.target.value,
                    'hour',
                    setHour,
                    2,
                    minuteRef
                  )
                }
                onKeyDown={handleSegmentKeyDown}
                aria-invalid={Boolean(timeDraftError)}
                aria-describedby={displayedError ? errorId : undefined}
                placeholder={t('datepicker.placeholder.hour')}
                data-segment="hour"
                disabled={disabled}
                className="segment-input journalit-fast-datetime__segment"
              />
              <span className="journalit-fast-datetime__separator">:</span>
              <input
                ref={minuteRef}
                type="text"
                inputMode="numeric"
                value={minute}
                onChange={(e) =>
                  handleSegmentChange(
                    e.target.value,
                    'minute',
                    setMinute,
                    2,
                    shouldShowSeconds ? secondRef : undefined
                  )
                }
                onKeyDown={handleSegmentKeyDown}
                aria-invalid={Boolean(timeDraftError)}
                aria-describedby={displayedError ? errorId : undefined}
                placeholder={t('datepicker.placeholder.minute')}
                data-segment="minute"
                disabled={disabled}
                className="segment-input journalit-fast-datetime__segment"
              />
              {shouldShowSeconds && (
                <>
                  <span className="journalit-fast-datetime__separator">:</span>
                  <input
                    ref={secondRef}
                    type="text"
                    inputMode="numeric"
                    value={second}
                    onChange={(e) =>
                      handleSegmentChange(
                        e.target.value,
                        'second',
                        setSecond,
                        2
                      )
                    }
                    onKeyDown={handleSegmentKeyDown}
                    aria-invalid={Boolean(timeDraftError)}
                    aria-describedby={displayedError ? errorId : undefined}
                    placeholder={t('datepicker.placeholder.second')}
                    data-segment="second"
                    disabled={disabled}
                    className="segment-input journalit-fast-datetime__segment"
                  />
                </>
              )}
              {!use24HourTime && (
                <button
                  ref={ampmButtonRef}
                  type="button"
                  onClick={handleAmpmToggle}
                  disabled={disabled}
                  className="journalit-fast-datetime__ampm-button"
                >
                  {ampm}
                </button>
              )}
            </div>
          )}

          
          {!controllerOnly && !hidePickerButton && (
            <button
              ref={calendarButtonRef}
              type="button"
              onClick={handleOpenCalendar}
              disabled={disabled}
              className="clickable-icon journalit-fast-datetime__calendar-button"
              aria-label={t('datetime.aria.open-picker')}
            >
              {timeOnly ? <ClockIcon size={18} /> : <CalendarIcon size={18} />}
            </button>
          )}
        </div>

        {displayedError && (
          <span
            id={errorId}
            role="alert"
            className="journalit-fast-datetime__error"
          >
            {displayedError}
          </span>
        )}
      </div>
    );
  }
);

FastDateTimeInput.displayName = 'FastDateTimeInput';
