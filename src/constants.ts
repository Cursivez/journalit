
const UPGRADE_LOGIN_URL = 'https://journalit.co/login';


const UPGRADE_FEATURE_CONTENT = {
  csvImport: 'csv_import',
  quickTradeImport: 'quick_trade_import',
  metatraderSync: 'metatrader_sync',
  economicCalendar: 'economic_calendar',
  propFirmProfiles: 'prop_firm_profiles',
  genericUpgradeModal: 'generic_upgrade_modal',
} as const;

export type UpgradeFeature = keyof typeof UPGRADE_FEATURE_CONTENT;

function isUpgradeFeatureKey(key: string): key is UpgradeFeature {
  return key in UPGRADE_FEATURE_CONTENT;
}

const UPGRADE_FEATURE_BY_CONTENT = new Map<string, UpgradeFeature>();
for (const key of Object.keys(UPGRADE_FEATURE_CONTENT)) {
  if (isUpgradeFeatureKey(key)) {
    UPGRADE_FEATURE_BY_CONTENT.set(UPGRADE_FEATURE_CONTENT[key], key);
  }
}


export function parseUpgradeFeatureContent(
  value: unknown
): UpgradeFeature | null {
  if (typeof value !== 'string') return null;
  return UPGRADE_FEATURE_BY_CONTENT.get(value) ?? null;
}

export const UPGRADE_CAMPAIGNS = {
  
  default: 'pro_upgrade',
  
  onboarding: 'pro_upgrade_onboarding',
} as const;

type UpgradeCampaign =
  (typeof UPGRADE_CAMPAIGNS)[keyof typeof UPGRADE_CAMPAIGNS];

export function buildUpgradeUrl(
  feature: UpgradeFeature,
  campaign: UpgradeCampaign = UPGRADE_CAMPAIGNS.default
): string {
  const params = new URLSearchParams({
    intent: 'subscribe',
    billingPeriod: 'yearly',
    utm_source: 'journalit_plugin',
    utm_medium: 'product',
    utm_campaign: campaign,
    utm_content: UPGRADE_FEATURE_CONTENT[feature],
  });
  return `${UPGRADE_LOGIN_URL}?${params.toString()}`;
}


export const DEFAULT_PRIVACY_MASK = '***';
