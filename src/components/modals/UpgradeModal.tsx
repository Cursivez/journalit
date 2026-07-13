import { App, Modal } from 'obsidian';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Zap, Lightbulb } from '../shared/icons/ObsidianIcon';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import { UPGRADE_URLS } from '../../constants';
import { openExternalUrl } from '../../utils/externalLinks';
import { Button } from '../ui/Button';

interface UpgradeModalProps {
  app: App;
  plugin: JournalitPlugin;
  featureName: string;
  onModalClose?: () => void;
}

class UpgradeModal extends Modal {
  private props: UpgradeModalProps;
  private container: HTMLDivElement;
  private root: Root | null = null;

  constructor(props: UpgradeModalProps) {
    super(props.app);
    this.props = props;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    this.container = contentEl.createDiv();
    this.root = createRoot(this.container);
    this.root.render(
      <UpgradeComponent {...this.props} onClose={() => this.close()} />
    );

    contentEl.addClass('upgrade-modal');
    contentEl.addClass('jl-modal-container');
  }

  onClose() {
    if (this.root) {
      this.root.unmount();
    }
    
    if (this.props.onModalClose) {
      this.props.onModalClose();
    }
  }
}

const UpgradeComponent: React.FC<
  UpgradeModalProps & { onClose: () => void }
> = ({ featureName, onClose }) => {
  const handleUpgrade = () => {
    openExternalUrl(UPGRADE_URLS.genericUpgradeModal);
    onClose();
  };

  return (
    <div className="upgrade-modal-content">
      
      <div className="upgrade-modal-header">
        <div className="upgrade-modal-icon">
          <Zap size={20} />
        </div>
        <h2 className="upgrade-modal-title">{t('upgrade.title')}</h2>
      </div>

      
      <p className="upgrade-modal-message">
        {t('upgrade.feature-message', { featureName })}
      </p>

      
      <div className="upgrade-modal-benefits">
        <h3 className="upgrade-modal-benefits-title">
          {t('upgrade.benefits-title')}
        </h3>
        <ul className="upgrade-modal-benefits-list">
          <li>{t('upgrade.benefit.csv')}</li>
          <li>{t('upgrade.benefit.templates')}</li>
          <li>{t('upgrade.benefit.mt5')}</li>
          <li>{t('upgrade.benefit.multi-account')}</li>
          <li>{t('upgrade.benefit.analytics')}</li>
          <li>{t('upgrade.benefit.layouts')}</li>
        </ul>
      </div>

      
      <p className="upgrade-modal-trial">
        <Lightbulb size={16} className="upgrade-modal-trial-icon" />
        <span>{t('upgrade.trial-notice')}</span>
      </p>

      
      <div className="upgrade-modal-actions">
        <Button variant="plain" onClick={onClose}>
          {t('button.maybe-later')}
        </Button>
        <Button variant="primary" onClick={handleUpgrade}>
          {t('button.upgrade-now')}
        </Button>
      </div>
    </div>
  );
};

export function openUpgradeModal(
  app: App,
  plugin: JournalitPlugin,
  featureName: string,
  onModalClose?: () => void
): void {
  const modal = new UpgradeModal({
    app,
    plugin,
    featureName,
    onModalClose,
  });
  modal.open();
}
