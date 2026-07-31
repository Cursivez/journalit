import React from 'react';
import type JournalitPlugin from '../../../main';
import { TradovateSyncPanelContent } from './TradovateSyncPanelContent';
import { useTradovateSyncPanelModel } from './useTradovateSyncPanelModel';

export const TradovateSyncPanel: React.FC<{ plugin: JournalitPlugin }> = ({
  plugin,
}) => {
  const model = useTradovateSyncPanelModel(plugin);
  return <TradovateSyncPanelContent {...model} />;
};

TradovateSyncPanel.displayName = 'TradovateSyncPanel';
