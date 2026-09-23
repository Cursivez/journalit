import { useCallback, useMemo, useRef, useState } from 'react';
import { Notice } from 'obsidian';

import type JournalitPlugin from '../main';
import type { EntityShortcut, EntityShortcutTarget } from '../settings/types';
import { eventBus } from '../services/events/EventBus';
import { generateUUID } from '../utils/uuid';
import { t } from '../lang/helpers';
import {
  entityShortcutTargetKey,
  useEntityShortcutCatalog,
} from './useEntityShortcutCatalog';
import { useEventBus } from './useEventBus';

type EntityShortcutSurface = 'home' | 'navigation';

export function useEntityShortcuts(
  plugin: JournalitPlugin,
  surface: EntityShortcutSurface,
  catalogRequested: boolean
) {
  const readShortcuts = useCallback(
    () =>
      surface === 'home'
        ? (plugin.settings.home?.entityShortcuts ?? [])
        : (plugin.settings.navigation?.entityShortcuts ?? []),
    [plugin, surface]
  );
  const [shortcuts, setShortcuts] = useState<EntityShortcut[]>(readShortcuts);
  const mutationQueueRef = useRef<Promise<void> | null>(null);
  const catalogRequest = useMemo(
    () => ({
      account:
        catalogRequested ||
        shortcuts.some((shortcut) => shortcut.target.kind === 'account'),
      setup:
        catalogRequested ||
        shortcuts.some((shortcut) => shortcut.target.kind === 'setup'),
    }),
    [catalogRequested, shortcuts]
  );
  const catalog = useEntityShortcutCatalog(plugin, catalogRequest);
  const resolveShortcut = catalog.resolveShortcut;

  const applyShortcuts = useCallback(
    (nextShortcuts: EntityShortcut[]) => {
      const normalizedShortcuts = nextShortcuts.map((shortcut, order) => ({
        ...shortcut,
        order,
      }));
      setShortcuts(normalizedShortcuts);
      if (surface === 'home') {
        plugin.settings.home = {
          ...plugin.settings.home!,
          entityShortcuts: normalizedShortcuts,
        };
      } else {
        plugin.settings.navigation = {
          ...plugin.settings.navigation!,
          entityShortcuts: normalizedShortcuts,
        };
      }
      return normalizedShortcuts;
    },
    [plugin, surface]
  );

  const mutateShortcuts = useCallback(
    (
      buildNext: (currentShortcuts: EntityShortcut[]) => EntityShortcut[] | null
    ): Promise<void> => {
      const mutation = (mutationQueueRef.current ?? Promise.resolve()).then(
        async () => {
          const previousShortcuts = readShortcuts();
          const nextShortcuts = buildNext(previousShortcuts);
          if (!nextShortcuts) return;

          applyShortcuts(nextShortcuts);
          try {
            await plugin.saveSettings();
          } catch (error) {
            applyShortcuts(previousShortcuts);
            console.error('Failed to save entity shortcuts:', error);
            new Notice(t('error.settings.save-failed'), 5000);
            return;
          }
          eventBus.publish('entity-shortcuts:changed', { surface });
        }
      );
      mutationQueueRef.current = mutation;
      return mutation;
    },
    [applyShortcuts, plugin, readShortcuts, surface]
  );

  const syncFromSettings = useCallback(() => {
    const nextShortcuts = readShortcuts();
    setShortcuts(nextShortcuts);
  }, [readShortcuts]);

  useEventBus('entity-shortcuts:changed', ({ surface: changedSurface }) => {
    if (changedSurface === 'all' || changedSurface === surface) {
      syncFromSettings();
    }
  });
  useEventBus('settings:changed', syncFromSettings);

  const addShortcut = useCallback(
    async (target: EntityShortcutTarget) => {
      const targetKey = entityShortcutTargetKey(target);
      await mutateShortcuts((currentShortcuts) => {
        if (
          currentShortcuts.some(
            (shortcut) => entityShortcutTargetKey(shortcut.target) === targetKey
          )
        ) {
          return null;
        }
        return [
          ...currentShortcuts,
          {
            id: `${surface}-entity-${generateUUID()}`,
            target,
            order: currentShortcuts.length,
          },
        ];
      });
    },
    [mutateShortcuts, surface]
  );

  const removeShortcut = useCallback(
    (shortcutId: string) => {
      void mutateShortcuts((currentShortcuts) => {
        const nextShortcuts = currentShortcuts.filter(
          (shortcut) => shortcut.id !== shortcutId
        );
        return nextShortcuts.length === currentShortcuts.length
          ? null
          : nextShortcuts;
      });
    },
    [mutateShortcuts]
  );

  const shortcutEntries = useMemo(
    () =>
      [...shortcuts]
        .sort((a, b) => a.order - b.order)
        .map((shortcut) => ({
          shortcut,
          item: resolveShortcut(shortcut),
        })),
    [resolveShortcut, shortcuts]
  );

  return {
    shortcuts,
    shortcutEntries,
    catalogItems: catalog.items,
    catalogLoading: catalog.loading,
    catalogError: catalog.error,
    catalogErrors: catalog.errors,
    addShortcut,
    removeShortcut,
  };
}
