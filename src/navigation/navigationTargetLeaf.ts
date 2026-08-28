import type { Workspace, WorkspaceLeaf } from 'obsidian';
import { CALENDAR_SIDEBAR_VIEW_TYPE } from '../views/CalendarSidebarView';
import { NAVIGATION_VIEW_TYPE } from '../views/NavigationView';

const UNREPLACEABLE_DOCKABLE_VIEW_TYPES = new Set<string>([
  NAVIGATION_VIEW_TYPE,
  CALENDAR_SIDEBAR_VIEW_TYPE,
]);


export function resolveNavigationTargetLeaf(
  workspace: Workspace,
  createNewLeaf: boolean
): WorkspaceLeaf {
  if (!createNewLeaf) {
    const mostRecent = workspace.getMostRecentLeaf(workspace.rootSplit);
    if (
      mostRecent &&
      !UNREPLACEABLE_DOCKABLE_VIEW_TYPES.has(mostRecent.view.getViewType())
    ) {
      return mostRecent;
    }
  }

  return workspace.getLeaf('tab');
}
