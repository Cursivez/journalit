
import { useCallback, useMemo } from 'react';
import { useLeafActive } from '../hooks/useLeafActive';
import type {
  TradeFilterMenuTour,
  TradeFilterMenuTourStop,
} from '../components/shared/filters/menu/FilterMenu';
import {
  useGuideAction,
  useGuideLeaf,
  useGuideTarget,
  useVisibleGuideStepId,
} from './GuideRuntimeLayer';
import {
  FILTER_MENU_EXCLUDE_STEP_ID,
  FILTER_MENU_EXCLUDE_TARGET_ID,
  FILTER_MENU_MATCH_STEP_ID,
  FILTER_MENU_MATCH_TARGET_ID,
  FILTER_MENU_OPENED_ACTION_ID,
  FILTER_MENU_PHASES_STEP_ID,
  FILTER_MENU_PHASES_TARGET_ID,
} from './filterMenuWhatsNewGuideIds';

const TOUR_STOPS: ReadonlyMap<string, TradeFilterMenuTourStop> = new Map([
  [FILTER_MENU_EXCLUDE_STEP_ID, 'exclude'],
  [FILTER_MENU_MATCH_STEP_ID, 'match'],
  [FILTER_MENU_PHASES_STEP_ID, 'phases'],
]);

export function useFilterMenuWhatsNewTour(): {
  guideTour: TradeFilterMenuTour | null;
  onOpenChange: (isOpen: boolean) => void;
} {
  const emitGuideAction = useGuideAction();
  const registerExcludeTarget = useGuideTarget(FILTER_MENU_EXCLUDE_TARGET_ID);
  const registerMatchTarget = useGuideTarget(FILTER_MENU_MATCH_TARGET_ID);
  const registerPhasesTarget = useGuideTarget(FILTER_MENU_PHASES_TARGET_ID);

  
  
  const visibleStepId = useVisibleGuideStepId();
  const isLeafOnScreen = useLeafActive(useGuideLeaf());
  const stop =
    (isLeafOnScreen && visibleStepId && TOUR_STOPS.get(visibleStepId)) || null;

  const guideTour = useMemo<TradeFilterMenuTour | null>(() => {
    if (!stop) return null;
    const registerTarget = {
      exclude: registerExcludeTarget,
      match: registerMatchTarget,
      phases: registerPhasesTarget,
    }[stop];
    return { stop, registerTarget };
  }, [registerExcludeTarget, registerMatchTarget, registerPhasesTarget, stop]);

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) emitGuideAction(FILTER_MENU_OPENED_ACTION_ID);
    },
    [emitGuideAction]
  );

  return { guideTour, onOpenChange };
}
