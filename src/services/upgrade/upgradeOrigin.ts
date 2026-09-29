

import {
  buildUpgradeUrl,
  UPGRADE_CAMPAIGNS,
  type UpgradeFeature,
} from '../../constants';


interface UpgradeOriginSurfaces {
  onboarding: Extract<UpgradeFeature, 'csvImport' | 'metatraderSync'>;
  manualTradeNudge: Extract<UpgradeFeature, 'csvImport'>;
}

type UpgradeOrigin = keyof UpgradeOriginSurfaces;


type MarkableUpgradeFeature = UpgradeOriginSurfaces[UpgradeOrigin];

interface PendingUpgradeOrigin {
  origin: UpgradeOrigin;
  feature: MarkableUpgradeFeature;
}


let pending: PendingUpgradeOrigin | null = null;

export function markUpgradeOrigin<O extends UpgradeOrigin>(
  origin: O,
  feature: UpgradeOriginSurfaces[O]
): void {
  pending = { origin, feature };
}


export function clearUpgradeOrigin(feature?: MarkableUpgradeFeature): void {
  if (feature !== undefined && pending?.feature !== feature) return;
  pending = null;
}


export function resolveUpgradeUrl(feature: UpgradeFeature): string {
  if (pending === null || pending.feature !== feature) {
    return buildUpgradeUrl(feature);
  }

  const { origin } = pending;
  pending = null;
  return buildUpgradeUrl(feature, UPGRADE_CAMPAIGNS[origin]);
}
