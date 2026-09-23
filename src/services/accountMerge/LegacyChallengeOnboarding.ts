

import type JournalitPlugin from '../../main';
import type {
  AccountMetadata,
  LegacyChallengeOnboardingStatus,
} from '../../settings/types';
import { isOlderPluginVersion } from '../../utils/pluginVersion';


export const LEGACY_CHALLENGE_ONBOARDING_GUIDE_CONTEXT_KEY =
  'legacyChallengeOnboardingPending';


export const LEGACY_CHALLENGE_ONBOARDING_MIN_VERSION = '1.9.0';

interface LegacyChallengeOnboardingEligibilityInput {
  
  previousVersion?: string;
  accountMetadata?: Record<string, AccountMetadata>;
}

function isLegacyAccount(metadata: AccountMetadata): boolean {
  if (metadata.propChallenge) return false;
  return metadata.accountType?.toLowerCase() !== 'archived';
}


export function hasLegacyChallengeCandidates(
  accountMetadata: Record<string, AccountMetadata> | undefined
): boolean {
  return Object.values(accountMetadata ?? {}).some(isLegacyAccount);
}


export function isEligibleForLegacyChallengeOnboarding({
  previousVersion,
  accountMetadata,
}: LegacyChallengeOnboardingEligibilityInput): boolean {
  if (!previousVersion?.trim()) return false;
  if (
    !isOlderPluginVersion(
      previousVersion.trim(),
      LEGACY_CHALLENGE_ONBOARDING_MIN_VERSION
    )
  ) {
    return false;
  }

  return hasLegacyChallengeCandidates(accountMetadata);
}


export async function evaluateLegacyChallengeOnboarding(
  plugin: JournalitPlugin
): Promise<void> {
  const accountSettings = plugin.settings.account;
  if (!accountSettings || accountSettings.legacyChallengeOnboarding) return;

  const previousVersion =
    plugin.settings.backendIntegration?.lastSeenVersion ?? '';
  const eligible = isEligibleForLegacyChallengeOnboarding({
    previousVersion,
    accountMetadata: accountSettings.accountMetadata,
  });

  accountSettings.legacyChallengeOnboarding = {
    status: eligible ? 'pending' : 'completed',
    detectedAt: new Date().toISOString(),
    fromVersion: previousVersion,
  };
  await plugin.saveSettings();
}

export async function markLegacyChallengeOnboarding(
  plugin: JournalitPlugin,
  status: LegacyChallengeOnboardingStatus
): Promise<void> {
  const accountSettings = plugin.settings.account;
  if (!accountSettings) return;

  const current = accountSettings.legacyChallengeOnboarding;
  accountSettings.legacyChallengeOnboarding = {
    status,
    detectedAt: current?.detectedAt ?? new Date().toISOString(),
    fromVersion: current?.fromVersion ?? '',
  };
  await plugin.saveSettings();
}

interface LegacyAccountSuggestionInput {
  name: string;
  createdDate?: Date;
}

const PHASE_SUFFIX_PATTERN =
  /^(.*?)[\s\-_#]+(?:phase|step|stage|level|round|eval|evaluation|challenge|verification|funded|live|sim)(?:[\s\-_#]*(?:\d+|[ivxlcdm]+))?$/i;

function normalizeGroupKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\s\-_#]+/g, ' ')
    .trim();
}


export function suggestLegacyAccountGroups(
  accounts: readonly LegacyAccountSuggestionInput[]
): string[][] {
  const groups = new Map<string, LegacyAccountSuggestionInput[]>();

  for (const account of accounts) {
    const match = account.name.match(PHASE_SUFFIX_PATTERN);
    if (!match) continue;
    const key = normalizeGroupKey(match[1]);
    if (!key) continue;
    const bucket = groups.get(key);
    if (bucket) bucket.push(account);
    else groups.set(key, [account]);
  }

  const time = (account: LegacyAccountSuggestionInput): number => {
    const value = account.createdDate?.getTime();
    return value === undefined || Number.isNaN(value)
      ? Number.POSITIVE_INFINITY
      : value;
  };
  const byCreatedThenName = (
    a: LegacyAccountSuggestionInput,
    b: LegacyAccountSuggestionInput
  ): number => {
    const timeA = time(a);
    const timeB = time(b);
    if (timeA !== timeB) return timeA < timeB ? -1 : 1;
    return a.name.localeCompare(b.name);
  };

  const grouped: LegacyAccountSuggestionInput[][] = [];
  for (const bucket of groups.values()) {
    if (bucket.length >= 2) {
      grouped.push([...bucket].sort(byCreatedThenName));
    }
  }
  grouped.sort((a, b) => byCreatedThenName(a[0], b[0]));
  return grouped.map((bucket) => bucket.map((account) => account.name));
}
