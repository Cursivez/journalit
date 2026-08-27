import { useCallback, useEffect, useSyncExternalStore } from 'react';
import type { WorkspaceLeaf } from 'obsidian';
import type { ViewGuideService } from './ViewGuideService';
import {
  HOME_MAIN_GUIDE_ID,
  HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID,
} from './homeGuideIds';
import { resolveHomeGuideId } from './homeGuideResolution';

interface UseHomeGuideResolutionOptions {
  guideService: ViewGuideService | null;
  leaf: WorkspaceLeaf;
  isActive: boolean;
}

const isGuideFinished = (
  guideService: ViewGuideService,
  guideId: string
): boolean => {
  const state = guideService.getPersistedGuideState(guideId);
  return state?.status === 'completed' || state?.status === 'skipped';
};


export const useHomeGuideResolution = ({
  guideService,
  leaf,
  isActive,
}: UseHomeGuideResolutionOptions): void => {
  const subscribeToGuideChanges = useCallback(
    (listener: () => void) =>
      guideService?.subscribe(listener) ?? (() => undefined),
    [guideService]
  );
  const getGuideStateSnapshot = useCallback(() => {
    if (!guideService) return '';

    return [HOME_MAIN_GUIDE_ID, HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID]
      .map((guideId) => {
        const state = guideService.getPersistedGuideState(guideId);
        return [
          state?.guideVersion ?? '',
          state?.status ?? '',
          state?.currentStepId ?? '',
          state?.updatedAt ?? '',
        ].join(':');
      })
      .join('|');
  }, [guideService]);
  const guideStateSnapshot = useSyncExternalStore(
    subscribeToGuideChanges,
    getGuideStateSnapshot,
    () => ''
  );

  useEffect(() => {
    if (!isActive || !guideService) return;

    const homeGuideState =
      guideService.getPersistedGuideState(HOME_MAIN_GUIDE_ID);
    const hasFinishedHomeGuide =
      homeGuideState?.status === 'completed' ||
      homeGuideState?.status === 'skipped';

    guideService.setResolvedGuideForLeaf(
      leaf,
      resolveHomeGuideId({
        hasFinishedHomeGuide,
        homeGuideVersion: homeGuideState?.guideVersion,
        dashboardToggleGuideFinished: isGuideFinished(
          guideService,
          HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID
        ),
      })
    );
  }, [guideService, guideStateSnapshot, isActive, leaf]);
};
