import type {
  PropChallengeConfig,
  PropChallengePhase,
  PropFirmProfilePhase,
  PropFirmProfileSelection,
} from './types';

function sameIdentity(left: PropFirmProfilePhase, right: PropFirmProfilePhase) {
  return (
    left.name === right.name &&
    left.stage === right.stage &&
    left.startingBalance === right.startingBalance
  );
}


export function matchesSavedProfilePhase(
  config: PropChallengeConfig,
  phase: PropChallengePhase,
  selection: PropFirmProfileSelection,
  sourcePhaseIndex: number
): boolean {
  const snapshot = phase.profileSnapshot;
  const incoming = selection.challenge.phases[sourcePhaseIndex];
  if (!incoming) return false;
  if (!snapshot) return true; 
  return (
    sameIdentity(snapshot, incoming) &&
    selection.challenge.phases.filter((item) => sameIdentity(snapshot, item))
      .length === 1 &&
    config.phases.filter(
      (item) =>
        item.profileSnapshot && sameIdentity(snapshot, item.profileSnapshot)
    ).length === 1
  );
}
