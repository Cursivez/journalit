import React, { useSyncExternalStore } from 'react';
import { usePlugin } from '../../hooks/usePlugin';
import { t } from '../../lang/helpers';
import type { DemoSessionSnapshot } from '../../demo/DemoSessionService';
import { FlaskConical } from './icons/ObsidianIcon';

const INACTIVE_SNAPSHOT: DemoSessionSnapshot = {
  active: false,
  busy: false,
  phase: 'idle',
  root: null,
  progress: null,
};
const NOOP_SUBSCRIBE = (): (() => void) => () => undefined;
const GET_INACTIVE_SNAPSHOT = () => INACTIVE_SNAPSHOT;

export const SampleJournalEntryButton: React.FC = () => {
  const plugin = usePlugin();
  const session = plugin?.demoSessionService;
  const snapshot = useSyncExternalStore(
    session?.subscribe ?? NOOP_SUBSCRIBE,
    session?.getSnapshot ?? GET_INACTIVE_SNAPSHOT,
    session?.getSnapshot ?? GET_INACTIVE_SNAPSHOT
  );

  if (!session || snapshot.active || session.hasRecoverableSession()) {
    return null;
  }

  return (
    <button
      type="button"
      className="journalit-empty-state-secondary-action-button"
      onClick={() => void session.startOrOpen()}
      disabled={snapshot.busy}
    >
      <FlaskConical size={16} className="journalit-empty-state-action-icon" />
      {t('sample.action.try')}
    </button>
  );
};
