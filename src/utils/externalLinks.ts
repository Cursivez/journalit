

import { Notice, Platform } from 'obsidian';
import { t } from '../lang/helpers';

export const DEFAULT_ALLOWED_HOSTNAMES = [
  'journalit.co',
  'api.journalit.co',
  'discord.gg',
  'github.com',
];

const OBSIDIAN_PLUGIN_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

interface OpenExternalUrlOptions {
  onPopupBlocked?: (url: string) => void | Promise<void>;
}

function openObsidianProtocolLink(uri: string): void {
  try {
    const link = window.activeDocument.body.createEl('a', {
      attr: { href: uri },
    });
    link.click();
    link.remove();
  } catch (error) {
    console.error(
      '[ExternalLinks] Failed to open Obsidian protocol URI:',
      error
    );
    new Notice(
      t('onboarding.activation.notice.popup-blocked-manual', { url: uri }),
      5000
    );
  }
}

export function openObsidianPluginPage(pluginId: string): void {
  if (!OBSIDIAN_PLUGIN_ID_PATTERN.test(pluginId)) {
    new Notice(t('onboarding.activation.notice.invalid-url'), 5000);
    return;
  }

  const uri = `obsidian://show-plugin?id=${encodeURIComponent(pluginId)}`;
  if (Platform.isDesktopApp) {
    try {
      const electronShell = (
        window as Window & {
          require?: (module: string) => {
            shell?: {
              openExternal: (targetUrl: string) => void | Promise<void>;
            };
          };
        }
      ).require?.('electron')?.shell;
      if (electronShell) {
        const result = electronShell.openExternal(uri);
        if (result instanceof Promise) {
          void result.catch((error) => {
            console.warn(
              '[ExternalLinks] Obsidian protocol dispatch failed, falling back to protocol link:',
              error
            );
            openObsidianProtocolLink(uri);
          });
        }
        return;
      }
      throw new Error('Electron shell unavailable');
    } catch (error) {
      console.warn(
        '[ExternalLinks] Electron shell not available, falling back to protocol link:',
        error
      );
    }
  }

  openObsidianProtocolLink(uri);
}

export function openExternalUrl(
  url: string,
  allowedHostnames: string[] = DEFAULT_ALLOWED_HOSTNAMES,
  options: OpenExternalUrlOptions = {}
): void {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    new Notice(t('onboarding.activation.notice.invalid-url'), 5000);
    return;
  }

  const validProtocol = parsedUrl.protocol === 'https:';
  if (!validProtocol) {
    new Notice(t('onboarding.activation.notice.invalid-url'), 5000);
    return;
  }

  if (!allowedHostnames.includes(parsedUrl.hostname)) {
    new Notice(t('onboarding.activation.notice.invalid-url'), 5000);
    return;
  }

  if (Platform.isDesktopApp) {
    try {
      const electronShell = (
        window as Window & {
          require?: (module: string) => {
            shell?: { openExternal: (targetUrl: string) => void };
          };
        }
      ).require?.('electron')?.shell;
      if (electronShell) {
        electronShell.openExternal(url);
        return;
      }
      throw new Error('Electron shell unavailable');
    } catch (error) {
      console.warn(
        '[ExternalLinks] Electron shell not available, falling back to window.open:',
        error
      );
    }
  }

  try {
    const newWindow = window.open(url, '_blank');
    if (
      !newWindow ||
      newWindow.closed ||
      typeof newWindow.closed === 'undefined'
    ) {
      if (options.onPopupBlocked) {
        void options.onPopupBlocked(url);
      } else {
        new Notice(
          t('onboarding.activation.notice.popup-blocked-manual', { url }),
          5000
        );
      }
    }
  } catch (error) {
    console.error('[ExternalLinks] Failed to open browser:', error);
    if (options.onPopupBlocked) {
      void options.onPopupBlocked(url);
    } else {
      new Notice(
        t('onboarding.activation.notice.popup-blocked-manual', { url }),
        5000
      );
    }
  }
}
