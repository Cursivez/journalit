

import type JournalitPlugin from '../main';

let pluginInstance: JournalitPlugin | null = null;

export function setPluginInstance(plugin: JournalitPlugin): void {
  pluginInstance = plugin;
}

export function clearPluginInstance(): void {
  pluginInstance = null;
}

export function getPluginInstance(): JournalitPlugin | null {
  return pluginInstance;
}
