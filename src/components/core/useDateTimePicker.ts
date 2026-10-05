import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type RefObject,
} from 'react';
import flatpickr from 'flatpickr';
import type { Instance } from 'flatpickr/dist/types/instance';
import { t } from '../../lang/helpers';
import { createDateWithoutTime } from '../../utils/dateUtils';
import { getDatePickerLocale } from './datePickerLocales';

export interface DatePickerSurface {
  element: HTMLElement;
  close: () => void;
}

interface DateTimePickerOptions {
  containerRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  positionElement?: HTMLElement | null;
  value?: Date;
  disabled?: boolean;
  includeTime?: boolean;
  timeOnly?: boolean;
  showSeconds?: boolean;
  use24HourTime?: boolean;
  minDate?: Date;
  closeOnQuickAction?: boolean;
  onChange: (date: Date | undefined) => void;
  onSelectDay: (date: Date, pickerTime: Date | undefined) => Date | undefined;
  onToday: (date: Date) => void;
  onOpen?: (surface: DatePickerSurface) => void;
  onClose?: () => void;
}


export function useDateTimePicker(options: DateTimePickerOptions): () => void {
  const optionsRef = useRef(options);
  useLayoutEffect(() => {
    optionsRef.current = options;
  }, [options]);
  const active = useRef<Instance | null>(null);
  const resources = useRef(new Set<() => void>());

  useEffect(() => {
    const pending = resources.current;
    return () => {
      
      
      for (const dispose of pending) queueMicrotask(dispose);
      active.current = null;
    };
  }, []);

  return useCallback(() => {
    const {
      containerRef,
      triggerRef,
      positionElement,
      value,
      disabled,
      includeTime = false,
      timeOnly = false,
      showSeconds = false,
      use24HourTime = false,
      minDate,
      closeOnQuickAction = true,
    } = optionsRef.current;
    const container = containerRef.current;
    if (disabled || !container) return;
    active.current?.close();
    for (const dispose of resources.current) queueMicrotask(dispose);
    const doc = container.ownerDocument;
    const win = doc.defaultView;
    if (!win) return;
    const trigger = positionElement ?? triggerRef.current;
    
    
    const input = container.createEl('input', {
      cls: 'journalit-flatpickr-temp-input',
      attr: { tabindex: '-1', 'aria-hidden': 'true' },
    });
    let instance: Instance | undefined;
    let lastNotifiedTime: number | undefined;
    let popupTimeEdited = false;
    let timeBaseline = '';
    let disposed = false;
    const listeners: Array<() => void> = [];
    const dispose = () => {
      if (disposed) return;
      disposed = true;
      for (const remove of listeners) remove();
      instance?.destroy();
      input.remove();
      resources.current.delete(dispose);
    };
    resources.current.add(dispose);
    const restoreFocus = () => {
      if (trigger?.isConnected) trigger.focus();
    };
    const timeFormat = use24HourTime
      ? showSeconds
        ? 'H:i:S'
        : 'H:i'
      : showSeconds
        ? 'h:i:S K'
        : 'h:i K';
    const todayAllowed = (now: Date) =>
      !minDate ||
      (includeTime || timeOnly
        ? now >= minDate
        : createDateWithoutTime(now, true) >=
          createDateWithoutTime(minDate, true));
    instance = flatpickr(input, {
      defaultDate: value,
      enableTime: includeTime || timeOnly,
      enableSeconds: showSeconds,
      noCalendar: timeOnly,
      time_24hr: use24HourTime,
      dateFormat: timeOnly
        ? timeFormat
        : includeTime
          ? `Y-m-d ${timeFormat}`
          : 'Y-m-d',
      minDate,
      disableMobile: true,
      clickOpens: false,
      closeOnSelect: false,
      appendTo: doc.body,
      positionElement: trigger ?? container,
      monthSelectorType: 'static',
      locale: getDatePickerLocale(),
      onChange: (selected) => {
        if (selected.length > 0 && selected[0].getTime() !== lastNotifiedTime) {
          lastNotifiedTime = selected[0].getTime();
          optionsRef.current.onChange(new Date(selected[0]));
        }
      },
      onValueUpdate: (_dates, text) => {
        
        
        if ((includeTime || timeOnly) && text !== timeBaseline)
          popupTimeEdited = true;
      },
      onClose: (_dates, _text, picker) => {
        if (active.current === picker) active.current = null;
        const focused = doc.activeElement;
        if (
          focused === input ||
          (focused && picker.calendarContainer.contains(focused))
        )
          restoreFocus();
        optionsRef.current.onClose?.();
        
        
        
        if (!includeTime && !timeOnly) queueMicrotask(dispose);
      },
      onReady: (_dates, text, picker) => {
        timeBaseline = text;
        const calendar = picker.calendarContainer;
        calendar.classList.add('journalit-flatpickr-calendar');
        
        
        const selectDay = (event: Event) => {
          if (
            event.type === 'keydown' &&
            (!(event instanceof win.KeyboardEvent) || event.key !== 'Enter')
          )
            return;
          const day =
            event.target instanceof win.Element
              ? event.target.closest('.flatpickr-day')
              : null;
          if (!day || day.classList.contains('flatpickr-disabled')) return;
          const date: unknown = Reflect.get(day, 'dateObj');
          if (!(date instanceof Date) || Number.isNaN(date.getTime())) return;
          event.preventDefault();
          event.stopPropagation();
          const emitted = optionsRef.current.onSelectDay(
            new Date(date),
            popupTimeEdited ? picker.selectedDates[0] : undefined
          );
          
          
          if (emitted) {
            picker.setDate(emitted, false);
            lastNotifiedTime = emitted.getTime();
          } else {
            picker.clear(false);
            lastNotifiedTime = undefined;
          }
          timeBaseline = picker.input.value;
          popupTimeEdited = false;
          picker.close();
          restoreFocus();
        };
        calendar.addEventListener('click', selectDay, true);
        calendar.addEventListener('keydown', selectDay, true);
        listeners.push(() => {
          calendar.removeEventListener('click', selectDay, true);
          calendar.removeEventListener('keydown', selectDay, true);
        });

        const timeContainer =
          calendar.querySelector<HTMLElement>('.flatpickr-time');
        let buttonContainer: HTMLElement;
        if (timeContainer) {
          const nodes = Array.from(timeContainer.childNodes);
          const content = timeContainer.createDiv({
            cls: 'journalit-flatpickr-time-content',
          });
          content.append(...nodes);
          timeContainer.classList.add('journalit-flatpickr-time-container');
          buttonContainer = timeContainer;
        } else {
          buttonContainer = calendar.createDiv({
            cls: 'journalit-flatpickr-button-container',
          });
        }
        const clear = buttonContainer.createEl('button', {
          cls: 'flatpickr-button',
          text: t('datepicker.button.clear'),
          attr: { type: 'button' },
          prepend: Boolean(timeContainer),
        });
        const today = buttonContainer.createEl('button', {
          cls: 'flatpickr-button flatpickr-button-primary',
          text: t(
            timeOnly ? 'datepicker.button.now' : 'datepicker.button.today'
          ),
          attr: { type: 'button' },
        });
        today.disabled = !todayAllowed(new Date());
        const clearValue = () => {
          picker.clear(false);
          timeBaseline = picker.input.value;
          popupTimeEdited = false;
          lastNotifiedTime = undefined;
          optionsRef.current.onChange(undefined);
          if (closeOnQuickAction) picker.close();
        };
        const todayValue = () => {
          const now = new Date();
          if (!todayAllowed(now)) return;
          optionsRef.current.onToday(now);
          picker.setDate(now, false);
          timeBaseline = picker.input.value;
          popupTimeEdited = false;
          lastNotifiedTime = now.getTime();
          if (closeOnQuickAction) picker.close();
        };
        clear.addEventListener('click', clearValue);
        today.addEventListener('click', todayValue);
        listeners.push(() => {
          clear.removeEventListener('click', clearValue);
          today.removeEventListener('click', todayValue);
        });
      },
    });
    const picker = instance;
    active.current = picker;
    optionsRef.current.onOpen?.({
      element: picker.calendarContainer,
      close: () => {
        picker.close();
        restoreFocus();
      },
    });
    picker.open();
  }, []);
}
