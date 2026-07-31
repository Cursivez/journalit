

import type { App } from 'obsidian';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FolderOpen, ArrowRight, Info } from '../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { showActionConfirmationModal } from '../shared/ConfirmationModal';

interface PathChangeInstructionContentProps {
  oldPath: string;
  newPath: string;
  hasExistingTrades: boolean;
}


const PathChangeInstructionComponent: React.FC<
  PathChangeInstructionContentProps
> = ({ oldPath, newPath, hasExistingTrades }) => {
  return (
    <div className="path-change-instruction-content">
      
      <div className="path-change-instruction-header">
        <FolderOpen size={24} className="path-change-instruction-header-icon" />
        <h2 className="path-change-instruction-title">
          {t('settings.general.path-change.title')}
        </h2>
      </div>

      
      <div className="path-change-instruction-path">
        <code className="path-change-instruction-path-code">{oldPath}</code>
        <ArrowRight size={16} className="path-change-instruction-path-arrow" />
        <code className="path-change-instruction-path-code">{newPath}</code>
      </div>

      
      <div className="path-change-instruction-instructions">
        <div className="path-change-instruction-alert">
          <Info size={16} className="path-change-instruction-alert-icon" />
          <div>
            <strong className="path-change-instruction-alert-title">
              {t('settings.general.path-change.new-trades-title')}
            </strong>
            <div className="path-change-instruction-alert-desc">
              {t('settings.general.path-change.new-trades-desc')}{' '}
              <code className="path-change-instruction-inline-code">
                {newPath}
              </code>
            </div>
          </div>
        </div>

        {hasExistingTrades && (
          <div className="path-change-instruction-manual">
            <strong className="path-change-instruction-manual-title">
              {t('settings.general.path-change.manual-title')}
            </strong>
            <div className="path-change-instruction-manual-desc">
              {t('settings.general.path-change.manual-desc')}
            </div>
            <ol className="path-change-instruction-steps">
              <li className="path-change-instruction-step">
                {t('settings.general.path-change.step.open-explorer')}
              </li>
              <li className="path-change-instruction-step">
                {t('settings.general.path-change.step.find-folder-prefix')}{' '}
                <code className="path-change-instruction-inline-code">
                  !Journalit
                </code>{' '}
                {t('settings.general.path-change.step.find-folder-suffix')}
              </li>
              <li className="path-change-instruction-step">
                {t('settings.general.path-change.step.drag-drop')}
              </li>
            </ol>
            <div className="path-change-instruction-note">
              {t('settings.general.path-change.manual-note')}
            </div>
          </div>
        )}

        <div className="path-change-instruction-sync">
          <strong>{t('settings.general.path-change.sync-title')}</strong>
          <div className="path-change-instruction-sync-desc">
            {t('settings.general.path-change.sync-desc')}
          </div>
        </div>
      </div>
    </div>
  );
};


export function openPathChangeInstructionModal(
  app: App,
  _plugin: JournalitPlugin,
  oldPath: string,
  newPath: string,
  hasExistingTrades: boolean,
  onConfirm: () => void | Promise<void>,
  onCancel?: () => void
): void {
  void showActionConfirmationModal(app, {
    cancelValue: false,
    renderContent: (contentEl) => {
      const container = contentEl.createDiv();
      const root = createRoot(container);
      root.render(
        <PathChangeInstructionComponent
          oldPath={oldPath}
          newPath={newPath}
          hasExistingTrades={hasExistingTrades}
        />
      );
      return () => root.unmount();
    },
    actions: [
      {
        value: false,
        label: t('settings.general.path-change.button.cancel'),
        variant: 'secondary',
        initialFocus: true,
      },
      {
        value: true,
        label: t('settings.general.path-change.button.confirm'),
        variant: 'primary',
      },
    ],
  }).then((confirmed) => {
    if (confirmed) {
      void onConfirm();
      return;
    }
    onCancel?.();
  });
}
