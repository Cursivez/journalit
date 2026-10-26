import React, {
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Scope } from 'obsidian';
import { getPluginInstance } from '../../../utils/pluginContext';
import { ESCAPE_DELEGATE_ATTRIBUTE } from '../../../views/escapeKeySuppression';
import { hasOpenFullscreenPortal } from '../../image/fullscreenPortalPresence';
import { ModalEscapeProvider } from '../disclosureEscape';
import { X } from '../icons/ObsidianIcon';
import { t } from '../../../lang/helpers';

interface DrawerProps {
  title: string;
  subtitle?: string;
  
  headerStart?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  onEscape?: () => void;
  ownerDocument?: Document;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  panelRef?: React.Ref<HTMLDivElement>;
  overlayClassName?: string;
  allowWorkspaceShortcuts?: boolean;
}

const FOCUSABLE =
  'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])';


export function Drawer({
  title,
  subtitle,
  headerStart,
  children,
  onClose,
  onEscape = onClose,
  ownerDocument,
  initialFocusRef,
  panelRef,
  overlayClassName = '',
  allowWorkspaceShortcuts = false,
}: DrawerProps) {
  const [doc] = useState(() => ownerDocument ?? window.activeDocument);
  const app = getPluginInstance()?.app;
  const [scope] = useState(
    () => new Scope(allowWorkspaceShortcuts ? app?.scope : undefined)
  );
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const escape = useEffectEvent(onEscape);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const opener = doc.activeElement;
    const focusable = () =>
      Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) =>
          element.tabIndex >= 0 && element.getClientRects().length > 0
      );
    const foregroundSurface = () =>
      doc.querySelector(
        '.modal-container, .prompt, .menu, .suggestion-container'
      ) ||
      hasOpenFullscreenPortal(doc) ||
      Array.from(doc.querySelectorAll('.journalit-drawer-overlay')).slice(
        -1
      )[0] !== overlay;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.isComposing || foregroundSurface()) return;
      
      
      if (
        event
          .composedPath()
          .some(
            (target) =>
              target instanceof (doc.defaultView?.Element ?? Element) &&
              target !== overlay &&
              target.hasAttribute(ESCAPE_DELEGATE_ATTRIBUTE)
          )
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      escape();
      return false;
    };
    const binding = scope.register(null, 'Escape', handleEscape);
    app?.keymap.pushScope(scope);
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || foregroundSurface()) return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (
        !first ||
        !overlay.contains(doc.activeElement) ||
        (event.shiftKey
          ? doc.activeElement === first
          : doc.activeElement === last)
      ) {
        event.preventDefault();
        (event.shiftKey ? (last ?? overlay) : (first ?? overlay)).focus();
      }
    };
    const containFocus = (event: FocusEvent) => {
      if (foregroundSurface()) return;
      if (!event.composedPath().includes(overlay))
        (focusable()[0] ?? overlay).focus();
    };
    doc.addEventListener('keydown', handleTab, true);
    doc.addEventListener('focusin', containFocus);
    (initialFocusRef?.current ?? focusable()[0] ?? overlay).focus();
    return () => {
      app?.keymap.popScope(scope);
      scope.unregister(binding);
      doc.removeEventListener('keydown', handleTab, true);
      doc.removeEventListener('focusin', containFocus);
      const current = doc.activeElement;
      if (
        (!current || current === doc.body || overlay.contains(current)) &&
        opener instanceof (doc.defaultView?.HTMLElement ?? HTMLElement) &&
        opener.isConnected
      )
        opener.focus();
    };
  }, [app, doc, scope, initialFocusRef]);

  const content = (
    <div className="journalit-drawer-inner">
      <div className="journalit-drawer-header">
        <div className="journalit-drawer-heading">
          {headerStart}
          <h2 id={titleId} className="journalit-drawer-title">
            {title}
          </h2>
          {subtitle && <p className="journalit-drawer-subtitle">{subtitle}</p>}
        </div>
        <button
          type="button"
          className="journalit-drawer-close clickable-icon"
          aria-label={t('button.close')}
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  );

  return createPortal(
    <div
      ref={overlayRef}
      className={`journalit-drawer-overlay ${overlayClassName}`}
      tabIndex={-1}
      role="presentation"
      {...{ [ESCAPE_DELEGATE_ATTRIBUTE]: 'true' }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="journalit-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {app ? (
          <ModalEscapeProvider app={app} scope={scope}>
            {content}
          </ModalEscapeProvider>
        ) : (
          content
        )}
      </div>
    </div>,
    doc.body
  );
}
