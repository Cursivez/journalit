

import {
  ACCOUNT_DASHBOARD_EMPTY_GUIDE_ID,
  ACCOUNT_DASHBOARD_MAIN_GUIDE_ID,
  ACCOUNT_DASHBOARD_MAIN_GUIDE_PROP_CHALLENGES_VERSION,
  ACCOUNT_DASHBOARD_WHATS_NEW_PROP_CHALLENGES_GUIDE_ID,
} from './accountDashboardGuideIds';
import type { PersistedGuideState } from './types';

const isFinished = (state: PersistedGuideState | null): boolean =>
  state?.status === 'completed' || state?.status === 'skipped';

export function resolveAccountDashboardBaseGuideId({
  accountsCount,
  mainGuideState,
  whatsNewGuideState,
}: {
  accountsCount: number;
  mainGuideState: PersistedGuideState | null;
  whatsNewGuideState: PersistedGuideState | null;
}): string {
  if (accountsCount === 0) {
    return ACCOUNT_DASHBOARD_EMPTY_GUIDE_ID;
  }
  const finishedBeforePropChallenges =
    isFinished(mainGuideState) &&
    mainGuideState !== null &&
    mainGuideState.guideVersion <
      ACCOUNT_DASHBOARD_MAIN_GUIDE_PROP_CHALLENGES_VERSION;
  if (finishedBeforePropChallenges && !isFinished(whatsNewGuideState)) {
    return ACCOUNT_DASHBOARD_WHATS_NEW_PROP_CHALLENGES_GUIDE_ID;
  }
  return ACCOUNT_DASHBOARD_MAIN_GUIDE_ID;
}
