import { WorkspaceLeaf } from 'obsidian';
import { useEffect, useState } from 'react';
import { usePlugin } from './usePlugin';

const isLeafVisible = (leaf: WorkspaceLeaf): boolean => {
  if (leaf.isDeferred) return false;

  const containerEl = leaf.view.containerEl;
  if (!containerEl.isConnected) return false;

  const style =
    containerEl.ownerDocument.defaultView?.getComputedStyle(containerEl);
  if (style?.display === 'none' || style?.visibility === 'hidden') {
    return false;
  }

  return containerEl.getClientRects().length > 0;
};

export function useLeafActive(leaf: WorkspaceLeaf): boolean {
  const plugin = usePlugin();
  const [isActive, setIsActive] = useState(() => isLeafVisible(leaf));

  useEffect(() => {
    if (!plugin) return;

    const update = () => {
      setIsActive(isLeafVisible(leaf));
    };

    update();
    const activeLeafRef = plugin.app.workspace.on('active-leaf-change', update);
    const layoutRef = plugin.app.workspace.on('layout-change', update);

    return () => {
      plugin.app.workspace.offref(activeLeafRef);
      plugin.app.workspace.offref(layoutRef);
    };
  }, [leaf, plugin]);

  return isActive;
}
