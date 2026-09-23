import React from 'react';
import type JournalitPlugin from '../../../main';
import { OAuthBrokerSyncPanelContent } from './oauthBrokerSyncPanel';
import { useCTraderSyncPanelModel } from './useCTraderSyncPanelModel';

export const CTraderSyncPanel: React.FC<{
  plugin: JournalitPlugin;
  canCreateConnections: boolean;
  onCatalogLoaded: (hasConnections: boolean) => void;
}> = ({ plugin, canCreateConnections, onCatalogLoaded }) => {
  const model = useCTraderSyncPanelModel(plugin, onCatalogLoaded);
  return (
    <OAuthBrokerSyncPanelContent
      {...model}
      canCreateConnections={canCreateConnections}
    />
  );
};

CTraderSyncPanel.displayName = 'CTraderSyncPanel';
