import { useCallback, useRef, type RefObject } from 'react';
import { useEventBus } from '../../../hooks/useEventBus';
import type { Layout } from '../../shared/gridLayout/reactGridLayoutCompat';

interface DashboardLayoutReloadRefs {
  activeDragItemId: RefObject<string | null>;
  isResizeActive: RefObject<boolean>;
  latestLayoutChange: RefObject<{
    currentLayout: Layout[];
    allLayouts: { [key: string]: Layout[] };
  } | null>;
}

export function useDashboardLayoutReload(
  reload: () => void,
  refs: DashboardLayoutReloadRefs
): () => boolean {
  const { activeDragItemId, isResizeActive, latestLayoutChange } = refs;
  const pendingReload = useRef(false);
  useEventBus(
    'layout:changed',
    useCallback(
      (payload) => {
        if (payload.view !== 'dashboard') return;
        const interacting =
          activeDragItemId.current !== null || isResizeActive.current;
        if (payload.source === 'ui') {
          
          
          if (interacting || latestLayoutChange.current !== null) return;
        } else if (interacting) {
          pendingReload.current = true;
          return;
        }
        
        
        latestLayoutChange.current = null;
        pendingReload.current = false;
        reload();
      },
      [activeDragItemId, isResizeActive, latestLayoutChange, reload]
    )
  );

  return useCallback(() => {
    if (!pendingReload.current) return false;
    pendingReload.current = false;
    latestLayoutChange.current = null;
    reload();
    return true;
  }, [latestLayoutChange, reload]);
}
