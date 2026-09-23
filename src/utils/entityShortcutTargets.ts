import { normalizeSetupKey } from '../services/setup/setupIdentity';
import { normalizeAccountLookupKey } from '../services/trade/core/TradeAccountIdentity';
import type { EntityShortcut, JournalitSettings } from '../settings/types';

type ShortcutSurface = 'home' | 'navigation';

interface EntityShortcutRemap {
  changedSurfaces: ShortcutSurface[];
  previousHome: EntityShortcut[] | undefined;
  previousNavigation: EntityShortcut[] | undefined;
}

function remapShortcuts(
  shortcuts: EntityShortcut[] | undefined,
  remapTarget: (shortcut: EntityShortcut) => EntityShortcut
): EntityShortcut[] | undefined {
  if (!shortcuts) return undefined;
  let changed = false;
  const remapped = shortcuts.map((shortcut) => {
    const nextShortcut = remapTarget(shortcut);
    if (nextShortcut !== shortcut) changed = true;
    return nextShortcut;
  });
  return changed ? remapped : shortcuts;
}

function applyRemap(
  settings: JournalitSettings,
  remapTarget: (shortcut: EntityShortcut) => EntityShortcut
): EntityShortcutRemap {
  const previousHome = settings.home?.entityShortcuts;
  const previousNavigation = settings.navigation?.entityShortcuts;
  const nextHome = remapShortcuts(previousHome, remapTarget);
  const nextNavigation = remapShortcuts(previousNavigation, remapTarget);
  const changedSurfaces: ShortcutSurface[] = [];

  if (settings.home && nextHome !== previousHome) {
    settings.home.entityShortcuts = nextHome ?? [];
    changedSurfaces.push('home');
  }
  if (settings.navigation && nextNavigation !== previousNavigation) {
    settings.navigation.entityShortcuts = nextNavigation ?? [];
    changedSurfaces.push('navigation');
  }

  return {
    changedSurfaces,
    previousHome,
    previousNavigation,
  };
}

export function remapAccountEntityShortcuts(
  settings: JournalitSettings,
  oldAccountName: string,
  newAccountName: string
): EntityShortcutRemap {
  const oldKey = normalizeAccountLookupKey(oldAccountName);
  return applyRemap(settings, (shortcut) => {
    if (
      shortcut.target.kind !== 'account' ||
      normalizeAccountLookupKey(shortcut.target.accountName) !== oldKey
    ) {
      return shortcut;
    }
    return {
      ...shortcut,
      target: { kind: 'account', accountName: newAccountName },
    };
  });
}

export function remapSetupEntityShortcuts(
  settings: JournalitSettings,
  oldSetupId: string,
  newSetupId: string
): EntityShortcutRemap {
  const oldKey = normalizeSetupKey(oldSetupId);
  return applyRemap(settings, (shortcut) => {
    if (
      shortcut.target.kind !== 'setup' ||
      normalizeSetupKey(shortcut.target.setupId) !== oldKey
    ) {
      return shortcut;
    }
    return {
      ...shortcut,
      target: { kind: 'setup', setupId: newSetupId },
    };
  });
}

export function restoreEntityShortcuts(
  settings: JournalitSettings,
  remap: EntityShortcutRemap
): void {
  if (remap.changedSurfaces.includes('home') && settings.home) {
    settings.home.entityShortcuts = remap.previousHome ?? [];
  }
  if (remap.changedSurfaces.includes('navigation') && settings.navigation) {
    settings.navigation.entityShortcuts = remap.previousNavigation ?? [];
  }
}
