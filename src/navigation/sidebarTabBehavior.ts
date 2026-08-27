import type JournalitPlugin from '../main';
import type { NavigationSource } from './types';

interface SidebarTabNavigation {
  createNewLeaf: boolean;
  source: Extract<NavigationSource, 'sidebar'>;
}


export function resolveSidebarTabNavigation(
  plugin: Pick<JournalitPlugin, 'settings'>
): SidebarTabNavigation {
  return {
    createNewLeaf: plugin.settings.navigation?.tabBehavior === 'newTab',
    source: 'sidebar',
  };
}
