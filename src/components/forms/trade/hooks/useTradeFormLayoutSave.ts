import { useRef, useState } from 'react';
import { Notice } from 'obsidian';
import type JournalitPlugin from '../../../../main';
import { t } from '../../../../lang/helpers';
import { eventBus } from '../../../../services/events/EventBus';
import {
  resolveTradeFormLayoutSettings,
  type TradeFormLayoutSettings,
} from '../../../../settings/types';

interface TradeFormLayoutSaveOptions {
  plugin: JournalitPlugin;
  applySavedLayout: (layout: TradeFormLayoutSettings) => void;
  onSave?: (layout: TradeFormLayoutSettings) => void;
  savingStateRef?: { current: boolean };
}


export function useTradeFormLayoutSave({
  plugin,
  applySavedLayout,
  onSave,
  savingStateRef,
}: TradeFormLayoutSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const saveInFlightRef = useRef(false);

  const saveLayout = async (layout: TradeFormLayoutSettings) => {
    if (saveInFlightRef.current) return;
    const resolvedLayout = resolveTradeFormLayoutSettings(layout);
    const previousLayout = plugin.settings.trade.tradeFormLayout;
    saveInFlightRef.current = true;
    if (savingStateRef) savingStateRef.current = true;
    try {
      setIsSaving(true);
      plugin.settings.trade.tradeFormLayout = resolvedLayout;
      try {
        await plugin.saveSettings();
      } catch (error) {
        
        if (plugin.settings.trade.tradeFormLayout === resolvedLayout) {
          plugin.settings.trade.tradeFormLayout = previousLayout;
        }
        throw error;
      }
      applySavedLayout(resolvedLayout);
      eventBus.publish('settings:changed', {
        section: 'trade',
        source: 'trade-form-layout',
      });
      new Notice(t('form.layout.saved'));
      onSave?.(resolvedLayout);
    } catch (error) {
      console.error('Failed to save trade form layout settings:', error);
      const message = error instanceof Error ? error.message : String(error);
      new Notice(t('notice.error.save-settings', { error: message }));
    } finally {
      saveInFlightRef.current = false;
      if (savingStateRef) savingStateRef.current = false;
      setIsSaving(false);
    }
  };

  return { isSaving, saveLayout };
}
