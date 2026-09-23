import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropFirmProfileCatalog,
  PropFirmProfileSelection,
  PropFirmProfilePhase,
} from './types';
import type { PersonalPropFirmProfile } from './PersonalPropFirmProfiles';
import { resolveProfileApplicability } from './ProfileApplicability';
import {
  findCatalogCorrections,
  type CorrectionMatch,
} from './PropChallengeCatalogCorrections';
import { personalProfileSelection } from './PersonalPropFirmProfiles';
import {
  canonicalProfileContent,
  sameProfileContent,
  policyAt,
  ruleDefinition,
} from './PropChallengePolicyHistory';

export function findAccountSourceProfile(
  config: PropChallengeConfig,
  catalog: PropFirmProfileCatalog | undefined,
  personal: readonly PersonalPropFirmProfile[]
): PropFirmProfileSelection | undefined {
  const ref = config.profileRef;
  if (!ref) return undefined;
  if (ref.source === 'personal') {
    const profile = personal.find(
      (item) => item.id === ref.challengeId && item.id === ref.firmId
    );
    return profile ? personalProfileSelection(profile) : undefined;
  }
  const firm = catalog?.firms.find((item) => item.id === ref.firmId);
  const challenge = firm?.challenges.find(
    (item) => item.id === ref.challengeId
  );
  if (!catalog || !firm || !challenge) return undefined;
  return {
    source: 'catalog',
    firmId: firm.id,
    firmName: firm.name,
    catalogVersion: catalog.version,
    verifiedAt: firm.verifiedAt,
    challenge,
  };
}

export interface ProfileNoticeComparison {
  corrections?: CorrectionMatch[];
  changed: Record<string, string>;
  unreviewedPhaseIds: string[];
  unknownBaseline: boolean;
}

function policyDefinition(phase: PropFirmProfilePhase) {
  return {
    stage: phase.stage,
    startingBalance: phase.startingBalance,
    rules: phase.rules,
    payoutPolicy: phase.payoutPolicy,
  };
}


export async function compareAccountSourceProfile(
  config: PropChallengeConfig,
  selection: PropFirmProfileSelection
): Promise<ProfileNoticeComparison> {
  const result: ProfileNoticeComparison = {
    changed: {},
    unreviewedPhaseIds: [],
    unknownBaseline: false,
  };
  const ref = config.profileRef;
  if (
    !ref ||
    ref.firmId !== selection.firmId ||
    ref.challengeId !== selection.challenge.id ||
    (ref.source ?? 'catalog') !== (selection.source ?? 'catalog') ||
    selection.catalogVersion < ref.catalogVersion
  )
    return result;
  const corrections = await findCatalogCorrections(config, selection);
  if (corrections.length) result.corrections = corrections;
  const pending: Array<{
    phase: PropChallengePhase;
    incoming: PropFirmProfilePhase;
    phaseCorrections: CorrectionMatch[];
    profilePhaseIndex: number;
  }> = [];
  for (const phase of config.phases) {
    const phaseCorrections = corrections.filter((c) => c.phaseId === phase.id);
    if (
      !phaseCorrections.length &&
      phase.status !== 'active' &&
      phase.status !== 'pending'
    )
      continue;
    if (
      (!phase.profileSnapshot && !phaseCorrections.length) ||
      phase.profilePhaseIndex === undefined
    ) {
      result.unknownBaseline = true;
      continue;
    }
    const profilePhaseIndex = phase.profilePhaseIndex;
    const incoming = selection.challenge.phases[profilePhaseIndex];
    if (
      !incoming ||
      (!phaseCorrections.length &&
        phase.profileSnapshot &&
        sameProfileContent(
          policyDefinition(phase.profileSnapshot),
          policyDefinition(incoming)
        ))
    )
      continue;
    pending.push({ phase, incoming, phaseCorrections, profilePhaseIndex });
  }
  const fingerprints = await Promise.all(
    pending.map(
      async ({ phase, incoming, phaseCorrections, profilePhaseIndex }) => {
        if (
          !phaseCorrections.length &&
          (
            await resolveProfileApplicability(
              config,
              phase,
              selection,
              profilePhaseIndex
            )
          ).kind === 'not_applicable'
        )
          return undefined;
        const bytes = new TextEncoder().encode(
          canonicalProfileContent({
            source: selection.source ?? 'catalog',
            firmId: selection.firmId,
            challengeId: selection.challenge.id,
            phase: policyDefinition(incoming),
            ...(phaseCorrections.length
              ? {
                  corrections: phaseCorrections.map(
                    ({ correction, periods, blocked }) => ({
                      replacement: correction.replacement,
                      affectedFrom: correction.affectedFrom,
                      affectedUntil: correction.affectedUntil,
                      periods,
                      blocked,
                      before: periods.map((period) => {
                        const policy = period.from
                          ? policyAt(phase, new Date(period.from))
                          : phase;
                        return {
                          rules: policy.rules.map(ruleDefinition),
                          payoutPolicy: policy.payoutPolicy,
                        };
                      }),
                    })
                  ),
                }
              : {}),
          })
        );
        const hash = await crypto.subtle.digest('SHA-256', bytes);
        const fingerprint = Array.from(new Uint8Array(hash), (byte) =>
          byte.toString(16).padStart(2, '0')
        ).join('');
        return { phaseId: phase.id, fingerprint };
      }
    )
  );
  for (const entry of fingerprints) {
    if (!entry) continue;
    result.changed[entry.phaseId] = entry.fingerprint;
    if (config.profileUpdateDismissals?.[entry.phaseId] !== entry.fingerprint)
      result.unreviewedPhaseIds.push(entry.phaseId);
  }
  return result;
}

export function retainCurrentProfileRules(
  config: PropChallengeConfig,
  comparison: ProfileNoticeComparison
): PropChallengeConfig {
  return {
    ...config,
    profileUpdateDismissals: {
      ...config.profileUpdateDismissals,
      ...comparison.changed,
    },
  };
}
