import { useMemo, useSyncExternalStore } from 'react';
import { TFile } from 'obsidian';
import type JournalitPlugin from '../../../main';


export function useNoteFrontmatter(
  plugin: JournalitPlugin,
  filePath: string
): Record<string, unknown> | null {
  const subscribe = useMemo(
    () => (notify: () => void) => {
      const ref = plugin.app.metadataCache.on('changed', (file) => {
        if (file.path === filePath) notify();
      });
      return () => plugin.app.metadataCache.offref(ref);
    },
    [plugin, filePath]
  );
  return useSyncExternalStore(subscribe, () => {
    const file = plugin.app.vault.getAbstractFileByPath(filePath);
    return file instanceof TFile
      ? (plugin.app.metadataCache.getFileCache(file)?.frontmatter ?? null)
      : null;
  });
}
