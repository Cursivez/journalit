import { useCallback, useEffect, useSyncExternalStore } from 'react';
import type { WorkspaceLeaf } from 'obsidian';
import type { ViewGuideService } from './ViewGuideService';
import {
  HOME_CUSTOMIZE_GUIDE_ID,
  HOME_MAIN_GUIDE_ID,
  HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID,
} from './homeGuideIds';
import { resolveHomeGuideId } from './homeGuideResolution';
import { resolveContextualGuideId } from './contextualGuideResolution';

interface UseHomeGuideResolutionOptions {
  guideService: ViewGuideService | null;
  leaf: WorkspaceLeaf;
  isActive: boolean;
  
  isEditing: boolean;
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
  isEditing,
}: UseHomeGuideResolutionOptions): void => {
  const subscribeToGuideChanges = useCallback(
    (listener: () => void) =>
      guideService?.subscribe(listener) ?? (() => undefined),
    [guideService]
  );
  const getGuideStateSnapshot = useCallback(() => {
    if (!guideService) return '';

    return [
      HOME_MAIN_GUIDE_ID,
      HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID,
      HOME_CUSTOMIZE_GUIDE_ID,
    ]
      .map((guideId) => {
        const state = guideService.getPersistedGuideState(guideId);
        return [
          state?.guideVersion ?? '',
          state?.status ?? '',
          state?.currentStepId ?? '',
          state?.updatedAt ?? '',
          guideService.getSessionForGuide(guideId)?.status ?? '',
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

    const baseGuideId = resolveHomeGuideId({
      hasFinishedHomeGuide,
      homeGuideVersion: homeGuideState?.guideVersion,
      dashboardToggleGuideFinished: isGuideFinished(
        guideService,
        HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID
      ),
    });
    const activeSessionGuideId =
      [baseGuideId, HOME_CUSTOMIZE_GUIDE_ID]
        .map((guideId) => guideService.getSessionForGuideAndLeaf(guideId, leaf))
        .find((session) => session && session.status !== 'ended')?.guideId ??
      null;

    guideService.setResolvedGuideForLeaf(
      leaf,
      resolveContextualGuideId({
        baseGuideId,
        contextualGuides: [
          { guideId: HOME_CUSTOMIZE_GUIDE_ID, active: isEditing },
        ],
        activeSessionGuideId,
        getPersistedState: (guideId) =>
          guideService.getPersistedGuideState(guideId),
      })
    );
  }, [guideService, guideStateSnapshot, isActive, isEditing, leaf]);
};
