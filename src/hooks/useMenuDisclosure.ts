

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
  type SetStateAction,
} from 'react';
import { ESCAPE_DELEGATE_ATTRIBUTE } from '../views/escapeKeySuppression';
import { useCloseOnOutsideMouseDown } from './useCloseOnOutsideMouseDown';


interface MenuDisclosureMenuProps {
  ref: RefObject<HTMLDivElement | null>;
  role: 'menu';
  onKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
  [ESCAPE_DELEGATE_ATTRIBUTE]: 'true';
}

export function useMenuDisclosure(options?: {
  initialFocus?: 'first' | 'checked';
}): {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  close: (returnFocus: boolean) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  menuProps: MenuDisclosureMenuProps;
} {
  const initialFocus = options?.initialFocus ?? 'first';
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus: boolean) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useCloseOnOutsideMouseDown(containerRef, () => close(false), isOpen);

  useEffect(() => {
    if (!isOpen) return;

    
    
    
    const doc = menuRef.current?.ownerDocument ?? window.activeDocument;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      close(true);
    };

    doc.addEventListener('keydown', handleKeyDown);
    return () => doc.removeEventListener('keydown', handleKeyDown);
  }, [close, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const menu = menuRef.current;
    if (!menu) return;

    const checked =
      initialFocus === 'checked'
        ? menu.querySelector<HTMLButtonElement>(
            '[aria-checked="true"]:not([disabled])'
          )
        : null;
    const first = menu.querySelector<HTMLButtonElement>(
      'button:not([disabled])'
    );
    (checked ?? first)?.focus();
  }, [initialFocus, isOpen]);

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    
    
    
    
    const menuView = menuRef.current?.ownerDocument.defaultView;
    const ElementCtor = menuView?.HTMLElement ?? HTMLElement;
    if (!(event.target instanceof ElementCtor)) return;
    event.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        'button:not([disabled])'
      ) ?? []
    );
    if (items.length === 0) return;
    const index = items.findIndex((item) => item === event.target);
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    items[(index + direction + items.length) % items.length]?.focus();
  };

  return {
    isOpen,
    setIsOpen,
    close,
    containerRef,
    triggerRef,
    menuProps: {
      ref: menuRef,
      role: 'menu',
      onKeyDown: handleMenuKeyDown,
      [ESCAPE_DELEGATE_ATTRIBUTE]: 'true',
    },
  };
}
