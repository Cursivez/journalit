import { setIcon } from 'obsidian';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { ReleaseMetadata } from '../../data/releasesData';
import { suspendViewGuidesWhileOpen } from '../../guides/suspendViewGuides';
import { t } from '../../lang/helpers';
import { hasOpenFullscreenPortal } from '../image/fullscreenPortalPresence';
import {
  InstalledUpdateContent,
  INSTALLED_UPDATE_PREVIEW_PORTAL_ID,
} from './InstalledUpdateContent';
import {
  ESCAPE_DELEGATE_ATTRIBUTE,
  hasDelegatedEscapeSurface,
} from '../../views/escapeKeySuppression';


export class InstalledUpdatePopup {
  private host: HTMLElement | null = null;
  private card: HTMLElement | null = null;
  private ownerDocument: Document | null = null;
  private previousFocus: HTMLElement | null = null;
  private root: Root | null = null;
  private closed = false;

  constructor(
    private readonly options: {
      version: string;
      release: ReleaseMetadata[string];
      onLearnMore: () => void;
      onDismiss: () => void;
    }
  ) {}

  open(): void {
    if (this.host || this.closed) return;

    const doc = window.activeDocument;
    this.ownerDocument = doc;
    const ElementCtor = doc.defaultView?.HTMLElement;
    const focused = doc.activeElement;
    this.previousFocus =
      ElementCtor && focused instanceof ElementCtor ? focused : null;

    this.host = doc.body.createDiv({ cls: 'journalit-update-popup-host' });
    const card = this.host.createDiv({
      cls: 'journalit-update-popup',
      attr: {
        role: 'dialog',
        'aria-modal': 'false',
        'aria-labelledby': 'journalit-update-popup-title',
        'aria-describedby': 'journalit-update-popup-description',
        [ESCAPE_DELEGATE_ATTRIBUTE]: 'true',
      },
    });
    this.card = card;
    suspendViewGuidesWhileOpen(card);

    const closeButton = card.createEl('button', {
      cls: 'journalit-update-popup__close',
      attr: { 'aria-label': t('button.close') },
    });
    setIcon(closeButton, 'x');
    closeButton.addEventListener('click', () => this.close());

    const scroll = card.createDiv({ cls: 'journalit-update-popup__scroll' });
    const { release, version } = this.options;
    this.root = createRoot(scroll);
    this.root.render(
      createElement(InstalledUpdateContent, { release, version })
    );

    const footer = card.createDiv({ cls: 'journalit-update-popup__footer' });
    footer
      .createEl('button', {
        cls: 'journalit-update-popup__dismiss',
        text: t('button.close'),
      })
      .addEventListener('click', () => this.close());
    const learnMoreButton = footer.createEl('button', {
      cls: 'journalit-update-popup__more',
    });
    const learnMoreIcon = learnMoreButton.createSpan({
      cls: 'journalit-update-popup__more-icon',
      attr: { 'aria-hidden': 'true' },
    });
    setIcon(learnMoreIcon, 'corner-down-right');
    learnMoreButton.createSpan({ text: t('button.learn-more') });
    learnMoreButton.addEventListener('click', () => {
      this.close();
      this.options.onLearnMore();
    });
    doc.addEventListener('pointerdown', this.onOutsidePointerDown, true);
    doc.addEventListener('keydown', this.onKeyDown, true);
  }

  private readonly onOutsidePointerDown = (event: PointerEvent): void => {
    if (this.ownerDocument && hasOpenFullscreenPortal(this.ownerDocument))
      return;
    if (!event.composedPath().some((target) => target === this.card)) {
      this.close({ restoreFocus: false });
    }
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || event.isComposing || event.defaultPrevented)
      return;
    
    if (
      this.ownerDocument &&
      hasDelegatedEscapeSurface(
        this.ownerDocument,
        this.card,
        event.composedPath()
      )
    )
      return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.close();
  };

  private close({ persistDismissal = true, restoreFocus = true } = {}): void {
    if (!this.host || !this.ownerDocument || !this.card) return;
    const doc = this.ownerDocument;
    const preview = doc.getElementById(INSTALLED_UPDATE_PREVIEW_PORTAL_ID);
    const ownedFocus =
      this.card.contains(doc.activeElement) ||
      preview?.contains(doc.activeElement);
    this.closed = true;
    doc.removeEventListener('pointerdown', this.onOutsidePointerDown, true);
    doc.removeEventListener('keydown', this.onKeyDown, true);
    this.root?.unmount();
    this.root = null;
    preview?.remove();
    this.host.remove();
    this.host = null;
    this.card = null;
    this.ownerDocument = null;
    if (restoreFocus && ownedFocus && this.previousFocus?.isConnected) {
      this.previousFocus.focus({ preventScroll: true });
    }
    this.previousFocus = null;
    if (persistDismissal) this.options.onDismiss();
  }

  
  cleanup(): void {
    this.close({ persistDismissal: false });
  }
}
