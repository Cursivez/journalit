import React from 'react';
import type { App } from 'obsidian';
import { createRoot } from 'react-dom/client';
import type {
  PropChallengeConfig,
  PropChallengePhase,
} from '../../../../services/propChallenge/types';
import { DisplayPolicyProvider } from '../../../../contexts/DisplayPolicyContext';
import { t } from '../../../../lang/helpers';
import { showActionConfirmationModal } from '../../../shared/ConfirmationModal';
import { CorrectionAuditHistory } from './CorrectionAuditHistory';


export function openCorrectionHistoryModal({
  app,
  config,
  phase,
}: {
  app: App;
  config: PropChallengeConfig;
  phase: Pick<PropChallengePhase, 'id' | 'name'>;
}): void {
  if (!config.correctionHistory?.some((audit) => audit.before.id === phase.id))
    return;
  const snapshot = structuredClone(config);
  void showActionConfirmationModal(app, {
    title: `${t('account.profiles.correction-history')} · ${phase.name}`,
    cancelValue: 'close',
    actions: [{ value: 'close', label: t('button.close'), initialFocus: true }],
    renderContent: (container) => {
      const root = createRoot(
        container.createDiv({ cls: 'journalit-correction-history' })
      );
      root.render(
        <DisplayPolicyProvider>
          <CorrectionAuditHistory config={snapshot} phaseId={phase.id} />
        </DisplayPolicyProvider>
      );
      return () => root.unmount();
    },
  });
}
