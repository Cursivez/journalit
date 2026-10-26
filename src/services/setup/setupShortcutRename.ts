import type { JournalitSettings } from '../../settings/types';
import { eventBus } from '../events/EventBus';
import {
  remapSetupEntityShortcuts,
  restoreEntityShortcuts,
} from '../../utils/entityShortcutTargets';

interface Host {
  settings: JournalitSettings;
  saveSettings(): Promise<void>;
}


export async function commitSetupShortcutRename(
  host: Host,
  oldName: string,
  newName: string
) {
  const root = host.settings;
  const remap = remapSetupEntityShortcuts(root, oldName, newName);
  const before = {
    ...remap,
    previousHome: structuredClone(remap.previousHome),
    previousNavigation: structuredClone(remap.previousNavigation),
  };
  function capture() {
    return remap.changedSurfaces.map((surface) => ({
      surface,
      parent: root[surface],
      array: root[surface]?.entityShortcuts,
      
      value: JSON.stringify(root[surface]?.entityShortcuts),
    }));
  }
  function assertOwned(expected: ReturnType<typeof capture>) {
    for (const entry of expected) {
      const current = root[entry.surface];
      if (
        host.settings !== root ||
        current !== entry.parent ||
        current?.entityShortcuts !== entry.array ||
        JSON.stringify(current?.entityShortcuts) !== entry.value
      ) {
        throw new Error(
          'Setup shortcuts changed during the operation. Newer edits were retained.'
        );
      }
    }
  }
  const installed = capture();
  let restored = false;
  async function rollback() {
    if (restored || remap.changedSurfaces.length === 0) return;
    assertOwned(installed);
    restoreEntityShortcuts(root, before);
    const expected = capture();
    await host.saveSettings();
    assertOwned(expected);
    restored = true;
  }
  if (remap.changedSurfaces.length > 0) {
    try {
      await host.saveSettings();
      assertOwned(installed);
    } catch (error) {
      try {
        await rollback();
      } catch (rollbackError) {
        throw new AggregateError(
          [error, rollbackError],
          'Setup shortcuts could not be saved and recovery was incomplete.'
        );
      } finally {
        eventBus.publish('entity-shortcuts:changed', { surface: 'all' });
      }
      throw error;
    }
  }
  return {
    changed: remap.changedSurfaces.length > 0,
    assertCurrent: () => assertOwned(installed),
    rollback,
  };
}
