

import type JournalitPlugin from '../../main';
import type { SessionPhaseWatcher } from './SessionPhaseWatcher';

const SESSION_PHASE_ATTRIBUTE = 'data-journalit-session-phase';


export function startSessionPhaseBodyAttribute(
  plugin: JournalitPlugin,
  watcher: SessionPhaseWatcher
): () => void {
  const body = plugin.app.workspace.rootSplit.doc.body;

  const applyPhase = (): void => {
    const phase = watcher.getSnapshot();
    if (phase) {
      body.setAttribute(SESSION_PHASE_ATTRIBUTE, phase);
      return;
    }
    body.removeAttribute(SESSION_PHASE_ATTRIBUTE);
  };

  applyPhase();
  const unsubscribe = watcher.subscribe(applyPhase);

  return () => {
    unsubscribe();
    body.removeAttribute(SESSION_PHASE_ATTRIBUTE);
  };
}
