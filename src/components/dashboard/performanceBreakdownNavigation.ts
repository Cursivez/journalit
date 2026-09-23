import type JournalitPlugin from '../../main';
import type { AnalyticsDateBasis } from '../../settings/types';
import { openTradeLogWithFilters } from '../../utils/openTradeLogWithFilters';
import type { FilterState } from './dashboardTypes';
import type { Trade } from './utils/dataUtils';
import { createDashboardTradeLogDrilldownFilters } from './tradeLogDrilldown';
import type { PerformanceGroupExtractor } from './components/DashboardWidgets/performanceBreakdownUtils';
import type { PerformanceBreakdownKind } from './components/DashboardWidgets/usePerformanceBreakdownPreferences';

interface OpenPerformanceBreakdownTargetOptions {
  plugin: JournalitPlugin;
  kind: PerformanceBreakdownKind;
  label: string;
  filters: FilterState;
  analyticsDateBasis: AnalyticsDateBasis;
  sourceTrades: readonly Trade[];
  getGroups: PerformanceGroupExtractor;
}

function getTickerInstruments(
  label: string,
  sourceTrades: readonly Trade[],
  getGroups: PerformanceGroupExtractor
): string[] {
  const instruments = new Set<string>();
  for (const trade of sourceTrades) {
    let matchesGroup = false;
    for (const group of getGroups(trade)) {
      if (group === label) {
        matchesGroup = true;
        break;
      }
    }
    if (!matchesGroup) continue;
    const instrument = trade.instrument?.trim();
    if (instrument) instruments.add(instrument);
  }
  return [...instruments];
}

export async function openDashboardPerformanceBreakdownTarget({
  plugin,
  kind,
  label,
  filters,
  analyticsDateBasis,
  sourceTrades,
  getGroups,
}: OpenPerformanceBreakdownTargetOptions): Promise<void> {
  try {
    switch (kind) {
      case 'setup': {
        const setupService = await plugin.serviceManager.getSetupService();
        const resolution = await setupService.resolveSetupRef(label);
        if (resolution.kind !== 'resolved' || !resolution.setup) return;

        const setup = resolution.setup;
        await plugin.viewManager.openSetupsView({
          page: 'detail',
          setupId: setup.id,
          setupName: setup.name,
          setupPath: setup.filePath,
        });
        return;
      }
      case 'ticker': {
        const tickers = getTickerInstruments(label, sourceTrades, getGroups);
        if (tickers.length === 0) return;
        await openTradeLogWithFilters(
          plugin,
          createDashboardTradeLogDrilldownFilters(filters, {
            analyticsDateBasis,
            tickers,
          })
        );
        return;
      }
      case 'tag':
        await openTradeLogWithFilters(
          plugin,
          createDashboardTradeLogDrilldownFilters(filters, {
            analyticsDateBasis,
            tags: [label],
          })
        );
        return;
      default: {
        const _exhaustive: never = kind;
        return _exhaustive;
      }
    }
  } catch (error) {
    console.error(
      '[Journalit] Failed to open performance chart destination:',
      error
    );
  }
}
