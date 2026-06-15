

import { App, Modal } from 'obsidian';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { AlertTriangle } from '../shared/icons/ObsidianIcon';
import { Button } from '../ui/Button';
import { t } from '../../lang/helpers';

interface TemplateSwitchWarningOptions {
  app: App;
  fromTemplateName: string;
  toTemplateName: string;
  hasContent: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

class TemplateSwitchWarningModal extends Modal {
  private options: TemplateSwitchWarningOptions;
  private root: Root | null = null;
  private confirmCalled = false;

  constructor(options: TemplateSwitchWarningOptions) {
    super(options.app);
    this.options = options;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    
    const container = contentEl.createDiv();
    this.root = createRoot(container);
    this.root.render(
      <TemplateSwitchWarningContent
        {...this.options}
        onClose={() => this.close()}
        markConfirmCalled={() => {
          this.confirmCalled = true;
        }}
      />
    );

    
    contentEl.addClass('template-switch-warning-modal');
    contentEl.addClass('jl-modal-container');
  }

  onClose() {
    
    if (!this.confirmCalled) {
      this.options.onCancel?.();
    }

    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}


const TemplateSwitchWarningContent: React.FC<
  TemplateSwitchWarningOptions & {
    onClose: () => void;
    markConfirmCalled: () => void;
  }
> = React.memo(
  ({
    fromTemplateName,
    toTemplateName,
    hasContent,
    onConfirm,
    onCancel,
    onClose,
    markConfirmCalled,
  }) => {
    const handleProceed = () => {
      markConfirmCalled();
      onConfirm();
      onClose();
    };

    const handleCancel = () => {
      markConfirmCalled();
      onCancel?.();
      onClose();
    };

    return (
      <div className="template-switch-warning-content">
        
        <div className="template-switch-warning-header">
          <AlertTriangle size={24} className="template-switch-warning-icon" />
          <h2 className="template-switch-warning-title">
            {t('modal.template-switch.title')}
          </h2>
        </div>

        
        <p className="template-switch-warning-description">
          {t('modal.template-switch.switching-from')}{' '}
          <strong>{fromTemplateName}</strong>{' '}
          {t('modal.template-switch.switching-to')}{' '}
          <strong>{toTemplateName}</strong>.
        </p>

        
        {hasContent && (
          <div className="template-switch-warning-alert">
            <div className="template-switch-warning-alert-content">
              <AlertTriangle
                size={16}
                className="template-switch-warning-alert-icon"
              />
              <div>
                <strong className="template-switch-warning-alert-title">
                  {t('modal.template-switch.has-content-title')}
                </strong>
                <div className="template-switch-warning-alert-text">
                  {t('modal.template-switch.has-content-desc')}
                </div>
              </div>
            </div>
          </div>
        )}

        
        <p className="template-switch-warning-note">
          {t('modal.template-switch.cannot-undo')}
        </p>

        
        <div className="template-switch-warning-actions">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="template-switch-warning-button--cancel"
          >
            {t('button.cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleProceed}
            className="template-switch-warning-button--confirm"
          >
            {t('modal.template-switch.button.switch')}
          </Button>
        </div>
      </div>
    );
  }
);

TemplateSwitchWarningContent.displayName = 'TemplateSwitchWarningContent';


export function showTemplateSwitchWarning(
  app: App,
  fromTemplateName: string,
  toTemplateName: string,
  hasContent: boolean
): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = new TemplateSwitchWarningModal({
      app,
      fromTemplateName,
      toTemplateName,
      hasContent,
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    });
    modal.open();
  });
}
