import React from 'react';
import type JournalitPlugin from '../../../main';
import { RithmicSyncPanelContent } from './RithmicSyncPanelContent';
import { useRithmicSyncPanelModel } from './useRithmicSyncPanelModel';

export const RithmicSyncPanel: React.FC<{ plugin: JournalitPlugin }> = ({
  plugin,
}) => {
  const model = useRithmicSyncPanelModel(plugin);
  return <RithmicSyncPanelContent {...model} />;
};

RithmicSyncPanel.displayName = 'RithmicSyncPanel';
