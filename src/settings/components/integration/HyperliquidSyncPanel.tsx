import React from 'react';
import { t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';
import { BrokerStatusPlaceholder } from './brokerSyncKit/BrokerLayout';
import { OAuthBrokerSyncPanelContent } from './oauthBrokerSyncPanel/OAuthBrokerSyncPanelContent';
import {
  useHyperliquidAvailability,
  useHyperliquidSyncPanelModel,
} from './useHyperliquidSyncPanelModel';

const HyperliquidSyncPanelContent: React.FC<{
  plugin: JournalitPlugin;
  canCreateConnections: boolean;
}> = ({ plugin, canCreateConnections }) => {
  const model = useHyperliquidSyncPanelModel(plugin);
  return (
    <OAuthBrokerSyncPanelContent
      {...model}
      canCreateConnections={canCreateConnections}
    />
  );
};

HyperliquidSyncPanelContent.displayName = 'HyperliquidSyncPanelContent';

export const HyperliquidSyncPanel: React.FC<{ plugin: JournalitPlugin }> = ({
  plugin,
}) => {
  const availability = useHyperliquidAvailability();
  if (availability.kind === 'checking') {
    return <BrokerStatusPlaceholder message={t('common.loading')} />;
  }
  if (availability.kind === 'disabled') {
    return (
      <BrokerStatusPlaceholder
        role="status"
        message={t('trade-sync.hyperliquid.disabled')}
      />
    );
  }
  return (
    <HyperliquidSyncPanelContent
      plugin={plugin}
      canCreateConnections={availability.eligible}
    />
  );
};

HyperliquidSyncPanel.displayName = 'HyperliquidSyncPanel';
