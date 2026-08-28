

import { Platform, type Hotkey } from 'obsidian';
import type JournalitPlugin from '../main';

const HOTKEY_SETTINGS_POLL_INTERVAL_MS = 50;
const HOTKEY_SETTINGS_MAX_ATTEMPTS = 60;

const ADD_TRADE_SUGGESTED_HOTKEY: Hotkey = {
  modifiers: ['Mod', 'Alt'],
  key: 'A',
};

export const ADD_TRADE_SUGGESTED_HOTKEYS: Hotkey[] = [
  ADD_TRADE_SUGGESTED_HOTKEY,
];

const modifierLabel = (modifier: string): string => {
  if (modifier === 'Mod') return Platform.isMacOS ? 'Cmd' : 'Ctrl';
  if (modifier === 'Alt') return Platform.isMacOS ? 'Option' : 'Alt';
  return modifier;
};

export const getAddTradeHotkeyParts = (): string[] => [
  ...ADD_TRADE_SUGGESTED_HOTKEY.modifiers.map(modifierLabel),
  ADD_TRADE_SUGGESTED_HOTKEY.key,
];

interface SuggestedHotkeyResult {
  wasSet: boolean;
  display: string | null;
}

export function setSuggestedHotkeyIfMissing(
  plugin: JournalitPlugin,
  commandId: string,
  suggestedHotkeys: Hotkey[]
): SuggestedHotkeyResult {
  const hotkeyManager = plugin.app.hotkeyManager;
  const existing = hotkeyManager?.getHotkeys?.(commandId) ?? [];
  if (existing.length > 0 || !hotkeyManager?.setHotkeys) {
    return { wasSet: false, display: null };
  }

  hotkeyManager.setHotkeys(commandId, suggestedHotkeys);
  hotkeyManager.save?.();
  return {
    wasSet: true,
    display: hotkeyManager.printHotkeyForCommand?.(commandId) ?? null,
  };
}

export function openHotkeySettingsForCommand(
  plugin: JournalitPlugin,
  commandName: string
): () => void {
  plugin.app.setting?.open();
  plugin.app.setting?.openTabById('hotkeys');

  let attempts = 0;
  let intervalId: number | null = window.setInterval(() => {
    attempts += 1;
    const modal = window.activeDocument.querySelector('.modal.mod-settings');
    if (modal) {
      const specificSearchInput = modal.querySelector<HTMLInputElement>(
        'input.setting-search-input'
      );
      const fallbackSearchInput = Array.from(
        modal.querySelectorAll<HTMLInputElement>('input')
      ).find((input) => {
        const placeholder = (
          input.getAttribute('placeholder') ?? ''
        ).toLowerCase();
        return placeholder.includes('search') || placeholder.includes('filter');
      });
      const searchInput = specificSearchInput ?? fallbackSearchInput;
      if (searchInput) {
        searchInput.value = commandName;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.focus();
        if (intervalId != null) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      }
    }

    if (attempts >= HOTKEY_SETTINGS_MAX_ATTEMPTS && intervalId != null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }, HOTKEY_SETTINGS_POLL_INTERVAL_MS);

  return () => {
    if (intervalId == null) return;
    window.clearInterval(intervalId);
    intervalId = null;
  };
}
