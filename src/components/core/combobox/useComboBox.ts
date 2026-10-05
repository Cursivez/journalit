import {
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Notice } from 'obsidian';
import { t } from '../../../lang/helpers';
import { useAnchoredMenuPosition } from '../../shared/menus/useAnchoredMenuPosition';
import { usePopupDismiss } from '../../shared/menus/usePopupDismiss';
import {
  getComboBoxItems,
  normalizeComboBoxOptions,
  type ComboBoxItem,
} from './comboBoxOptions';

interface ComboBoxBaseProps {
  options: readonly string[];
  getOptionLabel?: (option: string) => string;
  allowCreate?: boolean;
  label?: string;
  labelAccessory?: ReactNode;
  placeholder?: string;
  error?: string;
  helperText?: string;
  
  onSaveOption?: (option: string) => void | Promise<void>;
  required?: boolean;
  disabled?: boolean;
  selectedItemsPlacement?: 'before-input' | 'after-input' | 'inside-input';
  portalDropdown?: boolean;
}

export type ComboBoxProps = ComboBoxBaseProps &
  (
    | { isMulti: true; value: string[]; onChange: (value: string[]) => void }
    | { isMulti?: false; value: string; onChange: (value: string) => void }
  );

const identityLabel = (value: string) => value;


export function useComboBox(props: ComboBoxProps) {
  const {
    options,
    getOptionLabel = identityLabel,
    allowCreate = false,
    disabled = false,
    portalDropdown = true,
  } = props;
  const id = useId();
  const inputId = `combobox-${id}`;
  const listId = `${inputId}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState<{
    item: ComboBoxItem;
    keyboard: boolean;
  } | null>(null);
  const isOpen = open && !disabled;
  const selected = new Set(
    props.isMulti ? props.value : props.value ? [props.value] : []
  );
  const normalizedOptions = useMemo(
    () => normalizeComboBoxOptions(options),
    [options]
  );
  const items = getComboBoxItems({
    options: normalizedOptions,
    selected,
    query: query ?? '',
    isMulti: props.isMulti === true,
    allowCreate,
    getOptionLabel,
  });
  const activeIndex =
    isOpen && active
      ? items.findIndex(
          (item) =>
            item.kind === active.item.kind && item.value === active.item.value
        )
      : -1;
  const activeId = activeIndex < 0 ? undefined : `${listId}-${activeIndex}`;
  const inputValue =
    isOpen && query !== null
      ? query
      : props.isMulti
        ? ''
        : props.value
          ? getOptionLabel(props.value)
          : '';

  const close = () => {
    setOpen(false);
    setQuery(null);
    setActive(null);
  };
  const openList = () => {
    if (disabled || isOpen) return;
    setOpen(true);
    setQuery(null);
    setActive(null);
  };
  usePopupDismiss({
    isOpen,
    rootRef,
    popupRef,
    onDismiss: close,
    onEscape: close,
  });
  const position = useAnchoredMenuPosition({
    isOpen: isOpen && portalDropdown,
    triggerRef: fieldRef,
    menuRef: popupRef,
    width: 'trigger',
    maxHeight: 240,
  });

  useLayoutEffect(() => {
    
    if (!activeId || !active?.keyboard) return;
    const list = popupRef.current;
    const option = list?.ownerDocument.getElementById(activeId);
    if (!list || !option) return;
    const listRect = list.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();
    if (optionRect.top < listRect.top)
      list.scrollTop -= listRect.top - optionRect.top;
    else if (optionRect.bottom > listRect.bottom)
      list.scrollTop += optionRect.bottom - listRect.bottom;
  }, [activeId, active]);

  const select = (item: ComboBoxItem) => {
    if (disabled) return;
    if (props.isMulti) {
      if (selected.has(item.value)) return;
      props.onChange([...props.value, item.value]);
      setQuery('');
      setActive(null);
    } else {
      if (props.value !== item.value) props.onChange(item.value);
      close();
    }
    const saveOption = props.onSaveOption;
    if (item.kind === 'create' && saveOption) {
      
      void (async () => {
        try {
          await saveOption(item.value);
        } catch (saveError) {
          console.error('Failed to save combobox option:', saveError);
          new Notice(t('error.options.save-failed'));
        }
      })();
    }
  };
  const remove = (value: string) => {
    if (!props.isMulti || disabled) return;
    props.onChange(props.value.filter((item) => item !== value));
    inputRef.current?.focus({ preventScroll: true });
  };
  const changeQuery = (value: string) => {
    setQuery(value);
    setOpen(true);
    setActive(null);
  };
  const clear = () => {
    if (props.isMulti || disabled) return;
    inputRef.current?.focus({ preventScroll: true });
    props.onChange('');
    changeQuery('');
  };
  const toggleList = () => {
    if (disabled) return;
    inputRef.current?.focus({ preventScroll: true });
    if (isOpen) close();
    else openList();
  };
  const highlight = (item: ComboBoxItem) => {
    setActive((previous) =>
      previous?.item.kind === item.kind &&
      previous.item.value === item.value &&
      !previous.keyboard
        ? previous
        : { item, keyboard: false }
    );
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || event.nativeEvent.isComposing) return;
    if (event.key === 'Tab') {
      close();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (event.altKey) {
        if (event.key === 'ArrowUp') close();
        else openList();
        return;
      }
      openList();
      if (!items.length) return;
      const nextIndex =
        activeIndex < 0
          ? event.key === 'ArrowDown'
            ? 0
            : items.length - 1
          : Math.max(
              0,
              Math.min(
                items.length - 1,
                activeIndex + (event.key === 'ArrowDown' ? 1 : -1)
              )
            );
      setActive({ item: items[nextIndex], keyboard: true });
    } else if (event.key === 'Enter' && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      const search = (query ?? '').trim().toLocaleLowerCase();
      const item =
        items[activeIndex] ??
        items.find(
          (candidate) =>
            candidate.kind === 'option' &&
            (candidate.label.toLocaleLowerCase() === search ||
              candidate.value.toLocaleLowerCase() === search)
        ) ??
        items.find((candidate) => candidate.kind === 'create');
      if (item) select(item);
    }
    
  };

  
  if (disabled && open) close();

  return {
    inputId,
    listId,
    rootRef,
    fieldRef,
    inputRef,
    popupRef,
    isOpen,
    selected,
    items,
    activeIndex,
    activeId,
    inputValue,
    position,
    getOptionLabel,
    openList,
    select,
    remove,
    onKeyDown,
    changeQuery,
    clear,
    toggleList,
    highlight,
  };
}
