

import { setIcon } from 'obsidian';
import { t } from '../../lang/helpers';
import {
  mountBottomLeftNotification,
  removeBottomLeftNotification,
} from './BottomLeftNotificationHost';

export const UPDATE_TOAST_STYLES = `
.journalit-update-toast {
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px 52px 16px 18px;
  font-family: var(--font-interface);
  position: relative;
  width: 360px;
  max-width: calc(100% - 48px);
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "title actions"
    "description actions";
  align-items: center;
  column-gap: 20px;
  row-gap: 3px;
}

.journalit-update-toast--visible {
  opacity: 1;
  transform: translateX(0);
}

.journalit-update-toast-title {
  color: var(--text-normal);
  grid-area: title;
  min-width: 0;
  margin: 0;
  padding: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.journalit-update-toast-description {
  color: var(--text-muted);
  opacity: 0.9;
  grid-area: description;
  min-width: 0;
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.journalit-update-toast-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  font-weight: 300;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1;
  padding: 0;
  padding-bottom: 1px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.journalit-update-toast-close:hover {
  color: var(--text-normal);
  background: var(--background-secondary);
}

.journalit-update-toast-button-container {
  grid-area: actions;
  align-self: end;
  padding: 0;
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.journalit-update-toast-button {
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.journalit-update-toast-button:hover {
  background: var(--interactive-accent-hover);
  color: var(--text-on-accent);
}

.journalit-update-toast-button-icon {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .journalit-update-toast {
    max-width: none;
    width: auto;
  }

  .journalit-update-toast-description {
    white-space: normal;
    overflow: visible;
  }
}
`;

interface ToastAction {
  label: string;
  icon: string;
  onClick: () => void;
  persistDismissalAfterClick?: boolean;
}

interface ToastOptions {
  title: string;
  description?: string;
  primaryAction: ToastAction;
  
  onDismiss?: () => void | Promise<void>;
}

export class CustomUpdateToast {
  private containerEl: HTMLElement | null = null;
  private dismissed: boolean = false;
  private hideTimeoutId: number | null = null;
  private onDismissCallback: (() => void | Promise<void>) | null = null;

  constructor() {
    // intentional
  }

  private createContainer(): void {
    this.containerEl = mountBottomLeftNotification('journalit-update-toast');
  }

  show(options: ToastOptions): void {
    if (this.dismissed) {
      return;
    }

    if (this.containerEl && !this.containerEl.isConnected) {
      removeBottomLeftNotification(this.containerEl);
      this.containerEl = null;
    }

    
    this.onDismissCallback = options.onDismiss || null;

    
    if (!this.containerEl) {
      this.createContainer();
    }

    this.containerEl!.empty();
    
    const closeBtn = this.containerEl!.createEl('button', {
      cls: 'journalit-update-toast-close',
      text: '×',
      attr: { 'aria-label': t('button.close') },
    });
    closeBtn.addEventListener('click', () => this.hide());

    
    this.containerEl!.createEl('h3', {
      cls: 'journalit-update-toast-title',
      text: options.title,
    });

    if (options.description) {
      this.containerEl!.createDiv({
        cls: 'journalit-update-toast-description',
        text: options.description,
      });
    }

    
    const buttonContainer = this.containerEl!.createDiv({
      cls: 'journalit-update-toast-button-container',
    });

    
    const button = buttonContainer.createEl('button', {
      cls: 'journalit-update-toast-button',
    });

    
    const iconSpan = button.createSpan({
      cls: 'journalit-update-toast-button-icon',
    });
    setIcon(iconSpan, options.primaryAction.icon);
    button.appendText(options.primaryAction.label);

    button.addEventListener('click', () => {
      options.primaryAction.onClick();
      this.hide(options.primaryAction.persistDismissalAfterClick !== false);
    });

    
    const container = this.containerEl;
    window.requestAnimationFrame(() => {
      if (this.containerEl === container && container?.isConnected) {
        container.classList.add('journalit-update-toast--visible');
      }
    });
  }

  hide(persistDismissal = true): void {
    if (this.dismissed || !this.containerEl) {
      return;
    }

    this.dismissed = true;

    
    if (persistDismissal && this.onDismissCallback) {
      try {
        const result = this.onDismissCallback();
        if (result instanceof Promise) {
          result.catch((err) =>
            console.error('[CustomUpdateToast] Dismiss callback error:', err)
          );
        }
      } catch (err) {
        console.error('[CustomUpdateToast] Dismiss callback error:', err);
      }
    }
    this.onDismissCallback = null;

    
    this.containerEl.classList.remove('journalit-update-toast--visible');

    
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
    }

    
    this.hideTimeoutId = window.setTimeout(() => {
      if (this.containerEl) {
        removeBottomLeftNotification(this.containerEl);
        this.containerEl = null;
      }
      this.hideTimeoutId = null;
    }, 300);
  }

  
  cleanup(): void {
    
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }

    
    if (this.containerEl) {
      removeBottomLeftNotification(this.containerEl);
      this.containerEl = null;
    }
  }
}
