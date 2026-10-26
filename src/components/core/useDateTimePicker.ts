import React, {
  createRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type RefObject,
} from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Scope } from 'obsidian';
import { useEscapeRegistrar } from '../shared/disclosureEscape';
import { getPluginInstance } from '../../utils/pluginContext';
import { ESCAPE_DELEGATE_ATTRIBUTE } from '../../views/escapeKeySuppression';
import { anchoredMenuPortalRoot } from '../shared/menus/useAnchoredMenuPosition';
import { getDatePickerLocale } from './datePickerLocales';
import {
  DateTimePickerPopup,
  type DateTimePickerPopupConfig,
} from './DateTimePickerPopup';

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


const isNode = (target: EventTarget | null): target is Node =>
  target !== null && 'nodeType' in target;

interface OpenPicker {
  render: () => void;
  close: (restoreFocus: boolean) => void;
}


export function useDateTimePicker(options: DateTimePickerOptions): () => void {
  const optionsRef = useRef(options);
  const active = useRef<OpenPicker | null>(null);
  const escapeRegistrar = useEscapeRegistrar();
  const escapeRegistrarRef = useRef(escapeRegistrar);
  useLayoutEffect(() => {
    optionsRef.current = options;
    escapeRegistrarRef.current = escapeRegistrar;
    
    active.current?.render();
  }, [options, escapeRegistrar]);

  useEffect(
    () => () => {
      active.current?.close(false);
    },
    []
  );

  return useCallback(() => {
    if (active.current) {
      active.current.close(true);
      return;
    }
    const { containerRef, triggerRef, positionElement, disabled } =
      optionsRef.current;
    const container = containerRef.current;
    if (disabled || !container) return;
    const doc = container.ownerDocument;
    const trigger = triggerRef.current;
    const anchor = positionElement ?? trigger ?? container;
    
    const focusTarget = positionElement ?? trigger;
    const host = anchoredMenuPortalRoot(anchor).createDiv({
      cls: 'journalit-date-picker-host',
      
      attr: { [ESCAPE_DELEGATE_ATTRIBUTE]: 'true' },
    });
    const root: Root = createRoot(host);
    const popupRef = createRef<HTMLDivElement>();
    const locale = getDatePickerLocale();
    const listeners: Array<() => void> = [];
    let releaseScope: (() => void) | undefined;

    const contains = (target: EventTarget | null) =>
      isNode(target) && host.contains(target);

    const close = (restoreFocus: boolean) => {
      if (active.current !== picker) return;
      active.current = null;
      releaseScope?.();
      for (const remove of listeners) remove();
      const focusWasInside = contains(doc.activeElement);
      host.remove();
      
      queueMicrotask(() => root.unmount());
      if ((restoreFocus || focusWasInside) && focusTarget?.isConnected)
        focusTarget.focus();
      optionsRef.current.onClose?.();
    };

    const render = () => {
      const current = optionsRef.current;
      const config: DateTimePickerPopupConfig = {
        value: current.value,
        includeTime: current.includeTime ?? false,
        timeOnly: current.timeOnly ?? false,
        showSeconds: current.showSeconds ?? false,
        use24HourTime: current.use24HourTime ?? false,
        minDate: current.minDate,
        closeOnQuickAction: current.closeOnQuickAction ?? true,
        locale,
        onChange: (date) => optionsRef.current.onChange(date),
        onSelectDay: (date, time) => optionsRef.current.onSelectDay(date, time),
        onToday: (date) => optionsRef.current.onToday(date),
      };
      root.render(
        React.createElement(DateTimePickerPopup, {
          config,
          anchor,
          popupRef,
          onDismiss: close,
        })
      );
    };

    const picker: OpenPicker = { render, close };
    active.current = picker;

    const listen = <K extends keyof DocumentEventMap>(
      type: K,
      handler: (event: DocumentEventMap[K]) => void,
      capture: boolean
    ) => {
      doc.addEventListener(type, handler, capture);
      listeners.push(() => doc.removeEventListener(type, handler, capture));
    };
    
    
    const isOwnControl = (target: EventTarget | null) =>
      isNode(target) &&
      (anchor.contains(target) || Boolean(trigger?.contains(target)));
    const dismissFrom = (target: EventTarget | null) => {
      if (contains(target) || isOwnControl(target)) return;
      const focused = doc.activeElement;
      if (focused?.instanceOf(HTMLElement) && contains(focused)) focused.blur();
      close(false);
    };
    listen('mousedown', (event) => dismissFrom(event.target), true);
    listen('focusin', (event) => dismissFrom(event.target), true);
    
    
    listen(
      'keydown',
      (event) => {
        if (event.key !== 'Escape' || event.isComposing) return;
        event.preventDefault();
        close(true);
      },
      false
    );

    
    
    
    
    const registrar = escapeRegistrarRef.current;
    const app = getPluginInstance()?.app;
    if (registrar) {
      releaseScope = registrar(() => close(true));
    } else if (app) {
      
      
      const inModal = host.closest('.modal-container') !== null;
      const scope = new Scope(inModal ? undefined : app.scope);
      scope.register(null, 'Escape', (event) => {
        if (event.isComposing) return;
        close(true);
        return false;
      });
      app.keymap.pushScope(scope);
      releaseScope = () => app.keymap.popScope(scope);
    }

    render();
    optionsRef.current.onOpen?.({ element: host, close: () => close(true) });
  }, []);
}
