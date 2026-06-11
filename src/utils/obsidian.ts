

import { App } from 'obsidian';
import { getPluginInstance } from './pluginContext';


export function getApp(): App {
  const plugin = getPluginInstance();
  if (plugin?.app) {
    return plugin.app;
  }

  throw new Error('Could not access Obsidian app instance');
}
