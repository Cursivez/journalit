

import type { SessionModePhaseState } from '../types/sessionMode';
import {
  SESSION_MODE_EMPTY_GUIDE_ID,
  SESSION_MODE_LIVE_GUIDE_ID,
  SESSION_MODE_PREPARATION_GUIDE_ID,
} from './sessionModeGuideIds';

export function resolveSessionModeGuideId(
  phase: SessionModePhaseState['phase']
): string | null {
  switch (phase) {
    case 'unconfigured':
      return SESSION_MODE_EMPTY_GUIDE_ID;
    case 'preparation':
      return SESSION_MODE_PREPARATION_GUIDE_ID;
    case 'live':
      return SESSION_MODE_LIVE_GUIDE_ID;
    case 'ended':
    case 'waiting':
    case 'break':
      return null;
    default: {
      
      
      const exhaustive: never = phase;
      return exhaustive;
    }
  }
}
