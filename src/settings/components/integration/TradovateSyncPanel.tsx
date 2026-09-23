import React from 'react';
import type JournalitPlugin from '../../../main';
import { OAuthBrokerSyncPanelContent } from './oauthBrokerSyncPanel';
import { useTradovateSyncPanelModel } from './useTradovateSyncPanelModel';

export const TradovateSyncPanel: React.FC<{ plugin: JournalitPlugin }> = ({
  plugin,
}) => {
  const model = useTradovateSyncPanelModel(plugin);
  return <OAuthBrokerSyncPanelContent {...model} canCreateConnections={true} />;
};

TradovateSyncPanel.displayName = 'TradovateSyncPanel';
