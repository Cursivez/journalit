

import { setIcon } from 'obsidian';
import { t } from '../../lang/helpers';
import { openExternalUrl } from '../../utils/externalLinks';

export const UPDATE_TOAST_STYLES = `
.journalit-update-toast {
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0;
  font-family: var(--font-interface);
  position: absolute;
  bottom: 24px;
  left: 24px;
  z-index: 10000;
  max-width: 400px;
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  overflow: hidden;
}

.journalit-update-toast--visible {
  opacity: 1;
  transform: translateX(0);
}

.journalit-update-toast-container {
  position: relative;
}

.journalit-update-toast-title {
  color: var(--text-normal);
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 12px 0;
  padding: 0 20px;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.journalit-update-toast-version {
  color: var(--text-accent);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 4px 0;
  padding: 0 20px;
  display: block;
  opacity: 0.85;
}

.journalit-update-toast-close {
  position: absolute;
  top: 8px;
  right: 8px;
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

.journalit-update-toast-image {
  width: 100%;
  height: auto;
  border-radius: 8px 8px 0 0;
  margin-bottom: 12px;
  display: block;
}

.journalit-update-toast-description {
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  padding: 0 20px;
  opacity: 0.9;
}

.journalit-update-toast-separator {
  border-top: 1px solid var(--background-modifier-border);
  margin: 0 0 12px 0;
}

.journalit-update-toast-button-container {
  padding: 0 20px 16px 20px;
  display: flex;
  justify-content: space-between;
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
}

.journalit-update-toast-discord-button {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.journalit-update-toast-discord-button:hover {
  background: var(--background-secondary);
  color: var(--text-normal);
  border-color: var(--background-modifier-border-hover);
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
    bottom: 80px;
    left: 12px;
    right: 12px;
    max-width: calc(100vw - 24px);
  }
}
`;

interface ToastOptions {
  version: string;
  title: string;
  description: string;
  imageUrl?: string;
  parentContainer?: HTMLElement; 
  onViewReleaseNotes: () => void;
  
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
    this.containerEl = window.activeDocument.body.createDiv();
    this.containerEl.addClass('journalit-update-toast');
  }

  async show(options: ToastOptions): Promise<void> {
    if (this.dismissed) {
      return;
    }

    
    this.onDismissCallback = options.onDismiss || null;

    
    if (!this.containerEl) {
      this.createContainer();
    }

    this.containerEl!.empty();

    
    const closeBtn = this.containerEl!.createEl('button', {
      cls: 'journalit-update-toast-close',
      text: '×',
    });
    closeBtn.addEventListener('click', () => this.hide());

    
    if (options.imageUrl) {
      const image = await this.loadImage(options.imageUrl);
      if (image) {
        image.addClass('journalit-update-toast-image');
        this.containerEl!.appendChild(image);
      }
    }

    
    this.containerEl!.createDiv({
      cls: 'journalit-update-toast-version',
      text: options.version,
    });

    
    this.containerEl!.createEl('h3', {
      cls: 'journalit-update-toast-title',
      text: options.title,
    });

    
    this.containerEl!.createDiv({
      cls: 'journalit-update-toast-description',
      text: options.description,
    });

    
    this.containerEl!.createDiv({ cls: 'journalit-update-toast-separator' });

    
    const buttonContainer = this.containerEl!.createDiv({
      cls: 'journalit-update-toast-button-container',
    });

    
    const discordButton = buttonContainer.createEl('button', {
      cls: 'journalit-update-toast-discord-button',
    });

    
    const discordIconSpan = discordButton.createSpan({
      cls: 'journalit-update-toast-button-icon',
    });
    setIcon(discordIconSpan, 'messages-square');

    
    discordButton.appendText(t('button.discord'));

    discordButton.addEventListener('click', () => {
      openExternalUrl('https://discord.gg/AkSw3D9h8b');
    });

    
    const button = buttonContainer.createEl('button', {
      cls: 'journalit-update-toast-button',
      text: t('button.learn-more'),
    });

    
    const iconSpan = button.createSpan({
      cls: 'journalit-update-toast-button-icon',
    });
    setIcon(iconSpan, 'corner-down-right');

    button.addEventListener('click', () => {
      options.onViewReleaseNotes();
      this.hide();
    });

    
    if (!this.containerEl!.parentElement) {
      const parent = options.parentContainer || window.activeDocument.body;
      parent.appendChild(this.containerEl!);
    }

    
    window.requestAnimationFrame(() => {
      this.containerEl!.classList.add('journalit-update-toast--visible');
    });
  }

  hide(): void {
    if (this.dismissed || !this.containerEl) {
      return;
    }

    this.dismissed = true;

    
    if (this.onDismissCallback) {
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
      this.onDismissCallback = null;
    }

    
    this.containerEl.classList.remove('journalit-update-toast--visible');

    
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
    }

    
    this.hideTimeoutId = window.setTimeout(() => {
      this.containerEl?.remove();
      this.hideTimeoutId = null;
    }, 300);
  }

  
  cleanup(): void {
    
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }

    
    if (this.containerEl) {
      this.containerEl.remove();
      this.containerEl = null;
    }
  }

  private async loadImage(url: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = window.setTimeout(() => {
        img.src = '';
        resolve(null);
      }, 5000);

      img.onload = () => {
        window.clearTimeout(timeout);
        resolve(img);
      };

      img.onerror = (error) => {
        console.error('[CustomUpdateToast] Image load error:', error);
        window.clearTimeout(timeout);
        resolve(null);
      };

      img.src = url;
    });
  }
}
