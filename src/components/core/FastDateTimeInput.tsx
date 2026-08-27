

import React, {
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useId,
  useLayoutEffect,
} from 'react';
import { CalendarIcon, ClockIcon } from '../shared/icons/ObsidianIcon';
import flatpickr from 'flatpickr';
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import type { CustomLocale } from 'flatpickr/dist/types/locale';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { German } from 'flatpickr/dist/l10n/de';
import { French } from 'flatpickr/dist/l10n/fr';
import { Vietnamese } from 'flatpickr/dist/l10n/vn';
import { Hindi } from 'flatpickr/dist/l10n/hi';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import { Mandarin } from 'flatpickr/dist/l10n/zh';
import { MandarinTraditional } from 'flatpickr/dist/l10n/zh-tw';
import { Japanese } from 'flatpickr/dist/l10n/ja';
import { Korean } from 'flatpickr/dist/l10n/ko';
import { Russian } from 'flatpickr/dist/l10n/ru';
import { Italian } from 'flatpickr/dist/l10n/it';
import {
  getUserDateFormat,
  getWeekStartDayIndex,
  getWeekStartDaySetting,
} from '../../utils/dateUtils';
import { parseStoredDateLikeValue } from '../../utils/customFieldPersistence';
import { getPluginInstance } from '../../utils/pluginContext';

const Tamil: CustomLocale = {
  weekdays: {
    shorthand: ['ஞாயி', 'திங்', 'செவ்', 'புத', 'வியா', 'வெள்', 'சனி'],
    longhand: [
      'ஞாயிறு',
      'திங்கள்',
      'செவ்வாய்',
      'புதன்',
      'வியாழன்',
      'வெள்ளி',
      'சனி',
    ],
  },
  months: {
    shorthand: [
      'ஜன',
      'பிப்',
      'மார்',
      'ஏப்',
      'மே',
      'ஜூன்',
      'ஜூலை',
      'ஆக',
      'செப்',
      'அக்',
      'நவ',
      'டிச',
    ],
    longhand: [
      'ஜனவரி',
      'பிப்ரவரி',
      'மார்ச்',
      'ஏப்ரல்',
      'மே',
      'ஜூன்',
      'ஜூலை',
      'ஆகஸ்ட்',
      'செப்டம்பர்',
      'அக்டோபர்',
      'நவம்பர்',
      'டிசம்பர்',
    ],
  },
  firstDayOfWeek: 0,
  rangeSeparator: ' முதல் ',
  weekAbbreviation: 'வா',
  scrollTitle: 'மாற்ற உருட்டவும்',
  toggleTitle: 'மாற்ற கிளிக் செய்யவும்',
  time_24hr: false,
};

function getFlatpickrDayDate(value: EventTarget | null): Date | undefined {
  if (typeof value !== 'object' || value === null) return undefined;

  const ownerDocument: unknown = Reflect.get(value, 'ownerDocument');
  const defaultView: unknown =
    typeof ownerDocument === 'object' && ownerDocument !== null
      ? Reflect.get(ownerDocument, 'defaultView')
      : undefined;
  const HTMLElementConstructor: unknown =
    typeof defaultView === 'object' && defaultView !== null
      ? Reflect.get(defaultView, 'HTMLElement')
      : undefined;
  if (typeof HTMLElementConstructor !== 'function') return undefined;
  if (!(value instanceof HTMLElementConstructor)) return undefined;

  const dateObj: unknown = Reflect.get(value, 'dateObj');
  return dateObj instanceof Date ? dateObj : undefined;
}


const flatpickrLocales: Record<string, CustomLocale> = {
  es: Spanish,
  de: German,
  fr: French,
  vi: Vietnamese,
  hi: Hindi,
  'pt-BR': Portuguese,
  zh: Mandarin,
  'zh-TW': MandarinTraditional,
  ja: Japanese,
  ko: Korean,
  ru: Russian,
  it: Italian,
  ta: Tamil,
};
import { t, getCurrentLanguage } from '../../lang/helpers';


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

    const [segments, dispatchSegments] = useReducer(
      (state: SegmentState, update: Partial<SegmentState>): SegmentState => ({
        ...state,
        ...update,
      }),
      INITIAL_SEGMENTS
    );
    const { day, month, year, hour, minute, second, ampm } = segments;

    const setDay = useCallback(
      (nextDay: string) => dispatchSegments({ day: nextDay }),
      []
    );
    const setMonth = useCallback(
      (nextMonth: string) => dispatchSegments({ month: nextMonth }),
      []
    );
    const setYear = useCallback(
      (nextYear: string) => dispatchSegments({ year: nextYear }),
      []
    );
    const setHour = useCallback(
      (nextHour: string) => dispatchSegments({ hour: nextHour }),
      []
    );
    const setMinute = useCallback(
      (nextMinute: string) => dispatchSegments({ minute: nextMinute }),
      []
    );
    const setSecond = useCallback(
      (nextSecond: string) => dispatchSegments({ second: nextSecond }),
      []
    );
    const setAmpm = useCallback(
      (nextAmpm: 'AM' | 'PM') => dispatchSegments({ ampm: nextAmpm }),
      []
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
    const flatpickrRef = useRef<FlatpickrInstance | null>(null);
    const tempInputRef = useRef<HTMLInputElement | null>(null);
    const lastOpenPickerSignalRef = useRef(0);
    const normalizedValueRef = useRef(normalizedValue);
    const shouldDisplayBlankTimeRef = useRef(shouldDisplayBlankTime);

    
    const hourValueRef = useRef(hour);
    const minuteValueRef = useRef(minute);
    const secondValueRef = useRef(second);
    const ampmValueRef = useRef(ampm);
    useLayoutEffect(() => {
      normalizedValueRef.current = normalizedValue;
      shouldDisplayBlankTimeRef.current = shouldDisplayBlankTime;
      hourValueRef.current = hour;
      minuteValueRef.current = minute;
      secondValueRef.current = second;
      ampmValueRef.current = ampm;
    }, [ampm, hour, minute, normalizedValue, second, shouldDisplayBlankTime]);

    const syncSegmentsWithValue = useCallback(
      (nextValue: Date | undefined, blankTime: boolean) => {
        if (nextValue) {
          const nextSegments: Partial<SegmentState> = {
            day: String(nextValue.getDate()).padStart(2, '0'),
            month: String(nextValue.getMonth() + 1).padStart(2, '0'),
            year: String(nextValue.getFullYear()).slice(-2),
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
      [includeTime, timeOnly, use24HourTime]
    );

    
    useEffect(() => {
      if (commitValidSegmentChangesImmediately) {
        const activeElement = window.activeDocument.activeElement;
        const isSegmentFocused = [
          dayRef,
          monthRef,
          yearRef,
          hourRef,
          minuteRef,
          secondRef,
        ].some((ref) => ref.current === activeElement);
        if (isSegmentFocused) return;
      }

      syncSegmentsWithValue(normalizedValue, shouldDisplayBlankTime);
    }, [
      commitValidSegmentChangesImmediately,
      normalizedValue,
      shouldDisplayBlankTime,
      syncSegmentsWithValue,
    ]);

    
    useEffect(() => {
      return () => {
        if (flatpickrRef.current) {
          flatpickrRef.current.destroy();
          flatpickrRef.current = null;
        }
        
        if (tempInputRef.current?.parentNode) {
          tempInputRef.current.remove();
          tempInputRef.current = null;
        }
      };
    }, []);

    
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

        const d = parseInt(candidateDay, 10);
        const mo = parseInt(candidateMonth, 10);
        let y = parseInt(candidateYear, 10);

        if (isNaN(d) || isNaN(mo) || isNaN(y)) {
          return { kind: 'invalid' };
        }

        
        y = y > 50 ? 1900 + y : 2000 + y;

        const date = new Date(y, mo - 1, d);

        
        if (date.getDate() !== d || date.getMonth() !== mo - 1) {
          return { kind: 'invalid' };
        }

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
        switch (result.kind) {
          case 'invalid':
            return;
          case 'empty':
            onChange?.(undefined);
            return;
          case 'value':
            onChange?.(result.value);
            return;
          case 'blank-time':
            if (onBlankTimeDateChange) {
              onChange?.(undefined);
              onBlankTimeDateChange(result.value);
              return;
            }

            result.value.setHours(0, 0, 0, 0);
            onChange?.(result.value);
            return;
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
        emitValue(buildValueFromSegments(segments, meridiem));
      },
      [buildValueFromSegments, emitValue, segments]
    );

    const handleAmpmToggle = useCallback(() => {
      const nextAmpm = ampm === 'AM' ? 'PM' : 'AM';
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
      const digits = value.replace(/\D/g, '').slice(0, maxLength);
      setter(digits);

      if (commitValidSegmentChangesImmediately) {
        const candidateSegments: SegmentState = {
          ...segments,
          [segment]: digits,
        };
        emitValue(buildValueFromSegments(candidateSegments));
      }

      if (digits.length === maxLength && nextRef?.current) {
        nextRef.current.focus();
        nextRef.current.select();
      }
    };

    
    const commitDateTimeSegments = useCallback(() => {
      
      window.setTimeout(() => {
        const activeEl = window.activeDocument.activeElement;

        if (commitValidSegmentChangesImmediately) {
          if (!containerRef.current) return;

          const isStillInComponent = containerRef.current.contains(activeEl);
          if (!isStillInComponent) {
            syncSegmentsWithValue(
              normalizedValueRef.current,
              shouldDisplayBlankTimeRef.current
            );
          }
          return;
        }

        const isStillInComponent = [
          dayRef,
          monthRef,
          yearRef,
          hourRef,
          minuteRef,
          secondRef,
          ampmButtonRef,
        ].some((ref) => ref.current === activeEl);
        if (!isStillInComponent) {
          updateValue();
        }
      }, 100);
    }, [
      commitValidSegmentChangesImmediately,
      syncSegmentsWithValue,
      updateValue,
    ]);

    
    const openPicker = useCallback(() => {
      if (disabled) return;

      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
        flatpickrRef.current = null;
      }

      let wasHandledByButton = false; 
      const tempInput = window.activeDocument.body.createEl('input', {
        cls: 'journalit-flatpickr-temp-input',
      });
      tempInputRef.current = tempInput; 

      
      const cleanup = () => {
        if (tempInput.parentNode) {
          tempInput.remove();
        }
        tempInputRef.current = null;
      };

      const timeFormat = use24HourTime
        ? shouldShowSeconds
          ? 'H:i:S'
          : 'H:i'
        : shouldShowSeconds
          ? 'h:i:S K'
          : 'h:i K';
      const pickerDateFormat = timeOnly
        ? timeFormat
        : includeTime
          ? `Y-m-d ${timeFormat}`
          : 'Y-m-d';

      flatpickrRef.current = flatpickr(tempInput, {
        defaultDate: normalizedValue, 
        enableTime: includeTime || timeOnly,
        enableSeconds: shouldShowSeconds,
        noCalendar: timeOnly,
        time_24hr: use24HourTime,
        dateFormat: pickerDateFormat,
        minDate: minDate,
        disableMobile: true,
        appendTo: window.activeDocument.body,
        positionElement:
          pickerPositionElement ??
          calendarButtonRef.current ??
          containerRef.current ??
          undefined,
        monthSelectorType: 'static',

        locale: (() => {
          const lang = getCurrentLanguage();
          const weekStartDay = getWeekStartDaySetting();
          const firstDayOfWeek = getWeekStartDayIndex(weekStartDay);

          
          const langLocale = flatpickrLocales[lang];
          if (langLocale) {
            return { ...langLocale, firstDayOfWeek };
          }

          return { firstDayOfWeek };
        })(),

        onChange: (selectedDates: Date[]) => {
          
          if (wasHandledByButton) {
            wasHandledByButton = false;
            return;
          }

          if (selectedDates.length > 0 && onChange) {
            if (timeOnly) {
              
              const date = selectedDates[0];
              const timeString = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
              onChange(timeString);
            } else {
              const selectedDate = new Date(selectedDates[0]);
              if (includeTime && !shouldShowSeconds) {
                selectedDate.setSeconds(
                  parseInt(secondValueRef.current, 10) || 0,
                  0
                );
              }
              onChange(selectedDate);
            }
          }
        },

        onClose: (
          _selectedDates: Date[],
          _dateStr: string,
          instance: FlatpickrInstance & {
            _dayClickHandler?: (e: Event) => void;
            _reattachHandler?: () => void;
            _clearBtn?: HTMLButtonElement;
            _todayBtn?: HTMLButtonElement;
            _clearBtnHandler?: () => void;
            _todayBtnHandler?: () => void;
          }
        ) => {
          
          if (instance._dayClickHandler) {
            instance.calendarContainer
              ?.querySelectorAll('.flatpickr-day')
              .forEach((day: Element) => {
                day.removeEventListener('click', instance._dayClickHandler!);
              });
          }
          if (instance._reattachHandler) {
            
            instance.calendarContainer
              ?.querySelector('.flatpickr-prev-month')
              ?.removeEventListener('click', instance._reattachHandler);
            instance.calendarContainer
              ?.querySelector('.flatpickr-next-month')
              ?.removeEventListener('click', instance._reattachHandler);
            
            instance.calendarContainer
              ?.querySelector('.numInputWrapper .arrowUp')
              ?.removeEventListener('click', instance._reattachHandler);
            instance.calendarContainer
              ?.querySelector('.numInputWrapper .arrowDown')
              ?.removeEventListener('click', instance._reattachHandler);
            instance.calendarContainer
              ?.querySelector('.cur-year')
              ?.removeEventListener('input', instance._reattachHandler);
          }
          if (instance._clearBtn && instance._clearBtnHandler) {
            instance._clearBtn.removeEventListener(
              'click',
              instance._clearBtnHandler
            );
          }
          if (instance._todayBtn && instance._todayBtnHandler) {
            instance._todayBtn.removeEventListener(
              'click',
              instance._todayBtnHandler
            );
          }
          instance.destroy();
          flatpickrRef.current = null;
          cleanup();
          onPickerClose?.();
        },

        onReady: (
          _selectedDates: Date[],
          _dateStr: string,
          instance: FlatpickrInstance & {
            _dayClickHandler?: (e: Event) => void;
            _reattachHandler?: () => void;
            _clearBtn?: HTMLButtonElement;
            _todayBtn?: HTMLButtonElement;
            _clearBtnHandler?: () => void;
            _todayBtnHandler?: () => void;
          }
        ) => {
          
          
          const handleDayClick = (e: Event) => {
            const dayEl = e.currentTarget;
            const dayDate = getFlatpickrDayDate(dayEl);
            const ownerDocument: unknown =
              typeof dayEl === 'object' && dayEl !== null
                ? Reflect.get(dayEl, 'ownerDocument')
                : undefined;
            const defaultView: unknown =
              typeof ownerDocument === 'object' && ownerDocument !== null
                ? Reflect.get(ownerDocument, 'defaultView')
                : undefined;
            const HTMLElementCtor: unknown =
              typeof defaultView === 'object' && defaultView !== null
                ? Reflect.get(defaultView, 'HTMLElement')
                : undefined;
            const className: unknown =
              typeof dayEl === 'object' && dayEl !== null
                ? Reflect.get(dayEl, 'className')
                : undefined;
            const isDisabled =
              typeof className === 'string' &&
              className.split(/\s+/).includes('flatpickr-disabled');
            if (
              typeof HTMLElementCtor === 'function' &&
              dayEl instanceof HTMLElementCtor &&
              dayDate &&
              onChange &&
              !isDisabled
            ) {
              wasHandledByButton = true; 
              const selectedDate = new Date(dayDate);

              
              
              if (includeTime && !timeOnly) {
                if (
                  onBlankTimeDateChange &&
                  (!hourValueRef.current || !minuteValueRef.current)
                ) {
                  onChange(undefined);
                  onBlankTimeDateChange(selectedDate);
                  instance.close();
                  return;
                }

                const currentHour = parseInt(hourValueRef.current, 10) || 0;
                const currentMinute = parseInt(minuteValueRef.current, 10) || 0;
                const currentSecond = parseInt(secondValueRef.current, 10) || 0;
                let hours = currentHour;

                
                if (!use24HourTime) {
                  if (ampmValueRef.current === 'PM' && hours !== 12)
                    hours += 12;
                  if (ampmValueRef.current === 'AM' && hours === 12) hours = 0;
                }

                selectedDate.setHours(hours, currentMinute, currentSecond, 0);
              }

              if (timeOnly) {
                const timeString = `${String(selectedDate.getHours()).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')}`;
                onChange(timeString);
              } else {
                onChange(selectedDate);
              }
              instance.close();
            }
          };

          
          instance.calendarContainer
            .querySelectorAll('.flatpickr-day')
            .forEach((day: Element) => {
              day.addEventListener('click', handleDayClick);
            });

          
          const reattachHandlers = () => {
            window.requestAnimationFrame(() => {
              instance.calendarContainer
                .querySelectorAll('.flatpickr-day')
                .forEach((day: Element) => {
                  day.removeEventListener('click', handleDayClick);
                  day.addEventListener('click', handleDayClick);
                });
            });
          };

          
          instance.calendarContainer
            .querySelector('.flatpickr-prev-month')
            ?.addEventListener('click', reattachHandlers);
          instance.calendarContainer
            .querySelector('.flatpickr-next-month')
            ?.addEventListener('click', reattachHandlers);

          
          
          instance.calendarContainer
            .querySelector('.numInputWrapper .arrowUp')
            ?.addEventListener('click', reattachHandlers);
          instance.calendarContainer
            .querySelector('.numInputWrapper .arrowDown')
            ?.addEventListener('click', reattachHandlers);
          
          instance.calendarContainer
            .querySelector('.cur-year')
            ?.addEventListener('input', reattachHandlers);

          
          instance._dayClickHandler = handleDayClick;
          instance._reattachHandler = reattachHandlers;

          
          const clearBtnHandler = () => {
            wasHandledByButton = true;
            instance.clear(false);
            if (onChange) onChange(undefined);
            if (closePickerOnQuickAction) instance.close();
          };

          const todayBtnHandler = () => {
            wasHandledByButton = true;
            const now = new Date();
            if (onChange) {
              if (timeOnly) {
                
                const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                onChange(timeString);
              } else {
                onChange(now);
              }
            }
            instance.setDate(now, false);
            if (closePickerOnQuickAction) instance.close();
          };

          
          const timeContainer =
            instance.calendarContainer.querySelector('.flatpickr-time');
          let clearBtn: HTMLButtonElement;
          let todayBtn: HTMLButtonElement;

          if (timeContainer instanceof HTMLElement) {
            const existingTimeNodes = Array.from(timeContainer.childNodes);
            
            const timeContent = timeContainer.createDiv({
              cls: 'journalit-flatpickr-time-content',
            });
            timeContent.append(...existingTimeNodes);

            
            timeContainer.classList.add('journalit-flatpickr-time-container');
            clearBtn = timeContainer.createEl('button', {
              cls: 'flatpickr-button',
              text: t('datepicker.button.clear'),
              attr: { type: 'button' },
              prepend: true,
            });
            todayBtn = timeContainer.createEl('button', {
              cls: 'flatpickr-button flatpickr-button-primary',
              text: timeOnly
                ? t('datepicker.button.now')
                : t('datepicker.button.today'),
              attr: { type: 'button' },
            });
          } else {
            const buttonContainer = instance.calendarContainer.createDiv({
              cls: 'journalit-flatpickr-button-container',
            });
            clearBtn = buttonContainer.createEl('button', {
              cls: 'flatpickr-button',
              text: t('datepicker.button.clear'),
              attr: { type: 'button' },
            });
            todayBtn = buttonContainer.createEl('button', {
              cls: 'flatpickr-button flatpickr-button-primary',
              text: timeOnly
                ? t('datepicker.button.now')
                : t('datepicker.button.today'),
              attr: { type: 'button' },
            });
          }

          clearBtn.addEventListener('click', clearBtnHandler);
          todayBtn.addEventListener('click', todayBtnHandler);

          instance._clearBtn = clearBtn;
          instance._todayBtn = todayBtn;
          instance._clearBtnHandler = clearBtnHandler;
          instance._todayBtnHandler = todayBtnHandler;
        },
      });

      const fp = flatpickrRef.current;
      if (fp?.calendarContainer) {
        fp.calendarContainer.classList.add('journalit-flatpickr-calendar');
      }
      fp?.open();
    }, [
      disabled,
      normalizedValue,
      includeTime,
      timeOnly,
      shouldShowSeconds,
      use24HourTime,
      minDate,
      onChange,
      onBlankTimeDateChange,
      pickerPositionElement,
      onPickerClose,
      closePickerOnQuickAction,
    ]);

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
            onBlur={commitDateTimeSegments}
            placeholder={t('datepicker.placeholder.day')}
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
            onBlur={commitDateTimeSegments}
            placeholder={t('datepicker.placeholder.month')}
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
                2,
                userDateFormat === 'YYMMDD' ? monthRef : timeRef
              )
            }
            onBlur={commitDateTimeSegments}
            placeholder={t('datepicker.placeholder.year')}
            data-segment="year"
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
          role="group"
          aria-label={label ? undefined : ariaLabel}
          aria-labelledby={label ? labelId : undefined}
          className="journalit-fast-datetime__container"
          data-date-only={isDateOnly ? 'true' : 'false'}
          data-has-seconds={shouldShowSeconds ? 'true' : 'false'}
          data-has-error={error ? 'true' : 'false'}
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
                onBlur={commitDateTimeSegments}
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
                onBlur={commitDateTimeSegments}
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
                    onBlur={commitDateTimeSegments}
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

        {error && (
          <span className="journalit-fast-datetime__error">{error}</span>
        )}
      </div>
    );
  }
);

FastDateTimeInput.displayName = 'FastDateTimeInput';
