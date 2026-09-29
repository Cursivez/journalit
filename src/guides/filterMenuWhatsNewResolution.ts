
import type { PersistedGuideState } from './types';
import {
  FILTER_MENU_OPEN_STEP_ID,
  FILTER_MENU_WHATS_NEW_VIEWS,
} from './filterMenuWhatsNewGuideIds';

const isFinished = (state: PersistedGuideState | null): boolean =>
  state?.status === 'completed' || state?.status === 'skipped';


const isEngaged = (state: PersistedGuideState | null): boolean =>
  isFinished(state) ||
  (state?.status === 'in_progress' &&
    state.currentStepId !== undefined &&
    state.currentStepId !== FILTER_MENU_OPEN_STEP_ID);


export function isFilterMenuWhatsNewDue(
  whatsNewGuideId: string,
  getPersistedState: (guideId: string) => PersistedGuideState | null
): boolean {
  const view = FILTER_MENU_WHATS_NEW_VIEWS.find(
    (candidate) => candidate.whatsNewGuideId === whatsNewGuideId
  );
  if (!view) return false;

  const mainState = getPersistedState(view.mainGuideId);
  if (
    !mainState ||
    !isFinished(mainState) ||
    mainState.guideVersion >= view.mainGuideTeachesSince
  ) {
    return false;
  }

  const learnedFromEvergreen = FILTER_MENU_WHATS_NEW_VIEWS.some((other) => {
    const state = getPersistedState(other.mainGuideId);
    return (
      isFinished(state) &&
      (state?.guideVersion ?? 0) >= other.mainGuideTeachesSince
    );
  });
  if (learnedFromEvergreen) return false;

  if (isFinished(getPersistedState(whatsNewGuideId))) return false;

  return FILTER_MENU_WHATS_NEW_VIEWS.every(
    (other) =>
      other.whatsNewGuideId === whatsNewGuideId ||
      !isEngaged(getPersistedState(other.whatsNewGuideId))
  );
}
