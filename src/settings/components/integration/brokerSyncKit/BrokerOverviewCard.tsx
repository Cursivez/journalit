

import React from 'react';
import { Server } from '../../../../components/shared/icons/ObsidianIcon';
import { BrokerInlineHint } from './BrokerMappingHint';

interface BrokerOverviewCardLink {
  label: string;
  onClick: () => void;
}

interface BrokerOverviewCardProps {
  title: string;
  description: string;
  
  descriptionExtra?: React.ReactNode;
  manageLink: BrokerOverviewCardLink;
  actions: React.ReactNode;
  
  actionsHint?: string;
  
  footerLink?: BrokerOverviewCardLink;
}

export const BrokerOverviewCard: React.FC<BrokerOverviewCardProps> = ({
  title,
  description,
  descriptionExtra,
  manageLink,
  actions,
  actionsHint,
  footerLink,
}) => (
  <div className="status-card journalit-broker-overview-card">
    <div className="status-card-header journalit-broker-card-header">
      <span className="journalit-broker-card-header__title">
        <Server size={20} />
        <span>{title}</span>
      </span>
      <button
        type="button"
        className="journalit-broker-manage-link"
        onClick={manageLink.onClick}
      >
        {manageLink.label}
      </button>
    </div>
    <div className="status-card-content journalit-broker-overview-content">
      <p>{description}</p>
      {descriptionExtra}
    </div>
    <div className="status-card-actions journalit-broker-card-actions">
      {actions}
    </div>
    {actionsHint && <BrokerInlineHint message={actionsHint} />}
    {footerLink && (
      <div className="journalit-broker-docs-link-row">
        <button
          type="button"
          className="journalit-broker-manage-link"
          onClick={footerLink.onClick}
        >
          {footerLink.label}
        </button>
      </div>
    )}
  </div>
);

BrokerOverviewCard.displayName = 'BrokerOverviewCard';
