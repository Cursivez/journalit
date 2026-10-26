import type { PersonalPropFirmProfile } from './PersonalPropFirmProfiles';
import type {
  PropChallengeConfig,
  PropChallengePayoutPolicy,
  PropChallengePhase,
  PropChallengePolicyRevision,
  PropFirmCatalogCorrection,
  PropFirmProfilePhase,
} from './types';
import { isDisputedRule } from './PropChallengeRuleReview';

type ProfileTerms = Pick<PropFirmProfilePhase, 'rules' | 'payoutPolicy'>;

function payoutRequiresProtectedStorage(
  payoutPolicy: PropChallengePayoutPolicy | undefined
): boolean {
  return Boolean(payoutPolicy?.reviewRequired);
}


function profileTermsRequireProtectedStorage(
  phases: readonly ProfileTerms[]
): boolean {
  return phases.some(
    (phase) =>
      payoutRequiresProtectedStorage(phase.payoutPolicy) ||
      phase.rules.some(
        (rule) => rule.kind === 'manual_review' || isDisputedRule(rule)
      )
  );
}

function revisionRequiresProtectedStorage(
  revision: Pick<PropChallengePolicyRevision, 'rules' | 'payoutPolicy'>
): boolean {
  return profileTermsRequireProtectedStorage([revision]);
}

function correctionRequiresProtectedStorage(
  correction: PropFirmCatalogCorrection
): boolean {
  return profileTermsRequireProtectedStorage([correction.replacement]);
}

function phaseRequiresProtectedStorage(phase: PropChallengePhase): boolean {
  return (
    profileTermsRequireProtectedStorage([phase]) ||
    phase.policyHistory?.some(revisionRequiresProtectedStorage) === true ||
    (phase.profileSnapshot !== undefined &&
      (profileTermsRequireProtectedStorage([phase.profileSnapshot]) ||
        phase.profileSnapshot.catalogCorrections?.some(
          correctionRequiresProtectedStorage
        ) === true))
  );
}


export function requiresProtectedChallengeStorage(
  config: PropChallengeConfig
): boolean {
  return (
    config.phases.some(phaseRequiresProtectedStorage) ||
    config.correctionHistory?.some(
      (audit) =>
        phaseRequiresProtectedStorage(audit.before) ||
        phaseRequiresProtectedStorage(audit.after) ||
        correctionRequiresProtectedStorage(audit.correction)
    ) === true
  );
}

export function requiresProtectedPersonalProfileStorage(
  profiles: readonly PersonalPropFirmProfile[]
): boolean {
  return profiles.some((profile) =>
    profile.challenge.phases.some(
      (phase) =>
        profileTermsRequireProtectedStorage([phase]) ||
        phase.catalogCorrections?.some(correctionRequiresProtectedStorage) ===
          true
    )
  );
}
