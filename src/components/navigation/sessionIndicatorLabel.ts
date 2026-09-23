

import { t } from '../../lang/helpers';
import type { SessionIndicatorPhase } from '../../services/sessionMode/SessionPhaseWatcher';

export function getSessionIndicatorLabel(
  phase: Exclude<SessionIndicatorPhase, null>
): string {
  return phase === 'live'
    ? t('session-mode.title.live')
    : t('session-mode.title.preparation');
}
