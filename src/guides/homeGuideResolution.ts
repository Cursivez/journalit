import {
  HOME_MAIN_GUIDE_ID,
  HOME_MAIN_GUIDE_MERGED_MODES_VERSION,
  HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID,
} from './homeGuideIds';

interface HomeGuideResolutionInput {
  hasFinishedHomeGuide: boolean;
  homeGuideVersion?: number;
  dashboardToggleGuideFinished: boolean;
}


export const resolveHomeGuideId = ({
  hasFinishedHomeGuide,
  homeGuideVersion,
  dashboardToggleGuideFinished,
}: HomeGuideResolutionInput): string => {
  const finishedBeforeMergedModes =
    hasFinishedHomeGuide &&
    homeGuideVersion !== undefined &&
    homeGuideVersion < HOME_MAIN_GUIDE_MERGED_MODES_VERSION;
  const shouldShowDashboardToggleGuide =
    finishedBeforeMergedModes && !dashboardToggleGuideFinished;

  if (shouldShowDashboardToggleGuide) {
    return HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID;
  }

  return HOME_MAIN_GUIDE_ID;
};
