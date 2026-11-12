import React, { useState } from 'react';
import type JournalitPlugin from '../../../main';
import { getSettingsPath } from '../../settingsControlWrites';
import { ItemManager } from '../shared/ItemManager';

type ReviewItemListProps = Omit<
  React.ComponentProps<typeof ItemManager>,
  'items' | 'onItemsChange'
> & {
  plugin: JournalitPlugin;
};


function readSavedItems(
  plugin: JournalitPlugin,
  settingsPath: string
): string[] {
  const value = getSettingsPath(plugin.settings, settingsPath);
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}


export function ReviewItemList(props: ReviewItemListProps) {
  const [items, setItems] = useState(() =>
    readSavedItems(props.plugin, props.settingsPath)
  );
  return <ItemManager {...props} items={items} onItemsChange={setItems} />;
}
