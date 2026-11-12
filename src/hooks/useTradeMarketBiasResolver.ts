

import { useCallback, useEffect, useRef, useState } from 'react';
import type JournalitPlugin from '../main';
import { usePlugin } from './usePlugin';
import { useEventBus } from './useEventBus';
import {
  createPluginTradeMarketBiasResolver,
  loadMarketBiasServices,
  type MarketBiasServices,
} from '../services/marketBias/loadTradeMarketBiasResolver';
import type { TradeMarketBiasResolver } from '../services/marketBias/tradeMarketBias';

interface LoadedResolver {
  services: MarketBiasServices;
  resolver: TradeMarketBiasResolver;
}


function tradePlacementKey(plugin: JournalitPlugin): string {
  const trade = plugin.settings.trade;
  return `${String(trade.tradingDayCutoffTime)}|${String(trade.weekStartDay)}`;
}

export function useTradeMarketBiasResolver(): TradeMarketBiasResolver | null {
  const plugin = usePlugin();
  const [loaded, setLoaded] = useState<LoadedResolver | null>(null);
  const placementKey = useRef<string | null>(null);

  
  const rebuild = useCallback(() => {
    if (!plugin) return;
    setLoaded((current) =>
      current
        ? {
            services: current.services,
            resolver: createPluginTradeMarketBiasResolver(
              plugin,
              current.services
            ),
          }
        : current
    );
  }, [plugin]);

  useEventBus('market-bias:changed', rebuild);
  useEventBus('folder-path:changed', rebuild);
  useEventBus('settings:changed', () => {
    if (!plugin) return;
    const key = tradePlacementKey(plugin);
    if (key === placementKey.current) return;
    placementKey.current = key;
    rebuild();
  });

  useEffect(() => {
    if (!plugin) return;
    let cancelled = false;
    placementKey.current = tradePlacementKey(plugin);
    loadMarketBiasServices(plugin)
      .then((services) => {
        if (cancelled) return;
        setLoaded({
          services,
          resolver: createPluginTradeMarketBiasResolver(plugin, services),
        });
      })
      .catch((error: unknown) => {
        console.error(
          '[useTradeMarketBiasResolver] Failed to load review services:',
          error
        );
      });
    return () => {
      cancelled = true;
    };
  }, [plugin]);

  return loaded?.resolver ?? null;
}
