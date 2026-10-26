import type JournalitPlugin from '../../main';
import type { JournalitSettings } from '../../settings/types';
import type { TradeImportCapabilities, TradeImportDestination } from './types';


export function resolveTradeImportDestination(
  settings: Pick<JournalitSettings, 'csvImportDestinations'>,
  capabilities: Pick<TradeImportCapabilities, 'destinations' | 'brokers'>,
  brokerId: string
): TradeImportDestination | undefined {
  if (!capabilities.destinations.includes('backtest')) return undefined;
  return (
    settings.csvImportDestinations?.[brokerId] ??
    capabilities.brokers.find((broker) => broker.id === brokerId)
      ?.defaultDestination ??
    'live'
  );
}


export async function rememberTradeImportDestination(
  plugin: Pick<JournalitPlugin, 'settings' | 'saveSettings'>,
  brokerId: string,
  destination: TradeImportDestination
): Promise<void> {
  const current = plugin.settings.csvImportDestinations ?? {};
  if (!brokerId || current[brokerId] === destination) return;
  plugin.settings.csvImportDestinations = {
    ...current,
    [brokerId]: destination,
  };
  await plugin.saveSettings();
}
