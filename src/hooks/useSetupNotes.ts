import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type JournalitPlugin from '../main';
import { normalizeSetupKey } from '../services/setup/setupIdentity';
import type { Setup } from '../services/setup/types';
import { useEventBus } from './useEventBus';


export function useSetupNotes(
  plugin: JournalitPlugin | null | undefined,
  enabled = true
): readonly Setup[] | null {
  const [setups, setSetups] = useState<readonly Setup[] | null>(null);
  const refreshVersionRef = useRef(0);
  const isActive = enabled && Boolean(plugin);

  const refresh = useCallback(async () => {
    if (!enabled || !plugin) return;

    const refreshVersion = ++refreshVersionRef.current;
    try {
      const setupService = await plugin.serviceManager.getSetupService();
      
      await setupService.migrateLegacySetupOptions().catch((error) => {
        console.error(
          'Failed to migrate stored setup options into setup notes:',
          error
        );
      });
      const nextSetups = await setupService.listExistingSetups();
      if (refreshVersion !== refreshVersionRef.current) return;
      setSetups(nextSetups);
    } catch (error) {
      if (refreshVersion !== refreshVersionRef.current) return;
      console.error('Failed to load setups:', error);
      setSetups([]);
    }
  }, [enabled, plugin]);

  const reloadForJournal = useCallback(() => {
    
    setSetups(null);
    void refresh();
  }, [refresh]);

  useEffect(() => {
    void refresh();
    return () => {
      
      refreshVersionRef.current += 1;
    };
  }, [refresh]);

  useEventBus('setup:changed', refresh, isActive);
  useEventBus('folder-path:changed', reloadForJournal, isActive);

  return setups;
}

type SetupIdentity = Pick<Setup, 'id' | 'name' | 'aliases' | 'status'>;


function indexSetupsByKey(
  setups: readonly SetupIdentity[]
): Map<string, SetupIdentity> {
  const byKey = new Map<string, SetupIdentity>();
  for (const setup of setups) byKey.set(normalizeSetupKey(setup.name), setup);
  for (const setup of setups) {
    for (const reference of [setup.id, ...setup.aliases]) {
      const key = normalizeSetupKey(reference);
      if (key && !byKey.has(key)) byKey.set(key, setup);
    }
  }
  return byKey;
}


function isArchivedSetupReference(
  reference: string,
  setups: readonly SetupIdentity[]
): boolean {
  return (
    indexSetupsByKey(setups).get(normalizeSetupKey(reference))?.status ===
    'archived'
  );
}


function resolveSetupSelections(
  previousSelections: readonly string[],
  nextSelections: readonly string[],
  setups: readonly SetupIdentity[]
): string[] {
  const byKey = indexSetupsByKey(setups);
  const previousKeys = new Set(previousSelections.map(normalizeSetupKey));
  const seenKeys = new Set<string>();
  const resolved: string[] = [];

  for (const selection of nextSelections) {
    let value = selection;
    const key = normalizeSetupKey(selection);
    if (!previousKeys.has(key)) {
      const setup = byKey.get(key);
      if (setup?.status === 'archived') continue;
      if (setup) value = setup.name;
    }
    const valueKey = normalizeSetupKey(value);
    if (seenKeys.has(valueKey)) continue;
    seenKeys.add(valueKey);
    resolved.push(value);
  }
  return resolved;
}

interface SetupPickerState {
  
  loaded: boolean;
  
  options: string[];
  
  filterSelection: (
    previousSelections: readonly string[],
    nextSelections: readonly string[]
  ) => string[];
  
  saveSetup: (label: string) => Promise<void>;
}


export function useSetupPicker(
  plugin: JournalitPlugin | null | undefined,
  enabled = true
): SetupPickerState {
  const setups = useSetupNotes(plugin, enabled);

  return useMemo(() => {
    const knownSetups = setups ?? [];
    return {
      loaded: setups !== null,
      options: (setups ?? []).flatMap((setup) =>
        setup.status === 'archived' ? [] : [setup.name]
      ),
      filterSelection: (previousSelections, nextSelections) =>
        resolveSetupSelections(previousSelections, nextSelections, knownSetups),
      saveSetup: async (label) => {
        if (!plugin || isArchivedSetupReference(label, knownSetups)) return;
        const setupService = await plugin.serviceManager.getSetupService();
        await setupService.ensureSetup(label);
      },
    };
  }, [plugin, setups]);
}
