

import { useCallback, useEffect, useMemo, useState } from 'react';
import type JournalitPlugin from '../../main';
import type { TradeSyncSuggestion } from '../../services/onboarding/brokerCatalog';
import type { TradeImportSourceOption } from '../../services/tradeImport/tradeImportSources';
import {
  getTradeSyncConnectionPresence,
  type TradeSyncConnectionPresence,
} from '../../services/tradeSync/tradeSyncConnectionPresence';
import { writeTradeSyncProviderPreference } from '../../services/tradeSync/tradeSyncProviderPreference';
import { SETTINGS_TAB_IDS } from '../../settings/types';

interface TradeImportSyncCard {
  suggestion: TradeSyncSuggestion;
  sourceLabel: string;
  syncOnly: boolean;
}

interface Options {
  plugin: JournalitPlugin;
  
  sources: TradeImportSourceOption[];
  
  importSource: TradeImportSourceOption | undefined;
  
  syncOnlySource: TradeImportSourceOption | undefined;
  
  isFavoriteSource: boolean;
  
  formVisible: boolean;
}

export function useTradeImportSyncSuggestion({
  plugin,
  sources,
  importSource,
  syncOnlySource,
  isFavoriteSource,
  formVisible,
}: Options): {
  card: TradeImportSyncCard | null;
  openTradeSync: () => void;
} {
  
  
  
  
  
  const providers = useMemo(
    () => [
      ...new Set(
        sources.flatMap((option) =>
          option.tradeSync && !option.syncOnly
            ? [option.tradeSync.providerId]
            : []
        )
      ),
    ],
    [sources]
  );
  const [presence, setPresence] = useState<
    ReadonlyMap<string, TradeSyncConnectionPresence>
  >(new Map());
  useEffect(() => {
    let cancelled = false;
    for (const providerId of providers) {
      void getTradeSyncConnectionPresence(providerId).then((value) => {
        if (cancelled) return;
        setPresence((current) => new Map(current).set(providerId, value));
      });
    }
    return () => {
      cancelled = true;
    };
  }, [providers]);

  
  const source =
    syncOnlySource ??
    (importSource?.tradeSync && !isFavoriteSource ? importSource : undefined);
  const suggestion = source?.tradeSync;
  const providerId = suggestion?.providerId;

  const openTradeSync = useCallback(() => {
    if (!providerId) return;
    writeTradeSyncProviderPreference(plugin.app, providerId);
    plugin.openSettingsToTab(SETTINGS_TAB_IDS.TRADE_SYNC);
  }, [plugin, providerId]);

  if (!source || !suggestion) return { card: null, openTradeSync };
  const card = { suggestion, sourceLabel: source.label };
  
  if (syncOnlySource)
    return { card: { ...card, syncOnly: true }, openTradeSync };
  
  
  const status = presence.get(suggestion.providerId);
  const visible = formVisible && status !== undefined && status !== 'connected';
  return {
    card: visible ? { ...card, syncOnly: false } : null,
    openTradeSync,
  };
}
