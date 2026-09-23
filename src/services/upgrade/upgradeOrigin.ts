

import {
  buildUpgradeUrl,
  UPGRADE_CAMPAIGNS,
  type UpgradeFeature,
} from '../../constants';


export type OnboardingUpgradeFeature = Extract<
  UpgradeFeature,
  'csvImport' | 'metatraderSync'
>;


let pendingOrigin: OnboardingUpgradeFeature | null = null;

export function markOnboardingUpgradeOrigin(
  feature: OnboardingUpgradeFeature
): void {
  pendingOrigin = feature;
}


export function clearOnboardingUpgradeOrigin(
  feature?: OnboardingUpgradeFeature
): void {
  if (feature !== undefined && pendingOrigin !== feature) return;
  pendingOrigin = null;
}


export function resolveUpgradeUrl(feature: UpgradeFeature): string {
  if (pendingOrigin !== feature) return buildUpgradeUrl(feature);

  pendingOrigin = null;
  return buildUpgradeUrl(feature, UPGRADE_CAMPAIGNS.onboarding);
}
