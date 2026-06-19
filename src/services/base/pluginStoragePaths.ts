import type { App } from 'obsidian';

const PLUGIN_ID = 'journalit';

function getJournalitPluginStoragePath(app: App): string {
  return `${app.vault.configDir}/plugins/${PLUGIN_ID}`;
}

export function getJournalitCachePath(app: App): string {
  return `${getJournalitPluginStoragePath(app)}/cache`;
}

export function getJournalitIndexesPath(app: App): string {
  return `${getJournalitPluginStoragePath(app)}/indexes`;
}

export function isPathWithinDirectory(
  path: string,
  directory: string
): boolean {
  return path === directory || path.startsWith(`${directory}/`);
}
