

import { App, Modal } from 'obsidian';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FolderOpen, ArrowRight, Info } from '../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../main';
import { Button } from '../ui/Button';
import { t } from '../../lang/helpers';

interface PathChangeInstructionModalProps {
  app: App;
  plugin: JournalitPlugin;
  oldPath: string;
  newPath: string;
  hasExistingTrades: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  onClose: () => void;
}


class PathChangeInstructionModal extends Modal {
  private props: PathChangeInstructionModalProps;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(props: PathChangeInstructionModalProps) {
    super(props.app);
    this.props = props;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    
    this.container = contentEl.createDiv();
    this.root = createRoot(this.container);
    this.root.render(
      <PathChangeInstructionComponent
        {...this.props}
        onClose={() => this.close()}
      />
    );

    
    contentEl.addClass('path-change-instruction-modal');
    contentEl.classList.add('jl-modal-container');
  }

  onClose() {
    if (this.root) {
      this.root.unmount();
    }
  }
}

const PathChangeInstructionComponent: React.FC<
  PathChangeInstructionModalProps
> = ({
  app: _app,
  plugin: _plugin,
  oldPath,
  newPath,
  hasExistingTrades,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const handleConfirm = () => {
    void onConfirm();
    onClose();
  };

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

      
      <div className="path-change-instruction-actions">
        <Button
          variant="secondary"
          onClick={() => {
            onCancel();
            onClose();
          }}
          className="path-change-instruction-button--cancel"
        >
          {t('settings.general.path-change.button.cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          className="path-change-instruction-button--confirm"
        >
          {t('settings.general.path-change.button.confirm')}
        </Button>
      </div>
    </div>
  );
};


export function openPathChangeInstructionModal(
  app: App,
  plugin: JournalitPlugin,
  oldPath: string,
  newPath: string,
  hasExistingTrades: boolean,
  onConfirm: () => void | Promise<void>,
  onCancel?: () => void
): void {
  const modal = new PathChangeInstructionModal({
    app,
    plugin,
    oldPath,
    newPath,
    hasExistingTrades,
    onConfirm,
    onCancel: onCancel || (() => {}),
    onClose: () => {}, 
  });
  modal.open();
}
