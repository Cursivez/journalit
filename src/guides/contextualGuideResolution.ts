

import type { PersistedGuideState } from './types';

export interface ContextualGuideCandidate {
  guideId: string;
  
  active: boolean;
}

interface ResolveContextualGuideInput {
  baseGuideId: string;
  contextualGuides: readonly ContextualGuideCandidate[];
  
  activeSessionGuideId: string | null;
  getPersistedState: (guideId: string) => PersistedGuideState | null;
}

const isFinishedGuideState = (state: PersistedGuideState | null): boolean =>
  state?.status === 'completed' || state?.status === 'skipped';

export function resolveContextualGuideId({
  baseGuideId,
  contextualGuides,
  activeSessionGuideId,
  getPersistedState,
}: ResolveContextualGuideInput): string {
  if (activeSessionGuideId === baseGuideId) {
    return baseGuideId;
  }

  let finishedActiveGuideId: string | null = null;
  for (const candidate of contextualGuides) {
    if (!candidate.active) continue;
    if (activeSessionGuideId === candidate.guideId) return candidate.guideId;
    if (!isFinishedGuideState(getPersistedState(candidate.guideId))) {
      return candidate.guideId;
    }
    finishedActiveGuideId ??= candidate.guideId;
  }

  return finishedActiveGuideId ?? baseGuideId;
}
