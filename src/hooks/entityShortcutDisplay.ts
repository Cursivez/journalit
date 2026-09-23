import type { EntityShortcut, EntityShortcutTarget } from '../settings/types';
import type { EntityShortcutCatalogItem } from './useEntityShortcutCatalog';
import type { EntityShortcutCatalogErrors } from './useEntityShortcutCatalog';

interface EntityShortcutEntry {
  shortcut: EntityShortcut;
  item: EntityShortcutCatalogItem | null;
}

interface EntityShortcutDisplayItem {
  shortcut: EntityShortcut;
  target: EntityShortcutTarget;
  label: string;
  icon: string;
  unavailable: boolean;
}

export function getDisplayedEntityShortcuts(
  entries: EntityShortcutEntry[],
  options: {
    editing: boolean;
    loading: boolean;
    errors: EntityShortcutCatalogErrors;
  }
): EntityShortcutDisplayItem[] {
  const result: EntityShortcutDisplayItem[] = [];
  for (const entry of entries) {
    if (!entry.item && options.loading) {
      continue;
    }
    const targetKind = entry.shortcut.target.kind;
    const categoryError = options.errors[targetKind];
    if (!entry.item && !options.editing && !categoryError) {
      continue;
    }

    const target = entry.item?.target ?? entry.shortcut.target;
    result.push({
      shortcut: entry.shortcut,
      target,
      label:
        entry.item?.label ??
        (target.kind === 'account' ? target.accountName : target.setupId),
      icon:
        entry.item?.icon ??
        (target.kind === 'account' ? 'user' : 'flask-conical'),
      unavailable: entry.item === null && !categoryError,
    });
  }
  return result;
}
