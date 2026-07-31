

import type { App } from 'obsidian';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle } from '../shared/icons/ObsidianIcon';
import { t } from '../../lang/helpers';
import { showActionConfirmationModal } from '../shared/ConfirmationModal';

interface TemplateSwitchWarningOptions {
  fromTemplateName: string;
  toTemplateName: string;
  hasContent: boolean;
}


const TemplateSwitchWarningContent: React.FC<TemplateSwitchWarningOptions> =
  React.memo(({ fromTemplateName, toTemplateName, hasContent }) => {
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
      </div>
    );
  });

TemplateSwitchWarningContent.displayName = 'TemplateSwitchWarningContent';


export function showTemplateSwitchWarning(
  app: App,
  fromTemplateName: string,
  toTemplateName: string,
  hasContent: boolean
): Promise<boolean> {
  return showActionConfirmationModal(app, {
    cancelValue: false,
    renderContent: (contentEl) => {
      const container = contentEl.createDiv();
      const root = createRoot(container);
      root.render(
        <TemplateSwitchWarningContent
          fromTemplateName={fromTemplateName}
          toTemplateName={toTemplateName}
          hasContent={hasContent}
        />
      );
      return () => root.unmount();
    },
    actions: [
      {
        value: false,
        label: t('button.cancel'),
        variant: 'secondary',
        initialFocus: true,
      },
      {
        value: true,
        label: t('modal.template-switch.button.switch'),
        variant: 'primary',
      },
    ],
  });
}
