

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { CalendarIcon, ClockIcon } from '../shared/icons/ObsidianIcon';
import flatpickr from 'flatpickr';
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import type { CustomLocale } from 'flatpickr/dist/types/locale';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { German } from 'flatpickr/dist/l10n/de';
import { French } from 'flatpickr/dist/l10n/fr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import { Mandarin } from 'flatpickr/dist/l10n/zh';
import { MandarinTraditional } from 'flatpickr/dist/l10n/zh-tw';
import { Japanese } from 'flatpickr/dist/l10n/ja';
import { Korean } from 'flatpickr/dist/l10n/ko';
import { Russian } from 'flatpickr/dist/l10n/ru';
import {
  getUserDateFormat,
  getWeekStartDayIndex,
  getWeekStartDaySetting,
} from '../../utils/dateUtils';
import { parseStoredDateLikeValue } from '../../utils/customFieldPersistence';
import { getPluginInstance } from '../../utils/pluginContext';

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
  'pt-BR': Portuguese,
  zh: Mandarin,
  'zh-TW': MandarinTraditional,
  ja: Japanese,
  ko: Korean,
  ru: Russian,
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
  value?: Date | string;
  onChange?: (date: Date | string | undefined) => void;
  includeTime?: boolean;
  timeOnly?: boolean;
  required?: boolean;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  defaultDateWhenEmpty?: Date;
  onBlankTimeDateChange?: (date: Date | undefined) => void;
}

export const FastDateTimeInput: React.FC<FastDateTimeInputProps> = React.memo(
  ({
    label,
    value,
    onChange,
    includeTime = false,
    timeOnly = false,
    required = false,
    error,
    disabled = false,
    className,
    minDate,
    defaultDateWhenEmpty,
    onBlankTimeDateChange,
  }) => {
    
    const userDateFormat = getUserDateFormat();
    const use24HourTime = useMemo(() => getUse24HourTime(), []);

    
    const normalizedValue = useMemo(() => {
      if (!value) return defaultDateWhenEmpty;
      return parseStoredDateLikeValue(value, { includeTime, timeOnly });
    }, [value, defaultDateWhenEmpty, includeTime, timeOnly]);

    const shouldDisplayBlankTime = !value && defaultDateWhenEmpty;

    
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

    
    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);
    const calendarButtonRef = useRef<HTMLButtonElement>(null);
    const flatpickrRef = useRef<FlatpickrInstance | null>(null);
    const tempInputRef = useRef<HTMLInputElement | null>(null);

    
    const hourValueRef = useRef(hour);
    const minuteValueRef = useRef(minute);
    const ampmValueRef = useRef(ampm);

    
    useEffect(() => {
      hourValueRef.current = hour;
    }, [hour]);
    useEffect(() => {
      minuteValueRef.current = minute;
    }, [minute]);
    useEffect(() => {
      ampmValueRef.current = ampm;
    }, [ampm]);

    
    useEffect(() => {
      if (normalizedValue) {
        setDay(String(normalizedValue.getDate()).padStart(2, '0'));
        setMonth(String(normalizedValue.getMonth() + 1).padStart(2, '0'));
        setYear(String(normalizedValue.getFullYear()).slice(-2));

        if (includeTime || timeOnly) {
          if (shouldDisplayBlankTime) {
            setHour('');
            setMinute('');
            setAmpm('AM');
            return;
          }
          const hours = normalizedValue.getHours();
          if (use24HourTime) {
            setHour(String(hours).padStart(2, '0'));
          } else {
            const h12 = hours % 12 || 12;
            setHour(String(h12).padStart(2, '0'));
            setAmpm(hours >= 12 ? 'PM' : 'AM');
          }
          setMinute(String(normalizedValue.getMinutes()).padStart(2, '0'));
        }
      } else {
        setDay('');
        setMonth('');
        setYear('');
        setHour('');
        setMinute('');
        setAmpm('AM');
      }
    }, [
      normalizedValue,
      use24HourTime,
      includeTime,
      timeOnly,
      shouldDisplayBlankTime,
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
        m: number
      ): { hours: number; minutes: number; valid: boolean } => {
        
        const minutes = Math.max(0, Math.min(59, m));

        let hours = h;
        if (use24HourTime) {
          
          hours = Math.max(0, Math.min(23, h));
        } else {
          
          hours = Math.max(1, Math.min(12, h));
          if (ampm === 'PM' && hours !== 12) hours += 12;
          else if (ampm === 'AM' && hours === 12) hours = 0;
        }

        return { hours, minutes, valid: true };
      },
      [use24HourTime, ampm]
    );

    
    const updateValue = useCallback(() => {
      if (timeOnly) {
        
        const h = parseInt(hour, 10);
        const m = parseInt(minute, 10);
        if (isNaN(h) || isNaN(m)) {
          return;
        }

        const { hours, minutes } = validateTime(h, m);

        
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        if (onChange) onChange(timeString);
        return;
      }

      const d = parseInt(day, 10);
      const mo = parseInt(month, 10);
      let y = parseInt(year, 10);

      if (isNaN(d) || isNaN(mo) || isNaN(y)) {
        return;
      }

      
      y = y > 50 ? 1900 + y : 2000 + y;

      const date = new Date(y, mo - 1, d);

      
      if (date.getDate() !== d || date.getMonth() !== mo - 1) {
        return;
      }

      if (includeTime) {
        if (!hour || !minute) {
          if (onBlankTimeDateChange) {
            onChange?.(undefined);
            onBlankTimeDateChange(date);
            return;
          }

          date.setHours(0, 0, 0, 0);
          if (onChange) onChange(date);
          return;
        }

        const h = parseInt(hour, 10);
        const m = parseInt(minute, 10);

        const { hours, minutes } = validateTime(h, m);
        date.setHours(hours, minutes, 0, 0);
      }

      if (onChange) onChange(date);
    }, [
      day,
      month,
      year,
      hour,
      minute,
      timeOnly,
      includeTime,
      onChange,
      onBlankTimeDateChange,
      validateTime,
    ]);

    
    const isInitialMount = useRef(true);
    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      
      if (hour && minute && (includeTime || timeOnly)) {
        updateValue();
      }
    }, [ampm]); // eslint-disable-line react-hooks/exhaustive-deps -- intentionally only trigger on ampm change

    
    const handleSegmentChange = (
      value: string,
      setter: (v: string) => void,
      maxLength: number,
      nextRef?: React.RefObject<HTMLInputElement | null>
    ) => {
      const digits = value.replace(/\D/g, '').slice(0, maxLength);
      setter(digits);

      if (digits.length === maxLength && nextRef?.current) {
        nextRef.current.focus();
        nextRef.current.select();
      }
    };

    
    const commitDateTimeSegments = useCallback(() => {
      
      window.setTimeout(() => {
        const activeEl = window.activeDocument.activeElement;
        const isStillInComponent = [
          dayRef,
          monthRef,
          yearRef,
          hourRef,
          minuteRef,
        ].some((ref) => ref.current === activeEl);
        if (!isStillInComponent) {
          updateValue();
        }
      }, 100);
    }, [updateValue]);

    
    const handleOpenCalendar = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        if (flatpickrRef.current) {
          flatpickrRef.current.destroy();
          flatpickrRef.current = null;
        }

        let wasHandledByButton = false; 
        const tempInput = window.activeDocument.createElement('input');
        tempInput.className = 'journalit-flatpickr-temp-input';
        window.activeDocument.body.appendChild(tempInput);
        tempInputRef.current = tempInput; 

        
        const cleanup = () => {
          if (tempInput.parentNode) {
            tempInput.remove();
          }
          tempInputRef.current = null;
        };

        flatpickrRef.current = flatpickr(tempInput, {
          defaultDate: normalizedValue, 
          enableTime: includeTime || timeOnly,
          noCalendar: timeOnly,
          time_24hr: use24HourTime,
          dateFormat: timeOnly
            ? use24HourTime
              ? 'H:i'
              : 'h:i K'
            : includeTime
              ? use24HourTime
                ? 'Y-m-d H:i'
                : 'Y-m-d h:i K'
              : 'Y-m-d',
          minDate: minDate,
          disableMobile: true,
          appendTo: window.activeDocument.body,
          positionElement: calendarButtonRef.current ?? undefined,
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
            
            if (!wasHandledByButton && selectedDates.length > 0 && onChange) {
              if (timeOnly) {
                
                const date = selectedDates[0];
                const timeString = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                onChange(timeString);
              } else {
                onChange(selectedDates[0]);
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
              if (
                dayEl instanceof HTMLElement &&
                dayDate &&
                onChange &&
                !dayEl.classList.contains('flatpickr-disabled')
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
                  const currentMinute =
                    parseInt(minuteValueRef.current, 10) || 0;
                  let hours = currentHour;

                  
                  if (!use24HourTime) {
                    if (ampmValueRef.current === 'PM' && hours !== 12)
                      hours += 12;
                    if (ampmValueRef.current === 'AM' && hours === 12)
                      hours = 0;
                  }

                  selectedDate.setHours(hours, currentMinute, 0, 0);
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
              if (onChange) onChange(undefined);
              instance.close();
            };

            const todayBtnHandler = () => {
              wasHandledByButton = true;
              if (onChange) {
                if (timeOnly) {
                  
                  const now = new Date();
                  const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                  onChange(timeString);
                } else {
                  onChange(new Date());
                }
              }
              instance.close();
            };

            const clearBtn = window.activeDocument.createElement('button');
            clearBtn.type = 'button';
            clearBtn.textContent = t('datepicker.button.clear');
            clearBtn.className = 'flatpickr-button';
            clearBtn.addEventListener('click', clearBtnHandler);

            const todayBtn = window.activeDocument.createElement('button');
            todayBtn.type = 'button';
            todayBtn.textContent = timeOnly
              ? t('datepicker.button.now')
              : t('datepicker.button.today');
            todayBtn.className = 'flatpickr-button flatpickr-button-primary';
            todayBtn.addEventListener('click', todayBtnHandler);

            
            instance._clearBtn = clearBtn;
            instance._todayBtn = todayBtn;
            instance._clearBtnHandler = clearBtnHandler;
            instance._todayBtnHandler = todayBtnHandler;

            
            const timeContainer =
              instance.calendarContainer.querySelector('.flatpickr-time');
            if (timeContainer instanceof HTMLElement) {
              
              const timeContent = window.activeDocument.createElement('div');
              timeContent.className = 'journalit-flatpickr-time-content';

              
              while (timeContainer.firstChild) {
                timeContent.appendChild(timeContainer.firstChild);
              }

              
              timeContainer.classList.add('journalit-flatpickr-time-container');
              timeContainer.appendChild(clearBtn);
              timeContainer.appendChild(timeContent);
              timeContainer.appendChild(todayBtn);
            } else {
              
              const buttonContainer =
                window.activeDocument.createElement('div');
              buttonContainer.className =
                'journalit-flatpickr-button-container';
              buttonContainer.appendChild(clearBtn);
              buttonContainer.appendChild(todayBtn);
              instance.calendarContainer.appendChild(buttonContainer);
            }
          },
        });

        const fp = flatpickrRef.current;
        if (fp?.calendarContainer) {
          fp.calendarContainer.classList.add('journalit-flatpickr-calendar');
        }
        fp?.open();
      },
      [
        disabled,
        normalizedValue,
        includeTime,
        timeOnly,
        use24HourTime,
        minDate,
        onChange,
        onBlankTimeDateChange,
      ]
    );

    
    
    
    
    
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
                setYear,
                2,
                userDateFormat === 'YYMMDD' ? monthRef : timeRef
              )
            }
            onBlur={commitDateTimeSegments}
            placeholder={t('datepicker.placeholder.year')}
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

    
    const hasTimeContent = includeTime || timeOnly;
    const isDateOnly = !hasTimeContent;

    return (
      <div
        className={['journalit-fast-datetime', className]
          .filter(Boolean)
          .join(' ')}
      >
        {label && (
          <label className="journalit-fast-datetime__label">
            {label}
            {required && (
              <span className="journalit-fast-datetime__required">*</span>
            )}
          </label>
        )}

        <div
          className="journalit-fast-datetime__container"
          data-date-only={isDateOnly ? 'true' : 'false'}
          data-has-error={error ? 'true' : 'false'}
        >
          
          {!timeOnly && (
            <>
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
            </>
          )}

          
          {(includeTime || timeOnly) && (
            <>
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
                  handleSegmentChange(e.target.value, setHour, 2, minuteRef)
                }
                onBlur={commitDateTimeSegments}
                placeholder={t('datepicker.placeholder.hour')}
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
                  handleSegmentChange(e.target.value, setMinute, 2)
                }
                onBlur={commitDateTimeSegments}
                placeholder={t('datepicker.placeholder.minute')}
                disabled={disabled}
                className="segment-input journalit-fast-datetime__segment"
              />
              {!use24HourTime && (
                <button
                  type="button"
                  onClick={() => setAmpm(ampm === 'AM' ? 'PM' : 'AM')}
                  disabled={disabled}
                  className="journalit-fast-datetime__ampm-button"
                >
                  {ampm}
                </button>
              )}
            </>
          )}

          
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
        </div>

        {error && (
          <span className="journalit-fast-datetime__error">{error}</span>
        )}
      </div>
    );
  }
);

FastDateTimeInput.displayName = 'FastDateTimeInput';
